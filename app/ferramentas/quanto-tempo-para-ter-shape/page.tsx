import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import SimuladorShape from "@/components/shape/SimuladorShape";
import { calcula, fmtFaixaAnos } from "@/lib/shape";

/**
 * Simulador "Quanto tempo para ter shape?" — trajetória de anos.
 *
 * SERP (set/2026): em português, respostas genéricas ("4 a 8 semanas",
 * "6 meses") de Smart Fit, Tua Saúde e Metrópoles, sem ferramenta; em
 * inglês, calculadoras de "potencial natural" que prometem "90% do teto em
 * 4–5 anos". Nenhuma em português mostra estágio, curva decrescente, três
 * cenários e o ponto em que uma referência profissional deixa de ter prazo.
 *
 * NÃO CANIBALIZA: /ferramentas/potencial-natural responde "quanto ainda
 * cabe" (FFMI); /ferramentas/simulador-ganho-massa-muscular, "quando meu
 * peso chega em X"; /blog/quanto-tempo-para-ganhar-massa-muscular é o
 * artigo informacional. Esta página mira "quanto tempo para ter shape /
 * ficar musculoso" e liga as três.
 */

const CAMINHO = "/ferramentas/quanto-tempo-para-ter-shape";

export const metadata: Metadata = {
  title: { absolute: "Quanto Tempo para Ter Shape? Simulador | Montinho" },
  description:
    "Informe altura, peso e tempo de treino e veja seu estágio atual e uma estimativa por faixas de como sua evolução muscular tende a ser nos próximos anos.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Quanto tempo para ter shape? Simule sua evolução muscular",
    description: "Seu estágio hoje, o caminho provável dos próximos anos e onde uma referência profissional deixa de caber num prazo honesto.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Simulador: quanto tempo para ter shape",
  descricao: "Estima massa magra e FFMI a partir de altura, peso e percentual de gordura, classifica o estágio de desenvolvimento muscular e projeta, em três cenários e por faixas, a evolução dos próximos anos com retornos decrescentes.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Quanto tempo para ter shape", item: `${SITE_URL}${CAMINHO}` },
  ],
};

// Exemplo calculado pelo próprio motor (homem, 1,75 m, 70 kg, 18%, começando do zero).
const EX = calcula({ sexo: "homem", alturaCm: 175, pesoKg: 70, gorduraPct: 18, idade: 25, anos: "zero", consistencia: "muito", dias: 4, referencia: "avancado" });
const ganho = (a: number) => Math.round(EX.cenarios.consistente[a * 12].ffm - EX.cenarios.consistente[(a - 1) * 12].ffm);
const exAlvo = EX.alvo.tipo === "faixa" ? fmtFaixaAnos(EX.alvo.anos) : "vários anos";

const faq: ItemFAQ[] = [
  { question: "Quanto músculo dá para ganhar em 1 ano?", answer: `Depende de quanto você já treinou. No modelo do simulador, um homem que começa do zero com treino consistente ganha algo como ${ganho(1)} kg de massa magra no primeiro ano, e bem menos nos seguintes. Para mulheres, os modelos usam cerca de metade. São faixas de um modelo prático, não promessa.` },
  { question: "Quanto tempo leva para ficar musculoso?", answer: "Músculo visível costuma aparecer nos primeiros meses. Ficar claramente musculoso, mesmo de roupa, leva em geral alguns anos de treino consistente. O simulador mostra a faixa para o seu caso, porque o ponto de partida muda tudo." },
  { question: "Em quanto tempo a academia muda o corpo?", answer: "Força e disposição mudam em semanas; a aparência, em meses. O primeiro ano costuma concentrar a maior parte da mudança visível, desde que o treino seja regular e com progressão." },
  { question: "Quanto tempo para ter um shape avançado?", answer: `No exemplo desta página (homem de 1,75 m começando do zero), o nível avançado aparece numa faixa de ${exAlvo}, entre os cenários consistente e muito bem executado. Para quem já treina, a faixa depende do estágio atual.` },
  { question: "Quanto tempo demora para ganhar 10 kg de músculo?", answer: "Para quem começa do zero, 10 kg de massa magra costumam levar de um a alguns anos. Para quem já é avançado, podem não caber em nenhum prazo razoável. É por isso que o simulador fala em estágios, não em quilos fixos por ano." },
  { question: "Dá para ficar igual a um fisiculturista profissional naturalmente?", answer: "O fisiculturismo profissional apresenta níveis de muscularidade que podem ultrapassar o que modelos de progressão natural conseguem projetar. Por isso o simulador não dá prazo para essas referências: um número ali seria inventado. Isso não é uma afirmação sobre nenhum atleta." },
  { question: "É possível ter um shape em 2 ou 3 meses?", answer: "Um shape de verdade, não. Em 2 a 3 meses dá para ver os primeiros sinais: mais força, roupa vestindo diferente e, para quem tem pouca gordura, músculo começando a aparecer. Um físico que chama atenção leva de 1 a 3 anos de treino e alimentação constantes. Quem promete shape em 90 dias está vendendo perda de inchaço e boa iluminação." },
  { question: "É possível ver resultados com 1 mês de academia?", answer: "Você sente antes de ver: no primeiro mês a força sobe rápido, porque o sistema nervoso aprende os movimentos, e o corpo desincha. Mudança visível no espelho costuma vir a partir de 2 a 3 meses, e fica clara para os outros perto dos 6 meses." },
  { question: "Malhar 1 hora por dia dá resultado?", answer: "Dá, se a hora tiver carga subindo ao longo das semanas e o descanso estiver em dia. Não precisa ser todo dia: 3 a 5 treinos por semana, de 45 a 75 minutos, bastam para a maioria. Mais tempo de academia não compensa treino sem progressão." },
  { question: "Com quanto tempo de academia vejo resultado nos braços, pernas e glúteos?", answer: "Músculos grandes, como pernas e glúteos, costumam mudar primeiro quando o treino é bem feito, em 2 a 3 meses. Braço aparece logo em quem tem pouca gordura no braço. Barriga é o último lugar: depende da gordura total do corpo baixar, e não existe perda localizada." },
  { question: "Quanto tempo de academia para emagrecer 10 kg?", answer: "Com déficit moderado, perto de 0,5 kg por semana, uns 5 meses; e o déficit vem principalmente da alimentação, com a musculação preservando o músculo. Para simular com o seu peso e o seu prazo, use o simulador de emagrecimento." },
  { question: "Mulher demora mais para ter resultado na musculação?", answer: "Em músculo ganho em quilos, sim: os modelos usam cerca de metade do ganho masculino. Em percentual e em mudança visível, a resposta é parecida, principalmente em pernas e glúteos. O prazo do simulador já considera o sexo." },
  { question: "O primeiro ano de academia dá mais resultado?", answer: "Sim. Iniciantes respondem mais ao treino, e o primeiro ano concentra a maior parte dos ganhos possíveis. Depois, cada ano rende menos que o anterior, para todo mundo." },
  { question: "Por que fica mais difícil ganhar músculo depois?", answer: "Quanto mais perto do seu potencial, maior o estímulo necessário para continuar crescendo e menor a resposta. A curva fica mais plana: o trabalho passa a ser manter a progressão por anos." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="text-2xl font-bold text-white mb-3" style={h}>{children}</h2>;

export default function QuantoTempoShapePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Quanto tempo para ter shape</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>Quanto tempo para ter shape? Simule sua evolução muscular</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Em cerca de um minuto: seu estágio hoje, o caminho provável dos próximos anos em três cenários, e o ponto em que uma referência — até a do Mr. Olympia — deixa de caber num prazo honesto.</p>
        </div>
      </section>

      <section id="simulador" className="pb-10 bg-black scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SimuladorShape />
          <noscript><p className="text-gray-300 mt-4">O simulador precisa de JavaScript. O método completo está logo abaixo.</p></noscript>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <H2>Quanto tempo demora para ganhar massa muscular?</H2>
            <p>Depende sobretudo de onde você começa. Quem nunca treinou ganha massa magra rápido nos primeiros meses; quem treina há anos ganha pouco por ano, mesmo fazendo tudo certo. No modelo deste simulador, um homem de 1,75 m que começa do zero e treina com consistência ganha cerca de <strong className="text-white">{ganho(1)} kg de massa magra no 1º ano, {ganho(2)} kg no 2º e {ganho(3)} kg no 3º</strong>. Não é uma promessa: é a forma típica da curva. O artigo <Link href="/blog/quanto-tempo-para-ganhar-massa-muscular" className={ln}>quanto tempo para ganhar massa muscular</Link> aprofunda o assunto.</p>
          </div>
          <div>
            <H2>Quanto tempo para ficar musculoso?</H2>
            <p>Músculo visível aparece em meses; ficar claramente musculoso, mesmo de roupa, costuma levar alguns anos de treino consistente. No mesmo exemplo, o nível que o simulador chama de avançado aparece numa faixa de <strong className="text-white">{exAlvo}</strong>. Para quem já treina, o ponto de partida muda a conta — por isso o simulador começa perguntando como você está hoje.</p>
          </div>
          <div>
            <H2>Por que o primeiro ano costuma ser diferente dos seguintes?</H2>
            <p>O corpo de quem começa a treinar responde a quase qualquer estímulo bem feito. Com o tempo, o mesmo treino passa a gerar respostas menores, e é preciso mais volume e progressão para continuar crescendo. O resultado é uma curva de retornos decrescentes: o primeiro ano concentra a maior parte dos ganhos, e cada ano seguinte rende menos que o anterior.</p>
          </div>
          <div>
            <H2>Por que a evolução fica mais lenta?</H2>
            <p>Porque você se aproxima do seu próprio potencial. Não existe um número universal para esse teto, mas a desaceleração é real para todo mundo. Na prática, isso muda o objetivo: depois dos primeiros anos, o trabalho passa a ser manter a progressão por muito tempo — com treino estruturado, alimentação adequada, sono e, acima de tudo, constância.</p>
          </div>
          <div>
            <H2>É possível ficar do tamanho de um fisiculturista profissional?</H2>
            <p>O fisiculturismo profissional — Classic Physique, 212, Open — apresenta níveis de muscularidade que podem ultrapassar o que modelos de progressão natural conseguem projetar. Por isso, quando você escolhe uma dessas referências, o simulador <strong className="text-white">não mostra um prazo</strong>: um número ali seria inventado. Os atletas aparecem só como referência de escala da categoria; a ferramenta não faz nenhuma afirmação sobre eles. Se o assunto veio do Olympia, veja o <Link href="/blog/resultado-classic-physique-mr-olympia-2026" className={ln}>resultado da Classic Physique</Link> e <Link href="/blog/ramon-dino-peso-altura" className={ln}>quanto pesa Ramon Dino</Link>.</p>
          </div>
          <div>
            <H2>O que é FFMI?</H2>
            <p>O FFMI (índice de massa livre de gordura) é a massa magra dividida pela altura ao quadrado — um jeito de comparar muscularidade entre pessoas de alturas diferentes. Uma pessoa de 1,65 m com 80 kg não pode ser comparada a outra de 1,85 m com 100 kg só pelo peso: a altura e a composição corporal mudam tudo. O simulador usa o FFMI normalizado (ajustado para 1,80 m).</p>
            <p className="mt-3">O FFMI é um indicador, não um veredito. Ele não determina genética, não prevê sozinho o seu potencial e não diz se alguém é natural. O valor de 25, que circula como &ldquo;limite natural&rdquo;, vem de <a href="https://pubmed.ncbi.nlm.nih.gov/7496846/" target="_blank" rel="noopener noreferrer" className={ln}>Kouri et al. (1995)</a>: é o teto de uma amostra de 1995, não uma lei. A <Link href="/ferramentas/potencial-natural" className={ln}>Calculadora de Potencial Natural</Link> explica isso em detalhe.</p>
          </div>
          <div>
            <H2>Como estimamos sua massa magra?</H2>
            <p>Massa magra = peso × (1 − percentual de gordura). Se você não sabe o seu percentual, estimamos pelo IMC com a fórmula de <a href="https://pubmed.ncbi.nlm.nih.gov/2043597/" target="_blank" rel="noopener noreferrer" className={ln}>Deurenberg et al. (1991)</a>, que erra em média uns 4 pontos e superestima gordura em quem já é musculoso. Nesse caso, o simulador avisa que a estimativa tem qualidade baixa e mostra uma faixa mais larga.</p>
          </div>
          <div>
            <H2>O que mais influencia sua evolução?</H2>
            <p><strong className="text-white">Consistência</strong> — 5 anos de matrícula não são 5 anos de treino. <strong className="text-white">Progressão</strong> — acompanhar cargas e repetições. <strong className="text-white">Estrutura</strong> — um plano que se repete e evolui. <strong className="text-white">Alimentação e sono</strong> — o que sustenta a recuperação. Frequência importa menos do que parece: com o mesmo volume semanal, treinar mais dias quase não muda a hipertrofia (<a href="https://pubmed.ncbi.nlm.nih.gov/30558493/" target="_blank" rel="noopener noreferrer" className={ln}>Schoenfeld et al., 2019</a>); só treinar 1 vez por semana tende a render menos.</p>
          </div>

          <div className="border border-white/15 p-5">
            <h2 className="text-xl font-bold text-white mb-3" style={h}>Como o simulador calcula</h2>
            <ul className="space-y-2 text-sm">
              <li><strong className="text-white">Ritmo por ano de treino efetivo</strong> (em % da massa magra): 14% no 1º ano, 7% no 2º, 3,5% no 3º e 1,5% depois — o modelo prático de Lyle McDonald. A literatura sustenta a forma da curva, não os números exatos; mulheres, metade, com base mais fraca.</li>
              <li><strong className="text-white">Três cenários:</strong> conservador (50% da curva), consistente (100%) e muito bem executado (130%, próximo ao modelo de Aragon usado na Calculadora de Potencial Natural). &ldquo;Muito bem executado&rdquo; quer dizer treino, alimentação, sono e aderência — nada além disso.</li>
              <li><strong className="text-white">Freio perto da referência:</strong> nas últimas 1,5 unidade de FFMI normalizado antes de 24, 25 ou 26 (homens; 21, 22 ou 23 para mulheres, conforme o cenário), o ritmo cai até zero. A referência varia porque as pessoas variam.</li>
              <li><strong className="text-white">Consistência e frequência</strong> reduzem o ritmo e o quanto do tempo conta como treino. Os fatores são classificação interna.</li>
              <li><strong className="text-white">Estágios</strong> (iniciante a referência de elite) são classificação interna do simulador, por FFMI normalizado.</li>
              <li>Nada é enviado a servidor: o cálculo roda no seu navegador, e o analytics registra só cliques.</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">Fontes: Kouri et al., Clin J Sport Med, 1995; Deurenberg et al., Br J Nutr, 1991; Schoenfeld et al., Sports Med, 2016, e J Sports Sci, 2019; Fields et al., J Sports Sci, 2019 (FFMI em mulheres atletas); modelo de McDonald (prático, não revisado por pares).</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="quanto-tempo-shape" />
          </div>

          <p className="text-gray-500 text-xs">Por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer. Estimativa educacional por faixas; não é diagnóstico nem promessa de resultado.</p>
        </div>
      </section>
    </>
  );
}
