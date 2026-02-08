import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const requestSchema = z.object({
  prompt: z.string().min(1).max(200),
});

const responseSchema = z.object({
  text: z.string(),
});

export async function POST(req: Request) {
  const bodyUnknown: unknown = await req.json();
  const body = requestSchema.parse(bodyUnknown);

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const completion = await client.responses.create({
    model: "gpt-4.1-mini",
    input: body.prompt,
  });

 
  const payloadUnknown: unknown = { text: completion.output_text };
  const payload = responseSchema.parse(payloadUnknown);

  return NextResponse.json(payload);
}
