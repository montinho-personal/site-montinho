/**
 * A validação da importação.
 *
 * Este arquivo é o portão. Tudo que vem de fonte externa passa por aqui
 * antes de virar alimento publicável, e o princípio é um só:
 *
 *   RECUSAR, NUNCA CONSERTAR EM SILÊNCIO.
 *
 * A tentação de todo pipeline de importação é "limpar" o dado — trocar "tr"
 * por 0, virar negativo em positivo, preencher vazio com a média. Toda
 * limpeza silenciosa é uma decisão editorial disfarçada de detalhe técnico,
 * e ela some do repositório assim que o commit passa. Aqui, dado estranho
 * vira PROBLEMA com nome e linha, e alguém decide o que fazer.
 */

import type { EstadoDado, Unidade, ValorNutriente } from "./tipos";

export type Gravidade = "erro" | "aviso";

export interface Problema {
  gravidade: Gravidade;
  /** Onde: código do alimento na fonte, ou a linha do arquivo. */
  onde: string;
  campo: string;
  mensagem: string;
}

/**
 * Como a TACO escreve "não tem número aqui".
 *
 * A tabela usa `Tr` para traço e `NA`/`*` para não analisado, e a diferença
 * entre os dois é justamente a que o modelo de dados guarda. Mapear os dois
 * para o mesmo estado destruiria a informação na porta de entrada — depois
 * disso, nenhuma tela consegue recuperá-la.
 */
const MARCA_TRACO = new Set(["tr", "traco", "traço", "*tr"]);
const MARCA_AUSENTE = new Set(["na", "n/a", "-", "--", "", "*", "nd"]);

export interface CelulaLida {
  valor: number | null;
  estado: EstadoDado;
  /** Preenchido quando a célula não foi reconhecida — vira problema. */
  naoReconhecido?: string;
}

/**
 * Lê uma célula da fonte.
 *
 * A vírgula decimal é o ponto mais escorregadio de importar tabela
 * brasileira: "1,5" lido por parser inglês vira 1 (ou 15, dependendo de quem
 * escreveu a limpeza), e o erro passa despercebido porque o número continua
 * parecendo um número. Por isso a vírgula é tratada explicitamente, e o
 * separador de milhar também — "1.234" precisa virar 1234, não 1,234.
 */
export function leCelula(bruto: string): CelulaLida {
  const t = bruto.trim().toLowerCase();

  if (MARCA_TRACO.has(t)) return { valor: null, estado: "traco" };
  if (MARCA_AUSENTE.has(t)) return { valor: null, estado: "naoDisponivel" };

  /**
   * Normalização numérica brasileira. Se tem vírgula, a vírgula é o decimal
   * e o ponto é milhar. Se não tem vírgula, o ponto é o decimal.
   */
  const limpo = t.includes(",")
    ? t.replace(/\./g, "").replace(",", ".")
    : t;

  const n = Number(limpo);
  if (!Number.isFinite(n)) return { valor: null, estado: "naoDisponivel", naoReconhecido: bruto };
  return { valor: n, estado: "analisado" };
}

const UNIDADES: Unidade[] = ["kcal", "kJ", "g", "mg", "mcg"];

/**
 * Tetos de sanidade por unidade, por 100 g.
 *
 * Não são limites nutricionais — são limites do que é fisicamente possível.
 * Nada tem mais de 100 g de proteína em 100 g de comida, e o óleo puro
 * (~900 kcal) é o alimento mais calórico que existe. Um valor acima disso é
 * erro de casa decimal ou de coluna trocada, e é exatamente o tipo de engano
 * que passa batido numa planilha de 600 linhas.
 */
const TETO: Record<Unidade, number> = {
  kcal: 950,
  kJ: 4000,
  g: 100,
  /**
   * 40.000 mg = 40 g por 100 g. O sal puro tem cerca de 39,3 g de sódio por
   * 100 g, e esse é o limite físico de verdade.
   *
   * O teto começou em 5.000 e reprovou o caldo de carne em tablete (22.180
   * mg de sódio), o bacalhau salgado e o sal dietético — todos corretos. Um
   * teto apertado demais não protege de nada: só recusa a comida salgada de
   * verdade, que é justamente a que a pessoa tem motivo para consultar.
   */
  mg: 40000,
  mcg: 500000,
};

/**
 * Limite de quantificação da composição centesimal na TACO, em g/100 g.
 *
 * Vem da legenda da própria tabela. É o que autoriza a única normalização
 * automática deste pipeline — ver `normalizaNegativoResidual`.
 */
export const LQ_COMPOSICAO_CENTESIMAL = 0.1;

/**
 * O carboidrato negativo minúsculo.
 *
 * A TACO calcula carboidrato POR DIFERENÇA: 100 menos umidade, proteína,
 * lipídeos e cinzas. Em alimento que praticamente não tem carboidrato — peixe,
 * fígado, carne —, o acúmulo de arredondamento das outras frações leva a
 * resultado ligeiramente negativo. É artefato aritmético, não medição.
 *
 * Recusar a ficha inteira por -0,027 g descartaria alimentos bons. Trocar por
 * zero em silêncio seria a limpeza que este pipeline existe para não fazer.
 *
 * A saída vem da legenda da própria TACO, que manda usar TRAÇO para valores
 * abaixo do limite de quantificação. Um valor entre -0,1 e 0 está abaixo do
 * limite por definição. Então ele vira traço — a conversão é explícita, tem
 * nome, é contada e aparece no relatório da importação.
 *
 * Negativo MAIOR que o limite continua sendo erro: aí não é arredondamento,
 * é problema de verdade.
 */
export function normalizaNegativoResidual(v: ValorNutriente): { valor: ValorNutriente; convertido: boolean } {
  if (
    v.estado === "analisado" &&
    v.valorPor100g !== null &&
    v.valorPor100g < 0 &&
    v.valorPor100g >= -LQ_COMPOSICAO_CENTESIMAL &&
    v.unidade === "g"
  ) {
    return { valor: { ...v, valorPor100g: null, estado: "traco" }, convertido: true };
  }
  return { valor: v, convertido: false };
}

/** Um valor por si só: negativo, absurdo, unidade desconhecida. */
export function validaValor(v: ValorNutriente, onde: string): Problema[] {
  const ps: Problema[] = [];

  if (!UNIDADES.includes(v.unidade)) {
    ps.push({ gravidade: "erro", onde, campo: v.nutrienteId, mensagem: `unidade desconhecida: "${v.unidade}"` });
    return ps;
  }

  if (v.estado === "analisado") {
    if (v.valorPor100g === null) {
      ps.push({ gravidade: "erro", onde, campo: v.nutrienteId, mensagem: "marcado como analisado mas sem valor" });
    } else if (!Number.isFinite(v.valorPor100g)) {
      ps.push({ gravidade: "erro", onde, campo: v.nutrienteId, mensagem: "valor não é um número finito" });
    } else if (v.valorPor100g < 0) {
      ps.push({ gravidade: "erro", onde, campo: v.nutrienteId, mensagem: `valor negativo: ${v.valorPor100g}` });
    } else if (v.valorPor100g > TETO[v.unidade]) {
      ps.push({
        gravidade: "erro",
        onde,
        campo: v.nutrienteId,
        mensagem: `valor acima do fisicamente possível: ${v.valorPor100g} ${v.unidade} por 100 g`,
      });
    }
  } else if (v.valorPor100g !== null) {
    /* Traço ou ausente COM número é contradição — alguém preencheu na mão. */
    ps.push({
      gravidade: "erro",
      onde,
      campo: v.nutrienteId,
      mensagem: `estado "${v.estado}" não pode carregar valor (${v.valorPor100g})`,
    });
  }

  return ps;
}

/** Nutriente repetido na mesma ficha: alguém leu duas colunas como uma. */
export function validaDuplicatas(vs: ValorNutriente[], onde: string): Problema[] {
  const vistos = new Set<string>();
  const dup = new Set<string>();
  for (const v of vs) {
    if (vistos.has(v.nutrienteId)) dup.add(v.nutrienteId);
    vistos.add(v.nutrienteId);
  }
  return [...dup].map((id) => ({
    gravidade: "erro" as const,
    onde,
    campo: id,
    mensagem: "nutriente aparece mais de uma vez na mesma ficha",
  }));
}

/**
 * Fatores de Atwater — usados para CONFERIR, jamais para substituir.
 *
 * A energia calculada dos macros quase nunca bate exatamente com a energia
 * publicada, e isso é esperado: existem fibras, ácidos orgânicos, álcool,
 * poliois, e cada tabela usa fatores específicos por alimento. Uma diferença
 * grande, porém, costuma significar coluna trocada ou casa decimal perdida.
 *
 * Por isso a divergência é AVISO, não erro, e nunca reescreve o valor
 * oficial. A conta serve para pescar o outlier e mandar um humano olhar.
 */
export const TOLERANCIA_ENERGIA = 0.2;

export function conferenciaEnergetica(
  kcalOficial: number | null,
  proteina: number | null,
  carboidrato: number | null,
  gordura: number | null,
  onde: string,
): Problema[] {
  if (kcalOficial === null || proteina === null || carboidrato === null || gordura === null) return [];
  if (kcalOficial <= 0) return [];

  const calculada = proteina * 4 + carboidrato * 4 + gordura * 9;
  const desvio = Math.abs(calculada - kcalOficial) / kcalOficial;
  if (desvio <= TOLERANCIA_ENERGIA) return [];

  return [{
    gravidade: "aviso",
    onde,
    campo: "energia",
    mensagem:
      `energia publicada (${kcalOficial} kcal) diverge ${(desvio * 100).toFixed(0)}% ` +
      `da soma dos macros (${calculada.toFixed(0)} kcal). Conferir a linha na fonte — ` +
      `o valor oficial NÃO deve ser substituído pela conta.`,
  }];
}

/** A ficha inteira: nome, proveniência e todos os valores. */
export function validaFicha(
  campos: { nome: string; idNaFonte: string; verificadoEm: string; nutrientes: ValorNutriente[] },
): Problema[] {
  const onde = campos.idNaFonte || campos.nome || "(sem identificação)";
  const ps: Problema[] = [];

  if (!campos.nome.trim()) ps.push({ gravidade: "erro", onde, campo: "nome", mensagem: "alimento sem nome" });
  if (!campos.idNaFonte.trim())
    ps.push({ gravidade: "erro", onde, campo: "idNaFonte", mensagem: "sem identificador na fonte — o valor não seria rastreável" });
  if (!campos.verificadoEm.trim())
    ps.push({ gravidade: "erro", onde, campo: "verificadoEm", mensagem: "sem data de verificação" });
  if (campos.nutrientes.length === 0)
    ps.push({ gravidade: "erro", onde, campo: "nutrientes", mensagem: "ficha sem nenhum nutriente" });

  ps.push(...validaDuplicatas(campos.nutrientes, onde));
  for (const v of campos.nutrientes) ps.push(...validaValor(v, onde));

  return ps;
}

/** Só publica ficha sem erro. Aviso passa, e fica no relatório da importação. */
export function podePublicar(problemas: Problema[]): boolean {
  return !problemas.some((p) => p.gravidade === "erro");
}

export function resumo(problemas: Problema[]): string {
  const erros = problemas.filter((p) => p.gravidade === "erro").length;
  const avisos = problemas.length - erros;
  return `${erros} erro(s), ${avisos} aviso(s)`;
}
