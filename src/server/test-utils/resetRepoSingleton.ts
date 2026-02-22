export function resetRepoSingleton(): void {
  (globalThis as unknown as { __jobRepo?: unknown }).__jobRepo = undefined;
}