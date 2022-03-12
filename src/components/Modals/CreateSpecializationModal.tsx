import { useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import SheetModal from './SheetModal';

type CreateSpecializationModalProps = {
    onCreate(name: string): void;
    show: boolean;
    onHide(): void;
}

export default function CreateSpecializationModal(props: CreateSpecializationModalProps) {
    const [name, setName] = useState('');

    function reset() {
        setName('');
    }

    return (
        <SheetModal title='Nova Especialização' onExited={reset} show={props.show} onHide={props.onHide}
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name) }}>
            <Container>
                <Row>
                    <Col>
                        <Form.Group controlId='createSpecializationName'>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control className='theme-element' value={name}
                                onChange={ev => setName(ev.currentTarget.value)} />
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        </SheetModal>
    );
}