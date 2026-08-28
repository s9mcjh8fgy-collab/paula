# Agora — contexto vivo

> Este é o contexto que muda toda semana (diferente de `estrategia.md`, que é o foco de fundo).
> O `/iniciar` lê isto no começo da sessão; o `/atualizar` escreve aqui no fim.
> Mantenha curto: o que passou de ~30 dias sai daqui (vai pro histórico ou some).

## Onde paramos
Auditoria completa das 19 pastas de assessoria em 24/08/2026, com 6 clientes cadastrados no sistema próprio de demandas (último: Consisa).

## Decisões recentes
- 2026-08-12: pastas de trabalho (`consultivo/`, `contratos/`, `processual/`, `conteudo/`) ficam no `8_Claude`; documentos finais de cliente vão pra pasta dele em `3_Jurídico/`.
- 2026-08-13: `conteudo/` reorganizado por canal — `instagram/`, `tiktok/`, `site/`, `youtube/`, cada um com subpastas por tipo (`carrossel/`, `reels/`, `blog/`); `casos/` continua como fonte de ideias; nova pasta `estrategia-retomada/` pra planejar a volta ao ritmo de postagens.
- 2026-08-17: skill consultivo dividida em `/consultivo` (esporádico, Legal One) e `/demandas` (assessoria mensal, Supabase).
- 2026-08-20: skill `/inpi` criada — painel central `inpi/controle.md` (todos os clientes), documentos continuam em `06_INPI/` na pasta de cada cliente. Relatório de andamento pro cliente vira HTML com imagem de cada pedido, layout de duas colunas (acompanhamento x providência), e é publicado no Cloudflare Pages (token e account ID em `.env`, projeto criado por cliente, ex: `inpi-lz-7805ac58`).
- 2026-08-20: Cloudflare configurado no workspace (conta, API token, skills/MCP oficiais instalados) — disponível pra qualquer projeto futuro, não só INPI.
- 2026-08-24: cliente Consisa cadastrado no sistema de assessorias (CNPJ 07.784.629/0001-19, demandas #0075-#0077).
- 2026-08-24: conferidas as 19 pastas de assessoria no SharePoint, com 6 clientes cadastrados no sistema próprio de demandas.

## Pendências
- Avaliar conector de WhatsApp Business e integração com Legal One (sem MCP pronto no catálogo ainda).
- Publicar o post #1 da retomada (carrossel "barulho de obra e vizinho", já pronto em `conteudo/instagram/carrossel/barulho-obra-vizinho/`).
- Rodar `/carrossel` pra gerar o tema da semana 2 da retomada (ver `conteudo/estrategia-retomada/README.md`).
- Leonardo Zanatta: aguardando ele enviar renderizações corrigidas da Mesa de Centro Jacuí (prazo 30/09/2026) e uma foto/render da Luminária de teto BR 30 2025 005775 2.
- Confirmar com a Anna o reembolso das guias de R$ 85,00 e R$ 175,00 (INPI Leonardo Zanatta).
- Autorizar os MCP servers da Cloudflare (`cloudflare-api`, `cloudflare-bindings`, `cloudflare-builds`, `cloudflare-observability`) via `/mcp` numa sessão interativa, quando for usar algum projeto Cloudflare que precise deles.

## Quente agora
Estratégia de retomada de postagens definida em 2026-08-13 (ver `conteudo/estrategia-retomada/README.md`): repurposing de Instagram pra TikTok/YouTube Shorts, ritmo progressivo (1x/semana nas 2 primeiras semanas, subindo pra 2x), execução só pela Paula. Falta publicar o post #1.
Skill `/inpi` recém-criada (2026-08-20) — validada num cliente real, mas ainda vale revisar o formato do relatório na próxima vez que gerar pra outro cliente, pra confirmar se o padrão ficou bom de forma geral.
