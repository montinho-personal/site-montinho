/**
 * Testes do conteúdo para lead adiado.
 *   npx tsx scripts/crm-conteudo-test.ts
 *
 * O que se protege: (1) o teto de 3 e o intervalo de 20 dias, que são o que
 * separa "presença" de perseguição; (2) quem nunca pode receber; (3) o token
 * não deduzível; (4) o destino sempre dentro do site — um /c/ que redireciona
 * para fora é um domínio confiável virando ferramenta de golpe.
 */
import {
  INTERVALO_DIAS, JANELA_RETORNO_DIAS, MAX_CONTEUDOS, cliqueAntesDoRetorno, destinoComUtm,
  destinoValido, gerarToken, podeEnviarConteudo, proximoEnvioEm, textoDoRetorno, urlDoConteudo,
} from "../lib/crm/conteudo";
import { SITUACOES_CONTEUDO, TEXTOS } from "../lib/crm/copy-textos";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));

const AGORA = new Date("2026-10-01T15:00:00-03:00");
const diasAtras = (n: number) => new Date(AGORA.getTime() - n * 86_400_000).toISOString();

bloco("1. TETO E INTERVALO");
ok("sem envio nenhum, pode e é o primeiro", (() => {
  const v = podeEnviarConteudo([], {}, AGORA);
  return v.pode && v.numero === 1;
})());

ok(`${INTERVALO_DIAS - 1} dias depois ainda não libera`, !podeEnviarConteudo([{ enviadoEm: diasAtras(INTERVALO_DIAS - 1) }], {}, AGORA).pode);
ok(`${INTERVALO_DIAS} dias depois libera`, podeEnviarConteudo([{ enviadoEm: diasAtras(INTERVALO_DIAS) }], {}, AGORA).pode);
ok("o segundo é o número 2", (() => {
  const v = podeEnviarConteudo([{ enviadoEm: diasAtras(30) }], {}, AGORA);
  return v.pode && v.numero === 2;
})());

ok("o que falta é contado em dias, não em horas", (() => {
  const v = podeEnviarConteudo([{ enviadoEm: diasAtras(INTERVALO_DIAS - 3) }], {}, AGORA);
  return !v.pode && v.motivo.includes("3 dias");
})(), JSON.stringify(podeEnviarConteudo([{ enviadoEm: diasAtras(INTERVALO_DIAS - 3) }], {}, AGORA)));

ok("1 dia que falta vem no singular", (() => {
  const v = podeEnviarConteudo([{ enviadoEm: diasAtras(INTERVALO_DIAS - 1) }], {}, AGORA);
  return !v.pode && / 1 dia\b/.test(v.motivo) && !v.motivo.includes("1 dias");
})());

// O teto é o coração disto. Sem ele, a cada 20 dias a pessoa reaparece na
// fila para sempre — que é o laço que o MAX_FOLLOW_UPS já teve de matar uma
// vez, e o motivo pelo qual doze leads foram fechados em 28 minutos.
const tres = [{ enviadoEm: diasAtras(90) }, { enviadoEm: diasAtras(60) }, { enviadoEm: diasAtras(30) }];
ok(`${MAX_CONTEUDOS} envios fecham a porta`, !podeEnviarConteudo(tres, {}, AGORA).pode);
ok("e ela não reabre com o tempo", !podeEnviarConteudo(tres, {}, new Date("2027-12-01T12:00:00-03:00")).pode);
ok("o motivo do teto diz o número", podeEnviarConteudo(tres, {}, AGORA).pode === false && (podeEnviarConteudo(tres, {}, AGORA) as { motivo: string }).motivo.includes(String(MAX_CONTEUDOS)));

ok("envios fora de ordem não enganam o intervalo", !podeEnviarConteudo(
  [{ enviadoEm: diasAtras(2) }, { enviadoEm: diasAtras(50) }], {}, AGORA).pode);

ok("próximo envio é o último + intervalo", proximoEnvioEm("2026-10-01T00:00:00.000Z").toISOString() === "2026-10-21T00:00:00.000Z");

bloco("2. QUEM NUNCA RECEBE");
ok("quem pediu paz não recebe", !podeEnviarConteudo([], { emPaz: true }, AGORA).pode);
ok("e nem no primeiro envio", !podeEnviarConteudo([], { emPaz: true }, AGORA).pode);
ok("quem decidiu não treinar não recebe", !podeEnviarConteudo([], { motivoPerda: "decided_not_to_train" }, AGORA).pode);
// "Não é o momento" não é "não quero": perdido por outro motivo continua elegível.
ok("perdido por preço continua elegível", podeEnviarConteudo([], { motivoPerda: "price" }, AGORA).pode);
ok("lead sem motivo de perda continua elegível", podeEnviarConteudo([], { motivoPerda: null }, AGORA).pode);

bloco("3. TOKEN");
const tokens = Array.from({ length: 400 }, () => gerarToken());
ok("tem 10 caracteres", tokens.every((t) => t.length === 10));
ok("só letras e números sem ambiguidade", tokens.every((t) => /^[A-HJ-NP-Z2-9]+$/.test(t)));
ok("nada de O, 0, I ou 1", tokens.every((t) => !/[O0I1]/.test(t)));
ok("400 sorteios sem repetir", new Set(tokens).size === 400);
// Se o token saísse do id do lead, quem recebesse dois links poderia deduzir
// a regra e sondar os outros.
ok("dois tokens seguidos não se parecem", gerarToken() !== gerarToken());

bloco("4. DESTINO");
ok("caminho do blog vale", destinoValido("/blog/balanca-nao-muda-mas-o-corpo-muda"));
ok("caminho de ferramenta vale", destinoValido("/ferramentas/calculadora-de-proteina"));
ok("URL absoluta não vale", !destinoValido("https://exemplo.com/phishing"));
ok("protocolo relativo não vale", !destinoValido("//exemplo.com"));
// Sem ponto ele escapa de qualquer regra que confie no ponto para reconhecer
// domínio — e o navegador trata "//evil" como outro site do mesmo jeito.
ok("protocolo relativo sem ponto também não vale", !destinoValido("//evil"));
ok("javascript: não vale", !destinoValido("javascript:alert(1)"));
ok("subir de diretório não vale", !destinoValido("/blog/../../etc"));
ok("caminho vazio não vale", !destinoValido(""));

const comUtm = destinoComUtm("/blog/x", "K7PQ2M4XRT");
ok("marca a origem como CRM", comUtm.includes("utm_source=crm") && comUtm.includes("utm_medium=whatsapp"));
ok("o token vai no utm_content", comUtm.includes("utm_content=K7PQ2M4XRT"));
ok("query que já existia é preservada", destinoComUtm("/ferramentas/x?aba=2", "TTTTTTTTTT").includes("aba=2"));
ok("a URL da mensagem aponta para /c/", urlDoConteudo("https://www.montinhopersonal.com.br", "K7PQ2M4XRT") === "https://www.montinhopersonal.com.br/c/K7PQ2M4XRT");
ok("barra sobrando na origem não duplica", urlDoConteudo("https://x.com/", "AAAAAAAAAA") === "https://x.com/c/AAAAAAAAAA");

bloco("5. AS MENSAGENS NÃO COBRAM");
/*
 * Esta é a regra que o resto do CRM não tem. Todas as outras mensagens
 * terminam em pergunta porque pergunta puxa resposta. Estas chegam depois de
 * uma mensagem que prometeu não cobrar — e um "o que achou?" no fim é a
 * cobrança de volta, com fantasia.
 */
ok("as três situações de conteúdo existem", SITUACOES_CONTEUDO.size === 3);
for (const s of SITUACOES_CONTEUDO) {
  ok(`${s}: não tem pergunta`, !TEXTOS[s].includes("?"), TEXTOS[s]);
  ok(`${s}: termina no link`, TEXTOS[s].trimEnd().endsWith("{link}"), TEXTOS[s]);
  // As bordas importam: "não precisa me responder nada" é o oposto de cobrar
  // retorno, e uma regex sem \b reprovaria justamente a frase que tira a
  // obrigação. O que se veta é o imperativo — "me responde", "me chama".
  ok(`${s}: não cobra retorno`, !/\bme (responde|avisa|chama)\b|\baguardo\b|\bretorna\b|\bqualquer coisa,? me\b/i.test(TEXTOS[s]), TEXTOS[s]);
  ok(`${s}: não marca prazo`, !/at[ée] (amanh[ãa]|sexta|segunda)|\bhoje ainda\b|\bessa semana\b/i.test(TEXTOS[s]), TEXTOS[s]);
  ok(`${s}: não vende`, !/vaga|plano|proposta|valor|investimento|fechar/i.test(TEXTOS[s]), TEXTOS[s]);
}

bloco("6. CLIQUE ANTES DO RETORNO");
/*
 * Isto substitui o cookie. Não afirma que o conteúdo trouxe ninguém — mostra
 * o que aconteceu e em que ordem, e deixa a conclusão para quem lê.
 */
const clique = "2026-09-10T12:00:00-03:00";
ok("retorno 2 dias depois conta", cliqueAntesDoRetorno(clique, "2026-09-12T15:00:00-03:00")?.dias === 2);
ok("retorno no mesmo dia conta como 0", cliqueAntesDoRetorno(clique, "2026-09-10T20:00:00-03:00")?.dias === 0);
// Ela falar ANTES de clicar não é retorno: foi o contrário, e inverter a
// ordem é exatamente como se inventa atribuição.
ok("retorno antes do clique não conta", cliqueAntesDoRetorno(clique, "2026-09-09T12:00:00-03:00") === null);
ok(`fora da janela de ${JANELA_RETORNO_DIAS} dias não conta`, cliqueAntesDoRetorno(clique, "2026-12-01T12:00:00-03:00") === null);
ok("no limite da janela ainda conta", cliqueAntesDoRetorno(clique, "2026-10-10T11:00:00-03:00")?.dias === 29);
ok("sem clique não conta", cliqueAntesDoRetorno(null, "2026-09-12T12:00:00-03:00") === null);
ok("sem retorno não conta", cliqueAntesDoRetorno(clique, null) === null);
ok("data inválida não explode", cliqueAntesDoRetorno(clique, "nao e data") === null);

ok("texto de 0 dia", textoDoRetorno({ dias: 0 }) === "clicou e te chamou no mesmo dia");
ok("texto de 1 dia no singular", textoDoRetorno({ dias: 1 }) === "clicou 1 dia antes de te chamar");
ok("texto de 5 dias no plural", textoDoRetorno({ dias: 5 }) === "clicou 5 dias antes de te chamar");
// A frase diz o que houve, não por que houve.
ok("o texto não afirma causa", ![0, 1, 5].some((d) => /por causa|graças|trouxe|converteu/i.test(textoDoRetorno({ dias: d }))));

console.log("\n" + "=".repeat(64));
console.log(falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} TESTE(S) FALHARAM`);
process.exit(falhas === 0 ? 0 : 1);
