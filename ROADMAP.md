# Roadmap — próximos passos combinados

Anotações do que ficou pendente e por quê. Manter curto: item feito sai daqui.

## Painel de perguntas do Pergunte ao Montinho — aguardando volume

**Combinado em 26/08/2026:** esperar duas a três semanas de dados antes de
decidir se vale construir.

Hoje o `ask_topic` (assunto detectado, só palavras de título/tag do acervo) já
vai para o GA4 e responde "sobre o que estão perguntando" e "quantas vezes".
O que o GA4 **não** responde é a pergunta literal, porque o texto digitado não
é guardado em lugar nenhum — decisão de privacidade tomada de propósito.

Para um painel de verdade seria preciso:

- um armazenamento (o projeto hoje não tem banco nenhum — só `ANTHROPIC_API_KEY`
  e `ASK_MODEL` como variáveis de ambiente);
- decidir se as perguntas passam a ser guardadas, com retenção definida e
  higienização — pessoas escrevem condição de saúde e nome no campo livre;
- uma rota de admin protegida.

**Antes de construir, checar no GA4:** quantas perguntas por semana e quantos
assuntos distintos aparecem. Com volume baixo, o relatório do GA4 basta e o
painel não se paga.

## Fase 2 dos CTAs contextuais — aguardando dados

O CTA final dos artigos ainda é o antigo, igual em todos. A troca reduziria os
links de WhatsApp nos artigos de 813 para 114 (ver PR #181).

**Antes de trocar:** olhar `contextual_cta_click ÷ contextual_cta_view` do CTA
do meio, que está no ar desde 26/08/2026. E ter anotado o volume semanal de
mensagens no WhatsApp de antes, para saber comparar.

## Lacunas de conteúdo já identificadas

- ~~**Máquina Smith**~~ — fechada em 2026-08-27 com o artigo
  `agachamento-livre-ou-maquina-smith`; o assistente voltou a responder
  "agachamento livre ou smith?".
- **Blocos aprovados e ainda não escritos**: 4 mitos (eletroestimulação/
  drenagem, vacuum abdominal, musculação x crescimento do adolescente,
  pré-exaustão). Pautas verificadas contra o acervo — nenhuma canibaliza
  artigo existente. Já publicados (2026-08-27): agenda imprevisível,
  já-tentei-e-parei, começar depois dos 50, peso leve define.
