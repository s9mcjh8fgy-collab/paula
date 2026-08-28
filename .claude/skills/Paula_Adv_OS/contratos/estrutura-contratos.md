# Estrutura de Contratos — Paula Corrêa Advocacia

Referência de estrutura padrão pros contratos elaborados pelo escritório, baseada nos modelos
existentes (ex: `PRESTADOR DE SERVIÇOS_Contrato Cliente.docx`, pasta de modelos do Grupo Ao Cubo).

## Estrutura em duas partes

### 1. Quadro-Resumo

Bloco inicial com os dados variáveis do contrato, organizado por seção:

- **Contratante** — Nome/Razão Social, CPF/CNPJ, Endereço, E-mail, Telefone
- **Contratado** — mesmos campos
- **Sub-rogado** (quando aplicável — ex: intermediário que representa o contratante) — Razão Social,
  CNPJ, Endereço, Responsável Técnico, CPF, Telefone/WhatsApp, E-mail
- **Objeto** — descrição do que está sendo contratado
- **Local da Prestação de Serviço** (quando aplicável)
- **Prazo** — início, término, se pode ser prorrogado
- **Remuneração** — valor total, forma de pagamento (ex: por medição), dados bancários
- **Retenção** (quando aplicável) — percentual retido por medição/parcela

Campos não preenchidos ficam marcados como `[Preencher]`.

### 2. Cláusulas e Condições Gerais

Preâmbulo padrão vinculando o Quadro-Resumo ao contrato, seguido de cláusulas numeradas. Lista
típica de cláusulas (adaptar conforme o tipo de contrato — nem todas se aplicam sempre):

1. **Do Objeto**
2. **Da Natureza da Contratação** (autonomia, ausência de vínculo empregatício quando PJ/autônomo)
3. **Das Obrigações do Contratado**
4. **Das Obrigações do Contratante**
5. **Da Remuneração e Forma de Pagamento**
6. **Da Vigência e da Rescisão**
7. **Da Cláusula Penal**
8. **Da Responsabilidade Civil, Trabalhista e Tributária**
9. **Da Segurança do Trabalho** (quando aplicável — obras, canteiro)
10. **Da Comunicação, Relacionamento com Terceiros e Divulgação do Trabalho**
11. **Da Confidencialidade**
12. **Das Disposições Gerais** (cessão, comunicações por e-mail/WhatsApp válidas, tolerância não
    gera renúncia de direito, irrevogabilidade, foro, aceite de assinatura eletrônica)

Cada cláusula é dividida em itens numerados (ex: 3.1, 3.2, 3.3...).

### Disposições gerais recorrentes (cláusula final)

- Comunicações por e-mail, WhatsApp ou meios eletrônicos são válidas e vinculantes, inclusive por
  texto, áudio, imagem ou emoji, desde que comprovável o recebimento
- Tolerância de uma parte quanto a descumprimento não gera novação ou renúncia de direito
- Contrato irrevogável e irretratável
- Foro eleito: normalmente o foro da comarca do contratante, com renúncia a qualquer outro
- Aceite de assinatura eletrônica (art. 219 do Código Civil e art. 10, §2º da MP 2.220-2/2001),
  válida mesmo sem certificado ICP-Brasil

### Bloco de assinatura

Local e data, seguido de:
- Contratante/Sub-rogado (Razão Social, CNPJ) e Contratado (Nome, CNPJ) lado a lado
- Duas testemunhas (Nome, CPF)

## Formatação

Não segue o padrão de formatação das peças processuais. Contrato não usa papel timbrado do
escritório — cada cliente costuma aplicar sua própria formatação/timbrado depois de receber o texto.

- Fonte: Calibri, tamanho 11
- Alinhamento do corpo do texto: justificado
- Espaçamento entre parágrafos: 0
- Espaçamento entre linhas: 1,5
- Quadro-Resumo: sempre em tabela, ocupando a largura útil da página (margem a margem)

## Fluxo sugerido

1. Buscar o modelo mais próximo do tipo de contrato pedido nas pastas `05_Modelos/` (do cliente ou
   modelos gerais)
2. Usar como base o Quadro-Resumo e a estrutura de cláusulas acima
3. Complementar com cláusulas de outros modelos quando o caso pedir algo que o modelo base não cobre
4. Redigir cláusulas específicas novas pro que não existe em nenhum modelo
5. Revisar o rascunho (salvo em `contratos/[nome-do-caso]-contrato.md`)
6. Gerar o `.docx` final e salvar direto na pasta do cliente em `3_Jurídico/` — não duplicar o
   `.docx` final dentro de `contratos/`, que é só espaço de rascunho do `.md`
