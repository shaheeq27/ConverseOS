import {
  CreateAssistantSchema,
  UpdateAssistantSchema,
} from "@/server/validation/assistant";

describe("Assistant validation", () => {
  it("accepts a create payload using a registry-supported model", () => {
    expect(
      CreateAssistantSchema.safeParse({
        name: "Support",
        aiModel: "gemini-1.5-flash",
        promptTemplates: [{ name: "Welcome", prompt: "Greet the customer." }],
      }).success
    ).toBe(true);
  });

  it("rejects an unsupported model", () => {
    expect(
      CreateAssistantSchema.safeParse({ name: "Support", aiModel: "unknown-model" }).success
    ).toBe(false);
  });

  it("requires at least one field for an update", () => {
    expect(UpdateAssistantSchema.safeParse({}).success).toBe(false);
  });
});
