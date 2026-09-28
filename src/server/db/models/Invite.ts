import mongoose, { Schema, Document, Model } from "mongoose";
import { UserRole } from "@/constants/roles";

export type InviteStatus = "Pending" | "Accepted" | "Expired" | "Revoked";

export interface IInvite extends Document {
  email: string;
  orgId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  role: UserRole;
  token: string;
  status: InviteStatus;
  invitedBy: mongoose.Types.ObjectId;
  expiresAt: Date;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InviteSchema = new Schema<IInvite>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    orgId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    role: {
      type: String,
      enum: ["owner", "admin", "member", "viewer"],
      default: "member",
      required: true,
    },
    token: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Expired", "Revoked"],
      default: "Pending",
    },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

InviteSchema.index({ email: 1, workspaceId: 1 });

const InviteModel: Model<IInvite> =
  mongoose.models.Invite ?? mongoose.model<IInvite>("Invite", InviteSchema);

export default InviteModel;
