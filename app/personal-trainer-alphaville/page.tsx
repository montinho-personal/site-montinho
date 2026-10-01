import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";
import FAQ from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import { ligacoesDoPerfil } from "@/lib/perfil-google";
import LinkFerramentaRotina from "@/components/rotina/LinkFerramentaRotina";
import VideoRecomecar from "@/components/video/VideoRecomecar";

export const metadata: Metadata = {
  title: { absolute: "Personal Trainer em Alphaville: Planos e Atendimento | Montinho" },
  description:
    "Personal trainer em Alphaville com mais de 20 anos de experiência: treino na sua academia, no condomínio ou em casa. Veja os tipos de plano, quanto custa treinar 3x por semana e fale no WhatsApp.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-alphaville`,
  },
  openGraph: {
    title: "Personal Trainer em Alphaville | Montinho Personal Trainer",
    description:
      "Personal trainer presencial em Alphaville: eu do seu lado em cada série, ajustando carga e execução na hora. No condomínio, em casa, na Arena 18 ou na sua academia.",
    url: `${SITE_URL}/personal-trainer-alphaville`,
  },
};

const faq = [
  {
    question: "Onde são realizados os treinos presenciais em Alphaville?",
    answer:
      "No espaço fitness do seu condomínio, em casa, na Arena 18 ou em outras academias da região que permitam personal externo. Na primeira conversa, alinhamos o local mais conveniente para a sua rotina.",
  },
  {
    question: "Quanto custa um personal trainer em Alphaville?",
    answer:
      "O investimento varia conforme o formato de atendimento (domicílio, condomínio ou academia), a frequência semanal e os objetivos de cada aluno. Por isso não trabalho com tabela fechada: na primeira conversa entendo o seu cenário e apresento uma proposta sob medida, sem compromisso.",
  },
  {
    question: "Qual o valor de 1 hora de personal trainer em Alphaville?",
    answer:
      "Depende do local do treino, da frequência semanal e do tipo de plano: pacote por frequência, pacote flexível ou consultoria online. Sessão avulsa custa mais por hora do que pacote. Me chame no WhatsApp e eu apresento os planos para o seu caso.",
  },
  {
    question: "Quanto custa um personal trainer 3 vezes por semana?",
    answer:
      "Três treinos por semana é a frequência mais procurada, e no pacote semanal o valor por sessão fica menor do que na aula avulsa. A proposta exata depende do local e do horário — é só chamar no WhatsApp.",
  },
  {
    question: "É vantajoso pagar um personal trainer?",
    answer:
      "Vale quando você quer alguém olhando a sua execução, ajustando a carga no ritmo certo e mudando o plano quando a vida muda. É mais caro que treinar sozinho, e para muita gente é o que finalmente faz o treino sair do papel.",
  },
  {
    question: "Você atende em condomínios residenciais de Alphaville e no Tamboré?",
    answer:
      "Sim. Muitos alunos preferem treinar no espaço fitness do próprio condomínio ou em casa, com o treino adaptado à estrutura disponível. Atendo moradores dos residenciais de Alphaville e Tamboré e também de condomínios da região de Aldeia da Serra, em Santana de Parnaíba.",
  },
  {
    question: "Quantas vezes por semana preciso treinar para ter resultado?",
    answer:
      "Depende do objetivo e do ponto de partida. Para a maioria dos alunos, entre duas e quatro sessões semanais bem estruturadas geram evolução consistente de força, condicionamento físico e composição corporal. Mais importante que a quantidade é a regularidade e a qualidade da execução — e é nisso que o presencial mais ajuda.",
  },
  {
    question: "Nunca treinei na vida. Consigo acompanhar?",
    answer:
      "Sim — e começar com acompanhamento é a forma mais segura de fazer isso. Iniciantes evoluem rápido quando o protocolo respeita o ponto de partida: aprendemos primeiro a técnica e a postura, construímos base de força e mobilidade, e só então aumentamos a intensidade com progressão de carga gradual.",
  },
  {
    question: "Você trabalha com idosos e com pessoas com dores ou limitações?",
    answer:
      "Sim. Tenho cursos voltados especificamente para o treinamento de pessoas com dores e limitações musculoesqueléticas, e atendo alunos de diferentes idades, inclusive acima dos 50, 60 e 70 anos. O treino de força bem orientado ajuda na autonomia, no equilíbrio e na qualidade de vida nessa fase, sempre respeitando o histórico de cada um e, quando necessário, junto com a orientação do profissional de saúde.",
  },
  {
    question: "E se eu viajar muito ou não estiver em Alphaville toda semana?",
    answer:
      "Isso é comum na região — e tem solução. Além do presencial, ofereço consultoria online com protocolo individualizado, ajustes contínuos e suporte à distância. Muitos alunos combinam os dois formatos: presencial quando estão em Alphaville, online quando estão viajando.",
  },
  {
    question: "Você atende alunos que já treinam há anos sem resultado?",
    answer:
      "Sim. Esse é exatamente o perfil de muitos dos meus alunos em Alphaville: pessoas que frequentam academia há meses ou anos mas que nunca tiveram alguém olhando a execução e ajustando a progressão de perto. Nesse cenário, essa atenção costuma fazer muita diferença.",
  },
  {
    question: "É possível contratar personal trainer em Alphaville para treinos na minha própria academia?",
    answer:
      "Em muitos casos, sim. Além da Arena 18 e dos atendimentos em condomínios, também posso acompanhar alunos em outras academias que permitam personal externo. Me diga onde você treina e verificamos as regras do local.",
  },
  {
    question: "Qual é o diferencial do seu trabalho comparado a outros personal trainers em Alphaville?",
    answer:
      "Conheço Alphaville há mais de duas décadas — a rotina, o ritmo e as demandas reais de quem vive aqui. Meu acompanhamento combina método científico com sensibilidade para a realidade do aluno: agenda cheia, viagens, família, limitações físicas. E eu estou ali durante o treino, ajustando o que nenhum papel consegue prever.",
  },
  {
    question: "O treino personalizado em Alphaville é indicado para qual perfil de aluno?",
    answer:
      "Para qualquer pessoa que queira sair do lugar: seja quem nunca treinou, quem voltou após anos afastado, quem tem histórico de lesões ou quem já treina mas não vê resultado. Adapto o ponto de partida a cada aluno.",
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
  // Mesma entidade que o LocalBusiness do layout, vista por uma região:
  // sameAs/hasMap apontam para o Perfil da Empresa quando a URL existe.
  parentOrganization: { "@id": `${SITE_URL}/#localbusiness` },
  ...ligacoesDoPerfil(),
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
            Atendimento presencial no espaço fitness do seu condomínio, em casa, na Arena 18 ou, dependendo das regras do local, em outras academias da região. Eu fico do seu lado em cada série, olhando a execução, ajustando a carga e decidindo com você o próximo passo, num treino que cabe na agenda que você realmente tem.
          </p>
          <a
            href={getWhatsAppUrl()} data-wa-origem="topo" data-cta-id="personal-trainer-alphaville:topo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero treinar com o Montinho
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
                Alphaville tem um ritmo que quem não vive aqui não entende. A saída para São Paulo às 6h30, o trânsito de volta que ninguém controla, a academia que fecha às 22h, o jantar que acontece só depois das 21h. Quando você mora no mesmo lugar há mais de duas décadas, você entende que conhecer o treino é só metade. A outra metade é conhecer a realidade onde esse treino precisa acontecer.
              </p>
              <p>
                Minha paixão pela musculação não nasceu de um livro. Nasceu de necessidade. Cresci convivendo com o excesso de peso, passei anos tentando dietas e protocolos que prometiam resultado rápido e entregavam frustração. Foi só quando decidi estudar de verdade — entender como o corpo funciona, o que a ciência diz sobre treino e composição corporal — que as coisas mudaram. Foi aí que entendi algo que uso até hoje com cada aluno: uma coisa é saber o que precisa ser feito. Outra é conseguir colocar isso na rotina, semana após semana.
              </p>
              <p>
                Hoje trabalho com pessoas de agenda cheia e pouca margem para perder tempo. Meu trabalho não é contar repetições. É entender o que cada série está mostrando e decidir o próximo passo com você.
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
            Um treino pode estar perfeito no papel. Mas alguém precisa ver o que acontece quando você executa. É isso que o presencial muda.
          </p>

          <div className="space-y-8">
            {[
              {
                num: "01",
                title: "Conversa e avaliação",
                text: "Antes do primeiro exercício, preciso entender com quem estou trabalhando: histórico de treino, objetivo, rotina, disponibilidade, onde você vai treinar e qualquer limitação relevante para o treino. Junto vem a avaliação física, com composição corporal. Essa conversa dura entre 30 e 60 minutos — é uma conversa, não um formulário.",
              },
              {
                num: "02",
                title: "Um ponto de partida, não uma sentença",
                text: "Com base nessa conversa, definimos o ponto de partida: exercícios, cargas e frequência pensados para você. Mas o primeiro treino é uma hipótese bem construída. É a sua execução que mostra o que deve continuar e o que precisa mudar.",
              },
              {
                num: "03",
                title: "A sessão, com alguém olhando para você",
                text: "Durante a sessão eu estou ali, olhando para você — não para o celular. Observo execução, carga, ritmo, intervalo e como você está respondendo naquele dia. A série ainda tinha margem? Avançamos. A execução começou a mudar no fim? Corrijo antes da próxima repetição. Chegou cansado depois de um dia pesado? O treino daquele dia muda. São decisões pequenas, tomadas na hora, que nenhum treino no papel consegue prever.",
              },
              {
                num: "04",
                title: "Registrar, comparar, ajustar",
                text: "Cargas, execução e como você respondeu ficam registrados. Nas reavaliações periódicas a gente compara, vê o que funcionou e decide o próximo ciclo. Ninguém faz o mesmo treino por meses só porque ele estava no papel.",
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
            Tem uma coisa que o presencial muda e pouca gente fala: quando existe um horário marcado e alguém esperando por você, o treino deixa de depender só da vontade daquele dia. O ponto em comum de quem me procura aqui quase nunca é a profissão — é a agenda apertada e a vontade de que o tempo de treino valha a pena. Trabalho com:
          </p>
          <ul className="space-y-4 mb-10">
            {[
              "Quem quer emagrecer com método — sem dietas radicais que não sustentam",
              "Quem busca hipertrofia real, não apenas volume aparente de treino",
              "Quem voltou ao treino após anos parado e precisa reconstruir a base com segurança",
              "Quem tem histórico de lesão ou alguma limitação e quer treinar com execução orientada e exercícios adaptados",
              "Quem já treina mas chegou num platô onde parece que nada mais evolui",
              "Quem quer treinar com alguém olhando de perto, desde o primeiro dia",
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
              Atendo em toda a malha de Alphaville e arredores — dos residenciais próximos ao Iguatemi Alphaville à região do Shopping Tamboré, passando pelos condomínios do Tamboré e pela Aldeia da Serra. Você pode treinar comigo na Arena 18, no espaço fitness do seu condomínio, em casa ou, dependendo das regras do local, em outras academias da região. Se você já treina em uma academia, me conta qual é e eu verifico com você a possibilidade de atendimento.
            </p>
          </div>
          <h3 className="text-white font-semibold text-lg mb-4">Área de atendimento e vias de acesso</h3>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base mb-10">
            <p>
              Atendo Alphaville, Tamboré, Barueri e Santana de Parnaíba — regiões vizinhas, ligadas pela Rodovia Castelo Branco e pelas alamedas centrais, como a Rio Negro e a Araguaia.
            </p>
            <p>
              O horário de cada aluno é combinado levando em conta a rotina e o trânsito real da região, que muda bastante conforme a hora do dia.
            </p>
          </div>
          <h3 className="text-white font-semibold text-lg mb-4">Formatos de atendimento na região</h3>
          <ul className="space-y-4 mb-10">
            {[
              "Atendimento em domicílio — treino em casa, com estrutura adaptada ao espaço e aos equipamentos disponíveis",
              "Condomínio — atendimento no espaço fitness do seu condomínio, usando a estrutura que você já tem a poucos metros de casa",
              "Arena 18 — atendimento presencial na Arena 18, em Alphaville",
              "Outras academias — já treina em outra academia? Dependendo das regras para personal externo, também podemos fazer o atendimento lá. Me diga onde você treina e verificamos a possibilidade",
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
              Atendo moradores dos residenciais de Alphaville — do{" "}
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
              Na vizinhança imediata, também atendo moradores dos condomínios do Tamboré — como o{" "}
              <Link href="/blog/personal-trainer-quintas-de-tambore" className="text-white underline underline-offset-4 hover:text-gray-300">Quintas de Tamboré</Link>, o{" "}
              <Link href="/blog/personal-trainer-boulevard-tambore" className="text-white underline underline-offset-4 hover:text-gray-300">Boulevard Tamboré</Link> e o{" "}
              <Link href="/blog/personal-trainer-resort-tambore" className="text-white underline underline-offset-4 hover:text-gray-300">Tamboré Resort</Link> — em geral no espaço fitness do próprio condomínio ou na residência do aluno. A academia já está a poucos metros de casa; meu trabalho é fazer aquele espaço realmente funcionar para você.
            </p>
          </div>
          <h3 className="text-white font-semibold text-lg mb-4">Guia das academias de Alphaville</h3>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base mb-10">
            <p>
              Hoje meu atendimento presencial em academia é confirmado na{" "}
              <Link href="/blog/arena-18-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Arena 18</Link>; em outras academias, depende das regras do local para personal externo. Se você está escolhendo onde treinar, preparei guias informativos das academias da região, como a{" "}
              <Link href="/blog/ironberg-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Ironberg Alphaville</Link>, a{" "}
              <Link href="/blog/bodytech-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Bodytech</Link>, a{" "}
              <Link href="/blog/bio-ritmo-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Bio Ritmo</Link>, a{" "}
              <Link href="/blog/smart-fit-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Smart Fit</Link>, a{" "}
              <Link href="/blog/bluefit-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Bluefit</Link>, a{" "}
              <Link href="/blog/academia-gavioes-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">Gaviões</Link> e a{" "}
              <Link href="/blog/nitrogym-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">NitroGym</Link>.
            </p>
            <p>
              Cada uma tem estrutura e perfil de público diferentes. Os guias são informativos e não indicam que eu atendo nesses locais: se você já treina em alguma delas, me conta e verificamos juntos a possibilidade.
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
              Muita gente que me procura aqui passa o dia sentada, em reunião ou no carro — e chega com{" "}
              <Link href="/blog/postura-trabalho-sentado-exercicios" className="text-white underline underline-offset-4 hover:text-gray-300">desconforto de quem trabalha sentado</Link>, ganho de peso gradual e disposição em queda.
            </p>
            <p>
              Outros querem treinar junto com a família no condomínio, ou voltar a treinar depois de anos parados. E muita gente acima dos 50 procura o treino de força para manter a autonomia. Os objetivos mudam — emagrecer, ganhar massa, ganhar força ou simplesmente conseguir manter a rotina — e o treino parte de cada um deles.
            </p>
          </div>
          <h3 className="text-white font-semibold text-lg mb-4">Dicas práticas para treinar na região</h3>
          <ul className="space-y-4">
            {[
              "As academias de Alphaville lotam entre 6h e 8h e depois das 18h — quem tem flexibilidade encontra equipamentos livres entre 10h e 16h, e é aí que muitos dos meus alunos treinam com mais qualidade",
              "Se o seu residencial tem espaço fitness, use-o a favor: eliminar o deslocamento é o fator que mais aumenta a constância — e adapto o protocolo aos equipamentos disponíveis",
              "Para caminhadas e trabalho aeróbico ao ar livre, as alamedas arborizadas dos residenciais e o calçadão da região central funcionam muito bem no início da manhã",
              "Chegou de viagem ou passou a semana fora? Uma sessão de mobilidade articular antes de retomar a carga ajuda a voltar de forma progressiva",
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
              Musculação e treinamento personalizado não são sinônimos de estética apenas. O trabalho envolve emagrecimento, hipertrofia, ganho de força e resistência, mobilidade, flexibilidade e condicionamento físico — sempre partindo de uma avaliação física completa, com análise de composição corporal e percentual de gordura.
            </p>
            <p>
              A partir daí entra a periodização: o planejamento que organiza fases de treino, progressão de carga e recuperação muscular para o corpo continuar evoluindo com segurança. É um método refinado e validado na prática, ao longo do atendimento de alunos.
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
              Dor lombar depois de horas sentado no escritório, ombro que reclama, joelho que trava na escada — são queixas frequentes de quem passa o dia sentado. E a resposta certa raramente é ficar parado: é treinar com orientação adequada.
            </p>
            <p>
              Tenho cursos voltados especificamente para o treinamento de pessoas com dores e limitações musculoesqueléticas. E, mais do que isso, já vivenciei na pele muitas dessas dores ao longo da minha própria trajetória de treinos — o que aumenta a minha compreensão real das dificuldades que os alunos enfrentam.
            </p>
            <p>
              Na prática, isso significa considerar o seu histórico, adaptar exercícios, orientar a execução de perto e respeitar os limites de cada fase. Quando a dor pede avaliação de um profissional de saúde, eu encaminho — e o treino caminha junto com essa orientação. Para se aprofundar, leia sobre{" "}
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
            Dor lombar e musculação: 5 cuidados que eu passo para os meus alunos
          </h2>
          <p className="text-gray-300 leading-relaxed mb-8">
            Além de acompanhar meus alunos presencialmente e online, também compartilho dicas práticas de treino, emagrecimento e hipertrofia. Assista ao vídeo abaixo para conhecer um pouco mais do meu trabalho.
          </p>
          <YoutubeShortEmbed videoId="MrfzaQWFqPs" title="Dor lombar e musculação: 5 cuidados — Montinho Personal Trainer" />
        </div>
      </section>

      {/* PLANOS E VALOR */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Planos e valor
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Quanto custa um personal trainer em Alphaville?
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base">
            <p>
              Não existe um preço único, e desconfie de quem responde sem perguntar nada. O valor de uma hora de personal trainer em Alphaville muda com três coisas: <strong className="text-white">onde</strong> o treino acontece (na sua academia, no condomínio ou em casa), <strong className="text-white">quantas vezes por semana</strong> você treina e se você precisa de flexibilidade de agenda.
            </p>
            <h3 className="text-white font-semibold text-lg pt-2">Os tipos de plano</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Pacote por frequência semanal</strong> (de 2 a 5 treinos): quanto mais treinos na semana, menor o valor por sessão. É o formato de quem quer treinar 3 vezes por semana com horário fixo.</li>
              <li><strong className="text-white">Pacote flexível</strong>: um número de aulas para usar no ritmo possível, para quem viaja ou tem agenda irregular.</li>
              <li><strong className="text-white">Consultoria online</strong>: o formato mais acessível, com treino montado e acompanhado à distância, para quem já treina sozinho ou mora fora da região. <Link href="/consultoria-online" className="text-white underline underline-offset-4 hover:text-gray-300">Veja como funciona</Link>.</li>
            </ul>
            <h3 className="text-white font-semibold text-lg pt-2">Quanto custa treinar 3 vezes por semana?</h3>
            <p>
              É a frequência mais procurada e, na maioria dos casos, a que dá resultado sem pesar na rotina. O valor depende do local e do horário; a proposta exata para o seu caso sai numa conversa rápida pelo WhatsApp, sem compromisso.
            </p>
            <h3 className="text-white font-semibold text-lg pt-2">É vantajoso pagar um personal trainer?</h3>
            <p>
              Vale quando você quer alguém olhando a sua execução, ajustando a carga no ritmo certo e mudando o plano quando a vida muda. É mais caro que treinar sozinho — e, para muita gente, é o que finalmente faz o treino sair do papel.
            </p>
            <h3 className="text-white font-semibold text-lg pt-2">Onde o treino acontece</h3>
            <p>
              No seu condomínio, em casa, na Arena 18 ou em outra academia que permita personal externo. Quer conhecer as academias da região? Veja quais <Link href="/blog/academia-com-personal-trainer-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">academias de Alphaville aceitam personal externo</Link> e as{" "}
              <Link href="/blog/academias-premium-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">academias premium</Link>. Prefere ser atendida por uma abordagem pensada para mulheres? Veja o{" "}
              <Link href="/blog/personal-trainer-feminino-alphaville" className="text-white underline underline-offset-4 hover:text-gray-300">personal trainer feminino em Alphaville</Link>.
            </p>
          </div>
          <a
            href={getWhatsAppUrl("Olá, Montinho! Vi a página de personal trainer em Alphaville e queria conhecer os tipos de plano.")}
            data-wa-origem="planos" data-cta-id="personal-trainer-alphaville:planos"
            target="_blank" rel="noopener noreferrer"
            className="inline-block mt-8 px-6 py-3 rounded-lg font-semibold text-black"
            style={{ background: "#BA9E50" }}
          >
            Conversar sobre o presencial
          </a>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <LinkFerramentaRotina slug="personal-trainer-alphaville" tipo="personal" />
      </div>


      {/* FAQ */}
      <VideoRecomecar />
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
          <FAQ itens={faq} placement="personal-trainer-alphaville" />
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
            A primeira conversa é sem compromisso. Me conta o que você quer, onde treinaria e como é a sua agenda — e a gente vê se o presencial faz sentido para você. Se preferir, envie sua mensagem pela{" "}
            <Link href="/contato" className="text-white underline underline-offset-4 hover:text-gray-300">
              página de contato
            </Link>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl()} data-wa-origem="fim" data-cta-id="personal-trainer-alphaville:fim"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
            >
              Falar com o Montinho
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
        {/* Secundário por desenho: vem depois do CTA de conversão e sem
            peso visual. Quem quer mostrar para alguém antes de decidir
            tem caminho; quem quer falar comigo continua vendo o botão
            principal primeiro. */}
        <div className="flex justify-center pb-10">
          <Compartilhar
            contexto="local"
            titulo="Personal Trainer em Alphaville"
            caminho="/personal-trainer-alphaville"
            local="local_page"
            aparencia="discreto"
            rotulo="Enviar esta página para alguém"
          />
        </div>

    </>
  );
}
