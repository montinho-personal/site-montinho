import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";

export const metadata: Metadata = {
  title: "Personal Trainer em Alphaville | Montinho Personal Trainer",
  description:
    "Personal Trainer em Alphaville com mais de 20 anos de experiência. Treino presencial individualizado para moradores de Alphaville, Barueri e região. Resultados reais, sem fórmulas mágicas.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-alphaville`,
  },
  openGraph: {
    title: "Personal Trainer em Alphaville | Montinho Personal Trainer",
    description:
      "Acompanhamento presencial e personalizado em Alphaville. Método baseado em ciência, experiência real e compromisso com resultados duradouros.",
    url: `${SITE_URL}/personal-trainer-alphaville`,
  },
};

const faq = [
  {
    question: "Onde são realizados os treinos presenciais em Alphaville?",
    answer:
      "Os atendimentos presenciais acontecem na própria academia do aluno em Alphaville, no espaço fitness do condomínio, em casa ou em espaços parceiros na região. Na primeira conversa, alinhamos o local mais conveniente para a sua rotina.",
  },
  {
    question: "Quanto custa um personal trainer em Alphaville?",
    answer:
      "O investimento varia conforme o formato de atendimento (domicílio, condomínio ou academia), a frequência semanal e os objetivos de cada aluno. Por isso não trabalho com tabela fechada: na primeira conversa entendo o seu cenário e apresento uma proposta sob medida, sem compromisso.",
  },
  {
    question: "Você atende em condomínios residenciais de Alphaville e no Tamboré?",
    answer:
      "Sim. Grande parte dos meus alunos treina no espaço fitness do próprio condomínio ou em casa, com equipamentos adaptados à estrutura disponível. Atendo residenciais de Alphaville, Tamboré e também condomínios da região de Aldeia da Serra, em Santana de Parnaíba.",
  },
  {
    question: "Quantas vezes por semana preciso treinar para ter resultado?",
    answer:
      "Depende do objetivo e do ponto de partida. Para a maioria dos alunos, entre duas e quatro sessões semanais bem estruturadas geram evolução consistente de força, condicionamento físico e composição corporal. Mais importante que a quantidade é a regularidade e a qualidade da execução — e é exatamente isso que o acompanhamento garante.",
  },
  {
    question: "Nunca treinei na vida. Consigo acompanhar?",
    answer:
      "Sim — e começar com acompanhamento é a forma mais segura de fazer isso. Iniciantes evoluem rápido quando o protocolo respeita o ponto de partida: aprendemos primeiro a técnica e a postura, construímos base de força e mobilidade, e só então aumentamos a intensidade com progressão de carga gradual.",
  },
  {
    question: "Você trabalha com idosos e com pessoas com dores ou limitações?",
    answer:
      "Sim. Tenho cursos voltados especificamente para o treinamento de pessoas com dores e limitações musculoesqueléticas, e boa parte dos meus alunos em Alphaville está na faixa dos 50, 60 e 70 anos. O treino de força bem orientado é uma das melhores ferramentas para autonomia, equilíbrio, prevenção de quedas e qualidade de vida nessa fase.",
  },
  {
    question: "E se eu viajar muito ou não estiver em Alphaville toda semana?",
    answer:
      "Isso é comum entre executivos da região — e tem solução. Além do presencial, ofereço consultoria online com protocolo individualizado, ajustes contínuos e suporte à distância. Muitos alunos combinam os dois formatos: presencial quando estão em Alphaville, online quando estão viajando.",
  },
  {
    question: "Você atende alunos que já treinam há anos sem resultado?",
    answer:
      "Sim. Esse é exatamente o perfil de muitos dos meus alunos em Alphaville: pessoas que frequentam academia há meses ou anos mas que nunca tiveram um protocolo verdadeiramente individualizado. A diferença que um método estruturado faz nesse cenário é significativa.",
  },
  {
    question: "É possível contratar personal trainer em Alphaville para treinos na minha própria academia?",
    answer:
      "Sim. Atendo alunos em diferentes academias de Alphaville e da região. O treino vai até onde você já treina — não é necessário mudar de lugar.",
  },
  {
    question: "Qual é o diferencial do seu trabalho comparado a outros personal trainers em Alphaville?",
    answer:
      "Conheço Alphaville há mais de duas décadas — a rotina, o ritmo e as demandas reais de quem vive aqui. Meu acompanhamento combina método científico com sensibilidade para a realidade do aluno: agenda cheia, viagens, família, limitações físicas. Não existe ficha genérica — cada protocolo é construído do zero para aquela pessoa.",
  },
  {
    question: "O treino personalizado em Alphaville é indicado para qual perfil de aluno?",
    answer:
      "Para qualquer pessoa que queira sair do lugar: seja quem nunca treinou, quem voltou após anos afastado, quem tem histórico de lesões ou quem já treina mas não vê resultado. Adapto o protocolo ao ponto de partida de cada aluno.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-alphaville`,
  name: "Montinho Personal Trainer – Alphaville",
  description:
    "Personal Trainer presencial em Alphaville com mais de 20 anos de experiência em musculação, emagrecimento e hipertrofia.",
  url: `${SITE_URL}/personal-trainer-alphaville`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
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

export default function PersonalTrainerAlphaville() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Alphaville · Barueri
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Personal Trainer em Alphaville que conhece a sua rotina de dentro.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Moradores de Alphaville têm agenda cheia, compromissos que não podem ser adiados e paciência zero para método que não funciona. Aqui o treino é construído para a sua realidade — não para uma pessoa genérica.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero conhecer o método
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Quem sou eu
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Vivo em Alphaville há mais de 20 anos. Conheço esse lugar como poucos.
          </h2>
          <div className="grid sm:grid-cols-[1fr_auto] gap-10 items-start">
            <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base">
              <p>
                Alphaville tem um ritmo que quem não vive aqui não entende. A saída para São Paulo às 6h30, o trânsito de volta que ninguém controla, a academia que fecha às 22h, o jantar que acontece só depois das 21h. Quando você mora no mesmo lugar há mais de duas décadas, você para de tentar encaixar o treino num modelo padrão — e começa a construir um método que cabe nessa realidade.
              </p>
              <p>
                Minha paixão pela musculação não nasceu de um livro. Nasceu de necessidade. Cresci convivendo com o excesso de peso, passei anos tentando dietas e protocolos que prometiam resultado rápido e entregavam frustração. Foi só quando decidi estudar de verdade — entender como o corpo funciona, o que a ciência diz sobre treino e composição corporal — que as coisas mudaram. Para mim primeiro. Depois para os meus alunos.
              </p>
              <p>
                Hoje trabalho com pessoas que têm a mesma rotina que eu tinha: agenda lotada, pouca margem para erro e zero paciência para perder tempo. O que ofereço não é uma ficha de treino — é um protocolo construído especificamente para você, com ajustes contínuos conforme seu corpo responde.
              </p>
            </div>
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Image
                src="/Treinador%20Alphaville.jpg"
                alt="Treinador Alphaville"
                title="Treinador Alphaville"
                aria-label="Treinador Alphaville"
                width={260}
                height={462}
                loading="lazy"
                decoding="async"
                className="object-cover object-top"
                style={{ width: "260px", height: "462px", maxWidth: "100%" }}
              />
            </div>
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
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Treino presencial em Alphaville: como é trabalhar comigo
          </h2>
          <p className="text-gray-300 leading-relaxed font-light mb-10">
            Do primeiro contato até os resultados, o processo é estruturado para eliminar tentativa e erro e garantir progresso consistente desde a primeira semana.
          </p>

          <div className="space-y-8">
            {[
              {
                num: "01",
                title: "Avaliação inicial e anamnese",
                text: "Antes de propor qualquer exercício, preciso entender com quem estou trabalhando: histórico de treino, lesões anteriores, objetivos, rotina, disponibilidade de tempo, restrições alimentares e expectativas. Essa conversa inicial dura entre 30 e 60 minutos e é onde o protocolo começa a ser desenhado.",
              },
              {
                num: "02",
                title: "Protocolo construído do zero",
                text: "Não existe ficha padrão que uso como base e adapto. Cada aluno tem um protocolo criado especificamente para seus objetivos, seu nível atual e suas limitações. Dois alunos com o mesmo objetivo podem ter programações completamente diferentes — porque são pessoas diferentes.",
              },
              {
                num: "03",
                title: "Sessões presenciais com acompanhamento real",
                text: "Durante o treino estou ao lado, não na academia fazendo outra coisa. Observo a execução, corrijo antes que o erro vire hábito, ajusto a carga em tempo real e garanto que cada série está cumprindo sua função. Esse nível de atenção é o que diferencia acompanhamento profissional de simplesmente treinar com alguém por perto.",
              },
              {
                num: "04",
                title: "Ajustes frequentes e reavaliações mensais",
                text: "O corpo se adapta. O protocolo precisa acompanhar essa adaptação. Faço reavaliações mensais para medir progresso, identificar o que está funcionando e ajustar o que pode ser melhorado. O objetivo é garantir que você continue evoluindo — não que faça o mesmo treino por meses a fio.",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-6 items-start">
                <span className="text-2xl font-bold flex-shrink-0 mt-1" style={{ color: "#BA9E50" }}>
                  {step.num}
                </span>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed font-light">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 relative w-full overflow-hidden" style={{ height: "420px" }}>
            <Image
              src="/Personal%20Trainer%20Alphaville.jpg"
              alt="Personal Trainer Alphaville"
              title="Personal Trainer Alphaville"
              aria-label="Personal Trainer Alphaville"
              fill
              loading="lazy"
              decoding="async"
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Para quem é esse trabalho
          </h2>
          <p className="text-gray-300 font-light mb-10 leading-relaxed">
            Alphaville concentra um perfil de pessoa muito específico. Executivos, empreendedores, profissionais liberais, mães que conciliam filhos e carreira — todos com uma coisa em comum: tempo escasso e exigência alta. Trabalho com:
          </p>
          <ul className="space-y-4 mb-10">
            {[
              "Quem quer emagrecer com método — sem dietas radicais que não sustentam",
              "Quem busca hipertrofia real, não apenas volume aparente de treino",
              "Quem voltou ao treino após anos parado e precisa reconstruir a base com segurança",
              "Quem tem histórico de lesão e precisa de um protocolo que respeite essas limitações",
              "Quem já treina mas chegou num platô onde parece que nada mais evolui",
              "Quem nunca teve acompanhamento e quer fazer isso da forma certa desde o início",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 font-light">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40" />
                {item}
              </li>
            ))}
          </ul>
          <div style={{ maxWidth: "280px" }}>
            <Image
              src="/Personal%20Trainer%20Alphaville%20SP.jpg"
              alt="Personal Trainer Alphaville SP"
              title="Personal Trainer Alphaville SP"
              aria-label="Personal Trainer Alphaville SP"
              width={280}
              height={498}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ONDE ATENDO */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Onde atendo
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Atendimento em toda a região de Alphaville
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base mb-10">
            <p>
              Alphaville não é um bairro comum — é um polo empresarial e residencial que se estende por Barueri e Santana de Parnaíba. Quem trabalha nas torres do Centro Industrial e Empresarial ou nos escritórios da Alameda Rio Negro e mora nos residenciais sabe: o dia é curto e o deslocamento precisa fazer sentido. Por isso o treino vai até você, não o contrário.
            </p>
            <p>
              Atendo em toda a malha de Alphaville e arredores — dos residenciais próximos ao Iguatemi Alphaville à região do Shopping Tamboré, passando pelos condomínios do Tamboré e pela Aldeia da Serra. Para quem chega pela Castelo Branco no fim do dia, encaixamos o horário de forma realista, sem depender de janelas que o trânsito engole.
            </p>
          </div>
          <h3 className="text-white font-semibold text-lg mb-4">Área de atendimento e vias de acesso</h3>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base mb-10">
            <p>
              A base do atendimento é o eixo formado pela Alameda Rio Negro e pela Alameda Araguaia, de onde se chega com facilidade a qualquer residencial de Alphaville. A Rodovia Castelo Branco corta a região e conecta rapidamente o Tamboré, o centro de Barueri e Santana de Parnaíba — o que me permite montar uma agenda realista, sem horários que dependem de sorte no trânsito.
            </p>
            <p>
              Em tempos práticos: do centro de Alphaville até o Tamboré são cerca de 5 a 10 minutos de carro; até o centro de Barueri, em torno de 10 a 15 minutos; e até Santana de Parnaíba, algo entre 10 e 15 minutos, dependendo do trânsito e do horário. São regiões contíguas — por isso consigo atender alunos em qualquer uma delas sem comprometer a pontualidade das sessões.
            </p>
          </div>
          <h3 className="text-white font-semibold text-lg mb-4">Formatos de atendimento na região</h3>
          <ul className="space-y-4 mb-10">
            {[
              "Atendimento em domicílio — treino em casa, com estrutura adaptada ao espaço e aos equipamentos disponíveis",
              "Espaço fitness do condomínio — aproveitando a academia do próprio residencial, sem deslocamento nenhum",
              "Academias de Alphaville e região — acompanho você na academia onde já treina, em Barueri ou Santana de Parnaíba",
              "Consultoria online — protocolo individualizado à distância, ideal para quem viaja com frequência",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 font-light">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40" />
                {item}
              </li>
            ))}
          </ul>
          <h3 className="text-white font-semibold text-lg mb-4">Condomínios atendidos em Alphaville</h3>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base mb-10">
            <p>
              Atendo moradores em todos os residenciais de Alphaville — do{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-zero" className="text-white underline underline-offset-4 hover:text-gray-300">Residencial Zero</Link>, um dos mais tradicionais, aos residenciais{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-1" className="text-white underline underline-offset-4 hover:text-gray-300">1</Link>,{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-2" className="text-white underline underline-offset-4 hover:text-gray-300">2</Link>,{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-3" className="text-white underline underline-offset-4 hover:text-gray-300">3</Link>,{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-4" className="text-white underline underline-offset-4 hover:text-gray-300">4</Link>,{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-5" className="text-white underline underline-offset-4 hover:text-gray-300">5</Link> e{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-6" className="text-white underline underline-offset-4 hover:text-gray-300">6</Link>, mais próximos do centro comercial, até os residenciais{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-8" className="text-white underline underline-offset-4 hover:text-gray-300">8</Link>,{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-9" className="text-white underline underline-offset-4 hover:text-gray-300">9</Link>,{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-10" className="text-white underline underline-offset-4 hover:text-gray-300">10</Link>,{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-11" className="text-white underline underline-offset-4 hover:text-gray-300">11</Link> e{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-12" className="text-white underline underline-offset-4 hover:text-gray-300">12</Link>, já na porção de Santana de Parnaíba.
            </p>
            <p>
              Na vizinhança imediata, também acompanho alunos nos condomínios do Tamboré — como o{" "}
              <Link href="/blog/personal-trainer-quintas-de-tambore" className="text-white underline underline-offset-4 hover:text-gray-300">Quintas de Tamboré</Link>, o{" "}
              <Link href="/blog/personal-trainer-boulevard-tambore" className="text-white underline underline-offset-4 hover:text-gray-300">Boulevard Tamboré</Link> e o{" "}
              <Link href="/blog/personal-trainer-resort-tambore" className="text-white underline underline-offset-4 hover:text-gray-300">Tamboré Resort</Link> — em geral no espaço fitness do próprio condomínio ou na residência do aluno.
            </p>
          </div>
          <h3 className="text-white font-semibold text-lg mb-4">Academias de Alphaville onde acompanho alunos</h3>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base mb-10">
            <p>
              Se você prefere treinar em academia, não precisa mudar de lugar: acompanho alunos nas principais unidades da região, como a{" "}
              <Link href="/blog/ironberg-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Ironberg Alphaville</Link>, a{" "}
              <Link href="/blog/bodytech-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Bodytech</Link>, a{" "}
              <Link href="/blog/bio-ritmo-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Bio Ritmo</Link>, a{" "}
              <Link href="/blog/smart-fit-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Smart Fit</Link>, a{" "}
              <Link href="/blog/bluefit-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Bluefit</Link>, a{" "}
              <Link href="/blog/academia-gavioes-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Gaviões</Link> e a{" "}
              <Link href="/blog/nitrogym-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">NitroGym</Link>.
            </p>
            <p>
              Cada uma tem estrutura e perfil de público diferentes — e parte do meu trabalho é adaptar o protocolo aos equipamentos disponíveis onde você já treina, sem exigir troca de plano ou de academia.
            </p>
          </div>
          <p className="text-gray-300 leading-relaxed font-light">
            Também atendo alunos nas cidades vizinhas — conheça as páginas de{" "}
            <Link href="/personal-trainer-barueri" className="text-white underline underline-offset-4 hover:text-gray-300">
              personal trainer em Barueri
            </Link>
            ,{" "}
            <Link href="/personal-trainer-santana-de-parnaiba" className="text-white underline underline-offset-4 hover:text-gray-300">
              Santana de Parnaíba
            </Link>{" "}
            e{" "}
            <Link href="/personal-trainer-tambore" className="text-white underline underline-offset-4 hover:text-gray-300">
              Tamboré
            </Link>
            .
          </p>
        </div>
      </section>

      {/* PERFIL E DICAS LOCAIS */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Treinar em Alphaville
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Quem treina em Alphaville — e como aproveitar melhor a região
          </h2>
          <h3 className="text-white font-semibold text-lg mb-4">O perfil de quem me procura aqui</h3>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base mb-10">
            <p>
              Alphaville reúne três perfis que dominam a minha agenda. O primeiro é o executivo entre 35 e 55 anos que passa o dia em reuniões e horas sentado — e chega com queixas de{" "}
              <Link href="/blog/postura-trabalho-sentado-exercicios" className="text-white underline underline-offset-4 hover:text-gray-300">postura comprometida pelo trabalho sentado</Link>, ganho de peso gradual e disposição em queda. O objetivo típico: emagrecimento e condicionamento físico que caibam numa agenda imprevisível.
            </p>
            <p>
              O segundo são as famílias dos residenciais: casais que treinam juntos no espaço fitness do condomínio, mães e pais que querem hipertrofia e força sem abrir mão do tempo com os filhos. E o terceiro, cada vez maior, é o público 50+ e 60+ — moradores antigos da região que entenderam que o treino de força é o melhor investimento em autonomia e qualidade de vida a longo prazo.
            </p>
          </div>
          <h3 className="text-white font-semibold text-lg mb-4">Dicas práticas para treinar na região</h3>
          <ul className="space-y-4">
            {[
              "As academias de Alphaville lotam entre 6h e 8h e depois das 18h — quem tem flexibilidade encontra equipamentos livres entre 10h e 16h, e é aí que muitos dos meus alunos treinam com mais qualidade",
              "Se o seu residencial tem espaço fitness, use-o a favor: eliminar o deslocamento é o fator que mais aumenta a constância — e adapto o protocolo aos equipamentos disponíveis",
              "Para caminhadas e trabalho aeróbico ao ar livre, as alamedas arborizadas dos residenciais e o calçadão da região central funcionam muito bem no início da manhã",
              "Chegou de viagem ou passou a semana fora? Uma sessão de mobilidade articular antes de retomar a carga evita o erro clássico de voltar no ritmo em que parou",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 font-light">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-300 leading-relaxed font-light mt-8">
            Sobre esse último ponto, vale a leitura:{" "}
            <Link href="/blog/mobilidade-articular-pre-treino" className="text-white underline underline-offset-4 hover:text-gray-300">
              mobilidade articular no pré-treino
            </Link>
            .
          </p>
        </div>
      </section>

      {/* METODOLOGIA E RESULTADOS */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Metodologia
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            O que um treinamento personalizado entrega — e em quanto tempo
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base">
            <p>
              Musculação e treinamento personalizado não são sinônimos de estética apenas. O trabalho envolve emagrecimento, hipertrofia, ganho de força e resistência, mobilidade, flexibilidade, correção de postura e condicionamento físico — sempre partindo de uma avaliação física completa, com análise de composição corporal e percentual de gordura.
            </p>
            <p>
              A partir daí entra a periodização: o planejamento que organiza fases de treino, progressão de carga e recuperação muscular para que o corpo evolua sem estagnar e sem se machucar. É um método refinado e validado na prática ao longo do atendimento de alunos — não uma fórmula copiada de aplicativo.
            </p>
            <p>
              Sobre prazos, prefiro ser honesto: nas primeiras semanas a evolução aparece em disposição, sono e técnica de execução. Mudanças visíveis de composição corporal costumam surgir entre oito e doze semanas de treino consistente, e transformações profundas se consolidam ao longo de meses — junto com hábitos saudáveis que se sustentam depois. Se você já tentou de tudo e não saiu do lugar, vale ler{" "}
              <Link href="/blog/por-que-voce-nao-consegue-emagrecer" className="text-white underline underline-offset-4 hover:text-gray-300">
                por que você não consegue emagrecer
              </Link>{" "}
              e{" "}
              <Link href="/blog/como-ganhar-massa-muscular" className="text-white underline underline-offset-4 hover:text-gray-300">
                como ganhar massa muscular de verdade
              </Link>
              .
            </p>
            <p>
              Essa forma de trabalhar nasceu da minha própria transformação: convivi com a obesidade, perdi mais de 40kg e há mais de 20 anos vivo a musculação todos os dias — história que conto em detalhes em{" "}
              <Link href="/minha-historia" className="text-white underline underline-offset-4 hover:text-gray-300">
                minha história
              </Link>
              . Desde então, sigo em atualização constante, com cursos e especializações em treinamento que alimentam uma metodologia própria.
            </p>
          </div>
        </div>
      </section>

      {/* DORES E LIMITAÇÕES */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Treino com segurança
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Dores e limitações não são motivo para parar de treinar
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base">
            <p>
              Dor lombar depois de horas sentado no escritório, ombro que reclama, joelho que trava na escada — são queixas frequentes entre executivos e moradores de Alphaville. E a resposta certa raramente é ficar parado: é treinar com orientação adequada.
            </p>
            <p>
              Tenho cursos voltados especificamente para o treinamento de pessoas com dores e limitações musculoesqueléticas. E, mais do que isso, já vivenciei na pele muitas dessas dores ao longo da minha própria trajetória de treinos — o que aumenta a minha compreensão real das dificuldades que os alunos enfrentam.
            </p>
            <p>
              Minha metodologia une conhecimento técnico, experiência prática e acompanhamento individualizado para você treinar com segurança e eficiência: fortalecimento progressivo, trabalho de mobilidade e postura, prevenção de lesões e respeito absoluto aos limites de cada fase. Para se aprofundar, leia sobre{" "}
              <Link href="/blog/dor-lombar-na-musculacao" className="text-white underline underline-offset-4 hover:text-gray-300">
                dor lombar na musculação
              </Link>{" "}
              e{" "}
              <Link href="/blog/treino-funcional-para-idosos" className="text-white underline underline-offset-4 hover:text-gray-300">
                treino funcional para idosos
              </Link>
              .
            </p>
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
            Dúvidas sobre personal trainer em Alphaville
          </h2>
          <div className="space-y-8">
            {faq.map((item, i) => (
              <div key={i} className="border-b border-white/10 pb-8">
                <h3 className="text-white font-semibold text-lg mb-3">{item.question}</h3>
                <p className="text-gray-300 leading-relaxed font-light">{item.answer}</p>
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
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Pronto para começar em Alphaville?
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            A primeira conversa é sem compromisso. Me conta o que você quer alcançar — e eu te mostro como podemos chegar lá juntos. Se preferir, envie sua mensagem pela{" "}
            <Link href="/contato" className="text-white underline underline-offset-4 hover:text-gray-300">
              página de contato
            </Link>
            .
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
