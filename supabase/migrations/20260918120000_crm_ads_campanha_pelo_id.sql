-- Os 19 cliques "sem campanha" tinham campanha: faltava o rótulo.
--
-- COMO SE SABE, SEM PERGUNTAR A NINGUÉM
--
-- De 05 a 10/09 o anúncio levava ao site sem os parâmetros utm_*, então o
-- relatório de aquisição mostrava 19 cliques de Google Ads sem campanha
-- nenhuma — como se fossem avulsos. Mas o Google carimba a própria URL com
-- gad_campaignid, e esse número ficou gravado em landing_page desde sempre.
--
-- Ele é o mesmo dos cliques que vieram depois já rotulados:
--
--   24211117164  ->  pesquisa_consultoria_online   29 cliques (11–18/09)
--   24211117164  ->  (sem utm)                     19 cliques (05–10/09)
--
-- Mesma campanha, provada pelo identificador que o próprio Google pôs ali.
-- Isto não é preencher de memória: é ler o que estava escrito.
--
-- O QUE NÃO SE PREENCHE
--
-- utm_term e utm_content continuam nulos nessas 19 linhas, e é de propósito.
-- O termo de busca e o anúncio não estão na URL — só a campanha está. Supor
-- o termo seria inventar, e inventar atribuição é pior que não ter: uma
-- lacuna se vê, um palpite não.
update public.crm_whatsapp_handoffs
set utm_source = coalesce(utm_source, 'google'),
    utm_medium = coalesce(utm_medium, 'cpc'),
    utm_campaign = 'pesquisa_consultoria_online'
where source_code = 'google_ads'
  and utm_campaign is null
  and landing_page like '%gad_campaignid=24211117164%';

-- Mesma leitura para os toques de atribuição, que alimentam o relatório.
update public.crm_attribution_touches
set utm_source = coalesce(utm_source, 'google'),
    utm_medium = coalesce(utm_medium, 'cpc'),
    campaign = 'pesquisa_consultoria_online'
where source_code = 'google_ads'
  and campaign is null
  and landing_page like '%gad_campaignid=24211117164%';
