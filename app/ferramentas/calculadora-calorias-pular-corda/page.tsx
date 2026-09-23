import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraCorda from "@/components/corda/CalculadoraCorda";
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
  title: "Calculadora de Calorias Pulando Corda: Blocos e Saltos",
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
