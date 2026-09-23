import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias no Hyrox.
 *   npx tsx scripts/hyrox-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_HYROX, ESTACOES, KM_CORRIDA, MET_ESTACOES, PROVAS, calcula, kcalPorMinuto, paceValido,
  parseTempoProva, pesoValido, tabelaProvas, tempoValido,
} from "../lib/hyrox";
import { metCorrida } from "../lib/corrida";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;
const est = (id: string) => ESTACOES.find((e) => e.id === id)!;

bloco("1. A PROVA E OS METs, TRAVADOS");
ok("oito estações, na ordem oficial", ESTACOES.map((e) => e.id).join(",") === "ski,sled-push,sled-pull,burpee,remo,farmers,lunges,wallball");
ok("distâncias oficiais", est("ski").distancia === "1.000 m" && est("remo").distancia === "1.000 m" && est("sled-push").distancia === "50 m"
  && est("burpee").distancia === "80 m" && est("farmers").distancia === "200 m" && est("lunges").distancia === "100 m" && est("wallball").distancia === "100 repetições");
ok("8 km de corrida", KM_CORRIDA === 8);
ok("SkiErg = 6,8 (02080)", est("ski").met === 6.8);
ok("remo = 8,5 (02073, confirmado pelo dono do site)", est("remo").met === 8.5);
ok("as seis de força = circuito vigoroso, 8,0 (02040), como o WOD do CrossFit",
  ESTACOES.filter((e) => !["ski", "remo"].includes(e.id)).every((e) => e.met === 8.0));
ok("MET médio das estações = média simples", perto(MET_ESTACOES, (6.8 + 8.5 + 6 * 8) / 8, 0.001));

bloco("2. A CONTA");
const r = calcula(70, 90, 360)!;
ok("pace 6:00 → 8 km em 48 min, 42 min de estação", perto(r.minutosCorrida, 48) && perto(r.minutosEstacoes, 42));
ok("a corrida usa a mesma equação da Calculadora de Corrida", perto(r.metCorrida, metCorrida(10)));
ok("a soma das partes é o total", perto(r.kcalCorrida + r.kcalEstacoes, r.kcal) && perto(r.kcalPorEstacao.reduce((s, x) => s + x.kcal, 0), r.kcalEstacoes));
ok("líquido desconta 1 MET da prova toda", perto(r.kcalLiquida, r.kcal - kcalPorMinuto(1, 70) * 90));
ok("a corrida faz mais da metade do gasto", r.kcalCorrida / r.kcal > 0.5);
ok("corrida que não deixa tempo para estações dá null", calcula(70, 60, 420) === null);
ok("prova mais lenta gasta mais no total", tabelaProvas()[2].kcal70 > tabelaProvas()[1].kcal70 && tabelaProvas()[1].kcal70 > tabelaProvas()[0].kcal70);
ok("tempo final aceita 1h30, 1:30 e 90", parseTempoProva("1h30") === 90 && parseTempoProva("1:30") === 90 && parseTempoProva("90") === 90 && parseTempoProva("1:75") === null);
ok("limites", !pesoValido(20) && pesoValido(70) && !tempoValido(30) && tempoValido(90) && !paceValido(120) && paceValido(360) && !paceValido(700));

bloco("3. O ARTIGO DIZ O QUE A CALCULADORA DIZ");
const art = blogPosts.find((p) => p.slug === "hyrox-o-que-e")!;
ok("o artigo existe", !!art);
const texto = art.content + JSON.stringify(art.faq);
const tab = tabelaProvas();
const hm = (m: number) => `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}`;
for (const l of tab) {
  ok(`${l.prova.id}: ${l.kcal70} e ${l.kcal90} kcal`, art.content.includes(`cerca de ${l.kcal70} kcal para 70 kg e ${l.kcal90} para 90 kg`)
    && art.content.includes(`em ${hm(l.prova.minutos)}`));
}
{
  const pctT = Math.round((r.minutosCorrida / r.minutosTotais) * 100), pctK = Math.round((r.kcalCorrida / r.kcal) * 100);
  ok(`corrida: ${pctT}% do tempo e ${pctK}% do gasto`, texto.includes(`${pctT}% do tempo`) && texto.includes(`cerca de ${pctK}% do gasto`));
  ok(`cada estação ≈ ${Math.round(r.kcalEstacoes / 8)} kcal ("perto de 50")`, Math.abs(r.kcalEstacoes / 8 - 50) <= 3 && /perto de 50 kcal/.test(texto));
  ok("1.025 kcal na resposta direta", /cerca de 1\.025 kcal/.test(art.content) && tab[1].kcal70 === 1025);
}
ok("as oito estações estão no artigo", ESTACOES.every((e) => art.content.includes(e.distancia)));
ok("todo link interno do artigo aponta para artigo existente",
  [...art.content.matchAll(/href="\/blog\/([^"]+)"/g)].every((m) => blogPosts.some((p) => p.slug === m[1])));
ok(`título do Google até 60 (${(art.metaTitle ?? art.title).length})`, (art.metaTitle ?? art.title).length <= 60);
ok(`descrição do Google entre 120 e 160 (${(art.metaDescription ?? "").length})`, (art.metaDescription ?? "").length >= 120 && (art.metaDescription ?? "").length <= 160);
ok("tem pelo menos 5 subtítulos", (art.content.match(/<h2[\s>]/g) ?? []).length >= 5);
ok("os tempos da calculadora são os do artigo", PROVAS.map((p) => p.minutos).join() === "70,90,115");

bloco("4. UMA FERRAMENTA POR ARTIGO");
ok("o artigo embute a calculadora de Hyrox", ARTIGOS_COM_CALCULADORA_HYROX.includes("hyrox-o-que-e"));
ok("o corte editorial existe no HTML renderizado", splitAtPrimeiraSecao(marked(art.content) as string) !== null);
ok("canônica e pós-resultado", CANONICA.hyrox?.href === ROTA.hyrox && NOME.hyrox === "Calculadora de Calorias no Hyrox");

bloco("5. REGISTROS E PÁGINA");
const comp = readFileSync("components/hyrox/CalculadoraHyrox.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-calorias-hyrox/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_HYROX\.includes\(post\.slug\)/.test(blog) && /<CalculadoraHyrox placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-hyrox/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /calculadora-calorias-hyrox/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam peso nem tempo", !/trackEvent\([^)]*(peso|tempo|pace)/.test(comp));
ok("prova que não cabe tem mensagem", /naoCabe/.test(comp) && /quase não deixam tempo para as estações/.test(comp));
ok("kcal com ponto de milhar", /toLocaleString\("pt-BR"\)/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
