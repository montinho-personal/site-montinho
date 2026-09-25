/**
 * Gera as capas 1800×1013 dos artigos do Mr. Olympia 2026 (public/blog-images/<slug>-capa.webp).
 *   node scripts/olympia-capas.mjs
 * Capas tipográficas, sem foto de atleta (sem risco de direito de imagem). Depois de um
 * resultado oficial, edite o objeto do artigo em CAPAS (título/sub) e rode de novo.
 * As fontes do site (Source Serif 4 e DM Sans) são baixadas do Google Fonts e embutidas.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";

const OUT = new URL("../public/blog-images", import.meta.url).pathname;
const PREVIEW = "/tmp/olympia-capas"; mkdirSync(PREVIEW, { recursive: true });
const logo = readFileSync(new URL("../public/logo.svg", import.meta.url), "utf8").replace('viewBox="3 0 469 321"', 'viewBox="3 0 469 185"');

async function fontes() {
  const cache = PREVIEW + "/fonts-embed.css";
  if (existsSync(cache)) return readFileSync(cache, "utf8");
  const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
  const css = await (await fetch("https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600;8..60,800;8..60,900&family=DM+Sans:wght@500;600;700;800&display=block", { headers: { "User-Agent": UA } })).text();
  const blocos = [...css.matchAll(/\/\* (latin|latin-ext) \*\/\s*(@font-face\s*{[^}]+})/g)].map((m) => m[2]);
  const out = [];
  for (const b of blocos) {
    const url = b.match(/url\((https:[^)]+)\)/)[1];
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer()).toString("base64");
    out.push(b.replace(url, "data:font/woff2;base64," + buf));
  }
  writeFileSync(cache, out.join("\n"));
  return out.join("\n");
}
const FONTS = await fontes();
const CSS = `
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:675px;background:#050505;overflow:hidden}
.c{position:relative;width:1200px;height:675px;overflow:hidden;font-family:'DM Sans',sans-serif;color:#fff;
  background:
   radial-gradient(900px 520px at 88% 8%, rgba(186,158,80,.30), transparent 60%),
   radial-gradient(700px 420px at 0% 100%, rgba(186,158,80,.12), transparent 65%),
   linear-gradient(180deg,#0b0b0b 0%,#050505 100%)}
/* luz de palco: feixes diagonais */
.c:before{content:"";position:absolute;inset:-40%;background:repeating-linear-gradient(115deg,rgba(255,255,255,.035) 0 2px,transparent 2px 46px);transform:rotate(0deg);pointer-events:none}
/* grão */
.c:after{content:"";position:absolute;inset:0;opacity:.18;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.bg{position:absolute;right:-20px;top:300px;font-family:'Source Serif 4',serif;font-weight:900;font-size:360px;line-height:.8;letter-spacing:-.04em;color:transparent;-webkit-text-stroke:2px rgba(186,158,80,.13);white-space:nowrap}
.frame{position:absolute;inset:28px;border:1px solid rgba(186,158,80,.28)}
.top{position:absolute;left:72px;right:72px;top:64px;display:flex;justify-content:space-between;align-items:center}
.kicker{font-weight:800;font-size:22px;letter-spacing:.24em;color:#BA9E50;text-transform:uppercase}
.chip{display:flex;align-items:center;gap:12px;font-weight:700;font-size:19px;letter-spacing:.14em;text-transform:uppercase;color:#0a0a0a;background:#BA9E50;padding:12px 20px}
.chip i{width:10px;height:10px;border-radius:50%;background:#0a0a0a;display:block}
.main{position:absolute;left:72px;right:72px;top:150px}
h1{font-family:'Source Serif 4',serif;font-weight:900;font-size:92px;line-height:.98;letter-spacing:-.025em;text-wrap:balance;max-width:900px}
h1 em{font-style:normal;color:#BA9E50}
.sub{margin-top:26px;font-weight:600;font-size:28px;line-height:1.3;color:#d6d6d6;max-width:820px}
.sub b{color:#fff}
.base{position:absolute;left:72px;right:72px;bottom:62px;display:flex;justify-content:space-between;align-items:flex-end}
.url{font-weight:700;font-size:20px;letter-spacing:.08em;color:#9a9a9a}
.url b{color:#fff}
.logo{width:118px;position:relative;z-index:2}.logo svg{display:block;width:100%;height:auto}
.rule{position:absolute;left:72px;bottom:118px;width:84px;height:4px;background:#BA9E50}
/* blocos de dados */
.stats{display:flex;gap:18px;margin-top:34px}
.stat{border:1px solid rgba(186,158,80,.45);background:rgba(10,10,10,.55);padding:18px 26px;min-width:230px}
.stat .n{font-family:'Source Serif 4',serif;font-weight:900;font-size:64px;line-height:1;color:#fff}
.stat .n small{font-size:30px;font-weight:800;color:#BA9E50;margin-left:4px}
.stat .l{margin-top:8px;font-weight:700;font-size:17px;letter-spacing:.16em;text-transform:uppercase;color:#BA9E50}
.tags{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px;max-width:900px}
.tags span{border:1px solid rgba(255,255,255,.22);padding:8px 14px;font-weight:700;font-size:17px;letter-spacing:.1em;text-transform:uppercase;color:#e8e8e8}
.tags span.g{border-color:#BA9E50;color:#BA9E50}
`;

const base = (inner, bg) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="c">
<div class="bg">${bg}</div><div class="frame"></div>${inner}
<div class="rule"></div>
<div class="base"><div class="url"><b>montinhopersonal</b>.com.br · Montinho Personal Trainer</div><div class="logo">${logo}</div></div>
</div></body></html>`;

const CAPAS = [
  {
    slug: "resultado-classic-physique-mr-olympia-2026",
    alt: "Capa: Mr. Olympia 2026, Classic Physique — Ramon Dino defende o título; classificação completa e top 5, final na sexta às 22h de Brasília",
    html: base(`
<div class="top"><div class="kicker">Mr. Olympia 2026 · Classic Physique</div><div class="chip"><i></i>Resultado</div></div>
<div class="main"><h1>Ramon Dino<br>defende o <em>título</em></h1>
<div class="sub">Classificação completa e <b>top 5</b> da Classic Physique.<br>Final na <b>sexta, 25/09, a partir das 22h</b> (Brasília).</div></div>`, "CLASSIC"),
  },
  {
    slug: "ramon-dino-mr-olympia-2026-horario",
    alt: "Capa: que horas Ramon Dino compete no Mr. Olympia 2026 — sexta, 25 de setembro: prévias às 13h30 e final a partir das 22h, horário de Brasília",
    html: base(`
<div class="top"><div class="kicker">Ramon Dino · Mr. Olympia 2026</div><div class="chip"><i></i>Sexta, 25/09</div></div>
<div class="main"><h1>Que horas<br>Ramon Dino <em>compete</em></h1>
<div class="stats"><div class="stat"><div class="n">13h30</div><div class="l">Prévias</div></div><div class="stat"><div class="n">22h</div><div class="l">Final</div></div></div></div>`, "25.09"),
  },
  {
    slug: "quem-ganhou-mr-olympia-2026",
    alt: "Capa: quem ganhou o Mr. Olympia 2026 — todos os campeões, categoria por categoria: Open, Classic Physique, Wellness, 212, Men's Physique, Bikini e mais",
    html: base(`
<div class="top"><div class="kicker">Las Vegas · 25 e 26/09</div><div class="chip"><i></i>Todos os campeões</div></div>
<div class="main"><h1>Quem ganhou o<br>Mr. Olympia <em>2026</em></h1>
<div class="tags"><span class="g">Open</span><span class="g">Classic Physique</span><span class="g">Wellness</span><span>212</span><span>Men's Physique</span><span>Bikini</span><span>Figure</span><span>Women's Physique</span><span>Ms. Olympia</span><span>Fitness</span></div></div>`, "2026"),
  },
  {
    slug: "resultado-wellness-mr-olympia-2026",
    alt: "Capa: Wellness do Mr. Olympia 2026 — o Brasil venceu todas as cinco edições e 19 das 40 atletas são brasileiras; resultado, campeã e top 5",
    html: base(`
<div class="top"><div class="kicker">Mr. Olympia 2026 · Wellness</div><div class="chip"><i></i>Resultado</div></div>
<div class="main"><h1>O Brasil defende<br>a <em>coroa</em> da Wellness</h1>
<div class="stats"><div class="stat"><div class="n">5<small>/5</small></div><div class="l">Títulos do Brasil</div></div><div class="stat"><div class="n">19<small>/40</small></div><div class="l">Brasileiras em 2026</div></div></div></div>`, "WELLNESS"),
  },
  {
    slug: "resultado-mr-olympia-open-2026",
    alt: "Capa: resultado do Open do Mr. Olympia 2026 — quem leva o troféu Sandow; Derek Lunsford defende o título na final de sábado, 23h de Brasília",
    html: base(`
<div class="top"><div class="kicker">Mr. Olympia 2026 · Open</div><div class="chip"><i></i>Resultado</div></div>
<div class="main"><h1>Quem leva o<br><em>Sandow</em> em 2026</h1>
<div class="sub">Campeão e <b>top 10</b> do Open. Derek Lunsford defende o título.<br>Final no <b>sábado, 26/09, a partir das 23h</b> (Brasília).</div></div>`, "OPEN"),
  },
  {
    slug: "ramon-dino-peso-altura",
    alt: "Capa: quanto pesa Ramon Dino — 102,5 kg na pesagem do Mr. Olympia 2026, limite de 103 kg na Classic Physique para 1,81 m de altura",
    html: base(`
<div class="top"><div class="kicker">Ramon Dino · Classic Physique</div><div class="chip"><i></i>Pesagem 23/09/2026</div></div>
<div class="main"><h1>Quanto <em>pesa</em><br>Ramon Dino</h1>
<div class="stats"><div class="stat"><div class="n">102,5<small>kg</small></div><div class="l">Na pesagem</div></div><div class="stat"><div class="n">103<small>kg</small></div><div class="l">Limite</div></div><div class="stat"><div class="n">1,81<small>m</small></div><div class="l">Altura</div></div></div></div>`, "103"),
  },
  {
    slug: "resultado-212-mr-olympia-2026",
    alt: "Capa: resultado da 212 do Mr. Olympia 2026 — Keone Pearson defende o título e Lucas Garcia lidera os quatro brasileiros; final na sexta às 22h de Brasília",
    html: base(`
<div class="top"><div class="kicker">Mr. Olympia 2026 · 212</div><div class="chip"><i></i>Resultado</div></div>
<div class="main"><h1>Quem vence<br>a <em>212</em> em 2026</h1>
<div class="sub">Campeão, <b>top 10</b> e os <b>4 brasileiros</b>, com Lucas Garcia.<br>Final na <b>sexta, 25/09, a partir das 22h</b> (Brasília).</div></div>`, "212"),
  },
  {
    slug: "resultado-womens-physique-olympia-2026",
    alt: "Capa: resultado da Women's Physique do Olympia 2026 — Natália Coelho defende o título e cinco brasileiras disputam a categoria; final na sexta às 22h de Brasília",
    html: base(`
<div class="top"><div class="kicker">Olympia 2026 · Women's Physique</div><div class="chip"><i></i>Resultado</div></div>
<div class="main"><h1>Natália Coelho<br>defende o <em>título</em></h1>
<div class="sub">Campeã, <b>top 10</b> e as <b>5 brasileiras</b> da categoria.<br>Final na <b>sexta, 25/09, a partir das 22h</b> (Brasília).</div></div>`, "PHYSIQUE"),
  },
  {
    slug: "brasileiros-mr-olympia-2026",
    alt: "Capa: brasileiros no Mr. Olympia 2026 — painel com atletas, categorias, horários de Brasília e resultados de sexta e sábado",
    html: base(`
<div class="top"><div class="kicker">Las Vegas · 25 e 26/09</div><div class="chip"><i></i>Painel Brasil</div></div>
<div class="main"><h1>Brasileiros no<br>Mr. Olympia <em>2026</em></h1>
<div class="tags"><span class="g">Ramon Dino</span><span class="g">Lucas Garcia</span><span class="g">Natália Coelho</span><span class="g">Eduarda Bezerra</span><span>Edvan Palmeira</span><span>Elisa Pecini</span><span>Leandro Peres</span><span>Zama Benta</span></div></div>`, "BRASIL"),
  },
  {
    slug: "resultado-mens-physique-olympia-2026",
    alt: "Capa: resultado da Men's Physique do Olympia 2026 — Ryan Terry defende o título e Edvan Palmeira lidera os brasileiros; final no sábado às 23h de Brasília",
    html: base(`
<div class="top"><div class="kicker">Olympia 2026 · Men's Physique</div><div class="chip"><i></i>Resultado</div></div>
<div class="main"><h1>Quem vence a<br>Men's <em>Physique</em></h1>
<div class="sub">Campeão, <b>top 10</b> e os brasileiros, com Edvan Palmeira.<br>Final no <b>sábado, 26/09, a partir das 23h</b> (Brasília).</div></div>`, "PHYSIQUE"),
  },
  {
    slug: "resultado-bikini-olympia-2026",
    alt: "Capa: resultado da Bikini Olympia 2026 — Maureen Blanquisco defende o título e Elisa Pecini lidera as três brasileiras; final no sábado às 23h de Brasília",
    html: base(`
<div class="top"><div class="kicker">Olympia 2026 · Bikini</div><div class="chip"><i></i>Resultado</div></div>
<div class="main"><h1>Quem vence a<br><em>Bikini</em> Olympia</h1>
<div class="sub">Campeã, <b>top 10</b> e as <b>3 brasileiras</b>, com Isa Pecini.<br>Final no <b>sábado, 26/09, a partir das 23h</b> (Brasília).</div></div>`, "BIKINI"),
  },
  {
    slug: "resultado-fit-model-olympia-2026",
    alt: "Capa: resultado da Fit Model Olympia 2026 — estreia da categoria no Olympia, com a brasileira Gabriela Queiroz; prévias e final no sábado a partir das 13h30 de Brasília",
    html: base(`
<div class="top"><div class="kicker">Olympia 2026 · Fit Model</div><div class="chip"><i></i>Estreia</div></div>
<div class="main"><h1>A primeira<br><em>Fit Model</em> Olympia</h1>
<div class="sub">Campeã, classificação e <b>Gabriela Queiroz</b>.<br>Prévias e final no <b>sábado, 26/09, a partir das 13h30</b> (Brasília).</div></div>`, "FIT MODEL"),
  },
];
// Só algumas capas: node scripts/olympia-capas.mjs <slug> [<slug>...]
const SO = process.argv.slice(2);

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1200, height: 675 }, deviceScaleFactor: 1.5 });
for (const c of CAPAS.filter((c) => !SO.length || SO.includes(c.slug))) {
  await p.setContent(c.html, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  const png = await p.screenshot({ type: "png" });
  await sharp(png).webp({ quality: 86 }).toFile(`${OUT}/${c.slug}-capa.webp`);
  await sharp(png).resize(600).png().toFile(`${PREVIEW}/${c.slug}.png`); // prévia pequena para conferir
  const f = await p.evaluate(() => [...document.fonts].filter((x) => x.status === "loaded").map((x) => x.family + " " + x.weight));
  console.log(c.slug, "fontes:", [...new Set(f)].join(", "));
}
await b.close();
console.log(JSON.stringify(CAPAS.map(({ slug, alt }) => ({ slug, alt }))));
