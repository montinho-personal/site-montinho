import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import CalculadoraCooper from "@/components/cooper/CalculadoraCooper";
import { classe, DISTANCIAS_TABELA, FAIXAS_IDADE, FONTE_COOPER, FONTE_NORMAS, NORMAS, fmt1, fmtInt, fmtPace, kmh, paceMinKm, vo2, type Sexo } from "@/lib/cooper";

/**
 * Calculadora do Teste de Cooper (12 minutos → VO2 máx).
 *
 * Pesquisa (05/10/2026): autocompletar pede 12 minutos tabela, calculadora,
 * vo2 max, na esteira, quem criou, como fazer. PAA: como é feito, como
 * calcular o VO2MAX, quantos km é, o que é o teste de 12 minutos.
 * Relacionadas: tabela por idade, pdf, distância.
 */

const CAMINHO = "/ferramentas/teste-de-cooper";

export const metadata: Metadata = {
  title: { absolute: "Teste de Cooper: Calculadora de VO2 Máx e Tabela por Idade" },
  description:
    "Digite quantos metros você correu em 12 minutos e veja seu VO2 máx e sua classificação por idade e sexo. Com tabela, fórmula e como fazer o teste.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora do Teste de Cooper | Montinho",
    description: "Quantos metros em 12 minutos? Veja seu VO2 máx e sua classificação.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora do Teste de Cooper",
  descricao: "Estima o VO2 máx pela distância percorrida em 12 minutos (fórmula de Cooper, 1968) e classifica o resultado por idade e sexo.",
  caminho: CAMINHO,
  categoria: "SportsApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Teste de Cooper", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const faq: ItemFAQ[] = [
  { question: "O que é o teste de Cooper de 12 minutos?", answer: "É um teste de condicionamento: você corre (ou corre e caminha) a maior distância possível em 12 minutos. A distância estima o seu VO₂ máx, a capacidade máxima do corpo de usar oxigênio." },
  { question: "Quem criou o teste de Cooper?", answer: "O médico americano Kenneth Cooper, em 1968, para avaliar militares da Força Aérea dos EUA sem precisar de laboratório. O estudo foi publicado no JAMA, a revista da Associação Médica Americana." },
  { question: "Como é feito o teste de Cooper?", answer: "Aqueça de 10 a 15 minutos. Numa pista de 400 metros ou num percurso plano medido, corra 12 minutos no ritmo mais forte que você consiga manter até o fim. Pode caminhar se precisar. Anote a distância total em metros." },
  { question: "Como calcular o VO₂ máx pelo teste de Cooper?", answer: `VO₂ máx = (distância em metros − 504,9) ÷ 44,73. Exemplo: 2.400 metros dão (2.400 − 504,9) ÷ 44,73 = ${fmt1(vo2(2400))} ml/kg/min.` },
  { question: "Um VO₂ máx de 42 é bom?", answer: `Depende da idade e do sexo. VO₂ de 42 equivale a uns ${fmtInt(42 * 44.73 + 504.9)} metros no teste de Cooper: para um homem de 20 a 29 anos, isso é ${classe(42 * 44.73 + 504.9, "homem", 25).nome.toLowerCase()}; para um de 40 a 49, ${classe(42 * 44.73 + 504.9, "homem", 45).nome.toLowerCase()}; para uma mulher de 30 a 39, ${classe(42 * 44.73 + 504.9, "mulher", 35).nome.toLowerCase()}.` },
  { question: "Quantos km é o teste de Cooper?", answer: "Não tem distância fixa: o tempo é fixo, 12 minutos, e a distância é o resultado. Adultos costumam fazer entre 1,5 e 3 km. Para um homem de 20 a 29 anos, acima de 2,8 km é excelente." },
  { question: "Dá para fazer o teste de Cooper na esteira?", answer: "Dá, usando a distância que o painel mostra depois de 12 minutos. Mas a esteira muda a mecânica da corrida e os painéis variam, então compare só esteira com esteira, sempre a mesma." },
  { question: "Qual é um bom resultado no teste de Cooper?", answer: "Depende da idade e do sexo. Um homem de 30 a 39 anos fica acima da média a partir de 2.300 metros; uma mulher da mesma idade, a partir de 2.000. A tabela completa está nesta página." },
  { question: "Iniciante pode fazer o teste de Cooper?", answer: "É um teste de esforço máximo. Quem é sedentário, tem mais de 40 anos sem treinar, pressão alta ou alguma condição cardíaca deve passar por avaliação médica antes. Para começar, uma caminhada-corrida de 12 minutos já serve como ponto de partida." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const td = "p-2 whitespace-nowrap";

function Tabela({ sexo }: { sexo: Sexo }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs sm:text-sm border border-white/15">
        <caption className="text-left text-white font-semibold mb-2">{sexo === "homem" ? "Homens" : "Mulheres"} (metros em 12 minutos)</caption>
        <thead><tr className="text-left text-white bg-white/5"><th className={td}>Idade</th><th className={td}>Excelente</th><th className={td}>Acima da média</th><th className={td}>Média</th><th className={td}>Abaixo</th><th className={td}>Fraco</th></tr></thead>
        <tbody>{FAIXAS_IDADE.map((f) => { const [ex, ac, me, ab] = NORMAS[sexo][f]; return (
          <tr key={f} className="border-t border-white/10"><td className={td}>{f}</td><td className={td}>&gt; {fmtInt(ex)}</td><td className={td}>{fmtInt(ac)}–{fmtInt(ex)}</td><td className={td}>{fmtInt(me)}–{fmtInt(ac - 1)}</td><td className={td}>{fmtInt(ab)}–{fmtInt(me - 1)}</td><td className={td}>&lt; {fmtInt(ab)}</td></tr>
        ); })}</tbody>
      </table>
    </div>
  );
}

export default function TesteCooperPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Teste de Cooper</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>Teste de Cooper: calculadora de VO₂ máx</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Corra 12 minutos, digite a distância e veja seu VO₂ máx estimado e a sua classificação para a idade e o sexo.</p>
        </div>
      </section>

      <section className="pb-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraCooper />
          <noscript><p className="text-gray-300 mt-4">A calculadora precisa de JavaScript. A tabela está logo abaixo.</p></noscript>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como fazer o teste de Cooper</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Escolha uma pista de 400 metros ou um percurso plano com distância conhecida.</li>
              <li>Aqueça de 10 a 15 minutos com caminhada e trote leve.</li>
              <li>Corra 12 minutos no ritmo mais forte que você consiga sustentar até o fim. Se precisar, caminhe, mas não pare.</li>
              <li>Anote a distância total em metros (voltas × 400 + o pedaço da última volta).</li>
            </ol>
            <p className="mt-3">Comece num ritmo que você aguente: quem sai rápido demais costuma caminhar no fim e fazer menos metros.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Tabela do teste de Cooper por idade</h2>
            <div className="space-y-6"><Tabela sexo="homem" /><Tabela sexo="mulher" /></div>
            <p className="text-sm text-gray-400 mt-3">Tabela de referência do <a href={FONTE_NORMAS.url} target="_blank" rel="noopener noreferrer" className={ln}>Topend Sports</a>, a mais usada em avaliações físicas.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Fórmula do VO₂ máx pelo teste de Cooper</h2>
            <p className="mb-3"><strong className="text-white">VO₂ máx = (distância em metros − 504,9) ÷ 44,73</strong>, em ml de oxigênio por kg por minuto.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-white/15">
                <thead><tr className="text-left text-white bg-white/5"><th className="p-3">Distância</th><th className="p-3">VO₂ máx</th><th className="p-3">Velocidade</th><th className="p-3">Pace</th></tr></thead>
                <tbody>{DISTANCIAS_TABELA.map((d) => <tr key={d} className="border-t border-white/10"><td className={td + " p-3"}>{fmtInt(d)} m</td><td className="p-3">{fmt1(vo2(d))}</td><td className="p-3">{fmt1(kmh(d))} km/h</td><td className="p-3 whitespace-nowrap">{fmtPace(paceMinKm(d))}</td></tr>)}</tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>O que é VO₂ máx e como melhorar</h2>
            <p>É a quantidade máxima de oxigênio que o corpo consegue usar por minuto, por quilo de peso. Quanto maior, mais fôlego. Ele sobe com treino: corridas leves e frequentes para construir base, mais um treino por semana de intervalos fortes. Musculação ajuda a correr melhor, mas não substitui o treino aeróbico. Refaça o teste a cada 6 a 8 semanas para ver a evolução.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-cooper" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400">{[FONTE_COOPER, FONTE_NORMAS].map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a></li>)}</ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Estimativa educacional, não teste de laboratório.</p>
          </div>
        </div>
      </section>
    </>
  );
}
