import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import PrevisorSaoSilvestre from "@/components/sao-silvestre/PrevisorSaoSilvestre";
import { EXPOENTE_RIEGEL, MARGEM_PERCURSO, URL_PREVISOR, fmtFaixa, prever } from "@/lib/sao-silvestre";

/**
 * Previsor de tempo da São Silvestre. A página resolve exemplos em HTML
 * (5 km em 25, 30 e 35 minutos) porque o robô não digita tempo.
 */

const CAMINHO = URL_PREVISOR;

export const metadata: Metadata = {
  title: "Previsor São Silvestre 2026: Qual Seu Tempo nos 15 km?",
  description:
    "Informe seu tempo nos 5 km, 10 km ou meia e veja o tempo provável nos 15 km da São Silvestre 2026, com a subida da Brigadeiro e o que muda até 31/12.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Previsor da São Silvestre | Montinho Personal Trainer",
    description: "Seu tempo provável nos 15 km da São Silvestre, a partir do seu 5 km, 10 km ou meia.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Previsor da São Silvestre",
  descricao:
    "Projeta o tempo nos 15 km da Corrida Internacional de São Silvestre a partir de um tempo recente em 5 km, 10 km ou meia maratona, pela fórmula de Riegel, com margem para o percurso e cenários até a prova.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Previsor da São Silvestre", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const EX = [25, 30, 35].map((m) => ({ m, p: prever(m * 60, "5k") }));
const EX10 = prever(60 * 60, "10k");
const pct = (x: number) => `${Math.round(x * 100)}%`;

const faq: ItemFAQ[] = [
  {
    question: "Qual o tempo médio para correr a São Silvestre?",
    answer: `Depende do seu ritmo hoje. Quem corre 5 km em 30 minutos tende a fechar os 15 km entre ${fmtFaixa(EX[1].p.faixa)}; quem faz 10 km em 1 hora, entre ${fmtFaixa(EX10.faixa)}. O previsor faz a conta com o seu tempo.`,
  },
  {
    question: "Como o previsor calcula o tempo nos 15 km?",
    answer: `Pela fórmula de Riegel, a mais usada para converter tempo entre distâncias: o tempo novo é o tempo conhecido multiplicado pela razão das distâncias elevada a ${EXPOENTE_RIEGEL.toLocaleString("pt-BR")}. Depois somamos uma margem de ${pct(MARGEM_PERCURSO.min)} a ${pct(MARGEM_PERCURSO.max)} para a subida da Brigadeiro e a largada cheia — essa margem é estimativa nossa, não um coeficiente publicado.`,
  },
  {
    question: "Dá tempo de treinar para a São Silvestre começando agora?",
    answer: "Para quem já corre 5 km sem parar, sim: três meses bastam para chegar aos 15 km com segurança, subindo o volume aos poucos. Para quem ainda não corre, dá para completar a prova alternando corrida e caminhada — o objetivo do primeiro ano é terminar inteiro, não o tempo.",
  },
  {
    question: "A subida da Brigadeiro atrasa muito?",
    answer: "É o trecho mais duro da prova e fica na reta final, quando a perna já está cansada. Por isso o previsor mostra uma faixa acima do tempo plano. Treino de força para a perna e subidas curtas no treino são o que mais ajudam ali.",
  },
  {
    question: "O previsor serve para outras provas de 15 km?",
    answer: "A conta de Riegel serve para qualquer 15 km. A margem do percurso é a da São Silvestre; numa prova plana e com largada tranquila, o seu tempo tende a ficar perto do começo da faixa.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const th = "text-left text-gray-400 font-medium py-2.5 pr-4";

export default function PrevisorSaoSilvestrePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuito · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Previsor da São Silvestre: qual o seu tempo nos 15 km?
          </h1>
          <Compartilhar contexto="tool" titulo="Previsor da São Silvestre" caminho={CAMINHO} local="tool_top" ferramenta="sao-silvestre" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Informe um tempo recente nos 5 km, 10 km ou na meia e veja o seu tempo provável na 101ª São Silvestre,
            em 31 de dezembro — com a subida da Brigadeiro na conta.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <PrevisorSaoSilvestre />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Tempo nos 15 km pelo seu 5 km</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/15"><th className={th}>5 km em</th><th className={th}>São Silvestre (provável)</th></tr></thead>
              <tbody>
                {EX.map((e) => (
                  <tr key={e.m} className="border-b border-white/10"><td className="py-2.5 pr-4 text-gray-300">{e.m} min</td><td className="py-2.5 pr-4 text-white">{fmtFaixa(e.p.faixa)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como a conta é feita</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              A base é a fórmula de Peter Riegel, publicada em 1981 e usada até hoje pelas calculadoras de prova: o tempo
              previsto é o tempo conhecido multiplicado pela razão das distâncias elevada a {EXPOENTE_RIEGEL.toLocaleString("pt-BR")}.
              Ela acerta melhor entre 5 km e a meia maratona — exatamente onde os 15 km estão.
            </p>
            <p className="text-gray-300 leading-relaxed">
              A São Silvestre não é plana: a subida da Avenida Brigadeiro Luís Antônio vem na reta final, e a largada do
              pelotão geral é cheia. Não existe coeficiente publicado para isso, então somamos uma margem de{" "}
              {pct(MARGEM_PERCURSO.min)} a {pct(MARGEM_PERCURSO.max)} e mostramos o resultado como faixa. É estimativa
              nossa, dita com essas palavras.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-sao-silvestre" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              <li>Riegel, P. S. (1981). Athletic records and human endurance. <em>American Scientist</em>, 69(3), 285–290.</li>
              <li><a href="https://www.saosilvestre.com.br/" target="_blank" rel="noopener noreferrer" className={ln}>Site oficial da São Silvestre</a> — data, percurso e regulamento.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/inscricao-sao-silvestre-2026" className={ln}>Inscrição da São Silvestre 2026: data, preço e como se inscrever</Link></li>
              <li><Link href="/blog/corrida-para-iniciantes" className={ln}>Corrida para iniciantes: como começar sem se machucar</Link></li>
              <li><Link href="/blog/corrida-e-musculacao" className={ln}>Corrida e musculação: como combinar</Link></li>
              <li><Link href="/ferramentas/calculadora-corrida" className={ln}>Calculadora de Corrida: pace, tempo e calorias</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
