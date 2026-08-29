import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { EXERCICIOS } from "@/lib/treino/exercicios";
import { MUSCULOS } from "@/lib/treino/musculos";
import { FAIXAS, FONTES, NOTA_FREQUENCIA, NOTA_INDIVIDUALIDADE, NOTA_SERIE_VALIDA, PESO_SECUNDARIO } from "@/lib/treino/volume";
import CalculadoraVolume from "@/components/volume/CalculadoraVolume";
import Trilha from "@/components/ferramentas/Trilha";

/**
 * Página própria da Calculadora de Volume.
 *
 * Slug: /ferramentas/calculadora-volume-treino. Os slugs de ferramenta do
 * site começam com "calculadora-" (proteina, deficit-calorico, 1rm, macros),
 * e manter o padrão vale mais do que o "volume-de-treino" ligeiramente mais
 * curto — além de não colidir com o artigo volume-de-treino-ideal, que
 * responde outra intenção e continua canônico para si.
 */
export const metadata: Metadata = {
  title: "Calculadora de Volume de Treino: Séries por Músculo",
  description:
    "Calcule quantas séries semanais você faz para peito, costas, pernas, braços e ombros. Monte seu treino e veja o volume, a frequência e a distribuição de cada grupo muscular.",
  alternates: { canonical: `${SITE_URL}/ferramentas/calculadora-volume-treino` },
  openGraph: {
    title: "Calculadora de Volume de Treino | Montinho",
    description:
      "Monte seu treino e descubra automaticamente quantas séries semanais cada músculo recebe — com frequência e distribuição na semana. Gratuita, sem cadastro.",
    url: `${SITE_URL}/ferramentas/calculadora-volume-treino`,
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
    {
      "@type": "ListItem",
      position: 3,
      name: "Calculadora de Volume de Treino",
      item: `${SITE_URL}/ferramentas/calculadora-volume-treino`,
    },
  ],
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function CalculadoraVolumePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuita · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Volume de Treino
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Monte seu treino e veja automaticamente quantas séries cada músculo
            recebe por semana — com a frequência e a distribuição de cada grupo
            ao longo dos dias.
          </p>
        </div>
      </section>

      <Trilha atual="/ferramentas/calculadora-volume-treino" />

      <section className="py-10 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraVolume placement="pagina-ferramenta" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que é volume de treino?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Volume é a quantidade de trabalho que você realiza. A literatura usa mais de uma definição — dá para
              medir por tonelagem (séries × repetições × carga), por repetições totais ou por número de séries.
              Esta ferramenta usa <strong className="text-white">séries de trabalho por grupo muscular por
              semana</strong>, que é a métrica mais prática para organizar hipertrofia e a mais usada nos estudos
              de dose-resposta.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Volume não é o tempo que você passa na academia. Duas horas com muito descanso e conversa podem
              gerar menos séries do que quarenta minutos objetivos.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quantas séries por semana fazer para cada músculo?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Não existe um número universal. O que a literatura permite dizer é que há uma relação dose-resposta:
              mais séries semanais tendem a produzir mais hipertrofia em média, até certo ponto, e depois os
              ganhos adicionais vão diminuindo enquanto a demanda de recuperação continua subindo.
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              O <a href={FONTES.acsm.url} target="_blank" rel="noopener noreferrer" className={ln}>{FONTES.acsm.rotulo}</a>{" "}
              — {FONTES.acsm.resumo} A meta-análise de{" "}
              <a href={FONTES.schoenfeld.url} target="_blank" rel="noopener noreferrer" className={ln}>
                {FONTES.schoenfeld.rotulo}
              </a>{" "}
              chegou à mesma direção.
            </p>
            <p className="text-gray-300 leading-relaxed mb-5">
              As faixas abaixo são <strong className="text-white">régua de leitura, não meta</strong>. O volume
              adequado para você depende de experiência, esforço das séries, escolha de exercício, frequência,
              recuperação, sono, alimentação, idade e fase de treino — coisas que nenhuma calculadora sabe.
            </p>
            <ul className="space-y-3">
              {FAIXAS.map((f) => (
                <li key={f.nivel} className="border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
                  <p className="text-white font-semibold mb-1">
                    {f.rotulo}{" "}
                    <span className="text-gray-500 font-normal">
                      {f.max === null ? `${f.min}+ séries` : `${f.min}–${f.max} séries`}
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">{f.texto}</p>
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-5">
              Repare que nenhuma faixa se chama "ideal", "certa" ou "excessiva". Um volume muito elevado não
              significa overtreinamento — significa que vale observar desempenho e recuperação ao longo das
              semanas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que conta como uma série válida?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">{NOTA_SERIE_VALIDA}</p>
            <p className="text-gray-300 leading-relaxed mb-3">
              Essa distinção é o que separa duas pessoas com o mesmo número na planilha. Quem faz 16 séries de
              peitoral parando bem antes do esforço real não está no mesmo lugar de quem faz 16 séries
              desafiadoras — e a ferramenta não tem como saber a diferença, porque ela conta o que você
              registrou, não o esforço que você aplicou.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Sobre a falha em si, vale a precisão:{" "}
              <a href={FONTES.refalo.url} target="_blank" rel="noopener noreferrer" className={ln}>
                {FONTES.refalo.rotulo}
              </a>{" "}
              {FONTES.refalo.resumo} Ou seja: a série precisa ser difícil, mas transformar todo treino em falha
              absoluta não é o caminho — cobra recuperação e não mostrou entregar mais.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Cada pessoa responde de um jeito
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">{NOTA_INDIVIDUALIDADE}</p>
            <p className="text-gray-300 leading-relaxed mb-3">
              O melhor retrato disso vem de{" "}
              <a href={FONTES.hubal.url} target="_blank" rel="noopener noreferrer" className={ln}>
                {FONTES.hubal.rotulo}
              </a>
              : {FONTES.hubal.resumo}
            </p>
            <p className="text-gray-300 leading-relaxed">
              Ninguém sabe de antemão em que ponto dessa distribuição você está — nem uma calculadora, nem um
              estudo, nem um professor no primeiro dia. O que dá para fazer é começar por uma referência
              razoável, aplicar com esforço de verdade, e ajustar a partir do que o seu corpo mostrar em
              desempenho, recuperação e resultado ao longo das semanas. A tabela é o mapa; o território é você.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Séries diretas e indiretas contam igual?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Não. Uma <strong className="text-white">série direta</strong> é aquela de um exercício em que o
              músculo é um dos alvos principais — supino para peitoral, puxada para costas. Uma{" "}
              <strong className="text-white">série indireta</strong> é a participação como auxiliar: o tríceps
              trabalha no supino, mas não do mesmo jeito que trabalha no tríceps pulley.
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              O indicador principal da ferramenta são as séries diretas. Se você ligar a contagem de secundários,
              cada série indireta soma {String(PESO_SECUNDARIO).replace(".", ",")} série equivalente — e isso é uma{" "}
              <strong className="text-white">convenção de modelagem, não um achado científico</strong>. Não existe
              conversão universal exata entre uma série indireta e uma direta; o número serve para visualizar que
              o tríceps de quem faz muito supino não está em zero.
            </p>
            <p className="text-gray-300 leading-relaxed">
              A ferramenta também nunca soma a mesma série em vários músculos como se fossem séries diferentes.
              Um supino de 4 séries é 4 séries de trabalho — que aparecem no peitoral, e em participação no
              tríceps e no deltoide anterior, sem virar 12.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              É melhor distribuir o volume durante a semana?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">{NOTA_FREQUENCIA}</p>
            <p className="text-gray-300 leading-relaxed">
              Ou seja: treinar peito duas vezes por semana não é automaticamente melhor que uma. O que a
              distribuição resolve é outra coisa — fazer 18 séries de peitoral numa sessão só costuma custar
              qualidade nas últimas, e dividir pode ajudar a manter o esforço alto em todas. Por isso a ferramenta
              aponta quando o volume de um músculo está muito concentrado num único dia, mas nunca chama isso de
              erro.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como a ferramenta identifica os músculos
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A base tem <strong className="text-white">{EXERCICIOS.length} exercícios</strong> classificados à mão,
              com os nomes usados nas academias brasileiras, distribuídos em{" "}
              <strong className="text-white">{MUSCULOS.length} grupos musculares</strong>. Cada exercício tem seus
              músculos primários e secundários mapeados — e um exercício pode ter mais de um primário, porque
              agachamento é quadríceps <em>e</em> glúteo.
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              Exercícios unilaterais são tratados corretamente: quem faz 3 séries de afundo com cada perna fez 3
              séries de estímulo para o quadríceps, não 6.
            </p>
            <p className="text-gray-300 leading-relaxed">
              A classificação padrão pode ser editada exercício a exercício, porque execução muda ênfase — e você
              pode criar exercícios que não estão na base. Séries marcadas como aquecimento ficam de fora do
              volume de trabalho.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Para ir mais fundo
            </h2>
            <p className="text-gray-300 leading-relaxed">
              O guia de{" "}
              <Link href="/blog/volume-de-treino-ideal" className={ln}>
                volume de treino
              </Link>{" "}
              cobre o conceito inteiro, e{" "}
              <Link href="/blog/quantas-series-para-hipertrofia" className={ln}>
                quantas séries fazer para hipertrofia
              </Link>{" "}
              detalha a evidência. Para a outra metade da conta — a frequência —{" "}
              <Link href="/blog/frequencia-de-treino" className={ln}>
                quantas vezes estimular cada músculo
              </Link>
              . E se a dúvida for como organizar a semana,{" "}
              <Link href="/blog/push-pull-legs" className={ln}>
                push pull legs
              </Link>{" "}
              e{" "}
              <Link href="/blog/treino-upper-lower-superior-inferior" className={ln}>
                upper/lower
              </Link>{" "}
              mostram as duas divisões mais usadas. Volume diz quanto trabalho você faz; para estimar a intensidade
              das cargas, a{" "}
              <Link href="/ferramentas/calculadora-1rm" className={ln}>
                calculadora de 1RM
              </Link>{" "}
              resolve o outro lado.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
