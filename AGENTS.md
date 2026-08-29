<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Artigos novos: a decisão de ferramenta é obrigatória

Todo artigo publicado a partir de 2026-08-29 precisa passar por uma decisão
explícita sobre ferramenta. A regra não é "todo artigo precisa de
ferramenta" — é que a decisão precisa estar registrada em algum lugar, em
vez de depender de alguém lembrar de perguntar.

Ao publicar um artigo novo:

1. Pergunte se o leitor termina o texto com uma conta na cabeça.
2. Se sim, registre no registro da ferramenta que responde essa conta.
   Vários registros têm teto de oito artigos, garantido por um teste de
   seletividade — quando o teto estiver cheio, use a variante de LINK, que
   existe para 1RM e volume.
3. Se não, registre o slug em `ARTIGOS_SEM_FERRAMENTA`
   (`lib/ferramentas/cobertura.ts`) com uma frase dizendo por quê.

`scripts/cobertura-test.ts` reprova qualquer artigo novo que não esteja nem
num registro nem na lista de dispensados.

## Antes de escrever, verificar canibalização

Compare o tema com o acervo NORMALIZANDO hífen e acento antes de comparar.
Buscar `"trocar de treino"` não encontra o slug `quando-trocar-o-treino`, e
foi assim que uma duplicata chegou a ser publicada. O mesmo tipo de falso
negativo já escondeu `hipotireoidismo-e-musculacao` e
`hipertrofia-apos-os-40-anos` de uma varredura.
