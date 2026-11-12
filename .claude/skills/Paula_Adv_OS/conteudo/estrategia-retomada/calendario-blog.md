# Calendário de retomada do blog (9 semanas, 1x/semana)

> Criado em 2026-09-10, depois da auditoria de SEO (ver `_contexto/agora.md`). Objetivo: sinalizar
> pro Google que o site está ativo de novo, aprofundando os temas que já rankeiam em vez de espalhar
> assunto novo. Publicação via skill `/blog-post`, direto no WordPress (API já conectada).

## Critério dos temas
Os 4 pilares que já têm posts publicados e alinhados com o posicionamento "Advocacia da Construção
Civil" — `advogado-para-construtoras`, `assessoria-juridica-para-arquitetos`,
`advogado-na-construcao-civil`, `advogado-em-blumenau` — servem de base. Os temas abaixo
aprofundam esses pilares com perguntas mais específicas (long-tail), o que ajuda tanto o SEO quanto
a autoridade do site no nicho. Cada post deve linkar internamente pro pilar relacionado.

**Sempre que a Paula tiver um caso real (anonimizado) que se encaixe num desses temas, ele substitui
o tema genérico** — conteúdo baseado em caso real converte melhor e é mais alinhado com a linha
editorial "Advocacia através dos meus casos".

## Calendário

| Semana | Tema | Pilar relacionado | Palavra-chave alvo |
|---|---|---|---|
| 1 | Contrato de empreitada: o que precisa ter pra proteger construtora e cliente | advogado-para-construtoras | contrato de empreitada |
| 2 | Atraso de obra: quem responde e como se proteger (construtoras e clientes) | advogado-para-construtoras | atraso de obra responsabilidade |
| 3 | Distrato de imóvel na planta: direitos do comprador e da construtora | advogado-para-construtoras | distrato imóvel na planta |
| 4 | Responsabilidade civil do arquiteto e do engenheiro por erro de projeto | assessoria-juridica-para-arquitetos | responsabilidade civil arquiteto erro de projeto |
| 5 | Cláusulas que não podem faltar no contrato de prestação de serviço de engenharia/arquitetura | assessoria-juridica-para-arquitetos / contrato-de-prestacao-de-servicos | contrato serviço engenharia cláusulas |
| 6 | Reserva técnica: o que o arquiteto pode receber de lojas e por que os prêmios entraram na mira do CAU (trocado pelo caso real #0107) | assessoria-juridica-para-arquitetos | reserva técnica arquiteto |
| 7 | Cliente colocou seu projeto numa IA? O que a lei diz e o que o contrato precisa prever (trocado: gancho da conversa de prospecção com arquiteta em 22/10) | assessoria-juridica-para-arquitetos | cliente usou meu projeto na IA / direito autoral projeto IA |
| 8 | Obra sem responsável técnico: ART/RRT e o autor do projeto que visita a obra (trocado a pedido da Paula; multa por atraso foi pra semana 9) | assessoria-juridica-para-arquitetos | ART RRT obra |
| 9 | Multa por atraso em obra: como calcular, cobrar ou se defender (caso real #0139) | advogado-na-construcao-civil | multa atraso obra |
| 10 | Vício construtivo: quem responde e qual o prazo de garantia (caso a definir) | advogado-na-construcao-civil | vício construtivo |
| 11 | Contratar PJ na obra ou no escritório: quando vira vínculo de emprego (#0089, #0073) | advogado-na-construcao-civil | pejotização construção civil |
| 12 | Reforma tributária: o que revisar nos contratos de obra e serviço antes de 2027 (#0154, #0139) | advogado-na-construcao-civil | reforma tributária contratos |
| 13 | Imagens das câmeras do condomínio: quem pode ver e quando entregar (#0088, #0115, #0121) | advogado-em-blumenau | advogado condominial |
| 14 | Inquilino que não paga: notificação, acordo e despejo (#0109, #0126, #0156) | advogado-imobiliario-e-da-construcao-civil | advogado imobiliário |

## Padrão de estrutura (definido na semana 1, 2026-09-10)
- Sempre incluir um bloco **"Leia também: [link]"** no meio do post, apontando pro pilar relacionado
  (mesmo formato visual dos posts antigos do site: `<h5><strong>Leia também:</strong> <a>...</a></h5>`)
- **Nunca usar o CTA "Fale agora com nossos especialistas"** (link direto de WhatsApp) que os posts
  antigos do site têm — contraria a regra de não usar captação direta de cliente (ver
  `_contexto/preferencias.md`). Usar CTA de engajamento no fechamento: convite pra compartilhar
  o texto (ex: "se você conhece alguém que..., compartilha este texto com essa pessoa"). O blog
  não tem seção de comentários, então nunca usar "comenta aqui" (corrigido nos 5 posts da
  retomada em 08/10/2026)
- O widget de compartilhamento em redes sociais no fim do post é automático (tema), não precisa
  inserir nada manual
- **Capa do post:** usar uma frase-gancho curta, diferente do título e do resumo (nunca repetir o
  título na imagem — a página já mostra ele grande em cima, fica redundante). Ex: título "Contrato
  de empreitada: o que precisa ter..." → capa "O que não tá no contrato, vira discussão na obra."
- **Resumo (excerpt) e tags:** sempre preencher os dois via API (não ficam automáticos) — resumo
  curto e diferente do texto de abertura do post; tags reaproveitando as do pilar relacionado

## Como funciona a rotina
1. No início de cada semana, revisar se tem caso real da semana anterior que substitui o tema genérico
2. Rodar `/blog-post` com o tema (ou o caso), já formatado pra colar/publicar no WordPress
3. Publicar (posso fazer direto via API, já conectada)
4. Depois de 4 semanas, revisar junto com a Paula: manter 1x/semana ou considerar subir ritmo

## Métrica de acompanhamento
Revisar dados do Search Console a partir da semana 2 (property `https://paulacorrea.adv.br/`,
verificada em 2026-09-10) — sitemap já enviado. Acompanhar impressões por consulta pra identificar
quais dos 8 temas (ou pilares antigos) estão ganhando visibilidade primeiro, e priorizar
aprofundamento nesses.

## Status
Calendário definido em 2026-09-10.
- [x] Semana 1 — publicado em 2026-09-10: https://paulacorrea.adv.br/contrato-de-empreitada-o-que-precisa-ter/
- [x] Semana 2 — publicado em 2026-09-17: https://paulacorrea.adv.br/atraso-de-obra-de-quem-e-a-responsabilidade-e-como-se-proteger/
- [x] Semana 3 — publicado em 2026-09-24: https://paulacorrea.adv.br/distrato-de-imovel-na-planta-quanto-voce-recebe-de-volta-e-em-quanto-tempo/
  (primeiro post no novo padrão mais profundo: ~1.000 palavras, com exemplo numérico e FAQ)
- [x] Extra (fora do calendário, gancho de atualidade) — publicado em 2026-09-28: "Expôs seu projeto na CASA COR? Os riscos jurídicos que todo arquiteto deveria conhecer" — https://paulacorrea.adv.br/expos-seu-projeto-na-casa-cor-os-riscos-juridicos-que-todo-arquiteto-deveria-conhecer/
- [x] Semana 4 — publicado em 2026-10-01: https://paulacorrea.adv.br/responsabilidade-civil-arquiteto-engenheiro-erro-de-projeto/ (gancho: História em Série do prédio)
- [x] Semana 5 — publicado em 2026-10-08 (post 6517): https://paulacorrea.adv.br/o-prestador-nao-terminou-o-servico-e-a-obra-tinha-data-marcada-o-que-o-contrato-precisava-dizer/ (tema trocado pelo caso real Menegildo, #0061/#0116: cláusulas do contrato com prestador na obra)
- [x] Semana 6 — publicado em 2026-10-15 (post 6525): https://paulacorrea.adv.br/reserva-tecnica-arquiteto-premios-lojas-cau/ (tema trocado pelo caso real #0107, gancho da História em Série do prêmio da arquiteta; multa por atraso passou pra semana 7)
- [x] Extra (fora do calendário, tema que ficou de fora na semana 5, com cláusula de uso de IA) — publicado em 2026-10-15 (post 6529): https://paulacorrea.adv.br/contrato-prestacao-servicos-arquitetura-engenharia/ (feito também pra servir de link nas abordagens a arquitetos/engenheiros indicados)
- [x] Semana 7 — publicado em 2026-10-22 (post 6532, capa = mídia 6535): https://paulacorrea.adv.br/cliente-colocou-projeto-na-ia-direito-autoral-contrato/ (recorte só do uso indevido do projeto pelo cliente em IA, arquitetos e engenheiros; multa por atraso passou pra semana 8)
- [x] Semana 8 — publicado em 2026-10-30 (post 6547, capa = mídia 6548): https://paulacorrea.adv.br/obra-sem-responsavel-tecnico-art-rrt/ (tema trocado a pedido da Paula: ART/RRT e o autor do projeto que visita obra sem responsável técnico pela execução, gancho da História em Série do arquiteto no grupo da obra; sem FAQ porque o texto ficou extenso; multa por atraso passou pra semana 9)
- [x] Semana 9 — publicado em 2026-11-12 (post 6608, capa = mídia 6609): https://paulacorrea.adv.br/multa-por-atraso-em-obra/ (caso real #0139, com o trecho do fornecedor de climatização que faltou em 11/11)
- [ ] Semanas 10 (19/11) a 14 (17/12): datas em `calendario-nov-dez-2026.md` (definido em 10/11). Os temas antigos das semanas 9 e 10 (condomínio em Blumenau e registro de projeto) saíram.
