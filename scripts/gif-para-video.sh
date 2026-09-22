#!/usr/bin/env bash
# Converte um GIF de demonstração em vídeo leve para a ferramenta de mobilidade.
#   scripts/gif-para-video.sh <entrada.gif> <id-do-exercicio> [centro-x]
#
# Gera public/mobilidade/videos/<id>.mp4 e <id>.jpg (primeiro quadro).
#
# Por que não usar o GIF direto: GIF guarda cada quadro quase inteiro e só
# tem 256 cores. O mesmo movimento em H.264 cai de megabytes para centenas de
# KB. O vídeo sai quadrado (400x400) porque o espaço no card é quadrado, sem
# áudio, e com faststart para começar a tocar antes de baixar tudo.
#
# Precisa de um ffmpeg no PATH ou na variável FFMPEG. Nesta máquina:
#   npm i ffmpeg-static  →  FFMPEG=$(node -e "console.log(require('ffmpeg-static'))")
set -euo pipefail
ENTRADA="$1"; ID="$2"; CX="${3:-}"
FF="${FFMPEG:-ffmpeg}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/public/mobilidade/videos"
mkdir -p "$DEST"
# Enquadra em quadrado sem distorcer: cabe inteiro em 400x400 e completa com
# branco, que é o fundo dos GIFs da Lyfta. Largura e altura pares são exigência do H.264.
FILTRO="scale=400:400:force_original_aspect_ratio=decrease,pad=400:400:(ow-iw)/2:(oh-ih)/2:color=0xFFFFFF,fps=24,format=yuv420p"
# Os GIFs da Lyfta vêm em 1920x1080, deitados, com a pessoa no meio. Encolher
# o quadro inteiro para caber no quadrado deixaria o corpo pequeno e cercado
# de branco. Com o centro horizontal do corpo (medido em todos os quadros, e
# não num só — o corpo se move), corta-se um quadrado de 1080 em volta dele.
# Nenhum dos cinco primeiros passava de 1052px de largura em movimento.
if [ -n "$CX" ]; then
  X=$(( CX - 540 )); [ "$X" -lt 0 ] && X=0; [ "$X" -gt 840 ] && X=840
  FILTRO="crop=1080:1080:$X:0,scale=400:400,fps=24,format=yuv420p"
fi
"$FF" -hide_banner -loglevel error -y -i "$ENTRADA" -vf "$FILTRO" -an \
  -c:v libx264 -preset slow -crf 28 -movflags +faststart "$DEST/$ID.mp4"
# WebM (VP9): cerca de 28% menor que o MP4 no CRF 50, sem diferença visível em
# 400px (e o card mostra em 78px). É o que Chrome, Android e Firefox tocam. O
# MP4 acima fica de reserva — é o que garante o iPhone.
"$FF" -hide_banner -loglevel error -y -i "$ENTRADA" -vf "$FILTRO" -an \
  -c:v libvpx-vp9 -b:v 0 -crf 50 -row-mt 1 "$DEST/$ID.webm"
"$FF" -hide_banner -loglevel error -y -i "$ENTRADA" -vf "$FILTRO" -frames:v 1 -q:v 4 "$DEST/$ID.jpg"
printf '%-24s mp4 %4s KB · webm %4s KB\n' "$ID" "$(( $(stat -c%s "$DEST/$ID.mp4") / 1024 ))" "$(( $(stat -c%s "$DEST/$ID.webm") / 1024 ))"
