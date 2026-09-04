/**
 * Links controlados: um destino curto por canal, cada um com UTM próprio.
 * É o que vai na bio, nos stories, no QR do condomínio — porque referrer de
 * app social não é confiável e o link controlado é.
 *
 *   /l/ig-bio   → /?utm_source=instagram&utm_medium=organic_social&utm_campaign=perfil&utm_content=bio
 */
export interface LinkControlado { destino: string; utm_source: string; utm_medium: string; utm_campaign: string; utm_content: string; tipo: "social" | "qr" | "other" }

export const LINKS: Record<string, LinkControlado> = {
  "ig-bio": { destino: "/", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "perfil", utm_content: "bio", tipo: "social" },
  "ig-stories": { destino: "/", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "stories", utm_content: "story", tipo: "social" },
  "ig-destaque": { destino: "/", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "perfil", utm_content: "destaque", tipo: "social" },
  "ig-consultoria": { destino: "/consultoria-online", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "consultoria", utm_content: "bio", tipo: "social" },
  "ig-presencial": { destino: "/personal-trainer-alphaville", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "presencial", utm_content: "bio", tipo: "social" },
  "fb": { destino: "/", utm_source: "facebook", utm_medium: "organic_social", utm_campaign: "perfil", utm_content: "pagina", tipo: "social" },
  "yt": { destino: "/", utm_source: "youtube", utm_medium: "organic_social", utm_campaign: "canal", utm_content: "descricao", tipo: "social" },
  "tiktok": { destino: "/", utm_source: "tiktok", utm_medium: "organic_social", utm_campaign: "perfil", utm_content: "bio", tipo: "social" },
  "qr-cartao": { destino: "/", utm_source: "qr", utm_medium: "offline", utm_campaign: "cartao", utm_content: "cartao_visita", tipo: "qr" },
  "qr-condominio": { destino: "/onde-atendo", utm_source: "qr", utm_medium: "offline", utm_campaign: "condominio", utm_content: "qr_condominio", tipo: "qr" },
  "qr-academia": { destino: "/academias-alphaville", utm_source: "qr", utm_medium: "offline", utm_campaign: "academia", utm_content: "qr_academia", tipo: "qr" },
  "ppp": { destino: "/personal-trainer-alphaville", utm_source: "personalporperto", utm_medium: "referral", utm_campaign: "diretorio", utm_content: "perfil", tipo: "other" },
};

export function urlDoLink(slug: string, extra: Record<string, string> = {}): string | null {
  const l = LINKS[slug];
  if (!l) return null;
  const u = new URLSearchParams({ utm_source: l.utm_source, utm_medium: l.utm_medium, utm_campaign: l.utm_campaign, utm_content: l.utm_content, ...extra });
  return `${l.destino}?${u.toString()}`;
}
