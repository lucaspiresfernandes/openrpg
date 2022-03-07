import { useState } from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import PlayerAttributeField from './PlayerAttributeField';
import PlayerAvatarImage from './PlayerAvatarImage';

type PlayerAttributeContainerProps = {
    playerAttributes: {
        value: number;
        maxValue: number;
        Attribute: {
            id: number;
            name: string;
            rollable: boolean;
        };
    }[];
    playerStatus: {
        value: boolean;
        AttributeStatus: {
            id: number;
            name: string;
            attribute_id: number;
        };
    }[];
    generalDiceShow?(): void;
}

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
            <Row>
                <Row className='mb-2 justify-content-center'>
                    <PlayerAvatarImage statusID={status.find(stat => stat.value)?.id} />
                    <Col xs={4} md={3} xl={2} className='align-self-center'>
                        <Image fluid src='/dice20.png' alt='Dado Geral'
                            className='clickable' onClick={props.generalDiceShow} />
                    </Col>
                </Row>
            </Row>
            {
                props.playerAttributes.map(attr => {
                    const status = props.playerStatus.filter(stat =>
                        stat.AttributeStatus.attribute_id === attr.Attribute.id);
                    return <PlayerAttributeField key={attr.Attribute.id}
                        playerAttribute={attr} playerStatus={status} onStatusChanged={statusChange} />;
                })
            }
        </>
    );
}