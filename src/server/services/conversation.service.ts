import { connectDB } from "@/server/db/connect";
import ConversationModel, { IConversation } from "@/server/db/models/Conversation";
import AssistantModel from "@/server/db/models/Assistant";
import {
  CreateConversationInput,
  UpdateConversationInput,
} from "@/server/validation/conversation";

/**
 * Verifies the assistant exists in the given workspace and is not soft-deleted.
 * Returns the assistant ID string on success, or null if invalid.
 */
async function verifyAssistantInWorkspace(
  assistantId: string,
  workspaceId: string
): Promise<string | null> {
  const assistant = await AssistantModel.findOne({
    _id: assistantId,
    workspaceId,
    deletedAt: null,
  }).lean();

  return assistant ? assistant._id.toString() : null;
}

export async function createConversation({
  workspaceId,
  userId,
  data,
}: {
  workspaceId: string;
  userId: string;
  data: CreateConversationInput;
}): Promise<IConversation | { error: string }> {
  await connectDB();

  const validAssistantId = await verifyAssistantInWorkspace(
    data.assistantId,
    workspaceId
  );

  if (!validAssistantId) {
    return { error: "ASSISTANT_NOT_IN_WORKSPACE" };
  }

  return ConversationModel.create({
    workspaceId,
    assistantId: validAssistantId,
    createdBy: userId,
    title: data.title ?? "New conversation",
  });
}

export async function getConversation({
  conversationId,
  workspaceId,
}: {
  conversationId: string;
  workspaceId: string;
}): Promise<IConversation | null> {
  await connectDB();

  return ConversationModel.findOne({
    _id: conversationId,
    workspaceId,
    deletedAt: null,
  }).lean<IConversation>();
}

export async function listConversations({
  workspaceId,
  page = 1,
  limit = 20,
  search,
}: {
  workspaceId: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ conversations: IConversation[]; total: number }> {
  await connectDB();

  const filter: Record<string, unknown> = {
    workspaceId,
    deletedAt: null,
  };

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const [conversations, total] = await Promise.all([
    ConversationModel.find(filter)
      .sort({ isPinned: -1, updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IConversation[]>(),
    ConversationModel.countDocuments(filter),
  ]);

  return { conversations, total };
}

export async function updateConversation({
  conversationId,
  workspaceId,
  data,
}: {
  conversationId: string;
  workspaceId: string;
  data: UpdateConversationInput;
}): Promise<IConversation | null> {
  await connectDB();

  return ConversationModel.findOneAndUpdate(
    { _id: conversationId, workspaceId, deletedAt: null },
    { $set: data },
    { new: true, runValidators: true }
  ).lean<IConversation>();
}

export async function softDeleteConversation({
  conversationId,
  workspaceId,
  userId,
}: {
  conversationId: string;
  workspaceId: string;
  userId: string;
}): Promise<IConversation | null> {
  await connectDB();

  return ConversationModel.findOneAndUpdate(
    { _id: conversationId, workspaceId, deletedAt: null },
    { $set: { deletedAt: new Date(), deletedBy: userId } },
    { new: true }
  ).lean<IConversation>();
}
