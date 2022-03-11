import { Specialization } from '@prisma/client';
import { useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import SheetModal from './SheetModal';

type CreateSkillModalProps = {
    onCreate(name: string, specializationID: number, mandatory: boolean): void;
    show: boolean;
    onHide(): void;
    specialization: Specialization[];
}

export default function CreateSkillModal(props: CreateSkillModalProps) {
    const [name, setName] = useState('');
    const [specializationID, setSpecializationID] = useState(props.specialization[0].id);
    const [mandatory, setMandatory] = useState(false);

    return (
        <SheetModal title='Novo Item'
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name, specializationID, mandatory) }}
            show={props.show} onHide={props.onHide} >
            <Container>
                <Row>
                    <Col>
                        <Form.Control value={name} onChange={ev => setName(ev.currentTarget.value)} />
                        <Form.Select value={specializationID}
                            onChange={ev => setSpecializationID(parseInt(ev.currentTarget.value))} >
                            {props.specialization.map(spec =>
                                <option key={spec.id} value={spec.id}>{spec.name}</option>
                            )}
                        </Form.Select>
                        <Form.Group>
                            <Form.Check id='createSkillMandatory' inline
                                checked={mandatory} onChange={() => setMandatory(r => !r)} />
                            <Form.Label htmlFor='createSkillMandatory'></Form.Label>
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        </SheetModal>
    );
}