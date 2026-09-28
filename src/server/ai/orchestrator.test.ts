import { generate } from "@/server/ai/orchestrator";
import { AIProviderError } from "@/server/ai/errors";
import type { AIRequestConfig, AIResponse } from "@/server/ai/types";

// ---------------------------------------------------------------------------
// Mock the provider registry so tests don't need real API keys
// ---------------------------------------------------------------------------

const mockGenerateResponse = jest.fn();
const mockStreamResponse = jest.fn();

jest.mock("@/server/ai/provider-registry", () => ({
  getProviderForModel: jest.fn().mockReturnValue({
    name: "mock",
    generateResponse: (...args: unknown[]) => mockGenerateResponse(...args),
    streamResponse: (...args: unknown[]) => mockStreamResponse(...args),
  }),
}));

import { getProviderForModel } from "@/server/ai/provider-registry";

const asMock = (fn: unknown) => fn as jest.Mock;

function makeConfig(overrides?: Partial<AIRequestConfig>): AIRequestConfig {
  return {
    model: "gemini-1.5-flash",
    systemPrompt: "You are helpful.",
    messages: [{ role: "user", content: "Hello" }],
    temperature: 0.7,
    ...overrides,
  };
}

function makeResponse(overrides?: Partial<AIResponse>): AIResponse {
  return {
    content: "Hi there!",
    provider: "mock",
    modelUsed: "gemini-1.5-flash",
    usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 },
    finishReason: "stop",
    latencyMs: 100,
    ...overrides,
  };
}

describe("AI Orchestrator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateResponse.mockResolvedValue(makeResponse());
    asMock(getProviderForModel).mockReturnValue({
      name: "mock",
      generateResponse: (...args: unknown[]) => mockGenerateResponse(...args),
      streamResponse: (...args: unknown[]) => mockStreamResponse(...args),
    });
  });

  // -----------------------------------------------------------------------
  // Successful execution
  // -----------------------------------------------------------------------

  it("generates a response for a valid request", async () => {
    const response = await generate(makeConfig());

    expect(response.content).toBe("Hi there!");
    expect(response.provider).toBe("mock");
    expect(response.finishReason).toBe("stop");
  });

  it("normalizes the response with correct metadata", async () => {
    const response = await generate(makeConfig());

    expect(response.usage).toEqual({
      promptTokens: 10,
      completionTokens: 5,
      totalTokens: 15,
    });
    expect(typeof response.latencyMs).toBe("number");
    expect(response.modelUsed).toBe("gemini-1.5-flash");
  });

  it("passes the normalized config to the provider", async () => {
    await generate(makeConfig({ model: "mock", temperature: 0.5 }));

    expect(mockGenerateResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "mock",
        temperature: 0.5,
        systemPrompt: "You are helpful.",
      })
    );
  });

  // -----------------------------------------------------------------------
  // Model validation
  // -----------------------------------------------------------------------

  it("rejects an unsupported model", async () => {
    // getProviderForModel is mocked — but the orchestrator validates first
    // via the real getAIModel, so we need to bypass the mock for this test
    // by using a model ID that doesn't exist in the registry.
    asMock(getProviderForModel).mockImplementation(() => {
      throw new AIProviderError({
        provider: "unknown",
        code: "UNKNOWN_MODEL",
        message: 'Model "nonexistent" is not registered',
      });
    });

    await expect(generate(makeConfig({ model: "nonexistent" }))).rejects.toThrow(
      AIProviderError
    );

    try {
      await generate(makeConfig({ model: "nonexistent" }));
    } catch (error) {
      expect((error as AIProviderError).code).toBe("UNSUPPORTED_MODEL");
    }
  });

  // -----------------------------------------------------------------------
  // Request validation
  // -----------------------------------------------------------------------

  it("rejects empty messages array", async () => {
    await expect(generate(makeConfig({ messages: [] }))).rejects.toThrow(
      AIProviderError
    );

    try {
      await generate(makeConfig({ messages: [] }));
    } catch (error) {
      expect((error as AIProviderError).code).toBe("EMPTY_MESSAGES");
    }
  });

  it("rejects temperature below 0", async () => {
    await expect(generate(makeConfig({ temperature: -1 }))).rejects.toThrow(
      AIProviderError
    );

    try {
      await generate(makeConfig({ temperature: -1 }));
    } catch (error) {
      expect((error as AIProviderError).code).toBe("INVALID_TEMPERATURE");
    }
  });

  it("rejects temperature above 2", async () => {
    await expect(generate(makeConfig({ temperature: 3 }))).rejects.toThrow(
      AIProviderError
    );
  });

  it("rejects negative maxTokens", async () => {
    await expect(generate(makeConfig({ maxTokens: -1 }))).rejects.toThrow(
      AIProviderError
    );

    try {
      await generate(makeConfig({ maxTokens: -1 }));
    } catch (error) {
      expect((error as AIProviderError).code).toBe("INVALID_MAX_TOKENS");
    }
  });

  it("rejects maxTokens exceeding model limit", async () => {
    // gemini-1.5-flash has maxTokens: 8192 in the registry
    await expect(generate(makeConfig({ maxTokens: 999999 }))).rejects.toThrow(
      AIProviderError
    );

    try {
      await generate(makeConfig({ maxTokens: 999999 }));
    } catch (error) {
      expect((error as AIProviderError).code).toBe("MAX_TOKENS_EXCEEDED");
    }
  });

  // -----------------------------------------------------------------------
  // Provider resolution
  // -----------------------------------------------------------------------

  it("resolves the provider through the provider registry", async () => {
    await generate(makeConfig({ model: "mock" }));

    expect(getProviderForModel).toHaveBeenCalledWith("mock");
  });

  // -----------------------------------------------------------------------
  // Provider error propagation
  // -----------------------------------------------------------------------

  it("propagates AIProviderError from the provider", async () => {
    const providerError = new AIProviderError({
      provider: "gemini",
      code: "GEMINI_API_ERROR",
      message: "Rate limited",
      retryable: true,
    });
    mockGenerateResponse.mockRejectedValue(providerError);

    await expect(generate(makeConfig())).rejects.toThrow(AIProviderError);

    try {
      await generate(makeConfig());
    } catch (error) {
      const e = error as AIProviderError;
      expect(e.provider).toBe("gemini");
      expect(e.code).toBe("GEMINI_API_ERROR");
      expect(e.retryable).toBe(true);
    }
  });

  it("wraps unexpected errors as AIProviderError", async () => {
    mockGenerateResponse.mockRejectedValue(new Error("Unexpected failure"));

    await expect(generate(makeConfig())).rejects.toThrow(AIProviderError);

    try {
      await generate(makeConfig());
    } catch (error) {
      const e = error as AIProviderError;
      expect(e.code).toBe("ORCHESTRATOR_ERROR");
      expect(e.retryable).toBe(false);
    }
  });

  it("propagates missing API key errors", async () => {
    const keyError = new AIProviderError({
      provider: "gemini",
      code: "MISSING_API_KEY",
      message: "GEMINI_API_KEY is not configured",
    });
    asMock(getProviderForModel).mockImplementation(() => {
      throw keyError;
    });

    await expect(generate(makeConfig())).rejects.toThrow(AIProviderError);

    try {
      await generate(makeConfig());
    } catch (error) {
      expect((error as AIProviderError).code).toBe("MISSING_API_KEY");
    }
  });

  // -----------------------------------------------------------------------
  // Security: no key leakage
  // -----------------------------------------------------------------------

  it("sanitizes API keys from error messages", async () => {
    mockGenerateResponse.mockRejectedValue(
      new Error("key AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567 failed and sk-or-v1-abc123 too")
    );

    try {
      await generate(makeConfig());
    } catch (error) {
      const e = error as AIProviderError;
      expect(e.message).not.toContain("AIzaSy");
      expect(e.message).not.toContain("sk-or-");
      expect(e.message).toContain("[REDACTED]");
    }
  });

  // -----------------------------------------------------------------------
  // No fallback behavior
  // -----------------------------------------------------------------------

  it("does NOT silently fall back to mock on provider failure", async () => {
    const providerError = new AIProviderError({
      provider: "gemini",
      code: "GEMINI_API_ERROR",
      message: "Service unavailable",
      retryable: true,
    });
    mockGenerateResponse.mockRejectedValue(providerError);

    // Should throw, not silently return a mock response
    await expect(generate(makeConfig())).rejects.toThrow(AIProviderError);
  });
});
