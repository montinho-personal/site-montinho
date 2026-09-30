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
| frutas-antes-do-treino | 622 | 8,2 | 1 | 29/09 | ver git log |

## Braço B — 2ª página (posição 10–19)

Hipótese: cobrir as intenções reais tira o artigo da 2ª página. Antes de cada um, checagem de canibalização (causa comum de artigo empacado).

| Artigo | Impr. | Pos. | Cliques | Alterado em | Suspeita de canibalização |
|---|---|---|---|---|---|
| hip-dips-musculacao | 242 | 13,1 | 0 | 29/09 | nenhuma forte |
| quanto-tempo-para-aparecer-resultado-na-academia | 111 | 10,2 | 0 | 29/09 | quanto-tempo-para-ganhar-massa-muscular (306 imp, pos 9,8) |
| exercicios-para-gluteo-medio | 104 | 18,7 | 0 | 29/09 | como-fazer-abducao-quadril-maquina (84 imp, pos 7,5) |
| cafeina-no-treino-dose-timing | 81 | 15,2 | 0 | 29/09 | cafe-antes-do-treino (9 imp, pos 6,2) |
| treino-para-mulher-iniciante | 74 | 11,5 | 3 | 29/09 | treino-de-gluteos-feminino, hipertrofia-para-iniciantes |

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

### exercicios-para-gluteo-medio (29/09) — braço B
- metaTitle: "Exercícios para Glúteo Médio — Os 6 Mais Eficazes" → "Glúteo Médio: Onde Fica, Função e os 6 Melhores Exercícios"
- H2 novos: onde fica e para que serve (origem/inserção); máximo, médio e mínimo (tensor da fáscia lata); sintomas de glúteo médio fraco; como ativar; na polia e na máquina; antes e depois.
- Canibalização: técnica da cadeira abdutora fica em como-fazer-abducao-quadril-maquina (link); hip dips linkado.

### frutas-antes-do-treino (29/09) — braço A
- metaTitle: "Frutas Antes do Treino: Quais Comer e Quanto Tempo Antes" → "Frutas Antes do Treino: As Melhores, Quanto Tempo Antes e É Bom?"
- H2 novos: é bom; o que comer 30 min antes; quantas bananas; vitamina/salada/iogurte; antes ou depois; hipertrofia ou emagrecimento (diabetes → médico/nutricionista).
- Fora: arritmia (tema médico).

### cafeina-no-treino-dose-timing (29/09) — braço B
- metaTitle: "Cafeína como Pré-Treino: Dose, Timing e Efeitos Colaterais" → "Cafeína no Treino: Para Que Serve, Quanto Tomar e Quando"
- H2 novos: para que serve; 200 mg ou 400 mg; 200 mg tira o sono; quem deve ter cuidado (gestante, gastrite, TDAH → médico); cápsula ou pré-treino pronto.
- Fora: marcas (Growth). cafe-antes-do-treino segue com a intenção "café".

### treino-para-mulher-iniciante (29/09) — braço B
- metaTitle: "Treino para Mulher Iniciante: Guia Completo de Musculação" → "Treino para Mulher Iniciante na Academia: Full Body, ABC e Em Casa"
- H2 novos: ABC; 5 vezes na semana; em casa (link p/ treino-em-casa-sem-equipamento); para emagrecer.
- Pendente: "PDF" (ficha feminina) como isca futura, no molde da planilha da São Silvestre.

## SEO local — rodada 1 (29/09/2026)

`/personal-trainer-alphaville` — base (GSC até 15/09): 162 impressões, 1 clique, posição 33,1.
- Título antes: "Personal Trainer em Alphaville | Montinho Personal Trainer" → depois: "Personal Trainer em Alphaville: Planos e Atendimento | Montinho".
- Nova seção "Quanto custa um personal trainer em Alphaville?" (tipos de plano, 3x/semana, é vantajoso, personal na sua academia) sem publicar valor, CTA WhatsApp `personal-trainer-alphaville:planos`.
- FAQ: +3 perguntas do PAA (valor de 1 hora, 3x por semana, é vantajoso).
- Medir em 27/10 junto com o teste A/B, comparando com a base acima.

`/personal-trainer-barueri` — base (GSC até 15/09): 331 impressões, 6 cliques, posição 14,4.
- Título antes: "Personal Trainer em Barueri | Montinho Personal Trainer" → depois: "Personal Trainer em Barueri: Planos e Atendimento | Montinho".
- Seção "Quanto custa um personal trainer em Barueri?" (planos, 3 ou 5 vezes, é vantajoso) sem valor; CTA `personal-trainer-barueri:planos`; +4 FAQs do PAA; links Alphaville e Osasco (buscas relacionadas).

`/personal-trainer-tambore` — base (GSC até 15/09): 266 impressões, 8 cliques, posição 19.
- Título antes: "Personal Trainer Tamboré | Montinho Personal Trainer" → depois: "Personal Trainer no Tamboré (Barueri): Planos e Atendimento | Montinho".
- Seção de planos sem valor (inclui "taxa de personal externo"); CTA `personal-trainer-tambore:planos`; +4 FAQs do PAA; links Barueri/Alphaville.

`/personal-trainer-santana-de-parnaiba` — base (GSC até 15/09): 142 impressões, 4 cliques, posição 9,3.
- Título antes: "Personal Trainer em Santana de Parnaíba | Montinho Personal Trainer" → depois: "Personal Trainer em Santana de Parnaíba: Planos e Atendimento | Montinho".
- Seção de planos sem valor (+ emagrecer, desambiguação com o bairro de Santana, Instagram); CTA `personal-trainer-santana-de-parnaiba:planos`; +4 FAQs do PAA.

## SEO local — grupo 2: páginas "quanto custa personal" (29/09/2026)
Faixas de preço existentes (Alphaville, Tamboré) mantidas por decisão do Montinho; nenhum número novo.
Adicionado nas 5 páginas: FAQs do PAA (valor de 1 hora, 3x/semana, 3 ou 5 vezes, vale a pena) e seção "Os tipos de plano" com CTA (4 artigos do blog). Títulos NÃO alterados.
Base (GSC até 15/09): quanto-custa-personal-trainer-alphaville 88 impr / 4 cliques / pos 6,7.

## SEO local — grupo 3: personal a domicílio (29/09/2026)
5 páginas (Alphaville, Barueri, Santana de Parnaíba, Aldeia da Serra, Tamboré): +4 FAQs do PAA (valor em casa, 3x/semana, grupo de WhatsApp → consultoria online, é vantajoso) e seção de tipos de plano sem valores. Títulos intactos. Condomínio fica para a próxima rodada.

## Títulos de academias com CTR baixo (29/09/2026) — mudança SÓ de metaTitle e metaDescription
Base (GSC até 15/09): bluefit-alphaville 153 impr / 0 cliques / pos 9 · academia-24-horas-barueri 122 / 1 / 7,6 · smart-fit-barueri 107 / 1 / 9,4 · quanto-custa-academia-em-barueri 77 / 0 / 7,1 · skyfit-alphaville 71 / 0 / 8,9.
Antes → depois:
- bluefit-alphaville: "Bluefit Alphaville Vale a Pena? Prós e Contras por Perfil" → "Bluefit Alphaville: Vale a Pena? Estrutura, Lotação e Para Quem É"
- smart-fit-barueri: "Smart Fit Barueri Vale a Pena? Análise Honesta" → "Smart Fit Barueri: Vale a Pena? Prós, Contras e Qual Plano"
- academia-24-horas-barueri: "Academia 24 Horas em Barueri: Onde Treinar" → "Academia 24 Horas em Barueri: Quais Redes Abrem de Madrugada"
- skyfit-alphaville: "SkyFit Alphaville: Vale a Pena? Análise Honesta" → "SkyFit Alphaville: Vale a Pena? Prós, Contras e Teste de 30 Minutos"
- quanto-custa-academia-em-barueri: "Quanto Custa Academia em Barueri? Faixas e Dicas" → "Quanto Custa Academia em Barueri? Preços do Low-Cost ao Premium"
Hipótese: parte do CTR baixo é busca de navegação (endereço/horário) que a página não responde; título sozinho tem efeito limitado.

## SEO local — condomínio (29/09/2026)
personal-trainer-em-condominio-alphaville (21 impr, pos 8,4) e /personal-trainer-condominio-tambore: +4 FAQs do PAA e seção de planos sem valores (só no blog). Títulos intactos.
Canibalização a decidir: 5 URLs de condomínio (em/para × Alphaville/Tamboré + página do Tamboré) dividem ~35 impressões.

`blog/personal-trainer-aldeia-da-serra` — base (GSC até 15/09): 107 impressões, 6 cliques, posição 17,6. Visão geral por IA já cita o Montinho (29/09).
- Título antes: "Personal Trainer Aldeia da Serra | Montinho Personal Trainer" → depois: "Personal Trainer na Aldeia da Serra (Barueri): Planos | Montinho".
- Seção de planos sem valor, +5 FAQs (PAA + "Barueri ou Santana de Parnaíba?").

`blog/academias-em-alphaville` (30/09) — base (GSC até 15/09): 107 impressões, 3 cliques, posição 11,1.
- Título antes: "Academias em Alphaville: Guia Completo 2026" → depois: "Academias em Alphaville (Barueri): 24h, Wellhub e Premium 2026".
- Seção nova com os dados verificados pelo Montinho em lib/academias/base.ts (24h, Wellhub, TotalPass, faixa de preço), desambiguação de outros Alphavilles, +5 FAQs do PAA.

`blog/academias-em-barueri` (30/09) — base: 14 impressões, 0 cliques, posição 9,4 (o cluster é puxado por melhores-academias-de-barueri: 84 impr, pos 5,8).
- Título antes: "Academias em Barueri: Guia Completo 2026" → depois: "Academias em Barueri: Centro, 24h, TotalPass e Preços 2026".
- Seção-hub com links para as 14 páginas de academia de Barueri, +3 FAQs (TotalPass/Gympass, 24h, Centro). Sem dados de convênio de Barueri (não verificados).

`blog/academias-em-santana-de-parnaiba` (30/09) — base: 87 impressões, 2 cliques, posição 8,5.
- Título: "Academias em Santana de Parnaíba: Guia 2026" → "Academias em Santana de Parnaíba: Centro, Fazendinha e Preços 2026".
- Hub com links para as páginas de academia da cidade + Fábrica Premium, crianças/adolescentes, "de graça", desambiguação com o bairro de Santana; +3 FAQs.

`blog/academias-perto-de-alphaville` (30/09) — base: 86 impressões, 1 clique, posição 21,8.
- Título: "Academias Perto de Alphaville: Melhores Opções" → "Academia Perto de Mim em Alphaville: Opções por Região".
- Seção "por região" (Industrial, Iguatemi, Centro Comercial, Santana de Parnaíba, Tamboré, Aldeia, Castelo/estação) com links para 12 páginas; +3 FAQs. Feito sem print novo (intenção "perto de mim" veio dos prints de Barueri e Santana de Parnaíba).

## Ferramentas — rodada 1 (30/09/2026)

`/ferramentas/calculadora-de-proteina` — sem base do GSC (conector expirado; snapshot local só cobre SEO local).
- Título antes: "Calculadora de Proteína: Quantos Gramas por Dia" → depois: "Calculadora de Proteína por Dia e por Peso (g/kg)".
- Seção nova: quem não treina (0,8 g/kg), gestantes (~1,1 g/kg, DRI/National Academies), links para /alimentos (por alimento) e calculadora de whey. +4 FAQs do PAA (cálculo por kg, sedentário, gestantes, 100 g/dia).
- Fora: marcas (Herbalife, Growth, Nestlé, Piracanjuba). "App" não se aplica.

`/ferramentas/calculadora-tmb-tdee` (30/09) — sem base do GSC.
- Título antes: "Calculadora de TMB e TDEE: Gasto Calórico Diário" → depois: "Calculadora TMB e TDEE: Gasto Calórico Diário (Grátis)".
- Seção Katch-McArdle (TMB com percentual de gordura) com link para composição corporal; FAQ visível + FAQPage (5 perguntas: diferença, feminino, % gordura, musculação, déficit). Calculadora não alterada.

`/ferramentas/calculadora-deficit-calorico` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Déficit Calórico para Emagrecer" → depois: "Calculadora de Déficit Calórico Grátis para Emagrecer (TDEE)".
- FAQ visível + FAQPage (5: calorias por dia, déficit diário, pelo TDEE, calorias dos alimentos, grátis) e links para /alimentos, FitChef, TMB. Calculadora não alterada. Fora: Unimed, micron-app.

`/ferramentas/calculadora-macros` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Macros: Proteína, Carbo e Gordura" → depois: "Calculadora de Macros e Calorias: Emagrecer e Hipertrofia".
- FAQ visível + FAQPage (5: emagrecer, hipertrofia, TDEE, alimentos, grátis) + links TMB/alimentos/FitChef. Calculadora não alterada. Fora: Growth, Gorgonoid, "blog".

`/ferramentas/calculadora-1rm` (30/09) — sem base do GSC.
- Título antes: "Calculadora de 1RM: Descubra sua Carga Máxima" → depois: "Calculadora de 1RM: Carga Máxima e Tabela de Porcentagem".
- FAQ visível + FAQPage (4: o que é, cálculo com Epley e Brzycki, tabela de %, protocolo do teste). Calculadora não alterada.

`/ferramentas/zonas-de-frequencia-cardiaca` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Zonas de Frequência Cardíaca por Idade" → depois: "Zonas de Frequência Cardíaca: Calculadora por Idade (Z1 a Z5)".
- FAQ visível + FAQPage (5: as 5 zonas, Z1–Z5 corrida/ciclismo, aeróbica × anaeróbica, queima de gordura, Garmin/Apple Watch/Strava). Calculadora não alterada.

`/ferramentas/calculadora-calorias-caminhada` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Calorias da Caminhada: Tempo, Km e Passos" → depois: "Calorias da Caminhada: Calculadora por Tempo, Km e Passos".
- Tabela nova por distância (1, 3, 5, 7, 10 km), +4 FAQs (km, 2 horas, 500 kcal, diabetes/OMS 150–300 min). Números saem de lib/caminhada.ts. Calculadora não alterada.

`/ferramentas/calculadora-calorias-bicicleta` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Calorias na Bicicleta: Rua e Ergométrica" → depois: "Calorias na Bicicleta: Calculadora para Rua e Ergométrica".
- +5 FAQs do print (500 kcal, 20 min ergométrica leve/horizontal, 1 km, 40 min/dia, hérnia de disco), números calculados por lib/bicicleta.ts. Calculadora não alterada.

`/ferramentas/calculadora-whey` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Whey Protein: Quanto Tomar por Dia?" → depois: "Quanto Whey Tomar por Dia? Calculadora por Peso e Objetivo" (termo exato do autocompletar primeiro).
- +5 FAQs do print (70 kg, mais de 30 g, 2x/dia e 4 scoops, Mounjaro/GLP-1, cálculo renal e gastrite → médico). Calculadora não alterada. Fora: Growth, Integralmédica.

`/ferramentas/calculadora-creatina` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Creatina: Quanto Tomar por Dia?" → depois: "Quanto de Creatina Tomar por Dia? Calculadora e Tabela por Peso".
- +5 FAQs (70 kg, 10 g, 20 g/saturação, colher/scoops, hipertrofia). Calculadora não alterada. Fora: Dark Lab, Growth.

`/ferramentas/calculadora-corrida` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Corrida: Pace, Tempo e Calorias" → depois: "Calculadora de Pace: Corrida, Esteira (km/h), Tempo e Calorias".
- Tabela nova pace × km/h × tempo (5k, 10k, meia, maratona), +3 FAQs (cálculo manual, converter para esteira, meia maratona). Calculadora não alterada. Fora: Tempo Run, Corrida Perfeita, Strava; "pace natação" (outra conta, por 100 m).

`/ferramentas/composicao-corporal` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Composição Corporal e Bioimpedância" → depois: "Percentual de Gordura: Composição Corporal e Bioimpedância".
- +4 FAQs (como se calcula: fita/Marinha, dobras Jackson-Pollock 3/7, bioimpedância, DXA; 20%; 23%; 70 kg é gordo?). Calculadora não alterada.
- Descompasso de intenção: a busca quer CALCULAR o % (fita ou dobras); a ferramenta parte do % pronto. Proposta ao Montinho: modo "estimar pela fita (Marinha)" — decisão dele.

`/ferramentas/simulador-emagrecimento` (30/09) — sem base do GSC.
- Título antes: "Simulador de Emagrecimento: Quanto Tempo até a Meta?" → depois: "Quanto Tempo para Emagrecer 10 kg? Simulador de Emagrecimento".
- +5 FAQs (10 kg em 1 mês/20 dias, 2 ou 3 meses, caminhando, na academia, sem comer), faixa 0,5–1%/semana de lib/meta.ts. Simulador não alterado. Fora: "cardápio para perder 10 kg pdf" (pauta de isca), livro Dieta do Metabolismo Rápido.

`/ferramentas/calculadora-volume-treino` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Volume de Treino: Séries por Músculo" → depois: "Quantas Séries por Semana para Hipertrofia? Calculadora de Volume".
- FAQ visível + FAQPage (6: séries por grupo/músculo, 3 ou 4 séries, repetições/7 reps, 3×15 vs 4×12, exercícios por treino, 4x/semana). Calculadora não alterada.

`/ferramentas/calculadora-calorias-natacao` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Calorias na Natação: Por Nado e Tempo" → depois: "Natação Gasta Quantas Calorias? Calculadora por Nado e Tempo".
- +5 FAQs (1 km/500 m/2 km com premissa de 30 min/km, 45/50 min, aula de iniciante, × corrida/academia, diabetes/insuficiência cardíaca → médico). Números de lib/natacao.ts. Calculadora não alterada.

`/ferramentas/calculadora-calorias-pular-corda` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Calorias Pulando Corda: Blocos e Saltos" → depois: "Pular Corda Gasta Quantas Calorias? Calculadora por Tempo e Saltos".
- +4 FAQs (por minuto e 5/15/20/30 min, 100/200/500 pulos, equivalente a 1 h de caminhada e × corrida, diabetes/gravidez → médico). Números de lib/corda.ts e lib/caminhada.ts. Calculadora não alterada.

`/ferramentas/calculadora-calorias-spinning` (30/09) — sem base do GSC. Já aparece na 1ª página para "spinning gasta quantas calorias" (print de 30/09).
- Título antes: "Calculadora de Calorias no Spinning: Watts e Aula" → depois: "Spinning Gasta Quantas Calorias? Calculadora por Aula e Watts".
- +4 FAQs (30/40/45/50 min, × musculação, × esteira, frequência/todo dia). Números de lib/spinning.ts. Calculadora não alterada. Fora: "antes e depois", "como fica o corpo" (fotos, sem fonte).

`/ferramentas/calculadora-calorias-escada` (30/09) — sem base do GSC. Já aparece na 1ª página para "subir escada gasta quantas calorias" (print de 30/09).
- Título antes: "Calculadora de Calorias Subindo Escada: por Andar" → depois: "Subir Escada Gasta Quantas Calorias? Calculadora por Andar e Tempo".
- +5 FAQs (5 a 60 min, 5/8/10/12/14/18 andares, 100 degraus, 20 min emagrece, gravidez/insuficiência cardíaca → médico). Números de lib/escada.ts. Calculadora não alterada.

`/ferramentas/calculadora-calorias-danca` (30/09) — sem base do GSC. Já na 1ª página para "dança gasta quantas calorias".
- Título antes: "Calculadora de Calorias na Dança: Forró, Funk e Salão" → depois: "Dança Gasta Quantas Calorias? Calculadora por Ritmo e Tempo".
- +4 FAQs (20/30/60/120 min, 1 h por dia e quilos, dança do ventre/K-pop/em casa, hérnia de disco → médico). Calculadora não alterada.
