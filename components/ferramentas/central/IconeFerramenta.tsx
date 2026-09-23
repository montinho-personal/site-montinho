import type { IconeId } from "@/lib/ferramentas/catalogo";

/**
 * O sistema de ícones da central: um só estilo, linha de 1,5 px, 24 × 24,
 * cor herdada do texto. Nada de emoji, nada de ícone preenchido no meio de
 * ícone de linha — a coerência é o que faz trinta e cinco cards lerem como
 * uma biblioteca, e não como um mural.
 *
 * Todos são decorativos: o nome da ferramenta está no link ao lado, então
 * o SVG leva aria-hidden e não precisa de título.
 */
const CAMINHOS: Record<IconeId, string> = {
  chama: "M12 3c1 3 4 4.5 4 8.5a4 4 0 0 1-8 0c0-1.5.5-2.5 1.2-3.3.3 1.3 1 2 1.8 2.3C11 8 11 5 12 3zM8.5 14.5A6 6 0 0 0 12 21a6 6 0 0 0 5-9",
  balanca: "M12 3v18M4 7l8-2 8 2M4 7l-2.5 7a3.5 3.5 0 0 0 7 0L6 7M20 7l-2.5 7a3.5 3.5 0 0 0 7 0L22 7M8 21h8",
  corpo: "M12 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM7 11l2-2h6l2 2M9 9v6l-1.5 6M15 9v6l1.5 6M9 15h6",
  seringa: "M3 21l3-3M6 18l9-9M12 6l6 6M15 3l6 6M18 6l-2 2M8.5 15.5l3-3M10.5 17.5l3-3",
  capsula: "M8.5 4.5l11 11a3.5 3.5 0 0 1-5 5l-11-11a3.5 3.5 0 0 1 5-5zM9 14l5-5",
  medida: "M4 10h16v3a8 8 0 0 1-16 0v-3zM8 10V7a4 4 0 0 1 8 0v3M12 21v-3",
  ovo: "M12 3C8.5 3 5.5 9 5.5 14a6.5 6.5 0 0 0 13 0C18.5 9 15.5 3 12 3z",
  pizza: "M12 3a9 9 0 1 0 9 9h-9V3zM12 3a9 9 0 0 1 9 9M12 12l6.4-6.4",
  talheres: "M6 3v18M4 3v5a2 2 0 0 0 4 0V3M17 3c-1.5 0-3 2-3 6a3 3 0 0 0 3 3v9",
  tabela: "M4 5h16v14H4zM4 10h16M4 15h16M10 5v14",
  halter: "M3 10v4M6 8v8M9 8v8M15 8v8M18 8v8M21 10v4M9 12h6",
  bussola: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5 5-2z",
  calendario: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h2M12 14h2M16 14h2",
  video: "M3 7h12v10H3zM15 10l6-3v10l-6-3",
  alvo: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 12h.01",
  alongar: "M14 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM4 21l6-6 3 2 3-5-4-2-3 4M13 12l3 1 4-3",
  coracao: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10zM7 12h3l1.5-2.5 2 5L15 12h2",
  corrida: "M15 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM4 20l5-6 3 2 3-6-4-2-3 3M11 16l3 4M13 11l4 1 3-2",
  passos: "M8 3c-2 0-3 2-3 5v3a2.5 2.5 0 0 0 5 0V8c0-3-.5-5-2-5zM6.5 14v3a1.5 1.5 0 0 0 3 0v-3M16 8c-2 0-3 2-3 5v3a2.5 2.5 0 0 0 5 0v-3c0-3-.5-5-2-5zM14.5 19v1a1.5 1.5 0 0 0 3 0v-1",
  bicicleta: "M5.5 14a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18.5 14a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5.5 17.5l4-8h5l4 8M9.5 9.5l3.5 8M12 5h3l1.5 4.5",
  eliptico: "M12 4a8 4 0 1 0 0 8 8 4 0 0 0 0-8zM6 20l3-6M18 20l-3-6M12 12v8",
  ondas: "M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0",
  musica: "M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM20 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM9 18V6l11-2v12M9 10l11-2",
  bola: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8l3.8 2.8-1.5 4.4h-4.6L8.2 10.8 12 8zM12 3v5M8.2 10.8L4 9.5M15.8 10.8L20 9.5M9.7 15.2 7 19M14.3 15.2 17 19",
  luva: "M7 12V7a2 2 0 0 1 4 0v3M11 8V6a2 2 0 0 1 4 0v4M15 8a2 2 0 0 1 4 0v6a6 6 0 0 1-6 6h-2a5 5 0 0 1-5-5v-3l-2-2a1.5 1.5 0 0 1 2-2l2 2",
  faixa: "M3 9h18v6H3zM7 9v6M11 9v6M15 9v6M3 9l-1 9h6l1-3M21 9l1 9h-6l-1-3",
  corda: "M6 4v5a6 6 0 0 0 12 0V4M6 4h2M16 4h2M12 15v6M9 21h6",
  escada: "M3 21h4v-4h4v-4h4V9h4V5h2M3 21V17h4",
  raio: "M13 3L5 13h6l-1 8 8-10h-6l1-8z",
  kettlebell: "M9 7V5a3 3 0 0 1 6 0v2M12 7a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM9 7h6",
  bandeira: "M5 21V4M5 4h13l-3 4 3 4H5",
  pino: "M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  chat: "M4 5h16v11H9l-5 4v-4H4zM8 9h8M8 12h5",
};

export default function IconeFerramenta({ id, className = "w-6 h-6" }: { id: IconeId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={CAMINHOS[id]} />
    </svg>
  );
}

/** Ícone da lupa da busca — mesma família. */
export function IconeLupa({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM20 20l-4.9-4.9" />
    </svg>
  );
}
