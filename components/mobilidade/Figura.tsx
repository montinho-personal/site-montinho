import type { Figura } from "@/lib/mobilidade/figuras";

/**
 * Renderiza uma figura didática dos testes.
 *
 * Componente de servidor, zero JavaScript, alguns kilobytes por desenho — o
 * oposto do custo de um vídeo incorporado, e a ferramenta já é a página mais
 * interativa do site.
 *
 * Três regras de leitura guiaram o desenho:
 *
 *   1. O corpo é cinza. A única coisa colorida é o ponto que decide se o teste
 *      vale. Onde tudo tem cor, nada tem destaque.
 *   2. Verde é "assim", laranja é "assim não" — a mesma escala do mapa de
 *      resultado, então a pessoa não aprende duas linguagens de cor.
 *   3. Cor nunca carrega a informação sozinha: cada figura tem título escrito
 *      ("Assim" / "Assim não"), rótulos com seta e um texto alternativo
 *      completo. Quem não distingue as cores lê a mesma coisa.
 */

const CINZA = "#6B6B70";
const VERDE = "#6FA86B";
const LARANJA = "#D08A3E";

export default function FiguraTeste({
  figura,
  compacta = false,
}: {
  figura: Figura;
  /**
   * Modo compacto: a figura do exercício, pequena ao lado do texto do card.
   * Aqui o título vira o texto alternativo e some da tela — o nome do
   * exercício já está a dois centímetros de distância, e repeti-lo embaixo do
   * desenho seria ruído num espaço que não sobra.
   */
  compacta?: boolean;
}) {
  const cor = figura.tipo === "certo" ? VERDE : LARANJA;

  return (
    <figure className="m-0">
      {!compacta && (
        <figcaption
          className="text-[11px] tracking-[0.14em] uppercase mb-2 flex items-center gap-2"
          style={{ color: cor, fontFamily: "var(--font-inter), sans-serif" }}
        >
          <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: cor }} />
          {figura.titulo}
        </figcaption>
      )}

      <svg
        viewBox="0 0 100 100"
        className="w-full h-auto border border-white/10 bg-black/40"
        role="img"
        aria-label={figura.alt}
      >
        {/* cenário */}
        {figura.cenario.map((c) => {
          if (c.tipo === "chao") {
            return <line key="chao" x1="6" y1="89" x2="94" y2="89" stroke="#33333A" strokeWidth="1.4" />;
          }
          if (c.tipo === "assento-cima") {
            /* Vista de cima: o assento fica ATRÁS do corpo, e por isso é
               desenhado primeiro — quem olha de cima vê a pessoa, não a
               cadeira. */
            return (
              <rect key="assento-cima" x="30" y="56" width="40" height="34" rx="1"
                fill="#141418" stroke="#2E2E34" strokeWidth="1.2" />
            );
          }
          if (c.tipo === "assento-frente") {
            /* Vista de frente: só o traço do assento e do encosto. Uma cadeira
               desenhada inteira competiria com as pernas, que são o assunto. */
            return (
              <g key="assento-frente" stroke="#2E2E34" strokeWidth="1.6" fill="none">
                <line x1="16" y1="29" x2="84" y2="29" />
                <line x1="20" y1="29" x2="20" y2="20" />
                <line x1="80" y1="29" x2="80" y2="20" />
              </g>
            );
          }
          const x = c.tipo === "parede-esq" ? 22 : 76;
          return (
            <g key={c.tipo}>
              <line x1={x} y1="6" x2={x} y2="89" stroke="#33333A" strokeWidth="1.6" />
              {[14, 26, 38, 50, 62, 74, 86].map((y) => (
                <line key={y} x1={x} y1={y}
                  x2={c.tipo === "parede-esq" ? x - 5 : x + 5}
                  y2={y + 5} stroke="#2A2A30" strokeWidth="1" />
              ))}
            </g>
          );
        })}

        {/* linha de referência, quando o critério é uma comparação */}
        {figura.referencia && (
          <line x1={figura.referencia[0]} y1={figura.referencia[1]}
            x2={figura.referencia[2]} y2={figura.referencia[3]}
            stroke="#55555C" strokeWidth="0.9" strokeDasharray="2.5 2.5" />
        )}

        {/* o corpo */}
        <g stroke={CINZA} strokeWidth="2.4" strokeLinecap="round" fill="none">
          {figura.segmentos.map((s, i) => (
            <line key={i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} />
          ))}
        </g>
        {/* A cabeça vem por último e com preenchimento opaco: na vista de cima
            ela fica SOBRE a linha dos ombros, e sem oclusão as duas viravam um
            borrão só. */}
        {figura.cabeca && (
          <circle cx={figura.cabeca.cx} cy={figura.cabeca.cy} r={figura.cabeca.r}
            fill="#0A0A0C" stroke={CINZA} strokeWidth="2.4" />
        )}

        {/* o ponto que decide o teste */}
        {figura.destaque && (
          <circle cx={figura.destaque.cx} cy={figura.destaque.cy} r="4"
            fill={cor} stroke="#0d0d0d" strokeWidth="1.2" />
        )}

        {/* a medida */}
        {figura.medida && (
          <g stroke={cor} strokeWidth="1.1" fill="none">
            <line x1={figura.medida.x1} y1={figura.medida.y - 3} x2={figura.medida.x1} y2={figura.medida.y + 2} />
            <line x1={figura.medida.x2} y1={figura.medida.y - 3} x2={figura.medida.x2} y2={figura.medida.y + 2} />
            <line x1={figura.medida.x1} y1={figura.medida.y} x2={figura.medida.x2} y2={figura.medida.y} />
            <text x={(figura.medida.x1 + figura.medida.x2) / 2} y={figura.medida.y + 6}
              fill={cor} stroke="none" fontSize="5" textAnchor="middle"
              fontFamily="var(--font-inter), sans-serif">
              {figura.medida.rotulo}
            </text>
          </g>
        )}

        {/* a seta de movimento, nas figuras de exercício */}
        {figura.movimento && (() => {
          const m = figura.movimento;
          const ang = Math.atan2(m.y2 - m.y1, m.x2 - m.x1);
          /* A ponta é desenhada à mão em vez de <marker> porque marker exige
             um id único por documento, e várias figuras convivem na mesma
             página — ids repetidos fariam uma herdar a ponta da outra. */
          const p1 = [m.x2 - 4.5 * Math.cos(ang - 0.42), m.y2 - 4.5 * Math.sin(ang - 0.42)];
          const p2 = [m.x2 - 4.5 * Math.cos(ang + 0.42), m.y2 - 4.5 * Math.sin(ang + 0.42)];
          return (
            <g>
              <line x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2}
                stroke={cor} strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
              <polygon points={`${m.x2},${m.y2} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`}
                fill={cor} opacity="0.85" />
            </g>
          );
        })()}

        {/* rótulos com seta */}
        {figura.anotacoes.map((a, i) => (
          <g key={i}>
            {a.seta && (
              <line x1={a.x + (a.ancora === "end" ? 1 : a.ancora === "middle" ? 0 : -1)}
                y1={a.y + 1.5} x2={a.seta.x} y2={a.seta.y}
                stroke="#55555C" strokeWidth="0.9" />
            )}
            <text x={a.x} y={a.y} fill="#9A968E" fontSize="5.8"
              textAnchor={a.ancora ?? "start"} fontFamily="var(--font-inter), sans-serif">
              {a.texto}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
