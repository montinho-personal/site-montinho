import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Diferenciais from "@/components/home/Diferenciais";
import ComoFunciona from "@/components/home/ComoFunciona";
import MinhaHistoriaPreview from "@/components/home/MinhaHistoriaPreview";
import Resultados from "@/components/home/Resultados";
import Depoimentos from "@/components/home/Depoimentos";
import CTAFinal from "@/components/home/CTAFinal";

export const metadata: Metadata = {
  title:
    "Montinho Personal Trainer | Alphaville, Barueri e Santana de Parnaíba",
  description:
    "Personal Trainer especialista em emagrecimento em Alphaville, Barueri e Santana de Parnaíba. Resultados reais. Sem fórmulas mágicas. Ciência, experiência e acompanhamento próximo.",
  alternates: {
    canonical: "https://www.montinhopersonal.com.br",
  },
  openGraph: {
    title: "Montinho Personal Trainer | Alphaville, Barueri e Santana de Parnaíba",
    description:
      "Personal Trainer especialista em emagrecimento em Alphaville. Resultados reais através de ciência e acompanhamento próximo.",
    url: "https://www.montinhopersonal.com.br",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Diferenciais />
      <ComoFunciona />
      <MinhaHistoriaPreview />
      <Resultados />
      <Depoimentos />
      <CTAFinal />
    </>
  );
}
