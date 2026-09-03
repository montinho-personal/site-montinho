/**
 * Testes da Calculadora de Zonas de Frequência Cardíaca.
 *
 * Três coisas se protegem aqui, em ordem de gravidade: a conta (uma zona
 * errada manda alguém treinar forte demais ou leve demais), a privacidade
 * (idade é dado do corpo e nunca pode sair do navegador — nem escondida num
 * parâmetro de analytics, nem no resumo da mensagem de WhatsApp) e a
 * integração (a ferramenta precisa existir em todos os lugares onde as
 * outras existem, senão vira página órfã).
 */

import { readFileSync } from "node:fs";
import { blogPosts } from "../lib/blog";
import {
  ARTIGOS_COM_CALCULADORA_FC,
  ARTIGOS_COM_LINK_FC,
  FC_REPOUSO_MAX,
  FC_REPOUSO_MIN,
  IDADE_MAX,
  IDADE_MIN,
  ZONAS,
  fcMaxima,
  fcMaximaClassica,
  parseInteiro,
  zonasEmBpm,
} from "../lib/fc";
import { ARTIGOS_COM_CALCULADORA } from "../lib/proteina";
import { ARTIGOS_COM_CALCULADORA_TDEE } from "../lib/tdee";
import { ARTIGOS_COM_CALCULADORA_DEFICIT } from "../lib/calorias";
import { ARTIGOS_COM_CALCULADORA_1RM, ARTIGOS_COM_LINK_1RM } from "../lib/onerm";
import { ARTIGOS_COM_CALCULADORA_MACROS } from "../lib/macros";
import { ARTIGOS_COM_CALCULADORA_VOLUME, ARTIGOS_COM_LINK_VOLUME } from "../lib/treino/volume";
import { ARTIGOS_COM_CALCULADORA_CARDAPIO } from "../lib/cardapio/motor";
import { ROTA, NOME, PROXIMA, blocoPosResultado } from "../lib/ferramentas/pos-resultado";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const semComents = (s: string) =>
  s.replace(/\{\/\*[\s\S]*?\*\/\}/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(?<![:\w])\/\/[^\n]*/g, " ");

bloco("A CONTA");

/** Os casos que a página e o artigo citam, verbatim. */
ok("40 anos → 180 bpm", fcMaxima(40) === 180);
ok("60 anos → 166 bpm", fcMaxima(60) === 166);
ok("20 anos → 194 bpm", fcMaxima(20) === 194);
ok("resultado é inteiro (sem falsa precisão)", Number.isInteger(fcMaxima(33)));
ok("mais idade → máxima menor", fcMaxima(30) > fcMaxima(50) && fcMaxima(50) > fcMaxima(70));
/* O motivo de Tanaka existir: a antiga subestima quem tem mais de 40. */
ok("aos 60, Tanaka dá 6 bpm a mais que 220 − idade", fcMaxima(60) - fcMaximaClassica(60) === 6);
ok("aos 30, as duas quase coincidem", Math.abs(fcMaxima(30) - fcMaximaClassica(30)) <= 3);

{
  const z = zonasEmBpm(180, null);
  ok("zona 2 para 180 de máxima: 108 a 126", z[1].de === 108 && z[1].ate === 126);
  ok("zona 5 termina na máxima", z[4].ate === 180);
  ok("zona 1 começa em 50%", z[0].de === 90);
  ok("as zonas são contíguas (o fim de uma é o começo da seguinte)",
    z.every((f, i) => i === 0 || f.de === z[i - 1].ate));
  ok("as zonas sobem", z.every((f, i) => i === 0 || f.de > z[i - 1].de));
  ok("toda zona tem largura positiva", z.every((f) => f.ate > f.de));
}
{
  /* Karvonen: com repouso 60 e máxima 180, a reserva é 120. Zona 2 = 60 + 120 × 0,6..0,7 = 132..144. */
  const k = zonasEmBpm(180, 60);
  ok("Karvonen: zona 2 para 180/60 fica em 132 a 144", k[1].de === 132 && k[1].ate === 144);
  ok("Karvonen: zona 5 ainda termina na máxima", k[4].ate === 180);
  ok("Karvonen: zona 1 começa acima do repouso", k[0].de > 60);
  ok("Karvonen sobe as zonas de quem tem repouso normal", k[1].de > zonasEmBpm(180, null)[1].de);
  ok("com repouso muito baixo, Karvonen desce as zonas",
    zonasEmBpm(180, 40)[1].de < zonasEmBpm(180, 60)[1].de);
  ok("as zonas de Karvonen continuam contíguas", k.every((f, i) => i === 0 || f.de === k[i - 1].ate));
}

ok("cinco zonas, numeradas de 1 a 5 em ordem", ZONAS.map((z) => z.numero).join("") === "12345");
ok("os percentuais cobrem 50 a 100 sem buraco",
  ZONAS[0].de === 50 && ZONAS[4].ate === 100 && ZONAS.every((z, i) => i === 0 || z.de === ZONAS[i - 1].ate));
ok("só a zona 2 tem destaque", ZONAS.filter((z) => z.destaque).map((z) => z.id).join() === "z2");
ok("toda zona tem régua da fala, serventia e exemplos",
  ZONAS.every((z) => z.fala.length > 20 && z.serve.length > 20 && z.exemplos.length > 5));

bloco("A DIGITAÇÃO");

ok('"40" → 40', parseInteiro("40") === 40);
ok('" 40 " → 40', parseInteiro(" 40 ") === 40);
ok('"40,0" → 40', parseInteiro("40,0") === 40);
ok('"40,5" não é idade', parseInteiro("40,5") === null);
ok('"abc" → null', parseInteiro("abc") === null);
ok('"" → null', parseInteiro("") === null);
ok('"0" → null', parseInteiro("0") === null);
ok("limites de idade fazem sentido", IDADE_MIN >= 5 && IDADE_MIN <= 15 && IDADE_MAX >= 90);
ok("limites de repouso fazem sentido", FC_REPOUSO_MIN <= 40 && FC_REPOUSO_MAX >= 100);

bloco("PRIVACIDADE: A IDADE NÃO SAI DO NAVEGADOR");

const comp = readFileSync("components/fc/CalculadoraFC.tsx", "utf8");
const compLimpo = semComents(comp);
{
  const chamadas = [...compLimpo.matchAll(/track(?:Event|OncePerSession)\(([\s\S]*?)\)/g)].map((m) => m[1]);
  ok(`há eventos no componente (${chamadas.length})`, chamadas.length >= 4);
  ok("nenhum evento carrega idade, repouso, fcMax ou zona",
    chamadas.every((c) => !/idade|repouso|fcMax|zona|bpm/i.test(c)), chamadas.filter((c) => /idade|repouso|fcMax|zona/i.test(c)).join(" | "));
  ok("todo evento leva só placement", chamadas.every((c) => /\{\s*placement\s*\}/.test(c)));
}
/*
 * O resumo da mensagem de WhatsApp é null de propósito: FC máxima e limite
 * de zona são função direta da idade (208 − 0,7 × idade) e a entregariam
 * de volta a quem lê a mensagem.
 */
ok("o resumo do pós-resultado é null", /resumo=\{null\}/.test(compLimpo));
ok("nenhuma chamada de rede", !/fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(compLimpo));
ok("nada gravado em storage", !/localStorage|sessionStorage|document\.cookie/.test(compLimpo));
ok("o campo de idade é numérico sem autocomplete", /inputMode="numeric"/.test(comp) && /autoComplete="off"/.test(comp));
ok("o componente diz que a idade não sai do navegador", /a idade não sai do seu navegador/.test(comp));
ok("o disclaimer manda quem tem doença cardíaca ao médico", /DISCLAIMER/.test(comp));
ok("a nota de betabloqueador aparece", /NOTA_BETABLOQUEADOR/.test(comp));

bloco("A FERRAMENTA EXISTE EM TODO LUGAR ONDE AS OUTRAS EXISTEM");

const pagina = readFileSync("app/ferramentas/zonas-de-frequencia-cardiaca/page.tsx", "utf8");
const indice = readFileSync("app/ferramentas/page.tsx", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");
const blogPage = readFileSync("app/blog/[slug]/page.tsx", "utf8");
const analytics = readFileSync("lib/analytics.ts", "utf8");
const historico = readFileSync("lib/ferramentas/historico.ts", "utf8");
const snapshot = readFileSync("scripts/snapshot-analytics.ts", "utf8");

ok("a página tem canonical para si mesma", /canonical: `\$\{SITE_URL\}\/ferramentas\/zonas-de-frequencia-cardiaca`/.test(pagina));
ok("a página tem exemplo resolvido em HTML estático (40 anos)", /EX_IDADE = 40/.test(pagina) && /zonasEmBpm\(EX_MAX, null\)/.test(pagina));
ok("a página mostra Karvonen resolvido também", /zonasEmBpm\(EX_MAX, 60\)/.test(pagina));
ok("a página explica por que não usa 220 − idade", /220 − idade/.test(pagina) && /nunca foi um estudo/.test(pagina));
ok("a página tem a régua da fala", /régua da fala/i.test(pagina));
ok("só BreadcrumbList no schema (nada inventado)", /BreadcrumbList/.test(pagina) && !/FAQPage|AggregateRating|Review/.test(pagina));
ok("está no índice de ferramentas (card)", /href: "\/ferramentas\/zonas-de-frequencia-cardiaca"/.test(indice));
ok("está no ItemList do índice", /name: "Calculadora de Zonas de Frequência Cardíaca", url: `\$\{SITE_URL\}\/ferramentas\/zonas-de-frequencia-cardiaca`/.test(indice));
ok("está no sitemap", /\/ferramentas\/zonas-de-frequencia-cardiaca`/.test(sitemap));
ok("o blog embute a calculadora nos artigos do registro", /ARTIGOS_COM_CALCULADORA_FC/.test(blogPage) && /<CalculadoraFC placement=\{post\.slug\}/.test(blogPage));
ok("o blog põe o link nos artigos do registro de link", /ARTIGOS_COM_LINK_FC\.includes\(post\.slug\) && <LinkFerramentaFC/.test(blogPage));
for (const ev of ["heart_rate_calculator_view", "heart_rate_calculator_use", "heart_rate_resting_open", "heart_rate_methodology_open", "heart_rate_article_click"]) {
  ok(`evento ${ev} declarado em lib/analytics.ts`, analytics.includes(`"${ev}"`));
}
ok("o histórico de ferramentas conhece \"fc\"", /\|\s*"fc"/.test(historico));
ok("o snapshot de analytics mede a ferramenta", /\["fc", "heart_rate_calculator_view", "heart_rate_calculator_use"\]/.test(snapshot));
ok("pós-resultado: nome, rota e próxima", NOME.fc === "Calculadora de Zonas de Frequência Cardíaca" && ROTA.fc === "/ferramentas/zonas-de-frequencia-cardiaca" && PROXIMA.fc?.ferramenta === "tdee");
{
  const b = blocoPosResultado("fc", "padrao", "whatsapp", "a", null);
  ok("a mensagem de WhatsApp não tem número nenhum", !/\d/.test(decodeURIComponent(b.href.split("text=")[1]).replace(NOME.fc, "")));
}

bloco("OS REGISTROS DE ARTIGO");

const slugs = new Set(blogPosts.map((p) => p.slug));
ok("todo artigo do registro de embed existe", ARTIGOS_COM_CALCULADORA_FC.every((s) => slugs.has(s)), ARTIGOS_COM_CALCULADORA_FC.filter((s) => !slugs.has(s)).join());
ok("todo artigo do registro de link existe", ARTIGOS_COM_LINK_FC.every((s) => slugs.has(s)), ARTIGOS_COM_LINK_FC.filter((s) => !slugs.has(s)).join());
ok("embed e link são disjuntos", ARTIGOS_COM_CALCULADORA_FC.every((s) => !ARTIGOS_COM_LINK_FC.includes(s)));
ok("o artigo da ferramenta embute a ferramenta", ARTIGOS_COM_CALCULADORA_FC.includes("zonas-de-frequencia-cardiaca"));
ok("o embed cabe no teto de oito", ARTIGOS_COM_CALCULADORA_FC.length <= 8);
/* A regra da casa: uma ferramenta por artigo. */
const outros = new Set([
  ...ARTIGOS_COM_CALCULADORA, ...ARTIGOS_COM_CALCULADORA_TDEE, ...ARTIGOS_COM_CALCULADORA_DEFICIT,
  ...ARTIGOS_COM_CALCULADORA_1RM, ...ARTIGOS_COM_LINK_1RM, ...ARTIGOS_COM_CALCULADORA_MACROS,
  ...ARTIGOS_COM_CALCULADORA_VOLUME, ...ARTIGOS_COM_LINK_VOLUME, ...ARTIGOS_COM_CALCULADORA_CARDAPIO,
]);
const colisoes = [...ARTIGOS_COM_CALCULADORA_FC, ...ARTIGOS_COM_LINK_FC].filter((s) => outros.has(s));
ok("nenhum artigo do registro tem outra ferramenta", colisoes.length === 0, colisoes.join());
ok("a caminhada japonesa fica fora (já embute o gasto) e linka no texto",
  !ARTIGOS_COM_CALCULADORA_FC.includes("caminhada-japonesa") && !ARTIGOS_COM_LINK_FC.includes("caminhada-japonesa")
  && /\/ferramentas\/zonas-de-frequencia-cardiaca/.test(blogPosts.find((p) => p.slug === "caminhada-japonesa")!.content));
/* O embed entra depois da primeira seção: o artigo precisa ter esse corte. */
for (const s of ARTIGOS_COM_CALCULADORA_FC) {
  const post = blogPosts.find((p) => p.slug === s)!;
  const corte = splitAtPrimeiraSecao(post.content);
  ok(`${s}: tem ponto de corte para o embed`, corte !== null && corte.before.length > 200);
}
{
  const art = blogPosts.find((p) => p.slug === "zonas-de-frequencia-cardiaca")!;
  ok("o artigo cita os números da calculadora (40 anos → 180, zona 2 108 a 126)", /180/.test(art.content) && /108 a 126/.test(art.content));
  ok("o artigo tem FAQ", (art.faq?.length ?? 0) >= 5);
  ok("o artigo é de 2026-09-03", art.date === "2026-09-03");
}

console.log("\n" + "=".repeat(64));
if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
console.log("TODOS OS TESTES PASSARAM");
