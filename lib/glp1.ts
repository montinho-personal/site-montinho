/**
 * O motor da Calculadora de Massa Magra no GLP-1.
 *
 * POR QUE ESTA FERRAMENTA EXISTE
 *
 * O site tem 36 artigos sobre Mounjaro, Ozempic, tirzepatida e
 * retatrutida, e nenhuma ferramenta. Os cinco maiores somam cerca de
 * 5.600 impressões em 90 dias — "retatrutida faz perder músculos" (2.767),
 * "cardio ou musculação no Mounjaro" (1.651), "proteína para quem usa
 * Mounjaro" (582) — e todos recebem a mesma pergunta, que nenhum texto
 * responde com o corpo de quem pergunta: quanto do que eu estou perdendo
 * é músculo?
 *
 * A TESE QUE QUASE NINGUÉM DIZ
 *
 * "Perdi 4 kg de massa magra" não é o mesmo que "perdi 4 kg de músculo".
 * Massa magra no exame inclui água, glicogênio, órgãos — e o tecido de
 * suporte da própria gordura, que some junto com ela (Abe et al., 2019).
 * Emagrecer SEMPRE reduz massa magra, mesmo fazendo tudo certo: é a regra
 * clássica de que cerca de um quarto da perda é massa magra em dieta comum
 * (Heymsfield et al., 2014).
 *
 * Por isso a ferramenta não devolve um número de "músculo perdido". Ela
 * devolve uma FAIXA de massa magra, diz que parte dela é esperada, e
 * mostra a única coisa que a pessoa controla: quanto essa faixa encolhe
 * com treino de força e proteína.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 * Sem treino de força e sem proteína suficiente, os ensaios de GLP-1
 * mediram por DXA de 25% a 40% da perda como massa magra — 40% na
 * subamostra do STEP-1 (semaglutida) e cerca de 25% na do SURMOUNT-1
 * (tirzepatida). Com treino de força e proteína acompanhados, a literatura
 * de preservação leva essa fração para a faixa de 5% a 15%.
 *
 * A ferramenta trabalha com FAIXAS, nunca com número único: a variação
 * entre pessoas é maior que qualquer precisão que um formulário pudesse
 * fingir.
 *
 * O QUE ELA NÃO CONSIDERA, E POR QUÊ
 *
 * A velocidade da perda também pesa: quanto mais rápido o peso cai, maior
 * tende a ser a fração de massa magra. A ferramenta não pergunta em quanto
 * tempo a perda aconteceu porque não existe número publicado bom o
 * suficiente para transformar isso em faixa sem inventar precisão — e um
 * campo a mais que não muda a conta é atrito puro. A metodologia diz isso
 * em voz alta, em vez de fingir que a velocidade não importa.
 *
 * O QUE ESTA FERRAMENTA NUNCA FAZ
 *
 * Falar de dose, de marca, de começar ou de parar medicação. Isso é do
 * prescritor. Aqui só entram composição corporal, treino e proteína — que
 * é o território de um personal trainer.
 */

import { parseNumero } from "./polichinelo";

export { parseNumero };

/* ───────────────────────── Fontes ───────────────────────── */

export interface Fonte {
  rotulo: string;
  rotuloCurto: string;
  url: string;
  resumo: string;
}

export const FONTE_STEP1: Fonte = {
  rotulo:
    "Wilding JPH, Batterham RL, Calanna S, et al. Once-Weekly Semaglutide in Adults with Overweight or Obesity (STEP 1). The New England Journal of Medicine, 2021",
  rotuloCurto: "STEP-1 (semaglutida)",
  url: "https://pubmed.ncbi.nlm.nih.gov/33567185/",
  resumo:
    "na subamostra que fez DXA, a massa magra correspondeu a cerca de 40% do peso perdido — a maior fração relatada entre os ensaios de GLP-1.",
};

export const FONTE_SURMOUNT1: Fonte = {
  rotulo:
    "Look M, Dunn JP, Kushner RF, et al. Body composition changes during weight reduction with tirzepatide in the SURMOUNT-1 study. Diabetes, Obesity and Metabolism, 2025",
  rotuloCurto: "SURMOUNT-1 (tirzepatida)",
  url: "https://pubmed.ncbi.nlm.nih.gov/39996356/",
  resumo:
    "na subamostra de DXA, cerca de 75% do peso perdido foi gordura e 25% foi massa magra — proporção parecida com a de quem emagrece sem medicação.",
};

export const FONTE_HEYMSFIELD: Fonte = {
  rotulo:
    "Heymsfield SB, Gonzalez MC, Shen W, et al. Weight loss composition is one-fourth fat-free mass: a critical review and critique of this widely cited rule. Obesity Reviews, 2014",
  rotuloCurto: "Heymsfield et al. (2014)",
  url: "https://pubmed.ncbi.nlm.nih.gov/24447775/",
  resumo:
    "revisa a regra clássica de que cerca de um quarto do peso perdido é massa magra em restrição calórica comum, e mostra onde ela funciona e onde falha.",
};

export const FONTE_ABE: Fonte = {
  rotulo:
    "Abe T, Thiebaud RS, Loenneke JP. Body Fat Loss Automatically Reduces Lean Mass by Changing the Fat-Free Component of Adipose Tissue. Obesity, 2019",
  rotuloCurto: "Abe et al. (2019)",
  url: "https://pubmed.ncbi.nlm.nih.gov/30677258/",
  resumo:
    "mostra que perder gordura reduz massa magra automaticamente, porque o próprio tecido adiposo tem um componente livre de gordura que some junto — parte da massa magra perdida não é músculo.",
};

export const FONTE_PRESERVACAO: Fonte = {
  rotulo:
    "Prado CM, Phillips SM, Gonzalez MC, Heymsfield SB. Muscle matters: the effects of medically induced weight loss on skeletal muscle. The Lancet Diabetes & Endocrinology, 2024",
  rotuloCurto: "Prado et al. (2024)",
  url: "https://pubmed.ncbi.nlm.nih.gov/38301673/",
  resumo:
    "reúne o que se sabe sobre perda de músculo no emagrecimento por medicamento e aponta treino de força e proteína adequada como as duas intervenções com melhor evidência para atenuá-la.",
};

export const FONTES_GLP1: Fonte[] = [FONTE_STEP1, FONTE_SURMOUNT1, FONTE_HEYMSFIELD, FONTE_ABE, FONTE_PRESERVACAO];

/* ───────────────────────── Entradas ───────────────────────── */

export type TreinoId = "nenhum" | "leve" | "regular";

export interface Treino {
  id: TreinoId;
  nome: string;
  descricao: string;
}

export const TREINOS: Treino[] = [
  { id: "nenhum", nome: "Não faço", descricao: "Sem treino de força na semana." },
  { id: "leve", nome: "1 a 2 vezes", descricao: "Alguma musculação, mas irregular ou sem progressão de carga." },
  { id: "regular", nome: "3 vezes ou mais", descricao: "Musculação regular, com carga que evolui." },
];

/**
 * Faixas de proteína por quilo de peso CORPORAL ATUAL.
 *
 * A auditoria alinhou estes números com os artigos do cluster, que já
 * publicavam "alvo mínimo 1,6 g/kg, ideal 2,0 a 2,2". A calculadora usava
 * 1,6 como meta e pedia 144 g para 90 kg, enquanto o artigo ao lado pedia
 * 180 a 198 — duas metas diferentes na mesma página.
 *
 * PROTEINA_SUFICIENTE é o que basta para a proteção contar como completa:
 * abaixo disso a literatura não sustenta a faixa baixa de perda de massa
 * magra. PROTEINA_ALVO é a meta que a ferramenta mostra, porque é onde os
 * artigos e a literatura de preservação colocam o ideal — e quem já passou
 * de 1,6 não é mandado "melhorar", porque já está protegido.
 */
export const PROTEINA_MINIMA = 1.2;
export const PROTEINA_SUFICIENTE = 1.6;
export const PROTEINA_ALVO = 2.0;
export const PROTEINA_ALVO_MAX = 2.2;

export const PESO_MIN = 30;
export const PESO_MAX = 300;
export const PROTEINA_MAX_G = 500;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const proteinaValida = (g: number | null): g is number => g !== null && g > 0 && g <= PROTEINA_MAX_G;

/** A perda precisa ser positiva e plausível: ninguém perde 70% do corpo. */
export function perdaValida(inicial: number, atual: number): boolean {
  return atual < inicial && (inicial - atual) / inicial <= 0.6;
}

/* ───────────────────────── O modelo ───────────────────────── */

export type Protecao = "nenhuma" | "parcial" | "completa";

export interface Faixa {
  min: number;
  max: number;
}

/**
 * Quanto da perda tende a vir como massa magra, por nível de proteção.
 *
 * "nenhuma" é a faixa dos ensaios sem intervenção de treino e proteína
 * (25% no SURMOUNT-1, 40% no STEP-1). "completa" é a faixa que a
 * literatura de preservação relata quando treino de força e proteína
 * entram juntos. "parcial" fica entre as duas, porque só um dos dois
 * ajuda menos que os dois — e não existe medição separada boa o
 * suficiente para fingir precisão aqui.
 */
export const FRACAO_MASSA_MAGRA: Record<Protecao, Faixa> = {
  nenhuma: { min: 0.25, max: 0.4 },
  parcial: { min: 0.15, max: 0.3 },
  completa: { min: 0.05, max: 0.15 },
};

/** Que proteção a pessoa tem hoje, pelo treino e pela proteína. */
export function protecaoDe(treino: TreinoId, proteinaPorKg: number): Protecao {
  const proteinaOk = proteinaPorKg >= PROTEINA_SUFICIENTE;
  const proteinaMinima = proteinaPorKg >= PROTEINA_MINIMA;
  const treinoOk = treino === "regular";
  if (treinoOk && proteinaOk) return "completa";
  if (treinoOk || proteinaMinima) return "parcial";
  return "nenhuma";
}

export interface Resultado {
  /** Quilos perdidos. */
  perda: number;
  /** Percentual do peso inicial. */
  perdaPct: number;
  protecao: Protecao;
  /** Faixa de massa magra perdida, em kg. */
  massaMagra: Faixa;
  /** Faixa de gordura perdida, em kg. */
  gordura: Faixa;
  /** A mesma perda, se treino e proteína estivessem no lugar. */
  massaMagraProtegida: Faixa;
  /** Quanto de massa magra a mais tende a ser preservado ao proteger. */
  ganhoAoProteger: Faixa;
  proteinaPorKg: number;
  /** Meta de proteína em gramas por dia (o alvo ideal), pelo peso atual. */
  metaProteinaG: number;
  /** O piso que já conta como proteção, em gramas por dia. */
  minimoProteinaG: number;
  /** Quanto falta por dia para chegar no piso de proteção. Zero se já passou. */
  faltaProteinaG: number;
}

export function calcula(
  pesoInicial: number,
  pesoAtual: number,
  treino: TreinoId,
  proteinaG: number,
): Resultado {
  const perda = pesoInicial - pesoAtual;
  const proteinaPorKg = pesoAtual > 0 ? proteinaG / pesoAtual : 0;
  const protecao = protecaoDe(treino, proteinaPorKg);
  const f = FRACAO_MASSA_MAGRA[protecao];
  const p = FRACAO_MASSA_MAGRA.completa;
  const massaMagra = { min: perda * f.min, max: perda * f.max };
  const massaMagraProtegida = { min: perda * p.min, max: perda * p.max };
  const metaProteinaG = pesoAtual * PROTEINA_ALVO;
  const minimoProteinaG = pesoAtual * PROTEINA_SUFICIENTE;
  return {
    perda,
    perdaPct: pesoInicial > 0 ? (perda / pesoInicial) * 100 : 0,
    protecao,
    massaMagra,
    gordura: { min: perda - massaMagra.max, max: perda - massaMagra.min },
    massaMagraProtegida,
    /* Compara ponta com ponta: o melhor caso protegido contra o melhor caso atual. */
    ganhoAoProteger: {
      min: Math.max(0, massaMagra.min - massaMagraProtegida.min),
      max: Math.max(0, massaMagra.max - massaMagraProtegida.max),
    },
    proteinaPorKg,
    metaProteinaG,
    minimoProteinaG,
    /* Falta até o PISO de proteção, não até o ideal: quem está em 1,7 g/kg
       já está protegido e não deve ser mandado corrigir nada. */
    faltaProteinaG: Math.max(0, minimoProteinaG - proteinaG),
  };
}

/** Já está protegido: não há o que a ferramenta recomende mudar. */
export function jaProtegido(r: Resultado): boolean {
  return r.protecao === "completa";
}

/* ───────────────────────── Formatação ───────────────────────── */

export function formataKg(kg: number): string {
  return `${kg.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
}

export function formataFaixaKg(f: Faixa): string {
  /* Uma casa nos dois lados: "6 a 7,5 kg" fica torto ao lado de "2,5 a 4,0 kg". */
  const n = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${n(f.min)} a ${n(f.max)} kg`;
}

export function formataPct(n: number): string {
  return `${Math.round(n)}%`;
}

/* ───────────────────────── Tabela estática ───────────────────────── */

export interface LinhaCenario {
  protecao: Protecao;
  nome: string;
  comoEstar: string;
  faixa: Faixa;
  /** Massa magra perdida numa perda de 10 kg. */
  em10kg: Faixa;
}

export const CENARIOS: LinhaCenario[] = [
  {
    protecao: "nenhuma",
    nome: "Sem treino de força e sem proteína suficiente",
    comoEstar: "É o cenário dos ensaios clínicos, em que ninguém orientou treino nem dieta.",
    faixa: FRACAO_MASSA_MAGRA.nenhuma,
    em10kg: { min: 10 * FRACAO_MASSA_MAGRA.nenhuma.min, max: 10 * FRACAO_MASSA_MAGRA.nenhuma.max },
  },
  {
    protecao: "parcial",
    nome: "Só um dos dois",
    comoEstar: "Treina mas come pouca proteína, ou come bem e não treina força.",
    faixa: FRACAO_MASSA_MAGRA.parcial,
    em10kg: { min: 10 * FRACAO_MASSA_MAGRA.parcial.min, max: 10 * FRACAO_MASSA_MAGRA.parcial.max },
  },
  {
    protecao: "completa",
    nome: "Treino de força regular e proteína adequada",
    comoEstar: "Musculação três vezes por semana com carga que evolui, e pelo menos 1,6 g de proteína por quilo (o alvo ideal é 2,0 a 2,2).",
    faixa: FRACAO_MASSA_MAGRA.completa,
    em10kg: { min: 10 * FRACAO_MASSA_MAGRA.completa.min, max: 10 * FRACAO_MASSA_MAGRA.completa.max },
  },
];

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_NAO_E_TUDO_MUSCULO =
  "Massa magra não é só músculo: inclui água, glicogênio, órgãos e o tecido de suporte da própria gordura, que some junto com ela. Parte dessa perda é esperada mesmo fazendo tudo certo — o que se controla é a parte que é músculo.";

export const NOTA_ESTIMATIVA =
  "São faixas, não medição. Só um exame de composição corporal — DXA, e com o mesmo aparelho nas duas vezes — diz o que de fato aconteceu com o seu corpo.";

export const NOTA_VELOCIDADE =
  "A velocidade da perda também pesa: quanto mais rápido o peso cai, maior tende a ser a fração de massa magra. A calculadora não pergunta isso porque não há número publicado bom o bastante para virar faixa — mas, se o seu peso está caindo muito rápido, leia a sua faixa pelo lado alto.";

export const NOTA_MEDICA =
  "Esta ferramenta não fala de dose, de marca nem de começar ou parar qualquer medicação: isso é do seu prescritor. Ela trata do que cabe a um personal trainer — treino de força, proteína e composição corporal.";

export const NOTA_PROTEINA_APETITE =
  "Chegar na meta de proteína com o apetite suprimido é a parte difícil, e não adianta fingir que não é. Costuma funcionar priorizar a proteína no primeiro prato do dia, quando a fome ainda existe, e usar líquidos quando o sólido não desce.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora.
 *
 * Os quatro de maior impressão do cluster que perguntam exatamente o que
 * ela responde. Os oito artigos que já pertencem ao registro do conversor
 * de peptídeos (lib/concentracao/artigos.ts) ficam de fora: a regra é uma
 * ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_GLP1: string[] = [
  "retatrutida-faz-perder-musculos",
  "mounjaro-faz-perder-musculos",
  "ozempic-faz-perder-musculo",
  "cardio-ou-musculacao-mounjaro",
  "tirzepatida-e-musculacao",
  "semaglutida-e-musculacao",
  "glp1-apetite-suprimido-proteina-musculo",
  "cardio-ou-musculacao-retatrutida",
];
