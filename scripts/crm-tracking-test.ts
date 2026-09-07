/**
 * Testes da mensagem montada no clique e dos marcadores dos botões.
 *   npx tsx scripts/crm-tracking-test.ts
 *
 * O que se protege: (1) a frase que o HandoffTracker monta quando o botão
 * não tem frase própria diz página e posição, e o CRM a lê de volta; (2)
 * todo botão genérico do site está marcado com data-wa-origem, para que a
 * posição venha do atributo e não de adivinhação pela estrutura.
 */
import * as fs from "fs";
import { DEFAULT_MESSAGE, limparTitulo, mensagemContextual, getWhatsAppUrl } from "../lib/whatsapp";
import { textoDoHref, precisaDeContexto, definirTextoNaUrl, anexarRefNaUrl } from "../lib/crm/tracking";
import { identificarMensagem } from "../lib/crm/mensagens";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));

bloco("1. TÍTULO E FRASE");
ok("tira a marca do título", limparTitulo("Personal Trainer no Tamboré | Montinho Personal Trainer") === "Personal Trainer no Tamboré");
ok("tira a marca curta", limparTitulo("Personal Trainer Alphaville | Montinho") === "Personal Trainer Alphaville");
ok("título sem marca fica igual", limparTitulo("Como Emagrecer 10 kg") === "Como Emagrecer 10 kg");
ok("título com duas partes fica com a primeira", limparTitulo("Consultoria Online de Treino | Personal Trainer Online — Montinho") === "Consultoria Online de Treino");
const m = mensagemContextual("topo", "Personal Trainer no Tamboré | Montinho Personal Trainer");
ok("frase diz página e posição", m === "Olá, Montinho! Estou no seu site, na página «Personal Trainer no Tamboré», e cliquei no botão do topo. Queria saber como funciona o acompanhamento.");
ok("origem desconhecida vira 'página'", /cliquei no página\./.test(mensagemContextual("xyz", "T")));
ok("título vazio não quebra", /«seu site»/.test(mensagemContextual("menu", "")));
const lida = identificarMensagem(m + " Ref: A1B2C");
ok("o CRM lê a frase de volta com título, botão e Ref", lida.extra.titulo === "Personal Trainer no Tamboré" && lida.extra.botao === "botão do topo" && lida.ref === "A1B2C");

bloco("2. O QUE O CLIQUE REESCREVE");
ok("link sem texto precisa de contexto", precisaDeContexto(textoDoHref("https://wa.me/5511981063409"), DEFAULT_MESSAGE));
ok("frase genérica precisa de contexto", precisaDeContexto(textoDoHref(getWhatsAppUrl()), DEFAULT_MESSAGE));
ok("frase própria não é mexida", !precisaDeContexto(textoDoHref(getWhatsAppUrl("Olá, Montinho! Vi os resultados dos seus alunos e queria entender como funcionaria comigo.")), DEFAULT_MESSAGE));
const reescrito = anexarRefNaUrl(definirTextoNaUrl("https://wa.me/5511981063409", mensagemContextual("texto", "Beach Tennis e Musculação | Montinho Personal Trainer")), "Q9Z8Y");
const texto = textoDoHref(reescrito);
ok("link cru de artigo vira frase com página + Ref", /«Beach Tennis e Musculação», e cliquei no link no texto/.test(texto) && / Ref: Q9Z8Y$/.test(texto), texto);
ok("href inválido não quebra", definirTextoNaUrl("nao-e-url", "x") === "nao-e-url");

bloco("3. TODO BOTÃO GENÉRICO ESTÁ MARCADO");
const arquivos = [
  "components/layout/Header.tsx", "components/layout/Footer.tsx", "components/layout/WhatsAppFloat.tsx", "components/home/Hero.tsx", "components/home/CTAFinal.tsx",
  ...fs.readdirSync("app").filter((d) => fs.existsSync(`app/${d}/page.tsx`)).map((d) => `app/${d}/page.tsx`),
];
const semMarca: string[] = [];
let marcados = 0;
for (const f of arquivos) {
  const src = fs.readFileSync(f, "utf8");
  const n = (src.match(/href=\{getWhatsAppUrl\(\)\}/g) ?? []).length;
  if (n === 0) continue;
  const marcas = (src.match(/data-wa-origem="/g) ?? []).length;
  // Páginas com um botão só podem confiar na inferência; com dois ou mais, cada um precisa dizer qual é.
  if (n >= 2 && marcas < n) semMarca.push(`${f} (${marcas}/${n})`);
  marcados += marcas;
}
ok("páginas com dois botões genéricos marcam topo e fim", semMarca.length === 0, semMarca.join(", "));
ok(`os botões globais estão marcados (${marcados} marcações)`, marcados >= 6 + 2 * 20, String(marcados));
const tracker = fs.readFileSync("components/crm/HandoffTracker.tsx", "utf8");
ok("o tracker completa a frase antes de anexar o Ref", tracker.indexOf("mensagemContextual(") < tracker.indexOf("anexarRefNaUrl(a.href"));

console.log("\n" + "=".repeat(64));
if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
console.log("TODOS OS TESTES PASSARAM");
