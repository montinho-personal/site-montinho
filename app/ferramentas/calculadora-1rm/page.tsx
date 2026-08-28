import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import {
  CONTEXTO_FAIXAS,
  FONTE_BRZYCKI,
  FONTE_EPLEY,
  FONTE_LIMITES,
  NOTA_SEM_ZONA_MAGICA,
  PERCENTUAIS,
  arredondaKg,
  cargaDoPercentual,
  epley1RM,
} from "@/lib/onerm";
import CalculadoraOneRM from "@/components/onerm/CalculadoraOneRM";
import Trilha from "@/components/ferramentas/Trilha";

/**
 * Página própria da calculadora de 1RM.
 *
 * Atende a intenção de ferramenta — "calcular 1RM", "quanto colocar na
 * barra" — que os artigos não atendem porque respondem outra pergunta: o
 * que é 1RM, como progredir, quantas repetições fazer. Por isso canonical
 * para ela mesma, e os artigos seguem canônicos para si.
 *
 * O exemplo de 80 kg × 8 aparece resolvido em HTML estático porque o
 * crawler não digita carga. Sem ele a página seria uma caixa vazia para o
 * Google e para quem chega sem vontade de preencher nada.
 */
export const metadata: Metadata = {
  title: "Calculadora de 1RM: Descubra sua Carga Máxima",
  description:
    "Calcule seu 1RM a partir da carga e repetições e descubra quanto usar em 60%, 70%, 80% e 90% do treino — incluindo quais anilhas colocar na barra. Gratuita, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/ferramentas/calculadora-1rm` },
  openGraph: {
    title: "Calculadora de 1RM e Carga de Treino | Montinho",
    description:
      "Informe carga e repetições para estimar seu 1RM, ver as cargas de cada intensidade e descobrir quais anilhas colocar na barra. Gratuita, sem cadastro.",
    url: `${SITE_URL}/ferramentas/calculadora-1rm`,
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
      name: "Calculadora de 1RM",
      item: `${SITE_URL}/ferramentas/calculadora-1rm`,
    },
  ],
};

const h = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

/** Exemplo fixo indexável. */
const EX = { carga: 80, reps: 8 } as const;
const EX_1RM = epley1RM(EX.carga, EX.reps);

export default function CalculadoraOneRMPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuita · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de 1RM e carga de treino
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Informe a carga e quantas repetições você conseguiu fazer para
            estimar seu 1RM e visualizar as cargas correspondentes a diferentes
            intensidades do treino — incluindo quais anilhas colocar na barra.
          </p>
        </div>
      </section>

      <Trilha atual="/ferramentas/calculadora-1rm" />

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraOneRM placement="pagina-ferramenta" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que é 1RM?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              1RM significa <strong className="text-white">uma repetição máxima</strong>: a maior carga que
              uma pessoa conseguiria movimentar aproximadamente uma vez em um determinado exercício. É a
              principal referência para descrever intensidade em treinamento de força — quando um programa
              pede "3 séries a 80%", é 80% do 1RM que ele quer dizer.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como calcular o 1RM sem testar carga máxima
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Você não precisa testar uma repetição máxima real para ter uma referência. A calculadora usa uma
              série que você já fez no treino normal e estima o 1RM pela equação de {FONTE_EPLEY.rotuloCurto}:
            </p>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-3 overflow-x-auto">
              <p>1RM = carga × (1 + repetições ÷ 30)</p>
              <p className="mt-2">
                {EX.carga} × (1 + {EX.reps} ÷ 30) ={" "}
                <span className="text-white">≈ {arredondaKg(EX_1RM)} kg</span>
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Ou seja: quem faz {EX.carga} kg por {EX.reps} repetições tem 1RM estimado em torno de{" "}
              <strong className="text-white">{arredondaKg(EX_1RM)} kg</strong>. É uma{" "}
              <strong className="text-white">estimativa</strong>, não uma medição — a equação sai de uma série
              submáxima, e técnica, experiência, fadiga e proximidade da falha mudam o resultado.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como usar as porcentagens do 1RM
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Com o 1RM estimado, cada intensidade vira uma carga concreta. Para um 1RM de{" "}
              {arredondaKg(EX_1RM)} kg:
            </p>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-gray-400 font-medium py-2.5 pr-4">Intensidade</th>
                    <th className="text-left text-gray-400 font-medium py-2.5">Carga aproximada</th>
                  </tr>
                </thead>
                <tbody>
                  {PERCENTUAIS.map((p) => (
                    <tr key={p} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{p}%</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">
                        {arredondaKg(cargaDoPercentual(EX_1RM, p))} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3">
              {CONTEXTO_FAIXAS.map((f) => (
                <div key={f.titulo}>
                  <p className="text-white text-sm font-semibold">
                    {f.titulo}{" "}
                    <span className="text-gray-500 font-normal">
                      {f.de}–{f.ate}%
                    </span>
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.texto}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-300 leading-relaxed mt-5 border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
              {NOTA_SEM_ZONA_MAGICA}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quanto colocar na barra
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Saber que o alvo é 81 kg não resolve nada sozinho: a academia não tem qualquer peso, e a barra
              precisa ser montada simetricamente. A ferramenta arredonda a carga para o incremento que existe
              onde você treina e mostra as anilhas de cada lado — considerando o peso real da sua barra e só as
              anilhas que você marcou como disponíveis. Quando a carga exata não dá para montar, ela mostra a
              opção imediatamente abaixo e a imediatamente acima, em vez de fingir que o número redondo existe.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Precisão e limites da estimativa
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              As equações de estimativa vieram da prática de treinamento de força:{" "}
              {FONTE_EPLEY.rotulo}, e {FONTE_BRZYCKI.rotulo}. Elas concordam bastante em séries curtas e
              divergem conforme as repetições aumentam — por isso a faixa preferencial é até 10 repetições,
              e acima de 15 a ferramenta prefere orientar a usar uma carga maior a devolver um número frágil.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Há também um limite por exercício.{" "}
              <a href={FONTE_LIMITES.url} target="_blank" rel="noopener noreferrer" className={ln}>
                {FONTE_LIMITES.rotulo}
              </a>{" "}
              {FONTE_LIMITES.resumo} Na prática: use a estimativa para comparar cargas e acompanhar sua
              evolução no mesmo exercício, e não como um número absoluto para atravessar movimentos
              diferentes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como usar isso no treino
            </h2>
            <p className="text-gray-300 leading-relaxed">
              O número só vira treino quando entra numa estrutura. Para saber quando aumentar a carga, o guia
              de{" "}
              <Link href="/blog/progressao-de-carga" className={ln}>
                progressão de carga
              </Link>{" "}
              cobre o mecanismo. Para escolher o peso na série de hoje,{" "}
              <Link href="/blog/carga-ideal-como-escolher" className={ln}>
                qual a carga ideal
              </Link>{" "}
              é o texto mais direto. Para a relação entre carga e repetições,{" "}
              <Link href="/blog/quantas-repeticoes-para-hipertrofia" className={ln}>
                quantas repetições fazer para hipertrofia
              </Link>
              . E se você usa esforço percebido em vez de percentual, a{" "}
              <Link href="/blog/escala-rpe-musculacao" className={ln}>
                escala RPE
              </Link>{" "}
              é o caminho complementar.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
