# Arquitetura do CRM

## Visão

O CRM vive dentro do site (Next.js 16, App Router) em `/crm`, com Postgres
do Supabase como banco e Row Level Security em todas as tabelas. Não há
servidor separado: páginas são Server Components que leem o banco com a
sessão do usuário, e toda escrita passa por Server Actions em
`app/crm/actions.ts`. O site público continua estático; só `/crm` é
dinâmico e fica atrás de `proxy.ts`, que exige sessão e marca `noindex`.

```
site público ──(cliques, UTM, gclid, Ref no WhatsApp)──▶ /api/crm/handoff, /api/crm/click
                                                            │ (anon: só INSERT)
                                                            ▼
                                                   Supabase Postgres (crm_*)
                                                            ▲
/crm (Server Components + Server Actions) ──(sessão do usuário, RLS)────┘
```

## Camadas

| Camada | Arquivos | Responsabilidade |
| --- | --- | --- |
| Banco | `supabase/migrations/2026090412*_crm_schema.sql`, `…134553_crm_security_hardening.sql`, `…190000_crm_dedupe_preserva_marcacao.sql` | Tabelas, constraints, triggers (E.164, histórico de etapa, auditoria, marcação de duplicata), RLS, seeds |
| Acesso | `lib/crm/supabase/{config,server,client}.ts`, `lib/crm/auth.ts` | Cliente Supabase por contexto; `exigirUsuario/exigirEscrita/exigirAdmin` |
| Dados | `lib/crm/dados.ts`, `lib/crm/tipos.ts` | Carrega catálogo e base tipada; nenhuma regra de negócio |
| Métricas | `lib/crm/metricas.ts` (puro), `lib/crm/analise.ts` (monta entradas a partir da base), `lib/crm/kpis.ts` (dicionário) | Toda conta é função pura testável; a tela nunca calcula |
| Visão | `lib/crm/visao.ts` | Estado consolidado de um lead (etapa, SLA, próxima ação, score explicado) |
| UI | `app/crm/**`, `components/crm/*` | Telas mobile-first, sem biblioteca de gráficos |
| Tracking | `lib/crm/tracking.ts`, `components/crm/HandoffTracker.tsx`, `lib/crm/links.ts`, `app/l/[slug]`, `app/r/[code]`, `app/api/crm/*` | Captura first-party no site |
| Importação | `scripts/crm-importar-analytics.ts`, `scripts/crm-importar-pessoas.ts` | Geram SQL idempotente e o Import Report |

## Modelo de dados

Entidades principais e o que as liga:

- **crm_contacts**: pessoa. Telefone normalizado para E.164 por trigger;
  `possivel_duplicata_de` é marcação, `merged_into_contact_id` é mesclagem
  feita por humano; `referral_code` para link de indicação; `anonimizado`
  para LGPD.
- **crm_leads**: interesse comercial de um contato. Guarda origem
  (`source_code` + `attribution_confidence`), `handoff_id` (o clique no
  WhatsApp que gerou o lead), owner, próxima ação, último contato, motivo
  de perda.
- **crm_opportunities**: negociação num pipeline, com etapa, valor,
  probabilidade, e constraints que impedem "ganho" sem serviço, plano,
  data, valor e recorrência, e "perdido" sem motivo.
- **crm_stage_history**: preenchida por trigger a cada mudança de etapa.
- **crm_trials**: aula experimental (agendada, realizada, no-show,
  cancelada).
- **crm_clients** (1 por contato), **crm_contracts** (ciclos), 
  **crm_revenue_events** (dinheiro: sale, renewal, monthly_payment,
  refund ≤ 0…), com `confidence` verified/inferred/aggregate/unknown.
- **crm_activities**, **crm_tasks**: linha do tempo e agenda.
- **crm_whatsapp_handoffs**, **crm_attribution_touches**,
  **crm_tracked_link_clicks**: tracking prospectivo.
- **crm_sources** (taxonomia com `unknown`), **crm_pipelines/stages**,
  **crm_loss_reasons**, **crm_services/plans**, **crm_settings**,
  **crm_message_templates**: configuração.
- **crm_imports**, **crm_historical_acquisition**, **crm_ad_spend**:
  histórico agregado e relatórios de importação.
- **crm_audit_log**: trigger genérico em toda tabela de negócio.

Regras que o banco garante sozinho (não dependem da UI): oportunidade ganha
completa; perdida com motivo; reembolso não positivo; um cliente por
contato; código de indicação válido; e-mail vazio vira null.

## Atribuição

Cada visita ao site gera um toque (`crm_attribution_touches`) com UTM,
gclid/gbraid/wbraid/fbclid, referrer, landing page e `confidence`. O clique
no WhatsApp reescreve o link com um código de 5 caracteres (`Ref: XXXXX`)
e grava um handoff; quando o lead é criado no CRM com esse código, os toques
passam a pertencer ao contato. Os quatro modelos (first touch, lead
creation, last non-direct, assisted) são funções puras em `atribuir()`;
`unknown` continua `unknown` e nunca vira `direct`.

## Autenticação e permissões

Supabase Auth com e-mail e senha. Só e-mails em `crm_allowlist` conseguem
criar conta (trigger em `auth.users`). Papéis: `admin` (configurações,
usuários, gastos, baseline), `vendas` (escreve), `leitura` (só lê). RLS usa
`crm_role()`, `crm_can_write()`, `crm_is_admin()`. O papel anônimo só
insere em handoffs, cliques e toques; não lê nada.

## Decisões

1. **Tudo no mesmo repositório e no mesmo deploy** do site: um único build,
   um único revert.
2. **Métricas puras** em `lib/crm/metricas.ts` com suíte própria
   (`scripts/crm-metricas-test.ts`): a tela só formata.
3. **Sem "AI score"**: o score de lead é uma soma de regras nomeadas, e a
   tela mostra cada uma.
4. **Duplicata é marcada, nunca mesclada automaticamente**.
5. **Nada de dado de saúde**: nem coluna, nem FK, nem leitura.
6. **Importações idempotentes**: ids são UUID v5 do id da fonte; rodar de
   novo não duplica.

## Planos (set/2026)

Cadastrados a partir das duas tabelas de preço do Montinho. O CRM guarda o
valor do **ciclo** e normaliza para MRR dividindo por `ciclo_meses` — por
isso a consultoria trimestral de R$ 399 entra como R$ 133/mês, e não como
R$ 399/mês.

| Serviço | Plano | Cobrança | Valor | Por mês |
| --- | --- | --- | --- | --- |
| Presencial | 2 aulas por semana | mensal | R$ 1.200 | R$ 1.200 |
| Presencial | 3 aulas por semana | mensal | R$ 1.800 | R$ 1.800 |
| Presencial | 4 aulas por semana | mensal | R$ 2.400 | R$ 2.400 |
| Presencial | 5 aulas por semana | mensal | R$ 3.000 | R$ 3.000 |
| Pacote flexível | 10 aulas + consultoria | pacote | R$ 1.500 | pagamento único |
| Online | Trimestral (12 semanas) | trimestral | R$ 399 | R$ 133 |
| Online | Semestral (24 semanas) | semestral | R$ 765 | R$ 127,50 |
| Online | Anual (48 semanas) | anual | R$ 1.440 | R$ 120 |

O desconto de 5% no Pix e o parcelamento sem juros ficam na descrição de
cada plano, não como planos separados: são forma de pagamento, não produto.
