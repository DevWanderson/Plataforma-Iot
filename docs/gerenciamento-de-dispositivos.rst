Gerenciamento de dispositivos
===============================

Navegando através do menu lateral, é possível acessar a tela de cadastro dos dispositivos. Nela é possível realizar o gerenciamento dos dispositivos que serão utilizados na plataforma, desde o cadastro do dispositivo, adição de variável, adição de tipo e edição e exclusão dos dispositivos, entre outros. 

.. figure:: images/v08.png
    :width: 100%
    :align: center

.. attention::
  Caso não tenha nenhum  dispositivo cadastrado a mensagem “nenhum resultado encontrado” será exibida.  

Caso tenha um dispositivo cadastrado pode-se verificar o nome do dispositivo, o setor em que está cadastrado, o status, a data de ativação, o tipo (se é um rastreador, sensor de temperatura ou umidade) e o EUI do dispositivo.

.. figure:: images/v09.png
    :width: 100%
    :align: center

Cadastro de dispositivo LoRaWAN
----------------------------------

Para adicionar um dispositivo LoRaWAN são necessários alguns dados fornecidos pelo fabricante do dispositivo como: Device EUI, Application EUI e Application key.

- Device EUI - um ID de dispositivo final global no espaço de endereço IEEE EUI64 que identifica exclusivamente o dispositivo final (o usuário pode derivar seu próprio Device EUI). 

- Application EUI - é um ID de aplicativo global no espaço de endereço IEEE EUI64 que identifica exclusivamente a entidade capaz de processar o quadro JoinReq. A AppEUI é armazenada no dispositivo final antes que o procedimento de ativação seja executado (A Application EUI pode ser diferente para cada dispositivo ou também pode ser a mesma para todos os dispositivos. Também depende do tipo de servidor de aplicativos que você está usando).

- Application key - é uma chave raiz específica para o dispositivo final. Sempre que um dispositivo final se conecta a uma rede por meio da ativação pelo ar (OTAA), o Application key é usado para derivar as chaves de sessão NwkSKey e AppSKey específicas para aquele dispositivo final para criptografar e verificar a comunicação da rede e os dados do aplicativo (O Application key deve ser exclusivo para cada dispositivo e o usuário pode derivar seu próprio Application key).

O conjunto destes códigos são armazenados em cada dispositivo pelo fabricante como os códigos padrão para esse dispositivo particular. Cada dispositivo é fornecido com uma etiqueta com o EUI e as demais informações necessárias para sua utilização. Além dos dados obrigatórios fornecidos pelo fabricante, também são necessários inserir o nome do dispositivo que o identifica, device address que é o identificador de controle de acesso e a chave de sessão network session key que se assemelha ao Application Session Key.

Também é necessário registrar um tipo no dispositivo. Isto é, se não tiver registrado anteriormente. Para o cadastro do tipo você precisa inserir as seguintes informações:

- Checkbox (True) - É utilizado como filtro para definir o tipo como global ou único do dispositivo.

- Nome do Tipo - Identificador do tipo.

- Ordem do Bits de Dados - Ordem de leitura dos dados, Little Endian (de trás para frente) ou Big Endian (frente para trás).

- Tamanho do Byte - Tamanho do payload que será enviado.

- Adicionar Variáveis (Caso tenha variáveis) - Será utilizado para lidar com as informações do payload.

 - Nome da Variável - Identifica a variável
 - Byte inicial - Define o bit inicial da informação
 - Byte final - Define o bit final da informação
 - Sinalizada (False) - Torna o tipo global ou específico para um dispositivo.

  - Adicionar operação - As operações podem ser soma, divisão, multiplicação, máscara, ARGS. A utilização das operações depende da informação que será extraída. Cada operação é descrita no datasheet do dispositivo.


Passo a passo de como cadastrar um dispositivo LoRaWAN
---------------------------------------------------------

1. No menu lateral clique em “Dispositivos”.

.. figure:: images/v10.png
    :width: 70%
    :align: left


2. Caso você não tenha nenhum dispositivo cadastrado, clique em “+Dispositivo”.

.. figure:: images/v08.png
    :width: 100%
    :align: center

Após  clicar em “+dispositivo” será redirecionado a página de seleção dos tipos de conexão, esse tipo vai depender do dispositivo que será cadastrado eles podem ser LoRaWAN, MQTT, HTTP ou Sigfox.  

3.  Antes de cadastrar um dispositivo é preciso escolher a tecnologia que utilizará para conectá-lo
à plataforma.  Para este tutorial, selecione a opção "LoRaWAN" na página de seleção de tipos de conexão.


.. figure:: images/v11.png
    :width: 100%
    :align: center

04. Agora que a tecnologia de conexão foi escolhida, temos que cadastrar o tipo para isso na tela de cadastro de dispositivos clique no botão “+” na seção tipo. 

.. figure:: images/v12.png
    :width: 100%
    :align: center

05. Ao pressionar o botão, é exibida uma janela de cadastro de de tipo, como na imagem a seguir.  Nela temos os campos que são necessários para cadastrar o tipo, são eles nome do tipo, ordem dos bits de dados e tamanho de byte.

.. figure:: images/v13.png
    :width: 100%
    :align: center

06. Clique em "+VARIÁVEL” e cadastre os dados das variáveis e  das operacões.

Preencha o campo “nome da variável 1” com o nome que queira dar a essa variável.

.. figure:: images/v14.png
    :width: 100%
    :align: center

.. note::
  É possivel adicionar quantas variável forem necessária, assim como exclui-las.

Preencha o campo “Byte inicial 1” e “Byte final 1” conforme o payload do dispositivo (consulte o datasheet do dispositivo).

.. figure:: images/v15.png
    :width: 100%
    :align: center

Por fim, deve-se cadastrar a operação, clique em “adicionar operação ” e adicione todas as operações que forem necessárias (consulte o datasheet do dispositivo).

.. figure:: images/v16.png
    :width: 100%
    :align: center

07. Finalize o cadastro do tipo clicando no botão cadastrar.

.. figure:: images/v17.png
    :width: 100%
    :align: center

08. Após o cadastro do tipo e ainda na tela de cadastro dos dispositivos LoRaWAN preencha os campos conforme à imagem abaixo com as suas informações do datasheet e da etiqueta de identificação do dispositivo .

.. figure:: images/v18.png
    :width: 100%
    :align: center

09. Finalize o cadastro clicando no botão cadastrar.

.. figure:: images/v17.png
    :width: 100%
    :align: center

Cadastro de dispositivo MQTT
-----------------------------

Na tela Cadastro MQTT realiza-se o cadastro de dispositivos que utilizam o protocolo MQTT. Para isso é necessário inserir as informações nos campos obrigatórios, que são: nome, que serve para identificar o dispositivo,  EUI que é o endereço único de identificação do dispositivo (id), adicionar uma variável ou selecionar uma existente. Abaixo tem-se a comunicação com o dispositivo e as informações que são exibidas após os campos de cadastro.

.. figure:: images/v19.png
    :width: 100%
    :align: center

Cadastrando um dispositivo MQTT
--------------------------------

Dos passos 01 ao 03 são iguais para todos os dispositivos.

.. figure:: images/v20.png
    :width: 100%
    :align: center

04. Antes de cadastrar um dispositivo MQTT é preciso adicionar suas variáveis, para isso na tela de cadastro de dispositivos MQTT clique no botão “+Adicionar Variáveis". 

.. figure:: images/v21.png
    :width: 100%
    :align: center

05. Após clicar no botão “+Adicionar Variáveis” preencha os campos adicionar variável e unidade e clique em  “adicionar” e posteriormente em “salvar” . A imagem abaixo ilustra os campos que são necessários para adicionar as variáveis do dispositivo MQTT.

.. figure:: images/v22.png
    :width: 100%
    :align: center

06. Após o cadastro das variáveis e ainda na tela de cadastro dos dispositivos MQTT finalize o cadastro inserindo o nome e um EUI para o dispositivo. 

.. figure:: images/v23.png
    :width: 100%
    :align: center

07. Finalize o cadastro clicando no botão cadastrar.

.. figure:: images/v17.png
    :width: 100%
    :align: center

Cadastro de dispositivo HTTP
-------------------------------

Na tela de cadastro HTTP são cadastrados dispositivos com o protocolo HTTP, mantém-se o padrão do cadastro de dispositivos MQTT onde é necessário inserir as informações nos campos obrigatórios. O campo nome é utilizado para identificar o dispositivo e o EUI que é o endereço único de identificação do dispositivo (ID). A adição de variáveis também segue o padrão do cadastro na tela MQTT.

.. figure:: images/v24.png
    :width: 100%
    :align: center