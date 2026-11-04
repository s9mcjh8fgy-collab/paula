# Contrato na Régua: servidor

Cloudflare Pages (projeto `contrato-na-regua`, modo avançado com `publico/_worker.js`).
Endereço provisório: https://contrato-na-regua.pages.dev. Definitivo: `app.estruturalegal.com.br`
(CNAME no Registro.br apontando para `contrato-na-regua.pages.dev`).

## Como funciona
- A Hotmart chama `POST /api/hotmart` a cada compra, reembolso, chargeback ou cancelamento. O header
  `X-HOTMART-HOTTOK` precisa bater com o segredo `HOTMART_HOTTOK`.
- O comprador digita o e-mail da compra em `/` e recebe um link mágico (Resend), válido por 30 min e
  de uso único. O link abre uma página com botão "Entrar", para os antivírus de e-mail não gastarem o link.
- A sessão é um cookie assinado de 90 dias. A cada acesso o servidor confere se a compra continua
  ativa: reembolso derruba o acesso na hora.
- O texto do contrato (`conteudo/matriz.json`) vai embutido no Worker e só sai por `/api/matriz` com
  sessão válida. Nunca fica em `publico/`.
- O menu "Como usar" abre o guia (`/guia.pdf`, só com sessão válida) e o vídeo da página de vendas.
- O formulário "Precisa de outro formato de contrato?" (`src/extras.html`) chama `POST /api/contato`,
  só com sessão válida, e manda os dados por e-mail para `EMAIL_REPLY_TO`. Não grava os dados no KV.
  A tela promete retorno em até 24 horas.

## Publicar uma mudança
```bash
python build.py                      # regera publico/app.html a partir de app/index.src.html
set -a; . ../../../.env; set +a      # CLOUDFLARE_API_TOKEN e CLOUDFLARE_ACCOUNT_ID
npx wrangler pages deploy --branch main --commit-dirty=true
```
Mudança no `matriz.json` também exige novo deploy, porque ele vai embutido no Worker.

## Segredos (`npx wrangler pages secret put NOME --project-name contrato-na-regua`)
- `SESSION_SECRET`: assina o cookie. Trocar derruba todas as sessões (todo mundo entra de novo).
- `HOTMART_HOTTOK`: hottok da conta Hotmart, cópia em `Paula_Adv_OS/.env` (`CNR_HOTTOK`). Produto 8883953.
- `RESEND_API_KEY`: chave só de envio, restrita ao domínio `estruturalegal.com.br`. Sem ela, o pedido
  de link responde "envio indisponível".
- `TESTE_TOKEN`: cópia em `Paula_Adv_OS/.env` (`CNR_TESTE_TOKEN`). `POST /entrar` com o header
  `x-teste: <token>` devolve o link na tela em vez de mandar e-mail.

## Conta de revisão
Desligada em 04/11/2026: o formato eBook não exige login para a revisão da Hotmart. A conta, a entrada
com senha, a var `REVISAO_EMAIL` e o segredo `REVISAO_SENHA` foram removidos.

## Liberar acesso manual (cortesia, Miriam, testes)
Gravar no KV `contrato-na-regua` (id `154a1427e9d245f0b775708787086dd9`) a chave `c:<email em minúsculas>`:
```json
{"nome":"Nome","transacoes":{"cortesia":"ativo"},"atualizado":"2026-10-27T00:00:00Z"}
```
Para tirar o acesso, trocar `"ativo"` por `"bloqueado:manual"` ou apagar a chave.

Sem terminal: dash.cloudflare.com → Storage & Databases → KV → `contrato-na-regua` → Add entry, com a
mesma chave e o mesmo valor. Não mexer nas chaves `t:` (links de login) e `r:` (trava de reenvio),
que expiram sozinhas.
