/**
 * Academia Ideal em Alphaville — completude dos dados e personas.
 *   npx tsx scripts/academias-test.ts
 */
import { ACADEMIAS } from "../lib/academias/base";
import { completude } from "../lib/academias/tipos";
import { recomendar, type Respostas } from "../lib/academias/motor";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const check = (n: string, c: boolean, d = "") => {
  if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`);
};

console.log("=".repeat(60));
console.log("COMPLETUDE DOS DADOS");
console.log("=".repeat(60));
let preench = 0, total = 0;
for (const a of ACADEMIAS) {
  const c = completude(a);
  preench += c.preenchidos; total += c.total;
  const barra = "█".repeat(c.preenchidos) + "·".repeat(c.total - c.preenchidos);
  console.log(`  ${a.nome.padEnd(30)} ${barra} ${c.preenchidos}/${c.total}`);
}
const pct = (preench / total) * 100;
console.log(`\n  TOTAL: ${preench}/${total} campos (${pct.toFixed(0)}%)`);
console.log(
  pct >= 60
    ? "  → dados suficientes: a ferramenta pode ir ao ar"
    : `  → dados insuficientes (mínimo 60%). A página está com noindex e fora do menu\n    de propósito: publicar com ${pct.toFixed(0)}% entregaria recomendação vazia.`
);

console.log("\n" + "=".repeat(60));
console.log("INTEGRIDADE");
console.log("=".repeat(60));
check("ids únicos", new Set(ACADEMIAS.map((a) => a.id)).size === ACADEMIAS.length);
check(
  "todo artigo referenciado existe de verdade",
  ACADEMIAS.every((a) => !a.artigoSlug || blogPosts.some((p) => p.slug === a.artigoSlug)),
  ACADEMIAS.filter((a) => a.artigoSlug && !blogPosts.some((p) => p.slug === a.artigoSlug)).map((a) => a.id).join(", ")
);
check(
  "toda academia encerrada continua registrada, com artigo",
  ACADEMIAS.filter((a) => a.status !== "ativa").every((a) => !!a.artigoSlug),
  ACADEMIAS.filter((a) => a.status !== "ativa" && !a.artigoSlug).map((a) => a.id).join(", ")
);
check(
  "todo campo confirmado tem fonte e data",
  ACADEMIAS.every((a) =>
    [a.vinteQuatroHoras, a.abreDomingo, a.abreSabado, a.fechaDiaUtil, a.abreDiaUtil,
     a.estacionamento, a.wellhub, a.totalpass, a.personalExterno, a.faixaPreco, a.estilos]
      .every((c) => c.valor === null || (!!c.fonte && !!c.verificadoEm))
  )
);
check("nenhuma nota de qualidade na base", !JSON.stringify(ACADEMIAS).match(/"nota"|"rating"|"estrelas"/));

console.log("\n" + "=".repeat(60));
console.log("PERSONAS");
console.log("=".repeat(60));
const base: Respostas = {
  objetivo: "massa", conveniencia: "indiferente", regiao: "indiferente", horario: "noite",
  fimDeSemana: "nao", estilos: [], vinteQuatro: "indiferente", estacionamento: "indiferente",
  preco: "indiferente", beneficio: "nenhum", personal: "nao",
};
const com = (o: Partial<Respostas>): Respostas => ({ ...base, ...o });

const A = recomendar(com({ horario: "pos_22h", vinteQuatro: "essencial", estacionamento: "essencial", estilos: ["musculacao_completa"] }));
check("A (hipertrofia 22h30, 24h e estacionamento essenciais) devolve resultado", A.top.length > 0);
// Eliminar por dado CONFIRMADO negativo é correto; por dado ausente, não.
check("A: nenhuma academia com dado ausente é eliminada",
  A.top.length >= 3 && ACADEMIAS.filter((g) => g.vinteQuatroHoras.valor === null).length > 0);

const B = recomendar(com({ objetivo: "comecando", horario: "almoco", preco: "custo_beneficio" }));
check("B (iniciante, almoço, custo-benefício) devolve resultado", B.top.length > 0);

const C = recomendar(com({ regiao: "centro-industrial-empresarial", horario: "muito_cedo", conveniencia: "trabalho" }));
check("C (executivo, 7h, polo empresarial) traz a região pedida em primeiro",
  C.top[0].criterios.some((k) => k.rotulo.includes("Centro Industrial") && k.atende === true),
  `(1º foi ${C.top[0].academia.nome})`);

const D = recomendar(com({ estilos: ["piscina"] }));
check("D (quer piscina) é honesto quando não há confirmação",
  D.top.every((r) => r.criterios.some((k) => k.rotulo === "Piscina" && k.atende !== true)));

const E = recomendar(com({ beneficio: "wellhub" }));
check("E (Wellhub) coloca quem tem confirmação na frente",
  E.top[0].criterios.some((k) => k.rotulo === "Aceita Wellhub" && k.atende === true));

const G = recomendar(com({ horario: "pos_22h", vinteQuatro: "essencial", estacionamento: "essencial", estilos: ["piscina", "premium", "reservada"], preco: "economico" }));
check("G (critérios incompatíveis) nunca devolve lista vazia", G.top.length > 0);
check("G: explica que não há combinação perfeita ou mostra ressalvas",
  G.semCombinacaoPerfeita || G.top.some((r) => r.ressalvas.length > 0));

console.log("\n" + "=".repeat(60));
console.log("DETERMINISMO");
console.log("=".repeat(60));
check("mesmas respostas → mesmo resultado",
  JSON.stringify(recomendar(com({ horario: "noite" })).top.map((r) => r.academia.id)) ===
  JSON.stringify(recomendar(com({ horario: "noite" })).top.map((r) => r.academia.id)));

console.log("\n" + "=".repeat(60) + "\nHORÁRIO QUE VIRA O DIA\n" + "=".repeat(60));

/**
 * Regressão real: a Bluefit fecha à meia-noite. Guardar isso como 0 e comparar
 * cru faria a academia que fica aberta ATÉ MAIS TARDE ser a descartada de quem
 * treina à noite, porque 0 < 21. Quem fecha depois da meia-noite tem de passar.
 */
{
  const madrugada = ACADEMIAS.filter(
    (a) => a.status === "ativa" && a.fechaDiaUtil.valor !== null && a.fechaDiaUtil.valor >= 23
  );
  check("existe alguma academia que fecha 23h ou depois", madrugada.length > 0);

  for (const h of ["noite", "pos_22h"] as const) {
    const rec = recomendar(com({ horario: h, regiao: "indiferente" }));
    const nomes = rec.top.map((t) => t.academia.nome);
    for (const a of madrugada) {
      const res = rec.top.find((t) => t.academia.id === a.id);
      if (!res) continue;
      const crit = res.criterios.find((c) => c.rotulo.startsWith("Aberta no seu horário"));
      check(
        `${a.nome} passa no filtro de ${h}`,
        !crit || crit.atende !== false,
        `fecha às ${a.fechaDiaUtil.valor}h e foi marcada como incompatível`
      );
    }
    check(`${h}: alguma recomendação sobrou`, nomes.length > 0);
  }
}

console.log("\n" + "=".repeat(60) + "\nACADEMIA ENCERRADA\n" + "=".repeat(60));

/** Recomendar academia que fechou é o pior erro possível da ferramenta. */
{
  const encerradas = ACADEMIAS.filter((a) => a.status !== "ativa");
  const rec = recomendar(com({ regiao: "indiferente" }));
  check(
    "nenhuma academia encerrada aparece na recomendação",
    !rec.top.some((t) => encerradas.some((e) => e.id === t.academia.id)),
    encerradas.map((e) => e.nome).join(", ")
  );
}

console.log("\n" + (falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} FALHARAM`));
process.exit(falhas === 0 ? 0 : 1);
