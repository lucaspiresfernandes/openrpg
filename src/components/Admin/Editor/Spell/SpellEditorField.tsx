import { Spell } from '@prisma/client';
import { ChangeEvent, useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../../contexts';
import useExtendedState from '../../../../hooks/useExtendedState';
import api from '../../../../utils/api';
import BottomTextInput from '../../../BottomTextInput';
import config from '../../../../../openrpg.config.json';

type SpellEditorFieldProps = {
    spell: Spell;
    onDelete(id: number): void;
}

export default function SpellEditorField({ spell, onDelete }: SpellEditorFieldProps) {
    const logError = useContext(ErrorLogger);
    const [lastName, name, setName] = useExtendedState(spell.name);
    const [lastDescription, description, setDescription] = useExtendedState(spell.description);
    const [lastCost, cost, setCost] = useExtendedState(spell.cost);
    const [type, setType] = useState(spell.type);
    const [lastDamage, damage, setDamage] = useExtendedState(spell.damage);
    const [lastCastingTime, castingTime, setCastingTime] = useExtendedState(spell.castingTime);
    const [lastRange, range, setRange] = useExtendedState(spell.range);
    const [lastDuration, duration, setDuration] = useExtendedState(spell.duration);
    const [lastSlots, slots, setSlots] = useExtendedState(spell.slots);
    const [visible, setVisible] = useState(spell.visible);

    function onNameBlur() {
        if (name === lastName) return;
        setName(name);
        api.post('/sheet/spell', { id: spell.id, name }).catch(logError);
    }

    function onDescriptionBlur() {
        if (description === lastDescription) return;
        setDescription(description);
        api.post('/sheet/spell', { id: spell.id, description }).catch(logError);
    }

    function onCostBlur() {
        if (cost === lastCost) return;
        setCost(cost);
        api.post('/sheet/spell', { id: spell.id, cost }).catch(logError);
    }

    function onTypeChange(ev: ChangeEvent<HTMLSelectElement>) {
        const newType = ev.currentTarget.value;
        setType(newType);
        api.post('/sheet/spell', { id: spell.id, type: newType }).catch(err => {
            logError(err);
            setType(type);
        });
    }

    function onDamageBlur() {
        if (damage === lastDamage) return;
        setDamage(damage);
        api.post('/sheet/spell', { id: spell.id, damage }).catch(logError);
    }

    function onCastingTimeBlur() {
        if (castingTime === lastCastingTime) return;
        setCastingTime(castingTime);
        api.post('/sheet/spell', { id: spell.id, castingTime }).catch(logError);
    }

    function onRangeBlur() {
        if (range === lastRange) return;
        setRange(range);
        api.post('/sheet/spell', { id: spell.id, range }).catch(logError);
    }

    function onDurationBlur() {
        if (duration === lastDuration) return;
        setDuration(duration);
        api.post('/sheet/spell', { id: spell.id, duration }).catch(logError);
    }

    function onSlotsChange(ev: ChangeEvent<HTMLInputElement>) {
        const aux = ev.currentTarget.value;
        let newSlots = parseInt(aux);

        if (aux.length === 0) newSlots = 0;
        else if (isNaN(newSlots)) return;

        setSlots(newSlots);
    }

    function onSlotsBlur() {
        if (slots === lastSlots) return;
        setSlots(slots);
        api.post('/sheet/spell', { id: spell.id, slots }).catch(logError);
    }

    function onVisibleChange() {
        const newVisible = !visible;
        setVisible(newVisible);
        api.post('/sheet/spell', { id: spell.id, visible: newVisible }).catch(err => {
            setVisible(visible);
            logError(err);
        });
    }

    return (
        <tr>
            <td>
                <Button onClick={() => onDelete(spell.id)} size='sm' variant='secondary'>
                    <BsTrash color='white' size={24} />
                </Button>
            </td>
            <td>
                <BottomTextInput value={name} onChange={ev => setName(ev.currentTarget.value)}
                    onBlur={onNameBlur} />
            </td>
            <td>
                <BottomTextInput value={description} onChange={ev => setDescription(ev.currentTarget.value)}
                    onBlur={onDescriptionBlur} />
            </td>
            <td>
                <BottomTextInput value={cost} onChange={ev => setCost(ev.currentTarget.value)}
                    onBlur={onCostBlur} style={{ maxWidth: '5rem' }} className='text-center' />
            </td>
            <td>
                <select className='theme-element' value={type}
                    onChange={onTypeChange}>
                    {config.spell.types.map((name, i) => <option key={i} value={name}>{name}</option>)}
                </select>
            </td>
            <td>
                <BottomTextInput value={damage} onChange={ev => setDamage(ev.currentTarget.value)}
                    onBlur={onDamageBlur} style={{ maxWidth: '5rem' }} className='text-center' />
            </td>
            <td>
                <BottomTextInput value={castingTime} onChange={ev => setCastingTime(ev.currentTarget.value)}
                    onBlur={onCastingTimeBlur} style={{ maxWidth: '6rem' }} className='text-center' />
            </td>
            <td>
                <BottomTextInput value={range} onChange={ev => setRange(ev.currentTarget.value)}
                    onBlur={onRangeBlur} style={{ maxWidth: '5rem' }} className='text-center' />
            </td>
            <td>
                <BottomTextInput value={duration} onChange={ev => setDuration(ev.currentTarget.value)}
                    onBlur={onDurationBlur} style={{ maxWidth: '6rem' }} className='text-center' />
            </td>
            <td>
                <BottomTextInput value={slots} onChange={onSlotsChange}
                    onBlur={onSlotsBlur} style={{ maxWidth: '6rem' }} className='text-center' />
            </td>
            <td>
                <Form.Check checked={visible} onChange={onVisibleChange} style={{ maxWidth: '3rem' }} />
            </td>
        </tr>
    );
}