import fs from "fs";
import path from "path";
import { blogPosts, getPostCoverImage, SITE_URL } from "@/lib/blog";

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET() {
  const blogImagesDir = path.join(process.cwd(), "public", "blog-images");

  const urls = blogPosts.map((post) => {
    const pageUrl = `${SITE_URL}/blog/${post.slug}`;
    const title = escapeXml(post.title);
    const cover = getPostCoverImage(post);
    const coverIsDefault = cover.url.endsWith("/og-image.jpg");

    const images: string[] = [];

    // Foto real do artigo (quando existe — a imagem padrão do site não entra
    // no sitemap de imagens, já que não é conteúdo do artigo).
    if (!coverIsDefault) {
      images.push(`    <image:image>
      <image:loc>${cover.url}</image:loc>
      <image:title>${title}</image:title>
      <image:caption>${title} — Montinho Personal Trainer</image:caption>
    </image:image>`);
    }

    // Infográfico do artigo, quando o arquivo existe.
    const infographicFile = path.join(blogImagesDir, `${post.slug}-infographic.svg`);
    if (fs.existsSync(infographicFile)) {
      images.push(`    <image:image>
      <image:loc>${SITE_URL}/blog-images/${post.slug}-infographic.svg</image:loc>
      <image:title>${title}</image:title>
      <image:caption>Infográfico: ${title} — Montinho Personal Trainer</image:caption>
    </image:image>`);
    }

    if (images.length === 0) return "";

    return `  <url>
    <loc>${pageUrl}</loc>
${images.join("\n")}
  </url>`;
  }).filter(Boolean);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
