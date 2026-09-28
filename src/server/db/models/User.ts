import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserPreferences {
  theme: "dark" | "light" | "system";
  emailNotifications: boolean;
  language: string;
  timezone: string;
  defaultWorkspaceId?: mongoose.Types.ObjectId;
}

export interface IUser extends Document {
  name: string;
  email: string;
  avatarColor: string;
  avatarUrl?: string;
  preferences: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    theme: { type: String, enum: ["dark", "light", "system"], default: "dark" },
    emailNotifications: { type: Boolean, default: true },
    language: { type: String, default: "en" },
    timezone: { type: String, default: "UTC" },
    defaultWorkspaceId: { type: Schema.Types.ObjectId, ref: "Workspace" },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatarColor: { type: String, default: "#22d3ee" },
    avatarUrl: { type: String },
    preferences: { type: UserPreferencesSchema, default: () => ({}) },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const UserModel: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default UserModel;
