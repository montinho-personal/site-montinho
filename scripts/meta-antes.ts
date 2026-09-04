/**
 * O antes/depois de título e descrição.
 *
 * POR QUE ISTO EXISTE
 *
 * A fila de meta é a única da rotina que mexe num sinal de CTR, e o efeito
 * dela só aparece no Search Console duas a quatro semanas depois. Até hoje a
 * rotina reescrevia o título e não guardava em lugar nenhum o que estava
 * escrito antes — se o clique caísse, não havia como olhar para trás e ver o
 * que mudou. A fila ainda ordena por impressão, então ela começa exatamente
 * pelas páginas onde isso mais importaria.
 *
 * O registro é gravado ANTES da edição, e nunca é sobrescrito: o valor de um
 * antes/depois é o primeiro "antes". Se a mesma página for editada de novo
 * daqui a três meses, o registro continua sendo o estado original — que é
 * contra o que a comparação faz sentido.
 *
 * USO
 *
 *   npx tsx scripts/meta-antes.ts registrar <slug> [<slug> ...]
 *   npx tsx scripts/meta-antes.ts conferir
 *
 * `registrar` roda antes de editar. `conferir` mostra o que já mudou desde o
 * registro, para cruzar com o Search Console.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { blogPosts } from "../lib/blog";
import { impressoes } from "./manutencao";

export const CAMINHO = "data/manutencao/meta-antes.json";

export interface RegistroMeta {
  /** O que o Google exibia como título — metaTitle quando existe, senão title. */
  titulo: string;
  descricao: string;
  /** Impressões na época do registro: sem denominador, "caiu" não quer dizer nada. */
  impressoes: number;
  /** Data do registro, para casar com o período do Search Console. */
  data: string;
}

export type Registros = Record<string, RegistroMeta>;

export function leRegistros(): Registros {
  if (!existsSync(CAMINHO)) return {};
  return JSON.parse(readFileSync(CAMINHO, "utf8")) as Registros;
}

export function gravaRegistros(r: Registros) {
  mkdirSync("data/manutencao", { recursive: true });
  writeFileSync(CAMINHO, JSON.stringify(r, null, 1) + "\n");
}

/** O que o Google exibe hoje para este slug. */
export function metaAtual(slug: string): { titulo: string; descricao: string } {
  const p = blogPosts.find((x) => x.slug === slug);
  if (!p) throw new Error(`slug não existe no acervo: ${slug}`);
  return { titulo: p.metaTitle ?? p.title, descricao: p.metaDescription ?? "" };
}

/**
 * Grava o estado atual de um slug.
 *
 * Devolve `false` sem gravar quando já existe registro — não é erro, é o
 * comportamento certo: o primeiro "antes" é o que vale.
 */
export function registra(slug: string, hoje = new Date().toISOString().slice(0, 10)): boolean {
  const r = leRegistros();
  if (r[slug]) return false;
  const { titulo, descricao } = metaAtual(slug);
  r[slug] = { titulo, descricao, impressoes: impressoes(slug), data: hoje };
  gravaRegistros(r);
  return true;
}

/** Os registros cujo título ou descrição mudou desde a gravação. */
export function mudados(): Array<{ slug: string; antes: RegistroMeta; agora: { titulo: string; descricao: string } }> {
  const r = leRegistros();
  const saida = [];
  for (const [slug, antes] of Object.entries(r)) {
    if (!blogPosts.some((p) => p.slug === slug)) continue;
    const agora = metaAtual(slug);
    if (agora.titulo !== antes.titulo || agora.descricao !== antes.descricao) {
      saida.push({ slug, antes, agora });
    }
  }
  return saida.sort((a, b) => b.antes.impressoes - a.antes.impressoes);
}

function main() {
  const [cmd, ...slugs] = process.argv.slice(2);

  if (cmd === "registrar") {
    if (!slugs.length) {
      console.error("Uso: npx tsx scripts/meta-antes.ts registrar <slug> [<slug> ...]");
      process.exit(1);
    }
    for (const slug of slugs) {
      const novo = registra(slug);
      const { titulo, descricao } = metaAtual(slug);
      console.log(
        novo
          ? `  gravado  ${slug}\n           título (${titulo.length}): ${titulo}\n           descrição (${descricao.length}): ${descricao.slice(0, 80)}...`
          : `  já tinha  ${slug} — o registro antigo é o que vale, mantido`
      );
    }
    return;
  }

  if (cmd === "conferir") {
    const lista = mudados();
    const total = Object.keys(leRegistros()).length;
    console.log(`${total} página(s) registrada(s) · ${lista.length} já editada(s)\n`);
    for (const { slug, antes, agora } of lista) {
      console.log(`${slug}  (${antes.impressoes} impressões em ${antes.data})`);
      if (antes.titulo !== agora.titulo) {
        console.log(`  título     antes (${antes.titulo.length}): ${antes.titulo}`);
        console.log(`             agora (${agora.titulo.length}): ${agora.titulo}`);
      }
      if (antes.descricao !== agora.descricao) {
        console.log(`  descrição  antes: ${antes.descricao.length} caracteres`);
        console.log(`             agora: ${agora.descricao.length} caracteres`);
      }
      console.log();
    }
    if (!lista.length) console.log("Nada editado desde o registro.");
    return;
  }

  console.error("Comandos: registrar <slug...> | conferir");
  process.exit(1);
}

if (require.main === module) main();
