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

As rolagens de dado são automaticamente exibidas na tela quando um jogador rola um dado.
