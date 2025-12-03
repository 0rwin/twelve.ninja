-- Seed data for local development
-- This file is run automatically by `supabase db reset`

-- Note: In a real environment, auth.users would be populated via Supabase Auth
-- For local development, we'll create some sample tiles for testing

-- Clear existing data (be careful with this in production!)
truncate tiles cascade;
truncate event_log cascade;

-- Insert sample tiles for testing
-- Creating a small 5x5 hex grid around origin (0,0)
insert into tiles (q, r, tile_type, explored, metadata) values
  -- Center and immediate neighbors
  (0, 0, 'village_night', true, '{"description": "Starting village"}'),
  (1, 0, 'forest_dark', false, '{"danger_level": 1}'),
  (0, 1, 'forest_dark', false, '{"danger_level": 1}'),
  (-1, 1, 'mountain', false, '{"danger_level": 2}'),
  (-1, 0, 'plains', false, '{"danger_level": 0}'),
  (0, -1, 'plains', false, '{"danger_level": 0}'),
  (1, -1, 'forest_dark', false, '{"danger_level": 1}'),

  -- Ring 2
  (2, 0, 'forest_dark', false, '{"danger_level": 2}'),
  (2, -1, 'mountain', false, '{"danger_level": 3}'),
  (1, 1, 'forest_dark', false, '{"danger_level": 1}'),
  (0, 2, 'swamp', false, '{"danger_level": 2}'),
  (-1, 2, 'swamp', false, '{"danger_level": 2}'),
  (-2, 2, 'mountain', false, '{"danger_level": 3}'),
  (-2, 1, 'plains', false, '{"danger_level": 0}'),
  (-2, 0, 'village_night', false, '{"description": "Distant village"}'),
  (-1, -1, 'plains', false, '{"danger_level": 0}'),
  (0, -2, 'desert', false, '{"danger_level": 2}'),
  (1, -2, 'desert', false, '{"danger_level": 2}'),
  (2, -2, 'mountain', false, '{"danger_level": 3}'),

  -- Some special tiles further out
  (3, 0, 'village_night', false, '{"description": "Eastern outpost"}'),
  (0, 3, 'village_night', false, '{"description": "Northern settlement"}'),
  (-3, 0, 'dungeon', false, '{"danger_level": 5, "description": "Ancient ruins"}'),
  (0, -3, 'castle', false, '{"danger_level": 4, "description": "Abandoned fortress"}');

-- Insert some sample event_log entries to demonstrate the audit trail
insert into event_log (player_id, event_type, payload, tile_id, match_id) values
  (null, 'world_init', '{"world_seed": "dev_seed_001", "timestamp": "2025-01-01T00:00:00Z"}', null, null),
  (null, 'tile_discovered', '{"tile_type": "village_night", "q": 0, "r": 0}', (select id from tiles where q = 0 and r = 0), null);

-- Note: Player data cannot be seeded here because it requires valid auth.users entries
-- Players will be created via the sign-up flow or manually via the create_player_profile function
-- Example (commented out):
-- insert into players (id, email, username) values
--   ('00000000-0000-0000-0000-000000000001', 'test@example.com', 'TestNinja')
-- on conflict (id) do nothing;
