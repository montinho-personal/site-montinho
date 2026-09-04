-- Terceiro serviço: "Pacote flexível", pedido pelo Renato em 04/09/2026.
--
-- criarLead() acha o pipeline pelo MESMO code do serviço
-- (crm_pipelines.code = crm_services.code), então serviço novo sem pipeline
-- e sem etapas quebra a criação de lead. Por isso os três vêm juntos.
insert into public.crm_services (code, nome, exige_experimental, ordem) values
  ('flexivel','Pacote flexível',false,15)
on conflict (code) do nothing;

insert into public.crm_pipelines (code, nome, service_id)
select 'flexivel', 'Pacote flexível', id from public.crm_services where code = 'flexivel'
on conflict (code) do nothing;

-- Mesmas etapas do presencial: o pacote flexível também pode ter aula
-- experimental, só não a exige.
insert into public.crm_stages (pipeline_id, code, nome, ordem, tipo, probabilidade_config)
select p.id, s.code, s.nome, s.ordem, s.tipo, s.prob
from public.crm_pipelines p
cross join (values
  ('novo','Novo lead',10,'open',0.05),
  ('contato','Primeiro contato',20,'open',0.10),
  ('qualificado','Qualificado',30,'open',0.20),
  ('experimental_agendada','Experimental agendada',40,'open',0.35),
  ('experimental_realizada','Experimental realizada',50,'open',0.50),
  ('proposta','Proposta enviada',60,'open',0.60),
  ('negociacao','Negociação',70,'open',0.75),
  ('ganho','Ganho',80,'won',1.0),
  ('perdido','Perdido',90,'lost',0.0)
) as s(code, nome, ordem, tipo, prob)
where p.code = 'flexivel'
on conflict (pipeline_id, code) do nothing;

-- Plano sem preço de tabela: marcar GANHO exige plano, e o valor do pacote
-- flexível é definido na proposta.
insert into public.crm_plans (service_id, nome, tipo_cobranca, ciclo_meses, preco, descricao, ordem)
select id, 'Pacote flexível (valor por proposta)', 'pacote', 1, 0,
       'Sem preço de tabela: o valor é definido na proposta, conforme número de sessões e período.', 15
from public.crm_services where code = 'flexivel'
  and not exists (select 1 from public.crm_plans p join public.crm_services s on s.id = p.service_id where s.code = 'flexivel');
