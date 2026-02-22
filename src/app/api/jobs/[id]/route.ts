import { NextResponse } from "next/server";
import { getJobRepository } from "@/server/repositories/jobRepoInstance";
import { updateJob } from "@/server/use-cases/jobs/updateJob";
import type { ApiError } from "@/shared/api";
import { mapErrorToResponse } from "@/shared/mapErrorToResponse";
import { getJobById } from "@/server/use-cases/jobs/getJobById";
import { deleteJob } from "@/server/use-cases/jobs/deleteJob";


function errorResponse(status: number, error: ApiError): Response {
  return NextResponse.json({ error }, { status });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await context.params;

    const repo = getJobRepository();
    const result = await getJobById(repo, { id });

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    return mapErrorToResponse(err);
  }
}


export async function PATCH(
  request: Request,
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

     return mapErrorToResponse(err);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await context.params;

    const repo = getJobRepository();
    const result = await deleteJob(repo, { id });

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    return mapErrorToResponse(err);
  }
}
