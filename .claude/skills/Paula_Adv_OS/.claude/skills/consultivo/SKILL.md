---
name: consultivo
description: >
  Responde demandas consultivas de clientes esporádicos (PF ou PJ avulso, sem contrato de
  assessoria mensal — registro processual/contratual fica no Legal One, não no sistema próprio),
  pesquisando legislação/jurisprudência quando necessário. Use quando o usuário pedir "responde
  essa dúvida", "faz um parecer rápido", ou colar uma pergunta/mensagem de cliente esporádico
  pedindo orientação jurídica. Se o cliente for de assessoria mensal (cadastrado no sistema
  próprio de demandas), use a skill `/demandas` em vez desta.
---

# /consultivo — Demanda Consultiva (Cliente Esporádico)

Pra clientes de assessoria mensal (cadastrados no sistema próprio de demandas, Supabase), use a
skill `/demandas` em vez desta.

## Dependências

- **Tom:** informal-profissional, direto, como a própria Paula conversando — ver
  `_contexto/preferencias.md`. Sem travessão.
- **Registro:** cliente esporádico (PF ou PJ avulso, sem contrato de assessoria) não está
  cadastrado no Supabase. O registro processual/contratual dele fica no Legal One, não nesse
  sistema. **Não dá pra automatizar o cadastro** — a Paula informa direto a pasta onde salvar
  (geralmente dentro da pasta do cliente em `3_Jurídico/1_Pessoa Física (PF)/` ou
  `2_Pessoa Jurídica (PJ)/`), e a skill só produz o entregável.

Se não tiver certeza se o cliente é esporádico ou de assessoria mensal, perguntar antes de
seguir (ou tentar a skill `/demandas` primeiro — se o cliente não bater na busca do Supabase, é
esporádico).

## Workflow

### Fases 1-3 — Entender, pesquisar e redigir

Seguir `.claude/skills/_shared/intake-consultivo.md` (entender a demanda, pesquisar
legislação/jurisprudência, redigir a resposta) e o checkpoint de aprovação descrito lá. Só seguir
pra Fase 4 abaixo depois de aprovado.

### Fase 4 — Salvar o entregável

Perguntar a pasta onde salvar o entregável, se ainda não souber (normalmente dentro da pasta do
cliente em `3_Jurídico/1_Pessoa Física (PF)/` ou `2_Pessoa Jurídica (PJ)/`, ou onde a Paula
indicar). Salvar o entregável lá. Não tentar registrar em nenhum sistema.

### Fase 5 — Entregar

Confirmar o que foi feito:

> "Prontinho. Resposta salva na pasta X. Aqui está o texto final pra você mandar pro cliente:"

## Regras

- Linguagem simples e humana, sem travessão
- Nunca inventar fundamento legal ou fato não confirmado — se faltar informação, perguntar antes
- Se citar jurisprudência, trazer julgado real (via pesquisa da Fase 2), não genérico
