"""Gera os HTMLs das duas partes da série "cliente que sumiu" (fundo laranja terracota).
Uso: python gerar.py   (escreve slide-NN.html nas pastas parte-1 e parte-2)
"""
import pathlib

BASE = pathlib.Path(__file__).resolve().parent.parent

CSS = """
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1080px; height: 1350px; background: #F26F4D; color: #FFFFFF; font-family: 'Source Serif 4', serif; }
  .wrap { width: 1080px; height: 1350px; display: flex; align-items: center; justify-content: center; padding: 110px; }
  .block { max-width: 880px; text-align: center; }
  p { font-size: %(fs)spx; line-height: 1.4; font-weight: 400; }
  p + p { margin-top: 34px; }
  .accent { font-weight: 600; color: #6D413E; }
  .cover-kicker { font-size: 62px; font-style: italic; font-weight: 600; color: #6D413E; margin-bottom: 22px; display: block; }
  .cover-title { font-size: 84px; line-height: 1.15; font-weight: 600; }
  .cover-tension { font-size: 52px; font-style: italic; margin-top: 26px; }
  .cover-part { margin-top: 70px; font-size: 34px; letter-spacing: 6px; text-transform: uppercase; color: #6D413E; font-weight: 600; }
  .continua { font-style: italic; font-size: 40px; color: #6D413E; }
"""

def pagina(corpo, fs=44):
    return f"""<!doctype html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<style>{CSS % {'fs': fs}}</style>
</head>
<body>
  <div class="wrap"><div class="block">{corpo}</div></div>
</body>
</html>"""

def capa(parte):
    return pagina('<span class="cover-kicker">Era uma vez...</span>'
                  '<div class="cover-title">um cliente<br>que sumiu</div>'
                  '<div class="cover-tension">(e voltou com advogado)</div>'
                  f'<div class="cover-part">Parte {parte}</div>')

def ac(t):
    return f'<span class="accent">{t}</span>'

P1 = [
    capa(1),
    pagina('<p>A Helena é arquiteta e foi contratada para projetar a área de lazer de uma casa: piscina, deck e uma churrasqueira coberta, no lugar de uma edícula velha.</p><p>O cliente pagou tudo à vista, na assinatura. Ela fez o levantamento, apresentou o estudo, e ele aprovou.</p>'),
    pagina('<p>Para o projeto seguir, faltavam coisas que só o cliente podia mandar: a planta aprovada da casa, o modelo da piscina e as medidas conferidas depois da demolição da edícula.</p><p>A Helena pediu. Ele respondeu: "semana que vem te mando tudo".</p><p>' + ac('Isso foi há mais de um ano.') + '</p>'),
    pagina('<p>Nesse tempo, a Helena mandou e-mail, mensagem e lembrete. Nada. E a agenda dela andou: entraram outros clientes, outros projetos, outros prazos.</p><p>Só que o contrato continuava aberto. A qualquer momento, o cliente podia reaparecer querendo o projeto para ontem, e ela teria que dar um jeito de encaixar.</p><p>Foi aí que ela me chamou: ' + ac('"não dá para ficar presa a isso para sempre".') + '</p>', fs=40),
    pagina('<p>Fui ao contrato. Ele dizia que o cliente devia entregar as informações, mas não dizia em quanto tempo. E, sem prazo combinado, é a notificação que coloca a pessoa em atraso.</p><p>Redigi uma dando 15 dias para ele mandar o que faltava. Se não mandasse, o contrato estaria encerrado, sem multa e sem nada a acertar entre os dois.</p>', fs=42),
    pagina('<p>Dois dias depois, o cliente confirmou que tinha recebido e pediu uma cópia do contrato.</p><p>No dia seguinte, chegou a resposta. Não veio dele.</p><p>' + ac('Veio de um escritório de advocacia.') + '</p><p><span class="continua">Continua...</span></p>'),
]

P2 = [
    capa(2),
    pagina('<p>Era uma contranotificação. O advogado não negava que o cliente tinha sumido, mas dizia que o atraso tinha motivo: um problema nas medidas do terreno, que precisava ser resolvido antes de o projeto continuar.</p><p>E, em vez de encerrar o contrato, propunha uma reunião.</p>'),
    pagina('<p>A Helena queria encerrar de qualquer jeito. Eu recomendei ir à reunião.</p><p>Se o atraso tinha uma explicação, era melhor ouvir agora, frente a frente, do que descobrir depois, num processo.</p><p>Fui junto.</p>'),
    pagina('<p>Na reunião, veio a história inteira. Quando a edícula foi demolida, apareceu o muro antigo do vizinho, e o terreno era menor do que dizia a planta.</p><p>' + ac('A piscina, do jeito que estava no estudo, ficava em cima do recuo exigido pela prefeitura.') + '</p>'),
    pagina('<p>A medida errada não era culpa de ninguém, mas o projeto precisava ser refeito.</p><p>Combinamos tudo ali: o cliente atualiza o levantamento até fevereiro, ninguém cobra prazo de ninguém até lá, e o novo prazo de entrega entra num aditivo ao contrato.</p>'),
    pagina('<p>Um ano de silêncio acabou em uma semana. A notificação não encerrou o contrato, mas trocou o "quando der" por uma data.</p><p>E a Helena voltou a decidir a própria agenda: o novo prazo de entrega só começa a contar quando o levantamento chegar, e o aditivo vai prever o valor das horas para refazer o projeto.</p><p>' + ac('Primeiro o aditivo assinado. Depois o trabalho.') + '</p>', fs=40),
    pagina('<p>Caso real do escritório, com nomes e detalhes trocados. O alerta fica: contrato sem prazo para o cliente prende quem projeta, não quem contrata.</p><p>' + ac('Escreva em quantos dias o cliente entrega o que você precisa, por quanto tempo o projeto pode ficar parado e o que acontece depois disso: ou o contrato se encerra, ou a retomada entra na sua agenda, com novo prazo e novo valor.') + '</p><p>E toda conversa importante vai por escrito.</p>', fs=40),
]

for pasta, slides in (("serie-cliente-sumiu-parte-1", P1), ("serie-cliente-sumiu-parte-2", P2)):
    d = BASE / pasta
    d.mkdir(exist_ok=True)
    for i, html in enumerate(slides, 1):
        (d / f"slide-{i:02d}.html").write_text(html, encoding="utf-8")
    print(pasta, len(slides), "slides")
