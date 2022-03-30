# Open RPG: Ficha eletrônica de RPG

Open RPG é um projeto que visa auxiliar mestres de RPG a gerenciar as fichas dos personagens de sua campanha e agilizar processos comuns.

Você pode acessar a demo [aqui](https://openrpgdemo.herokuapp.com/). Caso queira criar uma conta de mestre/administrador, use "123456" como chave do administrador.

Os dados criados no site da demo são excluídos semanalmente, então se quiser gerir a sua própria instância do Open RPG, leia a seção [Instalação][].

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
- Rolagem de dados automática

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

## Status do projeto

Atualmente, o Open RPG se encontra em sua versão 0.3.0 Beta e já é considerado completo. Os desafios que se encontram à frente do Open RPG agora são sobre UX.

No entanto, ainda há a possibilidade de adicionar novas funcionalidades de acordo a demanda dos jogadores.

## Comunidade

Para perguntas, use as [Discussões](https://github.com/alyssapiresfernandescefet/openrpg/discussions).
