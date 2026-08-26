"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { buildAskWhatsApp, type Intent } from "@/lib/ask/guards";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";

const STORAGE_KEY = "mt_ask_v1";
const PENDING_KEY = "mt_ask_pending";
export const ASK_CONTEXT_KEY = "mt_ask_context";

interface Source { title: string; slug: string }
interface Msg {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  cta?: "whatsapp" | "diagnostico" | "consultoria" | null;
  intent?: string;
  topics?: string[];
  noAnswer?: boolean;
  feedback?: "up" | "down";
}
interface PageContext { slug: string; title?: string; category?: string }

const DEFAULT_SUGGESTIONS = [
  "Quantos dias por semana devo treinar?",
  "Treino de 30 minutos funciona?",
  "Como começar na musculação?",
  "Como funciona a consultoria do Montinho?",
];

function loadJSON<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function saveJSON(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch { /* sem persistência, segue */ }
}

export default function AskMontinho({
  context,
  suggestions = DEFAULT_SUGGESTIONS,
  compact = false,
}: {
  context?: PageContext;
  suggestions?: string[];
  compact?: boolean;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const startedRef = useRef(false);
  const lastQuestionRef = useRef("");

  // ask muda a cada render (depende de messages); o efeito de restauração
  // roda uma vez e chama a versão mais recente via ref.
  const askRef = useRef<(q: string, ctx?: PageContext) => void>(() => {});

  // Restaura conversa + pergunta pendente (vinda de embeds em outras páginas)
  useEffect(() => {
    trackOncePerSession("ask_montinho_view");
    const id = window.setTimeout(() => {
      const saved = loadJSON<Msg[]>(STORAGE_KEY);
      if (saved?.length) setMessages(saved);
      const pending = loadJSON<{ q: string; context?: PageContext }>(PENDING_KEY);
      if (pending?.q) {
        sessionStorage.removeItem(PENDING_KEY);
        askRef.current(pending.q, pending.context);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (messages.length) saveJSON(STORAGE_KEY, messages.slice(-12));
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const ask = useCallback(
    async (question: string, ctxOverride?: PageContext) => {
      const q = question.trim();
      if (!q || loading) return;
      setError(null);
      lastQuestionRef.current = q;
      if (!startedRef.current) {
        startedRef.current = true;
        trackEvent("ask_montinho_start", { from_article: Boolean(context || ctxOverride) });
      }
      const isFollowup = messages.some((m) => m.role === "user");
      trackEvent(isFollowup ? "ask_montinho_followup" : "ask_montinho_question", {
        from_article: Boolean(context || ctxOverride),
      });

      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      setMessages((prev) => [...prev, { role: "user", content: q }]);
      setInput("");
      setLoading(true);
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ question: q, history, context: ctxOverride ?? context }),
        });
        if (res.status === 429) {
          setError("Muitas perguntas em sequência — espera alguns segundos e tenta de novo.");
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as Msg & { answer: string };
        const msg: Msg = {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
          cta: data.cta,
          intent: data.intent,
          topics: data.topics,
          noAnswer: data.noAnswer,
        };
        setMessages((prev) => [...prev, msg]);
        trackEvent(data.noAnswer ? "ask_montinho_no_answer" : "ask_montinho_answer", {
          intent_category: data.intent,
          sources_count: data.sources?.length ?? 0,
          // Assunto detectado — só palavras de título/tag do próprio acervo,
          // nunca o texto digitado. É o que alimenta o radar de conteúdo.
          ask_topic: data.topics?.[0],
          ask_topic_2: data.topics?.[1],
        });
      } catch {
        trackEvent("ask_montinho_error");
        setError("Não consegui buscar a resposta agora. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, context]
  );

  useEffect(() => {
    askRef.current = (q, ctx) => void ask(q, ctx);
  }, [ask]);

  const retry = () => {
    setError(null);
    setMessages((prev) =>
      prev.length && prev[prev.length - 1].role === "user" ? prev.slice(0, -1) : prev
    );
    if (lastQuestionRef.current) void ask(lastQuestionRef.current);
  };

  const reset = () => {
    setMessages([]);
    setError(null);
    startedRef.current = false;
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ok */ }
  };

  const feedback = (idx: number, value: "up" | "down") => {
    setMessages((prev) => prev.map((m, i) => (i === idx ? { ...m, feedback: value } : m)));
    trackEvent(value === "up" ? "ask_montinho_feedback_positive" : "ask_montinho_feedback_negative", {
      intent_category: messages[idx]?.intent,
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void ask(input);
    }
  };

  const ctaBlock = (m: Msg) => {
    if (m.cta === "whatsapp") {
      return (
        <a
          href={getWhatsAppUrl(buildAskWhatsApp(m.intent as Intent | undefined))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("ask_montinho_whatsapp_click", { intent_category: m.intent })}
          className="inline-flex items-center justify-center bg-white text-black px-5 py-2.5 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors"
        >
          Falar com o Montinho no WhatsApp
        </a>
      );
    }
    if (m.cta === "diagnostico") {
      return (
        <Link
          href="/diagnostico"
          onClick={() => trackEvent("ask_montinho_diagnostic_click", { intent_category: m.intent })}
          className="inline-flex items-center justify-center border border-white text-white px-5 py-2.5 text-sm font-semibold tracking-wide hover:bg-white hover:text-black transition-colors"
        >
          Descobrir minha estratégia → Diagnóstico Montinho
        </Link>
      );
    }
    if (m.cta === "consultoria") {
      return (
        <Link
          href="/consultoria"
          onClick={() => trackEvent("ask_montinho_service_click", { intent_category: m.intent })}
          className="inline-flex items-center justify-center border border-white text-white px-5 py-2.5 text-sm font-semibold tracking-wide hover:bg-white hover:text-black transition-colors"
        >
          Ver como funciona o acompanhamento
        </Link>
      );
    }
    return null;
  };

  return (
    <div className="border border-white/20 bg-white/[0.03]">
      {/* Cabeçalho com transparência */}
      <div className="px-5 sm:px-8 pt-6 pb-4 border-b border-white/10">
        <p
          className="text-white font-bold text-lg"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Pergunte ao Montinho
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Assistente inteligente que busca respostas nos conteúdos publicados pelo
          Montinho. Conteúdo educativo — não substitui avaliação individual de
          profissionais de saúde.
        </p>
      </div>

      {/* Conversa */}
      <div
        ref={listRef}
        aria-live="polite"
        className={`px-5 sm:px-8 py-5 space-y-5 overflow-y-auto ${compact ? "max-h-[380px]" : "max-h-[520px]"}`}
      >
        {messages.length === 0 && !loading && (
          <div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Oi! Pergunte o que quiser sobre musculação, emagrecimento, execução de
              exercícios ou sobre o acompanhamento. Eu busco a resposta nos conteúdos
              que o Montinho escreveu — experiência prática somada à evidência
              científica — e te mostro de onde ela veio.
            </p>
            <p className="text-gray-400 text-xs uppercase tracking-[0.1em] mb-2">
              Você pode perguntar:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 4).map((s) => (
                <button
                  key={s}
                  onClick={() => void ask(s)}
                  className="text-left text-sm text-gray-300 border border-white/20 px-3 py-2 hover:border-white/50 hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="bg-white/10 text-white text-sm leading-relaxed px-4 py-3 max-w-[85%] whitespace-pre-wrap">
                {m.content}
              </p>
            </div>
          ) : (
            <div key={i} className="max-w-[95%]">
              {m.content.split(/\n{2,}/).map((p, j) => (
                <p key={j} className="text-gray-300 text-sm leading-relaxed mb-2 whitespace-pre-wrap">
                  {p}
                </p>
              ))}

              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 border-t border-white/10 pt-3">
                  <p className="text-gray-400 text-[11px] uppercase tracking-[0.1em] mb-2">
                    Conteúdos usados nesta resposta
                  </p>
                  <ul className="space-y-1.5">
                    {m.sources.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={s.slug}
                          onClick={() => trackEvent("ask_montinho_source_click", { article_slug: s.slug })}
                          className="text-sm text-gray-300 underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors"
                        >
                          {s.title} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ctaBlock(m) && <div className="mt-4">{ctaBlock(m)}</div>}

              {/* Feedback */}
              <div className="mt-3 flex items-center gap-3">
                {m.feedback ? (
                  <span className="text-gray-400 text-xs">Obrigado pelo retorno!</span>
                ) : (
                  <>
                    <span className="text-gray-400 text-xs">Esta resposta ajudou?</span>
                    <button
                      aria-label="Resposta ajudou"
                      onClick={() => feedback(i, "up")}
                      className="text-gray-400 hover:text-white text-sm px-1.5 py-0.5 transition-colors"
                    >
                      👍
                    </button>
                    <button
                      aria-label="Resposta não ajudou"
                      onClick={() => feedback(i, "down")}
                      className="text-gray-400 hover:text-white text-sm px-1.5 py-0.5 transition-colors"
                    >
                      👎
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        )}

        {loading && (
          <p className="text-gray-400 text-sm animate-pulse" role="status">
            Buscando nos conteúdos do Montinho…
          </p>
        )}

        {error && (
          <div className="text-sm text-gray-300">
            {error}{" "}
            <button onClick={retry} className="underline underline-offset-2 hover:text-white">
              Tentar novamente
            </button>
          </div>
        )}
      </div>

      {/* Entrada */}
      <div className="px-5 sm:px-8 py-4 border-t border-white/10">
        <form
          onSubmit={(e) => { e.preventDefault(); void ask(input); }}
          className="flex gap-3 items-end"
        >
          <label htmlFor="ask-input" className="sr-only">
            Digite sua dúvida sobre treino
          </label>
          <textarea
            id="ask-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={500}
            placeholder="Digite sua dúvida…"
            className="flex-1 bg-black border border-white/20 text-white text-base sm:text-sm px-4 py-3 resize-none focus:border-white/60 outline-none placeholder:text-gray-300 min-h-[48px]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-white text-black px-5 py-3 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px]"
          >
            Perguntar
          </button>
        </form>
        {messages.length > 0 && (
          <button
            onClick={reset}
            className="text-gray-400 text-xs mt-2 hover:text-white transition-colors"
          >
            Nova conversa
          </button>
        )}
      </div>
    </div>
  );
}
