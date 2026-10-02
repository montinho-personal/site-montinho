"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ALTURA_MAX, ALTURA_MIN, IDADE_ADULTA, IDADE_MAX, IDADE_MIN, NIVEIS, PESO_MAX, PESO_MIN, arredondaKcal, formataFaixa, type Sexo } from "@/lib/calorias";
import { ALEM, ENQUETE, FATORES, FATOR_CICLO, KCAL_POR_KG, PERIODOS, SUBIDAS, equivalenteBeliscos, gastoDe, perspectiva, type AlemId, type PeriodoId } from "@/lib/beliscometro/balanca";
import { compartilharImagem, desenharCard, type Formato } from "@/lib/beliscometro/card";

/**
 * Capítulo 2 — "O que a balança não conta".
 * 7.700 kcal/kg aparece sempre como aproximação educativa. Superávit e
 * consumo vivem em blocos visualmente distintos para não serem confundidos.
 * Nunca afirma a causa individual nem que algo seria impossível.
 */
const OURO = "#BA9E50";
const AZUL = "#5aa9e6";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const SEXOS: { id: Sexo; r: string }[] = [{ id: "masculino", r: "Masculino" }, { id: "feminino", r: "Feminino" }, { id: "nao_informado", r: "Prefiro não informar" }];

function H2({ children }: { children: React.ReactNode }) {
  return <h3 className="text-white text-2xl font-bold leading-tight" style={h}>{children}</h3>;
}

type Passo = "enquete" | "gancho" | "dados" | "beliscos" | "balanca" | "twist" | "resultado";

function Op({ a, on, children }: { a: boolean; on: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={a} onClick={on} className={`min-h-[52px] px-4 py-2.5 text-left border transition-all active:scale-[0.98] ${a ? "text-black font-semibold" : "text-gray-100 border-white/15"}`} style={a ? { background: OURO, borderColor: OURO } : undefined}>{children}</button>;
}

export default function Balanca({ kcalBeliscos }: { kcalBeliscos?: number }) {
  const [p, setP] = useState<Passo>("enquete");
  const [enquete, setEnquete] = useState<string>();
  const [peso, setPeso] = useState(""); const [altura, setAltura] = useState(""); const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState<Sexo>(); const [nivelId, setNivelId] = useState<string>();
  const [alem, setAlem] = useState<AlemId>();
  const [subiu, setSubiu] = useState(2); const [outro, setOutro] = useState(false);
  const [periodo, setPeriodo] = useState<PeriodoId>("fds");
  const [simKg, setSimKg] = useState(2);
  const mexeu = useRef(false);
  const temBeliscos = typeof kcalBeliscos === "number" && kcalBeliscos > 0;

  useEffect(() => { trackEvent("balanca_start", { com_beliscometro: temBeliscos }); }, [temBeliscos]);

  const n = (s: string) => Number(s.replace(",", "."));
  const pesoN = n(peso), altN = (() => { const a = n(altura); return a > 0 && a < 3 ? Math.round(a * 100) : Math.round(a); })(), idN = Math.round(n(idade));
  const dadosOk = pesoN >= PESO_MIN && pesoN <= PESO_MAX && altN >= ALTURA_MIN && altN <= ALTURA_MAX && idN >= IDADE_MIN && idN <= IDADE_MAX && !!sexo && !!nivelId;
  const menor = idN > 0 && idN < IDADE_ADULTA;
  const gasto = dadosOk ? gastoDe({ peso: pesoN, altura: altN, idade: idN, sexo: sexo!, nivelId: nivelId! }) : null;
  const dias = PERIODOS.find((x) => x.id === periodo)!.dias;
  const persp = gasto ? perspectiva(subiu, dias, gasto.tdee) : null;
  const sim = gasto ? perspectiva(simKg, 1, gasto.tdee) : null;
  const eq = temBeliscos && alem ? equivalenteBeliscos(kcalBeliscos!, dias, alem) : null;

  const card = "border border-white/10 bg-white/[0.03] p-5 sm:p-6";
  const btn = "min-h-[52px] px-6 font-semibold text-black w-full sm:w-auto disabled:opacity-40 tracking-wide";
  const campo = "w-full min-h-[48px] bg-black border border-white/20 px-3 text-white text-lg focus:outline-none focus:border-white";
  const avancar = (x: Passo) => { setP(x); };

  async function compartilhar(formato: Formato) {
    const blob = await desenharCard(formato, "O que a balança não conta", [
      { tipo: "rotulo", texto: "Você achou que" }, { tipo: "valor", texto: `+${kg(subiu)} kg na balança = +${kg(subiu)} kg de gordura` },
      { tipo: "rotulo", texto: `Mas ${kg(subiu)} kg de gordura representariam` }, { tipo: "grande", texto: `≈ ${kc(subiu * KCAL_POR_KG)} kcal` },
      { tipo: "rotulo", texto: "de SUPERÁVIT energético" },
      ...(temBeliscos ? [{ tipo: "espaco" as const }, { tipo: "rotulo" as const, texto: "Meu Beliscômetro estimou" }, { tipo: "valor" as const, texto: `≈ ${kc(kcalBeliscos!)} kcal/dia` }] : []),
      { tipo: "espaco" }, { tipo: "frase", texto: "A balança conta peso.\nNão conta a história." },
    ], "montinhopersonal.com.br/ferramentas/beliscometro");
    const via = await compartilharImagem(blob, `balanca-${formato}.png`, "A balança conta peso. Não conta a história. https://www.montinhopersonal.com.br/ferramentas/beliscometro?utm_source=share&utm_medium=card&utm_campaign=balanca#balanca");
    trackEvent("balanca_share", { formato, via });
  }

  return (
    <div id="balanca" className="scroll-mt-24 space-y-6 text-left">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.25em]" style={{ color: OURO }}>Capítulo 2</p>
        <p className="text-white text-3xl font-bold mt-1" style={h}>O que a balança não conta</p>
        <p className="text-gray-400 text-sm mt-1">Veja quanto seria necessário consumir além do seu gasto para acumular 1 ou 2 kg de gordura.</p>
      </div>

      {p === "enquete" && (
        <div className={card}>
          <H2>Depois de um fim de semana mais pesado, você já subiu na balança e pensou…</H2>
          <div className="grid gap-2 mt-4">
            {ENQUETE.map((e) => <Op key={e.id} a={enquete === e.id} on={() => { setEnquete(e.id); trackEvent("balanca_poll", { resposta: e.id }); setTimeout(() => avancar("gancho"), 200); }}>{e.rotulo}</Op>)}
          </div>
        </div>
      )}

      {p === "gancho" && (
        <div className={`${card} text-center py-10`}>
          <p className="text-white text-2xl" style={h}>Mas será que tudo isso virou gordura?</p>
          <button type="button" onClick={() => avancar("dados")} className={`${btn} mt-6`} style={{ background: OURO }}>FAZER A CONTA</button>
        </div>
      )}

      {p === "dados" && (
        <div className={card}>
          <H2>Primeiro, uma estimativa do seu gasto</H2>
          <p className="text-gray-400 text-sm mt-1">Fica só no seu navegador.</p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <label className="text-sm text-gray-300">Peso (kg)<input inputMode="decimal" value={peso} onChange={(e) => setPeso(e.target.value)} className={campo} placeholder="80" /></label>
            <label className="text-sm text-gray-300">Altura (cm)<input inputMode="decimal" value={altura} onChange={(e) => setAltura(e.target.value)} className={campo} placeholder="170" /></label>
            <label className="text-sm text-gray-300">Idade<input inputMode="numeric" value={idade} onChange={(e) => setIdade(e.target.value)} className={campo} placeholder="35" /></label>
          </div>
          <p className="text-gray-300 text-sm mt-4 mb-2">Para a fórmula de estimativa metabólica</p>
          <div className="flex flex-wrap gap-2">{SEXOS.map((s) => <Op key={s.id} a={sexo === s.id} on={() => setSexo(s.id)}>{s.r}</Op>)}</div>
          <p className="text-gray-500 text-xs mt-2">Usada só porque a equação (Mifflin-St Jeor) tem constantes diferentes para masculino e feminino.</p>
          <p className="text-gray-300 text-sm mt-4 mb-2">Como é sua rotina de atividade?</p>
          <div className="grid gap-2">
            {NIVEIS.map((nv) => (
              <Op key={nv.id} a={nivelId === nv.id} on={() => setNivelId(nv.id)}>
                <span className="block">{nv.titulo}</span><span className={`block text-xs mt-0.5 font-normal ${nivelId === nv.id ? "text-black/70" : "text-gray-400"}`}>{nv.descricao}</span>
              </Op>
            ))}
          </div>
          {menor && <p className="text-[#E8B4B4] text-sm mt-3">Para menores de 18 anos, essa conta não é o melhor caminho: converse com um profissional de saúde.</p>}
          <button type="button" disabled={!dadosOk || menor} onClick={() => avancar(temBeliscos ? "beliscos" : "balanca")} className={`${btn} mt-5`} style={{ background: OURO }}>Continuar</button>
          {gasto && !menor && (
            <p className="text-gray-300 text-sm mt-4">TMB estimada: <strong className="text-white">≈ {formataFaixa(gasto.tmb)} kcal/dia</strong> · gasto diário estimado: <strong className="text-white">≈ {formataFaixa(gasto.tdee)} kcal/dia</strong>.
              <span className="block text-gray-500 text-xs mt-1">Seu corpo não gasta exatamente o mesmo valor todos os dias. Esse número é uma estimativa para contextualizar a próxima conta.</span></p>
          )}
        </div>
      )}

      {p === "beliscos" && temBeliscos && (
        <div className={card}>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: OURO }}>Do seu Beliscômetro</p>
          <p className="text-white text-3xl font-bold mt-1" style={h}>≈ {kc(kcalBeliscos!)} kcal/dia</p>
          <div className="mt-4"><H2>Esses beliscos foram além daquilo que você normalmente comeria?</H2></div>
          <div className="grid gap-2 mt-4">{ALEM.map((a) => <Op key={a.id} a={alem === a.id} on={() => { setAlem(a.id); setTimeout(() => avancar("balanca"), 200); }}>{a.rotulo}</Op>)}</div>
          <p className="text-gray-500 text-xs mt-3">Importa: se você comeu menos em outra refeição, os beliscos não são, necessariamente, calorias a mais.</p>
        </div>
      )}

      {p === "balanca" && (
        <div className={card}>
          <H2>Quanto a balança subiu?</H2>
          <div className="flex flex-wrap gap-2 mt-4">
            {SUBIDAS.map((s) => <Op key={s} a={!outro && subiu === s} on={() => { setOutro(false); setSubiu(s); }}>+{kg(s)} kg</Op>)}
            <Op a={outro} on={() => setOutro(true)}>Outro</Op>
          </div>
          {outro && <label className="block mt-3 text-sm text-gray-300">kg<input inputMode="decimal" className={campo} defaultValue={kg(subiu)} onChange={(e) => { const v = n(e.target.value); if (v > 0 && v <= 15) setSubiu(v); }} /></label>}
          <div className="mt-5"><H2>Em quanto tempo?</H2></div>
          <div className="grid grid-cols-2 gap-2 mt-4">{PERIODOS.map((x) => <Op key={x.id} a={periodo === x.id} on={() => setPeriodo(x.id)}>{x.rotulo}</Op>)}</div>
          <button type="button" onClick={() => { setSimKg(Math.min(4, subiu)); avancar("twist"); }} className={`${btn} mt-5`} style={{ background: OURO }}>Ver o resultado</button>
        </div>
      )}

      {p === "twist" && (
        <div className={`${card} text-center py-10`}>
          <p className="text-gray-300">Você viu</p>
          <p className="text-6xl font-bold my-2" style={{ ...h, color: OURO }}>+{kg(subiu)} kg</p>
          <p className="text-gray-300">na balança.</p>
          <p className="text-white text-xl mt-6" style={h}>Mas +{kg(subiu)} kg na balança não significa automaticamente +{kg(subiu)} kg de gordura.</p>
          <button type="button" onClick={() => { avancar("resultado"); trackEvent("balanca_result", { periodo, alem: alem ?? "", com_beliscometro: temBeliscos }); }} className={`${btn} mt-6`} style={{ background: OURO }}>Vamos colocar isso em perspectiva</button>
        </div>
      )}

      {p === "resultado" && gasto && persp && sim && (
        <>
          <div className={card}>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Uma conta de referência</p>
            <p className="text-white mt-1">Para fins educativos, usa-se que <strong>1 kg de gordura corporal ≈ 7.700 kcal</strong> de energia armazenada. É uma aproximação matemática útil para contextualizar, não uma regra exata: o corpo não converte excedente em gordura com eficiência fixa.</p>
          </div>

          <div className={card}>
            <p className="text-gray-300 text-sm">A balança subiu…</p>
            <div className="flex items-center gap-3 mt-2">
              <button type="button" aria-label="Diminuir 0,5 kg" onClick={() => setSimKg(Math.max(0.5, simKg - 0.5))} className="w-12 h-12 border border-white/25 text-white text-2xl">−</button>
              <input type="range" min={0.5} max={4} step={0.5} value={simKg} onChange={(e) => { setSimKg(Number(e.target.value)); if (!mexeu.current) { mexeu.current = true; trackEvent("balanca_slider", {}); } }} aria-label="Quilos na balança" className="flex-1 accent-[#BA9E50]" />
              <button type="button" aria-label="Aumentar 0,5 kg" onClick={() => setSimKg(Math.min(4, simKg + 0.5))} className="w-12 h-12 border border-white/25 text-white text-2xl">+</button>
            </div>
            <p className="text-white text-4xl font-bold text-center mt-3" style={h}>{kg(simKg)} kg</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              <div className="p-4 border-2" style={{ borderColor: OURO, background: "rgba(186,158,80,.08)" }}>
                <p className="text-xs uppercase tracking-[0.15em] font-semibold" style={{ color: OURO }}>Superávit energético</p>
                <p className="text-white text-3xl font-bold mt-1 tabular-nums" style={h}>≈ {kc(simKg * KCAL_POR_KG)} kcal</p>
                <p className="text-gray-300 text-sm mt-1">a mais do que o corpo gastou, para que esses {kg(simKg)} kg fossem inteiramente gordura.</p>
              </div>
              <div className="p-4 border-2" style={{ borderColor: AZUL, background: "rgba(90,169,230,.08)" }}>
                <p className="text-xs uppercase tracking-[0.15em] font-semibold" style={{ color: AZUL }}>Consumo total, em um único dia</p>
                <p className="text-white text-3xl font-bold mt-1 tabular-nums" style={h}>≈ {formataFaixa(sim.consumoPorDia)} kcal</p>
                <p className="text-gray-300 text-sm mt-1">seu gasto estimado (≈ {formataFaixa(gasto.tdee)}) + o superávit.</p>
              </div>
            </div>
            <p className="text-white text-center mt-4 font-semibold">Superávit ≠ consumo. São números diferentes.</p>
            <p className="text-gray-500 text-xs text-center mt-1">Simulação matemática simplificada. Não é uma previsão exata de ganho de gordura.</p>
          </div>

          <div className={card}>
            <H2>No seu caso: +{kg(subiu)} kg em {PERIODOS.find((x) => x.id === periodo)!.rotulo.toLowerCase()}</H2>
            <p className="text-gray-300 mt-3">Para que fosse tudo gordura: ≈ <strong className="text-white">{kc(persp.superavit)} kcal de superávit</strong>{dias > 1 ? <> — cerca de <strong className="text-white">{kc(persp.superavitPorDia)} kcal a mais por dia</strong></> : null}.</p>
            <p className="text-gray-300 mt-2">Com o seu gasto, isso seria um consumo teórico próximo de <strong style={{ color: AZUL }}>≈ {formataFaixa(persp.consumoPorDia)} kcal {dias > 1 ? "por dia, durante todo o período" : "naquele dia"}</strong>.</p>
            <p className="text-white mt-4">Uma elevação rápida e grande na balança dificilmente deve ser interpretada automaticamente como a mesma quantidade de gordura. Isso não quer dizer que nada mudou — quer dizer que a balança mistura várias coisas.</p>
          </div>

          {temBeliscos && eq && (
            <div className="border-2 p-5" style={{ borderColor: OURO }}>
              <H2>Percebe a diferença?</H2>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div><p className="text-xs text-gray-400 uppercase">A balança mostrou</p><p className="text-white text-2xl font-bold" style={h}>+{kg(subiu)} kg</p></div>
                <div><p className="text-xs text-gray-400 uppercase">Seus beliscos</p><p className="text-white text-2xl font-bold" style={h}>≈ {kc(kcalBeliscos!)}</p><p className="text-xs text-gray-400">kcal/dia</p></div>
                <div><p className="text-xs text-gray-400 uppercase">Equivalente teórico</p><p className="text-2xl font-bold" style={{ ...h, color: OURO }}>{eq.kg.max === 0 ? "≈ 0" : eq.kg.min === eq.kg.max ? `≈ ${kg(eq.kg.max)}` : `${kg(eq.kg.min)}–${kg(eq.kg.max)}`}</p><p className="text-xs text-gray-400">kg no período</p></div>
              </div>
              <p className="text-gray-300 text-sm mt-4">{alem === "substituiram"
                ? "Você disse que os beliscos substituíram outras comidas. Nesse caso, eles não seriam calorias a mais — e o equivalente teórico fica perto de zero."
                : `Se as calorias dos beliscos ${dias > 1 ? `desses ${PERIODOS.find((x) => x.id === periodo)!.rotulo.toLowerCase()}` : "do dia"} fossem ${alem === "sim" ? "inteiramente" : "em parte ou inteiramente"} um excedente além do seu gasto — uma hipótese simplificada —, elas corresponderiam energeticamente a ${eq.kg.min === eq.kg.max ? `cerca de ${kg(eq.kg.max)} kg` : `algo entre ${kg(eq.kg.min)} e ${kg(eq.kg.max)} kg`}. Na vida real, a resposta do corpo é mais complexa.`}</p>
              <p className="text-white mt-3" style={h}>O peso da balança e a gordura corporal não são a mesma coisa.</p>
            </div>
          )}

          <div>
            <H2>O que mais pode mexer na balança?</H2>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {[...FATORES, ...(sexo !== "masculino" ? [FATOR_CICLO] : [])].map((f) => (
                <div key={f.nome} className={`border border-white/10 p-3 bg-white/[0.03] ${f.nome.startsWith("Glicogênio") ? "col-span-2" : ""}`}>
                  <p className="text-white font-semibold text-sm"><span aria-hidden>{f.emoji}</span> {f.nome}</p>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">{f.texto}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-2">Não dá para saber, só pela balança, quanto cada fator pesou no seu caso.</p>
          </div>

          <div className="border border-white/15 p-5 bg-gradient-to-br from-[#0c1520] to-black">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Você achou que</p>
            <p className="text-white text-2xl font-bold" style={h}>+{kg(subiu)} kg na balança = +{kg(subiu)} kg de gordura</p>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mt-4">Mas {kg(subiu)} kg de gordura representariam</p>
            <p className="text-3xl font-bold" style={{ ...h, color: OURO }}>≈ {kc(subiu * KCAL_POR_KG)} kcal de SUPERÁVIT</p>
            {temBeliscos && <p className="text-gray-300 mt-3">Seu Beliscômetro estimou: <strong className="text-white">≈ {kc(kcalBeliscos!)} kcal/dia</strong></p>}
            <p className="text-white text-xl italic mt-4" style={h}>A balança conta peso.<br />Não conta a história.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => compartilhar("story")} className={`${btn} flex-1`} style={{ background: OURO }}>COMPARTILHAR</button>
            <button type="button" onClick={() => compartilhar("quadrado")} className="min-h-[52px] px-4 border border-white/20 text-white text-sm">versão quadrada</button>
          </div>

          <div className={card}>
            <p className="text-white text-xl font-bold" style={h}>Um fim de semana diferente não precisa virar uma segunda-feira de punição.</p>
            <p className="text-gray-300 mt-2">Voltar à rotina normalmente costuma ser mais útil do que tentar compensar com restrições extremas.</p>
          </div>

          <div className="border border-white/15 p-6 relative">
            <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: OURO }} aria-hidden />
            <p className="text-white text-xl font-bold" style={h}>Quer emagrecer sem viver nessa briga com a balança?</p>
            <p className="text-gray-300 mt-2">Eu trabalho justamente para transformar números, treino e rotina em uma estratégia que você consiga manter.</p>
            <a href={getWhatsAppUrl("Oi, Montinho! Fiz o Beliscômetro e o “O que a balança não conta” e queria conversar sobre a minha rotina.")} target="_blank" rel="noopener noreferrer"
              data-wa-origem="ferramenta" data-cta-id="beliscometro:balanca" onClick={() => trackEvent("balanca_whatsapp_click", {})}
              className={`${btn} mt-5 inline-flex items-center justify-center`} style={{ background: OURO }}>QUERO CONVERSAR COM O MONTINHO</a>
          </div>
        </>
      )}
    </div>
  );
}
