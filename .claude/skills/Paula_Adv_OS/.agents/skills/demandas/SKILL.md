---
name: demandas
description: >
  Responde demandas consultivas de clientes de assessoria mensal (cadastrados no sistema próprio
  de demandas, Supabase), pesquisando legislação/jurisprudência quando necessário, e registra a
  demanda com a pasta correspondente no SharePoint da assessoria. Use quando o usuário pedir
  "registra essa demanda", "o cliente [de assessoria] perguntou", ou colar uma pergunta/mensagem
  de cliente de assessoria mensal pedindo orientação jurídica. Se o cliente for esporádico (PF/PJ
  avulso, não cadastrado no sistema), use a skill `/consultivo` em vez desta.
---

# /demandas — Demanda Consultiva (Assessoria Mensal)

Pra clientes esporádicos (não cadastrados no sistema, registro fica no Legal One), use a skill
`/consultivo` em vez desta.

## Dependências

- **Tom:** informal-profissional, direto, como a própria Paula conversando — ver
  `_contexto/preferencias.md`. Sem travessão.
- **Sistema de demandas:** Supabase (tabelas `clients`, `interactions`, `tasks`). Credenciais em
  `.env.local` na raiz do workspace (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`).
- **Script de registro:** `.claude/skills/demandas/scripts/registrar-demanda.js`
- **Tabela `tasks`:** não tem script próprio, inserir direto via REST do Supabase. Campo
  `assigned_to` é texto livre mas o formulário só reconhece exatamente `"Paula"` ou `"Thaís"`
  (ver `ASSIGNEES` em `src/lib/types.ts`) — qualquer outro valor (ex: `"paula"` minúsculo) fica
  sem responsável selecionado na tela, mesmo a coluna tendo um valor salvo.
- **Pasta da demanda:** o SharePoint das assessorias fica sincronizado localmente via OneDrive em
  `3_Jurídico/4_Assessorias/` (o MCP do Microsoft 365 só tem permissão de leitura, então a pasta é
  criada direto no caminho local sincronizado — o OneDrive sobe pro SharePoint sozinho).

## Como funciona

Cliente de assessoria mensal está cadastrado na tabela `clients` do Supabase, com um `folder_url`
apontando pra pasta dele no SharePoint (`.../4_Assessorias/NN Nome/`). Toda demanda nova vira uma
linha em `interactions`, que gera um número sequencial global (`number`). Esse número vira o nome
da pasta da demanda, sempre dentro de `03_Demandas`: `#0050`, `#0051`, etc.

Se o cliente não bater na busca do Supabase, ele provavelmente é esporádico — avisar a Paula e
seguir com a skill `/consultivo` a partir daí, não insistir tentando cadastrar.

Se a Paula confirmar que o cliente é de assessoria mensal mesmo sem estar cadastrado (cadastro
retroativo), criar o registro em `clients` com `name`, `folder_url` e `status`, e **sempre
preencher também o `document`** (CNPJ/CPF) — procurar em algum contrato já salvo na pasta do
cliente (quadro-resumo, cabeçalho) antes de deixar em branco ou perguntar à Paula.

## Workflow

### Fases 1-3 — Entender, pesquisar e redigir

Seguir `.claude/skills/_shared/intake-consultivo.md` (entender a demanda, pesquisar
legislação/jurisprudência, redigir a resposta) e o checkpoint de aprovação descrito lá. Só seguir
pra Fase 4 abaixo depois de aprovado.

### Fase 4 — Registrar a demanda

1. Confirmar com a Paula quem deve constar como `criadoPor` (ela ou a Thaís) e o `status`
   (`done` se a resposta já foi enviada, `pending` se ainda depende de algo)
2. Rodar o script (cwd = raiz do workspace `8_Claude`, ajustar `--env-file` conforme a distância
   até `.env.local`):

```bash
node --env-file=../../../.env.local .claude/skills/demandas/scripts/registrar-demanda.js '{
  "cliente": "Nome do Cliente",
  "canal": "whatsapp",
  "solicitadoPor": "Nome de quem perguntou",
  "titulo": "Título curto da demanda",
  "resumo": "Resumo da dúvida",
  "resposta": "Texto da resposta dada (ou vazio se pending)",
  "status": "done",
  "criadoPor": "paula",
  "tags": []
}'
```

3. Se o cliente não for encontrado (script retorna erro), avisar a Paula — é provavelmente um
   cliente esporádico, tratar com a skill `/consultivo` a partir daí.
4. Se a demanda gerar algum documento, e-mail ou imagem pra arquivar (parecer, termo, contrato
   etc.): com o `folderName` retornado (ex: `#0061`), localizar a pasta local do cliente em
   `3_Jurídico/4_Assessorias/` (usar `Glob` com padrão tipo `*<nome do cliente>*` a partir da raiz
   do workspace — de dentro de `Paula_Adv_OS` isso fica em
   `../../../../3_Jurídico/4_Assessorias/*<nome>*`). Se não achar exatamente um match, mostrar as
   opções encontradas e perguntar antes de criar a pasta.
   - Criar a pasta da demanda dentro de `03_Demandas` nesse caminho local, **sempre com um nome
     resumido ao lado do número** pra facilitar identificação no SharePoint (ex:
     `mkdir "<pasta do cliente>/03_Demandas/#0061 Notificação Menegildo Engenharia"`, nunca só
     `#0061`). Nunca usar tudo em letra maiúscula, exceto siglas (ex: `CND`, `NDA`, `RH`). Como é
     pasta sincronizada pelo OneDrive, não precisa de nenhuma chamada de API — o próprio OneDrive
     sobe pro SharePoint.
   - Salvar o documento/entregável direto dentro dessa pasta local recém-criada.
   - Buscar o link web da pasta recém-criada com `sharepoint_folder_search` (nome = número da
     demanda, ex: `"0061"`) e gravar esse `webUrl` no campo `links` da interação
     (`PATCH .../rest/v1/interactions?id=eq.<id>` com `{"links": ["<webUrl>"]}`), pra dar acesso
     direto à pasta a partir do sistema. O índice do SharePoint pode demorar bem mais que alguns
     segundos pra sincronizar uma pasta nova ou renomeada (às vezes minutos) — isso **não é
     opcional**, é só adiado: se não achar de primeira, não desistir nem seguir sem o link. Avisar
     a Paula que o link vai ser adicionado assim que sincronizar, e voltar a tentar depois (seja
     mais tarde na mesma sessão, seja no início da próxima interação sobre essa demanda) até
     conseguir gravar o `webUrl`.
   - Se a demanda **não** gerar nenhum documento (ex: resposta é só um texto de WhatsApp pra
     colar e mandar, sem anexo), pular esse passo inteiro — não criar pasta vazia.

### Fase 5 — Entregar

Confirmar o que foi feito:

> "Prontinho. Resposta registrada como demanda #00NN da assessoria. Aqui está o texto final pra
> você mandar pro cliente:"

## Regras

- Sempre incluir no título ou no resumo da demanda todos os nomes que alguém possa usar pra buscar
  depois: prestador/terceiro envolvido, e também o nome da obra/unidade/marca do cliente quando for
  diferente da razão social cadastrada (ex: cliente "Grupo Ao Cubo" mas a obra/operação é da
  "Blutech" — incluir os dois nomes)
- Nunca escrever no Supabase antes do checkpoint de aprovação da resposta
- Nunca inventar o `client_id` ou forçar um cliente que não bateu na busca — se a busca por nome
  encontrar mais de um resultado ou nenhum, parar e perguntar
- `criadoPor` é sempre perguntado caso a caso (não presumir que é sempre a Paula)
- Sem travessão, tom de conversa real (exceto se a resposta virar algo formal tipo parecer robusto,
  que ainda assim não é peça processual)
