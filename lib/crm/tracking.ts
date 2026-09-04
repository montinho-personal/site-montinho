/**
 * Rastreamento first-party do site (lado do navegador e helpers puros).
 *
 * O QUE ISTO FAZ
 *  - Lê utm_*, gclid/gbraid/wbraid/fbclid e referrer na chegada e guarda o
 *    PRIMEIRO toque e o ÚLTIMO toque no navegador (localStorage), mais um id
 *    de sessão (sessionStorage) e um id anônimo estável.
 *  - No clique em qualquer link de WhatsApp, gera um código curto, registra o
 *    handoff no servidor (página, CTA, origem, UTMs, click ids) e só então
 *    abre o WhatsApp com "Ref: CÓDIGO" no fim da mensagem.
 *
 * O QUE ISTO NÃO FAZ
 *  - Não guarda nome, telefone, e-mail nem qualquer dado do corpo. O site não
 *    sabe quem é a pessoa; sabe de onde ela veio.
 *  - Não finge atribuição: se a pessoa apagar o código da mensagem, o CRM
 *    não liga o lead ao handoff sozinho — quem liga é uma pessoa, e a
 *    confiança fica registrada.
 *  - Sem consentimento (banner recusado), nada persiste além da sessão.
 */

export const CHAVE_ATTR = "mp_attr";
export const CHAVE_AID = "mp_aid";
export const CHAVE_SID = "mp_sid";
export const CHAVE_REF = "mp_ref";
export const CONSENT_KEY = "cookie_consent";

export interface ToqueNavegador {
  at: string;
  landing: string;
  referrer: string | null;
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_content: string | null; utm_term: string | null;
  gclid: string | null; gbraid: string | null; wbraid: string | null; fbclid: string | null;
  ref: string | null; // código de indicação
}

const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid", "fbclid", "ref"] as const;

/** Extrai os parâmetros rastreáveis de uma URL. Puro, testável. */
export function lerParametros(url: string): Partial<Record<(typeof PARAMS)[number], string>> {
  let u: URL;
  try { u = new URL(url, "https://www.montinhopersonal.com.br"); } catch { return {}; }
  const out: Partial<Record<(typeof PARAMS)[number], string>> = {};
  for (const p of PARAMS) {
    const v = u.searchParams.get(p);
    if (v && v.length <= 200) out[p] = v;
  }
  return out;
}

export function temEvidenciaDeOrigem(p: Partial<Record<string, string>>, referrer: string | null, host = "www.montinhopersonal.com.br"): boolean {
  if (Object.values(p).some(Boolean)) return true;
  if (!referrer) return false;
  try { return new URL(referrer).hostname !== host; } catch { return false; }
}

/** Código curto legível: 5 caracteres do alfabeto sem confundíveis (0/O, 1/I/L). */
const ALFABETO = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
export function gerarRefCode(aleatorio: () => number = Math.random): string {
  let s = "";
  for (let i = 0; i < 5; i++) s += ALFABETO[Math.floor(aleatorio() * ALFABETO.length)];
  return s;
}

/** Acrescenta a referência ao texto pré-preenchido de um link de WhatsApp. */
export function anexarRefNaUrl(href: string, code: string): string {
  try {
    const u = new URL(href);
    const texto = u.searchParams.get("text") ?? "";
    if (/\bRef: [A-Z0-9]{4,6}\b/.test(texto)) return href;
    u.searchParams.set("text", `${texto.trim()}${texto.trim() ? " " : ""}Ref: ${code}`);
    return u.toString();
  } catch {
    return href;
  }
}

export const ehLinkWhatsApp = (href: string) => /wa\.me|api\.whatsapp\.com|whatsapp:\/\//.test(href);

/** Identifica o CTA clicado da forma menos invasiva possível. */
export function identificarCta(el: Element | null): { ctaId: string | null; ferramenta: string | null } {
  if (!el) return { ctaId: null, ferramenta: null };
  const comId = el.closest("[data-cta-id]") as HTMLElement | null;
  const ferr = el.closest("[data-tool-name]") as HTMLElement | null;
  const secao = el.closest("[data-track-section]") as HTMLElement | null;
  const aria = (el as HTMLElement).getAttribute?.("aria-label");
  const texto = (el.textContent ?? "").trim().slice(0, 60);
  return {
    ctaId: comId?.dataset.ctaId ?? (secao ? `section:${secao.dataset.trackSection}` : aria ? `aria:${aria}` : texto ? `text:${texto}` : null),
    ferramenta: ferr?.dataset.toolName ?? null,
  };
}

/** Serviço de interesse inferido só da PÁGINA, nunca da pessoa. */
export function inferirServicoDaPagina(path: string): "presencial" | "online" | null {
  if (/consultoria|online/.test(path)) return "online";
  if (/personal|academia|tambore|alphaville|barueri|parnaiba|domicilio|condominio/.test(path)) return "presencial";
  return null;
}
