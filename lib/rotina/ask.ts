import { normaliza } from "@/lib/treino/exercicios";

/**
 * Pergunte ao Montinho → Treino Para Minha Rotina.
 * "treino 4x por semana", "PPL ou upper lower?", "como dividir treino 3 dias",
 * "perdi um treino" ganham o atalho para montar a semana. Com número de dias,
 * a ferramenta abre já com ele (?dias=N).
 */
export function detectaRotina(pergunta: string): { titulo: string; href: string; dias: number | null } | null {
  const t = normaliza(pergunta);
  const m = t.match(/\b([2-6])\s*(?:x|vezes|dias)\s*(?:por|na|a)?\s*semana\b/) ?? t.match(/\b(?:treino|treinar|dividir|divisao)\b[^?]*\b([2-6])\s*(?:x|vezes|dias)\b/);
  const dias = m ? Number(m[1]) : null;
  const sobreDivisao =
    /\bdivisao de treino\b|\bdividir (o )?treino\b|\b(ppl|push pull legs|upper lower|upper\/lower|full body|abcd?e?)\b.*\bou\b|\bou\b.*\b(ppl|push pull legs|upper lower|upper\/lower|full body|abcd?e?)\b|\bperdi (um |o )?treino\b|\bquantas vezes (por semana )?(devo |preciso )?treinar\b|\bquantos dias (por semana )?(devo |preciso )?treinar\b/.test(t);
  if (!dias && !sobreDivisao) return null;
  if (dias && !/treino|treinar|musculacao|academia|divid|divisao|malhar|musculacao/.test(t)) return null;
  return {
    dias,
    titulo: dias ? `Montar a minha semana com ${dias} treinos` : "Descobrir qual divisão encaixa na minha rotina",
    href: dias ? `/treino-para-minha-rotina?dias=${dias}` : "/treino-para-minha-rotina",
  };
}
