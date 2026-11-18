/**
 * Calculadora de preço de personal trainer para Alphaville e região.
 *
 * DE ONDE VÊM OS NÚMEROS (duas origens, sempre declaradas na tela)
 *
 *  1. Aula dentro do pacote presencial: faixa informada pelo Montinho, que
 *     atende na região, em 18/11/2026. Alphaville, Tamboré e Aldeia da
 *     Serra: R$ 50 a 300 por aula; Barueri e Santana de Parnaíba: R$ 40 a
 *     250. É a leitura de quem trabalha no mercado, não pesquisa com amostra.
 *  2. Aula avulsa e acompanhamento online: referência editorial do portal
 *     Personal por Perto (personalporperto.com.br), montada por perfil de
 *     cidade, consultada em 18/11/2026. Também sem amostra.
 *
 * Por isso a tela nunca diz "preço médio", nunca cita quantidade de
 * profissionais e nunca mostra valor exato, só faixa.
 *
 * A CONTA (toda no navegador, sem servidor e sem IA)
 *
 *  - sessões por mês = vezes por semana × 52 ÷ 12, arredondado;
 *  - faixa mensal presencial = aula dentro do pacote × sessões do mês;
 *  - online é mensal e não muda com a frequência;
 *  - arredondamento único: dezena até R$ 1.000, cinquentena acima;
 *  - recorte sem dado próprio usa o mais amplo e diz isso na tela.
 */

export type RefId = "alphaville" | "barueri" | "santana-de-parnaiba";
export type LocalId = "alphaville" | "tambore" | "aldeia-da-serra" | "barueri-centro" | "santana-de-parnaiba";
export type FormatoId = "condominio" | "academia" | "domicilio" | "online";
export type Frequencia = 1 | 2 | 3 | 4 | 5;
export type Faixa = readonly [number, number];

export const FONTE_REFERENCIA = {
  nome: "Personal por Perto",
  url: "https://www.personalporperto.com.br/ferramentas/calculadora-preco-personal/",
  consultadaEm: "2026-11-18",
  rotulo: "referência editorial",
} as const;

/** Aula dentro do pacote presencial: faixa informada pelo Montinho. */
export const FONTE_PACOTE = {
  nome: "Montinho",
  informadaEm: "2026-11-18",
  rotulo: "faixa informada pelo Montinho, que atende na região",
} as const;

export const PACOTE_AULA: Record<LocalId, Faixa> = {
  alphaville: [50, 300],
  tambore: [50, 300],
  "aldeia-da-serra": [50, 300],
  "barueri-centro": [40, 250],
  "santana-de-parnaiba": [40, 250],
};

export interface Referencia {
  nome: string;
  /** Aula avulsa presencial. */
  avulsa: Faixa;
  /** Acompanhamento online, por mês. */
  online: Faixa;
}

export const REFERENCIAS: Record<RefId, Referencia> = {
  alphaville: { nome: "Alphaville", avulsa: [100, 250], online: [220, 550] },
  barueri: { nome: "Barueri", avulsa: [90, 220], online: [200, 500] },
  "santana-de-parnaiba": { nome: "Santana de Parnaíba", avulsa: [90, 220], online: [190, 500] },
};

export interface Local {
  id: LocalId;
  nome: string;
  ref: RefId;
  /** Texto que aparece na tela quando o recorte usa uma referência mais ampla. Fallback nunca é silencioso. */
  aviso: string | null;
}

export const LOCAIS: Local[] = [
  { id: "alphaville", nome: "Alphaville", ref: "alphaville", aviso: null },
  {
    id: "tambore",
    nome: "Tamboré",
    ref: "barueri",
    aviso: "Aula avulsa e online: Tamboré não tem faixa própria na referência do Personal por Perto, então o resultado usa a de Barueri.",
  },
  {
    id: "aldeia-da-serra",
    nome: "Aldeia da Serra",
    ref: "santana-de-parnaiba",
    aviso: "Aula avulsa e online: Aldeia da Serra não tem faixa própria na referência do Personal por Perto, então o resultado usa a de Santana de Parnaíba.",
  },
  {
    id: "barueri-centro",
    nome: "Centro de Barueri",
    ref: "barueri",
    aviso: "As faixas são da cidade de Barueri inteira, não só do centro.",
  },
  { id: "santana-de-parnaiba", nome: "Santana de Parnaíba", ref: "santana-de-parnaiba", aviso: null },
];

export interface Formato {
  id: FormatoId;
  nome: string;
  presencial: boolean;
  /** O que esse formato muda na prática. Sem número: a referência não separa os formatos presenciais. */
  nota: string;
}

export const FORMATOS: Formato[] = [
  {
    id: "condominio",
    nome: "No condomínio",
    presencial: true,
    nota: "Você não paga academia nem se desloca. O condomínio pode exigir cadastro do profissional ou ter regra de uso do espaço: confirme na administração antes de fechar.",
  },
  {
    id: "academia",
    nome: "Na academia",
    presencial: true,
    nota: "A mensalidade da academia é à parte. Algumas academias cobram taxa de personal externo ou só aceitam profissional cadastrado: pergunte na recepção, porque a regra muda de uma unidade para outra.",
  },
  {
    id: "domicilio",
    nome: "A domicílio",
    presencial: true,
    nota: "O tempo de deslocamento do profissional costuma entrar no preço, e quem não tem equipamento em casa pode pagar pelo material. A referência não separa esse custo: pergunte se ele já está no valor.",
  },
  {
    id: "online",
    nome: "Online",
    presencial: false,
    nota: "Não é o presencial mais barato: é outro serviço. Você recebe o planejamento, os ajustes e o acompanhamento a distância, e treina no seu horário.",
  },
];

export const FREQUENCIAS: Frequencia[] = [1, 2, 3, 4, 5];

/** Arredondamento único da ferramenta: dezena até R$ 1.000, cinquentena acima. */
export function arredondar(valor: number): number {
  const passo = valor <= 1000 ? 10 : 50;
  return Math.round(valor / passo) * passo;
}

export function sessoesPorMes(freq: Frequencia): number {
  return Math.round((freq * 52) / 12);
}

export const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;
export const faixaTxt = (f: Faixa) => `${brl(f[0])} a ${brl(f[1])}`;

export interface Resultado {
  local: Local;
  formato: Formato;
  ref: Referencia;
  freq: Frequencia;
  sessoes: number;
  /** Faixa por mês, já arredondada. */
  mensal: Faixa;
  /** Presencial: faixa da aula avulsa. Online: null. */
  avulsa: Faixa | null;
  /** Presencial: quanto cada aula representa dentro do pacote. Online: null. */
  aulaNoPacote: Faixa | null;
  /** A conta, linha a linha, para quem quiser conferir. */
  memoria: string[];
}

export function calcular(localId: LocalId, formatoId: FormatoId, freq: Frequencia): Resultado {
  const local = LOCAIS.find((l) => l.id === localId)!;
  const formato = FORMATOS.find((f) => f.id === formatoId)!;
  const ref = REFERENCIAS[local.ref];
  const sessoes = sessoesPorMes(freq);
  const memoria: string[] = [];
  const origemRef = `${FONTE_REFERENCIA.rotulo} do ${FONTE_REFERENCIA.nome} para ${ref.nome}, não é pesquisa de preços`;

  if (!formato.presencial) {
    memoria.push(`Acompanhamento online: ${faixaTxt(ref.online)} por mês (${origemRef}).`);
    memoria.push("Online é cobrado por mês, não por aula: a frequência escolhida não muda a faixa.");
    return { local, formato, ref, freq, sessoes, mensal: ref.online, avulsa: null, aulaNoPacote: null, memoria };
  }

  const aula = PACOTE_AULA[local.id];
  const min = aula[0] * sessoes;
  const max = aula[1] * sessoes;
  const mensal: Faixa = [arredondar(min), arredondar(max)];
  memoria.push(`Aula dentro do pacote em ${local.nome}: ${faixaTxt(aula)} (${FONTE_PACOTE.rotulo}; não é pesquisa com amostra).`);
  memoria.push(`Sessões por mês: ${freq} × 52 ÷ 12 = ${((freq * 52) / 12).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}, arredondado para ${sessoes}.`);
  memoria.push(`Faixa mensal: ${brl(aula[0])} × ${sessoes} = ${brl(min)} e ${brl(aula[1])} × ${sessoes} = ${brl(max)}.`);
  memoria.push("Arredondamento: dezena mais próxima até R$ 1.000, cinquentena acima.");
  memoria.push(`Aula avulsa, fora de pacote: ${faixaTxt(ref.avulsa)} (${origemRef}).`);

  return { local, formato, ref, freq, sessoes, mensal, avulsa: ref.avulsa, aulaNoPacote: aula, memoria };
}

/** Linhas da tabela da página: Alphaville, presencial, de 1 a 5 vezes por semana. */
export function tabelaPorFrequencia(localId: LocalId = "alphaville") {
  return FREQUENCIAS.map((f) => calcular(localId, "condominio", f));
}
