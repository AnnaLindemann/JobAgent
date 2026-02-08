import { describe, it, expect } from "vitest";
import { z } from "zod";

const ApiErrorSchema = z.object({
  code: z.string().min(3),
  message: z.string().min(1),
  details: z.record(z.string(), z.unknown()).optional(),
});

describe("ApiErrorSchema", () => {
  it("accepts a valid error", () => {
    const good = {
      code: "JOB_NOT_FOUND",
      message: "Job not found",
      details: { id: "123", retry: false },
    };

    const res = ApiErrorSchema.safeParse(good);
    expect(res.success).toBe(true);

    if (res.success) {
      expect(res.data.code).toBe("JOB_NOT_FOUND");
    }
  });

  it("rejects an invalid error", () => {
    const bad = {
      code: "NO", // too short
      message: "", // empty
    };

    const res = ApiErrorSchema.safeParse(bad);
    expect(res.success).toBe(false);

    if (!res.success) {
      // Flatten is convenient for UI-like assertions
      const flat = res.error.flatten();
      expect(flat.fieldErrors.code?.length).toBeGreaterThan(0);
      expect(flat.fieldErrors.message?.length).toBeGreaterThan(0);
    }
  });
  it("rejects details when it is an array", () => {
  const bad = {
    code: "BAD_REQUEST",
    message: "Invalid payload",
    details: [], // ❌ array is not a record/object
  };

  const res = ApiErrorSchema.safeParse(bad);

  expect(res.success).toBe(false);

  if (!res.success) {
    const flat = res.error.flatten();
    // We expect an error specifically on "details"
    expect(flat.fieldErrors.details?.length).toBeGreaterThan(0);
  }
});
it("accept details when it is empty object", () => {
  const good = {
    code: "JOB_NOT_FOUND",
    message: "Correct payload",
    details: {},
  }
  const res = ApiErrorSchema.safeParse(good);
  expect(res.success).toBe(true);   

   if (res.success) {
    expect(res.data.details).toEqual({});
   }
})
});
