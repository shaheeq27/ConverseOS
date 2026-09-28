import { GeminiProvider } from "@/server/ai/providers/gemini.provider";
import { AIProviderError } from "@/server/ai/errors";
import type { AIRequestConfig } from "@/server/ai/types";

// Mock the @google/generative-ai SDK
jest.mock("@google/generative-ai", () => {
  const sendMessage = jest.fn();
  const startChat = jest.fn().mockReturnValue({ sendMessage });
  const getGenerativeModel = jest.fn().mockReturnValue({ startChat });

  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel,
    })),
    HarmCategory: {
      HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
      HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
      HARM_CATEGORY_SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT",
    },
    HarmBlockThreshold: { BLOCK_NONE: "BLOCK_NONE" },
    // Expose mocks for test control
    __mocks: { sendMessage, startChat, getGenerativeModel },
  };
});

const { __mocks } = jest.requireMock("@google/generative-ai") as {
  __mocks: {
    sendMessage: jest.Mock;
    startChat: jest.Mock;
    getGenerativeModel: jest.Mock;
  };
};

function makeConfig(overrides?: Partial<AIRequestConfig>): AIRequestConfig {
  return {
    model: "gemini-1.5-flash",
    systemPrompt: "You are helpful.",
    messages: [{ role: "user", content: "What is 2+2?" }],
    temperature: 0.7,
    ...overrides,
  };
}

describe("GeminiProvider", () => {
  const provider = new GeminiProvider("test-api-key");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("normalizes a successful response into AIResponse format", async () => {
    __mocks.sendMessage.mockResolvedValue({
      response: {
        text: () => "4",
        usageMetadata: {
          promptTokenCount: 10,
          candidatesTokenCount: 5,
          totalTokenCount: 15,
        },
      },
    });

    const response = await provider.generateResponse(makeConfig());

    expect(response.content).toBe("4");
    expect(response.provider).toBe("gemini");
    expect(response.modelUsed).toBe("gemini-1.5-flash");
    expect(response.finishReason).toBe("stop");
    expect(response.usage).toEqual({
      promptTokens: 10,
      completionTokens: 5,
      totalTokens: 15,
    });
    expect(typeof response.latencyMs).toBe("number");
  });

  it("normalizes provider errors into AIProviderError", async () => {
    __mocks.sendMessage.mockRejectedValue(new Error("API quota exceeded 429"));

    await expect(provider.generateResponse(makeConfig())).rejects.toThrow(
      AIProviderError
    );

    try {
      await provider.generateResponse(makeConfig());
    } catch (error) {
      expect(error).toBeInstanceOf(AIProviderError);
      const providerError = error as AIProviderError;
      expect(providerError.provider).toBe("gemini");
      expect(providerError.code).toBe("GEMINI_API_ERROR");
      expect(providerError.retryable).toBe(true);
    }
  });

  it("does not leak API keys in error messages", async () => {
    __mocks.sendMessage.mockRejectedValue(
      new Error("Request failed: key AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567 invalid")
    );

    try {
      await provider.generateResponse(makeConfig());
    } catch (error) {
      const providerError = error as AIProviderError;
      expect(providerError.message).not.toContain("AIzaSy");
      expect(providerError.message).toContain("[REDACTED]");
    }
  });

  it("throws AIProviderError for empty messages", async () => {
    await expect(
      provider.generateResponse(makeConfig({ messages: [] }))
    ).rejects.toThrow(AIProviderError);
  });
});
