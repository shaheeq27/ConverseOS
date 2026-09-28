jest.mock("@/server/db/connect", () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/server/db/models/Message", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

jest.mock("@/server/db/models/Conversation", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

import MessageModel from "@/server/db/models/Message";
import ConversationModel from "@/server/db/models/Conversation";
import { createMessage, getMessages } from "@/server/services/message.service";

const asMock = (method: unknown) => method as jest.Mock;
const lean = (value: unknown) => ({ lean: jest.fn().mockResolvedValue(value) });

describe("Message service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  it("creates a user message when conversation belongs to the workspace", async () => {
    asMock(ConversationModel.findOne).mockReturnValue(lean({ _id: "conv-1" }));

    const message = { _id: "msg-1", role: "user", content: "Hello" };
    asMock(MessageModel.create).mockResolvedValue(message);

    const result = await createMessage({
      conversationId: "conv-1",
      workspaceId: "workspace-1",
      data: { role: "user", content: "Hello" },
    });

    expect(result).toBe(message);
    expect(ConversationModel.findOne).toHaveBeenCalledWith({
      _id: "conv-1",
      workspaceId: "workspace-1",
      deletedAt: null,
    });
  });

  it("creates an assistant message", async () => {
    asMock(ConversationModel.findOne).mockReturnValue(lean({ _id: "conv-1" }));

    const message = { _id: "msg-2", role: "assistant", content: "Hi there" };
    asMock(MessageModel.create).mockResolvedValue(message);

    const result = await createMessage({
      conversationId: "conv-1",
      workspaceId: "workspace-1",
      data: { role: "assistant", content: "Hi there" },
    });

    expect(result).toBe(message);
  });

  it("rejects message creation when conversation belongs to another workspace", async () => {
    asMock(ConversationModel.findOne).mockReturnValue(lean(null));

    const result = await createMessage({
      conversationId: "conv-in-workspace-a",
      workspaceId: "workspace-b",
      data: { role: "user", content: "Hello" },
    });

    expect(result).toEqual({ error: "CONVERSATION_NOT_IN_WORKSPACE" });
    expect(MessageModel.create).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------------
  // Retrieve
  // ---------------------------------------------------------------------------

  it("retrieves messages chronologically when conversation is in workspace", async () => {
    asMock(ConversationModel.findOne).mockReturnValue(lean({ _id: "conv-1" }));

    const messages = [
      { _id: "msg-1", content: "Hello" },
      { _id: "msg-2", content: "Hi" },
    ];
    const query = {
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(lean(messages)),
        }),
      }),
    };
    asMock(MessageModel.find).mockReturnValue(query);
    asMock(MessageModel.countDocuments).mockResolvedValue(2);

    const result = await getMessages({
      conversationId: "conv-1",
      workspaceId: "workspace-1",
    });

    expect("messages" in result && result.messages).toBe(messages);
    expect("total" in result && result.total).toBe(2);
    expect(query.sort).toHaveBeenCalledWith({ createdAt: 1 });
  });

  it("rejects message retrieval when conversation belongs to another workspace", async () => {
    asMock(ConversationModel.findOne).mockReturnValue(lean(null));

    const result = await getMessages({
      conversationId: "conv-in-workspace-a",
      workspaceId: "workspace-b",
    });

    expect(result).toEqual({ error: "CONVERSATION_NOT_IN_WORKSPACE" });
  });
});
