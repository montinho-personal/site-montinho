/**
 * Testes do Monte seu Cardápio.
 *
 * O risco número um desta ferramenta é único no site: ela SUGERE COMIDA. Um
 * mapeamento errado não dá número absurdo — dá um cardápio plausível que
 * contradiz o que a pessoa pediu: ovo para quem não come ovo, frango para
 * vegetariano, 9 ovos num dia. Por isso a suíte varre TODAS as combinações
 * de dieta × restrição e verifica que nenhum alimento proibido aparece.
 *
 * O segundo risco é o clássico das ferramentas de dieta: falsa precisão e
 * porção impossível. Os testes garantem que toda porção é múltiplo do passo
 * caseiro e que o motor prefere errar a meta em 8% a inventar "83 g de
 * arroz".
 */

import * as fs from "fs";
import { blogPosts } from "../lib/blog";
import {
  ALIMENTOS_CARDAPIO,
  ALIMENTO_CARDAPIO_POR_ID,
  RESTRICOES,
  nutrientes,
  permitido,
  rotuloPorcao,
  type Restricao,
} from "../lib/cardapio/alimentos";
import {
  KCAL_MIN_CARDAPIO,
  LIMITE_DURO,
  ORIENTACAO_ESPECIAL,
  ORIENTACAO_POR_SITUACAO,
  PERFIS_REFEICAO,
  PISO_PROTEINA,
  SITUACOES_ESPECIAIS,
  TOLERANCIA_IDEAL,
  TOLERANCIA_KCAL,
  alternativas,
  diaDentroDaTolerancia,
  geraCardapio,
  geraSemana,
  listaDeCompras,
  perfilNutricional,
  proximaVersao,
  sugestoesGordura,
  totalDia,
  totalRefeicao,
  validaCardapio,
  validaTotais,
  type PedidoCardapio,
} from "../lib/cardapio/motor";
import { ARTIGOS_POR_OBJETIVO } from "../components/cardapio/MonteSeuCardapio";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};

const pedido = (over: Partial<PedidoCardapio> = {}): PedidoCardapio => ({
  metaKcal: 2100,
  pesoKg: 80,
  objetivo: "emagrecer",
  refeicoes: 4,
  dieta: "onivoro",
  restricoes: [],
  habituais: {},
  ...over,
});

console.log("\n" + "=".repeat(64) + "\nO BANCO DE ALIMENTOS\n" + "=".repeat(64));

ok("a base tem entre 30 e 80 alimentos", ALIMENTOS_CARDAPIO.length >= 30 && ALIMENTOS_CARDAPIO.length <= 80, String(ALIMENTOS_CARDAPIO.length));
ok("nenhum id duplicado", new Set(ALIMENTOS_CARDAPIO.map((a) => a.id)).size === ALIMENTOS_CARDAPIO.length);
ok("todo alimento declara o estado", ALIMENTOS_CARDAPIO.every((a) => a.estado.length > 0));
ok("todo alimento tem fonte", ALIMENTOS_CARDAPIO.every((a) => a.fonte.length > 0));
ok("toda porção tem rótulo caseiro e peso", ALIMENTOS_CARDAPIO.every((a) => a.porcao.rotulo.length > 0 && a.porcao.g > 0));
ok(
  "as calorias batem com os macros (4/4/9, tolerância de fibra)",
  ALIMENTOS_CARDAPIO.every((a) => {
    const calc = a.prot100 * 4 + a.carb100 * 4 + a.gord100 * 9;
    /** TACO desconta fibra do carboidrato disponível; 15% + 25 kcal cobre isso. */
    return Math.abs(calc - a.kcal100) <= Math.max(25, a.kcal100 * 0.15);
  }),
  ALIMENTOS_CARDAPIO.filter((a) => Math.abs(a.prot100 * 4 + a.carb100 * 4 + a.gord100 * 9 - a.kcal100) > Math.max(25, a.kcal100 * 0.15)).map((a) => a.id).join(", ")
);
ok(
  "vegano implica vegetariano (não existe vegano-mas-não-vegetariano)",
  ALIMENTOS_CARDAPIO.every((a) => !a.vegano || a.vegetariano)
);
ok(
  "alguns valores foram conferidos na fonte, e a maioria da base é TACO",
  ALIMENTOS_CARDAPIO.filter((a) => a.verificadoEm).length >= 8 &&
    ALIMENTOS_CARDAPIO.filter((a) => a.fonte.includes("TACO")).length > ALIMENTOS_CARDAPIO.length * 0.7
);
ok("whey só entra se for hábito declarado", ALIMENTO_CARDAPIO_POR_ID.get("whey")?.soHabitual === true);

/** Pluralização: os casos que quebravam. */
const frango = ALIMENTO_CARDAPIO_POR_ID.get("frango-grelhado")!;
const ovo = ALIMENTO_CARDAPIO_POR_ID.get("ovo-cozido")!;
ok('2 filés: "2 filés médios"', rotuloPorcao(frango, 2).startsWith("2 filés médios"), rotuloPorcao(frango, 2));
ok('3 ovos: "3 ovos"', rotuloPorcao(ovo, 3).startsWith("3 ovos"), rotuloPorcao(ovo, 3));
ok('1,5 porção usa a forma "1,5×"', rotuloPorcao(frango, 1.5).includes("1,5×"), rotuloPorcao(frango, 1.5));
ok("o peso em gramas sempre aparece", rotuloPorcao(ovo, 2).includes("(~100 g)"));

console.log("\n" + "=".repeat(64) + "\nNUNCA SUGERIR O QUE A PESSOA NÃO COME\n" + "=".repeat(64));

/**
 * A varredura central: toda dieta × toda restrição, em três metas. Nenhum
 * cardápio pode conter alimento proibido — este é o teste que justifica a
 * ferramenta existir sem virar reclamação.
 */
let violacoes = 0;
let gerados = 0;
for (const dieta of ["onivoro", "vegetariano", "vegano"] as const) {
  for (const restricao of [[], ...RESTRICOES.map((r) => [r.id])] as Restricao[][]) {
    for (const metaKcal of [1500, 2100, 3000]) {
      for (const refeicoes of [3, 4, 5]) {
        const p = pedido({ dieta, restricoes: restricao, metaKcal, refeicoes });
        const c = geraCardapio(p);
        gerados++;
        for (const r of c.refeicoes) {
          for (const it of r.itens) {
            const a = ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId)!;
            if (!permitido(a, dieta, restricao)) violacoes++;
            /** Porção sempre múltiplo do passo e dentro do teto. */
            if (Math.round(it.porcoes / a.passo) * a.passo !== it.porcoes || it.porcoes > a.maxPorcoes) violacoes++;
          }
        }
      }
    }
  }
}
ok(`nenhuma violação de dieta/restrição/porção em ${gerados} cardápios`, violacoes === 0, `${violacoes} violações`);

/** Casos nominais das personas do pedido. */
const vegano = geraCardapio(pedido({ dieta: "vegano", metaKcal: 2400, pesoKg: 75, objetivo: "ganhar" }));
ok(
  "vegano não recebe nenhum alimento de origem animal",
  vegano.refeicoes.every((r) => r.itens.every((it) => ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId)!.vegano))
);
const semOvo = geraCardapio(pedido({ restricoes: ["ovo"] }));
ok(
  "quem não come ovo não recebe ovo",
  semOvo.refeicoes.every((r) => r.itens.every((it) => !it.alimentoId.includes("ovo")))
);
ok(
  "o vegetariano não vira 'onívoro sem carne': a proteína é substituída",
  geraCardapio(pedido({ dieta: "vegetariano" })).refeicoes
    .filter((r) => r.momento === "almoco" || r.momento === "jantar")
    .every((r) => {
      const t = totalRefeicao(r);
      return t.prot >= 15;
    }),
  "refeição principal vegetariana com menos de 15 g de proteína é remoção, não substituição"
);

console.log("\n" + "=".repeat(64) + "\nA CONTA FECHA (com tolerância honesta)\n" + "=".repeat(64));

for (const [nome, p] of [
  ["A: onívoro 90 kg, 2.100 kcal, hábitos BR", pedido({ pesoKg: 90, habituais: { cafe: ["ovo-mexido", "pao-frances", "banana"], almoco: ["arroz-branco", "feijao-carioca", "frango-grelhado"] } })],
  ["B: vegetariana 60 kg, 1.700 kcal, 5 refeições", pedido({ dieta: "vegetariano", metaKcal: 1700, pesoKg: 60, refeicoes: 5 })],
  ["C: 3 refeições, 2.000 kcal", pedido({ metaKcal: 2000, refeicoes: 3, objetivo: "manter" })],
  ["E: vegano 75 kg ganho, 2.400 kcal", pedido({ dieta: "vegano", metaKcal: 2400, pesoKg: 75, objetivo: "ganhar" })],
  ["F: vindo da calculadora (2.140 kcal)", pedido({ metaKcal: 2140 })],
] as [string, PedidoCardapio][]) {
  const c = geraCardapio(p);
  const t = totalDia(c);
  const tol = diaDentroDaTolerancia(c);
  ok(
    `${nome} → ${Math.round(t.kcal)} kcal (desvio ${(Math.abs(t.kcal / p.metaKcal - 1) * 100).toFixed(1)}%), prot ${Math.round(t.prot)}/${Math.round(c.metaProt)} g`,
    tol.kcalOk && tol.protOk
  );
}

ok("o determinismo vale: mesma entrada, mesmo cardápio", JSON.stringify(geraCardapio(pedido())) === JSON.stringify(geraCardapio(pedido())));
ok("as constantes de tolerância são as declaradas", TOLERANCIA_KCAL === 0.08 && PISO_PROTEINA === 0.85);
ok("as frações de cada perfil somam 1", Object.values(PERFIS_REFEICAO).every((perfil) => Math.abs(perfil.reduce((s, x) => s + x.fracao, 0) - 1) < 1e-9));

/** Habituais mandam: quem come arroz recebe arroz, não batata. */
const comHabito = geraCardapio(pedido({ habituais: { almoco: ["macarrao"] } }));
ok(
  "o alimento habitual vence o padrão do grupo",
  comHabito.refeicoes.find((r) => r.momento === "almoco")!.itens.some((i) => i.alimentoId === "macarrao")
);

console.log("\n" + "=".repeat(64) + "\nMACROS: O DIA FECHA NOS QUATRO, NÃO SÓ NAS CALORIAS\n" + "=".repeat(64));

/**
 * A seção nasceu de um caso real: meta 2.100 kcal / 136 P / 233 C / 70 G,
 * cardápio gerado com 2.009 kcal / 154 P / 280 C / 29 G. Calorias "certas",
 * gordura a -59% — o motor antigo otimizava kcal + proteína e compensava
 * gordura com carboidrato. Estes testes tornam esse resultado impossível de
 * voltar sem a suíte gritar.
 */
const metaReal = { kcal: 2100, prot: 136, carb: 233, gord: 70 };

/** TESTE 1 — o caso real que motivou a correção NÃO pode ser aprovado. */
const casoRuim = validaTotais({ kcal: 2009, prot: 154, carb: 280, gord: 29 }, metaReal);
ok("o cardápio do bug real (gordura 29/70 g) reprova na validação", !casoRuim.gordOk && casoRuim.nivel === "incompativel", JSON.stringify(casoRuim));

/** TESTE 2 — uma distribuição coerente é aprovada. */
const casoBom = validaTotais({ kcal: 2080, prot: 140, carb: 226, gord: 69 }, metaReal);
ok("uma distribuição coerente (2.080/140/226/69) aprova", casoBom.kcalOk && casoBom.protOk && casoBom.carbOk && casoBom.gordOk, JSON.stringify(casoBom));
ok("e o score prefere a distribuição coerente à do bug", casoBom.score < casoRuim.score, `${casoBom.score.toFixed(2)} vs ${casoRuim.score.toFixed(2)}`);

/** TESTE 3 — só alimentos magros: o motor tem que ACUSAR, não fingir. */
const soMagros = validaTotais({ kcal: 2050, prot: 150, carb: 290, gord: 20 }, metaReal);
ok("dia montado só com alimentos magros é marcado incompatível na gordura", !soMagros.gordOk && soMagros.nivel === "incompativel");
ok("existem fontes de gordura para sugerir em toda dieta", (["onivoro", "vegetariano", "vegano"] as const).every((d) => sugestoesGordura(pedido({ dieta: d })).length >= 1));
{
  const componenteResultado = fs.readFileSync("components/cardapio/MonteSeuCardapio.tsx", "utf8");
  ok(
    "a interface mostra o aviso de gordura quando a validação reprova",
    /validaCardapio\(cardapio\)\.gordOk/.test(componenteResultado) && /MENSAGEM_FALTA_GORDURA/.test(componenteResultado)
  );
}

/** TESTE 4 — o gerador de verdade, na meta do caso real (85 kg → 136 g). */
{
  const c = geraCardapio(pedido({ metaKcal: 2100, pesoKg: 85 }));
  const t = totalDia(c);
  const v = validaCardapio(c);
  ok(
    `gerado para a meta do caso real: ${Math.round(t.kcal)} kcal / ${Math.round(t.prot)} P / ${Math.round(t.carb)} C / ${Math.round(t.gord)} G → ${v.nivel}`,
    v.nivel === "excelente" || v.nivel === "bom"
  );
  ok("gordura gerada fica a menos de 20% da meta (o bug era -59%)", Math.abs(t.gord - c.metaGord) <= c.metaGord * 0.2, `${Math.round(t.gord)}/${Math.round(c.metaGord)} g`);
  ok("carboidrato gerado fica a menos de 15% da meta (o bug era +20%)", Math.abs(t.carb - c.metaCarb) <= c.metaCarb * 0.15, `${Math.round(t.carb)}/${Math.round(c.metaCarb)} g`);
}

/** Nenhum cardápio comum sai com limite duro estourado. */
{
  let incompativeis = 0;
  const casos: PedidoCardapio[] = [];
  for (const dieta of ["onivoro", "vegetariano"] as const) {
    for (const metaKcal of [1500, 1800, 2100, 2500, 3000]) {
      for (const refeicoes of [3, 4, 5]) casos.push(pedido({ dieta, metaKcal, refeicoes }));
    }
  }
  for (const p of casos) if (validaCardapio(geraCardapio(p)).nivel === "incompativel") incompativeis++;
  ok(`nenhum dos ${casos.length} cardápios onívoro/vegetariano comuns sai incompatível`, incompativeis === 0, `${incompativeis} incompatíveis`);
}

/** TESTE 5 — nenhuma refeição absurda: cada uma fica perto da fatia dela. */
{
  const desvios: string[] = [];
  for (const refeicoes of [3, 4, 5]) {
    const c = geraCardapio(pedido({ refeicoes, metaKcal: 2200, pesoKg: 85 }));
    for (const r of c.refeicoes) {
      const razao = totalRefeicao(r).kcal / r.alvoKcal;
      if (razao < 0.5 || razao > 1.7) desvios.push(`${refeicoes}ref/${r.momento}: ${razao.toFixed(2)}×`);
    }
  }
  ok("com 3, 4 e 5 refeições, nenhuma fica gigante nem mirrada (0,5×–1,7× da fatia)", desvios.length === 0, desvios.join(", "));
}

/** A classificação nutricional que guia o ajuste. */
ok("azeite é gorduroso, frango é proteico, arroz é carbo, ovo é misto",
  perfilNutricional(ALIMENTO_CARDAPIO_POR_ID.get("azeite")!) === "gorduroso" &&
  perfilNutricional(ALIMENTO_CARDAPIO_POR_ID.get("frango-grelhado")!) === "proteico" &&
  perfilNutricional(ALIMENTO_CARDAPIO_POR_ID.get("arroz-branco")!) === "carbo" &&
  perfilNutricional(ALIMENTO_CARDAPIO_POR_ID.get("ovo-cozido")!) === "misto");

/** As constantes do contrato: tolerâncias ideais e limites duros. */
ok("tolerâncias ideais: ±5% kcal, ±10% P, ±10% C, ±15% G",
  TOLERANCIA_IDEAL.kcal === 0.05 && TOLERANCIA_IDEAL.prot === 0.1 && TOLERANCIA_IDEAL.carb === 0.1 && TOLERANCIA_IDEAL.gord === 0.15);
ok("limites duros: kcal ±8%, proteína -15%, gordura -20%",
  LIMITE_DURO.kcal === 0.08 && LIMITE_DURO.protAbaixo === 0.15 && LIMITE_DURO.gordAbaixo === 0.2);
ok("o piso de proteína do texto (85%) é o mesmo do limite duro", Math.abs(PISO_PROTEINA - (1 - LIMITE_DURO.protAbaixo)) < 1e-9);

console.log("\n" + "=".repeat(64) + "\nSUBSTITUIÇÕES\n" + "=".repeat(64));

const base = geraCardapio(pedido());
const almoco = base.refeicoes.find((r) => r.momento === "almoco")!;
const itemArroz = almoco.itens.find((i) => ALIMENTO_CARDAPIO_POR_ID.get(i.alimentoId)!.grupo === "carbo-base");
ok("o almoço tem um carboidrato para trocar", itemArroz !== undefined);
if (itemArroz) {
  const alts = alternativas(itemArroz, "almoco", pedido(), almoco.itens.map((i) => i.alimentoId));
  ok("existem alternativas para o carboidrato", alts.length >= 2, String(alts.length));
  const kcalOriginal = nutrientes(ALIMENTO_CARDAPIO_POR_ID.get(itemArroz.alimentoId)!, itemArroz.porcoes).kcal;
  ok(
    "toda alternativa fica a ±35% das kcal do item que sai (equivalência por caloria, não por peso)",
    alts.every(({ alimento, porcoes }) => {
      const kcal = nutrientes(alimento, porcoes).kcal;
      return kcal >= kcalOriginal * 0.65 && kcal <= kcalOriginal * 1.35;
    })
  );
  ok("nenhuma alternativa repete alimento já na refeição", alts.every(({ alimento }) => !almoco.itens.some((i) => i.alimentoId === alimento.id)));
  ok("alternativas respeitam o grupo", alts.every(({ alimento }) => alimento.grupo === "carbo-base"));
}
/**
 * A troca preserva função nutricional, não só caloria: quem troca a fonte
 * proteica do almoço não pode receber algo com calorias parecidas e quase
 * nenhuma proteína.
 */
{
  const itemProt = almoco.itens.find((i) => {
    const a = ALIMENTO_CARDAPIO_POR_ID.get(i.alimentoId)!;
    return a.grupo === "proteina-animal" || a.grupo === "proteina-vegetal";
  })!;
  const protSai = nutrientes(ALIMENTO_CARDAPIO_POR_ID.get(itemProt.alimentoId)!, itemProt.porcoes).prot;
  const altsProt = alternativas(itemProt, "almoco", pedido(), almoco.itens.map((i) => i.alimentoId));
  ok(
    "trocar a fonte proteica mantém pelo menos 60% da proteína que sai",
    protSai < 10 || altsProt.every(({ alimento, porcoes }) => nutrientes(alimento, porcoes).prot >= protSai * 0.6),
    altsProt.map(({ alimento, porcoes }) => `${alimento.id}: ${nutrientes(alimento, porcoes).prot.toFixed(1)} g vs ${protSai.toFixed(1)} g`).join(", ")
  );
}

/** Restrição também vale na troca: sem glúten não pode oferecer macarrão. */
const semGluten = pedido({ restricoes: ["gluten"] });
const cGluten = geraCardapio(semGluten);
const almocoG = cGluten.refeicoes.find((r) => r.momento === "almoco")!;
const carbG = almocoG.itens.find((i) => ALIMENTO_CARDAPIO_POR_ID.get(i.alimentoId)!.grupo === "carbo-base")!;
ok(
  "a troca nunca oferece alimento restrito",
  alternativas(carbG, "almoco", semGluten, almocoG.itens.map((i) => i.alimentoId)).every(({ alimento }) => !alimento.exclusoes.includes("gluten"))
);

console.log("\n" + "=".repeat(64) + "\nSEMANA E LISTA DE COMPRAS\n" + "=".repeat(64));

const p7 = pedido();
const dia = geraCardapio(p7);
const repetida = geraSemana(dia, p7, "repetir");
ok("semana 'repetir' tem 7 dias iguais", repetida.length === 7 && repetida.every((d) => d === repetida[0]));
const variada = geraSemana(dia, p7, "um-pouco");
ok("semana 'um pouco' alterna 2 versões", variada[0] !== variada[1] && variada[0] === variada[2]);
ok(
  "as versões variadas continuam dentro da tolerância",
  variada.every((d) => {
    const t = totalDia(d);
    return Math.abs(t.kcal - d.metaKcal) <= d.metaKcal * (TOLERANCIA_KCAL + 0.05);
  }),
  "a variação troca por equivalente calórico; se sair da margem, a troca está errada"
);

/**
 * "Gerar outra versão" num motor determinístico é uma contradição: regerar
 * com as mesmas respostas devolve o mesmo prato, e o botão parece quebrado.
 * A variação tem que ser pedida explicitamente — e continuar equilibrada.
 */
{
  const v1 = proximaVersao(dia, p7);
  ok("existe uma próxima versão do dia", v1 !== null);
  if (v1) {
    const ids = (c: typeof dia) => c.refeicoes.flatMap((r) => r.itens.map((i) => i.alimentoId)).join(",");
    ok("a outra versão é realmente diferente do cardápio original", ids(v1) !== ids(dia), ids(v1));
    const val = validaCardapio(v1);
    ok(
      `a outra versão continua equilibrada (${Math.round(totalDia(v1).kcal)} kcal, nível ${val.nivel})`,
      val.nivel !== "incompativel",
      JSON.stringify(val)
    );
    ok(
      "a outra versão respeita dieta, restrições e porções caseiras",
      v1.refeicoes.every((r) =>
        r.itens.every((it) => {
          const a = ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId)!;
          return permitido(a, p7.dieta, p7.restricoes) && Math.round(it.porcoes / a.passo) * a.passo === it.porcoes && it.porcoes <= a.maxPorcoes;
        })
      )
    );
  }
  ok(
    "pedir outra versão é determinístico como o resto do motor",
    JSON.stringify(proximaVersao(dia, p7)) === JSON.stringify(proximaVersao(dia, p7))
  );
  {
    const componenteBotao = fs.readFileSync("components/cardapio/MonteSeuCardapio.tsx", "utf8");
    ok(
      "o botão 'gerar outra versão' pede variação, não regera o mesmo",
      /Gerar outra vers/.test(componenteBotao) && /onClick=\{\(\) => outraVersao\(pedido\)\}/.test(componenteBotao),
      "chamar gerar() ali devolveria o cardápio idêntico — botão que não faz nada"
    );
    ok("e quando não há variação possível, a ferramenta diz isso", /SEM_VARIACAO/.test(componenteBotao));
  }
}

/**
 * Rolagem: um wizard muda de altura a cada etapa. Sem reancorar, o clique em
 * "recomeçar" no fim de uma tela longa deixa a pessoa no texto que vem
 * DEPOIS da ferramenta — foi exatamente o que aconteceu em produção.
 */
{
  const comp = fs.readFileSync("components/cardapio/MonteSeuCardapio.tsx", "utf8");
  ok("o card reancora a cada mudança de etapa", /ancoraNoTopo\(raiz\.current\)/.test(comp) && /\[carregado, e\.etapa, e\.momentoIdx\]/.test(comp));
  ok("e reserva a folga do header fixo", /scroll-mt-\d+/.test(comp));
  const quiz = fs.readFileSync("components/academias/AcademiaQuiz.tsx", "utf8");
  ok("o quiz de academia reancora do mesmo jeito", /ancoraNoTopo\(raiz\.current\)/.test(quiz) && /scroll-mt-\d+/.test(quiz));
}

const lista = listaDeCompras(repetida);
ok("a lista de compras cobre todos os alimentos da semana", lista.length === new Set(repetida[0].refeicoes.flatMap((r) => r.itens.map((i) => i.alimentoId))).size);
ok("itens unitários saem em unidades", lista.filter((i) => i.quantidade.endsWith(" un")).length >= 2, lista.map((i) => `${i.nome}:${i.quantidade}`).join(", "));
ok("pesos saem redondos (múltiplos de 100 g ou kg)", lista.every((i) => /(\d+00 g|\d+,\d kg|\d+ un)$/.test(i.quantidade)), lista.map((i) => i.quantidade).join(", "));
ok("toda entrada tem categoria de mercado", lista.every((i) => i.categoria.length > 0));

console.log("\n" + "=".repeat(64) + "\nSEGURANÇA\n" + "=".repeat(64));

ok("o piso de geração automática é 1.200 kcal", KCAL_MIN_CARDAPIO === 1200);
ok(
  "as quatro situações especiais estão listadas",
  SITUACOES_ESPECIAIS.length === 4 && SITUACOES_ESPECIAIS.some((s) => s.id === "ta") && SITUACOES_ESPECIAIS.some((s) => s.id === "gestacao")
);

const componente = fs.readFileSync("components/cardapio/MonteSeuCardapio.tsx", "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
/**
 * Situação especial: consentimento informado, não bloqueio.
 *
 * A ferramenta travava nessas situações. A intenção era boa e o efeito era
 * ruim — quem convive com uma condição há anos ficava sem nem a parte
 * educativa, sem entender o motivo. O contrato agora é: a orientação vem
 * ANTES, com o motivo específico da situação marcada, e a pessoa escolhe.
 * Estes testes travam as três partes que fazem isso ser consentimento e
 * não teatro: a orientação precede a escolha, existe saída para falar com
 * gente, e o lembrete persiste no resultado.
 */
{
  const semImports = componente.replace(/^import [\s\S]*?} from "@\/lib\/cardapio\/motor";$/m, "");
  const iOrientacao = semImports.indexOf("ORIENTACAO_ESPECIAL");
  const iEscolha = semImports.indexOf("Entendi — quero ver a simulação");
  const iComecar = semImports.indexOf("Começar meu cardápio");
  ok("a orientação aparece antes da escolha", iOrientacao > -1 && iEscolha > iOrientacao, `orientação em ${iOrientacao}, escolha em ${iEscolha}`);
  ok("e antes do botão que inicia o cardápio", iComecar > iOrientacao, `começar em ${iComecar}`);
  ok(
    "a simulação só segue com consentimento explícito",
    /situacaoEspecial && !e\.consentiu \?/.test(semImports) && /consentiu: true/.test(semImports)
  );
  ok("existe a saída de falar com gente antes de decidir", /Prefiro tirar dúvidas antes/.test(semImports));
  ok(
    "desmarcar ou trocar a situação derruba o consentimento",
    (semImports.match(/consentiu: false/g) ?? []).length >= 2,
    "consentimento dado para uma situação não pode valer para outra"
  );
  {
    /**
     * O lembrete aparece duas vezes: no aviso da tela de segurança e no
     * resultado. O do resultado é o que importa aqui — ele tem que estar
     * DEPOIS do início do bloco de resultado e num container sem
     * print:hidden, senão some justamente no papel que vira "minha dieta".
     */
    const iResultado = semImports.indexOf('e.etapa === "resultado"');
    const noResultado = semImports.indexOf("LEMBRETE_SITUACAO_ESPECIAL", iResultado);
    const bloco = semImports.slice(Math.max(noResultado - 300, 0), noResultado);
    ok(
      "o lembrete acompanha o resultado de quem seguiu",
      iResultado > -1 && noResultado > iResultado && /situacaoEspecial &&/.test(bloco)
    );
    ok("e não some na impressão", !/print:hidden/.test(bloco), bloco.slice(-160));
  }
  ok(
    "cada uma das quatro situações tem a explicação dela",
    SITUACOES_ESPECIAIS.every((s) => (ORIENTACAO_POR_SITUACAO[s.id] ?? "").length > 60),
    SITUACOES_ESPECIAIS.filter((s) => !ORIENTACAO_POR_SITUACAO[s.id]).map((s) => s.id).join(", ")
  );
  ok(
    "a de transtorno alimentar oferece saída sem culpa",
    /feche/i.test(ORIENTACAO_POR_SITUACAO.ta) && /n[ãa]o\s\w*\s?falha/i.test(ORIENTACAO_POR_SITUACAO.ta),
    ORIENTACAO_POR_SITUACAO.ta
  );
  ok(
    "a orientação diz que o profissional vale mais, sem rodeio",
    /profissional/i.test(ORIENTACAO_ESPECIAL) && /(nutricionista|médico)/i.test(ORIENTACAO_ESPECIAL)
  );
  /** O evento de consentimento não pode carregar dado de saúde. */
  const eventoConsent = semImports.match(/trackEvent\("meal_planner_special_continue"[^)]*\)/)?.[0] ?? "";
  ok(
    "seguir mesmo assim não manda a situação para o Analytics",
    eventoConsent.length > 0 && !/gestacao|menor|clinica|\bta\b|situac/i.test(eventoConsent),
    eventoConsent
  );
}
ok("meta abaixo do piso mostra a mensagem em vez de gerar", /MENSAGEM_META_BAIXA/.test(componente) && /kcalBaixa/.test(componente));

const libSrc = fs.readFileSync("lib/cardapio/motor.ts", "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const pagina = fs.readFileSync("app/ferramentas/monte-seu-cardapio/page.tsx", "utf8");
const paginaSemComentarios = pagina.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const tudo = componente + libSrc + paginaSemComentarios;
const PROIBIDO: [RegExp, string][] = [
  [/sua dieta est[áa] pronta|esta [ée] a sua dieta/i, "sugestão educacional, nunca 'sua dieta'"],
  [/voc[êe] (vai|ir[áa]) perder \d|perca \d+\s?kg/i, "promessa de resultado"],
  [/detox|milagros|acelere? o metabolismo|alimento proibido/i, "terrorismo alimentar / mito"],
  [/\d{2,3}% (adequado|compat[íi]vel|ideal) para voc[êe]/i, "score científico inventado"],
  [/exatamente \d[\d.,]* ?kcal/i, "falsa precisão"],
];
for (const [re, motivo] of PROIBIDO) {
  ok(`nenhum texto contém ${re}`, !re.test(tudo), motivo);
}
ok("o aviso educacional existe e é discreto", /AVISO_EDUCACIONAL/.test(componente) && !/(ATENÇÃO|CUIDADO)!/.test(tudo));

console.log("\n" + "=".repeat(64) + "\nPRIVACIDADE E EVENTOS\n" + "=".repeat(64));

const analytics = fs.readFileSync("lib/analytics.ts", "utf8");
for (const ev of [
  "meal_planner_view", "meal_planner_start", "meal_planner_goal_selected", "meal_planner_preferences_complete",
  "meal_plan_generated", "meal_swap_clicked", "meal_swapped", "weekly_plan_generated",
  "shopping_list_generated", "meal_plan_saved", "meal_methodology_open", "meal_article_click", "meal_cta_click",
]) {
  ok(`evento declarado: ${ev}`, analytics.includes(`"${ev}"`));
}
const chamadas = componente.match(/track(Event|OncePerSession)\([^)]*\)/g) ?? [];
ok("existem chamadas de analytics para auditar", chamadas.length > 0);
const SENSIVEL = /kcalTexto|pesoTexto|habituais|restricoes|situacoes|alimentoId|metaKcal|pesoKg/;
ok(
  "nenhuma chamada carrega resposta, meta, peso ou alimento",
  chamadas.every((c) => !SENSIVEL.test(c)),
  chamadas.filter((c) => SENSIVEL.test(c)).join(" | ")
);
ok("nenhuma chamada de rede", !/fetch\(|axios|XMLHttpRequest/.test(componente));
ok("só fala com sessionStorage pela ponte", !/sessionStorage/.test(componente) && /consomeNumero\(PONTE\./.test(componente));
ok("o salvamento local é declarado na interface", /salvas neste dispositivo/.test(componente));
ok("existe recomeçar que apaga tudo", /removeItem\(CHAVE\)/.test(componente));
ok("o resultado nunca vira URL (sem router, sem searchParams)", !/useSearchParams|useRouter|router\.push/.test(componente));

console.log("\n" + "=".repeat(64) + "\nUX E ACESSIBILIDADE\n" + "=".repeat(64));

ok("é um wizard com progresso e voltar", /progresso/.test(componente) && /← Voltar/.test(componente));
ok("teclado decimal nos campos numéricos", (componente.match(/inputMode="decimal"/g) ?? []).length >= 2);
ok("resultado anunciado por aria-live", /aria-live="polite"/.test(componente));
ok("estados com aria-pressed e aria-expanded", /aria-pressed/.test(componente) && /aria-expanded/.test(componente));
ok("alvos de toque adequados", (componente.match(/min-h-\[4[048]px\]|min-h-\[5[26]px\]/g) ?? []).length >= 6);
ok("erro humano, sem grito", /Confira as calorias|Confira o peso/.test(componente) && !/ERRO!|INVALID/.test(componente));
ok("checkbox da lista não depende só de cor", /☑|☐/.test(componente) && /line-through/.test(componente));
ok("controles somem na impressão", (componente.match(/print:hidden/g) ?? []).length >= 5);
ok("o chalalá aparece uma vez, discreto", (componente.match(/chalalá/g) ?? []).length === 1);
ok("estado vazio de troca não inventa", /SEM_ALTERNATIVA/.test(componente));
ok("estado corrompido tem recuperação, não tela branca", /Faltou alguma resposta/.test(componente));
/**
 * O bug do card vazio: as respostas persistem, o cardápio não. Quem
 * recarregava a página na tela de resultado voltava com etapa="resultado" e
 * cardapio=null — nenhum bloco casava e a ferramenta sumia. Tem que haver
 * uma rota de volta: regenerar (motor determinístico) ou devolver à
 * pergunta anterior.
 */
ok(
  "recarregar na tela de resultado não deixa a ferramenta vazia",
  /etapa !== "resultado" \|\| cardapio\) return;[\s\S]{0,200}?gerar\(pedido\)[\s\S]{0,120}?etapa: "habituais"/.test(componente),
  "sem essa recuperação, quem volta ao site na tela de resultado vê um card em branco"
);

console.log("\n" + "=".repeat(64) + "\nSEO E ECOSSISTEMA\n" + "=".repeat(64));

ok("canonical para ela mesma", /canonical: `\$\{SITE_URL\}\/ferramentas\/monte-seu-cardapio`/.test(pagina));
ok("declara openGraph e H1", /openGraph:/.test(pagina) && /<h1/.test(pagina));
ok("tem conteúdo editorial de verdade", (pagina.match(/<h2/g) ?? []).length >= 6 && pagina.length > 8000);
ok(
  "BreadcrumbList, sem FAQPage nem schema inventado",
  /BreadcrumbList/.test(paginaSemComentarios) && !/FAQPage|AggregateRating|"Review"|SoftwareApplication/.test(paginaSemComentarios)
);
ok("está no sitemap", fs.readFileSync("app/sitemap.ts", "utf8").includes("/ferramentas/monte-seu-cardapio"));
ok("está na central /ferramentas", fs.readFileSync("app/ferramentas/page.tsx", "utf8").includes("/ferramentas/monte-seu-cardapio"));
{
  const paginaNome = fs.readFileSync("app/ferramentas/monte-seu-cardapio/page.tsx", "utf8");
  const compNome = fs.readFileSync("components/cardapio/MonteSeuCardapio.tsx", "utf8");
  ok(
    "chama Montinho FitChef e mantém a frase 'monte seu cardápio com o Montinho'",
    /Montinho FitChef/.test(paginaNome) && /Monte seu cardápio com o Montinho/.test(paginaNome) &&
      /Montinho FitChef/.test(compNome) && /Monte seu cardápio com o Montinho/.test(compNome)
  );
  ok("o batismo não mudou a URL nem a canonical", paginaNome.includes("/ferramentas/monte-seu-cardapio"));
}

const deficit = fs.readFileSync("components/calorias/CalculadoraDeficit.tsx", "utf8");
const macros = fs.readFileSync("components/macros/CalculadoraMacros.tsx", "utf8");
ok("o déficit leva para o cardápio", deficit.includes("/ferramentas/monte-seu-cardapio"));
ok("os macros levam para o cardápio", macros.includes("/ferramentas/monte-seu-cardapio"));
ok("o cardápio leva de volta para o déficit", componente.includes("/ferramentas/calculadora-deficit-calorico"));

/** Todo artigo roteado por objetivo precisa existir de verdade. */
const slugs = new Set(blogPosts.map((p) => p.slug));
for (const [objetivo, artigos] of Object.entries(ARTIGOS_POR_OBJETIVO)) {
  for (const art of artigos) {
    const slug = art.href.replace("/blog/", "");
    ok(`artigo roteado (${objetivo}) existe: ${slug}`, slugs.has(slug));
  }
}
const internos = [...pagina.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)].map((m) => m[1]);
for (const s of internos) ok(`link interno da página existe: ${s}`, slugs.has(s));

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM\n" : `\n${falhas} TESTE(S) FALHARAM\n`);
process.exit(falhas === 0 ? 0 : 1);
