/**
 * O motor da Calculadora de Descanso Entre Séries.
 *
 * O QUE ELE RESPONDE
 *
 * "Qual FAIXA de descanso faz sentido para esta série?" — nunca "qual o
 * tempo perfeito". A fisiologia não tem precisão de segundos: o motor
 * trabalha em blocos de 30 segundos e entrega uma faixa e um ponto de
 * partida, que a pessoa ajusta pela própria performance.
 *
 * COMO ELE DECIDE (regras transparentes, sem fórmula fisiológica falsa)
 *
 *   faixa = BASE do objetivo
 *         + DEMANDA do exercício
 *         + REPETIÇÕES (só pesa nas faixas de carga alta)
 *         + ESFORÇO (proximidade da falha, RIR)
 *         + EXPERIÊNCIA (só mexe no teto, e pouco)
 *   → arredonda para baixo em blocos de 30 s, com piso e teto por objetivo.
 *
 * DE ONDE VÊM AS DIREÇÕES (os números são aproximações, as direções não)
 *
 * - Singer et al., 2024 (Frontiers in Sports and Active Living, meta-análise
 *   bayesiana, 9 estudos): pequena vantagem para descansos acima de ~60 s na
 *   hipertrofia de braço e coxa, com muita sobreposição e heterogeneidade;
 *   acima de ~90 s, diferença não demonstrada. Por isso a base da hipertrofia
 *   começa em 1:30 e nenhuma regra empurra para "60 segundos".
 * - Grgic et al., 2017 (European Journal of Sport Science): curtos e longos
 *   funcionam para iniciantes; para treinados, possível vantagem dos longos.
 *   Por isso a experiência mexe no teto, de leve.
 * - Grgic et al., 2018 (Sports Medicine): para maximizar força em treinados,
 *   descansos acima de 2 minutos. Por isso a base da força começa em 2:00 e
 *   chega a 5:00 em compostos pesados de poucas repetições.
 * - Séries mais perto da falha geram mais fadiga e quedas maiores de
 *   desempenho na série seguinte; compostos que recrutam muita massa
 *   muscular cansam mais o sistema. Daí os modificadores de RIR e demanda.
 */

/* ───────────── Entradas ───────────── */

export type Objetivo = "hipertrofia" | "forca" | "resistencia" | "potencia";
export type Demanda = "muito_exigente" | "composto_pesado" | "composto_moderado" | "isolador";
export type FaixaReps = "1-3" | "4-6" | "7-10" | "11-15" | "16+";
export type Rir = 0 | 1 | 2 | 3 | 4;
export type Esforco = "tranquila" | "dificil" | "muito_dificil" | "quase_nao";
export type Experiencia = "iniciante" | "intermediario" | "avancado";

export const OBJETIVOS: { id: Objetivo; nome: string }[] = [
  { id: "hipertrofia", nome: "Hipertrofia" },
  { id: "forca", nome: "Força" },
  { id: "resistencia", nome: "Resistência muscular" },
  { id: "potencia", nome: "Potência / performance" },
];

export const DEMANDAS: { id: Demanda; nome: string; texto: string }[] = [
  { id: "muito_exigente", nome: "Composto muito exigente", texto: "agachamento, terra, leg press pesado" },
  { id: "composto_pesado", nome: "Composto pesado", texto: "supino, remada livre, desenvolvimento" },
  { id: "composto_moderado", nome: "Composto moderado", texto: "máquinas, puxada, smith, hack" },
  { id: "isolador", nome: "Isolador", texto: "rosca, tríceps, elevação lateral, cadeira" },
];

export const RIR_TEXTO: Record<Rir, string> = {
  0: "Você provavelmente não conseguiria completar outra repetição.",
  1: "Talvez conseguisse mais uma.",
  2: "Aproximadamente mais duas.",
  3: "A série terminou relativamente longe da falha.",
  4: "A série terminou longe da falha: sobraram quatro ou mais.",
};

/** Só uma aproximação para quem não sabe o RIR — nunca é exibida como RIR exato. */
export const ESFORCO_PARA_RIR: Record<Esforco, Rir> = { tranquila: 4, dificil: 2, muito_dificil: 1, quase_nao: 0 };
export const ESFORCOS: { id: Esforco; nome: string }[] = [
  { id: "tranquila", nome: "Tranquila" },
  { id: "dificil", nome: "Difícil" },
  { id: "muito_dificil", nome: "Muito difícil" },
  { id: "quase_nao", nome: "Quase não consegui terminar" },
];

export const faixaDeReps = (n: number): FaixaReps => (n <= 3 ? "1-3" : n <= 6 ? "4-6" : n <= 10 ? "7-10" : n <= 15 ? "11-15" : "16+");

/* ───────────── Regras (segundos) ───────────── */

/**
 * Base por objetivo, para um composto moderado, 7–15 reps, RIR 2.
 * Hipertrofia 1:30–2:30: Singer 2024 não sustenta "60 s" e não mostra ganho
 * claro acima de ~90 s, então a faixa parte daí. Força 2:00–3:00: Grgic 2018.
 * Resistência 0:45–1:30: o objetivo aceita fadiga acumulada. Potência usa a
 * base da força: o que importa é a qualidade de cada repetição.
 */
export const BASE: Record<Objetivo, [number, number]> = {
  hipertrofia: [90, 150],
  forca: [120, 180],
  resistencia: [45, 90],
  potencia: [120, 180],
};

/** Demanda do exercício: mais massa muscular e mais carga → mais recuperação sistêmica. */
export const MOD_DEMANDA: Record<Demanda, [number, number]> = {
  muito_exigente: [45, 75],
  composto_pesado: [30, 60],
  composto_moderado: [0, 15],
  isolador: [-30, -30],
};

/** Poucas repetições = carga alta perto do máximo, que pede mais tempo para repetir o desempenho. */
export const MOD_REPS: Record<FaixaReps, [number, number]> = {
  "1-3": [15, 45],
  "4-6": [15, 30],
  "7-10": [0, 0],
  "11-15": [0, 0],
  "16+": [0, 0],
};

/** Mais perto da falha → mais fadiga → mais descanso. Longe da falha tolera menos. */
export const MOD_RIR: Record<Rir, [number, number]> = {
  0: [30, 30],
  1: [15, 30],
  2: [0, 0],
  3: [-15, 0],
  4: [-30, -30],
};

/** Experiência só ajusta o teto, de leve (Grgic 2017): não domina o cálculo. */
export const MOD_EXPERIENCIA: Record<Experiencia, number> = { iniciante: -15, intermediario: 0, avancado: 15 };

export const LIMITES: Record<Objetivo, [number, number]> = {
  hipertrofia: [60, 270],
  forca: [120, 300],
  resistencia: [30, 120],
  potencia: [120, 300],
};

/* ───────────── Cálculo ───────────── */

export interface Entrada {
  objetivo: Objetivo;
  demanda: Demanda;
  reps: FaixaReps;
  rir: Rir;
  experiencia?: Experiencia;
}

export interface Resultado { min: number; max: number; inicio: number }

const bloco = (s: number) => Math.floor(s / 30) * 30;

export function calcula(e: Entrada): Resultado {
  const [b0, b1] = BASE[e.objetivo];
  const [d0, d1] = MOD_DEMANDA[e.demanda];
  const [r0, r1] = MOD_REPS[e.reps];
  const [f0, f1] = MOD_RIR[e.rir];
  const x = e.experiencia ? MOD_EXPERIENCIA[e.experiencia] : 0;
  const [lo, hi] = LIMITES[e.objetivo];
  let min = bloco(Math.max(lo, b0 + d0 + r0 + f0));
  let max = bloco(Math.min(hi, b1 + d1 + r1 + f1 + x));
  if (max < min + 30) max = min + 30;
  min = Math.max(lo, min);
  const inicio = Math.round((min + (max - min) / 3) / 30) * 30;
  return { min, max, inicio: Math.min(max, Math.max(min, inicio)) };
}

/** Modo rápido: só o tipo de exercício e o esforço, assumindo hipertrofia em 7–10 reps. */
export type TipoRapido = "isolador" | "composto" | "composto_pesado";
export type EsforcoRapido = "moderado" | "dificil" | "muito_dificil";
export function calculaRapido(t: TipoRapido, esf: EsforcoRapido): Resultado {
  const demanda: Demanda = t === "isolador" ? "isolador" : t === "composto" ? "composto_moderado" : "muito_exigente";
  const rir: Rir = esf === "moderado" ? 3 : esf === "dificil" ? 2 : 0;
  return calcula({ objetivo: "hipertrofia", demanda, reps: "7-10", rir });
}

/* ───────────── Explicação ───────────── */

const NOME_DEMANDA: Record<Demanda, string> = {
  muito_exigente: "envolve muita massa muscular e cansa o corpo todo",
  composto_pesado: "é um composto que costuma ser feito com carga alta",
  composto_moderado: "é um composto com demanda moderada",
  isolador: "é um isolador, que trabalha pouca massa muscular",
};

export function explica(e: Entrada, nomeExercicio?: string): string {
  const ex = nomeExercicio ? nomeExercicio : "Esse exercício";
  const perto = e.rir <= 1;
  const longe = e.rir >= 3;
  if (e.demanda === "isolador" && perto)
    return `Apesar de ${nomeExercicio ? nomeExercicio.toLowerCase() : "ser"} um isolador, a série terminou muito perto da falha. Um pouco mais de descanso ajuda a preservar as próximas séries.`;
  if (e.demanda === "isolador")
    return `Como ${nomeExercicio ? nomeExercicio.toLowerCase() + " é" : "é"} um isolador e a série ${longe ? "terminou longe da falha" : "não foi até a falha"}, um descanso mais curto tende a ser suficiente.`;
  if (e.objetivo === "forca" || e.objetivo === "potencia")
    return `${ex} ${NOME_DEMANDA[e.demanda]}, e no treino de ${e.objetivo === "forca" ? "força" : "potência"} o que importa é repetir a carga e a qualidade. Descansos mais longos ajudam a chegar inteiro na próxima série.`;
  return `${ex} ${NOME_DEMANDA[e.demanda]}${perto ? " e a sua série terminou muito perto da falha" : ""}. ${perto || e.demanda === "muito_exigente" ? "Mais descanso pode ajudar a preservar o desempenho na próxima série." : "Esse intervalo tende a permitir recuperação suficiente sem alongar o treino à toa."}`;
}

export const fmtTempo = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
export const fmtFaixa = (r: Resultado) => `${fmtTempo(r.min)}–${fmtTempo(r.max)}`;

/* ───────────── Exercícios ───────────── */

export interface Exercicio { nome: string; demanda: Demanda; termos?: string[] }

/** Base simples. As categorias são ponto de partida, não regra: a pessoa pode trocar. */
export const EXERCICIOS: Exercicio[] = [
  { nome: "Agachamento livre", demanda: "muito_exigente", termos: ["agachamento"] },
  { nome: "Agachamento frontal", demanda: "muito_exigente" },
  { nome: "Levantamento terra", demanda: "muito_exigente", termos: ["terra", "deadlift"] },
  { nome: "Terra romeno / stiff", demanda: "composto_pesado", termos: ["stiff", "romeno"] },
  { nome: "Leg press", demanda: "muito_exigente", termos: ["leg"] },
  { nome: "Agachamento búlgaro", demanda: "composto_pesado", termos: ["bulgaro"] },
  { nome: "Afundo / passada", demanda: "composto_pesado", termos: ["afundo", "passada"] },
  { nome: "Hack squat", demanda: "composto_moderado", termos: ["hack"] },
  { nome: "Agachamento no smith", demanda: "composto_moderado", termos: ["smith"] },
  { nome: "Supino reto", demanda: "composto_pesado", termos: ["supino"] },
  { nome: "Supino inclinado", demanda: "composto_pesado" },
  { nome: "Supino com halteres", demanda: "composto_pesado" },
  { nome: "Supino máquina", demanda: "composto_moderado" },
  { nome: "Paralelas / mergulho", demanda: "composto_moderado", termos: ["paralela", "mergulho", "dips"] },
  { nome: "Flexão de braço", demanda: "composto_moderado", termos: ["flexao"] },
  { nome: "Remada curvada", demanda: "composto_pesado", termos: ["remada"] },
  { nome: "Remada unilateral (serrote)", demanda: "composto_moderado", termos: ["serrote"] },
  { nome: "Remada baixa / máquina", demanda: "composto_moderado" },
  { nome: "Puxada frontal", demanda: "composto_moderado", termos: ["puxada", "pulldown"] },
  { nome: "Barra fixa", demanda: "composto_pesado", termos: ["barra"] },
  { nome: "Desenvolvimento", demanda: "composto_pesado", termos: ["desenvolvimento", "militar"] },
  { nome: "Desenvolvimento máquina", demanda: "composto_moderado" },
  { nome: "Hip thrust", demanda: "composto_pesado", termos: ["elevacao pelvica", "hip"] },
  { nome: "Elevação lateral", demanda: "isolador", termos: ["lateral"] },
  { nome: "Elevação frontal", demanda: "isolador" },
  { nome: "Crucifixo / peck deck", demanda: "isolador", termos: ["crucifixo", "peck", "voador", "fly"] },
  { nome: "Crossover", demanda: "isolador" },
  { nome: "Rosca direta", demanda: "isolador", termos: ["rosca", "biceps"] },
  { nome: "Rosca martelo", demanda: "isolador" },
  { nome: "Tríceps pulley", demanda: "isolador", termos: ["triceps", "pulley"] },
  { nome: "Tríceps testa / francês", demanda: "isolador", termos: ["testa", "frances"] },
  { nome: "Cadeira extensora", demanda: "isolador", termos: ["extensora"] },
  { nome: "Mesa flexora", demanda: "isolador", termos: ["flexora"] },
  { nome: "Cadeira abdutora / adutora", demanda: "isolador", termos: ["abdutora", "adutora"] },
  { nome: "Panturrilha", demanda: "isolador", termos: ["gemeos"] },
  { nome: "Face pull / crucifixo inverso", demanda: "isolador", termos: ["face pull", "inverso"] },
  { nome: "Encolhimento", demanda: "isolador" },
  { nome: "Abdominal", demanda: "isolador", termos: ["prancha"] },
];

export const normaliza = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

/**
 * Nome exato primeiro; depois o termo mais longo CONTIDO no que a pessoa
 * digitou ("supino reto com barra" → Supino reto); por último, enquanto ela
 * ainda digita, o nome mais curto que começa com o texto.
 */
export function encontraExercicio(texto: string): Exercicio | null {
  const t = normaliza(texto);
  if (t.length < 3) return null;
  const exato = EXERCICIOS.find((x) => normaliza(x.nome) === t);
  if (exato) return exato;
  let melhor: { ex: Exercicio; n: number } | null = null;
  for (const ex of EXERCICIOS) for (const termo of [ex.nome, ...(ex.termos ?? [])]) {
    const n = normaliza(termo);
    if (n.length >= 4 && t.includes(n) && (!melhor || n.length > melhor.n)) melhor = { ex, n: n.length };
  }
  if (melhor) return melhor.ex;
  const prefixo = EXERCICIOS.filter((x) => normaliza(x.nome).startsWith(t)).sort((a, b) => a.nome.length - b.nome.length);
  return prefixo[0] ?? null;
}

/* ───────────── Tempo de treino ───────────── */

/**
 * Minutos de intervalo no treino: séries × descanso médio. A última série não
 * tem descanso, mas a troca entre exercícios costuma compensar: é aproximação.
 */
export const minutosDeDescanso = (series: number, descansoMin: number) => Math.max(0, series) * descansoMin;

/* ───────────── Fontes e artigos ───────────── */

export const FONTES_DESCANSO = [
  { rotulo: "Singer A et al. Give it a rest: a systematic review with Bayesian meta-analysis on the effect of inter-set rest interval duration on muscle hypertrophy. Frontiers in Sports and Active Living, 2024", url: "https://pubmed.ncbi.nlm.nih.gov/39205815/" },
  { rotulo: "Grgic J et al. The effects of short versus long inter-set rest intervals in resistance training on measures of muscle hypertrophy: a systematic review. European Journal of Sport Science, 2017", url: "https://pubmed.ncbi.nlm.nih.gov/28641044/" },
  { rotulo: "Grgic J et al. Effects of rest interval duration in resistance training on measures of muscular strength: a systematic review. Sports Medicine, 2018", url: "https://vuir.vu.edu.au/38537/" },
];

/** Artigos que embutem a calculadora inteira, logo depois da primeira seção. */
export const ARTIGOS_COM_CALCULADORA_DESCANSO: string[] = ["descanso-entre-series"];
