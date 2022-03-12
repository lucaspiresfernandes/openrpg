import { useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import SheetModal from './SheetModal';

type CreateExtraInfoModalProps = {
    onCreate(name: string): void;
    show: boolean;
    onHide(): void;
}

export default function CreateExtraInfoModal(props: CreateExtraInfoModalProps) {
    const [name, setName] = useState('');

    function reset() {
        setName('');
    }

    return (
        <SheetModal title='Nova Informação Pessoal (Extra)' onExited={reset}
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name) }}
            show={props.show} onHide={props.onHide} >
            <Container>
                <Row>
                    <Col>
                        <Form.Group controlId='createExtraInfoName'>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control className='theme-element' value={name} onChange={ev => setName(ev.currentTarget.value)} />
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        </SheetModal>
    );
}