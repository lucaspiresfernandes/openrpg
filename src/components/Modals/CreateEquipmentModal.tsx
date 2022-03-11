import { Skill } from '@prisma/client';
import { useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import SheetModal from './SheetModal';

type CreateEquipmentModalProps = {
    onCreate(name: string, skillID: number, type: string, damage: string, range: string, attacks: string, ammo: number | null): void;
    show: boolean;
    onHide(): void;
    skill: Skill[];
}

export default function CreateEquipmentModal(props: CreateEquipmentModalProps) {
    const [name, setName] = useState('');
    const [skillID, setSkillID] = useState(props.skill[0].id);
    const [type, setType] = useState('');
    const [damage, setDamage] = useState('');
    const [range, setRange] = useState('');
    const [attacks, setAttacks] = useState('');
    const [ammo, setAmmo] = useState(0);

    return (
        <SheetModal title='Novo Item'
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name, skillID, type, damage, range, attacks, ammo) }}
            show={props.show} onHide={props.onHide} >
            <Container>
                <Row>
                    <Col>
                        <Form.Control value={name} onChange={ev => setName(ev.currentTarget.value)} />
                        <Form.Select value={skillID}
                            onChange={ev => setSkillID(parseInt(ev.currentTarget.value))} >
                            {props.skill.map(spec =>
                                <option key={spec.id} value={spec.id}>{spec.name}</option>
                            )}
                        </Form.Select>
                        
                    </Col>
                </Row>
            </Container>
        </SheetModal>
    );
}