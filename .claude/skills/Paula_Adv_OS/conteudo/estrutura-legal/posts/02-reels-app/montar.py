# Monta o reels "app gerando o contrato" a partir da demonstração do Contrato na Régua.
# Uso: python montar.py   (na pasta do post). Gera reels.mp4 e capa.png.
# Legenda embutida, sincronizada com a narração (blocos curtos). Se a cena tiver "legenda",
# ela substitui o texto falado na tela (ex: "R$ 97" no lugar de "noventa e sete reais").
import asyncio, json, os, subprocess, edge_tts
R = json.load(open('roteiro.json', encoding='utf-8'))
os.makedirs('build', exist_ok=True)
KIT = '../../kit/'
CW, CH = 927, 850          # recorte da tela (acima das legendas embutidas na demonstração)
VW, VH = 1000, 917         # tamanho do vídeo no quadro vertical
VX, VY = 40, 620
LEG_Y = 1200               # topo da faixa de legenda (centro ~69% da altura)
MAX_CH = 28                # caracteres por bloco de legenda (cabe em 2 linhas)

def html(c):
    if c.get('card'):
        corpo = f'''<body class="v laranja"><div class="box" style="top:300px;bottom:600px">
<div class="kicker">Estrutura Legal</div>
<div class="titulo" style="font-size:150px;margin-top:40px">Contrato na <em>Régua</em></div>
<div class="titulo" style="font-size:72px;margin-top:50px">R$ 97 · pagamento único</div>
<div style="margin-top:60px"><span class="selo" style="font-size:40px;padding:20px 44px">Link na bio</span></div>
</div>'''
    else:
        corpo = f'''<body class="v escuro"><div class="box" style="top:150px;bottom:auto">
<div class="kicker">{c["kicker"]}</div>
<div class="titulo" style="font-size:84px;margin-top:26px">{c["titulo"]}</div></div>
<div style="position:absolute;left:{VX-6}px;top:{VY-6}px;width:{VW+12}px;height:{VH+12}px;border-radius:26px;background:#5c3633"></div>'''
    return f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link rel="stylesheet" href="../{KIT}estilo.css"></head>
{corpo}<div class="regua"></div><script src="../{KIT}regua.js"></script></body></html>'''

async def tts(c):
    com = edge_tts.Communicate(c['fala'], R['voz'], rate=R['velocidade'], boundary='WordBoundary')
    palavras = []
    with open(f"build/{c['id']}.mp3", 'wb') as f:
        async for ch in com.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] == 'WordBoundary': palavras.append((ch['offset'] / 1e7, ch['text']))
    return palavras

def dur(f):
    return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())

def blocos(itens):
    # itens: [(tempo, palavra)] -> [(tempo_inicio, texto)] agrupando até MAX_CH caracteres,
    # quebrando depois de pontuação
    # frases (até a pontuação) -> divididas em partes de tamanho parecido -> junta pedaço curto
    frases, cur = [], []
    for it in itens:
        cur.append(it)
        if it[1][-1] in '.,?!:;': frases.append(cur); cur = []
    if cur: frases.append(cur)
    grupos = []
    for f in frases:
        total = len(' '.join(w for _, w in f))
        n = max(1, -(-total // MAX_CH))
        alvo, g, acc = total / n, [], 0
        for it in f:
            g.append(it); acc += len(it[1]) + 1
            if acc >= alvo and it is not f[-1]:
                grupos.append(g); g, acc = [], 0
        if g: grupos.append(g)
    out = []
    for g in grupos:
        txt = ' '.join(w for _, w in g)
        if out and (len(txt) < 10 or len(out[-1][1]) < 10) and len(out[-1][1]) + len(txt) + 1 <= MAX_CH + 8:
            out[-1] = (out[-1][0], out[-1][1] + ' ' + txt)
        else:
            out.append((g[0][0], txt))
    return out

for c in R['cenas']:
    open(f"build/fundo-{c['id']}.html", 'w', encoding='utf-8').write(html(c))
subprocess.run(['node', KIT + 'render.js', 'build'] + [f"fundo-{c['id']}.html" for c in R['cenas']], check=True)

lista_leg, tempos = [], {}
for c in R['cenas']:
    pal = asyncio.run(tts(c))
    a = f"build/{c['id']}.mp3"; d = dur(a)
    # a pontuação não vem nas palavras do TTS: recoloca a partir do texto da fala
    fala = c['fala'].split(); k = 0; com_pont = []
    for t, w in pal:
        while k < len(fala) and fala[k].strip('.,?!:;') != w: k += 1
        com_pont.append((t, fala[k] if k < len(fala) else w)); k += 1
    if c.get('legenda'):
        ws = c['legenda'].split(); n = len(ws)
        itens = [(d * i / n, w) for i, w in enumerate(ws)]
    else:
        itens = com_pont
    bl = blocos(itens)
    tempos[c['id']] = []
    for i, (t, txt) in enumerate(bl):
        fim = bl[i + 1][0] if i + 1 < len(bl) else d + 0.35
        arq = f"build/leg-{c['id']}-{i}.png"
        lista_leg.append({'arquivo': arq, 'texto': txt}); tempos[c['id']].append((t, fim, arq))
json.dump(lista_leg, open('build/legendas.json', 'w', encoding='utf-8'), ensure_ascii=False)
subprocess.run(['node', KIT + 'legendas.js', 'build/legendas.json'], check=True)

partes = []
for c in R['cenas']:
    a = f"build/{c['id']}.mp3"; d = dur(a) + 0.35; out = f"build/p-{c['id']}.mp4"
    legs = tempos[c['id']]
    if c.get('card'):
        d += 1.0
        ins = ['-loop','1','-t',f'{d:.2f}','-i',f"build/fundo-{c['id']}.png",'-i',a]
        base, ai, n0 = '[0:v]fps=30[b0]', 1, 2
    else:
        ins = ['-loop','1','-t',f'{d:.2f}','-i',f"build/fundo-{c['id']}.png",
               '-ss',str(c['ini']),'-t',f'{d:.2f}','-i',R['fonte'],'-i',a]
        base = f"[1:v]crop={CW}:{CH}:{c['x']}:0,scale={VW}:{VH},fps=30[app];[0:v][app]overlay={VX}:{VY}[b0]"
        ai, n0 = 2, 3
    filt = [base]; prev = 'b0'
    for j, (t, fim, arq) in enumerate(legs):
        ins += ['-loop','1','-t',f'{d:.2f}','-i',arq]
        filt.append(f"[{prev}][{n0+j}:v]overlay=0:{LEG_Y}:enable='between(t,{t:.2f},{fim:.2f})'[b{j+1}]")
        prev = f'b{j+1}'
    filt.append(f'[{prev}]format=yuv420p[v];[{ai}:a]apad[a]')
    subprocess.run(['ffmpeg','-y','-v','error',*ins,'-filter_complex',';'.join(filt),'-map','[v]','-map','[a]','-t',f'{d:.2f}',
                    '-c:v','libx264','-preset','medium','-crf','20','-c:a','aac','-ar','44100','-ac','2', out], check=True)
    partes.append(out)

ins = []
for p in partes: ins += ['-i', p]
fc = ''.join(f'[{i}:v][{i}:a]' for i in range(len(partes))) + f'concat=n={len(partes)}:v=1:a=1[v0][a];[v0]scale=in_range=full:out_range=limited,format=yuv420p[v]'
subprocess.run(['ffmpeg','-y','-v','error',*ins,'-filter_complex',fc,'-map','[v]','-map','[a]','-color_range','tv',
    '-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709',
    '-c:v','libx264','-preset','medium','-crf','20','-r','30','-c:a','aac','-ar','44100','-ac','2',
    '-movflags','+faststart','reels.mp4'], check=True)
# capa = quadro do gancho antes da primeira legenda
subprocess.run(['ffmpeg','-y','-v','error','-ss','0','-i','build/p-gancho.mp4','-frames:v','1','capa.png'], check=True)
print('ok', round(dur('reels.mp4'), 1), 's')
