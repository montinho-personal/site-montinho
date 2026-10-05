import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import CalculadoraGordura from "@/components/gordura/CalculadoraGordura";
import { FAIXAS, FONTES_GORDURA, SITIOS_3, SITIOS_7, faixaDe } from "@/lib/percentual-gordura";

/**
 * Calculadora de Percentual de Gordura (fita e dobras).
 *
 * Pesquisa (05/10/2026): "calcular percentual de gordura" pede 7 dobras,
 * com medidas, 3 dobras, online, marinha americana, circunferência,
 * adipômetro, pescoço e cintura. PAA: quanto é 20% / 15% de gordura, 23% é
 * muito?, como calcular com 7 dobras, onde medir, 4 dobras. Relacionadas:
 * tabela feminino, masculino, como medir em casa, app.
 *
 * A Composição Corporal (bioimpedância → kg) continua sendo a página de quem
 * já tem o número; esta é a de quem precisa estimá-lo. As faixas são as
 * mesmas nas duas.
 */

const CAMINHO = "/ferramentas/calculadora-percentual-de-gordura";

export const metadata: Metadata = {
  title: { absolute: "Calculadora de Percentual de Gordura: Fita Métrica e Dobras" },
  description:
    "Calcule seu percentual de gordura em casa com fita métrica (método da Marinha) ou com adipômetro (3 e 7 dobras). Com tabela masculina e feminina e como medir.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Percentual de Gordura | Montinho",
    description: "Fita métrica ou adipômetro: estime seu percentual de gordura e veja em que faixa você está.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Percentual de Gordura",
  descricao: "Estima o percentual de gordura corporal pela fita métrica (equação da Marinha dos EUA) ou por dobras cutâneas (Jackson e Pollock, 3 e 7 dobras, com Siri).",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Percentual de Gordura", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const nomeFaixa = (pct: number, s: "homem" | "mulher") => faixaDe(pct, s).nome.toLowerCase();
const faq: ItemFAQ[] = [
  { question: "Como calcular o percentual de gordura em casa?", answer: "Com uma fita métrica, pelo método da Marinha dos EUA: homens medem altura, pescoço e cintura no umbigo; mulheres medem também o quadril. A calculadora desta página faz a conta. O erro médio é de 3 a 4 pontos percentuais." },
  { question: "Quanto é 20% de gordura corporal?", answer: `Para um homem, 20% está na ${nomeFaixa(20, "homem")}; para uma mulher, na ${nomeFaixa(20, "mulher")}. Em quilos, 20% de quem pesa 80 kg são 16 kg de gordura.` },
  { question: "Quanto é 15% de gordura corporal?", answer: `Num homem, 15% está na ${nomeFaixa(15, "homem")}: saudável e possível de manter sem viver em restrição. Numa mulher, 15% fica na ${nomeFaixa(15, "mulher")}, que exige controle contínuo para se manter.` },
  { question: "23% de gordura corporal é muito?", answer: `Depende do sexo. Para mulher, 23% está na ${nomeFaixa(23, "mulher")}. Para homem, 23% já fica ${nomeFaixa(23, "homem")}, e reduzir traz ganho de saúde.` },
  { question: "Como calcular o percentual de gordura com 7 dobras?", answer: `Some as sete dobras em milímetros (${SITIOS_7.join(", ").toLowerCase()}) e aplique a equação de Jackson e Pollock, que dá a densidade do corpo; a equação de Siri transforma a densidade em percentual. A calculadora faz as duas contas.` },
  { question: "Quais são as 3 dobras?", answer: `Para homens: ${SITIOS_3.homem.join(", ").toLowerCase()}. Para mulheres: ${SITIOS_3.mulher.join(", ").toLowerCase()}. É o protocolo de 3 dobras de Jackson e Pollock.` },
  { question: "E o protocolo de 4 dobras?", answer: "O de 4 dobras (como o de Durnin e Womersley) usa outros pontos e outra equação. Esta calculadora faz 3 e 7 dobras de Jackson e Pollock, os mais usados em academia. Se o seu avaliador usa 4 dobras, peça o resultado a ele." },
  { question: "Onde medir para calcular o percentual de gordura?", answer: "Na fita: pescoço logo abaixo do gogó, cintura no umbigo (homens) ou na parte mais fina (mulheres) e quadril na parte mais larga. Nas dobras: sempre do lado direito, pinçando só a pele e a gordura, sem o músculo." },
  { question: "Fita, dobras ou bioimpedância: qual é melhor?", answer: "Nenhuma é exata. Dobras feitas por alguém experiente costumam ser as mais precisas das três; a fita é a mais fácil de repetir sozinho; a balança de bioimpedância varia com a água do corpo. O mais útil é escolher um método e repetir sempre do mesmo jeito para ver a tendência." },
  { question: "Qual é o percentual de gordura ideal?", answer: "Para saúde, homens costumam ficar bem entre 10% e 20% e mulheres entre 18% e 28%. Abaixo disso é faixa de atleta, que exige muito controle para manter. O ideal para você depende do que você quer fazer com o corpo." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const intervalo = (k: number, s: "homem" | "mulher") => {
  const ate = FAIXAS[k].ate[s];
  const de = k ? FAIXAS[k - 1].ate[s] : 0;
  if (k === 0) return `até ${ate}%`;
  if (ate >= 100) return `acima de ${de}%`;
  return `${de}% a ${ate}%`;
};

export default function CalculadoraGorduraPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Percentual de Gordura</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>Calculadora de Percentual de Gordura</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Estime seu percentual de gordura em casa com uma fita métrica, ou com as dobras do adipômetro da sua avaliação física, e veja em que faixa você está.</p>
        </div>
      </section>

      <section className="pb-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraGordura />
          <noscript><p className="text-gray-300 mt-4">A calculadora precisa de JavaScript. As tabelas estão logo abaixo.</p></noscript>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Tabela de percentual de gordura masculino e feminino</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-white/15">
                <thead><tr className="text-left text-white bg-white/5"><th className="p-3">Faixa</th><th className="p-3">Homens</th><th className="p-3">Mulheres</th></tr></thead>
                <tbody>{FAIXAS.map((f, k) => <tr key={f.id} className="border-t border-white/10"><td className="p-3">{f.nome}</td><td className="p-3 whitespace-nowrap">{intervalo(k, "homem")}</td><td className="p-3 whitespace-nowrap">{intervalo(k, "mulher")}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="text-sm text-gray-400 mt-3">As mesmas faixas da <Link href="/ferramentas/composicao-corporal" className={ln}>calculadora de composição corporal</Link>. Mulheres têm mais gordura essencial, ligada a hormônios e reprodução, por isso as faixas delas são mais altas. Faixa é régua de leitura, não meta.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como medir o percentual de gordura com fita métrica</h2>
            <p className="mb-3">É o método da Marinha dos EUA, criado em 1984 para avaliar militares sem laboratório. Use uma fita de costura que não estique, em pé, sem roupa no local:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Pescoço:</strong> logo abaixo do gogó, olhando para a frente.</li>
              <li><strong className="text-white">Cintura (homens):</strong> na altura do umbigo, depois de soltar o ar, sem encolher a barriga.</li>
              <li><strong className="text-white">Cintura (mulheres):</strong> na parte mais fina, um pouco acima do umbigo.</li>
              <li><strong className="text-white">Quadril (só mulheres):</strong> na parte mais larga do bumbum, com os pés juntos.</li>
            </ul>
            <p className="mt-3">Meça duas vezes e use a média. A fita firme encosta na pele sem apertar.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como calcular com 3 ou 7 dobras (adipômetro)</h2>
            <p className="mb-3">As dobras vêm da sua avaliação física. A conta usa as equações de Jackson e Pollock, que estimam a densidade do corpo, e a de Siri, que transforma densidade em percentual.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">3 dobras, homens:</strong> {SITIOS_3.homem.join(", ").toLowerCase()}.</li>
              <li><strong className="text-white">3 dobras, mulheres:</strong> {SITIOS_3.mulher.join(", ").toLowerCase()}.</li>
              <li><strong className="text-white">7 dobras:</strong> {SITIOS_7.join(", ").toLowerCase()}.</li>
            </ul>
            <p className="mt-3">O adipômetro depende muito de quem mede. Para acompanhar a evolução, faça com a mesma pessoa e o mesmo aparelho.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Fita, dobras ou bioimpedância?</h2>
            <p>Nenhum método de campo mede gordura de verdade: todos estimam. A fita é a mais fácil de repetir sozinho; as dobras, feitas por alguém experiente, costumam ser mais precisas; a bioimpedância muda com a água do corpo, a comida e o treino do dia. Se a balança já te deu um percentual, a <Link href="/ferramentas/composicao-corporal" className={ln}>calculadora de composição corporal</Link> mostra quanto disso é gordura e quanto é massa magra em quilos. Para uma leitura simples de gordura na barriga, use a <Link href="/ferramentas/relacao-cintura-altura" className={ln}>relação cintura-altura</Link>.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-percentual-gordura" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400">{FONTES_GORDURA.map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a></li>)}</ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Estimativa educacional, não avaliação física.</p>
          </div>
        </div>
      </section>
    </>
  );
}
