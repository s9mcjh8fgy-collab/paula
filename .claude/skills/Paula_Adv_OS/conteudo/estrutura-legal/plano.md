# Instagram @estruturalegal: plano comercial do Contrato na Régua

Início: 18/11/2026

## Decisões
- Perfil comercial, desvinculado da Paula: **sem rosto e sem voz** (narração por IA, telas do app, mãos, fotos de obra e projeto)
- Os 40 posts atuais (repostes do @paulacorrea.adv) vão para o **arquivo**. Dá pra restaurar depois
- Oferta única por enquanto: **Contrato na Régua** (R$ 97). O Contrato Sob Medida entra quando a Hotmart estiver finalizada
- Mídia paga: **R$ 500 a R$ 1.500/mês**, começando perto de R$ 600 e subindo só com criativo validado
- Público: arquiteto autônomo ou de escritório pequeno, que faz projeto e às vezes acompanha a obra

## Regra de ética (OAB)
O perfil vende uma **ferramenta**, não serviço jurídico. Nada de "fale com uma advogada", "consulta", "me chama" ou promessa de resultado. O "Precisa de outro contrato?" fica só dentro do app. A marca pode dizer que o conteúdo do contrato foi feito por advogada especialista em construção civil, sem nome nem OAB no feed.

## Fase 1: base do perfil
- **Nome (campo pesquisável):** Estrutura Legal | Contrato de Arquitetura
- **Bio (rascunho):**
  > Contrato de arquitetura pronto em minutos 📐
  > Cláusulas de responsabilidade explicadas, anexo de escopo e Word com a sua logo
  > ↓ Conheça o Contrato na Régua
- **Link:** estruturalegal.com.br/contrato-na-regua (sem UTM: a Paula achou feio, e o pixel mede a origem)
- **Destaques:** Como funciona · O que vem no contrato · Dúvidas · Quem usa
- **Foto:** manter o selo laranja
- **Limpeza:** arquivar os 40 posts. O perfil segue 3.622 contas: avaliar uma limpeza aos poucos, porque a proporção atual tem cara de perfil de "seguir para ser seguido"

## Fase 2: kit visual
Identidade do site e do app: laranja `#F26F4D`, marrom `#6D413E`, tinta `#3E2624`, bege `#F1EBDF`, creme `#E3D6C6`, papel `#FFFDF9`, fonte Borna (`ferramentas/contrato-na-regua/site/borna.otf`).

Modelos a criar (HTML → PNG/MP4, como na `/carrossel`):
- Carrossel 4:5 (capa com gancho, miolo, slide final com o produto)
- Post fixo 4:5
- Reels 9:16: tela do app gravada + legenda grande + narração IA (reaproveitar `materiais/video/gravar.js`, `tts.py` e `montar.py`)
- Story 9:16 com espaço para adesivo de link

Viraria a skill `/conteudo-estrutura-legal`, separada da `/carrossel` (que é da marca pessoal).

## Fase 3: linha editorial (3 posts/semana)
| Pilar | Objetivo | Exemplos |
|---|---|---|
| **Dor** | Fazer o arquiteto se reconhecer | "O cliente pediu mais uma revisão. Seu contrato diz quantas estão incluídas?" · "Obra atrasou e a culpa caiu em você" · "Acompanhar obra não é gerenciar obra" |
| **Produto** | Mostrar o app funcionando | "Do zero ao contrato em Word em 5 minutos" · "O anexo de escopo que acaba com o 'mas eu achei que estava incluso'" · Termo de Aceite |
| **Objeção** | Tirar o freio da compra | "Já tenho um contrato da internet" · "R$ 97 por um contrato?" · "Serve para interiores?" · "E se a lei mudar?" |
| **Prova** | Dar confiança | Feedbacks de quem usou (com autorização, sem nome se preferirem), números de uso, bastidores do produto |

Proporção: 40% dor, 30% produto, 20% objeção, 10% prova. Toda peça termina no produto, com CTA "link na bio" ou "comenta CONTRATO" (para automação de direct depois).

### Abertura do perfil (antes da grade)
Três carrosséis de apresentação, publicados nesta ordem (na grade ficam da direita para a esquerda, formando a primeira linha): `00a-prazer` (laranja), `00b-para-quem` (marrom), `00c-o-que-esperar` (bege, termina chamando o post das 5 cláusulas).

### Primeiros 9 posts (grade de abertura)
1. Carrossel: "5 cláusulas que todo contrato de arquitetura precisa ter" (dor + produto no final)
2. Reels: tela do app gerando o contrato em tempo real
3. Post fixo: "Contrato de arquitetura por R$ 97. Uma vez. Seu para sempre."
4. Carrossel: "Projeto, acompanhamento, gerenciamento e execução: qual você faz? Seu contrato sabe?" (aproveita a aula do Desvendarq)
5. Reels: "O cliente pediu a 7ª revisão" (situação + como o contrato resolve)
6. Carrossel: "Contrato da internet x Contrato na Régua"
7. Reels: o anexo de escopo
8. Post fixo: feedback de usuário
9. Carrossel: "O que acontece quando a obra atrasa e o contrato não diz nada"

## Fase 4: mídia paga
**Pré-requisitos**
- @estruturalegal e página do Facebook ligados ao Business Manager e à conta de anúncio (conferir se dá pra usar a `act_450995911083244` ou se vale uma conta separada para o Estrutura Legal)
- Pixel da Meta na página de vendas (Cloudflare Pages) + integração do pixel na Hotmart (evento de compra)
- Conferir se o token da `meta-ads-ratos` alcança o novo perfil (para postar pela API também)

**Estrutura**
- Campanha de **Vendas**, otimizada para compra (ou início de checkout enquanto não houver volume)
- Conjunto 1, frio: interesses de arquitetura e design de interiores, 25 a 55 anos, Brasil · ~R$ 15/dia
- Conjunto 2, remarketing: visitou a página e não comprou + engajou com o perfil nos últimos 30 dias · ~R$ 5/dia
- 3 a 5 criativos em teste (reels de tela do app, carrossel de dor, estático de oferta)

**Conta do custo por venda:** R$ 97 menos a taxa da Hotmart deixa cerca de R$ 86. Meta inicial: custo por venda até R$ 50. Acima de R$ 86, a venda dá prejuízo e o criativo é trocado.

**Ritmo:** 7 dias sem mexer → corta os criativos piores → coloca 2 novos → sobe a verba do vencedor em até 20% a cada 3 dias.

## Como produzir
- Kit em `kit/` (`estilo.css`, `regua.js`, fonte Borna, prints do app). Render: `node conteudo/estrutura-legal/kit/render.js <pasta-do-post>`
- Reels: `roteiro.json` na pasta do post + `python ../../kit/reels.py` (cenas frase, app, doc e fecho; narração edge-tts com legenda sincronizada). Exemplo: `posts/04-reels-3-frases/`
- Postar: `/postar-instagram` com `IG_CONTA=estruturalegal`

## Próximos passos
1. [ ] Paula: arquivar os 40 posts e trocar nome e bio
2. [x] Claude: kit visual (18/11)
3. [x] Claude: 3 primeiros posts (18/11): `posts/01-cinco-clausulas`, `02-reels-app` (com legenda embutida), `03-oferta`, aguardando aprovação
3b. [x] Claude: 3 posts de apresentação (18/11): `posts/00a`, `00b`, `00c`, aguardando aprovação
4. [ ] Paula + Claude: ligar o perfil ao Business Manager e instalar o pixel
5. [ ] Claude: destaques (capas e stories de cada um)
6. [ ] Primeira campanha no ar com os criativos 2, 3 e 5

## Registro
- 18/11: Instagram ligado ao portfólio Paula Corrêa Advocacia (página FB 1515278704991849, IG 17841447400429801), conta de anúncios `act_1810075666928959` (cartão Elo, Claude_ads com acesso total), cadastrados em `meta-ads-ratos/contas.yaml` como `estruturalegal`
- 18/11: 40 posts antigos arquivados; publicados os 3 de apresentação (00a https://www.instagram.com/p/Df5V0OxDP3r/, 00b https://www.instagram.com/p/Df5V6x3jAZ8/, 00c https://www.instagram.com/p/Df5WB3fDL3A/)
- 18/11: Pixel Estrutura Legal `1140358028912865` criado e instalado em estruturalegal.com.br/contrato-na-regua (PageView, ViewContent, InitiateCheckout no clique de compra). Deploy feito a partir da versão em produção (commit 7d16e48) + pixel, para não publicar a raiz nova e o /sob-medida. A pasta local `site/` já tem o pixel. Paula ligando o pixel na Hotmart (compra)
- Teto do teste: R$ 50 por venda (sobra ~R$ 36); revisar para baixo depois de 2 semanas
- Reels `02-reels-app` fica como post orgânico (sai em 19/11 junto com o carrossel das 5 cláusulas). Para anúncio: `04-reels-3-frases` (30 s, frases do cliente em voz masculina, resposta com o texto real da cláusula, legenda embutida), gerado com `kit/reels.py` a partir de `roteiro.json`
