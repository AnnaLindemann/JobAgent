import { NextResponse } from "next/server";
import { z } from "zod";
import { MockLLMClient } from "@/agents/llm/mock";
import { llmInputSchema } from "@/agents/llm/types";

export const runtime = "nodejs";

/**
 * Request schema for this specific endpoint.
 * We reuse the shared LLM input schema to keep contracts consistent.
 */
const requestSchema = llmInputSchema;

/**
 * Response schema for stability: route handlers should return predictable JSON.
 */
const responseSchema = z.object({
  text: z.string(),
});

export async function POST(req: Request) {
  try {
    const bodyUnknown: unknown = await req.json();
    const input = requestSchema.parse(bodyUnknown);

    const llm = new MockLLMClient();
    const output = await llm.generate(input);

    const payload = responseSchema.parse({ text: output.text });
    return NextResponse.json(payload);
  } catch (err: unknown) {
    // Return a clean 400 for validation/parsing errors (instead of a 500).
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
