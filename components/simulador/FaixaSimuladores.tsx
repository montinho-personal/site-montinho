import Link from "next/link";
import { SIMULADORES } from "@/lib/simuladores";

/**
 * Faixa de destaque dos Simuladores dentro de /ferramentas.
 *
 * Fica ANTES do catálogo: quem chega com "quanto tempo até..." resolve
 * aqui sem precisar procurar entre 35 calculadoras. Server component, sem
 * JavaScript. Escolha pelo objetivo, não pelo nome da ferramenta.
 */
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export default function FaixaSimuladores() {
  return (
    <section className="pb-2 bg-black" aria-labelledby="faixa-simuladores" data-testid="faixa-simuladores">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-5 sm:p-6 relative">
          <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: "#BA9E50" }}>Novo · Simuladores Montinho</p>
              <h2 id="faixa-simuladores" className="text-white font-bold text-xl sm:text-2xl" style={h}>Quanto tempo até o seu objetivo?</h2>
              <p className="text-gray-400 text-sm mt-1">Calculadora responde “quanto”. Simulador mostra o caminho — e o que mais mudaria ele.</p>
            </div>
            <Link href="/simuladores" className={`text-gray-300 text-sm underline underline-offset-4 decoration-1 hover:text-white min-h-[44px] inline-flex items-center shrink-0 ${foco}`}>
              O que é um simulador →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {SIMULADORES.map((s) => (
              <Link key={s.id} href={s.href} className={`group border border-white/15 hover:border-[#BA9E50] p-4 min-h-[88px] flex items-center justify-between gap-3 transition-colors ${foco}`}>
                <span>
                  <span className="block text-white font-bold text-lg" style={h}>{s.pergunta}</span>
                  <span className="block text-gray-400 text-sm mt-0.5">{s.nome} · {s.tempo}</span>
                </span>
                <span aria-hidden="true" className="text-[#BA9E50] text-xl transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
