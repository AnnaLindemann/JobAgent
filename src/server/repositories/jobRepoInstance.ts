import { InMemoryJobRepository } from "./jobRepository.memory";
import { PrismaJobRepository } from "./jobRepository.prisma";
import type { JobRepository } from "./jobRepository";

// Keep a single repository instance across route handlers (especially in dev/HMR).
declare global {
  // eslint-disable-next-line no-var
  var __jobRepo: JobRepository | undefined;
}

function createRepository(): JobRepository {
  if (process.env.JOB_REPO === "prisma") {
    return new PrismaJobRepository();
  }
  return new InMemoryJobRepository();
}

export function getJobRepository(): JobRepository {
  if (!globalThis.__jobRepo) {
    globalThis.__jobRepo = createRepository();
  }
  return globalThis.__jobRepo;
}