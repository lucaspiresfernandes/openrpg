# Editando o sistema

Nessa seção, ensinarei como editar o sistema.

### Atenção

Caso haja jogadores cadastrados, o sistema não permitirá a criação ou exclusão de alguns itens.

# Acessando o Editor

O Editor se encontra no painel do amininistrador, na barra de navegação.

## Informações Pessoais (Geral)

Modificar as Informações Pessoais (Geral).

Essas informações gerais são as que estão na primeira página da ficha.

## Informações Pessoais (Extra)

Modificar as Informações Pessoais (Extra).

Essas informações extras são as que estão na segunda página da ficha.

## Atributos

Modificar os atributos.

O campo "Testável" define se o atributo em questão pode ser testado, ou seja, se há um dado ao lado da barra de atributo (veja a Sanidade em [Ficha do Jogador][]). A cor define a cor da barra de atributo na ficha do personagem e no retrato (extensão OBS).

[Ficha do Jogador]: ./docs/sheet.md

## Status de Atributos

Modificar os status de atributos

O atributo a ser selecionado define a qual barra de atributo o status em questão está ligado. Cada status de atributo também é ligado ao avatar, que possui o número de status de atributos + 1 (sendo o extra o avatar padrão, quando não há nenhum status de atributo ativo).

## Especificações de Personagem

Modificar as espeficicações do personagem.

Existe uma especificação especial que se chama Dano Bônus, que pode ser usada pelos equipamentos.

## Características

Modificar as características.

## Moedas

Modificar as moedas.

## Especializações

Modificar as especializações.

Especializações são itens ligados à Perícias.

## Perícias

Modificar as perícias.

O campo "Especialização" liga uma perícia a uma especialização, mas esse campo também pode ser "Nenhum". O campo obrigatório define se essa perícia deverá ser automaticamente adicionada à ficha do personagem na criação da conta.

## Equipamentos

Modificar os equipamentos.

Para digitar o dano, ele precisa ser formatado em um padrão:

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

Também é possível usar o Dano Bônus do personagem, presente em Especificações de Jogador, assim:

```
1d4+1d6+1d8+DB
```

Caso o sistema detecte o argumento DB, ele irá automaticamente procurar pelo Dano Bônus na seção de especificações de jogador. Caso não encontre, irá substituir DB por 0.

O campo "visível" determina se esse equipamento ficará visível para os players. Essa funcionalidade serve para esconder certos equipamentos criados, e mostrar quando for a hora correta.

## Itens

Modificar os itens.

A descrição do item não é a descrição final: o jogador pode editá-la. Essa funcionalidade serve para criar itens genéricos que poderão ser usados por múltiplas pessoas, em vez de criar vários itens.

O campo "visível" tem a mesma funcionalidade do campo do equipamento.

## Magias

Modificar as magias.

O campo "visível" tem a mesma funcionalidade do campo do equipamento.

# Acessando as Configurações

As Configurações se encontra no painel do amininistrador, na barra de navegação.

## Chave do Administrador

Editar a chave do administrador.

É recomendável editar a chave para que os jogadores não tenham acesso aos recursos do administrador.

## Dados

Editar sistema de dados.

### Tipos de Sucesso

Os tipos de sucesso são as descrições que vêm com uma rolagem de dado simples (Característica ou Perícia).

![image](https://user-images.githubusercontent.com/71353674/160731143-5e7e136f-728d-4b90-a97a-74f11c087c7d.png)

### Rolagem Base

Determina o padrão que o sistema irá usar quando rolagens simples (Característica ou Perícia) forem solicitadas.

Ramificações são tipos de sucesso extras, como "Bom" e "Extremo".

### Rolagem de Atributo

Determina o padrão que o sistema irá usar quando rolagens de atributo forem solicitadas.

Ramificações são tipos de sucesso extras, como "Bom" e "Extremo".

Após qualquer edição, clique em "Aplicar".

## Retrato (extensão OBS)

Editar o comportamento dos retratos.

### Atributos Principais.

Editar os atributos principais.

![image](https://user-images.githubusercontent.com/71353674/160731512-0a6b8c71-9fb6-45e5-9fcd-39d7089c9048.png)

### Atributo Secundário

Editar o atributo secundário.

![image](https://user-images.githubusercontent.com/71353674/160731530-16936850-9489-4468-996a-6717191b4add.png)

Após qualquer edição, clique em "Aplicar".
