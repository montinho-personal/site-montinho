import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraFutebol from "@/components/futebol/CalculadoraFutebol";
import {
  FONTES_FUTEBOL,
  FONTE_COMPENDIO_FUTEBOL,
  JOGOS,
  KCAL_LATA,
  MET_ESPERANDO,
  NOTA_GOLEIRO,
  PESO_PADRAO,
  arredondaKcal,
  calcula,
  formataLatas,
  formataTempo,
  jogo,
  semana,
  tabelaPorPeso,
  tabelaRevezamento,
} from "@/lib/futebol";

/**
 * A página da Calculadora de Calorias no Futebol.
 *
 * O `futebol-emagrece` tem visibilidade — posição média 5,4 — e quase
 * nenhum clique. As buscas que chegam nele pedem número ("jogar futebol
 * queima quantas calorias"), e o artigo respondia com uma faixa larga que
 * não servia para ninguém em particular. Esta página responde com o peso,
 * o tempo e o revezamento de quem pergunta.
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-futebol";

export const metadata: Metadata = {
  title: "Calculadora de Calorias no Futebol: Pelada e Futsal",
  description:
    "Quantas calorias a sua pelada gasta: futsal, society ou jogo valendo, pelo seu peso, com o revezamento de times e as latas que o jogo realmente pagou.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias no Futebol | Montinho Personal Trainer",
    description:
      "Quanto a sua pelada gastou de verdade, separando o tempo de bola rolando do tempo na lateral — e quantas latas o jogo pagou.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias no Futebol",
  descricao:
    "Estima o gasto calórico de uma pelada, de um jogo de futsal ou de um jogo competitivo a partir do peso corporal e do tempo na quadra, separa o tempo em campo do tempo na lateral quando os times revezam e converte o gasto líquido em latas de cerveja.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias no Futebol", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const PEL = jogo("pelada");
const FUTSAL = jogo("futsal");
const COMP = jogo("competitivo");
/** Uma hora de bola rolando, sem revezamento. */
const HORA = (met: number, peso = PESO_PADRAO) => calcula(peso, 60, met, 2);
const TAB_PESO = tabelaPorPeso(60);
const TAB_REV = tabelaRevezamento(80, 120);
const EX_REV = calcula(80, 120, PEL.met, 4);
const EX_SEM_1 = semana(HORA(PEL.met, 80), 1);
const EX_SEM_2 = semana(HORA(PEL.met, 80), 2);
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });
/** Kcal arredondada e com ponto de milhar: 1.175, não 1175. */
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const mil = (n: number) => n.toLocaleString("pt-BR");

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias queima uma pelada de futebol?",
    answer: `Uma hora de bola rolando numa pelada gasta cerca de ${kc(HORA(PEL.met).kcal)} kcal para quem pesa ${PESO_PADRAO} kg e ${mil(TAB_PESO.find((l) => l.peso === 90)!.pelada)} kcal para quem pesa 90 kg. Só que pelada com três ou quatro times não é uma hora de bola rolando — e o tempo na lateral é o que mais derruba o número real.`,
  },
  {
    question: "Jogar futebol 2 horas queima quantas calorias?",
    answer: `Depende de quantos times revezam. Para 80 kg, duas horas de pelada sem revezamento dão cerca de ${mil(TAB_REV[0].kcal)} kcal; com quatro times, em que você fica uma hora em campo e uma na lateral, o número cai para cerca de ${mil(TAB_REV[2].kcal)} kcal.`,
  },
  {
    question: "Futsal queima mais calorias que futebol de campo?",
    answer: `Por minuto, a pelada de futsal gasta um pouco mais: ${fmt(FUTSAL.met)} METs contra ${fmt(PEL.met)} da pelada de campo ou society, no Compêndio de Atividades Físicas. A quadra é menor, mas a bola quase não para. Quem gasta mais que os dois é o jogo competitivo, com ${fmt(COMP.met)} METs.`,
  },
  {
    question: "Goleiro gasta quantas calorias?",
    answer: NOTA_GOLEIRO,
  },
  {
    question: "Jogar bola uma vez por semana emagrece?",
    answer: `Ajuda pouco sozinho. Uma pelada de uma hora acrescenta cerca de ${kc(EX_SEM_1.kcalLiquida)} kcal à semana de quem pesa 80 kg — no máximo ${fmt(EX_SEM_1.gramasGordura, 0)} g de gordura, se nada do que se come depois mudar. Duas peladas dobram isso. O que decide é o conjunto: frequência, força de perna e a resenha contada.`,
  },
  {
    question: "Quantas cervejas uma pelada paga?",
    answer: `Para 80 kg, uma hora de bola rolando acrescenta cerca de ${kc(HORA(PEL.met, 80).kcalLiquida)} kcal ao dia — ${formataLatas(HORA(PEL.met, 80).latas)} de cerveja comum, a ${KCAL_LATA} kcal cada. A partir da lata seguinte, a resenha começa a comer o que o jogo gastou.`,
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

export default function CalculadoraFutebolPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias no Futebol
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias no Futebol" caminho={CAMINHO} local="tool_top" ferramenta="futebol" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto a sua pelada gastou de verdade — separando o tempo de bola rolando do tempo na lateral, e contando
            quantas latas o jogo pagou.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraFutebol placement="calculadora-calorias-futebol" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias uma pelada queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Uma hora de bola rolando numa pelada custa cerca de{" "}
              <strong className="text-white">{kc(HORA(PEL.met).kcal)} kcal</strong> para quem pesa {PESO_PADRAO} kg.
              Futsal gasta um pouco mais por minuto, porque a bola quase não para; jogo competitivo, bem mais. O que mais
              muda o número, depois do tipo de jogo, é o <strong className="text-white">peso corporal</strong>:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em uma hora de bola rolando, por peso e tipo de jogo</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    <th scope="col" className={th}>Pelada</th>
                    <th scope="col" className={th}>Futsal</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Competitivo</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_PESO.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(l.pelada)} kcal</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">≈ {mil(l.futsal)} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {mil(l.competitivo)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">Uma hora com a bola rolando para você, sem tempo na lateral.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O revezamento muda tudo</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Pelada de adulto quase nunca é dois times jogando o tempo todo. São três, quatro times, e quem perde sai. Com
              quatro times, cada um fica em campo metade do tempo: duas horas de quadra são{" "}
              <strong className="text-white">{formataTempo(EX_REV.minutosEmCampo)} de bola rolando</strong> e{" "}
              {formataTempo(EX_REV.minutosEsperando)} em pé na lateral. Duas horas de pelada, 80 kg:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto de duas horas de pelada para 80 kg conforme o número de times</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Times</th>
                    <th scope="col" className={th}>Em campo</th>
                    <th scope="col" className={th}>Gasto</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">O jogo pagou</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_REV.map((l) => (
                    <tr key={l.times} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.times === 2 ? "2, sem revezar" : l.times}</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{formataTempo(l.minutosEmCampo)}</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {mil(l.kcal)} kcal</td>
                      <td className="text-gray-300 py-2.5">{formataLatas(l.latas)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              É a mesma noite na quadra, e o gasto cai quase à metade entre a primeira e a última linha. Nenhuma tabela de
              “calorias do futebol” pergunta isso — e é o que mais faz a conta de quem joga errar para cima.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas cervejas uma pelada paga?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              O artigo sobre <Link href="/blog/futebol-emagrece" className={ln}>futebol e emagrecimento</Link> diz que o motivo
              número um de quem joga há anos e não emagrece é a mesa depois do jogo. A calculadora transforma isso em conta: ela
              pega o que o jogo <strong className="text-white">acrescentou</strong> ao dia — o gasto total menos o que você
              gastaria em casa, parado — e divide por {KCAL_LATA} kcal, uma lata de cerveja comum.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Para 80 kg, uma hora de bola rolando paga{" "}
              <strong className="text-white">{formataLatas(HORA(PEL.met, 80).latas)}</strong>. Não é um convite a beber
              essa quantidade, é a régua: o que passar dela sai do saldo do jogo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Uma pelada por semana emagrece?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Uma hora de pelada por semana acrescenta cerca de {kc(EX_SEM_1.kcalLiquida)} kcal à semana de quem
              pesa 80 kg — no máximo {fmt(EX_SEM_1.gramasGordura, 0)} g de gordura, pela conta linear. Duas peladas levam a{" "}
              {kc(EX_SEM_2.kcalLiquida)} kcal. A conta linear é teto: o corpo compensa parte do gasto, e o peso
              cai mais devagar do que ela sugere.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Por isso a pelada rende mais quando entra numa semana com{" "}
              <Link href="/blog/treino-de-perna-completo" className={ln}>treino de força de perna</Link> — que também é o que
              protege joelho, tornozelo e posterior de coxa — e com o{" "}
              <Link href="/blog/deficit-calorico-como-calcular" className={ln}>déficit da semana</Link> ajustado.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">tempo em campo = tempo na quadra × 2 ÷ número de times</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_FUTEBOL.rotuloCurto}, que {FONTE_COMPENDIO_FUTEBOL.resumo} A calculadora usa{" "}
              {JOGOS.map((j) => `${j.nome.toLowerCase()} ${fmt(j.met)}`).join(", ")} METs, e {fmt(MET_ESPERANDO)} MET para o tempo
              na lateral, que é ficar em pé parado.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              O revezamento usa a média: com N times e dois em campo, cada um joga 2/N do tempo. O time que ganha fica mais,
              o que perde fica menos — numa noite inteira, a média é o que sobra.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 22 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-futebol" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_FUTEBOL.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/futebol-emagrece" className={ln}>Futebol emagrece? A conta da pelada e o que vem depois</Link></li>
              <li><Link href="/blog/treino-de-perna-completo" className={ln}>Treino de perna completo</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-atividades" className={ln}>Calculadora de Calorias por Atividade — boxe, natação, spinning e mais</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
