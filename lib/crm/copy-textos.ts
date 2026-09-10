/**
 * Textos por situação de follow-up. Variáveis entre chaves; trecho entre
 * [[ e ]] some quando a variável dentro dele está vazia (ver copy.ts).
 *
 * De onde vieram: seis pesquisas (frameworks de follow-up, WhatsApp no
 * Brasil, venda de personal/consultoria, ciência comportamental, objeções,
 * retenção), um guia de voz extraído do site, três copywriters com ângulos
 * diferentes escrevendo cada situação, dois juízes por situação e uma edição
 * final que parte da vencedora e enxerta o que os juízes pediram. O playbook
 * com as fontes está em docs/crm-playbook-whatsapp.md.
 *
 * Formato: parágrafos separados por linha em branco (\n\n). No WhatsApp isso
 * é o que separa "cumprimento", "contexto" e "pergunta" em blocos que se
 * leem de relance no celular — texto corrido vira parede e não se lê.
 *
 * As regras que todo texto segue (e scripts/crm-copy-test.ts cobra):
 * uma pergunta só, no fim; parágrafos curtos e espaçados; cada toque traz
 * algo novo (nunca "só passando"); ancorado num dado concreto da pessoa
 * quando existe; decisão devolvida a ela; sem preço, sem número inventado,
 * sem urgência falsa, sem emoji, sem CREF.
 */
export const SITUACOES = [
  "primeiro_contato_site", "primeiro_contato_duvida", "primeiro_contato_anuncio", "primeiro_contato_indicacao", "primeiro_contato_generico",
  "segundo_toque", "proposta_follow_up_1", "proposta_follow_up_2", "negociacao_parada",
  "experimental_confirmar", "experimental_sem_registro", "pos_experimental_proposta", "lead_quente",
  "renovacao_proxima", "renovacao_vencida", "reativacao_pausado",
] as const;
export type Situacao = (typeof SITUACOES)[number];

export const TEXTOS: Record<Situacao, string> = {
  // Primeiro contato: quem é (em primeira pessoa), de onde a pessoa veio, e UMA pergunta de objetivo com opções — respondível em dez segundos.
  primeiro_contato_site:
    "Oi, {nome}! Aqui é o Montinho — sou eu mesmo que respondo por aqui.\n\nQue bom que você me chamou! Vi que chegou pelo site[[, na página {pagina}]].\n\nAntes de sugerir qualquer coisa eu gosto de entender seu caso. Me conta: o objetivo hoje é emagrecer, ganhar massa ou voltar a treinar com segurança?",
  primeiro_contato_duvida:
    "Oi, {nome}! Aqui é o Montinho — sou eu mesmo que respondo por aqui.\n\n[[Vi aqui sua dúvida: \"{pergunta}\". ]]Te respondo já, mas prefiro não responder no automático, porque a resposta muda conforme o seu caso.\n\nMe conta rapidinho: o objetivo hoje é emagrecer, ganhar massa ou voltar a treinar?",
  primeiro_contato_anuncio:
    "Oi, {nome}! Aqui é o Montinho — sou eu mesmo que respondo por aqui.\n\nVi que você me achou pelo Google. Atendo presencial em Alphaville e região, e online pro Brasil inteiro.\n\nMe conta seu caso que eu te oriento: o objetivo hoje é emagrecer, ganhar massa ou voltar a treinar com segurança?",
  primeiro_contato_indicacao:
    "Oi, {nome}! Aqui é o Montinho — sou eu mesmo que respondo por aqui.\n\n[[{indicador} me falou de você, que bom! ]]Faço com todo mundo a mesma coisa: entender o caso antes de sugerir, porque aqui não tem ficha pronta.\n\nMe conta: o objetivo hoje é emagrecer, ganhar massa ou voltar a treinar com segurança?",
  primeiro_contato_generico:
    "Oi, {nome}! Aqui é o Montinho — sou eu mesmo que respondo por aqui.\n\nAntes de sugerir qualquer coisa eu gosto de entender seu caso, porque aqui não tem ficha pronta.\n\nMe conta: o que te trouxe até aqui — emagrecer, ganhar massa ou voltar a treinar com segurança?",

  // Segundo toque: puxa em vez de empurrar. Tira a culpa, avisa que não vai cobrar, e pergunta pelo custo de continuar como está.
  segundo_toque:
    "{nome}, imagino que a semana tenha engolido você[[ nesses {dias} dias]] — acontece, e não vou ficar te cobrando, fica à vontade.\n\nSó pra eu não te mandar nada genérico: o que costuma te fazer adiar o treino — falta de tempo, dor ou resultado que não vem?",

  // Depois da proposta: a dúvida certa é sobre COMO funciona, nunca sobre preço. O último toque devolve a decisão e facilita o "não".
  proposta_follow_up_1:
    "{nome}, te mandei a proposta[[ de {servico}]][[ há {dias} dias]][[, pensando em {objetivo}]]. Sem pressa nenhuma pra decidir.\n\nFicou alguma dúvida sobre como funciona no dia a dia — frequência, ajustes, contato entre os treinos — que eu possa esclarecer?",
  proposta_follow_up_2:
    "{nome}, imagino que não seja o momento agora, e tá tudo bem mesmo — não vou ficar te cobrando.\n\nDeixo a proposta guardada, sem prazo, pra quando fizer sentido pra você.\n\nSeria má ideia eu te dar um oi daqui a um mês?",
  negociacao_parada:
    "{nome}, parece que ficou alguma coisa travando na hora de decidir[[ sobre {servico}]], e isso é super normal. Não quero ficar te empurrando.\n\nSó pra eu conseguir te ajudar de verdade — e se for só o momento, também vale: o que pesa mais agora, o horário, o formato ou o investimento?",

  // Experimental: confirmação com o que levar e imprevisto já resolvido reduz no-show mais que lembrete. Depois, perguntar pelo corpo converte mais que "gostou?".
  experimental_confirmar:
    "{nome}, nossa aula experimental[[ é {dia_hora}]][[, {local}]]! Leva roupa de treino e água, o resto eu cuido.\n\nVai ser bem tranquilo — é pra eu entender seu caso, não pra te testar. Se pintar imprevisto, me avisa que a gente remarca numa boa.\n\nTá mantido pra você?",
  experimental_sem_registro:
    "Oi, {nome}! Queria saber da aula[[ de {dia_hora}]]. Se rolou, me conta como o corpo ficou depois.\n\nE se não deu pra ir, tudo bem, acontece — a gente remarca sem problema nenhum.\n\nQual dos dois foi?",
  pos_experimental_proposta:
    "{nome}, gostei demais de treinar com você! A parte mais chata você já fez: apareceu, treinou e me mostrou o que precisa de ajuste[[ pra você {objetivo}]].\n\nVou te mandar agora a proposta montada em cima do que a gente viu, sem compromisso, pra você ler com calma.\n\nPrefere que eu explique cada formato ou quer ler primeiro?",

  // Lead quente: quem já engajou recebe próximo passo concreto, com duas opções de horário — sem voltar ao "faz sentido?".
  lead_quente:
    "Boa, {nome}! O próximo passo é simples: marcar o primeiro dia[[ e começar a trabalhar seu objetivo de {objetivo}]].\n\nSe você quiser, eu vejo um horário ainda essa semana. Fica melhor pra você de manhã cedo ou no fim do dia?",

  // Renovação e reativação: pergunta sobre o treino, não sobre pagamento. O horário reservado é fato, não escassez inventada.
  renovacao_proxima:
    "{nome}, [[seu plano fecha em {renova_em} dias e ]]eu já quero desenhar o próximo ciclo com você, mantendo seu horário na agenda.\n\nTem algo que você queira priorizar nas próximas semanas, ou seguimos no que tá dando certo?",
  renovacao_vencida:
    "{nome}, seu plano venceu[[ há {dias} dias]] e eu não quero fechar seu horário sem te perguntar antes. Nada de cobrança, é só pra eu organizar a agenda.\n\nVocê quer seguir no próximo ciclo ou prefere dar uma pausa agora?",
  reativacao_pausado:
    "{nome}, lembrei de você por aqui! A gente pausou faz um tempo[[, uns {dias} dias]], e imagino que a rotina tenha mudado.\n\nSem cobrança nenhuma: se voltar a treinar passar pela sua cabeça, eu monto uma primeira semana curta, só pra retomar o ritmo de onde você parou.\n\nQuer que eu monte?",
};
