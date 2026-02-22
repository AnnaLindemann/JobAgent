import { Job, JobCreateData, JobUpdateInput } from "@/shared/job";
import { JobRepository } from "./jobRepository";


/**
 * In-memory implementation of JobRepository.
 * This is a temporary storage used to validate domain logic and API shape
 * before introducing a real database.
 */
export class InMemoryJobRepository implements JobRepository {
  private readonly store = new Map<string, Job>();

  async create(data: JobCreateData): Promise<Job> {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const job: Job = {
      id,
      title: data.title,
      company: data.company,
      location: data.location,
      url: data.url,
      notes: data.notes,
      status: data.status ?? "draft",
      createdAt: now,
      updatedAt: now,
      
    };

    this.store.set(id, job);
    return job;
  }

  async list(): Promise<Job[]> {
    return Array.from(this.store.values());
  }

  async getById(id: string): Promise<Job | null> {
    return this.store.get(id) ?? null;
  }

  async update(id: string, patch: JobUpdateInput): Promise<Job | null> {
    const existing = this.store.get(id);
    if (!existing) {
      return null;
    }

    const updated: Job = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    this.store.set(id, updated);
    return updated;
  };
  clear(): void {
  this.store.clear();
}
async delete(id: string): Promise<boolean> {
  return this.store.delete(id);
}


}