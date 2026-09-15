import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { CONTEUDO_ATUALIZADO_EM, CONVERSOR_NO_AR, REVISAO_AUTOR, REVISAO_TECNICA } from "@/lib/concentracao/revisao";
import ConversorConcentracao from "@/components/concentracao/ConversorConcentracao";
import MetodologiaEFontes from "@/components/concentracao/MetodologiaEFontes";
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
 * Só BreadcrumbList no schema. Sem FAQPage: as perguntas abaixo são seções
 * de conteúdo, não um FAQ, e marcar como FAQ seria enfeite que envelhece mal.
 */
export const metadata: Metadata = {
  title: "Conversor mg/mL e Seringa U-100: Entenda as Marcações",
  description:
    "Entenda a diferença entre mg, mL e as marcações de uma seringa U-100. Calcule a concentração em mg/mL e veja quanto volume representa cada marca da escala.",
  alternates: { canonical: `${SITE_URL}/ferramentas/conversor-mg-ml-u100` },
  robots: CONVERSOR_NO_AR ? undefined : { index: false, follow: false },
  openGraph: {
    title: "Conversor mg/mL e Seringa U-100 | Montinho",
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
    { "@type": "ListItem", position: 3, name: "Conversor de mg/mL e Seringa U-100", item: `${SITE_URL}/ferramentas/conversor-mg-ml-u100` },
  ],
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
    question: "O que esta ferramenta não faz?",
    answer:
      "Ela não diz quanto você deve usar, não monta protocolo, não converte dose de insulina e não ensina a preparar nada. Ela começa depois que você já tem duas informações confiáveis: quanto o rótulo declara e qual o volume do frasco. Se faltar uma delas, a resposta certa é perguntar a quem prescreveu ou preparou.",
  },
];

const dataBr = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

export default function ConversorMgMlU100Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
            Conversor de mg/mL e Seringa U-100
          </h1>
          <Compartilhar
            contexto="tool"
            titulo="Conversor de mg/mL e Seringa U-100"
            caminho="/ferramentas/conversor-mg-ml-u100"
            local="tool_top"
            ferramenta="conversor_mg_ml_u100"
            gancho="Confuso com mg, mL e a escala U-100? Essa ferramenta explica a diferença de forma visual."
            aparencia="discreto"
            className="mb-5"
          />
          <p className="text-gray-300 text-lg leading-relaxed">
            Entenda concentração, volume e o que representam as marcações de uma seringa U-100. A ferramenta explica a conta; ela não determina quanto usar.
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

          <p className="text-gray-400 text-sm leading-relaxed">
            Outras ferramentas gratuitas estão em{" "}
            <Link href="/ferramentas" className={ln}>/ferramentas</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
