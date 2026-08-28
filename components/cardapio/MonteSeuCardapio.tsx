"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { PONTE, consomeNumero } from "@/lib/ferramentas/ponte";
import { KCAL_MIN, KCAL_MAX, PESO_MIN, PESO_MAX, normalizaNumero } from "@/lib/macros";
import {
  ALIMENTOS_CARDAPIO,
  ALIMENTO_CARDAPIO_POR_ID,
  RESTRICOES,
  nutrientes,
  permitido,
  rotuloPorcao,
  type Dieta,
  type Momento,
  type Restricao,
} from "@/lib/cardapio/alimentos";
import {
  AVISO_EDUCACIONAL,
  DIAS_SEMANA,
  KCAL_MIN_CARDAPIO,
  MENSAGEM_META_BAIXA,
  NOTA_TOLERANCIA,
  OBJETIVOS,
  ORIENTACAO_ESPECIAL,
  PERFIS_REFEICAO,
  REFEICOES_SUGERIDAS,
  SEM_ALTERNATIVA,
  SITUACOES_ESPECIAIS,
  alternativas,
  geraCardapio,
  geraSemana,
  listaDeCompras,
  porQueAssim,
  totalDia,
  totalRefeicao,
  type CardapioDia,
  type Objetivo,
  type PedidoCardapio,
  type Variedade,
} from "@/lib/cardapio/motor";

/**
 * Monte seu Cardápio — o componente.
 *
 * Wizard de uma decisão por tela, porque a ferramenta vive no celular: cada
 * etapa cabe numa tela de 360px sem rolar, com botões grandes e quase nada
 * digitável. A barra de progresso e o voltar existem porque abandono no
 * meio é o modo de falha número um de qualquer wizard.
 *
 * Toda a geração vem do motor determinístico em lib/cardapio — o componente
 * não sabe uma caloria. As respostas ficam no aparelho (localStorage,
 * declarado na tela, com botão de recomeçar); os eventos de analytics
 * registram funil, nunca resposta.
 */

const h = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;
const CHAVE = "montinho:cardapio:v1";

type Etapa =
  | "seguranca"
  | "objetivo"
  | "metas"
  | "refeicoes"
  | "dieta"
  | "restricoes"
  | "habituais"
  | "resultado";

const ORDEM: Etapa[] = ["seguranca", "objetivo", "metas", "refeicoes", "dieta", "restricoes", "habituais", "resultado"];

interface Estado {
  etapa: Etapa;
  situacoes: string[];
  objetivo: Objetivo | null;
  kcalTexto: string;
  pesoTexto: string;
  refeicoes: number | null;
  dieta: Dieta | null;
  restricoes: Restricao[];
  habituais: Partial<Record<Momento, string[]>>;
  /** Índice do momento sendo perguntado dentro da etapa "habituais". */
  momentoIdx: number;
}

const INICIAL: Estado = {
  etapa: "seguranca",
  situacoes: [],
  objetivo: null,
  kcalTexto: "",
  pesoTexto: "",
  refeicoes: null,
  dieta: null,
  restricoes: [],
  habituais: {},
  momentoIdx: 0,
};

export default function MonteSeuCardapio({ placement }: { placement: string }) {
  const [e, setE] = useState<Estado>(INICIAL);
  const [carregado, setCarregado] = useState(false);
  const [veioDeFora, setVeioDeFora] = useState(false);
  const [cardapio, setCardapio] = useState<CardapioDia | null>(null);
  const [trocando, setTrocando] = useState<string | null>(null);
  const [variedade, setVariedade] = useState<Variedade | null>(null);
  const [comprados, setComprados] = useState<string[]>([]);
  const [metodoAberto, setMetodoAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaComecou = useRef(false);

  /* Restaura respostas + consome a ponte (déficit/macros → cardápio). */
  useEffect(() => {
    let restaurado: Estado | null = null;
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) restaurado = { ...INICIAL, ...JSON.parse(bruto), etapa: JSON.parse(bruto).etapa ?? "seguranca" };
    } catch {
      /* storage bloqueado: começa do zero. */
    }
    const kcal = consomeNumero(PONTE.kcal, KCAL_MIN, KCAL_MAX);
    const peso = consomeNumero(PONTE.peso, PESO_MIN, PESO_MAX);
    if (kcal !== null || peso !== null) {
      restaurado = {
        ...(restaurado ?? INICIAL),
        kcalTexto: kcal !== null ? String(kcal) : (restaurado?.kcalTexto ?? ""),
        pesoTexto: peso !== null ? String(peso).replace(".", ",") : (restaurado?.pesoTexto ?? ""),
      };
      setVeioDeFora(true);
    }
    if (restaurado) setE(restaurado);
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(e));
    } catch {
      /* sem storage, segue na sessão. */
    }
  }, [e, carregado]);

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((x) => x.isIntersecting)) {
          trackOncePerSession("meal_planner_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const marcaInicio = () => {
    if (!jaComecou.current) {
      jaComecou.current = true;
      trackEvent("meal_planner_start", { placement });
    }
  };

  const kcal = useMemo(() => normalizaNumero(e.kcalTexto), [e.kcalTexto]);
  const peso = useMemo(() => normalizaNumero(e.pesoTexto), [e.pesoTexto]);
  const kcalOk = kcal !== null && kcal >= KCAL_MIN_CARDAPIO && kcal <= KCAL_MAX;
  const kcalBaixa = kcal !== null && kcal >= KCAL_MIN && kcal < KCAL_MIN_CARDAPIO;
  const pesoOk = peso !== null && peso >= PESO_MIN && peso <= PESO_MAX;

  const perfil = PERFIS_REFEICAO[e.refeicoes ?? REFEICOES_SUGERIDAS];
  /** Ceia não pergunta hábito — o motor resolve com lácteo/fruta. */
  const momentosPerguntaveis = perfil.map((p) => p.momento).filter((m) => m !== "ceia");

  const pedido: PedidoCardapio | null =
    kcalOk && pesoOk && e.objetivo && e.refeicoes && e.dieta
      ? {
          metaKcal: kcal!,
          pesoKg: peso!,
          objetivo: e.objetivo,
          refeicoes: e.refeicoes,
          dieta: e.dieta,
          restricoes: e.restricoes,
          habituais: e.habituais,
        }
      : null;

  function avanca(patch: Partial<Estado> = {}) {
    setE((atual) => {
      const novo = { ...atual, ...patch };
      const i = ORDEM.indexOf(novo.etapa);
      return { ...novo, etapa: ORDEM[Math.min(i + 1, ORDEM.length - 1)] };
    });
  }
  function volta() {
    setE((atual) => {
      if (atual.etapa === "habituais" && atual.momentoIdx > 0) {
        return { ...atual, momentoIdx: atual.momentoIdx - 1 };
      }
      const i = ORDEM.indexOf(atual.etapa);
      return { ...atual, etapa: ORDEM[Math.max(i - 1, 0)], momentoIdx: 0 };
    });
  }
  function recomeca() {
    setE(INICIAL);
    setCardapio(null);
    setVariedade(null);
    setComprados([]);
    try {
      localStorage.removeItem(CHAVE);
    } catch {
      /* sem storage, nada a apagar. */
    }
  }

  function gerar(p: PedidoCardapio) {
    setCardapio(geraCardapio(p));
    setVariedade(null);
    trackEvent("meal_plan_generated", { placement, objetivo: p.objetivo, refeicoes: String(p.refeicoes), dieta: p.dieta });
  }

  const semana = useMemo(
    () => (cardapio && pedido && variedade ? geraSemana(cardapio, pedido, variedade) : null),
    [cardapio, pedido, variedade]
  );
  const compras = useMemo(() => (semana ? listaDeCompras(semana) : null), [semana]);

  function copiaCardapio() {
    if (!cardapio) return;
    const t = totalDia(cardapio);
    const linhas = [
      "Meu cardápio sugerido — Montinho Personal",
      `≈ ${Math.round(t.kcal)} kcal · ${Math.round(t.prot)} g de proteína`,
      "",
      ...cardapio.refeicoes.flatMap((r) => [
        `${r.nome}:`,
        ...r.itens.map((it) => {
          const a = ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId)!;
          return `  - ${rotuloPorcao(a, it.porcoes)} de ${a.nome.toLowerCase()}`;
        }),
        "",
      ]),
      "Sugestão educacional — montinhopersonal.com.br/ferramentas/monte-seu-cardapio",
    ].join("\n");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(linhas).then(
        () => {
          trackEvent("meal_plan_saved", { placement });
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2000);
        },
        () => {}
      );
    }
  }

  const chip = (ativo: boolean) =>
    `px-4 py-3 text-sm font-medium border transition-colors min-h-[48px] ${
      ativo ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/40"
    }`;
  const botaoCard =
    "w-full text-left border border-white/20 hover:border-[#BA9E50] p-4 text-gray-200 transition-colors min-h-[56px]";
  const campo =
    "w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white text-2xl font-bold px-4 py-3 transition-colors min-h-[52px]";

  const progresso = (ORDEM.indexOf(e.etapa) / (ORDEM.length - 1)) * 100;
  const situacaoBloqueia = e.situacoes.length > 0 && !e.situacoes.includes("nenhuma");

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-5 sm:p-8 relative"
      data-testid="monte-seu-cardapio"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />

      {/* Progresso — some no resultado e na impressão */}
      {e.etapa !== "resultado" && (
        <div className="mb-6 print:hidden" aria-hidden="true">
          <div className="h-1 bg-white/10 overflow-hidden">
            <div className="h-full transition-all duration-300" style={{ width: `${progresso}%`, background: "#BA9E50" }} />
          </div>
        </div>
      )}

      {/* ── Etapas ─────────────────────────────────────────────────── */}
      {e.etapa === "seguranca" && (
        <div>
          <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
            Monte seu cardápio com o Montinho
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6 max-w-xl">
            Sua meta, sua rotina e os alimentos que você gosta viram uma
            sugestão de cardápio com porções e substituições. Antes, uma
            pergunta só:
          </p>
          <fieldset className="mb-5">
            <legend className="text-gray-300 text-sm font-medium mb-3">Alguma dessas situações se aplica a você?</legend>
            <div className="grid gap-2">
              {SITUACOES_ESPECIAIS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={e.situacoes.includes(s.id)}
                  onClick={() => {
                    marcaInicio();
                    setE((a) => ({
                      ...a,
                      situacoes: a.situacoes.includes(s.id)
                        ? a.situacoes.filter((x) => x !== s.id)
                        : [...a.situacoes.filter((x) => x !== "nenhuma"), s.id],
                    }));
                  }}
                  className={botaoCard + (e.situacoes.includes(s.id) ? " border-[#BA9E50] bg-[#BA9E50]/[0.06]" : "")}
                >
                  {e.situacoes.includes(s.id) && <Check />}
                  {s.rotulo}
                </button>
              ))}
              <button
                type="button"
                aria-pressed={e.situacoes.includes("nenhuma")}
                onClick={() => {
                  marcaInicio();
                  setE((a) => ({ ...a, situacoes: ["nenhuma"] }));
                }}
                className={botaoCard + (e.situacoes.includes("nenhuma") ? " border-[#BA9E50] bg-[#BA9E50]/[0.06]" : "")}
              >
                {e.situacoes.includes("nenhuma") && <Check />}
                Nenhuma dessas
              </button>
            </div>
          </fieldset>

          {situacaoBloqueia ? (
            <div className="border border-[#BA9E50]/40 bg-[#BA9E50]/[0.05] p-5">
              <p className="text-gray-200 leading-relaxed">{ORIENTACAO_ESPECIAL}</p>
            </div>
          ) : (
            <button
              type="button"
              disabled={e.situacoes.length === 0}
              onClick={() => avanca()}
              className="bg-white text-black px-8 py-3.5 font-semibold disabled:opacity-40 min-h-[52px] transition-opacity"
            >
              Começar meu cardápio
            </button>
          )}
        </div>
      )}

      {e.etapa === "objetivo" && (
        <Tela titulo="Qual é seu principal objetivo agora?" onVolta={volta}>
          <div className="grid gap-2">
            {OBJETIVOS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  trackEvent("meal_planner_goal_selected", { placement, objetivo: o.id });
                  avanca({ objetivo: o.id });
                }}
                className={botaoCard}
              >
                {o.rotulo}
              </button>
            ))}
          </div>
        </Tela>
      )}

      {e.etapa === "metas" && (
        <Tela titulo="Sua meta de calorias e seu peso" onVolta={volta}>
          {veioDeFora && (
            <p className="text-gray-400 text-sm mb-4 border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}>
              Dados trazidos da sua calculadora. Pode alterar à vontade.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 mb-2">
            <div>
              <label htmlFor={`ck-${placement}`} className="block text-gray-300 text-sm font-medium mb-2">
                Calorias por dia <span className="text-gray-500 font-normal">(kcal)</span>
              </label>
              <input
                id={`ck-${placement}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="2100"
                value={e.kcalTexto}
                onChange={(ev) => {
                  setE((a) => ({ ...a, kcalTexto: ev.target.value }));
                  setVeioDeFora(false);
                }}
                aria-invalid={e.kcalTexto.trim() !== "" && !kcalOk}
                className={campo}
              />
            </div>
            <div>
              <label htmlFor={`cp-${placement}`} className="block text-gray-300 text-sm font-medium mb-2">
                Seu peso <span className="text-gray-500 font-normal">(kg)</span>
              </label>
              <input
                id={`cp-${placement}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="80"
                value={e.pesoTexto}
                onChange={(ev) => setE((a) => ({ ...a, pesoTexto: ev.target.value }))}
                aria-invalid={e.pesoTexto.trim() !== "" && !pesoOk}
                className={campo}
              />
            </div>
          </div>
          <p className="text-sm min-h-[20px] mb-2 text-[#E8B4B4]">
            {e.kcalTexto.trim() !== "" && !kcalOk && !kcalBaixa ? "Confira as calorias informadas. " : ""}
            {e.pesoTexto.trim() !== "" && !pesoOk ? "Confira o peso informado." : ""}
          </p>
          {kcalBaixa && (
            <p className="text-gray-200 text-sm leading-relaxed border border-white/20 p-4 mb-4">{MENSAGEM_META_BAIXA}</p>
          )}
          <p className="text-gray-400 text-sm mb-5">
            Ainda não sabe suas calorias?{" "}
            <Link
              href="/ferramentas/calculadora-deficit-calorico"
              className="text-gray-300 underline underline-offset-4 decoration-1 hover:text-white transition-colors"
              style={{ textDecorationColor: "#BA9E50" }}
            >
              Calcular meu déficit →
            </Link>
          </p>
          <button
            type="button"
            disabled={!kcalOk || !pesoOk}
            onClick={() => avanca()}
            className="bg-white text-black px-8 py-3.5 font-semibold disabled:opacity-40 min-h-[52px]"
          >
            Continuar
          </button>
        </Tela>
      )}

      {e.etapa === "refeicoes" && (
        <Tela titulo="Quantas refeições você prefere fazer por dia?" onVolta={volta}>
          <p className="text-gray-400 text-sm mb-4 max-w-xl leading-relaxed">
            Não existe número certo — mais refeições não aceleram nada. A
            escolha serve para o cardápio caber na sua rotina.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => avanca({ refeicoes: n })} className={botaoCard}>
                {n} refeições
              </button>
            ))}
            <button type="button" onClick={() => avanca({ refeicoes: REFEICOES_SUGERIDAS })} className={botaoCard}>
              Não sei — me sugere
              <span className="block text-gray-500 text-xs mt-0.5">vamos de {REFEICOES_SUGERIDAS}, o arranjo mais comum</span>
            </button>
          </div>
        </Tela>
      )}

      {e.etapa === "dieta" && (
        <Tela titulo="Como é sua alimentação?" onVolta={volta}>
          <div className="grid gap-2">
            {(
              [
                ["onivoro", "Como de tudo"],
                ["vegetariano", "Vegetariana"],
                ["vegano", "Vegana"],
              ] as [Dieta, string][]
            ).map(([id, rotulo]) => (
              <button key={id} type="button" onClick={() => avanca({ dieta: id })} className={botaoCard}>
                {rotulo}
              </button>
            ))}
          </div>
        </Tela>
      )}

      {e.etapa === "restricoes" && (
        <Tela titulo="Tem algum alimento ou grupo que você evita?" onVolta={volta}>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed max-w-xl">
            Preferência vale tanto quanto restrição — se não desce, não entra.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {RESTRICOES.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={e.restricoes.includes(r.id)}
                onClick={() =>
                  setE((a) => ({
                    ...a,
                    restricoes: a.restricoes.includes(r.id)
                      ? a.restricoes.filter((x) => x !== r.id)
                      : [...a.restricoes, r.id],
                  }))
                }
                className={chip(e.restricoes.includes(r.id))}
              >
                {e.restricoes.includes(r.id) && <Check />}
                {r.rotulo}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              trackEvent("meal_planner_preferences_complete", { placement });
              avanca({ momentoIdx: 0 });
            }}
            className="bg-white text-black px-8 py-3.5 font-semibold min-h-[52px]"
          >
            {e.restricoes.length === 0 ? "Nenhuma — continuar" : "Continuar"}
          </button>
        </Tela>
      )}

      {e.etapa === "habituais" && pedido === null && (
        /* Alguém pulou etapa por estado restaurado incompleto: volta ao começo. */
        <div>
          <p className="text-gray-300 mb-4">Faltou alguma resposta no caminho. Vamos retomar rapidinho.</p>
          <button type="button" onClick={() => setE((a) => ({ ...a, etapa: "objetivo" }))} className={chip(false)}>
            Voltar às perguntas
          </button>
        </div>
      )}

      {e.etapa === "habituais" && pedido !== null && (
        <Tela
          titulo={`O que você costuma comer no ${perfil.find((p) => p.momento === momentosPerguntaveis[e.momentoIdx])?.nome.toLowerCase() ?? ""}?`}
          onVolta={volta}
        >
          <p className="text-gray-400 text-sm mb-4 max-w-xl leading-relaxed">
            Marque o que já faz parte da sua rotina — o cardápio prioriza
            esses. Pode pular se preferir uma sugestão do zero.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {ALIMENTOS_CARDAPIO.filter(
              (a) => a.momentos.includes(momentosPerguntaveis[e.momentoIdx]) && permitido(a, pedido.dieta, pedido.restricoes)
            ).map((a) => {
              const momento = momentosPerguntaveis[e.momentoIdx];
              const marcados = e.habituais[momento] ?? [];
              const on = marcados.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    setE((atual) => ({
                      ...atual,
                      habituais: {
                        ...atual.habituais,
                        [momento]: on ? marcados.filter((x) => x !== a.id) : [...marcados, a.id],
                      },
                    }))
                  }
                  className={chip(on)}
                >
                  {on && <Check />}
                  {a.nome}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              if (e.momentoIdx < momentosPerguntaveis.length - 1) {
                setE((a) => ({ ...a, momentoIdx: a.momentoIdx + 1 }));
              } else {
                avanca();
                gerar(pedido);
              }
            }}
            className="bg-white text-black px-8 py-3.5 font-semibold min-h-[52px]"
          >
            {e.momentoIdx < momentosPerguntaveis.length - 1 ? "Próxima refeição" : "Montar meu cardápio"}
          </button>
        </Tela>
      )}

      {/* ── Resultado ──────────────────────────────────────────────── */}
      {e.etapa === "resultado" && cardapio && pedido && (
        <div aria-live="polite">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2 print:hidden" style={{ color: "#BA9E50" }}>
            Pronto. Seu cardápio ganhou um chalalá.
          </p>
          <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-5" style={h}>
            Seu cardápio sugerido
          </h2>

          {/* Painel de metas */}
          <ResumoDia cardapio={cardapio} />

          {/* Refeições */}
          <div className="space-y-4 mt-6">
            {cardapio.refeicoes.map((r, ri) => {
              const t = totalRefeicao(r);
              return (
                <div key={r.momento} className="border border-white/15 p-5">
                  <div className="flex items-baseline justify-between gap-3 mb-3">
                    <h3 className="text-white font-bold text-lg" style={h}>
                      {r.nome}
                    </h3>
                    <p className="text-gray-400 text-sm whitespace-nowrap">
                      ≈ {Math.round(t.kcal)} kcal · {Math.round(t.prot)} g prot.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {r.itens.map((it) => {
                      const a = ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId)!;
                      const chaveTroca = `${ri}-${it.alimentoId}`;
                      const alts =
                        trocando === chaveTroca
                          ? alternativas(it, r.momento, pedido, r.itens.map((x) => x.alimentoId))
                          : [];
                      return (
                        <li key={it.alimentoId}>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-200 text-sm">
                              {rotuloPorcao(a, it.porcoes)} de <strong className="text-white font-medium">{a.nome.toLowerCase()}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (trocando !== chaveTroca) trackEvent("meal_swap_clicked", { placement });
                                setTrocando(trocando === chaveTroca ? null : chaveTroca);
                              }}
                              aria-expanded={trocando === chaveTroca}
                              className="text-gray-400 hover:text-white text-xs underline underline-offset-2 whitespace-nowrap min-h-[44px] print:hidden"
                            >
                              trocar
                            </button>
                          </div>
                          {trocando === chaveTroca && (
                            <div className="mt-2 pl-3 border-l-2 print:hidden" style={{ borderColor: "#BA9E50" }}>
                              {alts.length === 0 ? (
                                <p className="text-gray-400 text-sm py-2">{SEM_ALTERNATIVA}</p>
                              ) : (
                                <ul className="space-y-1 py-1">
                                  {alts.map(({ alimento, porcoes }) => (
                                    <li key={alimento.id}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCardapio((c) => {
                                            if (!c) return c;
                                            const novo = structuredClone(c);
                                            const item = novo.refeicoes[ri].itens.find((x) => x.alimentoId === it.alimentoId);
                                            if (item) {
                                              item.alimentoId = alimento.id;
                                              item.porcoes = porcoes;
                                            }
                                            return novo;
                                          });
                                          setTrocando(null);
                                          setVariedade(null);
                                          trackEvent("meal_swapped", { placement });
                                        }}
                                        className="text-gray-300 hover:text-white text-sm py-1.5 min-h-[40px] text-left"
                                      >
                                        → {rotuloPorcao(alimento, porcoes)} de {alimento.nome.toLowerCase()}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mt-4 max-w-2xl">{NOTA_TOLERANCIA}</p>

          {/* Por que assim */}
          <div className="border-l-2 pl-4 mt-6" style={{ borderColor: "#BA9E50" }}>
            <p className="text-white text-sm font-semibold mb-1">Por que montei seu cardápio assim?</p>
            <p className="text-gray-300 text-sm leading-relaxed">{porQueAssim(pedido)}</p>
          </div>

          {/* Semana */}
          <div className="border-t border-white/10 mt-7 pt-6 print:hidden">
            <h3 className="text-white font-bold text-lg mb-1" style={h}>
              Quer montar sua semana?
            </h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed max-w-xl">
              Quanto você gosta de variar? Repetir não é defeito — cardápio que
              repete é cardápio que dá para cozinhar.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {(
                [
                  ["repetir", "Prefiro repetir"],
                  ["um-pouco", "Um pouco de variedade"],
                  ["bastante", "Bastante variedade"],
                ] as [Variedade, string][]
              ).map(([id, rotulo]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={variedade === id}
                  onClick={() => {
                    setVariedade(id);
                    trackEvent("weekly_plan_generated", { placement, variedade: id });
                  }}
                  className={chip(variedade === id)}
                >
                  {variedade === id && <Check />}
                  {rotulo}
                </button>
              ))}
            </div>

            {semana && (
              <div className="space-y-2">
                {DIAS_SEMANA.map((dia, i) => {
                  const igualAnterior = i > 0 && semana[i] === semana[i - 1];
                  return (
                    <details key={dia} className="border border-white/10">
                      <summary className="cursor-pointer px-4 py-3 text-gray-200 text-sm min-h-[44px] flex items-center justify-between">
                        <span className="font-medium">{dia}</span>
                        <span className="text-gray-500 text-xs">
                          {igualAnterior ? "igual ao dia anterior" : `≈ ${Math.round(totalDia(semana[i]).kcal)} kcal`}
                        </span>
                      </summary>
                      <div className="px-4 pb-3 space-y-1">
                        {semana[i].refeicoes.map((r) => (
                          <p key={r.momento} className="text-gray-400 text-sm">
                            <span className="text-gray-300">{r.nome}:</span>{" "}
                            {r.itens
                              .map((it) => {
                                const a = ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId)!;
                                return `${rotuloPorcao(a, it.porcoes)} de ${a.nome.toLowerCase()}`;
                              })
                              .join(", ")}
                          </p>
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lista de compras */}
          {compras && (
            <div className="border-t border-white/10 mt-7 pt-6">
              <h3 className="text-white font-bold text-lg mb-4" style={h}>
                Sua lista de compras da semana
              </h3>
              {[...new Set(compras.map((c) => c.categoria))].map((cat) => (
                <div key={cat} className="mb-4">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#BA9E50" }}>
                    {cat}
                  </p>
                  <ul className="space-y-1">
                    {compras
                      .filter((c) => c.categoria === cat)
                      .map((c) => (
                        <li key={c.alimentoId}>
                          <button
                            type="button"
                            aria-pressed={comprados.includes(c.alimentoId)}
                            onClick={() => {
                              if (comprados.length === 0) trackEvent("shopping_list_generated", { placement });
                              setComprados((x) =>
                                x.includes(c.alimentoId) ? x.filter((y) => y !== c.alimentoId) : [...x, c.alimentoId]
                              );
                            }}
                            className={`text-sm min-h-[40px] text-left flex items-center gap-2 ${
                              comprados.includes(c.alimentoId) ? "text-gray-500 line-through" : "text-gray-300"
                            }`}
                          >
                            <span aria-hidden="true">{comprados.includes(c.alimentoId) ? "☑" : "☐"}</span>
                            {c.nome} — {c.quantidade}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-wrap items-center gap-3 border-t border-white/10 mt-7 pt-5 print:hidden">
            <button type="button" onClick={copiaCardapio} className={chip(false)}>
              {copiado ? "Copiado" : "Copiar cardápio"}
            </button>
            <button
              type="button"
              onClick={() => {
                trackEvent("meal_plan_saved", { placement, formato: "impressao" });
                window.print();
              }}
              className={chip(false)}
            >
              Imprimir / salvar PDF
            </button>
            <button type="button" onClick={() => gerar(pedido)} className={chip(false)}>
              Gerar outra versão
            </button>
            <button type="button" onClick={recomeca} className={chip(false)}>
              Recomeçar do zero
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-2 print:hidden">Suas respostas ficam salvas neste dispositivo, no seu navegador.</p>

          {/* Metodologia */}
          <div className="border-t border-white/10 mt-6 pt-5 print:hidden">
            <button
              type="button"
              onClick={() => {
                if (!metodoAberto) trackEvent("meal_methodology_open", { placement });
                setMetodoAberto(!metodoAberto);
              }}
              aria-expanded={metodoAberto}
              className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px] text-left"
              style={{ textDecorationColor: "#BA9E50" }}
            >
              Como fazemos os cálculos?
            </button>
            {metodoAberto && (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-300 max-w-2xl">
                <p>
                  A distribuição de macros usa exatamente a mesma cascata da{" "}
                  <Link href="/ferramentas/calculadora-macros" className="underline underline-offset-2 hover:text-white">
                    Calculadora de Macros
                  </Link>{" "}
                  — proteína por peso corporal primeiro, gordura como fração da
                  energia, carboidrato com o restante. Os valores dos alimentos
                  vêm da TACO 4ª ed. (NEPA/Unicamp), com o estado (cru, cozido,
                  grelhado) declarado em cada item, e industrializados usam
                  valor típico de rótulo.
                </p>
                <p>
                  As porções são caseiras de propósito: o motor só trabalha em
                  múltiplos de 1 ovo, 1 fatia, 1 concha — nunca "137 g de
                  banana" — e aceita uma diferença de até 8% da meta, que é
                  menor que a variação de quem pesa tudo. Substituições trocam
                  dentro do mesmo grupo com a porção recalculada pelas
                  calorias, não pelo peso.
                </p>
                <p className="text-gray-400">
                  Nada aqui é gerado por inteligência artificial em tempo real:
                  as mesmas respostas produzem sempre o mesmo cardápio, e cada
                  regra pode ser auditada. Última revisão dos dados: agosto de
                  2026.
                </p>
              </div>
            )}
          </div>

          {/* Artigos contextuais */}
          <div className="border-t border-white/10 mt-6 pt-5 print:hidden">
            <p className="text-white text-sm font-semibold mb-3">Talvez isso também ajude você</p>
            <ul className="space-y-2">
              {ARTIGOS_POR_OBJETIVO[pedido.objetivo].map((art) => (
                <li key={art.href}>
                  <Link
                    href={art.href}
                    onClick={() => trackEvent("meal_article_click", { placement })}
                    className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors"
                    style={{ textDecorationColor: "#BA9E50" }}
                  >
                    {art.titulo} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA — depois de todo o valor */}
          <div className="border-t border-white/10 mt-6 pt-5 print:hidden">
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              O cardápio organiza a alimentação. O treino precisa acompanhar o
              seu objetivo também.{" "}
              <Link
                href="/consultoria"
                onClick={() => trackEvent("meal_cta_click", { placement })}
                className="text-gray-300 underline underline-offset-2 decoration-1 hover:text-white transition-colors"
              >
                Conheça o acompanhamento do Montinho
              </Link>
              .
            </p>
          </div>
        </div>
      )}

      <p className="text-gray-500 text-xs leading-relaxed mt-6 pt-5 border-t border-white/10 max-w-3xl">
        {AVISO_EDUCACIONAL}
      </p>
    </div>
  );
}

/** Casca comum das telas do wizard: título + voltar. */
function Tela({ titulo, onVolta, children }: { titulo: string; onVolta: () => void; children: React.ReactNode }) {
  return (
    <div>
      <button
        type="button"
        onClick={onVolta}
        className="text-gray-500 hover:text-gray-300 text-sm mb-4 min-h-[44px] transition-colors"
      >
        ← Voltar
      </button>
      <h2 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-5" style={h}>
        {titulo}
      </h2>
      {children}
    </div>
  );
}

function Check() {
  return (
    <span aria-hidden="true" style={{ color: "#BA9E50" }}>
      ✓{" "}
    </span>
  );
}

/** Painel de metas × previsto. Verde/vermelho de propósito NÃO: diferença pequena é normal. */
function ResumoDia({ cardapio }: { cardapio: CardapioDia }) {
  const t = totalDia(cardapio);
  const linhas: [string, number, number, string][] = [
    ["Calorias", t.kcal, cardapio.metaKcal, "kcal"],
    ["Proteína", t.prot, cardapio.metaProt, "g"],
    ["Carboidratos", t.carb, cardapio.metaCarb, "g"],
    ["Gorduras", t.gord, cardapio.metaGord, "g"],
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {linhas.map(([nome, previsto, meta, un]) => (
        <div key={nome} className="border border-white/15 p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1.5">{nome}</p>
          <p className="text-white font-bold text-2xl leading-none" style={h}>
            {Math.round(previsto)}
            <span className="text-sm font-normal text-gray-400"> {un}</span>
          </p>
          {meta > 0 && <p className="text-gray-500 text-xs mt-1">meta ≈ {Math.round(meta)} {un}</p>}
        </div>
      ))}
    </div>
  );
}

/**
 * Artigos por objetivo — todos slugs reais do acervo, conferidos no build
 * pelo teste. O roteamento por resposta é o "SEO interno": quem quer
 * emagrecer sai daqui para o cluster de déficit, não para uma lista genérica.
 */
export const ARTIGOS_POR_OBJETIVO: Record<Objetivo, { href: string; titulo: string }[]> = {
  emagrecer: [
    { href: "/blog/deficit-calorico-como-calcular", titulo: "Déficit calórico: o que é e como calcular" },
    { href: "/blog/cardapio-semanal-emagrecer-com-musculo", titulo: "Cardápio semanal para emagrecer sem perder músculo" },
    { href: "/blog/como-emagrecer-sem-passar-fome-vida-social", titulo: "Como emagrecer sem passar fome tendo vida social" },
  ],
  manter: [
    { href: "/blog/como-contar-calorias", titulo: "Como contar calorias sem enlouquecer" },
    { href: "/blog/dieta-flexivel-iifym", titulo: "Dieta flexível (IIFYM): como funciona" },
  ],
  ganhar: [
    { href: "/blog/calorias-para-ganhar-massa-muscular", titulo: "Quantas calorias para ganhar massa muscular" },
    { href: "/blog/quanta-proteina-por-dia-para-ganhar-massa-muscular", titulo: "Quanta proteína por dia para ganhar massa" },
    { href: "/blog/cardapio-semanal-ganho-de-massa-muscular", titulo: "Cardápio semanal para ganho de massa" },
  ],
  organizar: [
    { href: "/blog/dieta-flexivel-iifym", titulo: "Dieta flexível (IIFYM): como funciona" },
    { href: "/blog/alimentos-ricos-em-proteina", titulo: "Alimentos ricos em proteína: lista completa" },
    { href: "/blog/ultraprocessados-e-emagrecimento", titulo: "Ultraprocessados: por que dificultam seu objetivo" },
  ],
};
