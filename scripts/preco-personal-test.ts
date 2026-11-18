/**
 * Calculadora de preço de personal (Alphaville e região).
 * Trava as regras de honestidade: sempre faixa, arredondamento único,
 * fallback declarado e nenhuma palavra que finja pesquisa de campo.
 */
import * as fs from "fs";
import { FORMATOS, FREQUENCIAS, LOCAIS, PACOTE_AULA, REFERENCIAS, arredondar, calcular, sessoesPorMes } from "../lib/preco-personal";

let falhas = 0;
const ok = (nome: string, cond: boolean, extra = "") => { if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${extra}`); } else console.log(`  ok      ${nome}`); };

ok("sessões por mês: 1×=4, 2×=9, 3×=13, 4×=17, 5×=22", [1, 2, 3, 4, 5].map((f) => sessoesPorMes(f as 1)).join() === "4,9,13,17,22");
ok("arredonda para a dezena até R$ 1.000", arredondar(454) === 450 && arredondar(455) === 460 && arredondar(1000) === 1000);
ok("arredonda para a cinquentena acima de R$ 1.000", arredondar(1024) === 1000 && arredondar(1026) === 1050 && arredondar(2318) === 2300);

const todos = LOCAIS.flatMap((l) => FORMATOS.flatMap((f) => FREQUENCIAS.map((q) => calcular(l.id, f.id, q))));
ok("todo resultado é faixa (mínimo menor que máximo)", todos.every((r) => r.mensal[0] < r.mensal[1] && (!r.avulsa || r.avulsa[0] < r.avulsa[1]) && (!r.aulaNoPacote || r.aulaNoPacote[0] < r.aulaNoPacote[1])));
ok("todo valor exibido obedece ao arredondamento", todos.every((r) => [...r.mensal, ...(r.aulaNoPacote ?? [])].every((v) => v === arredondar(v))));
ok("mensal presencial = aula no pacote × sessões, arredondado", todos.filter((r) => r.formato.presencial).every((r) => r.mensal[0] === arredondar(PACOTE_AULA[r.local.id][0] * r.sessoes) && r.mensal[1] === arredondar(PACOTE_AULA[r.local.id][1] * r.sessoes)));
ok("aula no pacote: R$ 50 a 300 em Alphaville, Tamboré e Aldeia; R$ 40 a 250 em Barueri e Santana", ["alphaville", "tambore", "aldeia-da-serra"].every((l) => PACOTE_AULA[l as "alphaville"].join() === "50,300") && ["barueri-centro", "santana-de-parnaiba"].every((l) => PACOTE_AULA[l as "alphaville"].join() === "40,250"));
ok("mais aulas nunca custam menos por mês", LOCAIS.every((l) => { const m = [1, 2, 3, 5].map((f) => calcular(l.id, "academia", f as 1).mensal[1]); return m[0] < m[1] && m[1] < m[2] && m[2] < m[3]; }));
ok("online é mensal e não muda com a frequência", LOCAIS.every((l) => FREQUENCIAS.every((f) => { const r = calcular(l.id, "online", f); return r.avulsa === null && r.aulaNoPacote === null && r.mensal[0] === REFERENCIAS[l.ref].online[0] && r.mensal[1] === REFERENCIAS[l.ref].online[1]; })));
ok("Alphaville 3×: R$ 650 a R$ 3.900 por mês", calcular("alphaville", "condominio", 3).mensal.join() === "650,3900");
ok("online parte de R$ 110 por mês em todos os locais", LOCAIS.every((l) => calcular(l.id, "online", 3).mensal[0] === 110));
ok("aula avulsa em Alphaville: R$ 100 a 350", calcular("alphaville", "academia", 3).avulsa!.join() === "100,350");
ok("Barueri 2×: R$ 360 a R$ 2.250 por mês", calcular("barueri-centro", "academia", 2).mensal.join() === "360,2250");
ok("fallback nunca é silencioso", LOCAIS.filter((l) => l.id !== l.ref).every((l) => !!l.aviso && l.aviso.includes(REFERENCIAS[l.ref].nome)));
ok("local com faixa própria não leva aviso", LOCAIS.filter((l) => l.id === l.ref).every((l) => l.aviso === null));
ok("a memória diz de onde vem cada número", todos.every((r) => r.memoria[0].includes("informada pelo Montinho") && r.memoria.filter((m) => /R\$ \d.* a R\$|Teto:/.test(m) && !m.startsWith("Faixa mensal")).every((m) => m.includes("informada pelo Montinho") || m.includes("referência editorial"))));

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
