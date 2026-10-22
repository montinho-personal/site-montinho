import Link from "next/link";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";
import VideoMedido from "@/components/blog/VideoMedido";
import { VIDEO_CAMINHO_DIETA_ID, VIDEO_CAMINHO_DIETA_SLUG, VIDEO_CAMINHO_DIETA_TITULO } from "@/lib/video/caminho-dieta";

/**
 * O vídeo do Caminho da Dieta no fim das páginas do caminho: /comece,
 * /comece/dieta e as 4 ferramentas (gasto, meta, macros, cardápio). Nas
 * ferramentas que já têm o tutorial próprio, este vem depois dele: o
 * tutorial ensina a ferramenta, este mostra onde ela fica no caminho.
 */
export default function VideoCaminhoDieta({ pagina, passo }: { pagina: string; passo?: number }) {
  if (!VIDEO_CAMINHO_DIETA_ID) return null;
  const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
  return (
    <section className="py-14 border-t border-white/10 bg-black print:hidden" aria-labelledby={`video-caminho-dieta-${pagina}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#BA9E50] mb-3">
          {passo ? `Você está no passo ${passo} de 4` : "O caminho em 1 minuto e meio"}
        </p>
        <h2 id={`video-caminho-dieta-${pagina}`} className="text-2xl font-bold text-white mb-2" style={h}>
          O Caminho da Dieta, em vídeo
        </h2>
        <p className="text-gray-300 mb-6">
          Gasto, meta, macros e cardápio: o vídeo mostra os 4 passos na ordem, com o número de uma ferramenta entrando
          sozinho na próxima.{" "}
          <Link href="/comece/dieta" className="underline underline-offset-4 hover:text-white">
            Ver o caminho completo
          </Link>
          .
        </p>
        <div data-video-caminho-dieta>
          <YoutubeShortEmbed videoId={VIDEO_CAMINHO_DIETA_ID} title={VIDEO_CAMINHO_DIETA_TITULO} />
        </div>
        <VideoMedido slug={`caminho-dieta-${pagina}`} seletor="[data-video-caminho-dieta]" />
        <p className="mt-6 text-sm">
          <Link href={`/videos/${VIDEO_CAMINHO_DIETA_SLUG}`} className="text-gray-400 hover:text-white underline underline-offset-4">
            Ler o resumo do vídeo
          </Link>
        </p>
      </div>
    </section>
  );
}
