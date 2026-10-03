import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraMuayThai from "@/components/muaythai/CalculadoraMuayThai";
import { aula as aulaBoxe } from "@/lib/boxe";
import {
  DESCANSO_PADRAO,
  FONTES_MUAY,
  FONTE_COMPENDIO_MUAY,
  MET_DESCANSO,
  MET_ROUND,
  MET_TECNICA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_PADRAO,
  ROUNDS_PADRAO,
  ROUND_PADRAO,
  arredondaKcal,
  calcula,
  horaSemParar,
  kcalPorRoundExtra,
  kgPorMes,
  tabelaCenarios,
  tabelaHora,
} from "@/lib/muaythai";

/**
 * A página da Calculadora de Calorias no Muay Thai.
 *
 * As buscas ("muay thai calorias por hora", "1 hora de muay thai queima
 * quantas calorias", "muay thai emagrece quantos quilos por semana", "qual
 * arte marcial queima mais") pedem número por hora e por aula. A visão por
 * IA do Google repete 500 a 1.000 kcal por hora; a conta pelo Compêndio
 * mostra por que esse teto só existe numa hora inteira em ritmo de luta.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-muay-thai";

export const metadata: Metadata = {
  title: "Muay Thai Queima Quantas Calorias? Por Hora e Por Aula",
  description:
    "Quantas calorias o muay thai queima por hora e por aula, com o seu peso: técnica, rounds de manopla e sparring. Quanto emagrece por semana e qual luta gasta mais.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias no Muay Thai | Montinho Personal Trainer",
    description:
      "Duração da aula e número de rounds fortes: veja quanto o treino de muay thai gastou com o seu peso.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias no Muay Thai",
  descricao:
    "Estima o gasto calórico de uma aula de muay thai a partir do peso, da duração da aula e do número e duração dos rounds fortes, separando técnica, rounds e descanso, e converte a frequência semanal em quilos por mês.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias no Muay Thai", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const TAB = tabelaCenarios();
const HORA = tabelaHora();
const H70 = HORA.find((l) => l.peso === PESO_PADRAO)!;
const H90 = HORA.find((l) => l.peso === 90)!;
const TIPICA = calcula(PESO_PADRAO, 60, ROUNDS_PADRAO, ROUND_PADRAO, DESCANSO_PADRAO)!;
const EXTRA = kcalPorRoundExtra(PESO_PADRAO, ROUND_PADRAO, DESCANSO_PADRAO);
const TRES = kgPorMes(TIPICA, 3);
const SEMANA3 = (TRES * 12) / 52;
const SPAR_BOXE = aulaBoxe("sparring");
const SACO_BOXE = aulaBoxe("saco");
const mil = (n: number) => n.toLocaleString("pt-BR");
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const g = (n: number) => Math.round(n * 1000).toLocaleString("pt-BR");
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");

const faq: ItemFAQ[] = [
  {
    question: "1 hora de muay thai queima quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg, uma aula de uma hora com ${ROUNDS_PADRAO} rounds fortes gasta cerca de ${mil(H70.tipica)} kcal; só técnica, cerca de ${mil(H70.tecnica)} kcal. Com 90 kg, a aula típica passa de ${mil(H90.tipica)} kcal. Uma hora inteira em ritmo de luta, sem pausa, chegaria a ${kc(horaSemParar(PESO_PADRAO))} kcal, mas nenhuma aula real é assim.`,
  },
  {
    question: "Muay thai queima 1.000 calorias por hora?",
    answer: `Quase nunca. Para ${PESO_PADRAO} kg, nem uma hora inteira em ritmo de luta chega lá (≈ ${kc(horaSemParar(PESO_PADRAO))} kcal). Os 1.000 kcal supõem uma pessoa pesada em esforço máximo o tempo todo, sem técnica nem descanso.`,
  },
  {
    question: "Muay thai emagrece quantos quilos por semana?",
    answer: `Só do treino, pouco: três aulas típicas por semana somam cerca de ${g(SEMANA3)} g de gordura por semana (≈ ${kg(TRES)} kg por mês) para ${PESO_PADRAO} kg, pela conta linear, que é teto. O resto vem da alimentação e da constância.`,
  },
  {
    question: "Muay thai queima muitas calorias?",
    answer: `Nos rounds fortes, sim: o Compêndio de Atividades Físicas dá ${metF(MET_ROUND)} METs às artes marciais em ritmo de luta, e cita o muay thai pelo nome. A aula inteira gasta menos, porque boa parte dela é técnica (${metF(MET_TECNICA)} METs) e descanso.`,
  },
  {
    question: "Qual é a arte marcial que mais queima calorias?",
    answer: `Minuto a minuto, muay thai e jiu-jitsu em ritmo de luta ficam no topo (${metF(MET_ROUND)} METs), acima do sparring de boxe (${metF(SPAR_BOXE.met)}) e do saco de pancada (${metF(SACO_BOXE.met)}). Numa aula real, a diferença entre as lutas diminui: pesa mais quantos rounds fortes você faz e quantas vezes treina na semana.`,
  },
  {
    question: "O que emagrece mais, academia ou muay thai?",
    answer:
      "Por hora, uma aula de muay thai gasta mais que uma sessão comum de musculação. Mas a musculação preserva músculo enquanto você emagrece, e protege joelho, quadril e ombro nos chutes. O melhor é combinar os dois; se tiver de escolher, fique com o que você consegue manter.",
  },
  {
    question: "O muay thai define o corpo?",
    answer:
      "Ajuda a perder gordura, e perder gordura é o que deixa o músculo aparecer. Para ter músculo para mostrar, a musculação faz o trabalho que o muay thai não faz sozinho. Em quanto tempo depende do ponto de partida e da alimentação, não da luta.",
  },
  {
    question: "Muay thai perde barriga?",
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

export default function CalculadoraMuayThaiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias no Muay Thai
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias no Muay Thai" caminho={CAMINHO} local="tool_top" ferramenta="muaythai" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto a sua aula gastou, separando a técnica dos rounds de manopla, saco e sparring.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraMuayThai placement="calculadora-calorias-muay-thai" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Muay thai: calorias por hora</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Uma hora de aula, por peso. A aula típica tem {ROUNDS_PADRAO} rounds fortes de {ROUND_PADRAO} minutos, com{" "}
              {DESCANSO_PADRAO} de descanso. A última coluna é o teto teórico, não uma aula real:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de muay thai em uma hora, por peso</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    <th scope="col" className={th}>Só técnica</th>
                    <th scope="col" className={th}>Aula típica</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Sem parar</th>
                  </tr>
                </thead>
                <tbody>
                  {HORA.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">≈ {mil(l.tecnica)} kcal</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(l.tipica)} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {mil(l.semParar)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              A internet fala em 500 a 1.000 kcal por hora. Para chegar perto de 1.000, é preciso pesar bem mais que {PESO_PADRAO} kg e
              passar a hora inteira em ritmo de luta.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias uma aula de muay thai queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Depende de quantos rounds fortes a aula teve:</p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de uma aula de muay thai por tipo de aula, para 70 e 90 kg</caption>
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
            <p className="text-gray-300 leading-relaxed">
              Cada round forte a mais, trocando técnica por round na mesma aula, soma cerca de{" "}
              <strong className="text-white">{kc(EXTRA)} kcal</strong> para {PESO_PADRAO} kg. O round gasta o dobro por minuto, mas é
              curto. Quem quer gastar mais precisa de mais aulas na semana.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Qual arte marcial queima mais calorias?</h2>
            <p className="text-gray-300 leading-relaxed">
              Pelo Compêndio de Atividades Físicas, muay thai e jiu-jitsu em ritmo de luta valem {metF(MET_ROUND)} METs, o sparring de boxe{" "}
              {metF(SPAR_BOXE.met)} e o saco de pancada {metF(SACO_BOXE.met)}. Na prática, a aula que gasta mais é a que tem mais tempo de
              luta de verdade. Compare nas calculadoras do{" "}
              <Link href="/ferramentas/calculadora-calorias-boxe" className={ln}>boxe</Link> e do{" "}
              <Link href="/ferramentas/calculadora-calorias-jiu-jitsu" className={ln}>jiu-jitsu</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Muay thai emagrece quantos quilos?</h2>
            <p className="text-gray-300 leading-relaxed">
              Três aulas típicas por semana somam no máximo {kg(TRES)} kg de gordura por mês para {PESO_PADRAO} kg, cerca de{" "}
              {g(SEMANA3)} g por semana. É teto: o corpo compensa parte do gasto. O{" "}
              <Link href="/blog/muay-thai-emagrece" className={ln}>artigo sobre muay thai e emagrecimento</Link> explica o resto, e por que
              a musculação junto faz diferença.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">técnica = aula − rounds − descansos</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_MUAY.rotuloCurto}, que {FONTE_COMPENDIO_MUAY.resumo} O descanso entre rounds vale{" "}
              {metF(MET_DESCANSO)} MET, que é ficar em pé.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 30 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div className="border border-white/15 p-5">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
            {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white leading-relaxed mb-3">{t}</p>)}
            <p className="text-gray-400 text-sm">— Montinho</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-muay-thai" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_MUAY.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Pratica outra arte marcial? A <Link href="/ferramentas/calculadora-calorias-artes-marciais" className={ln}>Calculadora de Calorias nas Artes Marciais</Link> compara judô, caratê, taekwondo, kickboxing e MMA.</li>
              <li><Link href="/blog/muay-thai-emagrece" className={ln}>Muay thai emagrece? Calorias reais e o que esperar</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-boxe" className={ln}>Calculadora de Calorias no Boxe</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-jiu-jitsu" className={ln}>Calculadora de Calorias no Jiu-Jitsu</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE: o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
