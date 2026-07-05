import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/blog-images/:path*.svg",
        headers: [
          { key: "Content-Type", value: "image/svg+xml; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Slugs antigos com caracteres invalidos em URL (acento / maiusculas)
      {
        source: "/blog/horm%C3%B4nios-femininos-apos-40-treino",
        destination: "/blog/hormonios-femininos-apos-40-treino",
        permanent: true,
      },
      {
        source: "/blog/deficiencia-energia-atleta-RED-S-recuperacao",
        destination: "/blog/deficiencia-energia-atleta-red-s-recuperacao",
        permanent: true,
      },
      // Slugs planejados que nunca existiram mas receberam links internos
      // (links corrigidos na origem; redirects cobrem URLs ja rastreadas)
      { source: "/blog/sobrecarga-progressiva-guia-completo", destination: "/blog/progressao-de-carga", permanent: true },
      { source: "/blog/frequencia-de-treino-ideal", destination: "/blog/frequencia-de-treino", permanent: true },
      { source: "/blog/sono-e-emagrecimento", destination: "/blog/otimizar-sono-para-recuperacao-muscular", permanent: true },
      { source: "/blog/estresse-cortisol-peso", destination: "/blog/cortisol-e-treino", permanent: true },
      { source: "/blog/habitos-saudaveis-consistencia", destination: "/blog/habitos-que-sabotam-seu-emagrecimento", permanent: true },
      { source: "/blog/proteina-para-ganhar-musculo", destination: "/blog/quanta-proteina-por-dia-para-ganhar-massa-muscular", permanent: true },
      { source: "/blog/carboidrato-no-treino", destination: "/blog/carboidrato-antes-do-treino", permanent: true },
      { source: "/blog/como-calcular-macros", destination: "/blog/deficit-calorico-como-calcular", permanent: true },
      { source: "/blog/como-calcular-deficit-calorico", destination: "/blog/deficit-calorico-como-calcular", permanent: true },
      { source: "/blog/gordura-localizada-mitos-verdades", destination: "/blog/gordura-localizada-mitos-e-fatos", permanent: true },
      { source: "/blog/personal-trainer-alphaville", destination: "/personal-trainer-alphaville", permanent: true },
    ];
  },
};

export default nextConfig;
