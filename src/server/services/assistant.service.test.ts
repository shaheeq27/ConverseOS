jest.mock("@/server/db/connect", () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/server/db/models/Assistant", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

import AssistantModel from "@/server/db/models/Assistant";
import {
  createAssistant,
  deleteAssistant,
  getAssistant,
  listAssistants,
  updateAssistant,
} from "@/server/services/assistant.service";

const asMock = (method: unknown) => method as jest.Mock;
const lean = (value: unknown) => ({ lean: jest.fn().mockResolvedValue(value) });

describe("Assistant service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates an assistant in the authenticated workspace with audit fields", async () => {
    const assistant = { _id: "assistant-1", name: "Support" };
    asMock(AssistantModel.create).mockResolvedValue(assistant);

    await expect(
      createAssistant({
        workspaceId: "workspace-1",
        userId: "user-1",
        data: { name: "Support", temperature: 0.4 },
      })
    ).resolves.toBe(assistant);

    expect(AssistantModel.create).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      createdBy: "user-1",
      updatedBy: "user-1",
      name: "Support",
      temperature: 0.4,
    });
  });

  it("reads an assistant only when it belongs to the requested workspace", async () => {
    const assistant = { _id: "assistant-1", workspaceId: "workspace-1" };
    asMock(AssistantModel.findOne).mockReturnValue(lean(assistant));

    await expect(
      getAssistant({ assistantId: "assistant-1", workspaceId: "workspace-1" })
    ).resolves.toBe(assistant);

    expect(AssistantModel.findOne).toHaveBeenCalledWith({
      _id: "assistant-1",
      workspaceId: "workspace-1",
      deletedAt: null,
    });
  });

  it("lists only non-deleted assistants from the requested workspace", async () => {
    const assistants = [{ _id: "assistant-1" }];
    const query = {
      sort: jest.fn().mockReturnValue(lean(assistants)),
    };
    asMock(AssistantModel.find).mockReturnValue(query);

    await expect(listAssistants({ workspaceId: "workspace-1" })).resolves.toBe(assistants);

    expect(AssistantModel.find).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      deletedAt: null,
    });
    expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it("updates only a non-deleted assistant in the requested workspace", async () => {
    const assistant = { _id: "assistant-1", name: "Updated" };
    asMock(AssistantModel.findOneAndUpdate).mockReturnValue(lean(assistant));

    await expect(
      updateAssistant({
        assistantId: "assistant-1",
        workspaceId: "workspace-1",
        userId: "user-1",
        data: { name: "Updated" },
      })
    ).resolves.toBe(assistant);

    expect(AssistantModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "assistant-1", workspaceId: "workspace-1", deletedAt: null },
      { $set: { name: "Updated", updatedBy: "user-1" } },
      { new: true, runValidators: true }
    );
  });

  it("soft-deletes only the assistant in the requested workspace", async () => {
    const assistant = { _id: "assistant-1", deletedAt: new Date() };
    asMock(AssistantModel.findOneAndUpdate).mockReturnValue(lean(assistant));

    await expect(
      deleteAssistant({
        assistantId: "assistant-1",
        workspaceId: "workspace-1",
        userId: "user-1",
      })
    ).resolves.toBe(assistant);

    expect(AssistantModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "assistant-1", workspaceId: "workspace-1", deletedAt: null },
      { $set: { deletedAt: expect.any(Date), updatedBy: "user-1" } },
      { new: true }
    );
  });

  it("does not expose an assistant from another workspace", async () => {
    asMock(AssistantModel.findOne).mockReturnValue(lean(null));

    await expect(
      getAssistant({ assistantId: "assistant-in-workspace-a", workspaceId: "workspace-b" })
    ).resolves.toBeNull();

    expect(AssistantModel.findOne).toHaveBeenCalledWith({
      _id: "assistant-in-workspace-a",
      workspaceId: "workspace-b",
      deletedAt: null,
    });
  });
});
