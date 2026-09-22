/**
 * O motor da Calculadora de Calorias do Elíptico.
 *
 * POR QUE ESTA FERRAMENTA EXISTE
 *
 * O `eliptico-emagrece` tem cerca de 1.200 impressões em 90 dias e as
 * buscas que chegam nele pedem número: "20 minutos de elíptico queima
 * quantas calorias" (a consulta mais frequente do artigo), "10 minutos",
 * "30 minutos", "quanto tempo de elíptico para emagrecer". O site já está
 * na posição ~10 para elas — é a atividade mais perto da primeira página.
 * O artigo responde com uma tabela para 70 e 90 kg; quem pesa 58 ou 104
 * fica sem resposta.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * O MET vem do Compêndio de Atividades Físicas (2024), que tem DUAS
 * entradas para o elíptico: esforço moderado e esforço vigoroso. Não
 * existe entrada de esforço leve — e esta calculadora não inventa uma.
 * O elíptico também não tem equação metabólica própria na ACSM (como a
 * caminhada tem), então velocidade e resistência não entram na conta: o
 * que muda o número é o esforço percebido, que é como o Compêndio mediu.
 *
 * O VISOR
 *
 * A pergunta "as calorias do visor são confiáveis?" existe no artigo e nas
 * buscas. A ferramenta compara o número do visor com a estimativa, sem
 * afirmar que um dos dois é o verdadeiro: os dois são estimativas, e o
 * visor muitas vezes nem sabe o seu peso.
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
import { ritmo as ritmoCaminhada, metCaminhada, type RitmoId } from "./caminhada";

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, KCAL_POR_KG_GORDURA, FONTE_HALL };

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_COMPENDIO_ELIPTICO: Fonte = {
  rotulo:
    "Herrmann SD, Willis EA, Ainsworth BE, et al. 2024 Adult Compendium of Physical Activities. Journal of Sport and Health Science, 2024",
  rotuloCurto: "Compêndio de Atividades Físicas (2024)",
  url: "https://pacompendium.com/conditioning-exercise/",
  resumo:
    "lista o elíptico em duas entradas de exercício de condicionamento: esforço moderado e esforço vigoroso. Não há entrada de esforço leve.",
};

export const FONTES_ELIPTICO: Fonte[] = [FONTE_COMPENDIO_ELIPTICO, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── Esforço ───────────────────────── */

export type EsforcoId = "moderado" | "vigoroso";

export interface Esforco {
  id: EsforcoId;
  nome: string;
  met: number;
  comoReconhecer: string;
  origem: string;
}

/**
 * Os dois esforços do Compêndio, copiados.
 *
 * ATENÇÃO — conferir na fonte antes de publicar: os dois METs abaixo foram
 * reunidos por fontes secundárias que divergem entre si, porque o
 * Compêndio não estava acessível no momento da escrita. O teste
 * `scripts/eliptico-test.ts` trava estes valores; mudar aqui exige mudar lá.
 */
export const ESFORCOS: Esforco[] = [
  {
    id: "moderado",
    nome: "Moderado",
    met: 5.0,
    comoReconhecer: "Dá para falar frases, com pausas para respirar. É o jeito como a maioria usa o aparelho.",
    origem: "elíptico, esforço moderado, no Compêndio de Atividades Físicas",
  },
  {
    id: "vigoroso",
    nome: "Vigoroso",
    met: 9.0,
    comoReconhecer: "Só palavras soltas. Resistência alta ou passada rápida — não se sustenta por muito tempo.",
    origem: "elíptico, esforço vigoroso, no Compêndio de Atividades Físicas",
  },
];

export const ESFORCO_PADRAO: EsforcoId = "moderado";

export function esforco(id: EsforcoId): Esforco {
  return ESFORCOS.find((e) => e.id === id) ?? ESFORCOS[0];
}

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;
export const MINUTOS_MIN = 1;
export const MINUTOS_MAX = 300;
export const KCAL_MIN = 10;
export const KCAL_MAX = 3000;
export const VISOR_MIN = 1;
export const VISOR_MAX = 5000;

/** Os atalhos saíram das buscas: 10, 20 e 30 minutos são as que aparecem. */
export const PRESETS_MINUTOS = [10, 20, 30, 40, 45, 60] as const;

/** Acima disso a ferramenta avisa: mais de 90 minutos de elíptico como meta diária não sobrevive. */
export const MINUTOS_ALERTA = 90;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const minutosValidos = (m: number | null): m is number => m !== null && m >= MINUTOS_MIN && m <= MINUTOS_MAX;
export const kcalValida = (k: number | null): k is number => k !== null && k >= KCAL_MIN && k <= KCAL_MAX;
export const visorValido = (v: number | null): v is number => v !== null && v >= VISOR_MIN && v <= VISOR_MAX;

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  minutos: number;
  kcal: number;
  met: number;
}

export function deTempo(minutos: number, pesoKg: number, met: number): Resultado {
  return { minutos, kcal: kcalPorMinuto(met, pesoKg) * minutos, met };
}

export function deKcal(alvoKcal: number, pesoKg: number, met: number): Resultado {
  const porMin = kcalPorMinuto(met, pesoKg);
  return { minutos: porMin > 0 ? alvoKcal / porMin : 0, kcal: alvoKcal, met };
}

/** O que o exercício acrescenta ao que a pessoa gastaria parada (1 MET). */
export function kcalLiquida(r: Resultado, pesoKg: number): number {
  return r.kcal - kcalPorMinuto(1, pesoKg) * r.minutos;
}

/**
 * O visor contra a estimativa. Devolve a diferença percentual do visor em
 * relação à conta (positivo = visor acima). Não diz quem está certo.
 */
export function comparaVisor(visorKcal: number, estimativaKcal: number): number {
  return estimativaKcal > 0 ? ((visorKcal - estimativaKcal) / estimativaKcal) * 100 : 0;
}

/** Faixa em que a diferença é ruído de estimativa, não sinal. */
export const VISOR_TOLERANCIA_PCT = 15;

export type LeituraVisor = "parecido" | "acima" | "abaixo";

export function leituraVisor(diffPct: number): LeituraVisor {
  if (Math.abs(diffPct) <= VISOR_TOLERANCIA_PCT) return "parecido";
  return diffPct > 0 ? "acima" : "abaixo";
}

/* ───────────────────────── Comparação com a esteira ───────────────────────── */

export interface LinhaComparacao {
  id: string;
  nome: string;
  met: number;
  kcal: number;
}

/**
 * O mesmo tempo, o mesmo peso, em atividades vizinhas. A caminhada vem do
 * motor da Calculadora de Calorias da Caminhada — o mesmo número que a
 * pessoa veria lá, nunca um valor recopiado.
 */
export function comparaComEsteira(minutos: number, pesoKg: number): LinhaComparacao[] {
  const cam = (id: RitmoId, incl: number, nome: string) => {
    const r = ritmoCaminhada(id);
    const met = metCaminhada(r.velocidade, incl);
    return { id: `caminhada-${id}-${incl}`, nome, met, kcal: kcalPorMinuto(met, pesoKg) * minutos };
  };
  return [
    ...ESFORCOS.map((e) => ({ id: `eliptico-${e.id}`, nome: `Elíptico ${e.nome.toLowerCase()}`, met: e.met, kcal: kcalPorMinuto(e.met, pesoKg) * minutos })),
    cam("moderado", 0, "Caminhada moderada (5 km/h)"),
    cam("rapido", 0, "Caminhada rápida (6 km/h)"),
    cam("moderado", 10, "Esteira a 5 km/h com 10% de inclinação"),
  ].sort((a, b) => b.kcal - a.kcal);
}

/* ───────────────────────── Tabelas estáticas ───────────────────────── */

export const PESOS_TABELA = [50, 60, 70, 80, 90, 100, 120] as const;
export const TEMPOS_TABELA = [10, 20, 30, 45, 60] as const;

export interface LinhaPeso {
  peso: number;
  moderado: number;
  vigoroso: number;
}

export function tabelaPorPeso(minutos: number): LinhaPeso[] {
  return PESOS_TABELA.map((peso) => ({
    peso,
    moderado: arredondaKcal(deTempo(minutos, peso, esforco("moderado").met).kcal),
    vigoroso: arredondaKcal(deTempo(minutos, peso, esforco("vigoroso").met).kcal),
  }));
}

export interface LinhaTempo {
  minutos: number;
  moderado: number;
  vigoroso: number;
}

export function tabelaPorTempo(pesoKg: number): LinhaTempo[] {
  return TEMPOS_TABELA.map((minutos) => ({
    minutos,
    moderado: arredondaKcal(deTempo(minutos, pesoKg, esforco("moderado").met).kcal),
    vigoroso: arredondaKcal(deTempo(minutos, pesoKg, esforco("vigoroso").met).kcal),
  }));
}

export function simulacaoUmQuilo(pesoKg: number, met: number): Resultado {
  return deKcal(KCAL_POR_KG_GORDURA, pesoKg, met);
}

export function fraseContexto(pesoKg: number, r: Resultado, nomeEsforco: string): string {
  const peso = pesoKg.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  return (
    `Para uma pessoa de ${peso} kg, uma sessão de ${formataTempo(r.minutos)} de elíptico em esforço ` +
    `${nomeEsforco.toLowerCase()} representa um gasto estimado de aproximadamente ${arredondaKcal(r.kcal)} kcal.`
  );
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente no mesmo aparelho — muda com resistência, passada, uso dos braços e condicionamento.";

export const NOTA_BRUTO =
  "O número é bruto: inclui o que você gastaria parado nesse tempo. O que a sessão acrescenta ao seu dia é um pouco menor.";

export const NOTA_VOLUME_ALTO =
  "Esse tempo seria pouco prático como meta diária. Distribuir o gasto entre cardio, musculação e o movimento do dia costuma render mais e durar mais semanas.";

export const NOTA_SEGURANCA =
  "Se você sente dor no joelho, no quadril ou na lombar, ou tem alguma condição cardiovascular, comece com resistência baixa e sessões curtas, e converse com quem acompanha você.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhum aparelho escolhe de onde o corpo tira gordura. O elíptico aumenta o gasto do dia; onde a gordura sai primeiro é decidido por genética e hormônio.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção —
 * "Quantas calorias o elíptico gasta?", onde o artigo dá a tabela para 70
 * e 90 kg e quem lê quer a conta dele.
 *
 * O `eliptico-emagrece` estava no registro de LINK da calculadora de FC.
 * Saiu de lá: as buscas que trazem gente a ele são de caloria, não de
 * batimento, e a regra é uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_ELIPTICO: string[] = ["eliptico-emagrece"];
