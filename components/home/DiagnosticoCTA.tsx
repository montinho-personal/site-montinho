import Link from "next/link";

/**
 * CTA secundário da home para o Diagnóstico Montinho.
 * Discreto de propósito: complementa (não compete com) o CTA comercial.
 */
export default function DiagnosticoCTA() {
  return (
    <section className="py-14 bg-black border-t border-white/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-4">
          Não sabe por onde começar?
        </p>
        <h2
          className="text-2xl sm:text-3xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Descubra qual estratégia de treino combina com você
        </h2>
        <p className="text-gray-400 leading-relaxed mb-7 max-w-xl mx-auto">
          9 perguntas rápidas sobre sua rotina e objetivo, e você recebe uma
          orientação inicial personalizada. Gratuito, leva 1–2 minutos.
        </p>
        <Link
          href="/diagnostico"
          className="inline-flex items-center justify-center border border-white text-white px-8 py-3.5 text-sm font-semibold tracking-wide hover:bg-white hover:text-black transition-all duration-200"
        >
          Fazer meu Diagnóstico Montinho
        </Link>
      </div>
    </section>
  );
}
