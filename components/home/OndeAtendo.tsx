import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";

/**
 * Onde atendo, na home.
 *
 * A página inicial é a mais forte do site e não tinha um único link para as
 * páginas regionais — elas só eram alcançadas pelo rodapé e umas pelas
 * outras. Para o Google, isso diz que Alphaville, Barueri e Santana são
 * periféricas ao site; para quem chega pela home procurando "personal perto
 * de mim", diz que não tem. Este bloco corrige as duas leituras com o
 * mínimo: cinco lugares, uma frase cada, o link.
 *
 * As regiões e a ordem vêm do que o Search Console mostra: Alphaville e
 * Tamboré são o núcleo; Barueri tem o maior volume de busca sem clique;
 * Santana e Aldeia são as SERPs mais fracas da região — e as mais fáceis.
 */
const REGIOES = [
  { href: "/personal-trainer-alphaville", nome: "Alphaville", onde: "condomínios e academias da região" },
  { href: "/personal-trainer-tambore", nome: "Tamboré", onde: "residenciais e espaços fitness do bairro" },
  { href: "/personal-trainer-barueri", nome: "Barueri", onde: "centro e bairros próximos" },
  { href: "/personal-trainer-santana-de-parnaiba", nome: "Santana de Parnaíba", onde: "condomínios e academias da cidade" },
  { href: "/blog/personal-trainer-aldeia-da-serra", nome: "Aldeia da Serra", onde: "atendimento no próprio condomínio" },
];

export default function OndeAtendo() {
  return (
    <section className="py-20 bg-black border-t border-white/10" id="onde-atendo" aria-labelledby="onde-atendo-titulo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Onde atendo"
          title="Presencial em Alphaville e região. Online em todo o Brasil."
          subtitle="Treino no seu condomínio, na sua academia ou na minha. A primeira aula é experimental e gratuita."
        />
        <ul className="mt-12 grid gap-px bg-white/10 border border-white/10 sm:grid-cols-2 lg:grid-cols-5 list-none p-0 m-0">
          {REGIOES.map((r) => (
            <li key={r.href} className="bg-black">
              <Link
                href={r.href}
                className="block h-full p-6 group hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <span className="block text-white font-semibold text-lg group-hover:underline underline-offset-4">
                  Personal em {r.nome}
                </span>
                <span className="block mt-2 text-sm text-gray-400">{r.onde}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-gray-400">
          Fora dessas áreas? A <Link href="/consultoria-online" className="text-white underline underline-offset-4 hover:opacity-70">consultoria online</Link> chega onde eu não chego. Detalhes de cada região em <Link href="/onde-atendo" className="text-white underline underline-offset-4 hover:opacity-70">onde atendo</Link>.
        </p>
      </div>
    </section>
  );
}
