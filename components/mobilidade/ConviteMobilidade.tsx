import Link from "next/link";
import {
  ARTIGOS_COM_TESTE_MOBILIDADE,
  HREF_TESTE_MOBILIDADE,
} from "@/lib/mobilidade/artigos";
import { MOBILIDADE_NO_AR } from "@/lib/mobilidade/lancamento";

/**
 * O convite ao teste de mobilidade dentro de um artigo.
 *
 * Componente de servidor, zero JavaScript — de propósito. A ferramenta em si é
 * pesada e interativa; o convite não precisa ser nada disso, e cobrar o custo
 * dela em dezenas de artigos estragaria o carregamento de páginas que existem
 * para serem lidas.
 *
 * Renderiza nada fora do registro, como o BlocoCaminho. A decisão de onde
 * aparecer é editorial e mora em lib/mobilidade/artigos.ts.
 */
export default function ConviteMobilidade({ slug }: { slug: string }) {
  /* Fora do ar, o convite levaria a um 404 — então ele nem existe. */
  if (!MOBILIDADE_NO_AR) return null;

  const convite = ARTIGOS_COM_TESTE_MOBILIDADE[slug];
  if (!convite) return null;

  return (
    <aside className="border border-[#BA9E50]/50 bg-[#BA9E50]/[0.06] p-6 my-10 print:hidden">
      <p
        className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
        style={{ color: "#BA9E50", fontFamily: "var(--font-inter), sans-serif" }}
      >
        Teste gratuito
      </p>
      <p
        className="text-white font-bold text-xl mb-2"
        style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
      >
        Destrave Seu Corpo
      </p>
      <p className="text-gray-300 leading-relaxed mb-4">{convite.texto}</p>
      <Link
        href={HREF_TESTE_MOBILIDADE}
        className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-sm font-semibold min-h-[48px] hover:opacity-90 transition-opacity"
      >
        {convite.rotulo}
        <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
