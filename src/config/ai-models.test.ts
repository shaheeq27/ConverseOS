import {
  AI_MODEL_IDS,
  AI_MODELS,
  DEFAULT_AI_MODEL,
  getAIModel,
  getAvailableAIModels,
  getModelsByProvider,
  isAIModelAvailable,
  isSupportedAIModel,
} from "@/config/ai-models";

describe("AI Model Registry", () => {
  const EXPECTED_IDS = [
    "gemini-1.5-flash",
    "gpt-4o",
    "claude-3-5-sonnet",
    "deepseek-r1",
    "mock",
  ];

  // -----------------------------------------------------------------------
  // Registry completeness
  // -----------------------------------------------------------------------

  it("contains every expected model", () => {
    const registeredIds = AI_MODELS.map((m) => m.id);
    for (const id of EXPECTED_IDS) {
      expect(registeredIds).toContain(id);
    }
  });

  it("exports AI_MODEL_IDS matching the registry", () => {
    expect([...AI_MODEL_IDS]).toEqual(EXPECTED_IDS);
  });

  it("has a valid DEFAULT_AI_MODEL", () => {
    expect(EXPECTED_IDS).toContain(DEFAULT_AI_MODEL);
  });

  it("every model has required fields", () => {
    for (const model of AI_MODELS) {
      expect(model.id).toBeTruthy();
      expect(model.provider).toBeTruthy();
      expect(model.displayName).toBeTruthy();
      expect(model.description).toBeTruthy();
      expect(model.capabilities.length).toBeGreaterThan(0);
      expect(model.maxTokens).toBeGreaterThan(0);
      expect(model.contextWindow).toBeGreaterThan(0);
      expect(typeof model.available).toBe("boolean");
      expect(typeof model.defaultTemperature).toBe("number");
    }
  });

  // -----------------------------------------------------------------------
  // getAIModel
  // -----------------------------------------------------------------------

  it("looks up a valid model by ID", () => {
    const model = getAIModel("gemini-1.5-flash");
    expect(model).toBeDefined();
    expect(model!.displayName).toBe("Gemini 1.5 Flash");
    expect(model!.provider).toBe("gemini");
  });

  it("returns undefined for an unknown model ID", () => {
    expect(getAIModel("nonexistent-model")).toBeUndefined();
  });

  // -----------------------------------------------------------------------
  // isAIModelAvailable
  // -----------------------------------------------------------------------

  it("reports available models as available", () => {
    expect(isAIModelAvailable("gemini-1.5-flash")).toBe(true);
    expect(isAIModelAvailable("mock")).toBe(true);
  });

  it("reports unknown models as unavailable", () => {
    expect(isAIModelAvailable("nonexistent")).toBe(false);
  });

  // -----------------------------------------------------------------------
  // getAvailableAIModels
  // -----------------------------------------------------------------------

  it("returns only models marked as available", () => {
    const available = getAvailableAIModels();
    expect(available.length).toBeGreaterThan(0);
    for (const m of available) {
      expect(m.available).toBe(true);
    }
  });

  // -----------------------------------------------------------------------
  // getModelsByProvider
  // -----------------------------------------------------------------------

  it("filters models by provider", () => {
    const geminiModels = getModelsByProvider("gemini");
    expect(geminiModels.length).toBeGreaterThan(0);
    for (const m of geminiModels) {
      expect(m.provider).toBe("gemini");
    }

    const openrouterModels = getModelsByProvider("openrouter");
    expect(openrouterModels.length).toBeGreaterThan(0);
    for (const m of openrouterModels) {
      expect(m.provider).toBe("openrouter");
    }

    const mockModels = getModelsByProvider("mock");
    expect(mockModels.length).toBe(1);
    expect(mockModels[0].id).toBe("mock");
  });

  // -----------------------------------------------------------------------
  // isSupportedAIModel
  // -----------------------------------------------------------------------

  it("recognizes supported model IDs", () => {
    for (const id of EXPECTED_IDS) {
      expect(isSupportedAIModel(id)).toBe(true);
    }
  });

  it("rejects unsupported model IDs", () => {
    expect(isSupportedAIModel("unknown-model")).toBe(false);
    expect(isSupportedAIModel("")).toBe(false);
  });
});
