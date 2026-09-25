import CalculadoraClassic from "@/components/classic/CalculadoraClassic";
import PainelBrasil from "@/components/olympia/PainelBrasil";

/**
 * O corpo do artigo, com ferramentas embutidas no ponto exato do texto.
 *
 * O conteúdo continua HTML; onde houver um marcador
 * <!--CALCULADORA_CLASSIC:completa|compacta--> o componente real entra no
 * lugar dele. <!--PAINEL_BRASIL:olympia--> faz o mesmo com o painel dos
 * brasileiros no Mr. Olympia. Sem marcador, é só a mesma div de sempre — nada muda nos
 * outros mil artigos.
 */
const MARCADOR = /<!--(?:CALCULADORA_CLASSIC|PAINEL_BRASIL):(completa|compacta|olympia)-->/;

export default function Prosa({ html, slug }: { html: string; slug: string }) {
  if (!MARCADOR.test(html)) return <div className="prose-blog" dangerouslySetInnerHTML={{ __html: html }} />;
  const partes = html.split(new RegExp(MARCADOR.source, "g"));
  // split com grupo: [texto, variante, texto, variante, texto...]
  return (
    <>
      {partes.map((p, i) =>
        i % 2 === 0 ? (
          p.trim() ? <div key={i} className="prose-blog" dangerouslySetInnerHTML={{ __html: p }} /> : null
        ) : (
          <div key={i} className="my-8">
            {p === "olympia" ? <PainelBrasil /> : <CalculadoraClassic variante={p as "completa" | "compacta"} placement={`artigo-${slug}`} />}
          </div>
        ),
      )}
    </>
  );
}
