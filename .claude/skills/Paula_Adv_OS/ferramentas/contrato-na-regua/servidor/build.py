"""Monta a pasta publico/ do servidor a partir do app (app/index.src.html).

- app.html: o app com a fonte Borna embutida, documento HTML completo, buscando o contrato em
  /api/matriz (só com sessão válida), com o menu Como usar e o botão Sair no topo, e com o
  formulário de outro formato de contrato (src/extras.html).
- borna.otf: fonte usada pelas páginas de entrada.
- guia.pdf: guia rápido, entregue pelo Worker só com sessão válida.
Uso: python build.py   (depois: npx wrangler pages deploy)
"""
import base64, shutil
from pathlib import Path

AQUI = Path(__file__).parent
APP = AQUI.parent / 'app' / 'index.src.html'
FONTE = AQUI.parents[2] / 'marca' / 'fonts' / 'Borna-Bold.otf'
GUIA = AQUI.parent / 'materiais' / 'guia' / 'Contrato na Régua - Guia rápido.pdf'
EXTRAS = AQUI / 'src' / 'extras.html'
VIDEO = 'https://estruturalegal.com.br/contrato-na-regua/demonstracao.mp4'
PUB = AQUI / 'publico'


def trocar(texto, antes, depois):
    assert antes in texto, 'trecho não encontrado: ' + antes
    return texto.replace(antes, depois, 1)


src = APP.read_text(encoding='utf-8')
src = src.replace('/*@BORNA@*/', base64.b64encode(FONTE.read_bytes()).decode('ascii'))
src = trocar(src, "fetch('matriz.json')", "fetch('/api/matriz',{credentials:'same-origin'})")
src = trocar(src, '<meta name="claude:viewport-fit-sides" content="cover">\n', '')
src = trocar(src, '</style>', '.sair{margin:0}.sair button{background:none;border:1px solid rgba(241,235,223,.35);color:#F1EBDF;'
             'font:inherit;font-size:13px;padding:7px 14px;border-radius:999px;cursor:pointer}'
             '.sair button:hover{background:rgba(241,235,223,.12)}\n</style>')
src = trocar(src, '      <button type="button" id="modeTermo" aria-pressed="false">Termo de aceite</button>\n    </div>\n',
             '      <button type="button" id="modeTermo" aria-pressed="false">Termo de aceite</button>\n'
             '      <button type="button" id="outroContrato" aria-haspopup="dialog">Outro contrato</button>\n    </div>\n'
             '    <div class="conta">\n'
             '      <details class="comousar"><summary>Como usar</summary><div>'
             '<a href="/guia.pdf" target="_blank" rel="noopener">Guia rápido (PDF)</a>'
             f'<a href="{VIDEO}" target="_blank" rel="noopener">Vídeo de demonstração</a>'
             '</div></details>\n'
             '      <form class="sair" method="post" action="/sair"><button type="submit">Sair</button></form>\n'
             '    </div>\n')
fim_gen = 'Os dados do seu cliente não são enviados para nenhum servidor.</div>\n'
src = trocar(src, fim_gen, fim_gen + '        <button type="button" class="linkbtn outro" id="outroFormato">'
             'Precisa de outro formato de contrato?</button>\n')

doc = ('<!doctype html><html lang="pt-br"><head><meta charset="utf-8">'
       '<meta name="viewport" content="width=device-width,initial-scale=1">'
       '<meta name="robots" content="noindex"><style>body{margin:0}[hidden]{display:none!important}</style>'
       '</head><body>' + src + EXTRAS.read_text(encoding='utf-8') + '</body></html>')

PUB.mkdir(exist_ok=True)
(PUB / 'app.html').write_text(doc, encoding='utf-8')
shutil.copyfile(FONTE, PUB / 'borna.otf')
shutil.copyfile(GUIA, PUB / 'guia.pdf')
print('ok', PUB)
