import { ChangeEvent, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormCheck from 'react-bootstrap/FormCheck';
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
                <FormGroup controlId='createEquipmentName' className='mb-3'>
                    <FormLabel>Nome</FormLabel>
                    <FormControl className='theme-element' value={name} onChange={ev => setName(ev.currentTarget.value)} />
                </FormGroup>

                <FormGroup controlId='createEquipmentType' className='mb-3'>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl className='theme-element' value={type} onChange={ev => setType(ev.currentTarget.value)} />
                </FormGroup>

                <FormGroup controlId='createEquipmentDamage' className='mb-3'>
                    <FormLabel>Dano</FormLabel>
                    <FormControl className='theme-element' value={damage} onChange={ev => setDamage(ev.currentTarget.value)} />
                </FormGroup>

                <FormGroup controlId='createEquipmentRange' className='mb-3'>
                    <FormLabel>Alcance</FormLabel>
                    <FormControl className='theme-element' value={range} onChange={ev => setRange(ev.currentTarget.value)} />
                </FormGroup>

                <FormGroup controlId='createEquipmentAttacks' className='mb-3'>
                    <FormLabel>Ataques</FormLabel>
                    <FormControl className='theme-element' value={attacks} onChange={ev => setAttacks(ev.currentTarget.value)} />
                </FormGroup>

                <FormGroup controlId='createCharacteristicRollable'>
                    <FormCheck inline
                        checked={ammo !== null} onChange={() => setAmmo(ammo => {
                            if (ammo === null) ammo = 0;
                            else ammo = null;
                            return ammo;
                        })} />
                    <FormLabel>Possui munição?</FormLabel>
                </FormGroup>
                {ammo != null &&
                    <FormGroup controlId='createEquipmentAmmo' className='mb-3'>
                        <FormLabel>Munição</FormLabel>
                        <FormControl className='theme-element' value={ammo || ''} onChange={onAmmoChange} />
                    </FormGroup>
                }
            </Container>
        </SheetModal>
    );
}