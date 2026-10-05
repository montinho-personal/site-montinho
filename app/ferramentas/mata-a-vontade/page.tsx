import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import MataVontade from "@/components/mata-vontade/MataVontade";

/**
 * Montinho Mata a Vontade. A busca "vontade de doce" é dominada por quem quer
 * a CAUSA (falta de vitamina, TPM, gravidez) — essa é a intenção do artigo
 * /blog/vontade-de-doce. Esta página mira o "o que eu faço agora": vontade de
 * doce na dieta e o que é bom para tirar a vontade de comer doce (prints de
 * 02/10/2026). Receitas, não orientação nutricional.
 */
const CAMINHO = "/ferramentas/mata-a-vontade";

export const metadata: Metadata = {
  title: { absolute: "Vontade de Doce na Dieta? O Que Comer Agora | Mata a Vontade" },
  description:
    "Diga o doce que quer, o que tem em casa e o que priorizar. Em 20 segundos, a receita que mais combina: bolo de caneca, brownie, brigadeiro, sorvete e mais.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Tá com vontade de quê? | Montinho Mata a Vontade",
    description: "Me conta o que você quer comer. Eu encontro a versão que mata essa vontade com o que você tem em casa.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Montinho Mata a Vontade",
  descricao: "Entende a vontade de doce (sabor, textura, temperatura), o que a pessoa tem em casa e o que quer priorizar, e indica a receita que mais se parece com o que ela quer comer.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Mata a Vontade", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const faq: ItemFAQ[] = [
  { question: "O que é bom para tirar a vontade de comer doce?", answer: "Nem sempre a ideia é tirar a vontade: muitas vezes funciona melhor atendê-la de um jeito que caiba no seu dia. Um doce com mais volume, mais proteína ou numa porção definida costuma satisfazer sem virar um pacote inteiro. É isso que a ferramenta faz: entende o que você quer (chocolate, cremoso, gelado, crocante) e mostra a receita mais parecida." },
  { question: "Por que estou com tanta vontade de comer doce?", answer: "As causas mais comuns são as do dia a dia: dormir pouco, passar muitas horas sem comer, comer pouca proteína, estresse e o hábito de fechar a refeição com doce. A vontade à noite e depois do almoço costuma vir daí. Se a vontade veio junto com sede excessiva, cansaço fora do normal ou perda de peso sem explicação, procure um médico." },
  { question: "Existe remédio, chá ou suplemento que tira a vontade de doce?", answer: "Não há chá, fitoterápico, picolinato de cromo ou suplemento com evidência sólida de tirar a vontade de doce de forma consistente. Remédio é decisão médica. O que funciona melhor na prática é ajustar o dia: refeições com proteína, sono e uma versão de doce que caiba, que é o que esta ferramenta sugere." },
  { question: "O que fazer na hora da vontade de doce?", answer: "Beber água, esperar uns minutos e ver se a vontade passa ajuda algumas pessoas. Se não passar, comer uma porção planejada é melhor que resistir até atacar o pote. Fruta, iogurte com cacau ou uma das receitas daqui resolvem sem fugir do plano." },
  { question: "Pode comer doce na dieta?", answer: "Pode. O que pesa no resultado é o conjunto do dia e da semana, não um doce isolado. Quando a vontade aparece, ter uma opção que você gosta e que cabe na rotina costuma ser mais sustentável do que proibir e depois exagerar." },
  { question: "Quem está de dieta pode comer brigadeiro ou brownie?", answer: "Pode, e às vezes o melhor é o próprio original numa porção que cabe — por isso a ferramenta também mostra a opção “original na medida”. Quando a vontade é mais de chocolate do que de brigadeiro em si, uma versão com cacau, whey ou iogurte pode matar a vontade com mais volume." },
  { question: "Vontade de comer doce é falta de quê? É falta de vitamina?", answer: "Não há base para dizer que a vontade de doce aponta para a falta de uma vitamina ou mineral específico. Sono ruim, cansaço, refeições pobres e o próprio hábito costumam pesar mais. Se a vontade é muito intensa, constante ou vem com outros sintomas, vale conversar com um médico. Escrevi mais sobre isso no artigo sobre vontade de doce." },
  { question: "Qual o doce mais proteico?", answer: "Entre as receitas da ferramenta, as que levam whey, iogurte grego, cottage ou ovo — como a mousse de iogurte grego, o brigadeiro de colher proteico e o bolo de caneca vulcão. Escolha “mais proteína” no último passo e ela aparece no terceiro cartão." },
  { question: "Dá para fazer bolo de caneca com whey?", answer: "Dá, desde que o whey não substitua toda a farinha: whey demais deixa o bolo seco e borrachudo. A regra que a ferramenta segue é usar o whey junto com aveia ou farinha e sempre com algo úmido (banana, iogurte, leite ou ovo), e no micro-ondas por pouco tempo, de 60 a 90 segundos." },
  { question: "As receitas já foram testadas?", answer: "Ainda não todas. Elas estão marcadas como “receita em teste”: são proporções de partida, montadas com regras de cozinha, que vão sendo ajustadas. Se fizer uma, responda “matou a vontade?” no fim da receita — é isso que ajusta a versão para todo mundo." },
  { question: "A ferramenta substitui um nutricionista?", answer: "Não. São ideias de receitas para a vontade do momento, não um plano alimentar. Para dieta, restrições médicas, gestação ou qualquer condição de saúde, o acompanhamento é com nutricionista ou médico." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

export default function MataVontadePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="pt-28 pb-10 sm:pt-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: "#BA9E50" }}>Montinho Mata a Vontade · grátis</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4" style={h}>Tá com vontade de quê?</h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">Me conta o que você quer comer. Eu encontro a versão que mata essa vontade com o que você tem em casa. Você não precisa fingir que banana é brownie.</p>
          <MataVontade />
        </div>
      </section>

      <section className="py-14 border-t border-white/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-5 text-gray-300 leading-relaxed">
          <h2 className="text-2xl sm:text-3xl font-bold text-white" style={h}>Como a ferramenta escolhe a receita</h2>
          <p>Primeiro ela entende a vontade: quanto de chocolate, se é cremoso ou crocante, fofinho ou denso, quente ou gelado. Cada receita tem esse mesmo perfil, e o <strong className="text-white">match</strong> mostra o quanto ela se parece com o que você pediu. O número não diz se a receita é “boa” ou “ruim”: diz se ela mata a sua vontade.</p>
          <p>Depois entram o tempo que você tem, o que tem em casa e o que você quer priorizar. Uma mousse pode ter o sabor de um bolo de chocolate, mas não a experiência de comer bolo — e a ferramenta leva isso em conta. Quando a vontade é de um produto específico, como Nutella ou paçoca, ela mostra o próprio original numa porção que cabe, em vez de fingir que outra coisa é igual.</p>
          <p>Quer entender por que a vontade de doce aparece? Leia <Link href="/blog/vontade-de-doce" className="text-white underline underline-offset-4">vontade de doce: o que pode ser e o que fazer</Link>. Para a proteína do dia, use a <Link href="/ferramentas/calculadora-de-proteina" className="text-white underline underline-offset-4">calculadora de proteína</Link> e a <Link href="/ferramentas/calculadora-whey" className="text-white underline underline-offset-4">calculadora de whey</Link>.</p>
        </div>
      </section>

      <section className="py-14 border-t border-white/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6" style={h}>Perguntas frequentes</h2>
          <FAQ itens={faq} placement="mata-a-vontade" />
        </div>
      </section>
    </>
  );
}
