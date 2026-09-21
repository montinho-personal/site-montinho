/**
 * O que o Google efetivamente mostra na SERP.
 *   npx tsx scripts/seo-serp-test.ts
 *
 * Este arquivo existe por causa de um defeito que nenhum teste pegava porque
 * ninguém estava olhando para o lugar certo. Os metaTitles do blog pareciam
 * curtos e bem comportados no código — 38 a 49 caracteres. Só que o layout
 * raiz anexa `%s | Montinho Personal Trainer` a todo título, e o que chegava
 * na busca tinha 70 e poucos caracteres. O Google cortava o final.
 *
 * Em 83 artigos era pior: a marca estava escrita à mão no metaTitle E o
 * template anexava de novo, produzindo "… | Montinho Personal Trainer |
 * Montinho Personal Trainer".
 *
 * A correção foi desligar o template nas páginas de artigo (`title:
 * { absolute }`). Os testes abaixo travam essa decisão e a qualidade dos
 * títulos que ela viabilizou.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { blogPosts } from "../lib/blog";
import { ABERTO, FECHADO, INICIO, LEITURA_A_PARTIR_DE, ENCERRADO_EM } from "./experimento-titulos";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

const pagina = readFileSync("app/blog/[slug]/page.tsx", "utf8");

/**
 * Os 12 artigos revisados na auditoria de 30/08/2026, escolhidos por
 * impressão real no Search Console. Eles seguem a régua apertada; o resto do
 * acervo ainda não passou por revisão e só responde às travas globais.
 */
const REVISADOS = [
  /* Lote 3 — 02/09/2026: as dez seguintes com CTR zero na primeira página. */
  "cerveja-engorda",
  "quantos-kg-perder-por-mes",
  "frutas-antes-do-treino",
  "quanto-tempo-dura-um-treino",
  "whey-protein-para-quem-usa-mounjaro",
  "musculacao-apos-60-anos",
  "bluefit-alphaville",
  "balanca-nao-muda-mas-o-corpo-muda",
  "natacao-emagrece",
  "como-voltar-academia-depois-de-parado",
  /* Lote 2 — 02/09/2026: as dez com CTR ZERO e mais impressões, todas já na
     primeira página. 2.808 impressões e nenhum clique em três meses. */
  "dormir-depois-do-almoco-engorda",
  "quanto-tempo-de-caminhada-por-dia",
  "quanto-tempo-para-ganhar-massa-muscular",
  "quanto-de-cardio-fazer",
  "tirzepatida-e-musculacao",
  "fibras-musculares-tipo-1-tipo-2",
  "zumba-emagrece",
  "agachamento-bulgaro-como-fazer",
  "tapioca-engorda",
  "musculacao-ou-corrida-para-emagrecer",
  /* Lote 1 — 30/08/2026: as doze de maior impressão. */
  "polichinelo-emagrece",
  "quantas-calorias-tem-1kg-de-gordura",
  "crossover-vs-crucifixo",
  "smart-fit-vs-bluefit",
  "retatrutida-faz-perder-musculos",
  "da-para-comer-pamonha-e-emagrecer",
  "cardio-ou-musculacao-mounjaro",
  "treino-upper-lower-superior-inferior",
  "quantos-quilos-perder-ate-fim-do-ano",
  "eliptico-emagrece",
  "acai-engorda",
  "proteina-para-quem-usa-mounjaro",
];

const porSlug = new Map(blogPosts.map((p) => [p.slug, p]));

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. O TÍTULO DO ARTIGO NÃO RECEBE O SUFIXO DA MARCA");

/**
 * `title: { absolute: ... }` é o que impede o template do layout de anexar os
 * 28 caracteres da marca. Sem isso, todo título desta auditoria volta a
 * nascer truncado e os 12 textos abaixo perdem o sentido.
 */
ok("a página de artigo declara o título como absoluto",
  /title:\s*\{\s*absolute:\s*title\s*\}/.test(pagina));
ok("o motivo está registrado no código", /28 caracteres|template/i.test(pagina));

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. NENHUM DOS REVISADOS CARREGA A MARCA NO TÍTULO");

/**
 * Com o template desligado, marca escrita à mão não duplica mais — mas
 * continua sendo desperdício. Em busca informacional ("polichinelo
 * emagrece") quem pesquisa ainda não conhece a marca, então ela não compra
 * clique nenhum e ocupa o espaço mais caro da página.
 */
for (const slug of REVISADOS) {
  const p = porSlug.get(slug);
  if (!p) { ok(`${slug} existe`, false); continue; }
  const t = p.metaTitle || p.title;
  ok(`${slug}: sem marca no título`, !/montinho/i.test(t), t);
}

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. TÍTULO CABE NA SERP");

/**
 * 60 é referência, não lei — o Google corta por pixel, não por caractere. O
 * teto de 62 dá folga para uma palavra a mais quando ela paga o espaço, e
 * ainda reprova o título que voltou a inchar.
 */
for (const slug of REVISADOS) {
  const p = porSlug.get(slug)!;
  const t = p.metaTitle || p.title;
  ok(`${slug}: título com ${t.length} caracteres`, t.length <= 62, t);
}

// ─── 3b ─────────────────────────────────────────────────────────────────────
bloco("3b. O TÍTULO NÃO ESTÁ CORTADO NEM MAL ESCRITO");

/**
 * Dois defeitos que aparecem NA BUSCA e não em lugar nenhum do site.
 *
 * Reticências: dois metaTitles terminavam em "…" literal — cortados na hora
 * de escrever para caber no limite, e publicados assim. O leitor vê um
 * título que morre no meio.
 *
 * Acentuação: o metaTitle de musculacao-ou-corrida trazia "Musculacao" sem
 * cedilha enquanto o H1 estava correto. Como é o metaTitle que vai para o
 * Google, o erro só existia onde ninguém do site olhava.
 */
for (const slug of REVISADOS) {
  const p = porSlug.get(slug)!;
  const t = p.metaTitle || p.title;
  ok(`${slug}: título não termina cortado`, !/(\.\.\.|…)\s*$/.test(t), t);
}
{
  /* Palavras que existem com e sem acento e passam batido no título. */
  const SEM_ACENTO = /\b(musculacao|nutricao|proteina|calorias?\b(?! )|abdomen|exercicio|refeicao|reducao|hipertrofia\b(?! )|saude|voce|nao|tecnica|gluteo|joelho\b(?! ))\b/i;
  const erradas = REVISADOS
    .map((s) => ({ s, t: porSlug.get(s)!.metaTitle || porSlug.get(s)!.title }))
    .filter((x) => SEM_ACENTO.test(x.t));
  ok("nenhum título com palavra sem acento", erradas.length === 0,
    erradas.map((x) => `${x.s}: ${x.t}`).join(" | "));
}

// ─── 3c ─────────────────────────────────────────────────────────────────────
bloco("3c. NENHUM ARTIGO DO ACERVO ESTREIA COM RETICÊNCIA NA SERP");

/**
 * O bloco 3b acima só olha para os 12+20 revisados. O defeito estava no
 * resto: 62 metaTitles e 87 metaDescriptions do acervo terminavam em "…"
 * literal — texto cortado na hora de escrever e publicado assim. Os títulos
 * tinham de 47 a 57 caracteres, ou seja, foram cortados longe do limite de
 * 62. Não era o Google truncando: nascia truncado.
 *
 * A auditoria de 15/09/2026 mediu comprimento e duplicata e não viu isto,
 * porque ninguém perguntou se o texto estava INTEIRO. Esta trava passa a
 * perguntar, no acervo todo, para que o defeito não volte a entrar sem
 * ninguém ver.
 *
 * As duas listas abaixo são o que já estava no ar quando a regra nasceu.
 * Elas SÓ ENCOLHEM — artigo novo já nasce dentro da regra, e reescrever em
 * lote seria justamente o que o AGENTS.md proíbe em título e description,
 * que mexem em CTR e só respondem semanas depois no Search Console.
 *
 * 17 títulos saíram em 21/09/2026: os que tinham impressão medida no Search
 * Console, onde o defeito custava clique de verdade.
 */
const TITULO_CORTADO_PENDENTE = new Set([
  "como-ganhar-massa-muscular",
  "cardio-antes-ou-depois-da-musculacao",
  "musculacao-durante-uso-de-mounjaro",
  "qual-medicamento-preserva-massa-muscular",
  "dor-lombar-na-musculacao",
  "alcool-atrapalha-o-treino",
  "musculacao-para-hipertensao",
  "musculacao-e-saude-mental",
  "como-saber-se-estou-perdendo-gordura-ou-musculo",
  "quanto-tempo-para-emagrecer",
  "como-treinar-usando-qualquer-glp1",
  "semaglutida-e-musculacao",
  "recomposicao-corporal",
  "musculacao-emagrece",
  "condromalacia-patelar-musculacao",
  "push-pull-legs",
  "cortisol-e-treino",
  "sop-musculacao",
  "exames-de-sangue-para-quem-treina",
  "janela-anabolica",
  "proteina-vegetal-vs-animal",
  "peptideos-para-emagrecer",
  "suplementacao-basica-para-iniciantes",
  "como-nao-desistir-da-dieta",
  "como-treinar-viajando",
  "consultoria-online-musculacao",
  "treino-de-triceps",
  "como-fazer-leg-press",
  "cardapio-para-hipertrofia",
  "musculacao-para-adolescentes",
  "antes-e-depois-musculacao",
  "mobilidade-articular-pre-treino",
  "saude-hormonal-feminina-treino",
  "hormonios-femininos-apos-40-treino",
  "fisioterapia-preventiva-musculacao",
  "otimizar-sono-para-recuperacao-muscular",
  "treino-ao-ar-livre-estruturado",
  "musculacao-para-ansiedade-depressao",
  "nutrient-timing-pos-treino-2025",
  "periodizacao-nutricional",
  "musculacao-acima-dos-65-anos",
  "treino-funcional-para-idosos",
  "preparacao-atletica-especifica",
  "treino-de-velocidade-e-agilidade",
  "corrida-e-musculacao",
]);

/* Estas estão entre 147 e 154 caracteres — cortadas perto do limite real,
   então cada uma precisa da frase inteira reescrita, uma decisão por item. */
const DESCRIPTION_CORTADA_PENDENTE = new Set([
  "por-que-voce-nao-consegue-emagrecer",
  "habitos-que-sabotam-seu-emagrecimento",
  "como-ganhar-massa-muscular",
  "treinar-todos-os-dias-faz-mal",
  "descansar-tambem-faz-crescer",
  "quanto-tempo-para-aparecer-resultado-na-academia",
  "como-sair-do-plato-da-musculacao",
  "quanta-proteina-por-dia-para-ganhar-massa-muscular",
  "como-montar-treino-de-hipertrofia",
  "personal-trainer-online-como-funciona",
  "quantas-series-para-hipertrofia",
  "quantas-repeticoes-para-hipertrofia",
  "volume-de-treino-ideal",
  "progressao-de-carga",
  "deficit-calorico-e-hipertrofia",
  "hipertrofia-feminina",
  "deficit-calorico-como-calcular",
  "metabolismo-lento-existe",
  "exercicio-para-perder-barriga",
  "melhor-treino-para-quem-usa-mounjaro",
  "musculacao-durante-uso-de-mounjaro",
  "como-preservar-massa-muscular-durante-emagrecimento",
  "como-voltar-a-treinar-apos-comecar-mounjaro",
  "como-evitar-perder-massa-muscular-retatrutida",
  "melhor-treino-para-quem-usa-retatrutida",
  "musculacao-durante-uso-de-retatrutida",
  "proteina-para-quem-usa-retatrutida",
  "creatina-para-quem-usa-retatrutida",
  "como-evitar-efeito-sanfona",
  "posso-treinar-todos-os-dias-retatrutida",
  "como-montar-treino-retatrutida",
  "retatrutida-ou-mounjaro",
  "retatrutida-ou-ozempic",
  "retatrutida-ou-wegovy",
  "retatrutida-ou-zepbound",
  "qual-medicamento-preserva-massa-muscular",
  "agua-interfere-na-hipertrofia",
  "carboidrato-antes-do-treino",
  "carboidrato-a-noite-engorda",
  "personal-trainer-alphaville-residencial-zero",
  "personal-trainer-alphaville-residencial-1",
  "personal-trainer-a-domicilio-alphaville",
  "treinador-particular-alphaville",
  "cardio-atrapalha-a-hipertrofia",
  "como-perder-gordura-sem-perder-massa-muscular",
  "treinar-o-mesmo-musculo-duas-vezes-por-semana",
  "o-que-comer-antes-de-dormir-para-ganhar-massa",
  "sono-e-crescimento-muscular",
  "musculacao-e-saude-mental",
  "ganhar-musculo-depois-dos-50",
  "como-voltar-a-treinar-apos-cirurgia",
  "tendinite-no-cotovelo-como-treinar",
  "dor-no-quadril-ao-agachar",
  "como-treinar-com-artrose",
  "como-saber-se-estou-perdendo-gordura-ou-musculo",
  "quanto-tempo-para-emagrecer",
  "ozempic-faz-perder-musculo",
  "mulheres-emagrecem-mais-devagar-que-homens",
  "fibromialgia-e-musculacao",
  "musculacao-emagrece",
  "calorias-para-ganhar-massa-muscular",
  "musculacao-para-maiores-de-60",
  "como-nao-desistir-da-dieta",
  "treino-de-ombros-hipertrofia",
  "treino-de-peito-hipertrofia",
  "treino-de-perna-completo",
  "treino-de-panturrilha",
  "como-fazer-barra-fixa",
  "como-fazer-leg-press",
  "cardapio-para-hipertrofia",
  "mobilidade-articular-pre-treino",
  "fisioterapia-preventiva-musculacao",
  "otimizar-sono-para-recuperacao-muscular",
  "suplementacao-pre-treino-avancada",
  "periodizacao-nutricional",
  "psicologia-atleta-lesionado-recuperacao-mental",
  "exercicio-gravidez-gestante-treino-seguro",
  "treino-hibrido-forca-corrida-2025",
  "vitaminas-minerais-atleta-deficiencia-desempenho",
  "treino-pos-menopausa-metabolismo-composicao-corporal",
  "colageno-hidrolisado-tipos-articulacoes-tendoes",
  "beta-alanina-carnosina-fadiga-forca-suplemento",
  "treino-ultramaratona-resistencia-preparacao",
  "exercicio-longevidade-envelhecimento-saudavel-vida",
  "treinamento-multimodal-forca-mobilidade-mindfulness-2025",
  "omega-3-atleta-avancado-inflamacao-recuperacao-2025",
  "sobretreinamento-cronico-diagnostico-hormonal-tratamento",
]);

{
  const cortado = (s: string) => /(\.\.\.|…)\s*$/.test(s.trim());

  const titulos = blogPosts.filter((p) => cortado(p.metaTitle || p.title));
  const inesperados = titulos.filter((p) => !TITULO_CORTADO_PENDENTE.has(p.slug));
  ok(`nenhum título cortado fora da lista de pendentes (${titulos.length} pendentes)`,
    inesperados.length === 0,
    inesperados.map((p) => `${p.slug}: ${p.metaTitle || p.title}`).join(" | "));

  const descs = blogPosts.filter((p) => cortado(p.metaDescription || p.excerpt || ""));
  const inesperadasD = descs.filter((p) => !DESCRIPTION_CORTADA_PENDENTE.has(p.slug));
  ok(`nenhuma description cortada fora da lista de pendentes (${descs.length} pendentes)`,
    inesperadasD.length === 0,
    inesperadasD.map((p) => p.slug).join(" | "));

  /* A lista só encolhe: slug que já foi corrigido não pode continuar nela. */
  const slugsT = new Set(titulos.map((p) => p.slug));
  const resolvidosT = [...TITULO_CORTADO_PENDENTE].filter((s) => !slugsT.has(s));
  ok("a lista de títulos pendentes não guarda slug já corrigido",
    resolvidosT.length === 0, resolvidosT.join(", "));

  const slugsD = new Set(descs.map((p) => p.slug));
  const resolvidosD = [...DESCRIPTION_CORTADA_PENDENTE].filter((s) => !slugsD.has(s));
  ok("a lista de descriptions pendentes não guarda slug já corrigido",
    resolvidosD.length === 0, resolvidosD.join(", "));

}

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. A DESCRIPTION EXISTE, TEM TAMANHO ÚTIL E NÃO ESTÁ CORTADA");

for (const slug of REVISADOS) {
  const p = porSlug.get(slug)!;
  const d = p.metaDescription || "";
  ok(`${slug}: description entre 120 e 160 (${d.length})`, d.length >= 120 && d.length <= 160);
  /* A meta da Retatrutida terminava literalmente em "e como..." — cortada na origem. */
  ok(`${slug}: não termina em reticências`, !/\.\.\.$|…$/.test(d.trim()), d.slice(-30));
}

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. A DESCRIPTION COMPLEMENTA O TÍTULO, NÃO O REPETE");

/**
 * Abrir a description repetindo o título queima a primeira linha do
 * resultado — a única que boa parte das pessoas lê no celular. A trava
 * compara as quatro primeiras palavras significativas das duas.
 */
const palavras = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2);

for (const slug of REVISADOS) {
  const p = porSlug.get(slug)!;
  const t = palavras(p.metaTitle || p.title).slice(0, 4);
  const d = palavras(p.metaDescription || "").slice(0, 4);
  const iguais = t.filter((w) => d.includes(w)).length;
  ok(`${slug}: abertura da description difere do título`, iguais < 3, `${t.join(" ")} / ${d.join(" ")}`);
}

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. SEM ENCHIMENTO DE SERP");

/**
 * Lista curta e literal, com as construções que efetivamente estavam nos 12:
 * "Descubra a verdade" (pamonha), "Confira!" (Smart Fit), "Guia Completo"
 * (upper/lower). São frases que aparecem em metade da SERP brasileira e não
 * dizem nada sobre esta página em particular.
 */
const ENCHIMENTO: [string, RegExp][] = [
  ["descubra a verdade", /descubra a verdade/i],
  ["confira! solto no fim", /\bconfira!/i],
  ["guia completo/definitivo", /guia (completo|definitivo)/i],
  ["adjetivo vazio", /\b(incr[ií]vel|imperd[ií]vel|revolucion[áa]rio|segredo)\b/i],
  ["promessa de resultado", /resultado garantido|garant\w+ (o|seu) resultado/i],
];
for (const slug of REVISADOS) {
  const p = porSlug.get(slug)!;
  const texto = `${p.metaTitle || p.title} ${p.metaDescription || ""}`;
  for (const [nome, re] of ENCHIMENTO) {
    const achado = texto.match(re);
    ok(`${slug}: sem ${nome}`, achado === null, achado ? `"${achado[0]}"` : "");
  }
}

/*
 * A cauda vaga vale só para o TÍTULO, não para a description. Na
 * description a frase tem espaço para se explicar; no título ela é a única
 * coisa que a pessoa lê antes de decidir.
 */
/*
 * A cauda vaga. Estas seis construções estavam nos títulos de maior
 * impressão e nenhuma dizia o que a pessoa ia encontrar do outro lado:
 * "Onde Ele Falha", "A Comparação que Surpreende Quem Evita", "com um
 * Porém", "O Que Pesa Mais que Ele", "O Risco Não é o Peso".
 *
 * Elas não eram enchimento genérico — eram boas frases. O problema é a
 * SERP: quem escaneia dez resultados não para para decifrar uma promessa.
 * Nos mesmos 19 dias e na mesma posição, título descritivo rendeu de 1,0%
 * a 1,4% e estes renderam de 0,0% a 0,3%.
 */
const CAUDA_VAGA: [string, RegExp][] = [
  ["cauda vaga: onde ele falha", /onde (ele|ela) falha/i],
  ["cauda vaga: surpreende quem", /surpreende quem/i],
  ["cauda vaga: com um porém", /com um por[ée]m/i],
  ["cauda vaga: o que pesa mais", /o que pesa mais/i],
  ["cauda vaga: o risco não é", /o risco n[ãa]o [ée]/i],
  ["cauda vaga: e quem pode mais", /e quem pode mais/i],
];
for (const slug of REVISADOS) {
  const t = porSlug.get(slug)!.metaTitle || porSlug.get(slug)!.title;
  for (const [nome, re] of CAUDA_VAGA) {
    const achado = t.match(re);
    ok(`${slug}: sem ${nome}`, achado === null, achado ? `"${achado[0]}" em "${t}"` : "");
  }
}

// ─── 7 ──────────────────────────────────────────────────────────────────────
bloco("7. PÁGINA NACIONAL NÃO SE ANUNCIA COMO LOCAL");

/**
 * A meta de "quantos quilos perder até o fim do ano" gastava metade do
 * espaço com "Personal trainer em Alphaville" — numa consulta informacional
 * que vem do Brasil inteiro. Quem pesquisa isso em Recife lê "Alphaville" e
 * conclui que o resultado não é para ele.
 *
 * A trava vale só para os artigos SEM intenção local. Smart Fit vs Bluefit
 * compara duas unidades da região, então ali o sinal local é legítimo.
 */
const COM_INTENCAO_LOCAL = new Set(["smart-fit-vs-bluefit", "bluefit-alphaville"]);
for (const slug of REVISADOS) {
  if (COM_INTENCAO_LOCAL.has(slug)) continue;
  const p = porSlug.get(slug)!;
  const texto = `${p.metaTitle || p.title} ${p.metaDescription || ""}`;
  ok(`${slug}: sem sinal geográfico indevido`,
    !/alphaville|barueri|tamboré|tambore|santana de parna/i.test(texto));
}

// ─── 8 ──────────────────────────────────────────────────────────────────────
bloco("8. O TÍTULO NÃO PROMETE O QUE A PÁGINA NÃO TEM");

/**
 * Título com número é o que mais rende nessas consultas — e é exatamente por
 * isso que ele precisa de trava. Número inventado no título é a forma mais
 * fácil de transformar CTR em pogo-sticking.
 *
 * A verificação é literal: todo número do título tem que aparecer no corpo
 * do artigo. Percentuais e unidades entram sem o sufixo para tolerar as
 * variações de escrita entre título e texto.
 */
for (const slug of REVISADOS) {
  const p = porSlug.get(slug)!;
  const t = p.metaTitle || p.title;
  const numeros = t.match(/\d+(?:[.,]\d+)?/g) ?? [];
  const corpo = `${p.content} ${(p.faq ?? []).map((f) => f.question + f.answer).join(" ")}`;
  const ausentes = numeros.filter((n) => !corpo.includes(n));
  ok(`${slug}: números do título aparecem no artigo`, ausentes.length === 0, ausentes.join(", "));
}

// ─── 9 ──────────────────────────────────────────────────────────────────────
bloco("9. OS 12 NÃO DISPUTAM A MESMA CONSULTA ENTRE SI");

/**
 * Canibalização não é "assunto parecido", é título parecido a ponto de duas
 * URLs parecerem responder a mesma busca. A régua compara as palavras
 * significativas de cada par.
 */
for (let i = 0; i < REVISADOS.length; i++) {
  for (let j = i + 1; j < REVISADOS.length; j++) {
    const a = porSlug.get(REVISADOS[i])!;
    const b = porSlug.get(REVISADOS[j])!;
    const pa = new Set(palavras(a.metaTitle || a.title));
    const pb = palavras(b.metaTitle || b.title);
    const comuns = pb.filter((w) => pa.has(w));
    const sobreposicao = comuns.length / Math.min(pa.size, pb.length);
    ok(`${REVISADOS[i]} × ${REVISADOS[j]}`, sobreposicao < 0.6, `${Math.round(sobreposicao * 100)}% em comum`);
  }
}

// ─── 10 ─────────────────────────────────────────────────────────────────────
bloco("10. NENHUMA PÁGINA DO APP DUPLICA A MARCA NO TÍTULO");

/**
 * O mesmo defeito do blog acontecia nas 21 landing pages locais, que são as
 * páginas comerciais do site: a marca vinha escrita no `title` do metadata E
 * o template do layout anexava outra, produzindo
 *
 *   Personal Trainer Tamboré | Montinho Personal Trainer | Montinho Personal Trainer
 *
 * A correção ali foi diferente da do blog, e de propósito. Em página local a
 * marca AJUDA — quem busca "personal trainer Tamboré" está a um passo de
 * contratar e reconhece o nome. Então o título continua com a marca, uma vez
 * só, via `absolute`.
 *
 * A trava é sobre o `title` de primeiro nível do metadata (dois espaços de
 * indentação). O `openGraph.title` fica de fora porque o template não se
 * aplica a ele — lá a marca escrita à mão é a única que existe.
 */
{
  const pages: string[] = [];
  const anda = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.name === "page.tsx") pages.push(p);
    }
  };
  anda("app");

  const duplicam = pages.filter((f) =>
    /\n {2}title: "[^"]*\| Montinho Personal Trainer",/.test(readFileSync(f, "utf8")),
  );
  ok("nenhuma página soma marca escrita à mão com o template", duplicam.length === 0,
    duplicam.join(", "));

  /* E o inverso: quem usa `absolute` precisa mesmo trazer a marca, senão a página perde o sinal. */
  const locaisSemMarca = pages.filter((f) => {
    const m = readFileSync(f, "utf8").match(/\n {2}title: \{ absolute: "([^"]*)" \}/);
    return m !== null && !/Montinho/.test(m[1]);
  });
  ok("página que desliga o template ainda declara a marca", locaisSemMarca.length === 0,
    locaisSemMarca.join(", "));
}


// ─── 10 ─────────────────────────────────────────────────────────────────────
bloco("10. O EXPERIMENTO DE TÍTULO CONTINUA DE PÉ");

/**
 * Seis artigos em que a faixa numérica responde a pergunta inteira. Três
 * receberam ponta solta, três ficaram com a resposta fechada, para descobrir
 * qual formato rende mais clique NESTE site.
 *
 * Um experimento morre de duas formas silenciosas: alguém mexe no grupo de
 * controle, ou alguém mexe no grupo de teste e desfaz o que estava sendo
 * medido. Nos dois casos ninguém percebe até a leitura sair errada, semanas
 * depois. As travas abaixo pinam os dois lados.
 */
{
  const todos = [...ABERTO, ...FECHADO];
  ok(`o experimento tem seis artigos (${todos.length})`, todos.length === 6);
  ok("os dois grupos têm o mesmo tamanho", ABERTO.length === FECHADO.length);

  const slugsAberto = new Set(ABERTO.map((a) => a.slug));
  ok("os grupos não se sobrepõem", FECHADO.every((a) => !slugsAberto.has(a.slug)));

  /* O título de cada artigo tem que ser exatamente o que o experimento registrou. */
  for (const a of todos) {
    const p = porSlug.get(a.slug);
    if (!p) { ok(`${a.slug} existe`, false); continue; }
    const atual = p.metaTitle || p.title;
    ok(`${a.slug}: título é o do experimento`, atual === a.titulo,
      `esperado "${a.titulo}", achei "${atual}"`);
  }

  /* Todo artigo do experimento passa também pela régua geral desta suíte. */
  const foraDaRegua = todos.filter((a) => !REVISADOS.includes(a.slug));
  ok("todos estão na lista de revisados", foraDaRegua.length === 0,
    foraDaRegua.map((a) => a.slug).join(", "));

  /*
   * Enquanto o experimento estava de pé, esta trava exigia a ponta solta no
   * grupo ABERTO: sem ela os dois braços viravam a mesma coisa. O
   * experimento foi encerrado em 21/09/2026 e os três títulos do ABERTO
   * foram reescritos no estilo descritivo, então a exigência se inverte —
   * nenhum dos seis pode voltar a ter ponta solta sem passar por aqui.
   */
  const pontaSolta = (t: string) => /(—|,)\s+\S/.test(t.split("?").pop() ?? t);
  if (ENCERRADO_EM) {
    const comPonta = [...ABERTO, ...FECHADO].filter((a) => pontaSolta(a.titulo));
    ok("com o experimento encerrado, nenhum dos seis tem ponta solta",
      comPonta.length === 0, comPonta.map((a) => a.titulo).join(" | "));
    ok("a data de encerramento é posterior ao início", ENCERRADO_EM > INICIO);
  } else {
    const semPonta = ABERTO.filter((a) => !pontaSolta(a.titulo));
    ok("todo título do grupo aberto tem segunda metade", semPonta.length === 0,
      semPonta.map((a) => a.titulo).join(" | "));
  }

  /* E a base tem que estar registrada, senão não há com o que comparar. */
  const semBase = todos.filter((a) => a.base.impressoes <= 0);
  ok("toda página tem linha de base de impressões", semBase.length === 0);
  ok("as datas do experimento estão declaradas",
    /^\d{4}-\d{2}-\d{2}$/.test(INICIO) && LEITURA_A_PARTIR_DE > INICIO);
}

console.log("\n" + "=".repeat(64));
if (falhas > 0) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
