/**
 * O motor da Calculadora de Calorias por Atividade.
 *
 * POR QUE UMA PÁGINA, E NÃO UMA POR ESPORTE
 *
 * O site tem dez artigos de "X emagrece?" — boxe (645 impressões em 90
 * dias), futebol (627), zumba (569), spinning (432), dança (349), natação
 * (153), jiu-jitsu (115), escada, pular corda, bicicleta. Oito deles não
 * têm ferramenta nenhuma, e todos recebem a mesma pergunta: "quantas
 * calorias uma aula/pelada/hora queima?".
 *
 * A tentação seria uma calculadora por esporte. Seriam nove páginas com o
 * mesmo formulário, o mesmo texto e só o MET trocado — que é a definição
 * de doorway page, e o Google trata como tal. A conta é idêntica; o que
 * muda é um número numa tabela.
 *
 * Então: UMA página canônica com a atividade selecionável, e o embed em
 * cada artigo já vem com a atividade dele escolhida. Cada artigo mantém
 * seu canonical e seu ranking — eles já estão entre a posição 5 e a 10 —,
 * e a ferramenta responde a conta que o texto não responde: com o peso de
 * quem pergunta.
 *
 * SÓ A BICICLETA FICA AQUI
 *
 * Futebol, boxe, zumba, spinning, dança, natação, jiu-jitsu, corda e escada
 * entraram aqui e saíram em setembro de 2026. Não porque o argumento acima deixou de valer, mas porque cada um
 * passou a ter uma conta que as outras não têm: o futebol, o revezamento
 * de times; o boxe, o ritmo de socos que o Compêndio mediu e os rounds; a
 * zumba, a aula dividida entre músicas com e sem salto; o spinning, a
 * potência em watts que a bike mostra; a dança, o estilo; a natação, o nado
 * e o tempo na borda; o jiu-jitsu, os rolas; a corda, os blocos de pulo e
 * descanso; a escada, os andares. Ver lib/futebol.ts, lib/boxe.ts,
 * lib/zumba.ts, lib/spinning.ts, lib/danca.ts, lib/natacao.ts,
 * lib/jiujitsu.ts, lib/corda.ts e lib/escada.ts. A saída do jiu-jitsu corrigiu outro valor: a técnica
 * estava com 7,8 METs, que não é nenhuma entrada de artes marciais do
 * Compêndio (5,3 e 10,3).
 *
 * A saída do boxe também corrigiu um erro: esta tabela dava 7,8 METs ao
 * saco e 9,3 ao sparring. No Compêndio de 2024, 7,8 é o sparring e o saco
 * é 5,8.
 *
 * Os dois têm calculadora própria, com coisas que esta não faz
 * (inclinação, passos, comparação com o visor). Repeti-los aqui criaria a
 * disputa que a regra de uma ferramenta por artigo existe para impedir.
 * Eles aparecem como link na comparação, não como opção do seletor.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * Cada atividade tem os METs do Compêndio de Atividades Físicas (2024),
 * em duas faixas de esforço quando o Compêndio tem duas. Nada é
 * interpolado aqui: se o Compêndio não mede uma faixa, ela não existe na
 * ferramenta.
 *
 * O DESCONTO DE PAUSAS É OPÇÃO, NÃO PADRÃO
 *
 * A primeira versão descontava as pausas por padrão, com o argumento de
 * que uma aula de uma hora não é uma hora de esforço. O argumento é bom e
 * a conta estava certa — mas a auditoria mostrou que ela brigava com o
 * próprio site: o artigo de boxe diz 450 a 600 kcal para uma hora de aula
 * a 70 kg e a calculadora, logo abaixo dele, dizia 400; o de futebol diz
 * 400 a 650 para uma pelada de uma hora e a calculadora dizia 310; o de
 * corda diz 300 a 400 em 30 minutos e a calculadora dizia 161.
 *
 * Duas respostas diferentes para a mesma pergunta na mesma página é pior
 * que uma resposta imperfeita. E os METs do Compêndio para esporte são
 * medidos na atividade como ela é praticada, com as pausas que ela tem —
 * descontar de novo é descontar duas vezes.
 *
 * Então o padrão é o tempo cheio, que concorda com os artigos, e o
 * desconto fica como caixa para quem sabe que passou metade da aula
 * parado. `scripts/atividades-test.ts` compara a saída com as faixas
 * declaradas em cada artigo, para isso não voltar em silêncio.
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

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, KCAL_POR_KG_GORDURA, FONTE_HALL, FONTE_ACSM };
export type { Fonte };

export const FONTE_COMPENDIO_ATIVIDADES: Fonte = {
  rotulo:
    "Herrmann SD, Willis EA, Ainsworth BE, et al. 2024 Adult Compendium of Physical Activities. Journal of Sport and Health Science, 2024",
  rotuloCurto: "Compêndio de Atividades Físicas (2024)",
  url: "https://pacompendium.com/adult-compendium/",
  resumo:
    "reúne o custo energético medido de centenas de atividades em METs, por esporte e por faixa de esforço. É a fonte dos valores de cada atividade desta calculadora.",
};

export const FONTES_ATIVIDADES: Fonte[] = [FONTE_COMPENDIO_ATIVIDADES, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── As atividades ───────────────────────── */

export interface FaixaEsforco {
  id: string;
  nome: string;
  met: number;
  /** Como a pessoa se reconhece na faixa, sem relógio nem monitor. */
  comoReconhecer: string;
  /** A entrada do Compêndio de onde o MET saiu. Aparece na metodologia. */
  origem: string;
}

export interface Atividade {
  id: string;
  /** Como a pessoa chama, não como o Compêndio chama. */
  nome: string;
  /** Aparece na frase de resultado: "uma aula de", "uma pelada de"… */
  artigoFrase: string;
  faixas: FaixaEsforco[];
  /** Tempo típico de uma sessão, em minutos. Vira o atalho principal. */
  sessaoTipica: number;
  /**
   * Índice da faixa que representa a atividade — o padrão do seletor e a
   * linha que entra na comparação. Quase sempre 0; em "subir escada" é a
   * segunda, porque o artigo trata a escada como exercício (8 a 9 METs) e
   * a entrada lenta do Compêndio é a subida do dia a dia.
   */
  faixaPrincipal: number;
  /**
   * Quanto do tempo de aula costuma ser esforço de verdade. Usado para o
   * aviso de "aula de 60 min não é 60 min de esforço"; null quando a
   * atividade é contínua por natureza (natação, bicicleta).
   */
  fracaoAtiva: number | null;
  /** O artigo do site que trata da atividade. */
  slug: string;
}

/**
 * ATENÇÃO — os METs abaixo vieram de fontes secundárias e precisam ser
 * conferidos no Compêndio antes de ir ao ar; o site dele não estava
 * acessível na escrita. `scripts/atividades-test.ts` trava cada valor:
 * mudar aqui exige conferir a fonte e mudar lá.
 */
export const ATIVIDADES: Atividade[] = [
  {
    id: "bicicleta",
    nome: "Bicicleta (rua)",
    artigoFrase: "um pedal",
    sessaoTipica: 45,
    faixaPrincipal: 0,
    fracaoAtiva: null,
    slug: "bicicleta-emagrece",
    faixas: [
      { id: "lazer", nome: "Lazer", met: 5.8, comoReconhecer: "Até cerca de 16 km/h, passeio, terreno plano.", origem: "bicicleta, menos de 16 km/h, lazer" },
      { id: "esforco", nome: "Ritmo firme", met: 8.0, comoReconhecer: "Entre 16 e 19 km/h, esforço constante.", origem: "bicicleta, 16 a 19 km/h, esforço moderado" },
    ],
  },
];

/**
 * A primeira da lista. Não é um id fixo porque as atividades estão saindo
 * uma a uma para calculadoras próprias — um id fixo quebraria a cada saída.
 */
export const ATIVIDADE_PADRAO = ATIVIDADES[0].id;

export function atividade(id: string): Atividade {
  return ATIVIDADES.find((a) => a.id === id) ?? ATIVIDADES[0];
}

export function faixa(a: Atividade, id: string): FaixaEsforco {
  return a.faixas.find((f) => f.id === id) ?? a.faixas[0];
}

/** A atividade de um artigo, quando existe. É o que pré-seleciona o embed. */
export function atividadeDoArtigo(slug: string): Atividade | null {
  return ATIVIDADES.find((a) => a.slug === slug) ?? null;
}

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;
export const MINUTOS_MIN = 1;
export const MINUTOS_MAX = 300;
export const KCAL_MIN = 10;
export const KCAL_MAX = 3000;
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

/** O que a atividade acrescenta ao que a pessoa gastaria parada (1 MET). */
export function kcalLiquida(r: Resultado, pesoKg: number): number {
  return r.kcal - kcalPorMinuto(1, pesoKg) * r.minutos;
}

/**
 * O tempo de esforço dentro de um tempo de aula.
 *
 * É a correção que falta em toda tabela de revista: uma aula de 60
 * minutos tem aquecimento, explicação e água no meio. A fração
 * vem da atividade e é declarada na tela — não é um desconto secreto.
 */
export function tempoAtivo(minutosDeAula: number, a: Atividade): number {
  return a.fracaoAtiva === null ? minutosDeAula : minutosDeAula * a.fracaoAtiva;
}

/* ───────────────────────── Comparação ───────────────────────── */

export interface LinhaComparacao {
  id: string;
  nome: string;
  met: number;
  kcal: number;
}

/** A mesma duração, o mesmo peso, na faixa mais comum de cada atividade. */
export function comparaAtividades(minutos: number, pesoKg: number): LinhaComparacao[] {
  return ATIVIDADES.map((a) => {
    const f = a.faixas[a.faixaPrincipal];
    return { id: a.id, nome: `${a.nome} — ${f.nome.toLowerCase()}`, met: f.met, kcal: kcalPorMinuto(f.met, pesoKg) * minutos };
  }).sort((x, y) => y.kcal - x.kcal);
}

/* ───────────────────────── Tabelas estáticas ───────────────────────── */

export const PESOS_TABELA = [50, 60, 70, 80, 90, 100, 120] as const;

export interface LinhaPeso {
  peso: number;
  kcal: number[];
}

/** A faixa que representa a atividade — padrão do seletor e da comparação. */
export function faixaPrincipal(a: Atividade): FaixaEsforco {
  return a.faixas[a.faixaPrincipal] ?? a.faixas[0];
}

/** Uma linha por peso, uma coluna por faixa da atividade. */
export function tabelaPorPeso(a: Atividade, minutos: number): LinhaPeso[] {
  return PESOS_TABELA.map((peso) => ({
    peso,
    kcal: a.faixas.map((f) => arredondaKcal(deTempo(minutos, peso, f.met).kcal)),
  }));
}

export function simulacaoUmQuilo(pesoKg: number, met: number): Resultado {
  return deKcal(KCAL_POR_KG_GORDURA, pesoKg, met);
}

export function fraseContexto(pesoKg: number, r: Resultado, a: Atividade, f: FaixaEsforco): string {
  const peso = pesoKg.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  return (
    `Para uma pessoa de ${peso} kg, ${a.artigoFrase} de ${formataTempo(r.minutos)} ` +
    `(${f.nome.toLowerCase()}) representa um gasto estimado de aproximadamente ${arredondaKcal(r.kcal)} kcal.`
  );
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente na mesma aula — muda com condicionamento, técnica e o quanto cada uma se entrega.";

export const NOTA_BRUTO =
  "O número é bruto: inclui o que você gastaria parado nesse tempo. O que a atividade acrescenta ao seu dia é um pouco menor.";

export const NOTA_VOLUME_ALTO =
  "Esse tempo seria pouco prático como meta diária. Distribuir o gasto entre a atividade, a musculação e o movimento do dia costuma render mais e durar mais semanas.";

export const NOTA_SEGURANCA =
  "Se você tem dor articular, alguma lesão ou condição cardiovascular, comece com menos tempo e converse com quem acompanha você.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhuma atividade escolhe de onde o corpo tira gordura. Ela aumenta o gasto do dia; onde a gordura sai primeiro é decidido por genética e hormônio.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, com a atividade deles já escolhida.
 *
 * A ordem é a das impressões no Search Console. `futebol-emagrece` e
 * `jiu-jitsu-emagrece` saíram do registro de link da calculadora de FC:
 * a busca que os traz é de caloria, não de batimento, e a regra da casa é
 * uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_ATIVIDADES: string[] = [];

/**
 * Artigos que recebem link, não embed.
 *
 * O `pular-corda-emagrece` saiu em setembro de 2026 para a calculadora
 * própria da corda. O que ficou tem impressão perto de zero hoje; o embed fica reservado para
 * onde há gente chegando. Quando subirem, viram embed — se houver vaga no
 * teto de oito.
 */
export const ARTIGOS_COM_LINK_ATIVIDADES: string[] = ["bicicleta-emagrece"];
