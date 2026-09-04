"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";

/**
 * CTA de WhatsApp das landing pages de anúncio.
 *
 * TRACKING — três camadas, sem duplicar contagem:
 *  1. `click_whatsapp` e `generate_lead` já são disparados pelo listener
 *     global (components/analytics/AnalyticsTracker.tsx) em QUALQUER link
 *     wa.me do site. São eles que servem de conversão no Google Ads, e por
 *     isso NÃO são repetidos aqui — repetir contaria a mesma conversão duas
 *     vezes.
 *  2. `whatsapp_click` é o evento desta landing: mesmo clique, mas com o
 *     contexto que o global não tem — de qual bloco a pessoa saiu
 *     (`cta_location`) e de que tipo de página (`page_type`). É o que
 *     responde "qual CTA converte" sem mexer na conversão do Ads.
 *  3. `data-cta-id` é lido pelo HandoffTracker do CRM, que registra o clique
 *     com gclid, UTMs e o código Ref que vai na mensagem.
 */
export default function LpCta({
  label, message, sub, posicao, lp, grande = true,
}: { label: string; message: string; sub?: string; posicao: string; lp: string; grande?: boolean }) {
  return (
    <div className="text-center">
      <a
        href={getWhatsAppUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        data-cta-id={`lp:${lp}:${posicao}`}
        onClick={() => trackEvent("whatsapp_click", { cta_location: posicao, page_type: `lp_${lp.replace(/-/g, "_")}`, lead_channel: "whatsapp" })}
        className={`inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] font-bold text-black shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_40px_rgba(37,211,102,0.55)] sm:w-auto ${grande ? "px-7 py-5 text-lg sm:px-12 sm:text-xl" : "px-6 py-3.5 text-base"}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        {label}
      </a>
      {sub && <p className="mt-3 text-sm text-gray-300">{sub}</p>}
    </div>
  );
}

/**
 * Barra fixa no rodapé do celular: o botão nunca sai do alcance do polegar.
 *
 * `pb-[env(safe-area-inset-bottom)]` respeita a faixa de gestos do iPhone.
 *
 * E ela NÃO aparece enquanto o banner de cookies está na tela. Os dois
 * ocupam a mesma faixa do rodapé, e o banner (z-50) cobria o botão — no
 * primeiro acesso, que é exatamente quem vem de anúncio. Em vez de brigar
 * por z-index, a barra espera a decisão: o banner avisa pelo evento
 * `montinho:cookies`, o mesmo que a sticky bar do site já escuta. O CTA do
 * topo continua disponível o tempo todo.
 */
export function LpCtaFixa({ message, lp }: { message: string; lp: string }) {
  const [liberada, setLiberada] = useState(false);
  useEffect(() => {
    const decidido = () => { try { return !!localStorage.getItem("cookie_consent"); } catch { return true; } };
    if (decidido()) { setLiberada(true); return; }
    const aoDecidir = () => setLiberada(true);
    window.addEventListener("montinho:cookies", aoDecidir);
    return () => window.removeEventListener("montinho:cookies", aoDecidir);
  }, []);
  if (!liberada) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/92 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3 backdrop-blur sm:hidden">
      <LpCta label="Consultar horários no WhatsApp" message={message} posicao="sticky" lp={lp} grande={false} />
    </div>
  );
}
