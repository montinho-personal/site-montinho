import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Tempo do Hyrox.
 *   npx tsx scripts/hyrox-tempo-test.ts
 */
import {
  ARTIGOS_COM_CALCULADORA_TEMPO_HYROX, ESTACOES, KM_CORRIDA, ROXZONE, formataTempo, ganhos, maisLenta, paceParaMeta,
  parseMinSeg, parseTempoFinal, preve,
} from "../lib/hyrox-tempo";
import { ARTIGOS_COM_CALCULADORA_HYROX } from "../lib/hyrox";
import { CANONICA } from "../lib/ferramentas/canonica";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));

bloco("1. A SOMA");
const r = preve(360, 300, 319);
ok("8 × 6:00 = 48:00 de corrida", r.corridaSeg === 2880);
ok("8 × 5:00 = 40:00 de estação", r.estacoesSeg === 2400);
ok("total = corrida + estações + Roxzone", r.totalSeg === 2880 + 2400 + 319, `${r.totalSeg}`);
ok("formata 1:33:19", formataTempo(r.totalSeg) === "1:33:19", formataTempo(r.totalSeg));
const det = preve(360, [240, 420, 360, 300, 270, 150, 300, 480], 300);
ok("detalhado soma as oito", det.estacoesSeg === 2520);
ok("a mais lenta é o wall ball", maisLenta(det).estacao.id === "wallball");

bloco("2. A CONTA AO CONTRÁRIO");
const p = paceParaMeta(5400, 300, 319)!;
ok("pace da meta fecha a meta", Math.abs(preve(p, 300, 319).totalSeg - 5400) < 0.001);
ok("meta impossível devolve null", paceParaMeta(2700, 300, 319) === null);
ok("pace mais rápido que 3:00 devolve null", paceParaMeta(2400 + 319 + 8 * 170, 300, 319) === null);

bloco("3. LEITURA");
ok("1h30", parseTempoFinal("1h30") === 5400);
ok("1:30:00", parseTempoFinal("1:30:00") === 5400);
ok("90", parseTempoFinal("90") === 5400);
ok("1:75 recusado", parseTempoFinal("1:75") === null);
ok("4:30", parseMinSeg("4:30") === 270);

bloco("4. GANHOS E ROXZONE");
const g = ganhos(r);
ok("10 s/km = 1:20", g.find((x) => x.id === "pace")!.seg === KM_CORRIDA * 10);
ok("20 s por estação = 2:40", g.find((x) => x.id === "estacoes")!.seg === ESTACOES.length * 20);
ok("ordenado do maior para o menor", g.every((x, i) => i === 0 || g[i - 1].seg >= x.seg));
ok("Roxzone da análise: 3:41, 5:19, 6:58", ROXZONE.map((f) => f.seg).join(",") === "221,319,418");

bloco("5. LIGAÇÕES");
const comp = readFileSync("components/hyrox/CalculadoraTempoHyrox.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-tempo-hyrox/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_TEMPO_HYROX\.includes\(post\.slug\)/.test(blog) && /<CalculadoraTempoHyrox placement=\{post\.slug\} \/>/.test(blog));
ok("todo artigo do registro existe", ARTIGOS_COM_CALCULADORA_TEMPO_HYROX.every((s) => blogPosts.some((b) => b.slug === s)));
ok("nenhum artigo nas duas calculadoras de Hyrox", !ARTIGOS_COM_CALCULADORA_TEMPO_HYROX.some((s) => ARTIGOS_COM_CALCULADORA_HYROX.includes(s)));
ok("teto de 8", ARTIGOS_COM_CALCULADORA_TEMPO_HYROX.length <= 8);
ok("link canônico", CANONICA.hyroxTempo?.href === "/ferramentas/calculadora-tempo-hyrox");
ok("hub e sitemap", /calculadora-tempo-hyrox/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /calculadora-tempo-hyrox/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam pace, meta ou tempo", !/trackEvent\([^)]*(paceTexto|metaTexto|totalSeg|pace:|meta:)/.test(comp));
ok("fechamento antes do CTA", comp.indexOf("FECHAMENTO_COMPARACAO.paragrafos") < comp.indexOf("getWhatsAppUrl(pedidoWhats)"));
ok("meta que não fecha tem mensagem", /metaNaoFecha/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
