/**
 * Textos por situação de follow-up. Variáveis entre chaves; trecho entre
 * [[ e ]] some quando a variável dentro dele está vazia (ver copy.ts).
 *
 * Versão provisória, escrita à mão: será substituída pelo resultado da
 * pesquisa com painel de copywriters e verificação adversarial.
 */
export const SITUACOES = [
  "primeiro_contato_site", "primeiro_contato_duvida", "primeiro_contato_anuncio", "primeiro_contato_indicacao", "primeiro_contato_generico",
  "segundo_toque", "proposta_follow_up_1", "proposta_follow_up_2", "negociacao_parada",
  "experimental_confirmar", "experimental_sem_registro", "pos_experimental_proposta", "lead_quente",
  "renovacao_proxima", "renovacao_vencida", "reativacao_pausado",
] as const;
export type Situacao = (typeof SITUACOES)[number];

export const TEXTOS: Record<Situacao, string> = {
  primeiro_contato_site: "Oi, {nome}! Aqui é o Montinho. Vi que você chegou pela página [[«{pagina}»]] do site. Me conta em uma frase: o que você quer mudar no treino hoje?",
  primeiro_contato_duvida: "Oi, {nome}! Aqui é o Montinho. Vi sua mensagem[[ sobre «{pergunta}»]]. Me conta um pouco mais do seu caso para eu te responder certo: o que você quer mudar no treino?",
  primeiro_contato_anuncio: "Oi, {nome}! Aqui é o Montinho. Vi que você me chamou pelo site. Para eu te responder certo: você procura treino presencial aqui na região ou consultoria online?",
  primeiro_contato_indicacao: "Oi, {nome}! Aqui é o Montinho. [[O {indicador} me falou de você. ]]Me conta em uma frase: o que você quer mudar no treino hoje?",
  primeiro_contato_generico: "Oi, {nome}! Aqui é o Montinho. Vi que você me chamou. Me conta em uma frase: o que você quer mudar no treino hoje?",
  segundo_toque: "{nome}, você deve estar corrido. Faz sentido a gente conversar ainda, ou é melhor deixar para outro momento?",
  proposta_follow_up_1: "{nome}, te mandei os valores há {dias} dias. Ficou alguma dúvida que eu possa esclarecer antes de você decidir?",
  proposta_follow_up_2: "{nome}, imagino que a prioridade tenha mudado, e tudo bem. Posso guardar sua proposta e não te chamar mais por enquanto?",
  negociacao_parada: "{nome}, a gente parou a conversa[[ sobre o {servico}]] há {dias} dias. O que faltou para você bater o martelo?",
  experimental_confirmar: "{nome}, nossa aula experimental é {dia_hora}[[ no {local}]]. Está confirmado para você?",
  experimental_sem_registro: "{nome}, se você veio[[ na aula de {dia_hora}]], me conta como se sentiu. Se não deu, a gente remarca — qual dia fica melhor?",
  pos_experimental_proposta: "{nome}, foi bom treinar com você. Te mando agora o plano com valores e horários para você decidir com calma?",
  lead_quente: "{nome}, pelo que você me contou[[ sobre {objetivo}]], dá para começar esta semana. Qual dia fica melhor para você?",
  renovacao_proxima: "{nome}, [[seu plano renova em {renova_em} dias e ]]seu horário continua reservado para o próximo ciclo. Renovamos igual?",
  renovacao_vencida: "{nome}, seu plano venceu há {dias} dias e seu horário continua reservado. Renovamos igual, ou quer ajustar alguma coisa?",
  reativacao_pausado: "{nome}, lembrei de você. Sem cobrança nenhuma: se quiser voltar a treinar, me fala que eu vejo um horário. Faz sentido?",
};
