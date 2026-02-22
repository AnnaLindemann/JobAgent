import { Job, JobCreateInputSchema } from "@/shared/job";
import { JobRepository } from "@/server/repositories/jobRepository";

/**
 * Create a job using the repository.
 * Validates input at the use-case boundary (extra safety beyond route parsing).
 */
export async function createJob(
  repo: JobRepository,
  input: unknown
): Promise<Job> {
const parsed = JobCreateInputSchema.parse(input);

const dataForRepo = {
  ...parsed,
  status: parsed.status ?? "draft",
};

return repo.create(dataForRepo);
}