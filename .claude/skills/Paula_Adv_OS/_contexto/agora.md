# Agora — contexto vivo

> Este é o contexto que muda toda semana (diferente de `estrategia.md`, que é o foco de fundo).
> O `/iniciar` lê isto no começo da sessão; o `/atualizar` escreve aqui no fim.
> Mantenha curto: o que passou de ~30 dias sai daqui (vai pro histórico ou some).

## Onde paramos
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
Novo pedido de desenho industrial do Leonardo Zanatta protocolado (sofá, BR 30 2026 007020-4) e relatório de andamento consolidado atualizado e republicado no Cloudflare Pages.
Semana 3 do calendário (24/09): carrossel e post fixo do "Distrato de imóvel na planta" produzidos
e preparados (prévia gerada), mas ainda NÃO publicados no Instagram. Skill `/checar-site` criada pra checagem diária da saúde do site.
Modelos do escritório (procurações, declarações, contratos, incluindo o novo contrato de INPI PF/PJ) recriados em Word a partir do Canva, na pasta `5_Acervo/2_Modelos Gerais/Credenciais/` (14 modelos). Skill `/documento-cliente` criada pra preencher cópias e salvar na pasta do cliente.
Primeiro uso real da `/documento-cliente` (24/09): LRG Romani Ltda (plataforma Psicólogos Online Brasil, cliente Robinson) fechou Elaboração de Documentos (R$ 3.000) e registro de marca no INPI (R$ 1.200), ambos em 6x sem juros a partir de 15/10/2026. Contratos e procuração INPI salvos em PDF em `2_Pessoa Jurídica (PJ)/1_Processos/LRG Romani Ltda/`.
Demanda #0117 da Ágile (25/09): análise da convenção do Edifício California confirmou que uma vaga de estacionamento vendida em escritura separada é unidade autônoma do condomínio, apta a CND; orientado deslocar a fração dela pro cadastro do apartamento do comprador. Na mesma sessão, criado alerta automático de saúde do site (Cloudflare Worker `alerta-site-paula`, 2x/dia, e-mail via Resend) e identificada a causa raiz do erro recorrente do Wordfence: `DISABLE_WP_CRON` estava true sem nenhum cron real substituto, então as tarefas agendadas do WordPress nunca rodavam. Criado cron de sistema (a cada 15 min) chamando `wp-cron.php`.
Reels retomado (28/09), puxado por um gancho de atualidade (temporada CASA COR): post de blog + Reels em vídeo sobre direito autoral de projeto exposto em mostra. Reels editado localmente com ffmpeg (fotos do banco + slideshow, sem gravação real da Paula na primeira tentativa — depois trocado por foto real dela na abertura/fechamento). Skill `/postar-instagram` ganhou capacidade de publicar vídeo/Reels (`preparar-reels.js`, novo, mesma lógica de dois passos). Publicado duas vezes: a primeira versão tinha o texto grudado na base do vídeo (coberto pela UI do Reels — nome, legenda, ícones — quando aberto no app), corrigido subindo o texto pra ~72% da altura; o post antigo foi apagado (`apagar.js`) e republicado. Versão final: https://www.instagram.com/reel/Dd2DH97GFFN/
28/09 (continuação): causa raiz real do erro do Wordfence encontrada — não era falta de memória nem falta de cron, era o modo "Proteção Estendida" do firewall rodando antes até do `wp-config.php` carregar (via `auto_prepend_file`), então nenhum ajuste de memória chegava a valer. Removida a Proteção Estendida no wp-admin. Testado com 5 requisições seguidas no endpoint que sempre travava — todas OK. Publicado também o post do Instagram do "Distrato de imóvel na planta" (post fixo com foto), que ficou pendente do dia 24.
30/09: primeira História em Série publicada, parte 1 de 3 ("Era uma vez... um prédio que não parou de subir (mas não podia!)", demanda #0062 ficcionalizada, fundo bege): https://www.instagram.com/p/Dd6mnILEWGy/. Partes 2 (qui 01/10) e 3 (sex 02/10) com texto aprovado e HTML pronto em `conteudo/instagram/carrossel/serie-predio-subindo-parte-2/` e `-parte-3/`, faltando renderizar os PNGs e publicar. A parte 2 ocupa o Instagram de quinta no lugar do card do blog; a parte 3 chama pro artigo do blog da semana 4 (responsabilidade civil do arquiteto/engenheiro por erro de projeto), que precisa estar publicado na quinta. Desfecho da parte 3 definido pela Paula: comunicação ao CREA e à Defesa Civil, sem retorno da construtora, obra parada por um tempo, referência ao Palace II. Relatório Único de Consultoria do Sebrae da LRG Romani (SC0920260324, 2h) preenchido em 29/09, faltando CNPJ e e-mail do cliente.
30/09 (continuação): demanda Ágile #0121 registrada (filmagem de multa no Bérgamo: pode enviar se só aparece a condômina; se aparecer terceiro, convidar pra assistir no escritório, por LGPD). Demanda #0062 (Excel/Sunset Marine): denúncia ao CREA-SC montada na subpasta `Denúncia CREA-SC` da demanda (minuta, protocolo preenchido, procuração e Docs 01 a 11). Skill `/transcrever-audio` migrada pro faster-whisper.
30/09 (cont.): demanda #0116 do Grupo Ao Cubo. Os dois modelos de contrato com prestador (versão Grupo Ao Cubo e versão Cliente) foram analisados contra os casos Menegildo (#0061) e HB Portas (#0111), e as versões `_v2.docx` foram salvas na pasta da demanda, com as mudanças em amarelo e os originais intactos. Entraram: prazo essencial, multa por atraso de 0,5% ao dia (teto de 10%), fim do teto de R$ 5 mil na multa compensatória, contratação de outra equipe às custas do prestador com compensação, proibição de o prestador desistir sem aviso de 15 dias, proibição de duplicata/protesto de parcela em discussão, devolução do adiantamento em 5 dias úteis, garantia mínima de 12 meses e valor por etapa no Quadro-Resumo.
30/09 (cont.): demanda #0061 (Grupo Ao Cubo x Menegildo, obra Blutech). A Menegildo mandou em 28/09 uma nova proposta de R$ 37.047,00, praticamente igual à anterior, e a negociação pelo Ao Cubo se esgotou. Em 30/09, com o Ângelo validando, foi enviado e-mail à Blutech (R&J) com o histórico e três opções para ela decidir: (1) aceitar a proposta e contratar outra empresa para a porta; (2) pagar o valor cheio, com ACM (cerca de R$ 46.924,00), e cobrar R$ 19.250,00 na Justiça; (3) assumir a negociação diretamente. O texto deixa claro que o Ao Cubo agiu como gestor, no interesse da Blutech. Demanda #0122 do Leonardo Zanatta (declaração de palestra na Bienal de Arquitetura Brasileira, Lei Rouanet) registrada: foi liberada para assinar. O cadastro duplicado "Estúdio Leonardo Zanatta" foi apagado.
01/10: demanda #0062 (Excel/Sunset Marine): denúncia protocolada no CREA-SC (protocolo nº 52601432511, Inspetoria de Blumenau, "Em análise"). Projeto de reforço juntado como Docs 07b (reforço metálico básico), 07c (executivo DSEM) e 08b (pilares E1032J-01); o item 12 (mensagens de setembro) saiu da denúncia por decisão da Paula. Anexos enviados um por campo do sistema (pasta `Denúncia CREA-SC/Envio CREA`). Demanda atualizada e tarefa de consulta criada pra 16/10.
02/10: parte 3 da História em Série do prédio publicada (https://www.instagram.com/p/Dd_knjVlmnR/), série concluída, com o artigo do blog da semana 4 publicado na véspera como gancho.
02/10 (cont.): demanda #0048 (Leonardo Zanatta x Santer, aditivo do Beach Club). A Santer (Larisi Rigo) comentou o aditivo pedindo para tirar as cláusulas 3.2/3.3 (pagamento na entrega) e a obrigação de contratar o Leonardo para os interiores. Feito o `05 ADITIVO CONTRATO BEACH CLUB_revisado.docx`: Cláusula Quarta acatada como a Santer propôs; parcelas 01 a 03 em datas fixas (20/10, 20/11 e 20/12/2026) e parcela 04 em 10 dias úteis após a entrega do Projeto Executivo. E-mail de resposta redigido para a Paula enviar, pedindo retorno até 06/10. Demanda atualizada para pendente e tarefa de cobrança criada para 07/10.
02/10 (cont.): demanda Ágile #0123 (contrato de manutenção predial do Edifício Amazonas Park com a HR Soluções em Construção). Análise simplificada enviada ao Felipe por WhatsApp com 4 pontos: excluir a citação ficta (17.7), tirar a responsabilidade do condomínio por serviço pedido direto ao funcionário (4.5.2), trocar "obriga-se" por "recomenda-se" nas revisões depois do fim do contrato (8.7 e 10.5) e atenção ao aceite tácito de 10 dias úteis (11.2 e 11.3). Demanda concluída, pasta e link do SharePoint ok. Gravado o link que faltava na #0117. Demanda #0070 (Dalbosco x Kelli) concluída: instrumentos assinados recebidos e contrato encaminhado à Simone.
02/10 (cont.): INPI do Leonardo Zanatta. Três desenhos industriais protocolados (Mesa de jantar Calisto BR 30 2026 007637-7, Mesa de centro América 007638-5 e Carrinho de chá Carteiro 007639-3), com as figuras padronizadas pro e-DI (nome do menu, 1880px, 300 DPI, originais em `_originais/`). Resposta à exigência do Jacuí protocolada em 28/09. Consulta no pePI feita direto daqui. Relatório de andamento republicado no mesmo link.

## Decisões recentes
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
- 2026-09-18: legenda do Instagram não deve recontar a história do carrossel (fica redundante) — deve ser mais curta, com gancho/reflexão que não está nos slides. "Fiscal" trocado por "policial" no conto do vizinho (quem aparece quando alguém liga pra polícia é policial, não fiscal). Skill `/postar-instagram` ganhou stories (`preparar-story.js` + `references/design-story-teaser.md`), mas compartilhar post do feed via story nativo (repost pelo app) é preferível à arte customizada quando o post já existe.
- 2026-09-22: achado e corrigido bug de cache do Instagram — como todo carrossel reusa nomes tipo `slide-01.png`, a Graph API às vezes servia uma versão antiga da URL e falhava ao criar o container. Corrigido com `?v=<timestamp>` cache-busting em `preparar.js`/`preparar-story.js`. Confirmado de novo: legenda nunca deve recontar o enredo do carrossel (aconteceu de novo nesse post, mesmo padrão do dia 18). Cor de destaque ("twist") no meio de um conto quebra a consistência visual — a Paula prefere negrito na mesma cor de fundo a trocar de cor no meio da história.

- 2026-09-24: Canva conectado e funcionando. Modelos de credenciais (5 procurações, 3 declarações de hipossuficiência, 4 contratos) recriados do Canva em .docx com a identidade da marca, salvos em `5_Acervo/2_Modelos Gerais/Credenciais/`. Padrão: data em cima, assinatura centralizada embaixo. Skill `/documento-cliente` criada: preenche cópia do modelo e salva na pasta do cliente, modelos nunca alterados.
- 2026-09-24: criado modelo novo `Contrato (PF)_INPI` / `Contrato (PJ)_INPI` (registro de marca e/ou desenho industrial), exclusivamente administrativo: medida judicial, notificações extrajudiciais (durante o pedido ou após a concessão) e recurso contra indeferimento são orçados à parte; manifestação em oposição administrativa está incluída. Nomes dos arquivos da pasta Credenciais definidos pela Paula (ex: `Declaração (PF)`, `Contrato (PJ)_Assessoria Jurídica`).
- 2026-09-24: em documento de cliente, endereço sempre completo e por extenso em todos os campos (nunca "o mesmo da sede" nem abreviar logradouro). Modelos da Credenciais sem linha pontilhada na qualificação (quase nunca se preenche à mão).
- 2026-09-25: descoberto que o DNS público de `paulacorrea.adv.br` fica no Registro.br (painel.registro.br), não no cPanel — a zona do cPanel existe mas não é autoritativa. Confirmar sempre no Registro.br quando precisar mexer em DNS desse domínio.
- 2026-09-25: criado alerta automático de saúde do site — Cloudflare Worker `alerta-site-paula` (código em `8_Claude/alerta-site/`), roda 2x/dia (10h e 15h) e manda e-mail via Resend só quando algo falha. Corrigidos dois falsos positivos na lógica de checagem (`.user.ini` aceitando >=512M em vez de exatamente 512M; header de User-Agent no wp-login pra não ser bloqueado como bot pelo Wordfence) — aplicado tanto no Worker quanto na skill `/checar-site` local.
- 2026-09-25: causa raiz do erro recorrente do Wordfence (fatal error de memória em `wflogs/rules.php`) identificada — `DISABLE_WP_CRON` estava `true` no wp-config.php e não existia nenhum cron job real no cPanel pra substituir, então nenhuma tarefa agendada do WordPress rodava. Criado cron de sistema (a cada 15 min, `wget` em `wp-cron.php`) via API do cPanel.
- 2026-09-28: fonte editorial padrão pra capas/cards de texto sobre foto fixada como **Borna Bold**
  (fonte oficial da marca, Manual de Marca 2023 — arquivo completo em
  `1_Gestão/4_Marketing/05 TIPOGRAFIA/borna-complete-desktop.zip`, cópia em `marca/fonts/`). Antes
  dessa decisão foram testadas (e descartadas) Poppins e Playfair Display — não usar nenhuma das
  duas em peça nova. Padrão de composição pra texto sobre foto também fixado: sem caixa cinza,
  gradiente escuro (marrom da marca, não preto) só na base da imagem, texto centralizado por linha
  (drawtext do ffmpeg não centraliza multi-linha automaticamente, precisa uma chamada por linha),
  cor alternando entre laranja `#F26F4D` (frase de efeito/gancho) e off-white `#F1EBDF` (texto de
  explicação), seguindo o mesmo padrão já usado no carrossel "Acho chic".
- 2026-09-28: causa raiz definitiva do erro recorrente do Wordfence identificada — modo "Proteção
  Estendida" do firewall (usa `auto_prepend_file` apontando pro `wordfence-waf.php`, rodando antes
  do `wp-config.php`). Removida via wp-admin → Wordfence → Firewall → Gerenciar WAF → Remover
  Proteção Estendida. A causa anterior (falta de cron, 25/09) não era a raiz real, só um fator
  secundário. Ver memória `project_wordfence_bloqueia_post_api`.
- 2026-09-28: **não temos visibilidade do que já foi postado no Instagram** — antes de escolher foto
  do banco pra uma peça nova, perguntar pra Paula se já foi usada (ela lembra, o histórico de posts
  não é acessível). Lista de fotos já usadas registrada em `marca/design-guide.md`.
- 2026-09-28: publicar Reels via API exige vídeo com `moov atom` no início do arquivo
  (`-movflags +faststart` no ffmpeg) e ao menos uma trilha de áudio (mesmo que silenciosa) — sem
  isso a Graph API recusa com "media upload failed" (erro 2207052/2207076). Cuidado extra: um remux
  posterior (ex: adicionar a trilha de áudio depois de já ter aplicado faststart) pode derrubar o
  faststart de novo — sempre aplicar `-movflags +faststart` como o último passo antes de publicar,
  nunca no meio do pipeline. Vídeo final também precisa de `pix_fmt yuv420p` com `color_range tv`
  (não `yuvj420p`/full range, que o libx264 gera por padrão a partir de imagens JPEG). Outro motivo
  do mesmo erro: vídeo montado a partir de fotos JPEG pode sair com `color_space=bt470bg` (padrão de
  TV antiga/SD), incompatível com um vídeo 1080x1920 — forçar `-colorspace bt709 -color_primaries
  bt709 -color_trc bt709` no encode final resolve.
- 2026-09-28: texto sobreposto em vídeo de Reels não pode ficar colado na base — a UI do Instagram
  (nome do perfil, legenda, ícones de curtir/comentar/compartilhar) cobre uma faixa grande na parte
  de baixo quando o Reels é aberto no app (diferente de um post de imagem estática, onde isso não
  existe). Manter o texto por volta de 70-74% da altura do quadro, não mais embaixo que isso.
- 2026-09-30: nome público do formato multi-parte é **"História em Série"**, nunca "Série Real" nas
  legendas/slides ("real" dá a entender que os outros contos "Era uma vez..." não eram). "Série Real"
  fica só como nome interno nos arquivos antigos.
- 2026-09-30: `preparar.js` da `/postar-instagram` falhava com erro 2207052 porque criava os
  containers antes de o Cloudflare Pages servir as imagens recém-publicadas. Corrigido: agora espera
  cada URL responder 200 + 15s de folga, e tenta de novo até 3 vezes se a Meta ainda não baixar.
- 2026-09-30: denúncia ao CREA-SC da #0062 na hipótese 2 (infração ao Código de Ética, Res.
  1002/2002, rito da Res. 1004/2003) contra o RT da execução, Eng. José Marcos Braga Guimarães
  (CREA-SC 177828-0, ART 9034658-2), com pedido de fiscalização prioritária. Sem citar áudios, sem
  testemunhas e sem relatório técnico novo. Argumento central: a construtora sabia que a
  continuidade da obra dependia dos reforços feitos em paralelo (e-mail de 25/02/2025). Não há
  documento escrito que limite a obra a certo número de pavimentos.
- 2026-09-30: na Excel Engenharia só o Fred assina pela empresa (6ª alteração contratual:
  administração exclusiva dele). Paula assina o protocolo do CREA como procuradora; a denúncia leva
  as assinaturas do Fred e da Paula.
- 2026-09-30: skill `/transcrever-audio` (global) trocada do openai-whisper pro faster-whisper:
  modelo int8, 2 núcleos por padrão, prioridade baixa, pra não travar o computador. Exige `av`
  abaixo da versão 15 (a 15+ quebra o faster-whisper).
- 2026-09-30: no modelo de contrato de prestador em que o contratante é o cliente final do Grupo Ao Cubo, o Ao Cubo assina como **procurador do cliente**, com procuração anexa. Ele não entra como "sub-rogado" (termo tecnicamente errado) nem como interveniente. O contrato tem só duas partes, obriga apenas o cliente, e o limite de aprovação do Ao Cubo fica definido na procuração.
- 2026-09-30: a #0061 foi escalonada à Blutech como contratante, porque o contrato e as duplicatas estão em nome da R&J e a Menegildo exige a R&J em qualquer acordo. Custos com terceiros: R$ 12.400,00 já pagos pela Blutech (equipe e munck) e R$ 2.900,00 ainda pendentes de repasse pelo Ao Cubo (frete, eletricista, fonte). O Ao Cubo se dispôs a acompanhar a execução da porta da área técnica.
- 2026-10-01: o sistema de protocolo do CREA-SC aceita um arquivo por campo, com no máximo 10 MB. Juntar os anexos num PDF por campo (Laudo, Projetos, Foto, E-mail, Outros), com marcadores por Doc; contrato social digitalizado costuma estourar o limite, comprimir as imagens pra 150 dpi.
- 2026-10-02: nos contratos de arquitetura do Leonardo Zanatta, o pagamento fica em datas fixas, sem vínculo com a entrega ou a aprovação das etapas. Só a última parcela fica vinculada à entrega final (10 dias úteis após a entrega do Projeto Executivo). Motivo: quando o pagamento depende da entrega, o cliente que segura revisão ou aprovação trava a etapa seguinte e o fluxo de caixa. Isso também tira a pressão para o cliente aprovar rápido.
- 2026-10-02: contrato de fornecedor dos condomínios da Ágile tem análise simplificada. Só apontar risco muito alto, não editar o contrato e mandar os tópicos por WhatsApp ao Felipe, pra ele pedir os ajustes à empresa.
- 2026-10-02: linguagem com o cliente sempre neutra e descritiva, nunca em tom de cobrança. Virou padrão de todas as skills, registrado no `AGENTS.md`.
- 2026-10-02: nome dos itens de INPI no formato "[tipo no singular] [modelo]", sem parênteses (ex: "Mesa de centro Jacuí").
- 2026-10-02: o pePI do INPI aceita consulta anônima direto daqui (login anônimo, depois busca por número e detalhe do processo). Desenho industrial e marca funcionam; a busca por número de GRU não é confiável.

## Pendências
- LRG Romani: quando o pedido da marca mista "Psicólogos Online Brasil" (NCL 44) for protocolado, registrar no `inpi/controle.md` via `/inpi` (a GRU já está na pasta do cliente). Prazo contratual de protocolo: 5 dias úteis após assinatura, documentos e pagamento da GRU.
- Apagar no Canva a pasta "_Temp - conversão Word (pode apagar)" (12 cópias usadas só pra leitura; o conector não apaga).
- Avaliar conector de WhatsApp Business e integração com Legal One (sem MCP pronto no catálogo ainda).
- Seguir o calendário fixo a partir de 21/09/2026 (terça Instagram, quinta blog + Instagram) — semana 3 do blog é "Distrato de imóvel na planta" (ver `conteudo/estrategia-retomada/calendario-blog.md`).
- Próximas candidatas a História em Série: eletricista que abandona obra #0104, cliente que some e advogado contra-notifica #0063.
- #0062: consultar o andamento do protocolo 52601432511 no CREA-SC em 16/10 (tarefa já criada no sistema).
- Avaliar o lançamento da ferramenta "Contrato na Régua" quando a Paula sinalizar (Reels já foi retomado em 28/09).
- Tem um `dump.txt` solto na raiz do `Paula_Adv_OS` (rascunho de minuta de procuração, de antes dessa sessão) — perguntar à Paula se quer mover ou descartar.
- Leonardo Zanatta: falta uma foto ou render da Luminária de teto BR 30 2025 005775 2.
- Leonardo Zanatta: reembolso de R$ 610,00 das guias do INPI (exigência do Jacuí de 28/09 e depósitos de 02/10 do Calisto, América e Carteiro). E-mail pra Ana redigido, a Paula envia com os 4 comprovantes.
- Leonardo Zanatta, Sofás BR 30 2025 005807 4: acompanhar as próximas revistas do INPI. A resposta à exigência foi enviada em 13/07, mas o comprovante não foi salvo e, até 02/10, o pePI não lista a petição.
- Confirmar a classe Locarno dos três pedidos de 02/10 (BR 30 2026 007637-7, 007638-5 e 007639-3).
- Autorizar os MCP servers da Cloudflare (`cloudflare-api`, `cloudflare-bindings`, `cloudflare-builds`, `cloudflare-observability`) via `/mcp` numa sessão interativa, quando for usar algum projeto Cloudflare que precise deles.
- Cadastrar no app financeiro (como recorrente) os impostos, o salário da Thaís e as parcelas de empréstimo assim que a Paula tiver valores/prazos confiáveis pra projetar — hoje ficam de fora por variarem demais mês a mês.
- Confirmar nas próximas semanas que o erro do Wordfence não volta mais depois da remoção da Proteção Estendida (28/09) — se voltar, não é mais o mesmo problema, investigar do zero.
- Demanda #0116 (Grupo Ao Cubo): Paula revisar as versões `_v2` (conferir os números definidos: 15 dias, 48h, 5 dias úteis, 12 meses, 0,5%/10%), aprovar e tirar o destaque amarelo; atualizar a demanda no sistema.
- #0061: cobrar a decisão da Blutech na segunda, 05/10 (o prazo pedido foi 02/10; já existe tarefa no sistema). Conforme a decisão, dar retorno ao Leonardo Menegildo sobre a reunião. A parcela 004 vence em 13/10.
- #0048: cobrar o retorno da Santer sobre o aditivo em 07/10 (a tarefa já está no sistema). A parcela 01 vence em 20/10, e a nota fiscal com o boleto precisa sair até 10/10.
- Fazer o modelo de procuração do cliente para o Grupo Ao Cubo (sem ela o modelo Cliente não vincula o cliente), se a Paula confirmar.

## Quente agora
Retomada de Instagram + blog rodando de verdade (2026-09-17): calendário fixo terça/quinta,
formatos "Conto Jurídico"/"Série Real" e "Acho chic" validados e publicados, skill
`/postar-instagram` em uso. Reels retomado em 28/09 (primeiro publicado, gancho CASA COR) — skill
`/postar-instagram` agora publica vídeo também. Fonte editorial padrão (Borna Bold) e padrão de
composição de texto sobre foto fixados nessa mesma sessão, valem pra toda peça nova desse tipo.
Primeira História em Série concluída (30/09 a 02/10, três partes + artigo do blog); decidir quando entra a próxima, sem repetir o padrão de pico-e-parada.
App financeiro (`financeiro-paula`) recém-criado em 2026-09-01 — Paula está testando no dia a dia (marcar pago, editar, lançar retroativo), ainda ajustando dados de recorrentes conforme usa.
