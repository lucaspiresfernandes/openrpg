# Utilizando a ficha eletrônica do jogador

Nessa seção, ensinarei tudo o que você precisa saber para utilizar a ficha eletrônica do jogador.

# Contêineres

Ao todo, a ficha eletrônica possui oito contêineres onde todos os dados do jogador ficam guardados. Vamos falar de cada um dos contêineres e desbravar seus segredos.

## Detalhes Pessoais

O primeiro contêiner são os Detalhes Pessoais, que está dividido em duas partes.

### Detalhes Pessoais - Parte 1

Na página 1, o primeiro contêiner que pode-se notar são os Detalhes Pessoais. Nesse contêiner, o jogador preenche informações importantes que serão utilizadas ao longo da campanha. Note que cada item possui apenas uma linha. A primeira parte dos Detalhes Pessoais visa exibir apenas informações rápidas e que podem ser facilmente digitadas em uma só linha.

Ao digitar, a caixa de texto vai desaparecer. Caso queira editar um Detalhe Pessoal, clique duas vezes no valor guardado que a caixa de texto irá reaparecer, permitindo a edição.

Logo abaixo dos detalhes pessoais, encontra-se as especificações de personagem. As especificações de personagem são informações especiais visíveis ao painel do mestre que fazem um papel importante no gerenciamento da narrativa pelo mestre.

Informações como Movimento, Nível, Corpo, Dano Bônus e afins devem estar nas especificações de personagem.

#### O Dano Bônus

O dano bônus é uma especificação de jogador especial que se conecta com os equipamentos. Em muitos sistemas, como em Call of Cthulhu, muito do dano físico corpo-a-corpo é fracionado com o dano bônus. Mais informações sobre o dano bônus vai estar na seção [Combate](#combate-ou-equipamentos).

### Detalhes Pessoais - Parte 2

Agora, a parte 2 dos Detalhes Pessoais se encontram na página 2 da ficha eletrônica do jogador. Note que nessa página as caixas de texto dos Detalhes Pessoais são muito maiores, permitindo o uso para informações muito mais profundas e que exigem muitas linhas.

## Atributos

O contêiner de atributo é o contêiner mais completo, dando acesso ao gerenciamento de avatares, rolagem livre, atributos, rolagens de atributos e status de atributos.

### Avatar

O Avatar é a identidade do seu personagem. Para mudar seus avatares, clique na imagem do avatar e uma aba chamada "Editar Avatar" será aberta.

Cada campo na edição do avatar é uma imagem diferente do seu avatar. O Avatar padrão é o campo mais importante, que significa o seu avatar normal, sem nenhuma variação. Os outros campos estão conectados aos status de atributos, que serão explicados mais para frente, [nessa](#barras-de-atributos-e-status-de-atributos) seção.

### Rolagem Livre

O dado ao lado do Avatar é o dado de Rolagem Livre. Aqui, você pode fazer rolagens de dados com os seis dados mais populares dos RPGs de mesa: 1d4, 1d6, 1d8, 1d10, 1d12 e 1d20.

Para rolar, selecione a quantidade que deseja rolar do dado desejado e clique em "Rolar".

### Barras de Atributos e Status de Atributos

As Barras de Atributos e Status de Atributos representam o estado do seu personagem.

As Barras de Atributos podem ser modificadas ao clicar no botão + ou - abaixo delas. Caso queira modificar o valor de 10 em 10, segure Control (ou Command) antes de apertar. Para modificar o valor máximo da Barra de Atributo, clique na barra.

Algumas Barras de Atributos podem possuir dados ao seu lado. Esses dados representam testes que se pode fazer com o Atributo em questão. Além disso, todas as barras também possuem um pequeno botão no lado esquerdo. Caso esse botão esteja ativado (caracterizado pelo olho aberto), o atributo será mostrado no retrato. Caso contrário, será exibido um "?/?" no lugar do atributo.

Já os Status de Atributos são os pequenos botões que é possível ver abaixo da barra. Cada Status de Atributo significa um estado diferente do seu personagem, e esse estado reflete no seu Avatar, que é atualizado toda hora que um Status de Atributo é modificado.

Os Status de Atributos possuem uma hierarquia, que significa que alguns possuem prioridades maiores que os outros. Essa prioridade sempre está da esquerda para a direita, de cima para baixo.

## Características (ou Atributos Secundários)

As características são um contêiner pequeno, mas que exerce um trabalho muito importante ao longo do jogo. Cada Característica registrada no contêiner pode ser modificada unicamente, possuindo um modificador acima de seu valor principal que afeta no modo em que seu teste será realizado.

Os modificadores de característica são os pequenos valores acima do valor principal. Esses modificadores são somados ao seu valor principal na rolagem de dados. Ou seja, caso faça um teste com 15 de Força +2, você irá rolar o dado como se tivesse 17.

Para fazer um teste na característica selecionada, simplesmente clique no dado que está acima do nome.

## Combate (ou Equipamentos)

O Combate é o contêiner que guarda todos os equipamentos de combate de um personagem. Lá, você pode fazer rolagens personalizadas para cada arma e gerenciar sua munição. Todos os equipamentos de combate que um personagem possui são visíveis ao mestre.

Para adicionar um equipamento, clique no + ao lado do título do contêiner. Para excluir, clique na lixeira ao lado do equipamento desejado.

A cada rolagem de equipamento, se a arma possuir munição, uma unidade de munição será retirada. Caso a munição do equipamento seja 0, não será possível fazer uma rolagem.

A coluna de dano é um texto determinado pelo mestre, que pode ser de várias formas. Caso o mestre opte por usar o Dano Bônus como um dano da arma, você verá "DB" no dano. Na resolução do dano, esse DB será substituído pelo Dano Bônus do jogador e assim a rolagem do equipamento irá iniciar. Caso o sistema não encontre uma especificação de jogador chamada "Dano Bônus", o DB é substituído por 0.

A resolução do dano usa um algoritmo com várias nuances e exclusividades que só são explicadas na seção [Modificando a ficha eletrônica](./editor.md#combate).

## Perícias

As Perícias são um contêiner muito parecido com as Características, mas especializado em grande volume de dados. Também, não possuem modificadores como nas Características.

A barra de pesquisa serve para encontrar uma Perícia. Digite o seu nome e as Perícias irão ser filtradas até sobrar a perícia que possui nome parecido com o nome digitado.

Para fazer um teste de Perícia, clique no nome da Perícia que deseja rolar.

## Itens e Moeda

Os Itens e Moeda são um contêiner feito para guardar informações sobre o inventário de um personagem. Cada item adicionado possui uma descrição variável. Isso serve para o mestre evitar criar vários itens e criar apenas um item que, com a descrição única para cada personagem, pode ser reutilizável para todos. Além disso, todos os itens de um personagem são visíveis ao mestre, bem como sua descrição personalizada e sua quantidade.

Para adicionar um item, clique no + ao lado do título do contêiner. Para excluir, clique na lixeira ao lado do item desejado.

Caso a capacidade do personagem exceda o limite, a Capacidade irá tomar uma cor vermelha. É possível mudar o total da capacidade.

As moedas são pequenas caixas de texto para guardar informações sobre dinheiro. Essas informações também são visíveis ao mestre.

## Magias

As Magias são um contêiner que serve para guardar informações de uma habilidade especial do personagem.

Para adicionar uma magia, clique no + ao lado do título do contêiner. Para excluir, clique em "Apagar". O campo "Dano" é rolável e as mesmas regras de rolagem dos Equipamentos são aplicados nas Magias.

O contêiner de Magias também possui uma capacidade, que se torna vermelha quando é excedida. Essa capacidade pode ser modificada a qualquer momento.

## Anotações

Na segunda página, pode-se encontrar as anotações, uma grande caixa de texto que pode comportar diversos tipos de informações. As Anotações são um contêiner de propósito geral.

# Visão Geral da Ficha de Jogador

![localhost_3000_sheet_1](https://user-images.githubusercontent.com/71353674/163498261-e053abad-01cd-45db-896e-e7a81de86a43.png)
