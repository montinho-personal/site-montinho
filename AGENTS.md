<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Toda mudança no site é conferida no navegador

Regra pedida pelo Montinho em 25/11/2026, para **toda** ação no site
(artigo novo, revisão, seção, título, ferramenta, componente, página de
serviço, correção). Não é opcional e não depende de ele pedir. A tarefa só
termina quando os seis passos passaram:

1. **Abrir o site no navegador.** Cada página que a mudança tocou, de
   verdade, no Chromium (Playwright), não só `curl`.
2. **Testar botões e funcionalidades.** Calculadoras e formulários
   preenchidos e enviados, botões clicados, links internos respondendo,
   botões do WhatsApp com link válido (wa.me ou `/l/`).
3. **Verificar a versão mobile.** Mesma conferência no celular (iPhone 13):
   sem rolagem lateral, nada sobreposto, e olhar o print do topo.
4. **Executar testes automatizados.** `npx tsc --noEmit -p .` e os testes
   de `scripts/` do que foi tocado, comparando com as falhas de base.
5. **Identificar erros e corrigi-los.** Erro de JavaScript, pedido do
   próprio site com 4xx/5xx, imagem quebrada, link quebrado, página sem
   título ou descrição, mais de um `<h1>`, vazamento no celular.
6. **Repetir os testes após as correções**, até passar tudo.

Como fazer (passos 1, 2, 3 e 5 de uma vez):

```bash
# depois do deploy, no site no ar (slug vira /blog/<slug>; caminho com / vale para qualquer página)
node scripts/conferir-no-navegador.mjs <slug> /ferramentas/<ferramenta> ...
# antes do deploy, contra o servidor local
BASE=http://localhost:3000 node scripts/conferir-no-navegador.mjs <slug>
```

O script abre cada página no computador e no celular, rola até o fim,
preenche os campos, clica nos botões, confere os links internos e tira
dois prints (topo e depois dos cliques). Ele bloqueia analytics, o registro
de lead do WhatsApp e a IA, para a conferência não sujar o CRM nem os
números. Recurso externo barrado pela rede do ambiente (YouTube, Google
Ads) aparece como aviso `!`, não como erro do site. Sai com código 1 se
achar problema.

Na resposta final ao Montinho, diga que a conferência foi feita, quantas
páginas, e o que foi achado e corrigido (ou "tudo certo"). Se algo não
pôde ser conferido, diga o quê e por quê.

# Rotina diária de auditoria das ferramentas: 2 por dia

Pedido do Montinho em 26/11/2026. Todo dia, uma tarefa agendada audita
**2 ferramentas** de `/ferramentas`, na ordem da fila de
`docs/ferramentas/auditoria-diaria.md` (as mais vistas primeiro).

**Por que 2 por dia (decisão de ritmo):** cada ferramenta exige refazer as
contas à mão contra a fonte e julgar o que é erro; o teto é a qualidade da
conferência, não o Google.

**Os sete passos, para cada ferramenta:**

1. **Abrir o site no navegador** (página da ferramenta no ar).
2. **Testar botões e funcionalidades:** todos os campos, botões, abas,
   compartilhar, copiar, e os casos de borda (campo vazio, zero, valor
   absurdo, vírgula e ponto decimal, mínimo e máximo).
3. **Verificar a versão mobile** (iPhone 13): sem rolagem lateral, nada
   sobreposto, teclado numérico nos campos de número, resultado visível
   sem caçar.
4. **Executar testes automatizados:** `tsc` e o teste da ferramenta em
   `scripts/` (comparando com as falhas de base). Se a ferramenta não tem
   teste, criar um com os casos conferidos no passo 5.
5. **Verificar se as contas estão 100% corretas:** pelo menos 5 casos
   (típico, mínimo, máximo e dois de borda) recalculados de forma
   independente a partir da fonte primária da fórmula (artigo original,
   Compêndio de Atividades Físicas, diretriz oficial), e comparados com o
   que a tela mostra, incluindo arredondamento e unidade. Conferir também
   se a fonte citada na página é a que o código usa.
6. **Identificar erros e corrigi-los.** Erro de conta, de arredondamento,
   de unidade, de texto que contradiz o número, de botão ou de layout é
   corrigido na hora, com teste que trava o caso. Mudança de fórmula ou de
   referência (trocar a equação, não só corrigir um erro) vai como
   proposta ao Montinho, não direto.
7. **Repetir os testes após as correções**, no navegador (computador e
   celular) e nos automatizados, até passar tudo.

**Especialistas (um subagente por papel, com leitura independente):**

- **Engenheiro de QA:** roda `scripts/conferir-no-navegador.mjs` e testa à
  mão, com Playwright, os fluxos e os casos de borda no computador e no
  celular, olhando os prints.
- **Especialista da área da ferramenta** (fisiologista do exercício para
  gasto calórico, FC, 1RM e corrida; nutricionista esportivo para
  proteína, macros, creatina, cafeína e calorias de alimentos; estatístico
  ou avaliador físico para composição corporal): recebe só a página e a
  fonte, **sem ver o código**, refaz as contas à mão e devolve os valores
  esperados. A comparação com o código é feita depois, para a conferência
  não herdar o erro.
- **Revisor de código:** lê o motor da ferramenta em `lib/` atrás de
  arredondamento, unidade, limite e divisão por zero.

**Regras que continuam valendo:** a ferramenta entrega a informação antes
do CTA; sem dieta prescrita; sem promessa de resultado; fato e fórmula só
com fonte. Correção de conta ou de texto que muda o que o leitor aprende
não tem `updatedAt` (páginas de `app/`), mas entra no registro.

**Publicação:** PR único do dia, merge, conferência no navegador de novo
no ar, linha da fila preenchida (data e resultado) e entrada no "Registro"
do mesmo arquivo. No fim, mandar ao Montinho, curto: as 2 ferramentas, o
que foi conferido, as contas refeitas (caso, esperado, mostrado), o que
foi corrigido e o que espera decisão dele.

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
Montinho a pesquisa do termo principal. Não comece a escrever sem ela, a
não ser que ele diga para seguir sem.

Formato preferido (desde 08/10/2026):

1. o **export do Answer the Public** do termo (CSV de palavras-chave e
   XLSX de "As pessoas também perguntam"). Ele substitui os prints do
   autocompletar, do "As pessoas também perguntam" e do "Outras pessoas
   pesquisaram", e ainda traz volume e CPC;
2. **um print da primeira página** de resultados do Google, de
   preferência numa aba anônima, incluindo a visão geral por IA. O export
   não mostra quem já ranqueia nem o que essas páginas cobrem.

Sem o export, os 4 prints continuam valendo: autocompletar, primeira
página, "As pessoas também perguntam" e "Outras pessoas pesquisaram".

Ao ler o export: arquivos duplicados contam uma vez; volume baixo não é
motivo para descartar uma pergunta que caiba no tema; termos com nome de
outro profissional, de academia onde o atendimento não é confirmado ou de
intenção de quem quer ser personal (salário, CLT) ficam de fora.

Como usar:

- As sugestões, perguntas e buscas relacionadas (do export ou dos prints) decidem **título, H2 e FAQ**. Cada
  pergunta real que couber no tema vira seção ou pergunta do FAQ.
- Os resultados mostram o que já ranqueia: cubra o que eles cobrem e
  acrescente o que falta (dado verificado, ferramenta, experiência de quem
  atende).
- Intenção que não cabe na página vira sugestão de pauta, não um parágrafo
  enfiado.
- Print não é fonte. A visão geral por IA e o snippet mostram o que as
  pessoas querem saber, mas fato só entra com fonte oficial ou dois veículos
  independentes, como em qualquer outro conteúdo.

## O que ficou de fora vira candidato a pauta

Regra pedida pelo Montinho em 16/11/2026, para todo artigo novo ou revisado
com pesquisa (SerpApi, export ou prints). No fim da tarefa, sem ele precisar
pedir:

1. Junte as buscas marcadas com ❌ (fora do tema da página).
2. Compare cada uma com o acervo, normalizando hífen e acento (slug, título
   e páginas de `app/`), como na checagem de canibalização.
3. Separe em três grupos: **vale um artigo** (o site não cobre e cabe no
   que o Montinho faz), **vira seção ou FAQ de um artigo existente** (diga
   qual) e **não cabe** (pessoa, marca, promessa, outro serviço, nada a ver),
   com o motivo de cada uma.
4. As que valem artigo entram em `docs/seo/pauta.md` com a busca de origem,
   a data e o porquê, na ordem em que você faria. Volume do Planejador ajuda
   a ordenar quando der para consultar; volume baixo não descarta.
5. Na resposta final, mande essa separação junto com as intenções de busca.
6. Mantenha `docs/seo/pauta.md` como a lista única do site: ao publicar um
   item da pauta ou revisar um artigo da fila, risque a linha e anote o slug.

Pauta é sugestão: nada é escrito sem o Montinho escolher.

# Rotina diária de revisão: 1 por dia

Pedido do Montinho em 16/11/2026; reduzido de 2 para 1 revisão por dia em
26/11/2026, para a soma dos sites caber na cota do SerpApi. Todo dia, uma
tarefa agendada revisa **1 artigo** com pesquisa do SerpApi, aplica **2
itens** de "Viram seção ou FAQ de um artigo que já existe" (desde
18/11/2026) e alimenta a pauta.

**Por que 1 por dia (decisão de ritmo):** cada revisão exige julgamento
por item (o que entra, o que sai, fonte de cada dado), e a cota do SerpApi
é uma só para todos os sites do Montinho (plano pago desde 16/11/2026,
1.000 buscas por mês; o orçamento somado das rotinas está no CLAUDE.md,
"Pesquisa no Google pelo SerpApi"). Não é medo de penalidade do Google.

**Ordem:** primeiro a fila de "Revisões pendentes" de `docs/seo/pauta.md`
(artigos publicados sem pesquisa). Quando a fila acabar, os artigos com
impressão no Search Console e CTR baixo ou posição entre 5 e 20 (consulta
pelo Supermetrics, dos últimos 28 dias), um de cada vez.

**Orçamento de busca por revisão:** a busca principal (página + 
autocompletar = 2), mais 1 se a visão de IA vier em duas etapas. Busca
secundária só se a principal vier fraca (sem PAA e sem outras pesquisas).
Não repetir busca já feita. Se o SerpApi responder sem cota, com limite
de requisições ou fora do ar, pare e avise o Montinho; não peça print sem
ele concordar.

**Cada revisão segue o fluxo inteiro:** canibalização, fontes (fato só com
fonte oficial ou dois veículos), H2 e FAQ do que as pessoas buscam,
`updatedAt` só com mudança real, evidência em `docs/seo/serp/`, registro
em `docs/seo/teste-intencoes-de-busca.md` e a separação do que ficou de
fora (vale artigo, vira seção, não cabe) atualizando `docs/seo/pauta.md`.
Título e descrição: só proposta (ATUAL / PROPOSTA / MOTIVO), nunca troca
sem o Montinho aprovar.

**Mais 2 itens de "Viram seção ou FAQ" por dia** (pedido do Montinho em
18/11/2026). Além da revisão, aplique 2 itens da seção 2 de
`docs/seo/pauta.md`, os de maior volume primeiro: a seção ou o FAQ entra
no artigo indicado, com a pesquisa que já está registrada (sem busca nova
no SerpApi). Mesmo critério de qualquer conteúdo: fato só com fonte,
`updatedAt` com a data do dia (é mudança real), sem dieta. Se a pesquisa
mostrar que o assunto pede artigo próprio (a linha diz quando), não
aplique: mova para "Artigos novos" e pegue o próximo. Risque a linha com a
data e registre em `docs/seo/teste-intencoes-de-busca.md`. Entra no mesmo
PR das revisões.

**Publicação:** testes do repositório (tsc e os testes do que foi tocado,
comparando com as falhas de base), PR, merge e a conferência no navegador
(regra "Toda mudança no site é conferida no navegador", no computador e no
celular, com `scripts/conferir-no-navegador.mjs`). No fim,
mandar ao Montinho os links (das revisões e dos 2 itens aplicados), as
intenções separadas por tipo com ✅/❌ e as propostas de título que esperam
aprovação.

# Capa de artigo: só no padrão, ou nenhuma

Regra pedida pelo Montinho em 16/11/2026 e trocada por ele em 25/11/2026
("Quero que crie no nosso padrão do site"). A capa do blog segue um padrão
só, **vetorial, feita no código, sem gerar imagem paga**: papel creme
(#F1E6CC), título em duas linhas em letra condensada (primeira em vermelho
#D8402A, segunda em preto #151515), subtítulo curto de uma linha, três
etiquetas mostarda (#E0A82E) com rótulo, um desenho simples em formas
chapadas nas mesmas cores à direita, sem encostar no título, e o logo do
site em preto no canto inferior direito. Sem pessoa real e sem marca de
terceiros.

- Formato: 1536 × 1024, em WebP, salvo em
  `public/blog-images/<slug>-capa.webp`. O HTML da capa é renderizado no
  Chromium (Playwright) e o logo é composto por cima com o sharp; os
  scripts usados até aqui seguem esse modelo.
- Antes de publicar, olhe a capa: título, subtítulo e etiquetas não podem
  se sobrepor, e o desenho não pode encostar no texto nem no logo.
- Nada de capa só tipográfica sem desenho nem imagem de outro artigo. Se
  não der para fazer no padrão, o artigo sai sem a tag `<img>` de capa (o
  compartilhamento usa o `og-image.jpg` padrão) e o slug entra em "Capas
  pendentes" de `docs/seo/pauta.md`.
- Kairogen não entra na capa; imagem paga só quando o Montinho pedir.
  Trocar ou acrescentar a capa não muda o `updatedAt`.

# Evento com resultado: página pronta antes, atualizada no dia

Regra pedida pelo Montinho em 25/11/2026. Toda prova ou evento que o site
cobre e que tem resultado (corrida, Hyrox, luta) ganha uma página
`resultado-<evento>-<ano>` publicada **semanas antes**, para já estar
indexada quando a busca explodir no dia. Modelo: `resultado-maratona-de-brasilia-2026`
e `resultado-sao-silvestre-2026`.

- Antes do evento a página já é útil: data e local, resultado da edição
  anterior como referência, recorde, como consultar o resultado individual
  e link para os guias da prova. Os campos do resultado ficam como
  "aguardando a prova (data)", sem palpite nem favorito sem fonte.
- No dia, uma tarefa agendada (one-shot, criada junto com a página)
  preenche vencedores e tempos com fonte oficial ou dois veículos, troca o
  aviso do topo, atualiza o FAQ e o `updatedAt`. Classificação ainda
  extraoficial entra marcada como tal. Se não houver fonte suficiente,
  não publica e tenta de novo na tarefa seguinte.
- Não se cria página nova no dia do resultado: só se atualiza a que já
  existe.

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

## Título e descrição: confirmar e deixar uma pergunta aberta

Regra pedida pelo Montinho em 21/10/2026, para toda proposta de título e
descrição daqui em diante (continua valendo o ATUAL / PROPOSTA / MOTIVO).

- **Título com as palavras que as pessoas digitam.** Tire os termos do
  autocompletar, do PAA e do export (ex.: "mensalidade", "aceita Gympass",
  "telefone"). Termo que não aparece na pesquisa ("vale a pena", "análise
  honesta") sai do título.
- **Descrição confirma em 1 segundo e deixa a pergunta aberta.** Dê o fato
  que mostra que a página é a certa (endereço, 24h, aceita Wellhub) e deixe
  para a página o que a pessoa ainda quer saber (qual plano, mensalidade,
  diária, se vale a pena). Não entregar a resposta inteira na descrição.
- **Por que o fato não rouba o clique:** em busca de nome de lugar, o
  Google já mostra endereço e horário no perfil do Maps. Quem só queria
  isso não clicaria de qualquer jeito; a descrição vaga é a que perde o
  clique de quem ainda tem dúvida. E fato verificado na página é o que a
  visão geral por IA cita.
- **Sem promessa nem número sem fonte** na descrição: mesmo critério do
  texto.
- **Medir:** registrar a linha de base do GSC (impressões, cliques,
  posição da página) no dia da troca e comparar em 28 dias. Se o clique
  não subir, voltar.

## O Montinho não passa dieta

Regra pedida pelo Montinho em 15/11/2026. Nenhum texto do site pode dizer
ou sugerir que ele passa dieta, plano alimentar, cardápio, estratégia
nutricional, orientação de macros ou "plano de treino e alimentação". O
serviço é treino; a alimentação é com o nutricionista, e o treino caminha
junto com o plano dele. Pode falar de rotina, sono e constância, e os
artigos podem continuar explicando nutrição em termos gerais (déficit,
proteína, calculadoras), desde que não apresentem isso como algo que ele
prescreve. Ao escrever CTA de consultoria, use "treino", não "treino e
dieta".

## Não citar CREF, CONFEF nem Educação Física

Regra do Montinho, reforçada em 15/11/2026. Nenhum texto do site cita CREF,
CONFEF, "conselho regional/federal" ou "Educação Física" como credencial
(graduação, formação, profissional de Educação Física), nem em checklist.
Quando o texto precisa da ideia, use algo genérico: "pergunte sobre a
formação e a história de vida do profissional"; para nomear quem orienta o
treino, "personal trainer". A Lei nº 9.696/1998 pode ser citada sem nomear
a área. Lembrança de escola ("aula de educação física") não é credencial e
pode ficar.

## Locais de atendimento: guia de academia ≠ local confirmado

Atendimento presencial confirmado: **Arena 18**, condomínios e em casa.
Outras academias só "dependendo das regras do local para personal
externo e de combinação prévia". Nunca afirmar que o Montinho atende em
Ironberg, Bodytech, Bio Ritmo, Smart Fit, Bluefit, Gaviões, NitroGym ou
qualquer outra academia só porque existe um guia dela no site — os guias
são informativos e de SEO.

# Relatórios de dados: auditoria obrigatória

Todo relatório com números (GA4, Search Console, Google Ads, CRM) passa
pelo checklist de `docs/relatorios/auditoria-de-dados.md` antes de ser
enviado ao Montinho, e sai com um quadro "Auditoria dos dados" dizendo o
que foi conferido, o que foi corrigido e os limites. Os totais precisam
bater com uma consulta direta à fonte. Relatório sem auditoria não é
enviado, e nada é chamado de "confirmado" sem ter sido checado na fonte.

# Vídeo pronto: pacote de postagem, sempre em bloco de copiar e colar

Regra pedida pelo Montinho em 12/11/2026. Todo vídeo entregue para postar
sai junto com o pacote de postagem, sem ele precisar pedir:

- título, descrição e tags, cada um num bloco de código (copiar e colar);
- a descrição já com o **link rastreado** (`/l/<código>`), nunca o link cru
  da página. Um código por vídeo e por rede (`yt-`, `ig-`, `wa-`),
  cadastrado em `lib/crm/links.ts` e publicado ANTES de mandar o link — um
  `/l/` que ainda não está no ar não registra clique;
- a capa (embutida no primeiro quadro e em arquivo separado).

Vale para qualquer texto que ele vá colar em outro lugar (legenda, roteiro
de teleprompter, mensagem de WhatsApp): sempre em bloco de código.

# Aviso ao Bing (IndexNow) é automático

A cada push para `main`, o workflow `.github/workflows/indexnow.yml` espera
o deploy subir e roda `scripts/indexnow.ts` com o commit anterior e o novo.
O script pega só as páginas que mudaram (artigo pelo trecho alterado em
`lib/*.ts`, página pelo `app/**/page.tsx`), filtra pelo sitemap e avisa o
Bing, que alimenta a busca do ChatGPT. Mudança de componente não gera aviso.
Para conferir, veja a aba Actions do repositório (resposta 200 ou 202).
