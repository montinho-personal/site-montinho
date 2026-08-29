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
import { PONTE, consomeNumero, guarda } from "./ferramentas/ponte";

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

/**
 * Para quem cada opção serve, em português de gente.
 *
 * "1,6 g/kg" e "Referência eficaz" são precisos e não dizem nada para quem
 * nunca ouviu falar em grama por quilo. Quem chega aqui não quer escolher
 * entre três números — quer saber qual é o seu. Estas frases respondem isso,
 * e a tela mostra o resultado em gramas ao lado, para o número abstrato virar
 * comida.
 */
export const PARA_QUEM_PROTEINA: Record<string, string> = {
  eficaz: "Se você treina e quer o básico bem feito",
  pratica: "Se você está emagrecendo ou quer margem de sobra",
  superior: "Se o corte é agressivo ou você já treina há anos",
};

export const PARA_QUEM_GORDURA: Record<number, string> = {
  20: "Sobra mais carboidrato para treinar pesado",
  25: "Meio-termo entre energia e saciedade",
  30: "Confortável para a maioria das pessoas",
  35: "Segura mais a fome ao longo do dia",
};

/**
 * O que a escolha de gordura realmente faz.
 *
 * A confusão mais comum é achar que mais gordura significa mais calorias.
 * Não significa: o total já está fixado. O que muda é de onde ele vem — e
 * dizer isso em uma frase evita a pergunta que todo iniciante faz.
 */
export const EXPLICA_TROCA =
  "As calorias do dia são as mesmas nas quatro opções. O que muda é quanto sobra para o carboidrato: mais gordura, menos carboidrato — e vice-versa.";

export const EXPLICA_PROTEINA_SIMPLES =
  "Quanto de proteína por quilo do seu peso. Não existe um número certo para todo mundo — as três estão dentro da faixa que funciona.";
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
 * A mecânica da ponte mora em lib/ferramentas/ponte.ts, compartilhada por
 * todas as ferramentas. Aqui ficam só os nomes específicos desta travessia,
 * com os limites de validação que valem para calorias.
 */
export function guardaKcalParaMacros(kcal: number): void {
  guarda(PONTE.kcal, Math.round(kcal));
}

export function consomeKcalDeDeficit(): number | null {
  return consomeNumero(PONTE.kcal, KCAL_MIN, KCAL_MAX);
}

/**
 * Déficit/TDEE → Macros: traz o peso que a pessoa já informou lá atrás.
 *
 * Esta função faltava, e a falta era invisível no código: o déficit GRAVA o
 * peso na ponte desde sempre, mas ninguém do lado dos macros lia. O valor
 * ficava na sessão até expirar, e a pessoa que acabou de digitar peso, altura
 * e idade na tela anterior era recebida com o campo de peso vazio.
 */
export function consomePesoDeDeficit(): number | null {
  return consomeNumero(PONTE.peso, PESO_MIN, PESO_MAX);
}

/** Macros → Proteína: leva o peso já informado. */
export function guardaPesoParaProteina(peso: number): void {
  guarda(PONTE.peso, peso);
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
  /**
   * Quem lê sobre carboidrato no pré-treino chega na dúvida de quanto
   * carboidrato cabe no dia — que é a divisão que os macros resolvem.
   */
  "carboidrato-antes-do-treino",
  "dieta-flexivel-iifym",
  "como-contar-calorias",
  "recomposicao-corporal",
  "dieta-cutting-para-definicao-muscular",
  "calorias-para-ganhar-massa-muscular",
  /**
   * Carb cycling é redistribuir macros entre os dias; recomposição em
   * déficit exige proteína alta com carboidrato ajustado. Nos dois, a
   * pergunta do leitor é a cascata da calculadora.
   */
  "ciclo-de-carboidratos-carb-cycling",
  "deficit-calorico-e-hipertrofia",
];
