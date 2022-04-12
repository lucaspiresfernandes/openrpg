import { Equipment } from '@prisma/client';
import { ChangeEvent, useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import FormCheck from 'react-bootstrap/FormCheck';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../../contexts';
import useExtendedState from '../../../../hooks/useExtendedState';
import api from '../../../../utils/api';
import BottomTextInput from '../../../BottomTextInput';

type EquipmentEditorFieldProps = {
    equipment: Equipment;
    onDelete(id: number): void;
}

export default function EquipmentEditorField(props: EquipmentEditorFieldProps) {
    const [lastName, name, setName] = useExtendedState(props.equipment.name);
    const [lastType, type, setType] = useExtendedState(props.equipment.type);
    const [lastDamage, damage, setDamage] = useExtendedState(props.equipment.damage);
    const [lastRange, range, setRange] = useExtendedState(props.equipment.range);
    const [lastAttacks, attacks, setAttacks] = useExtendedState(props.equipment.attacks);
    const [lastAmmo, ammo, setAmmo] = useExtendedState(props.equipment.ammo);
    const [visible, setVisible] = useState(props.equipment.visible);

    const logError = useContext(ErrorLogger);

    function onNameBlur() {
        if (name === lastName) return;
        setName(name);
        api.post('/sheet/equipment', { id: props.equipment.id, name }).catch(logError);
    }

    function onTypeBlur() {
        if (type === lastType) return;
        setType(type);
        api.post('/sheet/equipment', { id: props.equipment.id, type }).catch(logError);
    }

    function onDamageBlur() {
        if (damage === lastDamage) return;
        setDamage(damage);
        api.post('/sheet/equipment', { id: props.equipment.id, damage }).catch(logError);
    }

    function onRangeBlur() {
        if (range === lastRange) return;
        setRange(range);
        api.post('/sheet/equipment', { id: props.equipment.id, range }).catch(logError);
    }

    function onAttacksBlur() {
        if (attacks === lastAttacks) return;
        setAttacks(attacks);
        api.post('/sheet/equipment', { id: props.equipment.id, attacks }).catch(logError);
    }

    function onAmmoChange(ev: ChangeEvent<HTMLInputElement>) {
        const aux = ev.currentTarget.value;
        let newAmmo = parseInt(aux);

        if (aux.length === 0) newAmmo = 0;
        else if (isNaN(newAmmo)) return;

        setAmmo(newAmmo);
    }

    function onAmmoBlur() {
        if (ammo === lastAmmo) return;
        setAmmo(ammo);
        api.post('/sheet/equipment', { id: props.equipment.id, ammo }).catch(logError);
    }

    function onVisibleChange() {
        const newVisible = !visible;
        setVisible(newVisible);
        api.post('/sheet/equipment', { id: props.equipment.id, visible: newVisible }).catch(err => {
            setVisible(visible);
            logError(err);
        });
    }

    return (
        <tr>
            <td>
                <Button onClick={() => props.onDelete(props.equipment.id)} size='sm' variant='secondary'>
                    <BsTrash color='white' size={24} />
                </Button>
            </td>
            <td>
                <BottomTextInput value={name} onChange={ev => setName(ev.currentTarget.value)}
                    onBlur={onNameBlur} />
            </td>
            <td>
                <BottomTextInput value={type} onChange={ev => setType(ev.currentTarget.value)}
                    onBlur={onTypeBlur} />
            </td>
            <td>
                <BottomTextInput value={damage} onChange={ev => setDamage(ev.currentTarget.value)}
                    onBlur={onDamageBlur} className='text-center' style={{ maxWidth: '7.5rem' }} />
            </td>
            <td>
                <BottomTextInput value={range} onChange={ev => setRange(ev.currentTarget.value)}
                    onBlur={onRangeBlur} className='text-center' style={{ maxWidth: '7.5rem' }} />
            </td>
            <td>
                <BottomTextInput value={attacks} onChange={ev => setAttacks(ev.currentTarget.value)}
                    onBlur={onAttacksBlur} className='text-center' style={{ maxWidth: '5rem' }} />
            </td>
            <td>
                {ammo === null ? '-' :
                    <BottomTextInput value={ammo} onChange={onAmmoChange}
                        onBlur={onAmmoBlur} style={{ maxWidth: '3rem' }} className='text-center' />}
            </td>
            <td>
                <FormCheck checked={visible} onChange={onVisibleChange} />
            </td>
        </tr>
    );
}