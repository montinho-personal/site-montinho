import Link from "next/link";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";
import VideoMedido from "@/components/blog/VideoMedido";
import { VIDEO_CAMINHO_DIETA_ID, VIDEO_CAMINHO_DIETA_SLUG, VIDEO_CAMINHO_DIETA_TITULO } from "@/lib/video/caminho-dieta";
import { VIDEO_CAMINHO_TREINO_ID, VIDEO_CAMINHO_TREINO_SLUG, VIDEO_CAMINHO_TREINO_TITULO } from "@/lib/video/caminho-treino";
import type { TrilhaId } from "@/lib/ferramentas/trilha";

const VIDEOS: Record<TrilhaId, { id: string; slug: string; titulo: string; nome: string; passos: number; resumo: string }> = {
  dieta: {
    id: VIDEO_CAMINHO_DIETA_ID,
    slug: VIDEO_CAMINHO_DIETA_SLUG,
    titulo: VIDEO_CAMINHO_DIETA_TITULO,
    nome: "O Caminho da Dieta",
    passos: 4,
    resumo: "Gasto, meta, macros e cardápio: o vídeo mostra os 4 passos na ordem, com o número de uma ferramenta entrando sozinho na próxima.",
  },
  treino: {
    id: VIDEO_CAMINHO_TREINO_ID,
    slug: VIDEO_CAMINHO_TREINO_SLUG,
    titulo: VIDEO_CAMINHO_TREINO_TITULO,
    nome: "O Caminho do Treino",
    passos: 5,
    resumo: "Diagnóstico, rotina, volume, carga e execução: o vídeo mostra os 5 passos na ordem, do seu perfil de treino à série que você grava e me manda.",
  },
};

/**
 * O vídeo de cada caminho no fim das páginas dele: /comece, /comece/<trilha>
 * e as ferramentas da trilha. Nas que já têm tutorial próprio, este vem
 * depois dele: o tutorial ensina a ferramenta, este mostra onde ela fica no
 * caminho.
 */
export default function VideoCaminho({ trilha, pagina, passo }: { trilha: TrilhaId; pagina: string; passo?: number }) {
  const v = VIDEOS[trilha];
  if (!v.id) return null;
  const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
  const ancora = `video-caminho-${trilha}-${pagina}`;
  return (
    <section className="py-14 border-t border-white/10 bg-black print:hidden" aria-labelledby={ancora}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#BA9E50] mb-3">
          {passo ? `Você está no passo ${passo} de ${v.passos}` : "O caminho em menos de 2 minutos"}
        </p>
        <h2 id={ancora} className="text-2xl font-bold text-white mb-2" style={h}>
          {v.nome}, em vídeo
        </h2>
        <p className="text-gray-300 mb-6">
          {v.resumo}{" "}
          <Link href={`/comece/${trilha}`} className="underline underline-offset-4 hover:text-white">
            Ver o caminho completo
          </Link>
          .
        </p>
        <div data-video-caminho={trilha}>
          <YoutubeShortEmbed videoId={v.id} title={v.titulo} />
        </div>
        <VideoMedido slug={`caminho-${trilha}-${pagina}`} seletor={`[data-video-caminho="${trilha}"]`} />
        <p className="mt-6 text-sm">
          <Link href={`/videos/${v.slug}`} className="text-gray-400 hover:text-white underline underline-offset-4">
            Ler o resumo do vídeo
          </Link>
        </p>
      </div>
    </section>
  );
}
