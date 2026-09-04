-- ============================================================================
-- CRM + Revenue Intelligence do Montinho Personal Trainer
-- Migration 001: esquema completo da V1
--
-- Projeto Supabase: vsldhkkeijmeculaukee (sa-east-1). Todas as tabelas levam
-- o prefixo crm_ no schema public porque a API REST do Supabase só expõe os
-- schemas configurados no painel, e o prefixo dispensa essa configuração.
--
-- PRINCÍPIOS QUE O ESQUEMA IMPÕE (não dependem de ninguém lembrar):
--   1. Lead aberto sem próxima ação é detectável por consulta (next_action_at
--      nulo) — a tela "Hoje" cobra.
--   2. Ganho exige serviço, plano, valor e data (constraint em crm_opportunities).
--   3. Perdido exige motivo (constraint).
--   4. Toda mudança de etapa gera crm_stage_history (trigger).
--   5. Toda alteração nas tabelas comerciais gera crm_audit_log (trigger).
--   6. Telefone é normalizado para E.164 por trigger; duplicata NÃO é
--      mesclada sozinha — vira possivel_duplicata_de.
--   7. Origem desconhecida é 'unknown', nunca inventada: source_code é FK
--      para o registro de fontes e 'unknown' é valor válido.
--   8. Dado de saúde NÃO tem coluna aqui. O sistema de anamnese é outro
--      projeto; o CRM só guarda dado comercial.
-- ============================================================================

create extension if not exists citext;
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- USUÁRIOS DO CRM E PERMISSÕES
-- ----------------------------------------------------------------------------
create table if not exists public.crm_allowlist (
  email citext primary key,
  role text not null default 'user' check (role in ('admin','user','readonly')),
  nome text,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  nome text,
  role text not null default 'user' check (role in ('admin','user','readonly')),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Só entra no CRM quem está na allowlist. Quem não está nem consegue criar
-- conta: o trigger aborta o signup.

create or replace function public.crm_handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  allow public.crm_allowlist%rowtype;
begin
  select * into allow from public.crm_allowlist where email = new.email;
  if not found then
    raise exception 'E-mail não autorizado a acessar o CRM: %', new.email
      using errcode = 'P0001';
  end if;
  insert into public.crm_users (id, email, nome, role)
  values (new.id, new.email, coalesce(allow.nome, split_part(new.email, '@', 1)), allow.role)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists crm_on_auth_user_created on auth.users;
create trigger crm_on_auth_user_created
  after insert on auth.users
  for each row execute function public.crm_handle_new_auth_user();

create or replace function public.crm_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.crm_users where id = auth.uid() and ativo;
$$;

create or replace function public.crm_can_write()
returns boolean language sql stable as $$
  select coalesce(public.crm_role() in ('admin','user'), false);
$$;

create or replace function public.crm_is_admin()
returns boolean language sql stable as $$
  select coalesce(public.crm_role() = 'admin', false);
$$;

-- ----------------------------------------------------------------------------
-- REGISTROS DE APOIO (fonte, serviço, plano, pipeline, etapa, motivo de perda)
-- ----------------------------------------------------------------------------
create table if not exists public.crm_sources (
  code text primary key,
  nome text not null,
  categoria text not null check (categoria in ('organic','paid','social','referral','offline','direct','other','unknown')),
  custo_rastreado boolean not null default false, -- se true, entra em CAC de mídia
  ordem int not null default 100,
  ativo boolean not null default true
);

create table if not exists public.crm_services (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,            -- presencial | online | avulso ...
  nome text not null,
  exige_experimental boolean not null default false,
  ativo boolean not null default true,
  ordem int not null default 100
);

create table if not exists public.crm_plans (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.crm_services(id),
  nome text not null,
  tipo_cobranca text not null check (tipo_cobranca in ('mensal','trimestral','semestral','anual','avulso','pacote')),
  ciclo_meses numeric not null default 1,   -- para MRR normalizado: valor / ciclo_meses
  preco numeric(12,2) not null default 0,
  sessoes_por_semana int,
  descricao text,
  ativo boolean not null default true,
  ordem int not null default 100
);

create table if not exists public.crm_pipelines (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  nome text not null,
  service_id uuid references public.crm_services(id)
);

create table if not exists public.crm_stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.crm_pipelines(id) on delete cascade,
  code text not null,
  nome text not null,
  ordem int not null,
  tipo text not null default 'open' check (tipo in ('open','won','lost')),
  probabilidade_config numeric(5,4) check (probabilidade_config between 0 and 1),
  unique (pipeline_id, code)
);

create table if not exists public.crm_loss_reasons (
  code text primary key,
  nome text not null,
  ordem int not null default 100,
  ativo boolean not null default true
);

create table if not exists public.crm_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_message_templates (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('primeiro_contato','follow_up','pos_aula','proposta','lead_sumido','reativacao','renovacao','indicacao','outro')),
  titulo text not null,
  corpo text not null,
  ativo boolean not null default true,
  ordem int not null default 100
);

-- ----------------------------------------------------------------------------
-- PESSOAS
-- ----------------------------------------------------------------------------
create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text,                 -- como digitado
  telefone_e164 text,            -- normalizado por trigger
  email citext,
  instagram text,
  cidade text,
  como_conheceu text,            -- fallback declarado; não substitui tracking
  referred_by_contact_id uuid references public.crm_contacts(id),
  referral_code text unique,
  consent_marketing boolean,
  consent_registrado_em timestamptz,
  possivel_duplicata_de uuid references public.crm_contacts(id),
  merged_into_contact_id uuid references public.crm_contacts(id),
  anonimizado boolean not null default false,
  observacoes text,
  created_by uuid references public.crm_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists crm_contacts_tel_idx on public.crm_contacts(telefone_e164) where telefone_e164 is not null;
create index if not exists crm_contacts_email_idx on public.crm_contacts(email) where email is not null;
create index if not exists crm_contacts_nome_idx on public.crm_contacts using gin (to_tsvector('portuguese', nome));

-- Normalização E.164 para números brasileiros. Retorna null quando não dá
-- para afirmar o número — melhor null do que um número inventado.
create or replace function public.crm_normalize_phone(raw text)
returns text language plpgsql immutable as $$
declare d text;
begin
  if raw is null then return null; end if;
  d := regexp_replace(raw, '\D', '', 'g');
  if d = '' then return null; end if;
  if left(d, 2) = '55' and length(d) in (12, 13) then return '+' || d; end if;
  if length(d) in (10, 11) then return '+55' || d; end if;
  if length(d) between 8 and 15 and left(raw, 1) = '+' then return '+' || d; end if;
  return null;
end $$;

create or replace function public.crm_contacts_before_write()
returns trigger language plpgsql as $$
declare dup uuid;
begin
  new.telefone_e164 := public.crm_normalize_phone(new.telefone);
  if new.email is not null and btrim(new.email::text) = '' then new.email := null; end if;
  new.updated_at := now();
  -- Duplicata provável: mesmo telefone ou mesmo e-mail em outro contato vivo.
  -- Marca, não mescla — mesclar é decisão humana.
  if new.merged_into_contact_id is null then
    select c.id into dup from public.crm_contacts c
     where c.id <> new.id and c.merged_into_contact_id is null and c.anonimizado = false
       and ((new.telefone_e164 is not null and c.telefone_e164 = new.telefone_e164)
         or (new.email is not null and c.email = new.email))
     order by c.created_at limit 1;
    new.possivel_duplicata_de := dup;
  end if;
  return new;
end $$;

drop trigger if exists crm_contacts_bw on public.crm_contacts;
create trigger crm_contacts_bw before insert or update on public.crm_contacts
  for each row execute function public.crm_contacts_before_write();

-- ----------------------------------------------------------------------------
-- RASTREAMENTO PROSPECTIVO (antes de existir pessoa)
-- ----------------------------------------------------------------------------
-- Clique no WhatsApp: registrado ANTES de abrir o app, com a origem que o
-- site conhece naquele momento. O ref_code curto vai na mensagem; se a pessoa
-- apagar, a ligação com o lead fica 'low' ou não acontece — nunca fingida.
create table if not exists public.crm_whatsapp_handoffs (
  id uuid primary key default gen_random_uuid(),
  ref_code text not null unique,
  created_at timestamptz not null default now(),
  anonymous_id text,
  session_id text,
  page_url text,
  page_path text,
  page_title text,
  cta_id text,
  ferramenta text,               -- ferramenta do site em uso (calculadora etc.)
  servico_interesse text,        -- inferido da página (presencial/online), não da pessoa
  landing_page text,
  referrer text,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  gclid text, gbraid text, wbraid text, fbclid text,
  source_code text references public.crm_sources(code),
  first_touch jsonb,             -- cópia do primeiro toque conhecido no navegador
  device text,
  consent boolean,
  contact_id uuid references public.crm_contacts(id),
  lead_id uuid,
  linked_at timestamptz,
  link_confidence text check (link_confidence in ('high','medium','low'))
);
create index if not exists crm_handoffs_created_idx on public.crm_whatsapp_handoffs(created_at desc);
create index if not exists crm_handoffs_contact_idx on public.crm_whatsapp_handoffs(contact_id);

-- Linha do tempo de atribuição: um toque por visita/origem conhecida.
create table if not exists public.crm_attribution_touches (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.crm_contacts(id) on delete cascade,
  handoff_id uuid references public.crm_whatsapp_handoffs(id),
  anonymous_id text,
  occurred_at timestamptz not null default now(),
  source_code text not null references public.crm_sources(code) default 'unknown',
  medium text, campaign text, content text, term text,
  landing_page text, referrer text, page_url text, cta_id text,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  gclid text, gbraid text, wbraid text, fbclid text,
  session_id text,
  confidence text not null default 'medium' check (confidence in ('high','medium','low')),
  origem_registro text not null default 'site' check (origem_registro in ('site','manual','import','referral_link','qr')),
  created_at timestamptz not null default now()
);
create index if not exists crm_touches_contact_idx on public.crm_attribution_touches(contact_id, occurred_at);

-- Clique em link de indicação ou QR (antes de virar lead)
create table if not exists public.crm_tracked_link_clicks (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  code text not null,            -- referral_code do contato ou código de QR/link social
  tipo text not null check (tipo in ('referral','qr','social','other')),
  landing_page text,
  referrer text,
  anonymous_id text,
  session_id text
);

-- ----------------------------------------------------------------------------
-- LEAD, OPORTUNIDADE, EXPERIMENTAL, ATIVIDADE, TAREFA
-- ----------------------------------------------------------------------------
create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  service_id uuid references public.crm_services(id),
  interesse text,
  status text not null default 'aberto' check (status in ('aberto','ganho','perdido','inativo')),
  source_code text not null references public.crm_sources(code) default 'unknown',
  source_detail text,            -- campanha/conteúdo/indicador em texto
  attribution_confidence text not null default 'medium' check (attribution_confidence in ('high','medium','low')),
  handoff_id uuid references public.crm_whatsapp_handoffs(id),
  referred_by_contact_id uuid references public.crm_contacts(id),
  owner_id uuid references public.crm_users(id),
  next_action text,
  next_action_at timestamptz,
  last_contact_at timestamptz,
  first_response_at timestamptz, -- primeiro contato humano registrado
  lost_at timestamptz,
  lost_reason_code text references public.crm_loss_reasons(code),
  lost_reason_text text,
  reactivation_eligible_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.crm_users(id)
);
create index if not exists crm_leads_status_idx on public.crm_leads(status, next_action_at);
create index if not exists crm_leads_contact_idx on public.crm_leads(contact_id);
alter table public.crm_whatsapp_handoffs
  drop constraint if exists crm_whatsapp_handoffs_lead_id_fkey,
  add constraint crm_whatsapp_handoffs_lead_id_fkey foreign key (lead_id) references public.crm_leads(id);

create table if not exists public.crm_opportunities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  pipeline_id uuid not null references public.crm_pipelines(id),
  stage_id uuid not null references public.crm_stages(id),
  service_id uuid references public.crm_services(id),
  plan_id uuid references public.crm_plans(id),
  expected_value numeric(12,2),      -- valor mensal potencial
  recurring_value numeric(12,2),     -- valor recorrente fechado (mensal)
  ciclo_meses numeric,               -- ciclo do plano fechado
  probability numeric(5,4) check (probability between 0 and 1),
  expected_close_date date,
  proposal_sent_at timestamptz,
  proposal_value numeric(12,2),
  won_at timestamptz,
  won_value numeric(12,2),           -- primeiro contrato (valor do ciclo)
  lost_at timestamptz,
  loss_reason_code text references public.crm_loss_reasons(code),
  loss_reason_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.crm_users(id),
  -- GANHO obriga serviço, plano, valor e data. PERDIDO obriga motivo.
  constraint crm_opp_won_completo check (
    won_at is null or (service_id is not null and plan_id is not null and won_value is not null and won_value > 0)
  ),
  constraint crm_opp_lost_motivo check (lost_at is null or loss_reason_code is not null)
);
create index if not exists crm_opp_stage_idx on public.crm_opportunities(stage_id);
create index if not exists crm_opp_lead_idx on public.crm_opportunities(lead_id);

create table if not exists public.crm_stage_history (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.crm_opportunities(id) on delete cascade,
  from_stage_id uuid references public.crm_stages(id),
  to_stage_id uuid not null references public.crm_stages(id),
  changed_at timestamptz not null default now(),
  changed_by uuid references public.crm_users(id)
);
create index if not exists crm_stage_history_opp_idx on public.crm_stage_history(opportunity_id, changed_at);

create or replace function public.crm_opportunity_stage_change()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  if tg_op = 'INSERT' then
    insert into public.crm_stage_history (opportunity_id, from_stage_id, to_stage_id, changed_by)
    values (new.id, null, new.stage_id, auth.uid());
  elsif new.stage_id is distinct from old.stage_id then
    insert into public.crm_stage_history (opportunity_id, from_stage_id, to_stage_id, changed_by)
    values (new.id, old.stage_id, new.stage_id, auth.uid());
  end if;
  return new;
end $$;
-- AFTER para o INSERT ter o id; BEFORE UPDATE para atualizar updated_at.
drop trigger if exists crm_opp_ai on public.crm_opportunities;
create trigger crm_opp_ai after insert on public.crm_opportunities
  for each row execute function public.crm_opportunity_stage_change();
drop trigger if exists crm_opp_bu on public.crm_opportunities;
create trigger crm_opp_bu before update on public.crm_opportunities
  for each row execute function public.crm_opportunity_stage_change();

create table if not exists public.crm_trials (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  lead_id uuid references public.crm_leads(id) on delete set null,
  opportunity_id uuid references public.crm_opportunities(id) on delete set null,
  scheduled_at timestamptz not null,
  local text,
  status text not null default 'agendada' check (status in ('agendada','realizada','no_show','cancelada')),
  completed_at timestamptz,
  outcome text,
  calendar_event_id text,
  origem_registro text not null default 'manual' check (origem_registro in ('manual','import_calendar','automacao')),
  created_at timestamptz not null default now(),
  created_by uuid references public.crm_users(id)
);
create index if not exists crm_trials_sched_idx on public.crm_trials(scheduled_at);

create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.crm_contacts(id) on delete cascade,
  lead_id uuid references public.crm_leads(id) on delete set null,
  opportunity_id uuid references public.crm_opportunities(id) on delete set null,
  client_id uuid,
  tipo text not null check (tipo in (
    'lead_created','message','call','whatsapp_open','note','stage_change','trial_scheduled','trial_completed',
    'trial_no_show','trial_cancelled','proposal_sent','follow_up','meeting','won','lost','reactivated',
    'client_started','payment','renewal','cancellation','referral','task_done','import','merge','other')),
  descricao text,
  ocorreu_em timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.crm_users(id),
  created_at timestamptz not null default now()
);
create index if not exists crm_activities_contact_idx on public.crm_activities(contact_id, ocorreu_em desc);

create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.crm_contacts(id) on delete cascade,
  lead_id uuid references public.crm_leads(id) on delete cascade,
  opportunity_id uuid references public.crm_opportunities(id) on delete set null,
  client_id uuid,
  tipo text not null default 'follow_up' check (tipo in ('primeiro_contato','follow_up','enviar_proposta','lembrete_experimental','pos_experimental','reativacao','renovacao','pedir_indicacao','outro')),
  titulo text not null,
  due_at timestamptz not null,
  priority text not null default 'media' check (priority in ('alta','media','baixa')),
  completed_at timestamptz,
  owner_id uuid references public.crm_users(id),
  origem text not null default 'manual' check (origem in ('manual','automacao')),
  created_at timestamptz not null default now(),
  created_by uuid references public.crm_users(id)
);
create index if not exists crm_tasks_due_idx on public.crm_tasks(due_at) where completed_at is null;

-- ----------------------------------------------------------------------------
-- CLIENTE, CONTRATO, RECEITA (só depois da venda)
-- ----------------------------------------------------------------------------
create table if not exists public.crm_clients (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null unique references public.crm_contacts(id) on delete cascade,
  first_purchase_at date not null,
  status text not null default 'ativo' check (status in ('ativo','pausado','inativo','cancelado')),
  service_id uuid references public.crm_services(id),
  current_plan_id uuid references public.crm_plans(id),
  start_date date,
  end_date date,
  renewal_date date,
  source_code text not null references public.crm_sources(code) default 'unknown',
  source_confidence text not null default 'medium' check (source_confidence in ('high','medium','low')),
  cancel_reason text,
  cancelled_at date,
  reactivated_at date,
  origem_registro text not null default 'crm' check (origem_registro in ('crm','import')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.crm_activities
  drop constraint if exists crm_activities_client_id_fkey,
  add constraint crm_activities_client_id_fkey foreign key (client_id) references public.crm_clients(id) on delete set null;
alter table public.crm_tasks
  drop constraint if exists crm_tasks_client_id_fkey,
  add constraint crm_tasks_client_id_fkey foreign key (client_id) references public.crm_clients(id) on delete cascade;

create table if not exists public.crm_contracts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.crm_clients(id) on delete cascade,
  opportunity_id uuid references public.crm_opportunities(id),
  service_id uuid not null references public.crm_services(id),
  plan_id uuid not null references public.crm_plans(id),
  valor numeric(12,2) not null,        -- valor do ciclo contratado
  ciclo_meses numeric not null default 1,
  inicio date not null,
  fim date,
  renovacao_prevista date,
  status text not null default 'ativo' check (status in ('ativo','renovado','encerrado','cancelado')),
  contrato_anterior_id uuid references public.crm_contracts(id),
  created_at timestamptz not null default now(),
  created_by uuid references public.crm_users(id)
);
create index if not exists crm_contracts_client_idx on public.crm_contracts(client_id, inicio);

create table if not exists public.crm_revenue_events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.crm_clients(id) on delete cascade,
  contract_id uuid references public.crm_contracts(id) on delete set null,
  tipo text not null check (tipo in ('sale','renewal','monthly_payment','upgrade','downgrade','refund','cancellation','adjustment')),
  amount numeric(12,2) not null,       -- negativo para refund
  occurred_at date not null,
  status text not null default 'collected' check (status in ('expected','contracted','collected')),
  service_id uuid references public.crm_services(id),
  plan_id uuid references public.crm_plans(id),
  source_code text references public.crm_sources(code),
  payment_method text,
  external_ref text,                   -- id do Mercado Pago, Pix etc.
  fee numeric(12,2),                   -- taxa do meio de pagamento, se conhecida
  notes text,
  confidence text not null default 'verified' check (confidence in ('verified','inferred','aggregate','unknown')),
  import_id uuid,
  created_at timestamptz not null default now(),
  created_by uuid references public.crm_users(id),
  constraint crm_rev_refund_negativo check (tipo <> 'refund' or amount <= 0)
);
create index if not exists crm_rev_client_idx on public.crm_revenue_events(client_id, occurred_at);
create index if not exists crm_rev_date_idx on public.crm_revenue_events(occurred_at);

-- ----------------------------------------------------------------------------
-- HISTÓRICO DE MARKETING (agregado; nunca vira pessoa)
-- ----------------------------------------------------------------------------
create table if not exists public.crm_imports (
  id uuid primary key default gen_random_uuid(),
  fonte text not null,                 -- ga4 | gsc | google_ads | meta | calendar | planilha | whatsapp
  executado_em timestamptz not null default now(),
  periodo_inicio date,
  periodo_fim date,
  registros int not null default 0,
  sucesso int not null default 0,
  duplicados int not null default 0,
  erros int not null default 0,
  nao_casados int not null default 0,
  limitacoes text,
  relatorio jsonb not null default '{}'::jsonb,
  created_by uuid references public.crm_users(id)
);

create table if not exists public.crm_historical_acquisition (
  id uuid primary key default gen_random_uuid(),
  import_id uuid references public.crm_imports(id) on delete cascade,
  fonte text not null check (fonte in ('ga4','gsc','google_ads','meta_ads','manual')),
  granularidade text not null default 'day' check (granularidade in ('day','week','month','total')),
  data date not null,
  dimensoes jsonb not null default '{}'::jsonb,   -- source, medium, campaign, landing_page, query, device...
  metricas jsonb not null default '{}'::jsonb,   -- sessions, users, clicks, impressions, whatsapp_clicks, cost...
  confidence text not null default 'aggregate' check (confidence in ('verified','inferred','aggregate','unknown')),
  created_at timestamptz not null default now()
);
create index if not exists crm_hist_fonte_data_idx on public.crm_historical_acquisition(fonte, data);

create table if not exists public.crm_ad_spend (
  id uuid primary key default gen_random_uuid(),
  canal text not null check (canal in ('google_ads','meta_ads','other')),
  campanha text,
  campaign_id text,
  data date not null,
  custo numeric(12,2) not null default 0,
  cliques int, impressoes int, conversoes numeric,
  import_id uuid references public.crm_imports(id) on delete set null,
  created_at timestamptz not null default now(),
  created_by uuid references public.crm_users(id)
);
create index if not exists crm_ad_spend_idx on public.crm_ad_spend(canal, data);

-- ----------------------------------------------------------------------------
-- AUDITORIA
-- ----------------------------------------------------------------------------
create table if not exists public.crm_audit_log (
  id bigserial primary key,
  table_name text not null,
  row_id text,
  action text not null,
  changed_by uuid,
  changed_at timestamptz not null default now(),
  before jsonb,
  after jsonb
);
create index if not exists crm_audit_row_idx on public.crm_audit_log(table_name, row_id);

create or replace function public.crm_audit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.crm_audit_log(table_name, row_id, action, changed_by, after)
    values (tg_table_name, (to_jsonb(new)->>'id'), 'insert', auth.uid(), to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    if to_jsonb(old) - 'updated_at' is distinct from to_jsonb(new) - 'updated_at' then
      insert into public.crm_audit_log(table_name, row_id, action, changed_by, before, after)
      values (tg_table_name, (to_jsonb(new)->>'id'), 'update', auth.uid(), to_jsonb(old), to_jsonb(new));
    end if;
    return new;
  else
    insert into public.crm_audit_log(table_name, row_id, action, changed_by, before)
    values (tg_table_name, (to_jsonb(old)->>'id'), 'delete', auth.uid(), to_jsonb(old));
    return old;
  end if;
end $$;

do $$
declare t text;
begin
  foreach t in array array['crm_contacts','crm_leads','crm_opportunities','crm_clients','crm_contracts',
                           'crm_revenue_events','crm_tasks','crm_trials','crm_plans','crm_services','crm_settings','crm_ad_spend']
  loop
    execute format('drop trigger if exists %I on public.%I', t || '_audit', t);
    execute format('create trigger %I after insert or update or delete on public.%I for each row execute function public.crm_audit()', t || '_audit', t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- RLS: nada é público, exceto INSERT de rastreamento anônimo
-- ----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['crm_allowlist','crm_users','crm_sources','crm_services','crm_plans','crm_pipelines','crm_stages',
    'crm_loss_reasons','crm_settings','crm_message_templates','crm_contacts','crm_whatsapp_handoffs','crm_attribution_touches',
    'crm_tracked_link_clicks','crm_leads','crm_opportunities','crm_stage_history','crm_trials','crm_activities','crm_tasks',
    'crm_clients','crm_contracts','crm_revenue_events','crm_imports','crm_historical_acquisition','crm_ad_spend','crm_audit_log']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists crm_select on public.%I', t);
    execute format('create policy crm_select on public.%I for select to authenticated using (public.crm_role() is not null)', t);
    execute format('drop policy if exists crm_insert on public.%I', t);
    execute format('create policy crm_insert on public.%I for insert to authenticated with check (public.crm_can_write())', t);
    execute format('drop policy if exists crm_update on public.%I', t);
    execute format('create policy crm_update on public.%I for update to authenticated using (public.crm_can_write()) with check (public.crm_can_write())', t);
    execute format('drop policy if exists crm_delete on public.%I', t);
    execute format('create policy crm_delete on public.%I for delete to authenticated using (public.crm_is_admin())', t);
  end loop;
end $$;

-- Configurações sensíveis: só admin mexe em usuários e allowlist.
drop policy if exists crm_insert on public.crm_allowlist;
create policy crm_insert on public.crm_allowlist for insert to authenticated with check (public.crm_is_admin());
drop policy if exists crm_update on public.crm_allowlist;
create policy crm_update on public.crm_allowlist for update to authenticated using (public.crm_is_admin());
drop policy if exists crm_insert on public.crm_users;
create policy crm_insert on public.crm_users for insert to authenticated with check (public.crm_is_admin());
drop policy if exists crm_update on public.crm_users;
create policy crm_update on public.crm_users for update to authenticated using (public.crm_is_admin());
-- Audit log é só leitura para humanos.
drop policy if exists crm_insert on public.crm_audit_log;
drop policy if exists crm_update on public.crm_audit_log;
drop policy if exists crm_delete on public.crm_audit_log;

-- Rastreamento anônimo: o site insere, ninguém anônimo lê.
drop policy if exists crm_anon_insert on public.crm_whatsapp_handoffs;
create policy crm_anon_insert on public.crm_whatsapp_handoffs for insert to anon with check (contact_id is null and lead_id is null);
drop policy if exists crm_anon_insert on public.crm_tracked_link_clicks;
create policy crm_anon_insert on public.crm_tracked_link_clicks for insert to anon with check (true);
drop policy if exists crm_anon_insert on public.crm_attribution_touches;
create policy crm_anon_insert on public.crm_attribution_touches for insert to anon with check (contact_id is null and origem_registro in ('site','referral_link','qr'));
-- O site precisa validar código de indicação sem estar logado: expõe SÓ isso.
create or replace function public.crm_referral_code_valido(codigo text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.crm_contacts where referral_code = upper(codigo) and anonimizado = false);
$$;
grant execute on function public.crm_referral_code_valido(text) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- SEEDS: fontes, motivos de perda, serviços, pipelines, etapas, configurações
-- ----------------------------------------------------------------------------
insert into public.crm_sources (code, nome, categoria, custo_rastreado, ordem) values
  ('google_organic','Google orgânico','organic',false,10),
  ('google_ads','Google Ads','paid',true,20),
  ('google_business','Perfil da Empresa no Google','organic',false,25),
  ('instagram_organic','Instagram orgânico','social',false,30),
  ('instagram_ads','Instagram Ads','paid',true,40),
  ('facebook_organic','Facebook orgânico','social',false,50),
  ('facebook_ads','Facebook Ads','paid',true,60),
  ('youtube','YouTube','social',false,70),
  ('tiktok','TikTok','social',false,80),
  ('personal_por_perto','Personal por Perto','other',false,90),
  ('referral_client','Indicação de aluno','referral',false,100),
  ('referral_partner','Indicação de parceiro','referral',false,110),
  ('whatsapp_direct','WhatsApp direto','direct',false,120),
  ('direct','Direto / digitou o site','direct',false,130),
  ('offline_qr','QR code / material impresso','offline',false,140),
  ('event','Evento','offline',false,150),
  ('condominio','Condomínio / academia local','offline',false,160),
  ('other','Outro','other',false,900),
  ('unknown','Desconhecida','unknown',false,999)
on conflict (code) do nothing;

insert into public.crm_loss_reasons (code, nome, ordem) values
  ('price','Preço',10),('schedule','Horário',20),('location','Local / distância',30),('no_response','Sem resposta',40),
  ('chose_competitor','Escolheu concorrente',50),('decided_not_to_train','Desistiu de treinar',60),('not_ready','Não é o momento',70),
  ('no_show','Não compareceu',80),('availability','Sem vaga na agenda',90),('budget','Orçamento',100),('other','Outro',900)
on conflict (code) do nothing;

insert into public.crm_services (code, nome, exige_experimental, ordem) values
  ('presencial','Personal presencial',true,10),
  ('online','Consultoria online',false,20)
on conflict (code) do nothing;

insert into public.crm_pipelines (code, nome, service_id)
select 'presencial', 'Personal presencial', id from public.crm_services where code = 'presencial'
on conflict (code) do nothing;
insert into public.crm_pipelines (code, nome, service_id)
select 'online', 'Consultoria online', id from public.crm_services where code = 'online'
on conflict (code) do nothing;

insert into public.crm_stages (pipeline_id, code, nome, ordem, tipo, probabilidade_config)
select p.id, s.code, s.nome, s.ordem, s.tipo, s.prob
from public.crm_pipelines p
cross join (values
  ('novo','Novo lead',10,'open',0.05),
  ('contato','Primeiro contato',20,'open',0.10),
  ('qualificado','Qualificado',30,'open',0.20),
  ('experimental_agendada','Experimental agendada',40,'open',0.35),
  ('experimental_realizada','Experimental realizada',50,'open',0.50),
  ('proposta','Proposta enviada',60,'open',0.60),
  ('negociacao','Negociação',70,'open',0.75),
  ('ganho','Ganho',80,'won',1.0),
  ('perdido','Perdido',90,'lost',0.0)
) as s(code, nome, ordem, tipo, prob)
where p.code = 'presencial'
on conflict (pipeline_id, code) do nothing;

insert into public.crm_stages (pipeline_id, code, nome, ordem, tipo, probabilidade_config)
select p.id, s.code, s.nome, s.ordem, s.tipo, s.prob
from public.crm_pipelines p
cross join (values
  ('novo','Novo lead',10,'open',0.05),
  ('contato','Primeiro contato',20,'open',0.10),
  ('qualificado','Qualificado',30,'open',0.25),
  ('proposta','Proposta enviada',60,'open',0.55),
  ('negociacao','Negociação',70,'open',0.75),
  ('ganho','Ganho',80,'won',1.0),
  ('perdido','Perdido',90,'lost',0.0)
) as s(code, nome, ordem, tipo, prob)
where p.code = 'online'
on conflict (pipeline_id, code) do nothing;

insert into public.crm_settings (key, value) values
  ('sla', '{"novo_lead_sem_contato_horas": 24, "proposta_sem_follow_up_dias": 2, "lead_parado_dias": 5, "negociacao_antiga_dias": 7}'),
  ('reativacao', '{"cadencia_dias": [7, 14, 30, 60]}'),
  ('renovacao', '{"alertas_dias_antes": [30, 14, 7]}'),
  ('lead_scoring', '{"quente_min": 5, "morno_min": 2}'),
  ('whatsapp', '{"numero": "5511981063409"}'),
  ('tracking_baseline', '{"data": null, "descricao": "Data a partir da qual a atribuição individual passou a ser capturada prospectivamente pelo site."}')
on conflict (key) do nothing;

insert into public.crm_message_templates (tipo, titulo, corpo, ordem) values
  ('primeiro_contato','Primeiro contato','Oi, {nome}! Aqui é o Montinho. Vi que você chegou pelo site. Me conta: qual é o seu objetivo hoje e onde você treina (ou quer treinar)?',10),
  ('follow_up','Follow-up','Oi, {nome}! Passando para saber se ficou alguma dúvida sobre o que conversamos. Posso te ajudar a decidir?',20),
  ('pos_aula','Pós-experimental','{nome}, foi ótimo treinar com você hoje! Como você se sentiu? Se fizer sentido, te mando a proposta para começarmos.',30),
  ('proposta','Proposta','{nome}, segue a proposta que combinamos. Qualquer dúvida sobre valores ou horários, me chama aqui.',40),
  ('lead_sumido','Lead sumido','Oi, {nome}! Sumiu, tudo bem? Se ainda fizer sentido treinar, me avisa que a gente retoma de onde parou.',50),
  ('reativacao','Reativação','Oi, {nome}! Lembrei de você. Se quiser voltar a treinar, tenho horário esta semana. Quer conversar?',60),
  ('renovacao','Renovação','{nome}, seu plano vence em breve. Quer renovar e manter o horário? Me confirma que eu garanto a vaga.',70),
  ('indicacao','Pedido de indicação','{nome}, obrigado pela confiança! Se conhecer alguém que queira treinar, é só mandar meu contato — ou usar seu link de indicação.',80)
on conflict do nothing;
