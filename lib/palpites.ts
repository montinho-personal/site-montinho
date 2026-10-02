/**
 * Palpites ("quem vence?") embutidos nos artigos de evento.
 *
 * Só nome, país e categoria: nenhum cartel, odd ou estatística entra aqui
 * sem fonte. Sem foto de atleta: as oficiais são do UFC/agências e não
 * temos licença — o visual vem de bandeira, iniciais e a cor do córner.
 * A votação fecha sozinha quando o card da luta começa.
 */
export type Lutador = { id: string; nome: string; pais: string; bandeira: string; iniciais: string };
export type Enquete = {
  id: string;
  titulo: string;
  categoria: string;
  card: string;
  fechaEm: string; // ISO com fuso
  vermelho: Lutador;
  azul: Lutador;
};

const PRELIM = "2026-10-03T17:00:00-03:00";
const PRINCIPAL = "2026-10-03T21:00:00-03:00";

export const ENQUETES: Enquete[] = [
  {
    id: "ufc332-silva-wang",
    titulo: "Quem leva o cinturão?",
    categoria: "Peso-mosca feminino · disputa de cinturão",
    card: "Luta principal",
    fechaEm: PRINCIPAL,
    vermelho: { id: "natalia-silva", nome: "Natália Silva", pais: "Brasil", bandeira: "🇧🇷", iniciais: "NS" },
    azul: { id: "wang-cong", nome: "Wang Cong", pais: "China", bandeira: "🇨🇳", iniciais: "WC" },
  },
  {
    id: "ufc332-figueiredo-talbott",
    titulo: "Quem vence o co-main?",
    categoria: "Peso-galo",
    card: "Co-principal",
    fechaEm: PRINCIPAL,
    vermelho: { id: "deiveson-figueiredo", nome: "Deiveson Figueiredo", pais: "Brasil", bandeira: "🇧🇷", iniciais: "DF" },
    azul: { id: "payton-talbott", nome: "Payton Talbott", pais: "EUA", bandeira: "🇺🇸", iniciais: "PT" },
  },
  {
    id: "ufc332-walker-parkin",
    titulo: "Quem vence?",
    categoria: "Peso-pesado",
    card: "Card preliminar",
    fechaEm: PRELIM,
    vermelho: { id: "johnny-walker", nome: "Johnny Walker", pais: "Brasil", bandeira: "🇧🇷", iniciais: "JW" },
    azul: { id: "mick-parkin", nome: "Mick Parkin", pais: "Inglaterra", bandeira: "🇬🇧", iniciais: "MP" },
  },
  {
    id: "ufc332-dosanjos-hernandez",
    titulo: "Quem vence?",
    categoria: "Card preliminar",
    card: "Card preliminar",
    fechaEm: PRELIM,
    vermelho: { id: "rafael-dos-anjos", nome: "Rafael dos Anjos", pais: "Brasil", bandeira: "🇧🇷", iniciais: "RA" },
    azul: { id: "alexander-hernandez", nome: "Alexander Hernandez", pais: "EUA", bandeira: "🇺🇸", iniciais: "AH" },
  },
];

/** Grupos que o marcador <!--PALPITE:x--> aceita: uma enquete ou o card todo. */
export const GRUPOS: Record<string, string[]> = {
  "ufc332": ENQUETES.map((e) => e.id),
  ...Object.fromEntries(ENQUETES.map((e) => [e.id, [e.id]])),
};

export const enquete = (id: string) => ENQUETES.find((e) => e.id === id);
export const aberta = (e: Enquete, agora = Date.now()) => agora < Date.parse(e.fechaEm);
