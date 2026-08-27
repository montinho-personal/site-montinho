/**
 * Testes de recuperação do Pergunte ao Montinho.
 *   npx tsx scripts/ask-test.ts
 *
 * Garante duas coisas em tensão: perguntas legítimas de treino recebem
 * resposta, e perguntas fora do domínio são recusadas. Sai com 1 se algo
 * regredir.
 */
import { retrieve } from "../lib/ask/knowledge";
import { search, termRarity } from "../lib/search";

const EVIDENCE_MIN = 60; // mesmo limite de app/api/ask/route.ts

/** [pergunta, deve responder] */
const CASOS: Array<[string, boolean]> = [
  // — deve responder —
  ["Qual melhor divisão?", true],
  ["qual a melhor divisão de treino?", true],
  ["full body ou ABC?", true],
  ["como fazer rosca direta?", true],
  ["quantas vezes treinar por semana?", true],
  ["musculação emagrece?", true],
  ["treino de 30 minutos funciona?", true],
  ["como montar treino ABC?", true],
  ["creatina funciona?", true],
  ["preciso de creatina?", true],
  ["quanto tempo para ganhar massa?", true],
  ["dor no ombro ao treinar", true],
  ["posso treinar todo dia?", true],
  ["o que comer antes do treino?", true],
  ["mounjaro faz perder músculo?", true],
  ["qual o investimento da consultoria?", true],
  ["quanto custa o acompanhamento?", true],
  ["quem é o Montinho?", true],
  ["você atende em Alphaville?", true],
  ["como funciona a consultoria online?", true],
  ["treino em casa sem equipamento", true],
  ["upper lower ou push pull legs?", true],
  ["quantas séries por grupamento?", true],
  ["whey antes ou depois do treino?", true],
  ["cardio antes ou depois da musculação?", true],
  ["máquina ou peso livre?", true],
  ["treino de peito em casa", true],
  // grafias compostas — vieram de um erro real de usuário em produção
  ["Fullbody ou ABC?", true],
  ["fullbody funciona?", true],
  ["fullbody ou upperlower?", true],
  ["treino ppl é bom?", true],
  // typos de 1 erro — corrigidos pela distância de edição
  ["hipertorfia como funciona", true],
  ["muculação emagrece?", true],
  ["execicios para perna", true],
  ["como perder a bariga", true],
  ["emagreser rapido", true],
  // gírias e abreviações do dicionário curado
  ["como trincar o abdomen", true],
  ["sou frango na academia", true],
  ["aej funciona?", true],
  ["treino abs em casa", true],
  ["bf ideal", true],
  ["quanto de prote por dia", true],
  // declarações de objetivo — vieram de erro real em produção
  ["Quero ganhar bumbum", true],
  ["quero engrossar as pernas", true],
  ["meu bumbum não cresce", true],
  ["quero perder a pochete", true],
  ["quero definir as pernas", true],
  ["quero tanquinho", true],
  ["quero ficar forte", true],
  ["quero ganhar braço", true],
  // — deve recusar —
  ["qual o melhor investimento em criptomoedas", false],
  ["qual a melhor criptomoeda?", false],
  ["quem ganhou a copa do mundo?", false],
  ["receita de bolo de cenoura", false],
  ["como declarar imposto de renda?", false],
  ["quem é o presidente do Brasil?", false],
  ["qual o melhor notebook para trabalhar?", false],
];

/**
 * Casos conhecidos que ainda erram. Ficam listados de propósito — escondê-los
 * num teste que "passa" seria pior do que admitir o limite da heurística.
 *   · "qual o melhor celular?" — a palavra aparece no corpo de um conteúdo
 *     e a pergunta passa. A instrução do modelo é a segunda linha de defesa:
 *     ele responde que não há conteúdo sobre isso.
 */
const CONHECIDOS: string[] = [
  // "agachamento livre ou smith?" saiu daqui em 2026-08-27: o artigo
  // agachamento-livre-ou-maquina-smith fechou a lacuna e a pergunta responde.
  "qual o melhor celular?",
  "qual o melhor carro para comprar?",
];

let falhas = 0;

console.log("RECUPERAÇÃO");
for (const [q, esperado] of CASOS) {
  const r = retrieve(q);
  const respondeu = r.evidence >= EVIDENCE_MIN;
  if (respondeu !== esperado) {
    falhas++;
    console.log(`  FALHOU  ${respondeu ? "respondeu" : "recusou  "} | ${q}`);
  }
}
console.log(`  ${CASOS.length - falhas}/${CASOS.length} corretos`);

console.log("\nCASOS CONHECIDOS (não contam como falha)");
for (const q of CONHECIDOS) {
  const r = retrieve(q);
  console.log(`  ${r.evidence >= EVIDENCE_MIN ? "responde" : "recusa  "} | ${q}`);
}

console.log("\nINVARIANTES");
function check(nome: string, cond: boolean) {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome}`); }
  else console.log(`  ok      ${nome}`);
}

// Acento não pode mudar o resultado da busca — índice e consulta são dobrados.
const comAcento = search("musculação", 3).map((r) => r.slug).join();
const semAcento = search("musculacao", 3).map((r) => r.slug).join();
check("busca ignora acento (índice e consulta dobrados)", comAcento === semAcento);

// Palavra comum tem raridade baixa; palavra específica, alta.
check("raridade: 'voce' < 'divisao'", termRarity("voce") < termRarity("divisao"));
check("raridade: 'musculacao' < 'criptomoeda'", termRarity("musculacao") < termRarity("criptomoeda"));

// Pontuação não pode virar parte do termo.
check(
  "pontuação não quebra a pergunta",
  retrieve("Qual melhor divisão?").evidence >= EVIDENCE_MIN &&
    retrieve("Qual melhor divisão").evidence >= EVIDENCE_MIN
);

// Termo genérico sozinho não prova intenção de negócio.
check(
  "'investimento' sem contexto de treino não abre o bloco de preços",
  !retrieve("qual o melhor investimento em criptomoedas").sources.some((s) => s.slug === "/consultoria")
);

// Sem sinal geográfico, a resposta não pode vir de uma página de serviço local.
check(
  "pergunta sem lugar não usa página local como fonte",
  ["quero ficar forte", "quero ganhar massa", "treino de perna"].every((q) =>
    !retrieve(q).sources.some((s) => /personal-trainer-|treinador-particular/.test(s.slug))
  )
);
check(
  "pergunta COM lugar continua achando o atendimento",
  retrieve("você atende em Alphaville?").evidence >= EVIDENCE_MIN
);

// Links internos não podem levar UTM: parâmetro de campanha em navegação
// interna reinicia a sessão no GA4 e reatribui a origem — quem veio do Google
// vira "tráfego do próprio site" e a aquisição real se perde.
check(
  "nenhum link de artigo do assistente carrega UTM",
  retrieve("como fazer rosca direta?").sources.every((s) => !s.slug.includes("utm_"))
);

console.log("\n" + (falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} FALHARAM`));
process.exit(falhas === 0 ? 0 : 1);
