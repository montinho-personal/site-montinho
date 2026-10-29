-- Funil simplificado (pedido do Montinho, 30/10/2026):
--   Novo → Conversando → Proposta → Ganho / Perdido,
--   com Experimental (agendada e realizada) só no Personal presencial.
-- "Qualificado" e "Negociação" nunca foram usados (0 oportunidades e 0
-- histórico em 30/10/2026), nem as experimentais do Pacote flexível. A etapa
-- "contato" continua com o mesmo código (o código das ações depende dele) e
-- passa a se chamar "Conversando": é para onde vai quem respondeu.
do $$
begin
  if exists (
    select 1 from crm_stages s
    join crm_pipelines p on p.id = s.pipeline_id
    where (s.code in ('qualificado', 'negociacao') or (p.code <> 'presencial' and s.code like 'experimental%'))
      and (exists (select 1 from crm_opportunities o where o.stage_id = s.id)
        or exists (select 1 from crm_stage_history h where h.to_stage_id = s.id or h.from_stage_id = s.id))
  ) then
    raise exception 'Há oportunidade ou histórico numa etapa que seria removida: revisar antes.';
  end if;

  delete from crm_stages s using crm_pipelines p
  where p.id = s.pipeline_id
    and (s.code in ('qualificado', 'negociacao') or (p.code <> 'presencial' and s.code like 'experimental%'));

  update crm_stages set nome = 'Conversando' where code = 'contato';
end $$;
