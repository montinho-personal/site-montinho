import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE_URL } from "@/lib/blog";
import { TRILHAS } from "@/lib/ferramentas/trilha";
import { BORDOES } from "@/lib/bordoes";
import RastreioComece from "@/components/comece/RastreioComece";

/**
 * /comece — a porta de entrada do ecossistema.
 *
 * É a URL da bio, do anúncio, do "manda pra quem precisa": a página que
 * responde "por onde eu começo?" antes de a pessoa saber qual caminho é o
 * dela. A copy é deliberadamente pessoal — a história do Renato É o
 * argumento de autoridade, porque a dor do leitor (conteúdo solto,
 * confuso, que só atrapalha) é exatamente a dor que ele viveu.
 *
 * Os bordões entram pelas constantes de lib/bordoes: a frase do impossível
 * NUNCA aparece sem a condição — a suíte de bordões vigia isso.
 */
export const metadata: Metadata = {
  title: "Comece Aqui: o Caminho Completo, de Graça",
  description:
    "Não sabe por onde começar? Siga um caminho: ferramentas gratuitas conectadas que te levam do zero ao plano — dieta e treino, passo a passo, sem cadastro. Feito por quem já esteve perdido e perdeu 40 kg.",
  alternates: { canonical: `${SITE_URL}/comece` },
  openGraph: {
    title: "Comece Aqui — o caminho completo, de graça",
    description:
      "Do zero ao plano: dieta e treino em passos conectados, com seus dados atravessando sozinhos de ferramenta em ferramenta. Sem cadastro.",
    url: `${SITE_URL}/comece`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Comece Aqui", item: `${SITE_URL}/comece` },
  ],
};

const h = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;
const sans = { fontFamily: "var(--font-inter), sans-serif" } as const;

export default function ComecePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <RastreioComece pagina="geral" />

      {/* ── A promessa ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuito · sem cadastro · sem enrolação
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-6" style={h}>
            Você não precisa de mais um conteúdo solto.
            <br />
            Precisa de um caminho.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            A internet está cheia de resposta — e é exatamente por isso que
            você continua perdido. Aqui o processo inteiro está em ordem:
            ferramentas conectadas que te levam do zero ao plano, passo a
            passo, com seus dados atravessando sozinhos de uma para a outra.
          </p>
        </div>
      </section>

      {/* ── A história: a autoridade que não precisa se afirmar ────── */}
      <section className="py-14 border-b border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5" style={h}>
            Eu sei exatamente onde você está — porque eu estive aí
          </h2>
          {/**
           * A foto entra AQUI, no meio da história — não no topo.
           *
           * No herói ela faria a página ser sobre o Montinho; no meio da
           * história ela PROVA a frase que acabou de ser lida ("eu estive
           * aí"). E a legenda faz o trabalho que separa autoridade de
           * promessa: "eu era essa pessoa", nunca "você pode ser esta". A
           * mesma foto vive em /resultados; aqui ela tem outra função.
           *
           * Fora do herói também por performance: no meio da página ela
           * carrega preguiçosamente e não vira o LCP.
           */}
          <figure className="mb-6">
            {/**
             * next/image e não <img>: o arquivo original tem 4096×4096 e
             * 439 KB para ser exibido em ~350 px de largura no celular. O
             * otimizador serve a versão do tamanho certo, em formato
             * moderno. As dimensões declaradas são as REAIS (quadrada) —
             * declarar proporção errada reserva a caixa errada e produz
             * salto de layout quando a imagem chega.
             */}
            <Image
              src="/antes-depois-montinho-personal-trainer.jpg"
              alt="Montinho antes e depois: à esquerda, adolescente acima do peso; à direita, adulto com a composição corporal transformada após perder mais de 40 kg"
              width={1024}
              height={1024}
              sizes="(max-width: 768px) 100vw, 768px"
              className="w-full h-auto border border-white/15"
            />
            <figcaption className="text-gray-400 text-sm leading-relaxed mt-3">
              Este era eu. Não estou te vendendo o meu resultado — estou te
              entregando a ordem das peças que eu levei anos para encontrar.
            </figcaption>
          </figure>

          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Eu fui o gordinho da turma. O que sorria por fora e se escondia
              por dentro. E eu <strong className="text-white">tentava</strong>:
              treinava, me esforçava, pesquisava na internet madrugada adentro
              — e só encontrava conteúdo solto. Um vídeo dizia uma coisa, um
              blog dizia o contrário, ninguém explicava com clareza, e cada
              pesquisa nova me deixava mais confuso do que a anterior. Eu não
              sabia por onde começar, então começava por tudo ao mesmo tempo —
              e desistia de tudo ao mesmo tempo.
            </p>
            <p className="border-l-2 pl-4 text-white font-medium" style={{ borderColor: "#BA9E50" }}>
              Cresci acreditando que o problema era eu. Levei anos para
              entender que o problema era a abordagem.
            </p>
            <p>
              Quando as peças finalmente se encaixaram numa ordem — quanto eu
              gasto, quanto eu como, o que eu boto no prato, como eu treino —
              eu perdi <strong className="text-white">mais de 40 kg</strong>. E
              virei personal trainer por um motivo só: ninguém deveria levar
              anos para descobrir a ordem das peças. Este caminho que você vai
              ver abaixo é o mapa que eu queria ter recebido lá atrás. Ele é
              gratuito porque a ordem das peças não é segredo —{" "}
              {BORDOES.chalalaNaoEhSegredo.toLowerCase().replace(/\.$/, "")}.
            </p>
          </div>
        </div>
      </section>

      {/* ── A escolha: uma pergunta só ─────────────────────────────── */}
      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center" style={h}>
            O que você quer resolver primeiro?
          </h2>
          <p className="text-gray-400 text-center mb-10">
            Uma pergunta só. Os dois caminhos se encontram no final.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {(Object.keys(TRILHAS) as (keyof typeof TRILHAS)[]).map((id) => (
              <div key={id} className="border border-white/15 hover:border-[#BA9E50]/60 transition-colors p-7 flex flex-col">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "#BA9E50", ...sans }}>
                  {id === "dieta" ? "O prato" : "O treino"}
                </p>
                <h3 className="text-white font-bold text-2xl mb-4" style={h}>
                  {TRILHAS[id].titulo}
                </h3>
                <ol className="space-y-2.5 mb-6 flex-1">
                  {TRILHAS[id].passos.map((p, i) => (
                    <li key={p.href} className="flex items-baseline gap-3">
                      <span className="text-gray-500 text-sm font-semibold" style={sans}>
                        {i + 1}.
                      </span>
                      <span className="text-gray-300 text-sm">
                        <span className="text-white font-medium">{p.nome}</span> — {p.pergunta}
                      </span>
                    </li>
                  ))}
                </ol>
                <Link
                  href={`/comece/${id}`}
                  className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:opacity-90 transition-opacity"
                >
                  Ver o caminho {id === "dieta" ? "da dieta" : "do treino"}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por que isto funciona ──────────────────────────────────── */}
      <section className="py-14 border-b border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8" style={h}>
            Por que este caminho é diferente de tudo que você já tentou
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-1.5">Cada passo calcula o número que o próximo usa</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Não é uma lista de links: seu gasto vira sua meta, sua meta
                vira seus macros, seus macros viram um cardápio com lista de
                compras. Você digita o peso <em>uma vez</em> — os dados
                atravessam sozinhos, e nunca saem do seu navegador.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1.5">A conta é aberta — nada de caixa-preta</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Toda ferramenta mostra a fórmula, a fonte científica e o
                &ldquo;como calculamos&rdquo;. Você não precisa confiar em mim:
                pode conferir. Autoridade que se esconde atrás de fórmula
                secreta não é autoridade.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1.5">Gratuito de verdade, sem pegadinha</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Sem cadastro, sem e-mail, sem &ldquo;desbloqueie o
                resultado&rdquo;. Os pontos onde o gratuito termina estão
                ditos com todas as letras — e são exatamente onde o trabalho
                individual começa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── O bordão que fecha ─────────────────────────────────────── */}
      <section className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-2xl sm:text-3xl text-white font-bold leading-snug mb-4" style={h}>
            &ldquo;{BORDOES.impossivelCompleta}&rdquo;
          </p>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto mb-3">
            {BORDOES.impossivelNaoEh}
          </p>
          {/* Separação entre BLOCOS de ideia vem do container (mt-10), não de
              uma margem gigante num parágrafo — foi isso que quebrou o ritmo
              do texto em relação ao resto do site. */}
          <p className="text-gray-300 leading-relaxed mb-3 mt-10">
            O caminho acima é o &ldquo;o que precisa ser feito&rdquo;. E quando
            {/* A constante já começa com artigo ("o algo a mais..."), então
                o texto não repete o "o" — era daí que saía "o o algo a mais". */}
            você quiser {BORDOES.chalala} — o acompanhamento de quem já
            percorreu tudo isso no próprio corpo —{" "}
            <Link
              href="/consultoria"
              className="text-white underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity"
              style={{ textDecorationColor: "#BA9E50" }}
            >
              eu estou aqui
            </Link>
            .
          </p>
          <p className="text-gray-500 text-sm">
            Ou comece agora, sozinho, de graça:{" "}
            <Link href="/comece/dieta" className="text-gray-300 underline underline-offset-2 hover:text-white transition-colors">
              caminho da dieta
            </Link>{" "}
            ·{" "}
            <Link href="/comece/treino" className="text-gray-300 underline underline-offset-2 hover:text-white transition-colors">
              caminho do treino
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
