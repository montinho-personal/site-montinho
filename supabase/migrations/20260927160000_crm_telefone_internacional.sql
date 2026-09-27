-- Telefone internacional com "+" era lido como brasileiro.
--
-- Um número dos EUA ("+1 (442) 279-8257") tem 11 dígitos, e a regra
-- "10 ou 11 dígitos → +55" vinha antes da regra do "+". Resultado:
-- +5514422798257. Quando o texto começa com "+", o código de país já está
-- nele; essa regra passa a valer primeiro. Número sem "+" continua
-- tratado como brasileiro, como antes.

create or replace function public.crm_normalize_phone(raw text)
returns text
language plpgsql
immutable
set search_path to 'public'
as $function$
declare d text;
begin
  if raw is null then return null; end if;
  d := regexp_replace(raw, '\D', '', 'g');
  if d = '' then return null; end if;
  if left(btrim(raw), 1) = '+' then
    if length(d) between 8 and 15 then return '+' || d; end if;
    return null;
  end if;
  if left(d, 2) = '55' and length(d) in (12, 13) then return '+' || d; end if;
  if length(d) in (10, 11) then return '+55' || d; end if;
  return null;
end $function$;

-- Recalcula só os contatos cujo telefone começa com "+" e que foram lidos
-- errado (o gatilho de escrita chama a função de novo).
update public.crm_contacts
   set telefone = telefone
 where btrim(telefone) like '+%'
   and telefone_e164 is distinct from public.crm_normalize_phone(telefone);
