/**
 * A fila da manutenção diária do acervo.
 *
 *   npx tsx scripts/manutencao.ts          mostra o lote de hoje
 *   npx tsx scripts/manutencao.ts --json   o mesmo, para script consumir
 *   npx tsx scripts/manutencao.ts --resumo só o placar do que falta
 *
 * O QUE ESTE ARQUIVO É
 *
 * A varredura de 03/09/2026 achou filas de trabalho repetitivo no acervo,
 * somando mais de mil artigos. O combinado com o Renato é atacar um lote por
 * dia, sem parar o resto do trabalho. Este arquivo decide QUAIS artigos
 * entram no lote de hoje.
 *
 * A FILA DE REFERÊNCIAS É DUAS, E ISSO NÃO É DETALHE
 *
 * Dos 759 artigos sem referência, 496 JÁ NOMEIAM a fonte no meio do texto —
 * ali o trabalho é transcrever, e transcrever a 5 por dia é seguro. Outros
 * 105 não nomeiam nada: alguém precisa escolher o estudo, e é onde uma
 * citação errada num site de saúde faz estrago. Esses vão a 2 por dia e
 * saem marcados no PR para o Renato conferir.
 *
 * Os outros 158 são artigos de lugar e preço — "Melhores academias de
 * Barueri" não se sustenta em estudo, se sustenta em ter visitado a
 * academia. Ficam fora das duas filas.
 *
 * A FILA É DERIVADA, NUNCA ARMAZENADA
 *
 * Não existe lista de "já fiz" em lugar nenhum, e isso é de propósito. Cada
 * tarefa é uma PERGUNTA sobre o artigo — "tem referências?", "tem capa?" —
 * e a fila é a resposta de hoje. Artigo consertado sai sozinho; artigo que
 * regredir volta sozinho. Um ledger separado inevitavelmente dessincroniza
 * do código, e aí o robô "conserta" o que já estava certo e pula o que não
 * estava.
 *
 * A ORDEM É POR TRÁFEGO
 *
 * Dentro de cada fila, primeiro os artigos que o Google mais mostra. Fazer
 * 490 artigos leva meses; fazer os 30 mais vistos leva duas semanas e pega
 * metade das impressões. As impressões vêm de data/analytics/impressoes-blog.json,
 * que é atualizado a cada export novo do Search Console.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { blogPosts, getPostCoverImage, type BlogPost } from "../lib/blog";

const IMPRESSOES: Record<string, number> = existsSync("data/analytics/impressoes-blog.json")
  ? JSON.parse(readFileSync("data/analytics/impressoes-blog.json", "utf8")).impressoes
  : {};
export const impressoes = (slug: string) => IMPRESSOES[slug] ?? 0;

const ARQUIVOS = new Set(readdirSync("public/blog-images"));

/** Artigo de academia de uma das cidades atendidas. */
export const ACADEMIA_DE_CIDADE = (p: BlogPost) =>
  /academia/i.test(p.slug) && /alphaville|barueri|tambore|parnaiba|aldeia|carapicuiba|osasco/i.test(p.slug);

/** og:image caiu no genérico do site: o artigo não tem capa própria. */
export const semCapa = (p: BlogPost) => getPostCoverImage(p).url.includes("og-image.jpg");

/**
 * Seção de referências, nas DUAS sintaxes — mesmo motivo do contaH2: 98
 * artigos são Markdown e escrevem `## Referências`, não `<h2>`.
 */
export const semReferencias = (p: BlogPost) =>
  !/<h2>\s*Refer[êe]ncias?\s*<\/h2>/i.test(p.content) && !/^\s*##\s+Refer[êe]ncias?\s*$/im.test(p.content);

/**
 * Subtítulos do artigo, contando as DUAS sintaxes.
 *
 * 98 artigos do acervo são escritos em Markdown e usam `## `, não `<h2>`.
 * A primeira versão desta função só via a tag HTML e jogou os 98 na fila de
 * "sem subtítulo" — todos falsos positivos, e o robô teria "consertado" 98
 * artigos que já estavam estruturados.
 */
export const contaH2 = (p: BlogPost) =>
  (p.content.match(/<h2[\s>]/g) ?? []).length + (p.content.match(/^\s*##\s+\S/gm) ?? []).length;

/** Título ou descrição que o Google corta, ou descrição curta que desperdiça espaço. */
export const metaForaDoLimite = (p: BlogPost) => {
  const t = (p.metaTitle ?? p.title).length;
  const d = (p.metaDescription ?? "").length;
  return t > 60 || d > 160 || d < 120;
};

/**
 * Alt que descreve o arquivo em vez da imagem. É o texto que o gerador de
 * infográfico deixava por padrão, e ele não informa nada a quem usa leitor
 * de tela nem à busca por imagens.
 */
export const ALT_GENERICO = /alt="Infográfico sobre [^"]*—\s*Montinho Personal Trainer"/;
export const altGenerico = (p: BlogPost) => ALT_GENERICO.test(p.content);

/**
 * Infográfico que saiu do gerador com o texto de exemplo dentro — "Ponto
 * principal", "detalhe e contexto aqui". São 57 no disco, e vários estão
 * PUBLICADOS: o leitor vê um cartão com texto de template.
 *
 * Eles ficam fora da fila de alt de propósito. Descrever o que a imagem
 * mostra, quando ela não mostra nada, é polir problema errado — o conserto
 * desses é refazer ou remover o infográfico, decisão que é do Renato.
 */
const TEXTO_DE_TEMPLATE = /Ponto principal|detalhe e contexto aqui|mais informacao relevante|dica pratica e objetiva|baseado em ciencia/i;
export const svgDeTemplate = (p: BlogPost) => {
  for (const m of p.content.matchAll(/src="\/blog-images\/([^"]+\.svg)"/g)) {
    const caminho = `public/blog-images/${m[1]}`;
    if (existsSync(caminho) && TEXTO_DE_TEMPLATE.test(readFileSync(caminho, "utf8"))) return true;
  }
  return false;
};

/**
 * O artigo já NOMEIA uma fonte no meio do texto.
 *
 * Foi o caso de quantas-calorias-tem-1kg-de-gordura, que dizia "Wishnofsky,
 * 1958" em prosa e não tinha seção nenhuma. Formalizar isso é transcrição,
 * não julgamento — e é por isso que essa fila anda mais rápido que a outra.
 * 496 dos 759 pendentes estão neste caso, depois de tirar os de lugar.
 */
const NOMEIA_FONTE = /\b(et al\.|Journal of|British Journal|American Journal|Medicine & Science|Sports Medicine|Cochrane|meta-an[áa]lise|meta-analysis|PubMed|The Lancet|NEJM|revisão sistemática|systematic review)\b/i;
export const citaFonteNoTexto = (p: BlogPost) => NOMEIA_FONTE.test(p.content);

/**
 * Artigo de lugar, preço ou comparação de academia.
 *
 * Estes NÃO entram na fila de referências, e a razão é de conteúdo, não de
 * risco: "Melhores academias de Barueri" não se sustenta em estudo, se
 * sustenta em ter visitado a academia. Anexar bibliografia científica ali é
 * enfeite, e enfeite o Google reconhece. São 158 dos 759.
 */
export const ARTIGO_DE_LUGAR = (p: BlogPost) =>
  /academia|quanto-custa|melhor-|melhores-|onde-|perto-de|como-escolher-.*(academia|personal)|alphaville|barueri|tambore|parnaiba|aldeia-da-serra|carapicuiba|osasco/i.test(p.slug);

export interface Tarefa {
  id: string;
  nome: string;
  /** Quantos artigos por dia. Combinado com o Renato em 03/09/2026. */
  quota: number;
  pendentes: () => BlogPost[];
  /** O que o robô pode e não pode fazer nesta fila, sem depender de memória. */
  regra: string;
}

export const TAREFAS: Tarefa[] = [
  {
    id: "capa-academia",
    nome: "Capa nos artigos de academia das cidades",
    quota: 2,
    pendentes: () => blogPosts.filter((p) => ACADEMIA_DE_CIDADE(p) && semCapa(p)),
    regra:
      "O infográfico SVG já existe para quase todos. Gere a capa com `npx tsx scripts/gerar-capa.ts <slug>`, "
      + "que rasteriza o SVG em 1200×630 .webp — SVG não serve de og:image porque WhatsApp e Facebook não renderizam. "
      + "Só então insira a <img> no topo do artigo. Se não houver SVG, PULE e diga no relatório: capa inventada é pior que capa ausente.",
  },
  {
    id: "referencias-transcrever",
    nome: "Referências: a fonte já está no texto",
    quota: 5,
    pendentes: () => blogPosts.filter((p) => semReferencias(p) && citaFonteNoTexto(p) && !ARTIGO_DE_LUGAR(p)),
    regra:
      "O artigo JÁ nomeia a fonte em prosa — o trabalho é formalizar numa seção, não escolher estudo. "
      + "Leia o trecho onde a fonte aparece e transcreva com autor, título, revista e ano. Complete com o pool "
      + "(data/manutencao/fontes-usadas.json) quando fizer sentido. NUNCA invente DOI, ano ou revista, e NUNCA "
      + "cite estudo que o texto não menciona. Artigo em Markdown recebe `## Referências`, não a tag HTML.",
  },
  {
    id: "referencias-pesquisar",
    nome: "Referências: precisa escolher a fonte",
    quota: 2,
    pendentes: () => blogPosts.filter((p) => semReferencias(p) && !citaFonteNoTexto(p) && !ARTIGO_DE_LUGAR(p)),
    regra:
      "AQUI MORA O RISCO: o texto não nomeia fonte nenhuma, então você escolhe. Use SÓ o pool em "
      + "data/manutencao/fontes-usadas.json, e só quando a fonte sustenta de fato a afirmação do artigo. "
      + "Nenhuma serve? PULE e registre. MARQUE estes artigos no corpo do PR, em seção própria, para o Renato "
      + "conferir — foi o combinado de 03/09. Zero hoje é melhor que uma citação que não sustenta o que está escrito.",
  },
  {
    id: "meta",
    nome: "Título e descrição fora do limite",
    quota: 3,
    pendentes: () => blogPosts.filter(metaForaDoLimite),
    regra:
      "Título até 60, descrição entre 120 e 160. Encurtar preserva o termo de busca no começo; alongar não pode "
      + "prometer o que o artigo não entrega. Nenhuma linha de conteúdo muda, e o slug NUNCA muda. "
      + "scripts/seo-serp-test.ts precisa passar.",
  },
  {
    id: "subtitulos",
    nome: "Artigos com menos de 4 subtítulos",
    quota: 3,
    pendentes: () => blogPosts.filter((p) => contaH2(p) < 4),
    regra:
      "Insira h2 sobre o texto que já existe, agrupando o que já está escrito. Não reescreva afirmação, não invente "
      + "seção, não mude número. Se o artigo for curto demais para 4 seções honestas, deixe com menos e registre — "
      + "subtítulo enfiado à força piora a leitura.",
  },
  {
    id: "alt",
    nome: "Descrição de imagem genérica",
    quota: 2,
    pendentes: () => blogPosts.filter((p) => altGenerico(p) && !svgDeTemplate(p)),
    regra:
      "O alt novo descreve o que a imagem MOSTRA — os números da tabela, os passos do movimento —, lendo o conteúdo "
      + "do próprio SVG em public/blog-images. Não repita o título do artigo: isso é o que o alt genérico já fazia.",
  },
];

const arred = (n: number) => Math.round(n * 10) / 10;

export function lote(t: Tarefa) {
  const p = t.pendentes();
  return {
    tarefa: t,
    pendentes: p.length,
    impressoesPendentes: p.reduce((s, x) => s + impressoes(x.slug), 0),
    diasRestantes: Math.ceil(p.length / t.quota),
    hoje: [...p].sort((a, b) => impressoes(b.slug) - impressoes(a.slug)).slice(0, t.quota),
  };
}

function main() {
  const args = process.argv.slice(2);
  const lotes = TAREFAS.map(lote);

  if (args.includes("--json")) {
    console.log(JSON.stringify(lotes.map((l) => ({
      id: l.tarefa.id, quota: l.tarefa.quota, pendentes: l.pendentes, diasRestantes: l.diasRestantes,
      hoje: l.hoje.map((p) => ({ slug: p.slug, impressoes: impressoes(p.slug) })),
    })), null, 1));
    return;
  }

  const total = lotes.reduce((s, l) => s + l.pendentes, 0);
  console.log("=".repeat(78));
  console.log(`MANUTENÇÃO DO ACERVO — lote de ${new Date().toISOString().slice(0, 10)}`);
  console.log("=".repeat(78));
  console.log(`${blogPosts.length} artigos · ${total} pendências nas filas · ${lotes.reduce((s, l) => s + l.tarefa.quota, 0)} artigos por dia\n`);

  console.log("fila".padEnd(42) + "pendentes".padStart(10) + "impr".padStart(9) + "por dia".padStart(9) + "faltam".padStart(9));
  console.log("-".repeat(78));
  for (const l of lotes) {
    console.log(
      l.tarefa.nome.padEnd(42).slice(0, 42)
      + String(l.pendentes).padStart(10)
      + String(l.impressoesPendentes).padStart(9)
      + String(l.tarefa.quota).padStart(9)
      + `${l.diasRestantes} dias`.padStart(9),
    );
  }

  if (args.includes("--resumo")) return;

  for (const l of lotes) {
    console.log("\n" + "-".repeat(78));
    console.log(`${l.tarefa.id.toUpperCase()} — ${l.tarefa.nome}`);
    console.log("-".repeat(78));
    if (!l.hoje.length) { console.log("  fila vazia: nada a fazer nesta tarefa."); continue; }
    for (const p of l.hoje) {
      const svg = ARQUIVOS.has(`${p.slug}-infographic.svg`);
      const extra = l.tarefa.id === "capa-academia" ? `  [infográfico no disco: ${svg ? "sim" : "NÃO — pular"}]`
        : l.tarefa.id === "subtitulos" ? `  [h2 hoje: ${contaH2(p)}]`
        : l.tarefa.id === "meta" ? `  [título ${(p.metaTitle ?? p.title).length} · descrição ${(p.metaDescription ?? "").length}]`
        : "";
      console.log(`  ${String(impressoes(p.slug)).padStart(5)} impr  ${p.slug}${extra}`);
    }
    console.log(`\n  REGRA: ${l.tarefa.regra}`);
  }

  console.log("\n" + "=".repeat(78));
  console.log("A fila é derivada do próprio código: artigo consertado sai sozinho na próxima rodada.");
  console.log(`No ritmo atual, a última fila termina em ${Math.max(...lotes.map((l) => l.diasRestantes))} dias (${arred(Math.max(...lotes.map((l) => l.diasRestantes)) / 30)} meses).`);
  console.log("");
}

if (require.main === module) main();
