import { OpenRouterProvider } from "@/server/ai/providers/openrouter.provider";
import { AIProviderError } from "@/server/ai/errors";
import type { AIRequestConfig } from "@/server/ai/types";

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

function makeConfig(overrides?: Partial<AIRequestConfig>): AIRequestConfig {
  return {
    model: "gpt-4o",
    systemPrompt: "You are helpful.",
    messages: [{ role: "user", content: "What is 2+2?" }],
    temperature: 0.7,
    ...overrides,
  };
}

function mockSuccessResponse(content: string) {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      choices: [{ message: { content }, finish_reason: "stop" }],
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      model: "openai/gpt-4o",
    }),
  };
}

describe("OpenRouterProvider", () => {
  const provider = new OpenRouterProvider("test-api-key");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("normalizes a successful response into AIResponse format", async () => {
    mockFetch.mockResolvedValue(mockSuccessResponse("4"));

    const response = await provider.generateResponse(makeConfig());

    expect(response.content).toBe("4");
    expect(response.provider).toBe("openrouter");
    expect(response.modelUsed).toBe("openai/gpt-4o");
    expect(response.finishReason).toBe("stop");
    expect(response.usage).toEqual({
      promptTokens: 10,
      completionTokens: 5,
      totalTokens: 15,
    });
    expect(typeof response.latencyMs).toBe("number");
  });

  it("sends correct headers including Authorization", async () => {
    mockFetch.mockResolvedValue(mockSuccessResponse("ok"));

    await provider.generateResponse(makeConfig());

    expect(mockFetch).toHaveBeenCalledWith(
      "https://openrouter.ai/api/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Authorization": "Bearer test-api-key",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("maps ConverseOS model IDs to OpenRouter model paths", async () => {
    mockFetch.mockResolvedValue(mockSuccessResponse("ok"));

    await provider.generateResponse(makeConfig({ model: "claude-3-5-sonnet" }));

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.model).toBe("anthropic/claude-3.5-sonnet");
  });

  it("normalizes HTTP errors into AIProviderError", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: "Rate limited" } }),
    });

    await expect(provider.generateResponse(makeConfig())).rejects.toThrow(
      AIProviderError
    );

    try {
      await provider.generateResponse(makeConfig());
    } catch (error) {
      const providerError = error as AIProviderError;
      expect(providerError.provider).toBe("openrouter");
      expect(providerError.code).toBe("OPENROUTER_API_ERROR");
      expect(providerError.retryable).toBe(true);
      expect(providerError.statusCode).toBe(429);
    }
  });

  it("does not leak API keys in error messages", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        error: { message: "Invalid key: sk-or-v1-abc123def456 is not valid" },
      }),
    });

    try {
      await provider.generateResponse(makeConfig());
    } catch (error) {
      const providerError = error as AIProviderError;
      expect(providerError.message).not.toContain("sk-or-");
      expect(providerError.message).toContain("[REDACTED]");
    }
  });

  it("throws AIProviderError for unmapped models", async () => {
    await expect(
      provider.generateResponse(makeConfig({ model: "unknown-model" }))
    ).rejects.toThrow(AIProviderError);
  });

  it("handles connection failures as retryable errors", async () => {
    mockFetch.mockRejectedValue(new Error("fetch failed"));

    try {
      await provider.generateResponse(makeConfig());
    } catch (error) {
      const providerError = error as AIProviderError;
      expect(providerError.code).toBe("OPENROUTER_CONNECTION_ERROR");
      expect(providerError.retryable).toBe(true);
    }
  });
});
