# LRG Romani | Documento 4: Termo de Cessão de Direitos sobre Software (desenvolvedor)

> **Legenda do rascunho:** trechos entre `==...==` vão em **amarelo** no .docx (lacuna ou ponto para o cliente confirmar). Blocos `[NOTA PARA ANÁLISE]` são explicações para o Robinson e saem da versão final.

---

## Quadro-Resumo

| | |
|---|---|
| **CEDENTE (desenvolvedor)** | Nome: ==[Preencher]==<br>CPF/CNPJ: ==[Preencher]==<br>Endereço: ==[Preencher]==<br>E-mail: ==[Preencher]==<br>Telefone: ==[Preencher]== |
| **CESSIONÁRIA** | Razão social: LRG Romani Ltda<br>CNPJ: 69.062.912/0001-94<br>Endereço: Avenida Coronel Marcos Konder, 1245, Apartamento 504, Centro, Itajaí/SC, CEP 88301-303<br>Representante legal: Robinson Mauricio Romani, CPF 018.120.939-00 |
| **SOFTWARE (objeto da cessão)** | Programa de computador que compõe a plataforma digital "Psicólogos Online Brasil", acessível pelo domínio psicologosonlinebrasil.com.br, compreendendo: ==site, área do paciente, área do profissional, sistema de agenda, ferramenta de teleconsulta, ferramenta de gravação e transcrição de sessões, painel administrativo e integração com meio de pagamento [confirmar o que foi efetivamente desenvolvido]== |
| **IDENTIFICAÇÃO TÉCNICA (HASH)** | Versão: ==[nº da versão ou data de referência]==<br>Arquivo de referência: ==[nome do arquivo compactado do código-fonte, ex.: psicologosonlinebrasil_v1.zip]==<br>Algoritmo: SHA-512<br>Resumo hash: ==[Preencher]==<br>Linguagem(ns) de programação: ==[Preencher]== |
| **PREÇO** | Cessão onerosa, já remunerada no valor ajustado entre as partes pelo desenvolvimento do SOFTWARE ==(R$ [valor], pago em [data/forma])==, nada mais sendo devido a título de cessão. |
| **MANUTENÇÃO** | Os serviços de manutenção mensal do SOFTWARE não integram este Termo e seguem regidos pelo ajuste próprio entre as partes. |

> **[NOTA PARA ANÁLISE]** Este termo é propositalmente enxuto, como conversamos: serve para deixar documentado, no CNPJ da LRG Romani, que o sistema da plataforma pertence à empresa. Isso protege a plataforma e também sua família, caso algo aconteça. A manutenção mensal fica fora daqui; se quiser, depois fazemos um contrato simples só para ela (disponibilidade, prazo de correção, acesso a dados).

> **[NOTA PARA ANÁLISE] O que é o hash.** O hash é uma espécie de "impressão digital" do código-fonte: um código gerado a partir do arquivo do sistema que muda totalmente se qualquer linha for alterada. Ele identifica, sem margem de dúvida, qual versão do sistema foi cedida, sem precisar anexar o código ao contrato (o que exporia o sistema). É também o dado exigido pelo INPI para registrar o software em nome da LRG Romani. O desenvolvedor gera o hash em poucos minutos: ele compacta o código-fonte em um arquivo e roda o comando de SHA-512. O arquivo compactado deve ser guardado pelos dois, sem alteração, porque é ele que comprova o hash.

---

## TERMO DE CESSÃO DE DIREITOS SOBRE PROGRAMA DE COMPUTADOR

Pelo presente instrumento particular, as partes identificadas no Quadro-Resumo, doravante denominadas CEDENTE e CESSIONÁRIA, celebram o presente Termo de Cessão de Direitos sobre Programa de Computador, sob a regência da Lei nº 9.609/1998 (Lei do Software) e, no que couber, da Lei nº 9.610/1998 (Lei de Direitos Autorais), mediante as cláusulas e condições a seguir.

O Quadro-Resumo é parte integrante e indissociável deste instrumento.

### CLÁUSULA 1. DO OBJETO

1.1. O CEDENTE reconhece que o SOFTWARE descrito no Quadro-Resumo foi desenvolvido sob encomenda e mediante remuneração da CESSIONÁRIA, nos termos do art. 4º da Lei nº 9.609/1998, e, para afastar qualquer dúvida, cede e transfere à CESSIONÁRIA, em caráter total, definitivo, exclusivo, irrevogável e irretratável, todos os direitos patrimoniais sobre o SOFTWARE.

1.2. A cessão abrange, sem limitação:

I. o código-fonte e o código-objeto de todos os módulos, funcionalidades e versões do SOFTWARE, inclusive a versão identificada pelo resumo hash do Quadro-Resumo e as que vierem a ser desenvolvidas no âmbito dos serviços de manutenção;

II. a estrutura, a modelagem e a organização do banco de dados, bem como a documentação técnica, fluxos, telas, layouts e interfaces do sistema;

III. o direito de usar, reproduzir, modificar, adaptar, traduzir, licenciar, distribuir, comercializar, ceder a terceiros e explorar economicamente o SOFTWARE, por qualquer modalidade existente ou que venha a ser criada, em todo o território nacional e no exterior.

1.3. As melhorias, correções e novas funcionalidades desenvolvidas pelo CEDENTE para o SOFTWARE, inclusive durante a manutenção mensal, passam a integrar automaticamente o objeto desta cessão, sem necessidade de novo instrumento e sem remuneração adicional além da já ajustada para a manutenção.

1.4. Não integram o objeto deste Termo a marca, o nome e o logotipo da plataforma.

### CLÁUSULA 2. DA IDENTIFICAÇÃO DO SOFTWARE POR RESUMO HASH

2.1. O SOFTWARE é identificado pelo resumo hash indicado no Quadro-Resumo, gerado pelo algoritmo SHA-512 a partir do arquivo compactado contendo a íntegra do código-fonte da versão de referência.

2.2. O CEDENTE declara que o arquivo de referência contém a íntegra do código-fonte do SOFTWARE na versão indicada, e entregará uma cópia desse arquivo à CESSIONÁRIA, que o manterá sob sua guarda, sem alterações, como prova da versão cedida.

2.3. As versões posteriores poderão ser identificadas por novos resumos hash, mediante simples registro por escrito entre as partes, sem prejuízo do disposto no item 1.3.

2.4. A CESSIONÁRIA poderá registrar o SOFTWARE em seu nome junto ao Instituto Nacional da Propriedade Industrial (INPI), utilizando o resumo hash e as demais informações deste Termo, comprometendo-se o CEDENTE a fornecer as informações técnicas necessárias ao registro.

### CLÁUSULA 3. DA ENTREGA DO CÓDIGO-FONTE E DOS ACESSOS

3.1. O CEDENTE entregará à CESSIONÁRIA, ==em até 10 (dez) dias da assinatura deste Termo==, e sempre que solicitado:

I. cópia integral e atualizada do código-fonte, preferencialmente por meio de repositório (ex.: GitHub, GitLab) de titularidade da CESSIONÁRIA;

II. a relação de todas as contas, serviços e credenciais utilizados pelo SOFTWARE (hospedagem, banco de dados, domínio, e-mail transacional, provedor de pagamento, ferramentas de transcrição, entre outros), com acesso de administrador em nome da CESSIONÁRIA.

3.2. As contas e serviços vinculados ao SOFTWARE deverão estar registrados em nome da CESSIONÁRIA ou ser a ela transferidos, podendo o CEDENTE manter acesso técnico apenas enquanto prestar os serviços de manutenção.

> **[NOTA PARA ANÁLISE]** Hoje o domínio psicologosonlinebrasil.com.br está registrado no seu CPF, não no CNPJ da LRG Romani. Recomendo transferir a titularidade para a empresa no Registro.br (é simples e gratuito). O mesmo vale para hospedagem e demais contas que estiverem no nome do desenvolvedor.

### CLÁUSULA 4. DOS COMPONENTES DE TERCEIROS

4.1. O CEDENTE declara que o SOFTWARE não viola direitos de terceiros e informará à CESSIONÁRIA, por escrito, as bibliotecas, componentes de código aberto, modelos prontos (templates) e serviços de terceiros incorporados, os quais seguem regidos por suas respectivas licenças.

### CLÁUSULA 5. DA NÃO REUTILIZAÇÃO

5.1. O CEDENTE não poderá utilizar, reproduzir ou licenciar a terceiros, no todo ou em parte, o código-fonte, o banco de dados ou o layout do SOFTWARE, nem desenvolver para terceiros plataforma que os reproduza ou que seja substancialmente idêntica ao SOFTWARE.

5.2. Não se inclui na vedação acima o uso, pelo CEDENTE, de seus conhecimentos técnicos gerais, linguagens, ferramentas e técnicas de programação de domínio comum.

### CLÁUSULA 6. DA CONFIDENCIALIDADE E DA PROTEÇÃO DE DADOS

6.1. O CEDENTE manterá sigilo sobre as informações técnicas, comerciais e estratégicas da CESSIONÁRIA a que tiver acesso, durante e após o término da relação entre as partes.

6.2. Sempre que tiver acesso a dados pessoais tratados pelo SOFTWARE, especialmente dados de saúde de pacientes, conteúdo de sessões, gravações e transcrições, o CEDENTE atuará como operador, nos termos da Lei nº 13.709/2018 (LGPD), obrigando-se a:

I. tratar os dados exclusivamente para a execução dos serviços técnicos solicitados pela CESSIONÁRIA;

II. não acessar, copiar, extrair ou armazenar conteúdo de sessões, gravações e transcrições, salvo quando estritamente necessário para correção técnica e mediante autorização prévia da CESSIONÁRIA;

III. adotar medidas de segurança adequadas e comunicar à CESSIONÁRIA, em até 24 (vinte e quatro) horas, qualquer incidente de segurança de que tiver conhecimento.

### CLÁUSULA 7. DAS DISPOSIÇÕES GERAIS

7.1. As obrigações deste Termo são irrevogáveis e irretratáveis, obrigando as partes, seus herdeiros e sucessores a qualquer título.

7.2. A CESSIONÁRIA poderá averbar ou registrar este Termo onde entender conveniente.

7.3. ==O descumprimento das obrigações das Cláusulas 5 e 6 sujeitará o CEDENTE ao pagamento de multa de R$ [valor], sem prejuízo de perdas e danos.==

> **[NOTA PARA ANÁLISE]** A multa é opcional. Como você mencionou a relação próxima com o desenvolvedor, podemos tirar e deixar só a responsabilidade por perdas e danos, que já existe por lei. Me diga o que prefere.

7.4. A tolerância de uma das partes quanto ao descumprimento de qualquer cláusula não importará renúncia ou novação.

7.5. As comunicações relativas a este Termo poderão ser feitas por e-mail, WhatsApp ou outro meio eletrônico que permita comprovar o envio e o recebimento.

7.6. Fica eleito o foro da Comarca de Itajaí/SC para dirimir quaisquer controvérsias oriundas deste Termo, com renúncia a qualquer outro, por mais privilegiado que seja.

7.7. As partes reconhecem a validade deste instrumento firmado em formato eletrônico, conforme o art. 219 do Código Civil e o art. 10, § 2º, da Medida Provisória nº 2.200-2/2001, ainda que por certificados não emitidos pela ICP-Brasil.

Itajaí/SC, ==[data]==.

| CEDENTE | CESSIONÁRIA |
|---|---|
| ==[Nome do desenvolvedor]==<br>CPF/CNPJ: ==[Preencher]== | LRG Romani Ltda<br>CNPJ: 69.062.912/0001-94<br>Robinson Mauricio Romani |

| TESTEMUNHA 1 | TESTEMUNHA 2 |
|---|---|
| Nome:<br>CPF: | Nome:<br>CPF: |
