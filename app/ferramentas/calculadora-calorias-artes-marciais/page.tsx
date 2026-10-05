import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraArtesMarciais from "@/components/artes-marciais/CalculadoraArtesMarciais";
import { KCAL_POR_KG_GORDURA } from "@/lib/polichinelo";
import { TREINO } from "@/lib/simulador/emagrecimento";
import {
  FONTES_ARTES,
  FONTE_COMPENDIO_ARTES,
  FONTE_COMPENDIO_BOXE,
  LUTA_PADRAO,
  MET_ROLA,
  MET_TECNICA,
  PESO_PADRAO,
  arredondaKcal,
  calcula,
  faixaHora,
  kcalPorMinuto,
  modalidade,
  type ModalidadeId,
} from "@/lib/artes-marciais";

/**
 * A página da Calculadora de Calorias nas Artes Marciais.
 *
 * As buscas ("quantas calorias gasta 1 hora de muay thai", "qual arte
 * marcial gasta mais calorias", "lutar é bom para emagrecer", kickboxing,
 * taekwondo, judô) pedem número por hora e comparação entre lutas. A visão
 * por IA do Google enquadra a conta como MET × peso × tempo e repete faixas
 * de 500 a 1.000 kcal por hora; a conta pelo Compêndio mostra por que o
 * número real depende de quanto da aula foi luta.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-artes-marciais";

export const metadata: Metadata = {
  title: "Calculadora de Calorias Artes Marciais: Muay Thai, Jiu-Jitsu",
  description:
    "Quantas calorias gasta uma aula de jiu-jitsu, muay thai, judô, caratê, taekwondo, kickboxing, MMA ou boxe, com o seu peso e o tempo de luta.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias nas Artes Marciais | Montinho Personal Trainer",
    description: "Modalidade, peso, duração da aula e minutos de luta: veja quanto a aula gastou e compare com as outras artes marciais.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias nas Artes Marciais",
  descricao:
    "Estima o gasto calórico de uma aula de arte marcial (jiu-jitsu, muay thai, judô, caratê, taekwondo, kickboxing, MMA ou boxe) a partir do peso, da duração da aula e dos minutos de luta, separando técnica e luta e comparando a mesma aula entre as modalidades.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias nas Artes Marciais", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const FAIXA = faixaHora(PESO_PADRAO);
const f = (id: ModalidadeId) => FAIXA.find((l) => l.modalidade.id === id)!;
const mil = (n: number) => n.toLocaleString("pt-BR");
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const faixaTexto = (id: ModalidadeId) => `${mil(f(id).tecnica)} a ${mil(f(id).luta)} kcal`;

/** Aula típica de referência: 60 min com LUTA_PADRAO de luta. */
const TIPICA = calcula("jiujitsu", PESO_PADRAO, 60, LUTA_PADRAO)!;
const TIPICA_BOXE = calcula("boxe", PESO_PADRAO, 60, LUTA_PADRAO)!;
const MUSCULACAO = kcalPorMinuto(TREINO.musculacao.met, PESO_PADRAO) * 60;
const SEMANA3 = TIPICA.kcal * 3;
const G_SEMANA3 = Math.round((SEMANA3 / KCAL_POR_KG_GORDURA) * 1000);
const BOXE = modalidade("boxe");

const respostaHora = (id: ModalidadeId, nome: string) => ({
  question: `Quantas calorias gasta 1 hora de ${nome}?`,
  answer: `Para ${PESO_PADRAO} kg, entre ${faixaTexto(id)}: a ponta de baixo é uma hora só de técnica, a de cima uma hora inteira de ${modalidade(id).luta}. Uma aula real mistura as duas e fica no meio. Com ${LUTA_PADRAO} minutos de ${modalidade(id).luta} numa aula de 1 hora, dá cerca de ${kc(calcula(id, PESO_PADRAO, 60, LUTA_PADRAO)!.kcal)} kcal.`,
});

const faq: ItemFAQ[] = [
  respostaHora("muaythai", "muay thai"),
  respostaHora("jiujitsu", "jiu-jitsu"),
  respostaHora("judo", "judô"),
  respostaHora("karate", "caratê"),
  respostaHora("taekwondo", "taekwondo"),
  respostaHora("kickboxing", "kickboxing"),
  {
    question: "Quantas calorias gasta 1 hora de boxe?",
    answer: `Para ${PESO_PADRAO} kg, entre ${faixaTexto("boxe")}: uma hora de saco de pancada (${metF(BOXE.metTecnica)} METs) e uma hora inteira de sparring (${metF(BOXE.metLuta)} METs), pelo ${FONTE_COMPENDIO_BOXE.rotuloCurto}.`,
  },
  {
    question: "Quantas calorias gasta 1 hora de MMA?",
    answer: `Para ${PESO_PADRAO} kg, entre ${faixaTexto("mma")}. O Compêndio não tem uma entrada própria para o MMA; como ele mistura as artes marciais, usamos os valores delas: técnica ${metF(MET_TECNICA)} METs e luta ${metF(MET_ROLA)}.`,
  },
  {
    question: "Qual arte marcial (ou luta) gasta mais calorias?",
    answer: `A que tem mais tempo de luta de verdade dentro da aula. O Compêndio de Atividades Físicas não ranqueia os estilos: mede as artes marciais juntas, ${metF(MET_TECNICA)} METs em treino e ${metF(MET_ROLA)} em ritmo de luta. O sparring de boxe tem MET menor (${metF(BOXE.metLuta)}). Uma aula de judô com muito randori gasta mais que uma de muay thai só de técnica, e vice-versa.`,
  },
  {
    question: "Qual queima mais calorias, jiu-jitsu ou muay thai?",
    answer: `No mesmo ritmo, os dois empatam: o Compêndio dá o mesmo valor a qualquer arte marcial em ritmo de luta (${metF(MET_ROLA)} METs). Para ${PESO_PADRAO} kg, uma hora inteira lutando daria cerca de ${kc(FAIXA[0].luta)} kcal em qualquer um. O que muda de uma aula para outra é quanto tempo dela é luta de verdade.`,
  },
  {
    question: "Dá para queimar 1.000 calorias em 1 hora de luta?",
    answer: `Para ${PESO_PADRAO} kg, nem uma hora inteira em ritmo de luta chega lá (≈ ${kc(FAIXA[0].luta)} kcal). Os 1.000 kcal pedem uma pessoa bem mais pesada em esforço máximo sem pausa, o que nenhuma aula real é. Use a calculadora com o seu peso para ver o seu número.`,
  },
  {
    question: "Qual a melhor luta para perder barriga ou definir o corpo?",
    answer: "Nenhuma luta tira gordura de um lugar específico. A melhor é a que você vai treinar várias vezes por semana por meses, porque é a constância que gasta. Para definir, a gordura precisa baixar e o músculo aparecer, e isso vem de luta ou cardio, musculação e alimentação juntos. Vale para homens e mulheres.",
  },
  {
    question: "Lutar é bom para emagrecer?",
    answer: `Ajuda de dois jeitos: a aula gasta bastante e, para muita gente, é um treino que dá vontade de voltar, e a constância pesa mais que qualquer aula isolada. Mas quem decide se o peso cai é o déficit do dia inteiro, não a luta sozinha.`,
  },
  {
    question: "Luta emagrece mais que academia?",
    answer: `Por hora, a aula de luta gasta mais: para ${PESO_PADRAO} kg, uma aula de 1 hora com ${LUTA_PADRAO} minutos de rola dá cerca de ${kc(TIPICA.kcal)} kcal, contra cerca de ${kc(MUSCULACAO)} kcal de uma hora de musculação (${metF(TREINO.musculacao.met)} METs no Compêndio). Mas a musculação preserva músculo enquanto você emagrece. O melhor é combinar; se tiver de escolher, fique com o que você consegue manter.`,
  },
  {
    question: "Quantas calorias gasta na luta por dia?",
    answer: `É o gasto de cada aula vezes quantas aulas você faz. Três aulas por semana de 1 hora com ${LUTA_PADRAO} minutos de luta somam cerca de ${mil(arredondaKcal(SEMANA3))} kcal por semana para ${PESO_PADRAO} kg; a calculadora acima dá o número da sua aula.`,
  },
  {
    question: "Muay thai emagrece quantos quilos por semana?",
    answer: `Só das aulas, pouco: três aulas de 1 hora com ${LUTA_PADRAO} minutos de sparring somam cerca de ${mil(arredondaKcal(SEMANA3))} kcal, o equivalente a uns ${mil(G_SEMANA3)} g de gordura por semana (a ${mil(KCAL_POR_KG_GORDURA)} kcal por quilo), se nada mais mudar. É estimativa e teto: o corpo compensa parte do gasto, e o resto vem da alimentação.`,
  },
  {
    question: "E as artes marciais chinesas, como o kung fu?",
    answer:
      "Ficaram de fora. O kung fu não aparece pelo nome no Compêndio, e o tai chi é outra atividade, bem mais leve, que não se mede como luta. Capoeira e wrestling também não estão na calculadora: sem um valor verificado, preferimos não inventar número.",
  },
  {
    question: "Como é calculado?",
    answer: `kcal por minuto = MET × 3,5 × peso (kg) ÷ 200, somando o tempo de técnica e o tempo de luta. Os METs vêm do ${FONTE_COMPENDIO_ARTES.rotuloCurto} (artes marciais) e do ${FONTE_COMPENDIO_BOXE.rotuloCurto} (boxe).`,
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((x) => ({ "@type": "Question", name: x.question, acceptedAnswer: { "@type": "Answer", text: x.answer } })),
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const th = "text-left text-gray-400 font-medium py-2.5 pr-4";

export default function CalculadoraArtesMarciaisPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias nas Artes Marciais
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias nas Artes Marciais" caminho={CAMINHO} local="tool_top" ferramenta="artesmarciais" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Jiu-jitsu, muay thai, judô, caratê, taekwondo, kickboxing, MMA e boxe. O gasto é MET × peso × tempo: escolha a luta, informe o
            peso, a duração da aula e quanto dela foi luta.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraArtesMarciais placement="calculadora-calorias-artes-marciais" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias cada arte marcial gasta por hora</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              A internet fala em 500 a 1.000 kcal por hora: muay thai e MMA de 600 a 1.000, jiu-jitsu de 600 a 800, boxe de 500 a 800,
              caratê e taekwondo de 400 a 600 para {PESO_PADRAO} kg. A conta pelo Compêndio, para {PESO_PADRAO} kg em 1 hora, dá isto:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de 1 hora de cada arte marcial para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Modalidade</th>
                    <th scope="col" className={th}>Só técnica</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Só luta</th>
                  </tr>
                </thead>
                <tbody>
                  {FAIXA.map((l) => (
                    <tr key={l.modalidade.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{l.modalidade.nome}</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">≈ {mil(l.tecnica)} kcal</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">≈ {mil(l.luta)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Nenhuma aula real é uma hora inteira de luta. Ela mistura aquecimento, técnica, drill e alguns minutos de rola, sparring,
              randori ou kumite, então a maioria das aulas fica entre as duas colunas. Os 1.000 kcal supõem uma pessoa bem mais pesada
              lutando a hora toda.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Qual luta mais queima calorias?</h2>
            <p className="text-gray-300 leading-relaxed">
              O Compêndio não ranqueia os estilos: jiu-jitsu, muay thai, judô, caratê, taekwondo e kickboxing têm os mesmos valores,{" "}
              {metF(MET_TECNICA)} METs em treino e {metF(MET_ROLA)} em luta. O sparring de boxe fica abaixo ({metF(BOXE.metLuta)}). Na
              prática, gasta mais a aula em que você luta mais: com {LUTA_PADRAO} minutos de luta em 1 hora, a aula de jiu-jitsu dá cerca
              de {kc(TIPICA.kcal)} kcal e a de boxe cerca de {kc(TIPICA_BOXE.kcal)} kcal.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Lutar emagrece?</h2>
            <p className="text-gray-300 leading-relaxed">
              Ajuda: a aula gasta bem e, para muita gente, é o treino que dá vontade de repetir. Três aulas típicas por semana somam cerca
              de {mil(arredondaKcal(SEMANA3))} kcal para {PESO_PADRAO} kg, uns {mil(G_SEMANA3)} g de gordura se nada mais mudar. O resto
              vem da alimentação. Veja os artigos sobre{" "}
              <Link href="/blog/muay-thai-emagrece" className={ln}>muay thai</Link>,{" "}
              <Link href="/blog/jiu-jitsu-emagrece" className={ln}>jiu-jitsu</Link> e{" "}
              <Link href="/blog/boxe-emagrece" className={ln}>boxe</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">técnica = aula − minutos de luta</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              O {FONTE_COMPENDIO_ARTES.rotuloCurto} {FONTE_COMPENDIO_ARTES.resumo} O MMA não tem entrada própria e usa esses valores. O
              boxe vem do {FONTE_COMPENDIO_BOXE.rotuloCurto}: saco de pancada como técnica ({metF(BOXE.metTecnica)}) e sparring como luta
              ({metF(BOXE.metLuta)}). Kung fu, capoeira, tai chi e wrestling ficaram de fora por não termos valor verificado.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 3 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
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
            <FAQ itens={faq} placement="ferramenta-artes-marciais" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_ARTES.map((x) => (
                <li key={x.rotulo}>
                  <a href={x.url} target="_blank" rel="noopener noreferrer" className={ln}>{x.rotulo}</a> — {x.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/ferramentas/calculadora-calorias-jiu-jitsu" className={ln}>Calculadora de Calorias no Jiu-Jitsu</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-muay-thai" className={ln}>Calculadora de Calorias no Muay Thai</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-boxe" className={ln}>Calculadora de Calorias no Boxe</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE: o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
