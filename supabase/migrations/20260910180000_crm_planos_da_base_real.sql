-- Os dois planos que a base real usa e o catálogo não tinha.
--
-- A planilha de alunos do Renato (importada em 09/09/2026) mostrou 15 alunos
-- numa "Consultoria mensal" de R$ 150 e uma aluna em "1 aula por semana" —
-- nenhum dos dois existia em crm_plans. Sem eles, essas fichas ficavam sem
-- plano e o catálogo não refletia o que ele de fato vende.
--
-- Preços: os R$ 150 são o valor praticado por 15 alunos, e encaixam na curva
-- do online (mensal 150 > trimestral 133/mês > semestral 127,50 > anual 120:
-- o desconto vem do compromisso). Os R$ 600 da aula semanal saem da própria
-- tabela presencial, que é linear em R$ 600 por sessão semanal (2x = 1200,
-- 3x = 1800, 4x = 2400, 5x = 3000) — não é chute, é a aritmética da tabela.
-- A única aluna nesse formato pagava R$ 320, valor negociado; valor pago vive
-- em crm_revenue_events, preço de tabela vive aqui.

insert into public.crm_plans (id, service_id, nome, tipo_cobranca, ciclo_meses, preco, sessoes_por_semana, descricao, ordem)
select 'c1a1e1f1-0000-4000-8000-000000000001', id, 'Consultoria mensal', 'mensal', 1, 150, null,
  'Sem fidelidade. É o plano de entrada do online e o mais vendido da base histórica.', 5
from public.crm_services where code = 'online'
on conflict (id) do nothing;

insert into public.crm_plans (id, service_id, nome, tipo_cobranca, ciclo_meses, preco, sessoes_por_semana, descricao, ordem)
select 'c1a1e1f1-0000-4000-8000-000000000002', id, '1 aula por semana', 'mensal', 1, 600, 1,
  'Entrada do presencial, na mesma proporção dos demais: R$ 600 por sessão semanal.', 5
from public.crm_services where code = 'presencial'
on conflict (id) do nothing;
