/**
 * Beliscômetro — momentos, cálculo, perfil e insight.
 *
 * A conta é só energia: gramas × kcal/100 g × vezes por dia. As perguntas
 * de comportamento NÃO mexem no número — escolhem o perfil e o texto. Nada
 * aqui converte caloria em quilo; isso é tarefa (com ressalvas) do capítulo
 * da balança.
 */
import { POR_ID, type Alimento, type Tag } from "./alimentos";

export type Perfil = "automatico" | "social" | "passagem" | "noturno" | "so-um" | "compartilhado";

export type Momento = { id: string; rotulo: string; emoji: string; hora: string; perfil?: Perfil; frase?: string };

/** Em ordem do dia: a ordem também monta a linha do tempo do resultado. */
export const MOMENTOS: Momento[] = [
  { id: "trabalho", rotulo: "Enquanto trabalho", emoji: "💻", hora: "10:30", perfil: "automatico", frase: "enquanto trabalha" },
  { id: "depois-almoco", rotulo: "Depois do almoço", emoji: "🍽️", hora: "13:30", perfil: "so-um", frase: "depois do almoço" },
  { id: "cafe-tarde", rotulo: "Café da tarde", emoji: "☕", hora: "16:00", perfil: "so-um", frase: "no café da tarde" },
  { id: "carro", rotulo: "No carro", emoji: "🚗", hora: "18:10", perfil: "automatico", frase: "no carro" },
  { id: "cozinha", rotulo: "Quando passo pela cozinha", emoji: "🚪", hora: "18:40", perfil: "passagem", frase: "ao passar pela cozinha" },
  { id: "preparando", rotulo: "Enquanto preparo comida", emoji: "🍳", hora: "19:20", perfil: "passagem", frase: "enquanto prepara a comida" },
  { id: "tv", rotulo: "Assistindo TV / Netflix", emoji: "📺", hora: "21:00", perfil: "automatico", frase: "em frente à TV" },
  { id: "videogame", rotulo: "Durante videogame", emoji: "🎮", hora: "21:30", perfil: "automatico", frase: "no videogame" },
  { id: "futebol", rotulo: "Durante futebol", emoji: "⚽", hora: "21:45", perfil: "social", frase: "vendo futebol" },
  { id: "noite", rotulo: "À noite", emoji: "🌙", hora: "22:30", perfil: "noturno", frase: "à noite" },
  { id: "madrugada", rotulo: "De madrugada", emoji: "🌌", hora: "01:30", perfil: "noturno", frase: "de madrugada" },
  { id: "festas", rotulo: "Em festas", emoji: "🎉", hora: "20:00", perfil: "social", frase: "em festas" },
  { id: "churrasco", rotulo: "Em churrascos", emoji: "🔥", hora: "14:00", perfil: "social", frase: "em churrascos" },
  { id: "bar", rotulo: "Em bar / happy hour", emoji: "🍻", hora: "19:00", perfil: "social", frase: "no bar" },
  { id: "viagem", rotulo: "Durante viagens", emoji: "✈️", hora: "11:00", perfil: "automatico", frase: "em viagens" },
  { id: "sem-horario", rotulo: "Não tenho horário específico", emoji: "🔁", hora: "15:00", perfil: "so-um", frase: "ao longo do dia, sem horário certo" },
  { id: "outro", rotulo: "Outro", emoji: "➕", hora: "17:00" },
];
export const MOMENTO: Record<string, Momento> = Object.fromEntries(MOMENTOS.map((m) => [m.id, m]));

/** Frequência: vezes por dia; as semanais viram média diária (3/7 e 2/7). */
export const FREQUENCIAS = [
  { id: "1", rotulo: "1 vez ao dia", porDia: 1 },
  { id: "2", rotulo: "2 vezes ao dia", porDia: 2 },
  { id: "3", rotulo: "3 vezes ao dia", porDia: 3 },
  { id: "4", rotulo: "4 ou mais", porDia: 4 },
  { id: "semana", rotulo: "Algumas vezes por semana", porDia: 3 / 7 },
  { id: "fds", rotulo: "Só no fim de semana", porDia: 2 / 7 },
] as const;
export type FrequenciaId = (typeof FREQUENCIAS)[number]["id"];
export const porDiaDe = (f: FrequenciaId) => FREQUENCIAS.find((x) => x.id === f)!.porDia;

export const FAZENDO = [
  { id: "trabalhando", rotulo: "Sim, trabalhando", perfil: "automatico" },
  { id: "tv", rotulo: "Sim, vendo TV", perfil: "automatico" },
  { id: "dirigindo", rotulo: "Sim, dirigindo", perfil: "automatico" },
  { id: "conversando", rotulo: "Sim, conversando", perfil: "social" },
  { id: "cozinhando", rotulo: "Sim, cozinhando", perfil: "passagem" },
  { id: "nao", rotulo: "Não" },
  { id: "nunca-reparei", rotulo: "Nunca reparei" },
] as const;

export const CONTA = [
  { id: "sim", rotulo: "Sim" },
  { id: "as-vezes", rotulo: "Às vezes" },
  { id: "quase-nunca", rotulo: "Quase nunca" },
  { id: "nunca-pensei", rotulo: "Nunca pensei nisso" },
] as const;

export type Item = { alimentoId: string; medidaId: string; gramasLivres?: number; frequencia: FrequenciaId };

export type Respostas = {
  momentos: string[];
  itens: Item[];
  fazendo?: (typeof FAZENDO)[number]["id"];
  conta?: (typeof CONTA)[number]["id"];
};

export type Linha = { item: Item; alimento: Alimento; gramas: number; kcalEpisodio: number; porDia: number; kcalDia: number; rotuloMedida: string };

export function gramasDe(item: Item): number {
  if (item.medidaId === "livre") return Math.max(0, item.gramasLivres ?? 0);
  const a = POR_ID[item.alimentoId];
  return (a.medidas.find((m) => m.id === item.medidaId) ?? a.medidas[0]).gramas;
}

export function linhaDe(item: Item): Linha {
  const alimento = POR_ID[item.alimentoId];
  const gramas = gramasDe(item);
  const kcalEpisodio = (gramas * alimento.kcal100) / 100;
  const porDia = porDiaDe(item.frequencia);
  const rotuloMedida = item.medidaId === "livre" ? `${gramas} ${alimento.categoria === "bebidas" ? "ml" : "g"}` : alimento.medidas.find((m) => m.id === item.medidaId)?.rotulo ?? "";
  return { item, alimento, gramas, kcalEpisodio, porDia, kcalDia: kcalEpisodio * porDia, rotuloMedida };
}

/** Arredonda para exibir: dezena acima de 100, cinco abaixo. Nunca finge precisão. */
export const arred = (n: number) => (n >= 100 ? Math.round(n / 10) * 10 : Math.round(n / 5) * 5);

export type Resultado = {
  linhas: Linha[];
  kcalDia: number;
  kcalSemana: number;
  episodiosDia: number;
  podio: Linha[];
  perfil: Perfil;
  momentoCampeao?: Momento;
  menosPercebido?: Linha;
  insight: string[];
};

export function calcular(r: Respostas): Resultado {
  const linhas = r.itens.map(linhaDe).filter((l) => l.gramas > 0);
  const kcalDia = linhas.reduce((s, l) => s + l.kcalDia, 0);
  const episodiosDia = linhas.reduce((s, l) => s + l.porDia, 0);
  const podio = [...linhas].sort((a, b) => b.kcalDia - a.kcalDia).slice(0, 3);
  const perfil = perfilDe(r, linhas);
  const momentos = r.momentos.map((m) => MOMENTO[m]).filter(Boolean);
  const momentoCampeao = momentos.find((m) => m.perfil === perfil && m.id !== "outro") ?? momentos.find((m) => m.id !== "outro");
  // "O que você menos percebia": o disfarçado de maior peso; senão, o menor episódio que mais se repete.
  const disfarcado = [...linhas].filter((l) => l.alimento.categoria === "disfarcados").sort((a, b) => b.kcalDia - a.kcalDia)[0];
  const menosPercebido = disfarcado ?? [...linhas].sort((a, b) => b.porDia - a.porDia || a.kcalEpisodio - b.kcalEpisodio)[0];
  return { linhas, kcalDia, kcalSemana: kcalDia * 7, episodiosDia, podio, perfil, momentoCampeao, menosPercebido, insight: insightDe(r, linhas, perfil, momentos) };
}

const TEM_TAG = (l: Linha, t: Tag) => l.alimento.tags?.includes(t);

export function perfilDe(r: Respostas, linhas: Linha[]): Perfil {
  const p: Record<Perfil, number> = { automatico: 0, social: 0, passagem: 0, noturno: 0, "so-um": 0, compartilhado: 0 };
  for (const id of r.momentos) { const m = MOMENTO[id]; if (m?.perfil) p[m.perfil] += 2; }
  const f = FAZENDO.find((x) => x.id === r.fazendo);
  if (f && "perfil" in f) p[f.perfil as Perfil] += 3;
  for (const l of linhas) {
    if (TEM_TAG(l, "compartilhado")) p.compartilhado += 3;
    if (TEM_TAG(l, "passagem") || TEM_TAG(l, "cozinhando")) p.passagem += 2;
  }
  // "Só um": vários episódios pequenos.
  const pequenos = linhas.filter((l) => l.kcalEpisodio < 120).length;
  if (linhas.length >= 4 && pequenos >= linhas.length * 0.6) p["so-um"] += 4;
  const ordem: Perfil[] = ["automatico", "noturno", "social", "passagem", "compartilhado", "so-um"];
  return ordem.reduce((best, k) => (p[k] > p[best] ? k : best), ordem[0]);
}

export const PERFIS: Record<Perfil, { nome: string; emoji: string; texto: string; comecar: string }> = {
  automatico: { nome: "Belisco automático", emoji: "🤖", texto: "Você tende a comer enquanto a atenção está em outra coisa — tela, trabalho, volante. A mão vai e volta sem a cabeça registrar.",
    comecar: "Servir uma porção num prato antes de sentar, em vez de comer direto do pacote, costuma mudar mais do que parece." },
  social: { nome: "Belisco social", emoji: "🎉", texto: "Boa parte dos seus episódios acontece com outras pessoas: festa, bar, churrasco, jogo. A comida vem junto com a conversa.",
    comecar: "Escolher conscientemente o que você mais gosta da mesa costuma render mais do que tentar evitar tudo." },
  passagem: { nome: "Belisco de passagem", emoji: "🚪", texto: "Muita coisa acontece ao passar pela cozinha, preparar a comida ou encontrar algo à vista.",
    comecar: "Tirar da vista o que fica na bancada e provar com uma colher só costuma resolver boa parte sem esforço." },
  noturno: { nome: "Belisco noturno", emoji: "🌙", texto: "Boa parte dos seus beliscos se concentra no fim do dia, quando o cansaço chega e a rotina afrouxa.",
    comecar: "Planejar o que vai comer à noite, em vez de decidir na hora, costuma ser o ponto de partida mais fácil." },
  "so-um": { nome: "Belisco do “só um”", emoji: "☝️", texto: "Seus episódios são pequenos — um quadradinho, uma bolacha, um pedacinho — mas aparecem várias vezes.",
    comecar: "Juntar os “só um” num momento planejado do dia costuma satisfazer mais do que espalhar ao longo dele." },
  compartilhado: { nome: "Belisco compartilhado", emoji: "🍟", texto: "A batata do outro, o resto do prato das crianças, a garfada da sobremesa alheia: comida que nunca foi do seu prato.",
    comecar: "Se a vontade é de batata, pedir a sua porção — do tamanho que você quer — costuma ser mais honesto com a vontade do que ir pegando." },
};

const lista = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} e ${xs[xs.length - 1]}`);

function insightDe(r: Respostas, linhas: Linha[], perfil: Perfil, momentos: Momento[]): string[] {
  const out: string[] = [];
  const top = [...linhas].sort((a, b) => b.kcalDia - a.kcalDia)[0];
  const soma = linhas.reduce((s, l) => s + l.kcalDia, 0);
  if (top && soma > 0 && top.kcalDia / soma < 0.5) out.push("O que mais chamou atenção no seu resultado não foi nenhum alimento sozinho. Foram os vários pequenos episódios ao longo do dia.");
  else if (top) out.push(`Um item concentra boa parte do total: ${top.alimento.nome.toLowerCase()}. Às vezes ajustar uma coisa só já muda bastante o quadro.`);
  // Começa pelos momentos do perfil vencedor: é ali que o padrão aparece.
  const ord = [...momentos.filter((m) => m.perfil === perfil), ...momentos.filter((m) => m.perfil !== perfil)];
  const frases = ord.map((m) => m.frase).filter((f): f is string => !!f).slice(0, 2);
  if (frases.length) out.push(`Seu padrão parece acontecer principalmente ${lista(frases)}. Esse é provavelmente o melhor lugar para começar a observar.`);
  if (r.conta === "quase-nunca" || r.conta === "nunca-pensei") out.push("Você mesmo disse que quase não conta esses alimentos quando pensa no que comeu. É exatamente por isso que eles somam sem aparecer.");
  if (r.fazendo === "nunca-reparei") out.push("Você disse que nunca reparou se está fazendo outra coisa ao beliscar. Repare na próxima vez: só perceber já muda bastante coisa.");
  out.push(PERFIS[perfil].comecar);
  return out;
}

/** Simulação "E se?": aplica UMA mudança e devolve o novo total por dia. */
export type Mudanca = { alimentoId: string; tipo: "menos-vezes" | "porcao-menor" | "tirar" };

export function simular(r: Respostas, m: Mudanca): { antes: number; depois: number; descricao: string } {
  const antes = calcular(r).kcalDia;
  const itens = r.itens.map((it) => {
    if (it.alimentoId !== m.alimentoId) return it;
    if (m.tipo === "tirar") return { ...it, medidaId: "livre", gramasLivres: 0 };
    if (m.tipo === "menos-vezes") {
      const ordem: FrequenciaId[] = ["4", "3", "2", "1", "semana", "fds"];
      const i = ordem.indexOf(it.frequencia);
      return { ...it, frequencia: ordem[Math.min(ordem.length - 1, i + 1)] };
    }
    const a = POR_ID[it.alimentoId];
    if (it.medidaId === "livre") return { ...it, gramasLivres: Math.round((it.gramasLivres ?? 0) / 2) };
    const ms = [...a.medidas].sort((x, y) => x.gramas - y.gramas);
    const i = ms.findIndex((x) => x.id === it.medidaId);
    return { ...it, medidaId: ms[Math.max(0, i - 1)].id };
  });
  const novo = { ...r, itens };
  const it = novo.itens.find((x) => x.alimentoId === m.alimentoId)!;
  const a = POR_ID[m.alimentoId];
  const descricao = m.tipo === "tirar" ? `sem ${a.nome.toLowerCase()}`
    : m.tipo === "menos-vezes" ? `${a.nome}: ${FREQUENCIAS.find((f) => f.id === it.frequencia)!.rotulo.toLowerCase()}`
      : `${a.nome}: ${linhaDe(it).rotuloMedida}`;
  return { antes, depois: calcular(novo).kcalDia, descricao };
}

export const DICAS_SEM_CORTAR = [
  { emoji: "🍽️", titulo: "Sirva, não pegue do pacote", texto: "Uma porção no prato tem fim. O pacote não tem." },
  { emoji: "📏", titulo: "Diminua a porção, mantenha o alimento", texto: "Metade do punhado ainda é amendoim. A vontade é atendida, a conta muda." },
  { emoji: "🕒", titulo: "Dê um horário para o belisco", texto: "Quando ele tem hora marcada, deixa de aparecer em todas as outras." },
  { emoji: "🙈", titulo: "Tire da vista", texto: "O que fica na bancada é comido por estar ali, não por vontade." },
  { emoji: "👀", titulo: "Coma prestando atenção", texto: "Sem tela, sem pressa. Você percebe quando já foi o suficiente." },
  { emoji: "❤️", titulo: "Escolha o que você mais gosta", texto: "Se é pra beliscar, que seja o que vale a pena — não o que estava por perto." },
];
