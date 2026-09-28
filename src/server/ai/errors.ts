/**
 * ConverseOS — Normalized AI Provider Errors
 *
 * All provider-specific error shapes (Gemini SDK errors, OpenRouter HTTP
 * errors, etc.) are caught and re-thrown as AIProviderError. Downstream
 * code never needs to understand provider internals.
 */

export class AIProviderError extends Error {
  /** Which provider threw the error (e.g. "gemini", "openrouter"). */
  readonly provider: string;
  /** Machine-readable error code. */
  readonly code: string;
  /** Whether retrying the same request might succeed. */
  readonly retryable: boolean;
  /** HTTP status code from the upstream provider, if applicable. */
  readonly statusCode?: number;

  constructor({
    provider,
    code,
    message,
    retryable = false,
    statusCode,
  }: {
    provider: string;
    code: string;
    message: string;
    retryable?: boolean;
    statusCode?: number;
  }) {
    super(message);
    this.name = "AIProviderError";
    this.provider = provider;
    this.code = code;
    this.retryable = retryable;
    this.statusCode = statusCode;
  }

  /**
   * Returns a sanitized representation safe for API responses.
   * Never exposes API keys, raw provider payloads, or stack traces.
   */
  toSafeResponse() {
    return {
      provider: this.provider,
      code: this.code,
      message: this.message,
      retryable: this.retryable,
    };
  }
}
