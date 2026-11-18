import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import CalculadoraPrecoPersonal from "@/components/preco/CalculadoraPrecoPersonal";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FONTE_REFERENCIA, LOCAIS, REFERENCIAS, SESSOES_DO_PACOTE, calcular, faixaTxt, tabelaPorFrequencia } from "@/lib/preco-personal";

/**
 * Calculadora de preço de personal trainer para Alphaville e região.
 *
 * Pesquisa (SerpApi, 18/11/2026, celular, Barueri): docs/seo/serp/
 * calculadora-preco-personal-alphaville-2026-11-18.json. O que cada
 * intenção mudou está em docs/seo/teste-intencoes-de-busca.md.
 *
 * Divisão com o artigo /blog/quanto-custa-personal-trainer-alphaville: o
 * artigo explica o que entra no preço e como escolher; esta página faz a
 * conta por mês e por aula. Todo número daqui sai de lib/preco-personal.ts,
 * que é referência editorial do Personal por Perto, nunca "preço médio".
 */

const CAMINHO = "/ferramentas/calculadora-preco-personal-trainer-alphaville";
const NOME = "Calculadora de Preço de Personal Trainer em Alphaville";

export const metadata: Metadata = {
  title: "Calculadora de Preço de Personal Trainer: Alphaville e Região",
  description:
    "Escolha o local, o formato e quantas vezes por semana e veja a faixa de referência por aula e por mês em Alphaville, Tamboré, Barueri e Santana de Parnaíba.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: `${NOME} | Montinho Personal Trainer`,
    description: "Faixa de referência por aula e por mês, com a conta aberta linha a linha: condomínio, academia, domicílio ou online, de 1 a 5 vezes por semana.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: NOME,
  descricao:
    "Mostra a faixa de referência de preço de personal trainer por aula e por mês em Alphaville, Tamboré, Aldeia da Serra, Barueri e Santana de Parnaíba, por formato (condomínio, academia, domicílio ou online) e frequência semanal, com a memória do cálculo. As faixas são referência editorial, não pesquisa de preços.",
  caminho: CAMINHO,
  categoria: "UtilitiesApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: NOME, item: `${SITE_URL}${CAMINHO}` },
  ],
};

const ALPHA = REFERENCIAS.alphaville;
const TABELA = tabelaPorFrequencia("alphaville");
const A2 = calcular("alphaville", "condominio", 2);
const A3 = calcular("alphaville", "condominio", 3);
const A5 = calcular("alphaville", "condominio", 5);
const DATA_REF = new Date(`${FONTE_REFERENCIA.consultadaEm}T12:00:00`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
const PPP_CALC = FONTE_REFERENCIA.url;

const faq: ItemFAQ[] = [
  {
    question: "Quanto custa um personal trainer em Alphaville por mês?",
    answer: `Pela referência editorial usada nesta calculadora, um pacote presencial de 2 a 3 vezes por semana em Alphaville fica na faixa de ${faixaTxt(ALPHA.mensal)} por mês, e o acompanhamento online, de ${faixaTxt(ALPHA.online)} por mês. É uma faixa de ordem de grandeza, não pesquisa de preços: o valor de cada profissional depende do horário, do local e do que entra no acompanhamento.`,
  },
  {
    question: "Quanto custa um personal trainer 3 vezes por semana?",
    answer: `Três vezes por semana dão cerca de ${A3.sessoes} aulas no mês (3 × 52 ÷ 12). Em Alphaville, a referência para esse pacote é de ${faixaTxt(A3.mensal)} por mês, o que equivale a ${faixaTxt(A3.aulaNoPacote!)} por aula dentro do pacote.`,
  },
  {
    question: "Quanto custa uma aula avulsa com personal trainer?",
    answer: `A referência para aula avulsa presencial é de ${faixaTxt(ALPHA.avulsa)} em Alphaville e de ${faixaTxt(REFERENCIAS.barueri.avulsa)} em Barueri e em Santana de Parnaíba. A avulsa custa mais por aula do que a aula dentro de um pacote mensal, porque não dá previsibilidade de agenda ao profissional.`,
  },
  {
    question: "Personal trainer cobra por aula ou por mês?",
    answer: "Os dois formatos existem. A aula avulsa serve para experimentar ou para treinos pontuais. O pacote mensal fixa os dias e os horários e costuma sair mais em conta por aula. O acompanhamento online é sempre por mês.",
  },
  {
    question: "Quanto custa personal trainer online?",
    answer: `A referência é de ${faixaTxt(ALPHA.online)} por mês para Alphaville, ${faixaTxt(REFERENCIAS.barueri.online)} para Barueri e ${faixaTxt(REFERENCIAS["santana-de-parnaiba"].online)} para Santana de Parnaíba. O online não é cobrado por aula: você paga o planejamento, os ajustes e o acompanhamento a distância.`,
  },
  {
    question: "Personal no condomínio custa mais caro?",
    answer: "A referência não separa condomínio, academia e domicílio: a faixa presencial é a mesma. Na prática, no condomínio você não paga academia nem se desloca, e o profissional que já atende no seu residencial perde menos tempo no trajeto. Confirme na administração se o condomínio exige cadastro do profissional.",
  },
  {
    question: "A academia pode cobrar taxa do meu personal?",
    answer: "Cada academia define a própria regra para personal externo: algumas liberam, outras cobram taxa ou só aceitam profissional cadastrado. Essa taxa, quando existe, não está nas faixas desta calculadora. Pergunte na recepção da sua unidade antes de fechar com o profissional.",
  },
  {
    question: "Quanto tempo dura uma aula com personal trainer?",
    answer: "Depende do que for combinado: há profissionais que trabalham com aulas mais curtas e outros com aulas de cerca de uma hora. A referência desta calculadora não distingue a duração, então pergunte quanto tempo dura a aula ao comparar dois orçamentos.",
  },
  {
    question: "Existe um preço médio de personal trainer em Alphaville?",
    answer: "Não que possa ser citado com segurança. Não há pesquisa pública de preços de personal trainer em Alphaville com amostra e data. Por isso esta calculadora mostra faixa de referência editorial e nunca um valor médio ou exato.",
  },
  {
    question: "Esta calculadora mostra o preço do Montinho?",
    answer: "Não. Ela mostra uma faixa de referência da região. O valor do acompanhamento com o Montinho depende do formato, do local e da frequência, e é passado direto pelo WhatsApp.",
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
const tdF = "text-white py-2.5 pr-4 font-medium tabular-nums";

export default function CalculadoraPrecoPersonalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Gratuita · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>
            Calculadora de preço de personal trainer em Alphaville e região
          </h1>
          <Compartilhar contexto="tool" titulo={NOME} caminho={CAMINHO} local="tool_top" ferramenta="preco-personal" aparencia="discreto" className="mb-4" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Escolha o local, o formato e quantas vezes por semana você quer treinar. A calculadora mostra a faixa de referência por aula e por mês e abre a conta, linha a linha.
          </p>
        </div>
      </section>

      <section className="py-8 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraPrecoPersonal />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto custa um personal trainer em Alphaville?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">
                A referência para Alphaville é de {faixaTxt(ALPHA.avulsa)} por aula avulsa presencial, de {faixaTxt(ALPHA.mensal)} por mês no pacote de 2 a 3 vezes por semana e de {faixaTxt(ALPHA.online)} por mês no online.
              </strong>
            </p>
            <p className="text-gray-300 leading-relaxed">
              São faixas de {FONTE_REFERENCIA.rotulo}, montadas por perfil de cidade pelo portal{" "}
              <a href={PPP_CALC} className={ln} target="_blank" rel="noopener noreferrer">{FONTE_REFERENCIA.nome}</a> e consultadas em {DATA_REF}. Não são pesquisa de preços e não existe amostra por trás delas: servem para você chegar a uma conversa sabendo se o valor proposto está dentro ou muito fora do esperado.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Quanto custa por mês treinando 1, 2, 3, 4 ou 5 vezes por semana</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">A conta começa em quantas aulas cabem no mês.</strong> Um mês tem em média 4,33 semanas (52 ÷ 12): 2 vezes por semana dão cerca de {A2.sessoes} aulas, 3 vezes dão cerca de {A3.sessoes} e 5 vezes, cerca de {A5.sessoes}. A tabela usa a referência de Alphaville, presencial.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Faixa de referência por mês e por aula em Alphaville, presencial, de 1 a 5 vezes por semana</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Frequência</th>
                    <th scope="col" className={th}>Aulas no mês</th>
                    <th scope="col" className={th}>Por mês</th>
                    <th scope="col" className={th}>Por aula no pacote</th>
                  </tr>
                </thead>
                <tbody>
                  {TABELA.map((r) => (
                    <tr key={r.freq} className="border-b border-white/10">
                      <td className={td}>{r.freq}× por semana</td>
                      <td className={td}>≈ {r.sessoes}</td>
                      <td className={tdF}>{faixaTxt(r.mensal)}{r.extrapolado ? " *" : ""}</td>
                      <td className={td}>{faixaTxt(r.aulaNoPacote!)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm mt-3">
              * Extrapolação. A referência só traz o pacote de 2 a 3 vezes por semana; para 1, 4 e 5 vezes, a calculadora divide a faixa do pacote por {SESSOES_DO_PACOTE} sessões e multiplica pelas aulas do mês.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Frequência alta multiplica o custo rápido. Antes de fechar 5 vezes por semana, veja se a sua agenda segura esse ritmo: pagar por {A5.sessoes} aulas e fazer 10 é o pior negócio possível.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Alphaville, Tamboré, Aldeia da Serra, Barueri e Santana de Parnaíba</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">A referência só tem faixa própria para Alphaville, Barueri e Santana de Parnaíba.</strong> Tamboré, Aldeia da Serra e o centro de Barueri usam a faixa mais ampla que os contém, e a calculadora avisa isso no resultado.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Faixas de referência por local</caption>
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className={th}>Local</th>
                    <th scope="col" className={th}>Referência usada</th>
                    <th scope="col" className={th}>Aula avulsa</th>
                    <th scope="col" className={th}>Pacote 2 a 3×</th>
                    <th scope="col" className={th}>Online, por mês</th>
                  </tr>
                </thead>
                <tbody>
                  {LOCAIS.map((l) => {
                    const r = REFERENCIAS[l.ref];
                    return (
                      <tr key={l.id} className="border-b border-white/10">
                        <td className={tdF}>{l.nome}</td>
                        <td className={td}>{r.nome}{l.aviso ? " (sem faixa própria)" : ""}</td>
                        <td className={td}>{faixaTxt(r.avulsa)}</td>
                        <td className={td}>{faixaTxt(r.mensal)}</td>
                        <td className={td}>{faixaTxt(r.online)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed mt-4">
              Mora em outra cidade? A{" "}
              <a href={PPP_CALC} className={ln} target="_blank" rel="noopener noreferrer">calculadora do Personal por Perto</a> faz a mesma conta para o resto do Brasil.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>No condomínio, na academia ou a domicílio: o que muda no preço</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">A referência não separa os três formatos presenciais, então a faixa é a mesma.</strong> O que muda é o que fica fora dela, e é isso que vale perguntar antes de fechar:
            </p>
            <ul className="text-gray-300 leading-relaxed space-y-3 list-disc pl-5">
              <li>
                <strong className="text-white">No condomínio.</strong> Você não paga academia e não pega trânsito. Para quem mora em residencial com espaço fitness, é o formato que menos mexe na rotina. O condomínio pode exigir cadastro do profissional ou ter regra de uso do espaço: confirme na administração.
              </li>
              <li>
                <strong className="text-white">Na academia.</strong> A mensalidade da academia é à parte. Cada academia tem a própria regra para personal externo: algumas liberam, outras cobram taxa ou só aceitam profissional cadastrado. Essa regra não costuma ser publicada, então a taxa não entra nesta calculadora: pergunte na recepção.
              </li>
              <li>
                <strong className="text-white">A domicílio.</strong> O deslocamento entre um residencial e outro ocupa o tempo do profissional e costuma aparecer no preço, mais ainda em horário de pico. Se você não tem equipamento, pergunte se o material está incluído.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Personal trainer online: quanto custa por mês</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">A referência para Alphaville é de {faixaTxt(ALPHA.online)} por mês, e a frequência não muda o valor.</strong> O online não é o presencial mais barato, é outro serviço: você recebe o planejamento, os ajustes e o acompanhamento a distância, e treina no horário que couber. O presencial entrega alguém do seu lado corrigindo na hora. Para decidir entre os dois, veja{" "}
              <Link href="/blog/consultoria-online-ou-personal-presencial" className={ln}>consultoria online ou personal presencial</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Aula avulsa ou pacote mensal?</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">A avulsa custa mais por aula; o pacote exige compromisso de agenda.</strong> Em Alphaville, a referência da aula avulsa é de {faixaTxt(ALPHA.avulsa)}, enquanto a aula dentro de um pacote de 3 vezes por semana equivale a {faixaTxt(A3.aulaNoPacote!)}. A avulsa faz sentido para experimentar o profissional ou para um treino pontual. Se você já sabe que vai manter a rotina, o pacote quase sempre é a decisão melhor.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>O que perguntar antes de comparar dois orçamentos</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">Preço sozinho diz pouco: dois orçamentos iguais podem entregar coisas bem diferentes.</strong> Pergunte:
            </p>
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5">
              <li>quanto tempo dura a aula;</li>
              <li>o que acontece quando você falta ou precisa remarcar;</li>
              <li>se há avaliação no começo e reavaliação depois;</li>
              <li>quem ajusta o treino quando a carga para de subir ou a sua rotina muda;</li>
              <li>se existe acompanhamento entre uma aula e outra.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              O artigo{" "}
              <Link href="/blog/quanto-custa-personal-trainer-alphaville" className={ln}>quanto custa um personal trainer em Alphaville</Link> detalha o que entra no valor e os erros mais comuns na contratação.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>De onde vêm os números e como a conta é feita</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">As faixas não são pesquisa de preços praticados.</strong> São estimativas editoriais do portal {FONTE_REFERENCIA.nome}, construídas pelo perfil de cada cidade e consultadas em {DATA_REF}. Por isso esta página nunca diz "preço médio", não cita quantidade de profissionais e não mostra valor exato.
            </p>
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5">
              <li>Aulas por mês = vezes por semana × 52 ÷ 12, arredondado.</li>
              <li>Para 2 e 3 vezes por semana, a faixa mensal é o próprio dado de pacote da referência.</li>
              <li>Para 1, 4 e 5 vezes, a faixa do pacote é dividida por {SESSOES_DO_PACOTE} sessões e multiplicada pelas aulas do mês, e o resultado é marcado como extrapolação.</li>
              <li>Online é mensal e não muda com a frequência.</li>
              <li>Arredondamento único: dezena mais próxima até R$ 1.000, cinquentena acima.</li>
              <li>Local sem faixa própria usa a referência mais ampla, e a tela avisa.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              <strong className="text-white">Limites.</strong> A referência não distingue aula de 30 e de 60 minutos, aula individual de dupla, experiência do profissional nem condomínio, academia e domicílio. Também não inclui mensalidade de academia nem taxa de personal externo. A conta roda no seu navegador, sem servidor e sem texto gerado por IA.
            </p>
          </div>

          <div className="border border-white/15 p-5">
            <h2 className="text-xl font-bold text-white mb-3" style={h}>E o acompanhamento com o Montinho?</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A calculadora mostra a região, não o meu valor. Atendo presencialmente na Arena 18, em condomínios e em casa, em Alphaville, Tamboré e arredores; em outras academias, depende das regras do local para personal externo e de combinação prévia. Também acompanho a distância, pela{" "}
              <Link href="/consultoria-online" className={ln}>consultoria online</Link>.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Montar o treino é o começo. O trabalho é o que vem depois: você faltou, a carga parou de subir, um exercício não encaixou, e alguém precisa perceber e ajustar. Me conte onde você treina e quantas vezes por semana, e eu digo como funcionaria.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={getWhatsAppUrl("Oi Montinho! Vi a calculadora de preço de personal no site e queria saber como funciona o seu acompanhamento e o valor.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-white text-black px-5 py-3 text-sm font-semibold min-h-[48px] hover:bg-gray-100">Falar com o Montinho no WhatsApp</a>
              <Link href="/personal-trainer-alphaville" className="inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60">Personal trainer em Alphaville</Link>
            </div>
          </div>

          <FAQ itens={faq} placement="ferramenta-preco-personal" />
        </div>
      </section>
    </>
  );
}
