/**
 * Motor do Mata a Vontade: entende o pedido, calcula o Índice Mata-Vontade
 * e escolhe os três cartões. Determinístico, sem IA, testado em
 * scripts/mata-vontade-test.ts. A conta está documentada no Bloco 3.
 */
import { FAMILIAS, SALGADOS, VAGAS, type Eixo, type Familia, type Perfil, type Temperatura } from "./familias";
import { INGREDIENTES, RECEITAS, type Equip, type Objetivo, type Receita } from "./receitas";

export const normaliza = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[-_]/g, " ").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

function lev(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

export type Interpretacao =
  | { tipo: "familia"; familia: Familia; chips: string[]; temperatura?: Temperatura; aromas: string[] }
  | { tipo: "vago" }
  | { tipo: "salgado" }
  | { tipo: "desconhecido" };

const MOD: { termo: string; chip?: string; temperatura?: Temperatura; aroma?: string }[] = [
  { termo: "gelado", temperatura: "gelado" }, { termo: "quente", temperatura: "quente" }, { termo: "quentinho", temperatura: "quente" },
  { termo: "crocante", chip: "crocante" }, { termo: "cremoso", chip: "cremoso" }, { termo: "fofinho", chip: "fofinho" }, { termo: "fofo", chip: "fofinho" },
  { termo: "denso", chip: "denso" }, { termo: "de chocolate", chip: "choc" }, { termo: "chocolatudo", chip: "chocolatudo" },
  { termo: "de morango", chip: "morango", aroma: "frutado" }, { termo: "com cobertura", chip: "cobertura" }, { termo: "recheado", chip: "cobertura" },
  { termo: "de cafe", aroma: "cafe", chip: "cafe" }, { termo: "canela", aroma: "canela" }, { termo: "de coco", aroma: "coco" }, { termo: "amendoim", aroma: "amendoim" },
];

export function interpretar(texto: string): Interpretacao {
  const t = normaliza(texto);
  if (!t) return { tipo: "desconhecido" };
  const mods = MOD.filter((m) => t.includes(m.termo));
  const extra = {
    chips: mods.flatMap((m) => (m.chip ? [m.chip] : [])),
    temperatura: mods.find((m) => m.temperatura)?.temperatura,
    aromas: mods.flatMap((m) => (m.aroma ? [m.aroma] : [])),
  };
  // 1. sinônimo exato contido no texto — o mais longo vence ("bolo de caneca" > "bolo")
  let melhor: { f: Familia; n: number } | null = null;
  for (const f of FAMILIAS) for (const s of f.sinonimos) {
    const n = normaliza(s);
    if ((` ${t} `).includes(` ${n} `) && (!melhor || n.length > melhor.n)) melhor = { f, n: n.length };
  }
  const daFamilia = (f: Familia) => ({ ...extra, chips: [...new Set(extra.chips.map((c) => (c === "choc" && !f.chips.some((x) => x.id === "choc") ? "chocolatudo" : c)))].filter((c) => f.chips.some((x) => x.id === c)) });
  if (melhor) return { tipo: "familia", familia: melhor.f, ...daFamilia(melhor.f) };
  if (SALGADOS.some((s) => t.includes(normaliza(s)))) return { tipo: "salgado" };
  // 2. erro de digitação: até 2 letras em palavras de 5+
  const palavras = t.split(" ").filter((p) => p.length >= 5);
  for (const f of FAMILIAS) for (const s of f.sinonimos) {
    const n = normaliza(s);
    if (n.includes(" ")) { if (n.length >= 6 && lev(t, n) <= 2) return { tipo: "familia", familia: f, ...daFamilia(f) }; continue; }
    if (n.length >= 5 && palavras.some((p) => lev(p, n) <= 2)) return { tipo: "familia", familia: f, ...daFamilia(f) };
  }
  if (VAGAS.some((v) => t.includes(normaliza(v)))) return { tipo: "vago" };
  return { tipo: "desconhecido" };
}

export type Pedido = {
  familia: Familia;
  chips: string[];
  temperatura?: Temperatura;
  aromas: string[];
  tempoMax?: number; // minutos de preparo
  equip?: Equip[]; // o que a pessoa tem; vazio = não perguntado
  tenho: string[]; // ingredientes que a pessoa tem
  podeComprar: boolean;
  objetivo: Objetivo;
  restricoes: string[]; // alergenos/marcas a evitar: "lactose", "gluten", "ovo", "amendoim", "castanhas", "vegana"
};

export type Resultado = {
  receita: Receita;
  match: number;
  faltam: string[];
  porque: string;
};

/** Alvo + pesos a partir da família e dos chips. */
export function alvoDe(p: Pick<Pedido, "familia" | "chips">) {
  const alvo: Perfil = { ...p.familia.alvo };
  const peso: Partial<Record<Eixo, number>> = {};
  for (const e of p.familia.relevantes) peso[e] = 1;
  for (const id of p.chips) {
    const c = p.familia.chips.find((x) => x.id === id);
    if (!c?.alvo) continue;
    for (const [e, v] of Object.entries(c.alvo) as [Eixo, number][]) { alvo[e] = v; peso[e] = 2; }
  }
  return { alvo, peso };
}

function fator(f: Familia, r: Receita) {
  if (r.familia === f.id) return 1;
  return f.vizinhas.includes(r.familia) ? 0.9 : 0.7;
}

const ESSENCIAL_EQUIP: Record<Equip, Equip[]> = {
  "micro-ondas": ["micro-ondas"], "air-fryer": ["air-fryer", "forno"], forno: ["forno", "air-fryer"],
  fogao: ["fogao"], liquidificador: ["liquidificador"], nenhum: [],
};

const viola = (r: Receita, restr: string[]) => restr.some((x) => {
  if (x === "vegana") return !r.marcas.includes("vegana");
  return r.ingredientes.some((i) => !i.opcional && !i.troca && (INGREDIENTES[i.id]?.alergenos ?? []).includes(x));
});

export function pontuar(p: Pedido, r: Receita): Resultado | null {
  if (viola(r, p.restricoes)) return null;
  if (p.equip?.length && r.equip !== "nenhum" && !ESSENCIAL_EQUIP[r.equip].some((e) => p.equip!.includes(e))) return null;
  if (p.tempoMax && r.tempoMin > p.tempoMax) return null;
  const temp = p.temperatura ?? p.familia.temperatura;
  if (p.temperatura && r.temperatura !== p.temperatura && !(p.temperatura === "quente" && r.temperatura === "ambiente")) return null;
  const { alvo, peso } = alvoDe(p);
  let soma = 0, pesos = 0;
  const difs: { e: Eixo; d: number }[] = [];
  for (const [e, w] of Object.entries(peso) as [Eixo, number][]) {
    const d = Math.abs((r.perfil[e] ?? 0) - (alvo[e] ?? 0)) / 5;
    soma += w * d; pesos += w; difs.push({ e, d: w * d });
  }
  const dist = pesos ? soma / pesos : 0;
  const bonus = Math.min(5, 2 * (r.aromas ?? []).filter((a) => p.aromas.includes(a)).length);
  const essenciais = r.ingredientes.filter((i) => !i.opcional);
  const faltam = essenciais.filter((i) => !p.tenho.includes(i.id) && !(i.id === "banana-congelada" && p.tenho.includes("banana")));
  let penal = 0;
  for (const i of faltam) {
    if (i.troca) penal += 2;
    else if (p.podeComprar) penal += 3;
    else return null;
  }
  let m = 100 * (1 - dist) * fator(p.familia, r) + bonus - penal;
  if (temp && r.temperatura !== temp) m -= 5;
  const match = Math.max(0, Math.min(99, Math.round(m)));
  return { receita: r, match, faltam: faltam.map((i) => i.id), porque: porque(p, r, difs) };
}

const NOME_EIXO: Record<Eixo, string> = { chocolate: "chocolate", docura: "doçura", cremosidade: "cremosidade", crocancia: "crocância", maciez: "maciez", densidade: "textura densa", umidade: "umidade", cobertura: "cobertura" };

function porque(p: Pedido, r: Receita, difs: { e: Eixo; d: number }[]): string {
  const pediu = p.chips.map((c) => p.familia.chips.find((x) => x.id === c)?.rotulo).filter(Boolean) as string[];
  const base = pediu.length ? `Você pediu ${p.familia.nome.toLowerCase()} ${pediu.join(", ")}.` : `Você pediu ${p.familia.nome.toLowerCase()}.`;
  if (r.marcas.includes("original")) return `${base} Às vezes o que mata a vontade é o próprio original — numa porção que cabe.`;
  if (r.familia !== p.familia.id) return `${base} Essa é outra forma, mas entrega ${r.perfil.chocolate && r.perfil.chocolate >= 4 ? "o chocolate" : "a sensação"} que você procura.`;
  const pior = [...difs].sort((a, b) => b.d - a.d)[0];
  if (!pior || pior.d < 0.15) return `${base} Essa entrega exatamente isso.`;
  return `${base} Essa chega perto; onde ela se afasta um pouco é na ${NOME_EIXO[pior.e]}.`;
}

export type Cartoes = { melhor?: Resultado; rapido?: Resultado; estrategia?: Resultado; todos: Resultado[] };

export function recomendar(p: Pedido, banco: Receita[] = RECEITAS): Cartoes {
  const todos = banco.map((r) => pontuar(p, r)).filter((x): x is Resultado => !!x && x.match >= 60)
    .sort((a, b) => b.match - a.match || (b.receita.forte[p.objetivo] ?? 0) - (a.receita.forte[p.objetivo] ?? 0) || a.receita.tempoMin - b.receita.tempoMin);
  const usados = new Set<string>();
  const pega = (x?: Resultado) => { if (x) usados.add(x.receita.id); return x; };
  // Vontade de produto + "o original": o original na medida vem primeiro.
  const querOriginal = p.familia.produto && (p.chips.includes("original") || p.objetivo === "original");
  const original = todos.find((x) => x.receita.marcas.includes("original") && x.receita.familia === p.familia.id);
  const melhor = pega(querOriginal && original ? original : todos[0]);
  const rapido = pega([...todos].filter((x) => !usados.has(x.receita.id) && x.match >= 75)
    .sort((a, b) => a.receita.tempoMin - b.receita.tempoMin || b.match - a.match)[0]);
  const alvoObj: Objetivo = p.objetivo === "original" && !querOriginal ? "original" : p.objetivo;
  const estrategia = pega(todos.filter((x) => !usados.has(x.receita.id) && x.match >= 65)
    .sort((a, b) => (b.receita.forte[alvoObj] ?? 0) - (a.receita.forte[alvoObj] ?? 0) || b.match - a.match)[0]);
  return { melhor, rapido, estrategia, todos };
}

export const alergenosDe = (r: Receita) =>
  [...new Set(r.ingredientes.filter((i) => !i.opcional).flatMap((i) => INGREDIENTES[i.id]?.alergenos ?? []))];
