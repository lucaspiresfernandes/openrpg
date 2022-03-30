import { Skill } from '@prisma/client';
import { ChangeEvent, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import SheetModal from './SheetModal';

type CreateEquipmentModalProps = {
    onCreate(name: string, type: string, damage: string, range: string, attacks: string, ammo: number | null): void;
    show: boolean;
    onHide(): void;
}

export default function CreateEquipmentModal(props: CreateEquipmentModalProps) {
    const [name, setName] = useState('');
    const [type, setType] = useState('Comum');
    const [damage, setDamage] = useState('');
    const [range, setRange] = useState('');
    const [attacks, setAttacks] = useState('');
    const [ammo, setAmmo] = useState<number | null>(0);

    function reset() {
        setName('');
        setType('Comum');
        setDamage('');
        setRange('');
        setAttacks('');
        setAmmo(0);
    }

    function onAmmoChange(ev: ChangeEvent<HTMLInputElement>) {
        if (ammo === null) return;

        const aux = ev.currentTarget.value;
        let newAmmo = parseInt(aux);

        if (aux.length === 0) newAmmo = 0;
        else if (isNaN(newAmmo)) return;

        setAmmo(newAmmo);
    }

    return (
        <SheetModal title='Novo Equipamento' show={props.show} onHide={props.onHide} onExited={reset}
            applyButton={{
                name: 'Criar',
                onApply: () => props.onCreate(name, type, damage, range, attacks, ammo)
            }} scrollable>
            <Container fluid>
                <Form.Group controlId='createEquipmentName' className='mb-3'>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control className='theme-element' value={name} onChange={ev => setName(ev.currentTarget.value)} />
                </Form.Group>

                <Form.Group controlId='createEquipmentType' className='mb-3'>
                    <Form.Label>Tipo</Form.Label>
                    <Form.Control className='theme-element' value={type} onChange={ev => setType(ev.currentTarget.value)} />
                </Form.Group>

                <Form.Group controlId='createEquipmentDamage' className='mb-3'>
                    <Form.Label>Dano</Form.Label>
                    <Form.Control className='theme-element' value={damage} onChange={ev => setDamage(ev.currentTarget.value)} />
                </Form.Group>

                <Form.Group controlId='createEquipmentRange' className='mb-3'>
                    <Form.Label>Alcance</Form.Label>
                    <Form.Control className='theme-element' value={range} onChange={ev => setRange(ev.currentTarget.value)} />
                </Form.Group>

                <Form.Group controlId='createEquipmentAttacks' className='mb-3'>
                    <Form.Label>Ataques</Form.Label>
                    <Form.Control className='theme-element' value={attacks} onChange={ev => setAttacks(ev.currentTarget.value)} />
                </Form.Group>

                <Form.Group controlId='createCharacteristicRollable'>
                    <Form.Check inline
                        checked={ammo !== null} onChange={() => setAmmo(ammo => {
                            if (ammo === null) ammo = 0;
                            else ammo = null;
                            return ammo;
                        })} />
                    <Form.Label>Possui munição?</Form.Label>
                </Form.Group>
                {ammo != null &&
                    <Form.Group controlId='createEquipmentAmmo' className='mb-3'>
                        <Form.Label>Munição</Form.Label>
                        <Form.Control className='theme-element' value={ammo || ''} onChange={onAmmoChange} />
                    </Form.Group>
                }
            </Container>
        </SheetModal>
    );
}