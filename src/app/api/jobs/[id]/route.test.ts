import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import { getJobRepository } from "@/server/repositories/jobRepoInstance";


describe("GET /api/jobs/:id", () => {
  beforeEach(() => {
    // Reset in-memory repo between tests
    const repo = getJobRepository();
    repo.clear?.(); // если есть clear()
  });

  it("returns 200 and job when found", async () => {
    const repo = getJobRepository();

    const created = await repo.create({
      title: "Test GET",
    });

    const response = await GET(
      new Request("http://localhost"),
      {
        params: Promise.resolve({ id: created.id }),
      }
    );

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body.job.id).toBe(created.id);
    expect(body.job.title).toBe("Test GET");
  });

  it("returns 404 when job not found", async () => {
    const response = await GET(
      new Request("http://localhost"),
      {
        params: Promise.resolve({ id: "non-existent-id" }),
      }
    );

    expect(response.status).toBe(404);

    const body = await response.json();

    expect(body.error.code).toBe("JOB_NOT_FOUND");
  });
});
