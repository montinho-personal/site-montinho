"use client";

import { PRODUTOS_AFILIADOS, AFILIADOS_POR_ARTIGO, AVISO_AFILIADO } from "@/lib/afiliados";
import { trackEvent } from "@/lib/analytics";

export default function CartoesAfiliado({ slug }: { slug: string }) {
  const produtos = (AFILIADOS_POR_ARTIGO[slug] ?? []).map((id) => PRODUTOS_AFILIADOS[id]).filter(Boolean);
  if (produtos.length === 0) return null;
  return (
    <section className="my-10 rounded-2xl border border-white/10 bg-white/5 p-6" aria-label="Produtos na Amazon">
      <h2 className="text-xl font-bold text-white mb-1">Onde comprar na Amazon</h2>
      <p className="text-gray-400 text-sm mb-5">Opções conferidas por mim, vendidas pela loja oficial da marca ou pela própria Amazon.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {produtos.map((p) => (
          <div key={p.id} className="rounded-xl border border-white/10 bg-black/30 p-4 flex flex-col">
            <span className="text-xs uppercase tracking-wide text-amber-400 font-semibold">{p.marca}</span>
            <span className="text-white font-semibold mt-1">{p.nome}</span>
            <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
              ✓ Vendido pela {p.vendedor === "Amazon" ? "Amazon" : "loja oficial da marca na Amazon"}
            </span>
            {p.enviadoPelaAmazon && p.vendedor !== "Amazon" && (
              <span className="text-gray-400 text-xs mt-1">Enviado pela Amazon</span>
            )}
            <a
              href={p.url}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackEvent("click_afiliado", { produto: p.id, artigo: slug })}
              className="mt-4 rounded-lg bg-amber-400 px-4 py-2 text-center font-semibold text-black hover:bg-amber-300"
            >
              Ver preço na Amazon
            </a>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-xs mt-4">{AVISO_AFILIADO}</p>
    </section>
  );
}
