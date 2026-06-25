import { getWhatsAppUrl } from "@/lib/whatsapp";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #333 0%, transparent 60%), radial-gradient(circle at 80% 20%, #222 0%, transparent 50%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Eyebrow */}
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-400 mb-6">
          Personal Trainer · Alphaville · Online
        </p>

        {/* Main Headline */}
        <h1
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 max-w-5xl mx-auto"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Transforme seu corpo.{" "}
          <span className="text-gray-400">Sem fórmulas mágicas.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
          Ciência aplicada, experiência real e acompanhamento próximo para
          resultados que duram. Para quem quer transformação de verdade.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={getWhatsAppUrl("Olá! Vim pelo site e quero saber mais sobre o Personal Trainer.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200 hover:shadow-lg hover:shadow-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Quero Transformar Meu Corpo
          </a>
          <Link
            href="/minha-historia"
            className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 text-base font-medium tracking-wide hover:border-white hover:bg-white/5 transition-all duration-200"
          >
            Conheça minha história
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-16 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-2xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>+20 anos</span>
            <span className="text-sm">de experiência em musculação</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-2xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>100+</span>
            <span className="text-sm">alunos transformados</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-2xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>Online</span>
            <span className="text-sm">em todo o Brasil</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
        <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent" />
      </div>
    </section>
  );
}
