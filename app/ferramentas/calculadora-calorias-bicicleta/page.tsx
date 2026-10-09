import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraBicicleta from "@/components/bicicleta/CalculadoraBicicleta";
import {
  FAIXAS_RUA,
  KCAL_POR_KG_GORDURA,
  FAIXAS_WATTS,
  FONTES_BICICLETA,
  FONTE_COMPENDIO_BICICLETA,
  MET_PARADO,
  MET_TRABALHO,
  NOTA_SEM_PERDA_LOCALIZADA,
  TERRENOS,
  arredondaKcal,
  calcula,
  compara,
  kcalSeFosseContinuo,
  kgPorMes,
  esforco,
  metDoEsforco,
  tabelaRua,
  tabelaTrabalho,
  trabalho,
} from "@/lib/bicicleta";
import { RITMOS_CAMINHADA } from "@/lib/polichinelo";

/**
 * A página da Calculadora de Calorias na Bicicleta.
 *
 * O `bicicleta-emagrece` compara ergométrica, spinning e rua e diz que
 * pedalar 30 a 45 minutos em ritmo moderado gasta 200 a 500 kcal. Esta
 * página faz a conta com o peso, a velocidade e as paradas de quem
 * pergunta — e responde a pergunta que o artigo não faz: quanto rende ir
 * de bike para o trabalho.
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-bicicleta";
const PESO = 70;

export const metadata: Metadata = {
  title: "Calorias na Bicicleta: Calculadora para Rua e Ergométrica",
  description:
    "Quantas calorias você gasta pedalando, pelo seu peso, pela velocidade e pelas paradas — na rua, na ergométrica pelos watts, e indo de bike para o trabalho.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias na Bicicleta | Montinho Personal Trainer",
    description:
      "Rua pela velocidade, ergométrica pelos watts, e quanto rende ir de bike para o trabalho no mês — com o seu peso e sem o exagero das tabelas.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias na Bicicleta",
  descricao:
    "Estima o gasto calórico de pedalar a partir do peso, da velocidade média ou da distância e do tempo, descontando as paradas; da bicicleta ergométrica pelos watts ou pelo esforço; e da ida e volta do trabalho de bike, em calorias por semana e quilos por mês.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias na Bicicleta", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const MODERADO = FAIXAS_RUA.find((f) => f.codigo === "01030")!;
const TAB_RUA = tabelaRua(45);
const TAB_TRAB = tabelaTrabalho();
const CMP = compara(PESO, 60);
const R30 = calcula(PESO, MODERADO.met, 30);
const R45 = calcula(PESO, MODERADO.met, 45);
const R40 = calcula(PESO, MODERADO.met, 40);
const KCAL_MIN_MOD = R30.kcal / 30;
const MIN_500 = Math.round(500 / KCAL_MIN_MOD);
const ERGO_LEVE_20 = calcula(PESO, metDoEsforco("leve"), 20);
const ERGO_LEVE_60 = calcula(PESO, metDoEsforco("leve"), 60);
const KM_MOD = 20; // meio da faixa de 19 a 22 km/h
const KCAL_1KM = KCAL_MIN_MOD * (60 / KM_MOD);
const R60_CIDADE = calcula(PESO, MODERADO.met, 60, 10);
const TABELA_60 = kcalSeFosseContinuo(PESO, MODERADO.met, 60);
const TRAB_8 = trabalho(PESO, 8, 30, 5);
const TRES_45 = kgPorMes(R45.kcalLiquida, 3);
const MINUTOS_TAB = [10, 15, 20, 30, 40, 50, 60];
const H_1KG = KCAL_POR_KG_GORDURA / KCAL_MIN_MOD / 60;
const ERGO = (id: "leve" | "moderado" | "forte", min: number) => calcula(PESO, metDoEsforco(id), min).kcal;
const RUA = (min: number) => calcula(PESO, MODERADO.met, min).kcal;
const TRILHA_60 = calcula(PESO, TERRENOS[1].met!, 60).kcal;
const CAMINHADA_30 = calcula(PESO, RITMOS_CAMINHADA[1].met, 30).kcal;
const PASSEIO = FAIXAS_RUA.find((f) => f.codigo === "01019")!;
const PASSEIO_30 = calcula(PESO, PASSEIO.met, 30).kcal;
const R30_KG_MES_DIARIO = kgPorMes(R30.kcalLiquida, 7);
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias gasta pedalar 30 minutos?",
    answer: `Para ${PESO} kg em ritmo moderado, de 19 a 22 km/h, cerca de ${kc(R30.kcal)} kcal; em 45 minutos, ${kc(R45.kcal)}. Em passeio, a 12 a 16 km/h, é pouco mais da metade disso. O peso e a velocidade mudam tudo — por isso a calculadora pede os dois.`,
  },
  {
    question: "Bicicleta ergométrica ou de rua: qual gasta mais?",
    answer: `Depende do esforço, não do tipo. Uma hora para ${PESO} kg: ${CMP.map((l) => `${l.nome.split(" (")[0].toLowerCase()} ≈ ${kc(l.kcal)} kcal`).join("; ")}. A ergométrica em esforço forte passa a rua em passeio, e vice-versa.`,
  },
  {
    question: "Ir de bike para o trabalho emagrece?",
    answer: `Ajuda mais do que parece, porque é todo dia. Um trajeto de 8 km, 30 minutos por trecho, 5 dias por semana, para ${PESO} kg: cerca de ${kc(TRAB_8.kcalPorSemana)} kcal por semana e até ${kg(TRAB_8.kgPorMes)} kg de gordura por mês, só do trajeto. O resto vem da alimentação.`,
  },
  {
    question: "Por que a calculadora dá menos que o aplicativo?",
    answer: `Porque ela desconta as paradas. Uma hora na cidade com 10 minutos de semáforo, para ${PESO} kg em ritmo moderado, gasta cerca de ${kc(R60_CIDADE.kcal)} kcal; a tabela pelo tempo de relógio diria ${kc(TABELA_60)}. Parado no semáforo, o corpo gasta ${metF(MET_PARADO)} MET, quase o de ficar em pé.`,
  },
  {
    question: "Quantos watts é um pedal leve, moderado ou forte na ergométrica?",
    answer: `Pelo Compêndio: ${FAIXAS_WATTS.map((f) => `${f.de} a ${f.ate} W, ${f.nome}, ${metF(f.met)} METs`).join("; ")}. Se o visor mostra a potência média, use os watts; se não, escolha o esforço e a calculadora usa a faixa correspondente.`,
  },
  {
    question: "Pedalar emagrece quantos quilos por mês?",
    answer: `Só da bike, pouco: três pedais de 45 minutos em ritmo moderado somam no máximo ${kg(TRES_45)} kg de gordura por mês para ${PESO} kg, pela conta linear. O que decide é o déficit da semana, e a bicicleta entra como uma das fontes de gasto — a que tem mais chance de virar hábito, porque é baixo impacto.`,
  },
  {
    question: "Quanto tempo de bike para queimar 500 calorias?",
    answer: `Para ${PESO} kg em ritmo moderado, de 19 a 22 km/h, cerca de ${MIN_500} minutos pedalando sem parar. Mais pesado ou mais rápido, leva menos; em passeio, bem mais.`,
  },
  {
    question: "Quantas calorias gasta 20 minutos de bicicleta ergométrica leve?",
    answer: `No esforço leve (cerca de ${esforco("leve").watts} W), cerca de ${kc(ERGO_LEVE_20.kcal)} kcal para ${PESO} kg; uma hora nesse ritmo, cerca de ${kc(ERGO_LEVE_60.kcal)} kcal. Na bicicleta horizontal a conta é a mesma: o que decide é a potência, não o formato do banco.`,
  },
  {
    question: "Quantas calorias gasta andar 1 km de bicicleta?",
    answer: `A cerca de ${KM_MOD} km/h, 1 km leva uns 3 minutos e gasta perto de ${kc(KCAL_1KM)} kcal para ${PESO} kg. Por distância a bike gasta menos que a caminhada, porque cobre o mesmo quilômetro muito mais rápido.`,
  },
  {
    question: "Pedalar 40 minutos por dia ajuda a emagrecer?",
    answer: `Ajuda: são cerca de ${kc(R40.kcal)} kcal por dia em ritmo moderado para ${PESO} kg, repetíveis todo dia por ser baixo impacto. Emagrecer depende do déficit da semana inteira, e a bike entra como uma fonte de gasto que vira hábito com facilidade.`,
  },
  {
    question: "10 km de bicicleta queima quantas calorias?",
    answer: `A cerca de ${KM_MOD} km/h, 10 km levam uns 30 minutos e gastam perto de ${kc(R30.kcal)} kcal para ${PESO} kg; 20 km, cerca de uma hora, perto de ${kc(calcula(PESO, MODERADO.met, 60).kcal)} kcal. Mais devagar, o mesmo trajeto leva mais tempo e o total muda pouco; o que pesa mais é o seu peso.`,
  },
  {
    question: "Quanto pedalar para perder 1 kg?",
    answer: `Um quilo de gordura guarda cerca de ${KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal. Em ritmo moderado, para ${PESO} kg, isso daria perto de ${Math.round(H_1KG)} horas de pedal. É conta teórica: ninguém perde peso só pedalando, e o corpo não responde de forma linear. A bike soma ao déficit da semana; quem decide é o conjunto com a alimentação.`,
  },
  {
    question: "O que acontece se fizer 30 minutos de bike todo dia?",
    answer: `Em ritmo moderado, para ${PESO} kg, são cerca de ${kc(R30.kcal)} kcal por dia, ou até ${kg(R30_KG_MES_DIARIO)} kg de gordura por mês pela conta linear, se a alimentação não compensar. Além do gasto, o hábito diário melhora o condicionamento, e por ser baixo impacto dá para manter todo dia com menos risco de lesão do que a corrida.`,
  },
  {
    question: "O que emagrece mais, esteira ou bicicleta?",
    answer: "No mesmo tempo, correr na esteira costuma gastar mais que pedalar, porque você carrega o peso do corpo. Caminhar na esteira e pedalar em ritmo moderado ficam parecidos. Mas emagrece mais o que você consegue fazer com frequência: a bike tem menos impacto no joelho, e por isso muita gente mantém por mais tempo. Compare com a calculadora de corrida.",
  },
  {
    question: "Quem tem hérnia de disco pode pedalar?",
    answer: "Muitas pessoas com hérnia de disco pedalam bem, e a bicicleta horizontal costuma ser mais confortável por apoiar as costas. Mas a indicação é individual: combine com o médico ou fisioterapeuta, e pare se a dor irradiar para a perna.",
  },
  {
    question: "Pedalar perde barriga?",
    answer: NOTA_SEM_PERDA_LOCALIZADA,
  },
  {
    question: "Bicicleta faz mal para o joelho?",
    answer: "Ao contrário: o peso do corpo fica no banco, e o movimento é contínuo, sem o impacto da passada. É a porta de entrada mais indicada para quem tem sobrepeso ou joelho sensível. O ajuste que protege é a altura do banco: joelho quase estendido no ponto mais baixo do pedal.",
  },
  {
    question: "30 minutos de bicicleta ergométrica queima quantas calorias?",
    answer: `Para ${PESO} kg, cerca de ${kc(ERGO("moderado", 30))} kcal em esforço moderado (uns ${esforco("moderado").watts} W). No leve, perto de ${kc(ERGO("leve", 30))}; no forte, cerca de ${kc(ERGO("forte", 30))}. Se o visor mostra os watts, use a calculadora com eles: é o dado mais confiável da ergométrica.`,
  },
  {
    question: "20 minutos de bicicleta queima quantas calorias?",
    answer: `Na rua, em ritmo moderado (19 a 22 km/h), cerca de ${kc(RUA(20))} kcal para ${PESO} kg. Na ergométrica, em esforço moderado, perto de ${kc(ERGO("moderado", 20))} kcal. Em 10 minutos, a rua fica em torno de ${kc(RUA(10))} kcal; em 15, uns ${kc(RUA(15))}.`,
  },
  {
    question: "1 hora de bicicleta queima quantas calorias?",
    answer: `Para ${PESO} kg, cerca de ${kc(RUA(60))} kcal na rua em ritmo moderado, sem paradas, e perto de ${kc(ERGO("moderado", 60))} kcal na ergométrica em esforço moderado. Em 2 horas de rua no mesmo ritmo, uns ${kc(RUA(120))} kcal — mas pedal longo quase sempre tem paradas, e a calculadora desconta.`,
  },
  {
    question: "Pedalar 1 hora por dia emagrece?",
    answer: "Ajuda bastante no gasto, e por ser baixo impacto dá para manter. Mas uma hora por dia costuma abrir o apetite, e é fácil comer de volta o que se gastou. Quem emagrece pedalando é quem acerta a alimentação junto e faz musculação para não perder músculo no caminho.",
  },
  {
    question: "Quantos minutos de bicicleta ergométrica por dia para emagrecer?",
    answer: "Não existe um número que emagreça por si só. Como referência, a OMS recomenda de 150 a 300 minutos por semana de atividade aeróbica moderada para a saúde — uns 20 a 45 minutos por dia. Para emagrecer, o que decide é o déficit da semana; a ergométrica entra como gasto que dá para repetir sem impacto.",
  },
  {
    question: "O que perde mais barriga, caminhada ou bicicleta?",
    answer: `Nenhum dos dois tira gordura de um lugar específico. No gasto, em 30 minutos para ${PESO} kg, a caminhada moderada (cerca de 5 km/h) fica perto de ${kc(CAMINHADA_30)} kcal; o passeio de bike, uns ${kc(PASSEIO_30)} kcal; e o pedal moderado, cerca de ${kc(R30.kcal)} kcal. A barriga diminui com o déficit da semana inteira, e qualquer um dos dois serve se você mantiver.`,
  },
  {
    question: "Bicicleta afina a cintura?",
    answer: NOTA_SEM_PERDA_LOCALIZADA + " Pedalar entra como gasto do dia; a cintura acompanha a perda de gordura do corpo todo.",
  },
  {
    question: "Mountain bike ou bike de estrada: qual queima mais?",
    answer: `Pelo Compêndio, uma hora de mountain bike gasta cerca de ${kc(TRILHA_60)} kcal para ${PESO} kg, contra cerca de ${kc(RUA(60))} kcal na estrada em ritmo moderado. A trilha pede mais força nas subidas e no terreno irregular; na estrada, o gasto sobe com a velocidade. Subida forte e contínua é o que mais gasta.`,
  },
  {
    question: "Como queimar mais calorias pedalando?",
    answer: `Aumente o esforço, não só o tempo: na ergométrica, passar do moderado para o forte leva meia hora de cerca de ${kc(ERGO("moderado", 30))} para ${kc(ERGO("forte", 30))} kcal, para ${PESO} kg. Intercalar trechos fortes com trechos leves, incluir subidas e pedalar mais vezes por semana somam mais que qualquer acessório.`,
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

export default function CalculadoraBicicletaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias na Bicicleta
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias na Bicicleta" caminho={CAMINHO} local="tool_top" ferramenta="bicicleta" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Rua pela velocidade e pelas paradas, ergométrica pelos watts ou pelo esforço, e quanto rende ir de bike para o trabalho — com o
            seu peso, sem o exagero das tabelas.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraBicicleta placement="calculadora-calorias-bicicleta" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias pedalar queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Um pedal de 45 minutos, sem paradas, por peso e por velocidade média. O Compêndio mede a bicicleta de rua em faixas de velocidade,
              e é por isso que a calculadora pergunta a média do aplicativo — ou a distância e o tempo, que dão na mesma.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de 45 minutos de bicicleta, por peso e faixa de velocidade</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    {FAIXAS_RUA.map((f) => (
                      <th key={f.codigo} scope="col" className={th}>{f.nome}<span className="block font-normal text-xs">{f.de}–{f.ate === 60 ? "" : f.ate} km/h</span></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TAB_RUA.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      {l.kcal.map((k, i) => (
                        <td key={i} className={`py-2.5 pr-4 tabular-nums ${FAIXAS_RUA[i].codigo === "01030" ? "text-white font-medium" : "text-gray-300"}`}>≈ {k.toLocaleString("pt-BR")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              Em kcal. Na trilha, o Compêndio mede o mountain bike como um todo, em {metF(TERRENOS[1].met!)} METs; a subida forte e contínua, em{" "}
              {metF(TERRENOS[2].met!)}, o maior valor da bicicleta.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias por tempo de pedal?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              De 10 minutos a 1 hora, para {PESO} kg, sem paradas, por faixa de velocidade:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de bicicleta por tempo, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Tempo</th>
                    {FAIXAS_RUA.map((f) => (
                      <th key={f.codigo} scope="col" className={th}>{f.nome}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MINUTOS_TAB.map((m) => (
                    <tr key={m} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{m === 60 ? "1 hora" : `${m} min`}</td>
                      {FAIXAS_RUA.map((f) => (
                        <td key={f.codigo} className={`py-2.5 pr-4 tabular-nums ${f.codigo === "01030" ? "text-white font-medium" : "text-gray-300"}`}>≈ {kc(calcula(PESO, f.met, m).kcal)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">Em kcal. Na ergométrica, a conta segue o esforço ou os watts do visor: use a calculadora acima.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Por que a conta dá menos que o aplicativo?</h2>
            <p className="text-gray-300 leading-relaxed">
              Porque o aplicativo conta o relógio, e o relógio inclui o semáforo. Uma hora na cidade com 10 minutos parado, para {PESO} kg em ritmo
              moderado, gasta <strong className="text-white">cerca de {kc(R60_CIDADE.kcal)} kcal</strong>; pelo tempo de relógio, seriam {kc(TABELA_60)}.
              Parado sobre a bike, o corpo gasta {metF(MET_PARADO)} MET, quase o de ficar em pé. A calculadora pergunta quanto tempo você ficou parado
              e conta esse tempo pelo que ele é.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Ir de bike para o trabalho emagrece?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              É a pergunta que as tabelas não respondem, porque elas olham um pedal e o trajeto é todo dia. Ida e volta, 5 dias por semana, no
              ritmo de quem vai trabalhar ({metF(MET_TRABALHO)} METs, a entrada do Compêndio para deslocamento):
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto de ir e voltar do trabalho de bicicleta, 5 dias por semana, para 70 e 90 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Trajeto de ida</th>
                    <th scope="col" className={th}>70 kg, por dia</th>
                    <th scope="col" className={th}>70 kg, por mês</th>
                    <th scope="col" className={th}>90 kg, por dia</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">90 kg, por mês</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_TRAB.map((l) => (
                    <tr key={l.kmIda} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{l.kmIda} km em {l.minutosIda} min</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {l.kcalPorDia70.toLocaleString("pt-BR")} kcal</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">até {kg(l.kgPorMes70)} kg</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">≈ {l.kcalPorDia90.toLocaleString("pt-BR")} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">até {kg(l.kgPorMes90)} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Os quilos são o teto da conta linear, só do trajeto. A conta usa o ritmo de deslocamento e não a velocidade de propósito: quem vai
              devagar para não chegar suado não é punido por isso. O <Link href="/blog/bicicleta-emagrece" className={ln}>artigo sobre bicicleta e
              emagrecimento</Link> explica o que a conta não mostra — o que faz o pedal virar hábito.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Rua, ergométrica ou spinning: qual gasta mais?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Sessenta minutos, para {PESO} kg, no ritmo que representa cada uma:</p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de 60 minutos na rua, na ergométrica e no spinning, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Pedal</th>
                    <th scope="col" className={th}>METs</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">60 min</th>
                  </tr>
                </thead>
                <tbody>
                  {CMP.map((l) => (
                    <tr key={l.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{l.href ? <Link href={l.href} className={ln}>{l.nome}</Link> : l.nome}</td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums">{metF(l.met)}</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">≈ {kc(l.kcal)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              A diferença entre os três é pequena perto da diferença entre quem mantém e quem desiste. A ergométrica vence em constância; a rua,
              em prazer; o spinning, em intensidade. A que você repete é a que emagrece.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Ergométrica: quantos watts é cada esforço?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              O Compêndio mede a bicicleta ergométrica pela potência, que o visor de muitas bikes mostra. É a mesma escada que a{" "}
              <Link href="/ferramentas/calculadora-calorias-spinning" className={ln}>Calculadora de Spinning</Link> usa, para as duas nunca discordarem:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">METs da bicicleta ergométrica por faixa de watts</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Watts</th>
                    <th scope="col" className={th}>Esforço</th>
                    <th scope="col" className={th}>METs</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">45 min, {PESO} kg</th>
                  </tr>
                </thead>
                <tbody>
                  {FAIXAS_WATTS.map((f) => (
                    <tr key={f.codigo} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{f.de}–{f.ate} W</td>
                      <td className="text-gray-300 py-2.5 pr-4">{f.nome}</td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums">{metF(f.met)}</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">≈ {kc(calcula(PESO, f.met, 45).kcal)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">Sem watts no visor, escolha o esforço na calculadora: cada um aponta para uma dessas faixas.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">sessão = tempo pedalando × MET da faixa + tempo parado × {metF(MET_PARADO)}</p>
              <p className="mt-2">trabalho = (ida + volta) × dias por semana</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs da rua vêm do {FONTE_COMPENDIO_BICICLETA.rotuloCurto}, que {FONTE_COMPENDIO_BICICLETA.resumo} Os limites em km/h são as milhas do
              Compêndio convertidas e arredondadas, emendadas para não deixar buraco: quem cai entre duas faixas fica na de baixo, nunca numa
              interpolação. A ergométrica usa a escada de watts do Compêndio de 2011, a mesma da Calculadora de Spinning; a edição de 2024 remediu
              algumas faixas com valores um pouco menores, e o site mantém uma escada só para as duas ferramentas não discordarem nos mesmos watts.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Entradas do Compêndio usadas pela calculadora</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Situação</th>
                    <th scope="col" className={th}>MET</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Código</th>
                  </tr>
                </thead>
                <tbody>
                  {FAIXAS_RUA.map((f) => (
                    <tr key={f.codigo} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">Rua, {f.nome.toLowerCase()}, {f.de}–{f.ate === 60 ? "" : f.ate} km/h</td>
                      <td className="text-white py-2.5 pr-4 tabular-nums">{metF(f.met)}</td>
                      <td className="text-gray-400 py-2.5 tabular-nums">{f.codigo}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-white/10">
                    <td className="text-gray-300 py-2.5 pr-4">Ida e volta do trabalho, ritmo próprio</td>
                    <td className="text-white py-2.5 pr-4 tabular-nums">{metF(MET_TRABALHO)}</td>
                    <td className="text-gray-400 py-2.5 tabular-nums">01011</td>
                  </tr>
                  {TERRENOS.filter((t) => t.met !== null).map((t) => (
                    <tr key={t.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{t.nome}</td>
                      <td className="text-white py-2.5 pr-4 tabular-nums">{metF(t.met!)}</td>
                      <td className="text-gray-400 py-2.5 tabular-nums">{t.codigo}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-white/10">
                    <td className="text-gray-300 py-2.5 pr-4">Parado no semáforo, em pé</td>
                    <td className="text-white py-2.5 pr-4 tabular-nums">{metF(MET_PARADO)}</td>
                    <td className="text-gray-400 py-2.5 tabular-nums">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 24 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville.
              Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-bicicleta" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_BICICLETA.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/bicicleta-emagrece" className={ln}>Bicicleta emagrece? Ergométrica, spinning e rua</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-spinning" className={ln}>Calculadora de Calorias no Spinning — pelos watts da bike</Link></li>
              <li><Link href="/ferramentas/calculadora-corrida" className={ln}>Calculadora de Corrida — pace, tempo e gasto</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-caminhada" className={ln}>Calculadora de Calorias da Caminhada — com distância e passos</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
