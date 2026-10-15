import type { Metadata } from "next";
import Link from "next/link";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import ExploradorExercicios from "@/components/mapa/ExploradorExercicios";
import { EXERCICIOS } from "@/lib/treino/exercicios";
import { GRUPO, GRUPOS, exerciciosDoGrupo, type GrupoSlug } from "@/lib/treino/mapa";
import { GRUPOS_INDEXAVEIS } from "@/lib/treino/mapa-editorial";

/**
 * Hub da futura Biblioteca de Exercícios: o Mapa Muscular é a interface.
 * Base única (lib/treino/exercicios.ts), a mesma do Volume e do Substituidor.
 * Filtros (?equipamento=) são estado de interface: a canonical é esta URL.
 */

const CAMINHO = "/exercicios";

export const metadata: Metadata = {
  title: { absolute: "Mapa Muscular: Exercícios Para Cada Músculo | Montinho" },
  description: "Toque no músculo que quer treinar e veja exercícios por equipamento, nível e local de treino. Peito, costas, glúteos, pernas, braços e mais.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: { title: "Mapa Muscular de Exercícios | Montinho", description: "Toque no músculo que você quer treinar e veja os exercícios.", url: `${SITE_URL}${CAMINHO}`, type: "website", images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
};

const appSchema = aplicativoSchema({ nome: "Mapa Muscular de Exercícios", descricao: "Mapa do corpo interativo para encontrar exercícios por músculo, filtrando por equipamento, complexidade e local de treino.", caminho: CAMINHO, categoria: "SportsApplication" });
const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
  { "@type": "ListItem", position: 2, name: "Exercícios", item: `${SITE_URL}${CAMINHO}` },
] };
/* Regiões do corpo, na ordem das buscas "mapa muscular das costas / da perna / braço / glúteo" (prints do Google, 15/10). */
const REGIOES: { nome: string; grupos: GrupoSlug[] }[] = [
  { nome: "Tronco", grupos: ["peito", "costas", "dorsais", "parte-superior-das-costas", "trapezio", "lombar", "abdomen"] },
  { nome: "Ombros e braços", grupos: ["ombros", "deltoide-anterior", "deltoide-lateral", "deltoide-posterior", "biceps", "triceps", "antebraco"] },
  { nome: "Pernas e glúteos", grupos: ["gluteos", "quadriceps", "posterior-de-coxa", "adutores", "panturrilha"] },
];

const faq: ItemFAQ[] = [
  { question: "O que é um mapa muscular?", answer: "É uma figura do corpo dividida pelos músculos. Neste mapa, cada região é tocável: você escolhe o músculo e vê os exercícios que o treinam, filtrando pelo equipamento que tem." },
  { question: "Quais são os 7 grupos musculares?", answer: `Não existe uma lista oficial de sete. Na academia, é comum dividir o corpo em peito, costas, ombros, bíceps, tríceps, abdômen e pernas, e as pernas se dividem em quadríceps, posterior de coxa, glúteos e panturrilha. Este mapa usa ${GRUPOS.length} regiões para ser mais preciso: separa, por exemplo, as três partes do ombro e as partes das costas.` },
  { question: "Qual site mostra exercícios para cada músculo?", answer: "Este mapa: é gratuito, mostra os exercícios de cada músculo e filtra por academia, halteres ou casa. Cada músculo também tem a própria página, com como escolher os exercícios e opções para treinar em casa." },
  { question: "Como usar o mapa muscular para montar o treino?", answer: "Escolha os músculos que quer treinar e, para cada um, comece por um exercício base, que permite mais carga, e complemente com outro de movimento diferente. Para saber quantas séries por semana cada músculo está recebendo, use a Calculadora de Volume de Treino." },
  { question: "Quantos exercícios por músculo é o ideal?", answer: "Não há número fixo. O que pesa é o total de séries que o músculo recebe na semana, não quantos exercícios diferentes você faz. Para a maioria das pessoas, 1 a 3 exercícios por músculo na sessão resolvem, com as séries divididas em 2 ou mais dias. A Calculadora de Volume de Treino soma essas séries a partir do seu treino." },
  { question: "É suficiente fazer 3 exercícios para cada grupo muscular?", answer: "Para a maioria, sim, e muitas vezes 2 já bastam. Três exercícios com 3 séries cada somam 9 séries; se o músculo treina duas vezes na semana, já são 18. Mais exercícios só ajudam se você consegue se recuperar e progredir em todos." },
  { question: "Como dividir o treino por grupo muscular?", answer: "Depende de quantos dias você treina. Com 2 ou 3 dias, o corpo inteiro em cada treino (full body) costuma render mais; com 4 ou mais, dá para dividir em partes, como superiores e inferiores ou ABC. Treinar cada músculo duas vezes por semana facilita distribuir as séries sem treinos longos demais." },
  { question: "O mapa mostra os músculos do rosto e do pescoço?", answer: "Não. O mapa mostra os músculos que se treinam com exercícios de academia ou em casa: tronco, ombros e braços, pernas e glúteos." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function ExerciciosHub() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5"><Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Exercícios</span></nav>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#BA9E50" }}>Mapa Muscular de Exercícios</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3" style={h}>Toque no músculo que você quer treinar</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Veja exercícios para cada grupo muscular e filtre pelo equipamento que você tem disponível.</p>
        </div>
      </section>
      <section className="pb-10 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><ExploradorExercicios placement="hub" /></div>
      </section>
      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Exercícios por músculo</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GRUPOS_INDEXAVEIS.map((s) => <li key={s}><Link href={`/exercicios/${s}`} className={ln}>Exercícios para {GRUPO[s].para}</Link> <span className="text-xs text-gray-500">({exerciciosDoGrupo(s).length})</span></li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Mapa muscular do corpo humano: costas, pernas, braços e glúteos</h2>
            <p className="mb-4">O mapa divide o corpo nas regiões que você treina. Toque numa delas acima ou abra a página do músculo:</p>
            <div className="grid sm:grid-cols-3 gap-6">
              {REGIOES.map((r) => (
                <div key={r.nome}>
                  <h3 className="text-white font-semibold mb-2">{r.nome}</h3>
                  <ul className="space-y-1.5 text-sm">
                    {r.grupos.map((s) => <li key={s}>{GRUPOS_INDEXAVEIS.includes(s) ? <Link href={`/exercicios/${s}`} className={ln}>{GRUPO[s].nome}</Link> : GRUPO[s].nome}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como o mapa funciona</h2>
            <p>São {EXERCICIOS.length} exercícios, cada um com o músculo principal, os secundários, o padrão de movimento, o equipamento e a complexidade técnica, classificados à mão. A lista mostra primeiro os exercícios em que o músculo é o principal; dá para incluir os que o treinam como secundário. Não mostramos percentuais de ativação: a participação de cada músculo muda com a técnica, a carga e a pessoa, e números assim passariam uma precisão que não existe.</p>
            <p className="mt-3">É a mesma base do <Link href="/ferramentas/substituidor-de-exercicios" className={ln}>Substituidor de Exercícios</Link> e da <Link href="/ferramentas/calculadora-volume-treino" className={ln}>Calculadora de Volume</Link>: o exercício que você encontra aqui conta do mesmo jeito lá. Para o intervalo entre as séries, use a <Link href="/ferramentas/calculadora-descanso-entre-series" className={ln}>calculadora de descanso</Link>.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="mapa-muscular" />
          </div>
          <p className="text-gray-400 text-sm">Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. {GRUPOS.length} regiões musculares.</p>
        </div>
      </section>
    </>
  );
}
