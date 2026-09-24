import { existsSync, readFileSync } from "fs";
/**
 * Meu Shape em 12 Semanas: motor, regras, privacidade, página e registros.
 *   npx tsx scripts/shape12-test.ts
 */
import * as X from "../lib/simulador/shape12";
import * as S from "../lib/simulador/emagrecimento";
import { SIMULADORES } from "../lib/simuladores";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const B0: X.Perfil12 = { objetivo: "emagrecer", espelho: ["barriga"], idade: 35, sexo: "m", alturaCm: 175, pesoKg: 100, gorduraPct: null, medidas: { cintura: 105 }, experiencia: "lt6m", treinos: 3, tempo: "45a60", estruturado: "mais-ou-menos", acompanha: "mais-ou-menos", esforco: "algumas", consistHist: "75", rotina: "caminho-pouco", passos: "5a75", cardio: "nao", comida: "normal", kcalDia: null, proteinaG: null, sono: "7a8", fimSemana: "um-pouco", medicacao: "nao", hormonio: "nao", historicoPeso: "sempre" };
const PERS: [string, X.Perfil12][] = [
  ["A obesidade iniciante emagrecer", B0],
  ["B mulher recomposição glúteos", { ...B0, objetivo: "recomp", sexo: "f", alturaCm: 165, pesoKg: 62, espelho: ["gluteos"], medidas: {} }],
  ["C homem magro massa", { ...B0, objetivo: "massa", pesoKg: 60, alturaCm: 178, medidas: {} }],
  ["D avançado", { ...B0, objetivo: "recomp", experiencia: "gt4", pesoKg: 82, acompanha: "sim", estruturado: "sim", consistHist: "quase", passos: "75a10" }],
  ["E GLP-1", { ...B0, medicacao: "tirzepatida" }],
  ["F TRT", { ...B0, objetivo: "recomp", hormonio: "reposicao" }],
  ["G hormônio estético", { ...B0, objetivo: "massa", pesoKg: 80, hormonio: "desempenho" }],
  ["H baixa consistência", { ...B0, consistHist: "lt50" }],
  ["I 6 treinos e sono curto", { ...B0, treinos: 6, sono: "5a6" }],
  ["J não sabe nada", { ...B0, objetivo: "nao-sei", comida: "nao-sei", passos: "nao-sei", sono: null, fimSemana: null, medidas: {} }],
];

bloco("1. PERSONAS A–J: FINITO E COERENTE");
for (const [n, p] of PERS) {
  const r = X.projeta12(p, X.cenarioAtual12(p));
  ok(`${n}: 13 pontos finitos, faixa contém a central`, r.pontos.length === 13 && r.pontos.every((x) => [x.peso, x.min, x.max].every(Number.isFinite) && x.min <= x.peso + 1e-9 && x.max >= x.peso - 1e-9));
  ok(`${n}: realizados ≤ planejados; A ≤ B no recomeço`, r.realizados <= r.planejados && r.recomeco.largaSemana <= r.recomeco.voltaRapido);
  ok(`${n}: variação de peso plausível em 12 semanas (±12%)`, Math.abs(r.variacao12.centro) / p.pesoKg < 0.12, r.variacao12.centro.toFixed(1));
}
const r = (p: X.Perfil12) => X.projeta12(p, X.cenarioAtual12(p));
ok("emagrecer: peso cai", r(B0).variacao12.centro < -1);
ok("massa: peso sobe", r(PERS[2][1]).variacao12.centro > 0.5);
ok("recomposição: variação menor que emagrecer", Math.abs(r({ ...B0, objetivo: "recomp" }).variacao12.centro) < Math.abs(r(B0).variacao12.centro));
ok("medicação e hormônio NÃO mudam a curva", r(PERS[4][1]).pontos[12].peso === r(B0).pontos[12].peso && r({ ...B0, objetivo: "recomp", hormonio: "desempenho" }).pontos[12].peso === r({ ...B0, objetivo: "recomp" }).pontos[12].peso);
ok("usa o motor de emagrecimento (não contradiz)", Math.abs(r(B0).pontos[12].peso - S.projeta({ idade: 35, sexo: "m", alturaCm: 175, pesoKg: 100, metaKg: null, rotina: "sentado", treinos: 3, tiposTreino: ["musculacao"], passos: "5a75", kcalDia: null }, { treinos: 3, passos: 6250, consistencia: 0.75, comida: "moderado" }).pontos[12].peso) < 1e-9);

bloco("2. ARITMÉTICA DOS TREINOS E DO RECOMEÇO");
ok("48 planejados, 90% = 43", (() => { const x = X.projeta12(B0, { treinos: 4, passos: 6250, consistencia: 0.9 }); return x.planejados === 48 && x.realizados === 43; })());
ok("valor esperado de quem larga a semana: c + c² + c³", Math.abs(X.sessoesLargando(3, 0.75) - (0.75 + 0.5625 + 0.421875)) < 1e-12);
ok("consistência 100%: A = B", (() => { const x = X.projeta12(B0, { treinos: 3, passos: 6250, consistencia: 1 }); return x.recomeco.largaSemana === x.recomeco.voltaRapido; })());

bloco("3. NÃO É 'MAIS É MELHOR' / VIABILIDADE / CINTURA");
ok("I: 6 treinos + sono curto → recuperação (nunca 'treine mais')", X.diagnostico12(PERS[8][1]).gargalo === "recuperacao" && !/treine mais|mais treino é/i.test(X.diagnostico12(PERS[8][1]).primeiro));
ok("recomposição: iniciante provável, avançado lenta", r({ ...B0, objetivo: "recomp", pesoKg: 70 }).recomp === "provavel" && r(PERS[3][1]).recomp === "lenta");
ok("cintura só com medida, e só como tendência", r(PERS[2][1]).cintura === null && ["cai", "estavel", "sobe-pouco"].includes(r(B0).cintura!));
ok("massa: insight em treinos, sem passos", X.impactos12(PERS[2][1], X.cenarioAtual12(PERS[2][1])).every((i) => i.unidade === "treinos" && i.alavanca !== "passos"));

bloco("4. REGRAS DO GARGALO");
const g = (p: X.Perfil12) => X.diagnostico12(p).gargalo;
ok("perda involuntária vence tudo", g({ ...PERS[8][1], historicoPeso: "sem-querer" }) === "saude");
ok("sono curto em déficit → sono", g({ ...B0, sono: "lt5" }) === "sono");
ok("baixa consistência → consistência", g(PERS[7][1]) === "consistencia");
ok("não treina → começar (texto de iniciante)", g({ ...B0, experiencia: "nunca", estruturado: "nao-treino" }) === "treino" && /primeiro passo/i.test(X.diagnostico12({ ...B0, experiencia: "nunca", estruturado: "nao-treino" }).titulo));
ok("séries longe da falha → treino", g({ ...B0, esforco: "muitas" }) === "treino");
ok("sentado e poucos passos → movimento", g({ ...B0, rotina: "sentado", passos: "lt3", acompanha: "sim", estruturado: "sim" }) === "movimento");
ok("comida na direção errada → comida", g({ ...B0, objetivo: "massa", comida: "emagrecer", acompanha: "sim", estruturado: "sim", passos: "75a10" }) === "comida");
ok("fim de semana → fim de semana", g({ ...B0, fimSemana: "bastante", acompanha: "sim", estruturado: "sim", passos: "75a10" }) === "fim-de-semana");
ok("tudo certo → bem", g({ ...B0, acompanha: "sim", estruturado: "sim", passos: "75a10", consistHist: "quase" }) === "bem");
ok("'não sei' vira dois caminhos, sem escolher sozinho", X.caminhosSugeridos(PERS[9][1]).length === 2 && X.caminho(PERS[9][1]) === X.caminhosSugeridos(PERS[9][1])[0]);
ok("magro com 'não sei' → massa primeiro", X.caminhosSugeridos({ ...PERS[9][1], pesoKg: 58, alturaCm: 178 })[0] === "massa");

bloco("5. GUARDRAILS E DATAS");
ok("menor bloqueia", X.bloqueio12(16, false, "massa", 60, 170)?.tipo === "menor");
ok("gestação bloqueia", X.bloqueio12(30, true, "recomp", 60, 165)?.tipo === "gestacao");
ok("IMC < 18,5 querendo emagrecer bloqueia (e oferece recomposição)", X.bloqueio12(25, false, "emagrecer", 50, 175)?.tipo === "imc-baixo-emagrecer" && X.bloqueio12(25, false, "recomp", 50, 175) === null);
const cps = X.checkpoints(new Date(2026, 8, 24));
ok("checkpoints a cada 4 semanas; final em 17 de dezembro", cps.map((c) => c.semana).join() === "0,4,8,12" && X.fmtData(cps[3].data) === "17 de dezembro");

bloco("6. PRIVACIDADE E COMPONENTE");
const comp = readFileSync("components/simulador/SimuladorShape12.tsx", "utf8");
const chamadas = [...comp.matchAll(/trackEvent\(([^)]*)\)/g)].map((m) => m[1]);
ok("só eventos shape12_*", chamadas.every((c) => /"shape12_\w+"/.test(c)));
ok("nenhum evento leva dado do corpo, medicação ou hormônio", chamadas.every((c) => !/peso|altura|idade|sexo|medic|horm|gordura|cintura|kcal|prote|r\./i.test(c.replace(/"[^"]*"/g, "").replace(/`[^`]*`/g, ""))), chamadas.join(" | "));
ok("um só evento de WhatsApp (CTA de caneta não se revela)", (comp.match(/shape12_whatsapp_click/g) ?? []).length === 1);
ok("sem rede; sessionStorage; apagar", !/fetch\(|sendBeacon/.test(comp) && /sessionStorage/.test(comp) && !/localStorage/.test(comp) && /Apagar meus dados/.test(comp));
ok("WhatsApp sem dados por padrão; dados sem medicação/hormônio", /enviarDados \? msgComDados : msgPadrao/.test(comp) && !/medica|horm/i.test(comp.match(/const msgComDados = [^;]+;/)![0]));
ok("card de desafio sem dados do corpo", !/peso|kg|cintura|gordura/i.test(comp.match(/const textoShare = [^;]+;/)![0].replace(/perfil\.pesoKg/g, "")) && /não leva peso, medidas, medicação/.test(comp));
ok("etapas 3, 7 e 8 puláveis", /PULAVEIS = new Set\(\[3, 7, 8\]\)/.test(comp) && /Pular esta etapa/.test(comp));
ok("ponto de partida antes do resultado, com editar", /data-testid="ponto-de-partida"/.test(comp) && /← Editar/.test(comp));
ok("regra de ouro escrita", /Isto é uma projeção baseada nas informações que você forneceu/.test(comp));
ok("nenhuma imagem de corpo", !/<img|<Image/.test(comp));
ok("gráfico alterna peso e treinos acumulados", /"Treinos acumulados"/.test(comp) && /serieTreinos/.test(comp));
ok("fechamento do Montinho antes do botão", comp.indexOf("FECHAMENTO_COMPARACAO.paragrafos") < comp.indexOf("shape12_whatsapp_click"));
ok("linha do tempo das 12 semanas", existsSync("components/simulador/TwelveWeekTimeline.tsx") && /<TwelveWeekTimeline/.test(comp));

bloco("7. PÁGINA E REGISTROS");
const page = readFileSync("app/ferramentas/meu-shape-12-semanas/page.tsx", "utf8");
ok("um H1", (page.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = page.match(/^\s*title:\s*"([^"]+)"/m)![1];
const desc = page.match(/^\s*description:\s*\n?\s*"([^"]+)"/m)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58, titulo);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155, desc);
ok("não afirma revisão médica", /Não houve revisão médica/.test(page) && !/Revisado por/i.test(page));
ok("tabelas calculadas pelos motores", /TAB_EMAG\.map/.test(page) && /TAB_MUSC\.map/.test(page));
ok("cobre 3 meses, 90 dias e antes e depois sem fabricar", /3 meses/.test(page) && /antes e depois/i.test(page) && /não gera imagem de corpo/.test(page));
ok("trilha Ferramentas › Simuladores › página", /position: 3, name: "Simuladores"/.test(page) && /href="\/simuladores"/.test(page));
const links = [...page.matchAll(/href="(\/[^"#]+)"/g), ...comp.matchAll(/href="(\/[^"#]+)"/g)].map((m) => m[1]);
const quebrados = [...new Set(links)].filter((hf) => hf.startsWith("/blog/") ? !blogPosts.some((p) => `/blog/${p.slug}` === hf) : !(hf === "/" || existsSync(`app${hf}/page.tsx`)));
ok("todo link interno existe", quebrados.length === 0, quebrados.join(", "));
ok("registro de simuladores, catálogo, sitemap, blog, cobertura", SIMULADORES.some((s) => s.id === "shape12") && /meu-shape-12-semanas/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /meu-shape-12-semanas/.test(readFileSync("app/sitemap.ts", "utf8")) && /ARTIGOS_COM_LINK_SHAPE12\.includes/.test(readFileSync("app/blog/[slug]/page.tsx", "utf8")) && /ARTIGOS_COM_LINK_SHAPE12/.test(readFileSync("scripts/cobertura-test.ts", "utf8")));
ok("artigos do convite existem", X.ARTIGOS_COM_LINK_SHAPE12.every((s) => blogPosts.some((p) => p.slug === s)));
ok("eventos shape12_* registrados", ["shape12_view", "shape12_start", "shape12_complete", "shape12_whatsapp_click"].every((e) => readFileSync("lib/analytics.ts", "utf8").includes(`"${e}"`)));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
