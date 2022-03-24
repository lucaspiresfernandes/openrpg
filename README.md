Open RPG é um projeto que visa auxiliar mestres de RPG a gerenciar as fichas dos personagens de sua campanha e agilizar processos comuns.

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
- Editor do sistema

Além da edição do sistema, o mestre também pode editar o design do site, mudando suas cores. Para saber mais, visite a seção de [Como editar o aplicativo?](#como-editar-o-aplicativo)

O Open RPG usa alguns serviços de terceiros para seu funcionamento. São eles:

- Cloudinary (Repositório de imagens)
- Random.org (Opcional - Gerador de números aleatórios)

## Integração com OBS

Além das funcionalidades base, Open RPG possui integração com o OBS através de Browser Sources. Os recursos são:

- Avatar
- Nome
- Atributos (editável)
- Rolagem de dados

## Instalação

Nessa seção, ensinarei do processo de configuração até o deployment do projeto na nuvem.

### Importante!

Antes de começarmos, você deverá cumprir alguns passos preliminares.

1. Você deverá criar uma conta na [Cloudinary](https://cloudinary.com/). É muito simples e intuitivo, e o mais importante: é de graça!
2. Você deverá criar uma conta na [Heroku](https://heroku.com/).
3. (Opcional) Você deverá criar uma conta na [Random.org](https://www.random.org/). Caso não esteja interessado em usar o serviço de geração de números aleatórios, não tem problema! O sistema se adapta a isso e passa a usar a geração padrão de números pseudoaleatórios.

### Primeiro passo

Agora, estamos prontos para começar o processo de deployment na nuvem!
