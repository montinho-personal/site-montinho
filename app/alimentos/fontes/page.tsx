import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { todosAlimentos } from "@/lib/alimentos/base";
import { AVISO_NAO_SUBSTITUI, AVISO_VARIACAO, FONTES } from "@/lib/alimentos/fontes";
import { DEFINICAO_BRANCO, DEFINICAO_NA, DEFINICAO_TRACO } from "@/lib/alimentos/nutrientes";

/**
 * De onde vêm os dados.
 *
 * Não é página de créditos. É a página que responde "por que eu deveria
 * acreditar nesse número?" — e ela vale mais para a confiança do que
 * qualquer selo. Inclui o que a ferramenta NÃO sabe, porque uma página de
 * fontes que só elogia a própria fonte não é uma página de fontes.
 */
export const metadata: Metadata = {
  title: "Fontes dos Dados Nutricionais",
  description:
    "De onde vêm os dados da tabela nutricional do Montinho: TACO (NEPA/UNICAMP), como normalizamos os valores, o que significa traço e por que campo vazio não é zero.",
  alternates: { canonical: `${SITE_URL}/alimentos/fontes` },
  openGraph: {
    title: "Fontes dos Dados Nutricionais | Montinho",
    description:
      "De onde vêm os dados da tabela nutricional do Montinho: TACO (NEPA/UNICAMP), como os valores são normalizados e o que a ferramenta não sabe.",
    url: `${SITE_URL}/alimentos/fontes`,
    type: "article",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function FontesPage() {
  const total = todosAlimentos().length;

  return (
    <section className="py-14 bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm">
          <Link href="/alimentos" className={`text-gray-400 ${ln}`}>
            ← Tabela nutricional
          </Link>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6" style={h}>
          Como verificamos os dados
        </h1>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" style={h}>
              A fonte
            </h2>
            <p className="mb-3">
              Os {total} alimentos vêm da <strong className="text-white">{FONTES.TACO.nomeCompleto}</strong>, produzida
              pelo {FONTES.TACO.instituicao}. É a referência brasileira de composição de alimentos: análise
              laboratorial de alimentos como eles chegam à mesa aqui, e não a tradução de uma tabela estrangeira.
            </p>
            <p className="text-gray-400 text-sm">
              {FONTES.TACO.licenca} A citação aparece em toda página de alimento, como a fonte pede.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" style={h}>
              Como os dados entram aqui
            </h2>
            <p className="mb-3">
              A planilha oficial entra sem ser editada à mão, e um programa a converte para o formato do site. O
              programa recusa qualquer linha com valor negativo relevante, unidade desconhecida, nutriente duplicado ou
              valor fisicamente impossível — e escreve o motivo da recusa.
            </p>
            <p className="mb-3">
              Ele também confere a energia informada contra a soma dos macronutrientes. Quando as duas divergem muito,
              a linha é marcada para conferência humana — mas o valor oficial <strong className="text-white">nunca</strong>{" "}
              é substituído pela nossa conta. A fonte manda.
            </p>
            <p className="text-gray-400 text-sm">
              Rodar a importação de novo com a mesma planilha produz exatamente o mesmo resultado. Nenhum número foi
              digitado, ajustado ou arredondado à mão.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" style={h}>
              Por que às vezes não aparece um número
            </h2>
            <p className="mb-4">
              Muita tabela na internet mostra <strong className="text-white">0</strong> quando o dado simplesmente não
              existe. Isso faz o site afirmar que um alimento não tem ferro quando ninguém mediu o ferro dele. Aqui as
              situações ficam separadas:
            </p>
            <div className="border border-white/15 p-4 space-y-3 text-sm">
              <p><strong className="text-gray-100">0</strong> — analisado, e o resultado foi zero.</p>
              <p><strong className="text-gray-100">tr</strong> — {DEFINICAO_TRACO}</p>
              <p><strong className="text-gray-100">n/a</strong> — {DEFINICAO_NA}</p>
              <p><strong className="text-gray-100">—</strong> — {DEFINICAO_BRANCO}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" style={h}>
              As medidas caseiras
            </h2>
            <p className="mb-3">
              A TACO diz o que tem em 100 g e não diz o que são 100 g de comida. A ponte entre as duas coisas — “1
              concha”, “1 filé” — vem da <strong className="text-white">{FONTES.IBGE_POF.nomeCompleto}</strong>, do{" "}
              {FONTES.IBGE_POF.instituicao}.
            </p>
            <p className="mb-3 text-gray-400">{FONTES.IBGE_POF.metodologia}</p>
            <p className="text-gray-400 text-sm mb-3">
              É por isso que esses pesos valem mais que a estimativa de quem escreve um site: não são chute, são
              consumo relatado por milhares de domicílios, cruzado com pesagem direta em universidade. Cada medida
              aqui carrega o código do alimento na pesquisa e a preparação a que se refere — porque 1 unidade de peito
              de frango cru pesa quase o dobro de 1 filé cozido.
            </p>
            {/*
              A diferença entre "conferido" e "decidido" fica na tela, e não
              só no código. Quem lê tem direito de saber que a autorização da
              TACO é expressa e a da POF não é — em vez de ver as duas
              apresentadas com a mesma segurança.
            */}
            {FONTES.IBGE_POF.decisaoDoResponsavel && (
              <p className="text-gray-500 text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}>
                <strong className="text-gray-300">Sobre a autorização.</strong> Diferente da TACO, que autoriza a
                reprodução por escrito, esta publicação não trata do assunto — nem na página de créditos, nem nos
                termos de uso do portal do IBGE, que cuidam de dados pessoais. Diante do silêncio da fonte, o uso das
                medidas foi decisão do responsável por este site, em{" "}
                {FONTES.IBGE_POF.decisaoDoResponsavel.em.split("-").reverse().join("/")}, com atribuição integral ao
                IBGE em cada alimento.
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" style={h}>
              Cru e cozido são alimentos diferentes
            </h2>
            <p>
              100 g de arroz cru têm quase três vezes as calorias de 100 g de arroz cozido, e nada de misterioso
              acontece no meio: cozinhar adiciona água, e a água pesa sem trazer nutriente. Por isso o preparo faz
              parte do nome de cada alimento aqui, e nunca somamos cru com cozido na mesma lista.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" style={h}>
              O que estes dados não são
            </h2>
            <p className="mb-3">{AVISO_VARIACAO}</p>
            <p className="mb-3">{AVISO_NAO_SUBSTITUI}</p>
            <p className="text-gray-400">
              A tabela também não cobre produtos de marca. Whey, iogurte proteico e barra de proteína mudam de
              formulação entre marcas e entre versões da mesma marca — dizer “whey tem 24 g de proteína” seria inventar
              uma média que não descreve nenhum produto real. Para esses, o rótulo da embalagem é a fonte certa.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" style={h}>
              Fontes que consideramos e não usamos
            </h2>
            <p className="mb-3">
              A <strong className="text-white">{FONTES.TBCA.nomeCompleto}</strong> ({FONTES.TBCA.instituicao}) tem
              dados excelentes. Não a usamos: {FONTES.TBCA.licenca.toLowerCase()}
            </p>
            <p className="text-gray-400 text-sm">
              O <strong className="text-gray-200">{FONTES.USDA.nomeCompleto}</strong> ({FONTES.USDA.instituicao}) está
              em domínio público e pode complementar a base no futuro, para alimentos que a TACO não cobre. Quando
              isso acontecer, a origem aparecerá em cada alimento, como aparece hoje.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
