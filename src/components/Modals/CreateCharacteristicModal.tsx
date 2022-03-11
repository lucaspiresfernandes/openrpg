import { useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import SheetModal from './SheetModal';

type CreateCharacteristicModalProps = {
    onCreate(name: string, rollable: boolean): void;
    show: boolean;
    onHide(): void;
}

export default function CreateCharacteristicModal(props: CreateCharacteristicModalProps) {
    const [name, setName] = useState('');
    const [rollable, setRollable] = useState(false);

    return (
        <SheetModal title='Nova Característica'
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name, rollable) }}
            show={props.show} onHide={props.onHide} >
            <Container>
                <Row>
                    <Col>
                        <Form.Control value={name} onChange={ev => setName(ev.currentTarget.value)} />
                        <Form.Group>
                            <Form.Check id='createCharacteristicRollable' inline
                                checked={rollable} onChange={() => setRollable(r => !r)} />
                            <Form.Label htmlFor='createCharacteristicRollable'></Form.Label>
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        </SheetModal>
    );
}