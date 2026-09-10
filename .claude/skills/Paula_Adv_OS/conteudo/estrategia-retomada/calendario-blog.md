# Calendário de retomada do blog (8 semanas, 1x/semana)

> Criado em 2026-09-10, depois da auditoria de SEO (ver `_contexto/agora.md`). Objetivo: sinalizar
> pro Google que o site está ativo de novo, aprofundando os temas que já rankeiam em vez de espalhar
> assunto novo. Publicação via skill `/blog-post`, direto no WordPress (API já conectada).

## Critério dos temas
Os 4 pilares que já têm posts publicados e alinhados com o posicionamento "Advocacia da Construção
Civil" — `advogado-para-construtoras`, `assessoria-juridica-para-arquitetos`,
`advogado-na-construcao-civil`, `advogado-em-blumenau` — servem de base. Os 8 temas abaixo
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
| 6 | Multa por atraso em obra: como calcular e como cobrar (ou se defender) | advogado-na-construcao-civil | multa atraso obra |
| 7 | Advogado para condomínio em Blumenau: quando vale a pena ter assessoria fixa | advogado-em-blumenau / lgpd-para-condominios | advogado condomínio Blumenau |
| 8 | Como registrar um projeto arquitetônico: direito autoral do arquiteto na prática | assessoria-juridica-para-arquitetos / registro-de-marca | registro projeto arquitetônico direito autoral |

## Padrão de estrutura (definido na semana 1, 2026-09-10)
- Sempre incluir um bloco **"Leia também: [link]"** no meio do post, apontando pro pilar relacionado
  (mesmo formato visual dos posts antigos do site: `<h5><strong>Leia também:</strong> <a>...</a></h5>`)
- **Nunca usar o CTA "Fale agora com nossos especialistas"** (link direto de WhatsApp) que os posts
  antigos do site têm — contraria a regra de não usar captação direta de cliente (ver
  `_contexto/preferencias.md`). Usar CTA de engajamento no fechamento (ex: "comenta aqui se tiver
  dúvida")
- O widget de compartilhamento em redes sociais no fim do post é automático (tema), não precisa
  inserir nada manual

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
- [ ] Semana 2
- [ ] Semana 3
- [ ] Semana 4
- [ ] Semana 5
- [ ] Semana 6
- [ ] Semana 7
- [ ] Semana 8
