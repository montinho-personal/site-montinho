import LinkRastreado from "@/components/ferramentas/central/LinkRastreado";
import { TRILHAS, type TrilhaId } from "@/lib/ferramentas/trilha";

/**
 * Os dois caminhos guiados (dieta e treino) como vitrine.
 *
 * Um componente só, três lugares, três pesos:
 *   "home"     — seção inteira, para quem ainda não sabe o que quer e não
 *                está pronto para contratar: a isca gratuita antes do WhatsApp.
 *   "hub"      — no /ferramentas, logo depois da busca: compacto, porque ali
 *                muita gente já sabe qual ferramenta quer.
 *   "resultado"— uma faixa ao fim dos simuladores: "quer seguir um caminho?".
 *
 * Cada cartão leva DIRETO a /comece/dieta ou /comece/treino (antes, o botão
 * principal levava a /comece, uma página a mais). Os passos aparecem no
 * próprio cartão — são o argumento. Servidor, zero JS além do onClick.
 */

const INFO: Record<TrilhaId, { rotulo: string; promessa: string }> = {
  dieta: { rotulo: "Quero organizar minha alimentação", promessa: "Do quanto você gasta ao que vai no prato." },
  treino: { rotulo: "Quero organizar meu treino", promessa: "Do ponto de partida à carga certa na barra." },
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

function Cartao({ id, placement, compacto }: { id: TrilhaId; placement: string; compacto: boolean }) {
  const t = TRILHAS[id];
  return (
    <LinkRastreado
      href={`/comece/${id}`}
      evento="guided_path_click"
      params={{ path: id, placement }}
      className={`group block border border-[#BA9E50]/50 bg-[#BA9E50]/[0.06] hover:border-[#BA9E50] hover:bg-[#BA9E50]/[0.1] transition-colors ${compacto ? "p-4" : "p-5 sm:p-6"} ${foco}`}
    >
      <span className="block text-xs font-semibold tracking-[0.15em] uppercase text-[#BA9E50]">{t.titulo} · {t.passos.length} passos · grátis</span>
      <span className={`block text-white font-bold mt-1.5 ${compacto ? "text-lg" : "text-xl sm:text-2xl"}`} style={h}>{INFO[id].rotulo}</span>
      <span className="block text-gray-400 text-sm mt-1">{INFO[id].promessa}</span>
      <ol className="flex flex-wrap gap-1.5 mt-3" aria-label="Passos">
        {t.passos.map((p, i) => (
          <li key={p.href} className="text-xs text-gray-200 border border-white/15 px-2 py-1">
            <span className="text-[#BA9E50] tabular-nums">{i + 1}</span> {p.nome}
          </li>
        ))}
      </ol>
      <span className="inline-flex items-center gap-1 mt-4 text-white text-sm font-semibold underline underline-offset-4 decoration-[#BA9E50] group-hover:decoration-2">
        Começar este caminho <span aria-hidden="true">→</span>
      </span>
    </LinkRastreado>
  );
}

export default function DoisCaminhos({ variante, placement }: { variante: "home" | "hub" | "resultado"; placement: string }) {
  const compacto = variante !== "home";

  if (variante === "resultado") {
    return (
      <aside className="border border-white/15 p-5" aria-labelledby={`caminhos-${placement}`} data-testid="dois-caminhos-resultado">
        <p id={`caminhos-${placement}`} className="text-white font-semibold mb-1">Quer seguir um caminho completo, passo a passo?</p>
        <p className="text-gray-400 text-sm mb-4">Ferramentas em sequência, grátis — os seus números passam de uma para a outra.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(TRILHAS) as TrilhaId[]).map((id) => <Cartao key={id} id={id} placement={placement} compacto />)}
        </div>
      </aside>
    );
  }

  return (
    <section
      aria-labelledby={`caminhos-${placement}`}
      data-testid={`dois-caminhos-${variante}`}
      className={variante === "home" ? "py-20 bg-black border-t border-white/10" : ""}
    >
      <div className={variante === "home" ? "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" : ""}>
        {variante === "home" && <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#BA9E50] mb-3">Comece aqui · grátis</p>}
        <h2 id={`caminhos-${placement}`} className={`text-white font-bold leading-tight ${variante === "home" ? "text-3xl sm:text-4xl mb-3" : "text-xl sm:text-2xl mb-1"}`} style={h}>
          {variante === "home" ? "Ainda não é hora de contratar? Siga um caminho pronto." : "Siga um caminho pronto em vez de escolher sozinho"}
        </h2>
        <p className={`text-gray-300 leading-relaxed ${variante === "home" ? "text-lg max-w-2xl mb-8" : "text-sm mb-4"}`}>
          {variante === "home"
            ? "Dois caminhos gratuitos, do zero ao seu plano: cada ferramenta responde uma pergunta e passa seus números para a próxima. É o mesmo raciocínio que uso com meus alunos."
            : "Do zero ao seu plano, passo a passo. Seus números passam de uma ferramenta para a outra — sem redigitar nada."}
        </p>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {(Object.keys(TRILHAS) as TrilhaId[]).map((id) => <Cartao key={id} id={id} placement={placement} compacto={compacto} />)}
        </div>
        <p className="mt-4 text-sm">
          <LinkRastreado href="/comece" evento="guided_path_click" params={{ path: "comece", placement }} className={`text-gray-400 hover:text-white underline underline-offset-4 decoration-white/30 min-h-[44px] inline-flex items-center ${foco}`}>
            Não sei qual dos dois — me ajude a escolher
          </LinkRastreado>
        </p>
      </div>
    </section>
  );
}
