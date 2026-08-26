"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Ponto de entrada leve para o Pergunte ao Montinho (blog/home).
 * Não carrega o chat nem a lógica de IA: guarda a pergunta e o contexto na
 * sessão e navega para a página da ferramenta, que pergunta automaticamente.
 * Sem query params — nenhuma pergunta vira URL.
 */
export default function AskEmbed({
  context,
  placeholder = "Ex.: Quantas vezes por semana devo treinar?",
  eyebrow = "Ficou com alguma dúvida?",
}: {
  context?: { slug: string; title?: string; category?: string };
  placeholder?: string;
  eyebrow?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const go = (question?: string) => {
    const text = (question ?? q).trim();
    try {
      if (text) {
        sessionStorage.setItem("mt_ask_pending", JSON.stringify({ q: text, context }));
      }
    } catch { /* segue sem pré-pergunta */ }
    trackEvent("ask_montinho_embed_submit", {
      from_article: Boolean(context),
      has_question: Boolean(text),
    });
    router.push("/pergunte-ao-montinho");
  };

  return (
    <div className="border border-white/20 bg-white/[0.03] p-6 sm:p-7">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-2">
        {eyebrow}
      </p>
      <p
        className="text-white font-bold text-xl mb-1"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        Pergunte ao Montinho
      </p>
      <p className="text-gray-500 text-sm mb-4">
        Busque uma resposta nos conteúdos do site.
      </p>
      <form
        onSubmit={(e) => { e.preventDefault(); go(); }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <label htmlFor="ask-embed-input" className="sr-only">
          Digite sua pergunta
        </label>
        <input
          id="ask-embed-input"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={500}
          placeholder={placeholder}
          className="flex-1 bg-black border border-white/20 text-white text-sm px-4 py-3 focus:border-white/60 outline-none placeholder:text-gray-600 min-h-[48px]"
        />
        <button
          type="submit"
          className="bg-white text-black px-6 py-3 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[48px]"
        >
          Perguntar
        </button>
      </form>
    </div>
  );
}
