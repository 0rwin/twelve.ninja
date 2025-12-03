---
description: Repository Information Overview
alwaysApply: true
---

# Twelve Ninja Information

## Summary

Twelve Ninja is a browser-based tactical game built with React, TypeScript, and Vite on the frontend, powered by Supabase for authentication, database, and server-authoritative game logic via Edge Functions. The project emphasizes a secure, auditable game state with append-only event logging and deterministic RNG for reproducible combat outcomes.

## Structure

**Root-level directories:**
- `src/` - React frontend application (TypeScript)
  - `components/` - Reusable and page-specific React components
  - `pages/` - Top-level page components (LandingPage, LoginPage, SignUpPage, MapPage, etc.)
  - `lib/` - Utility functions (api.ts, auth.tsx, gameActions.ts, hex.ts, supabase.ts)
  - `types/` - TypeScript type definitions (db.ts, game.ts)
  - `hooks/` - Custom React hooks (useGameLogic.ts)
  - `data/` - Static game data (worldData.ts, map_layout.json)
- `server/edge/` - Deno-based Supabase Edge Functions (TypeScript)
- `sql/migrations/` - PostgreSQL migration files for schema management
- `dist/` - Build output (auto-generated)
- Documentation files: IMPLEMENTATION_DOCTRINE.md (architecture & coding standards), CLAUDE.md, GEMINI.md

## Language & Runtime

**Language**: TypeScript  
**Target**: ES2022  
**Frontend Runtime**: Browser (React 19.2.0)  
**Backend Runtime**: Deno (Supabase Edge Functions)  
**Build System**: Vite (with rolldown-vite@7.2.5 override)  
**Package Manager**: npm

## Dependencies

**Main Dependencies:**
- `react@^19.2.0` - UI library
- `react-dom@^19.2.0` - DOM rendering
- `react-router-dom@^7.9.6` - Client-side routing
- `@supabase/supabase-js@^2.84.0` - Supabase client
- `tailwindcss@^4.1.17` - Utility-first CSS framework
- `tailwind-merge@^3.4.0` - Tailwind class merging utility
- `framer-motion@^12.23.24` - Animation library
- `lucide-react@^0.554.0` - Icon library
- `clsx@^2.1.1` - Class name utility

**Development Dependencies:**
- `typescript@~5.9.3` - TypeScript compiler
- `vite@npm:rolldown-vite@7.2.5` - Build tool
- `@vitejs/plugin-react@^5.1.1` - React Fast Refresh plugin
- `eslint@^9.39.1` with `typescript-eslint@^8.46.4` - Linting
- `autoprefixer@^10.4.22` & `postcss@^8.5.6` - CSS processing
- `supabase@^2.63.1` - Supabase CLI for local development

## Build & Installation

```bash
# Install dependencies
npm install

# Development server (HMR enabled)
npm run dev

# TypeScript check and production build
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview

# Supabase local development
npm run db:start    # Start local Supabase
npm run db:stop     # Stop local Supabase
npm run db:reset    # Reset database
npm run db:migration # Create new migration
npm run generate:types # Generate TypeScript types from DB schema
```

## Main Files & Resources

**Application Entry Points:**
- `src/main.tsx` - React root
- `src/App.tsx` - Router and auth provider setup
- `index.html` - HTML template

**Key Application Files:**
- `src/components/GameContainer.tsx` - Main game orchestrator
- `src/components/GameViewport.tsx` - Hex-based map rendering
- `src/components/TileExploration.tsx` - Tile detail view
- `src/lib/api.ts` - API wrappers for Edge Function calls
- `src/lib/auth.tsx` - Authentication context and hooks
- `src/lib/gameActions.ts` - Game action dispatcher
- `src/lib/hex.ts` - Hex coordinate system utilities
- `src/types/game.ts` - Core game types

**Backend Entry Points:**
- `server/edge/get-tiles/index.ts` - Tile fetching Edge Function (Deno/TypeScript)

**Database:**
- `sql/migrations/20251126135000__create_tiles_and_event_log.sql` - Tiles and event log tables
- `sql/migrations/20251129013318_create_players_table.sql` - Players table
- `sql/migrations/20251129013755_create_game_rpc_functions.sql` - RPC functions

**Configuration:**
- `tsconfig.app.json` - React app TypeScript config (strict mode, ES2022 target)
- `tsconfig.node.json` - Build tooling TypeScript config
- `vite.config.ts` - Vite build configuration
- `eslint.config.js` - ESLint config with React hooks and refresh rules
- `tailwind.config.js` - Tailwind CSS configuration
- `.env.example` - Environment variable template (Supabase credentials)

## Architecture Highlights

**Client-Server Pattern:**
- Client is view + command issuer only; never trusts client input
- All state-changing operations validated and processed server-side
- Edge Functions handle player actions with Zod input validation
- Append-only `event_log` table for auditability and moderation

**Game Coordinates:**
- Axial coordinate system (q, r) for hex grid positioning
- Pointy-top hex orientation with responsive sizing (default HEX_SIZE = 96px)
- Client-side pixel conversion via `src/lib/hex.ts` utilities

**Type Safety:**
- TypeScript strict mode enabled
- Module resolution: bundler mode
- JSX: react-jsx
- Generated DB types from Supabase schema

## Security & Environment

**Environment Variables (Client-Safe):**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Anonymous API key (safe for client)
- Service role key used only in Edge Functions (server-side)

**RLS & Validation:**
- Row-level security (RLS) enabled on all non-public Supabase tables
- Zod schema validation in Edge Functions for all inputs
- No secrets committed to repository
