import type { Metadata } from "next";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Minha História",
  description:
    "De obeso a Personal Trainer: a história real de quem viveu o problema para poder ajudar outros a superá-lo. Conheça a jornada do Montinho PT.",
};

export default function MinhaHistoria() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-6">
            Minha História
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Eu já estive do outro lado.
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            E sei exatamente o que você está sentindo agora.
          </p>
        </div>
      </section>

      {/* Story Content */}
      <article className="py-20 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Image */}
          <div className="mb-16 relative">
            <div className="aspect-video bg-gray-900 overflow-hidden">
              <img
                src="https://placehold.co/1200x675/1a1a1a/333333?text=Montinho+Personal+Trainer"
                alt="Montinho Personal Trainer"
                className="w-full h-full object-cover opacity-70"
              />
            </div>
          </div>

          {/* Story sections */}
          <div className="prose-custom space-y-12">
            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                A criança que não se encaixava
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Desde pequeno, eu era diferente. Enquanto os outros corriam
                  pelo parque com leveza, eu ficava mais perto do banco, evitando
                  o cansaço e o constrangimento. A obesidade chegou cedo — e com
                  ela, vieram a vergonha, as piadas, e aquela sensação amarga de
                  não pertencer.
                </p>
                <p>
                  Cresci ouvindo que era preguiçoso. Que faltava força de
                  vontade. Que era só eu querer e parar de comer tanto. Mas a
                  verdade é que eu tentava. Deus sabe que eu tentava.
                </p>
              </div>
            </section>

            <div className="border-l-2 border-white/20 pl-6 py-2">
              <p
                className="text-white text-xl italic leading-relaxed"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                "Cresci acreditando que o problema era eu. Levei anos para
                entender que o problema era a abordagem."
              </p>
            </div>

            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                O efeito sanfona que me destruía
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  A adolescência foi marcada pelo ciclo mais cruel que existe: a
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
                  O efeito sanfona não era um sinal de fraqueza. Era biologia.
                  Mas eu não sabia disso ainda.
                </p>
              </div>
            </section>

            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                A virada: decidir entender de vez
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Chegou um momento — eu tinha uns 22 anos — que algo quebrou
                  em mim. Não de forma dramática, mas de forma definitiva. Eu
                  estava cansado de tentar e falhar. Cansado de me odiar. Cansado
                  de ser o meu próprio inimigo.
                </p>
                <p>
                  Decidi que, desta vez, eu ia entender de verdade. Fui estudar.
                  Li tudo que encontrei sobre fisiologia do exercício, nutrição
                  esportiva, metabolismo. Fiz cursos. Conversei com profissionais.
                  E fui aplicando tudo isso em mim mesmo — não como cobaio, mas
                  como alguém que finalmente estava recebendo as informações certas.
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
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    +20kg
                  </p>
                  <p className="text-gray-400 text-sm">perdidos na transformação pessoal</p>
                </div>
                <div>
                  <p
                    className="text-3xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    +5 anos
                  </p>
                  <p className="text-gray-400 text-sm">de estudo e prática profissional</p>
                </div>
                <div>
                  <p
                    className="text-3xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    100+
                  </p>
                  <p className="text-gray-400 text-sm">alunos transformados</p>
                </div>
              </div>
            </div>

            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
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
                  Perdi mais de 20kg de gordura. Ganhei músculo. Mas mais do que
                  a mudança física, o que aconteceu dentro de mim foi mais
                  profundo: aprendi a respeitar meu corpo, a entender seus sinais,
                  a me alimentar sem culpa e a treinar com inteligência.
                </p>
                <p>
                  Olhei para trás e pensei: quantas outras pessoas estão passando
                  pelo que eu passei? Quantas estão se culpando por algo que não
                  é culpa delas, mas de uma abordagem errada?
                </p>
              </div>
            </section>

            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Por que me tornei Personal Trainer
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Comecei a ajudar amigos e familiares. E vi o mesmo padrão se
                  repetir: pessoas inteligentes, esforçadas, cheias de boa
                  vontade — mas sem as informações corretas e sem alguém
                  acompanhando de perto.
                </p>
                <p>
                  Me formei em Educação Física e mergulhei fundo em tudo que se
                  relaciona à transformação corporal sustentável. Fui buscar o
                  que a ciência realmente comprova — e o que é apenas mito e
                  modismo.
                </p>
                <p>
                  Hoje meu trabalho vai muito além de passar exercícios. Estou do
                  lado das pessoas que querem mudar. Entendo o peso emocional que
                  isso carrega. Sei o que é se olhar no espelho e não se
                  reconhecer. E sei o que é finalmente chegar do outro lado.
                </p>
              </div>
            </section>

            <div className="border-l-2 border-white/30 pl-6 py-2">
              <p
                className="text-white text-xl italic leading-relaxed"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                "Não é sobre ter o corpo perfeito. É sobre ter um corpo que
                respeita, que tem energia, que te permite viver plenamente."
              </p>
            </div>

            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                O que me diferencia
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Não sou apenas alguém com formação acadêmica. Sou alguém que
                  viveu o problema. Que sabe como é acordar de manhã sem querer
                  se olhar no espelho. Que entende o ciclo de culpa, vergonha e
                  frustração.
                </p>
                <p>
                  E justamente por isso, posso te ajudar de um lugar que vai além
                  do técnico. Porque entendo o humano por trás do processo.
                </p>
                <p>
                  Se você está cansado de tentar e não conseguir, não é porque
                  você é fraco. É porque ninguém te mostrou o caminho certo ainda.
                  E é exatamente para isso que estou aqui.
                </p>
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-16 pt-12 border-t border-white/10 text-center">
            <p className="text-gray-300 text-lg mb-6">
              Se você se identificou com alguma parte dessa história, quero
              conversar com você.
            </p>
            <a
              href={getWhatsAppUrl("Olá! Li sua história no site e me identifiquei muito. Quero conversar sobre como você pode me ajudar.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Quero Conversar
            </a>
          </div>
        </div>
      </article>
    </>
  );
}
