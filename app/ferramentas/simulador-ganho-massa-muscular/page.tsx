import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import SimuladorMassa from "@/components/simulador/SimuladorMassa";
import { FONTES_MASSA, MARCOS_MASSA, fmtSemanas, projetaMassa, ritmos, type PerfilMassa } from "@/lib/simulador/massa";
import { EVIDENCIAS_MASSA, REFERENCIAS_EVIDENCIAS_MASSA } from "@/lib/simulador/evidencias-massa";

/**
 * A página do Simulador de Ganho de Massa Muscular — o segundo dos
 * Simuladores Montinho.
 *
 * O PAPEL AO LADO DAS VIZINHAS
 *
 * A Calculadora de Potencial Natural responde "quanto músculo ainda cabe"
 * (FFMI, com ressalvas) e é dona do artigo quanto-tempo-para-ganhar-massa-
 * muscular. Esta responde "para onde meu PESO vai se eu fizer isso, quando
 * chego aos 70 kg, e o que está limitando" — trajetória e gargalo, nunca
 * quilos de músculo. As duas usam as mesmas taxas por nível.
 *
 * "Quanto tempo para ganhar 5 kg / 10 kg / ir de 60 a 70" é respondido numa
 * tabela calculada pelo motor no build, não em URLs separadas.
 */

const CAMINHO = "/ferramentas/simulador-ganho-massa-muscular";

export const metadata: Metadata = {
  title: "Simulador de Ganho de Massa: Quanto Tempo até a Meta?",
  description:
    "Sou magro e não consigo engordar? Veja como seu peso pode evoluir, compare três ritmos de ganho e descubra o que está limitando sua hipertrofia. Grátis.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Simulador de Ganho de Massa Muscular | Montinho Personal Trainer",
    description: "Quanto tempo para chegar ao peso que você quer — e o que está limitando seu ganho. Compare ritmos e veja a trajetória.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Simulador de Ganho de Massa Muscular",
  descricao: "Projeta a trajetória de peso corporal de quem quer ganhar massa, com balanço energético dinâmico e teto de massa magra por nível de treino; compara três ritmos de ganho e identifica, por regras, o principal gargalo.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Simulador de Ganho de Massa Muscular", item: `${SITE_URL}${CAMINHO}` },
  ],
};

/* ── Exemplo de referência, calculado no build ── */
const REF: PerfilMassa = { objetivo: "massa", idade: 22, sexo: "m", alturaCm: 178, pesoKg: 60, metaKg: null, gorduraPct: null, experiencia: "lt6m", continuidade: "continuo", treinos: 3, acompanha: "nocao", tendencia: "igual", kcalDia: null, apetite: "cheio-rapido", dificuldade: "comer", proteinaG: null, rotina: "sentado", passos: "5a75", cardio: "nao", suplementos: [], hormonio: "nao", historicoPeso: "sempre" };
const R3 = ritmos(REF);
const sem = (kg: number, ritmo: 0 | 1 | 2, cons = 0.9) => projetaMassa({ ...REF, metaKg: REF.pesoKg + kg }, { superavit: R3[ritmo].superavit, treinos: 3, consistencia: cons, progressao: "sim" }).semanaMeta;
const txt = (s: number | null) => (s === null ? "mais de 12 meses" : fmtSemanas(s));
const TABELA = [3, 5, 8, 10].map((kg) => ({ kg, c: sem(kg, 0), i: sem(kg, 1), r: sem(kg, 2) }));
const PI = projetaMassa(REF, { superavit: R3[1].superavit, treinos: 3, consistencia: 0.9, progressao: "sim" });
const PR = projetaMassa(REF, { superavit: R3[2].superavit, treinos: 3, consistencia: 0.9, progressao: "sim" });
const k = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const pct = (n: number) => `${Math.round(n * 100)}%`;

const faq: ItemFAQ[] = [
  { question: "Quanto tempo leva para ganhar 10 kg?", answer: `Num ritmo controlado, de seis meses a um ano — e nem tudo será músculo. No exemplo de referência do simulador (homem de ${REF.pesoKg} kg, iniciante, 3 treinos por semana, 90% de consistência), 10 kg levariam ${txt(TABELA[3].i)} no ritmo intermediário e ${txt(TABELA[3].r)} no mais rápido. A diferença entre os dois ritmos é principalmente gordura: o músculo tem teto por semana.` },
  { question: "É possível ganhar 5 kg de músculo em 3 meses?", answer: "De músculo, não — de peso, sim. Um iniciante ganha massa magra a cerca de 1% a 1,5% do peso por mês (Aragon); para alguém de 60 kg, isso é 0,6 a 0,9 kg por mês, 2 a 3 kg em três meses. O resto do que a balança mostra é água, glicogênio e alguma gordura. Quem promete 5 kg de músculo em 3 meses está contando o pacote inteiro." },
  { question: "Quanto músculo um iniciante pode ganhar?", answer: "Pelo modelo de Aragon, cerca de 1% a 1,5% do peso corporal por mês no primeiro ano de treino consistente — a fase de maior retorno que existe. No segundo e terceiro anos, a metade; depois, um quarto. É por isso que o simulador pergunta há quanto tempo você treina e se o treino foi contínuo. Para a pergunta “quanto ainda cabe”, use a Calculadora de Potencial Natural." },
  { question: "Quem é muito magro consegue ficar musculoso?", answer: "Consegue, e costuma ter uma vantagem: começa com pouca gordura, e por isso tende a ganhar mais massa magra por quilo (a relação de Forbes). O que trava não é a genética do “ectomorfo” — é a ingestão média ficar na manutenção sem a pessoa perceber. Peso estável há semanas é o diagnóstico; comer um pouco mais todo dia, medido pela média semanal da balança, é o tratamento." },
  { question: "Por que não consigo ganhar peso mesmo comendo muito?", answer: "Porque a balança já respondeu: se o peso está estável, sua ingestão média e seu gasto estão em equilíbrio — não importa quanto parece. Quase sempre é “muito” em duas refeições e pouco nas outras, ou muito de segunda a sexta e pouco no fim de semana. Pessoas magras também tendem a se mexer mais sem perceber (o gasto que ninguém vê varia dez vezes entre pessoas). Anote uma semana inteira antes de concluir qualquer coisa." },
  { question: "Preciso tomar hipercalórico?", answer: "Não. Hipercalórico não constrói músculo; é uma forma prática de colocar calorias para dentro quando o apetite não acompanha. Um shake caseiro com leite integral, aveia, banana e pasta de amendoim faz o mesmo papel. Se você consegue comer a mais com comida, não precisa dele." },
  { question: "Whey engorda? Whey ajuda a ganhar peso?", answer: "Whey é proteína; engorda tanto quanto qualquer alimento que passe do gasto do dia — pouco, porque uma porção tem 100 a 130 kcal. Ele ajuda quem não chega em 1,6 a 2,2 g de proteína por kg com a comida. Não é obrigatório e não é “produto para engordar”." },
  { question: "Creatina engorda?", answer: "Creatina puxa água para dentro do músculo: nas primeiras semanas o peso sobe 1 a 2 kg, e essa água fica enquanto a suplementação continua. Não é gordura nem músculo novo. Comece a contar o seu ganho a partir daí, e não interprete o salto inicial como resultado do superávit." },
  { question: "Preciso treinar todo dia?", answer: "Não. A referência de volume é cerca de 10 séries por músculo por semana, distribuídas — o que cabe em 3 ou 4 treinos. Mais dias só ajudam se acontecerem de verdade: no simulador, 4 treinos com 75% de consistência viram 36 em 12 semanas, e o corpo responde aos realizados." },
  { question: "Quanto preciso comer para ganhar massa?", answer: "A manutenção mais 10% a 20% para iniciantes e intermediários (Iraki, 2019); menos para avançados. Para quem gasta 2.300 kcal, são 230 a 460 kcal a mais por dia. O simulador estima sua manutenção pelo corpo, pela rotina e pela tendência do peso, e mostra três ritmos. Na vida real, a média semanal da balança confirma ou corrige." },
  { question: "Como saber se meu superávit está funcionando?", answer: "Pela média semanal do peso, comparada à semana anterior. Iniciantes e intermediários: 0,25% a 0,5% do peso por semana (150 a 300 g para alguém de 60 kg). Parado por duas ou três semanas: pequeno ajuste de 100 a 150 kcal. Subindo mais que isso com a cintura subindo junto: reduzir um pouco." },
  { question: "Ganhar barriga no bulking é normal?", answer: "Um pouco, sim: parte de todo ganho de peso é gordura, e a cintura pode subir 1 a 2 cm por mês num ritmo controlado. Mais que isso costuma indicar superávit acima do que o músculo consegue usar. Cintura junto com balança é o par de medidas mais útil de um bulking." },
  { question: "Quem usa testosterona ganha massa mais rápido?", answer: "Substâncias hormonais podem alterar massa e composição corporal, mas a resposta varia demais entre pessoas para virar previsão — por isso o simulador não soma nada por hormônio. Uso, dose e acompanhamento são decisões médicas, separadas do treino. Quem usa deve acompanhar peso, cintura, medidas e desempenho, como qualquer outra pessoa." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const th = "text-left text-gray-400 font-medium py-2.5 pr-4";
const td = "text-gray-300 py-2.5 pr-4 tabular-nums";
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

export default function SimuladorMassaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Simulador de Ganho de Massa</span>
          </nav>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Simuladores Montinho · grátis · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>Simulador de Ganho de Massa Muscular: Quanto Tempo para Ganhar Peso?</h1>
          <Compartilhar contexto="tool" titulo="Simulador de Ganho de Massa Muscular" caminho={CAMINHO} local="tool_top" ferramenta="simulador-massa" aparencia="discreto" className="mb-4" />
          <p className="text-gray-300 text-lg leading-relaxed">Quer ganhar massa, mas parece que seu peso nunca sobe? Veja como ele pode evoluir nos próximos meses, compare ritmos de ganho e descubra o que pode estar dificultando sua hipertrofia.</p>
        </div>
      </section>

      <section className="py-8 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SimuladorMassa placement="simulador-massa" />
          <noscript><p className="text-gray-300 mt-4">O simulador precisa de JavaScript para calcular a projeção. A tabela “Quanto tempo para ganhar 5 kg ou 10 kg?” abaixo funciona sem ele.</p></noscript>
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
            <p className="text-white text-lg font-semibold" style={h}>Você não precisa engordar o mais rápido possível.</p>
            <p className="text-gray-300 leading-relaxed mt-1">O objetivo é dar ao corpo condições para construir músculo enquanto você acompanha quanto peso está ganhando. Superávit maior não significa hipertrofia maior — significa mais gordura pelo mesmo músculo.</p>
          </div>

          <Secao titulo="Como funciona o Simulador de Ganho de Massa?" aberto>
            <p className="text-gray-300 leading-relaxed mb-3">Uma calculadora de bulking diz “coma 2.800 kcal”. O simulador responde <strong className="text-white">“se eu fizer isso nos próximos meses, para onde meu peso tende a ir — e quando chego aos 70 kg?”</strong>. Você responde oito telas curtas (objetivo, ponto de partida, meta, experiência, treino, alimentação, rotina e algumas perguntas de contexto) e ele desenha sua trajetória de peso, com faixa provável, em três ritmos: conservador, intermediário e mais rápido.</p>
            <p className="text-gray-300 leading-relaxed">Depois, ele testa suas respostas contra regras fixas e diz o que parece estar limitando seu ganho — ingestão, medição, treino, constância, velocidade ou só tempo — e o que eu olharia primeiro no seu caso. Nada é gerado por inteligência artificial: são regras que você pode ler na metodologia.</p>
          </Secao>

          <Secao titulo="Quanto tempo demora para ganhar massa muscular?">
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">Peso, semanas; músculo, meses; um corpo diferente, um ano ou mais.</strong> No exemplo de referência — homem de 22 anos, 1,78 m, {REF.pesoKg} kg, iniciante, 3 treinos por semana, 90% de consistência, ritmo intermediário —, a projeção é de cerca de +{k(PI.pontos[4].peso - REF.pesoKg)} kg no primeiro mês, +{k(PI.pontos[13].peso - REF.pesoKg)} kg em três meses e +{k(PI.ganho26)} kg em seis, com o modelo atribuindo cerca de {pct(PI.fracaoMagra26)} do ganho à massa magra.</p>
            <p className="text-gray-300 leading-relaxed">No ritmo mais rápido, o mesmo exemplo chega a +{k(PR.ganho26)} kg em seis meses — mas com a fatia magra caindo para cerca de {pct(PR.fracaoMagra26)}. É a diferença entre ganhar peso e ganhar o peso certo. Para a pergunta “quanto músculo ainda cabe em mim”, a ferramenta é outra: a <Link href="/ferramentas/potencial-natural" className={ln}>Calculadora de Potencial Natural</Link>.</p>
          </Secao>

          <Secao titulo="Quanto tempo para ganhar 5 kg ou 10 kg?">
            <p className="text-gray-300 leading-relaxed mb-4"><strong className="text-white">No exemplo de referência, 5 kg levam {txt(TABELA[1].i)} no ritmo intermediário; 10 kg, {txt(TABELA[3].i)}.</strong> A tabela mostra os três ritmos. Seus números são diferentes — o simulador faz a conta com os seus, e mostra o que cada ritmo custa em gordura.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Tempo estimado para ganhar 3, 5, 8 e 10 kg em três ritmos, no exemplo de referência</caption>
                <thead><tr className="border-b border-white/20"><th scope="col" className={th}>Ganhar</th><th scope="col" className={th}>Conservador (+{R3[0].superavit} kcal)</th><th scope="col" className={th}>Intermediário (+{R3[1].superavit})</th><th scope="col" className="text-left text-gray-400 font-medium py-2.5">Mais rápido (+{R3[2].superavit})</th></tr></thead>
                <tbody>{TABELA.map((l) => <tr key={l.kg} className="border-b border-white/10"><td className="text-white py-2.5 pr-4 font-medium">+{l.kg} kg</td><td className={td}>{txt(l.c)}</td><td className={td}>{txt(l.i)}</td><td className="text-gray-300 py-2.5 tabular-nums">{txt(l.r)}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mt-3">Exemplo: homem, 22 anos, 1,78 m, {REF.pesoKg} kg, iniciante, 3 treinos de musculação por semana com progressão, 90% de consistência. Projeções param em 12 meses. Ir de 60 para 70 kg é a linha de +10 kg.</p>
          </Secao>

          <Secao titulo="Sou muito magro: por onde começar?">
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">Pela balança, não pela comida.</strong> Pese-se de manhã 3 a 4 vezes por semana por duas semanas e tire a média. Se ela não sobe, sua ingestão média está na manutenção — esse é o ponto de partida real, e não o que você acha que come. Depois: uma refeição extra fixa, todo dia (um shake, um pão com pasta de amendoim, um prato a mais), e a média semanal diz se bastou.</p>
            <p className="text-gray-300 leading-relaxed">No treino, o iniciante magro tem a maior vantagem que existe: os primeiros meses rendem mais que qualquer outro momento da vida, e com pouca gordura o ganho tende a ser mais magro. Três treinos de força por semana, poucos exercícios, cargas anotadas. Veja <Link href="/blog/como-ganhar-peso-saudavel" className={ln}>como ganhar peso com saúde</Link> e os <Link href="/blog/erros-de-quem-quer-ganhar-massa-muscular" className={ln}>erros mais comuns de quem quer ganhar massa</Link>.</p>
          </Secao>

          <Secao titulo="Por que eu como muito e não engordo?">
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">Porque, na média, você come a manutenção.</strong> Peso estável por várias semanas significa ingestão média ≈ gasto. Não é que você coma pouco em toda refeição — é que “muito” costuma acontecer em duas refeições, ou de segunda a sexta, e o resto da semana compensa. Pessoas magras também tendem a se mexer mais sem perceber: no estudo de Levine (1999), o gasto com movimento espontâneo explicou uma diferença de dez vezes no que virou gordura.</p>
            <p className="text-gray-300 leading-relaxed">Existe “hardgainer”? Existem pessoas com menos apetite, mais gasto espontâneo, rotina esportiva pesada e dificuldade logística para comer — todas reais, nenhuma mágica. O que não existe é o “ectomorfo” como sentença: os biótipos de Sheldon são uma classificação dos anos 1940 sem base para decidir dieta, treino ou potencial. Leia <Link href="/blog/endomorfo-ectomorfo-mesomorfo" className={ln}>o que a ciência diz sobre biótipos</Link>.</p>
          </Secao>

          <Secao titulo="Preciso estar em superávit calórico? Quanto?">
            <p className="text-gray-300 leading-relaxed"><strong className="text-white">Para o peso subir, sim; o tamanho certo é desconhecido, e menor do que se imagina.</strong> Slater e colegas (2019) revisaram a literatura e concluíram que o superávit exato necessário para maximizar a hipertrofia não é conhecido — e que superávits grandes aumentam gordura sem hipertrofia proporcional. Iraki (2019) sugere ~10% a 20% acima da manutenção para iniciantes e intermediários, mirando 0,25% a 0,5% do peso por semana; menos para avançados. O simulador traduz isso nos três ritmos e ajusta pelo seu nível. Para saber quanto comer em cada macro: <Link href="/ferramentas/calculadora-macros" className={ln}>Calculadora de Macros</Link>.</p>
          </Secao>

          <Secao titulo="Quanto de proteína preciso para ganhar massa?">
            <p className="text-gray-300 leading-relaxed"><strong className="text-white">1,6 a 2,2 g por kg por dia.</strong> A meta-análise de Morton (2018), com 49 estudos, encontrou o benefício para massa magra saturando por volta de 1,6 g/kg, com o limite superior do intervalo em ~2,2. Mais que isso não constrói mais músculo. Se você informou sua proteína no simulador, ele diz em que faixa você está. Conta completa na <Link href="/ferramentas/calculadora-de-proteina" className={ln}>Calculadora de Proteína</Link>; se a comida não chega, a <Link href="/ferramentas/calculadora-whey" className={ln}>Calculadora de Whey</Link> mostra quanto completa.</p>
          </Secao>

          <Secao titulo="Quantas vezes por semana devo treinar?">
            <p className="text-gray-300 leading-relaxed"><strong className="text-white">As que acontecem.</strong> A referência de volume é cerca de 10 séries por músculo por semana (Schoenfeld, 2017), e isso cabe em 3 ou 4 treinos. No simulador, treinar mais mexe pouco na balança — mexe no que o peso ganho vira. E consistência mexe nos dois: 4 treinos a 75% viram 36 em 12 semanas. Para conferir se o seu treino tem séries suficientes por músculo: <Link href="/ferramentas/calculadora-volume-treino" className={ln}>Calculadora de Volume</Link>. Para montar a divisão que cabe na sua semana: <Link href="/treino-para-minha-rotina" className={ln}>Treino para Minha Rotina</Link>.</p>
          </Secao>

          <Secao titulo="É melhor ganhar peso rápido ou devagar?">
            <p className="text-gray-300 leading-relaxed"><strong className="text-white">Devagar o suficiente para o músculo acompanhar.</strong> Garthe (2013) comparou atletas com superávit grande e pequeno: o grupo rápido ganhou mais peso e mais gordura, sem mais massa magra. O músculo tem teto por semana — cerca de 1% a 1,5% do peso por mês para iniciantes, metade para intermediários, um quarto para avançados — e o que passa do teto vira gordura. No simulador, compare o ritmo mais rápido com o intermediário e olhe a fatia magra. Leia <Link href="/blog/como-ganhar-massa-sem-ganhar-gordura" className={ln}>como ganhar massa sem ganhar gordura</Link> e <Link href="/blog/bulking-ou-cutting" className={ln}>bulking ou cutting</Link>.</p>
          </Secao>

          <Secao titulo="O que decide o resultado: estudos, prática e relatos">
            <p className="text-gray-300 leading-relaxed mb-6">O simulador aponta o gargalo pelas suas respostas. Aqui está o que sustenta cada um, em três camadas separadas de propósito: o que os <strong className="text-white">estudos</strong> mediram, o que a <strong className="text-white">prática</strong> de quem acompanha alunos observa, e o que as pessoas <strong className="text-white">relatam</strong>. Relato não é evidência; é o sintoma que os estudos explicam.</p>
            <div className="space-y-3">
              {EVIDENCIAS_MASSA.map((e) => (
                <details key={e.id} className="group border border-white/15 open:border-[#BA9E50]/40">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5 min-h-[56px]">
                    <span><span className="block text-lg font-bold text-white" style={h}>{e.titulo}</span><span className="block text-gray-400 text-sm mt-1">{e.resumo}</span></span>
                    <span aria-hidden="true" className="shrink-0 text-[#BA9E50] text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="space-y-3 text-sm leading-relaxed px-5 pb-5">
                    <div><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Estudos</p><ul className="text-gray-300 space-y-2">{e.estudos.map((x) => <li key={x.ref.url}>{x.texto} <a href={x.ref.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 underline underline-offset-2">{x.ref.rotulo}</a></li>)}</ul></div>
                    <div><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Prática</p><p className="text-gray-300">{e.pratica}</p></div>
                    <div><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Relatos</p><p className="text-gray-300">{e.relatos}</p></div>
                    <div className="border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">O que fazer amanhã</p><p className="text-white">{e.acao}</p></div>
                  </div>
                </details>
              ))}
            </div>
          </Secao>

          <Secao titulo="O que esperar a cada etapa do ganho?">
            <p className="text-gray-300 leading-relaxed mb-4"><strong className="text-white">A força responde antes do espelho, e o espelho antes da etiqueta.</strong> Marcos em percentual do peso de partida; roupa, rosto e força são o que costuma acontecer, pela prática e pelos relatos — não uma garantia.</p>
            <div className="space-y-3">
              {MARCOS_MASSA.map((m) => (
                <details key={m.fracao} className="group border border-white/15 open:border-[#BA9E50]/40">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-4 min-h-[56px]"><span className="font-bold text-white" style={h}>+{k(REF.pesoKg * m.fracao)} kg ({(m.fracao * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%) — {m.titulo}</span><span aria-hidden="true" className="shrink-0 text-[#BA9E50] text-2xl leading-none transition-transform group-open:rotate-45">+</span></summary>
                  <div className="px-4 pb-4 text-sm leading-relaxed"><ul className="text-gray-200 space-y-1.5 list-disc pl-5">{m.costuma.map((c) => <li key={c}>{c}</li>)}</ul>{m.aindaNao && <p className="text-gray-400 mt-2"><span className="text-gray-500 uppercase text-xs tracking-wide">Ainda não:</span> {m.aindaNao}</p>}</div>
                </details>
              ))}
            </div>
          </Secao>

          <Secao titulo="Como acompanhar um bulking corretamente?">
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5">
              <li><strong className="text-white">Peso em média semanal:</strong> 3 a 4 pesagens de manhã, some e divida. Compare semanas, nunca dias.</li>
              <li><strong className="text-white">Cintura:</strong> a cada duas semanas. Sobe 1 a 2 cm por mês num ritmo controlado; mais que isso, reavalie.</li>
              <li><strong className="text-white">Cargas e repetições:</strong> anotadas nos 4 a 6 exercícios principais. Pelo menos um número deve subir a cada semana ou duas.</li>
              <li><strong className="text-white">Fotos padronizadas:</strong> mesma luz, mesmo lugar, mesma postura, a cada 8 semanas.</li>
              <li><strong className="text-white">Braço, peito e coxa:</strong> uma vez por mês, no mesmo ponto.</li>
              <li><strong className="text-white">Peso parado por 2 a 3 semanas?</strong> Pequeno ajuste de 100 a 150 kcal — não o dobro. Medir → avaliar → ajustar.</li>
            </ul>
          </Secao>

          <Secao titulo="Como calculamos sua projeção?" id="metodologia">
            <p className="text-gray-300 leading-relaxed mb-3">O simulador usa um <strong className="text-white">balanço energético dinâmico</strong> (Hall, 2011) ao contrário do de emagrecimento: a cada dia, ingestão − gasto vira variação de peso, e o gasto é recalculado com o peso novo. As peças:</p>
            <ol className="text-gray-300 leading-relaxed space-y-2 list-decimal pl-5 mb-3">
              <li><strong className="text-white">Gasto:</strong> Mifflin-St Jeor × fator de rotina (1,25 a 1,7) + musculação (3,5 MET, 60 min por sessão) + cardio informado (6 MET, 40 min) + a diferença entre os seus passos e 5.000 por dia, quando você informa.</li>
              <li><strong className="text-white">Manutenção de partida:</strong> se o peso está estável, a ingestão atual é a manutenção. Se você informou calorias, elas calibram a estimativa (média entre o informado, ajustado pela tendência, e a equação).</li>
              <li><strong className="text-white">Nível efetivo:</strong> tempo de treino descontadas as pausas — 10 anos “parando e voltando” contam como 5.</li>
              <li><strong className="text-white">Ritmos:</strong> 7,5%, 12,5% e 20% de superávit sobre a manutenção (5%, 8% e 12% para avançados), da faixa de 10–20% de Iraki (2019).</li>
              <li><strong className="text-white">O que o ganho vira:</strong> a fração de massa magra parte de Forbes (quem tem menos gordura ganha mais magro por quilo), ajustada por treino e progressão — mas com teto diário pela taxa do nível (Aragon: 1–1,5% do peso/mês no primeiro ano, 0,5–1% depois, 0,25–0,5% em avançados; as mesmas da Calculadora de Potencial Natural). O que passa do teto vira gordura. Massa magra ≈ 1.816 kcal/kg; gordura ≈ 9.440 kcal/kg.</li>
              <li><strong className="text-white">Consistência:</strong> fração dos dias em que superávit e treino acontecem; nos outros, a pessoa volta ao que fazia.</li>
              <li><strong className="text-white">Faixa provável:</strong> gasto ±5%. Pesos arredondados a 0,5 kg; prazos, a semanas ou meses.</li>
              <li><strong className="text-white">Gargalo:</strong> regras fixas em ordem de prioridade (perda involuntária de peso → velocidade → ingestão → medição → constância → treino → paciência). Nada é gerado por IA.</li>
            </ol>
            <p className="text-gray-300 leading-relaxed"><strong className="text-white">Limitações:</strong> as taxas de Aragon vêm da observação de homens; para mulheres, servem como teto razoável em percentual do peso, mas a evidência é mais fina. A fatia magra é tendência, não medida — ninguém prevê músculo a partir de perguntas. O modelo não considera hormônios, suplementos, água e glicogênio das primeiras semanas, nem o apetite reagindo ao superávit. Vale para adultos saudáveis; menores de 18 não recebem projeção; perda de peso involuntária recebe um aviso para procurar um profissional de saúde.</p>
          </Secao>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-white/15 p-5"><p className="text-white font-semibold mb-2">Quanto músculo ainda cabe em você?</p><Link href="/ferramentas/potencial-natural" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Calculadora de Potencial Natural →</Link></div>
            <div className="border border-white/15 p-5"><p className="text-white font-semibold mb-2">Seu treino tem séries suficientes por músculo?</p><Link href="/ferramentas/calculadora-volume-treino" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Calculadora de Volume →</Link></div>
            <div className="border border-white/15 p-5"><p className="text-white font-semibold mb-2">Não sabe quanto seu corpo gasta?</p><Link href="/ferramentas/calculadora-tmb-tdee" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Calculadora de Gasto Calórico →</Link></div>
            <div className="border border-white/15 p-5"><p className="text-white font-semibold mb-2">Quer um treino montado para crescer?</p><Link href="/consultoria-online" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Conhecer a consultoria →</Link></div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="simulador-massa" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Quem fez</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Metodologia revisada em setembro de 2026 a partir das fontes abaixo. Não houve revisão médica nem de nutricionista. Estimativa educativa para adultos — não é diagnóstico, prescrição de dieta nem orientação sobre medicamentos ou hormônios.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ol className="text-gray-400 text-sm leading-relaxed space-y-2 list-decimal pl-5">
              {FONTES_MASSA.map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a>. <span className="text-gray-500">{f.resumo}</span></li>)}
              {REFERENCIAS_EVIDENCIAS_MASSA.filter((r) => !FONTES_MASSA.some((f) => f.url === r.url)).map((r) => <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer" className={ln}>{r.rotulo}</a>. <span className="text-gray-500">Base da seção sobre estudos, prática e relatos.</span></li>)}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
