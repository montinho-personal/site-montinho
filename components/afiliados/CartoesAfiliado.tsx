"use client";

import { PRODUTOS_AFILIADOS, AFILIADOS_POR_ARTIGO, AVISO_AFILIADO, type ProdutoAfiliado } from "@/lib/afiliados";
import { trackEvent } from "@/lib/analytics";

/* Preço e desconto NÃO aparecem: o Acordo Operacional do Associados só
 * permite exibir preço vindo da API de produtos (liberada após 3 vendas). */

function Botao({ p, slug, posicao }: { p: ProdutoAfiliado; slug: string; posicao: string }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      onClick={() => trackEvent("click_afiliado", { produto: p.id, artigo: slug, posicao })}
      className="mt-4 block rounded-lg bg-amber-400 px-4 py-3 text-center font-bold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-300"
    >
      Ver desconto de hoje na Amazon →
    </a>
  );
}

function Selo({ p }: { p: ProdutoAfiliado }) {
  const texto =
    p.vendedor === "Amazon"
      ? "Vendido pela Amazon"
      : p.vendedor === "loja parceira"
        ? "Enviado pela Amazon"
        : `Vendido pela loja oficial da marca${p.enviadoPelaAmazon ? " · enviado pela Amazon" : ""}`;
  return (
    <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
      ✓ {texto}
    </span>
  );
}

export default function CartoesAfiliado({ slug, variante = "fim" }: { slug: string; variante?: "topo" | "fim" }) {
  const produtos = (AFILIADOS_POR_ARTIGO[slug] ?? []).map((id) => PRODUTOS_AFILIADOS[id]).filter(Boolean);
  if (produtos.length === 0) return null;

  if (variante === "topo") {
    return (
      <section className="mb-12 rounded-2xl border-2 border-amber-400/60 bg-gradient-to-b from-amber-400/10 to-transparent p-5 sm:p-6" aria-label="Escolha rápida na Amazon">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Escolha rápida · {slug === "mega-oferta-prime-2026" ? "Mega Oferta Prime" : slug.startsWith("black-friday") ? "Black Friday" : "Onde comprar"}</p>
        <h2 className="text-2xl font-bold text-white mt-1">Sem tempo? Estas são as que eu conferi</h2>
        <p className="text-gray-400 text-sm mt-1 mb-5">Toque para ver o preço e o desconto de agora: em promoção eles mudam de hora em hora.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((p) => (
            <div key={p.id} className="rounded-xl border border-white/10 bg-black/50 p-4 flex flex-col">
              <span className="w-fit rounded bg-amber-400 px-2 py-0.5 text-[11px] font-bold uppercase text-black">{p.destaque}</span>
              <span className="text-xs uppercase tracking-wide text-gray-400 font-semibold mt-3">{p.marca}</span>
              <span className="text-white font-semibold leading-snug">{p.nome}</span>
              <Selo p={p} />
              <div className="flex-1" />
              <Botao p={p} slug={slug} posicao="topo" />
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-4">{AVISO_AFILIADO}</p>
      </section>
    );
  }

  return (
    <section className="my-10 rounded-2xl border border-white/10 bg-white/5 p-6" aria-label="Produtos na Amazon">
      <h2 className="text-xl font-bold text-white mb-1">Leu até aqui? As opções que eu conferi</h2>
      <p className="text-gray-400 text-sm mb-5">{produtos.some((p) => p.vendedor === "loja parceira") ? "Todas enviadas pela própria Amazon." : "Vendidas pela loja oficial da marca ou pela própria Amazon."}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {produtos.map((p) => (
          <div key={p.id} className="rounded-xl border border-white/10 bg-black/30 p-4 flex flex-col">
            <span className="text-xs uppercase tracking-wide text-amber-400 font-semibold">{p.marca}</span>
            <span className="text-white font-semibold mt-1">{p.nome}</span>
            <Selo p={p} />
            <div className="flex-1" />
            <Botao p={p} slug={slug} posicao="fim" />
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-xs mt-4">{AVISO_AFILIADO}</p>
    </section>
  );
}
