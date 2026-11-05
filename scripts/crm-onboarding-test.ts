/** Motor do onboarding: npx tsx scripts/crm-onboarding-test.ts */
import {
  FLUXO_PADRAO, avisosDe, diffDeVersao, encontrarCiclo, instanciar, progresso, proximaAcao, prazoDaRegra, recalcularPrazos, situacao, validarDefinicao, verTodas,
  mensagemDaTarefa, variaveisDe, type OnboardingRow, type TarefaOnb,
} from "../lib/crm/onboarding-fluxo";

let falhas = 0;
const ok = (nome: string, cond: boolean, det = "") => { if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${det}`); } else console.log(`  ok      ${nome}`); };

const INICIO = "2026-11-04T15:00:00.000Z";
const agora = new Date("2026-11-04T18:00:00.000Z");
const onb: OnboardingRow = { id: "o1", client_id: "c1", contact_id: "k1", template_id: "m1", version_id: "v1", plan_id: null, status: "em_andamento", iniciado_em: INICIO, concluido_em: null, pausado_em: null, fases: FLUXO_PADRAO.fases, created_at: INICIO, updated_at: INICIO };
const materializar = (): TarefaOnb[] => instanciar(FLUXO_PADRAO, INICIO).map((t, i) => ({ ...t, id: `t${i}`, onboarding_id: "o1", created_at: INICIO, updated_at: INICIO }));
const por = (ts: TarefaOnb[], key: string) => ts.find((t) => t.key === key)!;

console.log("\nModelo padrão");
ok("modelo padrão é válido", validarDefinicao(FLUXO_PADRAO).length === 0, validarDefinicao(FLUXO_PADRAO).join(" | "));
ok("quatro fases e 17 etapas (15 + 2 caminhos da avaliação)", FLUXO_PADRAO.fases.length === 4 && FLUXO_PADRAO.etapas.length === 17);
ok("toda etapa de contato tem mensagem", FLUXO_PADRAO.etapas.filter((e) => e.acao === "whatsapp").every((e) => !!e.mensagem));
ok("guia de filmagem é opcional (não vira obrigação do aluno)", FLUXO_PADRAO.etapas.find((e) => e.key === "guia_filmagem")!.obrigatoria === false);
ok("ciclo é detectado", !!encontrarCiclo([{ key: "a", depende_de: ["b"], prazo: { tipo: "sem_prazo" } }, { key: "b", depende_de: ["c"], prazo: { tipo: "sem_prazo" } }, { key: "c", depende_de: ["a"], prazo: { tipo: "sem_prazo" } }]));
ok("prazo 'após etapa' também conta como dependência no ciclo", !!encontrarCiclo([{ key: "a", depende_de: [], prazo: { tipo: "apos_etapa", etapa: "b", dias: 1 } }, { key: "b", depende_de: ["a"], prazo: { tipo: "sem_prazo" } }]));
const invalida = validarDefinicao({ fases: [{ key: "f", nome: "F", ordem: 1 }], etapas: [{ ...FLUXO_PADRAO.etapas[0], fase: "x", depende_de: ["nada"] }] });
ok("fase inexistente e dependência inexistente são apontadas", invalida.length === 2, invalida.join(" | "));

console.log("\nInstância, condições e dependências");
let ts = materializar();
let v = verTodas(ts, agora);
const est = (k: string) => v.find((x) => x.t.key === k)!;
ok("prazo 'desde o início' já vem calculado (10h de Brasília do dia)", por(ts, "anamnese").due_at === "2026-11-04T13:00:00.000Z", String(por(ts, "anamnese").due_at));
ok("prazo 'após etapa' fica em aberto até a etapa acontecer", por(ts, "analisar").due_at === null);
ok("caminhos da avaliação ficam 'condicional' antes da resposta", est("avaliacao_dados").estado === "condicional" && est("guia_circunferencias").estado === "condicional");
ok("condicional não entra no progresso", progresso(v).aplicaveis === 15 && progresso(v).condicionais === 2);
ok("analisar está bloqueada (depende de dados_ok)", est("analisar").estado === "bloqueada" && est("analisar").esperando.includes("dados_ok"));
ok("anamnese é a próxima ação", proximaAcao(v)?.t.key === "anamnese");
ok("situação: precisa de atenção (prazo hoje)", situacao(onb, v, agora) === "atencao");

por(ts, "avaliacao").resposta = "nao"; por(ts, "avaliacao").status = "concluida"; por(ts, "avaliacao").completed_at = agora.toISOString();
v = verTodas(ts, agora);
ok("respondeu 'não': guia de circunferências libera, pedir dados vira não aplicável", est("guia_circunferencias").estado === "pendente" && est("avaliacao_dados").estado === "nao_aplicavel");
ok("não aplicável não reduz o progresso", progresso(v).aplicaveis === 16 && progresso(v).nao_aplicaveis === 1);
ok("dados_ok não fica preso ao caminho que não se aplica", !est("dados_ok").esperando.includes("avaliacao_dados"));

console.log("\nPrazos relativos e recálculo");
for (const k of ["anamnese", "guia_fotos", "guia_circunferencias"]) { por(ts, k).status = "concluida"; por(ts, k).completed_at = "2026-11-05T14:00:00.000Z"; }
por(ts, "dados_ok").status = "concluida"; por(ts, "dados_ok").completed_at = "2026-11-06T14:00:00.000Z";
let mud = recalcularPrazos(ts, INICIO);
ok("concluir dados_ok dá prazo a analisar (D+1, 10h)", mud.some((m) => m.id === por(ts, "analisar").id && m.para === "2026-11-07T13:00:00.000Z"), JSON.stringify(mud));
for (const m of mud) { const t = ts.find((x) => x.id === m.id)!; t.due_at = m.para; t.due_origem = "regra"; }
por(ts, "analisar").due_origem = "manual"; por(ts, "analisar").due_at = "2026-11-10T13:00:00.000Z";
por(ts, "dados_ok").completed_at = "2026-11-07T14:00:00.000Z";
mud = recalcularPrazos(ts, INICIO);
ok("prazo definido à mão não é recalculado", !mud.some((m) => m.id === por(ts, "analisar").id));
ok("prazo de regra sem evento continua vazio", prazoDaRegra({ tipo: "apos_etapa", etapa: "estrategia", dias: 1 }, INICIO, ts) === null);

console.log("\nAtraso, aguardando e progresso");
ts = materializar();
por(ts, "anamnese").status = "aguardando_aluno";
const depois = new Date("2026-11-08T18:00:00.000Z");
v = verTodas(ts, depois);
ok("aguardando aluno E atrasada ao mesmo tempo, sem apagar o status", est("anamnese").estado === "aguardando_aluno" && est("anamnese").atrasada);
ok("atrasada continua pendente no progresso", progresso(v).concluidas === 0 && progresso(v).atrasadas >= 1 && progresso(v).aguardando === 1);
ok("situação do aluno: atrasado", situacao(onb, v, depois) === "atrasado");
ok("onboarding não pode concluir com obrigatória aberta", progresso(v).obrigatoriasAbertas > 0);
ts = materializar();
for (const t of ts) { if (t.ativar_se) continue; t.status = t.key === "guia_filmagem" ? "pendente" : "concluida"; t.completed_at = agora.toISOString(); if (t.condicao) t.resposta = t.na_se ?? "sim"; }
por(ts, "avaliacao_dados").status = "concluida"; por(ts, "avaliacao_dados").completed_at = agora.toISOString();
v = verTodas(ts, agora);
const p = progresso(v);
ok("só a opcional aberta: obrigatórias zeradas, 94%", p.obrigatoriasAbertas === 0 && p.pct === Math.round((p.concluidas / p.aplicaveis) * 100) && p.pct < 100, JSON.stringify(p));
ok("percentual é concluídas/aplicáveis", p.pct === Math.round((15 / 16) * 100));

console.log("\nAvisos");
ts = materializar();
v = verTodas(ts, agora);
let av = avisosDe(onb, "João", v, agora);
ok("anamnese e guia de fotos avisam 'hoje'; bloqueadas não avisam", av.filter((a) => a.tipo === "hoje").length === 3 && !av.some((a) => a.tarefa.key === "analisar"), av.map((a) => a.tarefa.key + ":" + a.tipo).join(","));
ok("chave estável: mesma tarefa, mesmo dia, mesma chave", avisosDe(onb, "João", v, agora)[0].chave === av[0].chave);
v = verTodas(ts, depois);
av = avisosDe(onb, "João", v, depois);
const atr = av.filter((a) => a.tipo === "atrasada");
ok("atraso vira aviso 'atrasada', com balde que repete a cada 2 dias", atr.length === 3 && atr[0].chave.endsWith(":2"), atr.map((a) => a.chave).join(","));
ok("onboarding pausado não avisa", avisosDe({ ...onb, status: "pausado" }, "João", v, depois).length === 0);
ok("texto cita aluno e tarefa", av[0].texto.includes("João") && av[0].texto.includes("anamnese"));

console.log("\nVersões");
ts = materializar();
por(ts, "anamnese").status = "concluida"; por(ts, "anamnese").completed_at = agora.toISOString();
const nova = { fases: FLUXO_PADRAO.fases, etapas: FLUXO_PADRAO.etapas.filter((e) => !["anamnese", "guia_fotos"].includes(e.key)).map((e) => e.key === "orientacoes" ? { ...e, nome: "Enviar orientações" } : e).concat([{ ...FLUXO_PADRAO.etapas[0], key: "boas_vindas", nome: "Mensagem de boas-vindas", depende_de: [] }]) };
const d = diffDeVersao(nova, ts);
ok("prévia: adiciona a nova, remove só a pendente, preserva a concluída que saiu", d.adicionar.map((e) => e.key).join() === "boas_vindas" && d.remover.map((t) => t.key).join() === "guia_fotos" && d.preservadas.map((t) => t.key).join() === "anamnese");
ok("prévia: aponta o que muda na mantida", d.atualizar.some((a) => a.tarefa.key === "orientacoes" && a.mudancas.includes("nome")));

console.log("\nMensagens");
const vars = variaveisDe({ nome: "Ana Paula Souza", plano: "Consultoria trimestral", linkApp: "https://app.exemplo/convite/X", agora: new Date("2026-11-04T12:00:00.000Z") });
const msg = mensagemDaTarefa(por(ts, "enviar_acesso"), vars)!;
ok("variáveis preenchidas: primeiro nome e link do app", msg.includes("Ana,") && msg.includes("https://app.exemplo/convite/X") && !msg.includes("{"));
ok("saudação segue Brasília (9h = bom dia)", vars.saudacao === "Bom dia");
ok("etapa sem mensagem devolve nulo", mensagemDaTarefa(por(ts, "analisar"), vars) === null);

console.log(falhas ? `\n${falhas} TESTE(S) FALHARAM` : "\nTODOS OS TESTES PASSARAM");
if (falhas) process.exit(1);
