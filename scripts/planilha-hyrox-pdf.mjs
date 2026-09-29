/**
 * Gera public/downloads/planilha-treino-hyrox.pdf: planilha de 8 semanas
 * para o HYROX + reta final de 3 semanas até o HYROX São Paulo (17/10/2026).
 *   node scripts/planilha-hyrox-pdf.mjs
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const OURO = "#BA9E50";
const logo = readFileSync("public/logo.svg", "utf8");
const WA = "https://wa.me/5511981063409?text=" + encodeURIComponent("Oi, Montinho! Baixei a planilha de HYROX e quero um plano ajustado para mim.");
const SITE = "https://www.montinhopersonal.com.br/ferramentas/calculadora-calorias-hyrox?utm_source=pdf&utm_medium=planilha&utm_campaign=hyrox_sp_2026";


const W = [
  ["Agachamento, terra romeno, remada — 3×10", "30 min leve", "4 × (1 km + 20 wall balls)", "Afundo, desenvolvimento, puxada — 3×10", "40 min leve"],
  ["Agachamento, terra, remada — 4×8", "6 × 400 m forte / 2 min leve", "4 × (1 km + 500 m remo)", "Afundo com carga, flexão, remada — 3×10", "45 min leve"],
  ["Agachamento, terra, remada — 4×8", "5 × 1 km em ritmo de prova", "5 × (1 km + estação)", "Afundo, wall ball, prancha — 3×12", "50 min leve"],
  ["Força leve — metade das séries", "30 min leve", "3 × (1 km + estação)", "Mobilidade + core", "35 min leve"],
  ["Agachamento frontal, terra, remada — 4×6", "8 × 400 m forte", "6 × (1 km + estação)", "Afundo, burpee, wall ball — 3×12", "55 min leve"],
  ["Agachamento frontal, terra, remada — 4×6", "4 × 1,5 km em ritmo de prova", "Meio simulado: 4 km + 4 estações", "Afundo com saco, trenó/leg press — 4×10", "60 min leve"],
  ["Força — 3×6, carga mantida", "6 × 1 km em ritmo de prova", "Simulado completo em ritmo controlado", "Mobilidade + core", "45 min leve"],
  ["Força leve — 2×5", "20 min leve + 4 acelerações", "3 × (1 km + estação) leve", "Descanso", "PROVA"],
];
const RETA = [
  ["29/09 a 05/10", "Força 4×8 · 5 × 1 km ritmo de prova · 5 × (1 km + estação) · 50 min leve"],
  ["06/10 a 12/10", "Força mantida · 6 × 1 km ritmo de prova · meio simulado (4 km + 4 estações) — o último treino pesado"],
  ["13/10 a 17/10", "Seg: força leve · Ter: 20 min + acelerações · Qua: 3 × (1 km + estação) leve · Qui-sex: descanso · SÁB/DOM 17-18/10: HYROX SP"],
];
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Helvetica,Arial,sans-serif;color:#111}
.pg{width:210mm;height:297mm;padding:14mm;position:relative;page-break-after:always;overflow:hidden}
.capa{background:#000;color:#fff;display:flex;flex-direction:column;justify-content:center}
.marca{font-weight:800;font-size:26pt;letter-spacing:.06em;margin-bottom:18mm}.marca span{display:block;font-weight:400;font-size:9pt;letter-spacing:.35em;color:#aaa;margin-top:1mm}
.k{color:${OURO};letter-spacing:.2em;font-size:10pt;font-weight:700;text-transform:uppercase}
.capa h1{font-family:Georgia,serif;font-size:34pt;line-height:1.1;margin:6mm 0}.capa h1 em{color:${OURO};font-style:normal}
.capa p{font-size:12pt;color:#ccc;line-height:1.5}.box{margin-top:10mm;border:1px solid ${OURO};padding:6mm;font-size:11pt;line-height:1.6}
header{display:flex;justify-content:space-between;border-bottom:2px solid ${OURO};padding-bottom:3mm;margin-bottom:5mm;font-size:9pt;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#666}
h2{font-family:Georgia,serif;font-size:19pt;margin:0 0 2mm}.sub{margin:0 0 5mm;color:#444;font-size:10pt;line-height:1.45}
table{width:100%;border-collapse:collapse;font-size:8.6pt}th{background:#000;color:#fff;text-align:left;padding:2.2mm}td{border-bottom:1px solid #ddd;padding:2.2mm;vertical-align:top;line-height:1.35}
td.s{font-weight:700;font-size:11pt}tr.l td{background:#f1f1f1}tr.p td{background:${OURO};font-weight:700}td.ck{width:8mm;border-left:1px solid #ddd}
ul{font-size:10pt;line-height:1.55}.cta{margin-top:8mm;background:#000;color:#fff;padding:7mm}.cta b,.cta a{color:${OURO}}
footer{position:absolute;bottom:8mm;left:14mm;right:14mm;font-size:8pt;color:#888;border-top:1px solid #ddd;padding-top:2mm}
</style></head><body>
<section class="pg capa"><div class="marca">MONTINHO<span>PERSONAL TRAINER</span></div>
<div class="k">HYROX · 8 km de corrida + 8 estações</div><h1>Planilha de treino<br>para o <em>HYROX</em></h1>
<p>8 semanas para chegar à prova — e a reta final para quem corre o HYROX São Paulo em 17 e 18 de outubro de 2026.</p>
<div class="box"><b>Força 2×</b> · <b>Corrida 2×</b> · <b>Simulado 1×</b> · 1 dia de descanso<br><span style="color:#aaa">Estações: SkiErg, empurrar trenó, puxar trenó, burpee com salto, remo, carregamento, avanço com saco de areia, wall ball.</span></div>
<p style="margin-top:10mm;font-size:10pt">Quanto você gasta numa prova? <a style="color:${OURO}" href="${SITE}">Calculadora de calorias do HYROX</a></p></section>
<section class="pg"><header><span>Planilha de 8 semanas</span><span>montinhopersonal.com.br</span></header>
<h2>8 semanas para o HYROX</h2><p class="sub">Ritmo leve = dá para conversar. "Estação" = qualquer uma das 8 da prova (ou a adaptação da sua academia). Semana 4 em cinza é mais leve.</p>
<table><thead><tr><th>Sem.</th><th>Força A</th><th>Corrida qualidade</th><th>Simulado</th><th>Força B</th><th>Corrida leve</th><th>✓</th></tr></thead><tbody>
${W.map((r,i)=>`<tr class="${i===3?'l':''}${i===7?' p':''}"><td class="s">${i+1}</td>${r.map(c=>`<td>${c}</td>`).join('')}<td class="ck"></td></tr>`).join('')}
</tbody></table><footer>Sem trenó na academia: empurre um banco com anilhas ou use leg press pesado. Sem SkiErg: remo ou burpee.</footer></section>
<section class="pg"><header><span>Reta final · HYROX São Paulo 2026</span><span>montinhopersonal.com.br</span></header>
<h2>Sua prova é em 17 ou 18 de outubro?</h2><p class="sub">Faltam 3 semanas. Não dá para construir base nova — dá para chegar descansado e afiado.</p>
<table><thead><tr><th>Semana</th><th>O que fazer</th><th>✓</th></tr></thead><tbody>
${RETA.map((r,i)=>`<tr class="${i===2?'p':''}"><td class="s">${r[0]}</td><td>${r[1]}</td><td class="ck"></td></tr>`).join('')}
</tbody></table>
<ul><li>Nada novo no dia: tênis, roupa, comida e suplemento já testados.</li><li>Largue a primeira corrida mais devagar do que dá vontade.</li><li>Dor forte, tontura ou mal-estar: pare e procure a equipe médica.</li></ul>
<div class="cta">Não se compare com quem larga ao seu lado: cada um tem a própria genética, rotina e história.<br><br><b>Quer a planilha ajustada ao seu nível?</b> <a href="${WA}">WhatsApp (11) 98106-3409</a></div>
<footer>Planilha educativa; não substitui avaliação individual.</footer></section>
</body></html>`;

const b = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const p = await b.newPage();
await p.setContent(html, { waitUntil: "load" });
await p.pdf({ path: "public/downloads/planilha-treino-hyrox.pdf", format: "A4", printBackground: true });
await b.close();
console.log("ok");
