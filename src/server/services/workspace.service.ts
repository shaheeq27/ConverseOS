import { connectDB } from "@/server/db/connect";
import OrganizationModel from "@/server/db/models/Organization";
import WorkspaceModel, { IWorkspace } from "@/server/db/models/Workspace";
import MembershipModel from "@/server/db/models/Membership";
import { validateSlug } from "@/lib/utils/slug-validator";

export async function createWorkspace({
  orgId,
  name,
  slug,
  description,
  userId,
}: {
  orgId: string;
  name: string;
  slug: string;
  description?: string;
  userId: string;
}): Promise<IWorkspace> {
  const slugValidation = validateSlug(slug);
  if (!slugValidation.isValid) {
    throw new Error(slugValidation.error ?? "Invalid workspace slug");
  }

  await connectDB();

  const organization = await OrganizationModel.findOne({
    _id: orgId,
    deletedAt: null,
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  const existing = await WorkspaceModel.findOne({
    orgId,
    slug: slug.toLowerCase(),
    deletedAt: null,
  });

  if (existing) {
    throw new Error(`Workspace slug "${slug}" already exists in this organization`);
  }

  const workspace = await WorkspaceModel.create({
    orgId,
    name,
    slug: slug.toLowerCase(),
    description: description ?? "",
    createdBy: userId,
  });

  // Automatically assign creator as Owner
  await MembershipModel.create({
    userId,
    orgId,
    workspaceId: workspace._id,
    role: "owner",
  });

  return workspace;
}

export async function getWorkspaceBySlug(
  orgId: string,
  slug: string
): Promise<IWorkspace | null> {
  await connectDB();
  return WorkspaceModel.findOne({
    orgId,
    slug: slug.toLowerCase(),
    deletedAt: null,
  }).lean<IWorkspace>();
}
