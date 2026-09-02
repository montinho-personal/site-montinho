import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { revisaoWhatsAppUrl } from "@/lib/revisao";
import RevisaoCTA from "@/components/revisao/RevisaoCTA";
import Trilha from "@/components/ferramentas/Trilha";
import VistaMedida from "@/components/ui/VistaMedida";

export const metadata: Metadata = {
  title: "Revisão Gratuita de Execução de Exercícios",
  description:
    "Grave uma série completa e envie pelo WhatsApp. O Montinho assiste pessoalmente e mostra os principais pontos da sua execução. Gratuito, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/revisao-de-execucao` },
  openGraph: {
    title: "Revisão Gratuita de Execução | Montinho Personal Trainer",
    description:
      "Grave uma série completa, mande pelo WhatsApp. Eu mesmo assisto e te passo uma revisão — gratuitamente.",
    url: `${SITE_URL}/revisao-de-execucao`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Revisão de Execução", item: `${SITE_URL}/revisao-de-execucao` },
  ],
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Revisão Gratuita de Execução",
  description:
    "Envio de vídeo de uma série completa pelo WhatsApp para revisão pessoal da execução pelo personal trainer Montinho. Gratuito e sem cadastro.",
  url: `${SITE_URL}/revisao-de-execucao`,
  author: {
    "@type": "Person",
    name: "Montinho",
    url: `${SITE_URL}/minha-historia`,
    jobTitle: "Personal Trainer",
  },
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

const PASSOS = [
  { n: "1", t: "Grave uma série completa", d: "Desde antes da primeira repetição até terminar a série." },
  { n: "2", t: "Clique no botão", d: "Ele abre o meu WhatsApp com a mensagem já escrita." },
  { n: "3", t: "Me mande o vídeo", d: "É só anexar ali na conversa. Não precisa escrever nada." },
];

export default function RevisaoDeExecucaoPage() {
  const href = revisaoWhatsAppUrl();

  return (
    <>
      <VistaMedida evento="execution_review_view" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      {/* Hero — a ação está acima da dobra, no celular inclusive */}
      <section className="pt-14 pb-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuito · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Em vez de ficar na dúvida, me mostra.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-3">
            Grave uma série completa do exercício e me mande pelo WhatsApp.
            Eu mesmo assisto e te passo os principais pontos que vale observar
            na sua execução.
          </p>
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            Não precisa editar. Não precisa preencher formulário. Não precisa
            nem saber o nome técnico do exercício.
          </p>

          <RevisaoCTA href={href} source="hero" />

          <p className="text-gray-400 text-sm mt-4">
            Não precisa estar perfeito — é justamente para isso que serve a revisão.
          </p>
        </div>
      </section>

      <Trilha atual="/revisao-de-execucao" />

      {/* Como funciona */}
      <section className="py-14 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center" style={h}>
            Como funciona
          </h2>
          {/* ol porque a ordem importa de verdade — é um passo a passo */}
          <ol className="grid gap-5 sm:grid-cols-3 mb-10 list-none p-0">
            {PASSOS.map((p) => (
              <li key={p.n} className="border border-white/15 bg-white/[0.03] p-6">
                <span
                  className="block text-3xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-titulo), Georgia, serif", color: "#BA9E50" }}
                  aria-hidden="true"
                >
                  {p.n}
                </span>
                <p className="text-white font-semibold mb-1">{p.t}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{p.d}</p>
              </li>
            ))}
          </ol>
          <div className="text-center">
            <RevisaoCTA href={href} source="como_funciona" />
          </div>
        </div>
      </section>

      {/* Conteúdo indexável */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como gravar o vídeo
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Grave uma <strong className="text-white">série completa</strong>, desde
              antes da primeira repetição até terminar. Uma série inteira mostra
              muito mais do que três repetições soltas: dá para ver o padrão do
              movimento, a amplitude, o ritmo e o que muda quando a fadiga aparece.
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              Apoie o celular em algum lugar ou peça para alguém filmar. Se der,
              escolha um ângulo em que o movimento apareça bem, com o corpo
              visível e alguma iluminação. Só isso.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Não precisa editar, cortar nem preparar nada. Me manda o vídeo do
              jeito que ele estiver.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quem assiste?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Eu. Não é correção automática nem inteligência artificial: o vídeo
              chega no meu WhatsApp e eu mesmo assisto a sua execução. É por isso
              que eu não peço formulário — prefiro conversar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que eu consigo observar
            </h2>
            <p className="text-gray-300 leading-relaxed">
              O que o vídeo mostra: a organização geral do movimento, a amplitude,
              a trajetória, o ritmo, o controle e a estabilidade aparente, e como
              tudo isso se mantém (ou não) ao longo da série. Te passo os
              principais pontos que vale observar — não uma lista do que você
              está fazendo de errado.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              É realmente gratuito?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              É. Você me manda uma série e eu faço a revisão dos principais
              pontos visíveis da sua execução. Sem cadastro, sem compromisso e
              sem precisar contratar nada depois. Só não consigo prometer prazo
              de resposta — respondo assim que der, entre os atendimentos.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              A revisão substitui um personal?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Não, e seria desonesto dizer que sim. Um vídeo mostra um exercício
              num dia. Acompanhamento é outra coisa: considera o treino inteiro,
              o volume, a progressão ao longo das semanas, o seu objetivo, seu
              histórico e a sua rotina — e ajusta conforme você evolui.
            </p>
            <p className="text-gray-300 leading-relaxed">
              A revisão é uma amostra de como eu olho para a execução. Se fizer
              sentido continuar, existe o{" "}
              <Link href="/consultoria" className={ln}>
                acompanhamento personalizado
              </Link>
              , presencial em Alphaville e região ou online.
            </p>
          </div>

          <div className="border-l-2 pl-5" style={{ borderColor: "#BA9E50" }}>
            <p className="text-white font-semibold mb-2">Importante</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              A revisão considera apenas o que é possível observar no vídeo e tem
              finalidade educativa. Ela não diagnostica dores, lesões ou
              condições clínicas, e não substitui avaliação individual quando ela
              for necessária. O vídeo é enviado diretamente para o meu WhatsApp —
              o site não recebe nem guarda nada.
            </p>
          </div>

          <div className="text-center pt-2">
            <p className="text-white font-bold text-2xl mb-5" style={h}>
              Já gravou? Me manda.
            </p>
            <RevisaoCTA href={href} source="final" />
            <p className="text-gray-400 text-sm mt-4">
              Tem uma dúvida que não precisa de vídeo?{" "}
              <Link href="/pergunte-ao-montinho" className={ln}>
                Pergunte ao Montinho
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
