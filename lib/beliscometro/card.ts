/**
 * Card compartilhável desenhado no próprio navegador (Canvas), sem
 * biblioteca: 1080×1920 (Stories) ou 1080×1080 (feed). Os dados nunca saem
 * do aparelho — a imagem é gerada aqui e entregue ao compartilhamento nativo
 * ou baixada.
 */
export type Formato = "story" | "quadrado";
export type Bloco =
  | { tipo: "rotulo"; texto: string }
  | { tipo: "valor"; texto: string; emoji?: string }
  | { tipo: "grande"; texto: string }
  | { tipo: "frase"; texto: string }
  | { tipo: "emojis"; texto: string }
  | { tipo: "espaco" };

const OURO = "#BA9E50";

function quebra(ctx: CanvasRenderingContext2D, texto: string, largura: number): string[] {
  const linhas: string[] = [];
  for (const par of texto.split("\n")) {
    let atual = "";
    for (const p of par.split(" ")) {
      const t = atual ? `${atual} ${p}` : p;
      if (ctx.measureText(t).width > largura && atual) { linhas.push(atual); atual = p; } else atual = t;
    }
    linhas.push(atual);
  }
  return linhas;
}

export async function desenharCard(formato: Formato, titulo: string, blocos: Bloco[], assinatura: string): Promise<Blob> {
  const W = 1080, H = formato === "story" ? 1920 : 1080;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#151209"); g.addColorStop(1, "#000");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = OURO; ctx.fillRect(90, formato === "story" ? 180 : 90, 120, 6);

  const serif = "Georgia, 'Times New Roman', serif";
  const sans = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  const L = 90, larg = W - 180;
  let y = formato === "story" ? 260 : 160;
  const esc = formato === "story" ? 1 : 0.8;

  ctx.fillStyle = OURO; ctx.font = `600 ${30 * esc}px ${sans}`;
  ctx.fillText(titulo.toUpperCase().split("").join(" "), L, y); y += 70 * esc;

  for (const b of blocos) {
    if (b.tipo === "espaco") { y += 36 * esc; continue; }
    if (b.tipo === "rotulo") { ctx.fillStyle = "#9ca3af"; ctx.font = `500 ${30 * esc}px ${sans}`; ctx.fillText(b.texto.toUpperCase(), L, y); y += 52 * esc; continue; }
    if (b.tipo === "valor") { ctx.fillStyle = "#fff"; ctx.font = `700 ${54 * esc}px ${sans}`; ctx.fillText(`${b.emoji ? b.emoji + " " : ""}${b.texto}`, L, y); y += 86 * esc; continue; }
    if (b.tipo === "grande") { ctx.fillStyle = OURO; ctx.font = `700 ${110 * esc}px ${serif}`; ctx.fillText(b.texto, L, y + 40 * esc); y += 160 * esc; continue; }
    if (b.tipo === "emojis") { ctx.font = `${90 * esc}px ${sans}`; ctx.fillText(b.texto, L, y + 40 * esc); y += 140 * esc; continue; }
    ctx.fillStyle = "#e5e7eb"; ctx.font = `italic 600 ${48 * esc}px ${serif}`;
    for (const l of quebra(ctx, b.texto, larg)) { ctx.fillText(l, L, y); y += 64 * esc; }
    y += 20 * esc;
  }

  ctx.fillStyle = "#fff"; ctx.font = `700 ${34 * esc}px ${sans}`;
  ctx.fillText("MONTINHO", L, H - (formato === "story" ? 190 : 110));
  ctx.fillStyle = "#9ca3af"; ctx.font = `500 ${26 * esc}px ${sans}`;
  ctx.fillText(assinatura, L, H - (formato === "story" ? 145 : 72));
  return new Promise((ok, erro) => c.toBlob((b) => (b ? ok(b) : erro(new Error("canvas"))), "image/png"));
}

/** Compartilha a imagem pelo menu nativo; sem suporte, baixa o PNG. */
export async function compartilharImagem(blob: Blob, nome: string, texto: string): Promise<"nativo" | "download"> {
  const arquivo = new File([blob], nome, { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [arquivo] })) {
    try { await nav.share({ files: [arquivo], text: texto }); return "nativo"; } catch { /* cancelado: cai no download */ }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return "download";
}
