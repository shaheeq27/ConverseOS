import { NextRequest, NextResponse } from "next/server";

jest.mock("@/server/auth/workspace-context", () => ({
  getWorkspaceContext: jest.fn(),
}));

jest.mock("@/server/services/assistant.service", () => ({
  createAssistant: jest.fn(),
  deleteAssistant: jest.fn(),
  getAssistant: jest.fn(),
  listAssistants: jest.fn(),
  updateAssistant: jest.fn(),
}));

import { getWorkspaceContext } from "@/server/auth/workspace-context";
import {
  createAssistant,
  deleteAssistant,
  getAssistant,
  listAssistants,
  updateAssistant,
} from "@/server/services/assistant.service";
import { GET as getCollection, POST } from "./route";
import { DELETE, GET as getById, PATCH } from "./[id]/route";

const asMock = (method: unknown) => method as jest.Mock;
const workspace = {
  context: {
    userId: "user-1",
    orgId: "org-1",
    workspaceId: "workspace-1",
    membershipRole: "admin" as const,
    orgSlug: "acme",
    workspaceSlug: "primary",
  },
};
const collectionParams = { params: { orgSlug: "acme", workspaceSlug: "primary" } };
const assistantParams = {
  params: {
    ...collectionParams.params,
    id: "507f1f77bcf86cd799439011",
  },
};

function request(method: string, body?: unknown) {
  return new NextRequest(
    "http://localhost/api/v1/organizations/acme/workspaces/primary/assistants",
    body === undefined
      ? { method }
      : {
          method,
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }
  );
}

describe("Assistant API routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asMock(getWorkspaceContext).mockResolvedValue(workspace);
  });

  it("creates a validated assistant in the resolved workspace", async () => {
    asMock(createAssistant).mockResolvedValue({ _id: "assistant-1", name: "Support" });

    const response = await POST(request("POST", { name: "Support", temperature: 0.4 }), collectionParams);

    expect(response.status).toBe(201);
    expect(getWorkspaceContext).toHaveBeenCalledWith({
      req: expect.any(NextRequest),
      orgSlug: "acme",
      workspaceSlug: "primary",
      requiredPermission: "assistants:create",
    });
    expect(createAssistant).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      userId: "user-1",
      data: { name: "Support", temperature: 0.4 },
    });
  });

  it("lists assistants only for the resolved workspace", async () => {
    asMock(listAssistants).mockResolvedValue([{ _id: "assistant-1" }]);

    const response = await getCollection(request("GET"), collectionParams);

    expect(response.status).toBe(200);
    expect(listAssistants).toHaveBeenCalledWith({ workspaceId: "workspace-1" });
    expect(getWorkspaceContext).toHaveBeenCalledWith(
      expect.objectContaining({ requiredPermission: "assistants:manage" })
    );
  });

  it("reads an assistant by ID in the resolved workspace", async () => {
    asMock(getAssistant).mockResolvedValue({ _id: "assistant-1", name: "Support" });

    const response = await getById(request("GET"), assistantParams);

    expect(response.status).toBe(200);
    expect(getAssistant).toHaveBeenCalledWith({
      assistantId: assistantParams.params.id,
      workspaceId: "workspace-1",
    });
  });

  it("updates an assistant only in the resolved workspace", async () => {
    asMock(updateAssistant).mockResolvedValue({ _id: "assistant-1", name: "Updated" });

    const response = await PATCH(request("PATCH", { name: "Updated" }), assistantParams);

    expect(response.status).toBe(200);
    expect(updateAssistant).toHaveBeenCalledWith({
      assistantId: assistantParams.params.id,
      workspaceId: "workspace-1",
      userId: "user-1",
      data: { name: "Updated" },
    });
  });

  it("soft-deletes an assistant only in the resolved workspace", async () => {
    asMock(deleteAssistant).mockResolvedValue({ _id: "assistant-1", deletedAt: "2026-08-15" });

    const response = await DELETE(request("DELETE"), assistantParams);

    expect(response.status).toBe(200);
    expect(deleteAssistant).toHaveBeenCalledWith({
      assistantId: assistantParams.params.id,
      workspaceId: "workspace-1",
      userId: "user-1",
    });
  });

  it("does not reveal an assistant from another workspace", async () => {
    asMock(getWorkspaceContext).mockResolvedValue({
      context: { ...workspace.context, workspaceId: "workspace-2" },
    });
    asMock(getAssistant).mockResolvedValue(null);

    const response = await getById(request("GET"), assistantParams);

    expect(response.status).toBe(404);
    expect(getAssistant).toHaveBeenCalledWith({
      assistantId: assistantParams.params.id,
      workspaceId: "workspace-2",
    });
  });

  it("returns the existing security response for an unauthorized request", async () => {
    asMock(getWorkspaceContext).mockResolvedValue({
      errorResponse: NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED" } },
        { status: 401 }
      ),
    });

    const response = await getCollection(request("GET"), collectionParams);

    expect(response.status).toBe(401);
    expect(listAssistants).not.toHaveBeenCalled();
  });
});
