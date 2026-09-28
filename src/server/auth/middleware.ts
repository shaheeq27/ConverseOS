import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/server/auth/session";
import { connectDB } from "@/server/db/connect";
import SessionModel from "@/server/db/models/Session";
import UserModel from "@/server/db/models/User";
import OrganizationModel from "@/server/db/models/Organization";
import WorkspaceModel from "@/server/db/models/Workspace";
import MembershipModel from "@/server/db/models/Membership";
import { can, Permission } from "@/constants/permissions";
import { createApiResponse } from "@/server/utils/api-response";

export interface SecurityChainResult {
  status: number;
  userId?: string;
  orgId?: string;
  workspaceId?: string;
  membershipRole?: string;
  errorResponse?: NextResponse;
}

export async function evaluateSecurityChain({
  req,
  orgSlug,
  workspaceSlug,
  requiredPermission,
}: {
  req: NextRequest;
  orgSlug?: string;
  workspaceSlug?: string;
  requiredPermission?: Permission;
}): Promise<SecurityChainResult> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  // Step 1: Authentication Check (401)
  if (!token) {
    return {
      status: 401,
      errorResponse: createApiResponse({
        status: 401,
        error: { code: "UNAUTHORIZED", message: "Authentication session required" },
      }),
    };
  }

  await connectDB();
  const session = await SessionModel.findOne({
    sessionToken: token,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  }).lean();

  if (!session) {
    return {
      status: 401,
      errorResponse: createApiResponse({
        status: 401,
        error: { code: "SESSION_EXPIRED", message: "Session expired or revoked" },
      }),
    };
  }

  const user = await UserModel.findOne({
    _id: session.userId,
    deletedAt: null,
  }).lean();

  if (!user) {
    return {
      status: 401,
      errorResponse: createApiResponse({
        status: 401,
        error: { code: "USER_NOT_FOUND", message: "Session user is no longer active" },
      }),
    };
  }

  const userId = session.userId.toString();

  // If no org / workspace context requested, return authenticated status
  if (!orgSlug) {
    return { status: 200, userId };
  }

  // Step 2: Organization Exists Check (404)
  const org = await OrganizationModel.findOne({
    slug: orgSlug.toLowerCase(),
    deletedAt: null,
  }).lean();

  if (!org) {
    return {
      status: 404,
      errorResponse: createApiResponse({
        status: 404,
        error: { code: "ORG_NOT_FOUND", message: `Organization "${orgSlug}" not found` },
      }),
    };
  }

  const orgId = org._id.toString();

  // If no workspace context requested, return org status
  if (!workspaceSlug) {
    return { status: 200, userId, orgId };
  }

  // Step 3: Workspace Exists Check (404)
  const workspace = await WorkspaceModel.findOne({
    orgId: org._id,
    slug: workspaceSlug.toLowerCase(),
    deletedAt: null,
  }).lean();

  if (!workspace) {
    return {
      status: 404,
      errorResponse: createApiResponse({
        status: 404,
        error: { code: "WORKSPACE_NOT_FOUND", message: `Workspace "${workspaceSlug}" not found` },
      }),
    };
  }

  const workspaceId = workspace._id.toString();

  // Step 4: Membership Check (403)
  const membership = await MembershipModel.findOne({
    userId: session.userId,
    workspaceId: workspace._id,
    deletedAt: null,
  }).lean();

  if (!membership) {
    return {
      status: 403,
      errorResponse: createApiResponse({
        status: 403,
        error: { code: "MEMBERSHIP_REQUIRED", message: "User is not a member of this workspace" },
      }),
    };
  }

  // Step 5: Permission Check (403)
  if (requiredPermission && !can(membership, requiredPermission)) {
    return {
      status: 403,
      errorResponse: createApiResponse({
        status: 403,
        error: {
          code: "PERMISSION_DENIED",
          message: `Permission "${requiredPermission}" denied for role "${membership.role}"`,
        },
      }),
    };
  }

  return {
    status: 200,
    userId,
    orgId,
    workspaceId,
    membershipRole: membership.role,
  };
}
