import { Equipment, Skill } from '@prisma/client';
import { ChangeEvent, useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';
import config from '../../../../openrpg.config.json';

type EquipmentEditorFieldProps = {
    equipment: Equipment;
    skills: Skill[];
    onDelete(id: number): void;
}

export default function EquipmentEditorField(props: EquipmentEditorFieldProps) {
    const [lastName, name, setName] = useExtendedState(props.equipment.name);
    const [skillID, setSkillID] = useState(props.equipment.skill_id);
    const [type, setType] = useState(props.equipment.type);
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

    function skillChange(ev: ChangeEvent<HTMLSelectElement>) {
        const newID = parseInt(ev.currentTarget.value);
        setSkillID(newID);
        api.post('/sheet/equipment', { id: props.equipment.id, skillID: newID }).catch(err => {
            logError(err);
            setSkillID(skillID);
        });
    }

    function typeChange(ev: ChangeEvent<HTMLSelectElement>) {
        const newType = ev.currentTarget.value;
        setType(newType);
        api.post('/sheet/equipment', { id: props.equipment.id, type: newType }).catch(err => {
            logError(err);
            setType(type);
        });
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
        if (newAmmo < 0) newAmmo = 0;
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
            <td style={{ width: 50 }}>
                <Button onClick={() => props.onDelete(props.equipment.id)} size='sm' variant='dark'>
                    <BsTrash color='white' size={24} />
                </Button>
            </td>
            <td>
                <BottomTextInput value={name} onChange={ev => setName(ev.currentTarget.value)}
                    onBlur={onNameBlur} className='w-100' />
            </td>
            <td>
                <select className='theme-element w-100' value={skillID}
                    onChange={skillChange}>
                    {props.skills.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
                </select>
            </td>
            <td>
                <select className='theme-element w-100' value={type}
                    onChange={typeChange}>
                    {config.equipment.types.map((name, i) => <option key={i} value={name}>{name}</option>)}
                </select>
            </td>
            <td style={{ width: '10rem' }}>
                <BottomTextInput value={damage} onChange={ev => setDamage(ev.currentTarget.value)}
                    onBlur={onDamageBlur} className='w-100' />
            </td>
            <td style={{ width: '7.5rem' }}>
                <BottomTextInput value={range} onChange={ev => setRange(ev.currentTarget.value)}
                    onBlur={onRangeBlur} className='w-100' />
            </td>
            <td style={{ width: '5rem' }}>
                <BottomTextInput value={attacks} onChange={ev => setAttacks(ev.currentTarget.value)}
                    onBlur={onAttacksBlur} className='w-100' />
            </td>
            <td style={{ width: '3rem' }}>
                {ammo === null ? <>-</> :
                    <BottomTextInput type='number' value={ammo} onChange={onAmmoChange}
                        onBlur={onAmmoBlur} className='w-100' />}
            </td>
            <td style={{ width: 50 }}>
                <Form.Check checked={visible} onChange={onVisibleChange} />
            </td>
        </tr>
    );
}