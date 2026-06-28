import { blogPosts, SITE_URL } from "@/lib/blog";

export async function GET() {
  const urls = blogPosts.map((post) => {
    const imgUrl = `${SITE_URL}/blog-images/${post.slug}-infographic.svg`;
    const pageUrl = `${SITE_URL}/blog/${post.slug}`;
    const title = post.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `  <url>
    <loc>${pageUrl}</loc>
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${title}</image:title>
      <image:caption>Infográfico: ${title} — Montinho Personal Trainer</image:caption>
    </image:image>
  </url>`;
  });

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
