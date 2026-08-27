/**
 * Base de exercícios da Calculadora de Volume.
 *
 * Fonte única de verdade da classificação muscular. Nenhum componente sabe
 * que "supino é peito" — todos perguntam aqui.
 *
 * A base é deliberadamente enxuta e brasileira: os exercícios que aparecem
 * de fato nas fichas das academias daqui, com os nomes que as pessoas usam.
 * 130 exercícios classificados à mão valem mais que mil classificados no
 * atacado — numa ferramenta de volume, um mapeamento errado não gera um erro
 * visível, gera um número plausível e errado, que é pior.
 *
 * Sobre `primarios`: um exercício pode ter mais de um. Agachamento é
 * quadríceps E glúteo; forçar um "principal" único distorceria a conta de
 * quem treina perna. Cada primário recebe a série cheia.
 *
 * Sobre `unilateral`: marca exercícios feitos um lado de cada vez. Quem faz
 * "3 séries de afundo por perna" fez 3 séries para o grupo, não 6 — o membro
 * não dobra o volume do músculo. O formulário muda o rótulo para "séries por
 * lado" e a conta usa o número como está.
 */

import type { MusculoId } from "./musculos";

export interface Exercicio {
  id: string;
  nome: string;
  /** Como as pessoas também chamam — alimenta a busca. */
  aliases?: string[];
  categoria: "composto" | "isolado";
  equipamento: "barra" | "halter" | "maquina" | "cabo" | "peso-corporal";
  primarios: MusculoId[];
  secundarios?: MusculoId[];
  /** Executado um lado por vez: as séries informadas já são as do grupo. */
  unilateral?: boolean;
}

export const EXERCICIOS: Exercicio[] = [
  // ── Peitoral ───────────────────────────────────────────────────────────
  { id: "supino-reto-barra", nome: "Supino reto com barra", aliases: ["supino reto", "supino"], categoria: "composto", equipamento: "barra", primarios: ["peitoral"], secundarios: ["triceps", "deltoide-anterior"] },
  { id: "supino-reto-halter", nome: "Supino reto com halteres", aliases: ["supino halter"], categoria: "composto", equipamento: "halter", primarios: ["peitoral"], secundarios: ["triceps", "deltoide-anterior"] },
  { id: "supino-inclinado-barra", nome: "Supino inclinado com barra", aliases: ["supino inclinado"], categoria: "composto", equipamento: "barra", primarios: ["peitoral"], secundarios: ["triceps", "deltoide-anterior"] },
  { id: "supino-inclinado-halter", nome: "Supino inclinado com halteres", categoria: "composto", equipamento: "halter", primarios: ["peitoral"], secundarios: ["triceps", "deltoide-anterior"] },
  { id: "supino-declinado", nome: "Supino declinado", categoria: "composto", equipamento: "barra", primarios: ["peitoral"], secundarios: ["triceps"] },
  { id: "supino-maquina", nome: "Supino na máquina", aliases: ["supino máquina", "chest press"], categoria: "composto", equipamento: "maquina", primarios: ["peitoral"], secundarios: ["triceps", "deltoide-anterior"] },
  { id: "crucifixo-halter", nome: "Crucifixo com halteres", aliases: ["crucifixo"], categoria: "isolado", equipamento: "halter", primarios: ["peitoral"] },
  { id: "crucifixo-maquina", nome: "Crucifixo na máquina (peck deck)", aliases: ["peck deck", "voador"], categoria: "isolado", equipamento: "maquina", primarios: ["peitoral"] },
  { id: "cross-over", nome: "Cross over", aliases: ["crossover", "cruzamento de cabos"], categoria: "isolado", equipamento: "cabo", primarios: ["peitoral"] },
  { id: "flexao-de-braco", nome: "Flexão de braço", aliases: ["flexão", "push up"], categoria: "composto", equipamento: "peso-corporal", primarios: ["peitoral"], secundarios: ["triceps", "deltoide-anterior"] },
  { id: "paralelas-peito", nome: "Paralelas (ênfase peito)", aliases: ["mergulho", "dips"], categoria: "composto", equipamento: "peso-corporal", primarios: ["peitoral"], secundarios: ["triceps", "deltoide-anterior"] },
  { id: "pullover", nome: "Pullover", categoria: "isolado", equipamento: "halter", primarios: ["costas"], secundarios: ["peitoral", "triceps"] },

  // ── Costas ─────────────────────────────────────────────────────────────
  { id: "barra-fixa", nome: "Barra fixa", aliases: ["pull up", "chin up"], categoria: "composto", equipamento: "peso-corporal", primarios: ["costas"], secundarios: ["biceps", "deltoide-posterior", "antebraco"] },
  { id: "puxada-frente", nome: "Puxada frontal (pulley)", aliases: ["puxada", "pulldown", "puxada frente"], categoria: "composto", equipamento: "maquina", primarios: ["costas"], secundarios: ["biceps", "deltoide-posterior"] },
  { id: "puxada-supinada", nome: "Puxada supinada", categoria: "composto", equipamento: "maquina", primarios: ["costas"], secundarios: ["biceps"] },
  { id: "remada-curvada", nome: "Remada curvada com barra", aliases: ["remada curvada", "remada"], categoria: "composto", equipamento: "barra", primarios: ["costas"], secundarios: ["biceps", "deltoide-posterior", "trapezio"] },
  { id: "remada-baixa", nome: "Remada baixa", aliases: ["remada sentada", "remada máquina"], categoria: "composto", equipamento: "cabo", primarios: ["costas"], secundarios: ["biceps", "deltoide-posterior"] },
  { id: "remada-unilateral", nome: "Remada unilateral (serrote)", aliases: ["serrote", "remada halter"], categoria: "composto", equipamento: "halter", primarios: ["costas"], secundarios: ["biceps", "deltoide-posterior"], unilateral: true },
  { id: "remada-cavalinho", nome: "Remada cavalinho", aliases: ["t-bar"], categoria: "composto", equipamento: "barra", primarios: ["costas"], secundarios: ["biceps", "trapezio"] },
  { id: "remada-maquina", nome: "Remada na máquina", categoria: "composto", equipamento: "maquina", primarios: ["costas"], secundarios: ["biceps", "deltoide-posterior"] },
  { id: "pulldown-braco-reto", nome: "Pulldown com braços estendidos", aliases: ["pullover polia", "straight arm"], categoria: "isolado", equipamento: "cabo", primarios: ["costas"] },
  { id: "levantamento-terra", nome: "Levantamento terra", aliases: ["terra", "deadlift"], categoria: "composto", equipamento: "barra", primarios: ["posteriores", "gluteos"], secundarios: ["costas", "trapezio", "quadriceps", "antebraco"] },
  { id: "terra-sumo", nome: "Levantamento terra sumô", categoria: "composto", equipamento: "barra", primarios: ["posteriores", "gluteos"], secundarios: ["quadriceps", "adutores", "costas"] },

  // ── Trapézio ───────────────────────────────────────────────────────────
  { id: "encolhimento", nome: "Encolhimento de ombros", aliases: ["encolhimento", "shrug"], categoria: "isolado", equipamento: "halter", primarios: ["trapezio"] },
  { id: "remada-alta", nome: "Remada alta", categoria: "composto", equipamento: "barra", primarios: ["trapezio", "deltoide-lateral"], secundarios: ["biceps"] },
  { id: "face-pull", nome: "Face pull", aliases: ["puxada para o rosto"], categoria: "composto", equipamento: "cabo", primarios: ["deltoide-posterior"], secundarios: ["trapezio", "costas"] },

  // ── Ombros ─────────────────────────────────────────────────────────────
  { id: "desenvolvimento-barra", nome: "Desenvolvimento com barra", aliases: ["desenvolvimento", "military press"], categoria: "composto", equipamento: "barra", primarios: ["deltoide-anterior"], secundarios: ["triceps", "deltoide-lateral", "trapezio"] },
  { id: "desenvolvimento-halter", nome: "Desenvolvimento com halteres", categoria: "composto", equipamento: "halter", primarios: ["deltoide-anterior"], secundarios: ["triceps", "deltoide-lateral"] },
  { id: "desenvolvimento-maquina", nome: "Desenvolvimento na máquina", aliases: ["shoulder press"], categoria: "composto", equipamento: "maquina", primarios: ["deltoide-anterior"], secundarios: ["triceps", "deltoide-lateral"] },
  { id: "desenvolvimento-arnold", nome: "Desenvolvimento Arnold", aliases: ["arnold press"], categoria: "composto", equipamento: "halter", primarios: ["deltoide-anterior"], secundarios: ["deltoide-lateral", "triceps"] },
  { id: "elevacao-lateral", nome: "Elevação lateral", aliases: ["elevação lateral halter", "lateral raise"], categoria: "isolado", equipamento: "halter", primarios: ["deltoide-lateral"] },
  { id: "elevacao-lateral-cabo", nome: "Elevação lateral no cabo", categoria: "isolado", equipamento: "cabo", primarios: ["deltoide-lateral"], unilateral: true },
  { id: "elevacao-lateral-maquina", nome: "Elevação lateral na máquina", categoria: "isolado", equipamento: "maquina", primarios: ["deltoide-lateral"] },
  { id: "elevacao-frontal", nome: "Elevação frontal", categoria: "isolado", equipamento: "halter", primarios: ["deltoide-anterior"] },
  { id: "crucifixo-inverso", nome: "Crucifixo inverso", aliases: ["voador inverso", "reverse fly", "crucifixo invertido"], categoria: "isolado", equipamento: "maquina", primarios: ["deltoide-posterior"], secundarios: ["trapezio"] },

  // ── Bíceps ─────────────────────────────────────────────────────────────
  { id: "rosca-direta", nome: "Rosca direta", aliases: ["rosca barra", "rosca"], categoria: "isolado", equipamento: "barra", primarios: ["biceps"], secundarios: ["antebraco"] },
  { id: "rosca-alternada", nome: "Rosca alternada", aliases: ["rosca halter"], categoria: "isolado", equipamento: "halter", primarios: ["biceps"], secundarios: ["antebraco"] },
  { id: "rosca-martelo", nome: "Rosca martelo", aliases: ["hammer curl"], categoria: "isolado", equipamento: "halter", primarios: ["biceps"], secundarios: ["antebraco"] },
  { id: "rosca-scott", nome: "Rosca Scott", aliases: ["banco scott", "preacher curl"], categoria: "isolado", equipamento: "barra", primarios: ["biceps"] },
  { id: "rosca-concentrada", nome: "Rosca concentrada", categoria: "isolado", equipamento: "halter", primarios: ["biceps"], unilateral: true },
  { id: "rosca-cabo", nome: "Rosca no cabo", aliases: ["rosca polia"], categoria: "isolado", equipamento: "cabo", primarios: ["biceps"] },
  { id: "rosca-inversa", nome: "Rosca inversa", categoria: "isolado", equipamento: "barra", primarios: ["antebraco"], secundarios: ["biceps"] },

  // ── Tríceps ────────────────────────────────────────────────────────────
  { id: "triceps-pulley", nome: "Tríceps pulley", aliases: ["tríceps corda", "tríceps polia", "pushdown"], categoria: "isolado", equipamento: "cabo", primarios: ["triceps"] },
  { id: "triceps-testa", nome: "Tríceps testa", aliases: ["skull crusher"], categoria: "isolado", equipamento: "barra", primarios: ["triceps"] },
  { id: "triceps-frances", nome: "Tríceps francês", categoria: "isolado", equipamento: "halter", primarios: ["triceps"] },
  { id: "triceps-coice", nome: "Tríceps coice", aliases: ["kickback"], categoria: "isolado", equipamento: "halter", primarios: ["triceps"], unilateral: true },
  { id: "triceps-banco", nome: "Tríceps no banco", aliases: ["mergulho no banco"], categoria: "composto", equipamento: "peso-corporal", primarios: ["triceps"], secundarios: ["peitoral", "deltoide-anterior"] },
  { id: "paralelas-triceps", nome: "Paralelas (ênfase tríceps)", categoria: "composto", equipamento: "peso-corporal", primarios: ["triceps"], secundarios: ["peitoral", "deltoide-anterior"] },
  { id: "supino-fechado", nome: "Supino fechado", aliases: ["supino pegada fechada"], categoria: "composto", equipamento: "barra", primarios: ["triceps"], secundarios: ["peitoral", "deltoide-anterior"] },

  // ── Quadríceps ─────────────────────────────────────────────────────────
  { id: "agachamento-livre", nome: "Agachamento livre", aliases: ["agachamento", "squat"], categoria: "composto", equipamento: "barra", primarios: ["quadriceps", "gluteos"], secundarios: ["posteriores", "adutores", "core"] },
  { id: "agachamento-smith", nome: "Agachamento no Smith", categoria: "composto", equipamento: "maquina", primarios: ["quadriceps", "gluteos"], secundarios: ["posteriores"] },
  { id: "agachamento-frontal", nome: "Agachamento frontal", categoria: "composto", equipamento: "barra", primarios: ["quadriceps"], secundarios: ["gluteos", "core"] },
  { id: "agachamento-hack", nome: "Agachamento hack", aliases: ["hack machine"], categoria: "composto", equipamento: "maquina", primarios: ["quadriceps"], secundarios: ["gluteos"] },
  { id: "agachamento-goblet", nome: "Agachamento goblet", categoria: "composto", equipamento: "halter", primarios: ["quadriceps", "gluteos"], secundarios: ["core"] },
  { id: "agachamento-sumo", nome: "Agachamento sumô", categoria: "composto", equipamento: "barra", primarios: ["quadriceps", "gluteos", "adutores"] },
  { id: "leg-press", nome: "Leg press", categoria: "composto", equipamento: "maquina", primarios: ["quadriceps", "gluteos"], secundarios: ["posteriores"] },
  { id: "cadeira-extensora", nome: "Cadeira extensora", aliases: ["extensora"], categoria: "isolado", equipamento: "maquina", primarios: ["quadriceps"] },
  { id: "afundo", nome: "Afundo", aliases: ["avanço", "lunge"], categoria: "composto", equipamento: "halter", primarios: ["quadriceps", "gluteos"], secundarios: ["posteriores"], unilateral: true },
  { id: "agachamento-bulgaro", nome: "Agachamento búlgaro", aliases: ["búlgaro", "bulgarian split squat"], categoria: "composto", equipamento: "halter", primarios: ["quadriceps", "gluteos"], secundarios: ["posteriores"], unilateral: true },
  { id: "passada", nome: "Passada (walking lunge)", categoria: "composto", equipamento: "halter", primarios: ["quadriceps", "gluteos"], secundarios: ["posteriores"], unilateral: true },
  { id: "step-up", nome: "Subida no banco (step up)", categoria: "composto", equipamento: "halter", primarios: ["quadriceps", "gluteos"], unilateral: true },
  { id: "sissy-squat", nome: "Sissy squat", categoria: "isolado", equipamento: "peso-corporal", primarios: ["quadriceps"] },

  // ── Posteriores e glúteos ──────────────────────────────────────────────
  { id: "stiff", nome: "Stiff", aliases: ["levantamento terra romeno", "rdl"], categoria: "composto", equipamento: "barra", primarios: ["posteriores", "gluteos"], secundarios: ["costas"] },
  { id: "mesa-flexora", nome: "Mesa flexora", aliases: ["flexora deitado"], categoria: "isolado", equipamento: "maquina", primarios: ["posteriores"] },
  { id: "cadeira-flexora", nome: "Cadeira flexora", aliases: ["flexora sentado"], categoria: "isolado", equipamento: "maquina", primarios: ["posteriores"] },
  { id: "flexora-em-pe", nome: "Flexora em pé", categoria: "isolado", equipamento: "maquina", primarios: ["posteriores"], unilateral: true },
  { id: "good-morning", nome: "Good morning", categoria: "composto", equipamento: "barra", primarios: ["posteriores"], secundarios: ["gluteos", "costas"] },
  { id: "nordic-curl", nome: "Nordic curl", categoria: "isolado", equipamento: "peso-corporal", primarios: ["posteriores"] },
  { id: "hip-thrust", nome: "Elevação pélvica (hip thrust)", aliases: ["hip thrust", "elevação pélvica"], categoria: "composto", equipamento: "barra", primarios: ["gluteos"], secundarios: ["posteriores", "quadriceps"] },
  { id: "gluteo-maquina", nome: "Glúteo na máquina", aliases: ["coice máquina", "glute kickback"], categoria: "isolado", equipamento: "maquina", primarios: ["gluteos"], unilateral: true },
  { id: "gluteo-cabo", nome: "Glúteo no cabo", aliases: ["coice cabo"], categoria: "isolado", equipamento: "cabo", primarios: ["gluteos"], unilateral: true },
  { id: "abducao-quadril", nome: "Abdução de quadril", aliases: ["cadeira abdutora", "abdutora"], categoria: "isolado", equipamento: "maquina", primarios: ["gluteos"] },
  { id: "ponte-gluteo", nome: "Ponte de glúteo", categoria: "isolado", equipamento: "peso-corporal", primarios: ["gluteos"] },
  { id: "adducao-quadril", nome: "Adução de quadril", aliases: ["cadeira adutora", "adutora"], categoria: "isolado", equipamento: "maquina", primarios: ["adutores"] },

  // ── Panturrilhas ───────────────────────────────────────────────────────
  { id: "panturrilha-em-pe", nome: "Panturrilha em pé", aliases: ["gêmeos em pé"], categoria: "isolado", equipamento: "maquina", primarios: ["panturrilhas"] },
  { id: "panturrilha-sentado", nome: "Panturrilha sentado", categoria: "isolado", equipamento: "maquina", primarios: ["panturrilhas"] },
  { id: "panturrilha-leg-press", nome: "Panturrilha no leg press", categoria: "isolado", equipamento: "maquina", primarios: ["panturrilhas"] },

  // ── Core ───────────────────────────────────────────────────────────────
  { id: "abdominal-supra", nome: "Abdominal supra", aliases: ["abdominal", "crunch"], categoria: "isolado", equipamento: "peso-corporal", primarios: ["core"] },
  { id: "abdominal-infra", nome: "Abdominal infra", aliases: ["elevação de pernas"], categoria: "isolado", equipamento: "peso-corporal", primarios: ["core"] },
  { id: "prancha", nome: "Prancha", aliases: ["plank"], categoria: "isolado", equipamento: "peso-corporal", primarios: ["core"] },
  { id: "abdominal-maquina", nome: "Abdominal na máquina", categoria: "isolado", equipamento: "maquina", primarios: ["core"] },
  { id: "abdominal-cabo", nome: "Abdominal no cabo", aliases: ["crunch polia"], categoria: "isolado", equipamento: "cabo", primarios: ["core"] },
  { id: "rotacao-tronco", nome: "Rotação de tronco", aliases: ["lenhador", "wood chop"], categoria: "isolado", equipamento: "cabo", primarios: ["core"], unilateral: true },
  { id: "roda-abdominal", nome: "Roda abdominal", aliases: ["ab wheel"], categoria: "isolado", equipamento: "peso-corporal", primarios: ["core"] },

  // ── Antebraço ──────────────────────────────────────────────────────────
  { id: "rosca-punho", nome: "Rosca de punho", categoria: "isolado", equipamento: "halter", primarios: ["antebraco"] },
  { id: "farmers-walk", nome: "Farmer's walk", aliases: ["caminhada do fazendeiro"], categoria: "composto", equipamento: "halter", primarios: ["antebraco", "trapezio"], secundarios: ["core"] },
  // ── Complementos comuns nas fichas brasileiras ─────────────────────────
  { id: "supino-inclinado-maquina", nome: "Supino inclinado na máquina", categoria: "composto", equipamento: "maquina", primarios: ["peitoral"], secundarios: ["triceps", "deltoide-anterior"] },
  { id: "crucifixo-inclinado", nome: "Crucifixo inclinado", categoria: "isolado", equipamento: "halter", primarios: ["peitoral"] },
  { id: "cross-over-baixo", nome: "Cross over baixo", categoria: "isolado", equipamento: "cabo", primarios: ["peitoral"] },
  { id: "flexao-inclinada", nome: "Flexão inclinada", categoria: "composto", equipamento: "peso-corporal", primarios: ["peitoral"], secundarios: ["triceps", "deltoide-anterior"] },
  { id: "puxada-triangulo", nome: "Puxada com triângulo", aliases: ["puxada neutra"], categoria: "composto", equipamento: "maquina", primarios: ["costas"], secundarios: ["biceps"] },
  { id: "puxada-atras", nome: "Puxada por trás da nuca", categoria: "composto", equipamento: "maquina", primarios: ["costas"], secundarios: ["biceps", "deltoide-posterior"] },
  { id: "remada-smith", nome: "Remada no Smith", categoria: "composto", equipamento: "maquina", primarios: ["costas"], secundarios: ["biceps", "trapezio"] },
  { id: "remada-pronada", nome: "Remada pronada", categoria: "composto", equipamento: "barra", primarios: ["costas"], secundarios: ["deltoide-posterior", "biceps"] },
  { id: "barra-fixa-australiana", nome: "Barra fixa australiana", aliases: ["remada invertida"], categoria: "composto", equipamento: "peso-corporal", primarios: ["costas"], secundarios: ["biceps", "deltoide-posterior"] },
  { id: "hiperextensao", nome: "Hiperextensão lombar", aliases: ["extensão lombar", "banco romano"], categoria: "isolado", equipamento: "peso-corporal", primarios: ["posteriores"], secundarios: ["gluteos", "core"] },
  { id: "encolhimento-barra", nome: "Encolhimento com barra", categoria: "isolado", equipamento: "barra", primarios: ["trapezio"] },
  { id: "desenvolvimento-smith", nome: "Desenvolvimento no Smith", categoria: "composto", equipamento: "maquina", primarios: ["deltoide-anterior"], secundarios: ["triceps", "deltoide-lateral"] },
  { id: "elevacao-lateral-inclinada", nome: "Elevação lateral inclinada", categoria: "isolado", equipamento: "halter", primarios: ["deltoide-lateral"], unilateral: true },
  { id: "crucifixo-inverso-halter", nome: "Crucifixo inverso com halteres", categoria: "isolado", equipamento: "halter", primarios: ["deltoide-posterior"] },
  { id: "crucifixo-inverso-cabo", nome: "Crucifixo inverso no cabo", categoria: "isolado", equipamento: "cabo", primarios: ["deltoide-posterior"] },
  { id: "rosca-21", nome: "Rosca 21", categoria: "isolado", equipamento: "barra", primarios: ["biceps"] },
  { id: "rosca-banco-inclinado", nome: "Rosca no banco inclinado", categoria: "isolado", equipamento: "halter", primarios: ["biceps"] },
  { id: "rosca-scott-maquina", nome: "Rosca Scott na máquina", categoria: "isolado", equipamento: "maquina", primarios: ["biceps"] },
  { id: "triceps-unilateral-cabo", nome: "Tríceps unilateral no cabo", categoria: "isolado", equipamento: "cabo", primarios: ["triceps"], unilateral: true },
  { id: "triceps-maquina", nome: "Tríceps na máquina", categoria: "isolado", equipamento: "maquina", primarios: ["triceps"] },
  { id: "triceps-testa-halter", nome: "Tríceps testa com halteres", categoria: "isolado", equipamento: "halter", primarios: ["triceps"] },
  { id: "leg-press-45", nome: "Leg press 45", categoria: "composto", equipamento: "maquina", primarios: ["quadriceps", "gluteos"], secundarios: ["posteriores"] },
  { id: "leg-press-horizontal", nome: "Leg press horizontal", categoria: "composto", equipamento: "maquina", primarios: ["quadriceps", "gluteos"] },
  { id: "agachamento-livre-halter", nome: "Agachamento com halteres", categoria: "composto", equipamento: "halter", primarios: ["quadriceps", "gluteos"] },
  { id: "cadeira-extensora-unilateral", nome: "Cadeira extensora unilateral", categoria: "isolado", equipamento: "maquina", primarios: ["quadriceps"], unilateral: true },
  { id: "stiff-halter", nome: "Stiff com halteres", categoria: "composto", equipamento: "halter", primarios: ["posteriores", "gluteos"] },
  { id: "terra-unilateral", nome: "Terra unilateral", aliases: ["stiff unilateral"], categoria: "composto", equipamento: "halter", primarios: ["posteriores", "gluteos"], unilateral: true },
  { id: "hip-thrust-maquina", nome: "Hip thrust na máquina", categoria: "composto", equipamento: "maquina", primarios: ["gluteos"], secundarios: ["posteriores"] },
  { id: "abducao-cabo", nome: "Abdução de quadril no cabo", categoria: "isolado", equipamento: "cabo", primarios: ["gluteos"], unilateral: true },
  { id: "panturrilha-smith", nome: "Panturrilha no Smith", categoria: "isolado", equipamento: "maquina", primarios: ["panturrilhas"] },
  { id: "panturrilha-unilateral", nome: "Panturrilha unilateral", categoria: "isolado", equipamento: "peso-corporal", primarios: ["panturrilhas"], unilateral: true },
  { id: "prancha-lateral", nome: "Prancha lateral", categoria: "isolado", equipamento: "peso-corporal", primarios: ["core"], unilateral: true },
  { id: "abdominal-bicicleta", nome: "Abdominal bicicleta", categoria: "isolado", equipamento: "peso-corporal", primarios: ["core"] },
  { id: "elevacao-pernas-barra", nome: "Elevação de pernas na barra", categoria: "isolado", equipamento: "peso-corporal", primarios: ["core"], secundarios: ["antebraco"] },
];

export const EXERCICIO_POR_ID = new Map(EXERCICIOS.map((e) => [e.id, e]));

/** Normaliza para busca: minúsculas, sem acento. */
export function normaliza(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/**
 * Busca tolerante: acha por nome ou apelido, sem acento, por pedaço.
 * "triceps corda", "extensora" e "supino incl" precisam funcionar — as
 * pessoas não digitam o nome completo do exercício no meio do treino.
 */
export function buscaExercicios(termo: string, limite = 8): Exercicio[] {
  const t = normaliza(termo);
  if (t === "") return [];
  const palavras = t.split(/\s+/);

  const pontua = (e: Exercicio): number => {
    const alvos = [normaliza(e.nome), ...(e.aliases ?? []).map(normaliza)];
    let melhor = -1;
    for (const alvo of alvos) {
      if (alvo === t) melhor = Math.max(melhor, 100);
      else if (alvo.startsWith(t)) melhor = Math.max(melhor, 80);
      else if (alvo.includes(t)) melhor = Math.max(melhor, 60);
      else if (palavras.every((p) => alvo.includes(p))) melhor = Math.max(melhor, 40);
    }
    return melhor;
  };

  return EXERCICIOS.map((e) => ({ e, p: pontua(e) }))
    .filter((x) => x.p > 0)
    .sort((a, b) => b.p - a.p || a.e.nome.localeCompare(b.e.nome))
    .slice(0, limite)
    .map((x) => x.e);
}
