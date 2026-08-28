/**
 * Testes do motor do Destrave Seu Corpo.
 *   npx tsx scripts/mobilidade-test.ts
 * Sai com código 1 se algo falhar.
 *
 * O que estes testes protegem é diferente do usual. Não é só "a função devolve
 * o número certo": as travas aqui são de SEGURANÇA e de HONESTIDADE, e são o
 * tipo de coisa que quebra silenciosamente numa refatoração inocente. Um
 * exercício estático que ganhe "pre" na lista de momentos passaria despercebido
 * em qualquer revisão de código — e faria a ferramenta prescrever algo que
 * derruba a força da pessoa no treino.
 *
 * Por isso os testes 4, 5 e 9 valem mais que todos os outros juntos.
 */

import { readFileSync } from "fs";
import {
  REGIOES,
  adiadas,
  classificaMedida,
  comparaRegiao,
  geraProtocolo,
  montaMapa,
  priorizar,
  selecionaTestes,
  validaProtocolo,
} from "../lib/mobilidade/motor";
import { EXERCICIOS, NOTA_FOAM_ROLLER } from "../lib/mobilidade/exercicios";
import { TESTES, TESTE_POR_ID, TELA_AGACHAMENTO } from "../lib/mobilidade/testes";
import { ITENS_TRIAGEM, temBandeira, BLOQUEIO } from "../lib/mobilidade/triagem";
import { ALVO_SEMANAL_SEGUNDOS, FONTES, TETO_ESTATICO_PRE } from "../lib/mobilidade/evidencia";
import type { Contexto, EstadoRegiao, Resposta } from "../lib/mobilidade/tipos";
import { blogPosts } from "../lib/blog";
import { ARTIGOS_COM_TESTE_MOBILIDADE, SLUGS_COM_TESTE_MOBILIDADE } from "../lib/mobilidade/artigos";
import { AVISO_HISTORICO } from "../lib/mobilidade/historico";
import { FIGURAS_EXERCICIO, figuraDoExercicio, figurasDoTeste } from "../lib/mobilidade/figuras";

let falhas = 0;
function check(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

const ctx = (o: Partial<Contexto> = {}): Contexto => ({
  frequencia: "3-4",
  objetivo: "hipertrofia",
  dificuldades: ["agachamento"],
  rigidez: [],
  momento: "pre",
  minutos: 6,
  diasDeTreino: 2,
  ...o,
});

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. A BATERIA É COERENTE");

check("são 5 testes principais", TESTES.length === 5, `${TESTES.length}`);
check("uma região por teste, sem repetir",
  new Set(TESTES.map((t) => t.regiao)).size === 5);
check("toda região da bateria está em REGIOES",
  TESTES.every((t) => REGIOES.includes(t.regiao)));
check("todo teste tem 3 opções ordenadas de pior para melhor",
  TESTES.every((t) => {
    const o = t.opcoes.map((x) => x.estado);
    return o.length === 3 && o[0] === "prioridade" && o[1] === "melhorar" && o[2] === "boa";
  }));
check("todo teste diz por que importa e o que influencia",
  TESTES.every((t) => t.porqueImporta.length > 20 && t.influencia.length > 0));
check("só o knee-to-wall aceita medida numérica",
  TESTES.filter((t) => t.medivel).map((t) => t.id).join() === "knee-to-wall");
check("a tela de agachamento não produz estado (só direciona)",
  TELA_AGACHAMENTO.observacoes.every((o) => !("estado" in o)));
check("toda observação da tela direciona regiões válidas",
  TELA_AGACHAMENTO.observacoes.every((o) =>
    o.direciona.every((r) => (REGIOES as string[]).includes(r))));

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. AS DUAS RÉGUAS NUNCA SE MISTURAM");

check("12 cm → boa", classificaMedida(12, "cm") === "boa");
check("10 cm → pode melhorar", classificaMedida(10, "cm") === "melhorar");
check("8 cm → prioridade", classificaMedida(8, "cm") === "prioridade");
check("6 dedos → boa", classificaMedida(6, "dedos") === "boa");
check("5 dedos → pode melhorar", classificaMedida(5, "dedos") === "melhorar");
check("3 dedos → prioridade", classificaMedida(3, "dedos") === "prioridade");
// A trava real: 6 é "boa" em dedos e "prioridade" em cm. Se as escalas se
// misturassem em algum ponto do código, este par deixaria de divergir.
check("a MESMA leitura muda de estado conforme a régua",
  classificaMedida(6, "dedos") === "boa" && classificaMedida(6, "cm") === "prioridade");

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. O MAPA DIZ A VERDADE");

const respostasBase: Resposta[] = [
  { testeId: "knee-to-wall", D: 0, E: 0, medidaD: 7, medidaE: 7, unidade: "cm" },
  { testeId: "rotacao-interna-quadril", D: 1, E: 1 },
];
const m1 = montaMapa(respostasBase);
check("tornozelo medido em 7 cm vira prioridade", m1.tornozelo.estado === "prioridade");
check("quadril responde a opção do meio", m1.quadril.estado === "melhorar");
check("região não testada fica 'naoAvaliado', não 'boa'",
  m1.ombro.estado === "naoAvaliado" && m1.posterior.estado === "naoAvaliado");
check("a medida bruta é guardada para o reteste",
  m1.tornozelo.medida?.D === 7 && m1.tornozelo.medida?.unidade === "cm");

const mPior = montaMapa([{ testeId: "elevacao-perna", D: 0, E: 2 }]);
check("a região assume o PIOR lado, nunca a média",
  mPior.posterior.estado === "prioridade");
check("dois degraus de diferença marcam assimetria", mPior.posterior.assimetria === true);
const mLeve = montaMapa([{ testeId: "elevacao-perna", D: 1, E: 2 }]);
check("um degrau NÃO vira assimetria (diferença pequena é comum)",
  mLeve.posterior.assimetria === false);

const mSkip = montaMapa([{ testeId: "rotacao-toracica", D: "naoConsegui", E: "naoConsegui" }]);
check("'não consegui avaliar' deixa a região sem avaliação, e não em prioridade",
  mSkip.toracica.estado === "naoAvaliado");

// ─── 4 ── A TRAVA DO BEHM ───────────────────────────────────────────────────
bloco("4. NENHUM ALONGAMENTO LONGO ANTES DO TREINO");

const estaticos = EXERCICIOS.filter((e) => e.tipo === "estatico");
check("existem exercícios estáticos no banco", estaticos.length >= 3);
check("NENHUM estático se declara liberado para pré-treino",
  estaticos.every((e) => !e.momentos.includes("pre")),
  estaticos.filter((e) => e.momentos.includes("pre")).map((e) => e.id).join());

// Verificação por mutação: se a trava fosse só de dados, um estático com "pre"
// passaria pelo motor. Aqui provamos que o validador o pegaria.
const falso = {
  ...estaticos[0],
  momentos: ["pre" as const],
  segundosPorLado: { pre: 120 },
};
const protoFalso = {
  a: { titulo: "x", itens: [{ exercicio: falso, dose: "", momento: "pre" as const }], frequencia: 2 },
  b: null, planoB: { exercicio: falso, dose: "", momento: "pre" as const },
  volumeSemanal: {}, minutosPorSessao: 6 as const,
};
check("o validador REPROVA 120s estáticos no pré-treino",
  validaProtocolo(protoFalso).ok === false);
check("e diz qual é o teto na mensagem",
  validaProtocolo(protoFalso).problemas.some((p) => p.includes(String(TETO_ESTATICO_PRE))));

// ─── 5 ── A TRAVA DO TETO ───────────────────────────────────────────────────
bloco("5. NUNCA MAIS DE 2 PRIORIDADES E 4 EXERCÍCIOS");

const tudoRuim = montaMapa([
  { testeId: "knee-to-wall", D: 0, E: 0, medidaD: 6, medidaE: 6, unidade: "cm" },
  { testeId: "flexao-ombro-parede", D: 0 },
  { testeId: "rotacao-toracica", D: 0, E: 0 },
  { testeId: "rotacao-interna-quadril", D: 0, E: 0 },
  { testeId: "elevacao-perna", D: 0, E: 0 },
]);
const p5 = priorizar(tudoRuim, ctx());
check("cinco regiões em prioridade ainda devolvem 2", p5.length === 2, `${p5.length}`);
check("as outras 3 aparecem como adiadas, não somem",
  adiadas(tudoRuim, p5).length === 3);

for (const min of [3, 6, 10] as const) {
  const proto = geraProtocolo(p5, ctx({ minutos: min }))!;
  const total = proto.a.itens.length + (proto.b?.itens.length ?? 0);
  check(`${min} min: no máximo 4 exercícios no total`, total <= 4, `${total}`);
  check(`${min} min: o protocolo passa na validação`, validaProtocolo(proto).ok,
    validaProtocolo(proto).problemas.join(" | "));
}

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. A PRIORIZAÇÃO SEGUE A DOR DECLARADA");

const mistoMapa = montaMapa([
  { testeId: "knee-to-wall", D: 1, E: 1, medidaD: 10, medidaE: 10, unidade: "cm" },
  { testeId: "flexao-ombro-parede", D: 1 },
]);
const pAgacho = priorizar(mistoMapa, ctx({ dificuldades: ["agachamento"] }));
check("quem reclama do agachamento recebe tornozelo em 1º",
  pAgacho[0]?.regiao === "tornozelo", pAgacho[0]?.regiao);
const pDesenv = priorizar(mistoMapa, ctx({ dificuldades: ["desenvolvimento"] }));
check("quem reclama do desenvolvimento recebe ombro em 1º",
  pDesenv[0]?.regiao === "ombro", pDesenv[0]?.regiao);
check("severidade vence relevância: prioridade real passa na frente",
  priorizar(
    montaMapa([
      { testeId: "knee-to-wall", D: 1, E: 1, medidaD: 10, medidaE: 10, unidade: "cm" },
      { testeId: "flexao-ombro-parede", D: 0 },
    ]),
    ctx({ dificuldades: ["agachamento"] }),
  )[0].regiao === "ombro");
check("cada prioridade explica por que subiu",
  pAgacho.every((p) => p.motivo.length > 10));
check("e diz quais exercícios de musculação ela influencia",
  pAgacho.every((p) => p.influencia.length > 0));

// ─── 7 ──────────────────────────────────────────────────────────────────────
bloco("7. O TESTE É MESMO ADAPTATIVO");

check("sem dificuldade declarada → bateria completa",
  selecionaTestes([], []).length === 5);
check("'nenhuma' → bateria completa",
  selecionaTestes(["nenhuma"], []).length === 5);
const sel = selecionaTestes(["agachamento"], []);
check("uma dificuldade → no mínimo 3 testes", sel.length >= 3, `${sel.length}`);
check("e no máximo 5", sel.length <= 5);
check("agachamento seleciona tornozelo e quadril",
  sel.includes("knee-to-wall") && sel.includes("rotacao-interna-quadril"));
check("a tela do agachamento acrescenta região",
  selecionaTestes(["desenvolvimento"], ["tornozelo"]).includes("knee-to-wall"));

// ─── 8 ── A DOSE DO INGRAM ──────────────────────────────────────────────────
bloco("8. O VOLUME SEMANAL PERSEGUE OS 10 MINUTOS");

const soTornozelo = priorizar(
  montaMapa([{ testeId: "knee-to-wall", D: 0, E: 0, medidaD: 7, medidaE: 7, unidade: "cm" }]),
  ctx(),
);
const protoT = geraProtocolo(soTornozelo, ctx({ minutos: 6, momento: "pre" }))!;
check("pré-treino gera DOIS protocolos (A dinâmico, B estático)",
  protoT.b !== null && protoT.b.itens.length > 0);
check("o protocolo A não tem nenhum estático",
  protoT.a.itens.every((i) => i.exercicio.tipo !== "estatico"));
check("o protocolo B carrega o alongamento sustentado",
  protoT.b!.itens.every((i) => i.exercicio.tipo === "estatico"));
const cob = validaProtocolo(protoT).cobertura.tornozelo ?? 0;
check("o tornozelo recebe volume semanal na faixa do alvo",
  cob >= 60 && cob <= 130, `${cob}% de ${ALVO_SEMANAL_SEGUNDOS}s`);

const protoIso = geraProtocolo(soTornozelo, ctx({ momento: "isolada" }))!;
check("sessão isolada não gera protocolo B", protoIso.b === null);
check("e pode usar estático livremente",
  protoIso.a.itens.some((i) => i.exercicio.tipo === "estatico"));

check("todo protocolo entrega um plano B de 1 exercício",
  !!protoT.planoB && !!protoIso.planoB);

// ─── 9 ── HONESTIDADE ───────────────────────────────────────────────────────
bloco("9. A FERRAMENTA NÃO INVENTA EVOLUÇÃO");

const antes: EstadoRegiao = { regiao: "tornozelo", estado: "prioridade", assimetria: false,
  medida: { D: 7, E: 7, unidade: "cm" } };
const agoraCm: EstadoRegiao = { regiao: "tornozelo", estado: "melhorar", assimetria: false,
  medida: { D: 10, E: 10, unidade: "cm" } };
check("mesma régua, medida maior → melhorou",
  comparaRegiao(antes, agoraCm).direcao === "melhorou");

const agoraDedos: EstadoRegiao = { regiao: "tornozelo", estado: "boa", assimetria: false,
  medida: { D: 6, E: 6, unidade: "dedos" } };
const cmp = comparaRegiao(antes, agoraDedos);
check("réguas diferentes → INCOMPARÁVEL, nunca conversão",
  cmp.direcao === "incomparavel", cmp.direcao);
check("e a frase manda usar a mesma medida da primeira vez",
  /mesma medida/.test(cmp.frase));

const igual = comparaRegiao(antes, { ...antes });
check("sem mudança, a ferramenta DIZ que não mudou", igual.direcao === "igual");
check("e não culpa a pessoa por isso", /acontece/.test(igual.frase));

// ─── 10 ── LINGUAGEM ────────────────────────────────────────────────────────
bloco("10. NENHUMA PALAVRA DE DIAGNÓSTICO EM LUGAR NENHUM");

const arquivos = [
  "lib/mobilidade/testes.ts", "lib/mobilidade/exercicios.ts",
  "lib/mobilidade/motor.ts", "lib/mobilidade/triagem.ts",
  "lib/mobilidade/evidencia.ts", "lib/mobilidade/tipos.ts",
];
// Só o texto que a pessoa lê: comentários são para quem mantém o código.
const semComentarios = (s: string) =>
  s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const prosa = arquivos.map((f) => semComentarios(readFileSync(f, "utf8"))).join("\n");

const proibidas = [
  "encurtado", "encurtamento", "travado", "desalinhad", "disfunção",
  "síndrome", "lesionad", "patolog", "corrigir sua postura", "está causando",
];
for (const p of proibidas) {
  check(`nunca diz "${p}"`, !new RegExp(p, "i").test(prosa));
}
/**
 * Prevenção de lesão só pode aparecer NEGADA.
 *
 * A primeira versão deste teste procurava a palavra e reprovava — e reprovou a
 * frase que existe justamente para dizer que a ferramenta não previne nada. O
 * teste certo não é "a palavra sumiu": é "toda frase que fala de prevenção
 * carrega a negação junto", que é a mesma regra que os bordões já usam.
 */
/**
 * Os identificadores saem antes da varredura. NAO_PREVINE_LESAO é o nome de
 * uma constante, não uma frase — e casava com o padrão sem carregar o "não"
 * da frase que ela guarda, reprovando justamente o texto que existe para
 * negar a promessa.
 */
const semIdentificadores = prosa.replace(/\b[A-Z][A-Z0-9_]{3,}\b/g, " ");
const frasesPrevencao = (semIdentificadores.match(/[^.!?]+[.!?]*/g) ?? []).filter((f) =>
  /previn|prevenir|evita(r)? (a )?les/i.test(f),
);
check("alguma frase fala de prevenção (senão o teste não prova nada)",
  frasesPrevencao.length > 0);
check("e toda ocorrência de prevenção vem negada",
  frasesPrevencao.every((f) => /\bnão\b|\bnenhuma\b|\bsem\b/i.test(f)),
  frasesPrevencao.filter((f) => !/\bnão\b|\bnenhuma\b|\bsem\b/i.test(f)).join(" | "));
check("nenhum índice 0–100 sobrou no motor",
  !/\b\d{1,2}\s*\/\s*100\b/.test(prosa) && !/indiceMobilidade|scoreGlobal/i.test(prosa));

// ─── 11 ── SEGURANÇA ────────────────────────────────────────────────────────
bloco("11. A TRIAGEM BLOQUEIA SEM ASSUSTAR");

check("os 7 sinais do spec estão na triagem", ITENS_TRIAGEM.length === 8);
check("existe a saída 'nenhum desses'", ITENS_TRIAGEM.some((i) => i.id === "nenhum"));
check("marcar um sinal levanta bandeira", temBandeira(["dor-intensa"]));
check("marcar só 'nenhum' NÃO levanta bandeira", !temBandeira(["nenhum"]));
// "Lesão" aparece no bloqueio de propósito, para DESDRAMATIZAR ("quase nunca
// significam lesão séria"). O que não pode aparecer é o nome de uma condição —
// é isso que seria diagnóstico, e é isso que este teste procura.
check("o bloqueio não nomeia nenhuma condição",
  !/ruptura|hérnia|tendinite|artrose|bursite|luxação|fratura/i.test(BLOQUEIO.corpo));
check("o bloqueio desdramatiza em vez de assustar",
  /quase nunca significam lesão séria/.test(BLOQUEIO.corpo));
check("e encaminha para avaliação individual",
  /avaliação individual/.test(BLOQUEIO.encaminhamento));
check("a dor de treino é excluída explicitamente do item de dor",
  ITENS_TRIAGEM.find((i) => i.id === "dor-intensa")?.ajuda?.includes("Dor muscular de treino") === true);

// ─── 12 ── EVIDÊNCIA ────────────────────────────────────────────────────────
bloco("12. CADA NÚMERO TEM FONTE");

check("são 6 fontes declaradas", FONTES.length === 6);
check("toda fonte tem rótulo, tipo, url e resumo",
  FONTES.every((f) => f.rotulo && f.tipo && f.url.startsWith("http") && f.resumo.length > 40));
check("o alvo semanal é 600s (10 min)", ALVO_SEMANAL_SEGUNDOS === 600);
check("o teto do pré-treino é 30s", TETO_ESTATICO_PRE === 30);
check("o foam roller é opcional e explica o porquê do recorte de 4 semanas",
  /não é obrigatório/.test(NOTA_FOAM_ROLLER) && /quatro semanas/.test(NOTA_FOAM_ROLLER));
check("nenhum exercício exige equipamento",
  EXERCICIOS.every((e) => ["nenhum", "parede", "bastao-opcional", "rolo-opcional"].includes(e.equipamento)));
check("todo exercício responde 'por que estou fazendo isso'",
  EXERCICIOS.every((e) => e.porque.length > 60));
check("todo exercício tem como/sente/evite preenchidos",
  EXERCICIOS.every((e) => e.como && e.senteOnde && e.evite));
check("o campo de vídeo existe e está vazio na v1",
  EXERCICIOS.every((e) => e.video === undefined) &&
  TESTES.every((t) => t.video === undefined));
check("toda região tem ao menos 2 exercícios",
  REGIOES.every((r) => EXERCICIOS.filter((e) => e.regiao === r).length >= 2));
check("toda região tem ao menos 1 exercício liberado para pré-treino",
  REGIOES.every((r) => EXERCICIOS.some((e) => e.regiao === r && e.momentos.includes("pre"))));

const comp = readFileSync("components/mobilidade/TesteMobilidade.tsx", "utf8").replace(/\s+/g, " ");

// ─── 13 ── AS FIGURAS ───────────────────────────────────────────────────────
bloco("13. TODO TESTE MOSTRA O CERTO E O ERRO");

check("todos os 5 testes têm figuras",
  TESTES.every((t) => figurasDoTeste(t.id) !== null),
  TESTES.filter((t) => !figurasDoTeste(t.id)).map((t) => t.id).join());
check("sempre um par: certo primeiro, erro depois",
  TESTES.every((t) => {
    const f = figurasDoTeste(t.id)!;
    return f.length === 2 && f[0].tipo === "certo" && f[1].tipo === "erro";
  }));

const todasFiguras = TESTES.flatMap((t) => figurasDoTeste(t.id)!);
check("toda figura tem alt descritivo de verdade",
  todasFiguras.every((f) => f.alt.length > 80));
check("nenhum alt é igual a outro",
  new Set(todasFiguras.map((f) => f.alt)).size === todasFiguras.length);
check("toda figura tem corpo desenhado",
  todasFiguras.every((f) => f.segmentos.length >= 3));

/**
 * A trava que pega o bug que apareceu na primeira renderização: rótulo com
 * âncora "start" colocado à direita saía do quadro, e o texto era cortado. O
 * viewBox vai de 0 a 100 e nada pode encostar na borda.
 */
const foraDoQuadro = todasFiguras.flatMap((f) =>
  f.anotacoes
    .filter((a) => a.x < 5 || a.x > 95 || a.y < 5 || a.y > 98)
    .map((a) => `${f.titulo}: "${a.texto}" em ${a.x},${a.y}`),
);
check("nenhum rótulo escapa do quadro", foraDoQuadro.length === 0, foraDoQuadro.join(" | "));

const pontosFora = todasFiguras.flatMap((f) =>
  [
    ...f.segmentos.flatMap((s) => [[s[0], s[1]], [s[2], s[3]]]),
    ...(f.destaque ? [[f.destaque.cx, f.destaque.cy]] : []),
  ].filter(([x, y]) => x < 2 || x > 98 || y < 2 || y > 98),
);
check("nenhum traço do corpo sai do quadro", pontosFora.length === 0,
  pontosFora.map((p) => p.join(",")).join(" | "));

check("a figura do erro nomeia o erro, e não a pessoa",
  todasFiguras
    .filter((f) => f.tipo === "erro")
    .every((f) => f.anotacoes.some((a) => /não vale|subiu|saiu|andou|dobrou|girou|emprestado|veio de fora/.test(a.texto))));

const figuraComp = readFileSync("components/mobilidade/Figura.tsx", "utf8");
check("a figura é componente de servidor (zero JavaScript)",
  !/"use client"/.test(figuraComp) && !/useState|useEffect/.test(figuraComp));
check("a informação nunca depende só da cor: há título escrito e alt",
  /figura.titulo/.test(figuraComp) && /aria-label=\{figura.alt\}/.test(figuraComp));
check("o componente do teste renderiza as duas figuras",
  /figurasDoTeste\(testeAtual\.id\)/.test(comp));

// ─── 13b ── AS FIGURAS DOS EXERCÍCIOS ───────────────────────────────────────
bloco("13b. TODO EXERCÍCIO DO PROTOCOLO TEM DESENHO");

check("os 13 exercícios do banco têm figura",
  EXERCICIOS.every((e) => figuraDoExercicio(e.id) !== null),
  EXERCICIOS.filter((e) => !figuraDoExercicio(e.id)).map((e) => e.id).join());
check("nenhuma figura sobrando sem exercício",
  Object.keys(FIGURAS_EXERCICIO).every((id) => EXERCICIOS.some((e) => e.id === id)));

const figsEx = Object.values(FIGURAS_EXERCICIO);
check("toda figura de exercício tem alt descritivo",
  figsEx.every((f) => f.alt.length > 70));
check("nenhum alt de exercício se repete",
  new Set(figsEx.map((f) => f.alt)).size === figsEx.length);

/**
 * As figuras de exercício aparecem pequenas ao lado do texto. Rótulo de cinco
 * pixels não se lê — seria enfeite fingindo ser informação, e é por isso que
 * elas não têm nenhum.
 */
check("figura de exercício não carrega rótulo (não caberia)",
  figsEx.every((f) => f.anotacoes.length === 0));

/** Movimento contínuo precisa de seta; posição sustentada, não. */
const dinamicos = EXERCICIOS.filter((e) => e.tipo !== "estatico");
check("todo exercício dinâmico mostra a direção do movimento",
  dinamicos.every((e) => figuraDoExercicio(e.id)?.movimento !== undefined),
  dinamicos.filter((e) => !figuraDoExercicio(e.id)?.movimento).map((e) => e.id).join());

const foraEx = figsEx.flatMap((f) =>
  [
    ...f.segmentos.flatMap((s) => [[s[0], s[1]], [s[2], s[3]]]),
    ...(f.destaque ? [[f.destaque.cx, f.destaque.cy]] : []),
    ...(f.movimento ? [[f.movimento.x1, f.movimento.y1], [f.movimento.x2, f.movimento.y2]] : []),
  ].filter(([x, y]) => x < 2 || x > 98 || y < 2 || y > 98),
);
check("nada sai do quadro nas figuras de exercício", foraEx.length === 0,
  foraEx.map((p) => p.join(",")).join(" | "));

check("o card do protocolo renderiza a figura", /figuraDoExercicio\(exercicio\.id\)/.test(comp));
check("a figura do card usa o modo compacto (sem legenda repetindo o nome)",
  /compacta/.test(comp) && /compacta = false/.test(figuraComp));

// ─── 14 ── INTEGRAÇÃO COM O SITE ────────────────────────────────────────────
bloco("13. A FERRAMENTA ESTÁ LIGADA AO SITE");

const artigos = readFileSync("lib/mobilidade/artigos.ts", "utf8");
const pagina = readFileSync("app/ferramentas/teste-mobilidade/page.tsx", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");
const hub = readFileSync("app/ferramentas/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
const convite = readFileSync("components/mobilidade/ConviteMobilidade.tsx", "utf8");

check("a página existe com canonical própria",
  /alternates:\s*{\s*canonical:[\s\S]*?teste-mobilidade/.test(pagina));
// Sem descontar comentários, este teste reprova a própria linha que explica
// por que FAQPage não é usado. O schema real é o que sobra depois deles.
check("só BreadcrumbList no schema — nada de FAQPage nem AggregateRating",
  /BreadcrumbList/.test(pagina) && !/FAQPage|AggregateRating/.test(semComentarios(pagina)));
check("tem H1", /<h1/.test(pagina));
check("está no sitemap", /ferramentas\/teste-mobilidade/.test(sitemap));
check("tem card em /ferramentas", /ferramentas\/teste-mobilidade/.test(hub));
check("está no ItemList da central", /Destrave Seu Corpo/.test(hub));
check("o H1 usa o termo de busca e a marca fica no rótulo",
  /Teste de Mobilidade/.test(pagina) && /Destrave seu corpo/i.test(pagina));
check("a seção de metodologia existe e é ancorável",
  /id="metodologia"/.test(pagina));
check("a página lista as referências", /FONTES.map/.test(pagina));
check("a página declara as limitações",
  /Limitações/.test(pagina) && /Associação não é causa/.test(pagina));

// A regra da casa: uma ferramenta por artigo.
const outros = [
  "lib/proteina.ts", "lib/cardapio/motor.ts", "lib/tdee.ts", "lib/calorias.ts",
  "lib/onerm.ts", "lib/macros.ts", "lib/treino/volume.ts",
];
const registrosOutros = outros
  .map((f) => readFileSync(f, "utf8"))
  .join("\n")
  .match(/"[a-z0-9-]+"/g)
  ?.map((s) => s.slice(1, -1)) ?? [];
const colisoes = SLUGS_COM_TESTE_MOBILIDADE.filter((s) => registrosOutros.includes(s));
check("nenhum artigo do registro tem outra ferramenta", colisoes.length === 0, colisoes.join());

check("todo artigo do registro existe de verdade",
  SLUGS_COM_TESTE_MOBILIDADE.every((s) => blogPosts.some((p) => p.slug === s)),
  SLUGS_COM_TESTE_MOBILIDADE.filter((s) => !blogPosts.some((p) => p.slug === s)).join());
check("todo convite é escrito para o artigo, nunca genérico",
  Object.values(ARTIGOS_COM_TESTE_MOBILIDADE).every((c) => c.texto.length > 120));
check("os convites não se repetem entre artigos",
  new Set(Object.values(ARTIGOS_COM_TESTE_MOBILIDADE).map((c) => c.texto)).size ===
    SLUGS_COM_TESTE_MOBILIDADE.length);
check("o convite é componente de servidor (sem use client, sem hooks)",
  !/"use client"/.test(convite) && !/useState|useEffect/.test(convite));
check("o convite some na impressão", /print:hidden/.test(convite));
check("o convite renderiza nada fora do registro", /if \(!convite\) return null;/.test(convite));
check("o blog renderiza o convite", /<ConviteMobilidade slug=\{post\.slug\}/.test(blog));
check("nenhum convite promete diagnóstico ou prevenção",
  Object.values(ARTIGOS_COM_TESTE_MOBILIDADE).every(
    (c) => !/diagnóstic|previne|causa d[ao] (sua )?dor/i.test(c.texto)));

// Analytics: categorias, nunca resposta.
const analytics = readFileSync("lib/analytics.ts", "utf8");
check("os eventos do funil estão declarados",
  ["mobility_tool_view", "mobility_start", "mobility_test_complete",
   "mobility_result_view", "mobility_protocol_generated", "mobility_whatsapp",
   "mobility_save", "mobility_restart"].every((e) => analytics.includes(`"${e}"`)));
check("nenhum evento carrega resposta de teste ou de triagem",
  !/trackEvent\([^)]*respostas/.test(comp) && !/trackEvent\([^)]*triagem/.test(comp) &&
  !/trackEvent\([^)]*mapa/.test(comp));
check("o histórico avisa que mora no aparelho e pode se perder",
  /neste aparelho/.test(AVISO_HISTORICO) && /se perde/.test(AVISO_HISTORICO));
check("o resultado aparece ANTES de qualquer pedido de contato",
  comp.indexOf('fase === "resultado"') < comp.indexOf("Receber no WhatsApp"));
check("o botão de WhatsApp não bloqueia o protocolo",
  !/bloqueado|desbloque|libera(r)? (o )?resultado/i.test(comp));

// ─── fim ────────────────────────────────────────────────────────────────────
console.log("\n" + "=".repeat(64));
if (falhas > 0) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
