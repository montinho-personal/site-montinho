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
    categoria: "outros",
    preparo: "cozido",
    aliases,
    nutrientes: [],
    porcoes: [],
    proveniencia: {
      fonte: "TACO",
      idNaFonte: "000",
      descricaoOriginal: nome,
      versao: "4ª ed.",
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

/**
 * A trava de verificação. Enquanto os termos não forem conferidos na origem,
 * NENHUMA fonte publica — nem a TACO, que provavelmente permite. "Provavelmente
 * permite" é exatamente a frase que este teste existe para não aceitar.
 */
{
  const pendentes = pendenciasDeLicenca().map((p) => p.id);
  ok("hoje nenhuma fonte está liberada para produção (verificação pendente)",
    IDS_FONTE.every((id) => pendentes.includes(id)),
    `liberadas: ${IDS_FONTE.filter((id) => podeEntrarEmProducao(id)).join(", ") || "nenhuma"}`);
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

console.log("\n" + "=".repeat(64));
if (falhas > 0) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
