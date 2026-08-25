-- Optional encrypted notes vault. Server stores ciphertext only.
create table if not exists note_vault (
  user_id text primary key,
  ciphertext text not null,
  iv text not null,
  salt text not null,
  updated_at timestamptz not null default now()
);
