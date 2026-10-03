import { readFileSync } from "node:fs";
import {
  ARTIGOS_COM_CALCULADORA_ARTES_MARCIAIS, MODALIDADES, MET_ROLA, MET_TECNICA, calcula, comparaModalidades, faixaHora, modalidade,
} from "../lib/artes-marciais";
import { MET_ROLA as JIU_ROLA, MET_TECNICA as JIU_TEC } from "../lib/jiujitsu";
import { ARTIGOS_COM_CALCULADORA_BOXE, aula } from "../lib/boxe";
import { ARTIGOS_COM_CALCULADORA_MUAY } from "../lib/muaythai";
import { ARTIGOS_COM_CALCULADORA_JIU } from "../lib/jiujitsu";
import { CANONICA } from "../lib/ferramentas/canonica";

let falhas = 0;
const ok = (nome: string, cond: boolean) => { if (!cond) { falhas++; console.error("FALHOU:", nome); } else console.log("ok:", nome); };

ok("METs iguais aos do jiu-jitsu", MET_ROLA === JIU_ROLA && MET_TECNICA === JIU_TEC && MET_TECNICA === 5.3 && MET_ROLA === 10.3);
for (const id of ["jiujitsu", "muaythai", "judo", "karate", "taekwondo", "kickboxing", "mma"] as const)
  ok(`${id} usa 5,3 / 10,3`, modalidade(id).metTecnica === 5.3 && modalidade(id).metLuta === 10.3);
ok("boxe lê lib/boxe (saco 5,8, sparring 7,8)", modalidade("boxe").metTecnica === aula("saco").met && modalidade("boxe").metLuta === aula("sparring").met && modalidade("boxe").metLuta === 7.8);
ok("sem kung fu, capoeira, tai chi, wrestling", !MODALIDADES.some((m) => /kung|capoeira|tai|wrestl/i.test(m.id + m.nome)));
ok("70 kg, 60 min só luta ≈ 757", Math.round(calcula("jiujitsu", 70, 60, 60)!.kcal) === 757);
ok("70 kg, 60 min só técnica ≈ 390", Math.round(calcula("judo", 70, 60, 0)!.kcal) === 390);
const r = calcula("karate", 70, 75, 20)!;
ok("técnica = aula − luta", r.minutosTecnica === 55);
ok("kcal = soma das partes", Math.abs(r.kcal - r.kcalTecnica - r.kcalLuta) < 1e-9);
ok("luta > aula → null", calcula("mma", 70, 60, 61) === null);
ok("comparação tem todas", comparaModalidades(70, 60, 15).length === MODALIDADES.length);
ok("faixa: técnica < luta", faixaHora(70).every((l) => l.tecnica < l.luta));
ok("nomes da luta por modalidade", modalidade("jiujitsu").luta === "rola" && modalidade("judo").luta === "randori" && modalidade("karate").luta === "kumite");

const ufc = ["ufc-332-natalia-silva", "brasileiros-ufc-332", "corte-de-peso-ufc", "pesagem-ufc-332", "resultado-ufc-332"];
ok("posts de evento UFC embutem esta calculadora", ufc.every((s) => ARTIGOS_COM_CALCULADORA_ARTES_MARCIAIS.includes(s)));
ok("e saíram do boxe, muay e jiu", ufc.every((s) => !ARTIGOS_COM_CALCULADORA_BOXE.includes(s) && !ARTIGOS_COM_CALCULADORA_MUAY.includes(s) && !ARTIGOS_COM_CALCULADORA_JIU.includes(s)));
ok("teto de oito artigos", ARTIGOS_COM_CALCULADORA_ARTES_MARCIAIS.length <= 8);
ok("canônica", CANONICA.artesmarciais?.href === "/ferramentas/calculadora-calorias-artes-marciais");

const comp = readFileSync("components/artes-marciais/CalculadoraArtesMarciais.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-calorias-artes-marciais/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_ARTES_MARCIAIS\.includes\(post\.slug\)/.test(blog) && /<CalculadoraArtesMarciais placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-artes-marciais/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /calculadora-calorias-artes-marciais/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam peso nem kcal", !/trackEvent\([^)]*(peso|kcal|aula\b|luta\b)/.test(comp));
ok("aria-live", /aria-live="polite"/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
ok("fechamento antes do FAQ", pag.indexOf("FECHAMENTO_COMPARACAO.titulo") > 0 && pag.indexOf("FECHAMENTO_COMPARACAO.titulo") < pag.indexOf("<FAQ "));
for (const p of ["jiu-jitsu", "muay-thai", "boxe"])
  ok(`página de ${p} linka a nova`, /calculadora-calorias-artes-marciais/.test(readFileSync(`app/ferramentas/calculadora-calorias-${p}/page.tsx`, "utf8")));

console.log("\nFaixas 1 h, 70 kg:");
for (const l of faixaHora(70)) console.log(`  ${l.modalidade.nome}: ${l.tecnica}–${l.luta} kcal`);
if (falhas) { console.error(`${falhas} falha(s)`); process.exit(1); }
console.log("TUDO OK");
