/**
 * ConverseOS — AI Provider Type Contracts
 *
 * Every AI provider (Gemini, OpenRouter, Mock) implements the AIProvider
 * interface. The rest of ConverseOS communicates through these types and
 * never depends on provider-specific SDKs or response shapes.
 */

// ---------------------------------------------------------------------------
// Chat message format (provider-agnostic)
// ---------------------------------------------------------------------------

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// ---------------------------------------------------------------------------
// Request config
// ---------------------------------------------------------------------------

export interface AIRequestConfig {
  /** Model ID from the centralized AI model registry. */
  model: string;
  /** System-level instruction for the model. */
  systemPrompt: string;
  /** Conversation history in chronological order. */
  messages: ChatMessage[];
  /** Sampling temperature (0–2). */
  temperature: number;
  /** Maximum tokens in the completion. */
  maxTokens?: number;
}

// ---------------------------------------------------------------------------
// Token usage
// ---------------------------------------------------------------------------

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

// ---------------------------------------------------------------------------
// Response (non-streaming)
// ---------------------------------------------------------------------------

export interface AIResponse {
  /** The generated text content. */
  content: string;
  /** Which provider served this response. */
  provider: string;
  /** Exact model ID used by the provider. */
  modelUsed: string;
  /** Token consumption breakdown. */
  usage: TokenUsage;
  /** Why the model stopped generating. */
  finishReason: "stop" | "length" | "error";
  /** Wall-clock latency in milliseconds. */
  latencyMs: number;
}

// ---------------------------------------------------------------------------
// Execution status (for future streaming UI)
// ---------------------------------------------------------------------------

export type ExecutionStatus =
  | "preparing"
  | "generating"
  | "finalizing";

// ---------------------------------------------------------------------------
// Stream events (type contract only — streaming implemented in a later task)
// ---------------------------------------------------------------------------

export type AIStreamEvent =
  | { type: "status"; status: ExecutionStatus }
  | { type: "token"; content: string }
  | { type: "done"; usage: TokenUsage; finishReason: string }
  | { type: "error"; error: string };

// ---------------------------------------------------------------------------
// Provider interface
// ---------------------------------------------------------------------------

export interface AIProvider {
  /** Provider identifier (e.g. "gemini", "openrouter", "mock"). */
  readonly name: string;

  /** Generate a complete response (non-streaming). */
  generateResponse(config: AIRequestConfig): Promise<AIResponse>;

  /**
   * Stream a response as an async generator of events.
   * Type contract defined here; implementation deferred to a later task.
   */
  streamResponse(config: AIRequestConfig): AsyncGenerator<AIStreamEvent>;
}
