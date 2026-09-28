import mongoose, { Document, Model, Schema } from "mongoose";
import { AI_MODEL_IDS, DEFAULT_AI_MODEL, SupportedAIModelId } from "@/constants/models";

export type AssistantVisibility = "workspace" | "private";

export interface IAssistantPromptTemplate {
  name: string;
  prompt: string;
}

export interface IAssistant extends Document {
  workspaceId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  avatar: string;
  aiModel: SupportedAIModelId;
  systemPrompt: string;
  personality: string;
  temperature: number;
  promptTemplates: IAssistantPromptTemplate[];
  visibility: AssistantVisibility;
  enabledTools: string[];
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const AssistantPromptTemplateSchema = new Schema<IAssistantPromptTemplate>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    prompt: { type: String, required: true, maxlength: 10_000 },
  },
  { _id: false }
);

const AssistantSchema = new Schema<IAssistant>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: "", trim: true, maxlength: 2_000 },
    avatar: { type: String, default: "bot", trim: true, maxlength: 500 },
    aiModel: { type: String, enum: AI_MODEL_IDS, default: DEFAULT_AI_MODEL, required: true },
    systemPrompt: { type: String, default: "", maxlength: 20_000 },
    personality: { type: String, default: "", trim: true, maxlength: 1_000 },
    temperature: { type: Number, default: 0.7, min: 0, max: 2 },
    promptTemplates: { type: [AssistantPromptTemplateSchema], default: [] },
    visibility: { type: String, enum: ["workspace", "private"], default: "workspace" },
    enabledTools: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Supports the common workspace-scoped list query while excluding soft-deleted
// records, without relying on a global assistant lookup.
AssistantSchema.index({ workspaceId: 1, deletedAt: 1, createdAt: -1 });

const AssistantModel: Model<IAssistant> =
  mongoose.models.Assistant ?? mongoose.model<IAssistant>("Assistant", AssistantSchema);

export default AssistantModel;
