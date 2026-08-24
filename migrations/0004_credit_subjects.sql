-- One credit per finished outcome. Same user + kind + subject is charged once.
alter table credit_ledger
  add column if not exists subject_id text;

create unique index if not exists credit_ledger_spend_once_idx
  on credit_ledger (user_id, outcome_kind, subject_id)
  where reason = 'spend' and subject_id is not null;
