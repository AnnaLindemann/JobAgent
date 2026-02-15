import { z } from "zod";
import type { JobRepository } from "@/server/repositories/jobRepository";
import { ApiErrors } from "@/shared/api-error";

/**
 * Input schema for getJobById use-case
 */
const getJobByIdSchema = z.object({
  id: z.string().min(1),
});

export async function getJobById(
  repo: JobRepository,
  input: unknown
) {
  const { id } = getJobByIdSchema.parse(input);

  const job = await repo.getById(id);

  if (!job) {
    throw ApiErrors.notFound("JOB_NOT_FOUND", { id });
  }

  return { job };
}
