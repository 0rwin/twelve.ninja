# Session Notes - Twelve Ninja Setup

## Date: 2025-11-28

---

## 🎉 What We Accomplished Today

### 1. Supabase CLI Integration
- ✅ Installed Supabase CLI as dev dependency
- ✅ Initialized Supabase in project (`supabase/` folder)
- ✅ Linked to remote Supabase project (`amekgfcnljqpkrhviprf`)
- ✅ Configured local development environment

### 2. Database Schema - Critical Tables Created
- ✅ **`players` table** with full schema
  - Linked to `auth.users` via foreign key
  - All fields: level, xp, ryo, stamina, skill_points, current_tile_id
  - Proper constraints and indexes
  - RLS policies for security
  - Auto-updated timestamp triggers
  - Helper function: `create_player_profile()`

- ✅ **`tiles` table** (already existed, confirmed working)
- ✅ **`event_log` table** (already existed, confirmed working)

### 3. Server-Authoritative Game Logic - RPC Functions
Created 3 critical database functions that your code was calling:

- ✅ **`execute_action(player_id, action_type, tile_id)`**
  - Handles: scout, forage, rest actions
  - Server-side stamina/XP/ryo calculations
  - Emits audit events to event_log
  - Returns updated player stats

- ✅ **`get_action_details(action_type, tile_id, difficulty)`**
  - Preview action results without executing

- ✅ **`update_player_stats(player_id, ...changes)`**
  - Direct stat updates with bounds checking
  - Logs all changes to event_log

### 4. Type System - Auto-Generated Types
- ✅ Added `npm run generate:types` script
- ✅ Generated `src/types/db.ts` from database schema
- ✅ Types now auto-sync with database changes

### 5. Configuration & Developer Experience
- ✅ Created `.env.example` for onboarding new developers
- ✅ Created `supabase/seed.sql` with 25+ sample tiles
- ✅ Added comprehensive npm scripts for database management:
  ```json
  "db:start": "supabase start",
  "db:stop": "supabase stop",
  "db:reset": "supabase db reset",
  "db:migration": "supabase migration new",
  "db:push": "supabase db push",
  "db:pull": "supabase db pull",
  "db:studio": "supabase studio",
  "generate:types": "supabase gen types typescript --local > src/types/db.ts"
  ```

### 6. API Layer - Fixed Deployment Path
- ✅ Fixed `src/lib/api.ts` to use Supabase Edge Functions
- ✅ Removed incorrect Netlify function paths
- ✅ Now uses `supabase.functions.invoke('get-tiles')`

### 7. Migrations Applied
All migrations successfully applied to local database:
- `20251126135000_create_tiles_and_event_log.sql`
- `20251129013318_create_players_table.sql`
- `20251129013755_create_game_rpc_functions.sql`

---

## 📋 What's Left (Priority Order)

### Priority 1: Testing Infrastructure (CRITICAL per IMPLEMENTATION_DOCTRINE.md)
- [ ] Set up Vitest testing framework
- [ ] Add `npm test` script
- [ ] Write unit tests for `hex.ts` coordinate functions
- [ ] Write integration tests for RPC functions
- [ ] Set up GitHub Actions CI/CD workflow

### Priority 2: Authentication Flow
- [ ] Update `AuthForm.tsx` to call `create_player_profile()` after signup
- [ ] Test full flow: signup → create player → execute actions
- [ ] Handle username collection during signup

### Priority 3: Remaining Database Tables
- [ ] `player_bios` - for bio generation system
- [ ] `quests` - for quest system
- [ ] `player_skill_alloc` - for skill tree
- [ ] `enemies` - for combat encounters

### Priority 4: Advanced Game Features
- [ ] Implement seeded RNG utility (deterministic combat)
- [ ] Create `resolve-combat` Edge Function
- [ ] Create `generate-bio` Edge Function
- [ ] Create `resolve-quest-choice` Edge Function

### Priority 5: State Management
- [ ] Install Zustand for centralized state
- [ ] Create `src/hooks/usePlayer.ts`
- [ ] Create `src/hooks/useCombat.ts`

### Priority 6: Deployment
- [ ] Push local migrations to remote Supabase: `npm run db:push`
- [ ] Deploy Edge Functions to Supabase
- [ ] Set up production environment variables

---

## 🧪 How to Test Current Setup

### Start Local Development
```bash
# Start Supabase
npm run db:start

# Open Supabase Studio (database UI)
npm run db:studio
# Visit: http://127.0.0.1:54323

# Start React dev server
npm run dev
```

### Test RPC Functions in Studio
1. Go to SQL Editor in Studio
2. Create a test player:
```sql
-- First, you'll need an auth.users entry
-- This would normally be created via signup

-- Then create a player profile
select create_player_profile(
  'YOUR_USER_ID'::uuid,
  'test@example.com',
  'TestNinja'
);
```

3. Test an action:
```sql
select execute_action(
  'YOUR_PLAYER_UUID'::uuid,
  'scout',
  (select id from tiles where q=0 and r=0)
);
```

4. Check event log:
```sql
select * from event_log order by created_at desc limit 10;
```

---

## 🗂️ File Structure Changes

### New Files Created
```
.env.example
supabase/
├── config.toml (auto-generated)
├── seed.sql (NEW)
└── migrations/
    ├── 20251126135000_create_tiles_and_event_log.sql
    ├── 20251129013318_create_players_table.sql (NEW)
    └── 20251129013755_create_game_rpc_functions.sql (NEW)

sql/migrations/ (mirror of supabase/migrations)

src/types/
└── db.ts (AUTO-GENERATED - regenerate after schema changes)
```

### Modified Files
```
package.json - Added database scripts and generate:types
src/lib/api.ts - Fixed to use Supabase Edge Functions
```

---

## 📚 Important Commands Reference

### Database Management
```bash
npm run db:start          # Start local Supabase
npm run db:stop           # Stop local Supabase
npm run db:reset          # Reset DB and reapply all migrations + seed data
npm run db:studio         # Open database UI
npm run db:migration <name> # Create new migration file
npm run db:push           # Push migrations to remote Supabase
npm run db:pull           # Pull remote schema as migration
npm run generate:types    # Regenerate TypeScript types from DB
```

### Development
```bash
npm run dev              # Start React dev server
npm run build            # Build for production
npm run lint             # Run linter
```

---

## 🔑 Key Configuration

### Local Supabase URLs (when running)
- **Studio**: http://127.0.0.1:54323
- **API**: http://127.0.0.1:54321
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Mailpit** (email testing): http://127.0.0.1:54324

### Remote Supabase
- **Project Ref**: `amekgfcnljqpkrhviprf`
- **URL**: https://amekgfcnljqpkrhviprf.supabase.co

---

## ⚠️ Important Notes

1. **Always regenerate types after schema changes**:
   ```bash
   npm run db:reset && npm run generate:types
   ```

2. **RLS is enabled on all tables** - Server operations should use service role, client operations are restricted by policies

3. **Event log is append-only** - Never delete from event_log in production (per IMPLEMENTATION_DOCTRINE.md)

4. **Before deploying to production**:
   - [ ] Run full test suite (once tests are written)
   - [ ] Review all migrations
   - [ ] Test with production credentials in staging first
   - [ ] Use `npm run db:push` to deploy migrations

---

## 🐛 Known Issues / Todo

1. **AuthForm doesn't create player profile yet** - Need to add signup hook
2. **No tests yet** - Critical per doctrine, should be next priority
3. **Missing tables** - player_bios, quests, etc. (not blocking core functionality)
4. **No seeded RNG** - Random rewards in `execute_action` use basic random(), not deterministic

---

## 📖 Documentation References

- `IMPLEMENTATION_DOCTRINE.md` - Core architecture rules
- `CLAUDE.md` - Claude Code guidance
- `GEMINI.md` - Project overview
- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Supabase Local Development](https://supabase.com/docs/guides/local-development)

---

## 💡 Quick Wins for Next Session

1. **Set up Vitest** (15 min) - Get testing infrastructure ready
2. **Fix AuthForm** (20 min) - Add player profile creation on signup
3. **Test end-to-end** (10 min) - Sign up → play → verify in database
4. **Write first tests** (30 min) - hex.ts unit tests + execute_action integration test

---

## 🎯 Session Goal Achieved

**Goal**: Fix critical database gaps and enable server-authoritative game logic

**Result**: ✅ COMPLETE
- Database properly structured with RLS
- All referenced RPC functions now exist
- Type system working
- Local development environment fully configured
- Game actions (scout, forage, rest) functional server-side

**Ready for**: Testing, authentication flow improvements, and feature expansion
