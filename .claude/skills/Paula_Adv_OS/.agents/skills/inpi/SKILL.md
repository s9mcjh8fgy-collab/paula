---
name: inpi
description: >
  Gerencia pedidos de registro de marca e desenho industrial no INPI: cria a pasta do pedido no
  padrão já usado pelo escritório, ajuda a redigir a especificação de produtos/serviços (marca) ou
  o relatório descritivo (desenho industrial) pros formulários, atualiza o controle de andamento a
  partir de consulta manual (o INPI não tem API pública, então é sempre a Paula/Thaís que consulta
  e cola o resultado), e gera relatório de andamento em HTML pra mandar ao cliente. Use quando o
  usuário pedir "novo pedido de marca", "novo desenho industrial", "registro no INPI", "atualiza o
  andamento do INPI", "escreve a descrição pro INPI", "relatório de andamento pro cliente [INPI]".
---

# /inpi — Registro de Marca e Desenho Industrial

## Como o escritório já organiza isso

Os documentos de cada pedido já são salvos direto na pasta oficial do cliente, e é assim que o
escritório já trabalha (ver exemplo real em
`3_Jurídico/4_Assessorias/13 Leonardo Zanatta Estudio/06_INPI/`) — seguir esse mesmo padrão pros
arquivos, não inventar um novo.

O que fica em `8_Claude`, igual às outras pastas de trabalho (`consultivo/`, `contratos/`,
`processual/`), é só o painel de controle: `inpi/controle.md`, com todos os pedidos de todos os
clientes numa tabela só (ver seção abaixo).

**Localização:** `06_INPI/` dentro da pasta do cliente — em `3_Jurídico/4_Assessorias/[NN Nome]/`
pra cliente de assessoria, ou em `3_Jurídico/1_Pessoa Física (PF)/` ou `2_Pessoa Jurídica (PJ)/`
pra cliente esporádico. Se não existir ainda, criar.

**Padrão de pasta por pedido**, dentro de `06_INPI/`:

```
06_INPI/
  BR 30 2025 004464 2/                  ← nome da pasta = número do processo (formato do INPI)
    Relatório Descritivo - [nome].pdf   ← desenho industrial: memorial descritivo
    Procuração INPI PF.pdf (ou sem "PF" se for PJ)
    Identidade [nome do titular].pdf
    gru_[código].pdf                    ← guia de recolhimento, gerada pelo sistema do INPI
    comprovante-[uuid].pdf              ← comprovante de protocolo, baixado do sistema
    Protocolo [descrição].pdf
    01 Consulta_DD-MM.pdf               ← print/PDF datado de cada consulta de andamento
    Despacho / Deferimento / Certificado de registro.pdf   ← quando sai decisão
    Exigência técnica.pdf               ← se o INPI formular exigência
    Exigência/                          ← resposta à exigência (Petição.docx/pdf, novas figuras, GRU, comprovante)
```

Pra desenho industrial com mais de um produto no mesmo pedido (série), as figuras ficam em
subpastas `produto_pagina_N/`.

**Nomear as figuras exatamente como as opções do dropdown do formulário e-DI do INPI** (pra agilizar
o preenchimento na hora de subir cada imagem — o nome do arquivo já diz o que selecionar no menu):
`Perspectiva 1`, `Perspectiva 2` (se houver mais de uma), `Vista anterior`, `Vista posterior`,
`Vista lateral esquerda`, `Vista lateral direita`, `Vista superior`, `Vista inferior`, e quando
aplicável `Vista ampliada`, `Vista explodida`, `Vista em corte`, `Vista planificada`. Não usar
sinônimos (`Frontal`, `traseira`, `lateral esq` etc.) — sempre a grafia exata do dropdown.

**Requisitos técnicos das figuras no e-DI:**
- Tamanho máximo 2MB por figura. Fotos/renders costumam vir bem acima disso — comprimir com ffmpeg
  (`ffmpeg -y -i entrada.jpg -q:v N saida.jpg`, N de 2 a ~15, quanto maior mais comprime) até ficar
  abaixo do limite, mantendo a resolução original.
- Resolução mínima de 300 DPI — o e-DI rejeita a inclusão se o metadado de DPI do arquivo estiver
  abaixo disso (a compressão do ffmpeg às vezes apaga esse metadado).
- Tamanho físico máximo de 16cm x 16cm — a 300 DPI isso equivale a no máximo ~1889px por lado
  (16 / 2,54 × 300). Redimensionar mantendo a proporção antes de subir.

Resolver os três de uma vez com Python/Pillow (redimensionar, comprimir e setar o DPI):
```python
from PIL import Image
im = Image.open("arquivo.jpg")
w, h = im.size
MAX_PX = 1880  # margem de seguranca abaixo de ~1889px (16cm a 300dpi)
scale = min(MAX_PX / w, MAX_PX / h, 1.0)
if scale < 1.0:
    im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
im.save("arquivo.jpg", quality=90, dpi=(300, 300))
```
Isso já resolve os 2MB (redimensionar reduz o peso bastante) e o DPI numa passada só — só usar o
ffmpeg à parte se mesmo assim ainda passar de 2MB.

Número de processo de **marca** não segue o formato "BR 30 ...": é um número de 9 dígitos (ex:
`939480514`). O resto do padrão de pasta é o mesmo.

## `inpi/controle.md` — painel central (fica em `8_Claude`, não na pasta do cliente)

Hoje o status de cada pedido só dá pra saber olhando quais arquivos existem na pasta do cliente (tem
Certificado? tem Exigência sem resposta?). O `inpi/controle.md`, na raiz do workspace `8_Claude`,
centraliza isso numa tabela única com **todos os clientes**, pra bater o olho sem abrir pasta por
pasta:

```markdown
# Controle INPI — Todos os Clientes

| Cliente | Nº processo | Tipo | Objeto | Classificação | Depósito | Status atual | Última consulta | Próximo passo / prazo |
|---|---|---|---|---|---|---|---|---|
| Leonardo Zanatta Estúdio | BR 30 2025 004464 2 | Desenho Industrial | Mesa Pampa Série 04 | Locarno 26-05 | 16/07/2025 | Registro concedido | 19/08/2026 | — |
| Leonardo Zanatta Estúdio | BR 30 2025 005807 4 | Desenho Industrial | Sofás | Locarno 06-01 | 02/09/2025 | Exigência técnica pendente | 19/08/2026 | Responder até XX/XX |
```

Se `inpi/controle.md` ainda não existir, criar com essa estrutura na primeira vez que a skill for
usada. Uma linha por pedido, de qualquer cliente — não criar arquivo separado por cliente.

---

## Uso 1 — Novo pedido

1. Perguntar: cliente, tipo (marca ou desenho industrial), objeto (nome da marca ou do produto),
   e se já tem número de processo (se ainda não protocolou, usar um nome provisório tipo
   `Aguardando protocolo - [objeto]` e renomear a pasta quando sair o número).
2. Localizar a pasta do cliente (Glob a partir da raiz do workspace, `4_Assessorias` primeiro,
   depois PF/PJ). Se não achar exatamente um resultado, mostrar as opções e perguntar.
3. Criar `06_INPI/` se não existir, e a subpasta do pedido no padrão acima.
4. Adicionar a linha correspondente em `inpi/controle.md`.

## Uso 2 — Redigir descrição pro formulário

**Marca** — especificação de produtos e serviços (Classificação de Nice): entender com o usuário a
atividade real do cliente (o que o produto/serviço faz, pra quem), sugerir a classe NCL mais
adequada e redigir a especificação usando termos que o INPI já reconhece (evitar termo genérico
demais ou termo que o INPI historicamente glosa). Não ter certeza absoluta sobre um termo específico
aceito é normal — usar WebSearch pra checar contra a lista oficial de Classificação de Nice antes de
fechar o texto, e sempre recomendar confirmar no buscador de classificação do próprio INPI antes de
protocolar.

**Desenho industrial** — relatório descritivo (memorial descritivo): descrever as características
ornamentais e configuração visual do objeto (forma, linhas, proporções, acabamento), sem entrar em
função técnica/utilidade (isso é patente, não desenho industrial). Antes de escrever, olhar
relatórios descritivos já protocolados pelo mesmo cliente ou de outros casos (arquivos "Relatório
Descritivo - ..." dentro de `06_INPI/`) como referência de estilo e nível de detalhe que o escritório
já usa.

Sempre mostrar o rascunho antes de salvar. Salvar direto na pasta do pedido, seguindo o nome de
arquivo já usado no padrão (`Relatório Descritivo - [nome].docx` ou
`Especificação de produtos e serviços - [nome].docx`, usar a skill nativa `/docx`).

## Uso 3 — Atualizar andamento

O INPI não tem API pública pra consulta automatizada — esse passo é sempre semi-manual: a Paula ou
a Thaís consulta no portal (busca.inpi.gov.br ou sistema e-Marcas/e-DI) e cola aqui o que viu.

1. Perguntar o número do processo (ou pedir a lista se for atualização de vários pedidos de uma vez).
2. Pedir a situação atual (texto colado, ou descrita) e, se tiver, o PDF/print da consulta.
3. Se tiver o arquivo, salvar na pasta do pedido seguindo a numeração sequencial já usada
   (`01 Consulta_DD-MM.pdf`, `02 Consulta_DD-MM.pdf`, ...) — checar quantos "Consulta_" já existem
   na pasta pra saber o próximo número.
4. Atualizar a linha do pedido em `inpi/controle.md`: status atual, data da consulta, e próximo
   passo/prazo (ex: exigência tem prazo de resposta de 60 dias da publicação — calcular a data
   limite quando o status for esse).

**Não confiar cegamente no texto literal de "Situação" da consulta** — ele às vezes fica
desatualizado mesmo depois de o INPI já ter emitido o documento. Antes de registrar "aguardando
concessão/certificado", checar se já existe um arquivo `Certificado de registro.pdf` ou
`Despacho concedendo o registro.pdf` na pasta do pedido — se existir, o registro já foi concedido
mesmo que a consulta ainda diga "para confecção do folheto" ou algo parecido.

## Uso 4 — Relatório de andamento pro cliente

1. Ler `inpi/controle.md` e filtrar as linhas do cliente pedido.
2. Pra cada pedido, reunir:
   - **Uma imagem representativa do item** (fundamental pro cliente reconhecer do que se trata,
     principalmente quando ele tem vários pedidos parecidos). Buscar na pasta do pedido, nessa
     ordem de preferência: arquivo de figura já nomeado (`Perspectiva 1.jpg` etc.), outro jpg/png
     solto na pasta, ou extrair a imagem embutida na `01 Consulta_DD-MM.pdf` (via Python/PyMuPDF:
     `fitz.open(pdf)[pagina].get_images()` + `fitz.Pixmap`). Redimensionar pra no máximo 600px e
     comprimir (JPEG qualidade ~80) antes de embutir em base64 no HTML — mantém o arquivo leve pra
     mandar por e-mail/WhatsApp. Se não achar nenhuma imagem em lugar nenhum, marcar o card como
     "sem imagem" e pedir pro cliente enviar uma foto/render (isso é uma pendência de organização
     nossa, não do INPI — deixar claro que não afeta o andamento do pedido).
   - **A pendência descrita em detalhe**, quando houver (não só "exigência técnica" genérico):
     explicar o que o INPI apontou e, principalmente, **deixar explícito se o cliente precisa
     enviar algo pra Paula** (ex: novas renderizações corrigidas) ou se a resposta já foi
     encaminhada e só falta o INPI processar.
   - **Data do quinquênio**: só calcular se o pedido **já tem certificado de registro emitido**
     (arquivo `Certificado de registro.pdf` na pasta) — sem certificado não há data de quinquênio
     ainda, nem estimativa. Com certificado, a janela do 1º quinquênio de prorrogação é depósito +
     4 anos até depósito + 5 anos (ex: depósito 16/07/2025 → janela 16/07/2029 a 16/07/2030). Marca
     não tem quinquênio — é renovação decenal a partir da concessão.
   - **Prazos de resposta a exigência**: calcular sempre um prazo interno com **10 dias de folga**
     antes do prazo oficial do INPI (ex: oficial 10/10/2026 → prazo de trabalho 30/09/2026) e
     registrar os dois no `inpi/controle.md`. **No relatório pro cliente, mostrar só o prazo com
     folga** ("Responder até 30/09/2026") — o prazo oficial real é controle interno do escritório,
     não aparece pro cliente.
   - **A pendência deve dizer claramente o que a Paula precisa que o cliente faça** — não só
     descrever o problema técnico. Ex: não "inconsistência entre as vistas", e sim "o INPI apontou
     problema X nas imagens; precisamos que você envie novas renderizações corrigindo isso".
3. Gerar um HTML estilizado (usar `marca/design-guide.md` pra cores e tipografia — fundo
   bege/marrom, destaque laranja terracota #F26F4D, fonte Inter pro corpo) em **duas colunas**:
   à esquerda **"Só acompanhamento"** (pedidos sem pendência do cliente), à direita **"Aguarda
   providência sua"** (pedidos que precisam de alguma ação dele) — colunas empilham em telas
   pequenas. Cada card tem a imagem ao lado do texto (não empilhada em cima); o número do processo
   fica sempre numa linha própria, à esquerda, logo abaixo do nome do objeto (não colado na mesma
   linha do título — a posição varia demais conforme o tamanho do nome).
   - **Texto de abertura do relatório**: explicar o propósito (acompanhamento consolidado dos
     pedidos), avisar que uma versão atualizada será enviada sempre que houver mudança relevante, e
     se colocar à disposição pra dúvidas. Não só uma legenda de "esquerda x direita".
   - **Se o pedido já tem certificado emitido**, adicionar um botão de download do PDF (embutido em
     base64, `<a download>`) — e não escrever nada sobre o certificado no texto, o botão já fala por
     si. O texto do status só precisa dizer que o registro foi concedido (com a data).
   - **Tom do texto: relatório objetivo, não bate-papo.** Só fatos e datas. Não explicar o que cada
     etapa significa, não comentar se algo "não impede o uso do registro", não falar sobre
     renovação/prorrogação a menos que seja o quinquênio já calculável (ver abaixo). Evitar frases
     de preenchimento tipo "sem prazo definido pra próxima etapa" — só descrever a etapa atual.
   - **Formato do status: linha do tempo com a data primeiro**, não frase corrida. Uma linha por
     marco, data em negrito à esquerda (formato `DD/MM/AA`) seguida do evento: `08/07/25 —
     Publicada para oposição`. Se o pedido ainda não chegou numa etapa final (aguardando algo, sem
     data), essa linha final entra sem data, em cinza, abaixo das linhas datadas.
4. Salvar em `06_INPI/relatorio-andamento-[AAAA-MM-DD].html`, na pasta do cliente. Não publicar
   online — é informação confidencial do cliente, então o arquivo é local (e autocontido, com as
   imagens em base64 — não depende de nenhum link externo), pra abrir no navegador e mandar como
   anexo por e-mail/WhatsApp (ou imprimir em PDF direto do navegador se o cliente preferir PDF).

---

## Regras

- Nunca inventar status, datas ou número de processo — só registrar o que foi confirmado pelo
  usuário ou já existe em arquivo.
- Sem travessão. Tom informal-profissional com a Paula; ao escrever conteúdo que vai pro INPI
  (especificação, relatório descritivo), tom técnico é esperado — é documento oficial.
- Sempre mostrar o rascunho de qualquer texto antes de salvar.
- Se não achar a pasta do cliente com um resultado exato, parar e perguntar antes de criar pasta
  nova em lugar errado.
