# Monta um reels vertical (1080x1920) a partir de roteiro.json na pasta atual.
# Uso: cd posts/<pasta> && python ../../kit/reels.py   -> gera reels.mp4 e capa.png
#
# roteiro.json: {"fonte": <mp4 da demonstração>, "voz": <voz padrão>, "velocidade": "+6%", "cenas": [...]}
# Tipos de cena:
#   frase : tela cheia com uma frase grande (ex: fala do cliente). Campos: kicker, num, texto, cor
#   app   : trecho da demonstração recortado. Campos: ini (s), crop [x,y,w,h], kicker, titulo
#   fecho : card final. Campos: kicker, titulo, sub, selo
# Comuns: fala (texto da narração), voz (opcional), legenda (true/false, padrão true; ou texto
# para exibir no lugar da fala), pausa (segundos extras no fim, padrão 0.3)
import asyncio, json, os, subprocess, sys, edge_tts
KIT = os.path.relpath(os.path.dirname(os.path.abspath(__file__))).replace('\\', '/') + '/'
R = json.load(open('roteiro.json', encoding='utf-8'))
os.makedirs('build', exist_ok=True)
LEG_Y, MAX_CH, VW, TOPO_APP = 1200, 28, 1000, 560

def tam_app(c):
    x, y, w, h = c['crop']; vh = round(VW * h / w / 2) * 2
    return VW, vh

def topo(c):  # centraliza o recorte entre o título e a faixa de legenda
    return max(TOPO_APP, 880 - tam_app(c)[1] // 2)

def html(c):
    t = c['tipo']; cor = c.get('cor', 'escuro' if t in ('app', 'doc') else 'laranja')
    if t == 'frase':
        corpo = f'''<div class="box" style="top:260px;bottom:520px">
<div class="kicker">{c.get("kicker","")}</div>
{f'<div class="num" style="margin-top:40px">{c["num"]}</div>' if c.get("num") else ''}
<div class="titulo" style="font-size:{c.get("tam",112)}px;margin-top:40px">“{c["texto"]}”</div></div>'''
    elif t == 'app':
        vw, vh = tam_app(c); vx = (1080 - vw) // 2
        corpo = f'''<div class="box" style="top:150px;bottom:auto"><div class="kicker">{c.get("kicker","")}</div>
<div class="titulo" style="font-size:{c.get("tam",88)}px;margin-top:26px">{c["titulo"]}</div></div>
<div style="position:absolute;left:{vx-8}px;top:{topo(c)-8}px;width:{vw+16}px;height:{vh+16}px;border-radius:24px;background:#FFFDF9"></div>'''
    elif t == 'doc':
        corpo = f'''<div class="box" style="top:150px;bottom:auto"><div class="kicker">{c.get("kicker","")}</div>
<div class="titulo" style="font-size:{c.get("tam",88)}px;margin-top:26px">{c["titulo"]}</div></div>
<div class="doc" style="top:{c.get("topo_doc",470)}px">{c["doc"]}</div>'''
    else:
        corpo = f'''<div class="box" style="top:300px;bottom:600px"><div class="kicker">{c.get("kicker","Estrutura Legal")}</div>
<div class="titulo" style="font-size:{c.get("tam",120)}px;margin-top:40px">{c["titulo"]}</div>
{f'<div class="titulo" style="font-size:64px;margin-top:44px">{c["sub"]}</div>' if c.get("sub") else ''}
<div style="margin-top:56px"><span class="selo" style="font-size:40px;padding:20px 44px">{c.get("selo","Link na bio")}</span></div></div>'''
    return f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link rel="stylesheet" href="../{KIT}estilo.css"></head>
<body class="v {cor}">{corpo}<div class="regua"></div><script src="../{KIT}regua.js"></script></body></html>'''

async def tts(c):
    com = edge_tts.Communicate(c['fala'], c.get('voz', R['voz']), rate=c.get('velocidade', R['velocidade']), boundary='WordBoundary')
    pal = []
    with open(f"build/{c['id']}.mp3", 'wb') as f:
        async for ch in com.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] == 'WordBoundary': pal.append((ch['offset'] / 1e7, ch['text']))
    return pal

def dur(f):
    return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())

def blocos(itens):
    frases, cur = [], []
    for it in itens:
        cur.append(it)
        if it[1][-1] in '.,?!:;': frases.append(cur); cur = []
    if cur: frases.append(cur)
    grupos = []
    for f in frases:
        total = len(' '.join(w for _, w in f)); n = max(1, -(-total // MAX_CH)); alvo, g, acc = total / n, [], 0
        for it in f:
            g.append(it); acc += len(it[1]) + 1
            if acc >= alvo and it is not f[-1]: grupos.append(g); g, acc = [], 0
        if g: grupos.append(g)
    out = []
    for g in grupos:
        txt = ' '.join(w for _, w in g)
        if out and (len(txt) < 10 or len(out[-1][1]) < 10) and len(out[-1][1]) + len(txt) + 1 <= MAX_CH + 8:
            out[-1] = (out[-1][0], out[-1][1] + ' ' + txt)
        else: out.append((g[0][0], txt))
    return out

for c in R['cenas']:
    open(f"build/fundo-{c['id']}.html", 'w', encoding='utf-8').write(html(c))
subprocess.run(['node', KIT + 'render.js', 'build'] + [f"fundo-{c['id']}.html" for c in R['cenas']], check=True)

lista, tempos, durs = [], {}, {}
for c in R['cenas']:
    pal = asyncio.run(tts(c)); a = f"build/{c['id']}.mp3"; d = dur(a); durs[c['id']] = d + c.get('pausa', 0.3)
    tempos[c['id']] = []
    leg = c.get('legenda', True)
    if not leg: continue
    fala = c['fala'].split(); k = 0; itens = []
    for t, w in pal:
        while k < len(fala) and fala[k].strip('.,?!:;“”"') != w: k += 1
        itens.append((t, fala[k] if k < len(fala) else w)); k += 1
    if isinstance(leg, str):
        ws = leg.split(); itens = [(d * i / len(ws), w) for i, w in enumerate(ws)]
    bl = blocos(itens)
    for i, (t, txt) in enumerate(bl):
        fim = bl[i + 1][0] if i + 1 < len(bl) else durs[c['id']]
        arq = f"build/leg-{c['id']}-{i}.png"; lista.append({'arquivo': arq, 'texto': txt}); tempos[c['id']].append((t, fim, arq))
json.dump(lista, open('build/legendas.json', 'w', encoding='utf-8'), ensure_ascii=False)
if lista: subprocess.run(['node', KIT + 'legendas.js', 'build/legendas.json'], check=True)

partes = []
for c in R['cenas']:
    a = f"build/{c['id']}.mp3"; d = durs[c['id']]; out = f"build/p-{c['id']}.mp4"
    ins = ['-loop','1','-t',f'{d:.2f}','-i',f"build/fundo-{c['id']}.png"]
    if c['tipo'] == 'app':
        x, y, w, h = c['crop']; vw, vh = tam_app(c)
        ins += ['-ss',str(c['ini']),'-t',f'{d:.2f}','-i',R['fonte'],'-i',a]
        filt = [f"[1:v]crop={w}:{h}:{x}:{y},scale={vw}:{vh},fps=30[app];[0:v][app]overlay={(1080-vw)//2}:{topo(c)}[b0]"]; ai, n0 = 2, 3
    elif c['tipo'] == 'doc':  # zoom lento no quadro parado
        n = int(d * 30) + 2
        ins += ['-i', a]; filt = [f"[0:v]scale=2160:3840,zoompan=z='1+0.035*on/{n}':x='iw/2-(iw/zoom/2)':y='ih*0.42-(ih/zoom*0.42)':d=1:s=1080x1920:fps=30[b0]"]; ai, n0 = 1, 2
    else:
        ins += ['-i', a]; filt = ['[0:v]fps=30[b0]']; ai, n0 = 1, 2
    prev = 'b0'
    for j, (t, fim, arq) in enumerate(tempos[c['id']]):
        ins += ['-loop','1','-t',f'{d:.2f}','-i',arq]
        filt.append(f"[{prev}][{n0+j}:v]overlay=0:{LEG_Y}:enable='between(t,{t:.2f},{fim:.2f})'[b{j+1}]"); prev = f'b{j+1}'
    filt.append(f'[{prev}]format=yuv420p[v];[{ai}:a]apad[a]')
    subprocess.run(['ffmpeg','-y','-v','error',*ins,'-filter_complex',';'.join(filt),'-map','[v]','-map','[a]','-t',f'{d:.2f}',
                    '-c:v','libx264','-preset','medium','-crf','20','-c:a','aac','-ar','44100','-ac','2', out], check=True)
    partes.append(out)

ins = []
for p in partes: ins += ['-i', p]
fc = ''.join(f'[{i}:v][{i}:a]' for i in range(len(partes))) + f'concat=n={len(partes)}:v=1:a=1[v0][a];[v0]scale=in_range=full:out_range=limited,format=yuv420p[v]'
subprocess.run(['ffmpeg','-y','-v','error',*ins,'-filter_complex',fc,'-map','[v]','-map','[a]','-color_range','tv',
    '-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:v','libx264','-preset','medium','-crf','20',
    '-r','30','-c:a','aac','-ar','44100','-ac','2','-movflags','+faststart','reels.mp4'], check=True)
subprocess.run(['ffmpeg','-y','-v','error','-ss','0','-i',partes[0],'-frames:v','1','capa.png'], check=True)
print('ok', round(dur('reels.mp4'), 1), 's')
