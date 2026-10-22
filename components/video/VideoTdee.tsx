import Link from "next/link";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";
import VideoMedido from "@/components/blog/VideoMedido";
import { VIDEO_TDEE_ID, VIDEO_TDEE_SLUG, VIDEO_TDEE_TITULO } from "@/lib/video/tdee";

/**
 * O tutorial da Calculadora de TMB e TDEE no fim dos artigos que embutem a
 * ferramenta (ARTIGOS_COM_CALCULADORA_TDEE) e que não têm vídeo nenhum.
 *
 * Regra do Montinho (22/10/2026): vídeo dele já no artigo fica; vídeo de
 * terceiro é trocado no mesmo lugar (lib/blog.ts); sem vídeo, entra este
 * bloco no fim, onde não compete com o texto (scripts/videos-test.ts).
 */
export default function VideoTdee({ slug }: { slug: string }) {
  if (!VIDEO_TDEE_ID) return null;
  return (
    <section className="mt-16 pt-10 border-t border-white/10" aria-labelledby="video-tdee">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#BA9E50] mb-3">Em 1 minuto</p>
      <h2 id="video-tdee" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
        Quantas calorias você gasta por dia: veja como calcular
      </h2>
      <p className="text-gray-300 leading-relaxed mb-8">
        Peso, altura, idade, sexo e o seu nível de atividade: o vídeo mostra a sua TMB, o seu gasto do dia e o que
        fazer com esse número. Depois é só usar a{" "}
        <Link href="/ferramentas/calculadora-tmb-tdee" className="underline underline-offset-4 hover:text-white">
          Calculadora de TMB e TDEE
        </Link>
        .
      </p>
      <div data-video-tdee>
        <YoutubeShortEmbed videoId={VIDEO_TDEE_ID} title={VIDEO_TDEE_TITULO} />
      </div>
      <VideoMedido slug={`tdee-${slug}`} seletor="[data-video-tdee]" />
      <p className="mt-6 text-sm">
        <Link href={`/videos/${VIDEO_TDEE_SLUG}`} className="text-gray-400 hover:text-white underline underline-offset-4">
          Ler o resumo do vídeo
        </Link>
      </p>
    </section>
  );
}
