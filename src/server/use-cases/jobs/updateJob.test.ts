import { describe, it, expect, beforeEach } from "vitest";
import { updateJob } from "./updateJob";
import { PrismaJobRepository } from "@/server/repositories/jobRepository.prisma";
import { resetDb } from "@/server/test-utils/resetDb";

describe("updateJob", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("throws INVALID_STATUS_TRANSITION when transition is not allowed", async () => {
    const repo = new PrismaJobRepository();

    const created = await repo.create({ title: "Test Job", status: "draft" });

    // Sanity: starts as draft
    expect(created.status).toBe("draft");

    // Move forward to applied (allowed)
    const applied = await updateJob(repo, created.id, { status: "applied" });
    expect(applied?.status).toBe("applied");

    // Now try to go backwards (not allowed): applied -> draft
    await expect(updateJob(repo, created.id, { status: "draft" })).rejects.toThrow(
      /INVALID_STATUS_TRANSITION: applied -> draft/
    );

    // Ensure status did not change after failed update
    const after = await repo.getById(created.id);
    expect(after?.status).toBe("applied");
  });

  it("updates status when transition is allowed", async () => {
    const repo = new PrismaJobRepository();

    const job = await repo.create({ title: "Test Job", status: "draft" });
    expect(job.status).toBe("draft");

    const updated = await updateJob(repo, job.id, { status: "applied" });

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe("applied");

    const fromRepo = await repo.getById(job.id);
    expect(fromRepo?.status).toBe("applied");
  });
});