"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ancoraNoTopo } from "@/lib/ferramentas/ancora";
import {
  AVISO_HISTORICO,
  anterior,
  leHistorico,
  salvaAvaliacao,
} from "@/lib/mobilidade/historico";
import {
  CONVITE_RETESTE,
  REGIOES,
  SEMANAS_ATE_RETESTE,
  adiadas,
  comparaRegiao,
  geraProtocolo,
  montaMapa,
  priorizar,
  selecionaTestes,
} from "@/lib/mobilidade/motor";
import { NOTA_FOAM_ROLLER } from "@/lib/mobilidade/exercicios";
import {
  DIFICULDADES,
  NOME_REGIAO,
  TELA_AGACHAMENTO,
  TESTE_POR_ID,
} from "@/lib/mobilidade/testes";
import {
  AVISO_DURANTE,
  BLOQUEIO,
  ITENS_TRIAGEM,
  temBandeira,
} from "@/lib/mobilidade/triagem";
import {
  LIMITE_DO_TESTE,
  NAO_PRECISA_DOER,
  NAO_PREVINE_LESAO,
} from "@/lib/mobilidade/evidencia";
import type {
  Contexto,
  Estado,
  ExercicioMobilidade,
  Lado,
  Mapa,
  Momento,
  Resposta,
  Unidade,
} from "@/lib/mobilidade/tipos";

/**
 * Destrave Seu Corpo — o teste de mobilidade.
 *
 * Feita para ser usada de pé, no meio da sala, com o celular numa das mãos e a
 * outra encostada na parede. Isso dita quase tudo: uma tarefa por tela, botões
 * grandes o bastante para o polegar, texto curto o suficiente para ser lido de
 * relance entre uma repetição e outra, e nenhuma etapa que exija duas mãos.
 *
 * A ordem das telas também é uma decisão de produto. A triagem vem antes de
 * qualquer pergunta sobre treino porque, se houver bandeira, nada do resto
 * deveria acontecer. E o resultado aparece INTEIRO antes de qualquer pedido de
 * contato — o valor vem primeiro, sempre.
 *
 * O que não existe aqui de propósito: nota de 0 a 100. Cinco testes ordinais
 * não somam num índice com significado, e o número que sairia seria justamente
 * o que a pessoa trataria como nota clínica.
 */

type Fase =
  | "inicio"
  | "triagem"
  | "bloqueio"
  | "contexto"
  | "tela"
  | "teste"
  | "resultado"
  | "protocolo";

const h = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;
const sans = { fontFamily: "var(--font-inter), sans-serif" } as const;

const COR: Record<Estado, string> = {
  boa: "#6FA86B",
  melhorar: "#C9A227",
  prioridade: "#D08A3E",
  naoAvaliado: "#4A4A4E",
};
const ROTULO: Record<Estado, string> = {
  boa: "Boa mobilidade",
  melhorar: "Pode melhorar",
  prioridade: "Prioridade",
  naoAvaliado: "Não avaliado",
};

/**
 * Onde cada região fica na silhueta.
 *
 * As regiões pares recebem DOIS pontos, um sobre cada membro. Não é enfeite:
 * com um ponto só, centralizado, o marcador do tornozelo caía no vazio entre
 * as duas pernas e era lido como se estivesse na altura da coxa. Marcar os
 * dois lados coloca cada ponto sobre o traço certo e ainda diz a verdade — os
 * testes de perna são bilaterais.
 */
const POSICAO: Record<string, { x: number; y: number }[]> = {
  ombro: [{ x: 37, y: 25 }, { x: 63, y: 25 }],
  toracica: [{ x: 50, y: 38 }],
  quadril: [{ x: 50, y: 56 }],
  posterior: [{ x: 44.5, y: 71 }, { x: 55.5, y: 71 }],
  tornozelo: [{ x: 38.5, y: 96 }, { x: 61.5, y: 96 }],
};

const btn =
  "w-full text-left px-5 py-4 min-h-[56px] border transition-colors text-[15px] leading-snug";
const btnOff = "border-white/20 text-gray-200 hover:border-white/50 hover:bg-white/[0.04]";
const btnOn = "border-[#BA9E50] bg-[#BA9E50]/10 text-white";
const primario =
  "inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-4 min-h-[54px] text-[15px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed";

export default function TesteMobilidade() {
  const [fase, setFase] = useState<Fase>("inicio");
  const [triagem, setTriagem] = useState<string[]>([]);
  const [dificuldades, setDificuldades] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState<string[]>([]);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [indice, setIndice] = useState(0);
  const [unidade, setUnidade] = useState<Unidade>("cm");
  const [momento, setMomento] = useState<Momento>("pre");
  const [minutos, setMinutos] = useState<3 | 6 | 10>(6);
  const [diasDeTreino, setDiasDeTreino] = useState(3);
  const [salvo, setSalvo] = useState(false);
  const [temHistorico, setTemHistorico] = useState(false);
  const topo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackOncePerSession("mobility_tool_view");
    setTemHistorico(leHistorico().length > 0);
  }, []);

  useEffect(() => {
    ancoraNoTopo(topo.current);
  }, [fase, indice]);

  /**
   * As observações do agachamento são ids ("calcanhar"); o motor pensa em
   * regiões. A tradução mora aqui, no limite entre a tela e o motor, para o
   * registro de TELA_AGACHAMENTO continuar sendo a única fonte do que cada
   * observação direciona.
   */
  const regioesDaTela = useMemo(
    () =>
      TELA_AGACHAMENTO.observacoes
        .filter((o) => observacoes.includes(o.id))
        .flatMap((o) => o.direciona),
    [observacoes],
  );

  const selecionados = useMemo(
    () => selecionaTestes(dificuldades, regioesDaTela),
    [dificuldades, regioesDaTela],
  );
  const testeAtual = TESTE_POR_ID[selecionados[indice]];

  const contexto: Contexto = useMemo(
    () => ({
      frequencia: "3-4",
      objetivo: "hipertrofia",
      dificuldades,
      rigidez: [],
      momento,
      minutos,
      diasDeTreino,
    }),
    [dificuldades, momento, minutos, diasDeTreino],
  );

  const mapa: Mapa = useMemo(() => montaMapa(respostas), [respostas]);
  const prioridades = useMemo(() => priorizar(mapa, contexto), [mapa, contexto]);
  const adiar = useMemo(() => adiadas(mapa, prioridades), [mapa, prioridades]);
  const protocolo = useMemo(
    () => geraProtocolo(prioridades, contexto),
    [prioridades, contexto],
  );

  const comparacoes = useMemo(() => {
    if (!salvo) return [];
    const ant = anterior();
    if (!ant) return [];
    return REGIOES.filter(
      (r) => mapa[r].estado !== "naoAvaliado" && ant.mapa[r]?.estado !== "naoAvaliado",
    ).map((r) => comparaRegiao(ant.mapa[r], mapa[r]));
  }, [salvo, mapa]);

  // ── ações ────────────────────────────────────────────────────────────────
  function alterna(lista: string[], set: (v: string[]) => void, id: string, exclusivo?: string) {
    if (exclusivo && id === exclusivo) return set([id]);
    const sem = lista.filter((x) => x !== exclusivo);
    set(sem.includes(id) ? sem.filter((x) => x !== id) : [...sem, id]);
  }

  function responde(lado: Lado, valor: number | "naoConsegui") {
    setRespostas((rs) => {
      const outras = rs.filter((r) => r.testeId !== testeAtual.id);
      const atual = rs.find((r) => r.testeId === testeAtual.id) ?? { testeId: testeAtual.id };
      return [...outras, { ...atual, [lado]: valor }];
    });
  }

  function medida(lado: Lado, valor: number | undefined) {
    setRespostas((rs) => {
      const outras = rs.filter((r) => r.testeId !== testeAtual.id);
      const atual = rs.find((r) => r.testeId === testeAtual.id) ?? { testeId: testeAtual.id };
      const chave = lado === "D" ? "medidaD" : "medidaE";
      return [...outras, { ...atual, [chave]: valor, unidade }];
    });
  }

  const respostaAtual = respostas.find((r) => r.testeId === testeAtual?.id);
  const completouTeste = testeAtual
    ? testeAtual.medivel
      ? respostaAtual?.medidaD !== undefined &&
        (!testeAtual.bilateral || respostaAtual?.medidaE !== undefined)
      : respostaAtual?.D !== undefined &&
        (!testeAtual.bilateral || respostaAtual?.E !== undefined)
    : false;

  function avanca() {
    if (indice + 1 < selecionados.length) return setIndice(indice + 1);
    trackEvent("mobility_test_complete", { testes: selecionados.length });
    trackEvent("mobility_result_view");
    setFase("resultado");
  }

  function recomeca() {
    trackEvent("mobility_restart");
    setTriagem([]); setDificuldades([]); setObservacoes([]);
    setRespostas([]); setIndice(0); setSalvo(false);
    setFase("inicio");
  }

  function salva() {
    salvaAvaliacao(mapa, prioridades.map((p) => p.regiao));
    setSalvo(true);
    setTemHistorico(true);
    trackEvent("mobility_save");
  }

  const msgWhats = protocolo
    ? `Oi Montinho! Fiz o teste de mobilidade no seu site. Minha prioridade deu ${
        NOME_REGIAO[prioridades[0]?.regiao] ?? "—"
      }${prioridades[1] ? ` e ${NOME_REGIAO[prioridades[1].regiao]}` : ""}. Queria sua ajuda para encaixar isso no meu treino.`
    : "Oi Montinho! Fiz o teste de mobilidade no seu site e queria sua ajuda.";

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <div ref={topo} className="scroll-mt-24">
      <div className="border border-white/15 bg-[#0d0d0d]">
        {/* progresso */}
        {fase === "teste" && (
          <div className="px-5 sm:px-7 pt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] tracking-[0.18em] uppercase" style={{ ...sans, color: "#BA9E50" }}>
                Teste {indice + 1} de {selecionados.length}
              </p>
              <button
                onClick={() => (indice === 0 ? setFase("tela") : setIndice(indice - 1))}
                className="text-gray-400 text-sm hover:text-white transition-colors min-h-[44px] px-2"
              >
                ← Voltar
              </button>
            </div>
            <div className="h-[3px] bg-white/10" role="progressbar"
              aria-valuenow={indice + 1} aria-valuemin={1} aria-valuemax={selecionados.length}>
              <div className="h-full transition-all duration-300"
                style={{ width: `${((indice + 1) / selecionados.length) * 100}%`, background: "#BA9E50" }} />
            </div>
          </div>
        )}

        <div className="p-5 sm:p-7">
          {/* ── INÍCIO ──────────────────────────────────────────────── */}
          {fase === "inicio" && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={h}>
                Vamos ver o que pode estar limitando os seus exercícios
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Cinco minutos, cinco testes simples. No fim você recebe um mapa
                das suas regiões e um protocolo de dois ou três exercícios — não
                doze. {NAO_PRECISA_DOER}
              </p>
              <div className="border-l-2 border-[#BA9E50] pl-4 mb-6">
                <p className="text-gray-400 text-sm leading-relaxed">
                  <strong className="text-white">O que você vai precisar:</strong> uma
                  parede, uma cadeira e um espaço no chão. Uma fita métrica ajuda
                  em um dos testes — se não tiver, dá para medir com os dedos.
                </p>
              </div>
              <button
                onClick={() => { trackEvent("mobility_start"); setFase("triagem"); }}
                className={primario}
              >
                Começar o teste <span aria-hidden="true">→</span>
              </button>
              {temHistorico && (
                <p className="text-gray-500 text-sm mt-4">
                  Você já fez este teste antes neste aparelho. Refazendo, eu
                  comparo com a última vez.
                </p>
              )}
              <p className="text-gray-500 text-xs leading-relaxed mt-6">{LIMITE_DO_TESTE}</p>
            </div>
          )}

          {/* ── TRIAGEM ─────────────────────────────────────────────── */}
          {fase === "triagem" && (
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase mb-3" style={{ ...sans, color: "#BA9E50" }}>
                Antes de tudo
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2" style={h}>
                Alguma dessas situações é a sua hoje?
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                Pergunto porque um teste online não serve para investigar
                qualquer coisa. Marque tudo que se aplica.
              </p>
              <div className="flex flex-col gap-2 mb-6">
                {ITENS_TRIAGEM.map((it) => {
                  const on = triagem.includes(it.id);
                  return (
                    <button key={it.id}
                      onClick={() => alterna(triagem, setTriagem, it.id, "nenhum")}
                      aria-pressed={on}
                      className={`${btn} ${on ? btnOn : btnOff}`}>
                      <span className="flex items-start gap-3">
                        <span aria-hidden="true"
                          className={`mt-[3px] w-4 h-4 flex-none border ${on ? "bg-[#BA9E50] border-[#BA9E50]" : "border-white/40"}`} />
                        <span>
                          {it.rotulo}
                          {it.ajuda && <span className="block text-gray-500 text-[13px] mt-1">{it.ajuda}</span>}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                disabled={triagem.length === 0}
                onClick={() => {
                  if (temBandeira(triagem)) {
                    trackEvent("mobility_screening_block");
                    return setFase("bloqueio");
                  }
                  setFase("contexto");
                }}
                className={primario}
              >
                Continuar <span aria-hidden="true">→</span>
              </button>
            </div>
          )}

          {/* ── BLOQUEIO ────────────────────────────────────────────── */}
          {fase === "bloqueio" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-3" style={h}>{BLOQUEIO.titulo}</h2>
              <p className="text-gray-300 leading-relaxed mb-3">{BLOQUEIO.corpo}</p>
              <p className="text-gray-300 leading-relaxed mb-6">{BLOQUEIO.encaminhamento}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={getWhatsAppUrl("Oi Montinho! Fiz o teste de mobilidade e apareceu um sinal de atenção. Queria conversar.")}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => trackEvent("mobility_whatsapp", { origem: "bloqueio" })}
                  className={primario}>
                  Conversar comigo
                </a>
                <button onClick={() => setFase("triagem")}
                  className="px-6 py-4 min-h-[54px] border border-white/25 text-gray-200 text-[15px] hover:border-white/50 transition-colors">
                  Voltar e corrigir
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-5">{BLOQUEIO.saida}</p>
            </div>
          )}

          {/* ── CONTEXTO ────────────────────────────────────────────── */}
          {fase === "contexto" && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2" style={h}>
                Onde você sente mais dificuldade?
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                Pode marcar mais de um. Isso define quais testes eu vou te
                mostrar — ninguém precisa fazer os cinco.
              </p>
              <div className="flex flex-col gap-2 mb-6">
                {DIFICULDADES.map((d) => {
                  const on = dificuldades.includes(d.id);
                  return (
                    <button key={d.id}
                      onClick={() => alterna(dificuldades, setDificuldades, d.id, "nenhuma")}
                      aria-pressed={on}
                      className={`${btn} ${on ? btnOn : btnOff}`}>
                      {d.rotulo}
                    </button>
                  );
                })}
              </div>
              <button disabled={dificuldades.length === 0}
                onClick={() => {
                  trackEvent(
                    dificuldades.includes("nenhuma") ? "mobility_full_test" : "mobility_quick_test",
                  );
                  setFase("tela");
                }}
                className={primario}>
                Continuar <span aria-hidden="true">→</span>
              </button>
            </div>
          )}

          {/* ── TELA DO AGACHAMENTO ─────────────────────────────────── */}
          {fase === "tela" && (
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase mb-3" style={{ ...sans, color: "#BA9E50" }}>
                Um movimento só
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2" style={h}>
                {TELA_AGACHAMENTO.nome}
              </h2>
              <p className="text-gray-400 text-sm mb-4">{TELA_AGACHAMENTO.chamada}</p>
              <div className="border border-white/10 bg-black/40 p-4 mb-5 text-sm leading-relaxed">
                <p className="text-gray-300 mb-2">
                  <strong className="text-white">Posição:</strong> {TELA_AGACHAMENTO.posicaoInicial}
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">Movimento:</strong> {TELA_AGACHAMENTO.movimento}
                </p>
              </div>
              <p className="text-gray-300 text-sm mb-3">{TELA_AGACHAMENTO.criterio}</p>
              <div className="flex flex-col gap-2 mb-6">
                {TELA_AGACHAMENTO.observacoes.map((o) => {
                  const on = observacoes.includes(o.id);
                  return (
                    <button key={o.id}
                      onClick={() =>
                        setObservacoes((prev) => {
                          /* "consegui sem dificuldade" é exclusiva: se ela vale,
                             nenhuma outra vale. */
                          if (o.id === "tranquilo") return on ? [] : ["tranquilo"];
                          const sem = prev.filter((x) => x !== "tranquilo");
                          return on ? sem.filter((x) => x !== o.id) : [...sem, o.id];
                        })
                      }
                      aria-pressed={on}
                      className={`${btn} ${on ? btnOn : btnOff}`}>
                      {o.rotulo}
                    </button>
                  );
                })}
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-5">{AVISO_DURANTE}</p>
              <button onClick={() => setFase("teste")} className={primario}>
                Ir para os testes <span aria-hidden="true">→</span>
              </button>
            </div>
          )}

          {/* ── TESTES ──────────────────────────────────────────────── */}
          {fase === "teste" && testeAtual && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2" style={h}>
                {testeAtual.nome}
              </h2>
              <p className="text-gray-400 text-sm mb-5">{testeAtual.porqueImporta}</p>

              {/* espaço reservado para o vídeo do Montinho (v2) */}
              <div className="border border-white/10 bg-black/40 p-4 mb-5 text-sm leading-relaxed flex flex-col gap-2">
                <p className="text-gray-300">
                  <strong className="text-white">Posição:</strong> {testeAtual.posicaoInicial}
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">Movimento:</strong> {testeAtual.movimento}
                </p>
                <p className="text-gray-400">
                  <strong className="text-[#BA9E50]">Erro comum:</strong> {testeAtual.erroComum}
                </p>
              </div>

              <p className="text-white font-semibold text-[15px] mb-4">{testeAtual.criterio}</p>

              {testeAtual.medivel ? (
                <div className="mb-6">
                  <div className="flex gap-2 mb-4" role="group" aria-label="Como você vai medir">
                    {(["cm", "dedos"] as const).map((u) => (
                      <button key={u} onClick={() => setUnidade(u)} aria-pressed={unidade === u}
                        className={`flex-1 px-4 py-3 min-h-[48px] border text-sm transition-colors ${
                          unidade === u ? btnOn : btnOff
                        }`}>
                        {u === "cm" ? "Tenho fita métrica" : "Vou medir com os dedos"}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
                    {unidade === "cm"
                      ? "Meça em centímetros do dedão até a parede. É a medida com valores de referência publicados."
                      : "Encaixe os dedos deitados entre o dedão e a parede e conte quantos cabem. É aproximado — use sempre a mesma régua quando for refazer o teste."}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {(["D", "E"] as const).map((lado) => (
                      <label key={lado} className="block">
                        <span className="block text-gray-400 text-[13px] mb-2">
                          {lado === "D" ? "Lado direito" : "Lado esquerdo"}
                        </span>
                        <span className="flex items-center border border-white/25 focus-within:border-[#BA9E50]">
                          <input type="number" inputMode="decimal" min={0}
                            max={unidade === "cm" ? 30 : 12} step={unidade === "cm" ? 0.5 : 1}
                            value={(lado === "D" ? respostaAtual?.medidaD : respostaAtual?.medidaE) ?? ""}
                            onChange={(e) =>
                              medida(lado, e.target.value === "" ? undefined : Number(e.target.value))
                            }
                            className="w-full bg-transparent text-white text-2xl font-bold px-4 py-3 outline-none"
                            style={sans} />
                          <span className="text-gray-500 text-sm pr-4">{unidade}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5 mb-6">
                  {(testeAtual.bilateral ? (["D", "E"] as const) : (["D"] as const)).map((lado) => (
                    <div key={lado}>
                      {testeAtual.bilateral && (
                        <p className="text-gray-400 text-[13px] mb-2">
                          {lado === "D" ? "Girando / subindo para a direita" : "Para a esquerda"}
                        </p>
                      )}
                      <div className="flex flex-col gap-2">
                        {testeAtual.opcoes.map((o, i) => (
                          <button key={i} onClick={() => responde(lado, i)}
                            aria-pressed={respostaAtual?.[lado] === i}
                            className={`${btn} ${respostaAtual?.[lado] === i ? btnOn : btnOff}`}>
                            {o.rotulo}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <button disabled={!completouTeste} onClick={avanca} className={primario}>
                  {indice + 1 < selecionados.length ? "Próximo teste" : "Ver meu mapa"}
                  <span aria-hidden="true">→</span>
                </button>
                <button
                  onClick={() => {
                    responde("D", "naoConsegui");
                    if (testeAtual.bilateral) responde("E", "naoConsegui");
                    avanca();
                  }}
                  className="text-gray-400 text-sm underline underline-offset-4 hover:text-white transition-colors min-h-[44px]">
                  Não consigo avaliar este
                </button>
              </div>
            </div>
          )}

          {/* ── RESULTADO ───────────────────────────────────────────── */}
          {fase === "resultado" && (
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase mb-3" style={{ ...sans, color: "#BA9E50" }}>
                Seu mapa de mobilidade
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6" style={h}>
                {prioridades.length === 0
                  ? "Nenhuma região pediu prioridade"
                  : `Sua prioridade é ${NOME_REGIAO[prioridades[0].regiao].toLowerCase()}`}
              </h2>

              <div className="grid sm:grid-cols-[150px_1fr] gap-6 mb-7">
                <MapaCorpo mapa={mapa} />
                <ul className="flex flex-col gap-2.5">
                  {REGIOES.map((r) => (
                    <li key={r} className="flex items-center justify-between gap-3 border-b border-white/10 pb-2.5">
                      <span className="text-gray-200 text-[15px]">{NOME_REGIAO[r]}</span>
                      <span className="flex items-center gap-2 flex-none">
                        <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full"
                          style={{ background: COR[mapa[r].estado] }} />
                        <span className="text-[12px] tracking-wide" style={{ ...sans, color: COR[mapa[r].estado] }}>
                          {ROTULO[mapa[r].estado]}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {REGIOES.some((r) => mapa[r].assimetria) && (
                <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-white/20 pl-4 mb-6">
                  Apareceu diferença marcada entre os lados em{" "}
                  {REGIOES.filter((r) => mapa[r].assimetria).map((r) => NOME_REGIAO[r].toLowerCase()).join(" e ")}.
                  Pequenas diferenças entre os lados são comuns e não significam
                  problema — o protocolo simplesmente trabalha os dois.
                </p>
              )}

              {prioridades.map((p, i) => (
                <div key={p.regiao} className="border border-white/15 p-5 mb-3">
                  <p className="text-[11px] tracking-[0.16em] uppercase mb-1.5" style={{ ...sans, color: COR[p.estado] }}>
                    {i === 0 ? "Prioridade principal" : "Prioridade secundária"}
                  </p>
                  <h3 className="text-white font-bold text-lg mb-2" style={h}>{NOME_REGIAO[p.regiao]}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Escolhi esta região porque {p.motivo}.
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    <strong className="text-[#BA9E50]">Pode influenciar:</strong>{" "}
                    {p.influencia.join(", ")}. Isso não quer dizer que ela seja a
                    causa da sua dificuldade — quer dizer que vale trabalhar.
                  </p>
                </div>
              ))}

              {adiar.length > 0 && (
                <p className="text-gray-400 text-sm mb-6">
                  <strong className="text-white">Vamos cuidar depois:</strong>{" "}
                  {adiar.map((r) => NOME_REGIAO[r].toLowerCase()).join(", ")}. Uma
                  coisa de cada vez funciona melhor do que tudo ao mesmo tempo.
                </p>
              )}

              {comparacoes.length > 0 && (
                <div className="border border-[#BA9E50]/40 bg-[#BA9E50]/[0.05] p-5 mb-6">
                  <h3 className="text-white font-bold mb-3" style={h}>Comparando com a última vez</h3>
                  <ul className="flex flex-col gap-2">
                    {comparacoes.map((c) => (
                      <li key={c.regiao} className="text-gray-300 text-sm">{c.frase}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-gray-500 text-xs leading-relaxed mb-5">{NAO_PREVINE_LESAO}</p>

              <button onClick={() => { trackEvent("mobility_protocol_generated"); setFase("protocolo"); }}
                className={primario}>
                Montar meu protocolo <span aria-hidden="true">→</span>
              </button>
            </div>
          )}

          {/* ── PROTOCOLO ───────────────────────────────────────────── */}
          {fase === "protocolo" && (
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase mb-3" style={{ ...sans, color: "#BA9E50" }}>
                Seu protocolo
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5" style={h}>
                Menos exercícios. Mais consistência.
              </h2>

              <fieldset className="mb-5">
                <legend className="text-gray-400 text-[13px] mb-2">Quando fica mais fácil fazer?</legend>
                <div className="flex gap-2">
                  {([["pre", "Antes do treino"], ["isolada", "Em outro momento"]] as const).map(([v, r]) => (
                    <button key={v} onClick={() => setMomento(v)} aria-pressed={momento === v}
                      className={`flex-1 px-4 py-3 min-h-[48px] border text-sm transition-colors ${momento === v ? btnOn : btnOff}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mb-6">
                <legend className="text-gray-400 text-[13px] mb-2">Quanto tempo você tem?</legend>
                <div className="flex gap-2">
                  {([3, 6, 10] as const).map((m) => (
                    <button key={m}
                      onClick={() => { setMinutos(m); trackEvent("mobility_protocol_duration", { minutos: m }); }}
                      aria-pressed={minutos === m}
                      className={`flex-1 px-3 py-3 min-h-[48px] border text-sm transition-colors ${minutos === m ? btnOn : btnOff}`}>
                      {m} min{m === 6 && <span className="block text-[11px] text-[#BA9E50]">recomendado</span>}
                    </button>
                  ))}
                </div>
              </fieldset>

              {protocolo && (
                <>
                  <Bloco titulo={protocolo.a.titulo} freq={protocolo.a.frequencia} itens={protocolo.a.itens} />
                  {protocolo.b && (
                    <Bloco titulo={protocolo.b.titulo} freq={protocolo.b.frequencia} itens={protocolo.b.itens} />
                  )}

                  <div className="border border-white/15 p-5 mb-4">
                    <p className="text-[11px] tracking-[0.16em] uppercase mb-2" style={{ ...sans, color: "#BA9E50" }}>
                      Seu plano, escrito
                    </p>
                    <p className="text-white text-[15px] leading-relaxed">
                      {momento === "pre"
                        ? `Antes do treino, ${protocolo.a.frequencia}× por semana → ${minutos} minutos.`
                        : `${protocolo.a.frequencia}× por semana, no momento que você escolher → ${minutos} minutos.`}{" "}
                      Próxima avaliação em {SEMANAS_ATE_RETESTE} semanas.
                    </p>
                  </div>

                  <div className="border border-white/15 p-5 mb-5">
                    <p className="text-white font-semibold mb-1">Sem tempo hoje?</p>
                    <p className="text-gray-400 text-sm mb-3">
                      Faça só <strong className="text-white">{protocolo.planoB.exercicio.nome}</strong> —{" "}
                      {protocolo.planoB.dose}. Melhor manter o hábito vivo do que
                      perder o dia inteiro.
                    </p>
                    <button onClick={() => trackEvent("mobility_plan_b")}
                      className="text-[#BA9E50] text-sm underline underline-offset-4 min-h-[44px]">
                      Versão de 2 minutos
                    </button>
                  </div>

                  <p className="text-gray-500 text-xs leading-relaxed mb-6">{NOTA_FOAM_ROLLER}</p>

                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <a href={getWhatsAppUrl(msgWhats)} target="_blank" rel="noopener noreferrer"
                      onClick={() => trackEvent("mobility_whatsapp", { origem: "protocolo" })}
                      className={primario}>
                      Receber no WhatsApp
                    </a>
                    <button onClick={salva} disabled={salvo}
                      className="px-6 py-4 min-h-[54px] border border-white/25 text-gray-200 text-[15px] hover:border-white/50 transition-colors disabled:opacity-40">
                      {salvo ? "Resultado salvo ✓" : "Salvar meu resultado"}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-6">{AVISO_HISTORICO}</p>

                  <div className="border-t border-white/10 pt-5">
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      <strong className="text-white">Em {SEMANAS_ATE_RETESTE} semanas:</strong> {CONVITE_RETESTE}
                    </p>
                    <button onClick={recomeca}
                      className="text-gray-400 text-sm underline underline-offset-4 hover:text-white transition-colors min-h-[44px]">
                      Refazer o teste do zero
                    </button>
                  </div>
                </>
              )}

              {!protocolo && (
                <div>
                  <p className="text-gray-300 leading-relaxed mb-3">
                    Nenhuma região apareceu como prioridade. Isso significa que,
                    nos testes que você fez, a amplitude já dá conta dos padrões
                    de musculação avaliados — não que você precise virar
                    contorcionista.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-5">
                    Continue treinando em boa amplitude: o próprio treino de
                    força mantém isso. Se quiser, refaça o teste completo.
                  </p>
                  <button onClick={recomeca} className={primario}>Refazer o teste</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {(fase === "resultado" || fase === "protocolo") && (
        <p className="text-gray-500 text-xs leading-relaxed mt-4">
          {LIMITE_DO_TESTE}{" "}
          <Link href="/ferramentas/teste-mobilidade#metodologia" className="underline underline-offset-2 hover:text-gray-300">
            Como este teste funciona
          </Link>
          .
        </p>
      )}
    </div>
  );
}

/** A silhueta. Simples de propósito: ela orienta, não ilustra anatomia. */
function MapaCorpo({ mapa }: { mapa: Mapa }) {
  return (
    <svg viewBox="0 0 100 110" className="w-full max-w-[150px] mx-auto sm:mx-0" role="img"
      aria-label="Mapa das regiões avaliadas. Os estados de cada região estão listados ao lado em texto.">
      <g fill="none" stroke="#3A3A3E" strokeWidth="1.4" strokeLinecap="round">
        <circle cx="50" cy="10" r="6.5" />
        <path d="M50 17 L50 58" />
        <path d="M34 26 L50 22 L66 26" />
        <path d="M34 26 L30 44" /><path d="M66 26 L70 44" />
        <path d="M50 58 L40 82 L38 100" /><path d="M50 58 L60 82 L62 100" />
      </g>
      {Object.entries(POSICAO).flatMap(([regiao, pontos]) => {
        const estado = mapa[regiao as keyof Mapa]?.estado ?? "naoAvaliado";
        return pontos.map((p, i) => (
          <circle key={`${regiao}-${i}`} cx={p.x} cy={p.y} r={pontos.length > 1 ? 4.2 : 5.2}
            fill={COR[estado]}
            fillOpacity={estado === "naoAvaliado" ? 0.35 : 0.95}
            stroke="#0d0d0d" strokeWidth="1.4" />
        ));
      })}
    </svg>
  );
}

function Bloco({ titulo, freq, itens }: {
  titulo: string; freq: number; itens: { exercicio: ExercicioMobilidade; dose: string }[];
}) {
  const [aberto, setAberto] = useState<string | null>(null);
  return (
    <div className="border border-white/15 p-5 mb-3">
      <div className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-3 mb-4">
        <h3 className="text-white font-bold text-[17px]" style={h}>{titulo}</h3>
        <span className="text-[#BA9E50] text-[12px] flex-none" style={sans}>{freq}× / semana</span>
      </div>
      <ol className="flex flex-col gap-4">
        {itens.map(({ exercicio, dose }, i) => (
          <li key={exercicio.id}>
            <p className="text-white font-semibold text-[15px] mb-1">
              {i + 1}. {exercicio.nome}
            </p>
            <p className="text-[#BA9E50] text-sm mb-2" style={sans}>{dose}</p>
            {/* Lista de definições, e não parágrafos: são três fatos rotulados
                sobre o mesmo exercício, lidos de relance no meio da série. O
                <dl> é o HTML correto para isso e mantém o card compacto no
                celular — prosa aqui pediria um respiro que empurraria o
                exercício seguinte para fora da tela. */}
            <dl className="text-sm leading-relaxed">
              <dt className="sr-only">Como fazer</dt>
              <dd className="text-gray-300 ml-0">
                <strong className="text-white">Como:</strong> {exercicio.como}
              </dd>
              <dt className="sr-only">Onde você deve sentir</dt>
              <dd className="text-gray-400 ml-0">
                <strong className="text-gray-300">Você deve sentir:</strong> {exercicio.senteOnde}
              </dd>
              <dt className="sr-only">O que evitar</dt>
              <dd className="text-gray-400 ml-0">
                <strong className="text-gray-300">Evite:</strong> {exercicio.evite}
              </dd>
            </dl>
            <button onClick={() => setAberto(aberto === exercicio.id ? null : exercicio.id)}
              aria-expanded={aberto === exercicio.id}
              className="text-gray-400 text-[13px] underline underline-offset-4 hover:text-white transition-colors mt-2 min-h-[44px]">
              Por que estou fazendo isso?
            </button>
            {aberto === exercicio.id && (
              <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-[#BA9E50] pl-4 mt-1">
                {exercicio.porque}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
