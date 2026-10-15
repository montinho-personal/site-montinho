/**
 * Calculadora de Ciclo de Carboidratos — o motor (Fase 1).
 *
 * A IDEIA EM UMA FRASE
 *
 * Ciclar carboidrato é DISTRIBUIR a mesma quantidade semanal de forma
 * diferente entre os dias: mais nos dias de treino mais exigente, menos nos
 * de descanso. Não é truque metabólico. Por isso o motor parte da média que
 * a cascata de macros do site já calcula (lib/macros — a mesma da
 * Calculadora de Macros e do Monte seu Cardápio) e só redistribui.
 *
 * O TREINO DEFINE A DEMANDA
 *
 * A pessoa informa o que faz em cada dia (tipo, duração, intensidade). Cada
 * dia vira uma pontuação interna — minutos × peso do tipo × peso da
 * intensidade — que ninguém vê. A pessoa vê só a demanda em palavras
 * (baixa, moderada, alta, muito alta) e o nível do dia (baixo, médio, alto).
 *
 * O nível é RELATIVO à semana da própria pessoa: o dia alto é o mais
 * exigente da semana dela, não o de um maratonista. E se a semana é
 * homogênea, o motor diz isso e não inventa contraste — ciclo quase plano é
 * resposta, não falha.
 *
 * CALORIAS ESTÁVEIS (o único modo da Fase 1)
 *
 * As calorias do dia ficam iguais; a proteína também. O carboidrato varia e
 * a gordura compensa, dentro de limites:
 *   - gordura nunca abaixo de 20% das calorias (piso da faixa de referência
 *     da população, AMDR/IOM) nem acima de 35% (teto da mesma faixa);
 *   - carboidrato do dia baixo nunca abaixo de 130 g (a RDA de carboidrato
 *     para adultos, IOM) quando a média permite; se a média já é menor que
 *     isso, o motor não cicla;
 *   - o dia alto nunca passa de 1,6 vez o dia baixo.
 * Os limites atuam como teto e piso, e o total da semana é preservado
 * redistribuindo o que sobra entre os dias que ainda têm folga.
 *
 * FONTES DAS FAIXAS DE CONTEXTO (mostradas como g/kg, não como meta)
 *
 * - Thomas, Erdman & Burke. Joint Position Statement ACSM/AND/DC: Nutrition
 *   and Athletic Performance. Med Sci Sports Exerc, 2016 — carboidrato de
 *   3 a 10 g/kg/dia conforme a carga de treino (até 12 em esforço extremo).
 * - Impey et al. Fuel for the Work Required. Sports Med, 2018 — a ideia de
 *   ajustar o carboidrato à demanda de cada sessão.
 * - Henselmans et al. The Effect of Carbohydrate Intake on Strength and
 *   Resistance Training Performance: A Systematic Review. Nutrients, 2022 —
 *   em musculação de volume moderado, alimentado, o carboidrato pouco muda
 *   o desempenho; volumes altos podem se beneficiar mais. É o que impede o
 *   motor de tratar todo treino de musculação como dia "alto".
 * - Institute of Medicine. Dietary Reference Intakes for Energy,
 *   Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino
 *   Acids, 2005 — RDA de 130 g de carboidrato e AMDR de gordura de 20–35%.
 */

import { calculaMacros } from "@/lib/macros";

export const KCAL_G_CARB = 4;
export const KCAL_G_PROT = 4;
export const KCAL_G_GORD = 9;

export const PESO_MIN = 35;
export const PESO_MAX = 250;
export const KCAL_MIN = 1200;
export const KCAL_MAX = 5000;

export const CARB_MIN_DIA = 130;
export const GORD_MIN_PCT = 0.2;
export const GORD_MAX_PCT = 0.35;
export const RAZAO_MAX_ALTO_BAIXO = 1.6;

// ─── Entradas ────────────────────────────────────────────────────────────────

export type Objetivo = "emagrecer" | "manter" | "ganhar" | "performance" | "organizar";

export const OBJETIVOS: { id: Objetivo; rotulo: string }[] = [
  { id: "emagrecer", rotulo: "Reduzir gordura corporal" },
  { id: "manter", rotulo: "Manter o peso" },
  { id: "ganhar", rotulo: "Ganhar massa muscular" },
  { id: "performance", rotulo: "Render mais nos treinos" },
  { id: "organizar", rotulo: "Só organizar meus carboidratos" },
];

/** Proteína de referência por objetivo, em g/kg — a mesma lógica do cardápio. */
export const PROTEINA_G_KG: Record<Objetivo, number> = {
  emagrecer: 2.0,
  ganhar: 2.0,
  manter: 1.6,
  performance: 1.6,
  organizar: 1.6,
};
/** Gordura média da semana, em % das calorias: o padrão da Calculadora de Macros. */
export const GORDURA_MEDIA_PCT = 30;

export type Tipo = "musculacao" | "corrida" | "ciclismo" | "esporte" | "misto" | "outro";
export type Intensidade = "leve" | "moderado" | "pesado" | "muito-pesado";

export const TIPOS: { id: Tipo; rotulo: string }[] = [
  { id: "musculacao", rotulo: "Musculação" },
  { id: "corrida", rotulo: "Corrida" },
  { id: "ciclismo", rotulo: "Bike / ciclismo" },
  { id: "esporte", rotulo: "Esporte (futebol, tênis, luta...)" },
  { id: "misto", rotulo: "Treino misto / funcional" },
  { id: "outro", rotulo: "Outro" },
];

export const INTENSIDADES: { id: Intensidade; rotulo: string }[] = [
  { id: "leve", rotulo: "Leve" },
  { id: "moderado", rotulo: "Moderado" },
  { id: "pesado", rotulo: "Pesado" },
  { id: "muito-pesado", rotulo: "Muito pesado / alto volume" },
];

export const DURACOES = [30, 45, 60, 90, 120] as const;

export interface Sessao {
  tipo: Tipo;
  minutos: number;
  intensidade: Intensidade;
}

/** Um dia da semana. Sem sessões = descanso. */
export interface DiaEntrada {
  sessoes: Sessao[];
}

export const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;
export const DIAS_LONGOS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"] as const;

// ─── Demanda ────────────────────────────────────────────────────────────────

/**
 * Peso de cada tipo de sessão na demanda de carboidrato.
 *
 * Corrida e bike contínuas dependem mais de glicogênio por minuto que
 * musculação, que é intermitente (séries curtas e descanso). Esporte e
 * treino misto ficam no meio. São pesos editoriais, de ordem de grandeza —
 * não um "gasto de glicogênio" medido —, e por isso o resultado aparece
 * como faixa e a pontuação nunca é mostrada.
 */
export const PESO_TIPO: Record<Tipo, number> = {
  musculacao: 0.8,
  corrida: 1.0,
  ciclismo: 1.0,
  esporte: 0.9,
  misto: 0.9,
  outro: 0.7,
};
export const PESO_INTENSIDADE: Record<Intensidade, number> = {
  leve: 0.6,
  moderado: 1.0,
  pesado: 1.3,
  "muito-pesado": 1.6,
};

export const pontuaSessao = (s: Sessao) => Math.max(0, s.minutos) * PESO_TIPO[s.tipo] * PESO_INTENSIDADE[s.intensidade];
export const pontuaDia = (d: DiaEntrada) => d.sessoes.reduce((t, s) => t + pontuaSessao(s), 0);

export type Demanda = "baixa" | "moderada" | "alta" | "muito-alta";
export const NOME_DEMANDA: Record<Demanda, string> = { baixa: "Baixa", moderada: "Moderada", alta: "Alta", "muito-alta": "Muito alta" };

/**
 * A demanda em palavras, por faixas absolutas. Referências: 60 min de
 * musculação moderada = 48 (moderada); 75 min pesada = 78 (alta); 90 min
 * de corrida moderada = 90 (alta); 2 h = 120 (muito alta).
 */
export function demandaDe(pontos: number): Demanda {
  if (pontos < 30) return "baixa";
  if (pontos < 75) return "moderada";
  if (pontos < 115) return "alta";
  return "muito-alta";
}

export type Nivel = "baixo" | "medio" | "alto";
export const NOME_NIVEL: Record<Nivel, string> = { baixo: "Baixo", medio: "Médio", alto: "Alto" };
export const PESO_NIVEL: Record<Nivel, number> = { baixo: 0.8, medio: 1.0, alto: 1.2 };

/** Diferença mínima de pontuação na semana para valer a pena ciclar. */
export const DIFERENCA_MIN_PARA_CICLAR = 30;

/**
 * O nível de cada dia, relativo à semana da pessoa.
 *
 * - descanso é sempre baixo;
 * - quem chega a 2/3 da pontuação do dia mais exigente é alto;
 * - quem fica abaixo de 1/3 dela é baixo;
 * - o resto é médio.
 * Se a diferença entre o dia mais e o menos exigente for pequena, a semana
 * é homogênea e todos os dias ficam médios.
 */
export function niveisSugeridos(pontos: number[]): { niveis: Nivel[]; homogenea: boolean } {
  const max = Math.max(...pontos);
  const min = Math.min(...pontos);
  if (max - min < DIFERENCA_MIN_PARA_CICLAR) return { niveis: pontos.map(() => "medio"), homogenea: true };
  const niveis = pontos.map<Nivel>((p) => {
    if (p === 0) return "baixo";
    if (p >= max * (2 / 3)) return "alto";
    if (p <= max / 3) return "baixo";
    return "medio";
  });
  return { niveis, homogenea: false };
}

// ─── Distribuição ───────────────────────────────────────────────────────────

export interface Base {
  kcal: number;
  pesoKg: number;
  objetivo: Objetivo;
}

export interface DiaResultado {
  pontos: number;
  demanda: Demanda;
  nivel: Nivel;
  /** O nível que o motor sugeriria; difere de `nivel` quando a pessoa editou. */
  nivelSugerido: Nivel;
  carb: number;
  carbFaixa: [number, number];
  prot: number;
  gord: number;
  kcal: number;
}

export interface Resultado {
  dias: DiaResultado[];
  media: { carb: number; prot: number; gord: number; kcal: number };
  totalSemana: { carb: number; kcal: number };
  homogenea: boolean;
  /** A média de carboidrato já era baixa demais para ciclar. */
  semCiclo: boolean;
  /** Algum limite de segurança segurou a distribuição. */
  limitado: boolean;
  avisos: string[];
  impossivel: boolean;
}

const r5 = (n: number) => Math.round(n / 5) * 5;

/**
 * Distribui um total semanal de carboidrato por pesos, respeitando piso e
 * teto por dia. Redistribuição iterativa: quem bate no limite fica preso
 * nele, e o que sobrou (ou faltou) vai para os outros na mesma proporção.
 * O total da semana é preservado sempre que os limites permitem.
 */
export function distribui(total: number, pesos: number[], piso: number[], teto: number[]): { valores: number[]; limitado: boolean } {
  const n = pesos.length;
  const valores = new Array<number>(n).fill(0);
  const preso = new Array<boolean>(n).fill(false);
  let limitado = false;
  for (let it = 0; it < 2 * n + 2; it++) {
    const livres = pesos.map((_, i) => i).filter((i) => !preso[i]);
    if (livres.length === 0) break;
    const jaPreso = valores.reduce((t, v, i) => (preso[i] ? t + v : t), 0);
    const somaPesos = livres.reduce((t, i) => t + pesos[i], 0);
    const resto = total - jaPreso;
    let mudou = false;
    for (const i of livres) {
      const v = somaPesos > 0 ? (resto * pesos[i]) / somaPesos : resto / livres.length;
      valores[i] = v;
    }
    /**
     * Um lado por vez: prender teto e piso na mesma rodada faria o total
     * escapar (o que sai do dia alto não chegaria aos baixos). Primeiro os
     * que estouraram o teto; só quando nenhum estoura, os que ficaram abaixo
     * do piso.
     */
    const acima = livres.filter((i) => valores[i] > teto[i] + 1e-9);
    const abaixo = acima.length > 0 ? [] : livres.filter((i) => valores[i] < piso[i] - 1e-9);
    for (const i of acima) { valores[i] = teto[i]; preso[i] = true; mudou = true; }
    for (const i of abaixo) { valores[i] = piso[i]; preso[i] = true; mudou = true; }
    if (mudou) limitado = true;
    if (!mudou) break;
  }
  return { valores, limitado };
}

export function calculaCiclo(base: Base, semana: DiaEntrada[], niveisEditados?: (Nivel | null)[]): Resultado {
  const macros = calculaMacros(base.kcal, base.pesoKg, PROTEINA_G_KG[base.objetivo], GORDURA_MEDIA_PCT);
  const pontos = semana.map(pontuaDia);
  const sug = niveisSugeridos(pontos);
  const niveis = sug.niveis.map((n, i) => niveisEditados?.[i] ?? n);
  const avisos: string[] = [];

  if (macros.impossivel) {
    return {
      dias: [], media: { carb: 0, prot: 0, gord: 0, kcal: 0 }, totalSemana: { carb: 0, kcal: 0 },
      homogenea: sug.homogenea, semCiclo: true, limitado: false, impossivel: true,
      avisos: ["Com essas calorias, a proteína e a gordura de referência já ocupam a meta inteira e não sobra carboidrato para distribuir. Confira as calorias ou procure orientação individual."],
    };
  }

  const prot = Math.round(macros.proteina.gramas);
  const carbMedia = macros.carboidrato.gramas;
  const kcal = base.kcal;
  const carbTotal = carbMedia * 7;

  /** Limites de carboidrato por dia que vêm da gordura (calorias estáveis). */
  const carbParaGordura = (pct: number) => (kcal - prot * KCAL_G_PROT - kcal * pct) / KCAL_G_CARB;
  const tetoPorGordura = carbParaGordura(GORD_MIN_PCT);
  const pisoPorGordura = carbParaGordura(GORD_MAX_PCT);

  const semCiclo = carbMedia < CARB_MIN_DIA;
  let valores: number[];
  let limitado = false;
  if (semCiclo) {
    valores = semana.map(() => carbMedia);
    avisos.push("Com essas calorias, o carboidrato médio já fica abaixo de 130 g por dia. Ciclar deixaria os dias leves baixos demais, então todos os dias ficaram iguais.");
  } else {
    const pisoDia = Math.max(CARB_MIN_DIA, pisoPorGordura);
    const pesos = niveis.map((n) => PESO_NIVEL[n]);
    /**
     * O teto do dia alto respeita a gordura mínima e a razão máxima em
     * relação ao piso do dia baixo; o piso do dia baixo respeita os 130 g e
     * a gordura máxima. Dias médios ficam entre os dois.
     */
    const piso = niveis.map(() => Math.min(pisoDia, carbMedia));
    const teto = niveis.map(() => Math.max(carbMedia, Math.min(tetoPorGordura, pisoDia * RAZAO_MAX_ALTO_BAIXO)));
    const d = distribui(carbTotal, pesos, piso, teto);
    valores = d.valores;
    limitado = d.limitado;
    /** A razão final entre o maior e o menor dia também fica limitada. */
    const maior = Math.max(...valores), menor = Math.min(...valores);
    if (menor > 0 && maior / menor > RAZAO_MAX_ALTO_BAIXO + 1e-9) {
      const d2 = distribui(carbTotal, pesos, piso, valores.map(() => menor * RAZAO_MAX_ALTO_BAIXO));
      valores = d2.valores;
      limitado = true;
    }
  }

  const dias: DiaResultado[] = valores.map((c, i) => {
    const carb = r5(c);
    const gord = Math.max(0, Math.round((kcal - prot * KCAL_G_PROT - carb * KCAL_G_CARB) / KCAL_G_GORD));
    return {
      pontos: pontos[i],
      demanda: demandaDe(pontos[i]),
      nivel: semCiclo ? "medio" : niveis[i],
      nivelSugerido: semCiclo ? "medio" : sug.niveis[i],
      carb,
      carbFaixa: [r5(c * 0.93), r5(c * 1.07)],
      prot,
      gord,
      kcal: prot * KCAL_G_PROT + carb * KCAL_G_CARB + gord * KCAL_G_GORD,
    };
  });

  const soma = (k: "carb" | "prot" | "gord" | "kcal") => dias.reduce((t, d) => t + d[k], 0);
  const media = {
    carb: Math.round(soma("carb") / 7),
    prot: Math.round(soma("prot") / 7),
    gord: Math.round(soma("gord") / 7),
    kcal: Math.round(soma("kcal") / 7),
  };

  const minutosSemana = semana.reduce((t, d) => t + d.sessoes.reduce((s, x) => s + x.minutos, 0), 0);
  /**
   * Energia muito baixa para a carga de treino. Não é diagnóstico de nada:
   * é o sinal de que tirar MAIS carboidrato nos dias leves não é o caminho.
   */
  if (base.kcal / base.pesoKg < 25 && minutosSemana >= 300) {
    avisos.push("Suas calorias estão baixas para o volume de treino informado. Uma ingestão de energia muito baixa em relação ao treino pode ser inadequada: vale buscar avaliação individual antes de reduzir mais.");
  }
  if (niveis.some((n, i) => n === "alto" && pontos[i] === 0)) {
    avisos.push("Você marcou um dia de descanso como alto. Pode organizar assim por preferência, embora a demanda de treino nesse dia seja menor.");
  }

  return {
    dias,
    media,
    totalSemana: { carb: soma("carb"), kcal: soma("kcal") },
    homogenea: sug.homogenea && !niveisEditados?.some((n) => n !== null && n !== undefined),
    semCiclo,
    limitado,
    avisos,
    impossivel: false,
  };
}

/** g/kg com uma casa, para quem quer comparar com as faixas da literatura. */
export const gPorKg = (g: number, pesoKg: number) => (pesoKg > 0 ? Math.round((g / pesoKg) * 10) / 10 : 0);

/** Próximo nível ao tocar no dia: baixo → médio → alto → baixo. */
export const proximoNivel = (n: Nivel): Nivel => (n === "baixo" ? "medio" : n === "medio" ? "alto" : "baixo");

// ─── Textos ─────────────────────────────────────────────────────────────────

export const FRASE_CENTRAL = "Seu treino não exige a mesma quantidade de combustível todos os dias. Seu carboidrato também não precisa ser igual.";

export const NOTA_BALANCO =
  "O ciclo não substitui o balanço energético: o que decide o emagrecimento ou o ganho é a média da semana. Aqui as calorias do dia ficam iguais; o carboidrato muda de lugar e a gordura compensa.";

export const DISCLAIMER =
  "Os valores são estimativas educacionais e não substituem avaliação nutricional individual.";

export const EXPLICA_NIVEL: Record<Nivel, string> = {
  alto: "Mais carboidrato disponível no dia em que o treino pede mais combustível.",
  medio: "Nível intermediário, para treinos de demanda moderada.",
  baixo: "Menos carboidrato no dia de menor demanda. Não é dia de jejum nem de \"queimar gordura\": é só onde o combustível é menos necessário.",
};

/** Os artigos que recebem o convite para a ferramenta. */
export const ARTIGOS_COM_LINK_CICLO: string[] = [
  "ciclo-de-carboidratos-carb-cycling",
  "treino-low-carb-musculacao",
];
