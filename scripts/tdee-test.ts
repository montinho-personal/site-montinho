/**
 * Testes da Calculadora de TMB e Gasto Calórico (TDEE).
 *
 * O risco número um desta ferramenta é a duplicação: o site JÁ calcula TMB
 * e TDEE dentro da Calculadora de Déficit. Se as duas contas divergirem um
 * dia — uma constante ajustada aqui, um fator ali — o site passa a dar dois
 * gastos diferentes para a mesma pessoa. Por isso a primeira seção prova
 * que lib/tdee REUSA lib/calorias em vez de reimplementar.
 *
 * O segundo risco é o de toda calculadora de gasto: prometer precisão que
 * uma equação populacional não tem, e deixar a pessoa se marcar "muito
 * ativa" por treinar 1h por dia.
 */

import * as fs from "fs";
import { blogPosts } from "../lib/blog";
import * as calorias from "../lib/calorias";
import {
  ARTIGOS_COM_CALCULADORA_TDEE,
  NARRATIVA_GANHO,
  NIVEIS,
  SUPERAVIT_MAX,
  SUPERAVIT_MIN,
  faixaGanho,
  arredondaKcal,
  calculaTDEE,
  calculaTMB,
  comparaAtividades,
  formataFaixa,
  normalizaAltura,
  normalizaIdade,
  normalizaNumero,
  tmbPorSexo,
} from "../lib/tdee";
import { PONTE, consomeDadosCorporais } from "../lib/ferramentas/ponte";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const ler = (p: string) => fs.readFileSync(p, "utf8");
const semComentarios = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

console.log("\n" + "=".repeat(64) + "\nUM MOTOR SÓ: lib/tdee REUSA lib/calorias\n" + "=".repeat(64));

/**
 * A prova mais forte possível: as funções exportadas são AS MESMAS
 * referências. Não "dão o mesmo resultado" — são o mesmo objeto na memória.
 */
ok("tmbPorSexo é a mesma função do déficit", tmbPorSexo === calorias.tmbPorSexo);
ok("calculaTMB é a mesma função do déficit", calculaTMB === calorias.calculaTMB);
ok("calculaTDEE é a mesma função do déficit", calculaTDEE === calorias.calculaTDEE);
ok("NIVEIS é a mesma lista do déficit", NIVEIS === calorias.NIVEIS);
ok("o arredondamento é o mesmo do déficit", arredondaKcal === calorias.arredondaKcal);
{
  const libTdee = semComentarios(ler("lib/tdee.ts"));
  ok(
    "lib/tdee não tem número de fórmula próprio (10, 6.25, 5, 161 vivem só em lib/calorias)",
    !/10 \*|6\.25|161/.test(libTdee),
    "qualquer constante duplicada é uma divergência esperando acontecer"
  );
}

console.log("\n" + "=".repeat(64) + "\nA MATEMÁTICA (casos do enunciado)\n" + "=".repeat(64));

/** Homem 80 kg / 175 cm / 35 anos → 800 + 1.093,75 − 175 + 5 = 1.723,75. */
const tmbHomem = tmbPorSexo(80, 175, 35, "masculino");
ok("homem 80/175/35: TMB = 1.723,75 kcal", Math.abs(tmbHomem - 1723.75) < 1e-9, String(tmbHomem));
ok('a tela mostra "1.720" (dezena, o padrão do site — não unidade)', formataFaixa(calculaTMB(80, 175, 35, "masculino")) === "1.720");

/** TDEE moderado: 1.723,75 × 1,55 = 2.671,8125 → "2.670". */
const tdeeModerado = calculaTDEE({ min: tmbHomem, max: tmbHomem }, 1.55);
ok("TDEE moderado = 2.671,8125 kcal internamente", Math.abs(tdeeModerado.min - 2671.8125) < 1e-6, String(tdeeModerado.min));
ok('a tela mostra "≈ 2.670" — nunca a casa decimal', formataFaixa(tdeeModerado) === "2.670");

/** Mulher 60 kg / 165 cm / 30 anos → 600 + 1.031,25 − 150 − 161 = 1.320,25. */
const tmbMulher = tmbPorSexo(60, 165, 30, "feminino");
ok("mulher 60/165/30: TMB = 1.320,25 kcal", Math.abs(tmbMulher - 1320.25) < 1e-9, String(tmbMulher));

/** Sem sexo informado: faixa honesta, nunca média inventada. */
const faixa = calculaTMB(80, 175, 35, "nao_informado");
ok("sem sexo: faixa da constante feminina à masculina (166 kcal)", Math.abs(faixa.max - faixa.min - 166) < 1e-9);
ok("a faixa aparece como intervalo, não como número único", formataFaixa(faixa).includes("–"));

/** Os cinco fatores, cada um mudando o resultado corretamente. */
const FATORES_ESPERADOS = [1.2, 1.375, 1.55, 1.725, 1.9];
ok(
  "os cinco fatores clássicos estão no banco, em ordem",
  NIVEIS.length === 5 && NIVEIS.every((n, i) => n.fator === FATORES_ESPERADOS[i]),
  NIVEIS.map((n) => n.fator).join(", ")
);
{
  const comp = comparaAtividades({ min: tmbHomem, max: tmbHomem });
  ok("a comparação traz os cinco níveis", comp.length === 5);
  ok(
    "cada nível multiplica certo",
    comp.every((c, i) => Math.abs(c.tdee.min - tmbHomem * FATORES_ESPERADOS[i]) < 1e-6)
  );
  ok(
    "a comparação é estritamente crescente (não há como escolher 'errado para mais' sem ver)",
    comp.every((c, i) => i === 0 || c.tdee.min > comp[i - 1].tdee.min)
  );
}

console.log("\n" + "=".repeat(64) + "\nENTRADAS DO MUNDO REAL\n" + "=".repeat(64));

ok('peso "80" → 80', normalizaNumero("80") === 80);
ok('peso "80,5" → 80.5 (vírgula brasileira)', normalizaNumero("80,5") === 80.5);
ok('peso "80.5" → 80.5', normalizaNumero("80.5") === 80.5);
ok('peso " 80 " → 80 (espaços)', normalizaNumero(" 80 ") === 80);
ok('altura "175" → 175 cm', normalizaAltura("175") === 175);
ok('altura "1,75" → 175 cm (metros normalizados)', normalizaAltura("1,75") === 175);
ok('altura "80" é inválida (nem cm plausível, nem metro)', (() => { const a = normalizaAltura("80"); return a !== null && (a < 120 || a > 230); })());
ok("vazio, zero, negativo e texto viram null — nunca NaN", [normalizaNumero(""), normalizaNumero("0"), normalizaNumero("-5"), normalizaNumero("abc")].every((v) => v === null));
ok('idade "35" → 35; "35,5" e "abc" → null', normalizaIdade("35") === 35 && normalizaIdade("35,5") === null && normalizaIdade("abc") === null);
{
  const comp = semComentarios(ler("components/tdee/CalculadoraTDEE.tsx"));
  ok("o componente nunca exibe NaN/Infinity/undefined", !/NaN|Infinity|\bundefined\b/.test(comp.replace(/typeof \w+ === "undefined"/g, "")));
}

console.log("\n" + "=".repeat(64) + "\nO COMPONENTE: honestidade e segurança\n" + "=".repeat(64));

const componente = semComentarios(ler("components/tdee/CalculadoraTDEE.tsx"));
const libTdeeSrc = semComentarios(ler("lib/tdee.ts"));
const tudo = componente + libTdeeSrc;

ok("zero state: convite, nunca 'TMB: 0'", /ZERO_STATE/.test(componente) && /Preencha seus dados/.test(libTdeeSrc));
ok("menor de idade recebe orientação, não meta", /menorDeIdade \?/.test(componente) && /ORIENTACAO_MENOR_IDADE/.test(componente));
ok("gestação/lactação têm o disclaimer", /DISCLAIMER_ESPECIAL/.test(componente));
ok("a ajuda de atividade fala do dia inteiro, não só do treino", /dia inteiro/.test(componente) && /Como escolher meu nível\?/.test(componente));
ok("resultado anunciado por aria-live", /aria-live="polite"/.test(componente));
ok("labels de verdade e fieldsets", (componente.match(/<label htmlFor=/g) ?? []).length >= 3 && /<fieldset/.test(componente) && /<legend/.test(componente));
ok("teclado certo no celular", /inputMode="decimal"/.test(componente) && /inputMode="numeric"/.test(componente));
ok("alvos de toque adequados", /min-h-\[44px\]/.test(componente) && /min-h-\[48px\]/.test(componente));
ok("a fórmula não é caixa-preta: Mifflin aparece com a conta aberta", /Mifflin-St Jeor/.test(componente) && /10 × peso/.test(componente));
ok("a referência tem link para a fonte primária", /pubmed\.ncbi\.nlm\.nih\.gov\/2305711/.test(componente + ler("lib/calorias.ts")));
ok("nenhuma chamada de rede", !/fetch\(|axios|XMLHttpRequest/.test(componente));
ok("nunca usa localStorage", !/localStorage/.test(componente));

/** A linguagem que não pode entrar. */
const PROIBIDO: [RegExp, string][] = [
  [/medi[çc][ãa]o exata|metabolismo exato|gasto real garantido/i, "promessa de exatidão"],
  [/seu treino (somou|acrescentou|adicionou)/i, "separar treino do fator é falsa precisão"],
  [/\d+,\d+ ?kcal\/dia/, "casa decimal em kcal exibida"],
  [/algoritmo exclusivo|f[óo]rmula secreta/i, "a conta é aberta por princípio"],
];
for (const [re, motivo] of PROIBIDO) {
  ok(`nunca diz: ${motivo}`, !re.test(tudo), (tudo.match(re) ?? [""])[0]);
}
ok("as palavras honestas estão lá: estimativa, tenderia, ponto de partida", /estimativa/i.test(tudo) && /tenderia/.test(libTdeeSrc) && /ponto de partida/.test(libTdeeSrc));

console.log("\n" + "=".repeat(64) + "\nA NARRATIVA DE GANHO DE MASSA\n" + "=".repeat(64));

/**
 * A opção "quero ganhar massa magra" usa a MESMA faixa de superávit que o
 * acervo ensina (200–400 kcal) — número que muda de página para página não
 * é referência. E parte do começo conservador: em superávit, errar para
 * mais custa gordura.
 */
{
  ok("a faixa de superávit é a do acervo: 200 a 400 kcal", SUPERAVIT_MIN === 200 && SUPERAVIT_MAX === 400);
  ok(
    "o acervo realmente ensina essa faixa (o artigo diz 200 a 400)",
    /superávit calórico moderado \(200 a 400 kcal/.test(ler("lib/blog.ts")),
    "se o artigo mudar a faixa, a ferramenta tem que mudar junto"
  );
  const g = faixaGanho({ min: 2671.8125, max: 2671.8125 });
  ok("a faixa de ganho soma sobre o gasto da pessoa", Math.abs(g.min - 2871.8125) < 1e-6 && Math.abs(g.max - 3071.8125) < 1e-6);
  ok("a narrativa explica o porquê do moderado", /ACIMA do gasto/.test(NARRATIVA_GANHO) && /gordura/.test(NARRATIVA_GANHO));
  ok("as três direções existem: emagrecer, manter e ganhar", /Quero emagrecer/.test(componente) && /Quero manter/.test(componente) && /ganhar massa magra/.test(componente));
  ok("a meta de ganho parte do começo conservador da faixa (+200)", /tdee\.min \+ SUPERAVIT_MIN/.test(componente));
  ok("o painel de ganho leva para macros E para o FitChef", /objetivo: "ganhar"/.test(componente) && /monte-seu-cardapio/.test(componente));
  ok("o painel linka o artigo de calorias para ganhar massa", /calorias-para-ganhar-massa-muscular/.test(componente));
  ok("nunca chama o superávit de prescrição individual", !/seu superávit ideal|superávit ideal para você/i.test(componente));
}

console.log("\n" + "=".repeat(64) + "\nPRIVACIDADE E ANALYTICS\n" + "=".repeat(64));

{
  const chamadas = componente.match(/trackEvent\("[^"]+"[^)]*\)/g) ?? [];
  /**
   * A checagem olha só os PARÂMETROS (o que vem depois do nome): o nome do
   * evento legitimamente contém "tdee" — sensível é peso/altura/resultado
   * viajar como parâmetro.
   */
  const parametros = (c: string) => c.replace(/^trackEvent\("[^"]+"/, "");
  const SENSIVEL = /peso|altura|idade|sexo|tmb|tdee|kcal/i;
  ok("existem eventos de funil", chamadas.length >= 5, String(chamadas.length));
  ok(
    "nenhum evento carrega dado corporal ou resultado nos parâmetros",
    chamadas.every((c) => !SENSIVEL.test(parametros(c))),
    chamadas.filter((c) => SENSIVEL.test(parametros(c))).join(" | ")
  );
  const declarados = ler("lib/analytics.ts");
  for (const ev of ["tdee_calculator_view", "tdee_calculator_complete", "tdee_activity_change", "tdee_methodology_open", "tdee_deficit_click", "tdee_macros_click", "tdee_article_click"]) {
    ok(`evento declarado: ${ev}`, declarados.includes(`"${ev}"`));
  }
}

console.log("\n" + "=".repeat(64) + "\nA PONTE PARA O DÉFICIT\n" + "=".repeat(64));

/** consomeDadosCorporais com storage simulado: valida campo a campo. */
{
  const store = new Map<string, string>();
  (globalThis as { sessionStorage?: unknown }).sessionStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  };
  const LIMITES = { pesoMin: 30, pesoMax: 300, alturaMin: 120, alturaMax: 230, idadeMin: 14, idadeMax: 100, niveis: NIVEIS.map((n) => n.id) };
  const poe = (v: unknown) => store.set(PONTE.dados, JSON.stringify(v));

  poe({ peso: 80, altura: 175, idade: 35, sexo: "masculino", nivel: "moderado" });
  const bom = consomeDadosCorporais(PONTE.dados, LIMITES);
  ok("pacote válido atravessa inteiro", bom !== null && bom.peso === 80 && bom.nivel === "moderado");
  ok("ler apagou a chave", store.has(PONTE.dados) === false);

  poe({ peso: 9999, altura: 175, idade: 35, sexo: "masculino", nivel: "moderado" });
  ok("peso absurdo invalida o pacote inteiro", consomeDadosCorporais(PONTE.dados, LIMITES) === null);
  poe({ peso: 80, altura: 175, idade: 35, sexo: "outro", nivel: "moderado" });
  ok("sexo fora do enum invalida", consomeDadosCorporais(PONTE.dados, LIMITES) === null);
  poe({ peso: 80, altura: 175, idade: 35, sexo: "masculino", nivel: "superatleta" });
  ok("nível desconhecido invalida", consomeDadosCorporais(PONTE.dados, LIMITES) === null);
  store.set(PONTE.dados, "{corrompido");
  ok("JSON corrompido não quebra — vira null", consomeDadosCorporais(PONTE.dados, LIMITES) === null);
  delete (globalThis as { sessionStorage?: unknown }).sessionStorage;
}

{
  const deficit = semComentarios(ler("components/calorias/CalculadoraDeficit.tsx"));
  ok("o déficit consome o pacote e valida com os limites dele", /consomeDadosCorporais\(PONTE\.dados/.test(deficit) && /pesoMin: PESO_MIN/.test(deficit));
  ok("o déficit anuncia a origem dos dados", /veioDaTdee/.test(deficit) && /Calculadora de TMB/.test(deficit));
  ok("a gravação na TDEE está dentro do onClick", /onClick=\{\(\) => \{[\s\S]{0,400}?guarda\(\s*PONTE\.dados/.test(semComentarios(ler("components/tdee/CalculadoraTDEE.tsx"))));
}

console.log("\n" + "=".repeat(64) + "\nSEO E ECOSSISTEMA\n" + "=".repeat(64));

{
  const pagina = ler("app/ferramentas/calculadora-tmb-tdee/page.tsx");
  ok("canonical para ela mesma", pagina.includes("canonical: `${SITE_URL}/ferramentas/calculadora-tmb-tdee`"));
  ok("H1 e openGraph declarados", /<h1/.test(pagina) && /openGraph/.test(pagina));
  ok("BreadcrumbList, sem FAQPage nem rating inventado", /BreadcrumbList/.test(pagina) && !/FAQPage|AggregateRating/.test(pagina));
  ok("tem conteúdo editorial de verdade (4+ h2)", (pagina.match(/<h2/g) ?? []).length >= 4);
  ok("está no sitemap", ler("app/sitemap.ts").includes("/ferramentas/calculadora-tmb-tdee"));
  ok("está na central /ferramentas (card + ItemList)", (ler("app/ferramentas/page.tsx").match(/calculadora-tmb-tdee/g) ?? []).length >= 2);
}

/** Os artigos migrados: uma ferramenta por artigo, sem sobreposição. */
{
  const slugs = new Set(blogPosts.map((p) => p.slug));
  for (const s of ARTIGOS_COM_CALCULADORA_TDEE) ok(`artigo do registro existe: ${s}`, slugs.has(s));
  const sobrepostos = ARTIGOS_COM_CALCULADORA_TDEE.filter((s) => calorias.ARTIGOS_COM_CALCULADORA_DEFICIT.includes(s));
  ok("nenhum artigo aparece nos dois registros (TDEE herdou os dois de gasto)", sobrepostos.length === 0, sobrepostos.join(", "));
  const blog = ler("app/blog/[slug]/page.tsx");
  ok("o blog renderiza a TDEE nos artigos dela", /ARTIGOS_COM_CALCULADORA_TDEE/.test(blog) && /CalculadoraTDEE placement=\{post\.slug\}/.test(blog));
}

console.log("\n" + "=".repeat(64) + (falhas === 0 ? "\nTODOS OS TESTES PASSARAM" : `\n${falhas} TESTE(S) FALHARAM`));
if (falhas > 0) process.exit(1);
