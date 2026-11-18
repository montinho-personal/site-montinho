/**
 * Calculadora de preço de personal (Alphaville e região).
 * Trava as regras de honestidade: sempre faixa, arredondamento único,
 * fallback declarado e nenhuma palavra que finja pesquisa de campo.
 */
import * as fs from "fs";
import { FORMATOS, FREQUENCIAS, LOCAIS, REFERENCIAS, arredondar, calcular, sessoesPorMes } from "../lib/preco-personal";

let falhas = 0;
const ok = (nome: string, cond: boolean, extra = "") => { if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${extra}`); } else console.log(`  ok      ${nome}`); };

ok("sessões por mês: 1×=4, 2×=9, 3×=13, 4×=17, 5×=22", [1, 2, 3, 4, 5].map((f) => sessoesPorMes(f as 1)).join() === "4,9,13,17,22");
ok("arredonda para a dezena até R$ 1.000", arredondar(454) === 450 && arredondar(455) === 460 && arredondar(1000) === 1000);
ok("arredonda para a cinquentena acima de R$ 1.000", arredondar(1024) === 1000 && arredondar(1026) === 1050 && arredondar(2318) === 2300);

const todos = LOCAIS.flatMap((l) => FORMATOS.flatMap((f) => FREQUENCIAS.map((q) => calcular(l.id, f.id, q))));
ok("todo resultado é faixa (mínimo menor que máximo)", todos.every((r) => r.mensal[0] < r.mensal[1] && (!r.avulsa || r.avulsa[0] < r.avulsa[1]) && (!r.aulaNoPacote || r.aulaNoPacote[0] < r.aulaNoPacote[1])));
ok("todo valor exibido obedece ao arredondamento", todos.every((r) => [...r.mensal, ...(r.aulaNoPacote ?? [])].every((v) => v === arredondar(v))));
ok("2× e 3× usam a faixa do pacote, sem extrapolar", todos.filter((r) => r.formato.presencial && (r.freq === 2 || r.freq === 3)).every((r) => !r.extrapolado && r.mensal[0] === REFERENCIAS[r.local.ref].mensal[0] && r.mensal[1] === REFERENCIAS[r.local.ref].mensal[1]));
ok("1×, 4× e 5× presenciais são marcados como extrapolação", todos.filter((r) => r.formato.presencial && ![2, 3].includes(r.freq)).every((r) => r.extrapolado && r.memoria.some((m) => m.includes("extrapolação"))));
ok("mais aulas nunca custam menos por mês", LOCAIS.every((l) => { const m = [1, 3, 4, 5].map((f) => calcular(l.id, "academia", f as 1).mensal[1]); return m[0] < m[1] && m[1] < m[2] && m[2] < m[3]; }));
ok("online é mensal e não muda com a frequência", LOCAIS.every((l) => FREQUENCIAS.every((f) => { const r = calcular(l.id, "online", f); return r.avulsa === null && r.aulaNoPacote === null && r.mensal[0] === REFERENCIAS[l.ref].online[0] && r.mensal[1] === REFERENCIAS[l.ref].online[1]; })));
ok("Alphaville 3×: R$ 500 a R$ 1.500 por mês", calcular("alphaville", "condominio", 3).mensal.join() === "500,1500");
ok("Alphaville 5×: R$ 1.000 a R$ 3.000 por mês", calcular("alphaville", "condominio", 5).mensal.join() === "1000,3000");
ok("fallback nunca é silencioso", LOCAIS.filter((l) => l.id !== l.ref).every((l) => !!l.aviso && l.aviso.includes(REFERENCIAS[l.ref].nome)));
ok("local com faixa própria não leva aviso", LOCAIS.filter((l) => l.id === l.ref).every((l) => l.aviso === null));
ok("a memória diz de onde vem o número", todos.every((r) => r.memoria[0].includes("referência editorial") && r.memoria[0].includes("não é pesquisa")));

const fontes = ["app/ferramentas/calculadora-preco-personal-trainer-alphaville/page.tsx", "components/preco/CalculadoraPrecoPersonal.tsx"].map((f) => fs.readFileSync(f, "utf8")).join("\n");
const semComentario = fontes.replace(/\/\*[\s\S]*?\*\//g, "");
ok("a página não afirma preço médio", !/preço médio de R\$|custa, em média|em média R\$/i.test(semComentario));
ok("a página não cita conselho profissional", !/\bCREF\b|\bCONFEF\b|Educação Física/i.test(fontes));
ok("a página não fala em dieta", !/dieta|plano alimentar|cardápio/i.test(semComentario));
ok("a página não cita academia como local confirmado além da Arena 18", !/Ironberg|Bodytech|Bio Ritmo|Smart Fit|Bluefit|Gaviões|NitroGym/i.test(semComentario));
ok("o cálculo não chama servidor", !/fetch\(|"use server"|\/api\//.test(fs.readFileSync("components/preco/CalculadoraPrecoPersonal.tsx", "utf8") + fs.readFileSync("lib/preco-personal.ts", "utf8")));

console.log("================================================================");
console.log(falhas ? `${falhas} TESTE(S) FALHARAM` : "TODOS OS TESTES PASSARAM");
process.exit(falhas ? 1 : 0);
