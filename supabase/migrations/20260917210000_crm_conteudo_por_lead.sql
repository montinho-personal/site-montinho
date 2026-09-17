-- Conteúdo enviado a um lead adiado, com link que sabe quem recebeu.
--
-- POR QUE ISTO EXISTE
--
-- Depois do terceiro follow-up o CRM para de cobrar, e a mensagem que fecha
-- o ciclo promete não cobrar de novo. O que sobra é presença: mandar algo
-- útil que não pede nada. Só que um link de artigo comum chega como visita
-- anônima — se a Maria clicar, o CRM registra "desconhecido", e daqui a três
-- meses a pergunta "isso funciona?" vira discussão de impressão.
--
-- Este link sabe quem recebeu. O token não é o id do lead nem o telefone: é
-- um código aleatório que só o CRM sabe traduzir. Quem interceptar o link
-- não descobre nada sobre a pessoa.
--
-- O QUE ESTA TABELA NÃO FAZ
--
-- Não dispara nada. Igual ao resto do CRM, quem manda a mensagem é o
-- Montinho — a linha aqui é o registro de que mandou, e o teto que impede a
-- quarta.
create table if not exists public.crm_nurture_sends (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  -- Caminho no site, sempre relativo (/blog/... ou /ferramentas/...). Guardar
  -- URL absoluta convidaria um dia a apontar para fora, e um redirecionador
  -- aberto é um presente para quem quiser usar o domínio em golpe.
  --
  -- O segundo caractere não pode ser barra: "//evil" é endereço de outro
  -- site com o protocolo herdado, e o navegador o trata como externo. A
  -- primeira versão desta checagem só barrava "//site.com" por acaso, porque
  -- o ponto não estava na lista — sem ponto, passava.
  destino text not null check (destino ~ '^/[A-Za-z0-9_-][A-Za-z0-9/_-]*$'),
  titulo text,
  enviado_em timestamptz not null default now(),
  primeiro_clique_em timestamptz,
  ultimo_clique_em timestamptz,
  cliques integer not null default 0,
  created_by uuid references auth.users(id)
);
create index if not exists crm_nurture_lead_idx on public.crm_nurture_sends(lead_id, enviado_em desc);

alter table public.crm_nurture_sends enable row level security;
drop policy if exists crm_select on public.crm_nurture_sends;
create policy crm_select on public.crm_nurture_sends for select to authenticated using (public.crm_role() is not null);
drop policy if exists crm_insert on public.crm_nurture_sends;
create policy crm_insert on public.crm_nurture_sends for insert to authenticated with check (public.crm_can_write());
drop policy if exists crm_update on public.crm_nurture_sends;
create policy crm_update on public.crm_nurture_sends for update to authenticated using (public.crm_can_write()) with check (public.crm_can_write());
drop policy if exists crm_delete on public.crm_nurture_sends;
create policy crm_delete on public.crm_nurture_sends for delete to authenticated using (public.crm_is_admin());

-- O clique acontece com o visitante deslogado. Sem esta função o anônimo
-- precisaria de permissão de UPDATE na tabela — e quem pode atualizar uma
-- linha consegue ler o lead_id dela. A função devolve SÓ o destino: registra
-- o clique e não conta a ninguém de quem era o link.
create or replace function public.crm_conteudo_clique(tok text)
returns text language plpgsql volatile security definer set search_path = public as $$
declare alvo text;
begin
  update public.crm_nurture_sends
     set cliques = cliques + 1,
         primeiro_clique_em = coalesce(primeiro_clique_em, now()),
         ultimo_clique_em = now()
   where token = tok
  returning destino into alvo;
  return alvo;
end $$;
revoke all on function public.crm_conteudo_clique(text) from public;
grant execute on function public.crm_conteudo_clique(text) to anon, authenticated;
