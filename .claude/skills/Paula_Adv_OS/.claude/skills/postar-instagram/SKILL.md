---
name: postar-instagram
description: Publica de verdade no Instagram (@paulacorrea.adv) um carrossel, post fixo (imagem única) ou conto já produzido pela skill /carrossel. Usa a API oficial do Instagram (Graph API), reaproveitando o token já configurado na skill meta-ads-ratos. Use quando a Paula pedir "posta isso", "publica no Instagram", "sobe esse carrossel", ou depois de aprovar um carrossel/post fixo e perguntar se pode ir ao ar. Também dispara com /postar-instagram.
---

# /postar-instagram — Publicação direta no Instagram

Publica um post já pronto (carrossel ou imagem única, com `carousel-text.md` na pasta) direto no
feed do Instagram @paulacorrea.adv, sem precisar abrir o app.

## Como funciona

Usa a Graph API do Instagram (Meta), reaproveitando as credenciais já configuradas em
`.claude/skills/meta-ads-ratos/.env` (`META_ADS_TOKEN`, token de system user, sem expiração, já com
as permissões `instagram_basic` e `instagram_content_publish`) e o `instagram_id` da conta "paula" em
`.claude/skills/meta-ads-ratos/contas.yaml`.

Como a Graph API só aceita imagem por URL pública (não aceita upload direto de arquivo local), as
imagens são publicadas antes num projeto do Cloudflare Pages (`paula-ig-media`, reaproveitando
`CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` do `.env` na raiz do workspace) só pra servir de fonte
temporária — depois que o Instagram baixa e processa a imagem, não depende mais dessa URL.

## Fluxo — SEMPRE em dois passos, nunca um só

**Passo 1 — Preparar (não publica nada ainda):**
```bash
node .claude/skills/postar-instagram/scripts/preparar.js "conteudo/instagram/carrossel/[tema]"
```
Isso hospeda as imagens, cria os containers de mídia na Graph API (carrossel ou imagem única) e para
antes de publicar. Mostra a legenda completa e o número de imagens no terminal, e salva o estado em
`.publish-state.json` dentro da pasta do post.

**Mostrar pro usuário:** depois de rodar `preparar.js`, sempre mostrar a legenda completa e confirmar
quantas imagens vão no post, igual a uma revisão final antes de publicar de verdade.

**Passo 2 — Confirmar (publica de verdade, ação pública e irreversível):**
```bash
node .claude/skills/postar-instagram/scripts/confirmar.js "conteudo/instagram/carrossel/[tema]"
```

## Regra de segurança — NUNCA PULAR

**NUNCA rodar `confirmar.js` sem a Paula ter dito explicitamente, na mesma conversa, depois de ver a
prévia (legenda + imagens) do `preparar.js`, algo como "pode postar", "sim, publica", "tá aprovado".**
Publicar no Instagram é uma ação pública e praticamente impossível de desfazer sem deixar rastro
(apagar um post depois de publicado é visível pra quem já viu, e reposta com edição perde
curtidas/comentários). Rodar `preparar.js` sozinho é seguro e pode ser feito proativamente (não
publica nada), mas `confirmar.js` exige aprovação explícita sempre, mesmo que a Paula já tenha
aprovado o carrossel em si numa etapa anterior — aprovar o conteúdo não é a mesma coisa que aprovar
o "postar agora".

Se o post já foi publicado antes (checar se `.publish-state.json` tem `publishedAt` preenchido), não
publicar de novo — avisar a Paula.

## Pré-requisitos da pasta

A pasta do post precisa ter:
- `carousel-text.md` com uma seção `## Legenda Instagram` (o texto exato que vira a legenda do post)
- `slide-01.png`, `slide-02.png`, etc. (ordem alfabética = ordem no carrossel). Se só tiver
  `slide-01.png`, publica como imagem única (post fixo), não como carrossel.

Isso é exatamente o que a skill `/carrossel` já gera, então o fluxo normal é: `/carrossel` → revisar
→ `/postar-instagram`.

## Erros comuns

- **Token expirado ou sem permissão:** o token é de system user e não expira, mas se a Meta revogar
  ou o app sair do modo Live, a chamada falha com erro da Graph API — mostrar o erro pra Paula, não
  tentar contornar sozinho.
- **Imagem não processa (status ERROR):** geralmente a URL do Cloudflare Pages não ficou acessível a
  tempo (propagação) ou a imagem é grande demais/formato errado. Tentar rodar `preparar.js` de novo.
- **Legenda não encontrada:** o `carousel-text.md` precisa ter a seção `## Legenda Instagram`
  exatamente com esse título. Se não tiver, avisar em vez de inventar uma legenda.
