"use client";

import { useState } from "react";
import type { MusculoId } from "@/lib/treino/musculos";
import { GRUPO, type GrupoSlug } from "@/lib/treino/mapa";

/**
 * O corpo em SVG próprio: leve (nenhuma imagem), escalável e acessível.
 * Cada região é um <a> de verdade para /exercicios/<grupo> — funciona com
 * teclado, leitor de tela e sem JavaScript. Com `onSelect`, o clique
 * seleciona no lugar em vez de navegar.
 *
 * Desenho didático (infográfico), não atlas: grupos que se treinam, com
 * área de toque maior que o desenho nas regiões pequenas.
 */

export type Vista = "frente" | "costas";

interface Regiao { id: string; grupo: GrupoSlug; d: string; centro?: boolean; musculos: MusculoId[] }

const FRENTE: Regiao[] = [
  { id: "f-ombro", grupo: "ombros", musculos: ["deltoide-anterior", "deltoide-lateral"], d: "M128 80 Q146 76 155 92 Q158 104 150 110 Q140 104 130 98 Q125 88 128 80 Z" },
  { id: "f-peito", grupo: "peito", musculos: ["peitoral"], d: "M102 82 Q118 77 128 84 Q133 96 128 112 Q114 122 102 117 Z" },
  { id: "f-biceps", grupo: "biceps", musculos: ["biceps"], d: "M147 112 Q157 116 158 136 Q157 152 151 158 Q143 152 141 134 Q141 118 147 112 Z" },
  { id: "f-antebraco", grupo: "antebraco", musculos: ["antebraco"], d: "M151 164 Q161 172 161 196 Q158 214 153 220 Q146 214 145 196 Q144 174 151 164 Z" },
  { id: "f-abdomen", grupo: "abdomen", centro: true, musculos: ["core"], d: "M86 122 Q100 118 114 122 L116 182 Q100 192 84 182 Z" },
  { id: "f-quadriceps", grupo: "quadriceps", musculos: ["quadriceps"], d: "M108 198 Q122 192 134 200 Q140 245 132 292 Q122 302 114 294 Q108 250 108 198 Z" },
  { id: "f-adutores", grupo: "adutores", musculos: ["adutores"], d: "M101 200 L106 200 Q107 250 111 290 Q104 292 101 286 Z" },
  { id: "f-panturrilha", grupo: "panturrilha", musculos: ["panturrilhas"], d: "M114 312 Q128 304 132 318 Q134 350 128 380 Q120 388 116 380 Q110 345 114 312 Z" },
];

const COSTAS: Regiao[] = [
  { id: "c-trapezio", grupo: "trapezio", centro: true, musculos: ["trapezio"], d: "M100 64 L124 80 L114 112 L100 122 L86 112 L76 80 Z" },
  { id: "c-ombro", grupo: "deltoide-posterior", musculos: ["deltoide-posterior"], d: "M128 80 Q146 76 155 92 Q158 104 150 110 Q140 104 130 98 Q125 88 128 80 Z" },
  { id: "c-dorsais", grupo: "dorsais", musculos: ["costas"], d: "M104 124 Q118 112 132 100 Q140 112 136 132 Q128 156 112 166 L104 166 Z" },
  { id: "c-lombar", grupo: "lombar", centro: true, musculos: [], d: "M89 168 Q100 172 111 168 L114 188 Q100 194 86 188 Z" },
  { id: "c-triceps", grupo: "triceps", musculos: ["triceps"], d: "M147 112 Q157 116 158 136 Q157 152 151 158 Q143 152 141 134 Q141 118 147 112 Z" },
  { id: "c-antebraco", grupo: "antebraco", musculos: ["antebraco"], d: "M151 164 Q161 172 161 196 Q158 214 153 220 Q146 214 145 196 Q144 174 151 164 Z" },
  { id: "c-gluteos", grupo: "gluteos", musculos: ["gluteos"], d: "M101 194 Q118 186 132 196 Q138 216 128 230 Q114 236 101 228 Z" },
  { id: "c-posterior", grupo: "posterior-de-coxa", musculos: ["posteriores"], d: "M104 238 Q120 234 132 238 Q136 270 130 296 Q120 304 112 296 Q104 266 104 238 Z" },
  { id: "c-panturrilha", grupo: "panturrilha", musculos: ["panturrilhas"], d: "M112 310 Q130 302 134 322 Q134 350 126 376 Q118 382 114 374 Q106 340 112 310 Z" },
];

const ESPELHO = "translate(200,0) scale(-1,1)";
const DOURADO = "#BA9E50";

export interface Destaque { principal: MusculoId[]; secundario: MusculoId[] }

export default function MapaCorpo({
  vista, selecionado, destaque, onSelect, contagem, titulo = "Mapa muscular",
}: {
  vista: Vista;
  selecionado?: GrupoSlug | null;
  destaque?: Destaque;
  onSelect?: (g: GrupoSlug) => void;
  contagem?: Partial<Record<GrupoSlug, number>>;
  titulo?: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const regioes = vista === "frente" ? FRENTE : COSTAS;
  const sel = selecionado ? GRUPO[selecionado] : null;

  const estado = (r: Regiao): "sel" | "sec" | "off" => {
    if (destaque) {
      if (r.musculos.some((m) => destaque.principal.includes(m))) return "sel";
      if (r.musculos.some((m) => destaque.secundario.includes(m))) return "sec";
      return "off";
    }
    if (!sel) return "off";
    if (r.grupo === sel.slug || GRUPO[r.grupo].pai === sel.slug || sel.pai === r.grupo) return "sel";
    // Ombros e costas: tocar na região-mãe acende as filhas que aparecem nesta vista.
    if (sel.slug === "ombros" && r.grupo === "deltoide-posterior") return "sel";
    if (sel.slug === "costas" && ["trapezio", "dorsais", "lombar"].includes(r.grupo)) return "sel";
    if (["deltoide-anterior", "deltoide-lateral"].includes(sel.slug) && r.grupo === "ombros") return "sel";
    if (sel.slug === "parte-superior-das-costas" && ["trapezio", "dorsais"].includes(r.grupo)) return "sel";
    return "off";
  };

  const fill = (e: string, h: boolean) => (e === "sel" ? DOURADO : e === "sec" ? "rgba(186,158,80,0.45)" : h ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.14)");

  return (
    <svg viewBox="40 0 120 410" className="w-full h-auto max-h-[62vh] select-none" role="group" aria-label={`${titulo}: vista de ${vista}`}>
      <title>{`${titulo} — ${vista}`}</title>
      {/* Base: cabeça, pescoço, mãos, joelhos, pés — não clicáveis */}
      <g fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" aria-hidden="true">
        <ellipse cx="100" cy="36" rx="17" ry="22" />
        <rect x="92" y="56" width="16" height="16" rx="5" />
        <path d="M76 80 L124 80 L130 98 L126 120 L116 186 L84 186 L74 120 L70 98 Z" />
        <path d="M84 186 L116 186 L124 196 L100 202 L76 196 Z" />
        {[0, 1].map((k) => (
          <g key={k} transform={k ? ESPELHO : undefined}>
            <ellipse cx="153" cy="232" rx="7" ry="10" />
            <ellipse cx="122" cy="300" rx="9" ry="8" />
            <ellipse cx="122" cy="394" rx="11" ry="6" />
          </g>
        ))}
      </g>
      {regioes.map((r) => {
        const e = estado(r);
        const h = hover === r.id;
        const n = contagem?.[r.grupo];
        const label = `Ver exercícios para ${GRUPO[r.grupo].nome.toLowerCase()}${n ? ` (${n})` : ""}`;
        const forma = (k: number) => (
          <g key={k} transform={k ? ESPELHO : undefined}>
            <path d={r.d} fill={fill(e, h)} stroke={e === "sel" ? "#f5e6b8" : "rgba(255,255,255,0.35)"} strokeWidth="0.8" className="motion-safe:transition-[fill] motion-safe:duration-150" />
            {/* área de toque maior que o desenho */}
            <path d={r.d} fill="transparent" stroke="transparent" strokeWidth="10" />
          </g>
        );
        return (
          <a
            key={r.id}
            href={`/exercicios/${r.grupo}`}
            aria-label={label}
            aria-current={e === "sel" && !destaque ? "true" : undefined}
            onClick={(ev) => { if (onSelect) { ev.preventDefault(); onSelect(r.grupo); } }}
            onMouseEnter={() => setHover(r.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(r.id)}
            onBlur={() => setHover(null)}
            className="cursor-pointer outline-none focus-visible:[&_path:first-child]:stroke-white"
          >
            <title>{`${GRUPO[r.grupo].nome}${n ? ` · ${n} exercícios` : ""}`}</title>
            {forma(0)}
            {!r.centro && forma(1)}
          </a>
        );
      })}
    </svg>
  );
}
