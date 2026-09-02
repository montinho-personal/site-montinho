"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import PosResultado from "@/components/ferramentas/PosResultado";
import { recomendar, resumoRespostas, type Respostas } from "@/lib/academias/motor";
import { regioesComAcademia } from "@/lib/academias/base";
import { ESTILO_LABEL, PRECO_LABEL, REGIAO_LABEL, type Estilo } from "@/lib/academias/tipos";
import { ancoraNoTopo } from "@/lib/ferramentas/ancora";

/**
 * Quiz da Academia Ideal.
 *
 * Motor local e determinístico — nenhuma chamada de rede, nenhum cadastro,
 * nenhum dado pessoal. Não pedimos endereço: região aproximada resolve, e é o
 * mínimo necessário para a recomendação fazer sentido.
 */

type Etapa = "intro" | number | "resultado";

interface Op { v: string; r: string }
interface P { id: keyof Respostas; t: string; sub?: string; ops: Op[]; multi?: boolean }

const PERGUNTAS: P[] = [
  { id: "objetivo", t: "O que mais importa no seu treino hoje?", ops: [
    { v: "massa", r: "Ganhar massa muscular" }, { v: "emagrecer", r: "Emagrecer" },
    { v: "forca", r: "Ganhar força" }, { v: "saude", r: "Saúde e qualidade de vida" },
    { v: "condicionamento", r: "Condicionamento" }, { v: "aulas", r: "Aulas e atividades" },
    { v: "comecando", r: "Ainda estou começando" } ] },
  { id: "conveniencia", t: "Onde seria mais conveniente treinar?", ops: [
    { v: "casa", r: "Perto de casa" }, { v: "trabalho", r: "Perto do trabalho" },
    { v: "caminho", r: "No caminho entre os dois" }, { v: "indiferente", r: "Localização não é prioridade" } ] },
  { id: "regiao", t: "Em qual região você passa mais tempo?", sub: "Só a região — não precisamos do seu endereço.",
    ops: [...regioesComAcademia().map((v) => ({ v, r: REGIAO_LABEL[v] })), { v: "indiferente", r: "Tanto faz" }] },
  { id: "horario", t: "Em que horário você costuma treinar?", ops: [
    { v: "muito_cedo", r: "Muito cedo (antes das 6h)" }, { v: "manha", r: "De manhã" },
    { v: "almoco", r: "No almoço" }, { v: "tarde", r: "À tarde" }, { v: "noite", r: "À noite" },
    { v: "pos_22h", r: "Depois das 22h" }, { v: "variavel", r: "Varia bastante" } ] },
  { id: "fimDeSemana", t: "Você precisa treinar no fim de semana?", ops: [
    { v: "sabado", r: "Sábado" }, { v: "domingo", r: "Domingo" },
    { v: "ambos", r: "Os dois" }, { v: "nao", r: "Não preciso" } ] },
  { id: "estilos", t: "O que você mais procura numa academia?", sub: "Escolha até três.", multi: true,
    ops: Object.entries(ESTILO_LABEL).map(([v, r]) => ({ v, r })) },
  { id: "vinteQuatro", t: "Academia 24 horas é importante?", ops: [
    { v: "essencial", r: "Essencial" }, { v: "preferivel", r: "Seria bom" }, { v: "indiferente", r: "Não preciso" } ] },
  { id: "estacionamento", t: "Estacionamento é importante?", ops: [
    { v: "essencial", r: "Essencial" }, { v: "preferivel", r: "Preferível" }, { v: "indiferente", r: "Não importa" } ] },
  { id: "preco", t: "Qual faixa de investimento faz sentido para você?",
    ops: [...(Object.entries(PRECO_LABEL).map(([v, r]) => ({ v, r }))), { v: "indiferente", r: "Preço não é prioridade" }] },
  { id: "beneficio", t: "Você usa algum benefício da empresa?", ops: [
    { v: "wellhub", r: "Wellhub" }, { v: "totalpass", r: "TotalPass" },
    { v: "outro", r: "Outro" }, { v: "nenhum", r: "Não uso" } ] },
];

const btn = "text-left border px-5 py-4 min-h-[52px] transition-colors text-base";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

export default function AcademiaQuiz() {
  const [etapa, setEtapa] = useState<Etapa>("intro");
  /**
   * Reancora a cada troca de etapa. Sem isso, "refazer" — clicado no fim de
   * uma tela longa de resultado — encolhe o quiz e deixa a pessoa parada no
   * conteúdo que vem depois dele.
   */
  const raiz = useRef<HTMLDivElement>(null);
  /* O denominador do quiz: sem ele, "12 pessoas concluíram" não vira taxa. */
  useEffect(() => {
    trackOncePerSession("gym_finder_view");
  }, []);
  const primeiraAncora = useRef(true);
  useEffect(() => {
    if (primeiraAncora.current) {
      primeiraAncora.current = false;
      return;
    }
    ancoraNoTopo(raiz.current);
  }, [etapa]);
  const [resp, setResp] = useState<Partial<Respostas>>({ estilos: [], personal: "nao" });

  const responder = (i: number, v: string) => {
    const p = PERGUNTAS[i];
    if (p.multi) {
      const atual = (resp.estilos ?? []) as Estilo[];
      const novo = atual.includes(v as Estilo)
        ? atual.filter((x) => x !== v)
        : atual.length >= 3 ? atual : [...atual, v as Estilo];
      setResp({ ...resp, estilos: novo });
      return;
    }
    setResp({ ...resp, [p.id]: v });
    if (i === 0) trackOncePerSession("gym_finder_start");
    avancar(i);
  };

  const avancar = (i: number) => {
    if (i + 1 < PERGUNTAS.length) return setEtapa(i + 1);
    const completas = resp as Respostas;
    trackEvent("gym_finder_complete", {
      gym_goal: completas.objetivo,
      gym_region: completas.regiao,
      gym_time: completas.horario,
      gym_24h: completas.vinteQuatro,
      gym_parking: completas.estacionamento,
    });
    setEtapa("resultado");
  };

  if (etapa === "intro") {
    return (
      <div ref={raiz} className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-7 sm:p-10 relative scroll-mt-24">
        <div className="absolute top-0 left-0 h-[2px] w-24" style={{ background: "#BA9E50" }} aria-hidden="true" />
        <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-4" style={h}>
          Não procure a melhor academia de Alphaville. Procure a melhor para a sua rotina.
        </h2>
        <p className="text-gray-300 leading-relaxed mb-3 max-w-2xl">
          Responda {PERGUNTAS.length} perguntas sobre seu treino, seu horário e o que
          você procura. Em menos de um minuto você vê as opções que mais combinam
          com o que você disse — e o porquê de cada uma.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Sem cadastro. Não pedimos seu endereço nem sua localização.
        </p>
        <button type="button" onClick={() => setEtapa(0)}
          className="bg-white text-black px-8 py-4 text-base font-semibold hover:bg-gray-100 transition-colors min-h-[56px]">
          Encontrar minha academia →
        </button>
      </div>
    );
  }

  if (typeof etapa === "number") {
    const p = PERGUNTAS[etapa];
    const prog = ((etapa + 1) / PERGUNTAS.length) * 100;
    const sel = resp[p.id];
    return (
      <div ref={raiz} className="border border-white/15 bg-white/[0.03] p-6 sm:p-9 scroll-mt-24">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400">{etapa + 1} de {PERGUNTAS.length}</p>
          {etapa > 0 && (
            <button type="button" onClick={() => setEtapa(etapa - 1)}
              className="text-xs text-gray-400 hover:text-white underline underline-offset-2">← voltar</button>
          )}
        </div>
        <div className="h-1 bg-white/10 mb-7" role="progressbar" aria-valuenow={Math.round(prog)}
          aria-valuemin={0} aria-valuemax={100} aria-label="Progresso">
          <div className="h-full transition-all duration-300" style={{ width: `${prog}%`, background: "#BA9E50" }} />
        </div>
        <h3 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-2" style={h}>{p.t}</h3>
        {p.sub && <p className="text-gray-400 text-sm mb-5">{p.sub}</p>}
        <div className="grid gap-3 mt-5">
          {p.ops.map((o) => {
            const ativo = p.multi
              ? ((resp.estilos ?? []) as string[]).includes(o.v)
              : sel === o.v;
            return (
              <button key={o.v} type="button" onClick={() => responder(etapa, o.v)}
                aria-pressed={p.multi ? ativo : undefined}
                className={`${btn} ${ativo ? "border-[#BA9E50] text-white bg-white/[0.06]" : "border-white/20 text-gray-300 hover:border-white/50 hover:text-white"}`}>
                {o.r}
              </button>
            );
          })}
        </div>
        {p.multi && (
          <button type="button" onClick={() => avancar(etapa)}
            className="mt-6 bg-white text-black px-7 py-3.5 text-sm font-semibold hover:bg-gray-100 transition-colors min-h-[52px]">
            Continuar →
          </button>
        )}
      </div>
    );
  }

  // ── Resultado ─────────────────────────────────────────────────────────────
  const respostas = resp as Respostas;
  const rec = recomendar(respostas);
  const rotulos = ["Melhor encaixe com suas prioridades", "Outra boa opção", "Vale considerar se..."];

  return (
    <div ref={raiz} className="space-y-6 scroll-mt-24">
      <div className="border border-white/15 bg-white/[0.03] p-6 sm:p-8">
        <p className="text-white font-semibold mb-3">Você disse que:</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
          {resumoRespostas(respostas).map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>

      {rec.semCombinacaoPerfeita && (
        <div className="border-l-2 pl-5 py-1" style={{ borderColor: "#BA9E50" }}>
          <p className="text-white font-semibold mb-1">Não encontramos uma opção que atenda tudo</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Nenhuma unidade da base atende todos os critérios que você marcou como
            essenciais. Abaixo estão as mais próximas — com o que bate e o que não bate.
          </p>
        </div>
      )}

      {rec.empateTecnico && (
        <p className="text-gray-400 text-sm">
          As duas primeiras ficaram muito próximas: elas atendem o mesmo número de
          critérios. A escolha entre elas vale ser feita visitando as duas.
        </p>
      )}

      {rec.top.map((r, i) => (
        <div key={r.academia.id} className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative">
          <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "#BA9E50" }}>
            {rotulos[i]}
          </p>
          <h3 className="text-white font-bold text-2xl leading-tight mb-1" style={h}>{r.academia.nome}</h3>
          <p className="text-gray-400 text-sm mb-4">
            {REGIAO_LABEL[r.academia.regiao]} · {r.atendidos} de {r.aplicaveis} critérios atendidos
          </p>

          <p className="text-white text-sm font-semibold mb-2">Por que apareceu para você</p>
          <ul className="space-y-1.5 mb-4">
            {r.criterios.map((c) => (
              <li key={c.rotulo} className="text-sm flex gap-2">
                <span aria-hidden="true" className={c.atende === true ? "text-green-400" : c.atende === false ? "text-gray-600" : "text-gray-500"}>
                  {c.atende === true ? "✓" : c.atende === false ? "✕" : "?"}
                </span>
                <span className={c.atende === true ? "text-gray-200" : "text-gray-400"}>
                  {c.rotulo}
                  {c.atende === null && <span className="text-gray-500"> — não confirmado</span>}
                </span>
              </li>
            ))}
          </ul>

          {r.ressalvas.length > 0 && (
            <div className="border-l-2 border-white/20 pl-4 mb-4">
              <p className="text-gray-400 text-xs leading-relaxed">
                {r.ressalvas.slice(0, 3).join(" ")}
              </p>
            </div>
          )}

          {r.academia.visaoMontinho && (
            <div className="border-l-2 pl-4 mb-4" style={{ borderColor: "#BA9E50" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#BA9E50" }}>
                Visão do Montinho
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">{r.academia.visaoMontinho}</p>
            </div>
          )}

          {r.academia.artigoSlug && (
            <Link href={`/blog/${r.academia.artigoSlug}`}
              onClick={() => trackEvent("gym_result_click", { gym_id: r.academia.id })}
              className="text-sm text-gray-300 underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors">
              Ler a análise completa dessa unidade →
            </Link>
          )}
        </div>
      ))}

      <div className="border-l-2 pl-5 py-1" style={{ borderColor: "#BA9E50" }}>
        <p className="text-white font-semibold mb-1">Antes de fechar um plano</p>
        <p className="text-gray-300 text-sm leading-relaxed">
          Faça uma aula experimental e visite <strong className="text-white">no horário em que você
          realmente pretende treinar</strong>. Uma academia às 14h pode ser outra
          completamente diferente às 19h — e é nesse horário que você vai viver.
        </p>
      </div>

      <PosResultado
        ferramenta="academia"
        resumo={rec.top.length ? `a academia sugerida foi ${rec.top[0].academia.nome}` : null}
        placement="academia-ideal"
      />

      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs max-w-md leading-relaxed">
          A ferramenta não elege a melhor academia: ela compara o que você disse
          com o que conseguimos verificar sobre cada unidade.
        </p>
        <button type="button" onClick={() => { setResp({ estilos: [], personal: "nao" }); setEtapa(0); }}
          className="text-xs text-gray-400 hover:text-white underline underline-offset-2 whitespace-nowrap ml-4">
          Refazer
        </button>
      </div>
    </div>
  );
}
