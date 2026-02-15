import { Job } from "@/shared/job";
import { JobRepository } from "../../repositories/jobRepository";

/**
 * List jobs from the repository.
 * Sorting/filtering can be added later without touching route handlers.
 */

export async function listJobs(repo: JobRepository): Promise<Job[]>{
  return repo.list()
}