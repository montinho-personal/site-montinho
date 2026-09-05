import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { ALIMENTOS_CARDAPIO } from "@/lib/cardapio/alimentos";
import { PERFIS_REFEICAO, TOLERANCIA_KCAL } from "@/lib/cardapio/motor";
import MonteSeuCardapio from "@/components/cardapio/MonteSeuCardapio";
import Trilha from "@/components/ferramentas/Trilha";
import FAQ from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";

/**
 * Montinho FitChef (Monte seu Cardápio) — página própria. O nome é FitChef;
 * a frase "monte seu cardápio com o Montinho" fica como tagline, e a URL não
 * muda com o batismo — trocar slug por nome de marca custaria a indexação já
 * conquistada.
 *
 * Landing editorial + ferramenta, atendendo a intenção "como montar um
 * cardápio" nas duas formas: quem quer fazer, faz; quem quer entender, lê.
 * O conteúdo em volta é HTML estático — o crawler não responde wizard.
 *
 * Resultados personalizados NUNCA viram URL: tudo acontece em estado de
 * cliente, então não existem milhares de páginas finas para indexar nem
 * decisão de noindex a tomar — o problema foi eliminado por arquitetura.
 *
 * FAQ é editorial, sem FAQPage schema: a página não é primariamente de
 * perguntas, e schema para caçar rich result é exatamente o que este site
 * não faz.
 */
export const metadata: Metadata = {
  title: "Montinho FitChef: Monte seu Cardápio, Calorias e Porções",
  description:
    "Informe sua meta, sua rotina e os alimentos que você gosta. A ferramenta monta uma sugestão de cardápio com calorias, proteínas, porções caseiras e substituições. Gratuito, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/ferramentas/monte-seu-cardapio` },
  openGraph: {
    title: "Montinho FitChef — monte seu cardápio com o Montinho",
    description:
      "Sua meta de calorias vira comida de verdade: cardápio com porções caseiras, substituições, plano semanal e lista de compras. Gratuito, sem cadastro.",
    url: `${SITE_URL}/ferramentas/monte-seu-cardapio`,
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
    { "@type": "ListItem", position: 3, name: "Montinho FitChef", item: `${SITE_URL}/ferramentas/monte-seu-cardapio` },
  ],
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

const FAQ_EDITORIAL: { pergunta: string; resposta: string }[] = [
  {
    pergunta: "O cardápio é uma dieta?",
    resposta:
      "Não. É uma sugestão educacional de organização alimentar a partir da sua meta — um exemplo de como distribuir calorias e proteína em comida de verdade. Dieta prescrita, individual, é trabalho de nutricionista.",
  },
  {
    pergunta: "Posso trocar os alimentos?",
    resposta:
      "Pode, e deve: cada item tem um botão de trocar que mostra alternativas do mesmo grupo, com a porção já recalculada pelas calorias. O melhor cardápio é o que usa comida que você gosta.",
  },
  {
    pergunta: "Preciso pesar a comida?",
    resposta:
      "Não. As porções são caseiras — 1 ovo, 1 concha, 1 escumadeira — com o peso aproximado entre parênteses para quem quiser conferir. A ferramenta foi montada para funcionar sem balança.",
  },
  {
    pergunta: "As calorias são exatas?",
    resposta:
      "São estimativas, e a ferramenta diz isso. Gasto energético varia, marcas variam, preparo muda a composição. O total do dia aceita uma diferença de até 8% da meta de propósito — precisão de centavo em nutrição é ilusão.",
  },
  {
    pergunta: "Existe opção vegetariana e vegana?",
    resposta:
      "Sim. A ferramenta pergunta como é sua alimentação e monta o cardápio só com alimentos compatíveis, trocando as fontes de proteína pela lógica certa — não apenas removendo o frango e deixando o resto igual.",
  },
  {
    pergunta: "Serve para ganhar massa muscular?",
    resposta:
      "Serve: escolha o objetivo de ganho e informe a meta calórica de superávit. A proteína passa a usar a referência de 2,0 g/kg, a mesma das outras calculadoras do site.",
  },
];

export default function MonteSeuCardapioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-14 bg-black border-b border-white/10 print:hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuito · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2" style={h}>
            Montinho FitChef
          </h1>
          <Compartilhar
            contexto="tool"
            titulo="Monte Seu Cardápio"
            caminho="/ferramentas/monte-seu-cardapio"
            local="tool_top"
            ferramenta="monte_cardapio"
            aparencia="discreto"
            className="mb-5"
          />
          <p className="text-base sm:text-lg font-medium mb-5" style={{ color: "#BA9E50" }}>
            Monte seu cardápio com o Montinho
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            Informe sua meta, sua rotina e os alimentos que você gosta. A
            ferramenta monta uma sugestão alimentar com calorias, proteínas,
            porções caseiras e substituições — e transforma o número da sua
            calculadora em comida de verdade.
          </p>
        </div>
      </section>

      <Trilha atual="/ferramentas/monte-seu-cardapio" />

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MonteSeuCardapio placement="pagina-ferramenta" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10 print:hidden" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como montar um cardápio a partir das calorias
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Saber que a meta é 2.100 kcal não resolve o jantar de hoje. O caminho entre o número e o prato tem
              três passos: <strong className="text-white">distribuir as calorias pelas refeições</strong> (almoço e
              jantar carregam mais no hábito brasileiro), <strong className="text-white">garantir a proteína</strong>{" "}
              em cada uma delas, e <strong className="text-white">traduzir o restante em porções</strong> dos
              alimentos que você já come. É exatamente essa a conta que a ferramenta faz — com a mesma cascata de
              macros da{" "}
              <Link href="/ferramentas/calculadora-macros" className={ln}>
                Calculadora de Macros
              </Link>{" "}
              e a mesma referência de proteína da{" "}
              <Link href="/ferramentas/calculadora-de-proteina" className={ln}>
                Calculadora de Proteína
              </Link>
              .
            </p>
            <p className="text-gray-300 leading-relaxed">
              Se você ainda não sabe sua meta, comece pela{" "}
              <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>
                Calculadora de Déficit Calórico
              </Link>{" "}
              — ela estima seu gasto e traz o resultado direto para cá.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Por que o cardápio usa o que você já come
            </h2>
            <p className="text-gray-300 leading-relaxed">
              A maioria dos geradores entrega um cardápio de revista: quinoa, salmão, abacate — e a pessoa abandona
              na primeira semana, porque a comida da casa dela é arroz, feijão, frango e ovo. Esta ferramenta faz o
              contrário: pergunta o que você costuma comer em cada refeição e monta a sugestão priorizando esses
              alimentos. A base tem {ALIMENTOS_CARDAPIO.length} alimentos comuns no Brasil, com estado declarado
              (cru, cozido, grelhado) e porção caseira definida. O melhor cardápio não é o mais sofisticado — é o
              que você consegue seguir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quantas refeições fazer por dia?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              As que couberem na sua rotina. Comer mais vezes não acelera o metabolismo nem o emagrecimento — o que
              define o resultado é o total do dia. A ferramenta oferece de {Object.keys(PERFIS_REFEICAO)[0]} a{" "}
              {Object.keys(PERFIS_REFEICAO).at(-1)} refeições e distribui a meta de forma realista entre elas, com
              almoço e jantar maiores e lanches menores. Quem não sabe escolhe "me sugere" e recebe o arranjo mais
              comum.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como substituir alimentos sem quebrar a meta
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Trocar 150 g de arroz por 150 g de batata muda a refeição em mais de 100 kcal — equivalência por peso
              é a armadilha clássica das trocas. Aqui a substituição acontece dentro do mesmo grupo (carboidrato por
              carboidrato, proteína por proteína) e a porção do substituto é{" "}
              <strong className="text-white">recalculada pelas calorias</strong> do item que sai, sempre em porção
              caseira. Quando não existe troca boa o suficiente, a ferramenta diz isso em vez de inventar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como fazemos os cálculos
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Nada aqui é gerado por inteligência artificial em tempo real: o motor é determinístico — as mesmas
              respostas produzem sempre o mesmo cardápio — e cada regra pode ser auditada. A composição dos
              alimentos vem da <strong className="text-white">TACO 4ª ed. (NEPA/Unicamp)</strong>, a base brasileira
              pública, com o estado do alimento declarado em cada item; industrializados usam valor típico de rótulo
              com a ressalva explícita. A distribuição de macros reusa a cascata documentada na Calculadora de
              Macros, e a proteína segue as mesmas referências por peso corporal das demais ferramentas do site.
            </p>
            <p className="text-gray-300 leading-relaxed">
              O total do dia aceita uma diferença de até {Math.round(TOLERANCIA_KCAL * 100)}% da meta. É escolha, não
              limitação: porções caseiras têm passos grandes, e perseguir a meta no centavo produziria cardápios de
              "83 g de arroz" que ninguém mede. Última revisão dos dados: agosto de 2026.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Perguntas frequentes
            </h2>
            <FAQ itens={FAQ_EDITORIAL.map((f) => ({ question: f.pergunta, answer: f.resposta }))} placement="monte-seu-cardapio" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Para ir mais fundo
            </h2>
            <p className="text-gray-300 leading-relaxed">
              O conceito por trás da meta está em{" "}
              <Link href="/blog/deficit-calorico-como-calcular" className={ln}>
                déficit calórico: o que é e como calcular
              </Link>
              . Para a lógica de comer o que gosta dentro da meta,{" "}
              <Link href="/blog/dieta-flexivel-iifym" className={ln}>
                dieta flexível (IIFYM)
              </Link>{" "}
              é o guia completo. E se quiser exemplos prontos escritos à mão, os cardápios semanais de{" "}
              <Link href="/blog/cardapio-semanal-emagrecer-com-musculo" className={ln}>
                emagrecimento
              </Link>{" "}
              e de{" "}
              <Link href="/blog/cardapio-semanal-ganho-de-massa-muscular" className={ln}>
                ganho de massa
              </Link>{" "}
              complementam a ferramenta.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
