import { z } from "zod";
import { AI_MODEL_IDS } from "@/constants/models";

const promptTemplateSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    prompt: z.string().min(1).max(10_000),
  })
  .strict();

const enabledToolSchema = z.string().trim().min(1).max(100);

export const CreateAssistantSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().max(2_000).optional(),
    avatar: z.string().trim().min(1).max(500).optional(),
    aiModel: z.enum(AI_MODEL_IDS).optional(),
    systemPrompt: z.string().max(20_000).optional(),
    personality: z.string().trim().max(1_000).optional(),
    temperature: z.number().min(0).max(2).optional(),
    promptTemplates: z.array(promptTemplateSchema).max(50).optional(),
    visibility: z.enum(["workspace", "private"]).optional(),
    enabledTools: z.array(enabledToolSchema).max(20).optional(),
  })
  .strict();

export const UpdateAssistantSchema = CreateAssistantSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one assistant field must be provided"
);

export const AssistantIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid assistant ID");

export type CreateAssistantInput = z.infer<typeof CreateAssistantSchema>;
export type UpdateAssistantInput = z.infer<typeof UpdateAssistantSchema>;
