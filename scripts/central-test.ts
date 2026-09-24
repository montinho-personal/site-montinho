import { existsSync, readdirSync, readFileSync } from "node:fs";
/**
 * A Central de Ferramentas: catálogo, busca e página.
 *   npx tsx scripts/central-test.ts
 *
 * O que se protege:
 *  1. O catálogo é a fonte única: toda página de ferramenta está nele, e
 *     toda entrada dele aponta para uma página que existe.
 *  2. A busca acha pela linguagem de quem procura, não só pelo nome — e
 *     nunca deixa a tela em branco.
 *  3. A página é um hub honesto: um H1, links rastreáveis, sem dado
 *     inventado no schema, sem âncora vazia, sem dark pattern.
 */
import { CATALOGO, CATEGORIAS, FERRAMENTAS_NO_AR, MAIS_USADAS, MOSTRAR_POR_CATEGORIA, daCategoria, porId } from "../lib/ferramentas/catalogo";
import { buscaFerramentas, normaliza, palavras } from "../lib/ferramentas/busca";
import { ROTA } from "../lib/ferramentas/pos-resultado";
import { TRILHAS } from "../lib/ferramentas/trilha";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));

bloco("1. O CATÁLOGO É A FONTE ÚNICA");
{
  const hrefs = CATALOGO.map((f) => f.href);
  ok("nenhuma rota repetida", new Set(hrefs).size === hrefs.length);
  ok("nenhum id repetido", new Set(CATALOGO.map((f) => f.id)).size === CATALOGO.length);

  // Toda página em app/ferramentas/* está no catálogo.
  const pastas = readdirSync("app/ferramentas").filter((d) => existsSync(`app/ferramentas/${d}/page.tsx`));
  const faltando = pastas.filter((d) => !hrefs.includes(`/ferramentas/${d}`));
  ok("toda página de app/ferramentas/* está no catálogo", faltando.length === 0, faltando.join(", "));

  // Toda entrada do catálogo aponta para uma página que existe.
  const semPagina = CATALOGO.filter((f) => {
    const p = f.href.replace(/^\//, "");
    return !existsSync(`app/${p}/page.tsx`);
  });
  ok("toda entrada do catálogo tem página", semPagina.length === 0, semPagina.map((f) => f.href).join(", "));

  // As rotas do pós-resultado batem com as do catálogo.
  const divergentes = Object.entries(ROTA).filter(([, rota]) => !hrefs.includes(rota));
  ok("as rotas do pós-resultado existem no catálogo", divergentes.length === 0, divergentes.map(([k, v]) => `${k}: ${v}`).join(", "));

  // Os passos das trilhas existem no catálogo.
  const passos = Object.values(TRILHAS).flatMap((t) => t.passos.map((p) => p.href));
  ok("todo passo das trilhas está no catálogo", passos.every((p) => hrefs.includes(p)));

  for (const c of CATEGORIAS) ok(`categoria "${c.chip}" tem pelo menos uma ferramenta`, daCategoria(c.id).length >= 1);
  ok("cada ferramenta tem tags, ação com verbo e tempo", CATALOGO.every((f) => f.tags.length >= 3 && /^[A-ZÀ-Ú]\w+/.test(f.acao) && f.tempo.length > 0));
  ok("nenhuma ação é 'abrir', 'saiba mais' ou 'explorar'", CATALOGO.every((f) => !/^(abrir|saiba|explorar|descubra mais|ver mais)/i.test(f.acao)));
  ok("nenhuma frase de resultado vira parágrafo (≤ 110 caracteres)", CATALOGO.every((f) => f.resultado.length <= 110), CATALOGO.filter((f) => f.resultado.length > 110).map((f) => f.id).join(", "));
  ok("as mais usadas existem e estão no ar", MAIS_USADAS.every((id) => porId(id) !== null) && MAIS_USADAS.length >= 4 && MAIS_USADAS.length <= 6);
  ok("a de Alphaville é a única local", daCategoria("alphaville").every((f) => /alphaville/i.test(f.nome)) && FERRAMENTAS_NO_AR.filter((f) => f.categoria !== "alphaville").every((f) => !/alphaville/i.test(f.nome)));
  ok("o catálogo não importa o blog nem a base de alimentos", !/from "@\/lib\/blog"|lib\/alimentos/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")));
}

bloco("2. A BUSCA ACHA PELA LINGUAGEM DE QUEM PROCURA");
{
  ok("normaliza acento, maiúscula e pontuação", normaliza("Quanto de Proteína?") === "quanto de proteina");
  ok("descarta palavras vazias", palavras("quanto de proteína eu preciso").join() === "proteina");
  const primeiro = (q: string) => buscaFerramentas(q).resultados[0]?.id;
  const inclui = (q: string, id: string) => buscaFerramentas(q).resultados.some((f) => f.id === id);
  ok("pessoa 1: 'quanto de creatina tomar' → creatina", primeiro("quanto de creatina tomar") === "creatina");
  ok("'perder peso' → déficit, TDEE e cardápio", inclui("perder peso", "deficit") && inclui("perder peso", "tdee") && inclui("perder peso", "cardapio"));
  ok("'quanto whey' → whey primeiro, proteína junto", primeiro("quanto whey") === "whey" && inclui("quanto whey", "proteina"));
  ok("'quanto peso colocar' → 1RM", primeiro("quanto peso colocar") === "onerm");
  ok("pessoa 4: 'como dividir meu treino' → rotina", primeiro("como dividir meu treino") === "rotina");
  ok("pessoa 3: 'gasto correndo' → corrida", primeiro("gasto correndo") === "corrida");
  ok("pessoa 5: 'não sei o que fazer' → diagnóstico", primeiro("não sei o que fazer") === "diagnostico");
  ok("pessoa 6: 'academia alphaville' → a local", primeiro("academia alphaville") === "academia");
  ok("'calorias' → TMB/TDEE e déficit antes das atividades", primeiro("calorias") === "tdee" && buscaFerramentas("calorias").resultados[1]?.id === "deficit");
  ok("'proteína' → a calculadora de proteína primeiro", primeiro("proteína") === "proteina");
  ok("'zona 2' → zonas de FC", primeiro("zona 2") === "fc");
  ok("'secar' → emagrecimento (sinônimo)", primeiro("secar") === "deficit");
  ok("'esteira' → caminhada (sinônimo)", primeiro("esteira") === "caminhada");
  ok("'1RM' → 1RM", primeiro("1RM") === "onerm");
  ok("'divisão de treino' → rotina", primeiro("divisão de treino") === "rotina");
  const zero = buscaFerramentas("xyzabc");
  ok("sem resultado nunca fica vazio: vêm as relacionadas ou as mais usadas", zero.resultados.length === 0 && zero.relacionadas.length >= 4);
  ok("uma letra só não busca", buscaFerramentas("c").termos.length === 0);
  ok("só palavra vazia não busca", buscaFerramentas("de").termos.length === 0);
  ok("a ferramenta fora do ar não aparece na busca", CATALOGO.filter((f) => f.noAr === false).every((f) => !inclui(f.nome, f.id)));
}

bloco("3. A PÁGINA É UM HUB HONESTO");
{
  const pag = readFileSync("app/ferramentas/page.tsx", "utf8");
  const central = readFileSync("components/ferramentas/central/CentralFerramentas.tsx", "utf8");
  const card = readFileSync("components/ferramentas/central/CardFerramenta.tsx", "utf8");
  const titulo = pag.match(/^\s*title:\s*"([^"]+)"/m)![1];
  const desc = pag.match(/^\s*description:\s*\n?\s*"([^"]+)"/m)![1];
  ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58, titulo);
  ok(`description entre 130 e 160 (${desc.length})`, desc.length >= 130 && desc.length <= 160, desc);
  ok("um H1 só", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
  ok("o H1 diz o que a página oferece", /Calculadoras Fitness e Ferramentas Gratuitas/.test(pag));
  ok("breadcrumb visual e BreadcrumbList", /aria-label="Você está em"/.test(pag) && /"@type": "BreadcrumbList"/.test(pag));
  ok("CollectionPage com ItemList gerado do catálogo", /"@type": "CollectionPage"/.test(pag) && /FERRAMENTAS_NO_AR\.map\(/.test(pag));
  ok("nada inventado no schema", !/AggregateRating|"Review"|FAQPage|ratingValue/.test(pag + central + card));
  ok("a central importa o catálogo e a busca", /lib\/ferramentas\/catalogo/.test(central) && /lib\/ferramentas\/busca/.test(central));
  ok("filtros com aria-pressed e estado claro", /aria-pressed=\{filtro === c\.id\}/.test(central));
  ok("filtrar e buscar escondem com `hidden`, não removem do DOM", /hidden=\{buscando \|\| \(filtro !== "todos" && filtro !== c\.id\)\}/.test(central));
  ok("categoria grande mostra as primeiras e o resto fica no HTML", /MOSTRAR_POR_CATEGORIA/.test(central) && /aria-controls=\{idResto\}/.test(central) && MOSTRAR_POR_CATEGORIA >= 6);
  ok("zero resultado tem mensagem própria, Pergunte ao Montinho e relacionadas", /Não encontrei uma ferramenta exatamente para isso/.test(central) && /context: "no_results"/.test(central) && /Talvez uma destas ajude/.test(central));
  ok("o termo sem resultado é registrado, curto", /tools_no_results/.test(central) && /slice\(0, 80\)/.test(central));
  ok("a busca é medida ao parar de digitar, não a cada tecla", /setTimeout\(\(\) => \{[\s\S]*tools_hub_search/.test(central) && /700/.test(central));
  ok("o card tem um link só, e é o nome", (card.match(/<Link/g) ?? []).length === 1 && /after:absolute after:inset-0/.test(card));
  ok("o card registra o clique com nome, categoria e posição", /tool_card_click/.test(card) && /position: posicao/.test(card));
  {
    // Decisão de 2026-09: os caminhos ganharam destaque — dois cartões que levam direto a /comece/dieta e /comece/treino, logo depois da busca.
    const dc = readFileSync("components/comece/DoisCaminhos.tsx", "utf8");
    ok("o caminho guiado usa os dois cartões e manda para o /comece", /<DoisCaminhos variante="hub"/.test(pag) && /href=\{`\/comece\/\$\{id\}`\}/.test(dc) && /href="\/comece"/.test(dc) && /sem redigitar/.test(dc));
    ok("o caminho guiado vem logo depois da busca, antes dos filtros", central.indexOf("{caminhoGuiado}") < central.indexOf("Filtrar por categoria"));
  }
  ok("o caminho guiado não repete os nove passos", !/passos\.map\(/.test(pag));
  ok("o CTA comercial vem depois do catálogo e rastreia o WhatsApp", pag.indexOf("cta-comercial") > pag.indexOf("<CentralFerramentas") && /cta_location: "ferramentas_hub"/.test(pag));
  ok("sem urgência falsa nem contagem regressiva", !/últimas vagas|só hoje|countdown|restam apenas/i.test(pag + central));
  ok("a busca respeita Escape e tem botão de limpar", /e\.key === "Escape"/.test(central) && /aria-label="Limpar busca"/.test(central));
  ok("estado da busca em aria-live", /aria-live="polite"/.test(central));
  ok("foco visível nos controles", /focus-visible:ring-2/.test(central) && /focus-visible:ring-2/.test(pag));
  ok("ícones são um sistema só, decorativos", /aria-hidden="true"/.test(readFileSync("components/ferramentas/central/IconeFerramenta.tsx", "utf8")) && !/[\u{1F300}-\u{1FAFF}]/u.test(card + central));
  const analytics = readFileSync("lib/analytics.ts", "utf8");
  for (const ev of ["tools_hub_search", "tools_no_results", "tools_hub_filter", "tool_card_click", "guided_path_click", "ask_montinho_click", "tools_hub_cta_click"]) {
    ok(`evento ${ev} declarado`, analytics.includes(`"${ev}"`));
  }
}

console.log(falhas ? `\n${falhas} FALHA(S)\n` : "\nTUDO OK\n");
process.exit(falhas ? 1 : 0);
