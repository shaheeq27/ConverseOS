import { MockProvider } from "@/server/ai/providers/mock.provider";
import type { AIRequestConfig } from "@/server/ai/types";

const provider = new MockProvider();

function makeConfig(overrides?: Partial<AIRequestConfig>): AIRequestConfig {
  return {
    model: "mock",
    systemPrompt: "You are a helpful assistant.",
    messages: [{ role: "user", content: "Hello" }],
    temperature: 0,
    ...overrides,
  };
}

describe("MockProvider", () => {
  it("returns a deterministic response", async () => {
    const response = await provider.generateResponse(makeConfig());

    expect(response.content).toContain("[Mock]");
    expect(response.content).toContain("Hello");
  });

  it("follows the AIResponse contract", async () => {
    const response = await provider.generateResponse(makeConfig());

    expect(response.provider).toBe("mock");
    expect(response.modelUsed).toBe("mock");
    expect(response.finishReason).toBe("stop");
    expect(typeof response.latencyMs).toBe("number");
    expect(response.latencyMs).toBeGreaterThanOrEqual(0);
    expect(response.usage).toEqual(
      expect.objectContaining({
        promptTokens: expect.any(Number),
        completionTokens: expect.any(Number),
      })
    );
  });

  it("handles missing user message", async () => {
    const response = await provider.generateResponse(
      makeConfig({ messages: [{ role: "system", content: "sys" }] })
    );

    expect(response.content).toContain("No user message");
  });

  it("streams tokens as AIStreamEvents", async () => {
    const events = [];
    for await (const event of provider.streamResponse(makeConfig())) {
      events.push(event);
    }

    // Must start with status events
    expect(events[0]).toEqual({ type: "status", status: "preparing" });
    expect(events[1]).toEqual({ type: "status", status: "generating" });

    // Must end with a done event
    const last = events[events.length - 1];
    expect(last).toMatchObject({ type: "done", finishReason: "stop" });

    // Must contain token events
    const tokens = events.filter((e) => e.type === "token");
    expect(tokens.length).toBeGreaterThan(0);
  });
});
