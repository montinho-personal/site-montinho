import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraCrossfit from "@/components/crossfit/CalculadoraCrossfit";
import {
  AULAS,
  FONTES_CROSSFIT,
  FONTE_COMPENDIO_CROSSFIT,
  MET_AQUECIMENTO,
  MET_FORCA,
  MET_PARADO,
  MET_WOD,
  NOTA_SEM_PERDA_LOCALIZADA,
  arredondaKcal,
  calcula,
  kcalPorMinuto,
  kcalSeFosseTudoWod,
  kgPorMes,
  tabelaAulas,
} from "@/lib/crossfit";
import { ESTACOES as ESTACOES_HYROX } from "@/lib/hyrox";

/**
 * A página da Calculadora de Calorias no CrossFit.
 *
 * O `crossfit-emagrece` explica por que uma aula não é uma hora de WOD.
 * Esta página faz a conta parte por parte com o peso de quem pergunta e
 * mostra de onde saem as "1.000 kcal".
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-crossfit";
const PESO = 70;

export const metadata: Metadata = {
  title: "CrossFit Queima Quantas Calorias? Por Hora, Aula e WOD",
  description:
    "Quantas calorias o CrossFit queima por hora, por minuto e por aula, com o seu peso: 30 e 50 minutos, iniciante, remo e CrossFit x musculação.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias no CrossFit | Montinho Personal Trainer",
    description:
      "Aquecimento, força e WOD: veja quanto a sua aula de CrossFit gastou com o seu peso e de onde vêm as 1.000 kcal.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias no CrossFit",
  descricao:
    "Estima o gasto calórico de uma aula de CrossFit somando aquecimento, parte de força e WOD pelo peso corporal, com o formato do WOD (AMRAP, EMOM, Tabata), e converte a frequência semanal em quilos por mês.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias no CrossFit", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const TAB = tabelaAulas();
const T = AULAS[0];
const TIPICA = calcula(PESO, T.aula, T.aquecimento, T.forca, T.wod, T.formato)!;
const TUDO = kcalSeFosseTudoWod(PESO, 60);
const PESO_MIL = Math.round(1000 / (kcalPorMinuto(MET_WOD, 1) * 60));
const EMOM = calcula(PESO, T.aula, T.aquecimento, T.forca, T.wod, "emom")!;
const TRES = kgPorMes(TIPICA, 3);
const PESOS_HORA = [60, 70, 80, 90, 100] as const;
const AULA_TIPICA = (p: number) => arredondaKcal(calcula(p, T.aula, T.aquecimento, T.forca, T.wod, T.formato)!.kcal);
const WOD_MIN = (p: number) => kcalPorMinuto(MET_WOD, p);
const AULA_50 = calcula(PESO, 50, 10, 12, 15, "continuo")!;
const INICIANTE = calcula(PESO, 60, 15, 15, 10, "continuo")!;
const MUSC_HORA = kcalPorMinuto(MET_FORCA, PESO) * 60;
const REMO = ESTACOES_HYROX.find((e) => e.id === "remo")!;
const mil = (n: number) => n.toLocaleString("pt-BR");
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const pct = (n: number) => `${Math.round(n * 100)}%`;

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias queima uma aula de CrossFit?",
    answer: `Uma aula típica de 60 minutos — aquecimento, força e um WOD de ${T.wod} minutos — gasta cerca de ${mil(TAB[0].kcal70)} kcal para ${PESO} kg e ${mil(TAB[0].kcal90)} para 90 kg. Sem força e com WOD de 30 minutos, cerca de ${mil(TAB[2].kcal70)} e ${mil(TAB[2].kcal90)}.`,
  },
  {
    question: "Quantas calorias se queima em 1 hora de CrossFit?",
    answer: `Para ${PESO} kg, uma aula de uma hora (aquecimento, força e WOD de ${T.wod} minutos) gasta cerca de ${mil(AULA_TIPICA(PESO))} kcal; com 90 kg, cerca de ${mil(AULA_TIPICA(90))} kcal. Uma hora inteira de WOD sem pausa, que nenhuma aula tem, daria ${kc(TUDO)} kcal.`,
  },
  {
    question: "Quantas calorias o CrossFit queima por minuto?",
    answer: `No WOD, cerca de ${metF(WOD_MIN(PESO))} kcal por minuto para ${PESO} kg e ${metF(WOD_MIN(90))} para 90 kg. Na aula inteira a média cai, porque aquecimento, força e explicação gastam menos.`,
  },
  {
    question: "30 minutos de CrossFit queima quantas calorias?",
    answer: `Trinta minutos de WOD contínuo gastam cerca de ${kc(WOD_MIN(PESO) * 30)} kcal para ${PESO} kg. Se forem 30 minutos de aula, com aquecimento e pausas, bem menos que isso.`,
  },
  {
    question: "50 minutos de CrossFit queima quantas calorias?",
    answer: `Uma aula de 50 minutos com aquecimento de 10, força de 12 e WOD de 15 gasta cerca de ${kc(AULA_50.kcal)} kcal para ${PESO} kg.`,
  },
  {
    question: "Quantas calorias um iniciante gasta no CrossFit?",
    answer: `Na aula de iniciante, com mais aquecimento e técnica e WOD curto, de 10 minutos, cerca de ${kc(INICIANTE.kcal)} kcal por hora para ${PESO} kg. O gasto sobe conforme o WOD fica mais longo, não com o desespero no treino.`,
  },
  {
    question: "CrossFit gasta mais calorias que musculação?",
    answer: `Por minuto de WOD, sim: ${metF(MET_WOD)} METs contra ${metF(MET_FORCA)} da musculação vigorosa. Na aula inteira, não necessariamente: com aquecimento, explicação e pausas, a aula típica gasta cerca de ${mil(AULA_TIPICA(PESO))} kcal para ${PESO} kg, perto de uma hora de musculação vigorosa (≈ ${kc(MUSC_HORA)} kcal) feita sem enrolar. O que emagrece mais é o que você mantém por anos, e a musculação preserva o músculo enquanto o peso cai.`,
  },
  {
    question: "Quantas calorias gasta o remo no CrossFit?",
    answer: `O remo ergométrico em esforço moderado vale ${metF(REMO.met)} METs no Compêndio: cerca de ${metF(kcalPorMinuto(REMO.met, PESO))} kcal por minuto para ${PESO} kg. O número do monitor do remo costuma sair diferente, porque muitos aparelhos não perguntam o seu peso.`,
  },
  {
    question: "CrossFit queima 1.000 calorias por aula?",
    answer: `Não para a maioria. Uma hora inteira de WOD sem pausa daria cerca de ${kc(TUDO)} kcal para ${PESO} kg; para chegar a 1.000, seria preciso pesar uns ${PESO_MIL} kg. A aula real tem aquecimento, força e explicação.`,
  },
  {
    question: "AMRAP, EMOM ou Tabata: qual gasta mais?",
    answer: `No mesmo tempo, o AMRAP e o For time, que não têm pausa programada. Na aula típica, trocar o AMRAP de ${T.wod} minutos por um EMOM de blocos de 40 segundos tira cerca de ${kc(TIPICA.kcal - EMOM.kcal)} kcal para ${PESO} kg.`,
  },
  {
    question: "CrossFit emagrece quantos quilos por mês?",
    answer: `Só do box, pouco: três aulas típicas por semana somam no máximo ${kg(TRES)} kg de gordura por mês para ${PESO} kg. O resto vem da alimentação — e a fome depois do WOD é o que mais trava.`,
  },
  {
    question: "CrossFit perde barriga?",
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

export default function CalculadoraCrossfitPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias no CrossFit
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias no CrossFit" caminho={CAMINHO} local="tool_top" ferramenta="crossfit" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto a sua aula gastou, parte por parte — e por que ela não gasta as mil calorias do relógio.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraCrossfit placement="calculadora-calorias-crossfit" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias uma aula de CrossFit queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Três aulas de 60 minutos, com 12 de aquecimento:</p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de uma aula de CrossFit por tipo de aula, para 70 e 90 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Aula</th>
                    <th scope="col" className={th}>70 kg</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">90 kg</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB.map((l) => (
                    <tr key={l.aula.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{l.aula.nome}</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(l.kcal70)} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {mil(l.kcal90)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>CrossFit: calorias por hora e por minuto</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              A aula típica de uma hora tem aquecimento de {T.aquecimento}, força de {T.forca} e WOD de {T.wod} minutos. Por peso:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de CrossFit por hora de aula e por minuto de WOD, por peso</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    <th scope="col" className={th}>1 hora de aula</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Por minuto de WOD</th>
                  </tr>
                </thead>
                <tbody>
                  {PESOS_HORA.map((p) => (
                    <tr key={p} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{p} kg</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(AULA_TIPICA(p))} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {metF(WOD_MIN(p))} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              Uma hora de musculação vigorosa gasta cerca de {kc(MUSC_HORA)} kcal para {PESO} kg. Para comparar com corrida, remo e
              estações de prova, veja a <Link href="/ferramentas/calculadora-calorias-hyrox" className={ln}>Calculadora de Calorias do HYROX</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O WOD é curto, mas faz metade do gasto</h2>
            <p className="text-gray-300 leading-relaxed">
              Na aula típica, o WOD ocupa {T.wod} dos 60 minutos e faz <strong className="text-white">{pct(TIPICA.kcalWod / TIPICA.kcal)} do
              gasto</strong>: cerca de {kc(TIPICA.kcalWod)} de {kc(TIPICA.kcal)} kcal para {PESO} kg. É a parte mais intensa —{" "}
              {metF(MET_WOD)} METs contra {metF(MET_FORCA)} da força e {metF(MET_AQUECIMENTO)} do aquecimento — e também a mais curta.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>De onde vêm as 1.000 calorias?</h2>
            <p className="text-gray-300 leading-relaxed">
              De tratar a aula inteira como WOD. Uma hora de circuito sem pausa daria cerca de {kc(TUDO)} kcal para {PESO} kg — e, para
              chegar a 1.000, seria preciso pesar uns {PESO_MIL} kg. O relógio também exagera, porque lê a frequência cardíaca, que sobe com a
              carga e o calor e não só com o gasto. O{" "}
              <Link href="/blog/crossfit-emagrece" className={ln}>artigo sobre CrossFit e emagrecimento</Link> explica por que esse número
              atrapalha: quem acredita nele come como se tivesse gastado mil.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">aula = aquecimento + força + WOD + resto em pé</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_CROSSFIT.rotuloCurto}, que {FONTE_COMPENDIO_CROSSFIT.resumo} O Compêndio não tem uma entrada
              chamada CrossFit; o treino em circuito vigoroso é a descrição mais próxima de um WOD. O resto da aula e a pausa dentro do EMOM
              e do Tabata valem {metF(MET_PARADO)}, que é ficar em pé.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 23 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-crossfit" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_CROSSFIT.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/crossfit-emagrece" className={ln}>CrossFit emagrece? Quantas calorias uma aula queima de verdade</Link></li>
              <li><Link href="/blog/crossfit-vs-musculacao" className={ln}>CrossFit ou musculação: qual é melhor para seu objetivo?</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-boxe" className={ln}>Calculadora de Calorias no Boxe — aula e rounds</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
