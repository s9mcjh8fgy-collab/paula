---
name: financeiro
description: >
  Faz o fechamento financeiro mensal do escritório: lança as despesas do mês em Contas a Pagar,
  soma a receita recebida no mês, calcula o lucro e preenche o Fechamento Mensal. Também ajuda a
  organizar a pasta que vai pra contabilidade todo mês. Use quando o usuário pedir "fecha o mês",
  "fechamento financeiro", "quanto eu lucrei", "lança essas contas", "organiza o financeiro deste
  mês", ou colar uma lista de despesas/boletos/notas pra registrar.
---

# /financeiro — Fechamento Financeiro Mensal

## Dependências

- **Pasta financeira:** `1_Gestão/2_Financeiro/` na raiz do workspace (`../../../../1_Gestão/2_Financeiro/`
  a partir desta skill).
- **Contas a Pagar:** `1_Gestão/2_Financeiro/03 Contas a Pagar.xlsx` — uma aba por ano, uma linha
  por lançamento de despesa. Colunas: Mês, Categoria, Descrição, Fornecedor, Valor, Vencimento,
  Pago em, Forma de pagamento, Status. Categorias (ver aba `Legenda` do próprio arquivo): Fixa,
  Variável, Imposto, Comissão/Repasse, Pessoal, Investimento, Outro.
- **Receita oficial (faturamento):** vem do e-mail mensal da contabilidade (Hcont,
  `Gerencia@hcontsc.com.br`), assunto "PAULA CORREA SOCIEDADE INDIVIDUAL DE ADVOCACIA - Impostos
  ref. MM/AAAA" — chega no início do mês seguinte ao de competência e traz a linha "Faturamento:
  R$ X (sendo R$ Y normal e R$ Z sucumbência)". Esse é o valor usado até pra calcular o Simples
  Nacional, então é a fonte de verdade pra Receita do Fechamento Mensal — **nunca** a
  `01 Contas a Receber.xlsx` (essa planilha mistura valores brutos/repasses de cliente com
  honorário líquido do escritório e infla bastante o total — já causou um erro grande de cálculo
  antes, ver nota abaixo). Buscar o e-mail:
  1. Primeiro checar se já foi salvo como `.msg` na pasta do mês em `1_Gestão/2_Financeiro/`
     (ex: `07 Julho 26/...Impostos ref_ 07_2026.msg`). Ler com `extract_msg` via Python.
  2. Se não estiver salvo, buscar na caixa de e-mail via
     `mcp__claude_ai_Microsoft_365__outlook_email_search` com `sender: "Gerencia@hcontsc.com.br"`
     e `query: "Impostos ref"`, filtrando pelo mês/ano no assunto.
  3. Os anexos desse e-mail (Folha de pagamento Thaís, Folha Pró-Labore Paula, FGTS, DARF
     Previdenciário, DAS, Contribuição Assistencial, Honorários Contábeis) são também a fonte mais
     precisa pra despesas de Imposto/Pessoal do mês, quando disponíveis — preferir isso a estimar
     pelo extrato bancário.
- **Contas a Receber:** `1_Gestão/2_Financeiro/01 Contas a Receber.xlsx` — útil pra detalhe por
  cliente/parceiro (quem pagou o quê), mas **não usar como fonte da Receita total do Fechamento
  Mensal** (ver nota acima). Aba `Partido-Avulso-Assessoria <ano>` tem valores mensais por
  cliente, e `Êxito-Alvará` tem honorários de êxito/sucumbência por processo (coluna "Corrêa").
- **Fechamento Mensal:** `1_Gestão/2_Financeiro/08 Fechamento Mensal.xlsx` — uma aba por ano, uma
  linha por mês, com Receita, despesas por categoria (mesmas categorias da Contas a Pagar), Total
  de Despesas, Lucro e Margem % (essas três últimas já têm fórmula, não sobrescrever).
- **App de vencimentos (uso do dia a dia):** `https://financeiro-paula.paulacorrea-adv.workers.dev`
  — Cloudflare Worker próprio (código em `1_Gestão/2_Financeiro/app-financeiro/`), login com senha
  única (não é a mesma senha do sistema de demandas). **Esse app substitui o
  `09 Painel de Vencimentos.xlsx`** (a versão em Excel foi tentada em 2026-09 e a Paula não gostou
  — lista corrida demais, preferiu um app de verdade). Não recriar o `.xlsx` a menos que ela peça.
  - **Estrutura (v2, desde 2026-09):** três abas — Dashboard (totais do mês atual, saldo previsto,
    aviso de vencidos, recorrência mensal estimada), A Pagar e A Receber (cada uma com navegação
    por mês ‹ › e tabela ordenável por nome/tipo/vencimento/valor). Recorrentes (assessoria mensal)
    são gerados automaticamente mês a mês pelo próprio Worker — **não precisa reimportar nada
    manualmente todo mês**, é só ela abrir o mês seguinte no app que ele já cria as cobranças.
  - **Duas tabelas no mesmo projeto Supabase** do sistema de demandas
    (`ynvaqkokeepeozozmsif.supabase.co`), separadas, sem RLS pública (só o Worker com a
    `SUPABASE_SECRET_KEY` acessa):
    - `fin_recorrentes`: a *definição* de cada cliente/despesa recorrente (tipo, contraparte,
      categoria, valor, dia_vencimento, ativo, observacoes, `total_parcelas`, `mes_inicio`).
      Editar aqui não afeta ocorrências já geradas, só as futuras.
      - `mes_inicio` ('YYYY-MM'): mês em que a parcela 1 aconteceu de verdade — **não é
        necessariamente o mês em que o recorrente foi cadastrado no app**. Se o cliente já vinha
        pagando havia meses quando foi importado, `mes_inicio` tem que refletir o mês real da
        1ª parcela (olhar o histórico em `01 Contas a Receber.xlsx`), senão a contagem de parcela
        fica errada. Default `2026-09` só serve pra quem começou naquele mês.
      - `total_parcelas` (int, null = recorrente indefinido/assessoria contínua sem fim): número
        total de parcelas do parcelamento. A parcela de um mês M é calculada por
        `parcelaNum(mes_inicio, M)` (diferença de meses, 1-indexado) — **nunca** contando quantas
        ocorrências já foram geradas no banco, porque se a Paula pular meses no navegador (ex: ir
        direto pra 2027), a contagem por "quantidade gerada" fica errada. Uma vez que
        `parcelaNum > total_parcelas`, o Worker para de gerar aquele recorrente automaticamente
        (não precisa desativar manualmente, mas o campo `ativo` também pode ser usado pra
        interromper na mão a qualquer momento).
    - `fin_lancamentos`: cada *ocorrência* concreta com data (recorrente ou avulsa/parcelada).
      Colunas: tipo, descricao, contraparte, categoria, valor, vencimento, pago, data_pagamento,
      recorrente (bool), dia_vencimento, observacoes, recorrente_id (liga à definição, null se for
      avulso), mes_ref ('YYYY-MM', só preenchido em ocorrências geradas de recorrentes).
  - **Como o Worker gera as ocorrências do mês:** toda vez que a rota `/api/lancamentos` ou
    `/api/dashboard` recebe um `mes`, ele primeiro roda `garantirOcorrencias()` (em `src/index.js`)
    — busca os `fin_recorrentes` ativos daquele tipo, vê quais ainda não têm uma linha em
    `fin_lancamentos` com aquele `mes_ref`, e cria as que faltam (dia de vencimento ajustado se o
    mês for mais curto, ex: dia 31 em fevereiro vira o último dia do mês). Índice único
    `(recorrente_id, mes_ref)` evita duplicar mesmo com cliques repetidos.
  - **Parar um recorrente:** `PATCH /api/recorrentes/:id` com `{"ativo": false}` — no app, isso
    acontece automaticamente se ela escolher "parar a recorrência de vez" ao excluir um item
    marcado como recorrente (o app pergunta: só este mês, ou parar de vez).
  - **Pra adicionar um lançamento pedido pela Paula na conversa** (sem ela abrir o app): se for
    recorrente, POST em `/rest/v1/fin_recorrentes`; se for avulso/pontual, POST direto em
    `/rest/v1/fin_lancamentos` — sempre via `SUPABASE_SECRET_KEY` (de `.env.local` na raiz do
    workspace).
  - **Pra alterar o código do app** (frontend em `src/page.js`, backend em `src/index.js`): editar
    e rodar `npx wrangler deploy` de dentro de `app-financeiro/`, com `CLOUDFLARE_API_TOKEN` e
    `CLOUDFLARE_ACCOUNT_ID` exportados a partir do `.env` desta skill (`Paula_Adv_OS/.env`).
    **Cuidado com o escaping de aspas em `page.js`:** `HTML_PAGE` é um template literal (crase) que
    engloba a página inteira, incluindo o `<script>` com JS de verdade. Pra gerar uma aspa simples
    escapada dentro de um atributo `onclick`/`onchange` (ex: `marcarPago('...', ...)`), o texto na
    fonte precisa ser `\\'` (barra dupla) — `\'` (barra simples) é interpretado pelo template
    literal externo como só `'`, quebrando a sintaxe do `<script>` interno e travando a página
    inteira sem erro visível pro usuário (só "clico e não acontece nada"). Já aconteceu em
    2026-09. **Depois de qualquer edição em `page.js`, antes de fazer deploy**, validar assim:
    ```bash
    curl -s https://financeiro-paula.paulacorrea-adv.workers.dev/ -o /tmp/pagina.html
    python -c "import re; open('/tmp/script.js','w',encoding='utf-8').write(re.search(r'<script>(.*?)</script>', open('/tmp/pagina.html',encoding='utf-8').read(), re.DOTALL).group(1))"
    node --check /tmp/script.js
    ```
    Se der `SyntaxError`, o deploy quebrou a página — corrigir antes de avisar a Paula que está
    pronto.
  - **Nunca editar `page.js` com PowerShell/regex de substituição em massa (`-replace` etc.)** —
    já aconteceu de corromper a acentuação do arquivo inteiro (UTF-8 lido/escrito com codificação
    errada) em 2026-09. Usar sempre a ferramenta de edição de texto padrão (Edit), que preserva a
    codificação. Se corromper mesmo assim, dá pra reconstruir buscando a última versão publicada
    (`curl https://financeiro-paula.paulacorrea-adv.workers.dev/` — reflete o último deploy bem-
    sucedido), escapando as barras invertidas (`\` → `\\`) antes de envolver de novo no template
    literal `export const HTML_PAGE = \`...\`;`, e reaplicando por cima as mudanças que ainda não
    tinham sido publicadas.
  - **Pra trocar a senha do app:** `npx wrangler secret put APP_PASSWORD` (gravar o novo valor num
    arquivo temporário e usar `< arquivo` em vez de digitar/ecoar direto, apagar o arquivo depois).
  - **Regra pra (re)importar clientes de assessoria da `01 Contas a Receber.xlsx` pro app** (ex:
    virou outubro, precisa atualizar quem está ativo): filtrar Status = "A" (coluna sem nome,
    logo depois de "Pagador" — "A" significa Ativo, não Assessoria) **E** ter valor preenchido
    nos dois últimos meses fechados (ex: em setembro, exigir Julho e Agosto preenchidos). Cliente
    com valor só num mês isolado geralmente é pagamento único ou já encerrou — **não dá pra
    decidir isso sozinho**, os casos-limite (só o mês mais recente preenchido, mês anterior em
    branco) têm que ir pra Paula confirmar um a um: pode ser início de contrato, inadimplência,
    pausa temporária que já retomou, ou pagamento avulso mesmo. Já teve engano nisso em 2026-09
    (Jair Pieritz parecia ativo mas era só um pagamento único de agosto; outros como Cassim
    Calazans, Rafael Acosta Lemos, Sabrina Dell Ducas, Gabrielle Clerice de Souza começaram em
    agosto e são recorrentes de verdade; Ana Cláudia e Luriane Borges Amorim só tinham pausado
    e retomaram) — não upar sem revisar.
  - **Um "Nx" na coluna OBS/Saldo da planilha não é confiável sozinho** pra saber se é parcelamento
    finito ou recorrente indefinido — em 2026-09 vários casos contradisseram o texto (ex: "2x" que
    na real eram 8 meses seguidos de cobrança = recorrente de verdade; "1x" que na real fazia parte
    de um plano de 10 parcelas). Sempre cruzar com o histórico de valores mês a mês, e quando não
    bater, perguntar direto pra Paula quantas parcelas no total e em qual mês foi a última — nunca
    assumir. Isso também vale pra descobrir o `mes_inicio` real (a parcela 1 muitas vezes já
    aconteceu antes do mês em que o app foi criado).
- Pra editar `.xlsx` sem quebrar formatação/fórmulas, usar Python com `openpyxl` (Bash), nunca
  reescrever o arquivo inteiro do zero depois da primeira criação.

## Como funciona

O fechamento mensal soma duas coisas que já são preenchidas o ano inteiro (Contas a Pagar e Contas
a Receber) e escreve o resultado consolidado na aba do ano em `08 Fechamento Mensal.xlsx`. Isso
não substitui o material que vai pra contabilidade (extratos + notas fiscais) — é um controle
gerencial em cima disso, pra saber lucro real.

## Workflow

### 1. Lançar despesas do mês

Se a Paula colar uma lista de despesas, boletos ou notas fiscais recebidas (ou pedir pra lançar
algo específico):

1. Pra cada despesa, confirmar: descrição, fornecedor, valor, vencimento, categoria (usar a
   Legenda do arquivo — se não for óbvio, perguntar em vez de chutar).
2. Adicionar uma linha nova na aba do ano corrente em `03 Contas a Pagar.xlsx` (não sobrescrever
   linhas existentes). Manter a formatação (bordas, número) da linha anterior.
3. Status default `Pendente` a menos que a Paula diga que já foi pago (nesse caso preencher
   também `Pago em` e `Forma de pagamento`, status `Pago`).

### 2. Fechar o mês (calcular lucro)

Quando a Paula pedir o fechamento de um mês específico (ex: "fecha agosto", "quanto eu lucrei em
julho"):

1. **Receita do mês:** pegar o "Faturamento" do e-mail da contabilidade daquele mês (ver
   Dependências acima). Se o e-mail ainda não chegou (mês corrente, contabilidade manda só no mês
   seguinte), avisar a Paula que a receita oficial ainda não está disponível em vez de estimar pela
   Contas a Receber.
2. **Despesas do mês:** somar por categoria os lançamentos do mês correspondente na aba do ano em
   `03 Contas a Pagar.xlsx` (SUMIFS por Mês + Categoria, ou equivalente em Python). Extrato
   bancário (OFX, formato SGML — cuidado: alguns bancos usam vírgula decimal, outros ponto; alguns
   arquivos vêm em UTF-8, outros em cp1252) é a fonte mais confiável pra despesas que não geram NF
   (impostos, salário, vale-transporte, tarifas, parcelas de empréstimo) — não dá pra confiar só em
   NF/fatura, que não cobre isso.
3. Escrever os valores na linha do mês da aba do ano em `08 Fechamento Mensal.xlsx`: coluna
   Receita e as colunas de cada categoria de despesa. As colunas Total Despesas, Lucro e Margem %
   já calculam sozinhas (não sobrescrever essas fórmulas).
4. Mostrar o resultado direto na conversa:

   > "Fechamento de [mês]: Receita R$ X, Despesas R$ Y (Fixas R$..., Impostos R$..., ...), Lucro
   > R$ Z (margem W%)."

5. Se algum valor parecer estranho (mês sem nenhuma despesa lançada, receita zerada), avisar a
   Paula em vez de preencher silenciosamente com zero — pode ser que faltou lançar alguma coisa em
   Contas a Pagar antes de fechar.

### 3. Lançar algo direto no app de vencimentos

Se a Paula pedir pra adicionar uma conta a pagar/receber "no app" (em vez de só na planilha),
inserir na tabela `fin_lancamentos` via REST do Supabase (ver Dependências). Confirmar tipo,
descrição, contraparte, valor e vencimento antes de gravar.

### 4. Organizar malote pra contabilidade (se pedido)

Seguir a checklist já existente em `05 Checklist malote.xlsx` (extratos PDF/OFX de cada banco,
notas fiscais do mês, boletos e comprovantes) pra conferir o que falta juntar antes de enviar.

## O que NÃO é despesa do escritório (não lançar em Contas a Pagar)

Ao ler o extrato bancário, várias transferências PIX/TED não são despesa — são movimentação que
não deve entrar no cálculo de lucro:

- **Transferências pra Paula** (qualquer variação do nome: "Paula Fernanda Correa de Borba",
  "Paula Correa Sociedade Individual de Advocacia" etc.) e **pra Anderson Maicon de Borba** =
  distribuição de lucro pra sócia, não despesa.
- **Transferências PIX/TED nomeadas pra outras pessoas físicas ou empresas** (nomes de clientes,
  parceiros, condomínios) = repasse de valor que entrou pro cliente/parceiro, não despesa do
  escritório — nem entra como despesa nem a entrada correspondente conta como receita.
- Movimentações internas entre aplicação financeira e conta corrente (ex: "BB Rende Fácil", "BB RF
  Simples Ágil", "DB. Cotas", cota capital de cooperativa) = não é despesa nem receita.
- Pagamento de fatura de cartão de crédito no extrato (ex: "Pagto Cartão Crédito") não deve ser
  lançado à parte se as compras da fatura já foram detalhadas item a item a partir do PDF da
  fatura — senão duplica.

Já **incluir** como despesa real: custas processuais e taxas (INPI, tribunais, registro civil,
certificado digital, cartório) mesmo vinculadas a processo de cliente — decisão confirmada pela
Paula em 2026-09. Consórcio (Porto Seguro, BB) também é despesa do escritório (categoria
Investimento) — confirmado na mesma data.

## Regras

- Nunca sobrescrever linhas já lançadas em Contas a Pagar ou Contas a Receber — só adicionar.
- Nunca inventar categoria de despesa sem ter certeza — perguntar se não for óbvio pela Legenda.
- Fechamento Mensal é sempre recalculado a partir da Contas a Pagar/Receber, nunca editado à mão
  direto sem meta a fonte batendo.
- Ano sem aba ainda em algum dos três arquivos: criar a aba nova copiando a estrutura (cabeçalho,
  larguras, validações) da aba do ano anterior, nunca criar do zero sem formatação.
