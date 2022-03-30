Open RPG é um projeto que visa auxiliar mestres de RPG a gerenciar as fichas dos personagens de sua campanha e agilizar processos comuns.

Você pode acessar a demo [aqui](https://openrpgdemo.herokuapp.com/). Caso queira criar uma conta de mestre/administrador, use "123456" como chave do administrador.

Os dados criados no site da demo são excluídos semanalmente, então se quiser gerir a sua própria instância do Open RPG, leia a seção [Instalação](#instalação).

## (ATENÇÃO: Versão Beta)

O Open RPG está atualmente em sua versão Beta, com problemas e bugs para ainda serem tratados. Até o seu lançamento oficial, o Open RPG sofrerá diversas modificações e melhorias, então fique ligado e deixe sua instância do Open RPG sempre atualizada também!

## Documentação

- [Instalação][]
- [Visão da Ficha][]

[Instalação]: ./docs/installing.md
[Visão da Ficha]: ./docs/sheet.md

## Introdução

Atualmente, o Open RPG possui várias funções e recursos tanto para os mestres quanto para os jogadores, sendo elas:

### Para os jogadores:

- Informações Pessoais
- Atributos e Avatar
- Características (ou atributos secundários)
- Combate e equipamentos
- Perícias
- Itens e capacidade de carga
- Moeda
- Magias
- Anotações pessoais

### Para os mestres:

- Painel de personagens (com monitoramento de recursos importantes do personagem)
- Rolagem Rápida
- Combate e Iniciativa
- Histórico de rolagem dos jogadores
- Gerenciamento de NPCs genéricos
- Anotações pessoais
- Editor/Configurações do sistema

## Integração com OBS

Além das funcionalidades base, Open RPG possui integração com o OBS através de Browser Sources. Os recursos são:

- Avatar
- Nome
- Atributos
- Rolagem de dados

## Integração com o Random.org

O Open RPG usa os serviços do [Random.org](https://www.random.org/) para gerar números aleatórios. Se, por qualquer razão, o aplicativo não conseguir se conectar com a API do Random.org, ele passa a gerar números pseudoaleatórios com a API embutida do Node.js.
