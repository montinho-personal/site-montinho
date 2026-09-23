"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  ALIMENTOS_ESTIMADOR,
  ATALHOS_INVERSO,
  AVISO_SEGURANCA,
  CONSUMO_MAX,
  NOTA_REFERENCIA,
  OBJETIVOS,
  PACOTES_ATALHO,
  PESO_MAX,
  PESO_MIN,
  PORCOES_MAX,
  compara,
  consumoValido,
  custo,
  diasSemanaValido,
  dose,
  duracao,
  estadoRotulo,
  estimaConsumo,
  faixaFalta,
  faixaPeso,
  falta,
  medidaValida,
  medidas,
  meta,
  pacoteValido,
  parseNumero,
  pesoValido,
  precoValido,
  produtoValido,
  proteinaEm,
  proteinaPorcao,
  rotuloCalculavel,
  type EstadoRotulo,
  type Objetivo,
} from "@/lib/whey";

/**
 * A Calculadora de Whey.
 *
 * A ORDEM É A DA CONTA
 *
 * Peso, objetivo e treino dão a meta de proteína. Depois vem quanto a pessoa
 * já come, e só então o rótulo do whey dela. Cada passo aparece quando o
 * anterior tem resposta: quem chega não vê quinze campos, vê três.
 *
 * WHEY NÃO É A META
 *
 * Se a alimentação já chega na meta, a tela diz isso e não mostra dose. Se
 * falta muito, a tela diz que a comida precisa ser revista antes de pôr
 * tudo no suplemento. O pacote, o custo e o comparador são opcionais.
 *
 * PRIVACIDADE
 *
 * Nada sai do navegador. Os eventos levam faixa de peso e faixa do que
 * falta, nunca o peso, o consumo ou o preço.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const campoP =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-lg font-semibold px-3 py-2.5 outline-none transition-colors w-full";
const chip = (ativo: boolean) =>
  `px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] text-left ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
  }`;
const toggle = "text-white font-semibold underline underline-offset-4 decoration-1 min-h-[44px] text-left";
const secao = "border-t border-white/10 pt-6 mt-6";
const rotuloPasso = "text-[11px] font-semibold tracking-[0.18em] uppercase mb-2";
const g = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const g2 = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
const reais = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const numero = (t: string) => parseNumero(t.replace(/^R\$\s*/i, "").replace(/\s/g, "").replace(/g$/i, ""));
const gkg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const reduzMovimento = () => typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Alvo = "meta" | "falta" | "dose" | "estimador" | null;

const AVISO_ROTULO: Record<EstadoRotulo, string> = {
  ok: "",
  porcaoInvalida: "Confira a porção do rótulo, em gramas: entre 5 e 100 g.",
  proteinaInvalida: "Informe quantos gramas de proteína a porção fornece.",
  impossivel: "A proteína não pode ser maior que a porção inteira. Confira os dois números no rótulo.",
  baixa: "Menos de 50% de proteína é incomum para whey — pode ser um hipercalórico ou blend. Confira o rótulo; a conta usa o valor informado.",
  alta: "Acima de 95% de proteína é incomum até para whey isolado. Confira o rótulo; a conta usa o valor informado.",
};

export default function CalculadoraWhey({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  const [treina, setTreina] = useState<boolean | null>(null);
  const [calculado, setCalculado] = useState(false);
  const [metodoAberto, setMetodoAberto] = useState(false);

  const [consumoTexto, setConsumoTexto] = useState("");
  const [consumoConfirmado, setConsumoConfirmado] = useState(false);
  const [estimadorAberto, setEstimadorAberto] = useState(false);
  const [porcoes, setPorcoes] = useState<Record<string, number>>({});
  const [outrosTexto, setOutrosTexto] = useState("");

  const [porcaoTexto, setPorcaoTexto] = useState("");
  const [protTexto, setProtTexto] = useState("");
  const [dosadorAberto, setDosadorAberto] = useState(false);
  const [medidaTexto, setMedidaTexto] = useState("");

  const [pacoteAberto, setPacoteAberto] = useState(false);
  const [pacoteTexto, setPacoteTexto] = useState("900");
  const [diasTexto, setDiasTexto] = useState("7");
  const [precoTexto, setPrecoTexto] = useState("");

  const [inversoAberto, setInversoAberto] = useState(false);
  const [qtdTexto, setQtdTexto] = useState("40");

  const [comparaAberto, setComparaAberto] = useState(false);
  const [prodA, setProdA] = useState({ preco: "", pacote: "900", porcao: "30", prot: "" });
  const [prodB, setProdB] = useState({ preco: "", pacote: "900", porcao: "30", prot: "" });

  const raiz = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const faltaRef = useRef<HTMLDivElement>(null);
  const doseRef = useRef<HTMLDivElement>(null);
  const estimadorRef = useRef<HTMLDivElement>(null);
  /** Para onde a tela vai depois do próximo render; o contador força o efeito mesmo repetindo o alvo. */
  const [rolar, setRolar] = useState<{ alvo: Alvo; n: number }>({ alvo: null, n: 0 });
  const comecou = useRef(false);
  const medidos = useRef<Set<string>>(new Set());

  /* ── Estado derivado ── */
  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const pronto = pesoOk && objetivo !== null && treina !== null;
  const m = calculado && pronto ? meta(peso!, objetivo!, treina!) : null;

  const consumo = numero(consumoTexto);
  const consumoOk = consumoValido(consumo);
  const f = m && consumoConfirmado && consumoOk ? falta(m.refG, consumo) : null;

  const porcao = numero(porcaoTexto);
  const prot = numero(protTexto);
  const estRotulo = estadoRotulo(porcao, prot);
  const rotuloOk = rotuloCalculavel(estRotulo);
  const rotuloTocado = porcaoTexto.trim() !== "" && protTexto.trim() !== "";
  const d = f && !f.atingida && rotuloOk ? dose(f.faltaG, porcao!, prot!) : null;

  const med = numero(medidaTexto);
  const medOk = medidaValida(med);

  const pacote = numero(pacoteTexto);
  const pacoteOk = pacoteValido(pacote);
  const dias = numero(diasTexto);
  const diasOk = diasSemanaValido(dias);
  const preco = numero(precoTexto);
  const precoOk = precoValido(preco);
  const dur = d && pacoteAberto && pacoteOk && diasOk ? duracao(pacote, d.produtoG, dias) : null;
  const cst = dur && precoOk ? custo(preco, pacote!, porcao!, prot!, d!.produtoG, dias!) : null;

  const qtd = numero(qtdTexto);
  const qtdOk = qtd !== null && qtd > 0 && qtd <= 500;
  const inverso = inversoAberto && rotuloOk && qtdOk ? proteinaEm(qtd, porcao!, prot!) : null;

  const pa = { preco: numero(prodA.preco), pacoteG: numero(prodA.pacote), porcaoG: numero(prodA.porcao), proteinaG: numero(prodA.prot) };
  const pb = { preco: numero(prodB.preco), pacoteG: numero(prodB.pacote), porcaoG: numero(prodB.porcao), proteinaG: numero(prodB.prot) };
  const cmp = comparaAberto && produtoValido(pa) && produtoValido(pb) ? compara(pa, pb) : null;

  const outros = numero(outrosTexto) ?? 0;
  const estimado = estimaConsumo(porcoes, outros);

  /* ── Analytics: uma vez por resultado, nunca a cada tecla ── */
  function medir(chave: string, evento: Parameters<typeof trackEvent>[0], params: Record<string, string> = {}) {
    if (medidos.current.has(chave)) return;
    medidos.current.add(chave);
    trackEvent(evento, { placement, ...params });
  }

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("whey_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  useEffect(() => {
    if (d) medir(`dose-${d.produtoG}`, "whey_amount_calculated", { missing_range: f ? faixaFalta(f) : "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d?.produtoG]);
  useEffect(() => {
    if (dur) medir(`pacote-${pacote}`, "whey_package_calculated", { package_size: String(pacote) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dur?.usos, pacote]);
  useEffect(() => {
    if (cst) medir("custo", "whey_cost_calculated");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cst !== null]);
  useEffect(() => {
    if (cmp) medir("comparador", "whey_compare_products", { cheaper: cmp.maisBarato });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmp?.maisBarato]);
  useEffect(() => {
    if (inverso !== null) medir(`inverso-${qtd}`, "whey_inverse_calculated", { amount: String(qtd) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inverso]);
  useEffect(() => {
    if (rotuloOk && rotuloTocado) medir("rotulo", "whey_label_entered");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotuloOk, rotuloTocado]);

  /*
   * Cada passo leva a tela até o próximo resultado, no topo — nunca até o
   * meio de um bloco mais alto que o celular. O scroll-margin desconta o
   * cabeçalho fixo do site.
   */
  useEffect(() => {
    const mapa = { meta: metaRef, falta: faltaRef, dose: doseRef, estimador: estimadorRef } as const;
    if (!rolar.alvo) return;
    const el = mapa[rolar.alvo].current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: "start", behavior: reduzMovimento() ? "auto" : "smooth" });
  }, [rolar]);
  const irPara = (alvo: Alvo) => setRolar((r) => ({ alvo, n: r.n + 1 }));

  /* ── Ações ── */
  function calcularMeta(e?: React.FormEvent) {
    e?.preventDefault();
    if (!pronto) return;
    trackEvent(calculado ? "whey_recalculate" : "whey_protein_target_calculated", {
      placement,
      weight_range: faixaPeso(peso!),
      goal: objetivo!,
      trains: treina ? "sim" : "nao",
    });
    setCalculado(true);
    irPara("meta");
  }

  function confirmarConsumo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!consumoOk || !m) return;
    setConsumoConfirmado(true);
    trackEvent("whey_food_intake_entered", { placement, source: estimadorAberto ? "estimator" : "typed", missing_range: faixaFalta(falta(m.refG, consumo!)) });
    irPara("falta");
  }

  function usarEstimativa() {
    setConsumoTexto(String(estimado));
    setEstimadorAberto(false);
    if (!m) return;
    setConsumoConfirmado(true);
    trackEvent("whey_food_intake_entered", { placement, source: "estimator", missing_range: faixaFalta(falta(m.refG, estimado)) });
    irPara("falta");
  }

  function enterRotulo(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    e.currentTarget.blur();
    if (d) irPara("dose");
  }

  const mudouEntrada = () => {
    if (!comecou.current) {
      comecou.current = true;
      trackEvent("whey_calculator_start", { placement });
    }
  };

  const idc = (s: string) => `${s}-whey-${placement}`;
  const linhasShare =
    m && f
      ? [
          `Minha meta estimada: ${m.refG} g de proteína por dia`,
          ...(f.atingida
            ? ["A alimentação já chega na meta"]
            : [`Faltavam: ${f.faltaG} g`, ...(d ? [`Meu whey fornece isso com aproximadamente ${d.produtoG} g`] : [])]),
        ]
      : m
        ? [`Minha meta estimada: ${m.refG} g de proteína por dia`]
        : [];

  const linkInterno = (secaoNome: string) => () => trackEvent("whey_internal_link", { placement, calculator_section: secaoNome });

  return (
    <div ref={raiz} className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative" data-testid="calculadora-whey">
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · seus dados não saem do navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
        Quanto whey você precisa para completar a sua proteína?
      </h2>
      <p className="text-gray-400 text-sm mb-6 max-w-2xl">
        Primeiro a meta de proteína do dia, depois o que você já come, e só então quanto do <strong className="text-gray-200">seu</strong> whey
        cobre o que falta.
      </p>

      {/* ── Passo 1: a meta ── */}
      <form onSubmit={calcularMeta} noValidate>
        <p className={rotuloPasso} style={{ color: "#BA9E50" }}>Passo 1 · sua meta de proteína</p>
        <label htmlFor={idc("peso")} className="block text-gray-300 text-sm font-medium mb-2">Quanto você pesa?</label>
        <div className="flex items-center gap-3">
          <input
            id={idc("peso")}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            enterKeyHint="next"
            placeholder="80"
            value={pesoTexto}
            onChange={(e) => { setPesoTexto(e.target.value); mudouEntrada(); }}
            className={`w-32 ${campo}`}
            aria-describedby={idc("peso-ajuda")}
            aria-invalid={pesoTexto.trim() !== "" && !pesoOk}
          />
          <span className="text-gray-300 text-lg">kg</span>
        </div>
        <p id={idc("peso-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]" role={pesoTexto.trim() !== "" && !pesoOk ? "alert" : undefined}>
          {pesoTexto.trim() !== "" && !pesoOk ? `Confira o peso: use um número entre ${PESO_MIN} e ${PESO_MAX} kg, como 80 ou 72,5.` : ""}
        </p>

        <fieldset className="mt-3">
          <legend className="text-gray-300 text-sm font-medium mb-2">Qual é seu principal objetivo?</legend>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
            {OBJETIVOS.map((o) => (
              <button key={o.id} type="button" aria-pressed={objetivo === o.id} className={chip(objetivo === o.id)}
                onClick={() => { setObjetivo(o.id); mudouEntrada(); trackEvent("whey_goal_selected", { placement, goal: o.id }); }}>
                {o.rotulo}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="text-gray-300 text-sm font-medium mb-2">Você faz musculação regularmente?</legend>
          <div className="flex gap-2">
            {([[true, "Sim"], [false, "Não"]] as const).map(([v, r]) => (
              <button key={r} type="button" aria-pressed={treina === v} className={`${chip(treina === v)} min-w-[80px] text-center`}
                onClick={() => { setTreina(v); mudouEntrada(); }}>
                {r}
              </button>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-2 max-w-xl">Pergunto porque muda a conta: as faixas mais altas vêm de estudos com quem treina.</p>
        </fieldset>

        <button type="submit" disabled={!pronto}
          className="bg-white text-black px-7 py-3.5 font-semibold min-h-[52px] disabled:opacity-40 transition-opacity mt-6 w-full sm:w-auto">
          {calculado ? "Recalcular minha meta" : "Calcular minha meta de proteína"}
        </button>
        {!pronto && (pesoTexto.trim() !== "" || objetivo || treina !== null) && (
          <p className="text-gray-500 text-xs mt-2">Responda as três perguntas para calcular.</p>
        )}
      </form>

      <div aria-live="polite">
        {m && (
          <>
            {/* ── Resultado 1: meta ── */}
            <div ref={metaRef} tabIndex={-1} className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5 sm:p-6 mt-6 scroll-mt-24 outline-none" data-testid="resultado-meta">
              <p className={rotuloPasso} style={{ color: "#BA9E50" }}>Sua referência de proteína</p>
              <p className="text-white font-bold text-5xl leading-none mb-2" style={h}>
                {m.refG} g<span className="text-lg font-normal text-gray-300"> de proteína por dia</span>
              </p>
              <p className="text-gray-300 text-sm">
                {m.minG === m.maxG
                  ? <>Referência de {gkg(m.faixa.ref)} g por kg.</>
                  : <>Faixa usada na literatura: {m.minG} a {m.maxG} g por dia ({gkg(m.faixa.min)} a {gkg(m.faixa.max)} g/kg). A referência é {gkg(m.faixa.ref)} g/kg: {m.faixa.porque}</>}
              </p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mt-3 max-w-2xl">
              Com os dados informados — {g(m.pesoKg)} kg, {OBJETIVOS.find((o) => o.id === objetivo)!.rotulo.toLowerCase()},{" "}
              {treina ? "com musculação" : "sem musculação"}. {NOTA_REFERENCIA}
            </p>
            {!treina && objetivo === "ganhar" && (
              <p className="text-gray-300 text-sm leading-relaxed mt-3 max-w-2xl border-l-2 border-[#BA9E50] pl-3" data-testid="aviso-sem-treino">
                Músculo cresce com treino de força. Sem ele, proteína a mais não vira massa muscular — por isso a referência fica no mínimo
                recomendado para adultos. Se você começar a treinar, refaça a conta.
              </p>
            )}
            {m.avisoPesoAjustado && (
              <p className="text-gray-300 text-sm leading-relaxed mt-3 max-w-2xl border-l-2 border-[#BA9E50] pl-3" data-testid="aviso-peso-ajustado">
                Esta conta usa o seu peso atual. Com bastante gordura corporal, parte das recomendações parte do peso ajustado, e o número acima
                pode ficar alto demais. Use como teto e ajuste com quem acompanha você.
              </p>
            )}
            <div className="mt-3">
              <button type="button" aria-expanded={metodoAberto}
                onClick={() => { if (!metodoAberto) trackEvent("whey_internal_link", { placement, calculator_section: "methodology" }); setMetodoAberto(!metodoAberto); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 min-h-[44px]" style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos?
              </button>
              {metodoAberto && (
                <div className="mt-2 space-y-2 text-gray-300 text-sm leading-relaxed max-w-2xl" data-testid="metodo">
                  <p>
                    Peso × g/kg. Quem treina: 1,6 a 2,2 g/kg para ganhar massa (referência 2,0) e para emagrecer (referência 2,2, o topo, porque o
                    déficit pede mais para preservar músculo); 1,4 a 2,0 para manter (referência 1,6). Sem musculação: 1,2 a 1,6 para emagrecer e
                    0,8 g/kg nos outros casos.
                  </p>
                  <p>
                    Fonte desta faixa:{" "}
                    <a href={m.faixa.fonte.url} target="_blank" rel="noopener noreferrer" className={ln}>{m.faixa.fonte.rotulo.split(".")[0]} ({m.faixa.fonte.rotulo.match(/\d{4}$/)?.[0]})</a>. As
                    demais estão na seção de referências da página.
                  </p>
                  <p>Depois: meta − o que você come = o que falta; o que falta ÷ (proteína ÷ porção do rótulo) = gramas do seu whey.</p>
                </div>
              )}
            </div>

            {/* ── Passo 2: quanto já come ── */}
            <form onSubmit={confirmarConsumo} noValidate className={secao}>
              <p className={rotuloPasso} style={{ color: "#BA9E50" }}>Passo 2 · o que você já come</p>
              <label htmlFor={idc("consumo")} className="block text-gray-300 text-sm font-medium mb-2">
                Quanto de proteína você já consome por dia, sem contar whey?
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3">
                  <input id={idc("consumo")} type="text" inputMode="decimal" autoComplete="off" enterKeyHint="go" placeholder="110" value={consumoTexto}
                    onChange={(e) => { setConsumoTexto(e.target.value); setConsumoConfirmado(false); }}
                    className={`w-32 ${campo}`} aria-invalid={consumoTexto.trim() !== "" && !consumoOk} />
                  <span className="text-gray-300 text-lg">g</span>
                </div>
                <button type="submit" disabled={!consumoOk}
                  className="bg-white text-black px-6 py-3.5 font-semibold min-h-[52px] disabled:opacity-40 transition-opacity">
                  Ver quanto falta
                </button>
                <button type="button" aria-expanded={estimadorAberto}
                  onClick={() => {
                    const abrir = !estimadorAberto;
                    setEstimadorAberto(abrir);
                    if (abrir) { trackEvent("whey_food_estimator_open", { placement }); irPara("estimador"); }
                  }}
                  className="border border-white/30 text-white px-5 py-3.5 font-semibold min-h-[52px] hover:border-white/60 transition-colors">
                  Não sei
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2 min-h-[20px]">
                {consumoTexto.trim() !== "" && !consumoOk ? `Use um número entre 0 e ${CONSUMO_MAX} g.` : ""}
              </p>
            </form>

            {/* ── Estimador rápido ── */}
            {estimadorAberto && (
              <div ref={estimadorRef} tabIndex={-1} className="border border-white/15 p-4 sm:p-5 mt-2 scroll-mt-24 outline-none" data-testid="estimador">
                <p className="text-white font-semibold mb-1">Estimador rápido</p>
                <p className="text-gray-400 text-sm mb-4 max-w-xl">
                  Num dia comum, quantas porções você come de cada um? Some café da manhã, almoço, lanche e jantar. É uma estimativa, não um
                  diário alimentar.
                </p>
                <ul className="divide-y divide-white/10">
                  {ALIMENTOS_ESTIMADOR.map((a) => {
                    const n = porcoes[a.id] ?? 0;
                    const muda = (delta: number) => setPorcoes((p) => ({ ...p, [a.id]: Math.max(0, Math.min(PORCOES_MAX, (p[a.id] ?? 0) + delta)) }));
                    return (
                      <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium">{a.nome}</p>
                          <p className="text-gray-500 text-xs">{a.porcao} · {g(proteinaPorcao(a))} g de proteína</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0" role="group" aria-label={`Porções de ${a.nome}`}>
                          <button type="button" onClick={() => muda(-1)} disabled={n === 0} aria-label={`Menos ${a.nome}`}
                            className="w-11 h-11 border border-white/20 text-white text-lg disabled:opacity-30">−</button>
                          <span className="w-8 text-center text-white font-semibold tabular-nums" aria-live="polite">{n}</span>
                          <button type="button" onClick={() => muda(1)} disabled={n >= PORCOES_MAX} aria-label={`Mais ${a.nome}`}
                            className="w-11 h-11 border border-white/20 text-white text-lg disabled:opacity-30">+</button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <label htmlFor={idc("outros")} className="block text-gray-300 text-sm mt-4 mb-1.5">
                  Outros, pelo rótulo (leite, iogurte proteico, barrinha…), em gramas de proteína
                </label>
                <input id={idc("outros")} type="text" inputMode="decimal" autoComplete="off" placeholder="0" value={outrosTexto}
                  onChange={(e) => setOutrosTexto(e.target.value)} className={`max-w-[140px] ${campoP}`} />
                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/10">
                  <p className="text-white">Estimativa: <strong className="text-2xl" style={h}>{estimado} g</strong> por dia</p>
                  <button type="button" onClick={usarEstimativa} disabled={estimado === 0}
                    className="bg-white text-black px-6 py-3 font-semibold min-h-[48px] disabled:opacity-40">
                    Usar este valor
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-3">Proteína da TACO (NEPA/Unicamp); porções caseiras aproximadas. Varia com corte, marca e preparo.</p>
              </div>
            )}

            {/* ── Resultado 2: quanto falta ── */}
            {f && (
              <div ref={faltaRef} tabIndex={-1} className="border border-white/20 p-5 sm:p-6 mt-6 scroll-mt-24 outline-none" data-testid="resultado-falta">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Meta</p>
                    <p className="text-white font-bold text-2xl" style={h}>{f.metaG} g</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Já come</p>
                    <p className="text-white font-bold text-2xl" style={h}>{f.consumoG} g</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#BA9E50" }}>Faltam</p>
                    <p className="text-white font-bold text-2xl" style={h}>{f.faltaG} g</p>
                  </div>
                </div>
                {f.atingida ? (
                  <div className="mt-5 pt-5 border-t border-white/10" data-testid="meta-atingida">
                    <p className="text-white font-semibold mb-1">Pelos dados informados, você já atinge sua referência estimada de proteína pela alimentação.</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      O whey continua podendo ser usado por praticidade, mas não aparece como necessário para completar essa meta.
                    </p>
                  </div>
                ) : (
                  <>
                    {f.grande && (
                      <div className="mt-5 pt-5 border-t border-white/10" data-testid="alerta-grande">
                        <p className="text-white font-semibold mb-1">Essa diferença é grande.</p>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          Em vez de tentar completar tudo com suplemento, vale revisar a alimentação como um todo: incluir proteína nas refeições
                          costuma resolver boa parte, e o whey entra para o resto. A conta abaixo mostra quanto seria, para você ter a referência.
                        </p>
                      </div>
                    )}
                    <p className="text-gray-300 mt-5 pt-5 border-t border-white/10">
                      Quer descobrir quanto do <strong className="text-white">seu</strong> whey fornece esses {f.faltaG} g? Pegue o rótulo.
                    </p>
                  </>
                )}
              </div>
            )}

            {/* ── Passo 3: o rótulo ── */}
            {f && !f.atingida && (
              <div className={secao}>
                <p className={rotuloPasso} style={{ color: "#BA9E50" }}>Passo 3 · o rótulo do seu whey</p>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <div>
                    <label htmlFor={idc("porcao")} className="block text-gray-300 text-sm mb-1.5">Porção do rótulo (g de pó)</label>
                    <input id={idc("porcao")} type="text" inputMode="decimal" autoComplete="off" enterKeyHint="next" placeholder="30" value={porcaoTexto}
                      onChange={(e) => setPorcaoTexto(e.target.value)} onKeyDown={enterRotulo} className={campoP} />
                  </div>
                  <div>
                    <label htmlFor={idc("prot")} className="block text-gray-300 text-sm mb-1.5">Proteína nessa porção (g)</label>
                    <input id={idc("prot")} type="text" inputMode="decimal" autoComplete="off" enterKeyHint="done" placeholder="24" value={protTexto}
                      onChange={(e) => setProtTexto(e.target.value)} onKeyDown={enterRotulo} className={campoP} />
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-2 min-h-[20px]" role={rotuloTocado && estRotulo !== "ok" ? "alert" : undefined}>
                  {rotuloTocado ? AVISO_ROTULO[estRotulo] : "Cada whey tem uma concentração. Use os dois números da tabela nutricional do seu."}
                </p>

                {d && (
                  <div ref={doseRef} tabIndex={-1} className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5 sm:p-6 mt-3 scroll-mt-24 outline-none" data-testid="resultado-whey">
                    <p className={rotuloPasso} style={{ color: "#BA9E50" }}>{f!.grande ? "Se fosse completar tudo com whey" : "Para completar sua meta"}</p>
                    <p className="text-white font-bold text-5xl leading-none mb-2" style={h}>
                      ≈ {d.produtoG} g<span className="text-lg font-normal text-gray-300"> do seu whey</span>
                    </p>
                    <p className="text-gray-300">
                      Isso fornece ≈ {d.proteinaG} g de proteína e equivale a ≈ <strong className="text-white">{g2(d.porcoes)} {d.porcoes === 1 ? "porção" : "porções"}</strong> do
                      rótulo.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {f!.grande && (
                        <span className="block text-gray-200 mb-2" data-testid="dose-grande">
                          Não é o recomendado: é muito suplemento para um dia. Um caminho mais comum é usar 1 a 2 porções e completar o resto com
                          comida.
                        </span>
                      )}
                      Concentração do seu whey: <strong className="text-gray-200">{Math.round(d.concentracao * 100)}% de proteína</strong> por peso
                      ({g(prot!)} g em {g(porcao!)} g). Isso é a conta do rótulo, não a classificação comercial nem um laudo de pureza.
                    </p>
                  </div>
                )}

                {d && (
                  <div className="mt-4">
                    <button type="button" aria-expanded={dosadorAberto} onClick={() => setDosadorAberto(!dosadorAberto)} className={`${toggle} text-sm`} style={{ textDecorationColor: "#BA9E50" }}>
                      {dosadorAberto ? "−" : "+"} Meu whey veio com dosador
                    </button>
                    {dosadorAberto && (
                      <div className="mt-3" data-testid="bloco-dosador">
                        <label htmlFor={idc("medida")} className="block text-gray-300 text-sm mb-1.5">Quantos gramas o rótulo informa por medida?</label>
                        <div className="flex items-center gap-3 max-w-[200px]">
                          <input id={idc("medida")} type="text" inputMode="decimal" autoComplete="off" placeholder="30" value={medidaTexto}
                            onChange={(e) => setMedidaTexto(e.target.value)} className={campoP} />
                          <span className="text-gray-300">g</span>
                        </div>
                        {medOk && (
                          <p className="text-gray-300 mt-3">{d.produtoG} g ≈ <strong className="text-white">{g2(medidas(d.produtoG, med))} medidas</strong>.</p>
                        )}
                        <p className="text-gray-400 text-sm mt-2 max-w-xl">
                          Confira a gramatura no rótulo. Dosadores de marcas diferentes têm tamanhos diferentes, e a colher cheia ou rasa muda o
                          peso — a balança é o mais preciso.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Passo 4: pacote e custo ── */}
            {d && (
              <div className={secao}>
                <button type="button" aria-expanded={pacoteAberto} onClick={() => setPacoteAberto(!pacoteAberto)} className={toggle} style={{ textDecorationColor: "#BA9E50" }}>
                  {pacoteAberto ? "−" : "+"} Quanto tempo seu pacote dura, e quanto custa?
                </button>
                {pacoteAberto && (
                  <div className="mt-4" data-testid="bloco-pacote">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {PACOTES_ATALHO.map((p) => (
                        <button key={p} type="button" aria-pressed={pacote === p} className={chip(pacote === p)} onClick={() => setPacoteTexto(String(p))}>
                          {p >= 1000 ? `${g(p / 1000)} kg` : `${p} g`}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg">
                      <div>
                        <label htmlFor={idc("pacote")} className="block text-gray-300 text-sm mb-1.5">Pacote (g)</label>
                        <input id={idc("pacote")} type="text" inputMode="decimal" autoComplete="off" value={pacoteTexto} onChange={(e) => setPacoteTexto(e.target.value)} className={campoP} />
                      </div>
                      <div>
                        <label htmlFor={idc("dias")} className="block text-gray-300 text-sm mb-1.5">Dias de uso/semana</label>
                        <input id={idc("dias")} type="text" inputMode="numeric" autoComplete="off" value={diasTexto} onChange={(e) => setDiasTexto(e.target.value)} className={campoP} />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor={idc("preco")} className="block text-gray-300 text-sm mb-1.5">Quanto pagou? (opcional)</label>
                        <input id={idc("preco")} type="text" inputMode="decimal" autoComplete="off" placeholder="R$ 129,90" value={precoTexto} onChange={(e) => setPrecoTexto(e.target.value)} className={campoP} />
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 min-h-[20px]">
                      {pacoteTexto.trim() !== "" && !pacoteOk
                        ? "Confira o pacote, em gramas: entre 100 g e 10 kg (1,8 kg = 1800)."
                        : diasTexto.trim() !== "" && !diasOk
                          ? "Dias por semana: de 1 a 7."
                          : precoTexto.trim() !== "" && !precoOk
                            ? "Confira o preço, como 129,90."
                            : ""}
                    </p>
                    {dur && (
                      <div className="border border-white/15 p-5 mt-2" data-testid="resultado-pacote">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Seu whey dura aproximadamente</p>
                        {dur.usos === 0 ? (
                          <p className="text-white">O pacote tem menos que uma dose de {d.produtoG} g.</p>
                        ) : (
                          <>
                            <p className="text-white font-bold text-3xl" style={h}>
                              {dur.diasCorridos} dias <span className="text-lg font-normal text-gray-300">≈ {g(dur.semanas)} semanas</span>
                            </p>
                            <p className="text-gray-300 text-sm mt-2">
                              {dur.usos} {dur.usos === 1 ? "utilização" : "utilizações"} de {d.produtoG} g
                              {dias !== 7 && <>, usando {dias} {dias === 1 ? "dia" : "dias"} por semana</>}.
                            </p>
                          </>
                        )}
                        {cst && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10" data-testid="resultado-custo">
                            {[
                              ["Por grama", `R$ ${cst.porGrama.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 3 })}`],
                              ["Por porção do rótulo", reais(cst.porPorcao)],
                              ["Por dia de uso", reais(cst.porUso)],
                              ["Por 30 dias", reais(cst.por30Dias)],
                              ["Por 25 g de proteína", reais(cst.por25gProteina)],
                              ["Por 30 g de proteína", reais(cst.por30gProteina)],
                            ].map(([r, v]) => (
                              <div key={r}>
                                <p className="text-gray-400 text-xs">{r}</p>
                                <p className="text-white font-semibold">{v}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {cst && <p className="text-gray-400 text-xs mt-3">O custo por 25 g de proteína é o que permite comparar wheys com concentrações diferentes.</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Módulos independentes: servem mesmo sem calcular a meta ── */}
      <div className={secao}>
        <button type="button" aria-expanded={inversoAberto} onClick={() => setInversoAberto(!inversoAberto)} className={toggle} style={{ textDecorationColor: "#BA9E50" }}>
          {inversoAberto ? "−" : "+"} Quanta proteína tem na quantidade de whey que eu tomo?
        </button>
        {inversoAberto && (
          <div className="mt-4" data-testid="bloco-inverso">
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <div>
                <label htmlFor={idc("porcao-inv")} className="block text-gray-300 text-sm mb-1.5">Porção do rótulo (g)</label>
                <input id={idc("porcao-inv")} type="text" inputMode="decimal" autoComplete="off" placeholder="30" value={porcaoTexto} onChange={(e) => setPorcaoTexto(e.target.value)} className={campoP} />
              </div>
              <div>
                <label htmlFor={idc("prot-inv")} className="block text-gray-300 text-sm mb-1.5">Proteína na porção (g)</label>
                <input id={idc("prot-inv")} type="text" inputMode="decimal" autoComplete="off" placeholder="24" value={protTexto} onChange={(e) => setProtTexto(e.target.value)} className={campoP} />
              </div>
            </div>
            {rotuloTocado && estRotulo !== "ok" && <p className="text-gray-400 text-sm mt-2">{AVISO_ROTULO[estRotulo]}</p>}
            <p className="text-gray-300 text-sm mt-4 mb-2">Quanto de whey você usa?</p>
            <div className="flex flex-wrap items-center gap-2">
              {ATALHOS_INVERSO.map((q) => (
                <button key={q} type="button" aria-pressed={qtd === q} className={chip(qtd === q)} onClick={() => setQtdTexto(String(q))}>{q} g</button>
              ))}
              <label htmlFor={idc("qtd")} className="sr-only">Outra quantidade, em gramas</label>
              <input id={idc("qtd")} type="text" inputMode="decimal" autoComplete="off" value={qtdTexto} onChange={(e) => setQtdTexto(e.target.value)} className={`max-w-[100px] ${campoP}`} />
              <span className="text-gray-300">g</span>
            </div>
            {inverso !== null && (
              <p className="text-gray-300 mt-4" data-testid="resultado-inverso">
                {g(qtd!)} g desse whey fornecem aproximadamente <strong className="text-white text-xl">{g(inverso)} g de proteína</strong>.
              </p>
            )}
            {!rotuloOk && !rotuloTocado && <p className="text-gray-500 text-sm mt-3">Preencha os dois números do rótulo para ver a conta.</p>}
          </div>
        )}
      </div>

      <div className={secao}>
        <button type="button" aria-expanded={comparaAberto} onClick={() => setComparaAberto(!comparaAberto)} className={toggle} style={{ textDecorationColor: "#BA9E50" }}>
          {comparaAberto ? "−" : "+"} Qual whey tem a proteína mais barata?
        </button>
        {comparaAberto && (
          <div className="mt-4" data-testid="bloco-comparador">
            <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
              {([["A", prodA, setProdA], ["B", prodB, setProdB]] as const).map(([n, v, set]) => (
                <fieldset key={n} className="border border-white/15 p-3">
                  <legend className="text-gray-300 text-sm px-1">Produto {n}</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {([["preco", "Preço (R$)", "0,00"], ["pacote", "Pacote (g)", "900"], ["porcao", "Porção (g)", "30"], ["prot", "Proteína (g)", "24"]] as const).map(([k, r, ph]) => (
                      <div key={k}>
                        <label htmlFor={idc(`${k}${n}`)} className="block text-gray-400 text-xs mb-1">{r}</label>
                        <input id={idc(`${k}${n}`)} type="text" inputMode="decimal" autoComplete="off" placeholder={ph} value={v[k]}
                          onChange={(e) => set({ ...v, [k]: e.target.value })} className={campoP} />
                      </div>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            {cmp && (
              <div className="mt-4 text-gray-300" data-testid="resultado-comparador">
                <div className="grid grid-cols-2 gap-4 max-w-xl">
                  {(["a", "b"] as const).map((k) => (
                    <div key={k} className="text-sm">
                      <p className="text-white font-semibold mb-1">Produto {k.toUpperCase()}</p>
                      <p>Proteína por 100 g: <strong className="text-white">{g(cmp[k].proteinaPor100g)} g</strong></p>
                      <p>Por 25 g de proteína: <strong className="text-white">{reais(cmp[k].por25g)}</strong></p>
                      <p>Por 30 g de proteína: <strong className="text-white">{reais(cmp[k].por30g)}</strong></p>
                    </div>
                  ))}
                </div>
                <p className="mt-3">
                  {cmp.maisBarato === "empate"
                    ? "Pelo custo por grama de proteína, os dois saem praticamente iguais."
                    : <>Pelo critério de custo por grama de proteína, o <strong className="text-white">produto {cmp.maisBarato.toUpperCase()}</strong> custa menos — cerca de {Math.round(cmp.diferencaPct * 100)}%.</>}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Preço não diz nada sobre qualidade, procedência, digestão, sabor ou ingredientes — isso se confere no rótulo e na marca.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {m && (
        <>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <Compartilhar contexto="tool-result" titulo="Calculadora de Whey" caminho="/ferramentas/calculadora-whey"
              local="tool_result" ferramenta="whey" resultado={linhasShare} gancho="Minha conta de whey:" aparencia="solido" />
            {placement !== "calculadora-whey" && (
              <Link href="/ferramentas/calculadora-whey" onClick={linkInterno("tool")}
                className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                Ver a calculadora completa →
              </Link>
            )}
          </div>

          <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-6 mt-8 relative" data-testid="cta-whey">
            <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
            <p className="text-white font-bold text-xl mb-2" style={h}>Whey ajuda. Mas ele não monta sua estratégia.</p>
            <p className="text-gray-300 leading-relaxed mb-5 max-w-xl">
              Proteína é uma parte do processo. Para transformar isso em resultado, treino, progressão, alimentação e recuperação precisam
              conversar entre si.
            </p>
            <a
              href={getWhatsAppUrl("Oi, Montinho! Usei sua Calculadora de Whey e queria ajuda para organizar meu treino de acordo com meu objetivo.")}
              target="_blank" rel="noopener noreferrer"
              onClick={() => trackEvent("whey_whatsapp_click", { placement })}
              className="inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 transition-colors">
              Quero organizar meu treino →
            </a>
            <p className="text-gray-400 text-xs mt-3">Abre o WhatsApp com a mensagem pronta. Seus números não vão junto.</p>
            <div className="flex flex-col gap-1 mt-5 pt-5 border-t border-white/10">
              <Link href="/ferramentas/calculadora-de-proteina" onClick={linkInterno("protein")}
                className="text-gray-300 text-sm underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors min-h-[44px] inline-flex items-center">
                Quer calcular sua meta de proteína com mais detalhes? Calculadora de Proteína →
              </Link>
              <Link href="/ferramentas/calculadora-creatina" onClick={linkInterno("creatine")}
                className="text-gray-300 text-sm underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors min-h-[44px] inline-flex items-center">
                Usa creatina também? Calculadora de Creatina →
              </Link>
            </div>
          </div>
        </>
      )}

      <p className="text-gray-500 text-xs leading-relaxed mt-6 max-w-2xl" data-testid="aviso-seguranca">
        {AVISO_SEGURANCA} <Link href="/blog/whey-protein-como-tomar" className={ln}>Como tomar whey</Link>.
      </p>
    </div>
  );
}
