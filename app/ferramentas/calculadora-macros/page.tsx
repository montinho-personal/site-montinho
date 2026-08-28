import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import {
  AMDR,
  FAIXAS_PROTEINA,
  KCAL_POR_G_CARBO,
  KCAL_POR_G_GORDURA,
  KCAL_POR_G_PROTEINA,
  REFERENCIA_PROTEINA,
  calculaMacros,
  formataNumero,
} from "@/lib/macros";
import CalculadoraMacros from "@/components/macros/CalculadoraMacros";
import Trilha from "@/components/ferramentas/Trilha";

/**
 * Página própria da calculadora de macros.
 *
 * Atende a intenção de ferramenta ("calculadora de macros", "calcular
 * macronutrientes"), que os artigos não atendem — eles respondem o que são
 * macros e como aplicar na alimentação. Canonical para ela mesma; os artigos
 * seguem canônicos para si.
 *
 * O exemplo de 80 kg / 2.200 kcal aparece resolvido em HTML estático porque
 * o crawler não preenche formulário.
 */
export const metadata: Metadata = {
  title: "Calculadora de Macros: Proteína, Carbo e Gordura",
  description:
    "Calcule proteínas, carboidratos e gorduras a partir do seu peso e da sua meta calórica. Ajuste os macros e veja a conta mudar em segundos. Gratuita, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/ferramentas/calculadora-macros` },
  openGraph: {
    title: "Calculadora de Macros | Montinho",
    description:
      "Informe suas calorias e seu peso para calcular proteínas, carboidratos e gorduras — com a conta aberta e ajuste em tempo real. Gratuita, sem cadastro.",
    url: `${SITE_URL}/ferramentas/calculadora-macros`,
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
      name: "Calculadora de Macros",
      item: `${SITE_URL}/ferramentas/calculadora-macros`,
    },
  ],
};

const h = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

/** Exemplo fixo indexável. */
const EX = { peso: 80, kcal: 2200, gPorKg: 2.0, gordura: 30 } as const;
const R = calculaMacros(EX.kcal, EX.peso, EX.gPorKg, EX.gordura);

export default function CalculadoraMacrosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuita · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Macros
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Descubra uma distribuição de proteínas, carboidratos e gorduras de
            acordo com seu peso e sua meta calórica — e veja os números mudarem
            quando você ajusta a estratégia.
          </p>
        </div>
      </section>

      <Trilha atual="/ferramentas/calculadora-macros" />

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraMacros placement="pagina-ferramenta" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que são macronutrientes?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Macronutrientes — ou macros — são os três nutrientes que fornecem energia:{" "}
              <strong className="text-white">proteínas</strong>,{" "}
              <strong className="text-white">carboidratos</strong> e{" "}
              <strong className="text-white">gorduras</strong>. Todo alimento é composto por alguma
              combinação deles, e a soma da energia dos três é o que forma o total de calorias do seu dia.
              Contar macros é uma forma de olhar a alimentação com mais resolução do que só olhar calorias.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quantas calorias têm proteína, carboidrato e gordura?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Os fatores gerais de Atwater, os mesmos usados na rotulagem nutricional:
            </p>
            <ul className="space-y-2 mb-3">
              <li className="text-gray-300">
                1 g de proteína ≈ <strong className="text-white">{KCAL_POR_G_PROTEINA} kcal</strong>
              </li>
              <li className="text-gray-300">
                1 g de carboidrato ≈ <strong className="text-white">{KCAL_POR_G_CARBO} kcal</strong>
              </li>
              <li className="text-gray-300">
                1 g de gordura ≈ <strong className="text-white">{KCAL_POR_G_GORDURA} kcal</strong>
              </li>
            </ul>
            <p className="text-gray-400 text-sm leading-relaxed">
              É por isso que a gordura "ocupa" menos gramas para a mesma energia: cada grama dela carrega
              mais que o dobro das calorias de um grama de carboidrato.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como calcular os macros
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              A calculadora não divide suas calorias em percentuais prontos. Ela segue uma cascata, e a
              ordem tem motivo:
            </p>
            <ol className="space-y-3 mb-5 text-gray-300 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-white">A meta calórica</strong> define o orçamento de energia do dia.
              </li>
              <li>
                <strong className="text-white">A proteína</strong> vem em gramas por quilo de peso, porque a
                necessidade dela acompanha o seu corpo — não o tamanho da dieta.
              </li>
              <li>
                <strong className="text-white">A gordura</strong> entra como percentual da energia, que é
                como as faixas de referência são expressas.
              </li>
              <li>
                <strong className="text-white">O carboidrato</strong> fica com o que sobrar, por ser o macro
                mais elástico dos três.
              </li>
            </ol>

            <p className="text-gray-300 leading-relaxed mb-3">
              Um exemplo com {EX.peso} kg e meta de {formataNumero(EX.kcal)} kcal, usando{" "}
              {String(EX.gPorKg).replace(".", ",")} g/kg de proteína e {EX.gordura}% de gordura:
            </p>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 space-y-2 mb-4 overflow-x-auto">
              <p>
                Proteína: {EX.peso} × {String(EX.gPorKg).replace(".", ",")} ={" "}
                <span className="text-white">{formataNumero(R.proteina.gramas)} g</span> ={" "}
                {formataNumero(R.proteina.kcal)} kcal
              </p>
              <p>
                Gordura: {EX.gordura}% de {formataNumero(EX.kcal)} = {formataNumero(R.gordura.kcal)} kcal ÷{" "}
                {KCAL_POR_G_GORDURA} = <span className="text-white">{formataNumero(R.gordura.gramas)} g</span>
              </p>
              <p>
                Carboidrato: {formataNumero(EX.kcal)} − {formataNumero(R.proteina.kcal)} −{" "}
                {formataNumero(R.gordura.kcal)} = {formataNumero(R.carboidrato.kcal)} kcal ÷{" "}
                {KCAL_POR_G_CARBO} ={" "}
                <span className="text-white">{formataNumero(R.carboidrato.gramas)} g</span>
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Resultado: <strong className="text-white">{formataNumero(R.proteina.gramas)} g</strong> de
              proteína, <strong className="text-white">{formataNumero(R.carboidrato.gramas)} g</strong> de
              carboidratos e <strong className="text-white">{formataNumero(R.gordura.gramas)} g</strong> de
              gorduras — cerca de {formataNumero(R.totalArredondado)} kcal. A diferença de alguns kcal para a
              meta vem do arredondamento dos gramas, e é normal.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Existe uma distribuição ideal de macros?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Não da forma como costuma ser vendida. Combinações como "40/30/30 para emagrecer" ou "50/25/25
              para hipertrofia" são arbitrárias quando aplicadas a todo mundo: o emagrecimento depende
              principalmente do balanço energético ao longo do tempo, e a hipertrofia não tem um percentual
              universal perfeito. Por isso a calculadora não tem botões de objetivo que trocam os números por
              baixo dos panos.
            </p>
            <p className="text-gray-300 leading-relaxed">
              O que existe são faixas populacionais de referência para adultos — as Acceptable Macronutrient
              Distribution Ranges do {AMDR.fonte}: carboidratos {AMDR.carboidrato.min}–{AMDR.carboidrato.max}%,
              gorduras {AMDR.gordura.min}–{AMDR.gordura.max}% e proteínas {AMDR.proteina.min}–
              {AMDR.proteina.max}% da energia. São referências de população, não metas individuais. Quem treina
              costuma definir proteína em g/kg, e o resultado disso pode cair fora dessas faixas sem que nada
              esteja errado.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              De onde vem a referência de proteína
            </h2>
            <p className="text-gray-300 leading-relaxed">
              As três opções — {FAIXAS_PROTEINA.map((f) => String(f.gPorKg).replace(".", ",")).join(", ")} g/kg
              — são exatamente as mesmas da{" "}
              <Link href="/ferramentas/calculadora-de-proteina" className={ln}>
                calculadora de proteína
              </Link>{" "}
              deste site, e vêm do mesmo lugar no código, de propósito: duas ferramentas do mesmo site não
              podem dizer coisas diferentes. A faixa se apoia em{" "}
              <a href={REFERENCIA_PROTEINA.url} target="_blank" rel="noopener noreferrer" className={ln}>
                {REFERENCIA_PROTEINA.rotulo}
              </a>
              , que estimou cerca de 1,6 g/kg/dia como o ponto a partir do qual mais proteína não mostrou
              benefício adicional claro para massa magra, com intervalo de confiança até cerca de 2,2 g/kg.
              São três referências práticas, não três níveis de eficácia.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Não sabe quantas calorias usar?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Esta calculadora começa depois que a meta calórica já existe. Para chegar nela, a{" "}
              <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>
                calculadora de déficit calórico
              </Link>{" "}
              estima seu gasto diário e as faixas de corte — e leva o resultado direto para cá. Para entender a
              lógica por trás de contar macros no dia a dia,{" "}
              <Link href="/blog/dieta-flexivel-iifym" className={ln}>
                dieta flexível (IIFYM)
              </Link>{" "}
              é o texto mais completo do site. E se o objetivo for ganhar massa,{" "}
              <Link href="/blog/calorias-para-ganhar-massa-muscular" className={ln}>
                quantas calorias para ganhar massa muscular
              </Link>{" "}
              cobre o outro lado da conta.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
