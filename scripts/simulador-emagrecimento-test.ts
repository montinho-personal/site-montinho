import { readFileSync, existsSync } from "fs";
/**
 * O Simulador de Emagrecimento: matemática, guardrails, privacidade e página.
 *   npx tsx scripts/simulador-emagrecimento-test.ts
 */
import * as S from "../lib/simulador/emagrecimento";
import { blogPosts } from "../lib/blog";
import { EVIDENCIAS, REFERENCIAS_EVIDENCIAS } from "../lib/simulador/evidencias";
import { MARCOS, REFERENCIAS_MARCOS, semanaDoMarco } from "../lib/simulador/marcos";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const finito = (pr: S.Projecao) => pr.pontos.every((p) => [p.peso, p.min, p.max].every(Number.isFinite));

const A: S.Perfil = { idade: 35, sexo: "m", alturaCm: 175, pesoKg: 90, metaKg: 80, rotina: "sentado", treinos: 3, tiposTreino: ["musculacao"], passos: "5a75", kcalDia: null };
const B: S.Perfil = { idade: 40, sexo: "f", alturaCm: 162, pesoKg: 75, metaKg: 65, rotina: "sentado", treinos: 2, tiposTreino: ["musculacao"], passos: "3a5", kcalDia: null };
const C: S.Perfil = { ...A, rotina: "fisico", passos: "gt10", treinos: 5 };
const F: S.Perfil = { ...A, kcalDia: 2000 };

bloco("1. PERSONAS: RESULTADOS FINITOS E COERENTES");
for (const [nome, p] of [["A", A], ["B", B], ["C (muito ativo)", C], ["F (informa kcal)", F]] as const) {
  const pr = S.projeta(p, S.cenarioAtual(p));
  ok(`${nome}: nenhum NaN/Infinity na curva`, finito(pr));
  ok(`${nome}: a curva desce`, pr.pontos[12].peso < p.pesoKg && pr.pontos[52].peso < pr.pontos[12].peso);
  ok(`${nome}: faixa contém a central`, pr.pontos.every((x) => x.min <= x.peso + 1e-9 && x.max >= x.peso - 1e-9));
  ok(`${nome}: ritmo plausível (0,1 a 1,2% do peso/semana nas 12 primeiras)`, pr.ritmo12 / p.pesoKg > 0.001 && pr.ritmo12 / p.pesoKg < 0.012, `${pr.ritmo12.toFixed(2)} kg/sem`);
}
const pa = S.projeta(A, S.cenarioAtual(A));
const perdas = pa.pontos.slice(1).map((p, i) => pa.pontos[i].peso - p.peso);
ok("não linear: a perda semanal desacelera", perdas[50] < perdas[1] * 0.9, `${perdas[1].toFixed(3)} → ${perdas[50].toFixed(3)}`);
ok("A: meta alcançada com faixa ordenada", pa.semanaMeta !== null && pa.faixaMeta!.min <= pa.semanaMeta! && pa.faixaMeta!.max >= pa.semanaMeta!);
ok("C gasta mais que A na partida", S.manutencaoInicial(C) > S.manutencaoInicial(A) + 400);

bloco("2. MUDANÇAS PEQUENAS, EFEITOS NA DIREÇÃO CERTA");
const c0 = S.cenarioAtual(A);
const peso12 = (c: S.Cenario, p = A) => S.projeta(p, c).pontos[12].peso;
ok("mais treino → perde mais", peso12({ ...c0, treinos: 4 }) < peso12(c0));
ok("mais passos → perde mais", peso12({ ...c0, passos: 10000 }) < peso12(c0));
ok("menos passos que hoje → perde menos", peso12({ ...c0, passos: 3000 }) > peso12(c0));
ok("mais consistência → perde mais", peso12({ ...c0, consistencia: 0.9 }) < peso12(c0));
ok("déficit firme → perde mais que leve", peso12({ ...c0, comida: "firme" }) < peso12({ ...c0, comida: "leve" }));
ok("um treino a mais muda pouco (< 1 kg em 12 semanas)", peso12(c0) - peso12({ ...c0, treinos: 4 }) < 1);
ok("consistência 0 → peso praticamente estável", Math.abs(peso12({ ...c0, consistencia: 0 }) - A.pesoKg) < 0.3);
const Fh = S.projeta({ ...F, kcalDia: Math.round(S.manutencaoInicial(F)) }, { ...S.cenarioAtual(F), comida: "hoje" });
ok("F: comer a manutenção 'como hoje' → estável", Math.abs(Fh.pontos[12].peso - F.pesoKg) < 0.3);
ok("níveis viram cortes sobre as kcal informadas", Math.round(S.ingestaoPlano({ ...F, kcalDia: 2600 }, "moderado").kcal) === 2600 - S.CORTE_NIVEL_KCAL.moderado);
ok("piso: nunca abaixo do repouso nem de 1.500 (homem)", S.ingestaoPlano({ ...F, kcalDia: 900 }, "firme").noPiso && S.ingestaoPlano({ ...F, kcalDia: 900 }, "firme").kcal >= 1500);
ok("piso feminino é 1.200 ou o repouso", S.ingestaoPlano({ ...B, kcalDia: 800 }, "hoje").kcal >= Math.max(1200, S.repouso(B, B.pesoKg)) - 1e-6);

bloco("3. MEDICAÇÃO E HORMÔNIO NÃO MUDAM A CURVA");
ok("o Perfil não tem campo de medicação nem hormônio", !/medicacao|hormonio/i.test(readFileSync("lib/simulador/emagrecimento.ts", "utf8").match(/export interface Perfil \{[\s\S]*?\}/)![0]));
ok("estudos: 4 ensaios com população, duração, dose, média e referência", S.ESTUDOS.length === 4 && S.ESTUDOS.every((e) => e.populacao && e.duracao && e.dose && e.resultado && e.comparacao && /^https:\/\//.test(e.url)));
ok("SURMOUNT-1 e STEP 1 com os números publicados", /20,9%/.test(S.ESTUDOS[0].resultado) && /14,9%/.test(S.ESTUDOS[1].resultado));
const ret = S.ESTUDOS.find((e) => e.id === "retatrutida")!;
ok("retatrutida: fase 2, 24,2%, e avisa que está em estudo", /24,2%/.test(ret.resultado) && /48 semanas/.test(ret.duracao) && /em estudo/.test(ret.marcas));
ok("mais de um tipo de treino: média de MET e minutos", Math.abs(S.perfilTreino(["musculacao", "corrida"]).met - (3.5 + S.TREINO.corrida.met) / 2) < 1e-9 && S.perfilTreino([]).rotulo === "musculação" && /\+/.test(S.perfilTreino(["musculacao", "caminhada"]).rotulo));
ok("combinar corrida com musculação gasta mais que só musculação", S.kcalTreinoDia(["musculacao", "corrida"], 3, 90) > S.kcalTreinoDia(["musculacao"], 3, 90));

bloco("4. INSIGHT SÓ QUANDO A CONTA SUSTENTA");
const imp = S.impactos(A, c0);
ok("três alavancas testadas e ordenadas", imp.length === 3 && imp.every((x, i) => i === 0 || x.ganho <= imp[i - 1].ganho));
ok("empate próximo não gera insight", S.insight([{ alavanca: "passos", descricao: "", ganho: 10, unidade: "semanas" }, { alavanca: "treino", descricao: "", ganho: 9, unidade: "semanas" }]) === null);
ok("vencedor claro gera insight", S.insight([{ alavanca: "passos", descricao: "", ganho: 10, unidade: "semanas" }, { alavanca: "treino", descricao: "", ganho: 3, unidade: "semanas" }])?.vencedor.alavanca === "passos");
ok("ganho irrelevante não gera insight", S.insight([{ alavanca: "passos", descricao: "", ganho: 0.4, unidade: "semanas" }]) === null);
const max = S.impactos(A, { treinos: 6, passos: 12500, consistencia: 1, comida: "moderado" });
ok("cenário no teto: nada a testar", max.length === 0);

ok("tipos novos com MET das calculadoras do site", S.TREINO.natacao.met === 5.8 && S.TREINO.pilates.met === 3.0 && S.TREINO.yoga.met === 2.5 && S.TREINO.bike.met === 8.5 && S.TREINO.crossfit.met > 3.5 && S.TREINO.crossfit.met < 8);
const compTipos = readFileSync("components/simulador/SimuladorEmagrecimento.tsx", "utf8");
ok("todo tipo oferecido existe no motor", [...compTipos.matchAll(/valor: "(\w+)", rotulo: "[^"]+" \}/g)].map((m) => m[1]).filter((v) => ["musculacao","caminhada","corrida","bike","natacao","crossfit","funcional","lutas","danca","pilates","yoga","esportes"].includes(v)).length === 12);

bloco("4b. EVIDÊNCIAS: TRÊS CAMADAS, TODA AFIRMAÇÃO DE ESTUDO COM FONTE");
ok("uma evidência por alavanca do insight", ["treino", "passos", "consistencia"].every((a) => EVIDENCIAS.some((e) => e.id === a)));
ok("toda evidência tem estudo com URL, prática, relato e ação", EVIDENCIAS.every((e) => e.estudos.length > 0 && e.estudos.every((x) => /^https:\/\//.test(x.ref.url) && x.ref.rotulo.length > 20) && e.pratica.length > 120 && e.relatos.length > 80 && e.acao.length > 40));
ok("nenhuma camada de prática/relato finge ser estudo", EVIDENCIAS.every((e) => !/\d{4};\d+/.test(e.pratica) && !/\d{4};\d+/.test(e.relatos)));
ok("referências das evidências sem duplicata", new Set(REFERENCIAS_EVIDENCIAS.map((r) => r.url)).size === REFERENCIAS_EVIDENCIAS.length && REFERENCIAS_EVIDENCIAS.length >= 5);
ok("o componente mostra o porquê da alavanca vencedora e a jornada final", /<PorQue id=\{\(ins \? ins\.vencedor : imp\[0\]\)\.alavanca\}/.test(readFileSync("components/simulador/SimuladorEmagrecimento.tsx", "utf8")) && /data-testid="jornada"/.test(readFileSync("components/simulador/SimuladorEmagrecimento.tsx", "utf8")));
ok("a página publica as evidências em HTML (SEO) e as referências", /EVIDENCIAS\.map/.test(readFileSync("app/ferramentas/simulador-emagrecimento/page.tsx", "utf8")) && /REFERENCIAS_EVIDENCIAS/.test(readFileSync("app/ferramentas/simulador-emagrecimento/page.tsx", "utf8")));

bloco("4c. O QUE ESPERAR PELO CAMINHO");
ok("marcos em percentual crescente, com estudo referenciado e o que costuma acontecer", MARCOS.every((m, i) => (i === 0 || m.fracao > MARCOS[i - 1].fracao) && m.estudos.length > 0 && m.estudos.every((e) => /^https:\/\//.test(e.ref.url)) && m.costuma.length >= 3));
ok("5% e 10% existem (as faixas dos estudos)", MARCOS.some((m) => m.fracao === 0.05) && MARCOS.some((m) => m.fracao === 0.1));
const prA = S.projeta(A, S.cenarioAtual(A));
const s5 = semanaDoMarco(prA.pontos, A.pesoKg, 0.05), s10 = semanaDoMarco(prA.pontos, A.pesoKg, 0.1);
ok("a semana do marco é interpolada e cresce com a fração", s5 !== null && s10 !== null && s10 > s5 && s5 > 0);
ok("marco fora do alcance devolve null", semanaDoMarco(prA.pontos.slice(0, 5), A.pesoKg, 0.15) === null);
ok("o resultado e a página mostram os marcos", /<OQueEsperar /.test(readFileSync("components/simulador/SimuladorEmagrecimento.tsx", "utf8")) && /MARCOS\.map/.test(readFileSync("app/ferramentas/simulador-emagrecimento/page.tsx", "utf8")));
ok("referências dos marcos sem duplicata", new Set(REFERENCIAS_MARCOS.map((r) => r.url)).size === REFERENCIAS_MARCOS.length);

bloco("5. ENTRADAS E GUARDRAILS");
ok("vírgula brasileira", S.parseNumero("82,5") === 82.5);
ok("ponto decimal e unidade", S.parseNumero(" 82.5 kg ") === 82.5);
ok("vazio e lixo viram null, nunca NaN", S.parseNumero("") === null && S.parseNumero("abc") === null && S.parseNumero(",") === null);
ok("altura em metros vira cm", S.parseAltura("1,75") === 175 && S.parseAltura("175") === 175);
ok("peso 0 é erro", S.validaBasicos(30, 170, 0).some((e) => e.campo === "peso"));
ok("idade impossível é erro", S.validaBasicos(150, 170, 80).some((e) => e.campo === "idade"));
ok("altura incorreta é erro", S.validaBasicos(30, 17, 80).some((e) => e.campo === "altura"));
ok("campos vazios dão três erros", S.validaBasicos(null, null, null).length === 3);
ok("menor de 18 bloqueia", S.bloqueio(16, false, 70, 170)?.tipo === "menor");
ok("gestação/amamentação bloqueia", S.bloqueio(30, true, 70, 165)?.tipo === "gestacao");
ok("IMC abaixo de 18,5 bloqueia", S.bloqueio(30, false, 50, 175)?.tipo === "imc-baixo");
ok("meta maior que o peso é erro de campo", (S.validaMeta(95, 90, 175) as S.ErroCampo)?.campo === "meta");
const mb = S.validaMeta(50, 90, 175);
ok("meta abaixo de IMC 18,5 bloqueia com o mínimo", !!mb && "tipo" in mb && mb.tipo === "meta-baixa" && mb.minimoKg === 57);
ok("meta válida passa", S.validaMeta(80, 90, 175) === null);
ok("extremos (300 kg, 90 anos) seguem finitos", finito(S.projeta({ ...A, pesoKg: 300, idade: 90, metaKg: 200 }, S.cenarioAtual({ ...A, pesoKg: 300, idade: 90, metaKg: 200 }))));
ok("formatação sem precisão falsa (0,5 kg)", S.fmtKgProj(83.27) === "83,5 kg" && S.fmtKgProj(83.2) === "83,0 kg");
ok("faixa aberta não mostra Infinity", !/Infinity/.test(S.fmtFaixaSemanas({ min: 30, max: Infinity })));

bloco("6. PRIVACIDADE");
const comp = readFileSync("components/simulador/SimuladorEmagrecimento.tsx", "utf8");
const chamadas = [...comp.matchAll(/trackEvent\(([^)]*)\)/g)].map((m) => m[1]);
ok("todo evento é do simulador", chamadas.every((c) => /"(simulator_\w+|scenario_changed)"/.test(c)), chamadas.join(" | "));
ok("nenhum evento leva dado corporal, medicação ou hormônio", chamadas.every((c) => !/peso|altura|idade|sexo|medic|horm|caneta|meta|kcal|r\./i.test(c.replace(/"[^"]*"/g, ""))), chamadas.join(" | "));
ok("CTA de caneta não tem evento próprio", (comp.match(/simulator_whatsapp_click/g) ?? []).length === 1);
ok("sem chamada de rede", !/fetch\(|sendBeacon|XMLHttpRequest/.test(comp));
ok("armazenamento só de sessão, com botão de apagar", /sessionStorage/.test(comp) && !/localStorage/.test(comp) && /Apagar meus dados/.test(comp));
ok("WhatsApp padrão sem número nenhum; dados só por opção", /Fiz o Simulador de Emagrecimento no site/.test(comp) && /enviarDados \? msgComDados : msgPadrao/.test(comp));
ok("mensagem com dados não inclui medicação nem hormônio", !/medica|horm/i.test(comp.match(/const msgComDados = [^;]+;/)![0]));
ok("compartilhamento sem números por padrão", /compartNumeros && temMeta/.test(comp) && /useState\(false\)/.test(comp));
const analytics = readFileSync("lib/analytics.ts", "utf8");
ok("eventos registrados em lib/analytics", ["simulator_view", "simulator_start", "simulator_step_complete", "simulator_complete", "scenario_changed", "simulator_whatsapp_click"].every((e) => analytics.includes(`"${e}"`)));

bloco("7. ACESSIBILIDADE E ROBUSTEZ DO COMPONENTE");
ok("resultado com aria-live", /aria-live="polite"/.test(comp));
const chart = readFileSync("components/simulador/ProjectionChart.tsx", "utf8");
ok("gráfico com alternativa textual (tabela)", /role="img"/.test(chart) && /<div className="sr-only"><table>/.test(chart));
ok("marcos acessíveis por botão (sem depender de hover)", /aria-pressed/.test(chart) && !/onMouseEnter|onMouseOver/.test(chart));
ok("erros com role=alert", /role="alert"/.test(readFileSync("components/simulador/ui.tsx", "utf8")));

bloco("7b. LEITURA NO CELULAR");
const pg = readFileSync("app/ferramentas/simulador-emagrecimento/page.tsx", "utf8");
ok("seções editoriais recolhíveis, com o H2 no summary", (pg.match(/<Secao titulo=/g) ?? []).length >= 10 && /<summary[^>]*>\s*<h2/.test(pg));
ok("evidências recolhíveis na página e no resultado", /<details key=\{e\.id\}/.test(pg) && /<Dobra titulo="O que os estudos mediram">/.test(compTipos));
ok("resultado dos ajustes logo abaixo dos controles", compTipos.indexOf("<Jornada ") > compTipos.indexOf('data-testid="cenarios"') && compTipos.indexOf("<Jornada ") < compTipos.indexOf("CAMADA 4 — insight"));
ok("eixo do gráfico não sobrepõe rótulos", /rotulosVisiveis/.test(chart));
const pos = readFileSync("components/ferramentas/PosResultado.tsx", "utf8");
ok("fechamento no pós-resultado, só com WhatsApp", /fechamento && \(whats \|\| bloco\.secundaria\?\.destino === "whatsapp"\)/.test(pos));
ok("fechamento nas 5 ferramentas de emagrecimento", ["calorias/CalculadoraDeficit","meta/CalculadoraMeta","glp1/CalculadoraGLP1","composicao/CalculadoraComposicao","tdee/CalculadoraTDEE"].every((c) => /<PosResultado[^>]*?\bfechamento\b/.test(readFileSync(`components/${c}.tsx`, "utf8"))));

bloco("8. PÁGINA E REGISTROS");
const page = readFileSync("app/ferramentas/simulador-emagrecimento/page.tsx", "utf8");
ok("um H1", (page.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = page.match(/^\s*title:\s*"([^"]+)"/m)![1];
const desc = page.match(/^\s*description:\s*\n?\s*"([^"]+)"/m)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58, titulo);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155, desc);
ok("canonical", /canonical: `\$\{SITE_URL\}\$\{CAMINHO\}`/.test(page));
ok("não afirma revisão médica", /Não houve revisão médica/.test(page) && !/Revisado por médico/i.test(page));
ok("sem avaliação/estrela falsa", !/aggregateRating|ratingValue/.test(page));
ok("tabela de 5/10/15/20 kg calculada pelo motor", /TABELA\.map/.test(page) && /projeta\(/.test(page));
ok("seção de metodologia com âncora", /id="metodologia"/.test(page));
ok("noscript explica", /<noscript>/.test(page));
const links = [...page.matchAll(/href="(\/[^"#]+)"/g), ...comp.matchAll(/href="(\/[^"#]+)"/g)].map((m) => m[1]);
const quebrados = [...new Set(links)].filter((h) => h.startsWith("/blog/") ? !blogPosts.some((p) => `/blog/${p.slug}` === h) : !(h === "/" || existsSync(`app${h}/page.tsx`)));
ok("todo link interno existe", quebrados.length === 0, quebrados.join(", "));
ok("catálogo e sitemap", /simulador-emagrecimento/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /simulador-emagrecimento/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("artigos do link existem e o blog renderiza o convite", S.ARTIGOS_COM_LINK_SIMULADOR.every((s) => blogPosts.some((p) => p.slug === s)) && /ARTIGOS_COM_LINK_SIMULADOR\.includes/.test(readFileSync("app/blog/[slug]/page.tsx", "utf8")));
ok("nenhuma URL por meta de quilos (sem doorway)", !existsSync("app/ferramentas/simulador-emagrecimento/[kg]") && !existsSync("app/perder-10kg"));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
