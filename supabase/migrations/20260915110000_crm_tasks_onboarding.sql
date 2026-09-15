-- Fase 1 CRM — tarefas de onboarding (D+3, D+10, D+21) criadas no ganho.
-- Tipo próprio para dar para encontrar, encerrar no cancelamento e medir.
alter table public.crm_tasks drop constraint if exists crm_tasks_tipo_check;
alter table public.crm_tasks add constraint crm_tasks_tipo_check
  check (tipo in ('primeiro_contato','follow_up','enviar_proposta','lembrete_experimental','pos_experimental','reativacao','renovacao','pedir_indicacao','onboarding','outro'));
