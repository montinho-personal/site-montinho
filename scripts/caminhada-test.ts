import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias da Caminhada.
 *   npx tsx scripts/caminhada-test.ts
 *
 * O que se protege: a conta (um 200 e um 3,5 fáceis de trocar de lugar), a
 * coerência entre os modos — ida e volta devolvem o mesmo número —, a
 * inclinação (termo vertical da ACSM, que precisa dar zero no plano), os
 * METs do Compêndio copiados sem ajuste, e as promessas que a página faz
 * por escrito: nenhuma precisão falsa, nenhum quilo prometido, e um link
 * para a página canônica em todo artigo que embute a ferramenta.
 */
import {
  ARTIGOS_COM_CALCULADORA_CAMINHADA,
  ARTIGOS_COM_LINK_CAMINHADA,
  FONTES_CAMINHADA,
  INCLINACAO_MAX,
  MINUTOS_ALERTA,
  PESOS_TABELA,
  RITMOS,
  VELOCIDADE_MAX,
  VELOCIDADE_MIN,
  arredondaKcal,
  arredondaPassos,
  deDistancia,
  deKcal,
  dePassos,
  deTempo,
  formataKm,
  fraseContexto,
  inclinacaoValida,
  kcalLiquida,
  kcalPorMinuto,
  metCaminhada,
  metDaInclinacao,
  metNoPlano,
  parseNumero,
  passosValidos,
  pesoValido,
  ritmo,
  cadenciaPara,
  simulacaoUmQuilo,
  tabelaPorInclinacao,
  tabelaPorPeso,
  tabelaPorRitmo,
  tabelaPorTempo,
  velocidadeMedida,
  velocidadeValida,
} from "../lib/caminhada";
import { ARTIGOS_COM_CALCULADORA_TDEE } from "../lib/tdee";
import { ARTIGOS_COM_CALCULADORA_FC, ARTIGOS_COM_LINK_FC } from "../lib/fc";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) {
    falhas++;
    console.log(`  FALHOU  ${nome}${detalhe ? `  ${detalhe}` : ""}`);
  } else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}
const perto = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol;
const MOD = ritmo("moderado");

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. OS METs DO COMPÊNDIO, COPIADOS");

ok("quatro ritmos, em ordem de velocidade",
  RITMOS.length === 4 && RITMOS.every((r, i) => i === 0 || r.velocidade > RITMOS[i - 1].velocidade));
ok("o MET cresce com a velocidade", RITMOS.every((r, i) => i === 0 || r.met > RITMOS[i - 1].met));
ok("moderado = 3,8 METs (Compêndio 2024, 2,8–3,4 mph)", MOD.met === 3.8);
ok("rápido = 4,8 METs (3,5–3,9 mph)", ritmo("rapido").met === 4.8);
ok("leve = 3,0 METs (2,5 mph)", ritmo("leve").met === 3.0);
ok("muito rápido = 5,5 METs (4,0–4,4 mph)", ritmo("muito-rapido").met === 5.5);
ok("todo ritmo diz de onde veio o MET", RITMOS.every((r) => /Compêndio/.test(r.origem)));
ok("a cadência moderada é ~100 passos/min (Tudor-Locke)", MOD.cadencia === 100);
ok("a cadência cresce com o ritmo", RITMOS.every((r, i) => i === 0 || r.cadencia > RITMOS[i - 1].cadencia));

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. MET NO PLANO: MEDIDO NOS PONTOS, INTERPOLADO ENTRE ELES");

for (const r of RITMOS) ok(`a ${r.velocidade} km/h devolve exatamente ${r.met}`, metNoPlano(r.velocidade) === r.met);
ok("entre 5 e 6 km/h fica entre 3,8 e 4,8", metNoPlano(5.5) > 3.8 && metNoPlano(5.5) < 4.8);
ok("5,5 km/h é o meio: 4,3", perto(metNoPlano(5.5), 4.3, 0.0001));
ok("abaixo de 4 km/h segura no 3,0 (não extrapola para baixo)", metNoPlano(3) === 3.0);
ok("acima de 6,5 km/h segura no 5,5 (corrida é outra equação)", metNoPlano(7) === 5.5);
ok("os pontos medidos são reconhecidos", velocidadeMedida(5) && !velocidadeMedida(5.5));

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. A INCLINAÇÃO É O TERMO VERTICAL DA ACSM");

ok("inclinação zero soma zero", metDaInclinacao(5, 0) === 0);
/*
 * 12-3-30: 4,8 km/h = 80 m/min; 1,8 × 80 × 0,12 = 17,28 mL/kg/min = 4,937 METs.
 */
ok("4,8 km/h com 12% soma ≈ 4,94 METs", perto(metDaInclinacao(4.8, 12), 4.937, 0.01), String(metDaInclinacao(4.8, 12)));
ok("o acréscimo é proporcional à inclinação", perto(metDaInclinacao(5, 10), metDaInclinacao(5, 5) * 2, 0.0001));
ok("o acréscimo é proporcional à velocidade", perto(metDaInclinacao(6, 5), metDaInclinacao(3, 5) * 2, 0.0001));
ok("12-3-30 mais que dobra o plano", metCaminhada(4.8, 12) > 2 * metCaminhada(4.8, 0));
ok("12-3-30 fica perto dos 8 METs da subida de 6–15% do Compêndio",
  metCaminhada(4.8, 12) > 7.5 && metCaminhada(4.8, 12) < 9.5, String(metCaminhada(4.8, 12)));

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. A EQUAÇÃO DE METs E OS MODOS");

ok("3,8 MET × 70 kg = 4,655 kcal/min", perto(kcalPorMinuto(3.8, 70), 4.655, 0.0001));
const t30 = deTempo(30, 70, 5, 0, 100);
ok("30 min moderados, 70 kg ≈ 140 kcal", perto(t30.kcal, 139.65, 0.01), String(t30.kcal));
ok("30 min a 5 km/h são 2,5 km", perto(t30.km, 2.5));
ok("30 min a 100 passos/min são 3.000 passos", t30.passos === 3000);
const d = deDistancia(2.5, 70, 5, 0, 100);
ok("distância ↔ tempo concordam", perto(d.minutos, 30) && perto(d.kcal, t30.kcal));
const p = dePassos(3000, 70, 5, 0, 100);
ok("passos ↔ tempo concordam", perto(p.minutos, 30) && perto(p.kcal, t30.kcal) && p.passos === 3000);
const k = deKcal(t30.kcal, 70, 5, 0, 100);
ok("meta ↔ tempo concordam (ida e volta)", perto(k.minutos, 30) && perto(k.kcal, t30.kcal));
ok("o gasto é proporcional ao peso", perto(deTempo(30, 140, 5, 0, 100).kcal, t30.kcal * 2));
ok("o gasto é proporcional ao tempo", perto(deTempo(60, 70, 5, 0, 100).kcal, t30.kcal * 2));
ok("mais inclinação, mais gasto", deTempo(30, 70, 5, 5, 100).kcal > t30.kcal);
ok("o líquido desconta 1 MET", perto(kcalLiquida(t30, 70), t30.kcal - kcalPorMinuto(1, 70) * 30, 0.0001));
ok("o líquido é menor que o bruto e positivo", kcalLiquida(t30, 70) > 0 && kcalLiquida(t30, 70) < t30.kcal);

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. LIMITES E PARSING");

ok("aceita vírgula decimal", parseNumero("72,5") === 72.5);
ok("peso fora da faixa é inválido", !pesoValido(20) && !pesoValido(300) && pesoValido(70));
ok("velocidade: 3 a 7 km/h", velocidadeValida(VELOCIDADE_MIN) && velocidadeValida(VELOCIDADE_MAX) && !velocidadeValida(8) && !velocidadeValida(2.9));
ok("inclinação: 0 a 15%", inclinacaoValida(0) && inclinacaoValida(INCLINACAO_MAX) && !inclinacaoValida(16) && !inclinacaoValida(-1));
ok("passos precisam ser inteiros", !passosValidos(1000.5) && passosValidos(10000));
ok("o alerta de volume fica em 2 horas", MINUTOS_ALERTA === 120);

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. NENHUMA PRECISÃO FALSA");

ok("kcal ≥ 100 arredonda de 5 em 5", arredondaKcal(139.65) === 140 && arredondaKcal(142) === 140);
ok("passos ≥ 10.000 arredondam de 500 em 500", arredondaPassos(10240) === 10000 && arredondaPassos(10300) === 10500);
ok("passos entre 1.000 e 10.000 arredondam de 100 em 100", arredondaPassos(3049) === 3000);
ok("km < 1 vira metros", formataKm(0.5) === "500 m");
ok("km ≥ 1 tem uma casa", formataKm(2.5) === "2,5 km");
const frase = fraseContexto(80, deTempo(30, 80, 5, 0, 100));
ok("a frase cita o peso e o tempo", /80 kg/.test(frase) && /30 minutos/.test(frase));
ok("a frase mantém o decimal do peso", /82,5 kg/.test(fraseContexto(82.5, deTempo(30, 82.5, 5, 0, 100))));
ok("a frase concorda no singular (1 h)", /caminhada de 1 h a 5 km\/h[^.]*representa um/.test(fraseContexto(70, deTempo(60, 70, 5, 0, 100))));
ok("cadência nos pontos medidos é a do ritmo", RITMOS.every((r) => cadenciaPara(r.velocidade) === r.cadencia));
ok("cadência interpola entre ritmos", cadenciaPara(5.5) > 100 && cadenciaPara(5.5) < 115);
ok("a frase diz que é estimativa", /aproximadamente|estimad/i.test(frase));
ok("a frase não promete quilo nenhum", !/perde|perder|emagrec/i.test(frase), frase);
ok("a frase cita a inclinação quando existe", /12% de inclinação/.test(fraseContexto(70, deTempo(30, 70, 4.8, 12, 100))));

// ─── 7 ──────────────────────────────────────────────────────────────────────
bloco("7. AS TABELAS QUE O ROBÔ LÊ");

const tp = tabelaPorPeso(30, 5, 0);
ok("uma linha por peso", tp.length === PESOS_TABELA.length);
ok("o gasto cresce com o peso", tp.every((l, i) => i === 0 || l.kcal > tp[i - 1].kcal));
ok("o líquido é menor que o bruto em toda linha", tp.every((l) => l.kcalLiquida < l.kcal));
const tt = tabelaPorTempo(70, 5, 0);
ok("o gasto cresce com o tempo", tt.every((l, i) => i === 0 || l.kcal > tt[i - 1].kcal));
const tr = tabelaPorRitmo(70, 30);
ok("o gasto cresce com o ritmo", tr.every((l, i) => i === 0 || l.kcal > tr[i - 1].kcal));
const ti = tabelaPorInclinacao(70, 30, 4.8);
ok("o gasto cresce com a inclinação", ti.every((l, i) => i === 0 || l.kcal > ti[i - 1].kcal));
ok("a linha de 0% é o plano", ti[0].inclinacao === 0 && perto(ti[0].met, 3.6, 0.05));
const umQuilo = simulacaoUmQuilo(70, 5, 0, 100);
ok("1 kg de gordura em caminhada moderada leva mais de 24 h (para ninguém tentar)", umQuilo.minutos > 24 * 60);

// ─── 8 ──────────────────────────────────────────────────────────────────────
bloco("8. FONTES E REGISTROS");

ok("seis fontes, todas com URL", FONTES_CAMINHADA.length === 6 && FONTES_CAMINHADA.every((f) => /^https?:\/\//.test(f.url)));
ok("o Compêndio é a fonte dos METs", FONTES_CAMINHADA.some((f) => /Compendium/.test(f.rotulo) && /walking/.test(f.url)));
ok("Tudor-Locke é a fonte da cadência", FONTES_CAMINHADA.some((f) => /Tudor-Locke/.test(f.rotulo)));
ok("Hall (2011) corrige as 7.700 kcal", FONTES_CAMINHADA.some((f) => /Hall KD/.test(f.rotulo)));

const slugs = new Set(blogPosts.map((p) => p.slug));
ok("todo artigo dos registros existe",
  [...ARTIGOS_COM_CALCULADORA_CAMINHADA, ...ARTIGOS_COM_LINK_CAMINHADA].every((s) => slugs.has(s)));
ok("o registro de embed respeita o teto de oito", ARTIGOS_COM_CALCULADORA_CAMINHADA.length <= 8);
ok("os dois artigos de maior tráfego do cluster embutem a calculadora",
  ARTIGOS_COM_CALCULADORA_CAMINHADA.includes("quanto-tempo-de-esteira-para-emagrecer")
    && ARTIGOS_COM_CALCULADORA_CAMINHADA.includes("quanto-tempo-de-caminhada-por-dia"));
ok("embed e link são disjuntos", ARTIGOS_COM_CALCULADORA_CAMINHADA.every((s) => !ARTIGOS_COM_LINK_CAMINHADA.includes(s)));
const outros = new Set([...ARTIGOS_COM_CALCULADORA_TDEE, ...ARTIGOS_COM_CALCULADORA_FC, ...ARTIGOS_COM_LINK_FC]);
ok("nenhum artigo daqui está no TDEE ou na FC (uma ferramenta por artigo)",
  [...ARTIGOS_COM_CALCULADORA_CAMINHADA, ...ARTIGOS_COM_LINK_CAMINHADA].every((s) => !outros.has(s)));
/* Os artigos que embutem dão a conta genérica na primeira seção — é ali que a calculadora entra. */
for (const s of ARTIGOS_COM_CALCULADORA_CAMINHADA) {
  const post = blogPosts.find((p) => p.slug === s)!;
  const h2 = (post.content.match(/<h2[\s>]/g) ?? []).length;
  ok(`${s}: tem ao menos duas seções (o corte é depois da primeira)`, h2 >= 2);
}

// ─── 9 ──────────────────────────────────────────────────────────────────────
bloco("9. A FERRAMENTA ESTÁ REGISTRADA ONDE O SITE PRECISA");

ok("canônica cadastrada com a âncora de busca",
  CANONICA.caminhada?.href === "/ferramentas/calculadora-calorias-caminhada" && /Calculadora de Calorias da Caminhada/.test(CANONICA.caminhada.ancora));
ok("pós-resultado conhece a ferramenta", NOME.caminhada === "Calculadora de Calorias da Caminhada" && ROTA.caminhada === CANONICA.caminhada.href);

const pagina = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute a calculadora pelo registro", /ARTIGOS_COM_CALCULADORA_CAMINHADA\.includes\(post\.slug\)/.test(pagina) && /<CalculadoraCaminhada placement=\{post\.slug\} \/>/.test(pagina));
ok("o blog põe o convite pelo registro de link", /ARTIGOS_COM_LINK_CAMINHADA\.includes\(post\.slug\) && <LinkFerramentaCaminhada/.test(pagina));

const hub = readFileSync("app/ferramentas/page.tsx", "utf8");
ok("o hub lista a ferramenta", /\/ferramentas\/calculadora-calorias-caminhada/.test(hub));
const sitemap = readFileSync("app/sitemap.ts", "utf8");
ok("o sitemap lista a ferramenta", /calculadora-calorias-caminhada/.test(sitemap));

const comp = readFileSync("components/caminhada/CalculadoraCaminhada.tsx", "utf8");
ok("o componente não faz chamada de rede (o peso não sai do navegador)", !/fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(comp));
ok("os eventos não levam o peso", !/trackEvent\([^)]*peso/.test(comp));
ok("o resultado tem aria-live", /aria-live="polite"/.test(comp));
ok("o CTA é o bloco centralizado", /<PosResultado[\s\S]*ferramenta="caminhada"/.test(comp));
ok("o embed linka para a página completa", /Ver a calculadora completa/.test(comp));

const tool = readFileSync("app/ferramentas/calculadora-calorias-caminhada/page.tsx", "utf8");
ok("um H1 só", (tool.match(/<h1[\s>]/g) ?? []).length === 1);
ok("tabelas em HTML de verdade", (tool.match(/<table/g) ?? []).length >= 4);
ok("a simulação de 1 kg vem com o aviso", /NÃO significa/.test(tool));
ok("a página diz que os números são brutos", /brutos/.test(tool));
ok("a página linka os artigos do cluster",
  /quanto-tempo-de-esteira-para-emagrecer/.test(tool) && /quanto-tempo-de-caminhada-por-dia/.test(tool) && /10-mil-passos-por-dia-emagrece/.test(tool));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
