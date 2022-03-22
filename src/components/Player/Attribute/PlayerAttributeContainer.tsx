import { Attribute, AttributeStatus } from '@prisma/client';
import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import PlayerAttributeField from './PlayerAttributeField';
import PlayerAvatarImage from './PlayerAvatarImage';

type PlayerAttributeContainerProps = {
    playerAttributes: {
        value: number;
        maxValue: number;
        Attribute: Attribute
    }[];
    playerStatus: PlayerStatus[];
    onDiceClick?(): void;
    onAvatarClick?(): void;
}

export type PlayerStatus = {
    value: boolean;
    AttributeStatus: AttributeStatus;
};

export default function PlayerAttributeContainer(props: PlayerAttributeContainerProps) {
    const [status, setStatus] = useState<{ id: number, value: boolean }[]>(props.playerStatus.map(stat => {
        return {
            id: stat.AttributeStatus.id,
            value: stat.value
        };
    }));

    function statusChange(id: number) {
        const firstID = status.find(stat => stat.value)?.id || status.length;

        let rerender = false;
        const newStatus = status.map(stat => {
            if (stat.id === id) {
                if (id <= firstID) {
                    rerender = true;
                }
                stat.value = !stat.value;
            }
            return stat;
        });

        if (rerender) setStatus(newStatus);
    }

    return (
        <>
            <Row className='mt-4 mb-2 justify-content-center'>
                <PlayerAvatarImage statusID={status.find(stat => stat.value)?.id} onClick={props.onAvatarClick}
                    playerStatus={props.playerStatus} />
                <Col xs={4} md={3} xl={2} className='align-self-center'>
                    <Image fluid src='/dice20.png' alt='Dado Geral'
                        className='clickable' onClick={props.onDiceClick} />
                </Col>
            </Row>
            {props.playerAttributes.map(attr => {
                const status = props.playerStatus.filter(stat =>
                    stat.AttributeStatus.attribute_id === attr.Attribute.id);
                return <PlayerAttributeField key={attr.Attribute.id}
                    playerAttribute={attr} playerStatus={status} onStatusChanged={statusChange} />;
            })}
        </>
    );
}