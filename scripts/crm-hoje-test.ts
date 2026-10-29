/** Tela Hoje em seções: npx tsx scripts/crm-hoje-test.ts */
import { agruparPorSecao, secaoDoGrupo, SECOES_HOJE } from "../lib/crm/hoje";

let falhas = 0;
const ok = (nome: string, cond: boolean, det = "") => { if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${det}`); } else console.log(`  ok      ${nome}`); };

ok("respondeu vai para Responder agora", secaoDoGrupo("respondeu_aguardando_voce") === "responder");
ok("lead novo vai para Primeiro contato", secaoDoGrupo("novo_sem_contato") === "primeiro_contato");
ok("decidir tem seção própria", secaoDoGrupo("decidir") === "decidir");
for (const g of ["renovacao_vencida", "renovacao_proxima", "renovacao_pacote"]) ok(`${g} vai para Renovações`, secaoDoGrupo(g) === "renovacoes");
for (const g of ["proposta_sem_follow_up", "proxima_acao_vencida", "follow_up_atrasado", "follow_up_hoje", "quente", "experimental_proxima", "experimental_sem_registro", "pos_experimental_sem_proposta", "sem_proxima_acao", "parado", "negociacao_antiga"]) ok(`${g} vai para Follow-ups`, secaoDoGrupo(g) === "follow_up");

const g = agruparPorSecao([
  { grupo: "renovacao_proxima", prioridade: 7, n: "a" },
  { grupo: "proxima_acao_vencida", prioridade: 5, n: "b" },
  { grupo: "respondeu_aguardando_voce", prioridade: 1, n: "c" },
  { grupo: "follow_up_atrasado", prioridade: 2, n: "d" },
  { grupo: "renovacao_vencida", prioridade: 2, n: "e" },
]);
ok("seções na ordem de trabalho, só as que têm item", g.map((x) => x.secao.id).join(",") === "responder,follow_up,renovacoes", g.map((x) => x.secao.id).join(","));
ok("dentro da seção, a prioridade manda", g[1].itens.map((x) => x.n).join("") === "db" && g[2].itens.map((x) => x.n).join("") === "ea");
ok("nenhum item some", g.reduce((s, x) => s + x.itens.length, 0) === 5);
ok("cinco seções, todas com título e dica", SECOES_HOJE.length === 5 && SECOES_HOJE.every((s) => s.titulo && s.dica));

console.log(falhas ? `\n${falhas} TESTE(S) FALHARAM` : "\nTODOS OS TESTES PASSARAM");
if (falhas) process.exit(1);
