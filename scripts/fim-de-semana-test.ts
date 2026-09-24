/**
 * Motor do Simulador do Fim de Semana.
 *   npx tsx scripts/fim-de-semana-test.ts
 */
import { readFileSync } from "fs";
import {
  SEM_AJUSTE, balanca, comparaRefeicaoFds, classifica, contribuicoes, fmtFaixaKcal, fmtKcal, fraseDaSemana, insight, mudancas, projecao, recomecar, semana,
  ARTIGOS_COM_LINK_FIM_DE_SEMANA, type EntradaFds,
} from "../lib/simulador/fim-de-semana";

let falhas = 0;
const ok = (n: string, c: boolean, d: unknown = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${typeof d === "string" ? d : JSON.stringify(d)}`); } else console.log(`  ok      ${n}`); };
const perto = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

const BASE: EntradaFds = {
  objetivo: "emagrecer", modo: "sei", sexo: "f", idade: 35, alturaCm: 165, pesoKg: 75,
  manutencaoKcal: 2200, rotina: "sentado",
  kcalUtil: 1700, kcalSabado: 1700, kcalDomingo: 1700, kcalSextaExtra: 0,
  comoCome: "plano", sexta: "nao", sabado: "igual", domingo: "igual", eventos: [],
  movimento: "parecido", passosUtil: null, passosSabado: null, passosDomingo: null,
  treinaFds: "nao", compensa: "nao", medicacao: "nao",
};
const e = (o: Partial<EntradaFds>): EntradaFds => ({ ...BASE, ...o });
const PROIBIDO = /gordura que você ganhou|você engordou|estragou|falhou|lixo|jacada|pecado|g de gordura/i;

console.log("\nCaso A — −500/dia, fim de semana igual");
const A = semana(e({}));
ok("construído −2.500", perto(A.construido.mid, -2500, 1));
ok("saldo −3.500 (sete dias iguais)", perto(A.saldo.mid, -3500, 1));
ok("preservado 100% (fds também em déficit)", A.preservado === 1);
ok("estado déficit", A.estado === "deficit");
ok("insight: fds parecido com a semana", insight(e({}), A).tipo === "sem-extra");

console.log("\nCaso B — grande refeição no sábado, domingo normal (construtor)");
const eB = e({ modo: "nao-sei", manutencaoKcal: 2200, comoCome: "plano", eventos: [{ uid: "1", dia: "sabado", itemId: "pizza", qtd: 4, kcalManual: null }] });
const B = semana(eB);
ok("saldo segue em déficit", B.estado === "deficit", B.saldo);
ok("insight tranquilizador", insight(eB, B).tipo === "tranquilo", insight(eB, B));
ok("pizza substitui uma refeição (extra < 4 fatias inteiras)", B.extras.sabado.comida.max < 4 * 350);

console.log("\nTeste crítico 1 — −2.500 na semana, +1.000 no fim de semana");
const t1 = semana(e({ kcalSabado: 2700, kcalDomingo: 2700 }));
ok("−2.500 + 1.000 = −1.500", perto(t1.saldo.mid, -1500, 1) && perto(t1.consumido.mid, 1000, 1));
ok("continua em déficit", t1.estado === "deficit");
ok("frase não diz que estragou", !PROIBIDO.test(fraseDaSemana(t1)) && /ainda terminou a semana em déficit/.test(fraseDaSemana(t1)));
ok("preservado 60%", perto(t1.preservado!, 0.6, 0.001));

console.log("\nTeste crítico 2 — −2.000 na semana, +2.100 no fim de semana");
const t2 = semana(e({ kcalUtil: 1800, kcalSabado: 3250, kcalDomingo: 3250 }));
ok("construído −2.000", perto(t2.construido.mid, -2000, 1));
ok("saldo ≈ +100 → perto da manutenção", perto(t2.saldo.mid, 100, 1) && t2.estado === "equilibrio", t2.saldo);
ok("frase: perto da manutenção, sem gramas", /perto da manutenção/.test(fraseDaSemana(t2)) && !PROIBIDO.test(fraseDaSemana(t2)));
ok("preservado 0%", t2.preservado === 0);

console.log("\nCaso C — sábado e domingo muito acima");
const eC = e({ modo: "nao-sei", comoCome: "plano", sabado: "muito", domingo: "muito" });
const C = semana(eC);
ok("superávit", C.estado === "superavit", C.saldo);
ok("frase sem 'você engordou'", !PROIBIDO.test(fraseDaSemana(C)) && /ultrapassou/.test(fraseDaSemana(C)));
ok("insight domingo", insight(eC, C).tipo === "domingo", insight(eC, C));

console.log("\nCaso D — começa sexta à noite");
const eD = e({ modo: "nao-sei", comoCome: "plano", sexta: "sim", sabado: "varias", domingo: "refeicao" });
const D = semana(eD);
ok("sexta entra no saldo", D.dias.sex.mid > D.dias.qui.mid + 100);
ok("insight de duração quando os três dias mudam e não sobra déficit", D.estado === "deficit" || insight(eD, D).tipo === "duracao", [D.estado, insight(eD, D).tipo]);
ok("mudança 'não estender a sexta' aparece", mudancas(eD).some((m) => m.id === "sextaSemExtra"));

console.log("\nCaso E — álcool alto");
const eE = e({ modo: "nao-sei", comoCome: "cuidado", eventos: [
  { uid: "a", dia: "sabado", itemId: "cerveja", qtd: 8, kcalManual: null },
  { uid: "b", dia: "domingo", itemId: "cerveja", qtd: 6, kcalManual: null },
  { uid: "c", dia: "sabado", itemId: "churrasco", qtd: 1, kcalManual: null },
] });
const E = semana(eE);
ok("insight bebidas", insight(eE, E).tipo === "bebidas", insight(eE, E));
ok("cerveja: 8 latas = 1.120 a 1.280", perto(E.extras.sabado.bebida.min, 1120, 1) && perto(E.extras.sabado.bebida.max, 1280, 1));
const mE = mudancas(eE);
ok("menor mudança: metade das bebidas no topo", mE[0]?.id === "bebidas", mE.map((m) => m.id));
ok("ajuste 8 → 4 bebidas reduz ≈ metade", perto(semana(eE, { ...SEM_AJUSTE, bebidas: 0.5 }).extras.sabado.bebida.mid, E.extras.sabado.bebida.mid / 2, 1));

console.log("\nCaso F — pouca atividade no fim de semana");
const eF = e({ modo: "nao-sei", comoCome: "plano", sabado: "pouco", movimento: "muito-menos" });
const F1 = semana(eF);
ok("menos passos = menos gasto (saldo sobe)", F1.saldo.mid > semana(e({ modo: "nao-sei", comoCome: "plano", sabado: "pouco" })).saldo.mid);
ok("insight movimento", insight(eF, F1).tipo === "movimento", insight(eF, F1));

console.log("\nCaso G — mais atividade no fim de semana");
const G = semana(e({ modo: "nao-sei", comoCome: "plano", sabado: "refeicao", movimento: "muito-mais" }));
ok("mais passos compensam parte do extra", G.saldo.mid < semana(e({ modo: "nao-sei", comoCome: "plano", sabado: "refeicao" })).saldo.mid);
ok("passos informados substituem a opção", semana(e({ passosUtil: 8000, passosSabado: 3000, passosDomingo: 3000, movimento: "muito-mais" })).movimentoPerdido > 0);

console.log("\nCaso H — não sabe calorias nem manutenção");
const eH = e({ modo: "nao-sei", manutencaoKcal: null, kcalUtil: null, comoCome: "cuidado", sabado: "refeicao", domingo: "pouco" });
const H = semana(eH);
ok("faixa larga (manutenção ±10%)", H.saldo.max - H.saldo.min > 2000, fmtFaixaKcal(H.saldo));
ok("manutenção estimada, não informada", !H.manutencaoInformada);
ok("formata kcal em múltiplos de 50", fmtKcal(-2437) === "−2.450 kcal" && fmtKcal(1234) === "+1.250 kcal");

console.log("\nCaso I — usa GLP-1: a conta não muda");
ok("medicação não altera o saldo", semana(e({ medicacao: "tirzepatida" })).saldo.mid === A.saldo.mid);

console.log("\nCaso J / Teste crítico 3 — +2 kg na segunda");
const bj = balanca(t1, 2);
ok("não converte 2 kg em gordura: teto bem abaixo", bj.tetoGorduraKg < 0.3 && bj.restoKg > 1.7, bj);
const bc = balanca(C, 2);
ok("mesmo em superávit, o teto é energia ÷ 9.440 e nunca passa da balança", bc.tetoGorduraKg <= 2 && bc.tetoGorduraKg < 1, bc);

console.log("\nTeste crítico 4 — compensação extrema");
const eK = e({ kcalSabado: 4200, kcalDomingo: 600, compensa: "cardio-longo" });
ok("insight de segurança vem primeiro", insight(eK, semana(eK)).tipo === "seguranca");
ok("domingo quase sem comer dispara sozinho", insight(e({ kcalSabado: 4200, kcalDomingo: 600 }), semana(e({ kcalSabado: 4200, kcalDomingo: 600 }))).tipo === "seguranca");
ok("jejum dispara", insight(e({ compensa: "jejum" }), A).tipo === "seguranca");
ok("nenhuma mudança sugerida corta comida além da rotina", mudancas(eC).every((m) => !/jejum|cardio|cortar/i.test(m.rotulo)));

console.log("\nRecomeçar rápido");
const rr = recomecar(e({}));
ok("adiar custa mais que a refeição", rr.a > rr.b * 2.5 && rr.diferenca > 1500);
ok("tradução em dias de déficit", rr.diasDeDeficit !== null && rr.diasDeDeficit > 3);

console.log("\nUma refeição × fim de semana inteiro");
const cmpA = comparaRefeicaoFds(e({}));
ok("uma refeição mantém déficit; o fds inteiro o reduz muito mais", cmpA.a.estado === "deficit" && cmpA.b.saldo.mid - cmpA.a.saldo.mid > 2000);

console.log("\nProjeção dinâmica");
const pA = projecao(e({}), A);
ok("déficit → peso cai, 12 sem mais que 4", pA[0].delta < 0 && pA[2].delta < pA[0].delta);
ok("não é linear 7.700 (12 sem ≠ 12×3.500/7.700 exato)", Math.abs(pA[2].delta - (-12 * 3500) / 7700) > 0.05, pA[2]);
ok("faixa contém o central", pA.every((p) => p.min <= p.delta && p.delta <= p.max));
const p2 = projecao(e({ kcalUtil: 1800, kcalSabado: 3250, kcalDomingo: 3250 }), t2);
ok("perto da manutenção → projeção perto de zero", Math.abs(p2[2].delta) < 0.5, p2[2]);

console.log("\nClassificação e contribuições");
ok("faixa cruzando zero com centro pequeno = equilíbrio", classifica({ min: -900, mid: -500, max: 100 }) === "equilibrio");
ok("contribuições em ordem e só positivas", (() => { const c = contribuicoes(E); return c.every((x, i) => x.kcal > 0 && (i === 0 || c[i - 1].kcal >= x.kcal)); })());
ok("ajuste 'domingo como semana' zera o domingo", semana(eC, { ...SEM_AJUSTE, domingoComoSemana: true }).extras.domingo.comida.mid === 0);
ok("'próxima refeição' limita dia livre a uma refeição", semana(eC, { ...SEM_AJUSTE, proximaRefeicao: true }).extras.sabado.comida.max <= 1000);

console.log("\nRegistros e página");
ok("artigos de link são o artigo irmão e o dia do lixo", ARTIGOS_COM_LINK_FIM_DE_SEMANA.includes("fim-de-semana-estraga-a-dieta") && ARTIGOS_COM_LINK_FIM_DE_SEMANA.length <= 8);
const pg = readFileSync("app/ferramentas/simulador-fim-de-semana/page.tsx", "utf8");
const titulo = pg.match(/^\s*title:\s*"([^"]+)"/m)![1];
const desc = pg.match(/^\s*description:\s*\n?\s*"([^"]+)"/m)![1];
ok(`título ≤ 60 (${titulo.length})`, titulo.length <= 60, titulo);
ok(`descrição 130–158 (${desc.length})`, desc.length >= 130 && desc.length <= 158, desc);
ok("um H1", (pg.match(/<h1[\s>]/g) ?? []).length === 1);
ok("página aponta para o artigo irmão", /\/blog\/fim-de-semana-estraga-a-dieta/.test(pg));
const cmp = readFileSync("components/simulador/SimuladorFimDeSemana.tsx", "utf8");
ok("fechamento da filosofia antes do CTA", cmp.indexOf("FECHAMENTO_COMPARACAO.paragrafos") > 0 && cmp.indexOf("FECHAMENTO_COMPARACAO.paragrafos") < cmp.indexOf("weekend_whatsapp_click"));
ok("eventos não levam dado sensível", !/trackEvent\([^)]*(kcal|peso|saldo|medicacao|bebida:)/.test(cmp));
ok("WhatsApp com a mensagem padrão, sem números", /Fiz o Simulador do Fim de Semana no seu site/.test(cmp) && !/msgComDados/.test(cmp));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
