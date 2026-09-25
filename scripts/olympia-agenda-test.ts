/**
 * Agenda do Mr. Olympia 2026 (lib/olympia-brasil.ts): fases e resumo do hub.
 * Rodar: npx tsx scripts/olympia-agenda-test.ts
 */
import { ATLETAS_BRASIL, BLOCOS, CATEGORIAS, alvo, categoria, fase, resumoBrasil } from "../lib/olympia-brasil";

let falhas = 0;
const ok = (c: boolean, m: string) => { if (!c) { falhas++; console.log("FALHOU:", m); } else console.log("ok:", m); };
const at = (iso: string) => Date.parse(iso);

// Horários: fuso explícito, e o mesmo instante em UTC.
ok(Date.parse(BLOCOS.sextaPrevias.inicio) === Date.UTC(2026, 8, 25, 16, 30), "prévias de sexta = 16h30 UTC");
ok(Date.parse(BLOCOS.sabadoFinais.inicio) === Date.UTC(2026, 8, 27, 2, 0), "finais de sábado = 02h UTC de domingo");

const c212 = categoria("212");
ok(fase(c212, at("2026-09-25T13:29:59-03:00")) === "antes-previas", "212 antes das prévias");
ok(alvo(c212, at("2026-09-25T10:00:00-03:00"))?.tipo === "previas", "alvo inicial = prévias");
ok(fase(c212, at("2026-09-25T13:30:00-03:00")) === "previas", "212 no início do bloco → prévias");
ok(fase(c212, at("2026-09-25T19:00:00-03:00")) === "previas", "sem flag, não afirma que as prévias acabaram");
ok(alvo(c212, at("2026-09-25T19:00:00-03:00"))?.tipo === "final", "durante as prévias, alvo = final");
ok(fase({ ...c212, previasConcluidas: true }, at("2026-09-25T19:00:00-03:00")) === "aguardando-final", "flag de prévias → aguardando final");
ok(fase(c212, at("2026-09-25T22:00:00-03:00")) === "final", "22h → bloco das finais");
ok(alvo(c212, at("2026-09-25T23:00:00-03:00")) === null, "nas finais não há contagem");
ok(fase(c212, at("2026-09-26T02:00:00-03:00")) === "final", "sem resultado oficial, não encerra sozinha");
ok(fase({ ...c212, resultadoOficial: true }, at("2026-09-25T10:00:00-03:00")) === "encerrada", "resultado oficial encerra");

const open = categoria("open");
ok(fase(open, at("2026-09-25T22:30:00-03:00")) === "previas", "Open: prévias na sessão de sexta à noite");

// Hub Brasil
const r0 = resumoBrasil(at("2026-09-25T02:00:00-03:00"));
ok(r0.agora === null && r0.proximo?.bloco === "sextaPrevias", "madrugada de sexta: próximo = prévias de sexta");
const r1 = resumoBrasil(at("2026-09-25T15:00:00-03:00"));
ok(r1.agora?.bloco === "sextaPrevias" && r1.proximo?.bloco === "sextaFinais", "sexta 15h: agora prévias, próximo finais");
const r2 = resumoBrasil(at("2026-09-27T01:00:00-03:00"));
ok(r2.proximo === null, "depois das finais de sábado não há próximo");

// Integridade dos dados
ok(ATLETAS_BRASIL.every((x) => CATEGORIAS.some((c) => c.id === x.categoria)), "todo atleta tem categoria válida");
ok(new Set(ATLETAS_BRASIL.map((x) => x.nome)).size === ATLETAS_BRASIL.length, "sem atleta repetido");
ok(ATLETAS_BRASIL.every((x) => !x.resultado || categoria(x.categoria).resultadoOficial), "resultado só em categoria com resultado oficial");

console.log(falhas ? `\n${falhas} FALHA(S)` : "\nTODOS OS TESTES PASSARAM");
process.exit(falhas ? 1 : 0);
