import { describe, it, expect, beforeEach } from "vitest";
import { DELETE } from "./route";
import { getJobRepository } from "@/server/repositories/jobRepoInstance";

describe("DELETE /api/jobs/:id", () => {
  beforeEach(() => {
    getJobRepository().clear();
  });

  it("returns 200 and deleted=true when found", async () => {
    const repo = getJobRepository();
    const created = await repo.create({ title: "To delete" });

    const res = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ id: created.id }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.deleted).toBe(true);

    const after = await repo.getById(created.id);
    expect(after).toBeNull();
  });

  it("returns 404 when job not found", async () => {
    const res = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ id: "missing" }),
    });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error.code).toBe("JOB_NOT_FOUND");
  });
});
