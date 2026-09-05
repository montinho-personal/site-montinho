/**
 * Testes do compartilhamento contextual.
 *
 * O que estes testes protegem não é o layout do botão — é o que a mensagem
 * carrega. Um resultado de calculadora que vaza peso ou idade num WhatsApp
 * alheio é dano que nenhum revert desfaz, e é exatamente o tipo de erro que
 * um refactor futuro reintroduz sem querer.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  convite, montarMensagem, rotuloBotao, urlCompartilhada, urlEmail, urlWhatsApp, SITE,
  type ContextoShare,
} from "../lib/share/mensagens";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe?: string) {
  if (cond) console.log(`  ✓ ${nome}`);
  else { falhas++; console.log(`  ✗ ${nome}${detalhe ? ` — ${detalhe}` : ""}`); }
}
const titulo = (t: string) => console.log(`\n${t}\n${"─".repeat(t.length)}`);

titulo("URL compartilhada");
{
  const u = urlCompartilhada("/blog/quanto-de-proteina", "whatsapp", "article");
  ok("aponta para o domínio real", u.startsWith(`${SITE}/blog/quanto-de-proteina?`), u);
  ok("leva utm_source=share", u.includes("utm_source=share"));
  ok("leva o meio no utm_medium", u.includes("utm_medium=whatsapp"));
  ok("leva a campanha do contexto", u.includes("utm_campaign=article_share"));
  const nativo = urlCompartilhada("/x", "native", "article");
  ok("nativo vira utm_medium=native", nativo.includes("utm_medium=native"));
  const copia = urlCompartilhada("/x", "copy_message", "article");
  ok("copiar vira utm_medium=copy", copia.includes("utm_medium=copy"));

  const sujo = urlCompartilhada("/ferramentas/calculadora-de-proteina?peso=96&idade=42#resultado", "whatsapp", "tool");
  ok("descarta query e hash da URL de origem", !sujo.includes("peso") && !sujo.includes("idade") && !sujo.includes("#"), sujo);
  ok("mantém o caminho canônico", sujo.startsWith(`${SITE}/ferramentas/calculadora-de-proteina?`));
  ok("nunca compartilha localhost", !urlCompartilhada("/x", "whatsapp", "article").includes("localhost"));
}

titulo("Mensagem por contexto");
{
  const art = montarMensagem({ contexto: "article", titulo: "Quanta proteína por dia?", caminho: "/blog/proteina" }, "whatsapp");
  ok("artigo cita o título real", art.includes("Quanta proteína por dia?"));
  ok("artigo termina com o link", art.trimEnd().endsWith(`utm_campaign=article_share`), art);
  ok("artigo é curto para WhatsApp", art.length < 300, `${art.length} caracteres`);

  const fer = montarMensagem({ contexto: "tool", titulo: "Calculadora de Proteína", caminho: "/ferramentas/calculadora-de-proteina" }, "whatsapp");
  ok("ferramenta convida a usar", fer.includes("Calculadora de Proteína") && fer.includes("Montinho"));

  const res = montarMensagem({
    contexto: "tool-result", titulo: "Calculadora de Proteína", caminho: "/ferramentas/calculadora-de-proteina",
    resultado: ["1,6 g/kg → 128 g/dia", "2,0 g/kg → 160 g/dia"], ferramenta: "proteina",
  }, "whatsapp");
  ok("resultado mostra os números úteis", res.includes("160 g/dia"));
  ok("resultado convida a calcular", res.includes("Calculei aqui:"));

  const com = montarMensagem({ contexto: "commercial", titulo: "Consultoria Online", caminho: "/consultoria-online" }, "whatsapp");
  ok("comercial não pressiona", !/precisa|autoriza|urgente|agora mesmo/i.test(com), com);
}

titulo("Privacidade: dado corporal nunca entra na mensagem");
{
  // A calculadora sabe o peso; a mensagem não pode saber.
  const res = montarMensagem({
    contexto: "tool-result", titulo: "Calculadora de Proteína", caminho: "/ferramentas/calculadora-de-proteina",
    resultado: ["1,6 g/kg → 128 g/dia", "2,0 g/kg → 160 g/dia", "2,2 g/kg → 176 g/dia"],
  }, "whatsapp");
  for (const proibido of ["Para 80 kg", "80 kg", "42 anos", "175 cm", "masculino", "feminino"]) {
    ok(`não contém "${proibido}"`, !res.includes(proibido));
  }
  ok("a URL do resultado não carrega os dados", !res.includes("peso=") && !res.includes("idade=") && !res.includes("altura="));
}

titulo("Microcopy");
{
  const contextos: ContextoShare[] = ["article", "tool", "tool-result", "commercial", "local", "food"];
  for (const c of contextos) {
    const t = convite(c, "/algum-caminho");
    ok(`${c}: convite existe e é curto`, t.length > 0 && t.length < 80, t);
    ok(`${c}: convite não é manipulativo`, !/precisa|obrigat|marque \d|só quem/i.test(t), t);
    ok(`${c}: rótulo do botão não grita`, rotuloBotao(c) === rotuloBotao(c).replace(/[A-Z]{4,}/g, ""), rotuloBotao(c));
  }
  const a = convite("article", "/blog/um"), b = convite("article", "/blog/um");
  ok("mesma página, mesma frase (estável)", a === b);
  const variados = new Set(["/a", "/b", "/c", "/d", "/e", "/f", "/g", "/h"].map((c) => convite("article", c)));
  ok("artigos diferentes recebem frases diferentes", variados.size > 1, `${variados.size} variações`);
}

titulo("Sem hashtag, sem emoji em rajada, sem número do Montinho");
{
  const todas = [
    montarMensagem({ contexto: "article", titulo: "T", caminho: "/a" }, "whatsapp"),
    montarMensagem({ contexto: "tool", titulo: "T", caminho: "/a" }, "whatsapp"),
    montarMensagem({ contexto: "tool-result", titulo: "T", caminho: "/a", resultado: ["X"] }, "whatsapp"),
    montarMensagem({ contexto: "commercial", titulo: "T", caminho: "/a" }, "whatsapp"),
    montarMensagem({ contexto: "local", titulo: "T", caminho: "/a" }, "whatsapp"),
    montarMensagem({ contexto: "food", titulo: "T", caminho: "/a", resultado: ["X"] }, "whatsapp"),
  ];
  for (const m of todas) {
    ok("sem hashtag", !m.includes("#"), m);
    ok("no máximo um emoji", (m.match(/\p{Extended_Pictographic}/gu) ?? []).length <= 1, m);
    ok("não usa o WhatsApp do Montinho", !m.includes("5511981063409"), m);
  }
  ok("wa.me sai sem número (quem escolhe é o usuário)", urlWhatsApp("oi").startsWith("https://wa.me/?text="));
  ok("e-mail não preenche destinatário", urlEmail("T", "M").startsWith("mailto:?subject="));
}

titulo("Codificação");
{
  const m = montarMensagem({ contexto: "article", titulo: "Ação & saúde: 100% ou #1?", caminho: "/blog/acao" }, "whatsapp");
  const u = urlWhatsApp(m);
  ok("acento codificado", u.includes("%C3%A7") || u.includes("%C3%A3"), u.slice(0, 120));
  ok("& e # codificados", !u.slice("https://wa.me/?text=".length).includes("&") && !u.slice(20).includes("#"));
  ok("espaço não quebra a URL", !u.includes(" "));
}

titulo("Eventos declarados no analytics");
{
  const analytics = readFileSync(join(process.cwd(), "lib/analytics.ts"), "utf8");
  for (const e of ["share_open", "share_native", "share_whatsapp", "share_copy_link", "share_copy_message", "share_email", "share_result"]) {
    ok(`${e} declarado`, analytics.includes(`"${e}"`));
  }
  const comp = readFileSync(join(process.cwd(), "components/share/Compartilhar.tsx"), "utf8");
  ok("intenção e ação são eventos diferentes", comp.includes('"share_open"') && comp.includes('"share_native"'));
  ok("cancelar o painel nativo não vira erro nem evento", /catch\s*\{[^}]*(cancel|Cancelar)/i.test(comp), "esperado comentário explicando o catch silencioso");
  ok("nenhum parâmetro carrega o resultado", !/share_result[^)]*resultado/i.test(comp));
  ok("feature detection antes de usar navigator.share", comp.includes('typeof navigator.share === "function"'));
  ok("tem aria-live para o feedback de copiar", comp.includes("aria-live"));
  ok("Escape fecha o menu", comp.includes('e.key === "Escape"'));
}

titulo("Sem script de terceiro");
{
  const arquivos = readdirSync(join(process.cwd(), "components/share")).map((f) => readFileSync(join(process.cwd(), "components/share", f), "utf8")).join("\n");
  for (const proibido of ["connect.facebook", "platform.twitter", "assets.pinterest", "addthis", "sharethis", "<script"]) {
    ok(`não carrega ${proibido}`, !arquivos.includes(proibido));
  }
}

console.log(falhas === 0 ? "\n================================================================\nTODOS OS TESTES PASSARAM" : `\n${falhas} FALHA(S)`);
process.exit(falhas === 0 ? 0 : 1);
