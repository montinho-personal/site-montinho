import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraWhey from "@/components/whey/CalculadoraWhey";
import {
  AVISO_SEGURANCA,
  FONTES_WHEY,
  PESOS_TABELA,
  QTDS_TABELA,
  ROTULOS_EXEMPLO,
  ROTULO_PADRAO,
  dose,
  duracao,
  falta,
  meta,
  proteinaEm,
} from "@/lib/whey";

/**
 * A página da Calculadora de Whey.
 *
 * Uma URL só. Nada de /whey-para-80kg: as tabelas respondem as buscas de
 * cauda longa sem criar páginas finas. Todo número da página sai de
 * lib/whey.ts, o mesmo motor da ferramenta, e todo exemplo declara o
 * rótulo que usou — whey nenhum tem "a" concentração.
 */

const CAMINHO = "/ferramentas/calculadora-whey";

export const metadata: Metadata = {
  title: "Quanto Whey Tomar por Dia? Calculadora por Peso e Objetivo",
  description:
    "Quanto whey tomar por dia a partir da sua meta de proteína e do que você já come, com o rótulo do seu whey. Veja também a duração do pacote e o custo.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Whey | Montinho Personal Trainer",
    description: "Sua meta de proteína, o que você já come e quanto do seu whey completa o resto — com duração do pacote e custo por proteína.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Whey",
  descricao:
    "Estima a meta diária de proteína pelo peso, objetivo e prática de musculação, subtrai o que a pessoa já come e calcula quanto do whey dela, pelo rótulo, completa a diferença — com porções, duração do pacote, custo por 25 g de proteína e comparação entre produtos.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Whey", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const g = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const g2 = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
const { porcaoG: P, proteinaG: Q } = ROTULO_PADRAO;
const ROTULO_TXT = `um whey com ${Q} g de proteína em ${P} g`;
const M80 = meta(80, "ganhar", true);
const M70 = meta(70, "ganhar", true);
const F80 = falta(M80.refG, 125);
const D80 = dose(F80.faltaG, P, Q);
/** Quanto de pó para 30 g de proteína. */
const PARA30 = dose(30, P, Q);
/** Exemplo declarado para a tabela por peso: a comida já fornece 100 g. */
const COMIDA_EXEMPLO = 100;
const dur = (pacote: number, d: number) => duracao(pacote, d).diasCorridos;

const faq: ItemFAQ[] = [
  { question: "Quanto whey devo tomar por dia?", answer: `O suficiente para completar o que falta da sua meta de proteína — e nada, se a comida já chega nela. A conta é: meta de proteína menos o que você já come, dividido pela concentração do seu whey. Para 80 kg, treinando para ganhar massa, a meta estimada é ${M80.refG} g; se a comida já dá 125 g, faltam ${F80.faltaG} g, que com ${ROTULO_TXT} são cerca de ${D80.produtoG} g de pó.` },
  { question: "Quanto whey para 80 kg?", answer: `Depende do que você já come. A meta estimada de proteína para 80 kg, com musculação, fica entre ${M80.minG} e ${M80.maxG} g por dia (referência ${M80.refG} g). O whey entra na diferença entre essa meta e a alimentação.` },
  { question: "Quanto whey tomar para ganhar massa?", answer: "Primeiro vem a proteína total do dia — para quem treina, uma faixa de 1,6 a 2,2 g por kg de peso é a mais usada na literatura. O whey não tem dose própria de hipertrofia: ele só completa o que a comida não cobriu." },
  { question: "Quanto whey tomar para emagrecer?", answer: "Whey não é obrigatório para emagrecer e não queima gordura. No déficit calórico, proteína alta ajuda a preservar músculo e a controlar a fome; o whey é uma forma prática de chegar nela com poucas calorias, se a comida não chegar." },
  { question: "Quanto whey por kg?", answer: "Não existe uma dose de whey por kg com base científica. O que tem base é a proteína total por kg — de 1,4 a 2,2 g/kg para quem treina, conforme o objetivo. O whey é a diferença entre essa meta e o que você come." },
  { question: "Quantos scoops de whey tomar por dia?", answer: "Depende do tamanho do seu dosador e da concentração do seu whey — não existe scoop universal. Calcule em gramas de pó e, se quiser, divida pela gramatura da medida informada no rótulo." },
  { question: "Um scoop de whey tem quantas gramas?", answer: "A gramatura da medida vem no rótulo e varia por marca — é comum ficar entre 25 e 40 g, mas não é regra. Colher cheia ou rasa também muda o peso. A balança é o jeito mais preciso." },
  { question: "30 g de whey têm quanta proteína?", answer: `Depende do produto. Com ${ROTULO_TXT}, 30 g têm ${g(proteinaEm(30, P, Q))} g de proteína. Um whey com 18 g por porção de 30 g teria só 18 g. Olhe a tabela nutricional do seu.` },
  { question: "40 g de whey têm quanta proteína?", answer: `Com ${ROTULO_TXT}, 40 g têm ${g(proteinaEm(40, P, Q))} g de proteína. Com um whey de 27 g em 30 g, seriam ${g(proteinaEm(40, 30, 27))} g.` },
  { question: "50 g de whey têm quanta proteína?", answer: `Com ${ROTULO_TXT}, 50 g têm ${g(proteinaEm(50, P, Q))} g de proteína. A conta é: gramas de pó × proteína da porção ÷ porção.` },
  { question: "Quantos scoops para 30 g de proteína?", answer: `Com ${ROTULO_TXT}, são ${PARA30.produtoG} g de pó, ou ${g2(PARA30.porcoes)} porções do rótulo. Quantas medidas isso dá depende da gramatura do seu dosador.` },
  { question: "Quanto tempo dura um whey de 900 g?", answer: `Com 30 g por dia, ${dur(900, 30)} dias; com 40 g, ${dur(900, 40)} dias. Tomando só nos dias de treino, dura mais em dias corridos — a calculadora faz essa conta.` },
  { question: "Quanto tempo dura 1 kg de whey?", answer: `Com 30 g por dia, ${dur(1000, 30)} dias; com 40 g, ${dur(1000, 40)} dias; com 50 g, ${dur(1000, 50)} dias.` },
  { question: "Quantas gramas de whey para 70 kg?", answer: `Depende do que você já come. Para 70 kg, treinando para ganhar massa, a meta estimada de proteína fica entre ${M70.minG} e ${M70.maxG} g por dia (referência ${M70.refG} g). O whey entra só na diferença entre essa meta e a comida; se a alimentação já chega lá, ele é dispensável.` },
  { question: "Pode tomar mais de 30 g de whey por dia?", answer: "Pode, em adultos saudáveis, desde que a proteína total do dia continue dentro da meta. Não há um teto de whey em gramas: o limite prático é que ele não substitua comida e que as calorias caibam no dia." },
  { question: "Tomar whey duas vezes ao dia engorda?", answer: "Só se as calorias do dia passarem do gasto. Duas porções somam por volta de 200 a 260 kcal; se isso couber na meta calórica, não engorda, e pode até ajudar a controlar a fome no emagrecimento. Posso tomar 4 scoops? Pela mesma lógica: se a proteína total e as calorias fecham, sim, mas raramente é necessário." },
  { question: "Quanto whey tomar usando Mounjaro ou outro GLP-1?", answer: "Com remédios como Mounjaro e Ozempic o apetite cai, e fica mais difícil bater a proteína com comida, o que aumenta o risco de perder músculo junto com gordura. O whey pode ajudar a completar a meta, mas a quantidade deve ser combinada com o médico que acompanha o tratamento. A ferramenta de massa magra com GLP-1 explica o cuidado com o músculo." },
  { question: "Quem tem cálculo renal ou gastrite pode tomar whey?", answer: "São casos para decidir com o médico. Quem tem cálculo renal ou doença renal precisa de orientação sobre a proteína total do dia, venha ela da comida ou do whey. Na gastrite, alguns toleram melhor o isolado, com menos lactose e gordura, mas a resposta é individual." },
  { question: "Whey antes ou depois do treino?", answer: "Tanto faz na prática. A janela depois do treino é de horas, não de 30 minutos. O que pesa é a proteína total do dia e distribuí-la em algumas refeições; tomar depois do treino é só um horário cômodo." },
  { question: "Qual o melhor horário para tomar whey?", answer: "O horário em que ele completa uma refeição com pouca proteína. Café da manhã fraco em proteína, lanche da tarde ou depois do treino são escolhas comuns." },
  { question: "Pode tomar whey todos os dias?", answer: "Pode, em adultos saudáveis. Mas não precisa: a frequência depende de faltar proteína naquele dia. Nos dias em que a comida chega na meta, o whey é dispensável." },
  { question: "Whey engorda?", answer: "Whey tem calorias, como qualquer alimento — uma porção costuma ficar perto de 100 a 130 kcal. O que engorda é o total de calorias do dia acima do gasto. Dentro das calorias, ele ajuda a bater a proteína com poucas calorias." },
  { question: "Whey substitui refeição?", answer: "Não. Whey é proteína; uma refeição tem também carboidrato, gordura, fibra, vitaminas e minerais. Ele complementa a proteína de uma refeição, não troca o prato." },
  { question: "Whey faz mal aos rins?", answer: "Em pessoas com rins saudáveis, a evidência não mostra dano com ingestões de proteína usadas por quem treina. Quem tem doença renal precisa de orientação médica sobre proteína total — venha ela da comida ou do whey." },
  { question: "Quem tem intolerância à lactose pode tomar whey?", answer: "Muitas vezes, sim. O isolado costuma ter pouca lactose, e o concentrado, mais — mas a quantidade varia por produto, e só o rótulo diz. Intolerância à lactose é diferente de alergia à proteína do leite: com alergia, whey não é indicado." },
  { question: "O corpo só absorve 30 g de proteína por vez?", answer: "Não. O corpo absorve toda a proteína; o que se discutia era quanto vai para o músculo de uma vez. Um estudo de 2023 deu 100 g numa refeição e viu resposta maior e mais longa que com 25 g. Dividir em 3 a 5 refeições continua sendo prático, mas não é um limite de absorção." },
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
const tdF = "text-white py-2.5 pr-4 font-medium tabular-nums";
const cta = "text-gray-300 text-sm underline underline-offset-4 decoration-1 hover:text-white min-h-[44px] inline-flex items-center";

export default function CalculadoraWheyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>
            Calculadora de Whey: Quanto Tomar por Dia?
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Whey" caminho={CAMINHO} local="tool_top" ferramenta="whey" aparencia="discreto" className="mb-4" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Descubra quanto whey pode complementar sua meta de proteína diária com base na sua alimentação e no rótulo do seu produto.
          </p>
        </div>
      </section>

      <section className="py-8 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraWhey placement="calculadora-whey" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
            <p className="text-white text-lg font-semibold" style={h}>Whey não é a meta. Proteína é a meta.</p>
            <p className="text-gray-300 leading-relaxed mt-1">O whey é uma das formas de chegar lá — e só entra no que a comida não cobriu.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto whey tomar por dia?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">A quantidade que completa a sua meta de proteína — e zero, se a alimentação já chega nela.</strong> Não
              existe uma dose fixa de whey: existe uma meta de proteína por dia, e o whey cobre a diferença.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Exemplo: 80 kg, treinando para ganhar massa, meta estimada de {M80.refG} g. Se a comida já dá 125 g, faltam {F80.faltaG} g. Com{" "}
              {ROTULO_TXT}, isso é <strong className="text-white">cerca de {D80.produtoG} g de pó</strong> — {g2(D80.porcoes)} porções do rótulo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calcular quanto whey eu preciso?</h2>
            <ol className="text-gray-300 leading-relaxed space-y-2 list-decimal pl-5 mb-4">
              <li><strong className="text-white">Meta de proteína:</strong> peso × g/kg do seu objetivo (1,6 a 2,2 g/kg para quem treina).</li>
              <li><strong className="text-white">O que falta:</strong> meta − proteína que você já come.</li>
              <li><strong className="text-white">Concentração do seu whey:</strong> proteína da porção ÷ porção (24 ÷ 30 = 0,8).</li>
              <li><strong className="text-white">Gramas de whey:</strong> o que falta ÷ concentração ({F80.faltaG} ÷ 0,8 = {D80.produtoG} g).</li>
            </ol>
            <p className="text-gray-300 leading-relaxed">
              Se você não sabe quanto come, o botão <em>Não sei</em> da calculadora estima pela quantidade de ovos, carnes, feijão e outros
              alimentos de um dia comum.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto whey por kg?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">Não existe dose de whey por kg com base científica.</strong> O que os estudos definem é a proteína
              total por kg. Duas pessoas de 80 kg podem precisar de 0 g e de 60 g de whey, conforme o que comem. A tabela mostra a meta por peso
              para quem treina e quer ganhar massa — e, como exemplo declarado, o whey se a comida já fornecesse {COMIDA_EXEMPLO} g, com {ROTULO_TXT}.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Meta de proteína por peso e exemplo de whey para completar</caption>
                <thead><tr className="border-b border-white/20"><th scope="col" className={th}>Peso</th><th scope="col" className={th}>Faixa</th><th scope="col" className={th}>Referência</th><th scope="col" className="text-left text-gray-400 font-medium py-2.5">Whey se a comida dá {COMIDA_EXEMPLO} g</th></tr></thead>
                <tbody>
                  {PESOS_TABELA.map((p) => {
                    const m = meta(p, "ganhar", true);
                    const f = falta(m.refG, COMIDA_EXEMPLO);
                    return (
                      <tr key={p} className="border-b border-white/10">
                        <td className={td}>{p} kg</td>
                        <td className={td}>{m.minG}–{m.maxG} g</td>
                        <td className={tdF}>{m.refG} g/dia</td>
                        <td className="text-gray-300 py-2.5 tabular-nums">{f.atingida ? "não precisa" : `≈ ${dose(f.faltaG, P, Q).produtoG} g`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quantos scoops de whey por dia?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Depende do seu dosador — scoop não é unidade de medida.</strong> Cada marca usa uma medida com
              gramatura própria, e colher cheia ou rasa muda o peso. Calcule em gramas de pó e, se quiser, divida pela gramatura da medida
              informada no rótulo. A calculadora faz isso no item <em>Meu whey veio com dosador</em>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>30 g de whey têm quanta proteína?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">Entre 18 e 27 g na maioria dos produtos — depende da concentração.</strong> A conta é gramas de pó ×
              proteína da porção ÷ porção. A tabela usa quatro rótulos com porção de 30 g:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Proteína por quantidade de whey, para rótulos com porção de 30 g</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Whey</th>
                    {ROTULOS_EXEMPLO.map((r) => <th key={r} scope="col" className={th}>Rótulo {r} g/30 g</th>)}
                  </tr>
                </thead>
                <tbody>
                  {QTDS_TABELA.map((q) => (
                    <tr key={q} className="border-b border-white/10">
                      <td className={td}>{q} g</td>
                      {ROTULOS_EXEMPLO.map((r) => <td key={r} className={r === Q ? tdF : td}>{g(proteinaEm(q, 30, r))} g</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm mt-3">Para o seu produto, use o módulo <em>Quanta proteína tem na quantidade de whey que eu tomo?</em> da calculadora.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto whey tomar para ganhar massa?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">O que faltar para você chegar a 1,6 a 2,2 g de proteína por kg por dia.</strong> A meta-análise de
              Morton e colegas (2018), com 49 estudos, encontrou o benefício para massa muscular até cerca de 1,6 g/kg, com margem até 2,2. O
              objetivo de hipertrofia não cria uma dose própria de whey: quem já come bem pode não precisar de nenhum. Mais contexto em{" "}
              <Link href="/blog/quanta-proteina-por-dia-para-ganhar-massa-muscular" className={ln}>quanta proteína por dia para ganhar massa</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto whey tomar para emagrecer?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Whey não é obrigatório para emagrecer, e não é emagrecedor.</strong> No déficit calórico, proteína
              alta ajuda a preservar músculo e a controlar a fome — por isso a calculadora usa o topo da faixa para quem treina. O whey é uma
              forma prática de chegar nela com poucas calorias. Veja{" "}
              <Link href="/blog/como-manter-massa-muscular-emagrecendo" className={ln}>como manter massa muscular emagrecendo</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Whey antes ou depois do treino?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Tanto faz na prática.</strong> A “janela anabólica” de 30 minutos foi exagerada: a revisão de Aragon e
              Schoenfeld (2013) mostra que ela é de horas. O que pesa é a proteína total do dia e distribuí-la em 3 a 5 refeições. Tomar depois do
              treino é só um horário cômodo; se você comeu bem antes, não há pressa.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Pode tomar whey todos os dias?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Pode, em adultos saudáveis — mas não precisa.</strong> A frequência depende de faltar proteína. Nos
              dias em que a comida chega na meta, o whey é dispensável. Na calculadora, informe quantos dias por semana você usa para ver a
              duração e o custo reais.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto tempo dura um whey de 900 g?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">{dur(900, 30)} dias com 30 g por dia, {dur(900, 40)} dias com 40 g.</strong> Calcule com o seu consumo na
              calculadora acima — ela também conta os dias em que você não usa.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Duração do pacote de whey por tamanho e uso diário</caption>
                <thead><tr className="border-b border-white/20"><th scope="col" className={th}>Pacote</th><th scope="col" className={th}>30 g/dia</th><th scope="col" className={th}>40 g/dia</th><th scope="col" className="text-left text-gray-400 font-medium py-2.5">50 g/dia</th></tr></thead>
                <tbody>
                  {[450, 900, 1000, 1800].map((p) => (
                    <tr key={p} className="border-b border-white/10">
                      <td className={td}>{p >= 1000 ? `${g(p / 1000)} kg` : `${p} g`}</td>
                      <td className={tdF}>{dur(p, 30)} dias</td>
                      <td className={td}>{dur(p, 40)} dias</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">{dur(p, 50)} dias</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto tempo dura 1 kg de whey?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">{dur(1000, 30)} dias com 30 g por dia</strong>, {dur(1000, 40)} dias com 40 g e {dur(1000, 50)} dias com
              50 g. Usando só em 5 dias da semana, 1 kg a 30 g dura {duracao(1000, 30, 5).diasCorridos} dias corridos.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Whey engorda?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Só se as calorias do dia passarem do que você gasta — como qualquer alimento.</strong> Uma porção
              costuma ficar perto de 100 a 130 kcal, a maior parte vinda de proteína. Dentro das calorias, ele ajuda a bater a meta de proteína
              gastando pouco. O que costuma engordar é o shake com leite integral, fruta, aveia e pasta de amendoim. Detalhes em{" "}
              <Link href="/blog/whey-protein-engorda" className={ln}>whey protein engorda?</Link>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Whey substitui comida?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Não.</strong> Suplementar proteína é diferente de substituir uma refeição. Um prato tem carboidrato,
              gordura, fibra, vitaminas e minerais; o whey é proteína. Ele completa uma refeição fraca em proteína — não troca o almoço.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Whey concentrado ou isolado?</h2>
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5 mb-3">
              <li><strong className="text-white">Concentrado:</strong> menos processado, mais barato, com mais lactose e gordura; costuma ter 70 a 80% de proteína.</li>
              <li><strong className="text-white">Isolado:</strong> mais filtrado, mais proteína por grama e pouca lactose; custa mais.</li>
              <li><strong className="text-white">Hidrolisado:</strong> proteína pré-quebrada; custa bem mais, e a vantagem para quem treina é pequena.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              Nenhum é melhor para todo mundo: o que muda é tolerância à lactose e preço. <strong className="text-white">A calculadora funciona com
              qualquer um</strong>, porque usa o rótulo do seu produto — e o comparador mostra qual entrega a proteína mais barata. Comparação
              completa em <Link href="/blog/whey-concentrado-vs-isolado-vs-hidrolisado" className={ln}>concentrado, isolado ou hidrolisado</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O corpo só absorve 30 g de proteína?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Não.</strong> O corpo absorve toda a proteína que você come; a discussão era quanto vai para o músculo
              de uma vez. Schoenfeld e Aragon (2018) mostram que o limite de 20 a 25 g vale para proteína rápida isolada, e um estudo de 2023
              (Trommelen e colegas) deu 100 g numa refeição e viu resposta maior e mais longa que com 25 g. Dividir em algumas refeições é
              prático, não obrigatório.
            </p>
          </div>

          <div className="border border-white/15 p-5">
            <p className="text-white font-semibold mb-2">Quando conversar com um profissional antes</p>
            <p className="text-gray-300 text-sm leading-relaxed">{AVISO_SEGURANCA}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Quer descobrir quanto de proteína precisa no dia, com mais detalhe?</p>
              <Link href="/ferramentas/calculadora-de-proteina" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Calculadora de Proteína →</Link>
            </div>
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Usa creatina também?</p>
              <Link href="/ferramentas/calculadora-creatina" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Calculadora de Creatina →</Link>
            </div>
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Onde tem proteína na comida?</p>
              <Link href="/blog/alimentos-ricos-em-proteina" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Alimentos ricos em proteína →</Link>
            </div>
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Quer um treino montado para o seu objetivo?</p>
              <Link href="/consultoria-online" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Conhecer a consultoria →</Link>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes sobre whey</h2>
            <FAQ itens={faq} placement="ferramenta-whey" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Como calculamos</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Meta = peso × g/kg. Com musculação: 1,6 a 2,2 g/kg para ganhar massa (referência 2,0) e para emagrecer (referência 2,2); 1,4 a
              2,0 g/kg para manter (referência 1,6). Sem musculação: 1,2 a 1,6 g/kg para emagrecer (referência 1,2) e 0,8 g/kg nos outros
              objetivos. O que falta = meta − consumo. Gramas de whey = o que falta ÷ (proteína da porção ÷ porção). Custo por 25 g de proteína
              = (25 ÷ concentração) × preço por grama. A calculadora não pergunta idade, sexo ou altura porque eles não mudam essas faixas.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Última revisão científica: setembro de
              2026. Estimativa educativa para adultos saudáveis, não prescrição nutricional individual.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ol className="text-gray-400 text-sm leading-relaxed space-y-2 list-decimal pl-5">
              {FONTES_WHEY.map((f) => (
                <li key={f.url}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a>. <span className="text-gray-500">{f.resumo}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
