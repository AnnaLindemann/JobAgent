import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiErrorException } from "@/shared/api-error";

export function mapErrorToResponse(err: unknown): Response {
  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: { issues: err.issues },
        },
      },
      { status: 400 }
    );
  }

  if (err instanceof ApiErrorException) {
    return NextResponse.json(
      { error: err.error },
      { status: err.status }
    );
  }

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong",
        details: {},
      },
    },
    { status: 500 }
  );
}
