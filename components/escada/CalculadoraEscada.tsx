"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  ANDARES_EDIFICIO_ITALIA,
  ANDARES_MAX,
  DIAS_SEMANA,
  MET_DESCIDA,
  NOTA_ESTIMATIVA,
  NOTA_LINEAR,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_MAX,
  PESO_MIN,
  RITMOS,
  SEGUNDOS_DESCIDA_POR_ANDAR,
  SITUACOES,
  SUBIDAS_MAX,
  andaresValidos,
  arredondaKcal,
  calcula,
  formataTempo,
  kcalPorAndar,
  kcalPorMes,
  kgPorMes,
  parseNumero,
  pesoValido,
  ritmo,
  subidasValidas,
  type RitmoId,
} from "@/lib/escada";

/**
 * A Calculadora de Calorias Subindo Escada.
 *
 * OS ANDARES SÃO A CONTA
 *
 * A pessoa informa quantos andares sobe, quantas vezes por dia, em que
 * ritmo e se desce de escada. O resultado mostra o gasto do dia, quanto
 * custa cada andar e o que o hábito soma no mês — que é onde a escada
 * aparece de verdade, porque um dia só é pouco.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram o
 * ritmo, os andares e a frequência, nunca o peso.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const chip = (ativo: boolean) =>
  `px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
  }`;
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
/** Kcal arredondada e com ponto de milhar. */
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const um = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const int = (n: number) => Math.round(n).toLocaleString("pt-BR");
/** Abaixo de 1 kg, gramas: "0,0 kg" esconderia que o hábito soma alguma coisa. */
const peso = (kg: number) => (kg < 1 ? `${int(Math.round(kg * 1000 / 10) * 10)} g` : `${um(kg)} kg`);

export default function CalculadoraEscada({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [rt, setRt] = useState<RitmoId>("dia");
  const [andaresTexto, setAndaresTexto] = useState("");
  const [subidasTexto, setSubidasTexto] = useState("");
  const [desce, setDesce] = useState(true);
  const [dias, setDias] = useState(5);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const pesoKg = parseNumero(pesoTexto);
  const pesoOk = pesoValido(pesoKg);
  const andares = parseNumero(andaresTexto);
  const andaresOk = andaresValidos(andares);
  const subidas = parseNumero(subidasTexto);
  const subidasOk = subidasValidas(subidas);

  const resultado = pesoOk && andaresOk && subidasOk ? calcula(pesoKg, rt, andares, subidas, desce) : null;
  const mesKcal = resultado ? kcalPorMes(resultado, dias) : 0;
  const mesKg = resultado ? kgPorMes(resultado, dias) : 0;
  const andaresMes = resultado ? resultado.andaresTotais * dias * (52 / 12) : 0;
  const porAndar = pesoOk ? kcalPorAndar(pesoKg, rt) : 0;
  const outro: RitmoId = rt === "dia" ? "treino" : "dia";
  const porAndarOutro = pesoOk ? kcalPorAndar(pesoKg, outro) : 0;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("stairs_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const temResultado = resultado !== null;
  const nAndares = resultado ? resultado.andaresTotais : -1;
  useEffect(() => {
    if (temResultado && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("stairs_calculator_use", { placement, pace: rt, floors: nAndares, per_week: dias });
    }
  }, [temResultado, placement, rt, nAndares, dias]);

  const escolheSituacao = (id: string) => {
    const s = SITUACOES.find((x) => x.id === id)!;
    setAndaresTexto(String(s.andares));
    setSubidasTexto(String(s.subidas));
    setRt(s.ritmo);
    setDesce(s.desceDeEscada);
    trackEvent("stairs_preset", { placement, preset: id });
  };
  const situacaoAtiva = SITUACOES.find(
    (s) => andaresTexto === String(s.andares) && subidasTexto === String(s.subidas) && rt === s.ritmo && desce === s.desceDeEscada,
  )?.id;

  const resumoWhats = resultado ? `${resultado.andaresTotais} andares de escada por dia ≈ ${kc(resultado.kcal)} kcal` : null;
  const linhasShare = resultado ? [`${resultado.andaresTotais} andares por dia`, `≈ ${kc(resultado.kcal)} kcal`, `≈ ${int(mesKcal)} kcal por mês`] : [];
  const idc = (s: string) => `${s}-escada-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-escada"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto a sua escada gasta?
      </h2>

      <div className="mb-6">
        <label htmlFor={idc("peso")} className="block text-gray-300 text-sm font-medium mb-2">Quanto você pesa?</label>
        <div className="flex items-center gap-3">
          <input id={idc("peso")} type="text" inputMode="decimal" autoComplete="off" placeholder="70" value={pesoTexto}
            onChange={(e) => setPesoTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("peso-ajuda")} />
          <span className="text-gray-300 text-lg">kg</span>
        </div>
        <p id={idc("peso-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {pesoTexto.trim() !== "" && !pesoOk ? `Confira o peso informado (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""}
        </p>
      </div>

      <div className="mb-2">
        <span className="block text-gray-300 text-sm font-medium mb-2">Qual é a sua escada?</span>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {SITUACOES.map((s) => (
            <button key={s.id} type="button" aria-pressed={situacaoAtiva === s.id} className={chip(situacaoAtiva === s.id)}
              onClick={() => escolheSituacao(s.id)}>
              {s.nome}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-2 max-w-sm">
        <div>
          <label htmlFor={idc("andares")} className="block text-gray-300 text-sm font-medium mb-2">Andares</label>
          <input id={idc("andares")} type="text" inputMode="numeric" autoComplete="off" placeholder="2" value={andaresTexto}
            onChange={(e) => setAndaresTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
        <div>
          <label htmlFor={idc("subidas")} className="block text-gray-300 text-sm font-medium mb-2">Vezes por dia</label>
          <input id={idc("subidas")} type="text" inputMode="numeric" autoComplete="off" placeholder="4" value={subidasTexto}
            onChange={(e) => setSubidasTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-6 min-h-[20px] max-w-xl" data-testid="ajuda-andares">
        {!andaresOk && andaresTexto.trim() !== ""
          ? `Use de 1 a ${ANDARES_MAX} andares, em número inteiro.`
          : !subidasOk && subidasTexto.trim() !== ""
            ? `Use de 1 a ${SUBIDAS_MAX} subidas por dia, em número inteiro.`
            : "Andares de cada subida, e quantas vezes você sobe no dia."}
      </p>

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("ritmo")}>Em que ritmo?</span>
        <div role="group" aria-labelledby={idc("ritmo")} className="flex flex-wrap gap-2 mb-2">
          {RITMOS.map((r) => (
            <button key={r.id} type="button" aria-pressed={rt === r.id} className={chip(rt === r.id)} onClick={() => setRt(r.id)}>
              {r.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm" data-testid="ajuda-ritmo">{ritmo(rt).descricao}</p>
      </div>

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("desce")}>E para descer?</span>
        <div role="group" aria-labelledby={idc("desce")} className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={desce} className={chip(desce)} onClick={() => setDesce(true)}>Desço de escada</button>
          <button type="button" aria-pressed={!desce} className={chip(!desce)} onClick={() => setDesce(false)}>Desço de elevador</button>
        </div>
      </div>

      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sem")}>Quantos dias por semana?</span>
        <div role="group" aria-labelledby={idc("sem")} className="flex flex-wrap gap-2">
          {DIAS_SEMANA.map((n) => (
            <button key={n} type="button" onClick={() => { setDias(n); trackEvent("stairs_frequency", { placement, per_week: n }); }}
              aria-pressed={dias === n} className={chip(dias === n)}>
              {n === 7 ? "Todo dia" : `${n}×`}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {resultado && pesoOk && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Gasto estimado por dia</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {kc(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {int(resultado.andaresTotais)} andares em cerca de {formataTempo(resultado.minutosTotais)}
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">No mês, {dias === 7 ? "todo dia" : `${dias}× por semana`}</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                  {int(mesKcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">até {peso(mesKg)} de gordura, pela conta linear</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Descontando o que você gastaria parado, a escada acrescenta cerca de{" "}
              <strong className="text-white">{kc(resultado.kcalLiquida)} kcal</strong> ao seu dia
              {resultado.kcalDescida > 0 && <> — {kc(resultado.kcalDescida)} delas na descida</>}.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }} data-testid="nota-andar">
              Cada andar subido custa cerca de <strong className="text-white">{um(porAndar)} kcal</strong> no{" "}
              {ritmo(rt).nome.toLowerCase()}, e {um(porAndarOutro)} no {ritmo(outro).nome.toLowerCase()}. A pressa gasta mais por
              minuto, mas quase o mesmo por andar — o que soma é quantos andares você sobe, não a velocidade.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl" data-testid="nota-mes">
              No mês são cerca de {int(andaresMes)} andares
              {andaresMes >= ANDARES_EDIFICIO_ITALIA && <> — {(andaresMes / ANDARES_EDIFICIO_ITALIA).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} vezes o Edifício Itália, em São Paulo</>}.
            </p>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_LINEAR}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("stairs_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto. O Compêndio de Atividades Físicas mede
                    subir escada em {metF(ritmo("dia").met)} METs no passo do dia a dia e {metF(ritmo("treino").met)} em ritmo rápido, e
                    descer em {metF(MET_DESCIDA)}.
                  </p>
                  <p>
                    Os minutos saem dos andares: cerca de {ritmo("dia").segundosPorAndar} segundos por andar no passo do dia a dia,{" "}
                    {ritmo("treino").segundosPorAndar} no ritmo de treino e {SEGUNDOS_DESCIDA_POR_ANDAR} descendo — um andar com uns 17
                    degraus. É a parte mais incerta da conta.
                  </p>
                  <p>O mês soma os dias escolhidos, a 7.700 kcal por quilo de gordura. É teto: o corpo compensa parte do gasto.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias Subindo Escada" caminho="/ferramentas/calculadora-calorias-escada"
                local="tool_result" ferramenta="escada" resultado={linhasShare} gancho="Descobri quanto a escada do meu dia gasta:" aparencia="solido" />
              {placement !== "calculadora-calorias-escada" && (
                <Link href="/ferramentas/calculadora-calorias-escada" onClick={() => trackEvent("stairs_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="escada" categoria="padrao" resumo={resumoWhats} placement={placement} />
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {NOTA_SEM_PERDA_LOCALIZADA} {NOTA_SEGURANCA}{" "}
        <Link href="/blog/neat-gasto-calorico-diario" className={ln}>Entenda o que é o NEAT</Link>.
      </p>
    </div>
  );
}
