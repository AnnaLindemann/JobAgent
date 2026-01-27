import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "job-agent",
    timestamp: new Date().toISOString(),
    hasOpenAIKey: Boolean(env.OPENAI_API_KEY),
  });
}
