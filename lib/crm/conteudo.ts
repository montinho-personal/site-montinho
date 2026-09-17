/**
 * Conteúdo para lead adiado: dar sem cobrar, com teto.
 *
 * Quando o ciclo de follow-ups se esgota, a última mensagem prometeu não
 * cobrar de novo. Conteúdo é a única coisa que pode chegar depois dessa
 * promessa sem quebrá-la — e só enquanto não pedir nada em troca.
 *
 * O TETO NÃO É ETIQUETA
 *
 * Sem limite isto vira o mesmo laço infinito que o grupo "parado" era antes
 * do MAX_FOLLOW_UPS: a cada N dias a pessoa reaparece na fila, para sempre,
 * só que agora com artigo no lugar da cobrança. E tem um custo que o
 * follow-up não tem: mensagem não solicitada em série no WhatsApp é como se
 * ganha bloqueio, e um bloqueio estraga o número para todo mundo.
 *
 * QUEM NÃO RECEBE
 *
 * Quem pediu para ser deixado em paz (pediu silêncio, e conteúdo é barulho)
 * e quem foi perdido dizendo que decidiu não treinar. Perdido por outro
 * motivo continua elegível: "não é o momento" não é "não quero".
 */

/** Teto de envios por lead. Igual ao de follow-ups, e pela mesma razão. */
export const MAX_CONTEUDOS = 3;

/** Dias entre um envio e o próximo. */
export const INTERVALO_DIAS = 20;

export interface EnvioDeConteudo { enviadoEm: string }

export interface SituacaoDoLead {
  emPaz?: boolean;
  /** Código do motivo de perda, quando o lead está perdido. */
  motivoPerda?: string | null;
}

export type Veredito =
  | { pode: true; numero: number }
  | { pode: false; motivo: string; liberaEm?: string };

const DIA_MS = 86_400_000;

/** Quando o próximo envio fica liberado, a partir do último. */
export function proximoEnvioEm(ultimoEnvio: string, intervaloDias = INTERVALO_DIAS): Date {
  return new Date(new Date(ultimoEnvio).getTime() + intervaloDias * DIA_MS);
}

/**
 * @param envios todos os envios já feitos para o lead (qualquer ordem).
 */
export function podeEnviarConteudo(
  envios: EnvioDeConteudo[],
  situacao: SituacaoDoLead = {},
  agora = new Date(),
  intervaloDias = INTERVALO_DIAS,
  max = MAX_CONTEUDOS,
): Veredito {
  if (situacao.emPaz) return { pode: false, motivo: "Pediu para ser deixado em paz" };
  if (situacao.motivoPerda === "decided_not_to_train") {
    return { pode: false, motivo: "Disse que decidiu não treinar" };
  }
  const feitos = envios.filter((e) => !!e.enviadoEm).sort((a, b) => a.enviadoEm.localeCompare(b.enviadoEm));
  if (feitos.length >= max) return { pode: false, motivo: `Já recebeu ${max} conteúdos — o limite é esse` };
  const ultimo = feitos.at(-1);
  if (ultimo) {
    const libera = proximoEnvioEm(ultimo.enviadoEm, intervaloDias);
    if (agora < libera) {
      const faltam = Math.ceil((libera.getTime() - agora.getTime()) / DIA_MS);
      return { pode: false, motivo: `Último conteúdo foi há pouco — faltam ${faltam} dia${faltam > 1 ? "s" : ""}`, liberaEm: libera.toISOString() };
    }
  }
  return { pode: true, numero: feitos.length + 1 };
}

/**
 * Token do link. Aleatório de propósito: se fosse derivado do id do lead ou
 * do telefone, quem recebesse dois links poderia deduzir a regra e sondar
 * outros. Sem O, 0, I e 1 porque este código às vezes é lido em voz alta.
 */
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function gerarToken(bytes = new Uint8Array(10)): string {
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALFABETO[b % ALFABETO.length]).join("");
}

/** O destino tem de ser um caminho do próprio site: redirecionador aberto vira ferramenta de golpe. */
export function destinoValido(destino: string): boolean {
  return /^\/[A-Za-z0-9/_-]*$/.test(destino) && !destino.startsWith("//");
}

/** URL que vai na mensagem. */
export function urlDoConteudo(origem: string, token: string): string {
  return `${origem.replace(/\/$/, "")}/c/${token}`;
}

/** Para onde o /c/<token> manda, com a marcação de origem. */
export function destinoComUtm(destino: string, token: string): string {
  const [caminho, query] = destino.split("?");
  const u = new URLSearchParams(query);
  u.set("utm_source", "crm");
  u.set("utm_medium", "whatsapp");
  u.set("utm_campaign", "conteudo_lead");
  u.set("utm_content", token);
  return `${caminho}?${u.toString()}`;
}

/**
 * O clique veio antes de ela voltar a falar?
 *
 * Isto é a alternativa ao cookie. O cookie diria "foi este conteúdo que a
 * trouxe"; esta função diz apenas o que aconteceu e quando, e deixa a
 * conclusão para quem lê. É a mesma escolha que o CRM já faz quando o código
 * Ref some da mensagem: não adivinha, mostra o que sabe e deixa uma pessoa
 * ligar — porque atribuição inventada é pior que atribuição faltando.
 *
 * A janela existe para não sugerir ligação onde não há: alguém que clicou em
 * março e escreveu em setembro não voltou por causa do artigo, e mostrar "há
 * 180 dias" ao lado do retorno convidaria justamente a essa leitura.
 */
export const JANELA_RETORNO_DIAS = 30;

export function cliqueAntesDoRetorno(
  cliqueEm: string | null | undefined,
  retornoEm: string | null | undefined,
  janelaDias = JANELA_RETORNO_DIAS,
): { dias: number } | null {
  if (!cliqueEm || !retornoEm) return null;
  const dt = new Date(retornoEm).getTime() - new Date(cliqueEm).getTime();
  if (!Number.isFinite(dt) || dt < 0 || dt > janelaDias * DIA_MS) return null;
  return { dias: Math.floor(dt / DIA_MS) };
}

/** Como isso aparece escrito, sem afirmar causa. */
export function textoDoRetorno(r: { dias: number }): string {
  if (r.dias === 0) return "clicou e te chamou no mesmo dia";
  if (r.dias === 1) return "clicou 1 dia antes de te chamar";
  return `clicou ${r.dias} dias antes de te chamar`;
}
