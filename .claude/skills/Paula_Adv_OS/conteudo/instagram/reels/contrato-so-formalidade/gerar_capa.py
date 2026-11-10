# Gera capa.html (render: npx playwright screenshot --channel msedge --viewport-size=1080,1920 file:///.../capa.html capa-reel.png).
# Antes gerava capa-reel.png (1080x1920): foto do ensaio + título Borna, mesmo layout da capa "como agradar sua advogada".
import pathlib
BASE = pathlib.Path(__file__).resolve().parent
RAIZ = BASE.parents[3]
FOTO = (RAIZ / 'marca' / 'fotos' / 'ensaio-2025-03.jpg').as_uri()
FONTES = (RAIZ / 'marca' / 'fonts').as_uri()
html = f"""<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'><style>
@font-face {{ font-family: Borna; src: url('{FONTES}/Borna-Bold.otf'); font-weight: 700; }}
@font-face {{ font-family: Borna; src: url('{FONTES}/Borna-Regular.otf'); font-weight: 400; }}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
html, body {{ width: 1080px; height: 1920px; overflow: hidden; font-family: Borna; }}
body {{ background: #6D413E url('{FOTO}') center 20% / cover no-repeat; position: relative; }}
.grad {{ position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(109,65,62,0) 42%, rgba(109,65,62,.78) 60%, rgba(109,65,62,.92) 100%); }}
.txt {{ position: absolute; left: 80px; right: 80px; top: 1110px; text-align: center; }}
h1 {{ color: #F26F4D; font-weight: 700; font-size: 104px; line-height: 1.02; letter-spacing: -1px; }}
p {{ color: #F1EBDF; font-weight: 400; font-size: 50px; line-height: 1.25; margin-top: 44px; }}
</style></head><body><div class='grad'></div><div class='txt'>
<h1>Contrato é só<br>formalidade?</h1>
<p>Até o dia em que alguém<br>discorda do combinado</p></div></body></html>"""
(BASE / 'capa.html').write_text(html, encoding='utf-8')
