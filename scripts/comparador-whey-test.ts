/**
 * O motor da Batalha dos Wheys.
 *   npx tsx scripts/comparador-whey-test.ts
 *
 * Os produtos daqui são de TESTE (rótulos redondos), não dados reais.
 */
import {
  analisa, conferePreco, destaques, entraNoRanking, ofertaValida, precoEquilibrioCentavos, problemasRotulo,
  concentracaoBaixa, rankingCusto, reais, rotina, statusPreco, valePagarMais, type Oferta,
} from "../lib/comparador-whey";
import { montaRanking } from "../lib/comparador-whey-catalogo";

let falhas = 0;
function ok(nome: string, cond: boolean) {
  console.log(`${cond ? "  ok    " : "  FALHOU"}  ${nome}`);
  if (!cond) falhas++;
}
const perto = (a: number, b: number, tol = 0.001) => Math.abs(a - b) <= tol;

// 900 g, porção 30 g com 24 g de proteína (80%), R$ 120,00
const A: Oferta & { id: string } = { id: "a", pacoteG: 900, porcaoG: 30, proteinaPorcaoG: 24, precoCentavos: 12000 };
// 1 kg, porção 40 g com 30 g (75%), R$ 130,00
const B: Oferta & { id: string } = { id: "b", pacoteG: 1000, porcaoG: 40, proteinaPorcaoG: 30, precoCentavos: 13000 };
// isolado 900 g, porção 30 g com 27 g (90%), R$ 180,00
const C: Oferta & { id: string } = { id: "c", pacoteG: 900, porcaoG: 30, proteinaPorcaoG: 27, precoCentavos: 18000 };

console.log("\n1. AS FÓRMULAS");
const a = analisa(A);
ok("concentração 24/30 = 80%", perto(a.concentracaoPct, 80));
ok("proteína total (900/30)×24 = 720 g", perto(a.proteinaTotalG, 720));
ok("custo por g de proteína 12000/720 = 16,667 centavos", perto(a.centavosPorGProteina, 12000 / 720));
ok("25 g de proteína custam 416,67 centavos", perto(a.centavosPor25g, (12000 / 720) * 25));
ok("rende 28,8 doses de 25 g", perto(a.doses25g, 28.8));
ok("100 g de produto custam 1333,33 centavos", perto(a.centavosPor100gProduto, 1333.333, 0.01));
ok("porção do fabricante custa 400 centavos", perto(a.centavosPorPorcao, 400));
ok("25 g de proteína pedem 31,25 g de produto", perto(a.produtoPara25gG, 31.25));

console.log("\n2. PESOS E PORÇÕES DIFERENTES");
const b = analisa(B);
ok("B: 1000/40×30 = 750 g de proteína", perto(b.proteinaTotalG, 750));
ok("B: 13000/750 = 17,333 centavos/g", perto(b.centavosPorGProteina, 13000 / 750));
ok("pote mais caro (B) ainda pode ser comparado só pelo custo da proteína", b.centavosPorGProteina > a.centavosPorGProteina);
const mesmoPreco: Oferta = { ...A, porcaoG: 30, proteinaPorcaoG: 18 };
ok("mesmo pote e preço, rótulo mais fraco = proteína mais cara", analisa(mesmoPreco).centavosPorGProteina > a.centavosPorGProteina);

console.log("\n3. MODO A — RANKING");
const r = rankingCusto([B, C, A]);
ok("ordem por custo da proteína: A, B, C", r.map((x) => x.item.id).join() === "a,b,c");
ok("oferta inválida fica fora do ranking", rankingCusto([A, { ...B, precoCentavos: 0 }]).length === 1);

console.log("\n4. MODO C — ROTINA");
const ro = rotina(A, 25, 30);
ok("25 g/dia × 30 dias = 750 g; custo proporcional 750 × 16,667", perto(ro.custoProporcionalCentavos, 750 * (12000 / 720), 0.01));
ok("750 g pedem 2 potes de 720 g (arredonda para cima)", ro.embalagens === 2);
ok("desembolso real = 2 potes = R$ 240", ro.desembolsoCentavos === 24000);
ok("sobra 690 g de proteína", perto(ro.sobraProteinaG, 690));
ok("exatamente 1 pote não vira 2 por erro de arredondamento", rotina(A, 24, 30).embalagens === 1);
ok("meta zero = nenhuma embalagem", rotina(A, 0, 30).embalagens === 0);

console.log("\n5. MODO D — VALE PAGAR MAIS?");
const v = valePagarMais(A, C, 25, 30);
const cA = 12000 / 720, cC = 18000 / 810;
ok("extra em 30 dias = (cC − cA) × 750", perto(v.extraCentavos, (cC - cA) * 750, 0.01));
ok("extra percentual", perto(v.extraPct, (cC - cA) / cA));

console.log("\n6. MODO E — PREÇO DE EQUILÍBRIO");
const eq = precoEquilibrioCentavos(A, C);
ok("C empata com A a 16,667 × 810 = R$ 135,00", eq === 13500);
ok("no preço de equilíbrio, custo por g fica igual (ou menor)", analisa({ ...C, precoCentavos: eq }).centavosPorGProteina <= a.centavosPorGProteina + 1e-9);

console.log("\n7. DESTAQUES — SEM VENCEDOR GERAL");
const d = destaques([A, B, C]);
ok("mais econômico: A", d.maisEconomico === "a");
ok("maior concentração: C (isolado)", d.maiorConcentracao === "c");
ok("empate exato devolve null", destaques([A, { ...A, id: "a2" }]).maisEconomico === null);
ok("menos de dois válidos: sem destaque", destaques([A]).maisEconomico === null);

console.log("\n8. RÓTULO INVÁLIDO");
ok("proteína maior que a porção", problemasRotulo({ pacoteG: 900, porcaoG: 30, proteinaPorcaoG: 31 })[0] === "proteina_maior_que_porcao");
ok("concentração de 99% é impossível para whey", problemasRotulo({ pacoteG: 900, porcaoG: 30, proteinaPorcaoG: 29.8 })[0] === "concentracao_impossivel");
ok("pacote de 50 g é recusado", problemasRotulo({ pacoteG: 50, porcaoG: 30, proteinaPorcaoG: 24 }).includes("pacote_invalido"));
ok("NaN é recusado", problemasRotulo({ pacoteG: NaN, porcaoG: 30, proteinaPorcaoG: 24 }).length > 0);
ok("blend a 50% passa, mas com aviso", problemasRotulo({ pacoteG: 900, porcaoG: 40, proteinaPorcaoG: 20 }).length === 0 && concentracaoBaixa({ pacoteG: 900, porcaoG: 40, proteinaPorcaoG: 20 }));
ok("preço fracionado (não inteiro em centavos) é recusado", !ofertaValida({ ...A, precoCentavos: 12000.5 }));

console.log("\n9. PREÇO: VALIDADE");
const agora = new Date("2026-10-08T12:00:00Z");
ok("verificado há 2 dias = verificado", statusPreco(new Date("2026-10-06T12:00:00Z"), agora) === "verificado");
ok("verificado há 10 dias = último conhecido", statusPreco(new Date("2026-09-28T12:00:00Z"), agora) === "ultimo_conhecido");
ok("sem data = indisponível", statusPreco(null, agora) === "indisponivel");
ok("data no futuro = indisponível", statusPreco(new Date("2026-10-20T00:00:00Z"), agora) === "indisponivel");
ok("último conhecido NÃO entra no ranking", !entraNoRanking("ultimo_conhecido") && entraNoRanking("verificado"));
ok("validade configurável por fonte", statusPreco(new Date("2026-10-06T12:00:00Z"), agora, 1) === "ultimo_conhecido");

console.log("\n10. PREÇO: CONFERÊNCIA ANTES DE GRAVAR");
ok("preço ausente", conferePreco(null, 12000).aceito === false);
ok("preço zero nunca substitui preço válido", (() => { const x = conferePreco(0, 12000); return !x.aceito && x.motivo === "zero_ou_negativo"; })());
ok("preço negativo", conferePreco(-500, 12000).aceito === false);
ok("queda de 60% vai para revisão", (() => { const x = conferePreco(4800, 12000); return !x.aceito && x.motivo === "variacao_suspeita"; })());
ok("alta de 50% vai para revisão", conferePreco(18000, 12000).aceito === false);
ok("variação de 10% é aceita", conferePreco(13200, 12000).aceito === true);
ok("primeiro preço (sem anterior) é aceito", conferePreco(12000, null).aceito === true);

console.log("\n11. FORMATAÇÃO");
ok("12000 centavos = R$ 120,00", reais(12000).replace(/\s/g, " ") === "R$ 120,00");
ok("416,67 centavos = R$ 4,17", reais(416.6667).replace(/\s/g, " ") === "R$ 4,17");

console.log("\n12. RANKING DA PÁGINA");
{
  const base = { marca: "Teste", linha: "Whey X", nome: "Whey X", tipo: "concentrado", sabor: "Baunilha", carboidratosG: null, acucaresG: null, gordurasG: null, sodioMg: null, kcalPorcao: null, lactose: null, alergenicos: null, urlOficial: null, fonteRotulo: "teste", rotuloVerificadoEm: "2026-10-08" };
  const preco = (c: number, quando: string, condicao: "pix" | "cartao" | "regular" = "regular", emEstoque: boolean | null = true) => ({ condicao, precoCentavos: c, parcelamento: null, emEstoque, loja: "Loja", url: "https://x", metodo: "manual", verificadoEm: quando });
  const hoje = "2026-10-08T15:00:00.000Z";
  const cat = [
    { ...base, slug: "caro", pacoteG: 900, porcaoG: 30, proteinaPorcaoG: 24, precos: [preco(30000, hoje)] },
    { ...base, slug: "barato", pacoteG: 900, porcaoG: 30, proteinaPorcaoG: 24, precos: [preco(20000, hoje, "cartao"), preco(18000, hoje, "pix")] },
    { ...base, slug: "velho", pacoteG: 900, porcaoG: 30, proteinaPorcaoG: 24, precos: [preco(10000, "2026-09-20T15:00:00.000Z")] },
    { ...base, slug: "sem-estoque", pacoteG: 900, porcaoG: 30, proteinaPorcaoG: 24, precos: [preco(10000, hoje, "regular", false)] },
    { ...base, slug: "blend", pacoteG: 900, porcaoG: 40, proteinaPorcaoG: 20, precos: [preco(25000, hoje)] },
  ];
  const r = montaRanking(cat, new Date("2026-10-09T12:00:00Z"));
  ok("ordena pelo custo de 25 g", r.map((x) => x.produto.slug).join() === "barato,caro,blend");
  ok("usa o menor preço da conferência (Pix 180,00)", r[0].preco.precoCentavos === 18000);
  ok("preço vencido não entra", !r.some((x) => x.produto.slug === "velho"));
  ok("fora de estoque não entra", !r.some((x) => x.produto.slug === "sem-estoque"));
  ok("blend a 50% leva aviso", r.find((x) => x.produto.slug === "blend")!.concentracaoBaixa);
}

console.log(falhas ? `\n${falhas} FALHA(S)` : "\nTudo certo.");
process.exit(falhas ? 1 : 0);
