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

**Depois de cada artigo ou revisão: as buscas que ficaram de fora viram pauta (regra do
Renato, 16/11/2026).** Sem esperar pedido, pegar tudo o que foi marcado como "ficou de
fora" nas intenções de busca, conferir no site (artigos, páginas e docs) o que já existe
e separar em três grupos: **vale um artigo** (assunto que o site ainda não cobre, com
fonte possível e busca real; entra na pauta com as buscas e o motivo), **não recomendo**
(com o motivo: nome de marca, fora do tema do site, sem fonte, canibaliza uma página que
já existe) e **cabe em página existente** (anotar no doc dessa página, para a próxima
revisão dela). Mandar ao Renato junto com a resposta final, em lista curta, na ordem em
que faria os artigos. Só entra na pauta; criar o artigo continua sendo um pedido dele.

**O que trazer de cada busca:** autocompletar, "As pessoas também perguntam",
"Outras pessoas pesquisaram", visão geral de IA (texto e fontes), resultados
orgânicos e, em busca local, o mapa (`local_results`). Google Brasil, pt-BR, sem
personalização, **como celular** e na **região do site** (abaixo).

**Aparelho e região (pedido do Renato, 16/11/2026):** sempre `"device":"mobile"`, porque
a maior parte do público chega pelo celular. Região padrão deste site: **Barueri** (`Barueri,State of Sao Paulo,Brazil`): o público do Montinho é Alphaville, Tamboré e região. Página de outra cidade usa a cidade dela.
O nome exato da cidade sai da lista de locais do SerpApi, que é grátis e não gasta cota:
`curl -s "https://serpapi.com/locations.json?q=Barueri&limit=3"` (usar o `canonical_name`).
Bairro quase nunca existe na lista: use a cidade. O autocompletar não aceita cidade nem
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

**Cota:** uma conta só para todos os sites do Renato, 250 buscas por mês no plano
grátis. Cada busca gasta 2 (página + autocompletar), 3 com a visão de IA em duas
etapas. Buscar só o que a peça precisa (em geral 2 ou 3 buscas), nunca em massa, e
não repetir busca já feita no mesmo dia.

**Evidência:** guardar no doc da peça, no lugar dos prints, um JSON enxuto de cada
busca (busca, data, autocompletar, perguntas, outras pesquisas, texto e fontes da
visão de IA, orgânicos com posição, título e endereço), sem `page_token` nem links
do serpapi.com, e preencher a tabela de prints dizendo o que cada dado mudou no texto.

**Continua valendo:** o que o Google mostra, inclusive a visão de IA, diz o que as
pessoas perguntam; não é fonte de fato.

**Se der erro de chave** ("Invalid API key", 401 ou host bloqueado): a chave não está
no ambiente desta sessão. Chamar a ferramenta `request_credential` para o host
`mcp.serpapi.com` (tipo bearer) e pedir ao Renato que cole a chave do SerpApi (menu
"API Key" em serpapi.com) no formulário. Nunca pedir a chave na conversa.
