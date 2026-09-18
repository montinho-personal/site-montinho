/**
 * SEO das páginas de ferramenta.
 *   npx tsx scripts/ferramentas-seo-test.ts
 *
 * O que se protege:
 *  1. Título e description dentro do que o Google mostra — o mesmo limite que
 *     scripts/seo-serp-test.ts aplica aos artigos, que as ferramentas nunca
 *     tiveram.
 *  2. FAQPage descrevendo APENAS pergunta que está escrita na página. Marcar
 *     conteúdo invisível é violação da diretriz do Google, e é o motivo mais
 *     comum de perder o rich result inteiro — falha silenciosa, que só
 *     aparece semanas depois no Search Console.
 *  3. Nada de AggregateRating inventado: não há avaliação de usuário em
 *     ferramenta nenhuma, e dado falso derruba todo o bloco.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));

const raiz = process.cwd();
const paginas = [
  ...readdirSync(join(raiz, "app/ferramentas"))
    .map((d) => join("app/ferramentas", d, "page.tsx"))
    .filter((p) => existsSync(join(raiz, p))),
  "app/diagnostico/page.tsx",
  "app/treino-para-minha-rotina/page.tsx",
  "app/pergunte-ao-montinho/page.tsx",
].filter((p) => existsSync(join(raiz, p)));

/*
 * Descriptions longas que JÁ ESTAVAM no ar quando esta regra nasceu.
 *
 * Não estão aqui por preguiça. Description mexe em CTR, e o efeito só
 * aparece semanas depois no Search Console — reescrever doze de uma vez é
 * exatamente o caso em que o AGENTS.md manda dividir, porque um lote grande
 * impede saber qual mudança causou o quê. Cada uma sai desta lista quando
 * for reescrita, com o estado anterior registrado.
 *
 * A lista só encolhe. Página nova entra já dentro da regra.
 */
const DESCRIPTION_LONGA_PENDENTE = new Set([
  "/ferramentas/calculadora-1rm",
  "/ferramentas/calculadora-deficit-calorico",
  "/ferramentas/calculadora-macros",
  "/ferramentas/calculadora-tmb-tdee",
  "/ferramentas/calculadora-volume-treino",
  "/ferramentas/conversor-mg-ml-u100",
  "/ferramentas/monte-seu-cardapio",
  "/ferramentas/teste-mobilidade",
  "/ferramentas/zonas-de-frequencia-cardiaca",
  "/diagnostico",
  "/treino-para-minha-rotina",
  "/pergunte-ao-montinho",
]);

bloco("1. TÍTULO E DESCRIPTION");
for (const p of paginas) {
  const s = readFileSync(join(raiz, p), "utf8");
  const rota = p.replace(/^app/, "").replace(/\/page\.tsx$/, "");
  const t = s.match(/^\s*title:\s*"([^"]+)"/m)?.[1] ?? "";
  const d = s.match(/^\s*description:\s*\n?\s*"([^"]+)"/m)?.[1] ?? "";
  ok(`${rota}: tem título`, t.length > 0);
  ok(`${rota}: título com ${t.length} caracteres (≤ 62)`, t.length <= 62, t);
  // 160 é onde o Google corta. Abaixo de 120 sobra espaço que outro usaria.
  const pendente = DESCRIPTION_LONGA_PENDENTE.has(rota);
  if (pendente) {
    console.log(`  pend    ${rota}: description com ${d.length} — na fila de reescrita`);
    // A pendência não pode virar desculpa permanente: quando a description
    // for corrigida, o nome tem de sair da lista, e este teste avisa.
    ok(`${rota}: ainda precisa da dispensa`, d.length > 160,
      "a description já está dentro da regra — tire a rota de DESCRIPTION_LONGA_PENDENTE");
  } else {
    ok(`${rota}: description com ${d.length} (120–160)`, d.length >= 120 && d.length <= 160, d);
  }
  ok(`${rota}: description não termina em reticências`, !/\.\.\.$|…$/.test(d.trim()), d.slice(-24));
}

bloco("2. DADOS ESTRUTURADOS HONESTOS");
for (const p of paginas) {
  const s = readFileSync(join(raiz, p), "utf8");
  const rota = p.replace(/^app/, "").replace(/\/page\.tsx$/, "");
  ok(`${rota}: sem AggregateRating inventado`, !/"@type":\s*"AggregateRating"/.test(s));
  ok(`${rota}: sem Review inventado`, !/"@type":\s*"Review"/.test(s));

  if (!/"@type":\s*"FAQPage"/.test(s)) continue;
  /*
   * A página que declara FAQPage tem de renderizar as perguntas — e das
   * MESMAS linhas. O que se verifica é a origem: mainEntity mapeia uma lista,
   * e essa lista tem de ser mapeada de novo dentro do JSX. Schema escrito à
   * mão em paralelo ao texto é o que envelhece torto: alguém corrige a
   * resposta visível e o schema segue dizendo a antiga.
   *
   * O nome da lista não importa — a primeira versão deste teste exigia
   * "PERGUNTAS" e reprovava o conversor, que fazia tudo certo com uma lista
   * chamada "faq". Teste que só aceita a implementação de quem o escreveu
   * não está medindo a regra, está medindo o autor.
   */
  const lista = s.match(/mainEntity:\s*([A-Za-z_$][\w$]*)\.map/)?.[1];
  ok(`${rota}: FAQPage sai de uma lista`, !!lista,
    "o schema e o texto visível têm de vir do mesmo array, senão um muda e o outro não");
  if (lista) {
    /*
     * O que importa é o FATO — a mesma lista chega ao HTML —, não a FORMA.
     * A de proteína faz PERGUNTAS.map() no JSX; o conversor entrega faq a um
     * componente <FAQ itens={faq}>. As duas estão certas, e um teste que
     * exigisse ".map duas vezes" reprovaria a segunda por escrever diferente.
     * Então se procura a lista dentro do corpo do componente exportado.
     */
    const corpo = s.slice(s.search(/export default function/));
    const usada = new RegExp(`\\b${lista}\\b`).test(corpo);
    ok(`${rota}: a lista "${lista}" chega ao HTML`, usada,
      "declarar FAQPage sem mostrar as perguntas é o que derruba o rich result");
  }
}

bloco("2B. TODA FERRAMENTA SE DECLARA APLICATIVO");
/*
 * As treze são aplicativos de navegador: a pessoa preenche, o resultado sai
 * na hora, nada é cobrado. Sem SoftwareApplication elas se apresentam ao
 * Google como página comum, disputando com artigo em vez de com ferramenta.
 *
 * Exigir o gerador comum, e não o tipo escrito à mão, é de propósito: o
 * bloco tem oito campos iguais em todas, e colado treze vezes o dia em que o
 * Google mudar uma exigência vira treze edições — a décima terceira é a que
 * alguém esquece.
 */
for (const p of paginas) {
  const s = readFileSync(join(raiz, p), "utf8");
  const rota = p.replace(/^app/, "").replace(/\/page\.tsx$/, "");
  const declara = /"@type":\s*"SoftwareApplication"/.test(s) || /aplicativoSchema\(/.test(s);
  ok(`${rota}: declara SoftwareApplication`, declara);
  ok(`${rota}: o schema chega ao HTML`, /JSON\.stringify\((?:appSchema|aplicativoSchema)\)/.test(s),
    "declarar a const e esquecer a tag <script> deixa o schema invisível");
}

bloco("3. A CALCULADORA DE PROTEÍNA NÃO CANIBALIZA O ARTIGO");
/*
 * As duas páginas disputariam a mesma busca se a ferramenta virasse um
 * resumo do artigo. A regra do AGENTS.md é conferir ANTES de escrever; este
 * teste é a mesma conferência, feita toda vez.
 */
const proteina = readFileSync(join(raiz, "app/ferramentas/calculadora-de-proteina/page.tsx"), "utf8");
const h2s = [...proteina.matchAll(/style=\{h\}>\s*([\s\S]*?)<\/h2>/g)]
  .map((m) => m[1].replace(/\s+/g, " ").trim().toLowerCase());
ok("a ferramenta tem H2 suficiente para ranquear", h2s.length >= 6, String(h2s.length));
// Títulos que são do artigo, não da ferramenta.
const doArtigo = ["por que a proteína é tão importante", "whey protein é obrigatório", "creatina substitui", "bulking", "cutting", "iniciantes, intermediários"];
const invasores = h2s.filter((t) => doArtigo.some((a) => t.includes(a)));
ok("nenhum H2 repete assunto do artigo", invasores.length === 0, invasores.join(" | "));
ok("a ferramenta aponta para o artigo", /quanta-proteina-por-dia-para-ganhar-massa-muscular/.test(proteina));
ok("tem tabela por peso (o robô não digita peso)", /PESOS_TABELA/.test(proteina) && /<table/.test(proteina));

console.log("\n" + "=".repeat(64));
console.log(falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} TESTE(S) FALHARAM`);
process.exit(falhas === 0 ? 0 : 1);
