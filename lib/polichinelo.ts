/**
 * O motor da Calculadora de Polichinelos.
 *
 * POR QUE ESTA FERRAMENTA EXISTE
 *
 * O Search Console mostra um padrão que os dois artigos de polichinelo do
 * site não atendem. "polichinelo emagrece" traz 7.319 impressões em 90
 * dias, mas ao lado dela existe um enxame de buscas que pedem NÚMERO, não
 * opinião: "quantos polichinelos por dia para perder barriga", "100
 * polichinelos por dia emagrece", "quantos polichinelos para emagrecer 1
 * kg", "quantos polichinelos equivalem a 30 minutos de caminhada". Somadas,
 * passam de 250 impressões só nas variantes que o Google nomeia.
 *
 * Artigo responde "depende". Quem digita essas frases quer uma conta com o
 * próprio peso dentro. É outra intenção, e por isso outra página.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 * Nada aqui é chute. O gasto sai da equação de METs que a ACSM usa:
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * O 3,5 é o consumo de oxigênio de repouso em mL/kg/min (1 MET) e o 200
 * converte oxigênio em quilocalorias. É a fórmula padrão, não uma
 * adaptação.
 *
 * O MET do polichinelo tem uma sutileza que precisa ficar escrita: o
 * Compêndio de Atividades Físicas NÃO tem uma linha só para polichinelo.
 * Ele aparece como EXEMPLO dentro das entradas de calistenia — o que é
 * bom, porque quem mediu mediu gente fazendo exatamente esse tipo de
 * movimento, e é honesto, porque o valor não foi inventado para caber
 * aqui. As duas âncoras usadas são as do Compêndio; a faixa do meio é
 * interpolada entre elas e está marcada como tal.
 *
 * O QUE A FERRAMENTA NUNCA FAZ
 *
 * Prometer quilo perdido. A conta de "1 kg de gordura = 7.700 kcal" existe
 * na página porque a busca existe, mas ela entra como SIMULAÇÃO TEÓRICA,
 * com o aviso de que o corpo não responde assim — e a própria literatura
 * que originou o número já foi corrigida (ver FONTE_HALL).
 */

/* ───────────────────────── Fontes ───────────────────────── */

export interface Fonte {
  rotulo: string;
  rotuloCurto: string;
  url: string;
  resumo: string;
}

/**
 * A âncora do gasto. A descrição da entrada 02020 cita polichinelo pelo
 * nome, junto de flexão, abdominal e burpee — é a linha do Compêndio que
 * descreve o que a pessoa está fazendo quando abre e fecha os braços com
 * pressa.
 */
export const FONTE_COMPENDIO: Fonte = {
  rotulo:
    "Herrmann SD, Willis EA, Ainsworth BE, et al. 2024 Adult Compendium of Physical Activities. Journal of Sport and Health Science, 2024",
  rotuloCurto: "Compêndio de Atividades Físicas (2024)",
  url: "https://pacompendium.com/conditioning-exercise/",
  resumo:
    "lista a calistenia de esforço vigoroso — com polichinelo entre os exemplos — em 7,5 METs, e a calistenia de esforço leve a moderado em 3,5 METs.",
};

export const FONTE_ACSM: Fonte = {
  rotulo:
    "American College of Sports Medicine. ACSM's Guidelines for Exercise Testing and Prescription — equação metabólica de gasto energético",
  rotuloCurto: "equação de METs da ACSM",
  url: "https://pacompendium.com/",
  resumo:
    "define o gasto por minuto como MET × 3,5 × peso em kg ÷ 200, onde 3,5 mL/kg/min é o consumo de oxigênio em repouso.",
};

export const FONTE_WISHNOFSKY: Fonte = {
  rotulo:
    "Wishnofsky M. Caloric equivalents of gained or lost weight. The American Journal of Clinical Nutrition, 1958",
  rotuloCurto: "Wishnofsky (1958)",
  url: "https://pubmed.ncbi.nlm.nih.gov/13594881/",
  resumo:
    "é a origem do número de 7.700 kcal por quilo de gordura, obtido a partir da composição do tecido adiposo.",
};

/**
 * A correção. Sem ela a simulação de "quantos polichinelos para 1 kg"
 * viraria promessa — e é exatamente essa conta linear que a literatura
 * mais recente desmonta.
 */
export const FONTE_HALL: Fonte = {
  rotulo:
    "Hall KD, Sacks G, Chandramohan D, et al. Quantification of the effect of energy imbalance on bodyweight. The Lancet, 2011",
  rotuloCurto: "Hall et al. (2011)",
  url: "https://pubmed.ncbi.nlm.nih.gov/21872751/",
  resumo:
    "mostra que a regra linear das 7.700 kcal superestima a perda de peso: conforme o corpo emagrece, o gasto diário cai e o ritmo desacelera.",
};

export const FONTES: Fonte[] = [FONTE_COMPENDIO, FONTE_ACSM, FONTE_WISHNOFSKY, FONTE_HALL];

/* ───────────────────────── Intensidade ───────────────────────── */

export type IntensidadeId = "leve" | "moderado" | "intenso";

export interface Intensidade {
  id: IntensidadeId;
  nome: string;
  /** MET usado na conta. */
  met: number;
  /** Cadência típica, em polichinelos por minuto. */
  cadencia: number;
  /** Como a pessoa reconhece que está nessa faixa, sem relógio. */
  comoReconhecer: string;
  /** De onde saiu o MET. Aparece na metodologia, não pode sumir. */
  origem: string;
}

/**
 * As três faixas.
 *
 * Leve e intensa são valores do Compêndio, copiados, não ajustados.
 * Moderada é interpolação declarada entre as duas: o Compêndio não tem uma
 * terceira linha de calistenia entre 3,5 e 7,5, e fingir que tem seria
 * inventar precisão. A cadência de cada faixa é o que traduz o MET em algo
 * que a pessoa consegue reconhecer — e é ela que converte quantidade em
 * tempo.
 */
export const INTENSIDADES: Intensidade[] = [
  {
    id: "leve",
    nome: "Leve",
    met: 3.5,
    cadencia: 30,
    comoReconhecer: "Dá para conversar frases inteiras. Ritmo de aquecimento.",
    origem: "calistenia de esforço leve a moderado, 3,5 METs no Compêndio",
  },
  {
    id: "moderado",
    nome: "Moderado",
    met: 5.5,
    cadencia: 45,
    comoReconhecer: "Dá para falar frases curtas, mas não conversar. É o ritmo mais comum.",
    origem: "interpolado entre as duas entradas do Compêndio (3,5 e 7,5 METs)",
  },
  {
    id: "intenso",
    nome: "Intenso",
    met: 7.5,
    cadencia: 60,
    comoReconhecer: "Só dá para falar palavras soltas. É o ritmo que não se sustenta por muitos minutos.",
    origem: "calistenia de esforço vigoroso, 7,5 METs no Compêndio — polichinelo está entre os exemplos",
  },
];

export const INTENSIDADE_PADRAO: IntensidadeId = "moderado";

export function intensidade(id: IntensidadeId): Intensidade {
  return INTENSIDADES.find((i) => i.id === id) ?? INTENSIDADES[1];
}

/* ───────────────────────── Caminhada ───────────────────────── */

export type RitmoCaminhadaId = "leve" | "moderada" | "rapida";

export interface RitmoCaminhada {
  id: RitmoCaminhadaId;
  nome: string;
  met: number;
  /** Velocidade aproximada, para a pessoa se reconhecer. */
  velocidade: string;
}

/**
 * Os três ritmos de caminhada, todos do Compêndio, em superfície plana e
 * firme. Servem ao modo de equivalência — que é comparação de GASTO, nunca
 * afirmação de que os dois exercícios são a mesma coisa.
 */
export const RITMOS_CAMINHADA: RitmoCaminhada[] = [
  { id: "leve", nome: "Leve", met: 2.8, velocidade: "cerca de 3,5 km/h — passeio" },
  { id: "moderada", nome: "Moderada", met: 3.5, velocidade: "cerca de 5 km/h — passo de quem vai a algum lugar" },
  { id: "rapida", nome: "Rápida", met: 4.8, velocidade: "cerca de 6 km/h — passo apressado" },
];

export const RITMO_CAMINHADA_PADRAO: RitmoCaminhadaId = "moderada";

export function ritmoCaminhada(id: RitmoCaminhadaId): RitmoCaminhada {
  return RITMOS_CAMINHADA.find((r) => r.id === id) ?? RITMOS_CAMINHADA[1];
}

export const TEMPOS_CAMINHADA = [10, 20, 30, 45, 60] as const;

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;

export const QTD_MIN = 1;
export const QTD_MAX = 10000;

export const KCAL_MIN = 10;
export const KCAL_MAX = 2000;

export const CADENCIA_MIN = 10;
export const CADENCIA_MAX = 120;

/** Os atalhos de quantidade. Saíram das buscas reais, não de um número redondo qualquer. */
export const PRESETS_QUANTIDADE = [50, 100, 200, 500, 1000] as const;

/**
 * Acima disso a ferramenta para de só responder e passa a avisar.
 *
 * Trinta minutos contínuos de polichinelo é muito impacto para quase
 * qualquer pessoa, e o público que busca "quantos polichinelos para
 * emagrecer" costuma ser exatamente quem menos deveria tentar. O aviso não
 * bloqueia nada — o número continua aparecendo — mas diz em voz alta que
 * distribuir é melhor do que insistir.
 */
export const MINUTOS_ALERTA = 30;

/* ───────────────────────── Parsing ───────────────────────── */

/** Aceita vírgula decimal, que é como se escreve peso em português. */
export function parseNumero(texto: string): number | null {
  const limpo = texto.trim().replace(",", ".");
  if (limpo === "") return null;
  if (!/^\d+(\.\d+)?$/.test(limpo)) return null;
  const n = Number(limpo);
  return Number.isFinite(n) ? n : null;
}

export function pesoValido(p: number | null): p is number {
  return p !== null && p >= PESO_MIN && p <= PESO_MAX;
}

export function quantidadeValida(q: number | null): q is number {
  return q !== null && Number.isInteger(q) && q >= QTD_MIN && q <= QTD_MAX;
}

export function kcalValida(k: number | null): k is number {
  return k !== null && k >= KCAL_MIN && k <= KCAL_MAX;
}

export function cadenciaValida(c: number | null): c is number {
  return c !== null && c >= CADENCIA_MIN && c <= CADENCIA_MAX;
}

/* ───────────────────────── O cálculo ───────────────────────── */

/**
 * Gasto por minuto, pela equação da ACSM.
 *
 * kcal/min = MET × 3,5 × peso ÷ 200
 */
export function kcalPorMinuto(met: number, pesoKg: number): number {
  return (met * 3.5 * pesoKg) / 200;
}

/** Minutos que uma quantidade leva, na cadência informada. */
export function minutosDe(quantidade: number, cadencia: number): number {
  return quantidade / cadencia;
}

export interface Resultado {
  /** Quantos polichinelos. */
  quantidade: number;
  /** Quanto tempo, em minutos (não arredondado — quem formata é a view). */
  minutos: number;
  /** Gasto estimado, em kcal (não arredondado). */
  kcal: number;
  /** Cadência usada, para a frase de contexto. */
  cadencia: number;
  met: number;
}

/** Modo 1: tenho a quantidade, quero as calorias. */
export function deQuantidade(
  quantidade: number,
  pesoKg: number,
  met: number,
  cadencia: number,
): Resultado {
  const minutos = minutosDe(quantidade, cadencia);
  return { quantidade, minutos, kcal: kcalPorMinuto(met, pesoKg) * minutos, cadencia, met };
}

/** Modo 2 e 3: tenho a meta de calorias, quero quantidade e tempo. */
export function deKcal(alvoKcal: number, pesoKg: number, met: number, cadencia: number): Resultado {
  const porMin = kcalPorMinuto(met, pesoKg);
  const minutos = porMin > 0 ? alvoKcal / porMin : 0;
  return { quantidade: minutos * cadencia, minutos, kcal: alvoKcal, cadencia, met };
}

/** Modo 4: quanto gasta uma caminhada, e quanto polichinelo custaria o mesmo. */
export function equivalenteACaminhada(
  minutosCaminhada: number,
  pesoKg: number,
  metCaminhada: number,
  metPolichinelo: number,
  cadencia: number,
): { kcalCaminhada: number; polichinelo: Resultado } {
  const kcalCaminhada = kcalPorMinuto(metCaminhada, pesoKg) * minutosCaminhada;
  return {
    kcalCaminhada,
    polichinelo: deKcal(kcalCaminhada, pesoKg, metPolichinelo, cadencia),
  };
}

/* ───────────────────────── 1 kg de gordura ───────────────────────── */

/** O número clássico. Está aqui nomeado porque ele NÃO é uma lei da física. */
export const KCAL_POR_KG_GORDURA = 7700;

/** Simulação teórica: quantos polichinelos somariam a energia de 1 kg de gordura. */
export function simulacaoUmQuilo(pesoKg: number, met: number, cadencia: number): Resultado {
  return deKcal(KCAL_POR_KG_GORDURA, pesoKg, met, cadencia);
}

/* ───────────────────────── Formatação ───────────────────────── */

/**
 * Arredondamento honesto.
 *
 * "74 kcal" é estimativa; "74,382 kcal" é mentira com três casas. A
 * ferramenta inteira devolve números redondos de propósito, e o texto ao
 * lado sempre diz "aproximadamente".
 */
export function arredondaKcal(kcal: number): number {
  if (kcal >= 100) return Math.round(kcal / 5) * 5;
  return Math.round(kcal);
}

export function arredondaQuantidade(q: number): number {
  if (q >= 1000) return Math.round(q / 50) * 50;
  if (q >= 100) return Math.round(q / 10) * 10;
  return Math.round(q);
}

/** Tempo legível. Abaixo de um minuto vira segundos; acima de uma hora, horas. */
export function formataTempo(minutos: number): string {
  if (!Number.isFinite(minutos) || minutos <= 0) return "—";
  if (minutos < 1) return `${Math.round(minutos * 60)} s`;
  if (minutos < 60) {
    const m = Math.round(minutos);
    return `${m} ${m === 1 ? "minuto" : "minutos"}`;
  }
  const h = Math.floor(minutos / 60);
  const m = Math.round(minutos % 60);
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/**
 * A frase de contexto.
 *
 * Existe para responder a busca em linguagem natural — "para uma pessoa de
 * 80 kg, 500 polichinelos..." — porque é assim que a pergunta é feita, e é
 * assim que um mecanismo de resposta consegue citar.
 */
export function fraseContexto(pesoKg: number, r: Resultado, nomeIntensidade: string): string {
  return (
    `Para uma pessoa de ${Math.round(pesoKg)} kg, ${arredondaQuantidade(r.quantidade)} polichinelos ` +
    `em ritmo ${nomeIntensidade.toLowerCase()} levam cerca de ${formataTempo(r.minutos)} e ` +
    `representam um gasto estimado de aproximadamente ${arredondaKcal(r.kcal)} kcal.`
  );
}

/* ───────────────────────── Tabela estática ───────────────────────── */

/**
 * A tabela que o robô lê.
 *
 * O Google não digita peso. Sem uma tabela pronta em HTML, a página seria
 * uma caixa vazia para ele — o mesmo raciocínio que a calculadora de 1RM
 * já aplica com o exemplo fixo de 80 kg × 8.
 */
export const PESOS_TABELA = [50, 60, 70, 80, 90, 100, 120] as const;

export interface LinhaTabela {
  peso: number;
  kcal: number;
  minutos: number;
}

/** Uma linha por peso, para uma quantidade fixa e a intensidade escolhida. */
export function tabelaPorPeso(quantidade: number, met: number, cadencia: number): LinhaTabela[] {
  return PESOS_TABELA.map((peso) => {
    const r = deQuantidade(quantidade, peso, met, cadencia);
    return { peso, kcal: arredondaKcal(r.kcal), minutos: r.minutos };
  });
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam quantidades diferentes de energia no mesmo exercício — muda com condicionamento, técnica, altura do salto e até com a temperatura do lugar.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhum exercício escolhe de onde o corpo tira gordura. O polichinelo aumenta o gasto do dia; onde a gordura sai primeiro é decidido por genética e hormônio, não pelo movimento.";

export const NOTA_VOLUME_ALTO =
  "Esse volume seria pouco prático numa sessão só, e polichinelo tem impacto. Distribuir o gasto entre caminhada, musculação e o que você já faz no dia costuma render mais e cobrar menos das articulações.";

export const NOTA_SEGURANCA =
  "Se você sente dor no joelho, no tornozelo ou na lombar, tem alguma lesão, limitação de mobilidade ou condição cardiovascular, vale trocar o salto por uma versão sem impacto e conversar com quem acompanha você.";

/* ───────────────────────── Artigos que linkam ───────────────────────── */

/**
 * Os artigos que recebem um convite para a ferramenta.
 *
 * Link, nunca embed. O `polichinelo-emagrece` responde "vale a pena?" e a
 * calculadora no meio dele trocaria a resposta por um formulário. E o link
 * é obrigatório pelo motivo que lib/ferramentas/canonica.ts documenta: sem
 * caminho de link, a página da ferramenta não ranqueia nem pelo próprio
 * nome — o embed dentro do artigo compete com ela e ganha.
 *
 * Os dois artigos ficam com canonical próprio. Eles respondem perguntas
 * que a ferramenta não responde: se vale a pena, onde o exercício falha,
 * como encaixar na semana.
 */
export const ARTIGOS_COM_LINK_POLICHINELO: string[] = [
  /* 7.319 impressões em 90 dias e a página que o Google escolheu para o assunto. */
  "polichinelo-emagrece",
];

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção.
 *
 * O `polichinelo-queima-quantas-calorias` é o caso em que o embed é a
 * resposta certa: o artigo inteiro é tabela para 70 kg, e quem chega nele
 * — ~95% das buscas do cluster, pelo Search Console — vem com um número de
 * polichinelos na cabeça e quer a conta com o próprio peso. Ele ficou no
 * registro do TDEE até 22/09/2026 (o argumento era "a pergunta seguinte é
 * o gasto do dia"); a calculadora de TDEE respondia uma pergunta que esse
 * leitor ainda não tinha feito. O link para a página canônica entra junto,
 * pelo motivo que lib/ferramentas/canonica.ts documenta.
 */
export const ARTIGOS_COM_CALCULADORA_POLICHINELO: string[] = ["polichinelo-queima-quantas-calorias"];
