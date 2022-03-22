import { Attribute, AttributeStatus } from '@prisma/client';
import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import PlayerAttributeField from './PlayerAttributeField';
import PlayerAvatarImage from './PlayerAvatarImage';
import EditAvatarModal from '../../Modals/EditAvatarModal';

type PlayerAttributeContainerProps = {
    playerAttributes: {
        value: number;
        maxValue: number;
        Attribute: Attribute
    }[];
    playerAttributeStatus: {
        value: boolean;
        AttributeStatus: AttributeStatus;
    }[];
    onDiceClick(): void;
}

export default function PlayerAttributeContainer(props: PlayerAttributeContainerProps) {
    const [avatarModalShow, setAvatarModalShow] = useState(false);
    const [playerStatus, setPlayerStatus] = useState(props.playerAttributeStatus);

    function statusChange(id: number) {
        const firstID = playerStatus.find(stat => stat.value)?.AttributeStatus.id || playerStatus.length;

        let rerender = false;
        const newStatus = playerStatus.map(stat => {
            if (stat.AttributeStatus.id === id) {
                if (id <= firstID) {
                    rerender = true;
                }
                stat.value = !stat.value;
            }
            return stat;
        });

        if (rerender) setPlayerStatus(newStatus);
    }

    return (
        <>
            <Row className='mt-4 mb-2 justify-content-center'>
                <PlayerAvatarImage statusID={playerStatus.find(stat => stat.value)?.AttributeStatus.id}
                    onClick={() => setAvatarModalShow(true)} playerStatus={playerStatus} />
                <Col xs={4} md={3} xl={2} className='align-self-center'>
                    <Image fluid src='/dice20.png' alt='Dado Geral'
                        className='clickable' onClick={props.onDiceClick} />
                </Col>
            </Row>
            {props.playerAttributes.map(attr => {
                const status = playerStatus.filter(stat =>
                    stat.AttributeStatus.attribute_id === attr.Attribute.id);
                return <PlayerAttributeField key={attr.Attribute.id}
                    playerAttribute={attr} playerStatus={status} onStatusChanged={statusChange} />;
            })}
            <EditAvatarModal attributeStatus={playerStatus.map(stat => stat.AttributeStatus)} show={avatarModalShow}
                onHide={() => setAvatarModalShow(false)} onUpdate={() => setPlayerStatus([...playerStatus])} />
        </>
    );
}