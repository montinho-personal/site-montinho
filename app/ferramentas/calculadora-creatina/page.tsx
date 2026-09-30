import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraCreatina from "@/components/creatina/CalculadoraCreatina";
import {
  AVISO_SEGURANCA,
  DIAS_ATE_SATURAR_SEM,
  FONTES_CREATINA,
  G_POR_KG_DOSE_ALTA,
  G_POR_KG_MANUTENCAO,
  G_POR_KG_MASSA_MAGRA,
  G_POR_KG_SATURACAO,
  MANUTENCAO_MAX,
  MANUTENCAO_MIN,
  PERFIS_PRATICA,
  PESOS_TABELA,
  POTES_TABELA,
  diasPorDose,
  pratica,
  referencia,
  saturacao,
} from "@/lib/creatina";

/**
 * A página da Calculadora de Creatina.
 *
 * Uma URL só. Nada de /creatina-para-80kg: a tabela por peso responde as
 * buscas de cauda longa sem criar dezenas de páginas finas.
 *
 * Os números da página saem de lib/creatina.ts — os mesmos da ferramenta —
 * para que texto e resultado nunca discordem.
 */

const CAMINHO = "/ferramentas/calculadora-creatina";

export const metadata: Metadata = {
  title: "Quanto de Creatina Tomar por Dia? Calculadora e Tabela por Peso",
  description:
    "Quanto de creatina tomar por dia pelo seu peso, com ou sem saturação — e quanto tempo o pote dura e quanto custa por dia. Baseada no consenso da ISSN.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Creatina | Montinho Personal Trainer",
    description: "Informe seu peso e veja quanto de creatina tomar por dia, com ou sem saturação, quanto o pote dura e quanto custa.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Creatina",
  descricao:
    "Calcula a referência diária de creatina pelo peso corporal segundo o consenso da International Society of Sports Nutrition, com saturação opcional, duração do pote, custo por dia e comparação de preço por grama.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Creatina", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const g = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const g2 = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const g3 = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 3 });
const R80 = referencia(80);
const R100 = referencia(100);
const R70 = referencia(70);
const S70 = saturacao(70);
const S80 = saturacao(80);

const faq: ItemFAQ[] = [
  { question: "Quanto de creatina tomar por dia?", answer: `De ${MANUTENCAO_MIN} a ${MANUTENCAO_MAX} g por dia, todos os dias. É a faixa do consenso da International Society of Sports Nutrition para adultos saudáveis. Pelo peso, a conta é de ${g2(G_POR_KG_MANUTENCAO)} g por kg — que dá ${MANUTENCAO_MIN} g para a maioria das pessoas.` },
  { question: "Quanto de creatina por kg?", answer: `Cerca de ${g2(G_POR_KG_MANUTENCAO)} g por kg por dia na manutenção, e cerca de ${g2(G_POR_KG_SATURACAO)} g por kg por dia durante a saturação, se você fizer. Fatores como 0,1 g/kg, usados por algumas calculadoras, não vêm do consenso para uso diário.` },
  { question: "Creatina é 3 g ou 5 g?", answer: `As duas funcionam. ${MANUTENCAO_MIN} g já enchem os estoques em cerca de 4 semanas; ${MANUTENCAO_MAX} g, a dose mais usada nos estudos, chegam lá um pouco antes. A diferença é de semanas, não de resultado final.` },
  { question: "Uma pessoa de 80 kg deve tomar quanto de creatina?", answer: `A referência é de ${g(R80.diaria)} g por dia (${g2(G_POR_KG_MANUTENCAO)} × 80 = ${g2(R80.calculada)} g, arredondado para a menor dose estudada). ${MANUTENCAO_MAX} g também servem. Com saturação, seriam cerca de ${g(S80.diaria)} g por dia por 5 a 7 dias.` },
  { question: "Uma pessoa de 100 kg deve tomar quanto de creatina?", answer: `A referência é de ${g(R100.diaria)} g por dia (${g2(G_POR_KG_MANUTENCAO)} × 100). Até ${MANUTENCAO_MAX} g continua dentro da faixa estudada.` },
  { question: "Uma pessoa de 70 kg deve tomar quanto de creatina?", answer: `A referência é de ${g(R70.diaria)} g por dia (${g2(G_POR_KG_MANUTENCAO)} × 70 = ${g2(R70.calculada)} g, arredondado para a menor dose estudada). A tabela por peso desta página mostra também 50, 60, 90, 120 e 150 kg.` },
  { question: "Posso tomar 10 g de creatina por dia?", answer: `Não há vantagem para uso diário: ${MANUTENCAO_MIN} a ${MANUTENCAO_MAX} g já mantêm o estoque cheio, e o excesso é eliminado. Doses maiores só fazem sentido na saturação, por poucos dias, divididas em porções.` },
  { question: "Posso tomar 20 g de creatina por dia?", answer: `Só na saturação: cerca de ${g2(G_POR_KG_SATURACAO)} g por kg por dia (uns 20 g para 70 kg), divididos em ${4} porções, por 5 a 7 dias. Depois disso, volta para ${MANUTENCAO_MIN} a ${MANUTENCAO_MAX} g. Não é uma dose para tomar sempre.` },
  { question: "Quantas colheres ou scoops de creatina devo tomar?", answer: "Colher e scoop não têm peso padrão: cada marca usa um dosador, e colher cheia ou rasa muda a quantidade. Veja no rótulo quantos gramas tem a medida do seu produto; dois scoops só fazem sentido se a medida for pequena e a soma ficar na dose diária. A balança de cozinha resolve a dúvida." },
  { question: "Quanto de creatina tomar para hipertrofia?", answer: `A mesma dose: ${MANUTENCAO_MIN} a ${MANUTENCAO_MAX} g por dia. A creatina ajuda a hipertrofia porque permite treinar com um pouco mais de carga e volume; dose maior não aumenta esse efeito.` },
  { question: "Mulher precisa de menos creatina que homem?", answer: `Pelo consenso, a faixa é a mesma: ${MANUTENCAO_MIN} a ${MANUTENCAO_MAX} g. Quem ajusta pela massa magra (${g3(G_POR_KG_MASSA_MAGRA)} g por kg de massa magra) chega a menos, porque a mulher costuma ter menos músculo para o mesmo peso — uma mulher de 60 kg com 28% de gordura fica perto de ${g(pratica(60, 28).porMassaMagra)} g. Não é o sexo que muda a dose, é quanto do peso é músculo.` },
  { question: "Precisa tomar creatina todos os dias?", answer: "Sim. A creatina funciona por acúmulo no músculo, não por efeito do dia — o que mantém os estoques cheios é a constância." },
  { question: "Precisa tomar creatina no dia que não treina?", answer: "Sim, na mesma dose. O estoque do músculo não depende do treino daquele dia, e parar nos dias de descanso faz ele baixar." },
  { question: "Creatina antes ou depois do treino?", answer: "Tanto faz na prática. Alguns estudos sugerem uma pequena vantagem perto do treino, mas o que decide é tomar todo dia. Escolha o horário que você não esquece." },
  { question: "Precisa fazer saturação de creatina?", answer: "Não. A saturação só enche os estoques mais rápido, em cerca de uma semana em vez de três a quatro. O resultado no fim é o mesmo." },
  { question: "Como fazer saturação de creatina?", answer: `Cerca de ${g2(G_POR_KG_SATURACAO)} g por kg por dia, divididos em quatro porções, por 5 a 7 dias — para 70 kg, uns ${g(S70.diaria)} g por dia, em porções de cerca de ${g(S70.porDose)} g. Depois, a dose de manutenção todos os dias.` },
  { question: "Quanto tempo dura 300 g de creatina?", answer: `${diasPorDose(300, 3)} dias tomando 3 g por dia, ou ${diasPorDose(300, 5)} dias com 5 g. Com saturação, dura menos, porque os primeiros dias usam mais.` },
  { question: "Quanto tempo dura 500 g de creatina?", answer: `Cerca de ${diasPorDose(500, 3)} dias com 3 g por dia, ou ${diasPorDose(500, 5)} dias com 5 g.` },
  { question: "Quanto tempo a creatina leva para fazer efeito?", answer: `Os estoques ficam cheios em cerca de 5 a 7 dias com saturação, ou em 3 a 4 semanas sem ela (${DIAS_ATE_SATURAR_SEM} dias com 3 g por dia no estudo clássico). O ganho de força aparece aos poucos, junto com o treino.` },
  { question: "Creatina engorda?", answer: "Não engorda no sentido de gordura. O peso na balança pode subir um pouco nas primeiras semanas porque o músculo guarda mais água junto com a creatina — isso é água dentro da célula, não gordura." },
  { question: "Creatina dá retenção de líquido?", answer: "Pode aumentar a água dentro do músculo, principalmente nas primeiras semanas e com saturação. Isso não é inchaço embaixo da pele: é o músculo mais hidratado." },
  { question: "Creatina faz mal para os rins?", answer: "Em adultos saudáveis, nas doses usuais, a evidência não mostra dano renal. A creatina pode elevar a creatinina no exame de sangue sem que o rim esteja pior — avise seu médico que usa. Com doença renal conhecida, só com orientação médica." },
  { question: "Posso tomar creatina para emagrecer?", answer: "Pode, mas ela não queima gordura. No emagrecimento, ela ajuda a manter a força no treino, e força mantida ajuda a preservar músculo. O peso da balança pode subir um pouco pela água no músculo." },
  { question: "Pode tomar creatina com café?", answer: "Pode. Os estudos que viram interferência usaram cafeína em dose alta durante a saturação. No uso diário comum, não há motivo para separar." },
  { question: "Qual o melhor horário para tomar creatina?", answer: "O que você lembra todo dia. Horário importa muito menos que constância." },
  { question: "Pode tomar creatina em jejum?", answer: "Pode. Tomar junto com uma refeição pode ajudar quem sente desconforto no estômago, mas não é obrigatório." },
  { question: "Preciso beber mais água tomando creatina?", answer: "Beba a água de sempre, no volume que você já deveria beber. A creatina não desidrata; na saturação, com doses maiores, vale dividir em porções e tomar com água." },
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

export default function CalculadoraCreatinaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>
            Calculadora de Creatina: Quanto Tomar por Dia?
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Creatina" caminho={CAMINHO} local="tool_top" ferramenta="creatina" aparencia="discreto" className="mb-4" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Informe seu peso e veja uma referência de creatina diária, com ou sem fase de saturação.
          </p>
        </div>
      </section>

      <section className="py-8 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraCreatina placement="calculadora-creatina" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto de creatina tomar por dia?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">De {MANUTENCAO_MIN} a {MANUTENCAO_MAX} g por dia, todos os dias.</strong> É a faixa do posicionamento da
              International Society of Sports Nutrition (ISSN) para adultos saudáveis, e é o que a maioria dos estudos usou.
            </p>
            <p className="text-gray-300 leading-relaxed">
              A creatina não age no dia em que você toma: ela se acumula no músculo, e é o estoque cheio que ajuda no treino. Por isso a
              regra mais importante não é a dose exata, é tomar todo dia.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calcular creatina pelo peso?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Multiplique o peso por <strong className="text-white">{g2(G_POR_KG_MANUTENCAO)} g</strong>. Para 80 kg: {g2(G_POR_KG_MANUTENCAO)} × 80 ={" "}
              {g2(R80.calculada)} g. Como a menor dose estudada é {MANUTENCAO_MIN} g, a referência fica em {MANUTENCAO_MIN} g até perto de 115 kg — e
              chega a {MANUTENCAO_MAX} g perto de 150 kg.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Referência diária de creatina por peso corporal</caption>
                <thead><tr className="border-b border-white/20"><th scope="col" className={th}>Peso</th><th scope="col" className={th}>Conta (0,03 g/kg)</th><th scope="col" className={th}>Referência</th><th scope="col" className="text-left text-gray-400 font-medium py-2.5">Saturação</th></tr></thead>
                <tbody>
                  {PESOS_TABELA.map((p) => {
                    const r = referencia(p);
                    return (
                      <tr key={p} className="border-b border-white/10">
                        <td className={td}>{p} kg</td>
                        <td className={td}>{g2(r.calculada)} g</td>
                        <td className="text-white py-2.5 pr-4 font-medium tabular-nums">{g(r.diaria)} g/dia</td>
                        <td className="text-gray-300 py-2.5 tabular-nums">{g(saturacao(p).diaria)} g/dia</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Creatina: 3 g ou 5 g?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">As duas funcionam.</strong> {MANUTENCAO_MIN} g por dia enchem os estoques em cerca de 4 semanas —{" "}
              {DIAS_ATE_SATURAR_SEM} dias no estudo clássico de Hultman. {MANUTENCAO_MAX} g, a dose mais usada nas pesquisas, chegam lá um pouco
              antes. Depois que o estoque está cheio, as duas mantêm.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Se você é grande ou prefere a dose dos estudos, {MANUTENCAO_MAX} g. Se quer o pote rendendo mais, {MANUTENCAO_MIN} g. Não existe
              motivo para passar disso no dia a dia.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto de creatina o pessoal que treina toma?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Na academia, a creatina costuma ser ajustada pela <strong className="text-white">massa magra</strong>, porque é no músculo que ela
              fica guardada. O protocolo com fonte para isso vem de um estudo com homens treinados (Gann et al., 2015):{" "}
              <strong className="text-white">{g3(G_POR_KG_MASSA_MAGRA)} g por kg de massa magra</strong>. É o que faz homem e mulher — e quem tem
              menos gordura — chegarem a doses diferentes.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Dose de creatina por massa magra e dose alta, para perfis comuns de quem treina</caption>
                <thead><tr className="border-b border-white/20"><th scope="col" className={th}>Perfil</th><th scope="col" className={th}>Pela massa magra</th><th scope="col" className="text-left text-gray-400 font-medium py-2.5">Dose alta ({g2(G_POR_KG_DOSE_ALTA)} g/kg)</th></tr></thead>
                <tbody>
                  {PERFIS_PRATICA.map((pf) => {
                    const r = pratica(pf.peso, pf.gordura);
                    return (
                      <tr key={pf.id} className="border-b border-white/10">
                        <td className={td}>{pf.nome}</td>
                        <td className="text-white py-2.5 pr-4 font-medium tabular-nums">{g(r.porMassaMagra)} g/dia</td>
                        <td className="text-gray-300 py-2.5 tabular-nums">{g(r.doseAlta)} g/dia</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed mb-3">
              A <strong className="text-white">dose alta</strong>, de {g2(G_POR_KG_DOSE_ALTA)} g por kg de peso, aparece em estudos de hipertrofia
              (Candow, 2015; Cribb, 2007) e é a que parte das academias usa. Ela é segura para adultos saudáveis, mas nenhum estudo mostrou que
              renda mais que 5 g no uso contínuo: o estoque do músculo tem um teto, e o que passa dele sai na urina.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Na calculadora acima, logo abaixo do resultado, informe o seu percentual de gordura para ver as três contas lado a lado com o seu
              peso.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto de creatina por kg?</h2>
            <p className="text-gray-300 leading-relaxed">
              Cerca de <strong className="text-white">{g2(G_POR_KG_MANUTENCAO)} g por kg</strong> na manutenção e {g2(G_POR_KG_SATURACAO)} g por kg na
              saturação. Algumas calculadoras usam 0,1 g por kg — 7 g para 70 kg — como dose diária. Esse fator vem de protocolos curtos de
              saturação, não do consenso para uso contínuo, e só faz o pote acabar mais rápido.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Precisa fazer saturação de creatina?</h2>
            <p className="text-gray-300 leading-relaxed mb-4"><strong className="text-white">Não.</strong> A saturação só encurta o caminho até o estoque cheio.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-white/15 p-4">
                <p className="text-white font-semibold mb-2">Sem saturação</p>
                <ul className="text-gray-300 text-sm space-y-1 list-disc pl-5"><li>{MANUTENCAO_MIN} a {MANUTENCAO_MAX} g todo dia desde o início</li><li>Estoque cheio em 3 a 4 semanas</li><li>Menos chance de desconforto no estômago</li></ul>
              </div>
              <div className="border border-white/15 p-4">
                <p className="text-white font-semibold mb-2">Com saturação</p>
                <ul className="text-gray-300 text-sm space-y-1 list-disc pl-5"><li>Cerca de {g2(G_POR_KG_SATURACAO)} g/kg por dia, em 4 porções</li><li>Estoque cheio em 5 a 7 dias</li><li>Depois, a mesma manutenção</li></ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como fazer saturação de creatina?</h2>
            <p className="text-gray-300 leading-relaxed">
              Multiplique o peso por {g2(G_POR_KG_SATURACAO)} g e divida em quatro porções ao longo do dia, por 5 a 7 dias. Para 70 kg: cerca de{" "}
              {g(S70.diaria)} g por dia, em porções de uns {g(S70.porDose)} g. Para 80 kg: {g(S80.diaria)} g por dia. Depois, passe para a dose de
              manutenção. É daí que vêm os “20 g por dia” que você já deve ter lido: é a conta para uma pessoa de uns 70 kg.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Creatina antes ou depois do treino?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Tanto faz na prática.</strong> Alguns estudos sugerem uma pequena vantagem em tomar perto do treino,
              mas a diferença é pequena perto do que decide o resultado: tomar todo dia. Quer se aprofundar? Veja{" "}
              <Link href="/blog/melhor-horario-para-tomar-creatina" className={ln}>o melhor horário para tomar creatina</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Precisa tomar creatina nos dias sem treino?</h2>
            <p className="text-gray-300 leading-relaxed"><strong className="text-white">Sim, na mesma dose.</strong> O estoque do músculo não depende do treino daquele dia — parar nos dias de descanso faz ele baixar aos poucos.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto tempo a creatina leva para fazer efeito?</h2>
            <p className="text-gray-300 leading-relaxed">
              O estoque fica cheio em <strong className="text-white">5 a 7 dias com saturação</strong> ou em <strong className="text-white">3 a 4
              semanas sem ela</strong>. Estoque cheio não é o mesmo que ficar mais forte: o ganho de desempenho aparece aos poucos, junto com
              o treino. Nas primeiras semanas, a balança pode subir um pouco — é água dentro do músculo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto tempo dura um pote de creatina?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Divida as gramas do pote pela dose diária. Para o seu caso, com saturação ou não, use a calculadora acima.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Duração de um pote de creatina por tamanho e dose diária</caption>
                <thead><tr className="border-b border-white/20"><th scope="col" className={th}>Pote</th><th scope="col" className={th}>3 g/dia</th><th scope="col" className="text-left text-gray-400 font-medium py-2.5">5 g/dia</th></tr></thead>
                <tbody>
                  {POTES_TABELA.map((p) => (
                    <tr key={p} className="border-b border-white/10">
                      <td className={td}>{p >= 1000 ? `${p / 1000} kg` : `${p} g`}</td>
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">{diasPorDose(p, 3)} dias</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">{diasPorDose(p, 5)} dias</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto dura 300 g de creatina?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">{diasPorDose(300, 3)} dias com 3 g por dia</strong>, ou {diasPorDose(300, 5)} dias com 5 g. Com saturação,
              menos: uma pessoa de 70 kg usa uns {g(S70.diaria * S70.dias)} g só nos cinco primeiros dias.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Creatina faz engordar?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Não engorda de gordura.</strong> A balança pode subir um pouco nas primeiras semanas porque o músculo
              guarda mais água junto com a creatina. É peso de água dentro da célula, não gordura, e não continua subindo depois disso.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Creatina causa retenção de líquido?</h2>
            <p className="text-gray-300 leading-relaxed">
              Aumenta a água <strong className="text-white">dentro do músculo</strong>, principalmente nas primeiras semanas e com saturação. Isso é
              diferente de edema, que é líquido acumulado embaixo da pele. A revisão de Antonio e colegas (2021) mostra que, a longo prazo,
              vários estudos não encontram aumento da água corporal total. Detalhes em{" "}
              <Link href="/blog/creatina-retencao-de-liquido-mito" className={ln}>creatina causa retenção de líquido?</Link>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Creatina faz mal aos rins?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">Em adultos saudáveis, nas doses usuais, a evidência não mostra dano renal.</strong> O consenso da ISSN
              e a revisão de 2021 analisaram estudos de meses a anos sem prejuízo à função dos rins.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Um detalhe que assusta à toa: a creatina pode elevar a creatinina no exame de sangue, porque a creatinina vem da própria
              creatina — sem que o rim esteja pior. Avise seu médico que usa. Quem tem doença renal conhecida ou exames alterados deve usar
              só com orientação médica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quem está emagrecendo pode usar creatina?</h2>
            <p className="text-gray-300 leading-relaxed">
              Pode, mas ela <strong className="text-white">não queima gordura</strong>. No déficit calórico, ela ajuda a manter a força no treino, e
              força mantida ajuda a preservar massa magra. A balança pode subir um pouco no início pela água no músculo — o que importa é a
              medida da cintura e o desempenho. Quem usa remédio para emagrecer deve decidir a suplementação junto com o médico; os artigos
              sobre <Link href="/blog/creatina-para-quem-usa-mounjaro" className={ln}>creatina e Mounjaro</Link> e sobre{" "}
              <Link href="/blog/creatina-para-quem-usa-retatrutida" className={ln}>creatina e retatrutida</Link> explicam o contexto.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Qual creatina escolher?</h2>
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5">
              <li><strong className="text-white">Creatina monohidratada:</strong> é a forma estudada em quase todas as pesquisas. Outras formas não mostraram vantagem consistente sobre ela.</li>
              <li><strong className="text-white">Rótulo:</strong> confira que o produto tem só creatina (ou diz claramente o que mais tem) e a quantidade por porção em gramas.</li>
              <li><strong className="text-white">Procedência:</strong> prefira marcas com laudo de pureza e que estejam regulares na Anvisa como suplemento alimentar.</li>
              <li><strong className="text-white">Custo por grama:</strong> a calculadora compara dois potes. Preço baixo não garante qualidade, e preço alto também não.</li>
            </ul>
          </div>

          <div className="border border-white/15 p-5">
            <p className="text-white font-semibold mb-2">Quando conversar com um profissional antes</p>
            <p className="text-gray-300 text-sm leading-relaxed">{AVISO_SEGURANCA}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Já sabe quanto de proteína precisa por dia?</p>
              <Link href="/ferramentas/calculadora-de-proteina" className="text-gray-300 text-sm underline underline-offset-4 decoration-1 hover:text-white min-h-[44px] inline-flex items-center" style={{ textDecorationColor: "#BA9E50" }}>Calcular minha proteína →</Link>
            </div>
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Quer um treino montado para o seu objetivo?</p>
              <Link href="/consultoria-online" className="text-gray-300 text-sm underline underline-offset-4 decoration-1 hover:text-white min-h-[44px] inline-flex items-center" style={{ textDecorationColor: "#BA9E50" }}>Conhecer a consultoria →</Link>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes sobre creatina</h2>
            <FAQ itens={faq} placement="ferramenta-creatina" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Metodologia</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Manutenção: {g2(G_POR_KG_MANUTENCAO)} g × peso, arredondado ao grama e mantido entre {MANUTENCAO_MIN} e {MANUTENCAO_MAX} g. Saturação:{" "}
              {g2(G_POR_KG_SATURACAO)} g × peso por dia, em quatro porções, por 5 a 7 dias (a conta do pote usa 5). A calculadora não pergunta
              idade, sexo ou objetivo porque a literatura não muda a dose por eles.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Última revisão científica: setembro de
              2026. Referência educativa para adultos saudáveis, não prescrição individual.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências científicas</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {FONTES_CREATINA.map((f) => (
                <li key={f.rotulo}><a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a> — {f.resumo}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/creatina-para-hipertrofia" className={ln}>Creatina para hipertrofia: o que a ciência diz</Link></li>
              <li><Link href="/blog/creatina-para-mulheres" className={ln}>Creatina para mulheres: funciona? Engorda?</Link></li>
              <li><Link href="/blog/suplementacao-basica-para-iniciantes" className={ln}>Suplementação básica para quem está começando</Link></li>
              <li><Link href="/ferramentas/calculadora-de-proteina" className={ln}>Calculadora de Proteína</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
