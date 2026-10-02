import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Beliscometro from "@/components/beliscometro/Beliscometro";

/**
 * Beliscômetro. "Beliscar engorda" é a intenção do artigo /blog/beliscar-engorda
 * (resposta); esta página mira quem quer CALCULAR — "calorias dos beliscos",
 * "quanto eu como sem perceber" — e carrega o capítulo 2, "O que a balança não
 * conta", para "engordei 2 kg no fim de semana" (prints de 02/10/2026).
 */
const CAMINHO = "/ferramentas/beliscometro";

export const metadata: Metadata = {
  title: { absolute: "Beliscômetro: Calcule as Calorias dos Seus Beliscos do Dia" },
  description:
    "Chocolate aqui, amendoim ali: descubra quanto seus beliscos somam no dia e na semana, seu perfil de belisco e o que a balança não conta. Grátis, em 2 minutos.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Beliscômetro — descubra quanto você come sem perceber",
    description: "Você esquece. O corpo soma. Monte o prato que você nunca montou e veja quanto seus beliscos representam no seu dia.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Beliscômetro",
  descricao: "Estima as calorias dos pequenos consumos ao longo do dia (beliscos), mostra o perfil de belisco e simula ajustes, com valores da Tabela TACO. Inclui o módulo “O que a balança não conta”.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Beliscômetro", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const faq: ItemFAQ[] = [
  { question: "Beliscar engorda?", answer: "Beliscar não é um problema por si só. O que pesa é o total do dia: pequenos consumos que não entram na conta mental de quem está comendo podem somar bastante ao longo do dia e da semana. Por isso o Beliscômetro soma os episódios — para você ver o conjunto, não para proibir nenhum alimento." },
  { question: "O que fazer para não ficar beliscando toda hora?", answer: "Algumas estratégias costumam ajudar sem exigir cortar nada: servir uma porção no prato em vez de comer do pacote, tirar a comida da vista, dar um horário para o lanche e comer sem tela quando der. Refeições com proteína e fibras também costumam deixar menos espaço para o belisco por fome." },
  { question: "Por que o corpo da gente fica beliscando?", answer: "Muitas vezes não é fome: é hábito, comida à vista, tédio, cansaço ou a atenção presa em outra coisa (tela, trabalho, volante). O perfil de belisco do resultado ajuda a enxergar qual desses padrões aparece mais na sua rotina." },
  { question: "Beliscar enquanto cozinha ou terminar a comida dos filhos conta?", answer: "Conta como qualquer outra comida — e é justamente o tipo de consumo que a gente mais esquece. Por isso o Beliscômetro tem a categoria “beliscos que não parecem beliscos”." },
  { question: "Comer à noite engorda?", answer: "O horário em si não decide o resultado; o total do dia, sim. O que acontece é que a noite costuma juntar cansaço, tela e comida disponível, e os beliscos se acumulam. Se o seu perfil sair “belisco noturno”, planejar o que vai comer à noite costuma ser o melhor ponto de partida." },
  { question: "Amendoim, chocolate ou pão de queijo engordam?", answer: "Nenhum alimento sozinho engorda ou emagrece. Amendoim e chocolate são densos em energia — pouca quantidade tem bastante caloria —, por isso a quantidade e a frequência fazem diferença. No Beliscômetro, a porção é perguntada em medidas caseiras e o resultado mostra quanto cada um pesa no seu dia." },
  { question: "Por que como pouco e não emagreço?", answer: "Pode haver várias razões, e não dá para cravar uma sem avaliar o caso. Uma das mais comuns é a diferença entre o que percebemos que comemos e o que comemos de fato: beliscos, bebidas e porções “só para provar” costumam sair da conta. Fora isso, rotina, sono, treino, medicamentos e condições de saúde também entram — e aí vale avaliação profissional." },
  { question: "É possível engordar 2 kg em uma semana ou em um fim de semana?", answer: "A balança pode subir 1, 2 ou 3 kg rápido, mas uma subida rápida dificilmente é toda gordura. Para referência educativa, 1 kg de gordura corresponde a cerca de 7.700 kcal de superávit — 2 kg, cerca de 15.400 kcal acima do que o corpo gastou. Água, sódio, glicogênio, volume de comida e intestino costumam explicar boa parte da variação. O capítulo “O que a balança não conta” faz essa conta com o seu gasto estimado." },
  { question: "É normal ganhar peso no fim de semana?", answer: "É comum a balança subir depois de um fim de semana diferente: mais sal, mais carboidrato, álcool, mais volume de comida e outra rotina de sono mexem no peso. Voltar à rotina normalmente costuma ser mais útil do que compensar com restrições na segunda-feira." },
  { question: "Como saber quantas calorias como durante o dia?", answer: "A forma mais simples é anotar tudo por alguns dias — inclusive os beliscos — e somar com uma tabela como a TACO. O Beliscômetro foca na parte que costuma ficar de fora dessa conta. Para o seu gasto diário, use a calculadora de TMB e gasto calórico." },
  { question: "É melhor fazer várias refeições pequenas?", answer: "Não existe um número ideal de refeições para todo mundo. Para algumas pessoas, refeições maiores e mais espaçadas evitam o belisco; para outras, um lanche planejado evita chegar com muita fome à próxima refeição. O que funciona é o que você consegue manter." },
  { question: "Os valores do Beliscômetro são exatos?", answer: "Não. São estimativas: as calorias vêm da Tabela TACO (e, quando o alimento não existe nela, de referências como a USDA), e as porções caseiras são convertidas em gramas aproximados. Marca, receita e tamanho real mudam o número. O Beliscômetro é educativo e não substitui orientação de nutricionista ou profissional de saúde." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "text-white underline underline-offset-4";

export default function BeliscometroPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="pt-28 pb-10 sm:pt-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: "#BA9E50" }}>Você esquece. O corpo soma.</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-3" style={h}>Beliscômetro: descubra quanto você come sem perceber</h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">Pequenos episódios, isoladamente, parecem irrelevantes. Juntos, revelam um padrão.</p>
          <Beliscometro />
        </div>
      </section>

      <section className="py-14 border-t border-white/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-5 text-gray-300 leading-relaxed">
          <h2 className="text-2xl sm:text-3xl font-bold text-white" style={h}>O que é o Beliscômetro?</h2>
          <p>É uma ferramenta que reúne os pequenos consumos do dia — o pão de queijo do escritório, o punhado de amendoim, a batata do prato de alguém — e mostra quanto eles somam juntos. Você responde em medidas do dia a dia (“1 punhado”, “2 quadradinhos”), e as calorias vêm da Tabela TACO.</p>

          <h2 className="text-2xl sm:text-3xl font-bold text-white pt-4" style={h}>Por que é tão fácil esquecer os pequenos alimentos?</h2>
          <p>Porque quase nunca são uma “refeição”. Acontecem em pé, de passagem, com a atenção em outra coisa — e o que a gente não registra, a gente não lembra. Os mais fáceis de subestimar são os densos em energia e pequenos no volume: amendoim, castanhas, chocolate, queijo, biscoito, além de bebidas como cerveja, refrigerante e café adoçado.</p>

          <h2 className="text-2xl sm:text-3xl font-bold text-white pt-4" style={h}>Beliscar é sempre ruim?</h2>
          <p>Não. Um lanche planejado pode ajudar a chegar com menos fome à próxima refeição, e comer algo que você gosta faz parte de uma rotina sustentável. A diferença está em <em>perceber</em>: quantidade, frequência e se aquilo combina com o seu objetivo. Mais sobre isso em <Link href="/blog/beliscar-engorda" className={ln}>beliscar engorda?</Link>.</p>

          <h2 className="text-2xl sm:text-3xl font-bold text-white pt-4" style={h}>Preciso cortar tudo para emagrecer?</h2>
          <p>Raramente. Diminuir a porção, dar um horário para o belisco ou servir num prato em vez de comer do pacote costumam mudar o total sem proibir nada — o simulador “E se?” do resultado mostra isso. Para entender quanto você gasta por dia, use a <Link href="/ferramentas/calculadora-tmb-tdee" className={ln}>calculadora de TMB e gasto calórico</Link>; para montar uma meta, a <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>calculadora de déficit calórico</Link> e a <Link href="/ferramentas/calculadora-macros" className={ln}>calculadora de macros</Link>. E se o que pesa é a fome entre as refeições, a <Link href="/ferramentas/calculadora-de-proteina" className={ln}>calculadora de proteína</Link> ajuda.</p>
          <p>Quando a vontade é de algo específico, o <Link href="/ferramentas/mata-a-vontade" className={ln}>Montinho Mata a Vontade</Link> sugere uma versão que cabe na rotina. E se a sensação é de comer por ansiedade, leia sobre <Link href="/blog/fome-emocional-como-controlar" className={ln}>fome emocional</Link> e <Link href="/blog/por-que-voce-nao-consegue-emagrecer" className={ln}>por que você não consegue emagrecer</Link>.</p>
        </div>
      </section>

      <section className="py-14 border-t border-white/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6" style={h}>Perguntas frequentes</h2>
          <FAQ itens={faq} placement="beliscometro" />
        </div>
      </section>
    </>
  );
}
