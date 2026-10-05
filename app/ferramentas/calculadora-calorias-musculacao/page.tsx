import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraMusculacao from "@/components/musculacao/CalculadoraMusculacao";
import {
  FONTES_MUSCULACAO,
  FONTE_COMPENDIO_MUSCULACAO,
  FONTE_HALL,
  KCAL_POR_KG_GORDURA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_PADRAO,
  TIPOS,
  arredondaKcal,
  comparaComCardio,
  deKcal,
  deTempo,
  formataTempo,
  kcalLiquida,
  simulacaoUmQuilo,
  tabelaPorPeso,
  tabelaPorTempo,
  tipo,
} from "@/lib/musculacao";

/**
 * A página da Calculadora de Calorias da Musculação.
 *
 * Feita a partir dos prints de "musculação queima quantas calorias"
 * (05/10/2026): autocompletar por tempo (20 a 60 minutos, 1h30, 2 horas),
 * "musculação queima mais que cardio", "depois do treino", e as perguntas
 * "30 minutos", "musculação ou cardio", "emagrecer com 1 hora por dia" e
 * "emagrecer só com musculação".
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-musculacao";

export const metadata: Metadata = {
  title: "Musculação Queima Quantas Calorias? 30 Min, 1 Hora e Cálculo",
  description:
    "Quantas calorias a musculação queima em 20, 30, 40 minutos, 1 hora e 2 horas, com o seu peso e o seu tipo de treino. Compare com o cardio e veja se emagrece.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias da Musculação | Montinho Personal Trainer",
    description: "Quantas calorias o seu treino de musculação gasta, com o seu peso e o seu tipo de treino, comparado com o cardio.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias da Musculação",
  descricao:
    "Estima o gasto calórico de um treino de musculação a partir do peso corporal, do tempo e do tipo de treino, calcula o tempo para uma meta de calorias e compara com caminhada e corrida.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias da Musculação", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const TRAD = tipo("tradicional");
const PES = tipo("pesado");
const CIRC = tipo("circuito");
const EX = (min: number, met = TRAD.met) => deTempo(min, PESO_PADRAO, met);
const TAB_PESO = tabelaPorPeso(60);
const TAB_TEMPO = tabelaPorTempo(PESO_PADRAO);
const CMP = comparaComCardio(60, PESO_PADRAO);
const CAM = CMP.find((l) => l.id === "caminhada")!;
const COR = CMP.find((l) => l.id === "corrida")!;
const META_300 = deKcal(300, PESO_PADRAO, TRAD.met);
const UM_QUILO = simulacaoUmQuilo(PESO_PADRAO, TRAD.met);
const POR_MIN = EX(1).kcal;
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });
const faixa = (min: number) => `${arredondaKcal(EX(min).kcal)} a ${arredondaKcal(EX(min, CIRC.met).kcal)} kcal`;

const faq: ItemFAQ[] = [
  {
    question: "1 hora de musculação queima quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg, de ${faixa(60)}, do treino tradicional ao circuito com superséries. Com 90 kg, o tradicional passa de ${arredondaKcal(deTempo(60, 90, TRAD.met).kcal)} kcal. Bate com a faixa de 200 a 400 kcal que aparece nas buscas, mas o seu peso e o seu tipo de treino mudam o número: a calculadora faz a sua conta.`,
  },
  {
    question: "30 minutos de musculação queimam quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg, de ${faixa(30)}, conforme o tipo de treino.`,
  },
  {
    question: "20, 40 e 50 minutos de musculação queimam quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg em treino tradicional: 20 minutos ≈ ${arredondaKcal(EX(20).kcal)} kcal, 40 minutos ≈ ${arredondaKcal(EX(40).kcal)} kcal e 50 minutos ≈ ${arredondaKcal(EX(50).kcal)} kcal. Em circuito, cerca de 65% a mais.`,
  },
  {
    question: "2 horas de musculação queimam quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg, de ${faixa(120)}; 1h30 fica em ${faixa(90)}. Treinos tão longos raramente rendem mais resultado que uma sessão de 45 a 75 minutos bem feita.`,
  },
  {
    question: "Musculação queima calorias depois do treino?",
    answer: "Queima um pouco mais nas horas seguintes, o chamado EPOC, mas é pouco perto da sessão: algumas dezenas de calorias, não centenas. O efeito maior da musculação é outro: músculo preservado e ganho, que mantém o gasto do dia e muda como o corpo fica quando o peso cai.",
  },
  {
    question: "Musculação queima mais calorias que cardio?",
    answer: `Por minuto, não. Em 1 hora para ${PESO_PADRAO} kg: musculação tradicional ≈ ${arredondaKcal(EX(60).kcal)} kcal, caminhada moderada ≈ ${arredondaKcal(CAM.kcal)} kcal e corrida a 8 km/h ≈ ${arredondaKcal(COR.kcal)} kcal. Mas é a musculação que preserva músculo enquanto você emagrece. O melhor é combinar os dois.`,
  },
  {
    question: "O que queima mais gordura, musculação ou cardio?",
    answer: "A gordura sai quando a semana fecha em déficit, e as duas ajudam. O cardio soma mais gasto por minuto; a musculação garante que o peso perdido seja mais gordura e menos músculo. Quem faz só cardio em déficit tende a perder mais músculo junto.",
  },
  {
    question: "É possível emagrecer com 1 hora de musculação por dia?",
    answer: `É possível, desde que a alimentação feche a semana em déficit. Uma hora de treino tradicional gasta perto de ${arredondaKcal(EX(60).kcal)} kcal para ${PESO_PADRAO} kg: ajuda, mas não compensa comer acima do gasto. Não precisa ser todo dia: 3 a 5 treinos por semana bastam para a maioria.`,
  },
  {
    question: "É possível emagrecer só com musculação?",
    answer: "É, se a alimentação estiver em déficit. Muita gente emagrece só com musculação e alimentação ajustada, e mantém mais músculo do que quem faz só cardio. Somar caminhada ou outro cardio deixa o déficit mais fácil, mas não é obrigatório.",
  },
  {
    question: "Quanto tempo de musculação para queimar 300 calorias?",
    answer: `Para ${PESO_PADRAO} kg em treino tradicional, cerca de ${formataTempo(META_300.minutos)}. Em circuito ou com peso maior, bem menos.`,
  },
  {
    question: "Quais exercícios de musculação gastam mais calorias?",
    answer: "Os que movem mais músculo de uma vez: agachamento, levantamento terra, afundo, remada e supino gastam mais que exercícios isolados como rosca e extensora. Descanso curto entre as séries também sobe o gasto. Por isso o tipo de treino pesa mais no número que a carga de um exercício só.",
  },
  {
    question: "Musculação perde barriga?",
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

export default function CalculadoraMusculacaoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Musculação queima quantas calorias?
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias da Musculação" caminho={CAMINHO} local="tool_top" ferramenta="musculacao" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Descubra quanto o seu treino gasta com o seu peso, o tempo e o tipo de treino, e compare com o cardio.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraMusculacao placement="calculadora-calorias-musculacao" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>1 hora de musculação queima quantas calorias?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Para uma pessoa de {PESO_PADRAO} kg, uma hora de musculação gasta de{" "}
              <strong className="text-white">{faixa(60)}</strong>: o menor número é o treino tradicional, com séries de 8 a 15
              repetições e descanso entre elas; o maior é o circuito com superséries, quase sem pausa.
            </p>
            <p className="text-gray-300 leading-relaxed mb-5">
              O que mais muda o número é o <strong className="text-white">peso corporal</strong>, seguido do{" "}
              <strong className="text-white">tipo de treino</strong>: exercícios grandes, como agachamento e terra, e descanso
              curto sobem o gasto. A tabela é para 1 hora:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em 1 hora de musculação por peso corporal e tipo de treino</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    <th scope="col" className={th}>Tradicional</th>
                    <th scope="col" className={th}>Pesado</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Circuito</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_PESO.map((l) => (
                    <tr key={l.chave} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.chave} kg</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {l.tradicional} kcal</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">≈ {l.pesado} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {l.circuito} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Por tempo: 20, 30, 40, 50 minutos, 1h30 e 2 horas</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              O gasto é proporcional ao tempo: cerca de <strong className="text-white">{fmt(POR_MIN)} kcal por minuto</strong> no
              treino tradicional e {fmt(EX(1, CIRC.met).kcal)} kcal no circuito. Para {PESO_PADRAO} kg:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de musculação por tempo, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Tempo</th>
                    <th scope="col" className={th}>Tradicional</th>
                    <th scope="col" className={th}>Pesado</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Circuito</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_TEMPO.map((l) => (
                    <tr key={l.chave} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{formataTempo(l.chave)}</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {l.tradicional} kcal</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">≈ {l.pesado} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {l.circuito} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Musculação queima mais calorias que cardio?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Uma hora, {PESO_PADRAO} kg, do que gasta mais para o que gasta menos:</p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Comparação de gasto em 1 hora entre musculação, caminhada e corrida, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Atividade</th>
                    <th scope="col" className={th}>METs</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">1 hora</th>
                  </tr>
                </thead>
                <tbody>
                  {CMP.map((l) => (
                    <tr key={l.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{l.nome}</td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums">{fmt(l.met)}</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">≈ {arredondaKcal(l.kcal)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Por minuto, o cardio contínuo ganha, e não precisa ser diferente: o papel da musculação é outro. Em déficit, é ela
              que avisa o corpo para manter o músculo, e é por isso que quem treina força emagrece com mais gordura e menos
              músculo no peso perdido. Para escolher a ordem, veja{" "}
              <Link href="/blog/cardio-antes-ou-depois-da-musculacao" className={ln}>cardio antes ou depois da musculação</Link>; para
              a dose, <Link href="/blog/quanto-de-cardio-fazer" className={ln}>quanto de cardio fazer</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Musculação queima calorias depois do treino?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Sim, mas menos do que se promete. O gasto extra nas horas seguintes, chamado de EPOC, existe e é maior em treinos
              intensos, mas fica em dezenas de calorias, não centenas. Por isso esta calculadora não soma nada por ele.
            </p>
            <p className="text-gray-300 leading-relaxed">
              O efeito que dura de verdade é o músculo: ele é tecido ativo, ajuda a manter o gasto do dia e muda como o corpo
              fica quando a balança desce. É um ganho de meses, não de horas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Dá para emagrecer só com musculação?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Dá, se a alimentação fechar a semana em déficit. Uma hora de treino tradicional gasta perto de{" "}
              {arredondaKcal(EX(60).kcal)} kcal para {PESO_PADRAO} kg: ajuda, mas o que decide é o total da semana. Para achar o
              seu número, use a <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>calculadora de déficit calórico</Link>.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Matematicamente, um quilo de gordura guarda cerca de {KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal, o que daria
              algo como <strong className="text-white">{formataTempo(UM_QUILO.minutos)}</strong> de musculação tradicional para{" "}
              {PESO_PADRAO} kg. É simulação teórica: o corpo não responde de forma linear. {FONTE_HALL.rotuloCurto} {FONTE_HALL.resumo}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">{fmt(TRAD.met)} × 3,5 × {PESO_PADRAO} ÷ 200 = <span className="text-white">≈ {fmt(POR_MIN)} kcal/min</span></p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_MUSCULACAO.rotuloCurto}, que {FONTE_COMPENDIO_MUSCULACAO.resumo} A calculadora usa as
              três entradas como estão: {TIPOS.map((t) => `${t.nome.toLowerCase()} ${fmt(t.met)} METs`).join(", ")}. O Compêndio
              mediu a sessão inteira, com as pausas dentro, então o tempo que você informa é o do treino todo.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os números são <strong className="text-white">brutos</strong>. Descontando o que se gastaria parado, 1 hora de treino
              tradicional para {PESO_PADRAO} kg acrescenta cerca de {arredondaKcal(kcalLiquida(EX(60), PESO_PADRAO))} kcal ao dia.
              O treino pesado ({fmt(PES.met)} METs) fica entre os dois.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div className="border border-white/15 p-5">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
            {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white leading-relaxed mb-3">{t}</p>)}
            <p className="text-gray-400 text-sm">— Montinho</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-musculacao" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_MUSCULACAO.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/cardio-atrapalha-a-hipertrofia" className={ln}>Cardio atrapalha a hipertrofia?</Link></li>
              <li><Link href="/ferramentas/calculadora-volume-treino" className={ln}>Calculadora de Volume de Treino: quantas séries por semana</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-atividades" className={ln}>Qual atividade queima mais calorias? Compare 15 esportes</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
