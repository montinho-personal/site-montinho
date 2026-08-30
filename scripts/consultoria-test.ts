/**
 * A landing page de Consultoria Online.
 *   npx tsx scripts/consultoria-test.ts
 *
 * Esta página é a que mais se aproxima de "venda" no site, e é justamente
 * por isso que ela precisa de trava: a pressão para exagerar mora aqui, não
 * nos artigos. Os testes protegem três coisas — a honestidade da copy, a
 * integridade da medição e a ausência de duplicação de eventos.
 */

import { readFileSync } from "node:fs";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

const pagina = readFileSync("app/consultoria-online/page.tsx", "utf8");
const funil = readFileSync("components/consultoria/Funil.tsx", "utf8");
const cta = readFileSync("components/lp/WhatsCta.tsx", "utf8");
const analytics = readFileSync("lib/analytics.ts", "utf8");

/**
 * Comentários fora — de TODOS os arquivos, não só da página.
 *
 * Os comentários citam de propósito o que o código não pode fazer: o do
 * funil explica que não redispara `scroll_75` e que a versão antiga usava
 * `threshold: 0.4`. Um teste que lê o comentário reprova o código por
 * mencionar o próprio defeito que corrigiu — foi exatamente o que aconteceu
 * na primeira execução deste arquivo.
 */
const semComents = (src: string) =>
  src.replace(/\{\/\*[\s\S]*?\*\/\}/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");

const semComentarios = semComents(pagina);
const funilLimpo = semComents(funil);
const ctaLimpo = semComents(cta);

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. NADA DE ESCASSEZ FALSA NEM PROMESSA GARANTIDA");

/**
 * A lista é literal e curta de propósito. Não tenta adivinhar intenção —
 * pega as construções que efetivamente aparecem em página de venda ruim, e
 * que uma vez escritas passam despercebidas em revisão.
 */
const PROIBIDOS: [string, RegExp][] = [
  ["contagem regressiva", /contagem regressiva|termina em \d|expira em/i],
  ["últimas vagas", /últimas? vagas?|restam? (apenas )?\d+ vagas?/i],
  ["só hoje / promoção relâmpago", /só hoje|apenas hoje|promoção relâmpago|oferta relâmpago/i],
  ["desconto com preço riscado", /de R\$ ?\d+ por R\$ ?\d+/i],
  ["resultado garantido", /resultado garantido|garanto (o |seu )?resultado|100% garantido/i],
  ["promessa de prazo", /em \d+ dias você (vai|estará)|perca \d+ ?kg em/i],
];
for (const [nome, re] of PROIBIDOS) {
  const achado = semComentarios.match(re);
  ok(`sem ${nome}`, achado === null, achado ? `"${achado[0]}"` : "");
}

/**
 * A frase de capacidade limitada PODE existir — mas só acompanhada do motivo.
 * "Atendo um número limitado de alunos" sozinho é escassez; com "é o que
 * mantém as correções próximas" é uma explicação de como o serviço funciona.
 */
{
  const temCapacidade = /número limitado de alunos/i.test(semComentarios);
  const temMotivo = /é\s+o\s+que\s+mantém/i.test(semComentarios.replace(/\s+/g, " "));
  ok("se fala em capacidade limitada, explica o porquê", !temCapacidade || temMotivo);
}

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. TODO CTA SABE DE ONDE FOI CLICADO");

{
  const ctas = semComentarios.match(/<Cta\b[^>]*\/>/g) ?? [];
  ok("existem CTAs na página", ctas.length >= 6, `${ctas.length}`);
  const semPosicao = ctas.filter((c) => !/\bem=/.test(c));
  ok("todo CTA declara a posição", semPosicao.length === 0, `${semPosicao.length} sem`);

  ok("o componente registra a posição no evento",
    /trackEvent\("consultoria_cta_click", \{ placement: "consultoria-online", posicao \}\)/.test(cta));

  /* Toda chave usada precisa existir no mapa de mensagens. */
  const chavesUsadas = [...semComentarios.matchAll(/\bem="([a-z]+)"/g)].map((m) => m[1]);
  const mapa = semComentarios.slice(semComentarios.indexOf("const MSG"), semComentarios.indexOf("} as const;"));
  const orfas = [...new Set(chavesUsadas)].filter((k) => !new RegExp(`\\b${k}:`).test(mapa));
  ok("toda posição tem mensagem própria de WhatsApp", orfas.length === 0, orfas.join(", "));
  ok("as posições cobrem o começo, o meio e o fim da página",
    ["hero", "prova", "final"].every((k) => chavesUsadas.includes(k)));
}

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. A CONVERSA COMEÇA COMO GENTE, NÃO COMO FORMULÁRIO");

{
  const mapa = semComentarios.slice(semComentarios.indexOf("const MSG"), semComentarios.indexOf("} as const;"));
  const mensagens = [...mapa.matchAll(/"([^"]{20,})"/g)].map((m) => m[1]);
  ok("existem mensagens contextuais", mensagens.length >= 5, `${mensagens.length}`);
  ok("nenhuma soa como disparo comercial",
    !mensagens.some((m) => /aproveitar|oferta|promoção|imperdível|garantir minha vaga/i.test(m)));
  ok("todas se apresentam de forma humana",
    mensagens.every((m) => /^Olá, Montinho!/.test(m)),
    mensagens.filter((m) => !/^Olá, Montinho!/.test(m)).join(" | "));

  /**
   * O CTA do topo pede a MENOR decisão possível. Pedir "quero minha
   * consultoria" a quem está na página há cinco segundos é pedir compra
   * antes de explicar o que se vende.
   */
  const heroCta = semComentarios.match(/<Cta\s+em="hero"[\s\S]{0,200}?\/>/)?.[0] ?? "";
  ok("o CTA do topo não pede compra logo de cara",
    /entender|conhecer|saber/i.test(heroCta) && !/quero minha consultoria/i.test(heroCta),
    heroCta.replace(/\s+/g, " ").slice(0, 90));
}

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. O FUNIL MEDE, E NÃO DUPLICA O QUE JÁ EXISTE");

const ETAPAS = [
  "consultoria_view",
  "consultoria_etapa_proposta",
  "consultoria_etapa_prova",
  "consultoria_etapa_metodo",
  "consultoria_etapa_objecoes",
];
for (const e of ETAPAS) {
  ok(`${e} está declarado e é usado`, analytics.includes(`"${e}"`) && (pagina + funil).includes(e));
}

/**
 * A duplicação é o erro silencioso da medição: o evento global já conta, o
 * local conta de novo, e a métrica dobra sem ninguém perceber até alguém
 * comparar com outra página.
 */
ok("a página não redispara o scroll_75 global", !/scroll_75/.test(semComentarios + funilLimpo + ctaLimpo));
ok("a página não redispara o click_whatsapp global", !/trackEvent\("click_whatsapp"/.test(semComentarios + funilLimpo + ctaLimpo));
ok("o motivo da não-duplicação está escrito no código", /não repetem|Duplicar/i.test(funil));

/**
 * A TRAVA DO LIMIAR IMPOSSÍVEL.
 *
 * A primeira versão usava threshold 0.4 e a etapa da prova social nunca
 * disparava: aquela seção tem 2.295 px e a tela do celular, 844 — só 37%
 * dela cabe de uma vez. O evento não tinha bug, estava proibido de
 * acontecer. Observador de seção grande precisa de faixa, não de fração.
 */
ok("as etapas usam faixa central, não fração da seção",
  /rootMargin: "-\d+% 0px -\d+% 0px"/.test(funilLimpo) && !/threshold: 0\.[1-9]/.test(funilLimpo),
  "seção maior que a tela nunca atinge fração alta");

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. AS DUAS SAÍDAS EXISTEM E SÃO PARA DENTRO DO SITE");

ok("há ponte para os resultados", /href="\/resultados"/.test(pagina));
ok("há ponte para a história", /href="\/minha-historia"/.test(pagina));
ok("as duas são rastreadas",
  /consultoria_resultados_click/.test(pagina) && /consultoria_historia_click/.test(pagina));

/**
 * Um só botão flutuante. O global fica escondido porque, no celular, ele
 * pousa exatamente sobre a barra fixa da página — dois WhatsApps empilhados,
 * com mensagens diferentes, um cobrindo o outro.
 */
ok("o botão flutuante global fica oculto nesta página",
  /a\[aria-label="Fale conosco pelo WhatsApp"\][^`]*display: none/.test(pagina));

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. ESTRUTURA E SEO");

ok("existe exatamente um H1", (pagina.match(/<h1/g) ?? []).length === 1);
ok("o canonical aponta para a própria página",
  /canonical: "https:\/\/www\.montinhopersonal\.com\.br\/consultoria-online"/.test(pagina));
ok("o schema de serviço existe", /"@type": "Service"/.test(pagina));
ok("o FAQ tem dados estruturados", /"@type": "FAQPage"/.test(pagina));
ok("a página declara área de atendimento", /areaServed/.test(pagina));

console.log("\n" + "=".repeat(64));
if (falhas > 0) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
