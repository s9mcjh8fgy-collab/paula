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

**Extensão mínima: 800-1.500 palavras.** Textos mais curtos que isso tendem a não satisfazer a
intenção de busca de palavras-chave de cauda longa (o padrão que a Paula usa, tipo "distrato imóvel
na planta" ou "atraso de obra responsabilidade") e ficam abaixo do que o Google espera de conteúdo
jurídico (YMYL — assunto que afeta dinheiro/vida das pessoas, barra de profundidade mais alta).
Isso não é sobre encher linguiça: é sobre esgotar o assunto de verdade. Quantidade sem profundidade
não ajuda ninguém a rankear.

Estrutura do artigo:

1. **Título** — linguagem que o cliente ideal pesquisaria no Google, não juridiquês (ex: "Construtora
   pode ser processada por atraso na obra? Entenda seus direitos" em vez de "Da responsabilidade civil
   contratual na construção civil")
2. **Meta descrição** — 1-2 frases, até 160 caracteres, resumindo o artigo pra aparecer no Google
3. **Introdução** — conecta com uma dor ou dúvida real do leitor, situa o caso sem identificar ninguém
4. **Corpo** — explica a situação e o raciocínio jurídico de forma didática, como se estivesse
   explicando pra um cliente leigo. Pode citar lei/artigo quando relevante, mas sempre traduzindo o
   que significa na prática. Dividir em subtítulos (H4), cobrindo os diferentes ângulos do tema (ex:
   "quando X" / "quando Y" / prazo / exceções), não só um bloco corrido
5. **Exemplo prático ou numérico** (quando o tema render números, prazos ou percentuais — contratos,
   multas, indenização, retenção de valores etc.): um cenário concreto com valores hipotéticos,
   mostrando como a regra se aplica na prática. Isso é o que mais separa um artigo raso de um com
   substância
6. **Perguntas frequentes** (3-5 perguntas curtas, formato pergunta em negrito + resposta direta
   logo abaixo): cobre dúvidas laterais que não couberam no corpo principal, sem precisar forçar
   mais um parágrafo corrido. Ajuda tanto o leitor quanto o SEO (Google gosta de conteúdo em
   formato de pergunta e resposta)
7. **Bloco "Leia também"** no meio ou perto do fim do post, linkando pro pilar relacionado (ver
   `conteudo/estrategia-retomada/calendario-blog.md` pra saber qual pilar), no formato:
   `<h5><strong>Leia também:</strong> <a href="[url]">[título do pilar]</a></h5>`
8. **CTA final de engajamento** — nunca captação direta ("fale com nossos especialistas", "me
   procure", "manda mensagem"). Sempre convite pra comentar/compartilhar a experiência (ver
   `feedback_cta_oab_etica`)

**Regras de escrita:**
- Tom simples e humano, como a própria Paula explicando pro cliente — não parecer texto genérico de IA
- Sem travessão
- Sem cacoetes de IA: "em suma", "é importante ressaltar", "vale destacar", "no mundo atual"
- Frases curtas e diretas preferíveis a períodos longos
- Nunca inventar detalhes do caso que o usuário não forneceu

### Passo 4 — Mostrar e ajustar

Mostrar o artigo completo no chat (título, meta descrição, frase-gancho da capa, corpo) antes de
publicar. Esperar aprovação ou pedidos de ajuste — nunca publicar (nem como rascunho) sem essa
aprovação.

### Passo 5 — Publicar

A skill publica direto no WordPress via API REST (`WORDPRESS_SITE_URL`, `WORDPRESS_USERNAME`,
`WORDPRESS_APP_PASSWORD` em `.env.local`), sem precisar copiar e colar. Fluxo:

1. Criar o post como **rascunho** (`status: draft`) via `POST /wp-json/wp/v2/posts`, com título,
   `content` (HTML) e `excerpt` (a meta descrição — também setar como
   `meta._yoast_wpseo_metadesc` pro Yoast SEO)
2. Criar as tags direto via `POST /wp-json/wp/v2/tags` (**nunca usar `GET ?search=`** — esse
   endpoint especificamente dispara o Fatal error do Wordfence quase toda vez, ver memória
   `project_wordfence_bloqueia_post_api`). Se a tag já existir, a API retorna erro de duplicata
   ("term_exists") com o `id` da tag existente dentro do erro — usar esse id em vez de tratar como
   falha. Depois, associar as tags ao post (`POST /wp-json/wp/v2/posts/{id}` com `tags: [ids]`)
3. Gerar a capa: HTML simples (fundo sólido da marca, frase-gancho curta e diferente do título,
   renderizado via Playwright em 1200x630), subir como mídia (`POST /wp-json/wp/v2/media`) e setar
   como `featured_media` do post
4. Mostrar o link de edição (`{site}/wp-admin/post.php?post={id}&action=edit`) pra Paula revisar o
   rascunho de verdade no WordPress antes de aprovar
5. Só depois da aprovação explícita, mudar o status pra `publish` (`POST` com `status: publish`)

**Se a API retornar HTML em vez de JSON** (geralmente um `Fatal error` de memória do PHP em
`wp-content/wflogs/rules.php`): é um problema conhecido do Wordfence nesse site, não um bug da
skill. Ver memória `project_wordfence_bloqueia_post_api` pra diagnóstico e correção — não é pra
tentar contornar escrevendo menos conteúdo ou mudando a chamada.
