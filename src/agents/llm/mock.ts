import { llmOutputSchema, type LLMClient, type LLMInput } from "./types";

/**
 * Mock implementation used while billing/real provider is unavailable.
 * This should be deterministic and cheap, so it can be used in dev/tests
 * without network calls.
 */
export class MockLLMClient implements LLMClient {
  async generate(input: LLMInput) {
    const text =
      `MOCK RESPONSE\n` +
      `Prompt length: ${input.prompt.length}\n` +
      `This is a fake LLM response while using the mock provider.`;

    // Validate the normalized contract even in mock to keep behavior consistent.
    return llmOutputSchema.parse({ text });
  }
}
