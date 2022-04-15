# Modificando a ficha eletrônica

Nessa seção, ensinarei como modificar a ficha eletrônica do jogador para que ela fique do jeito que você deseja.

## O Editor

O Editor é a página em que todas essas modificações poderão ser feitas. Ela é acessível pela barra de navegação do mestre.

No Editor, é possível ver todos os contêineres presentes na ficha eletrônica do jogador. É possível editar cada item e informação com novas entradas, excluindo-as ou editando-as.

Cada edição feita no Editor é salva automaticamente, sem precisar aplicar ou salvar manualmente.

## Detalhes Pessoais (Geral)

O primeiro contêiner do Editor, Detalhes Pessoais (Geral), refere-se aos Detalhes Pessoais da primeira página do jogador, aqueles que só comportam uma linha de informação.

## Detalhes Pessoais (Extra)

Os Detalhes Pessoais (Extra) referem-se aos Detalhes Pessoais presentes na segunda página da ficha eletrônica do jogador.

## Atributos

Os Atributos referem-se às barras de Atributo. Você pode modificar a cor e seus estados de "testáveis".

Atributos testáveis são atributos que podem ser testados, ou seja, se permitem a rolagem de um dado. Atributos testáveis exibirão um pequeno dado ao lado de sua barra.

## Status de Atributos

Os Status de Atributo referem-se aos estados do personagem. Para cada estado existe uma variação de Avatar diferente.

Cada Status de Atributo possui uma ligação com um Atributo. Isso significa que o Status de Atributo será exibido embaixo da barra de Atributo ligada a ele.

## Especificações de Personagem

As especificações de personagem podem ser modificadas aqui. As especificações de personagem referem-se aos campos de texto bem abaixo dos Detalhes Pessoais (Gerais).

Aqui é onde a especificação de personagem especial "Dano Bônus" pode ser adicionada.

## Características

As Características podem ser modificadas aqui.

## Moedas

As Moedas podem ser modificadas aqui.

## Especializações

As Especializações são dados especiais usados somente para agrupar Perícias. Para sistemas como Call of Cthulhu, as especializações são importantes para agrupar perícias como "Briga", "Chicotes", "Garrote", etc.

## Perícias

As Perícias podem ser modificadas aqui.

O campo Especialização pode ser usado para agrupar perícias a uma só especialização. No entanto, esse campo não é obrigatório e pode ser desativado ao ser selecionado o item "Nenhum".

O campo Obrigatório define se essa perícia é obrigatória, ou seja, deve ser adicionada a todos os jogadores na criação de conta.

## Combate

Aqui, você pode modificar os equipamentos de combate.

O campo especial Dano deve ser cuidadosamente preenchido seguinto as seguintes normas:

```
Sendo n: número de rolagens.
Sendo r: número da rolagem.

ndr+ndr+ndr+...

Por exemplo:

1d4+1d6+1d8

3d4+2d6+1d8

4d4+2d6+4d8+2d12
```

É possível também usar valores brutos, como:

```
1d4+2+1d6+1d8+3
```

Também é possível usar o Dano Bônus do personagem, presente em especificações de jogador, assim:

```
1d4+1d6+1d8+DB
```

Além disso, também é possível usar frações do Dano Bônus, como:

```
1d4+1d6+1d8+DB/2

Caso o personagem tenha 1d4 de Dano Bônus, o DB será substituído por 1d2.
```

Por último, também é possível usar variações de um mesmo dano, como:

```
4d6/2d6/1d6
ou
3d4+2/2d4+1/1d4

Ao rolar o dado, o jogador deverá escolher qual das variações irá usar para rolar o dano.
```

Essas variações são importantes para armas como escopetas, que variam conforme a distância.

Caso o sistema detecte o argumento DB, ele irá automaticamente procurar pelo Dano Bônus na seção de especificações de jogador. Caso não encontre, irá substituir DB por 0.

O campo "visível" determina se esse equipamento ficará visível para os players. Essa funcionalidade serve para esconder certos equipamentos criados, e mostrar quando for a hora correta.

## Itens

Aqui, é possível modificar os itens.

A descrição do item não é a descrição final: o jogador pode editá-la. Essa funcionalidade serve para criar itens genéricos que poderão ser usados por múltiplas pessoas, em vez de criar vários itens.

O campo "visível" determina se esse item ficará visível para os players. Essa funcionalidade serve para esconder certos itens criados, e mostrar quando for a hora correta.

## Magias

O contêiner que permite modificar as magias.

O campo "visível" determina se essa magia ficará visível para os players. Essa funcionalidade serve para esconder certas magias criadas, e mostrar quando for a hora correta.
