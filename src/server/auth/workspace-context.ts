import { NextRequest, NextResponse } from "next/server";
import { Permission } from "@/constants/permissions";
import { UserRole } from "@/constants/roles";
import { evaluateSecurityChain } from "@/server/auth/middleware";

export interface WorkspaceContext {
  userId: string;
  orgId: string;
  workspaceId: string;
  membershipRole: UserRole;
  orgSlug: string;
  workspaceSlug: string;
}

export type WorkspaceContextResult =
  | { context: WorkspaceContext }
  | { errorResponse: NextResponse };

/**
 * Resolves the complete authenticated tenant scope for a request. Route
 * handlers should consume this context instead of independently checking
 * sessions, organizations, workspaces, or memberships.
 */
export async function getWorkspaceContext({
  req,
  orgSlug,
  workspaceSlug,
  requiredPermission,
}: {
  req: NextRequest;
  orgSlug: string;
  workspaceSlug: string;
  requiredPermission?: Permission;
}): Promise<WorkspaceContextResult> {
  const result = await evaluateSecurityChain({
    req,
    orgSlug,
    workspaceSlug,
    requiredPermission,
  });

  if (result.errorResponse) {
    return { errorResponse: result.errorResponse };
  }

  if (!result.userId || !result.orgId || !result.workspaceId || !result.membershipRole) {
    throw new Error("Security evaluator returned an incomplete workspace context");
  }

  return {
    context: {
      userId: result.userId,
      orgId: result.orgId,
      workspaceId: result.workspaceId,
      membershipRole: result.membershipRole as UserRole,
      orgSlug: orgSlug.toLowerCase(),
      workspaceSlug: workspaceSlug.toLowerCase(),
    },
  };
}
