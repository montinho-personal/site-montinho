import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import CalculadoraCintura from "@/components/cintura/CalculadoraCintura";
import { FAIXAS, FONTE_NICE, tabela } from "@/lib/cintura-altura";

/**
 * Calculadora de Relação Cintura-Altura (RCA / RCE).
 *
 * Pesquisa (05/10/2026): autocompletar pede calculadora, tabela, mulher, rca,
 * fórmula, ideal, normal, obesidade. "As pessoas também perguntam": tabela de
 * cintura e estatura, relação cintura-quadril ideal, fórmula, cintura ideal
 * para mulher de 1,70 m. Relacionadas: OMS, valores de referência,
 * classificação, cintura-quadril (tabela).
 */

const CAMINHO = "/ferramentas/relacao-cintura-altura";

export const metadata: Metadata = {
  title: { absolute: "Relação Cintura-Altura: Calculadora e Tabela (RCA/RCE) | Montinho" },
  description:
    "Calcule sua relação cintura-altura em segundos e veja a faixa: saudável, aumentada ou alta, pelos cortes da NICE. Com tabela por altura, fórmula e como medir.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Relação Cintura-Altura | Montinho",
    description: "Sua cintura mede menos da metade da sua altura? Calcule a RCA e veja a faixa.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Relação Cintura-Altura",
  descricao: "Calcula a relação cintura-altura (cintura dividida pela altura) e mostra a faixa de adiposidade central pelos cortes da NICE.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Relação Cintura-Altura", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const faq: ItemFAQ[] = [
  { question: "Como calcular a relação cintura-altura?", answer: "Divida a cintura pela altura, as duas na mesma unidade. Exemplo: 80 cm de cintura e 170 cm de altura dão 80 ÷ 170 = 0,47." },
  { question: "Qual é a relação cintura-altura ideal?", answer: "Entre 0,40 e 0,49, que a NICE chama de adiposidade central saudável. Na prática: manter a cintura abaixo da metade da altura." },
  { question: "Qual é a tabela de cintura e estatura?", answer: "0,40 a 0,49: saudável. 0,50 a 0,59: aumentada. 0,60 ou mais: alta. A tabela desta página traduz isso em centímetros de cintura para cada altura." },
  { question: "A relação cintura-altura é diferente para mulher?", answer: "Não. A NICE usa os mesmos cortes para homens e mulheres e para todas as etnias. Uma mulher de 1,70 m fica na faixa saudável com até 84 cm de cintura; a partir de 85 cm, já é a faixa aumentada." },
  { question: "RCA e RCE são a mesma coisa?", answer: "Sim. Relação cintura-altura (RCA) e relação cintura-estatura (RCE) são dois nomes para a mesma conta. Em inglês, waist-to-height ratio." },
  { question: "Qual a diferença para a relação cintura-quadril?", answer: "A relação cintura-quadril divide a cintura pelo quadril e tem outros cortes. A cintura-altura é mais simples de medir e serve para os dois sexos com o mesmo número. Esta ferramenta calcula só a cintura-altura." },
  { question: "A relação cintura-altura é melhor que o IMC?", answer: "Ela mostra algo que o IMC não mostra: onde está a gordura. Por isso a NICE recomenda usar as duas juntas em adultos com IMC abaixo de 35, inclusive em quem tem muita massa muscular." },
  { question: "Como baixar a relação cintura-altura?", answer: "Reduzindo a gordura do corpo, o que pede um pequeno déficit calórico mantido por semanas, treino de força e constância. Abdominal sozinho não tira gordura da barriga." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function RelacaoCinturaAlturaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Relação Cintura-Altura</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>Calculadora de Relação Cintura-Altura</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Digite a cintura e a altura e veja se a sua cintura mede menos da metade da sua altura, com a faixa da NICE: saudável, aumentada ou alta.</p>
        </div>
      </section>

      <section className="pb-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraCintura />
          <noscript><p className="text-gray-300 mt-4">A calculadora precisa de JavaScript. A tabela por altura está logo abaixo.</p></noscript>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>O que é a relação cintura-altura?</h2>
            <p>É a medida da cintura dividida pela altura. Ela mostra quanta gordura se acumula na barriga, a que mais pesa no risco de diabetes tipo 2, pressão alta e doença cardiovascular. Também é chamada de relação cintura-estatura (RCE) ou RCA.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Fórmula e como medir a cintura</h2>
            <p className="mb-3"><strong className="text-white">RCA = cintura (cm) ÷ altura (cm).</strong> Exemplo: 80 cm ÷ 170 cm = 0,47.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fique em pé, sem roupa na barriga, e solte o ar normalmente.</li>
              <li>Passe a fita no meio do caminho entre a última costela e o topo do osso do quadril.</li>
              <li>Fita reta e firme, sem apertar a pele e sem encolher a barriga.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Valores de referência: o que o número significa</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-white/15">
                <thead><tr className="text-left text-white bg-white/5"><th className="p-3">RCA</th><th className="p-3">Classificação (NICE)</th></tr></thead>
                <tbody>
                  {FAIXAS.slice(1).map((f) => (
                    <tr key={f.id} className="border-t border-white/10"><td className="p-3 whitespace-nowrap">{f.intervalo}</td><td className="p-3"><span style={{ color: f.cor }} className="font-semibold">{f.nome}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-400 mt-3">Os cortes valem para adultos com IMC abaixo de 35, homens e mulheres, de todas as etnias, inclusive quem tem muita massa muscular. Não valem para gestantes.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Tabela de cintura por altura</h2>
            <p className="mb-3">A cintura máxima de cada faixa, em centímetros inteiros, para homens e mulheres:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-white/15">
                <thead><tr className="text-left text-white bg-white/5"><th className="p-3">Altura</th><th className="p-3">Saudável</th><th className="p-3">Aumentada</th><th className="p-3">Alta</th></tr></thead>
                <tbody>
                  {tabela().map((l) => (
                    <tr key={l.altura} className="border-t border-white/10"><td className="p-3 whitespace-nowrap">{(l.altura / 100).toFixed(2).replace(".", ",")} m</td><td className="p-3">até {l.saudavelAte} cm</td><td className="p-3">{l.saudavelAte + 1} a {l.aumentadaAte} cm</td><td className="p-3">{l.alta} cm ou mais</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Por que olhar a cintura e não só o IMC</h2>
            <p>O IMC só sabe peso e altura: não distingue músculo de gordura nem diz onde a gordura está. Duas pessoas com o mesmo IMC podem ter cinturas bem diferentes. Por isso a NICE recomenda usar a cintura-altura junto com o IMC. Para ver músculo e gordura em quilos, use a <Link href="/ferramentas/composicao-corporal" className={ln}>calculadora de composição corporal</Link>; para planejar a perda de gordura, a <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>calculadora de déficit calórico</Link>.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como reduzir a cintura na prática</h2>
            <p>Abdominal não queima a gordura da barriga: onde a gordura sai primeiro é decidido pelo corpo. O que move a cintura é perder gordura no geral, com um déficit pequeno mantido por semanas, treino de força para segurar o músculo e uma rotina que você consiga repetir. Meça a cintura a cada duas ou quatro semanas, sempre do mesmo jeito: ela costuma cair mesmo quando a balança empaca.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-cintura-altura" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referência</h3>
            <p className="text-sm text-gray-400"><a href={FONTE_NICE.url} target="_blank" rel="noopener noreferrer" className={ln}>{FONTE_NICE.rotulo}</a></p>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Ferramenta de triagem educacional, não diagnóstico.</p>
          </div>
        </div>
      </section>
    </>
  );
}
