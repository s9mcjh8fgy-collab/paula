-- Execute este script no SQL Editor do Supabase (Project > SQL Editor > New query)

create extension if not exists "pgcrypto";

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  document text,
  contacts jsonb not null default '[]'::jsonb,
  folder_url text,
  notes text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

create table if not exists interactions (
  id uuid primary key default gen_random_uuid(),
  number bigserial unique,
  client_id uuid not null references clients(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  channel text not null check (channel in ('whatsapp', 'email', 'call', 'meeting', 'in_person')),
  requested_by text,
  summary text not null,
  response text,
  attachment_url text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'done')),
  tags text[] not null default '{}',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists interactions_client_id_idx on interactions(client_id);
create index if not exists interactions_status_idx on interactions(status);
create index if not exists interactions_search_idx on interactions
  using gin (to_tsvector('portuguese', coalesce(summary, '') || ' ' || coalesce(response, '')));

-- Row Level Security: qualquer usuário autenticado (membro da equipe) pode ler/escrever
alter table clients enable row level security;
alter table interactions enable row level security;

create policy "team_full_access_clients" on clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "team_full_access_interactions" on interactions
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
