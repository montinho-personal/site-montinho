import { MOBILIDADE_NO_AR } from "@/lib/mobilidade/lancamento";
import type { MetadataRoute } from "next";
import { blogPosts, SITE_URL } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/consultoria`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/consultoria-online`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pergunte-ao-montinho`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/diagnostico`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ferramentas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ferramentas/calculadora-de-proteina`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/comece`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/comece/dieta`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/comece/treino`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ferramentas/calculadora-tmb-tdee`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ferramentas/calculadora-deficit-calorico`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ferramentas/calculadora-1rm`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ferramentas/calculadora-macros`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ferramentas/calculadora-volume-treino`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ferramentas/monte-seu-cardapio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // O teste de mobilidade só entra quando a chave de lançamento abrir.
    ...(MOBILIDADE_NO_AR
      ? [{
          url: `${SITE_URL}/ferramentas/teste-mobilidade`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        }]
      : []),
    {
      url: `${SITE_URL}/academia-ideal-alphaville`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/academias-alphaville`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/revisao-de-execucao`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/treino-para-minha-rotina`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/minha-historia`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/resultados`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  // Paginas locais de servico (SEO local) — antes ausentes do sitemap
  const localPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/academia-com-personal-trainer-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/melhor-personal-trainer-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-em-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-a-domicilio-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-alphaville`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-barueri`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-condominio-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-em-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-feminino-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-online-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-para-emagrecer-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-para-hipertrofia-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-para-idosos-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-para-iniciantes-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-para-reabilitacao-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-santana-de-parnaiba`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/personal-trainer-tambore-barueri`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/professor-de-musculacao-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/quanto-custa-personal-trainer-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/treinador-particular-tambore`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...localPages, ...blogPages];
}
