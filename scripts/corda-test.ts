import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias Pulando Corda.
 *   npx tsx scripts/corda-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_CORDA, MET_DESCANSO, RITMOS, TREINOS, blocosValidos, calcula, descansoValido, kcalPor100Saltos,
  kcalPorMinuto, kcalSeFosseContinuo, kgPorMes, pesoValido, pulandoValido, ritmo, ritmoPelaContagem, tabelaTreinos,
} from "../lib/corda";
import { ARTIGOS_COM_LINK_ATIVIDADES, ATIVIDADES } from "../lib/atividades";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. OS METs (Compêndio de 2011), TRAVADOS");
ok("lento = 8,8 (menos de 100 saltos/min)", ritmo("lento").met === 8.8);
ok("moderado = 11,8 (100 a 120)", ritmo("moderado").met === 11.8);
ok("rápido = 12,3 (120 a 160)", ritmo("rapido").met === 12.3);
ok("descanso = 1,3 (em pé parado)", MET_DESCANSO === 1.3);
ok("ritmos em ordem de gasto", RITMOS.every((r, i) => i === 0 || r.met > RITMOS[i - 1].met));
ok("cadências dentro das faixas do Compêndio",
  ritmo("lento").saltosPorMinuto < 100 && ritmo("moderado").saltosPorMinuto >= 100 && ritmo("moderado").saltosPorMinuto <= 120
  && ritmo("rapido").saltosPorMinuto > 120 && ritmo("rapido").saltosPorMinuto <= 160);

bloco("2. A CONTA DOS BLOCOS");
const r = calcula(70, "moderado", 10, 30, 60);
ok("10 × 30 s com 60 s: 5 min pulando + 9 min parado", perto(r.minutosPulando, 5) && perto(r.minutosDescanso, 9) && perto(r.minutosTotais, 14));
ok("um bloco não tem descanso", calcula(70, "moderado", 1, 600, 60).minutosDescanso === 0);
ok("a soma das partes é o total", perto(r.kcalPulando + r.kcalDescanso, r.kcal));
ok("líquido desconta 1 MET do treino todo", perto(r.kcalLiquida, r.kcal - kcalPorMinuto(1, 70) * 14));
ok("10 min sem parar, 70 kg, moderado = 144,6 kcal", perto(calcula(70, "moderado", 1, 600, 0).kcal, 144.55));
ok("os blocos gastam bem menos que a tabela de relógio", r.kcal < kcalSeFosseContinuo(70, "moderado", r.minutosTotais) / 2);
ok("sem descanso, a conta é a da tabela", perto(calcula(70, "rapido", 1, 900, 0).kcal, kcalSeFosseContinuo(70, "rapido", 15)));
ok("saltos = cadência × minutos pulando", r.saltos === 550);
ok("kg/mês = líquido × vezes ÷ 7700 × 52/12", perto(kgPorMes(r, 3), (r.kcalLiquida * 3 / 7700) * 52 / 12));
ok("o rápido gasta mais por minuto e menos por salto", kcalPor100Saltos(70, "rapido") < kcalPor100Saltos(70, "moderado"));
ok("mil saltos, moderado, 70 kg ≈ 131 kcal", Math.round(kcalPor100Saltos(70, "moderado") * 10) === 131);

bloco("3. A CONTAGEM DE 15 SEGUNDOS");
ok("20 saltos = lento", ritmoPelaContagem(20) === "lento");
ok("25 saltos (100/min) = lento, empate fica no menor", ritmoPelaContagem(25) === "lento");
ok("28 saltos = moderado", ritmoPelaContagem(28) === "moderado");
ok("35 saltos = rápido", ritmoPelaContagem(35) === "rapido");

bloco("4. LIMITES");
ok("peso", !pesoValido(20) && pesoValido(70) && !pesoValido(300));
ok("blocos inteiros de 1 a 40", blocosValidos(1) && blocosValidos(40) && !blocosValidos(0) && !blocosValidos(2.5) && !blocosValidos(41));
ok("bloco de 10 s a 30 min", pulandoValido(10) && pulandoValido(1800) && !pulandoValido(5) && !pulandoValido(2000));
ok("descanso de 0 a 5 min", descansoValido(0) && descansoValido(300) && !descansoValido(301));

bloco("5. O ARTIGO DIZ O QUE A CALCULADORA DIZ");
const art = blogPosts.find((p) => p.slug === "pular-corda-emagrece")!;
const texto = art.content + JSON.stringify((art as { faqSchema?: unknown }).faqSchema) + JSON.stringify(art.faq);
const tab = tabelaTreinos();
ok("os treinos da calculadora são os do artigo",
  /Pule 30 segundos, descanse 60\. Repita 8 a 10 vezes/.test(art.content) && /Pule 45-60 segundos, descanse 45/.test(art.content) && /12-15 blocos/.test(art.content)
  && TREINOS[0].segundosPulando === 30 && TREINOS[0].segundosDescanso === 60 && TREINOS[1].segundosDescanso === 45);
ok(`o artigo publica ${tab.map((l) => l.kcal70).join("/")} kcal para 70 kg`,
  art.content.includes(`<strong>${tab[0].kcal70} kcal</strong> nas semanas 1 e 2`) && art.content.includes(`<strong>${tab[1].kcal70} kcal</strong> nas semanas 3 e 4`) && art.content.includes(`<strong>${tab[2].kcal70} kcal</strong> na meta`));
ok(`e ${tab.map((l) => l.kcal90).join("/")} para 90 kg`, art.content.includes(`${tab[0].kcal90}, ${tab[1].kcal90} e ${tab[2].kcal90} kcal para 90 kg`));
{
  const pm = RITMOS.map((x) => Math.round(kcalPorMinuto(x.met, 70)));
  ok(`kcal/min de 70 kg do lento ao rápido (${pm[0]} a ${pm[2]}) é o que o artigo diz`, (texto.match(/cerca de 11 a 15 kcal/g) ?? []).length >= 3 && pm[0] === 11 && pm[2] === 15);
  const dez = RITMOS.map((x) => calcula(70, x.id, 1, 600, 0).kcal);
  ok("10 minutos: 110 a 150 kcal cabem na conta", Math.abs(dez[0] - 110) <= 5 && Math.abs(dez[2] - 150) <= 5 && /cerca de 110 a 150 kcal/.test(texto));
  const trinta = [calcula(70, "lento", 1, 1800, 0).kcal, calcula(70, "moderado", 1, 1800, 0).kcal];
  ok("30 minutos sem parar: 325-435 kcal", Math.abs(trinta[0] - 325) <= 5 && Math.abs(trinta[1] - 435) <= 5 && /325-435 kcal/.test(art.content));
}
ok("o artigo não publica mais as faixas antigas", !/de 10 a 15 kcal|Entre 100 e 150 kcal|300-400 kcal/.test(texto));
ok("o artigo liga para a calculadora", art.content.includes('href="/ferramentas/calculadora-calorias-pular-corda"'));

bloco("6. UMA FERRAMENTA POR ARTIGO");
ok("o artigo embute a calculadora da corda", ARTIGOS_COM_CALCULADORA_CORDA.includes("pular-corda-emagrece"));
ok("e saiu do link da calculadora de atividades", !ARTIGOS_COM_LINK_ATIVIDADES.includes("pular-corda-emagrece"));
ok("a corda saiu do seletor de atividades", !ATIVIDADES.some((a) => a.id === "corda"));
ok("o corte editorial existe no HTML renderizado", splitAtPrimeiraSecao(marked(art.content) as string) !== null);
ok("canônica e pós-resultado", CANONICA.corda?.href === ROTA.corda && NOME.corda === "Calculadora de Calorias Pulando Corda");

bloco("7. REGISTROS E PÁGINA");
const comp = readFileSync("components/corda/CalculadoraCorda.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-calorias-pular-corda/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_CORDA\.includes\(post\.slug\)/.test(blog) && /<CalculadoraCorda placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-pular-corda/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /calculadora-calorias-pular-corda/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam o peso", !/trackEvent\([^)]*peso/.test(comp));
ok("a pergunta da frequência vem antes da área de resultado", comp.indexOf('id={idc("sem")}') > 0 && comp.indexOf('id={idc("sem")}') < comp.indexOf('aria-live="polite"'));
ok("kcal com ponto de milhar", /toLocaleString\("pt-BR"\)/.test(comp) && !/\{arredondaKcal\(/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
