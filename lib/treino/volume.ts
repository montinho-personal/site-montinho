/**
 * Cálculo de volume semanal por grupo muscular.
 *
 * O indicador principal é SÉRIES DE TRABALHO POR MÚSCULO POR SEMANA. Não é a
 * única definição de volume que existe na literatura — tonelagem (séries ×
 * reps × carga) é outra — mas é a que serve para a pergunta prática "meu
 * treino está fazendo quanto para cada músculo".
 *
 * Duas regras estruturam a conta:
 *
 * 1. Série DIRETA: o músculo é um dos alvos principais do exercício. Conta 1.
 *    Um exercício pode ter mais de um primário (agachamento é quadríceps e
 *    glúteo) e cada um recebe a série cheia — não é divisão, é participação
 *    principal nos dois.
 *
 * 2. Série EQUIVALENTE (opcional): o músculo participa como auxiliar. Conta
 *    0,5. Esse 0,5 é convenção de modelagem, não achado científico, e a
 *    interface é obrigada a dizer isso. Serve para visualizar que o tríceps
 *    de quem faz muito supino não está em zero.
 *
 * O que a ferramenta NUNCA faz: somar as participações como se uma série
 * tivesse virado três séries independentes. Cada série aparece uma vez por
 * músculo, e o total por músculo é o que se lê — não existe "total geral de
 * séries por músculo" somando tudo.
 */

import { EXERCICIO_POR_ID, type Exercicio } from "./exercicios";
import { MUSCULOS, type Dia, type MusculoId } from "./musculos";

/** Peso da participação secundária. Convenção declarada, não lei. */
export const PESO_SECUNDARIO = 0.5;

export interface ItemTreino {
  /** Identificador único da linha, para editar e remover. */
  uid: string;
  /** Exercício da base, ou null quando é personalizado. */
  exercicioId: string | null;
  /** Nome exibido — o da base, ou o que a pessoa digitou. */
  nome: string;
  series: number;
  /** Aquecimento não entra no volume de trabalho. */
  tipo: "trabalho" | "aquecimento";
  /** Sobrescreve a classificação da base, quando a pessoa edita. */
  primarios: MusculoId[];
  secundarios: MusculoId[];
  unilateral: boolean;
}

export interface DiaTreino {
  uid: string;
  dia: Dia;
  nome: string;
  itens: ItemTreino[];
}

export interface DetalheExercicio {
  nome: string;
  series: number;
  dia: Dia;
  /** Direto quando o músculo é primário; indireto quando é secundário. */
  direto: boolean;
}

export interface VolumeMusculo {
  musculo: MusculoId;
  /** Séries em que o músculo é alvo principal. O número que importa. */
  diretas: number;
  /** Contribuição estimada dos exercícios em que ele é auxiliar. */
  equivalentesIndiretas: number;
  /** Quantos DIAS distintos têm pelo menos uma série direta. */
  sessoes: number;
  /** Séries diretas por dia, só dos dias que treinam o músculo. */
  porDia: { dia: Dia; nome: string; series: number }[];
  /** De onde vêm as séries — direto e indireto, separados. */
  exercicios: DetalheExercicio[];
}

/** Cria um item a partir de um exercício da base. */
export function itemDeExercicio(e: Exercicio, uid: string, series = 3): ItemTreino {
  return {
    uid,
    exercicioId: e.id,
    nome: e.nome,
    series,
    tipo: "trabalho",
    primarios: [...e.primarios],
    secundarios: [...(e.secundarios ?? [])],
    unilateral: e.unilateral ?? false,
  };
}

/**
 * Calcula o volume de todos os músculos.
 *
 * Sobre unilateral: as séries entram como informadas. Quem fez "3 séries de
 * afundo por perna" fez 3 séries de estímulo para o quadríceps, não 6 —
 * dobrar aqui seria inflar o volume de qualquer treino com trabalho
 * unilateral, que é justamente o de quem treina perna com cuidado.
 */
export function calculaVolume(dias: DiaTreino[]): VolumeMusculo[] {
  const mapa = new Map<MusculoId, VolumeMusculo>();
  const garante = (m: MusculoId): VolumeMusculo => {
    let v = mapa.get(m);
    if (!v) {
      v = { musculo: m, diretas: 0, equivalentesIndiretas: 0, sessoes: 0, porDia: [], exercicios: [] };
      mapa.set(m, v);
    }
    return v;
  };

  /** Séries diretas por músculo e por dia — base para sessões e distribuição. */
  const porDia = new Map<MusculoId, Map<string, { dia: Dia; nome: string; series: number }>>();

  for (const d of dias) {
    for (const it of d.itens) {
      if (it.tipo !== "trabalho" || it.series <= 0) continue;

      for (const m of it.primarios) {
        const v = garante(m);
        v.diretas += it.series;
        v.exercicios.push({ nome: it.nome, series: it.series, dia: d.dia, direto: true });

        if (!porDia.has(m)) porDia.set(m, new Map());
        const dm = porDia.get(m)!;
        const atual = dm.get(d.uid);
        if (atual) atual.series += it.series;
        else dm.set(d.uid, { dia: d.dia, nome: d.nome, series: it.series });
      }

      for (const m of it.secundarios) {
        /** Um músculo primário do mesmo exercício não recebe também o bônus. */
        if (it.primarios.includes(m)) continue;
        const v = garante(m);
        v.equivalentesIndiretas += it.series * PESO_SECUNDARIO;
        v.exercicios.push({ nome: it.nome, series: it.series, dia: d.dia, direto: false });
      }
    }
  }

  for (const [m, dm] of porDia) {
    const v = garante(m);
    v.porDia = [...dm.values()];
    v.sessoes = v.porDia.length;
  }

  /** Ordem estável pela taxonomia, para a tela não dançar a cada edição. */
  const ordem = new Map(MUSCULOS.map((m, i) => [m.id, i]));
  return [...mapa.values()].sort((a, b) => (ordem.get(a.musculo) ?? 99) - (ordem.get(b.musculo) ?? 99));
}

/** Séries equivalentes = diretas + contribuição indireta estimada. */
export function equivalentes(v: VolumeMusculo): number {
  return v.diretas + v.equivalentesIndiretas;
}

/** Média por sessão, só entre os dias que de fato treinam o músculo. */
export function mediaPorSessao(v: VolumeMusculo): number {
  return v.sessoes > 0 ? v.diretas / v.sessoes : 0;
}

// ─── Classificação ───────────────────────────────────────────────────────────

export type NivelVolume = "muito-baixo" | "baixo" | "moderado" | "elevado" | "muito-elevado";

export interface FaixaVolume {
  nivel: NivelVolume;
  rotulo: string;
  min: number;
  max: number | null;
  texto: string;
}

/**
 * Faixas de referência — descritivas, nunca prescritivas.
 *
 * Os rótulos são neutros de propósito ("elevado", não "excessivo"; nunca
 * "ideal" nem "ruim"). A ferramenta não sabe o esforço, a técnica, a
 * proximidade da falha, a recuperação, o histórico nem o objetivo de quem
 * digitou — não tem informação para dizer o que a pessoa deveria fazer.
 *
 * Os cortes vêm da literatura citada em FONTES: o ACSM 2026 descreve
 * benefício associado a volumes maiores com referência em torno de 10 séries
 * semanais e relação dose-resposta com retornos progressivamente menores em
 * volumes altos. Isso NÃO autoriza dizer "todo mundo precisa de 10 a 20
 * séries" — as faixas aqui são régua de leitura, não meta.
 */
export const FAIXAS: FaixaVolume[] = [
  {
    nivel: "muito-baixo",
    rotulo: "Volume muito baixo",
    min: 0,
    max: 4,
    texto:
      "Poucas séries diretas para esse grupo em comparação aos volumes normalmente estudados para hipertrofia. Pode fazer sentido em manutenção, retorno de lesão ou fase de foco em outro músculo.",
  },
  {
    nivel: "baixo",
    rotulo: "Volume baixo",
    min: 5,
    max: 9,
    texto:
      "Abaixo da faixa mais comum nos estudos de hipertrofia, o que não significa que seja insuficiente para todo mundo — depende do esforço das séries, da fase e do objetivo.",
  },
  {
    nivel: "moderado",
    rotulo: "Volume moderado",
    min: 10,
    max: 14,
    texto:
      "Quantidade dentro de uma faixa frequentemente utilizada em estudos e programas de hipertrofia.",
  },
  {
    nivel: "elevado",
    rotulo: "Volume elevado",
    min: 15,
    max: 19,
    texto:
      "Volumes maiores podem gerar mais estímulo, mas os benefícios adicionais tendem a diminuir progressivamente e a recuperação passa a pesar mais.",
  },
  {
    nivel: "muito-elevado",
    rotulo: "Volume muito elevado",
    min: 20,
    max: null,
    texto:
      "Acima da faixa usada em muitos protocolos. Isso não significa automaticamente excesso, mas vale observar desempenho, recuperação e qualidade das séries ao longo das semanas.",
  },
];

export function classificaVolume(series: number): FaixaVolume {
  for (const f of FAIXAS) {
    if (series >= f.min && (f.max === null || series <= f.max)) return f;
  }
  return FAIXAS[0];
}

// ─── Concentração ────────────────────────────────────────────────────────────

/** A partir de quanto do volume num único dia vale comentar. */
export const LIMITE_CONCENTRACAO = 0.75;
/** Abaixo desse volume semanal, concentrar num dia não é observação útil. */
export const MINIMO_PARA_CONCENTRACAO = 10;

/**
 * Detecta volume concentrado num único dia.
 *
 * Não é diagnóstico de erro: treinar um músculo uma vez por semana é uma
 * escolha legítima, e a literatura não sustenta que mais frequência seja
 * melhor quando o volume semanal é igualado. O que a observação diz é outra
 * coisa — que muitas séries na mesma sessão podem custar qualidade nas
 * últimas.
 */
export function estaConcentrado(v: VolumeMusculo): boolean {
  if (v.diretas < MINIMO_PARA_CONCENTRACAO || v.porDia.length === 0) return false;
  const maior = Math.max(...v.porDia.map((d) => d.series));
  return maior / v.diretas >= LIMITE_CONCENTRACAO;
}

export const TEXTO_CONCENTRACAO =
  "Grande parte do volume desse músculo está concentrada em uma única sessão. Dependendo do esforço e da qualidade das séries, distribuir parte desse volume em outra sessão pode facilitar a manutenção do desempenho — não é uma regra, e treinar um músculo uma vez por semana também funciona para muita gente.";

// ─── Achados para revisão ────────────────────────────────────────────────────

export type TipoAchado = "muito-baixo" | "muito-elevado" | "concentrado";

export interface Achado {
  musculo: MusculoId;
  tipo: TipoAchado;
  /** Frase curta e neutra — observação, nunca diagnóstico. */
  texto: string;
}

/**
 * O que a análise encontrou de concreto no treino DESTA pessoa — a matéria-
 * prima do convite de revisão. Só entram os extremos (muito baixo, muito
 * elevado, concentrado num dia): "volume baixo" e "elevado" são escolhas
 * legítimas demais para virarem bandeira. E nada aqui é diagnóstico — cada
 * frase observa e devolve a decisão para a pessoa (ou para a conversa).
 *
 * O corte de 3+ exercícios existe porque uma ficha quase vazia gera
 * "achados" em tudo — e convite construído sobre análise rasa é spam.
 */
export function achadosParaRevisao(volumes: VolumeMusculo[], totalExercicios: number): Achado[] {
  if (totalExercicios < 3) return [];
  const achados: Achado[] = [];
  for (const v of volumes) {
    if (v.diretas <= 0) continue;
    const faixa = classificaVolume(v.diretas);
    if (faixa.nivel === "muito-baixo") {
      achados.push({ musculo: v.musculo, tipo: "muito-baixo", texto: `${v.diretas} séries semanais — bem abaixo das faixas normalmente estudadas` });
    } else if (faixa.nivel === "muito-elevado") {
      achados.push({ musculo: v.musculo, tipo: "muito-elevado", texto: `${v.diretas} séries semanais — acima da faixa da maioria dos protocolos` });
    } else if (estaConcentrado(v)) {
      achados.push({ musculo: v.musculo, tipo: "concentrado", texto: "quase todo o volume numa única sessão" });
    }
  }
  return achados.slice(0, 3);
}

export const CONVITE_REVISAO =
  "Nenhum desses pontos é um erro na certa — pode ser escolha sua, fase, prioridade. Mas é exatamente o tipo de coisa que eu olho no treino dos meus alunos: o que é intencional fica, o que é acidente a gente ajusta.";

/**
 * A mensagem que abre no WhatsApp — os achados já descritos, para a
 * conversa começar no assunto. Dado do treino da pessoa, enviado só quando
 * ELA clica em enviar: o mesmo contrato do Treino Para Minha Rotina.
 */
export function buildVolumeWhatsApp(achados: Achado[], nomeDe: (m: MusculoId) => string): string {
  const linhas = achados.map((a) => `- ${nomeDe(a.musculo)}: ${a.texto}`).join("\n");
  return (
    `Oi, Montinho! Analisei meu treino na Calculadora de Volume do seu site e apareceram estes pontos:\n\n` +
    `${linhas}\n\n` +
    `Queria que você olhasse meu treino inteiro e me dissesse o que vale ajustar.`
  );
}

// ─── Resumo geral ────────────────────────────────────────────────────────────

export interface ResumoTreino {
  diasComTreino: number;
  exercicios: number;
  seriesTrabalho: number;
  gruposAtingidos: number;
}

export function resumo(dias: DiaTreino[], volumes: VolumeMusculo[]): ResumoTreino {
  const comItens = dias.filter((d) => d.itens.some((i) => i.tipo === "trabalho" && i.series > 0));
  let exercicios = 0;
  let series = 0;
  for (const d of dias) {
    for (const i of d.itens) {
      if (i.tipo !== "trabalho" || i.series <= 0) continue;
      exercicios++;
      /**
       * A soma de séries de trabalho conta cada série UMA vez, e não uma vez
       * por músculo atingido. Somar por músculo transformaria um supino de 4
       * séries em 12 e inflaria o resumo inteiro.
       */
      series += i.series;
    }
  }
  return {
    diasComTreino: comItens.length,
    exercicios,
    seriesTrabalho: series,
    gruposAtingidos: volumes.filter((v) => v.diretas > 0).length,
  };
}

// ─── Fontes ──────────────────────────────────────────────────────────────────

export const FONTES = {
  /**
   * A evidência de que a resposta é MUITO individual. Hubal et al. treinaram
   * 585 pessoas com o mesmo programa por 12 semanas e mediram por ressonância:
   * a variação de tamanho do músculo foi de −2% a +59%. Mesmo estímulo, mesma
   * duração, respostas completamente diferentes.
   *
   * É a citação mais importante desta ferramenta. Sem ela, qualquer faixa de
   * volume vira promessa; com ela, fica claro que a faixa é o ponto de
   * partida e o corpo da pessoa é o juiz.
   */
  hubal: {
    rotulo: "Hubal et al., Medicine & Science in Sports & Exercise (2005)",
    url: "https://pubmed.ncbi.nlm.nih.gov/15947721/",
    resumo:
      "585 pessoas treinaram o mesmo programa por 12 semanas. O ganho de tamanho do músculo variou de −2% a +59% entre os participantes — algumas praticamente sem mudança, outras com ganho enorme, fazendo exatamente o mesmo treino.",
  },
  /**
   * Proximidade da falha. A leitura tem que ser precisa nos dois sentidos:
   * séries longe da falha não entregam o mesmo estímulo, MAS a falha absoluta
   * não se mostrou superior. Refalo et al. sugerem inclusive relação não
   * linear. Dizer "vá até a falha sempre" seria tão errado quanto ignorar o
   * esforço.
   */
  refalo: {
    rotulo: "Refalo et al., Sports Medicine (2023) e meta-regressões (2024)",
    url: "https://pubmed.ncbi.nlm.nih.gov/36334240/",
    resumo:
      "Revisões sistemáticas com meta-análise sobre proximidade da falha. Não encontraram evidência de que treinar até a falha momentânea seja superior ao treino sem falha para hipertrofia, sugerindo uma relação não linear — o que importa é a série ser desafiadora, não necessariamente terminar em falha.",
  },
  acsm: {
    rotulo:
      "American College of Sports Medicine. Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults: An Overview of Reviews (Position Stand, 2026)",
    url: "https://pubmed.ncbi.nlm.nih.gov/41843416/",
    resumo:
      "Síntese de 137 revisões sistemáticas e mais de 30 mil participantes. Descreve benefício de hipertrofia associado a volumes maiores, com referência em torno de 10 séries semanais por grupo, e uma relação dose-resposta com retornos progressivamente menores conforme o volume sobe.",
  },
  schoenfeld: {
    rotulo:
      "Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass. Journal of Sports Sciences (2017)",
    url: "https://pubmed.ncbi.nlm.nih.gov/27433992/",
    resumo:
      "Meta-análise que encontrou relação dose-resposta entre séries semanais por grupo muscular e ganho de massa.",
  },
};

export const NOTA_VOLUME_NAO_E_TUDO =
  "Volume é apenas uma das variáveis do treinamento. Carga, esforço, progressão, escolha de exercício, frequência, amplitude, recuperação e execução também influenciam o resultado.";

/**
 * O aviso mais importante da ferramenta, e por isso ele aparece na tela e
 * não escondido num accordion.
 *
 * Toda faixa de referência aqui é MÉDIA DE ESTUDO. Média descreve grupo, não
 * pessoa. Os mesmos 15 exercícios, as mesmas 15 séries, aplicados em 585
 * pessoas, produziram de −2% a +59% de mudança. Uma calculadora que mostra
 * "volume moderado" sem dizer isso está fingindo saber o que só o corpo da
 * pessoa responde ao longo das semanas.
 */
export const NOTA_INDIVIDUALIDADE =
  "Tudo aqui é o que os estudos mostram em média — e média descreve grupo, não pessoa. A resposta ao treino varia muito de um indivíduo para outro: genética, sono, alimentação, estresse, histórico, idade e recuperação mudam o que funciona para você. Use estes números como ponto de partida e teste no seu corpo, acompanhando desempenho, recuperação e resultado ao longo das semanas. Quem decide o seu volume é a sua resposta, não a tabela.";

/**
 * O que faz uma série contar de verdade.
 *
 * As faixas de referência vêm de estudos em que as séries foram levadas
 * PERTO DA FALHA. Uma série com seis repetições sobrando não entrega o mesmo
 * estímulo — mas continua contando 1 na planilha de qualquer um. É por isso
 * que duas pessoas com "16 séries de peitoral" podem estar em situações
 * completamente diferentes.
 *
 * A copy precisa acertar os dois lados: séries fáceis inflam o número, e
 * falha absoluta em tudo não é o remédio — a evidência não mostra
 * superioridade da falha momentânea.
 */
export const NOTA_SERIE_VALIDA =
  "Uma série só conta de verdade quando é desafiadora: levada até a falha ou perto dela, com poucas repetições sobrando. Séries confortáveis, longe da falha, enchem a planilha sem entregar o mesmo estímulo — 16 séries fáceis não são 16 séries. Isso não quer dizer ir à falha absoluta em tudo: a evidência não mostra que treinar até a falha momentânea seja superior. O ponto é que a série precisa exigir esforço real para valer o que a tabela diz.";

export const NOTA_SERIES_CONTABILIZADAS =
  "Contamos as séries que você registrou como trabalho. A ferramenta não sabe o quanto cada série chegou perto da falha, e por isso não as chama de séries efetivas.";

export const NOTA_EQUIVALENTES =
  "Exercícios compostos também estimulam músculos auxiliares, mas não existe conversão universal exata entre uma série indireta e uma série direta. A contagem equivalente usa 0,5 como convenção de modelagem para visualizar essa participação — é estimativa, não medida.";

export const NOTA_TECNICAS =
  "Técnicas como drop-set e rest-pause alteram o estímulo e a fadiga, mas não têm conversão universal em número de séries. Registre como a série que você fez.";

export const NOTA_FREQUENCIA =
  "Quando o volume semanal é igualado, aumentar a frequência isoladamente não mostra vantagem consistente para hipertrofia. Distribuir em mais sessões é útil principalmente para organizar volumes grandes e manter a qualidade das séries.";

export const NOTA_UNILATERAL =
  "Em exercícios unilaterais, informe as séries por lado. Fazer 3 séries com cada perna é 3 séries de estímulo para o músculo, não 6.";

// ─── Onde a calculadora aparece ──────────────────────────────────────────────

export const ARTIGOS_COM_CALCULADORA_VOLUME: string[] = [
  "volume-de-treino-ideal",
  "quantas-series-para-hipertrofia",
  "frequencia-de-treino",
  "push-pull-legs",
  "treino-upper-lower-superior-inferior",
  "como-montar-treino-abc",
];

/** Artigos de treino por grupo: recebem só um link contextual. */
export const ARTIGOS_COM_LINK_VOLUME: string[] = [
  "treino-de-peito-hipertrofia",
  "treino-de-costas-hipertrofia",
  "treino-de-perna-completo",
  "treino-de-gluteos-feminino",
];
