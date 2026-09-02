"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import {
  EVENTOS_DE_RESULTADO,
  LIMIARES,
  localDoPathname,
  regraPorRota,
  resolve,
  type Regra,
} from "@/lib/sticky/regras";

/**
 * A sticky bar contextual.
 *
 * Este componente não decide nada sobre conteúdo — isso é lib/sticky/regras.
 * Ele decide QUANDO mostrar, quando NÃO mostrar, e lembra o que a pessoa já
 * fez. Três responsabilidades, todas sobre comportamento:
 *
 * 1. DESCOBRIR A REGRA. Primeiro a meta tag que a página declarou no build
 *    (artigos), depois a rota (ferramentas, locais, institucionais).
 * 2. ESPERAR O SINAL. 25% de rolagem ou 15 s; páginas comerciais, antes;
 *    ferramentas, só depois do resultado. Aparecer no carregamento seria a
 *    barra pedindo atenção antes de a pessoa ter lido uma linha.
 * 3. SUMIR QUANDO ATRAPALHA. Banner de cookies na tela, modal aberto, pessoa
 *    digitando, já fechou nesta sessão, já clicou nesta ação nesta sessão.
 *
 * PERFORMANCE
 *
 * Elemento fixo não desloca layout, então não há CLS. Nenhuma biblioteca,
 * nenhuma requisição, nenhum listener de scroll depois que a barra aparece.
 * A animação é uma transição de transform, desligada para quem pediu menos
 * movimento.
 */

const CH = {
  fechada: "montinho:sticky:fechada",
  convertida: "montinho:sticky:convertida:",
  variante: "montinho:sticky:variante",
  visitas: "montinho:sticky:visitas",
  origem: "montinho:sticky:origem",
} as const;

const ss = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v); } catch { /* sem storage */ } },
};
const ls = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* sem storage */ } },
};

/**
 * Dias distintos em que a pessoa já esteve no site, ANTES de hoje.
 * Só a contagem sai daqui; as datas ficam no aparelho e nunca viajam.
 */
function contaVisitas(): number {
  const hoje = new Date().toISOString().slice(0, 10);
  let dias: string[] = [];
  try { dias = JSON.parse(ls.get(CH.visitas) ?? "[]"); } catch { dias = []; }
  const anteriores = dias.filter((d) => d !== hoje).length;
  if (!dias.includes(hoje)) ls.set(CH.visitas, JSON.stringify([...dias, hoje].slice(-30)));
  return anteriores;
}

/** a/b estável por visitante. Uma variável por vez: só o texto muda. */
function variante(): "a" | "b" {
  const v = ls.get(CH.variante);
  if (v === "a" || v === "b") return v;
  const nova = Math.random() < 0.5 ? "a" : "b";
  ls.set(CH.variante, nova);
  return nova;
}

/**
 * De onde a pessoa veio, em categorias. Calculado na primeira página da
 * sessão — depois disso o referrer é o próprio site e não diz mais nada.
 * Nunca guarda a URL de origem, só o rótulo.
 */
function origem(): string {
  const salva = ss.get(CH.origem);
  if (salva) return salva;
  const q = new URLSearchParams(window.location.search);
  const src = (q.get("utm_source") ?? "").toLowerCase();
  const med = (q.get("utm_medium") ?? "").toLowerCase();
  let rotulo = "direct";
  if (q.has("gclid") || /cpc|ppc|paid|ads/.test(med)) rotulo = "google_ads";
  else if (/instagram|ig\b/.test(src)) rotulo = "instagram";
  else if (src) rotulo = "other";
  else {
    let host = "";
    try { host = new URL(document.referrer).hostname; } catch { host = ""; }
    if (/google\./.test(host)) rotulo = "google_organic";
    else if (/instagram\.com|l\.instagram/.test(host)) rotulo = "instagram";
    else if (host && !host.endsWith("montinhopersonal.com.br")) rotulo = "referral";
  }
  ss.set(CH.origem, rotulo);
  return rotulo;
}

function meta(nome: string): string | null {
  return document.querySelector<HTMLMetaElement>(`meta[name="${nome}"]`)?.content ?? null;
}

/** Título do H1 se houver — mais limpo que document.title para citar na mensagem. */
function tituloDaPagina(): string {
  const h1 = document.querySelector("h1")?.textContent?.trim();
  return h1 && h1.length <= 120 ? h1 : document.title.replace(/\s*\|.*$/, "");
}

const bannerDeCookiesNaTela = () => !ls.get("cookie_consent");
const modalAberto = () =>
  !!document.querySelector('[role="dialog"]:not([aria-label="Aviso de cookies"])');
const digitando = () => {
  const el = document.activeElement;
  return !!el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || (el as HTMLElement).isContentEditable);
};

/**
 * A rota é a `key`: cada navegação monta uma barra nova, zerada. É o que
 * evita resetar estado dentro do efeito — e é também o que faz a barra de
 * um artigo não vazar para o próximo em navegação de cliente.
 */
export default function StickyBar() {
  const pathname = usePathname();
  return <Barra key={pathname} pathname={pathname} />;
}

interface Exibida {
  regra: Regra;
  texto: string;
  variacao: "a" | "b";
}

function Barra({ pathname }: { pathname: string }) {
  /* Só existe estado quando a barra decidiu aparecer — e isso acontece em callback, nunca no corpo do efeito. */
  const [exibida, setExibida] = useState<Exibida | null>(null);
  const [visivel, setVisivel] = useState(true);
  const [oculta, setOculta] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = meta("montinho-sticky") ?? regraPorRota(pathname);
    if (!id) return;
    if (ss.get(CH.fechada)) return;
    if (ss.get(CH.convertida + id)) return;

    const r = resolve(id, {
      titulo: tituloDaPagina(),
      local: meta("montinho-sticky-contexto") ?? localDoPathname(pathname) ?? undefined,
      visitas: contaVisitas(),
    });
    if (!r) return;
    /* A regra efetiva pode ter mudado com a recorrência — a conversão é por regra efetiva. */
    if (ss.get(CH.convertida + r.id)) return;

    const v = variante();

    let mostrada = false;
    const desfazer: (() => void)[] = [];

    const mostra = () => {
      if (mostrada) return;
      /* Supressão inteligente: se agora não dá, tenta de novo quando o motivo passar. */
      if (bannerDeCookiesNaTela()) {
        const depois = () => { window.removeEventListener("montinho:cookies", depois); mostra(); };
        window.addEventListener("montinho:cookies", depois);
        desfazer.push(() => window.removeEventListener("montinho:cookies", depois));
        return;
      }
      if (modalAberto()) { setTimeout(mostra, 2_000); return; }
      if (digitando()) {
        const depois = () => { document.removeEventListener("focusout", depois); setTimeout(mostra, 300); };
        document.addEventListener("focusout", depois);
        desfazer.push(() => document.removeEventListener("focusout", depois));
        return;
      }
      mostrada = true;
      setExibida({ regra: r, variacao: v, texto: v === "b" && r.textoB ? r.textoB : r.texto });
      trackEvent("sticky_view", {
        content_category: r.id,
        cta_variant: v,
        cta_destination: r.destino,
        traffic_source: origem(),
      });
    };

    if (r.gatilho === "resultado") {
      const ouve = (e: Event) => {
        const nome = (e as CustomEvent<{ event: string }>).detail?.event;
        if (nome && EVENTOS_DE_RESULTADO.has(nome)) {
          /* Dá um respiro depois do resultado: a pessoa quer ler o número primeiro. */
          setTimeout(mostra, 4_000);
        }
      };
      window.addEventListener("montinho:evento", ouve);
      desfazer.push(() => window.removeEventListener("montinho:evento", ouve));
    } else {
      const { scroll, ms } = LIMIARES[r.gatilho];
      const timer = setTimeout(mostra, ms);
      const aoRolar = () => {
        const alt = document.documentElement.scrollHeight - window.innerHeight;
        if (alt <= 0 || window.scrollY / alt >= scroll) {
          window.removeEventListener("scroll", aoRolar);
          mostra();
        }
      };
      window.addEventListener("scroll", aoRolar, { passive: true });
      desfazer.push(() => { clearTimeout(timer); window.removeEventListener("scroll", aoRolar); });
    }

    /* Some enquanto a pessoa digita em qualquer campo; volta quando sai. */
    const entrou = () => { if (digitando()) setOculta(true); };
    const saiu = () => setOculta(false);
    document.addEventListener("focusin", entrou);
    document.addEventListener("focusout", saiu);
    desfazer.push(() => { document.removeEventListener("focusin", entrou); document.removeEventListener("focusout", saiu); });

    return () => desfazer.forEach((f) => f());
  }, [pathname]);

  /*
   * O botão flutuante de WhatsApp fica no mesmo canto. Com a barra na tela,
   * ele sobe; se a barra JÁ é um WhatsApp, ele some — dois WhatsApps
   * empilhados com mensagens diferentes era exatamente o problema que a
   * página de consultoria já tinha resolvido à mão.
   */
  useEffect(() => {
    const b = document.body;
    const ativa = !!exibida && visivel && !oculta;
    b.classList.toggle("sticky-visivel", ativa);
    b.classList.toggle("sticky-whats", ativa && exibida?.regra.destino === "whatsapp");
    return () => { b.classList.remove("sticky-visivel", "sticky-whats"); };
  }, [exibida, visivel, oculta]);

  if (!exibida || !visivel || oculta) return null;
  const { regra, texto, variacao } = exibida;

  const params = {
    content_category: regra.id,
    cta_variant: variacao,
    cta_destination: regra.destino,
    traffic_source: origem(),
  };

  const clica = () => {
    trackEvent("sticky_click", params);
    ss.set(CH.convertida + regra.id, "1");
    setVisivel(false);
  };
  const fecha = () => {
    trackEvent("sticky_close", params);
    ss.set(CH.fechada, "1");
    setVisivel(false);
  };

  const whats = regra.destino === "whatsapp";
  const botaoCls =
    "shrink-0 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold min-h-[44px] rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BA9E50] " +
    (whats ? "bg-[#25D366] text-black hover:bg-[#1fbf5a]" : "bg-white text-black hover:bg-gray-100");

  return (
    <div
      ref={raiz}
      data-testid="sticky-bar"
      data-regra={regra.id}
      role="complementary"
      aria-label="Próximo passo sugerido"
      className="fixed inset-x-0 bottom-0 z-40 bg-[#0d0d0d]/95 backdrop-blur border-t border-white/10 motion-safe:animate-[sticky-sobe_240ms_ease-out]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-5xl mx-auto flex items-center gap-3 px-3 sm:px-6 py-2.5">
        <p className="flex-1 min-w-0 text-gray-100 text-[15px] sm:text-base leading-snug line-clamp-2">
          {texto}
        </p>
        {whats ? (
          <a href={regra.href} target="_blank" rel="noopener noreferrer" onClick={clica} className={botaoCls}>
            {regra.botao}
          </a>
        ) : (
          <Link href={regra.href} onClick={clica} className={botaoCls}>
            {regra.botao}
          </Link>
        )}
        <button
          type="button"
          onClick={fecha}
          aria-label="Fechar sugestão"
          className="shrink-0 -mr-1 w-11 h-11 inline-flex items-center justify-center text-gray-400 hover:text-white rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BA9E50]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
