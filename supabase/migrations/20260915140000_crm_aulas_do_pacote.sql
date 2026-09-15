-- Pacote flexível: contar as aulas dadas, não os meses.
--
-- Nos planos mensais a renovação tem data. No pacote flexível não: o aluno
-- treina 1x numa semana, 2x na outra, some por quinze dias, e o pacote de 20
-- aulas pode durar dois meses ou cinco. Cobrar renovação por data nesse caso
-- é chutar — a conta certa é quantas aulas já foram dadas.
--
-- Cada aula dada vira uma linha aqui. O contrato guarda quantas foram
-- contratadas. Quando as duas se encontram, o pacote acabou.
create table if not exists public.crm_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.crm_clients(id) on delete cascade,
  contract_id uuid references public.crm_contracts(id) on delete set null,
  data date not null,
  observacao text,
  origem_registro text not null default 'crm' check (origem_registro in ('crm','import','automacao')),
  created_at timestamptz not null default now(),
  created_by uuid references public.crm_users(id)
);

-- Uma aula por aluno por dia. É o que impede a mesma lista colada duas vezes
-- de dobrar a contagem — e contagem errada aqui vira cobrança errada.
create unique index if not exists crm_sessions_cliente_data_idx on public.crm_sessions(client_id, data);
create index if not exists crm_sessions_contrato_idx on public.crm_sessions(contract_id, data);

comment on table public.crm_sessions is 'Aulas efetivamente dadas. Só para plano de pacote; plano mensal continua contando por data.';
comment on column public.crm_sessions.data is 'Dia da aula. Sem hora de propósito: o que importa para o pacote é a aula, não o horário.';

alter table public.crm_contracts add column if not exists sessoes_contratadas integer;
comment on column public.crm_contracts.sessoes_contratadas is 'Tamanho do pacote (ex.: 20 aulas). Nulo em plano mensal, que renova por data.';

alter table public.crm_sessions enable row level security;
drop policy if exists crm_select on public.crm_sessions;
create policy crm_select on public.crm_sessions for select to authenticated using (public.crm_role() is not null);
drop policy if exists crm_insert on public.crm_sessions;
create policy crm_insert on public.crm_sessions for insert to authenticated with check (public.crm_can_write());
drop policy if exists crm_update on public.crm_sessions;
create policy crm_update on public.crm_sessions for update to authenticated using (public.crm_can_write()) with check (public.crm_can_write());
drop policy if exists crm_delete on public.crm_sessions;
create policy crm_delete on public.crm_sessions for delete to authenticated using (public.crm_can_write());
