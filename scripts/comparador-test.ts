/**
 * Comparador de Exercícios.  npx tsx scripts/comparador-test.ts
 */
import { readFileSync } from "fs";
import { EDITORIAL, POPULARES, chavePar, compareGoalSuitability, compareStructure, diferencas, emComum, lado, mencionaDor, normalizePair, relacao, respostaRapida, buscaComparavel, type Lado } from "../lib/treino/comparador";
import { detectaComparacao } from "../lib/treino/comparador";
import { HREF_POR_ARTIGO } from "../lib/ferramentas/relacionadas";
import { ARTIGOS_COM_COMPARADOR } from "../lib/treino/comparador";

let falhas = 0;
const check = (n: string, ok: boolean, info = "") => { console.log(`${ok ? "✓" : "✗"} ${n}${ok ? "" : " — " + info}`); if (!ok) falhas++; };
const L = (id: string) => { const l = lado(id); if (!l) throw new Error("sem " + id); return l as Lado; };

check("agachamento × leg press: parecidos (alta sobreposição, estabilidade diferente)", relacao(L("agachamento-livre"), L("leg-press")) === "parecidos", relacao(L("agachamento-livre"), L("leg-press")));
const al = compareStructure(L("agachamento-livre"), L("leg-press"));
check("agachamento × leg press: estabilidade e técnica diferem", ["Exigência de estabilidade", "Complexidade técnica", "Equipamento"].every((c) => !al.find((r) => r.criterio === c)!.igual));
check("supino barra × halteres: muito semelhantes", relacao(L("supino-reto-barra"), L("supino-reto-halter")) === "muito-semelhantes");
check("supino barra × halteres: mostra diferenças reais", diferencas(L("supino-reto-halter"), L("supino-reto-barra")).length > 0);
check("supino reto × inclinado: muito semelhantes", relacao(L("supino-reto-barra"), L("supino-inclinado-barra")) === "muito-semelhantes");
check("stiff × mesa flexora: mesmo músculo, função diferente", relacao(L("stiff"), L("mesa-flexora")) === "mesmo-musculo");
check("agachamento × cadeira extensora: mesmo músculo, função diferente", relacao(L("agachamento-livre"), L("cadeira-extensora")) === "mesmo-musculo");
const de = relacao(L("desenvolvimento-barra"), L("elevacao-lateral"));
check("desenvolvimento × elevação lateral: não são semelhantes", de === "funcoes-diferentes" || de === "mesmo-musculo", de);
check("desenvolvimento × elevação lateral: tríceps aparece só no desenvolvimento", compareStructure(L("desenvolvimento-barra"), L("elevacao-lateral")).find((r) => r.criterio === "Músculos secundários")!.a.includes("Tríceps"));
check("rosca direta × tríceps pulley: funções diferentes", relacao(L("rosca-direta"), L("triceps-pulley")) === "funcoes-diferentes");
check("rosca direta × tríceps pulley: resposta diz que não são alternativas", /não são alternativas diretas/.test(respostaRapida(L("rosca-direta"), L("triceps-pulley"))));

check("par invertido normaliza igual", chavePar("leg-press", "agachamento-livre") === chavePar("agachamento-livre", "leg-press") && normalizePair("b", "a")[0] === "a");
check("editorial achado nos dois sentidos", respostaRapida(L("leg-press"), L("agachamento-livre")) === EDITORIAL[chavePar("agachamento-livre", "leg-press")].resposta);
check("todo par editorial existe na base", Object.keys(EDITORIAL).every((k) => k.split("__").every((id) => lado(id))), Object.keys(EDITORIAL).filter((k) => !k.split("__").every((id) => lado(id))).join(","));
check("populares existem e são pares diferentes", POPULARES.every(([a, b]) => lado(a) && lado(b) && a !== b));

const txt = (a: string, b: string) => JSON.stringify([respostaRapida(L(a), L(b)), emComum(L(a), L(b)), diferencas(L(a), L(b)), diferencas(L(b), L(a)), ...["hipertrofia", "forca", "estabilidade", "pouco-equipamento", "casa", "progressao", "simples"].map((o) => compareGoalSuitability(L(a), L(b), o as never)), Object.values(EDITORIAL).map((e) => [e.resposta, e.notas])]);
const tudo = POPULARES.map(([a, b]) => txt(a, b)).join(" ") + txt("rosca-direta", "triceps-pulley");
check("nunca percentual muscular", !/\d+\s?%/.test(tudo));
check("nunca vencedor, nota ou estrela", !/vencedor|venceu|ganhou|\d+\/10|★/i.test(tudo));
check("nunca seguro/perigoso", !/perigos|mais seguro|é seguro/i.test(tudo));
check("nunca EMG como veredito", !/\bEMG\b|eletromiograf/i.test(tudo));
check("objetivo muda só o contexto", JSON.stringify(compareGoalSuitability(L("agachamento-livre"), L("leg-press"), "hipertrofia")) !== JSON.stringify(compareGoalSuitability(L("agachamento-livre"), L("leg-press"), "forca")));
check("força fala de especificidade", /especificidade/.test(compareGoalSuitability(L("barra-fixa"), L("puxada-frente"), "forca").join(" ")));

check("alias: voador acha o peck deck", buscaComparavel("voador")[0]?.id === "crucifixo-maquina");
check("alias: crossover acha o cross over", buscaComparavel("crossover")[0]?.id === "cross-over");
check("alias: hack squat", buscaComparavel("hack squat")[0]?.id === "agachamento-hack");
check("alias: pulley acha tríceps pulley", buscaComparavel("pulley").some((e) => e.id === "triceps-pulley"));
check("dor é detectada", mencionaDor("agachamento com dor no joelho") && mencionaDor("lesão") && !mencionaDor("leg press"));

const pagina = readFileSync("app/ferramentas/comparador-de-exercicios/page.tsx", "utf8");
check("canonical sem parâmetros", /canonical: `\$\{SITE_URL\}\$\{CAMINHO\}`/.test(pagina));
check("não existem rotas /comparar/* geradas", !require("fs").existsSync("app/comparar"));
const comp = readFileSync("components/comparador/Comparador.tsx", "utf8");
check("FECHAMENTO_COMPARACAO antes do WhatsApp", comp.indexOf("FECHAMENTO_COMPARACAO.titulo") > 0 && comp.indexOf("FECHAMENTO_COMPARACAO.titulo") < comp.indexOf("getWhatsAppUrl(`"));
check("artigos de comparação levam o comparador embutido", Object.entries(ARTIGOS_COM_COMPARADOR).every(([, [a, b]]) => lado(a) && lado(b) && a !== b));
for (const [s, v] of Object.entries(HREF_POR_ARTIGO).filter(([, v]) => v.href.includes("comparador"))) {
  const q = new URLSearchParams(v.href.split("?")[1]);
  if (!lado(q.get("a")!) || !lado(q.get("b")!)) check(`link do artigo ${s} aponta para exercício existente`, false, v.href);
}

const casos: [string, string | null][] = [
  ["Leg press ou agachamento?", "agachamento-livre__leg-press"],
  ["supino reto ou inclinado", "supino-inclinado-barra__supino-reto-barra"],
  ["Supino com barra ou halteres?", "supino-reto-barra__supino-reto-halter"],
  ["barra fixa ou puxada alta", "barra-fixa__puxada-frente"],
  ["stiff ou mesa flexora qual o melhor", "mesa-flexora__stiff"],
  ["hack vs leg press", "agachamento-hack__leg-press"],
  ["cadeira extensora x agachamento", "agachamento-livre__cadeira-extensora"],
  ["whey ou creatina?", null], ["treino de manhã ou à noite?", null], ["musculação ou corrida", null],
];
for (const [q, esp] of casos) { const r = detectaComparacao(q); check(`Pergunte: "${q}"`, (r ? r.join("__") : null) === esp, String(r)); }

console.log(falhas ? `\n${falhas} FALHA(S)` : "\nTODOS OS TESTES PASSARAM");
process.exit(falhas ? 1 : 0);
