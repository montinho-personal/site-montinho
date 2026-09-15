-- Fase 1 CRM — "Deixar em paz".
-- Sem follow-up comercial até o Montinho retomar à mão. Não é perda (o lead
-- continua aberto, com histórico e oportunidade) e não é consentimento:
-- a preferência explícita de não contato continua em crm_contacts.consent_marketing.
alter table public.crm_leads add column if not exists em_paz_at timestamptz;
comment on column public.crm_leads.em_paz_at is 'Deixar em paz: sem follow-up comercial até o Montinho retomar à mão. Não é consentimento (crm_contacts.consent_marketing) nem perda.';
