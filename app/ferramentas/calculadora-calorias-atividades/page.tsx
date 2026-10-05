import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import ComparadorAtividades from "@/components/atividades/ComparadorAtividades";
import {
  COMPARADOR,
  FONTES_ATIVIDADES,
  FONTE_COMPENDIO_ATIVIDADES,
  FONTE_HALL,
  KCAL_POR_KG_GORDURA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_PADRAO,
  arredondaKcal,
  comparaAtividades,
  formataTempo,
  minutosParaUmQuilo,
} from "@/lib/atividades";

/**
 * Qual atividade queima mais calorias?
 *
 * A URL é a da antiga Calculadora de Calorias por Atividade, mantida de
 * propósito: ela está indexada, é a canônica dos embeds antigos e ranqueia
 * pela busca genérica. O que a página faz mudou — lib/atividades.ts conta
 * por quê: todas as atividades saíram para calculadoras próprias, e o que
 * sobrou foi a pergunta que só se responde com todas juntas.
 *
 * Os números resolvidos em HTML existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-atividades";

export const metadata: Metadata = {
  title: "Qual Atividade Queima Mais Calorias? Compare 15 Esportes",
  description:
    "Corrida, bicicleta, natação, futebol, boxe, jiu-jitsu, corda, escada e dança: o gasto de cada atividade no mesmo tempo, com o seu peso, do maior ao menor.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Qual atividade queima mais calorias? | Montinho Personal Trainer",
    description: "Todas as atividades do site lado a lado, no mesmo tempo e com o seu peso — e a calculadora própria de cada uma.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Comparador de Calorias por Atividade",
  descricao:
    "Compara o gasto calórico estimado de quinze atividades físicas no mesmo tempo, a partir do peso corporal, com os METs do Compêndio de Atividades Físicas, e aponta a calculadora própria de cada uma.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Qual atividade queima mais calorias?", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const CMP = comparaAtividades(60, PESO_PADRAO);
const PRIMEIRA = CMP[0];
const ULTIMA = CMP[CMP.length - 1];
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const faq: ItemFAQ[] = [
  {
    question: "Qual atividade queima mais calorias?",
    answer: `No mesmo tempo e para ${PESO_PADRAO} kg, a ordem começa em ${PRIMEIRA.nome.toLowerCase()} (${kc(PRIMEIRA.kcal)} kcal em 60 minutos, em ${PRIMEIRA.ritmo}) e termina em ${ULTIMA.nome.toLowerCase()} (${kc(ULTIMA.kcal)} kcal). Só que a atividade que emagrece mais é a que você repete — e nisso a que você gosta ganha da que gasta 50 kcal a mais.`,
  },
  {
    question: "Esse número inclui o que eu gastaria parado?",
    answer: `Inclui — é gasto bruto, como em qualquer tabela de METs. Em 60 minutos, ${PESO_PADRAO} kg gastam cerca de ${kc(CMP[0].kcal - CMP[0].kcalLiquida)} kcal só de existir; o que a atividade acrescenta ao dia é o gasto menos isso. A calculadora de cada atividade mostra os dois.`,
  },
  {
    question: "Por que cada atividade tem uma calculadora própria?",
    answer:
      "Porque cada uma tem uma conta que as outras não têm. O futebol separa o tempo de bola rolando do tempo na lateral; o boxe conta rounds e o ritmo de socos; o spinning usa os watts da bike; a corda conta só o tempo pulando dos blocos; a escada conta andares; a bicicleta desconta as paradas e calcula a ida e volta do trabalho. Aqui você compara; lá você calcula.",
  },
  {
    question: "Quanto tempo de atividade para perder 1 kg?",
    answer: `Um quilo de gordura guarda cerca de ${KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal. Para ${PESO_PADRAO} kg, seriam uns ${formataTempo(minutosParaUmQuilo(PRIMEIRA.met, PESO_PADRAO))} de ${PRIMEIRA.nome.toLowerCase()} ou ${formataTempo(minutosParaUmQuilo(ULTIMA.met, PESO_PADRAO))} de ${ULTIMA.nome.toLowerCase()} — em tese. O corpo não responde de forma linear, e é por isso que o déficit da semana, e não uma atividade, decide.`,
  },
  {
    question: "Como calcular o gasto calórico por atividade?",
    answer: `Pela fórmula do MET: kcal por minuto = MET × 3,5 × peso em kg ÷ 200. O MET de cada atividade vem do Compêndio de Atividades Físicas. Para ${PESO_PADRAO} kg numa atividade de 8 METs: 8 × 3,5 × ${PESO_PADRAO} ÷ 200 ≈ ${(8 * 3.5 * PESO_PADRAO / 200).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kcal por minuto, cerca de ${kc(8 * 3.5 * PESO_PADRAO / 200 * 60)} kcal por hora. O comparador desta página faz a conta para 15 atividades de uma vez.`,
  },
  {
    question: "Quantas calorias queima 20 minutos de exercício?",
    answer: `Depende da atividade: para ${PESO_PADRAO} kg, 20 minutos vão de cerca de ${kc(ULTIMA.kcal / 3)} kcal em ${ULTIMA.nome.toLowerCase()} a ${kc(PRIMEIRA.kcal / 3)} kcal em ${PRIMEIRA.nome.toLowerCase()}. Mude o tempo no comparador para ver todas.`,
  },
  {
    question: "Musculação queima quantas calorias?",
    answer: "Por hora, menos que a maior parte das atividades desta tabela, porque metade do treino é pausa entre séries. O valor da musculação para quem quer emagrecer está em outro lugar: ela preserva o músculo enquanto a balança desce, e é isso que define como o corpo fica no fim.",
  },
  {
    question: "É muito gastar 2 mil calorias por dia?",
    answer: "Não: esse é o gasto total do dia, e não do exercício, e fica na faixa comum de muitos adultos. Ele soma o metabolismo de repouso, a digestão, o movimento do dia e o treino. Uma pessoa sedentária também gasta bastante só para manter o corpo funcionando. Para estimar o seu, use a calculadora de TMB e gasto diário.",
  },
  {
    question: "Fazer a atividade que gasta mais perde barriga?",
    answer: NOTA_SEM_PERDA_LOCALIZADA + " A atividade entra como uma das fontes de gasto da semana, ao lado da musculação e da alimentação.",
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

export default function ComparadorAtividadesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Qual atividade queima mais calorias?
          </h1>
          <Compartilhar contexto="tool" titulo="Qual atividade queima mais calorias?" caminho={CAMINHO} local="tool_top" ferramenta="atividades" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            {COMPARADOR.length} atividades lado a lado, no mesmo tempo e com o seu peso — e a calculadora própria de cada uma, que faz a conta
            completa.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ComparadorAtividades placement="calculadora-calorias-atividades" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O ranking: 60 minutos para {PESO_PADRAO} kg</h2>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em 60 minutos por atividade, para 70 kg, do maior ao menor</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Atividade</th>
                    <th scope="col" className={th}>Ritmo</th>
                    <th scope="col" className={th}>METs</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">60 min</th>
                  </tr>
                </thead>
                <tbody>
                  {CMP.map((l) => (
                    <tr key={l.id} className="border-b border-white/10">
                      <td className="py-2.5 pr-4"><Link href={l.href} className={`text-white ${ln}`}>{l.nome}</Link></td>
                      <td className="text-gray-400 py-2.5 pr-4">{l.ritmo}</td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums">{metF(l.met)}</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">≈ {kc(l.kcal)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              A tabela responde &ldquo;qual gasta mais por minuto&rdquo;, que não é a mesma pergunta que &ldquo;qual emagrece mais&rdquo;. A
              segunda depende de quantas vezes por semana você aparece — e aí a atividade de que você gosta ganha da que gasta 50 kcal a mais e
              você abandona em três semanas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Cada atividade tem a própria calculadora</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              O ranking usa um ritmo representativo de cada uma. A calculadora própria pergunta o que muda a conta de verdade:
            </p>
            <ul className="space-y-2 text-gray-300">
              {COMPARADOR.map((a) => (
                <li key={a.id}>
                  <Link href={a.href} className={`text-white ${ln}`}>{a.nome}</Link>
                  <span className="text-gray-400"> — {a.oQueTem}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto tempo para perder 1 kg?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Um quilo de gordura guarda cerca de {KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal. Para {PESO_PADRAO} kg, isso daria algo como{" "}
              <strong className="text-white">{formataTempo(minutosParaUmQuilo(PRIMEIRA.met, PESO_PADRAO))}</strong> de {PRIMEIRA.nome.toLowerCase()} ou{" "}
              <strong className="text-white">{formataTempo(minutosParaUmQuilo(ULTIMA.met, PESO_PADRAO))}</strong> de {ULTIMA.nome.toLowerCase()}.
            </p>
            <div className="border-l-2 pl-4 mb-4" style={{ borderColor: "#BA9E50" }}>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">Isso NÃO significa que esse tempo fará você perder exatamente 1 kg.</strong> É uma simulação teórica,
                para dar ordem de grandeza.
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              O corpo não responde de forma linear. {FONTE_HALL.rotuloCurto} {FONTE_HALL.resumo} O que a conta mostra é por que nenhuma atividade
              sozinha resolve — e por que <Link href="/blog/deficit-calorico-como-calcular" className={ln}>o déficit da semana</Link> é o que decide.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_ATIVIDADES.rotuloCurto}, que {FONTE_COMPENDIO_ATIVIDADES.resumo} Nenhum valor mora nesta página:
              cada linha importa o MET da calculadora própria da atividade, no ritmo que a representa, para que o comparador nunca discorde da
              ferramenta que ele aponta. A corrida usa a equação da ACSM a {10} km/h. Os números são{" "}
              <strong className="text-white">brutos</strong>: incluem o que você gastaria parado.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 24 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville.
              Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-atividades" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_ATIVIDADES.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
              <li><Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>Calculadora de Déficit Calórico — quanto comer para emagrecer</Link></li>
              <li><Link href="/ferramentas/zonas-de-frequencia-cardiaca" className={ln}>Calculadora de Zonas de Frequência Cardíaca — a intensidade certa</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
