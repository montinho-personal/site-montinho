import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraGLP1 from "@/components/glp1/CalculadoraGLP1";
import {
  CENARIOS,
  FONTES_GLP1,
  FONTE_ABE,
  FONTE_HEYMSFIELD,
  FONTE_STEP1,
  FONTE_SURMOUNT1,
  NOTA_ESTIMATIVA,
  NOTA_MEDICA,
  NOTA_NAO_E_TUDO_MUSCULO,
  NOTA_PROTEINA_APETITE,
  PROTEINA_ALVO,
  PROTEINA_MINIMA,
  calcula,
  formataFaixaKg,
  formataKg,
} from "@/lib/glp1";

/**
 * A página da Calculadora de Massa Magra no GLP-1.
 *
 * O site tem 36 artigos sobre Mounjaro, Ozempic, tirzepatida e
 * retatrutida e não tinha ferramenta nenhuma para eles — lib/glp1.ts
 * explica o tamanho do cluster e de onde vêm as faixas.
 *
 * O cuidado que esta página tem e as outras não precisam ter: ela não
 * fala de dose, de marca, nem de começar ou parar medicação. Isso é do
 * prescritor. O que ela trata é composição corporal, treino de força e
 * proteína — o que cabe a um personal trainer.
 */

const CAMINHO = "/ferramentas/massa-magra-glp1";

export const metadata: Metadata = {
  title: "Massa Magra no GLP-1: Quanto do Peso Perdido é Músculo",
  description:
    "Estime quanto do seu emagrecimento com Mounjaro, Ozempic ou retatrutida pode ser massa magra — e quanto essa faixa encolhe com treino de força e proteína.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Massa Magra no GLP-1 | Montinho Personal Trainer",
    description:
      "Quanto do peso perdido com GLP-1 pode ser massa magra, pelos dados dos ensaios clínicos — e o que muda com treino de força e proteína.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Massa Magra no GLP-1",
  descricao:
    "Estima a faixa de massa magra perdida durante o emagrecimento com agonistas de GLP-1, a partir do peso inicial, do peso atual, da frequência de treino de força e da ingestão de proteína, e compara com o cenário em que treino e proteína estão no lugar.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Massa Magra no GLP-1", item: `${SITE_URL}${CAMINHO}` },
  ],
};

/* O exemplo resolvido: 100 kg que viraram 90, sem proteção nenhuma. */
const EX = calcula(100, 90, "nenhum", 70);
const EX_PROTEGIDO = calcula(100, 90, "regular", 144);
const pct = (n: number) => `${Math.round(n * 100)}%`;

const faq: ItemFAQ[] = [
  {
    question: "O Mounjaro faz perder músculo?",
    answer:
      "Todo emagrecimento reduz massa magra, com ou sem medicação — a diferença é quanto. Nos ensaios em que ninguém orientou treino nem dieta, a massa magra ficou entre 25% e 40% do peso perdido. Com treino de força regular e proteína adequada, a literatura de preservação descreve faixas de 5% a 15%. A medicação não tem um efeito próprio de destruir músculo: ela produz um déficit grande e rápido, e é o déficit sem proteção que cobra.",
  },
  {
    question: "Massa magra perdida é a mesma coisa que músculo perdido?",
    answer: NOTA_NAO_E_TUDO_MUSCULO,
  },
  {
    question: "Quanto de proteína eu preciso comer?",
    answer: `Pelo menos ${PROTEINA_MINIMA.toLocaleString("pt-BR")} g por quilo de peso corporal, com ${PROTEINA_ALVO.toLocaleString("pt-BR")} g como alvo para quem está em déficit e quer proteger músculo. Para 90 kg, isso são cerca de ${Math.round(90 * PROTEINA_ALVO)} g por dia. ${NOTA_PROTEINA_APETITE}`,
  },
  {
    question: "Cardio ou musculação para quem usa GLP-1?",
    answer:
      "Musculação, sem empate. O cardio melhora saúde cardiovascular e soma gasto, mas não é ele que dá ao corpo o motivo de manter músculo num déficit grande — isso é trabalho de força, com carga que sobe. Se só der para fazer um dos dois durante o tratamento, o que protege é a musculação.",
  },
  {
    question: "Preciso fazer DXA para saber quanto perdi de músculo?",
    answer:
      "É o único jeito de saber de verdade, e vale fazer duas medições no mesmo aparelho — antes e depois. Esta calculadora aplica faixas de população ao seu número; ela dá ordem de grandeza e mostra o efeito de proteger, não o que aconteceu com o seu corpo.",
  },
  {
    question: "Essa calculadora diz se eu devo parar o medicamento?",
    answer: NOTA_MEDICA,
  },
  {
    question: "Já perdi peso sem treinar. Ainda vale começar?",
    answer:
      "Vale, e por dois motivos. O primeiro é que a proteção passa a valer do ponto em que você começa — o que ainda vai ser perdido custa menos massa magra. O segundo é que músculo se recupera com treino e proteína, mesmo depois; não é uma porta que fechou.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const th = "text-left text-gray-400 font-medium py-2.5 pr-4";

export default function MassaMagraGLP1Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Massa Magra no GLP-1
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Massa Magra no GLP-1" caminho={CAMINHO} local="tool_top" ferramenta="glp1" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quem emagrece com Mounjaro, Ozempic, tirzepatida ou retatrutida faz sempre a mesma pergunta: quanto
            disso é músculo? Aqui está a faixa que os ensaios clínicos mostram — e quanto ela encolhe com treino
            de força e proteína.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraGLP1 placement="massa-magra-glp1" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Massa magra não é a mesma coisa que músculo
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Esta é a parte que quase nenhum texto sobre o assunto diz, e ela muda como se lê qualquer número
              daqui. <strong className="text-white">Massa magra</strong>, no exame, é tudo o que não é gordura:
              músculo, sim, mas também água, glicogênio, órgãos — e o tecido de suporte da própria gordura, que
              some junto com ela. {FONTE_ABE.rotuloCurto} mostrou justamente isso: perder gordura reduz massa
              magra automaticamente, sem que um grama de músculo tenha sido perdido.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Por isso ninguém emagrece só de gordura, nem com medicação nem sem ela. A regra clássica, de muito
              antes dos GLP-1, é de que cerca de um quarto do peso perdido em dieta comum é massa magra
              ({FONTE_HEYMSFIELD.rotuloCurto}). O que dá para mudar não é se vai haver perda de massa magra — é o
              tamanho dela, e quanto dela é músculo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que os ensaios mediram
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Dois ensaios grandes fizeram DXA numa subamostra e publicaram a composição do peso perdido —
              importante: em pessoas que <em>não</em> receberam orientação de treino de força nem de dieta rica em
              proteína.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Proporção de massa magra no peso perdido nos ensaios de GLP-1</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Ensaio</th>
                    <th scope="col" className={th}>Medicamento</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Massa magra no peso perdido</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { fonte: FONTE_SURMOUNT1, medicamento: "tirzepatida", fracao: "≈ 25%" },
                    { fonte: FONTE_STEP1, medicamento: "semaglutida", fracao: "≈ 40%" },
                  ].map((l) => (
                    <tr key={l.fonte.rotuloCurto} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{l.fonte.rotuloCurto.split(" (")[0]}</td>
                      <td className="text-gray-400 py-2.5 pr-4">{l.medicamento}</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">{l.fracao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              Os 25% do SURMOUNT-1 são praticamente a mesma proporção de quem emagrece sem medicação nenhuma — o
              que é o argumento mais forte contra a ideia de que o GLP-1 tem um efeito próprio de comer músculo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que muda com treino de força e proteína
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Esta é a parte acionável. As faixas abaixo são as que a calculadora usa, aplicadas a uma perda de
              10 kg para ficar concreto:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Faixa de massa magra perdida por cenário de proteção</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Cenário</th>
                    <th scope="col" className={th}>Massa magra</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Numa perda de 10 kg</th>
                  </tr>
                </thead>
                <tbody>
                  {CENARIOS.map((c) => (
                    <tr key={c.protecao} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">
                        {c.nome}
                        <span className="block text-gray-500 text-xs mt-0.5">{c.comoEstar}</span>
                      </td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums align-top">{pct(c.faixa.min)} a {pct(c.faixa.max)}</td>
                      <td className="text-white py-2.5 font-medium tabular-nums align-top">{formataFaixaKg(c.em10kg)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Em números: quem perde 10 kg sem treino de força e sem proteína suficiente tende a perder{" "}
              {formataFaixaKg(EX.massaMagra)} de massa magra; com as duas proteções no lugar, a mesma perda custaria{" "}
              {formataFaixaKg(EX_PROTEGIDO.massaMagra)}. A diferença — algo perto de{" "}
              <strong className="text-white">{formataKg(EX.massaMagra.max - EX_PROTEGIDO.massaMagra.max)}</strong> no
              pior caso — é o que está em jogo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              As duas coisas que protegem, em ordem
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">1. Treino de força, três vezes por semana, com carga que sobe.</strong>{" "}
              É a intervenção com melhor evidência, e o detalhe que a maioria erra é o &ldquo;carga que
              sobe&rdquo;: repetir o mesmo peso enquanto o corpo encolhe é o que o corpo entende como permissão
              para dispensar músculo. Cardio não substitui — ele soma saúde e gasto, não sinal de manutenção.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">2. Proteína: pelo menos {PROTEINA_MINIMA.toLocaleString("pt-BR")} g por quilo, com {PROTEINA_ALVO.toLocaleString("pt-BR")} g como alvo.</strong>{" "}
              Para 90 kg, cerca de {Math.round(90 * PROTEINA_ALVO)} g por dia, distribuídos pelas refeições.{" "}
              <Link href="/ferramentas/calculadora-de-proteina" className={ln}>A Calculadora de Proteína</Link>{" "}
              faz essa conta com o seu peso.
            </p>
            <p className="text-gray-300 leading-relaxed">
              {NOTA_PROTEINA_APETITE} É o obstáculo real do tratamento: a medicação funciona tirando a fome, e a
              proteína é justamente o que exige comer com intenção quando a fome não está lá para ajudar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que esta calculadora não faz
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">{NOTA_MEDICA}</p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Ela também não pergunta qual medicamento você usa, e isso é de propósito: as faixas dos ensaios se
              sobrepõem, e escolher uma faixa pela marca daria uma precisão que os dados não sustentam.
            </p>
            <p className="text-gray-300 leading-relaxed">{NOTA_ESTIMATIVA}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-glp1" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_GLP1.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              Revisado em 22 de setembro de 2026 por{" "}
              <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Conteúdo
              educativo sobre treino e composição corporal; não substitui a orientação de quem prescreve o seu
              tratamento.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/mounjaro-faz-perder-musculos" className={ln}>Mounjaro faz perder músculos?</Link></li>
              <li><Link href="/blog/retatrutida-faz-perder-musculos" className={ln}>Retatrutida faz perder músculos?</Link></li>
              <li><Link href="/blog/cardio-ou-musculacao-mounjaro" className={ln}>Cardio ou musculação para quem usa Mounjaro</Link></li>
              <li><Link href="/blog/glp1-apetite-suprimido-proteina-musculo" className={ln}>Apetite suprimido: como comer proteína suficiente</Link></li>
              <li><Link href="/ferramentas/calculadora-de-proteina" className={ln}>Calculadora de Proteína — a meta com o seu peso</Link></li>
              <li><Link href="/ferramentas/calculadora-volume-treino" className={ln}>Calculadora de Volume de Treino</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
