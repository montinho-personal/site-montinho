"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { guardaKcalParaMacros, guardaPesoParaProteina } from "@/lib/macros";
import {
  ALTURA_MAX,
  ALTURA_MIN,
  AVISO_META_BAIXA,
  DICA_ATIVIDADE,
  DISCLAIMER,
  DISCLAIMER_ESPECIAL,
  FAIXAS_DEFICIT,
  IDADE_ADULTA,
  IDADE_MAX,
  IDADE_MIN,
  NIVEIS,
  NOTA_ESTIMATIVA,
  NOTA_SEM_DUPLA_CONTAGEM,
  NOTA_SEM_PROMESSA,
  ORIENTACAO_MENOR_IDADE,
  PESO_MAX,
  PESO_MIN,
  REFERENCIA_TMB,
  type Sexo,
  aplicaDeficit,
  arredondaKcal,
  calculaTDEE,
  calculaTMB,
  formataFaixa,
  metaAbaixoDaTMB,
  normalizaAltura,
  normalizaIdade,
  normalizaNumero,
} from "@/lib/calorias";

/**
 * Calculadora de déficit calórico.
 *
 * Quatro campos e uma escolha de rotina. O cálculo é instantâneo assim que
 * os dados fecham — botão "calcular" para uma multiplicação seria cerimônia,
 * e o resultado aparecendo enquanto se digita ensina a relação entre os
 * números, que é metade do produto aqui.
 *
 * Tudo roda no navegador: nenhuma chamada de rede, nenhum backend, nada
 * gravado. Peso, altura, idade e sexo são dados corporais — eles nunca saem
 * daqui, e os eventos de analytics registram uso, jamais valores.
 *
 * A ferramenta é deliberadamente má em prometer: não diz quantos quilos a
 * pessoa vai perder, não recomenda a faixa agressiva, não soma calorias de
 * relógio ao TDEE e não define piso calórico universal. O que ela faz bem é
 * mostrar a cadeia TMB → gasto → déficit → meta, para a pessoa sair
 * entendendo de onde o número veio.
 */

const h = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";

const SEXOS: { id: Sexo; rotulo: string }[] = [
  { id: "masculino", rotulo: "Masculino" },
  { id: "feminino", rotulo: "Feminino" },
  { id: "nao_informado", rotulo: "Prefiro não informar" },
];

export default function CalculadoraDeficit({
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

  const raiz = useRef<HTMLDivElement>(null);
  const jaCompletou = useRef(false);

  const peso = useMemo(() => normalizaNumero(pesoTexto), [pesoTexto]);
  const altura = useMemo(() => normalizaAltura(alturaTexto), [alturaTexto]);
  const idade = useMemo(() => normalizaIdade(idadeTexto), [idadeTexto]);
  const nivel = useMemo(() => NIVEIS.find((n) => n.id === nivelId) ?? null, [nivelId]);

  const pesoOk = peso !== null && peso >= PESO_MIN && peso <= PESO_MAX;
  const alturaOk = altura !== null && altura >= ALTURA_MIN && altura <= ALTURA_MAX;
  const idadeOk = idade !== null && idade >= IDADE_MIN && idade <= IDADE_MAX;

  /** Menor de idade: a ferramenta orienta em vez de calcular uma meta. */
  const menorDeIdade = idadeOk && idade !== null && idade < IDADE_ADULTA;

  const completo = pesoOk && alturaOk && idadeOk && sexo !== null && nivel !== null && !menorDeIdade;

  const resultado = useMemo(() => {
    if (!completo || peso === null || altura === null || idade === null || sexo === null || nivel === null) {
      return null;
    }
    const tmb = calculaTMB(peso, altura, idade, sexo);
    const tdee = calculaTDEE(tmb, nivel.fator);
    return { tmb, tdee, fator: nivel.fator };
  }, [completo, peso, altura, idade, sexo, nivel]);

  /** View: só quando o bloco entra de fato na tela. */
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("calorie_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  /** Conclusão: primeira vez que os dados fecham. Sem nenhum valor junto. */
  useEffect(() => {
    if (resultado && !jaCompletou.current) {
      jaCompletou.current = true;
      trackEvent("calorie_calculator_complete", { placement });
    }
  }, [resultado, placement]);

  const campo =
    "w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white text-xl font-bold px-4 py-3 transition-colors min-h-[48px]";
  const rotulo = "block text-gray-300 text-sm font-medium mb-2";
  const erro = "text-[#E8B4B4] text-sm mt-1.5 min-h-[20px]";

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-deficit"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />

      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · seus dados não saem do navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
        Calculadora de Déficit Calórico
      </h2>
      <p className="text-gray-300 leading-relaxed mb-7 max-w-xl">
        Estime seu gasto diário e veja quanto comer para criar um déficit.
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* ── Formulário ─────────────────────────────────────────────── */}
        <div>
          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 mb-6">
            <div>
              <label htmlFor={`peso-${placement}`} className={rotulo}>
                Peso <span className="text-gray-500 font-normal">(kg)</span>
              </label>
              <input
                id={`peso-${placement}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="80"
                value={pesoTexto}
                onChange={(e) => setPesoTexto(e.target.value)}
                aria-invalid={pesoTexto.trim() !== "" && !pesoOk}
                aria-describedby={`peso-erro-${placement}`}
                className={campo}
              />
              <p id={`peso-erro-${placement}`} className={erro}>
                {pesoTexto.trim() !== "" && !pesoOk ? "Confira o peso informado." : ""}
              </p>
            </div>

            <div>
              <label htmlFor={`altura-${placement}`} className={rotulo}>
                Altura <span className="text-gray-500 font-normal">(cm)</span>
              </label>
              <input
                id={`altura-${placement}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="175"
                value={alturaTexto}
                onChange={(e) => setAlturaTexto(e.target.value)}
                aria-invalid={alturaTexto.trim() !== "" && !alturaOk}
                aria-describedby={`altura-erro-${placement}`}
                className={campo}
              />
              <p id={`altura-erro-${placement}`} className={erro}>
                {alturaTexto.trim() !== "" && !alturaOk ? "Confira sua altura." : ""}
              </p>
            </div>

            <div>
              <label htmlFor={`idade-${placement}`} className={rotulo}>
                Idade <span className="text-gray-500 font-normal">(anos)</span>
              </label>
              <input
                id={`idade-${placement}`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="35"
                value={idadeTexto}
                onChange={(e) => setIdadeTexto(e.target.value)}
                aria-invalid={idadeTexto.trim() !== "" && !idadeOk}
                aria-describedby={`idade-erro-${placement}`}
                className={campo}
              />
              <p id={`idade-erro-${placement}`} className={erro}>
                {idadeTexto.trim() !== "" && !idadeOk ? "Informe sua idade." : ""}
              </p>
            </div>
          </div>

          {/* Sexo — fieldset de verdade, não um grupo de divs */}
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
                    name={`sexo-${placement}`}
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

          {/* Atividade */}
          <fieldset className="mb-4">
            <legend className={rotulo}>Nível de atividade</legend>
            <div className="grid gap-2">
              {NIVEIS.map((n) => (
                <label
                  key={n.id}
                  className={`cursor-pointer border p-4 transition-colors focus-within:ring-1 focus-within:ring-[#BA9E50] ${
                    nivelId === n.id
                      ? "border-[#BA9E50] bg-[#BA9E50]/[0.08]"
                      : "border-white/15 hover:border-white/35"
                  }`}
                >
                  <input
                    type="radio"
                    name={`nivel-${placement}`}
                    value={n.id}
                    checked={nivelId === n.id}
                    onChange={() => setNivelId(n.id)}
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
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      ×{String(n.fator).replace(".", ",")}
                    </span>
                  </span>
                  <span className="block text-gray-400 text-sm leading-relaxed">{n.descricao}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={() => {
              if (!ajudaAberta) trackEvent("calorie_activity_help_open", { placement });
              setAjudaAberta(!ajudaAberta);
            }}
            aria-expanded={ajudaAberta}
            className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px] text-left"
            style={{ textDecorationColor: "#BA9E50" }}
          >
            Não sabe qual nível escolher?
          </button>
          {ajudaAberta && (
            <div className="mt-3 border-l-2 pl-4 space-y-3" style={{ borderColor: "#BA9E50" }}>
              <p className="text-gray-300 text-sm leading-relaxed">{DICA_ATIVIDADE}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{NOTA_SEM_DUPLA_CONTAGEM}</p>
            </div>
          )}
        </div>

        {/* ── Resultado ──────────────────────────────────────────────── */}
        <div aria-live="polite">
          {menorDeIdade ? (
            <div className="border border-white/20 p-6 h-full flex items-center">
              <p className="text-gray-200 text-base leading-relaxed">{ORIENTACAO_MENOR_IDADE}</p>
            </div>
          ) : !resultado ? (
            /* Zero state — nunca "0 kcal" */
            <div className="border border-dashed border-white/20 p-6 sm:p-8 h-full flex flex-col justify-center">
              <p className="text-gray-300 leading-relaxed">
                Preencha seus dados para estimar seu gasto diário e visualizar
                diferentes faixas de déficit.
              </p>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                Nada é enviado para lugar nenhum: a conta acontece no seu
                próprio navegador.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* O número principal — o mais forte da interface */}
              <div className="border border-[#BA9E50]/50 bg-[#BA9E50]/[0.07] p-6">
                <p
                  className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2"
                  style={{ color: "#BA9E50" }}
                >
                  Seu gasto diário estimado
                </p>
                <p className="text-white font-bold text-5xl sm:text-6xl leading-none mb-3" style={h}>
                  <span className="text-3xl font-normal text-gray-400">≈ </span>
                  {formataFaixa(resultado.tdee)}
                  <span className="text-xl font-normal text-gray-300"> kcal/dia</span>
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Estimativa das calorias para manter seu peso, considerando os
                  dados informados.
                </p>
              </div>

              {/* A cadeia: TMB → gasto. Discreto, mas presente. */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-white/15 p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1.5">TMB estimada</p>
                  <p className="text-white font-bold text-2xl leading-none" style={h}>
                    {formataFaixa(resultado.tmb)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">kcal/dia em repouso</p>
                </div>
                <div className="border border-white/15 p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1.5">Fator de atividade</p>
                  <p className="text-white font-bold text-2xl leading-none" style={h}>
                    ×{String(resultado.fator).replace(".", ",")}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{nivel?.titulo}</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">{NOTA_ESTIMATIVA}</p>

              {/* Faixas de déficit */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-white font-bold text-lg mb-1" style={h}>
                  Escolha uma faixa de déficit
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Cada faixa é um percentual do seu gasto — por isso escala com
                  o seu caso, em vez de um corte fixo igual para todo mundo.
                </p>

                <div className="grid gap-3">
                  {FAIXAS_DEFICIT.map((f) => {
                    const metaAlta = aplicaDeficit(resultado.tdee, f.percentualMin);
                    const metaBaixa = aplicaDeficit(resultado.tdee, f.percentualMax);
                    /** A meta menor é a do maior percentual. */
                    const meta = { min: metaBaixa.min, max: metaAlta.max };
                    const cortadoMin = resultado.tdee.min - metaAlta.min;
                    const cortadoMax = resultado.tdee.max - metaBaixa.max;
                    const pct =
                      f.percentualMin === f.percentualMax
                        ? `${f.percentualMin}%`
                        : `${f.percentualMin}–${f.percentualMax}%`;
                    const corte =
                      arredondaKcal(cortadoMin) === arredondaKcal(cortadoMax)
                        ? `${arredondaKcal(cortadoMin).toLocaleString("pt-BR")}`
                        : `${arredondaKcal(cortadoMin).toLocaleString("pt-BR")}–${arredondaKcal(cortadoMax).toLocaleString("pt-BR")}`;

                    return (
                      <div
                        key={f.id}
                        onClick={() => trackEvent("calorie_deficit_select", { placement, faixa: f.id })}
                        className={`border p-5 ${
                          f.destaque ? "border-[#BA9E50]/60 bg-[#BA9E50]/[0.06]" : "border-white/15"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-3 mb-3">
                          <p
                            className="text-[11px] font-semibold tracking-[0.18em] uppercase"
                            style={{ color: "#BA9E50" }}
                          >
                            {f.titulo}
                          </p>
                          <p className="text-gray-400 text-sm font-medium whitespace-nowrap">{pct}</p>
                        </div>

                        {/* A conta explícita: manutenção − déficit = meta */}
                        <p className="text-gray-400 text-sm mb-1">− {corte} kcal/dia</p>
                        <p className="text-white font-bold text-3xl leading-none mb-1" style={h}>
                          <span className="text-lg font-normal text-gray-400">≈ </span>
                          {formataFaixa(meta)}
                          <span className="text-base font-normal text-gray-300"> kcal/dia</span>
                        </p>
                        <p className="text-gray-500 text-xs mb-3">meta aproximada</p>

                        <p className="text-gray-300 text-sm leading-relaxed">{f.descricao}</p>

                        {metaAbaixoDaTMB(meta, resultado.tmb) && (
                          <p className="text-[#E8C77A] text-sm leading-relaxed mt-3 border-l-2 border-[#BA9E50] pl-3">
                            {AVISO_META_BAIXA}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mt-4">{NOTA_SEM_PROMESSA}</p>

                {/* Ponte para a Calculadora de Macros. A meta usada é a da
                    faixa moderada, que é a que aparece em destaque; o valor
                    viaja em sessionStorage e não na URL. */}
                <Link
                  href="/ferramentas/calculadora-macros"
                  onClick={() => {
                    const moderada = FAIXAS_DEFICIT.find((f) => f.destaque);
                    if (moderada) {
                      const m = aplicaDeficit(resultado.tdee, moderada.percentualMax);
                      guardaKcalParaMacros(m.min);
                    }
                    trackEvent("calorie_macros_click", { placement });
                  }}
                  className="inline-block mt-4 text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                  style={{ textDecorationColor: "#BA9E50" }}
                >
                  Distribuir minhas calorias em macros →
                </Link>
                <Link
                  href="/ferramentas/monte-seu-cardapio"
                  onClick={() => {
                    const moderada = FAIXAS_DEFICIT.find((f) => f.destaque);
                    if (moderada) {
                      const m = aplicaDeficit(resultado.tdee, moderada.percentualMax);
                      guardaKcalParaMacros(m.min);
                    }
                    if (peso !== null) guardaPesoParaProteina(peso);
                    trackEvent("calorie_macros_click", { placement: `${placement}-cardapio` });
                  }}
                  className="inline-block mt-4 ml-6 text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                  style={{ textDecorationColor: "#BA9E50" }}
                >
                  Transformar em cardápio →
                </Link>
              </div>

              {/* Como chegamos nesse resultado */}
              <div className="border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    if (!metodoAberto) trackEvent("calorie_methodology_open", { placement });
                    setMetodoAberto(!metodoAberto);
                  }}
                  aria-expanded={metodoAberto}
                  className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px] text-left"
                  style={{ textDecorationColor: "#BA9E50" }}
                >
                  Como chegamos nesse resultado?
                </button>
                {metodoAberto && (
                  <div className="mt-4 space-y-4">
                    <ol className="space-y-3 text-gray-300 text-sm leading-relaxed list-decimal pl-5">
                      <li>
                        Estimamos sua taxa metabólica com a equação de{" "}
                        <a href={REFERENCIA_TMB.url} target="_blank" rel="noopener noreferrer" className={ln}>
                          {REFERENCIA_TMB.rotuloCurto}
                        </a>
                        , que usa peso, altura, idade e a constante do sexo.
                      </li>
                      <li>Multiplicamos pelo fator da sua rotina, chegando ao gasto diário estimado.</li>
                      <li>Calculamos percentuais de déficit sobre esse gasto.</li>
                    </ol>

                    <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 space-y-1 overflow-x-auto">
                      <p>TMB estimada: {formataFaixa(resultado.tmb)} kcal</p>
                      <p>
                        × {String(resultado.fator).replace(".", ",")} ={" "}
                        <span className="text-white">{formataFaixa(resultado.tdee)} kcal/dia</span>
                      </p>
                      <p className="pt-2">
                        Déficit de 20%: × 0,80 ={" "}
                        <span className="text-white">
                          {formataFaixa(aplicaDeficit(resultado.tdee, 20))} kcal/dia
                        </span>
                      </p>
                    </div>

                    <p className="text-gray-500 text-xs leading-relaxed">
                      Os valores na tela são arredondados para a dezena. A conta
                      roda em precisão total por dentro — o arredondamento
                      existe para não sugerir uma exatidão que a equação não
                      tem. {REFERENCIA_TMB.detalhe}
                    </p>
                  </div>
                )}
              </div>

              {/* Comece e ajuste */}
              <div className="border-t border-white/10 pt-5">
                <h3 className="text-white font-bold text-lg mb-2" style={h}>
                  A calculadora é o ponto de partida
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Nenhuma fórmula sabe exatamente quanto você gasta no mundo
                  real. Use a estimativa como ponto de partida e observe a
                  tendência do seu peso e das suas medidas ao longo das próximas
                  semanas.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Se a média do peso não estiver mudando como esperado depois de
                  um período razoável, e a alimentação estiver sendo registrada
                  de forma consistente, aí sim vale recalibrar a estimativa — um
                  ajuste por vez, sem cortes agressivos.
                </p>
              </div>

              {/* Links internos — depois do valor entregue */}
              <div className="border-t border-white/10 pt-5">
                <p className="text-white text-sm font-semibold mb-3">Para ir mais fundo</p>
                <ul className="space-y-2.5">
                  {[
                    {
                      href: "/blog/como-calcular-tmb-tdee-calorias",
                      titulo: "Como calcular TMB e TDEE",
                      contexto: "Entenda seus números",
                    },
                    {
                      href: "/blog/quantas-calorias-cortar-para-emagrecer",
                      titulo: "Quantas calorias cortar para emagrecer",
                      contexto: "Entenda o tamanho do déficit",
                    },
                    {
                      href: "/blog/deficit-calorico-como-calcular",
                      titulo: "Déficit calórico: o que é e como calcular",
                      contexto: "Guia completo",
                    },
                  ]
                    .filter((l) => !l.href.endsWith(placement))
                    .map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={() => trackEvent("calorie_article_click", { placement })}
                          className="group flex items-baseline gap-2 text-gray-300 hover:text-white transition-colors"
                        >
                          <span className="text-gray-500 text-xs whitespace-nowrap">{l.contexto}</span>
                          <span
                            className="text-sm underline underline-offset-4 decoration-1"
                            style={{ textDecorationColor: "#BA9E50" }}
                          >
                            {l.titulo} →
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              {/* CTA — só depois de todo o resultado entregue */}
              <div className="border-t border-white/10 pt-5">
                <p className="text-gray-400 text-sm leading-relaxed">
                  Saber as calorias é uma parte da estratégia. Treino, proteína,
                  progressão e aderência determinam quanto disso vira um
                  processo que se sustenta.{" "}
                  <Link
                    href="/consultoria"
                    onClick={() => trackEvent("calorie_cta_click", { placement })}
                    className="text-gray-300 underline underline-offset-2 decoration-1 hover:text-white transition-colors"
                  >
                    É isso que o acompanhamento do Montinho ajusta
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 mt-8 pt-5 space-y-2">
        <p className="text-gray-500 text-xs leading-relaxed max-w-3xl">
          <strong className="text-gray-400">Importante:</strong> {DISCLAIMER}
        </p>
        <p className="text-gray-500 text-xs leading-relaxed max-w-3xl">{DISCLAIMER_ESPECIAL}</p>
      </div>
    </div>
  );
}
