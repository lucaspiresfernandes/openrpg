import { Attribute, AttributeStatus } from '@prisma/client';
import { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import PlayerAttributeField from './PlayerAttributeField';
import PlayerAvatarImage from './PlayerAvatarImage';
import EditAvatarModal from '../../Modals/EditAvatarModal';
import GeneralDiceRollModal from '../../Modals/GeneralDiceRollModal';
import { ShowDiceResult } from '../../../contexts';

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
    playerAvatars: {
        link: string | null;
        AttributeStatus: {
            id: number;
            name: string;
        } | null;
    }[];
}

export default function PlayerAttributeContainer(props: PlayerAttributeContainerProps) {
    const [avatarModalShow, setAvatarModalShow] = useState(false);
    const [playerAttributeStatus, setPlayerStatus] = useState(props.playerAttributeStatus);
    const [generalDiceRollShow, setGeneralDiceRollShow] = useState(false);
    const [notify, setNotify] = useState(false);
    const showDiceResult = useContext(ShowDiceResult);

    function onStatusChange(id: number) {
        const firstID = playerAttributeStatus.find(stat => stat.value)?.AttributeStatus.id || playerAttributeStatus.length;

        let rerender = false;
        const newStatus = playerAttributeStatus.map(stat => {
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
                <PlayerAvatarImage statusID={playerAttributeStatus.find(stat => stat.value)?.AttributeStatus.id}
                    onClick={() => setAvatarModalShow(true)} rerender={notify} />
                <Col xs={4} md={3} xl={2} className='align-self-center'>
                    <Image fluid src='/dice20.png' alt='Dado Geral'
                        className='clickable' onClick={() => setGeneralDiceRollShow(true)} />
                </Col>
            </Row>
            {props.playerAttributes.map(attr => {
                const status = playerAttributeStatus.filter(stat =>
                    stat.AttributeStatus.attribute_id === attr.Attribute.id);
                return <PlayerAttributeField key={attr.Attribute.id}
                    playerAttribute={attr} playerStatus={status} onStatusChange={onStatusChange} />;
            })}
            <EditAvatarModal playerAvatars={props.playerAvatars} show={avatarModalShow}
                onHide={() => setAvatarModalShow(false)} onUpdate={() => setNotify(n => !n)} />
            <GeneralDiceRollModal show={generalDiceRollShow} onHide={() => setGeneralDiceRollShow(false)}
                showDiceRollResult={showDiceResult} />
        </>
    );
}