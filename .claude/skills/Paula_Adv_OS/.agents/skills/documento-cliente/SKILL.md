---
name: documento-cliente
description: Preenche os modelos padrão do escritório (procurações, declarações de hipossuficiência e contratos de honorários/assessoria) com os dados de um cliente e salva o .docx na pasta certa do cliente, preservando os modelos originais intactos na pasta Credenciais. Use quando a Paula pedir "faz uma procuração pro [cliente]", "preenche a declaração de hipossuficiência", "gera o contrato de honorários", "contrato de assessoria pro [cliente]", ou qualquer documento que parta desses modelos. Também usar pra alterar ou criar um modelo novo nesse mesmo visual.
---

# /documento-cliente: documentos a partir dos modelos do escritório

## Regra principal

**Os modelos da pasta Credenciais nunca são editados nem sobrescritos.** Todo documento de cliente
é uma cópia preenchida, salva na pasta do cliente/serviço. O script `preencher.py` bloqueia gravação
dentro de Credenciais.

Pasta dos modelos: `5_Acervo/2_Modelos Gerais/Credenciais/` (a partir de `00_Novo Diretório`;
caminho relativo a partir de `Paula_Adv_OS`: `../../../../5_Acervo/2_Modelos Gerais/Credenciais/`).

| Modelo | Quando usar |
|---|---|
| `Procuração (PF)` | pessoa física capaz |
| `Procuração (PJ)` | empresa (razão social + representante legal) |
| `Procuração (Relativamente Incapaz)` | cliente assina junto com o assistente/representante |
| `Procuração (Absolutamente Incapaz)` | só o representante legal assina |
| `Procuração Consisa` | já preenchida pra Consisa (serve de exemplo de procuração PJ com 2 representantes) |
| `Declaração (PF)` / `Declaração (Relativamente Incapaz)` / `Declaração (Absolutamente Incapaz)` | declaração de hipossuficiência (justiça gratuita) |
| `Contrato (PF)` / `Contrato (PJ)` | honorários de serviço avulso (ação, defesa, serviço pontual) |
| `Contrato (PJ)_Elaboração de Documentos` | honorários pra elaboração de contrato/documento sob medida |
| `Contrato (PJ)_Assessoria Jurídica` | assessoria mensal consultiva e preventiva |
| `Contrato (PF)_INPI` / `Contrato (PJ)_INPI` | registro de marca e/ou desenho industrial no INPI, só administrativo (judicial, notificações extrajudiciais e recurso contra indeferimento orçados à parte). Apagar com `remover_linhas` a linha "Marca:" ou "Desenho industrial:" que não se aplicar. O pedido em si segue a skill `/inpi` |

Os nomes dos arquivos foram definidos pela Paula; se ela renomear de novo, atualizar esta tabela e os
nomes de saída no final do `gerar_modelos.py`.

Visual (já embutido nos modelos): cabeçalho e rodapé do Papel Timbrado, títulos em Borna terracota,
corpo em Inter, quadro de partes em duas colunas, Quadro Resumo com rótulos em bege, Condições Gerais
em duas colunas, **data em cima e assinatura centralizada embaixo** (dois signatários ficam lado a lado).

## Fluxo

### 1. Identificar cliente e destino

Descobrir o regime do cliente (ver AGENTS.md) e a pasta onde salvar. **Se não for óbvio, perguntar
antes de salvar.** Usar `Glob` com `*<nome>*` pra achar a pasta; se houver mais de um match, mostrar
as opções.

| Cliente | Documento | Pasta de destino (dentro de `3_Jurídico/`) |
|---|---|---|
| Assessoria mensal | Procuração, declaração, documentos societários | `4_Assessorias/[NN Cliente]/01_Credenciais_Societário/` |
| Assessoria mensal | Contrato de assessoria | `4_Assessorias/[NN Cliente]/02_Contrato_Assessoria/` |
| Assessoria mensal | Documento ligado a uma demanda | `4_Assessorias/[NN Cliente]/03_Demandas/#NNNN .../` (seguir a skill `/demandas` pra criar/registrar a demanda) |
| Esporádico PF | Serviço/consultivo | `1_Pessoa Física (PF)/1_Serviços/[Cliente]/` |
| Esporádico PF | Processo judicial | `1_Pessoa Física (PF)/2_Processos/[Cliente]/` |
| Esporádico PJ | Qualquer | `2_Pessoa Jurídica (PJ)/[Cliente ou "Serv NNNN - Cliente"]/` |

Se a pasta do cliente ainda não existir, confirmar com a Paula o nome antes de criar.

Nome do arquivo: `[Tipo do documento] - [Nome do cliente].docx`
(ex: `Procuração - Maria Aparecida da Silva.docx`, `Contrato de Honorários - Construtora Exemplo.docx`).
Nunca sobrescrever um arquivo existente sem autorização.

### 2. Levantar os dados

Buscar os dados do cliente antes de perguntar: contrato ou procuração já salvos na pasta dele,
cadastro no sistema de demandas (Supabase, via `/demandas`) ou o que a Paula colou na conversa.
Perguntar só o que faltar. Para contratos, confirmar objeto, valor, forma de pagamento e
vigência/prazo. Campos que ficarem sem informação continuam em branco (a Paula preenche à mão).

### 3. Preencher

Montar um JSON (UTF-8, gravado em arquivo, nunca inline no shell, pra não perder acentos) e rodar:

```bash
python .claude/skills/documento-cliente/scripts/preencher.py "<Modelo>" "<destino.docx>" dados.json
```

```json
{
  "campos": [["Nome:", "..."], ["CPF:", "..."], ["Estado civil:", "..."], ["Profissão:", "..."], ["Endereço:", "..."]],
  "substituir": {"NOME DO CLIENTE": "NOME EM MAIÚSCULAS",
                 "[Descrever o objeto do contrato.]": "..."},
  "data": "24 de setembro de 2026",
  "sem_poderes_especificos": true
}
```

- `campos`: rótulos exatamente como no modelo (`Nome:`, `CPF:`, `Estado civil:`, `Profissão:`,
  `Endereço:`, `Razão social:`, `CNPJ:`, `Rep. legal:`). Rótulos repetidos são preenchidos na ordem.
- `substituir`: placeholders entre colchetes e nomes das linhas de assinatura (`NOME DO CLIENTE`,
  `RAZÃO SOCIAL DA EMPRESA`, `NOME DO REPRESENTANTE LEGAL`, `[nome]`, `[nome do cliente]`,
  `[Nome / razão social do cliente]`, `[valor]`, `[valor por extenso]`, `[datas]` etc.).
- `data`: se omitida, a linha "Blumenau/SC, ____ de ____ de 20____" fica em branco pra preencher à mão.
- `sem_poderes_especificos`: remove o quadro de Poderes Específicos da procuração quando não houver.
- `remover_linhas`: lista de inícios de parágrafo a apagar (ex: `["Desenho industrial:"]` num contrato
  de INPI só de marca).

O script avisa rótulos/textos não encontrados e lista placeholders `[...]` que sobraram. Resolver todos
(ou confirmar com a Paula que ficam em branco) antes de entregar.

### 4. Conferir e entregar

```bash
python .claude/skills/documento-cliente/scripts/preview.py "<destino.docx>"
```

Gera PDF e PNG das páginas em `%TEMP%\preview-docs\` (fora da pasta do cliente). Olhar os PNGs:
nada cortado, número de páginas igual ao do modelo (procuração/declaração 1, Contrato PF/PJ 2,
Honorários 3, Assessoria 4). Se o texto preenchido for longo e empurrar pra outra página, avisar.

Informar à Paula o caminho do arquivo salvo. Se for de assessoria ligado a demanda, seguir o
restante do fluxo da `/demandas` (registro no sistema, link do SharePoint).

## Alterar os modelos ou criar um novo

Só quando a Paula pedir explicitamente pra mudar o **modelo** (não o documento de um cliente).
Os modelos são gerados pelo script `scripts/gerar_modelos.py` (conteúdo das cláusulas + layout):

1. Editar o texto/layout no `gerar_modelos.py`.
2. Gerar numa pasta temporária: `python scripts/gerar_modelos.py "%TEMP%\cred"` (o script se recusa
   a rodar sem pasta de saída).
3. Conferir com `python scripts/preview.py "%TEMP%\cred"` (todos os modelos, contagem de páginas).
4. Mostrar o resultado e, com aprovação, copiar só os arquivos alterados pra Credenciais.

Atenção no Windows: caminhos com mais de 260 caracteres falham ao salvar; usar `%TEMP%` curto.
Fontes Borna e Inter estão instaladas no computador da Paula; em outra máquina o Word substitui.
