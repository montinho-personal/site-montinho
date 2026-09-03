/**
 * Gera a capa .webp de um artigo a partir do infográfico SVG que ele já exibe.
 *
 *   npx tsx scripts/gerar-capa.ts <slug> [<slug> ...]
 *
 * POR QUE A CAPA NÃO PODE SER O PRÓPRIO SVG
 *
 * 449 artigos caem na imagem genérica do site no og:image, e boa parte deles
 * TEM um infográfico — só que em SVG. WhatsApp, Facebook e LinkedIn não
 * renderizam SVG em prévia de link: o card sai vazio ou com a imagem padrão.
 * O Google também prefere raster para a imagem de artigo.
 *
 * Rasterizar o SVG que já está na página resolve os dois lados sem inventar
 * imagem nenhuma: a capa passa a ser exatamente o que o leitor vê no artigo.
 *
 * 1200×630 é a proporção que as três redes recortam sem cortar conteúdo, e é
 * a mesma do og-image padrão do site.
 */

import sharp from "sharp";
import { existsSync, readFileSync } from "node:fs";

export const LARGURA = 1200;
export const ALTURA = 630;

export function caminhoSvg(slug: string) {
  return `public/blog-images/${slug}-infographic.svg`;
}
export function caminhoCapa(slug: string) {
  return `public/blog-images/${slug}-capa.webp`;
}

export async function geraCapa(slug: string): Promise<{ ok: boolean; motivo?: string; bytes?: number }> {
  const svg = caminhoSvg(slug);
  if (!existsSync(svg)) return { ok: false, motivo: "não existe infográfico SVG para este slug" };
  const destino = caminhoCapa(slug);
  if (existsSync(destino)) return { ok: false, motivo: "a capa já existe" };

  const bruto = readFileSync(svg);
  /*
   * `density` alto antes do resize evita a borda serrilhada que aparece
   * quando o SVG é rasterizado direto no tamanho final. `fit: contain` com
   * o fundo da casa garante 1200×630 exatos mesmo se o viewBox variar.
   */
  const buffer = await sharp(bruto, { density: 300 })
    .resize(LARGURA, ALTURA, { fit: "contain", background: { r: 13, g: 13, b: 13, alpha: 1 } })
    .webp({ quality: 88 })
    .toBuffer();

  await sharp(buffer).toFile(destino);
  return { ok: true, bytes: buffer.length };
}

async function main() {
  const slugs = process.argv.slice(2);
  if (!slugs.length) {
    console.error("Uso: npx tsx scripts/gerar-capa.ts <slug> [<slug> ...]");
    process.exit(1);
  }
  let falhas = 0;
  for (const slug of slugs) {
    const r = await geraCapa(slug);
    if (r.ok) console.log(`  ok      ${caminhoCapa(slug)} (${Math.round(r.bytes! / 1024)} KB)`);
    else { falhas++; console.log(`  PULADO  ${slug}: ${r.motivo}`); }
  }
  console.log(`\n${slugs.length - falhas} capa(s) gerada(s), ${falhas} pulada(s).`);
  console.log("A capa só entra no ar depois de a <img> ser inserida no topo do artigo.");
}

if (require.main === module) main();
