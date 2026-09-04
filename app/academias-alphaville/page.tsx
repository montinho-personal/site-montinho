import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { montarGuia } from "@/lib/academias/guia";
import IndiceRegiao from "@/components/regiao/IndiceRegiao";
import { GUIAS_DE_ACADEMIA } from "@/lib/regiao";

/**
 * Guia das academias de Alphaville.
 *
 * Página editorial, não ferramenta. Ela existe porque as 16 unidades já têm
 * análise própria publicada no site — o trabalho já estava feito, faltava um
 * lugar que respondesse "qual delas?" antes de o leitor abrir 16 artigos.
 *
 * O que ela deliberadamente NÃO faz: horário, preço em reais, estrutura exata
 * e nota de qualidade. Esses dados mudam e só a academia confirma. Onde a
 * pessoa precisar deles, a página manda confirmar na unidade — e é por isso
 * que ela pode ir ao ar sem depender de uma base de dados completa.
 */
export const metadata: Metadata = {
  title: "Academias de Alphaville: Guia Por Perfil de Treino",
  description:
    "As academias de Alphaville organizadas por proposta: econômicas, custo-benefício, premium e formatos específicos. Para quem cada uma faz sentido — e para quem não faz.",
  alternates: { canonical: `${SITE_URL}/academias-alphaville` },
  openGraph: {
    title: "Academias de Alphaville: Guia Por Perfil de Treino | Montinho",
    description:
      "Qual academia de Alphaville combina com você? Um guia honesto por proposta, escrito por quem treina alunos na região.",
    url: `${SITE_URL}/academias-alphaville`,
    type: "article",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function AcademiasAlphavillePage() {
  const guia = montarGuia();
  const total = guia.reduce((acc, g) => acc + g.entradas.length, 0);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Academias de Alphaville", item: `${SITE_URL}/academias-alphaville` },
    ],
  };

  /**
   * ItemList sem rating: a página lista, não avalia. Marcar nota aqui seria
   * inventar um dado que a página inteira se recusa a dar.
   */
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Academias de Alphaville analisadas pelo Montinho",
    numberOfItems: total,
    itemListElement: guia
      .flatMap((g) => g.entradas)
      .map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: e.academia.nome,
        url: `${SITE_URL}/blog/${e.academia.artigoSlug}`,
      })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Hero */}
      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            {total} academias analisadas
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Academias de Alphaville: qual delas combina com você?
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-3">
            Não existe melhor academia de Alphaville. Existe a que se encaixa no
            seu objetivo, no seu trajeto e no seu jeito de treinar — e são coisas
            diferentes para pessoas diferentes.
          </p>
          <p className="text-gray-400 text-base leading-relaxed">
            Organizei as {total} por proposta, não por nota. Em cada uma: para
            quem tende a fazer sentido, para quem não, e o link da análise
            completa.
          </p>
        </div>
      </section>

      {/* Aviso de escopo — honestidade antes do conteúdo, não depois */}
      <section className="py-8 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-2 pl-5 py-1" style={{ borderColor: "#BA9E50" }}>
            <p className="text-gray-300 text-sm leading-relaxed">
              <strong className="text-white">Preços, horários e estrutura exata? Consulte a
              unidade.</strong>{" "}
              Esses dados mudam com frequência e só a academia pode confirmar —
              por isso você não vai encontrar nenhum deles aqui. O que este guia
              traz é a proposta de cada academia, que é a parte estável e a que
              de fato decide se você vai gostar de treinar lá.
            </p>
          </div>
        </div>
      </section>

      {/* Grupos */}
      <section className="pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-14">
          {guia.map(({ grupo, entradas }) => (
            <div key={grupo.id} id={grupo.id} className="scroll-mt-24">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
                {grupo.chamada}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4" style={h}>
                {grupo.titulo}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-3">{grupo.descricao}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                <strong className="text-gray-200">O trade-off honesto:</strong> {grupo.tradeOff}
              </p>

              <div className="flex flex-col gap-5">
                {entradas.map((e) => (
                  <div
                    key={e.id}
                    className="relative border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8"
                  >
                    <div className="absolute top-0 left-0 h-[2px] w-12" style={{ background: "#BA9E50" }} aria-hidden="true" />
                    <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-1" style={h}>
                      {e.academia.nome}
                    </h3>
                    <p className="text-gray-400 text-sm mb-5">
                      {e.regiaoLabel} · {e.academia.tipo === "rede" ? "rede nacional" : "academia local"}
                    </p>

                    <p className="text-gray-300 leading-relaxed mb-3">
                      <strong className="text-white">Tende a fazer sentido para:</strong> {e.paraQuem}
                    </p>
                    <p className="text-gray-400 leading-relaxed mb-6">
                      <strong className="text-gray-200">Pense duas vezes se:</strong> {e.penseDuasVezes}
                    </p>

                    <Link
                      href={`/blog/${e.academia.artigoSlug}`}
                      className="inline-flex items-center text-sm font-semibold text-white underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                      style={{ textDecorationColor: "#BA9E50" }}
                    >
                      Ler a análise completa da {e.academia.nome}
                      <span aria-hidden="true">&nbsp;→</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ponte para o comparador — depois dos grupos, nunca antes: quem ainda
          não leu as opções não tem o que comparar. */}
      <section className="pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-7 sm:p-9">
            <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
              Gratuito · sem cadastro
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4" style={h}>
              Ainda em dúvida entre duas ou três?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Responda algumas perguntas sobre a sua rotina — em que região você
              passa o dia, que horas consegue treinar, o que não pode faltar — e
              veja quais destas academias mais combinam, critério por critério.
              Sem nota, sem ranking: só o que bate e o que não bate com o que
              você pediu.
            </p>
            <Link
              href="/academia-ideal-alphaville"
              className="inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[52px]"
            >
              Comparar academias <span aria-hidden="true">&nbsp;→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Guias por necessidade.
          Esta página responde "qual academia?"; estes 33 guias respondem a
          pergunta que vem antes dela — "qual delas tem piscina?", "qual abre
          às 5h?". Eram artigos que nenhuma outra página do site linkava, e
          este é o lugar natural deles: mesma região, mesma decisão, um passo
          antes. */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-3" style={h}>
            Guias por necessidade
          </h2>
          <p className="text-gray-300 leading-relaxed mb-10">
            Se o que decide não é a marca da academia e sim um detalhe — o
            horário que você consegue, a piscina, o trajeto do trabalho —
            comece por aqui.
          </p>
          <IndiceRegiao grupos={GUIAS_DE_ACADEMIA} />
        </div>
      </section>

      {/* Conteúdo de apoio */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Por que não tem ranking aqui
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Porque ranking de academia é quase sempre uma opinião disfarçada de
              medida. &ldquo;Melhor academia de Alphaville&rdquo; só significa alguma coisa
              depois de completar a frase: melhor <strong className="text-white">para
              quem</strong>, e <strong className="text-white">para quê</strong>. A academia que
              é perfeita para quem treina para hipertrofia às 22h é a errada para
              quem quer aula de dança no fim da tarde.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Por isso o guia agrupa por proposta. Você encontra o grupo que
              descreve o que você quer, e dentro dele compara três ou quatro
              opções parecidas — que é uma decisão bem mais fácil do que comparar
              dezesseis coisas diferentes entre si.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Localização ou estrutura: o que pesa mais?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Há um ponto que quase todo mundo subestima na hora de escolher. A
              academia perfeita a 40 minutos da sua rotina costuma perder para uma
              boa academia a 5 minutos, por um motivo simples: você consegue ir. Em
              Alphaville, com o trânsito de fim de tarde no Centro Industrial e
              Empresarial, isso pesa ainda mais. Calcule o deslocamento no seu
              horário real, não no horário vazio do mapa.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Visite no horário em que você vai treinar
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Essa é a dica que mais evita arrependimento, e a mais ignorada. Uma
              academia às 14h pode ser irreconhecível às 19h — fila no supino,
              esteira toda ocupada, aula coletiva tomando o espaço. Antes de
              assinar qualquer plano, faça a aula experimental exatamente no
              horário em que você pretende treinar. É o único jeito de saber como
              vai ser a sua rotina de verdade. Aproveite a visita para confirmar
              horário de funcionamento, valores e o que está incluído no plano —
              direto com a unidade.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              A escolha da academia resolve menos do que parece
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Vale dizer com todas as letras, porque muita gente trava semanas
              nessa decisão: trocar de academia raramente é o que destrava um
              resultado. A academia é o lugar. O que muda o resultado é o que
              você faz lá dentro — a estrutura do treino, a progressão de carga ao
              longo dos meses, a execução dos movimentos e a frequência que você
              consegue sustentar quando a semana aperta.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Essas direções vêm da minha experiência acompanhando alunos, de
              estudos científicos — todos citados nas referências dos artigos, para
              você conferir — e do trabalho de grandes treinadores do Brasil e do
              mundo que eu estudo. Mas nenhuma delas é fórmula secreta, porque
              segredo não existe. A melhor estratégia é a que se encaixa nas suas
              individualidades e na sua rotina de agora: a que você consegue seguir
              por mais tempo, com mais consistência e melhor progressão. E é aí que
              acompanhamento de perto faz diferença — alguém que ajusta o caminho
              com você porque gosta de ver uma pessoa descobrir que também
              consegue.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Próximo passo
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Se você já escolheu a academia e a dúvida agora é como distribuir os
              treinos na semana, o{" "}
              <Link href="/treino-para-minha-rotina" className={ln}>Treino Para Minha Rotina</Link>{" "}
              monta a estrutura em cerca de um minuto. Se a dúvida é sobre a sua
              execução, você pode{" "}
              <Link href="/revisao-de-execucao" className={ln}>me mandar um vídeo de uma série</Link>{" "}
              — eu mesmo assisto, sem custo e sem cadastro. E se for uma pergunta
              pontual, o{" "}
              <Link href="/pergunte-ao-montinho" className={ln}>Pergunte ao Montinho</Link>{" "}
              responde na hora.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Se você prefere não resolver isso sozinho, eu atendo{" "}
              <Link href="/consultoria" className={ln}>presencialmente em Alphaville e região</Link>{" "}
              — inclusive dentro de várias dessas academias — e também online.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Alguma informação mudou?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Academia fechou, reformou, mudou de proposta ou saiu da região? Me
              avise pelo <Link href="/contato" className={ln}>contato</Link> — toda
              correção passa por mim antes de entrar, nunca é aplicada
              automaticamente.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
