import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Trainer Condomínio Tamboré | Montinho Personal Trainer",
  description:
    "Personal trainer para condomínios em Tamboré. Treino individualizado na academia do seu condomínio ou espaço fitness. Mais de 20 anos na região. Resultados reais, método comprovado.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-condominio-tambore`,
  },
  openGraph: {
    title: "Personal Trainer Condomínio Tamboré | Montinho Personal Trainer",
    description:
      "Treino personalizado na academia do seu condomínio em Tamboré. Protocolo individual e acompanhamento de quem conhece a região há mais de 20 anos.",
    url: `${SITE_URL}/personal-trainer-condominio-tambore`,
  },
};

const faq = [
  {
    question: "Personal trainer pode treinar na academia do meu condomínio em Tamboré?",
    answer:
      "Sim. A maioria dos condomínios de Tamboré permite acesso de personal trainers cadastrados. O processo de cadastro varia por condomínio — em alguns basta apresentar CREF e documentos, em outros há aprovação pelo síndico. Facilito esse processo para novos alunos.",
  },
  {
    question: "A academia do condomínio em Tamboré é suficiente para ter resultado?",
    answer:
      "Na maioria dos casos, sim. Mesmo academias de condomínio com equipamento limitado permitem treinos de força, hipertrofia e emagrecimento eficientes quando o protocolo é bem estruturado. O problema raramente é o equipamento — é a falta de método para usar o que está disponível.",
  },
  {
    question: "Quais condomínios de Tamboré você atende?",
    answer:
      "Atendo em condomínios horizontais e verticais de Tamboré, incluindo os setores 1 ao 12 e os condomínios de Alphaville e Santana de Parnaíba. O atendimento depende da estrutura disponível — conversamos sobre isso antes de fechar qualquer pacote.",
  },
  {
    question: "Personal trainer em condomínio de Tamboré atende mais de um morador ao mesmo tempo?",
    answer:
      "Não ofereço treino em grupo. Cada sessão é individual, com atenção 100% voltada para o aluno. Se houver interesse de mais de um morador, organizamos horários separados. O resultado individual depende de acompanhamento individual.",
  },
  {
    question: "Como funciona a primeira sessão em condomínio de Tamboré?",
    answer:
      "Antes da primeira sessão, fazemos uma conversa inicial para entender seu objetivo, histórico e limitações. Na visita ao condomínio, avalio o espaço disponível e montamos juntos o protocolo. A primeira sessão prática pode acontecer na mesma semana.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-condominio-tambore`,
  name: "Montinho Personal Trainer – Condomínios Tamboré",
  description:
    "Personal trainer para condomínios em Tamboré. Treino individualizado na academia do condomínio para emagrecimento, hipertrofia e condicionamento.",
  url: `${SITE_URL}/personal-trainer-condominio-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Personal Trainer em Condomínio",
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

export default function PersonalTrainerCondomínioTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Condomínio · Tamboré
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal trainer no condomínio em Tamboré: sua academia, meu método.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            A academia do seu condomínio está ali, mas o resultado não aparece. Não é por falta de equipamento — é por falta de protocolo. Com acompanhamento profissional, o que parece limitado se transforma em suficiente.
          </p>
          <a
            href={getWhatsAppUrl("Olá! Moro em condomínio de Tamboré e tenho interesse no treino personalizado na academia do condomínio.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero treinar no meu condomínio
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Tamboré e seus condomínios
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Conheço os condomínios de Tamboré como poucos profissionais conhecem.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Tamboré é formado por condomínios com perfis muito distintos: alguns horizontais com amplo espaço de lazer e academias bem equipadas, outros verticais com espaço mais compacto mas estrutura funcional. Em mais de 20 anos morando e trabalhando na região, conheci a maioria deles — e sei o que é possível realizar em cada um.
            </p>
            <p>
              Quando começo a trabalhar com um morador de condomínio de Tamboré, meu primeiro passo é entender o espaço disponível. A partir daí, monto um protocolo que usa esse espaço de forma inteligente — não genérico, não copiado da internet, não pensado para uma academia de shopping. Pensado para o que você tem ali, ao lado de casa.
            </p>
            <p>
              Minha história com musculação e com essa região se mistura. Comecei por necessidade — excesso de peso, frustração com métodos que não funcionavam — e terminei entendendo que o problema nunca foi o equipamento. Foi a falta de um profissional que transformasse o que estava disponível em resultado real. É exatamente isso que faço hoje.
            </p>
          </div>
          <div className="mt-10" style={{ maxWidth: "220px" }}>
            <Image
              src="/Treinador%20tambor%C3%A9.jpg"
              alt="Treinador Personal Condomínio Tamboré"
              title="Treinador Personal Condomínio Tamboré"
              width={220}
              height={392}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* O QUE OFEREÇO */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            O que inclui
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Acompanhamento completo na academia do seu condomínio em Tamboré
          </h2>
          <div className="grid sm:grid-cols-2 gap-px border border-white/10 mt-10">
            {[
              {
                title: "Avaliação do espaço e equipamento",
                text: "Visita ao condomínio para conhecer o que há disponível e planejar o protocolo com base na realidade do local.",
              },
              {
                title: "Protocolo 100% individual",
                text: "Seu treino construído do zero para seus objetivos, seu nível e o equipamento do seu condomínio.",
              },
              {
                title: "Presença integral durante as sessões",
                text: "Atendimento exclusivo — sem dividir atenção com outros alunos no mesmo horário.",
              },
              {
                title: "Correção técnica em tempo real",
                text: "Execução corrigida antes de virar erro permanente. Segurança e eficiência no mesmo movimento.",
              },
              {
                title: "Suporte entre sessões",
                text: "Canal aberto pelo WhatsApp para dúvidas, ajustes de horário e orientações pontuais.",
              },
              {
                title: "Reavaliação mensal",
                text: "Revisão do protocolo todo mês com base na evolução real — não em suposições.",
              },
            ].map((item, i) => (
              <div key={i} className="p-6 border-b border-r border-white/10">
                <p className="text-white font-semibold mb-2">{item.title}</p>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-gray-400 font-light">
            Conheça também a{" "}
            <Link href="/personal-trainer-tambore" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
              página de personal trainer em Tamboré
            </Link>{" "}
            para mais informações sobre o atendimento presencial na região.
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
            Dúvidas sobre personal trainer em condomínio de Tamboré
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
            A academia do seu condomínio pode te entregar mais do que entrega hoje.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Com protocolo certo e acompanhamento profissional, o que parece limitado vira suficiente. Vamos conversar?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl("Olá! Moro em condomínio de Tamboré e quero saber mais sobre o personal trainer no condomínio.")}
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
