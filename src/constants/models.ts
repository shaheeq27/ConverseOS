/**
 * Backward-compatible re-exports from the canonical AI model registry.
 *
 * All model metadata now lives in `src/config/ai-models.ts`.
 * This file exists so that existing imports from `@/constants/models`
 * continue to resolve without changes.
 */
export {
  AI_MODEL_IDS,
  AI_MODELS,
  DEFAULT_AI_MODEL,
  getAIModel,
  getAvailableAIModels,
  getModelsByProvider,
  isAIModelAvailable,
  isSupportedAIModel,
} from "@/config/ai-models";

export type {
  AICapability,
  AIModelConfig,
  AIProvider,
  SupportedAIModelId,
} from "@/config/ai-models";
