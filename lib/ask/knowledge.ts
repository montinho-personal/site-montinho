/**
 * Pergunte ao Montinho — camada de conhecimento e recuperação.
 *
 * A base canônica é o próprio acervo do site (lib/blog.ts) + fatos de negócio
 * extraídos das páginas institucionais reais. Nada é duplicado manualmente:
 * quando um artigo muda, a base muda no deploy seguinte.
 *
 * Recuperação híbrida-lite e determinística:
 *   1. ranking lexical de artigos via lib/search (mesma camada da busca do site)
 *   2. expansão de sinônimos/normalização de acentos para cobrir variações
 *   3. seleção das seções (H2) mais relevantes dentro dos melhores artigos
 *   4. boost de contexto quando a pergunta nasce dentro de um artigo
 *
 * Sem embeddings na V1 por decisão documentada: base de ~700 docs bem
 * estruturados (slug/título/tags/FAQ) rankeia bem lexicalmente, custo zero,
 * zero infra nova e resultado reproduzível em teste.
 */

import { getBlogPost, SITE_URL } from "@/lib/blog";
import { search, termRarity } from "@/lib/search";

export interface KnowledgeChunk {
  articleId: string; // slug ou id do doc de negócio
  title: string;
  slug: string; // caminho relativo real (ex.: /blog/x ou /consultoria)
  url: string; // URL canônica absoluta
  heading: string;
  category: string;
  text: string;
}

export interface RetrievalResult {
  chunks: KnowledgeChunk[];
  sources: { title: string; slug: string; url: string }[];
  /** Sinal de evidência: soma normalizada dos scores dos artigos usados. */
  evidence: number;
}

// ── Fatos de negócio (somente informações reais das páginas do site) ─────────

interface BusinessDoc {
  id: string;
  title: string;
  path: string;
  heading: string;
  keywords: string[];
  text: string;
}

const BUSINESS_DOCS: BusinessDoc[] = [
  {
    id: "servico-modalidades",
    title: "Consultoria e Personal Training — Modalidades",
    path: "/consultoria",
    heading: "Modalidades de atendimento",
    keywords: [
      "consultoria", "personal", "presencial", "online", "hibrido", "híbrido",
      "atende", "atendimento", "acompanhamento", "modalidade", "contratar",
      "alphaville", "barueri", "santana", "tambore", "tamboré", "regiao", "região",
    ],
    text:
      "O Montinho atende em três modalidades. Personal Presencial: acompanhamento 100% presencial em Alphaville, Barueri e Santana de Parnaíba, com sessões guiadas, correção de técnica em tempo real, avaliação física completa, suporte via WhatsApp entre as sessões e reavaliações mensais. Consultoria Online: para qualquer lugar do Brasil, com anamnese completa, treino personalizado com vídeos demonstrativos, suporte diário via WhatsApp, check-ins semanais e reavaliações mensais. Modelo Híbrido: sessões presenciais semanais em Alphaville combinadas com treinos complementares online e suporte diário. O processo começa com uma conversa inicial gratuita e sem compromisso; o plano é individualizado a partir de anamnese.",
  },
  {
    id: "servico-precos",
    title: "Consultoria — Valores",
    path: "/consultoria",
    heading: "Valores",
    keywords: ["preco", "preço", "valor", "quanto custa", "mensalidade", "plano", "pacote", "investimento"],
    text:
      "O valor do acompanhamento depende da modalidade (online, presencial ou híbrida), da frequência e do período do plano — o site não publica tabela fixa de preços. A conversa inicial é gratuita e sem compromisso: nela o Montinho entende o objetivo e apresenta as opções com transparência. Para valores atualizados, o caminho é o contato direto pelo WhatsApp na página de consultoria.",
  },
  {
    id: "sobre-montinho",
    title: "Minha História — Quem é o Montinho",
    path: "/minha-historia",
    heading: "Quem é o Montinho",
    keywords: ["quem", "montinho", "historia", "história", "40kg", "40 kg", "transformacao", "transformação", "emagreceu", "autor"],
    text:
      "Montinho é personal trainer em Alphaville, especialista em emagrecimento e transformação corporal, com atendimento presencial em Alphaville (Barueri e Santana de Parnaíba) e consultoria online em todo o Brasil. Ele viveu a própria transformação: perdeu mais de 40 kg, e aplica com os alunos o que funcionou na prática — sem fórmulas mágicas. A filosofia do trabalho é: resultados reais, com ciência, consistência e acompanhamento próximo.",
  },
  {
    id: "ferramenta-diagnostico",
    title: "Diagnóstico Montinho",
    path: "/diagnostico",
    heading: "O que é o Diagnóstico Montinho",
    keywords: ["diagnostico", "diagnóstico", "quiz", "perfil", "qual treino", "por onde comecar", "por onde começar", "estrategia", "estratégia", "nao sei", "não sei"],
    text:
      "O Diagnóstico Montinho é uma ferramenta gratuita do site (em /diagnostico) que identifica qual estratégia de treino combina com a rotina e o objetivo da pessoa: são 9 perguntas rápidas (1–2 minutos, sem cadastro) e o resultado traz o perfil de treino, a frequência compatível com a disponibilidade real, o principal gargalo e os próximos passos, com conteúdos recomendados. É uma orientação inicial — não substitui a anamnese individual.",
  },
  {
    id: "contato",
    title: "Contato",
    path: "/contato",
    heading: "Como falar com o Montinho",
    keywords: ["contato", "whatsapp", "falar", "telefone", "mensagem", "instagram"],
    text:
      "O canal principal de contato é o WhatsApp +55 (11) 98106-3409, disponível pelos botões do site. Também é possível conhecer o trabalho pelo Instagram @montinhopersonal. A conversa inicial é gratuita e sem compromisso.",
  },
];

/**
 * Palavras que sozinhas não provam que a pergunta é sobre o negócio.
 * "Qual o melhor investimento em criptomoedas" casava com a palavra-chave
 * "investimento" do bloco de preços e virava pergunta legítima. Elas só valem
 * quando a pergunta também traz algum termo do domínio.
 */
const GENERIC_KEYWORDS = new Set([
  "valor", "plano", "pacote", "investimento", "preco", "preço",
  "quem", "falar", "mensagem", "modalidade", "regiao", "região",
]);

const DOMAIN_HINT =
  /(treino|treinar|musculacao|musculação|academia|personal|consultoria|acompanhamento|montinho|emagrec|hipertrofia|exercicio|exercício|aula|dieta|fitness|massa muscular|shape)/;

// ── Normalização e sinônimos ─────────────────────────────────────────────────

export function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Mapa curto e curado — cobre variações comuns sem virar spam semântico. */
const SYNONYMS: Record<string, string[]> = {
  peito: ["peitoral", "supino"],
  costas: ["dorsal", "remada", "puxada"],
  perna: ["pernas", "quadriceps", "agachamento", "inferiores"],
  gluteo: ["gluteos", "bumbum"],
  braco: ["bracos", "biceps", "triceps"],
  ombro: ["ombros", "deltoide", "elevacao lateral"],
  barriga: ["abdomen", "abdominal", "gordura abdominal"],
  emagrecer: ["emagrecimento", "perder peso", "perder gordura", "secar"],
  "ganhar massa": ["hipertrofia", "massa muscular", "crescer"],
  massa: ["hipertrofia", "massa muscular"],
  cardio: ["aerobico", "esteira", "corrida"],
  comida: ["alimentacao", "dieta", "nutricao"],
  dieta: ["alimentacao", "nutricao", "deficit calorico"],
  iniciante: ["comecar", "começar", "primeira vez", "academia"],
  dor: ["lesao", "lesão", "dores"],
  ppl: ["push pull legs"],
  caneta: ["ozempic", "mounjaro", "wegovy", "retatrutida", "tirzepatida", "semaglutida", "glp-1"],
};

/**
 * Grafias compostas reescritas antes de qualquer processamento. Anexar como
 * sinônimo não serve aqui: o termo original ("fullbody") continuaria na
 * pergunta, nunca casaria com nada e derrubaria a cobertura da âncora.
 */
const REWRITES: Array<[RegExp, string]> = [
  [/\bfull-?body\b/gi, "full body"],
  [/\bupper-?lower\b/gi, "upper lower"],
  [/\bpush-?pull(-?legs)?\b/gi, "push pull legs"],
];

export function rewriteQuery(q: string): string {
  let out = q;
  for (const [re, sub] of REWRITES) out = out.replace(re, sub);
  return out;
}

function expandQuery(q: string): string {
  const nq = norm(q);
  const extras: string[] = [];
  for (const [key, syns] of Object.entries(SYNONYMS)) {
    if (nq.includes(norm(key))) extras.push(...syns);
  }
  return extras.length ? `${q} ${extras.join(" ")}` : q;
}

// ── Chunking por seção (H2) ──────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<figure[\s\S]*?<\/figure>/gi, " ")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface Section {
  heading: string;
  text: string;
}

function sectionize(content: string): Section[] {
  const parts = content.split(/<h2[^>]*>/i);
  const sections: Section[] = [];
  // parte antes do primeiro H2 = introdução
  const intro = stripHtml(parts[0] ?? "");
  if (intro.length > 80) sections.push({ heading: "Introdução", text: intro });
  for (const part of parts.slice(1)) {
    const [rawHeading, ...rest] = part.split(/<\/h2>/i);
    const heading = stripHtml(rawHeading ?? "").slice(0, 120);
    const text = stripHtml(rest.join("</h2>"));
    if (heading && text.length > 60 && !/^refer/i.test(heading)) {
      sections.push({ heading, text });
    }
  }
  return sections;
}

function scoreSection(section: Section, terms: string[]): number {
  const hay = norm(section.heading + " " + section.text);
  let score = 0;
  for (const t of terms) {
    if (t.length < 3) continue;
    if (norm(section.heading).includes(t)) score += 8;
    const count = hay.split(t).length - 1;
    score += Math.min(count * 2, 10);
  }
  return score;
}

const CHUNK_MAX = 1400;

function clip(text: string): string {
  if (text.length <= CHUNK_MAX) return text;
  const cut = text.slice(0, CHUNK_MAX);
  return cut.slice(0, cut.lastIndexOf(". ") + 1) || cut;
}

// ── Recuperação principal ────────────────────────────────────────────────────

export interface PageContext {
  slug?: string;
  title?: string;
  category?: string;
}

export function retrieve(question: string, context?: PageContext): RetrievalResult {
  const rewritten = rewriteQuery(question);
  const expanded = expandQuery(rewritten);
  // Pontuação precisa sair antes de virar termo: "divisão?" normalizava para
  // "divisao?" e nunca casava com o slug "full-body-vs-divisao-abc". Toda
  // pergunta cuja palavra-chave era a última palavra caía em "sem resposta".
  const terms = norm(expanded)
    .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3);

  const chunks: KnowledgeChunk[] = [];
  const sources: RetrievalResult["sources"] = [];
  let evidence = 0;

  // 1) Docs de negócio (lexical simples sobre keywords)
  const nq = norm(rewritten);
  const hasDomainHint = DOMAIN_HINT.test(nq);
  const bizHits = BUSINESS_DOCS.map((d) => ({
    d,
    score: d.keywords.reduce((acc, k) => {
      const kn = norm(k);
      if (!nq.includes(kn)) return acc;
      // Palavra genérica só conta com um termo do domínio junto.
      if (GENERIC_KEYWORDS.has(kn) && !hasDomainHint) return acc;
      return acc + 1;
    }, 0),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  for (const { d, score } of bizHits) {
    chunks.push({
      articleId: d.id,
      title: d.title,
      slug: d.path,
      url: `${SITE_URL}${d.path}`,
      heading: d.heading,
      category: "Institucional",
      text: d.text,
    });
    sources.push({ title: d.title, slug: d.path, url: `${SITE_URL}${d.path}` });
    evidence += score * 20;
  }

  // 2) Artigos via a mesma camada de busca do site
  const results = search(expanded, 8);

  // Boost de contexto: se a pergunta nasce dentro de um artigo, ele entra
  // na disputa mesmo que a busca não o traga (sem forçar exclusividade).
  const contextSlug = context?.slug;
  if (contextSlug && getBlogPost(contextSlug) && !results.some((r) => r.slug === contextSlug)) {
    results.push({
      slug: contextSlug,
      title: getBlogPost(contextSlug)!.title,
      excerpt: "",
      category: getBlogPost(contextSlug)!.category,
      date: "",
      readTime: "",
      score: 60,
    });
  }

  const topArticles = results
    .map((r) => ({ ...r, score: r.slug === contextSlug ? r.score + 80 : r.score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .filter((r) => r.score >= 40);

  for (const art of topArticles) {
    const post = getBlogPost(art.slug);
    if (!post) continue;
    const sections = sectionize(post.content)
      .map((s) => ({ s, score: scoreSection(s, terms) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
    for (const { s } of sections) {
      if (chunks.length >= 6) break;
      chunks.push({
        articleId: post.slug,
        title: post.title,
        slug: `/blog/${post.slug}`,
        url: `${SITE_URL}/blog/${post.slug}`,
        heading: s.heading,
        category: post.category,
        text: clip(s.text),
      });
    }
    // FAQ do artigo costuma responder perguntas diretas muito bem
    const faqHit = (post.faq ?? [])
      .map((f) => ({ f, score: scoreSection({ heading: f.question, text: f.answer }, terms) }))
      .sort((a, b) => b.score - a.score)[0];
    if (faqHit && faqHit.score > 8 && chunks.length < 7) {
      chunks.push({
        articleId: post.slug,
        title: post.title,
        slug: `/blog/${post.slug}`,
        url: `${SITE_URL}/blog/${post.slug}`,
        heading: `FAQ: ${faqHit.f.question}`,
        category: post.category,
        text: faqHit.f.answer,
      });
    }
    if (!sources.some((x) => x.slug === `/blog/${post.slug}`)) {
      sources.push({ title: post.title, slug: `/blog/${post.slug}`, url: `${SITE_URL}/blog/${post.slug}` });
    }
    evidence += art.score;
  }

  // Âncora anti-fora-de-domínio: a evidência lexical infla com palavras
  // genéricas ("melhor", "como", "qual"). Exigimos que ao menos um termo
  // distintivo da pergunta (ou sinônimo expandido) apareça nos metadados das
  // fontes; sem âncora, tratamos como "sem base suficiente".
  const STOP = new Set([
    "como","qual","quais","para","fazer","melhor","melhores","devo","posso",
    "mais","menos","muito","pouco","isso","essa","esse","minha","meu","com",
    "sem","por","que","uma","um","dia","dias","vezes","semana","ano","2025",
    "2026","2027","hoje","agora","sobre","entre","depois","antes","ainda",
    "consigo","preciso","quero","tenho","esta","estou","ser","tem","nao",
  ]);
  const anchorTerms = terms.filter((t) => t.length >= 4 && !STOP.has(t));
  // Âncora anti-fora-de-domínio, por cobertura ponderada.
  //
  // Duas ideias: (1) termo raro no acervo vale mais que termo comum — "divisao"
  // pesa 6, "melhor" pesa 0,25; (2) aparecer no título ou no slug prova que o
  // conteúdo é SOBRE aquilo, enquanto aparecer só no corpo do texto é sinal
  // fraco, porque num acervo de 813 artigos quase toda palavra aparece em
  // algum parágrafo. Sem essa distinção, "qual o melhor celular" passava.
  const metaForte = norm(
    sources.map((s) => s.title + " " + s.slug).join(" ") +
      " " +
      chunks.map((c) => `${c.heading} ${c.category}`).join(" ")
  );
  const metaFraca = norm(chunks.map((c) => c.text).join(" "));

  let encontrado = 0;
  let total = 0;
  for (const t of anchorTerms) {
    const peso = termRarity(t);
    total += peso;
    if (metaForte.includes(t)) encontrado += peso;
    else if (metaFraca.includes(t)) encontrado += peso * 0.5;
  }
  const cobertura = total === 0 ? 1 : encontrado / total;
  const anchored = anchorTerms.length === 0 || cobertura >= 0.55;

  return {
    chunks: anchored ? chunks : [],
    sources: sources.slice(0, 4),
    evidence: anchored ? evidence : 0,
  };
}
