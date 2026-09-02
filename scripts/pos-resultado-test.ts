/**
 * Bloco pós-resultado das ferramentas.
 *   npx tsx scripts/pos-resultado-test.ts
 *
 * O bloco é a hora em que a ferramenta pede algo em troca do que entregou.
 * Os testes protegem: a copy (interpretação, não propaganda), a escada de
 * compromisso (próxima → diagnóstico → WhatsApp), a coerência de destino
 * (todo href existe), a privacidade da mensagem e da medição, e o fato de
 * que o bloco entrou em TODAS as ferramentas — e a sticky saiu delas.
 */

import { existsSync, readFileSync } from "node:fs";
import {
  anterior,
  estagio,
  type Ferramenta,
  type Historico,
} from "../lib/ferramentas/historico";
import {
  NOME,
  PROXIMA,
  ROTA,
  VARIANTES_PERGUNTA,
  blocoPosResultado,
  type Variante,
} from "../lib/ferramentas/pos-resultado";
import { regraPorRota } from "../lib/sticky/regras";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}
const semComents = (s: string) =>
  s.replace(/\{\/\*[\s\S]*?\*\/\}/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");

const FERRAMENTAS = Object.keys(ROTA) as Ferramenta[];
const CATEGORIAS: Record<Ferramenta, string[]> = {
  proteina: ["padrao", "alta", "baixa"],
  macros: ["padrao", "fora_amdr", "impossivel"],
  deficit: ["padrao", "leve", "moderado", "maior"],
  tdee: ["padrao"],
  onerm: ["padrao"],
  volume: ["padrao", "baixo", "alto", "adequado"],
  diagnostico: ["padrao"],
  rotina: ["padrao"],
  academia: ["padrao"],
  cardapio: ["padrao"],
  alimentos: ["padrao"],
};
const ESTAGIOS = ["proxima", "diagnostico", "whatsapp"] as const;
const VARIANTES = Object.keys(VARIANTES_PERGUNTA) as Variante[];

/* Todas as combinações que o site pode montar. */
const TODOS = FERRAMENTAS.flatMap((f) =>
  CATEGORIAS[f].flatMap((c) =>
    ESTAGIOS.flatMap((e) =>
      VARIANTES.map((v) => ({ f, c, e, v, b: blocoPosResultado(f, c, e, v, "um resultado de teste") })),
    ),
  ),
);

const analytics = readFileSync("lib/analytics.ts", "utf8");
const comp = semComents(readFileSync("components/ferramentas/PosResultado.tsx", "utf8"));
const lib = readFileSync("lib/ferramentas/pos-resultado.ts", "utf8");
const hist = readFileSync("lib/ferramentas/historico.ts", "utf8");

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. A COPY INTERPRETA, NÃO VENDE");

const PROIBIDOS: [string, RegExp][] = [
  ["urgência falsa", /compre agora|[úu]ltima chance|s[óo] hoje|vagas? limitad|corra|aproveite/i],
  ["promessa de resultado", /garantid|resultado certo|em \d+ dias/i],
  ["promessa médica", /\bcur[ae]\b|resolva sua les|acabe com a dor|elimine a dor|sem dor/i],
  ["gritaria", /[A-ZÁÉÍÓÚÇ]{6,}/],
  ["corporativês", /premium|solu[çc][ãa]o completa|exclusiv/i],
  ["desconto/preço", /desconto|promo[çc][ãa]o|R\$|gr[áa]tis por tempo/i],
  ["conselho registrado", /CREF|CONFEF/],
];
for (const { f, c, b } of TODOS.filter((t) => t.e === "whatsapp" && t.v === "a")) {
  const texto = [b.interpretacao, b.pergunta, b.botao, b.secundaria?.label ?? "", decodeURIComponent(b.href)].join(" ");
  for (const [nome, re] of PROIBIDOS) ok(`${f}/${c}: sem ${nome}`, !re.test(texto), texto.match(re)?.[0]);
}
/* A interpretação diz o que o número NÃO resolve sozinho — é a camada 2. */
for (const f of FERRAMENTAS) {
  const t = blocoPosResultado(f, "padrao", "proxima", "a", null);
  ok(`${f}: interpretação tem tamanho de frase, não de slogan`, t.interpretacao.length >= 60 && t.interpretacao.length <= 260, String(t.interpretacao.length));
  ok(`${f}: a pergunta é pergunta`, /\?$/.test(t.pergunta));
}
/* Categoria muda o texto: "alto" e "baixo" não podem receber a mesma frase. */
for (const f of FERRAMENTAS) {
  const cats = CATEGORIAS[f];
  const inter = new Set(cats.map((c) => blocoPosResultado(f, c, "whatsapp", "a", null).interpretacao));
  ok(`${f}: cada categoria tem interpretação própria (${cats.length})`, inter.size === cats.length);
  const pedidos = new Set(cats.map((c) => blocoPosResultado(f, c, "whatsapp", "a", null).href));
  ok(`${f}: cada categoria pede algo diferente no WhatsApp`, pedidos.size === cats.length);
}
ok("categoria desconhecida cai em padrao, nunca quebra",
  blocoPosResultado("proteina", "nao-existe", "whatsapp", "a", null).interpretacao ===
    blocoPosResultado("proteina", "padrao", "whatsapp", "a", null).interpretacao);

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. A ESCADA: PRÓXIMA → DIAGNÓSTICO → WHATSAPP");

const h = (usadas: Ferramenta[], abriuWhatsapp = false): Historico => ({ usadas, abriuWhatsapp });
ok("1ª ferramenta → próxima", estagio(h([]), "proteina") === "proxima");
ok("2ª ferramenta → diagnóstico", estagio(h(["proteina"]), "macros") === "diagnostico");
ok("3ª ferramenta → WhatsApp", estagio(h(["proteina", "macros"]), "deficit") === "whatsapp");
ok("5ª ferramenta continua WhatsApp", estagio(h(["proteina", "macros", "deficit", "tdee"]), "onerm") === "whatsapp");
ok("refazer a MESMA ferramenta não sobe degrau", estagio(h(["proteina"]), "proteina") === "proxima");
ok("a mesma ferramenta não conta duas vezes", estagio(h(["proteina", "macros"]), "macros") === "diagnostico");
ok("quem já abriu WhatsApp desce para diagnóstico (não satura)",
  estagio(h(["proteina", "macros"], true), "deficit") === "diagnostico");
ok("previous_tool é a última DIFERENTE", anterior(h(["proteina", "macros"]), "macros") === "proteina");
ok("previous_tool vazio na primeira", anterior(h([]), "proteina") === null);

for (const f of FERRAMENTAS) {
  const p = blocoPosResultado(f, "padrao", "proxima", "a", null);
  const d = blocoPosResultado(f, "padrao", "diagnostico", "a", null);
  const w = blocoPosResultado(f, "padrao", "whatsapp", "a", null);
  if (PROXIMA[f]) {
    ok(`${f}: estágio próxima leva a ${PROXIMA[f]!.ferramenta}`, p.destino === "ferramenta" && p.href === ROTA[PROXIMA[f]!.ferramenta]);
    ok(`${f}: estágio próxima ainda oferece conversa, discreta`, p.secundaria?.destino === "whatsapp");
  } else {
    ok(`${f}: sem próxima → conversa em qualquer estágio`, p.destino === "whatsapp" && p.secundaria === undefined);
  }
  if (f !== "diagnostico" && PROXIMA[f]) {
    ok(`${f}: estágio diagnóstico leva ao /diagnostico`, d.destino === "diagnostico" && d.href === "/diagnostico");
  }
  ok(`${f}: estágio WhatsApp leva ao WhatsApp`, w.destino === "whatsapp" && /^https:\/\/wa\.me\//.test(w.href));
  ok(`${f}: estágio WhatsApp mantém saída sozinho, discreta`,
    PROXIMA[f] ? w.secundaria?.destino === "ferramenta" : w.secundaria === undefined);
}
ok("diagnóstico nunca manda para o próprio diagnóstico",
  ESTAGIOS.every((e) => blocoPosResultado("diagnostico", "padrao", e, "a", null).href !== "/diagnostico"));
/* Uma ação por bloco: principal e secundária nunca apontam para o mesmo lugar. */
for (const { f, c, e, b } of TODOS) {
  if (b.secundaria) ok(`${f}/${c}/${e}: principal ≠ secundária`, b.secundaria.href !== b.href);
}
ok("volume no estágio diagnóstico não repete o diagnóstico na secundária",
  blocoPosResultado("volume", "padrao", "diagnostico", "a", null).secundaria?.destino === "whatsapp");

/* A jornada do briefing. */
ok("proteína → macros → cardápio", PROXIMA.proteina?.ferramenta === "macros" && PROXIMA.macros?.ferramenta === "cardapio");
ok("gasto → déficit → macros", PROXIMA.tdee?.ferramenta === "deficit" && PROXIMA.deficit?.ferramenta === "macros");
ok("1RM → volume → diagnóstico", PROXIMA.onerm?.ferramenta === "volume" && PROXIMA.volume?.ferramenta === "diagnostico");
ok("academia → rotina", PROXIMA.academia?.ferramenta === "rotina");
ok("a jornada não tem ciclo", (() => {
  for (const f of FERRAMENTAS) {
    const vistos = new Set<Ferramenta>([f]);
    let atual: Ferramenta | undefined = PROXIMA[f]?.ferramenta;
    while (atual) { if (vistos.has(atual)) return false; vistos.add(atual); atual = PROXIMA[atual]?.ferramenta; }
  }
  return true;
})());

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. TODO DESTINO EXISTE");

const rotaExiste = (href: string) => {
  const p = href.replace(/^\//, "").replace(/\/$/, "");
  return existsSync(`app/${p}/page.tsx`);
};
for (const [f, r] of Object.entries(ROTA)) ok(`rota de ${f} existe: ${r}`, rotaExiste(r));
for (const { f, c, e, b } of TODOS.filter((t) => t.v === "a")) {
  for (const href of [b.href, b.secundaria?.href].filter((x): x is string => !!x)) {
    if (href.startsWith("/")) ok(`${f}/${c}/${e}: ${href} existe`, rotaExiste(href));
    else ok(`${f}/${c}/${e}: link externo é o WhatsApp`, /^https:\/\/wa\.me\/\d+\?text=/.test(href));
  }
}

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. A MENSAGEM DO WHATSAPP: CONTEXTO, NÃO DADO DO CORPO");

for (const f of FERRAMENTAS) {
  const b = blocoPosResultado(f, "padrao", "whatsapp", "a", "um resultado de teste");
  const msg = decodeURIComponent(b.href.split("text=")[1]);
  ok(`${f}: abre com saudação e nomeia a ferramenta`, msg.startsWith("Olá, Montinho!") && msg.includes(NOME[f]));
  ok(`${f}: leva o resumo do resultado`, msg.includes("um resultado de teste"));
  ok(`${f}: termina com pedido, não com pergunta vazia`, /[.!]$/.test(msg) && msg.length < 260, String(msg.length));
}
ok("sem resumo a mensagem continua bem formada",
  decodeURIComponent(blocoPosResultado("tdee", "padrao", "whatsapp", "a", null).href).includes("no seu site. "));
/* A biblioteca não tem como receber dado do corpo: a assinatura só aceita resumo. */
ok("a mensagem é montada só com ferramenta, resumo e pedido", /function mensagem\(f: Ferramenta, resumo: string \| null, pedido: string\)/.test(lib));
/* O pedido é texto fixo: nenhum número entra nele — número só vem do resumo. */
for (const f of FERRAMENTAS) for (const c of CATEGORIAS[f]) {
  const msg = decodeURIComponent(blocoPosResultado(f, c, "whatsapp", "a", null).href.split("text=")[1]);
  ok(`${f}/${c}: pedido sem número, sem peso, idade, altura ou doença`,
    !/\d/.test(msg.replace(NOME[f], "")) && !/\b(meu peso|minha idade|minha altura|doen[çc]a|les[ãa]o|rem[ée]dio)\b/i.test(msg), msg);
}

/* Os resumos que as ferramentas montam: número do RESULTADO, nunca do corpo. */
const RESUMOS: Array<[string, RegExp]> = [
  ["components/proteina/CalculadoraProteina.tsx", /resumo=\{totalPratico !== null \? `\$\{totalPratico\} g de proteína por dia` : null\}/],
  ["components/macros/CalculadoraMacros.tsx", /resumo=\{`\$\{formataNumero\(r\.proteina\.gramas\)\} g de proteína/],
  ["components/calorias/CalculadoraDeficit.tsx", /sobre um gasto de ≈ \$\{formataFaixa\(resultado\.tdee\)\} kcal\/dia/],
  ["components/tdee/CalculadoraTDEE.tsx", /resumo=\{`gasto estimado de ≈ \$\{formataFaixa\(tdee\)\} kcal\/dia`\}/],
  ["components/onerm/CalculadoraOneRM.tsx", /resumo=\{`1RM estimado de ≈ \$\{arredondaKg\(umRM\)\} kg/],
  ["components/academias/AcademiaQuiz.tsx", /resumo=\{rec\.top\.length \? `a academia sugerida foi \$\{rec\.top\[0\]\.academia\.nome\}` : null\}/],
];
for (const [arq, re] of RESUMOS) {
  const s = readFileSync(arq, "utf8");
  ok(`${arq}: resumo é o resultado, na forma esperada`, re.test(s));
  const trecho = s.match(/resumo=\{[\s\S]*?\n?\s*placement=/g) ?? [];
  ok(`${arq}: o resumo não interpola peso, altura, idade ou sexo`,
    trecho.length > 0 && trecho.every((t) => !/\$\{(peso|altura|idade|sexo|pesoTexto)\b/.test(t)), trecho.join(" | "));
}

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. O HISTÓRICO: SESSÃO, SÓ NOMES");

ok("usa sessionStorage, nunca localStorage", /sessionStorage/.test(semComents(hist)) && !/localStorage/.test(semComents(hist)));
ok("guarda só nomes de ferramenta e a flag de WhatsApp",
  /usadas: Ferramenta\[\]/.test(hist) && /abriuWhatsapp: boolean/.test(hist) && !/resultado|kcal|gramas|peso/.test(hist.replace(/\/\*[\s\S]*?\*\//g, "")));
ok("registraConclusao devolve o histórico ANTES (o estágio é sobre o que veio antes)",
  /const antes = leHistorico\(\);[\s\S]*return antes;/.test(hist));
for (const [arq, f] of [
  ["components/volume/CalculadoraVolume.tsx", "volume"],
  ["components/diagnostico/DiagnosticoQuiz.tsx", "diagnostico"],
  ["components/rotina/RotinaQuiz.tsx", "rotina"],
]) {
  ok(`${arq}: registra a conclusão no histórico (${f})`, readFileSync(arq, "utf8").includes(`registraConclusao("${f}")`));
}

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. O COMPONENTE: DEPOIS DO RESULTADO, UMA AÇÃO, MEDIDO SEM DADO PESSOAL");

const INTEGRADAS: Array<[string, Ferramenta]> = [
  ["components/proteina/CalculadoraProteina.tsx", "proteina"],
  ["components/macros/CalculadoraMacros.tsx", "macros"],
  ["components/calorias/CalculadoraDeficit.tsx", "deficit"],
  ["components/tdee/CalculadoraTDEE.tsx", "tdee"],
  ["components/onerm/CalculadoraOneRM.tsx", "onerm"],
  ["components/academias/AcademiaQuiz.tsx", "academia"],
];
for (const [arq, f] of INTEGRADAS) {
  const s = readFileSync(arq, "utf8");
  ok(`${arq}: monta <PosResultado ferramenta="${f}">`, new RegExp(`<PosResultado[\\s\\S]{0,40}ferramenta="${f}"`).test(s));
  ok(`${arq}: não tem mais o link genérico para /consultoria`, !/href="\/consultoria"/.test(s));
}
ok("a variante a/b/c é estável por visitante (localStorage) e só muda a pergunta",
  /localStorage\.getItem\(CH_VARIANTE\)/.test(comp) && /VARIANTES_PERGUNTA/.test(lib));
ok("as três variantes têm o mesmo destino e a mesma mensagem", (() => {
  const [a, b, c] = VARIANTES.map((v) => blocoPosResultado("tdee", "padrao", "whatsapp", v, "x"));
  return a.href === b.href && b.href === c.href && new Set([a.pergunta, b.pergunta, c.pergunta]).size === 3;
})());
ok("categoria com pergunta própria ignora a variante (o resultado manda)",
  new Set(VARIANTES.map((v) => blocoPosResultado("proteina", "alta", "whatsapp", v, null).pergunta)).size === 1);
ok("exposição contada uma vez por ferramenta por sessão", /CH_VISTO \+ ferramenta/.test(comp) && /sessionStorage/.test(comp));
ok("botão de WhatsApp abre em nova aba com rel seguro", /target="_blank" rel="noopener noreferrer"/.test(comp));
ok("não abre nada sozinho (sem window.open, sem location)", !/window\.open|location\.(href|assign)/.test(comp));
ok("a nota de privacidade aparece quando o destino é WhatsApp", /Não vai peso, idade nem nada de saúde/.test(comp));
ok("botão principal tem alvo de toque ≥ 48 px e foco visível", /min-h-\[52px\]/.test(comp) && /focus-visible:outline/.test(comp));
ok("acessível: section com aria-label", /aria-label="Próximo passo"/.test(comp));

/* Eventos: declarados, disparados, e sem dado pessoal nos parâmetros. */
for (const e of ["post_tool_cta_view", "post_tool_cta_click", "post_tool_secondary_click", "tool_journey_continue", "tool_to_whatsapp"]) {
  ok(`${e} declarado e disparado`, analytics.includes(`"${e}"`) && comp.includes(`"${e}"`));
}
ok("os parâmetros são os do briefing",
  ["tool_name", "tool_result_category", "cta_variant", "cta_destination", "session_tool_count", "previous_tool", "placement"]
    .every((p) => new RegExp(`\\b${p}:`).test(comp)));
{
  const chamadas = comp.match(/trackEvent\([\s\S]*?\);/g) ?? [];
  ok("nenhum parâmetro de evento leva dado pessoal ou o resumo",
    chamadas.length >= 5 && chamadas.every((c) => !/peso|kcal|idade|sexo|altura|email|nome|telefone|resumo|href|url/i.test(c)));
}
ok("os eventos antigos de CTA genérica saíram do catálogo",
  ["protein_cta_click", "macro_cta_click", "calorie_cta_click", "one_rm_cta_click", "gym_personal_click"].every((e) => !analytics.includes(`"${e}"`)));

// ─── 7 ──────────────────────────────────────────────────────────────────────
bloco("7. A STICKY SAIU DAS FERRAMENTAS (uma oferta por tela)");

for (const f of FERRAMENTAS) {
  if (f === "alimentos") continue;
  ok(`sticky não aparece em ${ROTA[f]}`, regraPorRota(ROTA[f]) === null);
}
ok("a tabela de alimentos (sem resultado) continua com sticky", regraPorRota("/alimentos/frango") === "alimentos");

console.log("\n" + "=".repeat(64));
if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
console.log("TODOS OS TESTES PASSARAM");
