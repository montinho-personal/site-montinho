import type { Metadata } from "next";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import SectionTitle from "@/components/ui/SectionTitle";
import { SITE_URL } from "@/lib/blog";
import { RESULTADOS as resultados } from "@/lib/resultados";

export const metadata: Metadata = {
  title: "Resultados e Transformações — Personal Trainer Alphaville",
  description:
    "Veja as transformações reais dos alunos do Montinho Personal Trainer em Alphaville. Resultados de perda de peso, ganho de massa muscular e melhoria de qualidade de vida.",
  alternates: {
    canonical: `${SITE_URL}/resultados`,
  },
  openGraph: {
    title: "Resultados e Transformações | Montinho Personal Trainer Alphaville",
    description:
      "Transformações reais de alunos do Montinho PT em Alphaville, Barueri e Santana de Parnaíba.",
    url: `${SITE_URL}/resultados`,
    type: "website",
  },
};

export default function Resultados() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Resultados"
            title="Transformações que falam por si"
            subtitle="Histórias reais de pessoas que já tinham começado outras vezes — e desta vez conseguiram continuar. Cada uma com o seu ponto de partida, a sua rotina e os seus altos e baixos."
            accent
          />
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.filter((item) => item.photo).map((item, index) => (
              <article
                key={index}
                className="border border-white/10 group hover:border-white/30 transition-colors duration-300"
              >
                {/* Image */}
                <div className={`${item.photoAspect ?? "aspect-[4/3]"} bg-gray-900 overflow-hidden`}>
                  {item.photo ? (
                    <Image
                      src={item.photo}
                      alt={`Transformação de ${item.name}`}
                      width={600}
                      height={450}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: item.objectPosition ?? "center" }}
                      className="opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Antes &amp; Depois</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-gray-400 text-xs">{item.age} · {item.modality}</p>
                    </div>
                    <span
                      className="font-bold text-sm text-right"
                      style={{
                        color: item.photo ? "#BA9E50" : "white",
                        fontFamily: "var(--font-titulo), Georgia, serif",
                      }}
                    >
                      {item.result}
                    </span>
                  </div>

                  {item.duration && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-gray-400 text-xs">{item.duration}</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                  )}

                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <blockquote className="border-l-2 border-white/20 pl-3">
                    <p className="text-gray-300 text-sm italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </blockquote>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-black text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-black mb-5"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            A próxima história pode ser a sua.
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Estas pessoas tinham dúvidas, medos e já tinham tentado de tudo antes. O que mudou foi conseguir continuar, com alguém perto para ajustar quando a rotina mudava. E não se compare com nenhuma delas: cada um tem a própria genética, a própria rotina e a própria história.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-900 transition-all duration-200"
          >
            Falar com o Montinho
          </a>
        </div>
      </section>
    </>
  );
}
