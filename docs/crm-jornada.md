# A jornada, etapa por etapa

Cada botão de WhatsApp do CRM abre a mensagem da etapa em que a pessoa está.
Quem escolhe é `escolherSituacao` (`lib/crm/copy.ts`), a partir do grupo da
tela Hoje e do estado real do lead ou do aluno. Os textos ficam em
`copy-textos.ts`; o porquê de cada um, em `crm-playbook-whatsapp.md`.

## O que decide o caminho

**O serviço, não a temperatura.** `crm_services.exige_experimental` diz se o
próximo passo é a aula experimental ou o plano:

| Serviço | Experimental? | Depois de "qualificado" vem |
|---|---|---|
| Personal presencial | sim | convite para a aula experimental |
| Pacote flexível | não | convite para o plano |
| Consultoria online | não | convite para o plano |

Sem serviço definido, o sistema assume presencial — convidar para a
experimental é o convite que não queima etapa se o serviço mudar depois.

## O caminho

```
                    chegou pelo WhatsApp
                            │
        ┌───────────────────┴───────────────────┐
        │  primeiro_contato_*  (5 variantes)    │  de onde veio decide qual
        └───────────────────┬───────────────────┘
                            │ não respondeu
                     segundo_toque
                            │ respondeu, falou o objetivo
        ┌───────────────────┴───────────────────┐
        │            exige experimental?        │
        └───────┬───────────────────────┬───────┘
            sim │                       │ não
   convite_experimental          convite_proposta
            │                            │
   experimental_confirmar                │
            ├── faltou → experimental_no_show ──┐ (remarca)
            ├── sem registro → experimental_sem_registro
            └── fez → pos_experimental_proposta │
                            │                   │
                            └─────────┬─────────┘
                                proposta enviada
                                      │
              proposta_follow_up_1 (2–6 dias)
              proposta_follow_up_2 (7+ dias, último toque)
                    negociacao_parada
                                      │ fechou
                                boas_vindas (até 14 dias)
                                      │
                              check_in_aluno
                          pedido_indicacao (90+ dias, nunca indicou)
                          renovacao_proxima (≤ 30 dias)
                          renovacao_vencida
                            reativacao_pausado (pausou ou cancelou)
```

## Regras que a ordem respeita

- **Renovação vencida vence tudo.** Um aluno de três dias com renovação
  vencida ouve sobre a renovação, não boas-vindas.
- **Aluno novo não ouve conversa de renovação.** Nos primeiros 14 dias a
  conversa é sobre o treino; num plano mensal, a renovação está a 30 dias e
  dispararia no primeiro dia.
- **Indicação se pede uma vez.** Só para quem treina há 90 dias ou mais e
  nunca indicou ninguém. Quem já indicou recebe check-in.
- **A experimental não se convida duas vezes.** Com aula marcada, a mensagem
  é a de confirmação.
- **A experimental é "sem compromisso", nunca "gratuita".** É o que a página
  promete (`/lp/personal-alphaville`), e é o teto do que a mensagem pode
  dizer.

## O que ainda não tem mensagem, e por quê

- **Perdido.** Quem disse não fica em paz; a retomada acontece pela
  reativação, com prazo.
- **Aluno faltando.** O CRM ainda não registra presença por aula, então não
  há sinal confiável para disparar.
