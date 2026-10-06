import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import CalculadoraCafeina from "@/components/cafeina/CalculadoraCafeina";
import { BEBIDAS, FONTES_CAFEINA, fmtInt } from "@/lib/cafeina";

/**
 * Calculadora de Cafeína.
 *
 * Pesquisa (05/10/2026), "quanto de cafeína por dia": pode tomar, é
 * saudável, faz mal, recomendado, gravidez, quantas mg, máxima, quantos ml.
 * PAA: pode tomar 800 / 600 / 400 mg por dia?, cafeína de 200 mg é forte?
 * Relacionadas: 840 mg, 800 mg é muito, dose segura por kg, dose máxima,
 * mg no energético, 600 mg, 400 mg é muito.
 *
 * O artigo cafeina-no-treino-dose-timing explica o uso no treino; esta
 * página faz a conta do dia, do treino e do horário de sono.
 */

const CAMINHO = "/ferramentas/calculadora-cafeina";

export const metadata: Metadata = {
  title: { absolute: "Quanto de Cafeína por Dia? Calculadora de Cafeína por Kg" },
  description:
    "Some café, chá, energético e pré-treino e veja se passa do limite de 400 mg por dia, a dose por kg para treinar e até que horas tomar o último café.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Cafeína | Montinho",
    description: "Quanta cafeína você toma por dia, quanto pode tomar e até que horas.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Cafeína",
  descricao: "Soma a cafeína das bebidas e suplementos do dia, compara com os limites da EFSA, mostra a dose por kg usada em estudos de treino e o horário limite para não atrapalhar o sono.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Cafeína", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const faq: ItemFAQ[] = [
  { question: "Quanto de cafeína por dia pode tomar?", answer: "Para adultos saudáveis, até 400 mg por dia, segundo a Autoridade Europeia de Segurança Alimentar (EFSA). Dá umas 4 xícaras de 200 ml de café coado. Numa dose única, até 200 mg." },
  { question: "Pode tomar 400 mg de cafeína por dia?", answer: "Para a maioria dos adultos saudáveis, sim: é o limite que a EFSA considera seguro. Mas é o teto, não a meta. Quem tem ansiedade, pressão alta, problema cardíaco ou dorme mal pode sentir efeitos bem antes." },
  { question: "Pode tomar 600, 800 ou 1000 mg de cafeína por dia?", answer: "Não é recomendado. Fica acima do limite de 400 mg da EFSA, e com isso aumentam taquicardia, ansiedade, tremor, insônia e problemas de estômago. 800 mg é o dobro do limite." },
  { question: "Cafeína de 200 mg é forte?", answer: "É uma dose alta para uma vez só, perto de dois cafés coados de uma vez. É o máximo que a EFSA considera seguro numa dose única para adultos, inclusive antes de treino intenso. Quem não está acostumado pode sentir tremor ou coração acelerado." },
  { question: "200 mg de cafeína equivalem a quantas xícaras de café?", answer: "Cerca de duas xícaras de café coado de 200 ml (perto de 90 mg cada) ou dois expressos e meio (perto de 80 mg cada). O teor muda com o grão e o preparo, então trate como estimativa." },
  { question: "100 ou 150 mg de cafeína é muito?", answer: "Para um adulto saudável, não: é mais ou menos um a dois cafés coados, bem abaixo do limite de 400 mg por dia da EFSA. Quem é sensível pode sentir mais, principalmente à tarde e à noite, por causa do sono." },
  { question: "Qual a dose segura de cafeína por kg?", answer: "Para treinar, os estudos usam de 3 a 6 mg por kg, uns 60 minutos antes, e doses a partir de 2 mg por kg podem já funcionar. Acima de 9 mg por kg os efeitos colaterais aumentam muito. Para menores de 18, o limite do dia é 3 mg por kg." },
  { question: "Quanto de cafeína na gravidez?", answer: "Até 200 mg por dia, na gestação e na amamentação, segundo a EFSA. Sempre combine com quem acompanha o seu pré-natal." },
  { question: "Quantos mg de cafeína tem um energético?", answer: "Uma lata de 250 ml tem cerca de 80 mg. Latas maiores, de 473 ml, podem ter o dobro ou mais: confira sempre o rótulo." },
  { question: "Que horas tomar o último café?", answer: "Uma revisão de 24 estudos, de 2023, concluiu que um café deve ser tomado pelo menos 8,8 horas antes de dormir e uma dose de pré-treino, 13,2 horas antes, para não perder tempo de sono. Quem dorme às 23h deve parar o café por volta das 14h." },
  { question: "Cafeína faz mal?", answer: "Dentro do limite, para adultos saudáveis, não costuma fazer. Em excesso, causa insônia, ansiedade, coração acelerado, tremor e azia. A sensibilidade varia muito entre pessoas, em parte pela genética." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function CalculadoraCafeinaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Calculadora de Cafeína</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>Quanto de cafeína por dia? Calculadora de cafeína</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Some o que você toma num dia comum e veja se passa do limite, a dose por kg para treinar e até que horas tomar o último café.</p>
        </div>
      </section>

      <section className="pb-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraCafeina />
          <noscript><p className="text-gray-300 mt-4">A calculadora precisa de JavaScript. A tabela está logo abaixo.</p></noscript>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Quanto de cafeína por dia é seguro?</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Adultos:</strong> até 400 mg por dia, e até 200 mg de uma vez.</li>
              <li><strong className="text-white">Gestantes e lactantes:</strong> até 200 mg por dia.</li>
              <li><strong className="text-white">Crianças e adolescentes:</strong> até 3 mg por kg de peso por dia.</li>
            </ul>
            <p className="mt-3">São os limites do parecer de 2015 da EFSA, a autoridade de segurança alimentar da União Europeia, os mesmos usados pela maioria dos órgãos de saúde.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Quantos mg de cafeína tem cada bebida</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-white/15">
                <thead><tr className="text-left text-white bg-white/5"><th className="p-3">Bebida</th><th className="p-3">Porção</th><th className="p-3">Cafeína</th><th className="p-3">Para 400 mg</th></tr></thead>
                <tbody>{BEBIDAS.map((b) => <tr key={b.id} className="border-t border-white/10"><td className="p-3">{b.nome}</td><td className="p-3">{b.porcao}</td><td className="p-3 whitespace-nowrap">~{b.mg} mg</td><td className="p-3 whitespace-nowrap">{fmtInt(400 / b.mg)} porções</td></tr>)}</tbody>
              </table>
            </div>
            <p className="text-sm text-gray-400 mt-3">Médias da EFSA. O café real varia bastante com o tipo de grão, a quantidade de pó e o preparo; suplementos trazem a dose no rótulo.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Cafeína no treino: dose por kg</h2>
            <p>A cafeína é um dos poucos suplementos com efeito comprovado no desempenho. A posição de 2021 da Sociedade Internacional de Nutrição Esportiva (ISSN) aponta de 3 a 6 mg por kg, em geral 60 minutos antes. Para 70 kg, dá de 210 a 420 mg, o que já passa dos 200 mg de dose única da EFSA: por isso o melhor é começar por baixo. O artigo <Link href="/blog/cafeina-no-treino-dose-timing" className={ln}>cafeína como pré-treino</Link> explica tolerância e horário.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Até que horas tomar café</h2>
            <p>Uma revisão de 24 estudos publicada em 2023 concluiu que a cafeína reduz o sono em média 45 minutos e tira sono profundo. Para não perder sono, o café deve vir pelo menos 8,8 horas antes de deitar, e uma dose de pré-treino, 13,2 horas antes. Quem treina à noite com pré-treino quase sempre dorme pior: nesses dias, vale treinar sem.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-cafeina" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400">{FONTES_CAFEINA.map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a></li>)}</ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Informação educacional, não prescrição. Quem tem condição de saúde ou usa medicamento deve conversar com o médico.</p>
          </div>
        </div>
      </section>
    </>
  );
}
