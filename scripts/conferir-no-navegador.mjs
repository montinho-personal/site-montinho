/**
 * Conferência no navegador de toda página que uma mudança tocou (regra do
 * AGENTS.md "Toda mudança no site é conferida no navegador", pedida pelo
 * Montinho em 25/11/2026).
 *
 *   node scripts/conferir-no-navegador.mjs <slug-ou-url> [...]
 *   BASE=http://localhost:3000 node scripts/conferir-no-navegador.mjs /blog/x
 *
 * Um slug sem barra vira /blog/<slug>. Sem BASE, confere o site no ar.
 *
 * Para cada página, no computador (1366×900) e no celular (iPhone 13):
 *  - abre, espera carregar e rola até o fim (imagens com lazy load);
 *  - status HTTP, erros de JavaScript e de console, pedidos do próprio site
 *    que falham (4xx/5xx), imagem quebrada, título, descrição e um só <h1>;
 *  - no celular, se a página vaza para os lados (rolagem horizontal);
 *  - links internos: cada um é pedido e precisa responder 2xx/3xx;
 *  - botões do WhatsApp: o link precisa apontar para wa.me ou para /l/;
 *  - ferramentas e formulários: preenche os campos, clica nos botões da
 *    página (nunca em link externo) e confere se nada quebrou;
 *  - tira dois prints de cada versão, o topo antes de mexer e a tela depois
 *    dos cliques (pasta OUT, padrão /tmp/conferencia).
 *
 * Não suja dado: bloqueia analytics (GA, Vercel), o registro de lead do
 * WhatsApp (/api/crm/handoff), a pergunta à IA (/api/ask) e o palpite.
 *
 * Sai com código 1 se achar qualquer problema.
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

// O Playwright pode estar no projeto ou instalado no sistema (no ambiente de
// nuvem ele vem pré-instalado e só o require do CommonJS o encontra).
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");

const BASE = (process.env.BASE || "https://www.montinhopersonal.com.br").replace(/\/$/, "");
const OUT = process.env.OUT || "/tmp/conferencia";
mkdirSync(OUT, { recursive: true });

const alvos = process.argv.slice(2).map((a) =>
  /^https?:\/\//.test(a) ? a : a.startsWith("/") ? BASE + a : `${BASE}/blog/${a}`
);
if (!alvos.length) {
  console.error("uso: node scripts/conferir-no-navegador.mjs <slug-ou-url> [...]");
  process.exit(2);
}

const BLOQUEIO = [
  /googletagmanager\.com/, /google-analytics\.com/, /\/_vercel\/(insights|speed-insights)/,
  /\/api\/crm\/handoff/, /\/api\/ask/, /\/api\/palpite/, /connect\.facebook\.net/, /news\.google\.com\/swg/,
];
// "Failed to load resource" não diz qual arquivo: quem cuida disso são os
// eventos de pedido abaixo, que separam o que é do site do que é de fora.
const RUIDO_CONSOLE = [/Failed to load resource/i, /ERR_BLOCKED_BY_CLIENT/];

const VERSOES = [
  { nome: "computador", ctx: { viewport: { width: 1366, height: 900 } } },
  { nome: "celular", ctx: { ...devices["iPhone 13"] } },
];

const linkStatus = new Map();
let problemas = 0;
const avisos = new Set();
const falha = (msg) => { problemas++; console.log(`  ✗ ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

async function conferirLinks(request, hrefs) {
  const ruins = [];
  for (const h of hrefs) {
    if (!linkStatus.has(h)) {
      try {
        const r = await request.get(h, { maxRedirects: 5, timeout: 30000 });
        linkStatus.set(h, r.status());
      } catch { linkStatus.set(h, 0); }
    }
    const st = linkStatus.get(h);
    if (!(st >= 200 && st < 400)) ruins.push(`${h} (${st || "sem resposta"})`);
  }
  return ruins;
}

async function interagir(page) {
  // Preenche campos e clica nos botões da página, sem sair dela.
  const campos = await page.$$("main input:not([type=hidden]):not([disabled]), main select, main textarea");
  for (const c of campos.slice(0, 30)) {
    try {
      if (!(await c.isVisible())) continue;
      const tag = await c.evaluate((e) => e.tagName.toLowerCase());
      const tipo = (await c.getAttribute("type")) || "";
      if (tag === "select") {
        const opts = await c.$$eval("option", (o) => o.map((x) => x.value).filter(Boolean));
        if (opts.length) await c.selectOption(opts[Math.min(1, opts.length - 1)]);
      } else if (tipo === "number" || tipo === "range") {
        const min = Number(await c.getAttribute("min")) || 0;
        const max = Number(await c.getAttribute("max")) || 0;
        const v = max > min ? Math.round((min + max) / 2) : 70;
        await c.fill(String(v));
      } else if (tipo === "checkbox" || tipo === "radio") {
        await c.check({ timeout: 2000 }).catch(() => {});
      } else if (["text", "search", ""].includes(tipo) && tag !== "textarea") {
        await c.fill("70");
      }
    } catch { /* campo que não aceita: segue */ }
  }
  const botoes = await page.$$("main button:not([disabled])");
  let clicados = 0;
  for (const b of botoes.slice(0, 25)) {
    try {
      if (!(await b.isVisible())) continue;
      const antes = page.url();
      await b.click({ timeout: 3000 });
      clicados++;
      await page.waitForTimeout(250);
      if (page.url().split("#")[0] !== antes.split("#")[0]) await page.goBack();
    } catch { /* botão coberto ou que some: segue */ }
  }
  return { campos: campos.length, clicados };
}

const browser = await chromium.launch();
for (const url of alvos) {
  console.log(`\n${url}`);
  for (const v of VERSOES) {
    console.log(` [${v.nome}]`);
    const ctx = await browser.newContext(v.ctx);
    await ctx.route("**/*", (route) =>
      BLOQUEIO.some((re) => re.test(route.request().url())) ? route.abort() : route.continue()
    );
    const page = await ctx.newPage();
    const erros = [];
    const pedidosRuins = [];
    page.on("pageerror", (e) => erros.push(`erro de JavaScript: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error" && !RUIDO_CONSOLE.some((re) => re.test(m.text()))) erros.push(`console: ${m.text().slice(0, 200)}`);
    });
    page.on("requestfailed", (r) => {
      const u = r.url();
      if (BLOQUEIO.some((re) => re.test(u))) return;
      const txt = r.failure()?.errorText || "";
      // Pré-carregamento do Next (?_rsc=) cancelado quando a página muda ou fecha: normal.
      if (u.startsWith(BASE) && txt.includes("ERR_ABORTED") && u.includes("_rsc=")) return;
      if (u.startsWith(BASE)) pedidosRuins.push(`${txt} ${u}`);
      // De fora do site e barrado pela rede deste ambiente: aviso, não erro do site.
      else avisos.add(`recurso externo não carregou aqui (${txt}): ${new URL(u).host}`);
    });
    page.on("response", (r) => {
      const u = r.url();
      if (u.startsWith(BASE) && r.status() >= 400 && !BLOQUEIO.some((re) => re.test(u))) pedidosRuins.push(`${r.status()} ${u}`);
    });

    let resp;
    try { resp = await page.goto(url, { waitUntil: "load", timeout: 60000 }); }
    catch (e) { falha(`não abriu: ${e.message}`); await ctx.close(); continue; }
    const st = resp ? resp.status() : 0;
    st >= 200 && st < 400 ? ok(`abriu (${st})`) : falha(`status ${st}`);

    // rola até o fim para carregar imagens lazy
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);

    const info = await page.evaluate(() => ({
      titulo: document.title,
      descricao: document.querySelector('meta[name="description"]')?.content || "",
      h1: document.querySelectorAll("h1").length,
      noindex: /noindex/i.test(document.querySelector('meta[name="robots"]')?.content || ""),
      vaza: document.documentElement.scrollWidth - window.innerWidth,
      imgsQuebradas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.src).map((i) => i.src),
      internos: [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.href)
        .filter((h) => h.startsWith(location.origin) && !h.includes("#") && !h.includes("/l/")))],
      whats: [...document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"], a[href*="/l/"]')].map((a) => a.href),
    }));
    info.titulo ? ok(`título: ${info.titulo}`) : falha("sem <title>");
    info.descricao ? ok("tem descrição") : falha("sem meta description");
    info.h1 === 1 ? ok("um <h1>") : falha(`${info.h1} <h1> na página`);
    if (info.noindex) falha("página com noindex");
    if (v.nome === "celular") info.vaza > 2 ? falha(`vaza ${info.vaza}px para o lado no celular`) : ok("sem rolagem lateral no celular");
    info.imgsQuebradas.length ? falha(`imagem quebrada: ${info.imgsQuebradas.join(", ")}`) : ok("imagens carregaram");
    const whatsRuins = info.whats.filter((h) => !/wa\.me\/\d|api\.whatsapp\.com|\/l\/[\w-]+/.test(h));
    whatsRuins.length ? falha(`botão de WhatsApp com link estranho: ${whatsRuins.join(", ")}`) : ok(`${info.whats.length} botão(ões) de WhatsApp com link válido`);

    if (v.nome === "computador") {
      const ruins = await conferirLinks(ctx.request, info.internos.slice(0, 80));
      ruins.length ? falha(`link interno quebrado: ${ruins.join(", ")}`) : ok(`${Math.min(info.internos.length, 80)} links internos respondem`);
    }

    const slug = new URL(url).pathname.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "home";
    // Print do topo antes de mexer em nada (é o que a pessoa vê ao chegar)...
    await page.screenshot({ path: `${OUT}/${slug}-${v.nome}-topo.png`, fullPage: false });

    const inter = await interagir(page);
    ok(`interação: ${inter.campos} campo(s) preenchido(s), ${inter.clicados} botão(ões) clicado(s)`);

    // ...e depois dos cliques (mostra o resultado da ferramenta, se houver).
    await page.screenshot({ path: `${OUT}/${slug}-${v.nome}-depois.png`, fullPage: false });

    if (erros.length) for (const e of [...new Set(erros)]) falha(e); else ok("sem erro de JavaScript");
    if (pedidosRuins.length) for (const p of [...new Set(pedidosRuins)]) falha(`pedido falhou: ${p}`);
    await ctx.close();
  }
}
await browser.close();
for (const a of avisos) console.log(`  ! ${a}`);
console.log(`\n${problemas ? `✗ ${problemas} problema(s)` : "✓ tudo certo"} · prints em ${OUT}`);
process.exit(problemas ? 1 : 0);
