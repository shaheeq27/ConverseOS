import { NextRequest } from "next/server";
import { getWorkspaceContext } from "@/server/auth/workspace-context";
import { createAssistant, listAssistants } from "@/server/services/assistant.service";
import { CreateAssistantSchema } from "@/server/validation/assistant";
import { createApiResponse } from "@/server/utils/api-response";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { orgSlug: string; workspaceSlug: string } }
) {
  try {
    const workspace = await getWorkspaceContext({
      req,
      orgSlug: params.orgSlug,
      workspaceSlug: params.workspaceSlug,
      requiredPermission: "assistants:manage",
    });

    if ("errorResponse" in workspace) return workspace.errorResponse;

    const assistants = await listAssistants({
      workspaceId: workspace.context.workspaceId,
    });

    return createApiResponse({ data: { assistants } });
  } catch (error) {
    console.error("[ASSISTANTS] List error:", error);
    return createApiResponse({
      status: 500,
      error: { code: "ASSISTANT_LIST_FAILED", message: "Unable to list assistants" },
    });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { orgSlug: string; workspaceSlug: string } }
) {
  try {
    const workspace = await getWorkspaceContext({
      req,
      orgSlug: params.orgSlug,
      workspaceSlug: params.workspaceSlug,
      requiredPermission: "assistants:create",
    });

    if ("errorResponse" in workspace) return workspace.errorResponse;

    const parsed = CreateAssistantSchema.safeParse(await req.json());
    if (!parsed.success) {
      return createApiResponse({
        status: 400,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid assistant payload",
          details: parsed.error.flatten(),
        },
      });
    }

    const assistant = await createAssistant({
      workspaceId: workspace.context.workspaceId,
      userId: workspace.context.userId,
      data: parsed.data,
    });

    return createApiResponse({ status: 201, data: { assistant } });
  } catch (error) {
    console.error("[ASSISTANTS] Create error:", error);
    return createApiResponse({
      status: 500,
      error: { code: "ASSISTANT_CREATE_FAILED", message: "Unable to create assistant" },
    });
  }
}
