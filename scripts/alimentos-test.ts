/**
 * A base nutricional.
 *   npx tsx scripts/alimentos-test.ts
 *
 * Os testes daqui protegem as três coisas que, se quebrarem, fazem a
 * ferramenta mentir sem parecer que está mentindo:
 *
 *   1. licença — nenhum dado vai ao ar sob licença presumida;
 *   2. estado do dado — "0" nunca aparece no lugar de "não medido";
 *   3. busca — nenhuma consulta devolve um alimento que não é o pedido.
 *
 * Os alimentos usados aqui são inventados de propósito ("Alimento de teste"),
 * com números redondos. Testar a engrenagem com dado real convida a
 * confundir fixture com base publicável, e este arquivo não é fonte.
 */

import {
  FONTES,
  IDS_FONTE,
  podeEntrarEmProducao,
  pendenciasDeLicenca,
  AVISO_VARIACAO,
} from "../lib/alimentos/fontes";
import {
  GRAMAS_MAX,
  GRAMAS_MIN,
  escalaValor,
  formataNumero,
  formataValor,
  gramasPara,
  leGramas,
} from "../lib/alimentos/escala";
import { existsSync, readFileSync } from "node:fs";
import { buscaAlimentos, montaIndice, normaliza } from "../lib/alimentos/busca";
import {
  conferenciaEnergetica,
  leCelula,
  podePublicar,
  resumo,
  validaDuplicatas,
  validaFicha,
  validaValor,
} from "../lib/alimentos/validacao";
import type { Alimento, ValorNutriente } from "../lib/alimentos/tipos";
import { blogPosts } from "../lib/blog";
import { ARTIGOS_COM_FICHA, FICHAS_POR_ARTIGO } from "../lib/alimentos/artigos";
import { nomeNatural, todosAlimentos } from "../lib/alimentos/base";
import { NUTRIENTE_POR_ID } from "../lib/alimentos/nutrientes";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

// ─── fixtures ───────────────────────────────────────────────────────────────

function alimento(nome: string, slug: string, aliases: string[], extra: Partial<Alimento> = {}): Alimento {
  return {
    id: slug,
    slug,
    nome,
    categoria: "miscelaneas",
    preparo: "cozido",
    aliases,
    nutrientes: [],
    porcoes: [],
    proveniencia: {
      fonte: "TACO",
      idNaFonte: "000",
      descricaoOriginal: nome,
      versao: "4ª ed. rev. e ampl., 2011",
      verificadoEm: "2026-08-30",
    },
    indexavel: false,
    ...extra,
  };
}

const BASE: Alimento[] = [
  alimento("Feijão carioca, cozido", "feijao-carioca-cozido", ["feijao", "carioquinha"]),
  alimento("Feijão preto, cozido", "feijao-preto-cozido", ["feijao preto"]),
  alimento("Peito de frango, sem pele, grelhado", "peito-frango-grelhado", ["frango", "peito de frango"]),
  alimento("Ovo de galinha, cozido", "ovo-cozido", ["ovo", "ovos"]),
  alimento("Batata-doce, cozida", "batata-doce-cozida", ["batata doce"]),
  alimento("Banana-prata, crua", "banana-prata", ["banana prata", "banana"]),
  alimento("Arroz branco, cozido", "arroz-branco-cozido", ["arroz"]),
  /* Farinha não tem preparo que mude o valor — por isso não leva vírgula. */
  alimento("Farinha de mandioca", "farinha-mandioca", ["farinha"], { preparo: "pronto para consumo" }),
  alimento("Uva, crua", "uva-crua", ["uva"]),
];
const INDICE = montaIndice(BASE);

function primeiro(q: string): string | null {
  const r = buscaAlimentos(INDICE, q);
  return r.length ? r[0].alimento.slug : null;
}

const analisado = (v: number): ValorNutriente =>
  ({ nutrienteId: "proteina", valorPor100g: v, unidade: "g", estado: "analisado" });
const traco: ValorNutriente =
  { nutrienteId: "ferro", valorPor100g: null, unidade: "mg", estado: "traco" };
const ausente: ValorNutriente =
  { nutrienteId: "zinco", valorPor100g: null, unidade: "mg", estado: "naoDisponivel" };

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. LICENÇA — NENHUM DADO SOB PERMISSÃO PRESUMIDA");

ok("a TBCA está registrada como proibida de publicar", FONTES.TBCA.podePublicar === false);
ok("e nunca pode entrar em produção enquanto for assim", !podeEntrarEmProducao("TBCA"));
ok("a TACO exige atribuição", FONTES.TACO.exigeAtribuicao === true);
ok("a atribuição da TACO cita NEPA/UNICAMP como a fonte pede",
  /TACO/.test(FONTES.TACO.atribuicao) && /NEPA\/UNICAMP/.test(FONTES.TACO.atribuicao));
ok("o USDA é registrado como domínio público", /domínio público|CC0/i.test(FONTES.USDA.licenca));
ok("toda fonte tem termo escrito", IDS_FONTE.every((id) => FONTES[id].licenca.length > 60));
ok("toda fonte não-liberada explica a pendência",
  IDS_FONTE.filter((id) => !podeEntrarEmProducao(id)).every((id) => (FONTES[id].pendencia ?? "").length > 40));
/* Fonte liberada não precisa mais de pendência — e não deve carregar uma. */
ok("fonte já conferida não fica com pendência pendurada",
  IDS_FONTE.filter((id) => podeEntrarEmProducao(id)).every((id) => FONTES[id].pendencia === undefined),
  IDS_FONTE.filter((id) => podeEntrarEmProducao(id) && FONTES[id].pendencia).join(", "));

/**
 * A trava de verificação, agora com a TACO do outro lado dela.
 *
 * Por um tempo este teste exigia que NENHUMA fonte estivesse liberada,
 * porque nenhuma tinha sido conferida na origem — nem a TACO, que
 * "provavelmente permitia". Essa frase era exatamente o que a trava existia
 * para não aceitar.
 *
 * A conferência aconteceu: a página de créditos do PDF oficial da 4ª edição
 * traz a autorização, e ela está reproduzida ao pé da letra em fontes.ts. A
 * TACO passou a publicar; as outras continuam paradas onde estavam, cada uma
 * pelo seu próprio motivo.
 */
{
  ok("a TACO foi conferida na publicação oficial e pode publicar",
    podeEntrarEmProducao("TACO"), FONTES.TACO.verificadoEm || "sem data");
  ok("a licença guarda a frase da fonte, não uma paráfrase",
    /É permitida a reprodução parcial ou total desta obra, desde que citada a fonte/.test(FONTES.TACO.licenca));
  ok("a edição registrada é a que a ficha catalográfica declara",
    /4ª edição revisada e ampliada/.test(FONTES.TACO.edicao) && /2011/.test(FONTES.TACO.edicao));

  /* Conferir uma não libera as outras. */
  ok("a TBCA continua bloqueada", !podeEntrarEmProducao("TBCA"));
  ok("o USDA continua pendente de importação", !podeEntrarEmProducao("USDA"));

  const pendentes = pendenciasDeLicenca().map((p) => p.id);
  ok("toda fonte ainda pendente aparece na lista de pendências",
    IDS_FONTE.filter((id) => !podeEntrarEmProducao(id)).every((id) => pendentes.includes(id)));
}

ok("o aviso de variabilidade não promete exatidão",
  /variam?|referências/i.test(AVISO_VARIACAO) && !/exat|preciso/i.test(AVISO_VARIACAO));

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. ESCALA — A CONTA E O ARREDONDAMENTO");

ok("100 g devolve o próprio valor", escalaValor(analisado(25), 100).valor === 25);
ok("150 g de 25 g/100 g dá 37,5", escalaValor(analisado(25), 150).valor === 37.5);
ok("50 g de 10 g/100 g dá 5", escalaValor(analisado(10), 50).valor === 5);
ok("200 g de 10 g/100 g dá 20", escalaValor(analisado(10), 200).valor === 20);

/** O caso que dá nome ao arquivo: precisão total na conta, corte na exibição. */
{
  const v = escalaValor(analisado(24.999999999), 150);
  ok("a conta não arredonda no meio", v.valor !== null && v.valor > 37.49);
  ok("mas a exibição corta em 1 casa, com vírgula", formataValor(v) === "37,5 g", formataValor(v));
}

ok("kcal aparece inteira", formataNumero(158.6, "kcal") === "159", formataNumero(158.6, "kcal"));
ok("macro aparece com 1 casa", formataNumero(4.75, "g") === "4,8", formataNumero(4.75, "g"));
ok("nunca sai -0,0", formataNumero(-0, "g") === "0,0", formataNumero(-0, "g"));
ok("valor mínimo não vira notação científica",
  !/e/i.test(formataNumero(0.0000001, "mg")), formataNumero(0.0000001, "mg"));

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. ESTADO DO DADO — ZERO NÃO É AUSÊNCIA");

ok("traço não vira número ao escalar", escalaValor(traco, 250).valor === null);
ok("traço continua traço em qualquer quantidade", escalaValor(traco, 250).estado === "traco");
ok("traço aparece como tr, nunca como 0", formataValor(escalaValor(traco, 250)) === "tr");
ok("dado ausente não vira número", escalaValor(ausente, 150).valor === null);
ok("dado ausente aparece como travessão, nunca como 0",
  formataValor(escalaValor(ausente, 150)) === "—");
ok("zero analisado continua sendo zero de verdade",
  formataValor(escalaValor(analisado(0), 150)) === "0,0 g");

/**
 * O teste que fecha a regra: com dado ausente, traço e zero lado a lado, as
 * três saídas precisam ser DIFERENTES entre si. Se duas colidirem, a tela
 * perdeu a distinção que o modelo de dados inteiro existe para manter.
 */
{
  const saidas = [ausente, traco, analisado(0)].map((v) => formataValor(escalaValor(v, 100)));
  ok("as três situações produzem três saídas distintas",
    new Set(saidas).size === 3, saidas.join(" | "));
}

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. QUANTIDADE — NUNCA NaN, NUNCA Infinity");

ok("vazio é rejeitado", leGramas("") === null);
ok("só espaço é rejeitado", leGramas("   ") === null);
ok("texto é rejeitado", leGramas("abc") === null);
ok("zero é rejeitado", leGramas("0") === null);
ok("negativo é rejeitado", leGramas("-50") === null);
ok("acima do teto é rejeitado", leGramas(String(GRAMAS_MAX + 1)) === null);
ok("Infinity é rejeitado", leGramas("Infinity") === null);
ok("vírgula brasileira é aceita", leGramas("100,5") === 100.5);
ok("ponto também é aceito", leGramas("100.5") === 100.5);
ok("o mínimo é aceito", leGramas(String(GRAMAS_MIN)) === GRAMAS_MIN);

/** A varredura: nenhuma entrada plausível pode produzir NaN na tela. */
{
  const entradas = ["", " ", "abc", "0", "-1", "1e999", "NaN", "null", "100,5", "100.5", "1", "5000", "5001"];
  const ruins = entradas.filter((t) => {
    const g = leGramas(t);
    if (g === null) return false;
    const s = formataValor(escalaValor(analisado(10), g));
    return /NaN|Infinity|undefined/.test(s);
  });
  ok("nenhuma entrada produz NaN, Infinity ou undefined", ruins.length === 0, ruins.join(", "));
}

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. \"QUANTO PRECISO PARA X G DE PROTEÍNA?\"");

ok("30 g de proteína num alimento de 25 g/100 g dá 120 g", gramasPara(25, "analisado", 30) === 120);
ok("alimento sem o nutriente não devolve conta", gramasPara(0, "analisado", 30) === null);
ok("traço não devolve conta", gramasPara(null, "traco", 30) === null);
ok("alvo zero não devolve conta", gramasPara(25, "analisado", 0) === null);
ok("resultado absurdo é recusado em vez de exibido",
  gramasPara(0.5, "analisado", 100) === null, "100 g de proteína em alface daria 20 kg");

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. BUSCA — COMO O BRASILEIRO ESCREVE COMIDA");

ok("acento não importa", normaliza("Feijão") === normaliza("feijao"));
ok("caixa não importa", normaliza("FEIJAO") === normaliza("feijao"));
ok("hífen e espaço são a mesma coisa", normaliza("batata-doce") === normaliza("batata doce"));
ok("plural casa com singular", normaliza("ovos") === normaliza("ovo"));
ok("plural em -ões casa", normaliza("feijões") === normaliza("feijao"));

for (const [q, esperado] of [
  ["feijão", "feijao-carioca-cozido"],
  ["feijao", "feijao-carioca-cozido"],
  ["FEIJAO", "feijao-carioca-cozido"],
  ["feijão preto", "feijao-preto-cozido"],
  ["frango", "peito-frango-grelhado"],
  ["peito de frango", "peito-frango-grelhado"],
  ["frango grelhado", "peito-frango-grelhado"],
  ["banana prata", "banana-prata"],
  ["banana-prata", "banana-prata"],
  ["ovo", "ovo-cozido"],
  ["ovos", "ovo-cozido"],
  ["batata doce", "batata-doce-cozida"],
  ["batata-doce", "batata-doce-cozida"],
] as const) {
  ok(`"${q}" acha ${esperado}`, primeiro(q) === esperado, `veio ${primeiro(q)}`);
}

bloco("7. TOLERÂNCIA A ERRO — SEM DEVOLVER A COMIDA ERRADA");

ok('"feijaoo" ainda acha feijão', primeiro("feijaoo") === "feijao-carioca-cozido", `veio ${primeiro("feijaoo")}`);
ok('"frnago" ainda acha frango', primeiro("frnago") === "peito-frango-grelhado", `veio ${primeiro("frnago")}`);
ok('"bananna" ainda acha banana', primeiro("bananna") === "banana-prata", `veio ${primeiro("bananna")}`);

/**
 * O outro lado, que é o que importa mais: a tolerância não pode transformar
 * uma comida na outra. "ovo" tem três letras e não ganha tolerância nenhuma
 * exatamente para não alcançar "uva".
 */
ok('"ovo" não traz uva', buscaAlimentos(INDICE, "ovo").every((r) => r.alimento.slug !== "uva-crua"));
ok('"frango" não traz farinha', buscaAlimentos(INDICE, "frango").every((r) => r.alimento.slug !== "farinha-mandioca"));
ok("consulta sem correspondência devolve vazio, não o mais parecido",
  buscaAlimentos(INDICE, "picanha").length === 0,
  buscaAlimentos(INDICE, "picanha").map((r) => r.alimento.slug).join(", "));
ok("consulta de 1 letra não devolve nada", buscaAlimentos(INDICE, "f").length === 0);
ok("busca vazia não devolve nada", buscaAlimentos(INDICE, "").length === 0);

/** Preparo separado: cru e cozido nunca podem se fundir num registro só. */
ok("feijão carioca e preto são registros distintos",
  new Set(BASE.map((a) => a.slug)).size === BASE.length);
ok("o nome exibido carrega o preparo",
  BASE.filter((a) => a.preparo !== "pronto para consumo")
    .every((a) => /,\s/.test(a.nome)),
  BASE.filter((a) => !/,\s/.test(a.nome)).map((a) => a.nome).join(" | "));

// ─── 8 ──────────────────────────────────────────────────────────────────────
bloco("8. PROVENIÊNCIA — TODO NÚMERO RASTREÁVEL");

{
  const semRastro = BASE.filter(
    (a) =>
      !a.proveniencia.idNaFonte ||
      !a.proveniencia.descricaoOriginal ||
      !a.proveniencia.versao ||
      !a.proveniencia.verificadoEm,
  );
  ok("todo alimento responde de qual fonte veio, em que versão e quando",
    semRastro.length === 0, semRastro.map((a) => a.slug).join(", "));
}
ok("nenhum alimento nasce indexável", BASE.every((a) => a.indexavel === false));

// ─── 9 ──────────────────────────────────────────────────────────────────────
bloco("9. IMPORTAÇÃO — RECUSAR, NUNCA CONSERTAR EM SILÊNCIO");

/**
 * A vírgula decimal brasileira. É o erro mais traiçoeiro de importar tabela
 * daqui: o número continua parecendo número depois de lido errado.
 */
ok('"1,5" é lido como 1.5', leCelula("1,5").valor === 1.5, String(leCelula("1,5").valor));
ok('"1.234,5" (milhar + decimal) é lido como 1234.5',
  leCelula("1.234,5").valor === 1234.5, String(leCelula("1.234,5").valor));
ok('"1.5" (ponto decimal) também é lido como 1.5', leCelula("1.5").valor === 1.5);
ok('"128" é lido como inteiro', leCelula("128").valor === 128);

/** Traço e ausente são estados DIFERENTES já na leitura da célula. */
ok('"Tr" vira traço, não zero', leCelula("Tr").estado === "traco" && leCelula("Tr").valor === null);
ok('"NA" vira não-disponível', leCelula("NA").estado === "naoDisponivel");
ok('célula vazia vira não-disponível', leCelula("   ").estado === "naoDisponivel");
ok("traço e ausente não colapsam num estado só",
  leCelula("Tr").estado !== leCelula("NA").estado);
ok("lixo inesperado é sinalizado, não engolido",
  leCelula("abc").naoReconhecido === "abc");

/** Valores impossíveis. */
{
  const neg: ValorNutriente = { nutrienteId: "proteina", valorPor100g: -1, unidade: "g", estado: "analisado" };
  ok("valor negativo é erro", validaValor(neg, "x").some((p) => p.gravidade === "erro"));

  const absurdo: ValorNutriente = { nutrienteId: "proteina", valorPor100g: 250, unidade: "g", estado: "analisado" };
  ok("250 g de proteína em 100 g de comida é erro", validaValor(absurdo, "x").some((p) => p.gravidade === "erro"));

  const kcalAbsurda: ValorNutriente = { nutrienteId: "energia", valorPor100g: 5000, unidade: "kcal", estado: "analisado" };
  ok("5000 kcal por 100 g é erro", validaValor(kcalAbsurda, "x").some((p) => p.gravidade === "erro"));

  const azeite: ValorNutriente = { nutrienteId: "energia", valorPor100g: 884, unidade: "kcal", estado: "analisado" };
  ok("mas 884 kcal (azeite) passa — o teto é físico, não nutricional",
    validaValor(azeite, "x").length === 0);

  const unidadeRuim = { nutrienteId: "x", valorPor100g: 1, unidade: "onças", estado: "analisado" } as unknown as ValorNutriente;
  ok("unidade desconhecida é erro", validaValor(unidadeRuim, "x").some((p) => p.gravidade === "erro"));

  const contradicao: ValorNutriente = { nutrienteId: "ferro", valorPor100g: 2, unidade: "mg", estado: "traco" };
  ok("traço carregando número é contradição e vira erro",
    validaValor(contradicao, "x").some((p) => p.gravidade === "erro"));
}

ok("nutriente duplicado na mesma ficha é erro",
  validaDuplicatas([analisado(1), analisado(2)], "x").length === 1);

/**
 * A conferência energética. Ela existe para pescar outlier — e o teste mais
 * importante é o que garante que ela NÃO reescreve o valor oficial.
 */
{
  ok("macros coerentes não geram aviso",
    conferenciaEnergetica(160, 30, 5, 3, "x").length === 0);
  const divergente = conferenciaEnergetica(160, 30, 50, 30, "x");
  ok("divergência grande gera aviso", divergente.length === 1);
  ok("e o aviso é AVISO, não erro — a fonte manda",
    divergente[0].gravidade === "aviso");
  ok("o aviso diz explicitamente para não substituir o valor oficial",
    /NÃO deve ser substituído/.test(divergente[0].mensagem));
  ok("ficha com só um aviso ainda pode publicar", podePublicar(divergente));
}

/** A ficha inteira: sem rastro, não publica. */
{
  const semRastro = validaFicha({ nome: "Feijão", idNaFonte: "", verificadoEm: "2026-08-30", nutrientes: [analisado(5)] });
  ok("ficha sem identificador na fonte não publica", !podePublicar(semRastro));

  const semData = validaFicha({ nome: "Feijão", idNaFonte: "123", verificadoEm: "", nutrientes: [analisado(5)] });
  ok("ficha sem data de verificação não publica", !podePublicar(semData));

  const semNome = validaFicha({ nome: "  ", idNaFonte: "123", verificadoEm: "2026-08-30", nutrientes: [analisado(5)] });
  ok("ficha sem nome não publica", !podePublicar(semNome));

  const vazia = validaFicha({ nome: "Feijão", idNaFonte: "123", verificadoEm: "2026-08-30", nutrientes: [] });
  ok("ficha sem nenhum nutriente não publica", !podePublicar(vazia));

  const boa = validaFicha({ nome: "Feijão", idNaFonte: "123", verificadoEm: "2026-08-30", nutrientes: [analisado(5), traco, ausente] });
  ok("ficha completa, com traço e ausente declarados, publica", podePublicar(boa), resumo(boa));
}

// ─── 10 ─────────────────────────────────────────────────────────────────────
bloco("10. A BASE IMPORTADA REPRODUZ A TABELA PUBLICADA");

/**
 * O teste mais importante do arquivo.
 *
 * Um pipeline de importação pode estar inteiramente errado e ainda assim
 * rodar sem reclamar: coluna trocada, casa decimal perdida, célula herdando
 * o valor da vizinha. Nada disso quebra nada — só produz números plausíveis
 * e errados, que é o pior resultado possível numa tabela nutricional.
 *
 * A única defesa real é conferir contra os valores IMPRESSOS na publicação.
 * Se o arredondamento da base bate com o que a TACO publica, então a coluna
 * é a certa, a escala é a certa e a leitura da célula é a certa.
 *
 * Foi exatamente assim que se descobriu que o sódio do sal dietético estava
 * sendo lido como manganês.
 */
{
  const caminho = "data/alimentos/processado/taco.json";
  if (!existsSync(caminho)) {
    ok("base importada existe", false, `rode: npx tsx scripts/alimentos-importa-taco.ts`);
  } else {
    const base = JSON.parse(readFileSync(caminho, "utf8")) as { alimentos: Alimento[] };
    const acha = (nome: string) => base.alimentos.find((a) => a.nome === nome);

    ok("a base tem os 597 alimentos da 4ª edição", base.alimentos.length === 597, String(base.alimentos.length));
    ok("todo slug é único",
      new Set(base.alimentos.map((a) => a.slug)).size === base.alimentos.length);
    ok("todo alimento tem código da TACO na proveniência",
      base.alimentos.every((a) => /^TACO-\d+$/.test(a.proveniencia.idNaFonte)),
      base.alimentos.filter((a) => !/^TACO-\d+$/.test(a.proveniencia.idNaFonte)).length + " sem código");
    ok("nenhum alimento nasce indexável", base.alimentos.every((a) => a.indexavel === false));

    /**
     * Valores conferidos contra a TACO 4ª ed. impressa. Se um destes mudar,
     * a importação passou a ler outra coisa.
     */
    const ESPERADO: [string, Record<string, string>][] = [
      ["Arroz, integral, cozido", { energia: "124", proteina: "2,6", carboidrato: "25,8", lipideos: "1,0", fibra: "2,7" }],
      ["Feijão, carioca, cozido", { energia: "76", proteina: "4,8", carboidrato: "13,6", lipideos: "0,5", fibra: "8,5" }],
      ["Banana, prata, crua", { energia: "98", proteina: "1,3", carboidrato: "26,0", lipideos: "0,1" }],
      ["Frango, peito, sem pele, grelhado", { energia: "159", proteina: "32,0", lipideos: "2,5" }],
      ["Abacate, cru", { energia: "96", proteina: "1,2", carboidrato: "6,0", lipideos: "8,4" }],
    ];

    for (const [nome, esperado] of ESPERADO) {
      const a = acha(nome);
      if (!a) { ok(`"${nome}" existe na base`, false); continue; }
      for (const [nutrienteId, valorEsperado] of Object.entries(esperado)) {
        const v = a.nutrientes.find((n) => n.nutrienteId === nutrienteId);
        const saida = v ? formataNumero(v.valorPor100g ?? NaN, v.unidade) : "(ausente)";
        ok(`${nome} · ${nutrienteId} = ${valorEsperado}`, saida === valorEsperado, `veio ${saida}`);
      }
    }

    /**
     * A trava contra o bug de célula que absorve a vizinha. O sal dietético
     * tem muito sódio e nenhum manganês — se o manganês voltar a ter valor,
     * o recorte de células quebrou de novo.
     */
    {
      const sal = acha("Sal, dietético");
      const mn = sal?.nutrientes.find((n) => n.nutrienteId === "manganes");
      const na = sal?.nutrientes.find((n) => n.nutrienteId === "sodio");
      ok("sal dietético: o sódio está na coluna do sódio",
        na?.estado === "analisado" && Math.round(na.valorPor100g ?? 0) === 23432, String(na?.valorPor100g));
      ok("sal dietético: manganês continua vazio, não herda o sódio",
        mn?.estado !== "analisado", `${mn?.estado} ${mn?.valorPor100g}`);
    }

    /** Óleos: gordura pura, sem cinzas analisadas — e sem número inventado. */
    {
      const oleo = acha("Óleo, de soja");
      const cinzas = oleo?.nutrientes.find((n) => n.nutrienteId === "cinzas");
      ok("óleo de soja: 884 kcal",
        formataNumero(oleo?.nutrientes.find((n) => n.nutrienteId === "energia")?.valorPor100g ?? NaN, "kcal") === "884");
      ok("óleo de soja: cinzas não viraram número", cinzas?.estado !== "analisado", String(cinzas?.estado));
    }

    /** Os quatro estados aparecem de verdade na base real. */
    {
      const estados = new Set<string>();
      for (const a of base.alimentos) for (const n of a.nutrientes) estados.add(n.estado);
      ok("a base usa os quatro estados de dado",
        ["analisado", "traco", "naoAplicavel", "naoDisponivel"].every((e) => estados.has(e)),
        [...estados].join(", "));
    }
  }
}

// ─── 11 ─────────────────────────────────────────────────────────────────────
bloco("11. MEDIDA CASEIRA — SÓ COM PESO DOCUMENTADO");

/**
 * A regra que impede o pior erro possível desta ferramenta.
 *
 * Uma concha de feijão não tem peso universal: a sua é diferente da minha.
 * Se o site afirma "1 concha = 120 g" sem ter de onde tirar isso, a pessoa
 * confia — porque o site disse — e leva embora um erro que ela não tem como
 * perceber. Pedir "120 g" é sempre correto; afirmar o que são 120 g exige
 * fonte.
 *
 * Por isso `fonte` é obrigatória no tipo, e este teste garante que ela seja
 * preenchida de verdade em vez de virar string vazia.
 */
{
  const caminhoBase = "data/alimentos/processado/taco.json";
  const caminhoMedidas = "data/alimentos/processado/medidas.json";

  if (!existsSync(caminhoMedidas)) {
    ok("as medidas foram importadas", false, "rode: npx tsx scripts/alimentos-importa-medidas.ts");
  } else {
    const base = JSON.parse(readFileSync(caminhoBase, "utf8")) as { alimentos: Alimento[] };
    const { medidas } = JSON.parse(readFileSync(caminhoMedidas, "utf8")) as {
      medidas: Record<string, { nome: string; gramas: number; fonte: string }[]>;
    };
    const slugsBase = new Set(base.alimentos.map((a) => a.slug));
    const entradas = Object.entries(medidas);

    const fantasmas = entradas.filter(([slug]) => !slugsBase.has(slug)).map(([s]) => s);
    ok("toda medida pertence a um alimento que existe na base", fantasmas.length === 0, fantasmas.join(", "));

    const todasMedidas = entradas.flatMap(([slug, ms]) => ms.map((m) => ({ slug, ...m })));

    const semFonte = todasMedidas.filter((m) => !m.fonte || m.fonte.trim().length < 20);
    ok("toda medida caseira declara de onde veio o peso", semFonte.length === 0,
      semFonte.map((m) => `${m.slug}: ${m.nome}`).join(", "));

    /**
     * A fonte precisa citar o IBGE E o código do alimento na POF. Sem o
     * código não dá para achar a linha na publicação, e uma proveniência que
     * ninguém consegue seguir é decoração.
     */
    const semRastro = todasMedidas.filter((m) => !/IBGE/.test(m.fonte) || !/alimento \d+/.test(m.fonte));
    ok("toda medida cita o IBGE e o código do alimento na POF", semRastro.length === 0,
      semRastro.slice(0, 3).map((m) => `${m.slug}: "${m.fonte}"`).join(" | "));

    /** A preparação faz parte da proveniência: cru e cozido pesam diferente. */
    const semPreparo = todasMedidas.filter((m) => !/preparação "/.test(m.fonte));
    ok("toda medida declara a preparação a que se refere", semPreparo.length === 0,
      semPreparo.slice(0, 3).map((m) => m.slug).join(", "));

    const pesoRuim = todasMedidas.filter((m) => !Number.isFinite(m.gramas) || m.gramas <= 1 || m.gramas >= 1000);
    ok("nenhuma medida tem peso impossível ou é só uma unidade de peso",
      pesoRuim.length === 0, pesoRuim.map((m) => `${m.slug}: ${m.nome} = ${m.gramas} g`).join(", "));

    const nomeRuim = todasMedidas.filter((m) => !m.nome.trim() || !/^1 /.test(m.nome));
    ok("toda medida tem nome legível começando por \"1\"", nomeRuim.length === 0,
      nomeRuim.map((m) => m.nome).join(", "));

    /**
     * O caso que quase foi ao ar: um código do IBGE apontando para outro
     * alimento. Aqui o teste checa o lado observável — o peso precisa ser
     * plausível para o alimento. Uma maçã de 84 g veio de um limão.
     */
    const PLAUSIVEL: Record<string, [number, number]> = {
      "maca-fuji-com-casca-crua": [100, 250],
      "ovo-de-galinha-inteiro-cozido-10minutos": [40, 70],
      "banana-prata-crua": [50, 130],
      "frango-peito-sem-pele-grelhado": [80, 250],
    };
    for (const [slug, [min, max]] of Object.entries(PLAUSIVEL)) {
      const unidade = medidas[slug]?.find((m) => /^1 (unidade|file|bife)/.test(m.nome));
      ok(`${slug}: a unidade pesa algo plausível (${min}–${max} g)`,
        unidade !== undefined && unidade.gramas >= min && unidade.gramas <= max,
        unidade ? `${unidade.nome} = ${unidade.gramas} g` : "sem medida de unidade");
    }

    console.log(`\n  ${entradas.length} alimentos com medida caseira · ${todasMedidas.length} medidas`);
  }
}

/** A fonte das medidas está registrada e travada até ser conferida. */
ok("a POF do IBGE está registrada como fonte de medidas",
  FONTES.IBGE_POF !== undefined && /Medidas Referidas/i.test(FONTES.IBGE_POF.nomeCompleto));
ok("e não publica enquanto os termos não forem conferidos na origem",
  !podeEntrarEmProducao("IBGE_POF"));

/**
 * A trava precisa valer para mim também.
 *
 * As 125 medidas estão importadas e conferidas, e seria cômodo deixá-las
 * passar "porque o IBGE é público". Foi essa frase — "provavelmente permite"
 * — que a trava existe para recusar, e ela não pode valer só quando é
 * conveniente. O teste garante que a base respeite o próprio portão.
 */
{
  const liberada = podeEntrarEmProducao("IBGE_POF");
  const alimentoComMedida = todosAlimentos().find((a) => a.porcoes.length > 0);
  ok(
    liberada
      ? "com a fonte conferida, as medidas aparecem na base"
      : "com a fonte pendente, nenhuma medida chega à base",
    liberada ? alimentoComMedida !== undefined : alimentoComMedida === undefined,
    alimentoComMedida ? `${alimentoComMedida.slug} tem ${alimentoComMedida.porcoes.length}` : "nenhuma",
  );
}

console.log("\n" + "=".repeat(64));
if (falhas > 0) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
