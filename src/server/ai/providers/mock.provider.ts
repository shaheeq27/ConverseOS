import type {
  AIProvider,
  AIRequestConfig,
  AIResponse,
  AIStreamEvent,
} from "@/server/ai/types";

/**
 * Deterministic mock provider for testing, local development, and CI.
 * No API keys required. Follows the exact same AIResponse contract as
 * real providers.
 */
export class MockProvider implements AIProvider {
  readonly name = "mock";

  async generateResponse(config: AIRequestConfig): Promise<AIResponse> {
    const start = Date.now();

    // Deterministic response based on the last user message
    const lastUserMessage = [...config.messages]
      .reverse()
      .find((m) => m.role === "user");

    const content = lastUserMessage
      ? `[Mock] Response to: "${lastUserMessage.content.slice(0, 100)}"`
      : "[Mock] No user message provided.";

    // Simulate a small latency
    await new Promise((resolve) => setTimeout(resolve, 50));

    const latencyMs = Date.now() - start;

    return {
      content,
      provider: this.name,
      modelUsed: "mock",
      usage: {
        promptTokens: estimateTokens(config.messages.map((m) => m.content).join(" ")),
        completionTokens: estimateTokens(content),
        totalTokens: 0, // filled below
      },
      finishReason: "stop",
      latencyMs,
    };
  }

  async *streamResponse(config: AIRequestConfig): AsyncGenerator<AIStreamEvent> {
    yield { type: "status", status: "preparing" };
    yield { type: "status", status: "generating" };

    const lastUserMessage = [...config.messages]
      .reverse()
      .find((m) => m.role === "user");

    const content = lastUserMessage
      ? `[Mock] Response to: "${lastUserMessage.content.slice(0, 100)}"`
      : "[Mock] No user message provided.";

    // Emit tokens word by word
    const words = content.split(" ");
    for (const word of words) {
      yield { type: "token", content: word + " " };
    }

    yield {
      type: "done",
      usage: {
        promptTokens: estimateTokens(config.messages.map((m) => m.content).join(" ")),
        completionTokens: estimateTokens(content),
        totalTokens: 0,
      },
      finishReason: "stop",
    };
  }
}

/** Rough token estimate: ~4 characters per token. */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
