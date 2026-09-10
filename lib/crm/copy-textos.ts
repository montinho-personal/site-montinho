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
 * As regras que todo texto segue (e scripts/crm-copy-test.ts cobra):
 * uma pergunta só, no fim; 2–4 frases curtas; cada toque traz algo novo
 * (nunca "só passando"); ancorado num dado concreto da pessoa quando existe;
 * decisão devolvida a ela; sem preço, sem número inventado, sem urgência
 * falsa, sem emoji, sem CREF.
 */
export const SITUACOES = [
  "primeiro_contato_site", "primeiro_contato_duvida", "primeiro_contato_anuncio", "primeiro_contato_indicacao", "primeiro_contato_generico",
  "segundo_toque", "proposta_follow_up_1", "proposta_follow_up_2", "negociacao_parada",
  "experimental_confirmar", "experimental_sem_registro", "pos_experimental_proposta", "lead_quente",
  "renovacao_proxima", "renovacao_vencida", "reativacao_pausado",
] as const;
export type Situacao = (typeof SITUACOES)[number];

export const TEXTOS: Record<Situacao, string> = {
  // Primeiro contato: quem é (em primeira pessoa, sem robô), de onde a pessoa veio, e UMA pergunta de objetivo com opções — respondível em dez segundos.
  primeiro_contato_site:
    "Oi, {nome}! Aqui é o Montinho, eu mesmo respondo — sem robô e sem formulário. Vi que você chegou pelo site[[, pela página «{pagina}»]].\nAntes de sugerir qualquer coisa eu gosto de entender o caso. Hoje o objetivo é emagrecer, ganhar massa ou voltar a treinar com segurança?",
  primeiro_contato_duvida:
    "Oi, {nome}! Aqui é o Montinho, eu mesmo respondo — sem robô. [[Vi sua dúvida: «{pergunta}». ]]Te respondo já, mas a resposta honesta depende do seu caso, não gosto de responder no automático.\nPra eu acertar: hoje o objetivo é emagrecer, ganhar massa ou voltar a treinar?",
  primeiro_contato_anuncio:
    "Oi, {nome}! Vi que você me achou pelo Google. Aqui é o Montinho, eu mesmo respondo — sem robô. Atendo presencial em Alphaville e região, e online pro Brasil inteiro.\nAntes de sugerir qualquer coisa eu gosto de entender o caso: hoje o objetivo é emagrecer, ganhar massa ou voltar a treinar com segurança?",
  primeiro_contato_indicacao:
    "Oi, {nome}! Aqui é o Montinho, eu mesmo respondo — sem robô.[[ {indicador} me falou de você.]] Faço com todo mundo a mesma coisa: entender o caso antes de sugerir, não trabalho com ficha pronta.\nHoje o objetivo é emagrecer, ganhar massa ou voltar a treinar com segurança?",
  primeiro_contato_generico:
    "Oi, {nome}! Aqui é o Montinho, eu mesmo respondo — sem robô e sem formulário. Antes de sugerir qualquer coisa eu gosto de entender o caso, não trabalho com ficha pronta.\nO que te trouxe até aqui: emagrecer, ganhar massa ou voltar a treinar com segurança?",

  // Segundo toque: puxa em vez de empurrar. Tira a culpa, avisa que não vai cobrar, e pergunta pelo custo de continuar como está.
  segundo_toque:
    "{nome}, te escrevi[[ há {dias} dias]] e imagino que a semana tenha engolido você — acontece, e não vou ficar te cobrando.\nSó pra eu não te mandar nada genérico: o que costuma te fazer adiar o treino — falta de tempo, dor ou resultado que não vem?",

  // Depois da proposta: a dúvida certa é sobre COMO funciona, nunca sobre preço. O último toque devolve a decisão e facilita o "não".
  proposta_follow_up_1:
    "{nome}, te mandei a proposta[[ de {servico}]][[ há {dias} dias]][[, pra {objetivo}]].\nFicou alguma dúvida sobre como funciona no dia a dia (frequência, ajustes, contato entre os treinos) que eu possa esclarecer antes de você decidir?",
  proposta_follow_up_2:
    "{nome}, imagino que não seja o momento agora, e tá tudo bem — não vou ficar te cobrando. A proposta fica guardada, sem prazo, pra quando fizer sentido.\nSeria má ideia eu te dar um oi daqui a um mês?",
  negociacao_parada:
    "{nome}, parece que ficou alguma coisa travando na hora de decidir[[ sobre {servico}]], e isso é normal — não quero ficar te empurrando.\nSó pra eu te ajudar de verdade, e se for só o momento também vale: o que pesa mais agora — o horário, o formato ou o investimento?",

  // Experimental: confirmação com o que levar e plano B já resolvido reduz no-show mais que lembrete. Depois, perguntar pelo corpo converte mais que "gostou?".
  experimental_confirmar:
    "{nome}, nossa aula experimental[[ é {dia_hora}]][[, {local}]]. Roupa de treino e água, o resto eu cuido — vai ser leve, é pra eu entender seu caso, não pra te testar. Se pintar imprevisto, me avisa antes que a gente remarca.\nTá mantido pra você?",
  experimental_sem_registro:
    "Oi, {nome}. Sobre a aula[[ de {dia_hora}]]: se rolou, me conta como o corpo ficou depois. Se não deu pra ir, tudo bem, acontece — a gente remarca sem problema.\nQual dos dois foi?",
  pos_experimental_proposta:
    "{nome}, gostei de treinar com você. A parte mais chata você já fez: treinou e me mostrou o que precisa de ajuste[[ pra chegar em {objetivo}]]. Vou te mandar agora a proposta montada em cima do que a gente viu — sem compromisso, pra você ler com calma.\nPrefere que eu explique cada formato ou quer ler primeiro?",

  // Lead quente: quem já engajou recebe próximo passo concreto, com duas opções de horário — sem voltar ao "faz sentido?".
  lead_quente:
    "Boa, {nome}. O próximo passo é simples: marcar o primeiro dia[[ e começar a trabalhar em {objetivo}]]. Se quiser, vejo um horário ainda essa semana.\nFica melhor pra você de manhã cedo ou no fim do dia?",

  // Renovação e reativação: pergunta sobre o treino, não sobre pagamento. O horário reservado é fato, não escassez inventada.
  renovacao_proxima:
    "{nome}, [[seu plano fecha em {renova_em} dias e ]]eu quero já desenhar o próximo ciclo com você, mantendo seu horário na agenda.\nTem algo que você quer priorizar nas próximas semanas, ou seguimos no que tá dando certo?",
  renovacao_vencida:
    "{nome}, seu plano venceu[[ há {dias} dias]] e eu não quero fechar seu horário sem te perguntar antes — não é cobrança, é pra eu organizar a agenda.\nVocê quer seguir no próximo ciclo ou prefere dar uma pausa agora?",
  reativacao_pausado:
    "{nome}, faz um tempo[[ — uns {dias} dias]] que a gente pausou, e imagino que a rotina tenha mudado. Sem cobrança nenhuma: se voltar a treinar passar pela cabeça, eu montaria uma primeira semana curta, só pra retomar o ritmo de onde você parou.\nQuer que eu monte?",
};
