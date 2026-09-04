-- CRM migration 002: endurecimento apontado pelo advisor de segurança
alter function public.crm_can_write() set search_path = public;
alter function public.crm_is_admin() set search_path = public;
alter function public.crm_normalize_phone(text) set search_path = public;
alter function public.crm_contacts_before_write() set search_path = public;
alter function public.crm_opportunity_stage_change() set search_path = public;
-- Funções de trigger não precisam de EXECUTE para disparar; ninguém chama por RPC.
revoke execute on function public.crm_audit() from public, anon, authenticated;
revoke execute on function public.crm_handle_new_auth_user() from public, anon, authenticated;
-- Anônimo nunca precisa saber papel de ninguém.
revoke execute on function public.crm_role() from public, anon;
revoke execute on function public.crm_can_write() from public, anon;
revoke execute on function public.crm_is_admin() from public, anon;
grant execute on function public.crm_role() to authenticated;
grant execute on function public.crm_can_write() to authenticated;
grant execute on function public.crm_is_admin() to authenticated;
-- citext fora do public
create schema if not exists extensions;
alter extension citext set schema extensions;
