-- Palpites ("quem vence?") embutidos nos artigos de evento.
--
-- Um voto por visitante por enquete. O visitante é um id anônimo gerado no
-- navegador: nenhum dado pessoal entra aqui. O anon só INSERE (via RLS) e lê
-- o total por opção pela função abaixo — nunca a tabela crua.
create table if not exists public.palpites_votos (
  id bigint generated always as identity primary key,
  enquete text not null check (enquete ~ '^[a-z0-9-]{3,60}$'),
  opcao text not null check (opcao ~ '^[a-z0-9-]{1,40}$'),
  votante text not null check (votante ~ '^[a-zA-Z0-9-]{8,40}$'),
  created_at timestamptz not null default now(),
  unique (enquete, votante)
);

alter table public.palpites_votos enable row level security;
drop policy if exists palpites_anon_insert on public.palpites_votos;
create policy palpites_anon_insert on public.palpites_votos for insert to anon with check (true);

create or replace function public.palpites_contagem(p_enquete text)
returns table (opcao text, votos bigint)
language sql stable security definer set search_path = public
as $$ select opcao, count(*)::bigint from public.palpites_votos where enquete = p_enquete group by opcao $$;

revoke all on function public.palpites_contagem(text) from public;
grant execute on function public.palpites_contagem(text) to anon, authenticated;
grant insert on public.palpites_votos to anon;
