# Integrando o Open RPG com o OBS

Nessa seção, irei ensinar para você como realizar a integração do Open RPG com o OBS.

## Retratos

A integração do Open RPG com o OBS se chama um Retrato. Um Retrato basicamente representa a imagem de um jogador em tela, com atualização de atributos e rolagens em tempo real.

![image](https://user-images.githubusercontent.com/71353674/163499503-10330b79-9836-4b90-889f-d6773462ae4e.png)

## Adicionando os Retratos ao OBS

O OBS exibe os retratos através de uma fonte chamada Browser Source (ou Navegador). Essa fonte pede um link e uma altura e largura para ser exibida. Para achar o link, basta ir ao painel do mestre e clicar no botão "Retrato" em um jogador. Um link será copiado para sua área de transferência, e você deverá colar esse link no Browser Source.

## Configurando os Retratos

Os retratos já vêm completamente automatizados, sem precisar de nenhuma outra ação do mestre. No entanto, há algumas situações onde o nome ou atributo do player pode aparecer cortado na tela. Para configurar isso, você deve acessar as propriedades do Browser Source e ajustar a sua altura e largura.

## Automatização

Como já dito, os retratos já funcionam automaticamente, então só é preciso adicioná-lo ao OBS e ajustá-lo quanto a necessidade. Os retratos oferecem automatizações como:

#### Avatar

Qualquer mudança no Avatar do personagem será automaticamente refletido no retrato.

#### Atributos

Os atributos na tela são sincronizados com os atributos do jogador.

#### Rolagens de Dado

As rolagens de dado são automaticamente exibidas na tela quando um jogador rola um ou mais dados. Caso o dado possua uma descrição, como "Fracasso" ou "Sucesso", essa descrição será exibida.

## Editando o Retrato

É possível editar os atributos que parecem no retrato na página de configurações, no painel do mestre.

Além disso, também é possível editar a posição dos atributos e nome na tela. Para isso, você deve interagir com o retrato pelo OBS e mover os atributos e nome para onde bem entender. Note que o nome e atributos sempre têm posição iguais.

![portrait](https://user-images.githubusercontent.com/71353674/167266495-3329e025-4917-4602-8400-91d8445899a8.gif)
