/**
 * Gera public/downloads/planilha-treino-sao-silvestre-2026.pdf, a versão
 * para imprimir das três planilhas do artigo treino-sao-silvestre-13-semanas.
 * Os números aqui precisam bater com as tabelas do artigo.
 *   node scripts/planilha-sao-silvestre-pdf.mjs
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const OURO = "#BA9E50";
const logo = readFileSync("public/logo.svg", "utf8");
const WA = "https://wa.me/5511981063409?text=" + encodeURIComponent("Oi, Montinho! Baixei a planilha da São Silvestre e quero um plano ajustado para mim.");
const SITE = "https://www.montinhopersonal.com.br/ferramentas/previsor-sao-silvestre?utm_source=pdf&utm_medium=planilha&utm_campaign=sao_silvestre_2026";

// Semana 1 começa na segunda, 5/10; a 13 termina na prova, quinta 31/12.
const inicio = new Date(Date.UTC(2026, 9, 5));
const dm = (d) => `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
const semana = (i) => { const a = new Date(inicio.getTime() + i * 7 * 864e5); const b = new Date(a.getTime() + 6 * 864e5); return i === 12 ? `${dm(a)} a 31/12` : `${dm(a)} a ${dm(b)}`; };
const LEVE = [3, 7, 11];

const P1 = [
  ["30 min: 1 min correndo / 2 min caminhando", "40 min no mesmo formato"],
  ["30 min: 1 min correndo / 2 min caminhando", "45 min no mesmo formato"],
  ["30 min: 2 min correndo / 1 min caminhando", "45 min no mesmo formato"],
  ["25 min: 1 min correndo / 1 min caminhando", "40 min, bem tranquilo"],
  ["30 min: 5 min correndo / 1 min caminhando", "6 km alternando"],
  ["35 min: 5 min correndo / 1 min caminhando", "7 km alternando"],
  ["40 min: 5 min correndo / 1 min caminhando", "9 km alternando"],
  ["30 min: 5 min correndo / 1 min caminhando", "6 km alternando"],
  ["35 min; em um dos dias, subidas curtas caminhando rápido", "10 km alternando"],
  ["40 min; subidas em um dos dias", "11 km alternando"],
  ["45 min; subidas em um dos dias", "12 km alternando"],
  ["25 a 30 min leves", "7 km leves"],
  ["Seg e ter: 25 min leves", "QUINTA 31/12: A PROVA"],
];
const P2 = [
  ["5 km leves", "6 km"], ["5 km leves", "7 km"], ["6 km leves", "8 km"], ["5 km leves", "6 km"],
  ["6 km; em um dia, 4 tiros de 1 min um pouco mais forte", "9 km"],
  ["6 km; em um dia, 5 tiros de 1 min", "10 km"],
  ["7 km; em um dia, 6 tiros de 1 min", "11 km"],
  ["6 km leves", "8 km"],
  ["6 km; em um dia, 6 subidas de 30 s", "12 km"],
  ["7 km; em um dia, 7 subidas de 30 a 45 s", "13 km"],
  ["8 km; em um dia, 8 subidas de 45 s", "14 km"],
  ["5 km leves + 3 acelerações curtas", "9 km"],
  ["Seg ou ter: 5 km leves + 3 acelerações", "QUINTA 31/12: A PROVA"],
];
const P3 = [
  ["6 tiros de 1 min forte / 1 min leve", "10 km", "6 km"],
  ["7 tiros de 1 min", "11 km", "7 km"],
  ["8 tiros de 1 min", "12 km", "7 km"],
  ["5 tiros de 1 min", "10 km", "6 km"],
  ["20 min em ritmo firme", "12 km", "7 km"],
  ["25 min em ritmo firme", "13 km", "8 km"],
  ["30 min em ritmo firme", "14 km", "8 km"],
  ["20 min em ritmo firme", "12 km", "7 km"],
  ["8 subidas de 45 s", "14 km, últimos 3 no ritmo de prova", "8 km"],
  ["3 blocos de 2 km no ritmo de prova", "15 km, últimos 3 no ritmo de prova", "8 km"],
  ["10 subidas de 1 min", "16 km, últimos 3 no ritmo de prova", "8 km"],
  ["2 blocos de 2 km no ritmo de prova", "10 km", "6 km"],
  ["Seg: 4 × 1 min no ritmo de prova", "QUINTA 31/12: A PROVA", "Ter: 5 km leves"],
];

const linhas = (rows) => rows.map((r, i) => `<tr class="${LEVE.includes(i) ? "leve" : ""}${i === 12 ? " prova" : ""}"><td class="sem"><b>${i + 1}</b><span>${semana(i)}</span></td>${r.map((c) => `<td>${c}</td>`).join("")}<td class="ck"></td></tr>`).join("");

const pagina = (n, titulo, sub, cols, rows, extra) => `
<section class="pg">
  <header><div class="lg">${logo}</div><div class="k">Planilha ${n} · São Silvestre 2026</div></header>
  <h2>${titulo}</h2><p class="sub">${sub}</p>
  <table><thead><tr><th>Semana</th>${cols.map((c) => `<th>${c}</th>`).join("")}<th>✓</th></tr></thead><tbody>${linhas(rows)}</tbody></table>
  <p class="nota">Linhas em cinza: semanas mais leves, para o corpo assimilar. ${extra}</p>
  <footer>montinhopersonal.com.br · Força 2× por semana em todas as planilhas (página 5)</footer>
</section>`;

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@page{size:A4;margin:0}
*{box-sizing:border-box}body{margin:0;font-family:Helvetica,Arial,sans-serif;color:#111}
.pg{width:210mm;height:297mm;padding:14mm 14mm 12mm;position:relative;page-break-after:always;overflow:hidden}
.capa{background:#000;color:#fff;display:flex;flex-direction:column;justify-content:center}
.marca{font-weight:800;font-size:26pt;letter-spacing:.06em;margin-bottom:18mm}.marca span{display:block;font-weight:400;font-size:9pt;letter-spacing:.35em;color:#aaa;margin-top:1mm}.capa .k{color:${OURO};letter-spacing:.2em;font-size:10pt;font-weight:700;text-transform:uppercase}
.capa h1{font-family:Georgia,serif;font-size:34pt;line-height:1.1;margin:6mm 0}.capa h1 em{color:${OURO};font-style:normal}
.capa p{font-size:12pt;color:#ccc;line-height:1.5;max-width:150mm}
.capa .box{margin-top:12mm;border:1px solid ${OURO};padding:6mm;font-size:11pt;line-height:1.6}
header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid ${OURO};padding-bottom:3mm;margin-bottom:5mm}
header .lg{width:26mm}header .lg svg,.capa .lg svg{width:100%;height:auto;display:block}
header .k{font-size:8.5pt;letter-spacing:.15em;text-transform:uppercase;color:#666;font-weight:700}
h2{font-family:Georgia,serif;font-size:19pt;margin:0 0 2mm}.sub{margin:0 0 5mm;color:#444;font-size:10pt;line-height:1.45}
table{width:100%;border-collapse:collapse;font-size:9.3pt}th{background:#000;color:#fff;text-align:left;padding:2.4mm;font-size:8.5pt}
td{border-bottom:1px solid #ddd;padding:2.3mm;vertical-align:top;line-height:1.35}
td.sem b{font-size:12pt;display:block}td.sem span{font-size:7.5pt;color:#777}
td.ck{width:9mm;border-left:1px solid #ddd}tr.leve td{background:#f1f1f1}tr.prova td{background:${OURO};color:#000;font-weight:700}
.nota{font-size:8.5pt;color:#555;margin-top:4mm;line-height:1.45}
footer{position:absolute;bottom:8mm;left:14mm;right:14mm;font-size:8pt;color:#888;border-top:1px solid #ddd;padding-top:2mm}
ul{font-size:10pt;line-height:1.55;padding-left:5mm}li{margin-bottom:1.5mm}h3{font-size:12pt;margin:6mm 0 2mm}
.cta{margin-top:8mm;background:#000;color:#fff;padding:7mm}.cta b{color:${OURO}}.cta a{color:${OURO}}
</style></head><body>
<section class="pg capa">
  <div class="marca">MONTINHO<span>PERSONAL TRAINER</span></div>
  <div class="k">101ª São Silvestre · 31/12/2026 · 15 km</div>
  <h1>Planilha de treino<br>para a <em>São Silvestre</em></h1>
  <p>Três planilhas de 13 semanas, de 5 de outubro até a prova. Escolha a sua, imprima e marque cada semana cumprida.</p>
  <div class="box">
    <b>Planilha 1 · Iniciante</b> — não corre 20 min sem parar: completar correndo e caminhando.<br>
    <b>Planilha 2 · Correr os 15 km</b> — já corre 5 km sem parar.<br>
    <b>Planilha 3 · Baixar o tempo</b> — já corre 10 km.<br>
    <span style="color:#aaa">Na dúvida entre duas, escolha a mais leve.</span>
  </div>
  <p style="margin-top:10mm;font-size:10pt">Qual seria o seu tempo nos 15 km? Faça a conta no Previsor da São Silvestre:<br><a style="color:${OURO}" href="${SITE}">montinhopersonal.com.br/ferramentas/previsor-sao-silvestre</a></p>
</section>
${pagina(1, "Iniciante: completar correndo e caminhando", "Três sessões por semana: duas curtas (A) e um longo (B). Ritmo em que dá para conversar. Na prova, use a mesma estratégia de blocos — caminhar na Brigadeiro faz parte do plano.", ["Sessões curtas (2×)", "Longo (1×)"], P1, "")}
${pagina(2, "Correr os 15 km (para quem já faz 5 km)", "Três corridas por semana: duas curtas e um longo. Quase tudo em ritmo leve; os tiros e subidas entram em uma das curtas.", ["Corridas curtas (2×)", "Longo (1×)"], P2, "Não é preciso correr 15 km antes da prova: 14 km no longo bastam.")}
${pagina(3, "Baixar o tempo (para quem já corre 10 km)", "Quatro corridas por semana: um treino de qualidade, um longo e duas leves. Descubra seu ritmo de prova no Previsor da São Silvestre.", ["Qualidade (1×)", "Longo (1×)", "Leves (2×)"], P3, "")}
<section class="pg">
  <header><div class="lg">${logo}</div><div class="k">Força e semana da prova</div></header>
  <h2>O treino de força que segura a Brigadeiro</h2>
  <p class="sub">Duas vezes por semana, em dias sem treino forte de corrida. Nas duas últimas semanas, metade das séries e da carga.</p>
  <table><thead><tr><th>Exercício</th><th>Séries × repetições</th><th>Por quê</th></tr></thead><tbody>
  <tr><td>Agachamento</td><td>3 × 8 a 12</td><td>Força de coxa e glúteo</td></tr>
  <tr><td>Afundo ou passada</td><td>3 × 8 a 10 por perna</td><td>Uma perna de cada vez, como na corrida</td></tr>
  <tr><td>Subida no banco (step-up)</td><td>3 × 8 a 10 por perna</td><td>O mais parecido com a subida</td></tr>
  <tr><td>Elevação de panturrilha</td><td>3 × 12 a 15</td><td>Impulso e proteção do tendão</td></tr>
  <tr><td>Prancha</td><td>3 × 30 a 45 s</td><td>Tronco firme no fim da prova</td></tr>
  </tbody></table>
  <h3>Regras que valem para as três planilhas</h3>
  <ul><li>Quase tudo em ritmo de conversa; o forte entra pouco e com propósito.</li><li>Pelo menos um dia sem treino por semana.</li><li>Pare e procure um médico ou fisioterapeuta se a dor piorar durante a corrida, se for num ponto do osso ou se fizer você mancar.</li><li>Quem tem alguma condição de saúde ou está parado há muito tempo deve fazer avaliação médica antes de começar.</li></ul>
  <h3>Semana da prova</h3>
  <ul><li>Nada novo: nem tênis, nem roupa, nem comida.</li><li>Na véspera, jantar de sempre e dormir cedo.</li><li>Largue mais devagar do que dá vontade: a parte difícil é no fim.</li></ul>
  <div class="cta">Não se compare com quem está do seu lado: cada um tem a própria genética, rotina e história. O que faz diferença é um plano que você consiga seguir até dezembro — e depois dele.<br><br><b>Quer a planilha ajustada ao seu nível e à sua agenda?</b> Fale comigo: <a href="${WA}">WhatsApp (11) 98106-3409</a></div>
  <footer>montinhopersonal.com.br · Montinho Personal Trainer · Planilha educativa; não substitui avaliação individual.</footer>
</section>
</body></html>`;

const b = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const p = await b.newPage();
await p.setContent(html, { waitUntil: "load" });
await p.pdf({ path: "public/downloads/planilha-treino-sao-silvestre-2026.pdf", format: "A4", printBackground: true });
await b.close();
console.log("ok");
