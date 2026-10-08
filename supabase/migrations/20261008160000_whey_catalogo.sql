-- Batalha dos Wheys: catálogo de produtos e histórico de preços.
--
-- Regras de dado (ver lib/comparador-whey.ts):
-- * Produto é uma VARIANTE: marca → linha → tipo → sabor → embalagem. Dois
--   sabores são dois produtos, porque a tabela nutricional pode mudar.
-- * Só entra no site produto com status 'verificado' (rótulo conferido na
--   fonte, com data). Nenhum produto fictício.
-- * Preço é histórico: cada conferência é uma linha nova; nada é
--   sobrescrito. O site usa a linha mais recente de cada condição.
-- * O público (anon) só LÊ produto verificado e seus preços. Escrita só
--   para usuário ativo do CRM com papel de admin.

create table if not exists public.whey_produtos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  marca text not null check (length(marca) between 2 and 60),
  linha text not null check (length(linha) between 2 and 80),
  nome text not null check (length(nome) between 3 and 140),
  tipo text not null check (tipo in ('concentrado','isolado','hidrolisado','blend','3w','outro')),
  sabor text not null check (length(sabor) between 2 and 60),
  embalagem text check (embalagem in ('pote','refil','pouch','sache','outro')),
  pacote_g numeric(8,1) not null check (pacote_g between 100 and 10000),
  porcao_g numeric(6,2) not null check (porcao_g between 5 and 200),
  proteina_porcao_g numeric(6,2) not null check (proteina_porcao_g > 0 and proteina_porcao_g <= porcao_g),
  carboidratos_g numeric(6,2) check (carboidratos_g >= 0),
  acucares_totais_g numeric(6,2) check (acucares_totais_g >= 0),
  gorduras_totais_g numeric(6,2) check (gorduras_totais_g >= 0),
  gorduras_saturadas_g numeric(6,2) check (gorduras_saturadas_g >= 0),
  sodio_mg numeric(7,1) check (sodio_mg >= 0),
  kcal_porcao numeric(6,1) check (kcal_porcao >= 0),
  ingredientes text,
  lactose text check (lactose in ('contem','zero','nao_informado')),
  alergenicos text,
  url_oficial text check (url_oficial ~ '^https://'),
  sku text,
  fonte_rotulo text not null,
  rotulo_verificado_em date,
  status text not null default 'rascunho' check (status in ('rascunho','verificado','inativo')),
  observacao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  -- Não publica sem data de conferência do rótulo.
  check (status <> 'verificado' or rotulo_verificado_em is not null)
);

create table if not exists public.whey_precos (
  id bigint generated always as identity primary key,
  produto_id uuid not null references public.whey_produtos(id) on delete cascade,
  condicao text not null check (condicao in ('regular','promocional','avista','pix','cartao','assinatura','cupom')),
  preco_centavos integer not null check (preco_centavos between 100 and 500000),
  parcelamento text,
  em_estoque boolean,
  loja text not null,
  url text not null check (url ~ '^https://'),
  metodo text not null default 'manual' check (metodo in ('manual','feed','api','dados_estruturados')),
  verificado_em timestamptz not null,
  observacao text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  check (verificado_em <= created_at + interval '1 hour')
);

create index if not exists whey_precos_produto_idx on public.whey_precos (produto_id, condicao, verificado_em desc);

alter table public.whey_produtos enable row level security;
alter table public.whey_precos enable row level security;

-- O anon não pode executar crm_is_admin(): leitura pública tem política própria.
drop policy if exists whey_produtos_anon on public.whey_produtos;
create policy whey_produtos_anon on public.whey_produtos for select to anon using (status = 'verificado');
drop policy if exists whey_produtos_publico on public.whey_produtos;
create policy whey_produtos_publico on public.whey_produtos for select to authenticated using (status = 'verificado' or public.crm_is_admin());
drop policy if exists whey_produtos_admin on public.whey_produtos;
create policy whey_produtos_admin on public.whey_produtos for all to authenticated using (public.crm_is_admin()) with check (public.crm_is_admin());

drop policy if exists whey_precos_anon on public.whey_precos;
create policy whey_precos_anon on public.whey_precos for select to anon
  using (exists (select 1 from public.whey_produtos p where p.id = produto_id and p.status = 'verificado'));
drop policy if exists whey_precos_publico on public.whey_precos;
create policy whey_precos_publico on public.whey_precos for select to authenticated
  using (exists (select 1 from public.whey_produtos p where p.id = produto_id and (p.status = 'verificado' or public.crm_is_admin())));
-- Histórico: admin insere; ninguém edita nem apaga linha de preço.
drop policy if exists whey_precos_admin_insert on public.whey_precos;
create policy whey_precos_admin_insert on public.whey_precos for insert to authenticated with check (public.crm_is_admin());

-- Privilégio mínimo: o padrão do Supabase dá tudo a anon/authenticated.
revoke all on public.whey_produtos, public.whey_precos from anon, authenticated;
grant select on public.whey_produtos, public.whey_precos to anon, authenticated;
grant insert, update on public.whey_produtos to authenticated;
grant insert on public.whey_precos to authenticated;

create or replace function public.whey_produtos_touch() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at := now(); new.updated_by := auth.uid(); return new; end $$;
drop trigger if exists whey_produtos_touch on public.whey_produtos;
create trigger whey_produtos_touch before update on public.whey_produtos for each row execute function public.whey_produtos_touch();

-- Primeiro produto, rótulo e preço conferidos na loja oficial em 08/10/2026.
insert into public.whey_produtos (slug, marca, linha, nome, tipo, sabor, embalagem, pacote_g, porcao_g, proteina_porcao_g,
  carboidratos_g, acucares_totais_g, gorduras_totais_g, gorduras_saturadas_g, sodio_mg, kcal_porcao, ingredientes, lactose, alergenicos,
  url_oficial, sku, fonte_rotulo, rotulo_verificado_em, status)
values ('integralmedica-whey-100-pure-concentrado-900g-gelato-di-latte', 'Integralmedica', 'Whey 100% Pure', 'Whey Protein Concentrado Pote 900g',
  'concentrado', 'Gelato Di Latte', 'pote', 900, 30, 21, 4.8, 3.5, 1.8, 0.9, 66, 119,
  'Proteína de soro do leite concentrada, aromatizante e edulcorante sucralose.', 'contem',
  'Contém derivados de leite e soja. Contém lactose. Não contém glúten.',
  'https://www.integralmedica.com.br/whey-protein-concentrado-900g/p', '77730',
  'Tabela nutricional na página oficial do produto (sabor Gelato Di Latte)', '2026-10-08', 'verificado')
on conflict (slug) do nothing;

insert into public.whey_precos (produto_id, condicao, preco_centavos, parcelamento, em_estoque, loja, url, metodo, verificado_em, observacao)
select id, 'regular', 24000, '4x de R$ 60,00', true, 'Loja oficial Integralmedica',
  'https://www.integralmedica.com.br/whey-protein-concentrado-900g/p', 'manual', '2026-10-08T14:30:00-03:00',
  'Conferido manualmente na página do produto. Preço Pix não confirmado para este item.'
from public.whey_produtos where slug = 'integralmedica-whey-100-pure-concentrado-900g-gelato-di-latte'
  and not exists (select 1 from public.whey_precos pr join public.whey_produtos p on p.id = pr.produto_id where p.slug = 'integralmedica-whey-100-pure-concentrado-900g-gelato-di-latte');
