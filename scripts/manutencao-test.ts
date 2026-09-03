/**
 * A fila da manutenção diária.
 *   npx tsx scripts/manutencao-test.ts
 *
 * O RISCO AQUI NÃO É A CONTA, É O ROBÔ TRABALHANDO SOZINHO
 *
 * Esta fila alimenta uma rotina que roda todo dia às 5h e edita o acervo sem
 * ninguém olhando. Os dois modos de falha que importam:
 *
 * 1. UM SELETOR FROUXO faz o robô "consertar" o que já estava certo. Um
 *    artigo que sai da fila e volta no dia seguinte vira edição infinita no
 *    mesmo texto.
 * 2. UM SELETOR APERTADO DEMAIS esconde trabalho, e a fila termina sem ter
 *    terminado.
 *
 * Por isso cada seletor é testado nos dois sentidos: reconhece o defeito e
 * NÃO acusa quem já está consertado. O caso positivo usa artigo de verdade
 * do acervo sempre que existe um.
 */

import { existsSync, readFileSync } from "node:fs";
import { blogPosts, type BlogPost } from "../lib/blog";
import {
  ACADEMIA_DE_CIDADE, ALT_GENERICO, TAREFAS, altGenerico, contaH2, impressoes,
  lote, metaForaDoLimite, semCapa, semReferencias,
} from "./manutencao";
import { LARGURA, ALTURA, caminhoCapa, caminhoSvg } from "./gerar-capa";
import { acrescentaNoFim, conteudoDoArtigo, fechoDoContent, substituiNoArtigo } from "./editar-artigo";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const post = (s: string) => blogPosts.find((p) => p.slug === s)!;
const finge = (c: Partial<BlogPost>): BlogPost => ({ ...blogPosts[0], ...c });

bloco("1. CADA SELETOR RECONHECE O DEFEITO E POUPA QUEM JÁ ESTÁ CERTO");

/* Referências: só conta a SEÇÃO, não a palavra solta no meio do texto. */
ok("referências: artigo novo com <h2>Referências</h2> sai da fila", !semReferencias(post("caminhada-japonesa")));
ok("referências: artigo sem a seção entra na fila", semReferencias(finge({ content: "<h2>Oi</h2><p>texto</p>" })));
ok("referências: a palavra no meio do texto NÃO conta como seção",
  semReferencias(finge({ content: "<p>as referências da literatura mostram que…</p>" })),
  "senão o robô pula artigo que precisa da seção");
ok("referências: aceita 'Referencias' sem acento", !semReferencias(finge({ content: "<h2>Referencias</h2>" })));

/* Capa: o og:image é que manda, não a existência de arquivo no disco. */
ok("capa: artigo com <slug>-capa.webp no corpo sai da fila", !semCapa(post("quantos-dias-por-semana-treinar")));
ok("capa: SVG no corpo NÃO conta como capa",
  semCapa(post("hashimoto-e-treino")),
  "SVG não é og:image válido — WhatsApp e Facebook não renderizam");

/* Meta. */
ok("meta: título de 61 entra na fila", metaForaDoLimite(finge({ metaTitle: "x".repeat(61), metaDescription: "y".repeat(140) })));
ok("meta: título de 60 não entra", !metaForaDoLimite(finge({ metaTitle: "x".repeat(60), metaDescription: "y".repeat(140) })));
ok("meta: descrição de 161 entra", metaForaDoLimite(finge({ metaTitle: "ok", metaDescription: "y".repeat(161) })));
ok("meta: descrição de 119 entra (desperdiça espaço)", metaForaDoLimite(finge({ metaTitle: "ok", metaDescription: "y".repeat(119) })));
ok("meta: 120 a 160 é a faixa boa", !metaForaDoLimite(finge({ metaTitle: "ok", metaDescription: "y".repeat(120) })));
ok("meta: os artigos de 03/09 já nascem dentro da faixa",
  ["caminhada-japonesa", "zonas-de-frequencia-cardiaca", "personal-trainer-ou-aula-coletiva"].every((s) => !metaForaDoLimite(post(s))));

/* Subtítulos: <h2> e <h2 class=…> contam; <h20> não existe, mas h3 não conta. */
ok("h2: conta a tag com atributo", contaH2(finge({ content: '<h2 id="a">x</h2><h2>y</h2>' })) === 2);
ok("h2: h3 não conta como h2", contaH2(finge({ content: "<h3>x</h3><h3>y</h3>" })) === 0);
ok("h2: artigo novo tem 4 ou mais", contaH2(post("quanto-treinar-por-semana-para-viver-mais")) >= 4);

/* Alt. */
ok("alt: pega o texto de template do gerador",
  ALT_GENERICO.test('<img alt="Infográfico sobre Treino de Peito — Montinho Personal Trainer">'));
ok("alt: NÃO pega alt descritivo de verdade",
  !altGenerico(post("caminhada-japonesa")) && !altGenerico(post("zonas-de-frequencia-cardiaca")),
  "os artigos novos descrevem a imagem e não podem entrar na fila");

ok("academia de cidade: reconhece", ACADEMIA_DE_CIDADE(finge({ slug: "academias-em-barueri" })));
ok("academia de cidade: ignora academia sem cidade", !ACADEMIA_DE_CIDADE(finge({ slug: "como-escolher-uma-academia" })));
ok("academia de cidade: ignora cidade sem academia", !ACADEMIA_DE_CIDADE(finge({ slug: "personal-trainer-barueri" })));

bloco("2. A FILA NÃO PODE MANDAR O ROBÔ FAZER BOBAGEM");

for (const t of TAREFAS) {
  const l = lote(t);
  ok(`${t.id}: entrega no máximo a quota de ${t.quota}`, l.hoje.length <= t.quota, `veio ${l.hoje.length}`);
  ok(`${t.id}: tudo que entrega está realmente pendente`, l.hoje.every((p) => t.pendentes().some((x) => x.slug === p.slug)));
  ok(`${t.id}: ordenado por impressão, do maior para o menor`,
    l.hoje.every((p, i) => i === 0 || impressoes(l.hoje[i - 1].slug) >= impressoes(p.slug)));
  ok(`${t.id}: a regra diz o que NÃO fazer`, /NUNCA|PULE|não |Não /.test(t.regra), t.regra.slice(0, 60));
}
{
  const ids = TAREFAS.map((t) => t.id);
  ok("os ids são únicos", new Set(ids).size === ids.length);
  ok("as cinco filas do combinado estão aqui",
    ["capa-academia", "referencias", "meta", "subtitulos", "alt"].every((i) => ids.includes(i)));
  ok("as quotas são as combinadas em 03/09 (2+2+3+3+2 = 12/dia)",
    TAREFAS.reduce((s, t) => s + t.quota, 0) === 12);
}
{
  /* Um artigo em duas filas no mesmo dia significaria dois commits no mesmo texto. */
  const hoje = TAREFAS.flatMap((t) => lote(t).hoje.map((p) => `${t.id}:${p.slug}`));
  const slugs = hoje.map((h) => h.split(":")[1]);
  const repetidos = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  console.log(`   (aviso, não é falha) mesmo artigo em mais de uma fila hoje: ${repetidos.length ? [...new Set(repetidos)].join(", ") : "nenhum"}`);
}

bloco("3. A PRIORIDADE POR TRÁFEGO PRECISA DE DADO");

ok("o arquivo de impressões existe", existsSync("data/analytics/impressoes-blog.json"));
{
  const j = JSON.parse(readFileSync("data/analytics/impressoes-blog.json", "utf8"));
  ok("declara o período e a fonte", !!j.periodo && !!j.fonte);
  ok("tem centenas de slugs", Object.keys(j.impressoes).length > 500, String(Object.keys(j.impressoes).length));
  /*
   * O export é registro histórico: pode conter URL que já não existe. Isso
   * não invalida o arquivo — mas é achado, porque URL indexada sem artigo é
   * 404 recebendo visita. O que NÃO pode é a fila mandar o robô editar um
   * artigo inexistente, e isso é testado no bloco 2.
   */
  const sumidos = Object.keys(j.impressoes).filter((s) => !blogPosts.some((p) => p.slug === s));
  console.log(`   (aviso) ${sumidos.length} URL(s) com impressão e sem artigo — 404 no índice: ${sumidos.join(", ") || "nenhuma"}`);
  ok("os sumidos são poucos: se passar de 20, algo quebrou em massa", sumidos.length <= 20, String(sumidos.length));
  ok("nenhuma impressão negativa ou fracionária",
    Object.values(j.impressoes).every((v) => Number.isInteger(v) && (v as number) > 0));
}
ok("artigo sem dado vale zero, não quebra", impressoes("slug-que-nao-existe") === 0);

bloco("4. AS FONTES DA TAREFA DE REFERÊNCIAS SÃO REAIS");

/*
 * O pool foi extraído das seções de referências que já existem no acervo. O
 * robô só pode citar daqui — a alternativa é ele inventar DOI, e referência
 * inventada num site de saúde é pior que referência nenhuma.
 */
ok("o pool de fontes existe", existsSync("data/manutencao/fontes-usadas.json"));
{
  const f = JSON.parse(readFileSync("data/manutencao/fontes-usadas.json", "utf8")) as { texto: string; vezes: number }[];
  ok(`tem fontes suficientes para escolher (${f.length})`, f.length > 100);
  ok("toda entrada tem texto e contagem", f.every((x) => x.texto.length > 30 && x.vezes >= 1));
  ok("nenhuma entrada é um placeholder", !f.some((x) => /lorem|exemplo|TODO|xxx/i.test(x.texto)));
  ok("a regra da tarefa aponta para este arquivo",
    TAREFAS.find((t) => t.id === "referencias")!.regra.includes("fontes-usadas.json"));
}

bloco("5. A GERAÇÃO DE CAPA");

ok("o formato é 1200×630, que é o que as redes recortam", LARGURA === 1200 && ALTURA === 630);
ok("a capa sai como .webp", caminhoCapa("x").endsWith("-capa.webp"));
ok("o nome bate com o que getPostCoverImage procura", caminhoCapa("meu-slug").includes("/meu-slug-capa.webp"));
ok("lê o infográfico do próprio slug", caminhoSvg("meu-slug").includes("/meu-slug-infographic.svg"));
{
  const fila = lote(TAREFAS.find((t) => t.id === "capa-academia")!);
  const semSvg = fila.hoje.filter((p) => !existsSync(caminhoSvg(p.slug)));
  console.log(`   (aviso) do lote de hoje, ${semSvg.length} sem SVG — esses precisam ser pulados: ${semSvg.map((p) => p.slug).join(", ") || "nenhum"}`);
}

bloco("6. EDIÇÃO SEGURA DENTRO DE lib/blog.ts");

/*
 * Em 03/09/2026, duas tentativas de inserir uma seção de referências caíram
 * no artigo errado — uma delas dentro do corpo de getPostCoverImage. Nas duas
 * o TypeScript compilou. O culpado foi procurar o fim do artigo por
 * indexOf("`,\n  },"), que só funciona em artigo sem campo depois do content.
 * Estes testes existem para essa classe de erro não voltar.
 */
{
  const fonte = readFileSync("lib/blog.ts", "utf8");
  const comCampoDepois = blogPosts.find((p) => (p as any).faq?.length)!;
  const corpo = conteudoDoArtigo(fonte, comCampoDepois.slug);
  ok(`o content lido bate com o do blogPosts (${comCampoDepois.slug})`,
    corpo.length === comCampoDepois.content.length,
    `${corpo.length} × ${comCampoDepois.content.length}`);

  /*
   * O método ingênuo acerta por acaso em parte do acervo — o que o torna
   * traiçoeiro. Aqui a afirmação é a honesta: existe artigo em que ele erra,
   * e crossover-vs-crucifixo é um deles (foi o que mandou a referência para
   * hip-dips-musculacao, 71 mil caracteres adiante).
   */
  const erram = blogPosts.filter((p) => {
    const i = fonte.indexOf(`slug: "${p.slug}"`);
    return fonte.indexOf("`,\n  },", i) !== fechoDoContent(fonte, p.slug);
  });
  ok(`o método ingênuo erra em parte do acervo (${erram.length} de ${blogPosts.length})`, erram.length > 0);
  ok("e erra em crossover-vs-crucifixo, o caso de 03/09",
    erram.some((p) => p.slug === "crossover-vs-crucifixo"));

  const alvo = "quantas-calorias-tem-1kg-de-gordura";
  const depois = acrescentaNoFim(fonte, alvo, "\n<p>marcador de teste</p>\n");
  ok("acrescentaNoFim escreve no artigo certo", conteudoDoArtigo(depois, alvo).endsWith("<p>marcador de teste</p>\n"));
  ok("e não encosta no artigo seguinte",
    conteudoDoArtigo(depois, "crossover-vs-crucifixo") === conteudoDoArtigo(fonte, "crossover-vs-crucifixo"));

  for (const [nome, fn] of [
    ["crase fecharia o literal", () => acrescentaNoFim(fonte, alvo, "tem ` crase")],
    ["${ seria interpolado", () => acrescentaNoFim(fonte, alvo, "tem ${x}")],
    ["slug inexistente", () => acrescentaNoFim(fonte, "nao-existe-mesmo", "x")],
    ["trecho ambíguo dentro do artigo", () => substituiNoArtigo(fonte, alvo, "a", "b")],
    ["trecho que não existe no artigo", () => substituiNoArtigo(fonte, alvo, "zzz-nao-existe-zzz", "b")],
  ] as [string, () => string][]) {
    let erro = false;
    try { fn(); } catch { erro = true; }
    ok(`recusa: ${nome}`, erro);
  }
}

console.log("\n" + "=".repeat(64));
if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
console.log("TODOS OS TESTES PASSARAM");
