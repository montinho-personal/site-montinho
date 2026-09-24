import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import { PROXIMOS_SIMULADORES, SIMULADORES } from "@/lib/simuladores";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";

/**
 * /simuladores — a porta da família dos Simuladores Montinho.
 *
 * A página faz uma coisa: a pessoa escolhe pelo OBJETIVO ("quero
 * emagrecer", "quero ganhar massa") e vai. O resto explica por que um
 * simulador é diferente de uma calculadora, e o que ele se recusa a
 * prometer. Não repete o conteúdo dos simuladores: cada um compete pela
 * própria busca na própria página. Aqui ficam os termos da família
 * ("simulador fitness", "simulador de treino e dieta").
 */

const CAMINHO = "/simuladores";

export const metadata: Metadata = {
  title: "Simuladores Montinho: Emagrecimento, Massa e 12 Semanas",
  description:
    "Veja como seu peso pode evoluir nos próximos meses, compare cenários de treino e alimentação e descubra o que mais mudaria o seu resultado. Grátis.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Simuladores Montinho | Montinho Personal Trainer",
    description: "Se eu continuar assim, o que tende a acontecer? Simuladores de emagrecimento e ganho de massa, grátis e sem cadastro.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Simuladores", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Simuladores Montinho",
  url: `${SITE_URL}${CAMINHO}`,
  inLanguage: "pt-BR",
  isAccessibleForFree: true,
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: SIMULADORES.length,
    itemListElement: SIMULADORES.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.nome, url: `${SITE_URL}${s.href}` })),
  },
};

const faq: ItemFAQ[] = [
  { question: "Qual a diferença entre um simulador e uma calculadora?", answer: "A calculadora responde “quanto”: quantas calorias, quanta proteína. O simulador responde “se eu continuar assim, o que tende a acontecer?” — desenha a trajetória semana a semana, recalcula o gasto conforme o peso muda e deixa você comparar cenários (treinar mais, andar mais, ser mais consistente) para ver o que mais mudaria o seu caminho." },
  { question: "Os simuladores dizem exatamente quando vou chegar ao meu peso?", answer: "Não, e de propósito. Eles mostram uma faixa provável em semanas, nunca uma data. Corpos diferentes respondem de formas diferentes, e a balança oscila com água e glicogênio. Use por curiosidade, nunca como expectativa." },
  { question: "Preciso saber quantas calorias como para usar?", answer: "Não. Nenhum simulador obriga a saber calorias, passos, proteína ou percentual de gordura — todos têm a opção “não sei” e estimam pelo seu corpo, pela sua rotina e por como o seu peso vem se comportando." },
  { question: "Meus dados ficam salvos em algum lugar?", answer: "Não saem do seu navegador. Os cálculos acontecem no seu aparelho, as respostas ficam só enquanto a aba está aberta, e há um botão para apagar tudo. Nenhum dado de peso, saúde, medicação ou hormônio vai para o Google Analytics nem para o WhatsApp — a não ser que você marque, explicitamente, que quer mandar." },
  { question: "Em que os simuladores se baseiam?", answer: "No modelo de balanço energético dinâmico de Hall e colegas (The Lancet, 2011), que sustenta o Body Weight Planner do NIH; em estudos sobre ritmo de ganho, proteína e volume de treino; na prática de acompanhar alunos todos os dias; e em relatos comuns de quem passa pelo processo. Cada simulador mostra as fontes e a conta, em “como calculamos”." },
];

const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export default function SimuladoresPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-6 pb-10 bg-black border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Você está em" className="text-sm text-gray-500 mb-8">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className={`hover:text-white ${foco}`}>Início</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/ferramentas" className={`hover:text-white ${foco}`}>Ferramentas</Link></li>
              <li aria-hidden="true">›</li>
              <li><span className="text-gray-300" aria-current="page">Simuladores</span></li>
            </ol>
          </nav>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Simuladores Montinho · grátis · sem cadastro</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>Se você continuar assim, o que tende a acontecer?</h1>
            <p className="text-gray-300 text-lg leading-relaxed">Escolha o seu objetivo. Em cerca de 1 minuto, veja como seu peso pode evoluir nos próximos meses — e mexa em treino, rotina e consistência para descobrir o que mais mudaria o seu caminho.</p>
          </div>
        </div>
      </section>

      {/* A escolha — pelo objetivo */}
      <section className="py-10 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Escolha o seu simulador</h2>
          <div className="grid gap-4 md:grid-cols-3" data-testid="escolha">
            {SIMULADORES.map((s) => (
              <article key={s.id} className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-6 relative flex flex-col">
                <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "#BA9E50" }}>{s.nome}</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={h}>{s.pergunta}</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{s.paraQuem}</p>
                <ul className="text-gray-300 text-sm space-y-2 mb-6">
                  {s.entrega.map((e) => (
                    <li key={e} className="flex gap-2"><span aria-hidden="true" style={{ color: "#BA9E50" }}>✓</span><span>{e}</span></li>
                  ))}
                </ul>
                <Link href={s.href} className={`mt-auto inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 transition-colors ${foco}`}>
                  {s.acao} →
                </Link>
                <p className="text-gray-500 text-xs mt-2 text-center">Leva cerca de {s.tempo}. Nada sai do seu navegador.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Calculadora responde “quanto”. Simulador mostra o caminho.</h2>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="border border-white/15 p-4">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Calculadora</p>
                <p className="text-white">“Você precisa comer 2.300 kcal.”</p>
                <p className="text-gray-400 mt-2">Um número, uma vez. Não diz o que acontece depois, nem o que muda se a sua semana mudar.</p>
              </div>
              <div className="border border-[#BA9E50]/60 p-4">
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#BA9E50" }}>Simulador</p>
                <p className="text-white">“Neste cenário, você chegaria perto da meta entre 20 e 26 semanas. Andar mais mudaria isso mais do que treinar mais.”</p>
                <p className="text-gray-400 mt-2">Uma trajetória, cenários lado a lado e o ajuste de maior impacto — no seu caso.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como funcionam</h2>
            <ol className="space-y-4">
              {[
                ["Você responde algumas perguntas", "Uma por tela, com “não sei” sempre que faz sentido. Ninguém precisa saber calorias, passos ou percentual de gordura."],
                ["O simulador desenha a sua trajetória", "Semana a semana, recalculando o gasto conforme o peso muda — por isso a curva não é uma reta. Com faixa provável, nunca uma data exata."],
                ["Você mexe nos cenários", "Treino, passos, consistência, alimentação, ritmo. O gráfico muda na hora, e o simulador aponta o que mais mexe no seu caso."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="shrink-0 w-9 h-9 border border-[#BA9E50] text-white font-bold flex items-center justify-center" aria-hidden="true">{i + 1}</span>
                  <div><p className="text-white font-semibold">{t}</p><p className="text-gray-400 text-sm leading-relaxed">{d}</p></div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O que eles se recusam a prometer</h2>
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5">
              <li><strong className="text-white">Data exata.</strong> A resposta é uma faixa de semanas. Pesos são arredondados de 0,5 em 0,5 kg.</li>
              <li><strong className="text-white">Quilos de músculo.</strong> O simulador de massa projeta peso; a fatia de músculo aparece como tendência, não como número.</li>
              <li><strong className="text-white">Bônus por remédio ou hormônio.</strong> Canetas, testosterona e suplementos mudam a leitura do resultado, nunca a curva.</li>
              <li><strong className="text-white">Projeção para quem precisa de outro cuidado.</strong> Menores de 18, gestantes, metas fora da faixa de saúde e perda de peso sem explicação recebem uma orientação, não um número.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Os próximos simuladores</h2>
            <ul className="grid gap-3 sm:grid-cols-3" data-testid="proximos">
              {PROXIMOS_SIMULADORES.map((s) => (
                <li key={s.nome} className="border border-white/10 p-4">
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Em breve</p>
                  <p className="text-white font-semibold text-sm">{s.nome}</p>
                  <p className="text-gray-400 text-sm mt-1">{s.pergunta}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-l-2 pl-5" style={{ borderColor: "#BA9E50" }}>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
            {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white leading-relaxed mb-3">{t}</p>)}
            <p className="text-gray-400 text-sm">— Montinho</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="simuladores" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Procurando uma conta específica?</p>
              <Link href="/ferramentas" className={`text-gray-300 text-sm underline underline-offset-4 hover:text-white min-h-[44px] inline-flex items-center ${foco}`}>Ver todas as ferramentas →</Link>
            </div>
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Não sabe por onde começar?</p>
              <Link href="/comece" className={`text-gray-300 text-sm underline underline-offset-4 hover:text-white min-h-[44px] inline-flex items-center ${foco}`}>Seguir o caminho guiado →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
