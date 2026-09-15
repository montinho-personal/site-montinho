/**
 * Concentração em mg/mL e a escala de uma seringa U-100 — só a matemática.
 *
 * Três grandezas que as pessoas misturam, e a mistura já mandou gente para o
 * pronto-socorro:
 *
 *   mg     — quanto da substância existe (massa);
 *   mL     — quanto líquido existe (volume);
 *   mg/mL  — quanto da substância existe em cada mL (concentração).
 *
 * E uma quarta, que não é grandeza nenhuma: a MARCA de uma seringa U-100.
 * Essa escala foi feita para insulina U-100 (100 unidades por mL). Numa
 * seringa U-100 de 1 mL, a marca 100 é 1,00 mL, logo cada marca é 0,01 mL.
 * Para qualquer outro líquido, a marca continua sendo um volume físico — e
 * NÃO vira "unidades" do outro composto.
 *
 * O que este arquivo faz: concentração = mg ÷ mL; marca ÷ 100 = mL;
 * mL × concentração = mg contidos naquele volume.
 *
 * O que este arquivo NÃO faz, de propósito e para sempre: receber "quero X
 * mg" e devolver "coloque na marca Y". Essa função (o solver reverso) é a
 * que transforma uma explicação num instrumento de dose de injetável, e
 * scripts/concentracao-test.ts reprova o arquivo se ela aparecer.
 *
 * Tudo puro: sem DOM, sem rede, sem armazenamento. Os números da pessoa não
 * saem do navegador dela.
 */

/** Limites de sanidade. Fora deles o número está errado, não a pessoa. */
export const MG_MIN = 0.001;
export const MG_MAX = 100_000;
export const ML_MIN = 0.01;
export const ML_MAX = 1_000;
export const CONCENTRACAO_MIN = 0.001;
export const CONCENTRACAO_MAX = 100_000;

/** A escala U-100 de 1 mL: marca 100 = 1,00 mL. */
export const U100_MARCAS_POR_ML = 100;
export const MARCA_MIN = 1;
export const MARCA_MAX = 100;

/** As marcas da tabela educacional. Nenhuma é "recomendada"; são degraus da régua. */
export const MARCAS_TABELA = [5, 10, 15, 20, 25, 30, 40, 50, 100] as const;

/**
 * Tolerância da conferência de instrução: 2% relativo, com um piso absoluto
 * para não acusar diferença de arredondamento em quantidades minúsculas.
 * "2,4 mg" e "2,40 mg" são a mesma coisa; "2,4 mg" e "2,5 mg" não são.
 */
export const TOLERANCIA_RELATIVA = 0.02;
export const TOLERANCIA_ABSOLUTA_MG = 0.005;

/**
 * Lê um número digitado em português: aceita vírgula e ponto, espaços em
 * volta, e nada mais. Devolve null para vazio, texto, sinal, zero,
 * negativo, NaN e Infinity — todos viram "confira o valor", nunca um número
 * inventado.
 */
export function lerNumero(texto: string | null | undefined): number | null {
  if (texto == null) return null;
  const limpo = String(texto).trim().replace(/\s+/g, "").replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(limpo) && !/^\.\d+$/.test(limpo)) return null;
  const n = Number(limpo);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export type Erro = "vazio" | "invalido" | "fora_do_limite";

function validar(texto: string | null | undefined, min: number, max: number): { valor: number | null; erro: Erro | null } {
  if (texto == null || String(texto).trim() === "") return { valor: null, erro: "vazio" };
  const n = lerNumero(texto);
  if (n === null) return { valor: null, erro: "invalido" };
  if (n < min || n > max) return { valor: null, erro: "fora_do_limite" };
  return { valor: n, erro: null };
}

export const validarMg = (t: string | null | undefined) => validar(t, MG_MIN, MG_MAX);
export const validarMl = (t: string | null | undefined) => validar(t, ML_MIN, ML_MAX);
export const validarConcentracao = (t: string | null | undefined) => validar(t, CONCENTRACAO_MIN, CONCENTRACAO_MAX);

/** Marca da seringa: inteiro de 1 a 100. Meia marca existe em algumas seringas, mas a V1 pede a marca cheia. */
export function validarMarca(texto: string | number | null | undefined): { valor: number | null; erro: Erro | null } {
  if (texto == null || String(texto).trim() === "") return { valor: null, erro: "vazio" };
  const n = typeof texto === "number" ? texto : lerNumero(String(texto));
  if (n === null || !Number.isInteger(n)) return { valor: null, erro: "invalido" };
  if (n < MARCA_MIN || n > MARCA_MAX) return { valor: null, erro: "fora_do_limite" };
  return { valor: n, erro: null };
}

/** concentração (mg/mL) = quantidade total (mg) ÷ volume final (mL). */
export function calcularConcentracao(mgTotal: number, mlFinal: number): number | null {
  if (!Number.isFinite(mgTotal) || !Number.isFinite(mlFinal) || mgTotal <= 0 || mlFinal <= 0) return null;
  return mgTotal / mlFinal;
}

/** Numa seringa U-100 de 1 mL: volume (mL) = marca ÷ 100. Só vale para a escala U-100. */
export function marcaU100ParaMl(marca: number): number | null {
  if (!Number.isFinite(marca) || marca <= 0) return null;
  return marca / U100_MARCAS_POR_ML;
}

/** quantidade contida (mg) = concentração (mg/mL) × volume (mL). Descreve o conteúdo de um volume; não é dose. */
export function quantidadeNoVolume(concentracaoMgMl: number, volumeMl: number): number | null {
  if (!Number.isFinite(concentracaoMgMl) || !Number.isFinite(volumeMl) || concentracaoMgMl <= 0 || volumeMl <= 0) return null;
  return concentracaoMgMl * volumeMl;
}

/** Marca U-100 → volume → quantidade contida, numa concentração conhecida. */
export function lerMarca(concentracaoMgMl: number, marca: number): { marca: number; volumeMl: number; mg: number } | null {
  const ml = marcaU100ParaMl(marca);
  if (ml === null) return null;
  const mg = quantidadeNoVolume(concentracaoMgMl, ml);
  if (mg === null) return null;
  return { marca, volumeMl: ml, mg };
}

/** A tabela educacional inteira, para uma concentração. */
export function tabelaU100(concentracaoMgMl: number) {
  return MARCAS_TABELA.map((m) => lerMarca(concentracaoMgMl, m)!).filter(Boolean);
}

export type ResultadoConferencia =
  | { status: "compativel"; mgInformado: number; marca: number; volumeMl: number; mgContido: number }
  | { status: "nao_corresponde"; mgInformado: number; marca: number; volumeMl: number; mgContido: number }
  | { status: "invalido" };

/**
 * Conferência de uma instrução já recebida de profissional habilitado:
 * "X mg na marca Y" bate com a concentração cadastrada?
 *
 * Devolve compatível ou não. NÃO devolve "o certo seria a marca Z": achar
 * a inconsistência é serviço; corrigir a dose é prescrição, e isso não
 * cabe aqui. Quem corrige é o prescritor ou o farmacêutico, com o frasco na
 * mão.
 */
export function conferirInstrucao(concentracaoMgMl: number, mgInformado: number, marca: number): ResultadoConferencia {
  const leitura = lerMarca(concentracaoMgMl, marca);
  if (!leitura || !Number.isFinite(mgInformado) || mgInformado <= 0) return { status: "invalido" };
  const diferenca = Math.abs(leitura.mg - mgInformado);
  const tolerancia = Math.max(TOLERANCIA_ABSOLUTA_MG, TOLERANCIA_RELATIVA * Math.max(leitura.mg, mgInformado));
  const base = { mgInformado, marca, volumeMl: leitura.volumeMl, mgContido: leitura.mg };
  return diferenca <= tolerancia ? { status: "compativel", ...base } : { status: "nao_corresponde", ...base };
}

// ---------------------------------------------------------------------------
// Formatação em português. Vírgula decimal, sem zeros de enfeite, sem NaN.
// ---------------------------------------------------------------------------

function fmt(n: number, maxDecimais: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: maxDecimais });
}

/** mg: até 3 casas, porque 0,125 mg é uma quantidade real e 0,13 seria mentira. */
export const formatarMg = (n: number) => fmt(n, 3);
/** mL: sempre duas casas — "0,10 mL" se lê melhor que "0,1 mL" ao lado de "0,01". */
export const formatarMl = (n: number) => (Number.isFinite(n) ? n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—");
/** mg/mL: até 3 casas. */
export const formatarConcentracao = (n: number) => fmt(n, 3);
