---
name: checar-site
description: Checa a saúde do site paulacorrea.adv.br — se está no ar, se a API REST do WordPress responde, se o login do wp-admin carrega, se o arquivo .user.ini (correção de memory_limit) continua no lugar, e se teve erro fatal de PHP no log do servidor hoje. Use quando a Paula pedir "checa o site", "tá tudo ok no site?", "vê se o blog tá no ar", ou como checagem diária de rotina.
---

# /checar-site — Checagem de saúde do site

Roda uma checagem rápida (uns 10 segundos) do site `paulacorrea.adv.br`, sem precisar abrir nada
manualmente.

## Como rodar

```bash
node .claude/skills/checar-site/scripts/checar.js
```

O script usa `WORDPRESS_SITE_URL` do `.env.local` (raiz do workspace) e as credenciais do cPanel
(`CPANEL_URL`, `CPANEL_USERNAME`, `CPANEL_API_TOKEN`) pra ler o log de erros do servidor e conferir
o `.user.ini`.

## O que ele checa

1. **Site no ar** — homepage responde HTTP 200
2. **API REST do WordPress** — `/wp-json/wp/v2/posts` responde (usado pra publicar o blog)
3. **Login do wp-admin acessível** — `wp-login.php` carrega
4. **`.user.ini` com `memory_limit=512M`** — a correção definitiva do bug do Wordfence (ver memória
   `project_wordfence_bloqueia_post_api`) continua aplicada. Se sumir (ex: atualização do site
   sobrescreveu), o script detecta e avisa
5. **Erros fatais de PHP hoje** — lê `error_log` na raiz do site via API do cPanel e procura por
   `Fatal error` com a data de hoje. Erros de dias anteriores aparecem só como referência, não como
   falha

## Como interpretar o resultado

- Cada linha mostra `OK` ou `FALHA` — se tudo vier `OK`, não precisa fazer nada
- Se o `.user.ini` sumir, recriar com `memory_limit = 512M` via
  `Fileman/save_file_content` do cPanel (mesmo processo usado quando foi criado em 2026-09-24)
- Se tiver erro fatal hoje mesmo com o `.user.ini` no lugar, algo novo está causando o problema —
  investigar antes de assumir que é o Wordfence de novo
- Se o site ou a API não responderem, é mais urgente — avisar a Paula imediatamente, não só
  registrar

## Roda sozinha todo dia (via /iniciar)

A motivação original era "não sei quantos dias o blog ficou fora do ar sem eu perceber" — por isso
essa checagem roda automaticamente uma vez por dia como parte do `/iniciar` (início de cada sessão),
não precisa a Paula lembrar de pedir. Detalhes em `.claude/skills/iniciar/SKILL.md`, seção
"Checagem de saúde do site".

Cogitamos usar `/schedule` (rotina na nuvem) pra isso, mas descartamos: o agente na nuvem não tem
acesso ao `.env.local` nem às credenciais do cPanel, então as checagens de log de erro e do
`.user.ini` não funcionariam lá sem expor segredo no repositório do GitHub. Rodar local via
`/iniciar` resolve isso, já que aqui tem acesso a tudo.

O resultado de cada checagem fica salvo em `.last-check.json` (nessa mesma pasta), com a data e se
tudo veio OK — é assim que o `/iniciar` sabe se já rodou hoje.
