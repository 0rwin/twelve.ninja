# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Twelve Ninja** is a browser-based tactical game built with React, TypeScript, Vite, and Supabase. The game features hex-based map exploration, world selection, and server-authoritative game mechanics.

## Critical: Read IMPLEMENTATION_DOCTRINE.md First

**MANDATORY**: Before making any code changes, read `IMPLEMENTATION_DOCTRINE.md` in full. This document defines:
- Server-authoritative architecture (all game state changes must be server-side)
- Deterministic combat with seeded RNG
- Append-only event logging for auditability
- Security and validation requirements
- Code generation rules

Key principles from the doctrine:
- Client is view + command issuer only; never trust client input
- All authoritative operations happen in Edge Functions or DB procedures
- Use append-only `event_log` for player history and moderation
- Prefer small vertical slices over large features

## Development Commands

```bash
# Start development server
npm run dev

# Type checking and build
npm run build        # Runs: tsc -b && vite build

# Linting
npm run lint

# Preview production build
npm run preview
```

Note: This project uses `rolldown-vite@7.2.5` as a Vite replacement (see package.json overrides).

## Architecture Overview

### Client Architecture (React + Vite + TypeScript)

**Entry Flow**:
1. `src/main.tsx` → renders `App.tsx`
2. `App.tsx` → manages routing between `WorldSelection` and `GameContainer`
3. `GameContainer` → orchestrates `GameViewport` (map view) and `TileExploration` (tile detail view)

**Key State Management**:
- Local React state for UI (no global state library currently)
- `GameContainer` tracks: current screen (map/exploration), selected tile, player state (HP, stamina, ryo)
- Responsive hex sizing calculated based on viewport width

**Component Structure**:
- `components/layout/` - Background layouts and structural components
- `components/game/` - Game-specific components (TileCard, CombatLog)
- `components/ui/` - Reusable UI elements (Button, etc.)
- `components/auth/` - Authentication forms
- `pages/` - Top-level page components

**Design System**:
- Tailwind CSS for styling (utility-first)
- "Ink Wash" design system with silhouette-first approach
- Color tokens and design language defined in styles/

### Server Architecture (Supabase Edge Functions)

**Edge Functions** live in `server/edge/`:
- Written in TypeScript for Deno runtime
- Use Zod for input validation
- Access DB with service role (never expose to client)
- Example: `server/edge/get-tiles/index.ts` - fetches tiles by axial coordinate bounds

**API Pattern**:
- Client calls Edge Functions via `fetch` (see `src/lib/api.ts`)
- All API wrappers return typed results: `{ ok: true, data } | { ok: false, error }`
- Never call Supabase directly from components; use api.ts wrappers

**Database**:
- Postgres via Supabase
- Migrations in `sql/migrations/` with format: `YYYYMMDDHHMM__description.sql`
- Tables include: `players`, `tiles`, `event_log` (append-only), `player_bios`, etc.
- RLS enabled on all non-public tables

### Hex Map System

**Coordinate System**:
- Uses axial coordinates (q, r) for hex positioning
- Pointy-top hex orientation
- Conversion utilities in `src/lib/hex.ts`

**Key Functions**:
- `axialToPixel({ q, r }, originX, originY, hexWidth, hexHeight)` - converts grid coords to screen pixels
- Responsive: hex size recalculates on viewport resize (see `GameContainer.tsx:22-33`)

**Constants**:
- Default `HEX_SIZE = 96` pixels (for backward compatibility)
- `HEX_WIDTH = HEX_SIZE`
- `HEX_HEIGHT = Math.sqrt(3) / 2 * HEX_WIDTH`

### Game Actions & Player State

**Game Actions** (`src/lib/gameActions.ts`):
- `executeAction(playerId, actionType, payload)` - sends action to server
- `fetchPlayerState(playerId)` - retrieves current player stats
- Action types: combat, exploration, skill allocation, etc.

**Player State** (`src/types/game.ts`):
```typescript
{
  id, username, email, primary_code,
  level, xp, ryo,
  current_tile_id,
  stamina, max_stamina,
  skill_points
}
```

## Code Conventions (from IMPLEMENTATION_DOCTRINE.md)

**Files**: kebab-case (`player-profile.tsx`, `resolve-combat.ts`)

**Exports**: Prefer named exports for components/utilities; default export only for pages

**Components**:
- PascalCase
- Keep < 200 lines
- Presentational by default; stateful logic in hooks

**Functions**: camelCase, single purpose, must have tests for game logic

**Types**: Prefix server-side types with `Server` when ambiguous (e.g., `ServerCombatResult`)

**Environment Variables**:
- `VITE_` prefix for client-safe variables
- Never expose server secrets to client
- Example: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## TypeScript Configuration

- Strict mode enabled
- `noUnusedLocals` and `noUnusedParameters` disabled (tsconfig.app.json:26-27)
- Target ES2022, JSX: react-jsx
- Module resolution: bundler mode

## Testing Requirements

Per IMPLEMENTATION_DOCTRINE.md:
- Unit tests required for pure functions (combat math, seed replay)
- Integration tests for Edge Functions
- E2E for critical flows (signup → create player → combat)
- Replay tests for deterministic operations (seeded RNG)
- Target 100% coverage on game logic functions

## Security Guidelines

**Never**:
- Trust client input (validate server-side)
- Expose service role keys in client code
- Skip input validation in Edge Functions
- Commit secrets to repo

**Always**:
- Use Zod/io-ts for Edge Function input validation
- Begin DB transactions for multi-write operations
- Emit events to `event_log` in same transaction
- Rate-limit Edge Functions
- Sanitize `event_log` payloads before rendering

## Common Patterns

**API Wrapper Example** (from `src/lib/api.ts`):
```typescript
export async function fetchTilesBounds(qMin, qMax, rMin, rMax) {
  // Use Supabase Edge Functions endpoint (replace <your-project-ref>)
  const res = await fetch('https://<your-project-ref>.supabase.co/functions/v1/get-tiles', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ qMin, qMax, rMin, rMax })
  })
  const payload = await res.json()
  if (!payload.ok) return { ok: false, error: payload.error }
  return { ok: true, tiles: payload.tiles }
}
```

**Seeded RNG Pattern** (server-side, from IMPLEMENTATION_DOCTRINE.md):
```typescript
// seed = HMAC_SHA256(SERVER_SECRET, `${matchId}:${startTs}`)
const rng = seededRNG(seed);
const roll = rng.next(); // reproducible
```

Store seed and `match_id` in `event_log` for replay auditing.

## Git Workflow

**Branches**: `feature/`, `fix/`, `hotfix/`, `chore/`

**Commit Messages**: Conventional commits format
- Example: `feat(combat): add seeded rng resolver`
- Example: `fix(map): correct hex coordinate calculation`

**PR Requirements**:
- Describe the vertical slice
- Add tests covering core logic
- Include SQL migrations if DB changes
- Update event_log schemas if relevant
- Confirm RLS policies updated for new writable columns
- CI must pass (lint, build, tests)

## Files of Interest

- `IMPLEMENTATION_DOCTRINE.md` - **Read this first** before any code changes
- `src/lib/supabase.ts` - Supabase client initialization
- `src/lib/api.ts` - API wrappers for server calls
- `src/lib/hex.ts` - Hex coordinate system utilities
- `src/types/game.ts` - Core game type definitions
- `server/edge/get-tiles/index.ts` - Example Edge Function pattern
- `sql/migrations/` - Database schema migrations

## Operational Rules (from IMPLEMENTATION_DOCTRINE.md)

1. **Auditability over cleverness**: If a solution prevents auditing or replaying, it's wrong. Keep seeds, match_ids, and event payloads permanent.

2. **Small, safe changes**: Prefer incremental DB changes and feature flags. Game system changes affect player expectations—breakage is costly.
