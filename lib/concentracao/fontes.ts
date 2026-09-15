/**
 * As fontes que sustentam o que a ferramenta afirma.
 *
 * Só fonte primária ou de autoridade reconhecida em segurança de medicação:
 * agência reguladora (FDA, Anvisa), o ISMP e a norma técnica da seringa.
 * Nada de fórum, rede social, vendedor ou clínica comercial — esse tipo de
 * fonte é exatamente de onde vem a confusão que a ferramenta existe para
 * desfazer.
 *
 * Cada fonte diz QUAL afirmação da página ela sustenta. Fonte que não
 * sustenta nada é enfeite.
 *
 * SOBRE OS LINKS. As URLs dos documentos não puderam ser abertas do ambiente
 * em que este arquivo foi escrito — a rede bloqueia fda.gov, ismp.org e
 * gov.br. Órgão, título e ano são conhecidos e bastam para localizar cada
 * documento; o endereço exato, não.
 *
 * Numa página de saúde, link quebrado é pior do que citação sem link: ele
 * promete a fonte e entrega um 404, e quem foi conferir volta desconfiando
 * do resto. Então a regra aqui é: enquanto `urlConferida` for false, a
 * página cita o documento em texto e linka apenas o SITE DO ÓRGÃO, que não
 * sai do ar. Conferiu o endereço? Vire a chave e a citação vira link.
 */
export interface Fonte {
  id: string;
  orgao: string;
  titulo: string;
  ano: string;
  url: string;
  /** Site do órgão — estável, sempre linkável. */
  urlOrgao: string;
  /** O que, na página, depende desta fonte. */
  sustenta: string;
  /** O endereço exato do documento foi aberto e confirmado? */
  urlConferida: boolean;
}

/** O link que a página pode oferecer sem risco de 404. */
export const linkDaFonte = (f: Fonte) => (f.urlConferida ? f.url : f.urlOrgao);

export const FONTES: Fonte[] = [
  {
    id: "fda-semaglutida-2024",
    orgao: "FDA (U.S. Food and Drug Administration)",
    titulo: "FDA alerts health care providers, compounders and patients of dosing errors associated with compounded injectable semaglutide products",
    ano: "2024",
    url: "https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded-injectable-semaglutide-products",
    urlOrgao: "https://www.fda.gov/drugs/human-drug-compounding",
    sustenta: "A afirmação de que erros de medição entre unidades, mL e mg em injetáveis manipulados levaram pessoas a administrar 5 a 20 vezes a quantidade pretendida, e de que a confusão entre a escala da seringa e a quantidade do produto é uma causa documentada de erro.",
    urlConferida: false,
  },
  {
    id: "fda-rotulagem-concentracao",
    orgao: "FDA (U.S. Food and Drug Administration)",
    titulo: "Safety Considerations for Container Labels and Carton Labeling Design to Minimize Medication Errors — Guidance for Industry",
    ano: "2022",
    url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/safety-considerations-container-labels-and-carton-labeling-design-minimize-medication-errors",
    urlOrgao: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents",
    sustenta: "A orientação de que a força de um injetável deve ser lida como concentração (quantidade por mL) e quantidade total por frasco, e de que misturar essas duas expressões é fonte conhecida de erro.",
    urlConferida: false,
  },
  {
    id: "ismp-alto-risco",
    orgao: "ISMP (Institute for Safe Medication Practices)",
    titulo: "ISMP List of High-Alert Medications in Acute Care Settings",
    ano: "2024",
    url: "https://www.ismp.org/recommendations/high-alert-medications-acute-list",
    urlOrgao: "https://www.ismp.org/",
    sustenta: "A classificação da insulina (U-100 e concentrações maiores) como medicamento de alto risco, e a razão de esta ferramenta se recusar a converter doses de insulina entre concentrações e dispositivos.",
    urlConferida: false,
  },
  {
    id: "anvisa-protocolo-medicamentos",
    orgao: "Anvisa / Ministério da Saúde",
    titulo: "Protocolo de Segurança na Prescrição, Uso e Administração de Medicamentos (Protocolos Básicos de Segurança do Paciente)",
    ano: "2013",
    url: "https://www.gov.br/anvisa/pt-br/assuntos/servicosdesaude/seguranca-do-paciente/protocolos-basicos-de-seguranca-do-paciente",
    urlOrgao: "https://www.gov.br/anvisa/pt-br/assuntos/servicosdesaude/seguranca-do-paciente",
    sustenta: "A regra de conferir concentração, dose e via antes da administração, e de esclarecer qualquer divergência com o prescritor ou farmacêutico em vez de ajustar por conta própria.",
    urlConferida: false,
  },
  {
    id: "iso-8537",
    orgao: "ISO (International Organization for Standardization)",
    titulo: "ISO 8537 — Sterile single-use syringes, with or without needle, for insulin",
    ano: "2016",
    url: "https://www.iso.org/standard/59733.html",
    urlOrgao: "https://www.iso.org/",
    sustenta: "A definição da escala graduada da seringa de insulina: numa seringa U-100 de 1 mL, a graduação 100 corresponde a 1,00 mL, e as marcações representam volumes proporcionais.",
    urlConferida: false,
  },
];
