/**
 * Relatório de cobertura + testes do sistema de CTAs contextuais.
 *   npx tsx scripts/cta-report.ts
 *
 * Falha com código 1 se algum caso de teste quebrar, para poder virar
 * verificação de CI depois.
 */
import { blogPosts } from "../lib/blog";
import { planCTAs } from "../lib/cta/classify";
import { splitAtNaturalBreak } from "../lib/cta/placement";
import { CTA_REGISTRY } from "../lib/cta/registry";
import { CTA_OVERRIDES } from "../lib/cta/overrides";
import { marked } from "marked";

const pad = (s: string | number, n: number) => String(s).padEnd(n);
let falhas = 0;

function check(nome: string, cond: boolean, detalhe = "") {
  if (!cond) {
    falhas++;
    console.log(`  FALHOU  ${nome} ${detalhe}`);
  } else {
    console.log(`  ok      ${nome}`);
  }
}

// ---------------------------------------------------------------- cobertura
const porCluster = new Map<string, number>();
const porStage = new Map<string, number>();
const porEnd = new Map<string, number>();
const porDest = new Map<string, number>();
let comMid = 0;
let midSuprimidoPorCorte = 0;
const naoClassificados: string[] = [];

for (const p of blogPosts) {
  const plan = planCTAs(p);
  porCluster.set(plan.cluster, (porCluster.get(plan.cluster) ?? 0) + 1);
  porStage.set(plan.stage, (porStage.get(plan.stage) ?? 0) + 1);
  porEnd.set(plan.end.id, (porEnd.get(plan.end.id) ?? 0) + 1);
  porDest.set(plan.end.primary.destination, (porDest.get(plan.end.primary.destination) ?? 0) + 1);
  if (plan.cluster === "general") naoClassificados.push(p.slug);
  if (plan.mid) {
    const split = splitAtNaturalBreak(marked(p.content) as string);
    if (split) comMid++;
    else midSuprimidoPorCorte++;
  }
}

console.log("=".repeat(64));
console.log("COBERTURA —", blogPosts.length, "artigos");
console.log("=".repeat(64));
console.log("\nCLUSTERS");
[...porCluster.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
  console.log(`  ${pad(k, 18)} ${pad(v, 5)} ${((v / blogPosts.length) * 100).toFixed(1)}%`)
);
console.log("\nESTÁGIO DO FUNIL");
[...porStage.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
  console.log(`  ${pad(k, 18)} ${pad(v, 5)} ${((v / blogPosts.length) * 100).toFixed(1)}%`)
);
console.log("\nDESTINO DO CTA FINAL");
[...porDest.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
  console.log(`  ${pad(k, 18)} ${pad(v, 5)} ${((v / blogPosts.length) * 100).toFixed(1)}%`)
);
console.log("\nCTA FINAL POR ID");
[...porEnd.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
  console.log(`  ${pad(k, 18)} ${v}`)
);
console.log("\nCTA DO MEIO");
console.log(`  com CTA no meio         ${comMid}`);
console.log(`  sem ponto de corte seguro ${midSuprimidoPorCorte}`);
console.log(`  artigo curto / sem mid    ${blogPosts.length - comMid - midSuprimidoPorCorte}`);
console.log(`\nFALLBACK NEUTRO (cluster general): ${naoClassificados.length}`);
naoClassificados.slice(0, 40).forEach((s) => console.log("   ·", s));
if (naoClassificados.length > 40) console.log(`   ... e mais ${naoClassificados.length - 40}`);
console.log(`\nOVERRIDES ATIVOS: ${Object.keys(CTA_OVERRIDES).length}`);

// ------------------------------------------------------------------ amostra
console.log("\n" + "=".repeat(64));
console.log("AMOSTRA — artigo → cluster → estágio → CTA final → destino");
console.log("=".repeat(64));
const amostraDe = (nome: string, filtro: (s: string) => boolean, n: number) => {
  console.log(`\n### ${nome}`);
  blogPosts.filter((p) => filtro(p.slug)).slice(0, n).forEach((p) => {
    const pl = planCTAs(p);
    console.log(
      `  ${pad(p.slug.slice(0, 42), 44)} ${pad(pl.cluster, 15)} ${pad(pl.stage, 12)} ${pad(pl.end.id, 18)} → ${pl.end.primary.destination}`
    );
  });
};
amostraDe("emagrecimento", (s) => /emagrec|perder-peso|deficit/.test(s), 10);
amostraDe("hipertrofia", (s) => /hipertrofia|massa|series|repeticoes/.test(s), 10);
amostraDe("exercícios", (s) => /^como-fazer|rosca|supino|agachamento|remada|cadeira-/.test(s), 10);
amostraDe("dor / lesões", (s) => /dor-|lesao|tendinite|joelho|lombar|ombro/.test(s), 10);
amostraDe("local — região atendida", (s) => /alphaville|tambore|barueri|santana-de-parnaiba/.test(s), 10);
amostraDe("local — fora da região", (s) => /sorocaba|jundiai|itu|cotia|osasco|pinheiros|perdizes|higienopolis|carapicuiba|itapevi/.test(s), 10);
amostraDe("iniciantes / rotina", (s) => /iniciante|comecar|em-casa|30-minutos|frequencia/.test(s), 10);
amostraDe("GLP-1", (s) => /mounjaro|ozempic|tirzepatida|retatrutida|glp/.test(s), 6);

// -------------------------------------------------------------------- testes
console.log("\n" + "=".repeat(64));
console.log("TESTES");
console.log("=".repeat(64));

const bySlug = (s: string) => blogPosts.find((p) => p.slug === s);

// Caso A — exercício → educativo, nunca comercial
const exercicio = blogPosts.filter((p) => /^como-fazer-|^rosca-|^supino-/.test(p.slug));
check(
  "A: exercício nunca leva a WhatsApp ou consultoria",
  exercicio.every((p) => {
    const d = planCTAs(p).end.primary.destination;
    return d !== "whatsapp" && d !== "consultoria" && d !== "presencial";
  }),
  `(${exercicio.length} artigos)`
);

// Caso B — treino para emagrecer → diagnóstico
const emagrecer = blogPosts.filter((p) => /^treino-para-emagrecer|^como-emagrecer/.test(p.slug));
check(
  "B: 'treino para emagrecer' leva ao diagnóstico",
  emagrecer.length > 0 && emagrecer.every((p) => planCTAs(p).end.primary.destination === "diagnostic"),
  `(${emagrecer.length} artigos)`
);

// Caso C — local na região → presencial
const localRegiao = blogPosts.filter((p) => /^personal-trainer-(alphaville|tambore|barueri|santana)/.test(p.slug));
check(
  "C: local da região leva a presencial",
  localRegiao.length > 0 && localRegiao.every((p) => planCTAs(p).end.primary.destination === "presencial"),
  `(${localRegiao.length} artigos)`
);

// Caso D — cidade fora da região NUNCA sugere presencial
const fora = blogPosts.filter((p) =>
  /sorocaba|jundiai|-itu|cotia|granja-viana|osasco|carapicuiba|jandira|itapevi|vargem-grande|pirapora|pinheiros|perdizes|higienopolis/.test(p.slug)
);
check(
  "D: cidade fora da região nunca sugere presencial",
  fora.length > 0 && fora.every((p) => {
    const pl = planCTAs(p);
    return pl.end.primary.destination !== "presencial" && pl.end.secondary?.destination !== "presencial";
  }),
  `(${fora.length} artigos)`
);

// Caso E — fallback seguro
const fake = {
  slug: "assunto-totalmente-novo-xyz", title: "Assunto Totalmente Novo XYZ",
  excerpt: "", content: "<p>curto</p>", category: "Outros", date: "2026-01-01",
  readTime: "1 min", author: "Montinho",
} as (typeof blogPosts)[number];
const planFake = planCTAs(fake);
check("E: artigo desconhecido cai em fallback neutro", planFake.cluster === "general" && planFake.end.id === "fallback_continue");
check("E2: artigo curto não recebe CTA no meio", planFake.mid === null);

// Caso F — override vence
const ov = bySlug("vale-a-pena-contratar-personal-trainer");
check("F: override editorial vence a classificação automática", !!ov && planCTAs(ov).cluster === "service_online");

// Dedupe
check(
  "dedupe: mid e end nunca apontam para o mesmo destino",
  blogPosts.every((p) => {
    const pl = planCTAs(p);
    return !pl.mid || pl.mid.primary.destination !== pl.end.primary.destination;
  })
);
check(
  "dedupe: artigo que já tem WhatsApp no corpo não repete WhatsApp no CTA",
  blogPosts.every((p) => {
    if (!/wa\.me|api\.whatsapp/.test(p.content)) return true;
    return planCTAs(p).end.secondary?.destination !== "whatsapp";
  })
);

// Integridade do registry
check("registry: todo id é consistente com sua chave", Object.entries(CTA_REGISTRY).every(([k, v]) => k === v.id));
check(
  "registry: todo link interno aponta para rota existente",
  Object.values(CTA_REGISTRY).every((c) =>
    [c.primary, c.secondary].filter(Boolean).every((a) => a!.external || a!.href.startsWith("/"))
  )
);
check("registry: nenhum botão usa 'clique aqui' ou 'saiba mais'", Object.values(CTA_REGISTRY).every((c) =>
  !/clique aqui|saiba mais/i.test(c.primary.label + (c.secondary?.label ?? ""))
));
check("registry: nenhuma copy com promessa ou urgência falsa", Object.values(CTA_REGISTRY).every((c) =>
  !/garantid|última chance|não perca|revolucionári|em \d+ dias|urgente|agora ou/i.test(`${c.title} ${c.body}`)
));

// Posicionamento
check("placement: corte nunca cai antes de Referências/FAQ", blogPosts.slice(0, 200).every((p) => {
  const s = splitAtNaturalBreak(marked(p.content) as string);
  if (!s) return true;
  return !/^<h2[^>]*>\s*(referências|perguntas frequentes)/i.test(s.after.trim());
}));

check("todo artigo tem exatamente um CTA final", blogPosts.every((p) => !!planCTAs(p).end));

console.log("\n" + "=".repeat(64));
console.log(falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} TESTE(S) FALHARAM`);
console.log("=".repeat(64));
process.exit(falhas === 0 ? 0 : 1);
