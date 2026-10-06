import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraSuperavit from "@/components/calorias/CalculadoraSuperavit";
import {
  FAIXAS_SUPERAVIT,
  NIVEIS,
  REFERENCIA_SUPERAVIT,
  REFERENCIA_TMB,
  aplicaSuperavit,
  calculaTDEE,
  calculaTMB,
  formataFaixa,
} from "@/lib/calorias";

/**
 * A página da Calculadora de Superávit Calórico.
 *
 * Feita a partir dos prints de "calculadora de superávit calórico"
 * (05/10/2026): a visão geral por IA explica TMB → TDEE → excedente e traz
 * as faixas "lean bulk" (+10%), moderado (+15%) e agressivo (+20%); as buscas
 * relacionadas pedem "superávit calórico como fazer", "quantas calorias devo
 * ingerir por dia" e "tabela de calorias por peso". É o espelho da
 * calculadora de déficit, com a mesma equação de TMB.
 */

const CAMINHO = "/ferramentas/calculadora-superavit-calorico";

export const metadata: Metadata = {
  title: "Calculadora de Superávit Calórico para Ganhar Massa (Grátis)",
  description:
    "Calcule seu gasto diário e quantas calorias comer para ganhar massa muscular, com faixas de superávit de 5–10%, 10–15% e 20%. Gratuita, sem cadastro.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Superávit Calórico | Montinho Personal Trainer",
    description:
      "Quantas calorias comer para ganhar massa? Informe peso, altura, idade e rotina para estimar seu gasto e ver faixas de superávit. Gratuita, sem cadastro.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Superávit Calórico",
  descricao:
    "Estima a taxa metabólica basal (Mifflin-St Jeor) e o gasto diário pelo nível de atividade, e mostra faixas de superávit em percentual do gasto para ganho de massa muscular.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Superávit Calórico", item: `${SITE_URL}${CAMINHO}` },
  ],
};

/** Exemplo fixo: o robô não digita peso. Homem, 70 kg, 1,75 m, 25 anos, moderadamente ativo. */
const NIVEL_EX = NIVEIS.find((n) => n.id === "moderado")!;
const TDEE_EX = calculaTDEE(calculaTMB(70, 175, 25, "masculino"), NIVEL_EX.fator);
const MOD = FAIXAS_SUPERAVIT.find((f) => f.id === "moderado")!;
const metaDe = (tdee: { min: number; max: number }, pMin: number, pMax: number) => ({
  min: aplicaSuperavit(tdee, pMin).min,
  max: aplicaSuperavit(tdee, pMax).max,
});
const META_EX = metaDe(TDEE_EX, MOD.percentualMin, MOD.percentualMax);

/** Tabela por peso: homem de 1,75 m e mulher de 1,63 m, 25 anos, moderadamente ativos, superávit moderado. */
const PESOS = [55, 60, 70, 80, 90];
const TAB = PESOS.map((p) => {
  const h = calculaTDEE(calculaTMB(p, 175, 25, "masculino"), NIVEL_EX.fator);
  const m = calculaTDEE(calculaTMB(p, 163, 25, "feminino"), NIVEL_EX.fator);
  return { peso: p, homem: metaDe(h, MOD.percentualMin, MOD.percentualMax), mulher: metaDe(m, MOD.percentualMin, MOD.percentualMax) };
});

const faq: ItemFAQ[] = [
  {
    question: "Como fazer um superávit calórico?",
    answer: `Descubra quanto você gasta por dia (a TMB vezes o fator de atividade) e coma um pouco acima disso. Para um homem de 70 kg, 1,75 m e 25 anos, moderadamente ativo, o gasto fica perto de ${formataFaixa(TDEE_EX)} kcal; com superávit moderado, a meta vai para cerca de ${formataFaixa(META_EX)} kcal por dia. A calculadora faz as duas contas com os seus dados.`,
  },
  {
    question: "O que é superávit calórico e como funciona?",
    answer: "É comer mais calorias do que o corpo gasta no dia. A sobra de energia, junto com o treino de força, dá ao corpo condição de construir músculo; sem treino, a sobra vai principalmente para gordura. É o contrário do déficit, que é comer menos do que se gasta para perder gordura.",
  },
  {
    question: "Superávit calórico engorda?",
    answer: "Faz o peso subir, e parte desse ganho é gordura: não existe superávit que só ganhe músculo. O que controla essa proporção é o tamanho do excedente e o treino. Superávit pequeno, com musculação e peso subindo devagar, ganha mais músculo para cada quilo de gordura.",
  },
  {
    question: "O que é superávit calórico limpo, leve ou controlado?",
    answer: "São nomes para o mesmo ajuste: um excedente pequeno, de cerca de 5% a 15% acima do gasto, com o peso subindo devagar. É o que muita gente chama de 'lean bulk'. 'Limpo' às vezes se refere também à qualidade da comida, mas o que define o resultado é o tamanho do excedente e a constância.",
  },
  {
    question: "Qual a diferença entre déficit e superávit calórico?",
    answer: "No déficit você come menos do que gasta e perde peso; no superávit, come mais e ganha. Os dois partem da mesma conta, o seu gasto diário. Para perder gordura, use a calculadora de déficit calórico.",
  },
  {
    question: "Quantas calorias devo ingerir por dia para ganhar massa?",
    answer: "Seu gasto diário mais 10% a 15% é uma referência prática para iniciantes e intermediários; quem treina há anos costuma precisar de menos (5% a 10%). O número certo é o que faz a média semanal do peso subir devagar, com a cintura estável.",
  },
  {
    question: "Qual o superávit ideal para ganhar massa sem engordar?",
    answer: "Não existe superávit sem nenhum ganho de gordura, mas superávits menores trazem menos. Para iniciantes e intermediários, cerca de 10% a 20% acima da manutenção (Iraki et al., 2019); quanto mais avançado, menor. Acima de 20%, a parte de gordura no ganho costuma subir sem acelerar o músculo.",
  },
  {
    question: "Superávit de 300 ou 500 calorias: qual usar?",
    answer: "Um número fixo pesa diferente para cada pessoa: 300 kcal são cerca de 10% para quem gasta 3.000, e quase 20% para quem gasta 1.700. Por isso a calculadora trabalha em percentual do gasto. Na prática, 200 a 300 kcal ficam perto de um 'lean bulk', e 300 a 500 kcal, de um superávit moderado.",
  },
  {
    question: "Quanto peso ganhar por semana no bulking?",
    answer: "Para iniciantes e intermediários, algo perto de 0,25% a 0,5% do peso por semana: 175 a 350 g para quem pesa 70 kg. Mais que isso, com a cintura subindo junto, costuma ser gordura demais.",
  },
  {
    question: "Superávit calórico sem treino ganha músculo?",
    answer: "Quase nada. Sem musculação com carga subindo ao longo das semanas, o excedente vira gordura. O superávit dá a energia; o treino de força é o que manda o corpo construir músculo, e a proteína fornece o material.",
  },
  {
    question: "Preciso de muita proteína no superávit?",
    answer: "A referência é 1,6 a 2,2 g de proteína por kg de peso por dia, a mesma faixa do resto do ano. A calculadora de proteína faz a conta, e a de macros distribui o resto das calorias.",
  },
  {
    question: "A calculadora de superávit calórico é gratuita?",
    answer: "Sim. É gratuita, funciona online e não pede cadastro; os dados que você digita não saem do navegador.",
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

export default function CalculadoraSuperavitPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Superávit Calórico
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Superávit Calórico" caminho={CAMINHO} local="tool_top" ferramenta="calculadora_superavit" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Descubra quanto você gasta por dia e quantas calorias comer para ganhar massa muscular, sem exagerar na gordura.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraSuperavit placement="pagina-superavit" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como funciona o superávit calórico</h2>
            <ol className="space-y-3 text-gray-300 leading-relaxed list-decimal pl-5">
              <li><strong className="text-white">Taxa metabólica basal (TMB):</strong> o que o corpo gasta em repouso, estimado pela equação de {REFERENCIA_TMB.rotuloCurto}.</li>
              <li><strong className="text-white">Gasto diário (TDEE):</strong> a TMB vezes o fator da sua rotina, do pouco ativo (×1,2) ao extremamente ativo (×1,9).</li>
              <li><strong className="text-white">Superávit:</strong> um percentual acima do gasto, para sobrar energia para o músculo crescer.</li>
            </ol>
            <p className="text-gray-300 leading-relaxed mt-4">
              Exemplo: homem de 70 kg, 1,75 m e 25 anos, moderadamente ativo, gasta perto de{" "}
              <strong className="text-white">{formataFaixa(TDEE_EX)} kcal</strong> por dia. Com superávit moderado, a meta
              fica em cerca de <strong className="text-white">{formataFaixa(META_EX)} kcal</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Faixas de superávit: lean bulk, moderado e agressivo</h2>
            <div className="space-y-4">
              {FAIXAS_SUPERAVIT.map((f) => (
                <div key={f.id} className={`border p-5 ${f.destaque ? "border-[#BA9E50]/60 bg-[#BA9E50]/[0.06]" : "border-white/15"}`}>
                  <p className="text-white font-semibold mb-1">
                    {f.titulo}: +{f.percentualMin === f.percentualMax ? `${f.percentualMin}%` : `${f.percentualMin}–${f.percentualMax}%`}
                    {f.destaque && <span className="text-gray-400 font-normal"> · referência prática</span>}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">{f.descricao}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              As faixas seguem a revisão de{" "}
              <a href={REFERENCIA_SUPERAVIT.url} target="_blank" rel="noopener noreferrer" className={ln}>{REFERENCIA_SUPERAVIT.rotuloCurto}</a>{" "}
              sobre nutrição fora de competição: cerca de 10% a 20% acima da manutenção para iniciantes e intermediários,
              menos para quem já é avançado.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Tabela de calorias por peso para ganhar massa</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Superávit moderado, 25 anos, moderadamente ativo. Homem de 1,75 m e mulher de 1,63 m:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Calorias por dia com superávit moderado, por peso, para homem e mulher</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    <th scope="col" className={th}>Homem</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Mulher</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {formataFaixa(l.homem)} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {formataFaixa(l.mulher)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">Altura, idade e rotina mudam bastante o número: use a calculadora acima com os seus dados.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Superávit sem treino é só gordura</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Comer acima do gasto dá energia; quem decide para onde ela vai é o treino. Sem musculação com a carga subindo
              semana a semana, o excedente vira gordura. Com treino e proteína suficiente, uma parte maior vira músculo.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Para acompanhar, olhe a <strong className="text-white">média semanal do peso</strong> e a{" "}
              <strong className="text-white">cintura</strong> juntas. Peso parado por duas ou três semanas: suba 100 a 150 kcal.
              Peso subindo rápido com a cintura junto: reduza um pouco. Para ver quanto tempo leva até a sua meta, use o{" "}
              <Link href="/ferramentas/simulador-ganho-massa-muscular" className={ln}>simulador de ganho de massa</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Depois do número: proteína e macros</h2>
            <p className="text-gray-300 leading-relaxed">
              Com a meta de calorias em mãos, o próximo passo é a{" "}
              <Link href="/ferramentas/calculadora-de-proteina" className={ln}>calculadora de proteína</Link> e, para distribuir o
              resto, a <Link href="/ferramentas/calculadora-macros" className={ln}>calculadora de macros</Link>. Para transformar em
              comida, o <Link href="/ferramentas/monte-seu-cardapio" className={ln}>Montinho FitChef</Link> monta um cardápio de
              exemplo. Quem quer o caminho contrário, para emagrecer, usa a{" "}
              <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>calculadora de déficit calórico</Link>.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas educacionais, não prescrição nutricional.
            </p>
          </div>

          <div className="border border-white/15 p-5">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
            {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white leading-relaxed mb-3">{t}</p>)}
            <p className="text-gray-400 text-sm">— Montinho</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-superavit" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              <li><a href={REFERENCIA_SUPERAVIT.url} target="_blank" rel="noopener noreferrer" className={ln}>{REFERENCIA_SUPERAVIT.rotulo}</a></li>
              <li><a href={REFERENCIA_TMB.url} target="_blank" rel="noopener noreferrer" className={ln}>{REFERENCIA_TMB.rotuloCurto}</a></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
