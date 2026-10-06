# Gera os HTMLs (1080x1350) do carrossel "como agradar sua advogada"
from pathlib import Path

AQUI = Path(__file__).parent
SLIDES = AQUI
RAIZ = AQUI.parents[3]
FONTS = (RAIZ / "marca" / "fonts").as_uri()
FOTO = (RAIZ / "marca" / "fotos" / "ensaio-2022-106.jpg").as_uri()

BASE_CSS = f"""
@font-face {{ font-family: Borna; src: url('{FONTS}/Borna-Regular.otf'); font-weight: 400; }}
@font-face {{ font-family: Borna; src: url('{FONTS}/Borna-Bold.otf'); font-weight: 700; }}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
html, body {{ width: 1080px; height: 1350px; overflow: hidden; }}
body {{ font-family: Borna, sans-serif; }}
"""

AGRADOS = [
    ("guardar print de tudo (e mandar em ordem)",
     "arquivista de respeito",
     "print sem data e fora de ordem vira quebra-cabeça de mil peças",
     "melhor ter print do que não ter nada, e organizado ele vira prova"),
    ("me contar a história toda, até o detalhe que parece bobo",
     "storyteller aprovado",
     "aquele “ah, mas isso não deve importar” às vezes é exatamente o que importa",
     "o detalhe que você quase não contou pode ser o que decide o caso"),
    ("me mandar o contrato antes de assinar, não depois",
     "cliente visionário",
     "revisar antes custa bem menos do que discutir depois",
     "depois da assinatura, a margem pra negociar encolhe muito"),
    ("me contar a parte ruim antes que eu descubra sozinha",
     "confiança desbloqueada",
     "se tem um áudio constrangedor no grupo da obra, prefiro ouvir de você",
     "surpresa é ótima em aniversário, não em processo"),
    ("combinar a mudança de projeto por escrito, não só no canteiro",
     "elegância documental",
     "“mas ele falou que tava tudo certo” não convence juiz nenhum",
     "e-mail, mensagem, aditivo: o que está escrito vira prova"),
    ("mandar a pergunta junto com o “oi, tudo bem?”",
     "eficiência nível máximo",
     "“oi, tudo bem?” … 3 horas depois … “tudo, e você?” … e a gente ainda nem chegou no assunto",
     "tudo numa mensagem só faz a resposta chegar muito mais rápido"),
    ("seguir a orientação que você mesmo contratou",
     "comportamento revolucionário",
     "contratou uma advogada e ouviu a advogada",
     "estratégia jurídica surpreendentemente eficaz"),
]


def pagina(css, corpo):
    return f"<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'><style>{BASE_CSS}{css}</style></head><body>{corpo}</body></html>"


capa_css = f"""
body {{ background: #6D413E url('{FOTO}') center 22% / cover no-repeat; position: relative; }}
.grad {{ position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(109,65,62,0) 40%, rgba(109,65,62,.8) 62%, rgba(109,65,62,.92) 100%); }}
.txt {{ position: absolute; left: 80px; right: 80px; bottom: 110px; text-align: center; }}
h1 {{ color: #F26F4D; font-weight: 700; font-size: 96px; line-height: 1.02; letter-spacing: -1px; }}
p {{ color: #F1EBDF; font-weight: 400; font-size: 50px; line-height: 1.25; margin-top: 44px; }}
"""
capa = pagina(capa_css, "<div class='grad'></div><div class='txt'><h1>como agradar<br>sua advogada</h1>"
              "<p>e, surpreendentemente,<br>não tem nada a ver com dinheiro</p></div>")

agrado_css = """
body { background: #F1EBDF; color: #6D413E; }
.box { position: absolute; left: 110px; right: 110px; top: 0; bottom: 0;
  display: flex; flex-direction: column; justify-content: center; }
.num { color: #F26F4D; font-weight: 700; font-size: 46px; margin-bottom: 56px; letter-spacing: .5px; }
.t { font-weight: 700; font-size: 62px; line-height: 1.16; }
.selo { font-weight: 400; font-size: 48px; line-height: 1.3; margin-top: 56px; }
.piada { font-weight: 400; font-size: 48px; line-height: 1.3; margin-top: 52px; }
.exp { font-weight: 700; font-size: 52px; line-height: 1.25; margin-top: 64px; }
.pag { position: absolute; top: 150px; right: 90px; background: #6D413E; color: #F1EBDF;
  font-size: 30px; padding: 10px 22px; border-radius: 40px; }
"""

fecho_css = """
body { background: #6D413E; }
.txt { position: absolute; left: 100px; right: 100px; top: 380px; text-align: center; }
h2 { color: #F1EBDF; font-weight: 700; font-size: 88px; line-height: 1.1; }
p { color: #F26F4D; font-weight: 700; font-size: 64px; margin-top: 70px; }
.h { color: #F1EBDF; opacity: .7; font-size: 36px; margin-top: 120px; font-weight: 400; }
"""
fecho = pagina(fecho_css, "<div class='txt'><h2>e você, qual agrado acrescentaria?</h2>"
               "<p>comenta aqui 👇</p><div class='h'>@paulacorrea.adv</div></div>")

SLIDES.mkdir(exist_ok=True)
total = len(AGRADOS) + 2
(SLIDES / "slide-01.html").write_text(capa, encoding="utf-8")
for i, (t, selo, piada, exp) in enumerate(AGRADOS, start=1):
    corpo = (f"<div class='box'><div class='num'>agrado #{i}</div>"
             f"<div class='t'>{t}</div><div class='selo'>{selo}</div>"
             f"<div class='piada'>{piada}</div><div class='exp'>{exp}</div></div>")
    (SLIDES / f"slide-{i + 1:02d}.html").write_text(pagina(agrado_css, corpo), encoding="utf-8")
(SLIDES / f"slide-{total:02d}.html").write_text(fecho, encoding="utf-8")
print("ok", total)
