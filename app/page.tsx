import type { Metadata } from "next";
import Script from "next/script";
import Hero from "@/components/home/Hero";
import Diferenciais from "@/components/home/Diferenciais";
import ComoFunciona from "@/components/home/ComoFunciona";
import MinhaHistoriaPreview from "@/components/home/MinhaHistoriaPreview";
import Resultados from "@/components/home/Resultados";
import Depoimentos from "@/components/home/Depoimentos";
import CTAFinal from "@/components/home/CTAFinal";
import HomeFAQ from "@/components/home/HomeFAQ";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "O que é um personal trainer online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Um personal trainer online cria seu programa de treino personalizado, acompanha sua evolução e ajusta o plano periodicamente — tudo à distância. Você treina na academia, em casa ou onde preferir, com o mesmo nível de personalização do presencial.",
      },
    },
    {
      "@type": "Question",
      name: "Qual a diferença entre personal trainer online e presencial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O presencial oferece supervisão direta a cada sessão — ideal para iniciantes e pessoas com histórico de lesões. O online oferece flexibilidade de horário e local com o mesmo nível de personalização. Para a maioria dos objetivos, os resultados são equivalentes.",
      },
    },
    {
      "@type": "Question",
      name: "Quanto tempo leva para ver resultado com personal trainer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Os primeiros resultados perceptíveis aparecem entre 3 e 6 semanas. Resultados expressivos no espelho e nos exames se consolidam entre 3 e 6 meses de treino consistente.",
      },
    },
    {
      "@type": "Question",
      name: "Como funciona o atendimento em Alphaville?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O atendimento presencial acontece na região de Alphaville, em Barueri/Santana de Parnaíba. A consultoria online atende alunos em qualquer cidade do Brasil. O primeiro contato é gratuito e sem compromisso.",
      },
    },
    {
      "@type": "Question",
      name: "Preciso de academia para fazer consultoria online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não necessariamente. O programa é montado de acordo com os equipamentos que você tem disponíveis — academia completa, sala de casa, condomínio ou apenas peso corporal. O treino é adaptado à sua realidade.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Personal Trainer Alphaville | Montinho",
  description:
    "Personal Trainer em Alphaville especialista em emagrecimento. Resultados reais sem fórmulas mágicas. Ciência, experiência e acompanhamento próximo.",
  alternates: {
    canonical: "https://www.montinhopersonal.com.br",
  },
  openGraph: {
    title: "Personal Trainer Alphaville | Montinho",
    description:
      "Personal Trainer em Alphaville especialista em emagrecimento. Resultados reais sem fórmulas mágicas. Ciência e acompanhamento próximo.",
    url: "https://www.montinhopersonal.com.br",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Montinho Personal Trainer — Alphaville, Barueri e Santana de Parnaíba",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero />
      <Diferenciais />
      <ComoFunciona />
      <MinhaHistoriaPreview />
      <Resultados />
      <Depoimentos />
      <HomeFAQ />
      <CTAFinal />
    </>
  );
}
