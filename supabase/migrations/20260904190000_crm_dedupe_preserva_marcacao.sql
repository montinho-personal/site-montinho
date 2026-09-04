-- Migration 003: crm_contacts_before_write só escreve possivel_duplicata_de
-- quando encontra telefone ou e-mail igual. Antes ele zerava o campo a cada
-- gravação, o que apagava marcações feitas por importação (pares por nome,
-- que o gatilho não detecta) e por pessoa.
create or replace function public.crm_contacts_before_write()
returns trigger language plpgsql set search_path = public as $$
declare dup uuid;
begin
  new.telefone_e164 := public.crm_normalize_phone(new.telefone);
  if new.email is not null and btrim(new.email::text) = '' then new.email := null; end if;
  new.updated_at := now();
  if new.merged_into_contact_id is null then
    select c.id into dup from public.crm_contacts c
     where c.id <> new.id and c.merged_into_contact_id is null and c.anonimizado = false
       and ((new.telefone_e164 is not null and c.telefone_e164 = new.telefone_e164)
         or (new.email is not null and c.email = new.email))
     order by c.created_at limit 1;
    if dup is not null then new.possivel_duplicata_de := dup; end if;
  end if;
  return new;
end $$;
