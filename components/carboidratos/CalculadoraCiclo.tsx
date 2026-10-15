"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import { NIVEIS, aplicaDeficit, aplicaSuperavit, calculaTDEE, calculaTMB, normalizaAltura, normalizaIdade, normalizaNumero, type Sexo } from "@/lib/calorias";
import { PONTE, consomeNumero } from "@/lib/ferramentas/ponte";
import { guardaKcalParaMacros, guardaPesoParaProteina } from "@/lib/macros";
import Compartilhar from "@/components/share/Compartilhar";
import {
  DIAS, DIAS_LONGOS, DISCLAIMER, DURACOES, EXPLICA_NIVEL, INTENSIDADES, KCAL_MAX, KCAL_MIN, NOME_DEMANDA, NOME_NIVEL,
  NOTA_BALANCO, OBJETIVOS, PESO_MAX, PESO_MIN, TIPOS,
  calculaCiclo, gPorKg, proximoNivel,
  type DiaEntrada, type Intensidade, type Nivel, type Objetivo, type Sessao, type Tipo,
} from "@/lib/carboidratos/ciclo";

/**
 * Calculadora de Ciclo de Carboidratos (Fase 1).
 *
 * Quatro passos: objetivo → energia → semana → resultado. Tudo roda no
 * navegador; o estado fica salvo neste aparelho (localStorage) e nada de
 * peso ou calorias vai para o Analytics — só categorias.
 */

const CHAVE = "montinho:ciclo:v1";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

type Etapa = "objetivo" | "energia" | "semana" | "resultado";
const ORDEM: Etapa[] = ["objetivo", "energia", "semana", "resultado"];

interface Estado {
  etapa: Etapa;
  objetivo: Objetivo | null;
  pesoTexto: string;
  sabeKcal: boolean | null;
  kcalTexto: string;
  sexo: Sexo | null;
  idadeTexto: string;
  alturaTexto: string;
  nivelId: string | null;
  semana: DiaEntrada[];
  editados: (Nivel | null)[];
}

const SEMANA_VAZIA: DiaEntrada[] = DIAS.map(() => ({ sessoes: [] }));
const INICIAL: Estado = {
  etapa: "objetivo", objetivo: null, pesoTexto: "", sabeKcal: null, kcalTexto: "", sexo: null,
  idadeTexto: "", alturaTexto: "", nivelId: null, semana: SEMANA_VAZIA, editados: DIAS.map(() => null),
};

const chip = (on: boolean) =>
  `px-4 py-2.5 text-sm border min-h-[44px] transition-colors text-left ${on ? "border-[#BA9E50] bg-[#BA9E50]/10 text-white" : "border-white/20 text-gray-300 hover:border-white/40"}`;
const campo = "w-full bg-black border border-white/25 focus:border-[#BA9E50] text-white text-lg px-4 py-3 outline-none";
const btnPrim = "bg-white text-black px-7 py-3.5 font-semibold min-h-[52px] disabled:opacity-40";
const ln = "underline underline-offset-4 decoration-1 hover:text-white";

/** Estimativa de calorias para quem não sabe: o mesmo motor da Calculadora de Déficit, sem duplicar fórmula. */
function estimaKcal(e: Estado, peso: number | null): number | null {
  const idade = normalizaIdade(e.idadeTexto);
  const altura = normalizaAltura(e.alturaTexto);
  const nivel = NIVEIS.find((n) => n.id === e.nivelId);
  if (!peso || !idade || !altura || !e.sexo || !nivel || !e.objetivo) return null;
  const tdee = calculaTDEE(calculaTMB(peso, altura, idade, e.sexo), nivel.fator);
  const faixa = e.objetivo === "emagrecer" ? aplicaDeficit(tdee, 15) : e.objetivo === "ganhar" ? aplicaSuperavit(tdee, 10) : tdee;
  return Math.round((faixa.min + faixa.max) / 2 / 10) * 10;
}

export default function CalculadoraCiclo({ placement }: { placement: string }) {
  const [e, setE] = useState<Estado>(INICIAL);
  const [carregado, setCarregado] = useState(false);
  const [veioDeFora, setVeioDeFora] = useState(false);
  const [aberto, setAberto] = useState<number | null>(0);
  const topo = useRef<HTMLDivElement>(null);
  const iniciou = useRef(false);

  /* Restaura o que estava salvo e lê a ponte de Macros/Déficit (kcal e peso). */
  useEffect(() => {
    let restaurado: Estado | null = null;
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) restaurado = { ...INICIAL, ...JSON.parse(bruto) };
    } catch { /* storage bloqueado: começa do zero */ }
    const kcal = consomeNumero(PONTE.kcal, KCAL_MIN, KCAL_MAX);
    const peso = consomeNumero(PONTE.peso, PESO_MIN, PESO_MAX);
    const base = restaurado ?? INICIAL;
    const novo: Estado = kcal !== null || peso !== null
      ? {
          ...base,
          kcalTexto: kcal !== null ? String(kcal) : base.kcalTexto,
          sabeKcal: kcal !== null ? true : base.sabeKcal,
          pesoTexto: peso !== null ? String(peso).replace(".", ",") : base.pesoTexto,
          etapa: base.etapa === "resultado" ? "semana" : base.etapa,
        }
      : base;
    /* Leitura única do armazenamento e da ponte ao montar: não há render em cascata. */
    /* eslint-disable react-hooks/set-state-in-effect */
    setE(novo);
    if (kcal !== null || peso !== null) setVeioDeFora(true);
    setCarregado(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    trackEvent("carb_cycle_view", { placement });
  }, [placement]);

  useEffect(() => {
    if (!carregado) return;
    try { localStorage.setItem(CHAVE, JSON.stringify(e)); } catch { /* ignora */ }
  }, [e, carregado]);

  const peso = normalizaNumero(e.pesoTexto);
  const pesoOk = peso !== null && peso >= PESO_MIN && peso <= PESO_MAX;
  const kcalInformada = normalizaNumero(e.kcalTexto);
  const kcalEstimada = e.sabeKcal === false ? estimaKcal(e, pesoOk ? peso : null) : null;
  const kcal = e.sabeKcal ? kcalInformada : kcalEstimada;
  const kcalOk = kcal !== null && kcal >= KCAL_MIN && kcal <= KCAL_MAX;
  const treinos = e.semana.filter((d) => d.sessoes.length > 0).length;

  const resultado = useMemo(
    () => (e.objetivo && pesoOk && kcalOk ? calculaCiclo({ kcal: kcal!, pesoKg: peso!, objetivo: e.objetivo }, e.semana, e.editados) : null),
    [e.objetivo, e.semana, e.editados, pesoOk, kcalOk, kcal, peso]
  );

  function vai(etapa: Etapa) {
    setE((a) => ({ ...a, etapa }));
    topo.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function inicia() {
    if (!iniciou.current) { iniciou.current = true; trackEvent("carb_cycle_start", { placement }); }
  }
  function mudaDia(i: number, sessoes: Sessao[]) {
    setE((a) => ({ ...a, semana: a.semana.map((d, j) => (j === i ? { sessoes } : d)), editados: a.editados.map((x, j) => (j === i ? null : x)) }));
  }

  const passo = ORDEM.indexOf(e.etapa) + 1;

  return (
    <div ref={topo} className="border border-white/15 p-5 sm:p-8 scroll-mt-24" data-testid="calculadora-ciclo">
      {e.etapa !== "resultado" && (
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">{passo} de 3</p>
          <div className="h-1 bg-white/10"><div className="h-1" style={{ width: `${(passo / 3) * 100}%`, background: "#BA9E50" }} /></div>
        </div>
      )}

      {/* ── 1. Objetivo ── */}
      {e.etapa === "objetivo" && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-2" style={h}>Qual é o seu objetivo agora?</h2>
          <p className="text-gray-400 text-sm mb-5">O objetivo define as calorias. Quem decide onde o carboidrato fica é o seu treino, no passo 3.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {OBJETIVOS.map((o) => (
              <button key={o.id} type="button" aria-pressed={e.objetivo === o.id} className={chip(e.objetivo === o.id)}
                onClick={() => { inicia(); setE((a) => ({ ...a, objetivo: o.id })); trackEvent("carb_cycle_goal_selected", { placement, goal: o.id }); }}>
                {o.rotulo}
              </button>
            ))}
          </div>
          <button type="button" disabled={!e.objetivo} onClick={() => vai("energia")} className={`${btnPrim} mt-6`}>Continuar →</button>
        </div>
      )}

      {/* ── 2. Energia ── */}
      {e.etapa === "energia" && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-2" style={h}>Seu peso e suas calorias</h2>
          {veioDeFora && <p className="text-sm mb-4" style={{ color: "#BA9E50" }}>Trouxemos os números da calculadora anterior. Pode editar.</p>}
          <label htmlFor={`${placement}-peso`} className="block text-gray-300 text-sm font-medium mb-2">Peso (kg)</label>
          <input id={`${placement}-peso`} inputMode="decimal" autoComplete="off" placeholder="75" value={e.pesoTexto}
            onChange={(ev) => setE((a) => ({ ...a, pesoTexto: ev.target.value }))} className={`${campo} max-w-[10rem]`} />
          {e.pesoTexto && !pesoOk && <p className="text-gray-400 text-sm mt-1">Use um peso entre {PESO_MIN} e {PESO_MAX} kg.</p>}

          <fieldset className="mt-6">
            <legend className="text-gray-300 text-sm font-medium mb-2">Você já sabe quantas calorias come (ou quer comer) por dia?</legend>
            <div className="flex gap-2">
              {([[true, "Sim"], [false, "Não sei"]] as const).map(([v, r]) => (
                <button key={r} type="button" aria-pressed={e.sabeKcal === v} className={`${chip(e.sabeKcal === v)} min-w-[96px] text-center`}
                  onClick={() => { setE((a) => ({ ...a, sabeKcal: v })); trackEvent("carb_cycle_energy_source_selected", { placement, source: v ? "informada" : "estimada" }); }}>
                  {r}
                </button>
              ))}
            </div>
          </fieldset>

          {e.sabeKcal === true && (
            <div className="mt-4">
              <label htmlFor={`${placement}-kcal`} className="block text-gray-300 text-sm font-medium mb-2">Calorias por dia (média)</label>
              <input id={`${placement}-kcal`} inputMode="numeric" autoComplete="off" placeholder="2000" value={e.kcalTexto}
                onChange={(ev) => setE((a) => ({ ...a, kcalTexto: ev.target.value }))} className={`${campo} max-w-[10rem]`} />
              {e.kcalTexto && !kcalOk && <p className="text-gray-400 text-sm mt-1">Use um valor entre {KCAL_MIN} e {KCAL_MAX} kcal.</p>}
            </div>
          )}

          {e.sabeKcal === false && (
            <div className="mt-4 space-y-4">
              <p className="text-gray-400 text-sm">Estimamos com a mesma conta da <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>Calculadora de Déficit</Link>.</p>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                <div>
                  <label htmlFor={`${placement}-idade`} className="block text-gray-300 text-sm mb-1.5">Idade</label>
                  <input id={`${placement}-idade`} inputMode="numeric" placeholder="35" value={e.idadeTexto} onChange={(ev) => setE((a) => ({ ...a, idadeTexto: ev.target.value }))} className={campo} />
                </div>
                <div>
                  <label htmlFor={`${placement}-altura`} className="block text-gray-300 text-sm mb-1.5">Altura (cm)</label>
                  <input id={`${placement}-altura`} inputMode="numeric" placeholder="170" value={e.alturaTexto} onChange={(ev) => setE((a) => ({ ...a, alturaTexto: ev.target.value }))} className={campo} />
                </div>
              </div>
              <fieldset>
                <legend className="text-gray-300 text-sm mb-1.5">Sexo usado pela equação</legend>
                <div className="flex flex-wrap gap-2">
                  {([["feminino", "Feminino"], ["masculino", "Masculino"], ["nao_informado", "Prefiro não informar"]] as const).map(([v, r]) => (
                    <button key={v} type="button" aria-pressed={e.sexo === v} className={chip(e.sexo === v)} onClick={() => setE((a) => ({ ...a, sexo: v }))}>{r}</button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-gray-300 text-sm mb-1.5">Nível de atividade na semana</legend>
                <div className="grid gap-2">
                  {NIVEIS.map((n) => (
                    <button key={n.id} type="button" aria-pressed={e.nivelId === n.id} className={chip(e.nivelId === n.id)} onClick={() => setE((a) => ({ ...a, nivelId: n.id }))}>
                      <span className="block text-white font-medium">{n.titulo}</span>
                      <span className="block text-gray-400 text-xs mt-0.5">{n.descricao}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              {kcalEstimada !== null && (
                <p className="text-white">
                  Estimativa: <strong>≈ {kcalEstimada.toLocaleString("pt-BR")} kcal/dia</strong>
                  <span className="text-gray-400 text-sm">{e.objetivo === "emagrecer" ? " (gasto com déficit moderado de 15%)" : e.objetivo === "ganhar" ? " (gasto com superávit de 10%)" : " (gasto estimado)"}</span>
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-6">
            <button type="button" onClick={() => vai("objetivo")} className="border border-white/25 text-white px-6 py-3.5 min-h-[52px]">← Voltar</button>
            <button type="button" disabled={!pesoOk || !kcalOk} onClick={() => { vai("semana"); trackEvent("carb_cycle_week_started", { placement }); }} className={btnPrim}>Montar minha semana →</button>
          </div>
        </div>
      )}

      {/* ── 3. Semana ── */}
      {e.etapa === "semana" && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-2" style={h}>O que você faz em cada dia?</h2>
          <p className="text-gray-400 text-sm mb-5">Toque no dia e adicione o treino. Dia sem treino conta como descanso. Pode pôr dois treinos no mesmo dia.</p>
          <ol className="space-y-2">
            {e.semana.map((d, i) => (
              <li key={DIAS[i]} className="border border-white/15">
                <button type="button" aria-expanded={aberto === i} onClick={() => setAberto(aberto === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 min-h-[52px] text-left">
                  <span className="text-white font-semibold">{DIAS_LONGOS[i]}</span>
                  <span className="text-gray-400 text-sm text-right">
                    {d.sessoes.length === 0 ? "Descanso" : d.sessoes.map((s) => `${TIPOS.find((t) => t.id === s.tipo)!.rotulo.split(" (")[0]} ${s.minutos} min`).join(" + ")}
                  </span>
                </button>
                {aberto === i && (
                  <div className="px-4 pb-4 space-y-4">
                    {d.sessoes.map((s, k) => (
                      <EditorSessao key={k} sessao={s}
                        onMuda={(nova) => mudaDia(i, d.sessoes.map((x, j) => (j === k ? nova : x)))}
                        onRemove={() => mudaDia(i, d.sessoes.filter((_, j) => j !== k))} />
                    ))}
                    {d.sessoes.length < 3 && (
                      <button type="button" className="text-sm text-white underline underline-offset-4 decoration-1 min-h-[44px]" style={{ textDecorationColor: "#BA9E50" }}
                        onClick={() => { mudaDia(i, [...d.sessoes, { tipo: "musculacao", minutos: 60, intensidade: "moderado" }]); trackEvent("carb_cycle_training_day_added", { placement }); }}>
                        + {d.sessoes.length === 0 ? "Adicionar treino" : "Adicionar outro treino neste dia"}
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-3 mt-6">
            <button type="button" onClick={() => vai("energia")} className="border border-white/25 text-white px-6 py-3.5 min-h-[52px]">← Voltar</button>
            <button type="button" disabled={!resultado}
              onClick={() => { vai("resultado"); trackEvent("carb_cycle_generated", { placement, treinos_semana: treinos }); }} className={btnPrim}>
              Ver meu ciclo →
            </button>
          </div>
          {treinos === 0 && <p className="text-gray-500 text-xs mt-2">Sem nenhum treino na semana, o ciclo fica plano: não há dia que peça mais combustível.</p>}
        </div>
      )}

      {/* ── 4. Resultado ── */}
      {e.etapa === "resultado" && resultado && peso && (
        <div aria-live="polite">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={h}>Seu ciclo de carboidratos</h2>
          <p className="text-gray-400 text-sm mb-5">Toque no nível de um dia para mudar entre baixo, médio e alto. A média da semana se mantém.</p>

          {resultado.impossivel ? (
            <p className="text-gray-200">{resultado.avisos[0]}</p>
          ) : (
            <>
              {resultado.homogenea && !resultado.semCiclo && (
                <p className="border-l-2 border-[#BA9E50] pl-3 text-gray-200 text-sm mb-5">
                  Sua semana tem treinos parecidos, então a demanda quase não muda de um dia para o outro. Nesse caso, ciclar faz pouca diferença:
                  o carboidrato ficou igual todos os dias. Se quiser concentrar mais em algum dia, toque no nível dele.
                </p>
              )}
              <ol className="space-y-2">
                {resultado.dias.map((d, i) => (
                  <li key={DIAS[i]} className="border border-white/15 p-4" data-testid="dia-ciclo">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white font-semibold">{DIAS_LONGOS[i]}</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {e.semana[i].sessoes.length === 0 ? "Descanso" : e.semana[i].sessoes.map((s) => TIPOS.find((t) => t.id === s.tipo)!.rotulo.split(" (")[0]).join(" + ")} · demanda {NOME_DEMANDA[d.demanda].toLowerCase()}
                        </p>
                      </div>
                      <button type="button" disabled={resultado.semCiclo}
                        aria-label={`${DIAS_LONGOS[i]}: nível ${NOME_NIVEL[d.nivel].toLowerCase()}. Tocar para mudar.`}
                        onClick={() => {
                          setE((a) => ({ ...a, editados: a.editados.map((x, j) => (j === i ? proximoNivel(d.nivel) : x)) }));
                          trackEvent("carb_cycle_day_edited", { placement, nivel: proximoNivel(d.nivel) });
                        }}
                        className={`shrink-0 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase border min-h-[40px] ${d.nivel === "alto" ? "border-[#BA9E50] text-[#BA9E50]" : d.nivel === "medio" ? "border-white/50 text-white" : "border-white/20 text-gray-300"}`}>
                        {NOME_NIVEL[d.nivel]}
                      </button>
                    </div>
                    <p className="text-white text-2xl font-bold mt-2" style={h}>
                      {d.carb} g <span className="text-sm font-normal text-gray-400">de carboidrato · {gPorKg(d.carb, peso).toLocaleString("pt-BR")} g/kg · faixa {d.carbFaixa[0]}–{d.carbFaixa[1]} g</span>
                    </p>
                    <p className="text-gray-400 text-sm mt-1">{d.prot} g proteína · {d.gord} g gordura · ≈ {d.kcal.toLocaleString("pt-BR")} kcal</p>
                  </li>
                ))}
              </ol>

              <div className="border border-[#BA9E50]/50 bg-[#BA9E50]/[0.06] p-5 mt-5">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#BA9E50" }}>Média da semana</p>
                <p className="text-white">
                  <strong>{resultado.media.carb} g</strong> de carboidrato/dia ({gPorKg(resultado.media.carb, peso).toLocaleString("pt-BR")} g/kg) · {resultado.media.prot} g proteína · {resultado.media.gord} g gordura · ≈ {resultado.media.kcal.toLocaleString("pt-BR")} kcal/dia
                </p>
                <p className="text-gray-400 text-sm mt-1">Na semana: {resultado.totalSemana.carb.toLocaleString("pt-BR")} g de carboidrato e ≈ {resultado.totalSemana.kcal.toLocaleString("pt-BR")} kcal.</p>
              </div>

              <ul className="text-gray-300 text-sm leading-relaxed mt-4 space-y-1.5 list-disc pl-5">
                {!resultado.semCiclo && !resultado.homogenea && <li>Seus dias de maior demanda receberam mais carboidrato; os de descanso, menos.</li>}
                <li>{NOTA_BALANCO}</li>
                {resultado.limitado && <li>Algum limite de segurança segurou a diferença entre os dias (gordura entre 20% e 35% das calorias, dia baixo a partir de 130 g e dia alto até 1,6 vez o baixo).</li>}
                {resultado.avisos.map((a) => <li key={a}>{a}</li>)}
              </ul>

              <details className="mt-4 text-sm">
                <summary className="text-white cursor-pointer min-h-[44px] flex items-center">O que é dia alto, médio e baixo?</summary>
                <dl className="text-gray-300 space-y-2 mt-2">
                  {(["alto", "medio", "baixo"] as Nivel[]).map((n) => (
                    <div key={n}><dt className="text-white inline">{NOME_NIVEL[n]}: </dt><dd className="inline">{EXPLICA_NIVEL[n]}</dd></div>
                  ))}
                </dl>
              </details>

              {/* Próximo passo: comida primeiro. */}
              <div className="border border-white/15 p-5 mt-6">
                <p className="text-white font-semibold mb-1">Quer transformar isso em refeições?</p>
                <p className="text-gray-400 text-sm mb-3">O Monte seu Cardápio monta o dia com os alimentos que você escolher, nas mesmas calorias (≈ {resultado.media.kcal.toLocaleString("pt-BR")} kcal).</p>
                <Link href="/ferramentas/monte-seu-cardapio"
                  onClick={() => { guardaKcalParaMacros(resultado.media.kcal); guardaPesoParaProteina(peso); trackEvent("carb_cycle_fitchef_clicked", { placement }); }}
                  className="inline-flex items-center bg-white text-black px-6 py-3 font-semibold min-h-[48px]">
                  Montar minhas refeições →
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-5">
                <Compartilhar contexto="tool-result" titulo="Calculadora de Ciclo de Carboidratos" caminho="/ferramentas/ciclo-de-carboidratos" local="tool_result" ferramenta="ciclo-carboidratos" aparencia="solido" />
                <Link href="/blog/ciclo-de-carboidratos-carb-cycling" onClick={() => trackEvent("carb_cycle_article_clicked", { placement })} className={`text-gray-300 text-sm ${ln}`} style={{ textDecorationColor: "#BA9E50" }}>
                  Entenda a ciência do carb cycling →
                </Link>
              </div>

              <div className="border-t border-white/10 mt-8 pt-6">
                <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
                {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white text-sm leading-relaxed mb-3">{t}</p>)}
                <a href={getWhatsAppUrl("Oi Montinho! Montei meu ciclo de carboidratos no site e queria ajuda para ajustar com o meu treino.")} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackEvent("carb_cycle_whatsapp_clicked", { placement })}
                  className="inline-flex items-center border border-white/30 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60">
                  Quero ajuda para ajustar com o meu treino
                </a>
              </div>
            </>
          )}

          <p className="text-gray-500 text-xs mt-6">{DISCLAIMER}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
            <button type="button" onClick={() => vai("semana")} className={`${ln} min-h-[44px]`}>Editar minha semana</button>
            <button type="button" onClick={() => setE((a) => ({ ...a, editados: DIAS.map(() => null) }))} className={`${ln} min-h-[44px]`}>Voltar à sugestão automática</button>
            <button type="button" onClick={() => { setE(INICIAL); try { localStorage.removeItem(CHAVE); } catch { /* ignora */ } }} className={`${ln} min-h-[44px]`}>Apagar e recomeçar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function EditorSessao({ sessao, onMuda, onRemove }: { sessao: Sessao; onMuda: (s: Sessao) => void; onRemove: () => void }) {
  return (
    <div className="border-l-2 border-white/15 pl-3 space-y-3">
      <div>
        <p className="text-gray-300 text-xs mb-1.5">Tipo</p>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button key={t.id} type="button" aria-pressed={sessao.tipo === t.id} className={chip(sessao.tipo === t.id)} onClick={() => onMuda({ ...sessao, tipo: t.id as Tipo })}>
              {t.rotulo}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-gray-300 text-xs mb-1.5">Duração</p>
        <div className="flex flex-wrap gap-2">
          {DURACOES.map((m) => (
            <button key={m} type="button" aria-pressed={sessao.minutos === m} className={chip(sessao.minutos === m)} onClick={() => onMuda({ ...sessao, minutos: m })}>
              {m === 120 ? "2 h ou mais" : `${m} min`}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-gray-300 text-xs mb-1.5">Como é esse treino?</p>
        <div className="flex flex-wrap gap-2">
          {INTENSIDADES.map((n) => (
            <button key={n.id} type="button" aria-pressed={sessao.intensidade === n.id} className={chip(sessao.intensidade === n.id)} onClick={() => onMuda({ ...sessao, intensidade: n.id as Intensidade })}>
              {n.rotulo}
            </button>
          ))}
        </div>
      </div>
      <button type="button" onClick={onRemove} className="text-gray-400 text-xs underline underline-offset-2 min-h-[40px]">Remover este treino</button>
    </div>
  );
}
