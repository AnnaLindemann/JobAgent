import { NextResponse } from "next/server";
import { z } from "zod";
import { runLLMTest } from "@/server/use-cases/llmTest";

export const runtime = "nodejs";

const responseSchema = z.object({
  text: z.string(),
});

export async function POST(req: Request) {
  try {
    const bodyUnknown: unknown = await req.json();
    const output = await runLLMTest(bodyUnknown);

    const payload = responseSchema.parse({ text: output.text });
    return NextResponse.json(payload);
  } catch (_err: unknown) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
