import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import OutrosSimuladores from "@/components/simulador/OutrosSimuladores";
import Compartilhar from "@/components/share/Compartilhar";
import SimuladorFimDeSemana from "@/components/simulador/SimuladorFimDeSemana";
import { FONTES_FDS, comparaRefeicaoFds, fmtKcal, recomecar, semana, type EntradaFds } from "@/lib/simulador/fim-de-semana";

/**
 * A página do Simulador do Fim de Semana — o quarto Simulador Montinho.
 *
 * O PAPEL AO LADO DO ARTIGO IRMÃO
 *
 * O artigo /blog/fim-de-semana-estraga-a-dieta é dono da pergunta
 * informativa ("fim de semana estraga a dieta?"). Esta página é dona da
 * intenção de TESTAR: outro H1, outra URL, um FAQ curto que responde as
 * dúvidas do uso e aponta para o artigo e para os vizinhos (dia do lixo,
 * álcool, balança, retenção) em vez de reescrevê-los.
 *
 * Os exemplos do texto saem do motor no build — nada de número digitado à mão.
 */

const CAMINHO = "/ferramentas/simulador-fim-de-semana";

export const metadata: Metadata = {
  title: "Fim de Semana Estraga a Dieta? Simule o Saldo da Semana",
  description:
    "Faz dieta de segunda a sexta e o peso não cai? Veja quanto do déficit sábado e domingo consomem e teste refeições, bebidas e passos. Grátis.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Meu fim de semana realmente estraga a dieta? | Montinho Personal Trainer",
    description: "O raio-x dos seus sete dias: quanto a semana construiu, quanto o fim de semana consumiu e o que mudaria com uma coisa só.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Simulador do Fim de Semana",
  descricao: "Calcula o saldo energético dos sete dias a partir da rotina da semana e do fim de semana (refeições, bebidas e movimento), mostra quanto do déficit dos dias úteis o fim de semana consome, compara cenários e projeta o padrão por 4, 8 e 12 semanas com um modelo dinâmico.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Simuladores", item: `${SITE_URL}/simuladores` },
    { "@type": "ListItem", position: 4, name: "Simulador do Fim de Semana", item: `${SITE_URL}${CAMINHO}` },
  ],
};

/* ── Exemplos de referência, calculados no build ── */
const REF: EntradaFds = {
  objetivo: "emagrecer", modo: "sei", sexo: "f", idade: 35, alturaCm: 165, pesoKg: 75, manutencaoKcal: 2200, rotina: "sentado",
  kcalUtil: 1700, kcalSabado: 3100, kcalDomingo: 2800, kcalSextaExtra: 0,
  comoCome: "plano", sexta: "nao", sabado: "igual", domingo: "igual", eventos: [], movimento: "parecido",
  passosUtil: null, passosSabado: null, passosDomingo: null, treinaFds: "nao", compensa: "nao", medicacao: "nao",
};
const EX = semana(REF);
const EX2 = semana({ ...REF, kcalSabado: 2900, kcalDomingo: 2200 });
const CMP = comparaRefeicaoFds(REF);
const RR = recomecar(REF);
const pct = (n: number | null) => `${Math.round((n ?? 0) * 100)}%`;

const faq: ItemFAQ[] = [
  { question: "Uma pizza estraga a dieta?", answer: "Não sozinha. Uma refeição diferente reduz parte do déficit da semana; raramente o apaga. Pizza pode fazer parte da alimentação — o impacto depende de porção, frequência e do saldo total. O que muda o resultado de verdade é a duração: quando a pizza de sábado vira sábado inteiro, domingo e “recomeço na segunda”." },
  { question: "Um dia fora da dieta engorda?", answer: "Um dia acima da manutenção reduz o déficit da semana; se ele deixa a semana inteira acima da manutenção depende do tamanho do exagero e dos outros seis dias. A balança do dia seguinte sobe por água e comida no intestino, não pela gordura toda. Teste no simulador com o seu dia." },
  { question: "Dois dias fora da dieta podem zerar o déficit da semana?", answer: `Podem. No exemplo de referência do simulador (quem cria cerca de 2.500 kcal de déficit de segunda a sexta), sexta à noite, sábado e domingo fora da rotina deixam a semana em ${fmtKcal(CMP.b.saldo.mid)} — contra ${fmtKcal(CMP.a.saldo.mid)} com só uma refeição mais livre. O que pesa é a soma dos dias, não um alimento.` },
  { question: "É possível ganhar 2 kg de gordura em um fim de semana?", answer: "Na prática, não. Seria preciso algo como 18 mil kcal acima do gasto em dois ou três dias. A maior parte de um salto rápido na balança é água, glicogênio, sódio e conteúdo intestinal. Isso não quer dizer que não possa ter havido saldo positivo — o simulador mostra o teto de tecido que a energia extra permitiria." },
  { question: "Quanto tempo demora para desinchar depois do fim de semana?", answer: "Com a rotina normal de volta, a maior parte da oscilação costuma baixar em dois a cinco dias. Sem cortar comida nem água: desidratar só troca um número enganoso por outro. Compare a média da semana com a da semana anterior." },
  { question: "Preciso fazer jejum depois de exagerar?", answer: "Não. Jejum para “pagar” o sábado não faz parte de uma estratégia e tende a puxar o próximo exagero. O caminho é voltar à rotina normal na próxima refeição. Se comer e compensar virou um ciclo difícil de controlar, converse com um profissional de saúde." },
  { question: "Preciso fazer mais cardio para compensar o fim de semana?", answer: "Não. Cardio como punição transforma treino em dívida e costuma durar pouco. Se você quer se mexer mais no fim de semana porque gosta — uma caminhada, uma trilha —, ótimo: o simulador mostra o que passos a mais mudam. Mas o treino não é crédito para comer, nem multa." },
  { question: "Cerveja pode zerar meu déficit?", answer: "Pode reduzir bastante. Uma lata tem 140 a 160 kcal; oito latas no sábado passam de 1.100 — quase metade de um déficit de 500 kcal por dia útil. No simulador, compare o seu fim de semana com metade das bebidas." },
  { question: "Quanto posso comer no fim de semana?", answer: "O simulador não dá um número para você comer — é uma simulação de cenário, não uma prescrição. Ele mostra o que o seu fim de semana atual faz com a sua semana e deixa você testar mudanças. Quem precisa de um plano alimentar individual deve procurar um nutricionista." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const cta = "text-gray-300 text-sm underline underline-offset-4 decoration-1 hover:text-white min-h-[44px] inline-flex items-center";

function Secao({ titulo, id, aberto, children }: { titulo: string; id?: string; aberto?: boolean; children: React.ReactNode }) {
  return (
    <details id={id} open={aberto} className="group border-b border-white/10 pb-2 scroll-mt-24">
      <summary className="cursor-pointer list-none flex items-start justify-between gap-4 py-3 min-h-[56px]">
        <h2 className="text-xl sm:text-2xl font-bold text-white" style={h}>{titulo}</h2>
        <span aria-hidden="true" className="shrink-0 mt-1 text-[#BA9E50] text-2xl leading-none transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="pt-2 pb-4">{children}</div>
    </details>
  );
}

export default function SimuladorFimDeSemanaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <Link href="/simuladores" className="hover:text-white">Simuladores</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Simulador do Fim de Semana</span>
          </nav>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Simuladores Montinho · grátis · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>Fim de Semana Estraga a Dieta? Faça a Simulação</h1>
          <Compartilhar contexto="tool" titulo="Simulador do Fim de Semana" caminho={CAMINHO} local="tool_top" ferramenta="simulador-fim-de-semana" aparencia="discreto" className="mb-4" />
          <p className="text-gray-300 text-lg leading-relaxed mb-3">Veja quanto do déficit criado durante a semana sobra depois de sábado e domingo — e teste como refeições, bebidas e atividade física mudam o resultado.</p>
          <p className="text-gray-400 leading-relaxed">Você faz dieta de segunda a sexta, mas o peso não cai? Será que o sábado e o domingo estão anulando o déficit? Ou você acha que estragou tudo quando, na verdade, ainda terminou a semana em déficit? O simulador testa o seu caso.</p>
        </div>
      </section>

      <section className="py-8 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SimuladorFimDeSemana placement="simulador-fim-de-semana" />
          <noscript><p className="text-gray-300 mt-4">O simulador precisa de JavaScript. O exemplo abaixo, em “Como o fim de semana muda o saldo da semana”, funciona sem ele.</p></noscript>
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
            <p className="text-white text-lg font-semibold" style={h}>Seu corpo não reinicia na segunda-feira.</p>
            <p className="text-gray-300 leading-relaxed mt-1">O resultado depende do conjunto dos sete dias. Flexibilidade pode existir dentro de uma estratégia — a ferramenta mostra o impacto em números, sem moralizar comida.</p>
          </div>

          <Secao titulo="Faço tudo certo durante a semana e não emagreço. É o fim de semana?" aberto>
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">Pode ser — ou não.</strong> Quando o peso não cai, há várias hipóteses: a manutenção ser menor do que se imagina, porções maiores que as anotadas, menos movimento no dia a dia, água mascarando a balança, pouco tempo de observação. O fim de semana é uma delas, e é a que este simulador testa: ele mostra se sábado e domingo estão consumindo uma parte grande do déficit ou se a sua semana termina em déficit mesmo com eles.</p>
            <p className="text-gray-300 leading-relaxed">Se o resultado disser que o fim de semana não é o problema, ele diz isso. Para as outras hipóteses: <Link href="/blog/por-que-voce-nao-consegue-emagrecer" className={ln}>por que você não consegue emagrecer</Link> e <Link href="/blog/habitos-que-sabotam-seu-emagrecimento" className={ln}>hábitos que sabotam o emagrecimento</Link>.</p>
          </Secao>

          <Secao titulo="Como o fim de semana muda o saldo da semana?">
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">Pela soma, não pelo alimento.</strong> Exemplo de referência: mulher de 35 anos que gasta cerca de 2.200 kcal por dia e come 1.700 de segunda a sexta. A semana constrói {fmtKcal(EX.construido.mid)}. Se o sábado chega a 3.100 e o domingo a 2.800, o fim de semana consome {fmtKcal(EX.consumido.mid).replace("+", "")} — sobra {fmtKcal(EX.saldo.mid)}, ou {pct(EX.preservado)} do déficit construído.</p>
            <p className="text-gray-300 leading-relaxed">Se o mesmo sábado vier com um domingo igual à semana, sobram {pct(EX2.preservado)}. E uma refeição mais livre no sábado, no lugar do fim de semana inteiro, deixa a semana em {fmtKcal(CMP.a.saldo.mid)}, contra {fmtKcal(CMP.b.saldo.mid)} com sexta, sábado e domingo fora da rotina. Por que isso acontece — e o que fazer na prática — está no artigo <Link href="/blog/fim-de-semana-estraga-a-dieta" className={ln}>por que o fim de semana atrapalha a dieta</Link>.</p>
          </Secao>

          <Secao titulo="Déficit calórico conta por dia ou por semana?">
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">O que decide a tendência é o saldo ao longo dos dias — por isso olhar a semana ajuda.</strong> O corpo não reinicia à meia-noite nem na segunda-feira: um dia acima da manutenção e cinco abaixo formam um saldo só. Calcular o déficit semanal é somar (o que se comeu − o que se gastou) nos sete dias. É exatamente o que o simulador faz, com faixa, porque o gasto é estimado.</p>
            <p className="text-gray-300 leading-relaxed">Dá para comer mais no sábado e um pouco menos nos outros dias? Matematicamente, sim — há quem se organize assim. O limite é comportamental: dias muito baixos para “guardar” calorias costumam aumentar a fome e puxar o exagero, e o saldo semanal serve para entender, não para punir. Para calcular um déficit diário razoável: <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>Calculadora de Déficit Calórico</Link>.</p>
          </Secao>

          <Secao titulo="Uma refeição livre estraga a dieta? E o “dia do lixo”?">
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">Uma refeição, sozinha, raramente apaga a semana.</strong> Pizza, hambúrguer, churrasco ou sobremesa podem fazer parte da alimentação: o impacto depende de porção, frequência e do saldo total.</p>
            <p className="text-gray-300 leading-relaxed">Uma refeição diferente e um dia inteiro sem estrutura produzem saldos muito diferentes — no exemplo acima, a diferença passa de {fmtKcal(CMP.b.saldo.mid - CMP.a.saldo.mid).replace("+", "")} na semana. O chamado “dia do lixo” costuma ser o segundo caso com outro nome. Não existe alimento proibido; existe a soma. Leia <Link href="/blog/dia-do-lixo-funciona" className={ln}>o dia do lixo funciona?</Link> e <Link href="/blog/churrasco-sem-sair-da-dieta" className={ln}>churrasco sem sair da dieta</Link>.</p>
          </Secao>

          <Secao titulo="Por que meu peso aumenta na segunda-feira?">
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">Porque a balança mede massa corporal, não gordura.</strong> Em 24 a 72 horas ela muda com água, glicogênio (cada grama guardado leva água junto), sódio, a quantidade de comida ainda no intestino, o horário da pesagem e a variação normal de um dia para o outro. Quem se pesa todo dia costuma ver o pico no domingo e na segunda (Orsama, 2014).</p>
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">Ganhei 2 kg no fim de semana: é gordura?</strong> Quase certamente não toda. Dois quilos de gordura exigiriam algo como 18 mil kcal acima do gasto em dois ou três dias. Isso não quer dizer que “é só retenção”: se o fim de semana ficou acima da manutenção, uma parte pequena pode ser tecido. Depois de simular, abra “A balança subiu muito na segunda?” e informe quanto subiu — a ferramenta mostra o teto que a energia extra permitiria.</p>
            <p className="text-gray-300 leading-relaxed">Quanto tempo para voltar? Com a rotina normal, a maior parte costuma baixar em dois a cinco dias. A comparação que responde é a média da semana contra a da semana anterior. Veja <Link href="/blog/balanca-nao-muda-mas-o-corpo-muda" className={ln}>por que a balança engana</Link> e <Link href="/blog/retencao-de-liquido-como-desinchar" className={ln}>retenção de líquido</Link>.</p>
          </Secao>

          <Secao titulo="Álcool e cerveja atrapalham o emagrecimento?">
            <p className="text-gray-300 leading-relaxed">O simulador calcula as bebidas por volume × teor alcoólico × 7 kcal por grama de álcool, mais o carboidrato da bebida ou do misturador: uma lata de cerveja fica em 140 a 160 kcal; uma taça de vinho, 115 a 135; uma caipirinha, 180 a 350, conforme o açúcar. O que ele não faz é inventar mecanismo do tipo “o álcool desliga a queima de gordura por X horas”. Energia, efeitos agudos e comportamento são coisas diferentes: a bebida soma calorias sem ocupar espaço no prato, costuma vir com petisco, piora o sono e deixa o domingo mais parado. Dá para beber e emagrecer — a pergunta é quanto isso ocupa do seu saldo, e o simulador mostra. Leia <Link href="/blog/alcool-e-emagrecimento" className={ln}>álcool e emagrecimento</Link>, <Link href="/blog/cerveja-engorda" className={ln}>cerveja engorda?</Link> e <Link href="/blog/vinho-engorda" className={ln}>vinho engorda?</Link>.</p>
          </Secao>

          <Secao titulo="Exagerei no fim de semana: o que faço agora?">
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">Volte para a rotina normal na próxima refeição.</strong> Não é preciso esperar segunda-feira, e não é preciso compensar. Jejum punitivo, cardio para “pagar” a comida, cortar comida drasticamente, desidratar ou qualquer forma de purgação não fazem parte de uma estratégia — tendem a puxar o próximo exagero.</p>
            <p className="text-gray-300 leading-relaxed mb-3">O efeito “já que eu saí da dieta…” é o que transforma uma refeição em fim de semana. No exemplo, voltar na refeição seguinte custa cerca de {fmtKcal(RR.b).replace("+", "")}; adiar a volta para segunda custa {fmtKcal(RR.a).replace("+", "")} — {RR.diasDeDeficit !== null ? `o equivalente a uns ${Math.round(RR.diasDeDeficit)} dias do déficit da semana` : "várias vezes mais"}. A diferença não vem do alimento; vem da decisão de adiar. E não precisa compensar: nada de jejum punitivo nem de cardio para “pagar” — só voltar à rotina.</p>
            <p className="text-gray-300 leading-relaxed">Se comer e compensar virou um ciclo difícil de controlar, vale conversar com um profissional de saúde — veja também <Link href="/blog/compulsao-alimentar-como-controlar" className={ln}>compulsão alimentar</Link>.</p>
          </Secao>

          <Secao titulo="Por que eu saio da dieta no fim de semana?">
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">Quase nunca é falta de força de vontade.</strong> O fim de semana muda a rotina inteira: horários, sono, eventos sociais, bebida, comida mais disponível. E existe o pensamento tudo-ou-nada — “já que eu saí, agora só segunda” —, que transforma uma refeição em três dias. O recomeço fica marcado para a segunda porque datas redondas parecem um bom começo, mas cada refeição é uma oportunidade.</p>
            <p className="text-gray-300 leading-relaxed">O que costuma ajudar é decidir antes: qual será a refeição social, o que acontece na seguinte, quanto beber. Um plano que inclui o sábado aguenta mais que um plano que finge que ele não existe. Leia <Link href="/blog/como-emagrecer-sem-passar-fome-vida-social" className={ln}>como emagrecer sem abrir mão da vida social</Link> e <Link href="/blog/dieta-flexivel-iifym" className={ln}>dieta flexível</Link>.</p>
          </Secao>

          <Secao titulo="E se eu uso Mounjaro, Wegovy ou outra medicação?">
            <p className="text-gray-300 leading-relaxed">A matemática do saldo é a mesma: sábado e domingo continuam fazendo parte da ingestão da semana. Tirzepatida e semaglutida costumam reduzir apetite e ingestão, mas a resposta varia muito entre pessoas — por isso o simulador não desconta nada por causa delas, e a pergunta sobre medicação só muda o texto do resultado. Dose, dia de aplicação e álcool durante o tratamento são conversa com quem prescreve; não mude a aplicação para “cobrir” o fim de semana. Sobre treino durante o tratamento: <Link href="/blog/musculacao-durante-uso-de-mounjaro" className={ln}>musculação durante o uso de Mounjaro</Link>.</p>
          </Secao>

          <Secao titulo="O que a ciência mediu sobre o fim de semana">
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5">
              <li><strong className="text-white">No Brasil:</strong> no Inquérito Nacional de Alimentação 2008-2009 (IBGE, 34 mil pessoas), a ingestão média no fim de semana foi 8% maior que nos dias úteis, e a contribuição das bebidas açucaradas foi 62% maior. É média populacional — não diz nada sobre o seu fim de semana, que é para isso que o simulador existe.</li>
              <li><strong className="text-white">Comer mais e mexer menos:</strong> em adultos acompanhados de perto, o peso subiu nos fins de semana pelas duas coisas juntas, e a perda de peso parou justamente neles (Racette, 2008). Por isso o simulador pergunta sobre passos.</li>
              <li><strong className="text-white">O pico de segunda:</strong> quem se pesa todo dia vê o peso mais alto no domingo e na segunda — e quem mais emagreceu mostrou o maior pico (Orsama, 2014).</li>
            </ul>
          </Secao>

          <Secao titulo="Como calculamos?" id="metodologia">
            <ol className="text-gray-300 leading-relaxed space-y-2 list-decimal pl-5 mb-3">
              <li><strong className="text-white">Gasto (estimado):</strong> a manutenção que você informa (±5%) ou Mifflin-St Jeor × fator de rotina (±10%) — a mesma conta da <Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de Gasto Calórico</Link>.</li>
              <li><strong className="text-white">Ingestão (informada ou estimada):</strong> quem conta calorias informa; quem não conta descreve os dias. Dias úteis: manutenção −20% (“sigo um plano”), −10% ou 0%. Fim de semana: faixas por descrição (quase igual = 0; um pouco mais = 150 a 450; uma refeição mais livre = 400 a 1.000; várias refeições = 900 a 1.900; exagero grande = 1.500 a 3.000 kcal acima de um dia útil) ou itens do construtor. Uma refeição do construtor substitui uma refeição comum (30% do dia útil); extras e bebidas somam inteiros.</li>
              <li><strong className="text-white">Movimento:</strong> passos a mais ou a menos × custo de caminhar no seu peso (a mesma conta da calculadora de caminhada). Treino no fim de semana é contexto, não crédito para comer.</li>
              <li><strong className="text-white">Saldo (calculado):</strong> soma dos sete dias, em faixa. Construído = 5 × (dia útil − manutenção). Consumido = saldo − construído. Preservado = saldo ÷ construído. Até ±350 kcal na semana — ou uma faixa que cruza o zero perto dele —, o resultado é “perto da manutenção”.</li>
              <li><strong className="text-white">Projeção (estimada):</strong> a ingestão média dos sete dias num balanço energético dinâmico (Hall, 2011): o gasto é recalculado com o peso e a partição de Forbes decide quanto de cada quilo é gordura (9.440 kcal/kg) ou massa magra (1.816 kcal/kg). Nunca 7.700 kcal = 1 kg.</li>
              <li><strong className="text-white">Diagnóstico:</strong> regras fixas, na ordem: segurança (compensação) → bebidas → duração → domingo → movimento → maior componente. “Menor mudança” testa uma mudança por vez e só entre as que mantêm pelo menos um momento social. Nada é gerado por IA.</li>
            </ol>
            <p className="text-gray-300 leading-relaxed"><strong className="text-white">Não sabemos:</strong> quanto exatamente virou gordura ou água, nem o seu peso exato no futuro. Medicação e hormônios não mudam a conta. Estimativa educativa para adultos — não é prescrição de dieta.</p>
          </Secao>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-white/15 p-5"><p className="text-white font-semibold mb-2">Quanto tempo até a sua meta?</p><Link href="/ferramentas/simulador-emagrecimento" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Simulador de Emagrecimento →</Link></div>
            <div className="border border-white/15 p-5"><p className="text-white font-semibold mb-2">Qual déficit faz sentido para você?</p><Link href="/ferramentas/calculadora-deficit-calorico" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Calculadora de Déficit Calórico →</Link></div>
            <div className="border border-white/15 p-5"><p className="text-white font-semibold mb-2">Não sabe quanto seu corpo gasta?</p><Link href="/ferramentas/calculadora-tmb-tdee" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Calculadora de Gasto Calórico →</Link></div>
            <div className="border border-white/15 p-5"><p className="text-white font-semibold mb-2">Quer uma estratégia que funcione também no sábado?</p><Link href="/consultoria-online" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Conhecer a consultoria →</Link></div>
          </div>

          <OutrosSimuladores atual="fim-de-semana" />

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="simulador-fim-de-semana" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Quem fez</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Metodologia revisada em setembro de 2026 a partir das fontes abaixo. Não houve revisão médica nem de nutricionista. Estimativa educativa para adultos — não é diagnóstico, prescrição de dieta nem orientação sobre medicamentos.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ol className="text-gray-400 text-sm leading-relaxed space-y-2 list-decimal pl-5">
              {FONTES_FDS.map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a>. <span className="text-gray-500">{f.resumo}</span></li>)}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
