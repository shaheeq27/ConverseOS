import type { AIProvider as AIProviderInterface } from "@/server/ai/types";
import type { AIProvider as AIProviderType } from "@/config/ai-models";
import { getAIModel } from "@/config/ai-models";
import { GeminiProvider } from "@/server/ai/providers/gemini.provider";
import { OpenRouterProvider } from "@/server/ai/providers/openrouter.provider";
import { MockProvider } from "@/server/ai/providers/mock.provider";
import { AIProviderError } from "@/server/ai/errors";

/**
 * Resolves a provider implementation from the centralized AI model registry.
 *
 * Flow:
 *   modelId → AI Model Registry → provider type → Provider Registry → AIProvider
 *
 * No duplicate model/provider mappings — everything flows from the single
 * registry at src/config/ai-models.ts.
 */

// Lazily instantiated singletons (one per provider type per process)
let geminiProvider: GeminiProvider | null = null;
let openRouterProvider: OpenRouterProvider | null = null;
const mockProvider = new MockProvider();

/**
 * Resolve a provider implementation by the AI provider type.
 */
export function getProvider(providerType: AIProviderType): AIProviderInterface {
  switch (providerType) {
    case "gemini": {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new AIProviderError({
          provider: "gemini",
          code: "MISSING_API_KEY",
          message: "GEMINI_API_KEY environment variable is not configured",
        });
      }
      if (!geminiProvider) {
        geminiProvider = new GeminiProvider(apiKey);
      }
      return geminiProvider;
    }

    case "openrouter": {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new AIProviderError({
          provider: "openrouter",
          code: "MISSING_API_KEY",
          message: "OPENROUTER_API_KEY environment variable is not configured",
        });
      }
      if (!openRouterProvider) {
        openRouterProvider = new OpenRouterProvider(apiKey);
      }
      return openRouterProvider;
    }

    case "mock":
      return mockProvider;

    default:
      throw new AIProviderError({
        provider: providerType,
        code: "UNKNOWN_PROVIDER",
        message: `No provider implementation for "${providerType}"`,
      });
  }
}

/**
 * Resolve a provider implementation by model ID.
 *
 * Looks up the model in the centralized registry, extracts the provider type,
 * then resolves the corresponding provider implementation.
 */
export function getProviderForModel(modelId: string): AIProviderInterface {
  const modelConfig = getAIModel(modelId);

  if (!modelConfig) {
    throw new AIProviderError({
      provider: "unknown",
      code: "UNKNOWN_MODEL",
      message: `Model "${modelId}" is not registered in the AI model registry`,
    });
  }

  if (!modelConfig.available) {
    throw new AIProviderError({
      provider: modelConfig.provider,
      code: "MODEL_UNAVAILABLE",
      message: `Model "${modelId}" is currently unavailable`,
    });
  }

  return getProvider(modelConfig.provider);
}

/**
 * Reset cached provider instances. Used in tests to prevent state leakage.
 */
export function resetProviders(): void {
  geminiProvider = null;
  openRouterProvider = null;
}
