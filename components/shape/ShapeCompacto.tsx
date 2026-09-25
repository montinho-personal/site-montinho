"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { ANOS, CHAVE_PREENCHIDO, referencia, type Anos, type ReferenciaId } from "@/lib/shape";

/**
 * Entrada compacta do simulador de shape para artigos do Olympia: 3 campos
 * e um botão. A referência vai na URL (?ref=); altura, peso e tempo de
 * treino vão pelo sessionStorage — dado corporal nunca entra em URL (e,
 * portanto, nunca chega ao page_path do analytics).
 */

const campo = "w-full bg-black border border-white/25 px-3 py-2.5 text-base text-white focus:outline-none focus:border-[#BA9E50]";

export default function ShapeCompacto({ referenciaId: refId, placement }: { referenciaId: ReferenciaId; placement: string }) {
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [anos, setAnos] = useState<Anos | "">("");
  const r = referencia(refId);

  const ir = () => {
    try { sessionStorage.setItem(CHAVE_PREENCHIDO, JSON.stringify({ altura, peso, anos: anos || undefined })); } catch { /* sem storage: segue sem pré-preencher */ }
    trackEvent("shape_compact_start", { reference: refId, placement });
    window.location.href = `/ferramentas/quanto-tempo-para-ter-shape?ref=${refId}#simulador`;
  };

  return (
    <div className="not-prose border border-[#BA9E50]/40 bg-[#BA9E50]/[0.05] p-4 sm:p-5">
      <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#BA9E50]">Simulador · referência {r.nome}</p>
      <p className="text-white font-semibold mt-1">Compare seu nível atual com essa referência de muscularidade — e veja o caminho provável dos próximos anos.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
        <label className="block"><span className="text-xs text-gray-400">Altura (cm)</span><input className={campo} inputMode="decimal" placeholder="178" value={altura} onChange={(e) => setAltura(e.target.value)} /></label>
        <label className="block"><span className="text-xs text-gray-400">Peso (kg)</span><input className={campo} inputMode="decimal" placeholder="79" value={peso} onChange={(e) => setPeso(e.target.value)} /></label>
        <label className="block col-span-2 sm:col-span-1"><span className="text-xs text-gray-400">Tempo de treino</span>
          <select className={campo} value={anos} onChange={(e) => setAnos(e.target.value as Anos)}>
            <option value="">Escolher</option>
            {(Object.keys(ANOS) as Anos[]).map((k) => <option key={k} value={k}>{ANOS[k].rotulo}</option>)}
          </select>
        </label>
      </div>
      <button type="button" onClick={ir} className="mt-3 w-full sm:w-auto px-6 py-3 font-semibold bg-[#BA9E50] text-black hover:bg-white transition-colors">Simular minha jornada</button>
      <p className="text-xs text-gray-500 mt-2">Seus dados ficam no seu navegador. Referência de escala, não previsão de aparência.</p>
    </div>
  );
}
