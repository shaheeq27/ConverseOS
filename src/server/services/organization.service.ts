import { connectDB } from "@/server/db/connect";
import OrganizationModel, { IOrganization } from "@/server/db/models/Organization";
import OrganizationSettingsModel from "@/server/db/models/OrganizationSettings";
import { validateSlug } from "@/lib/utils/slug-validator";

export async function createOrganization({
  name,
  slug,
  userId,
}: {
  name: string;
  slug: string;
  userId: string;
}): Promise<IOrganization> {
  const slugValidation = validateSlug(slug);
  if (!slugValidation.isValid) {
    throw new Error(slugValidation.error ?? "Invalid organization slug");
  }

  await connectDB();

  const existing = await OrganizationModel.findOne({ slug: slug.toLowerCase() });
  if (existing) {
    throw new Error(`Organization slug "${slug}" is already taken`);
  }

  const org = await OrganizationModel.create({
    name,
    slug: slug.toLowerCase(),
    createdBy: userId,
  });

  const settings = await OrganizationSettingsModel.create({
    orgId: org._id,
  });

  org.settingsId = settings._id;
  await org.save();

  return org;
}

export async function getOrganizationBySlug(slug: string): Promise<IOrganization | null> {
  await connectDB();
  return OrganizationModel.findOne({ slug: slug.toLowerCase(), deletedAt: null }).lean<IOrganization>();
}
