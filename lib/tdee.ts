/**
 * Calculadora de TMB e Gasto Calórico (TDEE) — dados e regras.
 *
 * Este arquivo é deliberadamente FINO: a matemática inteira — Mifflin-St
 * Jeor, fatores de atividade, normalização de dígito brasileiro,
 * arredondamento de exibição — mora em lib/calorias.ts e é REUSADA daqui.
 * A Calculadora de Déficit usa as mesmas funções; se as duas ferramentas
 * tivessem contas próprias, uma hora divergiriam em 10 kcal e o site
 * estaria se contradizendo. O que vive aqui é só o que é específico desta
 * ferramenta: os textos dela, o registro de artigos dela e a comparação
 * entre níveis de atividade.
 *
 * A separação de papéis no ecossistema, que este arquivo respeita:
 *   TMB/TDEE  → "quanto eu gasto?"
 *   Déficit   → "quanto eu poderia consumir abaixo disso?"
 *   Macros    → "como distribuir essa meta?"
 *   Proteína  → "quanto de proteína?"
 */

import { NIVEIS, calculaTDEE, type Faixa } from "@/lib/calorias";

export {
  ALTURA_MAX,
  ALTURA_MIN,
  DICA_ATIVIDADE,
  DISCLAIMER,
  DISCLAIMER_ESPECIAL,
  IDADE_ADULTA,
  IDADE_MAX,
  IDADE_MIN,
  NIVEIS,
  NOTA_SEM_DUPLA_CONTAGEM,
  ORIENTACAO_MENOR_IDADE,
  PESO_MAX,
  PESO_MIN,
  REFERENCIA_TMB,
  arredondaKcal,
  calculaTDEE,
  calculaTMB,
  formataFaixa,
  formataKcal,
  normalizaAltura,
  normalizaIdade,
  normalizaNumero,
  tmbPorSexo,
  type Faixa,
  type NivelAtividade,
  type Sexo,
} from "@/lib/calorias";

// ─── Textos próprios da ferramenta ───────────────────────────────────────────

export const ZERO_STATE =
  "Preencha seus dados para estimar quantas calorias seu corpo utiliza em repouso e ao longo do dia.";

export const EXPLICA_TMB =
  "Uma estimativa da energia que seu organismo utilizaria em repouso, só para manter funções vitais — coração, respiração, temperatura, cérebro.";

export const EXPLICA_TDEE =
  "Essa é uma estimativa das calorias que seu corpo utiliza ao longo de um dia inteiro, considerando os dados e o nível de atividade informados.";

export const EXPLICA_MANUTENCAO =
  "Se o seu gasto real estiver próximo dessa estimativa, consumir uma quantidade semelhante de calorias tenderia, em média, a ficar próximo da manutenção do peso.";

export const NOTA_NAO_E_MEDICAO =
  "Nenhuma equação online consegue medir exatamente quanto você gasta no mundo real. O cálculo funciona melhor como ponto de partida, que pode ser ajustado observando sua evolução real ao longo das semanas.";

export const NOTA_NAO_E_PRESCRICAO =
  "Esta calculadora estima gasto energético. Ela não define automaticamente quantas calorias você deve consumir — esse é o papel da Calculadora de Déficit, com um objetivo escolhido por você.";

/**
 * A nota que evita a promessa clássica de "seu treino somou X kcal": o
 * fator de atividade é uma estimativa ampla da rotina inteira e não separa
 * treino, deslocamento, trabalho e digestão.
 */
export const NOTA_ATIVIDADE_AMPLA =
  "O fator de atividade representa sua rotina inteira — não dá para separar quanto veio do treino, do trabalho ou do deslocamento. Por isso a ferramenta nunca diz que o exercício 'somou' um número exato de calorias.";

export const NOTA_BMR_RMR =
  "Tecnicamente, taxa metabólica basal (TMB) e taxa metabólica de repouso não são exatamente a mesma medida — a basal é aferida em condições mais estritas. Calculadoras online usam TMB como o termo mais conhecido para essa estimativa de repouso.";

// ─── Ganho de massa: o superávit ─────────────────────────────────────────────

/**
 * A faixa de superávit para ganho de massa — 200 a 400 kcal acima do gasto.
 *
 * Os números vêm do próprio acervo (artigo "como ganhar massa muscular"):
 * superávit moderado é suficiente para maximizar o ganho muscular, e
 * superávits grandes aceleram o ganho de gordura sem acelerar
 * proporcionalmente o de músculo. A ferramenta usa a MESMA faixa que os
 * artigos ensinam — número que muda de página para página não é referência.
 */
export const SUPERAVIT_MIN = 200;
export const SUPERAVIT_MAX = 400;

export const NARRATIVA_GANHO =
  "Para ganhar massa magra, o caminho é comer um pouco ACIMA do gasto — não muito acima. Um superávit moderado dá energia para treinar e construir tecido novo; superávits grandes aceleram o ganho de gordura, não o de músculo. Proteína adequada e treino de força fazem parte da equação.";

/** A faixa de ingestão para ganho, calculada sobre o gasto da pessoa. */
export function faixaGanho(tdee: Faixa): Faixa {
  return { min: tdee.min + SUPERAVIT_MIN, max: tdee.max + SUPERAVIT_MAX };
}

// ─── Comparação de atividade ─────────────────────────────────────────────────

/**
 * O mesmo corpo nos cinco níveis. Existe para a pessoa VER quanto a escolha
 * do fator mexe no resultado — e entender que a diferença entre "moderado"
 * e "muito ativo" não é um detalhe, é ~450 kcal por dia. A ordem é sempre a
 * do banco de níveis; nada aqui incentiva escolher o número que a pessoa
 * gostaria de ver.
 */
export function comparaAtividades(tmb: Faixa): { id: string; titulo: string; fator: number; tdee: Faixa }[] {
  return NIVEIS.map((n) => ({ id: n.id, titulo: n.titulo, fator: n.fator, tdee: calculaTDEE(tmb, n.fator) }));
}

// ─── Onde a calculadora aparece ──────────────────────────────────────────────

/**
 * Artigos que exibem ESTA calculadora no primeiro corte editorial.
 *
 * Os dois embedavam a Calculadora de Déficit até esta ferramenta existir —
 * e migraram porque a pergunta dos dois é "quanto eu gasto?", não "quanto
 * cortar?". A regra de uma ferramenta por artigo continua valendo: eles
 * saíram do registro do déficit ao entrar aqui.
 */
export const ARTIGOS_COM_CALCULADORA_TDEE: string[] = [
  "como-calcular-tmb-tdee-calorias",
  "quantas-calorias-eu-gasto-por-dia",
];
