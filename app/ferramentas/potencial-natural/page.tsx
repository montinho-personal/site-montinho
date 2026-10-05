import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraPotencial from "@/components/potencial/CalculadoraPotencial";
import {
  FONTES_POTENCIAL,
  FONTE_FFMI_MULHERES,
  FONTE_KOURI,
  NIVEIS,
  NOTA_GORDURA_ALTA,
  NOTA_GORDURA_ESTIMADA,
  NOTA_NAO_E_PAREDE,
  NOTA_NAO_PRESCREVE,
  NOTA_TAXAS_OTIMISTAS,
  NOTA_TEMPO_OTIMISTA,
  REFERENCIA_FFMI,
  calcula,
  formataFFMI,
  formataKg,
  formataMeses,
  tabelaPorAltura,
} from "@/lib/potencial";

/**
 * A página da Calculadora de Potencial Natural.
 *
 * lib/potencial.ts explica o desequilíbrio que ela corrige no ecossistema
 * e por que o número 25 precisa ser apresentado como referência e não
 * como limite. O que vale registrar aqui: a tabela por altura existe
 * porque "FFMI 25" não diz nada a ninguém — "1,75 m e 86 kg com 12% de
 * gordura" diz.
 */

const CAMINHO = "/ferramentas/potencial-natural";

export const metadata: Metadata = {
  title: "Calculadora de Potencial Natural e FFMI Normalizado",
  description:
    "Descubra seu FFMI normalizado e quanto de massa magra ainda cabe até a faixa de referência natural — com o tempo estimado no ritmo do seu nível de treino.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Potencial Natural | Montinho Personal Trainer",
    description:
      "Seu FFMI, quanto de massa magra ainda cabe e em quanto tempo — e por que o famoso limite de 25 não é uma parede.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Potencial Natural",
  descricao:
    "Calcula o índice de massa livre de gordura (FFMI) normalizado a partir de altura, peso e percentual de gordura, compara com a faixa de referência da literatura e estima quanto de massa magra ainda cabe e em quanto tempo, pelo tempo de treino.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Potencial Natural", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const EX = calcula(1.78, 75, 15, "homem", "intermediario");
const TAB_H = tabelaPorAltura("homem");
const TAB_M = tabelaPorAltura("mulher");
const pct = (n: number) => `${(n * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;

const faq: ItemFAQ[] = [
  {
    question: "O que é FFMI?",
    answer:
      "É o índice de massa livre de gordura: a sua massa magra dividida pela altura ao quadrado. É como o IMC, mas ignorando a gordura — por isso ele diz algo sobre musculatura que o IMC não diz. Um homem de 1,80 m com 81 kg de massa magra tem FFMI 25.",
  },
  {
    question: "Qual é o limite natural de FFMI?",
    answer: NOTA_NAO_E_PAREDE + ` O número que circula, ${REFERENCIA_FFMI.homem}, vem de ${FONTE_KOURI.rotuloCurto}, que mediu 157 atletas. Para mulheres a literatura é outra e a referência fica perto de ${REFERENCIA_FFMI.mulher}.`,
  },
  {
    question: "Quanto de massa muscular dá para ganhar por ano?",
    answer: `Depende de há quanto tempo você treina. ${NIVEIS.map((n) => `${n.nome.toLowerCase()}: ${pct(n.taxa.min)} a ${pct(n.taxa.max)} do peso por mês`).join("; ")}. Para 80 kg, isso vai de cerca de 0,2 kg a 1,2 kg por mês, conforme o nível. ${NOTA_TAXAS_OTIMISTAS}`,
  },
  {
    question: "Preciso saber meu percentual de gordura?",
    answer: NOTA_GORDURA_ESTIMADA,
  },
  {
    question: "Cheguei no meu limite. Devo parar de treinar?",
    answer: NOTA_NAO_PRESCREVE,
  },
  {
    question: "Como saber se tenho genética para musculação?",
    answer: "Treinando de verdade por um ou dois anos: carga subindo, volume suficiente, proteína e sono em dia. Quem responde rápido nessas condições tem boa resposta ao treino. Antes disso, quase sempre o que parece genética ruim é treino ou alimentação inconsistente. A calculadora mostra onde você está em relação ao teto natural médio, não o seu teto exato.",
  },
  {
    question: "Como a genética influencia a musculação?",
    answer: "Ela mexe no ritmo e no teto: tamanho da estrutura óssea, proporção de fibras rápidas, onde o músculo se insere no osso e como o corpo responde ao estímulo. Por isso duas pessoas com o mesmo treino evoluem em velocidades diferentes. Ela não decide se você vai ganhar músculo; decide quanto e em quanto tempo.",
  },
  {
    question: "Qual a melhor genética para musculação?",
    answer: "Ossos mais largos, músculos com inserção longa e boa resposta ao treino ajudam. Mas não dá para escolher, e quase ninguém chega perto do próprio limite: a diferença entre treinar bem por anos e treinar mais ou menos pesa muito mais que a genética para quem não compete.",
  },
  {
    question: "Pulso e tornozelo mostram o potencial genético?",
    answer: "Algumas fórmulas, como a de Casey Butt, usam a circunferência do pulso e do tornozelo como sinal do tamanho da estrutura óssea. São estimativas populacionais, como o FFMI. Servem de referência, não de sentença: medida de osso não prevê como o seu músculo responde ao treino.",
  },
  {
    question: "Qual hormônio é melhor para ganhar massa muscular?",
    answer: "Testosterona, hormônio do crescimento e insulina participam do ganho de músculo, e o jeito natural de manter os seus em ordem é dormir bem, comer o suficiente e treinar com constância. Uso de hormônio é decisão médica, e quem usa sai da conta desta calculadora, que mede o limite natural.",
  },
  {
    question: "Por que o FFMI é normalizado pela altura?",
    answer:
      "Porque o FFMI bruto favorece quem é mais baixo: a altura entra ao quadrado no denominador, mas massa magra não cresce ao quadrado com a estatura. A correção de 6,3 × (1,80 − altura) põe todo mundo na mesma régua, que é a de um corpo de 1,80 m — e é assim que o estudo original fez.",
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

export default function PotencialNaturalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Potencial Natural
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Potencial Natural" caminho={CAMINHO} local="tool_top" ferramenta="potencial" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Quanto de músculo ainda cabe no seu corpo, e em quanto tempo — com o FFMI que a literatura usa, e sem
            transformar um número de 1995 em sentença.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraPotencial placement="potencial-natural" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O que o número 25 realmente diz</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {FONTE_KOURI.rotuloCurto} mediu 157 atletas — 83 usuários de esteroides e 74 que não usavam — e
              observou que os não usuários ficavam abaixo de um FFMI normalizado de 25,0. Foi daí que saiu &ldquo;o
              limite natural&rdquo;.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Só que o estudo não diz que 25 é uma parede. Ele diz que, <em>naquela amostra</em>, ninguém sem
              esteroide passou disso. É uma amostra de 1995, só de homens, com a gordura corporal estimada por
              dobras cutâneas — e o próprio artigo estimou os vencedores do Mr. America da era pré-esteroide em
              média 25,4, ou seja, acima do tal limite.
            </p>
            <p className="text-gray-300 leading-relaxed">
              O que o número serve para dizer é outra coisa, e essa é útil: quem chega perto dele está na faixa
              mais musculosa que já foi medida sem ajuda farmacológica, e daí para frente o ganho é lento. Não é
              um teto — é um aviso de que a expectativa precisa mudar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>A referência em quilos, por altura</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              &ldquo;FFMI 25&rdquo; não diz nada a quase ninguém. Em quilos, com um percentual de gordura
              plausível, diz:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Massa magra e peso corporal na faixa de referência, por altura</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Altura</th>
                    <th scope="col" className={th}>Homens (FFMI {REFERENCIA_FFMI.homem}, 12% de gordura)</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Mulheres (FFMI {REFERENCIA_FFMI.mulher}, 22%)</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB_H.map((l, i) => (
                    <tr key={l.altura} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{l.altura.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} m</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">
                        {formataKg(l.massaMagra)} magros · {formataKg(l.peso)}
                      </td>
                      <td className="text-gray-300 py-2.5 tabular-nums">
                        {formataKg(TAB_M[i].massaMagra)} magros · {formataKg(TAB_M[i].peso)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              Olhando assim fica claro por que quase ninguém encosta nesses números: um homem de 1,80 m na
              referência pesaria {formataKg(TAB_H[4].peso)} com 12% de gordura — o físico de um fisiculturista
              natural de nível competitivo, não o de quem treina bem há alguns anos. Na Classic Physique, o
              limite é oficial: veja{" "}
              <Link href="/blog/ramon-dino-peso-altura" className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white">
                quanto pesa Ramon Dino e o limite de peso da categoria
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto dá para ganhar por mês</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              É aqui que a pergunta &ldquo;quanto falta&rdquo; encontra a realidade. As taxas caem com o tempo de
              treino — e é isso, não o FFMI, que explica por que o segundo ano rende metade do primeiro:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Ganho mensal esperado por tempo de treino</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Tempo de treino</th>
                    <th scope="col" className={th}>Por mês</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Para 80 kg</th>
                  </tr>
                </thead>
                <tbody>
                  {NIVEIS.map((n) => (
                    <tr key={n.id} className="border-b border-white/10">
                      <td className="text-gray-300 py-2.5 pr-4">
                        {n.nome}
                        <span className="block text-gray-500 text-xs mt-0.5">{n.descricao}</span>
                      </td>
                      <td className="text-gray-400 py-2.5 pr-4 tabular-nums align-top">{pct(n.taxa.min)} a {pct(n.taxa.max)}</td>
                      <td className="text-white py-2.5 font-medium tabular-nums align-top">
                        {formataKg(80 * n.taxa.min)} a {formataKg(80 * n.taxa.max)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">{NOTA_TEMPO_OTIMISTA}</p>
            <p className="text-gray-400 text-sm">{NOTA_TAXAS_OTIMISTAS}</p>
          </div>

          <p className="text-gray-300 leading-relaxed">Quer ver essa curva ano a ano, com o seu estágio e três cenários? Use o <Link href="/ferramentas/quanto-tempo-para-ter-shape" className="underline underline-offset-4 hover:text-white">simulador de quanto tempo para ter shape</Link>.</p>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Um exemplo inteiro</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Um homem de 1,78 m, {formataKg(EX.pesoKg)} e {EX.gorduraPct}% de gordura tem{" "}
              <strong className="text-white">{formataKg(EX.massaMagra)}</strong> de massa magra, o que dá FFMI{" "}
              {formataFFMI(EX.ffmi)} bruto e <strong className="text-white">{formataFFMI(EX.ffmiNormalizado)}</strong>{" "}
              normalizado. Até a referência faltariam {formataKg(EX.faltaAteReferencia)} de massa magra, o que o
              levaria a cerca de {formataKg(EX.pesoNaReferencia)} mantendo os mesmos {EX.gorduraPct}%.
            </p>
            <p className="text-gray-300 leading-relaxed">
              No ritmo de quem treina há 1 a 3 anos, isso levaria de{" "}
              {EX.mesesAteReferencia ? formataMeses(EX.mesesAteReferencia.min) : "—"} a{" "}
              {EX.mesesAteReferencia ? formataMeses(EX.mesesAteReferencia.max) : "—"} — e, como a taxa cai
              conforme ele avança, na prática levaria mais. É por isso que a ferramenta chama isso de piso, não de
              previsão.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>E as mulheres?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              O estudo de 1995 é masculino, e repetir o número 25 para mulheres seria erro grosseiro. A
              referência feminina vem de outra literatura: {FONTE_FFMI_MULHERES.rotuloCurto}{" "}
              {FONTE_FFMI_MULHERES.resumo}
            </p>
            <p className="text-gray-300 leading-relaxed">
              Por isso a calculadora usa {REFERENCIA_FFMI.mulher} como referência feminina e diz que a base é
              diferente. Fingir simetria entre as duas seria dar à referência feminina uma solidez que ela ainda
              não tem.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>A entrada mais frágil</h2>
            <p className="text-gray-300 leading-relaxed mb-4">{NOTA_GORDURA_ESTIMADA}</p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Um exemplo do tamanho do problema: o mesmo homem de 1,78 m e 75 kg tem FFMI normalizado{" "}
              {formataFFMI(calcula(1.78, 75, 12, "homem", "intermediario").ffmiNormalizado)} se a gordura for 12%
              e {formataFFMI(calcula(1.78, 75, 20, "homem", "intermediario").ffmiNormalizado)} se for 20%. A
              diferença entre esses dois números é maior que a diferença entre dois anos de treino bem feito.
            </p>
            <p className="text-gray-300 leading-relaxed">{NOTA_GORDURA_ALTA}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-potencial" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_POTENCIAL.map((f) => (
                <li key={f.rotulo}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              Revisado em 22 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>,
              personal trainer em Alphaville. Referência de planejamento de treino, não avaliação física
              individual.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/hipertrofia-natural-limite" className={ln}>Existe limite para a hipertrofia natural?</Link></li>
              <li><Link href="/blog/quanto-tempo-para-ganhar-massa-muscular" className={ln}>Quanto tempo leva para ganhar massa muscular</Link></li>
              <li><Link href="/blog/como-ganhar-massa-muscular" className={ln}>Como ganhar massa muscular</Link></li>
              <li><Link href="/ferramentas/calculadora-volume-treino" className={ln}>Calculadora de Volume de Treino</Link></li>
              <li><Link href="/ferramentas/calculadora-de-proteina" className={ln}>Calculadora de Proteína</Link></li>
              <li><Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>Calculadora de TMB e TDEE</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
