import { z } from "zod";

/**
 * Minimal, provider-agnostic input contract for LLM calls.
 * We keep it small on purpose to avoid leaking provider details
 * into business logic. We'll extend it later (e.g., context, metadata).
 */
export const llmInputSchema = z.object({
  prompt: z.string().min(1).max(1000),
});

export type LLMInput = z.infer<typeof llmInputSchema>;

/**
 * Normalized output contract used across the app.
 * We never propagate raw provider responses outside the LLM layer.
 */
export const llmOutputSchema = z.object({
  text: z.string(),
});

export type LLMOutput = z.infer<typeof llmOutputSchema>;

/**
 * LLM client abstraction. Business code depends on this interface,
 * not on any specific SDK (OpenAI, Anthropic, etc.).
 */
export interface LLMClient {
  generate(input: LLMInput): Promise<LLMOutput>;
}
