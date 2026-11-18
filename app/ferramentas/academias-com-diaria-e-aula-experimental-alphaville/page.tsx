import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import DiariaExperimental from "@/components/diaria/DiariaExperimental";
import { CONFERENCIA, NAO_CONFIRMADAS, OFERTAS, brl, dataTxt, filtrar, precoTxt } from "@/lib/diaria-experimental";

/**
 * Academias com diária e aula experimental em Alphaville e região.
 *
 * Pesquisa (SerpApi, 18/11/2026, celular, Barueri): docs/seo/serp/
 * academias-diaria-aula-experimental-alphaville-2026-11-18.json. O que cada
 * intenção mudou está em docs/seo/teste-intencoes-de-busca.md.
 *
 * Todo dado sai de lib/diaria-experimental.ts, com fonte oficial e data. O
 * Guia Fitness Alphaville (outro site do Montinho) tem uma ferramenta sobre
 * o mesmo assunto; a decisão de ter as duas é dele (18/11/2026). O texto
 * daqui é próprio.
 */

const CAMINHO = "/ferramentas/academias-com-diaria-e-aula-experimental-alphaville";
const NOME = "Academias com Diária e Aula Experimental em Alphaville";

export const metadata: Metadata = {
  title: "Academia com Diária e Aula Experimental em Alphaville",
  description:
    "Quer treinar hoje ou testar antes de assinar? Veja as academias de Alphaville e região com diária, aula avulsa e aula experimental, com preço, regra e fonte.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: `${NOME} | Montinho Personal Trainer`,
    description: "Diária, aula avulsa e aula experimental nas academias de Alphaville e região: o que inclui, quanto custa, se precisa agendar e de onde veio cada dado.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: NOME,
  descricao:
    "Lista filtrável das academias de Alphaville, Tamboré, Barueri e Santana de Parnaíba com diária, aula avulsa, aula experimental ou visita guiada, com preço quando publicado, forma de contratar, necessidade de agendamento, fonte oficial e data da conferência.",
  caminho: CAMINHO,
  categoria: "UtilitiesApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: NOME, item: `${SITE_URL}${CAMINHO}` },
  ],
};

const of = (id: string) => OFERTAS.find((o) => o.id === id)!;
const NITRO = of("nitrogym-diaria");
const IRON = of("ironberg-avulsa");
const DROPIN = of("blacksheep-dropin");
const DIARIAS = filtrar({ modo: "diaria", soMusculacao: false, soComPreco: false });
const TESTES = filtrar({ modo: "experimental", soMusculacao: false, soComPreco: false });
const GRATIS = TESTES.filter((o) => o.preco === 0 && !o.daCasa).map((o) => o.academia);
const VISITAS = TESTES.filter((o) => !o.treino).map((o) => o.academia);
const ULTIMA = OFERTAS.map((o) => o.conferidaEm).sort().at(-1)!;

const faq: ItemFAQ[] = [
  {
    question: "Tem academia com diária em Alphaville?",
    answer: `Tem. Com fonte oficial, a ${NITRO.academia} cobra ${brl(NITRO.preco!)} pelo day use de musculação, pago no local, e a ${IRON.academia} vende aula avulsa na recepção, no dia do treino, com valor informado só na unidade. Para cross training, a ${DROPIN.academia} tem aula avulsa (drop in).`,
  },
  {
    question: "Como funciona a diária na academia?",
    answer: "Você paga por um dia de acesso, sem matrícula e sem plano. Cada academia chama de um jeito (diária, day use, aula avulsa, drop in) e define onde pagar, o que está incluído e em que horário a entrada vale. Em geral não precisa agendar, mas vale confirmar antes de ir.",
  },
  {
    question: "Quanto custa uma aula avulsa na academia?",
    answer: `Depende da academia, e muitas não publicam o valor. Entre as conferidas em Alphaville e região, a ${NITRO.academia} publica ${brl(NITRO.preco!)} pelo day use. A ${IRON.academia} informa o valor só na recepção, e a rede da ${DROPIN.academia} lista R$ 75 pelo drop in na tabela geral, com o valor da unidade a confirmar.`,
  },
  {
    question: "Como funciona a aula experimental na academia?",
    answer: "Depende do lugar. Em box de CrossFit e em academia de luta costuma ser uma aula de verdade, às vezes separada da turma, para aprender o básico. Em academia de alto padrão, muitas vezes é uma visita guiada, sem treino. Pergunte se dá para treinar, quanto tempo dura, quem acompanha e se precisa agendar.",
  },
  {
    question: "Aula experimental em academia é paga?",
    answer: `Algumas são grátis e outras não publicam o valor. Em Alphaville e região, ${GRATIS.join(" e ")} publicam aula experimental grátis. Na Arena 18, a aula experimental de musculação com o Montinho também é gratuita. As demais informam o valor só no contato.`,
  },
  {
    question: "Tem day use na Smart Fit de Alphaville?",
    answer: "Não foi possível confirmar. A central de ajuda da rede fala em passe diário, mas a regra, o preço e as unidades em que vale não foram confirmados em fonte oficial, então a Smart Fit não entra na lista. Confirme no aplicativo da rede ou na recepção da unidade.",
  },
  {
    question: "Onde fazer aula experimental de musculação em Alphaville?",
    answer: `Até a conferência, nenhuma academia da lista publica aula experimental de musculação própria. As opções confirmadas são a aula experimental gratuita com o Montinho na Arena 18, que é o atendimento do dono deste site, e as diárias da ${NITRO.academia} e da ${IRON.academia}, que servem para testar a sala de musculação.`,
  },
  {
    question: "Diária ou mensalidade: o que compensa?",
    answer: `Multiplique a diária pelas idas do mês e compare com o plano mensal da mesma academia. Na ${NITRO.academia}, 4 idas dão ${brl(NITRO.preco! * 4)} e 8 idas dão ${brl(NITRO.preco! * 8)}. A diária compensa para quem está de passagem ou quer testar; para quem vai treinar toda semana, o plano quase sempre sai mais em conta.`,
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
const td = "text-gray-300 py-2.5 pr-4";
const tdF = "text-white py-2.5 pr-4 font-medium";

export default function DiariaExperimentalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · dados com fonte e data</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>
            Academias com diária e aula experimental em Alphaville
          </h1>
          <Compartilhar contexto="tool" titulo={NOME} caminho={CAMINHO} local="tool_top" ferramenta="diaria-experimental" aparencia="discreto" className="mb-4" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Para quem quer treinar hoje sem fazer plano, ou experimentar antes de assinar. Veja o que cada academia oferece, quanto custa, se precisa agendar e de onde veio cada informação.
          </p>
        </div>
      </section>

      <section className="py-8 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <DiariaExperimental />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Tem academia com diária em Alphaville?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">
                Tem. Para musculação, a {NITRO.academia} cobra {brl(NITRO.preco!)} pelo day use, pago no local, e a {IRON.academia} vende aula avulsa na recepção, com o valor informado só na unidade.
              </strong>
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Para cross training, a {DROPIN.academia} tem aula avulsa (drop in). São as {DIARIAS.length} ofertas de entrada por dia confirmadas em fonte oficial até {dataTxt(ULTIMA)}.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Academias com diária ou aula avulsa em Alphaville e região</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Academia</th>
                    <th scope="col" className={th}>O que é</th>
                    <th scope="col" className={th}>Preço</th>
                    <th scope="col" className={th}>Precisa agendar?</th>
                  </tr>
                </thead>
                <tbody>
                  {DIARIAS.map((o) => (
                    <tr key={o.id} className="border-b border-white/10">
                      <td className={tdF}>{o.academia}</td>
                      <td className={td}>{o.rotulo}: {o.modalidade.toLowerCase()}</td>
                      <td className={td}>{precoTxt(o)}</td>
                      <td className={td}>{o.precisaAgendar === null ? "Consulte" : o.precisaAgendar ? "Sim" : "Não"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como funciona a diária na academia</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">Você paga por um dia de acesso, sem matrícula e sem plano.</strong> O nome muda de um lugar para outro: diária, day use, aula avulsa ou drop in. O que muda de verdade é onde se paga, o que está incluído e em que horário a entrada vale.
            </p>
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5">
              <li>Na {NITRO.academia}, o day use é pago direto no local e dá acesso a todas as áreas, com estacionamento incluso por até 3 horas.</li>
              <li>Na {IRON.academia}, a aula avulsa é contratada no dia do treino, na recepção, sem agendamento.</li>
              <li>Leve documento e confirme se a entrada avulsa vale no horário em que você pretende chegar: o site das academias nem sempre diz.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Aula experimental: como funciona e quem oferece</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">"Aula experimental" quer dizer coisas diferentes, e nem sempre é treino.</strong> Em box de CrossFit e em academia de luta costuma ser uma aula de verdade. Em {VISITAS.join(" e ")}, o que o site oferece é uma visita agendada para conhecer o espaço.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Aula experimental, treino experimental e visita guiada em Alphaville e região</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Onde</th>
                    <th scope="col" className={th}>O que é</th>
                    <th scope="col" className={th}>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {TESTES.map((o) => (
                    <tr key={o.id} className="border-b border-white/10">
                      <td className={tdF}>{o.academia}{o.daCasa ? " (com o Montinho)" : ""}</td>
                      <td className={td}>{o.rotulo}: {o.modalidade.toLowerCase()}</td>
                      <td className={td}>{precoTxt(o)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed mt-4">
              Antes de marcar, pergunte quatro coisas: dá para treinar musculação, quanto tempo dura, quem acompanha e se há custo. E faça o teste no horário em que você pretende treinar, porque a academia das 7h não é a mesma das 19h.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Aula experimental de musculação em Alphaville</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Até a conferência, nenhuma academia da lista publica aula experimental de musculação própria.</strong> Há dois caminhos confirmados. O primeiro é a aula experimental gratuita comigo na Arena 18, agendada pelo WhatsApp: é o meu atendimento, e por isso aparece marcada na lista. O segundo é pagar uma diária na {NITRO.academia} ou na {IRON.academia} para conhecer a sala de musculação por conta própria.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Diária ou mensalidade: o que compensa</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Multiplique a diária pelas idas do mês e compare com o plano mensal da mesma academia.</strong> Na {NITRO.academia}, 4 idas dão {brl(NITRO.preco! * 4)}, 8 idas dão {brl(NITRO.preco! * 8)} e 12 idas dão {brl(NITRO.preco! * 12)}. A diária serve para quem está de passagem ou quer testar. Para quem vai treinar toda semana, o plano quase sempre sai mais em conta, e a constância é o que faz o treino dar resultado. A lista acima faz essa conta para a quantidade de idas que você escolher.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O que ficou fora da lista</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">Só entra oferta confirmada em fonte oficial.</strong> Estas apareceram na pesquisa, mas sem confirmação:
            </p>
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5">
              {NAO_CONFIRMADAS.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Academia que não aparece aqui pode ter diária ou aula experimental e só não publicar. Pergunte na recepção. Para comparar as academias pela sua rotina, use o teste{" "}
              <Link href="/academia-ideal-alphaville" className={ln}>qual academia de Alphaville combina com você</Link> ou veja o{" "}
              <Link href="/academias-alphaville" className={ln}>guia das academias de Alphaville</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>De onde vêm os dados</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Cada oferta mostra a fonte oficial e a data em que foi conferida.</strong> A conferência nos sites das academias foi feita pelo{" "}
              <a href={CONFERENCIA.url} className={ln} target="_blank" rel="noopener noreferrer">{CONFERENCIA.por}</a>, guia local que eu também mantenho, e a mais recente é de {dataTxt(ULTIMA)}. Lá a mesma lista tem filtro por data e hora de chegada. As academias citadas não pagam para aparecer. Preço e regra mudam sem aviso: confirme com a unidade antes de ir.
            </p>
          </div>

          <FAQ itens={faq} placement="ferramenta-diaria-experimental" />
        </div>
      </section>
    </>
  );
}
