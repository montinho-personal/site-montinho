import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { FAIXAS, REFERENCIA_CIENTIFICA, gramasPorDia } from "@/lib/proteina";
import CalculadoraProteina from "@/components/proteina/CalculadoraProteina";
import Compartilhar from "@/components/share/Compartilhar";

/**
 * Página própria da calculadora — captura a busca direta por "calculadora de
 * proteína", que os artigos não capturam porque não têm esse título.
 *
 * O conteúdo indexável em volta não é enchimento: a explicação da conta e o
 * exemplo de 80 kg existem no HTML estático porque o crawler não digita peso
 * — sem esse texto, a página seria uma caixa vazia para o Google. Cada
 * artigo relacionado mantém a própria canonical: a calculadora é componente
 * compartilhado, não conteúdo duplicado.
 */
export const metadata: Metadata = {
  title: "Calculadora de Proteína Diária",
  description:
    "Informe seu peso e veja referências de 1,6, 2,0 e 2,2 g de proteína por kg por dia, com divisão por refeições e exemplos de alimentos com fonte. Gratuito, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/ferramentas/calculadora-de-proteina` },
  openGraph: {
    title: "Calculadora de Proteína Diária | Montinho",
    description:
      "Quanto de proteína por dia? Digite seu peso e veja as referências de 1,6 a 2,2 g/kg, baseadas em evidência. Gratuito, sem cadastro.",
    url: `${SITE_URL}/ferramentas/calculadora-de-proteina`,
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
    { "@type": "ListItem", position: 3, name: "Calculadora de Proteína", item: `${SITE_URL}/ferramentas/calculadora-de-proteina` },
  ],
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

/** Exemplo fixo indexável — o crawler não digita peso. */
const EXEMPLO_KG = 80;

export default function CalculadoraProteinaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuita · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de proteína por peso
          </h1>
          <Compartilhar
            contexto="tool"
            titulo="Calculadora de Proteína"
            caminho="/ferramentas/calculadora-de-proteina"
            local="tool_top"
            ferramenta="calculadora_proteina"
            aparencia="discreto"
            className="mb-5"
          />
          <p className="text-gray-300 text-lg leading-relaxed">
            Informe seu peso para calcular referências de 1,6, 2,0 e 2,2 g de
            proteína por kg de peso corporal — a faixa usada por quem treina
            musculação.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraProteina placement="pagina-ferramenta" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como a calculadora de proteína funciona
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A conta é o peso corporal multiplicado pela quantidade de proteína
              em gramas por quilo. Uma pessoa de {EXEMPLO_KG} kg, por exemplo,
              teria como referências{" "}
              {FAIXAS.map((f, i) => (
                <span key={f.id}>
                  <strong className="text-white">
                    {gramasPorDia(EXEMPLO_KG, f.gPorKg)} g/dia
                  </strong>{" "}
                  em {String(f.gPorKg).replace(".", ",")} g/kg
                  {i < FAIXAS.length - 2 ? ", " : i === FAIXAS.length - 2 ? " e " : ""}
                </span>
              ))}
              . Os valores aparecem em números inteiros de propósito — casa
              decimal aqui seria falsa precisão.
            </p>
            <p className="text-gray-300 leading-relaxed">
              A faixa vem de uma revisão sistemática com meta-análise —{" "}
              <a href={REFERENCIA_CIENTIFICA.url} target="_blank" rel="noopener noreferrer" className={ln}>
                {REFERENCIA_CIENTIFICA.rotulo}
              </a>
              , 49 estudos e 1.863 participantes — que estimou cerca de 1,6 g/kg
              como o ponto a partir do qual mais proteína não mostrou benefício
              adicional claro para ganho de massa magra, com intervalo de
              confiança até cerca de 2,2 g/kg. Por isso as três referências são
              uma faixa, e não três degraus de resultado.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que a calculadora não faz
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Ela não monta dieta, não substitui nutricionista e não conhece o
              seu contexto — ingestão calórica, objetivo, rotina, condições de
              saúde. É uma referência educacional para sair do achismo. Quem tem
              condição que exige controle individual de proteína deve conversar
              com um profissional de saúde antes de definir metas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Para entender os números a fundo
            </h2>
            <p className="text-gray-300 leading-relaxed">
              A explicação completa — de onde vem a faixa, como distribuir no
              dia, o que muda no emagrecimento — está em{" "}
              <Link href="/blog/quanta-proteina-por-dia-para-ganhar-massa-muscular" className={ln}>
                Quanta Proteína por Dia Para Ganhar Massa Muscular
              </Link>
              . Para transformar gramas em comida de verdade, o guia de{" "}
              <Link href="/blog/alimentos-ricos-em-proteina" className={ln}>
                alimentos ricos em proteína
              </Link>{" "}
              lista as melhores fontes com custo e destaque de cada uma. E se a
              dúvida seguinte for estrutura de treino, o{" "}
              <Link href="/treino-para-minha-rotina" className={ln}>
                Treino Para Minha Rotina
              </Link>{" "}
              monta a semana em um minuto.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
