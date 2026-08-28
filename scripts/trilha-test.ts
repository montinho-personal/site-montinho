/**
 * Testes das trilhas — o caminho explícito entre as ferramentas.
 *
 * O risco aqui é o de toda navegação declarada à mão: a trilha apontar para
 * página que não existe, uma página do caminho não mostrar a trilha, ou a
 * ordem contar uma história diferente da dependência real dos dados. A
 * trilha só tem valor se for verdadeira em todas as pontas.
 */

import * as fs from "fs";
import { TRILHAS, encontraPasso } from "../lib/ferramentas/trilha";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const ler = (p: string) => fs.readFileSync(p, "utf8");

console.log("\n" + "=".repeat(64) + "\nAS TRILHAS SÃO VERDADEIRAS\n" + "=".repeat(64));

/** Todo passo aponta para uma página que existe de verdade. */
const paginaDe = (href: string) => `app${href}/page.tsx`;
for (const id of ["dieta", "treino"] as const) {
  for (const p of TRILHAS[id].passos) {
    ok(`[${id}] a página do passo "${p.nome}" existe: ${p.href}`, fs.existsSync(paginaDe(p.href)));
  }
}

ok("nenhum passo se repete entre as trilhas", (() => {
  const todos = Object.values(TRILHAS).flatMap((t) => t.passos.map((p) => p.href));
  return new Set(todos).size === todos.length;
})());

/**
 * A ordem da trilha da dieta é a ordem da dependência dos dados: gasto
 * alimenta meta, meta alimenta macros, macros alimentam cardápio. Se alguém
 * reordenar, o texto "cada passo calcula o número que o próximo usa" vira
 * mentira.
 */
ok(
  "dieta: gasto → meta → macros → cardápio, nesta ordem",
  TRILHAS.dieta.passos.map((p) => p.href).join(" ") ===
    "/ferramentas/calculadora-tmb-tdee /ferramentas/calculadora-deficit-calorico /ferramentas/calculadora-macros /ferramentas/monte-seu-cardapio"
);
ok(
  "treino: diagnóstico → rotina → volume → carga → execução",
  TRILHAS.treino.passos.map((p) => p.nome).join(" ") === "Diagnóstico Rotina Volume Carga Execução"
);
ok("todo passo tem a pergunta que responde", Object.values(TRILHAS).every((t) => t.passos.every((p) => p.pergunta.endsWith("?"))));

console.log("\n" + "=".repeat(64) + "\nTODA PÁGINA DO CAMINHO MOSTRA O CAMINHO\n" + "=".repeat(64));

for (const id of ["dieta", "treino"] as const) {
  for (const p of TRILHAS[id].passos) {
    const src = ler(paginaDe(p.href));
    ok(
      `[${id}] ${p.nome} renderiza a trilha apontando para si`,
      src.includes(`<Trilha atual="${p.href}" />`),
      "página do caminho sem a trilha deixa a pessoa perdida de novo"
    );
  }
}

/** encontraPasso: o helper que o componente usa. */
ok("encontraPasso acha o meio da trilha", JSON.stringify(encontraPasso("/ferramentas/calculadora-macros")) === JSON.stringify({ trilha: "dieta", indice: 2 }));
ok("encontraPasso devolve null fora da trilha", encontraPasso("/ferramentas/calculadora-de-proteina") === null);

/** O componente: passo atual marcado, próximo anunciado, zero JS. */
{
  const comp = ler("components/ferramentas/Trilha.tsx");
  ok("o passo atual usa aria-current e não é link", /aria-current="step"/.test(comp));
  ok("o próximo passo aparece com a pergunta dele", /Próximo passo/.test(comp) && /proximo\.pergunta/.test(comp));
  ok("é componente de servidor (sem use client, sem hooks)", !/"use client"|useState|useEffect/.test(comp));
  ok("a trilha some na impressão", /print:hidden/.test(comp));
}

console.log("\n" + "=".repeat(64) + "\nA CENTRAL ENSINA O CAMINHO\n" + "=".repeat(64));

{
  const hub = ler("app/ferramentas/page.tsx");
  ok("a central tem a seção 'não sabe por onde começar'", /Não sabe por onde começar/.test(hub) && /TRILHAS/.test(hub));
  ok("a seção explica que os dados atravessam sozinhos", /sem redigitar/.test(hub));
}

console.log("\n" + "=".repeat(64) + "\nO PRÓXIMO PASSO EM DESTAQUE NOS MACROS\n" + "=".repeat(64));

/**
 * O pedido que originou tudo isto: depois de calcular os macros, a ligação
 * com o cardápio tem que estar em DESTAQUE, não escondida numa lista de
 * links. E a travessia leva meta + peso, gravados só no clique.
 */
{
  const macros = ler("components/macros/CalculadoraMacros.tsx").replace(/\/\*[\s\S]*?\*\//g, "");
  ok("existe o bloco 'Próximo passo' com CTA para o cardápio", /Próximo passo/.test(macros) && /Montar meu cardápio com esses macros/.test(macros));
  ok(
    "o CTA grava meta e peso dentro do onClick",
    /onClick=\{\(\) => \{[\s\S]{0,400}?guardaKcalParaMacros\(kcal\);[\s\S]{0,200}?guardaPesoParaProteina\(peso\);[\s\S]{0,200}?macro_cardapio_click/.test(macros)
  );
  ok("o evento macro_cardapio_click está declarado", ler("lib/analytics.ts").includes('"macro_cardapio_click"'));
}

console.log("\n" + "=".repeat(64) + "\nO PRÓXIMO PASSO TAMBÉM É CLARO NO DÉFICIT\n" + "=".repeat(64));

/**
 * Dois links de mesmo peso ("macros" e "cardápio") deixavam a pessoa sem
 * saber qual era O caminho. A hierarquia agora segue a trilha: macros é o
 * botão primário (passo 3), cardápio é o atalho secundário explicado.
 */
{
  const deficit = ler("components/calorias/CalculadoraDeficit.tsx").replace(/\/\*[\s\S]*?\*\//g, "");
  ok("o déficit tem o bloco 'Próximo passo' com macros como primário", /Próximo passo/.test(deficit) && /passo 3 do caminho/.test(deficit));
  const iPrimario = deficit.indexOf("Distribuir minhas calorias em macros");
  const iAtalho = deficit.indexOf("pule direto para o cardápio");
  ok("o cardápio é atalho secundário, depois do primário", iPrimario > -1 && iAtalho > iPrimario);
  ok("o atalho explica por que pular é seguro", /calcula os macros por dentro/.test(deficit));
}

console.log("\n" + "=".repeat(64) + (falhas === 0 ? "\nTODOS OS TESTES PASSARAM" : `\n${falhas} TESTE(S) FALHARAM`));
if (falhas > 0) process.exit(1);
