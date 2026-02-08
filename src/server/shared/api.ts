import {z} from "zod";

export const ApiErrorSchema = z.object({
  code:z.string().min(3),
  message: z.string().min(1),
  details: z.record(z.string(),z.unknown()).optional(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>