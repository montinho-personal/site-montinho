import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";
import FAQ from "@/components/ui/FAQ";

export const metadata: Metadata = {
  title: { absolute: "Personal Trainer Tamboré | Montinho Personal Trainer" },
  description:
    "Personal Trainer no Tamboré com atendimento individualizado e presencial. Treino de força, emagrecimento e qualidade de vida para moradores da região de Tamboré e Alphaville.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-tambore`,
  },
  openGraph: {
    title: "Personal Trainer Tamboré | Montinho Personal Trainer",
    description:
      "Treino personalizado no coração de Tamboré. Protocolo individual, progressão real e o acompanhamento de quem vive e trabalha na região há mais de 20 anos.",
    url: `${SITE_URL}/personal-trainer-tambore`,
  },
};

const faq = [
  {
    question: "Personal trainer atende dentro dos condomínios de Tamboré?",
    answer:
      "Sim. Boa parte dos residenciais de Tamboré — do Tamboré 1 ao 11 e condomínios vizinhos — conta com espaço fitness próprio ou áreas comuns adequadas ao treino. Também atendo na própria residência do aluno ou em academias próximas ao condomínio. Avaliamos a estrutura disponível antes de definir o local mais adequado para as sessões.",
  },
  {
    question: "Quanto custa um personal trainer no Tamboré?",
    answer:
      "O valor depende do formato (residência, espaço fitness do condomínio ou academia), da frequência semanal e do nível de acompanhamento. Como cada protocolo é individual, prefiro conversar primeiro sobre o seu objetivo e a sua rotina para apresentar uma proposta justa — sem tabela genérica. É só chamar no WhatsApp.",
  },
  {
    question: "Quantas vezes por semana devo treinar para ter resultado?",
    answer:
      "Para a maioria dos alunos, 2 a 4 sessões semanais bem periodizadas são suficientes para evoluir força, composição corporal e condicionamento físico. Os primeiros sinais aparecem nas primeiras semanas; mudanças consistentes de percentual de gordura e massa muscular costumam se consolidar entre 3 e 6 meses de constância.",
  },
  {
    question: "Atende iniciantes e pessoas acima dos 60 anos no Tamboré?",
    answer:
      "Sim, e com frequência. Para iniciantes, o foco inicial é técnica, mobilidade e construção de hábito. Para alunos mais velhos, o treino prioriza força, equilíbrio, postura e autonomia — sempre com progressão de carga respeitando o ponto de partida de cada um.",
  },
  {
    question: "Qual a diferença entre personal trainer no Tamboré e em Alphaville?",
    answer:
      "Na prática, a diferença está na localização do aluno — o trabalho e o método são os mesmos. Tamboré é um bairro residencial de Barueri e Santana de Parnaíba com perfil familiar e calmo. Atendo em ambas as regiões, sempre escolhendo o local mais conveniente para o aluno.",
  },
  {
    question: "Você tem experiência com treino para quem tem restrições físicas no Tamboré?",
    answer:
      "Sim. Trabalho frequentemente com alunos que têm histórico de lombalgia, problemas no joelho, hérnia de disco, tendinites e outras condições que limitam certos movimentos. O protocolo é adaptado para contornar as restrições, mantendo progressão e resultado dentro do que é seguro para cada caso.",
  },
  {
    question: "Personal trainer no Tamboré funciona para quem tem pouco tempo disponível?",
    answer:
      "Funciona justamente para esse perfil. Treino eficiente com acompanhamento profissional produz mais resultado em 3 sessões semanais bem estruturadas do que em 5 sessões sem método. A questão não é quanto tempo você tem — é o que fazemos com o tempo disponível.",
  },
  {
    question: "Você também oferece consultoria online para quem viaja muito?",
    answer:
      "Sim. Muitos moradores de Tamboré alternam presencial e online por causa de viagens de trabalho. A consultoria online mantém protocolo individualizado, ajustes periódicos e suporte pelo WhatsApp — e pode ser combinada com sessões presenciais quando você está em casa.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-tambore`,
  name: "Montinho Personal Trainer – Tamboré",
  description:
    "Personal Trainer presencial no Tamboré, Barueri e Santana de Parnaíba. Treino individualizado para emagrecimento, hipertrofia e qualidade de vida.",
  url: `${SITE_URL}/personal-trainer-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
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

export default function PersonalTrainerTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Tamboré · Barueri · Santana de Parnaíba
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Personal Trainer no Tamboré: treino que cabe na rotina de quem mora aqui.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Tamboré é uma região de condomínios de alto padrão entre Barueri e Santana de Parnaíba, vizinha imediata de Alphaville — com ritmo próprio, mais tranquilo e familiar. Meu trabalho respeita esse contexto: treino na sua residência, no espaço fitness do condomínio ou em academia próxima, com acompanhamento próximo e a atenção que quem vive aqui valoriza.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero começar a treinar
          </a>
        </div>
      </section>

      {/* SOBRE TAMBORÉ + HISTÓRIA */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Vizinhança e método
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Tamboré tem um jeito de viver. O treino precisa acompanhar isso.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Quem mora no Tamboré não escolheu esse bairro por acaso. Escolheu pelo ambiente familiar, pela escala humana do lugar, pela sensação de comunidade que pouco outros bairros da Grande São Paulo oferecem. É um ritmo que tem valor — e que merece ser preservado numa rotina de treino que não vira um fardo.
            </p>
            <p>
              Sou da região há mais de 20 anos. Conheço os condomínios, as academias, as ruas, os horários de pico. Quando monto um protocolo para um morador de Tamboré, não estou imaginando um ambiente genérico — estou pensando na realidade local: academia de condomínio com equipamento limitado, horário de treino espremido entre a saída dos filhos para a escola e o início do expediente, o almoço em casa que é uma oportunidade de comer bem.
            </p>
            <p>
              A região dos Residenciais Tamboré 1 a 11 se estende entre Barueri e Santana de Parnaíba, colada em Alphaville, com o Shopping Tamboré como referência de todo mundo que circula por aqui. É um dos endereços de mais alto padrão da Grande São Paulo — e um dos que mais concentram alunos meus. O deslocamento curto entre os residenciais me permite atender em horários que realmente cabem na sua agenda.
            </p>
            <p>
              Comecei na musculação pela mesma razão que muitos dos meus alunos hoje: insatisfação com o próprio corpo e uma longa sequência de métodos que prometiam muito e entregavam frustração. Fui obeso, perdi mais de 40kg — conto essa trajetória em{" "}
              <Link href="/minha-historia" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                minha história
              </Link>
              . O que mudou foi quando parei de buscar atalho e passei a entender de fato como o corpo funciona. Essa virada foi o começo do meu trabalho como personal trainer — e, somada a mais de 20 anos de musculação, cursos e especializações em treinamento, é o que guia cada protocolo que monto até hoje.
            </p>
            <h3 className="text-white font-semibold text-lg pt-2">Onde acontecem as sessões no Tamboré</h3>
            <p>
              O formato se adapta à sua realidade de condomínio fechado: treino na sua residência (com ou sem equipamentos), no espaço fitness do próprio condomínio ou em academias próximas aos residenciais. Em todos os casos, o protocolo contempla musculação, treinamento funcional, mobilidade e condicionamento físico — a estrutura disponível muda a ferramenta, não a qualidade do trabalho.
            </p>
            <p>
              Tenho conteúdo dedicado a vários residenciais da região — como o{" "}
              <Link href="/blog/personal-trainer-tambore-1" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                Tamboré 1
              </Link>{" "}
              e as{" "}
              <Link href="/blog/personal-trainer-quintas-de-tambore" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                Quintas de Tamboré
              </Link>
              . Se você mora em outro condomínio da região, o atendimento funciona da mesma forma.
            </p>
          </div>
          <div className="mt-10" style={{ maxWidth: "220px" }}>
            <Image
              src="/Personal%20Trainer%20Tambor%C3%A9.jpg"
              alt="Personal Trainer Tamboré"
              title="Personal Trainer Tamboré"
              aria-label="Personal Trainer Tamboré"
              width={220}
              height={476}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* O QUE OFEREÇO */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            O que você recebe
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Acompanhamento presencial no Tamboré: tudo que está incluso
          </h2>
          <p className="text-gray-300 font-light mb-10 leading-relaxed">
            Não vendo sessões avulsas sem contexto. Ofereço acompanhamento — que é diferente de apenas treinar junto:
          </p>

          <div className="grid sm:grid-cols-2 gap-px border border-white/10">
            {[
              {
                icon: "→",
                title: "Avaliação física e anamnese detalhada",
                text: "Antes de qualquer treino: entender quem você é, o que você já fez, o que não funcionou e por que.",
              },
              {
                icon: "→",
                title: "Protocolo 100% individual",
                text: "Sem modelo base. O seu treino começa do zero, pensado para seus objetivos, suas limitações e seu ritmo de vida.",
              },
              {
                icon: "→",
                title: "Presença real durante as sessões",
                text: "Estou ao lado durante todo o treino — não ao telefone nem atendendo outro aluno simultaneamente.",
              },
              {
                icon: "→",
                title: "Correção técnica contínua",
                text: "Erro de execução corrigido antes de virar hábito. Segurança e eficiência no mesmo movimento.",
              },
              {
                icon: "→",
                title: "Suporte pelo WhatsApp",
                text: "Dúvidas fora das sessões, ajustes de horário, orientações pontuais — canal aberto entre as sessões.",
              },
              {
                icon: "→",
                title: "Reavaliação e ajuste mensal",
                text: "Todo mês revejo o protocolo com base no progresso real. O que está bom, ampliamos. O que pode melhorar, ajustamos.",
              },
            ].map((item, i) => (
              <div key={i} className="p-6 border-b border-r border-white/10">
                <p className="text-white font-semibold mb-2">{item.title}</p>
                <p className="text-gray-300 text-sm leading-relaxed font-light">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 relative w-full overflow-hidden" style={{ height: "380px" }}>
            <Image
              src="/Treinador%20tambor%C3%A9.jpg"
              alt="Treinador tamboré"
              title="Treinador tamboré"
              aria-label="Treinador tamboré"
              fill
              loading="lazy"
              decoding="async"
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </div>
      </section>

      {/* DORES E LIMITAÇÕES */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Treino com segurança
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Dores e limitações não precisam te afastar do treino
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Uma parte importante dos meus alunos no Tamboré chega com alguma dor ou limitação musculoesquelética: lombar que trava, joelho que reclama na escada, ombro que impede certos movimentos. Fiz cursos voltados especificamente para o treinamento de pessoas com dores e limitações — e, ao longo da minha própria trajetória de treinos, também vivenciei várias dessas dores. Sei, na prática, o quanto elas minam a motivação.
            </p>
            <p>
              Minha metodologia une conhecimento técnico, experiência prática e acompanhamento individualizado para que você treine com segurança e eficiência. Em vez de excluir o treino, adaptamos: seleção de exercícios, amplitude, progressão de carga e trabalho de mobilidade e postura entram no protocolo para fortalecer o que precisa ser fortalecido e prevenir novas lesões. É um método refinado e validado na prática ao longo do atendimento de alunos.
            </p>
            <p>
              Se esse é o seu caso, dois conteúdos podem ajudar antes mesmo da primeira conversa:{" "}
              <Link href="/blog/dor-lombar-na-musculacao" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                dor lombar na musculação
              </Link>{" "}
              e{" "}
              <Link href="/blog/treino-funcional-para-idosos" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                treino funcional para idosos
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* OBJETIVOS E REGIÃO */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Objetivos e região
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Do emagrecimento à hipertrofia: o que os moradores de Tamboré buscam
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Os objetivos mais comuns por aqui são emagrecimento e melhora da composição corporal, hipertrofia, ganho de força e resistência, correção de postura e mais qualidade de vida no dia a dia. Tudo começa com uma avaliação física — medidas, percentual de gordura, histórico e limitações — e vira um protocolo com periodização clara, reavaliado mês a mês. Sem promessa milagrosa: prazos realistas, progressão consistente e recuperação muscular respeitada.
            </p>
            <p>
              Dois conteúdos que costumo indicar já na primeira conversa:{" "}
              <Link href="/blog/por-que-voce-nao-consegue-emagrecer" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                por que você não consegue emagrecer
              </Link>{" "}
              e{" "}
              <Link href="/blog/como-ganhar-massa-muscular" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                como ganhar massa muscular
              </Link>
              .
            </p>
            <p>
              E como Tamboré fica no meio do caminho de tudo, também atendo nas regiões vizinhas:{" "}
              <Link href="/personal-trainer-alphaville" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                Alphaville
              </Link>
              ,{" "}
              <Link href="/personal-trainer-barueri" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                Barueri
              </Link>{" "}
              e{" "}
              <Link href="/personal-trainer-santana-de-parnaiba" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                Santana de Parnaíba
              </Link>
              . Se preferir entender o formato do acompanhamento antes, veja a página de{" "}
              <Link href="/consultoria" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                consultoria
              </Link>{" "}
              ou fale comigo pela página de{" "}
              <Link href="/contato" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                contato
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ÁREA DE ATENDIMENTO */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Área de atendimento
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Onde atendo no Tamboré e como chego até você
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Minha área de atendimento cobre todos os residenciais do Tamboré — tanto o trecho de Barueri quanto o de Santana de Parnaíba — além de Alphaville e dos bairros vizinhos. As principais vias que uso no dia a dia são a Avenida Piracema, a Avenida Marcos Penteado de Ulhôa Rodrigues (Tamboré/Alphaville) e a Alameda Rio Negro, com a Rodovia Castello Branco como eixo de ligação rápida para quem vem do centro de Barueri ou de São Paulo. O Shopping Tamboré funciona como referência central: praticamente todos os condomínios estão a poucos minutos dele.
            </p>
            <p>
              Na prática, os tempos de deslocamento são curtos: cerca de 5 a 10 minutos de carro entre Tamboré e Alphaville, e algo entre 10 e 15 minutos até o centro de Barueri, dependendo do trânsito. Santana de Parnaíba (região do Tamboré 10 e 11) também fica a poucos minutos pelas vias internas. Isso me permite montar uma agenda realista, sem atrasos por deslocamento — e permite ao aluno treinar em horários que outros bairros da Grande São Paulo não comportariam.
            </p>
          </div>
        </div>
      </section>

      {/* CONDOMÍNIOS ATENDIDOS */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Condomínios atendidos
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Atendimento em todos os residenciais do Tamboré
          </h2>
          <p className="text-gray-300 leading-relaxed font-light mb-8">
            Cada residencial tem estrutura e perfil próprios — alguns com espaço fitness completo, outros em que o treino na residência ou em academia próxima faz mais sentido. Preparei um guia dedicado para cada um:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-300 font-light">
            {[
              { href: "/blog/personal-trainer-tambore-1", label: "Tamboré 1" },
              { href: "/blog/personal-trainer-tambore-2", label: "Tamboré 2" },
              { href: "/blog/personal-trainer-tambore-3", label: "Tamboré 3" },
              { href: "/blog/personal-trainer-tambore-4", label: "Tamboré 4" },
              { href: "/blog/personal-trainer-tambore-5", label: "Tamboré 5" },
              { href: "/blog/personal-trainer-tambore-6", label: "Tamboré 6" },
              { href: "/blog/personal-trainer-tambore-7", label: "Tamboré 7" },
              { href: "/blog/personal-trainer-tambore-10", label: "Tamboré 10" },
              { href: "/blog/personal-trainer-tambore-11", label: "Tamboré 11" },
              { href: "/blog/personal-trainer-quintas-de-tambore", label: "Quintas de Tamboré" },
              { href: "/blog/personal-trainer-green-tambore", label: "Green Tamboré" },
              { href: "/blog/personal-trainer-boulevard-tambore", label: "Boulevard Tamboré" },
              { href: "/blog/personal-trainer-parque-tambore", label: "Parque Tamboré" },
              { href: "/blog/personal-trainer-premium-tambore", label: "Premium Tamboré" },
              { href: "/blog/personal-trainer-resort-tambore", label: "Resort Tamboré" },
              { href: "/blog/personal-trainer-ghaia-tambore", label: "Ghaia Tamboré" },
              { href: "/blog/personal-trainer-the-penthouses-tambore", label: "The Penthouses Tamboré" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-white/10 px-4 py-3 text-sm hover:border-white/40 hover:text-white transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-gray-300 leading-relaxed font-light mt-8 text-sm">
            O perfil de quem mora nesses residenciais é bem definido: executivos com agenda apertada e muitas viagens, famílias com filhos em idade escolar e um número crescente de alunos acima dos 50 anos que buscam força, autonomia e prevenção. Os objetivos mais frequentes que recebo por aqui são recompor a rotina de treino depois de anos parado, reduzir percentual de gordura sem dietas extremas e treinar com segurança apesar de dores antigas.
          </p>
        </div>
      </section>

      {/* ACADEMIAS DA REGIÃO + DICAS */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Academias e dicas locais
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Academias da região de Tamboré onde posso te acompanhar
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Para quem prefere treinar fora do condomínio, a região resolve bem. Há boas opções de{" "}
              <Link href="/blog/academia-perto-do-shopping-tambore" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                academia perto do Shopping Tamboré
              </Link>{" "}
              e um panorama completo no guia de{" "}
              <Link href="/blog/academias-em-tambore" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                academias no Tamboré
              </Link>
              . A poucos minutos, em Alphaville, ficam as unidades onde mais acompanho alunos:{" "}
              <Link href="/blog/smart-fit-alphaville" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                Smart Fit
              </Link>
              ,{" "}
              <Link href="/blog/bluefit-alphaville" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                Bluefit
              </Link>
              ,{" "}
              <Link href="/blog/ironberg-alphaville" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                Ironberg
              </Link>
              ,{" "}
              <Link href="/blog/bodytech-alphaville" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                Bodytech
              </Link>{" "}
              e{" "}
              <Link href="/blog/bio-ritmo-alphaville" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                Bio Ritmo
              </Link>
              . Para quem circula pelo lado de Barueri, a{" "}
              <Link href="/blog/smart-fit-barueri" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                Smart Fit Barueri
              </Link>{" "}
              também entra no radar. A escolha da unidade depende do seu trajeto diário e do tipo de estrutura que o protocolo pede — conversamos sobre isso na avaliação.
            </p>
            <h3 className="text-white font-semibold text-lg pt-2">Dicas para treinar bem morando no Tamboré</h3>
            <ul className="space-y-3 list-none">
              <li className="flex gap-3">
                <span style={{ color: "#BA9E50" }}>→</span>
                <span>As academias da região lotam entre 18h e 20h30. Se sua agenda permite, o meio da manhã e o início da tarde são janelas muito mais tranquilas — e onde consigo os melhores horários de atendimento.</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: "#BA9E50" }}>→</span>
                <span>O espaço fitness do condomínio costuma ser suficiente para a maior parte dos protocolos de força e emagrecimento. Antes de assinar uma academia, vale avaliar o que você já tem dentro do portão — falo mais sobre isso em{" "}
                  <Link href="/blog/academia-em-condominio-como-aproveitar" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                    como aproveitar a academia do condomínio
                  </Link>
                  .</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: "#BA9E50" }}>→</span>
                <span>As áreas comuns arborizadas dos residenciais são ótimas para caminhadas, mobilidade e treino funcional ao ar livre — um complemento simples que melhora recuperação e condicionamento nos dias sem musculação.</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: "#BA9E50" }}>→</span>
                <span>Se você passa o dia sentado em reuniões, inclua trabalho de postura e{" "}
                  <Link href="/blog/mobilidade-articular-pre-treino" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                    mobilidade articular antes do treino
                  </Link>
                  {" "}— veja também{" "}
                  <Link href="/blog/postura-trabalho-sentado-exercicios" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
                    exercícios de postura para quem trabalha sentado
                  </Link>
                  .</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* DEPOIMENTO CONTEXTUALIZADO */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-white mb-10"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            O que os alunos da região costumam dizer
          </h2>

          <div className="space-y-6">
            <blockquote className="border-l-2 border-white/30 pl-6 py-2">
              <p className="text-gray-300 italic text-lg leading-relaxed font-light mb-3">
                "Tentei de tudo antes de contratar o Montinho — personal anterior, app de treino, grupo na academia. Nada funcionou de verdade porque nenhum deles realmente me conhecia. O acompanhamento dele é diferente."
              </p>
              <footer className="text-gray-400 text-sm">Aluna da região de Tamboré · 6 meses de consultoria</footer>
            </blockquote>

            <blockquote className="border-l-2 border-white/30 pl-6 py-2">
              <p className="text-gray-300 italic text-lg leading-relaxed font-light mb-3">
                "Eu viajava muito e achei que treino personalizado não ia funcionar para a minha rotina. Criamos um protocolo que funciona seja qual for a semana — na academia do condomínio, no hotel ou em casa. Resultado consistente mesmo com imprevistos."
              </p>
              <footer className="text-gray-400 text-sm">Aluno morador de Tamboré · Personal presencial + suporte online</footer>
            </blockquote>
          </div>

          <p className="mt-8 text-gray-400 text-sm">
            Veja mais transformações na{" "}
            <Link href="/resultados" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
              página de resultados
            </Link>
            .
          </p>
          <div className="mt-10 ml-auto" style={{ maxWidth: "240px" }}>
            <Image
              src="/Personal%20Trainer%20Tambor%C3%A9%20%282%29.jpg"
              alt="Personal Trainer Tamboré (2)"
              title="Personal Trainer Tamboré (2)"
              aria-label="Personal Trainer Tamboré (2)"
              width={240}
              height={427}
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
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            5 Dicas para acabar com dores no lombar
          </h2>
          <p className="text-gray-300 leading-relaxed mb-8">
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
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Dúvidas sobre personal trainer no Tamboré
          </h2>
          <FAQ itens={faq} placement="personal-trainer-tambore" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Seu próximo passo começa com uma conversa.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Sem formulários longos, sem avaliações pagas antes de decidir. Me conta o que você quer mudar — e te mostro se faz sentido trabalharmos juntos.
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
              Ver como funciona o atendimento
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
