"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  NOTA_ESTIMATIVA,
  NOTA_MEDICA,
  NOTA_NAO_E_TUDO_MUSCULO,
  NOTA_PROTEINA_APETITE,
  PESO_MAX,
  PESO_MIN,
  NOTA_VELOCIDADE,
  PROTEINA_ALVO,
  PROTEINA_ALVO_MAX,
  PROTEINA_SUFICIENTE,
  PROTEINA_MAX_G,
  TREINOS,
  calcula,
  formataFaixaKg,
  formataKg,
  formataPct,
  jaProtegido,
  parseNumero,
  perdaValida,
  pesoValido,
  proteinaValida,
  type TreinoId,
} from "@/lib/glp1";

/**
 * A Calculadora de Massa Magra no GLP-1.
 *
 * O QUE ELA DEVOLVE, E O QUE ELA SE RECUSA A DEVOLVER
 *
 * Faixas de massa magra, nunca um número de "músculo perdido": massa
 * magra inclui água, glicogênio e o tecido de suporte da gordura, e parte
 * da perda é esperada mesmo fazendo tudo certo (lib/glp1.ts). Um número
 * único aqui seria precisão inventada em cima de um tema em que a pessoa
 * está assustada — que é o pior lugar para inventar.
 *
 * O RESULTADO É UMA COMPARAÇÃO, NÃO UM DIAGNÓSTICO
 *
 * O que muda a vida de quem lê não é saber a faixa: é ver quanto ela
 * encolhe com treino de força e proteína. Por isso o cenário protegido
 * aparece ao lado do atual, sempre.
 *
 * NADA DE DOSE, MARCA OU "DEVO PARAR?"
 *
 * Isso é do prescritor, e a ferramenta diz isso na cara. O que ela trata
 * é treino, proteína e composição corporal.
 *
 * PRIVACIDADE
 *
 * Peso e uso de medicamento são dados sensíveis. Nada sai do navegador:
 * nenhuma chamada de rede, nada gravado, e os eventos registram só se
 * houve resultado e qual o nível de proteção — nunca peso, nunca gramas.
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

export default function CalculadoraGLP1({ placement }: { placement: string }) {
  const [inicialTexto, setInicialTexto] = useState("");
  const [atualTexto, setAtualTexto] = useState("");
  const [treino, setTreino] = useState<TreinoId>("nenhum");
  const [proteinaTexto, setProteinaTexto] = useState("");
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const inicial = parseNumero(inicialTexto);
  const atual = parseNumero(atualTexto);
  const proteina = parseNumero(proteinaTexto);
  const inicialOk = pesoValido(inicial);
  const atualOk = pesoValido(atual);
  const proteinaOk = proteinaValida(proteina);
  const perdaOk = inicialOk && atualOk && perdaValida(inicial, atual);

  const resultado = perdaOk && proteinaOk ? calcula(inicial, atual, treino, proteina) : null;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("glp1_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  /* O evento leva o NÍVEL de proteção, nunca peso nem gramas. */
  const protecao = resultado?.protecao;
  useEffect(() => {
    if (protecao && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("glp1_calculator_use", { placement, protection: protecao });
    }
  }, [protecao, placement]);

  const resumoWhats = resultado
    ? `perdi ${formataKg(resultado.perda)} e minha faixa estimada de massa magra é ${formataFaixaKg(resultado.massaMagra)}`
    : null;
  const linhasShare = resultado
    ? [`Perda de ${formataKg(resultado.perda)}`, `Massa magra estimada: ${formataFaixaKg(resultado.massaMagra)}`]
    : [];
  const idc = (s: string) => `${s}-glp-${placement}`;

  return (
    <div ref={raiz} className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative" data-testid="calculadora-glp1">
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · nada sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-3" style={h}>
        Quanto do seu emagrecimento pode ser massa magra?
      </h2>
      <p className="text-gray-400 text-sm leading-relaxed mb-7 max-w-2xl">{NOTA_MEDICA}</p>

      <div className="grid gap-6 sm:grid-cols-2 mb-6">
        <div>
          <label htmlFor={idc("inicial")} className="block text-gray-300 text-sm font-medium mb-2">Peso quando começou</label>
          <div className="flex items-center gap-3">
            <input id={idc("inicial")} type="text" inputMode="decimal" autoComplete="off" placeholder="100" value={inicialTexto}
              onChange={(e) => setInicialTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("inicial-ajuda")} />
            <span className="text-gray-300 text-lg">kg</span>
          </div>
          <p id={idc("inicial-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {inicialTexto.trim() !== "" && !inicialOk ? `Confira o peso (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""}
          </p>
        </div>
        <div>
          <label htmlFor={idc("atual")} className="block text-gray-300 text-sm font-medium mb-2">Peso hoje</label>
          <div className="flex items-center gap-3">
            <input id={idc("atual")} type="text" inputMode="decimal" autoComplete="off" placeholder="90" value={atualTexto}
              onChange={(e) => setAtualTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("atual-ajuda")} />
            <span className="text-gray-300 text-lg">kg</span>
          </div>
          <p id={idc("atual-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {atualTexto.trim() === "" || !atualOk
              ? atualTexto.trim() !== "" ? `Confira o peso (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""
              : inicialOk && !perdaValida(inicial, atual)
                ? atual >= inicial
                  ? "O peso de hoje precisa ser menor que o do começo — esta conta é sobre o que já foi perdido."
                  : "Essa perda é grande demais para a conta fazer sentido. Confira os dois números."
                : ""}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("treino")}>
          Quantas vezes por semana você faz musculação?
        </span>
        <div role="group" aria-labelledby={idc("treino")} className="flex flex-wrap gap-2">
          {TREINOS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTreino(t.id)} aria-pressed={treino === t.id} className={chip(treino === t.id)}>
              {t.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">{TREINOS.find((t) => t.id === treino)!.descricao}</p>
      </div>

      <div className="mb-7">
        <label htmlFor={idc("prot")} className="block text-gray-300 text-sm font-medium mb-2">
          Quanta proteína você come por dia?
        </label>
        <div className="flex items-center gap-3">
          <input id={idc("prot")} type="text" inputMode="numeric" autoComplete="off" placeholder="90" value={proteinaTexto}
            onChange={(e) => setProteinaTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("prot-ajuda")} />
          <span className="text-gray-300 text-lg">gramas</span>
        </div>
        <p id={idc("prot-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px] max-w-xl">
          {proteinaTexto.trim() === ""
            ? "Em gramas de proteína, não em gramas de carne. Se não souber, chute — a calculadora mostra a meta do seu peso."
            : !proteinaOk
              ? `Use um valor entre 1 e ${PROTEINA_MAX_G} gramas por dia.`
              : atualOk
                ? `Dá ${fmt((proteina ?? 0) / atual, 2)} g por quilo de peso.`
                : ""}
        </p>
      </div>

      <div aria-live="polite">
        {resultado && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Sua estimativa</p>

            <div className="grid gap-4 sm:grid-cols-3 mb-5">
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Você perdeu</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>{formataKg(resultado.perda)}</p>
                <p className="text-gray-400 text-sm mt-1">{formataPct(resultado.perdaPct)} do peso inicial</p>
              </div>
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Massa magra, estimada</p>
                <p className="text-white font-bold text-2xl sm:text-3xl leading-none" style={h}>{formataFaixaKg(resultado.massaMagra)}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {formataPct(resultado.massaMagra.min / resultado.perda * 100)} a {formataPct(resultado.massaMagra.max / resultado.perda * 100)} da perda
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Gordura, estimada</p>
                <p className="text-white font-bold text-2xl sm:text-3xl leading-none" style={h}>{formataFaixaKg(resultado.gordura)}</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
              {NOTA_NAO_E_TUDO_MUSCULO}
            </p>

            {/* O que a pessoa controla — a única parte acionável do resultado. */}
            {jaProtegido(resultado) ? (
              <div className="mb-5 max-w-2xl">
                <p className="text-gray-300 leading-relaxed mb-2">
                  <strong className="text-white">Você já está no melhor cenário desta conta.</strong> Musculação regular com carga
                  que evolui e {fmt(resultado.proteinaPorKg, 2)} g de proteína por quilo colocam você na faixa mais baixa de perda
                  de massa magra que a literatura descreve.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  O que ainda muda o resultado daqui para frente não é fazer mais: é manter, e garantir que a carga da musculação
                  continue subindo enquanto o peso desce.
                </p>
              </div>
            ) : (
              <div className="mb-5 max-w-2xl">
                <p className="text-gray-300 leading-relaxed mb-2">
                  <strong className="text-white">Com treino de força regular e proteína na meta</strong>, a mesma perda de{" "}
                  {formataKg(resultado.perda)} tenderia a custar {formataFaixaKg(resultado.massaMagraProtegida)} de massa magra —
                  algo entre {formataKg(resultado.ganhoAoProteger.min)} e {formataKg(resultado.ganhoAoProteger.max)} a menos que
                  o seu cenário de hoje.
                </p>
                <ul className="space-y-1.5 mt-3">
                  {treino !== "regular" && (
                    <li className="text-gray-300 leading-relaxed">
                      <strong className="text-white">Musculação três vezes por semana</strong>, com carga que evolui. É a
                      intervenção com melhor evidência — e ela precisa ser de força, não de cardio.
                    </li>
                  )}
                  {resultado.faltaProteinaG > 0 && (
                    <li className="text-gray-300 leading-relaxed">
                      <strong className="text-white">
                        Mais {Math.round(resultado.faltaProteinaG)} g de proteína por dia
                      </strong>{" "}
                      para chegar nos {Math.round(resultado.minimoProteinaG)} g que já contam como proteção
                      ({PROTEINA_SUFICIENTE.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} g por quilo do seu peso de hoje). O ideal fica em{" "}
                      {Math.round(resultado.metaProteinaG)} g ({PROTEINA_ALVO.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} a{" "}
                      {PROTEINA_ALVO_MAX.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} g por quilo).
                    </li>
                  )}
                </ul>
                {resultado.faltaProteinaG > 0 && (
                  <p className="text-gray-400 text-sm leading-relaxed mt-3">{NOTA_PROTEINA_APETITE}</p>
                )}
              </div>
            )}

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_VELOCIDADE}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("glp1_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                De onde vêm esses números
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    Nos ensaios de GLP-1 em que ninguém orientou treino nem dieta, a massa magra ficou entre 25% e 40% do peso
                    perdido — 25% na subamostra de DXA do SURMOUNT-1 (tirzepatida) e cerca de 40% na do STEP-1 (semaglutida).
                    Quando treino de força e proteína entram juntos, a literatura de preservação leva essa fração para a faixa
                    de 5% a 15%.
                  </p>
                  <p>
                    A sua faixa saiu do cenário que a calculadora identificou: {" "}
                    <span className="text-white">
                      {resultado.protecao === "completa" ? "treino regular e proteína na meta" : resultado.protecao === "parcial" ? "só uma das duas proteções" : "nenhuma das duas proteções"}
                    </span>
                    . São faixas de população, aplicadas ao seu número — não uma medição do seu corpo.
                  </p>
                  <p>
                    E vale repetir: emagrecer sempre reduz massa magra, mesmo sem medicação e mesmo fazendo tudo certo. A regra
                    clássica é de que cerca de um quarto do peso perdido em dieta comum é massa magra.
                  </p>
                  <p>{NOTA_VELOCIDADE}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Massa Magra no GLP-1" caminho="/ferramentas/massa-magra-glp1"
                local="tool_result" ferramenta="glp1" resultado={linhasShare} gancho="Estimei quanto do meu emagrecimento pode ser massa magra:" aparencia="solido" />
              {placement !== "massa-magra-glp1" && (
                <Link href="/ferramentas/massa-magra-glp1" onClick={() => trackEvent("glp1_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado fechamento ferramenta="glp1" categoria={resultado.protecao} resumo={resumoWhats} placement={placement} />
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {NOTA_MEDICA}{" "}
        <Link href="/ferramentas/calculadora-de-proteina" className={ln}>Calcule sua meta de proteína</Link>.
      </p>
    </div>
  );
}
