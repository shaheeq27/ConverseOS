import { NextRequest } from "next/server";
import { getWorkspaceContext } from "@/server/auth/workspace-context";
import { createApiResponse } from "@/server/utils/api-response";

export const runtime = "nodejs";

/**
 * V0.3.1 verification endpoint. It intentionally exposes only the resolved
 * tenant context and does not introduce a product feature.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { orgSlug: string; workspaceSlug: string } }
) {
  const result = await getWorkspaceContext({
    req,
    orgSlug: params.orgSlug,
    workspaceSlug: params.workspaceSlug,
  });

  if ("errorResponse" in result) {
    return result.errorResponse;
  }

  return createApiResponse({ data: result.context });
}
