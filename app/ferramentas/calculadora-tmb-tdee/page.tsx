import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { NIVEIS, REFERENCIA_TMB } from "@/lib/tdee";
import CalculadoraTDEE from "@/components/tdee/CalculadoraTDEE";
import Trilha from "@/components/ferramentas/Trilha";

/**
 * Calculadora de TMB e TDEE — página própria.
 *
 * O padrão das ferramentas do site: H1 + parágrafo indexável, a calculadora
 * cedo (quem chegou buscando "quantas calorias gasto por dia" quer calcular,
 * não ler 4 mil palavras), e o conteúdo editorial enxuto embaixo, para quem
 * quer entender. Canonical para si mesma, BreadcrumbList e nada de schema
 * inventado. O slug segue o padrão dos irmãos (calculadora-*).
 */
export const metadata: Metadata = {
  title: "Calculadora de TMB e TDEE: Gasto Calórico Diário",
  description:
    "Estime sua taxa metabólica basal e seu gasto calórico diário com base em peso, altura, idade e nível de atividade. Equação de Mifflin-St Jeor, conta aberta, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/ferramentas/calculadora-tmb-tdee` },
  openGraph: {
    title: "Calculadora de TMB e TDEE — quantas calorias você gasta por dia?",
    description:
      "Estime seu metabolismo em repouso e seu gasto diário total, veja a conta aberta e siga direto para o déficit ou os macros. Gratuita, sem cadastro.",
    url: `${SITE_URL}/ferramentas/calculadora-tmb-tdee`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de TMB e TDEE", item: `${SITE_URL}/ferramentas/calculadora-tmb-tdee` },
  ],
};

const h = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function CalculadoraTmbTdeePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuita · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de TMB e TDEE
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Informe peso, altura, idade e nível de atividade para estimar sua
            taxa metabólica basal e seu gasto energético diário — quantas
            calorias seu corpo utiliza em repouso e ao longo do dia.
          </p>
        </div>
      </section>

      <Trilha atual="/ferramentas/calculadora-tmb-tdee" />

      <section className="py-10 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraTDEE placement="pagina-ferramenta" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que é TMB (taxa metabólica basal)?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              É uma estimativa da energia que seu organismo utilizaria em
              repouso completo, só para manter as funções vitais — coração
              batendo, pulmões respirando, temperatura estável, cérebro
              funcionando. Mesmo sem sair da cama, esse trabalho consome a
              maior parte das calorias do dia da maioria das pessoas.
              Tecnicamente existe uma pequena diferença entre taxa metabólica
              basal e taxa de repouso, mas as calculadoras usam TMB como o
              termo mais conhecido para essa estimativa.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que é TDEE (gasto energético diário total)?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              É a estimativa do que você gasta no dia <em>inteiro</em>: o
              repouso da TMB somado a tudo que sua rotina acrescenta — andar,
              trabalhar, treinar, digerir. É normalmente o número que a pessoa
              está procurando quando pergunta &ldquo;quantas calorias eu gasto
              por dia?&rdquo;, e é a referência de partida para manter, perder
              ou ganhar peso. TMB e TDEE são números diferentes: o primeiro é
              o motor parado, o segundo é o carro rodando.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como calcular o gasto calórico diário?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A calculadora usa a equação de{" "}
              <strong className="text-white">Mifflin-St Jeor</strong> —{" "}
              {REFERENCIA_TMB.detalhe} A conta é aberta: TMB = (10 × peso) +
              (6,25 × altura em cm) − (5 × idade), com +5 para homens e −161
              para mulheres. O gasto diário multiplica essa TMB por um fator
              de atividade entre ×{String(NIVEIS[0].fator).replace(".", ",")} e ×
              {String(NIVEIS[NIVEIS.length - 1].fator).replace(".", ",")}, conforme a rotina.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Nenhuma equação online consegue medir exatamente quanto você
              gasta no mundo real — relógios e esteiras também estimam, e
              podem divergir bastante. O cálculo funciona melhor como ponto de
              partida, ajustado depois observando peso, medidas e desempenho
              ao longo das semanas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O nível de atividade muda o resultado?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Muda — e muito: para a mesma pessoa, a diferença entre
              &ldquo;pouco ativo&rdquo; e &ldquo;muito ativo&rdquo; passa de
              800 kcal por dia. O erro mais comum é escolher o nível pelo
              treino e esquecer as outras 23 horas: quem treina uma hora e
              trabalha sentado o dia todo raramente é &ldquo;muito
              ativo&rdquo;. Na dúvida entre dois níveis, comece pelo menor e
              observe sua evolução real — superestimar aqui é o que faz um
              déficit planejado virar manutenção na prática.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              E depois de saber meu gasto?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              O gasto responde &ldquo;quanto eu gasto?&rdquo; — não
              &ldquo;quanto devo comer?&rdquo;. Para emagrecer, a{" "}
              <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>
                Calculadora de Déficit Calórico
              </Link>{" "}
              transforma o gasto numa meta com o corte escolhido por você.
              Para distribuir uma meta em proteína, carboidrato e gordura, a{" "}
              <Link href="/ferramentas/calculadora-macros" className={ln}>
                Calculadora de Macros
              </Link>{" "}
              faz a divisão — e o{" "}
              <Link href="/ferramentas/monte-seu-cardapio" className={ln}>
                Montinho FitChef
              </Link>{" "}
              transforma tudo em comida de verdade. A conta em detalhe está no
              artigo{" "}
              <Link href="/blog/como-calcular-tmb-tdee-calorias" className={ln}>
                como calcular TMB e TDEE
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
