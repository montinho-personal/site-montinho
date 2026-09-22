import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraCorrida from "@/components/corrida/CalculadoraCorrida";
import {
  FONTES_CORRIDA,
  FONTE_COMPENDIO_CORRIDA,
  FONTE_HALL,
  KCAL_POR_KG_GORDURA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_PADRAO,
  arredondaKcal,
  comparaComCaminhada,
  deDistanciaEPace,
  formataPace,
  formataRelogio,
  kcalLiquida,
  kcalLiquidaPorKm,
  kcalPorKm,
  metCorrida,
  simulacaoUmQuilo,
  tabelaPorPace,
  tabelaPorPeso,
  tabelaProvas,
} from "@/lib/corrida";

/**
 * A página da Calculadora de Corrida.
 *
 * A ressalva de demanda está em lib/corrida.ts: ao contrário da caminhada
 * e das atividades, a corrida não tem busca comprovada no Search Console
 * do site. Esta página é aposta em busca externa de pace e de tempo de
 * prova, e atende três artigos que estavam sem ferramenta.
 *
 * Os números resolvidos em HTML existem porque o robô não digita pace.
 */

const CAMINHO = "/ferramentas/calculadora-corrida";

export const metadata: Metadata = {
  title: "Calculadora de Corrida: Pace, Tempo e Calorias",
  description:
    "Converta pace, tempo e distância da sua corrida e veja o gasto calórico pelo seu peso — com o tempo estimado de 5 km, 10 km, meia e maratona.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Corrida | Montinho Personal Trainer",
    description:
      "Pace, tempo, distância e calorias da sua corrida — e o tempo estimado de 5 km, 10 km, meia e maratona no seu ritmo.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Corrida",
  descricao:
    "Converte pace, tempo e distância de corrida, estima o gasto calórico a partir do peso corporal e da inclinação, projeta o tempo de 5 km, 10 km, meia maratona e maratona, e compara o gasto de correr com o de caminhar.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Corrida", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const PACE_EX = 360; /* 6:00/km — o pace de quem corre por saúde */
const EX_5K = deDistanciaEPace(5, PACE_EX, PESO_PADRAO);
const EX_10K = deDistanciaEPace(10, PACE_EX, PESO_PADRAO);
const PROVAS_EX = tabelaProvas(PACE_EX, PESO_PADRAO);
const TAB_PESO = tabelaPorPeso(PACE_EX);
const TAB_PACE = tabelaPorPace(PESO_PADRAO);
const CMP = comparaComCaminhada(EX_5K, PESO_PADRAO);
const UM_QUILO = simulacaoUmQuilo(PESO_PADRAO, PACE_EX);
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias 5 km de corrida queimam?",
    answer: `Para uma pessoa de ${PESO_PADRAO} kg num pace de ${formataPace(PACE_EX)} por quilômetro, cerca de ${arredondaKcal(EX_5K.kcal)} kcal — em ${formataRelogio(EX_5K.minutos * 60)}. Com 50 kg fica perto de ${TAB_PESO[0].kcal5k} kcal e com 100 kg, de ${TAB_PESO[5].kcal5k} kcal. A regra prática: cerca de 1 kcal por quilo de corpo a cada quilômetro.`,
  },
  {
    question: "Quantas calorias 10 km de corrida queimam?",
    answer: `Cerca de ${arredondaKcal(EX_10K.kcal)} kcal para ${PESO_PADRAO} kg — o dobro dos 5 km, porque o gasto acompanha a distância quase em linha reta.`,
  },
  {
    question: "Correr mais rápido queima mais calorias?",
    answer: `Por minuto, sim; por quilômetro, quase nada. No pace de ${formataPace(TAB_PACE[0].pace)} os 5 km custam ${TAB_PACE[0].kcal5k} kcal para ${PESO_PADRAO} kg, e no de ${formataPace(TAB_PACE[TAB_PACE.length - 1].pace)}, ${TAB_PACE[TAB_PACE.length - 1].kcal5k} kcal. Correr mais rápido serve para terminar antes e para melhorar o condicionamento — não para gastar muito mais na mesma distância.`,
  },
  {
    question: "Correr 5 km gasta mais que caminhar 5 km?",
    answer: `Gasta, mas menos do que parece: cerca de ${arredondaKcal(CMP.corrida.kcal)} kcal correndo contra ${arredondaKcal(CMP.caminhadaMesmaDistancia.kcal)} kcal caminhando, para ${PESO_PADRAO} kg. A mesma distância custa quase o mesmo — a diferença é o tempo: ${formataRelogio(CMP.corrida.minutos * 60)} contra ${formataRelogio(CMP.caminhadaMesmaDistancia.minutos * 60)}. No mesmo tempo, aí sim a corrida gasta muito mais.`,
  },
  {
    question: "Qual o tempo de uma maratona no meu pace?",
    answer: `No pace de ${formataPace(PACE_EX)}, a maratona sai em ${formataRelogio(PROVAS_EX[3].segundos)} e a meia em ${formataRelogio(PROVAS_EX[2].segundos)}. A calculadora projeta os quatro tempos no pace que você informar — lembrando que a conta supõe ritmo constante, o que quase nunca acontece numa maratona.`,
  },
  {
    question: "O que é pace na corrida?",
    answer:
      "É o tempo que você leva para correr um quilômetro, escrito em minutos e segundos: 6:00 quer dizer seis minutos por quilômetro, o equivalente a 10 km/h. É a medida que os corredores usam porque ela responde direto a pergunta que importa numa prova — quanto tempo vou levar.",
  },
  {
    question: "Quantos quilômetros para perder 1 kg?",
    answer: `Um quilo de gordura guarda cerca de ${KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal, o que daria aproximadamente ${Math.round(UM_QUILO.km)} km de corrida para ${PESO_PADRAO} kg. É simulação teórica, não plano: o corpo não responde de forma linear, e ninguém corre isso de uma vez.`,
  },
  {
    question: "Correr todo dia perde barriga?",
    answer: NOTA_SEM_PERDA_LOCALIZADA + " E correr todo dia, para quem está começando, costuma cobrar canela e joelho antes de entregar resultado — alternar com caminhada nas primeiras semanas é o que faz a corrida durar.",
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

export default function CalculadoraCorridaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Corrida
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Corrida" caminho={CAMINHO} local="tool_top" ferramenta="corrida" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Informe dois valores — distância, tempo ou pace — e veja o terceiro, com o gasto calórico pelo seu
            peso e o tempo estimado de 5 km, 10 km, meia e maratona.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraCorrida placement="calculadora-corrida" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias a corrida queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Para uma pessoa de {PESO_PADRAO} kg no pace de {formataPace(PACE_EX)} por quilômetro, os 5 km custam
              cerca de <strong className="text-white">{arredondaKcal(EX_5K.kcal)} kcal</strong> em{" "}
              {formataRelogio(EX_5K.minutos * 60)}, e os 10 km, {arredondaKcal(EX_10K.kcal)} kcal. Isso dá em torno de{" "}
              {Math.round(kcalPorKm(EX_5K))} kcal por quilômetro.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Daí sai a regra de bolso mais útil da corrida:{" "}
              <strong className="text-white">1 kcal por quilo de corpo a cada quilômetro</strong>. Ela vale para o
              gasto <em>acima do repouso</em> — e não é aproximação: na equação da ACSM esse número é exatamente 1,00
              em qualquer pace. O bruto, que é o que relógios e calculadoras mostram, fica em torno de{" "}
              {fmt(kcalPorKm(EX_5K) / PESO_PADRAO, 2)} kcal por quilo por quilômetro, porque soma o repouso do tempo em
              que você esteve correndo. Nos 5 km do exemplo: {arredondaKcal(EX_5K.kcal)} kcal brutas e{" "}
              {arredondaKcal(kcalLiquida(EX_5K, PESO_PADRAO))} kcal de acréscimo real.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em 5 km e 10 km de corrida por peso corporal</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    <th scope="col" className={th}>5 km</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">10 km</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_PESO.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">≈ {l.kcal5k} kcal</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {l.kcal10k} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">No pace de {formataPace(PACE_EX)}, no plano.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Correr mais rápido queima mais calorias?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Por minuto, sim. Por quilômetro, quase nada — e é aí que quase todo mundo se engana. A tabela é para{" "}
              {PESO_PADRAO} kg, nos mesmos 5 km:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto e tempo em 5 km por pace, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Pace</th>
                    <th scope="col" className={th}>Velocidade</th>
                    <th scope="col" className={th}>METs</th>
                    <th scope="col" className={th}>Tempo nos 5 km</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Gasto</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_PACE.map((l) => (
                    <tr key={l.pace} className="border-b border-white/10">
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">{formataPace(l.pace)}</td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums">{fmt(l.velocidade)} km/h</td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums">{fmt(l.met)}</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{formataRelogio(l.tempo5k)}</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {l.kcal5k} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Do pace mais lento ao mais rápido da tabela, o tempo cai quase um terço e o gasto sobe pouco mais de
              {" "}{Math.round(((TAB_PACE[TAB_PACE.length - 1].kcal5k - TAB_PACE[0].kcal5k) / TAB_PACE[0].kcal5k) * 100)}%.
              Correr mais rápido serve para terminar antes e melhorar o condicionamento — se o objetivo é gasto,
              o que manda é a distância.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Correr 5 km gasta mais que caminhar 5 km?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Gasta, mas muito menos do que a intuição diz. Para {PESO_PADRAO} kg, correr 5 km no pace de{" "}
              {formataPace(PACE_EX)} custa cerca de{" "}
              <strong className="text-white">{arredondaKcal(CMP.corrida.kcal)} kcal</strong>; caminhar os mesmos 5 km a{" "}
              {fmt(CMP.velocidadeCaminhada)} km/h custa <strong className="text-white">{arredondaKcal(CMP.caminhadaMesmaDistancia.kcal)} kcal</strong>.
              A diferença está no relógio: {formataRelogio(CMP.corrida.minutos * 60)} contra{" "}
              {formataRelogio(CMP.caminhadaMesmaDistancia.minutos * 60)}.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              A conta vira quando o tempo é o mesmo. Nos {formataRelogio(CMP.corrida.minutos * 60)} da corrida, uma
              caminhada cobriria {fmt(CMP.caminhadaMesmoTempo.km)} km e gastaria cerca de{" "}
              {arredondaKcal(CMP.caminhadaMesmoTempo.kcal)} kcal — menos da metade. É <strong className="text-white">por
              tempo</strong> que a corrida ganha, não por quilômetro.
            </p>
            <p className="text-gray-300 leading-relaxed">
              O que isso significa na prática: quem tem pouco tempo se beneficia da corrida; quem tem joelho
              sensível pode trocar por{" "}
              <Link href="/ferramentas/calculadora-calorias-caminhada" className={ln}>caminhada mais longa</Link>{" "}
              e chegar perto do mesmo gasto.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Tempo de prova no seu pace</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              No pace de {formataPace(PACE_EX)}, para {PESO_PADRAO} kg:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Tempo e gasto estimados por prova no pace de 6:00, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Prova</th>
                    <th scope="col" className={th}>Distância</th>
                    <th scope="col" className={th}>Tempo</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Gasto</th>
                  </tr>
                </thead>
                <tbody>
                  {PROVAS_EX.map((l) => (
                    <tr key={l.prova.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{l.prova.nome}</td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums">{fmt(l.prova.km, 3)} km</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">{formataRelogio(l.segundos)}</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">≈ {arredondaKcal(l.kcal)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              A conta supõe pace constante do primeiro ao último quilômetro. Na maratona isso quase nunca
              acontece: o tempo real costuma ser maior, e é por isso que provas longas se planejam com margem.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantos quilômetros para perder 1 kg?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Um quilo de gordura guarda cerca de {KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal — o que daria
              aproximadamente <strong className="text-white">{Math.round(UM_QUILO.km)} km</strong> de corrida para{" "}
              {PESO_PADRAO} kg, ou {formataRelogio(UM_QUILO.minutos * 60)} correndo.
            </p>
            <div className="border-l-2 pl-4 mb-4" style={{ borderColor: "#BA9E50" }}>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">Isso NÃO significa que correr {Math.round(UM_QUILO.km)} km fará você perder exatamente 1 kg.</strong>{" "}
                É uma simulação teórica, para dar ordem de grandeza.
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              O corpo não responde de forma linear. {FONTE_HALL.rotuloCurto} {FONTE_HALL.resumo} O número serve
              para mostrar por que{" "}
              <Link href="/blog/deficit-calorico-como-calcular" className={ln}>o déficit da semana</Link> decide
              mais que qualquer treino isolado — e por que{" "}
              <Link href="/blog/musculacao-ou-corrida-para-emagrecer" className={ln}>corrida sem musculação</Link>{" "}
              costuma custar músculo junto.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Na corrida a fonte não é uma tabela de METs, é a equação da ACSM — que é contínua e responde
              qualquer pace, sem interpolar:
            </p>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>VO₂ = 0,2 × v + 0,9 × v × inclinação + 3,5</p>
              <p className="mt-1 text-gray-400">v em metros por minuto; VO₂ ÷ 3,5 = METs</p>
              <p className="mt-2">
                a {fmt(EX_5K.velocidade)} km/h: <span className="text-white">≈ {fmt(EX_5K.met)} METs</span>
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              O 0,2 é o custo de oxigênio do deslocamento horizontal e o 0,9, o da subida — o dobro e a metade,
              respectivamente, dos valores da caminhada: correr custa mais no plano e aproveita melhor a subida.
              A equação vale a partir de 8 km/h;
              abaixo disso a calculadora troca para a conta da caminhada e avisa na tela.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              A conferência contra o {FONTE_COMPENDIO_CORRIDA.rotuloCurto} fecha: a equação dá{" "}
              {fmt(metCorrida(8))} METs a 8 km/h, {fmt(metCorrida(10))} a 10 km/h e {fmt(metCorrida(12))} a 12 km/h,
              contra as faixas de 8,3, de 9,8 a 10,5 e de 11,8 a 12,3 do Compêndio.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os números em destaque são <strong className="text-white">brutos</strong>, como em qualquer tabela de
              METs: incluem o que você gastaria parado. O líquido aparece ao lado, porque é ele que fecha com a
              regra de 1 kcal por quilo por quilômetro — {fmt(kcalLiquidaPorKm(EX_5K, PESO_PADRAO) / PESO_PADRAO, 2)} no
              exemplo — e é ele que conta num déficit.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 22 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>,
              personal trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-corrida" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_CORRIDA.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/corrida-para-iniciantes" className={ln}>Corrida para iniciantes: como começar sem se machucar</Link></li>
              <li><Link href="/blog/corrida-de-rua-iniciante" className={ln}>Primeira corrida de rua: o que saber antes</Link></li>
              <li><Link href="/blog/esteira-ou-rua-para-correr" className={ln}>Esteira ou rua: onde correr</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-caminhada" className={ln}>Calculadora de Calorias da Caminhada</Link></li>
              <li><Link href="/ferramentas/zonas-de-frequencia-cardiaca" className={ln}>Calculadora de Zonas de Frequência Cardíaca</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
