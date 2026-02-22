import { prisma } from "@/db/prisma";

export async function resetDb(): Promise<void> {
  await prisma.job.deleteMany();
}