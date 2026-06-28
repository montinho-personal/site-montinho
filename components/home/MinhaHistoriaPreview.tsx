import Link from "next/link";
import Image from "next/image";

export default function MinhaHistoriaPreview() {
  return (
    <section className="py-20 bg-white/5 border-t border-white/10" id="historia">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] bg-gray-900 overflow-hidden">
              <Image
                src="/foto-historia-montinho-personal.jpeg"
                alt="Montinho Personal Trainer"
                width={800}
                height={1000}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                className="opacity-90"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-white/20" />
            <div className="absolute -top-4 -left-4 w-32 h-32 border border-white/10" />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">
              Minha História
            </p>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Eu já estive do outro lado.
            </h2>

            <div className="flex flex-col gap-4 text-gray-300 text-base leading-relaxed font-light">
              <p>
                Cresci convivendo com a obesidade. Passava de dieta em dieta,
                perdendo peso aqui, recuperando ali — e com isso, perdendo também
                a autoestima e a esperança.
              </p>
              <p>
                Foi quando decidi estudar de verdade. Entender o que a ciência
                diz sobre treinamento e nutrição. E a partir daí, transformei meu
                próprio corpo — não com fórmulas mágicas, mas com método,
                consistência e paciência.
              </p>
              <p>
                Hoje ajudo outras pessoas a fazer o mesmo, sem passar pelo mesmo
                caminho tortuoso que eu percorri.
              </p>
            </div>

            <blockquote className="border-l-2 border-white/30 pl-5 py-1">
              <p
                className="text-white text-lg italic leading-relaxed"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                "Resultados reais. Sem fórmulas mágicas."
              </p>
            </blockquote>

            <Link
              href="/minha-historia"
              className="inline-flex items-center gap-2 text-white font-medium hover:text-gray-300 transition-colors duration-200 group mt-2 self-start"
            >
              Leia minha história completa
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="group-hover:translate-x-1 transition-transform duration-200"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
