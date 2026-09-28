import { NextRequest } from "next/server";
import { getWorkspaceContext } from "@/server/auth/workspace-context";
import { createMessage, getMessages } from "@/server/services/message.service";
import { ConversationIdSchema } from "@/server/validation/conversation";
import { CreateMessageSchema } from "@/server/validation/message";
import { createApiResponse } from "@/server/utils/api-response";

export const runtime = "nodejs";

type RouteContext = {
  params: { orgSlug: string; workspaceSlug: string; conversationId: string };
};

function parseConversationId(id: string) {
  const parsed = ConversationIdSchema.safeParse(id);
  if (parsed.success) return parsed.data;

  return createApiResponse({
    status: 400,
    error: { code: "VALIDATION_ERROR", message: "Invalid conversation ID" },
  });
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const workspace = await getWorkspaceContext({
      req,
      orgSlug: params.orgSlug,
      workspaceSlug: params.workspaceSlug,
      requiredPermission: "chat:create",
    });

    if ("errorResponse" in workspace) return workspace.errorResponse;

    const conversationId = parseConversationId(params.conversationId);
    if (typeof conversationId !== "string") return conversationId;

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get("limit") ?? "50", 10)));

    const result = await getMessages({
      conversationId,
      workspaceId: workspace.context.workspaceId,
      page,
      limit,
    });

    if ("error" in result) {
      return createApiResponse({
        status: 404,
        error: { code: result.error, message: "Conversation not found in this workspace" },
      });
    }

    return createApiResponse({
      data: { messages: result.messages },
      meta: { page, limit, total: result.total },
    });
  } catch (error) {
    console.error("[MESSAGES] List error:", error);
    return createApiResponse({
      status: 500,
      error: { code: "MESSAGE_LIST_FAILED", message: "Unable to list messages" },
    });
  }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const workspace = await getWorkspaceContext({
      req,
      orgSlug: params.orgSlug,
      workspaceSlug: params.workspaceSlug,
      requiredPermission: "chat:create",
    });

    if ("errorResponse" in workspace) return workspace.errorResponse;

    const conversationId = parseConversationId(params.conversationId);
    if (typeof conversationId !== "string") return conversationId;

    const parsed = CreateMessageSchema.safeParse(await req.json());
    if (!parsed.success) {
      return createApiResponse({
        status: 400,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid message payload",
          details: parsed.error.flatten(),
        },
      });
    }

    const result = await createMessage({
      conversationId,
      workspaceId: workspace.context.workspaceId,
      data: parsed.data,
    });

    if ("error" in result) {
      return createApiResponse({
        status: 404,
        error: { code: result.error, message: "Conversation not found in this workspace" },
      });
    }

    return createApiResponse({ status: 201, data: { message: result } });
  } catch (error) {
    console.error("[MESSAGES] Create error:", error);
    return createApiResponse({
      status: 500,
      error: { code: "MESSAGE_CREATE_FAILED", message: "Unable to create message" },
    });
  }
}
