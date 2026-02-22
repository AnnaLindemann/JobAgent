import { prisma } from "@/db/prisma";
import type { JobRepository } from "./jobRepository";
import { Job, JobCreateData, JobUpdateInput } from "@/shared/job";

function mapDbJobToDomain(db: {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  url: string | null;
  status: Job["status"];
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Job {
  return {
    id: db.id,
    title: db.title,
    company: db.company ?? undefined,
    location: db.location ?? undefined,
    url: db.url ?? undefined,
    status: db.status,
    notes: db.notes ?? undefined,
    createdAt: db.createdAt.toISOString(),
    updatedAt: db.updatedAt.toISOString(),
  };
}

export class PrismaJobRepository implements JobRepository {
  async create(data: JobCreateData): Promise<Job> {
    const created = await prisma.job.create({
      data: {
        title: data.title,
        company: data.company ?? null,
        location: data.location ?? null,
        url: data.url ?? null,
        status: data.status,
        notes: data.notes ?? null,
           },
    });

    return mapDbJobToDomain(created);
  }

  async list(): Promise<Job[]> {
    const rows = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapDbJobToDomain);
  }

  async getById(id: string): Promise<Job | null> {
    const row = await prisma.job.findUnique({ where: { id } });
    return row ? mapDbJobToDomain(row) : null;
  }

  async update(id: string, patch: JobUpdateInput): Promise<Job | null> {
    // Prisma update throws if record does not exist, so we guard first.
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) return null;

    const updated = await prisma.job.update({
      where: { id },
      data: {
        title: patch.title ?? undefined,
        company: patch.company === undefined ? undefined : patch.company ?? null,
        location:
          patch.location === undefined ? undefined : patch.location ?? null,
        url: patch.url === undefined ? undefined : patch.url ?? null,
        status: patch.status ?? undefined,
        notes: patch.notes === undefined ? undefined : patch.notes ?? null,
      },
    });

    return mapDbJobToDomain(updated);
  }

  clear(): void {
    // Intentionally sync per interface. Only safe in tests/dev.
    if (process.env.NODE_ENV === "production") {
      throw new Error("PrismaJobRepository.clear() is not allowed in production");
    }
    // Fire-and-forget is dangerous; but interface is sync. We'll keep it safe:
    // call sites in tests should await an explicit helper instead.
    void prisma.job.deleteMany();
  }

  async delete(id: string): Promise<boolean> {
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) return false;

    await prisma.job.delete({ where: { id } });
    return true;
  }
}