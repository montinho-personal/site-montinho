/**
 * O comparador de atividades: qual queima mais calorias?
 *
 * O QUE ESTA PÁGINA VIROU
 *
 * A Calculadora de Calorias por Atividade nasceu em setembro de 2026 com
 * dez esportes num seletor, para não criar dez páginas iguais com o MET
 * trocado. Um a um, cada esporte ganhou uma conta que os outros não
 * tinham — o revezamento do futebol, os rounds do boxe, os watts do
 * spinning, os blocos da corda, os andares da escada, a velocidade e as
 * paradas da bicicleta — e saiu para uma calculadora própria. A última a
 * sair foi a bicicleta.
 *
 * Ficou a pergunta que nenhuma calculadora individual responde: QUAL
 * QUEIMA MAIS? É a busca genérica ("qual exercício gasta mais calorias"),
 * e ela precisa de todas as atividades lado a lado, no mesmo tempo, com
 * o mesmo peso. É isso que esta página faz agora — e cada linha aponta
 * para a calculadora que faz a conta completa daquela atividade.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 * Nenhum MET mora aqui. Cada linha importa o valor da calculadora própria
 * da atividade, no ritmo que a representa, para que o comparador nunca
 * discorde da ferramenta que ele aponta. `scripts/atividades-test.ts`
 * confere linha por linha.
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 */

import {
  FONTE_ACSM,
  FONTE_HALL,
  INTENSIDADES as INTENSIDADES_POLICHINELO,
  KCAL_POR_KG_GORDURA,
  arredondaKcal,
  formataTempo,
  kcalPorMinuto,
  parseNumero,
  type Fonte,
} from "./polichinelo";
import { metCorrida } from "./corrida";
import { RITMOS as RITMOS_CAMINHADA } from "./caminhada";
import { FAIXAS_RUA } from "./bicicleta";
import { ESFORCOS as ESFORCOS_ELIPTICO } from "./eliptico";
import { MET_AULA as MET_AULA_SPINNING } from "./spinning";
import { JOGOS } from "./futebol";
import { AULAS as AULAS_BOXE } from "./boxe";
import { MET_ALTO as MET_ZUMBA_SALTO } from "./zumba";
import { ESTILOS as ESTILOS_DANCA } from "./danca";
import { NADOS } from "./natacao";
import { MET_ROLA } from "./jiujitsu";
import { RITMOS as RITMOS_CORDA } from "./corda";
import { RITMOS as RITMOS_ESCADA } from "./escada";
import { MET_WOD } from "./crossfit";

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, KCAL_POR_KG_GORDURA, FONTE_HALL, FONTE_ACSM };
export type { Fonte };

export const FONTE_COMPENDIO_ATIVIDADES: Fonte = {
  rotulo:
    "Herrmann SD, Willis EA, Ainsworth BE, et al. 2024 Adult Compendium of Physical Activities. Journal of Sport and Health Science, 2024",
  rotuloCurto: "Compêndio de Atividades Físicas (2024)",
  url: "https://pacompendium.com/adult-compendium/",
  resumo:
    "reúne o custo energético medido de centenas de atividades em METs, por esporte e por faixa de esforço. É a fonte dos valores de cada calculadora que este comparador reúne.",
};

export const FONTES_ATIVIDADES: Fonte[] = [FONTE_COMPENDIO_ATIVIDADES, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── As atividades comparadas ───────────────────────── */

export interface AtividadeComparada {
  id: string;
  /** Como a pessoa chama. */
  nome: string;
  /** O ritmo que representa a atividade na comparação. */
  ritmo: string;
  met: number;
  href: string;
  /** O que a calculadora própria faz que o comparador não faz. */
  oQueTem: string;
}

const pega = <T extends { id: string }>(lista: readonly T[], id: string): T => {
  const x = lista.find((i) => i.id === id);
  if (!x) throw new Error(`comparador: ritmo "${id}" não existe`);
  return x;
};

/** Corrida a 10 km/h, pela equação da ACSM que a calculadora de corrida usa. */
export const VELOCIDADE_CORRIDA = 10;

export const COMPARADOR: AtividadeComparada[] = [
  { id: "corrida", nome: "Corrida", ritmo: `${VELOCIDADE_CORRIDA} km/h`, met: metCorrida(VELOCIDADE_CORRIDA), href: "/ferramentas/calculadora-corrida", oQueTem: "pace, tempo de prova e a comparação com caminhar a mesma distância" },
  { id: "corda", nome: "Pular corda", ritmo: "ritmo moderado", met: pega(RITMOS_CORDA, "moderado").met, href: "/ferramentas/calculadora-calorias-pular-corda", oQueTem: "os blocos de pulo e descanso, e quantos saltos foram" },
  { id: "jiujitsu", nome: "Jiu-jitsu", ritmo: "no rola", met: MET_ROLA, href: "/ferramentas/calculadora-calorias-jiu-jitsu", oQueTem: "a técnica separada dos rolas" },
  { id: "escada", nome: "Subir escada", ritmo: "ritmo de treino", met: pega(RITMOS_ESCADA, "treino").met, href: "/ferramentas/calculadora-calorias-escada", oQueTem: "os andares, a descida e o que trocar o elevador rende no mês" },
  { id: "spinning", nome: "Spinning", ritmo: "aula", met: MET_AULA_SPINNING, href: "/ferramentas/calculadora-calorias-spinning", oQueTem: "a potência em watts que a bike mostra" },
  { id: "bicicleta", nome: "Bicicleta na rua", ritmo: "19 a 22 km/h", met: FAIXAS_RUA.find((f) => f.codigo === "01030")!.met, href: "/ferramentas/calculadora-calorias-bicicleta", oQueTem: "a velocidade, as paradas no semáforo e a ida e volta do trabalho" },
  { id: "crossfit", nome: "CrossFit", ritmo: "no WOD", met: MET_WOD, href: "/ferramentas/calculadora-calorias-crossfit", oQueTem: "aquecimento, força e WOD somados, pelo formato do WOD" },
  { id: "danca", nome: "Dança", ritmo: "forró", met: pega(ESTILOS_DANCA, "forro").met, href: "/ferramentas/calculadora-calorias-danca", oQueTem: "cada estilo, do salão ao funk, comparado com os outros" },
  { id: "zumba", nome: "Zumba", ritmo: "músicas com salto", met: MET_ZUMBA_SALTO, href: "/ferramentas/calculadora-calorias-zumba", oQueTem: "a aula dividida entre músicas com e sem salto" },
  { id: "futebol", nome: "Futebol", ritmo: "pelada", met: pega(JOGOS, "pelada").met, href: "/ferramentas/calculadora-calorias-futebol", oQueTem: "o revezamento de times e o tempo na lateral" },
  { id: "eliptico", nome: "Elíptico", ritmo: "esforço moderado", met: pega(ESFORCOS_ELIPTICO, "moderado").met, href: "/ferramentas/calculadora-calorias-eliptico", oQueTem: "a conferência do número do visor" },
  { id: "natacao", nome: "Natação", ritmo: "crawl leve", met: pega(NADOS, "crawl-leve").met, href: "/ferramentas/calculadora-calorias-natacao", oQueTem: "cada nado e o tempo parado na borda" },
  { id: "boxe", nome: "Boxe", ritmo: "aula no saco", met: pega(AULAS_BOXE, "saco").met, href: "/ferramentas/calculadora-calorias-boxe", oQueTem: "os rounds e o ritmo de socos" },
  { id: "polichinelos", nome: "Polichinelos", ritmo: "ritmo moderado", met: pega(INTENSIDADES_POLICHINELO, "moderado").met, href: "/ferramentas/calculadora-polichinelos", oQueTem: "quantos polichinelos valem uma caminhada" },
  { id: "caminhada", nome: "Caminhada", ritmo: "passo moderado", met: pega(RITMOS_CAMINHADA, "moderado").met, href: "/ferramentas/calculadora-calorias-caminhada", oQueTem: "distância, passos e a inclinação da esteira" },
];

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;
export const MINUTOS_MIN = 5;
export const MINUTOS_MAX = 300;
export const PRESETS_MINUTOS = [30, 45, 60, 90] as const;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const minutosValidos = (m: number | null): m is number => m !== null && m >= MINUTOS_MIN && m <= MINUTOS_MAX;

/* ───────────────────────── A comparação ───────────────────────── */

export interface LinhaComparacao extends AtividadeComparada {
  kcal: number;
  kcalLiquida: number;
}

/** O mesmo tempo, o mesmo peso, do maior gasto ao menor. */
export function comparaAtividades(minutos: number, pesoKg: number): LinhaComparacao[] {
  const repouso = kcalPorMinuto(1, pesoKg) * minutos;
  return COMPARADOR.map((a) => {
    const kcal = kcalPorMinuto(a.met, pesoKg) * minutos;
    return { ...a, kcal, kcalLiquida: kcal - repouso };
  }).sort((x, y) => y.kcal - x.kcal);
}

/** Quanto tempo de cada atividade para gastar 7.700 kcal, o de um quilo de gordura. */
export const minutosParaUmQuilo = (met: number, pesoKg: number) => KCAL_POR_KG_GORDURA / kcalPorMinuto(met, pesoKg);

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente na mesma aula — muda com condicionamento, técnica e o quanto cada uma se entrega.";

export const NOTA_BRUTO =
  "O número é bruto: inclui o que você gastaria parado nesse tempo. O que a atividade acrescenta ao seu dia é um pouco menor.";

export const NOTA_SEGURANCA =
  "Se você tem dor articular, alguma lesão ou condição cardiovascular, comece com menos tempo e converse com quem acompanha você.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhuma atividade escolhe de onde o corpo tira gordura. Ela aumenta o gasto do dia; onde a gordura sai primeiro é decidido por genética e hormônio.";

/* ───────────────────────── Compatibilidade ───────────────────────── */

/**
 * O seletor de atividades não existe mais: todas saíram para calculadoras
 * próprias. As listas ficam vazias, e não somem, porque os testes de cada
 * calculadora conferem que a atividade dela NÃO está aqui — é a regra de
 * uma ferramenta por artigo, vigiada dos dois lados.
 */
export const ATIVIDADES: { id: string }[] = [];
export const ARTIGOS_COM_CALCULADORA_ATIVIDADES: string[] = [];
export const ARTIGOS_COM_LINK_ATIVIDADES: string[] = [];
