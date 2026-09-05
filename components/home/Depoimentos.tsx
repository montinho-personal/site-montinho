"use client";

/**
 * Depoimentos do Google.
 *
 * Mostra três e guarda o resto atrás de um botão. O motivo não é estético:
 * sete cartões empilhados no celular são sete telas de rolagem entre a
 * pessoa e o próximo bloco da página, e prova social boa vira parede. Três
 * bastam para convencer quem já está convencido e para dar contexto a quem
 * não está.
 *
 * Os depoimentos escondidos continuam no HTML — só não são exibidos. Isso
 * mantém o texto disponível para quem usa leitor de tela ao expandir e para
 * o Google, sem custo de rolagem para quem não pediu.
 *
 * Nada aqui é inventado: os textos vêm de data/testimonials.json, copiados
 * das avaliações públicas, e a contagem total é a do perfil.
 */

import { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { trackEvent } from "@/lib/analytics";
import testimonials from "@/data/testimonials.json";

interface Review {
  name: string;
  role: string;
  text: string;
  stars: number;
}

const dados = testimonials as {
  source: string;
  placeRating: number;
  totalReviews: number;
  /** URL pública do perfil. Vazio = nenhum link, nunca uma URL inventada. */
  profileUrl?: string;
  reviews: Review[];
};

const reviews: Review[] = dados.reviews.filter((r) => r.stars >= 4);
const VISIVEIS = 3;

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mb-4" aria-label={`${count} de 5 estrelas`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" className="text-white" aria-hidden="true">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  );
}

function Cartao({ dep, oculto }: { dep: Review; oculto: boolean }) {
  return (
    <div
      hidden={oculto}
      className="border border-white/10 p-8 flex flex-col hover:border-white/30 transition-colors duration-300"
      style={{ background: "#111" }}
    >
      <StarRating count={dep.stars} />
      <blockquote className="text-gray-300 text-sm leading-relaxed flex-1 mb-6 italic font-light">
        &ldquo;{dep.text}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0" aria-hidden="true">
          {dep.name.charAt(0)}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{dep.name}</p>
          <p className="text-gray-400 text-xs">{dep.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Depoimentos() {
  const [expandido, setExpandido] = useState(false);
  const fromGoogle = dados.source.startsWith("google");
  const restantes = reviews.length - VISIVEIS;
  const perfil = dados.profileUrl?.trim();

  return (
    <section className="py-20 border-t border-white/10" style={{ background: "#0d0d0d" }} id="depoimentos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionTitle
            eyebrow="Depoimentos"
            title="O que dizem meus alunos"
            subtitle="Histórias reais de pessoas que decidiram investir em si mesmas."
          />
          {fromGoogle && dados.placeRating && (
            <p className="mt-4 text-gray-300 text-sm">
              <span className="text-white font-semibold">{Number(dados.placeRating).toFixed(1)} ★</span>
              {" "}no Google · {dados.totalReviews} avaliações
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((dep, i) => (
            <Cartao key={dep.name} dep={dep} oculto={i >= VISIVEIS && !expandido} />
          ))}
        </div>

        {(restantes > 0 || perfil) && (
          <div className="mt-10 flex flex-col items-center gap-4">
            {restantes > 0 && !expandido && (
              <button
                type="button"
                onClick={() => {
                  setExpandido(true);
                  trackEvent("testimonials_expand", { placement: "home", visible_before: VISIVEIS, total_shown: reviews.length });
                }}
                aria-expanded={false}
                className="border border-white/20 hover:border-[#BA9E50] text-white text-sm px-6 py-3 min-h-[48px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50]"
              >
                Ver mais {restantes} {restantes === 1 ? "depoimento" : "depoimentos"}
              </button>
            )}

            {/*
              O link para o Google só existe se a URL do perfil estiver no
              JSON. Uma avaliação verificável na fonte vale mais do que um
              texto solto no site — mas link inventado quebra a confiança que
              o depoimento deveria construir.
            */}
            {perfil && (
              <a
                href={perfil}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("testimonials_google_click", { placement: "home" })}
                className="text-gray-400 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors"
                style={{ textDecorationColor: "#BA9E50" }}
              >
                Ver as {dados.totalReviews} avaliações no Google →
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
