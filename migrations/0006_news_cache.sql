-- Cached NDIA headlines. Refreshed by cron / first visitor after they go stale.
create table if not exists news_cache (
  id text primary key,
  payload jsonb not null,
  fetched_at timestamptz not null default now(),
  error text
);
