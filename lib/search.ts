import { blogPosts } from "@/lib/blog";

export interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  score: number;
}

interface IndexEntry {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  titleLower: string;
  slugLower: string;
  excerptLower: string;
  categoryLower: string;
  tagsLower: string[];
  faqText: string;
  contentText: string;
}

/**
 * Minúsculas e sem acento, dos DOIS lados — índice e consulta.
 *
 * Antes, o índice guardava "você" com acento e a consulta chegava
 * normalizada como "voce": palavra acentuada nenhuma casava. Além de furar
 * a busca, isso dava a palavras comuns uma raridade altíssima e falsa
 * ("voce" parecia mais raro que "celular"), o que desequilibrava o
 * Pergunte ao Montinho. Também faz quem digita sem acento achar o artigo.
 */
export function fold(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const index: IndexEntry[] = blogPosts.map((post) => ({
  slug: post.slug,
  title: post.title ?? "",
  excerpt: post.excerpt ?? "",
  category: post.category ?? "",
  date: post.date,
  readTime: post.readTime ?? "",
  titleLower: fold(post.title ?? ""),
  slugLower: fold(post.slug.replace(/-/g, " ")),
  excerptLower: fold(post.excerpt ?? ""),
  categoryLower: fold(post.category ?? ""),
  tagsLower: (post.tags ?? []).map((t) => fold(t ?? "")),
  faqText: fold(
    (post.faq ?? []).map((f) => `${f.question ?? ""} ${f.answer ?? ""}`).join(" ")
  ),
  contentText: fold(stripHtml(post.content ?? "")),
}));

/**
 * Peso do termo pela raridade (IDF).
 *
 * Sem isso, todo termo vale o mesmo: "melhor" — que aparece em centenas de
 * artigos — pesava igual a "divisao". Numa pergunta de três palavras onde duas
 * são genéricas, as genéricas decidiam o ranking e o assunto real sumia.
 *
 * Contado sob demanda e cacheado: cada termo varre o índice uma única vez.
 */
const dfCache = new Map<string, number>();

function idf(term: string): number {
  let df = dfCache.get(term);
  if (df === undefined) {
    df = 0;
    for (const e of index) {
      if (
        e.titleLower.includes(term) || e.slugLower.includes(term) ||
        e.excerptLower.includes(term) || e.categoryLower.includes(term) ||
        e.contentText.includes(term) || e.tagsLower.some((t) => t.includes(term))
      ) df++;
    }
    dfCache.set(term, df);
  }
  // Piso de 0.25 para que um termo comuníssimo ainda conte alguma coisa.
  return Math.max(0.25, Math.log((index.length + 1) / (df + 1)));
}

function scoreEntry(entry: IndexEntry, query: string, terms: string[]): number {
  const queryLower = query; // já canonicalizada
  let score = 0;

  if (entry.titleLower === queryLower) score += 200;
  else if (entry.titleLower.startsWith(queryLower)) score += 120;
  else if (entry.titleLower.includes(queryLower)) score += 90;
  terms.forEach((t) => { if (entry.titleLower.includes(t)) score += 30 * idf(t); });

  // Slug com hifens convertidos em espaços — cobre variações de palavra
  // que existem na URL mas não no título (ex.: "obesos" vs "obeso")
  if (entry.slugLower.includes(queryLower)) score += 70;
  terms.forEach((t) => { if (entry.slugLower.includes(t)) score += 25 * idf(t); });

  if (entry.categoryLower.includes(queryLower)) score += 50;
  terms.forEach((t) => { if (entry.categoryLower.includes(t)) score += 20 * idf(t); });

  entry.tagsLower.forEach((tag) => {
    if (tag.includes(queryLower)) score += 45;
    terms.forEach((t) => { if (tag.includes(t)) score += 15 * idf(t); });
  });

  if (entry.excerptLower.includes(queryLower)) score += 40;
  terms.forEach((t) => {
    const c = (entry.excerptLower.match(new RegExp(t, "g")) ?? []).length;
    score += Math.min(c * 10, 30) * idf(t);
  });

  terms.forEach((t) => {
    const c = (entry.contentText.match(new RegExp(t, "g")) ?? []).length;
    score += Math.min(c * 2, 20) * idf(t);
  });

  terms.forEach((t) => {
    if (entry.faqText.includes(t)) score += 12 * idf(t);
  });

  return score;
}


// ── Canonicalização da consulta ──────────────────────────────────────────────
//
// Camada compartilhada pela busca do site e pelo Pergunte ao Montinho. Três
// mecanismos, nesta ordem:
//
//   1. Dicionário de gírias, abreviações e grafias compostas do vocabulário
//      real de academia no Brasil, mapeadas para os termos que o acervo usa.
//   2. Regra de substituição × acréscimo decidida pelo próprio acervo: se o
//      termo original existe em algum artigo, mantemos e ACRESCENTAMOS a
//      expansão (não perder o casamento exato); se não existe em lugar nenhum,
//      SUBSTITUÍMOS — manter um termo que não casa com nada só envenena o
//      ranking e a âncora anti-fora-de-domínio.
//   3. Correção de digitação: termo desconhecido no acervo é comparado ao
//      vocabulário de títulos/slugs/tags por distância de edição (OSA, que
//      trata a troca de letras vizinhas — "hipertorfia" — como 1 erro).
//
// Tudo determinístico, sem rede, com caches — mesma consulta, mesmo resultado.

/**
 * Gírias e abreviações → termos do acervo.
 * Regra de uso decidida em tempo de execução (ver docs acima): df>0 acrescenta,
 * df=0 substitui. Manter o mapa curto e curado — cada entrada nova deve vir de
 * uma busca real que falhou, não de imaginação.
 */
const TOKEN_MAP: Record<string, string> = {
  // abreviações
  abs: "abdomen abdominal",
  prote: "proteina",
  carb: "carboidrato",
  suple: "suplemento suplementacao",
  acad: "academia",
  bf: "percentual de gordura corporal",
  aej: "aerobico em jejum cardio jejum",
  bcaa: "aminoacidos suplementacao",
  // partes do corpo pelo nome popular
  bumbum: "gluteo gluteos",
  bunda: "gluteo gluteos",
  gluteo: "gluteos",
  pochete: "gordura abdominal barriga",
  pneu: "gordura abdominal barriga",
  pochetes: "gordura abdominal barriga",
  tanquinho: "abdomen definicao abdominal",
  batata: "panturrilha",
  peitoral: "peito",
  dorsais: "costas dorsal",
  // verbos de objetivo — como as pessoas dizem o que querem
  engrossar: "hipertrofia massa muscular",
  aumentar: "hipertrofia ganhar massa",
  definir: "definicao",
  marombar: "musculacao",
  // gírias de academia
  trincar: "definir abdomen definicao",
  trincado: "definido abdomen definicao",
  secar: "emagrecer definicao",
  shape: "fisico corpo definicao",
  maromba: "musculacao",
  marombeiro: "musculacao praticante",
  frango: "iniciante magro ganhar massa",
  monstro: "hipertrofia massa muscular",
  cutting: "definicao deficit calorico",
  bulking: "ganhar massa superavit",
};

/**
 * Grafias compostas: SEMPRE substituem, sem consultar o acervo. Aqui a forma
 * separada é estritamente melhor — mesmo que um artigo perdido escreva
 * "fullbody" junto, manter o token junto só derruba a âncora do assistente
 * (foi um bug real: 1 artigo escrevia junto e a regra df>0 mantinha o termo).
 */
const COMPOUND_MAP: Record<string, string> = {
  fullbody: "full body",
  upperlower: "upper lower",
  pushpull: "push pull",
  pushpulllegs: "push pull legs",
  legpress: "leg press",
  pullup: "pull up",
  chinup: "chin up",
  ppl: "push pull legs",
};

/** Vocabulário para correção de typo: palavras de título, slug, tag e categoria. */
let vocabCache: string[] | null = null;
function vocabulary(): string[] {
  if (!vocabCache) {
    const words = new Set<string>();
    for (const e of index) {
      for (const w of `${e.titleLower} ${e.slugLower} ${e.categoryLower} ${e.tagsLower.join(" ")}`
        .split(/[^a-z0-9]+/))
        if (w.length >= 4) words.add(w);
    }
    vocabCache = [...words].sort();
  }
  return vocabCache;
}

/** Distância OSA (Levenshtein + transposição adjacente), com teto para sair cedo. */
function osa(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) d[i][0] = i;
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      rowMin = Math.min(rowMin, d[i][j]);
    }
    if (rowMin > max) return max + 1;
  }
  return d[a.length][b.length];
}

const typoCache = new Map<string, string>();

/**
 * Corrige um termo que não existe no acervo — no máximo 1 erro de edição.
 *
 * Tolerância de 2 parecia razoável e corrigia "presidente" para "presente",
 * abrindo a porta para pergunta fora do domínio. Os erros de digitação reais
 * (hipertorfia, muculacao, academeia, bariga, emagreser) são todos de
 * distância 1; correção falsa custa mais caro que correção perdida.
 */
function correctTerm(t: string): string {
  const hit = typoCache.get(t);
  if (hit !== undefined) return hit;
  let best = t;
  if (t.length >= 5 && idf(t) >= Math.log(index.length + 1) - 1e-9) {
    // idf máximo ⇒ df 0 ⇒ o termo não existe em nenhum artigo
    for (const w of vocabulary()) {
      if (osa(t, w, 1) <= 1) { best = w; break; }
    }
  }
  typoCache.set(t, best);
  return best;
}

/**
 * Normaliza a consulta: dobra acento, remove pontuação, aplica o dicionário
 * de gírias e corrige typos. Exportada — o Pergunte ao Montinho usa a mesma.
 */
export function canonicalizeQuery(q: string): string {
  const tokens = fold(q)
    .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const out: string[] = [];
  for (const t of tokens) {
    const compound = COMPOUND_MAP[t];
    if (compound) { out.push(compound); continue; }
    const mapped = TOKEN_MAP[t];
    if (mapped) {
      // Acervo decide: termo real é mantido + expandido; termo inexistente é trocado.
      if (dfOf(t) > 0) out.push(t, mapped);
      else out.push(mapped);
      continue;
    }
    out.push(correctTerm(t));
  }
  return out.join(" ");
}

/** df bruto (nº de artigos contendo o termo) — reusa o cache do idf. */
function dfOf(term: string): number {
  idf(term); // popula o cache
  return dfCache.get(term) ?? 0;
}

/**
 * Raridade do termo no acervo. Quanto maior, mais distintivo — usado pelo
 * Pergunte ao Montinho para saber qual palavra a pergunta realmente trata.
 */
/**
 * O termo é um ASSUNTO do acervo — não apenas uma palavra que aparece nele.
 *
 * Filtro de privacidade do radar de conteúdo, com duas exigências:
 *  1. a palavra aparece em título, slug, tag ou categoria — ou seja, é sobre o
 *     que um artigo trata, não algo citado de passagem no meio do texto;
 *  2. aparece em pelo menos 3 artigos, o que descarta menção isolada.
 *
 * Só o critério "existe no acervo" não bastava: nomes próprios aparecem em
 * depoimentos dentro dos textos, e "joão" passava no filtro. Título e tag são
 * escritos pelo Montinho sobre o tema — é onde nome de aluno não entra.
 */
export function ehAssuntoDoAcervo(term: string): boolean {
  const t = fold(term);
  return vocabulary().includes(t) && dfOf(t) >= 3;
}

export function termRarity(term: string): number {
  return idf(fold(term));
}

// ── Camada de intenção ──────────────────────────────────────────────────────
//
// O dicionário de gírias trabalha palavra por palavra. Quem busca descreve a
// SITUAÇÃO com várias palavras — "perder barriga", "remédio para emagrecer",
// "quanto custa", "nunca treinei" — e o acervo chama o mesmo assunto por
// outro nome. Cada intenção abaixo reconhece o jeito de perguntar e acrescenta
// os termos do acervo. Acrescenta, nunca substitui: o texto original continua
// decidindo o ranking (título exato, frase exata), e os termos da intenção
// entram com peso menor, só para trazer o artigo certo que não usa as
// mesmas palavras de quem pergunta.
//
// Regra de curadoria igual à do TOKEN_MAP: cada intenção sai de busca real
// (Answer the Public, Search Console, pergunta de aluno), não de imaginação.

const INTENCOES: { padrao: RegExp; termos: string; semFerramenta?: true }[] = [
  { padrao: /\b(perder|perda de|eliminar|tirar) (peso|gordura|barriga|quilos|kg|pochete)\b|\bqueimar gordura\b|\bficar magr/, termos: "emagrecer emagrecimento deficit calorico" },
  { padrao: /\bganhar (massa|musculo|musculos|peso|corpo)\b|\bficar (forte|grande|musculoso)/, termos: "hipertrofia ganhar massa muscular" },
  { padrao: /\b(quanto custa|quanto cobra|preco|precos|valor|valores|mensalidade)\b/, termos: "quanto custa preco valor", semFerramenta: true },
  { padrao: /\b(caneta|ozempic|wegovy|mounjaro|tirzepatida|semaglutida|retatrutida|remedio para emagrecer|injecao para emagrecer)\b/, termos: "mounjaro ozempic tirzepatida semaglutida" },
  { padrao: /\b(dor|dores|doi|doendo|machuquei|machucado|lesao|lesionado|inflamad)/, termos: "dor lesao" },
  { padrao: /\b(quantas calorias|gasto calorico|quanto gasto|quanto queima|queima quantas)\b/, termos: "calorias gasto calorico" },
  { padrao: /\b(sem energia|sem disposicao|desanimad|sem vontade|preguica de treinar)/, termos: "motivacao disposicao" },
  { padrao: /\b(nunca treinei|comecar a treinar|comecando|iniciante|primeira vez na academia|voltar a treinar)/, termos: "iniciante comecar primeira semana" },
  { padrao: /\b(idoso|idosos|idosa|terceira idade|mais de 60|60 anos|70 anos)/, termos: "idosos" },
  { padrao: /\b(gravida|gestante|gestacao|gravidez)/, termos: "gestante gravidez" },
  { padrao: /\b(em casa|sem academia|sem equipamento|sem aparelho)/, termos: "treino em casa" },
  { padrao: /\b(dormir|sono|insonia|dormir mal)/, termos: "sono" },
  { padrao: /\b(proteina em po|po de proteina)/, termos: "whey proteina" },
  { padrao: /\b(barriga|abdomen|abdominal|pochete|pneuzinho)/, termos: "barriga gordura abdominal" },
  { padrao: /\b(menopausa|climaterio)/, termos: "menopausa" },
  { padrao: /\b(quantas vezes|quantos dias|dias por semana|vezes por semana)/, termos: "frequencia dias por semana" },
];

/** Peso dos termos que vêm da intenção, relativo aos digitados. */
const PESO_INTENCAO = 0.6;

/**
 * Termos do acervo que a intenção da consulta acrescenta — só os que existem
 * em algum artigo, e só os que a pessoa já não digitou.
 */
export function termosDeIntencao(query: string, paraFerramentas = false): string[] {
  const f = fold(query).replace(/[^\p{L}\p{N}\s-]+/gu, " ").replace(/\s+/g, " ");
  const digitados = new Set(f.split(" "));
  const out: string[] = [];
  for (const { padrao, termos, semFerramenta } of INTENCOES) {
    // Preço de serviço não tem calculadora: a intenção não pode puxar o
    // "custo" do whey para uma busca por quanto custa o personal.
    if (!padrao.test(f) || (paraFerramentas && semFerramenta)) continue;
    for (const t of termos.split(" ")) {
      if (t.length >= 3 && !digitados.has(t) && !out.includes(t) && dfOf(t) > 0) out.push(t);
    }
  }
  return out;
}

/**
 * `intencao` liga a camada de intenção. Só a busca do site liga: o Pergunte
 * ao Montinho tem a própria âncora de domínio calibrada sem ela, e o
 * ask-test pegou a regressão ("quero ficar forte" passou a ser recusada).
 */
export function search(query: string, limit = 20, intencao = false): SearchResult[] {
  const q = canonicalizeQuery(query.trim());
  if (q.length < 2) return [];

  const terms = q.split(/\s+/).filter((t) => t.length >= 2);
  const extra = intencao ? termosDeIntencao(query).filter((t) => !terms.includes(t)) : [];

  const results: SearchResult[] = [];

  for (const entry of index) {
    // "\u0000" nunca casa como frase: a intenção soma só pelos termos.
    const score = scoreEntry(entry, q, terms) + (extra.length ? PESO_INTENCAO * scoreEntry(entry, "\u0000", extra) : 0);
    if (score > 0) {
      results.push({
        slug: entry.slug,
        title: entry.title,
        excerpt: entry.excerpt,
        category: entry.category,
        date: entry.date,
        readTime: entry.readTime,
        score,
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
