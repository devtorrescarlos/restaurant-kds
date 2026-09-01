<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Tech stack

- **Next.js 16.3** (App Router, React 19)
- **Prisma 7** with PostgreSQL 16 (via Docker Compose)
- **Vitest** for testing, **ESLint 9** for linting
- **shadcn/ui** (base-nova style) + Tailwind CSS v4
- **Node 24** (CI target)

## Quick commands

```bash
npm run lint            # ESLint
npm run test            # Vitest (unit + integration)
npm run unit-test       # Exclude integration tests
npm run integration-test # Integration tests only
npm run build           # Production build
npm run dev             # Dev server (localhost:3000)
npm run db:seed         # Seed database (Postgres must be running)
```

## Database

- PostgreSQL via Docker Compose: `docker compose up -d`
- Prisma schema: `prisma/schema.prisma`
- Client generated to: `src/generated/prisma/`
- `postinstall` runs `prisma generate`
- Seed command: `npm run db:seed` (runs `tsx prisma/seed.ts`)
- Requires `DATABASE_URL` in `.env` (see `.env.example`)

## Path alias

- `@/*` maps to `./src/*`

## Testing

- Unit tests mock Prisma (see `vi.mock("@/lib/prisma")` pattern)
- Integration tests live in `src/app/api/**/*.integration.test.ts`
- Test helpers in `src/lib/test-helpers.ts`
- Coverage excludes: `src/generated/**`, test files, `src/lib/test-helpers.ts`

## CI (GitHub Actions)

Three parallel jobs on push/PR to `main` and `development`:
1. `npm run lint`
2. `npm run test`
3. `npm run build`

## Project structure

```
src/
  app/           # Next.js App Router (pages + API routes)
  components/    # Shared UI components (shadcn/ui)
  features/      # Domain features (e.g., admin/)
  generated/     # Prisma generated client (don't edit manually)
  hooks/         # React hooks
  lib/           # Utilities (prisma client, API helpers, errors)
```

## Key conventions

- Service layer pattern: `src/features/<domain>/services/*.service.ts`
- Validations: `src/features/<domain>/validations/*.schema.ts` (Zod)
- API responses use helpers from `src/lib/api.ts` (`success`, `error`, `paginate`)
- Custom `ServiceError` class in `src/lib/errors.ts` for HTTP error codes
- Prisma enums used as TypeScript types (import from `@/generated/prisma/enums`)
