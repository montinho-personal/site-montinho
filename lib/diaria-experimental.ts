/**
 * Academias com diária e aula experimental em Alphaville e região.
 *
 * REGRA DOS DADOS
 *
 * Só entra oferta com fonte oficial (site ou canal da própria academia) e
 * data de conferência. Cada item guarda a fonte e a data, e a tela mostra as
 * duas. Oferta que está só "a confirmar" (passe diário da Smart Fit, aula
 * experimental da Scelta) fica fora da lista e é citada no texto como não
 * confirmada.
 *
 * A conferência nas fontes oficiais foi feita pelo Guia Fitness Alphaville
 * (guiafitnessalphaville.com.br, site do Montinho) nas datas indicadas. Os
 * sites das academias não abrem no ambiente em que este arquivo foi escrito,
 * então a data é a da conferência do Guia, não uma segunda checagem.
 *
 * Guia de academia não é local de atendimento: o único item que fala do
 * Montinho é o da Arena 18, marcado como atendimento dele.
 */

export type Modo = "diaria" | "experimental";
export type Tipo = "diaria" | "aula-avulsa" | "aula-experimental" | "treino-experimental" | "visita";

export interface Oferta {
  id: string;
  academia: string;
  bairro: string;
  modo: Modo;
  tipo: Tipo;
  rotulo: string;
  modalidade: string;
  musculacao: boolean;
  /** Dá para treinar? Visita guiada não é treino. */
  treino: boolean;
  /** Preço confirmado, em reais. 0 = grátis. null = não publicado. */
  preco: number | null;
  /** Texto do preço quando não há número confirmado para a unidade. */
  precoNota?: string;
  como: string;
  precisaAgendar: boolean | null;
  fonteNome: string;
  fonteUrl?: string;
  conferidaEm: string;
  /** Guia da academia neste site, quando existe. */
  guia?: string;
  /** Atendimento do próprio Montinho (declarado na tela). */
  daCasa?: boolean;
}

export const CONFERENCIA = {
  por: "Guia Fitness Alphaville",
  url: "https://guiafitnessalphaville.com.br/ferramentas/academias-diaria-aula-experimental-alphaville/",
} as const;

export const OFERTAS: Oferta[] = [
  /* ── Treinar hoje: diária ─────────────────────────────────────────── */
  {
    id: "nitrogym-diaria",
    academia: "NitroGym Tamboré",
    bairro: "Tamboré · Barueri",
    modo: "diaria",
    tipo: "diaria",
    rotulo: "Day use",
    modalidade: "Musculação, com acesso a todas as áreas",
    musculacao: true,
    treino: true,
    preco: 90,
    como: "Pagamento direto no local. O estacionamento fica incluso por até 3 horas.",
    precisaAgendar: false,
    fonteNome: "Site oficial da NitroGym (página da unidade Tamboré)",
    fonteUrl: "https://nitrogymacademia.com.br/unidades/unidade-tambore",
    conferidaEm: "2026-11-18",
    guia: "/blog/nitrogym-alphaville",
  },
  {
    id: "ironberg-avulsa",
    academia: "Ironberg Alphaville",
    bairro: "Alphaville · Barueri",
    modo: "diaria",
    tipo: "aula-avulsa",
    rotulo: "Aula avulsa",
    modalidade: "Musculação",
    musculacao: true,
    treino: true,
    preco: null,
    precoNota: "Valor informado só na recepção",
    como: "Contratada no dia do treino, na recepção da unidade. Não precisa agendar.",
    precisaAgendar: false,
    fonteNome: "Site oficial da Ironberg (planos e perguntas frequentes)",
    fonteUrl: "https://www.ironberg.com.br/planos.html",
    conferidaEm: "2026-11-18",
    guia: "/blog/ironberg-alphaville",
  },
  {
    id: "blacksheep-dropin",
    academia: "BlackSheep Alphaville",
    bairro: "Alphaville · Barueri",
    modo: "diaria",
    tipo: "aula-avulsa",
    rotulo: "Aula avulsa (drop in)",
    modalidade: "Cross training (não é musculação)",
    musculacao: false,
    treino: true,
    preco: null,
    precoNota: "R$ 75 na tabela da rede; confirme o valor da unidade",
    como: "Consulte a unidade antes de ir.",
    precisaAgendar: null,
    fonteNome: "Site oficial da Crosslift Blacksheep (tabela de planos da rede)",
    fonteUrl: "https://www.crossliftblacksheep.com.br/",
    conferidaEm: "2026-11-13",
  },

  /* ── Testar antes de assinar ──────────────────────────────────────── */
  {
    id: "arena18-montinho",
    academia: "Arena 18",
    bairro: "Alphaville · Barueri",
    modo: "experimental",
    tipo: "aula-experimental",
    rotulo: "Aula experimental com o Montinho",
    modalidade: "Musculação",
    musculacao: true,
    treino: true,
    preco: 0,
    como: "É o atendimento do Montinho, que dá aulas na Arena 18. Sem diária de entrada. Agendada pelo WhatsApp dele.",
    precisaAgendar: true,
    fonteNome: "Informação do Montinho Personal Trainer, dono deste site",
    conferidaEm: "2026-11-18",
    guia: "/blog/arena-18-alphaville",
    daCasa: true,
  },
  {
    id: "crossfit-barueri-experimental",
    academia: "CrossFit Barueri",
    bairro: "Alphaville · Barueri",
    modo: "experimental",
    tipo: "aula-experimental",
    rotulo: "Aula experimental",
    modalidade: "CrossFit (não é musculação)",
    musculacao: false,
    treino: true,
    preco: 0,
    como: "Aula separada da turma, para quem está começando. Agendada pelo site ou pelo WhatsApp da unidade.",
    precisaAgendar: true,
    fonteNome: "Site oficial do CrossFit Barueri",
    fonteUrl: "https://crossfitbarueri.com.br/",
    conferidaEm: "2026-11-18",
    guia: "/blog/crossfit-barueri",
  },
  {
    id: "g13-experimental",
    academia: "G13 BJJ Alphaville",
    bairro: "Tamboré · Santana de Parnaíba",
    modo: "experimental",
    tipo: "aula-experimental",
    rotulo: "Aula experimental",
    modalidade: "Jiu-jítsu (não é musculação)",
    musculacao: false,
    treino: true,
    preco: 0,
    como: "Consulte a academia para marcar.",
    precisaAgendar: null,
    fonteNome: "Site oficial da G13 Alphaville",
    fonteUrl: "https://g13alphaville.com.br/",
    conferidaEm: "2026-11-17",
  },
  {
    id: "blacksheep-experimental",
    academia: "BlackSheep Alphaville",
    bairro: "Alphaville · Barueri",
    modo: "experimental",
    tipo: "aula-experimental",
    rotulo: "Aula experimental",
    modalidade: "Cross training e treino no formato HYROX (não é musculação)",
    musculacao: false,
    treino: true,
    preco: null,
    precoNota: "Valor a consultar",
    como: "Agendada pelo WhatsApp da unidade.",
    precisaAgendar: true,
    fonteNome: "Site oficial da Crosslift Blacksheep (página Hybrid Alphaville)",
    fonteUrl: "https://crossliftblacksheep.com.br/hybrid-alphaville/",
    conferidaEm: "2026-11-13",
  },
  {
    id: "tecfit-experimental",
    academia: "Tecfit Alphaville",
    bairro: "Alphaville · Barueri",
    modo: "experimental",
    tipo: "treino-experimental",
    rotulo: "Treino experimental",
    modalidade: "Eletroestimulação (não é musculação)",
    musculacao: false,
    treino: true,
    preco: null,
    precoNota: "Valor a consultar",
    como: "Agendado pelo site da unidade.",
    precisaAgendar: true,
    fonteNome: "Site oficial da Tecfit (página da unidade Alphaville)",
    fonteUrl: "https://www.tecfitbrasil.com/unidades/alphaville",
    conferidaEm: "2026-11-18",
  },
  {
    id: "six-visita",
    academia: "SIX Alphaville",
    bairro: "Alphaville · Barueri",
    modo: "experimental",
    tipo: "visita",
    rotulo: "Visita guiada",
    modalidade: "Visita ao espaço (não é treino)",
    musculacao: false,
    treino: false,
    preco: null,
    precoNota: "Valor a consultar",
    como: "A equipe apresenta o espaço e as condições de adesão. Agendada pelo site. O site não diz se a visita inclui treino.",
    precisaAgendar: true,
    fonteNome: "Site oficial da SIX (página da unidade Alphaville)",
    fonteUrl: "https://sixwellnessclub.com/units/alphaville",
    conferidaEm: "2026-11-18",
    guia: "/blog/six-alphaville",
  },
  {
    id: "fabrica-premium-visita",
    academia: "Fábrica Premium Alphaville",
    bairro: "Alphaville · Santana de Parnaíba",
    modo: "experimental",
    tipo: "visita",
    rotulo: "Visita guiada",
    modalidade: "Visita ao espaço (não é treino)",
    musculacao: false,
    treino: false,
    preco: null,
    precoNota: "Valor a consultar",
    como: "Agendada pelo site. O site não diz se a visita inclui treino.",
    precisaAgendar: true,
    fonteNome: "Site oficial da Fábrica Premium Alphaville",
    fonteUrl: "https://fabricapremiumalphaville.com.br/",
    conferidaEm: "2026-11-18",
    guia: "/blog/fabrica-premium-alphaville",
  },
];

/** Ofertas que existem em alguma fonte, mas sem confirmação oficial: ficam fora da lista. */
export const NAO_CONFIRMADAS = [
  "Smart Fit (passe diário): a central de ajuda da rede fala do passe, mas regra, preço e unidades não foram confirmados.",
  "Academia Scelta (aula experimental): vista só em rede social, sem modalidade nem preço confirmados.",
] as const;

export const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;

export function precoTxt(o: Oferta): string {
  if (o.preco === 0) return "Grátis";
  if (o.preco !== null) return brl(o.preco);
  return o.precoNota ?? "Valor a consultar";
}

export function dataTxt(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

export interface Filtro {
  modo: Modo;
  soMusculacao: boolean;
  soComPreco: boolean;
}

/** Ordem: atendimento da casa (declarado), depois preço confirmado, depois o resto; visita por último. */
export function filtrar({ modo, soMusculacao, soComPreco }: Filtro): Oferta[] {
  const peso = (o: Oferta) => (o.daCasa ? 0 : !o.treino ? 3 : o.preco !== null ? 1 : 2);
  return OFERTAS.filter((o) => o.modo === modo)
    .filter((o) => !soMusculacao || o.musculacao)
    .filter((o) => !soComPreco || o.preco !== null)
    .sort((a, b) => peso(a) - peso(b));
}

/** Quanto dá no mês indo N vezes pagando diária. Só para oferta com preço confirmado e maior que zero. */
export function totalNoMes(o: Oferta, idas: number): number | null {
  return o.preco !== null && o.preco > 0 ? o.preco * idas : null;
}

export const IDAS = [1, 4, 8, 12] as const;
