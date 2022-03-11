import { Attribute } from '@prisma/client';
import { useContext, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { RetrieveSocket } from '../../../contexts';

type AttributeFieldProps = {
    playerID: number;
    attributes: {
        Attribute: Attribute;
        value: number;
        maxValue: number;
    }[]
}

export default function AttributeField(props: AttributeFieldProps) {
    const [attributes, setAttributes] = useState(props.attributes);
    const socket = useContext(RetrieveSocket);

    useEffect(() => {
        if (!socket) return;

        socket.on('attributeChange', (playerID, attributeID, value, maxValue) => {
            if (playerID !== props.playerID) return;

            const index = attributes.findIndex(i => i.Attribute.id === attributeID);

            if (index < 0) return;

            const newAttributes = [...attributes];
            const attr = newAttributes[index];

            attr.value = value || attr.value;
            attr.maxValue = maxValue || attr.maxValue;

            newAttributes[index] = attr;
            setAttributes(newAttributes);
        });

        return () => {
            socket.off('attributeChange');
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <Row>
            {attributes.map(attr =>
                <Col key={attr.Attribute.id}>
                    <Row>
                        <Col className={`h5 attribute-color ${attr.Attribute.name}`}>
                            {attr.value}/{attr.maxValue}
                        </Col>
                    </Row>
                    <Row><Col>{attr.Attribute.name}</Col></Row>
                </Col>
            )}
        </Row>
    );
}