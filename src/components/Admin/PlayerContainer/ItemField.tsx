import { Item } from '@prisma/client';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';

type ItemFieldProps = {
    playerID: number;
    items: {
        Item: {
            id: number;
            name: string;
            description: string;
        };
        currentDescription: string;
        quantity: number;
    }[];
}

export default function ItemField(props: ItemFieldProps) {
    const [items, setItems] = useState(props.items);

    return (
        <>
            <Row>
                <Col className='h3'>
                    Inventário
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col>
                    {items.map(item =>
                        <Row key={item.Item.id} className='mb-2'>
                            <Col title={item.currentDescription}>
                                {item.Item.name} ({item.quantity})
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </>
    );
}