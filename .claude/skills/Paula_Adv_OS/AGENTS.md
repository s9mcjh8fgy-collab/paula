# Paula Corrêa Advocacia — Claude Code OS

## O que é esse workspace
Espaço de trabalho da Paula Corrêa Advocacia pra apoiar o dia a dia jurídico: pareceres, análise de contratos, peças processuais, e o novo trabalho de conteúdo em redes sociais.

**Estrutura de pastas:**
- `consultivo/` — pareceres e respostas a dúvidas de clientes (WhatsApp, e-mail, mais simples)
- `contratos/` — análise de contratos e documentos
- `processual/` — peças processuais
- `inpi/` — painel central (`controle.md`) de todos os pedidos de marca e desenho industrial no INPI, de qualquer cliente. Os documentos de cada pedido ficam na pasta do cliente em `06_INPI/`, não aqui (ver skill `/inpi`)
- `conteudo/` — redes sociais e site, organizado por canal: `instagram/`, `tiktok/`, `site/`, `youtube/` (cada um com subpastas por tipo, ex: `carrossel/`, `reels/`, `blog/`), mais `casos/` (fonte de ideias) e `estrategia-retomada/` (plano de retomada das postagens)
- `propostas/[nome-cliente]/` — propostas comerciais em deck de slides (HTML → PDF), geradas pela skill `/proposta-comercial`
- `tarefas.md` — lista de pendências
- `templates/skills/` — templates de skills prontos pra personalizar com /mapear
- `templates/ferramentas/catalogo.md` — APIs e ferramentas disponíveis pra usar em skills

**Regra de arquivamento de documentos de cliente:** as pastas acima (exceto `conteudo/`) são espaço de rascunho e organização. Quando um documento for de um cliente específico e precisar ser arquivado definitivamente, salvar direto na pasta do cliente em `../3_Jurídico/1_Pessoa Física (PF)/` ou `../3_Jurídico/2_Pessoa Jurídica (PJ)/` (perguntar o nome do cliente se a pasta não for óbvia). O Legal One continua sendo o sistema oficial de registro processual — essas pastas complementam, não substituem.

## Sobre o negócio
Advocacia solo com uma assistente (Thaís, formada em Direito, auxilia em demandas de menor complexidade). Carteira mista de clientes PF e PJ. Atuação em consultivo, análise de contratos e peças processuais, com foco atual em crescer a carteira e estruturar redes sociais como canal de captação.

## O que mais fazemos aqui
- Pareceres e respostas consultivas a clientes (WhatsApp, e-mail)
- Análise de contratos e documentos
- Peças processuais
- Conteúdo pra redes sociais (posts, roteiros)
- Registro de marca e desenho industrial no INPI (ver skill `/inpi`)

## Clientes e contexto
Carteira mista de pessoas físicas e jurídicas, atendimento direto (não é agência).

Dois regimes de cliente, com fluxos de registro diferentes:
- **Assessoria mensal:** cadastrado no sistema próprio de demandas (Supabase). Cada demanda vira
  uma pasta numerada (`#00NN`) dentro de `03_Demandas` na pasta do cliente em
  `3_Jurídico/4_Assessorias/` no SharePoint.
- **Esporádico** (PF ou PJ avulso): registro processual/contratual fica no Legal One, não no
  sistema Supabase. Pasta local em `3_Jurídico/1_Pessoa Física (PF)/` ou `2_Pessoa Jurídica (PJ)/`.

## Tom de voz
Fora de peças processuais: linguagem simples e humana, como a própria Paula conversando com o cliente. Sem travessão.
Em peças processuais: formal, técnico, terceira pessoa.

## Ferramentas conectadas
- Legal One (Thomson Reuters) — sistema processual oficial
- WhatsApp Business
- Microsoft 365 (Outlook e afins) — conectado via MCP, só leitura no SharePoint (criação de pasta
  via API dá 403 e não tem permissão de escrita pra conceder). Contorno: o SharePoint das
  assessorias fica sincronizado localmente via OneDrive em `3_Jurídico/4_Assessorias/`, então
  pastas são criadas direto nesse caminho local (sem precisar de API)
- Sistema próprio de registro de demandas consultivas: https://paula-blush-rho.vercel.app/ (Supabase
  por trás — tabelas `clients`, `interactions`, `tasks`; credenciais em `.env.local` na raiz do
  workspace, usadas pela skill `/demandas`)
- Cloudflare Pages — publicação de relatórios estáticos (ex: relatórios de andamento do INPI), token e account ID em `.env`

## Financeiro
Controle financeiro do escritório fica em `1_Gestão/2_Financeiro/` (fora do `8_Claude`, caminho
relativo `../../../../1_Gestão/2_Financeiro/` a partir de `Paula_Adv_OS`). Extratos, notas fiscais
e faturas de cartão são organizados por mês em subpastas (`01 Janeiro 26`, `02 Fevereiro 26`...) e
mandados pra contabilidade todo mês (checklist em `05 Checklist malote.xlsx`).

**Uso do dia a dia (contas a pagar/receber, vencimentos):** app próprio
`financeiro-paula` (Cloudflare Worker + tabelas dedicadas no Supabase do sistema de demandas),
código em `1_Gestão/2_Financeiro/app-financeiro/`. Substituiu uma tentativa de painel em Excel que
não pegou bem. Tem dashboard, abas A Pagar/A Receber com navegação por mês, e recorrentes
(assessoria mensal ou parcelamento) que se geram sozinhos mês a mês. Detalhes completos de
arquitetura, deploy e regras de negócio na skill `/financeiro`.

**Controle gerencial de lucro** (fechamento mensal, histórico): três planilhas —
`01 Contas a Receber.xlsx` (receita, já existia), `03 Contas a Pagar.xlsx` (despesas por
categoria, recriado em 2026-09) e `08 Fechamento Mensal.xlsx` (Receita − Despesas = Lucro por mês,
novo). Ver skill `/financeiro`.

---

## Como este workspace é organizado (Claude Code e Codex)

- **Instruções:** `AGENTS.md` é a fonte (este arquivo). `CLAUDE.md` tem só `@AGENTS.md`. Nunca escrever conteúdo no `CLAUDE.md`.
- **Skills:** em `.claude/skills/<nome>/SKILL.md`. Pro Codex enxergar, existe `.agents/skills` apontando pra `.claude/skills` (criado pelo `/setup`, não vai pro git). No Windows a ponte é cópia: skill nova precisa de `/atualizar` pra re-sincronizar.

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (se existirem e estiverem configurados):

1. `_contexto/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_contexto/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_contexto/estrategia.md` — foco atual, prioridades, o que pode esperar
4. `_contexto/agora.md` — contexto vivo: onde paramos, decisões recentes, pendências (atualizado a cada sessão)

Usar essas informações como base pra qualquer resposta ou decisão. Ao sugerir prioridades, formatos ou abordagens, considerar o foco atual descrito em `estrategia.md`.

Para qualquer tarefa visual (carrossel, proposta, slide, landing page), consultar `marca/design-guide.md` como referência de estilo.

Não é necessário listar o que foi lido nem confirmar a leitura. Apenas usar o contexto naturalmente.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe uma skill relevante em `.claude/skills/` (Claude Code) ou `.agents/skills/` (Codex).
Se encontrar, seguir as instruções da skill.
Se não encontrar, executar a tarefa normalmente.

Ao concluir uma tarefa que não tinha skill mas parece repetível (o usuário provavelmente vai pedir de novo no futuro), perguntar:

> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

Não perguntar pra tarefas pontuais ou perguntas simples. Só quando o padrão de repetição for claro.

---

## Aprender com correções

Quando o usuário corrigir algo, melhorar uma resposta ou dar uma instrução que parece permanente (frases como "na verdade é assim", "não faça mais isso", "prefiro assim", "sempre que...", "evita...", "da próxima vez..."), perguntar:

> "Quer que eu salve isso pra não precisar repetir?"

Se sim, identificar onde faz mais sentido salvar:

- **Sobre o negócio** (quem são os clientes, como funciona a empresa, serviços, mercado) → adicionar em `_contexto/empresa.md`
- **Sobre preferências e estilo** (tom de voz, formato de resposta, o que evitar, como estruturar textos) → adicionar em `_contexto/preferencias.md`
- **Sobre prioridades e foco atual** (projetos em andamento, metas do momento, prazos importantes, o que é prioridade agora) → adicionar em `_contexto/estrategia.md`
- **Regra de comportamento nessa pasta** (onde salvar arquivos, como nomear, fluxos específicos) → adicionar no próprio `AGENTS.md`

Salvar com uma linha nova clara, sem reformatar o arquivo inteiro. Confirmar o que foi salvo mostrando a linha adicionada.

Não perguntar se a correção for óbvia de contexto imediato (ex: "na verdade o arquivo se chama X"). Só perguntar quando a informação tiver valor duradouro.

---

## Manter contexto atualizado

Ao terminar uma tarefa que mudou algo relevante no projeto (novo cliente, nova skill, mudança de foco, novo processo, ferramenta instalada, estrutura de pastas alterada), perguntar:

> "Isso mudou algo no teu contexto. Quer que eu atualize os arquivos de memória?"

Se sim, identificar o que precisa atualizar:

- **Novo cliente, serviço, ferramenta, equipe** → `_contexto/empresa.md`
- **Mudança de prioridade ou foco** → `_contexto/estrategia.md`
- **Correção de tom ou estilo** → `_contexto/preferencias.md`
- **Nova pasta, regra de organização, skill criada** → `AGENTS.md`
- **Mudança visual (cores, fontes, logo)** → `marca/design-guide.md`

Mostrar o que vai mudar antes de salvar. Não reformatar o arquivo inteiro, só adicionar ou editar a linha relevante.

**Quando NÃO perguntar:**
- Tarefas pontuais que não mudam o contexto (ex: escrever um email, criar um post avulso)
- Perguntas simples ou conversas sem ação
- Mudanças que já foram salvas pelo bloco "Aprender com correções"

**Dica:** se o usuário não sabe se algo mudou, rodar `/atualizar` faz uma varredura completa.

---

## Criação de skills

Quando o usuário pedir pra criar uma nova skill:

1. Verificar se existe um template relevante em `templates/skills/`. Se existir, usar como base e adaptar pro contexto do usuário
2. Perguntar: "Essa skill é específica pra esse projeto ou vai ser útil em qualquer projeto?"
   - Específica desse negócio → salvar em `.claude/skills/nome-da-skill/SKILL.md` (local)
   - Útil em qualquer projeto → salvar em `~/.claude/skills/nome-da-skill/SKILL.md` (global)
3. Ler `_contexto/empresa.md` e `_contexto/preferencias.md` pra calibrar o conteúdo da skill ao contexto do negócio
4. Se a skill precisar de arquivos de apoio (templates, referências, exemplos), criar dentro da pasta da skill
5. Seguir o fluxo da skill-creator nativa do Claude Code
