/**
 * Testes das trilhas — o caminho explícito entre as ferramentas.
 *
 * O risco aqui é o de toda navegação declarada à mão: a trilha apontar para
 * página que não existe, uma página do caminho não mostrar a trilha, ou a
 * ordem contar uma história diferente da dependência real dos dados. A
 * trilha só tem valor se for verdadeira em todas as pontas.
 */

import * as fs from "fs";
import { TRILHAS, encontraPasso } from "../lib/ferramentas/trilha";
import { CAMINHO_POR_ARTIGO, HREFS } from "../lib/ferramentas/comece-artigos";
import { blogPosts } from "../lib/blog";
import { ARTIGOS_COM_CALCULADORA_CARDAPIO } from "../lib/cardapio/motor";
import { ARTIGOS_COM_CALCULADORA } from "../lib/proteina";
import { ARTIGOS_COM_CALCULADORA_DEFICIT } from "../lib/calorias";
import { ARTIGOS_COM_CALCULADORA_TDEE } from "../lib/tdee";
import { ARTIGOS_COM_CALCULADORA_1RM } from "../lib/onerm";
import { ARTIGOS_COM_CALCULADORA_FC } from "../lib/fc";
import { ARTIGOS_COM_CALCULADORA_MACROS } from "../lib/macros";
import { ARTIGOS_COM_CALCULADORA_VOLUME } from "../lib/treino/volume";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const ler = (p: string) => fs.readFileSync(p, "utf8");

console.log("\n" + "=".repeat(64) + "\nAS TRILHAS SÃO VERDADEIRAS\n" + "=".repeat(64));

/** Todo passo aponta para uma página que existe de verdade. */
const paginaDe = (href: string) => `app${href}/page.tsx`;
for (const id of ["dieta", "treino"] as const) {
  for (const p of TRILHAS[id].passos) {
    ok(`[${id}] a página do passo "${p.nome}" existe: ${p.href}`, fs.existsSync(paginaDe(p.href)));
  }
}

ok("nenhum passo se repete entre as trilhas", (() => {
  const todos = Object.values(TRILHAS).flatMap((t) => t.passos.map((p) => p.href));
  return new Set(todos).size === todos.length;
})());

/**
 * A ordem da trilha da dieta é a ordem da dependência dos dados: gasto
 * alimenta meta, meta alimenta macros, macros alimentam cardápio. Se alguém
 * reordenar, o texto "cada passo calcula o número que o próximo usa" vira
 * mentira.
 */
ok(
  "dieta: gasto → meta → macros → cardápio, nesta ordem",
  TRILHAS.dieta.passos.map((p) => p.href).join(" ") ===
    "/ferramentas/calculadora-tmb-tdee /ferramentas/calculadora-deficit-calorico /ferramentas/calculadora-macros /ferramentas/monte-seu-cardapio"
);
ok(
  "treino: diagnóstico → rotina → volume → carga → execução",
  TRILHAS.treino.passos.map((p) => p.nome).join(" ") === "Diagnóstico Rotina Volume Carga Execução"
);
ok("todo passo tem a pergunta que responde", Object.values(TRILHAS).every((t) => t.passos.every((p) => p.pergunta.endsWith("?"))));

console.log("\n" + "=".repeat(64) + "\nTODA PÁGINA DO CAMINHO MOSTRA O CAMINHO\n" + "=".repeat(64));

for (const id of ["dieta", "treino"] as const) {
  for (const p of TRILHAS[id].passos) {
    const src = ler(paginaDe(p.href));
    ok(
      `[${id}] ${p.nome} renderiza a trilha apontando para si`,
      src.includes(`<Trilha atual="${p.href}" />`),
      "página do caminho sem a trilha deixa a pessoa perdida de novo"
    );
  }
}

/** encontraPasso: o helper que o componente usa. */
ok("encontraPasso acha o meio da trilha", JSON.stringify(encontraPasso("/ferramentas/calculadora-macros")) === JSON.stringify({ trilha: "dieta", indice: 2 }));
ok("encontraPasso devolve null fora da trilha", encontraPasso("/ferramentas/calculadora-de-proteina") === null);

/** O componente: passo atual marcado, próximo anunciado, zero JS. */
{
  const comp = ler("components/ferramentas/Trilha.tsx");
  ok("o passo atual usa aria-current e não é link", /aria-current="step"/.test(comp));
  ok("o próximo passo aparece com a pergunta dele", /Próximo passo/.test(comp) && /proximo\.pergunta/.test(comp));
  ok("é componente de servidor (sem use client, sem hooks)", !/"use client"|useState|useEffect/.test(comp));
  ok("a trilha some na impressão", /print:hidden/.test(comp));
}

console.log("\n" + "=".repeat(64) + "\nA CENTRAL ENSINA O CAMINHO\n" + "=".repeat(64));

{
  const hub = ler("app/ferramentas/page.tsx");
  ok("a central tem a seção 'não sabe por onde começar'", /Não sabe por onde começar/.test(hub) && /TRILHAS/.test(hub));
  ok("a seção explica que os dados atravessam sozinhos", /sem redigitar/.test(hub));
}

console.log("\n" + "=".repeat(64) + "\nO PRÓXIMO PASSO EM DESTAQUE NOS MACROS\n" + "=".repeat(64));

/**
 * O pedido que originou tudo isto: depois de calcular os macros, a ligação
 * com o cardápio tem que estar em DESTAQUE, não escondida numa lista de
 * links. E a travessia leva meta + peso, gravados só no clique.
 */
{
  const macros = ler("components/macros/CalculadoraMacros.tsx").replace(/\/\*[\s\S]*?\*\//g, "");
  ok("existe o bloco 'Próximo passo' com CTA para o cardápio", /Próximo passo/.test(macros) && /Montar meu cardápio com esses macros/.test(macros));
  ok(
    "o CTA grava meta e peso dentro do onClick",
    /onClick=\{\(\) => \{[\s\S]{0,400}?guardaKcalParaMacros\(kcal\);[\s\S]{0,200}?guardaPesoParaProteina\(peso\);[\s\S]{0,200}?macro_cardapio_click/.test(macros)
  );
  ok("o evento macro_cardapio_click está declarado", ler("lib/analytics.ts").includes('"macro_cardapio_click"'));
}

console.log("\n" + "=".repeat(64) + "\nO PRÓXIMO PASSO TAMBÉM É CLARO NO DÉFICIT\n" + "=".repeat(64));

/**
 * Dois links de mesmo peso ("macros" e "cardápio") deixavam a pessoa sem
 * saber qual era O caminho. A hierarquia agora segue a trilha: macros é o
 * botão primário (passo 3), cardápio é o atalho secundário explicado.
 */
{
  const deficit = ler("components/calorias/CalculadoraDeficit.tsx").replace(/\/\*[\s\S]*?\*\//g, "");
  ok("o déficit tem o bloco 'Próximo passo' com macros como primário", /Próximo passo/.test(deficit) && /passo 3 do caminho/.test(deficit));
  const iPrimario = deficit.indexOf("Distribuir minhas calorias em macros");
  const iAtalho = deficit.indexOf("pule direto para o cardápio");
  ok("o cardápio é atalho secundário, depois do primário", iPrimario > -1 && iAtalho > iPrimario);
  ok("o atalho explica por que pular é seguro", /calcula os macros por dentro/.test(deficit));
}

console.log("\n" + "=".repeat(64) + "\nO DIAGNÓSTICO ENTREGA O PASSO 2\n" + "=".repeat(64));

/**
 * O resultado do diagnóstico é o passo 1 do caminho do treino e parava num
 * beco: convite de análise e artigos, mas nenhuma direção para a próxima
 * ferramenta. Agora os dois públicos saem com caminho — quem quer falar
 * com o Montinho fala; quem quer seguir sozinho vai para a Rotina.
 */
{
  const diag = ler("components/diagnostico/DiagnosticoQuiz.tsx").replace(/\/\*[\s\S]*?\*\//g, "");
  ok("o resultado tem o bloco 'Próximo passo' para a Rotina", /Próximo passo/.test(diag) && /treino-para-minha-rotina/.test(diag) && /Montar minha rotina de treino/.test(diag));
  const iAnalise = diag.indexOf("Quero uma análise do Montinho");
  const iProximo = diag.indexOf("Montar minha rotina de treino");
  ok(
    "a trilha vem ANTES do convite de análise (passo 1 avança a jornada; a venda tem momentos melhores adiante)",
    iProximo > -1 && iAnalise > iProximo,
    "pedir WhatsApp antes de entregar caminho, no primeiro contato, é atrito que derruba os dois números"
  );
  ok("o evento diagnostic_routine_click está declarado", ler("lib/analytics.ts").includes('"diagnostic_routine_click"'));
}

console.log("\n" + "=".repeat(64) + "\nRÓTULOS EM CAIXA ALTA NUNCA HERDAM A SERIFADA\n" + "=".repeat(64));

/**
 * O CSS global põe a serifada em todo h1–h6. Em título grande isso é a
 * identidade do site; em rótulo pequeno em caixa alta é ilegível — foi
 * reclamação real de uso. Todo heading pequeno uppercase precisa declarar
 * a fonte sans explicitamente.
 */
for (const arq of [
  "components/diagnostico/DiagnosticoQuiz.tsx",
  "app/personal-trainer/page.tsx",
  "app/consultoria-online/page.tsx",
]) {
  const src = ler(arq);
  const rotulos = src.match(/<h[3-6][^>]*uppercase[^>]*>/g) ?? [];
  ok(
    `${arq}: todo heading uppercase declara fonte sans (${rotulos.length} rótulos)`,
    rotulos.length === 0 || rotulos.every((r) => /font-inter|sans-serif/.test(r)),
    rotulos.filter((r) => !/font-inter|sans-serif/.test(r)).join(" | ")
  );
}

console.log("\n" + "=".repeat(64) + "\nA ROTINA BIFURCA COM HONESTIDADE\n" + "=".repeat(64));

/**
 * O caminho do treino atende duas pessoas. Quem NÃO tem treino: a jornada
 * gratuita termina na Rotina (montar exercícios é o produto — lacuna
 * proposital, e o CTA de WhatsApp é a saída dela). Quem JÁ treina: segue
 * para o Volume auditar a ficha. O resultado da Rotina precisa dizer isso
 * com todas as letras, senão a primeira pessoa cai no passo 3 sem ter o
 * que digitar.
 */
{
  const rot = ler("components/rotina/RotinaQuiz.tsx").replace(/\/\*[\s\S]*?\*\//g, "");
  ok("existe a porta de quem já treina, para o Volume", /Já treina com uma ficha pronta\?/.test(rot) && /calculadora-volume-treino/.test(rot) && /routine_volume_click/.test(rot));
  ok("e a honestidade sobre a lacuna: sem treino, o gratuito termina ali", /caminho gratuito termina aqui/.test(rot));
  const iWhats = rot.indexOf("Quero transformar essa estrutura no meu treino");
  const iVolume = rot.indexOf("Já treina com uma ficha pronta?");
  ok("o WhatsApp continua sendo a ação principal, a bifurcação vem depois", iWhats > -1 && iVolume > iWhats);
  ok("o evento routine_volume_click está declarado", ler("lib/analytics.ts").includes('"routine_volume_click"'));
}

console.log("\n" + "=".repeat(64) + "\nA ÚLTIMA EMENDA: CARGA ENTREGA NA EXECUÇÃO\n" + "=".repeat(64));

/**
 * O 1RM (passo 4) terminava em artigo + consultoria, e o passo 5 — a
 * Revisão de Execução, que é gratuita e desemboca na conversa — nunca era
 * oferecido. É a melhor emenda do caminho: quem acabou de descobrir a
 * carga está se perguntando se aguenta o peso com técnica.
 */
{
  const onerm = ler("components/onerm/CalculadoraOneRM.tsx").replace(/\/\*[\s\S]*?\*\//g, "");
  ok("o 1RM tem o bloco 'Próximo passo' para a Revisão de Execução", /Próximo passo/.test(onerm) && /revisao-de-execucao/.test(onerm) && /Revisar minha execução/.test(onerm));
  ok("a copy explica o porquê (carga sem técnica é risco)", /técnica errada é risco/.test(onerm));
  ok("e diz que é gratuito — a barreira certa é zero", /É gratuito|grátis/.test(onerm));
  ok("o evento one_rm_review_click está declarado", ler("lib/analytics.ts").includes('"one_rm_review_click"'));
}

console.log("\n" + "=".repeat(64) + "\nAS PORTAS DE ENTRADA: /comece\n" + "=".repeat(64));

/**
 * As três LPs dos caminhos. Regras: leem TRILHAS (fonte única — nada de
 * passo duplicado à mão), canonical própria, os bordões entram pelas
 * constantes de lib/bordoes (a frase do impossível nunca sem a condição),
 * a história carrega os fatos reais (40 kg, o problema era a abordagem), e
 * o único JS é o rastreio de view.
 */
for (const [arq, url] of [
  ["app/comece/page.tsx", "/comece"],
  ["app/comece/dieta/page.tsx", "/comece/dieta"],
  ["app/comece/treino/page.tsx", "/comece/treino"],
] as const) {
  const src = ler(arq);
  ok(`${url} existe e tem canonical própria`, src.includes("canonical: `${SITE_URL}" + url + "`"));
  ok(`${url} lê os passos de TRILHAS (fonte única)`, /from "@\/lib\/ferramentas\/trilha"/.test(src));
  ok(`${url} usa os bordões pelas constantes, nunca à mão`, /from "@\/lib\/bordoes"/.test(src) && /BORDOES\./.test(src));
  ok(`${url} tem BreadcrumbList e H1`, /BreadcrumbList/.test(src) && /<h1/.test(src));
  ok(`${url} não usa hooks (o único JS é o RastreioComece)`, !/useState|useEffect/.test(src) && /RastreioComece/.test(src));
}
{
  const geral = ler("app/comece/page.tsx");
  ok("a geral conta a história com os fatos reais", /gordinho da turma/.test(geral) && /40 kg/.test(geral) && /o problema era a abordagem/.test(geral));
  ok("a geral apresenta os DOIS caminhos", /\/comece\/dieta|`\/comece\/\$\{id\}`/.test(geral));
  ok("a frase do impossível vem da constante completa (com condição)", /BORDOES\.impossivelCompleta/.test(geral) && /BORDOES\.impossivelNaoEh/.test(geral));
  ok("as três estão no sitemap", ["/comece", "/comece/dieta", "/comece/treino"].every((u) => ler("app/sitemap.ts").includes("${SITE_URL}" + u + "`")));
  ok("a faixa de trilha linka a LP do caminho", /href=\{`\/comece\/\$\{pos\.trilha\}`\}/.test(ler("components/ferramentas/Trilha.tsx")));
  ok("o evento comece_view está declarado", ler("lib/analytics.ts").includes('"comece_view"'));
}
{
  /** Cada LP específica cobre TODOS os passos do caminho dela. */
  for (const id of ["dieta", "treino"] as const) {
    const src = ler(`app/comece/${id}/page.tsx`);
    const faltando = TRILHAS[id].passos.filter((p) => !src.includes(`"${p.href}"`));
    ok(`/comece/${id} detalha todos os ${TRILHAS[id].passos.length} passos`, faltando.length === 0, faltando.map((p) => p.href).join(", "));
  }
}

console.log("\n" + "=".repeat(64) + "\nAS FERRAMENTAS NOS ARTIGOS\n" + "=".repeat(64));

/**
 * A regra estrutural do acervo: UMA ferramenta por artigo. Os registros
 * precisam ser disjuntos — dois embeds no mesmo corte editorial brigariam
 * pelo mesmo espaço e a página viraria uma feira.
 */
{
  const slugs = new Set(blogPosts.map((p) => p.slug));
  const registros: [string, string[]][] = [
    ["proteína", ARTIGOS_COM_CALCULADORA],
    ["déficit", ARTIGOS_COM_CALCULADORA_DEFICIT],
    ["TMB/TDEE", ARTIGOS_COM_CALCULADORA_TDEE],
    ["1RM", ARTIGOS_COM_CALCULADORA_1RM],
    ["macros", ARTIGOS_COM_CALCULADORA_MACROS],
    ["volume", ARTIGOS_COM_CALCULADORA_VOLUME],
    ["cardápio", ARTIGOS_COM_CALCULADORA_CARDAPIO],
    ["FC", ARTIGOS_COM_CALCULADORA_FC],
  ];

  for (const [nome, lista] of registros) {
    const faltando = lista.filter((s) => !slugs.has(s));
    ok(`[${nome}] todos os ${lista.length} artigos do registro existem`, faltando.length === 0, faltando.join(", "));
  }

  const vistos = new Map<string, string>();
  const colisoes: string[] = [];
  for (const [nome, lista] of registros) {
    for (const s of lista) {
      if (vistos.has(s)) colisoes.push(`${s} está em ${vistos.get(s)} E em ${nome}`);
      else vistos.set(s, nome);
    }
  }
  ok("uma ferramenta por artigo: nenhum slug em dois registros", colisoes.length === 0, colisoes.join("\n           "));

  /** O FitChef nascia sem artigo nenhum — a ferramenta mais completa era invisível. */
  ok("o Montinho FitChef aparece em artigos", ARTIGOS_COM_CALCULADORA_CARDAPIO.length >= 5, String(ARTIGOS_COM_CALCULADORA_CARDAPIO.length));
  ok(
    "o blog renderiza o FitChef nos artigos dele",
    /ARTIGOS_COM_CALCULADORA_CARDAPIO/.test(ler("app/blog/[slug]/page.tsx")) && /MonteSeuCardapio placement=\{post\.slug\}/.test(ler("app/blog/[slug]/page.tsx"))
  );
  ok(`cobertura total: ${vistos.size} artigos com ferramenta`, vistos.size >= 40, String(vistos.size));
}

console.log("\n" + "=".repeat(64) + "\nO CAMINHO NOS ARTIGOS DE COMEÇO\n" + "=".repeat(64));

{
  const slugs = new Set(blogPosts.map((p) => p.slug));
  const faltando = Object.keys(CAMINHO_POR_ARTIGO).filter((s) => !slugs.has(s));
  ok(`todos os ${Object.keys(CAMINHO_POR_ARTIGO).length} artigos do caminho existem`, faltando.length === 0, faltando.join(", "));
  ok("todo destino aponta para uma LP real", Object.values(CAMINHO_POR_ARTIGO).every((c) => ["/comece", "/comece/dieta", "/comece/treino"].includes(HREFS[c])));
  const comp = ler("components/comece/BlocoCaminho.tsx");
  ok("o bloco renderiza nada fora do registro", /if \(!caminho\) return null;/.test(comp));
  ok("é componente de servidor e some na impressão", !/"use client"|useState/.test(comp) && /print:hidden/.test(comp));
  ok("o blog renderiza o bloco", /<BlocoCaminho slug=\{post\.slug\} \/>/.test(ler("app/blog/[slug]/page.tsx")));
  /**
   * O bloco é direção, não calculadora: entra DEPOIS do corpo do artigo. Se
   * subisse para o meio, competiria com a leitura — e com o embed de
   * ferramenta, quando o artigo tiver os dois.
   */
  const blog = ler("app/blog/[slug]/page.tsx");
  ok("o bloco vem depois do corpo do artigo", blog.indexOf("<BlocoCaminho") > blog.indexOf("corpoRestante }}"));
}

console.log("\n" + "=".repeat(64) + "\nA FOTO NA HISTÓRIA\n" + "=".repeat(64));

/**
 * A antes/depois é o ativo de autoridade mais forte do site — e o mais
 * fácil de usar errado. Ela funciona como PROVA da frase "eu estive aí";
 * viraria promessa se a legenda dissesse "veja o que é possível". Por isso
 * a legenda é travada: fala do passado dele, nunca do futuro de quem lê.
 */
{
  const comece = ler("app/comece/page.tsx");
  ok("a foto está na página, dentro de figure", /<figure/.test(comece) && /antes-depois-montinho-personal-trainer\.jpg/.test(comece));
  ok("usa next/image (otimização e proporção corretas)", /<Image/.test(comece) && /from "next\/image"/.test(comece));
  ok("tem alt descritivo de verdade", /alt="Montinho antes e depois[^"]{40,}"/.test(comece));
  ok("a legenda fala de empatia, não de promessa", /Este era eu/.test(comece) && /não estou te vendendo o meu resultado/i.test(comece));
  ok(
    "a legenda NÃO promete resultado a quem lê",
    !/(veja o que é possível|você (também )?pode (ter|conseguir) (isso|esse)|seu resultado será)/i.test(comece)
  );
  /** No herói ela faria a página ser sobre ele; no meio, prova a frase. */
  ok("a foto vem depois do H1 e do título da história", comece.indexOf("<figure") > comece.indexOf("porque eu estive aí"));
}

console.log("\n" + "=".repeat(64) + (falhas === 0 ? "\nTODOS OS TESTES PASSARAM" : `\n${falhas} TESTE(S) FALHARAM`));
if (falhas > 0) process.exit(1);
