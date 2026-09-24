"use client";

/**
 * As peças visuais do Simulador do Fim de Semana — a assinatura dele.
 *
 * Nada aqui usa verde = bom / vermelho = ruim. Déficit, equilíbrio e
 * superávit aparecem com símbolo (▼ ≈ ▲), texto e direção da barra; a cor
 * é só dourado (o que a semana construiu) e cinza (o que o fim de semana
 * mudou). Cada gráfico tem a tabela equivalente para leitor de tela.
 */

import { useId } from "react";
import { DIAS, ITENS, ROTULO_DIA, arred, fmtFaixaKcal, fmtKcal, item, kcalEvento, type DiaFds, type Evento, type Grupo, type Semana } from "@/lib/simulador/fim-de-semana";
import { DOURADO, h } from "./ui";

const n = (v: number) => {
  const a = arred(v);
  return `${a > 0 ? "+" : a < 0 ? "−" : ""}${Math.abs(a).toLocaleString("pt-BR")}`;
};

/** Os sete dias, com o saldo de cada um a partir da linha da manutenção. */
export function WeeklyBalanceTimeline({ s, titulo = "Sua semana, dia a dia" }: { s: Semana; titulo?: string }) {
  const max = Math.max(200, ...DIAS.map((d) => Math.abs(s.dias[d].mid)));
  const H = 72; // px de cada lado da linha
  return (
    <figure className="m-0" data-testid="timeline">
      <figcaption className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: DOURADO }}>{titulo}</figcaption>
      <div className="grid grid-cols-7 gap-1 sm:gap-2" aria-hidden="true">
        {DIAS.map((d) => {
          const v = s.dias[d].mid;
          const alt = Math.max(2, (Math.abs(v) / max) * H);
          const fds = d === "sab" || d === "dom" || (d === "sex" && s.dias.sex.mid > s.dias.qui.mid + 20);
          return (
            <div key={d} className="flex flex-col items-center min-w-0">
              <span className={`text-[10px] sm:text-xs tabular-nums mb-1 ${v > 0 ? "text-white" : "text-transparent"}`}>{v > 0 ? n(v) : "·"}</span>
              <div className="w-full flex flex-col" style={{ height: H * 2 }}>
                <div className="flex-1 flex items-end justify-center border-b border-white/40">
                  {v > 0 && <div className="w-3/4 max-w-[28px]" style={{ height: alt, background: "repeating-linear-gradient(135deg,#9ca3af 0 4px,#6b7280 4px 8px)" }} />}
                </div>
                <div className="flex-1 flex items-start justify-center">
                  {v <= 0 && <div className="w-3/4 max-w-[28px]" style={{ height: alt, background: fds ? "#6b7280" : DOURADO }} />}
                </div>
              </div>
              <span className={`text-[10px] sm:text-xs tabular-nums mt-1 ${v <= 0 ? "text-gray-300" : "text-transparent"}`}>{v <= 0 ? n(v) : "·"}</span>
              <span className={`text-[10px] sm:text-xs font-semibold mt-1 ${fds ? "text-white" : "text-gray-400"}`}>{ROTULO_DIA[d]}</span>
            </div>
          );
        })}
      </div>
      <p className="text-gray-500 text-xs mt-3">Linha = manutenção. Abaixo dela, o dia gastou mais do que comeu (déficit ▼); acima, comeu mais do que gastou (▲). Valores centrais, em kcal, arredondados a 50.</p>
      <div className="sr-only"><table>
        <caption>Saldo estimado de cada dia da semana, em kcal</caption>
        <thead><tr><th scope="col">Dia</th><th scope="col">Saldo</th></tr></thead>
        <tbody>{DIAS.map((d) => <tr key={d}><th scope="row">{ROTULO_DIA[d]}</th><td>{fmtKcal(s.dias[d].mid)}</td></tr>)}<tr><th scope="row">Saldo da semana</th><td>{fmtFaixaKcal(s.saldo)}</td></tr></tbody>
      </table></div>
    </figure>
  );
}

/** Construído / consumido / sobrou — o "uau" em três barras. */
export function WeeklyBalanceBar({ s, compacto = false }: { s: Semana; compacto?: boolean }) {
  const construido = -s.construido.mid;
  const consumido = s.consumido.mid;
  const saldo = s.saldo.mid;
  const escala = Math.max(1, Math.abs(construido), Math.abs(consumido), Math.abs(saldo));
  const pct = (v: number) => `${Math.max(1.5, (Math.abs(v) / escala) * 100)}%`;
  const linhas = [
    { rotulo: construido > 0 ? "Déficit construído de segunda a sexta" : "Segunda a sexta", valor: s.construido.mid, cor: DOURADO, mostra: Math.abs(construido) > 1 },
    { rotulo: Math.abs(consumido) < 50 ? "O fim de semana ficou perto do zero a zero" : consumido > 0 ? "Parte consumida pelo fim de semana" : "O fim de semana somou mais déficit", valor: consumido, cor: "repeating-linear-gradient(135deg,#9ca3af 0 4px,#6b7280 4px 8px)", mostra: true },
    { rotulo: saldo < 0 ? "Déficit que sobrou na semana" : "Saldo da semana", valor: saldo, cor: saldo < 0 ? DOURADO : "#e5e7eb", mostra: true },
  ];
  return (
    <div className={compacto ? "space-y-2" : "space-y-3"} data-testid="barra-semana">
      {linhas.filter((l) => l.mostra).map((l) => (
        <div key={l.rotulo}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-gray-300 min-w-0">{l.rotulo}</span>
            <span className="text-white font-semibold tabular-nums shrink-0">{fmtKcal(l.valor)}</span>
          </div>
          <div className="h-3 sm:h-4 bg-white/5 mt-1"><div className="h-full" style={{ width: pct(l.valor), background: l.cor }} /></div>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── O construtor do fim de semana ───────────────────────── */

const ROTULO_GRUPO: Record<Grupo, string> = { refeicao: "Refeições", extra: "Extras", bebida: "Bebidas" };
const ROTULO_DIAFDS: Record<DiaFds, string> = { sexta: "sexta à noite", sabado: "sábado", domingo: "domingo" };

/** Um evento: quantidade com − e +, a faixa estimada e a caloria editável. */
export function MealEventCard({ e, onChange, onRemove }: { e: Evento; onChange: (e: Evento) => void; onRemove: () => void }) {
  const it = item(e.itemId);
  const id = useId();
  const k = kcalEvento(e);
  const btn = "w-11 h-11 border border-white/25 text-white text-lg hover:border-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#BA9E50]";
  return (
    <div className="border border-white/15 p-3 sm:p-4" data-testid="evento">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-white font-semibold">{it.rotulo}</p>
          <p className="text-gray-400 text-xs">{it.unidade}{it.nota ? ` · ${it.nota}` : ""}</p>
        </div>
        <button type="button" onClick={onRemove} className="text-gray-400 text-sm underline underline-offset-4 min-h-[44px] shrink-0" aria-label={`Remover ${it.rotulo}`}>Remover</button>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <div className="flex items-center gap-2" role="group" aria-label={`Quantidade de ${it.rotulo}`}>
          <button type="button" className={btn} onClick={() => onChange({ ...e, qtd: Math.max(0, e.qtd - 1) })} aria-label="Menos um">−</button>
          <span className="text-white tabular-nums w-8 text-center" aria-live="polite">{e.qtd}</span>
          <button type="button" className={btn} onClick={() => onChange({ ...e, qtd: Math.min(30, e.qtd + 1) })} aria-label="Mais um">+</button>
        </div>
        <span className="text-gray-300 text-sm tabular-nums">{k.min === k.max ? `${Math.round(k.min).toLocaleString("pt-BR")} kcal` : `≈ ${Math.round(k.min).toLocaleString("pt-BR")}–${Math.round(k.max).toLocaleString("pt-BR")} kcal`} <span className="text-gray-500">· {e.kcalManual === null ? "estimativa" : "informado"}</span></span>
      </div>
      <details className="mt-2">
        <summary className="text-gray-400 text-xs cursor-pointer min-h-[32px] flex items-center">Sei as calorias de cada {it.unidade}</summary>
        <label htmlFor={id} className="sr-only">Calorias por {it.unidade}</label>
        <input id={id} inputMode="numeric" className="mt-1 w-32 bg-black border border-white/25 px-3 py-2 text-white" placeholder={String(it.kcal[0])} value={e.kcalManual ?? ""} onChange={(ev) => { const v = parseInt(ev.target.value.replace(/\D/g, ""), 10); onChange({ ...e, kcalManual: Number.isFinite(v) ? Math.min(5000, v) : null }); }} />
      </details>
    </div>
  );
}

let uidSeq = 0;
export const novoUid = () => `ev${Date.now().toString(36)}${(uidSeq++).toString(36)}`;

/** Adiciona eventos a um dia. `grupos` filtra (o módulo de bebidas usa só "bebida"). */
export function WeekendBuilder({ dia, eventos, onChange, grupos = ["refeicao", "extra", "bebida"], onAdd }: {
  dia: DiaFds; eventos: Evento[]; onChange: (lista: Evento[]) => void; grupos?: Grupo[]; onAdd?: (g: Grupo) => void;
}) {
  const doDia = eventos.filter((e) => e.dia === dia && grupos.includes(item(e.itemId).grupo));
  const add = (itemId: string) => {
    const ja = eventos.find((e) => e.dia === dia && e.itemId === itemId);
    if (ja) onChange(eventos.map((e) => (e === ja ? { ...e, qtd: e.qtd + 1 } : e)));
    else onChange([...eventos, { uid: novoUid(), dia, itemId, qtd: 1, kcalManual: null }]);
    onAdd?.(item(itemId).grupo);
  };
  return (
    <div data-testid={`construtor-${dia}`}>
      {grupos.map((g) => (
        <div key={g} className="mb-3">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1.5">{ROTULO_GRUPO[g]}</p>
          <div className="flex flex-wrap gap-2">
            {ITENS.filter((i) => i.grupo === g).map((i) => (
              <button key={i.id} type="button" onClick={() => add(i.id)} className="border border-white/20 text-gray-200 px-3 py-2 min-h-[44px] text-sm hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#BA9E50]">+ {i.rotulo}</button>
            ))}
          </div>
        </div>
      ))}
      {doDia.length > 0 && (
        <div className="space-y-2 mt-4">
          <p className="text-white text-sm font-semibold">No seu {ROTULO_DIAFDS[dia]}:</p>
          {doDia.map((e) => <MealEventCard key={e.uid} e={e} onChange={(nv) => onChange(eventos.map((x) => (x.uid === e.uid ? nv : x)))} onRemove={() => onChange(eventos.filter((x) => x.uid !== e.uid))} />)}
          <p className="text-gray-500 text-xs">Refeições entram como a diferença para uma refeição comum; extras e bebidas somam inteiros. Faixas, não números exatos: porções variam muito.</p>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Comparações ───────────────────────── */

export function Comparacao({ tituloA, tituloB, a, b, rotuloA, rotuloB }: { tituloA: string; tituloB: string; a: Semana; b: Semana; rotuloA: string; rotuloB: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[{ t: tituloA, s: a, r: rotuloA }, { t: tituloB, s: b, r: rotuloB }].map((x) => (
        <div key={x.t} className="border border-white/15 p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{x.t}</p>
          <p className="text-white text-sm mb-3">{x.r}</p>
          <WeeklyBalanceBar s={x.s} compacto />
        </div>
      ))}
    </div>
  );
}

function ColRecomecar({ titulo, passos, v, max }: { titulo: string; passos: string[]; v: number; max: number }) {
  return (
    <div className="border border-white/15 p-4">
      <p className="text-white font-semibold mb-2" style={h}>{titulo}</p>
      <ol className="text-gray-300 text-sm space-y-1 mb-3">{passos.map((p, i) => <li key={p}><span aria-hidden="true" className="text-gray-500">{i ? "↓ " : ""}</span>{p}</li>)}</ol>
      <div className="h-3 bg-white/5"><div className="h-full" style={{ width: `${(v / max) * 100}%`, background: "repeating-linear-gradient(135deg,#9ca3af 0 4px,#6b7280 4px 8px)" }} /></div>
      <p className="text-white text-sm tabular-nums mt-1">≈ {fmtKcal(v)} na semana</p>
    </div>
  );
}

/** "Já que eu saí…" × "volto na próxima refeição". */
export function RestartFastComparison({ a, b, diasDeDeficit }: { a: number; b: number; diasDeDeficit: number | null }) {
  const max = Math.max(a, b);
  const passoA = ["Almoço diferente", "Jantar diferente", "Domingo inteiro diferente", "Segunda recomeça"];
  const passoB = ["Almoço diferente", "Próxima refeição normal"];
  return (
    <div data-testid="recomecar">
      <div className="grid gap-3 sm:grid-cols-2">
        <ColRecomecar titulo="“Já estraguei mesmo”" passos={passoA} v={a} max={max} />
        <ColRecomecar titulo="Volta na próxima refeição" passos={passoB} v={b} max={max} />
      </div>
      <p className="text-gray-300 text-sm leading-relaxed mt-3">A refeição foi a mesma nos dois. A diferença — cerca de {fmtKcal(a - b).replace("+", "")} — veio da decisão de adiar a volta{diasDeDeficit !== null ? `, o equivalente a uns ${Math.round(diasDeDeficit)} dias do seu déficit de semana` : ""}. Saiu da rotina? O melhor momento para voltar não é segunda-feira. É a próxima oportunidade.</p>
    </div>
  );
}

/** Balança ≠ gordura: a massa na balança oscila rápido; tecido muda devagar. */
export function ScaleVsFatExplanation() {
  // Curvas ilustrativas, sem escala: a de cima oscila com um pico na segunda; a de baixo desce devagar.
  const W = 300, H = 90;
  const balanca = [30, 34, 40, 36, 33, 31, 29, 33, 42, 37, 32, 30, 27, 31, 39, 35, 30, 28, 26];
  const tecido = balanca.map((_, i) => 34 + i * -0.5);
  const pts = (arr: number[], off: number) => arr.map((y, i) => `${(i / (arr.length - 1)) * W},${y + off}`).join(" ");
  return (
    <figure className="m-0" data-testid="balanca-gordura">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Ilustração: o peso na balança sobe e desce com picos depois de cada fim de semana, enquanto a mudança de tecido segue uma linha lenta e contínua.">
        <polyline points={pts(balanca, -8)} fill="none" stroke="#e5e7eb" strokeWidth="2" />
        <polyline points={pts(tecido, 22)} fill="none" stroke={DOURADO} strokeWidth="2.5" strokeDasharray="6 4" />
        <text x="2" y="12" fill="#9ca3af" fontSize="9">peso na balança — oscila em horas e dias</text>
        <text x="2" y={H - 4} fill={DOURADO} fontSize="9">tecido (gordura e músculo) — muda em semanas</text>
      </svg>
      <figcaption className="text-gray-500 text-xs mt-1">Ilustração sem escala. O padrão de picos no domingo e na segunda foi medido em pessoas que se pesavam todo dia (Orsama, 2014).</figcaption>
    </figure>
  );
}
