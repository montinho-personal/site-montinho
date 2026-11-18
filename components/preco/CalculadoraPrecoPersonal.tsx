"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  FONTE_PACOTE,
  FONTE_REFERENCIA,
  FORMATOS,
  FREQUENCIAS,
  LOCAIS,
  calcular,
  faixaTxt,
  type FormatoId,
  type Frequencia,
  type LocalId,
  type Resultado,
} from "@/lib/preco-personal";

/**
 * A conta inteira roda no navegador (lib/preco-personal.ts). Nada é enviado
 * a servidor e nenhum texto é gerado por IA: preço é conta. Os eventos levam
 * só as três escolhas, que não identificam ninguém.
 */

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const opcao = (ativo: boolean) =>
  `min-h-[48px] px-4 py-2.5 text-sm border transition-colors ${foco} ${ativo ? "bg-white text-black border-white font-semibold" : "bg-black text-gray-200 border-white/25 hover:border-white/60"}`;

export default function CalculadoraPrecoPersonal() {
  const [local, setLocal] = useState<LocalId>("alphaville");
  const [formato, setFormato] = useState<FormatoId>("condominio");
  const [freq, setFreq] = useState<Frequencia>(3);
  const [res, setRes] = useState<Resultado | null>(null);
  const resRef = useRef<HTMLDivElement>(null);

  useEffect(() => { trackOncePerSession("preco_personal_view", {}); }, []);

  const online = formato === "online";
  const mudou = () => setRes(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRes(calcular(local, formato, freq));
    trackEvent("preco_personal_completed", { local, formato, frequencia: freq });
    setTimeout(() => resRef.current?.focus(), 50);
  }

  const msg = res
    ? `Oi Montinho! Usei a calculadora de preço de personal no site (${res.local.nome}, ${res.formato.nome.toLowerCase()}${res.formato.presencial ? `, ${res.freq}x por semana` : ""}) e queria saber como funciona o seu acompanhamento e o valor.`
    : "";

  return (
    <div className="border border-white/15 bg-[#0d0d0d] p-5 sm:p-6" data-testid="calculadora-preco-personal">
      <form onSubmit={onSubmit} className="space-y-6">
        <fieldset>
          <legend className="block text-sm text-gray-300 mb-2">Onde você vai treinar</legend>
          <div className="flex flex-wrap gap-2">
            {LOCAIS.map((l) => (
              <button key={l.id} type="button" aria-pressed={local === l.id} onClick={() => { setLocal(l.id); mudou(); }} className={opcao(local === l.id)}>{l.nome}</button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="block text-sm text-gray-300 mb-2">Formato</legend>
          <div className="flex flex-wrap gap-2">
            {FORMATOS.map((f) => (
              <button key={f.id} type="button" aria-pressed={formato === f.id} onClick={() => { setFormato(f.id); mudou(); }} className={opcao(formato === f.id)}>{f.nome}</button>
            ))}
          </div>
        </fieldset>

        {!online && (
        <fieldset>
          <legend className="block text-sm text-gray-300 mb-2">Quantas vezes por semana</legend>
          <div className="flex flex-wrap gap-2">
            {FREQUENCIAS.map((f) => (
              <button key={f} type="button" aria-pressed={freq === f} onClick={() => { setFreq(f); mudou(); }} className={opcao(freq === f)}>{f}×</button>
            ))}
          </div>
        </fieldset>
        )}
        {online && <p className="text-sm text-gray-400">Online é cobrado por mês, não por aula.</p>}

        <button type="submit" className={`w-full bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 ${foco}`}>Calcular a faixa de preço</button>
        <p className="text-xs text-gray-500">Gratuita, sem cadastro. A conta roda no seu navegador.</p>
      </form>

      {res && (
        <div ref={resRef} tabIndex={-1} aria-live="polite" className="mt-6 border-t border-white/10 pt-6 outline-none" data-testid="resultado-preco-personal">
          <p className="text-sm text-gray-400">
            {res.local.nome} · {res.formato.nome.toLowerCase()}{res.formato.presencial ? ` · ${res.freq}× por semana (≈ ${res.sessoes} aulas no mês)` : ""}
          </p>

          <p className="text-sm text-gray-300 mt-4">Faixa de referência por mês</p>
          <p className="text-3xl sm:text-4xl font-bold text-white my-1" style={h}>{faixaTxt(res.mensal)}</p>

          {res.avulsa && res.aulaNoPacote && (
            <dl className="grid sm:grid-cols-2 gap-4 mt-5">
              <div className="border border-white/15 p-4">
                <dt className="text-sm text-gray-400">Por aula dentro do pacote</dt>
                <dd className="text-xl font-bold text-white mt-1">{faixaTxt(res.aulaNoPacote)}</dd>
              </div>
              <div className="border border-white/15 p-4">
                <dt className="text-sm text-gray-400">Por aula avulsa</dt>
                <dd className="text-xl font-bold text-white mt-1">{faixaTxt(res.avulsa)}</dd>
              </div>
            </dl>
          )}

          {res.local.aviso && <p role="note" className="mt-4 border-l-2 border-[#BA9E50] pl-3 text-sm text-gray-200">{res.local.aviso}</p>}

          <p className="text-gray-300 text-sm leading-relaxed mt-4"><strong className="text-white">{res.formato.nome}:</strong> {res.formato.nota}</p>

          <details className="mt-5 border border-white/15 p-4" onToggle={(e) => { if ((e.target as HTMLDetailsElement).open) trackEvent("preco_personal_memoria", {}); }}>
            <summary className={`cursor-pointer text-sm text-white min-h-[44px] flex items-center ${foco}`}>Ver a conta, linha a linha</summary>
            <ol className="list-decimal pl-5 mt-3 space-y-2 text-sm text-gray-300">
              {res.memoria.map((l) => <li key={l}>{l}</li>)}
            </ol>
          </details>

          <p className="text-gray-500 text-xs mt-4">
            {res.formato.presencial ? (res.avulsaDoMontinho ? <>A aula dentro do pacote e a aula avulsa são {FONTE_PACOTE.rotulo}. </> : <>A aula dentro do pacote é {FONTE_PACOTE.rotulo}. A aula avulsa é {FONTE_REFERENCIA.rotulo} do portal {FONTE_REFERENCIA.nome}. </>) : <>O piso do online é {FONTE_PACOTE.rotulo}; o teto é {FONTE_REFERENCIA.rotulo} do portal {FONTE_REFERENCIA.nome}. </>}
            Nenhuma faixa é pesquisa de preços com amostra nem o valor de um profissional específico, e elas não distinguem aula de 30 e de 60 minutos, aula em dupla nem experiência do profissional.
          </p>

          <div className="mt-6 border border-white/15 p-4">
            <p className="text-gray-200 text-sm leading-relaxed">
              Essa faixa é um ponto de partida para você conversar sabendo a ordem de grandeza. O valor de verdade depende do seu horário, de onde você treina e do que entra no acompanhamento. Quer saber como funcionaria no seu caso?
            </p>
            <a href={getWhatsAppUrl(msg)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("preco_personal_whatsapp", { local: res.local.id, formato: res.formato.id })} className={`mt-3 inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 ${foco}`}>Falar com o Montinho no WhatsApp</a>
          </div>
        </div>
      )}
    </div>
  );
}
