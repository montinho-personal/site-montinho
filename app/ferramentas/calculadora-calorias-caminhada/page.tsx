import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraCaminhada from "@/components/caminhada/CalculadoraCaminhada";
import {
  FONTES_CAMINHADA,
  FONTE_COMPENDIO_CAMINHADA,
  FONTE_HALL,
  FONTE_TUDOR_LOCKE,
  KCAL_POR_KG_GORDURA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_PADRAO,
  RITMOS,
  arredondaKcal,
  arredondaPassos,
  deDistancia,
  kcalPorMinuto,
  deKcal,
  dePassos,
  deTempo,
  formataKm,
  formataTempo,
  kcalLiquida,
  metDaInclinacao,
  ritmo,
  simulacaoUmQuilo,
  tabelaPorInclinacao,
  tabelaPorPeso,
  tabelaPorRitmo,
  tabelaPorTempo,
} from "@/lib/caminhada";
import { metDoRitmo } from "@/lib/corrida";

/**
 * A página da Calculadora de Calorias da Caminhada.
 *
 * POR QUE PÁGINA PRÓPRIA
 *
 * O cluster de caminhada tem seis artigos e nenhum deles é a resposta para
 * "30 minutos de esteira perde quantas calorias" — eles respondem "quanto
 * tempo?" e "emagrece?", em prosa, com a conta para uma pessoa genérica. O
 * Search Console mostrava o site entre a posição 28 e a 44 para essas
 * buscas numéricas: achado, mas não escolhido. A ferramenta é a página que
 * responde com o peso de quem pergunta.
 *
 * Os artigos seguem com canonical próprio. Dois embutem a calculadora
 * (lib/caminhada.ts diz quais e por quê) e linkam para cá; os outros
 * recebem convite. Sem link, a página não ranqueia nem pelo próprio nome —
 * lib/ferramentas/canonica.ts documenta o que aconteceu da última vez.
 *
 * O EXEMPLO FIXO EXISTE PORQUE O ROBÔ NÃO DIGITA PESO
 *
 * Sem os números resolvidos em HTML — 30 minutos, a tabela por peso, a
 * tabela por tempo, a inclinação do 12-3-30, os 10 mil passos — a página
 * seria um formulário vazio para o Google e para quem chegou sem vontade
 * de preencher nada.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-caminhada";

export const metadata: Metadata = {
  title: "Calorias da Caminhada: Calculadora por Tempo, Km e Passos",
  description:
    "Calcule quantas calorias a sua caminhada gasta por tempo, distância ou passos, com o seu peso e o seu ritmo — na rua ou na esteira, com inclinação.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias da Caminhada | Montinho Personal Trainer",
    description:
      "Quantas calorias a sua caminhada gasta por tempo, distância ou passos — calculado com o seu peso, o seu ritmo e a inclinação da esteira.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias da Caminhada",
  descricao:
    "Estima o gasto calórico de uma caminhada a partir do peso corporal, do ritmo, do tempo, da distância ou dos passos, incluindo velocidade e inclinação de esteira, e o tempo necessário para uma meta de calorias.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias da Caminhada", item: `${SITE_URL}${CAMINHO}` },
  ],
};

/* ── Os exemplos resolvidos. Mesmo motor da calculadora, nada recalculado à mão. ── */

const MOD = ritmo("moderado");
const EX_30 = deTempo(30, PESO_PADRAO, MOD.velocidade, 0, MOD.cadencia);
const EX_60 = deTempo(60, PESO_PADRAO, MOD.velocidade, 0, MOD.cadencia);
const EX_120 = deTempo(120, PESO_PADRAO, MOD.velocidade, 0, MOD.cadencia);
const TABELA_KM = [1, 3, 5, 7, 10].map((km) => ({ km, r: deDistancia(km, PESO_PADRAO, MOD.velocidade, 0, MOD.cadencia) }));
const EX_30_LIQ = kcalLiquida(EX_30, PESO_PADRAO);
const TABELA_PESO = tabelaPorPeso(30, MOD.velocidade, 0);
const TABELA_TEMPO = tabelaPorTempo(PESO_PADRAO, MOD.velocidade, 0);
const TABELA_RITMO = tabelaPorRitmo(PESO_PADRAO, 30);
const TABELA_INCL = tabelaPorInclinacao(PESO_PADRAO, 30, 4.8);
const EX_12_3_30 = deTempo(30, PESO_PADRAO, 4.8, 12, MOD.cadencia);
const EX_10MIL = dePassos(10000, PESO_PADRAO, MOD.velocidade, 0, MOD.cadencia);
const EX_300 = deKcal(300, PESO_PADRAO, MOD.velocidade, 0, MOD.cadencia);
const EX_500 = deKcal(500, PESO_PADRAO, MOD.velocidade, 0, MOD.cadencia);
const UM_QUILO = simulacaoUmQuilo(PESO_PADRAO, MOD.velocidade, 0, MOD.cadencia);
const POR_MIN = EX_30.kcal / 30;
const LEVE = ritmo("leve");
const RAPIDO = ritmo("rapido");
const H1 = (r: typeof MOD) => deTempo(60, PESO_PADRAO, r.velocidade, 0, r.cadencia);
const KM5 = (r: typeof MOD) => deDistancia(5, PESO_PADRAO, r.velocidade, 0, r.cadencia);
const MIN = (m: number) => deTempo(m, PESO_PADRAO, MOD.velocidade, 0, MOD.cadencia);
const KG_MES_30 = (kcalLiquida(EX_30, PESO_PADRAO) * 30) / KCAL_POR_KG_GORDURA;
const CORRIDA_30 = kcalPorMinuto(metDoRitmo(8).met, PESO_PADRAO) * 30;
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias 30 minutos de caminhada queimam?",
    answer: `Para uma pessoa de ${PESO_PADRAO} kg em ritmo moderado (cerca de 5 km/h), aproximadamente ${arredondaKcal(EX_30.kcal)} kcal. O número muda com o peso: alguém de 50 kg fica perto de ${TABELA_PESO[0].kcal} kcal, e alguém de 100 kg, perto de ${TABELA_PESO[5].kcal} kcal nos mesmos 30 minutos.`,
  },
  {
    question: "1 hora de esteira queima quantas calorias?",
    answer: `Caminhando a 5 km/h no plano, uma pessoa de ${PESO_PADRAO} kg gasta cerca de ${arredondaKcal(EX_60.kcal)} kcal em uma hora. Com inclinação o número sobe bastante: a 4,8 km/h com 12% (o 12-3-30), 30 minutos já passam de ${arredondaKcal(EX_12_3_30.kcal)} kcal.`,
  },
  {
    question: "10 mil passos queimam quantas calorias?",
    answer: `Em ritmo moderado, 10 mil passos levam cerca de ${formataTempo(EX_10MIL.minutos)} e representam aproximadamente ${arredondaKcal(EX_10MIL.kcal)} kcal para quem pesa ${PESO_PADRAO} kg. A conta usa a cadência (cerca de 100 passos por minuto), não a passada, que varia com a altura.`,
  },
  {
    question: "Quanto tempo de caminhada para queimar 300 calorias?",
    answer: `Para ${PESO_PADRAO} kg em ritmo moderado, cerca de ${formataTempo(EX_300.minutos)} — em torno de ${formataKm(EX_300.km)}. Quanto maior o peso ou o ritmo, menos tempo leva, porque o gasto por minuto é proporcional aos dois.`,
  },
  {
    question: "Caminhada inclinada gasta mais calorias?",
    answer: `Gasta, e muito. A inclinação acrescenta o custo de subir ao custo de andar: a 4,8 km/h, 12% de inclinação somam cerca de ${fmt(metDaInclinacao(4.8, 12))} METs ao ritmo, o que mais que dobra o gasto em relação ao plano. É por isso que o método 12-3-30 rende — não por mágica, por física.`,
  },
  {
    question: "Caminhar 1 km, 5 km ou 10 km gasta quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg em ritmo moderado: 1 km, cerca de ${arredondaKcal(TABELA_KM[0].r.kcal)} kcal; 5 km, cerca de ${arredondaKcal(TABELA_KM[2].r.kcal)} kcal; 10 km, cerca de ${arredondaKcal(TABELA_KM[4].r.kcal)} kcal. A tabela por distância desta página mostra também 3 e 7 km.`,
  },
  {
    question: "2 horas de caminhada queimam quantas calorias?",
    answer: `Em ritmo moderado, cerca de ${arredondaKcal(EX_120.kcal)} kcal para quem pesa ${PESO_PADRAO} kg. Acima de 2 horas, o ritmo costuma cair, e o gasto real tende a ficar abaixo da conta.`,
  },
  {
    question: "Quanto tempo tenho que caminhar para perder 500 calorias?",
    answer: `Para ${PESO_PADRAO} kg em ritmo moderado, cerca de ${formataTempo(EX_500.minutos)} (em torno de ${formataKm(EX_500.km)}). Com inclinação ou peso maior, leva menos tempo.`,
  },
  {
    question: "Quanto tempo de caminhada para quem tem diabetes?",
    answer: "A recomendação geral da Organização Mundial da Saúde para adultos, inclusive com doenças crônicas como diabetes, é de 150 a 300 minutos por semana de atividade moderada, como caminhada rápida. Quem tem diabetes deve combinar a meta com o médico, principalmente se usa insulina ou remédio que pode baixar a glicose durante o exercício.",
  },
  {
    question: "Caminhada queima quantas calorias por minuto?",
    answer: `Para ${PESO_PADRAO} kg em ritmo moderado, cerca de ${fmt(POR_MIN)} kcal por minuto: uns ${arredondaKcal(POR_MIN * 15)} kcal em 15 minutos, ${arredondaKcal(POR_MIN * 20)} em 20 e ${arredondaKcal(POR_MIN * 40)} em 40. Caminhada leve gasta menos; rápida ou com subida, mais.`,
  },
  {
    question: "Quanto tenho que caminhar para perder 1 quilo?",
    answer: `Um quilo de gordura guarda cerca de 7.700 kcal: para ${PESO_PADRAO} kg em ritmo moderado, seriam perto de ${formataTempo(UM_QUILO.minutos)} de caminhada, ou ${formataKm(UM_QUILO.km)}. É conta teórica: a caminhada soma ao déficit da semana, e quem decide o resultado é o conjunto com a alimentação.`,
  },
  {
    question: "Qual emagrece mais, academia ou caminhada?",
    answer: "Por hora, a caminhada gasta parecido com uma sessão de musculação. Mas a musculação preserva o músculo enquanto você emagrece, e a caminhada é fácil de fazer todo dia. O melhor é combinar os dois; se for escolher um, fique com o que você consegue manter.",
  },
  {
    question: "Caminhar emagrece?",
    answer:
      "Ajuda como qualquer atividade que aumenta o gasto, e tem a vantagem rara de ser fácil de repetir todo dia. O que ela não faz é resolver sozinha: o resultado depende do balanço energético ao longo de semanas, não de uma caminhada isolada. Trinta minutos por dia somam algo real no mês — desde que o que acontece nas outras 23 horas e meia não desfaça a conta.",
  },
  {
    question: "Caminhar todo dia perde barriga?",
    answer: NOTA_SEM_PERDA_LOCALIZADA + " A caminhada entra como uma das fontes de gasto do dia, ao lado da musculação e da alimentação — e é a combinação que decide.",
  },
  {
    question: "Esteira ou rua: qual gasta mais calorias?",
    answer:
      "Na mesma velocidade e no plano, o gasto é parecido; a rua costuma custar um pouco mais por causa do vento, do piso irregular e das pequenas subidas. A esteira ganha quando entra a inclinação, que na rua depende de existir ladeira. A calculadora trata os dois do mesmo jeito: velocidade e inclinação decidem, não o lugar.",
  },
  {
    question: "Esse número é o que a caminhada acrescenta ao meu dia?",
    answer: `Não exatamente. O número é bruto: inclui o que você gastaria parado nesse tempo. Para ${PESO_PADRAO} kg, 30 minutos moderados somam cerca de ${arredondaKcal(EX_30.kcal)} kcal brutas, e o que a caminhada acrescenta de fato é em torno de ${arredondaKcal(EX_30_LIQ)} kcal. A metodologia da calculadora mostra os dois.`,
  },
  {
    question: "Quem está acima do peso pode caminhar todo dia?",
    answer:
      "Pode, e é uma das melhores portas de entrada — o impacto é baixo e o gasto por minuto é maior justamente porque o corpo move mais massa. Vale começar sem inclinação e com tempo que não deixe dor no dia seguinte; se houver dor articular ou condição cardiovascular, converse antes com quem acompanha você.",
  },
  {
    question: "1 hora de caminhada queima quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg, no plano: cerca de ${arredondaKcal(H1(LEVE).kcal)} kcal em ritmo leve (${LEVE.velocidade} km/h), ${arredondaKcal(H1(MOD).kcal)} em ritmo moderado (${MOD.velocidade} km/h) e ${arredondaKcal(H1(RAPIDO).kcal)} em caminhada rápida (${RAPIDO.velocidade} km/h). Em 3 horas no ritmo moderado, perto de ${arredondaKcal(MIN(180).kcal)} kcal, se o ritmo se mantiver.`,
  },
  {
    question: "20 ou 40 minutos de caminhada queimam quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg em ritmo moderado, cerca de ${arredondaKcal(MIN(20).kcal)} kcal em 20 minutos e ${arredondaKcal(MIN(40).kcal)} em 40. Em 10 minutos, uns ${arredondaKcal(MIN(10).kcal)}; em 50, cerca de ${arredondaKcal(MIN(50).kcal)}. Apertar o passo ou incluir subida aumenta esses números.`,
  },
  {
    question: "5 km de caminhada queimam quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg, cerca de ${arredondaKcal(KM5(MOD).kcal)} kcal em ritmo moderado (uns ${formataTempo(KM5(MOD).minutos)}) e ${arredondaKcal(KM5(RAPIDO).kcal)} kcal em caminhada rápida (uns ${formataTempo(KM5(RAPIDO).minutos)}). Por distância, o ritmo muda pouco o total: andar mais rápido gasta mais por minuto, mas termina antes.`,
  },
  {
    question: "30 minutos de caminhada equivalem a quantos quilômetros?",
    answer: `Em ritmo moderado, cerca de ${formataKm(EX_30.km)}. Em passo leve, perto de ${formataKm((LEVE.velocidade * 30) / 60)}; em caminhada rápida, uns ${formataKm((RAPIDO.velocidade * 30) / 60)}.`,
  },
  {
    question: "Quantos quilos dá para perder caminhando 30 minutos por dia?",
    answer: `Pela conta, para ${PESO_PADRAO} kg em ritmo moderado, cerca de ${fmt(KG_MES_30)} kg de gordura por mês — usando só o que a caminhada acrescenta ao dia e a referência de 7.700 kcal por quilo. Na prática, o resultado depende de a alimentação não compensar esse gasto. A caminhada ajuda; quem decide é o conjunto da semana.`,
  },
  {
    question: "Quanto tempo de caminhada por dia para emagrecer?",
    answer: "Não existe um tempo que emagreça sozinho. Como referência de saúde, a OMS recomenda de 150 a 300 minutos de atividade moderada por semana — de 20 a 45 minutos por dia. Para emagrecer, o que decide é o déficit da semana; a caminhada soma gasto, e a musculação ajuda a não perder músculo no caminho.",
  },
  {
    question: "Em quantos dias a caminhada começa a fazer efeito?",
    answer: "O fôlego e a disposição costumam melhorar nas primeiras semanas. Na balança, a mudança aparece em semanas a meses, e depende mais da alimentação do que da caminhada. Se o peso não se mexer em um mês mantendo o hábito, o ajuste costuma estar no prato, não no tempo de caminhada.",
  },
  {
    question: "Caminhada ou corrida leve: qual queima mais?",
    answer: `Por minuto, a corrida. Em 30 minutos, para ${PESO_PADRAO} kg: caminhada moderada ≈ ${arredondaKcal(EX_30.kcal)} kcal; caminhada rápida ≈ ${arredondaKcal(deTempo(30, PESO_PADRAO, RAPIDO.velocidade, 0, RAPIDO.cadencia).kcal)} kcal; corrida leve a 8 km/h ≈ ${arredondaKcal(CORRIDA_30)} kcal. Mas a caminhada tem menos impacto e é mais fácil de manter todo dia — e é a frequência que pesa no mês.`,
  },
  {
    question: "Como queimar mais calorias caminhando?",
    answer: `Três alavancas, nesta ordem: inclinação (a 4,8 km/h com 12%, 30 minutos passam de ${arredondaKcal(EX_12_3_30.kcal)} kcal), ritmo mais rápido e tempo. Alternar trechos rápidos com trechos leves também soma. Tênis, relógio ou aplicativo não mudam o gasto — só a forma de medir.`,
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const th = "text-left text-gray-400 font-medium py-2.5 pr-4";

export default function CalculadoraCaminhadaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuita · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias da Caminhada
          </h1>
          <Compartilhar
            contexto="tool"
            titulo="Calculadora de Calorias da Caminhada"
            caminho={CAMINHO}
            local="tool_top"
            ferramenta="caminhada"
            aparencia="discreto"
            className="mb-5"
          />
          <p className="text-gray-300 text-lg leading-relaxed">
            Descubra quantas calorias a sua caminhada gasta por tempo, distância ou passos — na rua ou na
            esteira, com o seu peso, o seu ritmo e a inclinação.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraCaminhada placement="calculadora-calorias-caminhada" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quantas calorias a caminhada gasta?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Para uma pessoa de {PESO_PADRAO} kg em ritmo moderado (cerca de 5 km/h, no plano), cada minuto de
              caminhada custa cerca de <strong className="text-white">{fmt(POR_MIN)} kcal</strong>. Isso dá
              aproximadamente {arredondaKcal(EX_30.kcal)} kcal em 30 minutos e {arredondaKcal(EX_60.kcal)} kcal
              em uma hora — em torno de {formataKm(EX_60.km)} e{" "}
              {arredondaPassos(EX_60.passos).toLocaleString("pt-BR")} passos.
            </p>
            <p className="text-gray-300 leading-relaxed mb-5">
              Quatro coisas mudam esse número: <strong className="text-white">peso corporal</strong> (é o que
              mais pesa — corpos maiores movem mais massa a cada passo), <strong className="text-white">ritmo</strong>,{" "}
              <strong className="text-white">inclinação</strong> (é o que faz a esteira inclinada render) e{" "}
              <strong className="text-white">tempo</strong>. Condicionamento muda menos do que parece: quem
              treina há anos gasta quase o mesmo que quem começou, no mesmo passo — a diferença é que consegue
              manter o passo por mais tempo.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em 30 minutos de caminhada moderada, por peso corporal</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    <th scope="col" className={th}>30 min moderados</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Acréscimo ao dia</th>
                  </tr>
                </thead>
                <tbody>
                  {TABELA_PESO.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {l.kcal} kcal</td>
                      <td className="text-gray-400 py-2.5 tabular-nums">≈ {l.kcalLiquida} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              Estimativa a 5 km/h no plano. A primeira coluna é o gasto bruto; a segunda desconta o que a pessoa
              gastaria parada. Use a calculadora acima para o seu peso e o seu ritmo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quantas calorias por tempo: 10, 20, 30, 45, 60 e 90 minutos
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              O gasto é proporcional ao tempo: uma hora custa o dobro de meia hora, no mesmo ritmo. A tabela é
              para {PESO_PADRAO} kg em ritmo moderado — e é por isso que &ldquo;30 minutos de esteira&rdquo;
              não tem uma resposta só: tem uma para cada peso.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado por tempo de caminhada moderada, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Tempo</th>
                    <th scope="col" className={th}>Gasto ({PESO_PADRAO} kg)</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Distância</th>
                  </tr>
                </thead>
                <tbody>
                  {TABELA_TEMPO.map((l) => (
                    <tr key={l.minutos} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{formataTempo(l.minutos)}</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {l.kcal} kcal</td>
                      <td className="text-gray-400 py-2.5 tabular-nums">{formataKm(l.km)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quantas calorias por km: 1, 3, 5, 7 e 10 km
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Para uma pessoa de {PESO_PADRAO} kg em ritmo moderado ({fmt(MOD.velocidade)} km/h), no plano:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-gray-400 font-medium py-2.5 pr-4">Distância</th>
                    <th className="text-left text-gray-400 font-medium py-2.5 pr-4">Tempo</th>
                    <th className="text-left text-gray-400 font-medium py-2.5">Calorias</th>
                  </tr>
                </thead>
                <tbody>
                  {TABELA_KM.map(({ km, r }) => (
                    <tr key={km} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{km} km</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{formataTempo(r.minutos)}</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">{arredondaKcal(r.kcal)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Ritmo leve, moderado ou rápido: quanto muda?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Muda mais do que a maioria imagina. Entre o passeio a 4 km/h e o passo quase de corrida a 6,5
              km/h, o gasto por minuto quase dobra — e a distância percorrida no mesmo tempo também. A tabela é
              para {PESO_PADRAO} kg em 30 minutos, no plano.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em 30 minutos por ritmo de caminhada, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Ritmo</th>
                    <th scope="col" className={th}>METs</th>
                    <th scope="col" className={th}>30 min</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Distância</th>
                  </tr>
                </thead>
                <tbody>
                  {TABELA_RITMO.map((l) => (
                    <tr key={l.ritmo.id} className="border-b border-white/10">
                      <td className="text-white py-2.5 pr-4 font-medium whitespace-nowrap">
                        {l.ritmo.nome}
                        <span className="block text-gray-500 text-xs font-normal">{l.ritmo.faixa}</span>
                      </td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums align-top">{fmt(l.ritmo.met)}</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums align-top">≈ {l.kcal} kcal</td>
                      <td className="text-gray-400 py-2.5 tabular-nums align-top">{formataKm(l.km)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              Um termômetro sem relógio: no moderado dá para falar, mas não cantar; no rápido, só frases curtas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Esteira inclinada e o 12-3-30: quantas calorias?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              A inclinação é o que separa a esteira da rua. Andar no plano custa o deslocamento horizontal;
              inclinar acrescenta o custo de subir o próprio peso — e esse custo cresce em linha reta com a
              porcentagem. A 4,8 km/h com 12% de inclinação (o método 12-3-30), 30 minutos passam de{" "}
              <strong className="text-white">{arredondaKcal(EX_12_3_30.kcal)} kcal</strong> para{" "}
              {PESO_PADRAO} kg, contra {arredondaKcal(deTempo(30, PESO_PADRAO, 4.8, 0, 100).kcal)} kcal no plano
              na mesma velocidade.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em 30 minutos a 4,8 km/h por inclinação da esteira, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Inclinação</th>
                    <th scope="col" className={th}>METs</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">30 min a 4,8 km/h</th>
                  </tr>
                </thead>
                <tbody>
                  {TABELA_INCL.map((l) => (
                    <tr key={l.inclinacao} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.inclinacao}%</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{fmt(l.met)}</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">≈ {l.kcal} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              A ressalva que a esteira não mostra no painel: segurar no apoio anula boa parte disso, porque
              transfere para os braços o peso que a conta supõe nas pernas. Se precisa segurar para acompanhar,
              a inclinação está alta demais para hoje —{" "}
              <Link href="/blog/caminhada-na-esteira-inclinada" className={ln}>
                o que o 12-3-30 promete e o que entrega
              </Link>{" "}
              trata disso com calma.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              10 mil passos queimam quantas calorias?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Em ritmo moderado, cerca de 100 passos por minuto, 10 mil passos são{" "}
              <strong className="text-white">{formataTempo(EX_10MIL.minutos)}</strong> de caminhada e algo em torno
              de <strong className="text-white">{arredondaKcal(EX_10MIL.kcal)} kcal</strong> para {PESO_PADRAO} kg —
              se fossem todos seguidos e no mesmo passo. Na vida real eles se espalham pelo dia, parte em ritmo de
              corredor de escritório, e o gasto real fica abaixo disso.
            </p>
            <p className="text-gray-300 leading-relaxed">
              A calculadora converte passos em tempo pela cadência, não em distância pela passada: passada varia
              com altura e ritmo, e assumir 75 cm para todo mundo seria inventar precisão. Sobre a meta em si —
              de onde saiu, e por que 10 mil é marketing, não ciência —{" "}
              <Link href="/blog/10-mil-passos-por-dia-emagrece" className={ln}>
                10 mil passos por dia emagrece?
              </Link>{" "}
              responde.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quanto tempo de caminhada para queimar 300 calorias?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Para {PESO_PADRAO} kg em ritmo moderado, cerca de{" "}
              <strong className="text-white">{formataTempo(EX_300.minutos)}</strong> — em torno de{" "}
              {formataKm(EX_300.km)}. Com inclinação ou passo mais rápido cai bastante; com peso maior também,
              porque o gasto por minuto é proporcional ao peso. O modo &ldquo;quanto tempo para gastar X
              kcal&rdquo; da calculadora faz essa conta ao contrário para qualquer meta.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Só não confunda uma meta de caloria com uma estratégia. Trezentas calorias caminhando são
              anuladas por um lanche desatento; o que decide é{" "}
              <Link href="/blog/deficit-calorico-como-calcular" className={ln}>
                o déficit da semana inteira
              </Link>
              , e a caminhada é uma das peças dele — a mais fácil de repetir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quanto tempo de caminhada para perder 1 kg?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Essa pergunta tem uma resposta matemática e uma fisiológica, e não são a mesma coisa. Um quilo de
              gordura corporal armazena cerca de {KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal. Para{" "}
              {PESO_PADRAO} kg em ritmo moderado, essa energia corresponderia a aproximadamente{" "}
              <strong className="text-white">{formataTempo(UM_QUILO.minutos)}</strong> de caminhada — em torno de{" "}
              {formataKm(UM_QUILO.km)}.
            </p>
            <div className="border-l-2 pl-4 mb-4" style={{ borderColor: "#BA9E50" }}>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">Isso NÃO significa que caminhar esse tempo fará você perder exatamente 1 kg.</strong>{" "}
                É uma simulação teórica, para dar noção de ordem de grandeza.
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              O corpo não responde de forma linear. {FONTE_HALL.rotuloCurto} {FONTE_HALL.resumo} Além disso,
              exercício muda o apetite e a movimentação do resto do dia. O que a conta mostra, na verdade, é por
              que tentar emagrecer só caminhando é o caminho mais lento — e por que ela rende tanto quando entra
              numa estratégia com{" "}
              <Link href="/blog/musculacao-ou-corrida-para-emagrecer" className={ln}>
                musculação
              </Link>{" "}
              e alimentação.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como calculamos
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">O gasto sai da equação de METs usada em fisiologia do exercício:</p>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">
                {fmt(MOD.met)} × 3,5 × {PESO_PADRAO} ÷ 200 = <span className="text-white">≈ {fmt(POR_MIN)} kcal/min</span>
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os valores de MET no plano vêm do {FONTE_COMPENDIO_CAMINHADA.rotuloCurto}, que{" "}
              {FONTE_COMPENDIO_CAMINHADA.resumo} Entre uma faixa e outra a calculadora{" "}
              <strong className="text-white">interpola</strong>, e diz isso na metodologia do resultado — o
              Compêndio mediu faixas, não cada décimo de km/h, e fingir que mediu seria inventar precisão.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Valores de MET e cadência usados em cada ritmo</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Ritmo</th>
                    <th scope="col" className={th}>MET</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">De onde vem</th>
                  </tr>
                </thead>
                <tbody>
                  {RITMOS.map((r) => (
                    <tr key={r.id} className="border-b border-white/10">
                      <td className="text-white py-2.5 pr-4 font-medium whitespace-nowrap">
                        {r.nome}
                        <span className="block text-gray-500 text-xs font-normal">~{r.cadencia} passos/min</span>
                      </td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums align-top">{fmt(r.met)}</td>
                      <td className="text-gray-400 py-2.5 leading-relaxed">{r.origem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              A <strong className="text-white">inclinação</strong> entra pelo termo vertical da equação de
              caminhada da ACSM — 1,8 × velocidade (m/min) × inclinação, dividido por 3,5 para virar MET —
              somado ao MET do Compêndio para o plano. Os <strong className="text-white">passos</strong> viram
              tempo pela cadência de cada ritmo, seguindo {FONTE_TUDOR_LOCKE.rotuloCurto}, que{" "}
              {FONTE_TUDOR_LOCKE.resumo}
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os números são <strong className="text-white">brutos</strong>: incluem o que a pessoa gastaria
              parada no mesmo tempo (1 MET). O que a caminhada acrescenta ao dia é o bruto menos isso — para{" "}
              {PESO_PADRAO} kg em 30 minutos moderados, {arredondaKcal(EX_30.kcal)} kcal brutas viram cerca de{" "}
              {arredondaKcal(EX_30_LIQ)} kcal de acréscimo. A calculadora mostra os dois porque relógios e
              esteiras mostram só o primeiro, e é o segundo que conta num déficit.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 22 de setembro de 2026 por{" "}
              <Link href="/minha-historia" className={ln}>
                Montinho
              </Link>
              , personal trainer em Alphaville. Os números desta página são estimativas de gasto energético, não
              orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>
              Perguntas frequentes
            </h2>
            <FAQ itens={faq} placement="ferramenta-caminhada" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>
              Referências
            </h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_CAMINHADA.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>
                    {f.rotulo}
                  </a>{" "}
                  — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>
              Leia também
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/blog/quanto-tempo-de-esteira-para-emagrecer" className={ln}>
                  Quanto tempo de esteira para emagrecer
                </Link>
              </li>
              <li>
                <Link href="/blog/quanto-tempo-de-caminhada-por-dia" className={ln}>
                  Quanto tempo de caminhada por dia
                </Link>
              </li>
              <li>
                <Link href="/blog/caminhada-na-esteira-inclinada" className={ln}>
                  Caminhada inclinada na esteira: o método 12-3-30
                </Link>
              </li>
              <li>
                <Link href="/blog/caminhada-emagrece" className={ln}>
                  Caminhada emagrece? Guia honesto para iniciantes
                </Link>
              </li>
              <li>
                <Link href="/ferramentas/calculadora-polichinelos" className={ln}>
                  Calculadora de Polichinelos — quantos equivalem à sua caminhada
                </Link>
              </li>
              <li>
                <Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>
                  Calculadora de TMB e TDEE — o gasto do seu dia inteiro
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
