import { calcula, horaSemParar, kcalPorRoundExtra, kgPorMes, tabelaHora, tabelaCenarios, MET_ROUND, MET_TECNICA, ARTIGOS_COM_CALCULADORA_MUAY } from "../lib/muaythai";
import { MET_ROLA, MET_TECNICA as JIU_TEC } from "../lib/jiujitsu";

let falhas = 0;
const ok = (nome: string, cond: boolean) => { if (!cond) { falhas++; console.error("FALHOU:", nome); } else console.log("ok:", nome); };

ok("METs iguais aos do jiu-jitsu (mesmo código do Compêndio)", MET_ROUND === MET_ROLA && MET_TECNICA === JIU_TEC);
const r = calcula(70, 60, 5, 3, 1)!;
ok("aula típica: técnica = 60 − 15 − 4", r.minutosTecnica === 41);
ok("kcal = soma das partes", Math.abs(r.kcal - (r.kcalTecnica + r.kcalRound + r.kcalDescanso)) < 1e-9);
ok("aula típica 70 kg entre 400 e 500 kcal", r.kcal > 400 && r.kcal < 500);
ok("rounds que não cabem → null", calcula(70, 30, 10, 3, 1) === null);
ok("0 rounds = só técnica", calcula(70, 60, 0, 3, 1)!.kcalRound === 0);
ok("hora sem parar 70 kg ≈ 757", Math.round(horaSemParar(70)) === 757);
ok("round extra soma positivo", kcalPorRoundExtra(70, 3, 1) > 0);
ok("kg/mês positivo e pequeno", kgPorMes(r, 3) > 0 && kgPorMes(r, 3) < 2);
ok("tabela por hora cresce com o peso", tabelaHora().every((l, i, a) => i === 0 || l.tipica > a[i - 1].tipica));
ok("técnica < típica < sem parar", tabelaHora().every((l) => l.tecnica < l.tipica && l.tipica < l.semParar));
ok("cenários cabem na aula", tabelaCenarios().length === 3);
ok("embute no artigo muay-thai-emagrece", ARTIGOS_COM_CALCULADORA_MUAY.includes("muay-thai-emagrece"));

if (falhas) { console.error(`${falhas} falha(s)`); process.exit(1); }
console.log("TUDO OK");
