# Manual do Usuário — Sistema de Gestão Consultiva

Sistema interno da Paula Corrêa Advocacia para registro e acompanhamento de demandas consultivas e tarefas, organizadas por cliente.

---

## 0. Sobre o sistema e boas práticas de preenchimento

### Para que serve este sistema

Este sistema foi desenvolvido especificamente para o atendimento aos **clientes de assessoria jurídica mensal** (consultivo). Cada contato recebido — por WhatsApp, e-mail, ligação, reunião ou presencial — deve ser registrado como uma **demanda**, vinculada ao cliente correspondente.

O objetivo principal é criar um **histórico organizado e pesquisável** de tudo o que já foi tratado com cada cliente, evitando retrabalho e permitindo localizar rapidamente uma resposta ou orientação dada anteriormente.

### Por que preencher os campos com o máximo de detalhes possível

É muito comum que o cliente retorne meses depois sobre um assunto já tratado, mas **citando apenas uma referência específica** — o nome de um fornecedor, do condomínio, de um trabalhador, colaborador ou parceiro envolvido — e não o assunto jurídico em si.

Por isso, ao registrar uma demanda, **sempre que possível inclua no Título e/ou no Resumo**:
- Nome do **fornecedor** envolvido;
- Nome do **condomínio** (quando aplicável);
- Nome do **trabalhador/colaborador**;
- Nome do **parceiro/empresa parceira**;
- Qualquer outro nome próprio ou referência que o cliente possa usar para "lembrar" o caso.

Esses nomes são o que entra na busca por palavra-chave (campo "Buscar" na lista de Demandas e na tela "Buscar"). Quanto mais completas essas informações, mais fácil será localizar a demanda quando o cliente voltar a falar sobre o assunto — mesmo que ele não lembre a data ou os detalhes jurídicos, apenas o nome envolvido.

### Pasta de documentos vinculada à demanda

Sempre que uma demanda envolver **envio de documento ao cliente, análise de documento recebido do cliente, ou qualquer ajuste/minuta produzido**, é importante:

1. Criar (ou usar) uma **pasta dentro do repositório do cliente** (Drive/OneDrive), nomeada com o **número da demanda** (ex: `#0007 - Análise de contrato`);
2. Salvar nessa pasta os documentos enviados, recebidos e as versões ajustadas;
3. Incluir o **link dessa pasta** no campo **Links** da demanda (veja seção 5.2).

Isso garante que, ao consultar a demanda no futuro, seja possível acessar diretamente todo o histórico de documentos relacionado, sem precisar procurar manualmente nas pastas do cliente.

---

## 1. Login

**Tela:** "Assessoria Jurídica" — Acesse com sua conta da equipe.

| Campo | Tipo | Obrigatório |
|---|---|---|
| E-mail | texto (e-mail) | Sim |
| Senha | senha | Sim |

Botão **Entrar**. Em caso de erro (e-mail/senha inválidos), uma mensagem aparece acima do formulário.

---

## 2. Menu lateral

- **Painel** — tela inicial, visão geral de demandas e tarefas
- **Clientes** — lista e cadastro de clientes
- **Demandas** — lista de todas as demandas (atendimentos)
- **Tarefas** — lista de todas as tarefas
- **Buscar** — busca geral por demandas

No rodapé: e-mail do usuário logado e botão **Sair**.

---

## 3. Painel

Tela inicial, dividida em dois blocos: **Demandas** e **Tarefas**.

### Bloco Demandas
- Botão **+ Nova demanda** (abre o formulário de nova demanda)
- 4 cards com contagens (clique para ir à lista filtrada):
  - **Pendentes**
  - **Em andamento**
  - **Concluídas**
  - **Clientes ativos**
- Tabela **Demandas pendentes / em andamento**: até 20 demandas mais recentes, com colunas **#** (número), **Data**, **Cliente**, **Canal**, **Resumo** (título em destaque + resumo, clique abre a demanda para edição) e **Status**.
- Link **Ver todas as demandas** → tela Demandas.
- Se não houver nenhuma demanda pendente, aparece a mensagem "Nenhuma demanda pendente."

### Bloco Tarefas
- Botão **+ Nova tarefa**
- 3 cards com contagens:
  - **Tarefas pendentes**
  - **Tarefas em andamento**
  - **Tarefas concluídas**
- Tabela **Tarefas pendentes / em andamento**: até 20 tarefas, ordenadas por prazo (mais próximas primeiro; sem prazo aparecem por último), com colunas **Prazo**, **Cliente**, **Responsável**, **Tarefa** (título, clique abre para edição), **Descrição** e **Status** (pode ser alterado direto pelo botão de status, sem precisar abrir a tarefa).
- Ações na linha: **Editar** e **Excluir**.
- Link **Ver todas as tarefas** → tela Tarefas.
- Se não houver nenhuma tarefa pendente, aparece a mensagem "Nenhuma tarefa pendente."

---

## 4. Clientes

### 4.1 Lista de clientes
- Botão **+ Novo cliente**.
- Campo de busca: pesquisa por **nome** ou **CNPJ/CPF**.
- Lista de clientes (ordenada por nome), mostrando nome, documento (se houver) e a marcação **Inativo** quando o cliente está com status inativo.
- Clique no cliente abre a página de detalhe.

### 4.2 Cadastro / edição de cliente

| Campo | Tipo | Obrigatório | Observações |
|---|---|---|---|
| Nome / Razão Social | texto | **Sim** | |
| CNPJ / CPF | texto | Não | Formatação automática (000.000.000-00 ou 00.000.000/0000-00) |
| Pasta de documentos (link) | texto (URL) | Não | Link para a pasta do cliente no Drive/OneDrive — clicando em "Abrir pasta de documentos" na página do cliente, leva direto para lá |
| Contatos | repetível | Não | Cada contato tem: Nome, Telefone (formatação automática) e E-mail. Clique em **+ adicionar contato** para incluir mais de um |
| Observações | texto livre (várias linhas) | Não | |
| Status | seleção: **Ativo** / **Inativo** | — | Padrão: Ativo. Clientes inativos não aparecem nas listas de seleção ao criar novas demandas/tarefas |

Botão **Salvar**.

### 4.3 Página do cliente

Mostra:
- Nome e documento do cliente no topo.
- Botões **Editar** e **+ Nova demanda** (já abre a nova demanda vinculada a este cliente).
- **Contatos** cadastrados.
- **Documentos**: link para a pasta (se cadastrado) e observações.
- **Tarefas**: lista de tarefas do cliente (com botão **+ nova tarefa**, já vinculada a este cliente), mostrando título, descrição, prazo e responsável. É possível alternar o status, editar ou excluir direto daqui.
- **Histórico de demandas**: todas as demandas já registradas para este cliente, com número, data/hora, canal, solicitante, status, título, resumo, links e imagens anexadas, e tags.

---

## 5. Demandas

### 5.1 Lista de demandas
- Botão **+ Nova demanda**.
- Filtros por status: **Todas**, **Pendentes**, **Em andamento**, **Concluídas**.
- Campo de busca: pesquisa por palavra-chave no resumo, na resposta ou no nome do solicitante.
- Tabela com colunas **#**, **Data**, **Cliente**, **Canal**, **Resumo** (título + resumo resumido em até 3 linhas) e **Status**.
- Ações: **Editar** e **Excluir**.

### 5.2 Nova demanda

A tela mostra, no topo, o número que essa demanda vai receber ao ser salva (ex: **Demanda nº #0007**) — útil para já abrir/nomear a pasta de documentos com esse número antes de salvar.

**Campos do formulário:**

| Campo | Tipo | Obrigatório | Padrão |
|---|---|---|---|
| Cliente | seleção (lista de clientes ativos) | **Sim** | Nenhum selecionado |
| Data/Hora | data e hora | Não | Data/hora atual (horário de Brasília) |
| Canal | seleção: WhatsApp, E-mail, Ligação, Reunião, Presencial | Não | WhatsApp |
| Título | texto | **Sim** | — |
| Solicitado por | texto | Não | Nome de quem solicitou no cliente |
| Resumo da demanda | texto livre (várias linhas) | **Sim** | Aceita colar (Ctrl+V) ou arrastar imagens (prints de conversa, por ex.) |
| Resposta / resolução dada | texto livre (várias linhas) | Não | |
| Links | repetível | Não | Use **+ adicionar link** para incluir mais de um |
| Status | seleção: Pendente, Em andamento, Concluído | Não | Pendente |
| Tags | texto (separadas por vírgula) | Não | Ex: "trabalhista, contrato" |
| Tarefas para esta demanda | repetível (somente ao criar a demanda) | Não | Para cada tarefa: Título, Prazo e Responsável (Paula/Thaís). Use **+ adicionar tarefa** |

Botão **Salvar**.

> 💡 A área "Tarefas para esta demanda" pode aparecer recolhida, mostrando apenas o link **+ adicionar tarefa**. Clique nele para abrir os campos.

### 5.3 Editar demanda

Mesmos campos da criação (exceto Cliente, que fica fixo e não pode ser alterado, e a área de "Tarefas para esta demanda" na criação, que aqui é substituída pelo bloco abaixo).

**Tarefas desta demanda**: lista as tarefas já vinculadas a essa demanda (título, descrição, prazo, responsável), com opção de alternar status, editar ou excluir. Abaixo da lista, há um formulário rápido para adicionar nova tarefa diretamente (Título, Prazo, Responsável + botão **+ Adicionar**) — essas tarefas já ficam vinculadas automaticamente ao cliente e à demanda.

---

## 6. Tarefas

### 6.1 Lista de tarefas
- Botão **+ Nova tarefa**.
- Filtros por status: **Todas**, **Pendentes**, **Em andamento**, **Concluídas**.
- Filtros por responsável: **Todos os responsáveis**, **Paula**, **Thaís**.
- Campo de busca: pesquisa por título ou descrição da tarefa.
- Tabela com colunas **Prazo**, **Cliente**, **Responsável**, **Tarefa** (título), **Descrição** e **Status** (alterável direto na lista).
- Ações: **Editar** e **Excluir**.

### 6.2 Nova tarefa / Editar tarefa

| Campo | Tipo | Obrigatório | Padrão |
|---|---|---|---|
| Título | texto | **Sim** | — |
| Descrição | texto livre (2 linhas) | Não | |
| Prazo | data | Não | |
| Cliente (opcional) | seleção (lista de clientes ativos) | Não | — (sem cliente) |
| Responsável | seleção: —, Paula, Thaís | Não | — |
| Status | seleção: Pendente, Em andamento, Concluída | Não | Pendente |

Botão **Salvar**.

> A tela de "Nova tarefa" pode ser aberta já vinculada a um cliente, quando acessada pelo botão "+ nova tarefa" dentro da página do cliente.

---

## 7. Buscar

Tela "Buscar demandas":
- Campo de texto: busca por palavra-chave no resumo ou na resposta das demandas (também encontra pelo nome do cliente).
- Filtro de status: **Todos os status**, Pendente, Em andamento, Concluído.
- Botão **Buscar**.

Resultados (até 50): data/hora, cliente, canal, status, resumo e resposta (se houver).

---

## 8. Glossário de status e opções

**Status de demanda:**
- Pendente
- Em andamento
- Concluído

**Status de tarefa:**
- Pendente
- Em andamento
- Concluída

**Canais de demanda:**
- WhatsApp
- E-mail
- Ligação
- Reunião
- Presencial

**Responsável (tarefas):**
- Paula
- Thaís

**Status de cliente:**
- Ativo
- Inativo (não aparece para seleção em novas demandas/tarefas)

---

*Documento gerado a partir da versão atual do sistema. Sempre que novas telas ou campos forem adicionados, este manual deve ser atualizado.*
