"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  CHAVE_AID, CHAVE_ATTR, CHAVE_REF, CHAVE_SID, CONSENT_KEY, anexarRefNaUrl, ehLinkWhatsApp, gerarRefCode, identificarCta,
  inferirServicoDaPagina, lerParametros, temEvidenciaDeOrigem, type ToqueNavegador,
} from "@/lib/crm/tracking";

function consentimento(): boolean | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" ? true : v === "declined" ? false : null;
  } catch { return null; }
}
function lerJson<T>(store: Storage, k: string): T | null { try { const v = store.getItem(k); return v ? (JSON.parse(v) as T) : null; } catch { return null; } }
function gravarJson(store: Storage, k: string, v: unknown) { try { store.setItem(k, JSON.stringify(v)); } catch { /* sem storage */ } }
function idAleatorio() { return gerarRefCode() + gerarRefCode(); }

interface Attr { first: ToqueNavegador | null; last: ToqueNavegador | null }

/**
 * Registra a chegada (toques) e intercepta cliques de WhatsApp.
 * Montado uma vez no layout raiz; não roda dentro do /crm.
 */
export default function HandoffTracker() {
  const pathname = usePathname();

  // Toques: a cada navegação com evidência de origem, atualiza o último toque.
  useEffect(() => {
    if (pathname.startsWith("/crm")) return;
    const persistente = consentimento() !== false; // recusou → só sessão
    const store = persistente ? localStorage : sessionStorage;
    const p = lerParametros(location.href);
    const referrer = document.referrer || null;
    if (p.ref) gravarJson(store, CHAVE_REF, p.ref.toUpperCase());
    if (!sessionStorage.getItem(CHAVE_SID)) sessionStorage.setItem(CHAVE_SID, idAleatorio());
    if (persistente && !localStorage.getItem(CHAVE_AID)) localStorage.setItem(CHAVE_AID, idAleatorio());
    const attr = lerJson<Attr>(store, CHAVE_ATTR) ?? { first: null, last: null };
    const novo = temEvidenciaDeOrigem(p, referrer);
    if (novo || !attr.first) {
      const toque: ToqueNavegador = {
        at: new Date().toISOString(), landing: location.pathname + location.search, referrer,
        utm_source: p.utm_source ?? null, utm_medium: p.utm_medium ?? null, utm_campaign: p.utm_campaign ?? null,
        utm_content: p.utm_content ?? null, utm_term: p.utm_term ?? null,
        gclid: p.gclid ?? null, gbraid: p.gbraid ?? null, wbraid: p.wbraid ?? null, fbclid: p.fbclid ?? null,
        ref: p.ref?.toUpperCase() ?? null,
      };
      if (!attr.first) attr.first = toque;
      if (novo) attr.last = toque;
      gravarJson(store, CHAVE_ATTR, attr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Clique no WhatsApp: registra o handoff e abre com o código.
  useEffect(() => {
    if (pathname.startsWith("/crm")) return;
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (!ehLinkWhatsApp(href) || a.dataset.crmRef) return;
      const code = gerarRefCode();
      const consent = consentimento();
      const store = consent !== false ? localStorage : sessionStorage;
      const attr = lerJson<Attr>(store, CHAVE_ATTR);
      const ultimo = attr?.last ?? attr?.first ?? null;
      const { ctaId, ferramenta } = identificarCta(a);
      const payload = {
        ref_code: code,
        page_url: location.href.slice(0, 500), page_path: location.pathname, page_title: document.title.slice(0, 200),
        cta_id: ctaId, ferramenta, servico_interesse: inferirServicoDaPagina(location.pathname),
        landing_page: attr?.first?.landing ?? null, referrer: ultimo?.referrer ?? document.referrer ?? null,
        utm_source: ultimo?.utm_source ?? null, utm_medium: ultimo?.utm_medium ?? null, utm_campaign: ultimo?.utm_campaign ?? null,
        utm_content: ultimo?.utm_content ?? null, utm_term: ultimo?.utm_term ?? null,
        gclid: ultimo?.gclid ?? null, gbraid: ultimo?.gbraid ?? null, wbraid: ultimo?.wbraid ?? null, fbclid: ultimo?.fbclid ?? null,
        referral_code: (() => { try { return JSON.parse(store.getItem(CHAVE_REF) ?? "null"); } catch { return null; } })(),
        first_touch: attr?.first ?? null,
        session_id: sessionStorage.getItem(CHAVE_SID), anonymous_id: consent !== false ? localStorage.getItem(CHAVE_AID) : null,
        device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
        consent,
      };
      const body = JSON.stringify(payload);
      let enviado = false;
      try { enviado = navigator.sendBeacon("/api/crm/handoff", new Blob([body], { type: "application/json" })); } catch { /* sem beacon */ }
      if (!enviado) fetch("/api/crm/handoff", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
      // Abre o WhatsApp com a referência, sem esperar o servidor.
      const url = anexarRefNaUrl(a.href, code);
      e.preventDefault();
      const win = window.open(url, "_blank", "noopener");
      if (!win) location.href = url;
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  return null;
}
