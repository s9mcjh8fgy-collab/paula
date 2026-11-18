import sys; sys.path.insert(0, '../kit'); from gerar import gerar
gerar('00a-prazer', [
 {'tipo':'capa','cor':'laranja','kicker':'Bem-vindo(a)','titulo':'Prazer, <em>Estrutura Legal</em>.','tam':190,'texto':'Arraste para conhecer a gente.'},
 {'tipo':'texto','cor':'claro','kicker':'O que somos','titulo':'O jurídico do escritório de arquitetura, <em>na régua</em>.',
  'texto':'Uma marca de ferramentas jurídicas feitas para quem projeta: <b>contratos, escopo e os documentos da relação com o cliente</b>, prontos para usar.'},
 {'tipo':'texto','cor':'escuro','kicker':'De onde viemos','titulo':'O que deu briga lá <em>vira cláusula</em> aqui.',
  'texto':'Por trás de cada ferramenta estão anos de contratos, obras e conflitos entre arquitetos e clientes, transformados em texto claro e preventivo.'},
 {'tipo':'capa','cor':'laranja','kicker':'Estrutura Legal','titulo':'Você cuida do projeto. O contrato cuida <em>do resto</em>.','tam':112,'texto':'Siga @estruturalegal'},
])
gerar('00b-para-quem', [
 {'tipo':'capa','cor':'escuro','kicker':'Para quem é','titulo':'Este perfil é para você, <em>arquiteto(a)</em>, se...','tam':128},
 {'tipo':'lista','cor':'claro','kicker':'Marque o que é você','titulo':'Você...','itens':[
   'Trabalha sozinho(a) ou tem um escritório pequeno',
   'Faz projeto e, às vezes, acompanha a obra',
   'Já ouviu "mas eu achei que estava incluído"',
   'Usa contrato copiado da internet, ou nem usa']},
 {'tipo':'capa','cor':'laranja','kicker':'Estrutura Legal','titulo':'Marcou pelo menos um? Você está no <em>lugar certo</em>.','tam':104,
  'texto':'Marque aqui um(a) colega arquiteto(a) que também precisa ver isso.'},
])
gerar('00c-o-que-esperar', [
 {'tipo':'capa','cor':'claro','kicker':'Por aqui','titulo':'O que você vai <em>encontrar</em> neste perfil','tam':140},
 {'tipo':'item','cor':'claro','num':'1','titulo':'Contrato <em>sem juridiquês</em>','texto':'O que cada cláusula faz por você, explicado de um jeito que dá para usar no dia seguinte.'},
 {'tipo':'item','cor':'claro','num':'2','titulo':'Situações reais de <em>escritório</em>','texto':'Revisão sem fim, obra atrasada, cliente que some na hora de aprovar. E como o contrato resolve cada uma.'},
 {'tipo':'item','cor':'claro','num':'3','titulo':'Ferramentas <em>prontas</em>','texto':'Como o <b>Contrato na Régua</b>: o seu contrato de arquitetura pronto em minutos, em Word, com a sua logo.'},
 {'tipo':'capa','cor':'escuro','kicker':'Próximo post','titulo':'Ative as notificações. Vem aí: <em>5 cláusulas</em> que o seu contrato não pode deixar de ter.','tam':84},
])
