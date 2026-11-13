# Contrato na Régua Sob Medida

Assinatura mensal (piloto em nov/2026). O arquiteto envia a proposta comercial que mandou para o cliente
(PDF, Word, foto ou texto colado), a IA lê escopo, prazos e valores e preenche o contrato do
Contrato na Régua. O texto jurídico é sempre o do banco de cláusulas aprovado pela Paula: a IA só extrai
dados e escolhe etapas e opções. O que não cabe no banco volta como alerta de **revisão jurídica**.

## Dois públicos
- **Público geral (arquitetos):** usa o banco padrão (`../contrato-na-regua/conteudo/matriz.json`), sem
  personalização. Plano previsto: R$ 49,90 (Essencial) a R$ 79 (Completo) por mês.
- **Clientes de assessoria:** podem ter um banco próprio (modelos e cláusulas do escritório deles),
  gravado no KV em `m:<email>`. Só a mensalidade é cobrada.

## Como funciona
- `servidor/src/worker.js`: login por link mágico (Resend), sessão de 90 dias, acesso por e-mail no KV.
- `servidor/src/leitura.js`: chamada à API da Anthropic (modelo `claude-opus-5-5`, esforço `medium`,
  resposta em JSON com formato fixo montado a partir da matriz, catálogo em cache). Sem refusal
  fallback manual: usa `fallbacks: "default"`.
- `servidor/src/proposta.html`: passo "Proposta" injetado antes dos passos do app. Word (.docx) é lido
  no navegador (mammoth) e vai como texto; PDF e imagens vão como arquivo.
- `servidor/build.py`: monta `publico/app.html` **a partir do app do Contrato na Régua** (não é cópia).
  Mudança no app ou no `matriz.json` do Contrato na Régua vale aqui no próximo build + deploy.
- Limite de leituras por mês: `limite` no registro do assinante, senão `LIMITE_MENSAL` (15). Só conta
  leitura que deu certo. O preenchimento manual nunca é bloqueado.

## Custo da IA
Cerca de 5 mil tokens de instruções (em cache) + a proposta. Estimativa: US$ 0,05 a 0,15 por leitura
(R$ 0,30 a 0,90). Com 15 leituras/mês, uns R$ 9 por assinante no pior caso. O uso de tokens de cada
leitura sai no log do Worker (`wrangler pages deployment tail`).

## Publicar
```bash
cd servidor
python build.py
set -a; . ../../../.env; set +a      # CLOUDFLARE_API_TOKEN e CLOUDFLARE_ACCOUNT_ID
npx wrangler pages deploy --branch main --commit-dirty=true
```

## Segredos (`npx wrangler pages secret put NOME --project-name contrato-sob-medida`)
- `SESSION_SECRET`: assina o cookie.
- `RESEND_API_KEY`: chave só de envio, domínio `estruturalegal.com.br`.
- `ANTHROPIC_API_KEY`: chave da API da Anthropic (console.anthropic.com), de preferência num
  workspace próprio com limite de gasto mensal.
- `TESTE_TOKEN` (opcional): `POST /entrar` com header `x-teste` devolve o link na tela.

## Liberar acesso (piloto, manual)
KV `contrato-sob-medida`, chave `c:<email em minúsculas>`:
```json
{"nome":"Nome","ativo":true,"plano":"piloto","limite":15,"atualizado":"2026-11-13"}
```
Para tirar o acesso: `"ativo": false`. Sem terminal: dash.cloudflare.com → Storage & Databases → KV.

## Teste local
O simulador da Cloudflare (miniflare) falha com o caminho do OneDrive (acento em "Diretório"). Usar
`--persist-to` numa pasta sem acento, com o servidor parado ao gravar no KV:
```bash
npx wrangler kv key put --namespace-id bd76883af71d44d7a20175bc1e329c88 --local --persist-to C:/Users/user/AppData/Local/Temp/csmstate "c:teste@exemplo.com" '{"ativo":true,"limite":15}'
npx wrangler pages dev --port 8791 --persist-to C:/Users/user/AppData/Local/Temp/csmstate
```
`.dev.vars` com `SESSION_SECRET`, `TESTE_TOKEN` e (para a leitura real) `ANTHROPIC_API_KEY`.

## Próximos passos de conteúdo (Paula)
- Ampliar o banco para o Sob Medida se diferenciar do Contrato na Régua: reforma, consultoria avulsa,
  aditivo de escopo e distrato.
- Versão Engenheiro (execução/empreitada, ART, garantia do art. 618 do CC) depois do Arquiteto rodar.
