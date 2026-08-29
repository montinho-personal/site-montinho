import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import {
  FAIXAS_DEFICIT,
  NIVEIS,
  REFERENCIA_ADAPTACAO,
  REFERENCIA_TMB,
  aplicaDeficit,
  calculaTDEE,
  calculaTMB,
  formataFaixa,
} from "@/lib/calorias";
import CalculadoraDeficit from "@/components/calorias/CalculadoraDeficit";
import Trilha from "@/components/ferramentas/Trilha";

/**
 * Página própria da calculadora de déficit calórico.
 *
 * Captura a busca com intenção de ferramenta ("calculadora de déficit
 * calórico", "calculadora tdee", "quantas calorias comer para emagrecer"),
 * que os artigos não capturam porque respondem outra intenção — aprender
 * como funciona, não fazer a conta.
 *
 * Canonical para ela mesma, e os artigos seguem canônicos para si. São
 * intenções diferentes: canonicalizar um para o outro apagaria uma das duas
 * do índice sem que ninguém ganhasse nada.
 *
 * O conteúdo em volta não é enchimento: o crawler não digita peso. Sem o
 * exemplo resolvido em HTML estático, a página seria uma caixa vazia para o
 * Google — e para quem chega sem vontade de preencher formulário.
 */
export const metadata: Metadata = {
  title: "Calculadora de Déficit Calórico",
  description:
    "Calcule seu gasto calórico diário (TDEE) e veja quantas calorias comer para emagrecer. Estime TMB, gasto diário e faixas de déficit de 10%, 15–20% e 25%. Gratuita, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/ferramentas/calculadora-deficit-calorico` },
  openGraph: {
    title: "Calculadora de Déficit Calórico | Montinho",
    description:
      "Quantas calorias comer para emagrecer? Informe peso, altura, idade e rotina para estimar seu gasto diário e ver faixas de déficit. Gratuita, sem cadastro.",
    url: `${SITE_URL}/ferramentas/calculadora-deficit-calorico`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

/**
 * Só BreadcrumbList. Nada de FAQPage, AggregateRating ou MedicalWebPage
 * inventados para tentar rich result — os tipos precisam ser semanticamente
 * verdadeiros.
 */
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Calculadora de Déficit Calórico",
      item: `${SITE_URL}/ferramentas/calculadora-deficit-calorico`,
    },
  ],
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

/** Exemplo fixo indexável — o crawler não preenche formulário. */
const EX = { peso: 80, altura: 175, idade: 35 } as const;
const EX_TMB = calculaTMB(EX.peso, EX.altura, EX.idade, "masculino");
const EX_TDEE = calculaTDEE(EX_TMB, 1.55);

export default function CalculadoraDeficitPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuita · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de déficit calórico
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Informe peso, altura, idade e nível de atividade para estimar sua
            taxa metabólica, seu gasto calórico diário e diferentes faixas de
            déficit — com a conta aberta, para você entender de onde vem cada
            número.
          </p>
        </div>
      </section>

      <Trilha atual="/ferramentas/calculadora-deficit-calorico" />

      <section className="py-10 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraDeficit placement="pagina-ferramenta" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como funciona a calculadora de déficit calórico
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A conta acontece em três etapas. Primeiro estimamos a{" "}
              <strong className="text-white">taxa metabólica basal (TMB)</strong>{" "}
              — a energia que o corpo usa em repouso, só para funcionar. Depois
              multiplicamos pelo{" "}
              <strong className="text-white">fator de atividade</strong> da sua
              rotina, chegando ao{" "}
              <strong className="text-white">gasto calórico diário (TDEE)</strong>
              , que é a estimativa de calorias para manter o peso. Por fim,
              aplicamos percentuais de déficit sobre esse gasto.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Um homem de {EX.peso} kg, {EX.altura} cm e {EX.idade} anos tem TMB
              estimada em torno de{" "}
              <strong className="text-white">{formataFaixa(EX_TMB)} kcal/dia</strong>.
              Com rotina moderadamente ativa (fator 1,55), o gasto diário fica
              em aproximadamente{" "}
              <strong className="text-white">{formataFaixa(EX_TDEE)} kcal/dia</strong>.
              Um déficit de 20% levaria a uma meta de cerca de{" "}
              <strong className="text-white">
                {formataFaixa(aplicaDeficit(EX_TDEE, 20))} kcal/dia
              </strong>
              . Os números aparecem arredondados de propósito: casa decimal aqui
              seria falsa precisão.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Por que usar percentual em vez de cortar 500 calorias
            </h2>
            <p className="text-gray-300 leading-relaxed">
              O corte fixo de 500 kcal é a regra mais repetida da internet, e é
              justamente onde ela falha: 500 kcal representam cerca de 18% do
              gasto de quem queima 2.800 por dia, e quase 30% de quem queima
              1.700. O mesmo número absoluto produz experiências completamente
              diferentes — para uma pessoa é um ajuste, para outra é um corte
              severo. Por isso a calculadora trabalha com percentuais: eles
              escalam junto com você.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              As faixas de déficit
            </h2>
            <ul className="space-y-4">
              {FAIXAS_DEFICIT.map((f) => (
                <li key={f.id} className="border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
                  <p className="text-white font-semibold mb-1">
                    {f.titulo} ·{" "}
                    {f.percentualMin === f.percentualMax
                      ? `${f.percentualMin}%`
                      : `${f.percentualMin}–${f.percentualMax}%`}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">{f.descricao}</p>
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-5">
              Nenhuma delas é "o déficit ideal" — esse número não existe de
              forma universal. A faixa moderada aparece em destaque por ser um
              ponto de partida prático para muita gente, não por ser superior às
              outras.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Os fatores de atividade
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-gray-400 font-medium py-2.5 pr-4">Nível</th>
                    <th className="text-left text-gray-400 font-medium py-2.5 pr-4 whitespace-nowrap">Fator</th>
                    <th className="text-left text-gray-400 font-medium py-2.5">Rotina</th>
                  </tr>
                </thead>
                <tbody>
                  {NIVEIS.map((n) => (
                    <tr key={n.id} className="border-b border-white/10">
                      <td className="text-white py-3 pr-4 align-top font-medium whitespace-nowrap">{n.titulo}</td>
                      <td className="text-gray-300 py-3 pr-4 align-top whitespace-nowrap">
                        ×{String(n.fator).replace(".", ",")}
                      </td>
                      <td className="text-gray-300 py-3 align-top leading-relaxed">{n.descricao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mt-5">
              Este é o ponto em que a maioria das calculadoras engana o usuário.
              Treinar uma hora por dia não faz de ninguém "extremamente ativo" se
              as outras horas forem sentadas. Superestimar aqui infla o gasto em
              centenas de calorias e transforma um déficit em manutenção — na
              dúvida entre dois níveis, comece pelo menor.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como calculamos
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A taxa metabólica é estimada pela equação de Mifflin-St Jeor:{" "}
              <a href={REFERENCIA_TMB.url} target="_blank" rel="noopener noreferrer" className={ln}>
                {REFERENCIA_TMB.rotulo}
              </a>
              . {REFERENCIA_TMB.detalhe} Ela é a equação preditiva mais usada em
              prática clínica e nutricional — o que não a torna uma medição: é
              uma estimativa populacional aplicada a um caso individual.
            </p>
            <p className="text-gray-300 leading-relaxed">
              O aviso de recalibrar em vez de cortar mais tem base:{" "}
              <a href={REFERENCIA_ADAPTACAO.url} target="_blank" rel="noopener noreferrer" className={ln}>
                {REFERENCIA_ADAPTACAO.rotulo}
              </a>{" "}
              mostrou que quem perde peso passa a gastar menos energia do que o
              esperado para o novo peso corporal. É por isso que a ferramenta
              trata o resultado como ponto de partida a ser ajustado pela
              realidade, e nunca sugere cortes sucessivos automáticos.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Para entender os números a fundo
            </h2>
            <p className="text-gray-300 leading-relaxed">
              A explicação completa de gasto energético está em{" "}
              <Link href="/blog/como-calcular-tmb-tdee-calorias" className={ln}>
                Como Calcular Seu Gasto Calórico (TMB e TDEE)
              </Link>
              . Para entender o tamanho do corte, o guia de{" "}
              <Link href="/blog/quantas-calorias-cortar-para-emagrecer" className={ln}>
                quantas calorias cortar para emagrecer
              </Link>{" "}
              detalha as faixas na prática. E o texto de{" "}
              <Link href="/blog/deficit-calorico-como-calcular" className={ln}>
                déficit calórico: o que é e como calcular
              </Link>{" "}
              cobre o conceito inteiro, incluindo o que fazer quando a balança
              trava. Se a dúvida seguinte for proteína, a{" "}
              <Link href="/ferramentas/calculadora-de-proteina" className={ln}>
                calculadora de proteína
              </Link>{" "}
              resolve — preservar músculo em déficit depende dela.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
