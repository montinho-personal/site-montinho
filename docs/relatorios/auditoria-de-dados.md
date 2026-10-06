# Auditoria de dados — checklist obrigatório

Todo relatório de dados entregue ao Montinho (GA4, Search Console, Google
Ads, CRM) passa por esta auditoria ANTES de ser enviado, e sai com um
quadro "Auditoria dos dados" mostrando o que foi conferido, o que foi
corrigido e os limites conhecidos. Relatório sem auditoria não é enviado.

Cada item abaixo veio de um erro real cometido em 06/10/2026.

## Fontes e contas

- GA4: propriedade `543369321` (Montinho Personal Trainer). Supermetrics `GAWA`.
- Search Console: `https://www.montinhopersonal.com.br/`. Supermetrics `GW`.
- Google Ads: conta `6447752447`. Supermetrics `AW`.
- Histórico começa em **25/06/2026** (GA4 e Search Console). "Período
  total" = 25/06/2026 até hoje. O site existe desde 17/06, mas sem dados
  antes de 25/06 — dizer isso, não inventar.
- Datas em horário de Brasília.

## Checklist

### 1. Escopo — o que entra
- [ ] Listar as páginas a partir do código (`app/`, `lib/blog.ts` **e**
      outros arquivos de conteúdo como `lib/olympia-2026.ts`), não só de
      um arquivo. Os artigos do Olympia ficavam fora de `lib/blog.ts`.
- [ ] Se a página recebe anúncio, o relatório inclui Google Ads (gasto,
      cliques, conversões por campanha e por página de destino). O
      relatório de SEO local saiu sem Ads e escondeu R$ 4,3 mil.
- [ ] Páginas que o Montinho espera ver e que ficaram fora (ex.:
      consultoria online num relatório local) são citadas com o motivo.
- [ ] Classificação de cada página revisada à mão nos grupos pequenos
      (ex.: guia de academia ≠ página de serviço).

### 2. Limpeza
- [ ] Somar variações da mesma URL: `?fbclid`, `?utm_*`, `#secao`,
      `?_rsc`, `?need_sec_link`, `?webview_progress_bar`, `?hl=`.
- [ ] Excluir tráfego interno: `/crm*`, `?gtm_debug`, `?gtm_latency`.
- [ ] Ignorar URLs quebradas/lixo (ex.: `/blog/dmFsZS1hLX`) e citar se
      forem relevantes.

### 3. Eventos
- [ ] Evento com o mesmo nome em mais de uma ferramenta (ex.:
      `simulator_complete` nos dois simuladores) é separado por
      `pagePath`. Nunca atribuir o total a uma só.
- [ ] Ferramenta embutida em artigo: separar uso na página própria do
      uso dentro de artigos.
- [ ] Evento com muitas ocorrências para poucas pessoas = provável teste;
      sinalizar.

### 4. Conferência numérica
- [ ] Os totais do relatório batem com uma consulta direta e agregada à
      fonte (sem dimensão de página). Diferença > 2% é investigada antes
      de enviar.
- [ ] Soma das partes = total (ex.: visitas Google + IA + direto + outros
      = visitas da página).
- [ ] Pelo menos 1 número citado pelo Montinho ou de memória da conversa
      é reconferido na fonte (ex.: "hip thrust veio de IA").
- [ ] Mostrar quantidades, não só o "principal" (a coluna "origem
      principal" escondeu 33 visitas de IA).

### 5. Comunicação
- [ ] Quadro "Auditoria dos dados" no relatório: ✓ conferido, Corrigido:
      o que mudou desde a versão anterior, e limites conhecidos (termos
      ocultos do Search Console, amostra pequena, testes, definição de
      conversão do Ads ≠ clique no WhatsApp do GA4).
- [ ] Na mensagem ao Montinho: dizer que a auditoria foi feita e o que
      ela corrigiu. Se algo não foi conferido, dizer o quê.
- [ ] Nunca dizer "confirmado" para o que não foi checado na fonte.
