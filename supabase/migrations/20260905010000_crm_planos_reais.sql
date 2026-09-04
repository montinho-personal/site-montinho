-- Planos reais, das duas tabelas de preço do Montinho (set/2026).
--
-- Corrige um erro da importação histórica: o recibo de R$ 399 do Mercado Pago
-- tinha sido cadastrado como "consultoria online MENSAL". A tabela de preço
-- mostra que R$ 399 é o plano TRIMESTRAL (12 semanas). O plano é renomeado e
-- passa a ciclo 3 — não é criado outro — para os dois contratos e as duas
-- receitas já ligadas a ele continuarem válidos. Isso muda o MRR: R$ 399 a
-- cada 3 meses são R$ 133/mês, não R$ 399/mês.
update public.crm_plans
set nome = 'Consultoria trimestral · 12 semanas', tipo_cobranca = 'trimestral', ciclo_meses = 3, preco = 399,
    descricao = 'Valor total dos 3 meses. Pix à vista R$ 379,05 (5% de desconto) ou 3x de R$ 133 sem juros no cartão.', ordem = 10
where id = '8fb13400-bc44-5f52-96d2-0b29a117e5c4';

-- Seeds genéricas que nunca foram usadas por contrato, cliente ou receita.
delete from public.crm_plans p
where p.preco = 0 or p.nome in ('Presencial · pacote mensal', 'Consultoria online · mensal');

insert into public.crm_plans (service_id, nome, tipo_cobranca, ciclo_meses, preco, sessoes_por_semana, descricao, ordem)
select s.id, v.nome, v.cobranca, v.ciclo, v.preco, v.sessoes, v.descricao, v.ordem
from (values
  ('presencial','2 aulas por semana','mensal',1,1200,2,'Treinos presenciais personalizados.',10),
  ('presencial','3 aulas por semana','mensal',1,1800,3,'Treinos presenciais personalizados. O mais procurado.',20),
  ('presencial','4 aulas por semana','mensal',1,2400,4,'Treinos presenciais personalizados.',30),
  ('presencial','5 aulas por semana','mensal',1,3000,5,'Treinos presenciais personalizados.',40),
  ('flexivel','Pacote flexível · 10 aulas','pacote',1,1500,null,'10 aulas presenciais para usar quando puder, com consultoria online inclusa. Pagamento único; ao vender, informe até quando o pacote vale.',10),
  ('online','Consultoria semestral · 24 semanas','semestral',6,765,null,'Valor total dos 6 meses. Pix à vista R$ 726,75 (5% de desconto) ou 6x de R$ 127,50 sem juros no cartão.',20),
  ('online','Consultoria anual · 48 semanas','anual',12,1440,null,'Valor total dos 12 meses. Pix à vista R$ 1.368 (5% de desconto) ou 12x de R$ 120 sem juros no cartão.',30)
) as v(servico, nome, cobranca, ciclo, preco, sessoes, descricao, ordem)
join public.crm_services s on s.code = v.servico
where not exists (select 1 from public.crm_plans p where p.service_id = s.id and p.nome = v.nome);

-- Os dois contratos importados do Mercado Pago passam a valer 3 meses, e a
-- renovação prevista deixa de ser desconhecida.
update public.crm_contracts
set ciclo_meses = 3, renovacao_prevista = (inicio + interval '3 months')::date
where plan_id = '8fb13400-bc44-5f52-96d2-0b29a117e5c4' and ciclo_meses = 1;

update public.crm_clients c
set renewal_date = k.renovacao_prevista
from public.crm_contracts k
where k.client_id = c.id and k.plan_id = '8fb13400-bc44-5f52-96d2-0b29a117e5c4' and c.renewal_date is null;
