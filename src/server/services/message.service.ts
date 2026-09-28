import { connectDB } from "@/server/db/connect";
import MessageModel, { IMessage } from "@/server/db/models/Message";
import ConversationModel from "@/server/db/models/Conversation";
import { CreateMessageInput } from "@/server/validation/message";

/**
 * Verifies the conversation exists in the given workspace and is not
 * soft-deleted.  Returns true on success, false if invalid.
 */
async function verifyConversationInWorkspace(
  conversationId: string,
  workspaceId: string
): Promise<boolean> {
  const conversation = await ConversationModel.findOne({
    _id: conversationId,
    workspaceId,
    deletedAt: null,
  }).lean();

  return conversation !== null;
}

export async function createMessage({
  conversationId,
  workspaceId,
  data,
}: {
  conversationId: string;
  workspaceId: string;
  data: CreateMessageInput;
}): Promise<IMessage | { error: string }> {
  await connectDB();

  const valid = await verifyConversationInWorkspace(conversationId, workspaceId);
  if (!valid) {
    return { error: "CONVERSATION_NOT_IN_WORKSPACE" };
  }

  return MessageModel.create({
    conversationId,
    role: data.role,
    content: data.content,
  });
}

export async function getMessages({
  conversationId,
  workspaceId,
  page = 1,
  limit = 50,
}: {
  conversationId: string;
  workspaceId: string;
  page?: number;
  limit?: number;
}): Promise<{ messages: IMessage[]; total: number } | { error: string }> {
  await connectDB();

  const valid = await verifyConversationInWorkspace(conversationId, workspaceId);
  if (!valid) {
    return { error: "CONVERSATION_NOT_IN_WORKSPACE" };
  }

  const filter = { conversationId };

  const [messages, total] = await Promise.all([
    MessageModel.find(filter)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IMessage[]>(),
    MessageModel.countDocuments(filter),
  ]);

  return { messages, total };
}
