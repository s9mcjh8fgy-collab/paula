---
name: peca-processual
description: >
  Redige o corpo de peças processuais (iniciais, contestações, recursos, peças intermediárias)
  pra Paula Corrêa Advocacia, seguindo a estrutura e formatação padrão do escritório.
  Use quando o usuário pedir "redige uma peça", "faz uma petição", "escreve uma contestação",
  "faz um recurso", "peça processual", ou pedir pra transformar fatos de um caso numa peça.
---

# /peca-processual — Redação de Peça Processual

## Dependências

- **Estrutura e formatação padrão:** `processual/estrutura-pecas.md` — ler sempre antes de escrever
- **Tom:** formal, técnico, terceira pessoa (peças processuais são a exceção ao tom informal do
  restante do escritório — ver `_contexto/preferencias.md`)

## Workflow

### Fase 1 — Entender o caso e analisar a tese

Perguntar (numa mensagem só, se possível):

> "Pra montar a peça, me conta:
> - Que tipo de peça é (inicial, contestação, recurso, peça intermediária, outra)?
> - Qual a comarca/vara (se já souber)?
> - Quem são as partes (autor/requerente e réu/requerido)?
> - É o primeiro peticionamento nesse processo, ou já tem coisas peticionadas antes?
> - Me conta os fatos do caso e o que você quer pedir"

Se o usuário já trouxer tudo isso de uma vez, não perguntar de novo — só confirmar o que faltou.

Com os fatos em mãos, mapear a tese antes de pesquisar ou escrever:
- Qual o fundamento jurídico central do pedido
- Quais dispositivos legais se aplicam
- Pontos fortes e pontos fracos do caso (o que pode ser contestado pela outra parte)

### Fase 2 — Pesquisa de jurisprudência

Buscar julgados recentes (via WebSearch) que sustentem a tese mapeada, priorizando o tribunal
competente pro caso (TJSC como padrão, salvo se a comarca indicar outro tribunal). Trazer 2-4
julgados relevantes com ementa resumida — não citar "conforme jurisprudência" sem apoio concreto.
Se não encontrar julgado forte, ser honesta sobre isso em vez de forçar uma citação fraca.

### Checkpoint — Apresentar a estratégia

Antes de redigir, mostrar:

> **Tese central:** [a linha de argumentação]
> **Fundamentos legais:** [dispositivos aplicáveis]
> **Jurisprudência encontrada:** [2-4 julgados com ementa resumida]
> **Pedidos que pretendo formular:** [lista]
>
> Essa estratégia faz sentido, ou quer ajustar algo antes de eu escrever o texto?

Esperar aprovação. Se o usuário pedir ajuste na tese ou nos pedidos, refazer o mapeamento antes de
seguir. Só escrever o corpo depois de aprovado.

### Fase 3 — Redigir o corpo

Ler `processual/estrutura-pecas.md` pra aplicar:
- Formato do endereçamento (sem "processo em epígrafe")
- Regra de pedir intimação em nome da Paula, se for o primeiro peticionamento no processo
- Regras de formatação (fonte Inter 11, espaçamento 1,5, recuo de primeira linha 3cm exceto
  endereçamento, 1 linha entre parágrafos sem espaçamento extra)

Estrutura do corpo (adaptar conforme o tipo de peça):
1. Endereçamento
2. Qualificação das partes
3. Dos fatos — narrativa objetiva e cronológica do caso
4. Do direito — fundamentação jurídica e jurisprudência aprovadas no checkpoint
5. Dos pedidos — claros, numerados, sem ambiguidade
6. Pedido de intimações em nome da Paula (só no primeiro peticionamento do processo)
7. Fecho (valor da causa, local e data, se aplicável) + assinatura

**Regras de escrita:**
- Terceira pessoa, tom formal e técnico
- Nunca inventar fatos, valores, documentos ou julgados que não foram confirmados
- Se faltar informação essencial pra fundamentar um pedido, perguntar antes de escrever, não
  preencher com genérico

### Fase 4 — Mostrar e ajustar

Mostrar o texto completo no chat antes de salvar. Esperar aprovação ou pedidos de ajuste.

### Fase 5 — Montar o .docx final

O modelo oficial de papel timbrado está em `processual/Papel Timbrado.docx` (cabeçalho, rodapé,
margens e fonte já configurados, corpo em branco). Sempre partir desse arquivo como base pra peça
nova, nunca de uma peça antiga de cliente.

1. Copiar `processual/Papel Timbrado.docx` pra um novo arquivo (nome sugerido:
   `processual/[nome-do-caso]-[tipo-de-peça].docx`)
2. Usar a skill nativa `/docx` pra inserir o texto do corpo nesse arquivo, aplicando fonte Inter 11,
   espaçamento 1,5, recuo de primeira linha 3cm (exceto endereçamento) e 1 linha entre parágrafos sem
   espaçamento extra
3. Mostrar o resultado pro usuário aprovar

Depois de aprovada, a peça final vai pra pasta do cliente em `3_Jurídico/` (perguntar o nome do
cliente se a pasta não for óbvia).

## Regras

- Sem travessão
- Seguir sempre `processual/estrutura-pecas.md` como fonte de verdade da estrutura e formatação
- Peças intermediárias variam mais conforme o andamento processual — perguntar contexto específico
  quando o tipo não for claro
