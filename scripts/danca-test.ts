import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias na Dança.
 *   npx tsx scripts/danca-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_DANCA, ESTILOS, calcula, comparaEstilos, estilo, kgPorMes, minutosValidos, pesoValido, tabelaEstilos,
} from "../lib/danca";
import { tabelaPorPeso as tabelaZumba } from "../lib/zumba";
import { ritmo as ritmoCaminhada, metCaminhada } from "../lib/caminhada";
import { metCorrida } from "../lib/corrida";
import { kcalPorMinuto } from "../lib/polichinelo";
import { ARTIGOS_COM_CALCULADORA_ATIVIDADES, ATIVIDADES } from "../lib/atividades";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. OS METs (Compêndio de 2011), TRAVADOS");
const esperado: Record<string, number> = { salao: 3.0, ballet: 5.0, forro: 5.5, "ballet-fitness": 6.3, academia: 7.8, samba: 7.8 };
for (const [id, met] of Object.entries(esperado)) ok(`${id} = ${met}`, estilo(id as never).met === met);
ok("seis estilos, em ordem de gasto", ESTILOS.length === 6 && ESTILOS.every((e, i) => i === 0 || e.met >= ESTILOS[i - 1].met));
ok("forró, dança de academia e samba no pé declaram o encaixe", ["forro", "academia", "samba"].every((id) => !!estilo(id as never).encaixe));
ok("os medidos não declaram encaixe", ["salao", "ballet", "ballet-fitness"].every((id) => estilo(id as never).encaixe === null));
ok("o encaixe do samba explica que o samba do Compêndio é o de salão", /salão/.test(estilo("samba").encaixe!) && /3,0/.test(estilo("samba").encaixe!));
/* Forró e dança de academia usam os mesmos valores que a calculadora coletiva já usava para "social" e "intensa". */
ok("forró e academia são os antigos social e intensa", estilo("forro").met === 5.5 && estilo("academia").met === 7.8);

bloco("2. A CONTA");
const f = calcula(70, 60, 5.5);
ok("1 h de forró, 70 kg = 404,25", perto(f.kcal, 404.25));
ok("líquido desconta 1 MET", perto(f.kcalLiquida, f.kcal - 1.225 * 60));
ok("kg/mês = líquido × vezes ÷ 7700 × 52/12", perto(kgPorMes(f, 3), (f.kcalLiquida * 3 / 7700) * 52 / 12));
const cmp = comparaEstilos(70, 60);
ok("a comparação traz todos os estilos, do maior para o menor", cmp.length === ESTILOS.length && cmp.every((l, i) => i === 0 || l.kcal <= cmp[i - 1].kcal));
ok("peso e tempo", !pesoValido(20) && pesoValido(70) && !minutosValidos(5) && minutosValidos(60) && !minutosValidos(400));

bloco("3. O ARTIGO DIZ O QUE A CALCULADORA DIZ");
const art = blogPosts.find((p) => p.slug === "danca-emagrece")!;
const t = tabelaEstilos(60);
const k = (id: string) => t.find((l) => l.estilo.id === id)!.kcal70;
for (const id of ["academia", "samba", "ballet-fitness", "forro", "ballet", "salao"]) {
  ok(`o artigo publica ${id} = ${k(id)}`, art.content.includes(`cerca de ${k(id)}</td>`));
}
{
  const z = tabelaZumba().find((l) => l.peso === 70)!;
  ok(`a zumba do artigo vem da calculadora de zumba (${z.baixo} a ${z.alto})`, art.content.includes(`cerca de ${z.baixo} a ${z.alto}`));
  ok(`a FAQ usa a zumba comum e o funk (450 a ${k("academia")})`, art.faq!.filter((q) => new RegExp(`450 a ${k("academia")} calorias`).test(q.answer)).length === 2 && z.metade === 450);
}
{
  const cam = Math.round(kcalPorMinuto(metCaminhada(ritmoCaminhada("rapido").velocidade, 0), 70) * 60 / 5) * 5;
  const cor = Math.round(kcalPorMinuto(metCorrida(8, 0), 70) * 60 / 5) * 5;
  ok(`a caminhada rápida do artigo vem da calculadora de caminhada (${cam})`, art.content.includes(`cerca de ${cam} calorias`));
  ok(`a corrida leve do artigo vem da calculadora de corrida (${cor})`, art.content.includes(`cerca de ${cor}.`));
}
ok("o artigo não publica mais as faixas antigas", !/350 a 550|250 a 300 calorias|500 a 600\./.test(art.content + JSON.stringify(art.faq)));
ok("o artigo declara os encaixes", /O Compêndio não mede esses ritmos/.test(art.content));

bloco("4. UMA FERRAMENTA POR ARTIGO");
ok("o artigo embute a calculadora de dança", ARTIGOS_COM_CALCULADORA_DANCA.includes("danca-emagrece"));
ok("e saiu da calculadora de atividades", !ARTIGOS_COM_CALCULADORA_ATIVIDADES.includes("danca-emagrece"));
ok("a dança saiu do seletor de atividades", !ATIVIDADES.some((a) => a.id === "danca"));
ok("o corte editorial existe no HTML renderizado", splitAtPrimeiraSecao(marked(art.content) as string) !== null);
ok("canônica e pós-resultado", CANONICA.danca?.href === ROTA.danca && NOME.danca === "Calculadora de Calorias na Dança");

bloco("5. REGISTROS E PÁGINA");
const comp = readFileSync("components/danca/CalculadoraDanca.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-calorias-danca/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_DANCA\.includes\(post\.slug\)/.test(blog) && /<CalculadoraDanca placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-danca/.test(readFileSync("app/ferramentas/page.tsx", "utf8")) && /calculadora-calorias-danca/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam o peso", !/trackEvent\([^)]*peso/.test(comp));
ok("a pergunta da frequência vem antes da área de resultado", comp.indexOf('id={idc("sem")}') > 0 && comp.indexOf('id={idc("sem")}') < comp.indexOf('aria-live="polite"'));
ok("o encaixe aparece ao lado do estilo escolhido", /data-testid="encaixe"/.test(comp));
ok("a comparação de estilos está no resultado", /comparacao-estilos/.test(comp));
ok("kcal com ponto de milhar", /toLocaleString\("pt-BR"\)/.test(comp) && !/\{arredondaKcal\(/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
