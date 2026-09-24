"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  GORDURA_ESSENCIAL,
  GORDURA_MAX,
  GORDURA_MIN,
  NOTA_BIOIMPEDANCIA,
  NOTA_FAIXA_NAO_E_META,
  NOTA_SEM_TREINO_INVIAVEL,
  NOTA_MASSA_MAGRA_DE_PE,
  NOTA_MESMO_APARELHO,
  PESO_MAX,
  PESO_MIN,
  alvoValido,
  recusaDoAlvo,
  textoDaRecusa,
  calcula,
  formataKg,
  formataPct,
  gorduraValida,
  parseNumero,
  pesoValido,
  type Sexo,
} from "@/lib/composicao";

/**
 * A Calculadora de Composição Corporal.
 *
 * A RESSALVA VEM ANTES DO RESULTADO
 *
 * Todo o resto da ferramenta depende de um número que a pessoa leu numa
 * balança de bioimpedância — e que a balança não mediu, deduziu. Dizer
 * isso depois do resultado seria deixar alguém acreditar no número por
 * alguns segundos antes de desacreditar; dizer antes é o que permite ler
 * a conta com a margem certa.
 *
 * OS DOIS CENÁRIOS SÃO O PRODUTO
 *
 * "Com a massa magra de pé" e "sem treino de força" chegam ao mesmo
 * percentual de gordura por caminhos muito diferentes — e a diferença
 * entre os dois pesos finais é o argumento mais concreto a favor da
 * musculação que uma calculadora consegue fazer.
 *
 * PRIVACIDADE
 *
 * Peso e gordura corporal são dados do corpo. Nada sai do navegador, nada
 * é gravado, e os eventos levam só a faixa — nunca os números.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const chip = (ativo: boolean) =>
  `px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
  }`;

export default function CalculadoraComposicao({ placement }: { placement: string }) {
  const [sexo, setSexo] = useState<Sexo>("homem");
  const [pesoTexto, setPesoTexto] = useState("");
  const [gorduraTexto, setGorduraTexto] = useState("");
  const [alvoTexto, setAlvoTexto] = useState("");
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const gordura = parseNumero(gorduraTexto);
  const alvo = parseNumero(alvoTexto);
  const pesoOk = pesoValido(peso);
  const gorduraOk = gorduraValida(gordura);
  const alvoOk = gorduraOk && alvoValido(alvo, gordura, sexo);
  const recusa = gorduraOk ? recusaDoAlvo(alvo, gordura, sexo) : null;

  const resultado = pesoOk && gorduraOk ? calcula(peso, gordura, sexo, alvoOk ? alvo : null) : null;
  const faixaId = resultado?.faixa.id;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("composition_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  useEffect(() => {
    if (faixaId && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("composition_calculator_use", { placement, range: faixaId });
    }
  }, [faixaId, placement]);

  const resumoWhats = resultado
    ? resultado.alvo
      ? `estou com ${formataPct(resultado.gorduraPct)} de gordura e para chegar a ${formataPct(resultado.alvo.gorduraAlvoPct)} preciso perder ${formataKg(resultado.alvo.perda)}`
      : `estou com ${formataPct(resultado.gorduraPct)} de gordura e ${formataKg(resultado.massaMagra)} de massa magra`
    : null;
  const linhasShare = resultado
    ? [`${formataPct(resultado.gorduraPct)} de gordura`, `Massa magra: ${formataKg(resultado.massaMagra)}`, resultado.faixa.nome]
    : [];
  const idc = (s: string) => `${s}-comp-${placement}`;

  return (
    <div ref={raiz} className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative" data-testid="calculadora-composicao">
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · nada sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-3" style={h}>
        O que os números do seu exame querem dizer
      </h2>
      {/* A ressalva antes do formulário: tudo aqui depende de um número estimado. */}
      <p className="text-gray-400 text-sm leading-relaxed mb-7 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
        {NOTA_BIOIMPEDANCIA}
      </p>

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sexo")}>Você é</span>
        <div role="group" aria-labelledby={idc("sexo")} className="flex flex-wrap gap-2">
          {(["homem", "mulher"] as Sexo[]).map((s) => (
            <button key={s} type="button" onClick={() => setSexo(s)} aria-pressed={sexo === s} className={chip(sexo === s)}>
              {s === "homem" ? "Homem" : "Mulher"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 mb-6">
        <div>
          <label htmlFor={idc("peso")} className="block text-gray-300 text-sm font-medium mb-2">Seu peso</label>
          <div className="flex items-center gap-3">
            <input id={idc("peso")} type="text" inputMode="decimal" autoComplete="off" placeholder="90" value={pesoTexto}
              onChange={(e) => setPesoTexto(e.target.value)} className={`w-28 ${campo}`} aria-describedby={idc("peso-ajuda")} />
            <span className="text-gray-300 text-lg">kg</span>
          </div>
          <p id={idc("peso-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {pesoTexto.trim() !== "" && !pesoOk ? `Entre ${PESO_MIN} e ${PESO_MAX} kg.` : ""}
          </p>
        </div>
        <div>
          <label htmlFor={idc("gordura")} className="block text-gray-300 text-sm font-medium mb-2">Gordura do exame</label>
          <div className="flex items-center gap-3">
            <input id={idc("gordura")} type="text" inputMode="decimal" autoComplete="off" placeholder={sexo === "homem" ? "25" : "32"} value={gorduraTexto}
              onChange={(e) => setGorduraTexto(e.target.value)} className={`w-28 ${campo}`} aria-describedby={idc("gordura-ajuda")} />
            <span className="text-gray-300 text-lg">%</span>
          </div>
          <p id={idc("gordura-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {gorduraTexto.trim() !== "" && !gorduraOk ? `Entre ${GORDURA_MIN}% e ${GORDURA_MAX}%.` : ""}
          </p>
        </div>
        <div>
          <label htmlFor={idc("alvo")} className="block text-gray-300 text-sm font-medium mb-2">
            Alvo <span className="text-gray-500 font-normal">(opcional)</span>
          </label>
          <div className="flex items-center gap-3">
            <input id={idc("alvo")} type="text" inputMode="decimal" autoComplete="off" placeholder={sexo === "homem" ? "15" : "24"} value={alvoTexto}
              onChange={(e) => setAlvoTexto(e.target.value)} className={`w-28 ${campo}`} aria-describedby={idc("alvo-ajuda")} />
            <span className="text-gray-300 text-lg">%</span>
          </div>
          <p id={idc("alvo-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {alvoTexto.trim() === "" || alvoOk
              ? ""
              : !gorduraOk
                ? ""
                : alvo !== null && alvo >= gordura
                  ? "O alvo precisa ser menor que o percentual de hoje."
                  : `Abaixo de ${GORDURA_ESSENCIAL[sexo]}% está a gordura essencial — a conta não vai até lá.`}
          </p>
        </div>
      </div>

      <div aria-live="polite">
        {resultado && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>

            <div className="grid gap-4 sm:grid-cols-3 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Massa magra</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>{formataKg(resultado.massaMagra)}</p>
                <p className="text-gray-400 text-sm mt-1">músculo, osso, órgãos e água</p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Massa gorda</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>{formataKg(resultado.massaGorda)}</p>
                <p className="text-gray-400 text-sm mt-1">{formataPct(resultado.gorduraPct)} do seu peso</p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Leitura</p>
                <p className="text-white font-bold text-xl sm:text-2xl leading-tight" style={h}>{resultado.faixa.nome}</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">{resultado.faixa.descricao}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-2xl">{NOTA_FAIXA_NAO_E_META}</p>

            {/* Os dois cenários: o argumento da musculação, em números. */}
            {resultado.alvo && (
              <div className="mb-5 max-w-2xl">
                <p className="text-gray-300 leading-relaxed mb-3">
                  Para chegar a <strong className="text-white">{formataPct(resultado.alvo.gorduraAlvoPct)}</strong>{" "}
                  ({resultado.alvo.faixaAlvo.nome.toLowerCase()}), o caminho depende do que acontece com a sua massa magra:
                </p>
                <div className="grid gap-3 sm:grid-cols-2 mb-3">
                  <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-4">
                    <p className="text-gray-400 text-xs mb-1">Com treino de força e proteína</p>
                    <p className="text-white font-bold text-2xl leading-none mb-1" style={h}>
                      −{formataKg(resultado.alvo.perda)}
                    </p>
                    <p className="text-gray-300 text-sm">
                      você chegaria a {formataKg(resultado.alvo.pesoNoAlvo)}, com a massa magra intacta
                    </p>
                  </div>
                  <div className="border border-white/15 p-4">
                    <p className="text-gray-400 text-xs mb-1">Sem treino de força</p>
                    {resultado.alvo.semTreino.viavel ? (
                      <>
                        <p className="text-white font-bold text-2xl leading-none mb-1" style={h}>
                          −{formataKg(resultado.alvo.semTreino.perda)}
                        </p>
                        <p className="text-gray-300 text-sm">
                          precisaria descer até {formataKg(resultado.alvo.semTreino.pesoNoAlvo)}, com{" "}
                          {formataKg(resultado.alvo.semTreino.massaMagraFinal)} de massa magra
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-white font-bold text-2xl leading-none mb-1" style={h}>
                          não fecha
                        </p>
                        <p className="text-gray-300 text-sm">o músculo acabaria antes do percentual chegar ao alvo</p>
                      </>
                    )}
                  </div>
                </div>
                {resultado.alvo.semTreino.viavel ? (
                  <p className="text-gray-300 leading-relaxed">
                    É o mesmo percentual de gordura nos dois casos — e{" "}
                    <strong className="text-white">
                      {formataKg(resultado.alvo.semTreino.perda - resultado.alvo.perda)} a mais
                    </strong>{" "}
                    de balança no segundo, porque parte do que sai é músculo. Quem emagrece assim chega no número e
                    não reconhece o corpo no espelho.
                  </p>
                ) : (
                  <p className="text-gray-300 leading-relaxed">{NOTA_SEM_TREINO_INVIAVEL}</p>
                )}
              </div>
            )}

            {recusa && (
              <p className="text-gray-300 leading-relaxed mb-5 max-w-2xl border border-white/15 p-4">
                {textoDaRecusa(recusa, sexo)}
              </p>
            )}

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
              {NOTA_MASSA_MAGRA_DE_PE}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_MESMO_APARELHO}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("composition_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    Massa gorda é peso × percentual: {formataKg(resultado.pesoAtual)} × {formataPct(resultado.gorduraPct)} ={" "}
                    <span className="text-white">{formataKg(resultado.massaGorda)}</span>. O que sobra é a massa magra.
                  </p>
                  {resultado.alvo && (
                    <>
                      <p>
                        Com a massa magra de pé, o peso no alvo é{" "}
                        <span className="text-white">massa magra ÷ (1 − alvo)</span>:{" "}
                        {formataKg(resultado.massaMagra)} ÷ {(1 - resultado.alvo.gorduraAlvoPct / 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} ={" "}
                        {formataKg(resultado.alvo.pesoNoAlvo)}.
                      </p>
                      <p>
                        O cenário sem treino usa a regra clássica de que cerca de um quarto do peso perdido é massa
                        magra. Com ela, a massa magra também encolhe — e é por isso que o peso final fica mais baixo
                        para o mesmo percentual de gordura.
                      </p>
                    </>
                  )}
                  <p>
                    As faixas de leitura seguem o que o artigo de bioimpedância do site publica: homens saudáveis
                    entre 10% e 20%, mulheres entre 18% e 28%.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Composição Corporal" caminho="/ferramentas/composicao-corporal"
                local="tool_result" ferramenta="composicao" resultado={linhasShare} gancho="Interpretei os números da minha composição corporal:" aparencia="solido" />
              {placement !== "composicao-corporal" && (
                <Link href="/ferramentas/composicao-corporal" onClick={() => trackEvent("composition_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado fechamento ferramenta="composicao" categoria={resultado.faixa.id} resumo={resumoWhats} placement={placement} />
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {NOTA_MASSA_MAGRA_DE_PE}{" "}
        <Link href="/ferramentas/calculadora-de-proteina" className={ln}>Calcule a proteína que protege essa massa</Link>.
      </p>
    </div>
  );
}
