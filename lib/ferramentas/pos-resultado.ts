import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { Estagio, Ferramenta } from "./historico";

/**
 * O que vem depois do resultado, ferramenta por ferramenta.
 *
 * A pessoa acabou de descobrir um número sobre ela mesma. As três camadas
 * que este arquivo descreve fazem esse número virar um caminho:
 *
 *   1. RESULTADO      — a ferramenta já mostra; não é daqui.
 *   2. INTERPRETAÇÃO  — uma frase dizendo o que o número significa na
 *                       prática, e o que ele NÃO diz.
 *   3. PRÓXIMO PASSO  — uma ação. Qual, depende do degrau da escada
 *                       (lib/ferramentas/historico.ts): próxima ferramenta,
 *                       diagnóstico ou conversa.
 *
 * O CTA muda com o RESULTADO, não só com a ferramenta. "Seu volume está
 * alto" e "seu volume está baixo" não podem receber a mesma pergunta — é a
 * diferença entre continuação e propaganda.
 *
 * NADA DAQUI TOCA O DOM. É função pura de (ferramenta, categoria do
 * resultado, estágio, resumo) → bloco concreto. O componente só apresenta.
 */

export interface Bloco {
  /** Camada 2: o que o número quer dizer, e o que não quer. */
  interpretacao: string;
  /** Camada 3: a pergunta que abre a próxima ação. */
  pergunta: string;
  botao: string;
  destino: "whatsapp" | "diagnostico" | "ferramenta";
  href: string;
  /** Ação discreta, uma só, nunca competindo com a principal. */
  secundaria?: { label: string; href: string; destino: "ferramenta" | "diagnostico" | "whatsapp" };
}

/**
 * Variantes da pergunta de conversa — a única variável em teste.
 *
 * Mudar texto E destino ao mesmo tempo não ensina nada. As três variantes
 * têm o mesmo destino (WhatsApp) e a mesma mensagem; muda só a pergunta.
 */
export const VARIANTES_PERGUNTA = {
  a: "Quer que eu te ajude a interpretar?",
  b: "Quer saber o que fazer com esse resultado?",
  c: "Quer que eu veja se isso faz sentido para você?",
} as const;
export type Variante = keyof typeof VARIANTES_PERGUNTA;

/** Nome da ferramenta como aparece na mensagem de WhatsApp. */
export const NOME: Record<Ferramenta, string> = {
  proteina: "Calculadora de Proteína",
  macros: "Calculadora de Macros",
  deficit: "Calculadora de Déficit",
  tdee: "Calculadora de Gasto Calórico",
  volume: "Calculadora de Volume",
  onerm: "Calculadora de 1RM",
  fc: "Calculadora de Zonas de Frequência Cardíaca",
  polichinelos: "Calculadora de Polichinelos",
  caminhada: "Calculadora de Calorias da Caminhada",
  eliptico: "Calculadora de Calorias do Elíptico",
  atividades: "Calculadora de Calorias por Atividade",
  corrida: "Calculadora de Corrida",
  glp1: "Calculadora de Massa Magra no GLP-1",
  meta: "Calculadora de Meta de Peso",
  potencial: "Calculadora de Potencial Natural",
  composicao: "Calculadora de Composição Corporal",
  futebol: "Calculadora de Calorias no Futebol",
  boxe: "Calculadora de Calorias no Boxe",
  zumba: "Calculadora de Calorias na Zumba",
  spinning: "Calculadora de Calorias no Spinning",
  danca: "Calculadora de Calorias na Dança",
  natacao: "Calculadora de Calorias na Natação",
  jiujitsu: "Calculadora de Calorias no Jiu-Jitsu",
  corda: "Calculadora de Calorias Pulando Corda",
  bicicleta: "Calculadora de Calorias na Bicicleta",
  escada: "Calculadora de Calorias Subindo Escada",
  crossfit: "Calculadora de Calorias no CrossFit",
  hyrox: "Calculadora de Calorias no Hyrox",
  diagnostico: "Diagnóstico de Treino",
  rotina: "Treino para Minha Rotina",
  academia: "Comparador de Academias",
  cardapio: "Monte seu Cardápio",
  alimentos: "Tabela de Alimentos",
};

/**
 * A mensagem que abre no WhatsApp.
 *
 * Curta, para a pessoa conseguir reler antes de enviar. Leva o nome da
 * ferramenta e o RESUMO do resultado — que a ferramenta monta e que nunca
 * inclui peso, altura, idade ou condição de saúde. "160 g de proteína por
 * dia" é resultado; "80 kg" é dado do corpo e fica de fora.
 */
function mensagem(f: Ferramenta, resumo: string | null, pedido: string): string {
  const res = resumo ? ` e meu resultado foi ${resumo}` : "";
  return `Olá, Montinho! Usei a ${NOME[f]} no seu site${res}. ${pedido}`;
}

const z = (f: Ferramenta, resumo: string | null, pedido: string) =>
  getWhatsAppUrl(mensagem(f, resumo, pedido));

/** As rotas das ferramentas, num lugar só. */
export const ROTA: Record<Ferramenta, string> = {
  proteina: "/ferramentas/calculadora-de-proteina",
  macros: "/ferramentas/calculadora-macros",
  deficit: "/ferramentas/calculadora-deficit-calorico",
  tdee: "/ferramentas/calculadora-tmb-tdee",
  volume: "/ferramentas/calculadora-volume-treino",
  onerm: "/ferramentas/calculadora-1rm",
  fc: "/ferramentas/zonas-de-frequencia-cardiaca",
  polichinelos: "/ferramentas/calculadora-polichinelos",
  caminhada: "/ferramentas/calculadora-calorias-caminhada",
  eliptico: "/ferramentas/calculadora-calorias-eliptico",
  atividades: "/ferramentas/calculadora-calorias-atividades",
  corrida: "/ferramentas/calculadora-corrida",
  glp1: "/ferramentas/massa-magra-glp1",
  meta: "/ferramentas/meta-de-peso",
  potencial: "/ferramentas/potencial-natural",
  composicao: "/ferramentas/composicao-corporal",
  futebol: "/ferramentas/calculadora-calorias-futebol",
  boxe: "/ferramentas/calculadora-calorias-boxe",
  zumba: "/ferramentas/calculadora-calorias-zumba",
  spinning: "/ferramentas/calculadora-calorias-spinning",
  danca: "/ferramentas/calculadora-calorias-danca",
  natacao: "/ferramentas/calculadora-calorias-natacao",
  jiujitsu: "/ferramentas/calculadora-calorias-jiu-jitsu",
  corda: "/ferramentas/calculadora-calorias-pular-corda",
  bicicleta: "/ferramentas/calculadora-calorias-bicicleta",
  escada: "/ferramentas/calculadora-calorias-escada",
  crossfit: "/ferramentas/calculadora-calorias-crossfit",
  hyrox: "/ferramentas/calculadora-calorias-hyrox",
  diagnostico: "/diagnostico",
  rotina: "/treino-para-minha-rotina",
  academia: "/academia-ideal-alphaville",
  cardapio: "/ferramentas/monte-seu-cardapio",
  alimentos: "/alimentos",
};

/**
 * A JORNADA: para onde cada ferramenta leva quando o degrau é "próxima".
 *
 *   proteína → macros → cardápio           (a alimentação, de trás para frente)
 *   gasto → déficit → macros               (a conta, do gasto à distribuição)
 *   1RM → volume → diagnóstico             (a carga, do exercício ao treino)
 *   academia → rotina                      (o lugar, depois a semana)
 *   FC → gasto                             (a zona diz o esforço; o gasto diz o que ele custa)
 */
export const PROXIMA: Record<Ferramenta, { ferramenta: Ferramenta; label: string } | null> = {
  proteina: { ferramenta: "macros", label: "Calcular meus macros" },
  macros: { ferramenta: "cardapio", label: "Transformar em cardápio" },
  deficit: { ferramenta: "macros", label: "Distribuir em macros" },
  tdee: { ferramenta: "deficit", label: "Calcular meu déficit" },
  onerm: { ferramenta: "volume", label: "Conferir meu volume" },
  fc: { ferramenta: "tdee", label: "Calcular meu gasto diário" },
  /* O polichinelo responde o gasto de um exercício; a conta que decide
     emagrecimento é a do dia inteiro. */
  polichinelos: { ferramenta: "tdee", label: "Calcular meu gasto do dia" },
  /* Mesma lógica: a caminhada é o gasto de uma atividade; a conta que
     decide emagrecimento é a do dia inteiro. */
  caminhada: { ferramenta: "tdee", label: "Calcular meu gasto do dia" },
  eliptico: { ferramenta: "tdee", label: "Calcular meu gasto do dia" },
  atividades: { ferramenta: "tdee", label: "Calcular meu gasto do dia" },
  /* Quem corre e quer emagrecer esbarra no gasto do dia antes de esbarrar no pace. */
  corrida: { ferramenta: "tdee", label: "Calcular meu gasto do dia" },
  /* A meta de proteína é o próximo passo concreto de quem viu a faixa. */
  glp1: { ferramenta: "proteina", label: "Calcular minha meta de proteína" },
  /* Sabendo quanto cabe no prazo, a pergunta seguinte é quanto cortar por dia. */
  meta: { ferramenta: "deficit", label: "Calcular meu déficit" },
  /* Sabendo quanto cabe, a pergunta seguinte é se o treino comporta o ganho. */
  potencial: { ferramenta: "volume", label: "Conferir meu volume de treino" },
  /* A massa magra que a conta protege é a que a proteína sustenta. */
  composicao: { ferramenta: "proteina", label: "Calcular minha meta de proteína" },
  /* Quem joga para emagrecer precisa saber o gasto do dia, não só o do jogo. */
  futebol: { ferramenta: "tdee", label: "Calcular meu gasto do dia" },
  /* Quem treina boxe para emagrecer precisa saber o gasto do dia, não só o da aula. */
  boxe: { ferramenta: "tdee", label: "Calcular meu gasto do dia" },
  /* Quem viu que as aulas rendem pouco em quilos precisa do déficit, que é onde está o resto. */
  zumba: { ferramenta: "deficit", label: "Calcular meu déficit" },
  /* Quem viu o gasto de uma aula precisa do gasto do dia para saber o déficit. */
  spinning: { ferramenta: "tdee", label: "Calcular meu gasto do dia" },
  /* Quem viu que dançar rende pouco em quilos precisa do déficit, que é onde está o resto. */
  danca: { ferramenta: "deficit", label: "Calcular meu déficit" },
  /* A fome depois da piscina é o que trava; o déficit da semana é a conta que resolve. */
  natacao: { ferramenta: "deficit", label: "Calcular meu déficit" },
  /* Quem viu o gasto da aula precisa do gasto do dia para saber o déficit. */
  jiujitsu: { ferramenta: "tdee", label: "Calcular meu gasto do dia" },
  /* A corda gasta pouco em minutos; o déficit da semana é o que decide. */
  corda: { ferramenta: "deficit", label: "Calcular meu déficit" },
  /* Quem viu o gasto do pedal precisa do gasto do dia para saber o déficit. */
  bicicleta: { ferramenta: "tdee", label: "Calcular meu gasto do dia" },
  /* A escada é gasto do dia a dia: o próximo passo é ver o gasto do dia inteiro. */
  escada: { ferramenta: "tdee", label: "Calcular meu gasto do dia" },
  /* A fome depois do WOD é o que trava; o déficit da semana é a conta que resolve. */
  crossfit: { ferramenta: "deficit", label: "Calcular meu déficit" },
  /* Quem acabou de ver que a corrida é mais da metade da prova quer o pace. */
  hyrox: { ferramenta: "corrida", label: "Calcular meu pace" },
  volume: { ferramenta: "diagnostico", label: "Fazer o diagnóstico" },
  academia: { ferramenta: "rotina", label: "Montar meu treino" },
  diagnostico: { ferramenta: "rotina", label: "Montar minha rotina" },
  rotina: null,
  cardapio: null,
  alimentos: { ferramenta: "proteina", label: "Calcular minha meta de proteína" },
};

/**
 * Interpretação e pedido por ferramenta e por CATEGORIA de resultado.
 *
 * A categoria é decidida pela própria ferramenta (ela conhece as faixas);
 * aqui só existe o texto para cada uma. `padrao` cobre o que não tem
 * categoria — nunca deixa a pessoa sem frase.
 */
interface Texto {
  interpretacao: string;
  /** Pergunta específica do resultado, usada no lugar da variante quando existe. */
  pergunta?: string;
  /** O que a pessoa pede na mensagem de WhatsApp. */
  pedido: string;
}

const TEXTOS: Record<Ferramenta, Record<string, Texto>> = {
  proteina: {
    padrao: {
      interpretacao:
        "Esse número é o ponto de partida. O que decide o resultado é conseguir encaixar essa meta na rotina, no treino e nas calorias do dia.",
      pedido: "Quero entender como encaixar isso na minha rotina e no meu treino.",
    },
    alta: {
      interpretacao:
        "Você está na faixa alta. Ela faz sentido em déficit ou com bastante treino, mas em dia comum pode ser mais proteína do que dá para comer com prazer.",
      pergunta: "Quer que eu veja se essa faixa é a certa para você?",
      pedido: "Fiquei na faixa alta e queria saber se ela faz sentido para o meu caso.",
    },
    baixa: {
      interpretacao:
        "Você está na faixa mínima. Ela protege músculo em quem treina; quem quer ganhar massa costuma precisar de um pouco mais.",
      pergunta: "Quer saber se vale subir essa meta?",
      pedido: "Fiquei na faixa mínima e queria saber se vale subir para o meu objetivo.",
    },
  },
  macros: {
    padrao: {
      interpretacao:
        "Seus macros estão estimados. Agora a pergunta é outra: dá para sustentar isso na sua semana real — com trabalho, fome e treino?",
      pedido: "Queria ajuda para saber se essa estratégia é viável na minha rotina.",
    },
    fora_amdr: {
      interpretacao:
        "A distribuição saiu da faixa de referência para algum macro. Não é erro — é sinal de que a proteína ou a gordura que você escolheu pesam muito na meta.",
      pergunta: "Quer que eu veja se essa distribuição faz sentido?",
      pedido: "A distribuição saiu da faixa de referência e queria entender se faz sentido para mim.",
    },
    impossivel: {
      interpretacao:
        "Proteína e gordura somadas já passam da meta calórica. A conta não fecha — e isso costuma indicar que a meta está baixa demais, não que os macros estão errados.",
      pergunta: "Quer que eu te ajude a rever essa meta?",
      pedido: "A conta dos macros não fechou com a minha meta e queria ajuda para rever.",
    },
  },
  polichinelos: {
    padrao: {
      interpretacao:
        "Esse é o gasto de um exercício, não o do seu dia. O que decide emagrecimento é o balanço da semana inteira — e é por isso que o mesmo número rende em uma pessoa e não rende em outra.",
      pedido: "Queria entender quanto de cardio eu realmente preciso para o meu objetivo.",
    },
    volume_alto: {
      interpretacao:
        "Para chegar nesse gasto só com polichinelo seria muito tempo de impacto numa sessão só. Distribuir entre caminhada, musculação e o que você já faz no dia costuma render mais e cobrar menos das articulações.",
      pergunta: "Quer que eu monte uma distribuição que caiba na sua semana?",
      pedido: "O número que saiu foi alto e queria ajuda para distribuir isso na semana sem me machucar.",
    },
  },
  caminhada: {
    padrao: {
      interpretacao:
        "Esse é o gasto de uma caminhada, não o do seu dia. O que decide emagrecimento é o balanço da semana inteira — e a caminhada rende mais quando entra numa estratégia do que quando é a estratégia.",
      pedido: "Queria entender quanto de caminhada eu realmente preciso para o meu objetivo.",
    },
    volume_alto: {
      interpretacao:
        "Para chegar nesse gasto só caminhando seria muito tempo por dia. Distribuir entre caminhada, musculação e o movimento do dia costuma render mais e sobreviver mais semanas.",
      pergunta: "Quer que eu monte uma distribuição que caiba na sua semana?",
      pedido: "O tempo que saiu foi alto e queria ajuda para distribuir isso na semana.",
    },
  },
  eliptico: {
    padrao: {
      interpretacao:
        "Esse é o gasto de uma sessão, não o do seu dia. O elíptico rende quando entra numa semana com musculação e alimentação ajustada — sozinho, é o caminho mais lento.",
      pedido: "Queria entender quanto de cardio eu realmente preciso para o meu objetivo.",
    },
    volume_alto: {
      interpretacao:
        "Para chegar nesse gasto só no elíptico seria muito tempo por dia. Distribuir entre cardio, musculação e o movimento do dia costuma render mais e durar mais semanas.",
      pergunta: "Quer que eu monte uma distribuição que caiba na sua semana?",
      pedido: "O tempo que saiu foi alto e queria ajuda para distribuir isso na semana.",
    },
  },
  atividades: {
    padrao: {
      interpretacao:
        "Esse é o gasto de uma sessão, não o do seu dia — e é menor do que as tabelas de revista dizem, porque elas costumam supor uma hora inteira no esforço máximo. O que decide emagrecimento é o balanço da semana.",
      pedido: "Queria entender quanto essa atividade pesa no meu objetivo e o que falta no meu treino.",
    },
    volume_alto: {
      interpretacao:
        "Para chegar nesse gasto numa sessão só seria muito tempo. Distribuir entre a atividade que você gosta, a musculação e o movimento do dia costuma render mais.",
      pergunta: "Quer que eu monte uma distribuição que caiba na sua semana?",
      pedido: "O tempo que saiu foi alto e queria ajuda para distribuir isso na semana.",
    },
  },
  corrida: {
    padrao: {
      interpretacao:
        "Esse é o gasto de uma corrida, não o do seu dia. E repare no número por quilômetro: ele quase não muda com o pace — correr mais rápido gasta mais por minuto, não por quilômetro.",
      pedido: "Queria entender como encaixar a corrida na minha semana sem perder músculo.",
    },
  },
  glp1: {
    padrao: {
      interpretacao:
        "Essa faixa é de população, não medição do seu corpo. O que ela mostra de útil é o tamanho da diferença entre proteger e não proteger a massa magra.",
      pedido: "Estou emagrecendo com medicação e queria ajuda para não perder músculo no caminho.",
    },
    nenhuma: {
      interpretacao:
        "Sem treino de força e sem proteína suficiente, você está na faixa mais alta de perda de massa magra que a literatura descreve — e é também a situação em que mais dá para melhorar.",
      pergunta: "Quer que eu monte o treino de força que protege essa massa?",
      pedido: "Estou emagrecendo com medicação, sem treino de força, e queria proteger minha massa muscular.",
    },
    parcial: {
      interpretacao:
        "Você já tem metade da proteção no lugar. A outra metade é o que separa a sua faixa atual da mais baixa possível.",
      pergunta: "Quer que eu te ajude a fechar a outra metade?",
      pedido: "Estou emagrecendo com medicação e queria ajuda para completar a proteção da massa muscular.",
    },
    completa: {
      interpretacao:
        "Você está no melhor cenário desta conta. Daqui para frente o que decide é manter a carga da musculação subindo enquanto o peso desce.",
      pergunta: "Quer que eu revise se o seu treino está progredindo do jeito certo?",
      pedido: "Estou emagrecendo com medicação, já treino e como proteína, e queria revisar se meu treino está progredindo certo.",
    },
  },
  meta: {
    padrao: {
      interpretacao:
        "Essa faixa é o que cabe no prazo sem pagar em músculo. O que decide se ela vira resultado não é o número — é quantas das semanas você cumpre.",
      pedido: "Tenho uma data e queria ajuda para montar o plano que cabe nela.",
    },
    cabe: {
      interpretacao:
        "A sua meta cabe no prazo com folga. O risco aqui não é ser ambicioso demais — é achar que, por caber, ela acontece sozinha.",
      pergunta: "Quer que eu monte o plano das semanas que faltam?",
      pedido: "Minha meta cabe no prazo e queria ajuda para montar o plano das semanas que faltam.",
    },
    apertado: {
      interpretacao:
        "A sua meta fica um pouco acima da faixa segura. Dá para chegar perto, mas é exatamente o tipo de plano que precisa ser bem montado para não cobrar em músculo.",
      pergunta: "Quer que eu veja como chegar mais perto sem forçar?",
      pedido: "Minha meta ficou apertada para o prazo e queria ajuda para chegar perto sem perder músculo.",
    },
    "nao-cabe": {
      interpretacao:
        "A sua meta não cabe nesse prazo, e saber disso agora vale mais que descobrir em dezembro. O que cabe já é bastante — e é o que costuma se sustentar depois.",
      pergunta: "Quer que eu te ajude a montar a meta que cabe?",
      pedido: "Minha meta não cabe no prazo e queria ajuda para montar uma que caiba.",
    },
  },
  potencial: {
    padrao: {
      interpretacao:
        "O número é uma referência de população, não um teto seu. O que ele diz de útil é o ritmo que dá para esperar daqui para frente.",
      pedido: "Queria entender o que muda no meu treino a partir de onde eu estou.",
    },
    inicio: {
      interpretacao:
        "Você tem bastante margem pela frente — e nessa fase o que separa quem cresce de quem não cresce não é genética, é ter um treino que progride e comida suficiente.",
      pergunta: "Quer que eu monte o treino desse começo?",
      pedido: "Estou no começo, tenho bastante margem para ganhar massa e queria ajuda para montar o treino.",
    },
    caminho: {
      interpretacao:
        "Você está no meio do caminho, que é onde treino bem feito ainda rende resultado visível — e onde treino mal montado começa a cobrar em platô.",
      pergunta: "Quer que eu revise se o seu treino está progredindo certo?",
      pedido: "Estou no meio do caminho do meu potencial e queria revisar se o treino está progredindo certo.",
    },
    perto: {
      interpretacao:
        "Você está perto da faixa de referência. Daqui para frente o ganho é lento por construção, e o que decide passa a ser a qualidade da execução e a paciência com ciclos longos.",
      pergunta: "Quer que eu veja o que ainda dá para extrair do seu treino?",
      pedido: "Estou perto da faixa de referência e queria saber o que ainda dá para extrair do meu treino.",
    },
    "na-referencia": {
      interpretacao:
        "Você está na faixa de referência ou acima dela. A pergunta deixa de ser quanto ganhar e passa a ser o que fazer com o que já está construído — força, execução e manutenção.",
      pergunta: "Quer que eu te ajude a montar a próxima fase?",
      pedido: "Cheguei na faixa de referência de massa magra e queria ajuda para montar a próxima fase do treino.",
    },
  },
  hyrox: {
    padrao: {
      interpretacao:
        "Esse é o gasto de uma prova, não o da sua semana. O que decide o próximo tempo é a preparação: base de corrida, força para as estações e treinos de corrida cansada.",
      pedido: "Quero me preparar para o Hyrox e entender como organizar corrida e força na semana.",
    },
  },
  crossfit: {
    padrao: {
      interpretacao:
        "Esse é o gasto da aula, não o do seu dia. O CrossFit gasta bem no WOD, mas o WOD é curto — o que move o resultado é a frequência, a alimentação depois do treino e a força que protege ombro e lombar.",
      pedido: "Faço CrossFit e queria entender o que falta para ele me ajudar a emagrecer.",
    },
  },
  escada: {
    padrao: {
      interpretacao:
        "Esse é o gasto da escada, não o do seu dia. Ela soma pelo hábito, andar por andar — o que move o resultado é a alimentação, a constância e a força nas pernas que deixa cada andar mais leve.",
      pedido: "Quero usar mais a escada no dia a dia e entender o que falta para emagrecer.",
    },
  },
  corda: {
    padrao: {
      interpretacao:
        "Esse é o gasto do treino, não o do seu dia. A corda gasta muito por minuto, mas os minutos são poucos — o que move o resultado é a alimentação, a frequência e a força que protege tornozelo e joelho do impacto.",
      pedido: "Pulo corda e queria entender o que falta para ela me ajudar a emagrecer.",
    },
  },
  bicicleta: {
    padrao: {
      interpretacao:
        "Esse é o gasto do pedal, não o do seu dia. A bicicleta gasta bem e é baixo impacto, mas o semáforo e o passeio lento derrubam a média — o que move o resultado é a frequência, a alimentação e a força que segura o joelho e o músculo enquanto o peso cai.",
      pedido: "Pedalo e queria entender o que falta para a bike me ajudar a emagrecer.",
    },
  },
  jiujitsu: {
    padrao: {
      interpretacao:
        "Esse é o gasto da aula, não o do seu dia. O jiu-jitsu gasta bem no rola, mas o rola é curto — o que move o resultado é a frequência de aulas, a alimentação e a força que protege as articulações no tatame.",
      pedido: "Treino jiu-jitsu e queria entender o que falta para ele me ajudar a emagrecer.",
    },
  },
  natacao: {
    padrao: {
      interpretacao:
        "Esse é o gasto do treino, não o do seu dia. A natação gasta bem, mas a fome depois da piscina é famosa — e sem treino de força junto, ela não protege osso nem músculo como a musculação.",
      pedido: "Nado e queria entender o que falta para a natação me ajudar a emagrecer.",
    },
  },
  danca: {
    padrao: {
      interpretacao:
        "Esse é o gasto da dança, não o do seu dia. Qualquer ritmo ajuda, e o que você repete toda semana ajuda mais que o que gasta mais — mas quem emagrece dançando quase sempre ajustou a alimentação junto.",
      pedido: "Danço e queria entender o que falta para a dança me ajudar a emagrecer.",
    },
  },
  spinning: {
    padrao: {
      interpretacao:
        "Esse é o gasto da aula, não o do seu dia. O spinning rende quando entra numa semana com musculação e alimentação ajustada — e o número do visor serve para comparar uma aula com a outra, não para decidir quanto comer.",
      pedido: "Faço spinning e queria entender o que falta para ele me ajudar a emagrecer.",
    },
  },
  zumba: {
    padrao: {
      interpretacao:
        "Esses quilos vêm só das aulas — e são poucos, porque a maior parte do resultado de quem emagrece dançando vem da alimentação. A zumba rende quando a semana tem déficit e treino de força junto.",
      pedido: "Faço zumba e queria entender o que falta para ela me ajudar a emagrecer.",
    },
  },
  boxe: {
    padrao: {
      interpretacao:
        "Esse é o gasto do treino, não o do seu dia — e é bem menor que as 1.000 kcal da propaganda. O boxe rende quando entra numa semana com musculação e alimentação ajustada; sozinho, deixa você mais condicionado com o mesmo peso.",
      pedido: "Treino boxe e queria entender o que falta para ele me ajudar a emagrecer.",
    },
  },
  futebol: {
    padrao: {
      interpretacao:
        "Esse é o gasto do jogo, não o do seu dia. Futebol rende muito quando entra numa semana com força de perna e a resenha contada — sozinho, uma vez por semana, raramente move a balança.",
      pedido: "Jogo bola e queria entender o que falta para o futebol me ajudar a emagrecer.",
    },
  },
  composicao: {
    padrao: {
      interpretacao:
        "Os números vieram de uma estimativa, não de uma medição — e o que eles mostram de mais útil é a diferença entre emagrecer com e sem treino de força.",
      pedido: "Fiz uma bioimpedância e queria ajuda para entender o que fazer com esses números.",
    },
    essencial: {
      interpretacao:
        "Você está abaixo da faixa essencial de gordura. É território de atleta em competição, e não é um lugar para se manter — gordura essencial tem função hormonal e estrutural.",
      pergunta: "Quer que eu te ajude a montar uma fase de recuperação?",
      pedido: "Estou com percentual de gordura muito baixo e queria ajuda para montar uma fase de recuperação.",
    },
    atleta: {
      interpretacao:
        "Você está na faixa atlética. Manter isso o ano inteiro cobra controle alimentar contínuo, e a pergunta que costuma valer mais é se vale a pena manter ou se é hora de construir.",
      pergunta: "Quer que eu te ajude a decidir o próximo ciclo?",
      pedido: "Estou na faixa atlética de gordura e queria ajuda para decidir o próximo ciclo do meu treino.",
    },
    bom: {
      interpretacao:
        "Você está numa faixa saudável e sustentável. Daqui, a decisão é de objetivo: manter, definir mais ou usar o momento para ganhar massa.",
      pergunta: "Quer que eu te ajude a escolher o próximo passo?",
      pedido: "Estou numa faixa boa de gordura e queria ajuda para escolher o próximo passo.",
    },
    aceitavel: {
      interpretacao:
        "Você está dentro do que a literatura considera saudável, com espaço para melhorar se esse for o seu objetivo — e o caminho que preserva músculo é bem diferente do que só corta comida.",
      pergunta: "Quer que eu monte o plano que preserva a sua massa magra?",
      pedido: "Quero reduzir meu percentual de gordura sem perder massa magra e queria ajuda com o plano.",
    },
    alto: {
      interpretacao:
        "Reduzir gordura a partir daqui traz ganho de saúde, não só de estética. E é justamente aqui que emagrecer sem treino de força cobra mais caro em músculo.",
      pergunta: "Quer que eu monte o plano que protege a sua massa magra?",
      pedido: "Quero reduzir meu percentual de gordura e queria ajuda para fazer isso sem perder músculo.",
    },
  },
  deficit: {
    padrao: {
      interpretacao:
        "Esse déficit é uma estimativa. Ele só funciona se convive com treino, fome, sono e rotina — e é aí que a maioria dos planos quebra.",
      pedido: "Queria entender como aplicar esse déficit sem prejudicar meu treino.",
    },
    leve: {
      interpretacao:
        "Déficit leve é o mais fácil de manter e o que mais preserva músculo. O custo é o tempo: o resultado vem, mas devagar.",
      pergunta: "Quer saber se dá para acelerar sem perder músculo?",
      pedido: "Escolhi o déficit leve e queria saber se dá para acelerar sem perder músculo.",
    },
    moderado: {
      interpretacao:
        "Déficit moderado é a faixa que a maioria consegue sustentar. O que decide é o treino de força junto — sem ele, parte do peso que sai é músculo.",
      pergunta: "Quer que eu te ajude a aplicar isso no treino?",
      pedido: "Escolhi o déficit moderado e queria saber como aplicar isso junto com o treino.",
    },
    maior: {
      interpretacao:
        "Déficit maior traz resultado rápido e cobra caro: fome, queda no treino e mais risco de perder músculo. Costuma pedir proteína alta e acompanhamento de perto.",
      pergunta: "Quer que eu veja se esse déficit é seguro para você?",
      pedido: "Escolhi o déficit maior e queria saber se ele é seguro para o meu caso.",
    },
  },
  tdee: {
    padrao: {
      interpretacao:
        "Esse é o seu gasto estimado. Sozinho ele não emagrece nem ganha músculo — o que faz diferença é o que você decide fazer com ele: déficit, superávit ou manutenção.",
      pedido: "Queria entender o que fazer com esse número para o meu objetivo.",
    },
  },
  onerm: {
    padrao: {
      interpretacao:
        "Saber a carga máxima é útil para escolher a carga de treino. Saber quando subir, quantas séries fazer e como progredir é o que transforma o número em resultado.",
      pedido: "Queria entender como usar esse número para organizar a progressão.",
    },
  },
  fc: {
    padrao: {
      interpretacao:
        "As zonas dizem em que esforço treinar. O que decide o resultado é quanto tempo por semana você passa em cada uma — e a régua da fala confere se o relógio está certo para você.",
      pedido: "Queria entender como distribuir minha semana entre as zonas.",
    },
  },
  volume: {
    padrao: {
      interpretacao:
        "Volume isolado não conta a história toda. Frequência, intensidade, progressão e recuperação decidem se esse volume vira músculo.",
      pedido: "Queria saber se o meu treino está bem distribuído.",
    },
    baixo: {
      interpretacao: "Volume abaixo da faixa costuma significar estímulo de menos para o músculo crescer. Subir é fácil; subir sem exagerar é o que importa.",
      pergunta: "Quer ajuda para aumentar seu volume sem exagerar?",
      pedido: "Meu volume ficou abaixo da faixa e queria ajuda para subir sem exagerar.",
    },
    alto: {
      interpretacao: "Volume acima da faixa não é necessariamente ruim, mas costuma ser onde a recuperação começa a falhar sem a pessoa perceber.",
      pergunta: "Quer que eu veja onde você pode estar exagerando?",
      pedido: "Meu volume ficou acima da faixa e queria saber onde posso estar exagerando.",
    },
    adequado: {
      interpretacao: "Volume na faixa. A próxima pergunta não é quantidade — é se intensidade e progressão também estão certas.",
      pergunta: "Quer saber se intensidade e progressão também estão certas?",
      pedido: "Meu volume está na faixa e queria saber se intensidade e progressão também estão certas.",
    },
  },
  diagnostico: {
    padrao: {
      interpretacao:
        "O diagnóstico aponta os pontos de atenção. Daqui você pode ajustar sozinho ou pedir uma segunda opinião.",
      pergunta: "Quer uma segunda opinião?",
      pedido: "Queria a sua opinião sobre o meu resultado.",
    },
  },
  rotina: {
    padrao: {
      interpretacao:
        "Essa estrutura é um bom ponto de partida. O próximo passo é ajustar exercícios, volume e progressão para você.",
      pergunta: "Quer que eu te ajude a personalizar?",
      pedido: "Queria ajuda para transformar o resultado num treino mais personalizado.",
    },
  },
  academia: {
    padrao: {
      interpretacao:
        "A academia é o lugar. O treino é a estratégia — e é ele que decide se a mensalidade vira resultado.",
      pergunta: "Quer que eu te explique como funciona o acompanhamento na academia?",
      pedido: "Estou escolhendo academia na região e queria entender como funciona o acompanhamento presencial.",
    },
  },
  cardapio: {
    padrao: {
      interpretacao: "O cardápio organiza a alimentação. O treino decide quanto do resultado é músculo.",
      pedido: "Queria entender como fica o treino para acompanhar esse objetivo.",
    },
  },
  alimentos: {
    padrao: {
      interpretacao: "Você já sabe o que o alimento tem. Falta saber quanto dele cabe na sua meta do dia.",
      pergunta: "Quer saber como encaixar esse alimento na sua meta?",
      pedido: "Queria saber como encaixar esse alimento na minha meta.",
    },
  },
};

/**
 * Monta o bloco.
 *
 * @param categoria  faixa do resultado, decidida pela ferramenta ("alta",
 *                   "leve", "fora_amdr"…). Cai em "padrao" se não existir.
 * @param resumo     frase curta do resultado para a mensagem — sem dado do corpo.
 */
export function blocoPosResultado(
  f: Ferramenta,
  categoria: string,
  est: Estagio,
  variante: Variante,
  resumo: string | null,
): Bloco {
  const t = TEXTOS[f][categoria] ?? TEXTOS[f].padrao;
  const proxima = PROXIMA[f];
  const whats = { pergunta: t.pergunta ?? VARIANTES_PERGUNTA[variante], botao: "Conversar com o Montinho", destino: "whatsapp" as const, href: z(f, resumo, t.pedido) };

  if (est === "whatsapp" || !proxima) {
    return {
      interpretacao: t.interpretacao,
      ...whats,
      secundaria: proxima
        ? { label: "Prefere continuar sozinho? " + proxima.label, href: ROTA[proxima.ferramenta], destino: "ferramenta" }
        : undefined,
    };
  }
  if (est === "diagnostico" && f !== "diagnostico") {
    return {
      interpretacao: t.interpretacao,
      pergunta: "Quer saber se isso faz sentido no seu treino?",
      botao: "Fazer o diagnóstico",
      destino: "diagnostico",
      href: ROTA.diagnostico,
      /* Se a próxima já É o diagnóstico (volume), a secundária vira a conversa — nunca a mesma ação duas vezes. */
      secundaria:
        proxima.ferramenta === "diagnostico"
          ? { label: "Prefere conversar? " + whats.botao, href: whats.href, destino: "whatsapp" }
          : { label: proxima.label, href: ROTA[proxima.ferramenta], destino: "ferramenta" },
    };
  }
  return {
    interpretacao: t.interpretacao,
    pergunta: "Quer montar o restante?",
    botao: proxima.label,
    destino: "ferramenta",
    href: ROTA[proxima.ferramenta],
    secundaria: { label: "Prefere conversar? " + whats.botao, href: whats.href, destino: "whatsapp" },
  };
}
