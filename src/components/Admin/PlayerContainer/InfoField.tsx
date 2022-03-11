import { Info } from '@prisma/client';
import { useContext, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { RetrieveSocket } from '../../../contexts';

type InfoFieldProps = {
    playerID: number;
    info: {
        Info: Info;
        value: string;
    }[]
}

export default function InfoField(props: InfoFieldProps) {
    const [info, setInfo] = useState(props.info);
    const socket = useContext(RetrieveSocket);

    useEffect(() => {
        if (!socket) return;

        socket.on('infoChange', (playerID, infoID, value) => {
            if (playerID !== props.playerID) return;

            const index = info.findIndex(i => i.Info.id === infoID);

            if (index < 0) return;

            const newInfo = [...info];
            newInfo[index].value = value;
            setInfo(newInfo);
        });

        return () => {
            socket.off('infoChange');
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <Row className='mt-2 mb-3'>
            {info.map(info =>
                <Col key={info.Info.id}>
                    <Row><Col className='h5'>{info.value || 'Desconhecido'}</Col></Row>
                    <Row><Col>{info.Info.name}</Col></Row>
                </Col>
            )}
        </Row>
    );
}