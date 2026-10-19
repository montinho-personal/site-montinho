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

### blog/personal-trainer-granja-viana (08/10) — Answer the Public
- Export: "personal trainer granja viana" 20/mês. PAA: 1 mês, 3x/semana, hora, com ou sem personal, 2x, Smart Fit, salário (fora). IA: em casa, online × presencial, emagrecimento, idosos, reabilitação, corrida, credenciados, agendar.
- FAQ visível tinha 3 perguntas. +6: 1 mês (sem valor, link mental para o artigo nacional de preço), 2 ou 3 vezes, com ou sem personal, idosos, avaliação/aula experimental, cartão. updatedAt 08/10.
- Pendente: confirmar com o Montinho se o atendimento presencial na Granja Viana é real (a página afirma) e corrigir a frase "Granja Viana é um dos condomínios... entre Cotia e Santana de Parnaíba".

### blog/academia-gavioes-alphaville (08/10) — Answer the Public
- GSC 28 dias: 189 impressões, 0 cliques, posição 11,3. Export: "academia gaviões alphaville" 1,9 mil/mês (Google); "academia gaviões 24h - alphaville" 4,4 mil (Bing); "...avenida juruá alphaville barueri sp" 390; fotos 110; avaliações 50; preço 50; "em alphaville" 40. PAA: mensalidade, Gympass, dono, maior academia de Alphaville, Gaviões × Smart Fit.
- A página não tinha endereço nem horário. +5 FAQs: endereço (Av. Juruá, 253 — Wellhub + anúncio de vaga da rede, duas fontes), 24h (nome da unidade + horário no Wellhub), Wellhub/TotalPass, mensalidade (remete à fonte oficial), personal externo (regra da unidade; nada de afirmar atendimento do Montinho). updatedAt 08/10.
- Proposta pendente (ATUAL/PROPOSTA/MOTIVO): metaTitle com "Endereço e 24h".
- Fora: dono, CNPJ, franquia, salário, outras unidades (Aeroporto, Sapopemba, Carapicuíba), Ironberg/Juju Salimeni.

### blog/fabrica-premium-alphaville (08/10) — Answer the Public
- GSC 28 dias: 111 impressões, 2 cliques, posição 7,7. Export: "fábrica premium alphaville" 480/mês. Prompts de IA leram "fábrica" como indústria (descartados). PAA genérico: academia prime/premium, maior/mais cara de Alphaville, montar academia.
- Página já tinha horário, telefone, endereço, dono, mensalidade, diária. +4 FAQs: Alphaville × Santana de Parnaíba (GPS), o que é academia premium, Wellhub/TotalPass (não encontrado nos canais conferidos), personal externo. updatedAt 08/10.
- Fora: maior/mais cara de Alphaville (sem fonte), Ironberg, montar academia.

### blog/academias-perto-de-alphaville (08/10) — Answer the Public
- GSC 28 dias: 110 impressões, 2 cliques, posição 11,5. Export sem aba de volume. PAA: mais cara, maior, preço Gaviões/Fábrica/Scelta/Ironberg, mais barata, Gympass. IA: 24h, piscina, pilates, luta, estacionamento, avaliação gratuita, personal.
- +seção "por necessidade" (links para 24h, piscina, pilates, mais barata, quanto custa, premium) e +5 FAQs (24h, piscina, mais barata, mais cara, Wellhub/TotalPass). updatedAt 08/10.
- Achado: o FAQ desta página diz "Rua Juruá, 253" para a Gaviões (atribuído ao site oficial); Wellhub e anúncio de vaga dizem "Avenida Juruá, 253". Número igual; tipo de logradouro a confirmar.
- 08/10: metaTitle aprovado pelo Montinho. Antes: "Academia Gaviões Alphaville: Vale a Pena? Análise" → depois: "Gaviões 24h Alphaville: Endereço, Horário e Vale a Pena?". Base GSC (28 dias até 08/10): 189 impressões, 0 cliques, posição 11,3. Sem mudar updatedAt (título não altera conteúdo).
- 08/10: Montinho confirmou atendimento presencial na Granja Viana. Frase de abertura corrigida (era "um dos condomínios… entre Cotia e Santana de Parnaíba"; agora região entre Cotia e Carapicuíba). Correção factual, sem nova data.
- 08/10: Montinho confirmou "Avenida" Juruá, 253 (Gaviões). Corrigido "Rua Juruá" em 5 pontos (lutas-barueri e 3 posts do blog). Correção mecânica, sem nova data.

### ferramentas/comparador-whey-protein (08/10) — Answer the Public
- Export "melhor whey custo benefício": "melhor whey protein custo benefício" 1,9 mil/mês (Google, Bing, Amazon); YouTube "melhor whey custo benefício" 2,4 mil; "qual o melhor whey custo benefício" 480 (YouTube); "2026" 390 e "2025" 320 (Bing/YouTube); isolado 390/260. PAA: quanto custa whey bom, concentrado bom e barato, quanto dura 900 g, 100% puro, marcas confiáveis, Shopee, gestantes/diabetes/gastrite/rim (médico — fora). "comparador de whey protein" 50, "comparador de whey" 40.
- Nova seção dinâmica "Ranking de custo-benefício do whey hoje" (montaRanking: só preço dentro da validade e em estoque, menor preço da conferência, ordem pelo custo de 25 g, aviso de concentração < 60%). Some se houver menos de 2 válidos. Sem nome de marca escrito à mão no texto.
- +4 FAQs: melhor de 2026 (aponta para o ranking), isolado, "100% whey" no nome, quanto dura 900 g.
- Fora: Shopee, gestante/doenças (médico), creatina × whey.

### ferramentas/calculadora-calorias-muay-thai (08/10) — Answer the Public + prints
- Export "quantas calorias gasta muay thai": treino de muay thai 40/mês, em um treino 30, no muay thai 20, 1 hora 10. Autocompletar: 1h, treino, aula iniciante, 40 min, por dia, por semana, ou musculação. PAA: emagrece, academia × muay thai, define o corpo, 3x/semana, quantas vezes, afina cintura, em casa. Visão por IA: 600–1.000 kcal/h (a página já explica por que o teto é raro).
- Página já tinha 12 FAQs. +6 calculadas pela própria lib (Compêndio): 40 min, aula de iniciante, 3x/semana emagrece, quantas vezes por semana, afina cintura/corpo feminino, muay thai em casa.
- Fora: 10 leis/regras, significado da palavra, acessórios e marcas de luva, dieta (nutricionista).

### consultoria-online (08/10) — Answer the Public + prints
- Export "personal trainer online": "consultoria online personal trainer" 590/mês (Bing); "personal trainer online instagram" 210; "grátis/gratuito" 140–170; "consultoria online" 70; "musculação" 70; "como funciona" 50; "vale a pena" 30; "ao vivo" 20. Muito ruído de curso/certificação (quem quer ser personal) e outros países. Prints: autocompletar (ou presencial, vale a pena, valor, barato, mulher, ao vivo, musculação); PAA (valor, melhor, vale a pena, 3x/semana); visão por IA (Superprof a partir de R$ 20/h, R$ 70–120/h ao vivo; Biotreino); bloco de Apps (Personal Virtual, BodBot); anúncio "100% de desconto na primeira aula".
- A página (LP de anúncio indexável) já tinha 16 FAQs (funciona, como funciona, vale a pena, online × presencial, dieta, escolher, grátis, mulheres, valor…). +4: ao vivo/videochamada, musculação/ganhar massa, personal × consultoria, formas de pagamento (cartão).
- Fora: cursos/certificação/salário (quem quer ser personal), apps gratuitos, Instagram (navegacional), preço (regra: sem valor publicado).
- 08/10, 2º export ("consultoria online de treino"): 40/mês no Google; prints mostram Smart Coach (Smart Fit) na visão por IA, apps (Freeletics) anunciando e perfis de Instagram ranqueando. +2 FAQs: consultoria × aplicativo; é seguro contratar online. Fora: apps gratuitos, Smart Coach (preço/cancelamento), esteira/12-3-30.
- 08/10: regra confirmada pelo Montinho — aula experimental GRATUITA só no presencial; a consultoria online não tem aula experimental. LP de Alphaville e copy do CRM ("gratuita") estão corretas; páginas locais dizem só "tem aula experimental".
- 08/10: "gratuita" acrescentado à aula experimental em 14 respostas das páginas locais presenciais (personal-trainer Alphaville/Barueri/Tamboré/Santana/condomínio Tamboré, quanto-custa Tamboré e 4 posts quanto-custa, Aldeia, Granja Viana e os 2 de condomínio em Alphaville). Guias de academia não foram tocados (a aula experimental ali é da academia). Sem nova data.

### blog/10-melhores-academias-de-alphaville (09/10) — Answer the Public
- GSC 28 dias: 78 impressões, 7 cliques, posição 4,2. Export sem volume; PAA quase todo fora do tema (teste ergométrico, Anatoly, condomínios e casas de famosos, academia mais cara de SP). IA: sem fidelidade, desconto estudante/idoso, spinning, pilates/yoga, avaliação física e aula experimental grátis, estacionamento, piscina, horários, mais bem avaliadas.
- Página já tinha 8 FAQs (Gympass, 24h, Industrial, Fábrica Premium, melhor, preço, hipertrofia). +5: piscina, aulas coletivas/pilates/spinning, aula experimental nas academias, plano sem fidelidade, idosos/iniciantes (aponta para os guias). updatedAt 09/10.

### blog/como-fazer-cadeira-extensora (09/10) — Answer the Public + prints (teste "tráfego de IA")
- Escolhido por ser o artigo com mais visitas vindas de IA (GA4, 90 dias: 74 sessões, quase todas do ChatGPT).
- Export: "como fazer cadeira extensora em casa" 320/mês (Google, Bing, YouTube); "como fazer a cadeira extensora" 90; corretamente 40; exercício na cadeira 40; com elástico 30; drop 20. Prints: autocompletar (em casa, corretamente, unilateral, sem aparelho, elástico, sem machucar o joelho, mini band); PAA (corretamente, substituir em casa, quantas vezes por semana); relacionadas (flexora, unilateral, para glúteo/posterior). Prompts de IA leram como "construir a máquina" (descartados).
- Artigo não cobria "em casa". +seção "Como fazer cadeira extensora em casa" (caneleira, elástico/mini band, sem nada + progressão) e "extensora ou flexora"; +6 FAQs (em casa, elástico, unilateral, vezes por semana, engrossa a perna, extensora × flexora). updatedAt 09/10.
- Base para medir: GA4 IA 74 sessões/90d; acompanhar GSC para "em casa".
- Fora: construir cadeira de madeira/caseira, preço de máquina.

### blog/como-fazer-hip-thrust (09/10) — Answer the Public + prints (teste "tráfego de IA")
- 2º artigo com mais visitas vindas de IA (GA4, 90 dias: 35 sessões). Export: "como fazer hip thrust" 90/mês; "pesado" 20; em casa 10; na máquina 10. PAA: hip thrust × elevação pélvica (forte), máquina, o que substitui, músculos, em casa. Prints: na máquina, unilateral com halter, barra, no chão, explosivo, "em português". IA: equipamentos/compras (fora), halter × barra, erros, variações.
- +seções "Hip thrust é o mesmo que elevação pélvica?" e "Como fazer hip thrust em casa e sem máquina" (sofá/cadeira, halter/mochila, elástico, unilateral, máquina); +6 FAQs (× elevação pélvica, em casa, na máquina, o que substitui, músculos, com halter). updatedAt 09/10.

### ferramentas/calculadora-polichinelos (09/10) — Answer the Public
- GSC 28 dias: 7.159 impressões, 47 cliques, posição 4,8. Export "polichinelo queima quantas calorias": "100 polichinelo queima quantas calorias" 390/mês; 10 min 70; 5 min 70; 30 min 50; 20/15/2 min 20; 200 polichinelos 20; 1 min, 3 min, meia hora, 1 polichinelo 10. PAA: quantos para 300/500 kcal, 1 polichinelo, 500, 1 kg, 1 hora, 100 e 50 por dia, benefícios, é cardio, × caminhada, barriga.
- Página já tinha 13 FAQs (100, por minuto, 300, 100/dia, quantos por dia, barriga, × caminhada…). +9, todas calculadas pela lib (70 kg, ritmo moderado): 10 min (com 5/20/30), 1 hora, 1 polichinelo, 500, quantos para 300 e 500 kcal, 1 kg (simulação 7.700 kcal), 50 por dia, é cardio (Compêndio), benefícios.
- Ferramenta, sem updatedAt (página em app/).

### ferramentas/calculadora-creatina (09/10) — Answer the Public
- Export "quanto de creatina tomar por dia": termo principal 5,4 mil/mês; "devo tomar" 390; "posso tomar" 170; "tem que tomar" 90; "como calcular" 50; por peso (70 kg 40, 60/80/100 kg 20, 50/90 kg 10); "whey e creatina" 20; mulher/hipertrofia/growth 10. PAA: cabelo, todo dia, mulher 40+/50+, tomar e não malhar, sono, saturação, 20 g, medir 5 g sem dosador, cápsula, pó × cápsula, à noite, direto na boca, idoso, gordura no fígado. IA: custo-benefício/marcas, monohidratada × outras formas, dose segura.
- Página já tinha 27 FAQs (dose, por kg, 3 ou 5 g, 70/80/100 kg, 10 e 20 g, colher, hipertrofia, mulher, saturação, pote, rins, café…). +10: como calcular (50/60/90 kg pela lib), whey + creatina (aponta Calculadora de Whey), cápsulas, medir sem dosador, idoso (Candow 2015), tomar sem treinar, cabelo (Antonio 2021), à noite, direto na boca, monohidratada × outras (ISSN). Sem fonte nova: tudo das fontes já citadas.
- scripts/creatina-test.ts: contagem de FAQ estava desatualizada (22, página já tinha 27) → 37. Segue a falha antiga do título com 63 caracteres (mudar título exige aprovação).
- Fora: marcas/lojas, gordura no fígado e sono (sem fonte; assunto médico), efeito no rosto.

### ferramentas/calculadora-calorias-bicicleta (09/10) — Answer the Public
- Export "bicicleta queima quantas calorias" (3 arquivos de motores de busca idênticos, contados uma vez): "30 minutos de bicicleta" 1 mil/mês; "30 min ergométrica" 880; "20 minutos" 720; "20 min ergométrica" 480; 10 min e 40 min 390; 1 hora 320 (rua e ergométrica); 15 min 210; meia hora 170; andar de bicicleta 140; 10 km 110; 2 horas 70. PAA: 30 min todo dia, 1 hora por dia emagrece, minutos de ergométrica por dia, caminhada × bicicleta (barriga), esteira × bicicleta, afina cintura, 1 kg. IA: ergométrica × comum, estrada × montanha, como maximizar, elétrica.
- Página já tinha 17 FAQs (30 min, 40 min/dia, 500 kcal, 1 km, 10 km, 1 kg, 30 min todo dia, esteira, barriga, joelho…). +9 calculadas pela lib (70 kg, Compêndio): 30 min ergométrica (leve/moderado/forte), 20 min (+10 e 15), 1 hora (+2 h), 1 hora por dia emagrece, minutos de ergométrica por dia (OMS 150–300 min/semana), caminhada × bicicleta (MET da caminhada de lib/polichinelo), afina cintura, mountain bike × estrada, como queimar mais.
- Fora: compras, apps, acessórios, bicicleta elétrica (sem valor verificado aqui), o que comer antes (nutrição).

### ferramentas/calculadora-calorias-escada (09/10) — Answer the Public
- Export "escada queima quantas calorias" (2 arquivos de motores idênticos e 2 PAA iguais, contados uma vez): 30 min 480/mês; 10 min 480; 20 min 390; 15 min 210; 1 hora 170; 40 min, meia hora, 1h 70; subir escada 50; 5 min 50; subir e descer 30; simulador de escada 30. PAA: 10 min, 1 hora, faz bem, escada × bicicleta (barriga), todos os dias na academia, caminhar × escada, minutos por dia para barriga, 5 andares, descer faz bem, correr × escada, benefícios, engrossa ou afina as pernas, 1.000 kcal em 1 hora.
- Página já tinha 10 FAQs (1 andar, por minuto, 30 min/1 h, andares, 100 degraus, 20 min, gravidez/coração, elevador, descer, barriga). +9 calculadas pelas libs (70 kg; escada pelo Compêndio, caminhada e corrida pela equação ACSM de lib/corrida, ergométrica de lib/bicicleta): 10 e 15 min, subir e descer, caminhar × escada, correr × escada, escada × bicicleta, minutos por dia (OMS), todos os dias, engrossa/afina perna, 1.000 kcal em 1 hora.
- Título segue com 66 caracteres (falha antiga em escada-test e ferramentas-seo-test); não mexido.
- Fora: treino metabólico, manhã × noite, pão com ovos, 5 kg (outras pautas); simulador de escada da academia sem MET próprio verificado aqui.
- 09/10, 2º lote de arquivos (motores e PAA repetidos; novos só IA e "todas as categorias"): +3 FAQs — simulador de escada da academia (Compêndio 2024, código 02065, 9,3 METs; MET_SIMULADOR e fonte nova em lib/escada.ts), escada × esteira, intensidade e duração. Fora: compras de "escada fitness", apps, vestíveis, preço de personal.

### ferramentas/simulador-ganho-massa-muscular (09/10) — Answer the Public
- Export "quanto tempo para ganhar massa muscular" (XLSX de motores em dobro + CSV iguais, contados uma vez; PAA da escada reenviado, ignorado): termo principal 390/mês; "leva" 210; "demora" 170; 5 kg e 1 kg 140; "leva... na academia" 140; "de treino" 90; ectomorfo 70; academia dá resultado 70; caminhada, dormir, exercício por dia 50; calistenia e esteira 30; cardio, whey, mesomorfo 20. PAA: 5 kg, depois dos 50, truque noturno, vitamina, uma semana sem treinar, músculo cresce no descanso; fibromialgia e diabetes (fora).
- Página já tinha 19 FAQs (10 kg, 5 kg em 3 meses, 1 kg, quando começa, 3 meses, em casa, creatina, iniciante, magro, hipercalórico, whey engorda, testosterona…). +11: na academia (Aragon), 5 kg, ectomorfo, caminhada/esteira/cardio, calistenia, tempo de treino por dia (Schoenfeld 2017), sono (7 a 9 h), whey acelera (Morton 2018), depois dos 50, uma semana sem treinar, músculo cresce no descanso. Fontes já listadas na página.
- Fora: anabolizantes (durateston, hemogenin, oxandrolona), fibromialgia, diabetes/glicemia, vitamina, mulher (volume 0), comer antes do treino.
- 09/10, 2º lote (motores e PAA repetidos; novo só o arquivo de IA): +4 FAQs — constância (calculada pelo simulador: 5 kg com 90%/70%/50% dos treinos e com/sem progressão), suplementos que encurtam o prazo, duração de um ciclo de treino, acompanhamento profissional (sem promessa: o que muda são as semanas perdidas). Fora: marcas e lojas de suplemento, academias, apps, custo de nutricionista.

### ferramentas/calculadora-whey (09/10) — Answer the Public
- Export "quanto whey tomar por dia" (2 arquivos de IA idênticos, contados uma vez; sem PAA): termo principal 1,9 mil/mês; "posso tomar" 390; "para emagrecer" 140; "devo tomar" 110; "whey posso" 90; "pode tomar" 50; "ganhar massa" 40; isolado 10. IA: máximo seguro, horário, como calcular pelo peso, concentrado × isolado para iniciante, dia sem treino, emagrecimento, lactose, vegano, misturar com leite/água, combinar com outros suplementos.
- Página já tinha 29 FAQs (dose, 70/80 kg, ganhar massa, emagrecer, por kg, scoops, gramas × proteína, duração do pote, mais de 30 g, horário, todos os dias, rins, lactose, absorção de 30 g…). +7: máximo por dia (Morton, 2,2 g/kg; 80 kg pela lib), isolado (dose pela lib: 33 g × 43 g de pó para 30 g de proteína), concentrado × isolado (aponta o Comparador), dia sem treino, leite ou água, vegano/vegetariano, misturar com creatina (aponta a Calculadora de Creatina).
- Fora: lojas, marcas, entrega, "treino funcional" (mesma conta de quem treina).

### blog/como-fazer-hip-thrust — título (09/10), aprovado pelo Montinho
- metaTitle antes: "Como Fazer Hip Thrust: Técnica Correta" → depois: "Como Fazer Hip Thrust (Elevação Pélvica): Técnica Correta". Motivo: "hip thrust × elevação pélvica" foi a pergunta mais forte do export. Mesmo dia da atualização de conteúdo: o teste mede os dois juntos. Cadeira extensora e escada: título NÃO trocado (decisão do Montinho).

### ferramentas/calculadora-calorias-caminhada (09/10) — Answer the Public
- GSC 28 dias: 1.916 impressões, 5 cliques, posição 8,3. Export "caminhada queima quantas calorias" (2 arquivos de motores idênticos, contados uma vez): 1 hora 720/mês; meia hora, 5 km e 40 min 320; 20 min 260; 50 min e 1h 140; 15 min 110; 4 km, 2 horas e 10 min 70; 10 km 50; 1 km 40. PAA: 30 min/dia emagrece, quanto tempo por dia, 3 horas, 1 hora por dia, quilos com 30 min/dia, 1 kg, 30 min = quantos km, quando faz efeito, barriga, 10 mil passos. IA: 30 min moderado, caminhada × corrida leve, 5 km rápida, terreno/subida, como maximizar, apps/relógios/tênis (fora).
- Página já tinha 17 FAQs (30 min, 1 h de esteira, 10 mil passos, 300/500 kcal, inclinação, 1/5/10 km, 2 h, por minuto, 1 kg, academia × caminhada, barriga, esteira × rua…). +9 calculadas pela lib (70 kg): 1 hora por ritmo (+3 h), 20/40 min (+10/50), 5 km moderada × rápida, 30 min em km, quilos por mês com 30 min/dia (gasto líquido), tempo por dia (OMS), quando faz efeito, caminhada × corrida leve (lib/corrida), como queimar mais.
- Fora: apps, relógios, tênis, terreno (areia/trilha sem MET verificado aqui), calorias por dia de mulher, 1.500/2.000 kcal (outras pautas).

### ferramentas/calculadora-calorias-eliptico (09/10) — Answer the Public
- GSC 28 dias: 1.552 impressões, 20 cliques, posição 5,3. Export "elíptico queima quantas calorias": 20 min 480/mês; 30 min 170; 10 min 90; 15 min 70; 40 min 20; 45 min 10. PAA: como ligar/usar o elíptico, 20 min, barriga, 20 min de cardio todo dia, afina cintura, elíptico × esteira, qual aparelho de cardio queima mais, é bom cardio, bicicleta × elíptico. IA: 500 kcal, 45 min, fatores, intervalado, como maximizar; marcas/modelos (fora).
- Página já tinha 14 FAQs (10/15/20/30/40/60 min, por minuto, 20 min emagrece, bicicleta, visor, 300 kcal, esteira, emagrece, barriga). +9 calculadas pelas libs (70 kg; Compêndio): 45 min, 500 kcal, qual aparelho de cardio queima mais (escada, elíptico, ergométrica, corrida), é bom cardio, como usar, o que influencia o gasto, intervalado, 20 min todo dia (OMS), afina cintura.
- Fora: marcas e modelos de elíptico, acessórios, apps; esteira/bicicleta de casa (como ligar).

### ferramentas/calculadora-calorias-natacao (09/10) — Answer the Public
- GSC 28 dias: 1.544 impressões, 5 cliques, posição 5,7. Export "natação queima quantas calorias": 30 min e 1 hora 70/mês; 45 min 50; 50 min 30; meia hora, 40 min, 1h 20; aula, 20 min, por hora 10. PAA: 30 min, afina cintura, qual esporte gasta mais, diabetes, minutos para emagrecer, musculação/academia × natação, barriga, insuficiência cardíaca, grávidas, nadar × correr, 2 vezes por semana, define a barriga, muda o corpo, vezes por semana, por que cansa. IA: intensidade, estilo de nado, 45 min intensa, frequência, temperatura da água (fora), relógios/equipamentos (fora).
- Página já tinha 11 FAQs (por hora, nado, 30 min, 1 km, 45/50 min, aula, × corrida/academia, diabetes/coração, borda, kg/mês, barriga). +10 calculadas pelas libs (80 kg; Compêndio; corrida pela ACSM; subida de bike de lib/bicicleta): 20/40 min, 45 min intensa (crawl forte), nadar × correr, 2 vezes por semana (+OMS), vezes por semana, cintura/barriga, muda o corpo, por que cansa, grávida (obstetra), qual esporte gasta mais.
- natacao-test: segue a falha antiga do título com 60 caracteres; não mexido.

### ferramentas/calculadora-calorias-pular-corda (09/10) — Answer the Public
- GSC 28 dias: 1.957 impressões, 5 cliques, posição 6,7. Export "pular corda queima quantas calorias": 10 min 70/mês (+20 nas variações); 20 e 30 min 40; por minuto, 20 min, 1 hora 30; 5 e 15 min 20; 100 vezes 10. PAA quase todo fora (12-3-30, esteira, pressão alta, hérnia de disco, pão com ovos). IA: 30 min, × corrida, emagrece rápido, tonifica, técnica sem lesões, benefícios; cordas/contador/apps (fora).
- Página já tinha 9 FAQs (10 min, mil saltos, por minuto com 5/15/20/30, 100/200/500 pulos, × caminhada, diabetes/gravidez, tabela, kg/mês, barriga). +8 calculadas pelas libs (70 kg; Compêndio; corrida pela ACSM): 30 min contínuo × em blocos (+20 min), 1 hora, × correr (8 e 10 km/h), emagrece rápido, tonifica, como pular sem se machucar, pressão alta (médico), hérnia de disco (médico/fisio).
- corda-test: segue a falha antiga do título com 66 caracteres; não mexido.

### ferramentas/calculadora-calorias-spinning (09/10) — Answer the Public
- GSC 28 dias: 986 impressões, 12 cliques, posição 6,9. Export "spinning queima quantas calorias" (2 arquivos de motores idênticos; arquivo de IA veio vazio, bloqueado no plano): 30 min 110/mês; 1 hora 70; aula 40; meia hora, 45 min, 20 min 30; 40 min, 10 min 10. PAA: 1 hora de ergométrica, 1 hora por dia, cardio que mais queima, quanto dura a aula, como fica o corpo, spinning × musculação, minutos por dia, hérnia de disco, afina cintura, 30 min todo dia; aulas online grátis e "dar aula de spinning" (fora).
- Página já tinha 10 FAQs (aula, 1 hora, 30/40/45/50 min, × musculação, × esteira, frequência, visor, watts, kg/mês, coxa). +8 calculadas pelas libs (70 kg; Compêndio): 20 min (+10), quanto dura a aula, × ergométrica, minutos por dia (OMS), 1 hora por dia, cintura, como fica o corpo, hérnia de disco (médico/fisio).
- spinning-test: segue a falha antiga do título com 61 caracteres; não mexido.

### ferramentas/comparador-whey-protein — clareza "proteína × pó" (09/10), pedido do Montinho
- "Sua rotina" confundia gramas de proteína com gramas do produto. Pergunta agora diz "Quanta proteína por dia você quer tirar do whey?", com aviso "É a proteína, não o pó", o campo "outro (g de proteína)" e, para cada whey escolhido, "30 g de proteína = X g de pó por dia" (porção × proteína do rótulo). Cabeçalho da tabela: "g de proteína/dia", com os gramas de pó por dia em cada linha. Mudança de componente, sem efeito em SEO.
- 09/10 (2): o aviso "É a proteína, não o pó" passa a usar o rótulo do primeiro whey escolhido como exemplo ("no Growth Whey Concentrado, cada 30 g de pó têm 23 g de proteína") e a conversão em gramas de pó aparece assim que o whey é escolhido, antes do preço (catálogo ou rótulo digitado).

## 2026-10-11 — Resultado UFC Vegas 122

- `/blog/resultado-ufc-vegas-122`: resultados preenchidos (Allen finalizou Duncan no 5º round; Alice Pereira e Brendson Ribeiro venceram, Melissa Gatto empatou, Camilo, Ketlen e Ismael Bonfim perderam), bônus e pesos não batidos, FAQ nova. `updatedAt` 2026-10-11.
- `/blog/ufc-vegas-122-allen-duncan`: seção "Quem ganhou?" com o resumo e FAQ de resultado no lugar de "Tem UFC neste sábado?". `updatedAt` 2026-10-11.
- Fonte: sites de resultado bloqueados neste ambiente; publicado com os resultados consistentes entre Sherdog, Combat Press, MMA Mania, Cageside Press e Yahoo (via busca), com autorização expressa do Montinho. Detalhes divergentes entre veículos (tempo do nocaute de Bonfim, tipo de parada da luta da Alice) ficaram de fora.

## 2026-10-12 — Origem de anúncio sem cookies

- `app/api/crm/handoff/route.ts` + `lib/crm/metricas.ts` (`marcasDaUrl`): quando o clique no WhatsApp chega sem nenhuma UTM/gclid (cookies recusados), o servidor lê as marcas da URL da página ou da página de entrada. Antes, anúncio virava "Google orgânico" ou "desconhecido" pelo referrer.
- Dados: 22 cliques de 07/09 a 12/10 reclassificados para google_ads no Supabase; 4 leads corrigidos (eram 3 orgânicos e 1 desconhecido), com atividade registrando o motivo.

## 2026-10-13 — Calculadora de Calorias no Futebol (ATP)

- Export do Answer the Public de "futebol queima quantas calorias": +5 FAQs (90 minutos / 1 hora e meia, 3 horas, 20/45/50 minutos, 1 hora de society, como queimar mais), com números calculados por `lib/futebol.ts`.
- Teste `futebol-test` já falhava antes desta mudança no limite do título (62 caracteres); título não alterado (exige aprovação).

## 2026-10-13 — Calculadora de Calorias na Dança (ATP)

- Export do Answer the Public de "dança queima quantas calorias" (CSV + PAA): +6 FAQs (10/15/40 min e 3 horas, aula de dança, dançar x caminhar, tempo para 400 kcal, 500 kcal em 30 min, zumba), com números de `lib/danca.ts`, `lib/caminhada.ts` e `lib/zumba.ts`.
- `danca-test` já falhava no limite do título (59 caracteres); título não alterado (exige aprovação).

## 2026-10-13 — Títulos de futebol e dança (aprovados pelo Montinho)

| Página | ATUAL | NOVO | Motivo |
|---|---|---|---|
| /ferramentas/calculadora-calorias-futebol | Futebol Gasta Quantas Calorias? Calculadora de Pelada e Futsal (62) | Futebol Queima Quantas Calorias? Calculadora de Pelada (54) | "queima" é o termo do ATP; dentro do limite de 58 |
| /ferramentas/calculadora-calorias-danca | Dança Gasta Quantas Calorias? Calculadora por Ritmo e Tempo (59) | Dança Queima Quantas Calorias? Calculadora por Ritmo (52) | idem |

## 2026-10-13 — Calculadora de Calorias no Jiu-Jitsu (ATP)

- Export do Answer the Public de "jiu jitsu queima quantas calorias": +4 FAQs (2 horas, como aumentar o gasto, jiu-jitsu ou academia, hérnia de disco), com números de `lib/jiujitsu.ts`. Perguntas comerciais (kimono, suplemento, academias) ficaram de fora.

## 2026-10-13 — Calculadora de Calorias no Boxe (ATP)

- Export do Answer the Public de "boxe queima quantas calorias": +5 FAQs (10/15 min e 2 horas, peso perdido com 3 aulas por semana, barriga, corpo musculoso, hérnia de disco), com números de `lib/boxe.ts`. Tabata e CrossFit (perguntas relacionadas do PAA) ficam como pauta, não nesta página.

## 2026-10-13 — Calculadora de Calorias no CrossFit (ATP)

- Export do Answer the Public de "crossfit queima quantas calorias": +5 FAQs (40 minutos, como calcular, CrossFit x corrida, como gastar mais, substitui a musculação / define o corpo), com números de `lib/crossfit.ts` e `lib/corrida.ts`. Fora: frequência semanal e "quantos meses dá resultado" (sem fonte para um número), suplementos, equipamentos, apps e academias. A deriva do PAA para "quantos kg a musculação faz perder por mês" fica como pauta.

## 2026-10-13 — Calculadora de Calorias no Muay Thai (ATP)

- Export do Answer the Public de "muay thai queima quantas calorias": a página já cobria 17 perguntas (1 hora, 30/40 min, 2 horas, barriga, define o corpo, academia x muay thai, frequência, iniciante, em casa). +5 FAQs para o que faltava: muay thai x corrida, boxe x muay thai, tempo para 500 kcal, como calcular e como gastar mais, com números de `lib/muaythai.ts`, `lib/boxe.ts` e `lib/corrida.ts`. Fora: equipamentos, suplementos, apps, academias, regras/significado do muay thai e kickboxing (pauta).

## 2026-10-13 — Calculadora de Calorias da Musculação (ATP + print da 1ª página)

- Export do Answer the Public + print anônimo da busca "musculação queima quantas calorias". A página já aparece na 1ª página (abaixo de Smart Fit) e já cobria 1 hora, 20/30/40/50 min, 2 horas, EPOC, cardio, emagrecer com 1 h/dia, só musculação, 300 kcal, exercícios e barriga. +4 FAQs: 10/15/45 min e 3 horas; leve x pesada x intensa; 1.000 kcal em 1 hora; como calcular. Números de `lib/musculacao.ts`.
- Visão por IA cita 368 kcal/h para 70 kg (MET 5,0, o nosso "pesado"); a página mantém o tradicional em 3,5 METs, conferido no Compêndio. Fora: apps, wearables, suplementos, academias, "massa muscular aumenta o metabolismo basal" (sem fonte no projeto para um número). "Quantos kg se perde com 1000 calorias" e "calorias de pão com ovo" ficam como pauta.
- `seo-serp-test` tem 10 falhas anteriores, em artigos não tocados aqui (títulos e descrições longos).

## 2026-10-13 — Muay thai: print da 1ª página

- Print anônimo de "muay thai queima quantas calorias": a página aparece na 1ª página (depois de Reddit e Nav Dasa). Autocompletar, "As pessoas também perguntam" e "Outras pessoas pesquisaram" já estavam todos cobertos. A visão por IA e Nav Dasa/Superprof repetem "600 a 1.000 kcal por hora"; a pergunta "Muay thai queima 1.000 calorias por hora?" passou a "de 600 a 1.000", mostrando que os 600 só aparecem numa aula de 5 rounds para ~91 kg (70 kg ≈ 460 kcal).

## 2026-10-13 — Prints da 1ª página: CrossFit, boxe e jiu-jitsu

- CrossFit (a página aparece logo abaixo do ge): a visão por IA separa "mulheres 500–800, homens 700–1.000 kcal/h" e o PAA traz "3 vezes por semana ajuda a emagrecer?". +2 FAQs: 3 vezes por semana; homem x mulher (a conta depende do peso: 60 kg ≈ 275, 90 kg ≈ 410 kcal na aula típica).
- Boxe: autocompletar, PAA e "Outras pessoas pesquisaram" já cobertos (30 min, barriga, 1 hora, boxe ou academia, 10/15/20 min). Nada alterado.
- Jiu-jitsu: +2 FAQs do PAA: boxe ou jiu-jitsu emagrece mais; o que muda no corpo e em quanto tempo define. Kimono e "antes e depois" ficam de fora.

## 2026-10-13 — Calculadora de Calorias do Elíptico (ATP + print da 1ª página)

- Export do Answer the Public + print anônimo de "elíptico queima quantas calorias". A página já tinha 23 perguntas (10/15/20/30/40/45 min, 1 hora, 300/500 kcal, esteira, bicicleta, barriga, cintura, 20 min todo dia, intervalado). +2 FAQs: minutos por dia para emagrecer (PAA) e como calcular. Números de `lib/eliptico.ts`.
- A página não apareceu na 1ª página do print (Veera, Hipertrofia.org, Nutrola, Smart Fit). O título atual não contém "queima quantas calorias"; proposta de título enviada ao Montinho (ATUAL/PROPOSTA/MOTIVO), não aplicada.
- Fora: compra, preço, aluguel e marcas de elíptico; "como ligar o aparelho" e a deriva para bicicleta (pauta).

## 2026-10-13 — Prints da 1ª página: futebol e dança

- Nas duas buscas quem aparece na 1ª página é o artigo do blog (futebol-emagrece / dança-emagrece), não a calculadora.
- Futebol: +2 FAQs do PAA: "jogar futebol ajuda a emagrecer?" (3 peladas/semana, 80 kg ≈ 1.510 kcal líquidas ≈ 196 g) e "quanto tempo para queimar 500 calorias" (≈ 58 min para 70 kg). "É bom queimar 300 calorias por dia" fica de fora (sem número com fonte).
- Dança: autocompletar, PAA e "Outras pessoas pesquisaram" já cobertos. Nada alterado.

## 2026-10-13 — Título do elíptico (aprovado pelo Montinho)

| Página | ATUAL | NOVO | Motivo |
|---|---|---|---|
| /ferramentas/calculadora-calorias-eliptico | Calorias no Elíptico: 10, 20, 30 Minutos e 1 Hora (Calculadora) (63) | Elíptico Queima Quantas Calorias? 10, 20, 30 Min e 1 Hora (57) | termo exato da busca; a página não apareceu na 1ª página do print de 13/10 |

## 2026-10-13 — Escada: print da 1ª página

- Print anônimo de "escada queima quantas calorias" (sem export do ATP). A página já tinha 22 perguntas (andar, minuto, 10/30 min, 1 hora, 100 degraus, simulador, correr, caminhar, esteira, bicicleta, todos os dias, barriga, pernas, 1.000 kcal). +1 FAQ: 5, 20 e 25 minutos ("Outras pessoas pesquisaram"). "30 minutos velocidade 5" fica de fora: o nível do simulador muda de aparelho para aparelho.
- A calculadora não apareceu no trecho visível da 1ª página (Omni Calculator no topo). `escada-test` já falhava no título (66 caracteres, limite 58); proposta de título enviada ao Montinho, não aplicada.

## 2026-10-13 — Escada: export do Answer the Public

- +3 FAQs: 40/45/50 minutos (40 min = 70 buscas/mês); tempo de caminhada equivalente (PAA); escada x elíptico (modelos de IA). Números de `lib/escada.ts`, `lib/corrida.ts` e `lib/eliptico.ts`.
- Fora: escada ergométrica para casa, marcas, apps e manutenção; "velocidade 5" (nível muda por aparelho); deriva do PAA para 1.000 kcal/pão com ovo (pauta, já anotada na musculação).

## 2026-10-13 — Título da escada (aprovado pelo Montinho)

| Página | ATUAL | NOVO | Motivo |
|---|---|---|---|
| /ferramentas/calculadora-calorias-escada | Subir Escada Gasta Quantas Calorias? Calculadora por Andar e Tempo (66) | Escada Queima Quantas Calorias? Por Andar, Minuto e Degrau (58) | termo exato da busca; `escada-test` reprovava o título (limite 58) |

## 2026-10-13 — Pular corda: print da 1ª página

- Print anônimo de "pular corda queima quantas calorias". A página já tinha 18 perguntas (10/30 min, 1 hora, por minuto, 100/200/500/1.000 pulos, caminhada, correr, barriga, kg/mês). +3 FAQs: minutos para 500 kcal (PAA); 10 minutos x corrida ("quanto equivale 10 minutos pulando corda", corrige o "10 min = 30 min de corrida" das imagens: ≈ 14 min a 8 km/h); 15 minutos por dia (Brasil 247 na 1ª página fala em 91 mil kcal/ano; pela conta da calculadora, 70 kg ≈ 79 mil). "Pular corda sem corda" fica de fora (sem MET próprio no Compêndio).
- Calculadora não apareceu no trecho visível da 1ª página (Omni Calculator no topo). `corda-test` já falhava no título (66 caracteres); proposta enviada ao Montinho.

## 2026-10-13 — Título de pular corda (aprovado pelo Montinho)

| Página | ATUAL | NOVO | Motivo |
|---|---|---|---|
| /ferramentas/calculadora-calorias-pular-corda | Pular Corda Gasta Quantas Calorias? Calculadora por Tempo e Saltos (66) | Pular Corda Queima Quantas Calorias? Por Minuto e Saltos (56) | termo exato da busca + "por minuto" (1º do autocompletar); `corda-test` reprovava o título (limite 58) |

## 2026-10-14 — IndexNow (aviso ao Bing)

- Motivo: o ChatGPT parou de mandar visitas para cadeira extensora, hip thrust e leg press a partir de 07/09 (≈ 25 visitas/semana → 0). A busca do ChatGPT usa muito o índice do Bing, e o site não avisava o Bing das mudanças.
- `lib/indexnow.ts` + `public/<chave>.txt` + `scripts/indexnow.ts` (diff entre dois commits → URLs do sitemap → POST em api.indexnow.org). Teste: `scripts/indexnow-test.ts`. Roda sozinho no GitHub Actions a cada push para main (o ambiente das sessões bloqueia api.indexnow.org); registrado no AGENTS.md.
- Medir: visitas de chatgpt.com/bing por semana nas páginas avisadas, a partir de 14/10.

## 2026-10-14 — crossover-vs-crucifixo (ATP + print da 1ª página)

- Export do Answer the Public + print anônimo de "crossover ou crucifixo". O artigo é o 1º resultado orgânico e a principal fonte citada na visão geral por IA. Já cobria polia alta/média/baixa, halteres x máquina, músculos, substituto do crossover e supino x crossover.
- +4 FAQs: crucifixo no crossover ou peck deck; crucifixo reto ou inclinado; sentir o ombro no crucifixo; crucifixo ou supino. `updatedAt` 2026-10-14.
- Fora: tudo de "crossover" de áudio/som automotivo (modelos de IA confundiram o termo), cruz/crucifixo religioso (deriva do PAA), preço de crossover para academia, crucifixo inverso e agachamento sissy (pauta).
- `seo-serp-test` reprovava título (65) e descrição (165) antes desta mudança; proposta enviada ao Montinho, não aplicada.

## 2026-10-14 — treino-upper-lower-superior-inferior (ATP + print da 1ª página)

- Export do Answer the Public + print anônimo de "treino upper lower" (2,4 mil/mês). 1ª página: Hipertrofia.org, Smart Fit, Reddit, Hevy, fnac (ULPPL). O artigo já cobria o que é, 2/3/4/5 dias, fichas, masculino/feminino, hipertrofia e x push pull legs.
- +3 FAQs: PPL upper lower / ULPPL ("treino ppl upper lower" 590/mês, "push pull legs upper lower" 320/mês); quantas séries (cerca de 10 séries por músculo por semana — Schoenfeld 2017, já usado em lib/treino/volume.ts); upper lower ou ABC. `updatedAt` 2026-10-14.
- Fora: planilha/pdf (download), "pacholok" (nome de outro profissional), drop set, 4x10 x 3x12, pilares do CrossFit (deriva do PAA), apps.
- `seo-serp-test` já reprovava a descrição (171 caracteres; abertura igual ao título); proposta enviada ao Montinho.

## 2026-10-14 — quanto-tempo-de-esteira-para-emagrecer (ATP + print da 1ª página)

- Export do Answer the Public + print anônimo de "quanto tempo de esteira para emagrecer" (590/mês). 1ª página: UOL, Cia Athletica, sportlife, O Globo, AZON; a visão por IA diz 30 a 60 min, 3 a 5x por semana, e cita o 12-3-30. O artigo não apareceu no trecho visível do print.
- +4 FAQs: tempo para perder 1 kg (≈ 37 h de caminhada moderada para 70 kg, conta líquida com 7.700 kcal/kg, MET 3,8 de lib/caminhada.ts); 30 minutos todos os dias (≈ 720 kcal/semana, teto ≈ 0,4 kg/mês; 1 h ≈ 0,8); minutos por dia para perder barriga; o que é o 12-3-30 (mesma descrição do FAQ já publicado em outro artigo). `updatedAt` 2026-10-14.
- Fora: músculos da esteira, jejum (já respondido), melhor horário, "como fica o corpo", caminhada x academia (há artigos próprios).

## 2026-10-14 — creatina-para-quem-usa-mounjaro (modelos de IA do ATP + prints)

- Chegou só o arquivo de modelos de IA de "creatina mounjaro" (os outros dois anexos eram de novo os da esteira) + prints. 1ª página dominada por Instagram de médicos e Reddit; o artigo não apareceu no trecho visível.
- +3 FAQs: creatina atrapalha o Mounjaro (autocompletar "creatina atrapalha mounjaro"; resposta foca na retenção de água e na decisão do médico, sem afirmar interação); melhor creatina para quem toma Mounjaro/tirzepatida (monohidratada, como o próprio artigo já diz); whey e creatina juntos. `updatedAt` 2026-10-14.
- Fora: "o que não pode tomar junto com Mounjaro" (pergunta médica), colágeno, "o que a creatina faz no rosto", marcas.

## 2026-10-14 — Títulos e descrições: crossover e upper lower (aprovados pelo Montinho)

| Página | Campo | ATUAL | NOVO |
|---|---|---|---|
| /blog/crossover-vs-crucifixo | título | Crossover ou Crucifixo: Qual o Melhor? (Polia Alta, Média, Baixa) (65) | Crossover ou Crucifixo: Qual o Melhor? Halteres ou Máquina (58) |
| /blog/crossover-vs-crucifixo | descrição | Crossover ou crucifixo com halteres ou na máquina: qual o melhor para o peito, o que cada polia (alta, média, baixa) trabalha e qual exercício substitui o crossover. (165) | Crossover no cabo ou crucifixo com halteres ou na máquina: qual o melhor para o peito, o que muda na polia alta, média e baixa e o que substitui o crossover. (157) |
| /blog/treino-upper-lower-superior-inferior | descrição | Treino upper lower: o que é, como dividir em 2, 3, 4 ou 5 dias, fichas prontas, versão masculina e feminina, se é bom para hipertrofia e como se compara ao push pull legs. (171) | Fichas prontas de 2 a 5 dias, versão masculina e feminina, quantas séries fazer e como juntar com o push pull legs (ULPPL) treinando cada músculo 2x na semana. (159) |

- Motivo: `seo-serp-test` reprovava os três (limites 60/160 e abertura igual ao título); "máquina" é a busca derivada com mais volume e ULPPL a maior relacionada do upper lower. Sem `updatedAt` (título e descrição não mudam o conteúdo).

## 2026-10-14 — retatrutida-faz-perder-musculos (ATP, sem print e sem modelos de IA)

- Export do Answer the Public de "retatrutida perde massa muscular": autocompletar com volume 0 ("a retatrutida perde…", "retatrutida perde menos massa muscular", esta já respondida pelo FAQ que compara com o Mounjaro) + "As pessoas também perguntam". O Montinho mandou seguir sem o relatório de IA; não houve print da 1ª página.
- +4 FAQs, sem número novo (só o que o artigo já cita: 1,6–2,2 g/kg de Morton 2018, creatina 3–5 g): recuperar a massa muscular perdida; o que é bom para repor massa magra; perda de músculo depois dos 40 (sarcopenia); diabetes tipo 2 e ganho de massa com retatrutida (ajuste de remédio com o médico). `updatedAt` 2026-10-14.
- Fora: liraglutida, Ozempic, novos remédios para obesidade, bariátrica, glicose/peso ideal do diabético, jantar, "o que beber de manhã", suplementos (fogem do tema). "Quantos quilos consigo perder com retatrutida?" já tinha FAQ (fase 2, NEJM 2023).

## 2026-10-14 — calculadora-calorias-zumba (ATP, sem print)

- Export do Answer the Public de "zumba queima quantas calorias" (40/mês; "aula de zumba", 10, 20, 30, 40 min e 1 hora com 0–10/mês) + "As pessoas também perguntam".
- +5 FAQs, números calculados pela própria lib (70 kg, metade das músicas com salto, Compêndio 2011): 10/20/40 min (≈ 75/150/300 kcal); caminhada ou zumba (1 h ≈ 450 vs ≈ 280 kcal de caminhada moderada, MET 3,8 de lib/caminhada.ts; ≈ 1 h 37 min para igualar); quantas vezes por semana (150 min da OMS, como no elíptico); zumba ganha massa muscular; zumba para iniciantes e problema de coluna (sem salto ≈ 370 kcal/h; orientação de procurar médico ou fisioterapeuta).
- Fora: origem da zumba, quem pode dar aula, Tae Bo, ballet fitness, boxe x academia, desinchar 3 kg, exercícios para secar barriga. Dança 1 h por dia e "caminhar ou dançar" cabem na calculadora de dança.
- `zumba-test` já reprovava o título (64 caracteres, limite 58) antes desta mudança; proposta enviada ao Montinho.

## 2026-10-14 — Título da calculadora de zumba (aprovado pelo Montinho)

| Página | Campo | ATUAL | NOVO |
|---|---|---|---|
| /ferramentas/calculadora-calorias-zumba | título | Calculadora de Zumba: Calorias por Aula, 30, 45 Minutos e 1 Hora (64) | Zumba Queima Quantas Calorias? Por Aula, 30 Min e 1 Hora (56) |

- Motivo: `zumba-test` reprovava (limite 58); usa a busca principal do export ("zumba queima quantas calorias", 40/mês), no mesmo padrão de elíptico e escada.

## 2026-10-14 — retatrutida-faz-perder-musculos (print da 1ª página)

- Print anônimo de "retatrutida perde massa muscular": **o artigo é a 1ª fonte da visão geral por IA e o 1º card ao lado dela**. Depois vêm Instagram de médicos, MedEsporte Papers, sergio's, drjohnburns. Autocompletar: "perdi muita massa muscular como recuperar / o que fazer" (já cobertos). PAA: quanto se perde (já havia), efeito rebote, efeito no corpo (já havia), quanto tempo fica no organismo. Outras pesquisas: preserva massa muscular (já havia), gordura localizada, cabelo, melhor que Mounjaro (já havia), como usar, dose inicial, efeito colateral, bimagrumabe.
- Dado corrigido: o FAQ "causa mais perda muscular do que o Mounjaro?" e a lista de comparação diziam que não havia dados de composição corporal da retatrutida. Há: subestudo da fase 2 em diabetes tipo 2 (189 pessoas, DEXA, 36 semanas; The Lancet Diabetes & Endocrinology 2025, doi 10.1016/S2213-8587(25)00092-0), com gordura caindo até ~26% e perda de gordura superior à de massa magra, proporção parecida com outros tratamentos. Conferido em dois veículos (MIMS e Springer Medicine) por resumo; o artigo original não abriu daqui. Não usei o "índice de perda de gordura de 64,6%" porque as fontes secundárias divergem (62–69% numa, 75–80% noutra).
- +2 FAQs: efeito rebote (extensão do STEP 1, Wilding et al., Diabetes Obes Metab 2022: dois terços do peso recuperado um ano após parar a semaglutida); gordura localizada.
- Fora: tempo no organismo, dose inicial, como usar, efeito colateral, cabelo (perguntas médicas); status regulatório (sem aprovação da FDA até ago/2026, mas sem confirmação da Anvisa); bimagrumabe e o resultado anunciado da fase 3 (TRIUMPH-1, só comunicado da empresa, sem revisão por pares).

## 2026-10-14 — quantos-quilos-perder-ate-fim-do-ano (ATP + print da 1ª página)

- GSC (12/07–14/10): 1.892 impressões, 4 cliques, posição 5,5. Busca sazonal (sobe até dezembro); a Calculadora de Meta de Peso já está embutida.
- Print anônimo: **o artigo é a fonte citada duas vezes na visão geral por IA** ("de 2 a 10 quilos", "4 a 10 kg"); à direita Saúde/Abril, Blog São Camilo e ULBRA TV. PAA: perder 20 kg em um ano, 10 kg em 1 mês, 7 kg em 1 mês, quantos kg em 1 ano. Outras pesquisas: jejum de 7 dias, 1 kg por semana, 1 kg em um dia, cardápio, Mounjaro, jejum intermitente.
- Export do ATP (só "As pessoas também perguntam"): por mês, até o Natal, 10 kg até dezembro, 5/10 kg em 1 mês, 4 kg em uma semana, 2 kg por semana, 1 kg em um dia, em um ano.
- +7 FAQs (o artigo tinha 4), números de `lib/meta.ts` (0,5% a 1% do peso por semana, composto; 10 semanas de meados de outubro ao Natal) e 7.700 kcal/kg: por mês (80 kg: 1,6–3,2; 100 kg: 2–3,9), até o Natal (80 kg: 3,9–7,6; 100 kg: 4,9–9,6), 10 kg até dezembro, 5/7/10 kg em 1 mês (déficit de 1.375/1.925/2.750 kcal/dia), 2 e 4 kg por semana, 1 kg em um dia, 20 kg em um ano. `updatedAt` 2026-10-14.
- Fora: Mounjaro (dose é decisão médica), jejum de 7 dias e jejum intermitente, cardápios, gestante, doenças que emagrecem, "xixi elimina gordura", "70 kg é obeso" (depende da altura; há calculadora de IMC).
- Título: proposta enviada ao Montinho (CTR 0,2% na posição 5,5 — a visão por IA responde o número, e o título não diz que há calculadora).

## 2026-10-14 — polichinelo-emagrece (ATP + print da 1ª página)

- GSC (12/07–14/10): 9.581 impressões, 14 cliques, posição 7,7. Print (o card do Search Console no próprio Google): "polichinelo emagrece" 513 impressões em 90 dias, posição 9,4. 1ª página: Smart Fit, Tua Saúde e TotalPass na visão por IA; Treino Mestre. PAA: minutos para emagrecer, polichinelo todo dia, perde barriga, quantos para 1 kg.
- Export ATP: "polichinelo emagrece" 2,4 mil/mês; "a barriga" 480; "fazer polichinelo emagrece" 260; "quantos quilos por semana" 140; "sem impacto" 30; "os braços" 30; "qual parte do corpo" 20; "mais que caminhada". O XLSX de "pessoas também perguntam" derivou para esteira, jump e corda (fora).
- **Dado corrigido:** o FAQ dizia 8 a 12 kcal/min e "500 polichinelos = 150 a 200 kcal"; o corpo dizia "cerca de 10 kcal/min", "500 ≈ 90" e "100 sobe para 30 a 40 com pausas" (sem fonte). A calculadora do site (`lib/polichinelo.ts`, Compêndio 2011) dá, para 70 kg, 6,7 kcal/min no moderado e 9,2 no intenso; 500 ≈ 75 kcal. Texto e FAQ alinhados à calculadora; corda corrigida para 11–15 kcal/min (`lib/corda.ts`, 8,8 a 12,3 METs).
- +5 FAQs: barriga/braços/pernas (sem perda localizada), quilos por semana (500/dia ≈ 525 kcal ≈ 68 g), mais que caminhada (30 min a 3,5 METs ≈ 130 kcal ≈ 19 min / 860 polichinelos), sem impacto (ritmo leve ≈ 4 kcal/min), minutos e 1 kg (≈ 19 h / 51 mil, teórico). `updatedAt` 2026-10-14.
- Fora: rosto, costas, piscina, jump, polichinelo e agachamento.
- Canibalização vista: 3 páginas no mesmo grupo (este artigo responde "emagrece?"; `polichinelo-queima-quantas-calorias` e a calculadora respondem calorias/quantidade). O FAQ novo responde a pergunta e manda para a conta, sem duplicar a tabela.
- Título: proposta enviada ao Montinho.

## 2026-10-14 — Título: quantos-quilos-perder-ate-fim-do-ano (aprovado pelo Montinho)

| Página | Campo | ATUAL | NOVO |
|---|---|---|---|
| /blog/quantos-quilos-perder-ate-fim-do-ano | título | Quantos Quilos Dá para Perder até o Fim do Ano com Saúde (56) | Quantos Quilos Dá para Perder até o Fim do Ano? Calcule (54) |

- Motivo: a visão por IA já mostra o número tirado do artigo (CTR 0,2% na posição 5,5); o título passa a dizer que há calculadora. Sem `updatedAt`.

## 2026-10-14 — /ferramentas/calculadora-creatina (ATP + print da 1ª página)

- GSC (12/07–14/10): 5.320 impressões, 6 cliques, posição 9,1; "tabela de creatina por peso 60/90/120/80/50 kg" ≈ 650 impressões em 28 dias, posição ~10.
- Print anônimo de "calculadora de creatina": a página **não aparece no trecho visível**. A visão por IA entende "creatinina" (função renal: Einstein, SBN). Resultados: Ocean Drop (0,06 g/kg), SBN, Diegomaier, Fit House, Axgard. Outras pesquisas: por peso, tabela 60/90/120 kg, quanto para 70 kg, marcas (Integralmedica, Growth, Dark Lab).
- Export ATP: "calculadora de creatina" 1,9 mil/mês, "por peso" 880, "por kg" 50, Growth 30, Dark Lab 20. PAA: por kg, 3 g basta, 80 kg, medir scoop/3 g/5 g, 1 kg dura quanto, 70 kg, 4 g, 6 g, 10 g, ponto negativo, 60 kg, misturar, tomar sem malhar, marcas.
- A página já tinha 37 FAQs. +6: 1 kg dura quanto, 60/90/120 kg, 4 g e 6 g, altura muda a dose, tomar sem malhar, ponto negativo — números de `lib/creatina.ts` (0,03 g/kg, faixa 3–5 g da ISSN). `creatina-test` atualizado para 43 perguntas.
- Fora: creatinina/função renal (outra intenção), calculadoras de marca, "3 melhores marcas", "peso e altura" respondido no FAQ da altura.
- `creatina-test` já reprovava o título (63 caracteres, limite 58); proposta enviada ao Montinho.

## 2026-10-14 — dormir-depois-do-almoco-engorda (ATP + print da 1ª página)

- GSC (12/07–14/10): 1.493 impressões, 0 cliques, posição 8,9; "deitar depois de comer engorda" 127 impressões. Print anônimo: o artigo aparece no fim da 1ª página (depois de UOL, Facebook, YouTube); visão por IA cita Liv Up, UOL e Brasil de Fato.
- Export ATP: "dormir depois do almoço engorda" 1 mil/mês, "engorda ou emagrece" 50, "2 horas" 20. PAA: o que acontece, 2 horas, 30 minutos, sem jantar, sinal de diabetes, como se chama, dormir ou caminhar. Outras pesquisas: faz mal, deitar depois de comer, soneca e infarto, quanto esperar para deitar, descansar antes de treinar.
- +6 FAQs (o artigo tinha 5): deitar depois de comer engorda, 2 horas, engorda ou emagrece, nome (sesta), sinal de diabetes (orientação de procurar médico, sem afirmar relação), dormir ou caminhar (já coberto no texto). Sem número novo. `updatedAt` 2026-10-14.
- Fora: "soneca e infarto" (saúde, precisa fonte), dormir sem jantar e jejum noturno, frutas para dormir, desinchar a barriga.

## 2026-10-14 — quantas-calorias-tem-1kg-de-gordura (ATP + print da 1ª página)

- GSC (12/07–14/10): 3.674 impressões, 3 cliques, posição 7,8. Print anônimo: visão por IA responde "7.700 calorias" (ge, Globo, Instagram); o artigo não aparece no trecho visível. PAA: calorias para eliminar 1 kg, quantos quilos são 500 calorias, o que equivale a 7.000, calorias para perder 5 kg. Outras pesquisas: 1.000 calorias é 1 kg, 1 kg de gordura e 1 kg de músculo, calorias de 1 kg de músculo, perder 1 kg em 2 dias.
- Export ATP: termo principal 390/mês, "gordura corporal" 50. O XLSX de PAA derivou (jantar, absorção de calorias, 1.500 kcal).
- +6 FAQs (o artigo tinha 5), só com a conta de 7.700 kcal/kg: 500 e 1.000 kcal (≈ 65 e 130 g), 7.000 kcal (≈ 910 g), 5 kg (38.500 kcal ≈ 11 semanas a 500/dia), 100 kcal a mais por dia (≈ 4,7 kg/ano no papel), músculo pesa mais que gordura (densidade, sem número), gordura visceral. `updatedAt` 2026-10-14.
- Fora: dietas de 800/1.000/1.500 kcal (prescrição), absorção de calorias, cardápios.
- Títulos dos dois: propostas enviadas ao Montinho.

## 2026-10-14 — Títulos: calculadora de creatina e polichinelo emagrece (aprovados pelo Montinho)

| Página | Campo | ATUAL | NOVO |
|---|---|---|---|
| /ferramentas/calculadora-creatina | título | Quanto de Creatina Tomar por Dia? Calculadora e Tabela por Peso (63) | Calculadora de Creatina por Peso: Tabela de 50 a 150 kg (55) |
| /blog/polichinelo-emagrece | título | Polichinelo Emagrece? Calorias e Quantos Fazer por Dia (54) | Polichinelo Emagrece? Barriga, Quilos e Quantos por Dia (55) |

- Motivo creatina: "calculadora de creatina" 1,9 mil/mês e "por peso" 880 no ATP; buscas reais "tabela de creatina por peso 60/90/120 kg" (≈ 650 impressões em 28 dias, posição ~10, 0 cliques). `creatina-test` passa a aprovar o título (antes 63 > 58).
- Motivo polichinelo: "polichinelo emagrece a barriga" 480/mês e "quantos quilos por semana" 140/mês; "calorias" fica com `polichinelo-queima-quantas-calorias`, para as duas páginas não disputarem a mesma busca.
- Sem `updatedAt` (título não muda o conteúdo).

## 2026-10-14 — Títulos: dormir depois do almoço e 1 kg de gordura (aprovados pelo Montinho)

| Página | Campo | ATUAL | NOVO |
|---|---|---|---|
| /blog/dormir-depois-do-almoco-engorda | título | Dormir Depois do Almoço Engorda? O Que Acontece de Verdade (58) | Dormir Depois do Almoço Engorda? E Deitar Depois de Comer (57) |
| /blog/quantas-calorias-tem-1kg-de-gordura | título | Quantas Calorias Tem 1 kg de Gordura? São 7.700 kcal (52) | Quantas Calorias Tem 1 kg de Gordura? Calcule o Déficit (55) |

- Motivo dormir: "deitar depois de comer engorda" (127 impressões no GSC) não estava no título; 0 cliques em 1.493 impressões.
- Motivo 1 kg: o título e a visão por IA já entregavam o número (3 cliques em 3.674 impressões); o artigo embute a Calculadora de Déficit.
- Sem `updatedAt`.
- Correção no mesmo dia: o PR #896 foi publicado antes de o `seo-serp-test` terminar e deixou duas travas do próprio teste desatualizadas. O título de 1 kg de gordura estava pinado em `scripts/experimento-titulos.ts` (experimento encerrado em 21/09; pin atualizado, com o motivo) e `dormir-depois-do-almoco-engorda` continuava na lista de "cauda vaga pendente" (removido, título já reescrito). O teste volta às 6 falhas que já existiam.

## 2026-10-14 — NOVA: /ferramentas/substituicao-de-alimentos (Troca Certa)

- Pedido do Montinho (briefing "Troca Certa"). Pesquisa: ATP + prints de "substituição de alimentos", "substituir arroz por", "substituir frango por" e print de "tabela de substituição de alimentos".
- O que a pesquisa mudou no produto:
  - A busca dominante é **"lista de substituição de alimentos"** (590/mês); "lista … taco" 170, "tabela … pdf" 140, "para imprimir" 50, "calculadora" 70. A página entrega a calculadora E a lista pronta por grupo (com medida caseira), imprimível/salvável em PDF pelo navegador. Título: "Lista de Substituição de Alimentos: Calculadora e Tabela"; H1: "Calculadora de Substituição de Alimentos".
  - Arroz: quinoa lidera (390/mês), mas **não está na TACO** — a página diz isso em vez de inventar número. Depois batata (110), cuscuz, batata-doce (70), macarrão, mandioca; "emagrece" aparece em várias (FAQ de cuscuz e couve-flor com a conta).
  - Frango: "100 g de frango por ovo" e variações em gramas (50, 60, 120, 130, 150) e atum. A resposta sai em ovos (unidades da POF).
- Motor: `lib/alimentos/equivalencia.ts` (regra de três sobre a TACO, grupos de troca curados por slug, estado cru/pronto, arredondamento 1/5/10 g, limites por grupo, medida caseira da POF só quando cai a até 15%, avisos de diferença nos outros macros, recusas para "não é fonte"). Testes: `scripts/equivalencia-test.ts`.
- Integrações: catálogo (alimenta também o Pergunte ao Montinho), sitemap, botão "Ver substituições" em toda página de alimento (ponte por sessionStorage, nada na URL), chamada no Comparar Alimentos, CTA final para o FitChef. Eventos GA4 `food_swap_*` só com critério, grupo e contagens.
- Fora desta fase: integrar o motor ao FitChef (ele tem base e porções próprias; mudar ali pode quebrar cardápios — fica para fase 2), "mais parecido possível", filtros vegetariano/sem lactose, páginas editoriais de pares (/substituir/arroz-por-batata-doce só se houver demanda medida).

## 2026-10-14 — Troca Certa: auditoria (nutrição, código, página no ar) e correções

Três auditorias em paralelo. Corrigido:
- **Valores/lógica:** verdura crua (inhame, cará, mandioquinha) era tratada como "pronta" e trocada com cozidos — agora é crua; feijão/tofu por proteína voltava vazio (mínimo por grupo: leguminosas 4 g, laticínios 3 g, frutas 5 g de carbo); requeijão saiu de laticínios (é troca de gordura); alimentos fora da lista só entram num grupo se o macro dominar (chocolate não vira "carboidrato"); arredondamento 0,5 g < 10 g, 1 g < 50 g, 5 g < 100 g, 10 g acima (erro ≤ ~5% a partir de 10 g; o anterior chegava a 14%); medidas da POF que enganam excluídas por alimento (mamão formosa "1 unidade = 310 g", batata-doce "1 unidade = 355 g", melancia em copo, tapioca em fatia, carne moída em bife, frango em fatia de 180 g, banana-nanica); medida preferida dá contagem de 1 a 4 (azeite = 1 colher de sopa; iogurte = 1 copo americano); aviso de calorias quando a diferença passa de 15% (antes 40 kcal fixos); recusas com motivo certo; nota do atum sem fonte removida; "quase tudo água" → "cerca de dois terços"; FAQ do pão responde em pão de forma e mostra a diferença de calorias.
- **Acrescentados:** óleo de soja, sardinha em lata, ovo frito, tangerina, kiwi, goma de tapioca (fécula), macarrão com ovos cru, tofu, verduras cruas.
- **Código/acessibilidade:** critério sugerido não depende do anterior; quantidade digitada não é sobrescrita; foco gerenciado; região viva curta; quantidade apagada mantém a última conta; busca só com 2+ letras; bônus de curadoria; toque ≥ 44 px; contraste; impressão sem páginas em branco; evento de abertura não duplicado.
- **Página:** nomes de exibição com o nome da TACO em letra pequena; apelidos e ordem da busca ("frango" → peito grelhado; "arroz" → arroz branco); dica para "macarrão cozido"; "kcal de calorias" corrigido; rolagem até a calculadora ao vir da página do alimento; links das tabelas para as páginas de alimento; 4 artigos relacionados.
- Pendente (aprovação): título/H1 com "lista de substituição de alimentos". Não feito: botão flutuante do WhatsApp cobre parte da tela no celular (componente do site inteiro); payload ~33 KB gzip (mesma ordem do comparador).

## 2026-10-14 — H1 da Troca Certa (aprovado pelo Montinho)

| Página | Campo | ATUAL | NOVO |
|---|---|---|---|
| /ferramentas/substituicao-de-alimentos | H1 | Calculadora de Substituição de Alimentos | Lista de Substituição de Alimentos: Calculadora e Tabela |

- Motivo: "lista de substituição de alimentos" é a busca principal do ATP (590/mês) e só estava no `<title>`. Sem `updatedAt` (ferramenta).

## 2026-10-14 — Links rastreados do vídeo do Substituidor

- `/l/yt-sub`, `/l/ig-sub` e `/l/wa-sub` → `/ferramentas/substituidor-de-exercicios`, para medir o vídeo "O aparelho está ocupado. E agora?" por canal (YouTube descrição, Instagram Reels, status do WhatsApp).

## 2026-10-15 — Troca Certa: whey e tilápia

- Pedido do Montinho. Entram fora da TACO, em `lib/alimentos/extras-troca.ts`, cada um com a fonte na tela no lugar da linha "TACO: …" e com asterisco na lista pronta.
- Whey protein concentrado: rótulo de referência do whey concentrado Growth, porção de 30 g = 122 kcal, 23 g de proteína, 4 g de carboidrato, 1,6 g de gordura (valores declarados pelo fabricante, conferidos em reprodução da tabela; o site da marca bloqueia acesso automático). Medida "scoop" de 30 g. 1 scoop ≈ 70 g de peito de frango grelhado em proteína.
- Tilápia (filé cru e grelhado): USDA FoodData Central SR Legacy, NDB 15261 (cru: 96 kcal, 20,08 g P, 1,7 g G) e 15262 (calor seco: 128 kcal, 26,15 g P, 2,65 g G). A API do USDA não abriu na sessão; valores conferidos em duas reproduções independentes.
- O aviso "Whey não está na TACO" foi removido da busca.

## 2026-10-15 — Troca Certa: whey pelos números do site e granola

- Whey alinhado ao valor que o site já usa no Mata a Vontade (Growth, 30 g = 123 kcal, 23 g P, 2,9 g C, 2,2 g G), a pedido do Montinho. Proteína não mudou: 1 scoop continua ≈ 70 g de frango grelhado.
- Granola entra no grupo de carboidratos com o mesmo valor do Mata a Vontade: USDA, granola caseira (NDB 08037), 489 kcal, 13,7 g P, 53,9 g C, 24,3 g G por 100 g. A tela manda conferir o rótulo da de pacote. Troca por arroz sai sempre com aviso de calorias.

## 2026-10-15 — Troca Certa: abóbora

- Abóbora cabotiá (cozida e crua, TACO) entra no grupo de carboidratos, com apelidos "abóbora", "cabotiá", "japonesa", "kabocha". 100 g de arroz branco ≈ 260 g de cabotiá cozida, com calorias parecidas.

## 2026-10-15 — Vídeo tutorial no Substituidor de Exercícios

- O Short "O aparelho está ocupado. E agora?" (YouTube Mck7dwGz0as) entra em /ferramentas/substituidor-de-exercicios, logo depois da ferramenta, na seção "Como usar, em vídeo".
- Carrega como capa com play (VideoMedido, agora com seletor configurável): o YouTube só é chamado quando a pessoa clica, e o play é medido em `article_video_play` com placement "substituidor-de-exercicios".
- Sem VideoObject por enquanto: a data de publicação precisa ser conferida no YouTube Studio.

## 2026-10-15 — Página do vídeo do Substituidor

- /videos/o-aparelho-esta-ocupado, com VideoObject (data de publicação 14/10/2026, conferida no YouTube Studio pelo print do Montinho; 0:45). Liga para o Substituidor e para três artigos (hip thrust, glúteos em casa, quando trocar o treino).
- Correção: o teste de vídeos (scripts/videos-test.ts) procurava o seletor antigo do VideoMedido; ajustado para o seletor configurável com padrão `.prose-blog`.

## 2026-10-15 — Troca Certa: nome "Abóbora cozida"

- A pedido do Montinho, a cabotiá aparece como "Abóbora cozida" / "Abóbora crua". A variedade continua visível na linha "TACO: Abóbora, cabotian, cozida".

## 2026-10-15 — Substituidor: vídeo no fim, atalho no topo

- A pedido do Montinho, a seção "Como usar, em vídeo" foi para o fim da página (#como-usar), e o topo ganhou o atalho "▶ Ver como usar (vídeo de 45 s)" logo abaixo do texto de abertura.

## 2026-10-15 — Links rastreados da Calculadora de Whey

- `/l/ig-whey` (stories do Instagram) e `/l/wa-whey` (status do WhatsApp) → `/ferramentas/calculadora-whey`, para medir a divulgação por canal.

## 2026-10-15 — Links rastreados da Calculadora de Déficit

- `/l/ig-deficit` (stories do Instagram) e `/l/wa-deficit` (status do WhatsApp) → `/ferramentas/calculadora-deficit-calorico`.

## 2026-10-15 — Link do YouTube da Calculadora de Whey

- `/l/yt-whey` → `/ferramentas/calculadora-whey`, para a descrição do vídeo tutorial no YouTube.

## 2026-10-15 — Vídeo tutorial na Calculadora de Whey

- Short "Quanto de whey tomar por dia?" (YouTube es4IiOkVqsg, publicado em 15/10/2026, 0:46, conferido no print do YouTube Studio) no fim de /ferramentas/calculadora-whey (#como-usar), com atalho "▶ Ver como usar (vídeo de 46 s)" no topo. Mesmo padrão do Substituidor: capa com play, YouTube só carrega no clique, play medido.
- Página /videos/quanto-whey-tomar-por-dia com VideoObject, ligando para a calculadora e três artigos de whey/proteína.

## 2026-10-15 — Monte seu Cardápio: só os alimentos marcados, e botão "excluir"

- Pedido do Montinho. Quem marca alimentos no formulário recebe cardápio só com eles: nada de banana, pasta de amendoim ou azeite que a pessoa não escolheu. Ordem: os marcados da refeição; se a refeição não tem marcados (ou é a ceia, que não é perguntada), os marcados das outras refeições que servem nela; se a pessoa pulou a etapa inteira, o banco completo, como antes.
- As versões da semana também só trocam entre os marcados. O "trocar" que a pessoa toca continua mostrando o banco, com os marcados primeiro.
- Novo botão "excluir" em cada item: tira o alimento, reequilibra as porções do dia sem trazer alimento novo e remove o item das escolhas daquela refeição. Evento `meal_item_removed`.
- Texto do formulário e da página: "o cardápio usa só os alimentos que você marcar".

## 2026-10-15 — Monte seu Cardápio: + e − em cada alimento

- Botões "−" e "+" em cada item: mudam a quantidade um passo de porção caseira por vez (meio filé, meia escumadeira), entre um passo e o dobro do teto do motor. Não reequilibram o resto do dia: a escolha é da pessoa, e as calorias/macros da refeição e do dia atualizam na hora. Evento `meal_portion_changed` (só a direção).
- No celular, os controles ficam na linha de baixo do nome do alimento.

## 2026-10-15 — Calculadora de Ciclo de Carboidratos (Fase 1)

- Nova ferramenta em /ferramentas/ciclo-de-carboidratos. Pesquisa: prints do Google do Montinho (autocompletar, visão geral por IA, "As pessoas também perguntam", "Outras pessoas pesquisaram"); sem export do Answer the Public, por decisão dele.
  - Usado: como fazer, para emagrecer, cutting, 5x2, carb cycling, dieta ciclo (pdf → página com tabela de exemplo), "ciclar carboidratos ajuda a emagrecer?".
  - Fora (nome de outro profissional/marca): dudu haluch, gorgonoid, pef 360.
  - Pauta, não cabe na página: "o que acontece se ficar 7 dias sem carboidratos?", "quais são os 3 carboidratos mais ruins?".
  - A visão geral por IA diz que o ciclo "evita que o metabolismo fique lento": a página responde que não há evidência disso.
- Motor em lib/carboidratos/ciclo.ts: média de macros pela cascata de lib/macros; pontuação de demanda por tipo × duração × intensidade (oculta); níveis relativos à semana; semana homogênea fica plana; calorias e proteína estáveis, gordura compensa entre 20% e 35%; dia baixo ≥ 130 g quando a média permite; alto ≤ 1,6× baixo; média semanal preservada. Testes em scripts/ciclo-carboidratos-test.ts.
- Divisão de papéis com o artigo /blog/ciclo-de-carboidratos-carb-cycling: a ferramenta fica com calculadora/como montar/quanto em cada dia; o artigo, com o que é/funciona. O artigo saiu do registro da Calculadora de Macros e ganhou o cartão "Montar meu ciclo" (também em treino-low-carb-musculacao). A Calculadora de Macros ganhou o link "montar meu ciclo de carboidratos", com a ponte de calorias e peso.
- Eventos `carb_cycle_*` só com categorias (objetivo, nível, origem das calorias), nunca peso ou calorias.

## 2026-10-15 — Ciclo de carboidratos: texto em português

Pedido do Montinho ("brasileiro não sabe inglês direito"). Na ferramenta, dois H2, uma pergunta do FAQ e o link para o artigo trocaram "carb cycling" por "ciclo de carboidratos". "Carb cycling" segue só no title (entre parênteses), numa resposta do FAQ que explica o termo e nas tags de busca. Title e H1 não mudaram.

## 2026-10-15 — Artigo ciclo de carboidratos: título em português e correção de afirmações

Aprovado pelo Montinho.
- Title: "Carb Cycling: Funciona? Protocolo Completo" → "Ciclo de Carboidratos Funciona? O Que Diz a Ciência". H1: "Ciclo de Carboidratos (Carb Cycling): Funciona? Protocolo Completo" → "Ciclo de Carboidratos Funciona? O Que É e o Que Diz a Ciência". Slug e description sem mudança. Motivo: português na frente; o artigo fica com "funciona? / o que é" e a ferramenta com "calculadora / como montar".
- Removido: "dia baixo cria déficit sem prejudicar o treino", insulina/ambiente anabólico, "maior oxidação de gordura contribui para composição corporal".
- Tabela de g/kg (dia baixo 0,5–1 g/kg) e exemplo de 80 kg (60 g no dia baixo, 320 no alto) trocados por exemplo calculado pela calculadora (280 g baixo / 370 g alto, 2.500 kcal).
- Corrigido o link "Burke et al., 2011", que apontava para outro estudo (PMID 24149627); agora PMID 21660838. Citações novas: Impey 2018 (29453741), ACSM/AND/DC 2016 (26891166), Henselmans 2022 (35215506), conferidas no PubMed.
- updatedAt: 2026-10-15.

## 2026-10-15 — Mapa Muscular (/exercicios): prints de "mapa muscular" e "exercícios por músculo"

A página já aparece no autocompletar de "mapa muscular". Title, description e H1 sem mudança.
- Nova seção H2 "Mapa muscular do corpo humano: costas, pernas, braços e glúteos" (autocompletar: das costas, da perna, da coxa, braço, glúteo, do corpo humano, academia), com as regiões linkando as páginas de músculo.
- FAQ + FAQPage (8): o que é mapa muscular; quais os 7 grupos musculares; qual site mostra exercícios para cada músculo; como usar o mapa para montar o treino; quantos exercícios por músculo é o ideal; 3 exercícios por grupo é suficiente; como dividir o treino por grupo muscular; rosto e pescoço (visão geral por IA lista cabeça e pescoço). Respostas de volume alinhadas à Calculadora de Volume.
- Fora: "quais são os 3 tipos musculares" (anatomia; fonte oficial não acessível agora, NCBI/MedlinePlus com CAPTCHA); "melhor aplicativo gratuito para estudar músculos"; anatomia 3D, atlas, desenho fácil.
- Pautas: "mapa muscular para imprimir / pdf" e "exercícios e músculos trabalhados pdf" (isca); "quantos exercícios por músculo" (cluster forte no autocompletar: ideal, hipertrofia, full body, na semana, dois exercícios) — avaliar artigo próprio ou seção na Calculadora de Volume, verificando canibalização com volume-de-treino-ideal; "lista de exercícios para iniciantes"; "10 melhores exercícios de musculação".

## 2026-10-15 — /exercicios/lombar entra no Google (prints de "exercícios para lombar")

Aprovado pelo Montinho. A página era `isIndexable: false` desde #748.
- Title: "Exercícios Que Trabalham a Lombar | Montinho" → "Exercícios Para Lombar: Academia, Máquina e Casa | Montinho". H1: "Exercícios que trabalham a lombar" → "Exercícios para lombar". Description nova. isIndexable: true (entra no sitemap e no hub).
- SERP dominada por dor (inflamada, travada, na cama, fisioterapia, parar de doer, aliviar em 3 minutos, desinflamar). Página fica no treino (academia, máquina, musculação, em casa, em pé, melhores, 10 exercícios para fortalecer na academia) e manda dor para os artigos: exercicios-para-dor-nas-costas-coluna, dor-lombar-na-musculacao, travou-a-lombar-o-que-fazer.
- Extras: melhores para fortalecer na academia; na máquina; em pé e em casa; prancha e ponte (aparecem no snippet da Veja Saúde); dor/travada/inflamada → médico ou fisioterapeuta.
- Fora: alongamentos para alívio (visão geral por IA), "como aliviar em 3 minutos", "o que é bom para desinflamar", "qual posição alivia", "na cama", "vídeo de exercício para coluna" — intenção clínica.

## 2026-10-15 — /exercicios/antebraco entra no Google (prints de "exercícios para antebraço")

Aprovado pelo Montinho (duas partes).
- Base de exercícios: +5 (rosca de punho invertida, rosca de punho na polia, rosca inversa na polia, rosca de punho com elástico, suspensão na barra), com perfil em biomecanica.ts. Página vai de 3 para 8 exercícios; os novos aparecem também no Substituidor e na Calculadora de Volume.
- Title: "Exercícios Para Antebraço | Montinho" → "Exercícios Para Antebraço: Academia, Halter, Polia e Casa | Montinho". Description nova. isIndexable: true.
- Extras: melhores na academia; com halter; na polia; em casa e sem equipamento (elástico); feminino; rosca martelo × rosca inversa (visão geral por IA lista as duas).
- Intenção 100% de treino (academia, halter, polia, em casa, feminino, elástico, sem equipamento, caseiro).

## 2026-10-15 — Deltoide anterior, parte superior das costas e adutores entram no Google

Aprovado pelo Montinho. As três eram `isIndexable: false` desde #748; agora o Mapa tem as 19 regiões indexáveis.
- Base: +2 deltoide anterior (elevação frontal na polia, com anilha) e +6 adutores (adução na polia, Copenhagen, afundo lateral, adução deitado, adução com elástico, agachamento sumô com halter). Deltoide anterior 6 → 8; adutores 2 → 8.
- Deltoide anterior. Title → "Exercícios Para Deltoide Anterior: Academia, Halteres e Polia | Montinho". Extras: melhores; com halteres; máquina e polia; as 3 porções (PAA); precisa treinar separado? Fora: função, origem e inserção, alongamento.
- Parte superior das costas. Title → "Exercícios Para Parte Superior das Costas: Academia e Casa | Montinho". Extras: melhores (visão geral por IA: remada pronada aberta, crucifixo inverso, face pull); fortalecer na academia; feminino; dor → médico/fisioterapeuta + artigo. Fora: aliviar dor, "como definir as costas rápido", "treino de costas completo pdf" (já pauta).
- Adutores. Title → "Exercícios Para Adutores (Parte Interna da Coxa) | Montinho" (nome popular nas buscas). Extras: como treinar (PAA); academia; em casa e sem máquina (caneleira); adutores × abdutores; como endurecer a parte interna da coxa (sem redução localizada). Fora: fisioterapia, "quais são os 3 adutores principais" (anatomia).

## 2026-10-16 — Vídeo na página Minha História

Short do Montinho (Dg8Sbv6_V8w) no topo de /minha-historia, logo depois da foto principal e antes do texto, com medição de play (VideoMedido, slug "minha-historia"). Título, description e H1 sem mudança. Ainda fora de /videos: falta a data de publicação para o VideoObject.

## 2026-10-16 — Vídeo "aprenda a recomeçar rápido" nas páginas locais do blog

O short Dg8Sbv6_V8w é o "aprenda a recomeçar rápido" (VideoRecomecar), que já estava em todas as páginas de atendimento em app/ desde 01/10. Correção do registro anterior: em /minha-historia o bloco saiu como "Minha história em vídeo"; agora tem o título certo do vídeo e o link para o resumo em /videos.
- Uma mudança de componente, de uma vez (AGENTS.md: um componente em N páginas é uma mudança só): VideoRecomecar no fim de 81 artigos locais do blog (lib/video/recomecar.ts) e em /academia-com-personal-trainer-tambore, a única página de atendimento em app/ que não tinha.
- Sem updatedAt: componente renderizado em lote não muda o que o leitor aprende.
- 16/10, segunda parte (pedido do Montinho): +79 guias de academia (regionais e de marca) no mesmo registro. Ficam de fora 18 artigos genéricos sobre academia (primeira semana, como escolher academia, vergonha de treinar etc.). Total: 160 artigos.

## 2026-10-16 — Vídeo do Montinho no artigo Upper Lower

treino-upper-lower-superior-inferior: o vídeo de terceiro (rux_N9zfPXY, treinos AB/ABC/ABCD) foi trocado pelo short do Montinho (pNphDSjlr2I), no mesmo lugar (fim do artigo), em formato vertical. Sem updatedAt: troca de vídeo não muda o texto. Fora de /videos até ter a data de publicação.

## 2026-10-16 — Upper Lower: afirmações corrigidas

Aprovado pelo Montinho. Title, description e H1 sem mudança. updatedAt 2026-10-16.
- "2x por semana produz ~40% mais hipertrofia, com volume igual": removido. O link "publicada no JSCR" apontava para um estudo de ashwagandha (PMID 26609282). Agora: Schoenfeld, Ogborn e Krieger 2016 (Sports Med, PMID 27102172) e a revisão de 2019 dos mesmos autores (J Sports Sci, PMID 30558493), que conclui que com volume igual a frequência não muda a hipertrofia de forma relevante. Vantagem apresentada como prática (distribuir séries e recuperar).
- "documentadamente superior", "sinal anabólico constante", "excepcionalmente", "reduz 50% do potencial hormonal e metabólico", "a divisão que a ciência mais valida", "possivelmente a melhor divisão existente": removidos ou reescritos.
- Excerpt e abertura: removida a atribuição sem fonte de preferência a Brad Schoenfeld, Eric Helms e Mike Israetel.
- Pendente de aprovação: H1 "Treino Upper/Lower: A Divisão que Maximiza Hipertrofia em 4 Dias" (superlativo sem sustentação).

## 2026-10-16 — HYROX SP 2026: programação provisória (varredura automática)

Fonte: hyrox.com/event/hyrox-sao-paulo-2 (oficial), lida em 16/10. Entraram a tabela de largadas por categoria (sábado 8h–20h30, domingo 8h–13h10), o check-in no dia (sáb 6h30–20h30; dom 6h30 até a última bateria), o check-in antecipado confirmado pelo HYROX (16/10, 10h–19h, Puma Morumbi Shopping, só atletas de sábado), briefing do Relay e faixa das cerimônias, mais 2 FAQs (horário, retirada de kit). Ingressos/esgotado: sem nova verificação (plataforma do HYROX Brasil inacessível daqui), segue "até 9/10". Capa sem mudança. updatedAt 2026-10-16.

## 2026-10-16 — Maratona de Curitiba 2026: largada, ondas, hidratação e premiação (varredura automática)

Fonte: maratonadecuritiba.com.br (FAQ oficial), lida em 16/10. Largada às 5h em 3 ondas (ACD 42/21; elite e geral 42/21; 10/5), funil por pace, chegar 40 min antes; hidratação; premiação (bruto geral, líquido por categoria na maratona, dinheiro só elite e ACD do CPB). FAQ do horário atualizada. updatedAt 2026-10-16. Brasília: sem fato novo verificável (site oficial devolve 406 a acesso automatizado; não contornado).
- 16/10 (aprovado pelo Montinho): H1 "Treino Upper/Lower: A Divisão que Maximiza Hipertrofia em 4 Dias" → "Treino Upper/Lower: Como Montar em 2, 3, 4 ou 5 Dias". metaTitle e description sem mudança.

## 2026-10-16 — Links rastreados do Simulador de Emagrecimento (stories IG + status WhatsApp)

Par `ig-emagrecimento` / `wa-emagrecimento` em `lib/crm/links.ts`, destino `/ferramentas/simulador-emagrecimento`, para o vídeo da calculadora de emagrecimento. Um código por rede, como `ig-fds`/`wa-fds`; `utm_content=simulador_emagrecimento`. Sem mudança de conteúdo na página.

## 2026-10-17 — Link rastreado da Calculadora de Déficit no YouTube

`yt-deficit` em `lib/crm/links.ts`, destino `/ferramentas/calculadora-deficit-calorico`, para a descrição do Short "Quanto comer pra emagrecer?". Completa o trio com `ig-deficit` e `wa-deficit`. Sem mudança de conteúdo na página.

## 2026-10-19 — Link rastreado do Simulador de Emagrecimento no YouTube

`yt-emagrecimento` em `lib/crm/links.ts`, destino `/ferramentas/simulador-emagrecimento`, para a descrição do vídeo do simulador no YouTube. Completa o trio com `ig-emagrecimento` e `wa-emagrecimento`. Sem mudança de conteúdo na página.

## 2026-10-19 — Vídeo do Montinho na Calculadora de Déficit Calórico

Short KtmKJkZqkyw incorporado em `/ferramentas/calculadora-deficit-calorico`, seção "Como usar, em vídeo" no fim da página (mesmo padrão do Substituidor, com VideoMedido). Ele tinha entrado por engano no Simulador de Emagrecimento (#935) e foi retirado de lá. Sem mudança de título, descrição ou texto da ferramenta; sem updatedAt.

## 2026-10-19 — Vídeos das duas ferramentas de emagrecimento

- Short 2NkNKAhku9A incorporado em `/ferramentas/simulador-emagrecimento` ("Como usar, em vídeo", com VideoMedido).
- Páginas novas em `/videos`: `quanto-comer-para-emagrecer` (KtmKJkZqkyw, Calculadora de Déficit) e `quanto-tempo-para-emagrecer-simulador` (2NkNKAhku9A, Simulador). Temas diferentes, cada uma com a sua ferramenta. `publicadoEm` vazio até a data ser conferida no YouTube Studio.
- As seções de vídeo das duas ferramentas linkam para a página do vídeo.
- 19/10: `publicadoEm` conferido no YouTube Studio (prints do Montinho): KtmKJkZqkyw em 17/10, 2NkNKAhku9A em 19/10. Exemplos do vídeo acrescentados ao texto das duas páginas.

## 2026-10-19 — Resultado do HYROX São Paulo 2026 lançado

`resultado-hyrox-sao-paulo-2026` saiu de "aguardando a prova": vencedores do Pro, Bruno Henrique Carvalho (58:41) e Manuela Garcia (1:07:37), mais a melhor brasileira, Bruna Berbel (1:10:23). Confirmados em duas fontes independentes: HYRESULT (classificação por categoria) e Hora do Burpee (19/10). Posições do 2º ao 5º e número de inscritos ficaram de fora porque só o HYRESULT traz esses dados. Uma FAQ nova (menos de 1 hora) e a FAQ do vencedor atualizada. Excerpt atualizado. updatedAt 2026-10-19. A metaDescription ainda fala em "Elite", mas a categoria de topo em SP foi a Pro; a troca depende de aprovação (ATUAL/PROPOSTA/MOTIVO).
Mr. Olympia Brasil: segue sem publicar. Terra e Tribuna do Sertão republicam o texto do Esporte News Mundo (o Terra diz "Licenciado de Esporte News Mundo"), então é uma fonte só, e o site oficial devolve 406.
