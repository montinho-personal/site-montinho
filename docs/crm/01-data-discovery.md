# CRM Data Discovery — auditoria antes do código

Executada em 04/09/2026, antes de qualquer tabela ser criada. Este documento
responde às dez perguntas do briefing e registra o que foi decidido a partir
delas. O que não pôde ser verificado está marcado como tal.

## Resumo em uma frase

Existe muito dado agregado (GA4, Search Console) e pouco dado individual
ligável a pessoa; a origem de quem já é aluno é **desconhecida** em quase
todos os casos, e o CRM nasce com isso declarado em vez de inventado.

## 1. Quais dados já existem

| Fonte | O que tem | Individual ou agregado |
| --- | --- | --- |
| Google Drive | 41 planilhas "Controle_Volume_Semanal", uma por aluno (jul/2025 a abr/2026) | Individual: nome no título, datas de criação e edição. Sem valor, plano ou origem |
| Sistema de anamnese (Supabase, projeto separado) | Tabela `alunos` com 21 cadastros (jun a ago/2026) | Individual: nome, telefone/whatsapp, e-mail, status, data. **Só esses campos foram lidos**; o restante é dado de saúde e não entra no CRM |
| Gmail: recibos Mercado Pago | 3 e-mails "Pagamento aprovado" (jul e ago/2026) | Individual: valor, taxa, data, nome e e-mail do pagador |
| Google Calendar (calendário principal) | Eventos "Aula experimental <nome>" desde out/2024; eventos "Montar treino <nome>" | Individual: nome e data. Sem presença nem desfecho |
| GA4 (G-J1ZSPMDJZE) | Exports já no repositório (`data/analytics/`): usuários, visualizações, páginas, eventos, 15/06 a 02/09/2026 | Agregado |
| Search Console | Export de páginas e consultas (823 linhas importadas) e impressões por artigo, 24/06 a 02/09/2026 | Agregado |
| Google Ads (conta 644-775-2447) | E-mails de resumo semanal desde ~22/07/2026; três campanhas de pesquisa | Agregado (cliques, impressões, crédito). **A tag de conversão nunca disparou** |
| Meta / Instagram | Notificações de Meta Pay; nenhum recibo de Meta Ads encontrado | Nada individual; nenhum gasto verificado |
| WhatsApp Business (app, sem API) | Conversas no aparelho | Não exportável de forma estruturada; não foi lido |
| Site | `testimonials.json` (Google 5,0, 17 avaliações), página /resultados com antes e depois publicados | Individual só por nome público |
| Vercel | Projeto site-montinho no time "Montinho Personal Trainer" | Logs e analytics de infraestrutura, não de pessoa |

Fora de escopo por decisão: o projeto Supabase "Controle de vendas" e a
planilha "Controle_Vendas_Google_Sheets" pertencem a outro negócio
(peptídeos); a "planilha contas" do Drive contém senhas em texto puro e não
foi copiada.

## 2. Onde estão

- Drive, Gmail e Calendar: na conta Google do Renato, acessados por conector.
- Anamnese: projeto Supabase `xbgckkyzsslrnmeimoxu`.
- GA4 e Search Console: exports em `data/analytics/` (o acesso direto à API
  não estava configurado; ver seção 10).
- Google Ads: só o que chega por e-mail; sem acesso à API.
- CRM: projeto Supabase `vsldhkkeijmeculaukee` (sa-east-1), esquema `public`,
  tabelas com prefixo `crm_`. O mesmo projeto tem um esquema `montinho` de
  outro sistema, quase vazio; o CRM não o referencia.

## 3. Desde quando existem

| Fonte | Início | Fim |
| --- | --- | --- |
| Calendar (aulas experimentais) | 01/10/2024 | contínuo |
| Drive (planilhas por aluno) | 08/07/2025 | 29/04/2026 (última criada) |
| GA4 export | 15/06/2026 | 02/09/2026 |
| Search Console export | 24/06/2026 | 02/09/2026 |
| Anamnese | 22/06/2026 | 21/08/2026 |
| Mercado Pago | 16/07/2026 | 21/08/2026 |
| Google Ads | ~22/07/2026 | contínuo |
| **Tracking do CRM (baseline)** | **04/09/2026** | contínuo |

## 4. Qual qualidade possuem

- **Drive**: nome muitas vezes só o primeiro ("Pedro", "Camila"); a mesma
  pessoa pode ter duas planilhas (Natalia / NataliaNascimento). Data de
  criação é proxy de início, não prova de pagamento.
- **Anamnese**: dois "Pedro" em datas diferentes; sem sobrenome em vários
  casos; telefone só em um registro utilizável.
- **Mercado Pago**: alta qualidade (valor, taxa, id da transação, e-mail),
  mas cobre só quem pagou por esse meio. Pix direto, dinheiro e
  transferência não aparecem: a receita histórica é **piso, não total**.
- **Calendar**: título livre ("Aula experimental Renata 12h", "Aula
  Experimental Cibele 17h"); sem campo de presença.
- **GA4/GSC**: consistentes, mas agregados; nenhum identificador de
  usuário; sem parâmetros UTM capturados antes do CRM.
- **Google Ads**: sem conversões (tag configurada com acionador errado no
  GTM), logo sem custo por lead nem por venda no histórico.

## 5. Quais podem ser importados

Importados em 04/09/2026, com relatório em `crm_imports`:

| Fonte | Registros | Sucesso | Duplicados marcados | Confiança |
| --- | --- | --- | --- | --- |
| drive | 36 | 31 | 5 | inferred |
| anamnese | 21 | 20 | 1 | inferred |
| calendar | 12 | 12 | 0 | inferred |
| mercadopago | 3 | 3 | 0 | verified |
| gsc | 823 | 823 | 0 | aggregate |
| ga4 | 2 | 2 | 0 | aggregate |

Resultado: 54 contatos, 53 clientes (3 confirmados por recibo, 50
inferidos), 1 lead sem desfecho, 4 aulas experimentais, 2 contratos e 3
receitas. Seis contatos foram **marcados** como possível duplicata (não
mesclados).

## 6. Quais são agregados

GA4, Search Console, resumos do Google Ads e as avaliações do Google.
Entram em `crm_historical_acquisition` e alimentam as telas de SEO e
aquisição, mas **nunca** se ligam a uma pessoa.

## 7. Quais são individuais

Planilhas do Drive, cadastros da anamnese, recibos do Mercado Pago, eventos
do Calendar. Cada um virou contato/lead/cliente com `origem_registro =
'import'` e a evidência gravada em `observacoes` e numa atividade do tipo
`import`.

## 8. Quais podem ser ligados a contatos

- Recibo do Mercado Pago ↔ cadastro da anamnese: ligado quando e-mail ou
  telefone batem (Nathalia). Nos outros dois casos ficou só o recibo.
- Aula experimental no Calendar ↔ aluno: ligado por nome quando a pessoa
  aparece depois como aluna (Renata, Bruna, Cibele), com presença
  **inferida** e dito assim no registro.
- Planilha do Drive ↔ anamnese: ligado por nome completo quando único.

## 9. Quais não podem ser ligados retroativamente

- Nenhuma sessão do GA4 ou consulta do Search Console pode ser ligada a um
  lead: não havia identificador nem UTM sendo capturado.
- Nenhum clique do Google Ads pode ser ligado a uma venda: a conversão não
  disparava e não há gclid armazenado em lugar nenhum.
- Conversas de WhatsApp anteriores a 04/09/2026 não têm código de
  referência; a origem de quem chegou por lá é `unknown`.
- Por isso a origem de **todos** os 54 contatos importados é `unknown` com
  confiança `low`. Isso é um dado, não um buraco: a tela de atribuição
  mostra a cobertura e o dicionário explica.

## 10. Quais integrações futuras são possíveis

| Integração | Viável? | Pré-requisito |
| --- | --- | --- |
| GA4 Data API | Sim | Conta de serviço com acesso à propriedade; importar sessões por landing page e por source/medium para cruzar com `crm_attribution_touches` (agregado, sem ligar a pessoa) |
| Search Console API | Sim | Mesma conta de serviço; substitui o export manual |
| Google Ads API | Sim | Token de desenvolvedor e conta MCC; traz custo por campanha para `crm_ad_spend`. Até lá, o custo entra à mão em Configurações |
| Google Ads: conversão offline | Sim, e é o maior ganho | Corrigir o acionador da tag no GTM; depois enviar `gclid` + data da venda a partir do CRM (o gclid já é capturado hoje) |
| Meta Ads API | Se houver campanha | Gasto entra em `crm_ad_spend`; `fbclid` já é capturado |
| WhatsApp Cloud API (oficial) | Possível, mas muda o fluxo | Exige migrar o número para a API oficial; permitiria registrar primeira resposta automaticamente. Scraping do app não será feito |
| Mercado Pago API | Sim | Token da conta; sincroniza pagamentos aprovados como `revenue_events` verificados |
| Google Calendar API | Sim | Já há conector; pode criar/ler eventos de aula experimental a partir do CRM |

## Riscos registrados

1. Receita histórica é piso: qualquer LTV médio de cliente importado sem
   recibo é desconhecido, e a tela de LTV os exclui da média e mostra a
   contagem.
2. Duplicatas por nome (Pedro, Camila, Rafael, Alan, Simone, Beatriz)
   ficam marcadas para decisão humana em Qualidade de Dados.
3. Se o Renato não corrigir o GTM, o Google Ads continua sem conversão e o
   CAC por mídia continua `null` com motivo.
4. O sistema de anamnese guarda dados de saúde. O CRM não os lê, não os
   copia e não tem chave estrangeira para lá. Isso é regra, não acidente.
