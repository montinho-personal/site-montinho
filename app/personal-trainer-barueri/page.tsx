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
      "Atendo em diversas regiões do município: Centro de Barueri, bairros residenciais próximos e, com forte presença, a região de Alphaville e Tamboré, que pertencem a Barueri. Os atendimentos acontecem em academias da cidade, em condomínios ou em domicílio, conforme a localização e a preferência do aluno.",
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
      "Emagrecimento é um dos principais objetivos dos meus alunos. O protocolo combina treino de força — que preserva músculo e mantém o metabolismo elevado — com orientações nutricionais básicas alinhadas ao objetivo. O déficit calórico controlado, associado ao treino adequado, é o que produz resultado duradouro na composição corporal.",
  },
  {
    question: "Sou iniciante e nunca treinei. Consigo acompanhar?",
    answer:
      "Sim — e iniciantes costumam ser quem mais evolui no primeiro ano. O protocolo começa do seu ponto de partida real: aprendizado dos padrões de movimento, construção de base de força e mobilidade, e progressão de carga gradual. Ninguém precisa 'estar em forma' para começar; o treino é que se adapta a você.",
  },
  {
    question: "Você atende idosos em Barueri?",
    answer:
      "Atendo, com adaptações específicas: foco em força, equilíbrio, mobilidade e prevenção de quedas, sempre com progressão cuidadosa e respeito às limitações individuais. Treinamento de força bem orientado é uma das melhores ferramentas de qualidade de vida e autonomia para essa fase.",
  },
  {
    question: "Quantas vezes por semana preciso treinar para ver resultado?",
    answer:
      "Depende do objetivo e da rotina. Para a maioria das pessoas, 2 a 4 sessões semanais bem estruturadas produzem evolução consistente em força, condicionamento físico e composição corporal. Mais importante que a frequência isolada é a constância ao longo dos meses — e é isso que o acompanhamento ajuda a sustentar.",
  },
  {
    question: "E se eu não puder treinar presencialmente com você?",
    answer:
      "Para quem tem rotina imprevisível — comum em quem trabalha em Barueri e transita para São Paulo — ofereço consultoria online, com protocolo individualizado, vídeos de execução e ajustes periódicos. Conheça os detalhes na página de consultoria ou fale comigo pelo WhatsApp.",
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
    { "@type": "Neighborhood", name: "Centro de Barueri" },
    { "@type": "Neighborhood", name: "Jardim Belval" },
    { "@type": "Neighborhood", name: "Jardim dos Camargos" },
    { "@type": "Neighborhood", name: "Vila Porto" },
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
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
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
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
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
              Minha trajetória na musculação nasceu de experiência própria: anos convivendo com o excesso de peso, tentativas frustradas com protocolos genéricos e, por fim, a decisão de estudar de verdade o que a ciência diz sobre composição corporal. Perdi mais de 40kg nesse processo —{" "}
              <Link href="/minha-historia" className="underline hover:text-white transition-colors">
                conto essa história aqui
              </Link>
              . A transformação que vivi no meu próprio corpo é o fundamento de tudo que ofereço hoje — não uma teoria que aprendi num curso, mas algo que vivi e que sei replicar com método refinado e validado na prática ao longo do atendimento de alunos.
            </p>
            <p>
              E Barueri é uma cidade diversa: quem mora nos bairros residenciais próximos ao Centro, quem trabalha nas empresas da região, quem pega a CPTM na Estação Barueri (Linha 8) todos os dias para São Paulo, quem circula pela Castelo Branco entre Alphaville, Tamboré e as cidades vizinhas. Cada rotina pede um formato de treino diferente — e é exatamente por isso que o atendimento é flexível: em domicílio, na academia do seu condomínio ou em academias da cidade.
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
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Como o treino personalizado funciona na prática
          </h2>
          <p className="text-gray-300 font-light mb-10 leading-relaxed">
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
                <p className="text-gray-300 leading-relaxed font-light text-sm">{item.text}</p>
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
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Objetivos que trabalho com meus alunos em Barueri
          </h2>
          <p className="text-gray-300 font-light mb-8">
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
                <p className="text-gray-300 text-sm leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Em todos os casos, o ponto de partida é a avaliação física e o desenho da periodização: quanto treinar, com que intensidade e como progredir. Quanto tempo até ver resultado? Em geral, as primeiras mudanças de disposição e força aparecem nas primeiras semanas; alterações visíveis de composição corporal e percentual de gordura costumam se consolidar entre o segundo e o quarto mês de constância. Sem prazos mágicos — com processo.
            </p>
            <p>
              Se quiser se aprofundar antes de começar, dois artigos do blog ajudam:{" "}
              <Link href="/blog/por-que-voce-nao-consegue-emagrecer" className="underline hover:text-white transition-colors">
                por que você não consegue emagrecer
              </Link>{" "}
              e{" "}
              <Link href="/blog/como-ganhar-massa-muscular" className="underline hover:text-white transition-colors">
                como ganhar massa muscular
              </Link>
              . Ou vá direto ao ponto pela{" "}
              <Link href="/contato" className="underline hover:text-white transition-colors">
                página de contato
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ONDE E COMO ATENDO */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Atendimento em Barueri
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Onde e como o treino acontece
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Um personal trainer em Barueri precisa se adaptar à geografia da cidade. Quem mora perto do Centro tem uma rotina; quem vive em Alphaville ou no Tamboré, outra; quem depende da Linha 8 da CPTM ou da Castelo Branco para trabalhar em São Paulo, outra ainda. O formato do atendimento respeita isso:
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {[
              { obj: "Em domicílio", desc: "Levo o treino até você. Com o espaço e o equipamento certos — muitas vezes menos do que se imagina — dá para construir força, mobilidade e condicionamento em casa, sem deslocamento." },
              { obj: "No seu condomínio", desc: "Muitos condomínios de Barueri têm espaço fitness bem equipado. Treinar ali elimina a principal barreira da constância: o trajeto até a academia." },
              { obj: "Em academias da cidade", desc: "Acompanhamento presencial em academias de Barueri, do Centro à região de Alphaville e Tamboré, conforme a estrutura que seu objetivo exige." },
              { obj: "Consultoria online", desc: "Para quem viaja ou tem horários imprevisíveis: protocolo individualizado, vídeos de execução e ajustes periódicos, com a mesma lógica do presencial." },
            ].map((item, i) => (
              <div key={i} className="border border-white/10 p-5">
                <p className="text-white font-semibold mb-2">{item.obj}</p>
                <p className="text-gray-300 text-sm leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Também atendo nas cidades e regiões vizinhas — conheça as páginas de{" "}
              <Link href="/personal-trainer-alphaville" className="underline hover:text-white transition-colors">
                Alphaville
              </Link>
              ,{" "}
              <Link href="/personal-trainer-tambore" className="underline hover:text-white transition-colors">
                Tamboré
              </Link>{" "}
              e{" "}
              <Link href="/personal-trainer-santana-de-parnaiba" className="underline hover:text-white transition-colors">
                Santana de Parnaíba
              </Link>
              . E para quem prefere começar à distância, a{" "}
              <Link href="/consultoria" className="underline hover:text-white transition-colors">
                consultoria online
              </Link>{" "}
              é o caminho.
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
            Bairros e regiões de Barueri onde atendo
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              O atendimento cobre o município de ponta a ponta: Centro de Barueri, Jardim Belval, Jardim dos Camargos, Vila Porto e os bairros residenciais do entorno, além da região de Alphaville e do Tamboré. Como Barueri é compacta e bem conectada, o deslocamento entre essas áreas raramente é um obstáculo.
            </p>
            <p>
              As principais vias facilitam a logística das sessões: a Rodovia Castelo Branco liga Alphaville e Tamboré ao restante da cidade e às vizinhas Santana de Parnaíba e Osasco; a Estrada Velha de Itapevi atende os bairros mais próximos ao Centro; e a Estação Barueri da Linha 8 da CPTM é referência para quem organiza o treino em torno do trajeto ao trabalho. Do Centro até Alphaville ou Tamboré, o percurso de carro leva cerca de 10 a 15 minutos, dependendo do trânsito — e entre Alphaville, Tamboré e Santana de Parnaíba, tipicamente 5 a 15 minutos.
            </p>
            <p>
              Na prática, isso significa que consigo montar uma agenda estável para você, seja no seu bairro, na academia onde já treina ou no condomínio onde mora.
            </p>
          </div>

          <h3 className="text-white font-semibold text-xl mt-10 mb-4">Condomínios de Alphaville e Tamboré</h3>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Boa parte dos meus alunos em Barueri mora nos residenciais de Alphaville e do Tamboré e treina no espaço fitness do próprio condomínio ou em casa. Escrevi guias específicos sobre como funciona o treino no{" "}
              <Link href="/blog/personal-trainer-tambore-1" className="underline hover:text-white transition-colors">
                Tamboré 1
              </Link>{" "}
              e no{" "}
              <Link href="/blog/personal-trainer-alphaville-residencial-1" className="underline hover:text-white transition-colors">
                Alphaville Residencial 1
              </Link>
              , e a mesma lógica vale para os demais residenciais das duas regiões: avaliação no local, protocolo ajustado ao equipamento disponível e acompanhamento presencial sem que você precise sair do condomínio.
            </p>
          </div>

          <h3 className="text-white font-semibold text-xl mt-10 mb-4">Academias de Barueri onde posso te acompanhar</h3>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Se você prefere treinar em academia, acompanho alunos nas principais unidades da cidade. Já analisei em detalhe a{" "}
              <Link href="/blog/smart-fit-barueri" className="underline hover:text-white transition-colors">
                Smart Fit Barueri
              </Link>
              , a{" "}
              <Link href="/blog/bluefit-barueri" className="underline hover:text-white transition-colors">
                Bluefit Barueri
              </Link>
              , a{" "}
              <Link href="/blog/academia-gavioes-barueri" className="underline hover:text-white transition-colors">
                Academia Gaviões
              </Link>{" "}
              e a{" "}
              <Link href="/blog/redfit-barueri" className="underline hover:text-white transition-colors">
                RedFit Barueri
              </Link>{" "}
              — estrutura, equipamentos e para qual perfil de treino cada uma funciona melhor. Se você já é aluno de alguma delas, o protocolo é montado em cima do equipamento que a unidade oferece; se ainda vai escolher, ajudo a decidir com base no seu objetivo e na sua rotina.
            </p>
          </div>
        </div>
      </section>

      {/* PERFIL E DICAS */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Treinar em Barueri
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Quem treina comigo em Barueri — e como aproveitar melhor a cidade
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Barueri é uma cidade de perfis muito diferentes convivendo lado a lado. Atendo trabalhadores locais que buscam disposição para dar conta do dia; profissionais que passam horas entre CPTM, Castelo Branco e escritório em São Paulo e chegam com pouco tempo e postura castigada; e moradores de condomínio em Alphaville e no Tamboré, muitos deles executivos e famílias que priorizam praticidade e privacidade no treino. Os objetivos mais comuns refletem essas rotinas: emagrecimento, hipertrofia, correção de{" "}
              <Link href="/blog/postura-trabalho-sentado-exercicios" className="underline hover:text-white transition-colors">
                postura desgastada pelo trabalho sentado
              </Link>{" "}
              e recuperação de condicionamento físico depois de anos parado.
            </p>
            <p>
              Algumas dicas práticas para quem treina na cidade: nas academias de Barueri, os horários mais tranquilos costumam ser meio da manhã e início da tarde — fora dos picos de antes do expediente e do fim do dia, quando as unidades do Centro e do entorno da estação enchem. Se o seu condomínio tem espaço fitness, ele é provavelmente sua melhor arma contra a inconstância: trajeto zero. E, quando o clima ajuda, áreas verdes e parques municipais podem complementar o treino com caminhadas e trabalho de condicionamento ao ar livre. Antes de qualquer sessão, vale dedicar minutos à{" "}
              <Link href="/blog/mobilidade-articular-pre-treino" className="underline hover:text-white transition-colors">
                mobilidade articular no pré-treino
              </Link>{" "}
              — pequeno investimento, grande retorno em segurança e desempenho.
            </p>
          </div>
        </div>
      </section>

      {/* DORES E LIMITAÇÕES */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Dores e limitações
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Treinar com dor não é normal — e não precisa ser sua realidade
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Boa parte das pessoas que me procuram em Barueri chega com alguma queixa: dor lombar, incômodo no joelho, ombro que trava, postura desgastada por anos de escritório e trânsito. Muitas já ouviram que deveriam "parar de treinar" — quando, na maioria dos casos, o caminho é o oposto: treinar certo.
            </p>
            <p>
              Fiz cursos voltados especificamente para o treinamento de pessoas com dores e limitações musculoesqueléticas. E, mais do que isso, vivi na pele dores comuns ao longo da minha própria trajetória de treinos — o que aumenta minha compreensão real das dificuldades de quem chega nessa condição.
            </p>
            <p>
              A metodologia une conhecimento técnico, experiência prática e acompanhamento individualizado para que você treine com segurança e eficiência: seleção criteriosa de exercícios, ajustes de amplitude, fortalecimento progressivo, trabalho de mobilidade e flexibilidade, e atenção constante à execução — sempre com foco em prevenção de lesões e recuperação muscular adequada. Se o tema é dor nas costas, escrevi sobre{" "}
              <Link href="/blog/dor-lombar-na-musculacao" className="underline hover:text-white transition-colors">
                dor lombar na musculação
              </Link>{" "}
              no blog. E para quem está em fase mais madura da vida, vale ler sobre{" "}
              <Link href="/blog/treino-funcional-para-idosos" className="underline hover:text-white transition-colors">
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
            Dúvidas sobre personal trainer em Barueri
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
