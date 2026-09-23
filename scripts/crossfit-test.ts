import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias no CrossFit.
 *   npx tsx scripts/crossfit-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_CROSSFIT, AULAS, MET_AQUECIMENTO, MET_FORCA, MET_PARADO, MET_WOD, aulaValida, calcula, emomValido,
  fracaoTrabalho, kcalPorMinuto, kcalSeFosseTudoWod, kgPorMes, parteValida, pesoValido, tabelaAulas,
} from "../lib/crossfit";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. OS METs (Compêndio de 2011), TRAVADOS");
ok("WOD = circuito vigoroso, 8,0 (02040)", MET_WOD === 8.0);
ok("força = levantamento vigoroso, 5,0 (02052)", MET_FORCA === 5.0);
ok("aquecimento = calistenia leve, 3,5 (02030)", MET_AQUECIMENTO === 3.5);
ok("resto em pé = 1,3, o mesmo das outras calculadoras", MET_PARADO === 1.3);
ok("WOD > força > aquecimento > parado", MET_WOD > MET_FORCA && MET_FORCA > MET_AQUECIMENTO && MET_AQUECIMENTO > MET_PARADO);

bloco("2. A CONTA");
const t = calcula(70, 60, 12, 15, 15, "continuo")!;
ok("a soma das partes é o total", perto(t.kcalAquecimento + t.kcalForca + t.kcalWod + t.kcalParado, t.kcal));
ok("o que sobra da aula conta em pé: 60 − 12 − 15 − 15 = 18", perto(t.minutosParado, 18));
ok("líquido desconta 1 MET da aula toda", perto(t.kcalLiquida, t.kcal - kcalPorMinuto(1, 70) * 60));
ok("partes que não cabem na aula dão null", calcula(70, 45, 15, 20, 20, "continuo") === null);
ok("AMRAP e For time: trabalho o tempo todo", fracaoTrabalho("continuo", 40) === 1);
ok("Tabata: dois terços de trabalho", perto(fracaoTrabalho("tabata", 40), 2 / 3, 0.001));
ok("EMOM: trabalho = segundos do bloco ÷ 60", perto(fracaoTrabalho("emom", 45), 0.75));
ok("o formato contínuo gasta mais que EMOM e Tabata no mesmo tempo",
  t.kcal > calcula(70, 60, 12, 15, 15, "emom")!.kcal && t.kcal > calcula(70, 60, 12, 15, 15, "tabata")!.kcal);
ok("o WOD de 15 min faz entre 40% e 55% do gasto da aula típica", t.kcalWod / t.kcal > 0.4 && t.kcalWod / t.kcal < 0.55);
ok("uma hora de WOD = 8 METs × 60 min", perto(kcalSeFosseTudoWod(70, 60), kcalPorMinuto(8, 70) * 60));
ok("nem uma hora inteira de WOD chega a 1.000 kcal para 90 kg", kcalSeFosseTudoWod(90, 60) < 1000);
ok("kg/mês = líquido × vezes ÷ 7700 × 52/12", perto(kgPorMes(t, 3), (t.kcalLiquida * 3 / 7700) * 52 / 12));
ok("limites", !pesoValido(20) && pesoValido(70) && !aulaValida(10) && aulaValida(60) && parteValida(0) && !parteValida(61) && emomValido(40) && !emomValido(60));

bloco("3. O ARTIGO DIZ O QUE A CALCULADORA DIZ");
const art = blogPosts.find((p) => p.slug === "crossfit-emagrece")!;
ok("o artigo existe", !!art);
const texto = art.content + JSON.stringify(art.faq);
const tab = tabelaAulas();
ok(`aula típica: ${tab[0].kcal70} e ${tab[0].kcal90} kcal`, art.content.includes(`cerca de ${tab[0].kcal70} kcal para 70 kg e ${tab[0].kcal90} para 90 kg`));
ok(`EMOM: ${tab[1].kcal70} e ${tab[1].kcal90} kcal`, art.content.includes(`cerca de ${tab[1].kcal70} kcal para 70 kg e ${tab[1].kcal90} para 90 kg`));
ok(`WOD longo: ${tab[2].kcal70} e ${tab[2].kcal90} kcal`, art.content.includes(`cerca de ${tab[2].kcal70} kcal para 70 kg e ${tab[2].kcal90} para 90 kg`));
ok("a FAQ repete a aula típica e o WOD longo", texto.includes(`cerca de ${tab[0].kcal70} kcal para quem pesa 70 kg e ${tab[0].kcal90}`) && texto.includes(`cerca de ${tab[2].kcal70} e ${tab[2].kcal90}`));
{
  const pesoMil = 1000 / (kcalPorMinuto(8, 1) * 60);
  ok(`"cerca de 120 kg" para 1.000 kcal numa hora de WOD (${pesoMil.toFixed(0)})`, Math.abs(pesoMil - 120) <= 2 && /cerca de 120 kg/.test(texto));
  const dif = t.kcal - calcula(70, 60, 12, 15, 15, "emom")!.kcal;
  ok(`trocar AMRAP por EMOM tira "cerca de 40 kcal" (${dif.toFixed(0)})`, Math.abs(dif - 40) <= 5 && /cerca de 40 kcal/.test(texto));
  const tres = kgPorMes(t, 3);
  ok(`três aulas por semana: "cerca de 0,4 kg" por mês (${tres.toFixed(2)})`, Math.abs(tres - 0.4) <= 0.05 && /cerca de 0,4 kg/.test(texto));
}
ok("os tipos de aula da calculadora são os do artigo", AULAS.length === 3 && AULAS.every((a) => a.aula === 60));
ok("o artigo liga para as páginas irmãs", ["/blog/crossfit-vs-musculacao", "/blog/hiit-funciona", "/blog/deficit-calorico-como-calcular"].every((l) => art.content.includes(`href="${l}"`)));
ok("todo link interno do artigo aponta para artigo existente",
  [...art.content.matchAll(/href="\/blog\/([^"]+)"/g)].every((m) => blogPosts.some((p) => p.slug === m[1])));
ok(`título do Google até 60 (${(art.metaTitle ?? art.title).length})`, (art.metaTitle ?? art.title).length <= 60);
ok(`descrição do Google entre 120 e 160 (${(art.metaDescription ?? "").length})`, (art.metaDescription ?? "").length >= 120 && (art.metaDescription ?? "").length <= 160);
ok("tem pelo menos 5 subtítulos", (art.content.match(/<h2[\s>]/g) ?? []).length >= 5);

bloco("4. UMA FERRAMENTA POR ARTIGO");
ok("o artigo embute a calculadora de CrossFit", ARTIGOS_COM_CALCULADORA_CROSSFIT.includes("crossfit-emagrece"));
ok("o corte editorial existe no HTML renderizado", splitAtPrimeiraSecao(marked(art.content) as string) !== null);
ok("canônica e pós-resultado", CANONICA.crossfit?.href === ROTA.crossfit && NOME.crossfit === "Calculadora de Calorias no CrossFit");

bloco("5. REGISTROS E PÁGINA");
const comp = readFileSync("components/crossfit/CalculadoraCrossfit.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-calorias-crossfit/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_CROSSFIT\.includes\(post\.slug\)/.test(blog) && /<CalculadoraCrossfit placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-crossfit/.test(readFileSync("app/ferramentas/page.tsx", "utf8")) && /calculadora-calorias-crossfit/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam o peso", !/trackEvent\([^)]*peso/.test(comp));
ok("a pergunta da frequência vem antes da área de resultado", comp.indexOf('id={idc("sem")}') > 0 && comp.indexOf('id={idc("sem")}') < comp.indexOf('aria-live="polite"'));
/* Auditoria de 23/09: a frase das mil calorias repetia o resultado quando a
   aula era só WOD, e chamava de exagero quem passa mesmo de 1.000 kcal. */
ok("a frase das mil calorias só aparece com WOD menor que a aula e gasto abaixo de 1.000",
  /resultado\.minutosWod < resultado\.minutosAula && arredondaKcal\(resultado\.kcal\) < 1000/.test(comp));
ok("quem pesa muito passa mesmo de 1.000 kcal numa aula típica (250 kg)", calcula(250, 60, 12, 15, 15, "continuo")!.kcal > 1000);
ok("aquecimento e força em branco valem 0", /aquecTexto\.trim\(\) === "" \? 0/.test(comp) && /forcaTexto\.trim\(\) === "" \? 0/.test(comp));
ok("a comparação de formatos usa os segundos de EMOM da pessoa", /f\.id, emomOk && emom !== null \? emom : EMOM_PADRAO/.test(comp));
ok("partes que não cabem têm mensagem", /naoCabe/.test(comp) && /somam mais que a aula/.test(comp));
ok("kcal com ponto de milhar", /toLocaleString\("pt-BR"\)/.test(comp) && !/\{arredondaKcal\(/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
