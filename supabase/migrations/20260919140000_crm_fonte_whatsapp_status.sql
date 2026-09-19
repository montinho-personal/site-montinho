/*
 * O status do WhatsApp precisa de fonte própria.
 *
 * Já existia 'whatsapp_direct', mas ele significa outra coisa: a pessoa que
 * já tinha o número e chamou. Por isso ele está no conjunto DIRETOS da
 * atribuição, junto de 'direct'.
 *
 * Um clique vindo do status é o oposto disso: é divulgação, é o canal que
 * TROUXE a pessoa. Se ele entrasse como 'whatsapp_direct', o cálculo do
 * last non-direct o pularia — e o status, que fez o trabalho, sumiria do
 * relatório de aquisição. É exatamente o erro que o Perfil da Empresa no
 * Google sofreu antes de ganhar código próprio.
 */
insert into public.crm_sources (code, nome, categoria, custo_rastreado, ordem) values
  ('whatsapp_status','Status do WhatsApp','social',false,85)
on conflict (code) do nothing;
