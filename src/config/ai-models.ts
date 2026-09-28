/**
 * ConverseOS — Canonical AI Model Registry
 *
 * Single source of truth for every AI model the platform supports.
 * No component, service, or validation schema should hardcode model IDs;
 * all model metadata flows from this file.
 *
 * This registry is deliberately DATA ONLY — it declares which provider
 * owns a model but does not configure or invoke any provider.
 */

// ---------------------------------------------------------------------------
// Provider classification
// ---------------------------------------------------------------------------

export type AIProvider = "gemini" | "openrouter" | "mock";

// ---------------------------------------------------------------------------
// Model capability tags
// ---------------------------------------------------------------------------

export type AICapability = "chat" | "streaming" | "code" | "vision" | "reasoning";

// ---------------------------------------------------------------------------
// Model configuration
// ---------------------------------------------------------------------------

export interface AIModelConfig {
  /** Unique wire ID used in API payloads and database records. */
  id: string;
  /** Execution-layer provider that serves this model. */
  provider: AIProvider;
  /** Human-readable label for UI display. */
  displayName: string;
  /** Short description for model selection UI. */
  description: string;
  /** Feature tags advertised by this model. */
  capabilities: readonly AICapability[];
  /** Maximum output tokens the model supports. */
  maxTokens: number;
  /** Context window size in tokens. */
  contextWindow: number;
  /** Whether this model is currently enabled for use. */
  available: boolean;
  /** Recommended starting temperature for this model. */
  defaultTemperature: number;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const REGISTRY: readonly AIModelConfig[] = [
  {
    id: "gemini-1.5-flash",
    provider: "gemini",
    displayName: "Gemini 1.5 Flash",
    description: "Fast, multimodal model designed for high-frequency workflows",
    capabilities: ["chat", "streaming", "code", "vision"],
    maxTokens: 8192,
    contextWindow: 1_000_000,
    available: true,
    defaultTemperature: 0.7,
  },
  {
    id: "gpt-4o",
    provider: "openrouter",
    displayName: "GPT-4o",
    description: "Omni model for complex reasoning and structured output",
    capabilities: ["chat", "streaming", "code", "vision"],
    maxTokens: 4096,
    contextWindow: 128_000,
    available: true,
    defaultTemperature: 0.7,
  },
  {
    id: "claude-3-5-sonnet",
    provider: "openrouter",
    displayName: "Claude 3.5 Sonnet",
    description: "Industry-leading reasoning and code synthesis model",
    capabilities: ["chat", "streaming", "code", "reasoning"],
    maxTokens: 8192,
    contextWindow: 200_000,
    available: true,
    defaultTemperature: 0.7,
  },
  {
    id: "deepseek-r1",
    provider: "openrouter",
    displayName: "DeepSeek R1",
    description: "Advanced open-reasoning model optimized for complex logic",
    capabilities: ["chat", "streaming", "code", "reasoning"],
    maxTokens: 4096,
    contextWindow: 64_000,
    available: true,
    defaultTemperature: 0.6,
  },
  {
    id: "mock",
    provider: "mock",
    displayName: "Mock (Testing)",
    description: "Deterministic mock provider for development and testing",
    capabilities: ["chat", "streaming"],
    maxTokens: 2048,
    contextWindow: 16_000,
    available: true,
    defaultTemperature: 0.0,
  },
] as const;

// ---------------------------------------------------------------------------
// Derived types — kept in sync with the registry automatically
// ---------------------------------------------------------------------------

/** Union of every registered model ID. */
export type SupportedAIModelId = (typeof REGISTRY)[number]["id"];

/** Tuple of all model ID strings — usable in Zod enums and Mongoose enums. */
export const AI_MODEL_IDS = REGISTRY.map((m) => m.id) as unknown as readonly [
  "gemini-1.5-flash",
  "gpt-4o",
  "claude-3-5-sonnet",
  "deepseek-r1",
  "mock",
];

export const DEFAULT_AI_MODEL: SupportedAIModelId = "gemini-1.5-flash";

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/** Full registry array. */
export const AI_MODELS: readonly AIModelConfig[] = REGISTRY;

/** Look up a model by its ID. Returns `undefined` if not found. */
export function getAIModel(modelId: string): AIModelConfig | undefined {
  return REGISTRY.find((m) => m.id === modelId);
}

/** Check whether a model ID exists and is currently available. */
export function isAIModelAvailable(modelId: string): boolean {
  const model = getAIModel(modelId);
  return model !== undefined && model.available;
}

/** Return only models marked as available. */
export function getAvailableAIModels(): readonly AIModelConfig[] {
  return REGISTRY.filter((m) => m.available);
}

/** Return models served by a specific provider. */
export function getModelsByProvider(provider: AIProvider): readonly AIModelConfig[] {
  return REGISTRY.filter((m) => m.provider === provider);
}

/** Type-guard: narrows an arbitrary string to `SupportedAIModelId`. */
export function isSupportedAIModel(id: string): id is SupportedAIModelId {
  return REGISTRY.some((m) => m.id === id);
}
