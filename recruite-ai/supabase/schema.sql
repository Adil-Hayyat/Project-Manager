-- Run this in the Supabase SQL Editor before using the app.

create extension if not exists "pgcrypto";

create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),

  -- Step 1: candidate input
  name text not null,
  email text not null,
  position text not null,
  cv_text text not null,
  jd_text text not null,

  -- workflow status: pending -> processing -> completed | failed
  status text not null default 'pending',
  error_message text,

  -- AI screening output (structured)
  match_score int,
  relevant_experience text,
  technical_skills_match text,
  education_match text,
  missing_skills text,
  strengths text,
  concerns text,
  recommendation text,       -- 'Strong Match' | 'Potential Match' | 'Not a Match'
  reason text,
  raw_ai_response jsonb,     -- full parsed JSON from the AI, kept for auditing

  retry_count int not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists candidates_status_idx on candidates (status);
create index if not exists candidates_created_at_idx on candidates (created_at desc);

-- keep updated_at fresh
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_candidates_updated_at on candidates;
create trigger trg_candidates_updated_at
before update on candidates
for each row execute procedure set_updated_at();

-- Row Level Security: this is an internal HR tool, so we keep it simple and
-- access the table only via the server (service role key), never from the browser.
alter table candidates enable row level security;
-- No policies are created, which means only the service role key (server-side)
-- can read/write. The anon key (browser) is not used to touch this table directly.
