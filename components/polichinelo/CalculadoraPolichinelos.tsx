"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  CADENCIA_MAX,
  CADENCIA_MIN,
  INTENSIDADES,
  INTENSIDADE_PADRAO,
  KCAL_MAX,
  KCAL_MIN,
  MINUTOS_ALERTA,
  NOTA_ESTIMATIVA,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  NOTA_VOLUME_ALTO,
  PESO_MAX,
  PESO_MIN,
  PRESETS_QUANTIDADE,
  QTD_MAX,
  QTD_MIN,
  RITMOS_CAMINHADA,
  RITMO_CAMINHADA_PADRAO,
  TEMPOS_CAMINHADA,
  arredondaKcal,
  arredondaQuantidade,
  cadenciaValida,
  deKcal,
  deQuantidade,
  equivalenteACaminhada,
  formataTempo,
  fraseContexto,
  intensidade,
  kcalValida,
  parseNumero,
  pesoValido,
  quantidadeValida,
  ritmoCaminhada,
  type IntensidadeId,
  type RitmoCaminhadaId,
} from "@/lib/polichinelo";

/**
 * A Calculadora de Polichinelos.
 *
 * QUATRO MODOS, UMA PERGUNTA DE CADA VEZ
 *
 * As buscas que trazem gente para cá pedem coisas diferentes — umas têm a
 * quantidade e querem as calorias, outras têm a meta e querem a
 * quantidade, outras querem comparar com caminhada. Servir tudo num
 * formulário só produziria uma tela com seis campos em que nenhum é
 * obviamente o primeiro. Por isso a pessoa escolhe a pergunta antes de ver
 * qualquer campo.
 *
 * O PESO ATRAVESSA OS MODOS
 *
 * Ele é o único dado comum aos quatro. Trocar de modo e ter de digitar o
 * peso de novo seria atrito puro, então ele fica no estado do componente —
 * e em lugar nenhum além dele.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador: nenhuma chamada de rede,
 * nada gravado, e os eventos registram uso e modo, nunca valor. O resumo
 * que vai para a mensagem de WhatsApp carrega calorias e quantidade —
 * resultado —, jamais o peso que os gerou.
 *
 * SEM BOTÃO "CALCULAR" NOS MODOS DIRETOS
 *
 * O cálculo é instantâneo porque é uma multiplicação: exigir clique para
 * ver um número que já existe é cerimônia. O que não pode faltar é o
 * aria-live, para quem usa leitor de tela saber que o resultado mudou.
 */

type Modo = "calorias" | "quantidade" | "tempo" | "caminhada";

const MODOS: { id: Modo; rotulo: string; pergunta: string }[] = [
  { id: "calorias", rotulo: "Quantas calorias eu gasto", pergunta: "Quantas calorias meus polichinelos gastam?" },
  { id: "quantidade", rotulo: "Quantos polichinelos fazer", pergunta: "Quantos polichinelos para gastar o que eu quero?" },
  { id: "tempo", rotulo: "Quanto tempo preciso", pergunta: "Quanto tempo de polichinelo eu preciso fazer?" },
  { id: "caminhada", rotulo: "Comparar com caminhada", pergunta: "Quantos polichinelos equivalem a uma caminhada?" },
];

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";

const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";

export default function CalculadoraPolichinelos({ placement }: { placement: string }) {
  const [modo, setModo] = useState<Modo>("calorias");
  const [pesoTexto, setPesoTexto] = useState("");
  const [qtdTexto, setQtdTexto] = useState("");
  const [kcalTexto, setKcalTexto] = useState("");
  const [intensidadeId, setIntensidadeId] = useState<IntensidadeId>(INTENSIDADE_PADRAO);
  const [ritmoId, setRitmoId] = useState<RitmoCaminhadaId>(RITMO_CAMINHADA_PADRAO);
  const [minutosCaminhada, setMinutosCaminhada] = useState<number>(30);
  const [mostrarCadencia, setMostrarCadencia] = useState(false);
  const [cadenciaTexto, setCadenciaTexto] = useState("");
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = useMemo(() => parseNumero(pesoTexto), [pesoTexto]);
  const pesoOk = pesoValido(peso);

  const qtd = useMemo(() => parseNumero(qtdTexto), [qtdTexto]);
  const qtdOk = quantidadeValida(qtd);

  const alvoKcal = useMemo(() => parseNumero(kcalTexto), [kcalTexto]);
  const kcalOk = kcalValida(alvoKcal);

  const inten = intensidade(intensidadeId);
  const cadenciaCustom = useMemo(() => parseNumero(cadenciaTexto), [cadenciaTexto]);
  /* A cadência personalizada só entra se foi aberta, preenchida e válida. */
  const cadencia = mostrarCadencia && cadenciaValida(cadenciaCustom) ? cadenciaCustom : inten.cadencia;

  const ritmo = ritmoCaminhada(ritmoId);

  /* O resultado de cada modo. Null enquanto faltar dado — a view não inventa zero. */
  const resultado = useMemo(() => {
    if (!pesoOk) return null;
    if (modo === "calorias") return qtdOk ? deQuantidade(qtd, peso, inten.met, cadencia) : null;
    if (modo === "quantidade" || modo === "tempo")
      return kcalOk ? deKcal(alvoKcal, peso, inten.met, cadencia) : null;
    return equivalenteACaminhada(minutosCaminhada, peso, ritmo.met, inten.met, cadencia).polichinelo;
  }, [modo, pesoOk, peso, qtdOk, qtd, kcalOk, alvoKcal, inten.met, cadencia, minutosCaminhada, ritmo.met]);

  const kcalCaminhada = useMemo(
    () => (pesoOk && modo === "caminhada"
      ? equivalenteACaminhada(minutosCaminhada, peso, ritmo.met, inten.met, cadencia).kcalCaminhada
      : null),
    [pesoOk, peso, modo, minutosCaminhada, ritmo.met, inten.met, cadencia],
  );

  const volumeAlto = resultado !== null && resultado.minutos > MINUTOS_ALERTA;

  /** View: só quando o bloco entra de fato na tela. */
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("jumping_jack_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  /** Uso: a primeira vez que sai um resultado. Sem o peso, sem o número. */
  useEffect(() => {
    if (resultado && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("jumping_jack_calculator_use", { placement, mode: modo, intensity: intensidadeId });
    }
  }, [resultado, placement, modo, intensidadeId]);

  function trocaModo(novo: Modo) {
    if (novo === modo) return;
    setModo(novo);
    trackEvent("jumping_jack_mode_selected", { placement, mode: novo });
  }

  /*
   * O resumo que vai para o WhatsApp: calorias, quantidade e tempo. O peso
   * fica fora — ele é a entrada, não o resultado, e é dado do corpo.
   */
  const linhasShare = resultado
    ? [
        `${arredondaQuantidade(resultado.quantidade)} polichinelos`,
        `≈ ${formataTempo(resultado.minutos)}`,
        `≈ ${arredondaKcal(resultado.kcal)} kcal`,
      ]
    : [];

  const resumoWhats = resultado
    ? `${arredondaQuantidade(resultado.quantidade)} polichinelos ≈ ${arredondaKcal(resultado.kcal)} kcal`
    : null;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-polichinelos"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />

      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        O que você quer descobrir?
      </h2>

      {/* Escolha do modo */}
      <div role="group" aria-label="O que você quer descobrir" className="grid gap-2.5 sm:grid-cols-2 mb-7">
        {MODOS.map((m) => {
          const ativo = m.id === modo;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => trocaModo(m.id)}
              aria-pressed={ativo}
              className={`text-left px-4 py-3.5 border transition-colors min-h-[44px] ${
                ativo
                  ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white"
                  : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
              }`}
            >
              <span className="font-semibold text-sm sm:text-base">{m.rotulo}</span>
            </button>
          );
        })}
      </div>

      {/* Peso — comum aos quatro modos */}
      <div className="mb-6">
        <label htmlFor={`peso-${placement}`} className="block text-gray-300 text-sm font-medium mb-2">
          Quanto você pesa?
        </label>
        <div className="flex items-center gap-3">
          <input
            id={`peso-${placement}`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="70"
            value={pesoTexto}
            onChange={(e) => setPesoTexto(e.target.value)}
            className={`w-32 ${campo}`}
            aria-describedby={`peso-ajuda-${placement}`}
          />
          <span className="text-gray-300 text-lg">kg</span>
        </div>
        <p id={`peso-ajuda-${placement}`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {pesoTexto.trim() === ""
            ? "É o que mais muda o resultado: corpos mais pesados gastam mais energia no mesmo movimento."
            : !pesoOk
              ? `Confira o peso informado (entre ${PESO_MIN} e ${PESO_MAX} kg).`
              : ""}
        </p>
      </div>

      {/* Campo específico do modo */}
      {modo === "calorias" && (
        <div className="mb-6">
          <label htmlFor={`qtd-${placement}`} className="block text-gray-300 text-sm font-medium mb-2">
            Quantos polichinelos?
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {PRESETS_QUANTIDADE.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setQtdTexto(String(p));
                  trackEvent("jumping_jack_preset", { placement, preset: p });
                }}
                aria-pressed={qtdTexto === String(p)}
                className={`px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
                  qtdTexto === String(p)
                    ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white"
                    : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <input
            id={`qtd-${placement}`}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="100"
            value={qtdTexto}
            onChange={(e) => setQtdTexto(e.target.value)}
            className={`w-36 ${campo}`}
            aria-describedby={`qtd-ajuda-${placement}`}
          />
          <p id={`qtd-ajuda-${placement}`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {qtdTexto.trim() !== "" && !qtdOk ? `Use um número inteiro entre ${QTD_MIN} e ${QTD_MAX}.` : ""}
          </p>
        </div>
      )}

      {(modo === "quantidade" || modo === "tempo") && (
        <div className="mb-6">
          <label htmlFor={`kcal-${placement}`} className="block text-gray-300 text-sm font-medium mb-2">
            Quantas calorias você quer gastar?
          </label>
          <div className="flex items-center gap-3">
            <input
              id={`kcal-${placement}`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="100"
              value={kcalTexto}
              onChange={(e) => setKcalTexto(e.target.value)}
              className={`w-36 ${campo}`}
              aria-describedby={`kcal-ajuda-${placement}`}
            />
            <span className="text-gray-300 text-lg">kcal</span>
          </div>
          <p id={`kcal-ajuda-${placement}`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {kcalTexto.trim() !== "" && !kcalOk ? `Use um valor entre ${KCAL_MIN} e ${KCAL_MAX} kcal.` : ""}
          </p>
        </div>
      )}

      {modo === "caminhada" && (
        <div className="mb-6 space-y-5">
          <div>
            <span className="block text-gray-300 text-sm font-medium mb-2" id={`tempo-cam-${placement}`}>
              Quanto tempo de caminhada?
            </span>
            <div role="group" aria-labelledby={`tempo-cam-${placement}`} className="flex flex-wrap gap-2">
              {TEMPOS_CAMINHADA.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMinutosCaminhada(t)}
                  aria-pressed={minutosCaminhada === t}
                  className={`px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
                    minutosCaminhada === t
                      ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white"
                      : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {t} min
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-gray-300 text-sm font-medium mb-2" id={`ritmo-cam-${placement}`}>
              Ritmo da caminhada
            </span>
            <div role="group" aria-labelledby={`ritmo-cam-${placement}`} className="flex flex-wrap gap-2">
              {RITMOS_CAMINHADA.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRitmoId(r.id)}
                  aria-pressed={ritmoId === r.id}
                  className={`px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
                    ritmoId === r.id
                      ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white"
                      : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {r.nome}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-2">{ritmo.velocidade}</p>
          </div>
        </div>
      )}

      {/* Intensidade — comum aos quatro */}
      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={`inten-${placement}`}>
          Em que ritmo você faz os polichinelos?
        </span>
        <div role="group" aria-labelledby={`inten-${placement}`} className="flex flex-wrap gap-2">
          {INTENSIDADES.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => setIntensidadeId(i.id)}
              aria-pressed={intensidadeId === i.id}
              className={`px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
                intensidadeId === i.id
                  ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white"
                  : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
              }`}
            >
              {i.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">
          {inten.comoReconhecer} <span className="text-gray-500">Cerca de {cadencia} por minuto.</span>
        </p>
      </div>

      {/* Cadência exata — opção avançada, fechada por padrão */}
      <div className="mb-7">
        {!mostrarCadencia ? (
          <button
            type="button"
            onClick={() => {
              trackEvent("jumping_jack_cadence_open", { placement });
              setMostrarCadencia(true);
            }}
            className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
            style={{ textDecorationColor: "#BA9E50" }}
          >
            Sabe quantos você faz por minuto? Deixa o tempo mais preciso
          </button>
        ) : (
          <div>
            <label htmlFor={`cad-${placement}`} className="block text-gray-300 text-sm font-medium mb-2">
              Polichinelos por minuto <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                id={`cad-${placement}`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder={String(inten.cadencia)}
                value={cadenciaTexto}
                onChange={(e) => setCadenciaTexto(e.target.value)}
                className={`w-28 ${campo}`}
                aria-describedby={`cad-ajuda-${placement}`}
              />
              <span className="text-gray-300 text-lg">por min</span>
            </div>
            <p id={`cad-ajuda-${placement}`} className="text-gray-400 text-sm mt-2 max-w-xl">
              {cadenciaTexto.trim() !== "" && !cadenciaValida(cadenciaCustom)
                ? `Use um valor entre ${CADENCIA_MIN} e ${CADENCIA_MAX}.`
                : "A cadência muda o tempo que a quantidade leva. O gasto por minuto continua vindo da intensidade escolhida acima."}
            </p>
          </div>
        )}
      </div>

      {/* Resultado */}
      <div aria-live="polite">
        {resultado && pesoOk && (
          <>
            <div className="border-t border-white/10 pt-7">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>
                Seu resultado
              </p>

              <div className="grid gap-4 sm:grid-cols-3 mb-5">
                <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                  <p className="text-gray-400 text-xs mb-1">Gasto estimado</p>
                  <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                    {arredondaKcal(resultado.kcal)}
                    <span className="text-lg font-normal text-gray-300"> kcal</span>
                  </p>
                </div>
                <div className="border border-white/15 p-5">
                  <p className="text-gray-400 text-xs mb-1">Polichinelos</p>
                  <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                    {arredondaQuantidade(resultado.quantidade)}
                  </p>
                </div>
                <div className="border border-white/15 p-5">
                  <p className="text-gray-400 text-xs mb-1">Tempo aproximado</p>
                  <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                    {formataTempo(resultado.minutos)}
                  </p>
                </div>
              </div>

              {/* Comparação com caminhada — sempre presente, é meia busca do cluster */}
              {modo === "caminhada" && kcalCaminhada !== null ? (
                <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
                  {minutosCaminhada} minutos de caminhada {ritmo.nome.toLowerCase()} para alguém de{" "}
                  {Math.round(peso)} kg representam cerca de{" "}
                  <strong className="text-white">{arredondaKcal(kcalCaminhada)} kcal</strong>. Para chegar a um
                  gasto energético parecido com polichinelos seriam{" "}
                  <strong className="text-white">{arredondaQuantidade(resultado.quantidade)}</strong>, em torno de{" "}
                  {formataTempo(resultado.minutos)}. É equivalência aproximada de gasto, não de efeito: os dois
                  exercícios pedem coisas diferentes do corpo.
                </p>
              ) : (
                <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
                  {fraseContexto(peso, resultado, inten.nome)}
                </p>
              )}

              {volumeAlto && (
                <p
                  className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4"
                  style={{ borderColor: "#BA9E50" }}
                >
                  {NOTA_VOLUME_ALTO}
                </p>
              )}

              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA}</p>

              {/* Metodologia */}
              <div className="border-t border-white/10 pt-5 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    if (!mostrarMetodo) trackEvent("jumping_jack_methodology_open", { placement });
                    setMostrarMetodo(!mostrarMetodo);
                  }}
                  aria-expanded={mostrarMetodo}
                  className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                  style={{ textDecorationColor: "#BA9E50" }}
                >
                  Como calculamos
                </button>
                {mostrarMetodo && (
                  <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                    <p>
                      O gasto por minuto vem da equação de METs:{" "}
                      <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>. Para{" "}
                      {Math.round(peso)} kg em ritmo {inten.nome.toLowerCase()} ({inten.met} METs), isso dá cerca
                      de {(resultado.kcal / Math.max(resultado.minutos, 0.0001)).toFixed(1).replace(".", ",")}{" "}
                      kcal por minuto.
                    </p>
                    <p>
                      O MET de {inten.met} é {inten.origem}. O Compêndio não tem uma linha só para polichinelo —
                      ele aparece como exemplo dentro das entradas de calistenia, que é a categoria
                      fisiologicamente mais próxima.
                    </p>
                    <p>
                      O tempo sai da cadência: {arredondaQuantidade(resultado.quantidade)} polichinelos a{" "}
                      {cadencia} por minuto dão {formataTempo(resultado.minutos)}.
                    </p>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Compartilhar
                  contexto="tool-result"
                  titulo="Calculadora de Polichinelos"
                  caminho="/ferramentas/calculadora-polichinelos"
                  local="tool_result"
                  ferramenta="polichinelos"
                  resultado={linhasShare}
                  gancho="Descobri quantas calorias meus polichinelos gastam:"
                  aparencia="solido"
                />
                {placement !== "calculadora-polichinelos" && (
                  <Link
                    href="/ferramentas/calculadora-polichinelos"
                    onClick={() => trackEvent("jumping_jack_tool_click", { placement })}
                    className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors"
                    style={{ textDecorationColor: "#BA9E50" }}
                  >
                    Ver a calculadora completa →
                  </Link>
                )}
              </div>

              <PosResultado
                ferramenta="polichinelos"
                categoria={volumeAlto ? "volume_alto" : "padrao"}
                resumo={resumoWhats}
                placement={placement}
              />
            </div>
          </>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {NOTA_SEM_PERDA_LOCALIZADA} {NOTA_SEGURANCA}{" "}
        <Link href="/blog/deficit-calorico-como-calcular" className={ln}>
          Entenda como funciona o déficit calórico
        </Link>
        .
      </p>
    </div>
  );
}
