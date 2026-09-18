-- Nem toda resposta devolve a bola.
--
-- O botão "Ela respondeu" tratava "quanto custa?" e "ok, valeu" como a mesma
-- coisa: os dois jogavam o lead para o topo da tela Hoje com PRIORIDADE ALTA
-- e "está esperando você". Só o primeiro está.
--
-- O efeito prático era pior que um card errado. A tela pedia para escrever
-- de novo uma hora depois de alguém dizer "qualquer coisa te chamo" — que é
-- exatamente a pessoa a quem não se deve escrever. Quem seguisse a lista
-- parecia ansioso; quem não seguisse aprendia a desconfiar dela.
--
-- Esta coluna separa as duas. Enquanto reply_handled_at estiver em dia com
-- last_reply_at, a resposta está dada por resolvida e o lead não aparece
-- esperando ninguém. Uma resposta nova (marcar "Ela respondeu" de novo)
-- limpa a marca e o card volta ao topo, que é o que deve acontecer quando a
-- bola realmente volta.
alter table public.crm_leads add column if not exists reply_handled_at timestamptz;
comment on column public.crm_leads.reply_handled_at is
  'Quando a última resposta dela foi dada por resolvida. Nem toda resposta pede retorno: "ok", "valeu", "qualquer coisa te chamo" encerram o turno em vez de devolver a bola. Enquanto isto for maior ou igual a last_reply_at, o lead não aparece em "respondeu e está esperando você".';
