/**
 * Calculadora de Macros — dados e regras.
 *
 * A lógica não é dividir calorias em percentuais arbitrários. É uma cascata
 * com uma ordem que tem motivo:
 *
 *   calorias-alvo → proteína (g/kg) → gordura (% da energia) → carboidrato
 *   fica com o que sobrar.
 *
 * A proteína vem primeiro e em g/kg porque é o macro cuja necessidade
 * escala com o corpo da pessoa, não com o tamanho da dieta — 30% de uma
 * dieta de 1.500 kcal e 30% de uma de 3.000 kcal são coisas muito
 * diferentes para o mesmo indivíduo. A gordura entra como percentual da
 * energia porque é assim que as faixas de referência populacional são
 * expressas. E o carboidrato fecha a conta porque é o macro mais elástico
 * dos três.
 *
 * O efeito colateral é o ponto pedagógico da ferramenta: mexer em proteína
 * ou gordura muda o carboidrato na hora, e isso mostra na prática que os
 * macros dividem um orçamento fechado.
 */

import { FAIXAS, type FaixaProteina } from "./proteina";

// ─── Fonte única de verdade compartilhada ────────────────────────────────────

/**
 * As referências de proteína vêm da Calculadora de Proteína, importadas —
 * não copiadas. Duas ferramentas do mesmo site dizendo g/kg diferentes seria
 * o mesmo erro que já apareceu na tabela de alimentos.
 */
export const FAIXAS_PROTEINA: FaixaProteina[] = FAIXAS;

export { REFERENCIA_CIENTIFICA as REFERENCIA_PROTEINA } from "./proteina";

/** Fatores gerais de Atwater, os mesmos usados em rotulagem nutricional. */
export const KCAL_POR_G_PROTEINA = 4;
export const KCAL_POR_G_CARBO = 4;
export const KCAL_POR_G_GORDURA = 9;

/**
 * Acceptable Macronutrient Distribution Ranges para adultos.
 *
 * Faixa POPULACIONAL de referência, não meta individual. Entra aqui como
 * contexto: quem treina costuma usar proteína em g/kg, e o resultado disso
 * pode cair fora do AMDR de proteína sem que nada esteja errado. Quando
 * isso acontece a ferramenta mostra o contexto em vez de "corrigir" a conta
 * escondido.
 */
export const AMDR = {
  fonte: "National Academies / Institute of Medicine — Dietary Reference Intakes (2005)",
  proteina: { min: 10, max: 35 },
  carboidrato: { min: 45, max: 65 },
  gordura: { min: 20, max: 35 },
};

// ─── Entrada ─────────────────────────────────────────────────────────────────

export const PESO_MIN = 30;
export const PESO_MAX = 300;
/**
 * Limites técnicos da META CALÓRICA — plausibilidade de digitação, não
 * julgamento clínico. Abaixo de KCAL_MIN a ferramenta não distribui e pede
 * conferência; não existe aqui nenhum piso universal do tipo "mulher precisa
 * de X", que viraria prescrição sem base individual.
 */
export const KCAL_MIN = 800;
export const KCAL_MAX = 8000;

/**
 * Normaliza a digitação brasileira, incluindo separador de milhar.
 *
 * Aqui existe uma ambiguidade real que as outras calculadoras não têm,
 * porque este é o único campo que recebe números na casa dos milhares:
 * "2.200" é dois mil e duzentos, mas "80.5" é oitenta e meio. O mesmo ponto,
 * dois significados.
 *
 * A regra de desambiguação:
 *   - tem vírgula → a vírgula é o decimal e os pontos são milhar ("2.200,5")
 *   - só ponto, com exatamente 3 dígitos depois → milhar ("2.200" = 2200)
 *   - só ponto, com 1 ou 2 dígitos depois → decimal ("80.5" = 80.5)
 *
 * Não é perfeito no papel — "1.500" poderia ser mil e quinhentos ou um vírgula
 * cinco — mas nos dois campos desta ferramenta (calorias e peso) a leitura de
 * milhar é a certa em todos os casos plausíveis, e a alternativa (recusar) é
 * pior para quem só copiou o número da outra calculadora.
 */
export function normalizaNumero(texto: string): number | null {
  const bruto = texto.trim();
  if (bruto === "") return null;

  let limpo: string;
  if (bruto.includes(",")) {
    limpo = bruto.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(bruto)) {
    limpo = bruto.replace(/\./g, "");
  } else {
    limpo = bruto;
  }

  if (!/^\d+(\.\d+)?$/.test(limpo)) return null;
  const n = Number(limpo);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export const PERCENTUAIS_GORDURA = [20, 25, 30, 35] as const;
export const GORDURA_PADRAO = 30;
export const REFEICOES = [3, 4, 5, 6] as const;

// ─── A cascata ───────────────────────────────────────────────────────────────

export interface Macro {
  /** Gramas, em precisão total — o arredondamento é só de exibição. */
  gramas: number;
  kcal: number;
  /** Percentual da meta calórica que este macro ocupa. */
  percentual: number;
}

export interface ResultadoMacros {
  proteina: Macro;
  carboidrato: Macro;
  gordura: Macro;
  /** Soma dos macros JÁ arredondados — pode diferir da meta por alguns kcal. */
  totalArredondado: number;
  metaKcal: number;
  /** A combinação de proteína + gordura estoura a meta: não há o que distribuir. */
  impossivel: boolean;
  /** Quanto passou da meta, quando impossível. */
  excedenteKcal: number;
}

export function calculaProteina(pesoKg: number, gPorKg: number): { gramas: number; kcal: number } {
  const gramas = pesoKg * gPorKg;
  return { gramas, kcal: gramas * KCAL_POR_G_PROTEINA };
}

export function calculaGordura(metaKcal: number, percentual: number): { gramas: number; kcal: number } {
  const kcal = (metaKcal * percentual) / 100;
  return { gramas: kcal / KCAL_POR_G_GORDURA, kcal };
}

export function calculaCarboidrato(
  metaKcal: number,
  proteinaKcal: number,
  gorduraKcal: number
): { gramas: number; kcal: number } {
  const kcal = metaKcal - proteinaKcal - gorduraKcal;
  return { gramas: kcal / KCAL_POR_G_CARBO, kcal };
}

/**
 * A cascata inteira.
 *
 * Quando proteína + gordura já passam da meta, o carboidrato daria negativo.
 * Devolver "−54 g de carboidrato" seria um número sem sentido físico, então
 * a combinação é marcada como impossível e a interface pede ajuste — sem
 * escolher sozinha qual macro sacrificar, que seria montar dieta pela
 * pessoa.
 */
export function calculaMacros(
  metaKcal: number,
  pesoKg: number,
  gPorKg: number,
  percentualGordura: number
): ResultadoMacros {
  const p = calculaProteina(pesoKg, gPorKg);
  const g = calculaGordura(metaKcal, percentualGordura);
  const c = calculaCarboidrato(metaKcal, p.kcal, g.kcal);

  const pct = (kcal: number) => (metaKcal > 0 ? (kcal / metaKcal) * 100 : 0);
  const impossivel = c.kcal < 0;

  const proteina: Macro = { gramas: p.gramas, kcal: p.kcal, percentual: pct(p.kcal) };
  const gordura: Macro = { gramas: g.gramas, kcal: g.kcal, percentual: pct(g.kcal) };
  const carboidrato: Macro = {
    gramas: impossivel ? 0 : c.gramas,
    kcal: impossivel ? 0 : c.kcal,
    percentual: impossivel ? 0 : pct(c.kcal),
  };

  /**
   * O total é recomposto a partir dos GRAMAS ARREDONDADOS, que é o que a
   * pessoa vê. Ele pode não bater exatamente com a meta, e está certo assim:
   * empurrar um macro para forçar a soma seria mentir sobre a conta.
   */
  const totalArredondado =
    Math.round(proteina.gramas) * KCAL_POR_G_PROTEINA +
    Math.round(carboidrato.gramas) * KCAL_POR_G_CARBO +
    Math.round(gordura.gramas) * KCAL_POR_G_GORDURA;

  return {
    proteina,
    carboidrato,
    gordura,
    totalArredondado,
    metaKcal,
    impossivel,
    excedenteKcal: impossivel ? -c.kcal : 0,
  };
}

/** Divisão por refeição — referência de grandeza, não regra de distribuição. */
export function porRefeicao(gramas: number, refeicoes: number): number {
  return Math.round(gramas / refeicoes);
}

/** Formata número no padrão brasileiro. */
export function formataNumero(n: number): string {
  return Math.round(n).toLocaleString("pt-BR");
}

/** O macro está dentro da faixa populacional de referência? */
export function dentroDoAMDR(macro: "proteina" | "carboidrato" | "gordura", percentual: number): boolean {
  const faixa = AMDR[macro];
  return percentual >= faixa.min && percentual <= faixa.max;
}

// ─── Integração com a Calculadora de Déficit ─────────────────────────────────

/**
 * Chave da passagem de calorias entre as duas ferramentas.
 *
 * Usamos sessionStorage e NÃO parâmetro de URL de propósito: uma URL com
 * "?kcal=2150" é copiada, colada, compartilhada e cai em log de servidor e
 * de referrer. O sessionStorage fica só naquela aba, naquele navegador,
 * morre quando a aba fecha, nunca é enviado a lugar nenhum — e a
 * calculadora de macros apaga o valor assim que o usa, para o número não
 * ficar sobrando na sessão.
 *
 * É a única coisa que qualquer das ferramentas grava, e existe só porque a
 * alternativa (a pessoa decorar e redigitar o número) é pior.
 */
export const CHAVE_KCAL = "montinho:macros:kcal";

export function guardaKcalParaMacros(kcal: number): void {
  try {
    sessionStorage.setItem(CHAVE_KCAL, String(Math.round(kcal)));
  } catch {
    /* modo privado ou storage bloqueado: a integração some, a ferramenta continua. */
  }
}

/** Lê e já apaga — o valor serve para preencher o campo uma vez. */
export function consomeKcalDeDeficit(): number | null {
  try {
    const v = sessionStorage.getItem(CHAVE_KCAL);
    if (!v) return null;
    sessionStorage.removeItem(CHAVE_KCAL);
    const n = Number(v);
    return Number.isFinite(n) && n >= KCAL_MIN && n <= KCAL_MAX ? n : null;
  } catch {
    return null;
  }
}

// ─── Textos ──────────────────────────────────────────────────────────────────

export const NOTA_ORCAMENTO =
  "Não existe uma única distribuição possível. Mantendo as mesmas calorias, aumentar um macronutriente significa reduzir a energia disponível para outro.";

export const NOTA_ARREDONDAMENTO =
  "Pequenas diferenças entre a soma dos macros e a sua meta aparecem por causa do arredondamento dos gramas. Não é erro de conta.";

export const NOTA_PROTEINA_FAIXAS =
  "Diferentes ingestões se encaixam em diferentes contextos. As três referências são práticas, não três níveis de eficácia garantida.";

export const NOTA_REFEICOES =
  "Você não precisa dividir os macros igualmente em todas as refeições. Essa visualização serve só para dar noção de quantidade.";

export const NOTA_AMDR_FORA =
  "Sua distribuição fica fora da faixa populacional de referência em pelo menos um macro. Isso é comum quando a proteína é definida em g/kg por quem treina, e não indica erro — é só um contexto a mais.";

export const COMBINACAO_IMPOSSIVEL =
  "A quantidade de proteína e gordura selecionada já ultrapassa sua meta calórica. Ajuste uma das opções antes de continuar.";

export const META_MUITO_BAIXA =
  "Essa meta calórica é muito baixa para que esta calculadora faça uma distribuição padrão com segurança. Confira o valor ou procure orientação individual.";

export const DISCLAIMER =
  "Esta calculadora oferece referências educacionais e não substitui avaliação nutricional individual. Necessidades variam conforme saúde, objetivo, rotina, composição corporal e treinamento.";

export const DISCLAIMER_ESPECIAL =
  "Pessoas com condições de saúde específicas, gestantes, lactantes e menores de idade devem receber orientação individual de profissional habilitado.";

// ─── Onde a calculadora aparece ──────────────────────────────────────────────

/**
 * Mesmo critério das outras três: entra onde o leitor chegou com a pergunta
 * que a ferramenta responde — "como divido minhas calorias?".
 *
 * Artigos de um macro isolado (carboidrato à noite, gordura localizada) e de
 * timing ficam de fora: a dúvida ali não é a divisão do orçamento.
 */
export const ARTIGOS_COM_CALCULADORA_MACROS: string[] = [
  "dieta-flexivel-iifym",
  "como-contar-calorias",
  "recomposicao-corporal",
  "dieta-cutting-para-definicao-muscular",
  "calorias-para-ganhar-massa-muscular",
];
