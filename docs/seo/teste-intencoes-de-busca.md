# Teste: intenções de busca em artigos antigos

Início: 29/09/2026 · Medição: 27/10/2026 (4 semanas) · Fonte da linha de base:
Search Console, 01/06 a 29/09/2026 (Web).

Método: aplicar ao artigo o que os prints do Google mostram (autocompletar,
visão geral por IA, "As pessoas também perguntam", "Outras pessoas
pesquisaram") — título, meta, H2 e FAQ. O grupo controle não é tocado.

## Braço A — perto do topo (posição 8–10, muita impressão)

Hipótese: título, descrição e FAQ pelas buscas reais sobem o CTR e a posição de quem já está na 1ª página.


| Artigo | Impr. | Pos. | Cliques | Alterado em | Commit |
|---|---|---|---|---|---|
| crossover-vs-crucifixo | 5.081 | 8,3 | 14 | 29/09 | ver git log |
| treino-upper-lower-superior-inferior | 3.280 | 8,6 | 56 | 29/09 | ver git log |
| cardio-ou-musculacao-mounjaro | 1.898 | 8,4 | 3 | 29/09 | ver git log |
| calorias-para-ganhar-massa-muscular | 643 | 10,1 | 2 | 29/09 | ver git log |
| frutas-antes-do-treino | 622 | 8,2 | 1 | — | — |

## Braço B — 2ª página (posição 10–19)

Hipótese: cobrir as intenções reais tira o artigo da 2ª página. Antes de cada um, checagem de canibalização (causa comum de artigo empacado).

| Artigo | Impr. | Pos. | Cliques | Alterado em | Suspeita de canibalização |
|---|---|---|---|---|---|
| hip-dips-musculacao | 242 | 13,1 | 0 | 29/09 | nenhuma forte |
| quanto-tempo-para-aparecer-resultado-na-academia | 111 | 10,2 | 0 | 29/09 | quanto-tempo-para-ganhar-massa-muscular (306 imp, pos 9,8) |
| exercicios-para-gluteo-medio | 104 | 18,7 | 0 | — | como-fazer-abducao-quadril-maquina (84 imp, pos 7,5) |
| cafeina-no-treino-dose-timing | 81 | 15,2 | 0 | — | cafe-antes-do-treino (9 imp, pos 6,2) |
| treino-para-mulher-iniciante | 74 | 11,5 | 3 | — | treino-de-gluteos-feminino, hipertrofia-para-iniciantes |

Observação: com menos de 250 impressões, a medição do braço B é mais ruidosa; olhar posição e tendência, não só cliques.

## Grupo controle (não mexer até 27/10)

| Artigo | Impr. | Pos. | Cliques |
|---|---|---|---|
| quanto-de-cardio-fazer | 439 | 9,4 | 1 |
| treino-de-biceps | 426 | 8,4 | 2 |
| yoga-e-musculacao | 379 | 8,1 | 3 |
| fibras-musculares-tipo-1-tipo-2 | 332 | 8,5 | 0 |
| agachamento-bulgaro-como-fazer | 322 | 9,0 | 0 |

## Registro das mudanças

### crossover-vs-crucifixo (29/09)
- Título: "Crossover vs Crucifixo: Qual é Melhor para o Peito?" → "Crossover ou Crucifixo: Qual o Melhor para o Peito?"
- metaTitle: "Crossover ou Crucifixo: Qual Ativa Mais o Peitoral?" → "Crossover ou Crucifixo: Qual o Melhor? (Polia Alta, Média, Baixa)"
- metaDescription reescrita (halteres/máquina, polias, substituto).
- H2 novos: polia alta/média/baixa (tabela); crucifixo com halteres ou na máquina; qual músculo o crossover trabalha; qual exercício substitui o crossover; qual o melhor, afinal.
- FAQ +4: qual o melhor; qual músculo trabalha; qual substitui; máquina ou halteres.
- Observação: o artigo já era citado na visão geral por IA e aparecia como "Preferencial" no Google.

### treino-upper-lower-superior-inferior (29/09)
- metaTitle: "Treino Upper Lower: Fichas Prontas de 4 Dias e Como Montar" → "Treino Upper Lower: Fichas de 2, 3, 4 e 5 Dias (Masc. e Fem.)"
- metaDescription reescrita (2/3/4/5 dias, masculino/feminino, hipertrofia, push pull legs).
- H2 novos: upper lower 2, 3, 4 ou 5 dias (tabela); masculino e feminino; é bom para hipertrofia.
- FAQ +4: 3 dias; 5 dias; hipertrofia; feminino.
- Fora: "pacholok" (nome de influenciador) e "pdf" (possível isca futura, como a planilha da São Silvestre).

### hip-dips-musculacao (29/09) — braço B
- Título: "Hip Dips: O Que São e Como Minimizar com Musculação" → "Hip Dips: O Que São, Dá para Corrigir e Quais Exercícios Ajudam"
- metaTitle: "Hip Dips: O Que São e Como Minimizar" → "Hip Dips: O Que É, Como Corrigir e Exercícios (Antes e Depois)"
- metaDescription reescrita (depressão trocantérica, dá para acabar, exercícios, antes e depois, preenchimento).
- H2 novos: é possível acabar; melhora com academia (com links para abdução na máquina e glúteo médio, separando os temas); antes e depois; preenchimento e cirurgia (sem valores, encaminha ao médico).
- FAQ +4: o que é ter; dá para acabar; melhora com academia; quanto custa corrigir.

### cardio-ou-musculacao-mounjaro (29/09) — braço A
- metaTitle: "Cardio ou Musculação no Mounjaro? Qual Preserva Músculo" → "Cardio ou Musculação com Mounjaro? O Que Fazer (e Quanto)"
- metaDescription reescrita (tem que malhar, quanto de cada, cardio todo dia).
- H2 novos: quem toma Mounjaro tem que malhar (link p/ mounjaro-faz-perder-musculos); pode fazer cardio todo dia; parágrafo "pode aplicar e ir treinar" (sem regra de dose, encaminha ao médico).
- Observação de canibalização: há 12 artigos sobre Mounjaro. As buscas "treino para quem toma", "faz perder massa" e "cardápio" pertencem a outros artigos do cluster; aqui só apontamos para eles. "Preço" e "5mg emagrece quantos quilos" ficam de fora (fora do escopo de um personal).

### quanto-tempo-para-aparecer-resultado-na-academia (29/09) — braço B
- metaTitle: "Quanto Tempo Para Aparecer Resultado na Academia?" → "Quanto Tempo Para Ver Resultado na Academia? 1 Semana a 6 Meses"
- H2 novos: 1 semana; 1 mês; 3 meses (link p/ quanto-tempo-para-ganhar-massa-muscular); quanto tempo para definir; por região (pernas, barriga, glúteos, braços); mulheres.
- Canibalização tratada: no artigo concorrente (quanto-tempo-para-ganhar-massa-muscular), a pergunta "Quanto tempo leva para ver resultado na musculação?" virou "Quanto tempo leva para ver ganho de massa muscular?". Cada artigo fica com a sua busca: "resultado na academia" aqui, "ganhar massa" lá. ATENÇÃO na medição: o artigo de massa também foi tocado (só essa pergunta).

### calorias-para-ganhar-massa-muscular (29/09) — braço A
- metaTitle: "Quantas Calorias Para Ganhar Massa Muscular? Como Calcular" → "Calorias Para Ganhar Massa Muscular: Quantas, Como Calcular e O Que Comer"
- H2 novos: calorias boas / o que comer (com lanches); calorias ou kcal; calculadora (links TMB/TDEE e macros; diabetes → médico).
- Fora: "1.200/1.500 calorias é saudável" (intenção de emagrecer, outro artigo).
