import type { Metadata } from "next";
import Image from "next/image";
import WhatsCta from "@/components/lp/WhatsCta";
import Etapa, { VistaDaPagina } from "@/components/consultoria/Funil";
import PonteInterna from "@/components/consultoria/PonteInterna";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import testimonials from "@/data/testimonials.json";
import FAQ from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";

/**
 * Landing Page de alta conversão para Google Ads — Consultoria Online.
 * - Sem navegação, sem links externos: único objetivo = clique no WhatsApp
 * - Header/Footer globais ocultados via CSS local
 * - Indexável: alvo orgânico distinto ("consultoria online", "personal trainer
 *   online") — não compete com /consultoria (página institucional de serviços)
 */

/**
 * As mensagens que abrem a conversa, uma por momento da página.
 *
 * Quem clica no topo ainda está entendendo o serviço; quem clica depois do
 * FAQ já leu tudo e tem uma dúvida específica. Abrir as duas conversas com o
 * mesmo texto joga fora esse contexto e obriga o Montinho a perguntar o que
 * a página já sabia.
 *
 * Nenhuma delas soa como formulário de vendedor: são frases que uma pessoa
 * escreveria de verdade.
 */
const MSG = {
  hero: "Olá, Montinho! Vi a página da Consultoria Online e queria entender se ela faz sentido para o meu caso.",
  prova: "Olá, Montinho! Vi os resultados dos seus alunos e queria entender como funcionaria comigo.",
  incluso: "Olá, Montinho! Vi o que está incluso na consultoria e queria conversar sobre o meu treino.",
  historia: "Olá, Montinho! Li a sua história e queria entender como seria o acompanhamento no meu caso.",
  garantia: "Olá, Montinho! Queria conversar sobre a Consultoria Online antes de decidir.",
  faq: "Olá, Montinho! Li a página da Consultoria Online e fiquei com uma dúvida:",
  final: "Olá, Montinho! Quero começar minha consultoria online. Podemos conversar?",
} as const;

/** O CTA da barra fixa no mobile, sempre disponível. */
const LP_MESSAGE = MSG.hero;

export const metadata: Metadata = {
  title: "Consultoria Online de Treino | Personal Trainer Online — Montinho",
  description:
    "Consultoria online com treino personalizado, vídeos de execução, ajustes mensais e suporte pelo WhatsApp. Criada por um personal trainer ex-obeso que perdeu mais de 40kg. Atendimento em todo o Brasil.",
  alternates: { canonical: "https://www.montinhopersonal.com.br/consultoria-online" },
  openGraph: {
    title: "Consultoria Online de Treino | Montinho Personal",
    description:
      "Treino online personalizado com acompanhamento real: vídeos, correções, ajustes mensais e suporte no WhatsApp. Para todo o Brasil.",
    url: "https://www.montinhopersonal.com.br/consultoria-online",
    images: ["https://www.montinhopersonal.com.br/og-image.jpg"],
  },
};

const faqLp = [
  {
    q: "Consultoria online funciona de verdade?",
    a: "Funciona quando existe acompanhamento real — e é exatamente isso que diferencia a consultoria de um treino de aplicativo. Você recebe um plano criado para o seu corpo, sua rotina e seu objetivo, envia vídeos da sua execução, recebe correções e o planejamento é ajustado conforme a sua evolução. O método é o mesmo que aplico presencialmente em Alphaville há mais de 20 anos de musculação.",
  },
  {
    q: "Você acompanha mesmo ou só manda a planilha?",
    a: "Acompanho de perto. A consultoria inclui suporte direto comigo pelo WhatsApp, análise dos seus vídeos de execução, check-ins de evolução e reavaliações periódicas. Planilha sozinha não transforma ninguém — acompanhamento transforma.",
  },
  {
    q: "Meu treino será ajustado ao longo do tempo?",
    a: "Sim. Seu corpo muda, sua rotina muda — e o treino precisa mudar junto. Os ajustes fazem parte do acompanhamento e acontecem sempre que a sua evolução pedir, além das revisões mensais programadas.",
  },
  {
    q: "E se eu tiver dúvidas durante o treino?",
    a: "Você me chama no WhatsApp. Cada exercício do seu plano vem com vídeo de execução, e quando algo não ficar claro, é só perguntar — respondo pessoalmente.",
  },
  {
    q: "Nunca treinei. A consultoria online serve para mim?",
    a: "Sim. O plano parte do seu nível atual, com exercícios adequados à sua experiência e vídeos demonstrativos de cada movimento. Iniciantes são um dos públicos que mais evoluem com acompanhamento, porque aprendem a treinar corretamente desde o início.",
  },
  {
    q: "Já tentei de tudo e nada funcionou. Por que seria diferente?",
    a: "Eu também já achei que nada funcionava — comecei e desisti várias vezes antes de perder mais de 40kg. O que mudou não foi força de vontade: foi método. Um plano feito para a sua realidade, com alguém acompanhando e ajustando, é muito diferente de tentar sozinho com fórmulas genéricas.",
  },
  {
    q: "Tenho pouco tempo. Consigo seguir o plano?",
    a: "O plano é montado dentro do tempo que você tem — não do tempo ideal de revista. Se você tem 3 sessões de 45 minutos por semana, a estratégia é criada para render o máximo nesse espaço.",
  },
  {
    q: "Não gosto de academia. Posso treinar em casa ou no condomínio?",
    a: "Pode. O treino é desenhado para a estrutura que você tem disponível: academia, espaço fitness do condomínio ou a sua própria casa, com ou sem equipamentos.",
  },
  {
    q: "Tenho dores ou limitações. Posso participar?",
    a: "Sim. Tenho cursos voltados para treinamento de pessoas com dores e limitações, e o plano é adaptado à sua condição. Treinar com segurança é a base do método — e, muitas vezes, o treino bem orientado ajuda a reduzir as próprias limitações.",
  },
  {
    q: "Quanto custa a consultoria online?",
    a: "O valor depende do plano de acompanhamento ideal para o seu objetivo e da duração do compromisso. Na primeira conversa pelo WhatsApp eu entendo o que você busca e te passo uma proposta clara, sem compromisso. Em geral, a consultoria online custa uma fração do valor de um personal presencial — com acompanhamento contínuo a semana inteira, não só na hora da aula.",
  },
  {
    q: "Viajo muito a trabalho. O acompanhamento continua?",
    a: "Continua — essa é uma das maiores vantagens do formato online. O plano se adapta à academia do hotel, ao peso do corpo ou à estrutura que você tiver, e o suporte pelo WhatsApp vai junto com você para qualquer lugar.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqLp.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Consultoria Online de Treino Personalizado",
  serviceType: "Consultoria online de musculação e emagrecimento",
  description:
    "Consultoria online com treino personalizado, vídeos de execução, correções, ajustes mensais e suporte via WhatsApp, para emagrecimento, hipertrofia e condicionamento físico.",
  provider: { "@id": "https://www.montinhopersonal.com.br/#localbusiness" },
  areaServed: { "@type": "Country", name: "Brasil" },
  url: "https://www.montinhopersonal.com.br/consultoria-online",
};

function Stars() {
  return (
    <span className="text-[#FBBC04] tracking-tight" aria-label="5 estrelas">
      ★★★★★
    </span>
  );
}

function Cta({ label, sub, em }: { label: string; sub?: string; em: keyof typeof MSG }) {
  return <WhatsCta label={label} message={MSG[em]} sub={sub} posicao={em} />;
}

export default function ConsultoriaOnlineLP() {
  const reviews = (testimonials.reviews as { name: string; text: string; stars: number }[]).slice(0, 3);

  return (
    <>
      {/* Oculta navegação global: LP sem saídas */}
      {/*
        LP sem saídas de navegação. O botão flutuante global também sai: no
        celular ele fica no canto inferior direito, exatamente sobre a barra
        fixa desta página — dois botões de WhatsApp empilhados, um deles
        cobrindo o outro, e com mensagens diferentes. Aqui quem manda é a
        barra da página, que carrega a mensagem contextual.
      */}
      <style>{`header, footer, a[aria-label="Fale conosco pelo WhatsApp"] { display: none !important; } main { padding-top: 0 !important; }`}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <VistaDaPagina />

      <div className="bg-black text-white">
        {/* ───────────────────────── 1. HERO ───────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#BA9E50] mb-5">
                Consultoria Online · Todo o Brasil
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.08] mb-6"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                Consultoria online com treino personalizado — criada por quem já{" "}
                <span className="text-[#BA9E50]">perdeu 40kg</span>.
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-4 max-w-lg">
                A consultoria online não é uma planilha genérica. É um{" "}
                <strong className="text-white">acompanhamento completo</strong>: treino
                montado para a sua realidade, vídeos de execução, correções e ajustes
                conforme a sua evolução — com suporte direto pelo WhatsApp.
              </p>
              <p className="text-gray-300 text-sm mb-8">
                Para quem quer <strong className="text-gray-200">emagrecer ou ganhar massa muscular</strong>{" "}
                treinando em casa, no condomínio, na academia ou em viagem — em qualquer lugar do Brasil.
              </p>
              {/*
                O CTA do topo pede a MENOR decisão possível.
                
                "Quero minha consultoria" é um pedido de compra feito a quem
                está na página há cinco segundos e ainda não sabe o que está
                comprando. "Entender como funciona" é o passo que a pessoa
                está disposta a dar agora — e leva ao mesmo WhatsApp.
              */}
              <Cta
                em="hero"
                label="Quero entender como funciona"
                sub="Você conversa comigo antes de decidir qualquer coisa"
              />
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-6 text-sm text-gray-300 max-w-lg">
                <li className="flex items-center gap-2">⭐ <span><strong className="text-white">5.0</strong> · {testimonials.totalReviews} avaliações de alunos</span></li>
                <li className="flex items-center gap-2">💪 Ex-obeso que perdeu mais de 40kg</li>
                <li className="flex items-center gap-2">📲 Suporte direto no WhatsApp</li>
                <li className="flex items-center gap-2">🔄 Ajustes conforme sua evolução</li>
              </ul>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <figure className="relative aspect-square rounded-3xl overflow-hidden border border-[#BA9E50]/30 shadow-2xl">
                <Image
                  src="/antes-depois-montinho-personal-trainer.jpg"
                  alt="Antes e depois do Montinho: a própria transformação de mais de 40kg"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-[#BA9E50] text-black text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  Minha própria transformação
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-14 pb-5 px-5 text-center">
                  <p className="text-white font-bold text-lg leading-snug" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
                    A mesma pessoa. <span className="text-[#BA9E50]">40kg de diferença.</span>
                  </p>
                  <p className="text-gray-300 text-sm mt-1">
                    O método que me tirou dali é o que vou aplicar em você.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/*
          ───────────────── 1B. IDENTIFICAÇÃO ─────────────────
          
          A página ia do hero direto para a prova social — mostrava o
          resultado de outra pessoa antes de reconhecer o problema de quem
          está lendo. Prova convence quem já se sentiu compreendido; para
          quem não se sentiu, é só a foto de um desconhecido magro.
          
          São situações, não uma lista de dores. E nenhuma delas é
          sensacionalista: é o que a pessoa realmente pensa antes de procurar
          um profissional.
        */}
        <Etapa evento="consultoria_etapa_proposta">
          <section className="py-16 border-t border-white/10">
            <div className="max-w-4xl mx-auto px-5 sm:px-8">
              <h2 className="text-center text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
                Se você se reconhecer aqui, a consultoria foi feita para isso
              </h2>
              <p className="text-center text-gray-300 mb-10 max-w-2xl mx-auto">
                Nenhuma dessas situações é falta de esforço. Todas elas são falta de
                alguém olhando o seu caso.
              </p>
              <ul className="grid sm:grid-cols-2 gap-4">
                {[
                  "Você treina, mas não sabe dizer se o seu treino faz sentido para o seu objetivo.",
                  "Troca de exercício com frequência e nunca sabe se era hora de trocar.",
                  "Não sabe quando aumentar a carga — então mantém a mesma há meses.",
                  "Já começou na academia várias vezes e não conseguiu manter.",
                  "Emagreceu e agora quer preservar músculo, não só continuar perdendo peso.",
                  "Está voltando a treinar depois de anos parado e não sabe por onde recomeçar.",
                  "Segue um treino pronto da internet sem saber se ele serve para você.",
                  "Treina sozinho e sente falta de alguém dizendo se está certo.",
                ].map((t) => (
                  <li key={t} className="flex gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4">
                    <span className="text-[#BA9E50] shrink-0" aria-hidden>—</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{t}</p>
                  </li>
                ))}
              </ul>
              <p className="text-center text-gray-300 mt-8 max-w-2xl mx-auto">
                O que falta nesses casos quase nunca é disciplina.{" "}
                <strong className="text-white">É direção</strong> — e alguém acompanhando
                para corrigir a rota quando ela sai do lugar.
              </p>
            </div>
          </section>
        </Etapa>

        {/* ───────────────────── 2. PROVA SOCIAL ───────────────────── */}
        <Etapa evento="consultoria_etapa_prova">
        <section id="resultados" className="scroll-mt-24 lg:scroll-mt-28 py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Resultados reais, de pessoas reais
            </h2>
            <p className="text-center text-gray-300 mb-10 max-w-2xl mx-auto">
              Antes de decidir, veja o que aconteceu com quem parou de tentar sozinho
              e passou a treinar com estratégia, acompanhamento e constância.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12 text-center">
              {[["-40kg", "na própria pele"], ["20+", "anos de musculação"], ["5.0 ★", `${testimonials.totalReviews} avaliações Google`]].map(([n, d]) => (
                <div key={n} className="border border-white/10 rounded-2xl py-5 px-2 bg-black/40">
                  <p className="text-[#BA9E50] text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>{n}</p>
                  <p className="text-gray-300 text-xs mt-1">{d}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
              {[
                {
                  src: "/antes-depois-montinho-personal-trainer-2.jpg",
                  alt: "Antes e depois da Adriana: 20kg eliminados com o acompanhamento do Montinho",
                  name: "Adriana",
                  kg: "−20kg",
                  frase: "Anos tentando sozinha. 8 meses com estratégia.",
                },
                {
                  src: "/antes-depois-montinho-personal-trainer-4.jpg",
                  alt: "Antes e depois da Elisa: 20kg eliminados com o acompanhamento do Montinho",
                  name: "Elisa",
                  kg: "−20kg",
                  frase: "Sem viver em função da academia. Só com o plano certo.",
                },
              ].map((a) => (
                <figure key={a.src} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10">
                  <Image src={a.src} alt={a.alt} fill loading="lazy" sizes="(max-width: 640px) 90vw, 400px" className="object-cover" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent pt-12 pb-4 px-4 text-center">
                    <p className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
                      {a.name} · <span className="text-[#BA9E50]">{a.kg}</span>
                    </p>
                    <p className="text-gray-300 text-xs mt-0.5">{a.frase}</p>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {reviews.map((r) => (
                <figure key={r.name} className="bg-black border border-white/10 rounded-2xl p-7 flex flex-col">
                  <Stars />
                  <blockquote className="text-gray-300 text-sm leading-relaxed italic flex-1 my-4">
                    &ldquo;{r.text.length > 220 ? r.text.slice(0, 217).trimEnd() + "…" : r.text}&rdquo;
                  </blockquote>
                  <figcaption className="text-sm">
                    <span className="text-white font-semibold">{r.name}</span>
                    <span className="text-gray-400"> · Avaliação no Google</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            {/*
              A única saída da página, e ela existe por um motivo: quem ainda
              duvida da prova precisa poder conferir mais, e obrigá-lo a
              decidir sem conferir custa mais conversão do que a saída custa.
              Fica DEPOIS do CTA, não antes — quem já se convenceu clica no
              verde e nunca vê o link.
            */}
            <Cta em="prova" label="Quero um plano assim para mim" />
            <PonteInterna
              href="/resultados"
              evento="consultoria_resultados_click"
              texto="Ver mais transformações de alunos"
            />
          </div>
        </section>
        </Etapa>

        {/* ───────────────────── 3. OBJEÇÃO CENTRAL: ONLINE FUNCIONA? ───────────────────── */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              &ldquo;Mas consultoria online funciona?&rdquo;
            </h2>
            <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
              Funciona — quando não é só uma planilha. A diferença está no
              acompanhamento. Veja como o formato online mantém a mesma proximidade
              do presencial:
            </p>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                ["🎥", "Você vê como executar", "Cada exercício do seu plano vem com vídeo demonstrativo. Nada de adivinhar movimento."],
                ["📲", "Eu vejo como você executa", "Você grava sua execução, eu analiso e corrijo. É assim que o treino online fica seguro e eficiente."],
                ["🔄", "O plano evolui com você", "Check-ins de evolução e ajustes mensais — ou antes, sempre que a sua evolução pedir."],
              ].map(([icon, t, d]) => (
                <div key={t} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center">
                  <span className="text-3xl">{icon}</span>
                  <h3 className="text-white font-bold mt-3 mb-2">{t}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-300 mt-10 max-w-2xl mx-auto">
              O treino online personalizado é o mesmo método que aplico presencialmente
              em Alphaville — <strong className="text-white">sem limitação geográfica e
              se adaptando à sua rotina</strong>, não o contrário.
            </p>
          </div>
        </section>

        {/* ───────────────────── 4. O QUE VOCÊ RECEBE ───────────────────── */}
        <section id="o-que-inclui" className="scroll-mt-24 lg:scroll-mt-28 py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Tudo o que está incluso na sua consultoria
            </h2>
            <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
              Não é um treino avulso. É uma estratégia completa de transformação,
              acompanhada de perto do início ao fim.
            </p>
            <ul className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                ["Treino 100% personalizado", "Montado para o seu objetivo, seu nível, sua estrutura e o tempo que você realmente tem."],
                ["Vídeos de execução", "Cada exercício com demonstração em vídeo para você treinar com confiança."],
                ["Correções da sua execução", "Você envia seus vídeos, eu analiso e corrijo — como se estivesse ao seu lado."],
                ["Suporte direto no WhatsApp", "Dúvida no meio do treino? Me chama. Quem responde sou eu."],
                ["Check-ins de evolução", "Acompanhamento periódico do seu progresso para manter o plano no rumo certo."],
                ["Reavaliações e ajustes mensais", "Seu corpo evolui — seu treino evolui junto. Sem plano parado no tempo."],
                ["Estratégia completa", "Treino, progressão de carga, recuperação e construção de hábito — tudo conectado ao seu objetivo."],
                ["Plano individualizado de verdade", "Nada de template: duas pessoas nunca recebem o mesmo plano."],
              ].map(([t, d]) => (
                <li key={t} className="bg-black/40 border border-white/10 rounded-xl px-5 py-4">
                  <p className="text-white font-semibold text-sm mb-1">
                    <span className="text-[#25D366] mr-2">✔</span>{t}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">{d}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Cta em="incluso" label="Quero conversar sobre o meu treino" />
            </div>
          </div>
        </section>

        {/* ───────────────────── 5. COMO FUNCIONA ───────────────────── */}
        <Etapa evento="consultoria_etapa_metodo">
        <section id="como-funciona" className="scroll-mt-24 lg:scroll-mt-28 py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Como funciona a consultoria online
            </h2>
            <ol className="grid sm:grid-cols-5 gap-4 text-center">
              {[
                ["1", "Conversa inicial", "Você me chama no WhatsApp e eu entendo sua rotina, objetivos e histórico."],
                ["2", "Anamnese e avaliação", "Levanto seu ponto de partida: experiência, estrutura disponível, limitações e preferências."],
                ["3", "Seu plano chega", "Treino personalizado com vídeos de execução, pronto para começar onde você estiver."],
                ["4", "Acompanhamento", "Correções, check-ins e suporte pelo WhatsApp durante toda a jornada."],
                ["5", "Ajustes e evolução", "Reavaliações mensais e ajustes conforme seu progresso — até o resultado que você busca."],
              ].map(([n, t, d]) => (
                <li key={n} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#BA9E50] text-black font-bold mb-3">{n}</span>
                  <h3 className="text-white font-bold mb-1">{t}</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">{d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <Cta em="incluso" label="Dar o primeiro passo agora" sub="Leva 2 minutos. Sem compromisso." />
            </div>
          </div>
        </section>
        </Etapa>

        {/* ───────────────────── 6. HISTÓRIA / AUTORIDADE ───────────────────── */}
        <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              <figure>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
                  <Image src="/foto-historia-4.jpg" alt="Montinho antes: mais de 40kg acima do peso" fill loading="lazy" sizes="(max-width: 768px) 45vw, 170px" className="object-cover" />
                </div>
                <figcaption className="text-center text-gray-400 text-xs mt-2 uppercase tracking-wider">Antes</figcaption>
              </figure>
              <figure>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#BA9E50]/40">
                  <Image src="/foto-hoje-praia.jpg" alt="Montinho hoje: em forma, personal trainer e consultor online" fill loading="lazy" sizes="(max-width: 768px) 45vw, 170px" className="object-cover" />
                </div>
                <figcaption className="text-center text-[#BA9E50] text-xs mt-2 uppercase tracking-wider">Hoje</figcaption>
              </figure>
            </div>
            <div className="md:col-span-3">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
                Eu não aprendi isso em livro. Eu vivi.
              </h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                Já fui obeso. Passei pelo efeito sanfona, comecei e desisti várias
                vezes, achei que nunca conseguiria mudar. Até entender que o problema
                não era falta de força de vontade —{" "}
                <strong className="text-white">era falta de um método</strong>.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Perdi <strong className="text-white">mais de 40kg</strong> e transformei essa
                experiência em profissão: são mais de{" "}
                <strong className="text-white">20 anos de musculação</strong>, com cursos e
                especializações em treinamento — inclusive para pessoas com dores e
                limitações — e um método refinado e validado na prática, aluno a aluno.
              </p>
              <p className="text-[#BA9E50] font-semibold italic mb-8">
                &ldquo;Quem só estudou o caminho te explica o mapa. Quem percorreu, te
                guia pelos atalhos.&rdquo;
              </p>
              <Cta em="historia" label="Quero esse acompanhamento comigo" />
              <PonteInterna
                href="/minha-historia"
                evento="consultoria_historia_click"
                texto="Ler a história completa"
                alinhamento="left"
              />
            </div>
          </div>
        </section>

        {/* ───────────────────── 7. COMPARATIVO ───────────────────── */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Por que essa consultoria é diferente?
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-white/10 rounded-2xl p-7 bg-black/40">
                <h3 className="text-gray-300 font-bold uppercase text-xs tracking-[0.15em] mb-5" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Apps e planilhas genéricas</h3>
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li>❌ O mesmo treino para milhares de pessoas</li>
                  <li>❌ Ninguém vê se você executa certo</li>
                  <li>❌ Dúvida fica sem resposta</li>
                  <li>❌ Plano parado no tempo</li>
                </ul>
              </div>
              <div className="border border-[#BA9E50]/50 rounded-2xl p-7 bg-[#BA9E50]/[0.06] shadow-[0_0_40px_rgba(186,158,80,0.08)]">
                <h3 className="text-[#BA9E50] font-bold uppercase text-xs tracking-[0.15em] mb-5" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Consultoria Montinho</h3>
                <ul className="space-y-3 text-gray-200 text-sm">
                  <li>✅ Plano criado exclusivamente para você</li>
                  <li>✅ Correções da sua execução por vídeo</li>
                  <li>✅ Suporte direto comigo no WhatsApp</li>
                  <li>✅ Ajustes conforme a sua evolução</li>
                  <li>✅ Estratégia guiada por quem já viveu a transformação</li>
                </ul>
              </div>
            </div>
            <div className="mt-10">
              <Cta em="garantia" label="Quero a Consultoria Montinho" />
            </div>
          </div>
        </section>

        {/* ───────────────────── 8. PARA QUEM É / NÃO É ───────────────────── */}
        <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Essa consultoria é para você?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-white/10 rounded-2xl p-7 bg-black/40">
                <h3 className="text-white font-bold mb-5">É para você que:</h3>
                <ul className="space-y-3 text-gray-200 text-sm">
                  {[
                    "Quer emagrecer ou ganhar massa muscular com um plano sério.",
                    "Já tentou dietas e treinos por conta própria e não manteve o resultado.",
                    "Tem rotina corrida, viaja ou mora longe de um bom personal.",
                    "Prefere treinar em casa, no condomínio ou na sua academia.",
                    "Quer atendimento personalizado — não fórmula de aplicativo.",
                    "Está disposto a seguir uma estratégia com constância.",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="text-[#25D366] font-bold mt-0.5">✔</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-white/10 rounded-2xl p-7 bg-black/40">
                <h3 className="text-gray-300 font-bold mb-5">Não é para você que:</h3>
                <ul className="space-y-3 text-gray-400 text-sm">
                  {[
                    "Procura fórmula mágica ou resultado sem esforço.",
                    "Quer apenas receber uma planilha e sumir.",
                    "Não pretende dar retorno sobre a própria evolução.",
                    "Busca promessas milagrosas de 30 dias.",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="font-bold mt-0.5">✕</span>{t}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-300 text-sm mt-6 leading-relaxed">
                  Prefiro ser honesto agora do que te decepcionar depois: transformação
                  real exige método <em>e</em> participação. Eu cuido do método — e caminho
                  com você no resto.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────── 9. GARANTIA ───────────────────── */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <span className="text-4xl">🛡️</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-4" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Comece sem risco
            </h2>
            <p className="text-gray-300 leading-relaxed max-w-xl mx-auto mb-2">
              A primeira conversa não custa nada — você explica seu objetivo, eu
              explico como posso te ajudar, e só então você decide.
            </p>
            <p className="text-gray-300 text-sm max-w-xl mx-auto mb-8">
              E se contratar e se arrepender nos primeiros 7 dias, seu investimento é
              devolvido — conforme o direito de arrependimento previsto no Código de
              Defesa do Consumidor. Sem burocracia e sem constrangimento.
            </p>
            <Cta em="garantia" label="Começar sem compromisso" sub="Primeira conversa gratuita pelo WhatsApp" />
          </div>
        </section>

        {/* ───────────────────── 10. FAQ ───────────────────── */}
        <Etapa evento="consultoria_etapa_objecoes">
        <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Suas dúvidas, respondidas
            </h2>
            <div className="space-y-3">
              <FAQ itens={faqLp.map((f) => ({ question: f.q, answer: f.a }))} placement="consultoria-online" />
            </div>
            <div className="mt-10">
              <Cta em="faq" label="Tirar minha dúvida no WhatsApp" sub="Respondo pessoalmente, sem robô" />
            </div>
          </div>
        </section>
        </Etapa>

        {/* ───────────────────── 11. CTA FINAL ───────────────────── */}
        <section id="contato" className="scroll-mt-24 lg:scroll-mt-28 py-20 border-t border-white/10 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
            <div className="relative w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-2 border-[#BA9E50]">
              <Image src="/montinho-personal-trainer-shape.jpg" alt="Montinho Personal Trainer" fill loading="lazy" sizes="128px" className="object-cover" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              A distância nunca foi<br className="hidden sm:block" /> o seu problema.
            </h2>
            <p className="text-gray-300 text-lg mb-4 max-w-xl mx-auto">
              O que sempre faltou foi um plano feito para a sua vida — e alguém
              acompanhando de verdade. Eu sei porque já estive exatamente onde você
              está agora.
            </p>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Me mande uma mensagem. Vamos entender seus objetivos e descobrir a
              melhor estratégia para a transformação que você deseja — onde quer que
              você esteja.
            </p>
            <p className="text-gray-400 text-sm mb-10">
              Atendo um número limitado de alunos em acompanhamento por vez — é o
              que mantém as correções e o suporte realmente próximos.
            </p>
            <Cta
              em="final"
              label="Quero começar minha consultoria"
              sub="Respondo pessoalmente — geralmente em poucos minutos"
            />
            {/* Compartilhar fica DEPOIS do CTA e visualmente mais fraco: a
                ação primária desta página é falar comigo. Quem quer mostrar
                para o marido, a esposa ou um amigo antes de decidir também
                precisa de um caminho — só que não na frente do outro. */}
            <div className="mt-10 flex justify-center">
              <Compartilhar
                contexto="commercial"
                titulo="Consultoria Online com o Montinho"
                caminho="/consultoria-online"
                local="commercial_page"
                aparencia="discreto"
                rotulo="Enviar esta página para alguém"
              />
            </div>
            <p className="text-gray-400 text-xs mt-12">
              Montinho Personal Trainer · Consultoria Online para todo o Brasil
            </p>
          </div>
        </section>

        {/* CTA fixo no mobile: WhatsApp sempre a um toque de distância */}
        <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-black/90 backdrop-blur border-t border-white/10 px-4 py-3">
          <a
            href={getWhatsAppUrl(LP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-black font-bold text-base py-3.5 rounded-xl shadow-[0_4px_20px_rgba(37,211,102,0.35)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Falar no WhatsApp agora
          </a>
        </div>
        {/* Espaço para a barra fixa não cobrir o rodapé da página no mobile */}
        <div className="h-20 lg:hidden" aria-hidden />
      </div>
    </>
  );
}
