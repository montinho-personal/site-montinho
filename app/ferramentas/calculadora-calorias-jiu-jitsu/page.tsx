import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraJiuJitsu from "@/components/jiujitsu/CalculadoraJiuJitsu";
import {
  DESCANSO_PADRAO,
  FONTES_JIU,
  FONTE_COMPENDIO_JIU,
  MET_DESCANSO,
  MET_ROLA,
  MET_TECNICA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_PADRAO,
  ROLA_PADRAO,
  arredondaKcal,
  calcula,
  kcalPorRolaExtra,
  kgPorMes,
  tabelaCenarios,
} from "@/lib/jiujitsu";

/**
 * A página da Calculadora de Calorias no Jiu-Jitsu.
 *
 * O `jiu-jitsu-emagrece` já organiza as aulas pelo número de rolas. Esta
 * página faz a conta com o peso, a duração da aula e os rolas de quem
 * pergunta — e mostra o dado que mais surpreende: numa aula de mesma
 * duração, cada rola a mais soma pouco.
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-jiu-jitsu";

export const metadata: Metadata = {
  title: "Calculadora de Calorias no Jiu-Jitsu: Aula e Rolas",
  description:
    "Quantas calorias a sua aula de jiu-jitsu gasta, separando a técnica dos rolas, com o seu peso — e quanto cada rola a mais soma de verdade no treino.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias no Jiu-Jitsu | Montinho Personal Trainer",
    description:
      "Duração da aula e número de rolas: veja quanto o treino gastou com o seu peso e quanto cada rola a mais soma.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias no Jiu-Jitsu",
  descricao:
    "Estima o gasto calórico de uma aula de jiu-jitsu a partir do peso, da duração da aula e do número e duração dos rolas, separando técnica, rola e descanso, e converte a frequência semanal em quilos por mês.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias no Jiu-Jitsu", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const TAB = tabelaCenarios();
const TIPICA = calcula(PESO_PADRAO, 75, 4, ROLA_PADRAO, DESCANSO_PADRAO)!;
const SO_TECNICA = calcula(PESO_PADRAO, 75, 0, ROLA_PADRAO, DESCANSO_PADRAO)!;
const EXTRA = kcalPorRolaExtra(PESO_PADRAO, ROLA_PADRAO, DESCANSO_PADRAO);
const TRES = kgPorMes(TIPICA, 3);
const mil = (n: number) => n.toLocaleString("pt-BR");
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias queima uma aula de jiu-jitsu?",
    answer: `Depende de quantos rolas. Para ${PESO_PADRAO} kg, uma aula de 60 minutos com muita técnica e um rola gasta cerca de ${mil(TAB[0].kcal70)} kcal; uma aula típica de 75 minutos com quatro rolas, cerca de ${mil(TAB[1].kcal70)}; uma aula de competição de 90 minutos com oito rolas, cerca de ${mil(TAB[2].kcal70)}.`,
  },
  {
    question: "Quantas calorias gasta um rola de jiu-jitsu?",
    answer: `Um rola de ${ROLA_PADRAO} minutos gasta cerca de ${kc(calcula(PESO_PADRAO, ROLA_PADRAO, 1, ROLA_PADRAO, 0)!.kcal)} kcal para ${PESO_PADRAO} kg. Mas, numa aula de mesma duração, trocar técnica por um rola a mais soma só cerca de ${kc(EXTRA)} kcal — o rola gasta o dobro por minuto, mas é curto.`,
  },
  {
    question: "Jiu-jitsu emagrece quantos quilos por mês?",
    answer: `Só do tatame, pouco: três aulas típicas por semana somam no máximo ${kg(TRES)} kg de gordura por mês para ${PESO_PADRAO} kg. O resto vem da alimentação — e da frequência, que pesa mais que o número de rolas.`,
  },
  {
    question: "Jiu-jitsu gasta mais que musculação?",
    answer:
      "Por hora, uma aula de jiu-jitsu com rolas gasta mais que uma sessão comum de musculação. Mas a musculação constrói a força que protege ombro, joelho e coluna no rola — e preserva músculo enquanto você emagrece. Os dois se completam.",
  },
  {
    question: "Jiu-jitsu perde barriga?",
    answer: NOTA_SEM_PERDA_LOCALIZADA,
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

export default function CalculadoraJiuJitsuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias no Jiu-Jitsu
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias no Jiu-Jitsu" caminho={CAMINHO} local="tool_top" ferramenta="jiujitsu" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto a sua aula gastou, separando a técnica dos rolas — e quanto cada rola a mais soma de verdade.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraJiuJitsu placement="calculadora-calorias-jiu-jitsu" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias uma aula de jiu-jitsu queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Depende de quantos rolas a aula teve. Rolas de {ROLA_PADRAO} minutos, com {DESCANSO_PADRAO} de descanso entre eles:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de uma aula de jiu-jitsu por tipo de aula, para 70 e 90 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Aula</th>
                    <th scope="col" className={th}>70 kg</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">90 kg</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB.map((l) => (
                    <tr key={l.cenario.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{l.cenario.nome}, {l.cenario.minutosAula} min</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(l.kcal70)} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {mil(l.kcal90)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Um rola a mais soma quanto?</h2>
            <p className="text-gray-300 leading-relaxed">
              Menos do que parece. Numa aula de 75 minutos, para {PESO_PADRAO} kg, só técnica dá cerca de {kc(SO_TECNICA.kcal)} kcal, e com
              quatro rolas, cerca de {kc(TIPICA.kcal)}. Cada rola a mais, trocando técnica por luta na mesma aula, soma só{" "}
              <strong className="text-white">cerca de {kc(EXTRA)} kcal</strong>. O rola gasta o dobro por minuto — {metF(MET_ROLA)} contra{" "}
              {metF(MET_TECNICA)} METs —, mas é curto e vem com descanso. Quem quer gastar mais precisa de mais aulas na semana, não de
              emendar rolas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Jiu-jitsu emagrece quantos quilos?</h2>
            <p className="text-gray-300 leading-relaxed">
              Só do tatame, pouco: três aulas típicas por semana somam no máximo {kg(TRES)} kg de gordura por mês para {PESO_PADRAO} kg.
              O <Link href="/blog/jiu-jitsu-emagrece" className={ln}>artigo sobre jiu-jitsu e emagrecimento</Link> explica o resto: por
              que ficar melhor no tatame reduz o gasto por rola, e por que a musculação é o que mantém você treinando.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">técnica = aula − rolas − descansos</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_JIU.rotuloCurto}, que {FONTE_COMPENDIO_JIU.resumo} O descanso entre rolas vale{" "}
              {metF(MET_DESCANSO)} MET, que é ficar em pé.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 23 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-jiu-jitsu" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_JIU.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/jiu-jitsu-emagrece" className={ln}>Jiu-jitsu emagrece? Calorias reais e o que esperar</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-boxe" className={ln}>Calculadora de Calorias no Boxe — aula e rounds</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-atividades" className={ln}>Calculadora de Calorias por Atividade — corda, escada e bicicleta</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
