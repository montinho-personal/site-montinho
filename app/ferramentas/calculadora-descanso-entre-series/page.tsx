import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import CalculadoraDescanso from "@/components/descanso/CalculadoraDescanso";
import { FONTES_DESCANSO, calcula, fmtFaixa } from "@/lib/descanso";

/**
 * Calculadora de Descanso Entre Séries.
 *
 * Intenções (briefing do Montinho, 05/10/2026): descanso entre séries,
 * quanto descansar, tempo de descanso, hipertrofia, força, supino,
 * agachamento, "1 minuto é suficiente", "3 minutos é muito", depois da falha.
 *
 * O artigo /blog/descanso-entre-series embute a mesma calculadora e mantém
 * a própria canonical. Todos os números citados aqui saem do motor
 * (lib/descanso.ts), para a página nunca contradizer a ferramenta.
 */

const CAMINHO = "/ferramentas/calculadora-descanso-entre-series";

export const metadata: Metadata = {
  title: { absolute: "Calculadora de Descanso Entre Séries (Hipertrofia e Força)" },
  description:
    "Descubra quanto descansar entre séries de acordo com exercício, objetivo e esforço. Receba uma faixa prática e use o cronômetro no treino.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Descanso Entre Séries | Montinho",
    description: "Quanto tempo esperar antes da próxima série? Faixa prática por exercício e esforço, com cronômetro.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Descanso Entre Séries",
  descricao: "Sugere uma faixa de descanso entre séries de musculação a partir do objetivo, do exercício, das repetições e da proximidade da falha (RIR), com cronômetro.",
  caminho: CAMINHO,
  categoria: "SportsApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Descanso Entre Séries", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const F = (e: Parameters<typeof calcula>[0]) => fmtFaixa(calcula(e));
const supino = F({ objetivo: "hipertrofia", demanda: "composto_pesado", reps: "7-10", rir: 1 });
const supinoForca = F({ objetivo: "forca", demanda: "composto_pesado", reps: "1-3", rir: 1 });
const agach = F({ objetivo: "hipertrofia", demanda: "muito_exigente", reps: "7-10", rir: 1 });
const lateral = F({ objetivo: "hipertrofia", demanda: "isolador", reps: "11-15", rir: 2 });
const roscaFalha = F({ objetivo: "hipertrofia", demanda: "isolador", reps: "7-10", rir: 0 });

const faq: ItemFAQ[] = [
  { question: "Quanto descansar entre séries de supino?", answer: `Para hipertrofia, numa série de 8 repetições terminada a uma da falha, a calculadora sugere ${supino}. Para força, com 3 repetições pesadas, ${supinoForca}. O supino é composto e costuma ser feito com carga alta, por isso pede mais tempo que um isolador.` },
  { question: "Quanto descansar no agachamento?", answer: `Mais que na maioria dos exercícios: o agachamento usa muita massa muscular e cansa o corpo todo. Para hipertrofia, numa série de 8 perto da falha, ${agach}.` },
  { question: "Quanto descansar na elevação lateral?", answer: `Menos. É um isolador com carga leve: numa série de 15 com duas repetições sobrando, ${lateral} costuma bastar.` },
  { question: "1 minuto de descanso é suficiente?", answer: "Para isoladores leves e séries longe da falha, pode ser. Para compostos pesados e séries perto da falha, costuma ser pouco: a próxima série perde repetições. A revisão de Singer e colegas (2024) encontrou pequena vantagem para descansos acima de 60 segundos na hipertrofia." },
  { question: "2 minutos de descanso é bom para hipertrofia?", answer: "É um ponto de partida razoável para muitos exercícios. Mas compostos pesados e séries até a falha podem pedir mais, e isoladores leves, menos. O melhor intervalo é o que deixa você repetir a qualidade da série." },
  { question: "3 minutos de descanso é muito?", answer: "Não para compostos pesados, para força ou depois de uma série até a falha. Descansar mais não atrapalha a hipertrofia pelas evidências atuais; o custo é o treino ficar mais longo." },
  { question: "Quanto descansar depois de chegar à falha?", answer: `Um pouco mais do que numa série longe da falha. Numa rosca de 10 repetições até a falha, por exemplo, ${roscaFalha}. Quanto mais perto da falha, mais fadiga para recuperar.` },
  { question: "Descanso entre séries é o mesmo que entre exercícios?", answer: "Não. Entre séries você repete o mesmo exercício; entre exercícios você troca de movimento e, às vezes, de músculo. A faixa da calculadora serve de referência, mas o intervalo entre exercícios pode ser diferente." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function CalculadoraDescansoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Descanso Entre Séries</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>Calculadora de Descanso Entre Séries</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Informe seu objetivo, exercício e esforço para receber uma faixa prática de descanso antes da próxima série, com cronômetro para usar no treino.</p>
        </div>
      </section>

      <section className="pb-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraDescanso />
          <noscript><p className="text-gray-300 mt-4">A calculadora precisa de JavaScript. As faixas de referência estão logo abaixo.</p></noscript>
          <p className="text-gray-300 leading-relaxed mt-6 border-l-2 border-[#BA9E50] pl-4">Para hipertrofia, muitos exercícios funcionam bem com descansos de aproximadamente 1,5 a 3 minutos, mas compostos, séries muito exigentes e cargas maiores podem justificar mais. O melhor intervalo é aquele que permite preservar a qualidade das séries.</p>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Quanto descansar entre séries?</h2>
            <p>O suficiente para fazer a próxima série com carga, repetições e técnica perto do planejado. Por isso não existe um número único: o descanso depende do exercício, de quantas repetições você fez, de quão perto da falha chegou e do seu objetivo. A calculadora junta esses fatores e entrega uma faixa e um ponto de partida; quem fecha a conta é a sua própria performance na série seguinte.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Qual descanso usar para hipertrofia?</h2>
            <p>A regra de &quot;60 segundos para hipertrofia&quot; não se sustenta. A revisão com meta-análise bayesiana de Singer e colegas (2024) encontrou pequena vantagem para descansos acima de 60 segundos, com muita variação entre estudos, e não mostrou diferença clara entre descansos acima de cerca de 90 segundos. Na prática, a mesma meta pede tempos diferentes: na elevação lateral, {lateral}; no agachamento até perto da falha, {agach}.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Quanto descansar para força?</h2>
            <p>Mais. Em treino de força, o que importa é repetir a carga alta com boa técnica, e a revisão de Grgic e colegas (2018) concluiu que, para quem já treina, descansos acima de 2 minutos ajudam a maximizar os ganhos. Em compostos pesados de poucas repetições, faixas de 3 a 5 minutos são comuns. Quer saber se a carga está na zona de força? Use a <Link href="/ferramentas/calculadora-1rm" className={ln}>calculadora de 1RM</Link>.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Exercícios compostos precisam de mais descanso?</h2>
            <p>Em geral, sim. Agachamento, terra, supino e remada usam muita massa muscular e cargas maiores, e cansam mais o corpo como um todo. Isoladores como rosca, tríceps e cadeira extensora costumam tolerar intervalos menores. É uma tendência, não uma lei: uma rosca até a falha pode pedir mais que um supino leve.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Descansar mais atrapalha a hipertrofia?</h2>
            <p>Pelas evidências atuais, não. O que se perde descansando mais é tempo de treino: 20 séries com 3 minutos de intervalo somam uma hora só de descanso. Se o treino ficou longo demais, cortar séries pouco produtivas costuma funcionar melhor do que encurtar o descanso de todas. Descanso é só uma variável: veja também o seu <Link href="/ferramentas/calculadora-volume-treino" className={ln}>volume semanal</Link>, a <Link href="/blog/escala-rpe-musculacao" className={ln}>escala RPE</Link> e o artigo completo sobre <Link href="/blog/descanso-entre-series" className={ln}>descanso entre séries</Link>.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Os limites desta calculadora</h2>
            <p>As faixas vêm de regras transparentes, com direções apoiadas em revisões científicas, mas os números são aproximações: os estudos usam protocolos diferentes e as pessoas respondem de formas diferentes. Drop-set, rest-pause e circuitos têm intervalos próprios. Use o resultado como ponto de partida e ajuste pela sua performance.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-descanso" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400">{FONTES_DESCANSO.map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a></li>)}</ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville.</p>
          </div>
        </div>
      </section>
    </>
  );
}
