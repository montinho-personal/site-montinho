import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraSpinning from "@/components/spinning/CalculadoraSpinning";
import {
  FAIXAS,
  FONTES_SPINNING,
  FONTE_COMPENDIO_SPINNING,
  MET_AULA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_PADRAO,
  WATTS_MAX,
  WATTS_MIN,
  arredondaKcal,
  calcula,
  faixaDe,
  kjDoTrabalho,
  semana,
  tabelaPorFaixa,
  tabelaPorPeso,
} from "@/lib/spinning";
import { metDoEsforco } from "@/lib/bicicleta";

/**
 * A página da Calculadora de Calorias no Spinning.
 *
 * O `spinning-emagrece` recebia buscas de "quantas calorias uma aula de
 * spinning queima" e respondia com faixas largas por "intensidade". A bike
 * de spinning mede a intensidade em watts, e o Compêndio mediu a bike por
 * watts: esta página junta as duas coisas.
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-spinning";

export const metadata: Metadata = {
  title: "Spinning Gasta Quantas Calorias? Calculadora por Aula e Watts",
  description:
    "Quantas calorias a sua aula de spinning gasta, pela potência em watts que a bike mostra ou pela aula, com o seu peso — e por que o visor dá outro número.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias no Spinning | Montinho Personal Trainer",
    description:
      "Digite os watts que a bike mostrou e veja quanto a aula gastou com o seu peso — e por que o visor da bike dá outro número.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias no Spinning",
  descricao:
    "Estima o gasto calórico de uma aula de spinning a partir do peso corporal, do tempo e da potência média em watts, pelas faixas do Compêndio de Atividades Físicas, e compara com o número do visor da bike.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias no Spinning", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const AULA = calcula(PESO_PADRAO, 45, MET_AULA);
const TAB_FAIXA = tabelaPorFaixa(45);
const TAB_PESO = tabelaPorPeso(45);
const EX_W = 130;
const EX_FAIXA = faixaDe(EX_W)!;
const EX_MET = calcula(PESO_PADRAO, 45, EX_FAIXA.met);
const EX_KJ = kjDoTrabalho(EX_W, 45);
const TRES = semana(AULA, 3);
const MIN_AULA = [30, 40, 45, 50].map((m) => ({ m, kcal: calcula(PESO_PADRAO, m, MET_AULA).kcal }));
const M20 = calcula(PESO_PADRAO, 20, MET_AULA);
const M10 = calcula(PESO_PADRAO, 10, MET_AULA);
const M60 = calcula(PESO_PADRAO, 60, MET_AULA);
const ERGO_45 = calcula(PESO_PADRAO, 45, metDoEsforco("moderado"));
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const mil = (n: number) => n.toLocaleString("pt-BR");
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const L90 = TAB_PESO.find((l) => l.peso === 90)!;

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias uma aula de spinning queima?",
    answer: `Uma aula de 45 minutos gasta cerca de ${kc(AULA.kcal)} kcal para quem pesa ${PESO_PADRAO} kg e ${mil(L90.aula)} kcal para quem pesa 90 kg. Se a sua bike mostra watts, a conta fica mais precisa: a calculadora usa a faixa de potência que o Compêndio de Atividades Físicas mediu.`,
  },
  {
    question: "Quantas calorias gasta 1 hora de spinning?",
    answer: `Para ${PESO_PADRAO} kg, cerca de ${kc(calcula(PESO_PADRAO, 60, MET_AULA).kcal)} kcal numa aula comum. Com a bike marcando de 101 a 160 W de média, cerca de ${kc(calcula(PESO_PADRAO, 60, 8.8).kcal)} kcal.`,
  },
  {
    question: "30, 40, 45 ou 50 minutos de spinning queimam quantas calorias?",
    answer: `Numa aula comum, para ${PESO_PADRAO} kg: ${MIN_AULA.map((x) => `${x.m} min ≈ ${arredondaKcal(x.kcal)} kcal`).join("; ")}. Se a bike mostra watts, a calculadora usa a potência e fica mais precisa que a média da aula.`,
  },
  {
    question: "O que emagrece mais, spinning ou musculação?",
    answer: "Por minuto, o spinning gasta mais calorias. Mas quem emagrece é o déficit da semana, e a musculação é o que garante que o peso perdido seja gordura e não músculo. O melhor resultado vem da combinação das duas, com a alimentação ajustada.",
  },
  {
    question: "O que gasta mais calorias, spinning ou esteira?",
    answer: "Depende da intensidade. Uma aula de spinning comum gasta mais que caminhar na esteira no plano e fica parecida com corrida em ritmo moderado. Com esteira inclinada ou corrida rápida, a esteira pode passar o spinning.",
  },
  {
    question: "Pode fazer spinning todos os dias? Quantas vezes por semana?",
    answer: "Dá para pedalar todos os dias em intensidade leve, mas aulas intensas todo dia atrapalham a recuperação e a musculação. Para a maioria das pessoas, 2 a 4 aulas por semana, junto com o treino de força, é um bom equilíbrio. Spinning emagrece quantos quilos por semana depende do déficit total, não da aula.",
  },
  {
    question: "As calorias do visor da bike são confiáveis?",
    answer:
      "São uma estimativa, e muitas vezes feita por outra conta. Vários visores calculam pelo trabalho nos pedais em quilojoules, e 1 kJ de trabalho vale mais ou menos 1 kcal gasta. Essa conta não usa o seu peso: quem pesa mais gasta mais do que ela mostra. A calculadora compara o visor com a conta pelo seu peso.",
  },
  {
    question: "Quantos watts é bom numa aula de spinning?",
    answer: `Não há um número bom, há o seu número subindo. Como referência, de 101 a 160 W de média é esforço vigoroso no Compêndio, e manter de 161 a 200 W por uma aula inteira já é ritmo de quem pedala bem. Use a média do fim da aula, não o pico de um tiro.`,
  },
  {
    question: "Spinning emagrece quantos quilos por mês?",
    answer: `Só das aulas, pouco. Para ${PESO_PADRAO} kg, três aulas de 45 minutos por semana somam no máximo ${kg(TRES.kgMes)} kg de gordura por mês. O que passa disso vem da alimentação.`,
  },
  {
    question: "Spinning afina a coxa?",
    answer: NOTA_SEM_PERDA_LOCALIZADA,
  },
  {
    question: "20 minutos de spinning queimam quantas calorias?",
    answer: `Em ritmo de aula, cerca de ${kc(M20.kcal)} kcal para ${PESO_PADRAO} kg; em 10 minutos, uns ${kc(M10.kcal)}. Vinte minutos já cabem num dia corrido e somam no fim da semana — a calculadora acima ajusta pelo seu peso e pelos watts, se a bike mostrar.`,
  },
  {
    question: "Quanto tempo dura uma aula de spinning?",
    answer: `Costuma ter de 40 a 50 minutos, com aquecimento no começo e volta à calma no fim. A calculadora usa 45 minutos como referência: cerca de ${kc(AULA.kcal)} kcal para ${PESO_PADRAO} kg em ritmo de aula.`,
  },
  {
    question: "Spinning ou bicicleta ergométrica: qual gasta mais?",
    answer: `No ritmo típico de cada um, o spinning: 45 minutos de aula gastam cerca de ${kc(AULA.kcal)} kcal para ${PESO_PADRAO} kg, contra ${kc(ERGO_45.kcal)} kcal na ergométrica em esforço moderado. A diferença vem da intensidade — subidas, sprints e carga mais alta —, não do aparelho. Na ergométrica, no mesmo esforço, o gasto é o mesmo.`,
  },
  {
    question: "Quantos minutos de spinning por dia?",
    answer: "Não precisa ser todo dia. Como referência de saúde, a OMS recomenda de 150 a 300 minutos de atividade aeróbica moderada por semana — três ou quatro aulas de 45 minutos cobrem isso, e o spinning, por ser intenso, conta com folga. Para quem também faz musculação, 2 ou 3 aulas por semana costumam encaixar sem atrapalhar a recuperação das pernas.",
  },
  {
    question: "É bom pedalar 1 hora por dia?",
    answer: `Dá, se o corpo estiver se recuperando bem: uma hora em ritmo de aula gasta perto de ${kc(M60.kcal)} kcal para ${PESO_PADRAO} kg. O cuidado é com o volume somado — pernas sempre cansadas, sono ruim e treino de musculação piorando são sinais de que é demais. Alternar dias fortes com dias leves rende mais que uma hora no limite todo dia.`,
  },
  {
    question: "O spinning afina a cintura?",
    answer: NOTA_SEM_PERDA_LOCALIZADA + " O spinning entra como um gasto alto por aula; a cintura acompanha a perda de gordura do corpo todo.",
  },
  {
    question: "Como fica o corpo de quem faz spinning?",
    answer: "O condicionamento melhora rápido, e as pernas ficam mais resistentes. Se a alimentação acompanhar, a gordura cai aos poucos; se a pessoa também faz musculação, o desenho do corpo aparece mais. Só o spinning raramente deixa a perna “grossa” — o estímulo é de resistência, não de força máxima.",
  },
  {
    question: "Quem tem hérnia de disco pode fazer spinning?",
    answer: "É decisão do médico ou fisioterapeuta que acompanha você. Muitas pessoas com hérnia pedalam bem, mas a posição inclinada sobre o guidão e as fases em pé na bike podem incomodar. Guidão mais alto, ficar sentado nas subidas e parar se a dor irradiar para a perna são os ajustes mais comuns.",
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

export default function CalculadoraSpinningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias no Spinning
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias no Spinning" caminho={CAMINHO} local="tool_top" ferramenta="spinning" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto a sua aula gastou de verdade, pelos watts que a bike mostrou — e por que o visor dá outro número.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraSpinning placement="calculadora-calorias-spinning" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias uma aula de spinning queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Uma aula de 45 minutos custa cerca de <strong className="text-white">{kc(AULA.kcal)} kcal</strong> para quem pesa{" "}
              {PESO_PADRAO} kg. É a entrada de aula de spinning do Compêndio, {metF(MET_AULA)} METs, que já inclui subidas, tiros e
              recuperações. Por peso:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em uma aula de spinning de 45 minutos, por peso</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Aula de 45 min</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_PESO.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">≈ {mil(l.aula)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Pelos watts que a bike mostra</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              A maioria das bikes de spinning mostra a potência em watts, e o Compêndio mediu a bicicleta ergométrica por faixa de
              potência. Com o número médio da aula, a conta deixa de depender de você achar que foi “moderado” ou “forte”.
              Quarenta e cinco minutos:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto de 45 minutos de spinning por faixa de watts, para 70 e 90 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Potência média</th>
                    <th scope="col" className={th}>METs</th>
                    <th scope="col" className={th}>70 kg</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">90 kg</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_FAIXA.map((l) => (
                    <tr key={l.faixa.codigo} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.faixa.de} a {l.faixa.ate} W</td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums">{metF(l.faixa.met)}</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(l.kcal70)} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {mil(l.kcal90)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              As faixas não são interpoladas: 100 W e 101 W dão números diferentes porque caem em entradas diferentes da tabela.
              Abaixo de {WATTS_MIN} W ou acima de {WATTS_MAX} W o Compêndio não mediu, e a calculadora não inventa.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Por que o visor da bike dá outro número</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Muitos visores não usam o seu peso. Eles calculam pelo trabalho feito nos pedais: potência vezes tempo, em
              quilojoules. E existe uma coincidência útil — o corpo converte em pedalada cerca de um quarto da energia que queima,
              e 1 kcal são 4,184 kJ. As duas coisas quase se cancelam, e <strong className="text-white">1 kJ de trabalho vale mais
              ou menos 1 kcal gasta</strong>.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Exemplo: {EX_W} W de média por 45 minutos são {mil(Math.round(EX_KJ))} kJ, e o visor tende a mostrar perto de{" "}
              {mil(Math.round(EX_KJ))} kcal. Pelo Compêndio, para {PESO_PADRAO} kg, a mesma aula dá cerca de {kc(EX_MET.kcal)} kcal. Nenhum
              dos dois é medição, e a diferença cresce com o peso: quem pesa mais gasta mais do que o trabalho nos pedais mostra.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Spinning emagrece quantos quilos?</h2>
            <p className="text-gray-300 leading-relaxed">
              Só das aulas, pouco: três aulas de 45 minutos por semana somam no máximo {kg(TRES.kgMes)} kg de gordura por mês para{" "}
              {PESO_PADRAO} kg. O{" "}
              <Link href="/blog/spinning-emagrece" className={ln}>artigo sobre spinning e emagrecimento</Link> mostra por que o
              resultado depende do conjunto — e por que o lanche “merecido” depois da aula costuma apagar a conta.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">trabalho (kJ) = watts × minutos × 60 ÷ 1.000</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_SPINNING.rotuloCurto}, que {FONTE_COMPENDIO_SPINNING.resumo} As faixas usadas:{" "}
              {FAIXAS.map((f) => `${f.de}–${f.ate} W, ${metF(f.met)}`).join("; ")}.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 23 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-spinning" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_SPINNING.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/spinning-emagrece" className={ln}>Spinning emagrece? Calorias, benefícios e como aproveitar</Link></li>
              <li><Link href="/blog/bicicleta-emagrece" className={ln}>Bicicleta emagrece? Ergométrica, spinning e pedal na rua</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-eliptico" className={ln}>Calculadora de Calorias do Elíptico — com a conferência do visor</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
