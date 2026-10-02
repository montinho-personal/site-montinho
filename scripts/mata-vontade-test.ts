import { interpretar, recomendar, pontuar, type Pedido } from "../lib/mata-vontade/motor";
import { FAMILIAS } from "../lib/mata-vontade/familias";
import { RECEITAS, INGREDIENTES } from "../lib/mata-vontade/receitas";
import { existsSync, readFileSync } from "node:fs";

let falhas = 0;
const ok = (c: boolean, m: string, x = "") => { console.log(`  ${c ? "ok    " : "FALHOU"}  ${m}${c ? "" : "  " + x}`); if (!c) falhas++; };
const fam = (id: string) => FAMILIAS.find((f) => f.id === id)!;
const tudo = Object.keys(INGREDIENTES);
const base = (over: Partial<Pedido> & { familia: Pedido["familia"] }): Pedido => ({ chips: [], aromas: [], tenho: tudo, podeComprar: true, objetivo: "gostoso", restricoes: [], ...over });

// Banco
ok(RECEITAS.length === 40, "40 receitas", String(RECEITAS.length));
ok(new Set(RECEITAS.map((r) => r.id)).size === 40, "ids únicos");
ok(RECEITAS.every((r) => FAMILIAS.some((f) => f.id === r.familia)), "toda receita aponta para família existente");
ok(RECEITAS.every((r) => r.ingredientes.every((i) => INGREDIENTES[i.id])), "todo ingrediente existe no banco");
ok(FAMILIAS.every((f) => RECEITAS.filter((r) => r.familia === f.id).length >= 2), "toda família tem 2+ receitas");
ok(RECEITAS.every((r) => r.status === "em-teste"), "todas lançam como em teste");
ok(FAMILIAS.every((f) => RECEITAS.some((r) => r.familia === f.id && r.marcas.includes("sem-whey"))), "toda família tem opção sem whey");
ok(!RECEITAS.some((r) => /massa crua|ovo cru/i.test(r.passos.join(" "))), "nada de ovo cru");
// Regra do whey: whey nunca vai ao fogo direto
ok(!RECEITAS.some((r) => r.equip === "fogao" && r.ingredientes.some((i) => i.id === "whey")), "whey não vai ao fogão");

// Interpretação
const fi = (t: string) => { const r = interpretar(t); return r.tipo === "familia" ? r.familia.id : r.tipo; };
ok(fi("Bolo-de-Chocolate!!") === "bolo-chocolate", "normaliza hífen e pontuação");
ok(fi("bolo de caneca") === "bolo-caneca", "o sinônimo mais longo vence");
ok(fi("bronie") === "brownie", "erro de digitação: bronie");
ok(fi("cheescake") === "cheesecake", "erro de digitação: cheescake");
ok(fi("nutela") === "nutella", "nutela → nutella");
ok(fi("só quero besteira") === "vago", "vago");
ok(fi("pizza") === "salgado", "salgado");
ok(fi("xyzabc") === "desconhecido", "desconhecido");
const s = interpretar("sorvete de morango gelado");
ok(s.tipo === "familia" && s.chips.includes("morango") && s.temperatura === "gelado", "modificadores no texto");
const bc = interpretar("bolo de chocolate");
ok(bc.tipo === "familia" && bc.chips.every((c) => bc.familia.chips.some((x) => x.id === c)), "só chips que existem na família");

// Exemplo do Bloco 3: bolo de chocolate chocolatudo, fofinho, cobertura, quente
const bolo = base({ familia: fam("bolo-chocolate"), chips: ["chocolatudo", "fofinho", "cobertura"], temperatura: "quente" });
const vulcao = pontuar(bolo, RECEITAS.find((r) => r.id === "bolo-caneca-vulcao")!);
ok(vulcao?.match === 93, "bolo vulcão = 93% (fofinho também fixa densidade)", String(vulcao?.match));
const rec = recomendar(bolo);
ok(rec.melhor?.receita.id === "bolo-caneca-vulcao", "melhor match é o vulcão", rec.melhor?.receita.id);
ok(!rec.todos.some((x) => x.receita.familia === "mousse"), "mousse não entra (outra experiência, gelada)");
ok(rec.todos.every((x) => x.match <= 99), "nunca 100%");

// Produto específico: Nutella original vem primeiro
const nut = recomendar(base({ familia: fam("nutella"), chips: ["original"] }));
ok(nut.melhor?.receita.marcas.includes("original") ?? false, "Nutella 'original' → original na medida primeiro", nut.melhor?.receita.id);

// Restrições
const semLac = recomendar(base({ familia: fam("brigadeiro"), restricoes: ["lactose"] }));
ok(semLac.todos.length > 0 && semLac.todos.every((x) => x.receita.id === "brigadeiro-banana-cacau" || !x.receita.ingredientes.some((i) => !i.opcional && !i.troca && ["whey", "leite", "leite-po", "leite-condensado"].includes(i.id))), "sem lactose filtra lácteos");
const vegano = recomendar(base({ familia: fam("brownie"), restricoes: ["vegana"] }));
ok(vegano.todos.every((x) => x.receita.marcas.includes("vegana")), "vegana só traz receita vegana");

// Tempo e equipamento
const rapido = recomendar(base({ familia: fam("brownie"), tempoMax: 5 }));
ok(rapido.todos.every((x) => x.receita.tempoMin <= 5), "respeita o tempo");
const semMicro = recomendar(base({ familia: fam("bolo-caneca"), equip: ["forno"] }));
ok(semMicro.todos.every((x) => x.receita.equip !== "micro-ondas"), "sem micro-ondas, nada de micro-ondas");

// Ingredientes
const pouco = recomendar(base({ familia: fam("brownie"), tenho: ["ovo", "banana", "cacau"], podeComprar: false }));
ok(pouco.todos.every((x) => x.faltam.length === 0 || x.receita.ingredientes.filter((i) => x.faltam.includes(i.id)).every((i) => i.troca)), "sem poder comprar, só falta o que tem troca");

// Página e registros
const pag = existsSync("app/ferramentas/mata-a-vontade/page.tsx") ? readFileSync("app/ferramentas/mata-a-vontade/page.tsx", "utf8") : "";
ok(/Tá com vontade de quê\?/.test(pag), "título A na página");
ok(/receita em teste/i.test(readFileSync("components/mata-vontade/MataVontade.tsx", "utf8")), "selo de receita em teste no componente");
ok(/mata-a-vontade/.test(readFileSync("app/sitemap.ts", "utf8")), "no sitemap");
ok(/mata-a-vontade/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")), "no catálogo");
ok(!/magnesio|magnésio|deficiencia de|deficiência de/i.test(readFileSync("components/mata-vontade/MataVontade.tsx", "utf8")), "sem diagnóstico no componente");

console.log(falhas ? `\n${falhas} FALHA(S)` : "\nTODOS OS TESTES PASSARAM");
process.exit(falhas ? 1 : 0);
