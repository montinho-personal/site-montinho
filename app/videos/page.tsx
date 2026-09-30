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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Vídeos do Montinho</h1>
        <p className="text-gray-300 mb-12 max-w-2xl">
          Vídeos curtos sobre emagrecimento, musculação e constância. Escolha um, dê o play e leve a ideia para o seu treino.
        </p>
        <ul className="grid gap-10 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS_CANAL.map((v) => (
            <li key={v.slug}>
              <Link
                href={`/videos/${v.slug}`}
                className="group flex flex-col h-full rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden transition-colors hover:border-[#BA9E50]/60 hover:bg-white/[0.07]"
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.titulo}
                    width={480}
                    height={360}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
                    <span className="flex items-center justify-center w-14 h-14 rounded-full bg-black/60 border border-white/30 group-hover:bg-[#BA9E50] transition-colors">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <p className="text-white font-semibold text-lg leading-snug mb-2">{v.titulo}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{v.chamada}</p>
                  <span className="text-sm font-semibold" style={{ color: "#BA9E50" }}>Assistir o vídeo →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
