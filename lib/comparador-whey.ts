/**
 * O motor da Batalha dos Wheys (comparador de whey protein).
 *
 * O INDICADOR PRINCIPAL É O CUSTO DO GRAMA DE PROTEÍNA, NÃO O DO POTE
 *
 * Dois potes de 900 g com preços iguais podem entregar quantidades bem
 * diferentes de proteína: o que muda é a concentração do rótulo (proteína
 * ÷ porção). Por isso toda comparação passa pela proteína total estimada
 * da embalagem, e o "mais barato" é sempre o de menor custo por grama de
 * proteína.
 *
 * ESTIMATIVA, NÃO MEDIDA
 *
 * A tabela nutricional brasileira arredonda os valores (RDC 429/2020 e IN
 * 75/2020), e o rótulo é o que a marca declara. Tudo aqui é estimativa a
 * partir do rótulo; a tela diz isso.
 *
 * DINHEIRO EM CENTAVOS
 *
 * Preço entra e sai em centavos inteiros. As razões intermediárias (custo
 * por grama) são números com casas, e só o que vai para a tela é
 * arredondado — nunca uma soma de valores já arredondados.
 *
 * O módulo é puro: não busca preço, não lê banco. A página e o painel
 * passam os dados, e o motor só faz conta e validação.
 */

import { concentracao } from "./whey";

/* ───────────────────────── Tipos ───────────────────────── */

export interface Rotulo {
  /** Peso líquido da embalagem, em gramas de produto. */
  pacoteG: number;
  /** Porção de referência do rótulo, em gramas de produto. */
  porcaoG: number;
  /** Proteína por porção, em gramas, como declarada. */
  proteinaPorcaoG: number;
}

export interface Oferta extends Rotulo {
  /** Preço considerado, em centavos. */
  precoCentavos: number;
}

export interface Analise {
  /** Proteína ÷ porção, em %. */
  concentracaoPct: number;
  /** (pacote ÷ porção) × proteína por porção. */
  proteinaTotalG: number;
  /** Centavos por grama de proteína (com casas). */
  centavosPorGProteina: number;
  /** Centavos para obter 25 g de proteína. */
  centavosPor25g: number;
  /** Quantas doses de 25 g de proteína o pote rende. */
  doses25g: number;
  /** Centavos por 100 g de produto. */
  centavosPor100gProduto: number;
  /** Centavos por porção do fabricante. */
  centavosPorPorcao: number;
  /** Gramas de produto para obter 25 g de proteína. */
  produtoPara25gG: number;
}

/* ───────────────────────── Validação do rótulo ───────────────────────── */

export const LIMITES = {
  pacoteMinG: 100,
  pacoteMaxG: 10000,
  porcaoMinG: 5,
  porcaoMaxG: 200,
  precoMinCentavos: 100,
  precoMaxCentavos: 500000,
  /**
   * Whey de verdade fica entre ~60% (blends, concentrados fracos) e ~95%
   * (isolados). Fora disso o rótulo foi digitado errado ou não é whey.
   */
  concentracaoMin: 0.3,
  concentracaoMax: 0.97,
  /** Abaixo disso, avisar: pode ser blend, hipercalórico ou com colágeno. */
  concentracaoAviso: 0.6,
} as const;

export type ProblemaRotulo =
  | "pacote_invalido"
  | "porcao_invalida"
  | "proteina_invalida"
  | "proteina_maior_que_porcao"
  | "concentracao_impossivel";

export function problemasRotulo(r: Rotulo): ProblemaRotulo[] {
  const p: ProblemaRotulo[] = [];
  const num = (x: number) => Number.isFinite(x) && x > 0;
  if (!num(r.pacoteG) || r.pacoteG < LIMITES.pacoteMinG || r.pacoteG > LIMITES.pacoteMaxG) p.push("pacote_invalido");
  if (!num(r.porcaoG) || r.porcaoG < LIMITES.porcaoMinG || r.porcaoG > LIMITES.porcaoMaxG) p.push("porcao_invalida");
  if (!num(r.proteinaPorcaoG)) p.push("proteina_invalida");
  if (p.length) return p;
  if (r.proteinaPorcaoG > r.porcaoG) return ["proteina_maior_que_porcao"];
  const c = concentracao(r.porcaoG, r.proteinaPorcaoG);
  if (c < LIMITES.concentracaoMin || c > LIMITES.concentracaoMax) return ["concentracao_impossivel"];
  return [];
}

/** Rótulo válido, mas com cara de blend/hipercalórico: a tela avisa. */
export const concentracaoBaixa = (r: Rotulo) => concentracao(r.porcaoG, r.proteinaPorcaoG) < LIMITES.concentracaoAviso;

export const precoValido = (c: number) => Number.isInteger(c) && c >= LIMITES.precoMinCentavos && c <= LIMITES.precoMaxCentavos;

export const ofertaValida = (o: Oferta) => precoValido(o.precoCentavos) && problemasRotulo(o).length === 0;

/* ───────────────────────── As contas ───────────────────────── */

export function analisa(o: Oferta): Analise {
  const c = concentracao(o.porcaoG, o.proteinaPorcaoG);
  const proteinaTotalG = (o.pacoteG / o.porcaoG) * o.proteinaPorcaoG;
  const centavosPorGProteina = o.precoCentavos / proteinaTotalG;
  return {
    concentracaoPct: c * 100,
    proteinaTotalG,
    centavosPorGProteina,
    centavosPor25g: centavosPorGProteina * 25,
    doses25g: proteinaTotalG / 25,
    centavosPor100gProduto: (o.precoCentavos / o.pacoteG) * 100,
    centavosPorPorcao: (o.precoCentavos / o.pacoteG) * o.porcaoG,
    produtoPara25gG: 25 / c,
  };
}

/* ───────────────────────── Rotina: custo e compra ───────────────────────── */

export const PERIODOS = [30, 60, 90] as const;

export interface Rotina {
  /** Custo proporcional ao consumo, em centavos (não é o que se paga). */
  custoProporcionalCentavos: number;
  /** Embalagens inteiras necessárias (arredondado para cima). */
  embalagens: number;
  /** Desembolso real comprando embalagens inteiras, em centavos. */
  desembolsoCentavos: number;
  /** Proteína que sobra no fim do período, em gramas. */
  sobraProteinaG: number;
}

/**
 * Quanto custa tirar `gDia` gramas de proteína do whey por `dias` dias.
 * Separa o custo proporcional (o que se consome) do que se paga de fato,
 * em potes inteiros.
 */
export function rotina(o: Oferta, gDia: number, dias: number): Rotina {
  const a = analisa(o);
  const necessariaG = gDia * dias;
  const embalagens = necessariaG <= 0 ? 0 : Math.ceil(necessariaG / a.proteinaTotalG - 1e-9);
  return {
    custoProporcionalCentavos: a.centavosPorGProteina * necessariaG,
    embalagens,
    desembolsoCentavos: embalagens * o.precoCentavos,
    sobraProteinaG: embalagens * a.proteinaTotalG - necessariaG,
  };
}

/* ───────────────────────── Modos de comparação ───────────────────────── */

export interface ItemRanking<T> {
  item: T;
  analise: Analise;
}

/** Modo A: menor custo por grama de proteína primeiro. Ignora inválidos. */
export function rankingCusto<T extends Oferta>(itens: T[]): ItemRanking<T>[] {
  return itens
    .filter(ofertaValida)
    .map((item) => ({ item, analise: analisa(item) }))
    .sort((x, y) => x.analise.centavosPorGProteina - y.analise.centavosPorGProteina);
}

/** Modo D: quanto a mais custa a mesma proteína no produto mais caro. */
export function valePagarMais(barato: Oferta, caro: Oferta, gDia: number, dias: number) {
  const a = analisa(barato);
  const b = analisa(caro);
  const necessariaG = gDia * dias;
  const extraCentavos = (b.centavosPorGProteina - a.centavosPorGProteina) * necessariaG;
  return {
    extraCentavos,
    extraPct: (b.centavosPorGProteina - a.centavosPorGProteina) / a.centavosPorGProteina,
  };
}

/**
 * Modo E: o preço máximo que o concorrente pode ter para empatar com a
 * referência no custo por grama de proteína.
 */
export function precoEquilibrioCentavos(referencia: Oferta, concorrente: Rotulo): number {
  const ref = analisa(referencia);
  const proteinaConcorrente = (concorrente.pacoteG / concorrente.porcaoG) * concorrente.proteinaPorcaoG;
  return Math.floor(ref.centavosPorGProteina * proteinaConcorrente);
}

/** Destaques independentes: nunca um "vencedor geral". */
export function destaques<T extends Oferta & { id: string }>(itens: T[]) {
  const v = itens.filter(ofertaValida).map((i) => ({ id: i.id, a: analisa(i) }));
  if (v.length < 2) return { maisEconomico: null, maiorConcentracao: null };
  const menor = (f: (x: Analise) => number) => {
    const s = [...v].sort((x, y) => f(x.a) - f(y.a));
    return Math.abs(f(s[0].a) - f(s[1].a)) < 1e-9 ? null : s[0].id;
  };
  return {
    /** null = empate. */
    maisEconomico: menor((a) => a.centavosPorGProteina),
    maiorConcentracao: menor((a) => -a.concentracaoPct),
  };
}

/* ───────────────────────── Preço: validade e conferência ───────────────────────── */

export type StatusPreco = "verificado" | "ultimo_conhecido" | "indisponivel";

/** Padrão: preço vale 7 dias. Configurável por fonte. */
export const VALIDADE_PRECO_DIAS = 7;

export function statusPreco(verificadoEm: Date | null, agora: Date, validadeDias = VALIDADE_PRECO_DIAS): StatusPreco {
  if (!verificadoEm || Number.isNaN(verificadoEm.getTime())) return "indisponivel";
  const idadeDias = (agora.getTime() - verificadoEm.getTime()) / 86_400_000;
  if (idadeDias < 0) return "indisponivel"; // data no futuro: dado corrompido
  return idadeDias <= validadeDias ? "verificado" : "ultimo_conhecido";
}

/** Só preço verificado dentro da validade entra em ranking. */
export const entraNoRanking = (s: StatusPreco) => s === "verificado";

export type ResultadoPreco =
  | { aceito: true }
  | { aceito: false; motivo: "ausente" | "zero_ou_negativo" | "fora_da_faixa" | "variacao_suspeita" };

/** Acima disso (para cima ou para baixo), vai para revisão humana. */
export const VARIACAO_SUSPEITA = 0.4;

/**
 * Confere um preço novo antes de gravar. Uma falha nunca substitui um
 * preço válido: quem chama mantém o anterior e registra o motivo.
 */
export function conferePreco(novoCentavos: number | null | undefined, anteriorCentavos: number | null): ResultadoPreco {
  if (novoCentavos === null || novoCentavos === undefined || Number.isNaN(novoCentavos)) return { aceito: false, motivo: "ausente" };
  if (novoCentavos <= 0) return { aceito: false, motivo: "zero_ou_negativo" };
  if (!precoValido(novoCentavos)) return { aceito: false, motivo: "fora_da_faixa" };
  if (anteriorCentavos && Math.abs(novoCentavos - anteriorCentavos) / anteriorCentavos > VARIACAO_SUSPEITA) {
    return { aceito: false, motivo: "variacao_suspeita" };
  }
  return { aceito: true };
}

/* ───────────────────────── Formatação ───────────────────────── */

export const reais = (centavos: number, casas = 2) =>
  (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: casas, maximumFractionDigits: casas });
