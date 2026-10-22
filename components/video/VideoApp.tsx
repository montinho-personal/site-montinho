import Link from "next/link";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";
import VideoMedido from "@/components/blog/VideoMedido";
import { VIDEO_APP_ID, VIDEO_APP_SLUG, VIDEO_APP_TITULO } from "@/lib/video/app";

/**
 * O vídeo do app DENTRO da seção que explica como o acompanhamento funciona.
 * É um subtítulo (h3) da seção que ele ilustra, não uma seção nova: assim a
 * estrutura de h2 da página não muda e o vídeo fica ligado ao assunto certo.
 *
 * - "online": quem treina com o Montinho à distância (consultoria online).
 * - "presencial": páginas de atendimento presencial; o app é o treino dos
 *   dias em que o Montinho não está junto.
 * - `semSaida`: landing page de anúncio, sem link para /videos.
 *
 * A legenda avisa que as telas usam dados de demonstração: a aluna do vídeo
 * é fictícia e não pode parecer aluna real.
 */
const TEXTO = {
  online:
    "A carga da última vez já preenchida, os meus recados durante a série, o treino possível no dia corrido e a Jornada do Chalalá: é aqui que eu acompanho você entre um check-in e outro.",
  presencial:
    "Fora das nossas sessões, o treino segue no app: carga da última vez, descanso contando sozinho, vídeo de cada exercício, os meus recados e a Jornada do Chalalá. Nenhum treino fica solto.",
} as const;

export default function VideoApp({ variante, onde, semSaida = false }: { variante: "online" | "presencial"; onde: string; semSaida?: boolean }) {
  if (!VIDEO_APP_ID) return null;
  const titulo = variante === "online" ? "Veja como isso acontece no app" : "Nos dias em que eu não estou com você";
  const id = `video-app-${onde}`;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 text-center" role="group" aria-labelledby={id}>
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#BA9E50] mb-3">No app do Montinho</p>
      <h3 id={id} className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
        {titulo}
      </h3>
      <p className="text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">{TEXTO[variante]}</p>
      <figure className="m-0">
        <div data-video-app>
          <YoutubeShortEmbed videoId={VIDEO_APP_ID} title={VIDEO_APP_TITULO} />
        </div>
        <figcaption className="mt-3 text-xs text-gray-500">Telas reais do app, com dados de demonstração.</figcaption>
      </figure>
      <VideoMedido slug={`app-${onde}`} seletor="[data-video-app]" />
      {!semSaida && (
        <p className="mt-5 text-sm">
          <Link href={`/videos/${VIDEO_APP_SLUG}`} className="text-gray-400 hover:text-white underline underline-offset-4">
            Ler o resumo do vídeo
          </Link>
        </p>
      )}
    </div>
  );
}
