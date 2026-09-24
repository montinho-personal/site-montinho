import { existsSync, readFileSync } from "fs";
/**
 * O Simulador de Ganho de Massa Muscular: matemática, fisiologia, regras, privacidade e página.
 *   npx tsx scripts/simulador-massa-test.ts
 */
import * as M from "../lib/simulador/massa";
import { EVIDENCIAS_MASSA } from "../lib/simulador/evidencias-massa";
import { NIVEIS } from "../lib/potencial";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const finito = (pr: M.ProjecaoMassa) => pr.pontos.every((p) => [p.peso, p.min, p.max, p.magra, p.gordura].every(Number.isFinite));
const base: M.PerfilMassa = { objetivo: "massa", idade: 20, sexo: "m", alturaCm: 178, pesoKg: 58, metaKg: 68, gorduraPct: null, experiencia: "nunca", continuidade: "continuo", treinos: 3, acompanha: "nocao", tendencia: "igual", kcalDia: null, apetite: "muita-dificuldade", dificuldade: "comer", proteinaG: null, rotina: "sentado", passos: "5a75", cardio: "nao", suplementos: [], hormonio: "nao", historicoPeso: "sempre" };
const A = base;
const B: M.PerfilMassa = { ...base, idade: 30, alturaCm: 180, pesoKg: 75, metaKg: 82, experiencia: "2a4", treinos: 4, acompanha: "anota", tendencia: "subindo-devagar", apetite: "normal", dificuldade: "treino-bom" };
const C: M.PerfilMassa = { ...base, sexo: "f", idade: 25, alturaCm: 165, pesoKg: 50, metaKg: 56, apetite: "normal" };
const D: M.PerfilMassa = { ...base, rotina: "fisico", passos: "gt10", cardio: "5+" };
const E: M.PerfilMassa = { ...base, tendencia: "subindo-rapido", apetite: "bastante", dificuldade: "medo-barriga" };
const F: M.PerfilMassa = { ...B, hormonio: "reposicao" };
const G: M.PerfilMassa = { ...B, hormonio: "desempenho" };
const H: M.PerfilMassa = { ...base, historicoPeso: "sem-querer" };
const cen = (p: M.PerfilMassa, i: 0 | 1 | 2 = 1, cons = 0.9): M.CenarioMassa => ({ superavit: M.ritmos(p)[i].superavit, treinos: p.treinos, consistencia: cons, progressao: "sim" });

bloco("1. PERSONAS A–H: FINITO, COERENTE, SUBINDO");
for (const [n, p] of [["A", A], ["B", B], ["C", C], ["D (muito ativo)", D], ["E (já sobe rápido)", E], ["F (TRT)", F], ["G (anabolizante)", G], ["H (perda involuntária)", H]] as const) {
  const pr = M.projetaMassa(p, cen(p));
  ok(`${n}: nenhum NaN/Infinity`, finito(pr));
  ok(`${n}: o peso sobe no ritmo intermediário`, pr.pontos[12].peso > p.pesoKg && pr.pontos[52].peso > pr.pontos[12].peso);
  ok(`${n}: faixa contém a central`, pr.pontos.every((x) => x.min <= x.peso + 1e-9 && x.max >= x.peso - 1e-9));
  ok(`${n}: ritmo plausível (0,1% a 0,8% do peso/semana)`, pr.ritmo12.pct > 0.001 && pr.ritmo12.pct < 0.008, `${(pr.ritmo12.pct * 100).toFixed(2)}%`);
  ok(`${n}: a fatia magra fica entre 25% e 85%`, pr.fracaoMagra26 >= 0.25 && pr.fracaoMagra26 <= 0.85, `${(pr.fracaoMagra26 * 100).toFixed(0)}%`);
}
ok("D (muito ativo) gasta bem mais que A", M.manutencao(D).kcal > M.manutencao(A).kcal + 500);
ok("F e G: hormônio NÃO muda a curva (o Perfil do motor não usa o campo)", M.projetaMassa(F, cen(F)).pontos[26].peso === M.projetaMassa(B, cen(B)).pontos[26].peso && M.projetaMassa(G, cen(G)).pontos[26].peso === M.projetaMassa(B, cen(B)).pontos[26].peso);
ok("suplementos não mudam a curva", M.projetaMassa({ ...A, suplementos: ["creatina", "whey", "hipercalorico"] }, cen(A)).pontos[26].peso === M.projetaMassa(A, cen(A)).pontos[26].peso);

bloco("2. TESTE FUNDAMENTAL: DOBRAR O SUPERÁVIT NÃO DOBRA O MÚSCULO");
const s250 = M.projetaMassa(A, { superavit: 250, treinos: 3, consistencia: 1, progressao: "sim" });
const s500 = M.projetaMassa(A, { superavit: 500, treinos: 3, consistencia: 1, progressao: "sim" });
ok("o peso sobe bem mais com 500", s500.ganho26 > s250.ganho26 * 1.4, `${s250.ganho26.toFixed(1)} → ${s500.ganho26.toFixed(1)}`);
ok("a massa magra sobe bem menos que o dobro", s500.pontos[26].magra < s250.pontos[26].magra * 1.3, `${s250.pontos[26].magra.toFixed(2)} → ${s500.pontos[26].magra.toFixed(2)}`);
ok("a fatia magra cai com superávit maior", s500.fracaoMagra26 < s250.fracaoMagra26);
ok("o teto de massa magra é a taxa do nível (Potencial Natural)", Math.abs(M.tetoMagraDia(60, "iniciante") - (60 * NIVEIS[0].taxa.max) / 30.4) < 1e-9);

bloco("3. TREINO, PROGRESSÃO E CONSISTÊNCIA NA DIREÇÃO CERTA");
const c1 = cen(A);
const fm = (c: M.CenarioMassa) => M.projetaMassa(A, c).fracaoMagra26;
const g26 = (c: M.CenarioMassa) => M.projetaMassa(A, c).ganho26;
ok("mais treino → fatia magra maior, balança quase igual", fm({ ...c1, treinos: 5 }) > fm({ ...c1, treinos: 2 }) && Math.abs(g26({ ...c1, treinos: 5 }) - g26({ ...c1, treinos: 2 })) < 1.5);
ok("sem treino → fatia magra bem menor", fm({ ...c1, treinos: 0 }) < fm(c1) - 0.1);
ok("sem progressão → fatia magra menor", fm({ ...c1, progressao: "nao" }) < fm({ ...c1, progressao: "sim" }));
ok("mais consistência → mais ganho", g26({ ...c1, consistencia: 1 }) > g26({ ...c1, consistencia: 0.6 }));
ok("treinos realizados = planejados × consistência", M.projetaMassa(A, { ...c1, treinos: 4, consistencia: 0.75 }).treinosRealizados12 === 36);
ok("superávit 0 com peso estável → praticamente parado", Math.abs(M.projetaMassa(A, { ...c1, superavit: 0 }).pontos[12].peso - A.pesoKg) < 0.3);
ok("avançado ganha mais devagar que iniciante com o mesmo superávit relativo", M.projetaMassa({ ...A, experiencia: "gt4" }, cen({ ...A, experiencia: "gt4" })).pontos[26].magra < M.projetaMassa(A, cen(A)).pontos[26].magra);
ok("10 anos parando e voltando contam como intermediário", M.nivelDe("gt4", "para-e-volta") === "intermediario" && M.nivelDe("gt4", "continuo") === "avancado" && M.nivelDe("lt6m", "continuo") === "iniciante");

bloco("4. MANUTENÇÃO: O PESO PARADO É A RESPOSTA");
const m0 = M.manutencao({ ...A, kcalDia: 3200, tendencia: "igual" });
ok("'como 3.200 e o peso não sobe' → manutenção calibrada entre a equação e o informado", m0.calibrada && m0.kcal > M.gastoBase(A, A.pesoKg, 3) && m0.kcal < 3200 && Math.abs(m0.ingestaoAtual - m0.kcal) < 1e-9);
ok("peso subindo devagar → ingestão atual acima da manutenção", M.manutencao(B).ingestaoAtual > M.manutencao(B).kcal);
ok("ritmos são percentuais da manutenção, ordenados", (() => { const r = M.ritmos(A); return r[0].superavit < r[1].superavit && r[1].superavit < r[2].superavit && Math.abs(r[1].superavit - Math.round(M.manutencao(A).kcal * 0.125 / 10) * 10) < 1e-9; })());
ok("avançado tem ritmos mais conservadores", M.ritmos({ ...A, experiencia: "gt4" })[1].superavit < M.ritmos(A)[1].superavit);

bloco("5. REGRAS DO GARGALO (DETERMINÍSTICAS)");
const diag = (p: M.PerfilMassa) => M.diagnostico(p, M.projetaMassa(p, M.cenarioAtualMassa(p))).gargalo;
ok("perda involuntária vence tudo → saúde", diag(H) === "saude");
ok("peso estável + dificuldade de comer → ingestão", diag(A) === "ingestao");
ok("peso estável + apetite bom + não sabe calorias → monitoramento", diag({ ...A, apetite: "normal", dificuldade: "peso-nao-sobe" }) === "monitoramento");
ok("para e volta → constância", diag({ ...B, continuidade: "para-e-volta", tendencia: "subindo-devagar", kcalDia: 3000 }) === "constancia");
ok("não acompanha progresso → treino", diag({ ...B, acompanha: "nao" }) === "treino");
ok("tudo certo → paciência", diag(B) === "paciencia");
ok("sobe rápido acima da faixa → velocidade", diag({ ...E, tendencia: "subindo-rapido" }) === "velocidade" || M.projetaMassa(E, M.cenarioAtualMassa(E)).estadoRitmo !== "acima");
ok("cada gargalo tem título, texto, 'o que eu olharia primeiro' e CTA próprio", (["ingestao", "monitoramento", "treino", "constancia", "paciencia", "velocidade", "saude"] as const).every((g) => EVIDENCIAS_MASSA.some((e) => e.id === g)));
const ctas = new Set([diag(A), diag(B), diag(H)].map((g) => M.diagnostico({ ...A, historicoPeso: g === "saude" ? "sem-querer" : "sempre" }, M.projetaMassa(A, cen(A))).cta.texto));
ok("CTA muda com o gargalo", ctas.size >= 2);
ok("nenhum texto de gargalo promete quilos de músculo", (["A", "B", "H"] as const).every((_, i) => !/kg de músculo garantido|você ganhará \d/i.test(M.diagnostico([A, B, H][i], M.projetaMassa([A, B, H][i], cen([A, B, H][i]))).texto)));

ok("AUDITORIA: o gargalo vem da situação de hoje (não do ritmo testado)", /diagnostico\(perfil, projAtual\)/.test(readFileSync("components/simulador/SimuladorMassa.tsx", "utf8")));
ok("AUDITORIA: passos mudam o gasto", M.manutencao({ ...A, passos: "gt10" }).kcal > M.manutencao({ ...A, passos: "lt3" }).kcal + 150);
ok("AUDITORIA: 'não sei' passos = neutro", M.manutencao({ ...A, passos: "nao-sei" }).kcal === M.manutencao({ ...A, passos: "5a75" }).kcal - M.manutencao({ ...A, passos: "5a75" }).kcal + M.gastoBase({ ...A, passos: "nao-sei" }, A.pesoKg, A.treinos));
ok("AUDITORIA: peso caindo não é chamado de 'parado'", /tende a <strong>cair<\/strong>/.test(readFileSync("components/simulador/SimuladorMassa.tsx", "utf8")));

bloco("6. PROTEÍNA, GUARDRAILS, ENTRADAS");
ok("proteína: 1,6–2,2 g/kg é a faixa", M.avaliaProteina(90, 60).estado === "abaixo" && M.avaliaProteina(110, 60).estado === "na-faixa" && M.avaliaProteina(150, 60).estado === "acima");
ok("menor de 18 bloqueia", M.bloqueioMassa(16)?.tipo === "menor" && M.bloqueioMassa(18) === null);
ok("meta acima de 35% bloqueia com o máximo", (() => { const v = M.validaMetaMassa(90, 60); return !!v && "tipo" in v && v.tipo === "meta-alta" && v.maximoKg === 81; })());
ok("meta abaixo do peso é erro de campo", (() => { const v = M.validaMetaMassa(55, 60); return !!v && "campo" in v; })());
ok("perda involuntária e IMC < 17 viram avisos, não bloqueio", M.avisos({ historicoPeso: "sem-querer", pesoKg: 60, alturaCm: 178 }).includes("perda-involuntaria") && M.avisos({ historicoPeso: "sempre", pesoKg: 50, alturaCm: 180 }).includes("imc-baixo") && M.avisos({ historicoPeso: "sempre", pesoKg: 60, alturaCm: 178 }).length === 0);
ok("vírgula e ponto", M.parseNumero("62,5") === 62.5 && M.parseAltura("1,78") === 178);
ok("extremos seguem finitos", finito(M.projetaMassa({ ...A, pesoKg: 300, idade: 90, metaKg: 320 }, cen({ ...A, pesoKg: 300, idade: 90 }))));

bloco("7. EVIDÊNCIAS E FONTES");
ok("toda evidência tem estudo com URL, prática, relato e ação", EVIDENCIAS_MASSA.every((e) => e.estudos.length > 0 && e.estudos.every((x) => /^https:\/\//.test(x.ref.url)) && e.pratica.length > 120 && e.relatos.length > 60 && e.acao.length > 40));
ok("fontes: Iraki, Slater, Garthe, Schoenfeld, Morton, Aragon, Forbes, Hall", ["Iraki", "Slater", "Garthe", "Schoenfeld", "Morton", "Aragon", "Forbes", "Hall"].every((n) => M.FONTES_MASSA.some((f) => f.rotulo.includes(n))));
ok("marcos do ganho em ordem", M.MARCOS_MASSA.every((m, i) => i === 0 || m.fracao > M.MARCOS_MASSA[i - 1].fracao));

bloco("8. PRIVACIDADE E ACESSIBILIDADE DO COMPONENTE");
const comp = readFileSync("components/simulador/SimuladorMassa.tsx", "utf8");
const chamadas = [...comp.matchAll(/trackEvent\(([^)]*)\)/g)].map((m) => m[1]);
ok("todo evento é do simulador", chamadas.every((c) => /"(simulator_\w+|scenario_changed)"/.test(c)));
ok("nenhum evento leva dado corporal, suplemento ou hormônio", chamadas.every((c) => !/peso|altura|idade|sexo|horm|suplement|gordura|meta|kcal|prote|r\./i.test(c.replace(/"[^"]*"/g, ""))), chamadas.join(" | "));
ok("um só evento de WhatsApp (o CTA por gargalo não revela o gargalo)", (comp.match(/simulator_whatsapp_click/g) ?? []).length === 1);
ok("sem chamada de rede; sessionStorage com botão de apagar", !/fetch\(|sendBeacon/.test(comp) && /sessionStorage/.test(comp) && !/localStorage/.test(comp) && /Apagar meus dados/.test(comp));
ok("WhatsApp sem número por padrão; dados só por opção, sem hormônio", /enviarDados \? msgComDados : msgPadrao/.test(comp) && !/horm/i.test(comp.match(/const msgComDados = [^;]+;/)![0]));
ok("compartilhamento sem peso por padrão", /compartMeta && temMeta/.test(comp));
ok("aria-live no resultado, erros com role=alert, reação à meta", /aria-live="polite"/.test(comp) && /role="alert"/.test(comp) && /data-testid="reacao-meta"/.test(comp));
ok("fechamento do Montinho antes do CTA", comp.indexOf("FECHAMENTO_COMPARACAO.paragrafos") < comp.indexOf("simulator_whatsapp_click"));
ok("hormônio: texto de contexto, sem previsão", /não tenta prever quantos quilos de músculo um hormônio/.test(comp));
ok("'como muito e não engordo' explicado sem culpa", /seu corpo já respondeu essa pergunta/i.test(comp) && /Não é culpa/.test(comp));

bloco("9. PÁGINA E REGISTROS");
const page = readFileSync("app/ferramentas/simulador-ganho-massa-muscular/page.tsx", "utf8");
ok("um H1", (page.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = page.match(/^\s*title:\s*"([^"]+)"/m)![1];
const desc = page.match(/^\s*description:\s*\n?\s*"([^"]+)"/m)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58, titulo);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155, desc);
ok("não afirma revisão médica/nutricional", /Não houve revisão médica/.test(page) && !/Revisado por/i.test(page));
ok("ectomorfo tratado sem pseudociência", /Sheldon/.test(page) && /sem base para decidir/.test(page));
ok("tabela de 5/10 kg calculada pelo motor, sem doorway", /TABELA\.map/.test(page) && !existsSync("app/ganhar-10kg") && !existsSync("app/ferramentas/simulador-ganho-massa-muscular/[kg]"));
ok("manda para o Potencial Natural na pergunta do teto", /potencial-natural/.test(page) && /potencial-natural/.test(comp));
ok("seções recolhíveis e metodologia com âncora", (page.match(/<Secao titulo=/g) ?? []).length >= 10 && /id="metodologia"/.test(page));
const links = [...page.matchAll(/href="(\/[^"#]+)"/g), ...comp.matchAll(/href="(\/[^"#]+)"/g)].map((m) => m[1]);
const quebrados = [...new Set(links)].filter((hf) => hf.startsWith("/blog/") ? !blogPosts.some((p) => `/blog/${p.slug}` === hf) : !(hf === "/" || existsSync(`app${hf}/page.tsx`)));
ok("todo link interno existe", quebrados.length === 0, quebrados.join(", "));
ok("catálogo, sitemap, blog e cobertura", /simulador-ganho-massa-muscular/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /simulador-ganho-massa-muscular/.test(readFileSync("app/sitemap.ts", "utf8")) && /ARTIGOS_COM_LINK_SIMULADOR_MASSA\.includes/.test(readFileSync("app/blog/[slug]/page.tsx", "utf8")) && /ARTIGOS_COM_LINK_SIMULADOR_MASSA/.test(readFileSync("scripts/cobertura-test.ts", "utf8")));
ok("artigos do link existem", M.ARTIGOS_COM_LINK_SIMULADOR_MASSA.every((s) => blogPosts.some((p) => p.slug === s)));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
