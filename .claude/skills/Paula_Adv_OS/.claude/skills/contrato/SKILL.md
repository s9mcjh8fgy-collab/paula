---
name: contrato
description: >
  Elabora contratos novos (a partir de modelos existentes, combinando cláusulas de outros contratos
  e redigindo cláusulas específicas pro caso) ou analisa contratos de terceiros (identificando
  riscos e decidindo entre editar direto, comentar cláusula por cláusula, ou escrever parecer geral)
  pra Paula Corrêa Advocacia. Use quando o usuário pedir "faz um contrato", "elabora um contrato",
  "analisa esse contrato", "revisa esse contrato", "dá um parecer sobre esse contrato".
---

# /contrato — Elaboração e Análise de Contratos

## Dependências

- **Estrutura padrão:** `contratos/estrutura-contratos.md` — ler sempre antes de elaborar ou
  analisar um contrato (quadro-resumo, lista de cláusulas típicas, disposições gerais recorrentes,
  bloco de assinatura)
- **Modelos existentes:** pastas `05_Modelos` dentro de cada cliente em
  `3_Jurídico/4_Assessorias/[cliente]/05_Modelos/`, e modelos gerais em
  `3_Jurídico/4_Assessorias/00.1 Modelos_pastas/05_Modelos/`
- **Tom:** formal, técnico (mesmo padrão de peças processuais)

## Passo 1 — Identificar o tipo de pedido

- **Elaboração:** o usuário quer um contrato novo → seguir o fluxo de Elaboração
- **Análise:** o usuário trouxe um contrato de terceiro pra revisar → seguir o fluxo de Análise

Se não estiver claro, perguntar.

---

## Fluxo de Elaboração

### 1. Entender a necessidade

Perguntar:

> "Me conta:
> - Que tipo de contrato é (prestação de serviço, locação, parceria, aditivo, etc.)?
> - Quem são as partes?
> - O que tem de específico nesse caso? (é isso que muda o contrato de padrão pra sob medida)"

### 2. Buscar modelo base

Procurar nas pastas de modelos (cliente específico primeiro, depois modelos gerais) o contrato mais
próximo do tipo pedido. Se o cliente já tiver histórico de contratos semelhantes, priorizar isso.

### 3. Sugerir cláusulas complementares

Identificar em outros modelos (mesmo segmento, ou tipo de cláusula relevante pro ponto específico
do caso) o que pode ser aproveitado. Ex: se o contrato é de prestação de serviço mas tem um ponto de
uso de equipamento, buscar cláusula de locação de equipamento em outro modelo.

### Checkpoint — Antes de montar o texto final

Apresentar:

> **Modelo base:** [qual modelo, de onde]
> **Cláusulas complementares sugeridas:** [lista, com origem de cada uma]
> **Pontos que vão precisar de cláusula específica nova:** [lista]
>
> Isso cobre o caso, ou falta/sobra algo?

Esperar aprovação antes de escrever o contrato completo.

### 4. Montar o contrato

Estrutura padrão do escritório: **quadro resumo** (dados variáveis: partes, valores, prazos, objeto)
+ **condições gerais** (cláusulas fixas e as específicas aprovadas no checkpoint).

Escrever as cláusulas específicas novas com base no que o usuário descreveu, sem inventar termos ou
condições que não foram confirmados.

### 5. Mostrar e ajustar

Mostrar o texto completo (quadro resumo + condições gerais) antes de salvar.

### 6. Entregar

Salvar rascunho em `contratos/[nome-do-caso]-contrato.md`. Depois de aprovado, usar a skill nativa
`/docx` pra montar o `.docx` final. A versão final vai pra pasta do cliente em `3_Jurídico/`
(perguntar o nome se não for óbvio) — se for cliente de assessoria continuada, considerar salvar
também em `05_Modelos/` do cliente pra reaproveitar no futuro.

---

## Fluxo de Análise

### 1. Ler o contrato

O usuário fornece o arquivo ou cola o texto. Ler o contrato completo antes de opinar.

### 2. Avaliar riscos

Mapear, cláusula por cláusula quando necessário:
- Cláusulas abusivas ou desequilibradas entre as partes
- Ambiguidades ou lacunas (o que devia estar e não está: rescisão, multa, prazo, garantias, foro)
- Pontos que desfavorecem o cliente da Paula especificamente

### 3. Classificar a gravidade e propor o caminho

Com base no volume e na gravidade dos problemas encontrados, propor um dos três caminhos (a decisão
final é da Paula):

- **Poucas adaptações necessárias** → editar direto no contrato (usar `/docx` pra aplicar as
  alterações no próprio arquivo)
- **Mudanças moderadas a drásticas** → gerar comentários cláusula por cláusula, apontando o problema
  e a sugestão de ajuste em cada uma (usar comentários do `/docx` ou uma lista organizada por
  cláusula, o que for mais prático pro caso)
- **Contrato estruturalmente ruim** → escrever um parecer geral à parte, explicando os problemas de
  fundo e a recomendação (renegociar, recusar, ou revisar por completo)

Apresentar a avaliação e o caminho sugerido antes de executar:

> "Analisei o contrato. Encontrei [resumo dos principais problemas]. Pela gravidade, sugiro
> [caminho]. Concorda, ou prefere outro caminho?"

### 4. Executar

Seguir o caminho aprovado. Mostrar o resultado antes de salvar.

### 5. Entregar

Salvar em `contratos/[nome-do-caso]-analise.md` (comentários/parecer) ou o `.docx` editado. Versão
final vai pra pasta do cliente em `3_Jurídico/`.

---

## Regras

- Sem travessão
- Nunca inventar cláusulas, valores ou condições que o usuário não confirmou
- Sempre mostrar o plano (modelo base + complementares, ou avaliação + caminho sugerido) antes de
  produzir o texto completo
- Se o caso for simples e não precisar de combinação de modelos, pode pular direto pro checkpoint
  reduzido ("uso o modelo X direto, só ajusto o quadro resumo — ok?")
