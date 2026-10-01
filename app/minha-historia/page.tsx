import type { Metadata } from "next";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Minha História — De Obeso a Personal Trainer em Alphaville",
  description:
    "De obeso a Personal Trainer: a história real de quem viveu o problema para poder ajudar outros a superá-lo. Conheça a jornada do Montinho PT em Alphaville.",
  alternates: {
    canonical: `${SITE_URL}/minha-historia`,
  },
  openGraph: {
    title: "Minha História — De Obeso a Personal Trainer em Alphaville | Montinho PT",
    description:
      "A história real de quem viveu o problema para poder ajudar outros a superá-lo. Conheça a jornada do Montinho PT.",
    url: `${SITE_URL}/minha-historia`,
    type: "profile",
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Minha História — Montinho Personal Trainer",
  url: `${SITE_URL}/minha-historia`,
  description:
    "De obeso a Personal Trainer: a história real de quem viveu o problema para poder ajudar outros a superá-lo.",
  mainEntity: {
    "@id": "https://www.montinhopersonal.com.br/#person",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Minha História", item: `${SITE_URL}/minha-historia` },
  ],
};

export default function MinhaHistoria() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Hero */}
      <section className="pt-16 pb-10 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-300 mb-6">
            Minha História
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Eu já estive do outro lado.
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Passei anos tentando mudar meu corpo. Foi esse caminho que me ensinou a trabalhar do jeito que eu trabalho hoje.
          </p>
        </div>
      </section>

      {/* Story Content */}
      <article className="pt-10 pb-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Photo */}
          <div className="mb-12 relative">
            <div className="aspect-[3/4] sm:aspect-[4/3] bg-gray-900 overflow-hidden">
              <Image
                src="/foto-historia-montinho-personal.jpeg"
                alt="Montinho Personal Trainer"
                width={900}
                height={1200}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                className="opacity-90"
                priority
              />
            </div>
          </div>

          {/* Story sections */}
          <div className="prose-custom space-y-12">
            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                O menino que sorria por fora
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Desde criança, eu era o gordinho da turma. Sempre fui muito
                  alegre, comunicativo e brincalhão. Quem me via de fora
                  provavelmente imaginava que eu era uma criança feliz o tempo todo.
                </p>
                <p>
                  Mas, muitas vezes, aquele sorriso era uma forma de esconder
                  como eu realmente me sentia quando me olhava no espelho.
                </p>
                <p>
                  Ser o mais engraçado era, sem perceber, uma maneira de me
                  sentir aceito. De fazer parte do grupo. De compensar uma
                  insegurança que eu carregava comigo todos os dias.
                </p>
                <p>
                  Apesar do sobrepeso, nunca fui parado. Sempre gostei de
                  esportes. Pratiquei artes marciais, musculação e estava
                  constantemente tentando mudar meu corpo. Eu me esforçava,
                  treinava e buscava evoluir.
                </p>
                <p>
                  As pessoas diziam que eu era guerreiro. Que eu tinha força de
                  vontade. Que uma hora daria certo.
                </p>
                <p>
                  Mas, no fundo, havia uma pessoa que ainda não acreditava em
                  si mesma.
                </p>
                <p>
                  Eu olhava para o espelho e não enxergava o resultado que
                  tanto desejava. Por mais que tentasse, parecia que eu nunca
                  conseguia chegar lá.
                </p>
                <p>
                  <strong className="text-white">
                    Mas a verdade é que eu tentava. Deus sabe que eu tentava.
                  </strong>
                </p>
              </div>
            </section>

            <div className="border-l-2 border-white/20 pl-6 py-2">
              <p
                className="text-white text-xl italic leading-relaxed"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                &ldquo;Durante muito tempo achei que me faltava força de vontade.
                Levei anos para entender que mudar o corpo pedia mais do que
                tentar mais uma vez.&rdquo;
              </p>
            </div>

            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                O efeito sanfona que me destruía
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  A adolescência foi marcada por um ciclo que se repetiu por anos: a
                  dieta da moda. Eu embarcava em cada promessa de resultado
                  rápido que aparecia. Passava semanas sofrendo, restringindo,
                  vendo o número na balança cair — e em seguida, recuperava tudo
                  em questão de meses.
                </p>
                <p>
                  E sempre achava que era culpa minha. Que havia falhado. Que
                  não tinha força de vontade suficiente. Essa narrativa me
                  acompanhou por anos, destruindo minha autoestima e minha
                  relação com a alimentação e com o meu próprio corpo.
                </p>
                <p>
                  Na época eu interpretava cada reganho como falta de força de
                  vontade. Só depois fui entender que havia muito mais
                  acontecendo: a estratégia, a rotina, o treino, a alimentação e
                  a própria resposta do corpo.
                </p>
              </div>
            </section>

            {/* Photo gallery mid-story */}
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square bg-gray-900 overflow-hidden">
                <Image
                  src="/foto-historia-4.jpg"
                  alt="Jornada de transformação"
                  width={400}
                  height={400}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="opacity-80"
                />
              </div>
              <div className="aspect-square bg-gray-900 overflow-hidden">
                <Image
                  src="/foto-historia-3.jpg"
                  alt="Jornada de transformação"
                  width={400}
                  height={400}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="opacity-80"
                />
              </div>
            </div>

            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                A virada: decidir entender de vez
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Chegou um momento, por volta dos 29 anos, em que algo quebrou
                  em mim. Não de forma dramática, mas de forma definitiva. Eu
                  estava cansado de tentar e falhar. Cansado de me odiar. Cansado
                  de ser o meu próprio inimigo.
                </p>
                <p>
                  Decidi que, desta vez, eu ia entender de verdade. Fui estudar.
                  Li tudo que encontrei sobre fisiologia do exercício, nutrição
                  esportiva, metabolismo. Fiz cursos. Conversei com profissionais.
                  Estudar me deu direção. Mas o que mudou o jogo foi aplicar
                  aquilo na minha rotina real, observar como meu corpo respondia
                  e continuar ajustando ao longo do caminho.
                </p>
                <p>
                  E as peças começaram a se encaixar.
                </p>
              </div>
            </section>

            <div className="bg-white/5 border border-white/10 p-8">
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div>
                  <p
                    className="text-3xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
                  >
                    +40kg
                  </p>
                  <p className="text-gray-300 text-sm">perdidos na transformação pessoal</p>
                </div>
                <div>
                  <p
                    className="text-3xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
                  >
                    +20 anos
                  </p>
                  <p className="text-gray-300 text-sm">de experiência em musculação</p>
                </div>
                <div>
                  <p
                    className="text-3xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
                  >
                    100+
                  </p>
                  <p className="text-gray-300 text-sm">alunos acompanhados</p>
                </div>
              </div>
            </div>

            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                A transformação que mudou tudo
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Nos 12 meses seguintes, eu transformei meu corpo de uma forma
                  que nunca tinha conseguido antes. Não foi rápido. Não foi fácil.
                  Mas foi sustentável — e isso fez toda a diferença.
                </p>
                <p>
                  Perdi mais de 40 kg e ganhei músculo. Uma das coisas mais
                  importantes que aprendi foi que um plano só tem valor quando
                  consegue funcionar também fora do papel. Aprendi a ouvir os
                  sinais do meu corpo, a me alimentar sem culpa e a treinar com
                  intenção.
                </p>
                <p>
                  Foi olhando para trás que comecei a perceber quantas pessoas
                  também sabem que precisam mudar, tentam de verdade, mas têm
                  dificuldade de transformar isso em algo que consigam sustentar.
                </p>
              </div>
            </section>

            {/* Photo gallery 2 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-[3/4] bg-gray-900 overflow-hidden">
                <Image
                  src="/montinho-personal-trainer-shape.jpg"
                  alt="Montinho Personal Trainer"
                  width={300}
                  height={400}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                  className="opacity-90"
                />
              </div>
              <div className="aspect-[3/4] bg-gray-900 overflow-hidden">
                <Image
                  src="/montinho-personal-trainer-shape-2.jpg"
                  alt="Montinho Personal Trainer"
                  width={300}
                  height={400}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                  className="opacity-90"
                />
              </div>
              <div className="aspect-[3/4] bg-gray-900 overflow-hidden">
                <Image
                  src="/montinho-personal-trainer-shape-3.jpg"
                  alt="Montinho Personal Trainer"
                  width={300}
                  height={400}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                  className="opacity-90"
                />
              </div>
            </div>

            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                Por que me tornei Personal Trainer
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Comecei a ajudar amigos e familiares e vi o mesmo padrão se
                  repetir: pessoas inteligentes e esforçadas, que já sabiam boa
                  parte do que deveriam fazer. Foi aí que percebi que, muitas
                  vezes, informação não era o único problema. Faltava conseguir
                  transformar aquilo em rotina — e ter alguém olhando o que
                  acontecia depois.
                </p>
                <p>
                  Estudei, me formei e aprofundei meus conhecimentos em tudo o
                  que envolve a musculação e a transformação corporal sustentável.
                  Minha busca sempre foi separar o que a ciência realmente
                  comprova daquilo que é apenas mito, modismo ou promessa vazia.
                </p>
                <p>
                  Hoje meu trabalho vai muito além de passar exercícios. Montar o
                  treino é o começo; o que vem depois é que faz diferença. Quando
                  a sua rotina muda, a gente reorganiza. Quando a carga para de
                  subir, a gente investiga por quê. Quando um exercício não
                  encaixa, a gente adapta. E quando você perde uma semana, o plano
                  não acabou: a gente retoma. Foi vivendo esse caminho que eu
                  entendi por que acompanhar o que acontece depois é tão importante.
                </p>
              </div>
            </section>

            <div className="border-l-2 border-white/30 pl-6 py-2">
              <p
                className="text-white text-xl italic leading-relaxed"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                &ldquo;Minha história não é o motivo para você acreditar que vai
                conseguir. É o motivo de eu trabalhar do jeito que trabalho hoje.&rdquo;
              </p>
            </div>

            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                O que me diferencia
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Ter emagrecido não me faz, sozinho, um bom treinador. O que
                  sustenta o meu trabalho é a soma da minha formação acadêmica,
                  de mais de 20 anos de musculação, de cursos em treinamento e
                  de anos acompanhando alunos com objetivos, rotinas e corpos
                  diferentes.
                </p>
                <p>
                  A minha história entra em outro lugar: ela me deixou atento ao
                  que acontece entre saber o que fazer e conseguir fazer. Eu sei
                  como é acordar sem querer se olhar no espelho, e conheço o ciclo
                  de culpa e frustração.
                </p>
                <p>
                  Por isso, quando um aluno some uma semana, eu não tiro uma
                  conclusão automática. Primeiro quero entender o que aconteceu.
                  Às vezes o treino precisa mudar. Às vezes a rotina mudou. E às
                  vezes a pessoa só precisa retomar.
                </p>
                <p>
                  Quem treina comigo já ouviu a palavra:{" "}
                  <strong className="text-white">chalalá</strong>. É como eu chamo
                  o algo a mais que faz diferença — a carga que sobe, a técnica no
                  fim da série, a repetição que você jurava não ter. Não é segredo,
                  e faço questão de dizer isso: segredo é o que alguém esconde,
                  chalalá é o que você acrescenta de propósito. O básico bem feito
                  já leva você longe. O chalalá é o detalhe que faz o treino render de verdade.
                </p>
              </div>
            </section>

            {/* Fecho da história. O bordão "é impossível dar errado" aparece
                UMA vez, enquadrado como bordão e com a condição colada — nunca
                como garantia de prazo, peso ou resultado. */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                O que aprendi no caminho
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Que um bom plano precisa caber na vida real, não numa semana
                  imaginária que você não consegue sustentar. Plano bonito no
                  papel e impossível na rotina não serve para ninguém.
                </p>
                <p>
                  Que seguir o plano não é viver perfeito. Se num dia o treino
                  precisa ser mais curto, ele pode ser mais curto. Se você saiu do
                  caminho, isso não significa abandonar tudo. O que mais pesa não é
                  errar: é quanto tempo você fica fora antes de voltar. Por isso eu
                  falo tanto em recomeçar rápido.
                </p>
                <p>
                  Que o corpo às vezes responde diferente do que a gente imaginava,
                  e tudo bem. A resposta é informação: muda o volume, a carga, a
                  frequência, o cardio ou a recuperação entre os treinos. O treino
                  evolui junto com você.
                </p>
                <p>
                  É daí que vem um bordão meu:{" "}
                  <strong className="text-white">
                    &ldquo;fazendo o que precisa ser feito, por tempo suficiente, é
                    impossível dar errado&rdquo;
                  </strong>
                  . Não é uma garantia de prazo, peso ou resultado específico. É o
                  meu jeito de lembrar que o caminho não precisa ser perfeito: ele
                  precisa continuar sendo ajustado e executado.
                </p>
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-16 pt-12 border-t border-white/10 text-center">
            <p
              className="text-white text-xl sm:text-2xl italic leading-relaxed mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
            >
              &ldquo;Seu shape merece um chalalá.&rdquo;
            </p>
            <p className="text-gray-300 text-lg mb-6">
              Se alguma parte dessa história parece familiar, me conta onde você
              está hoje. A gente conversa e vê como eu posso te acompanhar.
            </p>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Falar com o Montinho
            </a>
          </div>
        </div>
      </article>
    </>
  );
}
