---
name: blog-post
description: >
  Escreve artigos de blog jurídico pra Paula Corrêa Advocacia, partindo de casos reais e
  anonimizados do escritório, dentro da linha editorial "Advocacia através dos meus casos".
  Foco no nicho de Advocacia da Construção Civil (arquitetos, engenheiros, construtoras,
  imobiliárias, administradoras de condomínio), mas aceita casos de outras áreas quando fizer
  sentido. Gera texto pronto pra colar no WordPress (título, meta descrição, corpo).
  Use quando o usuário pedir "escreve um post pro blog", "artigo de blog", "post do site",
  "transforma esse caso em artigo".
---

# /blog-post — Artigo de Blog Jurídico

## Dependências

- **Fonte de ideias:** `conteudo/casos/` — casos anonimizados do escritório
- **Contexto do negócio:** `_contexto/empresa.md` (posicionamento "Advocacia da Construção Civil")
- **Tom de voz:** `_contexto/preferencias.md`
- **Identidade visual (se precisar de capa):** `marca/design-guide.md`

## Linha editorial

Todo artigo parte de um caso ou situação real do escritório, **sempre anonimizado**: sem nome do
cliente, sem detalhes que permitam identificação (cidade, empresa, valores exatos, datas
específicas). O ângulo padrão é o nicho de Advocacia da Construção Civil (arquitetos, engenheiros,
empreiteiras, construtoras, imobiliárias, administradoras de condomínio), mas casos de outras áreas
(família, trabalhista, consumidor) também podem virar artigo quando fizer sentido pro negócio.

## Workflow

### Passo 1 — Encontrar o caso

Se o usuário já trouxe o caso/tema, seguir direto. Se não, checar `conteudo/casos/` por ideias
registradas e perguntar qual usar:

> "Achei esses casos registrados: [lista]. Quer usar algum, ou tem uma situação nova em mente?"

Se não houver nada em `conteudo/casos/` nem o usuário trouxer algo, perguntar:

> "Me conta rapidamente sobre o caso ou dúvida recorrente que você quer transformar em artigo
> (sempre sem identificar o cliente): o que aconteceu, e qual foi a orientação ou solução?"

### Passo 2 — Confirmar ângulo e público

Antes de escrever, confirmar numa mensagem só:

> "Antes de escrever, confirma:
> - O público principal desse artigo é [ex: síndicos/administradoras, construtoras, ou outro
>   público do nicho de construção civil]?
> - Quer que eu sugira um título com apelo de busca (SEO), ou já tem um título em mente?"

Se o usuário responder tudo de uma vez, não perguntar de novo.

### Passo 3 — Escrever o artigo

Estrutura do artigo:

1. **Título** — linguagem que o cliente ideal pesquisaria no Google, não juridiquês (ex: "Construtora
   pode ser processada por atraso na obra? Entenda seus direitos" em vez de "Da responsabilidade civil
   contratual na construção civil")
2. **Meta descrição** — 1-2 frases, até 160 caracteres, resumindo o artigo pra aparecer no Google
3. **Introdução** — conecta com uma dor ou dúvida real do leitor, situa o caso sem identificar ninguém
4. **Corpo** — explica a situação e o raciocínio jurídico de forma didática, como se estivesse
   explicando pra um cliente leigo. Pode citar lei/artigo quando relevante, mas sempre traduzindo o
   que significa na prática
5. **Seção prática** — "o que fazer nessa situação" ou "como se proteger": orientações objetivas e
   acionáveis
6. **CTA final** — convite pra falar com o escritório, sem ser insistente

**Regras de escrita:**
- Tom simples e humano, como a própria Paula explicando pro cliente — não parecer texto genérico de IA
- Sem travessão
- Sem cacoetes de IA: "em suma", "é importante ressaltar", "vale destacar", "no mundo atual"
- Frases curtas e diretas preferíveis a períodos longos
- Nunca inventar detalhes do caso que o usuário não forneceu

### Passo 4 — Mostrar e ajustar

Mostrar o artigo completo no chat (título, meta descrição, corpo) antes de salvar. Esperar aprovação
ou pedidos de ajuste.

### Passo 5 — Salvar

Salvar em `conteudo/site/blog/[slug-do-artigo].md`, com o título e meta descrição no topo do arquivo.

## Publicação

Ainda não há conexão automática com o WordPress.com (pendente autorização do conector — ver
`tarefas.md`). Por enquanto, entregar o artigo pronto pra Paula colar direto no editor do WordPress.

> Quando o MCP do WordPress.com estiver conectado, esta skill passa a poder publicar o artigo
> direto como rascunho ou publicado, sem precisar copiar e colar.
