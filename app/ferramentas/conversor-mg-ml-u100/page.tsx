import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { CONTEUDO_ATUALIZADO_EM, CONVERSOR_NO_AR, REVISAO_AUTOR, REVISAO_TECNICA } from "@/lib/concentracao/revisao";
import ConversorConcentracao from "@/components/concentracao/ConversorConcentracao";
import MetodologiaEFontes from "@/components/concentracao/MetodologiaEFontes";
import CTAEstrategiaTreino from "@/components/concentracao/CTAEstrategiaTreino";
import Compartilhar from "@/components/share/Compartilhar";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";

/**
 * Conversor de mg/mL e Seringa U-100 — a página.
 *
 * A dúvida que ela resolve: "tenho um frasco com tantos mg e tanto volume;
 * o que significa cada marca da seringa?". A resposta é uma explicação de
 * concentração e volume — e a página é construída para que NUNCA vire um
 * calculador de dose. O que ela não faz está escrito no HTML, com fonte.
 *
 * Publicação chaveada pela revisão técnica (lib/concentracao/revisao.ts):
 * até um profissional habilitado revisar e a data ser registrada, a página
 * abre pela URL para revisão, mas com noindex, fora do sitemap e sem card.
 *
 * Schema: BreadcrumbList, SoftwareApplication e FAQPage — os três descrevem
 * o que a página realmente é. Nada de aggregateRating, que seria nota
 * inventada.
 */
export const metadata: Metadata = {
  title: "Calculadora de Peptídeos: Converta a Dose em mL e UI",
  description:
    "Converta a dose prescrita em mg para mL e para as marcas da seringa U-100. Calcule a concentração do frasco em mg/mL e veja quanto cada marca representa. Gratuita, educacional, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/ferramentas/conversor-mg-ml-u100` },
  robots: CONVERSOR_NO_AR ? undefined : { index: false, follow: false },
  openGraph: {
    title: "Calculadora de Peptídeos e UI na Seringa U-100 | Montinho",
    description:
      "mg, mL e U-100 sem confusão: calcule a concentração e entenda quanto volume representa cada marca da seringa. Educacional, sem cadastro.",
    url: `${SITE_URL}/ferramentas/conversor-mg-ml-u100`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Peptídeos e UI na Seringa U-100", item: `${SITE_URL}/ferramentas/conversor-mg-ml-u100` },
  ],
};

/*
 * SoftwareApplication descreve o que a página é: uma calculadora que roda no
 * navegador, de graça. Sem aggregateRating — não há avaliação real, e nota
 * inventada é justamente o tipo de enfeite que derruba a página inteira.
 */
const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Calculadora de Peptídeos e UI na Seringa U-100",
  url: `${SITE_URL}/ferramentas/conversor-mg-ml-u100`,
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  description:
    "Calculadora educacional de concentração: converte os mg e o volume do frasco em mg/mL e mostra quanto volume e quanta substância representa cada marca de uma seringa U-100.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  isAccessibleForFree: true,
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
/*
 * As perguntas passam pelo acordeão único do site (components/ui/FAQ.tsx):
 * details/summary, resposta sempre no HTML, medição de abertura. Antes elas
 * eram H2 com dois parágrafos cada — corretas, mas fora do padrão da casa e
 * longas demais para quem chegou confuso. Uma resposta, um parágrafo.
 */
const faq: ItemFAQ[] = [
  {
    question: "Qual a diferença entre mg e mL?",
    answer:
      "mg é a substância; mL é o líquido. Um frasco pode ter 60 mg de substância dissolvidos em 2,5 mL de líquido — dois números sobre o mesmo frasco, medindo coisas diferentes. A confusão aparece porque a seringa mede líquido, e o rótulo fala em substância.",
  },
  {
    question: "O que significa mg/mL?",
    answer:
      "É quanta substância tem em cada mL de líquido. Você acha esse número dividindo a quantidade total pelo volume do frasco: 60 mg em 2,5 mL dá 24 mg/mL, ou seja, cada mL tem 24 mg. O volume da conta é o do frasco já pronto, não só o líquido que foi acrescentado.",
  },
  {
    question: "O que significa U-100?",
    answer:
      "É o nome da escala da seringa de insulina, em que 100 unidades cabem em 1 mL. Na prática, numa seringa dessas a marca 100 é 1 mL cheio e a marca 10 é 0,10 mL. Os números dessa escala só valem como unidades quando o líquido é insulina U-100.",
  },
  {
    question: "Quanto é a marca 10 de uma seringa U-100?",
    answer:
      "0,10 mL. A conta é dividir a marca por 100: marca 5 é 0,05 mL, marca 20 é 0,20 mL, marca 50 é 0,50 mL. Quanta substância tem nesse volume depende do frasco — a 24 mg/mL, 0,10 mL tem 2,4 mg; a 10 mg/mL, o mesmo volume tem 1 mg.",
  },
  {
    question: "UI e a marca da seringa são a mesma coisa?",
    answer:
      "Nem sempre. A marca mede volume, sempre. Ela só vira “unidade” quando o líquido é insulina U-100, porque foi para isso que a escala nasceu. Com outro composto dentro, a marca 10 continua sendo 0,10 mL e isso não significa que o outro composto possua 10 unidades internacionais — UI não tem conversão fixa para mg, muda de substância para substância.",
  },
  {
    question: "Por que erros de concentração acontecem?",
    answer:
      "Porque três números diferentes andam juntos e parecem iguais: os mg do rótulo, os mL da seringa e as “unidades” da escala. Em 2024 a FDA alertou sobre pessoas que usaram de 5 a 20 vezes a quantidade pretendida de injetáveis manipulados por errar essa leitura. Um zero a mais na marca é dez vezes mais volume — por isso vale conferir duas vezes e, na dúvida, falar com quem prescreveu.",
  },
  {
    question: "Como sei quantos mL é a dose que me passaram?",
    answer:
      "Divide a quantidade prescrita pela concentração do seu frasco. Se a prescrição fala em 2,4 mg e o frasco tem 24 mg/mL, isso dá 0,10 mL — que numa seringa U-100 é a marca 10. Se o resultado não cair numa marca inteira, não arredonde por conta própria: mostre a conta a quem prescreveu.",
  },
  {
    question: "Qual dose devo tomar?",
    answer:
      "Esta página não responde isso, e nenhuma página deveria. A quantidade depende do seu diagnóstico, do seu histórico, do que mais você usa e do produto específico do seu frasco — quem define é o profissional que prescreve, com o seu caso na frente. A calculadora entra só depois dessa decisão, para converter miligramas em mililitros e em marcas de seringa.",
  },
  {
    question: "O que esta ferramenta não faz?",
    answer:
      "Ela não diz quanto você deve usar, não monta protocolo, não converte dose de insulina e não ensina a preparar nada. Ela começa depois que você já tem duas informações confiáveis: quanto o rótulo declara e qual o volume do frasco. Se faltar uma delas, a resposta certa é perguntar a quem prescreveu ou preparou.",
  },
];

/*
 * FAQPage agora existe porque as perguntas viraram um FAQ de verdade: sete
 * perguntas em details/summary, resposta inteira no HTML, uma pergunta por
 * resposta. Marcar como FAQ o que já é FAQ é descrição, não enfeite — foi o
 * contrário disso que me fez deixar de fora na primeira versão, quando as
 * perguntas eram seções corridas de conteúdo.
 */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const dataBr = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

export default function ConversorMgMlU100Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {!CONVERSOR_NO_AR && (
        <div className="bg-[#BA9E50] text-black text-sm font-semibold text-center px-4 py-2">
          Em revisão técnica — esta página ainda não foi publicada nem indexada.
        </div>
      )}

      <section className="py-12 sm:py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Educacional · gratuito · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Peptídeos: Converta a Dose em mL e UI
          </h1>
          <Compartilhar
            contexto="tool"
            titulo="Calculadora de Peptídeos e UI na Seringa U-100"
            caminho="/ferramentas/conversor-mg-ml-u100"
            local="tool_top"
            ferramenta="conversor_mg_ml_u100"
            gancho="Confuso com mg, mL e a escala U-100? Essa ferramenta explica a diferença de forma visual."
            aparencia="discreto"
            className="mb-5"
          />
          <p className="text-gray-300 text-lg leading-relaxed">
            Já tem a dose que o profissional prescreveu, em mg? Veja quantos mL ela dá e em que marca da seringa U-100 ela cai. A calculadora converte a conta; ela não escolhe a dose.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ConversorConcentracao placement="pagina-ferramenta" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/*
            O conteúdo existe por uma razão só: a calculadora responde com um
            número, e quem chegou confuso precisa de uma frase para pendurar o
            número. Cada H2 é uma pergunta que as pessoas digitam com essas
            palavras — não é texto para encher página.
          */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calcular a concentração do seu frasco</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Dois números do rótulo respondem tudo: quanta substância vem no frasco, em miligramas, e quanto líquido existe no frasco já pronto, em mililitros. A concentração é a divisão de um pelo outro. Um frasco de 60 mg em 2,5 mL tem 24 mg/mL — quer dizer que cada mL ali dentro carrega 24 mg.
            </p>
            <p className="text-gray-300 leading-relaxed">
              O erro mais comum nessa conta é usar o volume do diluente em vez do volume final da solução. O que vale é o volume que existe no frasco depois de pronto, porque é esse líquido que a seringa vai puxar. Se o rótulo não traz os dois números, não há concentração a calcular — e a resposta certa é perguntar a quem preparou, não estimar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto é cada marca da seringa U-100</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Numa seringa U-100 de 1 mL, a marca 100 é 1,00 mL cheio. Então cada marquinha vale 0,01 mL: a marca 5 é 0,05 mL, a marca 10 é 0,10 mL, a marca 50 é meio mililitro. Essa parte não depende do que está dentro do frasco — é a régua física do dispositivo, e vale igual para qualquer líquido.
            </p>
            <p className="text-gray-300 leading-relaxed">
              O que muda com o frasco é quanta substância existe naquele volume. A 24 mg/mL, a marca 10 contém 2,4 mg. A 10 mg/mL, a mesma marca 10 contém 1 mg. Mesma marca, mesmo volume, quantidades diferentes — é por isso que copiar a marca que outra pessoa usa não faz sentido: o frasco dela pode não ter a mesma concentração que o seu.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calcular a dose prescrita em mL e em marcas da seringa</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Esse é o descompasso que gera a maior parte das dúvidas: o profissional fala em miligramas, e a seringa não tem miligrama nenhum escrito nela. A ponte entre os dois é a concentração do frasco. Divide-se a quantidade prescrita pela concentração e sai o volume; multiplica-se o volume por 100 e sai a marca da seringa U-100.
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              Num frasco de 24 mg/mL, 2,4 mg dão 0,10 mL, que é a marca 10. Já 2,5 mg dão 0,104 mL, e isso cai entre a marca 10 e a 11 — não existe marca 10,4 numa seringa. Quando a conta não fecha numa marca, a calculadora mostra isso em vez de arredondar: seringa não tem precisão de décimo de marca, e quem decide o que fazer com essa diferença é quem prescreveu.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Repare que a conta inteira depende da concentração do seu frasco. A mesma quantidade em mg cai numa marca diferente se o frasco for outro — por isso não existe tabela universal de “X mg é a marca Y”, e por isso copiar a marca que outra pessoa usa é perigoso.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Qual dose devo tomar? Por que esta página não responde</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Essa é a pergunta que mais chega, e a resposta honesta é que ela não tem resposta genérica. A quantidade depende de diagnóstico, histórico, outros medicamentos em uso, tolerância, resposta ao longo do tempo e do produto específico que está no seu frasco — informações que nenhuma página consegue ter sobre você. Qualquer site que devolva um número para essa pergunta está inventando, e a conta dele é indistinguível da de alguém que erra.
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              Esta calculadora não diz qual quantidade usar, não monta protocolo, não ensina a aumentar nada e não sugere ponto de partida. Ela entra depois: quando a decisão já foi tomada por quem podia tomá-la, e o que resta é a aritmética de transformar miligramas em mililitros e em marcas de seringa.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Se você não tem essa orientação, a ferramenta certa não é uma calculadora — é uma consulta. E se você tem, mas os números não parecem bater, a página tem um conferidor de instrução justamente para isso: ele aponta a inconsistência e manda você conferir com o prescritor, sem corrigir nada por conta própria.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>De mg para UI: por que não existe conversão fixa</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Essa é a pergunta que mais chega escrita como se tivesse resposta única, e não tem. UI significa unidade internacional, e é uma medida de atividade biológica, não de massa. Quantos miligramas equivalem a uma UI depende da substância: cada uma tem a própria equivalência, definida por padrão de referência, e não existe fator que sirva para todas.
            </p>
            <p className="text-gray-300 leading-relaxed">
              A confusão nasce porque a escala da seringa de insulina é numerada em unidades. Numa seringa dessas, os números só significam unidades quando o líquido é insulina U-100 — foi para isso que a escala nasceu. Com qualquer outro conteúdo, a marca 10 continua significando 0,10 mL de volume, e nada mais. Por isso esta página diz sempre “marca 10 da seringa”, nunca “10 UI”.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Serve para tirzepatida, semaglutida, retatrutida e outros injetáveis?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A aritmética é a mesma para qualquer substância, porque concentração é sempre massa dividida por volume. Você pode escolher o nome do composto na calculadora se quiser ver o resultado nomeado, mas isso é só rótulo: nenhum valor é preenchido por você e a conta não muda de um item para outro da lista.
            </p>
            <p className="text-gray-300 leading-relaxed">
              O que a calculadora não sabe, e nunca vai saber, é o seu caso. Ela não tem opinião sobre quantidade, frequência ou adequação — essas decisões pertencem a quem prescreveu, e é com essa pessoa que qualquer divergência deve ser conferida antes do uso.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Perguntas sobre mg, mL e a seringa</h2>
            <FAQ itens={faq} placement="conversor-mg-ml-u100" />
          </div>

          <MetodologiaEFontes placement="pagina-ferramenta" />

          <div className="border border-white/15 p-5 sm:p-6">
            <h2 className="text-xl font-bold text-white mb-3" style={h}>Revisão técnica e limitações</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              {REVISAO_AUTOR.revisadoEm && REVISAO_AUTOR.por
                ? `Conteúdo escrito e revisado por ${REVISAO_AUTOR.por} em ${dataBr(REVISAO_AUTOR.revisadoEm)}.`
                : `Conteúdo escrito por Montinho Personal Trainer, atualizado em ${dataBr(CONTEUDO_ATUALIZADO_EM)}.`}
            </p>
            {/*
              A ressalva fica no HTML enquanto não houver revisão clínica. Personal
              trainer não é profissional de saúde habilitado a validar terminologia
              de medicação — dizer isso é o que separa transparência de aval falso.
            */}
            <p className="text-gray-300 leading-relaxed mb-3">
              {REVISAO_TECNICA.revisadoEm && REVISAO_TECNICA.revisor
                ? `Terminologia, fórmulas, descrição da seringa e alertas revisados por ${REVISAO_TECNICA.revisor} em ${dataBr(REVISAO_TECNICA.revisadoEm)}.`
                : "Esta página ainda não passou por revisão de farmacêutico ou médico. As três fórmulas são aritmética verificável, e você pode conferir cada uma na seção de metodologia — mas, diante de qualquer dúvida sobre o seu caso, quem responde é o profissional que prescreveu ou preparou o produto."}
            </p>
            <p className="text-gray-300 leading-relaxed">
              A visualização representa a escala nominal de uma seringa U-100 de 1 mL e não substitui a inspeção das marcações impressas no dispositivo real. Seringas de 0,3 mL e 0,5 mL, e seringas com meia marca, têm graduações diferentes. Esta é uma ferramenta educacional de concentração e volume; não é aconselhamento médico nem farmacêutico.
            </p>
          </div>

          {/*
            O CTA fica AQUI: depois da calculadora, do conteúdo, do FAQ, das
            fontes e da ressalva de revisão. Entre a calculadora e os avisos
            de segurança ele pareceria a oferta de quem orienta sobre a
            substância — que é o contrário do que a página passou nove seções
            dizendo que não faz.
          */}
          <CTAEstrategiaTreino placement="pagina-ferramenta" />

          <p className="text-gray-400 text-sm leading-relaxed">
            Outras ferramentas gratuitas estão em{" "}
            <Link href="/ferramentas" className={ln}>/ferramentas</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
