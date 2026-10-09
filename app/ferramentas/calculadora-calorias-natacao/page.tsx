import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraNatacao from "@/components/natacao/CalculadoraNatacao";
import {
  FONTES_NATACAO,
  FONTE_COMPENDIO_NATACAO,
  MET_BORDA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_PADRAO,
  arredondaKcal,
  calcula,
  kgPorMes,
  nado,
  tabelaNados,
} from "@/lib/natacao";
import { metDoRitmo } from "@/lib/corrida";
import { TERRENOS } from "@/lib/bicicleta";

/**
 * A página da Calculadora de Calorias na Natação.
 *
 * O `natacao-emagrece` responde "quantas calorias a natação queima" com
 * faixas por intensidade. O Compêndio mede por nado, e a diferença entre
 * os nados é a maior de todas as atividades do site. Esta página faz a
 * conta por nado, com o peso de quem pergunta, e desconta o tempo parado
 * na borda — que o próprio artigo aponta como o erro mais comum.
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-natacao";

export const metadata: Metadata = {
  title: "Natação Gasta Quantas Calorias? Calculadora por Nado e Tempo",
  description:
    "Quantas calorias o seu treino na piscina gasta — crawl, costas, peito ou borboleta — com o seu peso, descontando o tempo parado na borda.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias na Natação | Montinho Personal Trainer",
    description:
      "Crawl, costas, peito ou borboleta: quanto o seu treino gastou com o seu peso, descontando o tempo parado na borda.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias na Natação",
  descricao:
    "Estima o gasto calórico de um treino de natação por nado — crawl leve e forte, costas, peito, borboleta e nado de lazer — a partir do peso e do tempo nadando, descontando o tempo parado na borda, e compara todos os nados no mesmo tempo.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias na Natação", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const TAB = tabelaNados(60);
const L = (id: string) => TAB.find((l) => l.nado.id === id)!;
const CRAWL = nado("crawl-leve");
const SEM_BORDA = calcula(PESO_PADRAO, 40, CRAWL.met);
const COM_BORDA = calcula(PESO_PADRAO, 25, CRAWL.met, 15);
const TRES = kgPorMes(calcula(PESO_PADRAO, 45, CRAWL.met), 3);
/** Nadador recreativo em crawl leve: cerca de 3 min por 100 m, ou 30 min por km (premissa declarada na resposta). */
const MIN_POR_KM = 30;
const KM1 = calcula(PESO_PADRAO, MIN_POR_KM, CRAWL.met);
const M45 = calcula(PESO_PADRAO, 45, CRAWL.met);
const M50 = calcula(PESO_PADRAO, 50, CRAWL.met);
const AULA = calcula(PESO_PADRAO, 30, CRAWL.met, 20);
const FORTE = nado("crawl-forte");
const BORBOLETA = nado("borboleta");
const M20 = calcula(PESO_PADRAO, 20, CRAWL.met);
const M40 = calcula(PESO_PADRAO, 40, CRAWL.met);
const FORTE_45 = calcula(PESO_PADRAO, 45, FORTE.met);
const DUAS = kgPorMes(M45, 2);
const CRAWL_30 = calcula(PESO_PADRAO, 30, CRAWL.met);
const FORTE_30 = calcula(PESO_PADRAO, 30, FORTE.met);
const CORRIDA_30 = calcula(PESO_PADRAO, 30, metDoRitmo(8).met);
const SUBIDA_60 = calcula(PESO_PADRAO, 60, TERRENOS[2].met!);
const BORBOLETA_60 = calcula(PESO_PADRAO, 60, BORBOLETA.met);
const mil = (n: number) => n.toLocaleString("pt-BR");
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias a natação queima por hora?",
    answer: `Depende muito do nado. Para ${PESO_PADRAO} kg, uma hora de crawl leve gasta cerca de ${mil(L("crawl-leve").kcal80)} kcal, de crawl forte cerca de ${mil(L("crawl-forte").kcal80)} kcal, e de borboleta cerca de ${mil(L("borboleta").kcal80)} kcal. Tempo parado na borda gasta como ficar em pé.`,
  },
  {
    question: "Qual nado queima mais calorias?",
    answer: `A borboleta, de longe: mais que o dobro do crawl leve, cerca de ${mil(L("borboleta").kcal80)} kcal por hora para ${PESO_PADRAO} kg. Depois vêm peito e crawl forte em ritmo de treino. Mas quase ninguém sustenta borboleta por muito tempo — o nado que você aguenta 40 minutos gasta mais no fim.`,
  },
  {
    question: "Nadar 30 minutos queima quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg, cerca de ${kc(calcula(PESO_PADRAO, 30, CRAWL.met).kcal)} kcal em crawl leve e ${kc(calcula(PESO_PADRAO, 30, nado("crawl-forte").met).kcal)} kcal em crawl forte, contando só o tempo nadando.`,
  },
  {
    question: "Nadar 1 km (1.000 metros) queima quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg em crawl leve, num ritmo recreativo de cerca de 3 minutos a cada 100 m (30 minutos por km), perto de ${kc(KM1.kcal)} kcal. Então 500 m ficam perto de ${kc(KM1.kcal / 2)} kcal e 2 km, perto de ${kc(KM1.kcal * 2)} kcal. Quem nada mais rápido gasta mais por minuto, mas termina o quilômetro antes.`,
  },
  {
    question: "45 ou 50 minutos de natação queimam quantas calorias?",
    answer: `Em crawl leve, sem contar o tempo parado na borda, cerca de ${kc(M45.kcal)} kcal em 45 minutos e ${kc(M50.kcal)} kcal em 50 minutos para ${PESO_PADRAO} kg. Em nados de treino, como peito ou borboleta, o gasto sobe bastante; a tabela por nado mostra quanto.`,
  },
  {
    question: "Quantas calorias gasta uma aula de natação para iniciante?",
    answer: `Menos do que as tabelas prometem, porque a aula tem explicação, pausa e borda. Uma aula de 50 minutos com cerca de 30 minutos nadando de fato gasta perto de ${kc(AULA.kcal)} kcal para ${PESO_PADRAO} kg. O número de "600 kcal por aula" supõe nadar a aula inteira sem parar.`,
  },
  {
    question: "Natação gasta mais calorias que corrida ou que academia?",
    answer: "Depende da intensidade, não da modalidade. Crawl leve gasta menos que corrida moderada no mesmo tempo; crawl forte ou borboleta ficam no nível de corrida rápida. Musculação gasta menos por minuto que natação contínua, mas constrói músculo, e as duas se completam.",
  },
  {
    question: "Quem tem diabetes ou insuficiência cardíaca pode fazer natação?",
    answer: "Muitas vezes pode, e a natação costuma ser bem tolerada por ter baixo impacto. Mas nessas condições a liberação e a intensidade são decisão do médico que acompanha você. Com diabetes, vale atenção à glicose antes e depois da piscina.",
  },
  {
    question: "Parar na borda muda muito o gasto?",
    answer: `Muda. Para ${PESO_PADRAO} kg em crawl leve, 40 minutos nadando gastam cerca de ${kc(SEM_BORDA.kcal)} kcal; os mesmos 40 minutos com 15 parados na borda, cerca de ${kc(COM_BORDA.kcal)}. É por isso que a calculadora pergunta o tempo na borda em separado.`,
  },
  {
    question: "Natação emagrece quantos quilos por mês?",
    answer: `Só da piscina, pouco: três treinos de 45 minutos de crawl leve por semana somam no máximo ${kg(TRES)} kg de gordura por mês para ${PESO_PADRAO} kg. O que passa disso vem da alimentação — e a fome depois da piscina é o que mais atrapalha.`,
  },
  {
    question: "Natação perde barriga?",
    answer: NOTA_SEM_PERDA_LOCALIZADA,
  },
  {
    question: "20 ou 40 minutos de natação queimam quantas calorias?",
    answer: `Em crawl leve, nadando sem parar, cerca de ${kc(M20.kcal)} kcal em 20 minutos e ${kc(M40.kcal)} kcal em 40 para ${PESO_PADRAO} kg. Desconte o tempo parado na borda: é ele que mais derruba o gasto real.`,
  },
  {
    question: "Quantas calorias queimo em 45 minutos de natação intensa?",
    answer: `Em crawl forte, com séries rápidas e pouco descanso, cerca de ${kc(FORTE_45.kcal)} kcal para ${PESO_PADRAO} kg — quase o dobro do crawl leve no mesmo tempo (${kc(M45.kcal)} kcal). Poucas pessoas sustentam 45 minutos contínuos nesse ritmo; num treino real, os intervalos baixam o total.`,
  },
  {
    question: "O que emagrece mais, nadar ou correr?",
    answer: `Depende do ritmo. Em 30 minutos, para ${PESO_PADRAO} kg: crawl leve ≈ ${kc(CRAWL_30.kcal)} kcal; corrida a 8 km/h ≈ ${kc(CORRIDA_30.kcal)} kcal; crawl forte ≈ ${kc(FORTE_30.kcal)} kcal. A corrida leve gasta mais que o nado confortável, mas tem impacto; a natação poupa as articulações e dá para fazer com mais frequência. Emagrece mais o que você mantém.`,
  },
  {
    question: "Nadar 2 vezes por semana ajuda a emagrecer?",
    answer: `Ajuda, mas pouco sozinho: duas sessões de 45 minutos de crawl leve somam no máximo ${kg(DUAS)} kg de gordura por mês para ${PESO_PADRAO} kg, pela conta linear. Para a saúde, a OMS recomenda de 150 a 300 minutos de atividade moderada por semana — duas aulas cobrem parte disso. Para emagrecer, o que decide é o déficit da semana, com a alimentação junto.`,
  },
  {
    question: "Quantas vezes por semana é ideal fazer natação?",
    answer: "Para condicionamento, de 2 a 4 vezes por semana já mostram evolução clara. Para emagrecer, a frequência importa menos que o total da semana somado à alimentação; para quem também faz musculação, 2 ou 3 sessões de piscina costumam encaixar bem sem atrapalhar a recuperação.",
  },
  {
    question: "Natação afina a cintura ou define a barriga?",
    answer: NOTA_SEM_PERDA_LOCALIZADA + " O abdômen trabalha para estabilizar o corpo na água, mas o que deixa a barriga aparecer é a perda de gordura do corpo todo.",
  },
  {
    question: "A natação muda o corpo?",
    answer: "Muda o condicionamento rápido e, com o tempo, a postura e a resistência de ombros, costas e pernas. Para mudar composição corporal de forma visível, ela funciona melhor junto com musculação, que constrói músculo, e com uma alimentação que feche a conta da semana.",
  },
  {
    question: "Por que a natação cansa tanto?",
    answer: "Porque o corpo inteiro trabalha contra a resistência da água, e a respiração fica presa ao ritmo da braçada. Para quem está começando, a técnica ainda gasta energia à toa — bater perna demais, prender o ar, nadar com o quadril afundado. Com aula e prática, o mesmo trecho passa a cansar bem menos.",
  },
  {
    question: "Grávida pode fazer natação?",
    answer: "Costuma estar entre as atividades mais indicadas na gestação, por ser de baixo impacto e aliviar o peso nas articulações. Mas a liberação e a intensidade são decisão do obstetra que acompanha a gravidez; sinais como tontura, dor ou sangramento são motivo para parar.",
  },
  {
    question: "Qual esporte gasta mais calorias?",
    answer: `Entre os mais caros do Compêndio de Atividades Físicas estão o nado borboleta (${metF(BORBOLETA.met)} METs, cerca de ${kc(BORBOLETA_60.kcal)} kcal por hora para ${PESO_PADRAO} kg) e a subida forte de bicicleta (${metF(TERRENOS[2].met!)} METs, cerca de ${kc(SUBIDA_60.kcal)} kcal por hora). São ritmos que quase ninguém sustenta por uma hora; no dia a dia, gasta mais a atividade que você faz com frequência.`,
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

export default function CalculadoraNatacaoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias na Natação
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias na Natação" caminho={CAMINHO} local="tool_top" ferramenta="natacao" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto o seu treino na piscina gastou, pelo nado e pelo seu peso — descontando o tempo parado na borda.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraNatacao placement="calculadora-calorias-natacao" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias cada nado queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Uma hora nadando, para 70 e 80 kg:</p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em uma hora de natação por nado, para 70 e 80 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Nado</th>
                    <th scope="col" className={th}>METs</th>
                    <th scope="col" className={th}>70 kg</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">80 kg</th>
                  </tr>
                </thead>
                <tbody>
                  {[...TAB].sort((a, b) => b.kcal70 - a.kcal70).map((l) => (
                    <tr key={l.nado.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{l.nado.nome}</td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums">{metF(l.nado.met)}</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(l.kcal70)} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {mil(l.kcal80)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Nenhuma outra atividade do site varia tanto de uma opção para a outra: a borboleta gasta mais que o dobro do crawl
              leve. Costas e peito aqui são o ritmo de treino, com séries; nadados de passeio, gastam bem menos.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O tempo parado na borda</h2>
            <p className="text-gray-300 leading-relaxed">
              O erro mais comum de quem conta a piscina é somar o tempo parado. Para {PESO_PADRAO} kg em crawl leve,{" "}
              <strong className="text-white">40 minutos nadando gastam cerca de {kc(SEM_BORDA.kcal)} kcal</strong>; os mesmos 40
              minutos com 15 parados na borda, cerca de {kc(COM_BORDA.kcal)}. Na borda, o gasto é o de ficar em pé,{" "}
              {metF(MET_BORDA)} MET. Por isso a calculadora pergunta os dois tempos em separado — e não supõe quanto você parou.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Natação emagrece quantos quilos?</h2>
            <p className="text-gray-300 leading-relaxed">
              Só da piscina, pouco: três treinos de 45 minutos de crawl leve por semana somam no máximo {kg(TRES)} kg de gordura
              por mês para {PESO_PADRAO} kg. O{" "}
              <Link href="/blog/natacao-emagrece" className={ln}>artigo sobre natação e emagrecimento</Link> explica o resto: a
              fome depois da piscina e por que a natação pede treino de força junto.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">total = tempo nadando × MET do nado + tempo na borda × {metF(MET_BORDA)}</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_NATACAO.rotuloCurto}, que {FONTE_COMPENDIO_NATACAO.resumo} Hidroginástica fica de
              fora por enquanto: as fontes divergem sobre o valor dela.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 23 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-natacao" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_NATACAO.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/natacao-emagrece" className={ln}>Natação emagrece? Calorias, prós e contras</Link></li>
              <li><Link href="/ferramentas/calculadora-corrida" className={ln}>Calculadora de Corrida — pace, tempo e calorias</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-atividades" className={ln}>Calculadora de Calorias por Atividade — escada e bicicleta</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
