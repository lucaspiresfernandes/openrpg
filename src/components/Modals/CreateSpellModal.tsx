import SheetModal from './SheetModal';
import { ChangeEvent, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

type CreateSpellModalProps = {
    onCreate(name: string, description: string, cost: string, type: string,
        damage: string, castingTime: string, range: string, duration: string, slots: number, target: string): void;
    show: boolean;
    onHide(): void;
}

export default function CreateSpellModal(props: CreateSpellModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState('');
    const [type, setType] = useState('Nenhum');
    const [damage, setDamage] = useState('');
    const [target, setTarget] = useState('');
    const [castingTime, setCastingTime] = useState('');
    const [range, setRange] = useState('');
    const [duration, setDuration] = useState('');
    const [slots, setSlots] = useState(1);

    function reset() {
        setName('');
        setDescription('');
        setCost('');
        setType('Nenhum');
        setDamage('');
        setTarget('');
        setCastingTime('');
        setRange('');
        setDuration('');
    }

    function onSlotsChange(ev: ChangeEvent<HTMLInputElement>) {
        const aux = ev.currentTarget.value;
        let newSlots = parseInt(aux);

        if (aux.length === 0) newSlots = 0;
        else if (isNaN(newSlots)) return;

        setSlots(newSlots);
    }

    return (
        <SheetModal title='Nova Magia' show={props.show} onHide={props.onHide} onExited={reset}
            applyButton={{
                name: 'Criar',
                onApply: () => props.onCreate(name, description, cost, type, damage, castingTime, range, duration, slots, target)
            }} scrollable>
            <Container fluid>
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
                    <Form.Control className='theme-element' value={type}
                        onChange={ev => setType(ev.currentTarget.value)} />
                </Form.Group>

                <Form.Group controlId='createSpellDamage' className='mb-3'>
                    <Form.Label>Dano</Form.Label>
                    <Form.Control className='theme-element' value={damage}
                        onChange={ev => setDamage(ev.currentTarget.value)} />
                </Form.Group>

                <Form.Group controlId='createSpellTarget' className='mb-3'>
                    <Form.Label>Alvo</Form.Label>
                    <Form.Control className='theme-element' value={target}
                        onChange={ev => setTarget(ev.currentTarget.value)} />
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

                <Form.Group controlId='createSpellSlots' className='mb-3'>
                    <Form.Label>Espaços</Form.Label>
                    <Form.Control className='theme-element' value={slots}
                        onChange={onSlotsChange} />
                </Form.Group>
            </Container>
        </SheetModal>
    );
}