/**
 * Registra uma medição e mostra a evolução entre todas as já registradas.
 *
 *   npx tsx scripts/snapshot-analytics.ts eventos.csv paginas.csv
 *
 * As datas saem do cabeçalho do próprio export do GA4, então não há como
 * rotular um período errado por engano.
 *
 * POR QUE ACUMULAR
 *
 * Uma foto isolada não responde a pergunta que interessa. "8,6% clicam no
 * WhatsApp" só vira informação ao lado do 8,6% do mês passado. Este arquivo
 * transforma cada export num ponto de série, e o histórico fica versionado
 * junto do código que gerou os números.
 *
 * O QUE ENTRA E O QUE FICA DE FORA
 *
 * Entram taxas e medianas, que sobrevivem a períodos de tamanhos
 * diferentes, e contagens absolutas sempre acompanhadas do número de dias.
 * Comparar "218 cliques em 79 dias" com "90 em 28" sem essa divisão é o erro
 * mais fácil de cometer aqui, e a tabela de evolução já mostra por dia.
 *
 * Nada de dado pessoal: o GA4 exporta agregados, e nenhum campo individual
 * atravessa para o histórico.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { blogPosts } from "../lib/blog";
import { artigoDeExecucao } from "../lib/revisao";

const HIST = "data/analytics/historico.json";

/** CSV com aspas: caminho de página pode conter vírgula. */
function csv(texto: string): string[][] {
  const linhas: string[][] = [];
  let campo = "";
  let linha: string[] = [];
  let aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ",") { linha.push(campo); campo = ""; }
    else if (c === "\n") { linha.push(campo); linhas.push(linha); linha = []; campo = ""; }
    else if (c !== "\r") campo += c;
  }
  if (campo || linha.length) { linha.push(campo); linhas.push(linha); }
  return linhas;
}

/** O GA4 escreve "# Data de início: 20260615" no topo do arquivo. */
function periodoDoCabecalho(texto: string): { inicio: string; fim: string; dias: number } {
  const pega = (rotulo: string) => {
    const m = texto.match(new RegExp(`#\\s*Data de ${rotulo}:\\s*(\\d{8})`));
    if (!m) throw new Error(`Não achei "Data de ${rotulo}" no cabeçalho do CSV.`);
    return `${m[1].slice(0, 4)}-${m[1].slice(4, 6)}-${m[1].slice(6, 8)}`;
  };
  const inicio = pega("início");
  const fim = pega("término");
  const dias = Math.round((Date.parse(fim) - Date.parse(inicio)) / 86_400_000) + 1;
  return { inicio, fim, dias };
}

interface Snapshot {
  periodo: { inicio: string; fim: string; dias: number };
  publico: { usuarios: number; visualizacoes: number; usuariosPorDia: number; paginasPorUsuario: number };
  engajamento: { engajados: number; scroll75: number; artigoLido: number };
  conversa: { cliquesWhatsapp: number; usuariosWhatsapp: number; taxaWhatsapp: number; conversoes: number };
  blog: { artigos: number; usuarios: number; conversoes: number; porCemUsuarios: number };
  leitura: { execucaoMediana: number; demaisMediana: number; distancia: number };
  blocos: Record<string, { exposicoes: number; acoes: number; taxa: number | null }>;
  ferramentas: Record<string, { viram: number; concluiram: number }>;
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Uso: npx tsx scripts/snapshot-analytics.ts <Eventos.csv> <Páginas e telas.csv>");
  process.exit(1);
}
const [arqEventos, arqPaginas] = args;
for (const a of [arqEventos, arqPaginas]) {
  if (!existsSync(a)) { console.error(`Arquivo não encontrado: ${a}`); process.exit(1); }
}

// ─── Eventos ─────────────────────────────────────────────────────────────────
const brutoEv = readFileSync(arqEventos, "utf8");
const periodo = periodoDoCabecalho(brutoEv);
const linhasEv = csv(brutoEv).filter((l) => l[0] && !l[0].startsWith("#"));
const cabEv = linhasEv[0];
const iEvC = cabEv.indexOf("Contagem de eventos");
const iEvU = cabEv.indexOf("Total de usuários");
if (iEvC < 0 || iEvU < 0) {
  console.error("Este CSV não parece ser o relatório de Eventos por nome do evento.");
  console.error("Colunas:", cabEv.join(" | "));
  process.exit(1);
}
const EV = new Map<string, { c: number; u: number }>();
for (const l of linhasEv.slice(1)) if (l[0]) EV.set(l[0], { c: +l[iEvC], u: +l[iEvU] });
const ec = (n: string) => EV.get(n)?.c ?? 0;
const eu = (n: string) => EV.get(n)?.u ?? 0;

// ─── Páginas ─────────────────────────────────────────────────────────────────
const linhasPg = csv(readFileSync(arqPaginas, "utf8")).filter((l) => l[0] && !l[0].startsWith("#"));
const cabPg = linhasPg[0];
const iU = cabPg.indexOf("Usuários ativos");
const iT = cabPg.indexOf("Tempo médio de engajamento por usuário ativo");
const iC = cabPg.indexOf("Eventos principais");
if (iU < 0 || iT < 0) {
  console.error("Este CSV não parece ser o relatório de Páginas e telas.");
  console.error("Colunas:", cabPg.join(" | "));
  process.exit(1);
}
const execucao = new Set(blogPosts.filter((p) => artigoDeExecucao(p)).map((p) => p.slug));
let conversoesTotais = 0;
const artigos: Array<{ slug: string; u: number; t: number; c: number; exec: boolean }> = [];
for (const l of linhasPg.slice(1)) {
  conversoesTotais += +l[iC] || 0;
  if (!l[0].startsWith("/blog/")) continue;
  const slug = l[0].slice(6);
  artigos.push({ slug, u: +l[iU], t: +l[iT], c: +l[iC], exec: execucao.has(slug) });
}

const mediana = (a: number[]) => {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  return Math.round((s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) * 10) / 10;
};
const arred = (n: number, casas = 1) => Math.round(n * 10 ** casas) / 10 ** casas;
const MIN = 3; /* abaixo disso é ruído, não amostra */

const usuarios = eu("page_view") || eu("session_start");
const execT = artigos.filter((a) => a.exec && a.u >= MIN).map((a) => a.t);
const outT = artigos.filter((a) => !a.exec && a.u >= MIN).map((a) => a.t);

/** Cada bloco com exposição própria: dá taxa de verdade, não número solto. */
const PARES: Array<[string, string, string]> = [
  ["sticky", "sticky_view", "sticky_click"],
  ["pos_ferramenta", "post_tool_cta_view", "post_tool_cta_click"],
  ["faq", "faq_view", "faq_open"],
  ["video", "article_video_view", "article_video_play"],
  ["cta_contextual", "contextual_cta_view", "contextual_cta_click"],
  ["fonte_preferida", "preferred_source_cta_view", "preferred_source_cta_interaction"],
];
const blocos: Snapshot["blocos"] = {};
for (const [nome, vista, acao] of PARES) {
  const v = ec(vista), a = ec(acao);
  blocos[nome] = { exposicoes: v, acoes: a, taxa: v ? arred((100 * a) / v, 1) : null };
}

const FERR: Array<[string, string, string]> = [
  ["deficit", "calorie_calculator_view", "calorie_calculator_complete"],
  ["tdee", "tdee_calculator_view", "tdee_calculator_complete"],
  ["macros", "macro_calculator_view", "macro_calculator_complete"],
  ["cardapio", "meal_planner_view", "meal_plan_generated"],
  ["volume", "training_volume_view", "training_volume_complete"],
  ["diagnostico", "diagnostic_view", "diagnostic_complete"],
  ["rotina", "routine_tool_view", "routine_tool_complete"],
  ["proteina", "protein_calculator_view", "protein_calculator_use"],
  ["onerm", "one_rm_calculator_view", "one_rm_calculator_use"],
  ["academia", "gym_finder_view", "gym_finder_complete"],
  ["alimentos", "food_search_view", "food_result_open"],
];
const ferramentas: Snapshot["ferramentas"] = {};
for (const [nome, v, c] of FERR) ferramentas[nome] = { viram: eu(v), concluiram: eu(c) };

const usuariosBlog = artigos.reduce((s, a) => s + a.u, 0);
const convBlog = artigos.reduce((s, a) => s + a.c, 0);

const snap: Snapshot = {
  periodo,
  publico: {
    usuarios,
    visualizacoes: ec("page_view"),
    usuariosPorDia: arred(usuarios / periodo.dias),
    paginasPorUsuario: usuarios ? arred(ec("page_view") / usuarios, 2) : 0,
  },
  engajamento: { engajados: eu("user_engagement"), scroll75: eu("scroll_75"), artigoLido: eu("article_read") },
  conversa: {
    cliquesWhatsapp: ec("click_whatsapp"),
    usuariosWhatsapp: eu("click_whatsapp"),
    taxaWhatsapp: usuarios ? arred((100 * eu("click_whatsapp")) / usuarios, 1) : 0,
    conversoes: conversoesTotais,
  },
  blog: {
    artigos: artigos.length,
    usuarios: usuariosBlog,
    conversoes: convBlog,
    porCemUsuarios: usuariosBlog ? arred((100 * convBlog) / usuariosBlog, 1) : 0,
  },
  leitura: {
    execucaoMediana: mediana(execT),
    demaisMediana: mediana(outT),
    distancia: arred(mediana(outT) - mediana(execT)),
  },
  blocos,
  ferramentas,
};

// ─── Grava, substituindo se o mesmo período já estiver registrado ────────────
const historico: Snapshot[] = existsSync(HIST) ? JSON.parse(readFileSync(HIST, "utf8")) : [];
const jaTem = historico.findIndex((s) => s.periodo.fim === snap.periodo.fim && s.periodo.inicio === snap.periodo.inicio);
if (jaTem >= 0) { historico[jaTem] = snap; console.log(`(período já registrado, substituído)`); }
else historico.push(snap);
historico.sort((a, b) => a.periodo.fim.localeCompare(b.periodo.fim));
writeFileSync(HIST, JSON.stringify(historico, null, 1) + "\n");
console.log(`Registrado: ${snap.periodo.inicio} a ${snap.periodo.fim} (${snap.periodo.dias} dias) → ${HIST}`);
console.log(`Histórico com ${historico.length} medição(ões).\n`);

// ─── Tabela de evolução ─────────────────────────────────────────────────────
const col = (s: Snapshot) => s.periodo.fim.slice(5).replace("-", "/");
const cabecalho = ["métrica".padEnd(34), ...historico.map((s) => col(s).padStart(11))].join("");

function linha(rotulo: string, valor: (s: Snapshot) => string) {
  console.log(rotulo.padEnd(34) + historico.map((s) => valor(s).padStart(11)).join(""));
}
function titulo(t: string) {
  console.log("\n" + t);
  console.log("-".repeat(cabecalho.length));
}

console.log("=".repeat(cabecalho.length));
console.log("EVOLUÇÃO  (colunas = data final de cada período)");
console.log("=".repeat(cabecalho.length));
console.log(cabecalho);
console.log("-".repeat(cabecalho.length));

titulo("PÚBLICO");
linha("  dias no período", (s) => String(s.periodo.dias));
linha("  usuários por dia", (s) => s.publico.usuariosPorDia.toFixed(1));
linha("  páginas por usuário", (s) => s.publico.paginasPorUsuario.toFixed(2));

titulo("CONVERSA");
linha("  % que clica no WhatsApp", (s) => s.conversa.taxaWhatsapp.toFixed(1) + "%");
linha("  cliques por dia", (s) => (s.conversa.cliquesWhatsapp / s.periodo.dias).toFixed(1));
linha("  conversões por dia", (s) => (s.conversa.conversoes / s.periodo.dias).toFixed(1));

titulo("BLOG");
linha("  conversões por 100 usuários", (s) => s.blog.porCemUsuarios.toFixed(1));
linha("  usuários por dia", (s) => (s.blog.usuarios / s.periodo.dias).toFixed(1));

titulo("TEMPO DE LEITURA (mediana, segundos)");
linha("  artigos de execução", (s) => s.leitura.execucaoMediana.toFixed(1));
linha("  demais artigos", (s) => s.leitura.demaisMediana.toFixed(1));
linha("  distância entre eles", (s) => s.leitura.distancia.toFixed(1));

titulo("TAXA DE CLIQUE DOS BLOCOS");
for (const [nome] of PARES) {
  linha("  " + nome.replace(/_/g, " "), (s) => {
    const b = s.blocos[nome];
    if (!b || !b.exposicoes) return "—";
    return `${b.taxa!.toFixed(1)}% (${b.exposicoes})`;
  });
}

titulo("FERRAMENTAS (usuários que viram → concluíram)");
for (const [nome] of FERR) {
  linha("  " + nome, (s) => {
    const f = s.ferramentas[nome];
    if (!f || (!f.viram && !f.concluiram)) return "—";
    return `${f.viram}→${f.concluiram}`;
  });
}

console.log("\n" + "-".repeat(cabecalho.length));
console.log("Contagens absolutas viram taxa por dia porque os períodos têm tamanhos");
console.log("diferentes. As colunas de bloco mostram a taxa e, entre parênteses, quantas");
console.log("exposições a sustentam: taxa com 4 exposições não é taxa, é acaso.");
console.log("");
