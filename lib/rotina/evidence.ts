/**
 * Base de evidência do motor do Treino Para Minha Rotina.
 *
 * Cada princípio que o motor usa está documentado aqui com a referência que o
 * sustenta e a data da última revisão. Se um princípio não está nesta lista,
 * o motor não pode usá-lo como justificativa.
 *
 * Hierarquia adotada: position stands e meta-análises > ensaios controlados >
 * experiência prática documentada no próprio site.
 */

export interface EvidenceEntry {
  id: string;
  /** O princípio que o motor aplica. */
  principle: string;
  /** Referência principal (autor/entidade, ano, identificador). */
  reference: string;
  pmid?: string;
  /** O que a evidência sustenta — e o que ela NÃO sustenta. */
  scope: string;
}

/** Última revisão desta base. Atualizar ao revisar as regras do motor. */
export const EVIDENCE_REVIEWED_AT = "2026-08-26";

export const EVIDENCE: EvidenceEntry[] = [
  {
    id: "volume_over_split",
    principle:
      "Com volume semanal equiparado, diferentes divisões (full body vs. dividido) produzem ganhos semelhantes de força e hipertrofia. A divisão é uma forma de distribuir o trabalho, não um fator mágico.",
    reference:
      "Evangelista et al. / revisões comparando split vs. full-body com volume equiparado",
    pmid: "38595233",
    scope:
      "Sustenta tratar a divisão como ferramenta de distribuição e priorizar aderência e preferência. Não sustenta afirmar superioridade fixa de nenhuma divisão.",
  },
  {
    id: "acsm_rt_guidelines",
    principle:
      "Treinamento de força 2x/semana por grupamento já produz adaptações relevantes de força, hipertrofia e função em adultos saudáveis; progressão e esforço importam mais que a arquitetura exata.",
    reference: "ACSM — Resistance Training Prescription position stand (2026)",
    pmid: "41843416",
    scope:
      "Sustenta recomendar estruturas de 2–3 dias como plenamente válidas. Não sustenta prescrição individual de cargas.",
  },
  {
    id: "prescription_network",
    principle:
      "Múltiplas combinações de frequência, volume e intensidade levam a resultados comparáveis; não existe uma prescrição única superior para todos.",
    reference:
      "Currier et al., network meta-analysis de prescrições de treinamento de força",
    pmid: "37414459",
    scope:
      "Sustenta comunicar equivalência entre estratégias e escolher pela rotina. Não sustenta percentuais de superioridade entre divisões.",
  },
  {
    id: "minimal_dose",
    principle:
      "Estratégias de dose mínima (sessões curtas, poucos exercícios multiarticulares, esforço adequado) produzem adaptações reais quando o tempo é a principal barreira — sem necessariamente maximizar resultados.",
    reference: "Iversen/Fyfe et al., Resistance Exercise Minimal Dose Strategies",
    pmid: "38509414",
    scope:
      "Sustenta 'menos tempo muda a estratégia, não torna o treino inútil'. Não sustenta prometer resultados máximos com tempo mínimo.",
  },
  {
    id: "implementation_intentions",
    principle:
      "Transformar intenção em plano concreto (dia, hora, lugar) aumenta a chance de execução de atividade física.",
    reference: "Meta-análises de implementation intentions e atividade física",
    pmid: "30427874",
    scope:
      "Sustenta a etapa de escolher dias concretos após o resultado. Não sustenta prazos fixos de formação de hábito (ex.: '21 dias').",
  },
  {
    id: "sdt_adherence",
    principle:
      "Autonomia e senso de competência sustentam a motivação para exercício melhor do que pressão externa. Preferência do praticante é variável legítima de prescrição.",
    reference: "Self-Determination Theory aplicada ao exercício (Ryan/Deci e derivados)",
    pmid: "40256835",
    scope:
      "Sustenta respeitar preferência por full body ou dividido e evitar copy de culpa. Não sustenta afirmações neurobiológicas sobre motivação.",
  },
  {
    id: "beginner_dose",
    principle:
      "Iniciantes progridem com menos sessões e menos volume do que avançados; disponibilidade alta não implica necessidade de usar todos os dias livres.",
    reference: "ACSM position stand + literatura de dose-resposta em iniciantes",
    pmid: "41843416",
    scope:
      "Sustenta recomendar 3 sessões a um iniciante com 5 dias livres. Não sustenta impedir quem quer treinar mais — o dia extra vira opcional.",
  },
  {
    id: "recovery_distribution",
    principle:
      "Dias consecutivos de treino favorecem estruturas que alternam grupamentos (upper/lower, ênfases alternadas), evitando estimular o mesmo grupamento em sessões seguidas sem recuperação.",
    reference: "NSCA Essentials of Strength Training and Conditioning; literatura de frequência e recuperação",
    scope:
      "Sustenta adaptar a estrutura à distribuição real dos dias. Não sustenta proibir dias consecutivos — a vida real vence o calendário perfeito.",
  },
  {
    id: "montinho_practice",
    principle:
      "A experiência documentada no site (própria transformação de -40 kg e acompanhamento de alunos com rotina apertada em Alphaville) prioriza estruturas que o aluno consegue repetir: consistência antes de complexidade.",
    reference: "Conteúdo institucional e artigos do próprio site (minha-historia, consultoria, blog)",
    scope:
      "Sustenta o tom e a priorização de aderência. Nunca substitui a evidência dos itens acima — quando divergirem, a ciência prevalece na regra e a prática aparece como 'aplicação'.",
  },
];
