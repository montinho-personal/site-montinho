import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraComposicao from "@/components/composicao/CalculadoraComposicao";
import {
  FAIXAS,
  FRACAO_MAGRA_SEM_TREINO,
  NOTA_BIOIMPEDANCIA,
  NOTA_FAIXA_NAO_E_META,
  NOTA_MASSA_MAGRA_DE_PE,
  NOTA_MESMO_APARELHO,
  calcula,
  formataKg,
  formataPct,
  tabelaDeAlvos,
} from "@/lib/composicao";

/**
 * A página da Calculadora de Composição Corporal.
 *
 * lib/composicao.ts explica por que ela não canibaliza a de meta de peso
 * nem a de potencial natural. O que vale registrar aqui é o que a página
 * faz de diferente: ela publica os DOIS cenários lado a lado — com e sem
 * treino de força —, porque a diferença entre eles é o argumento mais
 * concreto que uma calculadora consegue fazer a favor da musculação.
 */

const CAMINHO = "/ferramentas/composicao-corporal";

export const metadata: Metadata = {
  title: "Percentual de Gordura: Composição Corporal e Bioimpedância",
  description:
    "Traduza o percentual de gordura em quilos de massa magra e gorda, veja em que faixa você está e quanto perder para chegar ao seu alvo.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Composição Corporal | Montinho Personal Trainer",
    description:
      "O que os números da sua bioimpedância querem dizer — e quanto muda no caminho com treino de força e sem ele.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Composição Corporal",
  descricao:
    "Converte peso e percentual de gordura em quilos de massa magra e massa gorda, classifica o resultado em faixas de referência e calcula quanto é preciso perder para atingir um percentual alvo, comparando o cenário com preservação de massa magra e sem ela.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Composição Corporal", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const EX = calcula(90, 28, "homem", 15);
const TAB = tabelaDeAlvos(90, 28, "homem");

const faq: ItemFAQ[] = [
  {
    question: "Qual o percentual de gordura ideal?",
    answer: `Como referência, homens entre 10% e 20% e mulheres entre 18% e 28% estão em faixas saudáveis. ${NOTA_FAIXA_NAO_E_META}`,
  },
  {
    question: "Como se calcula o percentual de gordura?",
    answer: "Ele não se calcula só com peso e altura: precisa de uma medida do corpo. Os métodos mais usados são a fita métrica (método da Marinha dos EUA, com pescoço, cintura e, nas mulheres, quadril), as dobras cutâneas com adipômetro (protocolos de Jackson e Pollock de 3 ou 7 dobras, feitos por um profissional), a bioimpedância e o DXA, que é o mais preciso. Com o percentual em mãos, esta calculadora traduz o número em quilos e faixas.",
  },
  {
    question: "Quanto é 20% de gordura corporal?",
    answer: "É um quinto do peso em gordura. Para 80 kg, são 16 kg de massa gorda e 64 kg de massa magra. Para homens, 20% fica no limite de cima da faixa saudável; para mulheres, dentro dela.",
  },
  {
    question: "23% de gordura corporal é muito?",
    answer: "Depende do sexo. Para mulheres, 23% está dentro da faixa saudável de referência (18% a 28%). Para homens, está um pouco acima dela (10% a 20%). Faixa é referência para situar, não meta.",
  },
  {
    question: "70 kg é considerado gordo?",
    answer: "O peso sozinho não responde. Duas pessoas com 70 kg podem ter composições muito diferentes, conforme a altura e quanto do peso é músculo. Por isso o percentual de gordura, e não o peso, diz se há gordura em excesso.",
  },
  {
    question: "Por que meu resultado mudou tanto de um dia para o outro?",
    answer: NOTA_BIOIMPEDANCIA,
  },
  {
    question: "Quanto preciso perder para chegar a 15% de gordura?",
    answer: `Depende da sua massa magra, não do seu peso. Um homem de ${formataKg(EX.pesoAtual)} com ${formataPct(EX.gorduraPct)} de gordura tem ${formataKg(EX.massaMagra)} de massa magra — se ela ficar de pé, ele chega a 15% pesando ${formataKg(EX.alvo!.pesoNoAlvo)}, perdendo ${formataKg(EX.alvo!.perda)}. Sem treino de força, precisaria perder ${formataKg(EX.alvo!.semTreino.perda)} para o mesmo percentual, porque parte do que sai é músculo.`,
  },
  {
    question: "A bioimpedância é confiável?",
    answer: NOTA_BIOIMPEDANCIA + " " + NOTA_MESMO_APARELHO,
  },
  {
    question: "Dá para perder gordura e ganhar músculo ao mesmo tempo?",
    answer:
      "Dá, e é mais provável em quem está começando, em quem está voltando depois de uma pausa e em quem tem percentual de gordura mais alto. Quanto mais treinado e mais magro, mais difícil — aí os dois objetivos passam a pedir fases separadas.",
  },
  {
    question: "Essa calculadora mede meu percentual de gordura?",
    answer:
      "Não. Ela parte do percentual que você já tem, de bioimpedância, dobras cutâneas ou DXA, e traduz esse número em quilos, faixas e metas. Para medir, é preciso um exame — e o melhor deles é o DXA.",
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

export default function ComposicaoCorporalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Calculadora de Composição Corporal
          </h1>
          <Compartilhar contexto="tool" titulo="Calculadora de Composição Corporal" caminho={CAMINHO} local="tool_top" ferramenta="composicao" aparencia="discreto" className="mb-5" />
          <p className="text-gray-300 text-lg leading-relaxed">
            A bioimpedância entrega uma dúzia de números e nenhuma explicação. Aqui eles viram quilos de gordura e
            de massa magra, uma faixa de leitura e — se você tiver um alvo — o caminho até ele.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraComposicao placement="composicao-corporal" />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              A mesma meta, dois caminhos muito diferentes
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Esta é a parte que a maioria das calculadoras de composição não mostra. Pegue um homem de{" "}
              {formataKg(EX.pesoAtual)} com {formataPct(EX.gorduraPct)} de gordura, querendo chegar a 15%:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Comparação do caminho até 15% de gordura com e sem treino de força</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Cenário</th>
                    <th scope="col" className={th}>Precisa perder</th>
                    <th scope="col" className={th}>Peso final</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Massa magra final</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="text-gray-300 py-2.5 pr-4">Com treino de força e proteína</td>
                    <td className="text-white py-2.5 pr-4 font-medium tabular-nums">{formataKg(EX.alvo!.perda)}</td>
                    <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{formataKg(EX.alvo!.pesoNoAlvo)}</td>
                    <td className="text-gray-300 py-2.5 tabular-nums">{formataKg(EX.massaMagra)}</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="text-gray-300 py-2.5 pr-4">Sem treino de força</td>
                    <td className="text-white py-2.5 pr-4 font-medium tabular-nums">{formataKg(EX.alvo!.semTreino.perda)}</td>
                    <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{formataKg(EX.alvo!.semTreino.pesoNoAlvo)}</td>
                    <td className="text-gray-300 py-2.5 tabular-nums">{formataKg(EX.alvo!.semTreino.massaMagraFinal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Os dois chegam a 15% de gordura. Um perde {formataKg(EX.alvo!.perda)} e mantém a musculatura; o
              outro precisa perder {formataKg(EX.alvo!.semTreino.perda)} — quase{" "}
              {formataKg(EX.alvo!.semTreino.perda - EX.alvo!.perda)} a mais — porque um quarto do que sai é massa
              magra. É o mesmo número no relatório e dois corpos diferentes no espelho.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>As faixas de leitura</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Elas servem para situar, não para definir meta:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Faixas de percentual de gordura por sexo</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Faixa</th>
                    <th scope="col" className={th}>Homens</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Mulheres</th>
                  </tr>
                </thead>
                <tbody>
                  {FAIXAS.map((f, i) => {
                    const deH = i === 0 ? 0 : FAIXAS[i - 1].ate.homem;
                    const deM = i === 0 ? 0 : FAIXAS[i - 1].ate.mulher;
                    const ultimo = i === FAIXAS.length - 1;
                    return (
                      <tr key={f.id} className="border-b border-white/10">
                        <td className="text-white py-2.5 pr-4 font-medium">
                          {f.nome}
                          <span className="block text-gray-500 text-xs font-normal mt-0.5">{f.descricao}</span>
                        </td>
                        <td className="text-gray-300 py-2.5 pr-4 tabular-nums align-top">
                          {ultimo ? `acima de ${deH}%` : `${deH}% a ${f.ate.homem}%`}
                        </td>
                        <td className="text-gray-300 py-2.5 tabular-nums align-top">
                          {ultimo ? `acima de ${deM}%` : `${deM}% a ${f.ate.mulher}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed">{NOTA_FAIXA_NAO_E_META}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto perder para cada alvo</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Para o mesmo homem de {formataKg(EX.pesoAtual)} com {formataPct(EX.gorduraPct)}, mantendo a massa
              magra de pé:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Peso e perda necessários por percentual de gordura alvo</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Alvo</th>
                    <th scope="col" className={th}>Peso final</th>
                    <th scope="col" className={th}>Perder</th>
                    <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Faixa</th>
                  </tr>
                </thead>
                <tbody>
                  {TAB.map((l) => (
                    <tr key={l.alvo} className="border-b border-white/10">
                      <td className="text-white py-2.5 pr-4 font-medium tabular-nums">{l.alvo}%</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">{formataKg(l.pesoNoAlvo)}</td>
                      <td className="text-gray-300 py-2.5 pr-4 tabular-nums">−{formataKg(l.perda)}</td>
                      <td className="text-gray-400 py-2.5">{l.faixa.nome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm">
              Repare que o peso final depende da massa magra, não do peso de hoje: duas pessoas de 90 kg com
              percentuais diferentes chegam a 15% em pesos diferentes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O número não é uma medida</h2>
            <p className="text-gray-300 leading-relaxed mb-4">{NOTA_BIOIMPEDANCIA}</p>
            <p className="text-gray-300 leading-relaxed mb-4">{NOTA_MESMO_APARELHO}</p>
            <p className="text-gray-300 leading-relaxed">
              Isso não torna o exame inútil — torna-o útil para <em>tendência</em>, não para veredito. Três
              medições no mesmo aparelho ao longo de dois meses dizem muito mais que uma medição isolada com uma
              casa decimal.{" "}
              <Link href="/blog/bioimpedancia-como-interpretar" className={ln}>
                Como funciona a bioimpedância
              </Link>{" "}
              trata disso com calma.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como calculamos</h2>
            <div className="border border-white/15 p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
              <p>massa gorda = peso × % de gordura</p>
              <p>massa magra = peso − massa gorda</p>
              <p className="mt-2">peso no alvo = massa magra ÷ (1 − % alvo)</p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              O cenário sem treino de força usa a regra clássica de que cerca de{" "}
              {Math.round(FRACAO_MAGRA_SEM_TREINO * 100)}% do peso perdido é massa magra em quem só corta comida.
              Com ela, a massa magra também encolhe — e o peso final fica mais baixo para o mesmo percentual de
              gordura. {NOTA_MASSA_MAGRA_DE_PE}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revisado em 22 de setembro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>,
              personal trainer em Alphaville. Referência de planejamento; não substitui avaliação física ou
              nutricional individual.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="ferramenta-composicao" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Leia também</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/blog/bioimpedancia-como-interpretar" className={ln}>Bioimpedância: como interpretar os resultados</Link></li>
              <li><Link href="/blog/percentual-de-gordura-ideal" className={ln}>Qual o percentual de gordura ideal</Link></li>
              <li><Link href="/blog/como-perder-gordura-sem-perder-massa-muscular" className={ln}>Como perder gordura sem perder massa muscular</Link></li>
              <li><Link href="/ferramentas/potencial-natural" className={ln}>Calculadora de Potencial Natural — quanto músculo ainda cabe</Link></li>
              <li><Link href="/ferramentas/meta-de-peso" className={ln}>Calculadora de Meta de Peso — quanto dá até a sua data</Link></li>
              <li><Link href="/ferramentas/calculadora-de-proteina" className={ln}>Calculadora de Proteína</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
