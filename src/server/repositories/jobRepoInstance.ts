import { PrismaJobRepository } from "./jobRepository.prisma";
import type { JobRepository } from "./jobRepository";

// Keep a single repository instance across route handlers (especially in dev/HMR).
const globalForRepo = globalThis as unknown as {
  __jobRepo?: JobRepository;
};

export function getJobRepository(): JobRepository {
  if (!globalForRepo.__jobRepo) {
    globalForRepo.__jobRepo = new PrismaJobRepository();
  }
  return globalForRepo.__jobRepo;
}