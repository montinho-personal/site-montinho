/**
 * O motor da Calculadora de Calorias da Musculação.
 *
 * POR QUE ESTA FERRAMENTA EXISTE
 *
 * "Musculação queima quantas calorias" tem autocompletar por tempo (20, 30,
 * 40, 50, 60 minutos, 1h30, 2 horas) e o site não tinha a conta. É a
 * atividade dos alunos do Montinho, e "calcular gasto calórico musculação"
 * apareceu nas buscas relacionadas da calculadora de atividades.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * O MET vem do Compêndio de Atividades Físicas (2024), que mede a sessão
 * inteira, com as pausas entre séries dentro. Três entradas, conferidas:
 *   - treino de força com vários exercícios, 8 a 15 repetições: 3,5 METs;
 *   - agachamento e terra, lento ou explosivo: 5,0 METs;
 *   - circuito com superséries alternadas: 5,8 METs.
 * Não existe entrada separada por "descanso curto" ou "descanso longo": o
 * descanso muda o tipo de sessão, e é isso que a pessoa escolhe aqui.
 *
 * O EPOC
 *
 * O gasto depois do treino existe, mas é pequeno perto da sessão. A
 * ferramenta não soma nada por ele: dizer "queima por 48 horas" sem
 * número é o que as páginas concorrentes fazem, e não vamos repetir.
 */

import {
  FONTE_HALL,
  KCAL_POR_KG_GORDURA,
  arredondaKcal,
  formataTempo,
  kcalPorMinuto,
  parseNumero,
  type Fonte,
} from "./polichinelo";
import { ritmo as ritmoCaminhada, metCaminhada } from "./caminhada";
import { metCorrida } from "./corrida";

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, KCAL_POR_KG_GORDURA, FONTE_HALL };

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_COMPENDIO_MUSCULACAO: Fonte = {
  rotulo:
    "Herrmann SD, Willis EA, Ainsworth BE, et al. 2024 Adult Compendium of Physical Activities. Journal of Sport and Health Science, 2024",
  rotuloCurto: "Compêndio de Atividades Físicas (2024)",
  url: "https://pacompendium.com/conditioning-exercise/",
  resumo:
    "lista o treino de força com vários exercícios (8 a 15 repetições) em 3,5 METs, agachamento e levantamento terra em 5,0 METs e o circuito com superséries alternadas em 5,8 METs.",
};

export const FONTES_MUSCULACAO: Fonte[] = [FONTE_COMPENDIO_MUSCULACAO, FONTE_HALL];

/* ───────────────────────── Tipo de treino ───────────────────────── */

export type TipoId = "tradicional" | "pesado" | "circuito";

export interface Tipo {
  id: TipoId;
  nome: string;
  met: number;
  comoReconhecer: string;
  origem: string;
}

/** Conferidos no Compêndio 2024. O teste `scripts/musculacao-test.ts` trava estes valores. */
export const TIPOS: Tipo[] = [
  {
    id: "tradicional",
    nome: "Tradicional",
    met: 3.5,
    comoReconhecer: "Vários exercícios, séries de 8 a 15 repetições e descanso de 1 a 2 minutos. É o treino da maioria das pessoas.",
    origem: "treino de força com vários exercícios, 8 a 15 repetições, no Compêndio de Atividades Físicas",
  },
  {
    id: "pesado",
    nome: "Pesado (agachamento, terra)",
    met: 5.0,
    comoReconhecer: "Treino centrado em exercícios grandes como agachamento e levantamento terra, com carga alta.",
    origem: "agachamento e levantamento terra no Compêndio de Atividades Físicas",
  },
  {
    id: "circuito",
    nome: "Circuito / superséries",
    met: 5.8,
    comoReconhecer: "Exercícios emendados, quase sem pausa, alternando grupos musculares. Você termina ofegante.",
    origem: "circuito de força com superséries alternadas no Compêndio de Atividades Físicas",
  },
];

export const TIPO_PADRAO: TipoId = "tradicional";

export function tipo(id: TipoId): Tipo {
  return TIPOS.find((t) => t.id === id) ?? TIPOS[0];
}

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;
export const MINUTOS_MIN = 1;
export const MINUTOS_MAX = 300;
export const KCAL_MIN = 10;
export const KCAL_MAX = 3000;

/** Os atalhos saíram do autocompletar: 20, 30, 40, 50 e 60 minutos, 1h30 e 2 horas. */
export const PRESETS_MINUTOS = [20, 30, 40, 50, 60, 90, 120] as const;

/** Acima disso a ferramenta avisa: mais de 2 horas de musculação por dia raramente vira mais resultado. */
export const MINUTOS_ALERTA = 120;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const minutosValidos = (m: number | null): m is number => m !== null && m >= MINUTOS_MIN && m <= MINUTOS_MAX;
export const kcalValida = (k: number | null): k is number => k !== null && k >= KCAL_MIN && k <= KCAL_MAX;

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

/** O que o treino acrescenta ao que a pessoa gastaria parada (1 MET). */
export function kcalLiquida(r: Resultado, pesoKg: number): number {
  return r.kcal - kcalPorMinuto(1, pesoKg) * r.minutos;
}

/* ───────────────────────── Comparação com cardio ───────────────────────── */

export interface LinhaComparacao {
  id: string;
  nome: string;
  met: number;
  kcal: number;
}

/** A corrida vem do motor da Calculadora de Pace (equação da ACSM), a 8 km/h. */
const MET_CORRIDA_8 = metCorrida(8);

/**
 * O mesmo tempo e o mesmo peso em cardio. A caminhada vem do motor da
 * Calculadora de Calorias da Caminhada, nunca de um valor recopiado.
 */
export function comparaComCardio(minutos: number, pesoKg: number): LinhaComparacao[] {
  const cam = ritmoCaminhada("moderado");
  const metCam = metCaminhada(cam.velocidade, 0);
  return [
    ...TIPOS.map((t) => ({ id: `musc-${t.id}`, nome: { tradicional: "Musculação tradicional", pesado: "Musculação pesada (agachamento, terra)", circuito: "Musculação em circuito / superséries" }[t.id], met: t.met, kcal: kcalPorMinuto(t.met, pesoKg) * minutos })),
    { id: "caminhada", nome: "Caminhada moderada (5 km/h)", met: metCam, kcal: kcalPorMinuto(metCam, pesoKg) * minutos },
    { id: "corrida", nome: "Corrida a 8 km/h", met: MET_CORRIDA_8, kcal: kcalPorMinuto(MET_CORRIDA_8, pesoKg) * minutos },
  ].sort((a, b) => b.kcal - a.kcal);
}

/* ───────────────────────── Tabelas estáticas ───────────────────────── */

export const PESOS_TABELA = [50, 60, 70, 80, 90, 100, 120] as const;
export const TEMPOS_TABELA = [20, 30, 40, 50, 60, 90, 120] as const;

export interface Linha {
  chave: number;
  tradicional: number;
  pesado: number;
  circuito: number;
}

const linha = (chave: number, minutos: number, peso: number): Linha => ({
  chave,
  tradicional: arredondaKcal(deTempo(minutos, peso, tipo("tradicional").met).kcal),
  pesado: arredondaKcal(deTempo(minutos, peso, tipo("pesado").met).kcal),
  circuito: arredondaKcal(deTempo(minutos, peso, tipo("circuito").met).kcal),
});

export const tabelaPorPeso = (minutos: number): Linha[] => PESOS_TABELA.map((p) => linha(p, minutos, p));
export const tabelaPorTempo = (pesoKg: number): Linha[] => TEMPOS_TABELA.map((m) => linha(m, m, pesoKg));

export function simulacaoUmQuilo(pesoKg: number, met: number): Resultado {
  return deKcal(KCAL_POR_KG_GORDURA, pesoKg, met);
}

export function fraseContexto(pesoKg: number, r: Resultado, nomeTipo: string): string {
  const peso = pesoKg.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  return (
    `Para uma pessoa de ${peso} kg, ${formataTempo(r.minutos)} de musculação no estilo ` +
    `${nomeTipo.toLowerCase()} representam um gasto estimado de aproximadamente ${arredondaKcal(r.kcal)} kcal.`
  );
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente no mesmo treino: muda com a carga, o tamanho dos exercícios, o descanso e o condicionamento.";

export const NOTA_BRUTO =
  "O número é bruto e já inclui as pausas entre as séries, como o Compêndio mediu. O que o treino acrescenta ao seu dia é um pouco menor.";

export const NOTA_EPOC =
  "O corpo gasta um pouco mais nas horas seguintes ao treino, mas é pouco perto da sessão. A conta não soma nada por isso, para não inflar o número.";

export const NOTA_VOLUME_ALTO =
  "Mais de 2 horas de musculação raramente vira mais resultado. Um treino de 45 a 75 minutos bem feito, com a carga subindo ao longo das semanas, costuma render mais.";

export const NOTA_SEGURANCA =
  "Se você sente dor nas articulações, tem pressão alta ou alguma condição cardiovascular, comece com cargas leves e converse com quem acompanha você.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Treinar abdômen não tira gordura da barriga. A musculação aumenta o gasto e protege o músculo; onde a gordura sai primeiro é decidido por genética e hormônio.";

/* ───────────────────────── Artigos ───────────────────────── */

export const ARTIGOS_COM_CALCULADORA_MUSCULACAO: string[] = [];
