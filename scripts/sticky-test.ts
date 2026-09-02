/**
 * Sticky bar contextual.
 *   npx tsx scripts/sticky-test.ts
 *
 * A barra é o elemento mais próximo de "venda" que aparece em TODAS as
 * páginas, e é por isso que precisa de trava: a pressão para virar banner
 * mora aqui. Os testes protegem quatro coisas — a honestidade da copy, a
 * coerência regra ↔ destino, o comportamento (quando aparece, quando some)
 * e a ausência de dado pessoal na medição.
 */

import { existsSync, readFileSync } from "node:fs";
import { blogPosts } from "../lib/blog";
import { artigoDeExecucao } from "../lib/revisao";
import { regraParaArtigo } from "../lib/sticky/artigo";
import {
  LIMIARES,
  REGRAS,
  SUPRIMIDA,
  regraPorRota,
  resolve,
} from "../lib/sticky/regras";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

const componente = readFileSync("components/sticky/StickyBar.tsx", "utf8");
const semComents = (s: string) =>
  s.replace(/\{\/\*[\s\S]*?\*\/\}/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
const comp = semComents(componente);
const layout = readFileSync("app/layout.tsx", "utf8");
const analytics = readFileSync("lib/analytics.ts", "utf8");
const cookies = readFileSync("components/layout/CookieBanner.tsx", "utf8");
const css = readFileSync("app/globals.css", "utf8");
const paginaBlog = readFileSync("app/blog/[slug]/page.tsx", "utf8");

const TODAS = Object.entries(REGRAS).map(([id, f]) => ({ id, r: f({ titulo: "Artigo de teste", local: "Tamboré" }) }));

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. A COPY NÃO VIRA BANNER");

/**
 * Lista literal, como nas outras suítes: pega o que efetivamente aparece em
 * barra de venda ruim. E os três termos médicos que o briefing proibiu por
 * nome — "cure", "resolva sua lesão", "acabe com a dor".
 */
const PROIBIDOS: [string, RegExp][] = [
  ["urgência falsa", /compre agora|[úu]ltima chance|s[óo] hoje|vagas? limitad|corra|aproveite/i],
  ["promessa de resultado", /garantid|resultado certo|em \d+ dias/i],
  ["promessa médica", /\bcur[ae]\b|resolva sua les|acabe com a dor|elimine a dor|sem dor/i],
  ["gritaria", /[A-ZÁÉÍÓÚÇ]{6,}/],
  ["corporativês", /premium|solu[çc][ãa]o completa|exclusiv/i],
];
for (const { id, r } of TODAS) {
  const t = `${r.texto} ${r.textoB ?? ""} ${r.botao}`;
  for (const [nome, re] of PROIBIDOS) {
    const m = t.match(re);
    ok(`${id}: sem ${nome}`, m === null, m ? `"${m[0]}"` : "");
  }
  ok(`${id}: texto cabe no celular (${r.texto.length})`, r.texto.length <= 52, r.texto);
  ok(`${id}: botão curto (${r.botao.length})`, r.botao.length <= 20, r.botao);
  ok(`${id}: botão é verbo específico`, !/saiba mais|clique aqui|ver mais/i.test(r.botao), r.botao);
}

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. REGRA E DESTINO CONTAM A MESMA HISTÓRIA");

const rotaExiste = (href: string) => {
  const p = href.replace(/\/$/, "") || "/";
  if (p === "/") return existsSync("app/page.tsx");
  return existsSync(`app${p}/page.tsx`);
};
for (const { id, r } of TODAS) {
  if (r.destino === "whatsapp") {
    ok(`${id}: WhatsApp aponta para wa.me`, /^https:\/\/wa\.me\/\d+\?text=/.test(r.href));
    const msg = decodeURIComponent(r.href.split("text=")[1] ?? "");
    ok(`${id}: a mensagem se apresenta como gente`, /^(Olá|Oi), Montinho!/.test(msg), msg.slice(0, 40));
    ok(`${id}: a mensagem não soa como disparo`, !/aproveitar|oferta|promo|garantir/i.test(msg));
  } else {
    ok(`${id}: destino interno existe (${r.href})`, rotaExiste(r.href));
  }
  if (r.destino === "diagnostico") ok(`${id}: diagnóstico vai para /diagnostico`, r.href === "/diagnostico");
  if (r.destino === "ferramenta") ok(`${id}: ferramenta não aponta para artigo`, !r.href.startsWith("/blog/"));
}

/* Temas com limite profissional: nunca WhatsApp como primeiro passo, sempre copy contida. */
for (const id of ["dor", "saude", "glp1"]) {
  const r = REGRAS[id]({});
  ok(`${id}: primeiro passo é educativo, não conversa`, r.destino !== "whatsapp");
}

/* Ferramentas não têm regra: o próximo passo é o bloco pós-resultado. */
ok("nenhuma regra de ferramenta de cálculo (isso é do PosResultado)",
  !TODAS.some(({ id }) => id.startsWith("ferramenta_")));
ok("local aparece cedo", REGRAS.local({}).gatilho === "cedo");
ok("consultoria aparece cedo", REGRAS.consultoria({}).gatilho === "cedo");
ok("exercício não aparece antes do sinal", REGRAS.exercicio({}).gatilho === "padrao");

/* O contexto entra na mensagem: exercício cita o artigo, local cita o lugar. */
ok("exercício leva o título do artigo",
  decodeURIComponent(REGRAS.exercicio({ titulo: "Como Fazer Remada Curvada" }).href).includes("Como Fazer Remada Curvada"));
ok("local leva o nome do lugar no texto e na mensagem",
  REGRAS.local({ local: "Barueri" }).texto.includes("Barueri") &&
  decodeURIComponent(REGRAS.local({ local: "Barueri" }).href).includes("Barueri"));

/* Exercício sem título não quebra: cai na mensagem genérica. */
ok("exercício sem título tem mensagem válida", /wa\.me/.test(REGRAS.exercicio({}).href));

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. TODO ARTIGO RESOLVE PARA UMA REGRA QUE EXISTE");

{
  const dist = new Map<string, number>();
  const semRegra: string[] = [];
  const execucaoErrada: string[] = [];
  const localSemContexto: string[] = [];
  for (const p of blogPosts) {
    const { id, contexto } = regraParaArtigo(p);
    dist.set(id, (dist.get(id) ?? 0) + 1);
    if (!REGRAS[id]) semRegra.push(`${p.slug} → ${id}`);
    if (id === "exercicio" && !artigoDeExecucao(p)) execucaoErrada.push(p.slug);
    if (id === "local" && !contexto) localSemContexto.push(p.slug);
  }
  ok("nenhum artigo cai numa regra inexistente", semRegra.length === 0, semRegra.slice(0, 5).join(", "));
  ok("o convite de vídeo só vai a artigo de execução", execucaoErrada.length === 0, execucaoErrada.slice(0, 5).join(", "));
  ok("todo artigo local sabe o nome do lugar", localSemContexto.length === 0, localSemContexto.slice(0, 5).join(", "));
  const fb = dist.get("fallback") ?? 0;
  ok(`o fallback não é a regra mais comum (${fb} de ${blogPosts.length})`, fb < blogPosts.length * 0.35);
  console.log("   distribuição:", [...dist.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join("  "));

  /* Casos conhecidos. */
  const por = (s: string) => regraParaArtigo(blogPosts.find((p) => p.slug === s)!);
  ok("como-fazer-supino-reto → exercício", por("como-fazer-supino-reto").id === "exercicio");
  ok("como-perder-gordura-abdominal NÃO é exercício", por("como-perder-gordura-abdominal").id !== "exercicio");
  ok("personal-trainer-tambore-1 → local (Tamboré)", por("personal-trainer-tambore-1").id === "local" && por("personal-trainer-tambore-1").contexto === "Tamboré");
  ok("dor-no-joelho-no-agachamento → dor", por("dor-no-joelho-no-agachamento").id === "dor");
  ok("mounjaro-faz-perder-musculos → glp1", por("mounjaro-faz-perder-musculos").id === "glp1");
  ok("personal-trainer-sorocaba → fora da região", por("personal-trainer-sorocaba").id === "local_fora");
}

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. ROTA: SUPRESSÃO E FALLBACK");

for (const s of SUPRIMIDA) {
  const exemplo = s.padrao.source.replace(/[\^$\\?()|]/g, "").replace(/\/\|.*$/, "").replace(/\(.*$/, "") || "/";
  ok(`suprimida: ${exemplo} (${s.motivo})`, regraPorRota(exemplo) === null);
}
ok("/consultoria-online fica sem barra (tem a própria)", regraPorRota("/consultoria-online") === null);
ok("/consultoria tem a regra de consultoria", regraPorRota("/consultoria") === "consultoria");
ok("/personal-trainer-tambore → local", regraPorRota("/personal-trainer-tambore") === "local");
for (const rota of [
  "/ferramentas/calculadora-de-proteina", "/ferramentas/calculadora-macros", "/ferramentas/calculadora-deficit-calorico",
  "/ferramentas/calculadora-tmb-tdee", "/ferramentas/calculadora-volume-treino", "/ferramentas/calculadora-1rm",
  "/diagnostico", "/academia-ideal-alphaville",
]) ok(`${rota} fica sem barra (o próximo passo é o bloco pós-resultado)`, regraPorRota(rota) === null);
ok("/alimentos continua com barra (não tem resultado)", regraPorRota("/alimentos/frango") === "alimentos");
ok("/treino-para-minha-rotina fica sem barra (já tem WhatsApp no fim)", regraPorRota("/treino-para-minha-rotina") === null);
ok("/ferramentas/monte-seu-cardapio fica sem barra (já tem WhatsApp no fim)", regraPorRota("/ferramentas/monte-seu-cardapio") === null);
ok("home → institucional", regraPorRota("/") === "institucional");
ok("rota desconhecida → fallback", regraPorRota("/uma-pagina-qualquer") === "fallback");

ok("a barra não escuta evento de resultado (isso saiu com as regras de ferramenta)",
  !/EVENTOS_DE_RESULTADO/.test(comp) && !/montinho:evento/.test(comp));

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. RECORRÊNCIA: SÓ ESCALA O QUE É EDUCATIVO");

ok("1ª visita: hipertrofia fica hipertrofia", resolve("hipertrofia", { visitas: 0 })?.id === "hipertrofia");
ok("2ª visita: hipertrofia vira 'organizar'", resolve("hipertrofia", { visitas: 2 })?.id === "retorno");
ok("4ª visita: vira conversa", resolve("hipertrofia", { visitas: 4 })?.id === "retorno_conversa");
ok("local NÃO escala (já é a ação certa)", resolve("local", { visitas: 5, local: "Barueri" })?.id === "local");
ok("exercício NÃO escala", resolve("exercicio", { visitas: 5 })?.id === "exercicio");
ok("consultoria NÃO escala", resolve("consultoria", { visitas: 5 })?.id === "consultoria");
ok("regra inexistente devolve null", resolve("nao-existe") === null);

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. O COMPONENTE: QUANDO APARECE, QUANDO SOME");

ok("está montado no layout, antes do banner de cookies",
  /<StickyBar \/>\s*<CookieBanner \/>/.test(layout));
ok("a rota é a key — cada navegação nasce zerada", /<Barra key=\{pathname\}/.test(comp));
ok("não aparece no carregamento: espera rolagem OU tempo",
  /addEventListener\("scroll"/.test(comp) && /setTimeout\(mostra, ms\)/.test(comp));
ok("os limiares são os do briefing", LIMIARES.padrao.scroll === 0.25 && LIMIARES.padrao.ms === 15_000 && LIMIARES.cedo.ms <= 5_000);
ok("espera o banner de cookies ser respondido", /bannerDeCookiesNaTela\(\)/.test(comp) && /montinho:cookies/.test(comp));
ok("não aparece com modal aberto", /modalAberto\(\)/.test(comp));
ok("no celular o texto tem a linha inteira e o botão vem embaixo (não corta o texto)",
  /grid-cols-\[1fr_auto\] sm:grid-cols-\[1fr_auto_auto\]/.test(comp) && /col-span-2 sm:col-span-1/.test(comp));
ok("some enquanto a pessoa digita", /digitando\(\)/.test(comp) && /focusin/.test(comp));
ok("fechar guarda na sessão", /CH\.fechada, "1"/.test(comp));
ok("clicar guarda a conversão por regra", /CH\.convertida \+ regra\.id/.test(comp));
ok("o listener de scroll é removido", /removeEventListener\("scroll", aoRolar\)/.test(comp));
ok("o efeito desfaz tudo ao desmontar", /return \(\) => desfazer\.forEach/.test(comp));

/* Coexistência com o botão flutuante: sobe ou some, nunca sobrepõe. */
ok("levanta o float quando aparece", /sticky-visivel/.test(comp) && /body\.sticky-visivel a\[aria-label="Fale conosco pelo WhatsApp"\]/.test(css));
ok("esconde o float quando a própria barra é WhatsApp", /sticky-whats/.test(comp) && /body\.sticky-whats[^{]*\{\s*display: none/.test(css));
ok("fica abaixo do banner de cookies (z-40 < z-50)", /z-40/.test(comp) && /z-50/.test(cookies));

/* Acessibilidade e mobile. */
ok("botão de fechar tem nome acessível e 44px", /aria-label="Fechar sugest/.test(comp) && /w-11 h-11/.test(comp));
ok("respeita a safe area do aparelho", /env\(safe-area-inset-bottom/.test(comp));
ok("animação desliga com prefers-reduced-motion", /motion-safe:animate-\[sticky-sobe/.test(comp) && /@keyframes sticky-sobe/.test(css));
ok("foco visível nos controles", (comp.match(/focus-visible:outline/g) ?? []).length >= 2);
/* O seletor `[role="dialog"]` da supressão de modal não conta: o que não pode é a barra SER um diálogo. */
ok("é região complementar, não diálogo", /role="complementary"/.test(comp) && !/\srole="dialog"/.test(comp));

/* Nada de setState no corpo do efeito — só em callback. */
{
  const corpo = comp.match(/useEffect\(\(\) => \{([\s\S]*?)\n  \}, \[pathname\]\);/)?.[1] ?? "";
  const antesDoPrimeiroCallback = corpo.split("const mostra = ")[0];
  ok("o efeito principal não chama setState de forma síncrona", !/\bset[A-Z]\w*\(/.test(antesDoPrimeiroCallback));
}

// ─── 7 ──────────────────────────────────────────────────────────────────────
bloco("7. AS PONTES: PÁGINA → BARRA, FERRAMENTA → BARRA, COOKIES → BARRA");

ok("o artigo declara a regra em meta tag no build", /"montinho-sticky": sticky\.id/.test(paginaBlog));
ok("o componente lê a meta antes da rota", /meta\("montinho-sticky"\) \?\? regraPorRota/.test(comp));
ok("trackEvent avisa a página (ferramenta → barra)", /dispatchEvent\(new CustomEvent\("montinho:evento"/.test(analytics));
ok("o banner de cookies avisa quando é respondido", /dispatchEvent\(new CustomEvent\("montinho:cookies"\)\)/.test(cookies));

// ─── 8 ──────────────────────────────────────────────────────────────────────
bloco("8. MEDIÇÃO SEM DADO PESSOAL");

for (const e of ["sticky_view", "sticky_click", "sticky_close"]) {
  ok(`${e} declarado e usado`, analytics.includes(`"${e}"`) && comp.includes(`"${e}"`));
}
{
  const chamadas = comp.match(/trackEvent\([^;]*\)/g) ?? [];
  ok("existem chamadas para auditar", chamadas.length >= 3);
  const SENSIVEL = /\b(peso|kcal|idade|sexo|altura|email|nome|telefone|pergunta|referrer|utm_source|href|url)\b/i;
  ok("nenhuma chamada carrega dado pessoal ou URL de origem",
    chamadas.every((c) => !SENSIVEL.test(c)), chamadas.filter((c) => SENSIVEL.test(c)).join(" | "));
  ok("a origem é um rótulo, não a URL", /rotulo = "google_organic"/.test(comp) && !/ss\.set\(CH\.origem, host\)/.test(comp));
}
ok("as datas de visita nunca saem do aparelho", !/visitas: dias|dias\b[^;]*trackEvent/.test(comp));

console.log("\n" + "=".repeat(64));
if (falhas > 0) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
