/**
 * Testes das Fontes Preferidas do Google.
 *
 * As regras deste recurso não são técnicas, são de honestidade — e é
 * exatamente por isso que precisam de teste. Nada aqui quebra o build
 * naturalmente: uma copy prometendo primeiro lugar renderiza igual, um evento
 * chamado "adicionado" sobe para o GA4 igual, um domínio de preview funciona
 * igual em desenvolvimento. O erro só aparece depois, como dado falso ou como
 * promessa que não podemos cumprir.
 */

import * as fs from "fs";

const COMPONENTE = "components/google/PreferredSourceCTA.tsx";
const ANALYTICS = "lib/analytics.ts";
const TEMPLATE = "app/blog/[slug]/page.tsx";

const componente = fs.readFileSync(COMPONENTE, "utf8");
const analytics = fs.readFileSync(ANALYTICS, "utf8");
const template = fs.readFileSync(TEMPLATE, "utf8");

/**
 * Comentários fora.
 *
 * A primeira versão deste teste varria o arquivo inteiro e reprovava o próprio
 * componente — porque os comentários dizem "não prometer ranking", "não
 * recriar modal", "nunca escrever adicionado". Um teste que pune a
 * documentação da regra empurra quem vier depois a apagar a explicação para
 * fazer o teste passar, que é o oposto do objetivo. O que interessa é o que
 * chega ao leitor e o que sobe para o GA4.
 */
const semComentarios = (t: string) =>
  t.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");

const codigo = semComentarios(componente);
const codigoAnalytics = semComentarios(analytics);

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};

console.log("\n" + "=".repeat(60) + "\nNENHUMA PROMESSA DE RANKING\n" + "=".repeat(60));

/**
 * O recurso é de retenção, não de ranqueamento. Não temos base para afirmar
 * que ele melhora posição, autoridade ou destaque — e a primeira frase que
 * afirmar isso transforma um recurso honesto em promessa falsa.
 */
const PROIBIDO: [RegExp, string][] = [
  [/primeiro lugar/i, "posição no Google"],
  [/\branking\b|ranquea/i, "ranqueamento"],
  [/aparecer? (sempre|em primeiro)/i, "garantia de aparição"],
  [/nunca mais perca/i, "promessa absoluta"],
  [/sempre ver (meus|nossos)/i, "promessa absoluta"],
  [/garant(e|ia|ido)/i, "garantia"],
  [/mais autoridade|autoridade de dom[ií]nio/i, "autoridade de domínio"],
  [/algoritmo/i, "explicação de algoritmo"],
  [/parceir[oa] d[oa] google|parceria com o google/i, "parceria inexistente"],
  [/exclusiv[oa]/i, "exclusividade inexistente"],
];

for (const [re, oque] of PROIBIDO) {
  const achou = re.test(codigo);
  ok(`a copy não fala de ${oque}`, !achou, `padrão encontrado: ${re}`);
}

/** O teto do que podemos afirmar. */
ok(
  "a copy usa formulação segura (\"com mais facilidade\")",
  /com mais facilidade|mais facilmente/i.test(codigo)
);

console.log("\n" + "=".repeat(60) + "\nNENHUM ESTADO INVENTADO\n" + "=".repeat(60));

/**
 * O site não recebe confirmação de que a pessoa concluiu a seleção do lado do
 * Google. Qualquer "Adicionado!" seria mentira, e qualquer evento chamado
 * "added" seria dado falso alimentando decisão futura.
 */
ok(
  "não existe evento de \"adicionado\"",
  !/preferred_source_added|preferred_source_success|preferred_source_complete/.test(codigoAnalytics + codigo),
  "o site não sabe se a seleção foi concluída — esse evento seria dado inventado"
);
ok(
  "não existe mensagem de confirmação própria",
  !/Adicionado!|Pronto!|Feito!|Você já é|agora você segue/i.test(codigo)
);

ok("o evento de view está declarado", /"preferred_source_cta_view"/.test(analytics));
ok("o evento de interação está declarado", /"preferred_source_cta_interaction"/.test(analytics));

/** View precisa significar "entrou na tela", não "existe no HTML". */
ok(
  "a view usa IntersectionObserver",
  /IntersectionObserver/.test(componente),
  "sem isso a métrica contaria carregamento de HTML como visualização"
);

console.log("\n" + "=".repeat(60) + "\nIMPLEMENTAÇÃO OFICIAL\n" + "=".repeat(60));

ok(
  "usa a biblioteca oficial do Google",
  /news\.google\.com\/swg\/js\/v1\/publisher\.js/.test(componente)
);
ok(
  "usa o atributo oficial do botão",
  /google-add-preferred-source-btn/.test(componente)
);
ok(
  "o script tem id fixo (evita duplicação)",
  /const SCRIPT_ID = "/.test(componente) && /<Script id=\{SCRIPT_ID\}/.test(componente),
  "sem id, o componente em duas posições carregaria a biblioteca duas vezes"
);
ok(
  "o script não é bloqueante",
  /strategy="lazyOnload"|strategy="afterInteractive"/.test(componente)
);

/**
 * Não recriar o fluxo do Google: nada de modal próprio, estrela falsa ou
 * simulação da interface dele.
 */
ok(
  "não recria a interface do Google",
  !/<Modal|StarIcon|fakeGoogle/i.test(codigo)
);

console.log("\n" + "=".repeat(60) + "\nDOMÍNIO E FALLBACK\n" + "=".repeat(60));

ok(
  "o domínio é o canônico de produção",
  /const DOMINIO = "montinhopersonal\.com\.br"/.test(componente)
);
ok(
  "nenhum domínio de desenvolvimento ou preview",
  !/localhost|vercel\.app|127\.0\.0\.1|\.local\b/.test(componente),
  "o botão apontaria para o domínio errado em produção"
);
ok(
  "o domínio não tem caminho nem www",
  !/montinhopersonal\.com\.br\/|www\.montinhopersonal/.test(
    componente.replace(/https:\/\/www\.google\.com[^`"']*/g, "")
  ),
  "a preferência é por domínio: caminho e www são descartados pelo Google"
);
ok(
  "o deeplink oficial existe como fallback",
  /google\.com\/preferences\/source\?q=/.test(componente)
);
ok(
  "o fallback aparece quando o botão não renderiza",
  /setFalhou\(true\)/.test(componente),
  "sem isso, script bloqueado deixaria uma caixa vazia na página"
);
ok(
  "nenhum erro técnico é mostrado ao usuário",
  !/publisher\.js failed|erro ao carregar|Error:/i.test(codigo)
);

console.log("\n" + "=".repeat(60) + "\nHIERARQUIA NA PÁGINA\n" + "=".repeat(60));

/**
 * O bloco tem de vir DEPOIS do CTA comercial. Se subir, passa a competir com
 * a conversão — e retenção nunca deve custar conversão.
 */
const posCta = template.indexOf("Quer transformar seu corpo?");
const posPreferred = template.indexOf("<PreferredSourceCTA");
ok(
  "o bloco vem depois do CTA comercial",
  posCta > 0 && posPreferred > posCta,
  "subiu na página e passou a competir com a conversão"
);
ok(
  "aparece uma vez só por artigo",
  (template.match(/<PreferredSourceCTA/g) ?? []).length === 1
);

/** Reserva de espaço: o botão chega depois e não pode empurrar o conteúdo. */
ok(
  "reserva espaço para o botão (CLS)",
  /min-h-\[\d+px\]/.test(componente)
);

/** Alvo de toque mínimo no mobile. */
ok(
  "o fallback tem alvo de toque adequado",
  /min-h-\[44px\]/.test(componente)
);

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM\n" : `\n${falhas} TESTE(S) FALHARAM\n`);
process.exit(falhas === 0 ? 0 : 1);
