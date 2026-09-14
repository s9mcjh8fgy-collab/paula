-- Tabela de leads capturados por ferramentas públicas (isca de captação).
-- Genérica: reaproveitável por outras ferramentas além do "Contrato na Régua",
-- basta variar o valor da coluna `tool`.
--
-- Rode este script uma vez no SQL Editor do Supabase (mesmo projeto usado
-- pelo sistema de demandas: https://ynvaqkokeepeozozmsif.supabase.co).

create table if not exists tool_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tool text not null,
  nome text,
  contato text,
  payload jsonb
);

alter table tool_leads enable row level security;

-- Qualquer visitante (chave anon) pode inserir um lead, mas não pode ler,
-- alterar ou apagar nada. Consulta dos leads só via chave service_role
-- (dashboard do Supabase ou um script seu com a SUPABASE_SECRET_KEY).
create policy "tool_leads_insert_anon"
  on tool_leads for insert
  to anon
  with check (true);
