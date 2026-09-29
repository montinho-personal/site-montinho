/**
 * O motor da Calculadora de Corrida: pace, calorias e tempo de prova.
 *
 * POR QUE ESTA FERRAMENTA EXISTE — E A RESSALVA HONESTA
 *
 * Ao contrário da caminhada (2.600 impressões em 90 dias) e das dez
 * atividades (2.900), a corrida NÃO tem demanda comprovada no Search
 * Console do site: 23 impressões em 90 dias, quase todas de "musculação ou
 * corrida para emagrecer", que é comparação e não conta. Isto aqui é
 * aposta em busca externa — "calculadora de pace", "quanto tempo para
 * correr 5 km", "quantas calorias 10 km" — e serve três artigos de corrida
 * que estavam sem ferramenta nenhuma. Se em 90 dias não trouxer
 * impressão, a decisão certa é não fazer a quarta aposta do mesmo tipo.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 * Aqui a fonte é a equação de CORRIDA da ACSM, não a tabela de METs:
 *
 *     VO2 (mL/kg/min) = 0,2 × v + 0,9 × v × inclinação + 3,5
 *
 * com v em metros por minuto. O 0,2 é o custo de oxigênio do deslocamento
 * horizontal e o 0,9, o da subida — o dobro do 0,1 e metade do 1,8 da
 * caminhada, porque correr gasta mais no plano e aproveita melhor a
 * subida. A equação vale a partir de 8 km/h (134 m/min); abaixo disso a
 * ACSM manda usar a de caminhada, e é o que a ferramenta faz.
 *
 * A equação foi conferida contra o Compêndio, e os dois concordam:
 * 8 km/h dá 8,6 METs aqui e 8,3 lá; 10 km/h dá 10,5 aqui e 9,8 a 10,5 lá;
 * 12 km/h dá 12,4 aqui e 11,8 a 12,3 lá. A vantagem da equação é ser
 * contínua — ela responde 9,7 km/h sem interpolar tabela.
 *
 * A REGRA DE 1 kcal POR QUILO POR QUILÔMETRO É LÍQUIDA
 *
 * A auditoria achou isto e vale escrever: na equação da ACSM, o custo
 * LÍQUIDO de correr um quilômetro é exatamente 1 kcal por quilo de corpo,
 * em qualquer pace. Não é aproximação — sai da álgebra. O termo 0,2 × v é
 * proporcional à velocidade, o tempo por quilômetro é inversamente
 * proporcional a ela, e os dois se cancelam; o que sobra do 3,5 é o
 * repouso, que o líquido desconta.
 *
 * O bruto fica em torno de 1,1 kcal por quilo por quilômetro e cai um
 * pouco conforme o pace acelera, porque menos tempo correndo significa
 * menos repouso somado. Por isso a página publica os dois números: o
 * bruto, que é o que toda calculadora e todo relógio mostram, e o
 * líquido, que é de onde vem a regra clássica — e que é o que bate com a
 * tabela do artigo de pular corda, onde a corrida aparece com 300 a 350
 * kcal em 30 minutos.
 *
 * O PACE É A LÍNGUA DE QUEM CORRE
 *
 * Ninguém diz "corri a 11,5 km/h": diz "fiz 5:13 por quilômetro". A
 * ferramenta aceita e devolve os dois, e a conversão é exata, não
 * arredondada — arredondar pace propaga erro no tempo de prova.
 *
 * A COMPARAÇÃO QUE QUASE NINGUÉM FAZ DIREITO
 *
 * "Correr 5 km gasta muito mais que caminhar 5 km?" Por DISTÂNCIA, a
 * diferença é bem menor do que parece — o custo por quilômetro é quase o
 * mesmo, porque a distância é a mesma. Por TEMPO, a corrida ganha fácil.
 * A ferramenta mostra os dois lados, porque é aí que mora o mal-entendido.
 */

import {
  FONTE_ACSM,
  FONTE_HALL,
  KCAL_POR_KG_GORDURA,
  arredondaKcal,
  formataTempo,
  kcalPorMinuto,
  parseNumero,
  type Fonte,
} from "./polichinelo";
import { metCaminhada } from "./caminhada";

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, KCAL_POR_KG_GORDURA, FONTE_HALL, FONTE_ACSM };
export type { Fonte };

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_ACSM_CORRIDA: Fonte = {
  rotulo:
    "American College of Sports Medicine. ACSM's Guidelines for Exercise Testing and Prescription — equação metabólica da corrida",
  rotuloCurto: "equação de corrida da ACSM",
  url: "https://www.acsm.org/education-resources/books/guidelines-exercise-testing-prescription",
  resumo:
    "estima o consumo de oxigênio na corrida como 0,2 × velocidade + 0,9 × velocidade × inclinação + 3,5, com a velocidade em metros por minuto, válida a partir de 134 m/min (cerca de 8 km/h).",
};

export const FONTE_COMPENDIO_CORRIDA: Fonte = {
  rotulo:
    "Herrmann SD, Willis EA, Ainsworth BE, et al. 2024 Adult Compendium of Physical Activities. Journal of Sport and Health Science, 2024",
  rotuloCurto: "Compêndio de Atividades Físicas (2024)",
  url: "https://pacompendium.com/running/",
  resumo:
    "lista a corrida por faixa de velocidade, de cerca de 6,5 METs a 8 km/h até mais de 12 METs acima de 12 km/h. Serve aqui como conferência da equação da ACSM, que é contínua.",
};

export const FONTES_CORRIDA: Fonte[] = [FONTE_ACSM_CORRIDA, FONTE_COMPENDIO_CORRIDA, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;

/** A equação de corrida vale a partir de 134 m/min. Abaixo disso é caminhada. */
export const VELOCIDADE_MIN_CORRIDA = 8;
export const VELOCIDADE_MIN = 4;
export const VELOCIDADE_MAX = 25;

export const PACE_MIN_SEG = 144; /* 2:24/km — recorde mundial de maratona é mais lento que isso */
export const PACE_MAX_SEG = 900; /* 15:00/km — abaixo disso é caminhada */

export const KM_MIN = 0.1;
export const KM_MAX = 200;
export const MINUTOS_MIN = 1;
export const MINUTOS_MAX = 600;

export const INCLINACAO_MIN = 0;
export const INCLINACAO_MAX = 15;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const velocidadeValida = (v: number | null): v is number => v !== null && v >= VELOCIDADE_MIN && v <= VELOCIDADE_MAX;
export const kmValidos = (k: number | null): k is number => k !== null && k >= KM_MIN && k <= KM_MAX;
export const minutosValidos = (m: number | null): m is number => m !== null && m >= MINUTOS_MIN && m <= MINUTOS_MAX;
export const inclinacaoValida = (i: number | null): i is number => i !== null && i >= INCLINACAO_MIN && i <= INCLINACAO_MAX;
export const paceValido = (s: number | null): s is number => s !== null && s >= PACE_MIN_SEG && s <= PACE_MAX_SEG;

/* ───────────────────────── Pace ───────────────────────── */

/** Segundos por quilômetro a partir da velocidade em km/h. */
export function paceDeVelocidade(kmh: number): number {
  return kmh > 0 ? 3600 / kmh : 0;
}

/** Velocidade em km/h a partir do pace em segundos por quilômetro. */
export function velocidadeDePace(segPorKm: number): number {
  return segPorKm > 0 ? 3600 / segPorKm : 0;
}

/** "5:30" → 330 segundos. Aceita "5:30", "5.30" e "5,30"; rejeita segundo ≥ 60. */
export function parsePace(texto: string): number | null {
  const limpo = texto.trim().replace(/[.,]/g, ":");
  const m = limpo.match(/^(\d{1,2}):(\d{1,2})$/);
  if (!m) {
    /* Só minutos: "6" vira 6:00. */
    const so = limpo.match(/^(\d{1,2})$/);
    return so ? Number(so[1]) * 60 : null;
  }
  const min = Number(m[1]);
  const seg = Number(m[2]);
  if (seg >= 60) return null;
  return min * 60 + seg;
}

/** 330 → "5:30". */
export function formataPace(segPorKm: number): string {
  if (!Number.isFinite(segPorKm) || segPorKm <= 0) return "—";
  const total = Math.round(segPorKm);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** Tempo de prova em h:mm:ss — pace curto demais para "1 h 5 min". */
export function formataRelogio(segundos: number): string {
  if (!Number.isFinite(segundos) || segundos <= 0) return "—";
  const t = Math.round(segundos);
  const hh = Math.floor(t / 3600);
  const mm = Math.floor((t % 3600) / 60);
  const ss = t % 60;
  return hh > 0
    ? `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
    : `${mm}:${String(ss).padStart(2, "0")}`;
}

/* ───────────────────────── O MET ───────────────────────── */

/**
 * MET pela equação de corrida da ACSM.
 *
 * VO2 = 0,2 × v(m/min) + 0,9 × v × inclinação + 3,5, dividido por 3,5.
 */
export function metCorrida(velocidadeKmH: number, inclinacaoPct = 0): number {
  const v = (velocidadeKmH * 1000) / 60;
  const vo2 = 0.2 * v + 0.9 * v * (inclinacaoPct / 100) + 3.5;
  return vo2 / 3.5;
}

/**
 * O MET do ritmo informado, escolhendo a equação certa.
 *
 * Abaixo de 8 km/h a equação de corrida não vale — a própria ACSM diz — e
 * quem está nessa faixa quase sempre está caminhando. A ferramenta troca
 * para a conta da caminhada e avisa na tela, em vez de devolver um número
 * fora do domínio da equação.
 */
export function metDoRitmo(velocidadeKmH: number, inclinacaoPct = 0): { met: number; equacao: "corrida" | "caminhada" } {
  return velocidadeKmH >= VELOCIDADE_MIN_CORRIDA
    ? { met: metCorrida(velocidadeKmH, inclinacaoPct), equacao: "corrida" }
    : { met: metCaminhada(Math.max(velocidadeKmH, 3), inclinacaoPct), equacao: "caminhada" };
}

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  km: number;
  minutos: number;
  velocidade: number;
  /** Segundos por quilômetro. */
  pace: number;
  kcal: number;
  met: number;
  inclinacao: number;
  equacao: "corrida" | "caminhada";
}

function monta(km: number, minutos: number, pesoKg: number, inclinacao: number): Resultado {
  const velocidade = minutos > 0 ? (km / minutos) * 60 : 0;
  const { met, equacao } = metDoRitmo(velocidade, inclinacao);
  return {
    km,
    minutos,
    velocidade,
    pace: paceDeVelocidade(velocidade),
    kcal: kcalPorMinuto(met, pesoKg) * minutos,
    met,
    inclinacao,
    equacao,
  };
}

/** Modo 1: tenho distância e pace, quero tempo e calorias. */
export function deDistanciaEPace(km: number, segPorKm: number, pesoKg: number, inclinacao = 0): Resultado {
  return monta(km, (km * segPorKm) / 60, pesoKg, inclinacao);
}

/** Modo 2: tenho distância e tempo, quero pace e calorias. */
export function deDistanciaETempo(km: number, minutos: number, pesoKg: number, inclinacao = 0): Resultado {
  return monta(km, minutos, pesoKg, inclinacao);
}

/** Modo 3: tenho tempo e pace, quero distância e calorias. */
export function deTempoEPace(minutos: number, segPorKm: number, pesoKg: number, inclinacao = 0): Resultado {
  const velocidade = velocidadeDePace(segPorKm);
  return monta((velocidade * minutos) / 60, minutos, pesoKg, inclinacao);
}

/** O que a corrida acrescenta ao que a pessoa gastaria parada (1 MET). */
export function kcalLiquida(r: Resultado, pesoKg: number): number {
  return r.kcal - kcalPorMinuto(1, pesoKg) * r.minutos;
}

/** Gasto bruto por quilômetro — cai um pouco conforme o pace acelera. */
export function kcalPorKm(r: Resultado): number {
  return r.km > 0 ? r.kcal / r.km : 0;
}

/**
 * Gasto LÍQUIDO por quilômetro — exatamente 1 kcal por quilo de corpo em
 * qualquer pace, pela álgebra da equação da ACSM. É a regra clássica.
 */
export function kcalLiquidaPorKm(r: Resultado, pesoKg: number): number {
  return r.km > 0 ? kcalLiquida(r, pesoKg) / r.km : 0;
}

/* ───────────────────────── Provas ───────────────────────── */

export interface Prova {
  id: string;
  nome: string;
  km: number;
}

export const PROVAS: Prova[] = [
  { id: "5k", nome: "5 km", km: 5 },
  { id: "10k", nome: "10 km", km: 10 },
  { id: "21k", nome: "Meia maratona", km: 21.0975 },
  { id: "42k", nome: "Maratona", km: 42.195 },
];

export interface LinhaProva {
  prova: Prova;
  /** Tempo total, em segundos. */
  segundos: number;
  kcal: number;
}

/** O tempo e o gasto de cada prova no pace informado. */
export function tabelaProvas(segPorKm: number, pesoKg: number, inclinacao = 0): LinhaProva[] {
  return PROVAS.map((prova) => {
    const r = deDistanciaEPace(prova.km, segPorKm, pesoKg, inclinacao);
    return { prova, segundos: r.minutos * 60, kcal: r.kcal };
  });
}

/* ───────────────────────── Corrida × caminhada ───────────────────────── */

export interface ComparacaoCaminhada {
  /** Gasto da corrida na distância. */
  corrida: { kcal: number; minutos: number };
  /** Gasto da caminhada na MESMA distância — a comparação que surpreende. */
  caminhadaMesmaDistancia: { kcal: number; minutos: number };
  /** Gasto da caminhada no MESMO tempo — a comparação em que a corrida ganha. */
  caminhadaMesmoTempo: { kcal: number; km: number };
  /** Velocidade de caminhada usada, em km/h. */
  velocidadeCaminhada: number;
}

/**
 * Os dois lados da comparação.
 *
 * Por distância, correr 5 km gasta pouco mais que caminhar 5 km — porque o
 * custo é quase todo do deslocamento. Por tempo, a corrida ganha fácil,
 * porque cobre muito mais chão. Mostrar só um dos lados é o que produz as
 * duas meias-verdades que circulam.
 */
export function comparaComCaminhada(r: Resultado, pesoKg: number, velocidadeCaminhada = 5): ComparacaoCaminhada {
  const metCam = metCaminhada(velocidadeCaminhada, r.inclinacao);
  const minCamMesmaDist = velocidadeCaminhada > 0 ? (r.km / velocidadeCaminhada) * 60 : 0;
  return {
    corrida: { kcal: r.kcal, minutos: r.minutos },
    caminhadaMesmaDistancia: { kcal: kcalPorMinuto(metCam, pesoKg) * minCamMesmaDist, minutos: minCamMesmaDist },
    caminhadaMesmoTempo: {
      kcal: kcalPorMinuto(metCam, pesoKg) * r.minutos,
      km: (velocidadeCaminhada * r.minutos) / 60,
    },
    velocidadeCaminhada,
  };
}

/* ───────────────────────── Tabelas estáticas ───────────────────────── */

export const PESOS_TABELA = [50, 60, 70, 80, 90, 100, 120] as const;
export const PACES_TABELA = [420, 360, 330, 300, 270] as const; /* 7:00 a 4:30 */

export interface LinhaPeso {
  peso: number;
  kcal5k: number;
  kcal10k: number;
}

export function tabelaPorPeso(segPorKm: number): LinhaPeso[] {
  return PESOS_TABELA.map((peso) => ({
    peso,
    kcal5k: arredondaKcal(deDistanciaEPace(5, segPorKm, peso).kcal),
    kcal10k: arredondaKcal(deDistanciaEPace(10, segPorKm, peso).kcal),
  }));
}

export interface LinhaPace {
  pace: number;
  velocidade: number;
  met: number;
  kcal5k: number;
  tempo5k: number;
}

export function tabelaPorPace(pesoKg: number): LinhaPace[] {
  return PACES_TABELA.map((pace) => {
    const r = deDistanciaEPace(5, pace, pesoKg);
    return { pace, velocidade: r.velocidade, met: r.met, kcal5k: arredondaKcal(r.kcal), tempo5k: r.minutos * 60 };
  });
}

export function simulacaoUmQuilo(pesoKg: number, segPorKm: number): { km: number; minutos: number } {
  const r = deDistanciaEPace(1, segPorKm, pesoKg);
  const kmNecessarios = r.kcal > 0 ? KCAL_POR_KG_GORDURA / r.kcal : 0;
  return { km: kmNecessarios, minutos: (kmNecessarios * segPorKm) / 60 };
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export function fraseContexto(pesoKg: number, r: Resultado): string {
  const peso = pesoKg.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const onde = r.inclinacao > 0 ? ` com ${r.inclinacao.toLocaleString("pt-BR")}% de inclinação` : "";
  return (
    `Para uma pessoa de ${peso} kg, ${r.km.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} km ` +
    `no pace de ${formataPace(r.pace)} por quilômetro${onde} levam ${formataRelogio(r.minutos * 60)} e representam ` +
    `um gasto estimado de aproximadamente ${arredondaKcal(r.kcal)} kcal.`
  );
}

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente no mesmo pace — muda com economia de corrida, terreno, vento e temperatura.";

export const NOTA_BRUTO =
  "O número é bruto: inclui o que você gastaria parado nesse tempo. O que a corrida acrescenta ao seu dia é um pouco menor.";

export const NOTA_EQUACAO_CAMINHADA =
  "Abaixo de 8 km/h a equação de corrida da ACSM não vale, e quem está nesse ritmo quase sempre está caminhando. A conta trocou para a da caminhada.";

export const NOTA_SEGURANCA =
  "Corrida tem impacto. Se você está começando, alternar caminhada e corrida por algumas semanas poupa canela, joelho e tendão — e é o que faz a corrida durar.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhum exercício escolhe de onde o corpo tira gordura. A corrida aumenta o gasto do dia; onde a gordura sai primeiro é decidido por genética e hormônio.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora.
 *
 * `corrida-de-rua-iniciante` saiu do registro de link da calculadora de
 * FC: quem se prepara para a primeira prova quer saber o pace e o tempo
 * estimado, que é a conta desta ferramenta, não a zona de batimento.
 * `musculacao-ou-corrida-para-emagrecer` fica na FC — a pergunta dele é de
 * comparação entre modalidades, não de pace.
 */
export const ARTIGOS_COM_CALCULADORA_CORRIDA: string[] = [
  "corrida-para-iniciantes",
  "corrida-de-rua-iniciante",
  "esteira-ou-rua-para-correr",
  "como-melhorar-o-pace-na-corrida",
];
