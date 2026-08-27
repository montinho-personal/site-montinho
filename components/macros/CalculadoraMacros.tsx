"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  AMDR,
  COMBINACAO_IMPOSSIVEL,
  DISCLAIMER,
  DISCLAIMER_ESPECIAL,
  FAIXAS_PROTEINA,
  GORDURA_PADRAO,
  KCAL_MAX,
  KCAL_MIN,
  META_MUITO_BAIXA,
  NOTA_AMDR_FORA,
  NOTA_ARREDONDAMENTO,
  NOTA_ORCAMENTO,
  NOTA_PROTEINA_FAIXAS,
  NOTA_REFEICOES,
  PERCENTUAIS_GORDURA,
  PESO_MAX,
  PESO_MIN,
  REFEICOES,
  REFERENCIA_PROTEINA,
  calculaMacros,
  consomeKcalDeDeficit,
  dentroDoAMDR,
  formataNumero,
  normalizaNumero,
  porRefeicao,
} from "@/lib/macros";

/**
 * Calculadora de macros.
 *
 * O produto não é "três números". É mostrar que os três dividem um orçamento
 * fechado: mexer na proteína ou na gordura muda o carboidrato na mesma tela,
 * na hora. Por isso os seletores ficam junto do resultado e não antes dele —
 * a pessoa precisa ver a barra se mexer enquanto toca.
 *
 * As referências de proteína são importadas da Calculadora de Proteína, não
 * copiadas: as duas ferramentas do site não podem dizer g/kg diferentes.
 *
 * Tudo roda no navegador. A única gravação é a passagem de calorias vinda da
 * Calculadora de Déficit — em sessionStorage, consumida e apagada de
 * imediato, justamente para o número não viajar na URL.
 */

const h = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;

/**
 * Cores da barra. Dentro da paleta do site — dourado, off-white e bronze
 * escuro — e nunca sozinhas: cada segmento tem rótulo e número em texto, e a
 * lista abaixo repete tudo. Quem não distingue as cores não perde nada.
 */
const COR = {
  proteina: "#BA9E50",
  carboidrato: "#E8E4DA",
  gordura: "#7A6535",
} as const;

export default function CalculadoraMacros({ placement }: { placement: string }) {
  const [kcalTexto, setKcalTexto] = useState("");
  const [pesoTexto, setPesoTexto] = useState("");
  const [gPorKg, setGPorKg] = useState<number>(2.0);
  const [pctGordura, setPctGordura] = useState<number>(GORDURA_PADRAO);
  const [refeicoes, setRefeicoes] = useState<number | null>(null);
  const [metodoAberto, setMetodoAberto] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaCompletou = useRef(false);

  /** Calorias vindas da Calculadora de Déficit, se a pessoa veio de lá. */
  const [veioDoDeficit, setVeioDoDeficit] = useState(false);
  useEffect(() => {
    const kcal = consomeKcalDeDeficit();
    if (kcal !== null) {
      setKcalTexto(String(kcal));
      setVeioDoDeficit(true);
    }
  }, []);

  const kcal = useMemo(() => normalizaNumero(kcalTexto), [kcalTexto]);
  const peso = useMemo(() => normalizaNumero(pesoTexto), [pesoTexto]);

  const kcalBaixa = kcal !== null && kcal < KCAL_MIN;
  const kcalOk = kcal !== null && kcal >= KCAL_MIN && kcal <= KCAL_MAX;
  const pesoOk = peso !== null && peso >= PESO_MIN && peso <= PESO_MAX;

  const r = useMemo(
    () => (kcalOk && pesoOk && kcal && peso ? calculaMacros(kcal, peso, gPorKg, pctGordura) : null),
    [kcalOk, pesoOk, kcal, peso, gPorKg, pctGordura]
  );

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("macro_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  useEffect(() => {
    if (r && !r.impossivel && !jaCompletou.current) {
      jaCompletou.current = true;
      trackEvent("macro_calculator_complete", { placement });
    }
  }, [r, placement]);

  const campo =
    "w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white text-3xl font-bold px-4 py-3.5 transition-colors min-h-[56px]";
  const rotulo = "block text-gray-300 text-sm font-medium mb-2";
  const chip = (ativo: boolean) =>
    `px-4 py-2.5 text-sm font-medium border transition-colors min-h-[44px] ${
      ativo ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/40"
    }`;

  const foraDoAMDR =
    r !== null &&
    !r.impossivel &&
    (!dentroDoAMDR("proteina", r.proteina.percentual) ||
      !dentroDoAMDR("carboidrato", r.carboidrato.percentual) ||
      !dentroDoAMDR("gordura", r.gordura.percentual));

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-macros"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />

      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · seus dados não saem do navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
        Calculadora de Macros
      </h2>
      <p className="text-gray-300 leading-relaxed mb-7 max-w-xl">
        Informe suas calorias e seu peso para calcular uma referência diária de
        proteínas, carboidratos e gorduras.
      </p>

      {/* ── Entrada ───────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 mb-2">
        <div>
          <label htmlFor={`kcal-${placement}`} className={rotulo}>
            Calorias por dia <span className="text-gray-500 font-normal">(kcal)</span>
          </label>
          <input
            id={`kcal-${placement}`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="2200"
            value={kcalTexto}
            onChange={(e) => {
              setKcalTexto(e.target.value);
              setVeioDoDeficit(false);
            }}
            aria-invalid={kcalTexto.trim() !== "" && !kcalOk}
            aria-describedby={`kcal-erro-${placement}`}
            className={campo}
          />
          <p id={`kcal-erro-${placement}`} className="text-[#E8B4B4] text-sm mt-1.5 min-h-[20px]">
            {kcalTexto.trim() !== "" && !kcalOk && !kcalBaixa ? "Confira as calorias informadas." : ""}
          </p>
        </div>
        <div>
          <label htmlFor={`peso-${placement}`} className={rotulo}>
            Seu peso <span className="text-gray-500 font-normal">(kg)</span>
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
          <p id={`peso-erro-${placement}`} className="text-[#E8B4B4] text-sm mt-1.5 min-h-[20px]">
            {pesoTexto.trim() !== "" && !pesoOk ? "Confira o peso informado." : ""}
          </p>
        </div>
      </div>

      {veioDoDeficit && (
        <p className="text-gray-400 text-sm mb-4 border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}>
          Calorias trazidas da sua calculadora de déficit. Pode alterar à vontade.
        </p>
      )}

      {!veioDoDeficit && (
        <p className="text-gray-400 text-sm mb-6">
          Ainda não sabe suas calorias?{" "}
          <Link
            href="/ferramentas/calculadora-deficit-calorico"
            onClick={() => trackEvent("macro_deficit_click", { placement })}
            className="text-gray-300 underline underline-offset-4 decoration-1 hover:text-white transition-colors"
            style={{ textDecorationColor: "#BA9E50" }}
          >
            Calcular meu déficit calórico →
          </Link>
        </p>
      )}

      {/* ── Seletores ─────────────────────────────────────────────────── */}
      <fieldset className="mb-5">
        <legend className={rotulo}>Sua referência de proteína</legend>
        <div className="flex flex-wrap gap-2">
          {FAIXAS_PROTEINA.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setGPorKg(f.gPorKg);
                trackEvent("macro_protein_change", { placement });
              }}
              aria-pressed={gPorKg === f.gPorKg}
              className={`${chip(gPorKg === f.gPorKg)} flex-col items-start !py-2.5`}
            >
              <span className="flex items-center">
                {gPorKg === f.gPorKg && (
                  <span aria-hidden="true" style={{ color: "#BA9E50" }}>
                    ✓{" "}
                  </span>
                )}
                {String(f.gPorKg).replace(".", ",")} g/kg
              </span>
              <span className="block text-[11px] text-gray-500 font-normal">{f.titulo}</span>
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">{NOTA_PROTEINA_FAIXAS}</p>
      </fieldset>

      <fieldset className="mb-7">
        <legend className={rotulo}>Percentual das calorias vindo das gorduras</legend>
        <div className="flex flex-wrap gap-2">
          {PERCENTUAIS_GORDURA.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setPctGordura(p);
                trackEvent("macro_fat_change", { placement });
              }}
              aria-pressed={pctGordura === p}
              className={chip(pctGordura === p)}
            >
              {pctGordura === p && (
                <span aria-hidden="true" style={{ color: "#BA9E50" }}>
                  ✓{" "}
                </span>
              )}
              {p}%
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
          Faixa de referência para adultos: {AMDR.gordura.min}–{AMDR.gordura.max}% da energia.
        </p>
      </fieldset>

      {/* ── Resultado ─────────────────────────────────────────────────── */}
      <div aria-live="polite">
        {kcalBaixa ? (
          <div className="border border-white/20 p-6">
            <p className="text-gray-200 leading-relaxed">{META_MUITO_BAIXA}</p>
          </div>
        ) : !r ? (
          /* Zero state — nunca zeros */
          <div className="border border-dashed border-white/20 p-6 sm:p-8">
            <p className="text-gray-300 leading-relaxed">
              Informe suas calorias e seu peso para calcular uma distribuição de
              macronutrientes.
            </p>
            <p className="text-gray-500 text-sm mt-3">
              Nada é enviado para lugar nenhum: a conta acontece no seu próprio navegador.
            </p>
          </div>
        ) : r.impossivel ? (
          <div className="border border-[#BA9E50]/50 bg-[#BA9E50]/[0.05] p-6">
            <p className="text-white font-bold text-lg mb-2" style={h}>
              Essa combinação não fecha
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">{COMBINACAO_IMPOSSIVEL}</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Proteína e gordura somam {formataNumero(r.proteina.kcal + r.gordura.kcal)} kcal, o que passa
              em {formataNumero(r.excedenteKcal)} kcal a sua meta de {formataNumero(r.metaKcal)} kcal.
              Reduzir a referência de proteína, baixar o percentual de gordura ou revisar a meta calórica
              resolve — a escolha é sua.
            </p>
          </div>
        ) : (
          <div className="space-y-7">
            <div>
              <h3 className="text-white font-bold text-xl mb-4" style={h}>
                Seus macros diários
              </h3>

              {/* Barra de distribuição — decorativa; os números vêm abaixo */}
              <div
                className="flex h-4 w-full overflow-hidden border border-white/15 mb-2"
                role="presentation"
                aria-hidden="true"
              >
                <div style={{ width: `${r.proteina.percentual}%`, background: COR.proteina }} />
                <div style={{ width: `${r.carboidrato.percentual}%`, background: COR.carboidrato }} />
                <div style={{ width: `${r.gordura.percentual}%`, background: COR.gordura }} />
              </div>

              <ul className="grid gap-3 sm:grid-cols-3 mb-4">
                {[
                  { nome: "Proteína", m: r.proteina, cor: COR.proteina, chave: "proteina" as const },
                  { nome: "Carboidratos", m: r.carboidrato, cor: COR.carboidrato, chave: "carboidrato" as const },
                  { nome: "Gorduras", m: r.gordura, cor: COR.gordura, chave: "gordura" as const },
                ].map((item) => (
                  <li key={item.nome} className="border border-white/15 p-5">
                    <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase mb-2 text-gray-400">
                      <span
                        className="inline-block h-2.5 w-2.5 shrink-0 border border-white/20"
                        style={{ background: item.cor }}
                        aria-hidden="true"
                      />
                      {item.nome}
                    </p>
                    <p className="text-white font-bold text-4xl leading-none mb-1" style={h}>
                      {formataNumero(item.m.gramas)}
                      <span className="text-lg font-normal text-gray-300"> g</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      ≈ {formataNumero(item.m.kcal)} kcal · {Math.round(item.m.percentual)}%
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-white/10 pt-3">
                <p className="text-gray-300">
                  Total aproximado:{" "}
                  <strong className="text-white text-lg" style={h}>
                    ≈ {formataNumero(r.totalArredondado)} kcal
                  </strong>
                </p>
                <p className="text-gray-500 text-sm">Sua meta: {formataNumero(r.metaKcal)} kcal</p>
              </div>
              {r.totalArredondado !== r.metaKcal && (
                <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{NOTA_ARREDONDAMENTO}</p>
              )}
            </div>

            <p className="text-gray-300 text-sm leading-relaxed border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
              {NOTA_ORCAMENTO} Experimente trocar a proteína ou a gordura acima e veja o carboidrato mudar.
            </p>

            {foraDoAMDR && <p className="text-gray-400 text-sm leading-relaxed">{NOTA_AMDR_FORA}</p>}

            {/* Divisão por refeição */}
            <div className="border-t border-white/10 pt-6">
              <p className="text-white text-sm font-semibold mb-3">Quer dividir seus macros ao longo do dia?</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {REFEICOES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      if (refeicoes === null) trackEvent("macro_meal_split_open", { placement });
                      setRefeicoes(refeicoes === n ? null : n);
                    }}
                    aria-pressed={refeicoes === n}
                    className={chip(refeicoes === n)}
                  >
                    {n} refeições
                  </button>
                ))}
              </div>
              {refeicoes !== null && (
                <div>
                  <p className="text-gray-200 mb-2">Se dividisse igualmente, cada refeição teria:</p>
                  <ul className="flex flex-wrap gap-x-6 gap-y-1 mb-2">
                    {[
                      ["Proteína", r.proteina.gramas],
                      ["Carboidratos", r.carboidrato.gramas],
                      ["Gorduras", r.gordura.gramas],
                    ].map(([nome, g]) => (
                      <li key={nome as string} className="text-gray-300">
                        {nome as string}:{" "}
                        <strong className="text-white text-lg" style={h}>
                          ≈ {porRefeicao(g as number, refeicoes)} g
                        </strong>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-400 text-sm leading-relaxed">{NOTA_REFEICOES}</p>
                </div>
              )}
            </div>

            {/* Como calculamos */}
            <div className="border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => {
                  if (!metodoAberto) trackEvent("macro_methodology_open", { placement });
                  setMetodoAberto(!metodoAberto);
                }}
                aria-expanded={metodoAberto}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px] text-left"
                style={{ textDecorationColor: "#BA9E50" }}
              >
                Como calculamos seus macros?
              </button>
              {metodoAberto && (
                <div className="mt-4 space-y-4">
                  <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 space-y-2 overflow-x-auto">
                    <p>Meta: {formataNumero(r.metaKcal)} kcal</p>
                    <p>
                      Proteína: {formataNumero(peso!)} × {String(gPorKg).replace(".", ",")} ={" "}
                      <span className="text-white">{formataNumero(r.proteina.gramas)} g</span> ={" "}
                      {formataNumero(r.proteina.kcal)} kcal
                    </p>
                    <p>
                      Gordura: {pctGordura}% de {formataNumero(r.metaKcal)} = {formataNumero(r.gordura.kcal)} kcal
                      ÷ 9 = <span className="text-white">{formataNumero(r.gordura.gramas)} g</span>
                    </p>
                    <p>
                      Carboidrato: {formataNumero(r.metaKcal)} − {formataNumero(r.proteina.kcal)} −{" "}
                      {formataNumero(r.gordura.kcal)} = {formataNumero(r.carboidrato.kcal)} kcal ÷ 4 ={" "}
                      <span className="text-white">{formataNumero(r.carboidrato.gramas)} g</span>
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Os fatores de energia são os gerais de Atwater: 4 kcal por grama de proteína e de
                    carboidrato, 9 kcal por grama de gordura — os mesmos usados em rotulagem nutricional. A
                    faixa de proteína vem de{" "}
                    <a
                      href={REFERENCIA_PROTEINA.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 decoration-1 hover:text-white transition-colors"
                    >
                      {REFERENCIA_PROTEINA.rotulo}
                    </a>
                    , e as faixas populacionais de referência do {AMDR.fonte}.
                  </p>
                </div>
              )}
            </div>

            {/* Links do ecossistema */}
            <div className="border-t border-white/10 pt-5">
              <p className="text-white text-sm font-semibold mb-3">Continuar</p>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/ferramentas/calculadora-de-proteina"
                    onClick={() => trackEvent("macro_protein_calculator_click", { placement })}
                    className="text-gray-300 hover:text-white transition-colors text-sm underline underline-offset-4 decoration-1"
                    style={{ textDecorationColor: "#BA9E50" }}
                  >
                    Entender melhor sua meta de proteína →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ferramentas/calculadora-deficit-calorico"
                    onClick={() => trackEvent("macro_deficit_click", { placement })}
                    className="text-gray-300 hover:text-white transition-colors text-sm underline underline-offset-4 decoration-1"
                    style={{ textDecorationColor: "#BA9E50" }}
                  >
                    Revisar sua meta calórica →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/dieta-flexivel-iifym"
                    onClick={() => trackEvent("macro_article_click", { placement })}
                    className="text-gray-300 hover:text-white transition-colors text-sm underline underline-offset-4 decoration-1"
                    style={{ textDecorationColor: "#BA9E50" }}
                  >
                    Como aplicar isso na alimentação →
                  </Link>
                </li>
              </ul>
            </div>

            {/* CTA — depois de todo o resultado */}
            <div className="border-t border-white/10 pt-5">
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                Calorias e macros organizam a alimentação, mas treino, progressão, rotina e aderência
                também fazem parte do resultado.{" "}
                <Link
                  href="/consultoria"
                  onClick={() => trackEvent("macro_cta_click", { placement })}
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

      <div className="border-t border-white/10 mt-7 pt-5 space-y-2">
        <p className="text-gray-500 text-xs leading-relaxed max-w-3xl">
          <strong className="text-gray-400">Importante:</strong> {DISCLAIMER}
        </p>
        <p className="text-gray-500 text-xs leading-relaxed max-w-3xl">{DISCLAIMER_ESPECIAL}</p>
      </div>
    </div>
  );
}
