import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias Subindo Escada.
 *   npx tsx scripts/escada-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_ESCADA, MET_DESCIDA, RITMOS, SITUACOES, andaresValidos, calcula, kcalPorAndar, kcalPorMes,
  kcalPorMinuto, kgPorMes, pesoValido, ritmo, subidasValidas, tabelaSituacoes,
} from "../lib/escada";
import { ARTIGOS_COM_CALCULADORA_ATIVIDADES, ARTIGOS_COM_LINK_ATIVIDADES, ATIVIDADES } from "../lib/atividades";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. OS METs (Compêndio de 2011), TRAVADOS");
ok("subir no passo do dia a dia = 4,0 (17133)", ritmo("dia").met === 4.0);
ok("subir rápido = 8,8 (17134)", ritmo("treino").met === 8.8);
ok("descer = 3,5 (17070)", MET_DESCIDA === 3.5);
ok("o ritmo de treino gasta mais por minuto", ritmo("treino").met > ritmo("dia").met);
ok("e sobe um andar mais rápido", ritmo("treino").segundosPorAndar < ritmo("dia").segundosPorAndar);

bloco("2. A CONTA DOS ANDARES");
const r = calcula(70, "dia", 2, 4, true);
ok("4 × 2 andares = 8 andares, 24 metros", r.andaresTotais === 8 && r.metros === 24);
ok("8 andares a 18 s = 2,4 min subindo; a 12 s = 1,6 min descendo", perto(r.minutosSubindo, 2.4) && perto(r.minutosDescendo, 1.6));
ok("a soma das partes é o total", perto(r.kcalSubida + r.kcalDescida, r.kcal));
ok("descer de elevador zera a descida", calcula(70, "dia", 2, 4, false).kcalDescida === 0 && calcula(70, "dia", 2, 4, false).minutosDescendo === 0);
ok("líquido desconta 1 MET do tempo todo", perto(r.kcalLiquida, r.kcal - kcalPorMinuto(1, 70) * r.minutosTotais));
ok("proporcional ao peso", perto(calcula(140, "dia", 2, 4, true).kcal, r.kcal * 2));
ok("mês = líquido × dias × 52/12", perto(kcalPorMes(r, 5), r.kcalLiquida * 5 * 52 / 12) && perto(kgPorMes(r, 5), kcalPorMes(r, 5) / 7700));
{
  /* O achado da página: a pressa gasta mais por minuto, quase o mesmo por andar. */
  const d = kcalPorAndar(70, "dia"), t = kcalPorAndar(70, "treino");
  ok(`por andar, 70 kg: ${d.toFixed(2)} no dia a dia e ${t.toFixed(2)} no treino — diferença menor que 30%`, t > d && t / d < 1.3);
  ok("e a nota da calculadora diz isso", /quase o mesmo por andar/.test(readFileSync("components/escada/CalculadoraEscada.tsx", "utf8")));
}

bloco("3. LIMITES");
ok("peso", !pesoValido(20) && pesoValido(70) && !pesoValido(300));
ok("andares inteiros de 1 a 60", andaresValidos(1) && andaresValidos(60) && !andaresValidos(0) && !andaresValidos(2.5) && !andaresValidos(61));
ok("subidas inteiras de 1 a 30", subidasValidas(1) && subidasValidas(30) && !subidasValidas(0) && !subidasValidas(31));

bloco("4. O ARTIGO DIZ O QUE A CALCULADORA DIZ");
const art = blogPosts.find((p) => p.slug === "subir-escada-emagrece")!;
const texto = art.content + JSON.stringify(art.faq);
ok("a situação 'trocar o elevador' é a do artigo (três ou quatro subidas de dois andares)",
  /Três ou quatro subidas de dois andares/.test(art.content) && SITUACOES[0].andares === 2 && SITUACOES[0].subidas === 4);
{
  const tab = tabelaSituacoes();
  ok(`o artigo publica ${tab[0].kcal70} e ${tab[0].kcal90} kcal para trocar o elevador`,
    art.content.includes(`<strong>${tab[0].kcal70} kcal por dia</strong> para quem pesa 70 kg e ${tab[0].kcal90} para 90 kg`));
  const m80 = Math.round(kcalPorMinuto(ritmo("treino").met, 80));
  ok(`80 kg em ritmo de treino: cerca de ${m80} kcal/min, como o artigo diz`, m80 === 12 && (texto.match(/cerca de 12 calorias por minuto/g) ?? []).length >= 2);
  ok("por andar, 80 kg em treino: cerca de 2 kcal", Math.round(kcalPorAndar(80, "treino")) === 2 && /Por andar, são cerca de 2 calorias/.test(texto));
  const cinco = [kcalPorMinuto(8.8, 70) * 5, kcalPorMinuto(8.8, 80) * 5];
  ok(`cinco minutos de escada: 50 a 60 kcal cabem (${Math.round(cinco[0])}–${Math.round(cinco[1])})`, cinco[0] >= 50 && cinco[1] <= 65 && /50 a 60 calorias/.test(texto));
  ok("8 a 9 METs, como o artigo diz", ritmo("treino").met >= 8 && ritmo("treino").met <= 9 && /8 a 9 METs/.test(texto));
}
ok("o artigo não publica mais a faixa antiga", !/10 a 12 calorias/.test(texto));
ok("o artigo liga para a calculadora", art.content.includes('href="/ferramentas/calculadora-calorias-escada"'));

bloco("5. UMA FERRAMENTA POR ARTIGO");
ok("o artigo embute a calculadora da escada", ARTIGOS_COM_CALCULADORA_ESCADA.includes("subir-escada-emagrece"));
ok("e saiu da calculadora de atividades", !ARTIGOS_COM_CALCULADORA_ATIVIDADES.includes("subir-escada-emagrece") && !ARTIGOS_COM_LINK_ATIVIDADES.includes("subir-escada-emagrece"));
ok("a escada saiu do seletor de atividades", !ATIVIDADES.some((a) => a.id === "escada"));
ok("o corte editorial existe no HTML renderizado", splitAtPrimeiraSecao(marked(art.content) as string) !== null);
ok("canônica e pós-resultado", CANONICA.escada?.href === ROTA.escada && NOME.escada === "Calculadora de Calorias Subindo Escada");

bloco("6. REGISTROS E PÁGINA");
const comp = readFileSync("components/escada/CalculadoraEscada.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-calorias-escada/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_ESCADA\.includes\(post\.slug\)/.test(blog) && /<CalculadoraEscada placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-escada/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /calculadora-calorias-escada/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam o peso", !/trackEvent\([^)]*peso/.test(comp));
ok("a pergunta da frequência vem antes da área de resultado", comp.indexOf('id={idc("sem")}') > 0 && comp.indexOf('id={idc("sem")}') < comp.indexOf('aria-live="polite"'));
ok("kcal com ponto de milhar", /toLocaleString\("pt-BR"\)/.test(comp) && !/\{arredondaKcal\(/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);
ok("os ritmos estão em ordem de gasto", RITMOS.every((x, i) => i === 0 || x.met > RITMOS[i - 1].met));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
