/**
 * A seringa desenhada — a régua, não o produto.
 *
 * É um SVG de traço, sem foto, sem marca, sem agulha em destaque: o que
 * interessa aqui é a ESCALA. A marca escolhida enche o corpo até ali e o
 * número fica grande do lado. Quem não enxerga o desenho recebe o mesmo
 * conteúdo em texto (aria-label e o <p> visualmente escondido), então a
 * informação nunca depende do gráfico nem de cor.
 *
 * A escala é a nominal de uma U-100 de 1 mL: 100 graduações, uma a cada
 * 0,01 mL, número a cada 10. Seringas reais variam (0,3 mL, 0,5 mL, meia
 * marca) — por isso o texto ao lado manda conferir a impressa no dispositivo.
 */
import { formatarMarca, formatarMl } from "@/lib/concentracao/calculo";

export default function SeringaU100({ marca, id }: { marca: number | null; id: string }) {
  const m = marca ?? 0;
  const ml = m / 100;
  // Geometria: corpo de x=40 a x=340 (300 px = 100 marcas → 3 px por marca).
  const x0 = 40, largura = 300, y0 = 34, altura = 44;
  const xMarca = x0 + (largura * m) / 100;
  const ticks = Array.from({ length: 101 }, (_, i) => i);
  /*
   * A marquinha pode vir quebrada, porque o caminho da dose prescrita não
   * arredonda: 2 mg num frasco de 16,667 mg/mL caem na 12, mas 2,5 mg caem
   * na 12,4. Mostrar "12,4" é o ponto — é assim que a pessoa vê, no desenho,
   * que a quantidade não para num risquinho, e que isso é conversa com o
   * prescritor, não arredondamento nosso.
   */
  const rotulo = marca
    ? `Seringa preenchida até a marquinha ${formatarMarca(marca)}, que corresponde a ${formatarMl(ml)} mL.`
    : "Seringa vazia. Informe a dose ou escolha uma marquinha para ver o volume correspondente.";

  return (
    <figure className="w-full" aria-labelledby={`${id}-legenda`}>
      <svg
        viewBox="0 0 400 120"
        role="img"
        aria-label={rotulo}
        className="w-full h-auto select-none"
        style={{ maxHeight: 150 }}
      >
        {/* Bico e êmbolo, só para o desenho ser lido como seringa. */}
        <rect x="8" y={y0 + altura / 2 - 6} width="32" height="12" rx="2" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
        <rect x={x0 + largura} y={y0 + 10} width="10" height={altura - 20} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
        <line x1={x0 + largura + 10} y1={y0 + altura / 2} x2="392" y2={y0 + altura / 2} stroke="rgba(255,255,255,0.45)" strokeWidth="3" strokeLinecap="round" />

        {/* Corpo */}
        <rect x={x0} y={y0} width={largura} height={altura} rx="3" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />

        {/* Conteúdo até a marca — dourado, sem verde/vermelho de propósito. */}
        {m > 0 && <rect x={x0} y={y0 + 1} width={xMarca - x0} height={altura - 2} fill="#BA9E50" fillOpacity="0.35" />}
        {m > 0 && <line x1={xMarca} y1={y0 - 6} x2={xMarca} y2={y0 + altura + 6} stroke="#BA9E50" strokeWidth="2" />}

        {/* Graduações: curta a cada 1, média a cada 5, longa e numerada a cada 10. */}
        {ticks.map((t) => {
          const x = x0 + (largura * t) / 100;
          const h = t % 10 === 0 ? 14 : t % 5 === 0 ? 9 : 5;
          return <line key={t} x1={x} y1={y0 + altura} x2={x} y2={y0 + altura - h} stroke="rgba(255,255,255,0.7)" strokeWidth={t % 10 === 0 ? 1.4 : 0.8} />;
        })}
        {ticks.filter((t) => t % 10 === 0).map((t) => (
          <text key={`n${t}`} x={x0 + (largura * t) / 100} y={y0 + altura + 16} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.75)" fontFamily="ui-sans-serif, system-ui, sans-serif">
            {t}
          </text>
        ))}

        {/* O número da marca escolhida, em cima da linha. */}
        {m > 0 && (
          <text x={Math.min(Math.max(xMarca, x0 + 14), x0 + largura - 14)} y={y0 - 12} textAnchor="middle" fontSize="13" fontWeight="700" fill="#BA9E50" fontFamily="ui-sans-serif, system-ui, sans-serif">
            {formatarMarca(m)}
          </text>
        )}
      </svg>
      <figcaption id={`${id}-legenda`} className="text-gray-400 text-xs leading-relaxed mt-1">
        {marca ? `Marquinha ${formatarMarca(marca)} = ${formatarMl(ml)} mL.` : "Régua nominal de uma seringa de insulina U-100 de 1 mL: 100 marquinhas, uma a cada 0,01 mL."}{" "}
        Confira as marcações impressas na sua seringa — nem toda seringa tem a mesma graduação.
      </figcaption>
    </figure>
  );
}
