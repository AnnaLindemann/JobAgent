import { llmInputSchema, type LLMOutput } from "@/agents/llm/types";
import { getLLMClient } from "@/agents/llm/client";

/**
 * Use-case: run a simple LLM call (mock by default) and return normalized output.
 * This keeps business logic out of route handlers.
 */
export async function runLLMTest(bodyUnknown: unknown): Promise<LLMOutput> {
  const input = llmInputSchema.parse(bodyUnknown);

  const llm = getLLMClient();
  return llm.generate(input);
}
