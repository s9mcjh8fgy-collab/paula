# Contexto da Empresa — Paula Corrêa Advocacia

**Nome:** Paula Fernanda Corrêa de Borba (nome profissional: Paula Corrêa)
**Negócio:** Paula Corrêa Advocacia
**OAB:** OAB/SC 28.118
**O que faz:** Advocacia com atendimento a pessoas físicas e jurídicas — consultivo (pareceres, dúvidas via WhatsApp/e-mail), análise de contratos e documentos, e peças processuais.
**Áreas de atuação:** praticamente todas, exceto criminal. Pouco tributário (só o necessário quando um cliente PJ demanda).
**Posicionamento estratégico:** "Advocacia da Construção Civil" — termo escolhido pela Paula por ser mais abrangente e diferenciado do que "advocacia imobiliária". Foco em atender empresas e profissionais do setor: arquitetos, engenheiros, empreiteiras, construtoras, imobiliárias, administradoras de condomínio.
**Perfil:** freelancer (advocacia solo com uma assistente)
**Atende clientes:** sim — carteira mista de PF e PJ. Continua atendendo casos de outras áreas (família, trabalhista, consumidor) que surgem naturalmente, inclusive de clientes do nicho de construção civil (ex: trabalhista de uma construtora).
**Equipe:** Paula + Thaís (formada em Direito, não advogada, auxilia em demandas de menor complexidade)
**Ferramentas:** Legal One (Thomson Reuters, sistema processual), WhatsApp Business, Microsoft 365 (Outlook e afins — já conectado via MCP), sistema próprio de registro de demandas consultivas em https://paula-blush-rho.vercel.app/, Cloudflare Pages (publicação de relatórios estáticos, ex: relatórios de andamento do INPI — token e account ID em `.env`)
**Principais entregas:** pareceres e respostas consultivas, análise de contratos, peças processuais, conteúdo pra redes sociais (área nova, em estruturação), registro de marca e desenho industrial no INPI

## Estrutura de arquivos de clientes

A pasta `3_Jurídico/` em `00_Novo Diretório/` já tem a organização oficial por cliente:
- `1_Pessoa Física (PF)/` — clientes PF, com subpastas de Serviços e Processos
- `2_Pessoa Jurídica (PJ)/` — clientes PJ, uma pasta por cliente/serviço
- `4_Assessorias/` e `5_Sebrae/` — outras frentes

**Regra de fluxo:** as pastas de trabalho dentro do `8_Claude` (`consultivo/`, `contratos/`, `processual/`, `conteudo/`) são o espaço de rascunho e organização com o Claude. Exceção: `inpi/` só guarda o painel `controle.md` (todos os clientes, um resumo só) — os documentos de cada pedido vão direto pra pasta do cliente em `06_INPI/`, sem passar por rascunho aqui. Quando um documento for de um cliente específico e precisar ser arquivado definitivamente, salvar direto na pasta do cliente dentro de `3_Jurídico/1_Pessoa Física (PF)/` ou `2_Pessoa Jurídica (PJ)/` (perguntar o nome do cliente se a pasta não for óbvia). `conteudo/` (redes sociais) não é ligado a cliente e fica só no `8_Claude`.

## Contexto adicional
Legal One é o sistema oficial de registro processual (Thomson Reuters) — não é substituído pelas pastas de trabalho aqui, apenas complementado.
