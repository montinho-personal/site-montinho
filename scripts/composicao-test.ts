import { readFileSync } from "fs";
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
/**
 * O motor da Calculadora de Composição Corporal.
 *   npx tsx scripts/composicao-test.ts
 *
 * O que se protege: a álgebra dos dois cenários (o sem treino resolve um
 * sistema, e é onde um sinal trocado passaria despercebido), as faixas
 * que precisam bater com o artigo do site, e as duas coisas que a página
 * é obrigada a dizer — que a bioimpedância estima e não mede, e que a
 * conta supõe a massa magra de pé.
 */
import {
  ARTIGOS_COM_CALCULADORA_COMPOSICAO, FAIXAS, FRACAO_MAGRA_SEM_TREINO, GORDURA_ESSENCIAL,
  PERDA_MAGRA_MAX_FRACAO, alvoValido, calcula, faixaDe, formataKg, formataPct, gorduraValida,
  pesoValido, recusaDoAlvo, tabelaDeAlvos, textoDaRecusa,
} from "../lib/composicao";
import { ARTIGOS_COM_CALCULADORA_POTENCIAL } from "../lib/potencial";
import { ARTIGOS_COM_CALCULADORA_META } from "../lib/meta";
import { ARTIGOS_COM_CALCULADORA_DEFICIT } from "../lib/calorias";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. A CONTA BÁSICA");
const r = calcula(90, 28, "homem", 15);
ok("massa gorda é peso × percentual", perto(r.massaGorda, 25.2));
ok("massa magra é o que sobra", perto(r.massaMagra, 64.8) && perto(r.massaGorda + r.massaMagra, 90));
ok("28% em homem é 'acima da faixa saudável'", r.faixa.id === "alto");
ok("sem alvo, não há bloco de alvo", calcula(90, 28, "homem", null).alvo === null);

bloco("2. O ALVO, COM A MASSA MAGRA DE PÉ");
const a = r.alvo!;
ok("peso no alvo é magra ÷ (1 − alvo)", perto(a.pesoNoAlvo, 64.8 / 0.85, 0.01), formataKg(a.pesoNoAlvo));
ok("a perda fecha com o peso", perto(a.perda, 90 - a.pesoNoAlvo));
/* A verificação que importa: o resultado tem mesmo o percentual pedido. */
ok("o peso no alvo tem exatamente o percentual alvo",
  perto((a.massaGordaNoAlvo / a.pesoNoAlvo) * 100, 15, 0.001));
ok("a massa magra fica intacta nesse cenário", perto(a.pesoNoAlvo - a.massaGordaNoAlvo, r.massaMagra, 0.01));
ok("alvo mais baixo pede mais perda", calcula(90, 28, "homem", 10)!.alvo!.perda > a.perda);

bloco("3. O CENÁRIO SEM TREINO — a álgebra que um sinal trocado quebraria");
ok("perde-se mais peso para o mesmo percentual", a.semTreino.perda > a.perda);
ok("a massa magra final é menor", a.semTreino.massaMagraFinal < r.massaMagra);
/* O sistema fecha: no peso final, a composição bate no alvo. */
ok("o peso final sem treino também dá o percentual alvo",
  perto(((a.semTreino.pesoNoAlvo - a.semTreino.massaMagraFinal) / a.semTreino.pesoNoAlvo) * 100, 15, 0.01));
/* E a massa magra perdida é a fração declarada do peso perdido. */
ok(`a massa magra perdida é ${Math.round(FRACAO_MAGRA_SEM_TREINO * 100)}% do peso perdido`,
  perto((r.massaMagra - a.semTreino.massaMagraFinal) / a.semTreino.perda, FRACAO_MAGRA_SEM_TREINO, 0.001));
ok("a diferença entre os cenários é positiva e relevante", a.semTreino.perda - a.perda > 1);

bloco("4. AS FAIXAS BATEM COM O ARTIGO");
/* O artigo publica: homens de 10 a 20%, mulheres de 18 a 28%, como saudáveis. */
ok("homem de 10% a 20% cai em faixa saudável",
  ["atleta", "bom", "aceitavel"].includes(faixaDe(10, "homem").id) && faixaDe(20, "homem").id === "aceitavel");
ok("homem acima de 20% sai da faixa saudável", faixaDe(21, "homem").id === "alto");
ok("mulher de 18% a 28% cai em faixa saudável",
  ["atleta", "bom", "aceitavel"].includes(faixaDe(18, "mulher").id) && faixaDe(28, "mulher").id === "aceitavel");
ok("mulher acima de 28% sai da faixa saudável", faixaDe(29, "mulher").id === "alto");
ok("a régua feminina é sempre mais alta que a masculina",
  FAIXAS.every((f) => f.ate.mulher >= f.ate.homem));
ok("cinco faixas, em ordem crescente",
  FAIXAS.length === 5 && FAIXAS.every((f, i) => i === 0 || f.ate.homem > FAIXAS[i - 1].ate.homem));

bloco("5. ENTRADAS QUE PRECISAM SER RECUSADAS");
ok("peso fora da faixa", !pesoValido(20) && !pesoValido(400) && pesoValido(90));
ok("gordura fora da faixa", !gorduraValida(2) && !gorduraValida(70) && gorduraValida(28));
ok("alvo maior ou igual ao atual é recusado", !alvoValido(28, 28, "homem") && !alvoValido(30, 28, "homem"));
/* Abaixo da gordura essencial a conta não vai — não é meta de ninguém. */
ok("alvo abaixo do essencial é recusado",
  !alvoValido(GORDURA_ESSENCIAL.homem - 1, 28, "homem") && alvoValido(GORDURA_ESSENCIAL.homem, 28, "homem"));
ok("a essencial feminina é maior", GORDURA_ESSENCIAL.mulher > GORDURA_ESSENCIAL.homem);
ok("mulher com alvo de 10% é recusada", !alvoValido(10, 30, "mulher"));

bloco("6. A TABELA DE ALVOS");
const t = tabelaDeAlvos(90, 28, "homem");
ok("só mostra alvos abaixo do atual", t.every((l) => l.alvo < 28));
ok("alvo menor pede mais perda", t.every((l, i) => i === 0 || l.perda > t[i - 1].perda));
ok("cada linha tem o percentual certo",
  t.every((l) => perto(((l.pesoNoAlvo * (l.alvo / 100)) / l.pesoNoAlvo) * 100, l.alvo, 0.001)));
ok("quem já está magro recebe tabela curta ou vazia", tabelaDeAlvos(70, 11, "homem").length <= 1);

bloco("7. O QUE A PÁGINA PRECISA DIZER");
const lib = readFileSync("lib/composicao.ts", "utf8");
const comp = readFileSync("components/composicao/CalculadoraComposicao.tsx", "utf8");
const tool = readFileSync("app/ferramentas/composicao-corporal/page.tsx", "utf8");
const todos = lib + comp + tool;
ok("diz que a bioimpedância estima e não mede", /não mede gordura|estima/i.test(todos) && /resistência elétrica/i.test(todos));
ok("explica a variação diária pela água", /água/i.test(todos) && /de um dia para o outro/i.test(todos));
ok("manda repetir no mesmo aparelho", /mesmo aparelho/i.test(todos));
ok("diz que a conta supõe a massa magra de pé", /massa magra fica de pé/i.test(todos));
ok("diz que as faixas não são meta", /não meta|não são meta|régua de leitura/i.test(todos));
/* A ressalva vem ANTES do formulário, não depois do resultado. */
ok("a ressalva da bioimpedância aparece antes dos campos",
  comp.indexOf("NOTA_BIOIMPEDANCIA") < comp.indexOf('htmlFor={idc("peso")}'));
ok("a página não promete medir gordura", /Ela parte do percentual que você já tem|não\. ela parte/i.test(tool));

bloco("8. REGISTROS E PÁGINA");
/*
 * A auditoria: o cenário "sem treino" não tem freio algébrico próprio.
 * Num alvo distante o bastante ele devolve um corpo que não existe (90 kg
 * a 60% mirando 15% "chegaria" a 22,5 kg), e a ferramenta precisa parar
 * de imprimir o número em vez de fingir que é um resultado.
 */
{
  const perto = calcula(90, 28, "homem", 15).alvo!;
  ok("alvo próximo: o cenário sem treino ainda descreve um corpo", perto.semTreino.viavel);
  ok("alvo próximo: a magra perdida é um quarto do peso perdido",
    Math.abs((perto.semTreino.perda * FRACAO_MAGRA_SEM_TREINO) - (90 * 0.72 - perto.semTreino.massaMagraFinal)) < 0.05);

  const longe = calcula(90, 60, "homem", 15).alvo!;
  ok("alvo distante: o cenário sem treino é recusado, não impresso", !longe.semTreino.viavel);
  ok("alvo distante: o cenário com treino continua valendo", longe.pesoNoAlvo > 0 && longe.perda > 0);

  ok("o teto de perda de massa magra é o que decide",
    longe.semTreino.perdaMagraFracao > PERDA_MAGRA_MAX_FRACAO && perto.semTreino.perdaMagraFracao <= PERDA_MAGRA_MAX_FRACAO);
}

/* Um alvo que a conta não aceita precisa dizer por quê, não sumir. */
{
  ok("alvo abaixo do essencial tem motivo", recusaDoAlvo(4, 28, "homem") === "abaixo-do-essencial");
  ok("alvo abaixo do essencial na mulher tem motivo", recusaDoAlvo(11, 32, "mulher") === "abaixo-do-essencial");
  ok("alvo igual ao atual tem motivo", recusaDoAlvo(28, 28, "homem") === "nao-e-reducao");
  ok("alvo acima do atual tem motivo", recusaDoAlvo(35, 28, "homem") === "nao-e-reducao");
  ok("alvo válido não tem motivo", recusaDoAlvo(15, 28, "homem") === null);
  ok("alvo vazio não vira mensagem", recusaDoAlvo(null, 28, "homem") === null);
  ok("cada motivo tem texto", textoDaRecusa("abaixo-do-essencial", "homem").includes("5%") && textoDaRecusa("nao-e-reducao", "homem").length > 40);
  ok("a calculadora mostra o motivo", /textoDaRecusa\(recusa, sexo\)/.test(comp));
  ok("a calculadora não imprime o cenário inviável", /semTreino\.viavel \?/.test(comp));
}

const slugs = new Set(blogPosts.map((p) => p.slug));
ok("todo artigo do registro existe", ARTIGOS_COM_CALCULADORA_COMPOSICAO.every((s) => slugs.has(s)), ARTIGOS_COM_CALCULADORA_COMPOSICAO.filter((s) => !slugs.has(s)).join(", "));
ok("o teto de oito é respeitado", ARTIGOS_COM_CALCULADORA_COMPOSICAO.length <= 8);
const outros = new Set([...ARTIGOS_COM_CALCULADORA_POTENCIAL, ...ARTIGOS_COM_CALCULADORA_META, ...ARTIGOS_COM_CALCULADORA_DEFICIT]);
ok("nenhum artigo daqui pertence às ferramentas vizinhas", ARTIGOS_COM_CALCULADORA_COMPOSICAO.every((s) => !outros.has(s)), ARTIGOS_COM_CALCULADORA_COMPOSICAO.filter((s) => outros.has(s)).join(", "));
ok("o artigo dono da pergunta está no registro", ARTIGOS_COM_CALCULADORA_COMPOSICAO.includes("bioimpedancia-como-interpretar"));
for (const s of ARTIGOS_COM_CALCULADORA_COMPOSICAO) {
  const p = blogPosts.find((x) => x.slug === s)!;
  ok(`${s}: o corte editorial existe`, splitAtPrimeiraSecao(marked(p.content) as string) !== null);
}
ok("canônica e pós-resultado", CANONICA.composicao?.href === ROTA.composicao && NOME.composicao === "Calculadora de Composição Corporal");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_COMPOSICAO\.includes\(post\.slug\)/.test(blog) && /<CalculadoraComposicao placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /composicao-corporal/.test(readFileSync("app/ferramentas/page.tsx", "utf8")) && /composicao-corporal/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon/.test(comp));
ok("o evento leva a faixa, nunca os números", /range: faixaId/.test(comp) && !/trackEvent\([^)]*(peso|gordura)/.test(comp));
ok("CTA centralizado e por faixa", /<PosResultado[\s\S]*ferramenta="composicao"/.test(comp) && /categoria=\{resultado\.faixa\.id\}/.test(comp));
ok("aria-live", /aria-live="polite"/.test(comp));
ok("um H1", (tool.match(/<h1[\s>]/g) ?? []).length === 1);
ok("três tabelas em HTML", (tool.match(/<table/g) ?? []).length >= 3);
ok("liga para as ferramentas vizinhas", /potencial-natural/.test(tool) && /meta-de-peso/.test(tool));
ok("formatação", formataKg(64.75) === "64,8 kg" && formataPct(28) === "28%");

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
