/**
 * O porquê de cada gargalo do "Meu Shape em 12 Semanas". Reaproveita as
 * evidências dos outros dois simuladores onde o assunto é o mesmo (para os
 * três nunca contarem histórias diferentes) e acrescenta as que só existem
 * aqui: sono, recuperação e fim de semana.
 */

import { evidencia, type Evidencia } from "./evidencias";
import { evidenciaMassa } from "./evidencias-massa";
import type { Gargalo12 } from "./shape12";

type Ev = Pick<Evidencia, "titulo" | "resumo" | "estudos" | "pratica" | "relatos" | "acao">;

const SONO: Ev = {
  titulo: "Sono",
  resumo: "Não muda quanto você perde — muda o que você perde.",
  estudos: [{ texto: "Dez adultos fizeram a mesma dieta duas vezes, dormindo 8,5 h ou 5,5 h. Perderam o mesmo peso; com sono curto, 55% menos gordura e 60% mais massa magra, e mais fome.", ref: { rotulo: "Nedeltcheva AV et al. Annals of Internal Medicine, 2010;153:435-441", url: "https://www.acpjournals.org/doi/abs/10.7326/0003-4819-153-7-201010050-00006" } }],
  pratica: "O aluno que dorme 5 horas chega no treino sem força, come mais à noite e desiste mais cedo da semana. Quando o sono melhora, quase tudo melhora junto — sem mexer no plano.",
  relatos: "“Comecei a dormir melhor e a fome da noite sumiu” é um dos relatos mais comuns de quem ajusta a rotina.",
  acao: "Escolha um horário fixo para largar a tela e ganhe 30 minutos de sono na maioria das noites. Mais que isso é bônus.",
};
const RECUPERACAO: Ev = {
  titulo: "Recuperação",
  resumo: "Músculo cresce entre os treinos, não durante.",
  estudos: [
    { texto: "Cerca de 10 séries por músculo por semana é a referência de volume — o que cabe em 3 a 4 treinos. Acima disso, o que decide é se o corpo recupera.", ref: { rotulo: "Schoenfeld BJ, Ogborn D, Krieger JW. Journal of Sports Sciences, 2017;35:1073-1082", url: "https://pubmed.ncbi.nlm.nih.gov/27433992/" } },
    { texto: "Sono curto em déficit desloca a perda de peso para massa magra.", ref: { rotulo: "Nedeltcheva AV et al. Annals of Internal Medicine, 2010;153:435-441", url: "https://www.acpjournals.org/doi/abs/10.7326/0003-4819-153-7-201010050-00006" } },
  ],
  pratica: "Seis treinos por semana com sono curto quase sempre significam cargas estagnadas e dores que não passam. Tirar um treino e dormir mais costuma fazer as cargas voltarem a subir em duas semanas.",
  relatos: "“Diminuí de 6 para 4 treinos e comecei a evoluir” aparece com frequência em fóruns de musculação.",
  acao: "Troque um dia de treino por um dia de descanso de verdade por 3 semanas e compare as cargas.",
};
const FIM_DE_SEMANA: Ev = {
  titulo: "Fim de semana",
  resumo: "Três dias de sete podem anular quatro.",
  estudos: [{ texto: "Pesando adultos todos os dias por um ano, o peso subia de sexta a domingo e caía de segunda a quinta. Quem não perdia o fim de semana emagrecia; quem perdia, oscilava.", ref: { rotulo: "Racette SB et al. Obesity, 2008;16:1826-1830", url: "https://onlinelibrary.wiley.com/doi/10.1038/oby.2008.320" } }],
  pratica: "O aluno que “faz tudo certo” de segunda a quinta e solta de sexta a domingo relata que não sai do lugar. Não é o corpo dele: é a média da semana.",
  relatos: "“Fui perfeito a semana toda e o fim de semana estragou tudo” é o relato mais repetido de quem tenta emagrecer sozinho.",
  acao: "Não corte o fim de semana — torne ele “meio certo”: uma refeição livre em vez de duas, uma caminhada em vez de zero.",
};

export function evidencia12(g: Gargalo12): Ev {
  switch (g) {
    case "sono": return SONO;
    case "recuperacao": return RECUPERACAO;
    case "fim-de-semana": return FIM_DE_SEMANA;
    case "consistencia": return evidencia("consistencia");
    case "treino": return evidencia("treino");
    case "movimento": return evidencia("passos");
    case "comida": return evidencia("comida");
    case "saude": return evidenciaMassa("saude");
    case "bem": return evidenciaMassa("paciencia");
  }
}

export const EVIDENCIAS_12_PROPRIAS = [SONO, RECUPERACAO, FIM_DE_SEMANA];
