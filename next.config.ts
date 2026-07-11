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
      // Consolidação Tamboré: artigos de blog duplicados de páginas fixas
      { source: "/blog/personal-trainer-a-domicilio-tambore", destination: "/personal-trainer-a-domicilio-tambore", permanent: true },
      { source: "/blog/professor-de-musculacao-tambore", destination: "/professor-de-musculacao-tambore", permanent: true },
      { source: "/blog/treinador-particular-tambore-blog", destination: "/treinador-particular-tambore", permanent: true },
      { source: "/blog/personal-trainer-em-condominio-tambore", destination: "/personal-trainer-condominio-tambore", permanent: true },
      { source: "/blog/personal-trainer-para-condominio-tambore", destination: "/personal-trainer-condominio-tambore", permanent: true },
      { source: "/blog/como-emagrecer-com-deficit-calorico", destination: "/blog/deficit-calorico-como-calcular", permanent: true },
      { source: "/blog/levantamento-terra-tecnica-correta", destination: "/blog/como-fazer-levantamento-terra-corretamente", permanent: true },
      { source: "/blog/suplementos-que-realmente-funcionam", destination: "/blog/suplementos-femininos-guia", permanent: true },
      { source: "/blog/periodizacao-do-treino", destination: "/blog/periodizacao-de-treino", permanent: true },
      { source: "/blog/dor-no-ombro-na-musculacao", destination: "/blog/dor-no-ombro-ao-treinar", permanent: true },
      { source: "/blog/treino-funcional-para-iniciantes", destination: "/blog/treino-funcional-vs-musculacao", permanent: true },
      { source: "/blog/treino-para-iniciantes-em-alphaville", destination: "/blog/academia-para-iniciantes-alphaville", permanent: true },
      { source: "/blog/agachamento-tecnica-correta", destination: "/blog/como-fazer-agachamento-livre-corretamente", permanent: true },
      { source: "/blog/creatina-funciona", destination: "/blog/creatina-para-hipertrofia", permanent: true },
      { source: "/blog/creatina-para-que-serve", destination: "/blog/creatina-para-hipertrofia", permanent: true },
      { source: "/blog/erros-no-treino-de-musculacao", destination: "/blog/erros-comuns-no-treino-de-musculacao", permanent: true },
      { source: "/blog/progressao-de-carga-no-treino", destination: "/blog/progressao-de-carga", permanent: true },
      { source: "/blog/frequencia-de-treino-para-hipertrofia", destination: "/blog/frequencia-de-treino", permanent: true },
      { source: "/blog/ganhar-musculo-apos-os-40", destination: "/blog/hipertrofia-apos-os-40-anos", permanent: true },
      { source: "/blog/ganhar-massa-muscular-apos-os-40", destination: "/blog/hipertrofia-apos-os-40-anos", permanent: true },
      { source: "/blog/retatrutida-para-emagrecer", destination: "/blog/como-potencializar-resultados-retatrutida", permanent: true },
      { source: "/blog/personal-trainer-online", destination: "/blog/personal-trainer-online-como-funciona", permanent: true },
      { source: "/blog/whey-protein-guia-completo", destination: "/blog/whey-protein-como-tomar", permanent: true },
      { source: "/blog/qualidade-do-sono-para-hipertrofia", destination: "/blog/sono-e-crescimento-muscular", permanent: true },
      { source: "/blog/cortisol-e-musculacao", destination: "/blog/cortisol-e-treino", permanent: true },
      { source: "/blog/treino-para-emagrecer", destination: "/blog/como-emagrecer-10-kg", permanent: true },
      { source: "/blog/hiit-para-emagrecer", destination: "/blog/hiit-funciona", permanent: true },
      { source: "/blog/volume-de-treino-para-hipertrofia", destination: "/blog/volume-de-treino-ideal", permanent: true },
      { source: "/blog/treino-para-mulheres-iniciantes", destination: "/blog/hipertrofia-feminina", permanent: true },
      { source: "/blog/como-perder-gordura-mantendo-musculo", destination: "/blog/recomposicao-corporal", permanent: true },
      { source: "/blog/proteina-para-mulheres", destination: "/blog/suplementos-femininos-guia", permanent: true },
      { source: "/blog/como-montar-treino-em-casa", destination: "/blog/treino-em-casa-sem-equipamento", permanent: true },
      { source: "/blog/como-comecar-na-musculacao", destination: "/blog/primeira-semana-na-academia", permanent: true },
      { source: "/blog/avaliacao-fisica-para-que-serve", destination: "/blog/personal-trainer-online-como-funciona", permanent: true },
    ];
  },
};

export default nextConfig;
