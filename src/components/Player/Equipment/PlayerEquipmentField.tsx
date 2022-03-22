import { FormEvent, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';
import { ErrorLogger, ShowDiceResult } from '../../../contexts';
import { BsTrash } from 'react-icons/bs';

type PlayerEquipmentFieldProps = {
    currentAmmo: number;
    equipment: {
        id: number;
        ammo: number | null;
        attacks: string;
        damage: string;
        name: string;
        range: string;
        type: string;
    };
    onDelete(id: number): void
};

export default function PlayerEquipmentField(props: PlayerEquipmentFieldProps) {
    const [lastAmmo, currentAmmo, setCurrentAmmo] = useExtendedState(props.currentAmmo);

    const logError = useContext(ErrorLogger);
    const showDiceRollResult = useContext(ShowDiceResult);
    const equipmentID = props.equipment.id;

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
        if (props.equipment.ammo && currentAmmo === 0)
            return alert('Você não tem munição suficiente.');
        setCurrentAmmo(currentAmmo - 1);
        showDiceRollResult(props.equipment.damage);
    }

    function deleteEquipment() {
        if (!confirm('Você realmente deseja excluir esse equipamento?')) return;
        api.delete('/sheet/player/equipment', {
            data: { id: equipmentID }
        }).then(() => props.onDelete(equipmentID)).catch(logError);
    }

    return (
        <tr>
            <td>
                <Button onClick={deleteEquipment} size='sm' variant='secondary'>
                    <BsTrash color='white' size={24} />
                </Button>
            </td>
            <td>{props.equipment.name}</td>
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
                    onChange={onAmmoChange} onBlur={onAmmoBlur} style={{ maxWidth: '3rem' }} /> :
                '-'}</td>
            <td>{props.equipment.ammo || '-'}</td>
        </tr>
    );
}