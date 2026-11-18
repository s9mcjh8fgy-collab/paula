# Gera os slide-NN.html de um post a partir de uma lista de slides em Python/JSON.
# Tipos: capa, texto, lista, item, fecho. Cores: escuro, claro, laranja.
import os
def pagina(cls, miolo, pe='', regua=True):
    return f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link rel="stylesheet" href="../../kit/estilo.css"></head>
<body class="{cls}">{miolo}
{f'<div class="pe"><span>@estruturalegal</span><span>{pe}</span></div>' if pe is not None else ''}
<div class="regua"></div><script src="../../kit/regua.js"></script></body></html>'''
def slide(s, i, n):
    cor = s.get('cor', 'claro'); pe = 'arraste →' if i == 0 and n > 1 else ''
    k = f'<div class="kicker">{s["kicker"]}</div>' if s.get('kicker') else ''
    t = s['tipo']
    if t == 'capa':
        m = f'<div class="box">{k}<div class="titulo" style="font-size:{s.get("tam",150)}px;margin-top:60px">{s["titulo"]}</div>' + \
            (f'<div class="texto" style="margin-top:auto;max-width:880px;font-size:44px">{s["texto"]}</div>' if s.get('texto') else '') + '</div>'
    elif t == 'texto':
        m = f'<div class="box">{k}<div class="titulo" style="font-size:{s.get("tam",104)}px;margin-top:50px">{s["titulo"]}</div>' + \
            f'<div class="texto" style="margin-top:auto;font-size:50px;line-height:1.32">{s["texto"]}</div></div>'
    elif t == 'lista':
        itens = ''.join(f'<div class="cartao {"com" if j % 2 else "sem"}" style="display:flex;gap:30px;align-items:center;font-size:42px;padding:40px 44px"><span class="num" style="font-size:72px;line-height:1">✓</span><span>{x}</span></div>' for j, x in enumerate(s['itens']))
        m = f'<div class="box">{k}<div class="titulo" style="font-size:{s.get("tam",110)}px;margin-top:30px">{s["titulo"]}</div><div class="par" style="gap:24px">{itens}</div></div>'
    elif t == 'item':
        m = f'<div class="box"><div class="num">{s["num"]}</div><div class="titulo" style="font-size:{s.get("tam",112)}px;margin-top:40px">{s["titulo"]}</div>' + \
            f'<div class="texto" style="margin-top:auto;font-size:50px;line-height:1.32">{s["texto"]}</div></div>'
    return pagina(cor, m, pe)
def gerar(pasta, slides):
    os.makedirs(pasta, exist_ok=True)
    for i, s in enumerate(slides):
        open(os.path.join(pasta, f'slide-{i+1:02d}.html'), 'w', encoding='utf-8').write(slide(s, i, len(slides)))
