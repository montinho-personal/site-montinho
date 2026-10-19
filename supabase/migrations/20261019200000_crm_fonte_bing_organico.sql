/*
 * Bing tem fonte própria.
 *
 * Clique vindo de bing.com caía em 'other' ("Outro"), junto de qualquer site
 * desconhecido, e sumia da conta de busca orgânica. Em 19/10/2026 eram 6
 * cliques no botão do WhatsApp nessa situação, dois deles no mesmo dia. O
 * Bing também alimenta a busca do ChatGPT (ver o aviso IndexNow), então vale
 * enxergar o canal separado do Google.
 *
 * O backfill só toca o que a regra antiga classificou como 'other' a partir
 * de um referrer do Bing: nenhum desses cliques tinha virado lead.
 */
insert into public.crm_sources (code, nome, categoria, custo_rastreado, ordem) values
  ('bing_organic','Bing orgânico','organic',false,15)
on conflict (code) do nothing;

update public.crm_whatsapp_handoffs set source_code = 'bing_organic'
where source_code = 'other' and referrer ~* '^https?://([a-z0-9-]+\.)*bing\.com';

update public.crm_attribution_touches set source_code = 'bing_organic'
where source_code = 'other' and referrer ~* '^https?://([a-z0-9-]+\.)*bing\.com';
