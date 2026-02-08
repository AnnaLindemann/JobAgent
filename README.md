# Job Agent (MVP)

Job Agent is a Next.js fullstack app to track job applications and (later) assist with email ingestion and AI-driven suggestions (RAG + agent tools).

## Tech Stack
- Next.js (App Router) + TypeScript
- pnpm
- Zod (runtime validation)
- LLM layer: Mock-first (real provider later)

## Requirements
- Node.js (LTS recommended)
- pnpm

## Quick Start

### 1 Install
```bash
pnpm install
2 Environment
Create .env.local in the project root (do not commit it).
See .env.example for the required variables.

3 Run
pnpm dev
Open:

http://localhost:3000

4 Health check
curl -s http://localhost:3000/api/health | cat
5 Mock LLM test
curl -s -X POST http://localhost:3000/api/llm/test \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello from mock"}' | cat
##Scripts
pnpm dev — start dev server

pnpm build — production build

pnpm start — run production server

pnpm lint — lint

pnpm typecheck — TypeScript type check

Environment Variables
Defined in .env.example.

OPENAI_API_KEY — required (used only when real LLM provider is enabled)

Project Structure (Boundaries)
src/app/ — UI and route handlers (thin HTTP layer)

src/server/ — use-cases / business logic (provider-agnostic)

src/agents/ — LLM/RAG tools and integrations (mock/real providers)

src/shared/ — shared types and Zod schemas

##Development Rules
Code comments are always in English.

Strict TypeScript: no any (use unknown + Zod validation).

Small steps with verification after each change.

Commit + push after each completed step.

Mock-first for LLM until billing is enabled.

##Project Structure (Boundaries)

- `src/server/` — use-cases / business logic (provider-agnostic; callable from API/cron/n8n)
