import { z } from "zod";

/**
 * ApiError schema for runtime validation
 */
export const ApiErrorSchema = z.object({
  code: z.string().min(3),
  message: z.string().min(1),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

/**
 * Domain HTTP Error
 * Used inside use-cases
 */
export class ApiErrorException extends Error {
  public readonly status: number;
  public readonly error: ApiError;

  constructor(status: number, error: ApiError) {
    super(error.message);
    this.name = "ApiErrorException";
    this.status = status;
    this.error = ApiErrorSchema.parse(error); // runtime safety
  }
}

/**
 * Factory helpers
 */
export const ApiErrors = {
  notFound(code: string, details?: ApiError["details"]) {
    return new ApiErrorException(404, {
      code,
      message: "Not found",
      details,
    });
  },

  badRequest(code: string, message: string, details?: ApiError["details"]) {
    return new ApiErrorException(400, {
      code,
      message,
      details,
    });
  },
} as const;
