import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraMeta from "@/components/meta/CalculadoraMeta";
import {
  KCAL_POR_KG_GORDURA,
  NOTA_ESTIMATIVA,
  NOTA_FAIXA_PERCENTUAL,
  NOTA_MUSCULO,
  NOTA_PRIMEIRAS_SEMANAS,
  TAXA_MAX,
  TAXA_MIN,
  calcula,
  formataFaixaKg,
  formataKg,
  formataSemanas,
  tabelaPorPeso,
  tabelaPorPrazo,
} from "@/lib/meta";

/**
 * A página da Calculadora de Meta de Peso por Data.
 *
 * lib/meta.ts explica por que a pergunta é ao contrário da habitual e por
 * que ela não canibaliza a Calculadora de Déficit. Aqui vale registrar só
 * o que a página faz de diferente das outras: ela publica a tabela por
 * prazo E por peso, porque a busca chega com as duas variáveis abertas —
 * "quantos quilos até o fim do ano" não diz quanto a pessoa pesa nem
 * quantas semanas faltam.
 */

const CAMINHO = "/ferramentas/meta-de-peso";

export const metadata: Metadata = {
  title: "Calculadora de Meta de Peso: Quanto Dá até a Data",
  description:
    "Informe seu peso e a data para ver quantos quilos dá para perder no prazo sem sacrificar músculo — e se o número que você tem em mente cabe.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Meta de Peso | Montinho Personal Trainer",
    description:
      "Quantos quilos dá para perder até a sua data, na faixa que não custa músculo — e se a sua meta cabe no prazo.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Meta de Peso",
  descricao:
    "Projeta quantos quilos é possível perder até uma data a partir do peso atual, usando a faixa de 0,5% a 1% do peso corporal por semana, e avalia se uma meta informada cabe no prazo.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Meta de Peso", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const PESO_EX = 90;
const SEM_EX = 12;
const EX = calcula(PESO_EX, SEM_EX);
const TAB_PRAZO = tabelaPorPrazo(PESO_EX);
const TAB_PESO = tabelaPorPeso(SEM_EX);
const pctTaxa = (t: number) => `${(t * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

const faq: ItemFAQ[] = [
  {
    question: "Quantos quilos dá para perder até o fim do ano?",
    answer: `Depende de quantas semanas faltam e de quanto você pesa. Em ${SEM_EX} semanas, alguém de ${PESO_EX} kg tem como perder ${formataFaixaKg(EX.perda)} sem sair da faixa que preserva músculo — ${EX.perdaPct.min.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% a ${EX.perdaPct.max.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% do peso. A calculadora faz a conta com a sua data e o seu peso.`,
  },
  {
    question: "Quantos quilos por semana é seguro perder?",
    answer: `De ${pctTaxa(TAXA_MIN)} a ${pctTaxa(TAXA_MAX)} do peso corporal por semana. Para ${PESO_EX} kg isso dá cerca de ${EX.porSemana.min.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} a ${EX.porSemana.max.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg. ${NOTA_FAIXA_PERCENTUAL}`,
  },
  {
    question: "Dá para perder 10 kg em um mês?",
    answer:
      "Não de gordura, e não sem cobrança. Um mês tem cerca de quatro semanas, e a faixa segura de quatro semanas fica bem abaixo disso para quase qualquer peso. Quando a balança mostra números assim, a maior parte é água e massa magra — e é exatamente o tipo de perda que volta.",
  },
  {
    question: "Por que a primeira semana some tanto peso?",
    answer: NOTA_PRIMEIRAS_SEMANAS,
  },
  {
    question: "Qual o déficit diário para isso?",
    answer: `Para ${PESO_EX} kg em ${SEM_EX} semanas, de ${Math.round(EX.deficitDiario.min)} a ${Math.round(EX.deficitDiario.max)} kcal por dia. A conta sai das ${KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal por quilo de gordura, divididas pelos dias do prazo — é ordem de grandeza, não precisão.`,
  },
  {
    question: "E se a minha meta não couber no prazo?",
    answer:
      "A calculadora diz em quantas semanas ela caberia. Saber isso em setembro vale mais do que descobrir em dezembro: ou a data muda, ou a meta muda — e a meta que cabe costuma ser a que ainda está de pé em março.",
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

export default function MetaDePesoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Meta de Peso
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Meta de Peso" caminho={CAMINHO} local="tool_top" ferramenta="meta" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quando a data não se move — o fim do ano, o casamento, a viagem —, a pergunta deixa de ser
            &ldquo;quando eu chego&rdquo; e vira &ldquo;quanto cabe até lá&rdquo;. Esta calculadora responde a
            segunda.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraMeta placement="meta-de-peso" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantos quilos dá para perder por prazo</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Para uma pessoa de {PESO_EX} kg, na faixa que preserva músculo:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Perda possível por prazo, para 90 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Prazo</th>
                    <th scope="col" className={th}>Dá para perder</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Peso na data</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_PRAZO.map((l) => {
                    const r = calcula(PESO_EX, l.semanas);
                    return (
                      <tr key={l.semanas} className="border-b border-white/10">
                        <td className="text-gray-300 py-2.5 pr-4">{formataSemanas(l.semanas)}</td>
                        <td className="text-white py-2.5 pr-4 font-medium tabular-nums">{formataFaixaKg(l.perda)}</td>
                        <td className="text-gray-400 py-2.5 tabular-nums">
                          {formataKg(r.pesoFinal.min).replace(" kg", "")} a {formataKg(r.pesoFinal.max)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              De {pctTaxa(TAXA_MIN)} a {pctTaxa(TAXA_MAX)} do peso por semana, aplicado semana a semana.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>E por peso, no mesmo prazo</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Em {formataSemanas(SEM_EX)} — perto do que sobra entre outubro e o réveillon:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Perda possível em 12 semanas, por peso corporal</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso hoje</th>
                    <th scope="col" className={th}>Dá para perder</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Por semana</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_PESO.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">{formataFaixaKg(l.perda)}</td>
                      <td className="text-gray-400 py-2.5 tabular-nums">
                        {(l.perda.min / SEM_EX).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} a{" "}
                        {(l.perda.max / SEM_EX).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">{NOTA_FAIXA_PERCENTUAL}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Por que não acelerar</h2>
            <p className="text-gray-300 leading-relaxed mb-4">{NOTA_MUSCULO}</p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Há também a parte que ninguém conta: o plano agressivo costuma durar três semanas. O que decide o
              resultado de dezembro não é o ritmo que você escolhe em outubro — é quantas das semanas você
              cumpre. Um plano de {pctTaxa(TAXA_MIN)} por semana cumprido inteiro entrega mais que um de{" "}
              {pctTaxa(TAXA_MAX * 2)} abandonado no meio.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Se a sua meta não couber no prazo, a calculadora diz em quantas semanas ela caberia. Saber isso
              agora vale mais que descobrir em dezembro.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>A balança não desce em linha reta</h2>
            <p className="text-gray-300 leading-relaxed mb-4">{NOTA_PRIMEIRAS_SEMANAS}</p>
            <p className="text-gray-300 leading-relaxed">
              É por isso que a projeção vem como faixa e não como número. {NOTA_ESTIMATIVA} O que ela dá é uma
              referência para planejar — e para reconhecer, no meio do caminho, se o ritmo está dentro do que o
              corpo sustenta.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              A faixa é de <strong className="text-white">{pctTaxa(TAXA_MIN)} a {pctTaxa(TAXA_MAX)} do peso corporal por semana</strong>,
              aplicada semana a semana — e não multiplicada pelo peso inicial. A diferença não é acadêmica: como
              o peso cai ao longo do caminho, somar sempre o mesmo percentual do começo superestimaria o total.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              O déficit diário sai da conta clássica de {KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal por
              quilo de gordura, dividida pelos dias do prazo. Serve para ordem de grandeza: o corpo não responde
              de forma exatamente linear, e o gasto diário cai conforme o peso desce — o que torna a ponta alta
              da faixa mais difícil no fim do que no começo.{" "}
              <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>
                A Calculadora de Déficit Calórico
              </Link>{" "}
              faz o passo seguinte: quanto cortar por dia, com o seu gasto.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 22 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>,
              personal trainer em Alphaville. Projeção de planejamento, não orientação médica ou nutricional
              individual.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-meta" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/quantos-quilos-perder-ate-fim-do-ano" className={ln}>Quantos quilos dá para perder até o fim do ano</Link></li>
              <li><Link href="/blog/quanto-tempo-para-emagrecer" className={ln}>Quanto tempo leva para emagrecer</Link></li>
              <li><Link href="/blog/deficit-calorico-como-calcular" className={ln}>Como calcular o déficit calórico</Link></li>
              <li><Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>Calculadora de Déficit Calórico</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
