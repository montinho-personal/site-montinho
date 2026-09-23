"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  AVISO_SEGURANCA,
  DIAS_ATE_SATURAR_SEM,
  DIAS_SATURACAO_MAX,
  G_POR_KG_DOSE_ALTA,
  G_POR_KG_MANUTENCAO,
  G_POR_KG_MASSA_MAGRA,
  G_POR_KG_SATURACAO,
  GORDURA_MAX,
  GORDURA_MIN,
  GORDURA_TIPICA,
  MANUTENCAO_MAX,
  MANUTENCAO_MIN,
  NOTA_REFERENCIA,
  PESO_MAX,
  PESO_MIN,
  POTES_ATALHO,
  comparaPotes,
  custo,
  duracaoPote,
  faixaPeso,
  gorduraValida,
  medidaValida,
  medidas,
  parseNumero,
  pesoValido,
  poteValido,
  pratica,
  precoValido,
  referencia,
  saturacao,
} from "@/lib/creatina";

/**
 * A Calculadora de Creatina.
 *
 * UMA PERGUNTA PARA O PRIMEIRO RESULTADO
 *
 * Só o peso é obrigatório. Todo o resto — saturação, pote, preço,
 * comparador, dosador — é opcional e aparece depois do resultado, para
 * quem quiser continuar. Nenhum campo existe só para parecer personalizado.
 *
 * PRIVACIDADE
 *
 * Nada sai do navegador. Os eventos levam a faixa de peso e o tamanho do
 * pote, nunca o peso nem o preço.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const campoP =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-lg font-semibold px-3 py-2.5 outline-none transition-colors w-full";
const chip = (ativo: boolean) =>
  `px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
  }`;
const secao = "border-t border-white/10 pt-6 mt-6";
const g = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const g2 = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const g3 = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 3 });
const reais = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const reaisG = (n: number) => `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 3 })}/g`;
const meses = (dias: number) => (dias / 30).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const numero = (t: string) => parseNumero(t.replace(/^R\$\s*/i, "").replace(/\s/g, ""));

export default function CalculadoraCreatina({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [calculado, setCalculado] = useState(false);
  const [comSaturacao, setComSaturacao] = useState(false);
  const [poteAberto, setPoteAberto] = useState(false);
  const [poteTexto, setPoteTexto] = useState("300");
  const [precoTexto, setPrecoTexto] = useState("");
  const [comparaAberto, setComparaAberto] = useState(false);
  const [aG, setAG] = useState("300");
  const [aP, setAP] = useState("");
  const [bG, setBG] = useState("500");
  const [bP, setBP] = useState("");
  const [dosadorAberto, setDosadorAberto] = useState(false);
  const [medidaTexto, setMedidaTexto] = useState("3");
  const [metodoAberto, setMetodoAberto] = useState(false);
  const [gorduraTexto, setGorduraTexto] = useState("");

  const raiz = useRef<HTMLDivElement>(null);
  const resultadoRef = useRef<HTMLDivElement>(null);
  const doseRef = useRef<HTMLDivElement>(null);
  /** Muda a cada cálculo; o efeito abaixo leva a tela até a dose depois que ela existe. */
  const [calculos, setCalculos] = useState(0);
  const comecou = useRef(false);
  const custoMedido = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const ref = calculado && pesoOk ? referencia(peso) : null;
  const sat = ref ? saturacao(peso!) : null;
  const pote = numero(poteTexto);
  const poteOk = poteValido(pote);
  const duracao = ref && poteAberto && poteOk ? duracaoPote(pote, peso!, comSaturacao) : null;
  const preco = numero(precoTexto);
  const precoOk = precoValido(preco);
  const c = ref && poteAberto && poteOk && precoOk ? custo(preco, pote, ref.diaria) : null;
  const gordura = numero(gorduraTexto.replace("%", ""));
  const gorduraOk = gorduraValida(gordura);
  const prat = ref && gorduraOk ? pratica(peso!, gordura) : null;
  const med = numero(medidaTexto);
  const medOk = medidaValida(med);
  const cmpA = { g: numero(aG), preco: numero(aP) };
  const cmpB = { g: numero(bG), preco: numero(bP) };
  const cmpOk = poteValido(cmpA.g) && precoValido(cmpA.preco) && poteValido(cmpB.g) && precoValido(cmpB.preco);
  const cmp = cmpOk ? comparaPotes({ g: cmpA.g!, preco: cmpA.preco! }, { g: cmpB.g!, preco: cmpB.preco! }) : null;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("creatine_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  /* Custo medido uma vez, quando o preço vira resultado — não a cada tecla. */
  const temCusto = c !== null;
  useEffect(() => {
    if (temCusto && !custoMedido.current) {
      custoMedido.current = true;
      trackEvent("creatine_cost_calculate", { placement });
    }
  }, [temCusto, placement]);

  function calcular(e?: React.FormEvent) {
    e?.preventDefault();
    if (!pesoOk) return;
    trackEvent(calculado ? "creatine_recalculate" : "creatine_calculator_calculate", { placement, weight_range: faixaPeso(peso!) });
    setCalculado(true);
    setCalculos((n) => n + 1);
  }

  /*
   * Depois de calcular, a tela vai até a DOSE — o card "Sua referência" —
   * e não até o meio do resultado. Antes, o foco ia para o bloco inteiro, que
   * é mais alto que a tela, e o navegador parava no percentual de gordura.
   * O foco vai sem rolar; a rolagem é explícita, com o card no topo, e o
   * scroll-margin do card desconta o cabeçalho fixo do site.
   */
  useEffect(() => {
    if (calculos === 0) return;
    const card = doseRef.current;
    if (!card) return;
    resultadoRef.current?.focus({ preventScroll: true });
    const reduzir = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ block: "start", behavior: reduzir ? "auto" : "smooth" });
  }, [calculos]);

  const idc = (s: string) => `${s}-creatina-${placement}`;
  const linhasShare = ref
    ? [
        `Peso: ${g(ref.pesoKg)} kg`,
        `Referência: ${g(ref.diaria)} g de creatina por dia`,
        ...(duracao && !duracao.acabaNaSaturacao ? [`Meu pote de ${g(duracao.poteG)} g dura cerca de ${duracao.dias} dias`] : []),
      ]
    : [];

  return (
    <div ref={raiz} className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative" data-testid="calculadora-creatina">
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto de creatina você toma por dia?
      </h2>

      <form onSubmit={calcular} noValidate>
        <label htmlFor={idc("peso")} className="block text-gray-300 text-sm font-medium mb-2">Quanto você pesa?</label>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <input
              id={idc("peso")}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="80"
              value={pesoTexto}
              onChange={(e) => {
                setPesoTexto(e.target.value);
                if (!comecou.current && e.target.value.trim() !== "") {
                  comecou.current = true;
                  trackEvent("creatine_calculator_start", { placement });
                }
              }}
              className={`w-32 ${campo}`}
              aria-describedby={idc("peso-ajuda")}
              aria-invalid={pesoTexto.trim() !== "" && !pesoOk}
            />
            <span className="text-gray-300 text-lg">kg</span>
          </div>
          <button type="submit" disabled={!pesoOk}
            className="bg-white text-black px-7 py-3.5 font-semibold min-h-[52px] disabled:opacity-40 transition-opacity">
            Calcular minha creatina
          </button>
        </div>
        <p id={idc("peso-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]" role={pesoTexto.trim() !== "" && !pesoOk ? "alert" : undefined}>
          {pesoTexto.trim() !== "" && !pesoOk ? `Confira o peso: use um número entre ${PESO_MIN} e ${PESO_MAX} kg, como 80 ou 72,5.` : ""}
        </p>
      </form>

      <div aria-live="polite">
        {ref && sat && (
          <div ref={resultadoRef} tabIndex={-1} className="outline-none">
            {/* ── Resultado principal ── */}
            <div ref={doseRef} className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5 sm:p-6 mt-6 scroll-mt-24" data-testid="resultado-creatina">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#BA9E50" }}>Sua referência</p>
              <p className="text-white font-bold text-5xl leading-none mb-2" style={h}>
                {g(ref.diaria)} g<span className="text-lg font-normal text-gray-300"> de creatina por dia</span>
              </p>
              <p className="text-gray-400 text-sm">
                Peso informado: {g(ref.pesoKg)} kg · Estratégia: {comSaturacao ? "com saturação, depois manutenção" : "uso diário sem saturação"}
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed mt-4 max-w-2xl" data-testid="frase-natural">
              Para uma pessoa de {g(ref.pesoKg)} kg, a referência do consenso científico é de aproximadamente{" "}
              <strong className="text-white">{g(ref.diaria)} g de creatina por dia</strong>. {NOTA_REFERENCIA}
            </p>

            {/* ── 3 g ou 5 g ── */}
            <div className={secao} data-testid="bloco-3-ou-5">
              <h3 className="text-white font-bold text-lg mb-2" style={h}>3 g ou 5 g?</h3>
              <p className="text-gray-300 leading-relaxed max-w-2xl">
                {ref.subiuParaMinimo ? (
                  <>
                    Pelo seu peso, a conta de {g2(G_POR_KG_MANUTENCAO)} g por kg dá {g2(ref.calculada)} g — abaixo da menor dose estudada. Por
                    isso a referência sobe para <strong className="text-white">{MANUTENCAO_MIN} g</strong>, que já cobre você.{" "}
                    <strong className="text-white">5 g também servem</strong>: é a dose mais usada nos estudos, é segura e só enche os estoques
                    um pouco mais rápido. A diferença entre as duas é de semanas, não de resultado.
                  </>
                ) : (
                  <>
                    Pelo seu peso, a conta de {g2(G_POR_KG_MANUTENCAO)} g por kg dá {g2(ref.calculada)} g, que arredonda para{" "}
                    <strong className="text-white">{g(ref.diaria)} g</strong>. Fica dentro da faixa estudada, de {MANUTENCAO_MIN} a{" "}
                    {MANUTENCAO_MAX} g por dia.
                    {ref.atletaGrande && <> Para atletas muito grandes, o consenso menciona doses de 5 a 10 g — vale conversar com quem acompanha você.</>}
                  </>
                )}
              </p>
            </div>

            {/* ── Como quem treina usa: sempre visível, porque é a maioria de quem chega aqui ── */}
            <div className="border border-white/20 p-5 sm:p-6 mt-6 relative" data-testid="bloco-pratica">
              <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#BA9E50" }}>Treina musculação?</p>
              <h3 className="text-white font-bold text-xl mb-3" style={h}>Como quem treina musculação costuma usar</h3>
              {(
                <div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-2xl">
                    Na academia, muita gente ajusta a creatina pela <strong className="text-white">massa magra</strong> — é no músculo que ela fica
                    guardada. É isso que faz homem e mulher, e quem tem menos gordura, chegarem a doses diferentes: não é o sexo em si, é
                    quanto do seu peso é músculo.
                  </p>
                  <label htmlFor={idc("gordura")} className="block text-gray-300 text-sm mb-1.5">Seu percentual de gordura</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <input id={idc("gordura")} type="text" inputMode="decimal" autoComplete="off" placeholder="18" value={gorduraTexto}
                        onChange={(e) => setGorduraTexto(e.target.value)} className={`w-24 ${campoP}`} />
                      <span className="text-gray-300">%</span>
                    </div>
                    <span className="text-gray-500 text-sm">Não sabe?</span>
                    <button type="button" className={chip(gordura === GORDURA_TIPICA.homem)} onClick={() => setGorduraTexto(String(GORDURA_TIPICA.homem))}>Homem · cerca de {GORDURA_TIPICA.homem}%</button>
                    <button type="button" className={chip(gordura === GORDURA_TIPICA.mulher)} onClick={() => setGorduraTexto(String(GORDURA_TIPICA.mulher))}>Mulher · cerca de {GORDURA_TIPICA.mulher}%</button>
                  </div>
                  <p className="text-gray-500 text-xs mb-4 min-h-[16px]">
                    {gorduraTexto.trim() !== "" && !gorduraOk
                      ? `Use um valor entre ${GORDURA_MIN} e ${GORDURA_MAX}%.`
                      : "Os atalhos são estimativas médias de quem treina; o valor da sua bioimpedância ou avaliação é melhor."}
                  </p>
                  {prat && (
                    <div className="overflow-x-auto" data-testid="tabela-pratica">
                      <table className="w-full text-sm border-collapse">
                        <caption className="sr-only">Doses de creatina por abordagem, para o seu peso e percentual de gordura</caption>
                        <tbody>
                          <tr className="border-b border-white/10">
                            <th scope="row" className="text-left text-gray-300 font-normal py-2.5 pr-3">Consenso científico (ISSN)</th>
                            <td className="text-white font-semibold py-2.5 tabular-nums whitespace-nowrap">{g(ref.diaria)} g/dia</td>
                          </tr>
                          <tr className="border-b border-white/10">
                            <th scope="row" className="text-left text-gray-300 font-normal py-2.5 pr-3">
                              Pela massa magra: {g3(G_POR_KG_MASSA_MAGRA)} g × {g(prat.massaMagra)} kg de massa magra
                              <span className="block text-gray-500 text-xs">protocolo de homens treinados (Gann et al., 2015)</span>
                            </th>
                            <td className="text-white font-semibold py-2.5 tabular-nums whitespace-nowrap">{g(prat.porMassaMagra)} g/dia</td>
                          </tr>
                          <tr>
                            <th scope="row" className="text-left text-gray-300 font-normal py-2.5 pr-3">
                              Dose alta: {g2(G_POR_KG_DOSE_ALTA)} g × peso
                              <span className="block text-gray-500 text-xs">usada em estudos de hipertrofia (Candow, 2015; Cribb, 2007)</span>
                            </th>
                            <td className="text-white font-semibold py-2.5 tabular-nums whitespace-nowrap">{g(prat.doseAlta)} g/dia</td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="text-gray-400 text-sm leading-relaxed mt-3 max-w-2xl">
                        {prat.porMassaMagra > ref.diaria
                          ? <>Pela sua massa magra, a conta dá {g(prat.porMassaMagra)} g — mais que a referência, porque você tem bastante músculo para o seu peso.</>
                          : <>Pela sua massa magra, a conta fica perto da referência.</>}{" "}
                        A dose alta não mostrou render mais que 5 g no uso contínuo: o estoque do músculo tem um teto, e o que passa dele
                        sai na urina. Qualquer valor desta tabela é seguro para adultos saudáveis.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Saturação ── */}
            <div className={secao}>
              <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
                <input type="checkbox" checked={comSaturacao} className="mt-1 w-5 h-5 accent-[#BA9E50]"
                  onChange={(e) => { setComSaturacao(e.target.checked); trackEvent("creatine_loading_toggle", { placement, strategy: e.target.checked ? "loading" : "maintenance" }); }} />
                <span className="text-white font-semibold">Quero ver como funciona a saturação</span>
              </label>
              {comSaturacao && (
                <div className="grid gap-3 sm:grid-cols-2 mt-4" data-testid="bloco-saturacao">
                  <div className="border border-white/15 p-4">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Fase de saturação</p>
                    <p className="text-white font-bold text-2xl" style={h}>{g(sat.diaria)} g/dia</p>
                    <p className="text-gray-300 text-sm mt-1">
                      Em {sat.doses} porções de cerca de {g(sat.porDose)} g, por {sat.dias} a {DIAS_SATURACAO_MAX} dias
                    </p>
                  </div>
                  <div className="border border-white/15 p-4">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Depois, manutenção</p>
                    <p className="text-white font-bold text-2xl" style={h}>{g(sat.manutencao)} g/dia</p>
                    <p className="text-gray-300 text-sm mt-1">Todos os dias, na mesma dose da referência</p>
                  </div>
                </div>
              )}
              <p className="text-gray-300 text-sm leading-relaxed mt-4 max-w-2xl">
                <strong className="text-white">A saturação não é obrigatória.</strong> Com ela, você usa {g2(G_POR_KG_SATURACAO)} g por kg por
                alguns dias para encher os estoques do músculo mais rápido. Sem ela, a dose diária chega ao mesmo nível, só que mais devagar.
                Nenhuma das duas dá mais resultado no fim.
              </p>
            </div>

            {/* ── Quando satura ── */}
            <div className={secao} data-testid="bloco-tempo">
              <h3 className="text-white font-bold text-lg mb-2" style={h}>Quando os estoques ficam cheios?</h3>
              <p className="text-gray-300 leading-relaxed max-w-2xl">
                {comSaturacao
                  ? <>Com saturação, <strong className="text-white">em cerca de {sat.dias} a {DIAS_SATURACAO_MAX} dias</strong>.</>
                  : <>Sem saturação, <strong className="text-white">em cerca de 3 a 4 semanas</strong> — com {MANUTENCAO_MIN} g por dia, o estudo clássico mediu uns {DIAS_ATE_SATURAR_SEM} dias.</>}{" "}
                Estoque cheio não é o mesmo que ficar mais forte: o ganho de desempenho aparece aos poucos, junto com o treino. Na balança,
                um pouco de peso a mais nas primeiras semanas é água dentro do músculo, não gordura.
              </p>
            </div>

            {/* ── Pote ── */}
            <div className={secao}>
              <button type="button" aria-expanded={poteAberto} onClick={() => setPoteAberto(!poteAberto)}
                className="text-white font-semibold underline underline-offset-4 decoration-1 min-h-[44px] text-left" style={{ textDecorationColor: "#BA9E50" }}>
                {poteAberto ? "−" : "+"} Quanto tempo seu pote dura, e quanto custa por dia?
              </button>
              {poteAberto && (
                <div className="mt-4" data-testid="bloco-pote">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {POTES_ATALHO.map((p) => (
                      <button key={p} type="button" aria-pressed={pote === p} className={chip(pote === p)}
                        onClick={() => { setPoteTexto(String(p)); trackEvent("creatine_container_calculate", { placement, container_size: String(p) }); }}>
                        {p >= 1000 ? `${p / 1000} kg` : `${p} g`}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    <div>
                      <label htmlFor={idc("pote")} className="block text-gray-300 text-sm mb-1.5">Peso do pote (g)</label>
                      <input id={idc("pote")} type="text" inputMode="decimal" autoComplete="off" value={poteTexto}
                        onChange={(e) => setPoteTexto(e.target.value)} className={campoP} />
                    </div>
                    <div>
                      <label htmlFor={idc("preco")} className="block text-gray-300 text-sm mb-1.5">Quanto pagou? (opcional)</label>
                      <input id={idc("preco")} type="text" inputMode="decimal" autoComplete="off" placeholder="R$ 89,90" value={precoTexto}
                        onChange={(e) => setPrecoTexto(e.target.value)} className={campoP} />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2 min-h-[20px]">
                    {poteTexto.trim() !== "" && !poteOk ? "Confira o peso do pote, em gramas: entre 50 g e 5 kg." : precoTexto.trim() !== "" && !precoOk ? "Confira o preço, como 89,90." : ""}
                  </p>
                  {duracao && (
                    <div className="border border-white/15 p-5 mt-2" data-testid="resultado-pote">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Seu pote dura aproximadamente</p>
                      {duracao.acabaNaSaturacao ? (
                        <p className="text-white leading-relaxed">
                          <strong>{duracao.dias} dias</strong> — ele acaba antes do fim da saturação, que usa {g(sat.diaria)} g por dia.
                        </p>
                      ) : (
                        <>
                          <p className="text-white font-bold text-3xl" style={h}>{duracao.dias} dias <span className="text-lg font-normal text-gray-300">≈ {meses(duracao.dias)} meses</span></p>
                          <p className="text-gray-300 text-sm mt-2">
                            {duracao.consumoSaturacao !== null
                              ? <>A saturação usa cerca de {g(duracao.consumoSaturacao)} g; sobram {g(duracao.restante!)} g para a manutenção de {g(ref.diaria)} g por dia.</>
                              : <>Na dose de {g(ref.diaria)} g por dia.</>}
                          </p>
                        </>
                      )}
                      {c && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10" data-testid="resultado-custo">
                          {[["Por grama", reaisG(c.porGrama)], ["Por dia", reais(c.porDia)], ["Por 30 dias", reais(c.por30Dias)], ["Por ano", reais(c.porAno)]].map(([r, v]) => (
                            <div key={r}>
                              <p className="text-gray-400 text-xs">{r}</p>
                              <p className="text-white font-semibold">{v}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Dosador ── */}
            <div className={secao}>
              <button type="button" aria-expanded={dosadorAberto} onClick={() => setDosadorAberto(!dosadorAberto)}
                className="text-white font-semibold underline underline-offset-4 decoration-1 min-h-[44px] text-left" style={{ textDecorationColor: "#BA9E50" }}>
                {dosadorAberto ? "−" : "+"} Minha creatina veio com dosador
              </button>
              {dosadorAberto && (
                <div className="mt-4" data-testid="bloco-dosador">
                  <label htmlFor={idc("medida")} className="block text-gray-300 text-sm mb-1.5">Quantos gramas o rótulo informa por medida?</label>
                  <div className="flex items-center gap-3 max-w-xs">
                    <input id={idc("medida")} type="text" inputMode="decimal" autoComplete="off" value={medidaTexto}
                      onChange={(e) => setMedidaTexto(e.target.value)} className={campoP} />
                    <span className="text-gray-300">g</span>
                  </div>
                  {medOk ? (
                    <p className="text-gray-300 mt-3">
                      {g(ref.diaria)} g equivalem a cerca de <strong className="text-white">{g(medidas(ref.diaria, med))} {medidas(ref.diaria, med) === 1 ? "medida" : "medidas"}</strong>.
                    </p>
                  ) : medidaTexto.trim() !== "" && <p className="text-gray-400 text-sm mt-2">Use o valor do rótulo, entre 0,5 e 20 g.</p>}
                  <p className="text-gray-400 text-sm mt-2 max-w-xl">
                    Confira o peso indicado no rótulo: o tamanho da colher não garante a quantidade em gramas, e colher de cozinha varia
                    ainda mais. Balança ou dosador com gramatura conhecida é o mais confiável.
                  </p>
                </div>
              )}
            </div>

            {/* ── Comparador ── */}
            <div className={secao}>
              <button type="button" aria-expanded={comparaAberto} onClick={() => setComparaAberto(!comparaAberto)}
                className="text-white font-semibold underline underline-offset-4 decoration-1 min-h-[44px] text-left" style={{ textDecorationColor: "#BA9E50" }}>
                {comparaAberto ? "−" : "+"} Qual pote sai mais barato?
              </button>
              {comparaAberto && (
                <div className="mt-4" data-testid="bloco-comparador">
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    {([["A", aG, setAG, aP, setAP], ["B", bG, setBG, bP, setBP]] as const).map(([n, gv, sg, pv, sp]) => (
                      <fieldset key={n} className="border border-white/15 p-3">
                        <legend className="text-gray-300 text-sm px-1">Pote {n}</legend>
                        <label htmlFor={idc(`g${n}`)} className="block text-gray-400 text-xs mb-1">Gramas</label>
                        <input id={idc(`g${n}`)} type="text" inputMode="decimal" autoComplete="off" value={gv} onChange={(e) => sg(e.target.value)} className={campoP} />
                        <label htmlFor={idc(`p${n}`)} className="block text-gray-400 text-xs mb-1 mt-2">Preço (R$)</label>
                        <input id={idc(`p${n}`)} type="text" inputMode="decimal" autoComplete="off" placeholder="0,00" value={pv} onChange={(e) => sp(e.target.value)} className={campoP} />
                      </fieldset>
                    ))}
                  </div>
                  {cmp && (
                    <div className="mt-4 text-gray-300" data-testid="resultado-comparador">
                      <p>Pote A: <strong className="text-white">{reaisG(cmp.porGramaA)}</strong> · Pote B: <strong className="text-white">{reaisG(cmp.porGramaB)}</strong></p>
                      <p className="mt-1">
                        {cmp.maisBarato === "empate"
                          ? "Pelo custo por grama, os dois saem praticamente iguais."
                          : <>Pelo custo por grama, o <strong className="text-white">pote {cmp.maisBarato.toUpperCase()}</strong> é cerca de {Math.round(cmp.diferencaPct * 100)}% mais barato.</>}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">Preço não diz nada sobre qualidade ou pureza — isso se confere no rótulo e na procedência.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Método ── */}
            <div className={secao}>
              <button type="button" aria-expanded={metodoAberto}
                onClick={() => { if (!metodoAberto) trackEvent("creatine_internal_link_click", { placement, calculator_section: "methodology" }); setMetodoAberto(!metodoAberto); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 min-h-[44px]" style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos?
              </button>
              {metodoAberto && (
                <div className="mt-3 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    Manutenção: <span className="text-white">{g2(G_POR_KG_MANUTENCAO)} g × peso</span>, arredondado ao grama e mantido na faixa
                    estudada de {MANUTENCAO_MIN} a {MANUTENCAO_MAX} g por dia. É a referência do posicionamento da International Society of Sports
                    Nutrition (2017).
                  </p>
                  <p>
                    Saturação: <span className="text-white">{g2(G_POR_KG_SATURACAO)} g × peso</span> por dia, em quatro porções, por 5 a 7 dias —
                    a conta que dá os famosos 20 g para uma pessoa de uns 70 kg.
                  </p>
                  <p>O pote e o custo são divisão simples: gramas do pote pela dose diária, e preço pelas gramas.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Creatina" caminho="/ferramentas/calculadora-creatina"
                local="tool_result" ferramenta="creatina" resultado={linhasShare} gancho="Meu cálculo de creatina:" aparencia="solido" />
              {placement !== "calculadora-creatina" && (
                <Link href="/ferramentas/calculadora-creatina" onClick={() => trackEvent("creatine_internal_link_click", { placement, calculator_section: "tool" })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            {/* ── CTA ── */}
            <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-6 mt-8 relative" data-testid="cta-creatina">
              <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
              <p className="text-white font-bold text-xl mb-2" style={h}>Creatina é só uma parte do resultado.</p>
              <p className="text-gray-300 leading-relaxed mb-5 max-w-xl">
                Suplemento complementa uma estratégia. O que precisa estar alinhado é treino, alimentação e progressão.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <a
                  href={getWhatsAppUrl("Oi, Montinho! Usei sua Calculadora de Creatina e queria entender como organizar meu treino para meu objetivo.")}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => trackEvent("creatine_whatsapp_click", { placement })}
                  className="inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 transition-colors">
                  Quero organizar meu treino →
                </a>
                <Link href="/ferramentas/calculadora-de-proteina"
                  onClick={() => trackEvent("creatine_internal_link_click", { placement, calculator_section: "protein" })}
                  className="text-gray-300 text-sm underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors min-h-[44px] inline-flex items-center">
                  Já sabe quanto de proteína precisa? Calcular minha proteína
                </Link>
              </div>
              <p className="text-gray-400 text-xs mt-3">Abre o WhatsApp com a mensagem pronta. O seu peso não vai junto.</p>
            </div>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-6 max-w-2xl" data-testid="aviso-seguranca">
        {AVISO_SEGURANCA} <Link href="/blog/creatina-para-hipertrofia" className={ln}>O que a ciência diz sobre creatina</Link>.
      </p>
    </div>
  );
}
