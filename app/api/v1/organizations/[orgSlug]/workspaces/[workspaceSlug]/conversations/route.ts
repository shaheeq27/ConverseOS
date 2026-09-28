import { NextRequest } from "next/server";
import { getWorkspaceContext } from "@/server/auth/workspace-context";
import {
  createConversation,
  listConversations,
} from "@/server/services/conversation.service";
import { CreateConversationSchema } from "@/server/validation/conversation";
import { createApiResponse } from "@/server/utils/api-response";

export const runtime = "nodejs";

type RouteContext = {
  params: { orgSlug: string; workspaceSlug: string };
};

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const workspace = await getWorkspaceContext({
      req,
      orgSlug: params.orgSlug,
      workspaceSlug: params.workspaceSlug,
      requiredPermission: "chat:create",
    });

    if ("errorResponse" in workspace) return workspace.errorResponse;

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10)));
    const search = url.searchParams.get("search") ?? undefined;

    const result = await listConversations({
      workspaceId: workspace.context.workspaceId,
      page,
      limit,
      search,
    });

    return createApiResponse({
      data: { conversations: result.conversations },
      meta: { page, limit, total: result.total },
    });
  } catch (error) {
    console.error("[CONVERSATIONS] List error:", error);
    return createApiResponse({
      status: 500,
      error: { code: "CONVERSATION_LIST_FAILED", message: "Unable to list conversations" },
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

    const parsed = CreateConversationSchema.safeParse(await req.json());
    if (!parsed.success) {
      return createApiResponse({
        status: 400,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid conversation payload",
          details: parsed.error.flatten(),
        },
      });
    }

    const result = await createConversation({
      workspaceId: workspace.context.workspaceId,
      userId: workspace.context.userId,
      data: parsed.data,
    });

    if ("error" in result) {
      return createApiResponse({
        status: 404,
        error: { code: result.error, message: "Assistant not found in this workspace" },
      });
    }

    return createApiResponse({ status: 201, data: { conversation: result } });
  } catch (error) {
    console.error("[CONVERSATIONS] Create error:", error);
    return createApiResponse({
      status: 500,
      error: { code: "CONVERSATION_CREATE_FAILED", message: "Unable to create conversation" },
    });
  }
}
