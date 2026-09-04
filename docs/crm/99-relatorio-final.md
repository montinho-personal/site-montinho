# Relatório final — CRM + Revenue Intelligence (04/09/2026)

Os 102 itens pedidos no briefing, na ordem pedida. "Feito" significa código
no repositório e verificado; "depende do Renato" está marcado assim.
Detalhes em `01-data-discovery.md` e `02-arquitetura.md`.

## Auditoria e fontes

1. **Auditoria atual** — feita antes do código; ver Data Discovery. Havia dados agregados de site e quase nada individual ligável.
2. **Infraestrutura** — Next.js 16 na Vercel (projeto site-montinho), Supabase Postgres sa-east-1 (`vsldhkkeijmeculaukee`), GTM-TDKJMPMR + GA4 G-J1ZSPMDJZE.
3. **Fontes de dados** — Drive (41 planilhas), anamnese (21 cadastros, só dados de contato), Mercado Pago (3 recibos), Calendar (aulas experimentais), GA4/GSC (exports), Google Ads (e-mails).
4. **GA4 disponível** — 15/06 a 02/09/2026, agregado; importado como 2 linhas em `crm_historical_acquisition` (fonte `ga4`).
5. **Search Console disponível** — 24/06 a 02/09/2026; 823 linhas importadas (fonte `gsc`), tela `/crm/analytics/seo`.
6. **Google Ads** — conta 644-775-2447, 3 campanhas de pesquisa desde ~22/07/2026. Sem conversão registrada: a tag tem acionador errado no GTM. Custo entra à mão em Configurações até a API ser ligada.
7. **Meta** — nenhum recibo de Meta Ads; nenhum gasto verificado. `fbclid` já é capturado.
8. **Instagram** — links controlados `/l/ig-bio`, `/l/ig-stories`, `/l/ig-destaque`, `/l/ig-consultoria`, `/l/ig-presencial` com fonte `instagram_organic`. O site usa três handles diferentes (montinhopersonal, montinhopt, montinho_personal); o correto é montinho_personal. Pendência dele.
9. **WhatsApp** — Business App sem API. O site reescreve o link com `Ref: XXXXX` e grava o handoff; o lead é ligado ao clique quando criado com o código. Sem scraping.
10. **Calendar** — 4 aulas experimentais importadas (3 realizadas inferidas, 1 agendada sem desfecho).
11. **Dados históricos** — 54 contatos, 53 clientes, 2 contratos, 3 receitas verificadas, 6 duplicatas marcadas. Relatório em `crm_imports`.
12. **Limitações históricas** — origem de todos os importados é `unknown`; receita é piso (só Mercado Pago); presença em experimental inferida.
13. **Baseline do novo tracking** — `crm_settings.tracking_baseline = 2026-09-04`. Antes disso, atribuição individual não existe.

## Arquitetura e banco

14. **Arquitetura** — app em `/crm` dentro do site, Server Components + Server Actions, RLS. Ver `02-arquitetura.md`.
15. **Banco de dados** — 3 migrations em `supabase/migrations/`, aplicadas.
16. **Contact** — `crm_contacts`: E.164 por trigger, duplicata marcada, mesclagem humana, código de indicação, anonimização.
17. **Lead** — `crm_leads`: origem + confiança, handoff, owner, próxima ação com data, último contato, motivo de perda, reativação.
18. **Opportunity** — `crm_opportunities`: pipeline, etapa, valor, probabilidade; constraints de ganho completo e perda com motivo.
19. **Client** — `crm_clients` (um por contato), status, plano, renovação, origem, `origem_registro` crm/import.
20. **RevenueEvent** — `crm_revenue_events`: sale/renewal/monthly_payment/upgrade/downgrade/refund/cancellation/adjustment, status expected/contracted/collected, confiança, taxa, ref externa.
21. **Activities** — `crm_activities` com 25 tipos; toda ação relevante gera uma.
22. **Tasks** — `crm_tasks` com tipo, vencimento, conclusão; alimentam Hoje e Follow-ups.
23. **Trials** — `crm_trials`: agendada/realizada/no_show/cancelada, origem manual/import_calendar/automacao.
24. **Pipelines** — presencial (com aula experimental) e online (sem).
25. **Stages** — novo, contato, qualificado, experimental agendada, experimental realizada, proposta, negociação, ganho, perdido; probabilidade configurada e histórica.
26. **Loss reasons** — 11 motivos seedados, obrigatórios ao perder.
27. **Follow-up** — SLA configurável (24 h sem contato, 2 dias proposta sem follow-up, 5 dias parado, 7 dias negociação antiga); cadência de reativação 7/14/30/60; tela `/crm/follow-ups`.
28. **Source taxonomy** — 19 fontes em `crm_sources` com categoria e `custo_rastreado`; `unknown` é válida e nunca vira `direct`.
29. **UTMs** — capturadas em toda página do site em `mp_attr` e enviadas com o handoff/toque; preservadas ao atravessar `/l/` e `/r/`.
30. **Click IDs** — gclid, gbraid, wbraid, fbclid capturados e gravados no toque; ausência não bloqueia venda.
31. **WhatsApp attribution** — via código Ref no texto da mensagem + handoff com toques.
32. **Social attribution** — links controlados por canal e destaque; cliques em `crm_tracked_link_clicks`.
33. **Referral system** — código por cliente, link `/r/<code>`, `referred_by_contact_id` em contato e lead; tela `/crm/indicacoes`.
34. **First-touch** — `atribuir().firstTouch`.
35. **Lead-creation-touch** — `atribuir().leadCreation`.
36. **Last-touch** — `atribuir().lastNonDirect` (último não direto; direto só se não houver outro).
37. **Assisted touch** — `atribuir().assisted` lista as fontes intermediárias.
38. **Attribution confidence** — high/medium/low em lead, cliente e toque; `coberturaAtribuicao` mostra quanto é `unknown`.
39. **GA4 backfill** — feito (agregado), Import Report id `d33fc3f3-…`.
40. **Search Console backfill** — feito (823 linhas), Import Report id `7fb321ee-…`.
41. **Ads backfill** — não há dado de custo estruturado; só resumos por e-mail. Entrada manual disponível.
42. **WhatsApp backfill** — impossível sem API; leads antigos entraram como `unknown`.
43. **Deduplication** — trigger por telefone/e-mail e marcação por nome na importação; mesclar/não é duplicata em Qualidade de Dados; cliente que volta não vira contato novo (o lead novo aponta para o contato existente).

## Métricas

44. **Funnel metrics** — `taxasFunil` (100→80→50→30→20→10 testado).
45. **Sales metrics** — win rate, ciclo de venda, primeira resposta, SLA.
46. **Revenue metrics** — realizada/contratada/esperada por status, por mês, por fonte, por plano.
47. **MRR** — `mrrNormalizado` (valor/ciclo_meses; 1200 trimestral = 400/mês testado) e movimentos new/expansion/contraction/churn.
48. **ARPU** — `arpuMensal`.
49. **Retention** — `retencaoClientes` por janela (95% testado).
50. **Churn** — clientes e receita.
51. **Cohorts** — `coortes` por mês de primeira compra com M0…M12 e receita 30/90/180/365.
52. **LTV realized** — soma de eventos coletados, líquido de reembolso (3×1000 e refund testados). Cliente importado sem receita fica fora da média e é contado na tela.
53. **LTV projected** — só com 15 clientes, 6 meses e 5 encerrados; antes disso a tela diz "dados imaturos".
54. **LTV by source** — `ltvPorFonte`, com aviso de amostra pequena.
55. **CAC** — família completa abaixo.
56. **Media CAC** — `cacMidia` (5000/10 = 500 testado); `null` com motivo quando a fonte não tem custo rastreado.
57. **Fully Loaded CAC** — `cacFullyLoaded` com custos fixos de Configurações.
58. **CPL** — custo/leads no dicionário e na tela de Ads.
59. **CPQL** — custo/qualificados, mesma tela.
60. **Cost per Trial** — custo/experimentais realizadas.
61. **Cost per Sale** — custo/vendas.
62. **LTV:CAC** — `ltvCac` sempre rotulado (observado vs projetado; 10x testado).
63. **CAC Payback** — `paybackMeses` = CAC / margem mensal.
64. **ROAS** — receita/gasto quando há gasto.
65. **Revenue by source** — tela Aquisição.
66. **Revenue by landing page** — `landingPages()` na tela de Atribuição.
67. **Revenue by campaign** — por `campaign` do toque de criação do lead.
68. **Revenue by social** — tela Social por link controlado e fonte.
69. **Referral metrics** — taxa de indicação (8/20 testado), conversão de indicados, LTV indicados vs não.
70. **Trial metrics** — agendadas, realizadas, show rate (15/20 testado), conversão pós-aula.
71. **No-show** — taxa e lista para follow-up.
72. **Response time** — `primeiraResposta` (mediana/média) a partir de `first_response_at`.
73. **Sales cycle** — `cicloDeVendaDias`.
74. **Win rate** — 10/20 testado.
75. **Pipeline value** — bruto.
76. **Weighted pipeline** — por probabilidade histórica quando há amostra, senão configurada.
77. **Forecast** — receita esperada por mês a partir de contratos e pipeline ponderado, rotulada como estimativa.

## Telas

78. **Dashboard Hoje** — `/crm`: Daily Decision Engine por regras transparentes, cada item com motivo.
79. **Dashboard Pipeline** — `/crm/pipeline` (kanban) com SLA visível.
80. **Dashboard Aquisição** — `/crm/analytics/aquisicao`.
81. **Dashboard Revenue** — `/crm/analytics/receita`.
82. **Dashboard LTV** — `/crm/analytics/ltv`.
83. **Dashboard Retention** — dentro de LTV (retenção, churn, tenure, renovação).
84. **Dashboard Attribution** — `/crm/analytics/atribuicao` com os 4 modelos lado a lado e cobertura.
85. **Dashboard Social** — `/crm/analytics/social`.
86. **Dashboard Referral** — `/crm/indicacoes`.
87. **Dashboard Data Quality** — `/crm/qualidade-de-dados`: leads sem próxima ação/owner, duplicatas, clientes sem plano, vendas sem fonte, importados sem receita.

## Operação

88. **Automations** — por regra no banco e no Hoje (SLA, reativação, renovação); sem envio automático de mensagem (templates prontos para copiar).
89. **Mobile** — layout mobile-first; verificado em 360/390/430 no login e nas listas.
90. **UX** — ações de um toque por lead (WhatsApp, próxima ação, mover etapa), formulários curtos.
91. **LGPD** — consentimento por contato, anonimização, sem dado de saúde, export sob login, `noindex` em `/crm`.
92. **Security** — RLS em todas as tabelas; anon só insere tracking; funções com `search_path` fixo; advisor sem alertas críticos após a migration 002.
93. **Permissions** — admin / vendas / leitura via allowlist.
94. **Audit Log** — `crm_audit_log` por trigger em toda tabela de negócio.
95. **Backup** — backups diários do Supabase (plano do projeto); export CSV manual.
96. **Export** — `/api/crm/export?tabela=…` CSV sob login.
97. **Tests** — `scripts/crm-metricas-test.ts` cobre todos os casos do briefing; suítes do site continuam verdes.
98. **QA** — regras de banco validadas por SQL (dedupe, E.164, histórico de etapa, auditoria, anon sem SELECT, ganho incompleto rejeitado).
99. **Build** — `npx tsc --noEmit` e `npx next build` verdes.
100. **Deploy** — junto com o site, na Vercel, após o merge.
101. **Limitações** — origem histórica desconhecida; receita histórica piso; Google Ads sem conversão até o GTM ser corrigido; WhatsApp sem API; e-gress do ambiente de desenvolvimento não alcança o Supabase, então a UI foi validada localmente sem banco e as regras por SQL.
102. **Roadmap** — (a) corrigir GTM e marcar `whatsapp_click`/`generate_lead` como evento-chave; (b) API do Google Ads para custo automático; (c) conversão offline com gclid a partir do CRM; (d) Mercado Pago API; (e) revisar as 6 duplicatas; (f) registrar receita dos 50 clientes importados sem recibo; (g) WhatsApp Cloud API se o volume justificar.

## O que depende do Renato

- Entrar em `/crm/login` com o e-mail da allowlist e criar senha em "Primeiro acesso".
- Corrigir o acionador da tag de conversão no GTM.
- Decidir as 6 duplicatas em Qualidade de Dados.
- Informar custo do Google Ads por mês em Configurações até a API ser ligada.
- Padronizar o handle do Instagram no site.
