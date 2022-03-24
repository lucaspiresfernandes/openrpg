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

O Open RPG pode utilizar o serviço do [Random.org](https://www.random.org/) para geração de números aleatórios.

## Integração com OBS

Além das funcionalidades base, Open RPG possui integração com o OBS através de Browser Sources. Os recursos são:

- Avatar
- Nome
- Atributos (editável)
- Rolagem de dados

## FAQs

1. Meu

## Instalação

Nessa seção, ensinarei do processo de configuração até o deployment do projeto na nuvem.

### Importante!

Antes de começarmos, você deverá cumprir alguns passos preliminares.

1. Você deverá criar uma conta aqui, no [GitHub](https://github.com/signup). Caso já possua uma conta, pode pular essa preliminar.
2. Você deverá criar uma conta na [Heroku](https://id.heroku.com/signup), o servidor no qual hospedaremos o nosso aplicativo.
3. (Opcional) Você deverá criar uma conta na [Random.org](https://accounts.random.org/create). Caso não esteja interessado em criar uma conta no Random.org e usar o serviço de geração de números aleatórios, não tem problema! O sistema se adapta a isso e passa a usar a geração padrão de números pseudoaleatórios.
4. Você deverá fazer o [fork](https://github.com/alyssapiresfernandescefet/openrpg/fork) desse repositório para a sua conta.

### 

### Iniciando

OBS: Caso esteja tendo dificuldades com o passo-a-passo, pode optar por ver um [vídeo tutorial](https://youtube.com/).

1. Agora, você deve acessar o seu [Dashboard](https://dashboard.heroku.com/) na Heroku e criar um novo App. Você deverá preencher o nome do aplicativo e a região em que o aplicativo irá ser hospedado. Digite um nome simples mas que lembre o nome da sua campanha, porque esse nome também será a URL do seu aplicativo! Já na região, selecione Estados Unidos (ou United States). Clique em Criar App (ou Create App).

2. Após isso, você deverá acessar a aba de [Deploy](https://dashboard.heroku.com/apps/openrpgdemoo/deploy). Em "Deployment method", selecione GitHub e conecte a sua conta do GitHub ao Heroku. Depois de conectada, você se direcionará a seção de "Connect to GitHub", logo abaixo de "Deployment method". Nessa seção, em repo-name, você deverá digitar "openrpg" e clicar em "Search". Depois de alguns segundos, um item com o nome do seu GitHub / openrpg vai aparecer, e logo ao lado um botão chamado "Connect". Clique no botão.

3. Depois de conectar o seu repositório GitHub ao Heroku, você precisa configurar o aplicativo para o uso. Acesse a aba [Settings](https://dashboard.heroku.com/apps/openrpgdemoo/settings), e na segunda seção, em "Config Vars", você clicará em "Reveal Config Vars". Após isso, dois campos de textos irão aparecer com o nome KEY e VALUE, respectivamente. Você deverá preencher alguns campos agora. Abaixo, haverá uma tabela dos campos que devem ser preenchidos:

|             KEY           |                                                    VALUE                                                 |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| SESSION_SECRET            | Um valor aleatório, que pode ser gerado [aqui](https://onlinehashtools.com/generate-random-sha256-hash). |
| RANDOM_ORG_KEY (Opcional) | A chave de API da Random.org, que pode ser acessada [aqui](https://api.random.org/dashboard).            |
| DATABASE_URL              | Esse campo pode ser deixado em branco. Na próxima sessão ensinarei como preenchê-lo.                     |

Caso tenha feito tudo corretamente, a seção "Config Vars" deverá estar semelhante a essa aqui:

![image](https://user-images.githubusercontent.com/71353674/160008042-5df854df-8c47-4235-8233-92303c881660.png)

Não se preocupe se a chave SESSION_SECRET não está igual. Cada aplicativo deve possuir uma diferente.

### Configurando o Banco de Dados

Antes de utilizar o seu aplicativo, você precisa configurar o seu banco de dados. Existem 2 métodos de configurar o seu banco de dados:

1. Usando a Heroku: Você irá precisar de um cartão de crédito. Não se preocupe, a Heroku não te cobra nada, ela só precisa de um cartão para firmar um contrato com um provedor de banco de dados. No caso, o provedor que escolheremos é grátis, então não será cobrado nada no cartão. Os provedores de banco de dados da Heroku são totalmente confiáveis e muito eficientes, então essa é a opção mais recomendada.
2. Usando o [db4free](https://www.db4free.net/): Você não irá precisar de um cartão de crédito. Apesar do benefício, essa opção é muito menos recomendada pelo fato do provedor db4free ser instável, lento e não ser apropriado para aplicativos de grande porte como esse. Caso escolha essa opção, prepare-se para carregamentos muito lentos, erros muito comuns e muito estresse na hora de jogar a sua campanha.

### Configurando o Banco de Dados (Usando a Heroku)

Siga esses passos:

1. Acesse a aba de [Resources](https://dashboard.heroku.com/apps/openrpgdemo/resources). Na seção "Add-ons" você irá procurar por "ClearDB MySQL".

![image](https://user-images.githubusercontent.com/71353674/160009589-58dd6722-0b31-45bc-b4db-65734460627e.png)

2. Selecione esse item e logo após surgirá uma tela de planos. Selecione o plano Ignite - Free e clique em "Submit Order Form". Caso ele peça seu cartão de crédito, preencha.
3. Após um tempo, a ordem de "compra" irá suceder, e você voltará para a aba de [Settings](https://dashboard.heroku.com/apps/openrpgdemoo/settings).
4. Note que agora, em suas config vars, um novo campo foi adicionado automaticamente: CLEARDB_DATABASE_URL. Copie o valor desse campo e cole na variável DATABASE_URL, que antes estava vazia.

### Configurando o Banco de Dados (Usando o [db4free](https://www.db4free.net/))


### Fazendo o Deploy

Após Configurar a Heroku e configurar o banco de dados, você irá acessar novamente a página de [Deploy](https://dashboard.heroku.com/apps/openrpgdemoo/deploy) e, no final da página, clique em "Deploy Branch". Espere o seu deploy terminar, e bom jogo!


### Configurações Profundas (Barras de Atributo)

Caso tenha feito edições nos Atributos do sistema, irá perceber que, na ficha do jogador, as barras de atributo possuem a cor padrão de branco e azul. Caso queira mudar isso, deverá mergulhar um pouco mais no sistema, mas não se preocupe, estou aqui para te ajudar!

1. Acesse a página do seu repositório do Open RPG no GitHub. Provavelmente, o seu repositório se encontra em "https://github.com/Nome_Do_Seu_Usuário_Aqui/openrpg". Lá, procure por um arquivo chamado "attribute.scss". Nesse arquivo, você deverá adicionar um novo pedaço de código no final:

``` CSS
  .NomeDoSeuAtributoAqui {
    $background: #2c4470;
    $foreground: #1f3ce0;

    &.progress {
        background-color: $background;
        .progress-bar {
            background-color: $foreground;
        }
    }

    &.attribute-color {
        color: $foreground;
    }

    &.portrait-color {
        color: white;
        text-shadow: 0 0 10px $foreground, 0 0 30px $foreground, 0 0 50px $foreground;
    }
}
```
2. Na primeira linha, edite "NomeDoSeuAtributoAqui" para o nome do atributo que você criou (EX: Sanidade, Magia, Esforço, etc.). Note que há um ponto (.) antecedendo o nome, então certifique-se de mantê-lo.
3. Na segunda e terceira linha, edite as variáveis background e foreground para um valor hexadecimal (ATENÇÃO: O valor hexadecimal deve sempre possuir um # no começo. Caso esqueça, o programa não irá reconhecer a cor desejada e irá ignorá-la.
4. Ao fazer essas modificações, salve o arquivo e refaça o [deploy](#fazendo-o-deploy).

### Configurações Profundas (Paleta de cores)

Caso não se sinta à vontade na paleta de cores padrão do Open RPG, você tem total liberdade de alterá-la através do arquivo "palette.scss". Procure por ele no seu repositório e edite-o como desejar. Mais instruções estão no arquivo.


### Configurações Profundas (Lógica e Identidade)

Caso queria mudar a forma como o sistema se comporta, você pode fazer isso editando o arquivo "openrpg.config.json". Procure por ele no seu repositório. Para editá-lo, considere algumas coisas antes:

1. Textos sempre são englobados por aspas duplas (EX: "The Fallen Omen RPG"), números nunca são englobados por aspas duplas (EX: 20), e os valores "true" e "false" também não.
2. "True" e "false" também podem ser interpretados como "Sim" e "Não". (EX: Você gostaria de usar tipos de sucessos na hora da rolagem? true (Sim) ou false (Não).)
3. Ramificações de sucesso são os detalhes da rolagem ("Bom" e "Extremo").

Agora, acompanharei com você cada configuração do arquivo.

| NOME DA CHAVE | SIGNIFICADO |
| ------------- | ----------- |
| application_name | O nome da aplicação. Por padrão, o nome da aplicação é Open RPG. |
| player>admin_key | A chave do administrador. É recomendável trocá-la. O padrão é 123456. ATENÇÃO: a chave, apesar de ser composta por números, deve ser englobada por aspas duplas como um texto. |
| player>role | A função do jogador, que é mostrada como um Header na ficha do jogador. O padrão é Investigador. |
| player>bonus_damage_name | O nome da especificação de jogador "Dano Bônus". Caso queira editá-la para um nome diferente, também deve editar esse campo. O padrão é Dano Bônus. |
| player>base>dice | O sistema de dados base que o aplicativo irá usar. Ele aceita 20 ou 100 como valor, que representam os sistemas de d20 e d100. O padrão é 20. |
| player>base>branched | Deseja mostrar as ramificações de sucesso dos dados? Sim (true) ou não (false). Caso true, o sistema irá utilizar ramificações, como Bom e Extremo, para as descrições de sucesso dos dados. |
| player>attribute_bar>dice | O sistema de dados que as barras de atributo irão utilizar. Ele aceita 20 ou 100 como valor. O padrão é 100. |
| player>attribute_bar>branched | Deseja mostrar as ramificações de sucesso dos dados de atributo? Sim (true) ou não (false). |
| success_types>use_success_types | Deseja usar descrições de sucesso? (EX: Sucesso, Fracasso). Caso sim, o sistema irá utilizar essas descrições no resultado dos dados. Caso não, o sistema não utilizará nenhuma descrição no resultado dos dados. |
| success_types>failure | O nome do tipo de sucesso Fracasso. O padrão é Fracasso. |
| success_types>success | O nome do tipo de sucesso Sucesso. O padrão é Sucesso. |
| success_types>hard | O nome do tipo de sucesso Bom. O padrão é Bom. |
| success_types>extreme | O nome do tipo de sucesso Extremo. O padrão é Extremo. |
| equipment>types | Os tipos disponíveis de equipamento. Você pode adicionar, remover ou modificar os itens. |
| spell>types | Os tipos disponíveis de magias. Você pode adicionar, remover ou modificar os itens. |
| portrait>attributes | A lista de atributos que vão aparecer no retrato do personagem (Exclusivo para o OBS). O padrão é Vida e Sanidade. |
| portrait>side_attribute | Define o atributo que fica dentro do retrato do personagem (Exclusivo para o OBS). O padrão é Magia. |
