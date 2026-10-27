# Agora — contexto vivo

> Este é o contexto que muda toda semana (diferente de `estrategia.md`, que é o foco de fundo).
> O `/iniciar` lê isto no começo da sessão; o `/atualizar` escreve aqui no fim.
> Mantenha curto: o que passou de ~30 dias sai daqui (vai pro histórico ou some).

## Onde paramos
#0145 (Nordyk x Católica SC, 27/10): contrato de prestação de serviços do Plano Diretor de Uso, Ocupação e Desenvolvimento do Campus (Fundação Educacional Regional Jaraguaense, CNPJ 83.130.229/0001-78, Grupo Marista). Feito a partir do modelo de projeto arquitetônico da Nordyk. Valores: R$ 70.000,00, sendo 5 parcelas de R$ 11.200,00 com NF no dia 01 e pagamento no último dia útil, mais R$ 14.000,00 depois da entrega final. Início em 03/11/2026. Enviado à Nordyk na versão limpa e numa versão com os ajustes em amarelo em relação ao modelo. Demanda concluída.

## Decisões recentes
- 2026-10-27: Nordyk com investidor. O valor do estudo é um percentual sobre o valor atribuído ao terreno na venda ou permuta. A construtora escolhe entre contratar o projeto (preço de referência por m²) ou pagar o estudo. O investidor responde só se a cláusula não entrar no contrato de permuta ou se a construtora escolher pagar o estudo e não pagar. Se a construtora contratar o projeto, o investidor fica liberado, sem responder por inadimplemento futuro.
- 2026-10-27: risco de venda casada na parceria Nordyk/investidor é baixo. O CDC não se aplica (construtora não é consumidora) e a Lei 12.529 exige poder de mercado. A escolha entre projeto e estudo afasta o condicionamento.
- 2026-10-27: arquiteto não recebe "comissão" nem "parte da corretagem". Nos termos de parceria com imobiliária, a remuneração é pelos estudos técnicos, e a corretagem entra só como base de cálculo (Lei 6.530/78 e Código de Ética do COFECI).
- 2026-10-26: quando o reembolso das guias do INPI é quitado, o card de reembolso sai do relatório do cliente (o link raiz sempre mostra só o que está pendente).
- 2026-10-26: os modelos `Procuração (PF)` e `Contrato (PF)` em Credenciais tinham sido salvos por cima com os dados da Luriane (14/10, editados direto no Word). Foram gerados de novo limpos pelo `gerar_modelos.py`. O documento de cliente nunca é editado a partir do arquivo da Credenciais: é preciso salvar uma cópia antes, ou usar a `/documento-cliente`.
- 2026-10-26: demanda (`criadoPor`) e tarefa (`assigned_to`) são sempre da Paula por padrão. Só ficam com a Thaís quando a Paula avisar.
- 2026-10-26: no contrato de obra do Ao Cubo com a Chokolaten (#0139): multa por atraso diária de 0,1% do valor total, limitada a 10%, incidindo sozinha no dia seguinte ao fim do prazo, sem notificação. Atraso de fornecedor não contratado pelo Ao Cubo (gesso, marcenaria, marmoraria, esquadrias e portas) estende o prazo automaticamente. Valor com tributos já incluídos. O modelo padrão do Ao Cubo (cl. 4.7.1) ainda diz que os tributos são "acrescidos ao valor".
- 2026-10-26: no contrato de Elaboração de Documentos, compartilhar o documento com as outras partes do negócio e com quem é necessário para concretizá-lo (contador, investidor, assessor, cartório, órgão público) não precisa de autorização (item XVI.2 do modelo). A multa de 10 vezes o valor do contrato continua e não é negociável.
- 2026-10-26: cláusula sobre cobranças por canais não oficiais e golpes incluída em todos os modelos de contrato da Credenciais. No INPI, a cláusula geral é o item XI e o aviso sobre boletos falsos do INPI virou o XI.1.
- 2026-10-26: no gerador dos modelos (`gerar_modelos.py`), quando uma cláusula nova empurra local, data e assinaturas para uma página sozinha, o parâmetro `cond` diminui um pouco o espaço entre as linhas das cláusulas.
- 2026-10-26: locação de 12 meses que passou a valer por prazo indeterminado não pode ser encerrada pela dona só com aviso de 30 dias (art. 47 da Lei do Inquilinato). Para vender, o caminho é a notificação de preferência (art. 27) e, depois da venda, o comprador encerra a locação dando 90 dias (art. 8º).
- 2026-10-08: blog do site não tem seção de comentários. CTA de fechamento no blog é sempre convite pra compartilhar o texto ("se você conhece alguém que..., compartilha este texto com essa pessoa"); no Instagram, convidar pra comentar continua ok.
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
- 2026-10-02: a defesa da #0107 não usa o modelo que circulou no grupo de WhatsApp (genérico e com a afirmação de que a cliente "indica lojas"). A nota de esclarecimento do "Club Partners" não tem versão assinada, então serve só como fonte de argumentos e não vai como anexo. A peça não nega fatos sem confirmação da cliente (art. 23, §3º, I da Res. 143).
- 2026-10-05: pedir indexação manual de cada post não é rotina. O sitemap (já enviado desde 10/09, 95 páginas) cuida disso. O relatório de segunda confere os posts recentes e só alerta se algum passar de 7 dias sem indexar. O painel do Search Console não abre com a conta de marca "Paula Corrêa Advocacia" (erro 403); é preciso entrar com uma conta pessoal do Google.
- 2026-10-06: texto com várias linhas por tela vai em carrossel, não em Reels de slides, porque no vídeo não dá tempo de ler. Música em alta só entra quando a Paula publica pelo app (a API não coloca música, nem em carrossel nem em Reels), então post com música sai por ela, e eu entrego as imagens no chat e a legenda pronta. A API do Instagram não tem rascunho: o container não publicado não aparece no app e expira em 24 horas.
- 2026-10-05: na declaração para a Icatu, não entrou a informação de que o Wilian não é filho biológico. Ele é herdeiro registral, e mencionar isso só complicaria a análise.
- 2026-10-06: o acordo de sócios vigente da Exxell é a 1ª alteração (v27-02-2026), sem via assinada no arquivo. As regras de desligamento (cl. 8) valem para todos os sócios, inclusive os de capital, mas não preveem o valor das cotas. Os erros de redação e a cl. 10.1(b), que encerra o acordo quando entra um sócio novo, ficam para a próxima versão (lista na memória `project_exxell_acordo_socios_correcoes`). A cl. 8.3.1 (desligamento por "reorganização estratégica") ficou fora do esqueleto porque é juridicamente frágil.
- 2026-10-06: no seguimento de uma demanda, se a tarefa aberta tem o mesmo tema, ela é atualizada (nova data e andamento). Só se cria tarefa nova quando o tema muda.
- 2026-10-06: a LRG Romani tem duas pastas, de propósito. `2_Pessoa Jurídica (PJ)/1_Processos/Proc 4927 - LRG Romani Ltda/` é só do registro no INPI (cadastrado no Legal One), e `2_Pessoa Jurídica (PJ)/LRG Romani Ltda/` é só da parte de contratos.
- 2026-10-06: gravação e transcrição de sessões na LRG modeladas pela Res. CFP 13/2022, art. 11. A ferramenta é opcional, ativada pelo psicólogo e travada até o paciente aceitar o termo específico. O psicólogo é controlador do conteúdo e a plataforma é operadora, sem acesso e sem uso para treinar IA. Contrato do psicólogo no modelo de intermediação: o psicólogo contrata a plataforma e paga comissão.
- 2026-10-06: cessão de software cobre só o programa (sem marca nem logo) e identifica o código-fonte pelo hash SHA-512 da versão de referência. O hash também serve para o registro no INPI.
- 2026-10-06: minuta enviada a cliente para validação leva no topo "Minuta preliminar para validação", lacunas em amarelo e notas em quadro bege com borda laranja (#F1EBDF/#F26F4D). Assim o envio não conta como a entrega formal do contrato de elaboração de documentos.
- 2026-10-09: no contrato do Ao Cubo com a Blutech (11/06/2026, aditivo de 12/06 com a R&J como contratante solidária), as cl. 13.1, 13.4 (Ao Cubo não responde por terceiro contratado diretamente pelo contratante) e 13.8 (responsabilidade limitada à remuneração de gerenciamento) ficam em reserva, só se a Blutech partir para responsabilizar o Ao Cubo. Por decisão da Paula, as tratativas com a Blutech não discutem quem é o responsável; o foco é envolver a R&J.
- 2026-10-13: slide de proposta com muito texto não usa fundo laranja, porque fica difícil de ler. O laranja fica só como acento (faixa lateral, valor, título em itálico).
- 2026-10-13: o `render-pdf.js` da `/proposta-comercial` gerava o PDF antes de carregar o Inter, e o texto saía em Arial. O script foi corrigido para esperar as fontes. As propostas anteriores feitas com ele provavelmente saíram em Arial.
- 2026-10-13: no e-mail da Consisa à CustomerX pedindo os dados, não perguntar sobre custos.
- 2026-10-13: na #0127, a cláusula de limitação de responsabilidade ficou de fora. O contrato já veio revisado pela outra parte e a Paula não quis criar mais um obstáculo.
- 2026-10-15: a API do WordPress devolve 406 quando a chamada manda User-Agent "Mozilla/5.0". Nos scripts de publicação não se define User-Agent.
- 2026-10-15: e-mail ou mensagem que a Paula pede para enviar usa a saudação conforme o horário do pedido (bom dia, boa tarde ou boa noite), porque ela envia na hora.
- 2026-10-16: na #0061 não se rebate a acusação de responsabilidade do Ao Cubo feita pela Blutech; as cl. 13.4 e 13.8 seguem guardadas. Se a Menegildo recusar os R$ 18.250,00, os caminhos são consignação em pagamento (art. 335, I do CC e art. 539, §1º do CPC), pagamento do incontroverso com ressalva, ou pagamento do total e busca judicial da diferença.
- 2026-10-16: no aceite do desconto da CustomerX, o tom ficou mais suave por decisão da Paula. Em vez de dizer "não vamos renovar", o texto diz que a Consisa vai avaliar e pede que o contrato não seja renovado automaticamente.
- 2026-10-22: artigo de blog tem um ângulo só. Ir e voltar entre lados diferentes do mesmo tema (o profissional que usa IA x o cliente que usa o projeto numa IA) deixa o texto confuso.
- 2026-10-22: carrossel informativo que só explica jurisprudência (caso Airbnb) ficou vazio pra Paula. Ela prefere histórias com enredo (Conto Jurídico).
- 2026-10-22: o tema IA no projeto já saiu no feed em 07/04/2026. Não repetir como carrossel informativo; como conto, tudo bem.
- 2026-10-22: no aditivo da Santer (#0048), o Estúdio aceita adiar o início dos pagamentos, mas não aceita que as datas possam mudar depois. Se o cliente adiar o início do projeto, mudam os prazos de entrega, nunca as datas de pagamento.
- 2026-10-23: na rerratificação da Cleusa, a livre utilização (art. 24, V) entra sem ressalva. O conflito com a proibição de construir foi resolvido mudando o título da Cláusula Sétima para "Das obras e benfeitorias até a quitação": construir é alteração da garantia, não uso.
- 2026-10-23: valor para leilão (art. 24, VI) = valor do contrato, revisto na consolidação por avaliação de mercado (corretor com CRECI e CNAI via PTAM, ou engenheiro/arquiteto avaliador). Se a avaliação não for feita, vale o IPCA, sempre com o piso da base do ITBI. A lei não impõe índice, mas o critério precisa ser objetivo.
- 2026-10-23: o contrato original da Cleusa foi assinado em 01/10/2026, mesma data do Pix da entrada. O fecho com "23 de setembro" está errado.
- 2026-10-23: quando a outra parte devolve um contrato com ajustes, o que é aceito vai direto como aceito, e as mudanças nossas entram em controle de alterações com comentário em cada uma. O e-mail ao cliente só avisa que os ajustes já estão no arquivo. Assim fica mais prático para o cliente analisar.
- 2026-10-23: um .docx gerado do zero pelo python-docx leva uma pasta interna `[trash]`, e o MailScanner bloqueia o arquivo como vírus. Antes de entregar, é preciso limpar o arquivo (detalhes na memória `feedback-python-docx-trash-mailscanner`).
- 2026-10-23: prestador PJ que já atuou como estagiário sem registro recebe declaração de atividades como prestação de serviços, nunca como estágio. Ficam de fora "supervisão", "orientação" e o período, pra não sugerir subordinação nem puxar a fase sem registro.
- 2026-10-23: CNPJ do Leonardo Zanatta Estúdio é 47.758.189/0001-40 (contrato social). Os contratos antigos dos colaboradores (Ane, Davi, Henrique, Lucas, Nathalia e o distrato do Lucas) têm 47.458 e ficaram como estão, porque provavelmente já foram assinados.
- 2026-10-23: em apresentação, o resultado de formulário com poucas respostas aparece só como temas ou frases que se repetiram, sem números nem quantidade de respostas.
- 2026-10-23: Estrutura Legal retomado só para arquitetos, em 3 degraus: Contrato na Régua (R$ 67), Kit Jornada do Cliente (R$ 497, documentos + manual prático de uso, sem aulas gravadas) e Estrutura Legal completo (R$ 4.100 em até 12x sem juros: 3 jornadas personalizadas, diagnóstico e 6 meses de acompanhamento).
- 2026-10-23: parceria Desvendarq. Aula gratuita ao vivo sobre responsabilidade civil do arquiteto para a lista da Miriam (novembro, data a definir), com venda do Contrato na Régua no final. Comissão de 15% para a Miriam. A divisão produto x serviço (OAB) a Paula explica pessoalmente, não entra escrita nos materiais. Materiais da parceria vão para `04 Estrutura Legal/Desvendarq/`, não para Vendas.
- 2026-10-27: quando um contrato é feito a partir do modelo de um cliente, dá pra entregar também uma versão "ajustes em amarelo", com diff por palavra em relação ao modelo (renumeração e troca de travessão não contam). O que foi excluído não aparece na marcação e precisa ser explicado na mensagem.

## Pendências
- #0141 (Nordyk): revisar e enviar ao Bruno o termo do investidor (tarefa até 30/10). Definir o percentual do estudo e o preço por m². Depois de aprovado, salvar no `05_Modelos` da Nordyk.
- #0140 (Nordyk): enviar ao Bruno o termo das imobiliárias revisado, junto com o do investidor. O cadastro da Nordyk no sistema está sem `folder_url`.
- Ed / Icatu: o Edilson precisa assinar a declaração pelo gov.br ou com firma reconhecida. Falta montar o PDF de anexo com os documentos dos outros herdeiros, separando as páginas da íntegra do inventário (eventos 1, 5, 6, 22, 32 e 33). Depois é enviar tudo à Icatu e reenviar a declaração de herdeiros, que chegou com a assinatura digital corrompida. A proposta nº 060013891190 normalmente vai da cooperativa direto para a Icatu, então vale confirmar com a Sicredi.
- Corrigir nos modelos de contrato do escritório (Ao Cubo e outros) a citação "MP nº 2.220-2/2001" para 2.200-2/2001.
- Apagar no Canva a pasta "_Temp - conversão Word (pode apagar)" (12 cópias usadas só pra leitura; o conector não apaga).
- Avaliar conector de WhatsApp Business e integração com Legal One (sem MCP pronto no catálogo ainda).
- Seguir o calendário fixo a partir de 21/09/2026 (terça Instagram, quinta blog + Instagram) — próximo do blog: semana 8, multa por atraso em obra (ver `conteudo/estrategia-retomada/calendario-blog.md`).
- Qua 21/10: story com as perguntas (desdobramento do carrossel "posso pesar o clima?", publicado em 20/10), material em `conteudo/instagram/carrossel/posso-pesar-o-clima/stories/` e `conteudo/instagram/stories/`.
- Ter 27/10: definir o post. O carrossel informativo do Airbnb foi recusado, mas o caso #0132 (`conteudo/casos/caso-airbnb-condominio-residencial.md`) pode virar o blog da semana 9 (condomínio); conferir antes o andamento do Tema 1.443 (em 22/10 ainda sem julgamento, processos suspensos).
- Conto do pilar/IA: aprovar o texto, gerar os slides e publicar (era pro Instagram de 22/10).
- Fátima (arquiteta, prospecção 22/10): aguardar a resposta. Se ela responder, oferecer o modelo de cláusula de IA e mandar o link do post novo. Se não responder, retomar em 7 a 10 dias com conteúdo, sem oferta.
- Confirmar com qual conta do Google a Paula acessa o painel do Search Console e registrar na skill.
- Candidatas a História em Série ou conto: #0063 (cliente que sumiu e voltou com advogado; reviravolta: depois da demolição o terreno era menor) e #0104 (eletricista "não atendo mais"; mesmo tema do post de 08/10, esperar um pouco).
- #0062: consultar o andamento do protocolo 52601432511 no CREA-SC em 16/10 (tarefa já criada no sistema).
- Contrato na Régua: reformular como produto pago (R$ 67) antes da aula de novembro. Itens: tipos de serviço, cláusulas de responsabilidade explicadas, anexo de escopo, saída em Word com logo, guia de apresentação ao cliente e bônus de termo de aceite de etapa. Entrega via Hotmart.
- Desvendarq: enviar a proposta e o "Conheça" à Miriam, definir a data da aula e montar o roteiro da aula de responsabilidade civil.
- Leonardo Zanatta: falta uma foto ou render da Luminária de teto BR 30 2025 005775 2.
- Leonardo Zanatta, Sofás BR 30 2025 005807 4: acompanhar as próximas revistas do INPI. A resposta à exigência foi enviada em 13/07, mas o comprovante não foi salvo e, até 26/10 (RPI 2911), o pePI não lista a petição. Localizar o comprovante ou o nº da petição do envio de 13/07; se sair arquivamento, avaliar com base nos registros do envio.
- Confirmar a classe Locarno dos três pedidos de 02/10 (BR 30 2026 007637-7, 007638-5 e 007639-3).
- Autorizar os MCP servers da Cloudflare (`cloudflare-api`, `cloudflare-bindings`, `cloudflare-builds`, `cloudflare-observability`) via `/mcp` numa sessão interativa, quando for usar algum projeto Cloudflare que precise deles.
- Cadastrar no app financeiro (como recorrente) os impostos, o salário da Thaís e as parcelas de empréstimo assim que a Paula tiver valores/prazos confiáveis pra projetar — hoje ficam de fora por variarem demais mês a mês.
- Confirmar nas próximas semanas que o erro do Wordfence não volta mais depois da remoção da Proteção Estendida (28/09) — se voltar, não é mais o mesmo problema, investigar do zero.
- Demanda #0116 (Grupo Ao Cubo): Paula revisar as versões `_v2` (conferir os números definidos: 15 dias, 48h, 5 dias úteis, 12 meses, 0,5%/10%), aprovar e tirar o destaque amarelo; atualizar a demanda no sistema.
- #0061: aguardando a orientação da Dra. Vivian sobre como seguir diante do silêncio da Menegildo (cobrar em 26/10). Combinar com ela o caminho se a Menegildo recusar os R$ 18.250,00.
- #0127 (Projjetta x FORNAC): minuta revisada enviada ao Fernando em 13/10 (link do SharePoint já gravado). Aguardando a decisão dele sobre o acúmulo das horas (2.7), a proposta comercial (Anexo I) e se a mensalidade é antecipada ou vencida; demanda encerrada e sem tarefa, o Fernando chama quando tiver retorno, e aí reabrir e ajustar o 2.7. A limitação de responsabilidade foi retirada pela Paula, para não criar mais um obstáculo.
- #0048: aguardando a Santer (Larisi) responder à contraproposta de 22/10 (cobrar em 27/10). Se aprovarem, preparar o `06 ADITIVO` com a nova Cláusula Terceira.
- #0128: aguardar o retorno da CustomerX sobre o aceite do desconto sem a renovação. Se ela condicionar o desconto à renovação, rever a estratégia.
- Flavia Yung Ju: aguardando a escolha da opção. Se ela fechar, o contrato de honorários sai pela `/documento-cliente`, e depois vem o pedido da proposta do Dr. Cavinato e dos documentos da clínica. No contrato social, só o pai aparecia como administrador, e o Victor é sócio com 0,5%.
- App financeiro (`financeiro-paula`): a Paula não gostou de como ficou e quer revisar mais pra frente. Manter a documentação como está até lá.
- Siegel: aguardando o aceite da proposta e as respostas do Fabiano (como soube da ação, onde morava entre 09/2025 e 02/2026, WhatsApp e bilhetes da oficial, Domicílio Eletrônico, versão sobre o vínculo, Simples ou CPRB). Se fechar: pedir endereço e documentos da obra ativa em Itapema (alvará, ART/RRT, CNO, notas de material), prova de que o Luis Carlos trabalhou lá, comprovante do bloqueio, procuração e contrato social. Antes da peça, pesquisar a jurisprudência do TRT12 sobre edital sem diligência no local da obra. Peça pela `/peca-processual`, com urgência por causa da repetição do SISBAJUD.
- Tersaúde: gerar o PDF do contrato ajustado em 26/10 e enviar à Monique com a resposta. Pedir o contrato social ou um cartão CNPJ atualizado da LTDA. Com ele, ajustar a razão social e o endereço no contrato de honorários antes da assinatura e preencher a data da 1ª parcela. Depois da reunião, fazer a minuta revisada do vesting conforme a decisão da Monique: Acordo de Sócios novo (orçado à parte, cl. XII) ou regras de saída dentro do próprio contrato.
- Serv 2918 (Cleusa): enviar a rerratificação ao Norberto e aguardar a análise dele. Ele precisa confirmar as declarações (sobretudo INSS/empregados) e os dados da conta no Mercado Pago. Também faltam a certidão de nascimento da Cleusa (já pedida) e a de casamento do Norberto com o divórcio averbado. Depois disso, as partes marcam a assinatura, com firma reconhecida por autenticidade, testemunhas incluídas, antes de 09/11. Ainda está em aberto se a data do fecho (23/09 para 01/10) entra na rerratificação.
- #0118: confirmar se o contrato do Gabriel já tinha sido assinado com o CNPJ errado. Se sim, fazer um aditivo curto ou colher nova assinatura.
- #0135 (Edgar x WS Engenharia): a Thaís elabora a notificação e envia a engenhariawalter@gmail.com até 27/10, cobrando as duas parcelas com multa de 2%, juros de 1% ao mês e IPCA (cl. 7). Foi combinado com o Edgar o envio na segunda ou terça.
- Fazer o modelo de procuração do cliente para o Grupo Ao Cubo (sem ela o modelo Cliente não vincula o cliente), se a Paula confirmar.
- #0138 (Projjetta x Hospital Santa Julia): aguardando o Fernando. Ele precisa validar os prazos do SLA (são mais curtos que os da Maxiplan, #0100) e preencher o e-mail e o telefone do suporte no item 3.1 do anexo. Também precisa alinhar com o João se os dados saem do hospital para o provedor de IA (dado de saúde é sensível pela LGPD), confirmar que a suspensão não afeta o Tasy, preencher o e-mail do Hospital no quadro-resumo e conferir o endereço da Proclick. O link do SharePoint foi gravado pelo caminho da pasta, mas a busca ainda não encontrava a pasta; conferir na próxima vez.
- Palestra Dalbosco (26/10): confirmar com a Simone a duração (o roteiro foi pensado pra 1h15 mais perguntas), se é presencial ou online, se as alunas recebem o PDF e se ela topa ser citada no exemplo de marca. Conferir no DOU o número da lei nova do MEI (as notícias falam em LC 238/2026, do PLP 186/2026) e se a tolerância de 20% continua.
- Modelo de contrato de obra do Grupo Ao Cubo: avaliar se a regra dos tributos (4.7.1/4.7.2) e a cláusula de atraso de terceiros (3.4) entram no modelo padrão, já que as propostas do Ao Cubo costumam trazer o preço com a nota fiscal incluída.
- Iara (venda do loft, apto 703 do Edifício Fênix): preencher na notificação o preço, a forma de pagamento, os ônus e a matrícula, e enviar à Gerglei por e-mail (gerperu05@hotmail.com) e WhatsApp, pedindo confirmação. Se ela não confirmar, mandar por carta com AR. Decidir se a Iara abre mão do aviso de 30 dias da inquilina. Arquivo: `6_Colaboradores/Paula/Iara/Notificação venda e preferência - Gerglei.docx`.
- Alvina Lucas de Mello Schuko (locadora, cobrança de aluguéis e encargos do locatário Erly Cardoso de Andrade e dos fiadores Jardson e Janderson): procuração e contrato de honorários (R$ 4.500,00 em até 5x de R$ 900,00) prontos em `1_Pessoa Física (PF)/2_Processos/Alvina Lucas de Mello Schuko/`. Faltam a data do 1º vencimento e o CEP do endereço dela. Depois da assinatura, cadastrar no Legal One.
- #0145 (Nordyk x Católica): quando a Nordyk passar os dados, preencher o representante legal e o responsável na Católica. Acompanhar o retorno do jurídico da Católica (Grupo Marista, demora). Confirmar se a primeira NF é mesmo em 01/12/2026. Ficaram como sugestão ao Bruno: um prazo fixo para liberar a parcela final se o atraso for da Católica, e reduzir o prazo de devolutiva de 20 dias úteis. O link do SharePoint foi gravado pelo caminho da pasta, mas a busca ainda mostra o nome antigo ("Nova pasta"); conferir na próxima vez.

## Quente agora
Calendário fixo do Instagram e do blog rodando (terça e quinta). Em 15/10 saíram 2 posts no blog (reserva técnica e contrato de arquitetura/engenharia, este com seção sobre uso de IA). Semana 7 do blog publicada em 22/10 (IA, uso indevido do projeto pelo cliente). Próximo: semana 8, multa por atraso em obra.
Duas Histórias em Série concluídas (prédio, 30/09 a 02/10; prêmio da arquiteta, 14 e 15/10), cada uma com artigo do blog como gancho. Decidir quando entra a próxima, sem repetir o padrão de pico e parada.
Segunda, 26/10: masterclass na mentoria da Simone Dalbosco.
Parceria Desvendarq: Contrato na Régua precisa ficar pronto até a aula de novembro.
