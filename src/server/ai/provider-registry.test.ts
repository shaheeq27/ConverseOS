import {
  getProvider,
  getProviderForModel,
  resetProviders,
} from "@/server/ai/provider-registry";
import { GeminiProvider } from "@/server/ai/providers/gemini.provider";
import { OpenRouterProvider } from "@/server/ai/providers/openrouter.provider";
import { MockProvider } from "@/server/ai/providers/mock.provider";
import { AIProviderError } from "@/server/ai/errors";
import { AI_MODELS } from "@/config/ai-models";

describe("Provider Registry", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    resetProviders();
    process.env = {
      ...originalEnv,
      GEMINI_API_KEY: "test-gemini-key",
      OPENROUTER_API_KEY: "test-openrouter-key",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // -----------------------------------------------------------------------
  // Provider resolution by type
  // -----------------------------------------------------------------------

  it("resolves gemini → GeminiProvider", () => {
    expect(getProvider("gemini")).toBeInstanceOf(GeminiProvider);
  });

  it("resolves openrouter → OpenRouterProvider", () => {
    expect(getProvider("openrouter")).toBeInstanceOf(OpenRouterProvider);
  });

  it("resolves mock → MockProvider", () => {
    expect(getProvider("mock")).toBeInstanceOf(MockProvider);
  });

  it("throws AIProviderError for unknown provider type", () => {
    expect(() => getProvider("unknown" as never)).toThrow(AIProviderError);
  });

  // -----------------------------------------------------------------------
  // API key enforcement
  // -----------------------------------------------------------------------

  it("throws when GEMINI_API_KEY is missing", () => {
    delete process.env.GEMINI_API_KEY;
    resetProviders();

    expect(() => getProvider("gemini")).toThrow(AIProviderError);
    try {
      getProvider("gemini");
    } catch (error) {
      expect((error as AIProviderError).code).toBe("MISSING_API_KEY");
    }
  });

  it("throws when OPENROUTER_API_KEY is missing", () => {
    delete process.env.OPENROUTER_API_KEY;
    resetProviders();

    expect(() => getProvider("openrouter")).toThrow(AIProviderError);
    try {
      getProvider("openrouter");
    } catch (error) {
      expect((error as AIProviderError).code).toBe("MISSING_API_KEY");
    }
  });

  it("mock provider does not require any API key", () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    resetProviders();

    expect(() => getProvider("mock")).not.toThrow();
  });

  // -----------------------------------------------------------------------
  // Model-based resolution via centralized registry
  // -----------------------------------------------------------------------

  it("resolves gemini-1.5-flash → GeminiProvider via model registry", () => {
    expect(getProviderForModel("gemini-1.5-flash")).toBeInstanceOf(GeminiProvider);
  });

  it("resolves gpt-4o → OpenRouterProvider via model registry", () => {
    expect(getProviderForModel("gpt-4o")).toBeInstanceOf(OpenRouterProvider);
  });

  it("resolves claude-3-5-sonnet → OpenRouterProvider via model registry", () => {
    expect(getProviderForModel("claude-3-5-sonnet")).toBeInstanceOf(OpenRouterProvider);
  });

  it("resolves deepseek-r1 → OpenRouterProvider via model registry", () => {
    expect(getProviderForModel("deepseek-r1")).toBeInstanceOf(OpenRouterProvider);
  });

  it("resolves mock → MockProvider via model registry", () => {
    expect(getProviderForModel("mock")).toBeInstanceOf(MockProvider);
  });

  it("throws for unregistered model IDs", () => {
    expect(() => getProviderForModel("nonexistent")).toThrow(AIProviderError);
    try {
      getProviderForModel("nonexistent");
    } catch (error) {
      expect((error as AIProviderError).code).toBe("UNKNOWN_MODEL");
    }
  });

  // -----------------------------------------------------------------------
  // No duplicate model/provider mapping
  // -----------------------------------------------------------------------

  it("every registered model resolves to a provider without duplicate mapping", () => {
    for (const model of AI_MODELS) {
      if (!model.available) continue;

      // This verifies the registry and provider-registry are in sync
      const provider = getProviderForModel(model.id);
      expect(provider.name).toBe(model.provider);
    }
  });
});
