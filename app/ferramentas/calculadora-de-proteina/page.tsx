import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import { ALIMENTOS, FAIXAS, REFERENCIA_CIENTIFICA, gramasPorDia } from "@/lib/proteina";
import CalculadoraProteina from "@/components/proteina/CalculadoraProteina";
import Compartilhar from "@/components/share/Compartilhar";

/**
 * Página própria da calculadora — captura a busca direta por "calculadora de
 * proteína", que os artigos não capturam porque não têm esse título.
 *
 * O QUE ESTE TEXTO PODE E NÃO PODE SER
 *
 * Não pode ser um resumo do artigo de proteína do acervo. Ele já responde
 * por que a proteína importa, quanto muda no bulking, se whey é obrigatório
 * e como distribuir no dia — dezessete H2 de conteúdo informacional. Repetir
 * qualquer um deles aqui criaria duas páginas disputando a mesma busca, que
 * é a canibalização que o AGENTS.md manda conferir ANTES de escrever.
 *
 * O que cabe aqui é o que só faz sentido numa calculadora: a tabela por peso
 * (o crawler não digita peso, e é ela que responde "quantas gramas para 70
 * kg"), como usar, a ressalva de peso total contra massa magra, e quanto
 * aquele número vira em comida. Cada assunto do artigo sai daqui com um
 * link, não com um parágrafo.
 */
export const metadata: Metadata = {
  title: "Calculadora de Proteína: Quantos Gramas por Dia",
  description:
    "Digite seu peso e veja quantos gramas de proteína por dia, de 1,6 a 2,2 g/kg, com tabela pronta por peso e exemplos de alimentos. Grátis, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/ferramentas/calculadora-de-proteina` },
  openGraph: {
    title: "Calculadora de Proteína: Quantos Gramas por Dia | Montinho",
    description:
      "Quanto de proteína por dia? Digite seu peso e veja as referências de 1,6 a 2,2 g/kg, baseadas em evidência. Gratuito, sem cadastro.",
    url: `${SITE_URL}/ferramentas/calculadora-de-proteina`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const URL_PAGINA = `${SITE_URL}/ferramentas/calculadora-de-proteina`;

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Proteína", item: URL_PAGINA },
  ],
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Proteína Diária",
  descricao:
    "Calcula a quantidade de proteína por dia a partir do peso corporal, nas referências de 1,6, 2,0 e 2,2 g por quilo.",
  caminho: "/ferramentas/calculadora-de-proteina",
});

/*
 * Cada pergunta abaixo aparece escrita na página, com a mesma resposta. O
 * FAQPage que descreve conteúdo invisível é violação da diretriz do Google e
 * não é armadilha teórica: é o motivo mais comum de perder o rich result.
 */
const PERGUNTAS: { q: string; a: string }[] = [
  {
    q: "Quantos gramas de proteína por dia eu preciso?",
    a: "Para quem treina musculação, a faixa usada como referência vai de 1,6 a 2,2 g por quilo de peso corporal por dia. Uma pessoa de 70 kg fica entre 112 g e 154 g por dia. A calculadora mostra os três valores porque a evidência aponta uma faixa, não um número único.",
  },
  {
    q: "A calculadora serve para quem quer emagrecer?",
    a: "Serve como referência, sim. Manter a proteína durante o emagrecimento é o que ajuda a preservar massa magra enquanto o peso cai. O que a calculadora não faz é definir quantas calorias você deve comer — isso depende de gasto, rotina e objetivo.",
  },
  {
    q: "Uso o peso atual ou o peso que quero ter?",
    a: "Use o peso atual. As faixas nasceram de estudos com pessoas treinadas e sem obesidade, então em quem tem percentual de gordura muito alto a conta pelo peso total tende a superestimar. Nesses casos, profissionais costumam calcular sobre a massa magra ou sobre um peso ajustado — vale conversar com um nutricionista antes de fixar a meta.",
  },
  {
    q: "Preciso tomar whey para bater essa quantidade?",
    a: "Não. Whey é praticidade, não obrigação: a mesma quantidade de proteína pode vir de carne, ovo, laticínio, feijão e lentilha. O suplemento resolve o dia em que a comida não coube na rotina, e é assim que ele deve ser tratado.",
  },
  {
    q: "Proteína demais faz mal aos rins?",
    a: "Em pessoas com rins saudáveis, ingestões dentro dessa faixa não mostraram dano renal nos estudos disponíveis. Quem já tem doença renal ou outra condição que exige controle de proteína precisa seguir a orientação do próprio médico, e não uma calculadora.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PERGUNTAS.map((p) => ({
    "@type": "Question",
    name: p.q,
    acceptedAnswer: { "@type": "Answer", text: p.a },
  })),
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

/** Exemplo fixo indexável — o crawler não digita peso. */
const EXEMPLO_KG = 80;

/*
 * A tabela existe porque o robô do Google não preenche formulário. Sem ela a
 * página é uma caixa vazia para quem busca "quantas gramas de proteína para
 * 70 kg" — e essa busca, somada peso a peso, é maior que a busca pelo nome
 * da ferramenta. De 50 a 110 kg cobre a quase totalidade de quem procura.
 */
const PESOS_TABELA = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110];

/** Um dia montado com os alimentos já conferidos contra a TACO. */
const DIA_EXEMPLO = [
  { refeicao: "Café da manhã", itens: ["2 ovos cozidos", "1 pote de iogurte natural (100 g)"], proteina: 18 },
  { refeicao: "Almoço", itens: ["100 g de peito de frango grelhado", "1 concha de feijão carioca"], proteina: 37 },
  { refeicao: "Lanche", itens: ["100 g de queijo minas frescal"], proteina: 17 },
  { refeicao: "Jantar", itens: ["100 g de patinho grelhado", "100 g de lentilha cozida"], proteina: 42 },
];
const TOTAL_DIA_EXEMPLO = DIA_EXEMPLO.reduce((s, r) => s + r.proteina, 0);

export default function CalculadoraProteinaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
            Informe seu peso para calcular quantos gramas de proteína por dia
            nas referências de 1,6, 2,0 e 2,2 g por quilo de peso corporal — a
            faixa usada por quem treina musculação.
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
              Como usar a calculadora de proteína
            </h2>
            <ol className="text-gray-300 leading-relaxed space-y-3 list-decimal pl-5">
              <li>
                <strong className="text-white">Digite o seu peso em quilos.</strong>{" "}
                Pode usar vírgula — 72,5 funciona igual a 72.5. É o único dado
                que a conta precisa, e ele não sai do seu navegador.
              </li>
              <li>
                <strong className="text-white">Leia as três referências como uma faixa.</strong>{" "}
                1,6, 2,0 e 2,2 g/kg não são três níveis de resultado. São as
                bordas e o meio do intervalo que a evidência sustenta.
              </li>
              <li>
                <strong className="text-white">Escolha em quantas refeições dividir.</strong>{" "}
                A calculadora reparte o total do dia. O que conta é o total —
                a divisão existe para facilitar a vida, não porque a fatia
                exata mude o resultado.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Tabela: quantos gramas de proteína por dia, por peso
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Se preferir só conferir o seu número, ele está aqui. Os valores
              aparecem em números inteiros de propósito — casa decimal em
              proteína seria falsa precisão.
            </p>
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[420px] text-sm text-gray-300">
                <caption className="sr-only">
                  Gramas de proteína por dia conforme o peso corporal, nas referências de 1,6, 2,0 e 2,2 g por quilo
                </caption>
                <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">Peso</th>
                    {FAIXAS.map((f) => (
                      <th key={f.id} scope="col" className="px-3 py-2 font-medium">
                        {String(f.gPorKg).replace(".", ",")} g/kg
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PESOS_TABELA.map((kg) => (
                    <tr key={kg} className="border-t border-white/5">
                      <th scope="row" className="px-3 py-2 text-left font-medium text-white">{kg} kg</th>
                      {FAIXAS.map((f) => (
                        <td key={f.id} className="px-3 py-2">{gramasPorDia(kg, f.gPorKg)} g</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              A conta usa o peso total ou a massa magra?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Esta calculadora usa o <strong className="text-white">peso total</strong>,
              que é como a faixa foi estudada e como ela é aplicada na prática.
              Para a maior parte das pessoas isso resolve.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Vale saber onde essa simplificação aperta: os estudos que
              sustentam a faixa foram feitos majoritariamente com pessoas
              treinadas e sem obesidade. Em quem tem percentual de gordura
              muito alto, calcular sobre o peso total tende a superestimar a
              necessidade, porque tecido gorduroso não demanda proteína como
              músculo demanda. Nesses casos profissionais costumam calcular
              sobre a massa magra ou sobre um peso ajustado — e aí a conta
              deixa de ser de calculadora e passa a ser de nutricionista.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quanto isso é em comida de verdade
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Gramas de proteína não são gramas de comida: 100 g de frango não
              são 100 g de proteína. Um dia comum fica assim, com valores da
              TACO ({ALIMENTOS[0].versaoFonte}):
            </p>
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[420px] text-sm text-gray-300">
                <caption className="sr-only">Exemplo de dia alimentar e a proteína de cada refeição</caption>
                <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">Refeição</th>
                    <th scope="col" className="px-3 py-2 font-medium">O que tem</th>
                    <th scope="col" className="px-3 py-2 font-medium">Proteína</th>
                  </tr>
                </thead>
                <tbody>
                  {DIA_EXEMPLO.map((r) => (
                    <tr key={r.refeicao} className="border-t border-white/5">
                      <th scope="row" className="px-3 py-2 text-left font-medium text-white">{r.refeicao}</th>
                      <td className="px-3 py-2">{r.itens.join(" + ")}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.proteina} g</td>
                    </tr>
                  ))}
                  <tr className="border-t border-white/10 bg-white/5">
                    <th scope="row" className="px-3 py-2 text-left font-semibold text-white">Total do dia</th>
                    <td className="px-3 py-2" />
                    <td className="px-3 py-2 font-semibold text-white whitespace-nowrap">{TOTAL_DIA_EXEMPLO} g</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed mt-4">
              São {TOTAL_DIA_EXEMPLO} g sem nenhum suplemento — o suficiente
              para uma pessoa de{" "}
              {Math.round(TOTAL_DIA_EXEMPLO / FAIXAS[0].gPorKg)} kg na
              referência de {String(FAIXAS[0].gPorKg).replace(".", ",")} g/kg.
              Quem pesa mais chega lá aumentando as porções de carne, ovo e
              laticínio, que são as que carregam o peso da conta. A lista
              completa de fontes está em{" "}
              <Link href="/blog/alimentos-ricos-em-proteina" className={ln}>
                alimentos ricos em proteína
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              De onde vem a faixa de 1,6 a 2,2 g/kg
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
              .
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
            <h2 className="text-2xl font-bold text-white mb-6" style={h}>
              Perguntas frequentes sobre a calculadora de proteína
            </h2>
            <div className="space-y-6">
              {PERGUNTAS.map((p) => (
                <div key={p.q}>
                  <h3 className="text-lg font-semibold text-white mb-2">{p.q}</h3>
                  <p className="text-gray-300 leading-relaxed">{p.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Para entender os números a fundo
            </h2>
            <p className="text-gray-300 leading-relaxed">
              A explicação completa — por que a proteína importa, o que muda
              entre bulking e cutting, se existe limite por refeição, como
              distribuir no dia — está em{" "}
              <Link href="/blog/quanta-proteina-por-dia-para-ganhar-massa-muscular" className={ln}>
                Quanta Proteína por Dia Para Ganhar Massa Muscular
              </Link>
              . E se a dúvida seguinte for estrutura de treino, o{" "}
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
