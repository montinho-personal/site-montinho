import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraHyrox from "@/components/hyrox/CalculadoraHyrox";
import {
  ESTACOES,
  FONTES_HYROX,
  FONTE_COMPENDIO_HYROX,
  KM_CORRIDA,
  MET_ESTACOES,
  PROVAS,
  arredondaKcal,
  calcula,
  formataPace,
  tabelaProvas,
} from "@/lib/hyrox";
import { AULAS as AULAS_CF, MET_AQUECIMENTO, MET_PARADO, calcula as calculaCrossfit, kcalPorMinuto } from "@/lib/crossfit";

/**
 * A página da Calculadora de Calorias no Hyrox.
 *
 * O `hyrox-o-que-e` explica a prova. Esta página faz a conta com o tempo
 * final, o pace e o peso de quem pergunta, e separa a corrida das
 * estações.
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-hyrox";
const PESO = 70;

export const metadata: Metadata = {
  title: "HYROX Queima Quantas Calorias? Prova, Treino e Estações",
  description:
    "Quantas calorias o HYROX queima na prova e no treino, pelo seu tempo, pace e peso: corrida, oito estações, por hora e HYROX x CrossFit.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias no Hyrox | Montinho Personal Trainer",
    description:
      "Tempo final, pace e peso: veja quanto a sua prova de Hyrox gastou e quanto veio da corrida e das estações.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias no Hyrox",
  descricao:
    "Estima o gasto calórico de uma prova de Hyrox a partir do tempo final, do pace de corrida e do peso corporal, separando os 8 km de corrida das oito estações.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias no Hyrox", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const TAB = tabelaProvas();
const M = PROVAS[1];
const MEDIA = calcula(PESO, M.minutos, M.paceSeg)!;
const PESOS_TREINO = [60, 70, 80, 90, 100] as const;
/** Treino de 60 min: 10 de aquecimento, 40 de circuito no ritmo das estações, 10 de explicação e pausa. Estimativa declarada. */
const TREINO = (p: number) => kcalPorMinuto(MET_AQUECIMENTO, p) * 10 + kcalPorMinuto(MET_ESTACOES, p) * 40 + kcalPorMinuto(MET_PARADO, p) * 10;
const CF = AULAS_CF[0];
const CF_AULA = calculaCrossfit(PESO, CF.aula, CF.aquecimento, CF.forca, CF.wod, CF.formato)!;
const POR_HORA = (MEDIA.kcal / MEDIA.minutosTotais) * 60;
const mil = (n: number) => n.toLocaleString("pt-BR");
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const pct = (n: number) => `${Math.round(n * 100)}%`;
const hm = (min: number) => `${Math.floor(min / 60)}h${String(Math.round(min % 60)).padStart(2, "0")}`;

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias gasta uma prova de Hyrox?",
    answer: `Uma prova em ${hm(M.minutos)}, com pace de ${formataPace(M.paceSeg)} por km, gasta cerca de ${mil(TAB[1].kcal70)} kcal para ${PESO} kg e ${mil(TAB[1].kcal90)} para 90 kg. Uma prova forte, em ${hm(PROVAS[0].minutos)}, gasta cerca de ${mil(TAB[0].kcal70)} para ${PESO} kg; uma primeira prova, em ${hm(PROVAS[2].minutos)}, cerca de ${mil(TAB[2].kcal70)}.`,
  },
  {
    question: "HYROX queima quantas calorias por hora?",
    answer: `Na prova em ${hm(M.minutos)}, para ${PESO} kg, o ritmo médio dá cerca de ${kc(POR_HORA)} kcal por hora. Quem pesa mais ou corre mais rápido gasta mais por hora; quem leva mais tempo gasta mais no total, mas menos por minuto.`,
  },
  {
    question: "Quantas calorias gasta um treino de HYROX?",
    answer: `Um treino de uma hora, com 10 minutos de aquecimento, 40 de circuito no ritmo das estações e 10 de explicação e pausa, gasta cerca de ${kc(TREINO(PESO))} kcal para ${PESO} kg e ${kc(TREINO(90))} para 90 kg. É uma estimativa: treino com mais corrida ou menos pausa gasta mais.`,
  },
  {
    question: "HYROX ou CrossFit: qual gasta mais calorias?",
    answer: `Na prova, o HYROX: ${mil(TAB[1].kcal70)} kcal numa prova em ${hm(M.minutos)} para ${PESO} kg, contra cerca de ${kc(CF_AULA.kcal)} kcal numa aula típica de CrossFit de uma hora. No treino, a aula de HYROX também tende a gastar mais (≈ ${kc(TREINO(PESO))} kcal por hora, estimado), porque tem mais tempo de circuito e menos de força e técnica parada. Mas o que decide o resultado é quantas vezes você treina na semana, não qual das duas escolhe.`,
  },
  {
    question: "Quem faz HYROX precisa fazer musculação?",
    answer:
      "Precisa. Sled push, sled pull, farmers carry, sandbag lunges e wall balls são força sob fadiga, com o coração já alto da corrida. A musculação dá a força para essas estações e protege joelho, lombar e ombro nas semanas de treino. Quem só corre costuma perder a prova nos trenós.",
  },
  {
    question: "O que gasta mais no Hyrox: a corrida ou as estações?",
    answer: `A corrida. Na prova em ${hm(M.minutos)}, os ${KM_CORRIDA} km levam ${pct(MEDIA.minutosCorrida / MEDIA.minutosTotais)} do tempo e fazem ${pct(MEDIA.kcalCorrida / MEDIA.kcal)} do gasto. As estações cansam mais a musculatura, mas a corrida é mais longa e mais intensa em gasto por minuto.`,
  },
  {
    question: "Quantas calorias gasta cada estação do Hyrox?",
    answer: `Na prova em ${hm(M.minutos)}, para ${PESO} kg, cada estação gasta perto de ${kc(MEDIA.kcalEstacoes / ESTACOES.length)} kcal. O remo, que o Compêndio mede com mais intensidade, fica um pouco acima; o SkiErg, um pouco abaixo.`,
  },
  {
    question: "Fazer Hyrox emagrece?",
    answer: "A prova é um dia só. O que emagrece é o treino das semanas antes dela — corrida, força e condicionamento, três a cinco vezes por semana — somado a um déficit calórico. O Hyrox ajuda porque dá um objetivo com data, e isso mantém a pessoa treinando.",
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

export default function CalculadoraHyroxPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias no Hyrox
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias no Hyrox" caminho={CAMINHO} local="tool_top" ferramenta="hyrox" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto a sua prova gastou, pelo tempo final e pelo pace — e quanto veio da corrida e das estações.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraHyrox placement="calculadora-calorias-hyrox" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias gasta uma prova de Hyrox?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Três tempos comuns de prova individual:</p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de uma prova de Hyrox por tempo final, para 70 e 90 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Prova</th>
                    <th scope="col" className={th}>70 kg</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">90 kg</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB.map((l) => (
                    <tr key={l.prova.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{l.prova.nome}: {hm(l.prova.minutos)}, pace {formataPace(l.prova.paceSeg)}</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(l.kcal70)} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {mil(l.kcal90)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Treino de HYROX: quantas calorias?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Uma aula de uma hora não é uma prova: tem 10 minutos de aquecimento, cerca de 40 de circuito e o resto em explicação e
              pausa. Por peso, estimado:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de um treino de HYROX de uma hora, por peso</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Treino de 1 hora</th>
                  </tr>
                </thead>
                <tbody>
                  {PESOS_TREINO.map((p) => (
                    <tr key={p} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{p} kg</td>
                      <td className="text-white py-2.5 font-medium tabular-nums">≈ {kc(TREINO(p))} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              Para comparar com uma aula de box, veja a{" "}
              <Link href="/ferramentas/calculadora-calorias-crossfit" className={ln}>Calculadora de Calorias no CrossFit</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>A corrida faz a maior parte do gasto</h2>
            <p className="text-gray-300 leading-relaxed">
              Na prova em {hm(M.minutos)}, os {KM_CORRIDA} km de corrida levam {pct(MEDIA.minutosCorrida / MEDIA.minutosTotais)} do tempo e
              fazem <strong className="text-white">{pct(MEDIA.kcalCorrida / MEDIA.kcal)} do gasto</strong>: cerca de {kc(MEDIA.kcalCorrida)} de{" "}
              {kc(MEDIA.kcal)} kcal para {PESO} kg. As estações são o que o público vê, mas quem melhora o pace ganha mais tempo — e é
              a corrida que está cansada quando chega o wall ball. O{" "}
              <Link href="/blog/hyrox-o-que-e" className={ln}>guia sobre o Hyrox</Link> explica como treinar as duas partes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>corrida = {KM_CORRIDA} km × pace</p>
              <p className="mt-2">estações = tempo final − corrida</p>
              <p className="mt-2">kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              A corrida usa a equação de corrida da ACSM, a mesma da{" "}
              <Link href="/ferramentas/calculadora-corrida" className={ln}>Calculadora de Corrida</Link>. As estações usam o{" "}
              {FONTE_COMPENDIO_HYROX.rotuloCurto}, que {FONTE_COMPENDIO_HYROX.resumo} As seis estações de força entram como circuito
              vigoroso — o Compêndio não mede trenó nem wall ball em separado —, e o tempo de estação é dividido igualmente entre as
              oito, com média de {metF(MET_ESTACOES)} METs.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 23 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-hyrox" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_HYROX.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/hyrox-o-que-e" className={ln}>Hyrox: o que é, quanto gasta e como treinar</Link></li>
              <li><Link href="/blog/treino-hibrido-forca-corrida-2025" className={ln}>Treino híbrido: como combinar força e corrida</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-crossfit" className={ln}>Calculadora de Calorias no CrossFit</Link></li>
              <li><Link href="/ferramentas/calculadora-corrida" className={ln}>Calculadora de Corrida — pace, tempo e calorias</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
