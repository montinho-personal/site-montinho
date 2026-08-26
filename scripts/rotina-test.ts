/**
 * Testes do motor do Treino Para Minha Rotina.
 *   npx tsx scripts/rotina-test.ts
 * Sai com código 1 se algo falhar.
 */
import { computeRotina, validarDias, type RotinaAnswers } from "../lib/rotina/engine";
import { blogPosts } from "../lib/blog";
import { EVIDENCE } from "../lib/rotina/evidence";

let falhas = 0;
function check(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}

const base: RotinaAnswers = {
  objetivo: "massa", dias: 3, tempo: "45a60", experiencia: "intermediario",
  ambiente: "academia", distribuicao: "espalhados", barreira: "tempo",
  preferencia: "tanto_faz", temLimitacao: false,
};
const com = (o: Partial<RotinaAnswers>): RotinaAnswers => ({ ...base, ...o });

console.log("PERSONAS");

// A — hipertrofia, 3 dias, 45 min, intermediário, espalhados
const A = computeRotina(com({}));
check("A: 3 dias → estrutura com 3 sessões", A.sessoesPorSemana === 3, A.structureId);
check("A: full body como padrão sem preferência", A.structureId === "fb3");

// B — emagrecer/saúde, 2 dias, 30 min, iniciante, barreira tempo
const B = computeRotina(com({ objetivo: "emagrecer", dias: 2, tempo: "ate30", experiencia: "iniciante" }));
check("B: 2 dias nunca vira 'não adianta'", B.sessoesPorSemana === 2 && B.structureId === "fb2");
check("B: comunica dose mínima, não desdém", !!B.notaTempo && /não torna o treino inútil/.test(B.notaTempo));

// C — hipertrofia, 5 dias, 60 min, avançado, prefere dividido
const C = computeRotina(com({ dias: 5, tempo: "45a60", experiencia: "avancado", preferencia: "dividido", barreira: "raro" }));
check("C: avançado 5 dias recebe estrutura distribuída", C.structureId === "pplul5" && C.sessoesPorSemana === 5);

// D — iniciante com 5 dias livres
const D = computeRotina(com({ dias: 5, experiencia: "iniciante" }));
check("D: iniciante com 5 dias não recebe 5 sessões", D.sessoesPorSemana === 3);
check("D: explica por que não usar todos os dias", !!D.porqueNaoMais && D.usaMenosQueDisponivel);

// E — 4 dias, agenda variável
const E = computeRotina(com({ dias: 4, distribuicao: "variavel", barreira: "imprevisivel" }));
check("E: agenda variável recebe nota de flexibilidade", !!E.notaDistribuicao && /varia/.test(E.notaDistribuicao));
check("E: plano B sempre existe", !!E.planoB.estrutura && /abandono/.test(E.planoB.texto));

// F — 3 dias consecutivos como única possibilidade
const F = computeRotina(com({ distribuicao: "consecutivos" }));
check("F: dias consecutivos não quebram — adapta com ênfases", F.structureId === "fb3" && !!F.notaDistribuicao && /ênfase/.test(F.notaDistribuicao));
check("F: semana sugere dias seguidos de fato", F.diasSugeridos.join(",") === "0,1,2");

// G — limitação informada
const G = computeRotina(com({ temLimitacao: true }));
check("G: limitação marca o plano e não prescreve para condição", G.temLimitacao === true);

// H — 30 minutos, avançado ≠ 30 minutos, iniciante
const H1 = computeRotina(com({ tempo: "ate30", experiencia: "avancado", dias: 5, barreira: "raro" }));
const H2 = computeRotina(com({ tempo: "ate30", experiencia: "iniciante", dias: 5 }));
check("H: avançado de 30min mantém mais sessões que iniciante", H1.sessoesPorSemana > H2.sessoesPorSemana, `${H1.sessoesPorSemana} vs ${H2.sessoesPorSemana}`);

// Voltar a treinar é conservador
const V = computeRotina(com({ objetivo: "voltar", dias: 6, experiencia: "intermediario" }));
check("voltar: 6 dias disponíveis viram 3 sessões", V.sessoesPorSemana === 3);

// 6 dias avançado
const S6 = computeRotina(com({ dias: 6, experiencia: "avancado", barreira: "raro" }));
check("6 dias avançado → PPL 2x", S6.structureId === "ppl6");

// 4 dias consecutivos → UL, não FB (mesmo preferindo FB)
const C4 = computeRotina(com({ dias: 4, distribuicao: "consecutivos", preferencia: "fullbody" }));
check("4 dias consecutivos evitam FB em dias seguidos", C4.structureId === "ul4");

console.log("\nDETERMINISMO");
const x1 = JSON.stringify(computeRotina(com({ dias: 4, barreira: "motivacao" })));
const x2 = JSON.stringify(computeRotina(com({ dias: 4, barreira: "motivacao" })));
check("mesmas respostas → mesmo plano, byte a byte", x1 === x2);

console.log("\nINTEGRIDADE");
// Todos os slugs recomendados existem de verdade
const todasCombs: RotinaAnswers[] = [];
const dias: RotinaAnswers["dias"][] = [2, 3, 4, 5, 6];
const exps: RotinaAnswers["experiencia"][] = ["iniciante", "base", "intermediario", "avancado"];
const objs: RotinaAnswers["objetivo"][] = ["massa", "emagrecer", "forca", "saude", "voltar"];
const tempos: RotinaAnswers["tempo"][] = ["ate30", "30a45", "45a60", "60a75", "75mais"];
const prefs: RotinaAnswers["preferencia"][] = ["fullbody", "dividido", "tanto_faz"];
const dists: RotinaAnswers["distribuicao"][] = ["espalhados", "consecutivos", "variavel", "fim_de_semana", "nao_sei"];
for (const d of dias) for (const e of exps) for (const o of objs) for (const t of tempos) for (const pr of prefs) for (const di of dists)
  todasCombs.push(com({ dias: d, experiencia: e, objetivo: o, tempo: t, preferencia: pr, distribuicao: di }));

const slugsReais = new Set(blogPosts.map((p) => p.slug));
const evidenceIds = new Set(EVIDENCE.map((e) => e.id));
let slugsOk = true, sessoesOk = true, planoBOk = true, evidOk = true, semanaOk = true;
for (const c of todasCombs) {
  const r = computeRotina(c);
  if (r.artigos.some((a) => !slugsReais.has(a.slug))) slugsOk = false;
  if (r.sessoesPorSemana > c.dias || r.sessoesPorSemana < 2) sessoesOk = false;
  if (!r.planoB.estrutura) planoBOk = false;
  if (r.evidencia.some((id) => !evidenceIds.has(id))) evidOk = false;
  if (r.semana.filter((d) => d.sessao).length !== r.sessoesPorSemana) semanaOk = false;
}
check(`todas as ${todasCombs.length} combinações: slugs de artigos existem`, slugsOk);
check("sessões nunca excedem os dias disponíveis (mín. 2)", sessoesOk);
check("plano B existe em todas as combinações", planoBOk);
check("toda justificativa aponta para evidência documentada", evidOk);
check("a semana visual bate com o número de sessões", semanaOk);

console.log("\nVALIDAÇÃO DE AGENDA");
const plano3 = computeRotina(com({}));
const aviso = validarDias([0, 1, 2], plano3);
check("3 dias seguidos em FB: sugere, não proíbe", !!aviso && !/errad/i.test(aviso) && /siga com eles/.test(aviso));
check("dias bem distribuídos: sem aviso", validarDias([0, 2, 4], plano3) === null);
const avisoMenos = validarDias([0], plano3);
check("menos dias que sessões: acolhe e aponta plano B", !!avisoMenos && /Plano B/.test(avisoMenos));

console.log("\nCOPY — o que nunca pode aparecer");
const textos = todasCombs.slice(0, 500).map((c) => JSON.stringify(computeRotina(c))).join(" ");
check("sem culpa/vergonha/urgência", !/você prometeu|não quebre|disciplina baixa|rotina ruim|última chance|garantid/i.test(textos));
check("sem neuromito", !/dopamina|reprograme seu cérebro|21 dias|córtex|hackea/i.test(textos));
check("sem falsa precisão percentual", !/\d+[.,]?\d*% (mais|a mais|de hipertrofia|superior)/i.test(textos));

console.log("\n" + (falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} FALHARAM`));
process.exit(falhas === 0 ? 0 : 1);
