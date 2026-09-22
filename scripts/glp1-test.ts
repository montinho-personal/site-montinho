import { readFileSync } from "fs";
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
/**
 * O motor da Calculadora de Massa Magra no GLP-1.
 *   npx tsx scripts/glp1-test.ts
 *
 * Este é o teste mais conservador do repositório, e por um motivo: o tema
 * é saúde, o público está assustado e a ferramenta fala de medicação de
 * uso contínuo. O que se protege aqui, além da conta, é o que a página
 * NÃO pode dizer — dose, marca, "pode parar" — e o que ela não pode
 * esconder: que a faixa é de população, que massa magra não é só músculo
 * e que emagrecer sempre custa alguma massa magra.
 */
import {
  ARTIGOS_COM_CALCULADORA_GLP1, CENARIOS, FONTES_GLP1, FRACAO_MASSA_MAGRA, PROTEINA_ALVO, PROTEINA_MINIMA,
  PROTEINA_ALVO_MAX, PROTEINA_SUFICIENTE,
  calcula, formataFaixaKg, formataKg, jaProtegido, perdaValida, pesoValido, protecaoDe, proteinaValida,
} from "../lib/glp1";
import { ARTIGOS_COM_LINK_CONCENTRACAO } from "../lib/concentracao/artigos";
import { ARTIGOS_COM_CALCULADORA as ARTIGOS_PROTEINA } from "../lib/proteina";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.001) => Math.abs(a - b) <= t;

bloco("1. AS FAIXAS, TRAVADAS NOS ENSAIOS");
/* 25% é o SURMOUNT-1 e 40% é o STEP-1: mudar aqui exige outra fonte. */
ok("sem proteção: 25% a 40%", FRACAO_MASSA_MAGRA.nenhuma.min === 0.25 && FRACAO_MASSA_MAGRA.nenhuma.max === 0.4);
ok("proteção completa: 5% a 15%", FRACAO_MASSA_MAGRA.completa.min === 0.05 && FRACAO_MASSA_MAGRA.completa.max === 0.15);
ok("parcial fica entre as duas",
  FRACAO_MASSA_MAGRA.parcial.min > FRACAO_MASSA_MAGRA.completa.min && FRACAO_MASSA_MAGRA.parcial.max < FRACAO_MASSA_MAGRA.nenhuma.max);
ok("toda faixa tem min < max", Object.values(FRACAO_MASSA_MAGRA).every((f) => f.min < f.max));
ok("nenhuma faixa promete zero perda de massa magra", Object.values(FRACAO_MASSA_MAGRA).every((f) => f.min > 0));
/*
 * Os artigos do cluster publicam "alvo mínimo 1,6 g/kg, ideal 2,0 a 2,2".
 * A calculadora usava 1,6 como meta e pedia 144 g para 90 kg enquanto o
 * artigo ao lado pedia 180 a 198 — duas metas na mesma página.
 */
ok("o piso de proteção é 1,6 g/kg, como nos artigos", PROTEINA_SUFICIENTE === 1.6);
ok("o alvo é 2,0 a 2,2 g/kg, como nos artigos", PROTEINA_ALVO === 2.0 && PROTEINA_ALVO_MAX === 2.2);
ok("o mínimo absoluto continua em 1,2", PROTEINA_MINIMA === 1.2);
ok("o alvo é maior que o piso", PROTEINA_ALVO > PROTEINA_SUFICIENTE);

bloco("2. O CENÁRIO SAI DO TREINO E DA PROTEÍNA");
ok("nada dos dois -> nenhuma", protecaoDe("nenhum", 0.8) === "nenhuma");
ok("treino irregular e pouca proteína -> nenhuma", protecaoDe("leve", 1.0) === "nenhuma");
ok("treino regular, proteína baixa -> parcial", protecaoDe("regular", 1.0) === "parcial");
ok("sem treino, proteína mínima -> parcial", protecaoDe("nenhum", 1.3) === "parcial");
ok("treino regular e proteína no piso -> completa", protecaoDe("regular", 1.6) === "completa");
/* Quem já passou do piso não pode ser rebaixado por não estar no ideal. */
ok("1,7 g/kg com treino regular continua completa", protecaoDe("regular", 1.7) === "completa");
ok("o piso exato conta como completa", protecaoDe("regular", PROTEINA_SUFICIENTE) === "completa");

bloco("3. A CONTA");
const r = calcula(100, 90, "nenhum", 70);
ok("perdeu 10 kg (10%)", perto(r.perda, 10) && perto(r.perdaPct, 10));
ok("massa magra de 2,5 a 4,0 kg", perto(r.massaMagra.min, 2.5) && perto(r.massaMagra.max, 4));
ok("gordura de 6,0 a 7,5 kg", perto(r.gordura.min, 6) && perto(r.gordura.max, 7.5));
ok("magra + gordura fecham a perda", perto(r.massaMagra.min + r.gordura.max, r.perda) && perto(r.massaMagra.max + r.gordura.min, r.perda));
ok("meta de proteína usa o peso ATUAL", perto(r.metaProteinaG, 90 * PROTEINA_ALVO));
ok("o piso de proteção também usa o peso atual", perto(r.minimoProteinaG, 90 * PROTEINA_SUFICIENTE));
/* A falta é até o PISO: mandar alguém em 1,7 g/kg "corrigir" seria errado. */
ok("falta de proteína é a diferença até o piso", perto(r.faltaProteinaG, 90 * PROTEINA_SUFICIENTE - 70));
ok("quem passou do piso não tem falta", calcula(100, 90, "nenhum", 90 * 1.7).faltaProteinaG === 0);
ok("o cenário protegido perde menos", r.massaMagraProtegida.max < r.massaMagra.max);
ok("o ganho ao proteger é positivo e não maior que a perda", r.ganhoAoProteger.max > 0 && r.ganhoAoProteger.max <= r.perda);
{
  const p = calcula(100, 90, "regular", 144);
  ok("quem já protege não recebe recomendação", jaProtegido(p) && p.protecao === "completa");
  ok("quem já protege não tem falta de proteína", p.faltaProteinaG === 0);
ok("mas a meta ideal continua visível para ele", p.metaProteinaG > p.minimoProteinaG);
  ok("quem já protege tem ganho zero (não há o que melhorar aqui)", p.ganhoAoProteger.max === 0);
}

bloco("4. ENTRADAS QUE PRECISAM SER RECUSADAS");
ok("peso fora da faixa", !pesoValido(20) && !pesoValido(400) && pesoValido(90));
ok("ganhar peso não é perda", !perdaValida(90, 100) && !perdaValida(90, 90));
ok("perda implausível é recusada", !perdaValida(100, 30) && perdaValida(100, 60));
ok("proteína precisa ser positiva e plausível", !proteinaValida(0) && !proteinaValida(600) && proteinaValida(120));

bloco("5. O QUE A FERRAMENTA NÃO PODE DIZER (tema de saúde)");
const lib = readFileSync("lib/glp1.ts", "utf8");
const comp = readFileSync("components/glp1/CalculadoraGLP1.tsx", "utf8");
const tool = readFileSync("app/ferramentas/massa-magra-glp1/page.tsx", "utf8");
const todos = lib + comp + tool;
/*
 * Dose, posologia e marca não aparecem: a ferramenta não prescreve e não
 * dá pista de prescrição. "mg" e "ml" caçam número de dose.
 */
ok("não fala de dose nem de posologia", !/\b\d+\s?(mg|ml)\b/i.test(todos), (todos.match(/\b\d+\s?(mg|ml)\b/i) ?? []).join(", "));
/*
 * O que se caça é ORIENTAÇÃO sobre a medicação, não a palavra. O FAQ tem
 * "essa calculadora diz se eu devo parar o medicamento?", cuja resposta é
 * que isso é do prescritor — e ela precisa continuar podendo existir.
 */
{
  const ORIENTA = /(pare|suspenda|interrompa|comece|aumente|reduza|diminua)\s+(a\s+dose|o\s+medicamento|o\s+rem[ée]dio|a\s+aplica[çc][ãa]o)/i;
  const MANDA = /(voc[êe])\s+(deve|deveria|precisa)\s+(parar|suspender|aumentar|reduzir)\s+(a\s+dose|o\s+medicamento)/i;
  ok("não manda parar, começar ou ajustar medicação", !ORIENTA.test(todos) && !MANDA.test(todos),
    (todos.match(ORIENTA) ?? todos.match(MANDA) ?? []).join(" | "));
  /* "garantir que a carga suba" é instrução de treino, não promessa. */
  const PROMESSA = /(garantido|garantimos|garante que voc[êe]|com certeza voc[êe]|sem falhar)/i;
  ok("não promete resultado", !PROMESSA.test(todos), (todos.match(PROMESSA) ?? []).join(" | "));
  ok("o FAQ enfrenta a pergunta de parar o medicamento e devolve ao prescritor",
    /devo parar o medicamento/i.test(tool) && /NOTA_MEDICA/.test(tool));
}
/* E o que ela é obrigada a dizer. */
ok("diz que não trata de dose nem de marca", /não fala de dose/i.test(todos));
ok("manda para o prescritor", /prescritor/i.test(comp) && /prescritor/i.test(tool));
ok("diz que massa magra não é só músculo", /não é só músculo/i.test(todos));
ok("diz que é faixa de população, não medição", /não medição|de população/i.test(comp) && /faixas, não medição/i.test(lib + comp + tool));
ok("menciona DXA como o que mede de verdade", /DXA/.test(comp) && /DXA/.test(tool));
/* A velocidade da perda pesa e a ferramenta não a considera: tem de dizer. */
{
  const declara = (s: string) => /velocidade da perda/i.test(s) || /NOTA_VELOCIDADE/.test(s);
  ok("declara que não considera a velocidade da perda", declara(comp) && declara(tool) && /velocidade da perda/i.test(lib));
}
ok("a página não pergunta qual medicamento a pessoa usa", !/qual medicamento você|selecione o medicamento/i.test(comp));

bloco("6. PRIVACIDADE");
ok("sem chamada de rede", !/fetch\(|sendBeacon|XMLHttpRequest/.test(comp));
ok("o evento leva o cenário, nunca peso nem gramas",
  /trackEvent\("glp1_calculator_use", \{ placement, protection: protecao \}\)/.test(comp));
ok("nada é gravado no navegador", !/localStorage|sessionStorage/.test(comp));
ok("o resumo do WhatsApp não leva o peso", !/resumoWhats[\s\S]{0,200}peso/.test(comp));

bloco("7. FONTES, REGISTROS E PÁGINA");
ok("cinco fontes, todas com URL", FONTES_GLP1.length === 5 && FONTES_GLP1.every((f) => /^https?:\/\//.test(f.url)));
ok("cita STEP-1 e SURMOUNT-1", FONTES_GLP1.some((f) => /STEP/.test(f.rotuloCurto)) && FONTES_GLP1.some((f) => /SURMOUNT/.test(f.rotuloCurto)));
ok("cita a fonte de que massa magra não é só músculo", FONTES_GLP1.some((f) => /Abe/.test(f.rotuloCurto)));
ok("três cenários publicados", CENARIOS.length === 3 && CENARIOS.every((c) => c.comoEstar.length > 10));
const slugs = new Set(blogPosts.map((p) => p.slug));
ok("todo artigo do registro existe", ARTIGOS_COM_CALCULADORA_GLP1.every((s) => slugs.has(s)), ARTIGOS_COM_CALCULADORA_GLP1.filter((s) => !slugs.has(s)).join(", "));
ok("o teto de oito é respeitado", ARTIGOS_COM_CALCULADORA_GLP1.length <= 8);
const outros = new Set([...ARTIGOS_COM_LINK_CONCENTRACAO, ...ARTIGOS_PROTEINA]);
ok("nenhum artigo daqui pertence a outra ferramenta", ARTIGOS_COM_CALCULADORA_GLP1.every((s) => !outros.has(s)), ARTIGOS_COM_CALCULADORA_GLP1.filter((s) => outros.has(s)).join(", "));
for (const s of ARTIGOS_COM_CALCULADORA_GLP1) {
  const p = blogPosts.find((x) => x.slug === s)!;
  ok(`${s}: o corte editorial existe`, splitAtPrimeiraSecao(marked(p.content) as string) !== null);
}
ok("canônica e pós-resultado", CANONICA.glp1?.href === ROTA.glp1 && NOME.glp1 === "Calculadora de Massa Magra no GLP-1");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_GLP1\.includes\(post\.slug\)/.test(blog) && /<CalculadoraGLP1 placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /massa-magra-glp1/.test(readFileSync("app/ferramentas/page.tsx", "utf8")) && /massa-magra-glp1/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("um H1", (tool.match(/<h1[\s>]/g) ?? []).length === 1);
ok("duas tabelas em HTML", (tool.match(/<table/g) ?? []).length >= 2);
ok("CTA centralizado", /<PosResultado[\s\S]*ferramenta="glp1"/.test(comp));
ok("o CTA muda com o cenário", /categoria=\{resultado\.protecao\}/.test(comp));
ok("aria-live", /aria-live="polite"/.test(comp));
ok("liga para a calculadora de proteína", /calculadora-de-proteina/.test(comp) && /calculadora-de-proteina/.test(tool));
/* A frase de formatação não pode virar "4 kg a 4 kg" quando min e max coincidem. */
ok("a faixa formatada sempre mostra os dois números", formataFaixaKg({ min: 2.5, max: 4 }) === "2,5 a 4,0 kg");
ok("a faixa usa uma casa dos dois lados", formataFaixaKg({ min: 6, max: 7.5 }) === "6,0 a 7,5 kg", formataFaixaKg({ min: 6, max: 7.5 }));
ok("kg formatado com uma casa", formataKg(2.53) === "2,5 kg");
/* "2 a 2,2 g" fica torto ao lado de "1,6": as metas de proteína têm uma casa. */
ok("as metas de proteína aparecem com uma casa decimal",
  !/PROTEINA_(ALVO|ALVO_MAX|SUFICIENTE)\.toLocaleString\("pt-BR"\)/.test(comp + tool));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
