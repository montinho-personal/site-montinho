"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { PONTE, consome } from "@/lib/ferramentas/ponte";
import {
  ANILHAS_PADRAO,
  AVISO_MUITAS_REPS,
  BARRAS,
  CARGA_MAX,
  CARGA_MIN,
  CONTEXTO_FAIXAS,
  DISCLAIMER,
  EQUIPAMENTOS,
  EXERCICIOS,
  FONTE_BRZYCKI,
  FONTE_EPLEY,
  FONTE_LIMITES,
  INCREMENTOS,
  NOTA_EXERCICIOS,
  NOTA_NAO_TENTE,
  NOTA_PROXIMIDADE_FALHA,
  NOTA_SEM_TESTE_MAXIMO,
  NOTA_SEM_ZONA_MAGICA,
  ORIENTACAO_REPS_DEMAIS,
  PERCENTUAIS,
  PERCENTUAIS_RAPIDOS,
  REPS_AVISO,
  REPS_MAX,
  type Equipamento,
  arredondaKg,
  arredondaParaIncremento,
  brzycki1RM,
  calculaMontagem,
  cargaDoPercentual,
  epley1RM,
  formataKg,
  normalizaCarga,
  normalizaReps,
} from "@/lib/onerm";

/**
 * Calculadora de 1RM e carga de treino.
 *
 * Pensada para ser aberta entre duas séries, com uma mão, no celular da
 * academia. Por isso: cálculo instantâneo, campos grandes, teclado numérico,
 * números enormes e nenhuma etapa obrigatória além de carga e repetições.
 *
 * A cadeia é o produto — 1RM → percentuais → carga prática → anilhas — e ela
 * abre progressivamente. Mostrar seletor de anilha antes de existir um 1RM
 * transformaria uma conta de dez segundos num formulário.
 *
 * Tudo roda no navegador: nenhuma chamada de rede, nada gravado, e os
 * eventos registram uso e não desempenho de ninguém.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";

export default function CalculadoraOneRM({
  placement,
}: {
  /** Onde o componente está — segmenta os eventos, nunca carrega os valores. */
  placement: string;
}) {
  const [cargaTexto, setCargaTexto] = useState("");
  const [repsTexto, setRepsTexto] = useState("");
  const [exercicio, setExercicio] = useState("");
  const [pctEscolhido, setPctEscolhido] = useState<number | null>(null);
  const [incremento, setIncremento] = useState<number>(2.5);
  const [equipamento, setEquipamento] = useState<Equipamento>("barra");
  const [anilhasAbertas, setAnilhasAbertas] = useState(false);
  const [pesoBarra, setPesoBarra] = useState<number>(20);
  const [barraOutraTexto, setBarraOutraTexto] = useState("");
  const [anilhas, setAnilhas] = useState<number[]>([...ANILHAS_PADRAO].filter((a) => a !== 0.5));
  const [metodoAberto, setMetodoAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  /**
   * Exercício vindo da Calculadora de Volume. Como o campo aqui é só
   * contexto (não entra na conta), aceitamos qualquer nome da base de 120 —
   * o select ganha uma opção extra em vez de forçar o nome a caber numa
   * lista de seis.
   */
  const [exercicioExterno, setExercicioExterno] = useState<string | null>(null);
  useEffect(() => {
    const nome = consome(PONTE.exercicio);
    if (nome) {
      setExercicioExterno(nome);
      setExercicio(nome);
    }
  }, []);

  const carga = useMemo(() => normalizaCarga(cargaTexto), [cargaTexto]);
  const reps = useMemo(() => normalizaReps(repsTexto), [repsTexto]);

  const cargaOk = carga !== null && carga >= CARGA_MIN && carga <= CARGA_MAX;
  const repsPreenchido = reps !== null;
  const repsDemais = repsPreenchido && reps > REPS_MAX;
  const repsOk = repsPreenchido && reps >= 1 && reps <= REPS_MAX;

  const umRM = useMemo(() => (cargaOk && repsOk && carga && reps ? epley1RM(carga, reps) : null), [cargaOk, repsOk, carga, reps]);

  const barraFinal = useMemo(() => {
    if (pesoBarra !== -1) return pesoBarra;
    const v = normalizaCarga(barraOutraTexto);
    return v && v > 0 ? v : null;
  }, [pesoBarra, barraOutraTexto]);

  /** Carga-alvo do percentual escolhido, e a versão que dá para carregar. */
  const alvo = umRM !== null && pctEscolhido !== null ? cargaDoPercentual(umRM, pctEscolhido) : null;
  const alvoPratico = alvo !== null ? arredondaParaIncremento(alvo, incremento) : null;

  const montagem = useMemo(() => {
    if (alvoPratico === null || barraFinal === null || equipamento !== "barra") return null;
    return calculaMontagem(alvoPratico, barraFinal, anilhas);
  }, [alvoPratico, barraFinal, anilhas, equipamento]);

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("one_rm_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  useEffect(() => {
    if (umRM !== null && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("one_rm_calculator_use", { placement });
    }
  }, [umRM, placement]);

  function copiar() {
    if (umRM === null) return;
    const linhas = [
      exercicio && exercicio !== "Outro" ? exercicio : null,
      `${formataKg(carga!)} kg × ${reps} ${reps === 1 ? "repetição" : "repetições"}`,
      `1RM estimado: ≈ ${arredondaKg(umRM)} kg`,
      pctEscolhido !== null && alvoPratico !== null ? `${pctEscolhido}%: ≈ ${formataKg(alvoPratico)} kg` : null,
      "Calculado no Montinho Personal.",
    ]
      .filter(Boolean)
      .join("\n");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(linhas).then(
        () => {
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2000);
        },
        () => {}
      );
    }
  }

  const campo =
    "w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white text-3xl font-bold px-4 py-3.5 transition-colors min-h-[56px]";
  const rotulo = "block text-gray-300 text-sm font-medium mb-2";
  const chip = (ativo: boolean) =>
    `px-4 py-2.5 text-sm font-medium border transition-colors min-h-[44px] ${
      ativo ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/40"
    }`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-1rm"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />

      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · sem cadastro
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
        Descubra seu 1RM e quanto colocar na barra
      </h2>
      <p className="text-gray-300 leading-relaxed mb-7 max-w-xl">
        Informe a carga e quantas repetições você conseguiu fazer para estimar
        seu 1RM e ver as cargas de cada intensidade do treino.
      </p>

      {/* ── Entrada ───────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 mb-5">
        <div>
          <label htmlFor={`carga-${placement}`} className={rotulo}>
            Carga utilizada <span className="text-gray-500 font-normal">(kg)</span>
          </label>
          <input
            id={`carga-${placement}`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="80"
            value={cargaTexto}
            onChange={(e) => setCargaTexto(e.target.value)}
            aria-invalid={cargaTexto.trim() !== "" && !cargaOk}
            aria-describedby={`carga-erro-${placement}`}
            className={campo}
          />
          <p id={`carga-erro-${placement}`} className="text-[#E8B4B4] text-sm mt-1.5 min-h-[20px]">
            {cargaTexto.trim() !== "" && !cargaOk ? "Confira a carga informada." : ""}
          </p>
        </div>
        <div>
          <label htmlFor={`reps-${placement}`} className={rotulo}>
            Repetições realizadas
          </label>
          <input
            id={`reps-${placement}`}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="8"
            value={repsTexto}
            onChange={(e) => setRepsTexto(e.target.value)}
            aria-invalid={repsTexto.trim() !== "" && !repsOk}
            aria-describedby={`reps-erro-${placement}`}
            className={campo}
          />
          <p id={`reps-erro-${placement}`} className="text-[#E8B4B4] text-sm mt-1.5 min-h-[20px]">
            {repsTexto.trim() !== "" && !repsPreenchido ? "Informe quantas repetições você realizou." : ""}
          </p>
        </div>
      </div>

      {/* Exercício — opcional, só contexto */}
      <div className="mb-6">
        <label htmlFor={`ex-${placement}`} className={rotulo}>
          Exercício <span className="text-gray-500 font-normal">(opcional)</span>
        </label>
        {exercicioExterno && (
          <p className="text-gray-400 text-sm mb-2 border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}>
            Exercício trazido da sua análise de volume.
          </p>
        )}
        <select
          id={`ex-${placement}`}
          value={exercicio}
          onChange={(e) => setExercicio(e.target.value)}
          className="w-full sm:w-auto bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-gray-200 text-base px-4 py-3 min-h-[48px]"
        >
          <option value="">Não informar</option>
          {exercicioExterno && !EXERCICIOS.includes(exercicioExterno as (typeof EXERCICIOS)[number]) && (
            <option value={exercicioExterno}>{exercicioExterno}</option>
          )}
          {EXERCICIOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      {/* ── Resultado ─────────────────────────────────────────────────── */}
      <div aria-live="polite">
        {repsDemais ? (
          <div className="border border-white/20 p-6">
            <p className="text-gray-200 leading-relaxed">{ORIENTACAO_REPS_DEMAIS}</p>
          </div>
        ) : umRM === null ? (
          /* Zero state — nunca "1RM = 0" */
          <div className="border border-dashed border-white/20 p-6 sm:p-8">
            <p className="text-gray-300 leading-relaxed">
              Informe uma carga e o número de repetições realizadas para estimar
              seu 1RM.
            </p>
            <p className="text-gray-500 text-sm mt-2">Exemplo: 80 kg × 8 repetições.</p>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}>
              {NOTA_SEM_TESTE_MAXIMO}
            </p>
          </div>
        ) : (
          <div className="space-y-7">
            {/* O número principal */}
            <div className="border border-[#BA9E50]/50 bg-[#BA9E50]/[0.07] p-6">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#BA9E50" }}>
                Seu 1RM estimado{exercicio && exercicio !== "Outro" ? ` — ${exercicio.toLowerCase()}` : ""}
              </p>
              <p className="text-white font-bold text-6xl sm:text-7xl leading-none mb-3" style={h}>
                <span className="text-3xl font-normal text-gray-400">≈ </span>
                {arredondaKg(umRM)}
                <span className="text-2xl font-normal text-gray-300"> kg</span>
              </p>
              <p className="text-gray-300 text-sm">
                Calculado a partir de {formataKg(carga!)} kg × {reps} {reps === 1 ? "repetição" : "repetições"}
              </p>
              {reps! >= REPS_AVISO && (
                <p className="text-[#E8C77A] text-sm leading-relaxed mt-3 border-l-2 border-[#BA9E50] pl-3">
                  {AVISO_MUITAS_REPS}
                </p>
              )}
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">{NOTA_NAO_TENTE}</p>

            {/* Tabela de percentuais */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-white font-bold text-lg mb-4" style={h}>
                Suas cargas por intensidade
              </h3>
              <ul className="grid gap-x-6 gap-y-0 sm:grid-cols-2">
                {PERCENTUAIS.map((p) => (
                  <li
                    key={p}
                    className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2.5"
                  >
                    <span className="text-gray-400 text-sm tabular-nums">{p}%</span>
                    <span className="text-white font-semibold text-lg tabular-nums" style={h}>
                      {arredondaKg(cargaDoPercentual(umRM, p))}
                      <span className="text-gray-400 text-sm font-normal"> kg</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-3">
                {CONTEXTO_FAIXAS.map((f) => (
                  <div key={f.titulo}>
                    <p className="text-white text-sm font-semibold">
                      {f.titulo}{" "}
                      <span className="text-gray-500 font-normal">
                        {f.de}–{f.ate}%
                      </span>
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.texto}</p>
                  </div>
                ))}
                <p className="text-gray-400 text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}>
                  {NOTA_SEM_ZONA_MAGICA}
                </p>
              </div>
            </div>

            {/* Intensidade escolhida → carga prática */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-white font-bold text-lg mb-1" style={h}>
                Com qual intensidade você quer treinar?
              </h3>
              <p className="text-gray-400 text-sm mb-4">Toque num percentual para ver a carga prática.</p>

              <div className="flex flex-wrap gap-2 mb-5">
                {PERCENTUAIS_RAPIDOS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPctEscolhido(pctEscolhido === p ? null : p);
                      if (pctEscolhido !== p) trackEvent("one_rm_percentage_select", { placement });
                    }}
                    aria-pressed={pctEscolhido === p}
                    className={chip(pctEscolhido === p)}
                  >
                    {pctEscolhido === p && (
                      <span aria-hidden="true" style={{ color: "#BA9E50" }}>
                        ✓{" "}
                      </span>
                    )}
                    {p}%
                  </button>
                ))}
              </div>

              {pctEscolhido !== null && alvo !== null && alvoPratico !== null && (
                <div className="border border-white/15 p-5">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#BA9E50" }}>
                    Sua carga-alvo · {pctEscolhido}%
                  </p>
                  <p className="text-white font-bold text-4xl leading-none mb-4" style={h}>
                    <span className="text-xl font-normal text-gray-400">≈ </span>
                    {formataKg(alvoPratico)}
                    <span className="text-lg font-normal text-gray-300"> kg</span>
                  </p>

                  <div className="mb-4">
                    <p className="text-gray-300 text-sm font-medium mb-2">Incremento disponível na sua academia</p>
                    <div className="flex flex-wrap gap-2">
                      {INCREMENTOS.map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setIncremento(i)}
                          aria-pressed={incremento === i}
                          className={chip(incremento === i)}
                        >
                          {formataKg(i)} kg
                        </button>
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      Cálculo exato: {formataKg(Math.round(alvo * 10) / 10)} kg · arredondado para{" "}
                      {formataKg(alvoPratico)} kg
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-300 text-sm font-medium mb-2">Tipo de equipamento</p>
                    <div className="flex flex-wrap gap-2">
                      {EQUIPAMENTOS.map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => setEquipamento(e.id)}
                          aria-pressed={equipamento === e.id}
                          className={chip(equipamento === e.id)}
                        >
                          {e.rotulo}
                        </button>
                      ))}
                    </div>
                  </div>

                  {equipamento === "barra" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (!anilhasAbertas) trackEvent("one_rm_plate_calculator_open", { placement });
                          setAnilhasAbertas(!anilhasAbertas);
                        }}
                        aria-expanded={anilhasAbertas}
                        className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px] text-left"
                        style={{ textDecorationColor: "#BA9E50" }}
                      >
                        Ver quais anilhas colocar →
                      </button>

                      {anilhasAbertas && (
                        <div className="mt-5 space-y-5">
                          <div>
                            <p className="text-gray-300 text-sm font-medium mb-2">Peso da barra</p>
                            <div className="flex flex-wrap gap-2 items-center">
                              {BARRAS.map((b) => (
                                <button
                                  key={b}
                                  type="button"
                                  onClick={() => setPesoBarra(b)}
                                  aria-pressed={pesoBarra === b}
                                  className={chip(pesoBarra === b)}
                                >
                                  {b} kg
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => setPesoBarra(-1)}
                                aria-pressed={pesoBarra === -1}
                                className={chip(pesoBarra === -1)}
                              >
                                Outro
                              </button>
                              {pesoBarra === -1 && (
                                <label className="flex items-center gap-2">
                                  <span className="sr-only">Peso da barra em quilos</span>
                                  <input
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="12"
                                    value={barraOutraTexto}
                                    onChange={(e) => setBarraOutraTexto(e.target.value)}
                                    className="w-24 bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white px-3 py-2.5 min-h-[44px]"
                                  />
                                  <span className="text-gray-400 text-sm">kg</span>
                                </label>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-gray-300 text-sm font-medium mb-2">
                              Anilhas disponíveis <span className="text-gray-500 font-normal">(desmarque o que não tem)</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {ANILHAS_PADRAO.map((a) => {
                                const ativa = anilhas.includes(a);
                                return (
                                  <button
                                    key={a}
                                    type="button"
                                    onClick={() =>
                                      setAnilhas(ativa ? anilhas.filter((x) => x !== a) : [...anilhas, a])
                                    }
                                    aria-pressed={ativa}
                                    className={chip(ativa)}
                                  >
                                    {ativa && (
                                      <span aria-hidden="true" style={{ color: "#BA9E50" }}>
                                        ✓{" "}
                                      </span>
                                    )}
                                    {formataKg(a)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Montagem */}
                          {barraFinal === null ? (
                            <p className="text-gray-400 text-sm">Informe o peso da barra para montar a carga.</p>
                          ) : montagem?.abaixoDaBarra ? (
                            <p className="text-gray-300 text-sm leading-relaxed border border-white/15 p-4">
                              A carga-alvo de {formataKg(alvoPratico)} kg é menor que a barra sozinha
                              ({formataKg(barraFinal)} kg). Nesse caso vale usar uma barra mais leve ou halteres.
                            </p>
                          ) : montagem?.exata ? (
                            <MontagemCard
                              titulo="Monte assim"
                              barra={barraFinal}
                              montagem={montagem.exata}
                              destaque
                            />
                          ) : (
                            <div className="space-y-3">
                              <p className="text-gray-300 text-sm leading-relaxed">
                                A carga exata de {formataKg(alvoPratico)} kg não pode ser montada com as anilhas
                                selecionadas. As mais próximas são:
                              </p>
                              {montagem?.abaixo && (
                                <MontagemCard titulo="Mais próxima abaixo" barra={barraFinal} montagem={montagem.abaixo} />
                              )}
                              {montagem?.acima && (
                                <MontagemCard titulo="Mais próxima acima" barra={barraFinal} montagem={montagem.acima} />
                              )}
                              {!montagem?.abaixo && !montagem?.acima && (
                                <p className="text-gray-400 text-sm">
                                  Nenhuma combinação possível com as anilhas marcadas.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {equipamento === "halteres"
                        ? "Em halteres, a carga acima corresponde ao mesmo formato que você informou lá em cima — se você digitou o peso de um halter, o alvo também é por halter."
                        : "Em máquina, use o valor mais próximo disponível na placa."}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Como calculamos */}
            <div className="border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => {
                  if (!metodoAberto) trackEvent("one_rm_methodology_open", { placement });
                  setMetodoAberto(!metodoAberto);
                }}
                aria-expanded={metodoAberto}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px] text-left"
                style={{ textDecorationColor: "#BA9E50" }}
              >
                Como calculamos seu 1RM?
              </button>
              {metodoAberto && (
                <div className="mt-4 space-y-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Usamos a equação de {FONTE_EPLEY.rotuloCurto}, que estima a repetição máxima a partir de
                    uma série submáxima:
                  </p>
                  <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 space-y-1 overflow-x-auto">
                    <p>1RM = carga × (1 + reps ÷ 30)</p>
                    <p>
                      {formataKg(carga!)} × (1 + {reps} ÷ 30) ={" "}
                      <span className="text-white">≈ {arredondaKg(umRM)} kg</span>
                    </p>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Existem outras equações, e elas discordam um pouco entre si. A de{" "}
                    {FONTE_BRZYCKI.rotuloCurto} daria{" "}
                    <strong className="text-white">≈ {arredondaKg(brzycki1RM(carga!, reps!))} kg</strong> para a
                    mesma série. Mostramos uma só como resultado principal, e não fazemos média das duas —
                    média de estimativas não é uma estimativa melhor.
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">{NOTA_PROXIMIDADE_FALHA}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {NOTA_EXERCICIOS}{" "}
                    <a href={FONTE_LIMITES.url} target="_blank" rel="noopener noreferrer" className={ln}>
                      {FONTE_LIMITES.rotulo}
                    </a>{" "}
                    {FONTE_LIMITES.resumo}
                  </p>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={copiar}
                className="border border-white/25 text-gray-300 hover:text-white hover:border-white/50 text-sm px-4 py-2.5 transition-colors min-h-[44px]"
              >
                {copiado ? "Copiado" : "Copiar resultado"}
              </button>
              <Link
                href="/blog/progressao-de-carga"
                onClick={() => trackEvent("one_rm_article_click", { placement })}
                className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors"
                style={{ textDecorationColor: "#BA9E50" }}
              >
                Como usar isso para progredir →
              </Link>
            </div>

            {/**
             * A última emenda do caminho do treino. A pessoa acabou de
             * descobrir a carga — e a pergunta seguinte é inevitável: "será
             * que eu aguento esse peso com técnica?". O passo 5 responde
             * exatamente isso, e não entrega numa ferramenta: entrega na
             * conversa, por um serviço gratuito. Carga sem técnica é risco.
             */}
            <div className="border border-[#BA9E50]/50 bg-[#BA9E50]/[0.06] p-5">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1.5" style={{ color: "#BA9E50" }}>
                Próximo passo
              </p>
              <p className="text-gray-200 text-sm leading-relaxed mb-3">
                Você sabe a carga. A pergunta agora é outra: o seu movimento
                aguenta essa carga? Carga certa com técnica errada é risco, não
                estímulo. Grave uma série e me mande — eu mesmo assisto e te
                devolvo os pontos de atenção. É gratuito.
              </p>
              <Link
                href="/revisao-de-execucao"
                onClick={() => trackEvent("one_rm_review_click", { placement })}
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-sm font-semibold min-h-[48px] hover:opacity-90 transition-opacity"
              >
                Revisar minha execução — grátis
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* CTA — depois de todo o valor entregue */}
            <div className="border-t border-white/10 pt-5">
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                Saber a carga é útil. Saber quando aumentar, quantas séries fazer e como organizar a
                progressão é o que transforma o número em treino.{" "}
                <Link
                  href="/consultoria"
                  onClick={() => trackEvent("one_rm_cta_click", { placement })}
                  className="text-gray-300 underline underline-offset-2 decoration-1 hover:text-white transition-colors"
                >
                  É isso que o acompanhamento do Montinho organiza
                </Link>
                .
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-7 pt-5 border-t border-white/10 max-w-3xl">
        {DISCLAIMER}
      </p>
    </div>
  );
}

/** Cartão de montagem da barra — usado na exata e nas duas aproximações. */
function MontagemCard({
  titulo,
  barra,
  montagem,
  destaque = false,
}: {
  titulo: string;
  barra: number;
  montagem: { anilhas: { peso: number; quantidade: number }[]; pesoLado: number; total: number };
  destaque?: boolean;
}) {
  return (
    <div className={`border p-5 ${destaque ? "border-[#BA9E50]/60 bg-[#BA9E50]/[0.06]" : "border-white/15"}`}>
      <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        {titulo}
      </p>
      <p className="text-gray-400 text-sm mb-1">Barra de {formataKg(barra)} kg</p>
      <p className="text-gray-300 text-sm mb-2">Cada lado:</p>
      <p className="text-white font-bold text-2xl leading-tight mb-3" style={h}>
        {montagem.anilhas.map((a, i) => (
          <span key={a.peso}>
            {i > 0 && <span className="text-gray-500 font-normal"> + </span>}
            {a.quantidade > 1 && <span className="text-gray-400 font-normal">{a.quantidade}× </span>}
            {formataKg(a.peso)} kg
          </span>
        ))}
      </p>
      <p className="text-gray-300 text-sm">
        Carga total: <strong className="text-white">{formataKg(montagem.total)} kg</strong>
      </p>
    </div>
  );
}
