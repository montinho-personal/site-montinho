-- Onboarding de alunos (04/11/2026).
--
-- Do fechamento até o início do acompanhamento, cada aluno passa por um
-- fluxo de etapas. O fluxo é um MODELO versionado (editável nas
-- configurações, sem mexer em código); cada aluno recebe uma INSTÂNCIA
-- copiada da versão vigente, e é nela que o Montinho marca o que fez.
--
-- O que NÃO se grava: atrasada, bloqueada e o percentual. São derivados do
-- prazo, das dependências e dos status, em lib/crm/onboarding-fluxo.ts, para
-- nunca ficarem inconsistentes com os dados.
--
-- Não substitui crm_tasks: as tarefas antigas de onboarding (D+3/10/21 e
-- primeiros envios) ficam como histórico dos alunos de antes. A partir desta
-- migração o ganho cria a instância aqui, não lá.

-- ---------------------------------------------------------------------------
-- Modelos e versões
-- ---------------------------------------------------------------------------
create table if not exists public.crm_onboarding_templates (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  -- A quem o modelo se aplica. Nulo = qualquer serviço/plano (modelo principal).
  service_id uuid references public.crm_services(id) on delete set null,
  plan_id uuid references public.crm_plans(id) on delete set null,
  ativo boolean not null default true,
  padrao boolean not null default false,
  versao_atual integer not null default 0,
  created_by uuid references public.crm_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.crm_onboarding_templates is 'Modelos de onboarding. A definição (fases e etapas) fica nas versões; o modelo só aponta a vigente.';

create table if not exists public.crm_onboarding_template_versions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.crm_onboarding_templates(id) on delete cascade,
  versao integer not null,
  -- {fases:[{key,nome,ordem}], etapas:[{key,fase,nome,...}]}: validada em lib/crm/onboarding-fluxo.ts (validarDefinicao) antes de gravar.
  definicao jsonb not null,
  nota text,
  created_by uuid references public.crm_users(id),
  created_at timestamptz not null default now(),
  unique (template_id, versao)
);
comment on table public.crm_onboarding_template_versions is 'Cada publicação do editor é uma versão nova, imutável. Onboardings em andamento continuam na versão em que nasceram.';

-- ---------------------------------------------------------------------------
-- Instâncias por aluno
-- ---------------------------------------------------------------------------
create table if not exists public.crm_onboardings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.crm_clients(id) on delete cascade,
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  template_id uuid not null references public.crm_onboarding_templates(id),
  version_id uuid not null references public.crm_onboarding_template_versions(id),
  plan_id uuid references public.crm_plans(id) on delete set null,
  status text not null default 'em_andamento' check (status in ('em_andamento','pausado','concluido','cancelado')),
  iniciado_em timestamptz not null default now(),
  pausado_em timestamptz,
  concluido_em timestamptz,
  -- Cópia das fases da versão: o editor pode renomear fases depois sem mexer aqui.
  fases jsonb not null default '[]'::jsonb,
  created_by uuid references public.crm_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Um onboarding aberto por aluno. Concluídos e cancelados ficam no histórico.
create unique index if not exists crm_onboardings_aberto_idx on public.crm_onboardings(client_id) where status in ('em_andamento','pausado');
create index if not exists crm_onboardings_status_idx on public.crm_onboardings(status);

create table if not exists public.crm_onboarding_tasks (
  id uuid primary key default gen_random_uuid(),
  onboarding_id uuid not null references public.crm_onboardings(id) on delete cascade,
  -- Cópia da etapa do modelo no momento da criação (ou da atualização explícita).
  key text not null,
  fase text not null,
  nome text not null,
  descricao text,
  instrucoes text,
  ordem integer not null,
  obrigatoria boolean not null default true,
  prazo jsonb not null default '{"tipo":"sem_prazo"}'::jsonb,
  depende_de text[] not null default '{}',
  condicao jsonb,
  ativar_se jsonb,
  na_se text,
  mensagem text,
  materiais jsonb not null default '[]'::jsonb,
  lembrete jsonb not null default '{"no_dia":true,"dia_antes":false,"atraso":true,"repetir_dias":2}'::jsonb,
  avisar boolean not null default true,
  acao text check (acao in ('whatsapp','cliente','dados')),
  -- O que o Montinho marca. "Atrasada" e "bloqueada" não existem aqui de propósito: são derivadas.
  status text not null default 'pendente' check (status in ('pendente','em_andamento','aguardando_aluno','concluida','pausada','nao_aplicavel')),
  resposta text,
  due_at timestamptz,
  due_origem text check (due_origem in ('regra','manual')),
  started_at timestamptz,
  completed_at timestamptz,
  completed_by uuid references public.crm_users(id),
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (onboarding_id, key)
);
create index if not exists crm_onboarding_tasks_due_idx on public.crm_onboarding_tasks(due_at) where status not in ('concluida','nao_aplicavel');
comment on column public.crm_onboarding_tasks.observacoes is 'Nota interna do personal sobre a etapa. Nunca dado de saúde: a anamnese vive no app.';

-- Histórico: quem fez o quê, quando. Nunca se apaga; reabrir uma tarefa só acrescenta.
create table if not exists public.crm_onboarding_events (
  id bigserial primary key,
  onboarding_id uuid not null references public.crm_onboardings(id) on delete cascade,
  task_id uuid references public.crm_onboarding_tasks(id) on delete set null,
  tipo text not null check (tipo in ('iniciado','pausado','retomado','concluido','cancelado','status','resposta','prazo','observacao','whatsapp_aberto','lembrete','versao_aplicada','adiado')),
  de text,
  para text,
  detalhe jsonb not null default '{}'::jsonb,
  created_by uuid references public.crm_users(id),
  created_at timestamptz not null default now()
);
create index if not exists crm_onboarding_events_onb_idx on public.crm_onboarding_events(onboarding_id, created_at desc);

-- Avisos: o aviso em si é derivado (chave = tarefa + tipo + dia). Aqui fica só
-- o que o usuário fez com ele. Ler ou dispensar NÃO conclui a tarefa.
create table if not exists public.crm_onboarding_avisos (
  chave text primary key,
  onboarding_id uuid not null references public.crm_onboardings(id) on delete cascade,
  task_id uuid references public.crm_onboarding_tasks(id) on delete cascade,
  lido_em timestamptz,
  dispensado_em timestamptz,
  adiado_ate timestamptz,
  updated_by uuid references public.crm_users(id),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Permissões: todo papel lê; user/admin operam; só admin edita modelos.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  for t in select unnest(array['crm_onboardings','crm_onboarding_tasks','crm_onboarding_events','crm_onboarding_avisos']) loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists crm_select on public.%I', t);
    execute format('create policy crm_select on public.%I for select to authenticated using (public.crm_role() is not null)', t);
    execute format('drop policy if exists crm_insert on public.%I', t);
    execute format('create policy crm_insert on public.%I for insert to authenticated with check (public.crm_can_write())', t);
    execute format('drop policy if exists crm_update on public.%I', t);
    execute format('create policy crm_update on public.%I for update to authenticated using (public.crm_can_write()) with check (public.crm_can_write())', t);
    execute format('drop policy if exists crm_delete on public.%I', t);
    execute format('create policy crm_delete on public.%I for delete to authenticated using (public.crm_can_write())', t);
  end loop;
  for t in select unnest(array['crm_onboarding_templates','crm_onboarding_template_versions']) loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists crm_select on public.%I', t);
    execute format('create policy crm_select on public.%I for select to authenticated using (public.crm_role() is not null)', t);
    execute format('drop policy if exists crm_insert on public.%I', t);
    execute format('create policy crm_insert on public.%I for insert to authenticated with check (public.crm_is_admin())', t);
    execute format('drop policy if exists crm_update on public.%I', t);
    execute format('create policy crm_update on public.%I for update to authenticated using (public.crm_is_admin()) with check (public.crm_is_admin())', t);
    execute format('drop policy if exists crm_delete on public.%I', t);
    execute format('create policy crm_delete on public.%I for delete to authenticated using (public.crm_is_admin())', t);
  end loop;
end $$;

-- Auditoria, como nas outras tabelas do CRM.
do $$
declare t text;
begin
  for t in select unnest(array['crm_onboarding_templates','crm_onboarding_template_versions','crm_onboardings','crm_onboarding_tasks']) loop
    execute format('drop trigger if exists crm_audit_trg on public.%I', t);
    execute format('create trigger crm_audit_trg after insert or update or delete on public.%I for each row execute function public.crm_audit()', t);
  end loop;
end $$;

-- O modelo principal nasce vazio aqui: a versão 1 (o fluxo descrito no
-- briefing) é publicada pela aplicação a partir de FLUXO_PADRAO, para a
-- definição ter uma fonte só (lib/crm/onboarding-fluxo.ts) e passar pela
-- mesma validação de qualquer versão editada.
insert into public.crm_onboarding_templates (nome, descricao, padrao)
select 'Onboarding padrão', 'Fluxo principal: coleta, análise, entrega e acompanhamento inicial.', true
where not exists (select 1 from public.crm_onboarding_templates where padrao);
