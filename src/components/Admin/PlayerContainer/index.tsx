import { Attribute, AttributeStatus, Characteristic, Equipment, Info, Spec } from '@prisma/client';
import Router from 'next/router';
import React, { useContext } from 'react';
import { Button, Col, Row, } from 'react-bootstrap';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import AttributeField from './AttributeField';
import AvatarField from './AvatarField';
import EquipmentField from './EquipmentField';
import InfoField from './InfoField';
import ItemField from './ItemField';
import SpecField from './SpecField';

type PlayerContainerProps = {
    status: {
        AttributeStatus: AttributeStatus;
        value: boolean;
    }[];
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
    equipments: {
        Equipment: Equipment;
        currentAmmo: number | null;
    }[];
    items: {
        Item: {
            id: number;
            name: string;
            description: string;
        };
        currentDescription: string;
        quantity: number;
    }[];
    id: number;
    onDelete?(): void;
}

export default function PlayerContainer(props: PlayerContainerProps) {
    const logError = useContext(ErrorLogger);

    function deletePlayer() {
        if (!confirm('Tem certeza que deseja apagar esse jogador?')) return;
        api.delete('/sheet/player', {
            data: { id: props.id }
        }).then(props.onDelete).catch(logError);
    }

    return (
        <Col xs={12} md={6} xl={4} className='text-center h-100 my-2'>
            <Row className='mx-md-1 player-container'>
                <Col>
                    <Row className='my-2'>
                        <Col>
                            <Button size='sm' variant='secondary' onClick={deletePlayer}>Apagar</Button>
                        </Col>
                        <Col>
                            <Button size='sm' variant='secondary' onClick={() => {
                                navigator.clipboard.writeText(`${window.location.host}/portrait/${props.id}`);
                                alert('Link copiado para sua área de transferência.');
                            }}>
                                Retrato
                            </Button>
                        </Col>
                    </Row>
                    <AvatarField status={props.status.map(stat => { return { id: stat.AttributeStatus.id, value: stat.value }; })} />
                    <InfoField info={props.info} playerID={props.id} />
                    <hr />
                    <AttributeField attributes={props.attributes} playerID={props.id} />
                    <hr />
                    <SpecField specs={props.specs} playerID={props.id} />
                    <hr />
                    <EquipmentField equipments={props.equipments} playerID={props.id} />
                    <hr />
                    <ItemField items={props.items} playerID={props.id} />
                </Col>
            </Row>
        </Col>
    );
}