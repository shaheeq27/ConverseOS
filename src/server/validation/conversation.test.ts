import {
  CreateConversationSchema,
  UpdateConversationSchema,
  ConversationIdSchema,
} from "@/server/validation/conversation";
import { CreateMessageSchema } from "@/server/validation/message";

describe("Conversation validation", () => {
  it("accepts a valid create payload", () => {
    expect(
      CreateConversationSchema.safeParse({
        assistantId: "aabbccddeeff00112233aabb",
        title: "My chat",
      }).success
    ).toBe(true);
  });

  it("accepts a create payload with only assistantId", () => {
    expect(
      CreateConversationSchema.safeParse({
        assistantId: "aabbccddeeff00112233aabb",
      }).success
    ).toBe(true);
  });

  it("rejects a create payload with an invalid assistantId", () => {
    expect(
      CreateConversationSchema.safeParse({ assistantId: "bad-id" }).success
    ).toBe(false);
  });

  it("rejects a create payload with no assistantId", () => {
    expect(CreateConversationSchema.safeParse({}).success).toBe(false);
  });

  it("accepts a rename update", () => {
    expect(
      UpdateConversationSchema.safeParse({ title: "Renamed" }).success
    ).toBe(true);
  });

  it("accepts a pin update", () => {
    expect(
      UpdateConversationSchema.safeParse({ isPinned: true }).success
    ).toBe(true);
  });

  it("rejects an empty update", () => {
    expect(UpdateConversationSchema.safeParse({}).success).toBe(false);
  });

  it("validates a valid conversation ID", () => {
    expect(
      ConversationIdSchema.safeParse("aabbccddeeff00112233aabb").success
    ).toBe(true);
  });

  it("rejects an invalid conversation ID", () => {
    expect(ConversationIdSchema.safeParse("invalid").success).toBe(false);
  });
});

describe("Message validation", () => {
  it("accepts a valid user message", () => {
    expect(
      CreateMessageSchema.safeParse({ role: "user", content: "Hello" }).success
    ).toBe(true);
  });

  it("accepts a valid assistant message", () => {
    expect(
      CreateMessageSchema.safeParse({ role: "assistant", content: "Hi" }).success
    ).toBe(true);
  });

  it("accepts a valid system message", () => {
    expect(
      CreateMessageSchema.safeParse({ role: "system", content: "Instructions" }).success
    ).toBe(true);
  });

  it("rejects an empty content string", () => {
    expect(
      CreateMessageSchema.safeParse({ role: "user", content: "" }).success
    ).toBe(false);
  });

  it("rejects an invalid role", () => {
    expect(
      CreateMessageSchema.safeParse({ role: "admin", content: "Hello" }).success
    ).toBe(false);
  });

  it("rejects a missing content field", () => {
    expect(
      CreateMessageSchema.safeParse({ role: "user" }).success
    ).toBe(false);
  });
});
