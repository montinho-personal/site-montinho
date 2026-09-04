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

## Toda tarefa em lote passa por uma decisão de ritmo

Antes de executar qualquer trabalho que toque muitos artigos ou páginas,
decida explicitamente se vai de uma vez ou dividido em dias — e diga por
quê. A decisão vem antes da execução, não depois.

### O motivo quase nunca é penalidade do Google

O que o Google penaliza é conteúdo gerado em massa sem valor, esquema de
links, doorway page e cloaking. Editar os próprios artigos que já existem
não está nessa lista, e não há teto de "quantos artigos por dia" na
documentação dele. Fatiar por medo de penalidade é superstição, e custa
caro: o FAQ de 834 artigos era uma mudança de componente, e dividir em 2
por dia teria deixado o site com dois comportamentos por mais de um ano
sem reduzir risco nenhum.

Os dois motivos legítimos para dividir são outros:

1. **Atribuição.** Se o efeito só aparece semanas depois no Search Console
   e as mudanças são heterogêneas, um lote grande impede saber o que
   causou o quê. Vale para título e descrição, que mexem em CTR.
2. **Julgamento por item.** Se cada item exige uma decisão editorial
   (qual fonte cabe aqui, o que essa imagem mostra, para onde este link
   aponta), o teto é a qualidade da decisão, não o Google.

### As três perguntas

1. **É uma mudança ou são N mudanças?** Um componente que passa a
   renderizar em 834 artigos é UMA mudança: um deploy, um revert. Vai de
   uma vez. N edições de texto diferentes são N mudanças.
2. **Se der errado, dá para saber qual foi?** Se não der, divida até dar,
   e registre o estado anterior do que mudou.
3. **Cada item precisa de julgamento?** Se precisa, o ritmo é o quanto se
   decide bem por dia. Se não precisa, o lote pode ser grande.

### O que NÃO justifica fatiar

Mudança de template ou componente; correção mecânica sem julgamento
(rasterizar um SVG que já existe, trocar um número de telefone errado);
qualquer coisa revertível num commit. Nesses casos, fatiar só adianta o
custo e adia o benefício.

Quando o lote for grande mas a revisão humana for difícil, divida em PRs
menores — isso é limite de revisão, não de SEO, e deve ser dito assim.
