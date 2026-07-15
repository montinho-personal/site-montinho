"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";

const WHATSAPP_PATTERNS = ["wa.me", "api.whatsapp.com", "whatsapp://"];

/**
 * Rastreador global de eventos para o dataLayer (GTM).
 * Montado uma única vez no layout raiz; listeners com cleanup completo.
 * Eventos por página (scroll_75, engaged_time) resetam a cada rota.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const firedRef = useRef<{ scroll75: boolean; engaged: boolean }>({
    scroll75: false,
    engaged: false,
  });

  // ── Cliques (delegação no document): WhatsApp, telefone e lead ──
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const buttonText = (anchor.textContent ?? "").trim().slice(0, 100);

      if (WHATSAPP_PATTERNS.some((p) => href.includes(p))) {
        trackEvent("click_whatsapp", { button_text: buttonText });
        // Clique no WhatsApp = lead gerado (canal principal de conversão)
        trackEvent("generate_lead", {
          lead_channel: "whatsapp",
          button_text: buttonText,
        });
      } else if (href.startsWith("tel:")) {
        trackEvent("click_phone", {
          phone_number: href.replace("tel:", ""),
          button_text: buttonText,
        });
        trackEvent("generate_lead", { lead_channel: "phone", button_text: buttonText });
      }
    }
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // ── Formulários (delegação no document) ──
  useEffect(() => {
    function onSubmit(e: Event) {
      const form = e.target as HTMLFormElement | null;
      if (!form || form.tagName !== "FORM") return;
      const formName =
        form.getAttribute("data-form-name") ||
        form.getAttribute("name") ||
        form.getAttribute("id") ||
        (form.closest("[data-form-name]")?.getAttribute("data-form-name") ?? "unnamed");
      trackEvent("submit_form", { form_name: formName });
    }
    document.addEventListener("submit", onSubmit, { capture: true });
    return () => document.removeEventListener("submit", onSubmit, { capture: true });
  }, []);

  // ── scroll_75 (1x por página) ──
  useEffect(() => {
    firedRef.current.scroll75 = false;
    function onScroll() {
      if (firedRef.current.scroll75) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= 0.75) {
        firedRef.current.scroll75 = true;
        trackEvent("scroll_75", { percent: 75 });
        window.removeEventListener("scroll", onScroll);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // ── engaged_time: 120s na página (1x por página, só com aba visível) ──
  useEffect(() => {
    firedRef.current.engaged = false;
    let elapsed = 0;
    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      elapsed += 5;
      if (elapsed >= 120 && !firedRef.current.engaged) {
        firedRef.current.engaged = true;
        trackEvent("engaged_time", { engaged_seconds: 120 });
        window.clearInterval(interval);
      }
    }, 5000);
    return () => window.clearInterval(interval);
  }, [pathname]);

  // ── view_pricing: IntersectionObserver em [data-track-section="pricing"] (1x por sessão) ──
  useEffect(() => {
    const target = document.querySelector('[data-track-section="pricing"]');
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          trackOncePerSession("view_pricing", { section: "pricing" });
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
