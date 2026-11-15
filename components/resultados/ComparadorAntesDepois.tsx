"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { FotosVitrine } from "@/lib/resultados";

/**
 * Comparador de antes e depois: duas fotos reais do mesmo aluno, uma sobre
 * a outra, e uma linha que o visitante arrasta.
 *
 * - As duas fotos e os textos alternativos saem no HTML do servidor, com a
 *   linha no meio: sem JavaScript, a pessoa já vê metade de cada foto.
 * - Arrastar usa Pointer Events (dedo e mouse). `touch-action: pan-y` deixa
 *   a rolagem vertical da página com o navegador: o comparador só pega o
 *   gesto horizontal.
 * - Teclado e leitor de tela usam um <input type="range"> de verdade, por
 *   cima da imagem e invisível; o foco aparece no puxador.
 * - Nada anima sozinho, então não há o que desligar para quem pede menos
 *   movimento. A troca de posição é instantânea.
 * - As fotos nunca são esticadas: a caixa usa a proporção das próprias
 *   metades (as duas têm o mesmo tamanho), e o recorte é só clip-path.
 */
export default function ComparadorAntesDepois({
  fotos,
  nome,
  slug,
  pagina,
  altAntes,
  altDepois,
  prioridade = false,
  alturaMax = 70,
  sizes = "(min-width: 1024px) 420px, (min-width: 768px) 45vw, 92vw",
}: {
  fotos: FotosVitrine;
  nome: string;
  slug: string;
  pagina: string;
  altAntes: string;
  altDepois: string;
  prioridade?: boolean;
  /** Altura máxima da foto, em % da altura da tela (svh). */
  alturaMax?: number;
  sizes?: string;
}) {
  const [pos, setPos] = useState(50);
  const [mexeu, setMexeu] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);
  const arrastando = useRef(false);

  const marcaUso = useCallback(
    (como: string) => {
      if (mexeu) return;
      setMexeu(true);
      trackEvent("vitrine_comparador", { pagina, aluno: slug, como });
    },
    [mexeu, pagina, slug],
  );

  const posDoPonteiro = (clientX: number) => {
    const r = caixa.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(100, Math.max(0, p)));
  };

  const fim = (e: React.PointerEvent<HTMLDivElement>) => {
    arrastando.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <figure
      className="m-0 mx-auto"
      // As metades são retratos altos (~1:2). Sem limite, a foto passa da
      // altura da tela e a pessoa não vê o puxador e as etiquetas juntos.
      style={{ width: `min(100%, calc(${alturaMax}svh * ${fotos.largura} / ${fotos.altura}))` }}
    >
      <div
        ref={caixa}
        className="vitrine-caixa relative w-full overflow-hidden select-none bg-neutral-900 cursor-ew-resize"
        style={{ aspectRatio: `${fotos.largura} / ${fotos.altura}`, touchAction: "pan-y" }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          arrastando.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          posDoPonteiro(e.clientX);
          marcaUso(e.pointerType === "touch" ? "toque" : "mouse");
        }}
        onPointerMove={(e) => {
          if (arrastando.current) posDoPonteiro(e.clientX);
        }}
        onPointerUp={fim}
        onPointerCancel={fim}
      >
        {/* Depois: a foto de baixo, inteira. */}
        <Image
          src={fotos.depois}
          alt={altDepois}
          width={fotos.largura}
          height={fotos.altura}
          sizes={sizes}
          priority={prioridade}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Antes: por cima, recortada até a linha. */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src={fotos.antes}
            alt={altAntes}
            width={fotos.largura}
            height={fotos.altura}
            sizes={sizes}
            priority={prioridade}
            draggable={false}
            className="h-full w-full object-cover"
          />
        </div>

        <span className="pointer-events-none absolute left-3 top-3 bg-black/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
          Antes
        </span>
        <span
          className="pointer-events-none absolute right-3 top-3 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-black"
          style={{ background: "#BA9E50" }}
        >
          Depois
        </span>

        {/* Linha e puxador. */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }} aria-hidden="true">
          <div className="absolute inset-y-0 -translate-x-1/2 w-[2px] bg-white shadow-[0_0_10px_rgba(0,0,0,.6)]" />
          <div className="vitrine-puxador absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-black/75 text-white shadow-lg">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </div>
        </div>

        {!mexeu && (
          <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 px-3 py-1.5 text-xs text-white">
            Arraste para comparar
          </span>
        )}

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(pos)}
          onChange={(e) => {
            setPos(Number(e.target.value));
            marcaUso("teclado");
          }}
          aria-label={`Comparar antes e depois de ${nome}`}
          aria-valuetext={`${Math.round(pos)}% da foto de antes visível`}
          className="vitrine-range absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          style={{ touchAction: "pan-y" }}
        />
      </div>
      <figcaption className="mt-2 text-xs text-gray-400">
        Fotos reais de {nome}, sem retoque. Arraste a linha (ou use as setas do teclado) para comparar.
      </figcaption>
    </figure>
  );
}
