import type { Job } from "@/shared/job";

type DbJob = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  url: string | null;
  status: Job["status"];
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function mapDbJobToDomain(db: DbJob): Job {
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