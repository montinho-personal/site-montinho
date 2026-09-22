import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraEliptico from "@/components/eliptico/CalculadoraEliptico";
import {
  ESFORCOS,
  FONTES_ELIPTICO,
  FONTE_COMPENDIO_ELIPTICO,
  FONTE_HALL,
  KCAL_POR_KG_GORDURA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_PADRAO,
  arredondaKcal,
  comparaComEsteira,
  deKcal,
  deTempo,
  esforco,
  formataTempo,
  kcalLiquida,
  simulacaoUmQuilo,
  tabelaPorPeso,
  tabelaPorTempo,
} from "@/lib/eliptico";

/**
 * A página da Calculadora de Calorias do Elíptico.
 *
 * O `eliptico-emagrece` já está na posição ~10 para "20 minutos de
 * elíptico queima quantas calorias" e parecidas, mas responde com uma
 * tabela fixa para 70 e 90 kg. Esta página responde com o peso de quem
 * pergunta, e o artigo passa a embutir a calculadora com link para cá.
 *
 * Os números fixos existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-eliptico";

export const metadata: Metadata = {
  title: "Calculadora de Calorias do Elíptico: Por Tempo e Peso",
  description:
    "Calcule quantas calorias o elíptico gasta em 10, 20, 30 ou 60 minutos com o seu peso e o seu esforço — e compare com o visor do aparelho e a esteira.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias do Elíptico | Montinho Personal Trainer",
    description:
      "Quantas calorias o elíptico gasta com o seu peso e o seu esforço — comparado com o visor do aparelho e com a esteira.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias do Elíptico",
  descricao:
    "Estima o gasto calórico de uma sessão de elíptico a partir do peso corporal, do tempo e do esforço, calcula o tempo para uma meta de calorias e compara com o visor do aparelho e com a esteira.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias do Elíptico", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const MOD = esforco("moderado");
const VIG = esforco("vigoroso");
const EX = (min: number, met = MOD.met) => deTempo(min, PESO_PADRAO, met);
const TAB_PESO = tabelaPorPeso(20);
const TAB_TEMPO = tabelaPorTempo(PESO_PADRAO);
const CMP = comparaComEsteira(30, PESO_PADRAO);
const META_300 = deKcal(300, PESO_PADRAO, MOD.met);
const UM_QUILO = simulacaoUmQuilo(PESO_PADRAO, MOD.met);
const POR_MIN = EX(1).kcal;
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });

const faq: ItemFAQ[] = [
  {
    question: "20 minutos de elíptico queima quantas calorias?",
    answer: `Para uma pessoa de ${PESO_PADRAO} kg, cerca de ${arredondaKcal(EX(20).kcal)} kcal em esforço moderado e ${arredondaKcal(EX(20, VIG.met).kcal)} kcal em esforço vigoroso. Com 50 kg o moderado fica perto de ${TAB_PESO[0].moderado} kcal; com 100 kg, perto de ${TAB_PESO[5].moderado} kcal.`,
  },
  {
    question: "10 minutos de elíptico queima quantas calorias?",
    answer: `Para ${PESO_PADRAO} kg, aproximadamente ${arredondaKcal(EX(10).kcal)} kcal em esforço moderado e ${arredondaKcal(EX(10, VIG.met).kcal)} kcal em vigoroso. Dez minutos funcionam bem como aquecimento; como cardio principal, costumam ser pouco.`,
  },
  {
    question: "30 minutos de elíptico queima quantas calorias?",
    answer: `Cerca de ${arredondaKcal(EX(30).kcal)} kcal em esforço moderado e ${arredondaKcal(EX(30, VIG.met).kcal)} kcal em vigoroso, para quem pesa ${PESO_PADRAO} kg.`,
  },
  {
    question: "As calorias do visor do elíptico são confiáveis?",
    answer:
      "São uma estimativa, como esta. Muitos aparelhos nem pedem o peso e usam um valor padrão, o que costuma empurrar o número para cima em quem pesa menos que isso. O modo 'quantas calorias' da calculadora compara o número do visor com a conta pelo seu peso — use os dois para comparar uma sessão com outra, não para compensar comida.",
  },
  {
    question: "Quanto tempo de elíptico para queimar 300 calorias?",
    answer: `Para ${PESO_PADRAO} kg em esforço moderado, cerca de ${formataTempo(META_300.minutos)}. Em esforço vigoroso ou com peso maior, bem menos.`,
  },
  {
    question: "Elíptico ou esteira: qual gasta mais?",
    answer:
      "Na mesma sensação de esforço, ficam perto. O elíptico moderado gasta um pouco mais que uma caminhada rápida no plano; a esteira inclinada alcança ou passa o elíptico. A diferença que importa é outra: o elíptico tem impacto baixo e a esteira permite subir a inclinação. Gasta mais o que você repete mais vezes na semana.",
  },
  {
    question: "Elíptico emagrece?",
    answer:
      "Ajuda como qualquer cardio: soma gasto ao dia com pouco impacto nas articulações. Sozinho, é o caminho mais lento — o resultado depende do balanço da semana, com musculação e alimentação ajustada.",
  },
  {
    question: "Fazer elíptico todo dia perde barriga?",
    answer: NOTA_SEM_PERDA_LOCALIZADA + " O elíptico entra como uma das fontes de gasto, não como uma forma de escolher onde emagrecer.",
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

export default function CalculadoraElipticoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias do Elíptico
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias do Elíptico" caminho={CAMINHO} local="tool_top" ferramenta="eliptico" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Descubra quantas calorias a sua sessão de elíptico gasta com o seu peso e o seu esforço — e se o número do visor faz sentido.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraEliptico placement="calculadora-calorias-eliptico" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias o elíptico gasta?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Para uma pessoa de {PESO_PADRAO} kg em esforço moderado, cada minuto de elíptico custa cerca de{" "}
              <strong className="text-white">{fmt(POR_MIN)} kcal</strong>: aproximadamente {arredondaKcal(EX(20).kcal)} kcal
              em 20 minutos e {arredondaKcal(EX(30).kcal)} kcal em 30. Em esforço vigoroso o gasto por minuto sobe para cerca
              de {fmt(EX(1, VIG.met).kcal)} kcal.
            </p>
            <p className="text-gray-300 leading-relaxed mb-5">
              O que mais muda o número é o <strong className="text-white">peso corporal</strong>, seguido do{" "}
              <strong className="text-white">esforço</strong> — que no elíptico é a soma de resistência, passada e uso dos
              braços. A tabela é para 20 minutos, a sessão mais buscada.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em 20 minutos de elíptico por peso corporal e esforço</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    <th scope="col" className={th}>20 min moderado</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">20 min vigoroso</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_PESO.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {l.moderado} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {l.vigoroso} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Por tempo: 10, 20, 30, 45 e 60 minutos</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              O gasto é proporcional ao tempo. Para {PESO_PADRAO} kg:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de elíptico por tempo, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Tempo</th>
                    <th scope="col" className={th}>Moderado</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Vigoroso</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_TEMPO.map((l) => (
                    <tr key={l.minutos} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{formataTempo(l.minutos)}</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {l.moderado} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {l.vigoroso} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>As calorias do visor do elíptico são confiáveis?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              São estimativas, como a desta página — a diferença é que muitos aparelhos nem perguntam o seu peso e usam um
              valor padrão. Para quem pesa menos que esse padrão, o visor tende a mostrar mais do que a conta pelo peso real.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Por isso a calculadora tem um campo para o número do visor: ela mostra a distância entre os dois, sem fingir
              que um deles é medição. Para comparar uma sessão com a outra, o visor serve bem. Para decidir quanto comer
              depois, nenhum dos dois serve — o que decide é o{" "}
              <Link href="/blog/deficit-calorico-como-calcular" className={ln}>déficit da semana</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Elíptico ou esteira: qual gasta mais calorias?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Trinta minutos, {PESO_PADRAO} kg, do que gasta mais para o que gasta menos:</p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Comparação de gasto em 30 minutos entre elíptico, caminhada e esteira inclinada, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Atividade</th>
                    <th scope="col" className={th}>METs</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">30 min</th>
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
              A caminhada vem do mesmo motor da{" "}
              <Link href="/ferramentas/calculadora-calorias-caminhada" className={ln}>Calculadora de Calorias da Caminhada</Link>.
              A escolha prática raramente é por caloria: o elíptico poupa o joelho do impacto; a esteira permite inclinar.
              O que gasta mais no mês é o que você consegue repetir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto tempo de elíptico para perder 1 kg?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Matematicamente, um quilo de gordura guarda cerca de {KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal — para{" "}
              {PESO_PADRAO} kg em esforço moderado, algo como <strong className="text-white">{formataTempo(UM_QUILO.minutos)}</strong> de elíptico.
            </p>
            <div className="border-l-2 pl-4 mb-4" style={{ borderColor: "#BA9E50" }}>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">Isso NÃO significa que esse tempo de elíptico fará você perder exatamente 1 kg.</strong>{" "}
                É uma simulação teórica, para dar ordem de grandeza.
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              O corpo não responde de forma linear. {FONTE_HALL.rotuloCurto} {FONTE_HALL.resumo}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">{fmt(MOD.met)} × 3,5 × {PESO_PADRAO} ÷ 200 = <span className="text-white">≈ {fmt(POR_MIN)} kcal/min</span></p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_ELIPTICO.rotuloCurto}, que {FONTE_COMPENDIO_ELIPTICO.resumo} A calculadora usa
              as duas entradas como estão — {ESFORCOS.map((e) => `${e.nome.toLowerCase()} ${fmt(e.met)} METs`).join(" e ")} — e
              não cria uma terceira. Velocidade e resistência não entram porque o elíptico não tem equação metabólica
              própria: o Compêndio mediu por esforço.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os números são <strong className="text-white">brutos</strong>. Descontando o que se gastaria parado, 30 minutos
              moderados para {PESO_PADRAO} kg acrescentam cerca de {arredondaKcal(kcalLiquida(EX(30), PESO_PADRAO))} kcal ao dia.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 22 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal
              trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-eliptico" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_ELIPTICO.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/eliptico-emagrece" className={ln}>Elíptico emagrece? Protocolos e o gasto real</Link></li>
              <li><Link href="/blog/quanto-tempo-de-esteira-para-emagrecer" className={ln}>Quanto tempo de esteira para emagrecer</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-caminhada" className={ln}>Calculadora de Calorias da Caminhada</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
