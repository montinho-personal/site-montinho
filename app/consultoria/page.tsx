import type { Metadata } from "next";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Consultoria e Personal Training",
  description:
    "Conheça as modalidades de atendimento: Personal Presencial em Alphaville (Barueri e Santana de Parnaíba), Consultoria Online para todo o Brasil e Modelo Híbrido.",
};

const services = [
  {
    tag: "Mais Popular",
    title: "Personal Presencial",
    subtitle: "Alphaville · Barueri · Santana de Parnaíba",
    description:
      "Acompanhamento 100% presencial com sessões de treino guiadas, correção de técnica em tempo real e total atenção às suas necessidades.",
    includes: [
      "Avaliação física completa e anamnese",
      "Treinos personalizados 100% para você",
      "Correção de técnica em tempo real",
      "Suporte via WhatsApp entre as sessões",
      "Reavaliações mensais e ajustes de protocolo",
      "Prevenção e correção de desvios posturais",
    ],
    cta: "Quero Personal Presencial",
    message:
      "Olá! Tenho interesse no Personal Presencial em Alphaville. Pode me contar mais?",
    featured: false,
  },
  {
    tag: "Online",
    title: "Consultoria Online",
    subtitle: "Em qualquer lugar do Brasil",
    description:
      "Todo o método Montinho, sem limitação geográfica. Para quem não está em Alphaville mas quer os mesmos resultados com o mesmo nível de acompanhamento.",
    includes: [
      "Anamnese completa e avaliação de histórico",
      "Treino personalizado com vídeos demonstrativos",
      "Suporte diário via WhatsApp",
      "Check-ins semanais de evolução",
      "Reavaliações e ajustes mensais",
      "Acesso a materiais exclusivos",
    ],
    cta: "Quero Consultoria Online",
    message:
      "Olá! Tenho interesse na Consultoria Online. Pode me contar mais sobre como funciona?",
    featured: true,
  },
  {
    tag: "Flexível",
    title: "Modelo Híbrido",
    subtitle: "Presencial + Online",
    description:
      "O melhor dos dois mundos. Sessões presenciais para refinamento de técnica combinadas com o suporte digital para o resto da semana.",
    includes: [
      "Sessões presenciais semanais em Alphaville",
      "Treinos complementares online",
      "Suporte via WhatsApp todos os dias",
      "Avaliações e ajustes de protocolo",
      "Flexibilidade para períodos de viagem",
      "Acesso a materiais e conteúdos exclusivos",
    ],
    cta: "Quero o Modelo Híbrido",
    message:
      "Olá! Tenho interesse no Modelo Híbrido (presencial + online). Pode me contar mais?",
    featured: false,
  },
];

const steps = [
  {
    number: "01",
    title: "Conversa Inicial Gratuita",
    description:
      "Sem compromisso. Quero entender seus objetivos, histórico e rotina antes de qualquer coisa. Esse diagnóstico é fundamental para um plano que funcione.",
  },
  {
    number: "02",
    title: "Planejamento Personalizado",
    description:
      "Com base em tudo que ouvi, crio um protocolo completo: treino periodizado, orientação nutricional e estratégias práticas para a sua realidade.",
  },
  {
    number: "03",
    title: "Acompanhamento Ativo",
    description:
      "Não sou o tipo que desaparece. Estou presente, acompanho a evolução, respondo dúvidas e faço ajustes sempre que necessário.",
  },
  {
    number: "04",
    title: "Evolução Contínua",
    description:
      "Reavaliações regulares para medir progresso, ajustar protocolos e garantir que você continua evoluindo em direção ao seu objetivo.",
  },
];

export default function Consultoria() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Consultoria & Personal Training"
            title="Escolha como quer ser acompanhado"
            subtitle="Presencial em Alphaville ou online em qualquer lugar do Brasil. O método é o mesmo, o resultado também."
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col border p-8 ${
                  service.featured
                    ? "border-white bg-white/5"
                    : "border-white/20"
                }`}
              >
                {/* Tag */}
                <div className="mb-6">
                  <span
                    className={`text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1 ${
                      service.featured
                        ? "bg-white text-black"
                        : "border border-white/30 text-gray-300"
                    }`}
                  >
                    {service.tag}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {service.title}
                </h2>
                <p className="text-gray-400 text-sm mb-5">{service.subtitle}</p>

                <p className="text-gray-300 text-sm leading-relaxed mb-8 border-b border-white/10 pb-8">
                  {service.description}
                </p>

                {/* Includes */}
                <div className="flex-1 mb-8">
                  <p className="text-white text-xs font-semibold tracking-[0.1em] uppercase mb-4">
                    O que inclui:
                  </p>
                  <ul className="space-y-3">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="text-white flex-shrink-0 mt-0.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <a
                  href={getWhatsAppUrl(service.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ${
                    service.featured
                      ? "bg-white text-black hover:bg-gray-100"
                      : "border border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  {service.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionTitle
              eyebrow="Processo"
              title="Como funciona na prática"
              subtitle="Do primeiro contato até os resultados — etapa por etapa."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <span
                    className="text-5xl font-bold text-white/15"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {step.number}
                  </span>
                </div>
                <h3
                  className="text-white font-semibold text-lg mb-3"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white text-black text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-black mb-5"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Não sabe qual modalidade escolher?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Me manda uma mensagem. Vamos conversar sobre o que faz mais sentido
            para a sua realidade.
          </p>
          <a
            href={getWhatsAppUrl("Olá! Vi as modalidades no site e não sei qual escolher. Pode me ajudar?")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-900 transition-all duration-200"
          >
            Falar com Montinho
          </a>
        </div>
      </section>
    </>
  );
}
