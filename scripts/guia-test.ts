/**
 * Testes do guia de academias.
 *
 * O que estes testes protegem: a promessa da página. Ela pode ir ao ar sem
 * base de dados completa exatamente porque não afirma horário, preço nem
 * estrutura exata — se alguém acrescentar isso ao texto editorial depois, a
 * página passa a prometer o que não pode cumprir, e o teste quebra antes.
 */

import { ACADEMIAS } from "../lib/academias/base";
import { blogPosts } from "../lib/blog";
import { GRUPOS, ITENS, montarGuia, type GrupoId } from "../lib/academias/guia";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};

console.log("\n" + "=".repeat(60) + "\nINTEGRIDADE\n" + "=".repeat(60));

const guia = montarGuia();
const entradas = guia.flatMap((g) => g.entradas);

ok("toda academia ativa tem texto editorial", entradas.length === ACADEMIAS.filter((a) => a.status === "ativa").length);

const semArtigo = entradas.filter((e) => !e.academia.artigoSlug);
ok("toda entrada aponta para um artigo", semArtigo.length === 0, semArtigo.map((e) => e.id).join(", "));

const quebrados = entradas.filter((e) => !blogPosts.some((p) => p.slug === e.academia.artigoSlug));
ok("nenhum link para artigo inexistente", quebrados.length === 0, quebrados.map((e) => e.academia.artigoSlug).join(", "));

const ids = ITENS.map((i) => i.id);
ok("nenhuma academia duplicada", new Set(ids).size === ids.length);

const vazios = guia.filter((g) => g.entradas.length === 0);
ok("nenhum grupo vazio", vazios.length === 0, vazios.map((g) => g.grupo.id).join(", "));

ok("todo grupo declarado é usado", GRUPOS.every((g) => entradas.some((e) => e.grupo === g.id)));

console.log("\n" + "=".repeat(60) + "\nESCOPO — o que a página promete não afirmar\n" + "=".repeat(60));

/** Texto que a página gera a partir dos dados editoriais. */
const textoEditorial = [
  ...GRUPOS.flatMap((g) => [g.titulo, g.chamada, g.descricao, g.tradeOff]),
  ...ITENS.flatMap((i) => [i.paraQuem, i.penseDuasVezes]),
].join("  ");

/** Preço em reais — a página inteira se recusa a dar valor. */
ok("nenhum valor em reais", !/R\$\s?\d/i.test(textoEditorial));

/** Horário concreto: "6h", "às 22h", "22:00", "6h às 23h". */
const horario = textoEditorial.match(/\b\d{1,2}\s?(?:h\b|:\d{2})/gi) ?? [];
ok("nenhum horário concreto", horario.length === 0, horario.join(", "));

/** Nota ou percentual de compatibilidade. */
const nota = textoEditorial.match(/\b\d+([.,]\d+)?\s?(%|\/\s?10|estrelas?)\b/gi) ?? [];
ok("nenhuma nota ou percentual", nota.length === 0, nota.join(", "));

/**
 * Superlativo absoluto. "A melhor academia" é exatamente a afirmação que a
 * página existe para não fazer — só vale se vier qualificado ("melhor para").
 */
const superlativos = ["a melhor academia", "melhor academia de", "a mais completa", "número 1", "top 1", "ranking"];
const achados = superlativos.filter((s) => textoEditorial.toLowerCase().includes(s));
ok("nenhum superlativo absoluto", achados.length === 0, achados.join(", "));

console.log("\n" + "=".repeat(60) + "\nEQUILÍBRIO EDITORIAL\n" + "=".repeat(60));

/** Toda academia recebe os dois lados — elogio sem ressalva vira publicidade. */
const semRessalva = ITENS.filter((i) => i.penseDuasVezes.trim().length < 20);
ok("toda academia tem uma ressalva real", semRessalva.length === 0, semRessalva.map((i) => i.id).join(", "));

const semParaQuem = ITENS.filter((i) => i.paraQuem.trim().length < 20);
ok("toda academia tem um 'para quem' real", semParaQuem.length === 0, semParaQuem.map((i) => i.id).join(", "));

/** Todo grupo declara o seu trade-off — nenhum modelo é só vantagem. */
ok("todo grupo declara trade-off", GRUPOS.every((g) => g.tradeOff.trim().length > 40));

/** Textos repetidos denunciam preenchimento automático em vez de opinião. */
const paraQuens = ITENS.map((i) => i.paraQuem.toLowerCase());
ok("nenhum 'para quem' repetido", new Set(paraQuens).size === paraQuens.length);

const ressalvas = ITENS.map((i) => i.penseDuasVezes.toLowerCase());
ok("nenhuma ressalva repetida", new Set(ressalvas).size === ressalvas.length);

console.log("\n" + "=".repeat(60) + "\nDISTRIBUIÇÃO\n" + "=".repeat(60));
for (const { grupo, entradas: es } of guia) {
  console.log(`  ${grupo.titulo.padEnd(36)} ${es.length} academias`);
}

console.log("\n" + "=".repeat(60) + "\nACADEMIAS ENCERRADAS NO CONTEÚDO\n" + "=".repeat(60));

/**
 * Uma academia que fechou não pode continuar sendo oferecida como opção no
 * meio dos artigos. O nome só pode sobreviver no artigo dela própria, que
 * fica no ar avisando do encerramento — quem pesquisa o nome ainda chega lá.
 */
for (const a of ACADEMIAS.filter((x) => x.status !== "ativa")) {
  const nome = a.nome.replace(/\s+Alphaville$/, "").trim();
  const re = new RegExp(nome.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"), "i");
  const vazando = blogPosts.filter((p) => p.slug !== a.artigoSlug && re.test(p.content ?? ""));
  ok(
    `"${a.nome}" não aparece em outros artigos`,
    vazando.length === 0,
    vazando.map((p) => p.slug).join(", ")
  );

  const proprio = blogPosts.find((p) => p.slug === a.artigoSlug);
  ok(
    `artigo de "${a.nome}" avisa que encerrou`,
    !!proprio && /não está mais em operação|encerrou as atividades/i.test(proprio.content ?? ""),
    "o artigo segue no ar como se a unidade existisse"
  );
}

console.log("\n" + "=".repeat(60) + "\nPREÇO x GRUPO\n" + "=".repeat(60));

/**
 * A faixa de preço confirmada na base não pode contradizer o grupo em que a
 * academia aparece no guia. O leitor vê as duas coisas na mesma página: uma
 * academia listada em "custo-benefício" e marcada como das mais caras destrói
 * a confiança nas duas informações de uma vez.
 *
 * "Propostas específicas" aceita qualquer faixa de propósito — o grupo é
 * definido pela especialização, não pelo preço.
 */
const TIER: Record<string, GrupoId[]> = {
  economico: ["economicas"],
  custo_beneficio: ["bairro", "economicas"],
  intermediario: ["bairro", "especificas"],
  premium: ["premium", "especificas"],
};

for (const a of ACADEMIAS.filter((x) => x.status === "ativa")) {
  const f = a.faixaPreco.valor;
  if (!f) continue;
  const item = ITENS.find((i) => i.id === a.id);
  ok(
    `${a.nome}: faixa "${f}" combina com o grupo do guia`,
    !!item && TIER[f].includes(item.grupo),
    `está em "${item?.grupo}", e ${f} não pertence a esse grupo`
  );
}

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM\n" : `\n${falhas} TESTE(S) FALHARAM\n`);
process.exit(falhas === 0 ? 0 : 1);
