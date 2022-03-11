import { useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import SheetModal from './SheetModal';

type CreateItemModalProps = {
    onCreate(name: string, description: string): void;
    show: boolean;
    onHide(): void;
}

export default function CreateItemModal(props: CreateItemModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    return (
        <SheetModal title='Novo Item'
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name, description) }}
            show={props.show} onHide={props.onHide} >
            <Container>
                <Row>
                    <Col>
                        <Form.Control value={name} onChange={ev => setName(ev.currentTarget.value)} />
                        <Form.Control value={description} onChange={ev => setDescription(ev.currentTarget.value)} />
                    </Col>
                </Row>
            </Container>
        </SheetModal>
    );
}