import type {
  AIProvider,
  AIRequestConfig,
  AIResponse,
  AIStreamEvent,
  ChatMessage,
} from "@/server/ai/types";
import { AIProviderError } from "@/server/ai/errors";

/** OpenRouter model ID mapping from ConverseOS registry IDs. */
const MODEL_MAP: Record<string, string> = {
  "gpt-4o": "openai/gpt-4o",
  "claude-3-5-sonnet": "anthropic/claude-3.5-sonnet",
  "deepseek-r1": "deepseek/deepseek-r1",
};

interface OpenRouterChoice {
  message?: { content?: string };
  finish_reason?: string;
}

interface OpenRouterUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
  usage?: OpenRouterUsage;
  model?: string;
  error?: { message?: string; code?: number };
}

export class OpenRouterProvider implements AIProvider {
  readonly name = "openrouter";
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(config: AIRequestConfig): Promise<AIResponse> {
    const start = Date.now();
    const openRouterModel = MODEL_MAP[config.model];

    if (!openRouterModel) {
      throw new AIProviderError({
        provider: this.name,
        code: "UNSUPPORTED_MODEL",
        message: `Model "${config.model}" is not mapped to an OpenRouter model`,
      });
    }

    const messages: { role: string; content: string }[] = [];

    // Prepend system prompt if provided
    if (config.systemPrompt) {
      messages.push({ role: "system", content: config.systemPrompt });
    }

    // Append conversation history
    for (const msg of config.messages) {
      messages.push({ role: msg.role, content: msg.content });
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://converseos.app",
          "X-Title": "ConverseOS",
        },
        body: JSON.stringify({
          model: openRouterModel,
          messages,
          temperature: config.temperature,
          max_tokens: config.maxTokens,
        }),
      });

      const data: OpenRouterResponse = await response.json();
      const latencyMs = Date.now() - start;

      if (!response.ok || data.error) {
        const errorMessage = data.error?.message ?? `HTTP ${response.status}`;
        const retryable = response.status === 429 || response.status >= 500;

        throw new AIProviderError({
          provider: this.name,
          code: "OPENROUTER_API_ERROR",
          message: sanitizeErrorMessage(errorMessage),
          retryable,
          statusCode: response.status,
        });
      }

      const choice = data.choices?.[0];
      const content = choice?.message?.content ?? "";
      const usage = data.usage;

      return {
        content,
        provider: this.name,
        modelUsed: data.model ?? openRouterModel,
        usage: {
          promptTokens: usage?.prompt_tokens ?? 0,
          completionTokens: usage?.completion_tokens ?? 0,
          totalTokens: usage?.total_tokens ?? 0,
        },
        finishReason: mapFinishReason(choice?.finish_reason),
        latencyMs,
      };
    } catch (error) {
      if (error instanceof AIProviderError) throw error;

      const message = error instanceof Error ? error.message : "Unknown OpenRouter error";

      throw new AIProviderError({
        provider: this.name,
        code: "OPENROUTER_CONNECTION_ERROR",
        message: sanitizeErrorMessage(message),
        retryable: true,
      });
    }
  }

  async *streamResponse(_config: AIRequestConfig): AsyncGenerator<AIStreamEvent> {
    // Streaming implementation deferred to a later task.
    throw new AIProviderError({
      provider: this.name,
      code: "STREAMING_NOT_IMPLEMENTED",
      message: "Streaming is not yet implemented for the OpenRouter provider",
    });
  }
}

function mapFinishReason(reason?: string): "stop" | "length" | "error" {
  if (reason === "length") return "length";
  if (reason === "stop" || !reason) return "stop";
  return "error";
}

/**
 * Strip anything that looks like a Bearer token or API key from error messages.
 */
function sanitizeErrorMessage(message: string): string {
  return message
    .replace(/sk-or-[A-Za-z0-9_-]+/g, "[REDACTED]")
    .replace(/Bearer\s+[^\s]+/g, "Bearer [REDACTED]");
}
