import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getJobRepository } from "@/server/repositories/jobRepoInstance";
import { updateJob } from "@/server/use-cases/jobs/updateJob";
import type { ApiError } from "@/shared/api";

function errorResponse(status: number, error: ApiError): Response {
  return NextResponse.json({ error }, { status });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await context.params;

  try {
    const repo = getJobRepository();
    const input: unknown = await request.json();
    const updated = await updateJob(repo, id, input);

    if (!updated) {
      return errorResponse(404, {
        code: "JOB_NOT_FOUND",
        message: "Job not found",
        details: {},
      });
    }

    

    return NextResponse.json(
      { job: updated, meta: { source: "in-memory" } },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return errorResponse(400, {
        code: "VALIDATION_ERROR",
        message: "Invalid request body",
        details: { issues: err.issues },
      });
    }

    if (err instanceof Error && err.message.startsWith("INVALID_STATUS_TRANSITION:")) {
      return errorResponse(400, {
        code: "INVALID_STATUS_TRANSITION",
        message: "Invalid status transition",
        details: { reason: err.message },
      });
    }

    return errorResponse(500, {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
      details: {},
    });
  }
}
