-- Tabela de auditoria para registrar alterações em demandas e tarefas
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid not null,
  field_name text not null,
  old_value text,
  new_value text,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

-- Índices para consultas rápidas
create index if not exists audit_log_record_idx on audit_log (table_name, record_id, changed_at desc);

-- Habilitar RLS
alter table audit_log enable row level security;

-- Usuários autenticados podem ler e inserir
create policy "auth users can read audit_log"
  on audit_log for select
  to authenticated
  using (true);

create policy "auth users can insert audit_log"
  on audit_log for insert
  to authenticated
  with check (true);

-- Função genérica que compara campos e grava na audit_log
create or replace function fn_audit_changes()
returns trigger
language plpgsql
security definer
as $$
declare
  col text;
  old_val text;
  new_val text;
  fields text[] := array[
    'title','summary','response','status','channel','occurred_at',
    'requested_by','tags','links',
    'assigned_to','due_date','description','client_id'
  ];
begin
  foreach col in array fields loop
    execute format('select ($1).%I::text', col) into old_val using OLD;
    execute format('select ($1).%I::text', col) into new_val using NEW;
    if old_val is distinct from new_val then
      insert into audit_log (table_name, record_id, field_name, old_value, new_value, changed_by)
      values (TG_TABLE_NAME, NEW.id, col, old_val, new_val, auth.uid());
    end if;
  end loop;
  return NEW;
end;
$$;

-- Triggers nas tabelas de demandas e tarefas
drop trigger if exists trg_audit_interactions on interactions;
create trigger trg_audit_interactions
  after update on interactions
  for each row execute function fn_audit_changes();

drop trigger if exists trg_audit_tasks on tasks;
create trigger trg_audit_tasks
  after update on tasks
  for each row execute function fn_audit_changes();
