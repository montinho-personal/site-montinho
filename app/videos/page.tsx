import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { VIDEOS_CANAL } from "@/lib/videos";

export const metadata: Metadata = {
  title: "Vídeos do Montinho: Treino, Emagrecimento e Constância",
  description:
    "Os vídeos curtos do Montinho Personal Trainer sobre emagrecimento, musculação, efeito sanfona, disciplina e como treinar para a vida toda.",
  alternates: { canonical: `${SITE_URL}/videos` },
};

export default function VideosPage() {
  return (
    <main className="bg-black min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Vídeos do Montinho</h1>
        <p className="text-gray-300 mb-10 max-w-2xl">
          Vídeos curtos sobre emagrecimento, musculação e constância. Cada um tem a própria página, com o que é dito no vídeo e o próximo passo.
        </p>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS_CANAL.map((v) => (
            <li key={v.slug}>
              <Link href={`/videos/${v.slug}`} className="block group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                  alt={v.titulo}
                  width={480}
                  height={360}
                  loading="lazy"
                  className="w-full h-auto rounded-xl mb-3"
                />
                <p className="text-white font-semibold group-hover:underline underline-offset-4">{v.titulo}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
