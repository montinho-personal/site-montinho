/**
 * O motor da Calculadora de Calorias na Bicicleta.
 *
 * POR QUE A BICICLETA SAIU DA CALCULADORA DE ATIVIDADES
 *
 * Pelo mesmo critério das outras nove: só sai quem tem uma conta que as
 * outras não têm. Na bicicleta são três.
 *
 *   1. A VELOCIDADE. O Compêndio mede a bicicleta de rua por faixa de
 *      velocidade, não por "leve/moderado". Quem tem o aplicativo do
 *      celular sabe a média do pedal; quem não tem sabe a distância e o
 *      tempo, e a média sai daí.
 *   2. AS PARADAS. Pedal na rua tem semáforo, cruzamento e espera. A
 *      calculadora coletiva multiplicava o MET pelo tempo de relógio; aqui
 *      o tempo parado conta como ficar em pé, igual à lateral no futebol e
 *      à borda na natação.
 *   3. IR DE BIKE PARA O TRABALHO. É a pergunta que ninguém responde: não
 *      quanto gasta UM pedal, mas quanto rende no mês trocar o carro pela
 *      bike na ida e na volta. O Compêndio tem uma entrada só para isso.
 *
 * A ergométrica entra pela potência em watts, que o visor mostra, na
 * mesma escada que a Calculadora de Spinning já usa — as duas nunca
 * discordam para os mesmos watts. Quem não tem watts escolhe o esforço.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * Compêndio de Atividades Físicas de 2024, cada valor confirmado por busca
 * pelo código, sem o valor informado:
 *
 *   rua, lazer, 5,5 mph (~9 km/h)               01018  3,5
 *   rua, lazer, 9,4 mph (~15 km/h)              01019  5,8
 *   rua, 10–11,9 mph (16–19 km/h), leve         01020  6,8
 *   rua, 12–13,9 mph (19–22 km/h), moderado     01030  8,0
 *   rua, 14–15,9 mph (22–26 km/h), vigoroso     01040 10,0
 *   rua, 16–19 mph (26–30 km/h), muito rápido   01050 12,0
 *   ida e volta do trabalho, ritmo próprio      01011  6,8
 *   mountain bike, geral                        01009  8,5
 *   mountain bike, subida, vigoroso             01003 14,0
 *
 * A ergométrica usa a escada de watts de lib/spinning.ts (Compêndio de
 * 2011, códigos 02011 a 02015 e 02017). A edição de 2024 remediu algumas
 * faixas com valores um pouco menores; o site mantém UMA escada para as
 * duas ferramentas, porque duas respostas para os mesmos watts, em
 * páginas vizinhas, é pior que uma resposta com a edição anterior.
 *
 * O tempo parado vale 1,3, ficar em pé — o mesmo das outras calculadoras.
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
import { FAIXAS as FAIXAS_WATTS, FONTE_COMPENDIO_SPINNING, MET_AULA as MET_AULA_SPINNING, WATTS_MAX, WATTS_MIN, faixaDe, type Faixa } from "./spinning";

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, KCAL_POR_KG_GORDURA, FONTE_HALL, FAIXAS_WATTS, WATTS_MAX, WATTS_MIN, faixaDe, MET_AULA_SPINNING };
export type { Faixa };

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_COMPENDIO_BICICLETA: Fonte = {
  rotulo:
    "Herrmann SD, Willis EA, Ainsworth BE, et al. 2024 Adult Compendium of Physical Activities. Journal of Sport and Health Science, 2024",
  rotuloCurto: "Compêndio de Atividades Físicas (2024)",
  url: "https://pacompendium.com/adult-compendium/",
  resumo:
    "mede a bicicleta de rua por faixa de velocidade — de 3,5 METs a 9 km/h de passeio a 12,0 acima de 26 km/h —, a ida e volta do trabalho em 6,8 e o mountain bike em 8,5, com a subida forte em 14,0.",
};

export const FONTES_BICICLETA: Fonte[] = [FONTE_COMPENDIO_BICICLETA, FONTE_COMPENDIO_SPINNING, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── A rua, por velocidade ───────────────────────── */

export interface FaixaVelocidade {
  codigo: string;
  /** km/h, inclusive. */
  de: number;
  /** km/h, exclusivo na faixa seguinte. */
  ate: number;
  met: number;
  nome: string;
  comoReconhecer: string;
}

/**
 * As seis faixas de rua do Compêndio, em km/h. Os limites são as milhas
 * do Compêndio convertidas (10 mph = 16,1 km/h) e arredondadas ao inteiro,
 * emendadas para não deixar buraco: quem pedala a 12 km/h cai na faixa do
 * passeio de 9,4 mph, a de baixo, nunca numa interpolação.
 */
export const FAIXAS_RUA: FaixaVelocidade[] = [
  { codigo: "01018", de: 0, ate: 12, met: 3.5, nome: "Passeio lento", comoReconhecer: "Até uns 12 km/h: dá para conversar sem esforço, ritmo de ciclovia cheia." },
  { codigo: "01019", de: 12, ate: 16, met: 5.8, nome: "Passeio", comoReconhecer: "De 12 a 16 km/h: passeio de fim de semana, plano, sem pressa." },
  { codigo: "01020", de: 16, ate: 19, met: 6.8, nome: "Leve", comoReconhecer: "De 16 a 19 km/h: ritmo de deslocamento, a respiração sobe um pouco." },
  { codigo: "01030", de: 19, ate: 22, met: 8.0, nome: "Moderado", comoReconhecer: "De 19 a 22 km/h: esforço constante, frases curtas." },
  { codigo: "01040", de: 22, ate: 26, met: 10.0, nome: "Forte", comoReconhecer: "De 22 a 26 km/h: treino de verdade, pouca conversa." },
  { codigo: "01050", de: 26, ate: 60, met: 12.0, nome: "Muito forte", comoReconhecer: "Acima de 26 km/h: ritmo de pelotão ou de prova." },
];

export const VELOCIDADE_MIN = 3;
export const VELOCIDADE_MAX = 60;

/** A faixa de uma velocidade média. Fora de 3 a 60 km/h, null. */
export function faixaRua(kmh: number): FaixaVelocidade | null {
  if (!Number.isFinite(kmh) || kmh < VELOCIDADE_MIN || kmh > VELOCIDADE_MAX) return null;
  return FAIXAS_RUA.find((f) => kmh >= f.de && kmh < f.ate) ?? FAIXAS_RUA[FAIXAS_RUA.length - 1];
}

/** km/h a partir de distância e tempo. */
export const velocidadeMedia = (km: number, minutos: number) => (minutos > 0 ? (km / minutos) * 60 : 0);

/* ───────────────────────── Terreno e trabalho ───────────────────────── */

export type TerrenoId = "plano" | "trilha" | "subida";

export interface Terreno {
  id: TerrenoId;
  nome: string;
  descricao: string;
  /** null: o MET vem da velocidade. */
  met: number | null;
  codigo: string | null;
}

export const TERRENOS: Terreno[] = [
  { id: "plano", nome: "Rua ou ciclovia", descricao: "Asfalto, plano ou com subidas leves. O gasto sai da velocidade média.", met: null, codigo: null },
  { id: "trilha", nome: "Trilha (mountain bike)", descricao: "Terra, pedra e sobe-e-desce. O Compêndio mede o mountain bike como um todo, sem depender da velocidade.", met: 8.5, codigo: "01009" },
  { id: "subida", nome: "Subida forte, contínua", descricao: "Serra ou ladeira longa, pedalando forte o tempo todo. É o maior valor do Compêndio para bicicleta.", met: 14.0, codigo: "01003" },
];

export const terreno = (id: TerrenoId): Terreno => TERRENOS.find((t) => t.id === id)!;

/** Ida e volta do trabalho, no ritmo que a pessoa escolhe. */
export const MET_TRABALHO = 6.8;
export const CODIGO_TRABALHO = "01011";

/** Parado no semáforo, em pé sobre a bike. */
export const MET_PARADO = 1.3;

/* ───────────────────────── A ergométrica, por esforço ───────────────────────── */

export type EsforcoId = "leve" | "moderado" | "forte" | "muito-forte";

export interface Esforco {
  id: EsforcoId;
  nome: string;
  /** A faixa de watts do Compêndio que representa o esforço. */
  watts: number;
  comoReconhecer: string;
}

/**
 * Para quem não tem watts no visor: cada esforço aponta para um ponto da
 * escada de watts, e o MET sai de lá. Nada de valor próprio para "leve".
 */
export const ESFORCOS: Esforco[] = [
  { id: "leve", nome: "Leve", watts: 70, comoReconhecer: "Dá para ler ou ver série. Não sua." },
  { id: "moderado", nome: "Moderado", watts: 95, comoReconhecer: "Respiração mais funda, frases inteiras ainda saem." },
  { id: "forte", nome: "Forte", watts: 130, comoReconhecer: "Suando, frases curtas. É o ritmo de quem está treinando." },
  { id: "muito-forte", nome: "Muito forte", watts: 180, comoReconhecer: "Só se sustenta por alguns minutos." },
];

export const esforco = (id: EsforcoId): Esforco => ESFORCOS.find((e) => e.id === id)!;
export const metDoEsforco = (id: EsforcoId): number => faixaDe(esforco(id).watts)!.met;

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const MINUTOS_MIN = 5;
export const MINUTOS_MAX = 600;
export const KM_MIN = 0.5;
export const KM_MAX = 300;
export const PARADO_MAX = 120;
export const DIAS_TRABALHO = [1, 2, 3, 4, 5] as const;
export const VEZES_SEMANA = [1, 2, 3, 4, 5, 6, 7] as const;
export const PRESETS_MINUTOS = [30, 45, 60, 90] as const;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const minutosValidos = (m: number | null): m is number => m !== null && m >= MINUTOS_MIN && m <= MINUTOS_MAX;
export const kmValido = (k: number | null): k is number => k !== null && k >= KM_MIN && k <= KM_MAX;
export const paradoValido = (m: number | null): m is number => m !== null && m >= 0 && m <= PARADO_MAX;
export const velocidadeValida = (v: number | null): v is number => v !== null && v >= VELOCIDADE_MIN && v <= VELOCIDADE_MAX;
export const wattsValidos = (w: number | null): w is number => w !== null && faixaDe(w) !== null;

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  /** Minutos pedalando de verdade. */
  minutosPedalando: number;
  minutosParado: number;
  minutosTotais: number;
  met: number;
  kcalPedalando: number;
  kcalParado: number;
  kcal: number;
  /** Descontado o que a pessoa gastaria parada (1 MET) no tempo todo. */
  kcalLiquida: number;
}

/** A conta de uma sessão: minutos totais, dos quais alguns parados. */
export function calcula(pesoKg: number, met: number, minutosTotais: number, minutosParado = 0): Resultado {
  const parado = Math.min(Math.max(0, minutosParado), minutosTotais);
  const pedalando = minutosTotais - parado;
  const kcalPedalando = kcalPorMinuto(met, pesoKg) * pedalando;
  const kcalParado = kcalPorMinuto(MET_PARADO, pesoKg) * parado;
  const kcal = kcalPedalando + kcalParado;
  return {
    minutosPedalando: pedalando,
    minutosParado: parado,
    minutosTotais,
    met,
    kcalPedalando,
    kcalParado,
    kcal,
    kcalLiquida: kcal - kcalPorMinuto(1, pesoKg) * minutosTotais,
  };
}

/** O número da tabela: o MET pelo tempo de relógio, como se não houvesse semáforo. */
export const kcalSeFosseContinuo = (pesoKg: number, met: number, minutosTotais: number) => kcalPorMinuto(met, pesoKg) * minutosTotais;

/** Quilos de gordura por mês, no máximo, pela conta linear. */
export function kgPorMes(kcalLiquidaPorSessao: number, vezesPorSemana: number): number {
  return ((kcalLiquidaPorSessao * vezesPorSemana) / KCAL_POR_KG_GORDURA) * (52 / 12);
}

/* ───────────────────────── Ir de bike para o trabalho ───────────────────────── */

export interface Trabalho {
  kmIda: number;
  minutosIda: number;
  velocidade: number;
  diasPorSemana: number;
  /** Ida e volta. */
  kcalPorDia: number;
  kcalLiquidaPorDia: number;
  kcalPorSemana: number;
  kmPorMes: number;
  minutosPorSemana: number;
  kgPorMes: number;
}

/**
 * A ida e a volta, nos dias em que a pessoa vai de bike. O MET é o da
 * entrada de deslocamento do Compêndio, que já embute o ritmo que quem
 * vai trabalhar escolhe — não o da velocidade, para não punir quem vai
 * devagar para não chegar suado.
 */
export function trabalho(pesoKg: number, kmIda: number, minutosIda: number, diasPorSemana: number): Trabalho {
  const umTrecho = calcula(pesoKg, MET_TRABALHO, minutosIda);
  const kcalPorDia = umTrecho.kcal * 2;
  const kcalLiquidaPorDia = umTrecho.kcalLiquida * 2;
  return {
    kmIda,
    minutosIda,
    velocidade: velocidadeMedia(kmIda, minutosIda),
    diasPorSemana,
    kcalPorDia,
    kcalLiquidaPorDia,
    kcalPorSemana: kcalPorDia * diasPorSemana,
    kmPorMes: kmIda * 2 * diasPorSemana * (52 / 12),
    minutosPorSemana: minutosIda * 2 * diasPorSemana,
    kgPorMes: kgPorMes(kcalLiquidaPorDia, diasPorSemana),
  };
}

/* ───────────────────────── Comparação e tabelas ───────────────────────── */

export interface LinhaComparacao {
  id: string;
  nome: string;
  met: number;
  kcal: number;
  href: string | null;
}

/**
 * O mesmo tempo, o mesmo peso: rua moderada, ergométrica moderada e a
 * aula de spinning. O spinning tem calculadora própria; ele entra como
 * linha de comparação e link, não como opção do seletor.
 */
export function compara(pesoKg: number, minutos: number): LinhaComparacao[] {
  const rua = FAIXAS_RUA.find((f) => f.codigo === "01030")!;
  return [
    { id: "rua", nome: `Bicicleta na rua, ${rua.nome.toLowerCase()} (${rua.de}–${rua.ate} km/h)`, met: rua.met, kcal: kcalPorMinuto(rua.met, pesoKg) * minutos, href: null },
    { id: "ergometrica", nome: "Ergométrica, esforço moderado", met: metDoEsforco("moderado"), kcal: kcalPorMinuto(metDoEsforco("moderado"), pesoKg) * minutos, href: null },
    { id: "spinning", nome: "Aula de spinning", met: MET_AULA_SPINNING, kcal: kcalPorMinuto(MET_AULA_SPINNING, pesoKg) * minutos, href: "/ferramentas/calculadora-calorias-spinning" },
  ].sort((a, b) => b.kcal - a.kcal);
}

export const PESOS_TABELA = [60, 70, 80, 90, 100] as const;

export interface LinhaPeso {
  peso: number;
  /** Uma coluna por faixa de rua. */
  kcal: number[];
}

/** Um pedal de rua, sem paradas, por peso e por faixa de velocidade. */
export function tabelaRua(minutos: number): LinhaPeso[] {
  return PESOS_TABELA.map((peso) => ({ peso, kcal: FAIXAS_RUA.map((f) => arredondaKcal(calcula(peso, f.met, minutos).kcal)) }));
}

export interface LinhaTrabalho {
  kmIda: number;
  minutosIda: number;
  kcalPorDia70: number;
  kgPorMes70: number;
  kcalPorDia90: number;
  kgPorMes90: number;
}

/** Trajetos comuns de ida, 5 dias por semana, para 70 e 90 kg. */
export const TRAJETOS = [
  { kmIda: 3, minutosIda: 12 },
  { kmIda: 5, minutosIda: 20 },
  { kmIda: 8, minutosIda: 30 },
  { kmIda: 12, minutosIda: 45 },
] as const;

export function tabelaTrabalho(): LinhaTrabalho[] {
  return TRAJETOS.map((t) => {
    const a = trabalho(70, t.kmIda, t.minutosIda, 5);
    const b = trabalho(90, t.kmIda, t.minutosIda, 5);
    return { kmIda: t.kmIda, minutosIda: t.minutosIda, kcalPorDia70: arredondaKcal(a.kcalPorDia), kgPorMes70: a.kgPorMes, kcalPorDia90: arredondaKcal(b.kcalPorDia), kgPorMes90: b.kgPorMes };
  });
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente no mesmo pedal — muda com o vento, o pneu, a bike e quanto cada uma se entrega nas subidas.";

export const NOTA_PARADAS =
  "O tempo parado em semáforos e esperas conta como ficar em pé, não como pedalar. É por isso que o pedal na cidade gasta menos do que a tabela pelo tempo de relógio.";

export const NOTA_LINEAR =
  "A conta em quilos é linear e serve como teto: o corpo compensa parte do gasto, e o peso cai mais devagar do que ela sugere.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhum pedal escolhe de onde o corpo tira gordura. A bicicleta aumenta o gasto da semana; onde a gordura sai primeiro é decidido por genética e hormônio.";

export const NOTA_SEGURANCA =
  "A bicicleta é baixo impacto e costuma ser a porta de entrada certa para quem tem sobrepeso ou joelho sensível. Ajuste a altura do banco — joelho quase estendido no ponto mais baixo — e, com dor articular ou condição cardiovascular, converse com quem acompanha você antes de intensificar.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção.
 *
 * O `bicicleta-emagrece` saiu do registro de link da calculadora de
 * atividades: a regra da casa é uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_BICICLETA: string[] = ["bicicleta-emagrece"];
