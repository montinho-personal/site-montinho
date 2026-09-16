-- Assistente de IA como fonte de aquisição própria.
--
-- POR QUE ISTO EXISTE
--
-- Duas pessoas chegaram por ChatGPT em dois dias (15/09 e 16/09), com
-- utm_source=chatgpt.com, e as duas viraram lead. O CRM não tinha código
-- para isso, então caíam em "outro" ou "desconhecida" — e some do relatório
-- de aquisição justamente o canal sobre o qual a pergunta começou a ser
-- feita: "quanto o ChatGPT me traz?".
--
-- CATEGORIA: ORGANIC, E NÃO "OTHER"
--
-- É visibilidade conquistada e não paga — a mesma natureza do Google
-- orgânico, e é assim que deve somar no relatório. Pôr em "other" seria
-- esconder de novo, só com outro nome.
--
-- A ordem 85 coloca a fonte ao lado das outras de descoberta, antes das de
-- indicação.
insert into public.crm_sources (code, nome, categoria, custo_rastreado, ordem, ativo)
values ('ai_assistant', 'Assistente de IA (ChatGPT e afins)', 'organic', false, 85, true)
on conflict (code) do nothing;

-- Reclassifica o que já tinha chegado por IA e estava em "outro" ou
-- "desconhecida". A evidência é o utm_source gravado no handoff, então isto
-- não é chute: são as linhas em que o próprio site registrou a origem.
update public.crm_leads l
set source_code = 'ai_assistant',
    attribution_confidence = 'high',
    updated_at = now()
from public.crm_whatsapp_handoffs h
where h.lead_id = l.id
  and l.source_code in ('other', 'unknown')
  and (
    h.utm_source ilike '%chatgpt%' or h.utm_source ilike '%openai%' or
    h.utm_source ilike '%perplexity%' or h.utm_source ilike '%copilot%' or
    h.utm_source ilike '%gemini%' or h.utm_source ilike '%claude%'
  );

update public.crm_attribution_touches t
set source_code = 'ai_assistant'
where t.source_code in ('other', 'unknown')
  and (
    t.utm_source ilike '%chatgpt%' or t.utm_source ilike '%openai%' or
    t.utm_source ilike '%perplexity%' or t.utm_source ilike '%copilot%' or
    t.utm_source ilike '%gemini%' or t.utm_source ilike '%claude%'
  );

update public.crm_whatsapp_handoffs h
set source_code = 'ai_assistant'
where h.source_code in ('other', 'unknown')
  and (
    h.utm_source ilike '%chatgpt%' or h.utm_source ilike '%openai%' or
    h.utm_source ilike '%perplexity%' or h.utm_source ilike '%copilot%' or
    h.utm_source ilike '%gemini%' or h.utm_source ilike '%claude%'
  );
