import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias na Zumba.
 *   npx tsx scripts/zumba-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_ZUMBA, KCAL_PROPAGANDA, MET_ALTO, MET_BAIXO, SALTOS, calcula, metDaAula,
  minutosAtePropaganda, minutosValidos, pesoValido, semana, tabelaPorFrequencia, tabelaPorPeso,
} from "../lib/zumba";
import { ARTIGOS_COM_CALCULADORA_ATIVIDADES, ATIVIDADES } from "../lib/atividades";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. OS METs, TRAVADOS (Compêndio de 2011, por decisão registrada)");
ok("baixo impacto = 5,0", MET_BAIXO === 5.0);
ok("alto impacto = 7,3", MET_ALTO === 7.3);
ok("sem salto é baixo impacto puro", metDaAula(0) === MET_BAIXO);
ok("tudo com salto é alto impacto puro", metDaAula(1) === MET_ALTO);
ok("metade é a média no tempo", perto(metDaAula(0.5), 6.15));
ok("as opções de salto vão de 0 a 1, em ordem", SALTOS[0].fracao === 0 && SALTOS[SALTOS.length - 1].fracao === 1 && SALTOS.every((s, i) => i === 0 || s.fracao > SALTOS[i - 1].fracao));
ok("toda opção tem frase própria em português", SALTOS.every((s) => s.frase.length > 10) && !SALTOS.some((s) => /todas das|nenhuma das/.test(s.frase)));

bloco("2. A CONTA");
const h = calcula(70, 60, 0.5);
ok("1 h, 70 kg, metade com salto = 452 kcal", perto(h.kcal, 452.03, 0.1));
ok("a divisão de tempo fecha", h.minutosComSalto + h.minutosSemSalto === 60);
ok("líquido desconta 1 MET", perto(h.kcalLiquida, h.kcal - 1.225 * 60));
const s3 = semana(h, 3);
ok("três aulas, conta linear", perto(s3.gramasSemana, (h.kcalLiquida * 3 / 7700) * 1000));
ok("mês = semana × 52/12", perto(s3.kgMes, s3.gramasSemana / 1000 * 52 / 12));
ok("semanas por quilo é o inverso", perto(s3.semanasPorQuilo * s3.gramasSemana, 1000, 0.5));
ok("mais aulas, mais quilos, em ordem", tabelaPorFrequencia(70).every((l, i, a) => i === 0 || l.kgMes > a[i - 1].kgMes));
ok("mais salto, mais gasto, em todo peso", tabelaPorPeso().every((l) => l.baixo < l.metade && l.metade < l.alto));

bloco("3. AS 1.000 KCAL DA PROPAGANDA");
ok("nem uma hora toda com salto chega, para 70 kg", calcula(70, 60, 1).kcal < KCAL_PROPAGANDA);
ok("seriam mais de 2 h de aula comum", minutosAtePropaganda(70, 0.5) > 120);

bloco("4. LIMITES");
ok("peso", !pesoValido(20) && pesoValido(70) && !pesoValido(300));
ok("tempo", !minutosValidos(5) && minutosValidos(60) && !minutosValidos(200));

bloco("5. O ARTIGO DIZ O QUE A CALCULADORA DIZ");
const art = blogPosts.find((p) => p.slug === "zumba-emagrece")!;
const l70 = tabelaPorPeso().find((l) => l.peso === 70)!;
ok(`"3 aulas × ~450 kcal" é a aula comum de 70 kg (${l70.metade})`, /3 aulas por semana x ~450 kcal/.test(art.content) && l70.metade === 450);
ok(`a faixa típica do artigo (350 a 600) cobre a calculadora a 70 kg (${l70.baixo} a ${l70.alto})`, /350 a 600 kcal/.test(art.content) && l70.baixo >= 350 && l70.alto <= 600);
{
  const porMin = (f: number) => calcula(70, 1, f).kcal;
  ok(`os "6 a 8 kcal por minuto" dos estudos cobrem a aula comum de 70 kg (${porMin(0.5).toFixed(1)})`, /6 a 8 kcal por minuto/.test(art.content) && porMin(0.5) >= 6 && porMin(0.5) <= 8);
}
ok("o artigo atribui os quilos à alimentação, como a calculadora", /com alimentação organizada em déficit moderado/.test(art.content));

bloco("6. UMA FERRAMENTA POR ARTIGO");
ok("o artigo embute a calculadora de zumba", ARTIGOS_COM_CALCULADORA_ZUMBA.includes("zumba-emagrece"));
ok("e saiu da calculadora de atividades", !ARTIGOS_COM_CALCULADORA_ATIVIDADES.includes("zumba-emagrece"));
ok("a zumba saiu do seletor de atividades", !ATIVIDADES.some((a) => a.id === "zumba"));
ok("o corte editorial existe no HTML renderizado", splitAtPrimeiraSecao(marked(art.content) as string) !== null);
ok("canônica e pós-resultado", CANONICA.zumba?.href === ROTA.zumba && NOME.zumba === "Calculadora de Calorias na Zumba");

bloco("7. REGISTROS E PÁGINA");
const comp = readFileSync("components/zumba/CalculadoraZumba.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-calorias-zumba/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_ZUMBA\.includes\(post\.slug\)/.test(blog) && /<CalculadoraZumba placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-zumba/.test(readFileSync("app/ferramentas/page.tsx", "utf8")) && /calculadora-calorias-zumba/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam o peso", !/trackEvent\([^)]*peso/.test(comp));
ok("a versão do Compêndio é declarada na página", /NOTA_VERSAO/.test(pag));
ok("os quilos vêm com o aviso de que são só das aulas", /NOTA_SO_AULAS/.test(comp));
ok("kcal com ponto de milhar", /toLocaleString\("pt-BR"\)/.test(comp) && !/\{arredondaKcal\(/.test(comp));
/* O pedido do responsável: a frequência é pergunta, vem antes do resultado. */
ok("a pergunta da frequência vem antes da área de resultado", comp.indexOf('id={idc("sem")}') > 0 && comp.indexOf('id={idc("sem")}') < comp.indexOf('aria-live="polite"'));
ok("aria-live", /aria-live="polite"/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
