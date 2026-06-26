import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Trainer Feminino Tamboré | Montinho Personal Trainer",
  description:
    "Personal trainer feminino em Tamboré especializado em emagrecimento, definição e qualidade de vida para mulheres. Mais de 20 anos na região. Protocolo individual, resultado real.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-feminino-tambore`,
  },
  openGraph: {
    title: "Personal Trainer Feminino Tamboré | Montinho Personal Trainer",
    description:
      "Treino personalizado para mulheres em Tamboré. Protocolo que respeita as especificidades do corpo feminino e entrega resultado sustentável.",
    url: `${SITE_URL}/personal-trainer-feminino-tambore`,
  },
};

const faq = [
  {
    question: "Personal trainer masculino pode atender mulheres em Tamboré?",
    answer:
      "Sim. A maioria das minhas alunas em Tamboré e Alphaville são mulheres. O que importa no atendimento feminino é o conhecimento sobre as especificidades hormonais, as diferenças de composição corporal entre homens e mulheres, e a escuta ativa para entender o que cada aluna realmente quer mudar. O gênero do profissional é irrelevante — o método e a atenção são o que diferencia.",
  },
  {
    question: "Treino com personal feminino em Tamboré deixa a mulher muito musculosa?",
    answer:
      "Não. O ganho excessivo de massa muscular em mulheres é fisiologicamente limitado pela quantidade de testosterona disponível — significativamente menor que nos homens. O treino de força para mulheres produz definição, tônus e melhora postural — não volume desproporcional. O protocolo é montado para o objetivo de cada aluna.",
  },
  {
    question: "Personal trainer feminino em Tamboré atende mulheres grávidas ou no pós-parto?",
    answer:
      "Atendo mulheres no pós-parto com protocolo adaptado, com foco em reabilitação do assoalho pélvico, fortalecimento progressivo e retorno gradual à atividade. Para gestantes, o acompanhamento depende da fase da gestação e do aval médico — e sempre trabalho em conjunto com as orientações do obstetra.",
  },
  {
    question: "Qual o melhor treino para mulheres que querem emagrecer em Tamboré?",
    answer:
      "A combinação mais eficaz para emagrecimento feminino é treino de força associado a déficit calórico moderado. O treino de força preserva massa muscular durante o emagrecimento — o que mantém o metabolismo ativo e evita o efeito sanfona. Cardio é um complemento, não a base.",
  },
  {
    question: "Personal trainer feminino em Tamboré atende também online?",
    answer:
      "Sim. Ofereço modalidade híbrida — sessões presenciais em Tamboré combinadas com suporte online nos dias sem sessão — e também acompanhamento 100% online para quem tem agenda mais imprevisível. Veja as opções em detalhes na página de consultoria.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-feminino-tambore`,
  name: "Montinho Personal Trainer – Atendimento Feminino Tamboré",
  description:
    "Personal trainer feminino em Tamboré. Treino individualizado para mulheres com foco em emagrecimento, definição e qualidade de vida.",
  url: `${SITE_URL}/personal-trainer-feminino-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Personal Trainer Feminino",
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

export default function PersonalTrainerFemininoTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Feminino · Tamboré
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal trainer feminino em Tamboré: treino que entende o corpo feminino.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Mulheres em Tamboré que buscam resultado de verdade — não apenas treino — encontram aqui um método que respeita as especificidades hormonais, a rotina real e os objetivos de cada uma.
          </p>
          <a
            href={getWhatsAppUrl("Olá! Moro em Tamboré e tenho interesse no treino personalizado feminino.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero começar o treino
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Método e experiência
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            A maioria das minhas alunas em Tamboré já tentou de tudo antes.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Dieta restritiva que funcionou por três semanas. Personal anterior que dava a mesma ficha para todo mundo. App de treino que ignorava as fases do ciclo menstrual. Grupo na academia onde ninguém corrigia nada. Essa é a história que ouço com mais frequência das mulheres que chegam até mim em Tamboré — e é exatamente o que o meu trabalho se propõe a resolver.
            </p>
            <p>
              O corpo feminino responde ao treino de forma diferente do masculino. Hormônios, composição corporal, variação metabólica ao longo do ciclo — tudo isso influencia como o protocolo deve ser montado e ajustado. Ignorar essas variáveis é o motivo pelo qual tantos treinos genéricos não funcionam para mulheres.
            </p>
            <p>
              Moro e trabalho em Tamboré e Alphaville há mais de 20 anos. Ao longo desse tempo, a maioria das alunas que acompanhei eram mulheres com rotina exigente — mães, profissionais, empreendedoras — que precisavam de resultado real com o tempo que tinham disponível. É para esse perfil que meu método foi desenvolvido.
            </p>
          </div>
          <div className="mt-10" style={{ maxWidth: "220px" }}>
            <Image
              src="/Personal%20Trainer%20Tambor%C3%A9.jpg"
              alt="Personal Trainer Feminino Tamboré"
              title="Personal Trainer Feminino Tamboré"
              width={220}
              height={476}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que o treino feminino com acompanhamento muda na prática
          </h2>
          <p className="text-gray-400 font-light mb-10 leading-relaxed">
            Resultado que aparece e se mantém não acontece por acaso. Acontece quando o protocolo foi pensado para você:
          </p>
          <ul className="space-y-4 mb-10">
            {[
              "Emagrecimento com preservação de massa muscular — sem efeito sanfona",
              "Definição muscular progressiva, sem volume excessivo",
              "Melhora postural e redução de dores crônicas (lombar, cervical, joelho)",
              "Mais disposição no dia a dia — resultado que vai além da estética",
              "Protocolo ajustado às fases do ciclo menstrual quando relevante",
              "Progressão mensurável — você sabe exatamente o quanto evoluiu",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 font-light">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-400 font-light">
            Veja os resultados de alunas reais na{" "}
            <Link href="/resultados" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
              página de resultados
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
            Dúvidas sobre personal trainer feminino em Tamboré
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
            Pronta para começar em Tamboré?
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            A primeira conversa é sem compromisso. Me conta o que você quer mudar — e eu te mostro o caminho mais eficiente para chegar lá.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl("Olá! Moro em Tamboré e quero saber mais sobre o treino personalizado feminino.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
            >
              Falar pelo WhatsApp
            </a>
            <Link
              href="/consultoria"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-base font-medium tracking-wide hover:border-white hover:bg-white/5 transition-all duration-200"
            >
              Ver modalidades de atendimento
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
