---
name: proposta-comercial
description: >
  Cria propostas comerciais em formato de deck de slides (HTML → PDF final) com a identidade
  visual da Paula Corrêa Advocacia. Parte de um briefing (de call, WhatsApp ou e-mail) com
  cliente, dor, escopo, valor e prazo. Use quando o usuário pedir "faz uma proposta comercial",
  "monta uma proposta pro cliente X", "proposta pra [nome]", ou colar anotações de uma call/troca
  de mensagem com um lead pra virar proposta. Também gera a Proposta Simples (1 página A4, modelo
  do Canva) pra casos pontuais, principalmente pessoa física: "proposta simples", "proposta
  pontual", "proposta pra PF", "proposta rápida pra mandar pro cliente".
---

# /proposta-comercial — Criação de Proposta Comercial

## Dependências

- **Identidade visual:** `marca/design-guide.md`
- **Contexto do negócio:** `_contexto/empresa.md`
- **Tom de voz:** `_contexto/preferencias.md`
- **Script de renderização:** `scripts/render-pdf.js` (dentro desta skill)

## Setup (primeira vez)

Verificar se `playwright` e `pdf-lib` estão instalados no workspace (`8_Claude/node_modules`):

```bash
node -e "require('playwright'); require('pdf-lib'); console.log('OK')"
```

Se faltar algum, instalar na raiz do workspace (`8_Claude/`):

```bash
npm install playwright pdf-lib
npx playwright install chromium
```

---

## Qual modelo usar

| Modelo | Quando | Formato |
|---|---|---|
| **Deck completo** (Fases 1 a 3 abaixo) | Empresas (construção civil ou outro ramo), assessoria mensal, escopo amplo | Slides 1920x1080 → PDF |
| **Proposta Simples** (seção no fim) | Caso pontual, principalmente pessoa física: uma ação, uma notificação, uma análise | 1 página A4 → PDF |

Se o pedido não deixar claro, perguntar qual dos dois. Na dúvida: cliente PF com uma demanda só
vai pra Proposta Simples.

---

## Fase 1 — Briefing

O usuário normalmente cola anotações de uma call, ou uma troca de WhatsApp/e-mail com o lead. Extrair dessas informações:

1. Nome do cliente/empresa
2. A dor ou necessidade (o que motivou a conversa)
3. O que está sendo proposto (serviço, escopo)
4. Valor (pode ser range ou "a definir")
5. Prazo ou próximos passos

Se alguma informação essencial não estiver clara no material colado, perguntar só o que faltar — não repetir perguntas sobre o que já foi dito.

Nunca inventar valor, prazo ou escopo. Se não foi informado, deixar um placeholder claro tipo `[valor a confirmar]`.

---

## Fase 2 — Texto dos slides

Ler `_contexto/preferencias.md` e `_contexto/empresa.md` pra calibrar tom antes de escrever.

Estrutura padrão do deck (ajustar número de slides conforme a complexidade da proposta, geralmente 7-9):

1. **Capa** — nome do cliente + "Proposta Comercial" + data
2. **O problema** — a dor do cliente, na perspectiva dele, 2-3 frases
3. **A solução** — o que a Paula Corrêa Advocacia propõe e por que resolve
4. **Escopo** — o que está incluído (lista clara)
5. **O que não está incluído** (só se relevante — evita ruído depois)
6. **Prazo e entregáveis**
7. **Investimento** — valor em destaque, com contexto se fizer sentido
8. **Próximos passos** — o que o cliente precisa fazer pra avançar
9. **Sobre a Paula Corrêa Advocacia** — 3-4 linhas

Escrever o texto de cada slide (título + corpo curto, linguagem de apresentação, não de parágrafo corrido). Mostrar o texto completo de todos os slides no chat.

**CHECKPOINT:** esperar o usuário aprovar ou pedir ajuste no texto antes de gerar o visual.

---

## Fase 3 — Visual (HTML → PDF)

1. Ler `marca/design-guide.md` pra cores, fontes e logo
2. Criar uma pasta de trabalho: `propostas/[nome-cliente]/`
3. Criar um HTML por slide, 1920x1080 (`width:1920px; height:1080px`), aplicando:
   - Alternância de fundo escuro (#6D413E) / claro (#F1EBDF) conforme a paleta do design-guide, pra dar ritmo visual entre slides
   - Acento em laranja terracota (#F26F4D) pra destaque (título, valor do investimento, CTA)
   - Tipografia: títulos em Borna (fallback: uma serif/display forte), corpo em Inter (fallback: sans-serif limpa)
   - Logo/monograma no canto se o design-guide tiver o arquivo definido
4. Salvar os HTMLs em `propostas/[nome-cliente]/slide-01.html`, `slide-02.html`, etc.
5. Renderizar o **slide 1 primeiro** em PNG pra mostrar ao usuário:
   ```bash
   npx playwright screenshot --viewport-size=1920,1080 --full-page "file:///caminho/absoluto/slide-01.html" "propostas/[nome-cliente]/preview-slide-01.png"
   ```

**CHECKPOINT:** mostrar o preview do slide 1. Se aprovado, seguir. Se pedir ajuste visual, editar o HTML e gerar novo preview.

6. Depois de aprovado, gerar o PDF final com todos os slides:
   ```bash
   node ".claude/skills/proposta-comercial/scripts/render-pdf.js" propostas/[nome-cliente]/slide-01.html propostas/[nome-cliente]/slide-02.html ... "propostas/[nome-cliente]/Proposta Comercial - [Cliente].pdf"
   ```

7. Copiar o PDF final pra pasta de propostas em `6_Colaboradores/Paula/`, mesmo lugar onde as propostas anteriores já ficam guardadas. **O número da pasta "Vendas" pode mudar** (já foi renomeada de "03 Vendas" pra "02 Vendas"). Antes de copiar, localizar a pasta certa com `Glob` (padrão `6_Colaboradores/Paula/*Vendas/Propostas`) em vez de assumir o número fixo.

---

## Regras

- Texto aprovado na Fase 2 não muda na Fase 3 (visual fiel ao texto)
- Sempre mostrar o preview do slide 1 antes de renderizar o PDF completo
- Se o usuário pedir ajuste depois do PDF pronto, editar o HTML do slide específico e regerar o PDF inteiro (o merge é rápido)
- Sem travessão no texto, seguindo `_contexto/preferencias.md`
- Nunca usar CTA de captação direta ("me procure", "me chama") — não é regra necessária aqui porque é uma proposta já endereçada a um lead identificado, não conteúdo público, mas o tom segue profissional e direto mesmo assim
- Nome do arquivo final sempre no padrão `Proposta Comercial - [Cliente].pdf`, coerente com o histórico já salvo na pasta de Vendas

---

## Proposta Simples (1 página, casos pontuais / PF)

Reprodução em HTML do brand template do Canva "Proposta Simples"
(https://www.canva.com/brand/brand-templates/EAHGdQlE9-g), recriada em 2026-09-29.

- **Template:** `templates/proposta-simples.html` (placeholders `{{...}}`, não editar à mão pra
  cada cliente)
- **Script:** `scripts/gerar-proposta-simples.js` (preenche o template a partir de um JSON e gera o
  PDF A4, opcionalmente um PNG de preview)
- **Imagens da marca:** `assets/` (logo, assinatura, monograma PC, ícone ✳ dos títulos, ícones de
  site/e-mail), recortadas do export do Canva

### Estrutura fixa da página

Cabeçalho (logo + "Proposta" + destinatário) → **Descrição do Serviço** (1 parágrafo) →
**Providências** (lista) → **Honorários** (lista + Observação opcional) → data e validade +
assinatura → rodapé com site, e-mail e telefone.

### Workflow

1. **Briefing:** extrair do que a Paula colar: destinatário (nome e, se tiver, empresa ou
   referência na 2ª linha), o que será feito, as providências, os honorários (entrada, parcelas,
   êxito), a validade (padrão 05 dias) e a data (padrão hoje). Nunca inventar valor. Se não foi
   informado, perguntar.
2. **Texto:** escrever os blocos no tom do modelo original (formal-claro, frases completas, itens da
   lista terminando em `;` e o último em `.`, valores sempre por extenso entre parênteses). A
   observação padrão sobre custas pode ser usada quando houver processo judicial:
   > Custas processuais, despesas judiciais, taxas, diligências e demais despesas externas
   > eventualmente necessárias não estão incluídas nos honorários acima e serão de
   > responsabilidade do(a) contratante.

   Mostrar o texto no chat. **CHECKPOINT:** esperar aprovação.
3. **Gerar:** salvar o JSON em `propostas/[nome-cliente]/dados.json` e rodar (cwd = `Paula_Adv_OS`):
   ```bash
   node .claude/skills/proposta-comercial/scripts/gerar-proposta-simples.js "propostas/[nome-cliente]/dados.json" "propostas/[nome-cliente]/Proposta - [Cliente].pdf" --png "propostas/[nome-cliente]/preview.png"
   ```
   Formato do JSON (trechos entre `**` viram negrito):
   ```json
   {
     "destinatario": ["À Gisele", "Kipbabykids"],
     "descricao": "Atuação jurídica em face de ...",
     "providencias": ["Análise da documentação ...;", "Ajuizamento da ação ...;", "Acompanhamento ...."],
     "honorarios": ["R$ 600,00 (seiscentos reais) de entrada;", "20% (vinte por cento) sobre ..."],
     "observacao": "Custas processuais ... (omitir o campo pra não exibir)",
     "data": "29/09/2026",
     "validade": "05 dias"
   }
   ```
4. Mostrar o `preview.png`. Se o script avisar que o texto invadiu a área da assinatura, enxugar o
   texto (a proposta simples é sempre 1 página, nunca quebrar em duas).
5. Copiar o PDF pra `6_Colaboradores/Paula/*Vendas/Propostas/` (localizar com Glob), com o nome
   `Proposta - [Cliente].pdf`, padrão das propostas simples já salvas lá.
