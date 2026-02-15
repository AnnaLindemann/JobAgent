import { z } from "zod";
import type { JobRepository } from "@/server/repositories/jobRepository";
import { ApiErrors } from "@/shared/api-error";

const deleteJobSchema = z.object({
  id: z.string().min(1),
});

export async function deleteJob(repo: JobRepository, input: unknown) {
  const { id } = deleteJobSchema.parse(input);

  const deleted = await repo.delete(id);

  if (!deleted) {
    throw ApiErrors.notFound("JOB_NOT_FOUND", { id });
  }

  return { deleted: true };
}
