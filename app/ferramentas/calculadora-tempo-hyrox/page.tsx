import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraTempoHyrox from "@/components/hyrox/CalculadoraTempoHyrox";
import { FONTES_TEMPO_HYROX, FONTE_ROXZONE, KM_CORRIDA, ROXZONE, formataPace, formataTempo, paceParaMeta, preve } from "@/lib/hyrox-tempo";

/**
 * A página da Calculadora de Tempo do Hyrox.
 *
 * A de calorias responde "quanto gastei". Esta responde as duas perguntas
 * de quem se prepara: "quanto vou fazer?" e "que pace preciso para a minha
 * meta?". Os exemplos da página usam a própria conta da ferramenta.
 */

const CAMINHO = "/ferramentas/calculadora-tempo-hyrox";

export const metadata: Metadata = {
  title: "Calculadora de Tempo do Hyrox: Pace, Estações e Roxzone",
  description:
    "Quanto tempo você vai fazer no Hyrox, ou que pace precisa para a sua meta: some corrida, estações e Roxzone e veja onde estão os seus minutos.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Tempo do Hyrox | Montinho Personal Trainer",
    description: "Pace, estações e Roxzone: preveja o seu tempo final ou descubra o pace que fecha a sua meta.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Tempo do Hyrox",
  descricao:
    "Soma os 8 km de corrida, o tempo das oito estações e a Roxzone para prever o tempo final de uma prova de Hyrox, ou calcula o pace necessário para uma meta de tempo.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Tempo do Hyrox", item: `${SITE_URL}${CAMINHO}` },
  ],
};

/** Exemplos: estações em média de 5:00 e a Roxzone da faixa de 1h20 a 1h30. */
const ESTACAO = 300;
const ROX = ROXZONE[1].seg;
const METAS = [75, 90, 105, 120].map((min) => ({ min, pace: paceParaMeta(min * 60, ESTACAO, ROX) }));
const EX = preve(360, ESTACAO, ROX);
const P90 = paceParaMeta(90 * 60, ESTACAO, ROX)!;

const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const th = "text-left text-gray-400 font-medium py-2.5 pr-4";

const faq: ItemFAQ[] = [
  {
    question: "Quanto tempo dura uma prova de Hyrox?",
    answer: `Para a maioria das pessoas, entre 1 hora e 2 horas. Com pace de ${formataPace(360)} por km, estações de 5 minutos em média e ${formataTempo(ROX)} de Roxzone, a prova dá ${formataTempo(EX.totalSeg)}. O vencedor do Pro masculino em São Paulo 2026 fez 58:41.`,
  },
  {
    question: "Qual pace preciso para fazer o Hyrox em 1h30?",
    answer: `Depende do tempo nas estações. Com 5 minutos por estação e ${formataTempo(ROX)} de Roxzone, o pace que fecha 1h30 é de ${formataPace(P90)} por km. Se as estações levarem 6 minutos, sobra menos tempo e o pace precisa ficar mais rápido — a calculadora faz a conta com os seus números.`,
  },
  {
    question: "O que é a Roxzone no Hyrox?",
    answer: `É a área de transição entre a pista de corrida e as estações. O cronômetro não para ali. Numa análise de 825 resultados de uma etapa, a Roxzone total foi de ${formataTempo(ROXZONE[0].seg)} para quem terminou abaixo de 1h10 e de ${formataTempo(ROXZONE[2].seg)} para quem passou de 1h30.`,
  },
  {
    question: "O que pesa mais no tempo do Hyrox: corrida ou estações?",
    answer: `As duas pesam perto da metade cada uma. No exemplo de ${formataTempo(EX.totalSeg)}, a corrida leva ${formataTempo(EX.corridaSeg)} e as estações, ${formataTempo(EX.estacoesSeg)}. Ganhar 10 segundos por km tira 1:20 da prova; tirar 20 segundos de cada estação tira 2:40.`,
  },
  {
    question: "Como calcular o pace de corrida no Hyrox?",
    answer: `Divida o tempo de corrida pelos ${KM_CORRIDA} km. Para saber o pace que fecha uma meta, tire da meta o tempo das estações e da Roxzone e divida o que sobra por ${KM_CORRIDA}. É exatamente a conta do modo "Tenho uma meta de tempo".`,
  },
  {
    question: "O tempo do simulado vale para a prova?",
    answer: "Serve de base, mas a prova costuma sair mais lenta: a Roxzone é maior, há fila em algumas estações e o pace cai nas últimas corridas. Use o simulado para achar o seu tempo por estação e deixe uma margem.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

export default function CalculadoraTempoHyroxPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Tempo do Hyrox
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Tempo do Hyrox" caminho={CAMINHO} local="tool_top" ferramenta="hyrox-tempo" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto tempo você vai fazer, ou que pace precisa para a sua meta — somando corrida, estações e Roxzone.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraTempoHyrox placement="calculadora-tempo-hyrox" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Que pace fecha cada meta?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Com estações de 5 minutos em média e {formataTempo(ROX)} de Roxzone:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Pace de corrida necessário para cada meta de tempo no Hyrox</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Meta</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Pace por km</th>
                  </tr>
                </thead>
                <tbody>
                  {METAS.map((m) => (
                    <tr key={m.min} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{formataTempo(m.min * 60)}</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">{m.pace ? formataPace(m.pace) : "não fecha com 5 min por estação"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">Estação mais rápida libera pace mais lento — por isso a mesma meta pede paces diferentes para pessoas diferentes.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto tempo dura uma prova de Hyrox?</h2>
            <p className="text-gray-300 leading-relaxed">
              São sempre os mesmos {KM_CORRIDA} km de corrida e as mesmas oito estações, na mesma ordem. O que muda é o ritmo: com pace de{" "}
              {formataPace(360)} por km e estações de 5 minutos, a prova fecha em {formataTempo(EX.totalSeg)}. A ordem das estações e os pesos
              de cada categoria estão em <Link href="/blog/estacoes-do-hyrox" className={ln}>estações do Hyrox</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>A Roxzone também conta</h2>
            <p className="text-gray-300 leading-relaxed">
              A Roxzone é o caminho entre a pista e cada estação, e o cronômetro corre ali. Na {FONTE_ROXZONE.rotuloCurto}, com 825 resultados,
              ela somou de {formataTempo(ROXZONE[0].seg)} (abaixo de 1h10) a {formataTempo(ROXZONE[2].seg)} (acima de 1h30). Quem anda na
              Roxzone perde minutos sem perceber; quem treina a transição em simulado ganha esses minutos de graça.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>tempo final = {KM_CORRIDA} × pace + estações + Roxzone</p>
              <p className="mt-2">pace da meta = (meta − estações − Roxzone) ÷ {KM_CORRIDA}</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-3">
              Os números são os seus. O único dado de fora são os atalhos da Roxzone, para quem não sabe o próprio tempo de transição.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 23 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-tempo-hyrox" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_TEMPO_HYROX.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/treino-de-hyrox" className={ln}>Treino de Hyrox: planilha de 8 semanas</Link></li>
              <li><Link href="/blog/estacoes-do-hyrox" className={ln}>Estações do Hyrox: ordem, pesos e técnica</Link></li>
              <li><Link href="/blog/hyrox-o-que-e" className={ln}>Hyrox: o que é e como funciona</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-hyrox" className={ln}>Calculadora de Calorias no Hyrox</Link></li>
              <li><Link href="/ferramentas/calculadora-corrida" className={ln}>Calculadora de Corrida — pace e tempo</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
