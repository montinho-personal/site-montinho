import Link from "next/link";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";
import VideoMedido from "@/components/blog/VideoMedido";

/**
 * O tutorial do Montinho FitChef no fim dos artigos que embutem a ferramenta
 * (ARTIGOS_COM_CALCULADORA_CARDAPIO). Pedido do Montinho em 22/10/2026:
 * "colocar vídeo do Montinho FitChef nas páginas referentes sobre ele".
 *
 * Fica no FIM, não colado na ferramenta do meio do texto: vídeo no meio
 * compete com o texto que a pessoa veio ler (ver scripts/videos-test.ts).
 * Quem chegou até aqui e ainda não usou a ferramenta vê como ela funciona.
 */
export default function VideoFitChef({ slug }: { slug: string }) {
  return (
    <section className="mt-16 pt-10 border-t border-white/10" aria-labelledby="video-fitchef">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#BA9E50] mb-3">Em 53 segundos</p>
      <h2 id="video-fitchef" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
        Como montar o seu cardápio com o Montinho FitChef
      </h2>
      <p className="text-gray-300 leading-relaxed mb-8">
        Sua meta, sua rotina e o que você já come: o vídeo mostra os três passos, o cardápio pronto e como trocar um
        alimento. Depois é só usar a{" "}
        <Link href="/ferramentas/monte-seu-cardapio" className="underline underline-offset-4 hover:text-white">
          ferramenta Monte seu Cardápio
        </Link>
        .
      </p>
      <div data-video-fitchef>
        <YoutubeShortEmbed videoId="FjvYaKx05x0" title="Como usar o Montinho FitChef (Monte seu Cardápio) — Montinho Personal Trainer" />
      </div>
      <VideoMedido slug={`fitchef-${slug}`} seletor="[data-video-fitchef]" />
      <p className="mt-6 text-sm">
        <Link href="/videos/monte-seu-cardapio-em-3-passos" className="text-gray-400 hover:text-white underline underline-offset-4">
          Ler o resumo do vídeo
        </Link>
      </p>
    </section>
  );
}
