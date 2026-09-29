/**
 * Limite de peso da Men's Classic Physique PROFISSIONAL (IFBB Pro League).
 *
 * FONTE ÚNICA. A calculadora, a tabela da página, o componente compacto dos
 * artigos e os testes leem daqui. Nenhum número de limite pode aparecer
 * escrito à mão em outro arquivo.
 *
 * A liga publica a tabela em polegadas e libras ("up to and including"), e é
 * isso que guardamos: POLEGADAS e LIBRAS são os valores oficiais; cm e kg são
 * derivados (1" = 2,54 cm exatos; 1 lb = 0,45359237 kg exatos) e arredondados
 * a uma casa só para exibir.
 *
 * FRONTEIRA EM CM. A tabela brasileira publica os limites em cm com uma casa
 * (64" = 162,56 cm → "até 162,6 cm"). A calculadora em cm compara a altura
 * digitada com esse valor publicado, com "até e incluindo": 162,6 cm cai na
 * primeira faixa, 162,7 na segunda. Em pés/polegadas a comparação é exata,
 * em polegadas.
 *
 * NÃO É A TABELA AMADORA. NPC Worldwide e outras federações usam limites
 * diferentes (algumas por fórmula em cm). Não misturar.
 *
 * MANUTENÇÃO: os valores são estáticos. Quando a liga mudar a regra, atualizar
 * FAIXAS e DATA_CONFERENCIA, e rodar scripts/classic-physique-test.ts.
 */

export const FONTE_CLASSIC = {
  nome: "IFBB Professional League — Pro Competition Rules (Men's Classic Physique)",
  url: "https://www.ifbbpro.com/rules/",
};

/** Data em que a tabela foi conferida contra a fonte oficial (ISO). */
export const DATA_CONFERENCIA = "2026-09-25";
export const DATA_CONFERENCIA_TEXTO = "25 de setembro de 2026";

const LB_KG = 0.45359237;
const POL_CM = 2.54;

/** Faixas oficiais: altura máxima em polegadas (inclusive) → peso máximo em libras. `null` = acima da última faixa. */
const OFICIAL: { polegadas: number | null; libras: number }[] = [
  { polegadas: 64, libras: 177 },
  { polegadas: 65, libras: 182 },
  { polegadas: 66, libras: 187 },
  { polegadas: 67, libras: 192 },
  { polegadas: 68, libras: 197 },
  { polegadas: 69, libras: 204 },
  { polegadas: 70, libras: 212 },
  { polegadas: 71, libras: 219 },
  { polegadas: 72, libras: 227 },
  { polegadas: 73, libras: 234 },
  { polegadas: 74, libras: 242 },
  { polegadas: 75, libras: 249 },
  { polegadas: 76, libras: 256 },
  { polegadas: 77, libras: 263 },
  { polegadas: 78, libras: 270 },
  { polegadas: 79, libras: 277 },
  { polegadas: null, libras: 284 },
];

export interface Faixa {
  indice: number;
  /** Teto de altura em polegadas; null na última faixa ("acima de"). */
  polegadas: number | null;
  /** Teto de altura em cm, como publicado (1 casa); null na última faixa. */
  cm: number | null;
  libras: number;
  kg: number;
  /** "5'11"" — null na última. */
  pesPolegadas: string | null;
}

const um = (n: number) => Math.round(n * 10) / 10;

export const FAIXAS: Faixa[] = OFICIAL.map((f, i) => ({
  indice: i,
  polegadas: f.polegadas,
  cm: f.polegadas === null ? null : um(f.polegadas * POL_CM),
  libras: f.libras,
  kg: um(f.libras * LB_KG),
  pesPolegadas: f.polegadas === null ? null : `${Math.floor(f.polegadas / 12)}'${f.polegadas % 12}"`,
}));

export const ULTIMA_CM = FAIXAS[FAIXAS.length - 2].cm!; // 200,7

/** Faixa pela altura em cm (comparação com o teto publicado, inclusive). */
export function faixaPorCm(alturaCm: number): Faixa {
  // A altura real, sem arredondar: 180,35 cm já passou do teto de 180,3.
  for (const f of FAIXAS) if (f.cm !== null && alturaCm <= f.cm + 1e-9) return f;
  return FAIXAS[FAIXAS.length - 1];
}

/** Faixa pela altura em polegadas totais (comparação exata, inclusive). */
export function faixaPorPolegadas(polegadas: number): Faixa {
  for (const f of FAIXAS) if (f.polegadas !== null && polegadas <= f.polegadas + 1e-9) return f;
  return FAIXAS[FAIXAS.length - 1];
}

export const cmParaPolegadas = (cm: number) => cm / POL_CM;
export const polegadasParaCm = (p: number) => p * POL_CM;
export const kgParaLb = (kg: number) => kg / LB_KG;
export const lbParaKg = (lb: number) => lb * LB_KG;

/* ───────────── Entrada ───────────── */

export const ALTURA_CM_MIN = 120;
export const ALTURA_CM_MAX = 250;
export const PESO_KG_MIN = 30;
export const PESO_KG_MAX = 250;

/** Número digitado: aceita vírgula ou ponto decimal; devolve null para texto. */
export function parseNumero(t: string): number | null {
  const s = t.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export type ErroAltura = "vazio" | "invalido" | "metros" | "fora";

/**
 * Altura em cm. "1.80" / "1,80" num campo de cm é ambíguo: não convertemos
 * em silêncio — devolvemos o erro "metros" para a interface perguntar.
 */
export function validaAlturaCm(t: string): { cm: number } | { erro: ErroAltura } {
  if (!t.trim()) return { erro: "vazio" };
  const n = parseNumero(t);
  if (n === null || n <= 0) return { erro: "invalido" };
  if (n >= 1 && n < 3) return { erro: "metros" };
  if (n < ALTURA_CM_MIN || n > ALTURA_CM_MAX) return { erro: "fora" };
  return { cm: n };
}

export const MENSAGEM_ERRO_ALTURA: Record<ErroAltura, string> = {
  vazio: "Digite sua altura para calcular.",
  invalido: "Use só números — por exemplo, 180 ou 175,5.",
  metros: "Parece que você digitou em metros. Neste campo, a altura vai em centímetros: 180 em vez de 1,80.",
  fora: `Digite uma altura entre ${ALTURA_CM_MIN} e ${ALTURA_CM_MAX} cm.`,
};

/* ───────────── Resultado ───────────── */

export interface Resultado {
  faixa: Faixa;
  alturaCm: number;
  pesoKg: number | null;
  /** positivo = abaixo do teto; negativo = acima. */
  diferencaKg: number | null;
  vizinhas: Faixa[];
}

export function calcula(alturaCm: number, pesoKg: number | null, polegadas?: number): Resultado {
  const faixa = polegadas !== undefined ? faixaPorPolegadas(polegadas) : faixaPorCm(alturaCm);
  const i = faixa.indice;
  return {
    faixa,
    alturaCm,
    pesoKg,
    diferencaKg: pesoKg === null ? null : um(faixa.kg - pesoKg),
    vizinhas: FAIXAS.slice(Math.max(0, i - 1), Math.min(FAIXAS.length, i + 2)),
  };
}

export const fmt1 = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const fmtAlturaM = (cm: number) => `${(cm / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 3 })} m`;
export const fmtFaixaAltura = (f: Faixa) => (f.cm === null ? `acima de ${fmt1(ULTIMA_CM)} cm (6'7")` : `até ${fmt1(f.cm)} cm (${f.pesPolegadas})`);

/** Frase da diferença, sem julgamento e sem "pode/precisa ganhar". */
export function fraseDiferenca(d: number): string {
  if (Math.abs(d) < 0.05) return "Seu peso atual está exatamente no teto regulamentar dessa faixa.";
  return d > 0
    ? `Seu peso atual está ${fmt1(d)} kg abaixo do teto regulamentar dessa faixa.`
    : `Seu peso atual está ${fmt1(-d)} kg acima do limite regulamentar dessa faixa.`;
}

/** Alturas de exemplo (atalhos clicáveis). */
export const EXEMPLOS_CM = [170, 175, 180, 185, 190];

/** Ramon Dino: pesagem oficial do Olympia 2026 (23/09/2026), 1,81 m, 102,5 kg. */
export const RAMON = { alturaCm: 181, pesagemKg: 102.5, data: "23 de setembro de 2026" };

/**
 * Artigos com a calculadora EMBUTIDA no ponto certo do texto, pelo marcador
 * <!--CALCULADORA_CLASSIC:completa|compacta--> (ver components/blog/Prosa.tsx).
 * Só onde há contexto: o artigo de peso de Ramon (completa) e o resultado
 * da Classic (compacta, depois do resultado).
 */
export const ARTIGOS_COM_CALCULADORA_CLASSIC: string[] = ["ramon-dino-peso-altura", "resultado-classic-physique-mr-olympia-2026", "categorias-do-fisiculturismo"];
