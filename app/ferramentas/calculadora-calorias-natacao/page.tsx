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
  title: "Calculadora de Calorias na Natação: Por Nado e Tempo",
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
