import { Spec } from '@prisma/client';
import { useContext, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { RetrieveSocket } from '../../../contexts';

type SpecFieldProps = {
    playerID: number;
    specs: {
        Spec: Spec;
        value: string;
    }[];
}

export default function SpecField(props: SpecFieldProps) {
    const [specs, setSpecs] = useState(props.specs);
    const socket = useContext(RetrieveSocket);

    useEffect(() => {
        if (!socket) return;

        socket.on('specChange', (playerID, specID, value) => {
            if (playerID !== props.playerID) return;

            const index = specs.findIndex(i => i.Spec.id === specID);

            if (index < 0) return;

            const newSpecs = [...specs];
            newSpecs[index].value = value;
            setSpecs(newSpecs);
        });

        return () => {
            socket.off('specChange');
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <Row>
            {specs.map(spec =>
                <Col key={spec.Spec.id}>
                    <Row><Col className='h5'>{spec.value || '0'}</Col></Row>
                    <Row><Col>{spec.Spec.name}</Col></Row>
                </Col>
            )}
        </Row>
    );
}