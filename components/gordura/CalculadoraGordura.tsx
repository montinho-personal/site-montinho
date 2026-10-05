"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import {
  FAIXAS, RESULTADO_MAX, RESULTADO_MIN, SITIOS_3, SITIOS_7, dobras3, dobras7, faixaDe, fmt1, marinha, parseNumero,
  type Metodo, type Sexo,
} from "@/lib/percentual-gordura";

/**
 * Nada sai do navegador. Os eventos levam só o método e a faixa, nunca
 * medida, idade ou percentual.
 */

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const campo = `w-full min-w-0 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-lg font-bold px-3 py-3 outline-none ${foco}`;
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const chip = (on: boolean) => `border px-3 py-3 text-sm min-h-[48px] ${on ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300"} ${foco}`;

const METODOS: { id: Metodo; nome: string; sub: string }[] = [
  { id: "fita", nome: "Fita métrica", sub: "Marinha dos EUA" },
  { id: "dobras3", nome: "3 dobras", sub: "adipômetro" },
  { id: "dobras7", nome: "7 dobras", sub: "adipômetro" },
];

function Campo({ rotulo, valor, onChange, ex }: { rotulo: string; valor: string; onChange: (v: string) => void; ex: string }) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-300 mb-1">{rotulo}</span>
      <input inputMode="decimal" className={campo} value={valor} onChange={(e) => onChange(e.target.value)} placeholder={ex} />
    </label>
  );
}

export default function CalculadoraGordura() {
  const [metodo, setMetodo] = useState<Metodo>("fita");
  const [sexo, setSexo] = useState<Sexo>("homem");
  const [v, setV] = useState<Record<string, string>>({});
  const [erro, setErro] = useState<string | null>(null);
  const [res, setRes] = useState<{ pct: number; peso: number | null } | null>(null);
  const iniciou = useRef(false);
  const resRef = useRef<HTMLDivElement>(null);

  useEffect(() => { trackOncePerSession("bodyfat_view", {}); }, []);
  const set = (k: string) => (x: string) => {
    if (!iniciou.current) { iniciou.current = true; trackEvent("bodyfat_started", {}); }
    setV((o) => ({ ...o, [k]: x })); setRes(null);
  };
  const n = (k: string) => parseNumero(v[k] ?? "");

  const sitios = metodo === "dobras3" ? SITIOS_3[sexo] : SITIOS_7;

  function calcular(e: React.FormEvent) {
    e.preventDefault();
    const peso = (v.peso ?? "").trim() ? n("peso") : null;
    if (peso !== null && (peso < 30 || peso > 300)) return setErro("O peso vai de 30 a 300 kg. Se não quiser informar, deixe em branco.");
    let pct: number | null = null;
    if (metodo === "fita") {
      const a = n("altura"), p = n("pescoco"), c = n("cintura"), q = sexo === "mulher" ? n("quadril") : null;
      if (a === null || a < 120 || a > 230) return setErro("Digite a altura em centímetros, entre 120 e 230.");
      if (p === null || p < 20 || p > 70) return setErro("Digite o pescoço em centímetros, entre 20 e 70.");
      if (c === null || c < 40 || c > 200) return setErro("Digite a cintura em centímetros, entre 40 e 200.");
      if (sexo === "mulher" && (q === null || q < 50 || q > 200)) return setErro("Digite o quadril em centímetros, entre 50 e 200.");
      pct = marinha(sexo, a, p, c, q);
    } else {
      const idade = n("idade");
      if (idade === null || idade < 18 || idade > 80) return setErro("Digite a idade, entre 18 e 80 anos. As equações de dobras foram feitas para adultos.");
      let soma = 0;
      for (const s of sitios) {
        const x = n(s);
        if (x === null || x < 2 || x > 80) return setErro(`Digite a dobra ${s.toLowerCase()} em milímetros, entre 2 e 80.`);
        soma += x;
      }
      pct = metodo === "dobras3" ? dobras3(sexo, soma, idade) : dobras7(sexo, soma, idade);
    }
    if (pct === null || !Number.isFinite(pct) || pct < RESULTADO_MIN || pct > RESULTADO_MAX)
      return setErro("A conta deu um valor fora do possível. Confira as medidas: costuma ser uma unidade trocada (mm por cm) ou um campo digitado errado.");
    setErro(null);
    setRes({ pct, peso });
    trackEvent("bodyfat_completed", { metodo, faixa: faixaDe(pct, sexo).id });
    setTimeout(() => resRef.current?.focus(), 50);
  }

  const f = res ? faixaDe(res.pct, sexo) : null;
  const pos = res ? Math.min(100, (res.pct / 45) * 100) : 0;
  const limites = FAIXAS.map((x) => Math.min(x.ate[sexo], 45));

  return (
    <div className="border border-white/15 bg-[#0d0d0d] p-5 sm:p-6" data-testid="calculadora-gordura">
      <form onSubmit={calcular} noValidate className="space-y-4">
        <fieldset>
          <legend className="text-sm text-gray-300 mb-2">Método</legend>
          <div className="grid grid-cols-3 gap-2">
            {METODOS.map((m) => (
              <button key={m.id} type="button" aria-pressed={metodo === m.id} onClick={() => { setMetodo(m.id); setRes(null); setErro(null); }} className={chip(metodo === m.id)}>
                {m.nome}<span className="block text-[11px] text-gray-500">{m.sub}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm text-gray-300 mb-2">Sexo</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["homem", "mulher"] as Sexo[]).map((s) => (
              <button key={s} type="button" aria-pressed={sexo === s} onClick={() => { setSexo(s); setRes(null); }} className={chip(sexo === s)}>{s === "homem" ? "Homem" : "Mulher"}</button>
            ))}
          </div>
        </fieldset>

        {metodo === "fita" ? (
          <div className="grid grid-cols-2 gap-3">
            <Campo rotulo="Altura (cm)" valor={v.altura ?? ""} onChange={set("altura")} ex="175" />
            <Campo rotulo="Pescoço (cm)" valor={v.pescoco ?? ""} onChange={set("pescoco")} ex={sexo === "homem" ? "38" : "32"} />
            <Campo rotulo={sexo === "homem" ? "Cintura no umbigo (cm)" : "Cintura mais fina (cm)"} valor={v.cintura ?? ""} onChange={set("cintura")} ex={sexo === "homem" ? "85" : "72"} />
            {sexo === "mulher" && <Campo rotulo="Quadril (cm)" valor={v.quadril ?? ""} onChange={set("quadril")} ex="98" />}
            <Campo rotulo="Peso (kg, opcional)" valor={v.peso ?? ""} onChange={set("peso")} ex="75" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Campo rotulo="Idade" valor={v.idade ?? ""} onChange={set("idade")} ex="30" />
            {sitios.map((s) => <Campo key={s} rotulo={`${s} (mm)`} valor={v[s] ?? ""} onChange={set(s)} ex="12" />)}
            <Campo rotulo="Peso (kg, opcional)" valor={v.peso ?? ""} onChange={set("peso")} ex="75" />
          </div>
        )}
        <p className="text-xs text-gray-500">
          {metodo === "fita"
            ? sexo === "homem"
              ? "Pescoço logo abaixo do gogó. Cintura na altura do umbigo, depois de soltar o ar, sem encolher a barriga."
              : "Pescoço logo abaixo da laringe. Cintura na parte mais fina. Quadril na parte mais larga do bumbum, com os pés juntos."
            : "Lado direito do corpo, pele pinçada com o adipômetro, leitura em milímetros. Meça cada ponto duas vezes e use a média."}
        </p>
        {erro && <p role="alert" className="text-sm text-red-400">{erro}</p>}
        <button type="submit" className={`w-full bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 ${foco}`}>Calcular meu percentual de gordura</button>
      </form>

      {res && f && (
        <div ref={resRef} tabIndex={-1} aria-live="polite" className="mt-6 border-t border-white/10 pt-6 outline-none space-y-4">
          <div>
            <p className="text-sm text-gray-400">Seu percentual de gordura estimado</p>
            <p className="text-5xl font-bold text-white my-1" style={h}>{fmt1(res.pct)}%</p>
            <p className="text-lg font-semibold text-[#BA9E50]">{f.nome}</p>
          </div>
          <div>
            <div className="relative h-3 flex" aria-hidden="true">
              {limites.map((l, k) => <div key={k} style={{ flex: l - (k ? limites[k - 1] : 0), background: ["#60a5fa", "#22c55e", "#86efac", "#eab308", "#ef4444"][k] }} />)}
              <div className="absolute -top-1 w-1 h-5 bg-white" style={{ left: `calc(${pos}% - 2px)` }} />
            </div>
            <div className="flex justify-between text-[11px] text-gray-500 mt-1" aria-hidden="true"><span>0%</span><span>15%</span><span>30%</span><span>45%</span></div>
          </div>
          <p className="text-gray-200 leading-relaxed">{f.descricao}</p>
          {res.peso && (
            <p className="text-gray-300">Com {fmt1(res.peso)} kg, são cerca de <strong className="text-white">{fmt1((res.peso * res.pct) / 100)} kg de gordura</strong> e {fmt1(res.peso * (1 - res.pct / 100))} kg de massa magra (músculo, osso, órgãos e água).</p>
          )}
          <p className="text-xs text-gray-500">
            {metodo === "fita" ? "A fita erra, em média, 3 a 4 pontos para mais ou para menos." : "Com adipômetro, o resultado depende muito de quem mede: compare sempre com a mesma pessoa e o mesmo aparelho."}{" "}
            Use para acompanhar a sua evolução, não para se comparar com o número de outra pessoa. Para ver o caminho até outro percentual, use a <Link href="/ferramentas/composicao-corporal" className={ln}>calculadora de composição corporal</Link>.
          </p>
          <div className="border border-white/15 p-4">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
            {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white text-sm leading-relaxed mb-3">{t}</p>)}
            <p className="text-gray-200 text-sm leading-relaxed">Esse número é um ponto de partida. Quer ajuda para transformar isso em um plano para você?</p>
            <a href={getWhatsAppUrl("Oi Montinho! Calculei meu percentual de gordura no site e queria ajuda para montar um plano.")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("bodyfat_whatsapp", { metodo })} className={`mt-3 inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 ${foco}`}>Falar com o Montinho no WhatsApp</a>
          </div>
        </div>
      )}
    </div>
  );
}
