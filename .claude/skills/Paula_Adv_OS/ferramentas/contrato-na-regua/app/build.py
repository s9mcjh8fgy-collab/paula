"""Monta app/index.html a partir de index.src.html, embutindo a fonte Borna Bold em base64.

Uso: python build.py
"""
import base64
from pathlib import Path

AQUI = Path(__file__).parent
FONTE = AQUI.parents[2] / 'marca' / 'fonts' / 'Borna-Bold.otf'

src = (AQUI / 'index.src.html').read_text(encoding='utf-8')
b64 = base64.b64encode(FONTE.read_bytes()).decode('ascii')
(AQUI / 'index.html').write_text(src.replace('/*@BORNA@*/', b64), encoding='utf-8')
print('ok', AQUI / 'index.html')
