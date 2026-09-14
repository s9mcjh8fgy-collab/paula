---
name: search-console
description: Consulta a API do Google Search Console do site paulacorrea.adv.br para relatorio de SEO (cliques, impressoes, CTR, posicao media, paginas e buscas com melhor desempenho). Use quando o usuario pedir "relatorio do search console", "como ta o SEO do site", "analise do google search", "relatorio semanal de SEO", ou quando for segunda-feira e o usuario quiser o acompanhamento semanal. Tambem dispara com /search-console.
---

# Search Console — Relatório de SEO

Consulta os dados de busca orgânica do site (paulacorrea.adv.br) via API do Google Search Console, usando a service account já configurada no workspace.

## Quando usar

- Pedido direto: "relatório do search console", "como tá o SEO", "análise do Google Search"
- Acompanhamento semanal (segundas-feiras) — a Paula pediu pra rodar isso toda segunda
- Depois de publicar posts novos no blog, pra ver se estão sendo indexados/aparecendo em buscas

## Como rodar

```bash
python3 .claude/skills/search-console/scripts/relatorio.py resumo     # cliques/impressões/CTR/posição — semana atual vs anterior
python3 .claude/skills/search-console/scripts/relatorio.py paginas    # top 25 páginas (últimos 28 dias)
python3 .claude/skills/search-console/scripts/relatorio.py buscas     # top 25 termos de busca (últimos 28 dias)
python3 .claude/skills/search-console/scripts/relatorio.py tendencia  # série diária (últimos 90 dias)
```

Rodar sempre pelo menos `resumo` + `paginas` + `buscas` pra dar um relatório completo. `tendencia` é opcional, útil pra ver se tem queda/alta ao longo do tempo.

## Credenciais

Usa `.env.local` na raiz do workspace (`8_Claude/.env.local`):
- `GOOGLE_SEARCH_CONSOLE_SITE_URL` — propriedade verificada (sem "www": `https://paulacorrea.adv.br/`. É essa que recebe os dados de verdade — a versão com "www" existe como propriedade separada no Search Console mas não tem tráfego)
- `GOOGLE_SERVICE_ACCOUNT_JSON` — caminho pro JSON da service account em `.credenciais/` (fora do git)

Se faltar `google-api-python-client` ou `google-auth`, instalar com:
```bash
pip install google-api-python-client google-auth
```

## Como interpretar e reportar

1. **Defasagem dos dados:** o Search Console tem ~2-3 dias de atraso. O script já desconta isso automaticamente (usa `hoje - 3 dias` como data final). Nunca estranhar se "hoje" ou "ontem" não aparecerem.

2. **Site muito recente no GSC (conectado em 2026-09-10):** antes de outubro/2026, os números vão ser baixos ou zerados — isso é esperado, não é problema. Avisar a Paula que a análise só fica robusta com mais semanas de dados acumulados.

3. **Resumo semanal:** comparar a semana atual com a anterior (variação de cliques, impressões, CTR, posição média). Se a posição média caiu (número menor = melhor), é sinal positivo.

4. **Páginas:** ver quais posts/páginas têm mais impressões. Cruzar com o calendário do blog (`conteudo/estrategia-retomada/calendario-blog.md`) pra saber se os posts novos estão performando.

5. **Buscas:** ver quais termos trazem mais impressões/cliques. Útil pra saber se as pessoas estão achando o site pelos termos certos (ex: "advogado construção civil", nome de cidade, etc.) e pra dar ideia de pauta pro blog.

6. **Tom do relatório:** linguagem simples e direta, como a própria Paula explicando pra ela mesma o que os números significam — nada de jargão técnico de SEO sem explicar. Focar no que é acionável (ex: "esse post não tá aparecendo, vale revisar o título" em vez de só listar números).

## Regras

- Nunca expor o conteúdo do JSON da service account nem token nenhum no output
- Se a query retornar tudo zerado, não tratar como erro — explicar que é esperado dado o volume/tempo desde a conexão
- Não é preciso pedir confirmação pra rodar (é só leitura, sem risco)
