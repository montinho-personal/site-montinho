/**
 * Mapa Muscular de Exercícios — camada de navegação por músculo.
 *
 * NÃO é uma base nova. Os exercícios vêm de lib/treino/exercicios.ts (a mesma
 * do Volume e do Substituidor), a taxonomia muscular de lib/treino/musculos.ts
 * e o perfil (padrão, técnica, equipamento) de lib/treino/biomecanica.ts.
 * Aqui só existem GRUPOS de navegação: como uma pessoa procura ("ombros",
 * "costas", "posterior de coxa") mapeados para a taxonomia única.
 *
 * COSTAS NÃO É UM MÚSCULO SÓ
 * A taxonomia do Volume mantém "costas" como um grupo (ver musculos.ts). Para
 * navegação, o mapa separa por FUNÇÃO, que é o que de fato distingue:
 *   dorsais        → puxadas verticais e extensão de ombro;
 *   parte superior → remadas e abertura horizontal (romboides, trapézio médio);
 *   trapézio       → o músculo da taxonomia;
 *   lombar         → dobradiça de quadril, onde os eretores sustentam o tronco.
 * É uma divisão por padrão de movimento, documentada, não um percentual.
 *
 * Nenhum percentual de ativação é exibido: principal e secundários, só.
 */

import { EXERCICIOS, normaliza, type Exercicio } from "./exercicios";
import { MUSCULOS, type MusculoId } from "./musculos";
import { PERFIL, type Equip, type Padrao, type Perfil } from "./biomecanica";

export type GrupoSlug =
  | "peito" | "ombros" | "deltoide-anterior" | "deltoide-lateral" | "deltoide-posterior"
  | "costas" | "dorsais" | "parte-superior-das-costas" | "trapezio" | "lombar"
  | "biceps" | "triceps" | "antebraco" | "abdomen"
  | "gluteos" | "quadriceps" | "posterior-de-coxa" | "adutores" | "panturrilha";

export interface Grupo {
  slug: GrupoSlug;
  nome: string;
  /** "Exercícios para ___" */
  para: string;
  musculos: MusculoId[];
  /** Restringe por função, para os subgrupos de costas. */
  padroes?: Padrao[];
  /** Lombar: entra pelo padrão mesmo sem a lombar estar na taxonomia. */
  porPadrao?: boolean;
  pai?: GrupoSlug;
  filhos?: GrupoSlug[];
  aliases: string[];
}

export const GRUPOS: Grupo[] = [
  { slug: "peito", nome: "Peitoral", para: "peito", musculos: ["peitoral"], aliases: ["peito", "peitoral", "peitorais", "pectoral", "torax"] },
  { slug: "ombros", nome: "Ombros", para: "ombros", musculos: ["deltoide-anterior", "deltoide-lateral", "deltoide-posterior"], filhos: ["deltoide-anterior", "deltoide-lateral", "deltoide-posterior"], aliases: ["ombro", "ombros", "deltoide", "deltoides"] },
  { slug: "deltoide-anterior", nome: "Deltoide anterior", para: "deltoide anterior", musculos: ["deltoide-anterior"], pai: "ombros", aliases: ["deltoide anterior", "ombro da frente", "frente do ombro", "anterior de ombro", "ombro anterior"] },
  { slug: "deltoide-lateral", nome: "Deltoide lateral", para: "deltoide lateral", musculos: ["deltoide-lateral"], pai: "ombros", aliases: ["deltoide lateral", "lateral de ombro", "ombro lateral", "deltoide medio"] },
  { slug: "deltoide-posterior", nome: "Deltoide posterior", para: "deltoide posterior", musculos: ["deltoide-posterior"], pai: "ombros", aliases: ["deltoide posterior", "posterior de ombro", "ombro de tras", "ombro posterior", "parte de tras do ombro", "posterior do ombro", "posterior de ombros", "deltoide posterior do ombro"] },
  { slug: "costas", nome: "Costas", para: "costas", musculos: ["costas"], filhos: ["dorsais", "parte-superior-das-costas", "trapezio", "lombar"], aliases: ["costas", "costa", "dorso"] },
  { slug: "dorsais", nome: "Dorsais", para: "dorsais", musculos: ["costas"], padroes: ["puxada-vertical", "extensao-ombro", "puxada-horizontal"], pai: "costas", aliases: ["dorsal", "dorsais", "latissimo", "grande dorsal", "asa"] },
  { slug: "parte-superior-das-costas", nome: "Parte superior das costas", para: "a parte superior das costas", musculos: ["costas", "trapezio", "deltoide-posterior"], padroes: ["puxada-horizontal", "abducao-horizontal"], pai: "costas", aliases: ["parte superior das costas", "romboides", "meio das costas", "costas alta"] },
  { slug: "trapezio", nome: "Trapézio", para: "trapézio", musculos: ["trapezio"], pai: "costas", aliases: ["trapezio", "trapezios"] },
  { slug: "lombar", nome: "Lombar", para: "lombar", musculos: [], padroes: ["hinge"], porPadrao: true, pai: "costas", aliases: ["lombar", "eretores", "eretores da espinha", "parte de baixo das costas"] },
  { slug: "biceps", nome: "Bíceps", para: "bíceps", musculos: ["biceps"], aliases: ["biceps", "bicipes", "braco da frente"] },
  { slug: "triceps", nome: "Tríceps", para: "tríceps", musculos: ["triceps"], aliases: ["triceps", "tricipes", "braco de tras", "tchauzinho"] },
  { slug: "antebraco", nome: "Antebraço", para: "antebraço", musculos: ["antebraco"], aliases: ["antebraco", "antebracos", "pegada", "punho"] },
  { slug: "abdomen", nome: "Abdômen", para: "abdômen", musculos: ["core"], aliases: ["abdomen", "abdominal", "abdominais", "barriga", "core", "obliquos"] },
  { slug: "gluteos", nome: "Glúteos", para: "glúteos", musculos: ["gluteos"], aliases: ["gluteo", "gluteos", "bumbum", "bunda", "gluteo medio", "gluteo maximo"] },
  { slug: "quadriceps", nome: "Quadríceps", para: "quadríceps", musculos: ["quadriceps"], aliases: ["quadriceps", "coxa", "frente da coxa", "perna"] },
  { slug: "posterior-de-coxa", nome: "Posterior de coxa", para: "posterior de coxa", musculos: ["posteriores"], aliases: ["posterior de coxa", "posteriores", "isquiotibiais", "femoral", "posterior da coxa", "parte de tras da coxa"] },
  { slug: "adutores", nome: "Adutores", para: "adutores", musculos: ["adutores"], aliases: ["adutor", "adutores", "parte interna da coxa"] },
  { slug: "panturrilha", nome: "Panturrilha", para: "panturrilha", musculos: ["panturrilhas"], aliases: ["panturrilha", "panturrilhas", "gemeos", "batata da perna"] },
];

export const GRUPO = Object.fromEntries(GRUPOS.map((g) => [g.slug, g])) as Record<GrupoSlug, Grupo>;
export const GRUPOS_PRINCIPAIS: GrupoSlug[] = ["peito", "costas", "gluteos", "quadriceps", "posterior-de-coxa", "ombros", "biceps", "triceps", "abdomen", "panturrilha"];

export const nomeMusculo = (m: MusculoId) => MUSCULOS.find((x) => x.id === m)?.nome ?? m;
/** Para links "ver exercícios para [músculo]" a partir de um músculo da taxonomia. */
export const GRUPO_DO_MUSCULO: Record<MusculoId, GrupoSlug> = {
  peitoral: "peito", costas: "costas", trapezio: "trapezio", "deltoide-anterior": "deltoide-anterior", "deltoide-lateral": "deltoide-lateral",
  "deltoide-posterior": "deltoide-posterior", biceps: "biceps", triceps: "triceps", antebraco: "antebraco", quadriceps: "quadriceps",
  posteriores: "posterior-de-coxa", gluteos: "gluteos", adutores: "adutores", panturrilhas: "panturrilha", core: "abdomen",
};

export type ExercicioMapa = Exercicio & Perfil & { papel: "principal" | "secundario" };

/**
 * Exercícios de um grupo. Por padrão só onde o músculo é PRINCIPAL — quem
 * toca no peitoral quer supino e crucifixo, não tríceps no banco.
 */
export function exerciciosDoGrupo(slug: GrupoSlug, incluirSecundarios = false): ExercicioMapa[] {
  const g = GRUPO[slug];
  const out: ExercicioMapa[] = [];
  for (const e of EXERCICIOS) {
    const p = PERFIL[e.id];
    if (!p) continue;
    if (g.porPadrao) {
      if (g.padroes?.includes(p.padrao)) out.push({ ...e, ...p, papel: "secundario" });
      continue;
    }
    if (g.padroes && !g.padroes.includes(p.padrao)) continue;
    const prim = e.primarios.some((m) => g.musculos.includes(m));
    const sec = (e.secundarios ?? []).some((m) => g.musculos.includes(m));
    if (prim) out.push({ ...e, ...p, papel: "principal" });
    else if (incluirSecundarios && sec) out.push({ ...e, ...p, papel: "secundario" });
  }
  return out;
}

/* ───────────── Filtros ───────────── */

export const EQUIP_CASA: Equip[] = ["halter", "elastico", "banco", "barra-fixa", "peso-corporal"];

export interface Filtros {
  /** O que a pessoa tem. Vazio = só peso corporal. */
  equipamentos: Equip[];
  nivel?: 1 | 2 | 3;
  tipo?: "composto" | "isolado" | "unilateral" | "bilateral";
  ordem?: "comuns" | "simples" | "alfabetica";
}

export function filtra(lista: ExercicioMapa[], f: Filtros): ExercicioMapa[] {
  const tem = new Set<Equip>([...f.equipamentos, "peso-corporal"]);
  let r = lista.filter((e) => e.precisa.every((q) => tem.has(q)));
  if (f.nivel) r = r.filter((e) => e.tecnica <= f.nivel!);
  if (f.tipo === "composto" || f.tipo === "isolado") r = r.filter((e) => e.categoria === f.tipo);
  if (f.tipo === "unilateral") r = r.filter((e) => e.unilateral);
  if (f.tipo === "bilateral") r = r.filter((e) => !e.unilateral);
  if (f.ordem === "simples") r = [...r].sort((a, b) => a.tecnica - b.tecnica || a.nome.localeCompare(b.nome));
  if (f.ordem === "alfabetica") r = [...r].sort((a, b) => a.nome.localeCompare(b.nome));
  // "comuns": a ordem da base, que segue a das fichas de academia; principais antes de secundários.
  return [...r].sort((a, b) => (a.papel === b.papel ? 0 : a.papel === "principal" ? -1 : 1));
}

/* ───────────── Busca (músculos e exercícios) ───────────── */

const singular = (t: string) => t.replace(/(oes|aes)$/, "ao").replace(/s$/, "");
function dist1(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, d = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++d > 1) return false;
    if (a.length === b.length && a[i + 1] === b[j] && a[i] === b[j + 1]) { i += 2; j += 2; continue; }
    if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
  }
  return d + (a.length - i) + (b.length - j) <= 1;
}
const parecido = (t: string, alvo: string) =>
  alvo === t || singular(alvo) === singular(t) || alvo.startsWith(t) || (t.length >= 5 && dist1(singular(t), singular(alvo)));

export interface ResultadoBusca { grupos: Grupo[]; exercicios: (Exercicio & Perfil)[]; nota?: string }

/** "posterior de ombro" → deltoide posterior (nunca posterior de coxa); "asa" → dorsais, com o nome certo. */
export function busca(termo: string): ResultadoBusca {
  const t = normaliza(termo).replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  if (t.length < 2) return { grupos: [], exercicios: [] };
  const exatos = GRUPOS.filter((g) => g.aliases.some((a) => normaliza(a) === t || singular(normaliza(a)) === singular(t)));
  const grupos = exatos.length ? exatos : GRUPOS.filter((g) => g.aliases.some((a) => parecido(t, normaliza(a)) || (t.length >= 4 && normaliza(a).includes(t))));
  const exercicios = EXERCICIOS.filter((e) => PERFIL[e.id])
    .map((e) => {
      const alvos = [e.nome, ...(e.aliases ?? [])].map(normaliza);
      const p = alvos.some((a) => a === t) ? 3 : alvos.some((a) => a.startsWith(t)) ? 2 : alvos.some((a) => (" " + a).includes(" " + t) || t.split(" ").every((w) => (" " + a).includes(" " + w))) ? 1 : alvos.some((a) => t.length >= 5 && a.split(" ").some((w) => dist1(t, w))) ? 0.5 : 0;
      return { e: { ...e, ...PERFIL[e.id] }, p };
    })
    .filter((x) => x.p > 0).sort((a, b) => b.p - a.p).slice(0, 6).map((x) => x.e);
  const nota = t === "asa" ? "\"Asa\" é como muita gente chama os dorsais, o músculo largo das costas." : t === "posterior" ? "\"Posterior\" pode ser de coxa ou de ombro: escolha abaixo." : undefined;
  return { grupos: grupos.slice(0, 4), exercicios, nota };
}

/* ───────────── Artigos "como fazer" ligados aos exercícios ───────────── */

export const ARTIGO_DO_EXERCICIO: Record<string, string> = {
  "supino-reto-barra": "como-fazer-supino-reto", "supino-inclinado-barra": "como-fazer-supino-inclinado", "supino-inclinado-halter": "como-fazer-supino-inclinado",
  "crucifixo-halter": "como-fazer-crucifixo-halteres", "crucifixo-maquina": "como-fazer-voador-pec-deck", "cross-over": "como-fazer-cross-over-com-halteres",
  "paralelas-peito": "como-fazer-mergulho-paralelas", "paralelas-triceps": "como-fazer-mergulho-paralelas", pullover: "como-fazer-pullover",
  "barra-fixa": "como-fazer-barra-fixa", "puxada-frente": "como-fazer-pulldown-puxada-frontal", "puxada-triangulo": "como-fazer-puxada-fechada",
  "remada-curvada": "como-fazer-remada-curvada-tecnica", "remada-baixa": "como-fazer-remada-baixa", "remada-unilateral": "como-fazer-remada-unilateral",
  "levantamento-terra": "como-fazer-levantamento-terra-corretamente", stiff: "como-fazer-stiff", encolhimento: "como-fazer-encolhimento-trapezio",
  "desenvolvimento-halter": "como-fazer-desenvolvimento-ombros", "desenvolvimento-barra": "como-fazer-desenvolvimento-ombros",
  "elevacao-lateral": "como-fazer-elevacao-lateral", "elevacao-frontal": "como-fazer-elevacao-frontal",
  "rosca-direta": "como-fazer-rosca-direta", "rosca-martelo": "como-fazer-rosca-martelo", "rosca-concentrada": "como-fazer-rosca-concentrada",
  "triceps-testa": "como-fazer-skull-crusher-triceps-testa", "triceps-frances": "como-fazer-french-press",
  "agachamento-livre": "como-fazer-agachamento-livre-corretamente", "agachamento-frontal": "como-fazer-agachamento-frontal", "agachamento-goblet": "como-fazer-agachamento-goblet",
  "agachamento-hack": "como-fazer-hack-squat", "leg-press": "como-fazer-leg-press", "leg-press-45": "como-fazer-leg-press", "cadeira-extensora": "como-fazer-cadeira-extensora",
  afundo: "como-fazer-afundo-passadas", passada: "como-fazer-afundo-passadas", "cadeira-flexora": "como-fazer-cadeira-flexora", "mesa-flexora": "como-fazer-leg-curl-femoral",
  "hip-thrust": "como-fazer-hip-thrust", "abducao-quadril": "como-fazer-abducao-quadril-maquina", hiperextensao: "como-fazer-extensao-lombar",
};

export const NIVEL_TXT = ["", "Simples de aprender", "Técnica moderada", "Mais técnico"] as const;
export const NOME_EQUIP: Record<Equip, string> = { maquina: "máquina", smith: "smith", polia: "polia", barra: "barra", halter: "halteres", banco: "banco", elastico: "elástico", "barra-fixa": "barra fixa", "peso-corporal": "peso corporal" };
export const equipTexto = (e: Perfil) => (e.precisa.length ? e.precisa.map((q) => NOME_EQUIP[q]).join(" + ") : "Peso corporal");
