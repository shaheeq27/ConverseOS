import { NextRequest } from "next/server";

jest.mock("@/server/db/connect", () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/server/db/models/Session", () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}));

jest.mock("@/server/db/models/User", () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}));

jest.mock("@/server/db/models/Organization", () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}));

jest.mock("@/server/db/models/Workspace", () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}));

jest.mock("@/server/db/models/Membership", () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}));

import SessionModel from "@/server/db/models/Session";
import UserModel from "@/server/db/models/User";
import OrganizationModel from "@/server/db/models/Organization";
import WorkspaceModel from "@/server/db/models/Workspace";
import MembershipModel from "@/server/db/models/Membership";
import { GET } from "./route";

const asMock = (method: unknown) => method as jest.Mock;
const lean = (value: unknown) => ({ lean: jest.fn().mockResolvedValue(value) });

function request(sessionToken?: string) {
  return new NextRequest(
    "http://localhost/api/v0.3/organizations/acme/workspaces/primary/context",
    sessionToken ? { headers: { cookie: `converseos_session=${sessionToken}` } } : undefined
  );
}

const params = { params: { orgSlug: "acme", workspaceSlug: "primary" } };

describe("GET /api/v0.3/organizations/[orgSlug]/workspaces/[workspaceSlug]/context", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when no database session cookie is present", async () => {
    const response = await GET(request(), params);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: { code: "UNAUTHORIZED" },
    });
  });

  it("returns 404 when the requested organization does not exist", async () => {
    asMock(SessionModel.findOne).mockReturnValue(lean({ userId: "user-1" }));
    asMock(UserModel.findOne).mockReturnValue(lean({ _id: "user-1" }));
    asMock(OrganizationModel.findOne).mockReturnValue(lean(null));

    const response = await GET(request("valid-token"), params);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: { code: "ORG_NOT_FOUND" },
    });
  });

  it("returns 403 when the authenticated user is not a workspace member", async () => {
    asMock(SessionModel.findOne).mockReturnValue(lean({ userId: "user-1" }));
    asMock(UserModel.findOne).mockReturnValue(lean({ _id: "user-1" }));
    asMock(OrganizationModel.findOne).mockReturnValue(lean({ _id: "org-1" }));
    asMock(WorkspaceModel.findOne).mockReturnValue(lean({ _id: "workspace-1" }));
    asMock(MembershipModel.findOne).mockReturnValue(lean(null));

    const response = await GET(request("valid-token"), params);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: { code: "MEMBERSHIP_REQUIRED" },
    });
  });

  it("returns 200 with the canonical workspace context for a member", async () => {
    asMock(SessionModel.findOne).mockReturnValue(lean({ userId: "user-1" }));
    asMock(UserModel.findOne).mockReturnValue(lean({ _id: "user-1" }));
    asMock(OrganizationModel.findOne).mockReturnValue(lean({ _id: "org-1" }));
    asMock(WorkspaceModel.findOne).mockReturnValue(lean({ _id: "workspace-1" }));
    asMock(MembershipModel.findOne).mockReturnValue(lean({ role: "member" }));

    const response = await GET(request("valid-token"), params);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        userId: "user-1",
        orgId: "org-1",
        workspaceId: "workspace-1",
        membershipRole: "member",
        orgSlug: "acme",
        workspaceSlug: "primary",
      },
    });
  });
});
