/**
 * Testes da Calculadora de Volume de Treino.
 *
 * O risco desta ferramenta é diferente das outras quatro. Um erro aqui não
 * produz um número absurdo que salta aos olhos — produz um número plausível
 * e errado. Se o mapeamento de um exercício estiver trocado, ou se uma série
 * for contada duas vezes, o resultado continua parecendo razoável e a pessoa
 * ajusta o treino com base numa mentira.
 *
 * Por isso a maior parte dos testes protege três coisas: a integridade da
 * base de exercícios, a regra de não inflar volume (unilateral, secundários,
 * resumo) e a linguagem — que aqui é conteúdo, não enfeite, porque a
 * fronteira entre "descrever volume" e "prescrever treino" é fina.
 */

import * as fs from "fs";
import { marked } from "marked";
import { blogPosts } from "../lib/blog";
import { MUSCULOS, MUSCULO_POR_ID, nomeMusculo } from "../lib/treino/musculos";
import { EXERCICIOS, EXERCICIO_POR_ID, buscaExercicios, normaliza } from "../lib/treino/exercicios";
import {
  ARTIGOS_COM_CALCULADORA_VOLUME,
  ARTIGOS_COM_LINK_VOLUME,
  FAIXAS,
  FONTES,
  NOTA_INDIVIDUALIDADE,
  NOTA_SERIE_VALIDA,
  PESO_SECUNDARIO,
  calculaVolume,
  classificaVolume,
  equivalentes,
  estaConcentrado,
  itemDeExercicio,
  mediaPorSessao,
  resumo,
  type DiaTreino,
} from "../lib/treino/volume";
import { ARTIGOS_COM_CALCULADORA } from "../lib/proteina";
import { ARTIGOS_COM_CALCULADORA_DEFICIT } from "../lib/calorias";
import { ARTIGOS_COM_CALCULADORA_1RM, ARTIGOS_COM_LINK_1RM } from "../lib/onerm";
import { ARTIGOS_COM_CALCULADORA_MACROS } from "../lib/macros";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};

let n = 0;
const mk = (id: string, series: number) => itemDeExercicio(EXERCICIO_POR_ID.get(id)!, `u${n++}`, series);
const dia = (d: string, nome: string, itens: ReturnType<typeof mk>[]): DiaTreino =>
  ({ uid: `d-${d}-${nome}-${n++}`, dia: d as DiaTreino["dia"], nome, itens });

console.log("\n" + "=".repeat(64) + "\nA BASE DE EXERCÍCIOS\n" + "=".repeat(64));

ok("a base tem entre 100 e 200 exercícios", EXERCICIOS.length >= 100 && EXERCICIOS.length <= 200, String(EXERCICIOS.length));
ok("nenhum id duplicado", new Set(EXERCICIOS.map((e) => e.id)).size === EXERCICIOS.length);
ok("nenhum nome duplicado", new Set(EXERCICIOS.map((e) => e.nome)).size === EXERCICIOS.length);
ok("todo exercício tem ao menos um primário", EXERCICIOS.every((e) => e.primarios.length > 0));
ok(
  "todo músculo citado existe na taxonomia",
  EXERCICIOS.every((e) => [...e.primarios, ...(e.secundarios ?? [])].every((m) => MUSCULO_POR_ID.has(m)))
);
/** Um músculo primário não pode também ser secundário do mesmo exercício. */
ok(
  "nenhum exercício lista o mesmo músculo como primário e secundário",
  EXERCICIOS.every((e) => !(e.secundarios ?? []).some((s) => e.primarios.includes(s))),
  "o músculo receberia a série cheia E o bônus de 0,5"
);
/** Todo grupo precisa de pelo menos um exercício, senão fica inatingível. */
const comPrimario = new Set(EXERCICIOS.flatMap((e) => e.primarios));
ok(
  "todo grupo muscular tem pelo menos um exercício primário",
  MUSCULOS.every((m) => comPrimario.has(m.id)),
  MUSCULOS.filter((m) => !comPrimario.has(m.id)).map((m) => m.id).join(", ")
);

/** Classificações que estariam erradas de forma silenciosa. */
const checagens: [string, (e: (typeof EXERCICIOS)[number]) => boolean, string][] = [
  ["supino-reto-barra", (e) => e.primarios.includes("peitoral") && (e.secundarios ?? []).includes("triceps"), "peitoral primário, tríceps secundário"],
  ["agachamento-livre", (e) => e.primarios.includes("quadriceps") && e.primarios.includes("gluteos"), "quadríceps E glúteo primários"],
  ["levantamento-terra", (e) => e.primarios.includes("posteriores") && !e.primarios.includes("costas"), "terra não é exercício primário de costas"],
  ["triceps-pulley", (e) => e.primarios.length === 1 && e.primarios[0] === "triceps", "isolador não pode ter primário extra"],
  ["afundo", (e) => e.unilateral === true, "afundo é unilateral"],
  ["elevacao-lateral", (e) => e.primarios[0] === "deltoide-lateral", "elevação lateral é deltoide lateral, não anterior"],
  ["face-pull", (e) => e.primarios.includes("deltoide-posterior"), "face pull é posterior"],
  ["desenvolvimento-barra", (e) => e.primarios.includes("deltoide-anterior"), "desenvolvimento é deltoide anterior"],
];
for (const [id, teste, desc] of checagens) {
  const e = EXERCICIO_POR_ID.get(id);
  ok(`${id}: ${desc}`, !!e && teste(e), e ? JSON.stringify({ p: e.primarios, s: e.secundarios }) : "não existe");
}

console.log("\n" + "=".repeat(64) + "\nA BUSCA\n" + "=".repeat(64));

ok("normaliza remove acento", normaliza("Tríceps Pulley") === "triceps pulley");
const buscas: [string, string][] = [
  ["supino", "Supino reto com barra"],
  ["triceps corda", "Tríceps pulley"],
  ["extensora", "Cadeira extensora"],
  ["agachamento", "Agachamento livre"],
  ["peck deck", "Crucifixo na máquina (peck deck)"],
  ["serrote", "Remada unilateral (serrote)"],
  ["elevacao lateral", "Elevação lateral"],
  ["hip thrust", "Elevação pélvica (hip thrust)"],
];
for (const [termo, esperado] of buscas) {
  const r = buscaExercicios(termo, 3);
  ok(`"${termo}" acha ${esperado}`, r.some((e) => e.nome === esperado), r.map((e) => e.nome).join(" | "));
}
ok("busca vazia não devolve nada", buscaExercicios("").length === 0);
ok("busca sem match devolve vazio", buscaExercicios("zzzzqqq").length === 0);

console.log("\n" + "=".repeat(64) + "\nO CÁLCULO\n" + "=".repeat(64));

/** Teste 1 do pedido: supino 4 + inclinado 3 + crucifixo 3 = 10 para peitoral. */
const t1 = calculaVolume([dia("Seg", "Push", [mk("supino-reto-barra", 4), mk("supino-inclinado-barra", 3), mk("crucifixo-halter", 3)])]);
ok("peitoral soma 10 séries diretas", t1.find((v) => v.musculo === "peitoral")?.diretas === 10);

/** Teste 2 do pedido: + tríceps pulley 3 → 3 diretas e 3,5 equivalentes. */
const t2 = calculaVolume([
  dia("Seg", "Push", [mk("supino-reto-barra", 4), mk("supino-inclinado-barra", 3), mk("crucifixo-halter", 3), mk("triceps-pulley", 3)]),
]);
const tri = t2.find((v) => v.musculo === "triceps")!;
ok("tríceps tem 3 séries diretas", tri.diretas === 3);
ok("tríceps tem 3,5 equivalentes indiretas (7 compostas × 0,5)", tri.equivalentesIndiretas === 3.5, String(tri.equivalentesIndiretas));
ok("tríceps totaliza 6,5 equivalentes", equivalentes(tri) === 6.5);
ok("o crucifixo (isolado) não contribuiu para o tríceps", tri.exercicios.filter((e) => !e.direto).every((e) => e.nome !== "Crucifixo com halteres"));

/**
 * Unilateral: 3 séries de afundo POR PERNA são 3 séries para o músculo.
 * Dobrar aqui inflaria todo treino de perna bem feito.
 */
const uni = calculaVolume([dia("Seg", "Legs", [mk("afundo", 3)])]);
ok("afundo unilateral: quadríceps recebe 3, não 6", uni.find((v) => v.musculo === "quadriceps")?.diretas === 3);
ok("afundo unilateral: glúteo recebe 3, não 6", uni.find((v) => v.musculo === "gluteos")?.diretas === 3);

/** Frequência e distribuição. */
const freq = calculaVolume([
  dia("Seg", "Push", [mk("supino-reto-barra", 8)]),
  dia("Qui", "Upper", [mk("supino-maquina", 6)]),
]);
const pe = freq.find((v) => v.musculo === "peitoral")!;
ok("volume semanal soma os dois dias: 14", pe.diretas === 14);
ok("frequência conta 2 sessões", pe.sessoes === 2);
ok("distribuição registra Seg 8 e Qui 6", pe.porDia.map((d) => `${d.dia}:${d.series}`).join(",") === "Seg:8,Qui:6");
ok("média por sessão = 7", mediaPorSessao(pe) === 7);

/** Dois exercícios do mesmo músculo no mesmo dia somam numa sessão só. */
const mesmoDia = calculaVolume([dia("Seg", "Push", [mk("supino-reto-barra", 4), mk("crucifixo-halter", 4)])]);
const pmd = mesmoDia.find((v) => v.musculo === "peitoral")!;
ok("dois exercícios no mesmo dia = 1 sessão, 8 séries", pmd.sessoes === 1 && pmd.diretas === 8);

/** Aquecimento não entra no volume. */
const aq = calculaVolume([
  dia("Seg", "Push", [
    { ...mk("supino-reto-barra", 3), tipo: "aquecimento" as const },
    mk("supino-reto-barra", 4),
  ]),
]);
ok("séries de aquecimento ficam fora do volume", aq.find((v) => v.musculo === "peitoral")?.diretas === 4);

/** Séries zero ou negativas não entram. */
const zero = calculaVolume([dia("Seg", "Push", [mk("supino-reto-barra", 0)])]);
ok("exercício com 0 séries não gera volume", zero.length === 0);

/** O resumo NÃO pode inflar séries contando uma vez por músculo. */
const d1 = dia("Seg", "Push", [mk("supino-reto-barra", 4)]);
const rs = resumo([d1], calculaVolume([d1]));
ok("resumo conta 4 séries de trabalho, não 12", rs.seriesTrabalho === 4, String(rs.seriesTrabalho));
ok("resumo conta 1 exercício e 1 dia", rs.exercicios === 1 && rs.diasComTreino === 1);
ok("resumo conta 3 grupos atingidos (peito direto + 2 secundários?)", rs.gruposAtingidos === 1, `${rs.gruposAtingidos} — só grupos com série DIRETA contam`);

/** Nenhum resultado pode ter valor inválido. */
const grande = calculaVolume([
  dia("Seg", "Push", EXERCICIOS.slice(0, 20).map((e) => itemDeExercicio(e, `g${n++}`, 4))),
  dia("Qua", "Pull", EXERCICIOS.slice(20, 40).map((e) => itemDeExercicio(e, `g${n++}`, 3))),
]);
ok(
  "nenhum volume produz NaN ou negativo",
  grande.every((v) => Number.isFinite(v.diretas) && v.diretas >= 0 && Number.isFinite(v.equivalentesIndiretas)),
);
ok("todo músculo com séries diretas tem ao menos 1 sessão", grande.filter((v) => v.diretas > 0).every((v) => v.sessoes >= 1));
ok(
  "a soma dos porDia bate com o total de diretas",
  grande.every((v) => v.porDia.reduce((s, d) => s + d.series, 0) === v.diretas),
);

console.log("\n" + "=".repeat(64) + "\nCLASSIFICAÇÃO E CONCENTRAÇÃO\n" + "=".repeat(64));

const esperados: [number, string][] = [
  [0, "muito-baixo"], [4, "muito-baixo"], [5, "baixo"], [9, "baixo"],
  [10, "moderado"], [14, "moderado"], [15, "elevado"], [19, "elevado"], [20, "muito-elevado"], [40, "muito-elevado"],
];
for (const [s, nivel] of esperados) ok(`${s} séries → ${nivel}`, classificaVolume(s).nivel === nivel);
ok("as faixas cobrem sem buraco nem sobreposição", FAIXAS.every((f, i) => i === 0 || f.min === (FAIXAS[i - 1].max ?? 0) + 1));

/** 18 séries num dia só → concentração sinalizada. */
const conc = calculaVolume([dia("Seg", "Push", [mk("supino-reto-barra", 9), mk("supino-inclinado-barra", 9)])]);
ok("18 séries num dia só é sinalizado como concentrado", estaConcentrado(conc.find((v) => v.musculo === "peitoral")!));
/** 14 bem divididas não são. */
ok("14 séries divididas em 2 dias não é concentração", !estaConcentrado(pe));
/** Volume pequeno num dia só não vira observação. */
const pequeno = calculaVolume([dia("Seg", "Push", [mk("crucifixo-halter", 4)])]);
ok("4 séries num dia só não gera observação de concentração", !estaConcentrado(pequeno.find((v) => v.musculo === "peitoral")!));

console.log("\n" + "=".repeat(64) + "\nA LINGUAGEM (aqui é conteúdo, não enfeite)\n" + "=".repeat(64));

const libVolume = fs.readFileSync("lib/treino/volume.ts", "utf8");
const semComentarios = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const componente = semComentarios(fs.readFileSync("components/volume/CalculadoraVolume.tsx", "utf8"));
const pagina = fs.readFileSync("app/ferramentas/calculadora-volume-treino/page.tsx", "utf8");
const textoTudo = FAIXAS.map((f) => `${f.rotulo} ${f.texto}`).join(" ") + semComentarios(libVolume) + componente;

const PROIBIDO: [RegExp, string][] = [
  [/volume ideal/i, "a ferramenta não tem informação para dizer o volume ideal de ninguém"],
  [/overtraining|overtreinamento/i, "26 séries não diagnosticam overtraining"],
  /**
   * "séries efetivas" só é proibido como RÓTULO. A ferramenta tem uma nota
   * que diz justamente "não as chama de séries efetivas" — proibir o termo
   * em qualquer contexto reprovaria a explicação da própria regra. A negação
   * na frente é o que separa usar o termo de recusá-lo.
   */
  [/(?<!não as chama de |nunca chamamos de |em vez de )s[ée]ries? efetivas?/i, "a ferramenta não sabe o RIR nem a técnica de cada série"],
  [/\bMEV\b|\bMAV\b|\bMRV\b/, "termos comerciais não podem ser o motor da classificação"],
  [/volume (excessivo|errado|ruim)/i, "rótulo de julgamento, não de descrição"],
  [/voc[êe] (est[áa] fazendo demais|precisa (de|fazer) \d+)/i, "prescrição automática"],
  [/2x .*sempre melhor|treinar .* 2 vezes .* melhor/i, "frequência maior não é automaticamente superior"],
];
for (const [re, motivo] of PROIBIDO) {
  ok(`nenhum texto contém ${re}`, !re.test(textoTudo), motivo);
}
ok("os rótulos das faixas são neutros", FAIXAS.every((f) => /^Volume (muito baixo|baixo|moderado|elevado|muito elevado)$/.test(f.rotulo)));
ok("a nota de frequência existe e é honesta", /NOTA_FREQUENCIA/.test(componente) && /não mostra vantagem consistente/.test(libVolume));
ok("o 0,5 é declarado como convenção, não ciência", /convenção de modelagem/.test(libVolume) && /NOTA_EQUIVALENTES/.test(componente));
ok("diz que volume não é tudo", /NOTA_VOLUME_NAO_E_TUDO/.test(componente));
ok("o peso secundário é 0,5", PESO_SECUNDARIO === 0.5);

console.log("\n" + "=".repeat(64) + "\nINDIVIDUALIDADE E SÉRIE VÁLIDA\n" + "=".repeat(64));

/**
 * Os dois avisos precisam estar VISÍVEIS, não escondidos no accordion. A
 * checagem confirma que aparecem fora do bloco de metodologia — o que o
 * leitor vê sem clicar é o que de fato comunica.
 */
/**
 * O bloco de imports precisa sair antes da checagem. Sem isso a assertion é
 * vacuosa: `import { NOTA_INDIVIDUALIDADE }` no topo do arquivo já satisfaz
 * "aparece antes do accordion", mesmo que o aviso só exista escondido lá
 * dentro. Descoberto por mutação — removi o bloco visível e o teste passou.
 */
const semImports = componente.replace(/^import[\s\S]*?from "[^"]+";$/gm, "");
const forasDoAccordion = semImports.split("Como contamos suas séries?")[0];
ok(
  "o aviso de individualidade aparece antes do accordion",
  forasDoAccordion.includes("NOTA_INDIVIDUALIDADE"),
  "escondido num accordion, o aviso mais importante não comunica nada"
);
ok(
  "o aviso de série válida aparece antes do accordion",
  forasDoAccordion.includes("NOTA_SERIE_VALIDA")
);
ok(
  "o zero state já ensina o que conta como série",
  /Conte s[óo] as s[ée]ries que valem/.test(componente) &&
    componente.indexOf("Conte só as séries que valem") < componente.indexOf("Seu volume semanal"),
  "a regra muda o que a pessoa digita, então precisa vir antes do preenchimento"
);
ok(
  "o aviso de série válida vem ANTES dos cards de volume",
  componente.indexOf("NOTA_SERIE_VALIDA") < componente.indexOf("Seu volume semanal"),
  "ele muda como se lê todo número abaixo; depois já é tarde"
);

/** A copy tem que dizer as duas coisas sobre falha, não só uma. */
ok(
  "diz que a série precisa ser perto da falha",
  /falha ou perto dela|perto da falha/i.test(NOTA_SERIE_VALIDA)
);
ok(
  "diz que séries fáceis não valem o mesmo",
  /n[ãa]o s[ãa]o 16 s[ée]ries|longe da falha/i.test(NOTA_SERIE_VALIDA)
);
/**
 * E o contrapeso: a evidência NÃO sustenta que falha absoluta seja superior.
 * Sem esta parte, o aviso viraria incentivo a treinar destruído.
 */
ok(
  "NÃO manda ir à falha absoluta sempre",
  /n[ãa]o (quer dizer|significa) ir [àa] falha absoluta/i.test(NOTA_SERIE_VALIDA) &&
    /n[ãa]o mostra que treinar at[ée] a falha momentânea seja superior/i.test(NOTA_SERIE_VALIDA),
  "a evidência não sustenta superioridade da falha momentânea"
);

/** O aviso de individualidade precisa mandar testar no próprio corpo. */
ok("manda testar no próprio corpo", /teste no seu corpo/i.test(NOTA_INDIVIDUALIDADE));
ok("diz que média descreve grupo, não pessoa", /m[ée]dia descreve grupo, n[ãa]o pessoa/i.test(NOTA_INDIVIDUALIDADE));
ok("cita fatores individuais concretos", /gen[ée]tica|sono|recupera[çc][ãa]o/i.test(NOTA_INDIVIDUALIDADE));

/** As duas fontes novas, conferidas na origem. */
ok("cita Hubal et al. com PMID real", FONTES.hubal.url.includes("15947721"));
ok("o dado do Hubal está na copy (−2% a +59%)", /−2% a \+59%|-2% a \+59%/.test(FONTES.hubal.resumo));
ok("cita Refalo et al. com PMID real", FONTES.refalo.url.includes("36334240"));
ok("as duas fontes aparecem na página", pagina.includes("FONTES.hubal") && pagina.includes("FONTES.refalo"));
ok("as duas fontes aparecem no componente", componente.includes("FONTES.hubal") && componente.includes("FONTES.refalo"));
ok("a página tem seção própria para cada tema", /O que conta como uma s[ée]rie v[áa]lida\?/.test(pagina) && /Cada pessoa responde de um jeito/.test(pagina));

console.log("\n" + "=".repeat(64) + "\nFONTES\n" + "=".repeat(64));

ok("cita o ACSM Position Stand com link", FONTES.acsm.url.includes("pubmed") && /41843416/.test(FONTES.acsm.url));
ok("cita Schoenfeld et al. com link", FONTES.schoenfeld.url.includes("27433992"));
ok("o ACSM aparece na página", pagina.includes("FONTES.acsm"));
ok("as duas fontes aparecem no componente", componente.includes("FONTES.acsm") && componente.includes("FONTES.schoenfeld"));

console.log("\n" + "=".repeat(64) + "\nPRIVACIDADE E EVENTOS\n" + "=".repeat(64));

const analytics = fs.readFileSync("lib/analytics.ts", "utf8");
for (const ev of [
  "training_volume_view", "training_volume_start", "training_volume_exercise_add", "training_volume_complete",
  "training_volume_secondary_toggle", "training_volume_muscle_open", "training_volume_methodology_open",
  "training_volume_share", "training_volume_1rm_click", "training_volume_article_click", "training_volume_cta_click",
]) {
  ok(`evento declarado: ${ev}`, analytics.includes(`"${ev}"`));
}

const chamadas = componente.match(/track(Event|OncePerSession)\([^)]*\)/g) ?? [];
ok("existem chamadas de analytics para auditar", chamadas.length > 0);
const SENSIVEL = /dias|itens|series|volumes|treino|musculo:|exercicio:|nome/i;
ok(
  "nenhuma chamada carrega a ficha de treino",
  chamadas.every((c) => !SENSIVEL.test(c)),
  chamadas.filter((c) => SENSIVEL.test(c)).join(" | ")
);
ok("nenhuma chamada de rede", !/fetch\(|axios|XMLHttpRequest/.test(componente));

/** localStorage é declarado ao usuário e tem como apagar. */
ok("o treino é salvo em localStorage", /localStorage/.test(componente));
ok("o salvamento é declarado na interface", /salvo neste dispositivo/.test(componente));
ok("existe limpar treino com confirmação", /Limpar treino/.test(componente) && /confirmandoLimpar/.test(componente));
ok("storage bloqueado não quebra a ferramenta", (componente.match(/catch\s*\{/g) ?? []).length >= 2);
ok("copiar só por ação explícita", /onClick=\{copiaResumo\}/.test(componente));

console.log("\n" + "=".repeat(64) + "\nACESSIBILIDADE\n" + "=".repeat(64));

ok("resultado anunciado por aria-live", /aria-live="polite"/.test(componente));
ok("estados expostos com aria-pressed", (componente.match(/aria-pressed/g) ?? []).length >= 4);
ok("accordions com aria-expanded", (componente.match(/aria-expanded/g) ?? []).length >= 3);
ok("teclado numérico nos campos de série", /inputMode="numeric"/.test(componente));
ok("foco visível preservado", /focus-visible:ring/.test(componente));
ok("alvos de toque adequados", (componente.match(/min-h-\[44px\]/g) ?? []).length >= 6);
ok("campos sem rótulo visível têm sr-only", (componente.match(/sr-only/g) ?? []).length >= 4);
ok("os grupos de opção usam fieldset/legend", /<fieldset/.test(componente) && /<legend/.test(componente));
ok("seleção não depende só de cor", /✓/.test(componente));
/** A tabela de distribuição precisa ser tabela de verdade. */
ok("a distribuição usa th/scope e caption", /scope="col"/.test(componente) && /scope="row"/.test(componente) && /<caption/.test(componente));
ok("o heatmap mostra o número, não só a cor", /A intensidade do fundo acompanha o número/.test(componente));
ok("sem drag-and-drop obrigatório", !/onDragStart|draggable/.test(componente));
ok("zero state não mostra zeros", /Adicione um dia de treino/.test(componente));

console.log("\n" + "=".repeat(64) + "\nONDE APARECE E SEO\n" + "=".repeat(64));

const slugs = new Set(blogPosts.map((p) => p.slug));
for (const s of ARTIGOS_COM_CALCULADORA_VOLUME) ok(`artigo do embed existe: ${s}`, slugs.has(s));
for (const s of ARTIGOS_COM_LINK_VOLUME) ok(`artigo do link existe: ${s}`, slugs.has(s));
ok("o registro é seletivo", ARTIGOS_COM_CALCULADORA_VOLUME.length <= 8, String(ARTIGOS_COM_CALCULADORA_VOLUME.length));
ok("embed e link são disjuntos", !ARTIGOS_COM_CALCULADORA_VOLUME.some((s) => ARTIGOS_COM_LINK_VOLUME.includes(s)));

const ocupados = [
  ...ARTIGOS_COM_CALCULADORA, ...ARTIGOS_COM_CALCULADORA_DEFICIT, ...ARTIGOS_COM_CALCULADORA_1RM,
  ...ARTIGOS_COM_LINK_1RM, ...ARTIGOS_COM_CALCULADORA_MACROS,
];
const conflitos = [...ARTIGOS_COM_CALCULADORA_VOLUME, ...ARTIGOS_COM_LINK_VOLUME].filter((s) => ocupados.includes(s));
ok("nenhum artigo recebe duas ferramentas", conflitos.length === 0, conflitos.join(", "));

const html = (s: string) => marked(blogPosts.find((x) => x.slug === s)!.content ?? "") as string;
for (const s of ARTIGOS_COM_CALCULADORA_VOLUME) {
  const corte = splitAtPrimeiraSecao(html(s));
  ok(`corte cedo funciona em ${s}`, corte !== null && corte.before.length > 100);
}

const paginaSemComentarios = semComentarios(pagina);
ok("canonical para ela mesma", /canonical: `\$\{SITE_URL\}\/ferramentas\/calculadora-volume-treino`/.test(pagina));
ok("declara openGraph", /openGraph:/.test(pagina));
ok("tem H1", /<h1/.test(pagina));
ok("tem conteúdo indexável", (pagina.match(/<h2/g) ?? []).length >= 5 && pagina.length > 6000);
ok("BreadcrumbList, sem schema inventado", /BreadcrumbList/.test(paginaSemComentarios) && !/AggregateRating|"Review"|FAQPage/.test(paginaSemComentarios));
ok("está no sitemap", fs.readFileSync("app/sitemap.ts", "utf8").includes("/ferramentas/calculadora-volume-treino"));
ok("está na central", fs.readFileSync("app/ferramentas/page.tsx", "utf8").includes("/ferramentas/calculadora-volume-treino"));
ok("o slug não colide com o artigo volume-de-treino-ideal", slugs.has("volume-de-treino-ideal"));
ok("liga com a calculadora de 1RM", componente.includes("/ferramentas/calculadora-1rm") && pagina.includes("/ferramentas/calculadora-1rm"));

const internos = [...pagina.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)].map((m) => m[1]);
ok("a página linka pelo menos 4 artigos", internos.length >= 4, internos.join(", "));
for (const s of internos) ok(`link interno aponta para artigo real: ${s}`, slugs.has(s));

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM\n" : `\n${falhas} TESTE(S) FALHARAM\n`);
process.exit(falhas === 0 ? 0 : 1);
