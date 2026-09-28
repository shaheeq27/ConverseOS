/**
 * ConverseOS — AI Orchestrator
 *
 * Central execution layer between ConverseOS services and the AI provider
 * abstraction. Validates the requested model, resolves the correct provider,
 * executes the request, and returns a normalized response.
 *
 * The orchestrator does NOT know about users, organizations, workspaces,
 * memberships, or permissions. It receives already-authorized requests.
 */

import type { AIRequestConfig, AIResponse, AIStreamEvent } from "@/server/ai/types";
import { getAIModel } from "@/config/ai-models";
import { getProviderForModel } from "@/server/ai/provider-registry";
import { AIProviderError } from "@/server/ai/errors";

// ---------------------------------------------------------------------------
// Request validation
// ---------------------------------------------------------------------------

function validateRequest(config: AIRequestConfig): void {
  // Model existence and availability
  const modelConfig = getAIModel(config.model);

  if (!modelConfig) {
    throw new AIProviderError({
      provider: "orchestrator",
      code: "UNSUPPORTED_MODEL",
      message: `Model "${config.model}" is not registered in the AI model registry`,
    });
  }

  if (!modelConfig.available) {
    throw new AIProviderError({
      provider: "orchestrator",
      code: "MODEL_UNAVAILABLE",
      message: `Model "${config.model}" is currently unavailable`,
    });
  }

  // Messages
  if (!config.messages || config.messages.length === 0) {
    throw new AIProviderError({
      provider: "orchestrator",
      code: "EMPTY_MESSAGES",
      message: "At least one message is required",
    });
  }

  // Temperature bounds
  if (typeof config.temperature !== "number" || config.temperature < 0 || config.temperature > 2) {
    throw new AIProviderError({
      provider: "orchestrator",
      code: "INVALID_TEMPERATURE",
      message: "Temperature must be a number between 0 and 2",
    });
  }

  // MaxTokens bounds (if provided)
  if (config.maxTokens !== undefined) {
    if (typeof config.maxTokens !== "number" || config.maxTokens <= 0) {
      throw new AIProviderError({
        provider: "orchestrator",
        code: "INVALID_MAX_TOKENS",
        message: "maxTokens must be a positive number",
      });
    }

    if (config.maxTokens > modelConfig.maxTokens) {
      throw new AIProviderError({
        provider: "orchestrator",
        code: "MAX_TOKENS_EXCEEDED",
        message: `maxTokens (${config.maxTokens}) exceeds model limit (${modelConfig.maxTokens})`,
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Normalize config with registry defaults
// ---------------------------------------------------------------------------

function normalizeConfig(config: AIRequestConfig): AIRequestConfig {
  const modelConfig = getAIModel(config.model)!;

  return {
    ...config,
    systemPrompt: config.systemPrompt ?? "",
    maxTokens: config.maxTokens ?? modelConfig.maxTokens,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a complete AI response (non-streaming).
 *
 * 1. Validates the request against the centralized model registry.
 * 2. Resolves the provider via the provider registry.
 * 3. Executes generateResponse() on the resolved provider.
 * 4. Returns the normalized AIResponse.
 */
export async function generate(config: AIRequestConfig): Promise<AIResponse> {
  // Step 1: Validate
  validateRequest(config);

  // Step 2: Normalize with registry defaults
  const normalized = normalizeConfig(config);

  // Step 3: Resolve provider (this also validates model→provider mapping)
  const provider = getProviderForModel(normalized.model);

  // Step 4: Execute
  try {
    const response = await provider.generateResponse(normalized);
    return response;
  } catch (error) {
    // Re-throw AIProviderErrors as-is (already normalized)
    if (error instanceof AIProviderError) {
      throw error;
    }

    // Wrap unexpected errors
    const message = error instanceof Error ? error.message : "Unknown orchestrator error";

    throw new AIProviderError({
      provider: provider.name,
      code: "ORCHESTRATOR_ERROR",
      message: sanitizeMessage(message),
      retryable: false,
    });
  }
}

/**
 * Stream an AI response as an async generator of events.
 *
 * Type contract exposed here for future compatibility. Actual streaming
 * implementation deferred to the Streaming task.
 */
export async function* stream(config: AIRequestConfig): AsyncGenerator<AIStreamEvent> {
  // Step 1: Validate
  validateRequest(config);

  // Step 2: Normalize
  const normalized = normalizeConfig(config);

  // Step 3: Resolve provider
  const provider = getProviderForModel(normalized.model);

  // Step 4: Delegate to provider's stream
  yield* provider.streamResponse(normalized);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sanitizeMessage(message: string): string {
  return message
    .replace(/AIza[A-Za-z0-9_-]{35}/g, "[REDACTED]")
    .replace(/sk-or-[A-Za-z0-9_-]+/g, "[REDACTED]")
    .replace(/Bearer\s+[^\s]+/g, "Bearer [REDACTED]");
}
