import type { BlogPost } from "@/lib/blog";
import { getWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Revisão Gratuita de Execução.
 *
 * A ferramenta é deliberadamente sem software: o site não recebe, não guarda e
 * não processa vídeo nenhum. Ele só abre o WhatsApp com uma mensagem curta —
 * a pessoa anexa o vídeo lá, e o Montinho assiste pessoalmente.
 *
 * Nada aqui pede nome, telefone, exercício ou cadastro: cada campo a mais é
 * gente que desiste no meio.
 */

/** Movimento nomeado — dá para gravar uma série e mostrar. */
const MOVIMENTO =
  /agachamento|supino|levantamento-terra|remada|rosca|desenvolvimento|barra-fixa|leg-press|leg-curl|puxada|crucifixo|stiff|afundo|passada|elevacao-lateral|triceps|biceps|panturrilha|prancha|hip-thrust|paralela|pulldown|encolhimento|glute-bridge|hack-|cadeira-(extensora|flexora|abdutora|adutora)/;

/** Conteúdo declaradamente sobre como executar. */
const EXECUCAO = /^como-fazer-|execucao|tecnica|^erros-|como-nao-|postura-no-/;

/**
 * Assuntos que NÃO devem receber o convite.
 *
 * Dor e lesão ficam de fora de propósito: quem procura porque sente dor não
 * pode ser convidado a mandar um vídeo esperando descobrir o problema — isso
 * seria prometer diagnóstico. Emagrecimento, dieta e páginas de academia ou
 * serviço também saem: não há execução para revisar ali.
 */
const FORA =
  /dor-|lesao|lesoes|tendinite|bursite|hernia|condromalacia|artrose|artrite|emagrec|gordura|dieta|caloria|academia-|personal-trainer|quanto-custa/;

/** Este artigo é sobre executar um movimento? */
export function artigoDeExecucao(post: BlogPost): boolean {
  const s = post.slug;
  if (FORA.test(s)) return false;
  return EXECUCAO.test(s) || MOVIMENTO.test(s);
}

/**
 * Mensagem que abre no WhatsApp.
 *
 * Curta de propósito. Quando vem de um artigo, cita o tema — assim o Montinho
 * já sabe o exercício sem ter precisado perguntar antes, que é justamente a
 * pergunta que faria a pessoa desistir.
 */
export function revisaoWhatsAppUrl(tituloArtigo?: string): string {
  const base = tituloArtigo
    ? `Oi, Montinho! Vim pelo artigo "${tituloArtigo}" e queria a revisão gratuita da minha execução. Vou mandar o vídeo aqui 👇`
    : "Oi, Montinho! Vim pelo site e queria a revisão gratuita da minha execução. Vou mandar o vídeo aqui 👇";
  return getWhatsAppUrl(base);
}
