import { Job, JobUpdateInput,JobUpdateInputSchema } from "@/shared/job";
import { JobRepository } from "@/server/repositories/jobRepository";

const allowedTransitions: Record<string, readonly string[]> = {
  draft: ["applied", "archived"],
  applied: ["interview", "rejected", "archived"],
  interview: ["offer", "rejected", "archived"],
  offer: ["archived"],
  rejected: ["archived"],
  archived: [],
};

function isAllowedTransition(from: string, to: string): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

/**
 * Update a job by id.
 * Returns null if the job does not exist.
 */
export async function updateJob(
  repo: JobRepository,
  id: string,
  input: unknown
): Promise<Job | null> {
  const patch: JobUpdateInput = JobUpdateInputSchema.parse(input);

  const existing = await repo.getById(id);
  if (!existing) {
    return null;
  }

  if (patch.status && patch.status !== existing.status) {
    const ok = isAllowedTransition(existing.status, patch.status);
    if (!ok) {
      // We'll standardize this into ApiError later in the route handler layer.
      throw new Error(
        `INVALID_STATUS_TRANSITION: ${existing.status} -> ${patch.status}`
      );
    }
  }

  return repo.update(id, patch);
}