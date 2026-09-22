import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias no Futebol.
 *   npx tsx scripts/futebol-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_FUTEBOL, JOGOS, KCAL_LATA, MET_ESPERANDO, NOTA_GOLEIRO, NOTA_REVEZAMENTO_MEDIA, calcula, formataLatas,
  MINUTOS_EM_CAMPO_ALERTA, fracaoEmCampo, jogo, minutosValidos, pesoValido, semana, tabelaPorPeso, tabelaRevezamento,
} from "../lib/futebol";
import { ARTIGOS_COM_CALCULADORA_ATIVIDADES, ATIVIDADES } from "../lib/atividades";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. OS JOGOS DO COMPÊNDIO");
/* Trava dos METs: mudar em lib/futebol.ts exige conferir a fonte e mudar aqui. */
ok("três jogos", JOGOS.length === 3);
ok("pelada = 7,0 METs", jogo("pelada").met === 7.0);
ok("futsal = 7,8 METs", jogo("futsal").met === 7.8);
ok("competitivo = 10,0 METs", jogo("competitivo").met === 10.0);
ok("lateral = 1,3 MET (em pé parado)", MET_ESPERANDO === 1.3);
ok("nenhum jogo de goleiro inventado", !JOGOS.some((j) => /goleir/i.test(j.nome + j.origem)));

bloco("2. O REVEZAMENTO");
ok("dois times jogam o tempo todo", fracaoEmCampo(2) === 1);
ok("três times: dois terços", perto(fracaoEmCampo(3), 2 / 3));
ok("quatro times: metade", fracaoEmCampo(4) === 0.5);
const r4 = calcula(80, 120, 7, 4);
ok("120 min com 4 times = 60 em campo + 60 na lateral", r4.minutosEmCampo === 60 && r4.minutosEsperando === 60);
ok("a soma das partes é o total", perto(r4.kcalEmCampo + r4.kcalEsperando, r4.kcal));
const semRev = calcula(80, 120, 7, 2);
ok("revezar sempre gasta menos que não revezar", r4.kcal < semRev.kcal && calcula(80, 120, 7, 3).kcal < semRev.kcal);
ok("mais times, menos gasto, em ordem", tabelaRevezamento(80).every((l, i, a) => i === 0 || l.kcal < a[i - 1].kcal));

bloco("3. A CONTA");
const hora70 = calcula(70, 60, 7, 2);
ok("1 h de pelada, 70 kg = 514,5 kcal", perto(hora70.kcal, 514.5));
ok("proporcional ao peso", perto(calcula(140, 60, 7, 2).kcal, hora70.kcal * 2));
ok("líquido desconta 1 MET do tempo todo", perto(hora70.kcalLiquida, hora70.kcal - 1.225 * 60));
ok("na lateral o líquido é quase zero, mas não negativo", calcula(80, 120, 7, 5).kcalLiquida > 0);
ok("latas = líquido ÷ 150", perto(hora70.latas, hora70.kcalLiquida / KCAL_LATA));
ok("futsal gasta mais que pelada, competitivo mais que os dois",
  tabelaPorPeso().every((l) => l.futsal > l.pelada && l.competitivo > l.futsal));

bloco("4. AS LATAS");
ok("arredonda para meia", formataLatas(3.3) === "3 latas e meia" && formataLatas(3.2) === "3 latas");
ok("singular", formataLatas(1) === "1 lata" && formataLatas(1.5) === "1 lata e meia");
ok("meia e menos de meia", formataLatas(0.5) === "meia lata" && formataLatas(0.1) === "menos de meia lata");

bloco("5. A SEMANA");
const s2 = semana(hora70, 2);
ok("duas peladas, o dobro", perto(s2.kcalLiquida, hora70.kcalLiquida * 2));
ok("gramas pela conta de 7.700 kcal/kg", perto(s2.gramasGordura, (s2.kcalLiquida / 7700) * 1000));

bloco("6. LIMITES");
ok("peso fora da faixa recusado", !pesoValido(20) && !pesoValido(400) && pesoValido(80));
ok("tempo fora da faixa recusado", !minutosValidos(5) && !minutosValidos(600) && minutosValidos(90));
/* A auditoria: 5 h de jogo competitivo sem revezar dava 13.125 kcal e "79 latas". */
ok("o teto é quatro horas de quadra", minutosValidos(240) && !minutosValidos(241));
ok("o pior caso aceito ainda é de corpo humano", calcula(250, 240, jogo("competitivo").met, 2).latas < 70);
ok("duas horas de bola rolando pedem conferência", /tempoAlto &&/.test(readFileSync("components/futebol/CalculadoraFutebol.tsx", "utf8")) && MINUTOS_EM_CAMPO_ALERTA === 120);
ok("pelada comum de 2 h com 3 times não dispara o aviso", calcula(80, 120, 7, 3).minutosEmCampo <= MINUTOS_EM_CAMPO_ALERTA);

bloco("7. O ARTIGO DIZ O QUE A CALCULADORA DIZ");
/*
 * A auditoria de todas as ferramentas anteriores achou o mesmo defeito: o
 * artigo publicando um número e a calculadora, logo abaixo dele, outro.
 * Aqui o artigo cita a calculadora em 70 e 90 kg; se um mudar, o teste cai.
 */
const art = blogPosts.find((p) => p.slug === "futebol-emagrece")!;
const tab = tabelaPorPeso();
const l70 = tab.find((l) => l.peso === 70)!;
const l90 = tab.find((l) => l.peso === 90)!;
for (const [nome, v] of [["pelada 70", l70.pelada], ["pelada 90", l90.pelada], ["futsal 70", l70.futsal], ["futsal 90", l90.futsal], ["competitivo 70", l70.competitivo], ["competitivo 90", l90.competitivo]] as const) {
  ok(`o artigo publica ${nome} = ${v} kcal`, art.content.includes(`${v} kcal`));
}
ok("a FAQ do artigo usa o mesmo número", art.faq!.some((f) => f.answer.includes(`${l70.pelada} kcal`) && f.answer.includes(`${l90.pelada} kcal`)));
ok("o artigo não publica mais faixa de goleiro", !/Goleiro:<\/strong> \d/.test(art.content));
ok("o artigo não diz mais que society gasta mais que futsal", !/society gasta mais que futsal/i.test(art.content + JSON.stringify(art.faq)));
ok("o artigo cita o Compêndio de 2024", /2024 Adult Compendium/.test(art.content));
ok("a nota do goleiro não dá número", !/\d+\s*kcal/.test(NOTA_GOLEIRO));

bloco("8. UMA FERRAMENTA POR ARTIGO");
ok("o artigo embute a calculadora de futebol", ARTIGOS_COM_CALCULADORA_FUTEBOL.includes("futebol-emagrece"));
ok("e saiu da calculadora de atividades", !ARTIGOS_COM_CALCULADORA_ATIVIDADES.includes("futebol-emagrece"));
ok("o futebol saiu do seletor de atividades", !ATIVIDADES.some((a) => a.id === "futebol"));
ok("o corte editorial existe no HTML renderizado", splitAtPrimeiraSecao(marked(art.content) as string) !== null);
ok("canônica e pós-resultado", CANONICA.futebol?.href === ROTA.futebol && NOME.futebol === "Calculadora de Calorias no Futebol");

bloco("9. REGISTROS E PÁGINA");
const comp = readFileSync("components/futebol/CalculadoraFutebol.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-calorias-futebol/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_FUTEBOL\.includes\(post\.slug\)/.test(blog) && /<CalculadoraFutebol placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-futebol/.test(readFileSync("app/ferramentas/page.tsx", "utf8")) && /calculadora-calorias-futebol/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam o peso", !/trackEvent\([^)]*peso/.test(comp));
ok("goleiro não recebe número de linha", /!goleiro \? calcula/.test(comp));
ok("aria-live", /aria-live="polite"/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
/* A auditoria no navegador: concordância, ponto de milhar e texto que segue a escolha. */
ok("singular concorda: 'um jogo por semana soma'", /Um jogo por semana soma"/.test(comp) && /jogos por semana somam/.test(comp));
ok("a semana fala em jogo, não em pelada, porque vale para futsal", !/peladas por semana/.test(comp));
ok("kcal da calculadora e da página com ponto de milhar", /toLocaleString\("pt-BR"\)/.test(comp) && !/\{arredondaKcal\(/.test(comp) && !/arredondaKcal\((?!n\))/.test(pag.replace(/const kc[^\n]*/, "")));
ok("a nota do revezamento não cita um número de times fixo", !/três times/.test(NOTA_REVEZAMENTO_MEDIA));
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
