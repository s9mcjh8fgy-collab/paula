-- Execute no SQL Editor do Supabase (em uma nova query)

alter table interactions add column if not exists links text[] not null default '{}';
alter table interactions add column if not exists images text[] not null default '{}';

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  due_date date,
  status text not null default 'pending' check (status in ('pending', 'done')),
  client_id uuid references clients(id) on delete set null,
  interaction_id uuid references interactions(id) on delete set null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table tasks enable row level security;

create policy "team_full_access_tasks" on tasks
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Bucket de armazenamento para imagens anexadas às demandas
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', true)
on conflict (id) do nothing;

create policy "authenticated_read_attachments" on storage.objects
  for select using (bucket_id = 'attachments' and auth.role() = 'authenticated');

create policy "authenticated_upload_attachments" on storage.objects
  for insert with check (bucket_id = 'attachments' and auth.role() = 'authenticated');

create policy "authenticated_delete_attachments" on storage.objects
  for delete using (bucket_id = 'attachments' and auth.role() = 'authenticated');
