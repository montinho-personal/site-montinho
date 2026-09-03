/**
 * Calculadora de Zonas de Frequência Cardíaca — dados e regras.
 *
 * Tudo que é FATO mora aqui, fora do componente: a fórmula da FC máxima com
 * a fonte, as cinco zonas com o que cada uma serve, os limites do campo e o
 * registro de quais artigos exibem a calculadora. O componente só apresenta.
 *
 * POR QUE TANAKA E NÃO "220 − IDADE"
 *
 * A fórmula 220 − idade nunca foi um estudo: foi uma anotação de 1970 que
 * virou regra por repetição. Tanaka, Monahan e Seals (2001) fizeram uma
 * meta-análise com 351 estudos e mediram 514 pessoas saudáveis; a reta que
 * saiu foi 208 − 0,7 × idade. Nos extremos a diferença importa: aos 60 anos
 * a fórmula antiga dá 160 e a de Tanaka dá 166, e são 6 batimentos que
 * mudam de zona.
 *
 * O QUE A CALCULADORA NÃO SABE
 *
 * A FC máxima real de uma pessoa varia em torno de ±10 bpm da estimada por
 * qualquer fórmula. Quem toma betabloqueador tem FC máxima mais baixa do
 * que qualquer conta prevê. Por isso a página diz "estimada", mostra o
 * desvio, e oferece a régua da fala como conferência — ela não depende de
 * número nenhum.
 */

export const FONTE_TANAKA = {
  rotulo: "Tanaka, Monahan e Seals, Journal of the American College of Cardiology (2001)",
  rotuloCurto: "Tanaka (2001)",
  url: "https://pubmed.ncbi.nlm.nih.gov/11153730/",
  /** O desvio-padrão da FC máxima real em torno da estimada, no estudo. */
  desvioBpm: 10,
};

export const FONTE_KARVONEN = {
  rotulo: "Karvonen, Kentala e Mustala, Annales Medicinae Experimentalis et Biologiae Fenniae (1957)",
  rotuloCurto: "Karvonen (1957)",
  url: "https://pubmed.ncbi.nlm.nih.gov/13470504/",
};

export const FONTE_ZONAS = {
  rotulo: "American College of Sports Medicine, Guidelines for Exercise Testing and Prescription, 11ª edição (2021)",
  rotuloCurto: "ACSM (2021)",
};

/** Limites do campo de idade. Fora deles, pedimos para conferir. */
export const IDADE_MIN = 10;
export const IDADE_MAX = 100;

/** Limites da FC de repouso. Abaixo de 30 ou acima de 120 é erro de digitação ou caso médico. */
export const FC_REPOUSO_MIN = 30;
export const FC_REPOUSO_MAX = 120;

/** Aceita "40", " 40 ", "40,0". Devolve null quando não dá para ler como inteiro. */
export function parseInteiro(texto: string): number | null {
  const limpo = texto.trim().replace(",", ".");
  if (!/^\d+(\.0+)?$/.test(limpo)) return null;
  const n = Number(limpo);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

/** FC máxima estimada por Tanaka: 208 − 0,7 × idade, arredondada para inteiro. */
export function fcMaxima(idade: number): number {
  return Math.round(208 - 0.7 * idade);
}

/** A fórmula antiga, só para a página mostrar a diferença. Não entra na conta. */
export function fcMaximaClassica(idade: number): number {
  return 220 - idade;
}

export interface Zona {
  id: "z1" | "z2" | "z3" | "z4" | "z5";
  numero: 1 | 2 | 3 | 4 | 5;
  nome: string;
  /** Percentual da FC máxima (ou da reserva, no método de Karvonen). */
  de: number;
  ate: number;
  /** A régua da fala: como saber que está na zona sem relógio. */
  fala: string;
  /** Para que serve, em uma frase. */
  serve: string;
  /** Exemplos de atividade que costumam cair aqui. */
  exemplos: string;
  /** A zona 2 ganha leve destaque: é a que mais gente procura e a mais mal explicada. */
  destaque?: boolean;
}

/**
 * As cinco zonas na divisão mais usada por relógios e pelo ACSM. Os cortes
 * são convenção, não lei da natureza: outro esquema com três zonas ou com
 * limiares medidos em laboratório é igualmente válido. O que importa é que
 * o esforço suba de forma consistente de uma para a outra.
 */
export const ZONAS: Zona[] = [
  {
    id: "z1", numero: 1, nome: "Muito leve", de: 50, ate: 60,
    fala: "Conversa com total conforto; quase não percebe que está se exercitando.",
    serve: "Aquecimento, volta à calma e recuperação ativa no dia seguinte a um treino pesado.",
    exemplos: "caminhada tranquila, pedalar sem esforço",
  },
  {
    id: "z2", numero: 2, nome: "Leve", de: 60, ate: 70,
    fala: "Conversa em frases inteiras, respiração um pouco mais funda, dá para manter por uma hora.",
    serve: "Base aeróbica, eficiência em usar gordura como combustível e a maior parte do volume de quem treina resistência.",
    exemplos: "caminhada rápida, corrida bem leve, bike moderada, os trechos lentos da caminhada japonesa",
    destaque: true,
  },
  {
    id: "z3", numero: 3, nome: "Moderada", de: 70, ate: 80,
    fala: "Frases curtas; conversar já incomoda. Dá para manter por 20 a 40 minutos.",
    serve: "Condicionamento geral e ritmo de prova longa. É onde a maioria treina sem querer, por ser confortável demais para ser difícil e difícil demais para ser leve.",
    exemplos: "corrida moderada, os trechos rápidos da caminhada japonesa",
  },
  {
    id: "z4", numero: 4, nome: "Intensa", de: 80, ate: 90,
    fala: "Só palavras soltas. Respiração pesada. Dá para manter alguns minutos por vez.",
    serve: "Limiar: ensina o corpo a sustentar esforço alto por mais tempo. É a zona dos intervalados longos, de 3 a 8 minutos.",
    exemplos: "tiros de 4 minutos, subida forte de bike",
  },
  {
    id: "z5", numero: 5, nome: "Máxima", de: 90, ate: 100,
    fala: "Não dá para falar. Dura de 30 segundos a 2 minutos.",
    serve: "Potência aeróbica máxima e VO2 máx. Pouco volume, muito descanso entre repetições.",
    exemplos: "tiros curtos, HIIT de verdade, o fim de uma prova",
  },
];

export interface FaixaBpm {
  zona: Zona;
  de: number;
  ate: number;
}

/**
 * Zonas em batimentos.
 *
 * Sem FC de repouso: percentual direto da FC máxima, que é o que relógios
 * simples fazem. Com FC de repouso: método de Karvonen, que aplica o
 * percentual sobre a RESERVA (máxima − repouso) e soma o repouso de volta.
 * Karvonen dá zonas mais altas para quem tem repouso alto e mais baixas
 * para quem tem repouso baixo — e por isso é mais fiel ao esforço real,
 * quando a pessoa sabe o próprio repouso.
 */
export function zonasEmBpm(fcMax: number, fcRepouso: number | null): FaixaBpm[] {
  return ZONAS.map((z) => {
    if (fcRepouso === null) {
      return { zona: z, de: Math.round((fcMax * z.de) / 100), ate: Math.round((fcMax * z.ate) / 100) };
    }
    const reserva = fcMax - fcRepouso;
    return {
      zona: z,
      de: Math.round(fcRepouso + (reserva * z.de) / 100),
      ate: Math.round(fcRepouso + (reserva * z.ate) / 100),
    };
  });
}

export const NOTA_ESTIMATIVA =
  "A FC máxima real varia cerca de 10 batimentos para cima ou para baixo da estimada por qualquer fórmula. Trate as zonas como referência e confira com a régua da fala: ela não depende de conta nenhuma.";

export const NOTA_BETABLOQUEADOR =
  "Quem toma betabloqueador ou outro remédio que reduz a frequência cardíaca tem FC máxima mais baixa do que qualquer fórmula prevê. Nesse caso, use a régua da fala e a percepção de esforço, e combine as zonas com o médico.";

export const NOTA_REPOUSO =
  "A FC de repouso é medida ao acordar, antes de levantar, contando os batimentos por um minuto ou lendo no relógio. Medir depois do café ou depois de subir uma escada dá um número alto demais.";

export const DISCLAIMER =
  "As zonas são referências educacionais calculadas a partir da idade e não substituem teste de esforço nem avaliação médica. Quem tem doença cardíaca, pressão descontrolada ou sintomas ao se exercitar deve liberar a intensidade com o médico antes de usar qualquer zona.";

// ─── Onde a calculadora aparece ──────────────────────────────────────────────

/**
 * Artigos que exibem a calculadora cedo no corpo.
 *
 * Mesmo critério das outras: entra onde o leitor chegou com a pergunta que
 * a ferramenta responde — "em que batimento eu fico?" — e não onde a
 * palavra "frequência" aparece. Zona 2 e esteira inclinada mandam a pessoa
 * treinar numa faixa de FC sem dizer como achá-la; este é o encaixe.
 */
export const ARTIGOS_COM_CALCULADORA_FC: string[] = [
  "zonas-de-frequencia-cardiaca",
  "treino-zona-2",
  "caminhada-na-esteira-inclinada",
];

/**
 * Artigos de cardio em que a dúvida é OUTRA (emagrece? antes ou depois?),
 * mas onde quem termina de ler vai treinar e precisa de uma faixa. Recebem
 * só um link contextual no fim.
 *
 * A caminhada japonesa fica fora dos dois registros de propósito: ela já
 * embute a calculadora de gasto, e a regra da casa é uma ferramenta por
 * artigo. O link para cá está no texto dela.
 */
export const ARTIGOS_COM_LINK_FC: string[] = [
  "vo2-maximo-longevidade",
  "cardio-antes-ou-depois-da-musculacao",
  "musculacao-ou-corrida-para-emagrecer",
  "caminhada-emagrece",
  "corrida-de-rua-iniciante",
  "eliptico-emagrece",
];
