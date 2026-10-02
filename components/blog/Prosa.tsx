import CalculadoraClassic from "@/components/classic/CalculadoraClassic";
import PainelBrasil from "@/components/olympia/PainelBrasil";
import Contagem from "@/components/olympia/Contagem";
import StatusCategorias from "@/components/olympia/StatusCategorias";
import ShapeCompacto from "@/components/shape/ShapeCompacto";
import type { ReferenciaId } from "@/lib/shape";
import Palpite from "@/components/palpite/Palpite";
import { GRUPOS } from "@/lib/palpites";

/**
 * O corpo do artigo, com ferramentas embutidas no ponto exato do texto.
 *
 * O conteúdo continua HTML; onde houver um marcador
 * <!--CALCULADORA_CLASSIC:completa|compacta--> o componente real entra no
 * lugar dele. O mesmo vale para o Mr. Olympia 2026:
 * <!--PAINEL_BRASIL:olympia-->, <!--OLYMPIA_STATUS:geral--> e
 * <!--OLYMPIA_CONTAGEM:<id da categoria>|brasil--> e a entrada compacta do
 * simulador de shape: <!--SHAPE:<referência>-->. Sem marcador, é só a mesma div de sempre — nada muda nos
 * outros mil artigos.
 */
const MARCADOR = /<!--(CALCULADORA_CLASSIC|PAINEL_BRASIL|OLYMPIA_STATUS|OLYMPIA_CONTAGEM|SHAPE|PALPITE):([a-z0-9-]+)-->/;

export default function Prosa({ html, slug }: { html: string; slug: string }) {
  if (!MARCADOR.test(html)) return <div className="prose-blog" dangerouslySetInnerHTML={{ __html: html }} />;
  const partes = html.split(new RegExp(MARCADOR.source, "g"));
  // split com dois grupos: [texto, tipo, arg, texto, tipo, arg, texto...]
  const out = [];
  for (let i = 0; i < partes.length; i += 3) {
    const p = partes[i];
    if (p.trim()) out.push(<div key={i} className="prose-blog" dangerouslySetInnerHTML={{ __html: p }} />);
    const tipo = partes[i + 1];
    const arg = partes[i + 2];
    if (!tipo) continue;
    out.push(
      <div key={`e${i}`} className="my-8">
        {tipo === "PAINEL_BRASIL" ? <PainelBrasil /> : tipo === "OLYMPIA_STATUS" ? <StatusCategorias /> : tipo === "OLYMPIA_CONTAGEM" ? <Contagem cat={arg} /> : tipo === "PALPITE" ? <Palpite ids={GRUPOS[arg] ?? []} /> : tipo === "SHAPE" ? <ShapeCompacto referenciaId={arg as ReferenciaId} placement={`artigo-${slug}`} /> : <CalculadoraClassic variante={arg as "completa" | "compacta"} placement={`artigo-${slug}`} />}
      </div>,
    );
  }
  return <>{out}</>;
}
