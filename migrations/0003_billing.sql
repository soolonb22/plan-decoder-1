-- Billing: membership is paid; credits are spent on finished outcomes.
-- Practice answers still stay on-device. This table only stores account money.

alter table profiles
  add column if not exists credits integer not null default 0;
alter table profiles
  add column if not exists stripe_customer_id text;
alter table profiles
  add column if not exists stripe_subscription_id text;
alter table profiles
  add column if not exists subscription_status text not null default 'none';

create table if not exists credit_ledger (
  id serial primary key,
  user_id text not null,
  delta integer not null,
  reason text not null,
  outcome_kind text,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

create index if not exists credit_ledger_user_id_idx on credit_ledger (user_id);
create unique index if not exists credit_ledger_stripe_session_idx
  on credit_ledger (stripe_session_id)
  where stripe_session_id is not null;
