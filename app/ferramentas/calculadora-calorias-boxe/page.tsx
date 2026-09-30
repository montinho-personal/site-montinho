import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraBoxe from "@/components/boxe/CalculadoraBoxe";
import {
  AULAS,
  DESCANSO_PADRAO,
  FONTES_BOXE,
  FONTE_COMPENDIO_BOXE,
  KCAL_PROPAGANDA,
  MET_DESCANSO,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_PADRAO,
  RITMOS,
  ROUNDS_PADRAO,
  ROUND_PADRAO,
  arredondaKcal,
  aula,
  deAula,
  deRounds,
  formataTempo,
  minutosAtePropaganda,
  ritmo,
  tabelaPorPeso,
  tabelaPorRitmo,
} from "@/lib/boxe";
import { MET_ROLA } from "@/lib/jiujitsu";

/**
 * A página da Calculadora de Calorias no Boxe.
 *
 * As buscas que chegam no `boxe-emagrece` são quase todas "boxe
 * emagrece?" e variações, com "boxe emagrece mais que academia" na
 * frente. Quase ninguém pergunta a caloria direto — mas a resposta de
 * "emagrece?" depende dela, e o número que as pessoas têm na cabeça é o
 * do relógio ou o da propaganda. Esta página põe os dois à prova.
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-boxe";

export const metadata: Metadata = {
  title: "Boxe Queima Quantas Calorias? 30 Minutos, 1 Hora e Aula",
  description:
    "Quantas calorias o boxe queima em 20 e 30 minutos, em 1 hora e por aula, com o seu peso: sombra, saco ou sparring. E qual luta gasta mais.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias no Boxe | Montinho Personal Trainer",
    description:
      "Uma aula de boxe queima mesmo 1.000 kcal? Calcule a sua pelo peso, pelo formato da aula ou pelos rounds — e compare com o relógio.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias no Boxe",
  descricao:
    "Estima o gasto calórico de uma aula de boxe — sombra, saco de pancada ou sparring — ou de uma sessão contada em rounds, no ritmo de socos medido pelo próprio praticante, e compara o resultado com o número do relógio.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias no Boxe", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const SACO = aula("saco");
const SPAR = aula("sparring");
const FORTE = ritmo("120");
const HORA = (met: number, peso = PESO_PADRAO) => deAula(peso, 60, met);
const TAB_PESO = tabelaPorPeso(60);
const TAB_RITMO = tabelaPorRitmo(PESO_PADRAO);
const ROUNDS_FORTE = deRounds(PESO_PADRAO, ROUNDS_PADRAO, ROUND_PADRAO, DESCANSO_PADRAO, FORTE.met);
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const mil = (n: number) => n.toLocaleString("pt-BR");
const L90 = TAB_PESO.find((l) => l.peso === 90)!;
const SOMBRA = aula("sombra");
const MIN = (m: number, met: number) => deAula(PESO_PADRAO, m, met).kcal;
const TEMPOS = [20, 30, 60] as const;
const KCAL_MIN_SPAR = MIN(1, SPAR.met);
const MIN_500_SPAR = Math.ceil(500 / KCAL_MIN_SPAR);

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias uma aula de boxe queima?",
    answer: `Uma hora de aula com saco de pancada gasta cerca de ${kc(HORA(SACO.met).kcal)} kcal para quem pesa ${PESO_PADRAO} kg e ${mil(L90.saco)} kcal para quem pesa 90 kg. Sparring gasta mais: cerca de ${kc(HORA(SPAR.met).kcal)} kcal para ${PESO_PADRAO} kg. Aula de sombra e técnica, um pouco menos que a de saco.`,
  },
  {
    question: "Quantas calorias queima 1h de boxe?",
    answer: `Para ${PESO_PADRAO} kg: cerca de ${kc(MIN(60, SOMBRA.met))} kcal em treino de sombra, ${kc(MIN(60, SACO.met))} kcal no saco e ${kc(MIN(60, SPAR.met))} kcal em sparring. Quem pesa mais gasta mais na mesma hora.`,
  },
  {
    question: "30 minutos de boxe queima quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg, cerca de ${kc(MIN(30, SACO.met))} kcal no saco e ${kc(MIN(30, SPAR.met))} kcal em sparring.`,
  },
  {
    question: "20 minutos de boxe queima quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg, cerca de ${kc(MIN(20, SACO.met))} kcal no saco e ${kc(MIN(20, SPAR.met))} kcal em sparring.`,
  },
  {
    question: "Treino de sombra no boxe queima quantas calorias?",
    answer: `Cerca de ${kc(MIN(30, SOMBRA.met))} kcal em 30 minutos e ${kc(MIN(60, SOMBRA.met))} kcal em 1 hora para ${PESO_PADRAO} kg. É um pouco menos que o saco, e dá para fazer em casa.`,
  },
  {
    question: "Qual luta queima mais calorias?",
    answer: `Pelo Compêndio de Atividades Físicas, o rola do jiu-jitsu (${fmt(MET_ROLA)} METs) e o sparring de boxe (${fmt(SPAR.met)} METs) estão entre os mais intensos. Em 30 minutos, para ${PESO_PADRAO} kg: rola ≈ ${kc(MIN(30, MET_ROLA))} kcal e sparring ≈ ${kc(MIN(30, SPAR.met))} kcal. Numa aula de verdade, com técnica e pausas, a diferença entre as lutas fica pequena: o que mais pesa é quanto tempo você passa lutando.`,
  },
  {
    question: "Dá para queimar 500 calorias em 30 minutos de boxe?",
    answer: `Para ${PESO_PADRAO} kg, não: mesmo em sparring sem parar, 500 kcal levam cerca de ${MIN_500_SPAR} minutos. Chegar a isso em meia hora exige peso corporal bem maior e esforço máximo o tempo todo. Números assim costumam ser propaganda.`,
  },
  {
    question: "Uma aula de boxe queima 1.000 calorias?",
    answer: `Quase nunca. Para ${PESO_PADRAO} kg, chegar a ${mil(KCAL_PROPAGANDA)} kcal exigiria ${formataTempo(minutosAtePropaganda(PESO_PADRAO, SACO.met))} de aula de saco, ou ${formataTempo(minutosAtePropaganda(PESO_PADRAO, SPAR.met))} de sparring sem parar. O número de propaganda supõe uma pessoa pesada numa hora inteira de esforço máximo.`,
  },
  {
    question: "As calorias do relógio no boxe são confiáveis?",
    answer:
      "São uma estimativa, e no boxe costumam sair altas. Muitos relógios calculam pela frequência cardíaca, e no boxe ela sobe com tensão, adrenalina e braço acima do coração, não só com esforço. A calculadora compara o número do relógio com a conta pelo seu peso — use o relógio para comparar um treino com outro, não para decidir quanto comer.",
  },
  {
    question: "Quantas calorias gasta um round de boxe?",
    answer: `Depende do ritmo. Um round de ${ROUND_PADRAO} minutos a 120 socos por minuto gasta cerca de ${kc(deRounds(PESO_PADRAO, 1, ROUND_PADRAO, 0, FORTE.met).kcal)} kcal para ${PESO_PADRAO} kg. Doze rounds com um minuto de descanso dão cerca de ${kc(ROUNDS_FORTE.kcal)} kcal em ${formataTempo(ROUNDS_FORTE.minutosTotais)}.`,
  },
  {
    question: "Como saber o meu ritmo de socos?",
    answer:
      "Conte os socos de dez segundos no meio de um round. Cerca de 10 é o ritmo cadenciado, 60 por minuto; cerca de 20 é o forte, 120 por minuto; cerca de 30 é o máximo, 180 por minuto, que só se sustenta em tiros curtos. São os três ritmos que o Compêndio de Atividades Físicas mediu no saco.",
  },
  {
    question: "Boxe emagrece mais que academia?",
    answer:
      "Por hora, uma aula de boxe gasta mais que uma sessão comum de musculação. Mas a musculação preserva massa muscular enquanto você emagrece, e é isso que decide o corpo que sobra no fim. O melhor é combinar os dois; se tiver de escolher, fique com o que você consegue manter por mais tempo.",
  },
  {
    question: "Socar saco afina o braço?",
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

export default function CalculadoraBoxePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias no Boxe
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias no Boxe" caminho={CAMINHO} local="tool_top" ferramenta="boxe" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto o seu treino gastou de verdade — pela aula ou pelos rounds — e se o número do relógio faz sentido.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraBoxe placement="calculadora-calorias-boxe" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias uma aula de boxe queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Uma hora de aula com saco de pancada custa cerca de{" "}
              <strong className="text-white">{kc(HORA(SACO.met).kcal)} kcal</strong> para quem pesa {PESO_PADRAO} kg. Sparring
              gasta mais; sombra e técnica, um pouco menos. O que mais muda o número, depois do formato, é o{" "}
              <strong className="text-white">peso corporal</strong>:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em uma hora de aula de boxe, por peso e formato</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    <th scope="col" className={th}>Sombra</th>
                    <th scope="col" className={th}>Saco</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Sparring</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_PESO.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">≈ {mil(l.sombra)} kcal</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(l.saco)} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {mil(l.sparring)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              Uma hora de aula, com as pausas que a aula tem. O Compêndio mediu assim, então nada é descontado de novo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Boxe por tempo: 20, 30 minutos e 1 hora</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Para {PESO_PADRAO} kg, pelo formato do treino:</p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de boxe em 20, 30 e 60 minutos, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Tempo</th>
                    <th scope="col" className={th}>Sombra</th>
                    <th scope="col" className={th}>Saco</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Sparring</th>
                  </tr>
                </thead>
                <tbody>
                  {TEMPOS.map((m) => (
                    <tr key={m} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{formataTempo(m)}</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">≈ {kc(MIN(m, SOMBRA.met))} kcal</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {kc(MIN(m, SACO.met))} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {kc(MIN(m, SPAR.met))} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              Qual luta queima mais? O rola do jiu-jitsu fica um pouco acima do sparring: veja a{" "}
              <Link href="/ferramentas/calculadora-calorias-jiu-jitsu" className={ln}>Calculadora de Calorias do Jiu-Jitsu</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Uma aula de boxe queima 1.000 calorias?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              É o número que aparece em propaganda de academia e em tela de relógio. Para {PESO_PADRAO} kg, chegar a ele
              exigiria <strong className="text-white">{formataTempo(minutosAtePropaganda(PESO_PADRAO, SACO.met))}</strong> de aula
              de saco, ou {formataTempo(minutosAtePropaganda(PESO_PADRAO, SPAR.met))} de sparring sem parar. Até quem pesa 90 kg
              precisaria de {formataTempo(minutosAtePropaganda(90, SPAR.met))} de sparring contínuo.
            </p>
            <p className="text-gray-300 leading-relaxed">
              O relógio chega lá com facilidade porque muitos calculam pela frequência cardíaca — e no boxe ela sobe com
              tensão, adrenalina e braço acima do coração, não só com esforço. Por isso a calculadora tem um campo para o
              número do relógio: ela mostra a distância entre os dois, sem fingir que um deles é medição.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Pelos rounds: conte os seus socos</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              O boxe é a única atividade em que você mesmo consegue medir a intensidade. O Compêndio mediu o saco em três
              ritmos, e para saber o seu basta contar os socos de dez segundos no meio de um round. Doze rounds de{" "}
              {ROUND_PADRAO} minutos com {DESCANSO_PADRAO} de descanso, {PESO_PADRAO} kg:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto de doze rounds de três minutos por ritmo de socos, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Ritmo</th>
                    <th scope="col" className={th}>Em 10 segundos</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">12 rounds</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_RITMO.map((l) => (
                    <tr key={l.ritmo.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{l.ritmo.nome} · {l.ritmo.socosPorMinuto}/min</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">cerca de {l.ritmo.socosEm10s} socos</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">≈ {mil(l.kcal)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Os ritmos foram medidos em trabalho contínuo, então o descanso entre rounds entra à parte, como ficar em pé
              ({fmt(MET_DESCANSO)} MET). É por isso que doze rounds fortes, em {formataTempo(ROUNDS_FORTE.minutosTotais)}, gastam
              menos que uma hora de sparring — mas mais que {formataTempo(ROUNDS_FORTE.minutosTotais)} de aula de saco.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Boxe emagrece mais que academia?</h2>
            <p className="text-gray-300 leading-relaxed">
              Por hora, uma aula de boxe gasta mais que uma sessão comum de musculação. Mas o que a musculação entrega não é
              caloria: é massa muscular preservada enquanto você emagrece, e é ela que decide o corpo que sobra no fim. O{" "}
              <Link href="/blog/boxe-emagrece" className={ln}>artigo sobre boxe e emagrecimento</Link> mostra como encaixar os
              dois na semana — e por que o boxe sozinho deixa você mais condicionado com o mesmo peso se a{" "}
              <Link href="/blog/deficit-calorico-como-calcular" className={ln}>alimentação não acompanhar</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">rounds: N × round no ritmo + (N − 1) × descanso a {fmt(MET_DESCANSO)} MET</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_BOXE.rotuloCurto}, que {FONTE_COMPENDIO_BOXE.resumo} A calculadora usa{" "}
              {AULAS.map((a) => `${a.nome.toLowerCase()} ${fmt(a.met)}`).join(", ")} METs para a aula, e{" "}
              {RITMOS.map((r) => `${fmt(r.met)} a ${r.socosPorMinuto} socos por minuto`).join(", ")} para os rounds.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              A aula e os rounds medem coisas diferentes. O MET da aula foi medido com as pausas que a aula tem; o do ritmo,
              em trabalho contínuo. Por isso só os rounds descontam o descanso. A contagem de socos não é interpolada: a
              calculadora aponta o ritmo medido mais perto.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 22 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-boxe" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_BOXE.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/boxe-emagrece" className={ln}>Boxe emagrece? Quantas calorias queima e como usar a favor</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-futebol" className={ln}>Calculadora de Calorias no Futebol — com o revezamento de times</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-atividades" className={ln}>Calculadora de Calorias por Atividade — escada e bicicleta</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
