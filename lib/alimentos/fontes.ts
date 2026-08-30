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

export type IdFonte = "TACO" | "USDA" | "TBCA" | "ROTULO";

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
    edicao: "4ª edição revisada e ampliada (2011)",
    url: "https://www.nepa.unicamp.br/taco/tabela.php",
    licenca:
      "A publicação informa ser permitida a reprodução parcial ou total desde que citada a fonte. Uso condicionado à atribuição, não domínio público.",
    podePublicar: true,
    exigeAtribuicao: true,
    podeTransformar: true,
    verificadoEm: "",
    pendencia:
      "Conferir os termos na página oficial e baixar o arquivo original (PDF/planilha da 4ª ed.) para dentro de data/alimentos/bruto/. Esta sessão não teve acesso de rede à nepa.unicamp.br.",
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
  return f.podePublicar && f.verificadoEm !== "";
}

/** As fontes que hoje travam a publicação, e por quê. */
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
