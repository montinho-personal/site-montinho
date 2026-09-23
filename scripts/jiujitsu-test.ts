import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias no Jiu-Jitsu.
 *   npx tsx scripts/jiujitsu-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_JIU, MET_DESCANSO, MET_ROLA, MET_TECNICA, aulaValida, calcula, descansoValido, kcalPorRolaExtra, kgPorMes,
  ROLA_EXTRA_MINIMO, pesoValido, rolaValido, rolasValidos, tabelaCenarios,
} from "../lib/jiujitsu";
import { ARTIGOS_COM_CALCULADORA_ATIVIDADES, ATIVIDADES } from "../lib/atividades";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. OS METs (Compêndio de 2011), TRAVADOS");
ok("técnica = 5,3 (15425)", MET_TECNICA === 5.3);
ok("rola = 10,3 (15430)", MET_ROLA === 10.3);
ok("descanso = 1,3 (em pé parado)", MET_DESCANSO === 1.3);
/* A auditoria: a coletiva dava 7,8 à técnica, que não é entrada de artes marciais. */
ok("a técnica não é mais 7,8", (MET_TECNICA as number) !== 7.8);

bloco("2. A CONTA");
const t = calcula(70, 75, 4, 6, 1)!;
ok("75 min com 4 rolas de 6 e 1 de descanso: 24 rola + 3 descanso + 48 técnica", t.minutosRola === 24 && t.minutosDescanso === 3 && t.minutosTecnica === 48);
ok("a soma das partes é o total", perto(t.kcalTecnica + t.kcalRola + t.kcalDescanso, t.kcal));
ok("líquido desconta 1 MET da aula toda", perto(t.kcalLiquida, t.kcal - 1.225 * 75));
ok("um rola não tem descanso", calcula(70, 60, 1, 6, 1)!.minutosDescanso === 0);
ok("zero rola é só técnica", calcula(70, 60, 0, 6, 1)!.minutosTecnica === 60);
ok("rolas que não cabem na aula dão null", calcula(70, 45, 10, 6, 1) === null);
{
  /* Um rola a mais na mesma aula soma exatamente o que a função diz. */
  const a = calcula(70, 75, 4, 6, 1)!, b = calcula(70, 75, 5, 6, 1)!;
  ok(`um rola a mais soma ${Math.round(kcalPorRolaExtra(70, 6, 1))} kcal`, perto(b.kcal - a.kcal, kcalPorRolaExtra(70, 6, 1)));
  ok("e é pouco: menos de 50 kcal para 70 kg", kcalPorRolaExtra(70, 6, 1) < 50);
}
/* A auditoria: rola curto com descanso longo deixava a frase em "−12 kcal". */
ok("rola de 2 min com 5 de descanso reduz o total, e a calculadora não chama isso de soma",
  kcalPorRolaExtra(70, 2, 5) < 0 && /extra >= ROLA_EXTRA_MINIMO/.test(readFileSync("components/jiujitsu/CalculadoraJiuJitsu.tsx", "utf8")));
ok("o caso comum ainda mostra a soma", kcalPorRolaExtra(70, 6, 1) >= ROLA_EXTRA_MINIMO);
ok("mais rolas, mais gasto, na mesma aula", calcula(70, 75, 5, 6, 1)!.kcal > t.kcal);
ok("kg/mês = líquido × vezes ÷ 7700 × 52/12", perto(kgPorMes(t, 3), (t.kcalLiquida * 3 / 7700) * 52 / 12));
ok("limites", !pesoValido(20) && pesoValido(70) && !aulaValida(10) && aulaValida(75) && rolasValidos(0) && !rolasValidos(2.5) && !rolasValidos(20) && rolaValido(6) && !rolaValido(1) && descansoValido(0) && !descansoValido(6));

bloco("3. O ARTIGO DIZ O QUE A CALCULADORA DIZ");
const art = blogPosts.find((p) => p.slug === "jiu-jitsu-emagrece")!;
const tab = tabelaCenarios();
for (const l of tab) {
  ok(`${l.cenario.id}: ${l.kcal70} e ${l.kcal90.toLocaleString("pt-BR")} kcal no artigo`,
    art.content.includes(`cerca de ${l.kcal70} kcal para 70 kg e ${l.kcal90.toLocaleString("pt-BR")} para 90 kg`));
}
ok(`a FAQ publica a faixa de 70 kg (${tab[0].kcal70} a ${tab[2].kcal70})`, art.faq!.some((f) => f.answer.includes(`cerca de ${tab[0].kcal70} a ${tab[2].kcal70} kcal`)));
ok("o artigo não publica mais as faixas antigas", !/300 a 450 kcal|450 a 700 kcal|700 a 1\.000 kcal|entre 400 e 800 kcal/.test(art.content + JSON.stringify(art.faq)));

bloco("4. UMA FERRAMENTA POR ARTIGO");
ok("o artigo embute a calculadora de jiu-jitsu", ARTIGOS_COM_CALCULADORA_JIU.includes("jiu-jitsu-emagrece"));
ok("e saiu da calculadora de atividades", !ARTIGOS_COM_CALCULADORA_ATIVIDADES.includes("jiu-jitsu-emagrece"));
ok("o jiu-jitsu saiu do seletor de atividades", !ATIVIDADES.some((a) => a.id === "jiu-jitsu"));
ok("o corte editorial existe no HTML renderizado", splitAtPrimeiraSecao(marked(art.content) as string) !== null);
ok("canônica e pós-resultado", CANONICA.jiujitsu?.href === ROTA.jiujitsu && NOME.jiujitsu === "Calculadora de Calorias no Jiu-Jitsu");

bloco("5. REGISTROS E PÁGINA");
const comp = readFileSync("components/jiujitsu/CalculadoraJiuJitsu.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-calorias-jiu-jitsu/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_JIU\.includes\(post\.slug\)/.test(blog) && /<CalculadoraJiuJitsu placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-jiu-jitsu/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /calculadora-calorias-jiu-jitsu/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam o peso", !/trackEvent\([^)]*peso/.test(comp));
ok("a pergunta da frequência vem antes da área de resultado", comp.indexOf('id={idc("sem")}') > 0 && comp.indexOf('id={idc("sem")}') < comp.indexOf('aria-live="polite"'));
ok("rolas que não cabem têm mensagem", /naoCabe/.test(comp) && /não cabem nessa aula/.test(comp));
ok("kcal com ponto de milhar", /toLocaleString\("pt-BR"\)/.test(comp) && !/\{arredondaKcal\(/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
