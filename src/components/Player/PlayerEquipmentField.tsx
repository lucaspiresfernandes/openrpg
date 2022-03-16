import { FormEvent, useContext, useState } from 'react';
import { Button, Form, Image } from 'react-bootstrap';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';
import { ErrorLogger, ShowDiceResult } from '../../contexts';
import { BsTrash } from 'react-icons/bs';

type PlayerEquipmentFieldProps = {
    currentAmmo: number;
    using: boolean;
    equipment: {
        id: number;
        ammo: number | null;
        attacks: string;
        damage: string;
        name: string;
        range: string;
        type: string;
        Skill: {
            name: string;
        };
    };
    onDelete(id: number): void
};

export default function PlayerEquipmentField(props: PlayerEquipmentFieldProps) {
    const [using, setUsing] = useState(props.using);
    const [lastAmmo, currentAmmo, setCurrentAmmo] = useExtendedState(props.currentAmmo);
    const [disabled, setDisabled] = useState(false);

    const logError = useContext(ErrorLogger);
    const showDiceRollResult = useContext(ShowDiceResult);
    const equipmentID = props.equipment.id;

    function usingChange() {
        const _using = !using;
        setUsing(_using);
        api.post('/sheet/player/equipment', { id: equipmentID, using: _using }).catch(err => {
            logError(err);
            setUsing(using);
        });
    }

    function onAmmoChange(ev: FormEvent<HTMLInputElement>) {
        const aux = ev.currentTarget.value;
        let newAmmo = parseInt(aux);

        if (aux.length === 0) newAmmo = 0;
        else if (isNaN(newAmmo)) return;

        setCurrentAmmo(newAmmo);
    }

    function onAmmoBlur() {
        if (currentAmmo === lastAmmo) return;
        setCurrentAmmo(currentAmmo);
        api.post('/sheet/player/equipment', { id: equipmentID, currentAmmo }).catch(err => {
            logError(err);
            setCurrentAmmo(lastAmmo);
        });
    }

    function diceRoll() {
        if (!using) return alert('Você não está usando esse equipamento.');
        if (props.equipment.ammo && currentAmmo === 0)
            return alert('Você não tem munição suficiente.');
        setCurrentAmmo(currentAmmo - 1);
        showDiceRollResult(props.equipment.damage);
    }

    function deleteEquipment() {
        if (!confirm('Você realmente deseja excluir esse equipamento?')) return;
        setDisabled(true);
        props.onDelete(equipmentID);
        api.delete('/sheet/player/equipment', {
            data: { id: equipmentID }
        }).then(() => props.onDelete(equipmentID)).catch(err => {
            logError(err);
            setDisabled(false);
        });
    }

    return (
        <tr>
            <td>
                <Button onClick={deleteEquipment} disabled={disabled} size='sm' variant='dark'>
                    <BsTrash color='white' size={24} />
                </Button>
            </td>
            <td>
                <Form.Check onChange={usingChange} checked={using} />
            </td>
            <td>{props.equipment.name}</td>
            <td>{props.equipment.Skill.name}</td>
            <td>{props.equipment.type}</td>
            <td>{props.equipment.damage}</td>
            <td>
                <Image alt='Dado' src='/dice20.png' className='clickable' onClick={diceRoll}
                    style={{ maxHeight: '2rem' }} />
            </td>
            <td>{props.equipment.range}</td>
            <td>{props.equipment.attacks}</td>
            <td>{props.equipment.ammo ?
                <BottomTextInput className='text-center' value={currentAmmo}
                    onChange={onAmmoChange} onBlur={onAmmoBlur} /> :
                '-'}</td>
            <td>{props.equipment.ammo || '-'}</td>
        </tr>
    );
}