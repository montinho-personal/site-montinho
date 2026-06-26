import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Treinador Particular Tamboré | Montinho Personal Trainer",
  description:
    "Treinador particular em Tamboré com mais de 20 anos na região. Atendimento exclusivo, protocolo individual e resultados comprovados. Presencial, a domicílio ou online.",
  alternates: {
    canonical: `${SITE_URL}/treinador-particular-tambore`,
  },
  openGraph: {
    title: "Treinador Particular Tamboré | Montinho Personal Trainer",
    description:
      "Treinador particular em Tamboré com método baseado em ciência. Protocolo 100% individual e acompanhamento de quem conhece a região há mais de 20 anos.",
    url: `${SITE_URL}/treinador-particular-tambore`,
  },
};

const faq = [
  {
    question: "Qual a diferença entre treinador particular e personal trainer em Tamboré?",
    answer:
      "São essencialmente a mesma coisa. O termo 'treinador particular' é usado popularmente para descrever um profissional de educação física que atende de forma exclusiva e individualizada — o que corresponde exatamente à função do personal trainer. O que importa é a qualificação do profissional, o método aplicado e os resultados que entrega.",
  },
  {
    question: "Treinador particular em Tamboré atende em academia ou a domicílio?",
    answer:
      "Atendo nas duas modalidades. Em academia parceira ou do aluno em Tamboré e região, e a domicílio para quem prefere treinar em casa ou na academia do condomínio. A escolha é feita com base na sua preferência e na melhor opção para a sua rotina.",
  },
  {
    question: "Vale a pena contratar treinador particular em Tamboré?",
    answer:
      "Para quem quer resultado com eficiência — sem desperdício de tempo e sem risco de lesão — sim. O treinador particular garante que cada sessão seja produtiva, o protocolo seja adequado ao objetivo real e a progressão aconteça de forma estruturada. O custo do profissional é superado pelo valor do resultado que se obtém e do tempo que se poupa tentando acertar sozinho.",
  },
  {
    question: "Treinador particular em Tamboré é indicado para quem já treina há anos?",
    answer:
      "Especialmente para esse perfil. Quem treina há anos sem evolução geralmente está no platô — onde os estímulos já não são mais suficientes para gerar adaptação. Um treinador particular identifica o que precisa mudar, reestrutura o protocolo e retoma a progressão.",
  },
  {
    question: "Como escolher um bom treinador particular em Tamboré?",
    answer:
      "Pergunte sobre a metodologia de trabalho, entenda como os protocolos são montados e revisados, verifique resultados reais de alunos anteriores. Desconfie de quem promete resultados milagrosos em prazos irrealistas. Um bom treinador particular é transparente sobre o processo, tem resultados verificáveis e explica o raciocínio por trás de cada escolha de treino.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/treinador-particular-tambore`,
  name: "Montinho – Treinador Particular Tamboré",
  description:
    "Treinador particular em Tamboré. Atendimento exclusivo e individualizado para emagrecimento, hipertrofia e qualidade de vida.",
  url: `${SITE_URL}/treinador-particular-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Treinador Particular",
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

export default function TreinadorParticularTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Treinador Particular · Tamboré · Barueri
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Treinador particular em Tamboré: atenção exclusiva, protocolo seu.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Ter um treinador particular em Tamboré significa ter alguém que conhece o seu objetivo, entende a sua rotina e monta um protocolo que funciona para você — não para uma pessoa genérica. É a diferença entre treinar e progredir.
          </p>
          <a
            href={getWhatsAppUrl("Olá! Moro em Tamboré e tenho interesse em contratar um treinador particular.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero um treinador particular
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Minha trajetória
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Treinador que já esteve onde os alunos estão agora.
          </h2>
          <div className="grid sm:grid-cols-[1fr_auto] gap-10 items-start">
            <div className="space-y-5 text-gray-300 leading-relaxed font-light">
              <p>
                Antes de ser treinador, fui aluno frustrado. Convivi com o excesso de peso por anos, tentei métodos que prometiam resultado rápido e entregavam frustração, passei por academias onde ninguém me corrigia e fichas que eram as mesmas para todo mundo. Essa experiência — de dentro — é o que moldou minha forma de trabalhar.
              </p>
              <p>
                Quando decidi entender de fato como o corpo funciona — metabolismo, fisiologia do exercício, nutrição aplicada — tudo mudou. Esse conhecimento foi aplicado primeiro em mim mesmo, depois em alunos em Tamboré e Alphaville ao longo de mais de 20 anos. Hoje sei o que funciona, o que não funciona e por que — e essa clareza é o que ofereço para cada aluno que me contrata.
              </p>
              <p>
                Moro na região há mais de duas décadas. Conheço a rotina de Tamboré — o trânsito, os condomínios, os horários, as academias locais. Quando monto um protocolo, não estou imaginando um ambiente ideal. Estou pensando na realidade de quem vive aqui.
              </p>
            </div>
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Image
                src="/Treinador%20tambor%C3%A9.jpg"
                alt="Treinador Particular Tamboré"
                title="Treinador Particular Tamboré"
                width={220}
                height={392}
                loading="lazy"
                decoding="async"
                className="object-cover object-top"
                style={{ width: "220px", height: "390px", maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* O QUE INCLUI */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            O que inclui
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que você recebe ao contratar um treinador particular em Tamboré
          </h2>
          <div className="grid sm:grid-cols-2 gap-px border border-white/10 mt-10">
            {[
              {
                title: "Avaliação física e anamnese",
                text: "Entendimento completo de onde você está: histórico, limitações, objetivos e rotina. Base de tudo.",
              },
              {
                title: "Protocolo 100% individual",
                text: "Seu treino construído do zero. Sem base genérica, sem ficha padrão adaptada.",
              },
              {
                title: "Presença exclusiva durante as sessões",
                text: "Atenção total durante o treino — sem outros alunos, sem distrações.",
              },
              {
                title: "Correção técnica em tempo real",
                text: "Execução corrigida antes de virar hábito errado. Segurança e eficiência no mesmo movimento.",
              },
              {
                title: "Suporte pelo WhatsApp",
                text: "Canal aberto entre as sessões para dúvidas, ajustes e orientações pontuais.",
              },
              {
                title: "Reavaliação e ajuste mensal",
                text: "Revisão do protocolo todo mês com base na resposta real do seu corpo.",
              },
            ].map((item, i) => (
              <div key={i} className="p-6 border-b border-r border-white/10">
                <p className="text-white font-semibold mb-2">{item.title}</p>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-gray-400 font-light">
            Conheça todas as modalidades disponíveis na{" "}
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
            Dúvidas sobre treinador particular em Tamboré
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
            Seu próximo passo começa aqui.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            A primeira conversa é sem compromisso. Me conta o que você quer mudar — e eu te mostro como chegar lá.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl("Olá! Moro em Tamboré e quero saber mais sobre treinador particular na região.")}
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
