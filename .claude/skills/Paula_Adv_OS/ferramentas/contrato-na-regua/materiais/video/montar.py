"""Junta gravação de tela, narração e legendas no MP4 final.
Uso: python montar.py <roteiro.json> <pasta-audio> <marcas.json> <saida.mp4>
"""
import json, re, subprocess, sys, os
from pathlib import Path

rot, aud, marcas, saida = sys.argv[1:5]
R = json.load(open(rot, encoding='utf-8'))
Mk = json.load(open(marcas, encoding='utf-8'))
D = json.load(open(Path(aud) / 'duracoes.json', encoding='utf-8'))
work = Path(aud).parent

def ts(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f'{int(h):02}:{int(m):02}:{s:06.3f}'.replace('.', ',')

# legendas: divide cada fala em trechos curtos, tempo proporcional ao tamanho
srt, n = [], 0
for c in R['cenas']:
    if c['id'] == 'fecho':
        continue  # a tela final já mostra o texto
    ini, dur = Mk['marks'][c['id']], D[c['id']]
    frases = re.split(r'(?<=[.!?:])\s+', c['texto'])
    partes = []
    for f in frases:
        while len(f) > 78:
            corte = f.rfind(',', 0, 78)
            corte = corte if corte > 30 else f.rfind(' ', 0, 74)
            partes.append(f[:corte + 1].strip()); f = f[corte + 1:].strip()
        if f: partes.append(f)
    total = sum(len(p) for p in partes)
    t = ini
    for p in partes:
        d = dur * len(p) / total
        n += 1
        srt.append(f'{n}\n{ts(t)} --> {ts(t + d - 0.05)}\n{p}\n')
        t += d
(work / 'legendas.srt').write_text('\n'.join(srt), encoding='utf-8')

ins, filt = ['-ss', f"{Mk['trim']:.3f}", '-i', Mk['video']], []
for i, c in enumerate(R['cenas'], 1):
    ins += ['-i', str(Path(aud) / f"{c['id']}.mp3")]
    ms = int(Mk['marks'][c['id']] * 1000)
    filt.append(f'[{i}:a]adelay={ms}|{ms}[a{i}]')
mix = ''.join(f'[a{i}]' for i in range(1, len(R['cenas']) + 1))
filt.append(f'{mix}amix=inputs={len(R["cenas"])}:normalize=0,apad[aout]')
estilo = "FontName=Arial,FontSize=15,PrimaryColour=&H00DFEBF1,OutlineColour=&H283E416D,BackColour=&H283E416D,BorderStyle=3,Outline=6,Shadow=0,MarginV=22"
filt.append(f"[0:v]scale=1920:1080:flags=lanczos,subtitles=legendas.srt:force_style='{estilo}',format=yuv420p[vout]")
cmd = ['ffmpeg', '-y', *ins, '-filter_complex', ';'.join(filt), '-map', '[vout]', '-map', '[aout]',
       '-t', f"{Mk['total']:.3f}", '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-r', '30',
       '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
       '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', str(Path(saida).resolve())]
subprocess.run(cmd, check=True, cwd=work)
print('ok', saida)
