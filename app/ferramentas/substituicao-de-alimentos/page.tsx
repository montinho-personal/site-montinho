import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import TrocaCerta from "@/components/alimentos/TrocaCerta";
import BotaoImprimirLista from "@/components/alimentos/BotaoImprimirLista";
import { alimentosIndexaveis } from "@/lib/alimentos/base";
import { FONTES } from "@/lib/alimentos/fontes";
import { formataNumero } from "@/lib/alimentos/escala";
import { alimentosEq } from "@/lib/alimentos/equivalencia-base";
import {
  AVISO_GERAL,
  GRUPOS,
  MEMBROS,
  REFERENCIAS,
  macrosDe,
  nomeCriterio,
  nomeExibicao,
  trocas,
  type AlimentoEq,
  type Criterio,
} from "@/lib/alimentos/equivalencia";

/**
 * Troca Certa — Calculadora e Lista de Substituição de Alimentos.
 *
 * A pesquisa do termo (Answer the Public, 14/10/2026) mostrou que a busca
 * dominante não é "calculadora": é "lista de substituição de alimentos"
 * (590/mês), "lista ... taco" (170), "tabela ... pdf" (140) e só depois
 * "calculadora" (70). A página entrega as duas coisas com a mesma conta: a
 * calculadora para o caso da pessoa e, abaixo, a lista pronta por grupo,
 * imprimível. Nenhum número desta página é digitado: tudo sai do motor
 * (lib/alimentos/equivalencia.ts) sobre a TACO, no build.
 */

const CAMINHO = "/ferramentas/substituicao-de-alimentos";

export const metadata: Metadata = {
  title: "Lista de Substituição de Alimentos: Calculadora e Tabela",
  description:
    "Quanto de batata, pão ou cuscuz substitui o arroz? Quantos ovos valem 100 g de frango? Calcule a troca por carboidrato, proteína ou calorias, pela TACO.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Troca Certa: Calculadora de Substituição de Alimentos | Montinho",
    description: "Você diz o que vai sair do prato. A calculadora diz quanto colocar no lugar, pela TACO.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Troca Certa — Calculadora de Substituição de Alimentos",
  descricao:
    "Calcula quanto de outro alimento substitui uma quantidade informada, mantendo carboidratos, proteína ou calorias aproximadamente equivalentes, com dados da TACO e medidas caseiras da POF/IBGE.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Substituição de Alimentos", item: `${SITE_URL}${CAMINHO}` },
  ],
};

/* ── A base, no build ── */
const TODOS = alimentosEq();
const BASE = new Map(TODOS.map((a) => [a.slug, a]));
const INDEXAVEIS = alimentosIndexaveis().map((a) => a.slug);
const LINKAVEIS = new Set(INDEXAVEIS);
const A = (s: string) => BASE.get(s)!;

/** Uma troca específica, para os textos e o FAQ. Falha alto se a base mudar. */
function troca(origem: string, gramas: number, criterio: Criterio, destino: string) {
  const r = trocas(A(origem), gramas, criterio, BASE);
  const t = r.trocas.find((x) => x.alimento.slug === destino);
  if (!t) throw new Error(`Troca ${origem} → ${destino} (${criterio}) sumiu da base.`);
  return t;
}
const gm = (t: { gramas: number; medida: { texto: string } | null }) => `${t.gramas} g${t.medida ? ` (≈ ${t.medida.texto})` : ""}`;
const n0 = (v: number | null) => formataNumero(v ?? 0, "kcal");
const n1 = (v: number | null) => formataNumero(v ?? 0, "g");

const ARROZ = "arroz-tipo-1-cozido";
const FRANGO = "frango-peito-sem-pele-grelhado";
const OVO = "ovo-de-galinha-inteiro-cozido-10minutos";
const BATATA = troca(ARROZ, 100, "carboidrato", "batata-inglesa-cozida");
const BATATA_DOCE = troca(ARROZ, 100, "carboidrato", "batata-doce-cozida");
const PAO = troca(ARROZ, 100, "carboidrato", "pao-trigo-frances");
const PAO_FORMA = troca(ARROZ, 100, "carboidrato", "pao-trigo-forma-integral");
const CUSCUZ = troca(ARROZ, 100, "carboidrato", "cuscuz-de-milho-cozido-com-sal");
const MANDIOCA = troca(ARROZ, 100, "carboidrato", "mandioca-cozida");
const OVOS_100 = troca(FRANGO, 100, "proteina", OVO);
const OVOS_50 = troca(FRANGO, 50, "proteina", OVO);
const OVOS_150 = troca(FRANGO, 150, "proteina", OVO);
const ATUM_100 = troca(FRANGO, 100, "proteina", "atum-conserva-em-oleo");
const PATINHO_100 = troca(FRANGO, 100, "proteina", "carne-bovina-patinho-sem-gordura-grelhado");
const MAC_CRU = troca("arroz-tipo-1-cru", 50, "carboidrato", "macarrao-trigo-cru");
const ARROZ_100 = macrosDe(A(ARROZ), 100);
const ARROZ_150 = macrosDe(A(ARROZ), 150);
const ARROZ_CRU_100 = macrosDe(A("arroz-tipo-1-cru"), 100);
const COUVE_150 = macrosDe(A("couve-flor-cozida"), 150);
const FRANGO_100 = macrosDe(A(FRANGO), 100);
const CUSCUZ_KCAL = troca(ARROZ, 150, "carboidrato", "cuscuz-de-milho-cozido-com-sal");

const faq: ItemFAQ[] = [
  {
    question: "Quanto de batata substitui 100 g de arroz?",
    answer: `Mantendo o carboidrato, 100 g de arroz branco cozido equivalem a cerca de ${gm(BATATA)} de batata inglesa cozida, ou ${gm(BATATA_DOCE)} de batata-doce cozida. A batata inglesa tem menos carboidrato por grama, por isso a porção fica maior.`,
  },
  {
    question: "Quantas fatias de pão equivalem a 100 g de arroz?",
    answer: `Em carboidrato, 100 g de arroz branco cozido equivalem a cerca de ${PAO_FORMA.gramas} g de pão de forma integral. O peso da fatia muda de marca para marca: confira no rótulo quantos gramas tem a sua e divida. Em pão francês, são cerca de ${gm(PAO)}. O pão francês tem cerca de ${n0(PAO.macros.energia)} kcal nessa quantidade, contra ${n0(ARROZ_100.energia)} kcal do arroz, e um pouco mais de proteína e de gordura.`,
  },
  {
    question: "Quantos ovos substituem 100 g de frango?",
    answer: `Mantendo a proteína, 100 g de peito de frango grelhado equivalem a cerca de ${gm(OVOS_100)} de ovo cozido. Para 50 g de frango, ${gm(OVOS_50)}; para 150 g, ${gm(OVOS_150)}. A proteína fica igual, mas os ovos trazem mais gordura e mais calorias nessa quantidade.`,
  },
  {
    question: "Posso substituir o frango por atum ou carne?",
    answer: `Pode. Em proteína, 100 g de peito de frango grelhado equivalem a cerca de ${gm(ATUM_100)} de atum em óleo ou ${gm(PATINHO_100)} de patinho grelhado. Na calculadora acima você escolhe o corte e vê a diferença de gordura.`,
  },
  {
    question: "Posso substituir arroz por batata-doce?",
    answer: `Pode. Para manter o carboidrato de 100 g de arroz branco cozido, use cerca de ${gm(BATATA_DOCE)} de batata-doce cozida. Também funcionam mandioca (${MANDIOCA.gramas} g), cuscuz de milho (${CUSCUZ.gramas} g) e batata inglesa (${BATATA.gramas} g).`,
  },
  {
    question: "Substituir arroz por cuscuz emagrece?",
    answer: `Não por si só. Na quantidade que mantém o carboidrato, as calorias ficam praticamente iguais: 150 g de arroz cozido têm cerca de ${n0(ARROZ_150.energia)} kcal, e ${CUSCUZ_KCAL.gramas} g de cuscuz, cerca de ${n0(CUSCUZ_KCAL.macros.energia)} kcal. Trocar um pelo outro muda o gosto do prato, não o saldo do dia.`,
  },
  {
    question: "Trocar arroz por couve-flor emagrece?",
    answer: `Trocar peso por peso reduz bastante as calorias: 150 g de arroz cozido têm cerca de ${n0(ARROZ_150.energia)} kcal, e 150 g de couve-flor cozida, cerca de ${n0(COUVE_150.energia)} kcal. Mas não é uma troca equivalente: a couve-flor tem pouco carboidrato, e o prato fica com menos energia. É uma escolha para reduzir calorias, não uma substituição.`,
  },
  {
    question: "Posso substituir o arroz por quinoa?",
    answer: "Pode, mas esta calculadora ainda não faz essa conta: a quinoa não está na TACO, a tabela brasileira que usamos, e aqui não entra número sem fonte.",
  },
  {
    question: "O que é uma lista de substituição de alimentos?",
    answer: "É uma tabela que mostra quanto de cada alimento equivale a uma porção de outro do mesmo grupo, mantendo um nutriente parecido: carboidrato no grupo do arroz, proteína no grupo das carnes. Serve para variar o cardápio sem mudar muito o que a refeição entrega.",
  },
  {
    question: "Posso trocar alimentos só pelas mesmas calorias?",
    answer: "Pode, mas dentro do mesmo grupo. Trocar arroz por chocolate com as mesmas calorias fecha a conta e muda totalmente a refeição. Por isso a calculadora só sugere trocas do mesmo grupo e avisa quando proteína, gordura ou carboidrato ficam diferentes.",
  },
  {
    question: "Preciso pesar o alimento cru ou cozido?",
    answer: `Tanto faz, desde que a conta use o mesmo estado. 100 g de arroz cru têm cerca de ${n0(ARROZ_CRU_100.energia)} kcal; 100 g de arroz cozido, cerca de ${n0(ARROZ_100.energia)} kcal, porque cerca de dois terços do arroz cozido é água. Na calculadora, escolha o alimento no estado em que você pesa: cru com cru, cozido com cozido.`,
  },
  {
    question: "Quanto de macarrão substitui o arroz?",
    answer: `A TACO traz o macarrão cru, então a conta é feita com os dois crus: 50 g de arroz cru equivalem a cerca de ${MAC_CRU.gramas} g de macarrão cru em carboidrato. Pese antes de cozinhar.`,
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const th = "text-left text-gray-400 font-medium py-2.5 pr-4";
const td = "text-gray-300 py-2.5 pr-4 tabular-nums";

/** Uma tabela da lista pronta: a referência do grupo e os equivalentes, todos "prontos para comer". */
function TabelaGrupo({ r }: { r: (typeof REFERENCIAS)[number] }) {
  const origem: AlimentoEq = A(r.slug);
  const criterio = GRUPOS[r.grupo].criterioPadrao;
  const res = trocas(origem, r.gramas, criterio, BASE);
  const alvo = res.alvo ?? 0;
  const nc = nomeCriterio(criterio);
  return (
    <div className="mb-10 break-inside-avoid">
      <h3 className="text-xl font-bold text-white mb-1" style={h}>{GRUPOS[r.grupo].nome}</h3>
      <p className="text-gray-400 text-sm mb-3">
        Equivalentes a {r.rotulo}, mantendo {nc.curto} (cerca de {criterio === "energia" ? `${n0(alvo)} kcal` : `${n1(alvo)} g`}).
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <caption className="sr-only">Lista de substituição: {GRUPOS[r.grupo].nome}</caption>
          <thead>
            <tr className="border-b border-white/20">
              <th scope="col" className={th}>Alimento</th>
              <th scope="col" className={th}>Quantidade</th>
              <th scope="col" className={th}>Medida caseira</th>
              <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Calorias</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/10">
              <td className="text-white py-2.5 pr-4 font-medium">{nomeExibicao(origem)}</td>
              <td className="text-white py-2.5 pr-4 font-medium tabular-nums">{r.gramas} g</td>
              <td className={td}>referência</td>
              <td className="text-gray-300 py-2.5 tabular-nums">{n0(macrosDe(origem, r.gramas).energia)} kcal</td>
            </tr>
            {res.trocas.map((t) => (
              <tr key={t.alimento.slug} className="border-b border-white/10">
                <td className={td}>
                  {LINKAVEIS.has(t.alimento.slug) ? (
                    <Link href={`/alimentos/${t.alimento.slug}`} className={ln}>{nomeExibicao(t.alimento)}</Link>
                  ) : (
                    nomeExibicao(t.alimento)
                  )}
                </td>
                <td className="text-white py-2.5 pr-4 tabular-nums">{t.gramas} g</td>
                <td className={td}>{t.medida ? `≈ ${t.medida.texto}` : "—"}</td>
                <td className="text-gray-300 py-2.5 tabular-nums">{n0(t.macros.energia)} kcal</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Imprimir só a lista. display:none (e não visibility) para não sobrar
 * página em branco; :has() mantém visível só o caminho até a lista; e as
 * tabelas perdem o overflow para não sair cortadas no papel.
 */
const PRINT_CSS = `@media print {
  body *:not(:has(#lista-substituicao)):not(#lista-substituicao):not(#lista-substituicao *) { display: none !important; }
  body, body * { background: #fff !important; color: #000 !important; border-color: #ccc !important; }
  #lista-substituicao .overflow-x-auto { overflow: visible !important; }
  #lista-substituicao table { page-break-inside: auto; }
  #lista-substituicao tr { page-break-inside: avoid; }
}`;

export default function SubstituicaoDeAlimentosPage() {
  const membrosProntos = MEMBROS.filter((m) => m.estado === "pronto").length;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      <section className="py-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Troca Certa · grátis · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>
            Calculadora de Substituição de Alimentos
          </h1>
          <Compartilhar contexto="tool" titulo="Troca Certa: Calculadora de Substituição de Alimentos" caminho={CAMINHO} local="tool_top" ferramenta="substituicao-alimentos" aparencia="discreto" className="mb-4" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Você diz o que vai sair do prato. A calculadora diz quanto colocar no lugar, mantendo carboidratos, proteína ou calorias.
          </p>
        </div>
      </section>

      <section className="py-8 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrocaCerta alimentos={TODOS} indexaveis={INDEXAVEIS} />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como a troca é calculada</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A conta é uma regra de três sobre a tabela: quanto do nutriente escolhido existe no alimento que sai, e quantos gramas do
              outro alimento entregam a mesma quantidade. Exemplo: 100 g de arroz branco cozido têm cerca de {n1(ARROZ_100.carboidrato)} g
              de carboidrato; a batata-doce cozida chega lá com cerca de <strong className="text-white">{gm(BATATA_DOCE)}</strong>.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Três cuidados separam uma troca útil de uma conta qualquer: <strong className="text-white">o mesmo grupo</strong> (arroz troca
              com batata, não com chocolate), <strong className="text-white">o mesmo estado</strong> (cru com cru, cozido com cozido) e{" "}
              <strong className="text-white">quantidades que alguém come</strong>. As gramas saem arredondadas (ao grama nas porções pequenas, de 5 em 5 ou
              de 10 em 10 nas maiores), e o nutriente igualado é recalculado com a quantidade já arredondada.
            </p>
          </div>

          <div id="lista-substituicao">
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Lista de substituição de alimentos por grupo</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              A lista pronta, calculada pela TACO, com medidas caseiras da POF/IBGE quando existem. Cada grupo parte de uma porção de
              referência e mantém o nutriente principal do grupo. Todos os alimentos estão no estado em que são comidos.
            </p>
            <div className="mb-8"><BotaoImprimirLista /></div>
            {REFERENCIAS.map((r) => <TabelaGrupo key={r.grupo} r={r} />)}
            <p className="text-gray-500 text-xs leading-relaxed">
              {AVISO_GERAL} Composição: {FONTES.TACO.atribuicao}. Medidas caseiras: {FONTES.IBGE_POF.atribuicao}. Troca Certa — montinhopersonal.com.br{CAMINHO}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Peso cru e cozido não são iguais</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              100 g de arroz cru têm cerca de {n0(ARROZ_CRU_100.energia)} kcal; 100 g de arroz cozido, cerca de {n0(ARROZ_100.energia)} kcal.
              Não é outro alimento: é a água que o arroz absorve. O mesmo vale para carnes, que perdem água no fogo e ficam mais concentradas.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Por isso a calculadora só troca alimentos no mesmo estado. Se você pesa o arroz cru, escolha &ldquo;Arroz, tipo 1, cru&rdquo; e
              as trocas virão cruas também, como o macarrão cru.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Trocar pelas mesmas calorias é suficiente?</h2>
            <p className="text-gray-300 leading-relaxed">
              Nem sempre. Dois alimentos com as mesmas calorias podem ter composição bem diferente. 100 g de peito de frango grelhado têm
              cerca de {n1(FRANGO_100.proteina)} g de proteína e {n0(FRANGO_100.energia)} kcal; trocar pelas mesmas calorias de ovo dá menos
              proteína e mais gordura. Na hora de trocar, escolha o nutriente que importa para aquela refeição, e a calculadora avisa o que
              muda no resto.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>De onde vêm os números</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Composição dos alimentos: {FONTES.TACO.atribuicao}. Medidas caseiras: {FONTES.IBGE_POF.atribuicao}. As trocas sugeridas
              saem de uma lista de {membrosProntos} alimentos prontos para comer, revisada por grupo, mais os equivalentes crus; o
              alimento de origem pode ser qualquer um da base.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Para ver todos os nutrientes de um alimento, use a <Link href="/alimentos" className={ln}>tabela nutricional</Link>; para
              colocar dois lado a lado em quantidades livres, o <Link href="/alimentos/comparar" className={ln}>comparador de alimentos</Link>.
              As equivalências não substituem orientação de nutricionista em casos clínicos, como diabetes, doença renal ou alergias.
            </p>
            <p className="text-gray-300 leading-relaxed mt-3">
              Para ir além da troca: <Link href="/blog/proteina-em-alimentos-tabela-completa" className={ln}>tabela de proteína nos alimentos</Link>,{" "}
              <Link href="/blog/batata-doce-emagrece" className={ln}>batata-doce emagrece?</Link>,{" "}
              <Link href="/blog/quantos-ovos-por-dia" className={ln}>quantos ovos comer por dia</Link> e{" "}
              <Link href="/blog/deficit-calorico-como-calcular" className={ln}>como calcular o déficit calórico</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-substituicao-alimentos" />
          </div>
        </div>
      </section>
    </>
  );
}
