import { Attribute, Characteristic, Equipment, Info, Item, Spec } from '@prisma/client';
import React, { useContext, useState } from 'react';
import { Button, Col, Image, Row, Table } from 'react-bootstrap';
import useSocket from '../../../hooks/useSocket';
import { errorLogger } from '../../../pages/sheet/admin/1';
import api from '../../../utils/api';

type PlayerContainerProps = {
    info: {
        Info: Info;
        value: string;
    }[];
    attributes: {
        Attribute: Attribute;
        value: number;
        maxValue: number;
    }[];
    specs: {
        Spec: Spec;
        value: string;
    }[];
    characteristics: {
        Characteristic: Characteristic;
        value: number;
    }[];
    equipments: {
        Equipment: Equipment;
        currentAmmo: number | null;
        using: boolean;
    }[];
    items: {
        Item: Item;
        currentDescription: string;
        quantity: number;
    }[];
    id: number;
    onDelete?(): void;
}

export default function PlayerContainer(props: PlayerContainerProps) {
    const [playerInfo, setPlayerInfo] = useState(props.info);
    const [playerAttributes, setPlayerAttributes] = useState(props.attributes);
    const logError = useContext(errorLogger);

    useSocket(socket => {
        socket.on('info changed', content => {
            const playerID = content.playerID;

            if (playerID !== props.id) return;

            const infoID = content.infoID;
            const index = playerInfo.findIndex(i => i.Info.id === infoID);

            if (index < 0) return;

            const value = content.value;

            const newInfo = [...playerInfo];
            newInfo[index].value = value;
            setPlayerInfo(newInfo);
        });

        socket.on('attribute changed', content => {
            const playerID = content.playerID;

            if (playerID !== props.id) return;

            const attributeID = content.attributeID;
            const index = playerAttributes.findIndex(i => i.Attribute.id === attributeID);

            if (index < 0) return;

            const newAttributes = [...playerAttributes];
            const attr = newAttributes[index];

            attr.value = content.value || attr.value;
            attr.maxValue = content.maxValue || attr.maxValue;

            newAttributes[index] = attr;
            setPlayerAttributes(newAttributes);
        });
    }, 'admin');

    function deletePlayer() {
        if (!confirm('Tem certeza que deseja apagar esse jogador?')) return;
        api.delete('/sheet/player', {
            data: { id: props.id }
        }).then(props.onDelete).catch(logError);
    }

    return (
        <Col xs={12} md={6} xl={4} className='text-center h-100'>
            <Row className='mx-md-1 player-container'>
                <Col>
                    <Row className='my-2'>
                        <Col>
                            <Button size='sm' variant='secondary' onClick={deletePlayer}>Apagar</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Image fluid src='#' alt='avatar' />
                        </Col>
                    </Row>
                    <Row className='mt-2 mb-3'>
                        {playerInfo.map(info =>
                            <Col key={info.Info.id}>
                                <Row><Col className='h5'>{info.value || 'Desconhecido'}</Col></Row>
                                <Row><Col>{info.Info.name}</Col></Row>
                            </Col>
                        )}
                    </Row>
                    <Row>
                        {props.attributes.map(attr =>
                            <Col key={attr.Attribute.id}>
                                <Row><Col>{attr.value}/{attr.maxValue}</Col></Row>
                                <Row><Col>{attr.Attribute.name}</Col></Row>
                            </Col>
                        )}
                    </Row>
                    <hr />

                    <Row>
                        {props.specs.map(spec =>
                            <Col key={spec.Spec.id}>
                                <Row><Col>{spec.value || '0'}</Col></Row>
                                <Row><Col>{spec.Spec.name}</Col></Row>
                            </Col>
                        )}
                    </Row>
                    <hr />

                    <Row>
                        {props.characteristics.map(char =>
                            <Col key={char.Characteristic.id}>
                                <Row><Col>{char.value || '0'}</Col></Row>
                                <Row><Col>{char.Characteristic.name}</Col></Row>
                            </Col>
                        )}
                    </Row>
                    <hr />

                    <Row>
                        <Col className='h3'>
                            Equipamentos
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table responsive>
                                {/* Equipment Data */}
                            </Table>
                        </Col>
                    </Row>
                    <hr />

                    <Row>
                        <Col className='h3'>
                            Inventário
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        <Col>
                            {props.items.map(item =>
                                <Row key={item.Item.id} className='mb-2'>
                                    <Col title={`${item.currentDescription} (${item.quantity})`}>
                                        {item.Item.name}
                                    </Col>
                                </Row>
                            )}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    );
}