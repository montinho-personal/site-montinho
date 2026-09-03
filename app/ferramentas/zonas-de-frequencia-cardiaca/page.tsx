import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import {
  FONTE_KARVONEN,
  FONTE_TANAKA,
  FONTE_ZONAS,
  NOTA_BETABLOQUEADOR,
  ZONAS,
  fcMaxima,
  fcMaximaClassica,
  zonasEmBpm,
} from "@/lib/fc";
import CalculadoraFC from "@/components/fc/CalculadoraFC";
import Trilha from "@/components/ferramentas/Trilha";

/**
 * Página própria da calculadora de zonas de frequência cardíaca.
 *
 * Atende a intenção de ferramenta — "calcular FC máxima", "zona 2 em bpm",
 * "frequência cardíaca para queimar gordura" — que os artigos não atendem
 * porque respondem outra pergunta: o que é zona 2, como fazer caminhada
 * japonesa. Canonical para ela mesma; o artigo segue canônico para si.
 *
 * O exemplo de 40 anos aparece resolvido em HTML estático porque o crawler
 * não digita idade. Sem ele a página seria uma caixa vazia para o Google e
 * para quem chega sem vontade de preencher nada.
 */
export const metadata: Metadata = {
  title: "Calculadora de Zonas de Frequência Cardíaca",
  description:
    "Informe sua idade e descubra sua frequência cardíaca máxima e as cinco zonas de treino em batimentos por minuto, com o método de Karvonen se souber a de repouso. Gratuita, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/ferramentas/zonas-de-frequencia-cardiaca` },
  openGraph: {
    title: "Calculadora de Zonas de Frequência Cardíaca | Montinho",
    description:
      "FC máxima estimada e as cinco zonas em bpm a partir da sua idade. Com a régua da fala para conferir sem relógio. Gratuita, sem cadastro.",
    url: `${SITE_URL}/ferramentas/zonas-de-frequencia-cardiaca`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

/** Só BreadcrumbList — nada de FAQ ou nota inventada para rich result. */
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Calculadora de Zonas de Frequência Cardíaca",
      item: `${SITE_URL}/ferramentas/zonas-de-frequencia-cardiaca`,
    },
  ],
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

/** Exemplo fixo indexável. */
const EX_IDADE = 40;
const EX_MAX = fcMaxima(EX_IDADE);
const EX_ZONAS = zonasEmBpm(EX_MAX, null);
const EX_KARVONEN = zonasEmBpm(EX_MAX, 60);

export default function CalculadoraFCPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuita · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de zonas de frequência cardíaca
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Informe sua idade para estimar sua frequência cardíaca máxima e ver em que batimento fica cada
            zona de treino — da recuperação ao esforço máximo, com a régua da fala para conferir sem relógio.
          </p>
        </div>
      </section>

      <Trilha atual="/ferramentas/zonas-de-frequencia-cardiaca" />

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraFC placement="pagina-ferramenta" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que são zonas de frequência cardíaca
            </h2>
            <p className="text-gray-300 leading-relaxed">
              São faixas de batimentos por minuto que dividem o esforço em degraus, do muito leve ao máximo.
              Cada zona é um percentual da sua <strong className="text-white">frequência cardíaca máxima</strong>, e
              cada uma treina uma coisa diferente: a zona 2 constrói base aeróbica, a zona 4 ensina a sustentar
              esforço alto, a zona 5 empurra o VO2 máximo. Sem saber a sua máxima, "treine a 70%" não significa
              nada — e é por isso que esta calculadora existe.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como calcular a frequência cardíaca máxima
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A calculadora usa a fórmula de {FONTE_TANAKA.rotuloCurto}, que saiu de uma meta-análise de 351
              estudos e da medição direta de 514 pessoas:
            </p>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-3 overflow-x-auto">
              <p>FC máxima = 208 − 0,7 × idade</p>
              <p className="mt-2">
                208 − 0,7 × {EX_IDADE} = <span className="text-white">{EX_MAX} bpm</span>
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              A fórmula que todo mundo conhece, 220 − idade, daria {fcMaximaClassica(EX_IDADE)} bpm para a mesma
              pessoa. Ela nunca foi um estudo: foi uma anotação dos anos 1970 que virou regra por repetição, e
              subestima a máxima de quem tem mais de 40 anos. Nenhuma das duas é medição: a máxima real varia
              cerca de ±{FONTE_TANAKA.desvioBpm} bpm em torno da estimada. Quem quer o número exato faz um teste
              de esforço; para organizar o treino, a estimativa com a régua da fala resolve.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              As cinco zonas, para quem tem {EX_IDADE} anos
            </h2>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-gray-400 font-medium py-2.5 pr-4">Zona</th>
                    <th className="text-left text-gray-400 font-medium py-2.5 pr-4">% da máxima</th>
                    <th className="text-left text-gray-400 font-medium py-2.5">Batimentos</th>
                  </tr>
                </thead>
                <tbody>
                  {EX_ZONAS.map((f) => (
                    <tr key={f.zona.id} className="border-b border-white/10">
                      <td className="text-white py-2.5 pr-4 font-medium whitespace-nowrap">
                        {f.zona.numero} · {f.zona.nome}
                      </td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">
                        {f.zona.de}–{f.zona.ate}%
                      </td>
                      <td className="text-white py-2.5 tabular-nums">
                        {f.de} a {f.ate} bpm
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3">
              {ZONAS.map((z) => (
                <div key={z.id}>
                  <p className="text-white text-sm font-semibold">
                    Zona {z.numero} · {z.nome}{" "}
                    <span className="text-gray-500 font-normal">
                      {z.de}–{z.ate}%
                    </span>
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">{z.serve}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              A régua da fala: conferir sem relógio
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Relógio erra, fórmula estima, e o corpo responde na hora. A régua da fala é a conferência que não
              depende de número: na zona 2 você conversa em frases inteiras; na 3, só frases curtas; na 4, palavras
              soltas; na 5, nada. Se o relógio diz zona 2 e você não consegue conversar, o relógio está errado
              para você — e a régua manda.
            </p>
            <p className="text-gray-300 leading-relaxed">
              É a mesma régua da{" "}
              <Link href="/blog/caminhada-japonesa" className={ln}>
                caminhada japonesa
              </Link>
              , que alterna zona 3 e zona 2 sem exigir aparelho nenhum.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Método de Karvonen: quando você sabe a de repouso
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Duas pessoas com a mesma máxima podem ter repouso de 50 e de 80 bpm, e o mesmo "70%" cai em esforços
              diferentes para cada uma. O método de{" "}
              <a href={FONTE_KARVONEN.url} target="_blank" rel="noopener noreferrer" className={ln}>
                {FONTE_KARVONEN.rotuloCurto}
              </a>{" "}
              corrige isso aplicando o percentual sobre a <strong className="text-white">reserva</strong>, que é a
              máxima menos o repouso, e somando o repouso de volta:
            </p>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-3 overflow-x-auto">
              <p>zona = repouso + (máxima − repouso) × percentual</p>
              <p className="mt-2">
                para {EX_MAX} de máxima e 60 de repouso, zona 2 = 60 + ({EX_MAX} − 60) × 0,60 a 0,70 ={" "}
                <span className="text-white">
                  {EX_KARVONEN[1].de} a {EX_KARVONEN[1].ate} bpm
                </span>
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Contra {EX_ZONAS[1].de} a {EX_ZONAS[1].ate} bpm pelo percentual simples. A diferença parece pequena e
              muda a sensação: com Karvonen, a zona 2 fica mais fiel ao "conversa em frases inteiras" para quem tem
              repouso normal. A calculadora troca de método sozinha quando você informa o repouso.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Limites da estimativa
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">{NOTA_BETABLOQUEADOR}</p>
            <p className="text-gray-300 leading-relaxed">
              Os cortes das cinco zonas seguem a convenção do {FONTE_ZONAS.rotuloCurto} e dos relógios esportivos.
              Não são lei: outro esquema com três zonas, ou com limiares medidos em laboratório, é igualmente
              válido. O que importa é o esforço subir de forma consistente de uma zona para a seguinte, e a régua
              da fala confirmar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como usar isso no treino
            </h2>
            <p className="text-gray-300 leading-relaxed">
              O número só vira treino quando entra numa estrutura. Para a maior parte do volume aeróbico, o guia de{" "}
              <Link href="/blog/treino-zona-2" className={ln}>
                treino na zona 2
              </Link>{" "}
              explica por que ela constrói a base. Para saber por que a capacidade aeróbica pesa tanto em saúde,{" "}
              <Link href="/blog/vo2-maximo-longevidade" className={ln}>
                VO2 máximo e longevidade
              </Link>
              . E para o que fazer em cada uma das cinco, o artigo de{" "}
              <Link href="/blog/zonas-de-frequencia-cardiaca" className={ln}>
                zonas de frequência cardíaca
              </Link>{" "}
              é o texto mais direto.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
