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

`/ferramentas/calculadora-calorias-futebol` (30/09) — sem base do GSC.
- Título antes: "Calculadora de Calorias no Futebol: Pelada e Futsal" → depois: "Futebol Gasta Quantas Calorias? Calculadora de Pelada e Futsal".
- +4 FAQs (30/40/60 min, jogador por jogo, qual esporte gasta mais/1.000 kcal, 2 mil kcal por dia). Números de lib/futebol.ts. Calculadora não alterada.

`/ferramentas/calculadora-calorias-zumba` (01/10) — sem base do GSC.
- Título antes: "Calculadora de Calorias na Zumba: Aula e Quilos" → depois: "Calculadora de Zumba: Calorias por Aula, 30, 45 Minutos e 1 Hora".
- +3 FAQs (45 min, 2x por semana, 7.000 kcal/4 kg em 15 dias). Calculadora não alterada. Fora: "zumba online grátis/para iniciantes" (aula, não calculadora), "pão com 2 ovos".

`blog/caminhada-na-esteira-inclinada` (01/10) — sem base do GSC.
- Ferramenta trocada: calculadora de FC → calculadora de caminhada (conta do leitor: calorias do 12-3-30). Decisão do Montinho.
- Título antes: "Caminhada Inclinada na Esteira: Método 12-3-30 Funciona?" → depois: "Método 12-3-30 na Esteira: Funciona? Calorias e Como Fazer".
- Seção nova: calorias por peso (lib/caminhada.ts), quanto é 12% de inclinação, 12-5-30. +3 FAQs (funciona, minutos para 1 kg, 30 min todo dia). updatedAt 01/10.

## 2026-09-30 — por-que-ramon-dino-perdeu-mr-olympia-2026 (novo) e resultado-classic-physique-mr-olympia-2026
- Prints: "por que ramon dino perdeu" e "ramon dino lesão". PAA: para quem perdeu, o que aconteceu no Olympia, qual a polêmica, o que aconteceu hoje, lesão.
- Novo artigo com H2/FAQ dessas perguntas. Resultado: top 5 completo, premiação, declaração de Ramon (updatedAt 30/09).
- Fora de escopo (pauta): "por que Ramon saiu da Max / da Growth", "quantos cm de braço" — sem fonte verificada ainda.

## 2026-09-30 — /ferramentas/calculadora-calorias-eliptico
- Antes: "Calculadora de Calorias do Elíptico: Por Tempo e Peso"
- Depois: "Calorias no Elíptico: 10, 20, 30 Minutos e 1 Hora (Calculadora)"
- Prints "elíptico calorias": por minuto, 10/15/20/30/40 min, 1 hora, gastas, calculadora; PAA 30 min, perder barriga, elíptico x esteira, 20 min emagrece; relacionadas elíptico x bicicleta, benefícios abdômen, para que serve.
- Tabela por tempo passa a ter 15 e 40 min; kcal por minuto no texto; FAQ: por minuto, 15, 40, 1 hora, 20 min emagrece, elíptico x bicicleta; "perder barriga" reescrito como pergunta real. Calculadora intocada.

## 2026-09-30 — /ferramentas/calculadora-calorias-boxe
- Antes: "Calculadora de Calorias no Boxe: Aula e Rounds"
- Depois: "Boxe Queima Quantas Calorias? 30 Minutos, 1 Hora e Aula"
- Prints "boxe calorias": treino/aula, 20 min, 30 min, 1 hora, por hora, sombra, queima/perde; PAA 1h de boxe, boxe x academia, qual luta queima mais, 500 kcal em 30 min; relacionadas musculação 1h, muay thai, luva/treino de boxe.
- Seção nova "Boxe por tempo: 20, 30 minutos e 1 hora" (sombra/saco/sparring, 70 kg) com link para jiu-jitsu; FAQ: 1h, 30 min, 20 min, sombra, qual luta queima mais (rola x sparring), 500 kcal em 30 min. Calculadora intocada.
- Pauta: muay thai (sem ferramenta), luva de boxe (fora do tema).

## 2026-09-30 — /ferramentas/calculadora-calorias-jiu-jitsu
- Antes: "Calculadora de Calorias no Jiu-Jitsu: Aula e Rolas"
- Depois: "Jiu-Jitsu Queima Quantas Calorias? Por Hora, Aula e Rola"
- Prints "jiu jitsu calorias": por hora, queima (muitas) calorias, treino/aula, perde, gastas, kcal; PAA arte marcial que mais queima, emagrece antes e depois, hérnia de disco; relacionadas musculação 1h, muay thai, tabela de MET, kimono.
- Seção "Jiu-jitsu: calorias por hora" (60–100 kg: só técnica, aula com 3 rolas, rola sem parar) + tabela de MET e link para o boxe; FAQ: por hora, queima muitas calorias?, arte marcial que mais queima, tabela de MET. Calculadora intocada.
- Pauta: hérnia de disco e jiu-jitsu (saúde, precisa fonte), muay thai; kimono fora do tema.

## 2026-09-30 — /ferramentas/calculadora-calorias-muay-thai (NOVA)
- Título: "Muay Thai Queima Quantas Calorias? Por Hora e Por Aula"
- Prints "muay thai calorias": por hora, gastas, queima (muitas), treino, quantas perde em 1 hora; PAA arte marcial que mais queima, academia x muay thai, ajuda a emagrecer, define o corpo; relacionadas emagrece quantos quilos por semana, 1 hora queima quantas, define o corpo feminino, benefícios/malefícios.
- Motor lib/muaythai.ts: Compêndio 2011, 15425 (5,3 METs, técnica) e 15430 (10,3, ritmo de luta, cita muay thai), descanso 1,3. Rounds fortes = manopla, saco em ritmo de luta, sparring. METs importados do jiu-jitsu.
- Embutida em /blog/muay-thai-emagrece (ARTIGOS_COM_CALCULADORA_MUAY). Tag "muay thai" saiu do cartão do boxe no catálogo.
- Pauta: benefícios do muay thai (mente, corpo feminino/masculino, adolescentes), desvantagens, define o corpo em quanto tempo.

## 2026-09-30 — /ferramentas/calculadora-calorias-crossfit
- Antes: "Calculadora de Calorias no CrossFit: Aula e WOD"
- Depois: "CrossFit Queima Quantas Calorias? Por Hora, Aula e WOD"
- Prints "crossfit calorias": por hora, por treino/aula, iniciante, 1 hora, 30 e 50 minutos, remo, air bike, gasta mais que musculação, conversor; PAA 1 hora, academia x crossfit, elimina barriga, artrite reumatoide; relacionadas resultados 1 mês, emagrece quantos quilos/em quanto tempo, define o corpo, dá músculo.
- Seção "CrossFit: calorias por hora e por minuto" (60–100 kg) com link para HYROX; FAQ: 1 hora, por minuto, 30 min, 50 min, iniciante, CrossFit x musculação (resposta honesta: aula inteira ≈ 1 h de musculação vigorosa), remo (8,5 METs, mesmo valor da calculadora de HYROX). Calculadora intocada.
- Pauta: air bike (sem MET verificado), artrite reumatoide (saúde, fonte médica), resultados em 1 mês, CrossFit dá músculo.

## 2026-09-30 — /ferramentas/calculadora-calorias-hyrox
- Antes: "Calculadora de Calorias no Hyrox: Prova e Estações"
- Depois: "HYROX Queima Quantas Calorias? Prova, Treino e Estações"
- Prints "hyrox calorias": treino calorias, queima/gasta quantas, ou crossfit, nutrition, campeonato; PAA quantas calorias, peso oficial, 10 esportes que mais queimam, precisa musculação. A visão por IA cita "www.mo..." com o ícone M (provável fonte: este site).
- Seção "Treino de HYROX: quantas calorias?" (60–100 kg; 10 aquecimento + 40 circuito no MET médio das estações + 10 pausa, estimativa declarada) com link para CrossFit; FAQ: por hora, treino, HYROX x CrossFit, precisa musculação. Calculadora intocada.
- Pauta: peso oficial das estações (precisa fonte oficial HYROX), nutrição para HYROX, esportes que mais queimam calorias.

## 2026-09-30 — /ferramentas/previsor-sao-silvestre
- Antes: "Previsor São Silvestre 2026: Qual Seu Tempo nos 15 km?"
- Depois: "Previsor São Silvestre 2026: Tempo Médio e Seu Tempo nos 15 km" (a marca "Previsor São Silvestre 2026" já aparece no autocompletar; mantida no início).
- Prints "são silvestre tempo" e "são silvestre 15km": tempo médio, recorde, de prova, limite, máximo, do vencedor, real, 2025; PAA recorde, tempo médio 21 km, quantos km 2026, tempo máximo; relacionadas 42 km, quantos km, percurso, inscrição, valor, premiação, vencedores, pódio 2025.
- Seção "Tempo médio e pace na São Silvestre" (1h10 a 2h30 → pace) + recorde masculino 42min59s (Kandie, 2019: Gazeta Esportiva, Tupi, Wikipédia), vencedores 2025 44min28s / 51min08s (CNN, Olympics.com, SBT), tempo limite 2h30 da última onda (regulamento oficial 2025). FAQ: recorde, vencedor, tempo limite, quantos km, pace para 1h30, 42 km?
- Fora: recorde feminino (fontes divergem: 48min35s x 48min48s), "sempre foi 15 km" (precisa 2 fontes), inscrição/valor (já no artigo de inscrição), 21 km (outra prova).

## 2026-09-30 — /consultoria-online (landing page do Google Ads)
- Antes: "Consultoria Online de Treino | Personal Trainer Online — Montinho"
- Depois: "Consultoria Online de Treino Personalizado com Personal Trainer" (+ " | Montinho Personal Trainer" do template; o título antigo repetia a marca); descrição com "personal trainer online" e "como funciona".
- Prints "consultoria online de treino" e "personal trainer online": como funciona, e dieta, academia, personalizado, valor, grátis, vale a pena, melhor, mulher, ao vivo, barato; PAA valor, vale a pena, melhores consultorias, melhor aplicativo, 3x por semana.
- Só FAQ (topo, CTAs e ordem intocados; sem preço): como funciona, vale a pena, online x presencial, inclui dieta (não), como escolher, versão grátis (não, confirmado pelo Montinho), serve para mulheres; "Quanto custa" virou "Qual o valor de uma consultoria online de personal trainer?".
- Medir: taxa de conversão da campanha antes x depois de 30/09 (mudança única, para atribuição).
- Fora: "ao vivo" e "melhor aplicativo" (não confirmado se há aula ao vivo ou app).

## 2026-10-01 — /consultoria-online e /consultoria (reposicionamento de copy)

Marco para comparar conversão do Google Ads antes/depois (landing page
/consultoria-online). Mudou SÓ texto visível: subtítulo do hero, frase da
prova no topo, seção "O que acontece depois que o treino chega" (antes
"Tudo o que está incluso"), passos 4–5, um item do comparativo, fechamento,
rótulos "Falar com o Montinho" (botão final e barra fixa). Saiu a frase de
escassez ("número limitado de alunos"). Preservados: URL, H1, title, meta
description, schema, mensagens do WhatsApp, data-cta/eventos. Comparar
taxa de clique no WhatsApp/sessão e leads com Ref da LP: 14 dias antes ×
14 dias depois.

## 2026-10-05 — Mapa Muscular: páginas de grupo (/exercicios/*)

Seções `extras` a partir dos prints: peito, glúteos, posterior de ombro,
costas (description nova aprovada), bíceps, tríceps, abdômen, quadríceps.

- **Pauta: "treino de abdômen rápido"** (Outras pessoas pesquisaram, em
  exercícios para abdômen). Canibalização: já existem
  `treino-de-abdomen-em-casa`, `quantos-abdominais-por-dia`,
  `treino-de-30-minutos-funciona` e `abdomen-inferior-exercicios`. Antes
  de artigo novo, avaliar virar seção "treino rápido (10–15 min)" em
  `treino-de-abdomen-em-casa`. Pedir prints de "treino de abdômen rápido".
- Pauta: "treino de costas completo pdf" (isca, fora da página de grupo).

## Registro de prints por ferramenta (conferido em 06/10/2026)

Antes de pedir prints, conferir esta lista E o histórico do git
(`git log -i --grep="intenç\|prints\|buscas"`). Em 06/10 uma lista de
"pendentes" saiu errada porque várias páginas não estavam registradas aqui.

Com prints aplicados: Beliscômetro (02/10, #658), Simulador do Fim de Semana
(24/09, #487), Whey (03/10, #670), Simulador de Ganho de Massa (#711),
Muay thai (#712), Calorias por atividade, Potencial natural (#714), Quanto
tempo para ter shape (#715), Polichinelos (#716, título em #776), Teste de
mobilidade (#717), Monte seu Cardápio (#718), Massa magra GLP-1 (#719),
Artes marciais (#720), Classic Physique (#721), Conversor U-100 (#722), Meu
Shape 12 semanas (#723), Mata a Vontade (#724), Caminhada (#725),
Musculação (#726), Passos (#731), Percentual de gordura (#732), Teste de
Cooper (#733), IMC (#737), Descanso entre séries (#739), Substituidor
(#743–#746), Comparador (#764–#766), Corrida, Bicicleta, Meta de peso,
Consultoria online (#608), São Silvestre (#607), HYROX (#606).

Prints de 06/10 aplicados: Treino Para Minha Rotina (3x e 4x por semana),
Superávit calórico, Relação cintura-altura, Cafeína. Fora/pauta: "treino 3x
semana pdf" (isca), "superávit calórico preço/onde comprar/remédio"
(produto homônimo), "relação cintura-quadril" (outra ferramenta),
"quanto tempo diminui a barriga", "o que comer antes de treinar de manhã".

### habitos-que-sabotam-seu-emagrecimento (06/10)
- Prints "hábitos que atrapalham o emagrecimento": +6 FAQs (o que mais atrapalha / maior vilão, idade mais difícil — Pontzer 2021, sinais de metabolismo lento, hormônio, 10 kg em 7 dias, perda de peso preocupante → médico).
- Fora: frases, artigo científico, "5 alimentos que não deixam emagrecer", tabela de alimentos e o que comer (nutrição), doenças que causam perda de peso (saúde).
- Pendente aprovação: metaDescription termina em "..." (mostrar ATUAL/PROPOSTA/MOTIVO).

### como-prevenir-lesoes-no-treino (06/10)
- Prints "como prevenir lesões na musculação": +6 FAQs (evitar lesão muscular, como saber se lesionei, tipos de lesão, machuquei a lombar → travou-a-lombar, exercícios que prejudicam a coluna, malhei perna e não consigo andar → DOMS). Sem diagnóstico: sinais de alerta → médico/fisioterapeuta.
- Fora: pdf, artigo científico, musculação emagrece, benefícios da musculação feminina, "o que tomar" (remédio).

### erros-comuns-no-treino-de-musculacao (06/10)
- Prints "erros na musculação": +4 FAQs (erros no ganho de massa, pior inimigo da hipertrofia, carga leve demais, amplitude/descida). Já cobria erro mais comum e quantas vezes por semana. O artigo aparece no autocompletar do Google.

### por-que-voce-nao-consegue-emagrecer (06/10)
- Prints "por que não consigo emagrecer": +8 FAQs (mesmo com dieta e exercício, já tentei de tudo, não consigo parar de comer, doença/hormônio, menopausa, Mounjaro → dose é do médico, jejum intermitente, barriga).
- Fora: livro, Desire Coelho (pessoa), frases, "5 alimentos" (nutrição), "estou deprimida" (saúde mental — não tratar em FAQ).

### como-nao-perder-o-shape-no-natal (06/10)
- Prints "como não engordar no natal": +4 FAQs (como não engordar, 10 kg até o Natal, 4 kg em um mês, o que mata a fome). Fora: gestação/gravidez, barriga, "o que jantar à noite" (cardápio).

### como-aproveitar-ceia-sem-exagerar (06/10)
- Prints "ceia de natal saudável": +5 FAQs (como fazer, o que comer sem engordar, light/low carb, simples e barata, sobremesa fit). Sem cardápio nem receita (regra de não prescrever nutrição).
- Pauta: "receitas de natal saudáveis", "lista de ceia para 20 pessoas" (fora do escopo). "Opções de ceia antes de dormir" é outro sentido de ceia.

### como-manter-dieta-festas-fim-de-ano (06/10)
- Prints: +5 FAQs (pular refeições antes da festa, álcool, quantos kg até o Natal, desinchar 3 kg em 3 dias, voltar à dieta depois). Fora: pdf/livro, "o que comer na ceia à noite" e "que comida servir" (cardápio).

### como-evitar-ganhar-peso-nas-ferias (06/10)
- Prints "como não engordar nas férias": +4 FAQs (buffet/café incluso, 2 kg em 1 semana, desinchar depois das férias, se movimentar sem treinar). Já cobria o que comer, álcool, treino sem academia.

### como-manter-massa-muscular-nas-ferias-verao (06/10)
- Prints "perder massa muscular nas férias": +4 FAQs (1 semana, 15/20 dias, recuperar / memória muscular, preciso treinar nas férias). Um dos prints era de outra busca ("banco do povo") e foi ignorado.

### o-que-fazer-entre-natal-e-ano-novo (06/10)
- Prints "treino entre natal e ano novo": +4 FAQs (treino curto em casa, treinar de ressaca, método 12-3-30, treinar pouco perde o resultado). Fora: frase para treinar no frio, meta de treinos por ano.

### como-voltar-rapidamente-apos-festas (06/10)
- Prints "voltar a treinar depois das festas": +4 FAQs (como voltar, depois de 2 semanas, depois de 1 mês ou mais, academia depois do jantar). Fora: frase motivacional; 12-3-30 já está em o-que-fazer-entre-natal-e-ano-novo.

### como-voltar-rotina-depois-do-carnaval (06/10)
- Prints "voltar à rotina depois do carnaval": +3 FAQs (como voltar à rotina, retomar treinos após tempo parado, treinar ajuda a voltar ao ritmo). Fora: "o que significa voltando a rotina", "por que a Quaresma acontece depois do Carnaval".

### como-voltar-academia-depois-de-parado (06/10)
- Prints "como voltar a treinar depois de parado" aplicados NESTE artigo (não em como-recuperar-ritmo-dos-treinos): é ele que já recebe a busca (237 impressões, posição 7,7, contra 8 impressões do outro). Evita canibalização.
- +7 FAQs (1 semana, 1 mês, 3 meses, anos, quanto tempo para perder músculo, memória muscular, ânimo). Fora: frases, "tem crase", vídeos.

### vale-a-pena-comecar-academia-agora (07/10)
- Prints "vale a pena começar academia": +6 FAQs (vale a pena fazer academia, 1x por semana, pagar academia cara, resultado com 1 mês, 30 minutos por dia, musculação emagrece). Fora: "é vantajoso abrir uma academia" (outra intenção), "prancha".

### retatrutida-faz-perder-musculos (07/10)
- Prints "retratutida perde massa magra" (busca que mais cresceu no artigo: 31 → 98 impressões/semana): +6 FAQs (perde massa magra, preserva massa muscular, quantos kg se perde, como age, perdi muita massa magra, é melhor que Mounjaro). Grafia "retratutida" incluída. Fora: perde cabelo, dose, efeito colateral (decisão médica / outra pauta), bimagrumabe (já tem artigo).

### como-manter-motivacao-apos-carnaval (07/10)
- Prints "como manter a motivação para treinar": +6 FAQs (ter motivação para malhar, motivação na academia, treinar em casa, sem disposição, o que tomar para ter ânimo, 3 pilares da musculação). Fora: frases/status, motivação para estudar, "3 elementos da motivação", como motivar alguém.
- Obs.: o anúncio da campanha "Pesquisa | Consultoria Online | Conversão" aparece nessa busca (marcada como qualificada).

### Batalha dos Wheys — /ferramentas/comparador-whey-protein (prints 08/10, ainda não publicada)
- "comparador de whey": autocompletar = comparador de whey protein, comparador whey isolado. Concorrentes: myfoodcompare, Compare Suplementos, calculadora da própria Growth, Proteste. IA = tipos (concentrado/isolado/hidrolisado). Relacionadas: whey dux, whey growth, whey isolado, teste whey anvisa, teste whey inmetro, proteste whey, calculadora whey gorgonoid.
- "melhor whey custo benefício": autocompletar = 2026, isolado, do mercado, reddit, para emagrecer, e sabor, hoje. PAA = 5 melhores whey; por que a Growth é tão barata; marca mais confiável; mais gostoso e barato. Relacionadas: para ganhar massa, 100% puro, growth, para emagrecer e definir.
- Decisão: uma página (comparador) cobre "comparador" + "custo-benefício"; "confiável / teste Anvisa-Inmetro-Proteste" vira seção com fonte, nunca selo inventado; "isolado" fica como filtro/modo, não página separada, até ter dados.

### personal-trainer-alphaville (08/10) — primeiro teste com Answer the Public
- Export "personal trainer alphaville": personal trainer alphaville (90/mês), em alphaville (30), alphaville sp (10); demais termos sem volume. Os dois CSVs recebidos eram idênticos.
- PAA (23 perguntas): a página já cobria 1h, 3x/semana e "é vantajoso". +4 FAQs: 2x/semana dá resultado; quanto tempo dura a aula; academia sem personal dá resultado; como funciona o pagamento (sem preço publicado).
- Fora: "ironberg alphaville" (atendimento não confirmado lá), nome de outra profissional, "personal mulher", "quanto ganha um personal CLT" (intenção de quem quer ser personal), "pode treinar 1 hora da manhã".
- Processo: a partir daqui o export do Answer the Public + 1 print da primeira página substitui os 4 prints (regra no AGENTS.md).

### personal-trainer-barueri (08/10) — Answer the Public
- Export: "personal trainer em barueri" 110/mês (CPC US$ 0,56). Novidade do export: prompts de ChatGPT/Gemini (preço, a domicílio, online, emagrecimento, iniciantes, reabilitação, "como escolher", "academias com personal incluso", "feminina").
- A página já cobria 1 mês, 3x/semana, 3 ou 5 vezes, é vantajoso, domicílio, online, iniciantes, idosos, emagrecimento. +4 FAQs: quanto custa 2x/semana (sem valor); melhor com ou sem personal; diferença coach × personal; como escolher personal em Barueri.
- Fora: salário/faculdade/bio do Instagram/"outros nomes" (intenção de quem é ou quer ser personal), "qual horário o músculo cresce" (pauta de blog), "personal feminina", "academias com personal incluso" (não afirmar academia não confirmada).
- 08/10, 2º export (modelos de IA): ChatGPT cita "Montinho" entre os personal trainers de Alphaville "com avaliações positivas" (ao lado de outros 4 nomes). +2 FAQs: quanto custa 2x/semana (sem valor) e como escolher um bom personal em Alphaville. Pendentes de confirmação do Montinho: treino ao ar livre e em grupos pequenos/dupla.

### personal-trainer-tambore (08/10) — Answer the Public
- Export sem aba de volume do Google; PAA quase igual ao de Alphaville (+ Smart Fit, Goiânia/Fortaleza). Prompts de IA: emagrecimento, grupo, iniciantes, reabilitação, avaliação física completa, domiciliar, horários flexíveis, online, hipertrofia, "como escolher".
- A página já cobria 1h, 3x/semana, taxa de personal externo, é vantajoso, iniciantes/60+, restrições, pouco tempo, online. +4 FAQs: 2x/semana (sem valor), duração da aula, como funciona o pagamento, como escolher (com regra de condomínio para personal externo).
- Fora: Smart Fit (preço/salário/diária), outras cidades, salário CLT, "pode treinar 1 hora da manhã". Pendente de confirmação: treino em grupo e avaliação física completa.
- 08/10: Montinho confirmou treino ao ar livre, em dupla/grupo pequeno e avaliação física. +3 FAQs em cada página local (Alphaville, Barueri, Tamboré), com redação diferente por página.

### personal-trainer-santana-de-parnaiba (08/10) — Answer the Public
- Export sem volume do Google. PAA: valor médio, 3 ou 5 vezes, 1 mês, 3x/semana, vale a pena, "3 motivos para treinar com personal". IA: domicílio, online, emagrecer, hipertrofia, reabilitação, "o que perguntar a um personal", agendar avaliação, aula experimental.
- A página já cobria valor/1h/3x, vale a pena, emagrecer, condomínio, frequência, iniciantes, idosos, online, casa. +6 FAQs: 3 ou 5 vezes; 3 motivos; o que perguntar antes de contratar; ar livre; dupla/grupo; avaliação física.
- Fora: Teresina, "melhores personal trainers do Brasil", horário em que o músculo cresce (pauta). Pendente: aula experimental (confirmar se existe).

### blog/personal-trainer-aldeia-da-serra (08/10) — Answer the Public
- PAA: 1h, 2x/semana, 3 ou 5 vezes, diferença instrutor × personal (cluster forte), Ironberg/CrossFit (fora). IA: domicílio, emagrecimento, idosos, reabilitação, hipertrofia, "como escolher", sessão experimental.
- Já cobria: 1 mês, 3x, é vantajoso, emagrecer, divisa Barueri/Santana, condomínio, casa, ar livre, restrição médica, lombar, deslocamento. +6 FAQs: instrutor × personal; 3 ou 5 vezes; 2x/semana (sem valor); dupla/grupo; avaliação física; como escolher. updatedAt 08/10.
- Fora: Ironberg, CrossFit, salário de instrutor, "como se escreve personal trainer", "maior academia do mundo".

### PAA dos exports locais → FAQ de artigos existentes (08/10)
Perguntas informativas que apareceram nos exports locais e já tinham artigo (sem criar página nova, para não canibalizar):
- sono-e-crescimento-muscular: "Qual horário o músculo cresce?" (Barueri, Santana, Aldeia).
- frequencia-de-treino: "É melhor treinar 3 ou 5 vezes na semana?".
- quanto-tempo-para-aparecer-resultado-na-academia: "É possível ver resultado com 1 mês de academia?".
- primeira-semana-na-academia: "O que muda no corpo com 1 semana de academia?".
updatedAt 08/10 nos quatro. Artigo novo candidato: instrutor × coach × personal (aguarda export + print).

### blog/diferenca-entre-instrutor-de-academia-e-personal-trainer (novo, 08/10)
- Export + prints "diferença entre instrutor e personal trainer": volume ~40/mês somando variações. Autocompletar: instrutor de academia e personal, precisa ser formado, o que faz, é professor, quanto ganha, precisa de faculdade, plural. PAA: é o mesmo que personal; é obrigatório ter instrutor; quanto custa 1h; instrutor é professor. IA: atendimento coletivo × exclusivo, custo incluso × à parte, ambos formados com CREF. Concorrentes: UniFOA, Engenharia do Corpo, vídeos YouTube/Instagram.
- Fato com fonte: Lei nº 9.696/1998 (Planalto), com redação da Lei 14.386/2022 para o diploma.
- Fora: salário/CBO/faculdade como carreira, plural/grafia, instrutor de autoescola. "É obrigatório ter instrutor na academia?" ficou de fora por falta de fonte oficial verificada.
- Ferramenta: ARTIGOS_SEM_FERRAMENTA.

### blog/treinar-2-vezes-por-semana-da-resultado (novo, 08/10)
- Export + prints "treinar 2 vezes por semana": principal "treinar 2 vezes por semana dá resultado" (40/mês); "treinar perna 2 ou 3 vezes" (40, pauta à parte); YouTube "treinar duas vezes por semana" (30). Autocompletar/relacionadas: é bom, emagrece, hipertrofia, full body, divisão, feminino, o mesmo músculo. PAA do export quase todo fora do tema (fibromialgia, bursite, nutrição). SERP: Hipertrofia.org, Smart Fit, Correio Braziliense, YouTube (Leandro Twin).
- Canibalização: quantos-dias-por-semana-treinar é o guia geral (GSC sem buscas de "2 vezes"); o novo artigo foca o cenário de 2 dias e linka para ele, para full-body-vs-divisao-abc e treinar-o-mesmo-musculo-duas-vezes-por-semana.
- Fontes: OMS 2020 (≥2 dias/semana de fortalecimento), Schoenfeld 2016 (PMID 27102172) e Schoenfeld, Grgic, Krieger 2019 (doi 10.1080/02640414.2018.1555906).
- Ferramenta: link da calculadora de volume (ARTIGOS_COM_LINK_VOLUME; embed no teto).
- Achado: 2 artigos antigos citam o PMID 27102172 como "Ralston et al."; o registro é de Schoenfeld 2016. Correção pendente de aprovação.

### Personal a domicílio — 5 páginas (08/10) — Answer the Public
- Export "personal trainer a domicílio": 50/mês (Google e YouTube), "em domicílio" 10, "valores" 10; muito ruído em espanhol/italiano. PAA: hora do personal, 3 ou 5 vezes, "definir o corpo treinando em casa", "ficar musculoso em casa", personal × educador físico. IA: idosos, avaliação física inicial, equipamento, emagrecimento, planos, pagamento com cartão, aula experimental.
- Ritmo: 5 páginas num PR só (mesmo tipo de mudança, texto diferente por página, revertível em um commit).
- +2 Alphaville (definir em casa, idosos); +4 Barueri (músculo em casa, equipamento, idosos, avaliação); +3 Aldeia, +3 Santana, +3 Tamboré (resultado em casa, idosos, avaliação). updatedAt 08/10 nos 4 posts do blog.
- Fora: Smart Fit Coach, salário, faculdade, insuficiência cardíaca/diabetes (médico), "10 agachamentos por dia". Pendentes de confirmação: pagamento com cartão, aula experimental.

### Personal em condomínio (08/10) — Answer the Public + confirmações
- Export "personal trainer condomínio": "em condomínio" 10/mês. PAA: Wellhub/Gympass, 3 ou 5 vezes, salário, academia de condomínio (custo, regras). IA: idosos, grupos/casais, avaliação física, credenciais/requisitos legais, aula experimental, online.
- condominio-tambore +3 (idosos, aula experimental, credenciais/CREF com Lei 9.696); blog em-condominio-alphaville +3 (idosos, aula experimental, credenciais); blog para-condominio-alphaville +3 (dupla, avaliação, aula experimental). updatedAt 08/10 nos posts.
- Montinho confirmou cartão de crédito e aula experimental (08/10): frase de cartão nas respostas de pagamento (Alphaville, Tamboré); +aula experimental em Alphaville, Tamboré, Barueri, Santana, Aldeia; +cartão em Barueri, Santana, Aldeia.
- Fora: Wellhub/Gympass, salário/piso, custo de montar academia no condomínio, Smart Fit.
- Obs.: há dois posts de condomínio em Alphaville (em-condominio e para-condominio) com intenção muito próxima — candidatos a consolidação.

### Quanto custa personal trainer — 5 páginas locais (08/10) — Answer the Public
- Export: "quanto custa um personal trainer" 2,9 mil/mês; "por mês" 320; "particular" 140; "hora" 110 (Bing); "contratar" 70; "na smart fit" 50; "2 vezes por semana" 20; "online" 20; várias capitais (fora da área).
- +3 Tamboré (2x, online mais barato, pagamento/cartão); +4 Alphaville (2x, por mês, online, cartão); +3 Barueri, +3 Santana, +3 Aldeia (2x, por mês, cartão). Nenhum número novo; a faixa de Alphaville é a já aprovada. updatedAt 08/10 nos posts.
- Pauta aberta: artigo nacional "quanto custa um personal trainer" (2,9 mil/mês) — depende de decisão sobre publicar faixa de preço com fonte.

### blog/quanto-custa-um-personal-trainer (novo, 08/10)
- Export + prints "quanto custa personal trainer": 2,9 mil/mês; por mês 320; particular 140; hora 110; contratar 70; Smart Fit 50; 2x/semana 20; online 20. SERP: visão geral por IA (PersonalGO, R$ 50–400/sessão; tabela por capital), Smart News (Smart Fit), Superprof, Reddit, YouTube; relacionadas: mensal, 2 e 3 vezes, SP, online, Bluefit/Gaviões/Panobianco/Smart Fit, perto de mim.
- Decisão do Montinho (08/10): opção 2 — faixa de mercado com fonte, sem preço próprio. Fontes: Neon (R$ 80–200/h em grandes cidades) e Superprof (média ~R$ 99/h em SP, 1ª aula grátis na maioria), conferidas pelo buscador em 08/10 (domínios bloqueados no ambiente). A tabela por capital da visão geral por IA NÃO entrou (fonte única, não verificada).
- Conta do mês em tabela (sessão × treinos × 4,3) com R$ 100 como exemplo explícito. Links para as 5 páginas locais de preço.
- Ferramenta: ARTIGOS_SEM_FERRAMENTA. Fora: preço de rede específica (Smart Fit/Bluefit etc.), salário, capitais.

### blog/bluefit-barueri (08/10) — Answer the Public
- GSC 28 dias: 231 impressões, 0 cliques, posição 8,7. Export: "bluefit barueri" 1,9 mil/mês; "avenida trindade bethaville" 90; "bethaville" 40; fotos 20, telefone 20; horário, centro, Tamboré 10. PAA: mensalidade, Bluefit × Smart Fit, por que estão fechando, plano fidelidade, taxa de cancelamento, Gympass/TotalPass, quem é o dono.
- O FAQ visível tinha só 4 perguntas; endereço e Tamboré estavam apenas no faqSchema antigo (que não vai para a página). +6 FAQs: onde fica, Tamboré, horário, Gympass/TotalPass, mensalidade, fidelidade/cancelamento. Endereços = os já verificados no site oficial; horário/preço/convênio remetem à fonte oficial (sem número). updatedAt 08/10.
- Fora: "por que estão fechando", "foi vendida", "quem é o dono" (sem fonte verificada), fotos/telefone (dado da unidade).
