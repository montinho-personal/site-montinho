/**
 * Brasileiros no Mr. Olympia 2026 — FONTE ÚNICA do painel e da tabela do
 * hub /blog/brasileiros-mr-olympia-2026 (e de quem mais quiser a lista).
 *
 * DUAS COISAS DIFERENTES, DUAS COLUNAS
 *   representacao = país que o roster oficial da IFBB Pro League mostra;
 *   brasileiro    = nacionalidade/origem, pela imprensa brasileira.
 * Natália Coelho é brasileira e aparece como EUA. Não "corrigir" isso.
 *
 * QUEM ENTRA
 * Atleta no roster atual e não reportado como fora do evento. Classificado
 * que não viajou (visto negado, desistência) vai em FORA_DO_EVENTO, nunca
 * no painel. A Wellness tem mais de 20 brasileiras; aqui entram as de
 * destaque, e a lista inteira fica no artigo da categoria.
 *
 * ATUALIZAR DURANTE O EVENTO
 * status: "aguardando" → "previas" (passou pelas prévias) → "final"
 * (resultado oficial). `resultado` só com fonte oficial, ex.: "3º lugar".
 * Depois de mexer aqui, subir o dateModified do hub.
 */

export type Dia = "sexta" | "sabado";
export type Status = "aguardando" | "previas" | "final";

export interface CategoriaOlympia {
  id: string;
  nome: string;
  dia: Dia;
  /** Artigo de resultado da categoria, se existir. */
  artigo?: string;
}

export const CATEGORIAS: CategoriaOlympia[] = [
  { id: "classic", nome: "Classic Physique", dia: "sexta", artigo: "resultado-classic-physique-mr-olympia-2026" },
  { id: "212", nome: "212", dia: "sexta", artigo: "resultado-212-mr-olympia-2026" },
  { id: "wellness", nome: "Wellness", dia: "sexta", artigo: "resultado-wellness-mr-olympia-2026" },
  { id: "womens-physique", nome: "Women's Physique", dia: "sexta", artigo: "resultado-womens-physique-olympia-2026" },
  { id: "ms-olympia", nome: "Ms. Olympia (Women's Bodybuilding)", dia: "sexta" },
  { id: "open", nome: "Open (Mr. Olympia)", dia: "sabado", artigo: "resultado-mr-olympia-open-2026" },
  { id: "mens-physique", nome: "Men's Physique", dia: "sabado" },
  { id: "bikini", nome: "Bikini", dia: "sabado" },
  { id: "fit-model", nome: "Fit Model", dia: "sabado" },
];

export interface AtletaBrasil {
  nome: string;
  categoria: string;
  /** País exibido no roster oficial. */
  representacao: "Brasil" | "EUA" | "Espanha";
  status: Status;
  /** Só com resultado oficial. */
  resultado?: string;
  destaque?: string;
}

const a = (nome: string, categoria: string, representacao: AtletaBrasil["representacao"] = "Brasil", destaque?: string): AtletaBrasil => ({
  nome, categoria, representacao, status: "aguardando", destaque,
});

export const ATLETAS_BRASIL: AtletaBrasil[] = [
  // Sexta
  a("Ramon Dino", "classic", "Brasil", "Atual campeão"),
  a("César Falcão", "classic"),
  a("Fábio Júnio", "classic"),
  a("Gabriel Zancanelli", "classic"),
  a("Matheus Menegate", "classic"),
  a("Lucas Garcia", "212", "Brasil", "3º em 2025"),
  a("Vitor Porto", "212"),
  a("Felipe Moraes", "212"),
  a("Andrey Pereira", "212"),
  a("Eduarda Bezerra", "wellness", "Brasil", "Atual campeã"),
  a("Isa Pereira Nunes", "wellness", "Brasil", "Campeã em 2024"),
  a("Rayane Fogal", "wellness"),
  a("Natália Coelho", "womens-physique", "EUA", "Atual campeã"),
  a("Zama Benta", "womens-physique", "Brasil", "3ª em 2025"),
  a("Jessica Macedo", "womens-physique"),
  a("Naiana Nana", "womens-physique"),
  a("Amanda de Carvalho Machado", "womens-physique", "EUA"),
  a("Leyvina Barros", "ms-olympia", "Brasil", "Top 3 em 2025"),
  a("Barbara Moojen", "ms-olympia"),
  // Sábado
  a("Leandro Peres", "open", "Brasil", "Único brasileiro no Open"),
  a("Edvan Palmeira", "mens-physique"),
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
  a("Gabriela Queiroz", "fit-model", "EUA"),
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

export const categoria = (id: string) => CATEGORIAS.find((c) => c.id === id)!;
export const DIA_TEXTO: Record<Dia, string> = { sexta: "Sexta, 25/09", sabado: "Sábado, 26/09" };
export const STATUS_TEXTO: Record<Status, string> = {
  aguardando: "Aguardando prévias",
  previas: "Prévias concluídas",
  final: "Resultado oficial",
};
