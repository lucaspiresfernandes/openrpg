import SheetModal from './SheetModal';
import config from '../../../openrpg.config.json';
import { useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';

type CreateSpellModalProps = {
    onCreate(name: string, description: string, cost: string, type: string,
        damage: string, castingTime: string, range: string, duration: string): void;
    show: boolean;
    onHide(): void;
}

export default function CreateSpellModal(props: CreateSpellModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState('');
    const [type, setType] = useState(config.spell.types[0]);
    const [damage, setDamage] = useState('');
    const [castingTime, setCastingTime] = useState('');
    const [range, setRange] = useState('');
    const [duration, setDuration] = useState('');

    function reset() {
        setName('');
        setDescription('');
        setCost('');
        setType(config.spell.types[0]);
        setDamage('');
        setCastingTime('');
        setRange('');
        setDuration('');
    }

    return (
        <SheetModal title='Nova Magia' show={props.show} onHide={props.onHide} onExited={reset}
            applyButton={{
                name: 'Criar',
                onApply: () => props.onCreate(name, description, cost, type, damage, castingTime, range, duration)
            }} scrollable>
            <Container fluid>
                <Row>
                    <Col>
                        <Form.Group controlId='createSpellName' className='mb-3'>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control className='theme-element' value={name}
                                onChange={ev => setName(ev.currentTarget.value)} />
                        </Form.Group>

                        <Form.Group controlId='createSpellDescription' className='mb-3'>
                            <Form.Label>Descrição</Form.Label>

                            <Form.Control as='textarea' className='theme-element' value={description}
                                onChange={ev => setDescription(ev.currentTarget.value)} />
                        </Form.Group>

                        <Form.Group controlId='createSpellCost' className='mb-3'>
                            <Form.Label>Custo</Form.Label>
                            <Form.Control className='theme-element' value={cost}
                                onChange={ev => setCost(ev.currentTarget.value)} />
                        </Form.Group>

                        <Form.Group controlId='createSpellType' className='mb-3'>
                            <Form.Label>Tipo</Form.Label>
                            <Form.Select value={type} className='theme-element'
                                onChange={ev => setType(ev.currentTarget.value)} >
                                {config.spell.types.map((typeName, index) =>
                                    <option key={index} value={typeName}>{typeName}</option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId='createSpellDamage' className='mb-3'>
                            <Form.Label>Dano</Form.Label>
                            <Form.Control className='theme-element' value={damage}
                                onChange={ev => setDamage(ev.currentTarget.value)} />
                        </Form.Group>

                        <Form.Group controlId='createSpellCastingTime' className='mb-3'>
                            <Form.Label>Tempo de Conjuração</Form.Label>
                            <Form.Control className='theme-element' value={castingTime}
                                onChange={ev => setCastingTime(ev.currentTarget.value)} />
                        </Form.Group>

                        <Form.Group controlId='createSpellRange' className='mb-3'>
                            <Form.Label>Alcance</Form.Label>
                            <Form.Control className='theme-element' value={range}
                                onChange={ev => setRange(ev.currentTarget.value)} />
                        </Form.Group>

                        <Form.Group controlId='createSpellDuration' className='mb-3'>
                            <Form.Label>Duração</Form.Label>
                            <Form.Control className='theme-element' value={duration}
                                onChange={ev => setDuration(ev.currentTarget.value)} />
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        </SheetModal>
    );
}