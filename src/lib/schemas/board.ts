// src/lib/schemas/board.ts
import * as z from "zod";

export const createBoardSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Board name is required",
    })
    .max(50, {
      message: "Board name cannot be longer than 50 characters",
    }),
  description: z
    .string()
    .max(200, {
      message: "Description cannot be longer than 200 characters",
    })
    .optional(),
});

export type CreateBoardFormValues = z.infer<typeof createBoardSchema>;
