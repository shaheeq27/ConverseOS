import mongoose, { Schema, Document, Model } from "mongoose";
import { UserRole } from "@/constants/roles";

export interface IMembership extends Document {
  userId: mongoose.Types.ObjectId;
  orgId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  role: UserRole;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema = new Schema<IMembership>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orgId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    role: {
      type: String,
      enum: ["owner", "admin", "manager", "member", "viewer"],
      default: "member",
      required: true,
    },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

MembershipSchema.index({ userId: 1, workspaceId: 1 }, { unique: true });
MembershipSchema.index({ workspaceId: 1, role: 1 });

const MembershipModel: Model<IMembership> =
  mongoose.models.Membership ?? mongoose.model<IMembership>("Membership", MembershipSchema);

export default MembershipModel;
