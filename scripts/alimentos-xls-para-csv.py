"""
Converte o .xls da POF/IBGE para CSV.

O arquivo do IBGE é BIFF8 (Excel 2003), formato binário antigo — diferente do
.xlsx da TACO, que é um ZIP de XML e é lido direto em TypeScript por
scripts/lib-xlsx.ts.

Escrever um leitor de BIFF8 seria umas trezentas linhas de parsing binário
para um arquivo que nunca mais muda: a POF 2008-2009 está fechada. Então a
conversão vive aqui, isolada, e o resto do pipeline continua em TypeScript
lendo o CSV.

O CSV é um INTERMEDIÁRIO, não a fonte. O .xls original fica em bruto/ e não
é editado. Rodar:

    python3 -m pip install xlrd
    python3 scripts/alimentos-xls-para-csv.py
"""

import csv
import xlrd

ENTRADA = "data/alimentos/bruto/ibge-pof-medidas-referidas.xls"
SAIDA = "data/alimentos/bruto/ibge-pof-medidas-referidas.csv"
ABA = "Tab_Medidas Caseiras"
LINHA_CABECALHO = 3

livro = xlrd.open_workbook(ENTRADA)
aba = livro.sheet_by_name(ABA)


def texto(v):
    """Códigos vêm como float ('6300101.0'); o .0 sobrando não é informação."""
    s = str(v).strip()
    if s.endswith(".0"):
        s = s[:-2]
    return s


with open(SAIDA, "w", newline="", encoding="utf8") as f:
    w = csv.writer(f)
    w.writerow([texto(aba.cell_value(LINHA_CABECALHO, c)) for c in range(aba.ncols)])
    escritas = 0
    for r in range(LINHA_CABECALHO + 1, aba.nrows):
        linha = [texto(aba.cell_value(r, c)) for c in range(aba.ncols)]
        # Linhas de título de seção e separadores não têm código nem gramas.
        if not linha[0] or not linha[8]:
            continue
        w.writerow(linha)
        escritas += 1

print(f"{escritas} medidas escritas em {SAIDA}")
