import { InMemoryJobRepository } from "./jobRepository.memory";
import { JobRepository } from "./jobRepository";

// Keep a single repository instance across route handlers (especially in dev/HMR).
declare global {
  // eslint-disable-next-line no-var
  var __jobRepo: JobRepository | undefined;
}

export function getJobRepository(): JobRepository {
  if (!globalThis.__jobRepo) {
    globalThis.__jobRepo = new InMemoryJobRepository();
  }
  return globalThis.__jobRepo;
}