import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Trainer a Domicílio Tamboré | Montinho Personal Trainer",
  description:
    "Personal trainer a domicílio em Tamboré com atendimento individualizado na sua casa, condomínio ou academia particular. Mais de 20 anos na região. Treino de força, emagrecimento e hipertrofia.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-a-domicilio-tambore`,
  },
  openGraph: {
    title: "Personal Trainer a Domicílio Tamboré | Montinho Personal Trainer",
    description:
      "Treino personalizado na sua casa em Tamboré. Protocolo individual, progressão real e acompanhamento de quem vive na região há mais de 20 anos.",
    url: `${SITE_URL}/personal-trainer-a-domicilio-tambore`,
  },
};

const faq = [
  {
    question: "Personal trainer a domicílio em Tamboré precisa de academia em casa?",
    answer:
      "Não necessariamente. Com halteres ajustáveis, faixas elásticas, TRX e o peso do próprio corpo, é possível montar protocolos completos e progressivos sem academia. O equipamento ideal é avaliado na visita inicial — e adaptamos o treino ao que você já tem disponível.",
  },
  {
    question: "O atendimento a domicílio em Tamboré tem custo maior que o presencial em academia?",
    answer:
      "O investimento pode variar conforme a distância e a estrutura disponível. Na maioria dos casos em Tamboré e condomínios vizinhos, o deslocamento está incluído no pacote. O valor é alinhado na primeira conversa, sem surpresas depois.",
  },
  {
    question: "Qual a frequência ideal de treino com personal a domicílio em Tamboré?",
    answer:
      "Para a maioria dos objetivos — emagrecimento, hipertrofia ou condicionamento geral — três sessões semanais de 50 a 60 minutos são suficientes para progressão consistente. Ajustamos a frequência conforme sua disponibilidade real, não a ideal no papel.",
  },
  {
    question: "Personal trainer a domicílio atende em condomínios fechados de Tamboré?",
    answer:
      "Sim. Atendo em condomínios horizontais e verticais de Tamboré, Alphaville e região. Basta autorização de entrada no porteiro — o restante fica por minha conta.",
  },
  {
    question: "Como começar o treino a domicílio em Tamboré?",
    answer:
      "O primeiro contato é pelo WhatsApp. Conversamos sobre objetivo, rotina e estrutura disponível. Depois agendamos uma visita inicial gratuita para avaliar o espaço e definir o protocolo. A primeira sessão começa em até uma semana após esse contato.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-a-domicilio-tambore`,
  name: "Montinho Personal Trainer – Atendimento a Domicílio Tamboré",
  description:
    "Personal trainer a domicílio em Tamboré. Treino individualizado na sua casa ou condomínio para emagrecimento, hipertrofia e qualidade de vida.",
  url: `${SITE_URL}/personal-trainer-a-domicilio-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Personal Trainer a Domicílio",
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

export default function PersonalTrainerDomicilioTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · A Domicílio · Tamboré
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal trainer a domicílio em Tamboré: o treino vai até você.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Para quem mora em Tamboré e prefere treinar sem sair de casa — sem trânsito, sem espera por equipamento, sem hora marcada em outro lugar. O protocolo chega até você, e os resultados ficam.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero treinar em casa
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Por que a domicílio funciona
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Tamboré tem espaço para treinar bem. Basta saber usar.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Muitos condomínios de Tamboré têm academia própria — às vezes subutilizada, às vezes com equipamento que ninguém sabe usar direito. Outros moradores preferem o espaço da própria casa: a sala, o jardim, a varanda. Qualquer um desses ambientes pode ser um espaço de treino eficiente quando há protocolo e orientação profissional.
            </p>
            <p>
              Vivo na região há mais de 20 anos e já atendi alunos nos mais variados contextos domiciliares de Tamboré e Alphaville. Sei o que é possível fazer com o que cada espaço oferece — e sei o que compensar quando o equipamento é limitado. O treino não precisa de academia cara para ser eficiente. Precisa de método.
            </p>
            <p>
              Minha trajetória começa com a mesma insatisfação que muitos dos meus alunos trazem: anos tentando emagrecer sem resultado sustentável. Quando passei a entender como o corpo realmente funciona — metabolismo, estímulo de força, progressão de carga — tudo mudou. É essa compreensão que levo para cada atendimento a domicílio, independente do espaço disponível.
            </p>
          </div>
          <div className="mt-10" style={{ maxWidth: "220px" }}>
            <Image
              src="/Personal%20Trainer%20Tambor%C3%A9.jpg"
              alt="Personal Trainer a Domicílio Tamboré"
              title="Personal Trainer a Domicílio Tamboré"
              width={220}
              height={476}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Como funciona
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Treino a domicílio em Tamboré: do primeiro contato à primeira sessão
          </h2>
          <p className="text-gray-400 leading-relaxed font-light mb-10">
            O processo é simples e rápido. Não existe burocracia entre a decisão de começar e o primeiro treino.
          </p>

          <div className="space-y-8">
            {[
              {
                num: "01",
                title: "Conversa inicial pelo WhatsApp",
                text: "Me conta seu objetivo, sua rotina e o que você tem disponível em casa. Com isso já consigo dar um panorama do que é possível fazer antes mesmo da visita.",
              },
              {
                num: "02",
                title: "Visita de avaliação no seu espaço",
                text: "Vou até você, conheço o ambiente, avalio o equipamento disponível e faço a anamnese completa. Essa visita é o ponto de partida do protocolo — e já acontece sem compromisso financeiro.",
              },
              {
                num: "03",
                title: "Protocolo montado para o seu espaço",
                text: "Depois da avaliação, monto um protocolo que usa o que você tem de forma inteligente. Se for necessário complementar com algum equipamento básico, oriento o que comprar sem exagero.",
              },
              {
                num: "04",
                title: "Sessões presenciais na sua casa ou condomínio",
                text: "Chego no horário, treino com atenção total ao aluno e corrijo a execução em tempo real. Sem distrações, sem outros alunos dividindo atenção.",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-6 items-start">
                <span className="text-2xl font-bold flex-shrink-0 mt-1" style={{ color: "#BA9E50" }}>
                  {step.num}
                </span>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Para quem o treino a domicílio em Tamboré faz mais sentido
          </h2>
          <p className="text-gray-400 font-light mb-10 leading-relaxed">
            O atendimento a domicílio resolve problemas reais de quem tem rotina exigente ou preferência por privacidade:
          </p>
          <ul className="space-y-4 mb-10">
            {[
              "Quem tem filhos pequenos e não consegue sair de casa em horários fixos",
              "Quem trabalha em home office e quer aproveitar a janela entre reuniões",
              "Quem tem mobilidade reduzida ou condição de saúde que dificulta deslocamento",
              "Quem prefere a privacidade do ambiente doméstico para treinar",
              "Quem mora em condomínio com academia própria mas não sabe como usá-la de forma eficiente",
              "Quem viaja com frequência e precisa de um protocolo adaptável a diferentes ambientes",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 font-light">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-400 font-light">
            Para conhecer todas as modalidades de atendimento disponíveis, acesse a{" "}
            <Link href="/consultoria" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
              página de consultoria
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Perguntas frequentes
          </p>
          <h2
            className="text-3xl font-bold text-white mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Dúvidas sobre personal trainer a domicílio em Tamboré
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
            O treino vem até você em Tamboré.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Sem precisar sair de casa, sem esperar equipamento, sem compromisso de academia. Me conta o que você quer mudar — e a gente começa.
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
