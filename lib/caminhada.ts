/**
 * O motor da Calculadora de Calorias da Caminhada.
 *
 * POR QUE ESTA FERRAMENTA EXISTE
 *
 * A caminhada é o maior cluster de gasto calórico do site sem ferramenta
 * própria: seis artigos e cerca de 2.600 impressões em 90 dias no Search
 * Console, com "quanto tempo de esteira para emagrecer" sozinho em 1.500.
 * E as buscas que chegam neles pedem número, não opinião — "30 minutos de
 * esteira perde quantas calorias", "1 hora de esteira queima quantas
 * calorias", "quantas calorias perde na esteira em 30 minutos". O site
 * aparecia para elas entre a posição 28 e a 44: era achado, mas respondia
 * em prosa, com a conta feita para uma pessoa genérica.
 *
 * Artigo responde "depende do seu peso". Quem digita isso quer a conta com
 * o próprio peso dentro. É outra intenção, e por isso outra página.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 * O gasto sai da equação de METs que a ACSM usa:
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * O MET da caminhada NO PLANO vem do Compêndio de Atividades Físicas
 * (edição 2024), que mede por faixa de velocidade. Entre uma faixa e outra
 * o valor é interpolado, e a metodologia diz isso em voz alta.
 *
 * A INCLINAÇÃO vem da equação de caminhada da ACSM, que separa o custo de
 * andar na horizontal do custo de subir:
 *
 *     VO2 = 0,1 × v + 1,8 × v × inclinação + 3,5     (v em m/min)
 *
 * Só o termo vertical (1,8 × v × inclinação) é usado aqui, somado ao MET do
 * Compêndio para o plano. É a mesma matemática que faz 12% de inclinação a
 * 4,8 km/h custar mais que o dobro do plano — o que o método 12-3-30
 * promete, e que a conta confirma.
 *
 * PASSOS viram tempo pela cadência: cerca de 100 passos por minuto é a
 * marca de intensidade moderada em adultos (Tudor-Locke, 2018). A
 * ferramenta não converte passos em distância porque passada varia com
 * altura, e assumir 75 cm para todo mundo seria inventar precisão.
 *
 * O QUE A FERRAMENTA NUNCA FAZ
 *
 * Prometer quilo perdido. A conta de "1 kg de gordura = 7.700 kcal" entra
 * como SIMULAÇÃO TEÓRICA, com o aviso de que o corpo não responde assim.
 * E os números são BRUTOS: incluem o que a pessoa gastaria parada. O gasto
 * extra da caminhada é um pouco menor — a metodologia mostra a diferença.
 */

import {
  FONTE_ACSM,
  FONTE_COMPENDIO,
  FONTE_HALL,
  FONTE_WISHNOFSKY,
  KCAL_POR_KG_GORDURA,
  arredondaKcal,
  formataTempo,
  kcalPorMinuto,
  parseNumero,
  type Fonte,
} from "./polichinelo";

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, KCAL_POR_KG_GORDURA };
export type { Fonte };

/* ───────────────────────── Fontes ───────────────────────── */

/** O Compêndio, na parte que interessa aqui: as faixas de caminhada. */
export const FONTE_COMPENDIO_CAMINHADA: Fonte = {
  ...FONTE_COMPENDIO,
  url: "https://pacompendium.com/walking/",
  resumo:
    "lista a caminhada em superfície plana e firme por faixa de velocidade: 3,0 METs a 4 km/h, 3,8 METs em ritmo moderado (4,5 a 5,5 km/h), 4,8 METs em ritmo rápido (5,6 a 6,3 km/h) e 5,5 METs em ritmo muito rápido (6,4 a 7 km/h).",
};

export const FONTE_ACSM_CAMINHADA: Fonte = {
  rotulo:
    "American College of Sports Medicine. ACSM's Guidelines for Exercise Testing and Prescription — equação metabólica da caminhada",
  rotuloCurto: "equação de caminhada da ACSM",
  url: "https://www.acsm.org/education-resources/books/guidelines-exercise-testing-prescription",
  resumo:
    "estima o consumo de oxigênio na caminhada como 0,1 × velocidade + 1,8 × velocidade × inclinação + 3,5, com a velocidade em metros por minuto — é o termo vertical dessa equação que esta calculadora usa para a inclinação.",
};

export const FONTE_TUDOR_LOCKE: Fonte = {
  rotulo:
    "Tudor-Locke C, Han H, Aguiar EJ, et al. How fast is fast enough? Walking cadence (steps/min) as a practical estimate of intensity in adults. British Journal of Sports Medicine, 2018",
  rotuloCurto: "Tudor-Locke et al. (2018)",
  url: "https://pubmed.ncbi.nlm.nih.gov/29858465/",
  resumo:
    "mostra que cerca de 100 passos por minuto correspondem a intensidade moderada (3 METs) em adultos, e cerca de 130 por minuto a intensidade vigorosa.",
};

export const FONTES_CAMINHADA: Fonte[] = [
  FONTE_COMPENDIO_CAMINHADA,
  FONTE_ACSM_CAMINHADA,
  FONTE_ACSM,
  FONTE_TUDOR_LOCKE,
  FONTE_WISHNOFSKY,
  FONTE_HALL,
];

export { FONTE_HALL, FONTE_WISHNOFSKY, FONTE_ACSM };

/* ───────────────────────── Ritmo ───────────────────────── */

export type RitmoId = "leve" | "moderado" | "rapido" | "muito-rapido";

export interface Ritmo {
  id: RitmoId;
  nome: string;
  /** Velocidade típica da faixa, em km/h. É o que entra na conta. */
  velocidade: number;
  /** Faixa de velocidade que o Compêndio mediu, para a pessoa se reconhecer. */
  faixa: string;
  /** MET no plano, copiado do Compêndio 2024. */
  met: number;
  /** Passos por minuto típicos — é o que converte passos em tempo. */
  cadencia: number;
  /** Como reconhecer sem relógio nem esteira. */
  comoReconhecer: string;
  origem: string;
}

/**
 * As quatro faixas do Compêndio 2024 para caminhada em superfície plana e
 * firme. Os METs são copiados, não ajustados. A velocidade típica é o
 * centro da faixa, arredondado para o que uma esteira mostra.
 *
 * A cadência segue Tudor-Locke: 100 passos/min é a fronteira do moderado
 * e 130 a do vigoroso; leve fica abaixo, muito rápido acima.
 */
export const RITMOS: Ritmo[] = [
  {
    id: "leve",
    nome: "Leve",
    velocidade: 4,
    faixa: "cerca de 4 km/h",
    met: 3.0,
    cadencia: 85,
    comoReconhecer: "Passeio. Dá para conversar sem esforço nenhum.",
    origem: "caminhada a 4 km/h (2,5 mph) em superfície plana e firme, 3,0 METs no Compêndio 2024",
  },
  {
    id: "moderado",
    nome: "Moderado",
    velocidade: 5,
    faixa: "4,5 a 5,5 km/h",
    met: 3.8,
    cadencia: 100,
    comoReconhecer: "Passo de quem vai a algum lugar. Dá para falar, mas não cantar. É o ritmo mais comum.",
    origem: "caminhada moderada de 4,5 a 5,5 km/h (2,8 a 3,4 mph) em superfície plana e firme, 3,8 METs no Compêndio 2024",
  },
  {
    id: "rapido",
    nome: "Rápido",
    velocidade: 6,
    faixa: "5,6 a 6,3 km/h",
    met: 4.8,
    cadencia: 115,
    comoReconhecer: "Passo apressado, de quem está atrasado. Frases curtas.",
    origem: "caminhada rápida de 5,6 a 6,3 km/h (3,5 a 3,9 mph) em superfície plana e firme, 4,8 METs no Compêndio 2024",
  },
  {
    id: "muito-rapido",
    nome: "Muito rápido",
    velocidade: 6.5,
    faixa: "6,4 a 7 km/h",
    met: 5.5,
    cadencia: 130,
    comoReconhecer: "Quase corrida. Só dá para falar palavras soltas — e poucas pessoas sustentam por muito tempo.",
    origem: "caminhada muito rápida de 6,4 a 7 km/h (4,0 a 4,4 mph) em superfície plana e firme, 5,5 METs no Compêndio 2024",
  },
];

export const RITMO_PADRAO: RitmoId = "moderado";

export function ritmo(id: RitmoId): Ritmo {
  return RITMOS.find((r) => r.id === id) ?? RITMOS[1];
}

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;

export const MINUTOS_MIN = 1;
export const MINUTOS_MAX = 600;

export const KM_MIN = 0.1;
export const KM_MAX = 100;

export const PASSOS_MIN = 100;
export const PASSOS_MAX = 100000;

export const KCAL_MIN = 10;
export const KCAL_MAX = 3000;

/**
 * A faixa de velocidade em que a conta é honesta. Abaixo de 3 km/h o
 * Compêndio já não chama de caminhada; acima de 7 a maioria das pessoas
 * está correndo, e corrida tem outra equação.
 */
export const VELOCIDADE_MIN = 3;
export const VELOCIDADE_MAX = 7;

/** Inclinação em porcentagem, como a esteira mostra. 15% é o teto da maioria. */
export const INCLINACAO_MIN = 0;
export const INCLINACAO_MAX = 15;

/** Os atalhos. Saíram das buscas — "20 minutos", "30 minutos", "1 hora" — não de número redondo qualquer. */
export const PRESETS_MINUTOS = [10, 20, 30, 45, 60, 90] as const;
export const PRESETS_KM = [1, 2, 3, 5, 10] as const;
export const PRESETS_PASSOS = [3000, 5000, 8000, 10000, 15000] as const;
export const PRESETS_INCLINACAO = [0, 3, 6, 9, 12, 15] as const;

/**
 * Acima disso a ferramenta para de só responder e passa a avisar. Duas
 * horas de caminhada contínua não é absurdo para um dia de passeio, mas
 * como meta diária para gastar caloria é o tipo de plano que não sobrevive
 * à segunda semana.
 */
export const MINUTOS_ALERTA = 120;

/* ───────────────────────── Parsing ───────────────────────── */

export function pesoValido(p: number | null): p is number {
  return p !== null && p >= PESO_MIN && p <= PESO_MAX;
}
export function minutosValidos(m: number | null): m is number {
  return m !== null && m >= MINUTOS_MIN && m <= MINUTOS_MAX;
}
export function kmValidos(k: number | null): k is number {
  return k !== null && k >= KM_MIN && k <= KM_MAX;
}
export function passosValidos(p: number | null): p is number {
  return p !== null && Number.isInteger(p) && p >= PASSOS_MIN && p <= PASSOS_MAX;
}
export function kcalValida(k: number | null): k is number {
  return k !== null && k >= KCAL_MIN && k <= KCAL_MAX;
}
export function velocidadeValida(v: number | null): v is number {
  return v !== null && v >= VELOCIDADE_MIN && v <= VELOCIDADE_MAX;
}
export function inclinacaoValida(i: number | null): i is number {
  return i !== null && i >= INCLINACAO_MIN && i <= INCLINACAO_MAX;
}

/* ───────────────────────── O MET ───────────────────────── */

/**
 * MET no plano para uma velocidade qualquer.
 *
 * Nos pontos medidos pelo Compêndio devolve o valor do Compêndio. Entre
 * dois pontos, interpola em linha reta — e fora das pontas segura no valor
 * da ponta, porque extrapolar uma reta para 8 km/h daria um número de
 * caminhada para o que já é corrida.
 */
export function metNoPlano(velocidadeKmH: number): number {
  const pontos = RITMOS.map((r) => ({ v: r.velocidade, met: r.met }));
  if (velocidadeKmH <= pontos[0].v) return pontos[0].met;
  const ultimo = pontos[pontos.length - 1];
  if (velocidadeKmH >= ultimo.v) return ultimo.met;
  for (let i = 0; i < pontos.length - 1; i++) {
    const a = pontos[i];
    const b = pontos[i + 1];
    if (velocidadeKmH >= a.v && velocidadeKmH <= b.v) {
      const t = (velocidadeKmH - a.v) / (b.v - a.v);
      return a.met + t * (b.met - a.met);
    }
  }
  return ultimo.met;
}

/** A velocidade corresponde a um ponto medido, ou a conta interpolou? Para a metodologia dizer a verdade. */
export function velocidadeMedida(velocidadeKmH: number): boolean {
  return RITMOS.some((r) => Math.abs(r.velocidade - velocidadeKmH) < 0.001);
}

/**
 * O acréscimo da inclinação, em METs.
 *
 * Termo vertical da equação da ACSM: 1,8 × v(m/min) × inclinação(fração),
 * em mL/kg/min — dividido por 3,5 vira MET. Zero de inclinação soma zero.
 */
export function metDaInclinacao(velocidadeKmH: number, inclinacaoPct: number): number {
  const vMetrosPorMin = (velocidadeKmH * 1000) / 60;
  return (1.8 * vMetrosPorMin * (inclinacaoPct / 100)) / 3.5;
}

/** O MET total: plano mais subida. */
export function metCaminhada(velocidadeKmH: number, inclinacaoPct: number): number {
  return metNoPlano(velocidadeKmH) + metDaInclinacao(velocidadeKmH, inclinacaoPct);
}

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  /** Minutos de caminhada (não arredondado — quem formata é a view). */
  minutos: number;
  /** Gasto estimado, bruto, em kcal (não arredondado). */
  kcal: number;
  /** Quilômetros percorridos nesse tempo, nessa velocidade. */
  km: number;
  /** Passos aproximados, pela cadência do ritmo. */
  passos: number;
  met: number;
  velocidade: number;
  inclinacao: number;
}

function monta(minutos: number, pesoKg: number, velocidade: number, inclinacao: number, cadencia: number): Resultado {
  const met = metCaminhada(velocidade, inclinacao);
  return {
    minutos,
    kcal: kcalPorMinuto(met, pesoKg) * minutos,
    km: (velocidade * minutos) / 60,
    passos: minutos * cadencia,
    met,
    velocidade,
    inclinacao,
  };
}

/** Modo 1: tenho o tempo, quero as calorias. */
export function deTempo(minutos: number, pesoKg: number, velocidade: number, inclinacao: number, cadencia: number): Resultado {
  return monta(minutos, pesoKg, velocidade, inclinacao, cadencia);
}

/** Modo 2: tenho a distância, quero as calorias. O tempo sai da velocidade. */
export function deDistancia(km: number, pesoKg: number, velocidade: number, inclinacao: number, cadencia: number): Resultado {
  const minutos = velocidade > 0 ? (km / velocidade) * 60 : 0;
  return monta(minutos, pesoKg, velocidade, inclinacao, cadencia);
}

/**
 * A cadência que corresponde a uma velocidade. Nos ritmos medidos é a do
 * ritmo; entre eles, interpolada como o MET. Sem isso, quem digita a
 * velocidade da esteira no modo passos teria tempo por uma cadência e
 * distância por outra velocidade — dois números que não conversam.
 */
export function cadenciaPara(velocidadeKmH: number): number {
  const pts = RITMOS;
  if (velocidadeKmH <= pts[0].velocidade) return pts[0].cadencia;
  const ult = pts[pts.length - 1];
  if (velocidadeKmH >= ult.velocidade) return ult.cadencia;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (velocidadeKmH <= b.velocidade) return a.cadencia + ((velocidadeKmH - a.velocidade) / (b.velocidade - a.velocidade)) * (b.cadencia - a.cadencia);
  }
  return ult.cadencia;
}

/** Modo 3: tenho os passos, quero as calorias. O tempo sai da cadência. */
export function dePassos(passos: number, pesoKg: number, velocidade: number, inclinacao: number, cadencia: number): Resultado {
  const minutos = cadencia > 0 ? passos / cadencia : 0;
  const r = monta(minutos, pesoKg, velocidade, inclinacao, cadencia);
  return { ...r, passos };
}

/** Modo 4: tenho a meta de calorias, quero o tempo. */
export function deKcal(alvoKcal: number, pesoKg: number, velocidade: number, inclinacao: number, cadencia: number): Resultado {
  const met = metCaminhada(velocidade, inclinacao);
  const porMin = kcalPorMinuto(met, pesoKg);
  const minutos = porMin > 0 ? alvoKcal / porMin : 0;
  return { ...monta(minutos, pesoKg, velocidade, inclinacao, cadencia), kcal: alvoKcal };
}

/**
 * O gasto LÍQUIDO: o que a caminhada acrescenta ao que a pessoa gastaria
 * parada no mesmo tempo (1 MET). É o número honesto para quem está
 * contando déficit — e é menor que o bruto que todo mundo mostra.
 */
export function kcalLiquida(r: Resultado, pesoKg: number): number {
  return r.kcal - kcalPorMinuto(1, pesoKg) * r.minutos;
}

/** Simulação teórica: quanto tempo de caminhada somaria a energia de 1 kg de gordura. */
export function simulacaoUmQuilo(pesoKg: number, velocidade: number, inclinacao: number, cadencia: number): Resultado {
  return deKcal(KCAL_POR_KG_GORDURA, pesoKg, velocidade, inclinacao, cadencia);
}

/* ───────────────────────── Formatação ───────────────────────── */

export function arredondaPassos(p: number): number {
  if (p >= 10000) return Math.round(p / 500) * 500;
  if (p >= 1000) return Math.round(p / 100) * 100;
  return Math.round(p / 10) * 10;
}

export function formataKm(km: number): string {
  if (!Number.isFinite(km) || km <= 0) return "—";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${(Math.round(km * 10) / 10).toLocaleString("pt-BR")} km`;
}

export function formataVelocidade(v: number): string {
  return `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km/h`;
}

/**
 * A frase de contexto, em linguagem natural — "para uma pessoa de 80 kg,
 * 30 minutos de caminhada..." — porque é assim que a pergunta é feita e é
 * assim que um mecanismo de resposta consegue citar.
 */
export function fraseContexto(pesoKg: number, r: Resultado): string {
  const onde = r.inclinacao > 0 ? ` com ${r.inclinacao.toLocaleString("pt-BR")}% de inclinação` : "";
  const peso = pesoKg.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  return (
    `Para uma pessoa de ${peso} kg, uma caminhada de ${formataTempo(r.minutos)} a ` +
    `${formataVelocidade(r.velocidade)}${onde} representa um gasto estimado de aproximadamente ` +
    `${arredondaKcal(r.kcal)} kcal — cerca de ${formataKm(r.km)} e ${arredondaPassos(r.passos).toLocaleString("pt-BR")} passos.`
  );
}

/* ───────────────────────── Tabelas estáticas ───────────────────────── */

/**
 * As tabelas que o robô lê. O Google não digita peso: sem números
 * resolvidos em HTML a página seria um formulário vazio para ele.
 */
export const PESOS_TABELA = [50, 60, 70, 80, 90, 100, 120] as const;
export const TEMPOS_TABELA = [10, 20, 30, 45, 60, 90] as const;

export interface LinhaPeso {
  peso: number;
  kcal: number;
  kcalLiquida: number;
}

/** Uma linha por peso, para um tempo fixo, no ritmo escolhido. */
export function tabelaPorPeso(minutos: number, velocidade: number, inclinacao: number): LinhaPeso[] {
  return PESOS_TABELA.map((peso) => {
    const r = deTempo(minutos, peso, velocidade, inclinacao, 100);
    return { peso, kcal: arredondaKcal(r.kcal), kcalLiquida: arredondaKcal(kcalLiquida(r, peso)) };
  });
}

export interface LinhaTempo {
  minutos: number;
  kcal: number;
  km: number;
}

/** Uma linha por tempo, para um peso fixo, no ritmo escolhido. */
export function tabelaPorTempo(pesoKg: number, velocidade: number, inclinacao: number): LinhaTempo[] {
  return TEMPOS_TABELA.map((minutos) => {
    const r = deTempo(minutos, pesoKg, velocidade, inclinacao, 100);
    return { minutos, kcal: arredondaKcal(r.kcal), km: r.km };
  });
}

export interface LinhaRitmo {
  ritmo: Ritmo;
  kcal: number;
  km: number;
}

/** Uma linha por ritmo, para peso e tempo fixos, no plano. */
export function tabelaPorRitmo(pesoKg: number, minutos: number): LinhaRitmo[] {
  return RITMOS.map((rt) => {
    const r = deTempo(minutos, pesoKg, rt.velocidade, 0, rt.cadencia);
    return { ritmo: rt, kcal: arredondaKcal(r.kcal), km: r.km };
  });
}

export interface LinhaInclinacao {
  inclinacao: number;
  met: number;
  kcal: number;
}

/** Uma linha por inclinação, para peso, tempo e velocidade fixos. */
export function tabelaPorInclinacao(pesoKg: number, minutos: number, velocidade: number): LinhaInclinacao[] {
  return PRESETS_INCLINACAO.map((inclinacao) => {
    const r = deTempo(minutos, pesoKg, velocidade, inclinacao, 100);
    return { inclinacao, met: Math.round(r.met * 10) / 10, kcal: arredondaKcal(r.kcal) };
  });
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam quantidades diferentes de energia na mesma caminhada — muda com condicionamento, terreno, vento, altura, e até com o quanto os braços balançam.";

export const NOTA_BRUTO =
  "O número é bruto: inclui o que você gastaria parado nesse tempo. O que a caminhada acrescenta ao seu dia é um pouco menor — a metodologia mostra os dois.";

export const NOTA_VOLUME_ALTO =
  "Esse tempo seria pouco prático como meta diária. Para um gasto assim, distribuir entre caminhada, musculação e o movimento do dia costuma render mais e sobreviver mais semanas.";

export const NOTA_SEGURANCA =
  "Se você sente dor no joelho, no quadril ou na lombar ao caminhar, tem alguma condição cardiovascular ou está começando depois de muito tempo parado, comece com menos tempo e sem inclinação, e converse com quem acompanha você.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhum exercício escolhe de onde o corpo tira gordura. A caminhada aumenta o gasto do dia; onde a gordura sai primeiro é decidido por genética e hormônio, não pelo movimento.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção.
 *
 * Os dois respondem "quanto tempo?" e dão a conta para uma pessoa genérica
 * na primeira seção — é o ponto exato em que quem lê quer a conta dela. Os
 * dois estavam sem ferramenta nenhuma e são as duas páginas de maior
 * impressão do cluster. O link para a página canônica entra junto, pelo
 * motivo que lib/ferramentas/canonica.ts documenta.
 *
 * Teto de oito, como os outros registros de embed. Ferramenta em todo
 * artigo que menciona caminhada seria ruído: os que respondem "emagrece?"
 * (caminhada-emagrece, 10-mil-passos) ganham link, não formulário.
 */
export const ARTIGOS_COM_CALCULADORA_CAMINHADA: string[] = [
  /* 1.501 impressões em 90 dias; as buscas de "N minutos de esteira queima quantas calorias" caem aqui. */
  "quanto-tempo-de-esteira-para-emagrecer",
  /* 734 impressões; tem a seção "Quantas calorias a caminhada gasta de verdade?". */
  "quanto-tempo-de-caminhada-por-dia",
  /* Método 12-3-30: a conta do leitor é quanto a esteira inclinada gasta (troca da FC em 01/10). */
  "caminhada-na-esteira-inclinada",
];

/**
 * Artigos que recebem um convite (link) para a ferramenta, no fim do texto.
 *
 * `caminhada-emagrece` já pertence ao
 * registro da calculadora de FC, e `caminhada-japonesa` ao do TDEE — a
 * regra de uma ferramenta por artigo os deixa de fora daqui.
 */
export const ARTIGOS_COM_LINK_CAMINHADA: string[] = [
  /* A pergunta é "10 mil passos emagrecem?"; a conta que sobra é quantas calorias os passos DELA valem. */
  "10-mil-passos-por-dia-emagrece",
];
