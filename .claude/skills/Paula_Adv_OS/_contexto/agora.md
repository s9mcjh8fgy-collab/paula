# Agora — contexto vivo

> Este é o contexto que muda toda semana (diferente de `estrategia.md`, que é o foco de fundo).
> O `/iniciar` lê isto no começo da sessão; o `/atualizar` escreve aqui no fim.
> Mantenha curto: o que passou de ~30 dias sai daqui (vai pro histórico ou some).

## Onde paramos
Blog retomado: calendário de 8 semanas (1x/semana) criado, post #1 (contrato de empreitada) publicado. Incidente de segurança do site (backdoor + redirecionamento pra golpe no mobile) totalmente resolvido — falta só seguir o calendário do blog.
Novo pedido de desenho industrial do Leonardo Zanatta protocolado (sofá, BR 30 2026 007020-4) e relatório de andamento consolidado atualizado e republicado no Cloudflare Pages.

## Decisões recentes
- 2026-08-12: pastas de trabalho (`consultivo/`, `contratos/`, `processual/`, `conteudo/`) ficam no `8_Claude`; documentos finais de cliente vão pra pasta dele em `3_Jurídico/`.
- 2026-08-13: `conteudo/` reorganizado por canal — `instagram/`, `tiktok/`, `site/`, `youtube/`, cada um com subpastas por tipo (`carrossel/`, `reels/`, `blog/`); `casos/` continua como fonte de ideias; nova pasta `estrategia-retomada/` pra planejar a volta ao ritmo de postagens.
- 2026-08-17: skill consultivo dividida em `/consultivo` (esporádico, Legal One) e `/demandas` (assessoria mensal, Supabase).
- 2026-08-20: skill `/inpi` criada — painel central `inpi/controle.md` (todos os clientes), documentos continuam em `06_INPI/` na pasta de cada cliente. Relatório de andamento pro cliente vira HTML com imagem de cada pedido, layout de duas colunas (acompanhamento x providência), e é publicado no Cloudflare Pages (token e account ID em `.env`, projeto criado por cliente, ex: `inpi-lz-7805ac58`).
- 2026-08-20: Cloudflare configurado no workspace (conta, API token, skills/MCP oficiais instalados) — disponível pra qualquer projeto futuro, não só INPI.
- 2026-08-24: cliente Consisa cadastrado no sistema de assessorias (CNPJ 07.784.629/0001-19, demandas #0075-#0077).
- 2026-08-24: conferidas as 19 pastas de assessoria no SharePoint, com 6 clientes cadastrados no sistema próprio de demandas.
- 2026-09-01: receita oficial do Fechamento Mensal passou a vir do e-mail mensal da contabilidade (Hcont), não mais da planilha `01 Contas a Receber` (que inflava o total).
- 2026-09-01: skill `/financeiro` criada, com o app `financeiro-paula` (Cloudflare Worker + Supabase) como ferramenta principal de contas a pagar/receber — painel em Excel foi tentado antes e abandonado.
- 2026-09-01: modelo de recorrentes no app separa "definição" (cliente, valor, dia de vencimento, total de parcelas) de "ocorrência mensal", gerada automaticamente pelo Worker conforme a Paula navega os meses.
- 2026-09-10: WordPress, cPanel e Google Search Console conectados ao workspace; credenciais sensíveis agora ficam em `.credenciais/` (fora do git) além de `.env.local`.
- 2026-09-10: site invadido — webshell (`wp-cron-ooyh.php`) achado e neutralizado. Senhas do WordPress e cPanel trocadas, 2FA ativado nos dois. Causa do redirecionamento mobile pra site de golpe foi resolvida pela equipe que desenvolveu o site. Incidente encerrado.
- 2026-09-14: corrigida inconsistência na skill `/inpi` — o `SKILL.md` dizia pra manter o relatório de andamento só local, mas o combinado real (desde 20/08) é publicar no Cloudflare Pages (link privado, com sufixo aleatório, só quem recebe do escritório acessa). Skill ajustada pra refletir isso, incluindo o passo de deploy via wrangler reaproveitando o projeto do cliente.
- 2026-09-10: calendário de retomada do blog definido — 1x/semana por 8 semanas (decisão deliberada de não fazer 2x, pra não repetir o padrão de picos e paradas do Instagram). Publicação direto via API do WordPress. Padrão criado: "Leia também" linkando pro pilar relacionado + CTA de engajamento no fechamento (nunca linguagem de captação direta — ver `feedback_cta_oab_etica`). Widget de compartilhamento (WhatsApp) corrigido no template do site via Elementor.
- 2026-09-14: skill meta-ads-ratos configurada e testada (App Meta em modo Live, conta de anúncio `paula` cadastrada). Análise do histórico mostrou que geo-targeting focado em evento/contexto específico (ex: raio ao redor da feira Casa Cor) rende bem mais barato por lead do que mirar cidades/capitais genéricas.
- 2026-09-14: skill `/search-console` criada pra relatório semanal de SEO (segundas-feiras). Corrigido `GOOGLE_SEARCH_CONSOLE_SITE_URL` no `.env.local`, que apontava pra versão "www" (sem dados) em vez da propriedade real. Site ainda muito recente no GSC (conectado 10/09) — análise só fica robusta a partir de outubro/2026.

## Pendências
- Avaliar conector de WhatsApp Business e integração com Legal One (sem MCP pronto no catálogo ainda).
- Publicar o post #1 da retomada (carrossel "barulho de obra e vizinho", já pronto em `conteudo/instagram/carrossel/barulho-obra-vizinho/`).
- Rodar `/carrossel` pra gerar o tema da semana 2 da retomada (ver `conteudo/estrategia-retomada/README.md`).
- Leonardo Zanatta: aguardando ele enviar renderizações corrigidas da Mesa de Centro Jacuí (prazo 30/09/2026) e uma foto/render da Luminária de teto BR 30 2025 005775 2.
- Leonardo Zanatta: informar o nome do modelo/coleção do sofá novo protocolado em 14/09/2026 (BR 30 2026 007020-4), e reembolsar a Paula os R$ 175,00 da guia paga no protocolo (10/09/2026) — único reembolso ainda em aberto; os de R$ 85,00 e R$ 175,00 (19/08/2026) já foram pagos pela Anna.
- Autorizar os MCP servers da Cloudflare (`cloudflare-api`, `cloudflare-bindings`, `cloudflare-builds`, `cloudflare-observability`) via `/mcp` numa sessão interativa, quando for usar algum projeto Cloudflare que precise deles.
- Cadastrar no app financeiro (como recorrente) os impostos, o salário da Thaís e as parcelas de empréstimo assim que a Paula tiver valores/prazos confiáveis pra projetar — hoje ficam de fora por variarem demais mês a mês.
- Seguir o calendário do blog: semana 2 é "Atraso de obra: quem responde e como se proteger" (ver `conteudo/estrategia-retomada/calendario-blog.md`).

## Quente agora
App financeiro (`financeiro-paula`) recém-criado em 2026-09-01 — Paula está testando no dia a dia (marcar pago, editar, lançar retroativo), ainda ajustando dados de recorrentes conforme usa.
Blog do site retomado (2026-09-10): calendário de 8 semanas rodando, 1x/semana, post #1 no ar. Estratégia de redes sociais (Instagram/TikTok/YouTube) definida em 2026-08-13 (ver `conteudo/estrategia-retomada/README.md`) segue parada — post #1 do Instagram ainda não publicado.
Skill `/inpi` recém-criada (2026-08-20) — validada num cliente real, mas ainda vale revisar o formato do relatório na próxima vez que gerar pra outro cliente, pra confirmar se o padrão ficou bom de forma geral.
