import { z } from "zod";

export const CreateMessageSchema = z
  .object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().min(1, "Message content must not be empty").max(100_000),
  })
  .strict();

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
