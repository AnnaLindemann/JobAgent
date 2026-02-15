import { Job, JobCreateInput, JobUpdateInput } from "@/shared/job";

/**
 * Repository interface for Job persistence.
 * Use-cases depend on this interface, not on a concrete storage implementation.
 */
export interface JobRepository {
  create(data: JobCreateInput): Promise<Job>;

  list(): Promise<Job[]>;

  getById(id: string): Promise<Job | null>;

  update(id: string, patch: JobUpdateInput): Promise<Job | null>;
}
