import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraPolichinelos from "@/components/polichinelo/CalculadoraPolichinelos";
import {
  FONTE_ACSM,
  FONTE_COMPENDIO,
  FONTE_HALL,
  FONTE_WISHNOFSKY,
  INTENSIDADES,
  KCAL_POR_KG_GORDURA,
  NOTA_SEM_PERDA_LOCALIZADA,
  RITMOS_CAMINHADA,
  arredondaKcal,
  arredondaQuantidade,
  deKcal,
  deQuantidade,
  kcalPorMinuto,
  equivalenteACaminhada,
  formataTempo,
  intensidade,
  simulacaoUmQuilo,
  tabelaPorPeso,
} from "@/lib/polichinelo";

/**
 * A página da Calculadora de Polichinelos.
 *
 * POR QUE PÁGINA PRÓPRIA, E NÃO DENTRO DO ARTIGO
 *
 * O Search Console decidiu isso. O `polichinelo-emagrece` tem 7.319
 * impressões em 90 dias na posição 8 e é a página que o Google escolheu
 * para o assunto — mexer na URL dela seria apostar o único ativo do
 * cluster. O `polichinelo-queima-quantas-calorias`, publicado em setembro,
 * tem ZERO impressões: não há nada para canibalizar ali, e o que ele
 * responde em tabela fixa esta ferramenta responde com o peso de quem lê.
 *
 * Os dois artigos seguem com canonical próprio e ganham um convite para
 * cá. O convite não é cortesia: lib/ferramentas/canonica.ts documenta o
 * que acontece sem ele — calculadora embutida em artigo sem link para a
 * página canônica derrubou todas as onze consultas de ferramenta do site
 * para além da posição 35.
 *
 * O EXEMPLO FIXO EXISTE PORQUE O ROBÔ NÃO DIGITA PESO
 *
 * Sem os números resolvidos em HTML — 100 polichinelos, a tabela por peso,
 * a equivalência de 30 minutos de caminhada — a página seria um formulário
 * vazio para o Google e para quem chegou sem vontade de preencher nada.
 */

const CAMINHO = "/ferramentas/calculadora-polichinelos";

export const metadata: Metadata = {
  title: { absolute: "Polichinelo Queima Quantas Calorias? Calculadora | Montinho" },
  description:
    "Veja quantas calorias 100, 200 ou 500 polichinelos queimam com o seu peso, quantos minutos isso leva e quantos fazer por dia ou para chegar a 1 kg.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Polichinelos | Montinho Personal Trainer",
    description:
      "Quantas calorias seus polichinelos gastam, quanto tempo levam e quantos equivalem a uma caminhada — calculado com o seu peso.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Polichinelos",
  descricao:
    "Estima o gasto calórico, o tempo e a quantidade de polichinelos a partir do peso corporal e do ritmo, e compara o gasto com o de uma caminhada.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Polichinelos", item: `${SITE_URL}${CAMINHO}` },
  ],
};

/* ── Os exemplos resolvidos. Mesmo motor da calculadora, nada recalculado à mão. ── */

const MOD = intensidade("moderado");
const PESO_EX = 70;
const EX_100 = deQuantidade(100, PESO_EX, MOD.met, MOD.cadencia);
const EX_500 = deQuantidade(500, PESO_EX, MOD.met, MOD.cadencia);
const EX_1000 = deQuantidade(1000, PESO_EX, MOD.met, MOD.cadencia);
const EX_300 = deQuantidade(300, PESO_EX, MOD.met, MOD.cadencia);
const KMIN = kcalPorMinuto(MOD.met, PESO_EX);
const TABELA_100 = tabelaPorPeso(100, MOD.met, MOD.cadencia);
const CAM_30 = equivalenteACaminhada(30, PESO_EX, RITMOS_CAMINHADA[1].met, MOD.met, MOD.cadencia);
const UM_QUILO = simulacaoUmQuilo(PESO_EX, MOD.met, MOD.cadencia);
const EX_1 = deQuantidade(1, PESO_EX, MOD.met, MOD.cadencia);
const EX_50 = deQuantidade(50, PESO_EX, MOD.met, MOD.cadencia);
const PARA_300 = deKcal(300, PESO_EX, MOD.met, MOD.cadencia);
const PARA_500 = deKcal(500, PESO_EX, MOD.met, MOD.cadencia);
const virgula = (n: number, casas = 1) => n.toFixed(casas).replace(".", ",");

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias 100 polichinelos queimam?",
    answer: `Para uma pessoa de ${PESO_EX} kg em ritmo moderado, cerca de ${arredondaKcal(EX_100.kcal)} kcal — o equivalente a pouco mais de ${formataTempo(EX_100.minutos)} de exercício. O número muda bastante com o peso: alguém de 50 kg gasta perto de ${TABELA_100[0].kcal} kcal nos mesmos 100, e alguém de 100 kg, cerca de ${TABELA_100[5].kcal} kcal.`,
  },
  {
    question: "Polichinelo queima quantas calorias por minuto?",
    answer: `Para ${PESO_EX} kg em ritmo moderado, cerca de ${KMIN.toFixed(1).replace(".", ",")} kcal por minuto: uns ${arredondaKcal(KMIN * 5)} kcal em 5 minutos, ${arredondaKcal(KMIN * 15)} em 15 e ${arredondaKcal(KMIN * 30)} em 30. Mais pesado ou mais rápido, mais; e quase ninguém aguenta 30 minutos seguidos.`,
  },
  {
    question: "300 polichinelos queimam quantas calorias?",
    answer: `Cerca de ${arredondaKcal(EX_300.kcal)} kcal para ${PESO_EX} kg, em uns ${formataTempo(EX_300.minutos)} de salto. Para 200, perto de dois terços disso; para 1.000, cerca de ${arredondaKcal(EX_1000.kcal)} kcal.`,
  },
  {
    question: "É possível emagrecer só com polichinelo?",
    answer: "Só com ele, é difícil: o gasto é pequeno perto do que a alimentação muda num dia, e o impacto repetido cansa joelho e tornozelo. O polichinelo funciona como aquecimento ou parte de um circuito. Emagrecer vem do déficit da semana, com musculação para preservar o músculo.",
  },
  {
    question: "100 polichinelos por dia emagrecem?",
    answer:
      "Sozinhos, não existe número mágico. Eles aumentam o seu gasto do dia, e isso ajuda — mas a redução de gordura depende do balanço energético ao longo de semanas, não de um exercício isolado. Cem polichinelos por dia somam alguma coisa ao final do mês; o que decide o resultado é o que acontece nas outras 23 horas e 55 minutos.",
  },
  {
    question: "Quantos polichinelos devo fazer por dia?",
    answer:
      "Não existe número universal, e quem promete um está chutando. O que existe é o que o seu corpo aguenta hoje com boa execução: quem está começando costuma fazer séries de 20 a 30 com pausa; quem já treina aguenta séries maiores e mais seguidas. Polichinelo tem impacto, então o limite prático costuma ser articular, não cardiovascular.",
  },
  {
    question: "Quantos polichinelos são necessários para perder barriga?",
    answer: NOTA_SEM_PERDA_LOCALIZADA + " O polichinelo entra como uma das fontes de gasto do dia, ao lado da caminhada, da musculação e do que você já se movimenta sem perceber.",
  },
  {
    question: "Quantos polichinelos equivalem a 30 minutos de caminhada?",
    answer: `Para alguém de ${PESO_EX} kg, 30 minutos de caminhada moderada representam cerca de ${arredondaKcal(CAM_30.kcalCaminhada)} kcal. Um gasto energético parecido com polichinelos sairia em torno de ${arredondaQuantidade(CAM_30.polichinelo.quantidade)} repetições, aproximadamente ${formataTempo(CAM_30.polichinelo.minutos)}. É equivalência de gasto, não de efeito — a caminhada é bem mais fácil de sustentar por meia hora.`,
  },
  {
    question: "Quanto tempo fazendo polichinelo para queimar 100 calorias?",
    answer: `Para uma pessoa de ${PESO_EX} kg em ritmo moderado, cerca de ${formataTempo(100 / (EX_100.kcal / Math.max(EX_100.minutos, 0.0001)))} — o que dá em torno de ${arredondaQuantidade((100 / (EX_100.kcal / Math.max(EX_100.minutos, 0.0001))) * MOD.cadencia)} polichinelos. Quanto maior o peso corporal, menos tempo leva, porque o gasto por minuto é proporcional ao peso.`,
  },
  {
    question: "Polichinelo ajuda a emagrecer?",
    answer:
      "Ajuda como qualquer atividade que aumenta o gasto: ele soma calorias ao seu dia e melhora condicionamento. O que ele não faz é resolver sozinho — nenhum exercício compensa um balanço energético que não fecha. A vantagem dele é prática: não precisa de equipamento, de espaço nem de deslocamento.",
  },
  {
    question: "Polichinelo é melhor que caminhada?",
    answer:
      "Nenhum dos dois vence sempre. O polichinelo gasta mais por minuto; a caminhada é muito mais fácil de manter por trinta ou sessenta minutos e tem menos impacto. Na prática, o que gasta mais é o que você consegue fazer com frequência — e para a maioria das pessoas isso é a caminhada, com o polichinelo entrando nos dias em que falta tempo.",
  },
  {
    question: "Pode fazer polichinelo todos os dias?",
    answer:
      "Em volumes moderados, a maioria das pessoas aguenta. O que costuma cobrar não é o coração, é a articulação: é um exercício de salto, com impacto repetido em tornozelo, joelho e quadril. Se aparecer dor que não passa com o aquecimento, a resposta certa é reduzir volume ou trocar por uma versão sem salto, não insistir.",
  },
  {
    question: "Quem está acima do peso pode fazer polichinelo?",
    answer:
      "Pode, com cuidado redobrado com o impacto — quanto maior o peso corporal, maior a carga que cai no joelho e no tornozelo a cada aterrissagem. Existe a versão sem salto, em que um pé desliza de cada vez para o lado enquanto os braços sobem: mantém o gasto e tira quase todo o impacto. Se houver dor articular ou condição cardiovascular, vale conversar com quem acompanha você antes.",
  },
  {
    question: "Polichinelo queima quantas calorias em 10 minutos?",
    answer: `Para ${PESO_EX} kg em ritmo moderado, cerca de ${arredondaKcal(KMIN * 10)} kcal em 10 minutos — uns ${arredondaQuantidade(10 * MOD.cadencia)} polichinelos. Em 5 minutos, perto de ${arredondaKcal(KMIN * 5)} kcal; em 20, uns ${arredondaKcal(KMIN * 20)}; em meia hora, cerca de ${arredondaKcal(KMIN * 30)}. São minutos de salto de verdade: as pausas entre as séries não entram na conta.`,
  },
  {
    question: "Polichinelo queima quantas calorias em 1 hora?",
    answer: `Na conta, cerca de ${arredondaKcal(KMIN * 60)} kcal para ${PESO_EX} kg em ritmo moderado. Na prática, quase ninguém sustenta uma hora seguida de salto — o tornozelo e o joelho pedem pausa muito antes. Uma hora de treino com polichinelo em circuito, com descanso, gasta bem menos que esse número.`,
  },
  {
    question: "1 polichinelo queima quantas calorias?",
    answer: `Bem pouco: cerca de ${virgula(EX_1.kcal, 2)} kcal por repetição para ${PESO_EX} kg em ritmo moderado. É por isso que a pergunta útil é por tempo ou por quantidade — 50 polichinelos ficam perto de ${arredondaKcal(EX_50.kcal)} kcal, e 100, perto de ${arredondaKcal(EX_100.kcal)}.`,
  },
  {
    question: "500 polichinelos queimam quantas calorias?",
    answer: `Cerca de ${arredondaKcal(EX_500.kcal)} kcal para uma pessoa de ${PESO_EX} kg, em uns ${formataTempo(EX_500.minutos)} de salto. Feitos em séries ao longo do dia, o gasto é parecido; o que muda é que fica muito mais fácil manter a execução.`,
  },
  {
    question: "Quantos polichinelos para queimar 300 ou 500 calorias?",
    answer: `Para ${PESO_EX} kg em ritmo moderado, cerca de ${arredondaQuantidade(PARA_300.quantidade)} polichinelos (por volta de ${formataTempo(PARA_300.minutos)}) para 300 kcal e cerca de ${arredondaQuantidade(PARA_500.quantidade)} (por volta de ${formataTempo(PARA_500.minutos)}) para 500 kcal. É volume alto para um exercício de impacto: para esse gasto, misturar com caminhada, bicicleta ou musculação costuma funcionar melhor.`,
  },
  {
    question: "Quantos polichinelos para perder 1 kg?",
    answer: `Só como simulação: usando a referência clássica de ${KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal por quilo de gordura, seriam cerca de ${arredondaQuantidade(UM_QUILO.quantidade).toLocaleString("pt-BR")} polichinelos para ${PESO_EX} kg — por volta de ${formataTempo(UM_QUILO.minutos)} de salto. O corpo não funciona como essa conta (ele se adapta, e o resto do dia pesa mais), mas ela mostra por que a alimentação decide a perda de peso.`,
  },
  {
    question: "50 polichinelos por dia fazem diferença?",
    answer: `No gasto, pouco: cerca de ${arredondaKcal(EX_50.kcal)} kcal para ${PESO_EX} kg. Como hábito, podem fazer — servem de aquecimento, tiram você da cadeira e são um começo para quem está parado. O resultado vem de somar isso a um treino que progride e a uma alimentação que fecha a conta da semana.`,
  },
  {
    question: "Polichinelo é exercício aeróbico (cardio)?",
    answer:
      "É. Ele eleva a frequência cardíaca e a respiração, e o Compêndio de Atividades Físicas o cita como exemplo de calistenia de esforço vigoroso. Por ter salto, também trabalha coordenação e a resistência de panturrilha e quadril — mas não substitui a musculação para ganhar força.",
  },
  {
    question: "Quais os benefícios do polichinelo?",
    answer:
      "Não precisa de equipamento nem de espaço, aquece o corpo inteiro em pouco tempo, melhora o condicionamento e a coordenação e soma gasto ao seu dia. Os limites também contam: é exercício de impacto, não queima gordura de um lugar específico e, sozinho, não constrói músculo.",
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

export default function CalculadoraPolichinelosPage() {
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
            Calculadora de Polichinelos
          </h1>
          <Compartilhar
            contexto="tool"
            titulo="Calculadora de Polichinelos"
            caminho={CAMINHO}
            local="tool_top"
            ferramenta="polichinelos"
            aparencia="discreto"
            className="mb-5"
          />
          <p className="text-gray-300 text-lg leading-relaxed">
            Descubra quantas calorias você pode gastar, quanto tempo leva e quantos polichinelos fazer de acordo
            com o seu peso e o seu ritmo.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraPolichinelos placement="calculadora-polichinelos" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quantas calorias o polichinelo queima?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Para uma pessoa de {PESO_EX} kg em ritmo moderado, cada minuto de polichinelo custa cerca de{" "}
              <strong className="text-white">
                {(EX_100.kcal / Math.max(EX_100.minutos, 0.0001)).toFixed(1).replace(".", ",")} kcal
              </strong>
              . Isso dá aproximadamente {arredondaKcal(EX_100.kcal)} kcal em 100 polichinelos,{" "}
              {arredondaKcal(EX_500.kcal)} kcal em 500 e {arredondaKcal(EX_1000.kcal)} kcal em 1.000.
            </p>
            <p className="text-gray-300 leading-relaxed mb-5">
              Cinco coisas mudam esse número: <strong className="text-white">peso corporal</strong> (é o que mais
              pesa — corpos maiores movem mais massa), <strong className="text-white">intensidade</strong>,{" "}
              <strong className="text-white">duração</strong>, <strong className="text-white">cadência</strong> e{" "}
              <strong className="text-white">condicionamento</strong> — quem já é treinado costuma executar o mesmo
              movimento com menos desperdício de energia, o que curiosamente reduz um pouco o gasto.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">
                  Gasto estimado em 100 polichinelos, em ritmo moderado, por peso corporal
                </caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5 pr-4">
                      Peso
                    </th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5 pr-4">
                      100 polichinelos
                    </th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">
                      Tempo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TABELA_100.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {l.kcal} kcal</td>
                      <td className="text-gray-400 py-2.5 tabular-nums">{formataTempo(l.minutos)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              Estimativa em ritmo moderado, a {MOD.cadencia} polichinelos por minuto. Use a calculadora acima para
              o seu peso e o seu ritmo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quantos polichinelos por dia devo fazer?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Não existe número universal — e desconfie de quem der um. O volume que faz sentido depende do que
              você aguenta hoje com execução limpa, e o limite costuma ser articular antes de ser
              cardiovascular.
            </p>
            <div className="space-y-3 mb-4">
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">Quem está começando</strong> normalmente se dá melhor com séries
                curtas e pausa: 20 a 30 repetições, parar, respirar, repetir. É o formato que permite manter a
                técnica até o fim.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">Quem já se movimenta</strong> aguenta séries maiores e pausas
                menores, e é aí que o exercício começa a render de verdade como cardio.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">Quem é condicionado</strong> costuma usar polichinelo como
                aquecimento ou dentro de circuito, não como o treino inteiro — porque a essa altura ele já não é
                estímulo suficiente sozinho.
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Nada disso é prescrição pelo nível: são referências de ponto de partida. Peso corporal, histórico
              de dor no joelho e no tornozelo, e o que mais você faz na semana mudam o número mais do que
              qualquer rótulo de iniciante ou avançado.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              100 polichinelos por dia emagrecem?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Sozinhos, não — e não existe número mágico. Cem polichinelos gastam cerca de{" "}
              {arredondaKcal(EX_100.kcal)} kcal para quem pesa {PESO_EX} kg, o que é real mas pequeno perto do
              gasto de um dia inteiro. O que emagrece é o balanço energético ao longo de semanas, e ele é
              decidido muito mais pelo que você come e pelo quanto se movimenta no total do que por um
              exercício específico.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Isso não torna o hábito inútil. Cem por dia durante um mês somam algo em torno de{" "}
              {arredondaKcal(EX_100.kcal * 30)} kcal, e o ganho de condicionamento e de constância costuma valer
              mais que a conta. Só não confunda uma contribuição com a estratégia inteira —{" "}
              <Link href="/blog/deficit-calorico-como-calcular" className={ln}>
                como funciona o déficit calórico
              </Link>{" "}
              explica onde o resultado realmente é decidido.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quantos polichinelos para perder barriga?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">{NOTA_SEM_PERDA_LOCALIZADA}</p>
            <p className="text-gray-300 leading-relaxed">
              É por isso que abdominal não seca a barriga e polichinelo também não. A gordura abdominal sai
              quando a gordura do corpo inteiro sai, e a ordem em que isso acontece é individual. O melhor uso do
              polichinelo é como parte de uma estratégia maior: uma das fontes de gasto da semana, ao lado da
              caminhada, da musculação e da movimentação do dia.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quantos polichinelos equivalem a 30 minutos de caminhada?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Para {PESO_EX} kg, 30 minutos de caminhada moderada representam cerca de{" "}
              <strong className="text-white">{arredondaKcal(CAM_30.kcalCaminhada)} kcal</strong>. Um gasto
              energético parecido com polichinelos sairia em torno de{" "}
              <strong className="text-white">{arredondaQuantidade(CAM_30.polichinelo.quantidade)}</strong>{" "}
              repetições, aproximadamente {formataTempo(CAM_30.polichinelo.minutos)}.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              A comparação é de <strong className="text-white">gasto energético aproximado</strong>, nunca de
              efeito. Os dois exercícios pedem coisas diferentes do corpo: a caminhada é contínua, de baixo
              impacto e sustentável por muito tempo; o polichinelo é intermitente, de impacto e cansa rápido. Na
              prática quase ninguém faz {arredondaQuantidade(CAM_30.polichinelo.quantidade)} polichinelos
              seguidos — e não precisa.
            </p>
            <p className="text-gray-400 text-sm">
              Calcule acima com o seu peso, o seu ritmo e o tempo de caminhada que você costuma fazer.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quantos polichinelos para emagrecer 1 kg?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Essa pergunta tem uma resposta matemática e uma resposta fisiológica, e elas não são a mesma
              coisa.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Em termos puramente matemáticos: um quilo de gordura corporal armazena cerca de{" "}
              {KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal. Para alguém de {PESO_EX} kg em ritmo moderado,
              essa energia corresponderia a aproximadamente{" "}
              <strong className="text-white">{arredondaQuantidade(UM_QUILO.quantidade).toLocaleString("pt-BR")}</strong>{" "}
              polichinelos — o que daria em torno de {formataTempo(UM_QUILO.minutos)} de exercício contínuo.
            </p>
            <div className="border-l-2 pl-4 mb-4" style={{ borderColor: "#BA9E50" }}>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">
                  Isso NÃO significa que fazer essa quantidade fará você perder exatamente 1 kg.
                </strong>{" "}
                É uma simulação teórica, não uma prescrição — e ninguém deveria tentar executar esse volume.
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              O corpo não responde de forma linear. {FONTE_HALL.rotuloCurto} {FONTE_HALL.resumo} Além disso,
              exercício muda o apetite, a movimentação espontânea do resto do dia e a composição do que se
              perde. Por isso a conta das {KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal serve para dar
              noção de ordem de grandeza — e o que ela mostra, na verdade, é justamente por que tentar emagrecer
              só com um exercício é o caminho mais difícil.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Polichinelo ou caminhada: qual gasta mais calorias?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Por minuto, o polichinelo gasta mais: em ritmo moderado ele fica em {MOD.met} METs contra{" "}
              {RITMOS_CAMINHADA[1].met} da caminhada moderada — quase o dobro. Só que essa comparação esconde o
              que decide o resultado na vida real: <strong className="text-white">quanto tempo você mantém</strong>.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Meia hora de caminhada é trivial para a maioria das pessoas. Meia hora de polichinelo contínuo não
              é para quase ninguém. Some isso ao impacto articular e a conta muda: o exercício que gasta mais é
              o que você consegue repetir várias vezes por semana sem se machucar. Não existe vencedor
              universal — existe o que cabe na sua semana e no seu corpo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como aumentar o gasto calórico com segurança
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              A progressão que funciona é chata de tão simples: aumente uma coisa de cada vez. Mais séries antes
              de mais repetições por série; mais repetições antes de mais velocidade; velocidade por último,
              porque é ela que multiplica o impacto.
            </p>
            <p className="text-gray-300 leading-relaxed">
              E distribua. Um dia com caminhada, musculação e alguns minutos de polichinelo rende mais que um dia
              com mil polichinelos e nada mais — gasta parecido, cansa menos as mesmas articulações e é muito
              mais fácil de repetir amanhã. Se a sua dúvida é quanto de cardio cabe na sua semana,{" "}
              <Link href="/blog/quanto-de-cardio-fazer" className={ln}>
                quanto de cardio fazer
              </Link>{" "}
              trata exatamente disso.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como calculamos
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              O gasto sai da equação de METs usada em fisiologia do exercício:
            </p>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">
                {MOD.met} × 3,5 × {PESO_EX} ÷ 200 ={" "}
                <span className="text-white">
                  ≈ {(EX_100.kcal / Math.max(EX_100.minutos, 0.0001)).toFixed(1).replace(".", ",")} kcal/min
                </span>
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os valores de MET vêm do {FONTE_COMPENDIO.rotuloCurto}, que {FONTE_COMPENDIO.resumo} Uma ressalva
              importante e que raramente é dita: <strong className="text-white">o Compêndio não tem uma linha
              exclusiva para polichinelo</strong> — ele aparece nomeado como exemplo dentro das entradas de
              calistenia, que é a categoria fisiologicamente mais próxima. As três faixas desta calculadora são:
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Valores de MET e cadência usados em cada intensidade</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5 pr-4">
                      Ritmo
                    </th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5 pr-4">
                      MET
                    </th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">
                      De onde vem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {INTENSIDADES.map((i) => (
                    <tr key={i.id} className="border-b border-white/10">
                      <td className="text-white py-2.5 pr-4 font-medium whitespace-nowrap">
                        {i.nome}
                        <span className="block text-gray-500 text-xs font-normal">~{i.cadencia}/min</span>
                      </td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums align-top">{i.met}</td>
                      <td className="text-gray-400 py-2.5 leading-relaxed">{i.origem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              A faixa moderada é <strong className="text-white">interpolada</strong> entre as duas do Compêndio,
              e está marcada como tal porque não existe uma terceira medição entre elas. Fingir que existe seria
              inventar precisão — o mesmo motivo pelo qual a ferramenta devolve &ldquo;aproximadamente 74
              kcal&rdquo; e nunca &ldquo;74,382 kcal&rdquo;.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 21 de setembro de 2026 por{" "}
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
            <FAQ itens={faq} placement="ferramenta-polichinelos" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>
              Referências
            </h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {[FONTE_COMPENDIO, FONTE_ACSM, FONTE_WISHNOFSKY, FONTE_HALL].map((f) => (
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
                <Link href="/blog/polichinelo-emagrece" className={ln}>
                  Polichinelo emagrece? A resposta honesta
                </Link>
              </li>
              <li>
                <Link href="/blog/polichinelo-queima-quantas-calorias" className={ln}>
                  Polichinelo queima quantas calorias
                </Link>
              </li>
              <li>
                <Link href="/blog/quanto-tempo-de-caminhada-por-dia" className={ln}>
                  Quanto tempo de caminhada por dia
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
