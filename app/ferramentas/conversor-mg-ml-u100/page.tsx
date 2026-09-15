import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { CONTEUDO_ATUALIZADO_EM, CONVERSOR_NO_AR, REVISAO_AUTOR, REVISAO_TECNICA } from "@/lib/concentracao/revisao";
import ConversorConcentracao from "@/components/concentracao/ConversorConcentracao";
import MetodologiaEFontes from "@/components/concentracao/MetodologiaEFontes";
import Compartilhar from "@/components/share/Compartilhar";

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
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Qual a diferença entre mg e mL?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">mg</strong> mede massa: quanto da substância existe. <strong className="text-white">mL</strong> mede volume: quanto líquido existe. Um frasco pode ter 60 mg de substância dissolvidos em 2,5 mL de líquido, e os dois números descrevem coisas diferentes do mesmo frasco.
            </p>
            <p className="text-gray-300 leading-relaxed">
              A confusão nasce porque a seringa mede volume, e o rótulo fala em massa. Sem o número que liga os dois, a concentração, não há como saber quanto de substância há em cada mL.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O que significa mg/mL?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              É a concentração: quantos miligramas existem em cada mililitro. Ela sai da divisão da quantidade total pelo volume final. No exemplo educacional da ferramenta, 60 mg em um volume final de 2,5 mL dão 24 mg/mL, ou seja, cada 1 mL contém matematicamente 24 mg.
            </p>
            <p className="text-gray-300 leading-relaxed">
              O volume que entra na conta é o volume final da solução, não necessariamente o volume de diluente que foi adicionado. Quando isso não está claro no rótulo ou na preparação, a concentração não pode ser determinada com confiança, e a ferramenta não adivinha.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O que significa U-100?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              U-100 identifica uma concentração de 100 unidades de insulina por mL para produtos de insulina U-100, e a escala correspondente de seringas destinadas a esse uso. Fisicamente, numa seringa U-100 de 1 mL, a marca 100 corresponde a 1,00 mL, e a marca 10 corresponde a 0,10 mL.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Isso não transforma outro composto em “10 UI”. A escala continua marcando volume; as unidades da graduação são unidades de insulina U-100, e valem como unidades só para insulina U-100.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto representa a marca 10 de uma U-100?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              0,10 mL, pela regra da escala: marca ÷ 100. A marca 5 é 0,05 mL, a 20 é 0,20 mL, a 50 é 0,50 mL. Quanto de substância há nesse volume depende da concentração: a 24 mg/mL, 0,10 mL contêm 2,4 mg; a 10 mg/mL, o mesmo volume contém 1 mg.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Por isso a mesma marca da seringa pode significar quantidades muito diferentes em frascos diferentes. A marca é uma medida de volume, sempre; a quantidade é a marca vezes a concentração.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>UI e a marca da seringa são a mesma coisa?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Nem sempre. Em uma seringa U-100, a escala foi projetada para doses de insulina U-100. Para outro líquido, uma marca continua correspondendo a um volume físico, mas não transforma a quantidade do outro composto em unidades internacionais.
            </p>
            <p className="text-gray-300 leading-relaxed">
              UI farmacológica não possui conversão universal para mg: essa conversão depende da substância específica. É por isso que esta ferramenta fala em “marca 10 da seringa U-100”, e não em “10 UI” do que está no frasco, e por isso ela não converte UI em mg nem mg em UI.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Por que erros de concentração acontecem?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Porque três números diferentes circulam com a mesma cara: a quantidade em mg do rótulo, o volume em mL da seringa e as “unidades” da escala. Em 2024 a FDA alertou sobre pessoas que administraram cerca de 5 a 20 vezes a quantidade pretendida de injetáveis manipulados, por medirem o volume errado ou confundirem unidades com mL e mg.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Um zero a mais na marca é dez vezes mais volume. A prevenção é ler a concentração do frasco, ler a marca da seringa duas vezes e, diante de qualquer divergência entre o que foi orientado e o que a conta mostra, confirmar com o prescritor ou farmacêutico antes de usar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O que esta ferramenta não faz</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Ela não escolhe nem recomenda quantidade, dose, frequência ou protocolo. Não converte doses de insulina entre concentrações ou dispositivos. Não ensina reconstituição, técnica de aplicação nem armazenamento. Não reconhece produtos pelo nome nem oferece valores prontos por substância.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Ela começa depois que você já tem duas informações confiáveis do rótulo ou do profissional que orientou: a quantidade total declarada e o volume final. Se uma das duas falta, a resposta correta é perguntar a quem prescreveu ou preparou, não estimar.
            </p>
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
