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
 * Nenhum texto cita o objetivo da pessoa ("pensando em emagrecer"). O campo
 * que guardaria isso (`crm_leads.interesse`) está vazio em 67 dos 68 leads, e
 * é texto livre digitado num momento — a mensagem sai semanas depois. Botar
 * um objetivo errado na boca de quem treina para outra coisa custa mais caro
 * do que não citar objetivo nenhum. A variável {objetivo} continua existindo
 * e chega limpa (ver objetivoUsavel em copy.ts), mas nenhum texto a usa; o
 * teste cobra isso para a decisão não se perder.
 *
 * As regras que todo texto segue (e scripts/crm-copy-test.ts cobra):
 * uma pergunta só, no fim; parágrafos curtos e espaçados; cada toque traz
 * algo novo (nunca "só passando"); ancorado num dado concreto da pessoa
 * quando existe; decisão devolvida a ela; sem preço, sem número inventado,
 * sem urgência falsa, sem emoji, sem CREF.
 */
export const SITUACOES = [
  // Chegou
  "primeiro_contato_site", "primeiro_contato_duvida", "primeiro_contato_anuncio", "primeiro_contato_indicacao", "primeiro_contato_generico",
  "segundo_toque",
  // Falou e o próximo passo depende do serviço: presencial passa pela experimental, o resto vai ao plano
  "convite_experimental", "convite_proposta",
  // Experimental
  "experimental_confirmar", "experimental_sem_registro", "experimental_no_show", "pos_experimental_proposta",
  // Proposta na mesa
  "proposta_follow_up_1", "proposta_follow_up_2", "negociacao_parada",
  // Virou aluno
  "boas_vindas", "check_in_aluno", "pedido_indicacao",
  "renovacao_proxima", "renovacao_vencida", "renovacao_pacote", "reativacao_pausa_recente", "reativacao_pausado", "reativacao_antiga",
  // Adiado: presença sem cobrança. Outra espécie de mensagem — ver SITUACOES_CONTEUDO.
  "conteudo_primeiro", "conteudo_ferramenta", "conteudo_do_que_ela_disse",
] as const;
export type Situacao = (typeof SITUACOES)[number];

/*
 * As mensagens de conteúdo são o contrário de todas as outras: elas não
 * perguntam nada.
 *
 * Toda mensagem do acervo termina em uma pergunta, porque pergunta é o que
 * faz a conversa continuar. Aqui isso seria mentira. Estas chegam depois de
 * uma mensagem que prometeu não cobrar — e um "o que achou?" no fim é a
 * cobrança de volta, com fantasia. Quem recebe sente, e aí não se perde só o
 * lead: perde-se a credibilidade da promessa anterior.
 *
 * Por isso elas terminam no link e acabam ali. Se a pessoa responder, o
 * ciclo reinicia por vontade dela. Se não responder, não aconteceu nada de
 * ruim — que é exatamente o ponto.
 */
export const SITUACOES_CONTEUDO = new Set<Situacao>(["conteudo_primeiro", "conteudo_ferramenta", "conteudo_do_que_ela_disse"]);

export const TEXTOS: Record<Situacao, string> = {
  // Primeiro contato: quem é (em primeira pessoa), de onde a pessoa veio, e UMA pergunta de objetivo com opções — respondível em dez segundos.
  primeiro_contato_site:
    "[[{saudacao}, ]]{nome}! Aqui é o Montinho — sou eu mesmo que respondo por aqui.\n\nQue bom que você me chamou! Vi que chegou pelo site[[, na página {pagina}]].\n\nAntes de sugerir qualquer coisa eu gosto de entender seu caso. Me conta: o objetivo hoje é emagrecer, ganhar massa ou voltar a treinar com segurança?",
  primeiro_contato_duvida:
    "[[{saudacao}, ]]{nome}! Aqui é o Montinho — sou eu mesmo que respondo por aqui.\n\n[[Vi aqui sua dúvida: \"{pergunta}\". ]]Te respondo já, mas prefiro não responder no automático, porque a resposta muda conforme o seu caso.\n\nMe conta rapidinho: o objetivo hoje é emagrecer, ganhar massa ou voltar a treinar?",
  primeiro_contato_anuncio:
    "[[{saudacao}, ]]{nome}! Aqui é o Montinho — sou eu mesmo que respondo por aqui.\n\nVi que você me achou pelo Google. Atendo presencial em Alphaville e região, e online pro Brasil inteiro.\n\nMe conta seu caso que eu te oriento: o objetivo hoje é emagrecer, ganhar massa ou voltar a treinar com segurança?",
  primeiro_contato_indicacao:
    "[[{saudacao}, ]]{nome}! Aqui é o Montinho — sou eu mesmo que respondo por aqui.\n\n[[{indicador} me falou de você, que bom! ]]Faço com todo mundo a mesma coisa: entender o caso antes de sugerir, porque aqui não tem ficha pronta.\n\nMe conta: o objetivo hoje é emagrecer, ganhar massa ou voltar a treinar com segurança?",
  primeiro_contato_generico:
    "[[{saudacao}, ]]{nome}! Aqui é o Montinho — sou eu mesmo que respondo por aqui.\n\nAntes de sugerir qualquer coisa eu gosto de entender seu caso, porque aqui não tem ficha pronta.\n\nMe conta: o que te trouxe até aqui — emagrecer, ganhar massa ou voltar a treinar com segurança?",

  // Segundo toque: puxa em vez de empurrar. Tira a culpa, avisa que não vai cobrar, e pergunta pelo custo de continuar como está.
  segundo_toque:
    "[[{saudacao}, ]]{nome}! Imagino que a semana tenha engolido você[[ nesses {dias} dias]] — acontece, e não vou ficar te cobrando, fica à vontade.\n\nSó pra eu não te mandar nada genérico: o que costuma te fazer adiar o treino — falta de tempo, dor ou resultado que não vem?",

  // Depois da proposta: a dúvida certa é sobre COMO funciona, nunca sobre preço. O último toque devolve a decisão e facilita o "não".
  proposta_follow_up_1:
    "[[{saudacao}, ]]{nome}! Te mandei a proposta[[ de {servico}]][[ há {dias} dias]]. Sem pressa nenhuma pra decidir.\n\nFicou alguma dúvida sobre como funciona no dia a dia — frequência, ajustes, contato entre os treinos — que eu possa esclarecer?",
  /*
   * O link da história entra AQUI, e não antes, por dois motivos.
   *
   * É o momento em que a dúvida deixa de ser sobre o plano e passa a ser
   * sobre a pessoa: quem some depois da proposta raramente some por preço —
   * some por achar que não vai dar conta, ou que do outro lado tem alguém
   * que nunca esteve onde ela está. "Eu já fui obeso" responde isso, e é a
   * única frase da história que muda a dúvida dela.
   *
   * E é escrito assim, e não "conheça minha história", de propósito. Pedir
   * que ela leia sobre o Montinho seria virar a mensagem para ele bem na
   * hora em que ele acabou de prometer parar de empurrar. A frase oferece
   * uma informação e segue; a pergunta no fim continua sendo sobre ela.
   *
   * O endereço é o link controlado /l/historia-lead, e não /minha-historia
   * direto: a mensagem sai pelo WhatsApp, onde o referrer não chega, e sem
   * isso não há como saber se alguém abriu. É contagem por canal, não por
   * pessoa — ninguém fica carimbado.
   */
  proposta_follow_up_2:
    "[[{saudacao}, ]]{nome}! Imagino que não seja o momento agora, e tá tudo bem mesmo — não vou ficar te cobrando.\n\nDeixo a proposta guardada, sem prazo, pra quando fizer sentido pra você.\n\nSe um dia ajudar: eu já fui obeso e comecei do zero, contei tudo aqui — https://www.montinhopersonal.com.br/l/historia-lead\n\nSeria má ideia eu te dar um oi daqui a um mês?",
  negociacao_parada:
    "[[{saudacao}, ]]{nome}! Parece que ficou alguma coisa travando na hora de decidir[[ sobre {servico}]], e isso é super normal. Não quero ficar te empurrando.\n\nSó pra eu conseguir te ajudar de verdade — e se for só o momento, também vale: o que pesa mais agora, o horário, o formato ou o investimento?",

  // O degrau que separa "conversou" de "comprou". No presencial é a aula experimental: gratuita e
  // sem compromisso — confirmado pelo Renato em 10/09/2026 e dito também em /lp/personal-alphaville.
  // "Gratuita" só entrou depois de confirmado; antes a mensagem prometia só "sem compromisso".
  convite_experimental:
    "[[{saudacao}, ]]{nome}! O jeito mais honesto de você saber se treinar comigo funciona pra você é experimentando.\n\nA gente marca uma aula experimental[[ aí em {cidade}]]: eu avalio, monto o treino na hora e você sente como é. É gratuita e sem compromisso de fechar nada depois.\n\nQual dia dessa semana fica melhor pra você?",
  convite_proposta:
    "[[{saudacao}, ]]{nome}! Pelo que você me contou, já dá pra montar seu plano.\n\nEu monto em cima do seu objetivo e da sua rotina de verdade — não é ficha pronta — e te mando pra você ler com calma, sem compromisso.\n\nQuer que eu monte?",

  // Experimental: confirmação com o que levar e imprevisto já resolvido reduz no-show mais que lembrete. Depois, perguntar pelo corpo converte mais que "gostou?".
  experimental_confirmar:
    "[[{saudacao}, ]]{nome}! Nossa aula experimental[[ é {dia_hora}]][[, {local}]]! Leva roupa de treino e água, o resto eu cuido.\n\nVai ser bem tranquilo — é pra eu entender seu caso, não pra te testar. Se pintar imprevisto, me avisa que a gente remarca numa boa.\n\nTá mantido pra você?",
  experimental_sem_registro:
    "[[{saudacao}, ]]{nome}! Queria saber da aula[[ de {dia_hora}]]. Se rolou, me conta como o corpo ficou depois.\n\nE se não deu pra ir, tudo bem, acontece — a gente remarca sem problema nenhum.\n\nQual dos dois foi?",
  // Faltou: a pessoa já sabe que faltou. Cobrar afasta; reabrir a porta com um próximo passo concreto traz de volta.
  experimental_no_show:
    "[[{saudacao}, ]]{nome}! Você não conseguiu vir[[ {dia_hora}]] e tá tudo certo, imprevisto acontece com todo mundo.\n\nSua vaga continua aqui, sem cobrança nenhuma. Quer que eu veja outro dia dessa semana?",
  pos_experimental_proposta:
    "[[{saudacao}, ]]{nome}! Gostei demais de treinar com você! A parte mais chata você já fez: apareceu, treinou e me mostrou o que precisa de ajuste.\n\nVou te mandar agora a proposta montada em cima do que a gente viu, sem compromisso, pra você ler com calma.\n\nPrefere que eu explique cada formato ou quer ler primeiro?",

  // Virou aluno. A venda acabou; a partir daqui a conversa é sobre o treino, e é ela que
  // segura a renovação. As três primeiras semanas decidem quem fica.
  boas_vindas:
    "[[{saudacao}, ]]{nome}! Que bom ter você comigo![[ Seu plano: {plano}.]]\n\nVou acompanhar de perto e ajustar o que precisar no caminho — se algum exercício incomodar ou o horário ficar ruim, me fala na hora.\n\nFicou alguma dúvida sobre como a gente vai trabalhar?",
  check_in_aluno:
    "[[{saudacao}, ]]{nome}! Queria saber de você. Se tiver algum exercício incomodando, ou um horário que ficou ruim na sua rotina, me fala que eu ajusto.\n\nComo o treino tá caindo nessas últimas semanas?",
  // 28 dos 30 alunos vieram de boca a boca. Pedir é o passo que faltava — depois do resultado, uma vez só, sem constranger.
  pedido_indicacao:
    "[[{saudacao}, ]]{nome}! Você tá firme no treino, e o mérito é seu.\n\nSe conhecer alguém que quer começar e não sabe por onde, pode passar meu contato — cuido da pessoa do mesmo jeito que cuido de você. E se não for a hora, ignora essa aqui numa boa.\n\nTem alguém em mente?",

  // Renovação e reativação: pergunta sobre o treino, não sobre pagamento. O horário reservado é fato, não escassez inventada.
  renovacao_proxima:
    "[[{saudacao}, ]]{nome}! Eu já quero desenhar o próximo ciclo com você[[ — seu plano fecha em {renova_em} dias]], mantendo seu horário na agenda.\n\nTem algo que você queira priorizar nas próximas semanas, ou seguimos no que tá dando certo?",
  /*
   * Fim do pacote flexível. A lista de datas não é enfeite: quem paga por
   * pacote guarda a própria conta, e mandar a renovação sem mostrar as aulas
   * dadas é pedir para a conversa virar "mas eu tinha mais aula, não tinha?".
   * A conferência vem antes da venda, de propósito.
   */
  renovacao_pacote:
    "[[{saudacao}, ]]{nome}! Fechou o pacote[[ de {aulas} aulas]] 👏[[ Foram {semanas} semanas de treino.]]\n\n[[Anotei todas as datas: {datas}.\n\n]]Confere se bate com o seu controle. Quer que eu já abra o próximo pra gente não parar?",
  renovacao_vencida:
    "[[{saudacao}, ]]{nome}! Seu plano venceu[[ há {dias} dias]] e eu não quero fechar seu horário sem te perguntar antes. Nada de cobrança, é só pra eu organizar a agenda.\n\nVocê quer seguir no próximo ciclo ou prefere dar uma pausa agora?",
  /*
   * As três reativações. Nenhuma pergunta "quer voltar?" logo de cara, e
   * nenhuma fala de preço: 16 dos 19 que saíram saíram por "parou de
   * treinar", não por dinheiro. Oferecer desconto aqui responde a pergunta
   * que ninguém fez — e queima margem com quem voltaria de graça.
   */
  reativacao_pausa_recente:
    "[[{saudacao}, ]]{nome}! Passando pra saber como você tá.\n\nSua pausa já está fazendo[[ uns {dias} dias]] e eu não quis deixar passar. Se foi só a correria do mês, a gente retoma leve; se tem algo no treino pra ajustar, me fala que eu ajusto.\n\nQuer retomar essa semana?",
  reativacao_antiga:
    "[[{saudacao}, ]]{nome}! Aqui é o Montinho.\n\nFaz um tempão, né. Lembrei de você esses dias e resolvi mandar um oi, sem segundas intenções.\n\nTá treinando ainda?",
  reativacao_pausado:
    "[[{saudacao}, ]]{nome}! Aqui é o Montinho.\n\nFiquei pensando em você esses dias. A gente treinou junto e depois você sumiu — e eu sei como é, a vida aperta e o treino é sempre o primeiro a cair.\n\nComo você tá com o treino hoje?",

  // Primeiro conteúdo: desmente a previsão dela. Ela espera cobrança; recebe
  // um presente que não pede nada. "Ignora sem dó" está lá de propósito —
  // dar permissão de ignorar é o que faz a frase de abertura ser acreditada.
  conteudo_primeiro:
    "[[{saudacao}, ]]{nome}! Sem cobrar nada, prometido — separei uma coisa que pode te servir.\n\n[[É sobre {assunto}. ]]Se não fizer sentido agora, ignora sem dó.\n\n{link}",
  // Segundo: ferramenta, não artigo. Um número sobre o corpo dela é o
  // formato mais lembrado que existe, e devolve a ela um motivo de voltar
  // que não é o Montinho pedindo.
  conteudo_ferramenta:
    "[[{saudacao}, ]]{nome}! Passando só pra deixar uma ferramenta que fiz[[, sobre {assunto}]].\n\nLeva um minuto e o resultado é seu, não meu. Não precisa me responder nada.\n\n{link}",
  // Terceiro: provar que ouviu vale mais que o melhor texto do acervo. O que
  // ela disse entra por {assunto}, escrito à mão na hora de escolher o
  // artigo — nunca por {objetivo}, que às vezes é deduzido e não dito, e
  // supor o objetivo errado é pior do que não citar nenhum.
  conteudo_do_que_ela_disse:
    "[[{saudacao}, ]]{nome}! Lembrei de uma conversa nossa quando escrevi isto aqui.\n\n[[É sobre {assunto}. ]]Deixo caso sirva — sem compromisso nenhum, de verdade.\n\n{link}",
};
