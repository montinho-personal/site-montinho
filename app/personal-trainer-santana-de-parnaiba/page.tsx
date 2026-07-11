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
  {
    question: "Quanto custa um personal trainer em Santana de Parnaíba?",
    answer:
      "O valor varia conforme o formato (domicílio, academia de condomínio ou academia da região), a frequência semanal e a distância do deslocamento. Prefiro não trabalhar com tabela fixa: primeiro entendo seu objetivo e sua rotina, depois apresento uma proposta que faça sentido. Entre em contato pelo WhatsApp para uma conversa sem compromisso.",
  },
  {
    question: "Você atende em academias de condomínio em Santana de Parnaíba?",
    answer:
      "Sim. Grande parte dos condomínios residenciais de Santana de Parnaíba — em Alphaville, Aldeia da Serra, Fazendinha e Cidade São Pedro — possui espaço fitness próprio. Atendo diretamente na academia do seu condomínio, na sua casa ou em academias da região, conforme a estrutura disponível e a sua preferência.",
  },
  {
    question: "Quantas vezes por semana devo treinar com personal em Santana de Parnaíba?",
    answer:
      "Depende do objetivo e do ponto de partida. Para a maioria dos alunos, duas a três sessões semanais acompanhadas já garantem progressão consistente de carga e correção de técnica. Quem busca resultados mais rápidos em emagrecimento ou hipertrofia costuma combinar sessões presenciais com treinos complementares orientados por mim.",
  },
  {
    question: "Nunca treinei. Consigo acompanhar o treino personalizado?",
    answer:
      "Sim — e iniciantes são justamente quem mais se beneficia do acompanhamento individualizado. Começamos com avaliação física completa, construímos a base de técnica e mobilidade e evoluímos a intensidade de forma gradual. Ninguém precisa 'estar em forma' para começar; o treino é montado para o seu momento atual.",
  },
  {
    question: "Você trabalha com idosos e pessoas com dores ou limitações?",
    answer:
      "Sim. Tenho cursos voltados ao treinamento de pessoas com dores e limitações musculoesqueléticas, e trabalho força, equilíbrio, mobilidade e prevenção de quedas com alunos acima dos 60 anos. O treino respeita o histórico de cada um e progride com segurança — sem infantilizar nem expor a riscos desnecessários.",
  },
  {
    question: "Existe opção de consultoria online para quem viaja muito?",
    answer:
      "Sim. Para quem tem agenda instável ou passa parte da semana fora de Santana de Parnaíba, ofereço consultoria online com planilha de treino individualizada, ajustes periódicos e suporte pelo WhatsApp. Muitos alunos combinam o formato híbrido: presencial quando estão na cidade, online quando estão viajando.",
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
    { "@type": "Neighborhood", name: "Alphaville" },
    { "@type": "Neighborhood", name: "Fazendinha" },
    { "@type": "Neighborhood", name: "Centro Histórico" },
    { "@type": "Neighborhood", name: "Cidade São Pedro" },
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
              Minha trajetória na musculação começou pela necessidade pessoal. Fui obeso, perdi mais de 40kg e passei anos convivendo com o sobrepeso até entender que o problema não era falta de esforço — era falta de método. Quando aprendi a base do que funciona de verdade, a transformação aconteceu. Não em semanas, mas de forma real e permanente. Essa história completa está em{" "}
              <Link href="/minha-historia" className="text-white underline underline-offset-4 hover:text-gray-300 transition-colors">minha história</Link> — e é o aprendizado que transmito hoje para os meus alunos de Santana de Parnaíba e da região.
            </p>
            <p>
              São mais de 20 anos de musculação somados a cursos e especializações em treinamento, com um método refinado e validado na prática ao longo do atendimento de alunos. Cada protocolo une avaliação física, periodização, progressão de carga e atenção à postura e à prevenção de lesões — porque resultado que não se sustenta não é resultado.
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

      {/* ONDE ATENDO */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Bairros e formatos de atendimento
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Onde atendo em Santana de Parnaíba
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base">
            <p>
              Santana de Parnaíba é extensa e cada região tem sua dinâmica. Atendo moradores da parte de Alphaville que pertence ao município, dos residenciais de Aldeia da Serra, da Fazendinha, da Cidade São Pedro e do entorno do Centro Histórico. Conheço os trajetos e organizo a agenda por região, o que reduz atrasos e mantém a regularidade das sessões.
            </p>
            <p>
              O perfil da cidade é de condomínios residenciais e famílias — e o atendimento acompanha isso. Você escolhe o formato que cabe na sua rotina:
            </p>
          </div>
          <div className="mt-8 space-y-4">
            {[
              {
                perfil: "Na academia ou espaço fitness do seu condomínio",
                desc: "A maioria dos residenciais da região tem espaço fitness próprio. Monto o protocolo com base nos equipamentos disponíveis, trabalhando musculação, treinamento funcional e condicionamento físico sem que você precise sair de casa.",
              },
              {
                perfil: "Atendimento em domicílio",
                desc: "Para quem prefere treinar dentro de casa, levo o material necessário e estruturo treinos de força, mobilidade e resistência adaptados ao espaço. Qualidade e progressão de carga não dependem de sala cheia de máquinas.",
              },
              {
                perfil: "Em academias da região",
                desc: "Quem já frequenta uma academia em Santana de Parnaíba ou nas proximidades pode ser acompanhado lá mesmo. A estrutura completa amplia as possibilidades de periodização, especialmente para hipertrofia.",
              },
              {
                perfil: "Consultoria online",
                desc: "Para rotinas com viagens frequentes, a consultoria online mantém o processo andando: planilha individualizada, vídeos de execução e ajustes contínuos. Saiba mais na página de consultoria.",
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
          <p className="mt-8 text-gray-400 text-sm leading-relaxed font-light">
            Também atendo cidades e regiões vizinhas: veja as páginas de{" "}
            <Link href="/personal-trainer-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300 transition-colors">personal trainer em Alphaville</Link>,{" "}
            <Link href="/personal-trainer-barueri" className="text-white underline underline-offset-4 hover:text-gray-300 transition-colors">personal trainer em Barueri</Link> e{" "}
            <Link href="/personal-trainer-tambore" className="text-white underline underline-offset-4 hover:text-gray-300 transition-colors">personal trainer no Tamboré</Link>. Para consultoria a distância, conheça a{" "}
            <Link href="/consultoria" className="text-white underline underline-offset-4 hover:text-gray-300 transition-colors">consultoria online</Link>.
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Método, não improviso
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Como funciona o treinamento personalizado em Santana de Parnaíba
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base">
            <p>
              Tudo começa com uma avaliação física: composição corporal, percentual de gordura, histórico de treino, postura, mobilidade e limitações. É essa fotografia inicial que permite medir evolução real — não impressão.
            </p>
            <p>
              A partir dela, monto a periodização do seu ciclo de treino. Cada fase tem objetivo definido — construir base, ganhar força, acelerar o emagrecimento ou consolidar a hipertrofia — e a progressão de carga é registrada sessão a sessão. Quando o corpo se adapta, o estímulo muda antes de o resultado estagnar.
            </p>
            <p>
              Os prazos são honestos: melhora de disposição e sono nas primeiras semanas, mudanças perceptíveis na composição corporal entre 6 e 8 semanas, transformações consistentes entre 3 e 6 meses. Quem quer entender melhor os bastidores pode ler no blog{" "}
              <Link href="/blog/por-que-voce-nao-consegue-emagrecer" className="text-white underline underline-offset-4 hover:text-gray-300 transition-colors">por que você não consegue emagrecer</Link> e{" "}
              <Link href="/blog/como-ganhar-massa-muscular" className="text-white underline underline-offset-4 hover:text-gray-300 transition-colors">como ganhar massa muscular</Link>.
            </p>
            <p>
              Entre as sessões, o acompanhamento continua: orientações sobre recuperação muscular, hábitos saudáveis e ajustes de rotina que sustentam o resultado. Flexibilidade, resistência e qualidade de vida não são efeitos colaterais do treino — fazem parte do planejamento.
            </p>
          </div>
        </div>
      </section>

      {/* DORES E LIMITAÇÕES */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Treinar com dor não é normal
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Dores e limitações não precisam te afastar do treino
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base">
            <p>
              Muita gente em Santana de Parnaíba adia o início do treino por causa de dor lombar, desconforto no joelho ou no ombro. O medo é legítimo — treinar errado com dor piora o quadro. Mas parar de se mover também piora.
            </p>
            <p>
              Tenho cursos voltados especificamente para o treinamento de pessoas com dores e limitações musculoesqueléticas. E, ao longo da minha própria trajetória de mais de 20 anos de musculação, também vivenciei dores comuns de quem treina — o que me faz entender na prática as dificuldades que os alunos enfrentam, e não apenas na teoria.
            </p>
            <p>
              Minha metodologia une conhecimento técnico, experiência prática e acompanhamento individualizado para que você treine com segurança e eficiência: fortalecendo a musculatura de suporte, corrigindo padrões de movimento e progredindo no ritmo que o seu corpo permite. No blog, escrevi sobre{" "}
              <Link href="/blog/dor-lombar-na-musculacao" className="text-white underline underline-offset-4 hover:text-gray-300 transition-colors">dor lombar na musculação</Link> e{" "}
              <Link href="/blog/treino-funcional-para-idosos" className="text-white underline underline-offset-4 hover:text-gray-300 transition-colors">treino funcional para idosos</Link> — dois temas frequentes entre alunos da região.
            </p>
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
            Você escolheu morar num lugar que favorece saúde e bem-estar. Faz sentido que o treino reflita essa escolha. Me conte o que você busca pelo WhatsApp ou pela{" "}
            <Link href="/contato" className="text-white underline underline-offset-4 hover:text-gray-300 transition-colors">página de contato</Link> — e vejo como posso ajudar.
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
