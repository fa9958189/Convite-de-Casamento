-- Substitua TODAS as ocorrências de UUID_DA_CONTA_DOS_NOIVOS pelo UUID real.
-- Execute no projeto pmlymwlwtmpliakmnpig. Não recria tabela ou registros.
begin;
alter table public.casamento_confirmacoes enable row level security;
revoke update, delete on public.casamento_confirmacoes from public, anon, authenticated;
revoke update (id, nome, criado_em) on public.casamento_confirmacoes from public, anon, authenticated;
revoke select on public.casamento_confirmacoes from public, anon;
revoke select (id, nome, criado_em) on public.casamento_confirmacoes from public, anon;
grant select on public.casamento_confirmacoes to authenticated;

-- A política restritiva impede que outra política SELECT permissiva amplie o acesso.
drop policy if exists casamento_noivos_select on public.casamento_confirmacoes;
drop policy if exists casamento_noivos_select_guard on public.casamento_confirmacoes;
create policy casamento_noivos_select on public.casamento_confirmacoes
  for select to authenticated
  using ((select auth.uid()) = 'UUID_DA_CONTA_DOS_NOIVOS'::uuid);
create policy casamento_noivos_select_guard on public.casamento_confirmacoes
  as restrictive for select to authenticated
  using ((select auth.uid()) = 'UUID_DA_CONTA_DOS_NOIVOS'::uuid);

-- Confirma autorização mesmo quando a tabela está vazia. Não retorna dados.
create or replace function public.noivos_autorizado()
returns boolean language sql stable security invoker set search_path = ''
as $$ select coalesce(auth.uid() = 'UUID_DA_CONTA_DOS_NOIVOS'::uuid, false) $$;
revoke all on function public.noivos_autorizado() from public, anon;
grant execute on function public.noivos_autorizado() to authenticated;
commit;
