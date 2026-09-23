import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraZumba from "@/components/zumba/CalculadoraZumba";
import {
  FONTES_ZUMBA,
  FONTE_COMPENDIO_ZUMBA,
  KCAL_PROPAGANDA,
  MET_ALTO,
  MET_BAIXO,
  NOTA_SEM_PERDA_LOCALIZADA,
  NOTA_VERSAO,
  PESO_PADRAO,
  arredondaKcal,
  calcula,
  formataTempo,
  minutosAtePropaganda,
  semana,
  tabelaPorFrequencia,
  tabelaPorPeso,
} from "@/lib/zumba";

/**
 * A página da Calculadora de Calorias na Zumba.
 *
 * A pergunta que mais traz gente ao `zumba-emagrece` não é caloria, é
 * quilo: "zumba emagrece quantos quilos por semana", "aula de zumba
 * emagrece quantos quilos". Esta página responde com a frequência de quem
 * pergunta — e separa o que vem das aulas do que vem da alimentação.
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-zumba";

export const metadata: Metadata = {
  title: "Calculadora de Calorias na Zumba: Aula e Quilos",
  description:
    "Quantas calorias a sua aula de zumba gasta, contando as músicas com e sem salto, e quantos quilos por mês as aulas da semana rendem com o seu peso.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias na Zumba | Montinho Personal Trainer",
    description:
      "Zumba emagrece quantos quilos? Calcule pela sua aula e pela sua frequência — separando o que vem da dança do que vem da alimentação.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias na Zumba",
  descricao:
    "Estima o gasto calórico de uma aula de zumba a partir do peso corporal, do tempo e da proporção de músicas com salto, e converte as aulas da semana em quilos de gordura por mês.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias na Zumba", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const HORA = calcula(PESO_PADRAO, 60, 0.5);
const TRES = semana(HORA, 3);
const TAB_PESO = tabelaPorPeso(60);
const TAB_FREQ = tabelaPorFrequencia(PESO_PADRAO);
const MEIA_HORA = calcula(PESO_PADRAO, 30, 0.5);
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const mil = (n: number) => n.toLocaleString("pt-BR");
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const L70 = TAB_PESO.find((l) => l.peso === 70)!;

const faq: ItemFAQ[] = [
  {
    question: "Zumba emagrece quantos quilos por semana?",
    answer: `Só das aulas, pouco. Para ${PESO_PADRAO} kg, três aulas de uma hora por semana somam cerca de ${fmt(TRES.gramasSemana, 0)} g de gordura por semana, no máximo — algo como ${kg(TRES.kgMes)} kg por mês. Os números maiores que circulam somam a alimentação em déficit, que é onde está a maior parte do resultado.`,
  },
  {
    question: "Uma hora de zumba queima quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg, entre ${mil(L70.baixo)} kcal, numa aula toda sem salto, e ${mil(L70.alto)} kcal, numa aula toda com salto. Uma aula comum, com metade das músicas com salto, fica perto de ${kc(HORA.kcal)} kcal.`,
  },
  {
    question: "30 minutos de zumba queima quantas calorias?",
    answer: `Cerca de ${kc(MEIA_HORA.kcal)} kcal para ${PESO_PADRAO} kg, com metade das músicas com salto. O gasto é proporcional ao tempo.`,
  },
  {
    question: "Uma aula de zumba queima 1.000 calorias?",
    answer: `Não. Para ${PESO_PADRAO} kg, chegar a ${mil(KCAL_PROPAGANDA)} kcal exigiria ${formataTempo(minutosAtePropaganda(PESO_PADRAO, 0.5))} de aula sem parar, ou ${formataTempo(minutosAtePropaganda(PESO_PADRAO, 1))} só de músicas com salto. O número de propaganda não é medição.`,
  },
  {
    question: "Zumba em casa emagrece?",
    answer:
      "O gasto é o mesmo da academia se a aula for a mesma: o que muda o número é o peso, o tempo e quantas músicas têm salto, não o lugar. O que costuma mudar em casa é a intensidade — sem turma e sem professor, muita gente dança menos solto. Conte as músicas com salto de verdade, e a calculadora faz o resto.",
  },
  {
    question: "Zumba perde barriga?",
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

export default function CalculadoraZumbaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias na Zumba
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias na Zumba" caminho={CAMINHO} local="tool_top" ferramenta="zumba" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto a sua aula gasta, contando as músicas com e sem salto — e quantos quilos as aulas da semana rendem de verdade.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraZumba placement="calculadora-calorias-zumba" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Zumba emagrece quantos quilos?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Só das aulas, menos do que a maioria espera. Aulas de uma hora, metade das músicas com salto, {PESO_PADRAO} kg:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Quilos de gordura por mês só das aulas de zumba, por frequência semanal, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Aulas por semana</th>
                    <th scope="col" className={th}>Por semana</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Por mês</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_FREQ.map((l) => (
                    <tr key={l.aulas} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.aulas}×</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">até {fmt(l.gramasSemana, 0)} g</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">até {kg(l.kgMes)} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              É teto, pela conta linear de 7.700 kcal por quilo: o corpo compensa parte do gasto, e o peso cai mais devagar. Os
              números maiores — inclusive os do <Link href="/blog/zumba-emagrece" className={ln}>artigo sobre zumba e
              emagrecimento</Link> — somam a alimentação em déficit. É ela que faz a maior parte do trabalho; a zumba faz a
              pessoa voltar toda semana, que é o que nenhuma dieta sozinha consegue.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias uma aula de zumba queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Depende de quantas músicas têm salto. Uma hora de aula, por peso:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em uma hora de zumba por peso e proporção de músicas com salto</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    <th scope="col" className={th}>Sem salto</th>
                    <th scope="col" className={th}>Metade</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Tudo com salto</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_PESO.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">≈ {mil(l.baixo)} kcal</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(l.metade)} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {mil(l.alto)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Música com salto é a que tira os dois pés do chão. Se o joelho reclama, trocar os saltos por passos no chão custa
              pouco no gasto e alivia muito o impacto — a diferença entre as colunas é menor do que parece.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>E as 1.000 calorias por aula?</h2>
            <p className="text-gray-300 leading-relaxed">
              É marketing. Para {PESO_PADRAO} kg, chegar a {mil(KCAL_PROPAGANDA)} kcal exigiria{" "}
              <strong className="text-white">{formataTempo(minutosAtePropaganda(PESO_PADRAO, 0.5))}</strong> de aula sem parar.
              Quem acredita nesse número costuma comer de volta uma aula que não aconteceu — e é aí que a zumba para de emagrecer.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">MET da aula = {metF(MET_BAIXO)} × tempo sem salto + {metF(MET_ALTO)} × tempo com salto</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_ZUMBA.rotuloCurto}, que {FONTE_COMPENDIO_ZUMBA.resumo} A aula é dividida no tempo
              entre os dois valores medidos — nada é interpolado.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">{NOTA_VERSAO}</p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os quilos saem do gasto líquido: o que as aulas acrescentam ao que você gastaria parado, a 7.700 kcal por quilo de
              gordura.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 23 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-zumba" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_ZUMBA.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/zumba-emagrece" className={ln}>Zumba emagrece? O que esperar da dança</Link></li>
              <li><Link href="/blog/danca-emagrece" className={ln}>Dança emagrece? Calorias por estilo</Link></li>
              <li><Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>Calculadora de Déficit Calórico — onde está o resto do resultado</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-atividades" className={ln}>Calculadora de Calorias por Atividade — escada e bicicleta</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
