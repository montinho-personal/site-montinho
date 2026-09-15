"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  calcularConcentracao, conferirInstrucao, formatarConcentracao, formatarMg, formatarMl, lerMarca, tabelaU100,
  validarConcentracao, validarMarca, validarMg, validarMl, MARCA_MAX, MARCA_MIN, type Erro,
} from "@/lib/concentracao/calculo";
import { FONTES, linkDaFonte } from "@/lib/concentracao/fontes";
import SeringaU100 from "./SeringaU100";

/**
 * Conversor mg/mL e Seringa U-100.
 *
 * O que a pessoa precisa entender, e nesta ordem:
 *
 *   mg      — quanto da substância existe
 *   mL      — quanto líquido existe
 *   mg/mL   — quão concentrado está
 *   U-100   — a escala física da seringa (marca 100 = 1,00 mL)
 *   marca   — o volume que ela representa
 *   volume × concentração — quanto da substância está naquele volume
 *
 * O que este componente NÃO faz, e é a razão de existir: não recebe "quero
 * X mg" e devolve uma marca. A pessoa escolhe a marca e a ferramenta explica
 * o que existe ali. A diferença parece sutil e é toda a diferença entre
 * explicar uma medida e prescrever uma dose de injetável.
 *
 * Privacidade: tudo é calculado aqui, no navegador. Nenhum valor digitado —
 * mg, mL, concentração, marca — entra em evento de analytics, em URL, em
 * armazenamento ou em rede. Os eventos registram que a ferramenta foi usada,
 * nunca com o quê.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const OURO = "#BA9E50";

const MENSAGEM_ERRO: Record<Erro, string> = {
  vazio: "",
  invalido: "Confira o valor: só números, com vírgula ou ponto.",
  fora_do_limite: "Esse valor está fora do que a ferramenta consegue interpretar com segurança. Confira o rótulo.",
};

type Modo = "calcular" | "concentracao";
type Insulina = null | "nao" | "sim";

export default function ConversorConcentracao({ placement }: { placement: string }) {
  const uid = useId();
  const raiz = useRef<HTMLDivElement>(null);

  const [modo, setModo] = useState<Modo>("calcular");
  const [mgTxt, setMgTxt] = useState("");
  const [mlTxt, setMlTxt] = useState("");
  const [concTxt, setConcTxt] = useState("");
  const [insulina, setInsulina] = useState<Insulina>(null);
  const [marca, setMarca] = useState<number | null>(null);
  const [marcaTxt, setMarcaTxt] = useState("");
  const [conferirAberto, setConferirAberto] = useState(false);
  const [mgInfoTxt, setMgInfoTxt] = useState("");
  const [marcaInfoTxt, setMarcaInfoTxt] = useState("");

  // Eventos "uma vez": o comportamento, nunca o valor.
  const jaCalculou = useRef(false);
  const jaMoveu = useRef(false);
  const jaAbriuConferir = useRef(false);
  const ultimaDivergencia = useRef<string | null>(null);

  const vMg = validarMg(mgTxt);
  const vMl = validarMl(mlTxt);
  const vConc = validarConcentracao(concTxt);

  const concentracao = useMemo(() => {
    if (modo === "concentracao") return vConc.valor;
    if (vMg.valor == null || vMl.valor == null) return null;
    return calcularConcentracao(vMg.valor, vMl.valor);
  }, [modo, vMg.valor, vMl.valor, vConc.valor]);

  const leitura = concentracao != null && marca != null ? lerMarca(concentracao, marca) : null;
  const tabela = concentracao != null ? tabelaU100(concentracao) : [];
  const podeSeringa = concentracao != null && insulina === "nao";

  /** View: quando o bloco entra na tela. */
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { trackOncePerSession("concentration_tool_view", { placement }); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  useEffect(() => {
    if (concentracao != null && !jaCalculou.current) { jaCalculou.current = true; trackEvent("concentration_calculated", { placement, modo }); }
  }, [concentracao, placement, modo]);

  function escolherMarca(n: number | null) {
    setMarca(n);
    setMarcaTxt(n == null ? "" : String(n));
    if (n != null && !jaMoveu.current) { jaMoveu.current = true; trackEvent("u100_mark_change", { placement }); }
  }

  const vMgInfo = validarMg(mgInfoTxt);
  const vMarcaInfo = validarMarca(marcaInfoTxt);
  const conferencia = concentracao != null && vMgInfo.valor != null && vMarcaInfo.valor != null
    ? conferirInstrucao(concentracao, vMgInfo.valor, vMarcaInfo.valor) : null;
  useEffect(() => {
    if (conferencia?.status === "nao_corresponde") {
      const chave = `${mgInfoTxt}|${marcaInfoTxt}`;
      if (ultimaDivergencia.current !== chave) { ultimaDivergencia.current = chave; trackEvent("instruction_check_mismatch", { placement }); }
    }
  }, [conferencia?.status, mgInfoTxt, marcaInfoTxt, placement]);

  const fonteInsulina = FONTES.find((f) => f.id === "ismp-alto-risco");
  const inputCls = "w-full bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";

  return (
    <div ref={raiz} className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-5 sm:p-8 relative" data-testid="conversor-concentracao">
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: OURO }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: OURO }}>
        Educacional · sem cadastro · nada sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
        Entenda sua Concentração e a Escala da Seringa
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl">
        Diga quanto o rótulo declara e quanto líquido tem no frasco. A conta aparece na hora — e depois a ferramenta explica o que cada marca da seringa U-100 significa.
      </p>

      {/*
        A entrada vem primeiro. Quem abre esta página já tem o frasco na mão e
        quer a conta: fazer a pessoa ler três definições antes de digitar
        qualquer coisa é cobrar aula de quem veio buscar resposta. A explicação
        das três palavras vem logo depois do resultado, quando ela já tem um
        número concreto para pendurar o conceito.
      */}
      {modo === "calcular" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-mg`} className="block text-gray-300 text-sm font-medium mb-2">Quanto o rótulo declara</label>
            <div className="flex items-center gap-3">
              <input id={`${uid}-mg`} type="text" inputMode="decimal" autoComplete="off" placeholder="60" value={mgTxt} onChange={(e) => setMgTxt(e.target.value)} className={inputCls} aria-describedby={`${uid}-mg-ajuda`} />
              <span className="text-gray-300 text-lg">mg</span>
            </div>
            <p id={`${uid}-mg-ajuda`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
              {vMg.erro && vMg.erro !== "vazio" ? MENSAGEM_ERRO[vMg.erro] : "O total de substância que vem no frasco."}
            </p>
          </div>
          <div>
            <label htmlFor={`${uid}-ml`} className="block text-gray-300 text-sm font-medium mb-2">Quanto líquido tem no frasco</label>
            <div className="flex items-center gap-3">
              <input id={`${uid}-ml`} type="text" inputMode="decimal" autoComplete="off" placeholder="2,5" value={mlTxt} onChange={(e) => setMlTxt(e.target.value)} className={inputCls} aria-describedby={`${uid}-ml-ajuda`} />
              <span className="text-gray-300 text-lg">mL</span>
            </div>
            <p id={`${uid}-ml-ajuda`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
              {vMl.erro && vMl.erro !== "vazio" ? MENSAGEM_ERRO[vMl.erro] : "O volume final da solução, já pronta."}
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-sm">
          <label htmlFor={`${uid}-conc`} className="block text-gray-300 text-sm font-medium mb-2">Concentração do frasco</label>
          <div className="flex items-center gap-3">
            <input id={`${uid}-conc`} type="text" inputMode="decimal" autoComplete="off" placeholder="24" value={concTxt} onChange={(e) => setConcTxt(e.target.value)} className={inputCls} aria-describedby={`${uid}-conc-ajuda`} />
            <span className="text-gray-300 text-lg whitespace-nowrap">mg/mL</span>
          </div>
          <p id={`${uid}-conc-ajuda`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {vConc.erro && vConc.erro !== "vazio" ? MENSAGEM_ERRO[vConc.erro] : "Como está escrito no rótulo."}
          </p>
        </div>
      )}

      {/*
        O segundo caminho é um link discreto, não uma escolha na porta de
        entrada. Perguntar "você quer calcular ou já sabe?" antes de mostrar
        qualquer campo obriga a pessoa a decidir algo que ela ainda não
        entendeu — e foi exatamente o que confundiu na primeira versão.
      */}
      <button
        type="button"
        onClick={() => setModo(modo === "calcular" ? "concentracao" : "calcular")}
        className="mt-1 text-gray-400 text-sm underline underline-offset-4 decoration-1 hover:text-white transition-colors min-h-[44px]"
        style={{ textDecorationColor: OURO }}
      >
        {modo === "calcular" ? "O rótulo já diz a concentração em mg/mL" : "Prefiro calcular pela quantidade e pelo volume"}
      </button>

      {/* O resultado, na hora. */}
      <div aria-live="polite" className="mt-5">
        {concentracao == null ? (
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: OURO }}>
            Preencha os dois campos para ver a concentração. Se o rótulo não diz a quantidade total e o volume, não dá para saber a concentração — e a ferramenta não chuta.
          </p>
        ) : (
          <div className="border border-[#BA9E50]/40 bg-[#BA9E50]/[0.06] p-5 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: OURO }}>Concentração</p>
            <p className="text-white font-bold text-4xl sm:text-5xl leading-none mb-3" style={h}>
              {formatarConcentracao(concentracao)}<span className="text-xl font-normal text-gray-300"> mg/mL</span>
            </p>
            <p className="text-gray-300 leading-relaxed">
              Quer dizer: cada 1 mL desse frasco tem {formatarConcentracao(concentracao)} mg da substância.
            </p>
            {modo === "calcular" && vMg.valor != null && vMl.valor != null && (
              <details className="mt-4 group">
                <summary className="cursor-pointer list-none text-white text-sm font-semibold underline underline-offset-4 decoration-1 min-h-[44px] flex items-center" style={{ textDecorationColor: OURO }}>
                  De onde saiu esse número?
                </summary>
                <div className="mt-3 border border-white/10 bg-black/40 p-4 text-sm text-gray-200 leading-relaxed">
                  Divide a quantidade pelo volume:<br />
                  <strong className="text-white">{formatarMg(vMg.valor)} mg ÷ {formatarMl(vMl.valor)} mL = {formatarConcentracao(concentracao)} mg/mL</strong>
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      {/* Agora sim a explicação: com o número na tela, o conceito gruda. */}
      <dl className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 mb-7">
        {[
          ["mg", "É a substância. Quanto dela tem no frasco."],
          ["mL", "É o líquido. Quanto dele tem no frasco."],
          ["mg/mL", "Junta os dois: quanta substância tem em cada mL."],
        ].map(([t, d]) => (
          <div key={t} className="border border-white/15 p-3 sm:p-4">
            <dt className="text-white font-bold text-xl sm:text-2xl leading-none mb-1.5" style={h}>{t}</dt>
            <dd className="text-gray-400 text-xs sm:text-sm leading-snug">{d}</dd>
          </div>
        ))}
      </dl>

      {concentracao != null && (
        <>
          {/* Aviso de segurança: curto, antes da seringa. */}
          <div role="note" className="border border-white/25 bg-black/50 p-4 sm:p-5 mb-7">
            <p className="text-white text-sm sm:text-base leading-relaxed font-semibold">
              Esta ferramenta explica concentração e volume. Ela não determina quanto você deve injetar. Use somente uma quantidade previamente orientada por profissional habilitado e confirme qualquer divergência antes da administração.
            </p>
          </div>

          {/* Passo 2: a seringa */}
          <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-3" style={h}>Entenda a escala da seringa</h3>

          <div className="grid gap-5 sm:grid-cols-2 mb-6">
            <div>
              <p className="text-gray-300 text-sm font-medium mb-2">Que escala aparece na sua seringa?</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2.5 text-sm font-medium border border-[#BA9E50] text-white bg-[#BA9E50]/10 min-h-[44px] inline-flex items-center">U-100</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mt-2">Nesta versão só a escala U-100 é interpretada. Se a sua seringa tem outra escala (U-40, U-500, mL), ela é outro dispositivo e a conta abaixo não vale.</p>
            </div>
            <div>
              <p id={`${uid}-ins-rot`} className="text-gray-300 text-sm font-medium mb-2">O líquido é insulina?</p>
              <div role="radiogroup" aria-labelledby={`${uid}-ins-rot`} className="flex flex-wrap gap-2">
                {([["nao", "Não é insulina"], ["sim", "É insulina"]] as const).map(([id, rot]) => (
                  <button key={id} type="button" role="radio" aria-checked={insulina === id} onClick={() => setInsulina(id)}
                    className={`px-4 py-2.5 text-sm font-medium border transition-colors min-h-[44px] ${insulina === id ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/40"}`}>
                    {rot}
                  </button>
                ))}
              </div>
              {insulina === null && <p className="text-gray-400 text-xs leading-relaxed mt-2">Responda para continuar. Essa seringa foi feita para insulina, e insulina tem regra própria.</p>}
            </div>
          </div>

          {insulina === "sim" && (
            <div role="alert" className="border border-white/30 bg-black/60 p-5 mb-6">
              <p className="text-white font-semibold leading-relaxed mb-3">
                Esta ferramenta não calcula doses de insulina. Use exatamente a concentração, dispositivo e quantidade prescritos para o produto específico. Não converta entre concentrações ou seringas por conta própria.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Para insulina, as unidades da escala são unidades da própria insulina, e existem produtos em concentrações diferentes (U-100, U-200, U-300, U-500) que não se convertem por regra de três.{" "}
                {fonteInsulina && <a href={linkDaFonte(fonteInsulina)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-1 hover:text-white transition-colors" onClick={() => trackEvent("source_open", { placement, fonte: fonteInsulina.id })}>A insulina está na lista de medicamentos de alto risco do ISMP</a>}.
              </p>
            </div>
          )}

          {podeSeringa && (
            <>
              {/* U-100 em destaque */}
              <div className="border border-white/15 p-5 sm:p-6 mb-6">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: OURO }}>Em uma seringa U-100</p>
                <p className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-3" style={h}>A marca 100 é 1 mL cheio</p>
                <p className="text-gray-300 leading-relaxed mb-3">
                  Então cada marquinha vale 0,01 mL. A marca 10 é 0,10 mL. A marca 50 é 0,50 mL. Se o líquido não é insulina, esses números são só medida de volume: é quanto líquido cabe ali, nada além disso.
                </p>
                <details className="group" onToggle={(e) => { if ((e.currentTarget as HTMLDetailsElement).open) trackEvent("u100_education_open", { placement }); }}>
                  <summary className="cursor-pointer list-none text-white text-sm font-semibold underline underline-offset-4 decoration-1 min-h-[44px] flex items-center" style={{ textDecorationColor: OURO }}>
                    A marca 10 não é “10 UI” do que está no meu frasco?
                  </summary>
                  <p className="text-gray-300 leading-relaxed mt-3">
                    Não. Essa seringa foi feita para insulina, onde 100 unidades ocupam 1 mL. Com outro líquido dentro, a marca 10 continua sendo 0,10 mL de volume, mas isso não significa que o outro composto possua 10 unidades internacionais. UI não tem conversão fixa para mg: muda de substância para substância. Por isso aqui a gente diz “marca 10 da seringa”, e nunca “10 UI”.
                  </p>
                </details>
              </div>

              {/* A marca */}
              <div className="mb-6">
                <label htmlFor={`${uid}-marca`} className="block text-gray-300 text-sm font-medium mb-2">Marca da seringa U-100</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <input id={`${uid}-marca`} type="text" inputMode="numeric" autoComplete="off" placeholder="10" value={marcaTxt}
                    onChange={(e) => { setMarcaTxt(e.target.value); const v = validarMarca(e.target.value); escolherMarca(v.valor); }}
                    className="w-full sm:w-32 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors" aria-describedby={`${uid}-marca-ajuda`} />
                  <input type="range" min={0} max={MARCA_MAX} step={1} value={marca ?? 0} onChange={(e) => escolherMarca(Number(e.target.value) || null)}
                    aria-label="Deslize para escolher a marca da seringa" className="w-full accent-[#BA9E50]" />
                </div>
                <p id={`${uid}-marca-ajuda`} className="text-gray-400 text-sm min-h-[20px] mb-3">
                  {marcaTxt && validarMarca(marcaTxt).erro ? `Use um número inteiro de ${MARCA_MIN} a ${MARCA_MAX}.` : "Escolha uma marca para ver o volume e a quantidade contida. Nada é escolhido por você."}
                </p>
                <SeringaU100 marca={marca} id={`${uid}-seringa`} />
              </div>

              {/* Resultado 2 */}
              <div aria-live="polite" className="mb-6">
                {leitura && (
                  <div className="border border-[#BA9E50]/40 bg-[#BA9E50]/[0.06] p-5 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: OURO }}>Marca</p>
                        <p className="text-white font-bold text-3xl leading-none" style={h}>{leitura.marca}<span className="text-base font-normal text-gray-300"> da U-100</span></p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: OURO }}>Volume correspondente</p>
                        <p className="text-white font-bold text-3xl leading-none" style={h}>{formatarMl(leitura.volumeMl)}<span className="text-base font-normal text-gray-300"> mL</span></p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: OURO }}>Quantidade contida nesse volume</p>
                        <p className="text-white font-bold text-3xl leading-none" style={h}>{formatarMg(leitura.mg)}<span className="text-base font-normal text-gray-300"> mg</span></p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mt-4 mb-3">
                      A conta: {formatarConcentracao(concentracao)} mg em cada mL × {formatarMl(leitura.volumeMl)} mL = {formatarMg(leitura.mg)} mg. É o que tem dentro desse volume.
                    </p>
                    <p className="text-white text-sm leading-relaxed font-semibold">Isso é só a medida do que existe nesse volume. Não é uma recomendação de quanto usar.</p>
                  </div>
                )}
              </div>

              {/* As três camadas, com os números da pessoa */}
              <div className="border border-white/15 p-5 sm:p-6 mb-6">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: OURO }}>O caminho todo, passo a passo</p>
                <ol className="grid gap-2 sm:grid-cols-2">
                  {[
                    modo === "calcular" && vMg.valor != null ? [`${formatarMg(vMg.valor)} mg`, "de substância no frasco"] : null,
                    modo === "calcular" && vMl.valor != null ? [`${formatarMl(vMl.valor)} mL`, "de líquido no frasco"] : null,
                    [`${formatarConcentracao(concentracao)} mg/mL`, "logo, tem isso em cada mL"],
                    leitura ? [`Marca ${leitura.marca}`, "a marca que você escolheu"] : ["Marca ?", "escolha uma acima"],
                    leitura ? [`${formatarMl(leitura.volumeMl)} mL`, "é o volume dessa marca"] : null,
                    leitura ? [`${formatarMg(leitura.mg)} mg`, "é o que tem nesse volume"] : null,
                  ].filter((x): x is [string, string] => !!x).map(([v, r], i, arr) => (
                    <li key={r} className="flex items-baseline gap-3">
                      <span className="text-gray-500 text-sm font-semibold w-5 shrink-0">{i + 1}.</span>
                      <span><strong className="text-white text-lg" style={h}>{v}</strong> <span className="text-gray-400 text-sm">— {r}{i < arr.length - 1 ? " ↓" : ""}</span></span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tabela educacional */}
              <div className="mb-6">
                <p className="text-white font-semibold mb-2">A régua inteira desse frasco</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-400 border-b border-white/15"><th className="py-2 pr-3 font-medium">Marca U-100</th><th className="py-2 pr-3 font-medium">Volume</th><th className="py-2 font-medium">Quantidade contida nessa concentração</th></tr></thead>
                    <tbody>
                      {tabela.map((l) => (
                        <tr key={l.marca} className="border-b border-white/10 text-gray-200"><td className="py-2 pr-3 font-semibold text-white">{l.marca}</td><td className="py-2 pr-3">{formatarMl(l.volumeMl)} mL</td><td className="py-2">{formatarMg(l.mg)} mg</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mt-2">Nenhuma linha é sugestão. Está tudo aqui só para você ver que, quanto mais volume, mais substância — sempre na mesma proporção.</p>
              </div>

              {/* Cuidado com um zero */}
              <div className="border border-white/25 bg-black/50 p-5 mb-6">
                <p className="text-white font-bold text-lg mb-2" style={h}>Cuidado com um zero</p>
                <p className="text-gray-300 leading-relaxed mb-3">
                  Marca 5 é 0,05 mL. Marca 50 é 0,50 mL. Um zero a mais e o volume fica dez vezes maior. Nesse seu frasco: na marca 5 tem {formatarMg(lerMarca(concentracao, 5)!.mg)} mg; na marca 50 tem {formatarMg(lerMarca(concentracao, 50)!.mg)} mg.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">A FDA já registrou erros assim em injetáveis manipulados. Não é para ter medo: é para conferir a marca duas vezes antes de usar.</p>
              </div>

              {/* Conferir uma instrução */}
              <details className="border border-white/15 p-5 sm:p-6" open={conferirAberto} onToggle={(e) => {
                const aberto = (e.currentTarget as HTMLDetailsElement).open; setConferirAberto(aberto);
                if (aberto && !jaAbriuConferir.current) { jaAbriuConferir.current = true; trackEvent("instruction_check_open", { placement }); }
              }}>
                <summary className="cursor-pointer list-none min-h-[44px] flex items-center justify-between gap-3">
                  <span className="text-white font-bold text-lg" style={h}>Conferir uma instrução que recebi</span>
                  <span aria-hidden="true" className="text-[#BA9E50] text-2xl leading-none">+</span>
                </summary>
                <p className="text-gray-400 text-sm leading-relaxed mt-3 mb-4">
                  Use este recurso somente para conferir a consistência matemática de uma orientação já fornecida por profissional habilitado. Ele compara o que você recebeu com a concentração acima.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                  <div>
                    <label htmlFor={`${uid}-mginfo`} className="block text-gray-300 text-sm font-medium mb-2">Quantidade informada pelo profissional</label>
                    <div className="flex items-center gap-3">
                      <input id={`${uid}-mginfo`} type="text" inputMode="decimal" autoComplete="off" placeholder="2,4" value={mgInfoTxt} onChange={(e) => setMgInfoTxt(e.target.value)} className={inputCls} />
                      <span className="text-gray-300 text-lg">mg</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`${uid}-marcainfo`} className="block text-gray-300 text-sm font-medium mb-2">Marca da seringa informada pelo profissional</label>
                    <div className="flex items-center gap-3">
                      <input id={`${uid}-marcainfo`} type="text" inputMode="numeric" autoComplete="off" placeholder="10" value={marcaInfoTxt} onChange={(e) => setMarcaInfoTxt(e.target.value)} className={inputCls} />
                      <span className="text-gray-300 text-lg whitespace-nowrap">U-100</span>
                    </div>
                  </div>
                </div>
                <div aria-live="polite">
                  {conferencia?.status === "compativel" && (
                    <div className="border border-white/25 p-4">
                      <p className="text-white font-semibold mb-2">A matemática informada é compatível com a concentração cadastrada.</p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {formatarConcentracao(concentracao)} mg/mL · marca {conferencia.marca} = {formatarMl(conferencia.volumeMl)} mL · contém {formatarMg(conferencia.mgContido)} mg. Isso confere a conta, não a adequação clínica: quem decide a quantidade é o prescritor.
                      </p>
                    </div>
                  )}
                  {conferencia?.status === "nao_corresponde" && (
                    <div role="alert" className="border border-white/40 bg-black/60 p-4">
                      <p className="text-white font-bold text-lg mb-2" style={h}>Os números não correspondem</p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        A quantidade em mg, a concentração e a marca da seringa informadas não são matematicamente compatíveis. Na concentração de {formatarConcentracao(concentracao)} mg/mL, a marca {conferencia.marca} ({formatarMl(conferencia.volumeMl)} mL) contém {formatarMg(conferencia.mgContido)} mg, e a instrução fala em {formatarMg(conferencia.mgInformado)} mg.
                      </p>
                      <p className="text-white text-sm leading-relaxed font-semibold">Não ajuste por conta própria. Confirme a concentração do frasco e a orientação com o prescritor ou farmacêutico antes de usar.</p>
                    </div>
                  )}
                  {(mgInfoTxt || marcaInfoTxt) && !conferencia && (
                    <p className="text-gray-400 text-sm">Preencha os dois campos com números válidos (marca inteira de {MARCA_MIN} a {MARCA_MAX}).</p>
                  )}
                </div>
              </details>
            </>
          )}
        </>
      )}
    </div>
  );
}
