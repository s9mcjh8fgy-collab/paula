# Gera os PNGs transparentes de texto (1080x1920) pro reel. Uso: python gerar_texto.py
from PIL import Image, ImageDraw, ImageFont
import os
BASE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(BASE, '..', '..', '..', '..', 'marca', 'fonts', 'Borna-Bold.otf')
BEGE, MARROM = (241, 235, 223, 240), (109, 65, 62, 255)
TELAS = {
    'texto-1.png': ['Cliente:', '"ah, contrato é só', 'formalidade, né?"'],
    'texto-2.png': ['Eu, escrevendo a cláusula', 'que vai resolver a briga', 'dele daqui a 6 meses.'],
}
f = ImageFont.truetype(FONT, 62)
for nome, linhas in TELAS.items():
    img = Image.new('RGBA', (1080, 1920), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    lh, pad = 82, 40
    w = max(d.textlength(l, font=f) for l in linhas)
    h = lh * len(linhas)
    cy = 1120  # centro vertical: peito, sem cobrir rosto nem mãos, fora da área da interface do app
    x0, y0 = (1080 - w) / 2 - pad, cy - h / 2 - pad
    d.rounded_rectangle([x0, y0, x0 + w + 2 * pad, y0 + h + 2 * pad], radius=28, fill=BEGE)
    for i, l in enumerate(linhas):
        d.text((540, y0 + pad + i * lh + lh / 2), l, font=f, fill=MARROM, anchor='mm')
    img.save(os.path.join(BASE, nome))
