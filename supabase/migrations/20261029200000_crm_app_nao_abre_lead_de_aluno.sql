-- O App Montinho não abre lead para quem já é aluno.
--
-- Em 27/10/2026 uma aluna ativa (Camilla Valentim, cliente desde 27/02) entrou
-- no app como visitante, e receber_app_montinho abriu um "lead novo" para ela:
-- ela apareceu na tela de hoje como primeiro contato, com mensagem de venda.
--
-- Agora, se o contato tem cliente ativo ou pausado, o evento do app vira
-- atividade no cliente (client_id) e não abre lead nem tarefa de follow-up.
--
-- Aplicado em produção em 29/10/2026 trocando trechos exatos da função que
-- estava no banco (ela já divergia de 20261022160000). Cada troca confere que
-- casou uma vez só; rodar de novo não faz nada.
do $do$
declare d text := pg_get_functiondef('public.receber_app_montinho(jsonb)'::regprocedure); o text; r record;
begin
  if position('v_cliente' in d) > 0 then return; end if;
  for r in select * from (values
   (1, E'  v_tipo text;\nbegin', E'  v_tipo text;\n  v_cliente uuid;\nbegin'),
   (2, E'  if v_lead is null or not exists (select 1 from crm_leads where id = v_lead) then\n    -- Lead aberto',
       E'  -- Já é aluno (cliente ativo ou pausado)? Não abre lead: o app é dele, não é um visitante.\n  -- Em 27/10/2026 uma aluna ativa entrou no app e virou "lead novo" na tela de hoje.\n  select k.id into v_cliente from crm_clients k where k.contact_id = v_contato and k.status in (''ativo'', ''pausado'') limit 1;\n  if v_cliente is not null then\n    v_lead := null;\n  elsif v_lead is null or not exists (select 1 from crm_leads where id = v_lead) then\n    -- Lead aberto'),
   (3, E'    insert into crm_activities (contact_id, lead_id, tipo, descricao, metadata)\n    values (v_contato, v_lead, v_tipo, v_desc,',
       E'    insert into crm_activities (contact_id, lead_id, client_id, tipo, descricao, metadata)\n    values (v_contato, v_lead, v_cliente, v_tipo, v_desc,'),
   (4, E'  if evento in (''whatsapp_clicado'', ''desafio_concluido'')\n',
       E'  if v_cliente is null and evento in (''whatsapp_clicado'', ''desafio_concluido'')\n')
  ) t(n, a, b) loop
    if position(r.a in d) = 0 then raise exception 'trecho % não encontrado', r.n; end if;
    o := d; d := replace(d, r.a, r.b);
    if length(d) - length(o) <> length(r.b) - length(r.a) then raise exception 'trecho % casou mais de uma vez', r.n; end if;
  end loop;
  execute d;
end $do$;

-- O lead que já tinha sido aberto para ela fica inativo (não é perda: não
-- entra nos motivos de perda nem na taxa de conversão).
update crm_leads set status = 'inativo', next_action = null, next_action_at = null, updated_at = now()
 where id = 'aac8ad95-0df9-4332-8354-1192ebe7083e' and status = 'aberto';
