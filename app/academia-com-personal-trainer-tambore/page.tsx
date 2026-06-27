import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Academia com Personal Trainer Tamboré | Montinho Personal Trainer",
  description:
    "Personal trainer em academia de Tamboré e região. Atendimento exclusivo em academia parceira ou do aluno, com protocolo individualizado e acompanhamento real. Mais de 20 anos na região.",
  alternates: {
    canonical: `${SITE_URL}/academia-com-personal-trainer-tambore`,
  },
  openGraph: {
    title: "Academia com Personal Trainer Tamboré | Montinho Personal Trainer",
    description:
      "Treino com personal trainer em academia de Tamboré. Atenção exclusiva, protocolo individual e resultado real — sem dividir atenção com outros alunos.",
    url: `${SITE_URL}/academia-com-personal-trainer-tambore`,
  },
};

const faq = [
  {
    question: "Qual a diferença entre treinar com personal trainer em academia e treinar sozinho em Tamboré?",
    answer:
      "A diferença fundamental é a atenção e a individualização. Na academia sem personal, você executa uma ficha genérica sem ninguém corrigindo a técnica ou ajustando a carga. Com personal trainer em academia em Tamboré, cada sessão tem atenção exclusiva: execução corrigida, carga adequada, progressão estruturada e protocolo montado especificamente para você.",
  },
  {
    question: "Personal trainer em academia de Tamboré atende na academia do aluno?",
    answer:
      "Sim. Atendo na academia onde o aluno já é matriculado — desde que o espaço permita acesso ao personal externo. Quando isso não é possível, a alternativa é uma academia parceira na região de Tamboré com infraestrutura adequada. Resolvemos isso na primeira conversa.",
  },
  {
    question: "Qual academia em Tamboré tem personal trainer individualizado?",
    answer:
      "O personal trainer individualizado não depende de uma academia específica — depende do profissional. Atendo em diferentes academias de Tamboré e Alphaville, sempre com protocolo exclusivo e atenção total durante a sessão. O local é escolhido conforme a conveniência e equipamento disponível.",
  },
  {
    question: "Personal trainer em academia de Tamboré atende de quanto em quanto tempo?",
    answer:
      "O modelo mais comum é de duas a quatro sessões semanais, com duração de 50 a 60 minutos cada. A frequência ideal é definida com base no objetivo e na disponibilidade do aluno — não em um padrão fixo. Para iniciantes, três sessões semanais geralmente são suficientes para progressão consistente.",
  },
  {
    question: "Vale a pena ter personal trainer em academia de Tamboré para quem já treina há anos?",
    answer:
      "Especialmente para quem já treina há anos sem evolução — o chamado platô. Quem treina há muito tempo costuma ter vícios de execução arraigados, progressão estagnada e protocolo que já não gera adaptação. O personal trainer identifica o que precisa mudar e retoma a progressão com estímulos adequados.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/academia-com-personal-trainer-tambore`,
  name: "Montinho Personal Trainer em Academia – Tamboré",
  description:
    "Personal trainer em academia de Tamboré com atendimento exclusivo. Protocolo individualizado e progressão real.",
  url: `${SITE_URL}/academia-com-personal-trainer-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Personal Trainer em Academia",
  priceRange: "$$",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function AcademiaPersonalTrainerTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Academia · Tamboré
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Academia com personal trainer em Tamboré: atenção exclusiva, resultado diferente.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            A academia fornece o equipamento. O personal trainer garante que cada equipamento seja usado corretamente, com carga certa, na ordem certa e com a técnica que gera resultado — sem lesão.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero personal trainer em academia
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Como funciona
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que muda quando você treina em academia com personal trainer em Tamboré.
          </h2>
          <div className="grid sm:grid-cols-[1fr_auto] gap-10 items-start">
            <div className="space-y-5 text-gray-300 leading-relaxed font-light">
              <p>
                A maioria das pessoas que treina em academia em Tamboré executa a mesma ficha há meses, às vezes anos. A carga não aumenta, a técnica ninguém corrige, e o resultado estagna. É a realidade de quem treina sem orientação — não por falta de esforço, mas por falta de método.
              </p>
              <p>
                Com personal trainer em academia, o cenário muda completamente. O protocolo é montado especificamente para você — não adaptado de outro aluno. A execução é observada e corrigida em cada repetição. A carga progride de forma estruturada. E quando o corpo se adapta, o protocolo muda antes que a estagnação apareça.
              </p>
              <p>
                Atendo em academias de Tamboré e Alphaville há mais de 20 anos. Conheço os equipamentos disponíveis, as limitações de cada espaço e como tirar o máximo de cada sessão dentro do ambiente disponível.
              </p>
            </div>
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Image
                src="/Personal%20Trainer%20Tambor%C3%A9.jpg"
                alt="Academia com Personal Trainer Tamboré"
                title="Academia com Personal Trainer Tamboré"
                width={220}
                height={390}
                loading="lazy"
                decoding="async"
                className="object-cover object-top"
                style={{ width: "220px", height: "390px", maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que torna o treino em academia com personal trainer diferente em Tamboré
          </h2>
          <ul className="space-y-4 mb-10">
            {[
              "Protocolo construído do zero — não uma ficha genérica da academia",
              "Atenção exclusiva durante toda a sessão — sem atender outro aluno ao mesmo tempo",
              "Execução corrigida antes que o erro vire lesão ou hábito ruim",
              "Carga progressiva estruturada — não o peso que você acha que aguenta",
              "Escolha dos exercícios baseada na sua biomecânica, não no que está disponível",
              "Progressão mensal com reavaliação da composição corporal e ajuste de protocolo",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 font-light">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-400 font-light">
            Conheça as modalidades disponíveis na{" "}
            <Link href="/consultoria" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
              página de consultoria
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Perguntas frequentes
          </p>
          <h2
            className="text-3xl font-bold text-white mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Dúvidas sobre personal trainer em academia em Tamboré
          </h2>
          <div className="space-y-8">
            {faq.map((item, i) => (
              <div key={i} className="border-b border-white/10 pb-8">
                <h3 className="text-white font-semibold text-lg mb-3">{item.question}</h3>
                <p className="text-gray-400 leading-relaxed font-light">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            A academia está pronta. Falta o método.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Me conta em qual academia você treina ou prefere treinar em Tamboré — e organizamos o atendimento no melhor local para você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
            >
              Falar pelo WhatsApp
            </a>
            <Link
              href="/personal-trainer-tambore"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-base font-medium tracking-wide hover:border-white hover:bg-white/5 transition-all duration-200"
            >
              Saiba mais sobre o atendimento em Tamboré
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
