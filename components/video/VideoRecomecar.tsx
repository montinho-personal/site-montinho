import Link from "next/link";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";

/**
 * O vídeo "aprenda a recomeçar rápido" nas páginas de atendimento.
 *
 * Entra em todas as páginas de serviço (presencial, online e landing pages
 * de anúncio) porque é a ideia que a marca vende desde 01/10/2026: não é só
 * começar, é conseguir continuar — e quem consegue continuar é quem volta
 * rápido depois de errar. Pedido do Montinho em 01/10/2026.
 *
 * `semSaida` tira o link para /videos: nas landing pages de anúncio a única
 * saída que importa é o WhatsApp.
 */
export default function VideoRecomecar({ semSaida = false }: { semSaida?: boolean }) {
  return (
    <section className="py-16 border-t border-white/10 bg-black" aria-labelledby="video-recomecar">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#BA9E50] mb-3">Em 1 minuto</p>
        <h2
          id="video-recomecar"
          className="text-2xl sm:text-3xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
        >
          O maior conselho que eu dou: aprenda a recomeçar rápido
        </h2>
        <p className="text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
          Faltou no treino ou saiu da dieta? Acontece com todo mundo. O que separa quem chega lá de quem desiste
          não é nunca errar — é voltar no próximo dia, sem transformar um deslize em semanas parado.
        </p>
        <YoutubeShortEmbed videoId="Dg8Sbv6_V8w" title="O maior conselho para emagrecer: aprenda a recomeçar rápido — Montinho Personal Trainer" />
        {!semSaida && (
          <p className="mt-6 text-sm">
            <Link href="/videos/aprenda-a-recomecar-rapido" className="text-gray-400 hover:text-white underline underline-offset-4">
              Ler o resumo do vídeo
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
