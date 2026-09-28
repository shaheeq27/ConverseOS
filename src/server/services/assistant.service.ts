import { connectDB } from "@/server/db/connect";
import AssistantModel, { IAssistant } from "@/server/db/models/Assistant";
import {
  CreateAssistantInput,
  UpdateAssistantInput,
} from "@/server/validation/assistant";

export async function createAssistant({
  workspaceId,
  userId,
  data,
}: {
  workspaceId: string;
  userId: string;
  data: CreateAssistantInput;
}): Promise<IAssistant> {
  await connectDB();

  return AssistantModel.create({
    ...data,
    workspaceId,
    createdBy: userId,
    updatedBy: userId,
  });
}

export async function getAssistant({
  assistantId,
  workspaceId,
}: {
  assistantId: string;
  workspaceId: string;
}): Promise<IAssistant | null> {
  await connectDB();

  return AssistantModel.findOne({
    _id: assistantId,
    workspaceId,
    deletedAt: null,
  }).lean<IAssistant>();
}

export async function listAssistants({
  workspaceId,
}: {
  workspaceId: string;
}): Promise<IAssistant[]> {
  await connectDB();

  return AssistantModel.find({ workspaceId, deletedAt: null })
    .sort({ createdAt: -1 })
    .lean<IAssistant[]>();
}

export async function updateAssistant({
  assistantId,
  workspaceId,
  userId,
  data,
}: {
  assistantId: string;
  workspaceId: string;
  userId: string;
  data: UpdateAssistantInput;
}): Promise<IAssistant | null> {
  await connectDB();

  return AssistantModel.findOneAndUpdate(
    { _id: assistantId, workspaceId, deletedAt: null },
    { $set: { ...data, updatedBy: userId } },
    { new: true, runValidators: true }
  ).lean<IAssistant>();
}

export async function deleteAssistant({
  assistantId,
  workspaceId,
  userId,
}: {
  assistantId: string;
  workspaceId: string;
  userId: string;
}): Promise<IAssistant | null> {
  await connectDB();

  return AssistantModel.findOneAndUpdate(
    { _id: assistantId, workspaceId, deletedAt: null },
    { $set: { deletedAt: new Date(), updatedBy: userId } },
    { new: true }
  ).lean<IAssistant>();
}
