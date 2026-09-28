import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrganizationSettings extends Document {
  orgId: mongoose.Types.ObjectId;
  logoUrl?: string;
  brandColor?: string;
  timezone: string;
  allowedDomains: string[];
  securityPolicies: {
    requireMfa?: boolean;
    sessionMaxAgeHours?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSettingsSchema = new Schema<IOrganizationSettings>(
  {
    orgId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, unique: true },
    logoUrl: { type: String },
    brandColor: { type: String, default: "#22d3ee" },
    timezone: { type: String, default: "UTC" },
    allowedDomains: [{ type: String }],
    securityPolicies: {
      requireMfa: { type: Boolean, default: false },
      sessionMaxAgeHours: { type: Number, default: 168 }, // 7 days
    },
  },
  { timestamps: true }
);

const OrganizationSettingsModel: Model<IOrganizationSettings> =
  mongoose.models.OrganizationSettings ??
  mongoose.model<IOrganizationSettings>("OrganizationSettings", OrganizationSettingsSchema);

export default OrganizationSettingsModel;
