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
 * trocado). Futebol, boxe, zumba, spinning, dança, natação, jiu-jitsu,
 * corda e escada saíram em setembro de 2026 para calculadoras próprias, cada uma com
 * uma conta que esta não tem.
 *
 * O exemplo da página é a primeira atividade da lista, não um id fixo: as
 * atividades estão saindo uma a uma, e o exemplo acompanha sem reescrita.
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
    "Quantas calorias gasta pedalar na rua, pelo seu peso e ritmo — e os links para as calculadoras próprias de cada esporte e atividade do site.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Calorias por Atividade | Montinho Personal Trainer",
    description:
      "Bicicleta de rua: quantas calorias a sua atividade gasta, com o seu peso e sem o exagero das tabelas de revista.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Calorias por Atividade",
  descricao:
    "Estima o gasto calórico da bicicleta de rua a partir do peso corporal, do tempo e do ritmo, com desconto opcional das pausas da aula.",
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

/** O exemplo da página: a primeira atividade da lista. */
const EX = ATIVIDADES[0];
const CMP = comparaAtividades(60, PESO_PADRAO);
const TAB_EX = tabelaPorPeso(EX, EX.sessaoTipica);
const UM_QUILO = simulacaoUmQuilo(PESO_PADRAO, EX.faixas[0].met);
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });

const FAQ_COMPARACAO: ItemFAQ[] = CMP.length > 1 ? [
{
    question: "Qual atividade queima mais calorias?",
    answer: `No mesmo tempo e para ${PESO_PADRAO} kg, a ordem começa em ${CMP[0].nome.split(" — ")[0].toLowerCase()} (${arredondaKcal(CMP[0].kcal)} kcal em 60 minutos) e termina em ${CMP[CMP.length - 1].nome.split(" — ")[0].toLowerCase()} (${arredondaKcal(CMP[CMP.length - 1].kcal)} kcal). Só que a atividade que emagrece mais é a que você repete — e nisso a que você gosta ganha da que gasta 50 kcal a mais.`,
  }
] : [];

const faq: ItemFAQ[] = [
  {
    question: "E o futebol, o boxe, a zumba, o spinning, a dança, a natação, o jiu-jitsu, a corda e a escada?",
    answer:
      "Têm calculadoras próprias, porque cada um tem uma conta que as outras atividades não têm. A do futebol separa o tempo de bola rolando do tempo na lateral quando os times revezam. A do boxe conta a aula ou os rounds, mede o ritmo pelos socos de dez segundos e compara com o número do relógio. A da zumba divide a aula entre músicas com e sem salto e mostra quantos quilos as aulas da semana rendem. A do spinning usa a potência média em watts que a bike mostra. A da dança calcula por estilo e compara todos os ritmos. A da natação calcula por nado e desconta o tempo parado na borda. A do jiu-jitsu separa a técnica dos rolas. A da corda conta só o tempo pulando dos blocos e quantos saltos foram. A da escada conta pelos andares e soma a descida.",
  },
  {
    question: "E se eu passei metade da aula parado?",
    answer:
      "Aí o gasto foi menor, e a calculadora tem uma caixa para isso. Marcada, ela conta só a fração do tempo que costuma ser esforço numa aula daquele tipo e mostra quanto descontou. Desmarcada — que é o padrão — vale o tempo cheio, que é o que as faixas de referência e os artigos do site usam.",
  },
  {
    question: "Esse número inclui o que eu gastaria parado?",
    answer: `Inclui — é gasto bruto, como em qualquer tabela de METs. Para ${PESO_PADRAO} kg em ${EX.artigoFrase} de ${EX.sessaoTipica} minutos, o bruto é cerca de ${arredondaKcal(deTempo(EX.sessaoTipica, PESO_PADRAO, EX.faixas[0].met).kcal)} kcal e o que a aula acrescenta de fato ao dia fica perto de ${arredondaKcal(kcalLiquida(deTempo(EX.sessaoTipica, PESO_PADRAO, EX.faixas[0].met), PESO_PADRAO))} kcal. A metodologia da calculadora mostra os dois.`,
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

const faqCompleto: ItemFAQ[] = [...faq.slice(0, 1), ...FAQ_COMPARACAO, ...faq.slice(1)];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqCompleto.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
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
            Bicicleta de rua: quanto o seu pedal
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
          {/* Com uma atividade só, "qual queima mais" seria uma tabela de uma linha. */}
          {CMP.length > 1 && (
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
          )}

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
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto gasta {EX.artigoFrase}?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Uma sessão de {EX.sessaoTipica} minutos, contando o tempo cheio — que é o que as faixas de referência usam:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado em {EX.artigoFrase} de {EX.sessaoTipica} minutos, por peso corporal</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Peso</th>
                    {EX.faixas.map((f) => (
                      <th key={f.id} scope="col" className={th}>{f.nome}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TAB_EX.map((l) => (
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
              Para as outras, use o seletor da calculadora — o{" "}
              <Link href={`/blog/${EX.slug}`} className={ln}>artigo de cada uma</Link> traz o que a conta não
              responde: o que ela faz bem e onde ela falha. Futebol, boxe, zumba, spinning, dança, natação, jiu-jitsu, corda e escada têm calculadoras próprias:{" "}
              <Link href="/ferramentas/calculadora-calorias-futebol" className={ln}>a do futebol</Link>, com o
              revezamento de times, <Link href="/ferramentas/calculadora-calorias-boxe" className={ln}>a do boxe</Link>,
              com os rounds e o ritmo de socos, <Link href="/ferramentas/calculadora-calorias-zumba" className={ln}>a da zumba</Link>,
              com as músicas com e sem salto, <Link href="/ferramentas/calculadora-calorias-spinning" className={ln}>a do spinning</Link>,
              com os watts da bike, <Link href="/ferramentas/calculadora-calorias-danca" className={ln}>a da dança</Link>, por estilo,{" "}
              <Link href="/ferramentas/calculadora-calorias-natacao" className={ln}>a da natação</Link>, por nado,{" "}
              <Link href="/ferramentas/calculadora-calorias-jiu-jitsu" className={ln}>a do jiu-jitsu</Link>, pelos rolas,{" "}
              <Link href="/ferramentas/calculadora-calorias-pular-corda" className={ln}>a da corda</Link>, pelos blocos, e{" "}
              <Link href="/ferramentas/calculadora-calorias-escada" className={ln}>a da escada</Link>, pelos andares.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto tempo para perder 1 kg?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Um quilo de gordura guarda cerca de {KCAL_POR_KG_GORDURA.toLocaleString("pt-BR")} kcal. Em{" "}
              {EX.nome.toLowerCase()}, ritmo {EX.faixas[0].nome.toLowerCase()}, para {PESO_PADRAO} kg, isso daria algo como{" "}
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
                {fmt(EX.faixas[0].met)} × 3,5 × {PESO_PADRAO} ÷ 200 ={" "}
                <span className="text-white">≈ {fmt(deTempo(1, PESO_PADRAO, EX.faixas[0].met).kcal)} kcal/min</span>
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
            <FAQ itens={faqCompleto} placement="ferramenta-atividades" />
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
              <li><Link href="/ferramentas/calculadora-calorias-boxe" className={ln}>Calculadora de Calorias no Boxe — com os rounds e o ritmo de socos</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-futebol" className={ln}>Calculadora de Calorias no Futebol — com o revezamento de times</Link></li>
              <li><Link href="/ferramentas/calculadora-calorias-zumba" className={ln}>Calculadora de Calorias na Zumba — quantos quilos as aulas rendem</Link></li>
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
