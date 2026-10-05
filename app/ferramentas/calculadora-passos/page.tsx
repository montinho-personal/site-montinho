import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import CalculadoraPassos from "@/components/passos/CalculadoraPassos";
import { FONTE_DING, FONTE_PALUCH, FONTE_TUDOR_LOCKE_2008, NIVEIS, PASSADAS_TABELA, PESOS_TABELA, arredondaKcal, fmtInt, fmtKm, formataTempo, gasto, passosPorKm, tabelaCalorias } from "@/lib/passos";

/**
 * Calculadora de Passos por Dia.
 *
 * Pesquisa (05/10/2026), três buscas:
 * - "quantos passos por dia": ideal, para emagrecer, para ser saudável,
 *   para sair do sedentarismo, segundo a OMS, quantos passos tem 1 km,
 *   5 mil e 20 mil passos. PAA: quanto é 10.000 passos, 30 minutos de
 *   caminhada equivalem a quantos passos, quanto dá 7.000, quantos km são
 *   10.000.
 * - "passos queima quantas calorias": 1.000 a 20 mil passos. PAA: quantos
 *   passos para perder 1 kg, 10 mil passos emagrece.
 * - "10 mil passos": em km, em minutos, calorias, quanto tempo.
 *
 * A calculadora de caminhada já faz calorias por passos; esta página mira a
 * META ("quantos passos por dia") e usa o mesmo motor para as calorias.
 */

const CAMINHO = "/ferramentas/calculadora-passos";

export const metadata: Metadata = {
  title: { absolute: "Quantos Passos por Dia? Calculadora de Passos, Km e Calorias" },
  description:
    "Descubra quantos passos por dia são ideais para a sua idade, quantas calorias eles queimam e quantos km e minutos dão. 10 mil, 7 mil, 5 mil passos: com estudos.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Passos por Dia | Montinho",
    description: "Quantos passos por dia você precisa, e quanto eles gastam em calorias, km e minutos.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Passos por Dia",
  descricao: "Mostra a meta de passos por dia pela idade, o nível de atividade e as calorias, quilômetros e minutos dos seus passos.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Passos", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const g10 = gasto(10000, 70, "moderado");
const g7 = gasto(7000, 70, "moderado");
const g1 = gasto(1000, 70, "moderado");
const passosUmKg = Math.round((7700 / g1.kcal) * 1000 / 1000) * 1000;

const faq: ItemFAQ[] = [
  { question: "Quantos passos por dia é o ideal?", answer: "Depende da idade. Numa análise de 15 estudos com quase 50 mil adultos, o risco de morte caiu até cerca de 8.000 a 10.000 passos por dia em quem tem menos de 60 anos e até 6.000 a 8.000 em quem tem 60 ou mais. Acima disso, o ganho praticamente para de crescer." },
  { question: "Precisa mesmo de 10 mil passos por dia?", answer: "Não. A meta de 10 mil nasceu de um pedômetro japonês dos anos 1960, não de um estudo. Uma revisão de 2025 mostrou que 7.000 passos por dia já trazem a maior parte do benefício em relação a quem dá 2.000. Dar 10 mil não faz mal; só não é obrigatório." },
  { question: "Quantos passos por dia para sair do sedentarismo?", answer: "Abaixo de 5.000 passos por dia é a faixa chamada de sedentária. Passar de 5.000 já tira você dela, e cada mil passos a mais conta, principalmente para quem está começando." },
  { question: "Quantos passos por dia segundo a OMS?", answer: "A OMS não define número de passos. A recomendação dela é de 150 a 300 minutos de atividade moderada por semana para adultos. Caminhar em ritmo moderado, cerca de 100 passos por minuto, conta para essa meta." },
  { question: "10 mil passos queimam quantas calorias?", answer: `Para quem pesa 70 kg, cerca de ${arredondaKcal(g10.kcal)} kcal em ritmo moderado, se fossem caminhados seguidos. Quem pesa mais gasta mais. O número é bruto: inclui o que você gastaria parado nesse tempo.` },
  { question: "1.000 passos queimam quantas calorias?", answer: `Cerca de ${arredondaKcal(g1.kcal)} kcal para quem pesa 70 kg, em ritmo moderado. A tabela desta página mostra de 1.000 a 20.000 passos para pesos de 60 a 100 kg.` },
  { question: "Quantos km são 10 mil passos?", answer: "Depende da passada. Com 70 cm, 10 mil passos são 7 km; com 80 cm, 8 km. Para saber a sua: conte 10 passos normais, meça a distância e divida por 10." },
  { question: "Quantos passos tem 1 km?", answer: `Cerca de ${fmtInt(passosPorKm(70))} passos com passada de 70 cm, e ${fmtInt(passosPorKm(80))} com 80 cm. Quanto mais alta a pessoa, maior a passada e menos passos por km.` },
  { question: "Quantos km dá 5.000 passos?", answer: "Com passada de 70 cm, 3,5 km; com 80 cm, 4 km. Com 8.000 passos, de 5,6 a 6,4 km." },
  { question: "Quanto tempo leva para andar 1 km a pé?", answer: "Cerca de 12 minutos em ritmo moderado, a 5 km/h. Em ritmo leve, perto de 15 minutos; em ritmo rápido, 10." },
  { question: "30 minutos de caminhada equivalem a quantos passos?", answer: "Em ritmo moderado, cerca de 3.000 passos: a caminhada moderada fica perto de 100 passos por minuto. Em ritmo rápido, perto de 3.500." },
  { question: "Quanto tempo leva para andar 10 mil passos?", answer: `Cerca de ${formataTempo(g10.minutos)} em ritmo moderado, se fossem seguidos. Na vida real eles se espalham pelo dia: ir ao trabalho, subir escada, buscar algo na cozinha.` },
  { question: "Quantos passos para perder 1 kg?", answer: `Na conta crua, uns ${fmtInt(passosUmKg)} passos para quem pesa 70 kg, somados ao longo de semanas e sem comer mais por causa deles. Na prática o corpo compensa parte do gasto, por isso os passos ajudam, mas emagrecer depende também da alimentação.` },
  { question: "Dar 10 mil passos por dia emagrece?", answer: "Pode ajudar, porque aumenta o gasto do dia. Mas sozinho não garante: se a fome aumentar e a comida acompanhar, o peso não muda. Passos, treino de força e alimentação juntos funcionam melhor que qualquer um deles isolado." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const th = "p-3 text-left";
const td = "p-3 whitespace-nowrap";

export default function CalculadoraPassosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Calculadora de Passos</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>Quantos passos por dia? Calculadora de passos</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Coloque quantos passos você dá hoje, sua idade e seu peso. Veja a meta para a sua idade, seu nível de atividade e quanto esses passos dão em calorias, quilômetros e minutos.</p>
        </div>
      </section>

      <section className="pb-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraPassos />
          <noscript><p className="text-gray-300 mt-4">A calculadora precisa de JavaScript. As tabelas estão logo abaixo.</p></noscript>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Quantos passos por dia é o ideal?</h2>
            <p className="mb-3">Uma análise de 15 estudos, publicada na Lancet Public Health em 2022, acompanhou quase 50 mil adultos. Quanto mais passos, menor o risco de morte, até um ponto em que o ganho para de crescer:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Menos de 60 anos:</strong> de 8.000 a 10.000 passos por dia.</li>
              <li><strong className="text-white">60 anos ou mais:</strong> de 6.000 a 8.000 passos por dia.</li>
            </ul>
            <p className="mt-3">Uma revisão de 2025, na mesma revista, comparou com quem dá 2.000 passos por dia: com 7.000, o risco de morte foi 47% menor, com menos doença cardiovascular, demência e quedas.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>10 mil passos por dia: mito ou ciência?</h2>
            <p>O número veio de um pedômetro vendido no Japão nos anos 1960, cujo nome significa &quot;medidor de 10 mil passos&quot;. Virou meta pela publicidade, não por estudo. Os dados de hoje mostram que boa parte do benefício já aparece antes, entre 7 e 8 mil. Se 10 mil cabe na sua rotina, ótimo; se não cabe, 7 mil feitos todo dia valem mais que 10 mil de vez em quando. O artigo <Link href="/blog/10-mil-passos-por-dia-emagrece" className={ln}>10 mil passos por dia emagrece?</Link> aprofunda.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Classificação: você é sedentário ou ativo?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-white/15">
                <thead><tr className="text-white bg-white/5"><th className={th}>Passos por dia</th><th className={th}>Nível</th></tr></thead>
                <tbody>{NIVEIS.map((n) => <tr key={n.id} className="border-t border-white/10"><td className={td}>{n.faixa}</td><td className="p-3" style={{ color: n.cor }}>{n.nome}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="text-sm text-gray-400 mt-3">Classificação de Tudor-Locke e colaboradores (2008), a mais usada em pesquisas com pedômetro.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Passos queimam quantas calorias? Tabela</h2>
            <p className="mb-3">Em ritmo moderado (cerca de 5 km/h), caminhados seguidos. Gasto bruto, em kcal:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-white/15">
                <thead><tr className="text-white bg-white/5"><th className={th}>Passos</th>{PESOS_TABELA.map((p) => <th key={p} className={th}>{p} kg</th>)}<th className={th}>Tempo</th></tr></thead>
                <tbody>{tabelaCalorias().map((l) => <tr key={l.passos} className="border-t border-white/10"><td className={td}>{fmtInt(l.passos)}</td>{l.kcal.map((k, i) => <td key={i} className={td}>{k}</td>)}<td className={td}>{formataTempo(l.minutos)}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="text-sm text-gray-400 mt-3">Calorias pelo mesmo cálculo da <Link href="/ferramentas/calculadora-calorias-caminhada" className={ln}>calculadora de calorias da caminhada</Link>, com o MET do Compêndio de Atividades Físicas e cerca de 100 passos por minuto.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Quantos km são 10 mil passos? E quantos passos tem 1 km?</h2>
            <p className="mb-3">Depende do tamanho da sua passada. Para medir: conte 10 passos normais, meça a distância com uma trena e divida por 10.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-white/15">
                <thead><tr className="text-white bg-white/5"><th className={th}>Passada</th><th className={th}>Passos em 1 km</th><th className={th}>7 mil passos</th><th className={th}>10 mil passos</th></tr></thead>
                <tbody>{PASSADAS_TABELA.map((p) => <tr key={p} className="border-t border-white/10"><td className={td}>{p} cm</td><td className={td}>{fmtInt(passosPorKm(p))}</td><td className={td}>{fmtKm((7000 * p) / 100000)} km</td><td className={td}>{fmtKm((10000 * p) / 100000)} km</td></tr>)}</tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Quantos passos por dia para emagrecer?</h2>
            <p>Não existe número mágico. Os passos aumentam o gasto do dia: 7 mil passos são cerca de {arredondaKcal(g7.kcal)} kcal para quem pesa 70 kg. Mas o peso só cai se esse gasto não voltar no prato. O que costuma funcionar é subir aos poucos, mil passos a mais por dia a cada semana, junto com treino de força e uma alimentação que você consiga manter. Para planejar a parte da comida, use a <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>calculadora de déficit calórico</Link>.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como dar mais passos sem mudar a rotina toda</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Uma caminhada de 10 minutos depois de cada refeição soma uns 3.000 passos.</li>
              <li>Escada em vez de elevador, e estacionar mais longe.</li>
              <li>Atender ligação andando.</li>
              <li>Olhar a média da semana, não o dia: um dia ruim não apaga a semana.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-passos" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[FONTE_PALUCH, FONTE_DING, FONTE_TUDOR_LOCKE_2008].map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a></li>)}
            </ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Estimativas educacionais.</p>
          </div>
        </div>
      </section>
    </>
  );
}
