import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias no Spinning.
 *   npx tsx scripts/spinning-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_SPINNING, FAIXAS, MET_AULA, WATTS_MAX, WATTS_MIN, calcula, faixaDe, kjDoTrabalho,
  minutosValidos, pesoValido, semana, tabelaPorFaixa, tabelaPorPeso, wattsNoCompendio,
} from "../lib/spinning";
import { ARTIGOS_COM_CALCULADORA_ATIVIDADES, ATIVIDADES } from "../lib/atividades";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. AS FAIXAS DO COMPÊNDIO (2011), TRAVADAS");
const esperado: [string, number, number, number][] = [
  ["02011", 30, 50, 3.5], ["02017", 51, 89, 4.8], ["02012", 90, 100, 6.8],
  ["02013", 101, 160, 8.8], ["02014", 161, 200, 11.0], ["02015", 201, 270, 14.0],
];
ok("seis faixas", FAIXAS.length === 6);
for (const [c, de, ate, met] of esperado) {
  const f = FAIXAS.find((x) => x.codigo === c);
  ok(`${c}: ${de}–${ate} W = ${met}`, !!f && f.de === de && f.ate === ate && f.met === met);
}
ok("aula de spinning = 8,5 (02019)", MET_AULA === 8.5);
ok("as faixas são contíguas, sem buraco", FAIXAS.every((f, i) => i === 0 || f.de === FAIXAS[i - 1].ate + 1));
ok("e crescem", FAIXAS.every((f, i) => i === 0 || f.met > FAIXAS[i - 1].met));
/* 6,8 e 8,8 eram os valores da calculadora de atividades; a busca que os
   confirmou achou os dois nas mesmas entradas de watts. */
ok("as faixas de 90–100 e 101–160 W são os antigos moderado e vigoroso", faixaDe(95)!.met === 6.8 && faixaDe(130)!.met === 8.8);

bloco("2. AS BORDAS");
ok("29 W não tem faixa", faixaDe(29) === null && !wattsNoCompendio(29));
ok("271 W não tem faixa", faixaDe(271) === null && !wattsNoCompendio(271));
ok("30 e 270 W têm", faixaDe(WATTS_MIN) !== null && faixaDe(WATTS_MAX) !== null);
ok("100 e 101 W caem em faixas diferentes", faixaDe(100)!.met !== faixaDe(101)!.met);
ok("decimal arredonda: 160,4 fica em 101–160, 160,6 vai para 161–200", faixaDe(160.4)!.met === 8.8 && faixaDe(160.6)!.met === 11.0);

bloco("3. A CONTA");
const a = calcula(70, 45, 8.5);
ok("aula de 45 min, 70 kg = 468,6 kcal", perto(a.kcal, 468.56, 0.1));
ok("líquido desconta 1 MET", perto(a.kcalLiquida, a.kcal - 1.225 * 45));
ok("kJ = W × min × 60 ÷ 1000", kjDoTrabalho(150, 45) === 405);
ok("o kJ não depende do peso, o Compêndio depende", calcula(140, 45, 8.8).kcal > calcula(70, 45, 8.8).kcal * 1.99);
const s3 = semana(a, 3);
ok("mês = semana × 52/12 ÷ 7700", perto(s3.kgMes, (a.kcalLiquida * 3 / 7700) * 52 / 12));
ok("tabela por peso cresce", tabelaPorPeso().every((l, i, arr) => i === 0 || l.aula > arr[i - 1].aula));

bloco("4. LIMITES");
ok("peso", !pesoValido(20) && pesoValido(70) && !pesoValido(300));
ok("tempo", !minutosValidos(2) && minutosValidos(45) && !minutosValidos(200));

bloco("5. O ARTIGO DIZ O QUE A CALCULADORA DIZ");
const art = blogPosts.find((p) => p.slug === "spinning-emagrece")!;
const tf = tabelaPorFaixa(45);
const linha = (c: string) => tf.find((l) => l.faixa.codigo === c)!;
for (const [c, nome] of [["02017", "leve"], ["02013", "moderada"], ["02014", "forte"]] as const) {
  const l = linha(c);
  ok(`${nome} (${l.faixa.de}–${l.faixa.ate} W): ${l.kcal70} e ${l.kcal90} kcal no artigo`,
    art.content.includes(`${l.faixa.de} a ${l.faixa.ate} W`) && art.content.includes(`cerca de ${l.kcal70} kcal`) && art.content.includes(`cerca de ${l.kcal90} kcal`));
}
{
  const t = tabelaPorPeso(45);
  const a70 = t.find((l) => l.peso === 70)!.aula, a90 = t.find((l) => l.peso === 90)!.aula;
  ok(`a linha "sem saber os watts" é a aula de spinning (${a70} e ${a90})`, art.content.includes(`<td>cerca de ${a70} kcal</td><td>cerca de ${a90} kcal</td>`));
  ok(`a FAQ do artigo cabe na aula (450 a 600; calculadora ${a70} a ${a90})`, art.faq!.some((f) => /450 a 600 kcal numa aula de 45 minutos/.test(f.answer)) && a70 >= 450 && a90 <= 600);
}
ok("o artigo não publica mais as faixas antigas", !/550–700 kcal|700–900 kcal|400 a 700 kcal/.test(art.content + JSON.stringify(art.faq)));
{
  const min = calcula(70, 45, 8.5).kcalLiquida * 3, max = calcula(90, 45, 8.5).kcalLiquida * 3;
  const km = (k: number) => (k / 7700) * 52 / 12;
  ok(`a semana do artigo cabe na conta (${Math.round(min)} a ${Math.round(max)})`, min >= 1200 && max <= 1600 && /1\.200 a 1\.600 kcal à semana/.test(art.content));
  ok(`o mês do artigo cabe na conta (${km(min).toFixed(2)} a ${km(max).toFixed(2)})`, km(min) >= 0.69 && km(max) <= 0.91 && /0,7 e 0,9 kg/.test(art.content));
}

bloco("6. UMA FERRAMENTA POR ARTIGO");
ok("o artigo embute a calculadora de spinning", ARTIGOS_COM_CALCULADORA_SPINNING.includes("spinning-emagrece"));
ok("e saiu da calculadora de atividades", !ARTIGOS_COM_CALCULADORA_ATIVIDADES.includes("spinning-emagrece"));
ok("o spinning saiu do seletor de atividades", !ATIVIDADES.some((x) => x.id === "spinning"));
ok("o corte editorial existe no HTML renderizado", splitAtPrimeiraSecao(marked(art.content) as string) !== null);
ok("canônica e pós-resultado", CANONICA.spinning?.href === ROTA.spinning && NOME.spinning === "Calculadora de Calorias no Spinning");

bloco("7. REGISTROS E PÁGINA");
const comp = readFileSync("components/spinning/CalculadoraSpinning.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-calorias-spinning/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_SPINNING\.includes\(post\.slug\)/.test(blog) && /<CalculadoraSpinning placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-spinning/.test(readFileSync("app/ferramentas/page.tsx", "utf8")) && /calculadora-calorias-spinning/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos levam a faixa, nunca peso, watts nem visor", /band: rotuloFaixa/.test(comp) && !/trackEvent\([^)]*(peso|watts|visor)[,}\s]/.test(comp));
ok("fora do Compêndio não há resultado", /faixa\?\.met \?\? null/.test(comp));
ok("kcal com ponto de milhar", /toLocaleString\("pt-BR"\)/.test(comp) && !/\{arredondaKcal\(/.test(comp));
ok("aria-live", /aria-live="polite"/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
