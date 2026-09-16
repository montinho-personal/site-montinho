/**
 * Conversor mg/mL e Seringa U-100 — a matemática e as barreiras.
 *   npx tsx scripts/concentracao-test.ts
 *
 * Dois tipos de proteção. A primeira é aritmética: 60 mg em 2,5 mL são
 * 24 mg/mL, a marca 10 de uma U-100 é 0,10 mL, e 0,10 mL dessa solução
 * contêm 2,4 mg. A segunda é de produto: o código NÃO pode ter a função que
 * recebe "quero X mg" e devolve uma marca de seringa (o caminho inverso que
 * existe parte de quantidade JÁ PRESCRITA), e a interface não pode
 * chamar marca de "UI do produto" nem quantidade contida de "dose".
 */
import { readFileSync } from "node:fs";
import { CONVERSOR_NO_AR, REVISAO_AUTOR, REVISAO_TECNICA } from "../lib/concentracao/revisao";
import { FONTES, linkDaFonte } from "../lib/concentracao/fontes";
import { ARTIGOS_COM_LINK_CONCENTRACAO } from "../lib/concentracao/artigos";
import { blogPosts } from "../lib/blog";
import {
  calcularConcentracao, conferirInstrucao, formatarConcentracao, formatarMg, formatarMl, lerMarca, lerNumero,
  localizarQuantidadePrescrita, marcaU100ParaMl, quantidadeNoVolume, tabelaU100,
  validarMarca, validarMg, validarMl, MARCAS_TABELA,
} from "../lib/concentracao/calculo";
import { COMPOSTOS, nomeDoComposto } from "../lib/concentracao/compostos";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number | null, b: number, tol = 1e-9) => a != null && Math.abs(a - b) <= tol;

bloco("1. O EXEMPLO DO BRIEFING: 60 mg EM 2,5 mL");
{
  const c = calcularConcentracao(60, 2.5);
  ok("60 mg ÷ 2,5 mL = 24 mg/mL", perto(c, 24));
  ok("marca 10 da U-100 = 0,10 mL", perto(marcaU100ParaMl(10), 0.1));
  ok("24 mg/mL × 0,10 mL = 2,4 mg contidos", perto(quantidadeNoVolume(24, 0.1), 2.4));
  const l = lerMarca(24, 10)!;
  ok("lerMarca junta as três contas", l.marca === 10 && perto(l.volumeMl, 0.1) && perto(l.mg, 2.4));
}

bloco("2. A ESCALA U-100 (só nesse contexto)");
for (const [marca, ml] of [[1, 0.01], [5, 0.05], [10, 0.1], [20, 0.2], [30, 0.3], [40, 0.4], [50, 0.5], [100, 1]] as const) {
  ok(`marca ${marca} → ${ml} mL`, perto(marcaU100ParaMl(marca), ml));
}
ok("tabela educacional tem as marcas declaradas, sem linha destacada", tabelaU100(24).length === MARCAS_TABELA.length);
ok("tabela: marca 5 a 24 mg/mL contém 1,2 mg", perto(tabelaU100(24)[0].mg, 1.2));

bloco("3. ENTRADA EM PORTUGUÊS");
ok("60 lê 60", lerNumero("60") === 60);
ok("60,0 lê 60", lerNumero("60,0") === 60);
ok("2,5 lê 2.5", lerNumero("2,5") === 2.5);
ok("2.5 lê 2.5", lerNumero("2.5") === 2.5);
ok("' 2,5 ' com espaços lê 2.5", lerNumero(" 2,5 ") === 2.5);
ok(",5 lê 0.5", lerNumero(",5") === 0.5);
ok("zero não é valor", lerNumero("0") === null);
ok("negativo não é valor", lerNumero("-5") === null);
ok("texto não é valor", lerNumero("dez") === null);
ok("vazio não é valor", lerNumero("") === null && lerNumero(null) === null);
ok("1e309 (Infinity) não é valor", lerNumero("1e309") === null);
ok("NaN literal não é valor", lerNumero("NaN") === null);
ok("dois pontos decimais não é valor", lerNumero("2.5.1") === null);

bloco("4. VALIDAÇÃO COM MENSAGEM CERTA");
ok("mg vazio → 'vazio'", validarMg("").erro === "vazio");
ok("mg texto → 'invalido'", validarMg("abc").erro === "invalido");
ok("mg 0 → 'invalido' (zero não é quantidade)", validarMg("0").erro === "invalido");
ok("mg 1.000.000 → 'fora_do_limite'", validarMg("1000000").erro === "fora_do_limite");
ok("mL 0,005 → 'fora_do_limite'", validarMl("0,005").erro === "fora_do_limite");
ok("mL 2,5 → válido", validarMl("2,5").valor === 2.5 && validarMl("2,5").erro === null);
ok("marca 10 → válida", validarMarca("10").valor === 10);
ok("marca 10,5 → inválida (V1 pede marca cheia)", validarMarca("10,5").erro === "invalido");
ok("marca 0 → inválida", validarMarca("0").erro === "invalido");
ok("marca 101 → fora da escala", validarMarca("101").erro === "fora_do_limite");
ok("marca 100 → válida (o topo da escala)", validarMarca(100).valor === 100);

bloco("5. NUNCA NaN, Infinity OU undefined");
ok("concentração com mL zero → null", calcularConcentracao(60, 0) === null);
ok("concentração com mg negativo → null", calcularConcentracao(-1, 2.5) === null);
ok("concentração com NaN → null", calcularConcentracao(NaN, 2.5) === null);
ok("marca negativa → null", marcaU100ParaMl(-1) === null);
ok("quantidade com Infinity → null", quantidadeNoVolume(Infinity, 0.1) === null);
ok("formatar Infinity vira travessão, não 'Infinity'", formatarMg(Infinity) === "—" && formatarMl(NaN) === "—");

bloco("6. FORMATAÇÃO EM PORTUGUÊS");
ok("2,4 mg", formatarMg(2.4) === "2,4");
ok("0,125 mg mantém três casas", formatarMg(0.125) === "0,125");
ok("24 mg/mL sem zeros de enfeite", formatarConcentracao(24) === "24");
ok("0,10 mL sempre com duas casas", formatarMl(0.1) === "0,10");
ok("1,00 mL", formatarMl(1) === "1,00");
ok("ponto flutuante não vaza: 0,3 × 3", formatarMg(quantidadeNoVolume(3, 0.3)!) === "0,9");

bloco("7. CONFERIR UMA INSTRUÇÃO (sem corrigir a dose)");
{
  const c = 24;
  ok("2,4 mg na marca 10 → compatível", conferirInstrucao(c, 2.4, 10).status === "compativel");
  ok("2,40 mg (arredondado) → compatível", conferirInstrucao(c, 2.4000001, 10).status === "compativel");
  ok("2,5 mg na marca 10 → não corresponde (4%)", conferirInstrucao(c, 2.5, 10).status === "nao_corresponde");
  ok("24 mg na marca 10 → não corresponde (erro de 10×)", conferirInstrucao(c, 24, 10).status === "nao_corresponde");
  ok("0,24 mg na marca 10 → não corresponde (erro de 10× para baixo)", conferirInstrucao(c, 0.24, 10).status === "nao_corresponde");
  ok("2,4 mg na marca 100 → não corresponde", conferirInstrucao(c, 2.4, 100).status === "nao_corresponde");
  const r = conferirInstrucao(c, 2.5, 10);
  ok("o resultado mostra o que a marca contém, para a pessoa ver a diferença", r.status === "nao_corresponde" && perto(r.mgContido, 2.4));
  ok("o resultado NÃO traz uma marca sugerida", !("marcaSugerida" in r) && !("marcaCorreta" in r) && !("correcao" in r));
  ok("mg inválido → 'invalido'", conferirInstrucao(c, 0, 10).status === "invalido");
  ok("quantidade minúscula usa o piso absoluto: 0,012 vs 0,01 mg → compatível", conferirInstrucao(1, 0.012, 1).status === "compativel");
}

bloco("8. AS BARREIRAS ESTÃO NO CÓDIGO, NÃO SÓ NA INTENÇÃO");
{
  const lib = readFileSync("lib/concentracao/calculo.ts", "utf8");
  const semComentarios = lib.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  ok("nenhuma função de dose recomendada", !/calculateRecommendedDose|doseRecomendada|calcularDose\b/.test(semComentarios));
  ok("nenhum solver reverso mg → marca", !/targetMgToInjectionUnits|mgParaMarca|marcaPara(Mg|Dose)|unidadesPara/.test(semComentarios));
  ok("nenhuma função devolve marca a partir de mg desejado", !/function\s+\w*(marca|unidade)\w*\s*\([^)]*mg\w*Desejad/i.test(semComentarios));

  /*
   * O caminho inverso é permitido, mas só na forma que não vira prescrição:
   * parte de quantidade JÁ PRESCRITA, devolve onde ela cai, e não corrige
   * nada. Estas três linhas são a fronteira inteira.
   */
  ok("o caminho inverso não recebe quantidade desejada", !/mgDesejad|quantidadeDesejad|mgAlvo|doseAlvo/i.test(semComentarios));
  ok("o caminho inverso não devolve correção", !/marcaCorreta|marcaSugerida|corrig/i.test(semComentarios));
  ok("o caminho inverso fala em prescrito", /mgPrescrito/.test(semComentarios));

  const comp = ["components/concentracao/ConversorConcentracao.tsx", "components/concentracao/SeringaU100.tsx", "app/ferramentas/conversor-mg-ml-u100/page.tsx"]
    .map((f) => { try { return readFileSync(f, "utf8"); } catch { return ""; } })
    .join("\n");
  if (comp.trim().length > 0) {
    const semC = comp.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
    ok("a interface nunca diz 'UI do produto' nem 'UI do medicamento'", !/UI do (produto|medicamento|composto)/i.test(semC));
    /*
     * A palavra "dose" deixou de ser proibida e passou a ser vigiada, porque
     * proibir a palavra proibia junto a coisa certa de dizer: converter uma
     * dose JÁ PRESCRITA em mL e em marcas é exatamente o que a página faz, e
     * é assim que as pessoas escrevem a pergunta. O que continua proibido é a
     * página ter opinião sobre a dose — escolher, sugerir, qualificar como
     * certa ou segura, ensinar a subir, ou citar uma dose com número.
     */
    ok("a página nunca qualifica uma dose", !/dose (certa|ideal|recomendada|segura|indicada|adequada|inicial|usual|habitual|de manutenção|padrão)/i.test(semC));
    ok("a página nunca ensina a mexer na dose", !/(aumentar|reduzir|diminuir|ajustar|escalonar) a dose|titula(ção|r)\b|subir a dose/i.test(semC));
    ok("a página nunca afirma qual é a dose de alguém", !/sua dose (é|seria|deve|fica)|a dose que você (deve|precisa|tem que)/i.test(semC));
    ok("nenhuma dose aparece com número", !/dose de \d|\bdose\b[^.!?]{0,30}\d+\s*(mg|mcg|ui)\b/i.test(semC));
    ok("a página diz de frente que não escolhe a dose", /não (diz|determina|escolhe|define) (qual|quanto|a dose)/i.test(semC));
    ok("a interface nunca diz 'aplique' / 'injete' como instrução", !/\b(aplique|injete)\b/i.test(semC));
    ok("nenhum campo 'quero tomar'", !/quero tomar|quantas unidades coloco/i.test(semC));
    /*
     * Nome de substância passou a ser permitido — mas só como palavra, nunca
     * como preset. O que continua proibido é o que traz risco: um nome
     * acompanhado de número, que é um valor preenchido por alguém; e um nome
     * perto da palavra dose, que é a página opinando sobre quantidade. O
     * catálogo em lib/concentracao/compostos.ts é verificado à parte, e não
     * carrega número nenhum.
     */
    const SUBSTANCIAS = /tirzepatid\w*|retatrutid\w*|semaglutid\w*|liraglutid\w*|BPC-157|TB-500|GHK-Cu|CJC-1295|ipamorelina|tesamorelina|AOD-9604/gi;
    const nomes = semC.match(SUBSTANCIAS) ?? [];
    const comNumero = nomes.filter((_, i) => {
      const pos = semC.toLowerCase().indexOf(nomes[i].toLowerCase());
      return /\d+\s*(mg|ml|ui|mcg)/i.test(semC.slice(pos, pos + 90));
    });
    ok("nenhum nome de substância aparece com quantidade ao lado", comNumero.length === 0);
    ok("nenhum nome de substância aparece perto da palavra dose", !/(tirzepatid|retatrutid|semaglutid|liraglutid|BPC|TB-500)[^.!?]{0,80}\bdose/i.test(semC));
    ok("hormônio do crescimento continua fora", !/hormônio do crescimento/i.test(semC));
    ok("o nome do composto não preenche nenhum campo", !/COMPOSTOS[\s\S]{0,300}(setMgTxt|setMlTxt|setConcTxt)/.test(semC));
    ok("nenhuma cor verde significando 'pode aplicar'", !/pode aplicar|seguro aplicar|verde/i.test(semC));
    ok("o aviso de segurança existe", /não determina quanto você deve injetar/i.test(semC));
    ok("a distinção marca × UI está escrita", /não significa que o outro composto/i.test(semC) || /não transforma/i.test(semC));
    ok("a trava de insulina existe", /não calcula doses de insulina/i.test(semC));
    ok("nenhum evento carrega valor: trackEvent sem mg/ml/marca nos params", !/trackEvent\([^)]*\b(mg|ml|marca|concentracao)\s*:/i.test(semC));
  }
}

bloco("8B. O CAMINHO INVERSO: QUANTIDADE PRESCRITA → ONDE ELA CAI");
{
  const c = 24; // 60 mg em 2,5 mL
  const r = localizarQuantidadePrescrita(c, 2.5);
  ok("2,5 mg a 24 mg/mL dão 0,104166… mL", r.status === "ok" && perto(r.volumeMl, 2.5 / 24));
  ok("e caem por volta da marca 10,4", r.status === "ok" && perto(r.marcaAproximada, 10.4));
  ok("a marca não é arredondada para inteiro", r.status === "ok" && !Number.isInteger(r.marcaAproximada));
  ok("2,4 mg a 24 mg/mL caem exatamente na marca 10", (() => { const x = localizarQuantidadePrescrita(c, 2.4); return x.status === "ok" && perto(x.marcaAproximada, 10); })());
  ok("nada acima de 1 mL é apresentado como cabível", localizarQuantidadePrescrita(c, 50).status === "fora_da_seringa");
  ok("mas o volume verdadeiro continua sendo dito", (() => { const x = localizarQuantidadePrescrita(c, 50); return x.status === "fora_da_seringa" && perto(x.volumeMl, 50 / 24); })());
  ok("quantidade menor que a menor marca também é dita, não arredondada para 1", localizarQuantidadePrescrita(c, 0.05).status === "fora_da_seringa");
  ok("entrada inválida não vira número", localizarQuantidadePrescrita(c, 0).status === "invalido" && localizarQuantidadePrescrita(0, 2.5).status === "invalido");
  ok("o resultado nunca traz sugestão de quantidade", !("sugestao" in r) && !("recomendado" in r) && !("marcaCorreta" in r));
  ok("o inverso é coerente com o direto", (() => { const x = localizarQuantidadePrescrita(c, 2.4); return x.status === "ok" && perto(lerMarca(c, Math.round(x.marcaAproximada))!.mg, 2.4); })());
}

bloco("8C. O CATÁLOGO DE COMPOSTOS É SÓ NOME");
{
  const bruto = readFileSync("lib/concentracao/compostos.ts", "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  const semNomesProprios = bruto.replace(/GHK-Cu|AOD-9604|CJC-1295|TB-500|BPC-157/g, "");
  ok("há compostos para escolher", COMPOSTOS.length >= 10);
  ok("nenhum composto carrega mg, mL, UI ou faixa de uso", !/\b(mg|ml|ui|mcg|dose|faixa|concentração)\b/i.test(semNomesProprios));
  ok("nenhum valor numérico é atribuído a um composto", !/[:=]\s*\d/.test(semNomesProprios));
  ok("todo composto tem só id e nome", COMPOSTOS.every((c) => Object.keys(c).sort().join(",") === "id,nome"));
  ok("'outro' e 'prefiro não informar' não nomeiam resultado", nomeDoComposto("outro") === null && nomeDoComposto("nao-informar") === null && nomeDoComposto(null) === null);
  ok("um composto real nomeia o resultado", nomeDoComposto("tirzepatida") === "Tirzepatida");
}

bloco("9. FONTES: NENHUM LINK PROMETE O QUE NÃO FOI CONFERIDO");
{
  ok("há fontes para auditar", FONTES.length >= 4);
  ok("toda fonte diz o que sustenta", FONTES.every((f) => f.sustenta.length > 40));
  ok("nenhuma fonte é fórum, rede social ou vendedor", FONTES.every((f) => !/reddit|tiktok|instagram|facebook|forum|peptide|research ?chem/i.test(`${f.orgao} ${f.url} ${f.urlOrgao}`)));
  ok("o link oferecido é o do documento só quando conferido", FONTES.every((f) => linkDaFonte(f) === (f.urlConferida ? f.url : f.urlOrgao)));
  ok("todo site de órgão é https", FONTES.every((f) => f.urlOrgao.startsWith("https://")));

  const comps = readFileSync("components/concentracao/MetodologiaEFontes.tsx", "utf8");
  ok("a lista de fontes nunca usa f.url direto (só via urlConferida ou linkDaFonte)",
    !/href=\{f\.url\}/.test(comps.replace(/f\.urlConferida \? \(\s*<a href=\{f\.url\}/, "")));
  ok("a página explica por que o link pode ir ao órgão", /link quebrado/i.test(comps));
}

bloco("10. A PÁGINA NÃO INVENTA REVISÃO QUE NÃO EXISTE");
{
  const pagina = readFileSync("app/ferramentas/conversor-mg-ml-u100/page.tsx", "utf8");
  ok("publicação depende da revisão do autor", CONVERSOR_NO_AR === (REVISAO_AUTOR.revisadoEm !== null && REVISAO_AUTOR.por !== null));
  ok("a publicação não depende da revisão técnica (são chaves independentes)",
    !/CONVERSOR_NO_AR[^;]*REVISAO_TECNICA/.test(readFileSync("lib/concentracao/revisao.ts", "utf8")));
  ok("sem revisão técnica, a página diz isso em texto",
    REVISAO_TECNICA.revisadoEm !== null || /ainda não passou por revisão de farmacêutico ou médico/i.test(pagina));
  ok("a ressalva não some quando a página entra no ar (não está dentro do gate de publicação)",
    !/CONVERSOR_NO_AR[\s\S]{0,400}ainda não passou por revisão/.test(pagina));
  ok("a página continua dizendo que não é aconselhamento médico", /não é aconselhamento médico nem farmacêutico/i.test(pagina));
}

bloco("11. O CONVITE NOS ARTIGOS PROMETE SÓ O QUE A FERRAMENTA ENTREGA");
{
  const slugs = new Set(blogPosts.map((p) => p.slug));
  ok(`o registro tem artigos (${ARTIGOS_COM_LINK_CONCENTRACAO.length})`, ARTIGOS_COM_LINK_CONCENTRACAO.length > 0);
  for (const s of ARTIGOS_COM_LINK_CONCENTRACAO) ok(`artigo existe: ${s}`, slugs.has(s));
  ok("o registro é seletivo, não indiscriminado", ARTIGOS_COM_LINK_CONCENTRACAO.length <= 8, String(ARTIGOS_COM_LINK_CONCENTRACAO.length));
  ok("sem repetição", new Set(ARTIGOS_COM_LINK_CONCENTRACAO).size === ARTIGOS_COM_LINK_CONCENTRACAO.length);
  /*
   * Os comparativos ficam de fora: ali o leitor ainda escolhe medicamento,
   * não mede frasco. Entrar neles seria transformar convite em anúncio.
   */
  ok("nenhum artigo comparativo entra", !ARTIGOS_COM_LINK_CONCENTRACAO.some((s) => /(-ou-|emagrece-mais)/.test(s)));

  const convite = readFileSync("components/concentracao/LinkFerramentaConcentracao.tsx", "utf8");
  const texto = convite.replace(/\{\/\*[\s\S]*?\*\/\}/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
  ok("o convite não promete ensinar a preparar o frasco", /não ensina a preparar/i.test(texto));
  ok("o convite não promete dizer quanto usar", /nem diz\s+quanto usar/i.test(texto.replace(/\s+/g, " ")));
  ok("o convite não cita nome de substância", !/mounjaro|retatrutid|tirzepatid|semaglutid|ozempic|wegovy|zepbound/i.test(texto));
  ok("o convite não fala em dose", !/\bdose\b|quanto injetar|quanto aplicar/i.test(texto));
  ok("o convite não diz “diluir” (a ferramenta não ensina reconstituição)", !/diluir|diluição|reconstitu/i.test(texto));
  ok("o clique é medido", /concentration_article_click/.test(convite));

  const artigo = readFileSync("app/blog/[slug]/page.tsx", "utf8");
  ok("o convite só renderiza com a ferramenta publicada", /CONVERSOR_NO_AR && ARTIGOS_COM_LINK_CONCENTRACAO/.test(artigo));
}

console.log("\n" + "=".repeat(64) + `\n${falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} FALHA(S)`}\n` + "=".repeat(64));
if (falhas > 0) process.exit(1);
