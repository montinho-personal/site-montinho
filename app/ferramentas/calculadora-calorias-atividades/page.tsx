import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraAtividades from "@/components/atividades/CalculadoraAtividades";
import {
  ATIVIDADES,
  FONTES_ATIVIDADES,
  FONTE_COMPENDIO_ATIVIDADES,
  FONTE_HALL,
  KCAL_POR_KG_GORDURA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_PADRAO,
  arredondaKcal,
  atividade,
  comparaAtividades,
  deTempo,
  formataTempo,
  kcalLiquida,
  simulacaoUmQuilo,
  tabelaPorPeso,
  tempoAtivo,
} from "@/lib/atividades";

/**
 * A página da Calculadora de Calorias por Atividade.
 *
 * Uma página, várias atividades — lib/atividades.ts explica por que não
 * são uma página cada (seriam doorway, com a mesma conta e só o MET
 * trocado). O futebol saiu em 22/09/2026 para a calculadora própria, que
 * tem uma conta que esta não tem: o revezamento de times.
 *
 * Os artigos de cada atividade continuam com canonical próprio e já
 * ranqueiam entre a posição 5 e a 10; eles embutem a calculadora com a
 * atividade deles escolhida e linkam para cá. Esta página responde a
 * busca genérica — "calculadora de calorias por exercício" — e serve de
 * página canônica para o embed, como lib/ferramentas/canonica.ts exige.
 *
 * Os números resolvidos em HTML existem porque o robô não digita peso.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-atividades";

export const metadata: Metadata = {
  title: "Calculadora de Calorias por Atividade e Esporte",
  description:
    "Quantas calorias sua aula gasta: boxe, zumba, spinning, dança, natação, jiu-jitsu, corda e mais, pelo seu peso, com as pausas da aula como opção.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias por Atividade | Montinho Personal Trainer",
    description:
      "Boxe, zumba, spinning, natação e mais: quantas calorias a sua aula gasta, com o seu peso e sem o exagero das tabelas de revista.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias por Atividade",
  descricao:
    "Estima o gasto calórico de nove atividades — boxe, zumba, spinning, dança, natação, jiu-jitsu, pular corda, subir escada e bicicleta — a partir do peso corporal, do tempo e do ritmo, com desconto opcional das pausas da aula.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Calorias por Atividade", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const BOXE = atividade("boxe");
const ZUM = atividade("zumba");
const CMP = comparaAtividades(60, PESO_PADRAO);
const TAB_BOXE = tabelaPorPeso(BOXE, 60);
const UM_QUILO = simulacaoUmQuilo(PESO_PADRAO, BOXE.faixas[0].met);
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });
/** O gasto de uma aula: tempo de aula, já descontadas as pausas. */
const aula = (id: string, min: number, iFaixa = 0) => {
  const a = atividade(id);
  return deTempo(tempoAtivo(min, a), PESO_PADRAO, a.faixas[iFaixa].met);
};

const faq: ItemFAQ[] = [
  {
    question: "Quantas calorias uma aula de boxe queima?",
    answer: `Uma aula de 60 minutos para uma pessoa de ${PESO_PADRAO} kg gasta cerca de ${arredondaKcal(deTempo(60, PESO_PADRAO, BOXE.faixas[0].met).kcal)} kcal no saco e nos aparelhos, e ${arredondaKcal(deTempo(60, PESO_PADRAO, BOXE.faixas[1].met).kcal)} kcal em sparring. Se a aula teve muita explicação e pausa, a calculadora recalcula contando cerca de ${Math.round(BOXE.fracaoAtiva! * 100)}% do tempo — o que dá ${arredondaKcal(aula("boxe", 60).kcal)} kcal. Os "1.000 kcal por aula" que circulam supõem uma hora inteira de sparring, que quase ninguém faz.`,
  },
  {
    question: "E o futebol?",
    answer:
      "O futebol tem calculadora própria, porque pelada de adulto tem uma conta que as outras atividades não têm: o revezamento de times. Duas horas de quadra com quatro times são uma hora de bola rolando. A Calculadora de Calorias no Futebol separa uma coisa da outra e mostra quantas latas de cerveja o jogo realmente pagou.",
  },
  {
    question: "Quantas calorias uma aula de zumba queima?",
    answer: `Uma aula de 50 minutos para ${PESO_PADRAO} kg fica em torno de ${arredondaKcal(deTempo(50, PESO_PADRAO, ZUM.faixas[0].met).kcal)} kcal em coreografia de baixo impacto e ${arredondaKcal(deTempo(50, PESO_PADRAO, ZUM.faixas[1].met).kcal)} kcal em aula de alto impacto, com saltos. Bem longe das "1.000 calorias por aula" que a propaganda promete.`,
  },
  {
    question: "Qual atividade queima mais calorias?",
    answer: `No mesmo tempo e para ${PESO_PADRAO} kg, a ordem começa em ${CMP[0].nome.split(" — ")[0].toLowerCase()} (${arredondaKcal(CMP[0].kcal)} kcal em 60 minutos) e termina em ${CMP[CMP.length - 1].nome.split(" — ")[0].toLowerCase()} (${arredondaKcal(CMP[CMP.length - 1].kcal)} kcal). Só que a atividade que emagrece mais é a que você repete — e nisso a que você gosta ganha da que gasta 50 kcal a mais.`,
  },
  {
    question: "E se eu passei metade da aula parado?",
    answer:
      "Aí o gasto foi menor, e a calculadora tem uma caixa para isso. Marcada, ela conta só a fração do tempo que costuma ser esforço numa aula daquele tipo e mostra quanto descontou. Desmarcada — que é o padrão — vale o tempo cheio, que é o que as faixas de referência e os artigos do site usam.",
  },
  {
    question: "Esse número inclui o que eu gastaria parado?",
    answer: `Inclui — é gasto bruto, como em qualquer tabela de METs. Para ${PESO_PADRAO} kg numa aula de boxe de 60 minutos, o bruto é cerca de ${arredondaKcal(deTempo(60, PESO_PADRAO, BOXE.faixas[0].met).kcal)} kcal e o que a aula acrescenta de fato ao dia fica perto de ${arredondaKcal(kcalLiquida(deTempo(60, PESO_PADRAO, BOXE.faixas[0].met), PESO_PADRAO))} kcal. A metodologia da calculadora mostra os dois.`,
  },
  {
    question: "Fazer essa atividade todo dia perde barriga?",
    answer: NOTA_SEM_PERDA_LOCALIZADA + " A atividade entra como uma das fontes de gasto da semana, ao lado da musculação e da alimentação.",
  },
  {
    question: "E caminhada e elíptico?",
    answer:
      "Têm calculadora própria, com coisas que esta não faz: a da caminhada trabalha com distância, passos e inclinação de esteira; a do elíptico compara com o número do visor do aparelho. Os links estão no fim desta página.",
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

export default function CalculadoraAtividadesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Calorias por Atividade
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Calorias por Atividade" caminho={CAMINHO} local="tool_top" ferramenta="atividades" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Boxe, zumba, spinning, dança, natação, jiu-jitsu, corda, escada e bicicleta: quanto a sua sessão
            gasta, com o seu peso — e, se você passou parte da aula parado, sem contar esse tempo como esforço.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraAtividades placement="calculadora-calorias-atividades" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Qual atividade queima mais calorias?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Sessenta minutos, para uma pessoa de {PESO_PADRAO} kg, na faixa que representa cada atividade:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em 60 minutos por atividade, para 70 kg</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Atividade</th>
                    <th scope="col" className={th}>METs</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">60 min</th>
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
              A tabela responde &ldquo;qual gasta mais por minuto&rdquo;, que não é a mesma pergunta que
              &ldquo;qual emagrece mais&rdquo;. A segunda depende de quantas vezes por semana você aparece — e aí
              a atividade de que você gosta ganha da que gasta 50 kcal a mais e você abandona em três semanas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              E se eu passei metade da aula parado?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              O padrão da calculadora é contar o tempo cheio da sessão, que é o que as faixas de referência
              usam. Só que aula de verdade tem aquecimento, explicação de combinação, troca de parceiro e água —
              e pelada tem o time esperando a bola voltar do mato. Quando a sessão foi assim, a caixa
              &ldquo;passei boa parte da sessão parado&rdquo; recalcula com a fração abaixo.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Quanto do tempo de sessão costuma ser esforço, por atividade</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Atividade</th>
                    <th scope="col" className={th}>Sessão típica</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Se marcar a caixa</th>
                  </tr>
                </thead>
                <tbody>
                  {ATIVIDADES.map((a) => (
                    <tr key={a.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">{a.nome}</td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums">{a.sessaoTipica} min</td>
                      <td className="text-white py-2.5 tabular-nums">
                        {a.fracaoAtiva === null ? "contínuo" : `≈ ${Math.round(tempoAtivo(a.sessaoTipica, a))} min (${Math.round(a.fracaoAtiva * 100)}%)`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              Natação e bicicleta aparecem como contínuas: nelas, parar é parar de verdade, e quem conta o tempo
              já conta o tempo nadando ou pedalando. As frações são as únicas coisas desta página que não vêm do
              Compêndio — por isso são opcionais, e não o padrão.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantas calorias uma aula de boxe queima?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Uma aula de 60 minutos, contando o tempo cheio — que é o que as faixas de referência usam:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado numa aula de boxe de 60 minutos, por peso corporal</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    {BOXE.faixas.map((f) => (
                      <th key={f.id} scope="col" className={th}>{f.nome}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TAB_BOXE.map((l) => (
                    <tr key={l.peso} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.peso} kg</td>
                      {l.kcal.map((k, i) => (
                        <td key={i} className={`py-2.5 pr-4 tabular-nums ${i === 0 ? "text-white font-medium" : "text-gray-300"}`}>≈ {k} kcal</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Para zumba e as outras sete, use o seletor da calculadora — o{" "}
              <Link href="/blog/boxe-emagrece" className={ln}>artigo do boxe</Link> e o{" "}
              <Link href="/blog/zumba-emagrece" className={ln}>da zumba</Link> trazem o que a conta não
              responde: o que cada uma faz bem e onde ela falha. Futebol tem{" "}
              <Link href="/ferramentas/calculadora-calorias-futebol" className={ln}>calculadora própria</Link>, com o
              revezamento de times.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto tempo para perder 1 kg?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Um quilo de gordura guarda cerca de {KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal. Em aula de
              boxe, para {PESO_PADRAO} kg, isso daria algo como{" "}
              <strong className="text-white">{formataTempo(UM_QUILO.minutos)}</strong> de esforço.
            </p>
            <div className="border-l-2 pl-4 mb-4" style={{ borderColor: "#BA9E50" }}>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">Isso NÃO significa que esse tempo fará você perder exatamente 1 kg.</strong>{" "}
                É uma simulação teórica, para dar ordem de grandeza.
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              O corpo não responde de forma linear. {FONTE_HALL.rotuloCurto} {FONTE_HALL.resumo} O que a conta
              mostra é por que nenhuma atividade sozinha resolve — e por que{" "}
              <Link href="/blog/deficit-calorico-como-calcular" className={ln}>o déficit da semana</Link> é o que decide.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>kcal/min = MET × 3,5 × peso (kg) ÷ 200</p>
              <p className="mt-2">
                {fmt(BOXE.faixas[0].met)} × 3,5 × {PESO_PADRAO} ÷ 200 ={" "}
                <span className="text-white">≈ {fmt(deTempo(1, PESO_PADRAO, BOXE.faixas[0].met).kcal)} kcal/min</span>
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os METs vêm do {FONTE_COMPENDIO_ATIVIDADES.rotuloCurto}, que {FONTE_COMPENDIO_ATIVIDADES.resumo} Cada
              atividade entra com as faixas que o Compêndio mediu — nada é interpolado, e onde ele não tem uma
              faixa, ela não existe aqui:
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Valores de MET usados em cada atividade e ritmo</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Atividade</th>
                    <th scope="col" className={th}>Faixa</th>
                    <th scope="col" className={th}>MET</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Entrada do Compêndio</th>
                  </tr>
                </thead>
                <tbody>
                  {ATIVIDADES.flatMap((a) =>
                    a.faixas.map((f, i) => (
                      <tr key={`${a.id}-${f.id}`} className="border-b border-white/10">
                        <td className="text-gray-300 py-2.5 pr-4">{i === 0 ? a.nome : ""}</td>
                        <td className="text-white py-2.5 pr-4">{f.nome}</td>
                        <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{fmt(f.met)}</td>
                        <td className="text-gray-400 py-2.5 leading-relaxed">{f.origem}</td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              O <strong className="text-white">desconto das pausas</strong> é a única coisa aqui que não vem do
              Compêndio: são frações típicas de aula, declaradas na tabela acima, e por isso ficam como opção em
              vez de padrão — os METs de esporte já são medidos na atividade como ela é praticada. Os números são{" "}
              <strong className="text-white">brutos</strong>: incluem o que você gastaria parado.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 22 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>,
              personal trainer em Alphaville. Estimativas de gasto energético, não orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-atividades" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_ATIVIDADES.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href={`/blog/${BOXE.slug}`} className={ln}>Boxe emagrece? O que uma aula realmente gasta</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-futebol" className={ln}>Calculadora de Calorias no Futebol — com o revezamento de times</Link></li>
              <li><Link href={`/blog/${ZUM.slug}`} className={ln}>Zumba emagrece? O que a aula entrega</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-caminhada" className={ln}>Calculadora de Calorias da Caminhada — com distância, passos e inclinação</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-eliptico" className={ln}>Calculadora de Calorias do Elíptico — com a conferência do visor</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE — o gasto do seu dia inteiro</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
