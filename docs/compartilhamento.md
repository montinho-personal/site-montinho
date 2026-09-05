# Compartilhamento contextual

## A pergunta que o sistema responde

Não é "em quais redes sociais devemos estar". É **"por que esta pessoa
mandaria isto para alguém agora"**. Por isso não existe uma fileira de
ícones coloridos no site: existe um botão que muda de mensagem conforme o
que a pessoa está fazendo.

Quatro momentos reais, quatro comportamentos diferentes:

| Contexto | Momento | Mensagem |
| --- | --- | --- |
| `article` | "isso responde a dúvida que a gente estava falando" | gancho + título real + link |
| `tool` | "olha essa calculadora" | nome da ferramenta + link |
| `tool-result` | "meu 1RM deu 101 kg" | o resultado, sem dado corporal + link |
| `commercial` / `local` | "vou mostrar para minha esposa antes de decidir" | página + link, sem pressão |
| `food` | "quanto de proteína tem feijão?" | a quantidade que ela está vendo + link canônico |

## Arquitetura

```
lib/share/mensagens.ts     montarMensagem, urlCompartilhada, convite, rotuloBotao
components/share/
  Compartilhar.tsx         botão + Web Share + folha inferior/popover
  BlocoCompartilhar.tsx    bloco "Foi útil?" com Compartilhar + Copiar link
scripts/share-test.ts      privacidade, UTM, microcopy, codificação, eventos
scripts/og-audit.ts        auditoria de Open Graph das páginas compartilháveis
```

Toda a microcopy mora em `lib/share/mensagens.ts`. Nenhum texto de
compartilhamento é escrito à mão numa página.

## Comportamento

**Celular com Web Share:** um toque abre o painel do aparelho. É onde já
estão WhatsApp, Mensagens, Telegram e e-mail da pessoa — o caminho de menos
atrito que existe. Nos resultados de ferramenta, o painel só abre depois da
prévia: quem manda um número precisa ver o número antes.

**Celular sem Web Share:** folha inferior com quatro opções — WhatsApp,
copiar link, copiar mensagem, e-mail. Nessa ordem, que é a do público
brasileiro. Nada de dez redes.

**Desktop:** popover pequeno ancorado no botão (272×186 px medidos). Nunca
um modal.

**Cancelar não é erro.** Fechar o painel nativo não mostra aviso, não
registra evento e não quebra nada.

## Privacidade

A regra: **compartilha-se o resultado útil, não os dados que o produziram.**

A calculadora de proteína sabe que a pessoa pesa 80 kg — "copiar resultado"
leva esse peso, porque é a pessoa guardando a própria conta. Compartilhar
manda para o WhatsApp de outra gente, e aí só saem as gramas por dia. O
mesmo vale para TMB/TDEE e déficit: saem kcal, não peso, altura, idade nem
sexo. `scripts/share-test.ts` reprova o build se um desses voltar.

A URL compartilhada é sempre a **canônica com UTM** — query e hash da página
de origem são descartados, então nenhum link carrega `?peso=96&idade=42`.

## Onde os botões estão

| Página | Posição | Aparência |
| --- | --- | --- |
| Artigo | topo, ao lado de autor e data | link discreto |
| Artigo | meio, após a resposta — **só quando não há CTA contextual ali** | bloco |
| Artigo | fim, antes da caixa do autor | bloco |
| Ferramenta (9) | topo, abaixo do H1 | link discreto |
| Resultado (7 calculadoras) | ao lado de "copiar resultado" | botão com borda |
| Alimento | abaixo da tabela, com a quantidade escolhida | link discreto |
| Comerciais (4) e locais (4) | depois do CTA de conversão | link discreto |

A regra do meio do artigo é o ponto mais importante desta tabela: dois
blocos disputando a mesma pausa da leitura fazem ignorar os dois, e o CTA —
que leva à conversa comercial — tem prioridade.

## Eventos

`share_open` é **intenção**; `share_native`, `share_whatsapp`,
`share_copy_link`, `share_copy_message`, `share_email` são **ação**;
`share_result` marca que a ação veio de um resultado de ferramenta.
Separá-los é o que permite calcular quantos dos que demonstram vontade
realmente enviam.

Parâmetros: `page_type`, `content_type`, `share_location`, `share_method`,
`tool_name`. Nunca o resultado, o peso, a idade, o sexo nem o texto enviado.

Share rate por conteúdo = ações de compartilhamento ÷ visualizações, com
recorte por `share_location` para descobrir onde as pessoas preferem enviar.

## UTM

`utm_source=share`, `utm_medium` conforme o método (`native`, `whatsapp`,
`copy`, `email`), `utm_campaign=<contexto>_share`. Três parâmetros, nada de
identificador de pessoa: o link é repassado adiante e não pode carregar quem
o gerou. O canonical continua apontando para a URL limpa.

## Performance

Zero script de terceiro, zero SDK, zero cookie novo. Web Share API,
Clipboard API e URLs — tudo nativo do navegador. CLS medido em 0,0000: o
botão ocupa espaço desde o primeiro render.

## Fase 2 (fora desta entrega, por decisão)

Card de resultado como imagem para Stories, compartilhamento de trecho
selecionado, "salvar para depois" e experimentos de copy A/B. Nenhum deles
justificava atrasar o que já funciona.
