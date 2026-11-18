/**
 * Academias com diária e aula experimental (Alphaville e região).
 * Trava a regra dos dados: toda oferta tem fonte e data, nada "a confirmar"
 * entra na lista, e só a Arena 18 fala do atendimento do Montinho.
 */
import * as fs from "fs";
import { NAO_CONFIRMADAS, OFERTAS, filtrar, precoTxt, totalNoMes } from "../lib/diaria-experimental";

let falhas = 0;
const ok = (nome: string, cond: boolean, extra = "") => { if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${extra}`); } else console.log(`  ok      ${nome}`); };

ok("toda oferta tem fonte e data de conferência", OFERTAS.every((o) => o.fonteNome.length > 10 && /^\d{4}-\d{2}-\d{2}$/.test(o.conferidaEm)));
ok("toda oferta de academia tem endereço da fonte oficial", OFERTAS.filter((o) => !o.daCasa).every((o) => !!o.fonteUrl && o.fonteUrl.startsWith("https://")));
ok("ids únicos", new Set(OFERTAS.map((o) => o.id)).size === OFERTAS.length);
ok("sem preço confirmado, a tela não mostra número solto", OFERTAS.filter((o) => o.preco === null).every((o) => !/^R\$ \d+$/.test(precoTxt(o))));
ok("preço confirmado só com número", OFERTAS.filter((o) => o.preco !== null).every((o) => precoTxt(o) === "Grátis" || /^R\$ \d/.test(precoTxt(o))));
ok("oferta a confirmar fica fora da lista", !OFERTAS.some((o) => /smart fit|scelta/i.test(o.academia)) && NAO_CONFIRMADAS.length === 2);
ok("só a Arena 18 é atendimento do Montinho", OFERTAS.filter((o) => o.daCasa).map((o) => o.academia).join() === "Arena 18" && OFERTAS.filter((o) => /montinho/i.test(o.como)).every((o) => o.daCasa));
ok("visita guiada não é treino", OFERTAS.filter((o) => o.tipo === "visita").every((o) => !o.treino && !o.musculacao));
ok("filtro de musculação tira as outras modalidades", filtrar({ modo: "diaria", soMusculacao: true, soComPreco: false }).every((o) => o.musculacao) && filtrar({ modo: "experimental", soMusculacao: true, soComPreco: false }).every((o) => o.musculacao));
ok("filtro de preço confirmado", filtrar({ modo: "diaria", soMusculacao: false, soComPreco: true }).every((o) => o.preco !== null));
ok("NitroGym: R$ 90 e 4 idas = R$ 360", (() => { const n = OFERTAS.find((o) => o.id === "nitrogym-diaria")!; return n.preco === 90 && totalNoMes(n, 4) === 360; })());
ok("total do mês só com preço confirmado", OFERTAS.filter((o) => o.preco === null || o.preco === 0).every((o) => totalNoMes(o, 8) === null));
ok("guias apontam para artigos que existem", (() => { const blog = fs.readFileSync("lib/blog.ts", "utf8") + fs.readdirSync("lib").filter((f) => f.endsWith(".ts")).map((f) => fs.readFileSync(`lib/${f}`, "utf8")).join(""); return OFERTAS.filter((o) => o.guia).every((o) => blog.includes(`slug: "${o.guia!.replace("/blog/", "")}"`)); })());

const fontes = ["app/ferramentas/academias-com-diaria-e-aula-experimental-alphaville/page.tsx", "components/diaria/DiariaExperimental.tsx"].map((f) => fs.readFileSync(f, "utf8")).join("\n");
const semComentario = fontes.replace(/\/\*[\s\S]*?\*\//g, "");
ok("a página não cita conselho profissional", !/\bCREF\b|\bCONFEF\b|Educação Física/i.test(fontes));
ok("a página não fala em dieta", !/dieta|plano alimentar|cardápio/i.test(semComentario));
ok("a página não promete resultado", !/garantid|resultado garantido|em \d+ dias/i.test(semComentario));

console.log("================================================================");
console.log(falhas ? `${falhas} TESTE(S) FALHARAM` : "TODOS OS TESTES PASSARAM");
process.exit(falhas ? 1 : 0);
