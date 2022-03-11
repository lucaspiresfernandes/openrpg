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
    const [attributeID, setAttributeID] = useState(props.attributes[0].id);

    return (
        <SheetModal title='Nova Informação Pessoal'
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name, attributeID) }}
            show={props.show} onHide={props.onHide} >
            <Container>
                <Row>
                    <Col>
                        <Form.Control value={name} onChange={ev => setName(ev.currentTarget.value)} />
                        <Form.Select value={attributeID}
                            onChange={ev => setAttributeID(parseInt(ev.currentTarget.value))} >
                            {props.attributes.map(attr =>
                                <option key={attr.id} value={attr.id}>{attr.name}</option>
                            )}
                        </Form.Select>
                    </Col>
                </Row>
            </Container>
        </SheetModal>
    );
}