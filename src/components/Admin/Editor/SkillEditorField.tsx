import { Skill, Specialization } from '@prisma/client';
import { ChangeEvent, useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';

type SkillEditorFieldProps = {
    skill: Skill;
    specializations: Specialization[];
    onDelete(id: number): void;
}

export default function SkillEditorField(props: SkillEditorFieldProps) {
    const [lastName, name, setName] = useExtendedState(props.skill.name);
    const [specializationID, setSpecializationID] = useState(props.skill.specialization_id);
    const [mandatory, setMandatory] = useState(props.skill.mandatory);
    const logError = useContext(ErrorLogger);

    function onBlur() {
        if (name === lastName) return;
        setName(name);
        api.post('/sheet/skill', { id: props.skill.id, name }).catch(logError);
    }

    function specializationChange(ev: ChangeEvent<HTMLSelectElement>) {
        const sID = parseInt(ev.currentTarget.value);
        setSpecializationID(sID);
        api.post('/sheet/skill', { id: props.skill.id, specializationID: sID }).catch(err => {
            logError(err);
            setSpecializationID(specializationID);
        });
    }

    function mandatoryChange() {
        const newMandatory = !mandatory;
        setMandatory(newMandatory);
        api.post('/sheet/skill', { id: props.skill.id, mandatory: newMandatory }).catch(err => {
            setMandatory(mandatory);
            logError(err);
        });
    }

    return (
        <tr>
            <td>
                <Button onClick={() => props.onDelete(props.skill.id)} size='sm' variant='secondary'>
                    <BsTrash color='white' size={24} />
                </Button>
            </td>
            <td>
                <BottomTextInput value={name} onChange={ev => setName(ev.currentTarget.value)}
                    onBlur={onBlur} />
            </td>
            <td>
                <select className='theme-element' value={specializationID || 0}
                    onChange={specializationChange}>
                    <option value={0}>Nenhuma</option>
                    {props.specializations.map(attr => <option key={attr.id} value={attr.id}>{attr.name}</option>)}
                </select>
            </td>
            <td>
                <Form.Check checked={mandatory} onChange={mandatoryChange} />
            </td>
        </tr>
    );
}