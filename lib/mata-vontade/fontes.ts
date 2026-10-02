/**
 * "Veja alguém fazendo": vídeo no YouTube de uma receita parecida, para quem
 * quer ver o ponto da massa e o tempo. Só entra link de vídeo encontrado em
 * busca (nunca ID montado à mão). O texto da ferramenta é nosso, resumido.
 */
export type Fonte = { portal: string; titulo: string; url: string };

export const FONTES: Record<string, Fonte> = {
  "bolo-caneca-vulcao": { portal: "YouTube", titulo: "Bolo Vulcão de Caneca", url: "https://www.youtube.com/watch?v=L8b_s34VFyE" },
  "bolo-chocolate-forma": { portal: "YouTube", titulo: "Bolo de Whey Protein com banana, sem nenhum tipo de farinha!", url: "https://www.youtube.com/watch?v=9NZbFJmEz9s" },
  "bolo-caneca-choc-sem-ovo": { portal: "YouTube", titulo: "COMO FAZER BOLO FIT DE CANECA - (Banana, Aveia e Whey Protein)", url: "https://www.youtube.com/watch?v=8UUvjflWf3Q" },
  "brownie-caneca": { portal: "YouTube", titulo: "Receitinha Proteica: Brownie de Amendoim com Whey", url: "https://www.youtube.com/watch?v=SqB8QYydZuQ" },
  "brownie-air-fryer": { portal: "@dicasemfamilia013", titulo: "BROWNIE FIT COM 4 INGREDIENTES EM POUCOS MINUTOS NA AIRFRYER", url: "https://www.youtube.com/watch?v=jaHHJIfu1vc" },
  "brownie-travessa": { portal: "YouTube", titulo: "BOLO BROWNIE FIT - WHEY COM BANANA", url: "https://www.youtube.com/watch?v=QXuTNMCrVqA" },
  "brigadeiro-colher-proteico": { portal: "YouTube", titulo: "Brigadeiro de Whey [Cozinha básica]", url: "https://www.youtube.com/watch?v=pTSUNlBSfBs" },
  "brigadeiro-panela-medida": { portal: "YouTube", titulo: "RECEITA COM WHEY PROTEIN - BRIGADEIRO DE WHEY!", url: "https://www.youtube.com/watch?v=4AHxZwvibPc" },
  "brigadeiro-banana-cacau": { portal: "YouTube", titulo: "RECEITA FIT - Brigadeiro de Banana e Cacau", url: "https://www.youtube.com/watch?v=JqK6o3Ezt4E" },
  "quadradinhos-morango": { portal: "YouTube", titulo: "SORVETE/ BOMBOM DE IOGURTE GREGO COM MORANGO", url: "https://www.youtube.com/watch?v=SGNao8nlOt8" },
  "chocolate-quente-cremoso": { portal: "YouTube", titulo: "CHOCOLATE QUENTE COM WHEY! CREMOSO E PROTEICO!", url: "https://www.youtube.com/shorts/0cEy38ZiKFU" },
  "creme-cacau-amendoim": { portal: "YouTube", titulo: "PASTA DE AMENDOIM COM CACAU", url: "https://www.youtube.com/shorts/1or8jKXXD9c" },
  "cookie-air-fryer": { portal: "YouTube", titulo: "COOKIE PROTEICO SURPREENDENTEMENTE!", url: "https://www.youtube.com/shorts/9VtVVbc7Rg8" },
  "cookie-aveia-banana": { portal: "Receitas que Amo", titulo: "COOKIE DE BANANA COM AVEIA - RECEITAS QUE AMO", url: "https://www.youtube.com/watch?v=zRIOKRTI6-Q" },
  "cookie-caneca": { portal: "YouTube", titulo: "Receitinha Proteica: Cookie de micro-ondas com Whey", url: "https://www.youtube.com/watch?v=YVYH-MKTJpA" },
  "sorvete-morango-iogurte": { portal: "YouTube", titulo: "Sorvete de Iogurte Grego", url: "https://www.youtube.com/shorts/St6NgL5gtkg" },
  "picole-iogurte": { portal: "YouTube", titulo: "PICOLÉ DE IOGURTE GREGO COM MORANGO - fácil e cremoso", url: "https://www.youtube.com/watch?v=Qhu_P1WJpAQ" },
  "mousse-iogurte-grego": { portal: "YouTube", titulo: "Mousse de chocolate [com iogurte grego]", url: "https://www.youtube.com/watch?v=L9FmErASq1w" },
  "mousse-morango": { portal: "YouTube", titulo: "Mousse de Iogurte Grego e Morango", url: "https://www.youtube.com/watch?v=JWxvQtw3WSw" },
  "pudim-caneca": { portal: "YouTube", titulo: "PUDIM NA CANECA, NO MICROONDAS. MUITO RÁPIDO E DELICIOSO!", url: "https://www.youtube.com/watch?v=zN0zvQJg9EY" },
  "pudim-chia-baunilha": { portal: "4FitClub", titulo: "Pudim de Chia com Whey Protein - 4FitClub Gourmet", url: "https://www.youtube.com/watch?v=Xg-K8vtiPR4" },
  "creme-doce-de-leite": { portal: "YouTube", titulo: "DOCE DE LEITE FIT CASEIRO", url: "https://www.youtube.com/watch?v=jOutumP5o04" },
  "pacoca-colher": { portal: "YouTube", titulo: "PAÇOCA FIT PROTEICA - A MELHOR", url: "https://www.youtube.com/watch?v=_TXdJeL195s" },
  "bombom-pacoca": { portal: "YouTube", titulo: "Bombom Fit Proteico com Whey Protein", url: "https://www.youtube.com/watch?v=1w8yZBvytL8" },
  "churros-air-fryer": { portal: "YouTube", titulo: "CHURROS NA AIRFRYER FÁCIL RÁPIDO E SEM SUJEIRA", url: "https://www.youtube.com/watch?v=Dmxm-WYNOtY" },
  "cheesecake-pote": { portal: "YouTube", titulo: "Cheesecake de Iogurte Grego", url: "https://www.youtube.com/watch?v=Vqk5xFvBt20" },
  "cheesecake-caneca": { portal: "YouTube", titulo: "Cheesecake de Microondas", url: "https://www.youtube.com/watch?v=6E7hh_Przvw" },
  "milkshake-proteico": { portal: "YouTube", titulo: "MILK SHAKE PROTEICO COM WHEY PROTEIN DE CHOCOLATE", url: "https://www.youtube.com/watch?v=rDa01N1FTiA" },
  "milkshake-morango": { portal: "YouTube", titulo: "MILKSHAKE DE MORANGO PROTEICO", url: "https://www.youtube.com/watch?v=floCXfaS_G8" },
  "frappe-cafe": { portal: "YouTube", titulo: "FRAPPUCCINO DE WHEY", url: "https://www.youtube.com/watch?v=YocCjNMt1Do" },
  "bolo-caneca-baunilha": { portal: "YouTube", titulo: "Bolo de Caneca Proteico - Bolo de Caneca de Whey Protein", url: "https://www.youtube.com/watch?v=y4A2IxAEW24" },
  "bolo-caneca-banana-canela": { portal: "YouTube", titulo: "COMO FAZER BOLO FIT DE CANECA - (Banana, Aveia e Whey Protein)", url: "https://www.youtube.com/watch?v=8UUvjflWf3Q" },
};
