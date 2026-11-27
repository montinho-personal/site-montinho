@AGENTS.md

## Pesquisa no Google pelo SerpApi (no lugar dos prints)

Desde 16/11/2026, os dados do Google que o Renato mandava em print vêm do
**SerpApi**, buscados pelo próprio Claude no começo da tarefa. Não pedir print
ao Renato; só se o SerpApi falhar (sem cota ou fora do ar).

**Pedido de "cria o próximo artigo" ou "revisa o próximo" (regra do Renato,
16/11/2026):** começar já pela pesquisa, sem perguntar nada antes. Pegar a próxima
peça da pauta (ou a que ele nomear), definir 2 ou 3 buscas (a principal e as
secundárias do doc ou da pauta), buscar no SerpApi e seguir o fluxo inteiro deste
arquivo: fontes, texto, checagens e publicação. Na resposta final, além do link,
mandar as intenções de busca separadas por tipo (autocompletar, "As pessoas também
perguntam", "Outras pessoas pesquisaram", visão de IA com o que diz e quem cita, e
quem ranqueia), marcando o que entrou no texto e o que ficou de fora, com o motivo.

**Depois de cada artigo ou revisão: as buscas que ficaram de fora viram pauta.** Segue
a regra "O que ficou de fora vira candidato a pauta" do AGENTS.md: conferir no acervo,
separar em vale um artigo, vira seção de artigo existente e não cabe, e atualizar
`docs/seo/pauta.md`. Só entra na pauta; criar o artigo continua sendo um pedido do Renato.

**O que trazer de cada busca:** autocompletar, "As pessoas também perguntam",
"Outras pessoas pesquisaram", visão geral de IA (texto e fontes), resultados
orgânicos e, em busca local, o mapa (`local_results`). Google Brasil, pt-BR, sem
personalização, **como celular** e na **região do site** (abaixo).

**Aparelho e região (pedido do Renato, 16/11/2026):** sempre `"device":"mobile"`, porque
a maior parte do público chega pelo celular. A região depende da página:
- **Artigo de assunto geral** (treino, alimentação, exercício, emagrecimento): **São Paulo**
  (`Sao Paulo,State of Sao Paulo,Brazil`).
- **Página local** (Alphaville, Tamboré, Barueri, Santana de Parnaíba e outras cidades ou
  bairros): **a cidade da página**. Bairro quase nunca existe na lista de locais, então
  use a cidade a que ele pertence: Alphaville e Tamboré → Barueri
  (`Barueri,State of Sao Paulo,Brazil`); página de Santana de Parnaíba → Santana de
  Parnaíba. Na dúvida, a cidade que a própria página cita.
O nome exato da cidade sai da lista de locais do SerpApi, que é grátis e não gasta cota:
`curl -s "https://serpapi.com/locations.json?q=Barueri&limit=3"` (usar o `canonical_name`).
O autocompletar não aceita cidade nem
aparelho; ele sai pelo Brasil (`gl=br`). Mesmo assim, o resultado não bate 100% com o
celular do Renato: muda com o dia, com testes do Google e com a digitação letra a letra.

**Como buscar** (bash; a chave está no cofre do ambiente e o proxy a envia sozinho,
não passe chave nenhuma):

```bash
serp() { curl -s -m 120 -H 'content-type: application/json' \
  -H 'accept: application/json, text/event-stream' -X POST https://mcp.serpapi.com/mcp \
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"search\",\"arguments\":{\"params\":$1,\"mode\":\"compact\"}}}" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["result"]["content"][0]["text"])'; }

# Página de resultados: related_questions, related_searches, ai_overview, organic_results, local_results
serp '{"engine":"google","q":"BUSCA","google_domain":"google.com.br","hl":"pt-br","gl":"br","device":"mobile","location":"CIDADE,State of ESTADO,Brazil"}'
# Autocompletar: suggestions[].value
serp '{"engine":"google_autocomplete","q":"BUSCA","hl":"pt-br","gl":"br"}'
# Visão de IA que veio só com "page_token" (sem text_blocks): um pedido a mais
serp '{"engine":"google_ai_overview","page_token":"TOKEN"}'
```

**Cota:** uma conta só para todos os sites do Renato, em plano pago desde 16/11/2026 (1.000 buscas por mês)
(o limite do mês aparece no painel do SerpApi; se a API disser que acabou, parar e
avisar). Cada busca gasta 2 (página + autocompletar), 3 com a visão de IA em duas
etapas. Buscar só o que a peça precisa (em geral 3 buscas), nunca em massa, e não
repetir busca já feita no mesmo dia.

**Orçamento do mês (1.000 pesquisas, todos os sites somados; revisto em 26/11/2026):** o
Renato reduziu as revisões diárias de 2 para 1 por dia em todos os sites, para a soma caber
na cota. Rotinas diárias: Direito de Verdade (1 revisão, 2 buscas) cerca de 150; Personal
por Perto (1 artigo + 1 cidade) cerca de 180; Site do Montinho (1 artigo) cerca de 60 a 75;
Crédito por Perto (1 página) cerca de 60 a 90; Guia Fitness Alphaville (1 artigo) cerca de
75 a 90; Tower EPI's (1 artigo, até 2 buscas) cerca de 60 a 90; site de missões de GTA 6
(Radar, no máximo 3 chamadas por dia) cerca de 90. Rotinas mensais (dia 16): visão de IA com
ideias de artigo nos 7 sites, mapa do Montinho e da Tower e alertas de regra do Direito e do
Crédito, cerca de 205. Total: cerca de 880 a 970, dentro da cota. Mesmo assim, quando o
SerpApi disser que a cota acabou ou der limite de requisições, parar na hora e avisar o
Renato.

**Evidência:** um JSON enxuto de cada busca (busca, data, aparelho, local,
autocompletar, perguntas, outras pesquisas, texto e fontes da visão de IA, orgânicos com
posição, título e endereço), sem `page_token` nem links do serpapi.com, em
`docs/seo/serp/<slug>-<data>.json`, e o registro do que cada dado mudou no texto em
`docs/seo/teste-intencoes-de-busca.md`.

**Continua valendo:** o que o Google mostra, inclusive a visão de IA, diz o que as
pessoas perguntam; não é fonte de fato.

**Se der erro de chave** ("Invalid API key", 401 ou host bloqueado): a chave não está
no ambiente desta sessão. Chamar a ferramenta `request_credential` para o host
`mcp.serpapi.com` (tipo bearer) e pedir ao Renato que cole a chave do SerpApi (menu
"API Key" em serpapi.com) no formulário. Nunca pedir a chave na conversa.

## Estratégias de SEO com o SerpApi (decisão do Renato, 16/11/2026)

Além da pesquisa de cada peça, o SerpApi serve para o seguinte. O Search Console continua
sendo a fonte da posição e dos cliques do próprio site; o SerpApi não substitui isso.

1. **Formato antes de escrever (sem busca extra).** Olhar os primeiros resultados da
   pesquisa da peça: se são calculadoras ou ferramentas, a peça é ferramenta; se são
   vídeos, registrar no doc que o texto sozinho dificilmente entra; se há mapa, é busca
   local. Anotar a decisão no doc da peça.
2. **Visão de IA.** Em toda pesquisa, registrar no doc quem a visão de IA cita e como é a
   resposta (tamanho, lista, tabela, exemplo com número). Escrever o lead e a primeira
   seção de modo que respondam do mesmo jeito direto, com fonte oficial. Uma vez por mês
   (dia 16, junto com o mapa local), a rotina mensal repete até 8 buscas principais do site
   e anota em `docs/seo/visao-de-ia.md` se a visão de IA aparece, se cita o site, quem cita
   e como é a página citada; as perguntas que o site ainda não cobre viram candidatas na
   pauta (vale um artigo, não recomendo, cabe em página existente).
3. **Concorrentes.** No doc da peça, anotar os domínios que ocupam os primeiros lugares e
   se são fracos (rede social, fórum, página antiga): essas buscas têm prioridade na pauta.
4. **Sazonalidade.** Antes de pautar tema sazonal, consultar o Google Trends pelo SerpApi
   (`{"engine":"google_trends","q":"TERMO","geo":"BR","date":"today 5-y"}`) e publicar
   algumas semanas antes do pico. Uma busca por tema, não por artigo.
5. **Mapa local (só este site tem Perfil da Empresa no Google).** O perfil "Montinho
   Personal Trainer" é de área de cobertura, sem endereço exibido. Uma vez por mês, repetir
   o levantamento do Google Maps (`{"engine":"google_maps","type":"search","q":"BUSCA",
   "ll":"@-23.4969,-46.8490,13z","hl":"pt-br","gl":"br"}`) para as 5 buscas de
   `docs/seo-local/README.md`, anotar a posição do perfil, a nota e o número de avaliações
   dele e dos 3 primeiros, e comparar com o mês anterior. Nunca sugerir endereço falso nem
   bairro no nome do perfil: é contra as regras do Google.
