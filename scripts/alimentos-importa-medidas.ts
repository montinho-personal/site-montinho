/**
 * Importação das medidas caseiras da POF/IBGE.
 *   npx tsx scripts/alimentos-importa-medidas.ts
 *
 * Lê o CSV gerado de data/alimentos/bruto/ibge-pof-medidas-referidas.xls e
 * escreve data/alimentos/processado/medidas.json, ligando cada medida ao
 * alimento correspondente da TACO.
 *
 * O CASAMENTO É CURADO, E ISSO É DELIBERADO
 *
 * Casar 1.124 alimentos do IBGE com 597 da TACO por semelhança de texto
 * produziria pares plausíveis e errados — "castanha de caju" com "castanha
 * do Pará", "cenoura" com "cenoura amarela (batata baroa)", que é outra
 * planta. Um erro desses não aparece na tela: vira um peso convincente ao
 * lado do alimento errado, e a pessoa confia porque o site disse.
 *
 * Então o mapa abaixo é escrito à mão, com o código do IBGE anotado. Cobre
 * menos alimentos e não erra nenhum.
 *
 * O PREPARO É A PARTE PERIGOSA
 *
 * O IBGE dá medidas por preparação, e elas divergem muito: 1 unidade de peito
 * de frango CRU pesa 180 g; 1 filé COZIDO pesa 100 g. Ligar a preparação
 * errada erraria quase o dobro sem nenhum sinal de defeito. Por isso cada
 * entrada declara quais preparações aceita, e o importador recusa o resto.
 */

import { readFileSync, writeFileSync } from "node:fs";
import type { Porcao } from "../lib/alimentos/tipos";

const ENTRADA = "data/alimentos/bruto/ibge-pof-medidas-referidas.csv";
const SAIDA = "data/alimentos/processado/medidas.json";

const FONTE =
  "Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil — POF 2008-2009, IBGE";

interface Vinculo {
  /** Código do alimento na POF. Anotado para conferência contra a fonte. */
  codigo: string;
  /**
   * A descrição que esse código DEVE ter no arquivo do IBGE.
   *
   * Não é documentação: o importador compara com o arquivo e aborta se
   * divergir. Existe porque um código errado é invisível — durante o
   * desenvolvimento, 6802001 foi anotado como maçã e é LIMÃO. Sem esta
   * conferência, o site teria publicado "1 maçã = 84 g" com o peso de um
   * limão, citando o IBGE, e ninguém teria como perceber olhando a tela.
   */
  descricao: string;
  /**
   * Preparações aceitas, como o IBGE as escreve. "NAO SE APLICA" é o caso de
   * alimentos cuja medida independe do preparo — arroz e feijão, servidos
   * prontos.
   */
  preparacoes: string[];
}

/**
 * TACO → POF. Cada linha foi conferida lendo a descrição dos dois lados.
 *
 * Note as ausências deliberadas: a TACO tem seis tipos de arroz e a POF tem
 * um só ("ARROZ (POLIDO, PARBOILIZADO)"), então só o arroz tipo 1 e o
 * integral entram, cada um no seu código. Alimento sem par honesto fica de
 * fora e continua oferecendo gramas.
 */
const VINCULOS: Record<string, Vinculo> = {
  "arroz-tipo-1-cozido": { codigo: "6300101", descricao: "ARROZ (POLIDO, PARBOILIZADO)", preparacoes: ["NAO SE APLICA"] },
  "arroz-integral-cozido": { codigo: "6300201", descricao: "ARROZ INTEGRAL", preparacoes: ["NAO SE APLICA"] },
  "feijao-carioca-cozido": { codigo: "6303102", descricao: "FEIJAO (PRETO, MULATINHO, ROXO, ROSINHA, ETC)", preparacoes: ["NAO SE APLICA"] },
  "feijao-preto-cozido": { codigo: "6303102", descricao: "FEIJAO (PRETO, MULATINHO, ROXO, ROSINHA, ETC)", preparacoes: ["NAO SE APLICA"] },
  "lentilha-cozida": { codigo: "6302901", descricao: "LENTILHA", preparacoes: ["NAO SE APLICA"] },
  "grao-de-bico-cru": { codigo: "6302801", descricao: "GRAO DE BICO", preparacoes: ["NAO SE APLICA", "CRU(A)"] },

  "frango-peito-sem-pele-grelhado": {
    codigo: "7800401", descricao: "PEITO DE GALINHA OU FRANGO",
    preparacoes: ["GRELHADO(A)/BRASA/CHURRASCO", "CROZIDO(A)", "ASSADO(A)"],
  },
  "frango-peito-sem-pele-cru": { codigo: "7800401", descricao: "PEITO DE GALINHA OU FRANGO", preparacoes: ["CRU(A)"] },
  "carne-bovina-patinho-sem-gordura-grelhado": {
    codigo: "7100501", descricao: "PATINHO",
    preparacoes: ["GRELHADO(A)/BRASA/CHURRASCO", "CROZIDO(A)", "ASSADO(A)"],
  },
  "carne-bovina-acem-moido-cozido": { codigo: "7100801", descricao: "ACEM", preparacoes: ["CROZIDO(A)", "REFOGADO(A)"] },
  "ovo-de-galinha-inteiro-cozido-10minutos": { codigo: "7803301", descricao: "OVO DE GALINHA", preparacoes: ["CROZIDO(A)"] },
  "ovo-de-galinha-inteiro-cru": { codigo: "7803301", descricao: "OVO DE GALINHA", preparacoes: ["CRU(A)"] },
  "sardinha-conserva-em-oleo": { codigo: "7703002", descricao: "SARDINHA EM CONSERVA", preparacoes: ["NAO SE APLICA", "CRU(A)"] },
  "atum-conserva-em-oleo": { codigo: "7703402", descricao: "ATUM EM CONSERVA", preparacoes: ["NAO SE APLICA", "CRU(A)"] },

  "batata-inglesa-cozida": { codigo: "6400101", descricao: "BATATA INGLESA", preparacoes: ["CROZIDO(A)"] },
  "batata-doce-cozida": { codigo: "6400401", descricao: "BATATA DOCE", preparacoes: ["CROZIDO(A)"] },
  "mandioca-cozida": { codigo: "6400601", descricao: "MANDIOCA", preparacoes: ["CROZIDO(A)"] },
  "aveia-flocos-crua": { codigo: "6500401", descricao: "AVEIA EM FLOCOS", preparacoes: ["NAO SE APLICA", "CRU(A)"] },

  "cenoura-crua": { codigo: "6401201", descricao: "CENOURA", preparacoes: ["CRU(A)"] },
  "tomate-com-semente-cru": { codigo: "6705101", descricao: "TOMATE", preparacoes: ["CRU(A)", "NAO SE APLICA"] },
  "alface-crespa-crua": { codigo: "6700101", descricao: "ALFACE", preparacoes: ["CRU(A)", "NAO SE APLICA"] },
  "brocolis-cozido": { codigo: "6701704", descricao: "BROCOLIS", preparacoes: ["CROZIDO(A)", "REFOGADO(A)"] },

  "banana-prata-crua": { codigo: "6801101", descricao: "BANANA (OURO, PRATA, D´AGUA, DA TERRA, ETC)", preparacoes: ["CRU(A)", "NAO SE APLICA"] },
  "banana-nanica-crua": { codigo: "6801101", descricao: "BANANA (OURO, PRATA, D´AGUA, DA TERRA, ETC)", preparacoes: ["CRU(A)", "NAO SE APLICA"] },
  "mamao-formosa-cru": { codigo: "6803101", descricao: "MAMAO", preparacoes: ["CRU(A)", "NAO SE APLICA"] },
  "laranja-pera-crua": { codigo: "6801801", descricao: "LARANJA (PERA, SELETA, LIMA, DA TERRA, ETC)", preparacoes: ["CRU(A)", "NAO SE APLICA"] },
  "melancia-crua": { codigo: "6803401", descricao: "MELANCIA", preparacoes: ["CRU(A)", "NAO SE APLICA"] },
  "abacate-cru": { codigo: "6802701", descricao: "ABACATE", preparacoes: ["CRU(A)", "NAO SE APLICA"] },
  "maca-fuji-com-casca-crua": { codigo: "6803001", descricao: "MACA", preparacoes: ["CRU(A)", "NAO SE APLICA"] },

  /*
   * Pão francês e "pão de sal" são o mesmo pão com nomes regionais — como
   * cacetinho e pão d'água. O IBGE registra pelo nome que a maioria dos
   * informantes usou; a TACO, pelo outro.
   */
  "pao-trigo-frances": { codigo: "8000105", descricao: "PAO DE SAL", preparacoes: ["NAO SE APLICA"] },
  "macarrao-instantaneo": { codigo: "6504802", descricao: "MACARRAO INSTANTANEO", preparacoes: ["NAO SE APLICA", "CROZIDO(A)"] },
  /*
   * A TACO descreve a tapioca já com manteiga e o IBGE, a goma. Para o VALOR
   * nutricional isso importa e cada base fica com o seu; para o PESO de uma
   * tapioca não importa — a medida descreve o disco, não a receita.
   */
  "tapioca-com-manteiga": { codigo: "6501516", descricao: "TAPIOCA DE GOMA", preparacoes: ["NAO SE APLICA", "CROZIDO(A)"] },
  "queijo-minas-frescal": { codigo: "7902001", descricao: "QUEIJO DE MINAS", preparacoes: ["NAO SE APLICA"] },
  "queijo-mozarela": { codigo: "7901801", descricao: "QUEIJO MUZARELLA", preparacoes: ["NAO SE APLICA"] },
  /* Castanha-do-Brasil e castanha-do-Pará são a mesma castanha. */
  "castanha-do-brasil-crua": { codigo: "6600701", descricao: "CASTANHA DO PARA", preparacoes: ["NAO SE APLICA", "CRU(A)"] },

  "iogurte-natural": { codigo: "7901204", descricao: "IOGURTE NATURAL", preparacoes: ["NAO SE APLICA"] },
  "queijo-requeijao-cremoso": { codigo: "7902901", descricao: "REQUEIJAO", preparacoes: ["NAO SE APLICA"] },
  "azeite-de-oliva-extra-virgem": { codigo: "8400101", descricao: "AZEITE DE OLIVA", preparacoes: ["NAO SE APLICA"] },
  "amendoim-torrado-salgado": { codigo: "6301001", descricao: "AMENDOIM (EM GRAO) (IN NATURA)", preparacoes: ["NAO SE APLICA", "CRU(A)"] },
};

/**
 * Medidas que não são medidas caseiras.
 *
 * "GRAMA = 1 g" e "QUILO = 1000 g" são unidades de peso, e oferecê-las como
 * atalho seria oferecer à pessoa exatamente o que ela já não sabe estimar.
 * As colheres pequenas ficam de fora por outro motivo: ninguém serve arroz
 * com colher de café, e cada botão a mais na tela é uma decisão a mais.
 */
const MEDIDAS_IGNORADAS = new Set([
  "GRAMA", "QUILO", "MILILITRO", "LITRO",
  "COLHER DE CAFE", "COLHER DE CHA", "COLHER DE SOBREMESA",
]);

/**
 * A ordem de preferência das medidas na tela.
 *
 * Primeiro a que a pessoa usaria para AQUELE alimento — filé para carne,
 * concha para feijão, unidade para fruta. As genéricas ficam no fim, e o
 * limite de quatro existe porque uma fileira de dez botões deixa de ser
 * atalho e vira outra decisão.
 */
const PREFERENCIA = [
  "UNIDADE", "FILE", "BIFE", "FATIA", "CONCHA", "ESCUMADEIRA",
  "COLHER DE ARROZ/SERVIR", "COLHER DE SOPA", "PEDACO", "PORCAO",
  "XICARA DE CHA", "COPO AMERICANO", "PRATO RASO", "CANECA",
];
const MAX_POR_ALIMENTO = 4;

/** "COLHER DE SOPA" → "1 colher de sopa" */
function humaniza(medida: string): string {
  const m = medida.toLowerCase().replace(/\//g, " ou ");
  return `1 ${m}`;
}

// ─── execução ───────────────────────────────────────────────────────────────

const linhas = readFileSync(ENTRADA, "utf8").trim().split("\n");
const cabecalho = linhas[0].split(",");
const iCodigo = cabecalho.findIndex((c) => c.includes("CÓDIGO DO ALIMENTO"));
const iDesc = cabecalho.findIndex((c) => c.includes("DESCRIÇÃO DO ALIMENTO") && !c.includes("REFERÊNCIA"));
const iPrep = cabecalho.findIndex((c) => c.includes("DESCRIÇÃO DA PREPARAÇÃO"));
const iMedida = cabecalho.findIndex((c) => c.startsWith("DESCRIÇÃO DO TIPO DE MEDIDA") && !c.includes("PADRÃO"));
const iGramas = cabecalho.findIndex((c) => c.includes("GRAMAS"));
const iFonte = cabecalho.findIndex((c) => c.includes("FONTE DE REFERÊNCIA"));

/**
 * Leitor de CSV que respeita aspas.
 *
 * A versão ingênua — split(",") — perdeu 508 das 11.801 linhas, e perdeu
 * justamente as mais importantes: "ARROZ (POLIDO, PARBOILIZADO)", "FEIJAO
 * (PRETO, MULATINHO, ROXO, ROSINHA, ETC)", "BANANA (OURO, PRATA, D´AGUA, DA
 * TERRA, ETC)". A vírgula dentro do nome do alimento deslocava todas as
 * colunas da linha, e o peso passava a ser lido de outro campo.
 *
 * Aqui deu sorte de falhar em silêncio — arroz e feijão simplesmente ficaram
 * sem medida, em vez de ganhar a medida errada. Sorte não é garantia.
 */
function celulas(linha: string): string[] {
  const saida: string[] = [];
  let atual = "";
  let dentroDeAspas = false;
  for (let i = 0; i < linha.length; i++) {
    const c = linha[i];
    if (c === '"') {
      /* Aspas duplicadas dentro de campo citado representam uma aspa. */
      if (dentroDeAspas && linha[i + 1] === '"') { atual += '"'; i++; }
      else dentroDeAspas = !dentroDeAspas;
    } else if (c === "," && !dentroDeAspas) {
      saida.push(atual.trim());
      atual = "";
    } else {
      atual += c;
    }
  }
  saida.push(atual.trim());
  return saida;
}

interface Bruta { codigo: string; descricao: string; prep: string; medida: string; gramas: number; fonte: string }
const todas: Bruta[] = [];
for (const l of linhas.slice(1)) {
  const c = celulas(l);
  const gramas = Number(c[iGramas]);
  if (!Number.isFinite(gramas) || gramas <= 0) continue;
  todas.push({ codigo: c[iCodigo], descricao: c[iDesc], prep: c[iPrep], medida: c[iMedida], gramas, fonte: c[iFonte] });
}

/**
 * A conferência de código antes de qualquer importação.
 *
 * Se um código apontar para outro alimento, o processo para aqui — sem
 * escrever nada. Falhar cedo e alto é o único comportamento aceitável: o
 * dano de publicar o peso do alimento errado não é reversível pela pessoa
 * que lê.
 */
{
  const descricaoNoArquivo = new Map<string, string>();
  for (const m of todas) if (!descricaoNoArquivo.has(m.codigo)) descricaoNoArquivo.set(m.codigo, m.descricao);

  const divergentes: string[] = [];
  for (const [slug, v] of Object.entries(VINCULOS)) {
    const real = descricaoNoArquivo.get(v.codigo);
    if (real === undefined) divergentes.push(`${slug}: código ${v.codigo} não existe no arquivo`);
    else if (real !== v.descricao) divergentes.push(`${slug}: código ${v.codigo} é "${real}", não "${v.descricao}"`);
  }
  if (divergentes.length) {
    console.error("\nIMPORTAÇÃO ABORTADA — código do IBGE não confere com a descrição declarada:\n");
    for (const d of divergentes) console.error(`  ${d}`);
    console.error("");
    process.exit(1);
  }
}

const porAlimento: Record<string, Porcao[]> = {};
const relatorio: { slug: string; achadas: number; usadas: number; medidas: string }[] = [];
const semNada: string[] = [];

for (const [slug, v] of Object.entries(VINCULOS)) {
  const candidatas = todas.filter(
    (m) =>
      m.codigo === v.codigo &&
      v.preparacoes.includes(m.prep) &&
      !MEDIDAS_IGNORADAS.has(m.medida) &&
      m.gramas > 1 &&
      m.gramas < 1000,
  );

  /* Mesma medida em duas preparações aceitas: fica a primeira, sem duplicar. */
  const unicas = new Map<string, Bruta>();
  for (const m of candidatas) if (!unicas.has(m.medida)) unicas.set(m.medida, m);

  const ordenadas = [...unicas.values()].sort((a, b) => {
    const ia = PREFERENCIA.indexOf(a.medida);
    const ib = PREFERENCIA.indexOf(b.medida);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const escolhidas = ordenadas.slice(0, MAX_POR_ALIMENTO);
  if (escolhidas.length === 0) { semNada.push(`${slug} (código ${v.codigo})`); continue; }

  porAlimento[slug] = escolhidas.map((m) => ({
    nome: humaniza(m.medida),
    gramas: m.gramas,
    /* A proveniência carrega o código E a preparação: é o que permite achar
       a linha exata na publicação e conferir. */
    fonte: `${FONTE} — alimento ${v.codigo}, preparação "${m.prep}"`,
  }));

  relatorio.push({
    slug,
    achadas: candidatas.length,
    usadas: escolhidas.length,
    medidas: escolhidas.map((m) => `${m.medida} ${m.gramas}g`).join(", "),
  });
}

writeFileSync(SAIDA, JSON.stringify({ fonte: FONTE, medidas: porAlimento }, null, 1) + "\n");

const linha = "=".repeat(64);
console.log(`\n${linha}\nMEDIDAS CASEIRAS — POF/IBGE\n${linha}`);
console.log(`  linhas lidas no CSV        ${todas.length}`);
console.log(`  alimentos vinculados       ${Object.keys(VINCULOS).length}`);
console.log(`  alimentos com medida       ${Object.keys(porAlimento).length}`);
console.log(`  total de medidas escritas  ${Object.values(porAlimento).flat().length}`);
console.log(`\n  Por alimento:`);
for (const r of relatorio) console.log(`    ${r.slug.padEnd(44)} ${r.medidas}`);
if (semNada.length) {
  console.log(`\n  SEM MEDIDA APROVEITÁVEL (${semNada.length}):`);
  for (const s of semNada) console.log(`    ${s}`);
}
console.log(`\n${linha}\n`);
