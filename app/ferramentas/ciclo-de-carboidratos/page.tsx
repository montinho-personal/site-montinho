import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraCiclo from "@/components/carboidratos/CalculadoraCiclo";
import {
  CARB_MIN_DIA, DIAS_LONGOS, FRASE_CENTRAL, NOME_NIVEL, RAZAO_MAX_ALTO_BAIXO,
  calculaCiclo, gPorKg, type DiaEntrada,
} from "@/lib/carboidratos/ciclo";

/**
 * A página da Calculadora de Ciclo de Carboidratos.
 *
 * Divisão de papéis com o artigo /blog/ciclo-de-carboidratos-carb-cycling:
 * a ferramenta responde "como montar / quanto em cada dia" (calculadora,
 * como fazer, dia alto e baixo); o artigo fica com "o que é / funciona?".
 * Os dois se linkam. Todo número do texto sai do mesmo motor da ferramenta.
 */

const CAMINHO = "/ferramentas/ciclo-de-carboidratos";

export const metadata: Metadata = {
  title: "Calculadora de Ciclo de Carboidratos (Carb Cycling)",
  description:
    "Monte seu ciclo de carboidratos com dias alto, médio e baixo de acordo com seus treinos. Veja quanto carboidrato comer em cada dia da semana, grátis.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Ciclo de Carboidratos | Montinho Personal Trainer",
    description: "Dias de carbo alto, médio e baixo definidos pelo seu treino, com a média da semana preservada.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Ciclo de Carboidratos",
  descricao:
    "Distribui o carboidrato da semana em dias alto, médio e baixo conforme o tipo, a duração e a intensidade de cada treino, mantendo calorias e proteína estáveis e a média semanal preservada.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Ciclo de Carboidratos", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "text-white underline underline-offset-4 decoration-1 hover:opacity-80";

/* ── O exemplo da página, calculado pelo motor ── */
const M = (min: number, i: "moderado" | "pesado" | "muito-pesado"): DiaEntrada => ({ sessoes: [{ tipo: "musculacao", minutos: min, intensidade: i }] });
const DESCANSO: DiaEntrada = { sessoes: [] };
const SEMANA_EX: DiaEntrada[] = [
  M(75, "muito-pesado"), M(60, "moderado"), DESCANSO, M(75, "pesado"), M(60, "moderado"),
  { sessoes: [{ tipo: "corrida", minutos: 90, intensidade: "moderado" }] }, DESCANSO,
];
const ROTULO_EX = ["Pernas, alto volume", "Superiores", "Descanso", "Pernas", "Superiores", "Corrida de 90 min", "Descanso"];
const PESO_EX = 75;
const KCAL_EX = 2200;
const EX = calculaCiclo({ kcal: KCAL_EX, pesoKg: PESO_EX, objetivo: "manter" }, SEMANA_EX);
const ALTO = Math.max(...EX.dias.map((d) => d.carb));
const BAIXO = Math.min(...EX.dias.map((d) => d.carb));

const faq: ItemFAQ[] = [
  { question: "O que é ciclo de carboidratos?", answer: "É alternar a quantidade de carboidrato entre os dias: mais nos dias de treino mais exigente, menos nos dias de descanso ou de treino leve. Em inglês, carb cycling. A ideia central é distribuir o combustível conforme a demanda, não criar um efeito especial no metabolismo." },
  { question: "Como montar um ciclo de carboidratos?", answer: "Defina as calorias e a proteína da semana, olhe o que você treina em cada dia e coloque mais carboidrato nos dias de maior demanda e menos nos de menor demanda, mantendo a média da semana. A calculadora acima faz essa conta a partir do tipo, da duração e da intensidade de cada treino." },
  { question: "Quantos dias altos e quantos baixos?", answer: "Não existe número certo. Quem treina pesado três vezes na semana costuma ter três dias que pedem mais e quatro que pedem menos; quem treina parecido todos os dias tem pouca diferença para ciclar. É a sua semana que define, não um padrão fixo." },
  { question: "Dia de perna deve ser carbo alto?", answer: "Só se ele for, de fato, o treino mais exigente da sua semana. Um treino de pernas longo e de alto volume costuma ser; um treino curto e leve, não. Por isso a calculadora pergunta duração e intensidade em vez de assumir pelo grupo muscular." },
  { question: "Dia de descanso deve ser carbo baixo?", answer: "Normalmente é o dia de menor demanda, então recebe menos. Mas baixo não é zero: a calculadora não deixa o dia baixo cair abaixo de 130 g quando a sua média permite, e você pode marcar o descanso como médio ou alto se preferir organizar assim." },
  { question: "Ciclo de carboidratos emagrece?", answer: "O que emagrece é o déficit calórico da semana. Com as mesmas calorias e a mesma proteína, ciclar não tem vantagem comprovada sobre comer o mesmo carboidrato todo dia. Pode ajudar quem se organiza melhor assim, ou quem quer render mais nos treinos pesados durante a dieta." },
  { question: "Ciclo de carboidratos ajuda a ganhar massa?", answer: "Pode ajudar a pôr mais combustível nos treinos mais pesados. Mas o ganho de massa depende do conjunto: treino com progressão, calorias suficientes, proteína e recuperação. O ciclo é um ajuste fino, não o motor do resultado." },
  { question: "Preciso mudar a proteína também?", answer: "Não. Na maioria dos casos a proteína fica igual todos os dias; o que varia é o carboidrato, e a gordura compensa um pouco para as calorias do dia ficarem parecidas." },
  { question: "Preciso mudar as calorias?", answer: "Não é obrigatório. Nesta calculadora as calorias do dia ficam estáveis e só o carboidrato muda de lugar, que é o jeito mais simples de começar. Variar também as calorias entre os dias é uma estratégia avançada, não melhor." },
  { question: "O que comer no dia alto?", answer: "As mesmas refeições, com porções maiores de fontes de carboidrato: arroz, batata, mandioca, pão, macarrão, frutas, aveia. De preferência perto do treino. Dia alto não é dia livre." },
  { question: "O que comer no dia baixo?", answer: "Porções menores de carboidrato e um pouco mais de gordura (azeite, ovos, castanhas), mantendo a proteína. Dia baixo não é dieta cetogênica nem jejum." },
  { question: "O que é ciclo de carboidratos 5x2?", answer: "É um padrão pronto: cinco dias com menos carboidrato e dois com mais. Pode funcionar se a sua semana for assim, mas um padrão fixo ignora quais dias você treina mais. A calculadora parte do seu treino em vez de um padrão." },
  { question: "Ciclo de carboidratos no cutting funciona?", answer: "No cutting, ele serve para concentrar o carboidrato disponível nos treinos mais pesados, ajudando o desempenho com a mesma dieta. A perda de gordura continua vindo do déficit da semana, não da alternância." },
  { question: "Ciclo de carboidratos acelera o metabolismo?", answer: "Não há evidência de que alternar carboidrato acelere o metabolismo ou impeça a adaptação à dieta por si só. O que ele faz é mudar onde o combustível fica ao longo da semana." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

export default function CicloDeCarboidratosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Ciclo de Carboidratos</span>
          </nav>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>Calculadora de Ciclo de Carboidratos</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Monte seus dias de carbo alto, médio e baixo conforme a sua rotina de treino. {FRASE_CENTRAL}</p>
          <Compartilhar contexto="tool" titulo="Calculadora de Ciclo de Carboidratos" caminho={CAMINHO} local="tool_top" ferramenta="ciclo-carboidratos" aparencia="discreto" className="mt-4" />
        </div>
      </section>

      <section className="pb-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraCiclo placement="ciclo-de-carboidratos" />
          <noscript><p className="text-gray-300 mt-4">A calculadora precisa de JavaScript. O passo a passo para montar o ciclo na mão está logo abaixo.</p></noscript>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como fazer um ciclo de carboidratos</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong className="text-white">Defina as calorias da semana.</strong> Elas vêm do seu objetivo: déficit para emagrecer, superávit para ganhar massa. Se não sabe, use a <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>Calculadora de Déficit</Link> ou a de <Link href="/ferramentas/calculadora-macros" className={ln}>Macros</Link>.</li>
              <li><strong className="text-white">Fixe a proteína.</strong> Ela fica igual todos os dias.</li>
              <li><strong className="text-white">Olhe o que você treina em cada dia.</strong> Tipo, duração e intensidade dizem quanto combustível aquele dia pede.</li>
              <li><strong className="text-white">Distribua o carboidrato.</strong> Mais nos dias de maior demanda, menos nos de menor, sem mudar a média da semana. A gordura compensa um pouco para as calorias do dia ficarem parecidas.</li>
              <li><strong className="text-white">Transforme em comida.</strong> O <Link href="/ferramentas/monte-seu-cardapio" className={ln}>Monte seu Cardápio</Link> monta as refeições, e a <Link href="/ferramentas/substituicao-de-alimentos" className={ln}>Troca Certa</Link> diz quanto de batata ou pão vai no lugar do arroz.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Exemplo de uma semana de ciclo de carboidratos</h2>
            <p className="mb-4">
              {PESO_EX} kg, {KCAL_EX.toLocaleString("pt-BR")} kcal por dia, musculação quatro vezes e uma corrida longa no sábado. Calculado pela ferramenta acima:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Exemplo de ciclo de carboidratos semanal</caption>
                <thead>
                  <tr className="border-b border-white/20 text-left text-gray-400">
                    <th scope="col" className="py-2 pr-3 font-medium">Dia</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Treino</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Nível</th>
                    <th scope="col" className="py-2 font-medium">Carboidrato</th>
                  </tr>
                </thead>
                <tbody>
                  {EX.dias.map((d, i) => (
                    <tr key={DIAS_LONGOS[i]} className="border-b border-white/10">
                      <td className="py-2 pr-3 text-white">{DIAS_LONGOS[i]}</td>
                      <td className="py-2 pr-3">{ROTULO_EX[i]}</td>
                      <td className="py-2 pr-3">{NOME_NIVEL[d.nivel]}</td>
                      <td className="py-2 tabular-nums">{d.carb} g ({gPorKg(d.carb, PESO_EX).toLocaleString("pt-BR")} g/kg)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-3">
              Média: {EX.media.carb} g de carboidrato por dia, {EX.media.prot} g de proteína e cerca de {EX.media.kcal.toLocaleString("pt-BR")} kcal todos os dias. O dia mais alto tem {ALTO} g e o mais baixo, {BAIXO} g.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Dia alto, médio e baixo de carboidrato</h2>
            <ul className="space-y-2">
              <li><strong className="text-white">Dia alto:</strong> o dia de treino mais exigente da sua semana — longo, intenso ou com dois treinos. Recebe mais carboidrato.</li>
              <li><strong className="text-white">Dia médio:</strong> treinos de demanda moderada. Fica perto da sua média.</li>
              <li><strong className="text-white">Dia baixo:</strong> descanso ou treino leve. Recebe menos carboidrato e um pouco mais de gordura. Não é dia de jejum, de dieta cetogênica nem de &quot;queimar gordura&quot;.</li>
            </ul>
            <p className="mt-3">Dia alto também não é refeed nem dia do lixo: as calorias seguem as mesmas, só a composição muda.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Quantos carboidratos no dia alto e no dia baixo?</h2>
            <p>
              Depende da sua média, que vem das calorias. A calculadora reparte essa média conforme a demanda de cada dia, com limites para não criar
              extremos: o dia baixo não cai abaixo de {CARB_MIN_DIA} g quando a média permite, o alto não passa de {String(RAZAO_MAX_ALTO_BAIXO).replace(".", ",")} vez o baixo, e a
              gordura fica entre 20% e 35% das calorias. Para comparar, as diretrizes esportivas vão de cerca de 3 a 10 g de carboidrato por kg por
              dia conforme a carga de treino; por isso o resultado mostra também os gramas por kg.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Ciclo de carboidratos para emagrecer (e no cutting)</h2>
            <p>
              Quem emagrece é o déficit calórico da semana. Com as mesmas calorias e a mesma proteína, os estudos não mostram vantagem do ciclo
              sobre comer o mesmo carboidrato todos os dias. O que ele pode fazer no cutting é colocar o carboidrato disponível onde ele rende mais —
              nos treinos pesados — e ajudar quem se organiza melhor com dias diferentes. Se quiser ver a sua média de calorias, comece pela{" "}
              <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>Calculadora de Déficit</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Ciclo de carboidratos para hipertrofia</h2>
            <p>
              Mais carboidrato nos dias de treino de maior volume pode ajudar o desempenho nesses treinos. Em musculação de volume moderado, porém,
              a quantidade de carboidrato do dia muda pouco o rendimento — é por isso que a calculadora não trata todo treino como dia alto. O ganho
              de massa continua dependendo de treino com progressão, calorias, proteína e recuperação.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Ciclo 5x2, 4x3 e outros padrões prontos</h2>
            <p>
              Padrões como &quot;5 dias baixos e 2 altos&quot; são fáceis de seguir, mas ignoram quais dias você realmente treina mais. Se o seu treino mais
              pesado é na terça, um padrão que põe o dia alto no sábado erra o alvo. A calculadora faz o contrário: o treino define a demanda, e a
              demanda define o dia.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Ciclo de carboidratos funciona?</h2>
            <p>
              Depende do que se espera dele. Para distribuir carboidrato conforme o treino, faz sentido. Como estratégia superior para emagrecer,
              acelerar o metabolismo ou mexer com hormônios, a evidência é limitada. Para a parte científica completa, leia o{" "}
              <Link href="/blog/ciclo-de-carboidratos-carb-cycling" className={ln}>guia de ciclo de carboidratos</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como calculamos</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Proteína e gordura média saem da mesma conta da <Link href="/ferramentas/calculadora-macros" className={ln}>Calculadora de Macros</Link>: proteína de 1,6 a 2,0 g/kg conforme o objetivo e gordura média de 30% das calorias. O carboidrato médio é o que sobra.</li>
              <li>Cada treino vira uma pontuação interna: minutos × peso do tipo (corrida e bike pesam mais por minuto que musculação, que é intermitente) × intensidade.</li>
              <li>O nível de cada dia é relativo à sua semana: o dia alto é o mais exigente para você. Se a semana é homogênea, o carboidrato fica igual.</li>
              <li>As calorias do dia ficam estáveis; o carboidrato varia e a gordura compensa, entre 20% e 35% das calorias.</li>
              <li>Os pesos e faixas são estimativas de ordem de grandeza, não medições do seu corpo. Por isso cada dia mostra também uma faixa.</li>
            </ul>
            <p className="text-sm mt-3">
              Referências: Thomas, Erdman e Burke, posicionamento conjunto ACSM/Academy of Nutrition and Dietetics/Dietitians of Canada sobre nutrição e
              desempenho (2016); Impey e colaboradores, &quot;Fuel for the work required&quot;, Sports Medicine (2018); Henselmans e colaboradores, revisão
              sistemática sobre carboidrato e treino de força, Nutrients (2022); Institute of Medicine, Dietary Reference Intakes (2005).
            </p>
            <p className="text-gray-400 text-sm mt-3">Por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Estimativa educativa para adultos saudáveis, não prescrição nutricional individual.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Perguntas frequentes sobre ciclo de carboidratos</h2>
            <FAQ itens={faq} placement="ferramenta-ciclo-carboidratos" />
          </div>
        </div>
      </section>
    </>
  );
}
