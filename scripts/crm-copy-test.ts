/**
 * Testes da mensagem pré-preenchida por situação de follow-up.
 *   npx tsx scripts/crm-copy-test.ts
 *
 * O que se protege: (1) o preenchimento — variável vazia apaga o fragmento
 * inteiro e não deixa rastro; (2) todo texto respeita as regras da casa
 * (sem CREF, sem preço fora da variável, uma pergunta só, curto, sem "{" ou
 * "[[" sobrando com dados cheios ou vazios); (3) o grupo da tela Hoje leva à
 * situação certa; (4) o contexto real de um lead vira variáveis certas.
 */
import { SITUACOES, TEXTOS } from "../lib/crm/copy-textos";
import { VARIAVEIS, contextoDoContato, escolherSituacao, formatarDiaHora, mensagemPara, objetivoUsavel, perguntaDaMensagem, preencher, type Sinais } from "../lib/crm/copy";
import type { Base, Catalogo } from "../lib/crm/dados";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));

bloco("1. PREENCHIMENTO");
ok("variável simples", preencher("Oi, {nome}!", { nome: "Ana" }) === "Oi, Ana!");
ok("fragmento some com variável vazia", preencher("Vi que você chegou pela página [[«{pagina}»]] do site.", { pagina: "" }) === "Vi que você chegou pela página do site.");
ok("fragmento fica com variável cheia", preencher("Vi [[a página «{pagina}»]].", { pagina: "Alphaville" }) === "Vi a página «Alphaville».");
ok("fragmento com duas variáveis exige as duas", preencher("A[[ {x} e {y}]].", { x: "1", y: "" }) === "A.");
ok("fragmento sem variável fica", preencher("[[oi]] {nome}", { nome: "B" }) === "oi B");
ok("espaço antes de pontuação some", preencher("Falou {x} .", { x: "" }) === "Falou.");
ok("quebra de linha dupla se mantém, tripla não", preencher("a\n\n\n\nb", {}) === "a\n\nb");
ok("variável desconhecida vira vazio", preencher("x {nada} y", {}) === "x y");

bloco("2. TEXTOS — REGRAS DA CASA");
const cheias = Object.fromEntries(VARIAVEIS.map((v) => [v, "X"])) as Record<string, string>;
cheias.nome = "Ana"; cheias.dias = "3"; cheias.renova_em = "7"; cheias.valor = "R$ 399"; cheias.dia_hora = "amanhã às 7h"; cheias.pagina = "Personal Trainer Alphaville";
cheias.pergunta = "como funciona o acompanhamento"; cheias.objetivo = "emagrecer"; cheias.plano = "2 aulas por semana"; cheias.servico = "consultoria online"; cheias.indicador = "Bruna"; cheias.local = "academia do condomínio"; cheias.cidade = "Barueri";
const vazias = Object.fromEntries(VARIAVEIS.map((v) => [v, ""])) as Record<string, string>;
vazias.nome = "Ana";
const emojis = (t: string) => (t.match(/\p{Extended_Pictographic}/gu) ?? []).length;
for (const s of SITUACOES) {
  const modelo = TEXTOS[s];
  ok(`${s}: existe`, typeof modelo === "string" && modelo.length > 20);
  ok(`${s}: usa só variáveis conhecidas`, [...modelo.matchAll(/\{(\w+)\}/g)].every((m) => (VARIAVEIS as readonly string[]).includes(m[1])), modelo);
  ok(`${s}: não cita CREF`, !/cref|confef/i.test(modelo));
  ok(`${s}: não tem preço fora da variável`, !/R\$\s*\d/.test(modelo));
  ok(`${s}: sem falsa urgência`, !/só hoje|últimas? vagas?|promoção|desconto/i.test(modelo));
  ok(`${s}: no máximo um emoji`, emojis(modelo) <= 1);
  const c = preencher(modelo, cheias);
  const v = preencher(modelo, vazias);
  for (const [rot, t] of [["cheia", c], ["vazia", v]] as const) {
    ok(`${s} (${rot}): nada sobrou`, !/[{}\[\]]/.test(t), t);
    ok(`${s} (${rot}): uma pergunta só`, (t.match(/\?/g) ?? []).length === 1, t);
    ok(`${s} (${rot}): termina na pergunta`, t.trimEnd().endsWith("?"), t);
    ok(`${s} (${rot}): cabe numa tela (≤ 400)`, t.length <= 400, `${t.length} chars`);
    ok(`${s} (${rot}): sem espaço duplo ou aspas vazias`, !/ {2}|«»|\(\)/.test(t), t);
    // O respiro entre os blocos é o que faz a mensagem ser lida de relance no celular.
    ok(`${s} (${rot}): parágrafos separados por linha em branco`, t.includes("\n\n"), JSON.stringify(t));
    ok(`${s} (${rot}): nenhuma quebra solta (sempre linha em branco)`, !/[^\n]\n[^\n]/.test(t), JSON.stringify(t));
    ok(`${s} (${rot}): nenhum parágrafo com mais de 220 chars`, t.split("\n\n").every((p) => p.length <= 220), t.split("\n\n").map((p) => p.length).join("/"));
    ok(`${s} (${rot}): nenhum parágrafo vazio`, t.split("\n\n").every((p) => p.trim().length > 0), JSON.stringify(t));
    ok(`${s} (${rot}): começa com o nome`, /^(Oi, )?Ana/.test(t) || /^Ana/.test(t) || t.includes("Ana"), t);
  }
  ok(`${s}: vazia não termina frase com preposição`, !/\b(pela|pelo|sobre|no|na|de|do|da|em|para)\s*[.?!]/i.test(preencher(modelo, vazias)), preencher(modelo, vazias));
}

bloco("3. GRUPO → SITUAÇÃO");
const base: Sinais = { pergunta: "", indicador: "", pagina: "", anuncio: false, jaContatado: false, propostaEnviada: false, diasProposta: null, etapa: null, experimentalRealizada: false, cliente: undefined, renovaEm: null };
const S = (x: Partial<Sinais>): Sinais => ({ ...base, ...x });
ok("novo, só clicou, com página → site", escolherSituacao("novo_sem_contato", S({ pagina: "Consultoria Online" })) === "primeiro_contato_site");
ok("novo, escreveu dúvida → dúvida vence página", escolherSituacao("novo_sem_contato", S({ pagina: "X", pergunta: "quanto custa?" })) === "primeiro_contato_duvida");
ok("novo, indicado → indicação vence página", escolherSituacao("novo_sem_contato", S({ pagina: "X", indicador: "Bruna" })) === "primeiro_contato_indicacao");
ok("novo, anúncio sem página → anúncio", escolherSituacao("novo_sem_contato", S({ anuncio: true })) === "primeiro_contato_anuncio");
ok("novo, nada → genérico", escolherSituacao("novo_sem_contato", S({})) === "primeiro_contato_generico");
ok("proposta há 3 dias → follow-up 1", escolherSituacao("proposta_sem_follow_up", S({ propostaEnviada: true, diasProposta: 3 })) === "proposta_follow_up_1");
ok("proposta há 9 dias → follow-up 2 (último toque)", escolherSituacao("proposta_sem_follow_up", S({ propostaEnviada: true, diasProposta: 9 })) === "proposta_follow_up_2");
ok("negociação antiga", escolherSituacao("negociacao_antiga", S({ etapa: "negociacao" })) === "negociacao_parada");
ok("experimental próxima → confirmar", escolherSituacao("experimental_proxima", S({})) === "experimental_confirmar");
ok("experimental passou → sem registro", escolherSituacao("experimental_sem_registro", S({})) === "experimental_sem_registro");
ok("pós-experimental → proposta", escolherSituacao("pos_experimental_sem_proposta", S({ experimentalRealizada: true })) === "pos_experimental_proposta");
ok("quente sem proposta → lead quente", escolherSituacao("quente", S({ jaContatado: true })) === "lead_quente");
ok("quente com proposta de 1 dia → ainda lead quente", escolherSituacao("quente", S({ jaContatado: true, propostaEnviada: true, diasProposta: 1 })) === "lead_quente");
ok("quente com proposta de 3 dias → follow-up 1", escolherSituacao("quente", S({ jaContatado: true, propostaEnviada: true, diasProposta: 3 })) === "proposta_follow_up_1");
ok("tarefa de follow-up em lead com proposta → follow-up da proposta", escolherSituacao("follow_up_atrasado", S({ jaContatado: true, propostaEnviada: true, diasProposta: 4 })) === "proposta_follow_up_1");
ok("tarefa de follow-up em negociação → negociação parada", escolherSituacao("follow_up_hoje", S({ jaContatado: true, propostaEnviada: true, etapa: "negociacao" })) === "negociacao_parada");
ok("tarefa em lead nunca contatado → primeiro contato", escolherSituacao("follow_up_hoje", S({ pagina: "X" })) === "primeiro_contato_site");
ok("parado sem proposta → segundo toque", escolherSituacao("parado", S({ jaContatado: true })) === "segundo_toque");
ok("parado depois da experimental → proposta", escolherSituacao("parado", S({ jaContatado: true, experimentalRealizada: true })) === "pos_experimental_proposta");
ok("sem próxima ação, nunca contatado → primeiro contato", escolherSituacao("sem_proxima_acao", S({})) === "primeiro_contato_generico");
const cli = (status: string, renovaEm: number | null) => S({ cliente: { status, renewal_date: null } as never, renovaEm });
ok("renovação próxima", escolherSituacao("renovacao_proxima", cli("ativo", 7)) === "renovacao_proxima");
ok("renovação vencida", escolherSituacao("renovacao_vencida", cli("ativo", -3)) === "renovacao_vencida");
ok("tarefa em cliente ativo com renovação vencida → vencida", escolherSituacao("follow_up_atrasado", cli("ativo", -3)) === "renovacao_vencida");
ok("tarefa em cliente pausado → reativação", escolherSituacao("follow_up_hoje", cli("pausado", null)) === "reativacao_pausado");
ok("sem grupo, cliente cancelado → reativação", escolherSituacao(null, cli("cancelado", null)) === "reativacao_pausado");

bloco("4. PERGUNTA DA MENSAGEM");
ok("frase fixa sem complemento → vazio", perguntaDaMensagem("Olá, Montinho! Li a página da Consultoria Online e fiquei com uma dúvida: Ref: CXTXF") === "");
ok("frase fixa com complemento → complemento", perguntaDaMensagem("Olá, Montinho! Li a página da Consultoria Online e fiquei com uma dúvida: funciona para quem tem hérnia? Ref: CXTXF") === "funciona para quem tem hérnia?");
ok("texto livre → o texto, sem Ref", perguntaDaMensagem("quanto custa o online? Ref: ABCDE") === "quanto custa o online?");
ok("frase genérica do site → vazio", perguntaDaMensagem("Olá, Montinho! Vim pelo seu site e tenho interesse no seu acompanhamento. Gostaria de saber como funciona e qual opção é mais indicada para mim.") === "");
ok("vazio → vazio", perguntaDaMensagem(null) === "");

bloco("4b. VARIÁVEIS QUE VÊM SUJAS DO BANCO");
// A dúvida quase sempre termina em "?" — colada em «sua dúvida: "..."» viraria "?." e uma segunda pergunta.
const comPergunta = preencher(TEXTOS.primeiro_contato_duvida, { ...vazias, pergunta: "funciona pra quem tem hérnia de disco" });
ok("dúvida citada não vira segunda pergunta", (comPergunta.match(/\?/g) ?? []).length === 1, comPergunta);
ok("dúvida citada aparece entre aspas", comPergunta.includes('"funciona pra quem tem hérnia de disco"'), comPergunta);
// `interesse` é campo livre: às vezes guarda a rota inteira, que não cabe numa frase.
ok("objetivo curto passa", objetivoUsavel("emagrecer") === "emagrecer");
ok("objetivo com travessão é descartado", objetivoUsavel("Consultoria online — dúvida sobre a página") === "");
ok("objetivo longo é descartado", objetivoUsavel("quero emagrecer e melhorar meu condicionamento para a corrida") === "");
ok("objetivo vazio é vazio", objetivoUsavel(null) === "");
const semObjetivo = preencher(TEXTOS.lead_quente, { ...vazias, objetivo: objetivoUsavel("Consultoria online — dúvida sobre a página") });
ok("lead quente sem objetivo usável não deixa frase quebrada", /marcar o primeiro dia\./.test(semObjetivo), semObjetivo);

bloco("5. DIA E HORA");
const agora = new Date("2026-09-09T15:00:00-03:00");
ok("hoje", formatarDiaHora("2026-09-09T18:30:00-03:00", agora) === "hoje às 18h30");
ok("amanhã cheia", formatarDiaHora("2026-09-10T07:00:00-03:00", agora) === "amanhã às 7h");
ok("outro dia", /^sex, 11\/09, às 7h$/.test(formatarDiaHora("2026-09-11T07:00:00-03:00", agora)), formatarDiaHora("2026-09-11T07:00:00-03:00", agora));
ok("meia-noite UTC não vira outro dia", formatarDiaHora("2026-09-10T02:00:00Z", agora) === "hoje às 23h");

bloco("6. CONTEXTO REAL");
const cat = {
  servicos: [{ id: "s-on", code: "online", nome: "Consultoria online" }, { id: "s-pr", code: "presencial", nome: "Personal presencial" }],
  planos: [{ id: "p1", service_id: "s-on", nome: "Consultoria trimestral · 12 semanas" }],
  etapas: [{ id: "e-prop", code: "proposta" }, { id: "e-neg", code: "negociacao" }],
  fontes: [], pipelines: [], motivos: [], templates: [], usuarios: [], config: {},
} as unknown as Catalogo;
const b = {
  contatos: [
    { id: "c1", nome: "Denise Dos Silva", cidade: null, referred_by_contact_id: null },
    { id: "c2", nome: "Bruna Rodrigues", cidade: "Barueri", referred_by_contact_id: null },
    { id: "c3", nome: "Elisa Cruz", cidade: "São Paulo", referred_by_contact_id: "c2" },
  ],
  leads: [
    { id: "l1", contact_id: "c1", service_id: "s-on", interesse: "Consultoria online — dúvida sobre a página", status: "aberto", source_code: "google_ads", handoff_id: "h1", referred_by_contact_id: null, last_contact_at: null, first_response_at: null, created_at: "2026-09-09T13:51:00Z" },
    { id: "l3", contact_id: "c3", service_id: "s-on", interesse: "emagrecer", status: "aberto", source_code: "referral_client", handoff_id: null, referred_by_contact_id: null, last_contact_at: "2026-09-05T12:00:00Z", first_response_at: "2026-09-04T12:00:00Z", created_at: "2026-09-03T12:00:00Z" },
  ],
  oportunidades: [
    { id: "o3", lead_id: "l3", contact_id: "c3", stage_id: "e-prop", service_id: "s-on", plan_id: "p1", expected_value: 399, proposal_value: 399, proposal_sent_at: "2026-09-05T12:00:00Z", won_at: null, lost_at: null, created_at: "2026-09-03T12:00:00Z" },
  ],
  experimentais: [{ id: "t1", contact_id: "c2", lead_id: null, scheduled_at: "2026-09-10T10:00:00Z", local: "academia do Tamboré", status: "agendada" }],
  tarefas: [], clientes: [{ id: "k2", contact_id: "c2", status: "ativo", service_id: "s-on", current_plan_id: "p1", renewal_date: "2026-09-16", cancelled_at: null, updated_at: "2026-09-01" }],
  contratos: [], receitas: [],
  atividades: [
    { id: "a1", lead_id: "l1", contact_id: "c1", tipo: "lead_created", metadata: { mensagem_whatsapp: "Olá, Montinho! Li a página da Consultoria Online e fiquei com uma dúvida: Ref: CXTXF" } },
    { id: "a3", lead_id: "l3", contact_id: "c3", tipo: "lead_created", metadata: { mensagem_whatsapp: "Olá, Montinho! Li a página da Consultoria Online e fiquei com uma dúvida: dá pra fazer em casa? Ref: ABCDE" } },
  ],
  handoffs: [{ id: "h1", contact_id: "c1", lead_id: "l1", page_title: "Consultoria Online de Treino | Personal Trainer Online — Montinho | Montinho Personal Trainer", gclid: "x", gbraid: null, wbraid: null, created_at: "2026-09-09T13:51:00Z" }],
  toques: [], gastos: [], historicoEtapas: [],
} as unknown as Base;

const d = contextoDoContato(b, cat, { contactId: "c1", leadId: "l1" }, agora);
ok("Denise: primeiro nome", d.vars.nome === "Denise");
ok("Denise: página limpa", d.vars.pagina === "Consultoria Online de Treino", d.vars.pagina);
ok("Denise: dúvida vazia (só clicou)", d.sinais.pergunta === "");
ok("Denise: interesse com travessão não vira objetivo", d.vars.objetivo === "", d.vars.objetivo);
ok("Denise: veio de anúncio", d.sinais.anuncio === true);
ok("Denise: serviço em minúsculas", d.vars.servico === "consultoria online");
ok("Denise: cai em primeiro contato pelo site", escolherSituacao("novo_sem_contato", d.sinais) === "primeiro_contato_site");
const md = mensagemPara(b, cat, { contactId: "c1", leadId: "l1" }, "novo_sem_contato", agora);
ok("Denise: mensagem cita a página", md.texto.includes("Consultoria Online de Treino"), md.texto);
ok("Denise: mensagem não tem resto de variável", !/[{}\[\]]/.test(md.texto), md.texto);

const e = contextoDoContato(b, cat, { contactId: "c3", leadId: "l3" }, agora);
ok("Elisa: dias desde a proposta = 4", e.vars.dias === "4", e.vars.dias);
ok("Elisa: valor formatado", /^R\$\s?399$/.test(e.vars.valor), e.vars.valor);
ok("Elisa: indicada pela Bruna", e.vars.indicador === "Bruna");
ok("Elisa: proposta → follow-up 1", escolherSituacao("proposta_sem_follow_up", e.sinais) === "proposta_follow_up_1");
ok("Elisa: dúvida guardada com o '?' original", e.sinais.pergunta === "dá pra fazer em casa?", e.sinais.pergunta);
ok("Elisa: variável de citação sai sem o '?'", e.vars.pergunta === "dá pra fazer em casa", e.vars.pergunta);
const mDuvida = mensagemPara(b, cat, { contactId: "c3", leadId: "l3" }, "novo_sem_contato", agora);
ok("citação da dúvida não cria segunda pergunta", (mDuvida.texto.match(/\?/g) ?? []).length === 1, mDuvida.texto);
const me = mensagemPara(b, cat, { contactId: "c3", leadId: "l3" }, "proposta_sem_follow_up", agora);
ok("Elisa: mensagem fala dos dias", me.texto.includes("4"), me.texto);

const br = contextoDoContato(b, cat, { contactId: "c2", clientId: "k2" }, agora);
ok("Bruna: renova em 7 dias", br.vars.renova_em === "7", br.vars.renova_em);
ok("Bruna: plano", br.vars.plano === "Consultoria trimestral · 12 semanas");
ok("Bruna: experimental formatada", br.vars.dia_hora === "amanhã às 7h", br.vars.dia_hora);
ok("Bruna: local", br.vars.local === "academia do Tamboré");
ok("Bruna sem grupo → renovação próxima", escolherSituacao(null, br.sinais) === "renovacao_proxima");

console.log("\n" + "=".repeat(64));
if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
console.log("TODOS OS TESTES PASSARAM");
