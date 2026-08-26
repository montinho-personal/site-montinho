import { retrieve } from "./lib/ask/knowledge";
for (const q of ["Qual melhor divisão?","qual a melhor divisão de treino","divisão de treino","Qual melhor divisão de treino para hipertrofia?"]) {
  const r = retrieve(q);
  console.log(`\n"${q}"`);
  console.log("  evidence:", r.evidence, "| chunks:", r.chunks.length, "| sources:", r.sources.length);
  r.sources.slice(0,4).forEach(s=>console.log("   -", s.slug));
}
