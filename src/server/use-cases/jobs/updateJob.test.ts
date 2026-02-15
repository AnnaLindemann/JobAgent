import { describe, it, expect } from "vitest";
import { InMemoryJobRepository } from "@/server/repositories/jobRepository.memory";
import { updateJob } from "./updateJob";



describe("updateJob", () => {
  it("throws INVALID_STATUS_TRANSITION when transition is not allowed", async () => {
    const repo = new InMemoryJobRepository();

    const created = await repo.create({
      title: "Test Job",
    });

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

  it("updates status when transition is allowed", async() => {
    const repo = new InMemoryJobRepository();
     const job = await repo.create({
      title: "Test Job"
     });
     expect(job.status).toBe("draft");

      const updated = await updateJob(repo, job.id, { status: "applied" });
    expect(updated?.status).toBe("applied");
     
     expect(updated).not.toBeNull();
  expect(updated?.status).toBe("applied");

  const fromRepo = await repo.getById(job.id);
  expect(fromRepo?.status).toBe("applied");
 
  });});
