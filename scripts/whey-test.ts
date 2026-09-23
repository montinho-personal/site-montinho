import { existsSync, readFileSync, readdirSync } from "fs";
/**
 * O motor e a página da Calculadora de Whey.
 *   npx tsx scripts/whey-test.ts
 */
import {
  ALIMENTOS_ESTIMADOR, ARTIGOS_COM_CALCULADORA_WHEY, ARTIGOS_COM_LINK_WHEY, FAIXAS, FALTA_GRANDE, compara, concentracao, custo, dose, duracao,
  estadoRotulo, estimaConsumo, falta, meta, medidas, parseNumero, pesoValido, proteinaEm, proteinaPorcao, rotuloCalculavel,
} from "../lib/whey";
import { getAlimento, valorPor100g } from "../lib/alimentos/base";
import { FAIXAS as FAIXAS_PROTEINA } from "../lib/proteina";
import { blogPosts } from "../lib/blog";

let falhas = 0;
function ok(nome: string, cond: boolean) {
  console.log(`${cond ? "  ok    " : "  FALHOU"}  ${nome}`);
  if (!cond) falhas++;
}
const perto = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol;

console.log("\n1. A META");
ok("80 kg, ganhar, treina: 128–176 g, referência 160", (() => { const m = meta(80, "ganhar", true); return m.minG === 128 && m.maxG === 176 && m.refG === 160; })());
ok("emagrecer com treino usa o topo da faixa (2,2)", meta(80, "emagrecer", true).refG === 176);
ok("manter com treino: 1,4–2,0, referência 1,6", (() => { const m = meta(80, "manter", true); return m.minG === 112 && m.maxG === 160 && m.refG === 128; })());
ok("sem treino, emagrecer: 1,2–1,6 (Leidy)", (() => { const m = meta(80, "emagrecer", false); return m.minG === 96 && m.maxG === 128 && m.refG === 96; })());
ok("sem treino, manter: 0,8 (RDA)", meta(80, "manter", false).refG === 64);
ok("ganhar e emagrecer com treino têm a mesma faixa — só a referência muda", FAIXAS.treina.ganhar.min === FAIXAS.treina.emagrecer.min && FAIXAS.treina.ganhar.max === FAIXAS.treina.emagrecer.max);
ok("a faixa de quem treina bate com a Calculadora de Proteína (1,6 / 2,0 / 2,2)", FAIXAS_PROTEINA.map((f) => f.gPorKg).join() === [FAIXAS.treina.ganhar.min, FAIXAS.treina.ganhar.ref, FAIXAS.treina.ganhar.max].join());
ok("toda referência está dentro da sua faixa", Object.values(FAIXAS).every((o) => Object.values(o).every((f) => f.ref >= f.min && f.ref <= f.max)));
ok("toda faixa tem fonte com URL", Object.values(FAIXAS).every((o) => Object.values(o).every((f) => /^https:\/\//.test(f.fonte.url))));
ok("aviso de peso ajustado acima de 110 kg", meta(120, "ganhar", true).avisoPesoAjustado && !meta(100, "ganhar", true).avisoPesoAjustado);
for (const p of [40, 50, 60, 70, 80, 90, 100, 120, 150]) {
  const m = meta(p, "ganhar", true);
  ok(`${p} kg: números inteiros e em ordem`, [m.minG, m.refG, m.maxG].every(Number.isInteger) && m.minG <= m.refG && m.refG <= m.maxG);
}
ok("peso fora dos limites é recusado", !pesoValido(0) && !pesoValido(-5) && !pesoValido(29) && !pesoValido(251) && !pesoValido(NaN) && !pesoValido(Infinity) && pesoValido(80));
ok("vírgula e ponto: 72,5 e 72.5", parseNumero("72,5") === 72.5 && parseNumero("72.5") === 72.5 && parseNumero("abc") === null && parseNumero("") === null && parseNumero("-3") === null);

console.log("\n2. O QUE FALTA");
ok("meta 160, come 125 → faltam 35", falta(160, 125).faltaG === 35);
ok("meta atingida não vira 'tome 0 g'", (() => { const f = falta(160, 170); return f.atingida && f.faltaG === 0; })());
ok("exatamente na meta também conta como atingida", falta(160, 160).atingida);
ok("meta 160, come 30 → diferença grande", falta(160, 30).grande && falta(160, 30).faltaG === 130);
ok(`até ${FALTA_GRANDE} g não é 'grande'`, !falta(160, 100).grande && falta(160, 99).grande);
for (const c of [0, 50, 100, 150, 200]) ok(`consumo ${c} g: falta nunca negativa`, falta(160, c).faltaG >= 0);

console.log("\n3. O RÓTULO E A DOSE");
const d = dose(35, 30, 24);
ok("24 g em 30 g = 80%", perto(concentracao(30, 24), 0.8));
ok("35 g de proteína ÷ 0,8 = 44 g de produto", d.produtoG === 44);
ok("35 ÷ 24 = 1,46 porções", d.porcoes === 1.46);
ok("30 g de proteína com 24 g por porção = 1,25 porções", dose(30, 30, 24).porcoes === 1.25);
for (const pr of [18, 21, 24, 27]) {
  const x = dose(35, 30, pr);
  ok(`rótulo 30 g → ${pr} g: a dose entrega 35 g (±1)`, Math.abs(proteinaEm(x.produtoG, 30, pr) - 35) <= 1);
}
ok("rótulo com menos proteína pede mais produto", dose(35, 30, 18).produtoG > dose(35, 30, 27).produtoG);
ok("inverso: 40 g de um whey 24/30 = 32 g de proteína", proteinaEm(40, 30, 24) === 32);
ok("inverso: 30, 50 g", proteinaEm(30, 30, 24) === 24 && proteinaEm(50, 30, 24) === 40);
ok("medidas: 44 g ÷ 30 g = 1,47", medidas(44, 30) === 1.47);
ok("proteína maior que a porção é impossível", estadoRotulo(30, 35) === "impossivel" && !rotuloCalculavel("impossivel"));
ok("porção zero, vazia ou gigante é recusada", ["porcaoInvalida"].includes(estadoRotulo(0, 24)) && estadoRotulo(null, 24) === "porcaoInvalida" && estadoRotulo(500, 24) === "porcaoInvalida");
ok("proteína zero é recusada", estadoRotulo(30, 0) === "proteinaInvalida");
ok("concentração abaixo de 50% calcula, mas avisa", estadoRotulo(30, 12) === "baixa" && rotuloCalculavel("baixa"));
ok("acima de 95% calcula, mas avisa", estadoRotulo(30, 29) === "alta");
ok("24/30 está ok", estadoRotulo(30, 24) === "ok");

console.log("\n4. O PACOTE E O CUSTO");
ok("900 g a 44 g/dia = 20 dias", duracao(900, 44).diasCorridos === 20 && duracao(900, 44).usos === 20);
ok("≈ 2,9 semanas", duracao(900, 44).semanas === 2.9);
ok("usando 5 dias por semana, o pacote dura mais em dias corridos", duracao(900, 44, 5).usos === 20 && duracao(900, 44, 5).diasCorridos === 28);
for (const p of [450, 900, 1000, 1800]) ok(`pacote ${p} g: dias inteiros e positivos`, Number.isInteger(duracao(p, 30).diasCorridos) && duracao(p, 30).diasCorridos > 0);
const c = custo(129.9, 900, 30, 24, 44);
ok("preço por grama", perto(c.porGrama, 129.9 / 900, 1e-9));
ok("preço por porção de 30 g", perto(c.porPorcao, (129.9 / 900) * 30, 1e-9));
ok("custo por 25 g de proteína = 25 ÷ 0,8 g de produto", perto(c.por25gProteina, (25 / 0.8) * (129.9 / 900), 1e-9));
ok("custo por 30 g de proteína", perto(c.por30gProteina, 37.5 * (129.9 / 900), 1e-9));
ok("30 dias com 7 dias/semana = 30 usos", perto(c.por30Dias, 44 * 30 * (129.9 / 900), 1e-9));
ok("30 dias com 5 dias/semana custa menos", custo(129.9, 900, 30, 24, 44, 5).por30Dias < c.por30Dias);
for (const pr of [50, 100, 150, 300]) ok(`preço R$ ${pr}: tudo finito`, Object.values(custo(pr, 900, 30, 24, 44)).every(Number.isFinite));

console.log("\n5. O COMPARADOR");
const cmp = compara({ preco: 120, pacoteG: 900, porcaoG: 30, proteinaG: 21 }, { preco: 150, pacoteG: 900, porcaoG: 30, proteinaG: 27 });
ok("proteína por 100 g: 70 e 90", cmp.a.proteinaPor100g === 70 && cmp.b.proteinaPor100g === 90);
ok("o pó mais caro pode ter a proteína mais barata", cmp.maisBarato === "b");
ok("iguais dão empate", compara({ preco: 100, pacoteG: 900, porcaoG: 30, proteinaG: 24 }, { preco: 100, pacoteG: 900, porcaoG: 30, proteinaG: 24 }).maisBarato === "empate");

console.log("\n6. O ESTIMADOR");
for (const a of ALIMENTOS_ESTIMADOR) {
  const base = getAlimento(a.slugBase);
  const v = base ? valorPor100g(base, "proteina") : null;
  ok(`${a.nome}: bate com a base (TACO)`, v !== null && Math.abs(v - a.proteinaPor100g) <= 0.1);
}
ok("2 ovos + 1 frango + 1 feijão", estimaConsumo({ ovo: 2, frango: 1, feijao: 1 }) === Math.round(2 * proteinaPorcao(ALIMENTOS_ESTIMADOR[0]) + 32 + 4.8));
ok("nada selecionado = 0", estimaConsumo({}) === 0);
ok("outros do rótulo somam", estimaConsumo({}, 20) === 20);

console.log("\n7. ARTIGOS");
const todos = [...ARTIGOS_COM_CALCULADORA_WHEY, ...ARTIGOS_COM_LINK_WHEY];
ok("todo artigo registrado existe", todos.every((s) => blogPosts.some((p) => p.slug === s)));
ok("embed e link não se repetem", ARTIGOS_COM_CALCULADORA_WHEY.every((s) => !ARTIGOS_COM_LINK_WHEY.includes(s)));
ok("o de GLP-1 recebe link, não calculadora", ARTIGOS_COM_LINK_WHEY.includes("whey-protein-para-quem-usa-mounjaro"));

console.log("\n8. PÁGINA E COMPONENTE");
const pag = existsSync("app/ferramentas/calculadora-whey/page.tsx") ? readFileSync("app/ferramentas/calculadora-whey/page.tsx", "utf8") : "";
const comp = existsSync("components/whey/CalculadoraWhey.tsx") ? readFileSync("components/whey/CalculadoraWhey.tsx", "utf8") : "";
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("a página existe", pag.length > 0);
ok("o componente existe", comp.length > 0);
if (pag && comp) {
  const titulo = pag.match(/title: "([^"]+)"/)![1];
  const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
  ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
  ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);
  ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
  ok("FAQPage e BreadcrumbList", /"@type": "FAQPage"/.test(pag) && /"@type": "BreadcrumbList"/.test(pag));
  ok("sem estrelas nem avaliações inventadas", !/aggregateRating|reviewCount|ratingValue/.test(pag + comp));
  ok("todo link de blog da página existe", [...(pag + comp).matchAll(/href="\/blog\/([^"]+)"/g)].every((m) => blogPosts.some((p) => p.slug === m[1])));
  ok("sem página por peso", !readdirSync("app/ferramentas").some((d) => /whey-.*\d+kg/.test(d)));
  ok("não afirma scoop universal de 30 g", !/1 scoop = 30|todo scoop tem 30/i.test(pag + comp));
  ok("meta atingida tem mensagem própria", /já atinge sua referência estimada/.test(comp));
  ok("diferença grande tem alerta", /Essa diferença é grande/.test(comp));
  ok("com diferença grande, a dose não se apresenta como recomendação", /Se fosse completar tudo com whey/.test(comp) && /Não é o recomendado/.test(comp));
  ok("o comparador não diz que o mais barato é melhor", /custa menos/.test(comp) && !/é melhor/.test(comp.replace(/não.{0,40}é melhor/g, "")));
  ok("a mensagem do WhatsApp é a pedida e não leva peso", /Usei sua Calculadora de Whey e queria ajuda para organizar meu treino de acordo com meu objetivo/.test(comp));
  ok("o analytics não leva o peso cru", !/weight:\s*peso|weight_kg/.test(comp));
  ok("Enter leva até o resultado", /scrollIntoView\(\{ block: "start"/.test(comp));
}
ok("o blog embute e linka pelos registros", /ARTIGOS_COM_CALCULADORA_WHEY\.includes\(post\.slug\)/.test(blog) && /ARTIGOS_COM_LINK_WHEY\.includes\(post\.slug\) && <LinkFerramentaWhey/.test(blog));
ok("a Calculadora de Proteína leva ao whey", /\/ferramentas\/calculadora-whey/.test(readFileSync("components/proteina/CalculadoraProteina.tsx", "utf8")));
ok("no sitemap", /calculadora-whey/.test(readFileSync("app/sitemap.ts", "utf8")));

console.log(falhas ? `\n${falhas} FALHA(S)\n` : "\nTUDO OK\n");
process.exit(falhas ? 1 : 0);
