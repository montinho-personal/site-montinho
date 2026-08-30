"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { GRAMAS_MAX, formataNumero, gramasPara } from "@/lib/alimentos/escala";

/**
 * "Quanto desse alimento dá X g de proteína?"
 *
 * A conta é a inversa da tabela: em vez de partir da quantidade e chegar no
 * nutriente, parte do nutriente e chega na quantidade. É a pergunta que quem
 * usou a calculadora de proteína faz em seguida — a meta diz 160 g por dia, e
 * 160 g de proteína não é um alimento.
 *
 * A RESSALVA NÃO É LETRA MIÚDA
 *
 * "Você precisaria de 400 g de peito de frango" soa como prescrição de
 * porção, e não é: é uma divisão. Ninguém come toda a proteína do dia num
 * alimento só, e apresentar o resultado sem esse enquadramento transforma
 * aritmética em conselho alimentar — que é justamente o que esta ferramenta
 * não faz.
 *
 * Por isso o texto do resultado diz "equivale a", nunca "coma", e a frase de
 * enquadramento vem junto, não escondida atrás de um ícone.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

const ALVOS = [20, 30, 40];
const ALVO_MAX = 300;

export default function QuantoPreciso({
  nomeNatural,
  proteinaPor100g,
}: {
  nomeNatural: string;
  proteinaPor100g: number;
}) {
  const [texto, setTexto] = useState("30");

  const alvo = (() => {
    const n = Number(texto.trim().replace(",", "."));
    return Number.isFinite(n) && n > 0 && n <= ALVO_MAX ? n : null;
  })();

  const gramas = alvo === null ? null : gramasPara(proteinaPor100g, "analisado", alvo);

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" style={h}>
        Quanto desse alimento dá X g de proteína?
      </h2>

      <div className="border border-white/15 p-5 sm:p-6">
        <label htmlFor="alvo-proteina" className="block text-gray-300 text-sm font-medium mb-2">
          Quero
        </label>
        <div className="flex items-center gap-2 max-w-[220px] mb-4">
          <input
            id="alvo-proteina"
            type="text"
            inputMode="decimal"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              trackEvent("food_protein_target_change", { placement: "pagina-alimento" });
            }}
            aria-invalid={alvo === null}
            aria-describedby="alvo-resultado"
            className="w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white text-2xl font-bold px-4 py-2.5 text-center min-h-[48px]"
          />
          <span className="text-gray-400 whitespace-nowrap">g de proteína</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {ALVOS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setTexto(String(n));
                trackEvent("food_protein_target_change", { placement: "pagina-alimento" });
              }}
              aria-pressed={alvo === n}
              className={`px-4 py-2 text-sm border transition-colors min-h-[44px] ${
                alvo === n
                  ? "border-[#BA9E50] text-white bg-[#BA9E50]/10"
                  : "border-white/20 text-gray-300 hover:border-white/40"
              }`}
            >
              {n} g
            </button>
          ))}
        </div>

        <p id="alvo-resultado" aria-live="polite" className="text-gray-200 text-lg leading-relaxed">
          {alvo === null ? (
            <span className="text-gray-400">Informe uma quantidade de proteína entre 1 e {ALVO_MAX} g.</span>
          ) : gramas === null ? (
            /*
             * Recusa em vez de número absurdo. "Você precisaria de 8 kg de
             * alface" é uma conta correta e uma resposta inútil — e mostrá-la
             * com naturalidade daria ao resultado uma credibilidade que ele
             * não tem.
             */
            <span className="text-gray-400">
              Para chegar a {formataNumero(alvo, "g")} g de proteína seria preciso mais de {GRAMAS_MAX / 1000} kg deste
              alimento. Nessa faixa a conta deixa de dizer alguma coisa útil.
            </span>
          ) : (
            <>
              <strong className="text-white">{formataNumero(gramas, "g")} g</strong> de {nomeNatural.toLowerCase()}{" "}
              equivalem a cerca de {formataNumero(alvo, "g")} g de proteína.
            </>
          )}
        </p>

        <p className="text-gray-500 text-sm leading-relaxed mt-4">
          Isto é uma equivalência matemática, não uma recomendação de porção. Ninguém precisa tirar toda a proteína do
          dia de um alimento só — a conta serve para você ter noção da ordem de grandeza.
        </p>
      </div>
    </div>
  );
}
