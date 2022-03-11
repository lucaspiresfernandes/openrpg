import { Characteristic } from '@prisma/client';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';

type CharacteristicFieldProps = {
    playerID: number;
    characteristics: {
        Characteristic: Characteristic;
        value: number;
    }[];
}

export default function CharacteristicField(props: CharacteristicFieldProps) {
    const [characteristics, setCharacteristics] = useState(props.characteristics);

    return (
        <Row>
            {characteristics.map(char =>
                <Col key={char.Characteristic.id}>
                    <Row><Col className='h5'>{char.value || '0'}</Col></Row>
                    <Row><Col>{char.Characteristic.name}</Col></Row>
                </Col>
            )}
        </Row>
    );
}