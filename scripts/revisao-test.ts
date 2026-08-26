/**
 * Testes da Revisão Gratuita de Execução.
 *   npx tsx scripts/revisao-test.ts
 */
import { blogPosts } from "../lib/blog";
import { artigoDeExecucao, revisaoWhatsAppUrl } from "../lib/revisao";
import { planCTAs } from "../lib/cta/classify";
import { WHATSAPP_NUMBER } from "../lib/whatsapp";

let falhas = 0;
const check = (nome: string, cond: boolean, det = "") => {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${det}`); }
  else console.log(`  ok      ${nome}`);
};
const bySlug = (s: string) => blogPosts.find((p) => p.slug === s);

console.log("ONDE O CONVITE APARECE");
const comCta = blogPosts.filter((p) => planCTAs(p, { renderEnd: false }).mid?.id === "revisao_execucao");
console.log(`  ${comCta.length} artigos de execução recebem o convite`);
check("mais de 30 artigos cobertos", comCta.length >= 30);

// Artigos de movimento nomeado devem receber.
for (const slug of ["como-fazer-agachamento-livre-corretamente", "como-fazer-rosca-direta", "como-fazer-supino-reto", "como-fazer-remada-curvada-tecnica"]) {
  const p = bySlug(slug);
  check(`recebe: ${slug}`, !!p && planCTAs(p, { renderEnd: false }).mid?.id === "revisao_execucao");
}

console.log("\nONDE NÃO PODE APARECER");
// Dor e lesão: convidar a mandar vídeo aqui seria insinuar diagnóstico.
const dor = blogPosts.filter((p) => /^dor-|lesao|tendinite|bursite|hernia/.test(p.slug));
check(
  "nenhum artigo de dor ou lesão convida a mandar vídeo",
  dor.every((p) => planCTAs(p, { renderEnd: false }).mid?.id !== "revisao_execucao"),
  `(${dor.length} artigos)`
);
check("emagrecimento não recebe (colisão com 'abdominal')", !artigoDeExecucao(bySlug("como-perder-gordura-abdominal")!));
const locais = blogPosts.filter((p) => /^personal-trainer-|^academia-/.test(p.slug));
check(
  "página local não recebe",
  locais.every((p) => planCTAs(p, { renderEnd: false }).mid?.id !== "revisao_execucao"),
  `(${locais.length} artigos)`
);

console.log("\nWHATSAPP");
const url = revisaoWhatsAppUrl();
check("usa o número oficial do site", url.includes(WHATSAPP_NUMBER));
check("abre wa.me", url.startsWith("https://wa.me/"));
check("mensagem vai codificada", url.includes("?text=") && !url.includes(" "));
const decodificada = decodeURIComponent(url.split("?text=")[1]);
check("mensagem é curta (até 160 caracteres)", decodificada.length <= 160, `(${decodificada.length})`);
check("mensagem não pede exercício, nome nem telefone",
  !/qual exercício|seu nome|seu telefone|preencha/i.test(decodificada));
console.log(`  → "${decodificada}"`);

const comArtigo = decodeURIComponent(revisaoWhatsAppUrl("Como Fazer Agachamento Livre").split("?text=")[1]);
check("versão com artigo cita o tema", comArtigo.includes("Agachamento"));
console.log(`  → "${comArtigo}"`);

console.log("\nPROMESSAS");
// O produto não pode prometer diagnóstico nem prazo que não existe.
const copy = [decodificada, comArtigo].join(" ");
check("não promete diagnóstico nem prazo", !/diagn[óo]stico|em 24h|em \d+ horas|resposta imediata|corrijo|conserto/i.test(copy));

console.log("\n" + (falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} FALHARAM`));
process.exit(falhas === 0 ? 0 : 1);
