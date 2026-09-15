-- Fase 1 CRM — sinal "Ela respondeu".
--
-- first_response_at sempre registrou o PRIMEIRO CONTATO DO MONTINHO (é ele
-- quem clica em enviar), mas o código lia o campo como "o lead respondeu".
-- A resposta real do lead ganha coluna própria; first_response_at continua
-- sendo o tempo de primeira resposta do time, como o KPI define.
alter table public.crm_leads
  add column if not exists last_reply_at timestamptz;

comment on column public.crm_leads.last_reply_at is
  'Última resposta REAL do lead, registrada à mão pelo botão "Ela respondeu". Null = nunca respondeu.';
comment on column public.crm_leads.first_response_at is
  'Primeiro contato humano do time com o lead (tempo de primeira resposta). Não indica que o lead respondeu.';
