/**
 * Mr. Olympia 2026 — FONTE ÚNICA de agenda, estado das categorias e
 * brasileiros. Leem daqui: a contagem regressiva (components/olympia/
 * Contagem.tsx), o painel Brasil, o status do hub geral e a tabela do hub.
 *
 * HORÁRIOS
 * Guardados UMA vez, em ISO com fuso de Brasília (-03:00), que em setembro
 * é Las Vegas + 4h. O relógio do navegador só serve para medir "agora"
 * (Date.now() é UTC em qualquer fuso), nunca para interpretar a agenda.
 * São inícios de BLOCO: a ordem das categorias dentro do bloco não é
 * publicada com antecedência, então nada aqui afirma o minuto de ninguém.
 *
 * O QUE O RELÓGIO DECIDE E O QUE ELE NÃO DECIDE
 *   relógio → um bloco COMEÇOU (horário oficial de início).
 *   flag    → as prévias da categoria TERMINARAM (`previasConcluidas`) e o
 *             resultado é OFICIAL (`resultadoOficial`). O relógio não sabe
 *             disso; marcar à mão, com fonte, e subir o dateModified.
 *
 * BRASILEIRO x ROSTER
 *   representacao = país que o roster oficial da IFBB Pro League mostra.
 * Natália Coelho é brasileira e aparece como EUA. Não "corrigir" isso.
 *
 * QUEM ENTRA NO PAINEL
 * Atleta no roster atual e não reportado como fora do evento. Classificado
 * que não viajou vai em FORA_DO_EVENTO. Na Wellness entram as brasileiras de
 * destaque; a lista inteira fica no artigo da categoria.
 */

export type Dia = "sexta" | "sabado";

/** Blocos oficiais (início), horário de Brasília. */
export const BLOCOS = {
  sextaPrevias: { inicio: "2026-09-25T13:30:00-03:00", texto: "sexta-feira, 25 de setembro, 13h30 de Brasília (9h30 em Las Vegas)" },
  sextaFinais: { inicio: "2026-09-25T22:00:00-03:00", texto: "sexta-feira, 25 de setembro, 22h de Brasília (18h em Las Vegas)" },
  sabadoPrevias: { inicio: "2026-09-26T13:30:00-03:00", texto: "sábado, 26 de setembro, 13h30 de Brasília (9h30 em Las Vegas)" },
  sabadoFinais: { inicio: "2026-09-26T23:00:00-03:00", texto: "sábado, 26 de setembro, 23h de Brasília (19h em Las Vegas)" },
} as const;
export type IdBloco = keyof typeof BLOCOS;

export interface CategoriaOlympia {
  id: string;
  nome: string;
  dia: Dia;
  previas: IdBloco;
  final: IdBloco;
  /** Artigo de resultado da categoria, se existir. */
  artigo?: string;
  /** Marcar só com fonte: prévias da categoria encerradas. */
  previasConcluidas?: boolean;
  /** Marcar só com fonte: resultado oficial divulgado. */
  resultadoOficial?: boolean;
  /** Tem brasileiro no painel? (a contagem do hub Brasil só olha estas) */
  temBrasileiro?: boolean;
  /**
   * Prévias e final na MESMA sessão (Fit Model). O início do bloco não diz
   * que a categoria subiu ao palco: isso só com `noPalco` (confirmado).
   */
  sessaoUnica?: boolean;
  /** Marcar só com confirmação: a categoria está no palco agora. */
  noPalco?: boolean;
  /** Campeã(o) oficial, para a caixa de encerramento. */
  campeao?: string;
}

export const CATEGORIAS: CategoriaOlympia[] = [
  { id: "classic", nome: "Classic Physique", dia: "sexta", previas: "sextaPrevias", final: "sextaFinais", artigo: "resultado-classic-physique-mr-olympia-2026", temBrasileiro: true, previasConcluidas: true, resultadoOficial: true, campeao: "Niall Darwen" },
  { id: "212", nome: "212", dia: "sexta", previas: "sextaPrevias", final: "sextaFinais", artigo: "resultado-212-mr-olympia-2026", temBrasileiro: true, previasConcluidas: true, resultadoOficial: true, campeao: "Keone Pearson" },
  { id: "wellness", nome: "Wellness", dia: "sexta", previas: "sextaPrevias", final: "sextaFinais", artigo: "resultado-wellness-mr-olympia-2026", temBrasileiro: true, previasConcluidas: true, resultadoOficial: true, campeao: "Eduarda Bezerra" },
  { id: "womens-physique", nome: "Women's Physique", dia: "sexta", previas: "sextaPrevias", final: "sextaFinais", artigo: "resultado-womens-physique-olympia-2026", temBrasileiro: true, previasConcluidas: true, resultadoOficial: true, campeao: "Natalia Abraham Coelho" },
  { id: "ms-olympia", nome: "Ms. Olympia", dia: "sexta", previas: "sextaPrevias", final: "sextaFinais", temBrasileiro: true, previasConcluidas: true, resultadoOficial: true, campeao: "Andrea Shaw" },
  { id: "figure", nome: "Figure", dia: "sexta", previas: "sextaPrevias", final: "sextaFinais", previasConcluidas: true, resultadoOficial: true, campeao: "Lola Montez" },
  // O Open tem as prévias na sessão de sexta à noite e a final no sábado.
  { id: "open", nome: "Open (Mr. Olympia)", dia: "sabado", previas: "sextaFinais", final: "sabadoFinais", artigo: "resultado-mr-olympia-open-2026", temBrasileiro: true },
  { id: "mens-physique", nome: "Men's Physique", dia: "sabado", previas: "sabadoPrevias", final: "sabadoFinais", artigo: "resultado-mens-physique-olympia-2026", temBrasileiro: true },
  { id: "bikini", nome: "Bikini", dia: "sabado", previas: "sabadoPrevias", final: "sabadoFinais", artigo: "resultado-bikini-olympia-2026", temBrasileiro: true },
  { id: "fitness", nome: "Fitness", dia: "sabado", previas: "sabadoPrevias", final: "sabadoFinais" },
  // Estreia no Olympia: prévias E final na sessão de sábado de manhã.
  { id: "fit-model", nome: "Fit Model", dia: "sabado", previas: "sabadoPrevias", final: "sabadoPrevias", artigo: "resultado-fit-model-olympia-2026", temBrasileiro: true, sessaoUnica: true },
];

export const categoria = (id: string) => {
  const c = CATEGORIAS.find((x) => x.id === id);
  if (!c) throw new Error(`categoria desconhecida: ${id}`);
  return c;
};

/* ───────────── Estado da categoria no tempo ───────────── */

export type Fase =
  | "antes-previas" // 1: contagem para o bloco das prévias
  | "previas" // 2: bloco das prévias iniciado (sem confirmação de fim)
  | "aguardando-final" // 3: prévias confirmadas; contagem para as finais
  | "final" // 4: bloco das finais iniciado, resultado ainda não oficial
  | "encerrada" // 5: resultado oficial
  | "bloco" // sessão única: bloco iniciado, categoria sem confirmação no palco
  | "no-palco"; // sessão única: categoria confirmada no palco

const t = (b: IdBloco) => Date.parse(BLOCOS[b].inicio);

/**
 * Fase de uma categoria no instante `agora` (ms UTC).
 * Sem `previasConcluidas`, a fase 2 dura até o bloco das finais começar:
 * não afirmamos que as prévias acabaram só porque o tempo passou.
 */
export function fase(c: CategoriaOlympia, agora: number): Fase {
  if (c.resultadoOficial) return "encerrada";
  if (c.sessaoUnica) return c.noPalco ? "no-palco" : agora >= t(c.previas) ? "bloco" : "antes-previas";
  if (agora >= t(c.final)) return "final";
  if (c.previasConcluidas) return "aguardando-final";
  if (agora >= t(c.previas)) return "previas";
  return "antes-previas";
}

/** Próximo instante que interessa (para a contagem), ou null. */
export function alvo(c: CategoriaOlympia, agora: number): { bloco: IdBloco; tipo: "previas" | "final" } | null {
  const f = fase(c, agora);
  if (f === "antes-previas") return { bloco: c.previas, tipo: "previas" };
  if (f === "previas" || f === "aguardando-final") return { bloco: c.final, tipo: "final" };
  return null;
}

/** Status curto para o painel Brasil e o hub geral. */
export const STATUS_FASE: Record<Fase, string> = {
  "antes-previas": "Próximo",
  previas: "Em andamento (bloco das prévias)",
  "aguardando-final": "Aguardando final",
  final: "Em andamento (bloco das finais)",
  encerrada: "Finalizado",
  bloco: "Bloco em andamento (categoria programada)",
  "no-palco": "Em andamento",
};

/** Texto estático (SSR/leitor de tela) da agenda da categoria. */
export function agendaTexto(c: CategoriaOlympia): string {
  if (c.sessaoUnica) return `Prévias e final na mesma sessão, a partir de ${BLOCOS[c.previas].texto}.`;
  return `Prévias: bloco a partir de ${BLOCOS[c.previas].texto}. Final: sessão a partir de ${BLOCOS[c.final].texto}.`;
}

/* ───────────── Hub Brasil: agora / próximo / finalizado ───────────── */

export interface ResumoBrasil {
  agora: { bloco: IdBloco; categorias: CategoriaOlympia[] } | null;
  proximo: { bloco: IdBloco; categorias: CategoriaOlympia[] } | null;
  finalizadas: CategoriaOlympia[];
}

const ORDEM: IdBloco[] = ["sextaPrevias", "sextaFinais", "sabadoPrevias", "sabadoFinais"];

/** Categorias com brasileiro que usam o bloco (prévias ou final) e ainda não encerraram. */
function doBloco(b: IdBloco, cats: CategoriaOlympia[]): CategoriaOlympia[] {
  return cats.filter((c) => c.temBrasileiro && !c.resultadoOficial && (c.previas === b || c.final === b));
}

/** `cats` existe para o teste passar categorias sem os flags do evento real. */
export function resumoBrasil(agora: number, cats: CategoriaOlympia[] = CATEGORIAS): ResumoBrasil {
  const iniciados = ORDEM.filter((b) => agora >= t(b) && doBloco(b, cats).length);
  const futuros = ORDEM.filter((b) => agora < t(b) && doBloco(b, cats).length);
  const ult = iniciados[iniciados.length - 1];
  return {
    agora: ult ? { bloco: ult, categorias: doBloco(ult, cats) } : null,
    proximo: futuros[0] ? { bloco: futuros[0], categorias: doBloco(futuros[0], cats) } : null,
    finalizadas: cats.filter((c) => c.temBrasileiro && c.resultadoOficial),
  };
}

export const NOME_BLOCO: Record<IdBloco, string> = {
  sextaPrevias: "Prévias de sexta",
  sextaFinais: "Finais de sexta",
  sabadoPrevias: "Prévias de sábado",
  sabadoFinais: "Finais de sábado",
};
export const inicioBloco = t;

/* ───────────── Brasileiros ───────────── */

export interface AtletaBrasil {
  nome: string;
  categoria: string;
  /** País exibido no roster oficial. */
  representacao: "Brasil" | "EUA" | "Espanha";
  /** Só com resultado oficial, ex.: "3º lugar". */
  resultado?: string;
  destaque?: string;
}

const a = (nome: string, cat: string, representacao: AtletaBrasil["representacao"] = "Brasil", destaque?: string): AtletaBrasil => ({
  nome, categoria: cat, representacao, destaque,
});

export const ATLETAS_BRASIL: AtletaBrasil[] = [
  // Sexta
  { ...a("Ramon Dino", "classic", "Brasil", "Campeão em 2025"), resultado: "3º lugar" },
  a("César Falcão", "classic"),
  a("Fábio Júnio", "classic"),
  a("Gabriel Zancanelli", "classic"),
  a("Matheus Menegate", "classic"),
  { ...a("Lucas Garcia", "212", "Brasil", "3º em 2025"), resultado: "2º lugar" },
  { ...a("Vitor Porto", "212"), resultado: "4º lugar" },
  a("Felipe Moraes", "212"),
  a("Andrey Pereira", "212"),
  { ...a("Eduarda Bezerra", "wellness", "Brasil", "Bicampeã"), resultado: "1º lugar" },
  { ...a("Isa Pereira Nunes", "wellness", "Brasil", "Campeã em 2024"), resultado: "2º lugar" },
  a("Rayane Fogal", "wellness"),
  { ...a("Natália Coelho", "womens-physique", "EUA", "Tricampeã"), resultado: "1º lugar" },
  { ...a("Zama Benta", "womens-physique", "Brasil", "3ª em 2025"), resultado: "2º lugar" },
  a("Jessica Macedo", "womens-physique"),
  a("Naiana Nana", "womens-physique"),
  a("Amanda de Carvalho Machado", "womens-physique", "EUA"),
  { ...a("Leyvina Barros", "ms-olympia", "Brasil", "Top 3 em 2025"), resultado: "3º lugar" },
  a("Barbara Moojen", "ms-olympia"),
  // Sábado (Open: prévias na sexta à noite)
  a("Leandro Peres", "open", "Brasil", "Único brasileiro no Open"),
  a("Edvan Palmeira", "mens-physique", "Brasil", "5º em 2025"),
  a("Diogo Basaglia", "mens-physique"),
  a("Vitor Chaves", "mens-physique"),
  a("Emerson Costa", "mens-physique"),
  a("Dilson Espindola Silva", "mens-physique"),
  a("Guilherme Gualberto", "mens-physique"),
  a("Rafael Oliveira", "mens-physique"),
  a("Kaique Santos", "mens-physique"),
  a("Vinicius Mateus Vieira Lima", "mens-physique"),
  a("Mauro Fialho", "mens-physique", "Espanha"),
  a("Elisa Pecini", "bikini", "Brasil", "Campeã em 2019"),
  a("Nivea Campos", "bikini"),
  a("Bruna Toigo", "bikini"),
  a("Gabriela Queiroz", "fit-model", "EUA", "Campeã do Wasatch Warrior 2026"),
];

/** Classificados que não competem, com o motivo publicado. */
export const FORA_DO_EVENTO: { nome: string; categoria: string; motivo: string }[] = [
  { nome: "Beatriz Almeida", categoria: "Figure", motivo: "visto negado" },
  { nome: "Saionara Rebelo", categoria: "Figure", motivo: "visto negado" },
  { nome: "Ângelo Marques", categoria: "Classic Physique", motivo: "visto negado" },
  { nome: "Johnne Sousa", categoria: "Classic Physique", motivo: "visto definitivo não saiu antes da pesagem" },
  { nome: "Livingstone “Livinho”", categoria: "Classic Physique", motivo: "visto negado" },
  { nome: "Josy Alves", categoria: "Wellness", motivo: "visto negado" },
  { nome: "Alcione Barreto", categoria: "Ms. Olympia", motivo: "situação migratória" },
];

export const DIA_TEXTO: Record<Dia, string> = { sexta: "Sexta, 25/09", sabado: "Sábado, 26/09" };
