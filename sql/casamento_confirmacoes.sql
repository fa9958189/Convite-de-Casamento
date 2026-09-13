-- Projeto: pmlymwlwtmpliakmnpig
-- Supabase > SQL Editor > New query > Run
-- Se a tabela já existir, este script falha sem alterá-la: inspecione antes.
begin;
create table public.casamento_confirmacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(btrim(nome)) between 2 and 120),
  criado_em timestamptz not null default now()
);
alter table public.casamento_confirmacoes enable row level security;
revoke all privileges on table public.casamento_confirmacoes from public, anon, authenticated;
grant insert (nome) on public.casamento_confirmacoes to anon;
create policy casamento_confirmacoes_anon_insert
  on public.casamento_confirmacoes for insert to anon
  with check (char_length(btrim(nome)) between 2 and 120);
commit;
