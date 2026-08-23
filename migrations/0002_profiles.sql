-- Membership and role live here. Evidence, logs, and other NDIS content
-- stay device-local (see the in-app privacy note). Never store evidence here.
create table if not exists profiles (
  user_id     text primary key,
  role        text not null default 'participant',
  membership  text not null default 'free',
  org_name    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists news_items (
  id           serial primary key,
  title        text not null,
  summary      text not null,
  source       text not null,
  url          text,
  published_at date not null,
  tags         text not null default ''
);
