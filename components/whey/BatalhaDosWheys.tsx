"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { parseNumero } from "@/lib/whey";
import {
  PERIODOS,
  analisa,
  concentracaoBaixa,
  destaques,
  entraNoRanking,
  ofertaValida,
  precoEquilibrioCentavos,
  problemasRotulo,
  reais,
  rotina,
  statusPreco,
  valePagarMais,
  type Oferta,
  type StatusPreco,
} from "@/lib/comparador-whey";
import { ROTULO_CONDICAO, type CondicaoPreco, type ProdutoCatalogo } from "@/lib/comparador-whey-catalogo";

/**
 * A Batalha dos Wheys.
 *
 * O CATÁLOGO É OPCIONAL
 *
 * Cada lado da comparação pode vir do catálogo (rótulo e preço conferidos,
 * com data) ou ser digitado pela pessoa, a partir do rótulo do pote dela.
 * Com o catálogo vazio a ferramenta funciona igual — só no modo manual.
 *
 * PREÇO VELHO NÃO DISPUTA
 *
 * Preço do catálogo conferido há mais de 7 dias aparece como "último preço
 * conhecido", com a data, mas não entra na comparação. A pessoa pode
 * digitar o preço que está vendo agora, e aí ele entra como dado dela.
 *
 * SEM VENCEDOR GERAL
 *
 * Os destaques são independentes: mais econômico (custo do grama de
 * proteína) e maior concentração. Nada de nota combinada inventada.
 *
 * O LINK DA COMPARAÇÃO
 *
 * A URL guarda a escolha (?p=slug ou ?p=m~preço~pacote~porção~proteína),
 * a proteína por dia e o período. Quem abre o link vê a mesma conta, com o
 * preço do catálogo de hoje — não o de quando o link foi criado.
 */

const MAX_LADOS = 4;
const DOSES_ATALHO = [25, 30, 50] as const;

type Lado =
  | { fonte: "catalogo"; slug: string; condicao: CondicaoPreco | "" }
  | { fonte: "manual"; nome: string; preco: string; pacote: string; porcao: string; proteina: string };

const ladoVazio = (): Lado => ({ fonte: "catalogo", slug: "", condicao: "" });

interface Resolvido {
  idx: number;
  nome: string;
  detalhe: string;
  oferta: Oferta | null;
  origem: "catalogo" | "manual";
  status: StatusPreco | "manual";
  produto?: ProdutoCatalogo;
  precoInfo?: { condicao: CondicaoPreco; loja: string; url: string; verificadoEm: string; parcelamento: string | null };
  problema?: string;
}

const MSG_PROBLEMA: Record<string, string> = {
  pacote_invalido: "O peso do pote precisa ficar entre 100 g e 10 kg.",
  porcao_invalida: "A porção precisa ficar entre 5 e 200 g.",
  proteina_invalida: "Confira a proteína por porção.",
  proteina_maior_que_porcao: "A proteína não pode ser maior que a porção. Confira o rótulo.",
  concentracao_impossivel: "Essa proporção de proteína não bate com um whey. Confira o rótulo.",
  preco: "Digite o preço do pote (de R$ 1 a R$ 5.000).",
};

function centavos(texto: string): number | null {
  const n = parseNumero(texto.replace(/^R\$\s*/i, "").replace(/\.(?=\d{3}(\D|$))/g, ""));
  return n === null ? null : Math.round(n * 100);
}

const dataBR = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Sao_Paulo" });
const g1 = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const peso = (g: number) => (g >= 1000 ? `${g1(g / 1000)} kg` : `${g1(g)} g`);
/** "Growth Whey Concentrado · 1 kg": marca, linha sem repetição e peso. Sabor fica de fora (o rótulo de referência aparece abaixo). */
const nomeCurto = (p: ProdutoCatalogo) => {
  const linha = p.linha.replace(/^Whey Protein /, "Whey ");
  return `${p.marca.replace(/ Supplements$| Human Health$/, "")} ${linha} · ${peso(p.pacoteG)}`;
};

/* ───────────────────────── URL ───────────────────────── */

function codificar(lados: Lado[], gDia: number, dias: number): string {
  const q = new URLSearchParams();
  for (const l of lados) {
    if (l.fonte === "catalogo" && l.slug) q.append("p", l.condicao ? `${l.slug}~${l.condicao}` : l.slug);
    if (l.fonte === "manual") q.append("p", ["m", l.preco, l.pacote, l.porcao, l.proteina, l.nome.slice(0, 40)].map((x) => x.replace(/~/g, "")).join("~"));
  }
  q.set("g", String(gDia));
  q.set("d", String(dias));
  return q.toString();
}

function decodificar(busca: string, catalogo: ProdutoCatalogo[]): { lados: Lado[]; gDia: number; dias: number } | null {
  const q = new URLSearchParams(busca);
  const ps = q.getAll("p").slice(0, MAX_LADOS);
  if (!ps.length) return null;
  const lados: Lado[] = ps.map((p) => {
    const partes = p.split("~");
    if (partes[0] === "m") {
      const [, preco = "", pacote = "", porcao = "", proteina = "", nome = ""] = partes;
      return { fonte: "manual", nome, preco, pacote, porcao, proteina };
    }
    const [slug, cond = ""] = partes;
    if (!catalogo.some((c) => c.slug === slug)) return ladoVazio();
    return { fonte: "catalogo", slug, condicao: (cond in ROTULO_CONDICAO ? cond : "") as CondicaoPreco | "" };
  });
  while (lados.length < 2) lados.push(ladoVazio());
  const gDia = Math.min(300, Math.max(5, Number(q.get("g")) || 25));
  const d = Number(q.get("d"));
  return { lados, gDia, dias: (PERIODOS as readonly number[]).includes(d) ? d : 30 };
}

/* ───────────────────────── Componente ───────────────────────── */

export default function BatalhaDosWheys({ catalogo }: { catalogo: ProdutoCatalogo[] }) {
  const [lados, setLados] = useState<Lado[]>(() => (catalogo.length ? [ladoVazio(), ladoVazio()] : [manualVazio(), manualVazio()]));
  const [gDia, setGDia] = useState(25);
  const [dias, setDias] = useState<number>(30);
  const [copiado, setCopiado] = useState(false);
  const agora = useMemo(() => new Date(), []);
  const medido = useRef<string>("");

  useEffect(() => {
    trackOncePerSession("comparador_whey_visualizado", { catalogo: catalogo.length });
    const s = decodificar(window.location.search, catalogo);
    if (s) {
      setLados(s.lados);
      setGDia(s.gDia);
      setDias(s.dias);
    }
  }, [catalogo]);

  const resolvidos: Resolvido[] = lados.map((l, idx) => resolver(l, idx, catalogo, agora));
  const validos = resolvidos.filter((r) => r.oferta && ofertaValida(r.oferta) && (r.status === "manual" || entraNoRanking(r.status)));
  const comparando = validos.length >= 2;
  const ofertas = validos.map((r) => ({ ...(r.oferta as Oferta), id: String(r.idx) }));
  const dest = comparando ? destaques(ofertas) : null;
  const maisBarato = comparando ? [...ofertas].sort((a, b) => analisa(a).centavosPorGProteina - analisa(b).centavosPorGProteina)[0] : null;
  const link = comparando ? codificar(lados, gDia, dias) : "";

  useEffect(() => {
    if (!comparando || medido.current === link) return;
    medido.current = link;
    trackEvent("comparador_whey_comparacao_realizada", {
      produtos: validos.length,
      manuais: validos.filter((v) => v.origem === "manual").length,
      dias,
    });
  }, [comparando, link, validos, dias]);

  const atualizar = (idx: number, l: Lado) => setLados((ls) => ls.map((x, i) => (i === idx ? l : x)));

  const urlCompleta = () => `${window.location.origin}${window.location.pathname}?${link}`;
  const textoShare = () => {
    const linhas = validos.map((v) => `${v.nome}: ${reais(analisa(v.oferta as Oferta).centavosPor25g)} por 25 g de proteína`);
    return `Batalha dos Wheys\n${linhas.join("\n")}\n\nCompare você também:`;
  };
  async function compartilhar(meio: "whatsapp" | "copiar" | "nativo") {
    const url = urlCompleta();
    trackEvent("comparador_whey_compartilhado", { meio });
    if (meio === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${textoShare()} ${url}`)}`, "_blank", "noopener,noreferrer");
    } else if (meio === "nativo" && navigator.share) {
      try { await navigator.share({ title: "Batalha dos Wheys", text: textoShare(), url }); } catch { /* cancelado */ }
    } else {
      try { await navigator.clipboard.writeText(url); setCopiado(true); setTimeout(() => setCopiado(false), 2500); } catch { /* sem permissão */ }
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {lados.map((l, idx) => (
          <fieldset key={idx} className="border border-white/15 p-4 sm:p-5">
            <legend className="text-gray-300 text-sm px-1">Whey {idx + 1}</legend>
            {catalogo.length > 0 && (
              <div className="flex gap-2 mb-3" role="group" aria-label={`Origem do whey ${idx + 1}`}>
                <button type="button" onClick={() => atualizar(idx, ladoVazio())} aria-pressed={l.fonte === "catalogo"} className={aba(l.fonte === "catalogo")}>Escolher da lista</button>
                <button type="button" onClick={() => { atualizar(idx, manualVazio()); }} aria-pressed={l.fonte === "manual"} className={aba(l.fonte === "manual")}>Digitar o rótulo</button>
              </div>
            )}
            {l.fonte === "catalogo" ? (
              <SeletorCatalogo lado={l} catalogo={catalogo} onChange={(n) => { atualizar(idx, n); if (n.slug) trackEvent("comparador_whey_produto_selecionado", { produto: n.slug }); }} />
            ) : (
              <CamposManuais lado={l} idx={idx} onChange={(n) => atualizar(idx, n)} />
            )}
            <Situacao r={resolvidos[idx]} agora={agora} />
            {lados.length > 2 && (
              <button type="button" onClick={() => setLados((ls) => ls.filter((_, i) => i !== idx))} className="mt-3 text-gray-400 text-sm underline underline-offset-4 min-h-[44px]">
                Remover este whey
              </button>
            )}
          </fieldset>
        ))}
      </div>

      {lados.length < MAX_LADOS && (
        <button type="button" onClick={() => setLados((ls) => [...ls, catalogo.length ? ladoVazio() : manualVazio()])} className="text-white border border-white/25 px-4 min-h-[44px] text-sm hover:border-white/60">
          + Adicionar outro whey
        </button>
      )}

      <fieldset className="border border-white/15 p-4 sm:p-5">
        <legend className="text-gray-300 text-sm px-1">Sua rotina</legend>
        <p className="text-gray-300 text-sm mb-2">Quantos gramas de proteína por dia vêm do whey?</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {DOSES_ATALHO.map((d) => (
            <button key={d} type="button" onClick={() => setGDia(d)} aria-pressed={gDia === d} className={aba(gDia === d)}>{d} g</button>
          ))}
          <label className="flex items-center gap-2 text-gray-300 text-sm">
            outro:
            <input inputMode="numeric" value={gDia} onChange={(e) => { const n = parseNumero(e.target.value); if (n !== null && n >= 5 && n <= 300) setGDia(Math.round(n)); }} className={campo + " w-20"} aria-label="Gramas de proteína por dia vindas do whey" />
          </label>
        </div>
        <p className="text-gray-300 text-sm mb-2">Período</p>
        <div className="flex gap-2">
          {PERIODOS.map((p) => (
            <button key={p} type="button" onClick={() => setDias(p)} aria-pressed={dias === p} className={aba(dias === p)}>{p} dias</button>
          ))}
        </div>
        <p className="text-gray-400 text-xs mt-3">
          Não sabe quanto precisa? A <Link href="/ferramentas/calculadora-whey" className="underline underline-offset-4">Calculadora de Whey</Link> parte da sua meta de proteína e do que você já come.
        </p>
      </fieldset>

      <div aria-live="polite">
        {!comparando ? (
          <p className="text-gray-400 text-sm border border-dashed border-white/15 p-5">
            Escolha ou preencha pelo menos dois wheys com preço para ver a batalha.
          </p>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>Resultado da batalha</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {dest?.maisEconomico !== null && dest?.maisEconomico !== undefined && (
                <Destaque rotulo="Mais econômico" texto={nomeDe(validos, dest.maisEconomico)} detalhe="menor custo por grama de proteína" />
              )}
              {dest?.maisEconomico === null && <Destaque rotulo="Mais econômico" texto="Empate" detalhe="mesmo custo por grama de proteína" />}
              {dest?.maiorConcentracao && <Destaque rotulo="Maior concentração" texto={nomeDe(validos, dest.maiorConcentracao)} detalhe="mais proteína em cada grama de pó" />}
            </ul>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[560px]">
                <caption className="sr-only">Comparação dos wheys: preço, proteína, custo e rotina</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Whey</th>
                    <th scope="col" className={th}>Preço</th>
                    <th scope="col" className={th}>Proteína no pote</th>
                    <th scope="col" className={th}>Concentração</th>
                    <th scope="col" className={th}>Custo de 25 g de proteína</th>
                    <th scope="col" className={th}>{dias} dias com {gDia} g/dia</th>
                  </tr>
                </thead>
                <tbody>
                  {[...validos]
                    .sort((a, b) => analisa(a.oferta as Oferta).centavosPorGProteina - analisa(b.oferta as Oferta).centavosPorGProteina)
                    .map((v) => {
                      const o = v.oferta as Oferta;
                      const a = analisa(o);
                      const ro = rotina(o, gDia, dias);
                      const ehBarato = maisBarato && String(v.idx) === maisBarato.id;
                      const extra = maisBarato && !ehBarato ? valePagarMais(maisBarato, o, gDia, dias) : null;
                      return (
                        <tr key={v.idx} className="border-b border-white/10 align-top">
                          <th scope="row" className="text-left text-white py-3 pr-4 font-medium">
                            {v.nome}
                            {ehBarato && <span className="block text-xs font-semibold" style={{ color: "#BA9E50" }}>✓ mais econômico</span>}
                            {concentracaoBaixa(o) && <span className="block text-xs text-amber-300">Proteína baixa para um whey: pode ser blend ou hipercalórico.</span>}
                          </th>
                          <td className={td}>{reais(o.precoCentavos)}<span className="block text-xs text-gray-500">{v.detalhe}</span></td>
                          <td className={td}>{g1(a.proteinaTotalG)} g<span className="block text-xs text-gray-500">{g1(a.doses25g)} doses de 25 g</span></td>
                          <td className={td}>{g1(a.concentracaoPct)}%</td>
                          <td className={td + " text-white font-semibold"}>
                            {reais(a.centavosPor25g)}
                            <span className="block text-xs text-gray-500 font-normal">{reais(a.centavosPorGProteina * 1000)} por kg de proteína</span>
                          </td>
                          <td className={td}>
                            {reais(ro.custoProporcionalCentavos)}<span className="block text-xs text-gray-500">compra real: {ro.embalagens} {ro.embalagens === 1 ? "pote" : "potes"} = {reais(ro.desembolsoCentavos)}</span>
                            {extra && extra.extraCentavos > 0.5 && <span className="block text-xs text-gray-400">+{reais(extra.extraCentavos)} ({g1(extra.extraPct * 100)}% a mais) pela mesma proteína</span>}
                            {extra && maisBarato && <span className="block text-xs text-gray-400">empata com o mais econômico a {reais(precoEquilibrioCentavos(maisBarato, o))}</span>}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed">
              Estimativas a partir do rótulo declarado, que é arredondado por norma. Custo proporcional é o que você consome no período; a compra real
              conta potes inteiros. Frete não incluído (depende da região). Nenhum destaque diz qual whey é melhor para a sua saúde.
            </p>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => compartilhar("whatsapp")} className={botao}>Enviar no WhatsApp</button>
              <button type="button" onClick={() => compartilhar("copiar")} className={botao}>{copiado ? "Link copiado ✓" : "Copiar link da comparação"}</button>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button type="button" onClick={() => compartilhar("nativo")} className={botao}>Compartilhar</button>
              )}
            </div>

            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Agora que você sabe qual whey compensa mais, descubra quanto de proteína precisa por dia.</p>
              <Link href="/ferramentas/calculadora-de-proteina" onClick={() => trackEvent("comparador_whey_proteina_clicada", {})} className="text-gray-300 text-sm underline underline-offset-4 min-h-[44px] inline-flex items-center" style={{ textDecorationColor: "#BA9E50" }}>
                Calculadora de Proteína →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Peças ───────────────────────── */

function manualVazio(): Lado {
  return { fonte: "manual", nome: "", preco: "", pacote: "", porcao: "", proteina: "" };
}

function resolver(l: Lado, idx: number, catalogo: ProdutoCatalogo[], agora: Date): Resolvido {
  if (l.fonte === "manual") {
    const preco = centavos(l.preco);
    const pacoteG = parseNumero(l.pacote);
    const porcaoG = parseNumero(l.porcao);
    const proteinaPorcaoG = parseNumero(l.proteina);
    const nome = l.nome.trim() || `Whey ${idx + 1}`;
    const base = { idx, nome, detalhe: "preço digitado por você", origem: "manual" as const, status: "manual" as const };
    if (pacoteG === null || porcaoG === null || proteinaPorcaoG === null) return { ...base, oferta: null };
    const rot = { pacoteG, porcaoG, proteinaPorcaoG };
    const prob = problemasRotulo(rot)[0];
    if (prob) return { ...base, oferta: null, problema: MSG_PROBLEMA[prob] };
    if (preco === null) return { ...base, oferta: null };
    const oferta = { ...rot, precoCentavos: preco };
    if (!ofertaValida(oferta)) return { ...base, oferta: null, problema: MSG_PROBLEMA.preco };
    return { ...base, oferta };
  }
  const p = catalogo.find((c) => c.slug === l.slug);
  if (!p) return { idx, nome: `Whey ${idx + 1}`, detalhe: "", oferta: null, origem: "catalogo", status: "indisponivel" };
  const preco = escolherPreco(p);
  const nome = nomeCurto(p);
  if (!preco) return { idx, nome, detalhe: "sem preço cadastrado", oferta: null, origem: "catalogo", status: "indisponivel", produto: p };
  const st = statusPreco(new Date(preco.verificadoEm), agora);
  return {
    idx,
    nome,
    detalhe: `a partir de · ${preco.loja} · ${dataBR(preco.verificadoEm)}`,
    oferta: { pacoteG: p.pacoteG, porcaoG: p.porcaoG, proteinaPorcaoG: p.proteinaPorcaoG, precoCentavos: preco.precoCentavos },
    origem: "catalogo",
    status: preco.emEstoque === false ? "indisponivel" : st,
    produto: p,
    precoInfo: preco,
  };
}

/**
 * Um preço só por produto: o menor da conferência mais recente ("a partir
 * de"). Forma de pagamento e sabor não viram opção na tela; o valor exato
 * fica com a loja. A condição que vier no link antigo é ignorada.
 */
function escolherPreco(p: ProdutoCatalogo) {
  if (!p.precos.length) return null;
  const dia = (iso: string) => new Date(new Date(iso).getTime() - 3 * 3600e3).toISOString().slice(0, 10);
  const ultimo = p.precos.map((x) => dia(x.verificadoEm)).sort().at(-1)!;
  return p.precos.filter((x) => dia(x.verificadoEm) === ultimo).sort((a, b) => a.precoCentavos - b.precoCentavos)[0];
}

function SeletorCatalogo({ lado, catalogo, onChange }: { lado: Extract<Lado, { fonte: "catalogo" }>; catalogo: ProdutoCatalogo[]; onChange: (l: Extract<Lado, { fonte: "catalogo" }>) => void }) {
  const p = catalogo.find((c) => c.slug === lado.slug);
  return (
    <div className="space-y-3">
      <label className="block text-gray-300 text-sm">
        Produto
        <select value={lado.slug} onChange={(e) => onChange({ fonte: "catalogo", slug: e.target.value, condicao: "" })} className={campo + " w-full mt-1"}>
          <option value="">Escolha um whey</option>
          {catalogo.map((c) => <option key={c.slug} value={c.slug}>{nomeCurto(c)}</option>)}
        </select>
      </label>
      {p && (
        <p className="text-gray-400 text-xs leading-relaxed">
          {g1(p.proteinaPorcaoG)} g de proteína a cada {g1(p.porcaoG)} g · rótulo do sabor {p.sabor.toLowerCase()}, conferido em {dataBR(p.rotuloVerificadoEm + "T12:00:00Z")}
          {p.lactose === "contem" && " · contém lactose"}
        </p>
      )}
    </div>
  );
}

function CamposManuais({ lado, idx, onChange }: { lado: Extract<Lado, { fonte: "manual" }>; idx: number; onChange: (l: Lado) => void }) {
  const set = (k: keyof Omit<typeof lado, "fonte">) => (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...lado, [k]: e.target.value });
  const id = (k: string) => `whey-${idx}-${k}`;
  return (
    <div className="grid grid-cols-2 gap-3" onBlur={() => trackEvent("comparador_whey_manual_inserido", {})}>
      <label htmlFor={id("nome")} className="col-span-2 text-gray-300 text-sm">Nome (opcional)<input id={id("nome")} value={lado.nome} onChange={set("nome")} maxLength={40} className={campo + " w-full mt-1"} placeholder="Ex.: whey do mercado" /></label>
      <label htmlFor={id("preco")} className="text-gray-300 text-sm">Preço do pote (R$)<input id={id("preco")} inputMode="decimal" value={lado.preco} onChange={set("preco")} className={campo + " w-full mt-1"} placeholder="129,90" /></label>
      <label htmlFor={id("pacote")} className="text-gray-300 text-sm">Peso do pote (g)<input id={id("pacote")} inputMode="numeric" value={lado.pacote} onChange={set("pacote")} className={campo + " w-full mt-1"} placeholder="900" /></label>
      <label htmlFor={id("porcao")} className="text-gray-300 text-sm">Porção do rótulo (g)<input id={id("porcao")} inputMode="decimal" value={lado.porcao} onChange={set("porcao")} className={campo + " w-full mt-1"} placeholder="30" /></label>
      <label htmlFor={id("proteina")} className="text-gray-300 text-sm">Proteína na porção (g)<input id={id("proteina")} inputMode="decimal" value={lado.proteina} onChange={set("proteina")} className={campo + " w-full mt-1"} placeholder="21" /></label>
    </div>
  );
}

function Situacao({ r }: { r: Resolvido; agora: Date }) {
  if (r.problema) return <p role="alert" className="text-amber-300 text-xs mt-3">{r.problema}</p>;
  if (r.origem !== "catalogo" || !r.produto) return null;
  if (r.status === "indisponivel")
    return <p className="text-gray-400 text-xs mt-3">{r.precoInfo?.verificadoEm ? "Fora de estoque na última conferência." : "Sem preço conferido. Use “Digitar o rótulo” com o preço que você está vendo."}</p>;
  return (
    <div className="mt-3 text-xs leading-relaxed">
      {r.status === "verificado" ? (
        <p className="text-gray-300">✓ A partir de {reais(r.oferta!.precoCentavos)}, conferido em {dataBR(r.precoInfo!.verificadoEm)}. O valor exato muda conforme sabor e forma de pagamento: confira na loja.</p>
      ) : (
        <p className="text-amber-300">Último preço conhecido ({dataBR(r.precoInfo!.verificadoEm)}). Pode ter mudado e não entra na comparação — digite o preço atual para comparar.</p>
      )}
      {r.precoInfo && (
        <a href={r.precoInfo.url} target="_blank" rel="noopener noreferrer nofollow" onClick={() => trackEvent("comparador_whey_loja_clicada", { produto: r.produto!.slug })} className="text-gray-400 underline underline-offset-4 inline-flex items-center min-h-[44px]">
          Ver na loja oficial →
        </a>
      )}
    </div>
  );
}

function Destaque({ rotulo, texto, detalhe }: { rotulo: string; texto: string; detalhe: string }) {
  return (
    <li className="border border-white/15 p-4">
      <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-1" style={{ color: "#BA9E50" }}>{rotulo}</p>
      <p className="text-white font-semibold">{texto}</p>
      <p className="text-gray-400 text-xs">{detalhe}</p>
    </li>
  );
}

const nomeDe = (v: Resolvido[], id: string) => v.find((x) => String(x.idx) === id)?.nome ?? "";
const aba = (ativo: boolean) => `px-3 min-h-[44px] text-sm border ${ativo ? "border-white text-white" : "border-white/20 text-gray-400 hover:text-white"}`;
const campo = "bg-black border border-white/25 text-white px-3 min-h-[44px] focus:border-white outline-none";
const botao = "border border-white/25 text-white px-4 min-h-[44px] text-sm hover:border-white/60";
const th = "text-left text-gray-400 font-medium py-2.5 pr-4";
const td = "text-gray-300 py-3 pr-4 tabular-nums";
