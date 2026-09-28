import { NextRequest } from "next/server";
import { getWorkspaceContext } from "@/server/auth/workspace-context";
import {
  deleteAssistant,
  getAssistant,
  updateAssistant,
} from "@/server/services/assistant.service";
import { AssistantIdSchema, UpdateAssistantSchema } from "@/server/validation/assistant";
import { createApiResponse } from "@/server/utils/api-response";

export const runtime = "nodejs";

type RouteContext = {
  params: { orgSlug: string; workspaceSlug: string; id: string };
};

async function resolveWorkspace(req: NextRequest, params: RouteContext["params"]) {
  return getWorkspaceContext({
    req,
    orgSlug: params.orgSlug,
    workspaceSlug: params.workspaceSlug,
    requiredPermission: "assistants:manage",
  });
}

function parseAssistantId(id: string) {
  const parsed = AssistantIdSchema.safeParse(id);
  if (parsed.success) return parsed.data;

  return createApiResponse({
    status: 400,
    error: { code: "VALIDATION_ERROR", message: "Invalid assistant ID" },
  });
}

function notFoundResponse() {
  return createApiResponse({
    status: 404,
    error: { code: "ASSISTANT_NOT_FOUND", message: "Assistant not found" },
  });
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const workspace = await resolveWorkspace(req, params);
    if ("errorResponse" in workspace) return workspace.errorResponse;

    const assistantId = parseAssistantId(params.id);
    if (typeof assistantId !== "string") return assistantId;

    const assistant = await getAssistant({
      assistantId,
      workspaceId: workspace.context.workspaceId,
    });

    if (!assistant) return notFoundResponse();
    return createApiResponse({ data: { assistant } });
  } catch (error) {
    console.error("[ASSISTANTS] Read error:", error);
    return createApiResponse({
      status: 500,
      error: { code: "ASSISTANT_READ_FAILED", message: "Unable to read assistant" },
    });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const workspace = await resolveWorkspace(req, params);
    if ("errorResponse" in workspace) return workspace.errorResponse;

    const assistantId = parseAssistantId(params.id);
    if (typeof assistantId !== "string") return assistantId;

    const parsed = UpdateAssistantSchema.safeParse(await req.json());
    if (!parsed.success) {
      return createApiResponse({
        status: 400,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid assistant update",
          details: parsed.error.flatten(),
        },
      });
    }

    const assistant = await updateAssistant({
      assistantId,
      workspaceId: workspace.context.workspaceId,
      userId: workspace.context.userId,
      data: parsed.data,
    });

    if (!assistant) return notFoundResponse();
    return createApiResponse({ data: { assistant } });
  } catch (error) {
    console.error("[ASSISTANTS] Update error:", error);
    return createApiResponse({
      status: 500,
      error: { code: "ASSISTANT_UPDATE_FAILED", message: "Unable to update assistant" },
    });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const workspace = await resolveWorkspace(req, params);
    if ("errorResponse" in workspace) return workspace.errorResponse;

    const assistantId = parseAssistantId(params.id);
    if (typeof assistantId !== "string") return assistantId;

    const assistant = await deleteAssistant({
      assistantId,
      workspaceId: workspace.context.workspaceId,
      userId: workspace.context.userId,
    });

    if (!assistant) return notFoundResponse();
    return createApiResponse({ data: { assistant } });
  } catch (error) {
    console.error("[ASSISTANTS] Delete error:", error);
    return createApiResponse({
      status: 500,
      error: { code: "ASSISTANT_DELETE_FAILED", message: "Unable to delete assistant" },
    });
  }
}
