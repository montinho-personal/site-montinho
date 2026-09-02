/**
 * O que a pessoa já fez nesta sessão — e o que isso muda no próximo passo.
 *
 * POR QUE EXISTE
 *
 * Quem calculou a proteína e parou ali está em outro momento de quem
 * calculou proteína, macros e déficit em sequência. Oferecer o WhatsApp
 * para o primeiro é pedir conversa antes da dúvida existir; oferecer só
 * "próxima ferramenta" para o segundo é deixar de ajudar quem já fez o
 * dever de casa. O estágio decide o destino; a ferramenta decide o texto.
 *
 * A ESCADA
 *
 *   0 ferramentas antes desta  → próxima ferramenta   (microconversão)
 *   1 ferramenta antes         → diagnóstico          (compromisso médio)
 *   2 ou mais                  → WhatsApp             (ajuda humana)
 *
 * Quem já clicou no WhatsApp nesta sessão desce um degrau: repetir o convite
 * de conversa para quem acabou de abrir uma conversa é saturação.
 *
 * O QUE FICA E O QUE SAI
 *
 * sessionStorage, nunca localStorage: a escada é da sessão, não da pessoa.
 * Guarda só o NOME das ferramentas usadas e a ordem — nenhum resultado,
 * nenhum número, nenhum dado corporal. É o mínimo para decidir o degrau.
 */

export type Ferramenta =
  | "proteina"
  | "macros"
  | "deficit"
  | "tdee"
  | "volume"
  | "onerm"
  | "diagnostico"
  | "rotina"
  | "academia"
  | "cardapio"
  | "alimentos";

export type Estagio = "proxima" | "diagnostico" | "whatsapp";

export interface Historico {
  /** Ferramentas concluídas nesta sessão, na ordem, sem repetição. */
  usadas: Ferramenta[];
  /** A pessoa já abriu um WhatsApp a partir de uma ferramenta nesta sessão. */
  abriuWhatsapp: boolean;
}

const CHAVE = "montinho:ferramentas:historico";

const vazio = (): Historico => ({ usadas: [], abriuWhatsapp: false });

export function leHistorico(): Historico {
  try {
    const bruto = sessionStorage.getItem(CHAVE);
    if (!bruto) return vazio();
    const h = JSON.parse(bruto) as Partial<Historico>;
    return {
      usadas: Array.isArray(h.usadas) ? (h.usadas.filter((x) => typeof x === "string") as Ferramenta[]) : [],
      abriuWhatsapp: h.abriuWhatsapp === true,
    };
  } catch {
    return vazio();
  }
}

function grava(h: Historico): void {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(h));
  } catch {
    /* sem storage: a escada recomeça a cada página, e tudo bem. */
  }
}

/**
 * Registra que a ferramenta entregou resultado. Devolve o histórico ANTES
 * desta conclusão — é dele que o estágio é calculado, porque a pergunta é
 * "o que a pessoa fez antes de chegar aqui", não "incluindo aqui".
 */
export function registraConclusao(f: Ferramenta): Historico {
  const antes = leHistorico();
  if (!antes.usadas.includes(f)) grava({ ...antes, usadas: [...antes.usadas, f] });
  return antes;
}

export function registraWhatsapp(): void {
  const h = leHistorico();
  if (!h.abriuWhatsapp) grava({ ...h, abriuWhatsapp: true });
}

/**
 * O degrau da escada para quem acabou de concluir `atual`, dado o que fez
 * antes. Só conta ferramentas DIFERENTES da atual — refazer a mesma conta
 * três vezes não é progressão de compromisso.
 */
export function estagio(antes: Historico, atual: Ferramenta): Estagio {
  const outras = antes.usadas.filter((u) => u !== atual).length;
  let e: Estagio = outras >= 2 ? "whatsapp" : outras === 1 ? "diagnostico" : "proxima";
  if (e === "whatsapp" && antes.abriuWhatsapp) e = "diagnostico";
  return e;
}

/** A ferramenta imediatamente anterior — vai no evento como `previous_tool`. */
export function anterior(antes: Historico, atual: Ferramenta): Ferramenta | null {
  const outras = antes.usadas.filter((u) => u !== atual);
  return outras.length ? outras[outras.length - 1] : null;
}
