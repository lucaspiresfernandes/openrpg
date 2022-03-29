import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(404).end();

    const config = await prisma.config.findUnique({ where: { name: 'init' } });

    if (config && config.value) return res.status(400).end();

    await Promise.all([
        prisma.config.createMany({ data: databaseData.config }),
        prisma.info.createMany({ data: databaseData.info }),
        prisma.extraInfo.createMany({ data: databaseData.extraInfo }),
        prisma.attribute.createMany({ data: databaseData.attribute }),
        prisma.spec.createMany({ data: databaseData.spec }),
        prisma.characteristic.createMany({ data: databaseData.characteristic }),
        prisma.currency.createMany({ data: databaseData.currency }),
        prisma.specialization.createMany({ data: databaseData.specialization }),
        prisma.equipment.createMany({ data: databaseData.equipment }),
        prisma.item.createMany({ data: databaseData.item }),
        prisma.spell.createMany({ data: databaseData.spell }),
    ]);

    await Promise.all([
        prisma.attributeStatus.createMany({ data: databaseData.attribute_status }),
        prisma.skill.createMany({ data: databaseData.skill }),
    ]);

    res.end();
}

const databaseData = {
    config: [
        {
            name: 'init',
            value: true
        },
        {
            name: 'environment',
            value: 'idle'
        },
        {
            name: 'admin_key',
            value: '123456'
        },
        {
            name: 'enable_success_types',
            value: false
        },
        {
            name: 'dice',
            value: {
                base: {
                    value: 20,
                    branched: false
                },
                attribute: {
                    value: 100,
                    branched: false
                }
            }
        },
        {
            name: 'portrait',
            value: {
                attributes: ['Vida', 'Sanidade'],
                side_attribute: 'Magia'
            }
        }
    ],
    attribute: [
        {
            id: 1,
            name: 'Vida',
            color: 'b62323',
            rollable: false
        },
        {
            id: 2,
            name: 'Sanidade',
            color: '1f3ce0',
            rollable: true
        },
        {
            id: 3,
            name: 'Magia',
            color: 'ae00ff',
            rollable: false
        }
    ],
    attribute_status: [
        {
            name: 'Inconsciente',
            attribute_id: 1
        },
        {
            name: 'Ferimento Grave',
            attribute_id: 1
        },
        {
            name: 'Traumatizado',
            attribute_id: 3
        },
        {
            name: 'Enlouquecido',
            attribute_id: 3
        }
    ],
    characteristic: [
        { name: 'Força' },
        { name: 'Destreza' },
        { name: 'Inteligência' },
        { name: 'Constituição' },
        { name: 'Aparência' },
        { name: 'Poder' },
        { name: 'Tamanho' },
        { name: 'Educação' }
    ],
    currency: [
        { name: 'Nível de Gasto Diário' },
        { name: 'Dinheiro' }
    ],
    equipment: [
        {
            name: 'Desarmado',
            type: 'Comum',
            damage: '1d3+DB',
            range: 'Toque',
            attacks: '1',
            ammo: null,
            visible: true
        }
    ],
    extraInfo: [
        { name: 'Patrimônio e Posses' },
        { name: 'Personalidade' },
        { name: 'Backstory' },
        { name: 'Itens, Pessoas e Locais Importantes' },
        { name: 'Fobias e Manias' }
    ],
    info: [
        {
            name: 'Nome',
            'default': true
        },
        {
            name: 'Player',
            'default': false
        },
        {
            name: 'Ocupação',
            'default': false
        },
        {
            name: 'Idade',
            'default': false
        },
        {
            name: 'Gênero',
            'default': false
        },
        {
            name: 'Residência',
            'default': false
        },
        {
            name: 'Local de Nascimento',
            'default': false
        },
        {
            name: 'Peso',
            'default': false
        },
        {
            name: 'Altura',
            'default': false
        }
    ],
    item: [
        {
            name: 'Chapa de Identificação',
            description: 'Uma chapa de identificação militar.',
            weight: 0,
            visible: true
        },
        {
            name: 'Vestimentas',
            description: 'Descreva suas vestimentas aqui.',
            weight: 0,
            visible: true
        },
        {
            name: 'Celular',
            description: 'Um celular comum.',
            weight: 0,
            visible: true
        },
        {
            name: 'Isqueiro',
            description: 'Um isqueiro comum.',
            weight: 0,
            visible: true
        },
        {
            name: 'Mochila',
            description: 'Uma mochila comum. Descreva aqui seu tamanho e sua capacidade.',
            weight: 0,
            visible: true
        },
        {
            name: 'Maleta',
            description: 'Uma maleta comum. Descreva aqui seu tamanho e sua capacidade.',
            weight: 0,
            visible: true
        },
        {
            name: 'Mala',
            description: 'Uma mala comum. Descreva aqui seu tamanho e sua capacidade.',
            weight: 0,
            visible: true
        },
        {
            name: 'Bolsa',
            description: 'Uma bolsa comum. Descreva aqui seu tamanho e sua capacidade.',
            weight: 0,
            visible: true
        },
        {
            name: 'Relógio',
            description: 'Um relógio comum.',
            weight: 0,
            visible: true
        },
        {
            name: 'Carteira',
            description: 'Uma carteira comum.',
            weight: 0,
            visible: true
        },
        {
            name: 'Livro',
            description: 'Um livro comum. Descreva aqui o conteúdo do livro.',
            weight: 0,
            visible: true
        },
        {
            name: 'Livro de Ocultismo',
            description: 'Um livro de ocultismo. Descreva aqui seu conteúdo.',
            weight: 0,
            visible: true
        },
        {
            name: 'Kit Médico',
            description: 'Um kit médico que garante vantagem em Primeiros Socorros/Medicina no uso.',
            weight: 0,
            visible: true
        }
    ],
    skill: [
        {
            name: 'Antropologia',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Arcos',
            specialization_id: 1,
            mandatory: false
        },
        {
            name: 'Armas Pesadas',
            specialization_id: 1,
            mandatory: false
        },
        {
            name: 'Lança-Chamas',
            specialization_id: 1,
            mandatory: false
        },
        {
            name: 'Metralhadoras',
            specialization_id: 1,
            mandatory: false
        },
        {
            name: 'Pistolas',
            specialization_id: 1,
            mandatory: true
        },
        {
            name: 'Rifles/Espingardas',
            specialization_id: 1,
            mandatory: true
        },
        {
            name: 'Submetralhadoras',
            specialization_id: 1,
            mandatory: false
        },
        {
            name: 'Arqueologia',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Arremessar',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Atuação',
            specialization_id: 2,
            mandatory: false
        },
        {
            name: 'Belas Artes',
            specialization_id: 2,
            mandatory: false
        },
        {
            name: 'Criptografia',
            specialization_id: 2,
            mandatory: false
        },
        {
            name: 'Falsificação',
            specialization_id: 2,
            mandatory: false
        },
        {
            name: 'Fotografia',
            specialization_id: 2,
            mandatory: false
        },
        {
            name: 'Artilharia',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Avaliação',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Cavalgar',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Charme',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Chaveiro',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Astronomia',
            specialization_id: 3,
            mandatory: false
        },
        {
            name: 'Biologia',
            specialization_id: 3,
            mandatory: false
        },
        {
            name: 'Botânica',
            specialization_id: 3,
            mandatory: false
        },
        {
            name: 'Ciência Forense',
            specialization_id: 3,
            mandatory: false
        },
        {
            name: 'Engenharia',
            specialization_id: 3,
            mandatory: false
        },
        {
            name: 'Farmácia',
            specialization_id: 3,
            mandatory: false
        },
        {
            name: 'Física',
            specialization_id: 3,
            mandatory: false
        },
        {
            name: 'Geologia',
            specialization_id: 3,
            mandatory: false
        },
        {
            name: 'Matemática',
            specialization_id: 3,
            mandatory: false
        },
        {
            name: 'Meteorologia',
            specialization_id: 3,
            mandatory: false
        },
        {
            name: 'Química',
            specialization_id: 3,
            mandatory: false
        },
        {
            name: 'Zoologia',
            specialization_id: 3,
            mandatory: false
        },
        {
            name: 'Consertos Elétricos',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Consertos Mecânicos',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Contabilidade',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Demolições',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Direito',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Dirigir Automóveis',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Disfarce',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Eletrônica',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Encontrar',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Escalar',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Escutar',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Esquivar',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Furtividade',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Hipnose',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'História',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Intimidação',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Lábia',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Leitura Labial',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Nativa',
            specialization_id: 4,
            mandatory: true
        },
        {
            name: 'Briga',
            specialization_id: 5,
            mandatory: true
        },
        {
            name: 'Chicotes',
            specialization_id: 5,
            mandatory: false
        },
        {
            name: 'Espadas',
            specialization_id: 5,
            mandatory: false
        },
        {
            name: 'Garrote',
            specialization_id: 5,
            mandatory: false
        },
        {
            name: 'Lanças',
            specialization_id: 5,
            mandatory: false
        },
        {
            name: 'Machados',
            specialization_id: 5,
            mandatory: false
        },
        {
            name: 'Manguais',
            specialization_id: 5,
            mandatory: false
        },
        {
            name: 'Motosserras',
            specialization_id: 5,
            mandatory: false
        },
        {
            name: 'Medicina',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Mergulho',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Mundo Natural',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Natação',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Navegação',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Nível de Crédito',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Ocultismo',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Operar Maquinário Pesado',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Persuasão',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Aeronave',
            specialization_id: 6,
            mandatory: false
        },
        {
            name: 'Barco',
            specialization_id: 6,
            mandatory: false
        },
        {
            name: 'Prestidigitação',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Primeiros Socorros',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Psicanálise',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Psicologia',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Rastrear',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Saltar',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Treinar Animais',
            specialization_id: null,
            mandatory: false
        },
        {
            name: 'Usar Bibliotecas',
            specialization_id: null,
            mandatory: true
        },
        {
            name: 'Usar Computadores',
            specialization_id: null,
            mandatory: false
        }
    ],
    spec: [
        { name: 'Dano Bônus' },
        { name: 'Corpo' },
        { name: 'Exposição Paranormal' },
        { name: 'Taxa de Movimento' }
    ],
    specialization: [
        {
            id: 1,
            name: 'Armas de Fogo'
        },
        {
            id: 2,
            name: 'Arte e Ofício'
        },
        {
            id: 3,
            name: 'Ciência'
        },
        {
            id: 4,
            name: 'Língua'
        },
        {
            id: 5,
            name: 'Lutar'
        },
        {
            id: 6,
            name: 'Pilotar'
        },
        {
            id: 7,
            name: 'Sobrevivência'
        }
    ],
    spell: [
        {
            name: 'Bola de Fogo',
            description: 'Gera uma pequena bola de fogo na mão do usuário.',
            cost: '1d4+2 PM',
            type: 'Nenhum',
            target: 'Único',
            damage: '1d10',
            castingTime: 'Instantâneo',
            range: '25 Metros',
            duration: 'Instantâneo',
            slots: 1,
            visible: true
        }
    ]
};