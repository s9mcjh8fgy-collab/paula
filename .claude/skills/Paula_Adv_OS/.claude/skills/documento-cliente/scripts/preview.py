r"""Converte .docx em PDF pelo Word e gera PNG de cada página, pra conferir o visual.

Uso: python preview.py <arquivo.docx ou pasta>
Saída: %TEMP%\preview-docs\ (nunca na pasta do cliente nem em Credenciais)
"""
import os, sys, glob, tempfile
import win32com.client, pymupdf

alvo = os.path.normpath(sys.argv[1])
arquivos = sorted(glob.glob(os.path.join(alvo, '*.docx'))) if os.path.isdir(alvo) else [alvo]
dst = os.path.join(tempfile.gettempdir(), 'preview-docs'); os.makedirs(dst, exist_ok=True)
word = win32com.client.DispatchEx('Word.Application'); word.Visible = False; word.DisplayAlerts = 0
try:
    for f in arquivos:
        base = os.path.splitext(os.path.basename(f))[0]
        pdf = os.path.join(dst, base + '.pdf')
        doc = word.Documents.Open(os.path.abspath(f), ReadOnly=True)
        doc.ExportAsFixedFormat(pdf, 17)
        doc.Close(False)
        d = pymupdf.open(pdf)
        pngs = []
        for i, pg in enumerate(d):
            png = os.path.join(dst, f'{base}-p{i+1}.png'); pg.get_pixmap(dpi=70).save(png); pngs.append(png)
        print(f'{base}: {d.page_count} página(s)'); [print('  ', p) for p in pngs]
finally:
    word.Quit()
