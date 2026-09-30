import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraEscada from "@/components/escada/CalculadoraEscada";
import {
  FONTES_ESCADA,
  FONTE_COMPENDIO_ESCADA,
  MET_DESCIDA,
  NOTA_SEM_PERDA_LOCALIZADA,
  SITUACOES,
  arredondaKcal,
  calcula,
  kcalPorAndar,
  kcalPorMes,
  kcalPorMinuto,
  ritmo,
  tabelaSituacoes,
} from "@/lib/escada";

/**
 * A página da Calculadora de Calorias Subindo Escada.
 *
 * O `subir-escada-emagrece` fala em andares e subidas por dia, não em
 * minutos. Esta página faz a conta dos andares com o peso de quem
 * pergunta, conta a descida e mostra o que o hábito soma no mês.
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-escada";
const PESO = 70;

export const metadata: Metadata = {
  title: "Subir Escada Gasta Quantas Calorias? Calculadora por Andar e Tempo",
  description:
    "Quantas calorias você gasta subindo escada, pelos andares, pelo ritmo e pelo seu peso — com a descida, o custo de cada andar e o que o hábito soma no mês.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias Subindo Escada | Montinho Personal Trainer",
    description:
      "Andares, ritmo e peso: veja quanto a escada do seu dia gasta, quanto custa cada andar e o que trocar o elevador soma no mês.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias Subindo Escada",
  descricao:
    "Estima o gasto calórico de subir e descer escada a partir do peso, dos andares, das subidas por dia e do ritmo, e soma o hábito do mês.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias Subindo Escada", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const TAB = tabelaSituacoes();
const ELEV = SITUACOES[0];
const R_ELEV = calcula(PESO, ELEV.ritmo, ELEV.andares, ELEV.subidas, ELEV.desceDeEscada);
const MES_ELEV = kcalPorMes(R_ELEV, 5);
const ANDAR_DIA = kcalPorAndar(PESO, "dia");
const ANDAR_TREINO = kcalPorAndar(PESO, "treino");
const MIN_TREINO_80 = kcalPorMinuto(ritmo("treino").met, 80);
const MIN_TREINO_70 = kcalPorMinuto(ritmo("treino").met, PESO);
const TEMPOS = [5, 10, 15, 20, 30, 60].map((m) => ({ m, kcal: MIN_TREINO_70 * m }));
const ANDARES_TAB = [5, 8, 10, 12, 14, 18].map((a) => ({ a, dia: ANDAR_DIA * a, treino: ANDAR_TREINO * a }));
const mil = (n: number) => n.toLocaleString("pt-BR");
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const minF = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 0 });

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias gasta subir um andar de escada?",
    answer: `Cerca de ${metF(ANDAR_DIA)} kcal para quem pesa ${PESO} kg, no passo do dia a dia, e ${metF(ANDAR_TREINO)} kcal subindo rápido. A pressa gasta mais por minuto, mas quase o mesmo por andar.`,
  },
  {
    question: "Quantas calorias se gasta subindo escada por minuto?",
    answer: `Em ritmo de treino, cerca de ${kc(MIN_TREINO_80)} kcal por minuto para quem pesa 80 kg — o Compêndio mede ${metF(ritmo("treino").met)} METs. No passo do dia a dia, menos da metade disso.`,
  },
  {
    question: "30 minutos ou 1 hora de escada queimam quantas calorias?",
    answer: `Subindo sem parar em ritmo de treino, para ${PESO} kg: ${TEMPOS.map((x) => `${x.m} min ≈ ${kc(x.kcal)} kcal`).join("; ")}. Na vida real quase ninguém sobe 30 minutos direto: o simulador de escada da academia ou um prédio alto com descidas no meio gastam menos que isso.`,
  },
  {
    question: "Quantas calorias gasta subir 5, 8, 10, 12 ou 18 andares?",
    answer: `Para ${PESO} kg, no passo do dia a dia e em ritmo de treino: ${ANDARES_TAB.map((x) => `${x.a} andares ≈ ${kc(x.dia)} a ${kc(x.treino)} kcal`).join("; ")}. Descer de escada soma um pouco; a calculadora conta a descida se você marcar.`,
  },
  {
    question: "Subir 100 degraus gasta quantas calorias?",
    answer: `Um andar costuma ter entre 15 e 20 degraus, então 100 degraus dão perto de 5 a 6 andares: cerca de ${kc(ANDAR_DIA * 5.5)} a ${kc(ANDAR_TREINO * 5.5)} kcal para ${PESO} kg, conforme o ritmo. Conte os degraus do seu prédio para acertar a conta.`,
  },
  {
    question: "20 minutos de escada ajudam a emagrecer?",
    answer: `Ajudam: em ritmo de treino são cerca de ${kc(MIN_TREINO_70 * 20)} kcal para ${PESO} kg. Mas o que emagrece é o déficit da semana; a escada entra como um gasto que dá para repetir no dia a dia, trocando o elevador.`,
  },
  {
    question: "Grávida ou quem tem insuficiência cardíaca pode subir escada?",
    answer: "Subir escada no próprio passo costuma fazer parte da rotina, mas usar a escada como treino intenso é outra coisa. Na gravidez e na insuficiência cardíaca, a intensidade segura é definida pelo obstetra ou pelo cardiologista; falta de ar forte, dor no peito ou tontura são sinais para parar.",
  },
  {
    question: "Trocar o elevador pela escada emagrece?",
    answer: `Soma, mas devagar. Quatro subidas de dois andares por dia, descendo a pé, gastam cerca de ${kc(R_ELEV.kcal)} kcal para ${PESO} kg; em cinco dias por semana são uns ${mil(Math.round(MES_ELEV / 10) * 10)} kcal líquidas no mês. É um hábito que ajuda o déficit, não um treino que decide sozinho.`,
  },
  {
    question: "Descer escada também gasta caloria?",
    answer: `Gasta: o Compêndio mede descer escada em ${metF(MET_DESCIDA)} METs, pouco menos que subir no passo do dia a dia. Por isso a calculadora pergunta se você desce de escada ou de elevador.`,
  },
  {
    question: "Subir escada perde barriga?",
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

export default function CalculadoraEscadaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias Subindo Escada
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias Subindo Escada" caminho={CAMINHO} local="tool_top" ferramenta="escada" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto a escada do seu dia gasta, pelos andares que você sobe — e o que trocar o elevador soma no mês.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraEscada placement="calculadora-calorias-escada" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias a escada gasta?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Por dia, em três situações comuns:</p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de subir escada por situação, para 70 e 90 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Situação</th>
                    <th scope="col" className={th}>70 kg</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">90 kg</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB.map((l) => (
                    <tr key={l.situacao.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">
                        {l.situacao.nome}: {l.situacao.subidas} × {l.situacao.andares} andares, {ritmo(l.situacao.ritmo).nome.toLowerCase()},{" "}
                        {l.situacao.desceDeEscada ? "descendo a pé" : "descendo de elevador"} (~{minF(l.minutosTotais)} min)
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
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Subir rápido gasta mais?</h2>
            <p className="text-gray-300 leading-relaxed">
              Por minuto, muito mais: {metF(ritmo("treino").met)} METs contra {metF(ritmo("dia").met)}. Por andar, quase o mesmo — cerca de{" "}
              {metF(ANDAR_TREINO)} kcal subindo rápido e {metF(ANDAR_DIA)} no passo do dia a dia, para {PESO} kg, porque quem sobe rápido
              chega antes. <strong className="text-white">O que soma é quantos andares você sobe</strong>, não a pressa. Para quem quer usar a
              escada como hábito, isso é boa notícia: o passo tranquilo, que dá para repetir todo dia, rende quase o mesmo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Trocar o elevador vale a pena?</h2>
            <p className="text-gray-300 leading-relaxed">
              Quatro subidas de dois andares por dia, descendo a pé, gastam cerca de {kc(R_ELEV.kcal)} kcal para {PESO} kg. Parece nada —
              e num dia é mesmo. Em cinco dias por semana, somam uns {mil(Math.round(MES_ELEV / 10) * 10)} kcal líquidas no mês. O{" "}
              <Link href="/blog/subir-escada-emagrece" className={ln}>artigo sobre subir escada e emagrecimento</Link> explica por que esse
              tipo de gasto do dia a dia, o NEAT, pesa mais do que parece.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">minutos = andares × segundos por andar ÷ 60</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_ESCADA.rotuloCurto}, que {FONTE_COMPENDIO_ESCADA.resumo} O tempo por andar é estimativa —
              cerca de {ritmo("dia").segundosPorAndar} segundos no passo do dia a dia, {ritmo("treino").segundosPorAndar} em ritmo de treino e
              12 descendo, para um andar de uns 17 degraus — e é a parte mais incerta da conta.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 23 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-escada" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_ESCADA.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/subir-escada-emagrece" className={ln}>Subir escada emagrece? O exercício gratuito que você ignora</Link></li>
              <li><Link href="/blog/neat-gasto-calorico-diario" className={ln}>NEAT: o gasto calórico do dia a dia</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-caminhada" className={ln}>Calculadora de Calorias na Caminhada</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
