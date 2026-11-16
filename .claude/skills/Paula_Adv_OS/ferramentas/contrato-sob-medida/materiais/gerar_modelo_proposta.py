"""Gera o modelo de proposta comercial do Contrato na Régua Sob Medida (Word).

O modelo vai para o cliente final do arquiteto, então é neutro (sem a marca do Estrutura Legal) e traz,
na ordem, os itens que a leitura por IA precisa para preencher o contrato. O que está entre colchetes
sai grifado em amarelo, para o arquiteto trocar.

Uso: python gerar_modelo_proposta.py   (gera modelo-proposta.docx nesta pasta)
"""
import re, zipfile, shutil
from pathlib import Path
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_COLOR_INDEX
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor, Cm

AQUI = Path(__file__).parent
SAIDA = AQUI / 'modelo-proposta.docx'
COR = RGBColor(0x6D, 0x41, 0x3E)
CINZA = RGBColor(0x6B, 0x5E, 0x58)

doc = Document()
sec = doc.sections[0]
sec.page_width, sec.page_height = Cm(21), Cm(29.7)
sec.left_margin = sec.right_margin = Cm(2.2)
sec.top_margin = sec.bottom_margin = Cm(2)
st = doc.styles['Normal']
st.font.name = 'Calibri'
st.font.size = Pt(11)
st.element.rPr.rFonts.set(qn('w:eastAsia'), 'Calibri')
st.paragraph_format.space_after = Pt(4)
st.paragraph_format.line_spacing = 1.15


def texto(p, t, bold=False, cor=None, size=None, italic=False):
    """Escreve t no parágrafo; trechos [entre colchetes] saem grifados em amarelo."""
    for parte in re.split(r'(\[[^\]]+\])', t):
        if not parte:
            continue
        r = p.add_run(parte)
        r.bold, r.italic = bold, italic
        if cor: r.font.color.rgb = cor
        if size: r.font.size = Pt(size)
        if parte.startswith('['): r.font.highlight_color = WD_COLOR_INDEX.YELLOW
    return p


def par(t='', **k):
    return texto(doc.add_paragraph(), t, **k)


def titulo(n, t):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    texto(p, f'{n}. {t}'.upper(), bold=True, cor=COR, size=11.5)
    linha_inferior(p)


def linha_inferior(p):
    pPr = p._p.get_or_add_pPr()
    b = OxmlElement('w:pBdr')
    e = OxmlElement('w:bottom')
    for k, v in {'w:val': 'single', 'w:sz': '6', 'w:space': '2', 'w:color': 'C9B9AE'}.items():
        e.set(qn(k), v)
    b.append(e)
    pPr.append(b)


def campo(rotulo, valor):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    texto(p, rotulo + ': ', bold=True)
    texto(p, valor)


def item(t):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(2)
    texto(p, t)


def sombra(cel, fill):
    tcPr = cel._tc.get_or_add_tcPr()
    s = OxmlElement('w:shd')
    s.set(qn('w:val'), 'clear'); s.set(qn('w:color'), 'auto'); s.set(qn('w:fill'), fill)
    tcPr.append(s)


def tabela(cab, linhas, larguras):
    t = doc.add_table(rows=1, cols=len(cab))
    t.style = 'Table Grid'
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, c in enumerate(cab):
        cel = t.rows[0].cells[i]
        cel.text = ''
        texto(cel.paragraphs[0], c, bold=True, size=10)
        sombra(cel, 'F1EBDF')
    for l in linhas:
        cels = t.add_row().cells
        for i, v in enumerate(l):
            cels[i].text = ''
            texto(cels[i].paragraphs[0], v, size=10, bold=(i == 0))
    for row in t.rows:
        for i, w in enumerate(larguras):
            row.cells[i].width = Cm(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(0)
    return t


# Quadro de instruções (para apagar antes de enviar)
q = doc.add_table(rows=1, cols=1)
q.style = 'Table Grid'
c = q.rows[0].cells[0]
sombra(c, 'FDF3E7')
c.text = ''
texto(c.paragraphs[0], 'Como usar este modelo (apague este quadro antes de enviar ao cliente)', bold=True, cor=COR, size=10)
for t in [
    'Troque tudo o que está [entre colchetes e grifado]. Apague as etapas e opções que não fazem parte deste projeto.',
    'Pode usar o layout e a identidade do seu escritório. O importante é manter estes itens: com eles, a leitura do Contrato na Régua Sob Medida preenche o contrato quase inteiro sozinha.',
    'Prazos sempre em dias úteis. Valores com o total e a forma de pagamento definida (evite "a combinar").',
]:
    p = c.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    texto(p, '• ' + t, size=9.5, cor=CINZA)
doc.add_paragraph()

# Cabeçalho da proposta
p = doc.add_paragraph()
texto(p, '[LOGO DO ESCRITÓRIO]', size=9, cor=CINZA)
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.LEFT
p.paragraph_format.space_before = Pt(6)
texto(p, 'PROPOSTA DE PRESTAÇÃO DE SERVIÇOS DE ARQUITETURA', bold=True, cor=COR, size=15)
par('Proposta nº [000/2026]   ·   Data: [dd/mm/aaaa]   ·   Validade: [15] dias', cor=CINZA, size=10)

titulo(1, 'Quem faz a proposta')
campo('Nome ou razão social', '[Nome do arquiteto ou do escritório]')
campo('CPF ou CNPJ', '[000.000.000-00 ou 00.000.000/0001-00]')
campo('Registro no CAU', '[A000000-0]')
campo('Representante (se for empresa)', '[Nome e CPF de quem assina]')
campo('Endereço profissional', '[Rua, número, sala, bairro, Cidade/UF]')
campo('E-mail e WhatsApp', '[email@escritorio.com.br] · [(00) 00000-0000]')

titulo(2, 'Para quem')
campo('Nome ou razão social', '[Nome completo do cliente]')
campo('CPF ou CNPJ', '[000.000.000-00]')
campo('Endereço', '[Rua, número, apartamento, bairro, Cidade/UF]')
campo('E-mail e WhatsApp', '[email@cliente.com] · [(00) 00000-0000]')
campo('Quem aprova as etapas', '[Nome do cliente e, se houver, do cônjuge ou sócio]')

titulo(3, 'O projeto')
campo('O que será feito', '[Ex.: projeto de reforma e interiores de apartamento residencial]')
campo('Endereço do imóvel', '[Rua, número, apartamento, bairro, Cidade/UF]')
campo('Área aproximada', '[000] m²')
campo('Ponto de partida', '[Ex.: planta fornecida pela construtora, a conferir em campo; levantamento feito pelo escritório]')

titulo(4, 'Escopo e prazos')
par('Cada etapa começa depois da aprovação da anterior. Prazos em dias úteis.', size=10, cor=CINZA)
tabela(['Etapa', 'O que é entregue', 'Prazo'], [
    ['Levantamento e briefing', '[Medição do imóvel, fotos, reunião de briefing e programa de necessidades]', '[5] dias úteis'],
    ['Estudo preliminar / layout', '[Planta de layout com até 2 opções]', '[10] dias úteis'],
    ['Anteprojeto / 3D', '[Imagens 3D: quantidade de renders e ambientes]', '[15] dias úteis'],
    ['Projeto executivo', '[Marcenaria, iluminação, paginação de piso e revestimentos, detalhamentos]', '[20] dias úteis'],
    ['Projeto legal (se houver)', '[Projeto para aprovação na prefeitura ou no condomínio]', '[15] dias úteis'],
    ['Acompanhamento de obra (se houver)', '[Quantidade de visitas ou frequência, ex.: 1 visita por semana]', 'Durante a obra'],
    ['Compras (se houver)', '[Curadoria e cotação de mobiliário e acabamentos]', 'Durante a obra'],
], [4.2, 9.2, 3.2])

titulo(5, 'Revisões e aprovações')
campo('Revisões incluídas', '[2] rodadas por etapa')
campo('Prazo para cada revisão', '[5] dias úteis')
campo('Prazo para o cliente aprovar cada etapa', '[5] dias úteis')

titulo(6, 'O que não está incluído')
for t in ['[Projetos complementares: elétrico, hidráulico, estrutural, ar-condicionado]',
          '[Taxas de prefeitura, condomínio e RRT de execução]',
          '[Execução da obra e contratação de mão de obra]',
          '[Revisões além das incluídas e mudanças de escopo depois da aprovação]']:
    item(t)

titulo(7, 'Acompanhamento de obra e compras')
par('Preencha só se fizer parte do serviço. Diga como é cobrado:', size=10, cor=CINZA)
campo('Acompanhamento', '[Incluído no valor total / R$ 000 por visita / R$ 000 por mês]')
campo('Compras', '[Incluídas no valor total / 10% sobre o valor das compras / compra feita diretamente pelo cliente]')
campo('Reserva técnica ou comissão de lojas', '[Não recebo / recebo e informo ao cliente]')

titulo(8, 'Investimento')
campo('Valor total', 'R$ [00.000,00] ([valor por extenso])')
par('Forma de pagamento (deixe só uma):', bold=True)
item('À vista: [100]% na assinatura do contrato.')
item('Parcelado: entrada de [30]% na assinatura e o saldo em [5] parcelas mensais iguais.')
item('Por etapa: [20]% na assinatura e o restante na entrega de cada etapa, conforme a tabela abaixo.')
tabela(['Momento', 'Percentual'], [
    ['Assinatura do contrato', '[20]%'],
    ['Entrega do estudo preliminar / layout', '[20]%'],
    ['Entrega do anteprojeto / 3D', '[30]%'],
    ['Entrega do projeto executivo', '[30]%'],
], [10.6, 6])
campo('Vencimento das parcelas', 'todo dia [10]')
campo('Meios de pagamento', '[PIX / transferência bancária / boleto]')

titulo(9, 'Próximo passo')
par('Com o aceite desta proposta, enviamos o contrato de prestação de serviços com estas condições para assinatura.')
doc.add_paragraph()
par('[Cidade/UF], [dd/mm/aaaa]')
doc.add_paragraph()
par('_______________________________________')
par('[Nome do arquiteto]  ·  CAU [A000000-0]', size=10)

doc.save(SAIDA)

# python-docx deixa uma pasta [trash] dentro do .docx, que filtros de e-mail bloqueiam: tirar
tmp = SAIDA.with_suffix('.tmp')
with zipfile.ZipFile(SAIDA) as zi, zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zo:
    for i in zi.infolist():
        if not i.filename.startswith('[trash]'):
            zo.writestr(i, zi.read(i.filename))
shutil.move(tmp, SAIDA)
print('ok', SAIDA)
