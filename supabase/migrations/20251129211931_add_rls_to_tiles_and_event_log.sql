-- Add Row Level Security to tiles and event_log tables
-- Per IMPLEMENTATION_DOCTRINE.md: Server-authoritative architecture with RLS on all tables

-- ============================================================================
-- TILES TABLE RLS
-- ============================================================================

-- Enable RLS on tiles table
alter table tiles enable row level security;

-- Policy: Anyone can view all tiles (map data is public)
-- This allows the client to render the map without authentication
create policy "Anyone can view tiles"
  on tiles
  for select
  using (true);

-- NOTE: No insert/update/delete policies for regular users
-- All tile modifications must go through Edge Functions using service role
-- This enforces server-authoritative tile state management

-- ============================================================================
-- EVENT_LOG TABLE RLS
-- ============================================================================

-- Enable RLS on event_log table
alter table event_log enable row level security;

-- Policy: Users can view only their own events
-- This allows players to see their action history while maintaining privacy
create policy "Users can view own events"
  on event_log
  for select
  using (auth.uid() = player_id);

-- Policy: Allow viewing public/system events (where player_id is null)
-- This enables system-wide events like maintenance notifications
create policy "Anyone can view system events"
  on event_log
  for select
  using (player_id is null);

-- NOTE: No insert/update/delete policies for regular users
-- All event_log writes must go through Edge Functions or DB functions using service role
-- This enforces append-only audit logging with no client tampering

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================
-- 1. Tiles are publicly readable for map rendering
-- 2. Event logs are private per player (except system events)
-- 3. ALL writes to both tables require service role (server-authoritative)
-- 4. Edge Functions and DB functions use 'security definer' to bypass RLS
-- 5. This prevents client-side tampering while allowing legitimate reads
