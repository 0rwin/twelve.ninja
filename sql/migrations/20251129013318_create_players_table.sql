-- Create players table
-- Links to Supabase auth.users and stores game state
create table if not exists players (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  email text,

  -- Ninja code/clan affiliation
  primary_code text,

  -- Progression stats
  level int not null default 1,
  xp int not null default 0,
  skill_points int not null default 0,

  -- Currency
  ryo int not null default 0,

  -- Resources
  stamina int not null default 100,
  max_stamina int not null default 100,

  -- Current location
  current_tile_id uuid references tiles(id),

  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Constraints to enforce game rules
  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 20),
  constraint level_positive check (level > 0),
  constraint xp_non_negative check (xp >= 0),
  constraint ryo_non_negative check (ryo >= 0),
  constraint stamina_bounds check (stamina >= 0 and stamina <= max_stamina),
  constraint max_stamina_positive check (max_stamina > 0),
  constraint skill_points_non_negative check (skill_points >= 0)
);

-- Create index on username for lookups
create index if not exists idx_players_username on players(username);

-- Create index on current_tile_id for spatial queries
create index if not exists idx_players_current_tile on players(current_tile_id);

-- Enable Row Level Security
alter table players enable row level security;

-- RLS Policy: Users can read their own player data
create policy "Users can view own player data"
  on players
  for select
  using (auth.uid() = id);

-- RLS Policy: Users can insert their own player record (on signup)
create policy "Users can insert own player data"
  on players
  for insert
  with check (auth.uid() = id);

-- RLS Policy: Users can update their own player data
-- Note: Server-authoritative operations should use service role
-- This policy is for client-initiated non-critical updates only
create policy "Users can update own player data"
  on players
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);


-- Create a restricted public leaderboard view
create or replace view public_leaderboard as
select id, username, level from players;

-- Drop permissive policy on players table
drop policy if exists "Public player usernames are viewable" on players;

-- Grant select on leaderboard view to public
grant select on public_leaderboard to anon, authenticated;

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at on player updates
create trigger update_players_updated_at
  before update on players
  for each row
  execute function update_updated_at_column();

-- Helper function to create a new player after auth signup
-- This can be called from a trigger or manually
create or replace function create_player_profile(
  user_id uuid,
  user_email text,
  player_username text
)
returns void as $$
begin
  insert into players (id, email, username, level, xp, ryo, stamina, max_stamina, skill_points)
  values (
    user_id,
    user_email,
    player_username,
    1,    -- starting level
    0,    -- starting xp
    100,  -- starting ryo
    100,  -- starting stamina
    100,  -- starting max_stamina
    0     -- starting skill_points
  );
end;
$$ language plpgsql security definer;
