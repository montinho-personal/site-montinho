"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import PosResultado from "@/components/ferramentas/PosResultado";
import Compartilhar from "@/components/share/Compartilhar";
import { PONTE, consomeNumero } from "@/lib/ferramentas/ponte";
import {
  ALIMENTOS,
  FAIXAS,
  NOTA_FONTES,
  NOTA_INDUSTRIALIZADOS,
  PESO_MAX,
  PESO_MIN,
  REFERENCIA_CIENTIFICA,
  gramasPorDia,
  gramasPorRefeicao,
  parsePeso,
} from "@/lib/proteina";

/**
 * Calculadora de proteína diária.
 *
 * Um campo, três referências. O cálculo é instantâneo — obrigar um clique em
 * "calcular" para uma multiplicação seria cerimônia. Tudo roda no navegador:
 * nenhuma chamada externa, nenhum backend, e o peso digitado nunca sai daqui —
 * os eventos de analytics registram uso, jamais o valor.
 *
 * As três faixas vêm de `lib/proteina.ts` com a referência científica junto.
 * A copy nunca diz que a faixa alta rende mais músculo que a baixa — o Morton
 * et al. que fundamenta os números diz exatamente o contrário, e é por isso
 * que os cards se chamam "referências", não "níveis".
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

export default function CalculadoraProteina({
  placement,
}: {
  /** Onde o componente está — segmenta os eventos, nunca carrega o peso. */
  placement: string;
}) {
  const [texto, setTexto] = useState("");
  const [refeicoes, setRefeicoes] = useState<number | null>(null);
  /**
   * Faixa escolhida pela pessoa. Começa na que o conteúdo destaca (2 g/kg),
   * mas é ESCOLHA, não decoração: os três cartões são um grupo de opções de
   * verdade. Antes o cartão do meio aparecia realçado e não havia como
   * escolher outro — quem tentava clicar não conseguia, e com razão.
   */
  const [faixaId, setFaixaId] = useState<string>(FAIXAS.find((f) => f.destaque)?.id ?? FAIXAS[0].id);
  const [mostrarAlimentos, setMostrarAlimentos] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  /**
   * Peso vindo da Calculadora de Macros, quando a pessoa chegou por lá. É
   * consumido uma vez e some — ver lib/ferramentas/ponte.ts.
   */
  const [veioDeMacros, setVeioDeMacros] = useState(false);
  useEffect(() => {
    const p = consomeNumero(PONTE.peso, PESO_MIN, PESO_MAX);
    if (p !== null) {
      setTexto(String(p).replace(".", ","));
      setVeioDeMacros(true);
    }
  }, []);

  const peso = useMemo(() => parsePeso(texto), [texto]);
  const foraDoLimite = peso !== null && (peso < PESO_MIN || peso > PESO_MAX);
  const valido = peso !== null && !foraDoLimite;

  /** View: só quando o bloco entra de fato na tela. */
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("protein_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  /** Uso: primeira vez que um peso válido produz resultado. Sem o peso. */
  useEffect(() => {
    if (valido && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("protein_calculator_use", { placement });
    }
  }, [valido, placement]);

  const faixaSelecionada = FAIXAS.find((f) => f.id === faixaId) ?? FAIXAS[0];
  const totalPratico = valido ? gramasPorDia(peso, faixaSelecionada.gPorKg) : null;

  /*
   * O que vai para outra pessoa. Repare no que NÃO está aqui: o peso.
   * "Copiar resultado" é a pessoa guardando a própria conta e pode levar o
   * "Para 80 kg"; compartilhar manda para o WhatsApp de outra gente, e o
   * peso de alguém não é assunto de terceiro. As gramas por dia bastam para
   * quem recebe entender e querer fazer a própria conta.
   */
  const linhasShare = valido
    ? [
        `${String(faixaSelecionada.gPorKg).replace(".", ",")} g/kg → ${gramasPorDia(peso, faixaSelecionada.gPorKg)} g/dia`,
        "",
        "Outras referências:",
        ...FAIXAS.filter((f) => f.id !== faixaSelecionada.id).map(
          (f) => `${String(f.gPorKg).replace(".", ",")} g/kg → ${gramasPorDia(peso, f.gPorKg)} g/dia`,
        ),
      ]
    : [];

  function copiarResultado() {
    if (!valido) return;
    const linhas = [
      `Para ${texto.replace(".", ",")} kg:`,
      ...FAIXAS.map((f) => `${String(f.gPorKg).replace(".", ",")} g/kg = ${gramasPorDia(peso, f.gPorKg)} g/dia`),
      "Calculado no Montinho Personal.",
    ].join("\n");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(linhas).catch(() => {});
    }
  }

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-proteina"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />

      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuito · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
        Calculadora de Proteína
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6 max-w-xl">
        Descubra uma referência de proteína diária de acordo com o seu peso.
      </p>

      {/* Campo de peso */}
      <div className="mb-6">
        <label htmlFor={`peso-${placement}`} className="block text-gray-300 text-sm font-medium mb-2">
          Seu peso
        </label>
        <div className="flex items-center gap-3">
          <input
            id={`peso-${placement}`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="80"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              setVeioDeMacros(false);
            }}
            className="w-32 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors"
            aria-describedby={`peso-ajuda-${placement}`}
          />
          <span className="text-gray-300 text-lg">kg</span>
        </div>
        {veioDeMacros && (
          <p className="text-gray-400 text-sm mt-2 border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}>
            Peso trazido da sua calculadora de macros. Pode alterar à vontade.
          </p>
        )}
        <p id={`peso-ajuda-${placement}`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {texto.trim() === ""
            ? "Exemplo: para 70 kg, 1,6 g/kg corresponde a 112 g de proteína por dia."
            : !valido
              ? "Confira o peso informado."
              : ""}
        </p>
      </div>

      {/* Resultados — aria-live anuncia a atualização para leitores de tela */}
      <div aria-live="polite">
        {valido && (
          <>
            {/*
              Grupo de opções, não três cartões enfeitados: teclado com setas,
              aria-checked e um só item na ordem de tabulação, como manda o
              padrão de radiogroup. A escolha vale para a divisão por refeição
              e para a mensagem compartilhada.
            */}
            <div role="radiogroup" aria-label="Escolha a referência de proteína" className="grid gap-4 sm:grid-cols-3 mb-2">
              {FAIXAS.map((f, i) => {
                const escolhida = f.id === faixaId;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={escolhida}
                    tabIndex={escolhida ? 0 : -1}
                    onClick={() => {
                      if (f.id !== faixaId) trackEvent("protein_range_select", { placement, range: f.id });
                      setFaixaId(f.id);
                    }}
                    onKeyDown={(e) => {
                      if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)) return;
                      e.preventDefault();
                      const passo = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
                      const proxima = FAIXAS[(i + passo + FAIXAS.length) % FAIXAS.length];
                      setFaixaId(proxima.id);
                      trackEvent("protein_range_select", { placement, range: proxima.id });
                      const alvo = raiz.current?.querySelector<HTMLButtonElement>(`[data-faixa="${proxima.id}"]`);
                      alvo?.focus();
                    }}
                    data-faixa={f.id}
                    className={`border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] ${
                      escolhida
                        ? "border-[#BA9E50] bg-[#BA9E50]/[0.08]"
                        : "border-white/15 hover:border-white/40"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: "#BA9E50" }}>
                        {f.titulo}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-4 w-4 flex-shrink-0 rounded-full border ${escolhida ? "border-[#BA9E50] bg-[#BA9E50]" : "border-white/30"}`}
                      />
                    </span>
                    <span className="block text-gray-400 text-sm mb-3">{String(f.gPorKg).replace(".", ",")} g/kg</span>
                    <span className="block text-white font-bold text-4xl leading-none mb-1" style={h}>
                      {gramasPorDia(peso, f.gPorKg)}
                      <span className="text-lg font-normal text-gray-300"> g</span>
                    </span>
                    <span className="block text-gray-400 text-xs mb-3">por dia</span>
                    <span className="block text-gray-300 text-sm leading-relaxed">{f.descricao}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">
              As três são referências educacionais para quem treina musculação —
              não três prescrições. A faixa vem de{" "}
              <a
                href={REFERENCIA_CIENTIFICA.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-1 hover:text-white transition-colors"
              >
                {REFERENCIA_CIENTIFICA.rotulo}
              </a>
              , e necessidades individuais variam.
            </p>

            {/* Dividir entre refeições */}
            <div className="border-t border-white/10 pt-5 mb-6">
              <p className="text-white text-sm font-semibold mb-3">Quer dividir sua proteína ao longo do dia?</p>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {[3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      if (refeicoes === null) trackEvent("protein_meals_open", { placement });
                      setRefeicoes(refeicoes === n ? null : n);
                    }}
                    aria-pressed={refeicoes === n}
                    className={`px-4 py-2.5 text-sm font-medium border transition-colors min-h-[44px] ${
                      refeicoes === n
                        ? "border-[#BA9E50] text-white bg-[#BA9E50]/10"
                        : "border-white/20 text-gray-300 hover:border-white/40"
                    }`}
                  >
                    {n} refeições
                  </button>
                ))}
                {/*
                  O seletor de g/kg que existia aqui saiu: agora a escolha
                  está nos cartões, e dois controles para a mesma decisão só
                  criavam a dúvida de qual manda.
                */}
              </div>
              {refeicoes !== null && totalPratico !== null && (
                <div>
                  <p className="text-gray-200 text-base">
                    Em {refeicoes} refeições:{" "}
                    <strong className="text-white text-xl" style={h}>
                      ≈ {gramasPorRefeicao(totalPratico, refeicoes)} g
                    </strong>{" "}
                    por refeição, usando {String(faixaSelecionada.gPorKg).replace(".", ",")} g/kg.
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Você não precisa dividir de forma perfeitamente igual — o total
                    diário continua sendo a principal referência.
                  </p>
                </div>
              )}
            </div>

            {/* Como isso aparece nos alimentos */}
            <div className="border-t border-white/10 pt-5 mb-6">
              <button
                type="button"
                onClick={() => {
                  if (!mostrarAlimentos) trackEvent("protein_food_examples_open", { placement });
                  setMostrarAlimentos(!mostrarAlimentos);
                }}
                aria-expanded={mostrarAlimentos}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}
              >
                Como essa quantidade aparece nos alimentos?
              </button>
              {mostrarAlimentos && (
                <div className="mt-4">
                  <p className="text-gray-400 text-sm mb-4 max-w-2xl">
                    Referências para dar noção de grandeza — isto não é um cardápio,
                    e ninguém deveria bater a meta com um alimento só.
                  </p>
                  <ul className="grid gap-2 sm:grid-cols-2 mb-4">
                    {ALIMENTOS.map((a) => (
                      <li key={a.nome} className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-2">
                        <span className="text-gray-300 text-sm">
                          {a.nome}
                          <span className="text-gray-500 text-xs"> · {a.porcao}</span>
                        </span>
                        <span className="text-white text-sm font-semibold whitespace-nowrap">
                          ≈ {a.proteinaG} g
                          <span className="text-gray-500 font-normal text-[11px]"> · {a.fonte}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">{NOTA_INDUSTRIALIZADOS}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{NOTA_FONTES}</p>
                </div>
              )}
            </div>

            {/* Ações e links contextuais */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <button
                type="button"
                onClick={copiarResultado}
                className="border border-white/25 text-gray-300 hover:text-white hover:border-white/50 text-sm px-4 py-2.5 transition-colors min-h-[44px]"
              >
                Copiar resultado
              </button>
              {valido && (
                <Compartilhar
                  contexto="tool-result"
                  titulo="Calculadora de Proteína"
                  caminho="/ferramentas/calculadora-de-proteina"
                  local="tool_result"
                  ferramenta="calculadora_proteina"
                  resultado={linhasShare}
                  gancho="Meu cálculo de proteína:"
                  aparencia="solido"
                />
              )}
              {placement !== "artigo-proteina-dia" && (
                <Link
                  href="/blog/quanta-proteina-por-dia-para-ganhar-massa-muscular"
                  onClick={() => trackEvent("protein_article_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors"
                  style={{ textDecorationColor: "#BA9E50" }}
                >
                  Entenda de onde vêm esses números →
                </Link>
              )}
            </div>

            {/*
              A ponte para a tabela nutricional.
              
              A calculadora entrega uma meta em gramas por dia, e gramas de
              proteína não são um alimento — a pessoa fica com o número e sem
              saber o que ele significa no prato. Este link fecha essa
              distância, e fica DEPOIS do resultado: quem ainda não tem a meta
              não tem o que consultar.
              
              Não monta dieta nem sugere cardápio: leva para consultar dado.
            */}
            <div className="border-t border-white/10 pt-4 mb-4">
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Quer saber quanta proteína existe nos alimentos que você já come?
              </p>
              <Link
                href="/alimentos"
                onClick={() => trackEvent("protein_food_search_click", { placement })}
                className="inline-flex items-center border border-white/25 text-gray-200 px-5 py-3 text-sm font-medium min-h-[48px] hover:border-white/50 transition-colors"
              >
                Pesquisar alimentos →
              </Link>
            </div>

            {/* Próximo passo — depois do valor entregue, nunca antes */}
            <PosResultado
              ferramenta="proteina"
              categoria={faixaSelecionada.gPorKg >= 2.2 ? "alta" : faixaSelecionada.gPorKg <= 1.6 ? "baixa" : "padrao"}
              resumo={totalPratico !== null ? `${totalPratico} g de proteína por dia` : null}
              placement={placement}
            />
          </>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        Esta calculadora oferece referências educacionais baseadas no peso
        corporal e não substitui avaliação individual de nutricionista ou
        médico. Necessidades variam conforme objetivo, idade, atividade e
        condições de saúde.
      </p>
    </div>
  );
}
