import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias na Natação.
 *   npx tsx scripts/natacao-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_NATACAO, MET_BORDA, NADOS, bordaValida, calcula, comparaNados, kgPorMes, minutosValidos, nado, pesoValido, tabelaNados,
} from "../lib/natacao";
import { ritmo as ritmoCaminhada, metCaminhada } from "../lib/caminhada";
import { metCorrida } from "../lib/corrida";
import { arredondaKcal, kcalPorMinuto } from "../lib/polichinelo";
import { ARTIGOS_COM_CALCULADORA_ATIVIDADES, ATIVIDADES } from "../lib/atividades";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. OS METs (Compêndio de 2011), TRAVADOS");
const esperado: Record<string, number> = { "crawl-leve": 5.8, lazer: 6.0, costas: 9.5, "crawl-forte": 9.8, peito: 10.3, borboleta: 13.8 };
for (const [id, met] of Object.entries(esperado)) ok(`${id} = ${met}`, nado(id as never).met === met);
ok("seis nados, em ordem de gasto", NADOS.length === 6 && NADOS.every((n, i) => i === 0 || n.met > NADOS[i - 1].met));
ok("crawl leve e forte são os antigos da coletiva", nado("crawl-leve").met === 5.8 && nado("crawl-forte").met === 9.8);
ok("borda = 1,3 (em pé parado)", MET_BORDA === 1.3);
ok("hidroginástica fica de fora, porque as fontes divergem", !NADOS.some((n) => /hidro/i.test(n.nome)));

bloco("2. A CONTA E A BORDA");
const c = calcula(80, 60, 5.8);
ok("1 h de crawl leve, 80 kg = 487,2", perto(c.kcal, 487.2));
ok("sem borda, nada de gasto de borda", c.minutosBorda === 0 && c.kcalBorda === 0);
const b = calcula(80, 25, 5.8, 15);
ok("a soma das partes é o total", perto(b.kcalNadando + b.kcalBorda, b.kcal));
ok("o mesmo tempo com borda gasta menos", b.kcal < calcula(80, 40, 5.8).kcal);
ok("líquido desconta 1 MET do tempo todo", perto(b.kcalLiquida, b.kcal - 1.4 * 40));
ok("kg/mês = líquido × vezes ÷ 7700 × 52/12", perto(kgPorMes(c, 3), (c.kcalLiquida * 3 / 7700) * 52 / 12));
const cmp = comparaNados(80, 60);
ok("a comparação traz todos os nados, do maior para o menor", cmp.length === NADOS.length && cmp.every((l, i) => i === 0 || l.kcal <= cmp[i - 1].kcal));
ok("limites", !pesoValido(20) && pesoValido(80) && !minutosValidos(2) && minutosValidos(40) && bordaValida(0) && !bordaValida(-1) && !bordaValida(200));

bloco("3. O ARTIGO DIZ O QUE A CALCULADORA DIZ (80 kg)");
const art = blogPosts.find((p) => p.slug === "natacao-emagrece")!;
const t = tabelaNados(60);
const k = (id: string) => t.find((l) => l.nado.id === id)!.kcal80;
ok(`crawl leve e lazer: ${k("crawl-leve")} a ${k("lazer")}`, art.content.includes(`cerca de ${k("crawl-leve")} a ${k("lazer")} kcal`));
ok(`costas e peito: ${k("costas")} a ${k("peito")}`, art.content.includes(`cerca de ${k("costas")} a ${k("peito")} kcal`));
ok(`crawl forte: ${k("crawl-forte")}`, art.content.includes(`Crawl forte: cerca de ${k("crawl-forte")} kcal`));
ok(`borboleta: ${k("borboleta").toLocaleString("pt-BR")}`, art.content.includes(`Borboleta: cerca de ${k("borboleta").toLocaleString("pt-BR")} kcal`));
{
  const cam = arredondaKcal(kcalPorMinuto(metCaminhada(ritmoCaminhada("rapido").velocidade, 0), 80) * 60);
  const cor = arredondaKcal(kcalPorMinuto(metCorrida(8, 0), 80) * 60);
  ok(`caminhada rápida da calculadora de caminhada (${cam})`, art.content.includes(`cerca de ${cam} kcal/h`));
  ok(`corrida leve da calculadora de corrida (${cor})`, art.content.includes(`cerca de ${cor} kcal/h`));
}
{
  const a70 = arredondaKcal(calcula(70, 60, 5.8).kcal), a90 = arredondaKcal(calcula(90, 60, 9.8).kcal);
  ok(`a FAQ publica o crawl de 70 a 90 kg (${a70} a ${a90})`, art.faq!.some((f) => f.answer.includes(`cerca de ${a70} a ${a90} kcal`)));
  ok(`o título "400 a 900" cabe no crawl de 70 a 90 kg (${a70} a ${a90})`, /400 a 900 kcal/.test(art.metaTitle ?? "") && a70 >= 400 && a90 <= 950);
}
ok("a descrição do Google não fala mais em crawl moderado de 550 a 700", !/550 a 700/.test((art.metaDescription ?? "") + art.content + JSON.stringify(art.faq)));
ok(`descrição do Google dentro do limite (${(art.metaDescription ?? "").length})`, (art.metaDescription ?? "").length >= 130 && (art.metaDescription ?? "").length <= 155);

/* A auditoria: o artigo de férias também publica a natação. */
{
  const fe = blogPosts.find((p) => p.slug === "como-manter-treinos-durante-ferias")!;
  const v = (peso: number, id: string) => arredondaKcal(calcula(peso, 30, nado(id as never).met).kcal);
  ok(`as férias publicam a natação da calculadora (${v(60, "crawl-leve")}–${v(90, "crawl-leve")} e ${v(60, "crawl-forte")}–${v(90, "crawl-forte")})`,
    fe.content.includes(`cerca de ${v(60, "crawl-leve")} a ${v(90, "crawl-leve")} calorias`) && fe.content.includes(`de ${v(60, "crawl-forte")} a ${v(90, "crawl-forte")} em ritmo forte`) && fe.content.includes("/ferramentas/calculadora-calorias-natacao"));
}

bloco("4. UMA FERRAMENTA POR ARTIGO");
ok("o artigo embute a calculadora de natação", ARTIGOS_COM_CALCULADORA_NATACAO.includes("natacao-emagrece"));
ok("e saiu da calculadora de atividades", !ARTIGOS_COM_CALCULADORA_ATIVIDADES.includes("natacao-emagrece"));
ok("a natação saiu do seletor de atividades", !ATIVIDADES.some((a) => a.id === "natacao"));
ok("o corte editorial existe no HTML renderizado", splitAtPrimeiraSecao(marked(art.content) as string) !== null);
ok("canônica e pós-resultado", CANONICA.natacao?.href === ROTA.natacao && NOME.natacao === "Calculadora de Calorias na Natação");

bloco("5. REGISTROS E PÁGINA");
const comp = readFileSync("components/natacao/CalculadoraNatacao.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-calorias-natacao/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_NATACAO\.includes\(post\.slug\)/.test(blog) && /<CalculadoraNatacao placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-natacao/.test(readFileSync("app/ferramentas/page.tsx", "utf8")) && /calculadora-calorias-natacao/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam o peso", !/trackEvent\([^)]*peso/.test(comp));
ok("a pergunta da frequência vem antes da área de resultado", comp.indexOf('id={idc("sem")}') > 0 && comp.indexOf('id={idc("sem")}') < comp.indexOf('aria-live="polite"'));
ok("a borda é campo próprio, não fração suposta", /id=\{idc\("borda"\)\}/.test(comp));
ok("kcal com ponto de milhar", /toLocaleString\("pt-BR"\)/.test(comp) && !/\{arredondaKcal\(/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
