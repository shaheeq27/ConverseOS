import mongoose, { Document, Model, Schema } from "mongoose";

export interface IConversation extends Document {
  workspaceId: mongoose.Types.ObjectId;
  assistantId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  title: string;
  isPinned: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    assistantId: { type: Schema.Types.ObjectId, ref: "Assistant", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "New conversation", trim: true, maxlength: 200 },
    isPinned: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Primary list query: workspace-scoped, excluding deleted, newest first
ConversationSchema.index({ workspaceId: 1, deletedAt: 1, updatedAt: -1 });

// Pinned-first sorting within a workspace
ConversationSchema.index({ workspaceId: 1, isPinned: -1, updatedAt: -1 });

// Assistant lookup (e.g. checking conversations tied to an assistant)
ConversationSchema.index({ assistantId: 1 });

const ConversationModel: Model<IConversation> =
  mongoose.models.Conversation ??
  mongoose.model<IConversation>("Conversation", ConversationSchema);

export default ConversationModel;
