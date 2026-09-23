/**
 * O motor da Calculadora de Calorias Pulando Corda.
 *
 * POR QUE A CORDA SAIU DA CALCULADORA DE ATIVIDADES
 *
 * Pelo mesmo critério das outras: só sai quem tem uma conta que as outras
 * não têm. Na corda são os BLOCOS.
 *
 * Quase ninguém pula corda 30 minutos direto. O próprio artigo
 * `pular-corda-emagrece` monta a progressão em blocos — 30 segundos
 * pulando, 60 parado, dez vezes. A calculadora coletiva multiplicava o
 * MET pelo tempo de relógio, e dava à sessão de 15 minutos o gasto de 15
 * minutos pulando, quando a pessoa pulou 5. Aqui a pessoa informa os
 * blocos, e o descanso entre eles conta como ficar em pé.
 *
 * A outra conta que só a corda tem é o SALTO. O Compêndio mede a corda
 * pela cadência, em saltos por minuto, então dá para dizer quantos saltos
 * a sessão teve e quanto custa cada cem — e responder a meta de "mil
 * saltos por dia" que circula nas redes.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * Compêndio de Atividades Físicas de 2011, confirmado por busca sem valor
 * informado: pular corda em ritmo lento, menos de 100 saltos por minuto,
 * 8,8; ritmo moderado, 100 a 120, 11,8; ritmo rápido, 120 a 160, 12,3. O
 * descanso entre blocos vale ficar em pé, 1,3 — o mesmo da lateral no
 * futebol, do intervalo no boxe, da borda na natação e do descanso entre
 * rolas no jiu-jitsu.
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

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, KCAL_POR_KG_GORDURA, FONTE_HALL };

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_COMPENDIO_CORDA: Fonte = {
  rotulo:
    "Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Medicine & Science in Sports & Exercise, 2011",
  rotuloCurto: "Compêndio de Atividades Físicas (2011)",
  url: "https://pubmed.ncbi.nlm.nih.gov/21681120/",
  resumo:
    "mede a corda pela cadência: 8,8 METs abaixo de 100 saltos por minuto, 11,8 entre 100 e 120 e 12,3 entre 120 e 160.",
};

export const FONTES_CORDA: Fonte[] = [FONTE_COMPENDIO_CORDA, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── Os ritmos ───────────────────────── */

export type RitmoId = "lento" | "moderado" | "rapido";

export interface Ritmo {
  id: RitmoId;
  nome: string;
  met: number;
  /** Cadência típica da faixa, para estimar os saltos. */
  saltosPorMinuto: number;
  /** Quantos saltos a pessoa conta em 15 segundos. */
  em15s: string;
}

export const RITMOS: Ritmo[] = [
  { id: "lento", nome: "Lento", met: 8.8, saltosPorMinuto: 90, em15s: "até 25 saltos em 15 segundos" },
  { id: "moderado", nome: "Moderado", met: 11.8, saltosPorMinuto: 110, em15s: "de 25 a 30 saltos em 15 segundos" },
  { id: "rapido", nome: "Rápido", met: 12.3, saltosPorMinuto: 140, em15s: "mais de 30 saltos em 15 segundos" },
];

export const ritmo = (id: RitmoId): Ritmo => RITMOS.find((r) => r.id === id)!;

/** Descanso entre blocos: em pé, parado. */
export const MET_DESCANSO = 1.3;

/** Ritmo pela contagem de saltos em 15 segundos. Empate fica no ritmo menor. */
export function ritmoPelaContagem(saltosEm15s: number): RitmoId {
  const porMinuto = saltosEm15s * 4;
  if (porMinuto <= 100) return "lento";
  if (porMinuto <= 120) return "moderado";
  return "rapido";
}

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const BLOCOS_MAX = 40;
export const PULANDO_MIN = 10;
export const PULANDO_MAX = 1800;
export const DESCANSO_MAX = 300;
export const VEZES_SEMANA = [1, 2, 3, 4, 5] as const;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const blocosValidos = (b: number | null): b is number => b !== null && Number.isInteger(b) && b >= 1 && b <= BLOCOS_MAX;
export const pulandoValido = (s: number | null): s is number => s !== null && s >= PULANDO_MIN && s <= PULANDO_MAX;
export const descansoValido = (s: number | null): s is number => s !== null && s >= 0 && s <= DESCANSO_MAX;

/* ───────────────────────── Os treinos do artigo ───────────────────────── */

export interface Treino {
  id: string;
  nome: string;
  blocos: number;
  segundosPulando: number;
  segundosDescanso: number;
}

/** A progressão que o artigo `pular-corda-emagrece` descreve. */
export const TREINOS: Treino[] = [
  { id: "inicio", nome: "Semanas 1 e 2", blocos: 10, segundosPulando: 30, segundosDescanso: 60 },
  { id: "densidade", nome: "Semanas 3 e 4", blocos: 12, segundosPulando: 45, segundosDescanso: 45 },
  { id: "meta", nome: "Meta do artigo", blocos: 15, segundosPulando: 60, segundosDescanso: 45 },
];

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  blocos: number;
  minutosPulando: number;
  minutosDescanso: number;
  minutosTotais: number;
  kcalPulando: number;
  kcalDescanso: number;
  kcal: number;
  kcalLiquida: number;
  saltos: number;
}

export function calcula(pesoKg: number, r: RitmoId, blocos: number, segundosPulando: number, segundosDescanso: number): Resultado {
  const rt = ritmo(r);
  const minutosPulando = (blocos * segundosPulando) / 60;
  const minutosDescanso = (Math.max(0, blocos - 1) * segundosDescanso) / 60;
  const minutosTotais = minutosPulando + minutosDescanso;
  const kcalPulando = kcalPorMinuto(rt.met, pesoKg) * minutosPulando;
  const kcalDescanso = kcalPorMinuto(MET_DESCANSO, pesoKg) * minutosDescanso;
  const kcal = kcalPulando + kcalDescanso;
  return {
    blocos,
    minutosPulando,
    minutosDescanso,
    minutosTotais,
    kcalPulando,
    kcalDescanso,
    kcal,
    kcalLiquida: kcal - kcalPorMinuto(1, pesoKg) * minutosTotais,
    saltos: Math.round(rt.saltosPorMinuto * minutosPulando),
  };
}

/**
 * O número de revista: o MET da corda vezes o tempo de relógio, como se a
 * pessoa tivesse pulado a sessão inteira. É o que a calculadora coletiva
 * fazia.
 */
export function kcalSeFosseContinuo(pesoKg: number, r: RitmoId, minutosTotais: number): number {
  return kcalPorMinuto(ritmo(r).met, pesoKg) * minutosTotais;
}

/** Quanto custam cem saltos no ritmo escolhido. */
export function kcalPor100Saltos(pesoKg: number, r: RitmoId): number {
  const rt = ritmo(r);
  return (kcalPorMinuto(rt.met, pesoKg) / rt.saltosPorMinuto) * 100;
}

/** A meta de "mil saltos por dia" das redes. */
export const META_SALTOS = 1000;

export function kgPorMes(r: Resultado, vezes: number): number {
  return ((r.kcalLiquida * vezes) / KCAL_POR_KG_GORDURA) * (52 / 12);
}

export interface LinhaTreino {
  treino: Treino;
  minutosTotais: number;
  kcal70: number;
  kcal90: number;
}

/** Os treinos do artigo em ritmo moderado, para 70 e 90 kg. */
export function tabelaTreinos(): LinhaTreino[] {
  return TREINOS.map((t) => {
    const a = calcula(70, "moderado", t.blocos, t.segundosPulando, t.segundosDescanso);
    const b = calcula(90, "moderado", t.blocos, t.segundosPulando, t.segundosDescanso);
    return { treino: t, minutosTotais: a.minutosTotais, kcal70: arredondaKcal(a.kcal), kcal90: arredondaKcal(b.kcal) };
  });
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente na mesma corda — muda com a técnica, a altura do salto e o quanto cada uma tropeça.";

export const NOTA_BLOCOS =
  "Só o tempo pulando conta como corda. O descanso entre blocos conta como ficar em pé — é por isso que o gasto é menor que o da tabela que multiplica pelo tempo de relógio.";

export const NOTA_LINEAR =
  "A conta em quilos é linear e serve como teto: o corpo compensa parte do gasto, e o peso cai mais devagar do que ela sugere.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhum treino escolhe de onde o corpo tira gordura. A corda aumenta o gasto da semana; onde a gordura sai primeiro é decidido por genética e hormônio.";

export const NOTA_SEGURANCA =
  "A corda é alto impacto. Com dor no joelho, no tornozelo ou na canela, ou com muito peso a perder, comece pela caminhada ou pela bicicleta e converse com quem acompanha você.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção.
 *
 * O `pular-corda-emagrece` saiu do registro de link da calculadora de
 * atividades: a regra da casa é uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_CORDA: string[] = ["pular-corda-emagrece"];
