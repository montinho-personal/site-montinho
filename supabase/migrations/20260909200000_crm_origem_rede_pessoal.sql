-- Origem própria para quem chegou pela rede pessoal do Montinho: amigo, conhecido,
-- vizinho, colega de academia. É boca a boca, mas não é indicação de aluno nem de
-- parceiro — antes disso, esses casos caíam em 'other' junto com o resto.
-- Na planilha de alunos é a maior fonte da base histórica (17 dos 30 alunos).

insert into public.crm_sources (code, nome, categoria, custo_rastreado, ordem) values
  ('personal_network','Amigo / conhecido','referral',false,105)
on conflict (code) do nothing;
