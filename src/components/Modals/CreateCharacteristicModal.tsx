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

    function reset() {
        setName('');
        setRollable(false);
    }

    return (
        <SheetModal title='Nova Característica'
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name, rollable) }}
            show={props.show} onHide={props.onHide} onExited={reset} >
            <Container>
                <Row>
                    <Col>
                        <Form.Group className='mb-3' controlId='createCharacteristicName'>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control className='theme-element' value={name} onChange={ev => setName(ev.currentTarget.value)} />
                        </Form.Group>
                        <Form.Group controlId='createCharacteristicRollable'>
                            <Form.Check inline
                                checked={rollable} onChange={() => setRollable(r => !r)} />
                                <Form.Label>Testável?</Form.Label>
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        </SheetModal>
    );
}