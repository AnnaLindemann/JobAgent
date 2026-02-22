export function getRepoSource(): "postgres" | "in-memory" {
  return process.env.JOB_REPO === "prisma" ? "postgres" : "in-memory";
}