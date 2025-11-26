-- tiles table: canonical grid store
create table if not exists tiles (
  id uuid primary key default gen_random_uuid(),
  q int not null,                  -- axial q (or column)
  r int not null,                  -- axial r (or row)
  tile_type text not null,         -- e.g. 'forest_dark', 'mountain', 'village_night'
  owner_code text null,            -- nullable, Code who holds it
  discovered_by uuid[] default '{}'::uuid[], -- players who discovered (optional)
  explored boolean default false,
  metadata jsonb default '{}'::jsonb, -- extra flags
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index on tiles(q, r);

-- append-only event_log (already in doctrine but included for completeness)
create table if not exists event_log (
  id bigserial primary key,
  created_at timestamptz default now(),
  player_id uuid null,
  event_type text not null,
  payload jsonb not null,
  tile_id uuid null,
  match_id text null
);
