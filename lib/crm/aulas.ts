/**
 * Aulas do pacote flexível: ler as datas coladas e contar o que sobra.
 *
 * O controle das aulas vive no WhatsApp do Montinho, numa lista que ele
 * mantém aluno por aluno ("-06/08, -07/08, -10/08…"). Em vez de pedir que
 * ele digite tudo de novo num formulário, o CRM lê a lista colada como ela
 * é: com hífen na frente, com cabeçalho em inglês no meio, com ou sem ano.
 *
 * Tudo aqui é puro — sem banco, sem fuso de servidor. Quem grava é a ação.
 */

/** Uma data solta ("6/8", "06/08/2026", "2026-08-06") vira ISO, ou null se não for data. */
function lerUma(bruto: string, hoje: Date): string | null {
  const t = bruto.trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (iso) return valida(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const br = /^(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2,4}))?$/.exec(t);
  if (!br) return null;
  const dia = Number(br[1]); const mes = Number(br[2]);
  if (br[3]) {
    const a = Number(br[3]);
    return valida(a < 100 ? 2000 + a : a, mes, dia);
  }
  /*
   * Sem ano, a resposta certa é quase sempre "o ano que deixa a data no
   * passado recente": quem cola uma lista está registrando aula que já
   * aconteceu. Em 15/09/2026, "06/08" é deste ano e "20/12" é do ano
   * passado — não uma aula que ainda vai acontecer em dezembro.
   */
  const ano = hoje.getFullYear();
  const candidata = valida(ano, mes, dia);
  if (!candidata) return null;
  const limite = new Date(hoje.getTime() + 2 * 86_400_000).toISOString().slice(0, 10); // 2 dias de folga
  return candidata <= limite ? candidata : valida(ano - 1, mes, dia);
}

function valida(ano: number, mes: number, dia: number): string | null {
  if (ano < 2000 || ano > 2100 || mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;
  const d = new Date(Date.UTC(ano, mes - 1, dia));
  // 31/02 vira 03/03 no Date; se o dia mudou, a data não existia.
  if (d.getUTCMonth() !== mes - 1 || d.getUTCDate() !== dia) return null;
  return d.toISOString().slice(0, 10);
}

export interface LeituraDeDatas { datas: string[]; repetidas: string[]; ignoradas: string[] }

/**
 * Lê todas as datas de um texto colado. Devolve ordenado, sem repetição,
 * e diz o que foi ignorado — para a tela poder mostrar em vez de engolir.
 */
export function lerDatas(texto: string, hoje = new Date()): LeituraDeDatas {
  const datas: string[] = []; const repetidas: string[] = []; const ignoradas: string[] = [];
  const pedacos = (texto ?? "").split(/[\n,;]+/);
  for (const p of pedacos) {
    // Tira marcador de lista, espaços e texto solto colado junto ("-06/08 (manhã)").
    const limpo = p.replace(/^[\s\-–—•*>]+/, "").trim();
    if (!limpo) continue;
    const achou = /(\d{4}-\d{2}-\d{2}|\d{1,2}[/.-]\d{1,2}(?:[/.-]\d{2,4})?)/.exec(limpo);
    if (!achou) { if (/\d/.test(limpo)) ignoradas.push(limpo); continue; }
    const d = lerUma(achou[1], hoje);
    if (!d) { ignoradas.push(limpo); continue; }
    if (datas.includes(d)) repetidas.push(d); else datas.push(d);
  }
  datas.sort();
  return { datas, repetidas, ignoradas };
}

export interface Pacote { usadas: number; contratadas: number | null; restantes: number | null; terminou: boolean }

/** Onde o pacote está. Sem tamanho contratado não há pacote: é plano por data. */
export function resumoDoPacote(usadas: number, contratadas: number | null | undefined): Pacote {
  if (contratadas == null || contratadas <= 0) return { usadas, contratadas: null, restantes: null, terminou: false };
  const restantes = Math.max(0, contratadas - usadas);
  return { usadas, contratadas, restantes, terminou: usadas >= contratadas };
}

/**
 * Ritmo do aluno no pacote flexível.
 *
 * Sem rotina fixa, a única forma de saber quando o pacote acaba é olhar o
 * que já aconteceu: quantos dias entre uma aula e a seguinte. Isso responde
 * as duas perguntas que importam — há quanto tempo essa pessoa treina neste
 * pacote, e quando ele deve fechar no ritmo atual.
 *
 * A conta é do INTERVALO, não do total dividido pelas semanas: com 14 aulas
 * em 40 dias, o que se repete é "uma aula a cada 3 dias", e é isso que
 * projeta as próximas. Duas aulas é o mínimo — com uma só não há ritmo,
 * e inventar um a partir de um ponto seria chute com cara de número.
 */
export interface Ritmo {
  primeira: string | null; ultima: string | null;
  diasCorridos: number | null; semanas: number | null;
  intervaloMedio: number | null; porSemana: number | null;
  diasDesdeUltima: number | null;
  fimPrevisto: string | null; diasParaFim: number | null;
}

const DIA = 86_400_000;
const emDias = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / DIA);

export function ritmoDoPacote(datas: string[], restantes: number | null = null, hoje = new Date()): Ritmo {
  const xs = [...datas].sort();
  const vazio: Ritmo = { primeira: null, ultima: null, diasCorridos: null, semanas: null, intervaloMedio: null, porSemana: null, diasDesdeUltima: null, fimPrevisto: null, diasParaFim: null };
  if (xs.length === 0) return vazio;
  const primeira = xs[0]; const ultima = xs[xs.length - 1];
  const dia = hoje.toISOString().slice(0, 10);
  const diasDesdeUltima = Math.max(0, emDias(ultima, dia));
  if (xs.length < 2) return { ...vazio, primeira, ultima, diasCorridos: 0, semanas: 0, diasDesdeUltima };

  const diasCorridos = emDias(primeira, ultima);
  // Todas no mesmo dia: existe pacote, mas ainda não existe ritmo.
  if (diasCorridos <= 0) return { ...vazio, primeira, ultima, diasCorridos: 0, semanas: 0, diasDesdeUltima };
  const intervaloMedio = diasCorridos / (xs.length - 1);
  const porSemana = 7 / intervaloMedio;

  let fimPrevisto: string | null = null; let diasParaFim: number | null = null;
  if (restantes != null && restantes > 0) {
    // Conta do último marco real: a última aula, ou hoje se o aluno sumiu desde então.
    const partida = ultima > dia ? ultima : dia;
    diasParaFim = Math.round(restantes * intervaloMedio);
    fimPrevisto = new Date(Date.parse(`${partida}T12:00:00Z`) + diasParaFim * DIA).toISOString().slice(0, 10);
  }
  return { primeira, ultima, diasCorridos, semanas: diasCorridos / 7, intervaloMedio, porSemana, diasDesdeUltima, fimPrevisto, diasParaFim };
}

/** "2,3 aulas por semana, uma a cada 3 dias" — o ritmo em português. */
export function descreverRitmo(r: Ritmo): string {
  if (r.porSemana == null || r.intervaloMedio == null) return "ritmo ainda não dá para calcular";
  const n = (x: number) => x.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  return `${n(r.porSemana)} aulas por semana, uma a cada ${n(r.intervaloMedio)} dias`;
}

/** "06/08, 07/08, 10/08" — como o aluno lê, na ordem em que aconteceu. */
export function formatarDatas(datas: string[]): string {
  return datas.map((d) => `${d.slice(8, 10)}/${d.slice(5, 7)}`).join(", ");
}
