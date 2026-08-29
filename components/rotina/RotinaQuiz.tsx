"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  computeRotina,
  validarDias,
  buildRotinaWhatsApp,
  DIAS_SEMANA,
  type RotinaAnswers,
  type RotinaPlan,
} from "@/lib/rotina/engine";

/**
 * Quiz do Treino Para Minha Rotina.
 *
 * Uma decisão por tela, motor determinístico local (zero rede), resultado
 * primeiro e conversão depois. Estado vive em sessionStorage — nada de
 * cadastro, nada de PII, nada persistido em servidor.
 */

const STORAGE_KEY = "mt_rotina_v1";

type Etapa = "intro" | number | "seguranca" | "resultado";

interface Pergunta {
  id: keyof RotinaAnswers;
  titulo: string;
  sub?: string;
  opcoes: Array<{ valor: string | number; rotulo: string; detalhe?: string }>;
}

const PERGUNTAS: Pergunta[] = [
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
    id: "dias",
    titulo: "Em uma semana normal, quantos dias você REALMENTE consegue treinar?",
    sub: "Escolha pensando na sua agenda real, não na sua semana perfeita.",
    opcoes: [
      { valor: 2, rotulo: "2 dias" },
      { valor: 3, rotulo: "3 dias" },
      { valor: 4, rotulo: "4 dias" },
      { valor: 5, rotulo: "5 dias" },
      { valor: 6, rotulo: "6 ou mais" },
    ],
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
    id: "experiencia",
    titulo: "Onde você está hoje?",
    opcoes: [
      { valor: "iniciante", rotulo: "Nunca treinei / estou começando" },
      { valor: "base", rotulo: "Já treino, mas ainda construindo base" },
      { valor: "intermediario", rotulo: "Treino com consistência há um tempo" },
      { valor: "avancado", rotulo: "Sou avançado" },
    ],
  },
  {
    id: "ambiente",
    titulo: "Onde você vai treinar?",
    opcoes: [
      { valor: "academia", rotulo: "Academia completa" },
      { valor: "condominio", rotulo: "Academia de condomínio" },
      { valor: "casa_equipada", rotulo: "Em casa, com equipamentos" },
      { valor: "casa_pouco", rotulo: "Em casa, com pouco equipamento" },
    ],
  },
  {
    id: "distribuicao",
    titulo: "Como são seus dias disponíveis?",
    opcoes: [
      { valor: "espalhados", rotulo: "Consigo espalhar os treinos na semana" },
      { valor: "consecutivos", rotulo: "Preciso treinar em dias seguidos" },
      { valor: "variavel", rotulo: "Minha agenda varia bastante" },
      { valor: "fim_de_semana", rotulo: "Concentro no fim de semana" },
      { valor: "nao_sei", rotulo: "Ainda não sei" },
    ],
  },
  {
    id: "barreira",
    titulo: "O que mais faz você perder treinos?",
    opcoes: [
      { valor: "tempo", rotulo: "Falta de tempo" },
      { valor: "imprevisivel", rotulo: "Agenda imprevisível" },
      { valor: "cansaco", rotulo: "Cansaço" },
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

export default function RotinaQuiz() {
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const [respostas, setRespostas] = useState<Partial<RotinaAnswers>>({});
  const [plan, setPlan] = useState<RotinaPlan | null>(null);
  const [diasEscolhidos, setDiasEscolhidos] = useState<number[]>([]);
  const [copiado, setCopiado] = useState(false);
  const [agendaFeita, setAgendaFeita] = useState(false);
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
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw) as { respostas: RotinaAnswers };
        if (saved?.respostas?.objetivo) {
          setRespostas(saved.respostas);
          setPlan(computeRotina(saved.respostas));
          setEtapa("resultado");
        }
      } catch { /* sem estado salvo, segue do zero */ }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const irPara = (e: Etapa) => {
    setEtapa(e);
    topoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const responder = (idx: number, valor: string | number) => {
    const p = PERGUNTAS[idx];
    const novas = { ...respostas, [p.id]: valor } as Partial<RotinaAnswers>;
    setRespostas(novas);
    if (idx === 0) trackOncePerSession("routine_tool_start");
    if (idx === Math.floor(PERGUNTAS.length / 2) && !meioTrackRef.current) {
      meioTrackRef.current = true;
      trackEvent("routine_tool_progress_50");
    }
    if (idx + 1 < PERGUNTAS.length) irPara(idx + 1);
    else irPara("seguranca");
  };

  const finalizar = (temLimitacao: boolean) => {
    const completas = { ...respostas, temLimitacao } as RotinaAnswers;
    const resultado = computeRotina(completas);
    setRespostas(completas);
    setPlan(resultado);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ respostas: completas }));
    } catch { /* sem persistência, o resultado ainda aparece */ }
    trackEvent("routine_tool_complete", {
      routine_days: completas.dias,
      routine_time: completas.tempo,
      routine_goal: completas.objetivo,
      routine_structure: resultado.structureId,
    });
    trackEvent("routine_result_view", { routine_structure: resultado.structureId });
    irPara("resultado");
  };

  const refazer = () => {
    setRespostas({});
    setPlan(null);
    setDiasEscolhidos([]);
    setAgendaFeita(false);
    meioTrackRef.current = false;
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ok */ }
    irPara(0);
  };

  const toggleDia = (i: number) => {
    setAgendaFeita(false);
    setDiasEscolhidos((prev) =>
      prev.includes(i) ? prev.filter((d) => d !== i) : [...prev, i].sort((a, b) => a - b)
    );
  };

  const confirmarAgenda = () => {
    setAgendaFeita(true);
    trackEvent("routine_schedule_commit", { routine_days_committed: diasEscolhidos.length });
  };

  // ------------------------------------------------------------------ INTRO
  if (etapa === "intro") {
    return (
      <div ref={topoRef} className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-7 sm:p-10 relative">
        <div className="absolute top-0 left-0 h-[2px] w-24" style={{ background: "#BA9E50" }} aria-hidden="true" />
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
          Ferramenta gratuita
        </p>
        <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Quantos dias você realmente tem? Vamos começar por aí.
        </h2>
        <p className="text-gray-300 leading-relaxed mb-3 max-w-2xl">
          Responda {PERGUNTAS.length} perguntas sobre sua rotina real — não sobre a
          semana perfeita — e veja qual estrutura de musculação combina com seu
          objetivo, sua experiência e o tempo que você tem <strong className="text-white">agora</strong>.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Leva cerca de 1 minuto. Sem cadastro. O resultado aparece na hora.
        </p>
        <button
          type="button"
          onClick={() => irPara(0)}
          className="bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[56px]"
        >
          Montar minha rotina →
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------- PERGUNTAS
  if (typeof etapa === "number") {
    const p = PERGUNTAS[etapa];
    const progresso = ((etapa + 1) / (PERGUNTAS.length + 1)) * 100;
    return (
      <div ref={topoRef} className="border border-white/15 bg-white/[0.03] p-6 sm:p-9">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400 tracking-wide">
            {etapa + 1} de {PERGUNTAS.length}
          </p>
          {etapa > 0 && (
            <button type="button" onClick={() => irPara(etapa - 1)} className="text-xs text-gray-400 hover:text-white underline underline-offset-2 transition-colors">
              ← voltar
            </button>
          )}
        </div>
        <div className="h-1 bg-white/10 mb-7" role="progressbar" aria-valuenow={Math.round(progresso)} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do questionário">
          <div className="h-full transition-all duration-300" style={{ width: `${progresso}%`, background: "#BA9E50" }} />
        </div>
        <h3 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          {p.titulo}
        </h3>
        {p.sub && <p className="text-gray-400 text-sm mb-5">{p.sub}</p>}
        <div className={`grid gap-3 ${p.sub ? "" : "mt-5"}`}>
          {p.opcoes.map((o) => (
            <button
              key={String(o.valor)}
              type="button"
              onClick={() => responder(etapa, o.valor)}
              className={`text-left border px-5 py-4 min-h-[52px] transition-colors text-base ${
                respostas[p.id] === o.valor
                  ? "border-[#BA9E50] text-white bg-white/[0.06]"
                  : "border-white/20 text-gray-300 hover:border-white/50 hover:text-white"
              }`}
            >
              {o.rotulo}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------- SEGURANÇA
  if (etapa === "seguranca") {
    return (
      <div ref={topoRef} className="border border-white/15 bg-white/[0.03] p-6 sm:p-9">
        <p className="text-xs text-gray-400 tracking-wide mb-6">Última pergunta</p>
        <h3 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Existe alguma condição, dor ou limitação que exija adaptação individual do treino?
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Não precisamos de detalhes — só de saber se a estrutura pode ser geral ou se seu caso pede cuidado individual.
        </p>
        <div className="grid gap-3">
          <button type="button" onClick={() => finalizar(false)} className="text-left border border-white/20 px-5 py-4 min-h-[52px] text-gray-300 hover:border-white/50 hover:text-white transition-colors">
            Não, posso seguir uma estrutura geral
          </button>
          <button type="button" onClick={() => finalizar(true)} className="text-left border border-white/20 px-5 py-4 min-h-[52px] text-gray-300 hover:border-white/50 hover:text-white transition-colors">
            Sim, tenho uma condição ou dor que precisa de adaptação
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------- RESULTADO
  if (!plan) return null;
  const answers = respostas as RotinaAnswers;
  const avisoAgenda = validarDias(diasEscolhidos, plan);

  return (
    <div ref={topoRef} className="space-y-8">
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

      {/* Estrutura */}
      <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-7 sm:p-9 relative">
        <div className="absolute top-0 left-0 h-[2px] w-24" style={{ background: "#BA9E50" }} aria-hidden="true" />
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
          Sua estrutura sugerida agora
        </p>
        <h3 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          {plan.structureName}
        </h3>
        <p className="text-gray-300 mb-6">
          {plan.sessoesPorSemana} sessões por semana · {plan.duracaoAlvo} cada
        </p>

        {/* Semana visual */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6" role="list" aria-label="Sua semana de treino">
          {plan.semana.map((d) => (
            <div key={d.dia} role="listitem" className={`text-center py-3 px-0.5 border ${d.sessao ? "border-[#BA9E50]/60 bg-[#BA9E50]/[0.08]" : "border-white/10"}`}>
              <p className={`text-[10px] sm:text-xs font-semibold tracking-wide ${d.sessao ? "text-white" : "text-gray-500"}`}>{d.dia}</p>
              <p className={`text-[9px] sm:text-[11px] mt-1 leading-tight ${d.sessao ? "text-[#BA9E50]" : "text-gray-600"}`}>
                {d.sessao ?? "livre"}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
          <div>
            <p className="text-white font-semibold mb-1">Por que essa estrutura</p>
            <p>{plan.porque}</p>
          </div>
          {plan.porqueNaoMais && (
            <div>
              <p className="text-white font-semibold mb-1">Por que não mais dias</p>
              <p>{plan.porqueNaoMais}</p>
            </div>
          )}
          {plan.notaDistribuicao && <p>{plan.notaDistribuicao}</p>}
          {plan.notaTempo && <p>{plan.notaTempo}</p>}
          {plan.notaObjetivo && <p>{plan.notaObjetivo}</p>}
          <div>
            <p className="text-white font-semibold mb-1">Foco da estrutura</p>
            <ul className="list-disc pl-5 space-y-1">
              {plan.focos.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Risco de aderência */}
      <div className="border border-white/15 bg-white/[0.03] p-6 sm:p-8">
        <p className="text-white font-semibold mb-2">{plan.riscoAderencia.titulo}</p>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{plan.riscoAderencia.texto}</p>
      </div>

      {/* Plano B */}
      <div ref={planoBRef} className="border border-white/15 bg-white/[0.03] p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
          E quando a semana der errado?
        </p>
        <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Plano B: {plan.planoB.estrutura}
        </p>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{plan.planoB.texto}</p>
      </div>

      {/* Agenda — implementation intentions */}
      <div className="border border-white/15 bg-white/[0.03] p-6 sm:p-8">
        <p className="text-white font-bold text-lg mb-1" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Agora transforme intenção em agenda
        </p>
        <p className="text-gray-400 text-sm mb-5">
          Quais dias você pretende reservar? Esses são os dias que você escolheu porque fazem sentido para a sua rotina atual.
        </p>
        <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Escolha seus dias de treino">
          {DIAS_SEMANA.map((d, i) => (
            <button
              key={d}
              type="button"
              aria-pressed={diasEscolhidos.includes(i)}
              onClick={() => toggleDia(i)}
              className={`px-4 py-3 min-h-[48px] min-w-[52px] border text-sm font-semibold transition-colors ${
                diasEscolhidos.includes(i)
                  ? "border-[#BA9E50] bg-[#BA9E50]/[0.12] text-white"
                  : "border-white/20 text-gray-300 hover:border-white/50"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        {avisoAgenda && <p className="text-gray-300 text-sm leading-relaxed mb-4 border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}>{avisoAgenda}</p>}
        {agendaFeita && diasEscolhidos.length > 0 ? (
          <p className="text-white text-sm">
            <strong>Seu compromisso real:</strong>{" "}
            {diasEscolhidos.map((i) => DIAS_SEMANA[i]).join(" • ")} · {plan.duracaoAlvo}.
            {" "}Se perder um, o próximo continua normalmente.
          </p>
        ) : (
          <button
            type="button"
            onClick={confirmarAgenda}
            disabled={diasEscolhidos.length === 0}
            className="border border-white text-white px-6 py-3 text-sm font-semibold tracking-wide hover:bg-white hover:text-black transition-colors min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirmar meus dias
          </button>
        )}
      </div>

      {/* Quebra de crença + conversão */}
      <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-7 sm:p-9 relative">
        <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
        <p className="text-white font-bold text-xl mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Mas esse é o treino perfeito?
        </p>
        <p className="text-gray-300 leading-relaxed mb-3">
          Não. E isso é uma boa notícia: nenhuma ferramenta conhece todas as suas
          individualidades em um minuto. O que ela encontrou foi uma estrutura
          coerente com seu objetivo e com a rotina que você descreveu hoje.
        </p>
        <p className="text-gray-300 leading-relaxed mb-3">
          O que você acabou de ver se apoia em três coisas: a prática de acompanhar
          alunos todos os dias, a evidência científica (as fontes estão logo abaixo
          da página) e o trabalho de grandes treinadores do Brasil e do mundo.
          Nenhuma delas entrega fórmula secreta — todas apontam direções.
        </p>
        <p className="text-gray-300 leading-relaxed mb-6">
          A partir daqui — exercícios, volume, intensidade, progressão e ajustes ao
          longo do caminho — é onde a individualização começa.{" "}
          <strong className="text-white">A ferramenta encontra a estrutura. A individualização começa depois.</strong>{" "}
          E essa parte é feita por alguém que perdeu mais de 40 kg antes de treinar
          qualquer pessoa — e que faz isso porque gosta de ver alguém descobrir que
          também consegue.
        </p>
        {/* Quem terminou o quiz está no ponto de maior intenção da página: a
            ação principal abre a conversa já com o contexto preenchido. A
            consultoria fica como secundária para quem quer ver como funciona
            antes de falar — tirar essa opção troca lead por abandono. */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mb-2">
          <a
            href={getWhatsAppUrl(buildRotinaWhatsApp(plan, answers, agendaFeita ? diasEscolhidos : undefined))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("routine_whatsapp_click", {
                routine_structure: plan.structureId,
                routine_has_schedule: agendaFeita,
              })
            }
            className="inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[52px]"
          >
            Quero transformar essa estrutura no meu treino →
          </a>
          <Link
            href="/consultoria"
            onClick={() => trackEvent("routine_service_click", { routine_structure: plan.structureId })}
            className="inline-flex items-center text-sm text-gray-300 underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors min-h-[44px]"
          >
            Ver como funciona o acompanhamento
          </Link>
        </div>
        {/* Dizer para onde o botão leva antes do clique: sair do site sem aviso
            é fricção, e a pessoa hesita se não sabe o que vai abrir. */}
        <p className="text-gray-400 text-xs leading-relaxed mb-4">
          Abre o WhatsApp com a sua estrutura já preenchida — é só enviar.
        </p>
        {/**
         * A bifurcação honesta. A trilha do treino atende duas pessoas: quem
         * NÃO tem treino (para essa, o caminho gratuito termina aqui — os
         * exercícios são exatamente onde o Montinho entra, e é o CTA acima) e
         * quem JÁ treina com ficha pronta. Sem esta porta, a segunda pessoa
         * clicava no passo 3 da trilha, caía na Calculadora de Volume sem
         * nada para auditar... e a primeira também, e saía frustrada. Cada
         * uma agora tem a sua saída dita com todas as letras.
         */}
        <div className="border border-white/15 p-4 mb-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-white">Já treina com uma ficha pronta?</strong>{" "}
            Então o seu próximo passo é outro: confira se o volume dela bate com
            a estrutura sugerida —{" "}
            <Link
              href="/ferramentas/calculadora-volume-treino"
              onClick={() => trackEvent("routine_volume_click", { routine_structure: plan.structureId })}
              className="text-white font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity"
              style={{ textDecorationColor: "#BA9E50" }}
            >
              analisar meu treino atual (passo 3 do caminho) →
            </Link>
          </p>
          <p className="text-gray-500 text-xs leading-relaxed mt-2">
            Ainda não tem os exercícios? Aí o caminho gratuito termina aqui
            mesmo — montar o treino certo para o seu corpo é exatamente onde o
            Montinho entra, no botão acima.
          </p>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed">
          Quer ir além da divisão? O{" "}
          <Link href="/diagnostico" onClick={() => trackEvent("routine_diagnostic_click")} className="underline underline-offset-2 hover:text-white transition-colors">
            Diagnóstico Montinho
          </Link>{" "}
          considera outros aspectos da sua situação atual. Ficou com dúvida sobre a divisão?{" "}
          <Link href="/pergunte-ao-montinho" onClick={() => trackEvent("routine_ask_click")} className="underline underline-offset-2 hover:text-white transition-colors">
            Pergunte ao Montinho
          </Link>.
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
                  onClick={() =>
                    trackEvent("routine_article_click", {
                      routine_structure: plan.structureId,
                      // qual artigo — as outras ferramentas já mandavam o slug
                      article_slug: art.slug,
                    })
                  }
                  className="text-gray-300 underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors text-sm sm:text-base"
                >
                  {art.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Levar o plano embora — o mesmo par de ações do cardápio, porque a
          jornada da dieta termina com algo na mão e a do treino terminava só
          com a tela. Copiar cobre o WhatsApp e as notas; imprimir cobre o PDF
          e o papel colado na geladeira. */}
      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-5 print:hidden">
        <button
          type="button"
          onClick={() => {
            const linhas = [
              `Minha rotina de treino — ${plan.structureName}`,
              `${plan.sessoesPorSemana}x por semana · ${plan.duracaoAlvo}`,
              agendaFeita && diasEscolhidos.length > 0
                ? `Meus dias: ${diasEscolhidos.map((i) => DIAS_SEMANA[i]).join(", ")}`
                : "",
              "",
              "Semana:",
              ...plan.semana
                .filter((d) => d.sessao)
                .map((d) => `${d.dia}: ${d.sessao}`),
              "",
              `Por que essa estrutura: ${plan.porque}`,
              plan.planoB ? `Plano B (semana apertada): ${plan.planoB.texto}` : "",
              "",
              "Montado no Treino Para Minha Rotina — montinhopersonal.com.br/treino-para-minha-rotina",
            ].filter((l) => l !== "");
            navigator.clipboard?.writeText(linhas.join("\n")).then(() => {
              setCopiado(true);
              setTimeout(() => setCopiado(false), 2500);
            });
            trackEvent("routine_plan_copied", { routine_structure: plan.structureId });
          }}
          className="px-4 py-2.5 min-h-[44px] border border-white/25 text-gray-200 text-sm hover:border-white/50 transition-colors"
        >
          {copiado ? "Copiado ✓" : "Copiar meu plano"}
        </button>
        <button
          type="button"
          onClick={() => {
            trackEvent("routine_plan_saved", { routine_structure: plan.structureId });
            window.print();
          }}
          className="px-4 py-2.5 min-h-[44px] border border-white/25 text-gray-200 text-sm hover:border-white/50 transition-colors"
        >
          Imprimir / salvar PDF
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs max-w-md leading-relaxed">
          Você não encontrou o treino perfeito. Encontrou algo mais útil: um treino
          que pode existir na sua vida real. A melhor estratégia é sempre a que você
          consegue sustentar — e ela muda quando a sua vida muda.
        </p>
        <button type="button" onClick={refazer} className="text-xs text-gray-400 hover:text-white underline underline-offset-2 transition-colors whitespace-nowrap ml-4">
          Refazer
        </button>
      </div>
    </div>
  );
}
