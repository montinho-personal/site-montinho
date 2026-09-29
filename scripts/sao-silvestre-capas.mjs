/**
 * Gera as capas 1800×1013 dos artigos da São Silvestre 2026 (public/blog-images/<slug>-capa.webp).
 *   node scripts/sao-silvestre-capas.mjs
 * Capas tipográficas, sem foto (sem risco de direito de imagem). Mesmo visual do Olympia.
 * mudança de dado (preço, resultado), edite o objeto em CAPAS e rode de novo.
 * As fontes do site (Source Serif 4 e DM Sans) são baixadas do Google Fonts e embutidas.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";

const OUT = new URL("../public/blog-images", import.meta.url).pathname;
const PREVIEW = "/tmp/sao-silvestre-capas"; mkdirSync(PREVIEW, { recursive: true });
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
    slug: "inscricao-sao-silvestre-2026",
    alt: "Capa: inscrição da São Silvestre 2026 — 55 mil vagas, sem sorteio, kits de R$ 335,90 a R$ 1.039,90; prova em 31/12",
    html: base(`
<div class="top"><div class="kicker">São Silvestre 2026 · Inscrição</div><div class="chip"><i></i>Abre 30/09 · 10h</div></div>
<div class="main"><h1>Inscrição da<br><em>São Silvestre</em> 2026</h1>
<div class="sub"><b>55 mil vagas</b>, sem sorteio · kits de <b>R$ 335,90</b> a <b>R$ 1.039,90</b><br>Prova em 31/12, 15 km com largada na Paulista.</div></div>`, "15 KM"),
  },
  {
    slug: "treino-sao-silvestre-13-semanas",
    alt: "Capa: planilha de treino para a São Silvestre — 13 semanas em três níveis, do iniciante a quem quer baixar o tempo",
    html: base(`
<div class="top"><div class="kicker">São Silvestre 2026 · Treino</div><div class="chip"><i></i>Planilha em PDF</div></div>
<div class="main"><h1>Planilha de treino<br>para os <em>15 km</em></h1>
<div class="sub"><b>13 semanas</b> em três níveis: do iniciante<br>a quem quer baixar o tempo.</div></div>`, "13 SEMANAS"),
  },
  {
    slug: "percurso-sao-silvestre",
    alt: "Capa: percurso da São Silvestre trecho a trecho — Paulista, Pacaembu, centro e a subida da Brigadeiro",
    html: base(`
<div class="top"><div class="kicker">São Silvestre · Percurso</div><div class="chip"><i></i>Trecho a trecho</div></div>
<div class="main"><h1>O percurso da<br><em>São Silvestre</em></h1>
<div class="sub">Paulista → Pacaembu → centro → <b>Brigadeiro</b><br>Os 15 km e como correr cada parte.</div></div>`, "15 KM"),
  },
  {
    slug: "vencedores-sao-silvestre",
    alt: "Capa: vencedores da São Silvestre — recorde de 42min59s, Rosa Mota com seis títulos e Marílson, único brasileiro tricampeão",
    html: base(`
<div class="top"><div class="kicker">São Silvestre · Campeões</div><div class="chip"><i></i>Recordes</div></div>
<div class="main"><h1>Vencedores da<br><em>São Silvestre</em></h1>
<div class="sub">Recorde de <b>42min59s</b> · Rosa Mota, <b>6 títulos</b><br>Marílson, o único brasileiro tricampeão.</div></div>`, "1925"),
  },
  {
    slug: "primeira-sao-silvestre-dicas",
    alt: "Capa: primeira São Silvestre — dicas para estrear nos 15 km, da véspera à chegada na Paulista",
    html: base(`
<div class="top"><div class="kicker">São Silvestre 2026 · Iniciantes</div><div class="chip"><i></i>Guia de estreia</div></div>
<div class="main"><h1>Sua primeira<br><em>São Silvestre</em></h1>
<div class="sub">Da véspera à chegada: largada, descida<br>e como encarar a <b>Brigadeiro</b>.</div></div>`, "1ª VEZ"),
  },
  {
    slug: "tenis-para-sao-silvestre",
    alt: "Capa: tênis para a São Silvestre — os modelos oficiais e como escolher o tênis certo para os 15 km de asfalto",
    html: base(`
<div class="top"><div class="kicker">São Silvestre 2026 · Equipamento</div><div class="chip"><i></i>Guia de escolha</div></div>
<div class="main"><h1>Tênis para a<br><em>São Silvestre</em></h1>
<div class="sub">Os modelos oficiais, o que importa em 15 km<br>e o erro de <b>estrear tênis na prova</b>.</div></div>`, "15 KM"),
  },
  {
    slug: "como-melhorar-o-pace-na-corrida",
    alt: "Capa: como melhorar o pace na corrida — o que é, como calcular, tabela de pace e os treinos para baixar",
    html: base(`
<div class="top"><div class="kicker">Corrida · Pace</div><div class="chip"><i></i>Com tabela</div></div>
<div class="main"><h1>Como melhorar<br>o seu <em>pace</em></h1>
<div class="sub">O que é, como calcular e os treinos<br>para correr mais rápido e <b>cansar menos</b>.</div></div>`, "MIN/KM"),
  },
  {
    slug: "hyrox-sao-paulo-2026",
    alt: "Capa: HYROX São Paulo 2026 — 17 e 18 de outubro no Distrito Anhembi",
    html: base(`
<div class="top"><div class="kicker">HYROX · São Paulo 2026</div><div class="chip"><i></i>17 e 18/10</div></div>
<div class="main"><h1><em>HYROX</em><br>São Paulo 2026</h1>
<div class="sub">Distrito Anhembi · Individual, Duplas e Revezamento<br><b>8 km de corrida</b> + <b>8 estações</b>.</div></div>`, "8 × 1 KM"),
  },
  {
    slug: "black-friday-suplementos",
    alt: "Capa: Black Friday de suplementos 2026 — como comparar pelo preço por dose e fugir de desconto falso",
    html: base(`
<div class="top"><div class="kicker">Black Friday 2026 · 27/11</div><div class="chip"><i></i>Guia de compra</div></div>
<div class="main"><h1>Black Friday de<br><em>suplementos</em></h1>
<div class="sub">Whey e creatina pelo <b>preço por dose</b>,<br>não pelo pote — e sem desconto falso.</div></div>`, "27/11"),
  },
  {
    slug: "ufc-332-natalia-silva",
    alt: "Capa: UFC 332 — Natália Silva x Wang Cong pelo cinturão peso-mosca, sábado 3/10",
    html: base(`
<div class="top"><div class="kicker">UFC 332 · Sáb 3/10</div><div class="chip"><i></i>Cinturão</div></div>
<div class="main"><h1><em>Natália Silva</em><br>x Wang Cong</h1>
<div class="sub">Cinturão <b>peso-mosca</b> · Salt Lake City<br>Card principal às <b>21h</b> (Brasília).</div></div>`, "UFC 332"),
  },
  {
    slug: "outubro-rosa-exercicio-fisico",
    alt: "Capa: Outubro Rosa — exercício físico e musculação na prevenção do câncer de mama; 150 minutos por semana",
    html: base(`
<div class="top"><div class="kicker">Outubro Rosa</div><div class="chip"><i></i>Prevenção</div></div>
<div class="main"><h1><em>Exercício</em><br>e câncer de mama</h1>
<div class="sub"><b>150 minutos</b> por semana, segundo o INCA<br>E o exame continua indispensável.</div></div>`, "Outubro Rosa"),
  },
  {
    slug: "mr-olympia-brasil-2026",
    alt: "Capa: Mr. Olympia Brasil 2026 — 16 a 18 de outubro no Distrito Anhembi, São Paulo",
    html: base(`
<div class="top"><div class="kicker">Mr. Olympia Brasil · 16 a 18/10</div><div class="chip"><i></i>São Paulo</div></div>
<div class="main"><h1><em>Mr. Olympia</em><br>Brasil 2026</h1>
<div class="sub"><b>Distrito Anhembi</b> · feira e campeonato<br>valendo <b>Pro Card</b> da IFBB Pro League.</div></div>`, "Olympia Brasil"),
  },
  {
    slug: "categorias-do-fisiculturismo",
    alt: "Capa: categorias do fisiculturismo — Open, Classic, 212, Men's Physique, Wellness, Bikini e o que é Pro Card",
    html: base(`
<div class="top"><div class="kicker">Fisiculturismo · Guia</div><div class="chip"><i></i>12 categorias</div></div>
<div class="main"><h1><em>Categorias</em><br>do fisiculturismo</h1>
<div class="sub">Open, Classic, 212, Men's Physique, <b>Wellness</b>, Bikini<br>e o que é <b>Pro Card</b>.</div></div>`, "Categorias"),
  },
];
// Só algumas capas: node scripts/sao-silvestre-capas.mjs <slug> [<slug>...]
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
