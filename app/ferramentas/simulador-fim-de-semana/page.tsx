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
  title: "Simulador do Fim de Semana: Seu Sábado Anula a Dieta?",
  description:
    "Veja quanto do déficit da semana sábado e domingo consomem. Teste refeições, bebidas e passos e descubra a menor mudança com maior impacto. Grátis.",
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
  { question: "Uma pizza estraga a dieta?", answer: "Não sozinha. Uma refeição diferente reduz parte do déficit da semana; raramente o apaga. O que muda o saldo de verdade é a duração: quando a pizza de sábado vira sábado inteiro, domingo e “recomeço na segunda”. No simulador, compare “uma refeição livre” com “o fim de semana inteiro” — é a mesma pizza nos dois." },
  { question: "Quanto posso comer no fim de semana?", answer: "O simulador não dá um número para você comer — é uma simulação de cenário, não uma prescrição. Ele mostra o que o seu fim de semana atual faz com a sua semana e deixa você testar mudanças. Quem precisa de um plano alimentar individual deve procurar um nutricionista." },
  { question: "Se eu exagerar no sábado, devo jejuar ou fazer mais cardio no domingo?", answer: "Não. Jejum punitivo, cardio para “pagar” a comida e cortes drásticos tendem a puxar o próximo exagero e não fazem parte de uma estratégia. O caminho é voltar à rotina normal na próxima refeição. Se comer e compensar virou um ciclo difícil de controlar, converse com um profissional de saúde." },
  { question: "Por que meu peso sobe na segunda-feira?", answer: "Porque a balança mede massa corporal, e ela muda em horas com água, glicogênio, sódio e o que ainda está no intestino. Pessoas que se pesam todo dia mostram pico no domingo e na segunda e queda ao longo da semana — e esse padrão foi maior justamente em quem estava emagrecendo (Orsama, 2014). Compare médias semanais, não a segunda com a sexta." },
  { question: "Engordei 2 kg no fim de semana. Foram 2 kg de gordura?", answer: "Quase certamente não. Para 2 kg de gordura seria preciso algo como 18 mil kcal acima do gasto em dois dias. A maior parte de um salto rápido é água, glicogênio e conteúdo intestinal, e costuma baixar em alguns dias de rotina. Isso não quer dizer que o saldo não possa ter sido positivo — o simulador mostra o teto de tecido que a energia extra permitiria." },
  { question: "Posso beber e emagrecer?", answer: "A matemática permite: bebida é energia, e cabe no saldo da semana como qualquer outra. O que pesa é a soma — oito latas de cerveja passam de mil calorias — e o que costuma vir junto (petisco, noite curta, domingo parado). O simulador calcula as bebidas por volume e teor alcoólico, em faixa, e mostra quanto elas representam do seu fim de semana." },
  { question: "Déficit calórico deve ser contado por dia ou por semana?", answer: "O corpo não reinicia à meia-noite nem na segunda-feira: o que decide a tendência é o saldo ao longo dos dias. Contar por semana ajuda a enxergar isso — e é o que o simulador faz. Mas “compensar” a semana com dias muito baixos não é estratégia; o saldo semanal é para entender, não para punir." },
  { question: "Mounjaro ou Wegovy permitem comer mais no fim de semana?", answer: "A matemática do saldo é a mesma com ou sem caneta. Esses medicamentos costumam reduzir apetite e ingestão, mas a resposta varia muito entre pessoas, e por isso o simulador não desconta nada por eles. Dose, dia de aplicação e álcool durante o tratamento são conversa com quem prescreve." },
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>Simulador do Fim de Semana: veja o que sábado e domingo fazem com a sua semana</h1>
          <Compartilhar contexto="tool" titulo="Simulador do Fim de Semana" caminho={CAMINHO} local="tool_top" ferramenta="simulador-fim-de-semana" aparencia="discreto" className="mb-4" />
          <p className="text-gray-300 text-lg leading-relaxed">Seu fim de semana está anulando sua dieta? Monte o seu sábado e domingo e veja, em segundos, quanto do déficit da semana sobrou — e o que mudaria com uma coisa só.</p>
        </div>
      </section>

      <section className="py-8 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SimuladorFimDeSemana placement="simulador-fim-de-semana" />
          <noscript><p className="text-gray-300 mt-4">O simulador precisa de JavaScript. O exemplo abaixo, em “Como o fim de semana mexe na semana”, funciona sem ele.</p></noscript>
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
            <p className="text-white text-lg font-semibold" style={h}>Seu corpo não reinicia na segunda-feira.</p>
            <p className="text-gray-300 leading-relaxed mt-1">O resultado depende do conjunto dos sete dias. Flexibilidade pode existir dentro de uma estratégia — a ferramenta mostra o impacto em números, sem moralizar comida.</p>
          </div>

          <Secao titulo="Como o fim de semana mexe na semana?" aberto>
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">Pela soma, não pelo alimento.</strong> Exemplo de referência: mulher de 35 anos que gasta cerca de 2.200 kcal por dia e come 1.700 de segunda a sexta. A semana constrói {fmtKcal(EX.construido.mid)}. Se o sábado chega a 3.100 e o domingo a 2.800, o fim de semana consome {fmtKcal(EX.consumido.mid).replace("+", "")} — sobra {fmtKcal(EX.saldo.mid)}, ou {pct(EX.preservado)} do déficit construído.</p>
            <p className="text-gray-300 leading-relaxed">Se o mesmo sábado vier com um domingo igual à semana, sobram {pct(EX2.preservado)}. E uma refeição mais livre no sábado, no lugar do fim de semana inteiro, deixa a semana em {fmtKcal(CMP.a.saldo.mid)}, contra {fmtKcal(CMP.b.saldo.mid)} com sexta, sábado e domingo fora da rotina. A matemática completa, com o contexto do dia a dia, está no artigo <Link href="/blog/fim-de-semana-estraga-a-dieta" className={ln}>Fim de semana estraga a dieta?</Link>.</p>
          </Secao>

          <Secao titulo="Refeição livre, dia livre e o “dia do lixo”">
            <p className="text-gray-300 leading-relaxed">Uma refeição diferente e um dia inteiro sem estrutura produzem saldos muito diferentes — no exemplo acima, a diferença passa de {fmtKcal(CMP.b.saldo.mid - CMP.a.saldo.mid).replace("+", "")} na semana. O chamado “dia do lixo” costuma ser o segundo caso com outro nome. Não existe alimento proibido; existe a soma. Leia <Link href="/blog/dia-do-lixo-funciona" className={ln}>o dia do lixo funciona?</Link> e <Link href="/blog/churrasco-sem-sair-da-dieta" className={ln}>churrasco sem sair da dieta</Link>.</p>
          </Secao>

          <Secao titulo="Saiu da rotina? Volte na próxima refeição">
            <p className="text-gray-300 leading-relaxed">O efeito “já que eu saí da dieta…” é o que transforma uma refeição em fim de semana. No exemplo, voltar na refeição seguinte custa cerca de {fmtKcal(RR.b).replace("+", "")}; adiar a volta para segunda custa {fmtKcal(RR.a).replace("+", "")} — {RR.diasDeDeficit !== null ? `o equivalente a uns ${Math.round(RR.diasDeDeficit)} dias do déficit da semana` : "várias vezes mais"}. A diferença não vem do alimento; vem da decisão de adiar. E não precisa compensar: nada de jejum punitivo nem de cardio para “pagar” — só voltar à rotina.</p>
          </Secao>

          <Secao titulo="Cerveja e álcool no fim de semana">
            <p className="text-gray-300 leading-relaxed">O simulador calcula as bebidas por volume × teor alcoólico × 7 kcal por grama de álcool, mais o carboidrato da bebida ou do misturador: uma lata de cerveja fica em 140 a 160 kcal; uma taça de vinho, 115 a 135; uma caipirinha, 180 a 350, conforme o açúcar. O que ele não faz é inventar mecanismo do tipo “o álcool desliga a queima de gordura por X horas”. Energia, efeitos agudos e comportamento que vem junto são coisas diferentes. Leia <Link href="/blog/alcool-e-emagrecimento" className={ln}>álcool e emagrecimento</Link>, <Link href="/blog/cerveja-engorda" className={ln}>cerveja engorda?</Link> e <Link href="/blog/vinho-engorda" className={ln}>vinho engorda?</Link>.</p>
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
