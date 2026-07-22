"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Lightbox para as imagens dos artigos do blog.
 * - Detecta cliques em qualquer <img> dentro de .prose-blog (delegação).
 * - Abre um pop-up com a imagem em tela cheia.
 * - Zoom: roda do mouse / botões +− / duplo clique (desktop) e pinça nativa (mobile).
 * - Arrastar para ler as partes ampliadas; fecha no X, no fundo ou com Esc.
 * Sem dependências externas (compatível com a CSP do site).
 */
export default function ArticleLightbox() {
  const [src, setSrc] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [scale, setScale] = useState(1);
  const offset = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef<{ active: boolean; sx: number; sy: number; ox: number; oy: number }>({
    active: false,
    sx: 0,
    sy: 0,
    ox: 0,
    oy: 0,
  });

  const apply = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    el.style.transform = `translate(${offset.current.x}px, ${offset.current.y}px) scale(${scale})`;
  }, [scale]);

  const reset = useCallback(() => {
    offset.current = { x: 0, y: 0 };
    setScale(1);
  }, []);

  const close = useCallback(() => {
    setSrc(null);
    reset();
  }, [reset]);

  // Abre ao clicar numa imagem do artigo
  useEffect(() => {
    const root = document.querySelector(".prose-blog");
    if (!root) return;
    function onClick(e: Event) {
      const target = e.target as HTMLElement;
      if (target.tagName !== "IMG") return;
      const img = target as HTMLImageElement;
      e.preventDefault();
      setSrc(img.currentSrc || img.src);
      setAlt(img.alt || "");
      reset();
    }
    const imgs = root.querySelectorAll("img");
    imgs.forEach((i) => {
      (i as HTMLElement).style.cursor = "zoom-in";
    });
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [reset]);

  // Reaplica transform quando escala muda
  useEffect(() => {
    apply();
  }, [scale, apply]);

  // Esc para fechar; trava o scroll do body enquanto aberto
  useEffect(() => {
    if (!src) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [src, close]);

  const zoomBy = useCallback((delta: number) => {
    setScale((s) => {
      const next = Math.min(5, Math.max(1, +(s + delta).toFixed(2)));
      if (next === 1) offset.current = { x: 0, y: 0 };
      return next;
    });
  }, []);

  if (!src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Imagem ampliada"}
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        touchAction: "pinch-zoom",
      }}
    >
      {/* Botão fechar */}
      <button
        onClick={close}
        aria-label="Fechar"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          width: 44,
          height: 44,
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.25)",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          fontSize: 22,
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      {/* Controles de zoom */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 9999,
          padding: "8px 12px",
        }}
      >
        <button onClick={() => zoomBy(-0.5)} aria-label="Diminuir zoom" style={ctrlBtn}>
          −
        </button>
        <button onClick={reset} aria-label="Restaurar zoom" style={{ ...ctrlBtn, width: "auto", padding: "0 12px", fontSize: 13 }}>
          {Math.round(scale * 100)}%
        </button>
        <button onClick={() => zoomBy(0.5)} aria-label="Aumentar zoom" style={ctrlBtn}>
          +
        </button>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setScale((s) => (s > 1 ? 1 : 2.5));
          if (scale > 1) offset.current = { x: 0, y: 0 };
        }}
        onWheel={(e) => {
          zoomBy(e.deltaY < 0 ? 0.25 : -0.25);
        }}
        onPointerDown={(e) => {
          if (scale <= 1) return;
          drag.current = {
            active: true,
            sx: e.clientX,
            sy: e.clientY,
            ox: offset.current.x,
            oy: offset.current.y,
          };
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current.active) return;
          offset.current = {
            x: drag.current.ox + (e.clientX - drag.current.sx),
            y: drag.current.oy + (e.clientY - drag.current.sy),
          };
          apply();
        }}
        onPointerUp={() => {
          drag.current.active = false;
        }}
        style={{
          maxWidth: "94vw",
          maxHeight: "88vh",
          objectFit: "contain",
          transformOrigin: "center center",
          transition: drag.current.active ? "none" : "transform 0.15s ease-out",
          cursor: scale > 1 ? "grab" : "zoom-in",
          userSelect: "none",
          touchAction: "pinch-zoom",
        }}
      />
    </div>
  );
}

const ctrlBtn: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 9999,
  border: "none",
  background: "rgba(255,255,255,0.12)",
  color: "#fff",
  fontSize: 20,
  lineHeight: 1,
  cursor: "pointer",
};
