import { blogPosts, imagensDoArtigo, SITE_URL } from "@/lib/blog";

/**
 * Sitemap de imagens dos artigos.
 *
 * DUAS DECISÕES QUE MUDARAM ESTE ARQUIVO
 *
 * 1. As imagens vêm do HTML do artigo, não de um palpite pelo nome do
 *    arquivo. A versão anterior procurava `{slug}-infographic.svg` no disco e
 *    declarava se existisse: 373 infográficos gerados e nunca publicados
 *    entravam aqui como se estivessem numa página. Ao mesmo tempo, artigos
 *    com mais de uma foto perdiam a segunda, porque só a capa era considerada.
 *
 * 2. Só `<image:loc>`. O Google descontinuou `image:title`, `image:caption`,
 *    `image:license` e `image:geo_location` em 2022 e os ignora. Emitir esses
 *    campos gastava três quartos do arquivo para não dizer nada — e um
 *    `caption` repetindo o título do artigo em toda imagem nunca foi legenda,
 *    era preenchimento.
 *
 * O texto alternativo das imagens continua onde importa: dentro do `alt` de
 * cada `<img>` no artigo, que é de onde o Google realmente lê.
 */

function escapaXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-static";

export async function GET() {
  const urls: string[] = [];

  for (const post of blogPosts) {
    const imagens = imagensDoArtigo(post);
    if (imagens.length === 0) continue;
    const linhas = imagens
      .map((url) => `    <image:image>\n      <image:loc>${escapaXml(url)}</image:loc>\n    </image:image>`)
      .join("\n");
    urls.push(`  <url>\n    <loc>${escapaXml(`${SITE_URL}/blog/${post.slug}`)}</loc>\n${linhas}\n  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
