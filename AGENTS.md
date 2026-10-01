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

# A identidade do Montinho entra onde houver contexto

Uma ideia faz parte do que o Montinho prega, e cabe em qualquer lugar do
site com contexto para ela — home, artigo, ferramenta, página de serviço:

> Nunca se compare com os outros: cada um tem a própria genética, rotina e
> história, com altos e baixos. O mais importante é encontrar um estilo de
> treino e um protocolo que dê para seguir pelo resto da vida, com aderência
> e progressão. Quem faz isso não tem como dar errado — ele é a prova viva e
> vive isso com os alunos todo santo dia.

Não reescreva isso do zero. Use o que já existe em `lib/filosofia.ts`:

- `NotaMetodo` (com `pickFilosofia`) ao pé de conteúdo, na rotação de
  variantes — a variante `comparacao` carrega essa ideia com o link do
  acompanhamento;
- `FECHAMENTO_COMPARACAO` no fim de uma ferramenta, logo antes do CTA,
  quando a pessoa acabou de receber um número que pode virar expectativa
  ou comparação. O Simulador de Emagrecimento é o modelo.

É a isca natural do CTA para o WhatsApp: primeiro a ideia, depois o botão.

# Toda página nova começa pelas intenções de busca do Google

Antes de escrever qualquer artigo, página de serviço ou ferramenta, peça ao
Montinho os prints da pesquisa no Google para o termo principal. Não comece
a escrever sem eles, a não ser que ele diga para seguir sem.

Peça, de preferência numa aba anônima:

1. o **autocompletar** da caixa de busca (as sugestões enquanto digita);
2. a **primeira página** de resultados, incluindo a visão geral por IA;
3. o bloco **"As pessoas também perguntam"**;
4. o bloco **"Outras pessoas pesquisaram"**, no fim da página.

Como usar:

- As sugestões e buscas relacionadas decidem **título, H2 e FAQ**. Cada
  pergunta real que couber no tema vira seção ou pergunta do FAQ.
- Os resultados mostram o que já ranqueia: cubra o que eles cobrem e
  acrescente o que falta (dado verificado, ferramenta, experiência de quem
  atende).
- Intenção que não cabe na página vira sugestão de pauta, não um parágrafo
  enfiado.
- Print não é fonte. A visão geral por IA e o snippet mostram o que as
  pessoas querem saber, mas fato só entra com fonte oficial ou dois veículos
  independentes, como em qualquer outro conteúdo.

# Data de atualização: só quando o conteúdo muda de verdade

Todo artigo do blog editado de forma substancial (seção nova, FAQ nova,
dado corrigido, resultado lançado) recebe `updatedAt` com a data do dia no
mesmo commit. É o que alimenta o `dateModified` do schema, o `lastModified`
do sitemap e o "Atualizado em" visível na página.

Não atualize a data por mudança que não altera o que o leitor aprende: título
e descrição, componente ou cartão de ferramenta renderizado em lote, correção
de link, formatação. O Google trata data trocada sem mudança real como sinal
enganoso e passa a ignorar o campo no site inteiro.

Páginas em `app/` usam `lastModified: new Date()` no sitemap (muda a cada
build), então esse sinal nelas é fraco; o que conta é o conteúdo novo.

# Posicionamento: personal trainer que conduz, não que entrega ficha

Desde 01/10/2026 a marca comunica: montar o treino é o começo;
acompanhar o que acontece depois é o trabalho. Regras para toda copy:

- **Ferramentas e simuladores:** a ferramenta entrega a informação
  primeiro; depois, e só depois, vem a ponte humana ("esse número é um
  ponto de partida… quer ajuda para transformar isso em um plano para
  você?"). Nunca CTA agressivo antes do resultado.
- **Continua sendo personal trainer.** Sem discurso de coach
  motivacional ("melhor versão", "desbloqueie seu potencial"), sem
  linguagem clínica, sem promessa de resultado. O diferencial é
  acompanhar a execução, observar a resposta, ajustar e ajudar a
  construir constância. O aluno também tem responsabilidade: é Montinho
  + aluno trabalhando juntos, nunca "a culpa não é sua".
- **Mostrar, não repetir.** Não espalhar "transformação",
  "acompanhamento", "processo" e "estratégia" em todo bloco. Preferir
  situações concretas — "você faltou", "a carga parou de subir", "um
  exercício não encaixou", "sua rotina mudou", "seu desempenho caiu",
  "você está evoluindo mais rápido" — e mostrar alguém percebendo e
  decidindo.
- **SEO primeiro, narrativa ao redor.** Não mexer em URL, slug, H1
  estratégico, title/description sem mostrar ATUAL / PROPOSTA / MOTIVO.
- **Página por página**, com aprovação do Montinho entre uma e outra.

## Locais de atendimento: guia de academia ≠ local confirmado

Atendimento presencial confirmado: **Arena 18**, condomínios e em casa.
Outras academias só "dependendo das regras do local para personal
externo e de combinação prévia". Nunca afirmar que o Montinho atende em
Ironberg, Bodytech, Bio Ritmo, Smart Fit, Bluefit, Gaviões, NitroGym ou
qualquer outra academia só porque existe um guia dela no site — os guias
são informativos e de SEO.
