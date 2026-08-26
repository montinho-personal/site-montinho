"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  QUESTIONS,
  TOTAL_QUESTIONS,
  computeResult,
  buildWhatsAppMessage,
  type Answers,
  type QuestionId,
} from "@/lib/diagnostico";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import NotaMetodo from "@/components/filosofia/NotaMetodo";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";

const STORAGE_KEY = "mt_diagnostico_v1";

type Screen = "intro" | "quiz" | "result";

interface SavedState {
  answers: Answers;
  step: number;
  screen: Screen;
}

function loadState(): SavedState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedState;
    if (typeof parsed?.step !== "number" || typeof parsed?.answers !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveState(state: SavedState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* sessionStorage indisponível: segue sem persistência */
  }
}

export default function DiagnosticoQuiz() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const progressFired = useRef<Set<number>>(new Set());
  const startedRef = useRef(false);

  // Restaura progresso da sessão (apenas sessão atual; nada vai para servidor).
  // Adiado para depois da hidratação: o HTML do servidor sempre mostra a intro,
  // e restaurar de forma assíncrona evita mismatch e renders em cascata.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const saved = loadState();
      if (saved) {
        setAnswers(saved.answers);
        setStep(Math.min(saved.step, TOTAL_QUESTIONS - 1));
        if (saved.screen === "result" && Object.keys(saved.answers).length >= TOTAL_QUESTIONS) {
          setScreen("result");
        } else if (saved.screen === "quiz") {
          setScreen("quiz");
        }
      }
    }, 0);
    trackOncePerSession("diagnostic_view");
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    saveState({ answers, step, screen });
  }, [answers, step, screen]);

  // Foco acessível ao trocar de etapa
  useEffect(() => {
    if (screen !== "intro") headingRef.current?.focus();
  }, [step, screen]);

  const fireProgress = useCallback((answeredCount: number) => {
    const pct = Math.floor((answeredCount / TOTAL_QUESTIONS) * 100);
    for (const mark of [25, 50, 75] as const) {
      if (pct >= mark && !progressFired.current.has(mark)) {
        progressFired.current.add(mark);
        trackEvent(`diagnostic_progress_${mark}` as `diagnostic_progress_${25|50|75}`);
      }
    }
  }, []);

  const start = () => {
    setScreen("quiz");
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("diagnostic_start");
    }
  };

  const select = (id: QuestionId, value: string) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    const answeredCount = QUESTIONS.filter((q) => next[q.id]).length;
    fireProgress(answeredCount);
    if (step < TOTAL_QUESTIONS - 1) {
      setStep(step + 1);
    } else {
      setScreen("result");
      const result = computeResult(next);
      trackEvent("diagnostic_complete", { result_profile: result.profileId });
      trackEvent("diagnostic_result_view", { result_profile: result.profileId });
    }
  };

  const back = () => {
    if (screen === "result") {
      setScreen("quiz");
      setStep(TOTAL_QUESTIONS - 1);
    } else if (step > 0) {
      setStep(step - 1);
    } else {
      setScreen("intro");
    }
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setScreen("quiz");
    progressFired.current = new Set();
  };

  // ── Telas ──────────────────────────────────────────────────────────────────

  if (screen === "intro") {
    return (
      <div className="border border-white/20 bg-white/[0.03] p-8 sm:p-10 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-4">
          Gratuito · Leva de 1 a 2 minutos
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl sm:text-3xl font-bold text-white mb-4 outline-none"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Pronto para descobrir seu caminho?
        </h2>
        <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-lg mx-auto">
          São {TOTAL_QUESTIONS} perguntas rápidas sobre seu objetivo, rotina e
          dificuldades. No final, você recebe uma orientação inicial feita para a sua situação.
        </p>
        <button
          onClick={start}
          className="inline-flex items-center justify-center bg-white text-black px-10 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto"
        >
          Fazer meu diagnóstico
        </button>
        <p className="text-gray-400 text-xs mt-5">
          Sem cadastro. Suas respostas não saem do seu navegador.
        </p>
      </div>
    );
  }

  if (screen === "result") {
    const result = computeResult(answers);
    const waMessage = buildWhatsAppMessage(answers, result);
    return (
      <div aria-live="polite" className="border border-white/20 bg-white/[0.03] p-6 sm:p-10">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">
          Seu resultado
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl sm:text-3xl font-bold text-white mb-5 outline-none"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Seu perfil: {result.profileName}
        </h2>

        <p className="text-gray-300 leading-relaxed mb-6">{result.explanation}</p>

        <div className="border-l-2 pl-4 mb-8" style={{ borderColor: "#BA9E50" }}>
          <p className="text-white font-semibold">{result.priority}</p>
        </div>

        <div className="space-y-6 mb-10">
          <div>
            <h3 className="text-white text-sm font-semibold tracking-[0.1em] uppercase mb-2">
              Frequência para a sua rotina
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">{result.frequency}</p>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold tracking-[0.1em] uppercase mb-2">
              Seu principal gargalo
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">{result.bottleneck}</p>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold tracking-[0.1em] uppercase mb-2">
              Acompanhamento mais compatível: {result.modality}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">{result.modalityReason}</p>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold tracking-[0.1em] uppercase mb-3">
              Três próximos passos
            </h3>
            <ol className="space-y-3">
              {result.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-gray-300 text-sm leading-relaxed">
                  <span
                    className="font-bold flex-shrink-0"
                    style={{ color: "#BA9E50", fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {i + 1}.
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* CTA principal */}
        <div className="border border-white/20 bg-black p-6 sm:p-8 text-center mb-8">
          <h3
            className="text-xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Quer que o Montinho analise seu resultado?
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Manda seu diagnóstico direto no WhatsApp — ele responde pessoalmente e
            te diz qual seria o próximo passo para o seu caso.
          </p>
          <a
            href={getWhatsAppUrl(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("diagnostic_whatsapp_click", { result_profile: result.profileId })
            }
            className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto"
          >
            Quero uma análise do Montinho
          </a>
        </div>

        {/* Conteúdo recomendado */}
        <div className="mb-8">
          <h3 className="text-white text-sm font-semibold tracking-[0.1em] uppercase mb-4">
            Conteúdo recomendado para o seu perfil
          </h3>
          <ul className="space-y-3">
            {result.articles.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/blog/${a.slug}`}
                  onClick={() =>
                    trackEvent("diagnostic_article_click", { article_slug: a.slug })
                  }
                  className="text-gray-300 text-sm underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors duration-200"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-white/10 pt-6">
          <Link
            href="/consultoria"
            onClick={() => trackEvent("diagnostic_service_click")}
            className="text-gray-300 text-sm underline underline-offset-4 decoration-1 hover:text-white transition-colors duration-200"
          >
            Entender como funciona o acompanhamento
          </Link>
          <div className="flex gap-5">
            <button
              onClick={back}
              className="text-gray-400 text-sm hover:text-white transition-colors duration-200"
            >
              Revisar respostas
            </button>
            <button
              onClick={restart}
              className="text-gray-400 text-sm hover:text-white transition-colors duration-200"
            >
              Refazer
            </button>
          </div>
        </div>

        {/* Variante escolhida pelo perfil: cada resultado do diagnóstico carrega
            uma leitura diferente da mesma filosofia. */}
        <NotaMetodo chave={`diagnostico-${result.profileId}`} />

        <p className="text-gray-400 text-xs leading-relaxed mt-6">
          Esta é uma orientação inicial baseada nas suas respostas — não é avaliação
          médica, não substitui a anamnese individual e não promete resultados.
        </p>
      </div>
    );
  }

  // ── Quiz ───────────────────────────────────────────────────────────────────
  const question = QUESTIONS[step];
  const selected = answers[question.id];

  return (
    <div className="border border-white/20 bg-white/[0.03] p-6 sm:p-10">
      {/* Progresso */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs tracking-[0.1em] uppercase">
            Pergunta {step + 1} de {TOTAL_QUESTIONS}
          </span>
          <button
            onClick={back}
            className="text-gray-400 text-sm hover:text-white transition-colors duration-200"
          >
            ← Voltar
          </button>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={TOTAL_QUESTIONS}
          aria-valuenow={step + 1}
          aria-label={`Pergunta ${step + 1} de ${TOTAL_QUESTIONS}`}
          className="h-1 bg-white/10 w-full"
        >
          <div
            className="h-1 transition-all duration-300"
            style={{ width: `${((step + 1) / TOTAL_QUESTIONS) * 100}%`, background: "#BA9E50" }}
          />
        </div>
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-xl sm:text-2xl font-bold text-white mb-8 outline-none"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {question.title}
      </h2>

      <div className="grid gap-3" role="group" aria-label={question.title}>
        {question.options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => select(question.id, opt.value)}
              aria-pressed={isSelected}
              className={`text-left px-5 py-4 border text-base transition-colors duration-150 min-h-[56px] ${
                isSelected
                  ? "border-white bg-white/10 text-white"
                  : "border-white/20 text-gray-300 hover:border-white/50 hover:text-white"
              }`}
            >
              {opt.label}
              {isSelected && (
                <span className="sr-only"> (selecionada)</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
