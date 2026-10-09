import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraCorda from "@/components/corda/CalculadoraCorda";
import { deTempo as caminhadaDeTempo, ritmo as ritmoCaminhada } from "@/lib/caminhada";
import {
  FONTES_CORDA,
  FONTE_COMPENDIO_CORDA,
  MET_DESCANSO,
  META_SALTOS,
  NOTA_SEM_PERDA_LOCALIZADA,
  RITMOS,
  TREINOS,
  arredondaKcal,
  calcula,
  kcalPor100Saltos,
  kcalSeFosseContinuo,
  kgPorMes,
  tabelaTreinos,
} from "@/lib/corda";
import { metDoRitmo } from "@/lib/corrida";
import { kcalPorMinuto } from "@/lib/caminhada";

/**
 * A página da Calculadora de Calorias Pulando Corda.
 *
 * O `pular-corda-emagrece` monta a progressão em blocos. Esta página faz
 * a conta dos blocos com o peso de quem pergunta — só o tempo pulando
 * conta como corda — e conta os saltos, que é como o Compêndio mede a
 * corda.
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-pular-corda";
const PESO = 70;

export const metadata: Metadata = {
  title: "Pular Corda Gasta Quantas Calorias? Calculadora por Tempo e Saltos",
  description:
    "Quantas calorias você gasta pulando corda, pelo seu peso, ritmo e blocos de treino — só o tempo pulando conta — e quantos saltos a sessão teve.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias Pulando Corda | Montinho Personal Trainer",
    description:
      "Blocos, ritmo e peso: veja quanto a sua corda gastou de verdade, quantos saltos foram e quanto custa a meta de mil saltos.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias Pulando Corda",
  descricao:
    "Estima o gasto calórico de um treino de corda a partir do peso, do ritmo e dos blocos de pulo e descanso, conta os saltos da sessão e converte a frequência semanal em quilos por mês.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias Pulando Corda", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const TAB = tabelaTreinos();
const INICIO = TREINOS[0];
const R_INICIO = calcula(PESO, "moderado", INICIO.blocos, INICIO.segundosPulando, INICIO.segundosDescanso);
const TABELA_INICIO = kcalSeFosseContinuo(PESO, "moderado", R_INICIO.minutosTotais);
const DEZ = RITMOS.map((r) => ({ r, kcal: calcula(PESO, r.id, 1, 600, 0).kcal }));
const POR100 = kcalPor100Saltos(PESO, "moderado");
const META = calcula(PESO, "moderado", TREINOS[2].blocos, TREINOS[2].segundosPulando, TREINOS[2].segundosDescanso);
const TRES = kgPorMes(META, 3);
const POR_MIN = kcalSeFosseContinuo(PESO, "moderado", 1);
const MINUTOS_CONT = [5, 15, 20, 30].map((m) => ({ m, kcal: kcalSeFosseContinuo(PESO, "moderado", m) }));
const MOD_CAM = ritmoCaminhada("moderado");
const CAMINHADA_1H = caminhadaDeTempo(60, PESO, MOD_CAM.velocidade, 0, MOD_CAM.cadencia).kcal;
const CORDA_EQUIV_MIN = Math.round(CAMINHADA_1H / POR_MIN);
const BLOCOS_30 = calcula(PESO, "moderado", 15, 60, 60);
const BLOCOS_20 = calcula(PESO, "moderado", 10, 60, 60);
const BLOCOS_60 = calcula(PESO, "moderado", 30, 60, 60);
const CORRIDA_30 = kcalPorMinuto(metDoRitmo(8).met, PESO) * 30;
const CORRIDA_10KMH_30 = kcalPorMinuto(metDoRitmo(10).met, PESO) * 30;
const mil = (n: number) => n.toLocaleString("pt-BR");
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const minF = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias gasta pular corda por 10 minutos?",
    answer: `Pulando sem parar, para ${PESO} kg: cerca de ${kc(DEZ[0].kcal)} kcal em ritmo lento, ${kc(DEZ[1].kcal)} em ritmo moderado e ${kc(DEZ[2].kcal)} em ritmo rápido. Quase ninguém pula 10 minutos direto — em blocos, conte só o tempo pulando.`,
  },
  {
    question: "Quantas calorias gastam mil saltos de corda?",
    answer: `Cerca de ${kc(POR100 * (META_SALTOS / 100))} kcal para ${PESO} kg, em ritmo moderado — uns nove minutos pulando. Cada 100 saltos custam perto de ${kg(POR100)} kcal.`,
  },
  {
    question: "Pular corda gasta quantas calorias por minuto?",
    answer: `Para ${PESO} kg em ritmo moderado, cerca de ${kc(POR_MIN)} kcal por minuto pulando. Em minutos contínuos: ${MINUTOS_CONT.map((x) => `${x.m} min ≈ ${kc(x.kcal)} kcal`).join("; ")}. Na prática quase ninguém pula 30 minutos sem parar, e é por isso que a calculadora conta os blocos e o descanso.`,
  },
  {
    question: "100, 200 ou 500 pulos de corda queimam quantas calorias?",
    answer: `Cerca de ${kg(POR100)} kcal a cada 100 saltos para ${PESO} kg em ritmo moderado: 200 saltos ≈ ${kc(POR100 * 2)} kcal e 500 saltos ≈ ${kc(POR100 * 5)} kcal. Dar 500 pulos todos os dias é um bom hábito para condicionamento, desde que sem dor nas panturrilhas, tornozelos ou joelhos.`,
  },
  {
    question: "Quanto tempo pulando corda equivale a 1 hora de caminhada?",
    answer: `Uma hora de caminhada moderada gasta cerca de ${kc(CAMINHADA_1H)} kcal para ${PESO} kg; pulando corda em ritmo moderado, isso dá uns ${CORDA_EQUIV_MIN} minutos pulando de fato, sem contar o descanso. Corda gasta mais por minuto, e também gasta mais que correr devagar; comparada a corrida em ritmo forte, fica parecida.`,
  },
  {
    question: "Pular corda é bom para diabéticos? E na gravidez?",
    answer: "Para quem tem diabetes, exercício regular ajuda o controle da glicose, e a corda pode entrar se os pés e as articulações estiverem bem; combine com o médico, principalmente quem usa insulina. Na gravidez, por ser impacto e salto repetido, a decisão é do obstetra; muitas vezes ele indica atividades de menor impacto.",
  },
  {
    question: "Por que a calculadora dá menos que a tabela?",
    answer: `Porque a tabela multiplica pelo tempo de relógio. No começo da progressão, ${INICIO.blocos} blocos de ${INICIO.segundosPulando} segundos com ${INICIO.segundosDescanso} de descanso, a tabela daria cerca de ${kc(TABELA_INICIO)} kcal para ${PESO} kg. Você pulou ${minF(R_INICIO.minutosPulando)} minutos, e o treino gastou cerca de ${kc(R_INICIO.kcal)}.`,
  },
  {
    question: "Pular corda emagrece quantos quilos por mês?",
    answer: `Só da corda, pouco: três treinos por semana na meta do artigo — ${TREINOS[2].blocos} blocos de 1 minuto — somam no máximo ${kg(TRES)} kg de gordura por mês para ${PESO} kg. O resto vem da alimentação.`,
  },
  {
    question: "Pular corda perde barriga?",
    answer: NOTA_SEM_PERDA_LOCALIZADA,
  },
  {
    question: "30 minutos de pular corda queimam quantas calorias?",
    answer: `Depende de quanto desse tempo você pula de fato. Pulando os 30 minutos sem parar em ritmo moderado, seriam cerca de ${kc(kcalSeFosseContinuo(PESO, "moderado", 30))} kcal para ${PESO} kg — quase ninguém aguenta. Num treino real de 30 minutos, alternando 1 minuto pulando com 1 minuto de descanso, o gasto fica perto de ${kc(BLOCOS_30.kcal)} kcal. Em 20 minutos no mesmo esquema, cerca de ${kc(BLOCOS_20.kcal)} kcal.`,
  },
  {
    question: "1 hora de pular corda queima quantas calorias?",
    answer: `Uma hora contínua daria perto de ${kc(kcalSeFosseContinuo(PESO, "moderado", 60))} kcal para ${PESO} kg, mas é um número teórico: o impacto e o fôlego não deixam. Uma hora de treino com metade do tempo pulando, em blocos de 1 minuto, fica em torno de ${kc(BLOCOS_60.kcal)} kcal — e já é um volume alto para tornozelo e panturrilha.`,
  },
  {
    question: "Pular corda queima mais calorias que correr?",
    answer: `Por minuto pulando, sim: em ritmo moderado, para ${PESO} kg, a corda gasta cerca de ${kc(POR_MIN * 30)} kcal em 30 minutos contínuos, contra ${kc(CORRIDA_30)} kcal correndo a 8 km/h e ${kc(CORRIDA_10KMH_30)} a 10 km/h. Mas a corrida se sustenta por 30 minutos seguidos e a corda quase nunca: num treino real de corda de 30 minutos, com descansos, o gasto fica perto de ${kc(BLOCOS_30.kcal)} kcal — menos que a corrida contínua.`,
  },
  {
    question: "Pular corda emagrece rápido?",
    answer: "Gasta muito por minuto, então rende em pouco tempo. Mas emagrecer rápido depende do déficit da semana, e a corda tem um limite prático: o impacto. Quem começa com volume alto costuma parar por dor na canela ou no tornozelo. Progressão em blocos, junto com a alimentação, emagrece mais do que uma semana heroica.",
  },
  {
    question: "Pular corda tonifica os músculos?",
    answer: "Fortalece panturrilha, tornozelo e ombros pela repetição, e melhora coordenação e condicionamento. Para ganhar massa ou força de forma visível, não substitui a musculação com carga; o que costuma dar o aspecto de “definido” é a perda de gordura somada ao treino de força.",
  },
  {
    question: "Como pular corda sem se machucar?",
    answer: "Saltos baixos, na ponta dos pés, com os joelhos levemente dobrados; o giro vem dos punhos, não dos braços. Use tênis com amortecimento e piso que absorva um pouco o impacto — madeira ou emborrachado, em vez de cimento. E comece em blocos curtos, com descanso maior que o tempo pulando, aumentando o volume aos poucos.",
  },
  {
    question: "Quem tem pressão alta pode pular corda?",
    answer: "Com a pressão controlada e liberação do médico, muitas pessoas podem. Mas a corda é exercício intenso desde o primeiro minuto, então quem tem hipertensão costuma começar por atividades moderadas, como caminhada ou bicicleta, e só depois incluir corda em blocos curtos. Dor no peito, tontura ou falta de ar fora do normal são motivo para parar.",
  },
  {
    question: "Quem tem hérnia de disco pode pular corda?",
    answer: "É uma decisão para o médico ou fisioterapeuta que acompanha você: o impacto repetido chega à coluna a cada aterrissagem. Muitas pessoas com hérnia preferem opções sem impacto, como bicicleta, elíptico ou natação. Se a corda for liberada, saltos baixos e piso que amorteça fazem diferença; dor que irradia para a perna é sinal para parar.",
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

export default function CalculadoraCordaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias Pulando Corda
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias Pulando Corda" caminho={CAMINHO} local="tool_top" ferramenta="corda" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto o seu treino de corda gastou, contando só o tempo pulando — e quantos saltos ele teve.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraCorda placement="calculadora-calorias-pular-corda" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias um treino de corda queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              A progressão do artigo sobre corda, em ritmo moderado:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de um treino de corda em blocos, para 70 e 90 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Treino</th>
                    <th scope="col" className={th}>70 kg</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">90 kg</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB.map((l) => (
                    <tr key={l.treino.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">
                        {l.treino.nome}: {l.treino.blocos} × {l.treino.segundosPulando} s, {l.treino.segundosDescanso} s de descanso ({minF(l.minutosTotais)} min)
                      </td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(l.kcal70)} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {mil(l.kcal90)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Por que a conta dá menos que a tabela?</h2>
            <p className="text-gray-300 leading-relaxed">
              A tabela de revista multiplica o gasto da corda pelo tempo de relógio. No começo da progressão, {INICIO.blocos} blocos de{" "}
              {INICIO.segundosPulando} segundos com {INICIO.segundosDescanso} de descanso, isso daria cerca de {kc(TABELA_INICIO)} kcal
              para {PESO} kg. Mas você pulou {minF(R_INICIO.minutosPulando)} minutos, e o resto do tempo ficou parado recuperando o
              fôlego, a {metF(MET_DESCANSO)} MET. O treino gastou <strong className="text-white">cerca de {kc(R_INICIO.kcal)} kcal</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto gastam mil saltos?</h2>
            <p className="text-gray-300 leading-relaxed">
              Para {PESO} kg, em ritmo moderado, cada 100 saltos custam cerca de {kg(POR100)} kcal, e a meta de {mil(META_SALTOS)} saltos
              por dia gasta <strong className="text-white">cerca de {kc(POR100 * (META_SALTOS / 100))} kcal</strong>. O ritmo rápido gasta
              mais por minuto, mas menos por salto: cada salto é mais baixo e mais curto. O{" "}
              <Link href="/blog/pular-corda-emagrece" className={ln}>artigo sobre pular corda e emagrecimento</Link> mostra como chegar lá
              sem canelite.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">treino = tempo pulando × MET da corda + descanso × {metF(MET_DESCANSO)}</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_CORDA.rotuloCurto}, que {FONTE_COMPENDIO_CORDA.resumo} Os saltos saem de uma cadência
              típica de cada ritmo: {RITMOS.map((r) => r.saltosPorMinuto).join(", ")} por minuto.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 23 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-pular-corda" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_CORDA.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/pular-corda-emagrece" className={ln}>Pular corda emagrece? Calorias, benefícios e como começar</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-boxe" className={ln}>Calculadora de Calorias no Boxe — aula e rounds</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-atividades" className={ln}>Calculadora de Calorias por Atividade — escada e bicicleta</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
