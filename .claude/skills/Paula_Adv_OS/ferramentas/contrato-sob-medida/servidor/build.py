"""Monta a pasta publico/ do Contrato na Régua Sob Medida.

O app NÃO é uma cópia: parte do app do Contrato na Régua (../../contrato-na-regua/app/index.src.html),
troca nome, chave de armazenamento e aviso de privacidade, e acrescenta o passo "Proposta"
(src/proposta.html), que manda a proposta para leitura por IA em /api/ler-proposta.
Melhoria feita no Contrato na Régua passa a valer aqui no próximo build.

Uso: python build.py   (depois: npx wrangler pages deploy)
"""
import base64, shutil
from pathlib import Path

AQUI = Path(__file__).parent
REGUA = AQUI.parents[1] / 'contrato-na-regua'
APP = REGUA / 'app' / 'index.src.html'
FONTE = AQUI.parents[2] / 'marca' / 'fonts' / 'Borna-Bold.otf'
MODULO = AQUI / 'src' / 'proposta.html'
PUB = AQUI / 'publico'


def trocar(texto, antes, depois):
    assert antes in texto, 'trecho não encontrado: ' + antes
    return texto.replace(antes, depois, 1)


src = APP.read_text(encoding='utf-8')
src = src.replace('/*@BORNA@*/', base64.b64encode(FONTE.read_bytes()).decode('ascii'))
src = trocar(src, '<title>Contrato na Régua</title>', '<title>Contrato na Régua Sob Medida</title>')
src = trocar(src, "fetch('matriz.json')", "fetch('/api/matriz',{credentials:'same-origin'})")
src = trocar(src, "var KEY = 'regua.estado.v1';", "var KEY = 'sobmedida.estado.v1';")
src = trocar(src, '<meta name="claude:viewport-fit-sides" content="cover">\n', '')
src = trocar(src, '<small>Estrutura Legal</small>', '<small>Estrutura Legal · Sob Medida</small>')
src = trocar(src, 'O documento é montado aqui no seu navegador. Os dados do seu cliente não são enviados para nenhum servidor.',
             'O contrato é montado aqui no seu navegador. A proposta enviada para leitura é processada por IA, '
             'não fica guardada na ferramenta e não é usada para treinar a IA.')
src = trocar(src, '</style>', '.sair{margin:0}.sair button{background:none;border:1px solid rgba(241,235,223,.35);color:#F1EBDF;'
             'font:inherit;font-size:13px;padding:7px 14px;border-radius:999px;cursor:pointer}'
             '.sair button:hover{background:rgba(241,235,223,.12)}\n</style>')
src = trocar(src, '      <button type="button" id="modeTermo" aria-pressed="false">Termo de aceite</button>\n    </div>\n',
             '      <button type="button" id="modeTermo" aria-pressed="false">Termo de aceite</button>\n    </div>\n'
             '    <form class="sair" method="post" action="/sair"><button type="submit">Sair</button></form>\n')

doc = ('<!doctype html><html lang="pt-br"><head><meta charset="utf-8">'
       '<meta name="viewport" content="width=device-width,initial-scale=1">'
       '<meta name="robots" content="noindex"><style>body{margin:0}[hidden]{display:none!important}</style>'
       '</head><body>' + src + MODULO.read_text(encoding='utf-8') + '</body></html>')

PUB.mkdir(exist_ok=True)
(PUB / 'app.html').write_text(doc, encoding='utf-8')
shutil.copyfile(FONTE, PUB / 'borna.otf')
(PUB / '_worker.js').write_text("export { default } from '../src/worker.js';\n", encoding='utf-8')
print('ok', PUB)
