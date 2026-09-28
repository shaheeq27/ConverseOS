import { z } from "zod";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const CreateConversationSchema = z
  .object({
    assistantId: z.string().regex(objectIdRegex, "Invalid assistant ID"),
    title: z.string().trim().min(1).max(200).optional(),
  })
  .strict();

export const UpdateConversationSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    isPinned: z.boolean().optional(),
  })
  .strict()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one conversation field must be provided"
  );

export const ConversationIdSchema = z
  .string()
  .regex(objectIdRegex, "Invalid conversation ID");

export type CreateConversationInput = z.infer<typeof CreateConversationSchema>;
export type UpdateConversationInput = z.infer<typeof UpdateConversationSchema>;
