/**
 * A auditoria de licenças das bases nutricionais — como código, não como
 * documento solto.
 *
 * Um arquivo de texto dizendo "a TBCA não pode" é uma promessa. Aqui a
 * proibição é executável: `podePublicar` é falso para a TBCA, o teste de
 * proveniência reprova qualquer alimento cuja fonte não possa ser publicada,
 * e o build quebra antes de o dado chegar ao ar. A diferença importa porque
 * quem for expandir a base daqui a seis meses não vai ler o documento.
 *
 * REGRA CENTRAL: estar disponível na internet não é licença. Cada base aqui
 * tem termo próprio, e três delas têm termos diferentes entre si.
 *
 * ⚠️ VERIFICAÇÃO PENDENTE. Esta sessão roda numa rede que bloqueia saída
 * para fora de uma lista curta (npm, PyPI e afins): nepa.unicamp.br,
 * fdc.nal.usda.gov e api.nal.usda.gov responderam 403 no proxy. Portanto os
 * termos abaixo estão registrados a partir do que é publicamente conhecido
 * sobre cada base, e o campo `verificadoEm` de cada uma está vazio de
 * propósito. Nenhuma base entra em produção com `verificadoEm` vazio — ver
 * `podeEntrarEmProducao()` no fim do arquivo.
 */

export type IdFonte = "TACO" | "USDA" | "TBCA" | "IBGE_POF" | "ROTULO";

export interface FonteNutricional {
  id: IdFonte;
  /** Como a fonte precisa ser citada, ao pé da letra, na interface. */
  atribuicao: string;
  nomeCompleto: string;
  instituicao: string;
  edicao: string;
  url: string;
  /**
   * O termo, na forma em que ele restringe ou libera. Escrito para ser lido
   * por uma pessoa que precise decidir, não para constar.
   */
  licenca: string;
  /** Pode ser reproduzida neste site, que é comercial? */
  podePublicar: boolean;
  /** Exige citar a fonte junto do dado? */
  exigeAtribuicao: boolean;
  /** Pode ser transformada (normalizada, reescalada, reagrupada)? */
  podeTransformar: boolean;
  /**
   * Quando os termos foram conferidos na página oficial, por uma pessoa ou
   * por uma sessão com acesso à rede. Vazio = não conferido = não publica.
   */
  verificadoEm: string;
  /** Como a fonte levantou os dados, quando isso importa para o leitor. */
  metodologia?: string;
  /**
   * Decisão do responsável pelo site, para quando a fonte é SILENTE.
   *
   * Existe porque nem toda publicação diz o que pode ser feito com ela. A
   * TACO diz ("é permitida a reprodução... desde que citada a fonte"); a POF
   * do IBGE não diz nada — nem autoriza nem proíbe, só afirma o copyright.
   *
   * Diante do silêncio, alguém decide. Este campo faz essa decisão aparecer
   * com nome e data, em vez de virar um `verificadoEm` preenchido como se
   * uma conferência tivesse acontecido. Os dois estados são diferentes e
   * continuam diferentes no código e na tela.
   *
   * NÃO é um atalho para contornar proibição: `podePublicar` continua sendo
   * verificado antes, e uma fonte que veda o uso — como a TBCA — não é
   * destravada por decisão nenhuma. O responsável decide sobre silêncio,
   * nunca sobre "não".
   */
  decisaoDoResponsavel?: { em: string; nota: string };
  /** O que precisa acontecer antes desta fonte poder ser usada. */
  pendencia?: string;
}

export const FONTES: Record<IdFonte, FonteNutricional> = {
  /**
   * A base brasileira principal.
   *
   * A publicação da TACO declara que a reprodução total ou parcial é
   * permitida desde que citada a fonte. É o que autoriza este projeto: não
   * é domínio público, é permissão condicionada à atribuição — e a condição
   * é cumprida mostrando a linha de fonte em todo alimento, não só numa
   * página de créditos escondida.
   */
  TACO: {
    id: "TACO",
    atribuicao: "Tabela Brasileira de Composição de Alimentos — TACO, NEPA/UNICAMP",
    nomeCompleto: "Tabela Brasileira de Composição de Alimentos (TACO)",
    instituicao: "NEPA — Núcleo de Estudos e Pesquisas em Alimentação / UNICAMP",
    edicao: "4ª edição revisada e ampliada — Campinas: NEPA-UNICAMP, 2011",
    url: "https://www.unicamp.br/nepa/taco",
    /**
     * Conferida na publicação oficial em 30/08/2026, na página de créditos do
     * PDF da 4ª edição.
     *
     * A frase está reproduzida ao pé da letra, e não parafraseada. Uma
     * paráfrase é o tipo de coisa que muda de sentido quando alguém a
     * reescreve daqui a um ano — e é justamente esta frase que autoriza o
     * projeto inteiro a existir.
     */
    licenca:
      "\u00a92011. Núcleo de Estudos e Pesquisas em Alimentação – NEPA, Universidade Estadual de Campinas – UNICAMP. No original: \u201cÉ permitida a reprodução parcial ou total desta obra, desde que citada a fonte.\u201d Uso condicionado à atribuição, não domínio público.",
    podePublicar: true,
    exigeAtribuicao: true,
    podeTransformar: true,
    verificadoEm: "2026-08-30",
  },

  /**
   * A fonte complementar, para o que a base brasileira não cobre bem.
   *
   * Obra do governo dos EUA: domínio público. É a licença mais folgada das
   * três, e ainda assim a atribuição fica — não por obrigação legal, mas
   * porque o leitor precisa saber que aquele número veio de fora e pode não
   * representar o alimento como ele chega ao prato brasileiro.
   */
  USDA: {
    id: "USDA",
    atribuicao: "USDA FoodData Central",
    nomeCompleto: "FoodData Central",
    instituicao: "U.S. Department of Agriculture, Agricultural Research Service",
    edicao: "Foundation Foods / SR Legacy / FNDDS",
    url: "https://fdc.nal.usda.gov/",
    licenca:
      "Dados do governo dos EUA, disponibilizados em domínio público (CC0). Uso comercial, transformação e redistribuição permitidos. Atribuição mantida por transparência, não por exigência.",
    podePublicar: true,
    exigeAtribuicao: false,
    podeTransformar: true,
    verificadoEm: "",
    pendencia:
      "Obter chave da API oficial (api.nal.usda.gov) e rodar o pipeline. Esta sessão não teve acesso de rede ao FoodData Central.",
  },

  /**
   * A base que NÃO entra.
   *
   * A TBCA (USP/FoRC) tem dados excelentes e brasileiros — e é justamente
   * por isso que ela é a tentação perigosa deste projeto. Os termos dela
   * restringem reprodução, alteração e uso comercial, e orientam contato com
   * a coordenação. Este site é comercial. Sem autorização escrita, a TBCA
   * fica fora, e `podePublicar: false` faz o teste de proveniência reprovar
   * qualquer alimento que tente entrar por ela.
   *
   * Ela permanece registrada aqui, em vez de apagada, para que a decisão
   * apareça para quem for expandir a base — um nome ausente não ensina nada.
   */
  TBCA: {
    id: "TBCA",
    atribuicao: "Tabela Brasileira de Composição de Alimentos — TBCA, USP/FoRC",
    nomeCompleto: "Tabela Brasileira de Composição de Alimentos (TBCA)",
    instituicao: "Universidade de São Paulo / Food Research Center (FoRC)",
    edicao: "—",
    url: "https://www.tbca.net.br/",
    licenca:
      "A TBCA declara restrições de reprodução, alteração e uso comercial, orientando contato prévio com a coordenação. Este site é comercial: sem autorização expressa, a base NÃO pode ser importada, espelhada nem transformada.",
    podePublicar: false,
    exigeAtribuicao: true,
    podeTransformar: false,
    verificadoEm: "",
    pendencia:
      "Bloqueada por licença. Só muda com autorização escrita da coordenação da TBCA. Não importar enquanto isso.",
  },

  /**
   * As medidas caseiras.
   *
   * A TACO diz o que tem em 100 g e não diz o que é 100 g de comida. Quem
   * não tem balança precisa da ponte entre as duas coisas — "1 concha", "1
   * filé médio" —, e essa ponte não pode ser chutada: uma concha não tem
   * peso universal, e um número inventado aqui produz erro que a pessoa não
   * tem como perceber.
   *
   * A POF do IBGE resolve isso com autoridade: as medidas vêm do que a
   * população brasileira efetivamente relatou consumir numa pesquisa
   * nacional, não da estimativa de quem escreveu o site.
   */
  IBGE_POF: {
    id: "IBGE_POF",
    atribuicao: "Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil — POF 2008-2009, IBGE",
    nomeCompleto: "Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil",
    instituicao: "IBGE — Instituto Brasileiro de Geografia e Estatística",
    edicao: "Pesquisa de Orçamentos Familiares 2008-2009 — IBGE, 2011",
    url: "https://biblioteca.ibge.gov.br/",
    /**
     * Como as medidas foram levantadas, na palavra do próprio IBGE
     * (apresentação da publicação, conferida no CD-ROM oficial).
     *
     * Vale citar porque explica por que estes pesos valem mais que a
     * estimativa de quem escreve um site: não são chute de redator, são
     * consumo relatado por milhares de domicílios, cruzado com pesagem
     * direta em universidade.
     */
    metodologia:
      "Compilada a partir do que os informantes relataram consumir, em domicílio e fora dele, nas áreas urbana e rural de todo o País, cruzada com publicações técnico-científicas, rótulos de alimentos e pesagens diretas realizadas em centros de pesquisa de universidades brasileiras. Realizada em parceria com o Ministério da Saúde.",
    licenca:
      "Publicação oficial do IBGE, de acesso livre. Os termos de uso e a exigência de citação PRECISAM ser conferidos na página da publicação antes de qualquer dado ir ao ar — o mesmo procedimento aplicado à TACO.",
    podePublicar: true,
    exigeAtribuicao: true,
    podeTransformar: true,
    verificadoEm: "",
    decisaoDoResponsavel: {
      em: "2026-08-30",
      nota:
        "Os termos de reprodução não constam da publicação nem dos Termos de Uso do Portal do IBGE, que tratam de dados pessoais e não de reuso de conteúdo. Procuramos na página de créditos do volume (traz apenas \u201c© IBGE. 2011\u201d), na apresentação e nas convenções do CD-ROM oficial. Diante do silêncio da fonte, o responsável pelo site decidiu usar as medidas com atribuição integral ao IBGE, incluindo o código do alimento na pesquisa e a preparação a que cada peso se refere.",
    },
  },

  /**
   * Rótulo de fabricante.
   *
   * Não é base de composição: é o que a embalagem de um produto específico
   * declara. Serve para alimentos que não existem em tabela (whey, tapioca
   * pronta, bebida vegetal) e carrega a ressalva no próprio nome, porque
   * "iogurte proteico tem 15 g" é falso — a marca é que tem.
   */
  ROTULO: {
    id: "ROTULO",
    atribuicao: "Rótulo do fabricante — varia por marca",
    nomeCompleto: "Informação nutricional declarada em rótulo",
    instituicao: "Fabricante do produto",
    edicao: "—",
    url: "",
    licenca:
      "Informação factual declarada em embalagem. Usada apenas quando o alimento não existe em base oficial, sempre com o produto identificado e a data de verificação.",
    podePublicar: true,
    exigeAtribuicao: true,
    podeTransformar: false,
    verificadoEm: "",
    pendencia:
      "Cada alimento de rótulo precisa nomear o produto conferido e a data. Valor médio de categoria é proibido.",
  },
};

export const IDS_FONTE = Object.keys(FONTES) as IdFonte[];

/**
 * A trava. Uma fonte só serve para publicar quando os termos foram conferidos
 * na origem E permitem publicação. As duas condições, não uma.
 *
 * Enquanto `verificadoEm` estiver vazio, a base pode ser desenvolvida e
 * testada, mas nenhum alimento dela vai ao ar — é o que impede este projeto
 * de publicar dado sob licença presumida.
 */
export function podeEntrarEmProducao(id: IdFonte): boolean {
  const f = FONTES[id];
  /*
   * A ordem importa: `podePublicar` vem primeiro e não é negociável. Fonte
   * que veda o uso continua vedada por decisão nenhuma — o responsável pode
   * decidir diante do silêncio da fonte, nunca contra o que ela diz.
   */
  if (!f.podePublicar) return false;
  return f.verificadoEm !== "" || f.decisaoDoResponsavel !== undefined;
}

/** As fontes que hoje travam a publicação, e por quê. */
/** Fontes que publicam por decisão do responsável, e não por conferência. */
export function porDecisaoDoResponsavel(): IdFonte[] {
  return IDS_FONTE.filter(
    (id) => podeEntrarEmProducao(id) && FONTES[id].verificadoEm === "" && FONTES[id].decisaoDoResponsavel,
  );
}

export function pendenciasDeLicenca(): { id: IdFonte; motivo: string }[] {
  return IDS_FONTE.filter((id) => !podeEntrarEmProducao(id)).map((id) => ({
    id,
    motivo: FONTES[id].pendencia ?? "Licença não permite publicação neste site.",
  }));
}

/**
 * O aviso de variabilidade, obrigatório em toda página de alimento.
 *
 * Não é letra miúda defensiva: é a diferença entre apresentar um número como
 * medida do prato da pessoa e apresentá-lo como o que ele é — a média de uma
 * análise laboratorial de amostras que não são as dela.
 */
export const AVISO_VARIACAO =
  "A composição de alimentos varia com a variedade, a origem, o preparo, o teor de água e o método de análise. Os valores aqui são referências da base indicada, não medidas do alimento que está no seu prato.";

export const AVISO_NAO_SUBSTITUI =
  "Os dados são informativos e não substituem orientação nutricional individual.";
