import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import CalculadoraImc from "@/components/imc/CalculadoraImc";
import { ALTURAS_TABELA, FAIXAS_IMC, FONTES_IMC, faixaPesoNormal, fmt1, imc } from "@/lib/imc";

/**
 * Calculadora de IMC.
 *
 * Pesquisa (05/10/2026): "calcular imc" pede feminino, masculino, grátis,
 * infantil, online, peso ideal, tabela, criança, adulto, como calcular.
 * "imc tabela": masculina, feminina, por idade, infantil, oms, adulto,
 * idoso, adolescente.
 *
 * Pedido do Montinho: deixar claro que o IMC não é das melhores medidas,
 * ainda mais para quem treina, e mandar para percentual de gordura e
 * cintura-altura.
 */

const CAMINHO = "/ferramentas/calculadora-imc";

export const metadata: Metadata = {
  title: { absolute: "Calcular IMC: Calculadora e Tabela de IMC (e Seus Limites)" },
  description:
    "Calcule seu IMC, veja a tabela da OMS e o peso normal para a sua altura. E entenda por que o IMC engana quem treina, com as ferramentas que medem melhor.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de IMC | Montinho",
    description: "Seu IMC, a tabela da OMS e por que ele não basta para quem treina.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de IMC",
  descricao: "Calcula o Índice de Massa Corporal de adultos, classifica pela tabela da OMS e mostra a faixa de peso normal para a altura, com as limitações do IMC para quem treina.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de IMC", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const ex = imc(85, 1.75);
const faq: ItemFAQ[] = [
  { question: "Como calcular o IMC?", answer: "Divida o peso em quilos pela altura em metros ao quadrado. Exemplo: 70 kg e 1,70 m dão 70 ÷ (1,70 × 1,70) = 24,2." },
  { question: "Qual é a tabela de IMC?", answer: "Para adultos, pela OMS: abaixo de 18,5 é baixo peso; de 18,5 a 24,9, peso normal; de 25 a 29,9, sobrepeso; de 30 a 34,9, obesidade grau I; de 35 a 39,9, grau II; 40 ou mais, grau III." },
  { question: "O IMC é diferente para homem e mulher?", answer: "Não. Para adultos a tabela é a mesma para os dois sexos. O que muda entre homens e mulheres é a composição do corpo, que o IMC não vê: por isso o percentual de gordura tem faixas diferentes por sexo." },
  { question: "O IMC serve para quem faz musculação?", answer: `Mal. Ele não separa músculo de gordura. Uma pessoa de 1,75 m e 85 kg tem IMC de ${fmt1(ex)}, \"sobrepeso\" na tabela, mesmo que seja musculosa e magra. Para quem treina, percentual de gordura e relação cintura-altura dizem muito mais.` },
  { question: "Qual o peso ideal pelo IMC?", answer: "O IMC dá uma faixa, não um número: é o peso entre 18,5 e 24,9 de IMC para a sua altura. Para 1,70 m, de 53,5 a 72,0 kg. Dentro dela, o melhor peso depende de quanto disso é músculo." },
  { question: "Quem pesa 78 kg é obeso?", answer: `Depende da altura, e nem sempre do peso só. Com 78 kg, o IMC é ${fmt1(imc(78, 1.8))} em quem tem 1,80 m (normal), ${fmt1(imc(78, 1.7))} com 1,70 m (sobrepeso) e ${fmt1(imc(78, 1.6))} com 1,60 m (obesidade grau I). E se boa parte desses 78 kg for músculo, o IMC exagera.` },
  { question: "Como calcular o IMC de criança e adolescente?", answer: "A conta é a mesma, mas a leitura não usa a tabela de adultos: o resultado é comparado com curvas de crescimento por idade e sexo. Esse acompanhamento é feito pelo pediatra." },
  { question: "O IMC muda para idosos?", answer: "Alguns serviços de saúde usam faixas diferentes para idosos, porque com a idade o corpo perde músculo e altura. Esta calculadora usa a tabela de adultos da OMS; para idosos, a leitura deve ser feita com o médico." },
  { question: "Qual é melhor que o IMC?", answer: "Para saber se o peso é gordura ou músculo, o percentual de gordura. Para o risco ligado à gordura da barriga, a relação cintura-altura, que órgãos como o NICE, do Reino Unido, recomendam usar junto com o IMC." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const intervalo = (k: number) => k === 0 ? "menos de 18,5" : FAIXAS_IMC[k].ate === Infinity ? "40,0 ou mais" : `${fmt1(FAIXAS_IMC[k - 1].ate)} a ${fmt1(FAIXAS_IMC[k].ate - 0.1)}`;

export default function CalculadoraImcPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Calculadora de IMC</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>Calculadora de IMC</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Calcule seu IMC e veja a faixa pela tabela da OMS. Mas leia até o fim: para quem treina, o IMC é a medida que mais engana.</p>
        </div>
      </section>

      <section className="pb-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraImc />
          <noscript><p className="text-gray-300 mt-4">A calculadora precisa de JavaScript. A tabela está logo abaixo.</p></noscript>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div className="border border-[#BA9E50]/50 bg-[#BA9E50]/[0.06] p-5">
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Por que o IMC não é a melhor medida, ainda mais para quem treina</h2>
            <p className="mb-3">O IMC foi criado no século 19 para estudar populações, não para avaliar uma pessoa. Ele divide o peso pela altura e mais nada. Por isso:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Não separa músculo de gordura.</strong> Uma pessoa de 1,75 m e 85 kg tem IMC {fmt1(ex)}, &quot;sobrepeso&quot;, seja ela musculosa e seca ou sedentária com barriga.</li>
              <li><strong className="text-white">Não mostra onde está a gordura.</strong> A gordura da barriga pesa mais na saúde que a do quadril, e o IMC não enxerga a diferença.</li>
              <li><strong className="text-white">Engana nos dois sentidos.</strong> Quem perdeu músculo e ganhou gordura pode continuar com IMC &quot;normal&quot; e estar pior do que parece.</li>
            </ul>
            <p className="mt-3">Quem treina força e quer saber como está de verdade deve olhar outras medidas:</p>
            <ul className="mt-2 space-y-1">
              <li>→ <Link href="/ferramentas/calculadora-percentual-de-gordura" className={ln}>Calculadora de Percentual de Gordura</Link>: com fita métrica ou dobras, separa gordura de massa magra.</li>
              <li>→ <Link href="/ferramentas/relacao-cintura-altura" className={ln}>Relação Cintura-Altura</Link>: a gordura da barriga, que o NICE recomenda medir junto com o IMC.</li>
              <li>→ <Link href="/ferramentas/composicao-corporal" className={ln}>Composição Corporal</Link>: se você já tem o percentual da bioimpedância, mostra quanto disso é gordura e quanto é músculo em kg.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Tabela de IMC para adultos (OMS)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-white/15">
                <thead><tr className="text-left text-white bg-white/5"><th className="p-3">IMC</th><th className="p-3">Classificação</th></tr></thead>
                <tbody>{FAIXAS_IMC.map((f, k) => <tr key={f.id} className="border-t border-white/10"><td className="p-3 whitespace-nowrap">{intervalo(k)}</td><td className="p-3" style={{ color: f.cor }}>{f.nome}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="text-sm text-gray-400 mt-3">A mesma tabela vale para homens e mulheres adultos. Crianças e adolescentes usam curvas por idade e sexo.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Peso normal pelo IMC, por altura</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-white/15">
                <thead><tr className="text-left text-white bg-white/5"><th className="p-3">Altura</th><th className="p-3">IMC de 18,5 a 24,9</th></tr></thead>
                <tbody>{ALTURAS_TABELA.map((a) => { const p = faixaPesoNormal(a); return <tr key={a} className="border-t border-white/10"><td className="p-3">{a.toFixed(2).replace(".", ",")} m</td><td className="p-3">{fmt1(p.de)} a {fmt1(p.ate)} kg</td></tr>; })}</tbody>
              </table>
            </div>
            <p className="text-sm text-gray-400 mt-3">É uma faixa larga de propósito. Para entender o peso ideal com mais nuance, leia <Link href="/blog/qual-e-o-meu-peso-ideal" className={ln}>qual é o meu peso ideal</Link>.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como calcular o IMC</h2>
            <p><strong className="text-white">IMC = peso (kg) ÷ altura (m)²</strong>. Para 70 kg e 1,70 m: 1,70 × 1,70 = 2,89; 70 ÷ 2,89 = 24,2, peso normal.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-imc" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400">{FONTES_IMC.map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a></li>)}</ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Triagem educacional, não diagnóstico.</p>
          </div>
        </div>
      </section>
    </>
  );
}
