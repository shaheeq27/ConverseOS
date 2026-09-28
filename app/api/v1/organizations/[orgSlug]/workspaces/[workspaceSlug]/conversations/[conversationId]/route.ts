import { NextRequest } from "next/server";
import { getWorkspaceContext } from "@/server/auth/workspace-context";
import {
  getConversation,
  softDeleteConversation,
  updateConversation,
} from "@/server/services/conversation.service";
import {
  ConversationIdSchema,
  UpdateConversationSchema,
} from "@/server/validation/conversation";
import { createApiResponse } from "@/server/utils/api-response";

export const runtime = "nodejs";

type RouteContext = {
  params: { orgSlug: string; workspaceSlug: string; conversationId: string };
};

async function resolveWorkspace(req: NextRequest, params: RouteContext["params"]) {
  return getWorkspaceContext({
    req,
    orgSlug: params.orgSlug,
    workspaceSlug: params.workspaceSlug,
    requiredPermission: "chat:create",
  });
}

function parseConversationId(id: string) {
  const parsed = ConversationIdSchema.safeParse(id);
  if (parsed.success) return parsed.data;

  return createApiResponse({
    status: 400,
    error: { code: "VALIDATION_ERROR", message: "Invalid conversation ID" },
  });
}

function notFoundResponse() {
  return createApiResponse({
    status: 404,
    error: { code: "CONVERSATION_NOT_FOUND", message: "Conversation not found" },
  });
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const workspace = await resolveWorkspace(req, params);
    if ("errorResponse" in workspace) return workspace.errorResponse;

    const conversationId = parseConversationId(params.conversationId);
    if (typeof conversationId !== "string") return conversationId;

    const conversation = await getConversation({
      conversationId,
      workspaceId: workspace.context.workspaceId,
    });

    if (!conversation) return notFoundResponse();
    return createApiResponse({ data: { conversation } });
  } catch (error) {
    console.error("[CONVERSATIONS] Read error:", error);
    return createApiResponse({
      status: 500,
      error: { code: "CONVERSATION_READ_FAILED", message: "Unable to read conversation" },
    });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const workspace = await resolveWorkspace(req, params);
    if ("errorResponse" in workspace) return workspace.errorResponse;

    const conversationId = parseConversationId(params.conversationId);
    if (typeof conversationId !== "string") return conversationId;

    const parsed = UpdateConversationSchema.safeParse(await req.json());
    if (!parsed.success) {
      return createApiResponse({
        status: 400,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid conversation update",
          details: parsed.error.flatten(),
        },
      });
    }

    const conversation = await updateConversation({
      conversationId,
      workspaceId: workspace.context.workspaceId,
      data: parsed.data,
    });

    if (!conversation) return notFoundResponse();
    return createApiResponse({ data: { conversation } });
  } catch (error) {
    console.error("[CONVERSATIONS] Update error:", error);
    return createApiResponse({
      status: 500,
      error: { code: "CONVERSATION_UPDATE_FAILED", message: "Unable to update conversation" },
    });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const workspace = await resolveWorkspace(req, params);
    if ("errorResponse" in workspace) return workspace.errorResponse;

    const conversationId = parseConversationId(params.conversationId);
    if (typeof conversationId !== "string") return conversationId;

    const conversation = await softDeleteConversation({
      conversationId,
      workspaceId: workspace.context.workspaceId,
      userId: workspace.context.userId,
    });

    if (!conversation) return notFoundResponse();
    return createApiResponse({ data: { conversation } });
  } catch (error) {
    console.error("[CONVERSATIONS] Delete error:", error);
    return createApiResponse({
      status: 500,
      error: { code: "CONVERSATION_DELETE_FAILED", message: "Unable to delete conversation" },
    });
  }
}
