"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  ALTURA_MAX,
  ALTURA_MIN,
  GORDURA_MAX,
  GORDURA_MIN,
  NIVEIS,
  NIVEL_PADRAO,
  NOTA_GORDURA_ESTIMADA,
  NOTA_NAO_E_PAREDE,
  NOTA_NAO_PRESCREVE,
  NOTA_TAXAS_OTIMISTAS,
  NOTA_TEMPO_OTIMISTA,
  PESO_MAX,
  PESO_MIN,
  alturaValida,
  calcula,
  formataFFMI,
  formataKg,
  formataMeses,
  gorduraValida,
  leitura,
  nivel as nivelDe,
  parseAltura,
  parseNumero,
  pesoValido,
  type NivelId,
  type Sexo,
} from "@/lib/potencial";

/**
 * A Calculadora de Potencial Natural.
 *
 * O RESULTADO PRINCIPAL NÃO É O FFMI
 *
 * É quanto ainda dá para ganhar e em quanto tempo. O FFMI aparece porque
 * é o que a busca procura, mas ele sozinho não diz nada acionável — e o
 * número 25 já foi transformado em parede por muita gente que nunca leu o
 * estudo. A tela trata o FFMI como referência, nunca como veredito.
 *
 * O PERCENTUAL DE GORDURA É A ENTRADA FRÁGIL
 *
 * Toda a conta depende dele, e quase todo mundo o conhece por balança de
 * bioimpedância, que erra fácil cinco pontos. A tela diz isso antes do
 * resultado, não depois — quem vai ler um número sobre o próprio corpo
 * precisa saber a margem antes de acreditar nele.
 *
 * PRIVACIDADE
 *
 * Altura, peso e gordura são dados do corpo. Nada sai do navegador, nada
 * é gravado, e os eventos levam só a leitura e o nível — nunca os valores.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const chip = (ativo: boolean) =>
  `px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
  }`;
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });

export default function CalculadoraPotencial({ placement }: { placement: string }) {
  const [sexo, setSexo] = useState<Sexo>("homem");
  const [alturaTexto, setAlturaTexto] = useState("");
  const [pesoTexto, setPesoTexto] = useState("");
  const [gorduraTexto, setGorduraTexto] = useState("");
  const [nivelId, setNivelId] = useState<NivelId>(NIVEL_PADRAO);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const altura = parseAltura(alturaTexto);
  const peso = parseNumero(pesoTexto);
  const gordura = parseNumero(gorduraTexto);
  const alturaOk = alturaValida(altura);
  const pesoOk = pesoValido(peso);
  const gorduraOk = gorduraValida(gordura);

  const resultado = alturaOk && pesoOk && gorduraOk ? calcula(altura, peso, gordura, sexo, nivelId) : null;
  const lei = resultado ? leitura(resultado) : null;
  const niv = nivelDe(nivelId);

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("potential_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  useEffect(() => {
    if (lei && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("potential_calculator_use", { placement, reading: lei, level: nivelId });
    }
  }, [lei, placement, nivelId]);

  const resumoWhats = resultado
    ? resultado.naReferencia
      ? `meu FFMI está em ${formataFFMI(resultado.ffmiNormalizado)}, na faixa de referência`
      : `meu FFMI está em ${formataFFMI(resultado.ffmiNormalizado)} e ainda cabem ${formataKg(resultado.faltaAteReferencia)} de massa magra`
    : null;
  const linhasShare = resultado
    ? [`FFMI ${formataFFMI(resultado.ffmiNormalizado)}`, `Massa magra: ${formataKg(resultado.massaMagra)}`]
    : [];
  const idc = (s: string) => `${s}-pot-${placement}`;

  return (
    <div ref={raiz} className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative" data-testid="calculadora-potencial">
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · nada sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto músculo ainda dá para ganhar?
      </h2>

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sexo")}>Você é</span>
        <div role="group" aria-labelledby={idc("sexo")} className="flex flex-wrap gap-2">
          {(["homem", "mulher"] as Sexo[]).map((s) => (
            <button key={s} type="button" onClick={() => setSexo(s)} aria-pressed={sexo === s} className={chip(sexo === s)}>
              {s === "homem" ? "Homem" : "Mulher"}
            </button>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-2 max-w-xl">
          A referência muda: a de homens vem do estudo de 1995 que popularizou o número 25; a de mulheres vem de
          outra literatura, com base mais recente e amostra diferente.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 mb-6">
        <div>
          <label htmlFor={idc("altura")} className="block text-gray-300 text-sm font-medium mb-2">Altura</label>
          <div className="flex items-center gap-3">
            <input id={idc("altura")} type="text" inputMode="decimal" autoComplete="off" placeholder="1,75" value={alturaTexto}
              onChange={(e) => setAlturaTexto(e.target.value)} className={`w-28 ${campo}`} aria-describedby={idc("altura-ajuda")} />
            <span className="text-gray-300 text-lg">m</span>
          </div>
          <p id={idc("altura-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {alturaTexto.trim() !== "" && !alturaOk ? `Use algo entre ${fmt(ALTURA_MIN, 2)} e ${fmt(ALTURA_MAX, 2)} m.` : ""}
          </p>
        </div>
        <div>
          <label htmlFor={idc("peso")} className="block text-gray-300 text-sm font-medium mb-2">Peso</label>
          <div className="flex items-center gap-3">
            <input id={idc("peso")} type="text" inputMode="decimal" autoComplete="off" placeholder="75" value={pesoTexto}
              onChange={(e) => setPesoTexto(e.target.value)} className={`w-28 ${campo}`} aria-describedby={idc("peso-ajuda")} />
            <span className="text-gray-300 text-lg">kg</span>
          </div>
          <p id={idc("peso-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {pesoTexto.trim() !== "" && !pesoOk ? `Entre ${PESO_MIN} e ${PESO_MAX} kg.` : ""}
          </p>
        </div>
        <div>
          <label htmlFor={idc("gordura")} className="block text-gray-300 text-sm font-medium mb-2">Gordura corporal</label>
          <div className="flex items-center gap-3">
            <input id={idc("gordura")} type="text" inputMode="decimal" autoComplete="off" placeholder={sexo === "homem" ? "15" : "25"} value={gorduraTexto}
              onChange={(e) => setGorduraTexto(e.target.value)} className={`w-28 ${campo}`} aria-describedby={idc("gordura-ajuda")} />
            <span className="text-gray-300 text-lg">%</span>
          </div>
          <p id={idc("gordura-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {gorduraTexto.trim() !== "" && !gorduraOk ? `Entre ${GORDURA_MIN}% e ${GORDURA_MAX}%.` : ""}
          </p>
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
        {NOTA_GORDURA_ESTIMADA}
      </p>

      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("nivel")}>Há quanto tempo você treina sério?</span>
        <div role="group" aria-labelledby={idc("nivel")} className="flex flex-wrap gap-2">
          {NIVEIS.map((n) => (
            <button key={n.id} type="button" onClick={() => setNivelId(n.id)} aria-pressed={nivelId === n.id} className={chip(nivelId === n.id)}>
              {n.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">{niv.descricao}</p>
      </div>

      <div aria-live="polite">
        {resultado && lei && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>

            <div className="grid gap-4 sm:grid-cols-3 mb-5">
              <div className={resultado.naReferencia ? "border border-white/15 p-5" : "border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5"}>
                <p className="text-gray-400 text-xs mb-1">{resultado.naReferencia ? "Massa magra" : "Ainda cabem"}</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                  {resultado.naReferencia ? formataKg(resultado.massaMagra) : formataKg(resultado.faltaAteReferencia)}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {resultado.naReferencia ? "de massa magra hoje" : "de massa magra até a referência"}
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Seu FFMI</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>{formataFFMI(resultado.ffmiNormalizado)}</p>
                <p className="text-gray-400 text-sm mt-1">referência: {resultado.referencia}</p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Ritmo de hoje</p>
                <p className="text-white font-bold text-2xl sm:text-3xl leading-none" style={h}>
                  {fmt(resultado.ganhoMensal.min, 2)} a {fmt(resultado.ganhoMensal.max, 2)} kg
                </p>
                <p className="text-gray-400 text-sm mt-1">por mês, no seu nível</p>
              </div>
            </div>

            {/* A leitura: o que o número quer dizer, em frase. */}
            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              {lei === "na-referencia" ? (
                <>
                  Com {formataKg(resultado.massaMagra)} de massa magra a {fmt(resultado.alturaM, 2)} m, o seu FFMI está{" "}
                  <strong className="text-white">na faixa de referência ou acima dela</strong>. Isso coloca você entre as
                  pessoas mais musculosas que a literatura mediu sem uso de esteroides — e, na prática, significa que
                  daqui para frente o ganho será medido em gramas por mês, não em quilos.
                </>
              ) : lei === "perto" ? (
                <>
                  Você está <strong className="text-white">perto da faixa de referência</strong>: faltam cerca de{" "}
                  {formataKg(resultado.faltaAteReferencia)} de massa magra, o que levaria você a algo em torno de{" "}
                  {formataKg(resultado.pesoNaReferencia)} mantendo o mesmo percentual de gordura. É a região em que o
                  ganho fica lento de verdade e a paciência passa a valer mais que o programa.
                </>
              ) : lei === "caminho" ? (
                <>
                  Você está <strong className="text-white">no meio do caminho</strong>: faltam cerca de{" "}
                  {formataKg(resultado.faltaAteReferencia)} de massa magra até a referência, o que daria por volta de{" "}
                  {formataKg(resultado.pesoNaReferencia)} no mesmo percentual de gordura. Há bastante espaço — e é a
                  fase em que treino bem feito ainda rende resultado visível.
                </>
              ) : (
                <>
                  Você tem <strong className="text-white">muito espaço pela frente</strong>: faltam cerca de{" "}
                  {formataKg(resultado.faltaAteReferencia)} de massa magra até a referência. Com esse tanto de margem, o
                  que decide não é potencial — é começar e manter.
                </>
              )}
            </p>

            {resultado.mesesAteReferencia && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
                {resultado.longe ? (
                  <>
                    No ritmo de hoje, chegar lá levaria <strong className="text-white">mais de cinco anos</strong> — e é
                    por isso que a ferramenta para de contar aqui. {NOTA_TEMPO_OTIMISTA}
                  </>
                ) : (
                  <>
                    No ritmo do seu nível, isso levaria entre{" "}
                    <strong className="text-white">{formataMeses(resultado.mesesAteReferencia.min)}</strong> e{" "}
                    <strong className="text-white">{formataMeses(resultado.mesesAteReferencia.max)}</strong>.{" "}
                    {NOTA_TEMPO_OTIMISTA}
                  </>
                )}
              </p>
            )}

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
              {NOTA_NAO_E_PAREDE}
            </p>
            {lei === "na-referencia" && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">{NOTA_NAO_PRESCREVE}</p>
            )}
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_TAXAS_OTIMISTAS}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("potential_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    A massa magra sai do peso menos a gordura: {fmt(resultado.pesoKg)} kg × (1 − {fmt(resultado.gorduraPct)}%) ={" "}
                    <span className="text-white">{formataKg(resultado.massaMagra)}</span>.
                  </p>
                  <p>
                    O FFMI é massa magra dividida pela altura ao quadrado, mais a correção de{" "}
                    <span className="text-white">6,3 × (1,80 − altura)</span> que normaliza tudo para um corpo de 1,80 m.
                    Sem ela, quem é mais baixo apareceria com FFMI inflado — a altura entra ao quadrado no denominador, mas
                    massa magra não cresce ao quadrado com a estatura. No seu caso: {formataFFMI(resultado.ffmi)} bruto virou{" "}
                    {formataFFMI(resultado.ffmiNormalizado)} normalizado.
                  </p>
                  <p>
                    O ritmo mensal vem do modelo de Aragon, que expressa o ganho como percentual do peso por mês e o faz
                    cair com o tempo de treino: {fmt(niv.taxa.min * 100, 2)}% a {fmt(niv.taxa.max * 100, 2)}% para quem
                    está em &ldquo;{niv.nome.toLowerCase()}&rdquo;.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Potencial Natural" caminho="/ferramentas/potencial-natural"
                local="tool_result" ferramenta="potencial" resultado={linhasShare} gancho="Calculei quanto músculo ainda dá para ganhar:" aparencia="solido" />
              {placement !== "potencial-natural" && (
                <Link href="/ferramentas/potencial-natural" onClick={() => trackEvent("potential_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="potencial" categoria={lei} resumo={resumoWhats} placement={placement} />
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {NOTA_NAO_PRESCREVE}{" "}
        <Link href="/ferramentas/calculadora-volume-treino" className={ln}>Confira o volume do seu treino</Link>.
      </p>
    </div>
  );
}
