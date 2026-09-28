jest.mock("@/server/db/connect", () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/server/db/models/Conversation", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

jest.mock("@/server/db/models/Assistant", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

import ConversationModel from "@/server/db/models/Conversation";
import AssistantModel from "@/server/db/models/Assistant";
import {
  createConversation,
  getConversation,
  listConversations,
  softDeleteConversation,
  updateConversation,
} from "@/server/services/conversation.service";

const asMock = (method: unknown) => method as jest.Mock;
const lean = (value: unknown) => ({ lean: jest.fn().mockResolvedValue(value) });

describe("Conversation service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  it("creates a conversation when the assistant belongs to the same workspace", async () => {
    const assistant = { _id: { toString: () => "assistant-1" } };
    asMock(AssistantModel.findOne).mockReturnValue(lean(assistant));

    const conversation = { _id: "conv-1", title: "New conversation" };
    asMock(ConversationModel.create).mockResolvedValue(conversation);

    const result = await createConversation({
      workspaceId: "workspace-1",
      userId: "user-1",
      data: { assistantId: "assistant-1" },
    });

    expect(result).toBe(conversation);
    expect(AssistantModel.findOne).toHaveBeenCalledWith({
      _id: "assistant-1",
      workspaceId: "workspace-1",
      deletedAt: null,
    });
    expect(ConversationModel.create).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      assistantId: "assistant-1",
      createdBy: "user-1",
      title: "New conversation",
    });
  });

  it("rejects conversation creation when the assistant belongs to another workspace", async () => {
    asMock(AssistantModel.findOne).mockReturnValue(lean(null));

    const result = await createConversation({
      workspaceId: "workspace-1",
      userId: "user-1",
      data: { assistantId: "assistant-in-workspace-b" },
    });

    expect(result).toEqual({ error: "ASSISTANT_NOT_IN_WORKSPACE" });
    expect(ConversationModel.create).not.toHaveBeenCalled();
  });

  it("uses a custom title when provided", async () => {
    const assistant = { _id: { toString: () => "assistant-1" } };
    asMock(AssistantModel.findOne).mockReturnValue(lean(assistant));
    asMock(ConversationModel.create).mockResolvedValue({ _id: "conv-1" });

    await createConversation({
      workspaceId: "workspace-1",
      userId: "user-1",
      data: { assistantId: "assistant-1", title: "My chat" },
    });

    expect(ConversationModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: "My chat" })
    );
  });

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------

  it("reads a conversation only when it belongs to the requested workspace", async () => {
    const conversation = { _id: "conv-1", workspaceId: "workspace-1" };
    asMock(ConversationModel.findOne).mockReturnValue(lean(conversation));

    await expect(
      getConversation({ conversationId: "conv-1", workspaceId: "workspace-1" })
    ).resolves.toBe(conversation);

    expect(ConversationModel.findOne).toHaveBeenCalledWith({
      _id: "conv-1",
      workspaceId: "workspace-1",
      deletedAt: null,
    });
  });

  it("does not expose a conversation from another workspace", async () => {
    asMock(ConversationModel.findOne).mockReturnValue(lean(null));

    await expect(
      getConversation({ conversationId: "conv-in-workspace-a", workspaceId: "workspace-b" })
    ).resolves.toBeNull();
  });

  // ---------------------------------------------------------------------------
  // List with pagination
  // ---------------------------------------------------------------------------

  it("lists non-deleted conversations with pinned-first sorting", async () => {
    const conversations = [{ _id: "conv-1" }];
    const query = {
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(lean(conversations)),
        }),
      }),
    };
    asMock(ConversationModel.find).mockReturnValue(query);
    asMock(ConversationModel.countDocuments).mockResolvedValue(1);

    const result = await listConversations({ workspaceId: "workspace-1" });

    expect(result.conversations).toBe(conversations);
    expect(result.total).toBe(1);
    expect(ConversationModel.find).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      deletedAt: null,
    });
    expect(query.sort).toHaveBeenCalledWith({ isPinned: -1, updatedAt: -1 });
  });

  it("applies search filter when provided", async () => {
    const query = {
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(lean([])),
        }),
      }),
    };
    asMock(ConversationModel.find).mockReturnValue(query);
    asMock(ConversationModel.countDocuments).mockResolvedValue(0);

    await listConversations({ workspaceId: "workspace-1", search: "hello" });

    expect(ConversationModel.find).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      deletedAt: null,
      title: { $regex: "hello", $options: "i" },
    });
  });

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------

  it("updates only a non-deleted conversation in the requested workspace", async () => {
    const conversation = { _id: "conv-1", title: "Renamed" };
    asMock(ConversationModel.findOneAndUpdate).mockReturnValue(lean(conversation));

    await expect(
      updateConversation({
        conversationId: "conv-1",
        workspaceId: "workspace-1",
        data: { title: "Renamed" },
      })
    ).resolves.toBe(conversation);

    expect(ConversationModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "conv-1", workspaceId: "workspace-1", deletedAt: null },
      { $set: { title: "Renamed" } },
      { new: true, runValidators: true }
    );
  });

  it("pins a conversation", async () => {
    const conversation = { _id: "conv-1", isPinned: true };
    asMock(ConversationModel.findOneAndUpdate).mockReturnValue(lean(conversation));

    await expect(
      updateConversation({
        conversationId: "conv-1",
        workspaceId: "workspace-1",
        data: { isPinned: true },
      })
    ).resolves.toBe(conversation);

    expect(ConversationModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "conv-1", workspaceId: "workspace-1", deletedAt: null },
      { $set: { isPinned: true } },
      { new: true, runValidators: true }
    );
  });

  // ---------------------------------------------------------------------------
  // Soft delete
  // ---------------------------------------------------------------------------

  it("soft-deletes a conversation in the requested workspace", async () => {
    const conversation = { _id: "conv-1", deletedAt: new Date() };
    asMock(ConversationModel.findOneAndUpdate).mockReturnValue(lean(conversation));

    await expect(
      softDeleteConversation({
        conversationId: "conv-1",
        workspaceId: "workspace-1",
        userId: "user-1",
      })
    ).resolves.toBe(conversation);

    expect(ConversationModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "conv-1", workspaceId: "workspace-1", deletedAt: null },
      { $set: { deletedAt: expect.any(Date), deletedBy: "user-1" } },
      { new: true }
    );
  });

  it("returns null when soft-deleting a conversation from another workspace", async () => {
    asMock(ConversationModel.findOneAndUpdate).mockReturnValue(lean(null));

    await expect(
      softDeleteConversation({
        conversationId: "conv-1",
        workspaceId: "wrong-workspace",
        userId: "user-1",
      })
    ).resolves.toBeNull();
  });
});
