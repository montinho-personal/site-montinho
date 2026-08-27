"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { PONTE, guarda } from "@/lib/ferramentas/ponte";
import { DIAS, MUSCULOS, nomeMusculo, type Dia, type MusculoId } from "@/lib/treino/musculos";
import { EXERCICIO_POR_ID, buscaExercicios } from "@/lib/treino/exercicios";
import {
  FONTES,
  NOTA_EQUIVALENTES,
  NOTA_FREQUENCIA,
  NOTA_SERIES_CONTABILIZADAS,
  NOTA_TECNICAS,
  NOTA_UNILATERAL,
  NOTA_VOLUME_NAO_E_TUDO,
  TEXTO_CONCENTRACAO,
  type DiaTreino,
  type ItemTreino,
  type VolumeMusculo,
  calculaVolume,
  classificaVolume,
  equivalentes,
  estaConcentrado,
  itemDeExercicio,
  mediaPorSessao,
  resumo,
} from "@/lib/treino/volume";

/**
 * Calculadora de volume de treino.
 *
 * O diferencial não é somar séries — é a pessoa não precisar saber quantas
 * séries de peitoral faz. Ela copia o treino real, a ferramenta descobre.
 *
 * Por isso o modo completo é o principal e o rápido é o atalho: quem já
 * sabe os próprios números digita direto, mas quem só tem a ficha do
 * professor consegue a resposta mesmo assim.
 *
 * O treino fica no aparelho (localStorage) porque uma ferramenta assim é
 * usada mais de uma vez — perder a ficha montada a cada visita mataria o
 * uso recorrente. Nada é enviado a lugar nenhum, e há um botão para apagar.
 */

const h = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;
const CHAVE = "montinho:volume:treino:v1";

let contador = 0;
const uid = () => `i${Date.now().toString(36)}${(contador++).toString(36)}`;

type Modo = "completo" | "rapido";

export default function CalculadoraVolume({ placement }: { placement: string }) {
  const [modo, setModo] = useState<Modo>("completo");
  const [dias, setDias] = useState<DiaTreino[]>([]);
  const [rapido, setRapido] = useState<Record<string, string>>({});
  const [comSecundarios, setComSecundarios] = useState(false);
  const [aberto, setAberto] = useState<MusculoId | null>(null);
  const [metodoAberto, setMetodoAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [confirmandoLimpar, setConfirmandoLimpar] = useState(false);
  const [carregado, setCarregado] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaComecou = useRef(false);
  const jaCompletou = useRef(false);

  /* Restaura o treino salvo neste aparelho. */
  useEffect(() => {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) {
        const dados = JSON.parse(bruto);
        if (Array.isArray(dados?.dias)) setDias(dados.dias);
        if (dados?.rapido && typeof dados.rapido === "object") setRapido(dados.rapido);
        if (dados?.modo === "rapido" || dados?.modo === "completo") setModo(dados.modo);
      }
    } catch {
      /* storage bloqueado ou dado corrompido: começa vazio, sem quebrar. */
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify({ dias, rapido, modo }));
    } catch {
      /* sem storage, a ferramenta segue funcionando na sessão. */
    }
  }, [dias, rapido, modo, carregado]);

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("training_volume_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  /* ── Volume ───────────────────────────────────────────────────────── */
  const volumes = useMemo(() => {
    if (modo === "completo") return calculaVolume(dias);
    /* No modo rápido montamos um "treino" sintético de um dia só, para o
       resto da tela usar exatamente o mesmo cálculo. */
    const itens: ItemTreino[] = Object.entries(rapido)
      .map(([m, txt]) => ({ m: m as MusculoId, n: Number(txt) }))
      .filter((x) => Number.isFinite(x.n) && x.n > 0)
      .map((x) => ({
        uid: `r-${x.m}`,
        exercicioId: null,
        nome: nomeMusculo(x.m),
        series: x.n,
        tipo: "trabalho" as const,
        primarios: [x.m],
        secundarios: [],
        unilateral: false,
      }));
    return calculaVolume(itens.length ? [{ uid: "rapido", dia: "Seg", nome: "Semana", itens }] : []);
  }, [modo, dias, rapido]);

  const diasEfetivos = modo === "completo" ? dias : [];
  const r = useMemo(() => resumo(diasEfetivos, volumes), [diasEfetivos, volumes]);
  const temResultado = volumes.some((v) => v.diretas > 0);

  useEffect(() => {
    if (temResultado && !jaCompletou.current) {
      jaCompletou.current = true;
      trackEvent("training_volume_complete", { placement });
    }
  }, [temResultado, placement]);

  const marcaInicio = () => {
    if (!jaComecou.current) {
      jaComecou.current = true;
      trackEvent("training_volume_start", { placement });
    }
  };

  /* ── Edição de dias ───────────────────────────────────────────────── */
  function addDia(dia: Dia) {
    marcaInicio();
    setDias((d) => [...d, { uid: uid(), dia, nome: "", itens: [] }]);
  }
  function removeDia(u: string) {
    setDias((d) => d.filter((x) => x.uid !== u));
  }
  function duplicaDia(u: string) {
    setDias((d) => {
      const orig = d.find((x) => x.uid === u);
      if (!orig) return d;
      const copia: DiaTreino = {
        uid: uid(),
        dia: orig.dia,
        nome: orig.nome ? `${orig.nome} (cópia)` : "",
        itens: orig.itens.map((i) => ({ ...i, uid: uid() })),
      };
      const i = d.findIndex((x) => x.uid === u);
      return [...d.slice(0, i + 1), copia, ...d.slice(i + 1)];
    });
  }
  function mudaDia(u: string, patch: Partial<DiaTreino>) {
    setDias((d) => d.map((x) => (x.uid === u ? { ...x, ...patch } : x)));
  }
  function addItem(diaUid: string, item: ItemTreino) {
    marcaInicio();
    trackEvent("training_volume_exercise_add", { placement });
    setDias((d) => d.map((x) => (x.uid === diaUid ? { ...x, itens: [...x.itens, item] } : x)));
  }
  function mudaItem(diaUid: string, itemUid: string, patch: Partial<ItemTreino>) {
    setDias((d) =>
      d.map((x) =>
        x.uid === diaUid ? { ...x, itens: x.itens.map((i) => (i.uid === itemUid ? { ...i, ...patch } : i)) } : x
      )
    );
  }
  function removeItem(diaUid: string, itemUid: string) {
    setDias((d) => d.map((x) => (x.uid === diaUid ? { ...x, itens: x.itens.filter((i) => i.uid !== itemUid) } : x)));
  }
  function limpaTudo() {
    setDias([]);
    setRapido({});
    setConfirmandoLimpar(false);
  }

  function copiaResumo() {
    const linhas = [
      "Meu volume semanal",
      "",
      ...volumes.filter((v) => v.diretas > 0).map((v) => `${nomeMusculo(v.musculo)}: ${fmt(v.diretas)} séries`),
      "",
      "Calculado no Montinho Personal.",
    ].join("\n");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(linhas).then(
        () => {
          trackEvent("training_volume_share", { placement });
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2000);
        },
        () => {}
      );
    }
  }

  const chip = (ativo: boolean) =>
    `px-3.5 py-2.5 text-sm font-medium border transition-colors min-h-[44px] ${
      ativo ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/40"
    }`;

  const ranking = [...volumes].filter((v) => v.diretas > 0).sort((a, b) => b.diretas - a.diretas);
  const maxSeries = ranking.length ? ranking[0].diretas : 1;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-5 sm:p-8 relative"
      data-testid="calculadora-volume"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />

      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · sem cadastro
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
        Quantas séries você realmente faz por músculo?
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6 max-w-xl">
        Monte ou informe seu treino e descubra quantas séries semanais cada
        grupo muscular está recebendo.
      </p>

      {/* Modo */}
      <div className="flex flex-wrap gap-2 mb-7" role="group" aria-label="Modo de uso">
        <button type="button" onClick={() => setModo("completo")} aria-pressed={modo === "completo"} className={chip(modo === "completo")}>
          {modo === "completo" && <Check />}
          Analisar meu treino
        </button>
        <button type="button" onClick={() => setModo("rapido")} aria-pressed={modo === "rapido"} className={chip(modo === "rapido")}>
          {modo === "rapido" && <Check />}
          Já sei meus números
        </button>
      </div>

      {modo === "completo" ? (
        <div className="space-y-4 mb-8">
          {dias.map((d) => (
            <DiaCard
              key={d.uid}
              dia={d}
              onMuda={(p) => mudaDia(d.uid, p)}
              onRemove={() => removeDia(d.uid)}
              onDuplica={() => duplicaDia(d.uid)}
              onAddItem={(it) => addItem(d.uid, it)}
              onMudaItem={(iu, p) => mudaItem(d.uid, iu, p)}
              onRemoveItem={(iu) => removeItem(d.uid, iu)}
            />
          ))}

          <fieldset className="border border-dashed border-white/20 p-4">
            <legend className="text-gray-300 text-sm font-medium px-2">Adicionar dia de treino</legend>
            <div className="flex flex-wrap gap-2">
              {DIAS.map((dia) => (
                <button key={dia} type="button" onClick={() => addDia(dia)} className={chip(false)}>
                  + {dia}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      ) : (
        <div className="mb-8">
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            Informe as séries diretas semanais de cada grupo. Deixe em branco o que não treina.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MUSCULOS.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3">
                <label htmlFor={`r-${m.id}-${placement}`} className="text-gray-300 text-sm">
                  {m.nome}
                </label>
                <input
                  id={`r-${m.id}-${placement}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="0"
                  value={rapido[m.id] ?? ""}
                  onChange={(e) => {
                    marcaInicio();
                    setRapido((x) => ({ ...x, [m.id]: e.target.value.replace(/\D/g, "") }));
                  }}
                  className="w-20 bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white text-lg font-bold px-3 py-2 text-center min-h-[44px]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Resultado ──────────────────────────────────────────────── */}
      <div aria-live="polite">
        {!temResultado ? (
          <div className="border border-dashed border-white/20 p-6">
            <p className="text-gray-300 leading-relaxed">
              {modo === "completo"
                ? "Adicione um dia de treino e os exercícios que você faz. A ferramenta identifica os músculos e calcula o volume semanal."
                : "Informe as séries semanais de pelo menos um grupo muscular."}
            </p>
            <p className="text-gray-500 text-sm mt-3">
              Tudo acontece no seu aparelho — nada é enviado para lugar nenhum.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Dashboard */}
            {modo === "completo" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  [r.diasComTreino, r.diasComTreino === 1 ? "treino/semana" : "treinos/semana"],
                  [r.exercicios, r.exercicios === 1 ? "exercício" : "exercícios"],
                  [r.seriesTrabalho, "séries de trabalho"],
                  [r.gruposAtingidos, "grupos atingidos"],
                ].map(([n, rot]) => (
                  <div key={rot as string} className="border border-white/15 p-4">
                    <p className="text-white font-bold text-3xl leading-none mb-1" style={h}>
                      {n as number}
                    </p>
                    <p className="text-gray-400 text-xs leading-tight">{rot as string}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Toggle secundários */}
            <div className="border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => {
                  if (!comSecundarios) trackEvent("training_volume_secondary_toggle", { placement });
                  setComSecundarios(!comSecundarios);
                }}
                aria-pressed={comSecundarios}
                className={chip(comSecundarios)}
              >
                {comSecundarios && <Check />}
                Considerar músculos secundários
              </button>
              {comSecundarios && (
                <p className="text-gray-400 text-sm mt-3 leading-relaxed max-w-2xl">{NOTA_EQUIVALENTES}</p>
              )}
            </div>

            {/* Volume por músculo */}
            <div>
              <h3 className="text-white font-bold text-xl mb-4" style={h}>
                Seu volume semanal
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {volumes
                  .filter((v) => v.diretas > 0 || (comSecundarios && v.equivalentesIndiretas > 0))
                  .map((v) => (
                    <MusculoCard
                      key={v.musculo}
                      v={v}
                      comSecundarios={comSecundarios}
                      aberto={aberto === v.musculo}
                      onToggle={() => {
                        if (aberto !== v.musculo) trackEvent("training_volume_muscle_open", { placement });
                        setAberto(aberto === v.musculo ? null : v.musculo);
                      }}
                    />
                  ))}
              </ul>
            </div>

            {/* Ranking */}
            {ranking.length > 1 && (
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-white font-bold text-lg mb-1" style={h}>
                  Onde seu treino concentra mais volume
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Equilíbrio não é igualdade — alguns músculos podem ser prioridade de propósito. A lista serve
                  para você conferir se a ordem bate com a sua intenção.
                </p>
                <ol className="space-y-2">
                  {ranking.map((v, i) => (
                    <li key={v.musculo} className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm w-5 tabular-nums shrink-0">{i + 1}.</span>
                      <span className="text-gray-300 text-sm w-40 shrink-0 truncate">{nomeMusculo(v.musculo)}</span>
                      <span className="flex-1 h-2 bg-white/5 overflow-hidden" aria-hidden="true">
                        <span
                          className="block h-full"
                          style={{ width: `${(v.diretas / maxSeries) * 100}%`, background: "#BA9E50" }}
                        />
                      </span>
                      <span className="text-white text-sm font-semibold tabular-nums w-8 text-right shrink-0">
                        {fmt(v.diretas)}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Distribuição semanal */}
            {modo === "completo" && dias.length > 0 && <Distribuicao dias={dias} volumes={volumes} />}

            {/* Como contamos */}
            <div className="border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => {
                  if (!metodoAberto) trackEvent("training_volume_methodology_open", { placement });
                  setMetodoAberto(!metodoAberto);
                }}
                aria-expanded={metodoAberto}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px] text-left"
                style={{ textDecorationColor: "#BA9E50" }}
              >
                Como contamos suas séries?
              </button>
              {metodoAberto && (
                <div className="mt-4 space-y-3 text-sm leading-relaxed max-w-2xl">
                  <p className="text-gray-300">
                    <strong className="text-white">Série direta:</strong> exercício em que aquele músculo é um dos
                    alvos principais. Conta 1.
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">Série indireta:</strong> exercício em que o músculo participa
                    como auxiliar.
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">Série equivalente:</strong> estimativa opcional que soma 0,5 por
                    série indireta, só para visualizar essa participação.
                  </p>
                  <p className="text-gray-400">{NOTA_EQUIVALENTES}</p>
                  <p className="text-gray-400">{NOTA_SERIES_CONTABILIZADAS}</p>
                  <p className="text-gray-400">{NOTA_UNILATERAL}</p>
                  <p className="text-gray-400">{NOTA_TECNICAS}</p>
                  <p className="text-gray-400">{NOTA_FREQUENCIA}</p>
                  <p className="text-gray-400">
                    As faixas de referência se apoiam em{" "}
                    <a href={FONTES.acsm.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
                      {FONTES.acsm.rotulo}
                    </a>{" "}
                    e em{" "}
                    <a href={FONTES.schoenfeld.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
                      {FONTES.schoenfeld.rotulo}
                    </a>
                    . São régua de leitura, não meta: o volume adequado depende de experiência, esforço, exercício,
                    recuperação e fase de treino.
                  </p>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
              <button type="button" onClick={copiaResumo} className={chip(false)}>
                {copiado ? "Copiado" : "Copiar resumo"}
              </button>
              {confirmandoLimpar ? (
                <>
                  <span className="text-gray-300 text-sm">Apagar o treino salvo?</span>
                  <button type="button" onClick={limpaTudo} className={chip(true)}>
                    Sim, apagar
                  </button>
                  <button type="button" onClick={() => setConfirmandoLimpar(false)} className={chip(false)}>
                    Cancelar
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setConfirmandoLimpar(true)} className={chip(false)}>
                  Limpar treino
                </button>
              )}
              <Link
                href="/ferramentas/calculadora-1rm"
                onClick={() => trackEvent("training_volume_1rm_click", { placement })}
                className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors"
                style={{ textDecorationColor: "#BA9E50" }}
              >
                Estimar a intensidade das minhas cargas →
              </Link>
            </div>
            <p className="text-gray-500 text-xs">Seu treino fica salvo neste dispositivo, no seu navegador.</p>

            {/* CTA */}
            <div className="border-t border-white/10 pt-5">
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                Volume é só uma parte. Exercícios, intensidade, progressão, recuperação e distribuição precisam
                conversar entre si.{" "}
                <Link
                  href="/consultoria"
                  onClick={() => trackEvent("training_volume_cta_click", { placement })}
                  className="text-gray-300 underline underline-offset-2 decoration-1 hover:text-white transition-colors"
                >
                  É isso que o acompanhamento do Montinho estrutura
                </Link>
                .
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-7 pt-5 border-t border-white/10 max-w-3xl">
        {NOTA_VOLUME_NAO_E_TUDO}
      </p>
    </div>
  );
}

/** Marca de seleção — a cor sozinha não pode ser o único sinal. */
function Check() {
  return (
    <span aria-hidden="true" style={{ color: "#BA9E50" }}>
      ✓{" "}
    </span>
  );
}

/** Formata 6.5 → "6,5" e 14 → "14". */
function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
}

/* ── Cartão de músculo ──────────────────────────────────────────────── */

function MusculoCard({
  v,
  comSecundarios,
  aberto,
  onToggle,
}: {
  v: VolumeMusculo;
  comSecundarios: boolean;
  aberto: boolean;
  onToggle: () => void;
}) {
  const faixa = classificaVolume(v.diretas);
  const concentrado = estaConcentrado(v);
  const diretos = v.exercicios.filter((e) => e.direto);
  const indiretos = v.exercicios.filter((e) => !e.direto);

  return (
    <li className="border border-white/15">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={aberto}
        className="w-full text-left p-5 hover:bg-white/[0.03] transition-colors min-h-[44px]"
      >
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#BA9E50" }}>
          {nomeMusculo(v.musculo)}
        </p>
        <p className="text-white font-bold text-4xl leading-none mb-1" style={h}>
          {fmt(v.diretas)}
          <span className="text-sm font-normal text-gray-400"> séries diretas/semana</span>
        </p>
        {comSecundarios && v.equivalentesIndiretas > 0 && (
          <p className="text-gray-400 text-sm mt-1">
            + {fmt(v.equivalentesIndiretas)} equivalentes indiretas ={" "}
            <strong className="text-gray-200">{fmt(equivalentes(v))}</strong> equivalentes
          </p>
        )}
        <p className="text-gray-400 text-sm mt-2">
          {v.sessoes} {v.sessoes === 1 ? "sessão" : "sessões"} por semana
          {v.sessoes > 0 && ` · ${fmt(Math.round(mediaPorSessao(v) * 10) / 10)} por sessão`}
        </p>
        <p className="text-gray-300 text-sm mt-2 font-medium">{faixa.rotulo}</p>
        <p className="text-gray-500 text-xs mt-2">{aberto ? "Fechar detalhes" : "Ver detalhes"}</p>
      </button>

      {aberto && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
          <p className="text-gray-400 text-sm leading-relaxed">{faixa.texto}</p>

          {concentrado && (
            <p className="text-[#E8C77A] text-sm leading-relaxed border-l-2 border-[#BA9E50] pl-3">
              {TEXTO_CONCENTRACAO}
            </p>
          )}

          {v.porDia.length > 0 && (
            <div>
              <p className="text-white text-sm font-semibold mb-2">Distribuição</p>
              <ul className="space-y-1">
                {v.porDia.map((d, i) => (
                  <li key={i} className="text-gray-300 text-sm flex justify-between gap-3">
                    <span>
                      {d.dia}
                      {d.nome ? ` — ${d.nome}` : ""}
                    </span>
                    <span className="text-white font-medium tabular-nums">{fmt(d.series)} séries</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {diretos.length > 0 && (
            <div>
              <p className="text-white text-sm font-semibold mb-2">Exercícios (séries diretas)</p>
              <ul className="space-y-1">
                {diretos.map((e, i) => (
                  <li key={i} className="text-gray-300 text-sm flex justify-between gap-3">
                    <span>
                      {/* O nome leva para o 1RM já preenchido: aqui a pessoa
                          está analisando, não montando — é o momento em que a
                          pergunta "e com quanto peso?" aparece sozinha. */}
                      <Link
                        href="/ferramentas/calculadora-1rm"
                        onClick={() => {
                          guarda(PONTE.exercicio, e.nome);
                          trackEvent("training_volume_1rm_click", { placement: "detalhe-musculo" });
                        }}
                        className="underline underline-offset-4 decoration-1 hover:text-white transition-colors"
                        style={{ textDecorationColor: "#BA9E50" }}
                        title={`Estimar 1RM de ${e.nome}`}
                      >
                        {e.nome}
                      </Link>{" "}
                      <span className="text-gray-500">· {e.dia}</span>
                    </span>
                    <span className="text-white font-medium tabular-nums">{e.series}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-500 text-xs mt-2">
                Toque no nome de um exercício para estimar o 1RM dele.
              </p>
            </div>
          )}

          {comSecundarios && indiretos.length > 0 && (
            <div>
              <p className="text-white text-sm font-semibold mb-2">Participação indireta</p>
              <ul className="space-y-1">
                {indiretos.map((e, i) => (
                  <li key={i} className="text-gray-400 text-sm flex justify-between gap-3">
                    <span>
                      {e.nome} <span className="text-gray-600">· {e.dia}</span>
                    </span>
                    <span className="tabular-nums">
                      {e.series} × 0,5 = {fmt(e.series * 0.5)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

/* ── Distribuição semanal ───────────────────────────────────────────── */

function Distribuicao({ dias, volumes }: { dias: DiaTreino[]; volumes: VolumeMusculo[] }) {
  const comVolume = volumes.filter((v) => v.diretas > 0);
  if (comVolume.length === 0) return null;

  return (
    <div className="border-t border-white/10 pt-6">
      <h3 className="text-white font-bold text-lg mb-1" style={h}>
        Distribuição na semana
      </h3>
      <p className="text-gray-400 text-sm mb-4">Séries diretas de cada músculo em cada dia.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[420px]">
          <caption className="sr-only">
            Séries diretas por grupo muscular em cada dia de treino da semana
          </caption>
          <thead>
            <tr className="border-b border-white/20">
              <th scope="col" className="text-left text-gray-400 font-medium py-2 pr-3">
                Músculo
              </th>
              {dias.map((d) => (
                <th key={d.uid} scope="col" className="text-center text-gray-400 font-medium py-2 px-2 whitespace-nowrap">
                  {d.dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comVolume.map((v) => (
              <tr key={v.musculo} className="border-b border-white/10">
                <th scope="row" className="text-left text-gray-300 py-2 pr-3 font-normal whitespace-nowrap">
                  {nomeMusculo(v.musculo)}
                </th>
                {dias.map((d) => {
                  const cel = v.porDia.find((x) => x.dia === d.dia && x.nome === d.nome);
                  const n = cel?.series ?? 0;
                  return (
                    <td key={d.uid} className="text-center py-2 px-2">
                      {n > 0 ? (
                        <span
                          className="inline-block min-w-[28px] px-1.5 py-0.5 text-white font-medium tabular-nums"
                          style={{ background: `rgba(186,158,80,${Math.min(0.15 + n * 0.06, 0.6)})` }}
                        >
                          {fmt(n)}
                        </span>
                      ) : (
                        <span className="text-gray-600">–</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-gray-500 text-xs mt-3 leading-relaxed">
        A intensidade do fundo acompanha o número, mas o número está sempre escrito — a cor é só um reforço.
      </p>
    </div>
  );
}

/* ── Cartão de dia ──────────────────────────────────────────────────── */

function DiaCard({
  dia,
  onMuda,
  onRemove,
  onDuplica,
  onAddItem,
  onMudaItem,
  onRemoveItem,
}: {
  dia: DiaTreino;
  onMuda: (p: Partial<DiaTreino>) => void;
  onRemove: () => void;
  onDuplica: () => void;
  onAddItem: (i: ItemTreino) => void;
  onMudaItem: (uid: string, p: Partial<ItemTreino>) => void;
  onRemoveItem: (uid: string) => void;
}) {
  const [busca, setBusca] = useState("");
  const [criando, setCriando] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoMusculo, setNovoMusculo] = useState<MusculoId>("peitoral");
  const [editando, setEditando] = useState<string | null>(null);

  const resultados = useMemo(() => buscaExercicios(busca), [busca]);
  const btn =
    "px-3 py-2 text-xs border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-colors min-h-[44px]";

  return (
    <div className="border border-white/15 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-white font-bold text-lg" style={h}>
          {dia.dia}
        </span>
        <label className="flex-1 min-w-[140px]">
          <span className="sr-only">Nome do treino de {dia.dia}</span>
          <input
            type="text"
            placeholder="Nome do treino (opcional)"
            value={dia.nome}
            onChange={(e) => onMuda({ nome: e.target.value })}
            className="w-full bg-black border border-white/20 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-gray-200 text-sm px-3 py-2 min-h-[44px]"
          />
        </label>
        <button type="button" onClick={onDuplica} className={btn}>
          Duplicar
        </button>
        <button type="button" onClick={onRemove} className={btn}>
          Remover dia
        </button>
      </div>

      {dia.itens.length > 0 && (
        <ul className="space-y-2 mb-4">
          {dia.itens.map((it) => (
            <li key={it.uid} className="border border-white/10 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex-1 min-w-[130px] text-gray-200 text-sm">
                  {it.nome}
                  {it.unilateral && <span className="text-gray-500 text-xs"> · unilateral</span>}
                </span>
                <label className="flex items-center gap-2">
                  <span className="sr-only">
                    Séries de {it.nome}
                    {it.unilateral ? " por lado" : ""}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={String(it.series)}
                    onChange={(e) => onMudaItem(it.uid, { series: Number(e.target.value.replace(/\D/g, "")) || 0 })}
                    className="w-16 bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white text-lg font-bold px-2 py-1.5 text-center min-h-[44px]"
                  />
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    {it.unilateral ? "séries/lado" : "séries"}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => onMudaItem(it.uid, { tipo: it.tipo === "trabalho" ? "aquecimento" : "trabalho" })}
                  aria-pressed={it.tipo === "aquecimento"}
                  className={`px-2.5 py-1.5 text-xs border transition-colors min-h-[44px] ${
                    it.tipo === "aquecimento"
                      ? "border-[#BA9E50] text-white bg-[#BA9E50]/10"
                      : "border-white/20 text-gray-400 hover:border-white/40"
                  }`}
                  title="Séries de aquecimento não entram no volume"
                >
                  {it.tipo === "aquecimento" ? "✓ aquecimento" : "aquecimento"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditando(editando === it.uid ? null : it.uid)}
                  aria-expanded={editando === it.uid}
                  className={btn}
                >
                  Músculos
                </button>
                <button type="button" onClick={() => onRemoveItem(it.uid)} className={btn} aria-label={`Remover ${it.nome}`}>
                  ✕
                </button>
              </div>

              {editando === it.uid && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-gray-400 text-xs mb-2 leading-relaxed">
                    A execução muda a ênfase. Ajuste se no seu caso for diferente.
                  </p>
                  <fieldset className="mb-2">
                    <legend className="text-gray-300 text-xs mb-1.5">Conta como direto para</legend>
                    <div className="flex flex-wrap gap-1.5">
                      {MUSCULOS.map((m) => {
                        const on = it.primarios.includes(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() =>
                              onMudaItem(it.uid, {
                                primarios: on ? it.primarios.filter((x) => x !== m.id) : [...it.primarios, m.id],
                                secundarios: it.secundarios.filter((x) => x !== m.id),
                              })
                            }
                            className={`px-2 py-1 text-[11px] border transition-colors ${
                              on ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/15 text-gray-400"
                            }`}
                          >
                            {on ? "✓ " : ""}
                            {m.nome}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="text-gray-300 text-xs mb-1.5">Participação secundária</legend>
                    <div className="flex flex-wrap gap-1.5">
                      {MUSCULOS.filter((m) => !it.primarios.includes(m.id)).map((m) => {
                        const on = it.secundarios.includes(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() =>
                              onMudaItem(it.uid, {
                                secundarios: on ? it.secundarios.filter((x) => x !== m.id) : [...it.secundarios, m.id],
                              })
                            }
                            className={`px-2 py-1 text-[11px] border transition-colors ${
                              on ? "border-white/50 text-gray-200" : "border-white/15 text-gray-500"
                            }`}
                          >
                            {on ? "✓ " : ""}
                            {m.nome}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Busca de exercício */}
      <div>
        <label className="block">
          <span className="sr-only">Buscar exercício para {dia.dia}</span>
          <input
            type="text"
            placeholder="+ Adicionar exercício (buscar...)"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-black border border-white/20 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-gray-200 px-3 py-2.5 min-h-[48px]"
          />
        </label>
        {busca.trim() !== "" && (
          <ul className="mt-2 border border-white/15 divide-y divide-white/10">
            {resultados.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => {
                    onAddItem(itemDeExercicio(e, uid()));
                    setBusca("");
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-white/[0.04] transition-colors min-h-[44px]"
                >
                  <span className="text-gray-200 text-sm">{e.nome}</span>
                  <span className="block text-gray-500 text-xs">
                    {e.primarios.map(nomeMusculo).join(" · ")}
                    {e.unilateral ? " · unilateral" : ""}
                  </span>
                </button>
              </li>
            ))}
            {resultados.length === 0 && (
              <li className="px-3 py-2.5 text-gray-400 text-sm">
                Nenhum exercício encontrado.{" "}
                <button
                  type="button"
                  onClick={() => {
                    setNovoNome(busca);
                    setCriando(true);
                    setBusca("");
                  }}
                  className="text-white underline underline-offset-2"
                >
                  Criar exercício
                </button>
              </li>
            )}
          </ul>
        )}
        {!criando && busca.trim() === "" && (
          <button type="button" onClick={() => setCriando(true)} className="text-gray-400 hover:text-white text-xs mt-2 underline underline-offset-2 min-h-[44px]">
            + Criar exercício personalizado
          </button>
        )}
      </div>

      {criando && (
        <div className="mt-3 border border-white/15 p-3 space-y-3">
          <label className="block">
            <span className="text-gray-300 text-xs block mb-1">Nome do exercício</span>
            <input
              type="text"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="w-full bg-black border border-white/20 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-gray-200 px-3 py-2 min-h-[44px]"
            />
          </label>
          <label className="block">
            <span className="text-gray-300 text-xs block mb-1">Músculo principal</span>
            <select
              value={novoMusculo}
              onChange={(e) => setNovoMusculo(e.target.value as MusculoId)}
              className="w-full bg-black border border-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-gray-200 px-3 py-2 min-h-[44px]"
            >
              {MUSCULOS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={novoNome.trim() === ""}
              onClick={() => {
                onAddItem({
                  uid: uid(),
                  exercicioId: null,
                  nome: novoNome.trim(),
                  series: 3,
                  tipo: "trabalho",
                  primarios: [novoMusculo],
                  secundarios: [],
                  unilateral: false,
                });
                setNovoNome("");
                setCriando(false);
              }}
              className={`${btn} disabled:opacity-40`}
            >
              Adicionar
            </button>
            <button type="button" onClick={() => setCriando(false)} className={btn}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
