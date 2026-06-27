import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";

export const metadata: Metadata = {
  title: "Personal Trainer em Santana de Parnaíba | Montinho Personal Trainer",
  description:
    "Personal Trainer em Santana de Parnaíba com atendimento presencial individualizado. Especialista em emagrecimento, hipertrofia e qualidade de vida para moradores da região.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-santana-de-parnaiba`,
  },
  openGraph: {
    title: "Personal Trainer em Santana de Parnaíba | Montinho Personal Trainer",
    description:
      "Treino personalizado para quem vive em Santana de Parnaíba — com método, ciência e o conhecimento de quem mora na região há mais de 20 anos.",
    url: `${SITE_URL}/personal-trainer-santana-de-parnaiba`,
  },
};

const faq = [
  {
    question: "Personal trainer atende em Santana de Parnaíba ou preciso ir até Alphaville?",
    answer:
      "Atendo em Santana de Parnaíba e na região de Alphaville, que inclui bairros e condomínios de ambos os municípios. Na prática, moradores de Tamboré, Aldeia da Serra e outras áreas de Santana de Parnaíba têm opções próximas sem precisar se deslocar até Barueri.",
  },
  {
    question: "Você tem experiência com treinamento para mulheres em Santana de Parnaíba?",
    answer:
      "Sim. Grande parte dos meus alunos em Santana de Parnaíba são mulheres, incluindo mães que conciliam rotina familiar e carreira. Adapto o treino às especificidades femininas: objetivos distintos, ciclo hormonal, disponibilidade de horário e preferências de exercício.",
  },
  {
    question: "É possível fazer treino personalizado em casa em Santana de Parnaíba?",
    answer:
      "Sim, dependendo da disponibilidade de espaço e equipamentos. Para moradores que preferem treinar em casa ou em academia de condomínio, monto protocolos adaptados ao ambiente disponível — sem abrir mão da qualidade e da progressão.",
  },
  {
    question: "Qual a diferença entre personal trainer e professor de academia em Santana de Parnaíba?",
    answer:
      "O professor de academia atende a todos os alunos do espaço. O personal trainer tem atenção 100% dedicada a você durante toda a sessão — corrige técnica, ajusta carga, monitora esforço e adapta o treino em tempo real. O resultado dessa atenção exclusiva é significativamente diferente ao longo do tempo.",
  },
  {
    question: "Quanto tempo leva para ver resultado com personal trainer em Santana de Parnaíba?",
    answer:
      "Com protocolo bem estruturado e alimentação adequada, mudanças perceptíveis na composição corporal aparecem entre 6 e 8 semanas. Transformações visíveis e consistentes ocorrem entre 3 e 6 meses. O prazo depende do ponto de partida e do grau de comprometimento fora das sessões.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-santana-de-parnaiba`,
  name: "Montinho Personal Trainer – Santana de Parnaíba",
  description:
    "Personal Trainer presencial em Santana de Parnaíba. Atendimento individualizado para emagrecimento, hipertrofia e qualidade de vida.",
  url: `${SITE_URL}/personal-trainer-santana-de-parnaiba`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "City", name: "Santana de Parnaíba" },
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "Neighborhood", name: "Aldeia da Serra" },
  ],
  serviceType: "Personal Trainer",
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

export default function PersonalTrainerSantanaDeParnaiba() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Santana de Parnaíba
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal Trainer em Santana de Parnaíba para quem quer resultado — não apenas movimento.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Santana de Parnaíba tem um jeito próprio de viver: espaço, tranquilidade e qualidade de vida. Meu trabalho é ajudar quem vive aqui a transformar essa escolha de estilo de vida em saúde e corpo real — com método, sem atalhos.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero iniciar meu treino
          </a>
        </div>
      </section>

      {/* SOBRE A REGIÃO + HISTÓRIA */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            De quem vive aqui para quem vive aqui
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Conheço Santana de Parnaíba desde quando era diferente.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base">
            <p>
              Moro na região há mais de 20 anos. Vi Santana de Parnaíba crescer, novos condomínios surgirem, a cidade ganhar infraestrutura e atrair um perfil de morador que escolheu trocar o agito de São Paulo por qualidade de vida. Entendo essa escolha porque faço a mesma todos os dias.
            </p>
            <p>
              Quem mora em Santana de Parnaíba tem uma relação diferente com o tempo. Não é a pressa de Alphaville Empresarial ou o ritmo frenético do centro de Barueri. É uma rotina que, quando bem organizada, tem espaço genuíno para cuidar do corpo — desde que haja um método que valha a pena seguir.
            </p>
            <p>
              Minha trajetória na musculação começou pela necessidade pessoal. Passei anos convivendo com o sobrepeso até entender que o problema não era falta de esforço — era falta de método. Quando aprendi a base científica do que funciona de verdade, a transformação aconteceu. Não em semanas, mas de forma real e permanente. Esse aprendizado é o que transmito hoje para os meus alunos de Santana de Parnaíba e da região.
            </p>
          </div>
          <div className="mt-10" style={{ maxWidth: "260px" }}>
            <Image
              src="/Personal%20Trainer%20Santana%20de%20Parna%C3%ADba.jpg"
              alt="Personal Trainer Santana de Parnaíba"
              title="Personal Trainer Santana de Parnaíba"
              aria-label="Personal Trainer Santana de Parnaíba"
              width={260}
              height={462}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Por que funciona diferente
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que muda quando o treino é realmente personalizado
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "Anamnese que vai fundo",
                text: "Antes de propor qualquer exercício, entendo sua rotina completa — não apenas se tem ou não lesão. Horários disponíveis, nível de energia ao longo do dia, preferências, histórico, família. O protocolo precisa caber na vida real.",
              },
              {
                title: "Nenhuma ficha copiada",
                text: "Não existe modelo que adapto. Cada protocolo começa do zero, pensado para aquela pessoa, aquele objetivo, aquele momento. Dois alunos com o mesmo objetivo podem ter programações completamente diferentes.",
              },
              {
                title: "Progressão monitorada",
                text: "Registro toda evolução: cargas, séries, medidas, percepção de esforço. Isso permite identificar quando o corpo está prestes a estagnar e ajustar antes que aconteça — não depois que o resultado parou.",
              },
              {
                title: "Técnica sem negligência",
                text: "Execução errada em movimento com carga gera lesão — é só uma questão de tempo. Corrijo padrões desde o primeiro treino, não quando a dor já apareceu. Segurança não é secundária ao resultado: ela é a condição para ele existir.",
              },
              {
                title: "Suporte entre as sessões",
                text: "O treino não termina quando você sai da academia. Estou disponível pelo WhatsApp para dúvidas, ajustes de horário, orientações sobre alimentação e qualquer coisa que afete o processo.",
              },
              {
                title: "Comunicação direta e sem jargão",
                text: "Explico o motivo de cada escolha de treino em linguagem simples. Você entende o que está fazendo e por quê — isso aumenta o engajamento e a consistência, que é o que realmente determina resultado.",
              },
            ].map((item, i) => (
              <div key={i} className="border border-white/10 p-6 hover:border-white/25 transition-colors duration-200">
                <h3 className="text-white font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 ml-auto" style={{ maxWidth: "260px" }}>
            <Image
              src="/Treinador%20Santana%20de%20Parnaiba.jpg"
              alt="Treinador Santana de Parnaiba"
              title="Treinador Santana de Parnaiba"
              aria-label="Treinador Santana de Parnaiba"
              width={260}
              height={462}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* PERFIS ATENDIDOS */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Quem são meus alunos em Santana de Parnaíba
          </h2>
          <p className="text-gray-400 font-light mb-8 leading-relaxed">
            A região tem um perfil de morador bastante específico — e meu trabalho se adapta a cada um deles:
          </p>
          <div className="space-y-4">
            {[
              {
                perfil: "Mães que voltaram ao treino",
                desc: "Conciliando filhos, casa e carreira, muitas mulheres de Santana de Parnaíba deixam o corpo em segundo plano por anos. Trabalho com a realidade de horário reduzido e corpo que mudou — sem fazer promessas que não se sustentam.",
              },
              {
                perfil: "Profissionais com rotina exigente",
                desc: "Quem trabalha em São Paulo ou em empresas da região de Alphaville chega em casa sem energia sobrando. O treino precisa ser eficiente: pouco tempo, muito resultado, sem risco de lesão que tira semanas do protocolo.",
              },
              {
                perfil: "Pessoas com mais de 40 anos",
                desc: "O metabolismo muda, os hormônios mudam, a recuperação muda. O que não muda é o potencial de transformação — desde que o protocolo respeite a fisiologia dessa faixa etária em vez de ignorá-la.",
              },
              {
                perfil: "Quem nunca treinou direito",
                desc: "Muitas pessoas chegam sem nunca ter tido acompanhamento profissional de verdade. Construir a base de forma sólida — técnica, progressão, hábito — é o trabalho mais importante que existe e o que gera os resultados mais duradouros.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 items-start border-b border-white/10 pb-5">
                <span className="flex-shrink-0 mt-1 w-2 h-2 rounded-full" style={{ background: "#BA9E50" }} />
                <div>
                  <p className="text-white font-semibold mb-1">{item.perfil}</p>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10" style={{ maxWidth: "260px" }}>
            <Image
              src="/Personal%20Trainer%20Santana%20de%20Parna%C3%ADba%20SP.jpg"
              alt="Personal Trainer Santana de Parnaíba SP"
              title="Personal Trainer Santana de Parnaíba SP"
              aria-label="Personal Trainer Santana de Parnaíba SP"
              width={260}
              height={462}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            5 Dicas para acabar com dores no lombar
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Além de acompanhar meus alunos presencialmente e online, também compartilho dicas práticas de treino, emagrecimento e hipertrofia. Assista ao vídeo abaixo para conhecer um pouco mais do meu trabalho.
          </p>
          <YoutubeShortEmbed videoId="MrfzaQWFqPs" title="5 Dicas para acabar com dores no lombar — Montinho Personal Trainer" />
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
            Dúvidas sobre personal trainer em Santana de Parnaíba
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
            A qualidade de vida de Santana de Parnaíba começa no treino.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Você escolheu morar num lugar que favorece saúde e bem-estar. Faz sentido que o treino reflita essa escolha. Me conte o que você busca — e vejo como posso ajudar.
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
              href="/minha-historia"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-base font-medium tracking-wide hover:border-white hover:bg-white/5 transition-all duration-200"
            >
              Conheça minha história
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
