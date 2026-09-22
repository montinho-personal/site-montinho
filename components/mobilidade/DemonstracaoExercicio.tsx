"use client";

import { useEffect, useRef, useState } from "react";
import type { Figura } from "@/lib/mobilidade/figuras";
import type { VideoExercicio } from "@/lib/mobilidade/videos";
import FiguraTeste from "./Figura";

/**
 * A demonstração no card do protocolo: vídeo quando o exercício tem, desenho
 * quando não tem.
 *
 * Três cuidados, porque vídeo é a coisa mais cara que esta página carrega:
 *
 *   1. Nada baixa antes de aparecer. `preload="none"` e o play só quando o
 *      card entra na tela — o protocolo mostra três ou quatro exercícios, não
 *      os treze, e ninguém paga por vídeo que não viu.
 *   2. Fora da tela, pausa. Quatro vídeos em loop ao mesmo tempo gastam
 *      bateria de quem está no meio do treino.
 *   3. Quem pediu menos movimento no sistema não recebe autoplay: vê o
 *      primeiro quadro e toca para ver o movimento.
 */
export default function DemonstracaoExercicio({
  video,
  figura,
  nome,
}: {
  video?: VideoExercicio;
  figura?: Figura | null;
  nome: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [menosMovimento, setMenosMovimento] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMenosMovimento(mq.matches);
    if (mq.matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [video]);

  if (!video) return figura ? <FiguraTeste figura={figura} compacta /> : null;

  return (
    <video
      ref={ref}
      poster={video.poster}
      muted
      loop
      playsInline
      preload="none"
      controls={menosMovimento}
      aria-label={`Demonstração: ${nome}`}
      className="w-full h-auto block bg-white border border-white/10"
      width={400}
      height={400}
    >
      {/* Ordem importa: o navegador toca o primeiro formato que entende. */}
      <source src={video.webm} type="video/webm" />
      <source src={video.mp4} type="video/mp4" />
    </video>
  );
}
