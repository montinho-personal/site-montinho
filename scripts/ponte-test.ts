/**
 * Testes da ponte entre ferramentas.
 *
 * A ponte é a única coisa que qualquer das cinco calculadoras grava, então
 * ela concentra o risco de privacidade do ecossistema inteiro. Três invariantes
 * seguram tudo:
 *
 * 1. Nada viaja pela URL — peso e caloria em querystring seriam copiados,
 *    compartilhados e registrados em log de referrer.
 * 2. Nada é gravado sem clique. Digitar não pode guardar dado.
 * 3. Ler apaga. O valor preenche um campo uma vez e some.
 *
 * O teste roda sobre o CÓDIGO das ferramentas, não sobre o navegador: é onde
 * dá para garantir que a próxima pessoa que mexer não quebre a regra sem
 * perceber.
 */

import * as fs from "fs";
import { PONTE } from "../lib/ferramentas/ponte";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};

const semComentarios = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const ler = (p: string) => semComentarios(fs.readFileSync(p, "utf8"));

const ponte = fs.readFileSync("lib/ferramentas/ponte.ts", "utf8");
const deficit = ler("components/calorias/CalculadoraDeficit.tsx");
const macros = ler("components/macros/CalculadoraMacros.tsx");
const proteina = ler("components/proteina/CalculadoraProteina.tsx");
const volume = ler("components/volume/CalculadoraVolume.tsx");
const onerm = ler("components/onerm/CalculadoraOneRM.tsx");

const tdee = ler("components/tdee/CalculadoraTDEE.tsx");
const linkComparar = ler("components/alimentos/LinkComparar.tsx");
const comparador = ler("components/alimentos/ComparadorAlimentos.tsx");
const buscaAlimentos = ler("components/alimentos/BuscaAlimentos.tsx");

const COMPONENTES: [string, string][] = [
  ["TMB/TDEE", tdee],
  ["Déficit", deficit],
  ["Macros", macros],
  ["Proteína", proteina],
  ["Volume", volume],
  ["1RM", onerm],
  ["Link comparar", linkComparar],
  ["Comparador", comparador],
  ["Busca de alimentos", buscaAlimentos],
];

console.log("\n" + "=".repeat(64) + "\nA MECÂNICA MORA NUM LUGAR SÓ\n" + "=".repeat(64));

/**
 * Cinco: kcal, peso, exercício, o pacote de dados corporais TMB→Déficit e o
 * alimento que vai da tabela para o comparador. O número é travado para uma
 * chave nova nunca entrar sem passar por esta suíte.
 *
 * A do alimento é a única que não carrega dado do corpo de ninguém — é o
 * slug de uma página pública. Mesmo assim atravessa pela ponte, e não por
 * querystring, porque URL com parâmetro é URL que alguém indexa e
 * compartilha, e o comparador tem canonical próprio.
 */
ok("existem exatamente cinco travessias declaradas", Object.keys(PONTE).length === 5, Object.keys(PONTE).join(", "));
ok("toda chave tem prefixo do site", Object.values(PONTE).every((v) => v.startsWith("montinho:ponte:")));
ok("as chaves são únicas", new Set(Object.values(PONTE)).size === Object.keys(PONTE).length);

/**
 * Nenhum componente pode falar com sessionStorage direto. Cada cópia do
 * try/catch é uma chance de alguém esquecer o removeItem ou o catch.
 */
for (const [nome, src] of COMPONENTES) {
  ok(`${nome} não usa sessionStorage direto`, !/sessionStorage/.test(src), "tem que passar por lib/ferramentas/ponte.ts");
}
for (const lib of ["lib/macros.ts", "lib/calorias.ts", "lib/onerm.ts", "lib/treino/volume.ts", "lib/proteina.ts"]) {
  ok(`${lib} não usa sessionStorage direto`, !/sessionStorage/.test(ler(lib)));
}

console.log("\n" + "=".repeat(64) + "\nNADA VIAJA PELA URL\n" + "=".repeat(64));

for (const [nome, src] of COMPONENTES) {
  ok(
    `${nome} não lê parâmetro de URL`,
    !/useSearchParams|searchParams|location\.search|URLSearchParams/.test(src),
    "dado corporal em querystring é copiado, compartilhado e registrado em log"
  );
}

console.log("\n" + "=".repeat(64) + "\nGRAVAR SÓ POR CLIQUE\n" + "=".repeat(64));

/**
 * Toda chamada de `guarda(` precisa estar dentro de um onClick. A checagem
 * pega o trecho entre o onClick e o fim do handler.
 */
const GRAVADORES: [string, string, string][] = [
  ["TMB/TDEE → Déficit", tdee, "guarda("],
  ["TMB/TDEE → Macros", tdee, "guardaKcalParaMacros"],
  ["Déficit → Macros", deficit, "guardaKcalParaMacros"],
  ["Macros → Proteína", macros, "guardaPesoParaProteina"],
  ["Volume → 1RM", volume, "guarda(PONTE.exercicio"],
  ["Alimento → Comparador", linkComparar, "guarda(PONTE.alimento"],
];
for (const [nome, src, fn] of GRAVADORES) {
  const chamadas = src.split(fn).length - 1;
  ok(`${nome}: a gravação existe`, chamadas >= 1, `${chamadas} ocorrência(s)`);
  const dentroDeClick = new RegExp(`onClick=\\{[\\s\\S]{0,600}?${fn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(src);
  ok(`${nome}: a gravação está dentro de um onClick`, dentroDeClick, "gravar sem ação explícita muda o contrato de privacidade");
}

/** Nenhum componente pode gravar dentro de useEffect — isso é passivo. */
for (const [nome, src] of COMPONENTES) {
  const efeitos = src.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[[^\]]*\]\);/g) ?? [];
  const grava = efeitos.some((e) => /guarda\(|guardaKcal|guardaPeso/.test(e));
  ok(`${nome} não grava dentro de useEffect`, !grava, "efeito grava sem a pessoa pedir");
}

console.log("\n" + "=".repeat(64) + "\nLER APAGA\n" + "=".repeat(64));

ok("consome() remove a chave", /removeItem\(chave\)/.test(ponte));
ok("consomeNumero usa consome (herda o remove)", /consomeNumero[\s\S]*?consome\(chave\)/.test(ponte));
/**
 * Toda função que TOCA o storage precisa de catch. São exatamente duas —
 * guarda e consome; consomeNumero delega para consome e por isso não tem a
 * sua. A checagem é por função, não por contagem solta, para não passar por
 * acaso se alguém adicionar um catch em outro lugar.
 */
const funcoesComStorage = (ponte.match(/export function \w+[\s\S]*?\n\}/g) ?? []).filter((f) =>
  /sessionStorage/.test(f)
);
ok("duas funções tocam o storage (consomeDadosCorporais e consomeNumero delegam)", funcoesComStorage.length === 2, String(funcoesComStorage.length));
ok("consomeDadosCorporais valida campo a campo", /numOk\(d\.peso|Number\.isFinite\(v\) && v >= min/.test(ponte) && /limites\.niveis\.includes\(d\.nivel\)/.test(ponte));
ok(
  "toda função que toca o storage tem catch",
  funcoesComStorage.every((f) => /catch\s*\{/.test(f)),
  "storage bloqueado (modo privado) não pode quebrar ferramenta"
);
ok("não existe getItem sem removeItem em volta", (ponte.match(/getItem/g) ?? []).length === (ponte.match(/removeItem/g) ?? []).length);

/** Quem consome tem que validar o que recebeu — sessionStorage é editável. */
ok("o peso recebido é validado por faixa", /consomeNumero\(PONTE\.peso, PESO_MIN, PESO_MAX\)/.test(proteina));

/**
 * O comparador recebe um slug, e slug não tem faixa numérica para validar —
 * a conferência é a existência no índice da própria página. Sem ela, um
 * valor qualquer no storage viraria um alimento fantasma na tela.
 */
ok(
  "o alimento recebido é conferido contra o índice",
  /consome\(PONTE\.alimento\)/.test(comparador) && /porSlug\.get\(slug\)/.test(comparador) && /if \(!achado\) return;/.test(comparador),
  "quem recebe não confia, confere"
);

/**
 * O ponto de partida da travessia. Os dois lugares onde a pessoa já tem um
 * alimento escolhido precisam oferecer a passagem — senão a ponte existe no
 * código e não existe na tela, que foi exatamente o que aconteceu com as
 * medidas caseiras.
 */
for (const [nome, src] of [["página do alimento", ler("app/alimentos/[slug]/page.tsx")], ["busca da tabela", buscaAlimentos]] as [string, string][]) {
  ok(`${nome} oferece o comparador com o alimento junto`, /<LinkComparar[\s\S]{0,200}?slug=/.test(src));
}
ok("a caloria recebida é validada por faixa", /consomeNumero\(PONTE\.kcal, KCAL_MIN, KCAL_MAX\)/.test(ler("lib/macros.ts")));

console.log("\n" + "=".repeat(64) + "\nAS TRÊS TRAVESSIAS FUNCIONAM PONTA A PONTA\n" + "=".repeat(64));

const travessias: [string, string, string, string, string][] = [
  ["TMB/TDEE → Déficit", tdee, "/ferramentas/calculadora-deficit-calorico", deficit, "consomeDadosCorporais"],
  ["Déficit → Macros", deficit, "/ferramentas/calculadora-macros", macros, "consomeKcalDeDeficit"],
  ["Macros → Proteína", macros, "/ferramentas/calculadora-de-proteina", proteina, "PONTE.peso"],
  ["Volume → 1RM", volume, "/ferramentas/calculadora-1rm", onerm, "PONTE.exercicio"],
];
for (const [nome, origem, href, destino, leitura] of travessias) {
  ok(`${nome}: a origem linka o destino`, origem.includes(href));
  ok(`${nome}: o destino lê o valor`, destino.includes(leitura));
}

/** O usuário precisa saber que o campo veio preenchido de outro lugar. */
ok("Macros avisa que a caloria veio do déficit", /trazidas da sua calculadora de déficit/i.test(macros));
ok("Proteína avisa que o peso veio dos macros", /trazido da sua calculadora de macros/i.test(proteina));
ok("1RM avisa que o exercício veio do volume", /trazido da sua análise de volume/i.test(onerm));

/** Digitar por cima tem que desfazer o aviso — senão ele mente. */
ok("Macros limpa o aviso ao editar", /setVeioDoDeficit\(false\)/.test(macros));
ok("Proteína limpa o aviso ao editar", /setVeioDeMacros\(false\)/.test(proteina));

/**
 * O 1RM aceita qualquer nome da base de volume (120 exercícios), e não só os
 * seis do select — senão a travessia perderia o dado justamente nos casos
 * mais específicos.
 */
ok(
  "o 1RM aceita exercício fora da sua lista fixa",
  /exercicioExterno && !EXERCICIOS\.includes/.test(onerm),
  "sem isso, 'Cadeira extensora' viraria opção inexistente e sumiria"
);

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM\n" : `\n${falhas} TESTE(S) FALHARAM\n`);
process.exit(falhas === 0 ? 0 : 1);
