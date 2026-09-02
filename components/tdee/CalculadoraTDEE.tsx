"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import PosResultado from "@/components/ferramentas/PosResultado";
import { PONTE, guarda } from "@/lib/ferramentas/ponte";
import { guardaKcalParaMacros, guardaPesoParaProteina } from "@/lib/macros";
import {
  ALTURA_MAX,
  ALTURA_MIN,
  DICA_ATIVIDADE,
  NARRATIVA_GANHO,
  SUPERAVIT_MAX,
  SUPERAVIT_MIN,
  faixaGanho,
  DISCLAIMER,
  DISCLAIMER_ESPECIAL,
  EXPLICA_MANUTENCAO,
  EXPLICA_TDEE,
  EXPLICA_TMB,
  IDADE_ADULTA,
  IDADE_MAX,
  IDADE_MIN,
  NIVEIS,
  NOTA_ATIVIDADE_AMPLA,
  NOTA_BMR_RMR,
  NOTA_NAO_E_MEDICAO,
  NOTA_NAO_E_PRESCRICAO,
  NOTA_SEM_DUPLA_CONTAGEM,
  ORIENTACAO_MENOR_IDADE,
  PESO_MAX,
  PESO_MIN,
  REFERENCIA_TMB,
  ZERO_STATE,
  type Sexo,
  arredondaKcal,
  calculaTDEE,
  calculaTMB,
  comparaAtividades,
  formataFaixa,
  normalizaAltura,
  normalizaIdade,
  normalizaNumero,
} from "@/lib/tdee";

/**
 * Calculadora de TMB e Gasto Calórico (TDEE).
 *
 * A pergunta que ela responde é uma só: "quantas calorias eu gasto por
 * dia?". O produto não é o número — é a pessoa entender a cadeia corpo em
 * repouso → rotina → gasto diário, e saber qual é o próximo passo. Por isso
 * o TDEE domina visualmente, a TMB é coadjuvante, e a comparação entre
 * níveis de atividade é clicável: ver o gasto mudar ao trocar o nível
 * ensina mais que qualquer parágrafo.
 *
 * Toda a matemática vem de lib/calorias via lib/tdee — a MESMA conta da
 * Calculadora de Déficit, com o mesmo arredondamento de dezena. Cálculo
 * 100% no navegador; peso, altura, idade e sexo nunca saem daqui, e os
 * eventos de analytics registram uso, jamais valores.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

const SEXOS: { id: Sexo; rotulo: string }[] = [
  { id: "masculino", rotulo: "Masculino" },
  { id: "feminino", rotulo: "Feminino" },
  { id: "nao_informado", rotulo: "Prefiro não informar" },
];

export default function CalculadoraTDEE({
  placement,
}: {
  /** Onde o componente está — segmenta os eventos, nunca carrega os dados. */
  placement: string;
}) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [alturaTexto, setAlturaTexto] = useState("");
  const [idadeTexto, setIdadeTexto] = useState("");
  const [sexo, setSexo] = useState<Sexo | null>(null);
  const [nivelId, setNivelId] = useState<string | null>(null);
  const [ajudaAberta, setAjudaAberta] = useState(false);
  const [metodoAberto, setMetodoAberto] = useState(false);
  const [ganhoAberto, setGanhoAberto] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaCompletou = useRef(false);

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((x) => x.isIntersecting)) {
          trackOncePerSession("tdee_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const peso = useMemo(() => normalizaNumero(pesoTexto), [pesoTexto]);
  const altura = useMemo(() => normalizaAltura(alturaTexto), [alturaTexto]);
  const idade = useMemo(() => normalizaIdade(idadeTexto), [idadeTexto]);

  const pesoOk = peso !== null && peso >= PESO_MIN && peso <= PESO_MAX;
  const alturaOk = altura !== null && altura >= ALTURA_MIN && altura <= ALTURA_MAX;
  const idadeOk = idade !== null && idade >= IDADE_MIN && idade <= IDADE_MAX;
  const menorDeIdade = idadeOk && idade! < IDADE_ADULTA;

  const nivel = NIVEIS.find((n) => n.id === nivelId) ?? null;
  const completo = pesoOk && alturaOk && idadeOk && sexo !== null && nivel !== null && !menorDeIdade;

  const tmb = completo ? calculaTMB(peso!, altura!, idade!, sexo!) : null;
  const tdee = tmb && nivel ? calculaTDEE(tmb, nivel.fator) : null;

  useEffect(() => {
    if (completo && !jaCompletou.current) {
      jaCompletou.current = true;
      /** Só o fato de completar — nenhum dado corporal, nenhum resultado. */
      trackEvent("tdee_calculator_complete", { placement });
    }
  }, [completo, placement]);

  const campo =
    "w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white text-xl font-bold px-4 py-3 transition-colors min-h-[48px]";
  const rotulo = "block text-gray-300 text-sm font-medium mb-2";
  const erro = "text-[#E8B4B4] text-sm mt-1.5 min-h-[20px]";
  const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-tdee"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />

      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · seus dados não saem do navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
        Calculadora de TMB e Gasto Calórico
      </h2>
      <p className="text-gray-300 leading-relaxed mb-7 max-w-xl">
        Estime quantas calorias seu corpo utiliza em repouso e aproximadamente
        quanto você gasta ao longo do dia.
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* ── Formulário ─────────────────────────────────────────────── */}
        <div>
          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 mb-6">
            <div>
              <label htmlFor={`tdee-peso-${placement}`} className={rotulo}>
                Peso <span className="text-gray-500 font-normal">(kg)</span>
              </label>
              <input
                id={`tdee-peso-${placement}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="80"
                value={pesoTexto}
                onChange={(e) => setPesoTexto(e.target.value)}
                aria-invalid={pesoTexto.trim() !== "" && !pesoOk}
                aria-describedby={`tdee-peso-erro-${placement}`}
                className={campo}
              />
              <p id={`tdee-peso-erro-${placement}`} className={erro}>
                {pesoTexto.trim() !== "" && !pesoOk ? "Confira o peso informado." : ""}
              </p>
            </div>

            <div>
              <label htmlFor={`tdee-altura-${placement}`} className={rotulo}>
                Altura <span className="text-gray-500 font-normal">(cm)</span>
              </label>
              <input
                id={`tdee-altura-${placement}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="175"
                value={alturaTexto}
                onChange={(e) => setAlturaTexto(e.target.value)}
                aria-invalid={alturaTexto.trim() !== "" && !alturaOk}
                aria-describedby={`tdee-altura-erro-${placement}`}
                className={campo}
              />
              <p id={`tdee-altura-erro-${placement}`} className={erro}>
                {alturaTexto.trim() !== "" && !alturaOk ? "Confira sua altura." : ""}
              </p>
            </div>

            <div>
              <label htmlFor={`tdee-idade-${placement}`} className={rotulo}>
                Idade <span className="text-gray-500 font-normal">(anos)</span>
              </label>
              <input
                id={`tdee-idade-${placement}`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="35"
                value={idadeTexto}
                onChange={(e) => setIdadeTexto(e.target.value)}
                aria-invalid={idadeTexto.trim() !== "" && !idadeOk}
                aria-describedby={`tdee-idade-erro-${placement}`}
                className={campo}
              />
              <p id={`tdee-idade-erro-${placement}`} className={erro}>
                {idadeTexto.trim() !== "" && !idadeOk ? "Informe sua idade." : ""}
              </p>
            </div>
          </div>

          <fieldset className="mb-6">
            <legend className={rotulo}>Sexo usado pela equação</legend>
            <div className="flex flex-wrap gap-2">
              {SEXOS.map((s) => (
                <label
                  key={s.id}
                  className={`cursor-pointer px-4 py-2.5 text-sm font-medium border transition-colors min-h-[44px] flex items-center focus-within:ring-1 focus-within:ring-[#BA9E50] ${
                    sexo === s.id
                      ? "border-[#BA9E50] text-white bg-[#BA9E50]/10"
                      : "border-white/20 text-gray-300 hover:border-white/40"
                  }`}
                >
                  <input
                    type="radio"
                    name={`tdee-sexo-${placement}`}
                    value={s.id}
                    checked={sexo === s.id}
                    onChange={() => setSexo(s.id)}
                    className="sr-only"
                  />
                  {s.rotulo}
                </label>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              A equação tem constantes diferentes para homens e mulheres. Sem
              essa informação o resultado vira uma faixa, mais ampla.
            </p>
          </fieldset>

          <fieldset className="mb-4">
            <legend className={rotulo}>Nível de atividade</legend>
            <div className="grid gap-2">
              {NIVEIS.map((n) => (
                <label
                  key={n.id}
                  className={`cursor-pointer border p-4 transition-colors focus-within:ring-1 focus-within:ring-[#BA9E50] ${
                    nivelId === n.id ? "border-[#BA9E50] bg-[#BA9E50]/[0.08]" : "border-white/15 hover:border-white/35"
                  }`}
                >
                  <input
                    type="radio"
                    name={`tdee-nivel-${placement}`}
                    value={n.id}
                    checked={nivelId === n.id}
                    onChange={() => {
                      if (nivelId !== null && nivelId !== n.id) trackEvent("tdee_activity_change", { placement });
                      setNivelId(n.id);
                    }}
                    className="sr-only"
                  />
                  <span className="flex items-baseline justify-between gap-3 mb-1">
                    <span className="text-white font-semibold text-[15px]">
                      {nivelId === n.id && (
                        <span aria-hidden="true" style={{ color: "#BA9E50" }}>
                          ✓{" "}
                        </span>
                      )}
                      {n.titulo}
                    </span>
                    <span className="text-gray-500 text-xs whitespace-nowrap">×{String(n.fator).replace(".", ",")}</span>
                  </span>
                  <span className="block text-gray-400 text-sm leading-relaxed">{n.descricao}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={() => setAjudaAberta(!ajudaAberta)}
            aria-expanded={ajudaAberta}
            className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px] text-left"
          >
            Como escolher meu nível?
          </button>
          {ajudaAberta && (
            <div className="mt-2 border border-white/15 p-4 text-sm text-gray-300 leading-relaxed space-y-3">
              <p>
                O nível de atividade considera seu dia inteiro, não apenas o
                treino. Uma pessoa pode treinar todos os dias e ainda passar a
                maior parte do restante do dia sentada.
              </p>
              <p>{DICA_ATIVIDADE}</p>
              <p>{NOTA_SEM_DUPLA_CONTAGEM}</p>
            </div>
          )}
        </div>

        {/* ── Resultado ──────────────────────────────────────────────── */}
        <div aria-live="polite">
          {menorDeIdade ? (
            <div className="border border-[#BA9E50]/40 bg-[#BA9E50]/[0.05] p-5">
              <p className="text-gray-200 leading-relaxed">{ORIENTACAO_MENOR_IDADE}</p>
            </div>
          ) : !completo || !tmb || !tdee || !nivel ? (
            <div className="border border-white/15 border-dashed p-6 h-full flex items-center justify-center min-h-[220px]">
              <p className="text-gray-400 leading-relaxed text-center max-w-sm">{ZERO_STATE}</p>
            </div>
          ) : (
            <div>
              {/**
               * A cadeia visual repouso → rotina → gasto. O TDEE é o número
               * grande porque é o que a pessoa veio buscar; a TMB aparece
               * primeiro porque é de onde a conta parte.
               */}
              <div className="border border-white/15 p-5 mb-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1.5">Seu corpo em repouso · TMB estimada</p>
                <p className="text-white font-bold text-3xl leading-none mb-2" style={h}>
                  {formataFaixa(tmb)} <span className="text-base font-normal text-gray-400">kcal/dia</span>
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">{EXPLICA_TMB}</p>
              </div>

              <p className="text-gray-400 text-sm text-center py-1" aria-hidden="true">
                × {String(nivel.fator).replace(".", ",")} <span className="text-gray-500">(sua rotina: {nivel.titulo.toLowerCase()})</span>
              </p>

              <div className="border border-[#BA9E50]/50 bg-[#BA9E50]/[0.06] p-6 mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#BA9E50" }}>
                  Seu gasto energético diário estimado
                </p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none mb-3" style={h}>
                  ≈ {formataFaixa(tdee)} <span className="text-lg font-normal text-gray-300">kcal/dia</span>
                </p>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{EXPLICA_TDEE}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{EXPLICA_MANUTENCAO}</p>
              </div>

              {/* Comparação: o mesmo corpo nos cinco níveis, clicável. */}
              <details className="border border-white/15 mb-4 group">
                <summary className="cursor-pointer p-4 text-white text-sm font-semibold list-none flex justify-between items-center min-h-[48px]">
                  Veja como a atividade muda a estimativa
                  <span className="text-gray-500 group-open:rotate-180 transition-transform" aria-hidden="true">
                    ▾
                  </span>
                </summary>
                <div className="px-4 pb-4">
                  <div className="grid gap-1.5" role="list">
                    {comparaAtividades(tmb).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        role="listitem"
                        aria-pressed={c.id === nivel.id}
                        onClick={() => {
                          if (c.id !== nivel.id) {
                            trackEvent("tdee_activity_change", { placement });
                            setNivelId(c.id);
                          }
                        }}
                        className={`flex justify-between items-baseline gap-3 px-3 py-2.5 border text-sm transition-colors min-h-[44px] ${
                          c.id === nivel.id
                            ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white"
                            : "border-white/10 text-gray-300 hover:border-white/30"
                        }`}
                      >
                        <span>
                          {c.id === nivel.id && (
                            <span aria-hidden="true" style={{ color: "#BA9E50" }}>
                              ✓{" "}
                            </span>
                          )}
                          {c.titulo}
                        </span>
                        <span className="font-semibold whitespace-nowrap">≈ {formataFaixa(c.tdee)} kcal</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mt-3">
                    A escolha do nível mexe em centenas de kcal — por isso vale
                    escolher pelo que sua rotina É, não pelo número que você
                    gostaria de ver.
                  </p>
                </div>
              </details>

              <p className="text-gray-400 text-sm leading-relaxed mb-3">{NOTA_NAO_E_MEDICAO}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{NOTA_NAO_E_PRESCRICAO}</p>

              {/* ── E agora? ───────────────────────────────────────── */}
              <div className="border-t border-white/10 pt-5">
                <p className="text-white font-semibold mb-3" style={h}>
                  O que você quer fazer agora?
                </p>
                <div className="grid gap-2">
                  <Link
                    href="/ferramentas/calculadora-deficit-calorico"
                    onClick={() => {
                      trackEvent("tdee_deficit_click", { placement });
                      /**
                       * A travessia leva os DADOS, não o número pronto: o
                       * déficit refaz a mesma conta determinística e chega
                       * no mesmo gasto — com o "como calculamos" dele
                       * inteiro verdadeiro. Só grava aqui, no clique.
                       */
                      guarda(
                        PONTE.dados,
                        JSON.stringify({ peso, altura, idade, sexo, nivel: nivel.id })
                      );
                    }}
                    className="border border-white/25 hover:border-[#BA9E50] text-gray-200 px-4 py-3 text-sm font-medium transition-colors min-h-[48px] flex items-center justify-between"
                  >
                    <span>Quero emagrecer — calcular meu déficit</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href="/ferramentas/calculadora-macros"
                    onClick={() => {
                      trackEvent("tdee_macros_click", { placement, objetivo: "manter" });
                      /** Manutenção: o gasto vira a meta que os macros distribuem. */
                      guardaKcalParaMacros(arredondaKcal(tdee.min));
                    }}
                    className="border border-white/25 hover:border-[#BA9E50] text-gray-200 px-4 py-3 text-sm font-medium transition-colors min-h-[48px] flex items-center justify-between"
                  >
                    <span>Quero manter — distribuir em macros</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                  <button
                    type="button"
                    aria-expanded={ganhoAberto}
                    onClick={() => {
                      if (!ganhoAberto) trackEvent("tdee_gain_open", { placement });
                      setGanhoAberto(!ganhoAberto);
                    }}
                    className={`border px-4 py-3 text-sm font-medium transition-colors min-h-[48px] flex items-center justify-between text-left ${
                      ganhoAberto ? "border-[#BA9E50] text-white bg-[#BA9E50]/[0.06]" : "border-white/25 hover:border-[#BA9E50] text-gray-200"
                    }`}
                  >
                    <span>Quero ganhar massa magra — planejar o superávit</span>
                    <span aria-hidden="true">{ganhoAberto ? "▾" : "→"}</span>
                  </button>
                </div>

                {/**
                 * A narrativa de ganho: a mesma faixa de superávit que o
                 * acervo ensina (200–400 kcal), aplicada ao gasto DESTA
                 * pessoa. Nada aqui prescreve — mostra a referência, explica
                 * o porquê do "moderado" e entrega os próximos passos com o
                 * número já carregado.
                 */}
                {ganhoAberto && (
                  <div className="border border-[#BA9E50]/40 bg-[#BA9E50]/[0.05] p-5 mt-2">
                    <p className="text-gray-200 text-sm leading-relaxed mb-3">{NARRATIVA_GANHO}</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-1">
                      Superávit moderado: {SUPERAVIT_MIN} a {SUPERAVIT_MAX} kcal acima do gasto — a mesma
                      referência dos artigos do site. Para o seu gasto estimado, isso significa comer
                    </p>
                    <p className="text-white font-bold text-2xl mb-3" style={h}>
                      ≈ {formataFaixa(faixaGanho(tdee))} <span className="text-sm font-normal text-gray-300">kcal/dia</span>
                    </p>
                    <div className="grid gap-2 mb-3">
                      <Link
                        href="/ferramentas/calculadora-macros"
                        onClick={() => {
                          trackEvent("tdee_macros_click", { placement, objetivo: "ganhar" });
                          /**
                           * Parte do começo conservador da faixa (+200): em
                           * superávit, errar para menos custa semanas; errar
                           * para mais custa gordura. Editável nos macros.
                           */
                          guardaKcalParaMacros(arredondaKcal(tdee.min + SUPERAVIT_MIN));
                        }}
                        className="border border-white/25 hover:border-[#BA9E50] text-gray-200 px-4 py-3 text-sm font-medium transition-colors min-h-[48px] flex items-center justify-between"
                      >
                        <span>Distribuir essa meta em macros</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                      <Link
                        href="/ferramentas/monte-seu-cardapio"
                        onClick={() => {
                          trackEvent("tdee_macros_click", { placement, objetivo: "ganhar-cardapio" });
                          guardaKcalParaMacros(arredondaKcal(tdee.min + SUPERAVIT_MIN));
                          if (peso !== null) guardaPesoParaProteina(peso);
                        }}
                        className="border border-white/25 hover:border-[#BA9E50] text-gray-200 px-4 py-3 text-sm font-medium transition-colors min-h-[48px] flex items-center justify-between"
                      >
                        <span>Transformar em cardápio de ganho (FitChef)</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed mb-3">
                      A meta parte do começo da faixa (+{SUPERAVIT_MIN} kcal) e pode ser ajustada na próxima
                      ferramenta. Para entender o superávit em detalhe,{" "}
                      <Link
                        href="/blog/calorias-para-ganhar-massa-muscular"
                        onClick={() => trackEvent("tdee_article_click", { placement })}
                        className={ln}
                      >
                        quantas calorias para ganhar massa muscular
                      </Link>
                      .
                    </p>
                    {/**
                     * A metade que a comida não resolve: superávit sem treino
                     * de força vira gordura. Quem escolheu ganhar sai daqui
                     * sabendo que o caminho continua na trilha do treino.
                     */}
                    <p className="text-gray-300 text-sm leading-relaxed border-t border-[#BA9E50]/30 pt-3">
                      E o treino? O superávit é metade da equação — o músculo
                      vem do estímulo.{" "}
                      <Link
                        href="/treino-para-minha-rotina"
                        onClick={() => trackEvent("tdee_training_click", { placement })}
                        className="text-white font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity"
                        style={{ textDecorationColor: "#BA9E50" }}
                      >
                        Descubra qual divisão de treino cabe na sua semana →
                      </Link>
                    </p>
                  </div>
                )}
              </div>
              <PosResultado
                ferramenta="tdee"
                resumo={`gasto estimado de ≈ ${formataFaixa(tdee)} kcal/dia`}
                placement={placement}
                aoContinuar={() => {
                  /* Mesma travessia do botão "calcular meu déficit": os dados, não o número. */
                  guarda(PONTE.dados, JSON.stringify({ peso, altura, idade, sexo, nivel: nivel.id }));
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Como calculamos ──────────────────────────────────────────── */}
      <div className="border-t border-white/10 mt-7 pt-5">
        <button
          type="button"
          onClick={() => {
            if (!metodoAberto) trackEvent("tdee_methodology_open", { placement });
            setMetodoAberto(!metodoAberto);
          }}
          aria-expanded={metodoAberto}
          className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        >
          Como calculamos?
        </button>
        {metodoAberto && (
          <div className="mt-3 text-sm text-gray-300 leading-relaxed space-y-3 max-w-2xl">
            <p>
              A taxa metabólica de repouso vem da equação de{" "}
              <strong className="text-white">Mifflin-St Jeor</strong> —{" "}
              {REFERENCIA_TMB.detalhe}
            </p>
            <p className="font-mono text-xs sm:text-sm bg-white/[0.04] border border-white/10 p-3 overflow-x-auto">
              TMB = (10 × peso) + (6,25 × altura em cm) − (5 × idade) {"{"}+5 homens · −161 mulheres{"}"}
            </p>
            {completo && tmb && tdee && nivel && sexo !== "nao_informado" && (
              <p className="font-mono text-xs sm:text-sm bg-white/[0.04] border border-white/10 p-3 overflow-x-auto">
                (10 × {String(peso).replace(".", ",")}) + (6,25 × {altura}) − (5 × {idade}){" "}
                {sexo === "masculino" ? "+ 5" : "− 161"} = {Math.round(tmb.min).toLocaleString("pt-BR")} kcal
                <br />
                {Math.round(tmb.min).toLocaleString("pt-BR")} × {String(nivel.fator).replace(".", ",")} ≈{" "}
                {formataFaixa(tdee)} kcal/dia
              </p>
            )}
            <p>
              O gasto diário multiplica a TMB pelo fator de atividade — uma
              estimativa da rotina inteira, não uma medição. Os valores são
              arredondados para a dezena porque a equação não tem precisão de
              unidade. {NOTA_ATIVIDADE_AMPLA}
            </p>
            <p>{NOTA_BMR_RMR}</p>
            <p className="text-gray-400">
              Referência: {REFERENCIA_TMB.rotulo}.{" "}
              <a href={REFERENCIA_TMB.url} target="_blank" rel="noopener noreferrer" className={ln}>
                Ver no PubMed
              </a>
              . Para entender a conta em detalhe,{" "}
              <Link
                href="/blog/como-calcular-tmb-tdee-calorias"
                onClick={() => trackEvent("tdee_article_click", { placement })}
                className={ln}
              >
                o artigo sobre TMB e TDEE
              </Link>{" "}
              percorre cada passo.
            </p>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {DISCLAIMER} {DISCLAIMER_ESPECIAL}
      </p>
    </div>
  );
}
