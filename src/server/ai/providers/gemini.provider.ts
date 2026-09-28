import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import type {
  AIProvider,
  AIRequestConfig,
  AIResponse,
  AIStreamEvent,
  ChatMessage,
} from "@/server/ai/types";
import { AIProviderError } from "@/server/ai/errors";

/**
 * Maps ConverseOS message roles to Gemini SDK roles.
 * Gemini uses "user" and "model"; system instructions are passed separately.
 */
function toGeminiRole(role: ChatMessage["role"]): "user" | "model" {
  return role === "assistant" ? "model" : "user";
}

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(config: AIRequestConfig): Promise<AIResponse> {
    const start = Date.now();

    try {
      const genAI = new GoogleGenerativeAI(this.apiKey);

      const model = genAI.getGenerativeModel({
        model: config.model,
        systemInstruction: config.systemPrompt || undefined,
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: config.maxTokens,
        },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      });

      // Separate system messages from history (system is handled via systemInstruction)
      const history = config.messages
        .filter((m) => m.role !== "system")
        .slice(0, -1)
        .map((m) => ({ role: toGeminiRole(m.role), parts: [{ text: m.content }] }));

      const lastMessage = config.messages.filter((m) => m.role !== "system").at(-1);
      if (!lastMessage) {
        throw new AIProviderError({
          provider: this.name,
          code: "EMPTY_MESSAGES",
          message: "No user message provided",
        });
      }

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.content);
      const response = result.response;
      const text = response.text();
      const latencyMs = Date.now() - start;

      const usage = response.usageMetadata;

      return {
        content: text,
        provider: this.name,
        modelUsed: config.model,
        usage: {
          promptTokens: usage?.promptTokenCount ?? 0,
          completionTokens: usage?.candidatesTokenCount ?? 0,
          totalTokens: usage?.totalTokenCount ?? 0,
        },
        finishReason: "stop",
        latencyMs,
      };
    } catch (error) {
      if (error instanceof AIProviderError) throw error;

      const message = error instanceof Error ? error.message : "Unknown Gemini error";

      // Detect retryable conditions
      const retryable =
        message.includes("429") ||
        message.includes("503") ||
        message.includes("overloaded") ||
        message.includes("RESOURCE_EXHAUSTED");

      throw new AIProviderError({
        provider: this.name,
        code: "GEMINI_API_ERROR",
        message: sanitizeErrorMessage(message),
        retryable,
      });
    }
  }

  async *streamResponse(_config: AIRequestConfig): AsyncGenerator<AIStreamEvent> {
    // Streaming implementation deferred to a later task.
    throw new AIProviderError({
      provider: this.name,
      code: "STREAMING_NOT_IMPLEMENTED",
      message: "Streaming is not yet implemented for the Gemini provider",
    });
  }
}

/**
 * Strip anything that looks like an API key from error messages.
 */
function sanitizeErrorMessage(message: string): string {
  return message.replace(/AIza[A-Za-z0-9_-]{35}/g, "[REDACTED]");
}
