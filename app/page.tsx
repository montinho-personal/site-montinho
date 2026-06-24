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
    "Montinho Personal Trainer | Transformação Real em Alphaville e Online",
  description:
    "Personal Trainer especialista em emagrecimento em Alphaville, Barueri e Santana de Parnaíba. Resultados reais. Sem fórmulas mágicas. Ciência, experiência e acompanhamento próximo.",
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
