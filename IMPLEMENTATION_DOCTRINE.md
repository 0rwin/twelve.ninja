# IMPLEMENTATION_DOCTRINE

## Purpose

This document encodes the coding and architecture rules for twelve.ninja. It exists to make every new file, function, migration, Edge Function, UI component, or infra change predictable, testable, secure, and reviewable. Follow it strictly — exceptions must be explicitly reviewed and recorded in the changelog.

## 1 — High-level principles

*   **Server-authoritative**: All game state changes (combat resolution, XP awards, tile captures, tax changes) must be resolved on the server (Supabase Edge Function or DB function). The client is a view + command issuer only.
*   **Deterministic when required**: Combat and other auditable mechanics must be reproducible from a seed (HMAC(server_secret, match_id + ts)). Side-effects recorded as append-only events.
*   **Minimal client trust**: Validate everything server-side. Client may perform checks for UX, but server enforces rules.
*   **Small vertical slices**: Build a single working path (auth → player record → a single quest → combat log) before expanding features.
*   **Readable, typed contracts**: Use TypeScript for all client code. Generate types from the DB (see 6. DB & types).
*   **One responsibility per service**: UI, API, and background jobs have clearly separated responsibilities.
*   **Immutable audit trail**: Use append-only event_log for anything that matters to player history, moderation, or bio generation.

## 2 — Repo & folder structure (recommended)

```
/ (repo root)
├─ src/                   # client app (React + Vite + TS)
│  ├─ components/
│  ├─ pages/
│  ├─ lib/                # supabase client, api wrappers
│  ├─ styles/
│  └─ types/              # generated types from DB
├─ server/                # Edge Functions, utilities for server-side
│  ├─ edge/               # Supabase Edge Functions (ts)
│  └─ scripts/            # migration helpers, seeders
├─ infra/                 # Terraform / dns scripts / deployment hints
├─ sql/                   # canonical SQL files / migrations
├─ tools/                 # codegen scripts
├─ tests/                 # unit / integration / e2e harness
├─ .github/               # PR templates, workflows
├─ IMPLEMENTATION_DOCTRINE.md
└─ README.md
```

## 3 — Naming & code conventions

*   **Files**: kebab-case for filenames (e.g., `player-profile.tsx`, `resolve-combat.ts`).
*   **Exports**: Prefer named exports for components/utilities. Default export only for pages.
*   **Components**: PascalCase for React components. Keep components < 200 lines.
*   **CSS**: Tailwind utility classes in markup. For complex style blocks use `@apply` inside `components/*.css`.
*   **Functions**: camelCase. Keep small (single purpose). Tests must exist for functions with game logic.
*   **Types**: Prefix server-side types with `Server` when ambiguous. e.g., `ServerCombatResult`.
*   **Env vars**: `VITE_` prefix for client-safe keys. Do not expose server secrets to client.

## 4 — Branching, commits & PR rules

*   **Branches**: `feature/`, `fix/`, `hotfix/`, `chore/`.
*   **Commit messages**: Conventional commits (e.g., `feat(combat): add seeded rng resolver`).
*   **PR checklist** (automated via template):
    *   Describe the vertical slice.
    *   Add tests (unit + integration) covering core logic.
    *   Add SQL migrations (if DB changes).
    *   Add/update event_log schemas if relevant.
    *   Confirm RLS policies updated if writable columns added.
    *   CI passes (lint, build, tests).
*   All PRs require one code review by a different developer (or you if solo) and a short changelog entry.

## 5 — Client architecture & UI rules

*   Use React + Vite + TypeScript. Keep bundles small; prefer code-splitting via `React.lazy`.
*   Components should be presentational by default; stateful logic lives in hooks (e.g., `usePlayer`, `useCombat`).
*   **Centralized state**: Use context or a small store (Zustand recommended) for session and lightweight caches. Avoid heavy global state.
*   **UI kit**: Reuse `Panel`, `SectionHeader`, `StatBlock`, `ProfileCard`. All visuals must adhere to the silhouette-first design tokens in `styles/`.
*   **Accessibility**: All interactive elements must be keyboard-focusable; use `aria-*` where meaningful.
*   **Network requests**: Wrap Supabase calls in `src/lib/api.ts` methods that return typed results `{ ok: true, data } | { ok: false, error }`.
*   **UX pattern**: optimistic UI only for non-authoritative ops (e.g., local UI toggle). Never optimistic for XP, inventory changes, tile capture.

## 6 — DB, types, and migrations

*   **DB**: Postgres in Supabase. Primary tables include: `players`, `player_bios`, `event_log` (append-only), `tiles`, `quests`, `player_skill_alloc`, `enemies`, `tertiary_map`.
*   **Migrations**: Keep canonical SQL files in `/sql/migrations/*.sql`. Migration naming: `YYYYMMDDHHMM__description.sql`.
*   **RLS**: Enable RLS on all non-public tables. Define minimal policies; server uses service role for authority operations.
*   **Type generation**:
    *   Use Supabase / pg-to-ts tooling to generate types into `src/types/db.ts`.
    *   CI step: `npm run generate:types` runs on PRs to keep types up-to-date.

**Example event_log schema minimal**:

```sql
create table event_log (
  id bigserial primary key,
  created_at timestamptz default now(),
  player_id uuid references players(id),
  event_type text not null,
  payload jsonb not null,
  match_id text, -- optional, for seeded events
  processed boolean default false
);
```

Use constraints and CHECKs whenever helpful to enforce invariants.

## 7 — Edge Functions & server-side code

All authoritative rules live in Edge Functions or DB procedures.

*   **Edge function naming**: `resolve-combat`, `resolve-quest-choice`, `generate-bio`, `apply-tax-change`.
*   **Edge functions must**:
    *   Verify JWT and permissions.
    *   Validate input shapes with `zod` or `io-ts`.
    *   Begin DB transaction where multiple writes occur.
    *   Emit event(s) to `event_log` in same transaction (append-only).
    *   Return an explicit seed used for deterministic operations.

**Deterministic RNG pattern (example)**:

```typescript
// seed = HMAC_SHA256(SERVER_SECRET, `${matchId}:${startTs}`)
const rng = seededRNG(seed);
const roll = rng.next(); // reproducible
```

Store seed and `match_id` in `event_log` so any audit can replay.

## 8 — Auth, sessions, and RLS

*   Use Supabase Auth with JWT. Short TTL for tokens; use refresh tokens.
*   Server service role only used from server environment (Edge Functions). Never embed service role in client code.
*   **RLS examples**:
    *   Players can SELECT themselves: `using (auth.uid() = player_id)`
    *   Public bios: to anon `using (true)` for `player_bios` short_bio/short fields only.
    *   Combat resolution and tile capture mutate via Edge functions which use service role.

## 9 — Bio generation & event processing pipeline

Bio generation is a background job (Edge Function triggered from CRON or event).

*   **Pipeline**:
    *   New events written to `event_log`.
    *   `generate-bio` processes high-impact events (weighting), assembles fragments, writes `player_bios`.
*   Bio updated is versioned (`last_updated` and `contributors`).
*   Keep template fragments in JSON (or DB table) so writers can add fragments without code deploys.
*   Add tests to ensure no personal data leaks into bio generation (profanity and PII filter).

## 10 — Observability: logs, metrics, alerts

*   **Client errors** -> Sentry (release tagging).
*   **Server (Edge Functions) logs**: structured JSON logs with event, `player_id`, `match_id`, `duration_ms`.
*   **Metrics**: track D1/D7 retention, average session time, combat win rates, tile contests per day, remove-ads conversion.
*   **Alerts**: critical Edge Function error rate spike, DB slow queries, RLS failures.

## 11 — Security & secrets

*   Store secrets in Vercel / Supabase env vars; never commit them.
*   Server secret used for HMAC must be rotated quarterly; keep rotation strategy (`old_secret`, `new_secret`) to allow replaying old matches.
*   Sanitize all payload fields in `event_log` for display; never render raw JSON to UI.
*   Rate-limit Edge functions to prevent abuse.
*   Use CSP headers and strict cookie settings.

## 12 — Testing strategy

*   **Unit tests** for pure functions (combat math, seed replay). Target 100% coverage on these.
*   **Integration tests** for Edge Functions (use a test Supabase project or mocking).
*   **E2E** for critical flows (signup → create player → run a single combat) in CI.
*   **Replay tests**: generate match seeds, store outcomes, run replay, assert identical results.
*   Run tests in CI on every PR.

## 13 — Performance & cost control

*   Keep payloads small; pages are text-first.
*   Use server-side pagination for logs / public feeds.
*   Cache non-sensitive, read-heavy endpoints using Cloudflare or Supabase Realtime where appropriate.
*   Track and cap background job concurrency to control Supabase usage.

## 14 — Code generation rules (for automated/codegen)

If you generate code (AI or scripts), it must adhere to:

*   TypeScript with explicit types for all inputs/outputs.
*   Include unit tests for generated logic.
*   Include a short comment header: `// GENERATED: reason, generator, timestamp`
*   No secrets or keys in generated files.
*   All DB-altering code must include a SQL migration file.
*   Generated endpoints must call central api wrappers (no direct supabase usage in components).

## 15 — Release & rollback

*   **Release process**:
    *   Merge to main triggers CI build + deploy to staging.
    *   Run smoke tests (auth, create player, one combat).
    *   Promote to production if passing.
*   **Rollback**: keep at least last 3 production deployments ready in Vercel. For DB schema changes:
    *   Use ALTER with backfill scripts, or
    *   Use shadow tables and a migration window with feature flags.
*   Always ensure `event_log` schema is backward compatible.

## 16 — Useful snippets (drop-in)

**Typed API wrapper**:

```typescript
// src/lib/api.ts
import { supabase } from './supabase'
export async function createPlayer(username: string) {
  const { data, error } = await supabase.from('players').insert({ username })
  if (error) return { ok:false, error }
  return { ok:true, data }
}
```

**Seed generation (server)**:

```typescript
import crypto from 'crypto'
function makeSeed(serverSecret: string, matchId: string, ts: string) {
  return crypto.createHmac('sha256', serverSecret).update(`${matchId}:${ts}`).digest('hex')
}
```

## 17 — Onboarding checklist (for new dev or AI)

*   [ ] Run `npm i` and `npm run dev` to start client.
*   [ ] `cp .env.example .env.local` and fill keys (do not commit).
*   [ ] `psql` into test DB for migrations.
*   [ ] `npm run generate:types`.
*   [ ] Run `npm test`.
*   [ ] Read `IMPLEMENTATION_DOCTRINE.md` before making any changes.

## Final note — two operational rules you must never forget

1.  **Auditability over cleverness**. If a solution adds complexity that makes auditing or replaying impossible, it’s the wrong solution. Keep seeds, `match_ids`, and event payloads permanent.
2.  **Small, safe changes**. Prefer incremental DB changes and feature flags. Game systems change player expectations — breakage is costly.
