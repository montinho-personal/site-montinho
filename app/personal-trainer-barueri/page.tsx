import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";

export const metadata: Metadata = {
  title: "Personal Trainer em Barueri | Montinho Personal Trainer",
  description:
    "Personal Trainer em Barueri com atendimento presencial na região de Alphaville. Treino individualizado para emagrecimento, hipertrofia e performance — com método e ciência.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-barueri`,
  },
  openGraph: {
    title: "Personal Trainer em Barueri | Montinho Personal Trainer",
    description:
      "Treino personalizado em Barueri. Protocolo construído do zero para seu objetivo, sua rotina e suas limitações. Sem ficha genérica, sem promessa vazia.",
    url: `${SITE_URL}/personal-trainer-barueri`,
  },
};

const faq = [
  {
    question: "Você atende em qual parte de Barueri?",
    answer:
      "Atendo principalmente na região de Alphaville, que pertence ao município de Barueri. Os atendimentos acontecem em academias da região, conforme a localização e preferência do aluno. Barueri tem boa cobertura de academias na área de Alphaville, Tamboré e adjacências.",
  },
  {
    question: "Personal trainer em Barueri atende em domicílio?",
    answer:
      "Dependendo da disponibilidade de espaço e equipamento, sim. Avaliamos caso a caso. O importante é que o ambiente permita executar o protocolo de forma segura e progressiva — seja em casa, em academia de condomínio ou em espaço parceiro.",
  },
  {
    question: "Quanto custa um personal trainer em Barueri?",
    answer:
      "Os valores variam conforme modalidade de atendimento (presencial, online ou híbrido), frequência semanal e duração do contrato. Entre em contato pelo WhatsApp e explico as opções disponíveis com detalhes.",
  },
  {
    question: "Você tem experiência com alunos acima de 40 anos em Barueri?",
    answer:
      "Sim, e é um perfil que trabalho muito bem. A partir dos 40 anos, o protocolo de treino precisa ser ajustado à fisiologia dessa faixa etária: mais atenção à recuperação, volume bem controlado, proteína elevada e progressão inteligente. O potencial de transformação existe — o método precisa respeitar o contexto.",
  },
  {
    question: "Você trabalha com emagrecimento em Barueri?",
    answer:
      "Emagrecimento é um dos principais objetivos dos meus alunos. O protocolo combina treino de força — que preserva músculo e mantém o metabolismo elevado — com orientações nutricionais básicas alinhadas ao objetivo. O déficit calórico controlado, associado ao treino adequado, é o que produz resultado duradouro.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-barueri`,
  name: "Montinho Personal Trainer – Barueri",
  description:
    "Personal Trainer presencial em Barueri, região de Alphaville. Atendimento individualizado para emagrecimento, hipertrofia e qualidade de vida.",
  url: `${SITE_URL}/personal-trainer-barueri`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "City", name: "Barueri" },
    { "@type": "Neighborhood", name: "Alphaville" },
    { "@type": "Neighborhood", name: "Tamboré" },
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

export default function PersonalTrainerBarueri() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Barueri · Alphaville
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal Trainer em Barueri que entrega resultado — não apenas presença.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Barueri concentra alguns dos profissionais e famílias mais exigentes da Grande São Paulo. Pessoas que pesquisam antes de decidir, que não abrem mão de qualidade e que querem entender o que estão fazendo — não apenas seguir ordens. Se esse é você, provavelmente vamos nos entender bem.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero saber mais
          </a>
        </div>
      </section>

      {/* CONTEXTO LOCAL */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Por que Barueri exige um nível diferente
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Barueri cresceu. A exigência por qualidade também.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              O município de Barueri é sede de um dos maiores polos empresariais da América Latina. A região de Alphaville, dentro de Barueri, reúne empresas, famílias e profissionais que têm acesso a praticamente qualquer serviço — e que já aprenderam, com o tempo, que preço baixo e qualidade raramente andam juntos.
            </p>
            <p>
              Moro e trabalho nessa região há mais de 20 anos. Vi Barueri evoluir em infraestrutura, em oferta de serviços, no perfil de quem escolhe morar aqui. E o que me mantém atuando na região todos esses anos não é localização — é resultado. Os alunos que chegam ficam porque o trabalho funciona.
            </p>
            <p>
              Minha trajetória na musculação nasceu de experiência própria: anos convivendo com o excesso de peso, tentativas frustradas com protocolos genéricos e, por fim, a decisão de estudar de verdade o que a ciência diz sobre composição corporal. A transformação que vivi no meu próprio corpo é o fundamento de tudo que ofereço hoje — não uma teoria que aprendi num curso, mas algo que vivi e que sei replicar com método.
            </p>
          </div>
          <div className="mt-10 relative w-full overflow-hidden" style={{ height: "400px" }}>
            <Image
              src="/Personal%20Trainer%20Barueri.jpg"
              alt="Personal Trainer Barueri"
              title="Personal Trainer Barueri"
              aria-label="Personal Trainer Barueri"
              fill
              loading="lazy"
              decoding="async"
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </div>
      </section>

      {/* MÉTODO */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            O método
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Como o treino personalizado funciona na prática
          </h2>
          <p className="text-gray-400 font-light mb-10 leading-relaxed">
            Não existe atalho inteligente — mas existe um método que elimina o desperdício de esforço. Isso é o que ofereço:
          </p>

          <div className="space-y-6">
            {[
              {
                title: "Avaliação inicial completa",
                text: "A primeira sessão é de escuta e avaliação. Entendo seu histórico, seus objetivos, sua rotina, suas restrições físicas e o que já tentou antes. Não começo a montar o protocolo antes de ter esse quadro completo.",
              },
              {
                title: "Protocolo construído para você",
                text: "Com a avaliação em mãos, monto seu programa de treino: escolha de exercícios, volume semanal, intensidade, progressão de carga e estrutura de sessão. Tudo justificado tecnicamente — e explicado em linguagem que faz sentido para você.",
              },
              {
                title: "Acompanhamento presencial com atenção total",
                text: "Durante a sessão, minha atenção é inteiramente sua. Observo execução, monitoro carga, ajusto posicionamento e corrijo padrões antes que erros virem hábito. Esse nível de atenção é o que a maioria das pessoas nunca teve — e é exatamente o que faz a diferença.",
              },
              {
                title: "Evolução documentada",
                text: "Registro a progressão em cada sessão: cargas, repetições, medidas, percepção de esforço. Isso permite decisões baseadas em dados, não em suposição — e ajustes no momento certo, antes que o progresso desacelere.",
              },
              {
                title: "Reavaliações mensais",
                text: "Todo mês, revejo o protocolo com base nos dados coletados. O que funcionou é mantido e aprofundado. O que pode ser melhorado é ajustado. O objetivo é garantir progressão contínua — não manutenção indefinida do mesmo nível.",
              },
            ].map((item, i) => (
              <div key={i} className="border-l-2 border-white/20 pl-6">
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed font-light text-sm">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10" style={{ maxWidth: "280px" }}>
            <Image
              src="/Personal%20Trainer%20Barueri%20SP.jpg"
              alt="Personal Trainer Barueri SP"
              title="Personal Trainer Barueri SP"
              aria-label="Personal Trainer Barueri SP"
              width={280}
              height={497}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* OBJETIVOS */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Objetivos que trabalho com meus alunos em Barueri
          </h2>
          <p className="text-gray-400 font-light mb-8">
            Cada pessoa chega com um ponto de partida e um objetivo diferente. Adapto o protocolo a cada um deles:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { obj: "Emagrecimento", desc: "Perda de gordura com preservação de massa muscular, usando déficit calórico controlado e treino de força como base." },
              { obj: "Hipertrofia", desc: "Ganho de massa muscular com método — progressão de carga, volume adequado e alimentação como suporte ao crescimento." },
              { obj: "Qualidade de vida", desc: "Para quem não busca performance extrema, mas quer saúde, disposição, postura e um corpo funcional a longo prazo." },
              { obj: "Reabilitação e retorno ao treino", desc: "Para quem ficou parado por lesão, cirurgia ou afastamento prolongado. Reconstrução cuidadosa da base, com segurança." },
              { obj: "Performance e força", desc: "Aumento de carga nos movimentos fundamentais, com periodização adequada e foco em progressão técnica." },
              { obj: "Treino para a meia-idade", desc: "Protocolo adaptado às mudanças fisiológicas que acontecem a partir dos 40 anos — com resultados que respeitam o corpo atual." },
            ].map((item, i) => (
              <div key={i} className="border border-white/10 p-5">
                <p className="text-white font-semibold mb-2">{item.obj}</p>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
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
            Dúvidas sobre personal trainer em Barueri
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
            Vamos conversar sobre o que você quer alcançar?
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            A primeira conversa não gera nenhum compromisso. Me conta seu objetivo, sua rotina e onde está agora — e eu te digo honestamente se posso ajudar e como.
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
              href="/resultados"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-base font-medium tracking-wide hover:border-white hover:bg-white/5 transition-all duration-200"
            >
              Ver resultados dos alunos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
