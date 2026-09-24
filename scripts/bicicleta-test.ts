import { existsSync, readFileSync } from "fs";
/**
 * O motor e a página da Calculadora de Calorias na Bicicleta.
 *   npx tsx scripts/bicicleta-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_BICICLETA, CODIGO_TRABALHO, ESFORCOS, FAIXAS_RUA, FAIXAS_WATTS, MET_PARADO, MET_TRABALHO, TERRENOS, TRAJETOS,
  calcula, compara, esforco, faixaRua, kcalPorMinuto, kcalSeFosseContinuo, kgPorMes, kmValido, metDoEsforco, minutosValidos, paradoValido,
  pesoValido, tabelaRua, tabelaTrabalho, terreno, trabalho, velocidadeMedia, velocidadeValida, wattsValidos,
} from "../lib/bicicleta";
import { FAIXAS as FAIXAS_SPINNING, MET_AULA } from "../lib/spinning";
import { ARTIGOS_COM_LINK_ATIVIDADES, ATIVIDADES } from "../lib/atividades";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;
const cod = (c: string) => FAIXAS_RUA.find((f) => f.codigo === c)!;

bloco("1. OS METs (Compêndio de 2024, por código), TRAVADOS");
ok("01018 passeio lento = 3,5", cod("01018").met === 3.5);
ok("01019 passeio = 5,8", cod("01019").met === 5.8);
ok("01020 leve (16–19 km/h) = 6,8", cod("01020").met === 6.8 && cod("01020").de === 16 && cod("01020").ate === 19);
ok("01030 moderado (19–22 km/h) = 8,0", cod("01030").met === 8.0);
ok("01040 forte (22–26 km/h) = 10,0", cod("01040").met === 10.0);
ok("01050 muito forte (26+ km/h) = 12,0", cod("01050").met === 12.0);
ok("01011 ida e volta do trabalho = 6,8", MET_TRABALHO === 6.8 && CODIGO_TRABALHO === "01011");
ok("01009 mountain bike = 8,5", terreno("trilha").met === 8.5 && terreno("trilha").codigo === "01009");
ok("01003 subida forte = 14,0", terreno("subida").met === 14.0 && terreno("subida").codigo === "01003");
ok("parado = 1,3 (em pé)", MET_PARADO === 1.3);
ok("as faixas de rua sobem com a velocidade e não deixam buraco",
  FAIXAS_RUA.every((f, i) => i === 0 || (f.met > FAIXAS_RUA[i - 1].met && f.de === FAIXAS_RUA[i - 1].ate)));
ok("a ergométrica usa a MESMA escada de watts do spinning", FAIXAS_WATTS === FAIXAS_SPINNING);
ok("todo esforço aponta para uma faixa de watts que existe", ESFORCOS.every((e) => wattsValidos(e.watts)));
ok("os esforços sobem: leve < moderado < forte < muito forte",
  metDoEsforco("leve") < metDoEsforco("moderado") && metDoEsforco("moderado") < metDoEsforco("forte") && metDoEsforco("forte") < metDoEsforco("muito-forte"));
ok("moderado na ergométrica = 6,8 (90–100 W)", metDoEsforco("moderado") === 6.8 && esforco("moderado").watts === 95);

bloco("2. A VELOCIDADE");
ok("30 km em 90 min = 20 km/h", perto(velocidadeMedia(30, 90), 20));
ok("20 km/h cai em moderado", faixaRua(20)?.codigo === "01030");
ok("o limite de cima entra na faixa seguinte: 19 km/h é moderado, 18,9 é leve", faixaRua(19)?.codigo === "01030" && faixaRua(18.9)?.codigo === "01020");
ok("12 km/h é passeio; 11 é passeio lento", faixaRua(12)?.codigo === "01019" && faixaRua(11)?.codigo === "01018");
ok("40 km/h é muito forte", faixaRua(40)?.codigo === "01050");
ok("fora de 3 a 60 km/h não tem faixa", faixaRua(2) === null && faixaRua(61) === null && !velocidadeValida(2) && velocidadeValida(20));

bloco("3. A CONTA COM PARADAS");
const r = calcula(70, 8.0, 60, 10);
ok("60 min com 10 parado: 50 pedalando", r.minutosPedalando === 50 && r.minutosParado === 10 && r.minutosTotais === 60);
ok("a soma das partes é o total", perto(r.kcalPedalando + r.kcalParado, r.kcal));
ok("60 min moderado, 70 kg, sem parada = 588 kcal", perto(calcula(70, 8.0, 60).kcal, 588));
ok("com 10 min parado gasta menos que a tabela", r.kcal < kcalSeFosseContinuo(70, 8.0, 60));
ok("líquido desconta 1 MET do tempo todo", perto(r.kcalLiquida, r.kcal - kcalPorMinuto(1, 70) * 60));
ok("parado maior que o total é travado no total", calcula(70, 8.0, 30, 45).minutosPedalando === 0);
ok("kg/mês = líquido × vezes ÷ 7700 × 52/12", perto(kgPorMes(500, 3), (500 * 3 / 7700) * 52 / 12));

bloco("4. IR DE BIKE PARA O TRABALHO");
const t = trabalho(70, 8, 30, 5);
ok("ida e volta: 2 trechos por dia", perto(t.kcalPorDia, calcula(70, MET_TRABALHO, 30).kcal * 2));
ok("8 km em 30 min = 16 km/h", perto(t.velocidade, 16));
ok("5 dias: kcal/semana = 5 × dia", perto(t.kcalPorSemana, t.kcalPorDia * 5));
ok("km/mês = 8 × 2 × 5 × 52/12 ≈ 347", perto(t.kmPorMes, 8 * 2 * 5 * 52 / 12, 0.01));
ok("minutos/semana = 30 × 2 × 5", t.minutosPorSemana === 300);
ok("kg/mês pelo líquido do dia", perto(t.kgPorMes, kgPorMes(t.kcalLiquidaPorDia, 5)));
ok("o MET do trabalho não depende da velocidade", perto(trabalho(70, 8, 20, 5).kcalPorDia / 20, trabalho(70, 8, 40, 5).kcalPorDia / 40));

bloco("5. LIMITES");
ok("peso", !pesoValido(20) && pesoValido(70) && !pesoValido(300));
ok("minutos de 5 a 600", minutosValidos(5) && minutosValidos(600) && !minutosValidos(4) && !minutosValidos(601));
ok("km de 0,5 a 300", kmValido(0.5) && kmValido(300) && !kmValido(0.4) && !kmValido(301));
ok("parado de 0 a 120", paradoValido(0) && paradoValido(120) && !paradoValido(121) && !paradoValido(-1));
ok("watts só dentro da escada", wattsValidos(100) && !wattsValidos(20) && !wattsValidos(300));

bloco("6. COMPARAÇÃO E TABELAS");
const cmp = compara(70, 60);
ok("três linhas: rua, ergométrica, spinning", cmp.length === 3 && cmp.some((l) => l.id === "spinning" && l.met === MET_AULA && l.href === "/ferramentas/calculadora-calorias-spinning"));
ok("ordenada do maior para o menor", cmp.every((l, i) => i === 0 || l.kcal <= cmp[i - 1].kcal));
const tab = tabelaRua(45);
ok("tabela de rua: 5 pesos × 6 faixas, crescendo", tab.length === 5 && tab.every((l) => l.kcal.length === FAIXAS_RUA.length) && tab.every((l, i, a) => i === 0 || l.kcal[0] > a[i - 1].kcal[0]));
const tt = tabelaTrabalho();
ok("tabela do trabalho: um trajeto por linha, 90 kg gasta mais", tt.length === TRAJETOS.length && tt.every((l) => l.kcalPorDia90 > l.kcalPorDia70));
ok("terrenos: plano sem MET próprio, os outros com código", TERRENOS[0].met === null && TERRENOS.slice(1).every((x) => x.met !== null && x.codigo));

bloco("7. O ARTIGO DIZ O QUE A CALCULADORA DIZ");
const art = blogPosts.find((p) => p.slug === "bicicleta-emagrece")!;
ok("o artigo publica 200 a 500 kcal para 30 a 45 min em intensidade moderada", /Pedalar de 30 a 45 minutos em intensidade moderada queima de 200 a 500 kcal/.test(art.content));
{
  const trinta = calcula(70, cod("01030").met, 30).kcal;
  const q45 = calcula(70, cod("01030").met, 45).kcal;
  ok(`70 kg, moderado: 30 min (${Math.round(trinta)}) e 45 min (${Math.round(q45)}) caem em 200–500`, trinta >= 200 && trinta <= 500 && q45 >= 200 && q45 <= 500);
}
ok("o artigo liga para a calculadora", art.content.includes('href="/ferramentas/calculadora-calorias-bicicleta"'));
ok("o corte editorial existe (a calculadora tem onde entrar)", splitAtPrimeiraSecao(marked(art.content) as string) !== null);

bloco("8. UMA FERRAMENTA POR ARTIGO");
ok("o artigo embute a calculadora da bicicleta", ARTIGOS_COM_CALCULADORA_BICICLETA.includes("bicicleta-emagrece"));
ok("e saiu do link da calculadora de atividades", !ARTIGOS_COM_LINK_ATIVIDADES.includes("bicicleta-emagrece"));
ok("a bicicleta saiu do seletor da calculadora de atividades", !ATIVIDADES.some((a) => a.id === "bicicleta"));

bloco("9. REGISTROS, PÁGINA E COMPONENTE");
ok("canônica e pós-resultado", CANONICA.bicicleta?.href === ROTA.bicicleta && ROTA.bicicleta === "/ferramentas/calculadora-calorias-bicicleta" && NOME.bicicleta === "Calculadora de Calorias na Bicicleta");
const pagina = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute a calculadora pelo registro", /ARTIGOS_COM_CALCULADORA_BICICLETA\.includes\(post\.slug\)/.test(pagina) && /<CalculadoraBicicleta placement=\{post\.slug\} \/>/.test(pagina));
ok("hub e sitemap", /calculadora-calorias-bicicleta/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /calculadora-calorias-bicicleta/.test(readFileSync("app/sitemap.ts", "utf8")));
const compPath = "components/bicicleta/CalculadoraBicicleta.tsx";
const toolPath = "app/ferramentas/calculadora-calorias-bicicleta/page.tsx";
ok("componente e página existem", existsSync(compPath) && existsSync(toolPath));
if (existsSync(compPath) && existsSync(toolPath)) {
  const comp = readFileSync(compPath, "utf8");
  const tool = readFileSync(toolPath, "utf8");
  ok("sem chamada de rede (o peso não sai do navegador)", !/fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(comp));
  ok("os eventos não levam o peso", !/trackEvent\([^)]*peso/.test(comp));
  ok("o resultado tem aria-live", /aria-live="polite"/.test(comp));
  ok("a frequência é perguntada ANTES do resultado", comp.indexOf("Quantas vezes por semana") < comp.indexOf('aria-live="polite"'));
  ok("o CTA é o bloco centralizado", /<PosResultado[\s\S]*ferramenta="bicicleta"/.test(comp));
  ok("o embed linka para a página completa", /Ver a calculadora completa/.test(comp));
  ok("tem os três modos: rua, ergométrica e trabalho", /"rua"/.test(comp) && /"ergometrica"/.test(comp) && /"trabalho"/.test(comp));
  ok("a rua aceita velocidade OU distância e tempo", /Sei a velocidade média/.test(comp) && /Sei a distância/.test(comp));
  ok("o tempo parado é perguntado e explicado", /parado/.test(comp) && /NOTA_PARADAS/.test(comp));
  ok("um H1 só", (tool.match(/<h1[\s>]/g) ?? []).length === 1);
  const titulo = tool.match(/^\s*title:\s*"([^"]+)"/m)![1];
  const desc = tool.match(/^\s*description:\s*\n?\s*"([^"]+)"/m)![1];
  ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58, titulo);
  ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155, desc);
  ok("tabelas em HTML de verdade", (tool.match(/<table/g) ?? []).length >= 3);
  ok("FAQ sai de uma lista e chega ao HTML", /mainEntity:\s*faq\.map/.test(tool) && /<FAQ itens=\{faq\}/.test(tool));
  ok("sem estrelas nem avaliações inventadas", !/AggregateRating|"Review"|ratingValue/.test(tool + comp));
  ok("a página publica a tabela por velocidade e a do trabalho", /FAIXAS_RUA\.map/.test(tool) && /tabelaTrabalho\(\)/.test(tool));
  ok("todo link de blog da página existe", [...(tool + comp).matchAll(/href="\/blog\/([^"]+)"/g)].every((m) => blogPosts.some((p) => p.slug === m[1])));
}

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
