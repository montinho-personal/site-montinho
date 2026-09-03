/**
 * A fila da manutenção diária do acervo.
 *
 *   npx tsx scripts/manutencao.ts          mostra o lote de hoje
 *   npx tsx scripts/manutencao.ts --json   o mesmo, para script consumir
 *   npx tsx scripts/manutencao.ts --resumo só o placar do que falta
 *
 * O QUE ESTE ARQUIVO É
 *
 * A varredura de 03/09/2026 achou cinco filas de trabalho repetitivo no
 * acervo, somando mais de 1.100 artigos. O combinado com o Renato é atacar
 * um lote por dia, sem parar o resto do trabalho. Este arquivo decide QUAIS
 * artigos entram no lote de hoje.
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

export const semReferencias = (p: BlogPost) => !/<h2>\s*Refer[êe]ncias?\s*<\/h2>/i.test(p.content);

export const contaH2 = (p: BlogPost) => (p.content.match(/<h2[\s>]/g) ?? []).length;

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
    id: "referencias",
    nome: "Seção de referências",
    quota: 2,
    pendentes: () => blogPosts.filter(semReferencias),
    regra:
      "NUNCA invente fonte, DOI, ano ou revista. Use apenas o que já está em data/manutencao/fontes-usadas.json, "
      + "que é o conjunto de fontes já citadas no acervo, e apenas quando a fonte de fato sustenta o que o artigo afirma. "
      + "Se nenhuma servir, PULE o artigo e registre o motivo. Zero referências hoje é melhor que uma inventada.",
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
    pendentes: () => blogPosts.filter(altGenerico),
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
  console.log(`${blogPosts.length} artigos · ${total} pendências nas cinco filas · ${lotes.reduce((s, l) => s + l.tarefa.quota, 0)} artigos por dia\n`);

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
