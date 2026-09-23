import { readFileSync, readdirSync } from "fs";
/**
 * O motor da Calculadora de Creatina.
 *   npx tsx scripts/creatina-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_CREATINA, ARTIGOS_COM_LINK_CREATINA, DIAS_SATURACAO, G_POR_KG_MANUTENCAO, G_POR_KG_SATURACAO,
  MANUTENCAO_MAX, MANUTENCAO_MIN, comparaPotes, custo, diasPorDose, duracaoPote, faixaPeso, medidaValida, medidas,
  parseNumero, pesoValido, poteValido, precoValido, referencia, saturacao,
} from "../lib/creatina";
import { CANONICA } from "../lib/ferramentas/canonica";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.001) => Math.abs(a - b) <= t;

bloco("1. OS NÚMEROS DO CONSENSO (ISSN 2017), TRAVADOS");
ok("manutenção = 0,03 g/kg", G_POR_KG_MANUTENCAO === 0.03);
ok("faixa estudada = 3 a 5 g", MANUTENCAO_MIN === 3 && MANUTENCAO_MAX === 5);
ok("saturação = 0,3 g/kg por dia", G_POR_KG_SATURACAO === 0.3);
ok("saturação de 5 dias na conta do pote", DIAS_SATURACAO === 5);

bloco("2. A REFERÊNCIA POR PESO (40 a 150 kg)");
const esperado: [number, number][] = [[40, 3], [50, 3], [60, 3], [70, 3], [80, 3], [90, 3], [100, 3], [120, 4], [150, 5]];
for (const [p, d] of esperado) {
  const r = referencia(p);
  ok(`${p} kg: conta ${r.calculada.toFixed(2)} g → referência ${d} g`, r.diaria === d && perto(r.calculada, 0.03 * p));
}
ok("nunca abaixo de 3 nem acima de 5", [30, 45, 99, 101, 116, 117, 149, 200, 250].every((p) => { const d = referencia(p).diaria; return d >= 3 && d <= 5; }));
ok("abaixo de 100 kg, a conta sobe para o mínimo e avisa", referencia(80).subiuParaMinimo && !referencia(120).subiuParaMinimo);
ok("acima de 120 kg, menciona a dose de atletas grandes", referencia(130).atletaGrande && !referencia(120).atletaGrande);

bloco("3. A SATURAÇÃO");
for (const [p, d] of [[60, 18], [70, 21], [80, 24], [100, 30]] as const) {
  const s = saturacao(p);
  ok(`${p} kg: ${d} g/dia, 4 porções, ${d * 5} g em 5 dias`, s.diaria === d && s.doses === 4 && s.total === d * 5 && s.manutencao === referencia(p).diaria);
}
ok("70 kg dá os '20 g por dia' dos artigos (21)", Math.abs(saturacao(70).diaria - 20) <= 1);
ok("a porção é a dose dividida por 4, a 0,5 g", saturacao(80).porDose === 6 && saturacao(70).porDose === 5.5);

bloco("4. O POTE (150, 300, 500 e 1000 g)");
for (const pote of [150, 300, 500, 1000]) {
  ok(`${pote} g, 80 kg, sem saturação: ${Math.floor(pote / 3)} dias`, duracaoPote(pote, 80, false).dias === Math.floor(pote / 3));
}
{
  const d = duracaoPote(300, 80, true);
  ok("300 g, 80 kg, com saturação: 120 g na saturação, 180 g sobram, 5 + 60 = 65 dias", d.consumoSaturacao === 120 && d.restante === 180 && d.dias === 65);
  const f = duracaoPote(150, 150, true);
  ok("pote que acaba na saturação avisa em vez de somar manutenção", f.acabaNaSaturacao && f.dias === Math.floor(150 / saturacao(150).diaria));
}
ok("tabela: 300 g = 100 dias a 3 g e 60 a 5 g", diasPorDose(300, 3) === 100 && diasPorDose(300, 5) === 60);
ok("tabela: 1 kg = 333 dias a 3 g e 200 a 5 g", diasPorDose(1000, 3) === 333 && diasPorDose(1000, 5) === 200);

bloco("5. O CUSTO (R$ 50, 100 e 200)");
for (const preco of [50, 100, 200]) {
  const c = custo(preco, 300, 3);
  ok(`R$ ${preco} por 300 g, 3 g/dia: R$ ${c.porDia.toFixed(2)}/dia`, perto(c.porGrama, preco / 300) && perto(c.porDia, (preco / 300) * 3) && perto(c.por30Dias, c.porDia * 30) && perto(c.porAno, c.porDia * 365));
}
{
  const c = comparaPotes({ g: 300, preco: 89.9 }, { g: 500, preco: 139.9 });
  ok("comparador: 500 g por R$ 139,90 sai mais barato por grama que 300 g por R$ 89,90", c.maisBarato === "b" && perto(c.porGramaA, 89.9 / 300) && perto(c.porGramaB, 139.9 / 500));
  ok("comparador: preço por grama igual é empate", comparaPotes({ g: 300, preco: 90 }, { g: 600, preco: 180 }).maisBarato === "empate");
}
ok("dosador: 5 g com medida de 3 g = 1,5 medida; 3 g com medida de 3 g = 1", medidas(5, 3) === 1.5 && medidas(3, 3) === 1);

bloco("6. ENTRADAS ESTRANHAS");
ok("vírgula e ponto decimal", parseNumero("72,5") === 72.5 && parseNumero("72.5") === 72.5);
ok("espaços nas pontas", parseNumero("  80 ") === 80);
ok("vazio, texto, negativo e NaN não viram número", parseNumero("") === null && parseNumero("abc") === null && parseNumero("-80") === null && parseNumero("NaN") === null && parseNumero("Infinity") === null);
ok("peso 0, 5000 e fora da faixa são recusados", !pesoValido(0) && !pesoValido(5000) && !pesoValido(29) && pesoValido(30) && pesoValido(250) && !pesoValido(251));
ok("pote, preço e medida têm faixa", !poteValido(0) && !poteValido(10000) && poteValido(300) && !precoValido(0) && precoValido(89.9) && !medidaValida(0) && medidaValida(3));
ok("a faixa de peso não expõe o peso", faixaPeso(83.4) === "80-99" && faixaPeso(55) === "<60" && faixaPeso(130) === "100+");

bloco("7. OS ARTIGOS DIZEM O QUE A CALCULADORA DIZ");
const todos = [...ARTIGOS_COM_CALCULADORA_CREATINA, ...ARTIGOS_COM_LINK_CREATINA];
ok("os 9 artigos de creatina existem", todos.length === 9 && todos.every((s) => blogPosts.some((p) => p.slug === s)));
ok("embed e link não se repetem", ARTIGOS_COM_CALCULADORA_CREATINA.every((s) => !ARTIGOS_COM_LINK_CREATINA.includes(s)));
ok("os de GLP-1 recebem link, não calculadora", ["creatina-para-quem-usa-mounjaro", "creatina-para-quem-usa-retatrutida"].every((s) => ARTIGOS_COM_LINK_CREATINA.includes(s)));
for (const s of todos) {
  const a = blogPosts.find((p) => p.slug === s)!;
  const t = a.content + JSON.stringify(a.faq ?? []);
  /* Nenhum artigo pode recomendar manutenção fora de 3 a 5 g. */
  const fora = [...t.matchAll(/(\d+(?:[,.]\d+)?)\s*(?:a|-|–)\s*(\d+(?:[,.]\d+)?)\s*g(?:\s*|\/)(?:por dia|dia)/g)]
    .filter((m) => Number(m[1].replace(",", ".")) < 20 && (Number(m[1].replace(",", ".")) < 3 || Number(m[2].replace(",", ".")) > 5))
    /* Dose de outro suplemento no mesmo artigo (ômega-3: "2-4 g/dia de EPA + DHA") não é dose de creatina. */
    .filter((m) => !/EPA|DHA|ômega|omega/i.test(t.slice(m.index!, m.index! + 60)));
  ok(`${s}: toda faixa diária de manutenção cabe em 3–5 g`, fora.length === 0, fora.map((m) => m[0]).join(" | "));
}
for (const s of ARTIGOS_COM_CALCULADORA_CREATINA) {
  const a = blogPosts.find((p) => p.slug === s)!;
  ok(`${s}: o corte editorial existe (embed depois da primeira seção)`, splitAtPrimeiraSecao(marked(a.content) as string) !== null);
}

bloco("8. REGISTROS E PÁGINA");
const comp = readFileSync("components/creatina/CalculadoraCreatina.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-creatina/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("canônica", CANONICA.creatina?.href === "/ferramentas/calculadora-creatina");
ok("o blog embute e linka pelos registros", /ARTIGOS_COM_CALCULADORA_CREATINA\.includes\(post\.slug\)/.test(blog) && /ARTIGOS_COM_LINK_CREATINA\.includes\(post\.slug\) && <LinkFerramentaCreatina/.test(blog));
ok("hub e sitemap", /calculadora-creatina/.test(readFileSync("app/ferramentas/page.tsx", "utf8")) && /calculadora-creatina/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam peso nem preço (só a faixa)", !/trackEvent\([^)]*\b(peso|pesoKg|preco|price|weight)\s*:/.test(comp) && /weight_range: faixaPeso/.test(comp));
ok("saturação começa desligada", /useState\(false\);\s*\n\s*const \[poteAberto/.test(comp) && /const \[comSaturacao, setComSaturacao\] = useState\(false\)/.test(comp));
ok("o dosador avisa que a colher não garante gramas", /tamanho da colher não garante a quantidade em gramas/.test(comp));
ok("o comparador separa preço de qualidade", /Preço não diz nada sobre qualidade/.test(comp));
ok("a mensagem do WhatsApp é a pedida e não leva o peso", /Usei sua Calculadora de Creatina e queria entender como organizar meu treino para meu objetivo/.test(comp));
ok("sem página por peso", !readdirSync("app/ferramentas").some((d) => /creatina-.*\d+kg/.test(d)) && !/creatina-para-\d+kg/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);
ok("FAQ com 21 perguntas no schema", (pag.match(/question: "/g) ?? []).length === 21 && /"@type": "FAQPage"/.test(pag));
ok("todo link interno da página existe", [...pag.matchAll(/href="\/blog\/([^"]+)"/g)].every((m) => blogPosts.some((p) => p.slug === m[1])));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
