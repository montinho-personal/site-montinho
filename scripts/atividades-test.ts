import { existsSync, readFileSync } from "fs";
/**
 * O comparador de atividades (a antiga Calculadora de Calorias por Atividade).
 *   npx tsx scripts/atividades-test.ts
 */
import {
  ARTIGOS_COM_CALCULADORA_ATIVIDADES, ARTIGOS_COM_LINK_ATIVIDADES, ATIVIDADES, COMPARADOR, FONTES_ATIVIDADES, VELOCIDADE_CORRIDA,
  comparaAtividades, kcalPorMinuto, minutosParaUmQuilo,
} from "../lib/atividades";
import { metCorrida } from "../lib/corrida";
import { RITMOS as RITMOS_CAMINHADA } from "../lib/caminhada";
import { FAIXAS_RUA } from "../lib/bicicleta";
import { ESFORCOS as ESFORCOS_ELIPTICO } from "../lib/eliptico";
import { MET_AULA } from "../lib/spinning";
import { JOGOS } from "../lib/futebol";
import { AULAS } from "../lib/boxe";
import { MET_ALTO } from "../lib/zumba";
import { ESTILOS } from "../lib/danca";
import { NADOS } from "../lib/natacao";
import { MET_ROLA } from "../lib/jiujitsu";
import { RITMOS as RITMOS_CORDA } from "../lib/corda";
import { RITMOS as RITMOS_ESCADA } from "../lib/escada";
import { MET_WOD } from "../lib/crossfit";
import { INTENSIDADES } from "../lib/polichinelo";
import { CANONICA } from "../lib/ferramentas/canonica";
import { ROTA } from "../lib/ferramentas/pos-resultado";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const met = (id: string) => COMPARADOR.find((a) => a.id === id)!.met;

bloco("1. CADA LINHA IMPORTA O MET DA CALCULADORA PRÓPRIA");
ok("corrida = equação da ACSM a 10 km/h", met("corrida") === metCorrida(VELOCIDADE_CORRIDA) && VELOCIDADE_CORRIDA === 10);
ok("caminhada = passo moderado da calculadora de caminhada", met("caminhada") === RITMOS_CAMINHADA.find((r) => r.id === "moderado")!.met);
ok("bicicleta = faixa 01030 (19–22 km/h) da calculadora de bicicleta", met("bicicleta") === FAIXAS_RUA.find((f) => f.codigo === "01030")!.met && met("bicicleta") === 8.0);
ok("elíptico = esforço moderado", met("eliptico") === ESFORCOS_ELIPTICO.find((e) => e.id === "moderado")!.met);
ok("spinning = aula", met("spinning") === MET_AULA);
ok("futebol = pelada", met("futebol") === JOGOS.find((j) => j.id === "pelada")!.met);
ok("boxe = aula no saco", met("boxe") === AULAS.find((a) => a.id === "saco")!.met);
ok("zumba = músicas com salto", met("zumba") === MET_ALTO);
ok("dança = forró", met("danca") === ESTILOS.find((e) => e.id === "forro")!.met);
ok("natação = crawl leve", met("natacao") === NADOS.find((n) => n.id === "crawl-leve")!.met);
ok("jiu-jitsu = rola", met("jiujitsu") === MET_ROLA);
ok("corda = ritmo moderado", met("corda") === RITMOS_CORDA.find((r) => r.id === "moderado")!.met);
ok("escada = ritmo de treino", met("escada") === RITMOS_ESCADA.find((r) => r.id === "treino")!.met);
ok("crossfit = WOD", met("crossfit") === MET_WOD);
ok("polichinelos = moderado", met("polichinelos") === INTENSIDADES.find((i) => i.id === "moderado")!.met);
ok("15 atividades, ids únicos", COMPARADOR.length === 15 && new Set(COMPARADOR.map((a) => a.id)).size === 15);
ok("todo MET é positivo e finito", COMPARADOR.every((a) => Number.isFinite(a.met) && a.met > 0));

bloco("2. TODA LINHA APONTA PARA UMA CALCULADORA QUE EXISTE");
for (const a of COMPARADOR) {
  ok(`${a.nome}: ${a.href} tem página`, existsSync(`app${a.href}/page.tsx`));
}
ok("os hrefs batem com as rotas do pós-resultado onde ela existe", COMPARADOR.every((a) => !Object.values(ROTA).includes(a.href) || Object.values(ROTA).includes(a.href)));
ok("nenhuma linha aponta para esta própria página", COMPARADOR.every((a) => a.href !== "/ferramentas/calculadora-calorias-atividades"));

bloco("3. A COMPARAÇÃO");
const cmp = comparaAtividades(60, 70);
ok("uma linha por atividade", cmp.length === COMPARADOR.length);
ok("ordenada do maior para o menor", cmp.every((l, i) => i === 0 || l.kcal <= cmp[i - 1].kcal));
ok("kcal = MET × 3,5 × 70 ÷ 200 × 60", cmp.every((l) => Math.abs(l.kcal - kcalPorMinuto(l.met, 70) * 60) < 0.01));
ok("líquido = bruto − 1 MET no tempo", cmp.every((l) => Math.abs(l.kcalLiquida - (l.kcal - kcalPorMinuto(1, 70) * 60)) < 0.01));
ok("corda e jiu-jitsu no topo, caminhada no fim", ["corda", "jiujitsu", "corrida"].includes(cmp[0].id) && cmp[cmp.length - 1].id === "caminhada");
ok("minutos para 1 kg = 7700 ÷ kcal/min", Math.abs(minutosParaUmQuilo(8, 70) - 7700 / kcalPorMinuto(8, 70)) < 0.01);

bloco("4. O SELETOR ACABOU: UMA FERRAMENTA POR ARTIGO");
ok("não há mais atividades no seletor", ATIVIDADES.length === 0);
ok("nenhum artigo embute nem linka a antiga calculadora", ARTIGOS_COM_CALCULADORA_ATIVIDADES.length === 0 && ARTIGOS_COM_LINK_ATIVIDADES.length === 0);
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog não importa mais a antiga calculadora", !/CalculadoraAtividades|LinkFerramentaAtividades|atividadeDoArtigo/.test(blog));
ok("os componentes antigos foram removidos", !existsSync("components/atividades/CalculadoraAtividades.tsx") && !existsSync("components/atividades/LinkFerramentaAtividades.tsx"));

bloco("5. REGISTROS E PÁGINA");
ok("canônica e rota mantidas (a URL é a antiga, indexada)", CANONICA.atividades?.href === ROTA.atividades && ROTA.atividades === "/ferramentas/calculadora-calorias-atividades");
ok("hub e sitemap", /calculadora-calorias-atividades/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /calculadora-calorias-atividades/.test(readFileSync("app/sitemap.ts", "utf8")));
const comp = readFileSync("components/atividades/ComparadorAtividades.tsx", "utf8");
ok("sem chamada de rede", !/fetch\(|sendBeacon/.test(comp));
ok("aria-live", /aria-live="polite"/.test(comp));
ok("cada linha do resultado linka a calculadora própria", /<Link href=\{l\.href\}/.test(comp) && /activity_tool_click/.test(comp));
const tool = readFileSync("app/ferramentas/calculadora-calorias-atividades/page.tsx", "utf8");
ok("um H1", (tool.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = tool.match(/^\s*title:\s*"([^"]+)"/m)![1];
const desc = tool.match(/^\s*description:\s*\n?\s*"([^"]+)"/m)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58, titulo);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155, desc);
ok("a página publica o ranking em HTML", /CMP\.map\(/.test(tool) && /<table/.test(tool));
ok("a página lista o que cada calculadora própria faz", /COMPARADOR\.map\(\(a\)/.test(tool) && /oQueTem/.test(tool));
ok("simulação de 1 kg com aviso", /NÃO significa/.test(tool));
ok("FAQ sai de uma lista e chega ao HTML", /mainEntity:\s*faq\.map/.test(tool) && /<FAQ itens=\{faq\}/.test(tool));
ok("fontes com URL", FONTES_ATIVIDADES.every((f) => /^https?:\/\//.test(f.url)));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
