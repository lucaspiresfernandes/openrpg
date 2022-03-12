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

    function reset() {
        setName('');
        setSpecializationID(props.specialization[0].id);
        setMandatory(false);
    }

    return (
        <SheetModal title='Nova Perícia' show={props.show} onHide={props.onHide} onExited={reset}
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name, specializationID, mandatory) }}>
            <Container>
                <Row>
                    <Col>
                        <Form.Group controlId='createSkillName' className='mb-3'>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control className='theme-element' value={name}
                                onChange={ev => setName(ev.currentTarget.value)} />
                        </Form.Group>
                        <Form.Group controlId='createSkillSpecialization' className='mb-3'>
                            <Form.Label>Especialização</Form.Label>
                            <Form.Select value={specializationID} className='theme-element'
                                onChange={ev => setSpecializationID(parseInt(ev.currentTarget.value))} >
                                {props.specialization.map(spec =>
                                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId='createSkillMandatory'>
                            <Form.Check inline checked={mandatory} onChange={() => setMandatory(r => !r)} />
                            <Form.Label>Obrigatório?</Form.Label>
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        </SheetModal>
    );
}