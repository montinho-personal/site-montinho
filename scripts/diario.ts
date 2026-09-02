/**
 * Série diária de eventos, a partir do que dá para ler no app do GA4.
 *
 *   npx tsx scripts/diario.ts
 *
 * POR QUE ISTO EXISTE SEPARADO DO snapshot-analytics.ts
 *
 * O snapshot precisa dos dois CSVs exportados do GA4 e produz o funil
 * inteiro: usuários, tempo de leitura por artigo, taxa de cada bloco. É a
 * medição boa, e é trabalhosa — ninguém exporta CSV todo dia.
 *
 * O app do celular mostra só contagem de evento. Não dá usuários, não dá
 * página, e um dia consultado às 14h não é um dia. Mas dá para ver, no dia
 * seguinte ao de subir uma mudança, se o evento novo começou a aparecer e
 * em que ordem de grandeza. É para isso, e só para isso.
 *
 * O RISCO QUE O ARQUIVO PRECISA EVITAR
 *
 * É comparar contagem de evento com contagem de gente. "5 cliques" não é
 * "5 pessoas": a mesma pessoa clicando duas vezes conta dois. Por isso
 * nenhuma linha aqui se chama "usuários" e todas as taxas saem de eventos
 * divididos por eventos, com o denominador escrito na tabela.
 *
 * E é comparar dia parcial com dia inteiro. Um dia lido às 14h46 tem umas
 * dez horas a menos; a tabela marca com * e o rodapé explica.
 */

import { readFileSync } from "node:fs";

export const DIARIO = "data/analytics/diario.json";

export interface Dia {
  data: string;
  /** Hora da leitura quando o dia ainda não tinha fechado. Ausente = dia inteiro. */
  parcial?: string;
  fonte: string;
  eventos: Record<string, number>;
  nota?: string;
}

export function leDiario(caminho = DIARIO): Dia[] {
  return JSON.parse(readFileSync(caminho, "utf8"));
}

/**
 * Pares exposição → ação. O que interessa não é o número de cima, é a
 * distância entre os dois: 11 FAQs vistos e nenhuma pergunta aberta diz
 * mais do que qualquer um dos dois sozinho.
 */
export const PARES_DIARIOS: Array<[string, string, string]> = [
  ["FAQ", "faq_view", "faq_open"],
  ["vídeo no artigo", "article_video_view", "article_video_play"],
  ["sticky", "sticky_view", "sticky_click"],
  ["pós-ferramenta", "post_tool_cta_view", "post_tool_cta_click"],
];

const arred = (n: number, casas = 1) => Math.round(n * 10 ** casas) / 10 ** casas;

function main() {
  const dias = leDiario();
  if (!dias.length) { console.log("Nenhum dia registrado ainda."); return; }

  const col = (d: Dia) => (d.data.slice(5).replace("-", "/") + (d.parcial ? "*" : "")).padStart(11);
  const cab = "métrica".padEnd(32) + dias.map(col).join("");
  const risco = "-".repeat(cab.length);

  const ev = (d: Dia, n: string) => d.eventos[n] ?? 0;
  function linha(rotulo: string, valor: (d: Dia) => string) {
    console.log(rotulo.padEnd(32) + dias.map((d) => valor(d).padStart(11)).join(""));
  }
  function titulo(t: string) { console.log("\n" + t); console.log(risco); }

  console.log("=".repeat(cab.length));
  console.log("SÉRIE DIÁRIA  (contagem de EVENTOS, não de pessoas)");
  console.log("=".repeat(cab.length));
  console.log(cab);
  console.log(risco);

  titulo("ALCANCE");
  linha("  page_view", (d) => String(ev(d, "page_view")));
  linha("  session_start", (d) => String(ev(d, "session_start")));
  linha("  páginas por sessão", (d) =>
    ev(d, "session_start") ? arred(ev(d, "page_view") / ev(d, "session_start"), 2).toFixed(2) : "—");
  linha("  % de sessão nova", (d) =>
    ev(d, "session_start") ? arred((100 * ev(d, "first_visit")) / ev(d, "session_start")).toFixed(0) + "%" : "—");
  linha("  % de sessão engajada", (d) =>
    ev(d, "session_start") ? arred((100 * ev(d, "user_engagement")) / ev(d, "session_start")).toFixed(0) + "%" : "—");

  titulo("PROFUNDIDADE");
  linha("  scroll_75 (75% da página)", (d) => String(ev(d, "scroll_75")));
  linha("  scroll (90%, automático)", (d) => String(ev(d, "scroll")));
  linha("  scroll_75 por page_view", (d) =>
    ev(d, "page_view") ? arred((100 * ev(d, "scroll_75")) / ev(d, "page_view")).toFixed(0) + "%" : "—");

  titulo("CONVERSA");
  linha("  click_whatsapp", (d) => String(ev(d, "click_whatsapp")));
  linha("  generate_lead", (d) => String(ev(d, "generate_lead")));
  linha("  cliques por session_start", (d) =>
    ev(d, "session_start") ? arred((100 * ev(d, "click_whatsapp")) / ev(d, "session_start")).toFixed(1) + "%" : "—");

  titulo("BLOCOS: EXPOSIÇÃO → AÇÃO");
  for (const [nome, vista, acao] of PARES_DIARIOS) {
    linha("  " + nome, (d) => {
      const v = ev(d, vista);
      if (!v) return "—";
      return `${ev(d, acao)}/${v}`;
    });
  }

  const notas = dias.filter((d) => d.nota);
  if (notas.length) {
    titulo("NOTAS");
    for (const d of notas) console.log(`  ${d.data}: ${d.nota}`);
  }

  console.log("\n" + risco);
  console.log("* dia lido antes de fechar — não compare com dia inteiro.");
  console.log("Fonte: app do GA4, que mostra evento e não usuário. Para funil, tempo de");
  console.log("leitura e taxa por bloco com denominador de gente, use os CSVs e o");
  console.log("snapshot-analytics.ts.");
  console.log("");
}

/* Só imprime quando chamado direto: a suíte importa as invariantes daqui. */
if (require.main === module) main();
