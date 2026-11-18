/**
 * Calculadora de preço de personal trainer para Alphaville e região.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 * As faixas abaixo NÃO são pesquisa de campo. São a referência editorial do
 * portal Personal por Perto (personalporperto.com.br), montada por perfil de
 * cidade, consultada em 18/11/2026. Não existe amostra: por isso a tela
 * nunca diz "preço médio", nunca cita quantidade de profissionais e nunca
 * mostra valor exato, só faixa.
 *
 * Quando este site tiver preços reais coletados (com data e fonte), eles
 * entram em REFERENCIAS com `origem` própria e a tela passa a dizer quantos
 * são e de quando.
 *
 * A CONTA (toda no navegador, sem servidor e sem IA)
 *
 *  - sessões por mês = vezes por semana × 52 ÷ 12, arredondado;
 *  - 2 e 3 vezes por semana: a faixa mensal é o próprio dado de pacote da
 *    referência, que é definido para essa frequência;
 *  - 1, 4 e 5 vezes: o valor por aula dentro do pacote (faixa mensal ÷ 11,
 *    a média entre 9 e 13 sessões) × sessões do mês, marcado como
 *    extrapolação;
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

export interface Referencia {
  nome: string;
  /** Aula avulsa presencial. */
  avulsa: Faixa;
  /** Pacote mensal presencial de 2 a 3 vezes por semana. */
  mensal: Faixa;
  /** Acompanhamento online, por mês. */
  online: Faixa;
}

export const REFERENCIAS: Record<RefId, Referencia> = {
  alphaville: { nome: "Alphaville", avulsa: [100, 250], mensal: [500, 1500], online: [220, 550] },
  barueri: { nome: "Barueri", avulsa: [90, 220], mensal: [450, 1300], online: [200, 500] },
  "santana-de-parnaiba": { nome: "Santana de Parnaíba", avulsa: [90, 220], mensal: [450, 1300], online: [190, 500] },
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
    aviso: "Tamboré não tem faixa própria na referência. O resultado usa a referência de Barueri.",
  },
  {
    id: "aldeia-da-serra",
    nome: "Aldeia da Serra",
    ref: "santana-de-parnaiba",
    aviso: "Aldeia da Serra não tem faixa própria na referência. O resultado usa a referência de Santana de Parnaíba.",
  },
  {
    id: "barueri-centro",
    nome: "Centro de Barueri",
    ref: "barueri",
    aviso: "A referência é da cidade de Barueri inteira, não só do centro.",
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

/** Média entre 9 e 13 sessões: quantas aulas o pacote de 2 a 3 vezes por semana representa. */
export const SESSOES_DO_PACOTE = 11;

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
  /** true quando a faixa mensal foi calculada (1, 4 e 5 vezes), não lida direto da referência. */
  extrapolado: boolean;
  /** A conta, linha a linha, para quem quiser conferir. */
  memoria: string[];
}

export function calcular(localId: LocalId, formatoId: FormatoId, freq: Frequencia): Resultado {
  const local = LOCAIS.find((l) => l.id === localId)!;
  const formato = FORMATOS.find((f) => f.id === formatoId)!;
  const ref = REFERENCIAS[local.ref];
  const sessoes = sessoesPorMes(freq);
  const memoria: string[] = [];
  const origem = `Referência usada: ${ref.nome} (${FONTE_REFERENCIA.rotulo} do ${FONTE_REFERENCIA.nome}, não é pesquisa de preços).`;

  if (!formato.presencial) {
    memoria.push(origem);
    memoria.push(`Acompanhamento online em ${ref.nome}: ${faixaTxt(ref.online)} por mês.`);
    memoria.push("Online é cobrado por mês, não por aula: a frequência escolhida não muda a faixa.");
    return { local, formato, ref, freq, sessoes, mensal: ref.online, avulsa: null, aulaNoPacote: null, extrapolado: false, memoria };
  }

  memoria.push(origem);
  memoria.push(`Sessões por mês: ${freq} × 52 ÷ 12 = ${((freq * 52) / 12).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}, arredondado para ${sessoes}.`);
  memoria.push(`Aula avulsa presencial em ${ref.nome}: ${faixaTxt(ref.avulsa)}.`);
  memoria.push(`Pacote mensal de 2 a 3 vezes por semana em ${ref.nome}: ${faixaTxt(ref.mensal)}.`);

  const extrapolado = freq !== 2 && freq !== 3;
  let mensal: Faixa;
  if (!extrapolado) {
    mensal = [arredondar(ref.mensal[0]), arredondar(ref.mensal[1])];
    memoria.push(`${freq} vezes por semana está dentro do pacote da referência: a faixa mensal é a própria faixa do pacote.`);
  } else {
    const min = (ref.mensal[0] / SESSOES_DO_PACOTE) * sessoes;
    const max = (ref.mensal[1] / SESSOES_DO_PACOTE) * sessoes;
    mensal = [arredondar(min), arredondar(max)];
    memoria.push(
      `${freq} ${freq === 1 ? "vez" : "vezes"} por semana está fora do pacote da referência, então é extrapolação: faixa do pacote ÷ ${SESSOES_DO_PACOTE} sessões × ${sessoes} sessões = ${brl(Math.round(min))} a ${brl(Math.round(max))}.`,
    );
  }
  const aulaNoPacote: Faixa = [arredondar(mensal[0] / sessoes), arredondar(mensal[1] / sessoes)];
  memoria.push(`Cada aula dentro do pacote: faixa mensal ÷ ${sessoes} sessões = ${faixaTxt(aulaNoPacote)}.`);
  memoria.push("Arredondamento: dezena mais próxima até R$ 1.000, cinquentena acima.");

  return { local, formato, ref, freq, sessoes, mensal, avulsa: ref.avulsa, aulaNoPacote, extrapolado, memoria };
}

/** Linhas da tabela da página: Alphaville, presencial, de 1 a 5 vezes por semana. */
export function tabelaPorFrequencia(localId: LocalId = "alphaville") {
  return FREQUENCIAS.map((f) => calcular(localId, "condominio", f));
}
