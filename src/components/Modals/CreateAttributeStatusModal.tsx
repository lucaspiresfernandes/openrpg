import { Attribute } from '@prisma/client';
import { useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import SheetModal from './SheetModal';

type CreateAttributeStatusModalProps = {
    onCreate(name: string, attributeID: number): void;
    show: boolean;
    onHide(): void;
    attributes: Attribute[];
}

export default function CreateAttributeStatusModal(props: CreateAttributeStatusModalProps) {
    const [name, setName] = useState('');
    const [attributeID, setAttributeID] = useState(props.attributes[0]?.id || 0);

    function reset() {
        setName('');
        setAttributeID(props.attributes[0]?.id || 0);
    }

    return (
        <SheetModal title='Novo Status de Atributo' show={props.show} onHide={props.onHide} onExited={reset}
            applyButton={{
                name: 'Criar',
                onApply: () => props.onCreate(name, attributeID),
                disabled: props.attributes.length === 0
            }}>
            <Container>
                <Row>
                    <Col>
                        <Form.Group controlId='createStatusName' className='mb-3'>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control className='theme-element' value={name} onChange={ev => setName(ev.currentTarget.value)} />
                        </Form.Group>
                        <Form.Group controlId='createStatusAttribute' className='mb-3'>
                            <Form.Label>Atributo</Form.Label>
                            <Form.Select value={attributeID} className='theme-element'
                                onChange={ev => setAttributeID(parseInt(ev.currentTarget.value))} >
                                {props.attributes.map(attr =>
                                    <option key={attr.id} value={attr.id}>{attr.name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        </SheetModal>
    );
}