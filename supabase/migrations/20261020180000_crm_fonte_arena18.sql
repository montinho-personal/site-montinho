/*
 * Arena 18 tem fonte própria.
 *
 * Quem o Montinho conhece treinando na Arena 18, conversa sobre o trabalho
 * lá e acaba fechando com ele caía em "Amigo / conhecido", junto da rede
 * pessoal de fora da academia. Separar mostra quanto a presença na Arena 18
 * traz de aluno.
 *
 * A reclassificação de cada pessoa é feita pelo próprio CRM (origem do lead)
 * ou como correção de dados pontual, não aqui. O primeiro caso foi Daniel
 * Galo, confirmado pelo Montinho em 20/10/2026.
 */
insert into public.crm_sources (code, nome, categoria, custo_rastreado, ordem) values
  ('arena18','Arena 18 (conheceu na academia)','offline',false,155)
on conflict (code) do nothing;
