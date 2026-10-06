"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { registraConclusao } from "@/lib/ferramentas/historico";
import Compartilhar from "@/components/share/Compartilhar";
import {
  computeRotina,
  buildRotinaWhatsApp,
  buildFallbackPlan,
  semanaCurta,
  DIAS_SEMANA,
  type RotinaAnswers,
  type RotinaPlan,
  type Prioridade,
  type WeekDay,
} from "@/lib/rotina/engine";

/**
 * Quiz do Treino Para Minha Rotina — V2.
 *
 * Fluxo rápido (1–2 min): dias reais → quais dias (ou "mudam toda semana")
 * → tempo → objetivo → experiência → prioridade → o que faz faltar →
 * preferência → segurança. Recuperação, cardio e local ficam em "Refinar",
 * depois do resultado: mudam pouco a decisão e não podem atrasar a resposta.
 *
 * Motor determinístico local (lib/rotina/engine.ts), zero rede. A rotina
 * fica salva no próprio navegador (localStorage) para a pessoa voltar e usar
 * o Plano B; nada vai para servidor. Analytics recebe só categorias.
 */

const STORAGE_KEY = "mt_rotina_v2";
const STORAGE_KEY_V1 = "mt_rotina_v1";
const DOURADO = "#BA9E50";
const titulo = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

type Etapa = "intro" | number | "seguranca" | "resultado";

interface Pergunta {
  id: keyof RotinaAnswers;
  titulo: string;
  sub?: string;
  tipo?: "agenda" | "prioridade";
  opcoes: Array<{ valor: string | number; rotulo: string }>;
}

const PRIORIDADES: Array<{ valor: Prioridade; rotulo: string }> = [
  { valor: "pernas", rotulo: "Pernas" },
  { valor: "gluteos", rotulo: "Glúteos" },
  { valor: "quadriceps", rotulo: "Quadríceps" },
  { valor: "posteriores", rotulo: "Posteriores" },
  { valor: "peito", rotulo: "Peito" },
  { valor: "costas", rotulo: "Costas" },
  { valor: "ombros", rotulo: "Ombros" },
  { valor: "bracos", rotulo: "Braços" },
];

const PERGUNTAS: Pergunta[] = [
  {
    id: "dias",
    titulo: "Em uma semana normal, quantos dias você REALMENTE consegue treinar?",
    sub: "Não os que gostaria: os que costumam acontecer. Se você tem 5 livres mas treina 4, marque 4.",
    opcoes: [
      { valor: 2, rotulo: "2 dias" },
      { valor: 3, rotulo: "3 dias" },
      { valor: 4, rotulo: "4 dias" },
      { valor: 5, rotulo: "5 dias" },
      { valor: 6, rotulo: "6 ou mais" },
    ],
  },
  {
    id: "diasSelecionados",
    tipo: "agenda",
    titulo: "Quais dias normalmente existem para treinar?",
    sub: "Pode marcar mais dias do que treinos: os extras viram margem para remarcar.",
    opcoes: [],
  },
  {
    id: "tempo",
    titulo: "Quanto tempo você realmente tem em cada treino?",
    opcoes: [
      { valor: "ate30", rotulo: "Até 30 minutos" },
      { valor: "30a45", rotulo: "30 a 45 minutos" },
      { valor: "45a60", rotulo: "45 minutos a 1 hora" },
      { valor: "60a75", rotulo: "1 hora a 1h15" },
      { valor: "75mais", rotulo: "Mais de 1h15" },
    ],
  },
  {
    id: "objetivo",
    titulo: "O que você mais quer conquistar agora?",
    opcoes: [
      { valor: "massa", rotulo: "Ganhar massa muscular" },
      { valor: "emagrecer", rotulo: "Emagrecer preservando musculatura" },
      { valor: "forca", rotulo: "Ganhar força" },
      { valor: "saude", rotulo: "Melhorar saúde e condicionamento" },
      { valor: "voltar", rotulo: "Voltar a treinar e criar consistência" },
    ],
  },
  {
    id: "experiencia",
    titulo: "Onde você está hoje?",
    opcoes: [
      { valor: "iniciante", rotulo: "Estou começando ou voltando agora" },
      { valor: "base", rotulo: "Já treino, mas ainda construindo base" },
      { valor: "intermediario", rotulo: "Treino com consistência há mais de um ano" },
      { valor: "avancado", rotulo: "Treino há anos e já organizo meu próprio treino" },
    ],
  },
  {
    id: "prioridades",
    tipo: "prioridade",
    titulo: "Existe algum músculo que você quer priorizar?",
    sub: "Até dois. Priorizar tudo é o mesmo que não priorizar nada.",
    opcoes: [],
  },
  {
    id: "barreira",
    titulo: "O que mais faz você perder treinos?",
    opcoes: [
      { valor: "tempo", rotulo: "Falta de tempo ou trabalho" },
      { valor: "imprevisivel", rotulo: "Horários imprevisíveis" },
      { valor: "cansaco", rotulo: "Cansaço" },
      { valor: "viagens", rotulo: "Viagens" },
      { valor: "motivacao", rotulo: "Falta de motivação" },
      { valor: "nao_saber", rotulo: "Não saber o que fazer" },
      { valor: "longos", rotulo: "Treinos longos demais" },
      { valor: "abandono", rotulo: "Começo forte e depois abandono" },
      { valor: "raro", rotulo: "Raramente perco treino" },
    ],
  },
  {
    id: "preferencia",
    titulo: "Que tipo de rotina você acha mais fácil de manter?",
    opcoes: [
      { valor: "fullbody", rotulo: "Treinos de corpo inteiro" },
      { valor: "dividido", rotulo: "Dividir partes do corpo" },
      { valor: "tanto_faz", rotulo: "Sem preferência — pode sugerir" },
    ],
  },
];

/** Compatibilidade com o motor: deriva a distribuição antiga dos dias marcados. */
function distribuicaoDe(r: Partial<RotinaAnswers>): RotinaAnswers["distribuicao"] {
  if (r.agendaVariavel) return "variavel";
  const d = [...(r.diasSelecionados ?? [])].sort((a, b) => a - b);
  if (!d.length) return "nao_sei";
  let seq = 1, max = 1;
  for (let i = 1; i < d.length; i++) { seq = d[i] === d[i - 1] + 1 ? seq + 1 : 1; max = Math.max(max, seq); }
  return max >= 3 ? "consecutivos" : "espalhados";
}

const chip = (on: boolean) =>
  `text-left border px-5 py-4 min-h-[52px] transition-colors text-base ${foco} ${on ? "border-[#BA9E50] text-white bg-white/[0.06]" : "border-white/20 text-gray-300 hover:border-white/50 hover:text-white"}`;

function Semana({ semana, rotulo }: { semana: WeekDay[]; rotulo: string }) {
  return (
    <ol className="grid grid-cols-1 sm:grid-cols-7 gap-1 sm:gap-2" aria-label={rotulo}>
      {semana.map((d) => {
        const perdeu = d.sessao === "perdeu";
        const tem = !!d.sessao && !perdeu;
        return (
          <li key={d.dia} className={`flex sm:block items-center gap-3 sm:text-center py-2.5 sm:py-3 px-3 sm:px-0.5 border ${tem ? "border-[#BA9E50]/60 bg-[#BA9E50]/[0.08]" : perdeu ? "border-white/20 border-dashed" : "border-white/10"}`}>
            <span className={`w-10 sm:w-auto shrink-0 text-xs font-semibold tracking-wide ${tem ? "text-white" : "text-gray-500"}`}>{d.dia}</span>
            <span className={`block text-sm sm:text-[11px] sm:mt-1 leading-tight ${tem ? "text-[#BA9E50]" : "text-gray-500"}`}>
              {perdeu ? "perdeu" : d.sessao ?? "—"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function RotinaQuiz() {
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const [respostas, setRespostas] = useState<Partial<RotinaAnswers>>({});
  const [plan, setPlan] = useState<RotinaPlan | null>(null);
  const [salvoEm, setSalvoEm] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [perdido, setPerdido] = useState<number | null>(null);
  const [curta, setCurta] = useState<number | null>(null);
  const topoRef = useRef<HTMLDivElement>(null);
  const meioTrackRef = useRef(false);
  const planoBRef = useRef<HTMLDivElement>(null);

  // Plano B fica abaixo da dobra no resultado: o evento diz quem rolou até lá.
  useEffect(() => {
    const el = planoBRef.current;
    if (!el || etapa !== "resultado" || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        trackOncePerSession("routine_plan_b_view");
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [etapa]);

  useEffect(() => {
    trackOncePerSession("routine_tool_view");
    // Restauração adiada para fora do ciclo de render do efeito (padrão do
    // projeto — ver DiagnosticoQuiz).
    const id = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY_V1);
        if (raw) {
          const saved = JSON.parse(raw) as { respostas: RotinaAnswers; em?: string };
          if (saved?.respostas?.objetivo) {
            setRespostas(saved.respostas);
            setPlan(computeRotina(saved.respostas));
            setSalvoEm(saved.em ?? null);
            setEtapa("resultado");
            trackEvent("routine_saved_return");
            return;
          }
        }
        // Links pré-configurados: /treino-para-minha-rotina?dias=3
        const q = Number(new URLSearchParams(window.location.search).get("dias"));
        if ([2, 3, 4, 5, 6].includes(q)) setRespostas({ dias: q as RotinaAnswers["dias"] });
      } catch { /* sem estado salvo, segue do zero */ }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const irPara = (e: Etapa) => {
    setEtapa(e);
    topoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const avancar = (idx: number, novas: Partial<RotinaAnswers>) => {
    setRespostas(novas);
    if (idx === 0) trackOncePerSession("routine_tool_start");
    if (idx === Math.floor(PERGUNTAS.length / 2) && !meioTrackRef.current) {
      meioTrackRef.current = true;
      trackEvent("routine_tool_progress_50");
    }
    if (idx + 1 < PERGUNTAS.length) irPara(idx + 1);
    else irPara("seguranca");
  };
  const responder = (idx: number, valor: string | number) => avancar(idx, { ...respostas, [PERGUNTAS[idx].id]: valor });

  const salvar = (r: RotinaAnswers) => {
    const em = new Date().toLocaleDateString("pt-BR");
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ respostas: r, em })); } catch { /* sem persistência, o resultado ainda aparece */ }
    setSalvoEm(em);
  };

  const finalizar = (temLimitacao: boolean) => {
    const completas = { ambiente: "academia", ...respostas, temLimitacao, distribuicao: distribuicaoDe(respostas) } as RotinaAnswers;
    const resultado = computeRotina(completas);
    setRespostas(completas);
    setPlan(resultado);
    setPerdido(null);
    setCurta(null);
    salvar(completas);
    trackEvent("routine_tool_complete", {
      routine_days: completas.dias,
      routine_time: completas.tempo,
      routine_goal: completas.objetivo,
      routine_structure: resultado.structureId,
      routine_secondary: resultado.ranking[1]?.id ?? "nenhuma",
      routine_schedule: resultado.modo,
      routine_days_marked: completas.diasSelecionados?.length ?? 0,
      routine_barrier: completas.barreira,
      routine_priority_count: completas.prioridades?.length ?? 0,
    });
    trackEvent("routine_result_view", { routine_structure: resultado.structureId });
    registraConclusao("rotina");
    irPara("resultado");
  };

  const refinar = (campo: "recuperacao" | "cardio" | "ambiente", valor: string) => {
    const novas = { ...respostas, [campo]: valor } as RotinaAnswers;
    setRespostas(novas);
    setPlan(computeRotina(novas));
    setPerdido(null);
    salvar(novas);
    trackEvent("routine_refine", { campo, valor });
  };

  const refazer = () => {
    setRespostas({});
    setPlan(null);
    setPerdido(null);
    setCurta(null);
    meioTrackRef.current = false;
    try { localStorage.removeItem(STORAGE_KEY); sessionStorage.removeItem(STORAGE_KEY_V1); } catch { /* ok */ }
    irPara(0);
  };

  // ------------------------------------------------------------------ INTRO
  if (etapa === "intro") {
    return (
      <div ref={topoRef} className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-7 sm:p-10 relative">
        <div className="absolute top-0 left-0 h-[2px] w-24" style={{ background: DOURADO }} aria-hidden="true" />
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: DOURADO }}>
          Ferramenta gratuita
        </p>
        <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-4" style={titulo}>
          A melhor divisão de treino é a que você consegue repetir.
        </h2>
        <p className="text-gray-300 leading-relaxed mb-3 max-w-2xl">
          Conte quantos dias e quanto tempo você <strong className="text-white">realmente</strong> tem.
          A ferramenta compara Full Body, Upper/Lower, ABC, PPL e híbridos, mostra
          qual encaixa melhor na sua semana — e o que fazer quando ela sair do plano.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          {PERGUNTAS.length + 1} perguntas, cerca de 1 minuto. Sem cadastro. O resultado aparece na hora.
        </p>
        <button
          type="button"
          onClick={() => irPara(respostas.dias ? 1 : 0)}
          className={`bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[56px] ${foco}`}
        >
          {respostas.dias ? `Montar minha semana de ${respostas.dias} treinos →` : "Montar minha semana →"}
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------- PERGUNTAS
  if (typeof etapa === "number") {
    const p = PERGUNTAS[etapa];
    const progresso = ((etapa + 1) / (PERGUNTAS.length + 1)) * 100;
    const marcados = respostas.diasSelecionados ?? [];
    const prios = respostas.prioridades ?? [];
    return (
      <div ref={topoRef} className="border border-white/15 bg-white/[0.03] p-6 sm:p-9">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400 tracking-wide">
            {etapa + 1} de {PERGUNTAS.length + 1}
          </p>
          {etapa > 0 && (
            <button type="button" onClick={() => irPara(etapa - 1)} className={`text-xs text-gray-400 hover:text-white underline underline-offset-2 transition-colors ${foco}`}>
              ← voltar
            </button>
          )}
        </div>
        <div className="h-1 bg-white/10 mb-7" role="progressbar" aria-valuenow={Math.round(progresso)} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do questionário">
          <div className="h-full transition-all duration-300" style={{ width: `${progresso}%`, background: DOURADO }} />
        </div>
        <h3 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-2" style={titulo}>
          {p.titulo}
        </h3>
        {p.sub && <p className="text-gray-400 text-sm mb-5">{p.sub}</p>}

        {p.tipo === "agenda" ? (
          <div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4" role="group" aria-label="Dias da semana que existem para treinar">
              {DIAS_SEMANA.map((d, i) => {
                const on = marcados.includes(i);
                return (
                  <button key={d} type="button" aria-pressed={on} disabled={!!respostas.agendaVariavel}
                    onClick={() => setRespostas({ ...respostas, agendaVariavel: false, diasSelecionados: on ? marcados.filter((x) => x !== i) : [...marcados, i].sort((a, b) => a - b) })}
                    className={`py-3 min-h-[52px] border text-sm font-semibold transition-colors disabled:opacity-40 ${foco} ${on ? "border-[#BA9E50] bg-[#BA9E50]/[0.15] text-white" : "border-white/20 text-gray-300 hover:border-white/50"}`}>
                    {on ? "✓ " : ""}{d}
                  </button>
                );
              })}
            </div>
            <button type="button" aria-pressed={!!respostas.agendaVariavel}
              onClick={() => setRespostas({ ...respostas, agendaVariavel: !respostas.agendaVariavel, diasSelecionados: [] })}
              className={chip(!!respostas.agendaVariavel) + " w-full mb-4"}>
              {respostas.agendaVariavel ? "✓ " : ""}Meus dias mudam toda semana (escala, plantão, viagens)
            </button>
            <p className="text-gray-400 text-sm mb-5" aria-live="polite">
              {respostas.agendaVariavel
                ? "Então a semana vira uma sequência: você faz o próximo treino no próximo dia disponível."
                : marcados.length === 0
                  ? `Marque os dias. Você disse que treina ${respostas.dias ?? "—"} vezes.`
                  : marcados.length < (respostas.dias ?? 0)
                    ? `Você marcou ${marcados.length} dia(s) para ${respostas.dias} treinos. Sem problema: os treinos seguem em sequência.`
                    : marcados.length > (respostas.dias ?? 0)
                      ? `${marcados.length - (respostas.dias ?? 0)} dia(s) a mais viram margem para remarcar um treino perdido.`
                      : "Perfeito: um treino em cada dia marcado."}
            </p>
            <button type="button" disabled={!respostas.agendaVariavel && marcados.length === 0}
              onClick={() => { trackEvent("routine_schedule_commit", { routine_days_committed: marcados.length, routine_schedule: respostas.agendaVariavel ? "sequencia" : "calendario" }); avancar(etapa, respostas); }}
              className={`bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] disabled:opacity-40 disabled:cursor-not-allowed ${foco}`}>
              Continuar →
            </button>
          </div>
        ) : p.tipo === "prioridade" ? (
          <div>
            <div className="grid grid-cols-2 gap-2 mb-4" role="group" aria-label="Músculos para priorizar, até dois">
              {PRIORIDADES.map((o) => {
                const on = prios.includes(o.valor);
                const cheio = !on && prios.length >= 2;
                return (
                  <button key={o.valor} type="button" aria-pressed={on} disabled={cheio}
                    onClick={() => setRespostas({ ...respostas, prioridades: on ? prios.filter((x) => x !== o.valor) : [...prios, o.valor] })}
                    className={chip(on) + " disabled:opacity-40"}>
                    {on ? "✓ " : ""}{o.rotulo}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => avancar(etapa, respostas)} disabled={prios.length === 0}
                className={`bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] disabled:opacity-40 disabled:cursor-not-allowed ${foco}`}>
                Continuar →
              </button>
              <button type="button" onClick={() => avancar(etapa, { ...respostas, prioridades: [] })} className={chip(false)}>
                Nenhum em especial
              </button>
            </div>
          </div>
        ) : (
          <div className={`grid gap-3 ${p.sub ? "" : "mt-5"}`}>
            {p.opcoes.map((o) => (
              <button key={String(o.valor)} type="button" onClick={() => responder(etapa, o.valor)} className={chip(respostas[p.id] === o.valor)}>
                {o.rotulo}
              </button>
            ))}
            {p.id === "dias" && (
              <p className="text-gray-500 text-xs leading-relaxed">
                Tem os sete dias livres? Disponibilidade não é necessidade: musculação todo dia raramente é o que falta. Marque quantos você quer de fato usar.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------- SEGURANÇA
  if (etapa === "seguranca") {
    return (
      <div ref={topoRef} className="border border-white/15 bg-white/[0.03] p-6 sm:p-9">
        <p className="text-xs text-gray-400 tracking-wide mb-6">Última pergunta</p>
        <h3 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-2" style={titulo}>
          Existe alguma condição, dor ou limitação que exija adaptação individual do treino?
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Não precisamos de detalhes — só de saber se a estrutura pode ser geral ou se seu caso pede cuidado individual.
        </p>
        <div className="grid gap-3">
          <button type="button" onClick={() => finalizar(false)} className={chip(false)}>
            Não, posso seguir uma estrutura geral
          </button>
          <button type="button" onClick={() => finalizar(true)} className={chip(false)}>
            Sim, tenho uma condição ou dor que precisa de adaptação
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------- RESULTADO
  if (!plan) return null;
  const answers = respostas as RotinaAnswers;
  const diasTreino = plan.semana.map((d, i) => (d.sessao ? i : -1)).filter((i) => i >= 0);
  const margemDias = (answers.diasSelecionados ?? []).filter((d) => !diasTreino.includes(d));
  const fallback = perdido !== null ? buildFallbackPlan(plan, perdido, margemDias) : null;
  const semanaTxt = plan.semana.filter((d) => d.sessao).map((d) => `${d.dia} ${d.sessao}`).join("\n");

  return (
    <div ref={topoRef} className="space-y-8" aria-live="polite">
      {plan.temLimitacao && (
        <div className="border border-[#BA9E50]/50 bg-[#BA9E50]/[0.06] p-6">
          <p className="text-white font-semibold mb-2">Sobre a sua limitação</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Uma ferramenta automática não consegue considerar todas as suas
            individualidades com segurança. A estrutura abaixo mostra os
            princípios gerais para a sua rotina — mas no seu caso a prescrição
            precisa considerar sua situação individual, junto com quem te
            acompanha (médico ou fisioterapeuta quando houver dor, e um
            profissional de treino para as adaptações).
          </p>
        </div>
      )}

      {/* Estrutura + semana */}
      <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-6 sm:p-9 relative">
        <div className="absolute top-0 left-0 h-[2px] w-24" style={{ background: DOURADO }} aria-hidden="true" />
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: DOURADO }}>
          Melhor estrutura para sua rotina agora
        </p>
        <h3 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={titulo}>
          {plan.structureName}
        </h3>
        <p className="text-gray-300 mb-6">
          {plan.sessoesPorSemana} sessões por semana · {plan.duracaoAlvo} cada
        </p>

        {plan.modo === "sequencia" ? (
          <div className="mb-6">
            <p className="text-white font-semibold mb-2">Use sequência, não calendário</p>
            <ol className="flex flex-wrap items-center gap-2 mb-3" aria-label="Ordem dos treinos">
              {plan.sequencia.map((s, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.08] px-3 py-2 text-sm text-white">{s}</span>
                  <span aria-hidden="true" className="text-gray-500">→</span>
                </li>
              ))}
              <li className="text-sm text-gray-400">volta ao início</li>
            </ol>
            <p className="text-gray-300 text-sm">Faça o próximo treino no próximo dia disponível. Perdeu um dia? Nada se perde: você continua de onde parou.</p>
          </div>
        ) : (
          <div className="mb-6"><Semana semana={plan.semana} rotulo="Sua semana de treino" /></div>
        )}

        <div className="space-y-5 text-gray-300 text-sm sm:text-base leading-relaxed">
          <div>
            <p className="text-white font-semibold mb-2">Por que escolhemos essa divisão</p>
            <ul className="space-y-1.5">
              {plan.porqueLista.map((t) => <li key={t} className="flex gap-2"><span aria-hidden="true" style={{ color: DOURADO }}>✓</span><span>{t}</span></li>)}
            </ul>
          </div>
          {plan.porqueNaoMais && (
            <div>
              <p className="text-white font-semibold mb-1">Por que não mais dias</p>
              <p>{plan.porqueNaoMais}</p>
            </div>
          )}
          {plan.notaDistribuicao && <p>{plan.notaDistribuicao}</p>}
          {plan.notaPrioridade && <p>{plan.notaPrioridade}</p>}
          {plan.notaTempo && <p>{plan.notaTempo}</p>}
          {plan.notaObjetivo && <p>{plan.notaObjetivo}</p>}
          <div>
            <p className="text-white font-semibold mb-1">Como os grupos ficam distribuídos</p>
            <ul className="list-disc pl-5 space-y-0.5">
              {plan.frequencia.map((f) => <li key={f.regiao}>{f.regiao}: {f.vezes} {f.vezes === 1 ? "vez" : "vezes"} por semana</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Cabe na sua semana? */}
      <div className="border border-white/15 bg-white/[0.03] p-6 sm:p-8">
        <p className="text-white font-bold text-lg mb-3" style={titulo}>Isso cabe na sua semana?</p>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
          <dt className="text-gray-400">Você informou</dt><dd className="text-white">{answers.dias} dias · {plan.duracaoAlvo}</dd>
          <dt className="text-gray-400">A estrutura pede</dt><dd className="text-white">{plan.sessoesPorSemana} sessões</dd>
          <dt className="text-gray-400">Musculação na semana</dt><dd className="text-white">{plan.tempoSemanal}</dd>
          {plan.margem > 0 && <><dt className="text-gray-400">Margem</dt><dd className="text-white">{plan.margem} dia(s) livre(s) para remarcar</dd></>}
        </dl>
        <p className={`text-sm leading-relaxed ${plan.cabe.ok ? "text-gray-200" : "text-white"}`}>{plan.cabe.ok ? "✓ " : "! "}{plan.cabe.texto}</p>
        <p className="text-gray-500 text-xs mt-2">Sem contar deslocamento.</p>
      </div>

      {/* Alternativas */}
      {plan.ranking.length > 1 && (
        <div className="border border-white/15 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-white font-bold text-lg mb-1" style={titulo}>Outras estruturas que também poderiam funcionar</p>
          <p className="text-gray-400 text-sm mb-4">Não existe divisão vencedora: com volume e esforço adequados, várias funcionam. A diferença é como cada uma encaixa na sua semana.</p>
          <div className="space-y-3">
            {plan.ranking.slice(1).map((r) => (
              <details key={r.id} className="border border-white/10 p-4" onToggle={(e) => { if ((e.target as HTMLDetailsElement).open) trackEvent("routine_why_click", { routine_structure: plan.structureId, routine_alternative: r.id }); }}>
                <summary className="cursor-pointer min-h-[32px] text-white">
                  <span className="text-xs uppercase tracking-[0.12em] text-gray-400 block">{r.rotulo}</span>
                  {r.nome} <span className="text-sm text-gray-400">· por que não ficou em primeiro?</span>
                </summary>
                <div className="mt-3 text-sm text-gray-300 space-y-3">
                  <ul className="list-disc pl-5 space-y-1">{r.contras.map((c) => <li key={c}>{c}</li>)}</ul>
                  {r.pros.length > 0 && <p className="text-gray-400">A favor dela: {r.pros.slice(1, 3).join("; ")}.</p>}
                  <Semana semana={r.semana} rotulo={`Semana com ${r.nome}`} />
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Risco de aderência */}
      <div className="border border-white/15 bg-white/[0.03] p-6 sm:p-8">
        <p className="text-white font-semibold mb-2">{plan.riscoAderencia.titulo}</p>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{plan.riscoAderencia.texto}</p>
      </div>

      {/* Plano B */}
      <div ref={planoBRef} className="border border-[#BA9E50]/40 bg-white/[0.03] p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: DOURADO }}>
          E quando a semana sair do plano?
        </p>
        <p className="text-white font-bold text-lg mb-2" style={titulo}>Perdeu um treino? A semana não está perdida.</p>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          O corpo não sabe que sexta-feira &ldquo;é dia de perna&rdquo;. A sequência importa mais que o nome do dia: continue de onde parou, no próximo dia disponível.
        </p>
        {plan.modo === "calendario" && (
          <>
            <p className="text-sm text-white mb-2">Qual treino você perdeu?</p>
            <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Escolha o dia do treino perdido">
              {diasTreino.map((i) => (
                <button key={i} type="button" aria-pressed={perdido === i}
                  onClick={() => { setPerdido(perdido === i ? null : i); trackEvent("routine_plan_b_use", { routine_structure: plan.structureId }); }}
                  className={`px-3 py-2.5 min-h-[44px] border text-sm ${foco} ${perdido === i ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/50"}`}>
                  {DIAS_SEMANA[i]} · {plan.semana[i].sessao}
                </button>
              ))}
            </div>
            {fallback && (
              <div className="mb-5 space-y-3">
                <Semana semana={fallback.semana} rotulo="Semana reorganizada" />
                <p className="text-gray-200 text-sm">{fallback.texto}</p>
              </div>
            )}
          </>
        )}
        <p className="text-sm text-white mb-2">Esta semana só consegue menos treinos?</p>
        <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Quantos treinos consegue esta semana">
          {Array.from({ length: plan.sessoesPorSemana - 1 }, (_, i) => i + 1).map((k) => (
            <button key={k} type="button" aria-pressed={curta === k}
              onClick={() => { setCurta(curta === k ? null : k); trackEvent("routine_week_adjust", { routine_structure: plan.structureId, routine_week_sessions: k }); }}
              className={`px-3 py-2.5 min-h-[44px] border text-sm ${foco} ${curta === k ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/50"}`}>
              Só {k}
            </button>
          ))}
        </div>
        {curta !== null && (
          <div className="text-sm text-gray-200 space-y-2 mb-4">
            <p><span className="text-white font-semibold">Nesta semana:</span> {semanaCurta(plan, curta).join(" → ")}, priorizando os movimentos principais.</p>
            <p className="text-gray-400">Você não precisa criar um treino novo porque uma semana ficou apertada. Na próxima, volta à estrutura normal.</p>
          </div>
        )}
        <p className="text-gray-400 text-sm leading-relaxed">{plan.planoB.texto}</p>
      </div>

      {/* Refinar */}
      <details className="border border-white/15 bg-white/[0.03] p-6">
        <summary className="cursor-pointer text-white font-semibold min-h-[32px]">Quer deixar mais preciso?</summary>
        <div className="mt-4 space-y-5 text-sm">
          {([
            ["recuperacao", "Como você costuma recuperar entre os treinos?", [["bem", "Bem"], ["medio", "Mais ou menos"], ["cansado", "Chego cansado ao treino seguinte"], ["nao_sei", "Não sei"]]],
            ["cardio", "Faz cardio ou esporte que cansa as pernas (corrida, futebol, bike, luta)?", [["nao", "Não"], ["pouco", "1–2x por semana"], ["muito", "3x ou mais"]]],
            ["ambiente", "Onde você treina?", [["academia", "Academia completa"], ["condominio", "Academia de condomínio"], ["casa_equipada", "Em casa, com equipamentos"], ["casa_pouco", "Em casa, com pouco equipamento"]]],
          ] as const).map(([campo, pergunta, ops]) => (
            <fieldset key={campo}>
              <legend className="text-white mb-2">{pergunta}</legend>
              <div className="flex flex-wrap gap-2">
                {ops.map(([v, rot]) => (
                  <button key={v} type="button" aria-pressed={answers[campo] === v} onClick={() => refinar(campo, v)}
                    className={`px-3 py-2.5 min-h-[44px] border ${foco} ${answers[campo] === v ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/50"}`}>
                    {rot}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
          <p className="text-gray-500 text-xs">O resultado acima se atualiza na hora.</p>
        </div>
      </details>

      {/* Próximos passos dentro do site */}
      <div className="border border-white/15 p-5 text-sm text-gray-300 space-y-2">
        <p>
          <strong className="text-white">Já tem treino montado?</strong> Veja se o volume semanal está bem distribuído —{" "}
          <Link href="/ferramentas/calculadora-volume-treino" onClick={() => trackEvent("routine_volume_click", { routine_structure: plan.structureId })} className={`text-white font-semibold ${ln}`}>
            analisar meu volume →
          </Link>
        </p>
        <p>
          Algum exercício não existe na sua academia?{" "}
          <Link href="/ferramentas/substituidor-de-exercicios" onClick={() => trackEvent("routine_article_click", { routine_structure: plan.structureId, article_slug: "substituidor" })} className={ln}>Encontrar substituto →</Link>
        </p>
        {(answers.prioridades ?? []).length > 0 && (
          <p>
            Quer ver exercícios para a sua prioridade?{" "}
            <Link href={`/exercicios/${({ pernas: "quadriceps", gluteos: "gluteos", quadriceps: "quadriceps", posteriores: "posterior-de-coxa", peito: "peito", costas: "costas", ombros: "ombros", bracos: "biceps" } as Record<Prioridade, string>)[(answers.prioridades ?? [])[0]]}`}
              onClick={() => trackEvent("routine_article_click", { routine_structure: plan.structureId, article_slug: "mapa" })} className={ln}>Abrir o Mapa Muscular →</Link>
          </p>
        )}
        <p className="text-gray-500">Depois: <Link href="/ferramentas/calculadora-descanso-entre-series" className={ln}>quanto descansar entre as séries</Link>.</p>
      </div>

      {/* Conversão */}
      <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-7 sm:p-9 relative">
        <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: DOURADO }} aria-hidden="true" />
        <p className="text-white font-bold text-xl mb-3" style={titulo}>
          A divisão resolve a semana. O treino ainda precisa ser seu.
        </p>
        <p className="text-gray-300 leading-relaxed mb-3">
          Agora você sabe como distribuir seus dias. Exercícios, volume,
          intensidade, progressão e os ajustes de quando a carga para de subir,
          um exercício não encaixa ou a rotina muda dependem do seu contexto.
        </p>
        <p className="text-gray-300 leading-relaxed mb-6">
          Seu treino precisa caber na sua vida — e depois precisa evoluir com ela.
          É esse acompanhamento que eu faço, junto com você, toda semana.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mb-2">
          <a
            href={getWhatsAppUrl(buildRotinaWhatsApp(plan, answers, plan.modo === "calendario" ? diasTreino : undefined))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("routine_whatsapp_click", { routine_structure: plan.structureId, routine_has_schedule: plan.modo === "calendario" })}
            className={`inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[52px] ${foco}`}
          >
            Quero organizar meu treino com o Montinho →
          </a>
          <Link
            href="/consultoria"
            onClick={() => trackEvent("routine_service_click", { routine_structure: plan.structureId })}
            className={`inline-flex items-center text-sm text-gray-300 min-h-[44px] ${ln}`}
          >
            Ver como funciona o acompanhamento
          </Link>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed mb-4">
          Abre o WhatsApp com a sua estrutura já preenchida — é só enviar.
        </p>
        <p className="text-gray-400 text-xs leading-relaxed">
          Ficou com dúvida sobre a divisão?{" "}
          <Link href="/pergunte-ao-montinho" onClick={() => trackEvent("routine_ask_click")} className="underline underline-offset-2 hover:text-white transition-colors">
            Pergunte ao Montinho
          </Link>{" "}
          · Quer ir além da divisão? O{" "}
          <Link href="/diagnostico" onClick={() => trackEvent("routine_diagnostic_click")} className="underline underline-offset-2 hover:text-white transition-colors">
            Diagnóstico Montinho
          </Link>{" "}
          considera outros aspectos da sua situação atual.
        </p>
      </div>

      {/* Artigos relacionados */}
      {plan.artigos.length > 0 && (
        <div className="border border-white/15 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-white font-semibold mb-4">Para entender melhor a sua estrutura</p>
          <ul className="space-y-2">
            {plan.artigos.map((art) => (
              <li key={art.slug}>
                <Link
                  href={`/blog/${art.slug}`}
                  onClick={() => trackEvent("routine_article_click", { routine_structure: plan.structureId, article_slug: art.slug })}
                  className={`text-gray-300 text-sm sm:text-base ${ln}`}
                >
                  {art.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Levar o plano embora */}
      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-5 print:hidden">
        <div onClickCapture={() => trackEvent("routine_share", { routine_structure: plan.structureId })}>
          <Compartilhar
            contexto="tool-result" titulo="Treino Para Minha Rotina" caminho="/treino-para-minha-rotina" local="tool_result" ferramenta="treino_para_minha_rotina"
            resultado={[`Minha estrutura ficou assim: ${plan.structureName}`, plan.modo === "sequencia" ? plan.sequencia.join(" → ") : semanaTxt]}
            gancho="Descubra qual divisão combina com a sua rotina:" aparencia="solido"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            const linhas = [
              `Minha rotina de treino — ${plan.structureName}`,
              `${plan.sessoesPorSemana}x por semana · ${plan.duracaoAlvo}`,
              "",
              plan.modo === "sequencia" ? `Sequência: ${plan.sequencia.join(" → ")} (próximo treino no próximo dia disponível)` : `Semana:\n${semanaTxt}`,
              "",
              "Perdeu um treino? Continue a sequência no próximo dia disponível.",
              `Semana apertada: ${plan.planoB.estrutura}.`,
              "",
              "Montado no Treino Para Minha Rotina — montinhopersonal.com.br/treino-para-minha-rotina",
            ];
            navigator.clipboard?.writeText(linhas.join("\n")).then(() => {
              setCopiado(true);
              setTimeout(() => setCopiado(false), 2500);
            });
            trackEvent("routine_plan_copied", { routine_structure: plan.structureId });
          }}
          className={`px-4 py-2.5 min-h-[44px] border border-white/25 text-gray-200 text-sm hover:border-white/50 transition-colors ${foco}`}
        >
          {copiado ? "Copiado ✓" : "Copiar minha semana"}
        </button>
        <button
          type="button"
          onClick={() => { trackEvent("routine_plan_saved", { routine_structure: plan.structureId }); window.print(); }}
          className={`px-4 py-2.5 min-h-[44px] border border-white/25 text-gray-200 text-sm hover:border-white/50 transition-colors ${foco}`}
        >
          Imprimir / salvar PDF
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-gray-500 text-xs max-w-md leading-relaxed">
          {salvoEm ? `Rotina salva neste aparelho em ${salvoEm}. ` : ""}Esta é a melhor estrutura para a sua rotina agora. Quando a vida mudar, refaça.
        </p>
        <button type="button" onClick={refazer} className={`text-xs text-gray-300 hover:text-white underline underline-offset-2 transition-colors whitespace-nowrap ${foco}`}>
          Minha rotina mudou
        </button>
      </div>
    </div>
  );
}
