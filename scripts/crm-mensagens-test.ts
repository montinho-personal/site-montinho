/**
 * Testes do reconhecimento de mensagens do WhatsApp no CRM.
 *   npx tsx scripts/crm-mensagens-test.ts
 *
 * Duas coisas são protegidas aqui. A primeira é a leitura: com ou sem Ref,
 * com aspas trocadas pelo celular, com texto extra da pessoa. A segunda é
 * que o catálogo em lib/crm/mensagens.ts não descole das frases reais do
 * site — o teste lê os arquivos que geram as mensagens e confere que cada
 * frase fixa de lá é reconhecida aqui.
 */
import * as fs from "fs";
import { identificarMensagem, extrairRef, handoffCompativel, detalheDaIdentificacao, reconheceInicio, limparColagem } from "../lib/crm/mensagens";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));

bloco("1. REF");
ok("acha o Ref no fim da mensagem", extrairRef("Olá, Montinho! Quero começar. Ref: 8BXWH") === "8BXWH");
ok("aceita minúsculas e sem dois-pontos", extrairRef("ref 8bxwh") === "8BXWH");
ok("não inventa Ref de palavra comum", extrairRef("Olá, Montinho! Vim pelo site.") === null);

bloco("2. FRASES DO SITE");
const hero = identificarMensagem("Olá, Montinho! Vi a página da Consultoria Online e queria entender se ela faz sentido para o meu caso. Ref: 8BXWH");
ok("hero da consultoria: origem, botão, serviço e Ref", hero.ref === "8BXWH" && /topo/.test(hero.origem ?? "") && hero.botoes.includes("Falar no WhatsApp agora") && hero.servico === "online");
const semRef = identificarMensagem("Olá, Montinho! Vi a página da Consultoria Online e queria entender se ela faz sentido para o meu caso.");
ok("mesma frase sem Ref ainda é reconhecida", semRef.origem === hero.origem && semRef.ref === null);
const prova = identificarMensagem("Olá, Montinho! Vi os resultados dos seus alunos e queria entender como funcionaria comigo.");
ok("prova social → 'Quero um plano assim para mim'", prova.botoes[0] === "Quero um plano assim para mim");
const faq = identificarMensagem("Olá, Montinho! Li a página da Consultoria Online e fiquei com uma dúvida: vale para quem treina em casa?");
ok("FAQ: o que a pessoa escreveu depois vira complemento", /FAQ/.test(faq.origem ?? "") && faq.complemento === "vale para quem treina em casa?");
const local = identificarMensagem("Olá, Montinho! Vi sua página sobre personal trainer em Santana de Parnaíba e queria saber como funciona o atendimento.");
ok("barra fixa local extrai o local", local.extra.local === "Santana de Parnaíba" && local.servico === "presencial");
const localNo = identificarMensagem("Olá, Montinho! Vi sua página sobre personal trainer no Tamboré e queria saber como funciona o atendimento.");
ok("'no Tamboré' também", localNo.extra.local === "Tamboré");
const art = identificarMensagem('Olá, Montinho! Já li alguns conteúdos seus — hoje estava em “Melhor treino para quem usa Mounjaro” — e queria conversar sobre o meu caso.');
ok("artigo com aspas curvas do celular extrai o título", art.extra.titulo === "Melhor treino para quem usa Mounjaro" && art.pathPadrao === "^/blog/");
const ferr = identificarMensagem("Olá, Montinho! Usei a Calculadora de Proteína no seu site e meu resultado foi 160 g por dia. Fiquei na faixa alta e queria saber se ela faz sentido para o meu caso.");
ok("ferramenta extrai nome, resultado e pedido", ferr.extra.ferramenta === "Calculadora de Proteína" && ferr.extra.resultado === "160 g por dia" && /faixa alta/.test(ferr.extra.pedido ?? ""));
const padrao = identificarMensagem("Olá, Montinho! Vim pelo seu site e tenho interesse no seu acompanhamento. Gostaria de saber como funciona e qual opção é mais indicada para mim.");
ok("botão padrão: origem sem página fixa", /padrão/.test(padrao.origem ?? "") && padrao.pathPadrao === null);
const lp = identificarMensagem("Olá, Montinho! Vi sua página e quero saber como funciona o acompanhamento. Pode me explicar?");
ok("LP de tráfego pago", /personal-trainer/.test(lp.origem ?? "") && lp.servico === "presencial");
const nada = identificarMensagem("oi, quanto custa?");
ok("texto livre não é reconhecido (e não erra)", nada.origem === null && nada.ref === null);
ok("string vazia não quebra", identificarMensagem("").origem === null);

const ctx = identificarMensagem("Olá, Montinho! Estou no seu site, na página «Personal Trainer no Tamboré», e cliquei no botão do topo. Queria saber como funciona o acompanhamento. Ref: 8BXWH");
ok("mensagem montada no clique: título, botão e Ref", ctx.extra.titulo === "Personal Trainer no Tamboré" && ctx.extra.botao === "botão do topo" && ctx.ref === "8BXWH");
const ctxMenu = identificarMensagem("Olá, Montinho! Estou no seu site, na página «Como Emagrecer 10 kg», e cliquei no menu. Queria saber como funciona o acompanhamento.");
ok("menu de um artigo", ctxMenu.extra.botao === "menu" && /clique/.test(ctxMenu.origem ?? ""));
const reg = identificarMensagem("Oi, Montinho! Vim pelo blog e queria saber sobre acompanhamento presencial no Tamboré.");
ok("CTA regional do blog extrai o local", reg.extra.local === "Tamboré" && reg.pathPadrao === "^/blog/");
ok("card da /consultoria: online", identificarMensagem("Olá! Tenho interesse na Consultoria Online. Pode me contar mais sobre como funciona?").servico === "online");
ok("diagnóstico com resultado no corpo", /Diagnóstico/.test(identificarMensagem("Oi, Montinho! Fiz o Diagnóstico Montinho no site.\nMeu perfil: Recomeço").origem ?? ""));
ok("mobilidade com ou sem vírgula", /Mobilidade/.test(identificarMensagem("Oi Montinho! Fiz o teste de mobilidade no seu site e queria sua ajuda.").origem ?? ""));

bloco("2B. O QUE O APLICATIVO ACRESCENTA NA COLAGEM");

/*
 * Em 08/09/2026 um clique real (Ref G284B) estava no banco e o formulário
 * não achava. A causa: o WhatsApp do iPhone envolve trechos da mensagem em
 * FSI/PDI, caracteres invisíveis que viajam junto na cópia e quebram
 * qualquer regra que compare texto. Estes testes existem para que a
 * limpeza nunca mais seja removida por parecer supérflua.
 */
const real = "Olá, Montinho! Estou no seu site, na página «Personal Trainer Alphaville», e cliquei no botão do topo. Queria saber como funciona o acompanhamento. Ref: G284B";
const variantes: [string, string][] = [
  ["FSI/PDI do WhatsApp iOS", "\u2068" + real.replace("Ref: G284B", "Ref:\u2068 G284B\u2069") + "\u2069"],
  ["zero-width space partindo o código", real.replace("G284B", "G28\u200B4B")],
  ["espaço não separável depois de Ref:", real.replace("Ref: ", "Ref:\u00A0")],
  ["marca de direção no início", "\u200E" + real],
  ["copiado com cabeçalho do iOS", "[17:13, 08/09/2026] Fulano: " + real],
  ["copiado com cabeçalho do Android", "[08/09/2026 17:13] Fulano: " + real],
];
for (const [nome, txt] of variantes) {
  const r = identificarMensagem(txt);
  ok(`${nome}: acha o Ref e a origem`, r.ref === "G284B" && r.extra.titulo === "Personal Trainer Alphaville", `ref=${r.ref} origem=${r.origem}`);
}
ok("a limpeza não come texto de mensagem normal", limparColagem(real) === real);
ok("cabeçalho só sai quando tem cara de cabeçalho", limparColagem("Olá: tudo bem?") === "Olá: tudo bem?");

bloco("3. COMPATIBILIDADE COM CLIQUES REGISTRADOS");
const h = (page_path: string, cta_id: string | null) => ({ page_path, cta_id });
ok("hero casa com o botão do topo na consultoria", handoffCompativel(h("/consultoria-online", "text:Falar no WhatsApp agora"), hero));
ok("hero não casa com outro botão da mesma página", !handoffCompativel(h("/consultoria-online", "text:Quero um plano assim para mim"), hero));
ok("hero não casa com outra página", !handoffCompativel(h("/", "text:Falar no WhatsApp agora"), hero));
ok("clique sem cta_id ainda casa pela página", handoffCompativel(h("/consultoria-online", null), hero));
ok("botão padrão casa com qualquer página", handoffCompativel(h("/blog/x", "text:WhatsApp"), padrao));
ok("mensagem não reconhecida não casa com nada", !handoffCompativel(h("/consultoria-online", null), nada));
ok("detalhe legível para o lead", detalheDaIdentificacao(local) === "Página local · barra fixa · Santana de Parnaíba");
const hT = (page_path: string, page_title: string) => ({ page_path, cta_id: null, page_title });
ok("mensagem do clique casa pelo título da página", handoffCompativel(hT("/personal-trainer-tambore", "Personal Trainer no Tamboré | Montinho Personal Trainer"), ctx));
ok("e não casa com outra página", !handoffCompativel(hT("/personal-trainer-barueri", "Personal Trainer em Barueri | Montinho"), ctx));
ok("detalhe da mensagem do clique traz título e botão", detalheDaIdentificacao(ctx) === 'Botão do site (montado no clique) · "Personal Trainer no Tamboré" · botão do topo');

bloco("4. O CATÁLOGO ESPELHA O SITE");
const fontes = [
  "app/consultoria-online/page.tsx", "app/personal-trainer/page.tsx", "app/consultoria/page.tsx", "lib/sticky/regras.ts", "lib/whatsapp.ts",
  "lib/cta/registry.ts", "lib/revisao.ts", "lib/diagnostico.ts", "lib/rotina/engine.ts", "lib/treino/volume.ts", "lib/ask/guards.ts",
  "lib/cardapio/motor.ts", "components/mobilidade/TesteMobilidade.tsx",
];
const frasesFixas: string[] = [];
for (const f of fontes) {
  const src = fs.readFileSync(f, "utf8");
  // Frases fixas e o começo fixo das frases com variável (o teste para no primeiro ${).
  for (const m of src.matchAll(/["`]((?:Olá|Oi),? Montinho!|Olá!)([^"`$\n]*)/g)) frasesFixas.push((m[1] + m[2]).replace(/\\n/g, " ").trim());
}
ok(`o site tem frases fixas para conferir (${frasesFixas.length})`, frasesFixas.length >= 25, String(frasesFixas.length));
const naoReconhecidas = frasesFixas.filter((f) => !identificarMensagem(f).origem && !reconheceInicio(f));
ok("toda frase fixa do site é reconhecida pelo catálogo", naoReconhecidas.length === 0, naoReconhecidas.join(" | "));

console.log("\n" + "=".repeat(64));
if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
console.log("TODOS OS TESTES PASSARAM");
