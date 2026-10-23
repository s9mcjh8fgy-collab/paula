# Histórico — decisões antigas

> Entradas que saíram do `agora.md` por terem passado de ~30 dias. Só consulta, não é lido no `/iniciar`.

## Decisões (agosto/2026)
- 2026-08-12: pastas de trabalho (`consultivo/`, `contratos/`, `processual/`, `conteudo/`) ficam no `8_Claude`; documentos finais de cliente vão pra pasta dele em `3_Jurídico/`.
- 2026-08-13: `conteudo/` reorganizado por canal — `instagram/`, `tiktok/`, `site/`, `youtube/`, cada um com subpastas por tipo (`carrossel/`, `reels/`, `blog/`); `casos/` continua como fonte de ideias; nova pasta `estrategia-retomada/` pra planejar a volta ao ritmo de postagens.
- 2026-08-17: skill consultivo dividida em `/consultivo` (esporádico, Legal One) e `/demandas` (assessoria mensal, Supabase).
- 2026-08-20: skill `/inpi` criada — painel central `inpi/controle.md` (todos os clientes), documentos continuam em `06_INPI/` na pasta de cada cliente. Relatório de andamento pro cliente vira HTML com imagem de cada pedido, layout de duas colunas (acompanhamento x providência), e é publicado no Cloudflare Pages (token e account ID em `.env`, projeto criado por cliente, ex: `inpi-lz-7805ac58`).
- 2026-08-20: Cloudflare configurado no workspace (conta, API token, skills/MCP oficiais instalados) — disponível pra qualquer projeto futuro, não só INPI.
- 2026-08-24: cliente Consisa cadastrado no sistema de assessorias (CNPJ 07.784.629/0001-19, demandas #0075-#0077).
- 2026-08-24: conferidas as 19 pastas de assessoria no SharePoint, com 6 clientes cadastrados no sistema próprio de demandas.

## Quente (agosto/2026)
- Skill `/inpi` recém-criada (2026-08-20) — validada num cliente real, mas ainda vale revisar o formato do relatório na próxima vez que gerar pra outro cliente, pra confirmar se o padrão ficou bom de forma geral.

## Decisões (setembro/2026)
- 2026-09-01: receita oficial do Fechamento Mensal passou a vir do e-mail mensal da contabilidade (Hcont), não mais da planilha `01 Contas a Receber` (que inflava o total).
- 2026-09-01: skill `/financeiro` criada, com o app `financeiro-paula` (Cloudflare Worker + Supabase) como ferramenta principal de contas a pagar/receber — painel em Excel foi tentado antes e abandonado.
- 2026-09-01: modelo de recorrentes no app separa "definição" (cliente, valor, dia de vencimento, total de parcelas) de "ocorrência mensal", gerada automaticamente pelo Worker conforme a Paula navega os meses.
- 2026-09-10: WordPress, cPanel e Google Search Console conectados ao workspace; credenciais sensíveis agora ficam em `.credenciais/` (fora do git) além de `.env.local`.
- 2026-09-10: site invadido — webshell (`wp-cron-ooyh.php`) achado e neutralizado. Senhas do WordPress e cPanel trocadas, 2FA ativado nos dois. Causa do redirecionamento mobile pra site de golpe foi resolvida pela equipe que desenvolveu o site. Incidente encerrado.
- 2026-09-14: corrigida inconsistência na skill `/inpi` — o `SKILL.md` dizia pra manter o relatório de andamento só local, mas o combinado real (desde 20/08) é publicar no Cloudflare Pages (link privado, com sufixo aleatório, só quem recebe do escritório acessa). Skill ajustada pra refletir isso, incluindo o passo de deploy via wrangler reaproveitando o projeto do cliente.
- 2026-09-10: calendário de retomada do blog definido — 1x/semana por 8 semanas (decisão deliberada de não fazer 2x, pra não repetir o padrão de picos e paradas do Instagram). Publicação direto via API do WordPress. Padrão criado: "Leia também" linkando pro pilar relacionado + CTA de engajamento no fechamento (nunca linguagem de captação direta — ver `feedback_cta_oab_etica`). Widget de compartilhamento (WhatsApp) corrigido no template do site via Elementor.
- 2026-09-14: skill meta-ads-ratos configurada e testada (App Meta em modo Live, conta de anúncio `paula` cadastrada). Análise do histórico mostrou que geo-targeting focado em evento/contexto específico (ex: raio ao redor da feira Casa Cor) rende bem mais barato por lead do que mirar cidades/capitais genéricas.
- 2026-09-14: skill `/search-console` criada pra relatório semanal de SEO (segundas-feiras). Corrigido `GOOGLE_SEARCH_CONSOLE_SITE_URL` no `.env.local`, que apontava pra versão "www" (sem dados) em vez da propriedade real. Site ainda muito recente no GSC (conectado 10/09) — análise só fica robusta a partir de outubro/2026.
- 2026-09-17: skill `/postar-instagram` criada — publica direto no feed via Graph API (reaproveita token da `meta-ads-ratos`, já com `instagram_content_publish`), hospedando imagem via Cloudflare Pages (projeto `paula-ig-media`). Fluxo sempre em dois passos (`preparar.js` monta e mostra prévia, `confirmar.js` só publica com aprovação explícita da Paula no chat) + `apagar.js` pra remover post publicado.
- 2026-09-17: formato "Conto Jurídico"/"Série Real" criado — narrativa "Era uma vez... [situação] que [reviravolta]", inspirada em casos reais das demandas (Supabase) mas totalmente ficcionalizada, com a Paula aparecendo em cena (cliente procura ela, ela aconselha e ajuda a documentar). Cor de capa alterna por conto entre as três cores da marca. Formato "Acho chic" (adaptação da trend viral) também criado, com foto real da Paula na capa/fechamento.
- 2026-09-17: calendário fixo de postagem definido — terça Instagram, quinta blog + Instagram (mesmo tema), a partir de 21/09/2026. Reels e o lançamento da ferramenta "Contrato na Régua" (gerador de contrato de arquitetura com captura de lead, `ferramentas/contrato-na-regua/`) pausados por decisão da Paula, pra não sobrecarregar a retomada.
- 2026-09-17: publicado o post #1 da retomada ("Acho chic...") e o artigo semana 2 do blog ("Atraso de obra"). Descoberto que o Wordfence pode travar POST na API do WordPress com fatal error de memória (arquivo `wflogs/rules.php` corrompido) — corrige clicando "atualizar regras manualmente" no painel do Wordfence (ver memória `project_wordfence_bloqueia_post_api`).

## Onde paramos (setembro/2026, até 22/09)
Instagram e blog retomados de verdade em 2026-09-17. Dois formatos novos criados a partir de análise
de concorrentes (Carolina Caribé, João Paulo Leite/Empresa Blindada, Leonardo Vilela): "Conto
Jurídico"/"Série Real" (narrativa "Era uma vez...", casos reais das demandas totalmente
ficcionalizados, Paula como personagem ativo) e um formato inspirado na trend "Acho chic". Skill
`/postar-instagram` criada e testada (publica direto via Graph API). Calendário fixo definido: terça
Instagram, quinta blog + Instagram, a partir de 21/09/2026 (ver
`conteudo/estrategia-retomada/README.md`). Reels e o lançamento da ferramenta "Contrato na Régua"
ficam pausados por decisão da Paula, retomar quando ela sinalizar.
Segunda história da série publicada (18/09, "vizinho que jurou chamar a polícia"). Skill
`/postar-instagram` ganhou capacidade de stories (`preparar-story.js`), mas pra compartilhar um post
que já está no feed a Paula prefere o "compartilhar" nativo do app (card clicável) em vez da arte
customizada — a arte fica reservada pra quando não tiver post de feed pra puxar.
Primeiro post do calendário fixo publicado (22/09, "geladeira que pifou"), com um slide novo pedido
pela Paula (cliente processou e perdeu, 18 meses de processo, documentação como prova decisiva).

## Decisões (setembro/2026, 18 a 22/09)
- 2026-09-18: legenda do Instagram não deve recontar a história do carrossel (fica redundante) — deve ser mais curta, com gancho/reflexão que não está nos slides. "Fiscal" trocado por "policial" no conto do vizinho (quem aparece quando alguém liga pra polícia é policial, não fiscal). Skill `/postar-instagram` ganhou stories (`preparar-story.js` + `references/design-story-teaser.md`), mas compartilhar post do feed via story nativo (repost pelo app) é preferível à arte customizada quando o post já existe.
- 2026-09-22: achado e corrigido bug de cache do Instagram — como todo carrossel reusa nomes tipo `slide-01.png`, a Graph API às vezes servia uma versão antiga da URL e falhava ao criar o container. Corrigido com `?v=<timestamp>` cache-busting em `preparar.js`/`preparar-story.js`. Confirmado de novo: legenda nunca deve recontar o enredo do carrossel (aconteceu de novo nesse post, mesmo padrão do dia 18). Cor de destaque ("twist") no meio de um conto quebra a consistência visual — a Paula prefere negrito na mesma cor de fundo a trocar de cor no meio da história.
