import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraDanca from "@/components/danca/CalculadoraDanca";
import {
  ESTILOS,
  FONTES_DANCA,
  FONTE_COMPENDIO_DANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_PADRAO,
  arredondaKcal,
  calcula,
  estilo,
  kgPorMes,
  tabelaEstilos,
} from "@/lib/danca";

/**
 * A página da Calculadora de Calorias na Dança.
 *
 * O `danca-emagrece` pergunta "qualquer ritmo vale?" e responde por
 * estilo. Esta página faz a conta com o peso de quem pergunta e compara
 * todos os ritmos no mesmo tempo — e diz, estilo por estilo, o que é
 * medida do Compêndio e o que é encaixe.
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-danca";

export const metadata: Metadata = {
  title: "Calculadora de Calorias na Dança: Forró, Funk e Salão",
  description:
    "Quantas calorias o seu ritmo gasta — forró, salão, ballet, funk ou samba no pé — com o seu peso, comparado com todos os outros ritmos no mesmo tempo.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias na Dança | Montinho Personal Trainer",
    description:
      "Qualquer ritmo emagrece igual? Calcule o seu — forró, salão, ballet, funk, samba no pé — e compare com os outros no mesmo tempo.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias na Dança",
  descricao:
    "Estima o gasto calórico da dança por estilo — salão, forró, ballet, dança de academia e samba no pé — a partir do peso e do tempo, compara todos os ritmos no mesmo tempo e converte a frequência semanal em quilos por mês.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias na Dança", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const TAB = tabelaEstilos(60);
const L = (id: string) => TAB.find((l) => l.estilo.id === id)!;
const FORRO = calcula(PESO_PADRAO, 60, estilo("forro").met);
const FORRO_3X = kgPorMes(FORRO, 3);
const mil = (n: number) => n.toLocaleString("pt-BR");
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");

const faq: ItemFAQ[] = [
  {
    question: "Qual dança queima mais calorias?",
    answer: `As mais intensas e contínuas: funk, hip hop e samba no pé, cerca de ${mil(L("academia").kcal70)} kcal por hora para ${PESO_PADRAO} kg. Forró fica perto de ${mil(L("forro").kcal70)} kcal, e a dança de salão lenta, como valsa e bolero, perto de ${mil(L("salao").kcal70)} kcal. Mas o ritmo que emagrece mais é o que você repete toda semana.`,
  },
  {
    question: "Forró emagrece?",
    answer: `Ajuda. Uma hora de forró gasta cerca de ${kc(FORRO.kcal)} kcal para ${PESO_PADRAO} kg. Três noites por semana somam, só da dança, no máximo ${kg(FORRO_3X)} kg de gordura por mês — o resto vem da alimentação. O Compêndio não mede forró; ele entra como dança social.`,
  },
  {
    question: "Samba no pé queima quantas calorias?",
    answer: `Cerca de ${mil(L("samba").kcal70)} kcal por hora para ${PESO_PADRAO} kg, como dança vigorosa. É o valor mais próximo, não uma medida própria: o samba que o Compêndio mede é o de salão, junto com valsa e tango, a ${metF(estilo("salao").met)} METs.`,
  },
  {
    question: "Dança de salão emagrece?",
    answer: `Emagrece pouco. Valsa, bolero e tango ficam perto de ${mil(L("salao").kcal70)} kcal por hora para ${PESO_PADRAO} kg — menos que uma caminhada rápida. O ganho da dança de salão é outro: equilíbrio, coordenação e um compromisso semanal que muita gente não abandona.`,
  },
  {
    question: "Ballet fitness emagrece?",
    answer: `Gasta cerca de ${mil(L("ballet-fitness").kcal70)} kcal por hora para ${PESO_PADRAO} kg, e ainda trabalha força de perna e de core com a barra. Uma aula de ballet de técnica, com explicação e pausas, fica perto de ${mil(L("ballet").kcal70)} kcal.`,
  },
  {
    question: "Dançar afina a barriga?",
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

export default function CalculadoraDancaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias na Dança
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias na Dança" caminho={CAMINHO} local="tool_top" ferramenta="danca" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto o seu ritmo gasta com o seu peso — e como ele se compara aos outros no mesmo tempo.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraDanca placement="calculadora-calorias-danca" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias cada ritmo queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Uma hora dançando de verdade, para 70 e 90 kg:</p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em uma hora de dança por estilo, para 70 e 90 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Ritmo</th>
                    <th scope="col" className={th}>METs</th>
                    <th scope="col" className={th}>70 kg</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">90 kg</th>
                  </tr>
                </thead>
                <tbody>
                  {[...TAB].sort((a, b) => b.kcal70 - a.kcal70).map((l) => (
                    <tr key={l.estilo.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{l.estilo.nome}{l.estilo.encaixe ? " *" : ""}</td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums">{metF(l.estilo.met)}</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(l.kcal70)} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {mil(l.kcal90)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              * Sem medida própria no Compêndio, encaixado na entrada mais próxima. Zumba tem{" "}
              <Link href="/ferramentas/calculadora-calorias-zumba" className={ln}>calculadora própria</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O que é medida e o que é encaixe</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              O Compêndio de Atividades Físicas mede dança de salão, ballet, dança social e dança vigorosa. Não mede forró,
              funk nem samba no pé. Em vez de inventar um número para cada um, a calculadora usa a entrada mais próxima e diz
              isso ao lado do estilo:
            </p>
            <ul className="space-y-2 text-gray-300 leading-relaxed list-disc pl-5">
              {ESTILOS.filter((e) => e.encaixe).map((e) => (
                <li key={e.id}><strong className="text-white">{e.nome}:</strong> {e.encaixe}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Dança emagrece quantos quilos?</h2>
            <p className="text-gray-300 leading-relaxed">
              Só da dança, pouco. Três horas de forró por semana somam no máximo {kg(FORRO_3X)} kg de gordura por mês para{" "}
              {PESO_PADRAO} kg. O{" "}
              <Link href="/blog/danca-emagrece" className={ln}>artigo sobre dança e emagrecimento</Link> explica por que isso
              não diminui a dança: o maior trunfo dela não é a caloria, é a adesão — e é a alimentação, junto, que faz o resto.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_DANCA.rotuloCurto}, que {FONTE_COMPENDIO_DANCA.resumo} Os quilos saem do gasto
              líquido da semana, a 7.700 kcal por quilo de gordura, e são teto: o corpo compensa parte do gasto.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 23 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-danca" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_DANCA.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/danca-emagrece" className={ln}>Dança emagrece? Qualquer ritmo vale? Calorias por estilo</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-zumba" className={ln}>Calculadora de Calorias na Zumba — com as músicas com e sem salto</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-atividades" className={ln}>Calculadora de Calorias por Atividade — natação, jiu-jitsu, corda e mais</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
