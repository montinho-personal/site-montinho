"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Ponto de entrada leve para o Pergunte ao Montinho (blog/home).
 * Não carrega o chat nem a lógica de IA: guarda a pergunta e o contexto na
 * sessão e navega para a página da ferramenta, que pergunta automaticamente.
 * Sem query params — nenhuma pergunta vira URL.
 *
 * variant="featured" → home: presença visual, exemplos clicáveis.
 * variant="inline"   → artigos: discreto, não compete com a leitura.
 */
export default function AskEmbed({
  context,
  placeholder = "Ex.: Quantas vezes por semana devo treinar?",
  eyebrow = "Ficou com alguma dúvida?",
  variant = "inline",
  examples = [
    "Quantas vezes por semana devo treinar?",
    "Treino de 30 minutos funciona?",
    "Musculação emagrece?",
  ],
}: {
  context?: { slug: string; title?: string; category?: string };
  placeholder?: string;
  eyebrow?: string;
  variant?: "inline" | "featured";
  examples?: string[];
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

  if (variant === "featured") {
    return (
      <div className="relative border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-7 sm:p-10">
        {/* filete dourado superior */}
        <div
          className="absolute top-0 left-0 h-[2px] w-24"
          style={{ background: "#BA9E50" }}
          aria-hidden="true"
        />

        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
          style={{ color: "#BA9E50" }}
        >
          {eyebrow}
        </p>

        <h2
          className="text-white font-bold text-3xl sm:text-4xl leading-tight mb-3"
          style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
        >
          Pergunte ao Montinho
        </h2>

        <div className="mb-8 max-w-2xl space-y-4">
          <p className="text-white text-lg sm:text-xl leading-relaxed font-medium">
            Escreva sua dúvida do jeito que você me perguntaria pessoalmente.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            A resposta vem dos mais de 800 conteúdos que eu escrevi — onde eu reúno
            três coisas: a experiência de quem perdeu{" "}
            <strong className="text-white font-semibold">40 kg</strong> e acompanha
            alunos todos os dias, a{" "}
            <strong className="text-white font-semibold">
              evidência científica
            </strong>{" "}
            dos maiores pesquisadores de hipertrofia e emagrecimento do mundo, e o
            que as principais referências do treinamento de força ensinam na prática.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Nada de achismo nem fórmula mágica: você recebe a explicação e vê
            exatamente quais artigos meus a embasaram.
          </p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); go(); }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <label htmlFor="ask-embed-input" className="sr-only">
            Digite sua pergunta sobre treino
          </label>
          <input
            id="ask-embed-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={500}
            placeholder={placeholder}
            className="flex-1 bg-black border border-white/25 text-white text-base px-5 py-4 outline-none placeholder:text-gray-400 min-h-[56px] transition-colors focus:border-[#BA9E50]"
          />
          <button
            type="submit"
            className="bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[56px] whitespace-nowrap"
          >
            Perguntar
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-400 text-xs uppercase tracking-[0.1em] mr-1">
            Ou tente:
          </span>
          {examples.slice(0, 3).map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => go(ex)}
              className="text-sm text-gray-300 border border-white/20 px-3 py-2 hover:border-[#BA9E50] hover:text-white transition-colors text-left"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/20 bg-white/[0.03] p-6 sm:p-7">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-2">
        {eyebrow}
      </p>
      <p
        className="text-white font-bold text-xl mb-1"
        style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
      >
        Pergunte ao Montinho
      </p>
      <p className="text-gray-400 text-sm mb-4">
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
          className="flex-1 bg-black border border-white/20 text-white text-sm px-4 py-3 focus:border-white/60 outline-none placeholder:text-gray-400 min-h-[48px]"
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
