/**
 * O Perfil da Empresa no Google, visto pelo site.
 *
 * O perfil existe e é forte (5,0 com 23 avaliações em 11/09/2026), mas o
 * site não o citava em lugar nenhum: nenhum sameAs, nenhum hasMap, e o
 * profileUrl de data/testimonials.json vazio. O Google liga entidade a site
 * por esses sinais; sem eles, perfil e site ranqueiam separados.
 *
 * A URL mora em UM lugar — testimonials.json, o campo que já existia para
 * isso, com a regra "vazio = nenhum link, nunca uma URL inventada". Tudo
 * que depende dela passa por aqui e some sozinho enquanto ela estiver
 * vazia: nenhum schema aponta para um endereço que não existe.
 */
import testimonials from "@/data/testimonials.json";

export const INSTAGRAM_URL = "https://www.instagram.com/montinhopersonal/";

/** URL pública do perfil, ou null enquanto não estiver preenchida. */
export function urlDoPerfilGoogle(): string | null {
  const u = (testimonials as { profileUrl?: string }).profileUrl?.trim();
  return u && /^https?:\/\//.test(u) ? u : null;
}

/**
 * Fragmento para espalhar num LocalBusiness/Person do schema.org:
 * sameAs sempre traz o Instagram; o perfil do Google e o hasMap só entram
 * quando a URL existe.
 */
export function ligacoesDoPerfil(): { sameAs: string[]; hasMap?: string } {
  const perfil = urlDoPerfilGoogle();
  return perfil ? { sameAs: [INSTAGRAM_URL, perfil], hasMap: perfil } : { sameAs: [INSTAGRAM_URL] };
}
