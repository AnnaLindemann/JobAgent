import { MockLLMClient } from "./mock";
import type { LLMClient } from "./types";

/**
 * Provider switch for LLM client.
 * Keep this logic in one place so the rest of the codebase stays provider-agnostic.
 */
export function getLLMClient(): LLMClient {
  const provider = process.env.LLM_PROVIDER ?? "mock";

  if (provider === "mock") {
    return new MockLLMClient();
  }

  // We don't enable the real provider yet (billing not ready).
  // When billing is available, we'll add OpenAIClient here.
  return new MockLLMClient();
}